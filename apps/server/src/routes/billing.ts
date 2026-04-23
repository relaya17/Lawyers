import { Router, type Request, type Response } from 'express';
import express from 'express';
import type Stripe from 'stripe';
import { z } from 'zod';
import { requireAuth } from '../middleware/requireAuth.js';
import {
  createBillingPortalSession,
  createCheckoutSession,
  getEntitlements,
  recordQuestionAttempt,
  syncSubscriptionFromStripe,
} from '../billing/billingService.js';
import { getStripe, isStripeConfigured } from '../billing/stripeClient.js';
import { PLANS, type PlanId } from '../billing/plans.js';
import { getPromoSummaryForApi } from '../billing/promoConfig.js';
import { findUserIdByCustomerId, markWebhookProcessed } from '../billing/billingRepo.js';
import { captureServerEvent } from '../analytics/posthogServer.js';

export const billingRouter: Router = Router();

// ───────────────────────────────────────────────────────────
// GET /billing/plans — public, used by /pricing page
// ───────────────────────────────────────────────────────────
billingRouter.get('/plans', (_req, res) => {
  const plans = Object.values(PLANS).map((p) => ({
    id: p.id,
    displayName: p.displayName,
    displayNameHe: p.displayNameHe,
    monthlyPriceIls: p.monthlyPriceIls,
    features: p.features,
    entitlements: {
      ...p.entitlements,
      monthlyQuestionQuota:
        p.entitlements.monthlyQuestionQuota === Infinity
          ? null
          : p.entitlements.monthlyQuestionQuota,
    },
    available: p.id === 'free' || Boolean(p.stripePriceId),
  }));
  res.json({ plans, stripeConfigured: isStripeConfigured(), promo: getPromoSummaryForApi() });
});

// ───────────────────────────────────────────────────────────
// GET /billing/entitlements — current user's plan + flags
// ───────────────────────────────────────────────────────────
billingRouter.get('/entitlements', requireAuth, async (req, res) => {
  const user = req.authUser!;
  const ent = await getEntitlements(user.id);
  res.json({
    plan: ent.plan,
    status: ent.status,
    currentPeriodEnd: ent.currentPeriodEnd,
    cancelAtPeriodEnd: ent.cancelAtPeriodEnd,
    dailyQuestions: ent.dailyQuestions,
    promoActive: ent.promoActive,
    promoEndsAt: ent.promoEndsAt,
    dailyAiCalls: ent.dailyAiCalls,
    entitlements: {
      ...ent.entitlements,
      monthlyQuestionQuota:
        ent.entitlements.monthlyQuestionQuota === Infinity
          ? null
          : ent.entitlements.monthlyQuestionQuota,
    },
  });
});

// POST /billing/usage/question — רישום שאלה (מגבלת Free: 20/יום)
billingRouter.post('/usage/question', requireAuth, async (req, res) => {
  const user = req.authUser!;
  const out = await recordQuestionAttempt(user.id);
  if (!out.ok) {
    res.status(429).json({
      error: 'הגעת למגבלת השאלות היומית. שדרגי ל-Student Pro ללא הגבלה.',
      code: 'DAILY_QUESTION_LIMIT',
      used: out.used,
      limit: out.limit,
    });
    return;
  }
  res.json({ ok: true, used: out.used, limit: out.limit });
});

// ───────────────────────────────────────────────────────────
// POST /billing/checkout — create Stripe Checkout Session
// ───────────────────────────────────────────────────────────
const CheckoutBody = z.object({
  plan: z.enum(['pro', 'premium']),
  successUrl: z.string().url().optional(),
  cancelUrl: z.string().url().optional(),
});

billingRouter.post('/checkout', requireAuth, async (req, res) => {
  const user = req.authUser!;
  const body = CheckoutBody.parse(req.body);
  const planDef = PLANS[body.plan as PlanId];
  if (!planDef.stripePriceId) {
    res.status(400).json({ error: 'Stripe Price ID not configured for this plan' });
    return;
  }
  const origin = req.headers.origin ?? process.env.CLIENT_ORIGIN ?? 'http://localhost:5852';
  const result = await createCheckoutSession({
    user: {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    },
    priceId: planDef.stripePriceId,
    successUrl: body.successUrl ?? `${origin}/billing/success?session_id={CHECKOUT_SESSION_ID}`,
    cancelUrl: body.cancelUrl ?? `${origin}/pricing`,
  });
  res.json(result);
});

// ───────────────────────────────────────────────────────────
// POST /billing/portal — Stripe Billing Portal (manage / cancel)
// ───────────────────────────────────────────────────────────
billingRouter.post('/portal', requireAuth, async (req, res) => {
  const user = req.authUser!;
  const origin = req.headers.origin ?? process.env.CLIENT_ORIGIN ?? 'http://localhost:5852';
  const result = await createBillingPortalSession({
    user: {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    },
    returnUrl: `${origin}/account/billing`,
  });
  res.json(result);
});

// ───────────────────────────────────────────────────────────
// POST /billing/webhook — Stripe → us. MUST use raw body.
// NOTE: this route is registered separately in index.ts with
// express.raw({ type: 'application/json' }) before express.json().
// ───────────────────────────────────────────────────────────
export async function stripeWebhookHandler(req: Request, res: Response): Promise<void> {
  const signature = req.headers['stripe-signature'];
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!signature || !secret) {
    res.status(400).send('Missing signature or STRIPE_WEBHOOK_SECRET');
    return;
  }
  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(req.body as Buffer, signature, secret);
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'signature verification failed';
    res.status(400).send(`Webhook Error: ${msg}`);
    return;
  }

  const firstTime = await markWebhookProcessed(event.id, event.type);
  if (!firstTime) {
    res.json({ received: true, duplicate: true });
    return;
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.client_reference_id ?? (session.metadata?.userId ?? null);
        if (session.subscription && userId) {
          const sub = await getStripe().subscriptions.retrieve(session.subscription as string);
          await syncSubscriptionFromStripe(userId, sub);
          captureServerEvent({
            distinctId: userId,
            event: 'checkout.completed_server',
            properties: {
              stripe_subscription_id: sub.id,
              amount_total: session.amount_total ?? null,
              currency: session.currency ?? null,
            },
          });
        }
        break;
      }
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
      case 'customer.subscription.deleted': {
        const sub = event.data.object as Stripe.Subscription;
        const userId =
          (sub.metadata?.userId as string | undefined) ??
          (await findUserIdByCustomerId(sub.customer as string));
        if (userId) {
          await syncSubscriptionFromStripe(userId, sub);
          captureServerEvent({
            distinctId: userId,
            event: `subscription.${event.type.split('.').pop() ?? 'updated'}`,
            properties: {
              stripe_subscription_id: sub.id,
              status: sub.status,
              cancel_at_period_end: sub.cancel_at_period_end,
            },
          });
        }
        break;
      }
      default:
        break;
    }
    res.json({ received: true });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'handler failed';
    res.status(500).json({ error: msg });
  }
}

// Mount the webhook at /billing/webhook with raw body (for mounting from index.ts)
export const stripeWebhookMiddleware = express.raw({ type: 'application/json' });

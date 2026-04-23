import type Stripe from 'stripe';
import { getStripe } from './stripeClient.js';
import {
  findCustomerByUserId,
  upsertCustomer,
  findActiveSubscription,
  upsertSubscription,
} from './billingRepo.js';
import { PLANS, planFromStatus, type PlanId, getPlanByPriceId, type PlanDefinition } from './plans.js';
import {
  getDailyQuestionCount,
  incrementDailyQuestionCount,
  getDailyAiCount,
  incrementDailyAiCount,
  todayJerusalem,
} from './billingUsageRepo.js';
import {
  getPromoEndsAtIso,
  getPromoFreeAiDailyLimit,
  isPromoActive,
} from './promoConfig.js';

export interface AuthedUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}

/** Get-or-create Stripe Customer for a user. */
export async function ensureStripeCustomer(user: AuthedUser): Promise<string> {
  const existing = await findCustomerByUserId(user.id);
  if (existing) return existing.stripe_customer_id;

  const stripe = getStripe();
  const customer = await stripe.customers.create({
    email: user.email,
    name: `${user.firstName} ${user.lastName}`.trim() || undefined,
    metadata: { userId: user.id },
  });
  await upsertCustomer(user.id, customer.id);
  return customer.id;
}

/** Create a Stripe Checkout Session for a subscription purchase. */
export async function createCheckoutSession(params: {
  user: AuthedUser;
  priceId: string;
  successUrl: string;
  cancelUrl: string;
}): Promise<{ url: string; sessionId: string }> {
  const stripe = getStripe();
  const customerId = await ensureStripeCustomer(params.user);
  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    customer: customerId,
    line_items: [{ price: params.priceId, quantity: 1 }],
    success_url: params.successUrl,
    cancel_url: params.cancelUrl,
    allow_promotion_codes: true,
    client_reference_id: params.user.id,
    subscription_data: { metadata: { userId: params.user.id } },
  });
  if (!session.url) throw new Error('Stripe did not return checkout URL');
  return { url: session.url, sessionId: session.id };
}

/** Create a Stripe Billing Portal session (manage / cancel subscription). */
export async function createBillingPortalSession(params: {
  user: AuthedUser;
  returnUrl: string;
}): Promise<{ url: string }> {
  const stripe = getStripe();
  const customerId = await ensureStripeCustomer(params.user);
  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: params.returnUrl,
  });
  return { url: session.url };
}

/** Persist a Stripe subscription snapshot into Postgres. */
export async function syncSubscriptionFromStripe(
  userId: string,
  sub: Stripe.Subscription,
): Promise<void> {
  const item = sub.items.data[0];
  if (!item) return;
  const priceId = item.price.id;
  const planDef = getPlanByPriceId(priceId);
  // Stripe API 2025+: period boundaries moved from the subscription to each item.
  const periodStartSec = item.current_period_start;
  const periodEndSec = item.current_period_end;
  await upsertSubscription({
    userId,
    stripeSubscriptionId: sub.id,
    stripePriceId: priceId,
    plan: planDef?.id ?? 'pro',
    status: sub.status,
    currentPeriodStart: periodStartSec ? new Date(periodStartSec * 1000) : null,
    currentPeriodEnd: periodEndSec ? new Date(periodEndSec * 1000) : null,
    cancelAtPeriodEnd: sub.cancel_at_period_end,
    trialEndsAt: sub.trial_end ? new Date(sub.trial_end * 1000) : null,
  });
}

export interface EntitlementSnapshot {
  plan: PlanId;
  status: string; // 'active' | 'trialing' | 'past_due' | 'canceled' | 'none'
  currentPeriodEnd: Date | null;
  cancelAtPeriodEnd: boolean;
  entitlements: PlanDefinition['entitlements'];
  dailyQuestions: { used: number; limit: number | null };
  promoActive: boolean;
  promoEndsAt: string | null;
  /** Free במבצע: מכסה יומית; Pro/Premium: limit null */
  dailyAiCalls: { used: number; limit: number | null };
}

/** Free + מבצע השקה ← יכולות Pro, בלי realCaseImport / contractRiskAnalysis */
export function mergePromoEntitlements(
  plan: PlanId,
  base: PlanDefinition['entitlements'],
): PlanDefinition['entitlements'] {
  if (plan !== 'free' || !isPromoActive()) return base;
  const pro = PLANS.pro.entitlements;
  return {
    ...pro,
    realCaseImport: false,
    contractRiskAnalysis: false,
  };
}

export type ConsumeAiResult =
  | { ok: true; used: number; limit: number | null }
  | { ok: false; reason: 'payment_required' }
  | { ok: false; reason: 'promo_ai_limit'; used: number; limit: number };

/**
 * רישום קריאת AI אחת (בדרך כלל דרך middleware אחרי requireAuth).
 * Pro/Premium: תמיד ok. Free בלי מבצע: תשלום. Free במבצע: מונה יומי.
 */
export async function consumeAiCallIfNeeded(userId: string): Promise<ConsumeAiResult> {
  const row = await findActiveSubscription(userId);
  const plan = planFromStatus(row?.status, row?.plan);
  if (plan !== 'free') {
    return { ok: true, used: 0, limit: null };
  }
  if (!isPromoActive()) {
    return { ok: false, reason: 'payment_required' };
  }
  const limit = getPromoFreeAiDailyLimit();
  const date = todayJerusalem();
  const current = await getDailyAiCount(userId, date);
  if (current >= limit) {
    return { ok: false, reason: 'promo_ai_limit', used: current, limit };
  }
  const used = await incrementDailyAiCount(userId, date);
  return { ok: true, used, limit };
}

/** Read current entitlements for a user (derived from DB, not Stripe). */
export async function getEntitlements(userId: string): Promise<EntitlementSnapshot> {
  const row = await findActiveSubscription(userId);
  const plan = planFromStatus(row?.status, row?.plan);
  const merged = mergePromoEntitlements(plan, PLANS[plan].entitlements);
  const limit = merged.dailyQuestionLimit;
  let used = 0;
  if (limit != null) {
    try {
      used = await getDailyQuestionCount(userId, todayJerusalem());
    } catch {
      used = 0;
    }
  }

  const promoActive = isPromoActive();
  const promoEndsAt = getPromoEndsAtIso();
  let aiUsed = 0;
  let aiLimit: number | null = null;
  if (plan === 'free') {
    if (promoActive) {
      aiLimit = getPromoFreeAiDailyLimit();
      try {
        aiUsed = await getDailyAiCount(userId, todayJerusalem());
      } catch {
        aiUsed = 0;
      }
    } else {
      aiLimit = 0;
    }
  }

  return {
    plan,
    status: row?.status ?? 'none',
    currentPeriodEnd: row?.current_period_end ?? null,
    cancelAtPeriodEnd: row?.cancel_at_period_end ?? false,
    entitlements: merged,
    dailyQuestions: { used, limit },
    promoActive,
    promoEndsAt,
    dailyAiCalls: { used: aiUsed, limit: aiLimit },
  };
}

/** רישום ניסיון שאלה אחד (מגביל רק ב-Free עם dailyQuestionLimit). */
export async function recordQuestionAttempt(userId: string): Promise<{
  ok: boolean;
  used: number;
  limit: number | null;
}> {
  const row = await findActiveSubscription(userId);
  const plan = planFromStatus(row?.status, row?.plan);
  const merged = mergePromoEntitlements(plan, PLANS[plan].entitlements);
  const limit = merged.dailyQuestionLimit;
  const date = todayJerusalem();

  if (limit == null) {
    return { ok: true, used: 0, limit: null };
  }

  const current = await getDailyQuestionCount(userId, date);
  if (current >= limit) {
    return { ok: false, used: current, limit };
  }
  const used = await incrementDailyQuestionCount(userId, date);
  return { ok: true, used, limit };
}

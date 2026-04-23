import { authJson, authJsonWithBearer } from '@/features/auth/api/authHttp'
import type { BillingPromoSummary, EntitlementsResponse, Plan, PlanId } from '../types'

/** Public — no auth required. Lists the pricing plans. */
export async function fetchPlans(): Promise<{
  plans: Plan[]
  stripeConfigured: boolean
  promo?: BillingPromoSummary
}> {
  return authJson<{
    plans: Plan[]
    stripeConfigured: boolean
    promo?: BillingPromoSummary
  }>('/billing/plans', {
    method: 'GET',
  })
}

/** Authenticated — returns current user's plan + entitlement flags. */
export async function fetchEntitlements(accessToken: string): Promise<EntitlementsResponse> {
  return authJsonWithBearer<EntitlementsResponse>('/billing/entitlements', accessToken, {
    method: 'GET',
  })
}

/** רישום ניסיון שאלה אחד (מגבלת Free בשרת). */
export async function recordQuestionUsage(accessToken: string): Promise<void> {
  await authJsonWithBearer<{ ok: boolean }>('/billing/usage/question', accessToken, {
    method: 'POST',
    body: JSON.stringify({}),
  })
}

/** Creates a Stripe Checkout session and returns its URL. */
export async function createCheckout(params: {
  accessToken: string
  plan: Exclude<PlanId, 'free'>
}): Promise<{ url: string; sessionId: string }> {
  return authJsonWithBearer<{ url: string; sessionId: string }>(
    '/billing/checkout',
    params.accessToken,
    {
      method: 'POST',
      body: JSON.stringify({ plan: params.plan }),
    },
  )
}

/** Creates a Stripe Billing Portal session (manage / cancel). */
export async function createBillingPortal(accessToken: string): Promise<{ url: string }> {
  return authJsonWithBearer<{ url: string }>('/billing/portal', accessToken, {
    method: 'POST',
    body: JSON.stringify({}),
  })
}

import { getAuthPool } from '../db/pgPool.js';

export interface BillingCustomerRow {
  user_id: string;
  stripe_customer_id: string;
}

export interface BillingSubscriptionRow {
  id: string;
  user_id: string;
  stripe_subscription_id: string;
  stripe_price_id: string;
  plan: string;
  status: string;
  current_period_start: Date | null;
  current_period_end: Date | null;
  cancel_at_period_end: boolean;
  trial_ends_at: Date | null;
}

export async function findCustomerByUserId(userId: string): Promise<BillingCustomerRow | null> {
  const { rows } = await getAuthPool().query<BillingCustomerRow>(
    'SELECT user_id, stripe_customer_id FROM billing_customers WHERE user_id = $1',
    [userId],
  );
  return rows[0] ?? null;
}

export async function upsertCustomer(userId: string, stripeCustomerId: string): Promise<void> {
  await getAuthPool().query(
    `INSERT INTO billing_customers (user_id, stripe_customer_id)
     VALUES ($1, $2)
     ON CONFLICT (user_id) DO UPDATE SET stripe_customer_id = EXCLUDED.stripe_customer_id, updated_at = now()`,
    [userId, stripeCustomerId],
  );
}

export async function findUserIdByCustomerId(customerId: string): Promise<string | null> {
  const { rows } = await getAuthPool().query<{ user_id: string }>(
    'SELECT user_id FROM billing_customers WHERE stripe_customer_id = $1',
    [customerId],
  );
  return rows[0]?.user_id ?? null;
}

export async function findActiveSubscription(userId: string): Promise<BillingSubscriptionRow | null> {
  const { rows } = await getAuthPool().query<BillingSubscriptionRow>(
    `SELECT * FROM billing_subscriptions
     WHERE user_id = $1 AND status IN ('active','trialing','past_due')
     ORDER BY updated_at DESC LIMIT 1`,
    [userId],
  );
  return rows[0] ?? null;
}

export interface UpsertSubscriptionInput {
  userId: string;
  stripeSubscriptionId: string;
  stripePriceId: string;
  plan: string;
  status: string;
  currentPeriodStart: Date | null;
  currentPeriodEnd: Date | null;
  cancelAtPeriodEnd: boolean;
  trialEndsAt: Date | null;
}

export async function upsertSubscription(input: UpsertSubscriptionInput): Promise<void> {
  await getAuthPool().query(
    `INSERT INTO billing_subscriptions
       (user_id, stripe_subscription_id, stripe_price_id, plan, status,
        current_period_start, current_period_end, cancel_at_period_end, trial_ends_at)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
     ON CONFLICT (stripe_subscription_id) DO UPDATE SET
       stripe_price_id = EXCLUDED.stripe_price_id,
       plan = EXCLUDED.plan,
       status = EXCLUDED.status,
       current_period_start = EXCLUDED.current_period_start,
       current_period_end = EXCLUDED.current_period_end,
       cancel_at_period_end = EXCLUDED.cancel_at_period_end,
       trial_ends_at = EXCLUDED.trial_ends_at,
       updated_at = now()`,
    [
      input.userId,
      input.stripeSubscriptionId,
      input.stripePriceId,
      input.plan,
      input.status,
      input.currentPeriodStart,
      input.currentPeriodEnd,
      input.cancelAtPeriodEnd,
      input.trialEndsAt,
    ],
  );
}

export async function markWebhookProcessed(eventId: string, type: string): Promise<boolean> {
  const { rowCount } = await getAuthPool().query(
    `INSERT INTO billing_webhook_events (id, type)
     VALUES ($1, $2)
     ON CONFLICT (id) DO NOTHING`,
    [eventId, type],
  );
  return (rowCount ?? 0) > 0;
}

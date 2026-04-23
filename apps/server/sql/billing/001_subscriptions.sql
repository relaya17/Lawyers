-- ============================================================
--  Migration: Billing / Stripe Subscriptions
--  הרצה: psql "$DATABASE_URL" -f sql/billing/001_subscriptions.sql
-- ============================================================

-- Stripe customer mapping per user
CREATE TABLE IF NOT EXISTS billing_customers (
  user_id UUID PRIMARY KEY REFERENCES auth_users(id) ON DELETE CASCADE,
  stripe_customer_id TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Active / historical subscriptions
CREATE TABLE IF NOT EXISTS billing_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth_users(id) ON DELETE CASCADE,
  stripe_subscription_id TEXT NOT NULL UNIQUE,
  stripe_price_id TEXT NOT NULL,
  plan VARCHAR(32) NOT NULL, -- 'pro' | 'premium'
  status VARCHAR(32) NOT NULL, -- 'active' | 'trialing' | 'past_due' | 'canceled' | 'incomplete'
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  cancel_at_period_end BOOLEAN NOT NULL DEFAULT FALSE,
  trial_ends_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_billing_sub_user ON billing_subscriptions (user_id);
CREATE INDEX IF NOT EXISTS idx_billing_sub_status ON billing_subscriptions (status);

-- Webhook idempotency — דה-דופליקציה של Stripe events
CREATE TABLE IF NOT EXISTS billing_webhook_events (
  id TEXT PRIMARY KEY, -- Stripe event.id
  type VARCHAR(128) NOT NULL,
  processed_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

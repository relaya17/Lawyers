CREATE TABLE IF NOT EXISTS marketing_waitlist (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  source TEXT NOT NULL DEFAULT 'landing',
  CONSTRAINT marketing_waitlist_email_unique UNIQUE (email)
);

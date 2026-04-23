-- שימוש יומי בקריאות AI (מגבלת Free במבצע השקה). הרצה: psql "$DATABASE_URL" -f sql/billing/003_daily_ai_usage.sql

CREATE TABLE IF NOT EXISTS user_daily_ai_usage (
  user_id UUID NOT NULL REFERENCES auth_users(id) ON DELETE CASCADE,
  usage_date DATE NOT NULL,
  count INT NOT NULL DEFAULT 0,
  PRIMARY KEY (user_id, usage_date)
);

CREATE INDEX IF NOT EXISTS idx_daily_ai_usage_date ON user_daily_ai_usage (usage_date);

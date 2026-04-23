-- הוספת תמיכה ב-Google OAuth לטבלת auth_users
-- הרצה: psql "$DATABASE_URL" -f sql/auth/002_google_oauth.sql
-- ב-Supabase: הדבק ב-SQL Editor

-- עמודה לשמירת Google user ID (sub)
ALTER TABLE auth_users
  ADD COLUMN IF NOT EXISTS google_id TEXT,
  ADD COLUMN IF NOT EXISTS avatar_url TEXT;

-- אינדקס ייחודי על google_id (לאיתור מהיר בהתחברות)
CREATE UNIQUE INDEX IF NOT EXISTS idx_auth_users_google_id
  ON auth_users (google_id)
  WHERE google_id IS NOT NULL;

-- password_hash יכול להיות NULL עבור משתמשי OAuth
ALTER TABLE auth_users
  ALTER COLUMN password_hash DROP NOT NULL;

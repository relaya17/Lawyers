/**
 * אימות Google ID Token ו-upsert משתמש ב-DB.
 * הקלד GOOGLE_CLIENT_ID בקובץ .env (ה-Client ID מה-Google Cloud Console).
 */
import { OAuth2Client } from 'google-auth-library';
import type { Request, Response } from 'express';
import { getAuthPool } from '../db/pgPool.js';
import { issueAuthResponse } from './authService.js';
import type { AuthUserRow } from './userMapper.js';
import type { User } from '@myorg/shared/store/slices/authSlice';

function getClient(): OAuth2Client {
  const clientId = process.env.GOOGLE_CLIENT_ID?.trim();
  if (!clientId) throw Object.assign(new Error('GOOGLE_CLIENT_ID not configured'), { statusCode: 503 });
  return new OAuth2Client(clientId);
}

interface GooglePayload {
  sub: string;
  email: string;
  given_name?: string;
  family_name?: string;
  picture?: string;
  email_verified?: boolean;
}

async function verifyGoogleToken(idToken: string): Promise<GooglePayload> {
  const client = getClient();
  const clientId = process.env.GOOGLE_CLIENT_ID!.trim();
  const ticket = await client.verifyIdToken({ idToken, audience: clientId });
  const payload = ticket.getPayload();
  if (!payload?.sub || !payload.email) {
    throw Object.assign(new Error('Google token payload invalid'), { statusCode: 400 });
  }
  if (!payload.email_verified) {
    throw Object.assign(new Error('כתובת האימייל של חשבון Google אינה מאומתת'), { statusCode: 400 });
  }
  return payload as GooglePayload;
}

async function upsertGoogleUser(p: GooglePayload): Promise<AuthUserRow> {
  const pool = getAuthPool();
  const firstName = p.given_name ?? p.email.split('@')[0];
  const lastName = p.family_name ?? '';

  // חפש לפי google_id קודם, אחר-כך לפי email
  const existing = await pool.query<AuthUserRow>(
    `SELECT id, email, first_name, last_name, phone, role, email_verified_at, created_at, updated_at
     FROM auth_users
     WHERE google_id = $1 OR LOWER(email) = LOWER($2)
     LIMIT 1`,
    [p.sub, p.email],
  );

  if (existing.rows[0]) {
    // עדכן google_id ו-avatar אם חסרים
    const updated = await pool.query<AuthUserRow>(
      `UPDATE auth_users
       SET google_id    = COALESCE(google_id, $1),
           avatar_url   = COALESCE(avatar_url, $2),
           email_verified_at = COALESCE(email_verified_at, now()),
           updated_at   = now()
       WHERE id = $3
       RETURNING id, email, first_name, last_name, phone, role, email_verified_at, created_at, updated_at`,
      [p.sub, p.picture ?? null, existing.rows[0].id],
    );
    return updated.rows[0];
  }

  // צור משתמש חדש (ללא סיסמה)
  const inserted = await pool.query<AuthUserRow>(
    `INSERT INTO auth_users
       (email, password_hash, first_name, last_name, role, google_id, avatar_url, email_verified_at)
     VALUES (LOWER(TRIM($1)), NULL, $2, $3, 'student', $4, $5, now())
     RETURNING id, email, first_name, last_name, phone, role, email_verified_at, created_at, updated_at`,
    [p.email, firstName, lastName, p.sub, p.picture ?? null],
  );
  return inserted.rows[0];
}

export async function loginWithGoogle(
  idToken: string,
  req: Request,
  res: Response,
): Promise<{ user: User; accessToken: string }> {
  if (!idToken?.trim()) {
    throw Object.assign(new Error('חסר Google ID token'), { statusCode: 400 });
  }
  const payload = await verifyGoogleToken(idToken);
  const userRow = await upsertGoogleUser(payload);
  return issueAuthResponse(userRow, req, res);
}

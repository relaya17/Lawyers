import bcrypt from 'bcrypt';
import { timingSafeEqual } from 'crypto';
import type { Request, Response } from 'express';
import type { User } from '@myorg/shared/store/slices/authSlice';
import { getAuthPool } from '../db/pgPool.js';
import {
  hashOpaqueToken,
  newRefreshTokenRaw,
  hashOtpCode,
  randomOtp6,
} from './cryptoUtil.js';
import { randomBytes } from 'crypto';
import { signAccessToken, verifyAccessToken } from './jwtTokens.js';
import {
  COOKIE_CSRF,
  COOKIE_RT,
  clearRefreshCookie,
  csrfCookieOptions,
  refreshCookieOptions,
} from './cookies.js';
import { sendEmailOtp } from './emailService.js';
import { rowToUser, type AuthUserRow } from './userMapper.js';

const BCRYPT_ROUNDS = 12;
const ACCESS_TTL_SEC = Math.min(
  Math.max(parseInt(process.env.JWT_ACCESS_EXPIRES_SEC || '900', 10), 60),
  3600,
);
const REFRESH_DAYS = Math.min(Math.max(parseInt(process.env.REFRESH_TOKEN_DAYS || '7', 10), 1), 30);
const REFRESH_TTL_SEC = REFRESH_DAYS * 24 * 60 * 60;
const OTP_TTL_MIN = Math.min(Math.max(parseInt(process.env.OTP_TTL_MINUTES || '15', 10), 5), 60);

type UserRowWithHash = AuthUserRow & { password_hash: string };

function safeEqualHash(a: string, b: string): boolean {
  const ba = Buffer.from(a, 'utf8');
  const bb = Buffer.from(b, 'utf8');
  if (ba.length !== bb.length) return false;
  return timingSafeEqual(ba, bb);
}

async function findUserWithHash(email: string): Promise<UserRowWithHash | null> {
  const pool = getAuthPool();
  const r = await pool.query<UserRowWithHash>(
    `SELECT id, email, password_hash, first_name, last_name, phone, role, email_verified_at, created_at, updated_at
     FROM auth_users WHERE LOWER(email) = LOWER($1) LIMIT 1`,
    [email.trim()],
  );
  return r.rows[0] ?? null;
}

async function findUserById(id: string): Promise<AuthUserRow | null> {
  const pool = getAuthPool();
  const r = await pool.query<AuthUserRow>(
    `SELECT id, email, first_name, last_name, phone, role, email_verified_at, created_at, updated_at
     FROM auth_users WHERE id = $1 LIMIT 1`,
    [id],
  );
  return r.rows[0] ?? null;
}

async function persistRefreshSession(userId: string, rawToken: string, req: Request): Promise<void> {
  const pool = getAuthPool();
  const h = hashOpaqueToken(rawToken);
  const exp = new Date(Date.now() + REFRESH_TTL_SEC * 1000);
  await pool.query(
    `INSERT INTO auth_refresh_sessions (user_id, token_hash, expires_at, user_agent, ip_address)
     VALUES ($1,$2,$3,$4,$5)`,
    [
      userId,
      h,
      exp,
      typeof req.headers['user-agent'] === 'string'
        ? req.headers['user-agent'].slice(0, 512)
        : null,
      req.ip ?? null,
    ],
  );
}

export function attachRefreshCookie(res: Response, rawToken: string): void {
  res.cookie(COOKIE_RT, rawToken, refreshCookieOptions(REFRESH_TTL_SEC));
}

export function issueCsrfCookie(res: Response): string {
  const t = randomBytes(32).toString('hex');
  res.cookie(COOKIE_CSRF, t, csrfCookieOptions(12 * 3600));
  return t;
}

async function issueAuthResponse(
  userRow: AuthUserRow,
  req: Request,
  res: Response,
): Promise<{ user: User; accessToken: string }> {
  const user = rowToUser(userRow);
  const accessToken = signAccessToken(user.id, user.email, ACCESS_TTL_SEC);
  const raw = newRefreshTokenRaw();
  await persistRefreshSession(user.id, raw, req);
  attachRefreshCookie(res, raw);
  return { user, accessToken };
}

export async function registerUser(body: {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
}): Promise<{ email: string; requiresVerification: true }> {
  const pool = getAuthPool();
  const passwordHash = await bcrypt.hash(body.password, BCRYPT_ROUNDS);
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const ins = await client.query<AuthUserRow>(
      `INSERT INTO auth_users (email, password_hash, first_name, last_name, phone, role, email_verified_at)
       VALUES (LOWER(TRIM($1::text)), $2, $3, $4, $5, 'student', NULL)
       RETURNING id, email, first_name, last_name, phone, role, email_verified_at, created_at, updated_at`,
      [body.email, passwordHash, body.firstName, body.lastName, body.phone ?? null],
    );
    const user = ins.rows[0];
    await client.query(
      `UPDATE auth_otp_challenges SET consumed_at = now() WHERE user_id = $1 AND consumed_at IS NULL`,
      [user.id],
    );
    const code = randomOtp6();
    const codeHash = hashOtpCode(code);
    const exp = new Date(Date.now() + OTP_TTL_MIN * 60 * 1000);
    await client.query(
      `INSERT INTO auth_otp_challenges (user_id, code_hash, expires_at) VALUES ($1,$2,$3)`,
      [user.id, codeHash, exp],
    );
    await client.query('COMMIT');
    await sendEmailOtp(user.email, code);
    return { email: user.email, requiresVerification: true };
  } catch (e) {
    await client.query('ROLLBACK');
    const err = e as { code?: string };
    if (err.code === '23505') {
      throw Object.assign(new Error('כתובת האימייל כבר רשומה במערכת'), { statusCode: 409 });
    }
    throw e;
  } finally {
    client.release();
  }
}

export async function verifyEmailOtp(
  body: { email: string; code: string },
  req: Request,
  res: Response,
): Promise<{ user: User; accessToken: string }> {
  const pool = getAuthPool();
  const rowUser = await findUserWithHash(body.email);
  if (!rowUser) {
    throw Object.assign(new Error('משתמש לא נמצא'), { statusCode: 404 });
  }
  if (rowUser.email_verified_at) {
    throw Object.assign(new Error('האימייל כבר אומת — ניתן להתחבר'), { statusCode: 400 });
  }
  const r = await pool.query<{ id: string; code_hash: string }>(
    `SELECT id, code_hash FROM auth_otp_challenges
     WHERE user_id = $1 AND consumed_at IS NULL AND expires_at > now()
     ORDER BY created_at DESC LIMIT 1`,
    [rowUser.id],
  );
  const ch = r.rows[0];
  if (!ch) {
    throw Object.assign(new Error('קוד לא תקף או שפג תוקפו — בקשו קוד חדש'), { statusCode: 400 });
  }
  const tryHash = hashOtpCode(body.code);
  if (!safeEqualHash(tryHash, ch.code_hash)) {
    throw Object.assign(new Error('קוד שגוי'), { statusCode: 400 });
  }
  await pool.query(`UPDATE auth_otp_challenges SET consumed_at = now() WHERE id = $1`, [ch.id]);
  const up = await pool.query<AuthUserRow>(
    `UPDATE auth_users SET email_verified_at = now(), updated_at = now() WHERE id = $1
     RETURNING id, email, first_name, last_name, phone, role, email_verified_at, created_at, updated_at`,
    [rowUser.id],
  );
  const verified = up.rows[0];
  return issueAuthResponse(verified, req, res);
}

export async function resendOtp(email: string): Promise<{ ok: true }> {
  const rowUser = await findUserWithHash(email);
  if (!rowUser) {
    throw Object.assign(new Error('משתמש לא נמצא'), { statusCode: 404 });
  }
  if (rowUser.email_verified_at) {
    throw Object.assign(new Error('האימייל כבר מאומת'), { statusCode: 400 });
  }
  const pool = getAuthPool();
  await pool.query(
    `UPDATE auth_otp_challenges SET consumed_at = now() WHERE user_id = $1 AND consumed_at IS NULL`,
    [rowUser.id],
  );
  const code = randomOtp6();
  const codeHash = hashOtpCode(code);
  const exp = new Date(Date.now() + OTP_TTL_MIN * 60 * 1000);
  await pool.query(
    `INSERT INTO auth_otp_challenges (user_id, code_hash, expires_at) VALUES ($1,$2,$3)`,
    [rowUser.id, codeHash, exp],
  );
  await sendEmailOtp(rowUser.email, code);
  return { ok: true };
}

export async function loginUser(
  body: { email: string; password: string },
  req: Request,
  res: Response,
): Promise<{ user: User; accessToken: string }> {
  const rowUser = await findUserWithHash(body.email);
  if (!rowUser) {
    throw Object.assign(new Error('אימייל או סיסמה שגויים'), { statusCode: 401 });
  }
  if (!rowUser.email_verified_at) {
    throw Object.assign(
      new Error('יש להשלים אימות אימייל לפני התחברות'),
      { statusCode: 403 },
    );
  }
  const ok = await bcrypt.compare(body.password, rowUser.password_hash);
  if (!ok) {
    throw Object.assign(new Error('אימייל או סיסמה שגויים'), { statusCode: 401 });
  }
  const { password_hash: _, ...authRow } = rowUser;
  return issueAuthResponse(authRow, req, res);
}

type RefreshJoinRow = AuthUserRow & { session_id: string };

export async function refreshTokens(
  req: Request,
  res: Response,
): Promise<{ accessToken: string; user: User }> {
  const raw = req.cookies?.[COOKIE_RT] as string | undefined;
  if (!raw) {
    throw Object.assign(new Error('נדרש ריענון סשן'), { statusCode: 401 });
  }
  const pool = getAuthPool();
  const h = hashOpaqueToken(raw);
  const r = await pool.query<RefreshJoinRow>(
    `SELECT s.id AS session_id, u.id, u.email, u.first_name, u.last_name, u.phone, u.role,
            u.email_verified_at, u.created_at, u.updated_at
     FROM auth_refresh_sessions s
     JOIN auth_users u ON u.id = s.user_id
     WHERE s.token_hash = $1 AND s.revoked_at IS NULL AND s.expires_at > now()
     LIMIT 1`,
    [h],
  );
  const row = r.rows[0];
  if (!row) {
    clearRefreshCookie(res);
    throw Object.assign(new Error('סשן פג או בוטל'), { statusCode: 401 });
  }
  if (!row.email_verified_at) {
    clearRefreshCookie(res);
    throw Object.assign(new Error('חשבון לא אומת'), { statusCode: 403 });
  }
  await pool.query(`UPDATE auth_refresh_sessions SET revoked_at = now() WHERE id = $1`, [row.session_id]);
  const { session_id: _sid, ...userRow } = row;
  const out = await issueAuthResponse(userRow, req, res);
  return { accessToken: out.accessToken, user: out.user };
}

export async function logoutSession(req: Request, res: Response): Promise<void> {
  const raw = req.cookies?.[COOKIE_RT] as string | undefined;
  if (raw) {
    const h = hashOpaqueToken(raw);
    await getAuthPool().query(
      `UPDATE auth_refresh_sessions SET revoked_at = now() WHERE token_hash = $1 AND revoked_at IS NULL`,
      [h],
    );
  }
  clearRefreshCookie(res);
}

export async function getUserFromBearer(authorization: string | undefined): Promise<User> {
  if (!authorization?.startsWith('Bearer ')) {
    throw Object.assign(new Error('חסר אסימון גישה'), { statusCode: 401 });
  }
  const token = authorization.slice(7).trim();
  const payload = verifyAccessToken(token);
  const row = await findUserById(payload.sub);
  if (!row || !row.email_verified_at) {
    throw Object.assign(new Error('משתמש לא תקף'), { statusCode: 401 });
  }
  if (row.email.toLowerCase() !== payload.email.toLowerCase()) {
    throw Object.assign(new Error('אסימון לא תואם משתמש'), { statusCode: 401 });
  }
  return rowToUser(row);
}

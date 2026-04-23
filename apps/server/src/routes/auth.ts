import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { ZodError } from 'zod';
import {
  registerSchema,
  loginSchema,
  verifyEmailSchema,
  resendOtpSchema,
} from '@myorg/shared/validation/auth';
import { csrfProtect } from '../middleware/csrf.js';
import { requireAuth } from '../middleware/requireAuth.js';
import {
  registerUser,
  verifyEmailOtp,
  resendOtp,
  loginUser,
  refreshTokens,
  logoutSession,
  issueCsrfCookie,
  getUserFromBearer,
} from '../auth/authService.js';
import { authDbHealth } from '../db/pgPool.js';

export const authRouter = Router();

const limitGeneral = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 40,
  standardHeaders: true,
  legacyHeaders: false,
});

const limitLogin = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 12,
  standardHeaders: true,
  legacyHeaders: false,
});

function parseZod(err: ZodError): { error: string; details: unknown } {
  const f = err.flatten();
  const first = f.fieldErrors
    ? Object.values(f.fieldErrors).flat()[0]
    : undefined;
  return {
    error: typeof first === 'string' ? first : 'נתונים לא תקינים',
    details: f.fieldErrors,
  };
}

authRouter.get('/csrf', limitGeneral, (_req, res) => {
  const csrfToken = issueCsrfCookie(res);
  res.json({ csrfToken });
});

authRouter.get('/health', async (_req, res) => {
  const db = await authDbHealth();
  res.json({ auth: true, database: db });
});

authRouter.post('/register', limitGeneral, async (req, res, next) => {
  try {
    const body = registerSchema.parse(req.body);
    const out = await registerUser(body);
    res.status(201).json(out);
  } catch (e) {
    if (e instanceof ZodError) {
      res.status(400).json(parseZod(e));
      return;
    }
    next(e);
  }
});

authRouter.post('/verify-email', limitGeneral, async (req, res, next) => {
  try {
    const body = verifyEmailSchema.parse(req.body);
    const out = await verifyEmailOtp(body, req, res);
    res.json(out);
  } catch (e) {
    if (e instanceof ZodError) {
      res.status(400).json(parseZod(e));
      return;
    }
    next(e);
  }
});

authRouter.post('/resend-otp', limitGeneral, async (req, res, next) => {
  try {
    const body = resendOtpSchema.parse(req.body);
    const out = await resendOtp(body.email);
    res.json(out);
  } catch (e) {
    if (e instanceof ZodError) {
      res.status(400).json(parseZod(e));
      return;
    }
    next(e);
  }
});

authRouter.post('/login', limitLogin, async (req, res, next) => {
  try {
    const body = loginSchema.parse(req.body);
    const out = await loginUser(body, req, res);
    res.json(out);
  } catch (e) {
    if (e instanceof ZodError) {
      res.status(400).json(parseZod(e));
      return;
    }
    next(e);
  }
});

authRouter.post('/refresh', csrfProtect, limitGeneral, async (req, res, next) => {
  try {
    const out = await refreshTokens(req, res);
    res.json(out);
  } catch (e) {
    next(e);
  }
});

authRouter.post('/logout', csrfProtect, limitGeneral, async (req, res, next) => {
  try {
    await logoutSession(req, res);
    res.json({ ok: true });
  } catch (e) {
    next(e);
  }
});

authRouter.get('/me', requireAuth, (req, res) => {
  res.json({ user: req.authUser });
});

/** דוגמה למסלול מוגן — הרחבה לפי מודולים */
authRouter.get('/protected/ping', requireAuth, (_req, res) => {
  res.json({ ok: true, message: 'מאומת' });
});

/** אימות Bearer בלי שמירת req.authUser (לשימוש חיצוני) */
authRouter.get('/whoami', async (req, res, next) => {
  try {
    const user = await getUserFromBearer(req.headers.authorization);
    res.json({ user });
  } catch (e) {
    next(e);
  }
});

import type { Request, Response, NextFunction } from 'express';
import { COOKIE_CSRF } from '../auth/cookies.js';

/** Double-submit: עוגיית `lex_csrf` (לא HttpOnly) חייבת לתאם לכותרת `X-CSRF-Token`. */
export function csrfProtect(req: Request, res: Response, next: NextFunction): void {
  const method = req.method.toUpperCase();
  if (!['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
    next();
    return;
  }
  const header = req.headers['x-csrf-token'];
  const cookie = req.cookies?.[COOKIE_CSRF];
  if (typeof header !== 'string' || typeof cookie !== 'string' || header.length < 16 || header !== cookie) {
    res.status(403).json({ error: 'אימות CSRF נכשל' });
    return;
  }
  next();
}

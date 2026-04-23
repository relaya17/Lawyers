import type { CookieOptions, Response } from 'express';

export const COOKIE_RT = 'lex_rt';
export const COOKIE_CSRF = 'lex_csrf';

const isProd = process.env.NODE_ENV === 'production';

export function refreshCookieOptions(maxAgeSec: number): CookieOptions {
  return {
    httpOnly: true,
    secure: isProd,
    sameSite: 'strict',
    path: '/api/auth',
    maxAge: maxAgeSec * 1000,
  };
}

export function csrfCookieOptions(maxAgeSec: number): CookieOptions {
  return {
    httpOnly: false,
    secure: isProd,
    sameSite: 'strict',
    path: '/',
    maxAge: maxAgeSec * 1000,
  };
}

export function clearRefreshCookie(res: Response): void {
  res.clearCookie(COOKIE_RT, {
    path: '/api/auth',
    httpOnly: true,
    secure: isProd,
    sameSite: 'strict',
  });
}

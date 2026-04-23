import jwt from 'jsonwebtoken';

export interface AccessPayload {
  sub: string;
  email: string;
  typ: 'access';
}

function requireSecret(): string {
  const s = process.env.JWT_ACCESS_SECRET?.trim();
  if (!s || s.length < 32) {
    throw new Error('JWT_ACCESS_SECRET must be set (min 32 characters)');
  }
  return s;
}

export function signAccessToken(userId: string, email: string, expiresInSec: number): string {
  const payload: AccessPayload = { sub: userId, email, typ: 'access' };
  return jwt.sign(payload, requireSecret(), { expiresIn: expiresInSec, algorithm: 'HS256' });
}

export function verifyAccessToken(token: string): AccessPayload {
  const decoded = jwt.verify(token, requireSecret(), { algorithms: ['HS256'] });
  if (typeof decoded === 'string' || !decoded || typeof decoded !== 'object') {
    throw new Error('Invalid token');
  }
  const d = decoded as Record<string, unknown>;
  if (d.typ !== 'access' || typeof d.sub !== 'string' || typeof d.email !== 'string') {
    throw new Error('Invalid access token payload');
  }
  return { sub: d.sub, email: d.email, typ: 'access' };
}

import { createHash, randomBytes, timingSafeEqual } from 'crypto';

export function hashOpaqueToken(raw: string): string {
  return createHash('sha256').update(raw).digest('hex');
}

export function newRefreshTokenRaw(): string {
  return randomBytes(48).toString('base64url');
}

export function hashOtpCode(code: string): string {
  const pepper = process.env.OTP_PEPPER?.trim() || 'dev-only-change-in-production';
  return createHash('sha256').update(`${pepper}:${code}`).digest('hex');
}

export function safeEqualHex(a: string, b: string): boolean {
  try {
    const ba = Buffer.from(a, 'hex');
    const bb = Buffer.from(b, 'hex');
    if (ba.length !== bb.length) return false;
    return timingSafeEqual(ba, bb);
  } catch {
    return false;
  }
}

export function randomOtp6(): string {
  const n = randomBytes(4).readUInt32BE(0) % 1_000_000;
  return n.toString().padStart(6, '0');
}

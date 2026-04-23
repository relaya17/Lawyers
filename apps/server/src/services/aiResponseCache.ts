import crypto from 'node:crypto';
import mongoose from 'mongoose';
import { AiResponseCacheModel } from '../models/AiResponseCache.js';

/**
 * חיסכון עלויות OpenAI: Cache של תשובות לפי מפתח דטרמיניסטי.
 * אם Mongo לא חובר — פשוט חוזר ל-producer בלי לשמור (fail-open).
 */

function isMongoReady(): boolean {
  // 1 = connected. 2 = connecting. בלי URI ה-readyState יישאר 0.
  return mongoose.connection.readyState === 1;
}

function stableStringify(value: unknown): string {
  const seen = new WeakSet();
  const sortObjectKeys = (v: unknown): unknown => {
    if (v === null || typeof v !== 'object') return v;
    if (seen.has(v as object)) return null;
    seen.add(v as object);
    if (Array.isArray(v)) return v.map(sortObjectKeys);
    const entries = Object.entries(v as Record<string, unknown>)
      .filter(([, val]) => val !== undefined)
      .sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0))
      .map(([k, val]) => [k, sortObjectKeys(val)] as const);
    return Object.fromEntries(entries);
  };
  return JSON.stringify(sortObjectKeys(value));
}

export function buildCacheKey(scope: string, payload: unknown): string {
  const canonical = `${scope}::${stableStringify(payload)}`;
  return crypto.createHash('sha256').update(canonical).digest('hex');
}

function daysFromNow(days: number): Date {
  return new Date(Date.now() + days * 24 * 60 * 60 * 1000);
}

export interface CacheOptions {
  scope: string;
  payload: unknown;
  ttlDays?: number;
  model?: string | null;
}

export async function withJsonCache<T>(
  opts: CacheOptions,
  producer: () => Promise<T>,
): Promise<{ value: T; cached: boolean }> {
  const ttlDays = opts.ttlDays ?? 60;
  const model = opts.model ?? null;

  if (!isMongoReady()) {
    const value = await producer();
    return { value, cached: false };
  }

  const key = buildCacheKey(opts.scope, opts.payload);

  try {
    const hit = await AiResponseCacheModel.findOneAndUpdate(
      { key },
      { $inc: { hitCount: 1 }, $set: { lastAccessedAt: new Date() } },
      { new: true },
    ).lean();
    if (hit && hit.response !== undefined && hit.response !== null) {
      return { value: hit.response as T, cached: true };
    }
  } catch {
    // fail-open: מתעלמים משגיאות קריאה ומזמינים את ה-LLM
  }

  const value = await producer();

  try {
    await AiResponseCacheModel.updateOne(
      { key },
      {
        $setOnInsert: {
          key,
          scope: opts.scope,
          response: value,
          createdAt: new Date(),
          expiresAt: daysFromNow(ttlDays),
        },
        $set: { model, lastAccessedAt: new Date() },
      },
      { upsert: true },
    );
  } catch {
    // אם כתיבה נכשלה פשוט חוזרים בלי cache
  }

  return { value, cached: false };
}

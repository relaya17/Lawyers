/**
 * מבצע השקה: Free מתנהג כמו Pro למעט יכולות עורך דין, עם מכסת קריאות AI יומית.
 * הגדר PROMO_ENDS_AT (ISO-8601, למשל 2026-07-23T23:59:59+03:00). בלי משתנה — אין מבצע.
 */

function parsePromoEndsAt(): Date | null {
  const raw = process.env.PROMO_ENDS_AT?.trim();
  if (!raw) return null;
  const d = new Date(raw);
  return Number.isNaN(d.getTime()) ? null : d;
}

export function isPromoActive(): boolean {
  const end = parsePromoEndsAt();
  if (!end) return false;
  return Date.now() < end.getTime();
}

export function getPromoEndsAtIso(): string | null {
  const end = parsePromoEndsAt();
  return end ? end.toISOString() : null;
}

/** מכסת קריאות AI ליום למשתמשי Free בזמן מבצע (כולל VC LLM + RAG). */
export function getPromoFreeAiDailyLimit(): number {
  const n = parseInt(process.env.PROMO_FREE_AI_PER_DAY ?? '25', 10);
  if (!Number.isFinite(n) || n < 1) return 25;
  return n;
}

export function getPromoSummaryForApi(): {
  active: boolean;
  endsAt: string | null;
  freeAiPerDay: number;
} {
  return {
    active: isPromoActive(),
    endsAt: getPromoEndsAtIso(),
    freeAiPerDay: getPromoFreeAiDailyLimit(),
  };
}

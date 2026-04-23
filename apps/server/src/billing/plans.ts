/**
 * Pricing plans — Tier 1 Free / Tier 2 Student Pro / Tier 3 Lawyer–Expert
 * Stripe Price IDs from env (אותו קוד ל-test ול-live).
 */

export type PlanId = 'free' | 'pro' | 'premium';

export interface PlanDefinition {
  id: PlanId;
  displayName: string;
  displayNameHe: string;
  monthlyPriceIls: number;
  stripePriceId: string | null;
  features: string[];
  entitlements: {
    aiCoach: boolean;
    adaptiveDrills: boolean;
    /** גישה לבית המשפט הווירטואלי ברמת בסיס (תיקים מקומיים, ללא LLM) */
    virtualCourtLimited: boolean;
    /** בית משפט וירטואלי מלא (ייצור תיק ב-AI, שופט AI) */
    virtualCourtFull: boolean;
    realCaseImport: boolean;
    /** ניתוח סיכונים בחוזים (מסלול עורכי דין) */
    contractRiskAnalysis: boolean;
    unlimitedExamQuestions: boolean;
    /** מכסה חודשית (legacy); Free משתמש ב-dailyQuestionLimit */
    monthlyQuestionQuota: number;
    /** מספר שאלות ביום ל-Free; null = ללא מגבלה יומית */
    dailyQuestionLimit: number | null;
  };
}

const STRIPE_PRICE_PRO = process.env.STRIPE_PRICE_PRO_MONTHLY ?? '';
const STRIPE_PRICE_PREMIUM = process.env.STRIPE_PRICE_PREMIUM_MONTHLY ?? '';

export const PLANS: Record<PlanId, PlanDefinition> = {
  free: {
    id: 'free',
    displayName: 'Free — Tier 1',
    displayNameHe: 'חינם',
    monthlyPriceIls: 0,
    stripePriceId: null,
    features: [
      'עד 20 שאלות תרגול ביום',
      'חומרי עיון ומושגים בסיסיים',
      'מעקב התקדמות בסיסי',
      'בית משפט וירטואלי — מצב בסיס (ללא שופט AI; שדרגו ל-Student Pro למלא)',
    ],
    entitlements: {
      aiCoach: false,
      adaptiveDrills: false,
      virtualCourtLimited: true,
      virtualCourtFull: false,
      realCaseImport: false,
      contractRiskAnalysis: false,
      unlimitedExamQuestions: false,
      monthlyQuestionQuota: 0,
      dailyQuestionLimit: 20,
    },
  },
  pro: {
    id: 'pro',
    displayName: 'Student Pro — Tier 2',
    displayNameHe: 'סטודנט Pro',
    monthlyPriceIls: 49,
    stripePriceId: STRIPE_PRICE_PRO || null,
    features: [
      'גישה לכל 1,200+ השאלות ללא הגבלה יומית',
      'AI מאמן אישי ללא הגבלה',
      'Adaptive Learning',
      'בית משפט וירטואלי מלא + שופט AI',
    ],
    entitlements: {
      aiCoach: true,
      adaptiveDrills: true,
      virtualCourtLimited: true,
      virtualCourtFull: true,
      realCaseImport: false,
      contractRiskAnalysis: false,
      unlimitedExamQuestions: true,
      monthlyQuestionQuota: Infinity,
      dailyQuestionLimit: null,
    },
  },
  premium: {
    id: 'premium',
    displayName: 'Lawyer / Expert — Tier 3',
    displayNameHe: 'עורך דין / מומחה',
    monthlyPriceIls: 99,
    stripePriceId: STRIPE_PRICE_PREMIUM || null,
    features: [
      'כל יכולות Student Pro',
      'ניתוח סיכונים בחוזים',
      'ייבוא פסקי דין ותיקים אמיתיים מהרשת (Real Case Import)',
      'תמיכה מועדפת',
    ],
    entitlements: {
      aiCoach: true,
      adaptiveDrills: true,
      virtualCourtLimited: true,
      virtualCourtFull: true,
      realCaseImport: true,
      contractRiskAnalysis: true,
      unlimitedExamQuestions: true,
      monthlyQuestionQuota: Infinity,
      dailyQuestionLimit: null,
    },
  },
};

export function getPlanByPriceId(stripePriceId: string): PlanDefinition | undefined {
  return Object.values(PLANS).find((p) => p.stripePriceId === stripePriceId);
}

export function planFromStatus(
  status: string | null | undefined,
  planFromDb: string | null | undefined,
): PlanId {
  if (!status || !planFromDb) return 'free';
  const active = status === 'active' || status === 'trialing';
  if (!active) return 'free';
  return planFromDb === 'premium' ? 'premium' : planFromDb === 'pro' ? 'pro' : 'free';
}

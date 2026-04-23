export type PlanId = 'free' | 'pro' | 'premium'

export interface PlanEntitlements {
  aiCoach: boolean
  adaptiveDrills: boolean
  /** גישה בסיסית ל-Virtual Court (תיקים מקומיים; ללא LLM בשרת) */
  virtualCourtLimited: boolean
  /** סימולציות בית משפט מלאות — ייצור תיק ושופט AI (Student Pro+) */
  virtualCourtFull: boolean
  realCaseImport: boolean
  /** ניתוח סיכונים בחוזים (Lawyer / Expert) */
  contractRiskAnalysis: boolean
  unlimitedExamQuestions: boolean
  monthlyQuestionQuota: number | null // null = ללא הגבלה
  /** מגבלת שאלות ביום ל-Free; null = ללא מגבלה יומית */
  dailyQuestionLimit: number | null
}

export interface Plan {
  id: PlanId
  displayName: string
  displayNameHe: string
  monthlyPriceIls: number
  features: string[]
  entitlements: PlanEntitlements
  available: boolean
}

export interface EntitlementsResponse {
  plan: PlanId
  status: 'active' | 'trialing' | 'past_due' | 'canceled' | 'incomplete' | 'none'
  currentPeriodEnd: string | null
  cancelAtPeriodEnd: boolean
  dailyQuestions: { used: number; limit: number | null }
  promoActive: boolean
  promoEndsAt: string | null
  dailyAiCalls: { used: number; limit: number | null }
  entitlements: PlanEntitlements
}

export interface BillingPromoSummary {
  active: boolean
  endsAt: string | null
  freeAiPerDay: number
}

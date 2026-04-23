/**
 * Single source of truth for every analytics event name used in the app.
 * Keeping them here prevents typos and makes dashboards reliable.
 *
 * Naming convention: `subject.verb_object` in snake_case.
 */
export const AnalyticsEvents = {
  // Auth
  AUTH_LOGIN_COMPLETED: 'auth.login_completed',
  AUTH_REGISTER_COMPLETED: 'auth.register_completed',
  AUTH_LOGOUT: 'auth.logout',

  // Paywall funnel — critical for monetization
  PAYWALL_VIEWED: 'paywall.viewed',
  PAYWALL_CTA_CLICKED: 'paywall.cta_clicked',
  PRICING_VIEWED: 'pricing.viewed',
  CHECKOUT_STARTED: 'checkout.started',
  CHECKOUT_COMPLETED: 'checkout.completed',
  BILLING_PORTAL_OPENED: 'billing.portal_opened',

  // Learning engagement
  EXAM_STARTED: 'exam.started',
  EXAM_COMPLETED: 'exam.completed',
  QUESTION_ANSWERED: 'question.answered',

  // Virtual court
  VIRTUAL_COURT_CASE_CREATED: 'virtual_court.case_created',
  VIRTUAL_COURT_AI_RESPONSE: 'virtual_court.ai_response',
} as const

export type AnalyticsEventName = (typeof AnalyticsEvents)[keyof typeof AnalyticsEvents]

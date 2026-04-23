/**
 * תבנית תיק: סמוי + 50 נאשמים.
 * תיק פלילי מחוזי — ארגון פשיעה שנחשף ע"י שוטר סמוי.
 * משמש ליצירת סשן ראשוני בחדר הדיונים.
 */
import type { CaseTrack, CourtLevel } from '@/features/virtual-court-2/types'

export type SessionMode = 'open' | 'closed_doors' | 'appeal' | 'mediation'

export interface CourtroomCaseTemplate {
  caseId: string
  hearingId: string
  title: string
  courtLevel: CourtLevel
  caseTrack: CaseTrack
  mode?: SessionMode
  shortDescription: string
  facts: string[]
  charges: string[]
  preloadedEvidence: Array<{
    kind: 'document' | 'image' | 'video' | 'audio' | 'confidential_report' | 'exhibit'
    title: string
    description: string
    accessLevel: 'all' | 'judges_only' | 'prosecution_only' | 'defense_only'
  }>
  openingProtocol: Array<{
    role:
      | 'clerk'
      | 'judge'
      | 'prosecutor'
      | 'plaintiff_lawyer'
      | 'defense_lawyer'
      | 'defendant'
      | 'witness'
      | 'expert'
      | 'mediator'
      | 'observer'
    speakerName: string
    text: string
    entryType: 'statement' | 'question' | 'objection' | 'ruling' | 'evidence' | 'note' | 'system'
  }>
}

export const UNDERCOVER_CASE: CourtroomCaseTemplate = {
  caseId: 'tp-2026-undercover-50',
  hearingId: 'h-1',
  title: 'מ.י. נ׳ אלוני ו-49 אח׳ — פרשת סמוי "צפון"',
  courtLevel: 'district',
  caseTrack: 'criminal',
  shortDescription:
    'תיק פלילי מחוזי. כתב אישום נגד 50 נאשמים בארגון פשיעה שנחשף ע"י שוטר סמוי לאחר מבצע שנמשך 18 חודשים. כולל עבירות של ייבוא סם מסוכן, סחר מאורגן, איומים על עד ועבירות נשק.',
  facts: [
    'במהלך השנים 2024–2025 פעל בתחנת המשטרה המרכזית צפון שוטר סמוי (להלן: "העד המוגן"), אשר הושתל בארגון.',
    'לפי כתב האישום, הנאשם מס׳ 1 (אלוני) עומד בראש הארגון ומפעיל רשת של נאשמים נוספים בחלוקת סמים, איסוף חובות ואיומים.',
    'במסגרת המבצע תועדו מעל ל-600 שיחות ובוצעו 14 חיפושים בו-זמניים.',
    'נתפסו 42 ק״ג חשיש, 3 ק״ג קוקאין, שני כלי נשק ו-1.2 מיליון ₪ במזומן.',
  ],
  charges: [
    'ראשות בארגון פשיעה — סעיף 2(א) לחוק המאבק בארגוני פשיעה',
    'סחר בסם מסוכן — סעיף 13 לפקודת הסמים המסוכנים',
    'איומים על עד — סעיף 249 לחוק העונשין',
    'נשיאת נשק — סעיף 144 לחוק העונשין',
  ],
  preloadedEvidence: [
    {
      kind: 'document',
      title: 'כתב אישום (עיקרי)',
      description: 'כתב אישום מאוחד כולל 50 נאשמים ו-38 סעיפי אישום.',
      accessLevel: 'all',
    },
    {
      kind: 'confidential_report',
      title: 'דוח סמוי — תיק "צפון" (חסוי)',
      description:
        'דוח מסכם של העד המוגן הכולל ציר זמן של המפגשים, זיהוי נאשמים וקישור לשיחות המוקלטות. חסוי — לשופטים בלבד בשלב זה.',
      accessLevel: 'judges_only',
    },
    {
      kind: 'audio',
      title: 'הקלטה ת/4 — שיחה בין נאשם 1 לנאשם 7',
      description: 'קטע בן 3:21 דק׳ — תיאום עסקה של 5 ק״ג חשיש.',
      accessLevel: 'all',
    },
    {
      kind: 'image',
      title: 'צילום זירה — מחסן רמת הצפון',
      description: 'תפיסת חשיש, נשק ומזומן במהלך חיפוש.',
      accessLevel: 'all',
    },
    {
      kind: 'document',
      title: 'בקשה לצו הגנה על זהות העד הסמוי',
      description: 'מוגש ע"י התביעה בהתאם לסעיף 44 לפקודת הראיות.',
      accessLevel: 'prosecution_only',
    },
  ],
  openingProtocol: [
    {
      role: 'clerk',
      speakerName: 'המזכירה',
      text: 'תיק פלילי 402/26 — המדינה נגד אלוני ו-49 אחרים. הדיון נפתח.',
      entryType: 'system',
    },
    {
      role: 'judge',
      speakerName: 'כב׳ השופט כהן',
      text: 'בוקר טוב. אנא יציגו עצמם ב״כ הצדדים. התביעה?',
      entryType: 'statement',
    },
    {
      role: 'prosecutor',
      speakerName: 'עו״ד לוי (פרקליטות מחוז צפון)',
      text: 'מופיע מטעם המאשימה. אגיש בפתח הדיון בקשה לדיון בדלתיים סגורות לצורך חשיפת דוח סמוי — לשופטים בלבד.',
      entryType: 'statement',
    },
    {
      role: 'defense_lawyer',
      speakerName: 'עו״ד אבוטבול (סנגוריה ציבורית)',
      text: 'אני מתנגד. קיימת פגיעה בזכות העיון של ההגנה וקיימת חובה לחשוף את החומר המהותי בתמצית מאושרת.',
      entryType: 'objection',
    },
    {
      role: 'judge',
      speakerName: 'כב׳ השופט כהן',
      text: 'אשמע את הצדדים על הבקשה. מוגדר בזאת כי הדיון על הבקשה יתקיים בדלתיים סגורות.',
      entryType: 'ruling',
    },
  ],
}

import { APPEAL_CASE, CONTRACT_CASE, RAPE_CASE, TORT_CASE } from './moreCases'

export const CASE_TEMPLATES: CourtroomCaseTemplate[] = [
  UNDERCOVER_CASE,
  RAPE_CASE,
  TORT_CASE,
  CONTRACT_CASE,
  APPEAL_CASE,
]

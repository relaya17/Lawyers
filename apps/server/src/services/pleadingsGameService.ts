/**
 * שירות משחק כתבי טענות — מחולל תיקים, מעריך טענות, ומאמן על שפה משפטית מדויקת.
 * תומך בשלבי: חקירה, כתב אישום, הגנה, דיון הוכחות, גזר דין.
 */

export type CaseCategory =
  | 'assault'
  | 'theft'
  | 'fraud'
  | 'homicide'
  | 'drug'
  | 'weapon'
  | 'traffic'
  | 'financial';

export type GameStage =
  | 'investigation'   // חקירה — עיון בחומר ראיות
  | 'indictment'      // כתב אישום
  | 'defense_response'// תגובת סנגוריה
  | 'pretrial'        // קדם משפט
  | 'evidence'        // דיון הוכחות
  | 'summation'       // סיכומים
  | 'verdict';        // גזר דין

export type PlayerRole = 'prosecutor' | 'defense' | 'judge';
export type Difficulty = 'easy' | 'medium' | 'hard';

export interface CaseEvidence {
  id: string;
  type: 'witness' | 'document' | 'forensic' | 'cctv' | 'financial';
  description: string;
  strength: 'strong' | 'medium' | 'weak';
}

export interface CaseScenario {
  id: string;
  category: CaseCategory;
  difficulty: Difficulty;
  title: string;
  facts: string;
  charges: string[];
  evidence: CaseEvidence[];
  defendant: string;
  prosecutor: string;
  court: string;
  fundamentalRightsAtRisk: string[];
  maxSentence: string;
}

export interface EvaluationResult {
  score: number; // 0-100
  breakdown: {
    factualAccuracy: number;    // דיוק עובדתי
    legalClarity: number;       // בהירות משפטית
    brevity: number;            // תמציתיות
    fundamentalRights: number;  // זכויות יסוד
    legalLanguage: number;      // שפה משפטית
    logicalOrder: number;       // סדר הגיוני
  };
  feedback: string;
  improvements: string[];
  strongPoints: string[];
  suggestedPhrases: string[];
  grade: 'מצוין' | 'טוב' | 'עובר' | 'נכשל';
}

export interface HintResponse {
  hint: string;
  examplePhrase: string;
  legalBasis?: string;
}

// ────────────────────────────────────────────────────
// תיקים מוכנים לאימון (ללא OpenAI)
// ────────────────────────────────────────────────────
const CASE_BANK: CaseScenario[] = [
  {
    id: 'assault-01',
    category: 'assault',
    difficulty: 'easy',
    title: 'תקיפה הגורמת חבלה',
    court: 'בית משפט שלום, תל אביב',
    defendant: 'משה כהן, יליד 1985',
    prosecutor: 'עו"ד רונית לוי, פרקליטות מחוז תל אביב',
    facts: `ביום 15.3.2025, בשעה 23:15, בכיכר המדינה תל אביב, תקף הנאשם משה כהן את המתלונן יצחק לוי ללא כל פרובוקציה מוקדמת. הנאשם הנחית מכה בידו הימנית לאזור הפנים של המתלונן, שנפל ארצה. הנאשם המשיך ובעט בגופו של המתלונן פעמיים. המתלונן אושפז בבית חולים איכילוב וסבל משבר ביצע גבה ופגיעה בעין שמאל. שני עדים ראו את האירוע, ותיעוד מצלמת אבטחה בשעה 23:17 הוגש כראיה.`,
    charges: [
      'תקיפה הגורמת חבלה של ממש (סעיף 380 לחוק העונשין)',
      'איומים (סעיף 192 לחוק העונשין)',
    ],
    evidence: [
      { id: 'e1', type: 'cctv', description: 'הקלטת מצלמת אבטחה 23:17-23:19', strength: 'strong' },
      { id: 'e2', type: 'witness', description: 'עד ראייה — שרה מזרחי, עמדה 3 מטר מהמקרה', strength: 'strong' },
      { id: 'e3', type: 'witness', description: 'עד ראייה — דוד אברהם, עמד 10 מטר', strength: 'medium' },
      { id: 'e4', type: 'forensic', description: 'דו"ח רפואי — שבר ביצע גבה, פגיעה בעין שמאל', strength: 'strong' },
      { id: 'e5', type: 'document', description: 'תצהיר המתלונן', strength: 'medium' },
    ],
    fundamentalRightsAtRisk: [
      'כבוד האדם וחירותו (חוק יסוד)',
      'שלמות הגוף',
      'חזקת החפות',
      'זכות לייצוג משפטי',
    ],
    maxSentence: '3 שנות מאסר',
  },
  {
    id: 'fraud-01',
    category: 'fraud',
    difficulty: 'medium',
    title: 'הונאה בכרטיסי אשראי',
    court: 'בית משפט מחוזי, חיפה',
    defendant: 'אלון שפירא, יליד 1978',
    prosecutor: 'עו"ד מיכל גרין, פרקליטות מחוז חיפה',
    facts: `בין ינואר 2024 לדצמבר 2024, ביצע הנאשם אלון שפירא סדרת עסקאות מרמה תוך שימוש בפרטי כרטיסי אשראי של 47 נפגעים שנגנבו ממסד נתונים של עסק אינטרנטי. הנאשם ביצע רכישות בסך כולל של 340,000 ש"ח. הנאשם פעל דרך חשבונות בנק רשומים על שם "קשיות" שניצל. פירוט עסקאות הוגש כראיה כספית, וניתוח של IP מחשביו של הנאשם הצביע על מיקום ביצוע העסקאות בדירתו.`,
    charges: [
      'הונאה (סעיף 415 לחוק העונשין)',
      'זיוף (סעיף 418 לחוק העונשין)',
      'שימוש בכרטיס חיוב ללא רשות (חוק כרטיסי חיוב, סעיף 6)',
    ],
    evidence: [
      { id: 'e1', type: 'financial', description: 'ניתוח 340,000 ש"ח עסקאות — 47 נפגעים', strength: 'strong' },
      { id: 'e2', type: 'forensic', description: 'ניתוח IP — כתובת מוודאת לדירת הנאשם', strength: 'strong' },
      { id: 'e3', type: 'document', description: 'רשומות חשבונות בנק ה"קשיות"', strength: 'medium' },
      { id: 'e4', type: 'witness', description: 'מנהל אבטחת מידע של החברה הנפגעת', strength: 'medium' },
    ],
    fundamentalRightsAtRisk: [
      'חזקת החפות',
      'הזכות לפרטיות',
      'זכות השתיקה',
      'זכות לייצוג הוגן',
    ],
    maxSentence: '5 שנות מאסר',
  },
  {
    id: 'homicide-01',
    category: 'homicide',
    difficulty: 'hard',
    title: 'גרם מוות ברשלנות',
    court: 'בית משפט מחוזי, ירושלים',
    defendant: 'יוסף בן דוד, יליד 1970',
    prosecutor: 'עו"ד נועה אביב, פרקליטות מחוז ירושלים',
    facts: `ביום 1.7.2025, בשעה 21:45, נהג הנאשם יוסף בן דוד ברכבו בכביש 1 ליד ירושלים בשעה שהיה שתוי (רמת אלכוהול 1.8 מ"ג לליטר — פי שלושה מהמותר). הנאשם חצה את קו האמצע ופגע ברכב שנסע בכיוון הנגדי. הנהג של הרכב הנגדי, אברהם חדד (44), נפטר בפגיעה. שני ילדיו של חדד (בגיל 8 ו-10) אושפזו בנפגעים בינוניים. בדיקת נשיפה בוצעה בזירה. מצלמת קצה ברכב הנאשם תיעדה את הנהיגה.`,
    charges: [
      'גרם מוות ברשלנות (סעיף 304 לחוק העונשין)',
      'נהיגה בשכרות (סעיף 62(3) לפקודת התעבורה)',
      'גרם חבלה חמורה (סעיף 333 לחוק העונשין)',
    ],
    evidence: [
      { id: 'e1', type: 'forensic', description: 'בדיקת נשיפה — 1.8 מ"ג/ל', strength: 'strong' },
      { id: 'e2', type: 'cctv', description: 'מצלמת קצה ברכב — תיעוד מלא', strength: 'strong' },
      { id: 'e3', type: 'forensic', description: 'חוות דעת שמאי תאונות', strength: 'strong' },
      { id: 'e4', type: 'document', description: 'תיק בית חולים הדסה — נפטר', strength: 'strong' },
      { id: 'e5', type: 'witness', description: 'עד ראייה — נהג נוסף בכביש', strength: 'medium' },
    ],
    fundamentalRightsAtRisk: [
      'הזכות לחיים',
      'שלמות הגוף',
      'חזקת החפות',
      'זכות השתיקה',
      'כבוד האדם גם בשלב ניכוי העונש',
    ],
    maxSentence: '12 שנות מאסר',
  },
  {
    id: 'drug-01',
    category: 'drug',
    difficulty: 'medium',
    title: 'סחר בסמים מסוכנים',
    court: 'בית משפט מחוזי, באר שבע',
    defendant: 'רמי אוחיון, יליד 1990',
    prosecutor: 'עו"ד איל מור, פרקליטות מחוז דרום',
    facts: `ב-20.8.2025 עצרה משטרת ישראל את הנאשם רמי אוחיון ברחוב הנשיא, באר שבע. בחיפוש גופני נמצאו ברשותו 30 גרם קוקאין (מחולקים ל-30 שקיות) ו-5,000 ש"ח מזומן. בחיפוש בדירתו נמצאו 150 גרם קנאביס, 200 גרם מתאמפטמין, ציוד אריזה, ומאזניים דיגיטליים. ניתוח תקשורת סלולרית הצביע על 87 שיחות ב-30 הימים האחרונים המצביעות על פעילות מכירה. שני לקוחות זוהו ומסרו עדות.`,
    charges: [
      'סחר בסמים מסוכנים (סעיף 13 לפקודת הסמים המסוכנים)',
      'החזקת סם מסוכן שלא לשימוש עצמי (סעיף 7(א))',
    ],
    evidence: [
      { id: 'e1', type: 'forensic', description: 'ממצאי חיפוש — סמים וציוד', strength: 'strong' },
      { id: 'e2', type: 'forensic', description: 'ניתוח תקשורת — 87 שיחות חשודות', strength: 'strong' },
      { id: 'e3', type: 'witness', description: 'שני לקוחות מזוהים — עדות', strength: 'medium' },
      { id: 'e4', type: 'document', description: '5,000 ש"ח מזומן — כסף סמים', strength: 'medium' },
    ],
    fundamentalRightsAtRisk: [
      'חזקת החפות',
      'זכות הפרטיות בדירה',
      'איסור חיפוש שלא כדין',
      'זכות לייצוג',
    ],
    maxSentence: '20 שנות מאסר',
  },
];

// ────────────────────────────────────────────────────
// עזרים לשפה משפטית
// ────────────────────────────────────────────────────
export const LEGAL_PHRASES: Record<GameStage, string[]> = {
  investigation: [
    'לאחר עיון מעמיק בחומר הראיות',
    'מכלול הראיות מצביע על כך ש-',
    'יסוד מוצק לאחריות פלילית',
    'ראיות נסיבתיות מחזקות',
  ],
  indictment: [
    'הנאשם מואשם בזאת כי',
    'בניגוד לסעיף X לחוק העונשין',
    'ביודעין ובכוונה תחילה',
    'ביצע את המעשה הבא:',
    'ובכך עבר עבירה לפי סעיף',
    'הנסיבות המחמירות כוללות',
    'חומרת המעשה מחייבת',
  ],
  defense_response: [
    'הנאשם מכחיש מכל וכל',
    'הראיות שהוגשו אינן מספקות',
    'ספק סביר מתעורר ביחס ל-',
    'עקרון חזקת החפות מחייב',
    'ביטול כתב האישום מחמת',
    'קיים פגם מהותי בכתב האישום',
  ],
  pretrial: [
    'בקשה לגילוי ראיות',
    'פסילת ראיות שהושגו שלא כדין',
    'טענת "אין להשיב לאשמה"',
    'שינוי מקום הדיון בשל',
    'הפרת זכויות חוקתיות בחקירה',
  ],
  evidence: [
    'אני מבקש להגיש את הראיה',
    'עדות זו אינה קבילה מאחר ש-',
    'חקירה נגדית מגלה ש-',
    'הסתירות בגרסת העד מוכיחות',
    'ראיה פורנזית מוכיחה כי',
  ],
  summation: [
    'מכלול הראיות מצביע חד-משמעית על',
    'לא נותר ספק סביר כי הנאשם',
    'ביצוע העבירה הוכח מעבר לספק',
    'אנו מבקשים להרשיע את הנאשם ב-',
    'ובשים לב לחומרת המעשה',
  ],
  verdict: [
    'לאחר שקלנו את מכלול הראיות',
    'בית המשפט קובע ומצהיר',
    'הנאשם הורשע/זוכה מעבירה של',
    'בנסיבות המחמירות הבאות:',
    'בית המשפט גוזר על הנאשם',
    'תוך מתן דגש לשיקולי הרתעה',
  ],
};

export const FUNDAMENTAL_RIGHTS = [
  {
    name: 'חזקת החפות',
    law: 'עקרון יסוד — פסיקה עקבית',
    description: 'כל אדם חף מפשע עד שהוכחה אשמתו. הנטל על התביעה.',
    relevantStages: ['indictment', 'defense_response', 'evidence', 'summation'],
  },
  {
    name: 'כבוד האדם וחירותו',
    law: 'חוק יסוד: כבוד האדם וחירותו (1992)',
    description: 'הגנה חוקתית על האוטונומיה האישית, כבוד הפרט ושלמות הגוף.',
    relevantStages: ['indictment', 'pretrial', 'verdict'],
  },
  {
    name: 'זכות השתיקה',
    law: 'סעיף 47 לפקודת הראיות',
    description: 'הנאשם אינו חייב להפליל את עצמו. שתיקה אינה ראיה לאשמה.',
    relevantStages: ['investigation', 'indictment', 'evidence'],
  },
  {
    name: 'זכות ייצוג משפטי',
    law: 'סעיף 15 לחוק סדר הדין הפלילי',
    description: 'כל נאשם זכאי לעורך דין. ללא ייצוג — ניהול משפט לקוי.',
    relevantStages: ['investigation', 'pretrial', 'evidence'],
  },
  {
    name: 'איסור עינויים וכפייה',
    law: 'חוק יסוד + אמנת האו"ם',
    description: 'ראיות שהושגו בכפייה — פסולות. חקירה בלתי חוקית פוגעת בקבילות.',
    relevantStages: ['investigation', 'pretrial', 'evidence'],
  },
  {
    name: 'זכות לשימוע הוגן',
    law: 'עקרון צדק טבעי — פסיקה',
    description: 'כל צד חייב לקבל הזדמנות להציג טיעוניו לפני קבלת החלטה.',
    relevantStages: ['pretrial', 'evidence', 'summation', 'verdict'],
  },
  {
    name: 'איסור ראיות פסולות',
    law: 'סעיף 12 לפקודת הראיות',
    description: 'הודאה שהושגה בלחץ — פסולה. בית המשפט רשאי לפסול ראיה.',
    relevantStages: ['pretrial', 'evidence'],
  },
];

// ────────────────────────────────────────────────────
// פונקציות ראשיות
// ────────────────────────────────────────────────────

export function getCaseById(id: string): CaseScenario | null {
  return CASE_BANK.find((c) => c.id === id) ?? null;
}

export function getCasesByDifficulty(difficulty: Difficulty): CaseScenario[] {
  return CASE_BANK.filter((c) => c.difficulty === difficulty);
}

export function getAllCases(): CaseScenario[] {
  return CASE_BANK;
}

export function getHintForStage(stage: GameStage, role: PlayerRole): HintResponse {
  const phrases = LEGAL_PHRASES[stage] ?? [];
  const hint = generateHintText(stage, role);
  return {
    hint,
    examplePhrase: phrases[Math.floor(Math.random() * phrases.length)] ?? '',
    legalBasis: getLegalBasisForStage(stage),
  };
}

function generateHintText(stage: GameStage, role: PlayerRole): string {
  const hints: Record<GameStage, Record<PlayerRole, string>> = {
    investigation: {
      prosecutor: 'בדוק את הראיות לפי חוזקן. ראיות ישירות > נסיבתיות. ודא שיש מספיק ראיות להרשעה.',
      defense: 'חפש חסרים בשרשרת הראיות. האם יש ספק סביר? האם נשמרו זכויות הנאשם בחקירה?',
      judge: 'בחן אם יש ראיות לכאורה המצדיקות הגשת כתב אישום.',
    },
    indictment: {
      prosecutor: 'כתב אישום טוב: עובדות ברורות, תאריכים מדויקים, הפניה לסעיפי חוק ספציפיים. קצר ומדויק.',
      defense: 'בדוק פגמים טכניים: האם הסעיפים המאוזכרים תואמים לעובדות? האם חסרות עובדות מהותיות?',
      judge: 'וודא שכתב האישום עומד בדרישות סעיף 85 לחוק סדר הדין הפלילי.',
    },
    defense_response: {
      prosecutor: 'ענה לטענות ההגנה תוך הפניה לראיות. הבהר מדוע כל ספק נוגד.',
      defense: 'הדגש: חזקת החפות, ספק סביר, פגמים בחקירה, ראיות שיש לפסול.',
      judge: 'בחן אם טענות ההגנה מצדיקות דיון נוסף.',
    },
    pretrial: {
      prosecutor: 'התנגד לפסילת ראיות. הוכח שהחקירה נעשתה כדין ושהראיות קבילות.',
      defense: 'הגש בקשות לפסילת ראיות, גילוי ראיות, ביטול אישומים. עגן בזכויות חוקתיות.',
      judge: 'הכרע בבקשות הקדם-משפטיות תוך איזון בין אינטרס הציבור לזכויות הנאשם.',
    },
    evidence: {
      prosecutor: 'הגש ראיות לפי סדר הגיוני. חקור עדים בצורה ממוקדת. הפרך את גרסת ההגנה.',
      defense: 'חקור נגדי אפקטיבי — חפש סתירות. הזכר חזקת החפות לאורך כל הדיון.',
      judge: 'בחן קבילות ומשקל כל ראיה. שמור על ניהול דיון תקין.',
    },
    summation: {
      prosecutor: 'סכם את מכלול הראיות. הצג את תמונת המצב הכוללת. בקש עונש ראוי.',
      defense: 'הדגש כל ספק שנותר. הוכח שהתביעה לא הרימה את הנטל. בקש זיכוי.',
      judge: 'הכן פסיקה המנמקת את ההחלטה לאור הראיות וזכויות הנאשם.',
    },
    verdict: {
      prosecutor: 'הצג עמדה לגבי גזר הדין: חומרת העבירה, נסיבות, שיקולי הרתעה.',
      defense: 'טען לנסיבות מקלות: עבר נקי, גיל, מצב כלכלי, אחריות משפחתית.',
      judge: 'גזור עונש מידתי תוך איזון בין הרתעה, שיקום, וכבוד האדם.',
    },
  };
  return hints[stage]?.[role] ?? 'כתוב טענה משפטית ברורה וממוקדת.';
}

function getLegalBasisForStage(stage: GameStage): string {
  const basis: Record<GameStage, string> = {
    investigation: 'סעיף 59 לחסד"פ — סמכות פתיחה בחקירה',
    indictment: 'סעיפים 85-96 לחוק סדר הדין הפלילי — הגשת כתב אישום',
    defense_response: 'סעיף 97 לחסד"פ — תגובה לכתב אישום',
    pretrial: 'סעיפים 142-150 לחסד"פ — בקשות קדם-משפטיות',
    evidence: 'פקודת הראיות [נוסח חדש] — קבילות ומשקל ראיות',
    summation: 'סעיף 194 לחסד"פ — סיכומים',
    verdict: 'סעיפים 40-43 לחוק העונשין — גזירת עונש',
  };
  return basis[stage] ?? '';
}

// ────────────────────────────────────────────────────
// הערכת כתב טענות
// ────────────────────────────────────────────────────
export function evaluatePleadingLocally(
  text: string,
  stage: GameStage,
  role: PlayerRole,
  caseScenario: CaseScenario,
): EvaluationResult {
  const wordCount = text.trim().split(/\s+/).length;
  const sentences = text.split(/[.!?]/).filter((s) => s.trim().length > 5);

  // מדדים בסיסיים
  const hasLegalSection = /סעיף\s*\d+|לחוק|לפקודה|לפי הדין/.test(text);
  const hasDates = /\d{1,2}[.\/]\d{1,2}[.\/]\d{2,4}/.test(text);
  const hasDefendantName = text.includes(caseScenario.defendant.split(',')[0]);
  const hasFundamentalRight = FUNDAMENTAL_RIGHTS.some((r) =>
    text.includes(r.name.split(' ')[0]),
  );
  const relevantPhrases = LEGAL_PHRASES[stage]?.filter((p) =>
    text.toLowerCase().includes(p.toLowerCase().split(' ')[0]),
  ) ?? [];
  const hasCharges = caseScenario.charges.some((c) =>
    text.includes(c.split('(')[0].trim().slice(0, 10)),
  );

  // ניקוד
  let factualAccuracy = 40;
  if (hasDefendantName) factualAccuracy += 15;
  if (hasDates) factualAccuracy += 15;
  if (hasCharges) factualAccuracy += 20;
  if (wordCount > 50) factualAccuracy += 10;
  factualAccuracy = Math.min(100, factualAccuracy);

  let legalClarity = 30;
  if (hasLegalSection) legalClarity += 30;
  if (sentences.length >= 3) legalClarity += 20;
  if (relevantPhrases.length > 0) legalClarity += 20;
  legalClarity = Math.min(100, legalClarity);

  let brevity = 100;
  if (wordCount > 300) brevity -= 20;
  if (wordCount > 500) brevity -= 20;
  if (wordCount < 30) brevity = 30;

  const fundamentalRights = hasFundamentalRight ? 80 : 40;
  const legalLanguage = relevantPhrases.length >= 2 ? 85 : relevantPhrases.length === 1 ? 60 : 35;
  const logicalOrder = sentences.length >= 3 && wordCount > 40 ? 75 : 45;

  const score = Math.round(
    (factualAccuracy * 0.25 +
      legalClarity * 0.25 +
      brevity * 0.15 +
      fundamentalRights * 0.15 +
      legalLanguage * 0.1 +
      logicalOrder * 0.1),
  );

  const grade =
    score >= 85 ? 'מצוין' : score >= 70 ? 'טוב' : score >= 55 ? 'עובר' : 'נכשל';

  const improvements: string[] = [];
  if (!hasLegalSection) improvements.push('הוסף הפניה לסעיף חוק ספציפי');
  if (!hasDates) improvements.push('ציין תאריכים ושעות מדויקים מהתיק');
  if (!hasFundamentalRight) improvements.push('הזכר זכות יסוד רלוונטית (כגון: חזקת החפות)');
  if (wordCount < 50) improvements.push('הרחב את הטיעון — יש לפחות 50 מילים לכתב טענות בסיסי');
  if (relevantPhrases.length === 0) improvements.push('השתמש בשפה משפטית מדויקת — ראה ביטויים מומלצים');

  const strongPoints: string[] = [];
  if (hasDefendantName) strongPoints.push('ציון שם הנאשם המדויק ✓');
  if (hasLegalSection) strongPoints.push('הפניה לסעיפי חוק ✓');
  if (hasFundamentalRight) strongPoints.push('מודעות לזכויות יסוד ✓');
  if (wordCount >= 50 && wordCount <= 300) strongPoints.push('אורך מאוזן ✓');

  return {
    score,
    breakdown: {
      factualAccuracy,
      legalClarity,
      brevity,
      fundamentalRights,
      legalLanguage,
      logicalOrder,
    },
    feedback: generateFeedback(score, stage, role),
    improvements,
    strongPoints,
    suggestedPhrases: LEGAL_PHRASES[stage]?.slice(0, 4) ?? [],
    grade,
  };
}

function generateFeedback(score: number, stage: GameStage, role: PlayerRole): string {
  if (score >= 85) {
    return `מצוין! כתב הטענות שלך ב${stageToHebrew(stage)} מדויק, ממוקד וכתוב בשפה משפטית מקצועית. ${role === 'prosecutor' ? 'התביעה מוצגת בצורה עקבית וחזקה.' : 'ההגנה מנוסחת בחדות ובהגיון.'}`;
  }
  if (score >= 70) {
    return `טוב! יש בסיס טוב לכתב הטענות. שיפורים קטנים ישדרגו אותו לרמה מקצועית גבוהה יותר.`;
  }
  if (score >= 55) {
    return `עובר — הכיוון נכון אך חסרים מרכיבים משפטיים חשובים. שים לב לשפה המשפטית ולהפניה לחוק.`;
  }
  return `יש לשפר — כתב הטענות צריך להיות מדויק יותר מבחינה עובדתית ומשפטית. נסה שוב עם הביטויים המוצעים.`;
}

function stageToHebrew(stage: GameStage): string {
  const map: Record<GameStage, string> = {
    investigation: 'שלב החקירה',
    indictment: 'כתב האישום',
    defense_response: 'תגובת ההגנה',
    pretrial: 'קדם המשפט',
    evidence: 'דיון ההוכחות',
    summation: 'הסיכומים',
    verdict: 'גזר הדין',
  };
  return map[stage] ?? stage;
}

// ────────────────────────────────────────────────────
// הערכה עם AI (אם OpenAI זמין)
// ────────────────────────────────────────────────────
export async function evaluatePleadingWithAI(
  text: string,
  stage: GameStage,
  role: PlayerRole,
  caseScenario: CaseScenario,
): Promise<EvaluationResult> {
  const apiKey = process.env.OPENAI_API_KEY?.trim();
  if (!apiKey) {
    return evaluatePleadingLocally(text, stage, role, caseScenario);
  }

  const systemPrompt = `אתה שופט ישראלי מנוסה ומרצה למשפטים. תפקידך להעריך כתבי טענות של סטודנטים למשפטים.
הערך את כתב הטענות לפי 6 קריטריונים (0-100 כל אחד):
1. דיוק עובדתי — האם העובדות מדויקות ומתאימות לתיק?
2. בהירות משפטית — הפניה לסעיפי חוק, מבנה ברור
3. תמציתיות — ממוצע וממוקד, ללא מידע מיותר
4. זכויות יסוד — מודעות לזכויות חוקתיות רלוונטיות
5. שפה משפטית — שימוש בטרמינולוגיה משפטית מדויקת
6. סדר לוגי — הגיון ורצף ברור

ענה בפורמט JSON בלבד.`;

  const userPrompt = `תיק: ${caseScenario.title}
עובדות: ${caseScenario.facts.slice(0, 300)}
שלב: ${stageToHebrew(stage)}
תפקיד: ${role === 'prosecutor' ? 'תובע' : role === 'defense' ? 'סנגור' : 'שופט'}

כתב הטענות שהוגש:
"${text}"

הערך והחזר JSON עם המבנה:
{
  "factualAccuracy": number,
  "legalClarity": number,
  "brevity": number,
  "fundamentalRights": number,
  "legalLanguage": number,
  "logicalOrder": number,
  "feedback": "string",
  "improvements": ["string"],
  "strongPoints": ["string"]
}`;

  try {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        response_format: { type: 'json_object' },
        temperature: 0.3,
        max_tokens: 800,
      }),
    });

    if (!res.ok) throw new Error(`OpenAI ${res.status}`);
    const data = (await res.json()) as {
      choices: Array<{ message: { content: string } }>;
    };
    const parsed = JSON.parse(data.choices[0].message.content) as {
      factualAccuracy: number;
      legalClarity: number;
      brevity: number;
      fundamentalRights: number;
      legalLanguage: number;
      logicalOrder: number;
      feedback: string;
      improvements: string[];
      strongPoints: string[];
    };

    const score = Math.round(
      parsed.factualAccuracy * 0.25 +
      parsed.legalClarity * 0.25 +
      parsed.brevity * 0.15 +
      parsed.fundamentalRights * 0.15 +
      parsed.legalLanguage * 0.1 +
      parsed.logicalOrder * 0.1,
    );
    const grade = score >= 85 ? 'מצוין' : score >= 70 ? 'טוב' : score >= 55 ? 'עובר' : 'נכשל';

    return {
      score,
      breakdown: {
        factualAccuracy: parsed.factualAccuracy,
        legalClarity: parsed.legalClarity,
        brevity: parsed.brevity,
        fundamentalRights: parsed.fundamentalRights,
        legalLanguage: parsed.legalLanguage,
        logicalOrder: parsed.logicalOrder,
      },
      feedback: parsed.feedback,
      improvements: parsed.improvements,
      strongPoints: parsed.strongPoints,
      suggestedPhrases: LEGAL_PHRASES[stage]?.slice(0, 4) ?? [],
      grade,
    };
  } catch {
    return evaluatePleadingLocally(text, stage, role, caseScenario);
  }
}

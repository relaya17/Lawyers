/**
 * aiProgressService — ניתוח מקומי של דפוסי כישלון + המלצות מותאמות אישית בעברית
 * לא דורש שרת — מחשב הכל בצד הלקוח
 */
import type { TopicStats, UserLearningProfile } from '../store/useUserProgressStore'

// ─── מיפוי נושאים לעצות + שאלות חיזוק ──────────────────────────────────────

export interface ReinforcementQuestion {
  id: string
  text: string
  options: { id: string; label: string }[]
  correctId: string
  explanation: string
  topic: string
  subTopic: string
}

export interface AIInsight {
  overallMessage: string           // הודעה כללית מותאמת
  level: 'beginner' | 'intermediate' | 'advanced'
  weakAreaMessages: { topic: string; message: string; tip: string }[]
  reinforcementQuestions: ReinforcementQuestion[]
  nextStepLabel: string            // המלצה לשלב הבא ("התמקד ב...")
  motivationalQuote: string
  strengthAreas: string[]
}

// ─── בנק שאלות חיזוק לפי נושא ───────────────────────────────────────────────

const REINFORCEMENT_BANK: Record<string, ReinforcementQuestion[]> = {
  'דיני חוזים': [
    {
      id: 'rc_contracts_1',
      text: 'אדם חתם על חוזה תחת אונס. מה תוקף החוזה?',
      options: [
        { id: 'a', label: 'בטל מעיקרו (void)' },
        { id: 'b', label: 'ניתן לביטול (voidable) על ידי הנפגע' },
        { id: 'c', label: 'תקף לגמרי' },
        { id: 'd', label: 'תלוי בסכום החוזה' },
      ],
      correctId: 'b',
      explanation: 'חוזה שנעשה תחת אונס הוא ניתן לביטול (לא בטל מעיקרו) — הנפגע רשאי לבטלו אך גם לאשרו. סעיף 17 לחוק החוזים.',
      topic: 'דיני חוזים',
      subTopic: 'פגמי גמירות דעת',
    },
    {
      id: 'rc_contracts_2',
      text: 'מהו ה"קיבול" כמרכיב ההסכם?',
      options: [
        { id: 'a', label: 'הצעה שנשלחה לצד שני' },
        { id: 'b', label: 'הסכמה מוחלטת ובלתי-מסויגת להצעה' },
        { id: 'c', label: 'חתימה על מסמך בלבד' },
        { id: 'd', label: 'תשלום מקדמה' },
      ],
      correctId: 'b',
      explanation: 'קיבול הוא הסכמה מוחלטת ובלתי-מסויגת. קיבול מסויג נחשב הצעה נגדית. סעיף 6 לחוק החוזים.',
      topic: 'דיני חוזים',
      subTopic: 'כריתת חוזה',
    },
    {
      id: 'rc_contracts_3',
      text: 'מה ההבדל בין "הפרה יסודית" ל"הפרה לא יסודית"?',
      options: [
        { id: 'a', label: 'הפרה יסודית מאפשרת ביטול מיידי; לא יסודית מחייבת הודעה ומתן ארכה' },
        { id: 'b', label: 'אין הבדל — שתיהן מאפשרות ביטול מיידי' },
        { id: 'c', label: 'הפרה לא יסודית מאפשרת ביטול; יסודית לא' },
        { id: 'd', label: 'רק הפרה יסודית מזכה בפיצויים' },
      ],
      correctId: 'a',
      explanation: 'הפרה יסודית (סע׳ 6 לחוק התרופות) מאפשרת ביטול מיידי. הפרה לא יסודית מחייבת מתן הודעה ו-14 יום ארכה לפחות (סע׳ 7).',
      topic: 'דיני חוזים',
      subTopic: 'הפרת חוזה',
    },
  ],
  'דיני עונשין': [
    {
      id: 'rc_criminal_1',
      text: 'מהו "mens rea" — יסוד נפשי — בדיני עונשין?',
      options: [
        { id: 'a', label: 'ביצוע הפעולה הפיזית בלבד' },
        { id: 'b', label: 'כוונה, פזיזות, רשלנות או אדישות' },
        { id: 'c', label: 'תוצאת המעשה' },
        { id: 'd', label: 'היסוד הטכני של העבירה' },
      ],
      correctId: 'b',
      explanation: 'ה-mens rea הוא היסוד הנפשי — כוונה (מחשבה פלילית), פזיזות, רשלנות או אדישות. ללא יסוד נפשי (בד״כ) אין אחריות פלילית. סע׳ 19–21 לחוק העונשין.',
      topic: 'דיני עונשין',
      subTopic: 'יסודות העבירה',
    },
    {
      id: 'rc_criminal_2',
      text: 'אדם ביצע מעשה בסברה מוטעית שהיה מותר — איזו הגנה רלוונטית?',
      options: [
        { id: 'a', label: 'צו מוסמך' },
        { id: 'b', label: 'טעות במצב הדברים (mistake of fact)' },
        { id: 'c', label: 'קטינות' },
        { id: 'd', label: 'אי-שפיות' },
      ],
      correctId: 'b',
      explanation: 'טעות במצב הדברים (סע׳ 34יח לחוק העונשין) — אם הנאשם טעה לגבי עובדות שאם היו נכונות לא הייתה עבירה, יכולה לשמש הגנה (לרוב מלאה אם הטעות הייתה סבירה).',
      topic: 'דיני עונשין',
      subTopic: 'הגנות',
    },
  ],
  'משפט חוקתי': [
    {
      id: 'rc_const_1',
      text: 'מהי "פסקת ההגבלה" בחוקי היסוד?',
      options: [
        { id: 'a', label: 'איסור על פרשנות הרחבה של זכויות' },
        { id: 'b', label: 'תנאים שבהם מותר לפגוע בזכות חוקתית בחקיקה רגילה' },
        { id: 'c', label: 'סמכות בית המשפט לבטל חוק' },
        { id: 'd', label: 'הגבלת תקציב המדינה' },
      ],
      correctId: 'b',
      explanation: 'פסקת ההגבלה (סע׳ 8 לחוק יסוד כבוד האדם וחירותו) קובעת שניתן לפגוע בזכות חוקתית רק בחוק, ההולם את ערכי המדינה, לתכלית ראויה, ובמידה שאינה עולה על הנדרש.',
      topic: 'משפט חוקתי',
      subTopic: 'חוקי יסוד',
    },
  ],
  'משפט מינהלי': [
    {
      id: 'rc_admin_1',
      text: 'מהי "עילת חוסר הסמכות" בביקורת שיפוטית מינהלית?',
      options: [
        { id: 'a', label: 'הרשות פעלה מחוץ לגדר הסמכות שהחוק העניק לה' },
        { id: 'b', label: 'הרשות הגיעה למסקנה שגויה' },
        { id: 'c', label: 'ההחלטה לא הייתה מוצלחת מבחינה מעשית' },
        { id: 'd', label: 'לא נערך שימוע מוקדם' },
      ],
      correctId: 'a',
      explanation: 'חוסר סמכות (ultra vires) — הרשות פעלה מעבר לסמכות הסטטוטורית שניתנה לה. זו עילת ביקורת בסיסית המאפשרת לביהמ"ש לבטל את ההחלטה.',
      topic: 'משפט מינהלי',
      subTopic: 'ביקורת שיפוטית',
    },
    {
      id: 'rc_admin_2',
      text: 'מהו "שימוע" בדיני מינהל?',
      options: [
        { id: 'a', label: 'כל פגישה בין האזרח לרשות' },
        { id: 'b', label: 'זכות האזרח להשמיע את עמדתו לפני החלטה מינהלית הפוגעת בו' },
        { id: 'c', label: 'הליך בית משפט מינהלי' },
        { id: 'd', label: 'ערר על החלטה שניתנה' },
      ],
      correctId: 'b',
      explanation: 'זכות השימוע (audi alteram partem) — עיקרון יסוד של הצדק הטבעי: לפני פגיעה משמעותית בזכות או אינטרס של אדם, חייבת הרשות לשמוע את עמדתו.',
      topic: 'משפט מינהלי',
      subTopic: 'עקרונות הצדק הטבעי',
    },
  ],
  'דיני נזיקין': [
    {
      id: 'rc_tort_1',
      text: 'מהם ארבעת היסודות לעוולת הרשלנות?',
      options: [
        { id: 'a', label: 'חובת זהירות, הפרתה, נזק, קשר סיבתי' },
        { id: 'b', label: 'כוונה, מעשה, נזק, עד' },
        { id: 'c', label: 'סכנה, מניעה, נזק, פיצוי' },
        { id: 'd', label: 'חוזה, הפרה, נזק, ביטול' },
      ],
      correctId: 'a',
      explanation: 'עוולת הרשלנות: (1) חובת זהירות מושגית וקונקרטית, (2) הפרת החובה, (3) נזק, (4) קשר סיבתי עובדתי ומשפטי. כל ארבעת היסודות חייבים להתקיים.',
      topic: 'דיני נזיקין',
      subTopic: 'רשלנות',
    },
  ],
  'דיני קניין': [
    {
      id: 'rc_prop_1',
      text: 'מה ההבדל בין "בעלות" ל"חזקה" בדיני קניין?',
      options: [
        { id: 'a', label: 'בעלות — זכות משפטית מלאה; חזקה — שליטה פיזית בפועל' },
        { id: 'b', label: 'אין הבדל — המונחים זהים' },
        { id: 'c', label: 'חזקה עדיפה על בעלות תמיד' },
        { id: 'd', label: 'בעלות קיימת רק במקרקעין' },
      ],
      correctId: 'a',
      explanation: 'בעלות היא הזכות המשפטית המלאה לנכס. חזקה היא השליטה הפיזית בפועל. ניתן שיהיו לאדם שונים (למשל: שוכר — חזקה; משכיר — בעלות).',
      topic: 'דיני קניין',
      subTopic: 'זכויות קניין',
    },
  ],
  'דיני עבודה': [
    {
      id: 'rc_labor_1',
      text: 'מהי "פיטורים שלא כדין" בדיני עבודה?',
      options: [
        { id: 'a', label: 'פיטורים ללא שימוע מוקדם, ממניעים פסולים, או בניגוד לחוק' },
        { id: 'b', label: 'פיטורים מכל סיבה שהיא' },
        { id: 'c', label: 'פיטורים ללא פיצויים' },
        { id: 'd', label: 'פיטורים בלי הסכמת העובד' },
      ],
      correctId: 'a',
      explanation: 'פיטורים שלא כדין: ללא שימוע מוקדם, ממניעים פסולים (גזענות, הריון, פעילות ועד), בניגוד לחוק (כגון איסור פיטורים בהריון). מזכים בפיצוי מיוחד.',
      topic: 'דיני עבודה',
      subTopic: 'סיום עבודה',
    },
  ],
  'דיני משפחה': [
    {
      id: 'rc_family_1',
      text: 'מהו "הסכם ממון" בין בני זוג?',
      options: [
        { id: 'a', label: 'הסדרת יחסי הרכוש בין בני הזוג, בכפוף לאישור בית משפט/נוטריון' },
        { id: 'b', label: 'ירושה אחד לשני' },
        { id: 'c', label: 'הסכם שמחייב קבלת ילדים' },
        { id: 'd', label: 'ייפוי כוח הדדי' },
      ],
      correctId: 'a',
      explanation: 'הסכם ממון (חוק יחסי ממון, 1973) — בני זוג יכולים להסדיר את יחסי הרכוש ביניהם בהסכם, אך הוא טעון אישור בית משפט לענייני משפחה או נוטריון כדי שיהיה תקף.',
      topic: 'דיני משפחה',
      subTopic: 'יחסי ממון',
    },
  ],
  'מקורות המשפט': [
    {
      id: 'rc_sources_1',
      text: 'מהו "תקדים מחייב" במשפט הישראלי?',
      options: [
        { id: 'a', label: 'כל פסיקה של כל בית משפט' },
        { id: 'b', label: 'פסיקת בית המשפט העליון המחייבת את הערכאות הנמוכות' },
        { id: 'c', label: 'חוק שאושר בכנסת' },
        { id: 'd', label: 'פסיקה בינלאומית' },
      ],
      correctId: 'b',
      explanation: 'עקרון Stare Decisis: פסיקת בית המשפט העליון מחייבת את כל הערכאות הנמוכות. בית המשפט העליון עצמו אינו מחויב לתקדים קודם שלו, אך נוטה לפעול לפיו למען עקביות.',
      topic: 'מקורות המשפט',
      subTopic: 'תקדים',
    },
  ],
  'פרשנות משפטית': [
    {
      id: 'rc_interp_1',
      text: 'מהי "תכלית חקיקה" בגישת השופט ברק?',
      options: [
        { id: 'a', label: 'מילון לשוני של החוק בלבד' },
        { id: 'b', label: 'המטרות הסובייקטיביות (כוונת המחוקק) והאובייקטיביות (ערכי שיטה) שהחוק נועד לממש' },
        { id: 'c', label: 'הסבר שניתן בדיון בכנסת' },
        { id: 'd', label: 'פרשנות צרה של הטקסט' },
      ],
      correctId: 'b',
      explanation: 'תכלית חקיקה לפי שיטת ברק כוללת את התכלית הסובייקטיבית (כוונת המחוקק ההיסטורית) ואת התכלית האובייקטיבית (ערכים ועקרונות שמשפט ראוי צריך לממש). כאשר הן מתנגשות, התכלית האובייקטיבית עשויה לגבור.',
      topic: 'פרשנות משפטית',
      subTopic: 'שיטות פרשנות',
    },
  ],
}

// ─── הודעות מוטיבציה ──────────────────────────────────────────────────────────

const MOTIVATIONAL_QUOTES = [
  'הדרך לשליטה משפטית מושלמת עוברת דרך כישלון ולמידה. כל שאלה שטעית בה — צעד קדימה.',
  '"כל מומחה היה פעם מתחיל." — המשך לתרגל ותגיע לשם.',
  'המשפט הוא שפה שלומדים מתוך מפגש עם טקסטים, פסקי דין, ו... טעויות.',
  'הישארות בנוחות לא תגרום לצמיחה. המשך לאתגר את עצמך.',
  '"Repetition is the mother of learning" — חזרה על חומר חלש = ידע חזק.',
]

// ─── פונקציית ניתוח מרכזית ───────────────────────────────────────────────────

export function generateAIInsight(
  profile: UserLearningProfile | null,
  topicStats: TopicStats[],
): AIInsight {
  const quote = MOTIVATIONAL_QUOTES[Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length)]

  if (!profile || profile.totalAttempts === 0) {
    return {
      overallMessage: 'ברוך הבא! טרם ניגשת לשאלות. התחל בחינה כלשהי כדי שהמאמן האישי שלך יוכל לנתח את נקודות החוזקה והחולשה שלך.',
      level: 'beginner',
      weakAreaMessages: [],
      reinforcementQuestions: [],
      nextStepLabel: 'בחר בחינה להתחלה',
      motivationalQuote: quote,
      strengthAreas: [],
    }
  }

  const { totalAttempts, totalCorrect } = profile
  const overallRate = totalAttempts > 0 ? totalCorrect / totalAttempts : 0
  const level: AIInsight['level'] =
    overallRate >= 0.75 ? 'advanced' : overallRate >= 0.5 ? 'intermediate' : 'beginner'

  const levelLabel = { beginner: 'מתחיל', intermediate: 'בינוני', advanced: 'מתקדם' }[level]
  const weakTopics = topicStats.filter(t => t.isWeak)
  const strongTopics = topicStats.filter(t => t.successRate >= 70 && t.totalAttempts >= 3)

  const overallMessage =
    weakTopics.length === 0
      ? `כל הכבוד! הגעת לרמת ${levelLabel} עם ${Math.round(overallRate * 100)}% הצלחה. ${
          level === 'advanced' ? 'אתה שולט היטב בחומר. המשך לאתגר את עצמך בנושאים מורכבים.' : 'המשך לתרגל — הנושאים החלשים ממתינים לך!'
        }`
      : `רמת ${levelLabel} — ${Math.round(overallRate * 100)}% הצלחה מתוך ${totalAttempts} שאלות. זיהיתי ${weakTopics.length} נושא${weakTopics.length > 1 ? 'ים' : ''} שדורש${weakTopics.length > 1 ? 'ים' : ''} תשומת לב מיוחדת.`

  const weakAreaMessages = weakTopics.slice(0, 4).map(t => {
    const rateStr = Math.round(t.failRate * 100)
    let tip = `חזור על ${t.topic} עם דגש על שאלות רמה בינונית-קשה.`
    if (t.recentTrend === 'declining') tip = `⚠️ הביצועים ב${t.topic} בירידה — דחוף לעשות חיזוק!`
    if (t.recentTrend === 'improving') tip = `📈 אתה משתפר! המשך את הקצב.`
    return {
      topic: t.topic,
      message: `שגית ב-${rateStr}% מהשאלות (${t.incorrect}/${t.totalAttempts})`,
      tip,
    }
  })

  // אסוף שאלות חיזוק לנושאים החלשים
  const reinforcementQuestions: ReinforcementQuestion[] = []
  for (const t of weakTopics.slice(0, 3)) {
    const bank = REINFORCEMENT_BANK[t.topic] ?? []
    reinforcementQuestions.push(...bank.slice(0, 2))
  }

  const nextTopic = weakTopics[0]?.topic ?? strongTopics[0]?.topic ?? 'הגדל את מספר השאלות'
  const nextStepLabel =
    weakTopics.length > 0
      ? `התמקד בחיזוק: ${nextTopic}`
      : `המשך לשמור על רמתך ב: ${nextTopic}`

  return {
    overallMessage,
    level,
    weakAreaMessages,
    reinforcementQuestions,
    nextStepLabel,
    motivationalQuote: quote,
    strengthAreas: strongTopics.map(t => t.topic),
  }
}

/** מפה מנושא לשם רכיב בחינה להמלצה */
export const TOPIC_TO_EXAM_FEATURE: Record<string, string> = {
  'דיני חוזים': 'comprehensive-contracts-exam',
  'דיני עונשין': 'criminal-law-exam',
  'משפט חוקתי': 'constitutional-law-exam',
  'משפט מינהלי': 'administrative-law-exam',
  'דיני נזיקין': 'torts-exam',
  'דיני קניין': 'property-law-exam',
  'דיני עבודה': 'labor-law-exam',
  'דיני משפחה': 'family-law-exam',
  'מקורות המשפט': 'legal-sources-exam',
  'פרשנות משפטית': 'comprehensive-legal-exam',
}

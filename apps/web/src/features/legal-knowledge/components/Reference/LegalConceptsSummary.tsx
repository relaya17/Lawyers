import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,

  TextField,
  InputAdornment,
  List,
  ListItem,
  ListItemText,

  IconButton,
  Tooltip
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  Search as SearchIcon,

  MenuBook as MenuBookIcon,
  Balance as BalanceIcon,
  AccountBalance as AccountBalanceIcon,

  Description as DescriptionIcon,
  LocalPolice as LocalPoliceIcon,
  Business as BusinessIcon,

  Print as PrintIcon
} from '@mui/icons-material';

// הגדרת ממשק למושג משפטי
interface LegalConcept {
  id: string;
  term: string;
  definition: string;
  category: string;
  importance: 'basic' | 'intermediate' | 'advanced';
  examples?: string[];
  relatedTerms?: string[];
  legalSources?: string[];
}

// מושגים משפטיים מרכזיים
const legalConcepts: LegalConcept[] = [

  // ─── מקורות המשפט ───────────────────────────────────────────────────────
  {
    id: 'law',
    term: 'חוק',
    definition: 'כלל משפטי שנקבע על ידי הכנסת, המחייב את כלל האוכלוסייה ובעל עדיפות על פני מקורות משפט אחרים',
    category: 'מקורות המשפט',
    importance: 'basic',
    examples: ['חוק יסוד: כבוד האדם וחירותו', 'חוק החוזים', 'חוק העונשין'],
    relatedTerms: ['תקנה', 'צו', 'פסיקה'],
    legalSources: ['חוק יסוד: כבוד האדם וחירותו', 'חוק החוזים (כללי חלק) התשל"ג-1973']
  },
  {
    id: 'regulation',
    term: 'תקנה',
    definition: 'כלל משפטי שנקבע על ידי הרשות המבצעת מכוח הסמכה בחוק. נמוכה בהיררכיה מחוק',
    category: 'מקורות המשפט',
    importance: 'basic',
    examples: ['תקנות תעבורה', 'תקנות רישוי עסקים', 'תקנות ניירות ערך'],
    relatedTerms: ['חוק', 'צו', 'הסמכת שר'],
    legalSources: ['חוק הפרשנות, תשמ"א–1981; סעיף 17']
  },
  {
    id: 'precedent',
    term: 'תקדין',
    definition: 'פסק דין של בית משפט שמהווה מקור משפט ומחייב בתי משפט נמוכים יותר במקרים דומים',
    category: 'מקורות המשפט',
    importance: 'basic',
    examples: ['בג"ץ 6821/93 בנק המזרח המאוחד', 'ע"א 243/83 ירושלים נגד גורדון'],
    relatedTerms: ['סטארה דציסיס', 'פסיקה', 'בית משפט עליון'],
    legalSources: ['חוק בתי המשפט התשנ"ד-1984; סעיף 20']
  },
  {
    id: 'custom',
    term: 'מנהג',
    definition: 'נוהג חוזר ונשנה שהציבור מכיר בו כמחייב משפטית, ובלבד שאינו סותר חוק',
    category: 'מקורות המשפט',
    importance: 'intermediate',
    examples: ['מנהגי המסחר', 'מנהגים במשפט המשפחה', 'מנהגי עבודה'],
    relatedTerms: ['חוק', 'נוהג', 'מנהג מקומי'],
    legalSources: ['חוק יסודות המשפט התש"ם-1980']
  },
  {
    id: 'hierarchy',
    term: 'היררכיית נורמות',
    definition: 'סדר הגבוה מול הנמוך בין מקורות משפט: חוקי יסוד > חוק > חקיקת משנה > פסיקה. נורמה נמוכה לא תגבר על גבוהה',
    category: 'מקורות המשפט',
    importance: 'intermediate',
    examples: ['חוק יסוד גובר על חוק רגיל', 'תקנה בטלה אם חורגת מהחוק המסמיך'],
    relatedTerms: ['חוק יסוד', 'אולטרא וירס', 'ביקורת שיפותית'],
    legalSources: ['בג"ץ 6821/93 בנק המזרחי']
  },
  {
    id: 'interpretation',
    term: 'פרשנות תכליתית',
    definition: 'שיטת פרשנות שמחפשת את התכלית (המטרה) שמאחורי החוק, לא רק את הלשון המילולית שלו',
    category: 'מקורות המשפט',
    importance: 'advanced',
    examples: ['פרשנות חוקתית', 'פרשנות מטרתית', 'פרשנות מילולית'],
    relatedTerms: ['הרמנויטיקה', 'מטרת החוק', 'כוונת המחוקק'],
    legalSources: ['חוק הפרשנות התשמ"א-1981; ע"א 165/82 קיבוץ חצור']
  },
  {
    id: 'law-of-foundations',
    term: 'חוק יסודות המשפט',
    definition: 'חוק הקובע שבהיעדר הוראת חוק, פסיקה או היקש — בית המשפט יכריע לפי עקרונות החירות, הצדק, היושר והשלום של מורשת ישראל',
    category: 'מקורות המשפט',
    importance: 'advanced',
    examples: ['מקרים ללא פתרון סטטוטורי', 'מילוי לאקונה'],
    relatedTerms: ['לאקונה', 'מורשת ישראל', 'היקש'],
    legalSources: ['חוק יסודות המשפט, התש"ם–1980']
  },

  // ─── דיני חוזים ─────────────────────────────────────────────────────────
  {
    id: 'contract',
    term: 'חוזה',
    definition: 'הסכם משפטי בין צדדים היוצר זכויות וחובות הניתנות לאכיפה משפטית',
    category: 'דיני חוזים',
    importance: 'basic',
    examples: ['חוזה מכר', 'חוזה עבודה', 'חוזה שכירות'],
    relatedTerms: ['הצעה', 'קבלה', 'תמורה'],
    legalSources: ['חוק החוזים (כללי חלק) התשל"ג-1973']
  },
  {
    id: 'offer',
    term: 'הצעה',
    definition: 'הצהרת רצון לכרות חוזה בתנאים מסוימים — חייבת לכלול גמירות דעת ומסוימות',
    category: 'דיני חוזים',
    importance: 'basic',
    examples: ['הצעת מחיר', 'הצעה בחנות', 'הצעה בפרסומת'],
    relatedTerms: ['קבלה', 'ביטול הצעה', 'הזמנה לעשות הצעות'],
    legalSources: ['סעיף 3 לחוק החוזים']
  },
  {
    id: 'acceptance',
    term: 'קיבול',
    definition: 'הסכמה לכל תנאי ההצעה ללא שינוי — "מראה ראי". שינוי כלשהו יוצר הצעה נגדית',
    category: 'דיני חוזים',
    importance: 'basic',
    examples: ['חתימה על הסכם', 'תשלום מקדמה', 'התחלת ביצוע'],
    relatedTerms: ['הצעה', 'הצעה נגדית', 'שתיקה כקיבול'],
    legalSources: ['סעיפים 5–6 לחוק החוזים']
  },
  {
    id: 'consideration',
    term: 'גמירות דעת',
    definition: 'כוונה רצינית ומוחלטת להתקשר בחוזה — יסוד נדרש לתוקף ההצעה והקיבול',
    category: 'דיני חוזים',
    importance: 'intermediate',
    examples: ['חתימה על ניירות', 'תשלום כסף', 'מסוימות הפרטים'],
    relatedTerms: ['מסוימות', 'אומד דעת', 'כוונה'],
    legalSources: ['סעיף 2 לחוק החוזים; ע"א 158/77']
  },
  {
    id: 'good-faith',
    term: 'תום לב',
    definition: 'עקרון על חוזי המחייב התנהגות הוגנת, ישרה ועקבית בכריתת חוזה ובקיומו',
    category: 'דיני חוזים',
    importance: 'intermediate',
    examples: ['גילוי מידע מהותי', 'איסור ניצול מצוקה', 'קיום כוונת הצדדים'],
    relatedTerms: ['הפרת חוזה', 'עושק', 'הטעיה'],
    legalSources: ['סעיפים 12, 39 לחוק החוזים']
  },
  {
    id: 'breach-of-contract',
    term: 'הפרת חוזה',
    definition: 'אי קיום התחייבות חוזית — יסודית (המאפשרת ביטול) או רגילה (המזכה בפיצויים)',
    category: 'דיני חוזים',
    importance: 'intermediate',
    examples: ['אי תשלום', 'אי ביצוע עבודה', 'מסירה באיחור'],
    relatedTerms: ['פיצויים', 'ביטול חוזה', 'ביצוע בעין'],
    legalSources: ['סעיפים 2, 7 לחוק החוזים (תרופות)']
  },
  {
    id: 'frustration',
    term: 'סיכול חוזה',
    definition: 'אירוע בלתי צפוי הופך את ביצוע החוזה לבלתי אפשרי או שונה מהותית — מפקיע את החוזה',
    category: 'דיני חוזים',
    importance: 'advanced',
    examples: ['מוות של צד יחיד בחוזה אישי', 'שינוי חוק האוסר את הנושא', 'כוח עליון'],
    relatedTerms: ['כוח עליון', 'תנאי מסכל', 'שינוי נסיבות'],
    legalSources: ['סעיף 18 לחוק החוזים (כללי חלק)']
  },
  {
    id: 'unjust-enrichment',
    term: 'עשיית עושר ולא במשפט',
    definition: 'חיוב להשיב טובת הנאה שהתקבלה שלא כדין מאחר — על בסיס יושר, גם בהיעדר חוזה',
    category: 'דיני חוזים',
    importance: 'advanced',
    examples: ['תשלום בטעות', 'תשלום לפי חוזה בטל', 'קבלת שירות ללא הסכם'],
    relatedTerms: ['חוזה בטל', 'השבה', 'עקרון הצדק'],
    legalSources: ['חוק עשיית עושר ולא במשפט, תשל"ט–1979']
  },

  // ─── דיני עונשין ────────────────────────────────────────────────────────
  {
    id: 'criminal-intent',
    term: 'מחשבה פלילית (Mens Rea)',
    definition: 'היסוד הנפשי הנדרש לעבירה — מודעות, כוונה, פזיזות או רשלנות ביחס לנסיבות ולתוצאה',
    category: 'דיני עונשין',
    importance: 'basic',
    examples: ['כוונה ישירה לגרום נזק', 'פזיזות — קלות ראש', 'רשלנות — אי-תשומת לב'],
    relatedTerms: ['אקטוס ראוס', 'אשמה', 'כוונה פלילית'],
    legalSources: ['סעיפים 19–21 לחוק העונשין, תשל"ז–1977']
  },
  {
    id: 'actus-reus',
    term: 'מעשה פלילי (Actus Reus)',
    definition: 'האלמנט הפיזי של העבירה — מעשה, מחדל, תוצאה וקשר סיבתי ביניהם',
    category: 'דיני עונשין',
    importance: 'basic',
    examples: ['מכה', 'אי-מניעת נזק במחדל', 'גרימת מוות'],
    relatedTerms: ['מחשבה פלילית', 'סיבתיות', 'נסיון'],
    legalSources: ['חוק העונשין התשל"ז-1977']
  },
  {
    id: 'attempt',
    term: 'נסיון לעבירה',
    definition: 'התחלת ביצוע עבירה בכוונה להשלימה — הנסיון עצמו הוא עבירה, גם אם העבירה לא הושלמה',
    category: 'דיני עונשין',
    importance: 'basic',
    examples: ['נסיון לרצח שנכשל', 'ניסיון גנבה שנתגלה', 'ניסיון הונאה שנמנע'],
    relatedTerms: ['הכנה לעבירה', 'ביצוע מושלם', 'חזרה מרצון'],
    legalSources: ['סעיף 25 לחוק העונשין']
  },
  {
    id: 'self-defense',
    term: 'הגנה עצמית',
    definition: 'הגנה (סייג) הפוטרת מאחריות פלילית כאשר המעשה נועד להגן על עצמו מפני תקיפה בלתי חוקית, בכוח סביר',
    category: 'דיני עונשין',
    importance: 'intermediate',
    examples: ['דחיפת תוקף', 'שימוש בכוח מדוד', 'הגנה על אחר'],
    relatedTerms: ['צורך', 'כורח', 'אמצעי סביר'],
    legalSources: ['סעיף 34י לחוק העונשין']
  },
  {
    id: 'criminal-partnership',
    term: 'שותפות לעבירה',
    definition: 'ביצוע עבירה על ידי יותר מאדם אחד — מבצע, מסייע, שותף, מחשיל. כל אחד נושא באחריות בהתאם לתפקידו',
    category: 'דיני עונשין',
    importance: 'intermediate',
    examples: ['שניים גונבים יחד', 'אחד מסייע לאחר', 'ריבוי מבצעים'],
    relatedTerms: ['שידול', 'סיוע', 'קשר לפשע'],
    legalSources: ['סעיפים 26–31 לחוק העונשין']
  },
  {
    id: 'criminal-insanity',
    term: 'חוסר שפיות',
    definition: 'סייג לאחריות פלילית כאשר הנאשם אינו מסוגל, עקב מחלת נפש, להבין שמעשהו פסול או לשלוט בהתנהגותו',
    category: 'דיני עונשין',
    importance: 'advanced',
    examples: ['פסיכוזה חריפה', 'הפרעה דו-קוטבית חמורה'],
    relatedTerms: ['כשרות משפטית', 'כפייה פסיכולוגית', 'אחריות מופחתת'],
    legalSources: ['סעיף 34ח לחוק העונשין']
  },
  {
    id: 'sentencing',
    term: 'גזר דין ושיקולי ענישה',
    definition: 'הליך קביעת הענישה לאחר הרשעה — מאזן בין הרתעה, גמול, שיקום, הגנת הציבור ומידתיות',
    category: 'דיני עונשין',
    importance: 'advanced',
    examples: ['מאסר, קנס, עבודת שירות', 'שיקולי נסיבות מקלות ומחמירות'],
    relatedTerms: ['מידתיות', 'הרתעה', 'שיקום'],
    legalSources: ['סעיפים 40ט–40יח לחוק העונשין']
  },

  // ─── משפט חוקתי ─────────────────────────────────────────────────────────
  {
    id: 'basic-laws',
    term: 'חוקי יסוד',
    definition: 'חוקים בעלי מעמד עליון בסדר הנורמטיבי הישראלי — אמורים לשמש בסיס לחוקה עתידית',
    category: 'משפט חוקתי',
    importance: 'basic',
    examples: ['חוק יסוד: כבוד האדם וחירותו', 'חוק יסוד: הכנסת', 'חוק יסוד: חופש העיסוק'],
    relatedTerms: ['חוקה', 'ביקורת חוקתית', 'פסקת הגבלה'],
    legalSources: ['חוקי היסוד של מדינת ישראל']
  },
  {
    id: 'human-rights',
    term: 'זכויות אדם ואזרח',
    definition: 'זכויות בסיסיות המוגנות בחוקי יסוד — כבוד, חירות, שוויון, קניין, פרטיות ועוד',
    category: 'משפט חוקתי',
    importance: 'basic',
    examples: ['זכות לחיים', 'זכות לחירות', 'זכות לכבוד האדם'],
    relatedTerms: ['זכויות יסוד', 'חירויות', 'פסקת הגבלה'],
    legalSources: ['חוק יסוד: כבוד האדם וחירותו']
  },
  {
    id: 'separation-of-powers',
    term: 'הפרדת רשויות',
    definition: 'חלוקת כוח השלטון לשלוש רשויות עצמאיות: מחוקקת (כנסת), מבצעת (ממשלה), שופטת (בתי משפט)',
    category: 'משפט חוקתי',
    importance: 'basic',
    examples: ['הכנסת חוקקת', 'הממשלה מבצעת', 'בית משפט שופט'],
    relatedTerms: ['איזונים ובלמים', 'עצמאות השפיטה', 'שלטון החוק'],
    legalSources: ['חוק יסוד: הכנסת; חוק יסוד: הממשלה; חוק יסוד: השפיטה']
  },
  {
    id: 'limitation-clause',
    term: 'פסקת הגבלה',
    definition: 'הוראה בחוק יסוד המגדירה תנאים בהם ניתן לפגוע בזכות חוקתית — חוק, ראוי, מידתי',
    category: 'משפט חוקתי',
    importance: 'intermediate',
    examples: ['הגבלת חופש התנועה לצורכי ביטחון', 'הגבלת קניין לצרכי ציבור'],
    relatedTerms: ['מידתיות', 'תכלית ראויה', 'ביקורת חוקתית'],
    legalSources: ['סעיף 8 לחוק יסוד: כבוד האדם וחירותו']
  },
  {
    id: 'proportionality',
    term: 'מידתיות',
    definition: 'עקרון חוקתי ומינהלי הדורש שפגיעה בזכות לא תעלה על הנדרש להשגת התכלית הלגיטימית',
    category: 'משפט חוקתי',
    importance: 'intermediate',
    examples: ['מבחן ההתאמה', 'מבחן האמצעי המידתי', 'מבחן המידתיות במובן הצר'],
    relatedTerms: ['פסקת הגבלה', 'תכלית ראויה', 'ביקורת שיפותית'],
    legalSources: ['בג"ץ 6427/02 התנועה לאיכות השלטון']
  },
  {
    id: 'constitutional-review',
    term: 'ביקורת חוקתית',
    definition: 'סמכות בית המשפט לבטל חוק הכנסת הנוגד חוק יסוד — שהוקנתה בפסיקת "המהפכה החוקתית"',
    category: 'משפט חוקתי',
    importance: 'advanced',
    examples: ['בג"ץ בנק המזרחי 1995', 'בטלות חלקית של חוק'],
    relatedTerms: ['חוק יסוד', 'ביקורת שיפותית', 'בית משפט עליון'],
    legalSources: ['בג"ץ 6821/93 בנק המזרח המאוחד']
  },
  {
    id: 'rule-of-law',
    term: 'שלטון החוק',
    definition: 'עיקרון יסוד שלפיו כולם כפופים לחוק — אזרחים, ממשלה ושלטון — ואף אחד אינו מעל החוק',
    category: 'משפט חוקתי',
    importance: 'advanced',
    examples: ['אכיפה שוויונית', 'ביקורת על ממשלה', 'עצמאות שיפוטית'],
    relatedTerms: ['דמוקרטיה', 'הפרדת רשויות', 'ביקורת חוקתית'],
    legalSources: ['חוק יסוד: השפיטה; פסיקת בית המשפט העליון']
  },

  // ─── משפט מינהלי ────────────────────────────────────────────────────────
  {
    id: 'administrative-law',
    term: 'משפט מינהלי',
    definition: 'ענף המשפט העוסק בפעילות הרשות המבצעת ובביקורת השיפותית עליה',
    category: 'משפט מינהלי',
    importance: 'basic',
    examples: ['רישיון עסק', 'אישור בנייה', 'החלטה של רשות מקומית'],
    relatedTerms: ['שיקול דעת', 'הליך הוגן', 'ביקורת שיפותית'],
    legalSources: ['חוק יסודות המשפט, תש"ם–1980']
  },
  {
    id: 'administrative-hearing',
    term: 'זכות שימוע',
    definition: 'עקרון צדק טבעי המחייב שאדם שעלולה להינקט כלפיו פעולה פוגעת יוכל להשמיע את טענותיו לפני קבלת ההחלטה',
    category: 'משפט מינהלי',
    importance: 'basic',
    examples: ['שימוע לפני פיטורין', 'שימוע לפני ביטול רישיון', 'שימוע לפני עיצום'],
    relatedTerms: ['צדק טבעי', 'חובת הנמקה', 'הליך הוגן'],
    legalSources: ['בג"ץ 3/58 ברמן; חוק השימוע']
  },
  {
    id: 'administrative-discretion',
    term: 'שיקול דעת מינהלי',
    definition: 'סמכות הרשות לבחור בין אפשרויות פעולה — אך חייבת לפעול בסבירות, בתום לב ולפי שיקולים ענייניים',
    category: 'משפט מינהלי',
    importance: 'intermediate',
    examples: ['שיקול דעת בהענקת רישיון', 'שיקול דעת בקביעת קנסות'],
    relatedTerms: ['סבירות', 'שיקולים זרים', 'מידתיות'],
    legalSources: ['בג"ץ 389/80 דפי זהב']
  },
  {
    id: 'reasonableness',
    term: 'עקרון הסבירות',
    definition: 'עילת ביקורת שיפותית — החלטה מינהלית תבוטל אם חרגה ממה שרשות סבירה הייתה עושה בנסיבות',
    category: 'משפט מינהלי',
    importance: 'intermediate',
    examples: ['ענישה לא פרופורציונלית', 'העדפת שיקולים זרים', 'החלטה שרירותית'],
    relatedTerms: ['מידתיות', 'שיקול דעת', 'ביקורת שיפותית'],
    legalSources: ['בג"ץ 935/89 גנור; עקרון Wednesbury']
  },
  {
    id: 'judicial-review',
    term: 'ביקורת שיפותית על הרשות',
    definition: 'סמכות בג"ץ לבחון חוקיות פעולות ממשלתיות ולהוציא צווים — ביטול, עשה, מניעה',
    category: 'משפט מינהלי',
    importance: 'advanced',
    examples: ['בג"ץ', 'צו הצהרתי', 'ביטול החלטת ממשלה'],
    relatedTerms: ['שלטון החוק', 'הפרדת רשויות', 'צדק טבעי'],
    legalSources: ['חוק בתי המשפט, תשנ"ד–1984; סעיף 15']
  },
  {
    id: 'foia',
    term: 'חופש המידע',
    definition: 'זכות כל אדם לקבל מידע מרשות ציבורית, ללא צורך בנימוק — כפוף לחריגים מוגדרים בחוק',
    category: 'משפט מינהלי',
    importance: 'advanced',
    examples: ['בקשה לפרוטוקול ממשלתי', 'מידע על תקציבים', 'חוזי רשות'],
    relatedTerms: ['שקיפות', 'שלטון החוק', 'הגנת הפרטיות'],
    legalSources: ['חוק חופש המידע, תשנ"ח–1998']
  },

  // ─── דיני נזיקין ────────────────────────────────────────────────────────
  {
    id: 'tort',
    term: 'עוולה נזיקית',
    definition: 'מעשה או מחדל של אדם הגורם נזק לאחר, שהחוק מכיר בזכות לפיצוי בגינו — ללא צורך בחוזה',
    category: 'דיני נזיקין',
    importance: 'basic',
    examples: ['רשלנות', 'תקיפה', 'לשון הרע'],
    relatedTerms: ['רשלנות', 'אחריות', 'פיצויים'],
    legalSources: ['פקודת הנזיקין (נוסח חדש)']
  },
  {
    id: 'negligence',
    term: 'רשלנות',
    definition: 'עוולה הנוצרת כשאדם מפר חובת זהירות המוטלת עליו, ובכך גורם נזק שהיה ניתן לצפות',
    category: 'דיני נזיקין',
    importance: 'basic',
    examples: ['נהג רשלן', 'רופא שלא בדק', 'קבלן שלא אבטח'],
    relatedTerms: ['חובת זהירות', 'קשר סיבתי', 'פיצויים'],
    legalSources: ['סעיף 35–36 לפקודת הנזיקין; ע"א 145/80 ועקנין']
  },
  {
    id: 'duty-of-care',
    term: 'חובת זהירות',
    definition: 'חובה משפטית לפעול בזהירות כלפי מי שניתן לצפות שייפגע ממעשינו — יסוד ראשון ברשלנות',
    category: 'דיני נזיקין',
    importance: 'intermediate',
    examples: ['חובת זהירות של רופא לחולה', 'של נהג לעוברי דרך', 'של מוצר לצרכן'],
    relatedTerms: ['רשלנות', 'צפיות', 'קשר סיבתי'],
    legalSources: ['ע"א 145/80 ועקנין נ. מועצה אזורית']
  },
  {
    id: 'causation',
    term: 'קשר סיבתי',
    definition: 'הקשר הנדרש בין מעשה הנתבע לבין הנזק — עובדתי (אלמלא) ומשפטי (צפיות הנזק)',
    category: 'דיני נזיקין',
    importance: 'intermediate',
    examples: ['מבחן הסיבה-בלעדיה-אין', 'ניתוק קשר סיבתי', 'גורם מתערב'],
    relatedTerms: ['רשלנות', 'נזק', 'אחריות'],
    legalSources: ['פקודת הנזיקין; בג"ץ פסיקות מרובות']
  },
  {
    id: 'strict-liability',
    term: 'אחריות חמורה (מוחלטת)',
    definition: 'אחריות ללא צורך בהוכחת אשם — מוטלת מעצם ביצוע פעילות מסוכנת או אחזקת בעל חיים מסוכן',
    category: 'דיני נזיקין',
    importance: 'advanced',
    examples: ['בעל חיה מסוכנת', 'חפצים מסוכנים', 'ייצור מוצרים פגומים'],
    relatedTerms: ['רשלנות', 'עוולת מטרד', 'האחריות ב-Rylands v Fletcher'],
    legalSources: ['סעיפים 41–43 לפקודת הנזיקין']
  },
  {
    id: 'defamation',
    term: 'לשון הרע',
    definition: 'פרסום דבר העלול להשפיל אדם בעיני הבריות, לבזותו, לפגוע בעסקיו או לחשפו לשנאה — עוולה ועבירה',
    category: 'דיני נזיקין',
    importance: 'advanced',
    examples: ['פרסום כוזב', 'פגיעה במוניטין', 'פרסום ברשת חברתית'],
    relatedTerms: ['חופש הביטוי', 'פגיעה בפרטיות', 'הגנת אמת'],
    legalSources: ['חוק איסור לשון הרע, תשכ"ה–1965']
  },

  // ─── דיני קניין ─────────────────────────────────────────────────────────
  {
    id: 'ownership',
    term: 'בעלות',
    definition: 'הזכות הקניינית המלאה והמקיפה ביותר — שליטה בלעדית בנכס, לרבות הזכות למכור, לתת ולהוריש',
    category: 'דיני קניין',
    importance: 'basic',
    examples: ['בעלות על דירה', 'בעלות על מכונית', 'בעלות על עסק'],
    relatedTerms: ['חזקה', 'שעבוד', 'רישום'],
    legalSources: ['חוק המקרקעין, תשכ"ט–1969; סעיף 2']
  },
  {
    id: 'land-registry',
    term: 'רישום בטאבו',
    definition: 'מרשם ממשלתי רשמי של זכויות במקרקעין — הרישום הוא הוכחה חלוטה לבעלות',
    category: 'דיני קניין',
    importance: 'basic',
    examples: ['רישום דירה', 'רישום משכנתא', 'רישום זיקת הנאה'],
    relatedTerms: ['בעלות', 'עסקה במקרקעין', 'משכנתא'],
    legalSources: ['חוק המקרקעין, סעיפים 7–10']
  },
  {
    id: 'easement',
    term: 'זיקת הנאה',
    definition: 'זכות קניינית של בעל מקרקעין אחד להשתמש בנכס שכנו לצורך מוגדר (מעבר, מים, אור)',
    category: 'דיני קניין',
    importance: 'intermediate',
    examples: ['זכות מעבר', 'זכות השקיה', 'זיקת צינור ביוב'],
    relatedTerms: ['בעלות', 'שכנות', 'שימוש בנכס'],
    legalSources: ['חוק המקרקעין, סעיפים 92–101']
  },
  {
    id: 'mortgage',
    term: 'משכנתא',
    definition: 'שעבוד מקרקעין להבטחת חוב — הנושה רשאי לממש את הנכס אם החוב לא נפרע',
    category: 'דיני קניין',
    importance: 'intermediate',
    examples: ['משכנתא לדירה', 'שעבוד לטובת בנק', 'מימוש בהוצאה לפועל'],
    relatedTerms: ['שעבוד', 'בטוחה', 'הוצאה לפועל'],
    legalSources: ['חוק המקרקעין, סעיפים 85–87']
  },
  {
    id: 'co-ownership',
    term: 'שיתוף במקרקעין',
    definition: 'בעלות משותפת של מספר אנשים על אותו נכס — כל שותף יכול לדרוש פירוק שיתוף',
    category: 'דיני קניין',
    importance: 'advanced',
    examples: ['דירה בבעלות שני יורשים', 'נחלה משפחתית', 'בית משותף'],
    relatedTerms: ['פירוק שיתוף', 'בעלות', 'שותפות'],
    legalSources: ['חוק המקרקעין, סעיפים 27–43']
  },

  // ─── דיני עבודה ─────────────────────────────────────────────────────────
  {
    id: 'employment-contract',
    term: 'חוזה עבודה',
    definition: 'הסכם בין עובד למעביד הקובע תנאי העסקה — שכר, שעות, תפקיד. בסיסו חוזי אך מוגן בחקיקה',
    category: 'דיני עבודה',
    importance: 'basic',
    examples: ['חוזה אישי', 'הסכם קיבוצי', 'חוזה לתקופה קצובה'],
    relatedTerms: ['הסכם קיבוצי', 'תלוש שכר', 'פיטורין'],
    legalSources: ['חוק עבודת נשים; חוק שכר מינימום; חוק הודעה לעובד']
  },
  {
    id: 'dismissal',
    term: 'פיטורין',
    definition: 'סיום יחסי עבודה על ידי המעביד — חייב להיות בהודעה מוקדמת ועם תשלום פיצויי פיטורין (לאחר שנה)',
    category: 'דיני עבודה',
    importance: 'basic',
    examples: ['פיטורין לאחר שנת עבודה', 'פיטורין בהסכמה', 'פיטורין שלא כדין'],
    relatedTerms: ['הודעה מוקדמת', 'פיצויי פיטורין', 'שימוע'],
    legalSources: ['חוק פיצויי פיטורים, תשכ"ג–1963']
  },
  {
    id: 'collective-agreement',
    term: 'הסכם קיבוצי',
    definition: 'הסכם בין ארגון עובדים לבין מעביד/ארגון מעבידים — קובע תנאי עבודה ומחייב את כל העובדים בתחומו',
    category: 'דיני עבודה',
    importance: 'intermediate',
    examples: ['הסכם שכר ענפי', 'הסכם קיבוצי מיוחד', 'צו הרחבה'],
    relatedTerms: ['ועד עובדים', 'שביתה', 'גישור'],
    legalSources: ['חוק הסכמים קיבוציים, תשי"ז–1957']
  },
  {
    id: 'minimum-wage',
    term: 'שכר מינימום',
    definition: 'שכר המינימום שמעביד חייב לשלם לעובד — נקבע בחוק ומתעדכן מעת לעת',
    category: 'דיני עבודה',
    importance: 'intermediate',
    examples: ['שכר מינימום חודשי', 'שכר מינימום שעתי', 'תוספות מעל המינימום'],
    relatedTerms: ['שכר', 'תלוש שכר', 'עובד שכיר'],
    legalSources: ['חוק שכר מינימום, תשמ"ז–1987']
  },
  {
    id: 'workplace-discrimination',
    term: 'הפליה בעבודה',
    definition: 'אסור למעביד להפלות עובד או מועמד לעבודה על בסיס גיל, מין, לאום, דת, מוגבלות ועוד',
    category: 'דיני עבודה',
    importance: 'advanced',
    examples: ['פיטורין של אישה בהריון', 'אי-קבלה בשל גיל', 'שכר נמוך לאישה'],
    relatedTerms: ['שוויון הזדמנויות', 'הטרדה מינית', 'פגיעה בזכות'],
    legalSources: ['חוק שוויון הזדמנויות בעבודה, תשמ"ח–1988']
  },

  // ─── דיני משפחה ─────────────────────────────────────────────────────────
  {
    id: 'marriage',
    term: 'נישואין',
    definition: 'חוזה משפטי בין שני בני זוג — בישראל מוסדר על בסיס דיני הדת של כל עדה (יהודים: רבנות, מוסלמים: שריעה)',
    category: 'דיני משפחה',
    importance: 'basic',
    examples: ['נישואין יהודיים', 'נישואין אזרחיים בחו"ל', 'ידועים בציבור'],
    relatedTerms: ['גירושין', 'קידושין', 'כתובה'],
    legalSources: ['חוק שיפוט בתי דין רבניים; חוק הנישואין והגירושין']
  },
  {
    id: 'divorce',
    term: 'גירושין',
    definition: 'פירוק קשר הנישואין — בחוק הישראלי מחייב גט דתי (ליהודים) ומחייב הסדרת מזונות, משמורת וחלוקת רכוש',
    category: 'דיני משפחה',
    importance: 'basic',
    examples: ['גט בהסכמה', 'הסכם גירושין', 'גירושין בהכרח'],
    relatedTerms: ['מזונות', 'משמורת', 'חלוקת רכוש'],
    legalSources: ['חוק שיפוט בתי דין רבניים (נישואין וגירושין), תשי"ג–1953']
  },
  {
    id: 'alimony',
    term: 'מזונות',
    definition: 'חיוב לספק צרכי מחייה לבן זוג או לילדים לאחר פירוד — גובהם נקבע לפי צרכים ויכולת',
    category: 'דיני משפחה',
    importance: 'intermediate',
    examples: ['מזונות קטין', 'מזונות אישה', 'הגשת תביעת מזונות'],
    relatedTerms: ['גירושין', 'משמורת', 'הסכם גירושין'],
    legalSources: ['חוק לתיקון דיני המשפחה (מזונות), תשי"ט–1959']
  },
  {
    id: 'child-custody',
    term: 'משמורת ילדים',
    definition: 'הזכות וחובה להחזיק בילד ולקבוע את מסגרת חייו — נקבעת לפי טובת הילד ועל ידי בית המשפט לענייני משפחה',
    category: 'דיני משפחה',
    importance: 'intermediate',
    examples: ['משמורת פיזית', 'משמורת משפטית', 'הסדרי ראייה'],
    relatedTerms: ['טובת הילד', 'מזונות', 'גירושין'],
    legalSources: ['חוק הכשרות המשפטית והאפוטרופסות, תשכ"ב–1962']
  },
  {
    id: 'common-law-spouse',
    term: 'ידועים בציבור',
    definition: 'זוג החי יחד כבעל ואישה ללא נישואין רשמיים — זכאים לרבות מזכויות הנשואים בדיני הרכוש והירושה',
    category: 'דיני משפחה',
    importance: 'advanced',
    examples: ['שיתוף נכסים', 'זכות ירושה', 'מזונות לאחר פרידה'],
    relatedTerms: ['נישואין', 'שיתוף נכסים', 'זכויות ירושה'],
    legalSources: ['פסיקת בית המשפט העליון; חוק הירושה, תשכ"ה–1965']
  },

  // ─── דיני ירושה ─────────────────────────────────────────────────────────
  {
    id: 'inheritance',
    term: 'ירושה',
    definition: 'העברת זכויות וחובות של המוריש ליורשיו עם פטירתו — על פי דין או על פי צוואה',
    category: 'דיני ירושה',
    importance: 'basic',
    examples: ['ירושה על פי דין', 'ירושה לפי צוואה', 'ויתור על ירושה'],
    relatedTerms: ['עיזבון', 'יורש', 'צוואה'],
    legalSources: ['חוק הירושה, תשכ"ה–1965']
  },
  {
    id: 'will',
    term: 'צוואה',
    definition: 'הוראות שנותן אדם בחייו לחלוקת רכושו לאחר מותו — חייבת לעמוד בדרישות צורה מחמירות',
    category: 'דיני ירושה',
    importance: 'basic',
    examples: ['צוואה בכתב יד', 'צוואה בפני עדים', 'צוואה בעל פה (שכיב מרע)'],
    relatedTerms: ['יורש', 'עיזבון', 'ביטול צוואה'],
    legalSources: ['סעיפים 18–28 לחוק הירושה']
  },
  {
    id: 'estate',
    term: 'עיזבון',
    definition: 'כלל הנכסים והחובות של המוריש המועברים ליורשים — הנושים יכולים לגבות רק עד שווי העיזבון',
    category: 'דיני ירושה',
    importance: 'intermediate',
    examples: ['דירה בעיזבון', 'חובות המנוח', 'חשבון בנק'],
    relatedTerms: ['נאמן', 'כינוס', 'חלוקת עיזבון'],
    legalSources: ['סעיפים 107–112 לחוק הירושה']
  },
  {
    id: 'legal-heirs',
    term: 'יורשים על פי דין',
    definition: 'סדר הירושה הקבוע בחוק בהיעדר צוואה: בן/בת זוג וצאצאים קודמים להורים, שקודמים לאחים',
    category: 'דיני ירושה',
    importance: 'intermediate',
    examples: ['בן זוג + ילדים', 'הורים בהיעדר ילדים', 'אחים בהיעדר הורים'],
    relatedTerms: ['עיזבון', 'פסול לרשת', 'ויתור על ירושה'],
    legalSources: ['סעיפים 10–16 לחוק הירושה']
  },
  {
    id: 'probate',
    term: 'צו ירושה וצו קיום צוואה',
    definition: 'צו שמוציא הרשם לענייני ירושה המאשר מי הם היורשים ומה הרכוש — מאפשר העברת נכסים',
    category: 'דיני ירושה',
    importance: 'advanced',
    examples: ['פתיחת חשבון בנק של נפטר', 'העברת בעלות על דירה', 'מימוש ביטוח חיים'],
    relatedTerms: ['עיזבון', 'רשם לענייני ירושה', 'בית משפט לענייני משפחה'],
    legalSources: ['סעיפים 66–77 לחוק הירושה']
  },
];

// קטגוריות המושגים
const categories = [
  { id: 'all', name: 'כל המושגים', icon: <MenuBookIcon /> },
  { id: 'מקורות המשפט', name: 'מקורות המשפט', icon: <BalanceIcon /> },
  { id: 'דיני חוזים', name: 'דיני חוזים', icon: <DescriptionIcon /> },
  { id: 'דיני עונשין', name: 'דיני עונשין', icon: <LocalPoliceIcon /> },
  { id: 'משפט חוקתי', name: 'משפט חוקתי', icon: <AccountBalanceIcon /> },
  { id: 'משפט מינהלי', name: 'משפט מינהלי', icon: <BusinessIcon /> },
  { id: 'דיני נזיקין', name: 'דיני נזיקין', icon: <BalanceIcon /> },
  { id: 'דיני קניין', name: 'דיני קניין', icon: <AccountBalanceIcon /> },
  { id: 'דיני עבודה', name: 'דיני עבודה', icon: <BusinessIcon /> },
  { id: 'דיני משפחה', name: 'דיני משפחה', icon: <MenuBookIcon /> },
  { id: 'דיני ירושה', name: 'דיני ירושה', icon: <DescriptionIcon /> },
];

export const LegalConceptsSummary: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [expandedConcept, setExpandedConcept] = useState<string | null>(null);

  // סינון המושגים לפי חיפוש וקטגוריה
  const filteredConcepts = legalConcepts.filter(concept => {
    const matchesSearch = concept.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         concept.definition.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || concept.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // קבוצת המושגים לפי קטגוריות
  const conceptsByCategory = filteredConcepts.reduce((acc, concept) => {
    if (!acc[concept.category]) {
      acc[concept.category] = [];
    }
    acc[concept.category].push(concept);
    return acc;
  }, {} as Record<string, LegalConcept[]>);

  const handlePrint = () => {
    window.print();
  };

  const getImportanceColor = (importance: string) => {
    switch (importance) {
      case 'basic': return 'success';
      case 'intermediate': return 'warning';
      case 'advanced': return 'error';
      default: return 'default';
    }
  };

  const getImportanceText = (importance: string) => {
    switch (importance) {
      case 'basic': return 'בסיסי';
      case 'intermediate': return 'בינוני';
      case 'advanced': return 'מתקדם';
      default: return '';
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* כותרת ראשית */}
      <Box sx={{ textAlign: 'center' }} mb={4}>
        <Typography variant="h3" component="h1" gutterBottom color="primary">
          📚 מושגים משפטיים - מדריך מקיף
        </Typography>
        <Typography variant="h6" color="text.secondary" mb={3}>
          אוסף מקיף של מושגים יסודיים במשפט הישראלי
        </Typography>
        
        {/* כפתור הדפסה */}
        <Tooltip title="הדפסת המדריך">
          <IconButton onClick={handlePrint} color="primary" size="large">
            <PrintIcon />
          </IconButton>
        </Tooltip>
      </Box>

      {/* חיפוש וסינון */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                placeholder="חיפוש מושג..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Box display="flex" flexWrap="wrap" gap={1}>
                {categories.map((category) => (
                  <Chip
                    key={category.id}
                    icon={category.icon}
                    label={category.name}
                    onClick={() => setSelectedCategory(category.id)}
                    color={selectedCategory === category.id ? 'primary' : 'default'}
                    variant={selectedCategory === category.id ? 'filled' : 'outlined'}
                  />
                ))}
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* סטטיסטיקות */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="primary">
                {legalConcepts.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                סה"כ מושגים
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="success.main">
                {legalConcepts.filter(c => c.importance === 'basic').length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                מושגים בסיסיים
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="warning.main">
                {legalConcepts.filter(c => c.importance === 'intermediate').length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                מושגים בינוניים
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="error.main">
                {legalConcepts.filter(c => c.importance === 'advanced').length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                מושגים מתקדמים
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* תוכן המושגים */}
      {Object.entries(conceptsByCategory).map(([category, concepts]) => (
        <Card key={category} sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h5" gutterBottom color="primary">
              {category} ({concepts.length} מושגים)
            </Typography>
            
            {concepts.map((concept) => (
              <Accordion
                key={concept.id}
                expanded={expandedConcept === concept.id}
                onChange={() => setExpandedConcept(
                  expandedConcept === concept.id ? null : concept.id
                )}
              >
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Box display="flex" alignItems="center" gap={2} width="100%">
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                      {concept.term}
                    </Typography>
                    <Chip
                      label={getImportanceText(concept.importance)}
                      color={getImportanceColor(concept.importance) as 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning'}
                      size="small"
                    />
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  <Box>
                    {/* הגדרה */}
                    <Typography variant="body1" paragraph>
                      <strong>הגדרה:</strong> {concept.definition}
                    </Typography>

                    {/* דוגמאות */}
                    {concept.examples && concept.examples.length > 0 && (
                      <Box mb={2}>
                        <Typography variant="subtitle2" gutterBottom>
                          <strong>דוגמאות:</strong>
                        </Typography>
                        <List dense>
                          {concept.examples.map((example, index) => (
                            <ListItem key={index}>
                              <ListItemText primary={`• ${example}`} />
                            </ListItem>
                          ))}
                        </List>
                      </Box>
                    )}

                    {/* מושגים קשורים */}
                    {concept.relatedTerms && concept.relatedTerms.length > 0 && (
                      <Box mb={2}>
                        <Typography variant="subtitle2" gutterBottom>
                          <strong>מושגים קשורים:</strong>
                        </Typography>
                        <Box display="flex" flexWrap="wrap" gap={1}>
                          {concept.relatedTerms.map((term, index) => (
                            <Chip key={index} label={term} size="small" variant="outlined" />
                          ))}
                        </Box>
                      </Box>
                    )}

                    {/* מקורות משפטיים */}
                    {concept.legalSources && concept.legalSources.length > 0 && (
                      <Box>
                        <Typography variant="subtitle2" gutterBottom>
                          <strong>מקורות משפטיים:</strong>
                        </Typography>
                        <List dense>
                          {concept.legalSources.map((source, index) => (
                            <ListItem key={index}>
                              <ListItemText 
                                primary={`📜 ${source}`}
                                sx={{ fontStyle: 'italic' }}
                              />
                            </ListItem>
                          ))}
                        </List>
                      </Box>
                    )}
                  </Box>
                </AccordionDetails>
              </Accordion>
            ))}
          </CardContent>
        </Card>
      ))}

      {/* הודעה אם אין תוצאות */}
      {filteredConcepts.length === 0 && (
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 6 }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              לא נמצאו מושגים התואמים את החיפוש
            </Typography>
            <Typography variant="body2" color="text.secondary">
              נסה לשנות את מילות החיפוש או את הקטגוריה
            </Typography>
          </CardContent>
        </Card>
      )}

      {/* כותרת תחתונה */}
      <Box sx={{ textAlign: 'center' }} mt={6} pt={4} borderTop="1px solid #eee">
        <Typography variant="body2" color="text.secondary">
          מדריך מושגים משפטיים - מערכת לימוד דיגיטלית למשפט ישראלי
        </Typography>
      </Box>
    </Container>
  );
};

export default LegalConceptsSummary;

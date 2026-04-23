import React, { useState, useMemo } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  Typography, 
  Box, 
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Collapse,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Alert,
  Grid
} from '@mui/material';
import { 
  ExpandMore as ExpandIcon,
  Search as SearchIcon,
  Info as InfoIcon,
  BookmarkBorder as BookmarkIcon,
  Bookmark as BookmarkedIcon,
  Close as CloseIcon
} from '@mui/icons-material';

interface LegalConcept {
  id: string;
  category: string;
  name: string;
  shortDescription: string;
  fullDescription: string;
  example: string;
  precedent?: string;
  difficulty: 'easy' | 'medium' | 'hard' | 'very-hard';
  icon: string;
  relatedConcepts: string[];
  practicalNotes?: string;
  /** דגש ללימוד — מהמדריך המקורי, מוצג בולט */
  studyHighlight?: string;
  /** מקורות משפטיים — חוק/פסיקה מדויקת */
  legalSources?: string[];
  importance: 'critical' | 'important' | 'supplementary';
  lastUpdated: Date;
}

const legalConcepts: LegalConcept[] = [
  // חקיקה
  {
    id: 'primary-legislation',
    category: 'חקיקה',
    name: 'חקיקה ראשית',
    shortDescription: 'חוקים שמחוקקת הכנסת, עליונים מול חקיקת משנה',
    fullDescription: 'חקיקה ראשית היא החוקים שמחוקקת הכנסת כמוסד המחוקק העליון במדינה. חוקים אלה עליונים על חקיקת משנה ותקנות. החקיקה הראשית יכולה להכיל פסקת הגבלה שמאפשרת לבית המשפט לבדוק חקיקה רגילה מול חוק יסוד.',
    example: 'חוק יסוד: הכנסת, חוק העונשין, חוק החוזים',
    precedent: 'בג"ץ 1/81 שרן נגד כנסת ישראל - עליונות הכנסת במחוקק',
    difficulty: 'easy',
    icon: '📜',
    relatedConcepts: ['basic-laws', 'secondary-legislation'],
    practicalNotes: 'הכנסת היא הגוף היחיד המוסמך לחוקק חקיקה ראשית במדינת ישראל',
    importance: 'critical',
    lastUpdated: new Date()
  },
  {
    id: 'secondary-legislation',
    category: 'חקיקה',
    name: 'חקיקת משנה',
    shortDescription: 'תקנות, צווים והוראות על סמך חוק ראשי',
    fullDescription: 'חקיקת משנה כוללת תקנות, צווים והוראות המונעות על פי חוק ראשי. היא כפופה לחקיקה ראשית וחייבת להיות מבוססת על סמכות חוקית ברורה. תקנות שאינן חוקיות נחשבות בטלות.',
    example: 'תקנות ביטחון פנים, תקנות עבודה, תקנות תעבורה',
    difficulty: 'medium',
    icon: '📜',
    relatedConcepts: ['primary-legislation', 'administrative-law'],
    practicalNotes: 'תקנות חייבות להיות במסגרת הסמכה שניתנה בחוק הראשי',
    importance: 'important',
    lastUpdated: new Date()
  },
  {
    id: 'basic-laws',
    category: 'חקיקה',
    name: 'חוקי יסוד',
    shortDescription: 'מעין חוקה חלקית, עליונים מול חוקים רגילים',
    fullDescription: 'חוקי היסוד מהווים מעין חוקה "חלקית" של מדינת ישראל. הם עליונים על חוקים רגילים ומכילים פסקת הגבלה המאפשרת לבית המשפט לבחון אם חקיקה רגילה מפרה זכויות יסוד. בחוקי יסוד ללא פסקת הגבלה, בג"ץ מחויב להיזהר בביקורת.',
    example: 'חוק יסוד: כבוד האדם וחירותו, חוק יסוד: חופש העיסוק',
    precedent: 'בג"ץ 6427/02 התנועה לאיכות השלטון - עליונות חוקי היסוד',
    difficulty: 'hard',
    icon: '📜✨',
    relatedConcepts: ['constitutional-review', 'human-rights'],
    practicalNotes: 'חוקי יסוד עם פסקת הגבלה מאפשרים ביקורת שיפוטית רחבה יותר',
    importance: 'critical',
    lastUpdated: new Date()
  },

  // תקדימים
  {
    id: 'binding-precedent',
    category: 'תקדימים',
    name: 'פסיקה מחייבת',
    shortDescription: 'החלטות של ערכאות גבוהות שמחייבות ערכאות נמוכות',
    fullDescription: 'עקרון הסטארה דצ\'יזיס (Stare Decisis) קובע שהחלטות של ערכאות גבוהות מחייבות ערכאות נמוכות יותר. זהו עיקרון יסוד במערכת המשפט הישראלית המבטיח עקביות ויציבות בפסיקה.',
    example: 'פס"ד קול העם - חופש הביטוי, פס"ד ירדור - דמוקרטיה מהותית',
    precedent: 'ע"א 10/69 קול העם נגד שר הפנים - חופש הביטוי',
    difficulty: 'medium',
    icon: '⚖️',
    relatedConcepts: ['stare-decisis', 'judicial-hierarchy'],
    practicalNotes: 'ניתן לסטות מתקדים רק במקרים חריגים של שינוי נסיבות או עקרונות יסוד',
    importance: 'critical',
    lastUpdated: new Date()
  },
  {
    id: 'deviation-precedent',
    category: 'תקדימים',
    name: 'סטיית תקדים',
    shortDescription: 'סטייה מפסיקה קודמת עקב שינוי נסיבות או עקרונות יסוד',
    fullDescription: 'בית המשפט יכול לסטות מפסיקה קודמת במקרים של שינוי נסיבות, התפתחות חברתית, עקרונות יסוד או פערים בחקיקה. זוהי סמכות חריגה הדורשת נימוק מיוחד.',
    example: 'פס"ד ירדור - סטייה מגישה פורמלית לדמוקרטיה מהותית',
    precedent: 'בג"ץ 6427/02 התנועה לאיכות השלטון - סטייה מתקדימים קודמים',
    difficulty: 'hard',
    icon: '⚖️✨',
    relatedConcepts: ['binding-precedent', 'judicial-activism'],
    practicalNotes: 'סטיית תקדים דורשת הצדקה מיוחדת ונימוק מפורט',
    importance: 'important',
    lastUpdated: new Date()
  },

  // מנהגים
  {
    id: 'commercial-custom',
    category: 'מנהגים',
    name: 'מנהג עסקי',
    shortDescription: 'נוהג חוזר ומקובל בתחום עסקי, מחייב אם אינו סותר חוק',
    fullDescription: 'מנהג עסקי הוא נוהג חוזר ומקובל בתחום עסקי מסוים. הוא מחייב כאשר אינו סותר חוק ויש להוכיח שהוא נפוץ, קבוע ומקובל בקרב בעלי המקצוע הרלוונטיים.',
    example: 'שימוש חוזר במנהג מסחרי, תנאי תשלום מקובלים בענף',
    difficulty: 'medium',
    icon: '✨',
    relatedConcepts: ['contract-law', 'commercial-law'],
    practicalNotes: 'חובה להוכיח שהמנהג נפוץ, קבוע ומקובל',
    importance: 'important',
    lastUpdated: new Date()
  },
  {
    id: 'legal-custom',
    category: 'מנהגים',
    name: 'מנהג משפטי',
    shortDescription: 'עקרונות או נוהגים המקובלים בבתי משפט בהיעדר חקיקה ברורה',
    fullDescription: 'מנהג משפטי כולל עקרונות או נוהגים המקובלים בבית המשפט, בעיקר בהיעדר חקיקה ברורה. מנהג אינו מחייב בפני עצמו וחובה הוכחה ומבחן לצדק.',
    example: 'נוהגי פסיקה מקובלים, עקרונות שיפוט לא כתובים',
    difficulty: 'hard',
    icon: '✨',
    relatedConcepts: ['judicial-practice', 'unwritten-law'],
    practicalNotes: 'מנהג משפטי דורש הוכחה קפדנית ואינו עומד בפני חוק ברור',
    importance: 'supplementary',
    lastUpdated: new Date()
  },

  // פרשנויות
  {
    id: 'literal-interpretation',
    category: 'פרשנויות',
    name: 'פרשנות לשון החוק',
    shortDescription: 'פירוש על בסיס המילים והניסוח בלבד',
    fullDescription: 'פרשנות לשון החוק היא פירוש קפדני על בסיס המילים והניסוח בלבד, ללא התייחסות למטרות או כוונות המחוקק. זוהי גישה שמרנית המתאימה לחוקים ברורים וחד-משמעיים.',
    example: 'חקיקה ברורה עם נוסח חד משמעי שאינו דורש פירוש',
    difficulty: 'easy',
    icon: '🔍',
    relatedConcepts: ['textual-interpretation', 'strict-construction'],
    practicalNotes: 'מתאים כאשר לשון החוק ברורה ואין מקום לפירושים שונים',
    importance: 'important',
    lastUpdated: new Date()
  },
  {
    id: 'purposive-interpretation',
    category: 'פרשנויות',
    name: 'פרשנות תכליתית',
    shortDescription: 'פירוש החוק לפי מטרתו וכוונת המחוקק',
    fullDescription: 'פרשנות תכליתית מפרשת את החוק לפי מטרתו וכוונת המחוקק, לא רק לפי לשונו הפשוטה. זוהי גישה גמישה המאפשרת שיפוט דינמי ואיזון זכויות יסוד מול אינטרסים ציבוריים.',
    example: 'חוק יסוד: חופש הביטוי - איזון בין חופש לבטחון',
    precedent: 'בג"ץ 6055/95 צמח נגד שר הביטחון - פרשנות תכליתית',
    difficulty: 'medium',
    icon: '🔍⚖️',
    relatedConcepts: ['teleological-interpretation', 'balancing-test'],
    practicalNotes: 'מאפשרת גמישות אך דורשת זהירות למניעת שרירותיות',
    importance: 'critical',
    lastUpdated: new Date()
  },

  // עקרונות
  {
    id: 'rule-of-law',
    category: 'עקרונות',
    name: 'חוקיות המנהל',
    shortDescription: 'הרשות המבצעת רשאית לפעול רק על סמך חוק',
    fullDescription: 'עקרון חוקיות המנהל קובע שהרשות המבצעת רשאית לפעול רק על סמך חוק או תקנה תקפה. זהו עיקרון יסוד במשטר דמוקרטי המבטיח שהממשלה לא תפעל שרירותית.',
    example: 'פעולות שר שאינן מבוססות על סמכות חוקית - בטלות',
    precedent: 'בג"ץ 390/79 דוויקאת נגד ממשלת ישראל - חוקיות המנהל',
    difficulty: 'easy',
    icon: '⚖️',
    relatedConcepts: ['administrative-law', 'separation-powers'],
    practicalNotes: 'כל פעולה מנהלית צריכה בסיס חוקי ברור',
    importance: 'critical',
    lastUpdated: new Date()
  },
  {
    id: 'constitutional-supremacy',
    category: 'עקרונות',
    name: 'עליונות חוקי היסוד',
    shortDescription: 'חוקים רגילים כפופים לחוקי יסוד',
    fullDescription: 'עקרון עליונות חוקי היסוד קובע שחוקים רגילים כפופים לחוקי יסוד. בתי המשפט מוסמכים לבטל חקיקה או פעולות מנהליות הסותרות חוק יסוד.',
    example: 'ביטול חוק שפוגע בזכות יסוד ללא הצדקה מספקת',
    precedent: 'בג"ץ 1466/07 גל נגד כנסת ישראל - עליונות חוק היסוד',
    difficulty: 'hard',
    icon: '⚖️✨',
    relatedConcepts: ['basic-laws', 'constitutional-review'],
    practicalNotes: 'הביקורת החוקתית תלויה בקיומה של פסקת הגבלה בחוק היסוד',
    importance: 'critical',
    lastUpdated: new Date()
  },

  // ═══════════════════════════════════════════════════════════════
  // מועבר מ-"מדריך מושגים משפטיים" (חומרי עיון)
  // ═══════════════════════════════════════════════════════════════

  // ─── מקורות המשפט ───────────────────────────────────────────
  {
    id: 'src-law', category: 'מקורות המשפט', icon: '⚖️',
    name: 'חוק',
    shortDescription: 'כלל משפטי שנקבע ע"י הכנסת, מחייב את כלל האוכלוסייה',
    fullDescription: 'כלל משפטי שנקבע על ידי הכנסת, המחייב את כלל האוכלוסייה ובעל עדיפות על פני מקורות משפט אחרים.',
    example: 'חוק יסוד: כבוד האדם וחירותו, חוק החוזים, חוק העונשין',
    difficulty: 'easy', importance: 'critical',
    legalSources: ["חוק יסוד: כבוד האדם וחירותו", "חוק החוזים (כללי חלק) התשל\"ג-1973"],
    relatedConcepts: ['src-regulation', 'src-precedent-law', 'src-custom'], lastUpdated: new Date()
  },
  {
    id: 'src-regulation', category: 'מקורות המשפט', icon: '⚖️',
    name: 'תקנה',
    shortDescription: 'כלל משפטי שנקבע ע"י הרשות המבצעת מכוח חוק — נמוכה בהיררכיה',
    fullDescription: 'כלל משפטי שנקבע על ידי הרשות המבצעת מכוח הסמכה בחוק. נמוכה בהיררכיה מחוק.',
    example: 'תקנות תעבורה, תקנות רישוי עסקים, תקנות ניירות ערך',
    difficulty: 'easy', importance: 'critical',
    legalSources: ['חוק הפרשנות, תשמ"א–1981; סעיף 17'],
    relatedConcepts: ['src-law', 'src-custom'], lastUpdated: new Date()
  },
  {
    id: 'src-precedent-law', category: 'מקורות המשפט', icon: '⚖️',
    name: 'תקדין (כמקור משפט)',
    shortDescription: 'פסק דין מחייב של בית משפט שמשמש מקור משפט לערכאות נמוכות',
    fullDescription: 'פסק דין של בית משפט שמהווה מקור משפט ומחייב בתי משפט נמוכים יותר במקרים דומים.',
    example: "בג\"ץ 6821/93 בנק המזרח המאוחד, ע\"א 243/83 ירושלים נגד גורדון",
    difficulty: 'medium', importance: 'critical',
    legalSources: ['חוק בתי המשפט התשנ"ד-1984; סעיף 20'],
    relatedConcepts: ['src-law', 'binding-precedent'], lastUpdated: new Date()
  },
  {
    id: 'src-custom', category: 'מקורות המשפט', icon: '✨',
    name: 'מנהג (כמקור משפט)',
    shortDescription: 'נוהג חוזר שהציבור מכיר בו כמחייב — בתנאי שאינו סותר חוק',
    fullDescription: 'נוהג חוזר ונשנה שהציבור מכיר בו כמחייב משפטית, ובלבד שאינו סותר חוק.',
    example: 'מנהגי המסחר, מנהגים במשפט המשפחה, מנהגי עבודה',
    difficulty: 'medium', importance: 'important',
    legalSources: ['חוק יסודות המשפט התש"ם-1980'],
    relatedConcepts: ['src-law', 'commercial-custom'], lastUpdated: new Date()
  },
  {
    id: 'src-norms-hierarchy', category: 'מקורות המשפט', icon: '📊',
    name: 'היררכיית נורמות',
    shortDescription: 'סדר עדיפויות: חוקי יסוד > חוק > חקיקת משנה > פסיקה',
    fullDescription: 'סדר הגבוה מול הנמוך בין מקורות משפט: חוקי יסוד > חוק > חקיקת משנה > פסיקה. נורמה נמוכה לא תגבר על גבוהה.',
    example: 'חוק יסוד גובר על חוק רגיל; תקנה בטלה אם חורגת מהחוק המסמיך',
    difficulty: 'medium', importance: 'critical',
    legalSources: ["בג\"ץ 6821/93 בנק המזרחי"],
    studyHighlight: 'מבחן מרכזי — ניתוח שאלה לפי היררכיה: תחילה חוק יסוד, אחר כך חוק רגיל, ורק אז חקיקת משנה.',
    relatedConcepts: ['src-law', 'src-regulation'], lastUpdated: new Date()
  },
  {
    id: 'src-purposive-interp', category: 'מקורות המשפט', icon: '🔍',
    name: 'פרשנות תכליתית',
    shortDescription: 'שיטת פרשנות המחפשת את מטרת החוק, לא רק לשונו',
    fullDescription: 'שיטת פרשנות שמחפשת את התכלית (המטרה) שמאחורי החוק, לא רק את הלשון המילולית שלו.',
    example: 'פרשנות חוקתית, פרשנות מטרתית, פרשנות מילולית',
    difficulty: 'medium', importance: 'important',
    legalSources: ['חוק הפרשנות התשמ"א-1981; ע"א 165/82 קיבוץ חצור'],
    relatedConcepts: ['purposive-interpretation'], lastUpdated: new Date()
  },
  {
    id: 'src-law-foundations', category: 'מקורות המשפט', icon: '🏛️',
    name: 'חוק יסודות המשפט',
    shortDescription: 'ברירת מחדל לפי עקרונות החירות, הצדק, היושר — מורשת ישראל',
    fullDescription: 'חוק הקובע שבהיעדר הוראת חוק, פסיקה או היקש — בית המשפט יכריע לפי עקרונות החירות, הצדק, היושר והשלום של מורשת ישראל.',
    example: 'מקרים ללא פתרון סטטוטורי, מילוי לאקונה',
    difficulty: 'hard', importance: 'important',
    legalSources: ['חוק יסודות המשפט, התש"ם–1980'],
    relatedConcepts: ['src-law'], lastUpdated: new Date()
  },

  // ─── דיני חוזים ─────────────────────────────────────────────
  {
    id: 'ctr-contract', category: 'דיני חוזים', icon: '📝',
    name: 'חוזה',
    shortDescription: 'הסכם משפטי בין צדדים היוצר זכויות וחובות הניתנות לאכיפה',
    fullDescription: 'הסכם משפטי בין צדדים היוצר זכויות וחובות הניתנות לאכיפה משפטית.',
    example: 'חוזה מכר, חוזה עבודה, חוזה שכירות',
    difficulty: 'easy', importance: 'critical',
    legalSources: ["חוק החוזים (כללי חלק) התשל\"ג-1973"],
    relatedConcepts: ['ctr-offer', 'ctr-acceptance', 'ctr-good-faith'], lastUpdated: new Date()
  },
  {
    id: 'ctr-offer', category: 'דיני חוזים', icon: '📝',
    name: 'הצעה',
    shortDescription: 'הצהרת רצון לכרות חוזה — חייבת לכלול גמירות דעת ומסוימות',
    fullDescription: 'הצהרת רצון לכרות חוזה בתנאים מסוימים — חייבת לכלול גמירות דעת ומסוימות.',
    example: 'הצעת מחיר, הצעה בחנות, הצעה בפרסומת',
    difficulty: 'easy', importance: 'critical',
    legalSources: ['סעיף 3 לחוק החוזים'],
    relatedConcepts: ['ctr-acceptance', 'ctr-contract'], lastUpdated: new Date()
  },
  {
    id: 'ctr-acceptance', category: 'דיני חוזים', icon: '📝',
    name: 'קיבול',
    shortDescription: 'הסכמה לכל תנאי ההצעה ללא שינוי — "מראה ראי"',
    fullDescription: 'הסכמה לכל תנאי ההצעה ללא שינוי — "מראה ראי". שינוי כלשהו יוצר הצעה נגדית.',
    example: 'חתימה על הסכם, תשלום מקדמה, התחלת ביצוע',
    difficulty: 'easy', importance: 'critical',
    legalSources: ['סעיפים 5–6 לחוק החוזים'],
    relatedConcepts: ['ctr-offer', 'ctr-contract'], lastUpdated: new Date()
  },
  {
    id: 'ctr-intent', category: 'דיני חוזים', icon: '📝',
    name: 'גמירות דעת',
    shortDescription: 'כוונה רצינית ומוחלטת להתקשר בחוזה',
    fullDescription: 'כוונה רצינית ומוחלטת להתקשר בחוזה — יסוד נדרש לתוקף ההצעה והקיבול.',
    example: 'חתימה על ניירות, תשלום כסף, מסוימות הפרטים',
    difficulty: 'medium', importance: 'critical',
    legalSources: ["סעיף 2 לחוק החוזים; ע\"א 158/77"],
    relatedConcepts: ['ctr-offer', 'ctr-contract'], lastUpdated: new Date()
  },
  {
    id: 'ctr-good-faith', category: 'דיני חוזים', icon: '📝',
    name: 'תום לב',
    shortDescription: 'עקרון-על חוזי: התנהגות הוגנת, ישרה ועקבית בכריתה ובקיום',
    fullDescription: 'עקרון על חוזי המחייב התנהגות הוגנת, ישרה ועקבית בכריתת חוזה ובקיומו.',
    example: 'גילוי מידע מהותי, איסור ניצול מצוקה, קיום כוונת הצדדים',
    difficulty: 'medium', importance: 'critical',
    legalSources: ['סעיפים 12, 39 לחוק החוזים'],
    studyHighlight: 'מופיע כמעט בכל שאלת חוזים — בדקו גם בשלב המשא ומתן (סעיף 12) וגם בקיום (סעיף 39).',
    relatedConcepts: ['ctr-contract', 'ctr-breach'], lastUpdated: new Date()
  },
  {
    id: 'ctr-breach', category: 'דיני חוזים', icon: '📝',
    name: 'הפרת חוזה',
    shortDescription: 'אי קיום התחייבות — יסודית (ביטול) או רגילה (פיצויים)',
    fullDescription: 'אי קיום התחייבות חוזית — יסודית (המאפשרת ביטול) או רגילה (המזכה בפיצויים).',
    example: 'אי תשלום, אי ביצוע עבודה, מסירה באיחור',
    difficulty: 'medium', importance: 'critical',
    legalSources: ['סעיפים 2, 7 לחוק החוזים (תרופות)'],
    studyHighlight: 'הבחינו בין הפרה יסודית (ביטול + פיצוי) להפרה רגילה (פיצוי בלבד) — ראו הגדרת "הפרה יסודית" בסעיף 6.',
    relatedConcepts: ['ctr-contract', 'ctr-good-faith'], lastUpdated: new Date()
  },
  {
    id: 'ctr-frustration', category: 'דיני חוזים', icon: '📝',
    name: 'סיכול חוזה',
    shortDescription: 'אירוע בלתי צפוי הופך את הביצוע לבלתי אפשרי — מפקיע את החוזה',
    fullDescription: 'אירוע בלתי צפוי הופך את ביצוע החוזה לבלתי אפשרי או שונה מהותית — מפקיע את החוזה.',
    example: 'מוות של צד יחיד בחוזה אישי, שינוי חוק האוסר את הנושא, כוח עליון',
    difficulty: 'hard', importance: 'important',
    legalSources: ['סעיף 18 לחוק החוזים (כללי חלק)'],
    relatedConcepts: ['ctr-contract', 'ctr-breach'], lastUpdated: new Date()
  },
  {
    id: 'ctr-unjust-enrichment', category: 'דיני חוזים', icon: '📝',
    name: 'עשיית עושר ולא במשפט',
    shortDescription: 'חיוב להשיב טובת הנאה שהתקבלה שלא כדין — גם בהיעדר חוזה',
    fullDescription: 'חיוב להשיב טובת הנאה שהתקבלה שלא כדין מאחר — על בסיס יושר, גם בהיעדר חוזה.',
    example: 'תשלום בטעות, תשלום לפי חוזה בטל, קבלת שירות ללא הסכם',
    difficulty: 'hard', importance: 'important',
    legalSources: ['חוק עשיית עושר ולא במשפט, תשל"ט–1979'],
    relatedConcepts: ['ctr-contract'], lastUpdated: new Date()
  },

  // ─── דיני עונשין ────────────────────────────────────────────
  {
    id: 'crim-mens-rea', category: 'דיני עונשין', icon: '🔒',
    name: 'מחשבה פלילית (Mens Rea)',
    shortDescription: 'היסוד הנפשי הנדרש לעבירה — מודעות, כוונה, פזיזות, רשלנות',
    fullDescription: 'היסוד הנפשי הנדרש לעבירה — מודעות, כוונה, פזיזות או רשלנות ביחס לנסיבות ולתוצאה.',
    example: 'כוונה ישירה לגרום נזק, פזיזות — קלות ראש, רשלנות — אי-תשומת לב',
    difficulty: 'medium', importance: 'critical',
    legalSources: ['סעיפים 19–21 לחוק העונשין, תשל"ז–1977'],
    studyHighlight: 'לכל עבירה יש יסוד נפשי ספציפי — אל תוסיפו כוונה אם החוק דורש רשלנות בלבד.',
    relatedConcepts: ['crim-actus-reus'], lastUpdated: new Date()
  },
  {
    id: 'crim-actus-reus', category: 'דיני עונשין', icon: '🔒',
    name: 'מעשה פלילי (Actus Reus)',
    shortDescription: 'האלמנט הפיזי: מעשה/מחדל + תוצאה + קשר סיבתי',
    fullDescription: 'האלמנט הפיזי של העבירה — מעשה, מחדל, תוצאה וקשר סיבתי ביניהם.',
    example: 'מכה, אי-מניעת נזק במחדל, גרימת מוות',
    difficulty: 'medium', importance: 'critical',
    legalSources: ['חוק העונשין התשל"ז-1977'],
    relatedConcepts: ['crim-mens-rea'], lastUpdated: new Date()
  },
  {
    id: 'crim-attempt', category: 'דיני עונשין', icon: '🔒',
    name: 'נסיון לעבירה',
    shortDescription: 'התחלת ביצוע עבירה בכוונה להשלימה — עצמו עבירה',
    fullDescription: 'התחלת ביצוע עבירה בכוונה להשלימה — הנסיון עצמו הוא עבירה, גם אם העבירה לא הושלמה.',
    example: 'נסיון לרצח שנכשל, ניסיון גנבה שנתגלה',
    difficulty: 'medium', importance: 'important',
    legalSources: ['סעיף 25 לחוק העונשין'],
    relatedConcepts: ['crim-mens-rea', 'crim-actus-reus'], lastUpdated: new Date()
  },
  {
    id: 'crim-self-defense', category: 'דיני עונשין', icon: '🔒',
    name: 'הגנה עצמית',
    shortDescription: 'סייג לאחריות: הגנה מפני תקיפה בלתי חוקית בכוח סביר',
    fullDescription: 'הגנה (סייג) הפוטרת מאחריות פלילית כאשר המעשה נועד להגן על עצמו מפני תקיפה בלתי חוקית, בכוח סביר.',
    example: 'דחיפת תוקף, שימוש בכוח מדוד, הגנה על אחר',
    difficulty: 'medium', importance: 'important',
    legalSources: ['סעיף 34י לחוק העונשין'],
    relatedConcepts: ['crim-mens-rea'], lastUpdated: new Date()
  },
  {
    id: 'crim-partnership', category: 'דיני עונשין', icon: '🔒',
    name: 'שותפות לעבירה',
    shortDescription: 'ביצוע עבירה ע"י יותר מאדם אחד — כל אחד נושא לפי תפקידו',
    fullDescription: 'ביצוע עבירה על ידי יותר מאדם אחד — מבצע, מסייע, שותף, מחשיל. כל אחד נושא באחריות בהתאם לתפקידו.',
    example: 'שניים גונבים יחד, אחד מסייע לאחר, ריבוי מבצעים',
    difficulty: 'medium', importance: 'important',
    legalSources: ['סעיפים 26–31 לחוק העונשין'],
    relatedConcepts: ['crim-mens-rea', 'crim-actus-reus'], lastUpdated: new Date()
  },
  {
    id: 'crim-insanity', category: 'דיני עונשין', icon: '🔒',
    name: 'חוסר שפיות',
    shortDescription: 'סייג: מחלת נפש שוללת הבנת הפסול או שליטה בהתנהגות',
    fullDescription: 'סייג לאחריות פלילית כאשר הנאשם אינו מסוגל, עקב מחלת נפש, להבין שמעשהו פסול או לשלוט בהתנהגותו.',
    example: 'פסיכוזה חריפה, הפרעה דו-קוטבית חמורה',
    difficulty: 'hard', importance: 'supplementary',
    legalSources: ['סעיף 34ח לחוק העונשין'],
    relatedConcepts: ['crim-mens-rea'], lastUpdated: new Date()
  },
  {
    id: 'crim-sentencing', category: 'דיני עונשין', icon: '🔒',
    name: 'גזר דין ושיקולי ענישה',
    shortDescription: 'קביעת ענישה: הרתעה, גמול, שיקום, הגנת הציבור, מידתיות',
    fullDescription: 'הליך קביעת הענישה לאחר הרשעה — מאזן בין הרתעה, גמול, שיקום, הגנת הציבור ומידתיות.',
    example: 'מאסר, קנס, עבודת שירות; שיקולי נסיבות מקלות ומחמירות',
    difficulty: 'hard', importance: 'important',
    legalSources: ['סעיפים 40ט–40יח לחוק העונשין'],
    relatedConcepts: ['crim-mens-rea'], lastUpdated: new Date()
  },

  // ─── משפט חוקתי ─────────────────────────────────────────────
  {
    id: 'con-basic-laws', category: 'משפט חוקתי', icon: '🏛️',
    name: 'חוקי יסוד',
    shortDescription: 'חוקים בעלי מעמד עליון — אמורים לשמש בסיס לחוקה עתידית',
    fullDescription: 'חוקים בעלי מעמד עליון בסדר הנורמטיבי הישראלי — אמורים לשמש בסיס לחוקה עתידית.',
    example: 'חוק יסוד: כבוד האדם וחירותו, חוק יסוד: הכנסת, חוק יסוד: חופש העיסוק',
    difficulty: 'easy', importance: 'critical',
    legalSources: ['חוקי היסוד של מדינת ישראל'],
    relatedConcepts: ['con-human-rights', 'con-limitation-clause', 'basic-laws'], lastUpdated: new Date()
  },
  {
    id: 'con-human-rights', category: 'משפט חוקתי', icon: '🏛️',
    name: 'זכויות אדם ואזרח',
    shortDescription: 'זכויות בסיסיות המוגנות בחוקי יסוד: כבוד, חירות, שוויון, קניין',
    fullDescription: 'זכויות בסיסיות המוגנות בחוקי יסוד — כבוד, חירות, שוויון, קניין, פרטיות ועוד.',
    example: 'זכות לחיים, זכות לחירות, זכות לכבוד האדם',
    difficulty: 'easy', importance: 'critical',
    legalSources: ['חוק יסוד: כבוד האדם וחירותו'],
    relatedConcepts: ['con-basic-laws', 'con-limitation-clause'], lastUpdated: new Date()
  },
  {
    id: 'con-sep-powers', category: 'משפט חוקתי', icon: '🏛️',
    name: 'הפרדת רשויות',
    shortDescription: 'כנסת (מחוקקת), ממשלה (מבצעת), בתי משפט (שופטת) — עצמאות הדדית',
    fullDescription: 'חלוקת כוח השלטון לשלוש רשויות עצמאיות: מחוקקת (כנסת), מבצעת (ממשלה), שופטת (בתי משפט).',
    example: 'הכנסת חוקקת, הממשלה מבצעת, בית משפט שופט',
    difficulty: 'easy', importance: 'critical',
    legalSources: ['חוק יסוד: הכנסת; חוק יסוד: הממשלה; חוק יסוד: השפיטה'],
    relatedConcepts: ['con-basic-laws'], lastUpdated: new Date()
  },
  {
    id: 'con-limitation-clause', category: 'משפט חוקתי', icon: '🏛️',
    name: 'פסקת הגבלה',
    shortDescription: 'תנאים לפגיעה חוקית בזכות חוקתית: חוק, תכלית ראויה, מידתיות',
    fullDescription: 'הוראה בחוק יסוד המגדירה תנאים בהם ניתן לפגוע בזכות חוקתית — חוק, ראוי, מידתי.',
    example: 'הגבלת חופש התנועה לצורכי ביטחון, הגבלת קניין לצרכי ציבור',
    difficulty: 'medium', importance: 'critical',
    legalSources: ['סעיף 8 לחוק יסוד: כבוד האדם וחירותו'],
    studyHighlight: '3 תנאים מצטברים: (1) בחוק, (2) תכלית ראויה, (3) מידתיות. חסר אחד — הפגיעה בטלה.',
    relatedConcepts: ['con-basic-laws', 'con-proportionality'], lastUpdated: new Date()
  },
  {
    id: 'con-proportionality', category: 'משפט חוקתי', icon: '🏛️',
    name: 'מידתיות',
    shortDescription: 'עקרון: הפגיעה בזכות לא תעלה על הנדרש להשגת התכלית',
    fullDescription: 'עקרון חוקתי ומינהלי הדורש שפגיעה בזכות לא תעלה על הנדרש להשגת התכלית הלגיטימית.',
    example: 'מבחן ההתאמה, מבחן האמצעי המידתי, מבחן המידתיות במובן הצר',
    difficulty: 'medium', importance: 'critical',
    legalSources: ["בג\"ץ 6427/02 התנועה לאיכות השלטון"],
    studyHighlight: '3 מבחני המידתיות: (א) התאמה, (ב) אמצעי מידתי (הכרחי), (ג) מידתיות במובן הצר (שקילות).',
    relatedConcepts: ['con-limitation-clause', 'con-basic-laws'], lastUpdated: new Date()
  },
  {
    id: 'con-judicial-review', category: 'משפט חוקתי', icon: '🏛️',
    name: 'ביקורת חוקתית',
    shortDescription: 'סמכות בג"ץ לבטל חוק הנוגד חוק יסוד — "המהפכה החוקתית"',
    fullDescription: 'סמכות בית המשפט לבטל חוק הכנסת הנוגד חוק יסוד — שהוקנתה בפסיקת "המהפכה החוקתית".',
    example: "בג\"ץ בנק המזרחי 1995, בטלות חלקית של חוק",
    difficulty: 'hard', importance: 'important',
    legalSources: ["בג\"ץ 6821/93 בנק המזרח המאוחד"],
    relatedConcepts: ['con-basic-laws', 'con-limitation-clause'], lastUpdated: new Date()
  },
  {
    id: 'con-rule-of-law', category: 'משפט חוקתי', icon: '🏛️',
    name: 'שלטון החוק',
    shortDescription: 'כולם כפופים לחוק — אזרחים, ממשלה ושלטון, ואף אחד אינו מעל',
    fullDescription: 'עיקרון יסוד שלפיו כולם כפופים לחוק — אזרחים, ממשלה ושלטון — ואף אחד אינו מעל החוק.',
    example: 'אכיפה שוויונית, ביקורת על ממשלה, עצמאות שיפוטית',
    difficulty: 'easy', importance: 'critical',
    legalSources: ['חוק יסוד: השפיטה; פסיקת בית המשפט העליון'],
    relatedConcepts: ['con-sep-powers', 'con-judicial-review'], lastUpdated: new Date()
  },

  // ─── משפט מינהלי ────────────────────────────────────────────
  {
    id: 'adm-law', category: 'משפט מינהלי', icon: '🏢',
    name: 'משפט מינהלי',
    shortDescription: 'ענף המשפט העוסק בפעילות הרשות המבצעת וביקורת שיפותית עליה',
    fullDescription: 'ענף המשפט העוסק בפעילות הרשות המבצעת ובביקורת השיפותית עליה.',
    example: 'רישיון עסק, אישור בנייה, החלטה של רשות מקומית',
    difficulty: 'easy', importance: 'critical',
    legalSources: ['חוק יסודות המשפט, תש"ם–1980'],
    relatedConcepts: ['adm-hearing', 'adm-discretion', 'adm-reasonableness'], lastUpdated: new Date()
  },
  {
    id: 'adm-hearing', category: 'משפט מינהלי', icon: '🏢',
    name: 'זכות שימוע',
    shortDescription: 'עקרון צדק טבעי: הזדמנות להשמיע טענות לפני פעולה פוגעת',
    fullDescription: 'עקרון צדק טבעי המחייב שאדם שעלולה להינקט כלפיו פעולה פוגעת יוכל להשמיע את טענותיו לפני קבלת ההחלטה.',
    example: 'שימוע לפני פיטורין, שימוע לפני ביטול רישיון, שימוע לפני עיצום',
    difficulty: 'easy', importance: 'critical',
    legalSources: ['בג"ץ 3/58 ברמן; חוק השימוע'],
    studyHighlight: 'שימוע מהותי — לא פורמלי בלבד. הרשות חייבת לשקול את הטענות שנשמעו לפני ההחלטה.',
    relatedConcepts: ['adm-law', 'adm-discretion'], lastUpdated: new Date()
  },
  {
    id: 'adm-discretion', category: 'משפט מינהלי', icon: '🏢',
    name: 'שיקול דעת מינהלי',
    shortDescription: 'סמכות הרשות לבחור בין אפשרויות — בסבירות ולפי שיקולים ענייניים',
    fullDescription: 'סמכות הרשות לבחור בין אפשרויות פעולה — אך חייבת לפעול בסבירות, בתום לב ולפי שיקולים ענייניים.',
    example: 'שיקול דעת בהענקת רישיון, שיקול דעת בקביעת קנסות',
    difficulty: 'medium', importance: 'critical',
    legalSources: ["בג\"ץ 389/80 דפי זהב"],
    relatedConcepts: ['adm-reasonableness', 'adm-law'], lastUpdated: new Date()
  },
  {
    id: 'adm-reasonableness', category: 'משפט מינהלי', icon: '🏢',
    name: 'עקרון הסבירות',
    shortDescription: 'עילת ביקורת שיפותית — החלטה שרשות סבירה לא הייתה מקבלת תבוטל',
    fullDescription: 'עילת ביקורת שיפותית — החלטה מינהלית תבוטל אם חרגה ממה שרשות סבירה הייתה עושה בנסיבות.',
    example: 'ענישה לא פרופורציונלית, העדפת שיקולים זרים, החלטה שרירותית',
    difficulty: 'medium', importance: 'critical',
    legalSources: ["בג\"ץ 935/89 גנור; עקרון Wednesbury"],
    relatedConcepts: ['adm-discretion', 'adm-law'], lastUpdated: new Date()
  },
  {
    id: 'adm-judicial-review', category: 'משפט מינהלי', icon: '🏢',
    name: 'ביקורת שיפותית על הרשות',
    shortDescription: 'סמכות בג"ץ לבחון חוקיות פעולות ממשלתיות ולהוציא צווים',
    fullDescription: 'סמכות בג"ץ לבחון חוקיות פעולות ממשלתיות ולהוציא צווים — ביטול, עשה, מניעה.',
    example: 'בג"ץ, צו הצהרתי, ביטול החלטת ממשלה',
    difficulty: 'hard', importance: 'important',
    legalSources: ['חוק בתי המשפט, תשנ"ד–1984; סעיף 15'],
    relatedConcepts: ['adm-law', 'con-judicial-review'], lastUpdated: new Date()
  },
  {
    id: 'adm-foia', category: 'משפט מינהלי', icon: '🏢',
    name: 'חופש המידע',
    shortDescription: 'זכות לקבל מידע מרשות ציבורית ללא נימוק — כפוף לחריגים',
    fullDescription: 'זכות כל אדם לקבל מידע מרשות ציבורית, ללא צורך בנימוק — כפוף לחריגים מוגדרים בחוק.',
    example: 'בקשה לפרוטוקול ממשלתי, מידע על תקציבים, חוזי רשות',
    difficulty: 'hard', importance: 'important',
    legalSources: ['חוק חופש המידע, תשנ"ח–1998'],
    relatedConcepts: ['adm-law'], lastUpdated: new Date()
  },

  // ─── דיני נזיקין ────────────────────────────────────────────
  {
    id: 'tort-general', category: 'דיני נזיקין', icon: '⚡',
    name: 'עוולה נזיקית',
    shortDescription: 'מעשה/מחדל הגורם נזק לאחר שהחוק מכיר בזכות לפיצוי',
    fullDescription: 'מעשה או מחדל של אדם הגורם נזק לאחר, שהחוק מכיר בזכות לפיצוי בגינו — ללא צורך בחוזה.',
    example: 'רשלנות, תקיפה, לשון הרע',
    difficulty: 'easy', importance: 'critical',
    legalSources: ['פקודת הנזיקין (נוסח חדש)'],
    relatedConcepts: ['tort-negligence', 'tort-defamation'], lastUpdated: new Date()
  },
  {
    id: 'tort-negligence', category: 'דיני נזיקין', icon: '⚡',
    name: 'רשלנות',
    shortDescription: 'הפרת חובת זהירות הגורמת נזק צפוי לאחר',
    fullDescription: 'עוולה הנוצרת כשאדם מפר חובת זהירות המוטלת עליו, ובכך גורם נזק שהיה ניתן לצפות.',
    example: 'נהג רשלן, רופא שלא בדק, קבלן שלא אבטח',
    difficulty: 'easy', importance: 'critical',
    legalSources: ["סעיף 35–36 לפקודת הנזיקין; ע\"א 145/80 ועקנין"],
    studyHighlight: '3 יסודות: (1) חובת זהירות, (2) הפרתה, (3) נזק + קשר סיבתי. כולם נדרשים.',
    relatedConcepts: ['tort-duty-of-care', 'tort-causation'], lastUpdated: new Date()
  },
  {
    id: 'tort-duty-of-care', category: 'דיני נזיקין', icon: '⚡',
    name: 'חובת זהירות',
    shortDescription: 'חובה משפטית לפעול בזהירות כלפי מי שניתן לצפות שייפגע',
    fullDescription: 'חובה משפטית לפעול בזהירות כלפי מי שניתן לצפות שייפגע ממעשינו — יסוד ראשון ברשלנות.',
    example: 'חובת זהירות של רופא לחולה, של נהג לעוברי דרך, של מוצר לצרכן',
    difficulty: 'medium', importance: 'critical',
    legalSources: ["ע\"א 145/80 ועקנין נ. מועצה אזורית"],
    relatedConcepts: ['tort-negligence', 'tort-causation'], lastUpdated: new Date()
  },
  {
    id: 'tort-causation', category: 'דיני נזיקין', icon: '⚡',
    name: 'קשר סיבתי',
    shortDescription: 'קשר בין מעשה הנתבע לנזק — עובדתי (אלמלא) ומשפטי (צפיות)',
    fullDescription: 'הקשר הנדרש בין מעשה הנתבע לבין הנזק — עובדתי (אלמלא) ומשפטי (צפיות הנזק).',
    example: 'מבחן הסיבה-בלעדיה-אין, ניתוק קשר סיבתי, גורם מתערב',
    difficulty: 'medium', importance: 'critical',
    relatedConcepts: ['tort-negligence', 'tort-duty-of-care'], lastUpdated: new Date()
  },
  {
    id: 'tort-strict-liability', category: 'דיני נזיקין', icon: '⚡',
    name: 'אחריות חמורה (מוחלטת)',
    shortDescription: 'אחריות ללא צורך בהוכחת אשם — פעילות מסוכנת, בעל חיים',
    fullDescription: 'אחריות ללא צורך בהוכחת אשם — מוטלת מעצם ביצוע פעילות מסוכנת או אחזקת בעל חיים מסוכן.',
    example: 'בעל חיה מסוכנת, חפצים מסוכנים, ייצור מוצרים פגומים',
    difficulty: 'hard', importance: 'important',
    legalSources: ['סעיפים 41–43 לפקודת הנזיקין'],
    relatedConcepts: ['tort-general', 'tort-negligence'], lastUpdated: new Date()
  },
  {
    id: 'tort-defamation', category: 'דיני נזיקין', icon: '⚡',
    name: 'לשון הרע',
    shortDescription: 'פרסום דבר שעלול להשפיל, לבזות או לפגוע בעסקי אדם — עוולה ועבירה',
    fullDescription: 'פרסום דבר העלול להשפיל אדם בעיני הבריות, לבזותו, לפגוע בעסקיו או לחשפו לשנאה — עוולה ועבירה.',
    example: 'פרסום כוזב, פגיעה במוניטין, פרסום ברשת חברתית',
    difficulty: 'medium', importance: 'important',
    legalSources: ['חוק איסור לשון הרע, תשכ"ה–1965'],
    relatedConcepts: ['tort-general'], lastUpdated: new Date()
  },

  // ─── דיני קניין ─────────────────────────────────────────────
  {
    id: 'prop-ownership', category: 'דיני קניין', icon: '🏠',
    name: 'בעלות',
    shortDescription: 'הזכות הקניינית המלאה — שליטה בלעדית בנכס כולל מכירה/ירושה',
    fullDescription: 'הזכות הקניינית המלאה והמקיפה ביותר — שליטה בלעדית בנכס, לרבות הזכות למכור, לתת ולהוריש.',
    example: 'בעלות על דירה, בעלות על מכונית, בעלות על עסק',
    difficulty: 'easy', importance: 'critical',
    legalSources: ['חוק המקרקעין, תשכ"ט–1969; סעיף 2'],
    relatedConcepts: ['prop-registry', 'prop-mortgage'], lastUpdated: new Date()
  },
  {
    id: 'prop-registry', category: 'דיני קניין', icon: '🏠',
    name: 'רישום בטאבו',
    shortDescription: 'מרשם ממשלתי רשמי לזכויות במקרקעין — הרישום הוא הוכחה חלוטה',
    fullDescription: 'מרשם ממשלתי רשמי של זכויות במקרקעין — הרישום הוא הוכחה חלוטה לבעלות.',
    example: 'רישום דירה, רישום משכנתא, רישום זיקת הנאה',
    difficulty: 'easy', importance: 'critical',
    legalSources: ['חוק המקרקעין, סעיפים 7–10'],
    relatedConcepts: ['prop-ownership', 'prop-mortgage'], lastUpdated: new Date()
  },
  {
    id: 'prop-easement', category: 'דיני קניין', icon: '🏠',
    name: 'זיקת הנאה',
    shortDescription: 'זכות קניינית להשתמש בנכס שכן לצורך מוגדר (מעבר, מים, אור)',
    fullDescription: 'זכות קניינית של בעל מקרקעין אחד להשתמש בנכס שכנו לצורך מוגדר (מעבר, מים, אור).',
    example: 'זכות מעבר, זכות השקיה, זיקת צינור ביוב',
    difficulty: 'medium', importance: 'important',
    legalSources: ['חוק המקרקעין, סעיפים 92–101'],
    relatedConcepts: ['prop-ownership'], lastUpdated: new Date()
  },
  {
    id: 'prop-mortgage', category: 'דיני קניין', icon: '🏠',
    name: 'משכנתא',
    shortDescription: 'שעבוד מקרקעין להבטחת חוב — ניתן למימוש אם החוב לא נפרע',
    fullDescription: 'שעבוד מקרקעין להבטחת חוב — הנושה רשאי לממש את הנכס אם החוב לא נפרע.',
    example: 'משכנתא לדירה, שעבוד לטובת בנק, מימוש בהוצאה לפועל',
    difficulty: 'medium', importance: 'important',
    legalSources: ['חוק המקרקעין, סעיפים 85–87'],
    relatedConcepts: ['prop-ownership', 'prop-registry'], lastUpdated: new Date()
  },
  {
    id: 'prop-co-ownership', category: 'דיני קניין', icon: '🏠',
    name: 'שיתוף במקרקעין',
    shortDescription: 'בעלות משותפת של מספר אנשים — כל שותף רשאי לדרוש פירוק שיתוף',
    fullDescription: 'בעלות משותפת של מספר אנשים על אותו נכס — כל שותף יכול לדרוש פירוק שיתוף.',
    example: 'דירה בבעלות שני יורשים, נחלה משפחתית, בית משותף',
    difficulty: 'hard', importance: 'important',
    legalSources: ['חוק המקרקעין, סעיפים 27–43'],
    relatedConcepts: ['prop-ownership'], lastUpdated: new Date()
  },

  // ─── דיני עבודה ─────────────────────────────────────────────
  {
    id: 'lab-contract', category: 'דיני עבודה', icon: '💼',
    name: 'חוזה עבודה',
    shortDescription: 'הסכם בין עובד למעביד — בסיסו חוזי אך מוגן בחקיקה',
    fullDescription: 'הסכם בין עובד למעביד הקובע תנאי העסקה — שכר, שעות, תפקיד. בסיסו חוזי אך מוגן בחקיקה.',
    example: 'חוזה אישי, הסכם קיבוצי, חוזה לתקופה קצובה',
    difficulty: 'easy', importance: 'critical',
    legalSources: ['חוק עבודת נשים; חוק שכר מינימום; חוק הודעה לעובד'],
    relatedConcepts: ['lab-dismissal', 'lab-collective'], lastUpdated: new Date()
  },
  {
    id: 'lab-dismissal', category: 'דיני עבודה', icon: '💼',
    name: 'פיטורין',
    shortDescription: 'סיום יחסי עבודה ע"י המעביד — הודעה מוקדמת + פיצויים (לאחר שנה)',
    fullDescription: 'סיום יחסי עבודה על ידי המעביד — חייב להיות בהודעה מוקדמת ועם תשלום פיצויי פיטורין (לאחר שנה).',
    example: 'פיטורין לאחר שנת עבודה, פיטורין בהסכמה, פיטורין שלא כדין',
    difficulty: 'easy', importance: 'critical',
    legalSources: ['חוק פיצויי פיטורים, תשכ"ג–1963'],
    studyHighlight: 'פיטורין מחייבים שימוע (זכות מינהלית) לפני ההחלטה. פיטורין ללא שימוע — עשויים לחייב פיצוי נוסף.',
    relatedConcepts: ['lab-contract', 'adm-hearing'], lastUpdated: new Date()
  },
  {
    id: 'lab-collective', category: 'דיני עבודה', icon: '💼',
    name: 'הסכם קיבוצי',
    shortDescription: 'הסכם בין ארגון עובדים למעביד — מחייב את כלל העובדים בתחומו',
    fullDescription: 'הסכם בין ארגון עובדים לבין מעביד/ארגון מעבידים — קובע תנאי עבודה ומחייב את כל העובדים בתחומו.',
    example: 'הסכם שכר ענפי, הסכם קיבוצי מיוחד, צו הרחבה',
    difficulty: 'medium', importance: 'important',
    legalSources: ['חוק הסכמים קיבוציים, תשי"ז–1957'],
    relatedConcepts: ['lab-contract'], lastUpdated: new Date()
  },
  {
    id: 'lab-minimum-wage', category: 'דיני עבודה', icon: '💼',
    name: 'שכר מינימום',
    shortDescription: 'שכר מינימלי שמעביד חייב לשלם — נקבע בחוק ומתעדכן',
    fullDescription: 'שכר המינימום שמעביד חייב לשלם לעובד — נקבע בחוק ומתעדכן מעת לעת.',
    example: 'שכר מינימום חודשי, שכר מינימום שעתי, תוספות מעל המינימום',
    difficulty: 'easy', importance: 'important',
    legalSources: ['חוק שכר מינימום, תשמ"ז–1987'],
    relatedConcepts: ['lab-contract'], lastUpdated: new Date()
  },
  {
    id: 'lab-discrimination', category: 'דיני עבודה', icon: '💼',
    name: 'הפליה בעבודה',
    shortDescription: 'איסור הפליה על בסיס גיל, מין, לאום, דת, מוגבלות ועוד',
    fullDescription: 'אסור למעביד להפלות עובד או מועמד לעבודה על בסיס גיל, מין, לאום, דת, מוגבלות ועוד.',
    example: 'פיטורין של אישה בהריון, אי-קבלה בשל גיל, שכר נמוך לאישה',
    difficulty: 'medium', importance: 'important',
    legalSources: ['חוק שוויון הזדמנויות בעבודה, תשמ"ח–1988'],
    relatedConcepts: ['lab-dismissal', 'con-human-rights'], lastUpdated: new Date()
  },

  // ─── דיני משפחה ─────────────────────────────────────────────
  {
    id: 'fam-marriage', category: 'דיני משפחה', icon: '👨‍👩‍👧',
    name: 'נישואין',
    shortDescription: 'חוזה בין שני בני זוג — בישראל מוסדר לפי דיני הדת',
    fullDescription: 'חוזה משפטי בין שני בני זוג — בישראל מוסדר על בסיס דיני הדת של כל עדה (יהודים: רבנות, מוסלמים: שריעה).',
    example: 'נישואין יהודיים, נישואין אזרחיים בחו"ל, ידועים בציבור',
    difficulty: 'easy', importance: 'critical',
    legalSources: ['חוק שיפוט בתי דין רבניים; חוק הנישואין והגירושין'],
    relatedConcepts: ['fam-divorce', 'fam-common-law'], lastUpdated: new Date()
  },
  {
    id: 'fam-divorce', category: 'דיני משפחה', icon: '👨‍👩‍👧',
    name: 'גירושין',
    shortDescription: 'פירוק קשר הנישואין — מחייב גט (יהודים) + הסדרת מזונות/משמורת/רכוש',
    fullDescription: 'פירוק קשר הנישואין — בחוק הישראלי מחייב גט דתי (ליהודים) ומחייב הסדרת מזונות, משמורת וחלוקת רכוש.',
    example: 'גט בהסכמה, הסכם גירושין, גירושין בהכרח',
    difficulty: 'easy', importance: 'critical',
    legalSources: ['חוק שיפוט בתי דין רבניים (נישואין וגירושין), תשי"ג–1953'],
    relatedConcepts: ['fam-marriage', 'fam-alimony', 'fam-custody'], lastUpdated: new Date()
  },
  {
    id: 'fam-alimony', category: 'דיני משפחה', icon: '👨‍👩‍👧',
    name: 'מזונות',
    shortDescription: 'חיוב לספק צרכי מחייה לבן זוג/ילדים לאחר פירוד — לפי צרכים ויכולת',
    fullDescription: 'חיוב לספק צרכי מחייה לבן זוג או לילדים לאחר פירוד — גובהם נקבע לפי צרכים ויכולת.',
    example: 'מזונות קטין, מזונות אישה, הגשת תביעת מזונות',
    difficulty: 'medium', importance: 'critical',
    legalSources: ['חוק לתיקון דיני המשפחה (מזונות), תשי"ט–1959'],
    relatedConcepts: ['fam-divorce', 'fam-custody'], lastUpdated: new Date()
  },
  {
    id: 'fam-custody', category: 'דיני משפחה', icon: '👨‍👩‍👧',
    name: 'משמורת ילדים',
    shortDescription: 'הזכות והחובה להחזיק בילד — נקבעת לפי טובת הילד ע"י בית המשפט',
    fullDescription: 'הזכות וחובה להחזיק בילד ולקבוע את מסגרת חייו — נקבעת לפי טובת הילד ועל ידי בית המשפט לענייני משפחה.',
    example: 'משמורת פיזית, משמורת משפטית, הסדרי ראייה',
    difficulty: 'medium', importance: 'critical',
    legalSources: ['חוק הכשרות המשפטית והאפוטרופסות, תשכ"ב–1962'],
    studyHighlight: 'עיקרון "טובת הילד" גובר על כל שיקול אחר. חלוקת משמורת שווה אינה אוטומטית.',
    relatedConcepts: ['fam-divorce', 'fam-alimony'], lastUpdated: new Date()
  },
  {
    id: 'fam-common-law', category: 'דיני משפחה', icon: '👨‍👩‍👧',
    name: 'ידועים בציבור',
    shortDescription: 'זוג החי יחד ללא נישואין — זכאים לרבות מזכויות הנשואים',
    fullDescription: 'זוג החי יחד כבעל ואישה ללא נישואין רשמיים — זכאים לרבות מזכויות הנשואים בדיני הרכוש והירושה.',
    example: 'שיתוף נכסים, זכות ירושה, מזונות לאחר פרידה',
    difficulty: 'hard', importance: 'important',
    legalSources: ['פסיקת בית המשפט העליון; חוק הירושה, תשכ"ה–1965'],
    relatedConcepts: ['fam-marriage', 'inh-inheritance'], lastUpdated: new Date()
  },

  // ─── דיני ירושה ─────────────────────────────────────────────
  {
    id: 'inh-inheritance', category: 'דיני ירושה', icon: '📜',
    name: 'ירושה',
    shortDescription: 'העברת זכויות וחובות של המוריש ליורשיו — לפי דין או לפי צוואה',
    fullDescription: 'העברת זכויות וחובות של המוריש ליורשיו עם פטירתו — על פי דין או על פי צוואה.',
    example: 'ירושה על פי דין, ירושה לפי צוואה, ויתור על ירושה',
    difficulty: 'easy', importance: 'critical',
    legalSources: ['חוק הירושה, תשכ"ה–1965'],
    studyHighlight: 'הבחינו: ירושה על פי דין (סדר עדיפויות בחוק) לעומת ירושה על פי צוואה. מה נכלל ב"עיזבון" ומה לא (ביטוח חיים למוטב).',
    relatedConcepts: ['inh-will', 'inh-estate', 'inh-legal-heirs'], lastUpdated: new Date()
  },
  {
    id: 'inh-will', category: 'דיני ירושה', icon: '📜',
    name: 'צוואה',
    shortDescription: 'הוראות לחלוקת רכוש לאחר המוות — דרישות צורה מחמירות',
    fullDescription: 'הוראות שנותן אדם בחייו לחלוקת רכושו לאחר מותו — חייבת לעמוד בדרישות צורה מחמירות.',
    example: 'צוואה בכתב יד, צוואה בפני עדים, צוואה בעל פה (שכיב מרע)',
    difficulty: 'medium', importance: 'critical',
    legalSources: ['סעיפים 18–28 לחוק הירושה'],
    studyHighlight: 'שימו לב לסוגי צוואות, כשרות המצווה, עדים, וביטול/חזרה מצוואה. צו קיום צוואה נדרש לפני רישום נכסים.',
    relatedConcepts: ['inh-inheritance', 'inh-probate'], lastUpdated: new Date()
  },
  {
    id: 'inh-estate', category: 'דיני ירושה', icon: '📜',
    name: 'עיזבון',
    shortDescription: 'כלל נכסים וחובות המוריש — הנושים יגבו רק עד שווי העיזבון',
    fullDescription: 'כלל הנכסים והחובות של המוריש המועברים ליורשים — הנושים יכולים לגבות רק עד שווי העיזבון.',
    example: 'דירה בעיזבון, חובות המנוח, חשבון בנק',
    difficulty: 'medium', importance: 'important',
    legalSources: ['סעיפים 107–112 לחוק הירושה'],
    relatedConcepts: ['inh-inheritance', 'inh-legal-heirs'], lastUpdated: new Date()
  },
  {
    id: 'inh-legal-heirs', category: 'דיני ירושה', icon: '📜',
    name: 'יורשים על פי דין',
    shortDescription: 'סדר ירושה בהיעדר צוואה: בן/בת זוג וצאצאים > הורים > אחים',
    fullDescription: 'סדר הירושה הקבוע בחוק בהיעדר צוואה: בן/בת זוג וצאצאים קודמים להורים, שקודמים לאחים.',
    example: 'בן זוג + ילדים, הורים בהיעדר ילדים, אחים בהיעדר הורים',
    difficulty: 'medium', importance: 'critical',
    legalSources: ['סעיפים 10–16 לחוק הירושה'],
    studyHighlight: 'בן הזוג לוקח חצי + ילדים חולקים חצי (אלא אם אין ילדים). סדר מדויק — נסמכו על סעיפים 11–14.',
    relatedConcepts: ['inh-inheritance', 'inh-will'], lastUpdated: new Date()
  },
  {
    id: 'inh-probate', category: 'דיני ירושה', icon: '📜',
    name: 'צו ירושה / צו קיום צוואה',
    shortDescription: 'צו רשמי המאשר יורשים — מאפשר העברת נכסים',
    fullDescription: 'צו שמוציא הרשם לענייני ירושה המאשר מי הם היורשים ומה הרכוש — מאפשר העברת נכסים.',
    example: 'פתיחת חשבון בנק של נפטר, העברת בעלות על דירה',
    difficulty: 'medium', importance: 'important',
    legalSources: ['סעיפים 66–77 לחוק הירושה'],
    studyHighlight: 'צו ירושה — ללא צוואה. צו קיום צוואה — לאחר בדיקת תוקף. ללא צו — לא ניתן לרשום נכס בטאבו.',
    relatedConcepts: ['inh-will', 'inh-inheritance'], lastUpdated: new Date()
  },
  {
    id: 'inh-disqualified', category: 'דיני ירושה', icon: '📜',
    name: 'פסול לרשת',
    shortDescription: 'מי שגרם בכוונה למות המוריש — נפסל מלרשת',
    fullDescription: 'אדם שנפסל על פי חוק מלרשת את המוריש — למשל מי שגרם בכוונה למות המוריש או שפגע בחייו.',
    example: 'הרשעה בגרימת מוות בכוונה, התנכלות חמורה למוריש',
    difficulty: 'hard', importance: 'important',
    legalSources: ['סעיף 6 לחוק הירושה'],
    studyHighlight: 'נפוץ במבחנים: מתי נפסל יורש גם ללא הרשעה פלילית? קיימת פסיקה בנושא.',
    relatedConcepts: ['inh-inheritance', 'inh-legal-heirs'], lastUpdated: new Date()
  },
  {
    id: 'inh-deathbed-gift', category: 'דיני ירושה', icon: '📜',
    name: 'מתנה בערב מיתה',
    shortDescription: 'מתנה בסכנת מוות קרובה — ניתנת להשבה לעיזבון אם לא התקיימו תנאים',
    fullDescription: 'מתנה שניתנה בחיי המוריש כשהוא בסכנת מוות קרובה — ניתנת להשבה לעיזבון אם לא נתקיימו תנאים מסוימים בחוק.',
    example: 'העברת חשבון בנק לילד ימים לפני הפטירה, מתנה לנכד בעת חולי סופני',
    difficulty: 'hard', importance: 'supplementary',
    legalSources: ['חוק הירושה — הוראות בדבר מתנות בערב מיתה והשבה לעיזבון'],
    studyHighlight: 'מבחן: האם המתנה ניתנה «בערב מיתה» ומה תקופת הזכות להשיבה — ישרו קו עם הנוסח בחוק.',
    relatedConcepts: ['inh-inheritance', 'inh-estate'], lastUpdated: new Date()
  },
  {
    id: 'inh-inheritance-debt', category: 'דיני ירושה', icon: '📜',
    name: 'חובות המוריש ואחריות היורש',
    shortDescription: 'יורשים אחראים לחובות רק עד שווי הנכסים שקיבלו — לא מעבר',
    fullDescription: 'היורשים אחראים לחובות המוריש רק עד גובה שווי הנכסים שקיבלו מהעיזבון — אין «אחריות אינסופית».',
    example: 'חובות בנק מול דירה בעיזבון, סירוב ירושה כדי לא לקבל חוב',
    difficulty: 'hard', importance: 'important',
    legalSources: ['חוק הירושה; חוק כינוס נכסים'],
    studyHighlight: 'בפרקטיקה: סירוב ירושה בתוך המועד החוקי משחרר מחובות — חשוב לבדוק מועדים ונוהל בפני רשם הירושה.',
    relatedConcepts: ['inh-estate', 'inh-inheritance'], lastUpdated: new Date()
  },

  // ─── דיני צרכנות ────────────────────────────────────────────
  {
    id: 'con-consumer', category: 'דיני צרכנות', icon: '🛍️',
    name: 'צרכן ועסקה צרכנית',
    shortDescription: 'אדם הנהנה ממוצר/שירות לצרכים אישיים — כפוף לחוק הגנת הצרכן',
    fullDescription: 'צרכן הוא אדם הנהנה ממוצר או שירות לצרכים אישיים–משפחתיים; עסקה צרכנית כפופה לחוק הגנת הצרכן ולתקנות.',
    example: 'רכישת מוצר מחנות, חוזה שירות לבית, רכישה אונליין',
    difficulty: 'easy', importance: 'important',
    legalSources: ['חוק הגנת הצרכן, התשמ"א–1981'],
    studyHighlight: 'במבחנים: מתי צד הוא «צרכן», מתי חלה הגנת חוק הגנת הצרכן לעומת דיני חוזים, ומהן הזכויות לביטול.',
    relatedConcepts: ['ctr-contract', 'con-consumer-mislead'], lastUpdated: new Date()
  },
  {
    id: 'con-consumer-mislead', category: 'דיני צרכנות', icon: '🛍️',
    name: 'הטעיית צרכן',
    shortDescription: 'מסירת מידע כוזב/השמטת מידע מהותי שגורמים לעסקה שלא הייתה נעשית',
    fullDescription: 'מסירת מידע כוזב או השמטת מידע מהותי העלולים לגרום לצרכן לעשות עסקה שלא הייתה עושה אחרת.',
    example: 'פרסום מחיר מטעה, הסתרת תשלומים נלווים, הבטחת יכולות שלא קיימות',
    difficulty: 'medium', importance: 'important',
    legalSources: ['סעיף 2 לחוק הגנת הצרכן'],
    studyHighlight: 'מושג מקביל חלקית ל«טעות» בדיני חוזים — הבחינו בין הטעיה לעושק ובין הסעדים.',
    relatedConcepts: ['con-consumer', 'ctr-contract'], lastUpdated: new Date()
  },
];

const categories = [
  'הכל', 'חקיקה', 'תקדימים', 'מנהגים', 'פרשנויות', 'עקרונות', 'משפט בינלאומי', 'מקורות עזר',
  'מקורות המשפט', 'דיני חוזים', 'דיני עונשין', 'משפט חוקתי', 'משפט מינהלי',
  'דיני נזיקין', 'דיני קניין', 'דיני עבודה', 'דיני משפחה', 'דיני ירושה', 'דיני צרכנות',
];
const difficulties = ['הכל', 'קל', 'בינוני', 'קשה', 'קשה מאוד'];

const difficultyLabels = {
  'easy': 'קל',
  'medium': 'בינוני',
  'hard': 'קשה', 
  'very-hard': 'קשה מאוד'
};

const difficultyColors = {
  'easy': '#4caf50',
  'medium': '#ff9800',
  'hard': '#f44336',
  'very-hard': '#9c27b0'
};

export const LegalConceptsTable: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('הכל');
  const [selectedDifficulty, setSelectedDifficulty] = useState('הכל');
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [selectedConcept, setSelectedConcept] = useState<LegalConcept | null>(null);
  const [bookmarked, setBookmarked] = useState<Set<string>>(new Set());

  const filteredConcepts = useMemo(() => {
    return legalConcepts.filter(concept => {
      const matchesSearch = concept.name.includes(searchTerm) || 
                           concept.shortDescription.includes(searchTerm) ||
                           concept.category.includes(searchTerm);
      const matchesCategory = selectedCategory === 'הכל' || concept.category === selectedCategory;
      const matchesDifficulty = selectedDifficulty === 'הכל' || 
                               difficultyLabels[concept.difficulty] === selectedDifficulty;
      
      return matchesSearch && matchesCategory && matchesDifficulty;
    });
  }, [searchTerm, selectedCategory, selectedDifficulty]);

  const toggleRow = (conceptId: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(conceptId)) {
      newExpanded.delete(conceptId);
    } else {
      newExpanded.add(conceptId);
    }
    setExpandedRows(newExpanded);
  };

  const toggleBookmark = (conceptId: string) => {
    const newBookmarked = new Set(bookmarked);
    if (newBookmarked.has(conceptId)) {
      newBookmarked.delete(conceptId);
    } else {
      newBookmarked.add(conceptId);
    }
    setBookmarked(newBookmarked);
  };

  const openConceptDialog = (concept: LegalConcept) => {
    setSelectedConcept(concept);
  };

  const closeConceptDialog = () => {
    setSelectedConcept(null);
  };

  return (
    <Box sx={{ maxWidth: 1400, margin: 'auto', p: 2 }}>
      {/* כותרת */}
      <Card sx={{ mb: 3, background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)', color: 'white' }}>
        <CardHeader
          title={
            <Typography variant="h4" sx={{ fontWeight: 'bold', textAlign: 'center' }}>
              📊 מילון מושגים משפטי — כל תחומי המשפט
            </Typography>
          }
          subheader={
            <Typography variant="subtitle1" sx={{ textAlign: 'center', opacity: 0.9 }}>
              מאגר ידע אינטראקטיבי עם דוגמאות, מקורות חוקיים, דגשי לימוד והסברים מפורטים
            </Typography>
          }
        />
      </Card>

      {/* פילטרים וחיפוש */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="חיפוש מושג"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
                }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>קטגוריה</InputLabel>
                <Select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  {categories.map(category => (
                    <MenuItem key={category} value={category}>{category}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>רמת קושי</InputLabel>
                <Select
                  value={selectedDifficulty}
                  onChange={(e) => setSelectedDifficulty(e.target.value)}
                >
                  {difficulties.map(difficulty => (
                    <MenuItem key={difficulty} value={difficulty}>{difficulty}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
          
          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              נמצאו {filteredConcepts.length} מושגים • 
              {bookmarked.size > 0 && ` ${bookmarked.size} מושגים בסימניות`}
            </Typography>
          </Box>
        </CardContent>
      </Card>

      {/* טבלת מושגים */}
      <Card>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                <TableCell>קטגוריה</TableCell>
                <TableCell>מושג</TableCell>
                <TableCell>הסבר קצר</TableCell>
                <TableCell>דוגמא / פסיקה</TableCell>
                <TableCell>רמת קושי</TableCell>
                <TableCell>פעולות</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredConcepts.map((concept) => (
                <React.Fragment key={concept.id}>
                  <TableRow 
                    sx={{ 
                      '&:hover': { backgroundColor: '#f8f9fa' },
                      cursor: 'pointer'
                    }}
                  >
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={1}>
                        <Box component="span" sx={{ fontSize: '1.2rem' }}>{concept.icon}</Box>
                        <Typography variant="body2" fontWeight="medium">
                          {concept.category}
                        </Typography>
                      </Box>
                    </TableCell>
                    
                    <TableCell>
                      <Typography variant="subtitle1" fontWeight="bold">
                        {concept.name}
                      </Typography>
                    </TableCell>
                    
                    <TableCell>
                      <Typography variant="body2" sx={{ maxWidth: 300 }}>
                        {concept.shortDescription}
                      </Typography>
                    </TableCell>
                    
                    <TableCell>
                      <Typography variant="body2" sx={{ 
                        maxWidth: 200,
                        fontStyle: 'italic',
                        color: 'text.secondary'
                      }}>
                        {concept.example}
                      </Typography>
                    </TableCell>
                    
                    <TableCell>
                      <Chip 
                        label={difficultyLabels[concept.difficulty]}
                        size="small"
                        sx={{
                          backgroundColor: difficultyColors[concept.difficulty],
                          color: 'white',
                          fontWeight: 'bold'
                        }}
                      />
                    </TableCell>
                    
                    <TableCell>
                      <Box display="flex" gap={1}>
                        <IconButton
                          size="small"
                          onClick={() => toggleRow(concept.id)}
                          color={expandedRows.has(concept.id) ? 'primary' : 'default'}
                        >
                          <ExpandIcon 
                            sx={{
                              transform: expandedRows.has(concept.id) ? 'rotate(180deg)' : 'rotate(0deg)',
                              transition: 'transform 0.3s'
                            }}
                          />
                        </IconButton>
                        
                        <IconButton
                          size="small"
                          onClick={() => openConceptDialog(concept)}
                          color="info"
                        >
                          <InfoIcon />
                        </IconButton>
                        
                        <IconButton
                          size="small"
                          onClick={() => toggleBookmark(concept.id)}
                          color={bookmarked.has(concept.id) ? 'warning' : 'default'}
                        >
                          {bookmarked.has(concept.id) ? <BookmarkedIcon /> : <BookmarkIcon />}
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                  
                  {/* שורה מורחבת */}
                  <TableRow>
                    <TableCell colSpan={6} sx={{ p: 0 }}>
                      <Collapse in={expandedRows.has(concept.id)} timeout="auto" unmountOnExit>
                        <Box sx={{ p: 3, backgroundColor: '#fafafa' }}>
                          <Grid container spacing={3}>
                            <Grid item xs={12} md={6}>
                              <Typography variant="h6" gutterBottom color="primary">
                                📚 הסבר מפורט
                              </Typography>
                              <Typography variant="body2" paragraph>
                                {concept.fullDescription}
                              </Typography>
                              
                              {concept.studyHighlight && (
                                <Alert severity="warning" sx={{ mt: 2 }}>
                                  <Typography variant="body2">
                                    <strong>💡 דגש ללימוד:</strong> {concept.studyHighlight}
                                  </Typography>
                                </Alert>
                              )}

                              {concept.practicalNotes && !concept.studyHighlight && (
                                <Alert severity="info" sx={{ mt: 2 }}>
                                  <Typography variant="body2">
                                    <strong>הערה מעשית:</strong> {concept.practicalNotes}
                                  </Typography>
                                </Alert>
                              )}
                            </Grid>
                            
                            <Grid item xs={12} md={6}>
                              {(concept.precedent || (concept.legalSources && concept.legalSources.length > 0)) && (
                                <Box mb={2}>
                                  <Typography variant="h6" gutterBottom color="primary">
                                    ⚖️ מקורות משפטיים
                                  </Typography>
                                  <Paper elevation={1} sx={{ p: 2, backgroundColor: 'white' }}>
                                    {concept.legalSources?.map((src, i) => (
                                      <Typography key={i} variant="body2" sx={{ mb: 0.5 }}>• {src}</Typography>
                                    ))}
                                    {concept.precedent && !concept.legalSources?.length && (
                                      <Typography variant="body2">{concept.precedent}</Typography>
                                    )}
                                  </Paper>
                                </Box>
                              )}
                              
                              {concept.relatedConcepts.length > 0 && (
                                <>
                                  <Typography variant="h6" gutterBottom color="primary">
                                    🔗 מושגים קשורים
                                  </Typography>
                                  <Box display="flex" gap={1} flexWrap="wrap">
                                    {concept.relatedConcepts.map((relatedId, index) => {
                                      const relatedConcept = legalConcepts.find(c => c.id === relatedId);
                                      return relatedConcept ? (
                                        <Chip 
                                          key={index}
                                          label={relatedConcept.name}
                                          size="small"
                                          variant="outlined"
                                          onClick={() => openConceptDialog(relatedConcept)}
                                          sx={{ cursor: 'pointer' }}
                                        />
                                      ) : (
                                        <Chip key={index} label={relatedId} size="small" variant="outlined" />
                                      );
                                    })}
                                  </Box>
                                </>
                              )}
                            </Grid>
                          </Grid>
                        </Box>
                      </Collapse>
                    </TableCell>
                  </TableRow>
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      {/* דיאלוג מושג מפורט */}
      <Dialog 
        open={!!selectedConcept} 
        onClose={closeConceptDialog}
        maxWidth="md"
        fullWidth
      >
        {selectedConcept && (
          <>
            <DialogTitle>
              <Box display="flex" justifyContent="between" alignItems="center">
                <Box display="flex" alignItems="center" gap={2}>
                  <Box component="span" sx={{ fontSize: '2rem' }}>{selectedConcept.icon}</Box>
                  <Box>
                    <Typography variant="h5">{selectedConcept.name}</Typography>
                    <Typography variant="subtitle2" color="text.secondary">
                      {selectedConcept.category}
                    </Typography>
                  </Box>
                </Box>
                <IconButton onClick={closeConceptDialog}>
                  <CloseIcon />
                </IconButton>
              </Box>
            </DialogTitle>
            
            <DialogContent>
              <Box mb={3}>
                <Box display="flex" gap={1} mb={2}>
                  <Chip 
                    label={difficultyLabels[selectedConcept.difficulty]}
                    sx={{
                      backgroundColor: difficultyColors[selectedConcept.difficulty],
                      color: 'white'
                    }}
                  />
                  <Chip 
                    label={selectedConcept.importance === 'critical' ? 'קריטי' :
                          selectedConcept.importance === 'important' ? 'חשוב' : 'משלים'}
                    color={selectedConcept.importance === 'critical' ? 'error' :
                           selectedConcept.importance === 'important' ? 'warning' : 'info'}
                  />
                </Box>
                
                <Typography variant="body1" paragraph>
                  {selectedConcept.fullDescription}
                </Typography>
              </Box>

              <Accordion>
                <AccordionSummary expandIcon={<ExpandIcon />}>
                  <Typography variant="h6">📋 דוגמאות מעשיות</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography variant="body2">
                    {selectedConcept.example}
                  </Typography>
                </AccordionDetails>
              </Accordion>

              {(selectedConcept.legalSources?.length || selectedConcept.precedent) && (
                <Accordion>
                  <AccordionSummary expandIcon={<ExpandIcon />}>
                    <Typography variant="h6">⚖️ מקורות משפטיים</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    {selectedConcept.legalSources?.map((src, i) => (
                      <Typography key={i} variant="body2" sx={{ mb: 0.5 }}>• {src}</Typography>
                    ))}
                    {selectedConcept.precedent && !selectedConcept.legalSources?.length && (
                      <Typography variant="body2">{selectedConcept.precedent}</Typography>
                    )}
                  </AccordionDetails>
                </Accordion>
              )}

              {selectedConcept.studyHighlight && (
                <Alert severity="warning" sx={{ mt: 2 }}>
                  <Typography variant="body2">
                    <strong>💡 דגש ללימוד:</strong> {selectedConcept.studyHighlight}
                  </Typography>
                </Alert>
              )}

              {selectedConcept.practicalNotes && !selectedConcept.studyHighlight && (
                <Alert severity="info" sx={{ mt: 2 }}>
                  <Typography variant="body2">
                    <strong>הערה מעשית:</strong> {selectedConcept.practicalNotes}
                  </Typography>
                </Alert>
              )}
            </DialogContent>
            
            <DialogActions>
              <Button onClick={() => toggleBookmark(selectedConcept.id)}>
                {bookmarked.has(selectedConcept.id) ? 'הסר מסימניות' : 'הוסף לסימניות'}
              </Button>
              <Button onClick={closeConceptDialog} variant="contained">
                סגור
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
};

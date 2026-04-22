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

  // תקדימים - מושגים נוספים
  {
    id: 'ratio-decidendi',
    category: 'תקדימים',
    name: 'ריישיו דצידנדי (Ratio Decidendi)',
    shortDescription: 'הנימוק המשפטי המחייב שנקבע בפסק דין',
    fullDescription: 'ה-Ratio Decidendi הוא הנימוק המשפטי המהותי שעליו מבוסס פסק הדין והמחייב כתקדים. להבדיל מה-Obiter Dictum, ה-Ratio הוא חלק הפסיקה שמחייב ערכאות נמוכות. חשוב לזהות מהו ה-Ratio כדי להבין את היקף התקדים.',
    example: 'בפרשת קול העם - הנימוק לפיו חופש הביטוי גובר על שיקולי ביטחון ציבורי מינוריים הוא ה-Ratio',
    precedent: 'ע"א 10/69 קול העם נגד שר הפנים',
    difficulty: 'hard',
    icon: '⚖️📝',
    relatedConcepts: ['binding-precedent', 'obiter-dictum', 'stare-decisis'],
    practicalNotes: 'יש להבחין בין ה-Ratio (מחייב) לבין הנימוקים הנלווים (מנחים בלבד)',
    importance: 'critical',
    lastUpdated: new Date()
  },
  {
    id: 'obiter-dictum',
    category: 'תקדימים',
    name: 'אובטר דיקטום (Obiter Dictum)',
    shortDescription: 'אמרה אגבית בפסק דין שאינה מחייבת אך יכולה להנחות',
    fullDescription: 'ה-Obiter Dictum הוא אמרה אגבית של שופט בפסק דין, שאינה נחוצה לפסיקה ולכן אינה מחייבת כתקדים. עם זאת, אמרות כאלה של בית המשפט העליון נחשבות למנחות מאוד ומשפיעות על פסיקות עתידיות.',
    example: 'הערות שופטי עליון על שאלות משפטיות שלא היו לב ליבו של הדיון',
    difficulty: 'hard',
    icon: '⚖️💬',
    relatedConcepts: ['ratio-decidendi', 'binding-precedent'],
    practicalNotes: 'אמרות אגב של בית המשפט העליון הן בעלות משקל מנחה משמעותי בפרקטיקה',
    importance: 'important',
    lastUpdated: new Date()
  },
  {
    id: 'persuasive-precedent',
    category: 'תקדימים',
    name: 'תקדים מנחה',
    shortDescription: 'פסיקה שאינה מחייבת אך בעלת משקל פרשני',
    fullDescription: 'תקדים מנחה הוא פסיקה שאינה מחייבת פורמלית אך בית המשפט עשוי להתחשב בה. כולל פסיקות ממדינות מערביות (ארה"ב, בריטניה, קנדה), פסיקות של ערכאות מקבילות ופסיקות ישנות יותר.',
    example: 'פסיקות בית הלורדים הבריטי כמנחות לדיני חוזים, פסיקות בית המשפט הגבוה האמריקאי',
    difficulty: 'medium',
    icon: '⚖️🌍',
    relatedConcepts: ['binding-precedent', 'comparative-law'],
    practicalNotes: 'כוחו של תקדים מנחה תלוי בסמכות הגוף שהוציאו ובהיגיון שבו',
    importance: 'supplementary',
    lastUpdated: new Date()
  },
  {
    id: 'stare-decisis',
    category: 'תקדימים',
    name: 'עקרון סטרה דציסיס',
    shortDescription: 'חובת ערכאות נמוכות לפסוק לפי תקדים ערכאה עליונה',
    fullDescription: 'עקרון Stare Decisis ("עמוד על שנפסק") מחייב ערכאות נמוכות לפסוק בהתאם לתקדים שנקבע בערכאות גבוהות. מטרתו לשמור על יציבות, ודאות ועקביות בפסיקה. בישראל, בית המשפט העליון מחויב לפסיקותיו הוא, אך יכול לסטות מהן בהחלטה מנומקת.',
    example: 'בית משפט שלום חייב ללכת לפי פסיקת מחוזי ועליון; מחוזי חייב ללכת לפי עליון',
    precedent: 'ע"א 3622/96 חכם אבו-חצירה - עקרון התקדים המחייב',
    difficulty: 'medium',
    icon: '⚖️🏛️',
    relatedConcepts: ['binding-precedent', 'deviation-precedent', 'judicial-hierarchy'],
    practicalNotes: 'בית המשפט העליון יושב בהרכב מורחב (9-11 שופטים) כדי לסטות מתקדים קודם',
    importance: 'critical',
    lastUpdated: new Date()
  },

  // חקיקה - מושגים נוספים
  {
    id: 'bylaws',
    category: 'חקיקה',
    name: 'חוק עזר',
    shortDescription: 'חקיקה של רשויות מקומיות בתחום סמכותן',
    fullDescription: 'חוק עזר הוא חקיקה שמוציאה רשות מקומית (עירייה, מועצה מקומית) בתחום סמכותה הגאוגרפית והעניינית. חוק עזר כפוף לחקיקה ראשית ולחקיקת משנה, ותוקפו מוגבל לתחום שיפוטה של הרשות.',
    example: 'חוק עזר לתל-אביב בנושא רעש, חוק עזר לירושלים בנושא שלטים',
    difficulty: 'easy',
    icon: '🏛️📜',
    relatedConcepts: ['primary-legislation', 'secondary-legislation', 'local-government'],
    practicalNotes: 'חוק עזר צריך אישור שר הפנים ואינו יכול לסתור חקיקה ראשית',
    importance: 'important',
    lastUpdated: new Date()
  },
  {
    id: 'emergency-regulations',
    category: 'חקיקה',
    name: 'תקנות שעת חירום',
    shortDescription: 'תקנות שמותקנות בזמן חירום ויכולות לגבור על חוקים רגילים',
    fullDescription: 'תקנות שעת חירום הן תקנות שמוציאה הממשלה בזמן חירום לאומי. בניגוד לחקיקת משנה רגילה, תקנות אלה יכולות לגבור על חוקים רגילים (לא על חוקי יסוד). הן כפופות לאישור ועדת חוץ וביטחון של הכנסת.',
    example: 'תקנות חירום בזמן מלחמה, תקנות חירום הקשורות למגפת הקורונה',
    precedent: 'בג"ץ 3091/99 רוס נגד שר הביטחון - ביקורת שיפוטית על תקנות חירום',
    difficulty: 'hard',
    icon: '🚨📜',
    relatedConcepts: ['secondary-legislation', 'separation-powers'],
    practicalNotes: 'תקנות חירום פגות תוקפן לאחר 3 חודשים אלא אם כן מוארכות',
    importance: 'important',
    lastUpdated: new Date()
  },

  // עקרונות - מושגים נוספים
  {
    id: 'separation-powers',
    category: 'עקרונות',
    name: 'הפרדת רשויות',
    shortDescription: 'חלוקת הסמכות בין הרשות המחוקקת, המבצעת והשופטת',
    fullDescription: 'עקרון הפרדת הרשויות קובע שהשלטון מחולק לשלוש רשויות נפרדות: מחוקקת (הכנסת), מבצעת (הממשלה) ושופטת (בתי המשפט). כל רשות מבקרת ומאזנת את הרשויות האחרות. בישראל ההפרדה אינה מוחלטת - הממשלה נשענת על רוב כנסת.',
    example: 'בית המשפט מבקר את הממשלה; הכנסת מפקחת על הממשלה; הממשלה מבצעת חוקי הכנסת',
    precedent: 'בג"ץ 3267/97 רובינשטיין נגד שר הביטחון - הפרדת רשויות',
    difficulty: 'medium',
    icon: '🏛️⚖️',
    relatedConcepts: ['rule-of-law', 'judicial-review', 'constitutional-supremacy'],
    practicalNotes: 'ועדת בחירת שופטים היא דוגמה לשיתוף פעולה בין הרשויות',
    importance: 'critical',
    lastUpdated: new Date()
  },
  {
    id: 'proportionality',
    category: 'עקרונות',
    name: 'מידתיות',
    shortDescription: 'פגיעה בזכות יסוד לא תעלה על הנדרש להשגת התכלית',
    fullDescription: 'עקרון המידתיות קובע שפגיעה בזכות יסוד חייבת לעמוד בשלושה מבחנים: (1) קשר רציונלי - הפגיעה קשורה לתכלית; (2) אמצעי שפגיעתו פחותה - אין אמצעי חלופי פחות פוגעני; (3) מידתיות במובן הצר - יחס נכון בין הפגיעה לתועלת.',
    example: 'הגבלת חופש התנועה בזמן מגיפה - האם מידתית?',
    precedent: 'בג"ץ 2056/04 מועצת הכפר בית סוריק נגד ממשלת ישראל - מבחן המידתיות',
    difficulty: 'very-hard',
    icon: '⚖️📏',
    relatedConcepts: ['constitutional-supremacy', 'human-rights', 'balancing-test'],
    practicalNotes: 'מבחן המידתיות חל על כל פגיעה בזכויות חוקתיות - שלושת שלביו חייבים להתקיים',
    importance: 'critical',
    lastUpdated: new Date()
  },
  {
    id: 'equality',
    category: 'עקרונות',
    name: 'שוויון בפני החוק',
    shortDescription: 'כל אדם שווה בפני החוק ללא אפליה',
    fullDescription: 'עקרון השוויון קובע שכל אדם שווה בפני החוק ולא ייפגע בשל גזע, דת, מין, לאום או השקפה. בישראל השוויון מעוגן גם בחוק שוויון הזדמנויות בעבודה, חוק שוויון זכויות לאנשים עם מוגבלות ובפסיקה ענפה.',
    example: 'הכרזת העצמאות מעגנת שוויון; פסיקה נגד אפליה בקבלה לעבודה',
    precedent: 'בג"ץ 6698/95 קעדאן נגד מינהל מקרקעי ישראל - שוויון בהקצאת מגורים',
    difficulty: 'medium',
    icon: '⚖️🤝',
    relatedConcepts: ['human-rights', 'constitutional-supremacy', 'rule-of-law'],
    practicalNotes: 'אפליה מחמת שיקולים זרים בהחלטות מנהליות - עילה לביטול ההחלטה',
    importance: 'critical',
    lastUpdated: new Date()
  },
  {
    id: 'right-to-be-heard',
    category: 'עקרונות',
    name: 'זכות הטיעון',
    shortDescription: 'זכות לשמוע ולהישמע לפני קבלת החלטה מנהלית',
    fullDescription: 'זכות הטיעון היא עיקרון יסוד במשפט המנהלי הקובע שמי שצפוי להיפגע מהחלטה מנהלית זכאי להשמיע טענותיו לפני שהיא מתקבלת. הפרת זכות הטיעון עשויה לגרום לבטלות ההחלטה.',
    example: 'פיטורי עובד בלי לשמוע אותו; ביטול רישיון עסק בלי הודעה מוקדמת',
    precedent: 'בג"ץ 3/58 ברמן נגד שר הפנים - עיקרון השימוע',
    difficulty: 'medium',
    icon: '🎤⚖️',
    relatedConcepts: ['rule-of-law', 'administrative-law', 'natural-justice'],
    practicalNotes: 'זכות הטיעון כוללת גם זכות לעיין בחומר הרלוונטי לפני ההחלטה',
    importance: 'critical',
    lastUpdated: new Date()
  },
  {
    id: 'reasonableness',
    category: 'עקרונות',
    name: 'סבירות המנהל',
    shortDescription: 'החלטה מנהלית חייבת להיות סבירה ומאוזנת',
    fullDescription: 'עיקרון הסבירות קובע שהחלטות מנהליות חייבות להיות סבירות - לא קיצוניות, לא שרירותיות ולא לוקות בחוסר שיקול דעת. בג"ץ ביטל החלטות מנהליות שסטו מרמת הסבירות באופן קיצוני. בתיקון לחוק יסוד: השפיטה (2023) הוגבלה עילת הסבירות.',
    example: 'מינוי פסול של נושא משרה; החלטה שאינה מביאה בחשבון שיקולים רלוונטיים',
    precedent: 'בג"ץ 389/80 דפי זהב נגד רשות השידור - עקרון הסבירות',
    difficulty: 'hard',
    icon: '⚖️🧠',
    relatedConcepts: ['rule-of-law', 'judicial-review', 'proportionality'],
    practicalNotes: 'תיקון 2023 לחוק יסוד: השפיטה ביקש להגביל את שימוש בגץ בעילת הסבירות',
    importance: 'critical',
    lastUpdated: new Date()
  },

  // פרשנויות - מושגים נוספים
  {
    id: 'historical-interpretation',
    category: 'פרשנויות',
    name: 'פרשנות היסטורית',
    shortDescription: 'פירוש לפי כוונת המחוקק המקורית בעת חקיקת החוק',
    fullDescription: 'פרשנות היסטורית שואלת מה הייתה כוונת המחוקק בעת חקיקת החוק. מסתמכת על דברי הכנסת, דיוני ועדות, הצעות חוק ומסמכים היסטוריים. שיטה שמרנית יותר מהפרשנות התכליתית.',
    example: 'בחינת פרוטוקולי ועדת חוקה חוק ומשפט לפרשנות חוק יסוד',
    difficulty: 'medium',
    icon: '📚🕰️',
    relatedConcepts: ['purposive-interpretation', 'literal-interpretation'],
    practicalNotes: 'דברי הכנסת הם מקור פרשני אך לא המכריע - בית המשפט ייתן להם משקל יחסי',
    importance: 'important',
    lastUpdated: new Date()
  },
  {
    id: 'contra-proferentem',
    category: 'פרשנויות',
    name: 'פרשנות נגד המנסח',
    shortDescription: 'ספק בחוזה יפורש לרעת הצד שניסח אותו',
    fullDescription: 'כלל הפרשנות נגד המנסח (Contra Proferentem) קובע שכאשר יש ספק בנוסח חוזה או מסמך משפטי, יש לפרש אותו לרעת הצד שניסח אותו. כלל זה נפוץ בחוזי ביטוח, חוזי אחידות ועסקאות בין גוף חזק לצרכן.',
    example: 'חברת ביטוח שניסחה פוליסה עמומה - יפורש לטובת המבוטח',
    precedent: 'ע"א 5048/10 שגיא נגד כלל חברה לביטוח - פרשנות נגד מנסח',
    difficulty: 'medium',
    icon: '📝⚖️',
    relatedConcepts: ['contract-law', 'consumer-protection', 'standard-contracts'],
    practicalNotes: 'חל במיוחד בחוזים אחידים שבהם כוח המיקוח אינו שווה',
    importance: 'important',
    lastUpdated: new Date()
  },
  {
    id: 'systematic-interpretation',
    category: 'פרשנויות',
    name: 'פרשנות שיטתית',
    shortDescription: 'פרשנות הוראה משפטית לאור המסגרת הנורמטיבית הכוללת',
    fullDescription: 'פרשנות שיטתית רואה את ההוראה המשפטית כחלק ממערכת כוללת של נורמות. היא מפרשת כל הוראה תוך התחשבות בחוקים קשורים, עקרונות כלליים ומטרות כלל המערכת המשפטית.',
    example: 'פרשנות סעיף בחוק עבודה תוך התחשבות בחוק יסוד: כבוד האדם',
    difficulty: 'hard',
    icon: '🔍🔗',
    relatedConcepts: ['purposive-interpretation', 'constitutional-supremacy'],
    practicalNotes: 'ההוראה הפרטית נפרשת תמיד בהקשר למכלול השיטה המשפטית',
    importance: 'important',
    lastUpdated: new Date()
  },

  // משפט בינלאומי
  {
    id: 'international-treaties',
    category: 'משפט בינלאומי',
    name: 'אמנות בינלאומיות',
    shortDescription: 'הסכמים בין מדינות המחייבים ביחסים הבינלאומיים',
    fullDescription: 'אמנות בינלאומיות הן הסכמים פורמליים בין מדינות שיוצרים חיוב על פי המשפט הבינלאומי. בישראל, אמנה בינלאומית אינה הופכת לחלק מהמשפט הפנימי אלא לאחר שתוכנה עוגן בחקיקה ישראלית (שיטת ה-Transformation).',
    example: 'אמנת האו"ם לזכויות הילד, אמנת ג\'נבה, הסכמי שלום עם ירדן ומצרים',
    difficulty: 'medium',
    icon: '🌍📜',
    relatedConcepts: ['customary-international-law', 'incorporation-doctrine'],
    practicalNotes: 'בית המשפט הישראלי מפרש חקיקה פנימית בהתאם לאמנות שישראל חתומה עליהן',
    importance: 'important',
    lastUpdated: new Date()
  },
  {
    id: 'customary-international-law',
    category: 'משפט בינלאומי',
    name: 'משפט בינלאומי מנהגי',
    shortDescription: 'נורמות בינלאומיות מחייבות שנוצרו מנוהג מדינות',
    fullDescription: 'המשפט הבינלאומי המנהגי נוצר מנוהג מדינות שחוזר על עצמו תוך אמונה שהוא מחייב (opinio juris). בניגוד לאמנות, הוא חל על כל המדינות ולא רק על אלה שחתמו על הסכמים. בישראל הוא חלק מהמשפט הפנימי ישירות.',
    example: 'איסור עינויים, כללי לחימה, חסינות דיפלומטית',
    difficulty: 'hard',
    icon: '🌍⚖️',
    relatedConcepts: ['international-treaties', 'jus-cogens'],
    practicalNotes: 'המשפט הבינלאומי המנהגי חל בישראל ישירות ללא צורך בחקיקה פנימית',
    importance: 'important',
    lastUpdated: new Date()
  },
  {
    id: 'jus-cogens',
    category: 'משפט בינלאומי',
    name: 'נורמות ג\'וס קוגנס (Jus Cogens)',
    shortDescription: 'נורמות בינלאומיות עליונות שאין להתנות עליהן',
    fullDescription: 'Jus Cogens ("משפט מחייב") הן נורמות בינלאומיות עליונות שאין להן כל חריג ואין מדינה יכולה להתנות עליהן. הן מייצגות את ערכי הליבה של הקהילה הבינלאומית. אמנה הנוגדת נורמת Jus Cogens בטלה לחלוטין.',
    example: 'איסור רצח עם, איסור עבדות, איסור עינויים, עקרון אי-החזרה (Non-refoulement)',
    difficulty: 'very-hard',
    icon: '🌍🚫',
    relatedConcepts: ['customary-international-law', 'human-rights'],
    practicalNotes: 'ישראל מחויבת לנורמות Jus Cogens ללא תלות בחתימה על אמנות',
    importance: 'important',
    lastUpdated: new Date()
  },
  {
    id: 'transformation-doctrine',
    category: 'משפט בינלאומי',
    name: 'דוקטרינת ה-Transformation',
    shortDescription: 'אמנה בינלאומית חלה פנימית רק לאחר עיגון בחקיקה',
    fullDescription: 'ישראל אימצה את שיטת ה-Transformation הבריטית: אמנה בינלאומית שישראל חתמה עליה אינה הופכת לחלק מהמשפט הפנימי באופן אוטומטי, אלא רק לאחר שתוכנה עוגן בחקיקה ישראלית. עם זאת, בית המשפט ישתמש באמנות כפרשניות לחקיקה הפנימית.',
    example: 'אמנת האו"ם לזכויות ילד הוכנסה לחקיקה דרך חוק הנוער',
    precedent: 'בג"ץ 253/88 סג\'דייה נגד שר הביטחון - מעמד אמנות בינלאומיות',
    difficulty: 'very-hard',
    icon: '🌍➡️📜',
    relatedConcepts: ['international-treaties', 'purposive-interpretation'],
    practicalNotes: 'ניגוד בין חוק פנימי לאמנה - החוק הפנימי גובר, אך יש לפרש אותו בהתאם לאמנה',
    importance: 'important',
    lastUpdated: new Date()
  },

  // מקורות עזר
  {
    id: 'legal-literature',
    category: 'מקורות עזר',
    name: 'ספרות משפטית ואקדמאית',
    shortDescription: 'ספרים, מאמרים ומחקרים משפטיים המסייעים בפרשנות',
    fullDescription: 'ספרות משפטית כוללת ספרי משפט, מאמרים אקדמיים, פרשנויות לחוקים ועבודות משפטיות. היא מהווה מקור עזר (לא מחייב) לבתי המשפט ולפרקטיקאים. כתביהם של פרופסורים בולטים כמו אהרן ברק ומנחם מאוטנר משפיעים על הפסיקה.',
    example: 'ספר "פרשנות במשפט" של אהרן ברק, "הזכות לפרטיות" של שנוב',
    difficulty: 'easy',
    icon: '📚✍️',
    relatedConcepts: ['purposive-interpretation', 'comparative-law'],
    practicalNotes: 'ספרות משפטית אינה מחייבת אך עשויה להשפיע מאוד על עמדת בית המשפט',
    importance: 'supplementary',
    lastUpdated: new Date()
  },
  {
    id: 'comparative-law',
    category: 'מקורות עזר',
    name: 'משפט השוואתי',
    shortDescription: 'למידה מהתנסות משפטית של מדינות אחרות',
    fullDescription: 'המשפט ההשוואתי בוחן פתרונות משפטיים במדינות שונות לבעיות דומות. בתי המשפט הישראליים נוהגים להשוות לשיטות המשפט האמריקאית, הבריטית, הגרמנית וה-ECHR. ההשוואה מנחה אך לא מחייבת.',
    example: 'בחינת פסיקת בית המשפט העליון של ארה"ב בנושא חופש הביטוי',
    difficulty: 'medium',
    icon: '🌍🔍',
    relatedConcepts: ['persuasive-precedent', 'legal-literature'],
    practicalNotes: 'ישראל משוות בעיקר למשפט האמריקאי, הבריטי, הגרמני ולאמנת זכויות האדם האירופית',
    importance: 'supplementary',
    lastUpdated: new Date()
  },
  {
    id: 'jewish-law',
    category: 'מקורות עזר',
    name: 'מורשת ישראל (משפט עברי)',
    shortDescription: 'עקרונות ממקורות ההלכה היהודית כמקור פרשני',
    fullDescription: 'לפי חוק יסודות המשפט (1980), כאשר יש לאקונה (חסר) בחוק ולא ניתן למלאה מתוך חקיקה, פסיקה או היקש, יפנה בית המשפט למורשת ישראל. מדובר בעקרונות מהמשפט העברי (הלכה, תלמוד) ולא בחיוב לפסוק לפיהם.',
    example: 'השפעת עיקרון "דינא דמלכותא דינא" על דיני חוזים; מושג "לפנים משורת הדין"',
    precedent: 'חוק יסודות המשפט, תש"ם-1980',
    difficulty: 'hard',
    icon: '✡️⚖️',
    relatedConcepts: ['purposive-interpretation', 'legal-lacuna'],
    practicalNotes: 'מורשת ישראל היא מקור עזר פרשני בלבד - לא מקור מחייב',
    importance: 'supplementary',
    lastUpdated: new Date()
  },
  {
    id: 'legal-lacuna',
    category: 'מקורות עזר',
    name: 'לאקונה (חסר בחוק)',
    shortDescription: 'פער בחקיקה שבית המשפט נדרש למלא',
    fullDescription: 'לאקונה היא מצב שבו החוק אינו מסדיר עניין מסוים. בית המשפט נדרש למלא את הפער באמצעות: (1) היקש מחוקים קרובים; (2) עקרונות כלליים של המשפט; (3) מורשת ישראל (לפי חוק יסודות המשפט). הדוקטרינה של מילוי חסרים חשובה מאוד לפיתוח המשפט.',
    example: 'לאקונה בדיני רשלנות מקצועית שמולאה בפסיקה דרך היקש מדיני נזיקין',
    difficulty: 'very-hard',
    icon: '🔍❓',
    relatedConcepts: ['jewish-law', 'purposive-interpretation', 'comparative-law'],
    practicalNotes: 'מילוי לאקונה הוא מלאכה פרשנית עדינה הדורשת זהירות',
    importance: 'important',
    lastUpdated: new Date()
  },
  {
    id: 'general-principles',
    category: 'מקורות עזר',
    name: 'עקרונות כלליים של המשפט',
    shortDescription: 'עקרונות על-חוקיים כמו תום לב, צדק וסבירות',
    fullDescription: 'עקרונות כלליים של המשפט הם ערכים ועקרונות שחלים על המערכת המשפטית כולה, גם ללא עיגון ספציפי בחקיקה. כוללים: תום לב, הגינות, צדק טבעי, איסור ניצול לרעה של זכויות, שמירת הבטחה ועוד.',
    example: 'עיקרון תום הלב בחוזה (סעיף 12 לחוק החוזים); עקרון צדק טבעי בהחלטות מנהליות',
    difficulty: 'medium',
    icon: '⚖️💡',
    relatedConcepts: ['legal-lacuna', 'purposive-interpretation', 'rule-of-law'],
    practicalNotes: 'בית המשפט יישם עקרונות כלליים גם כאשר החוק שותק',
    importance: 'important',
    lastUpdated: new Date()
  }
];

const categories = ['הכל', 'חקיקה', 'תקדימים', 'מנהגים', 'פרשנויות', 'עקרונות', 'משפט בינלאומי', 'מקורות עזר'];
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
              📊 טבלת מושגים - מקורות המשפט בישראל
            </Typography>
          }
          subheader={
            <Typography variant="subtitle1" sx={{ textAlign: 'center', opacity: 0.9 }}>
              מאגר ידע אינטראקטיבי עם דוגמאות, פסיקה והסברים מפורטים
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
                              
                              {concept.practicalNotes && (
                                <Alert severity="info" sx={{ mt: 2 }}>
                                  <Typography variant="body2">
                                    <strong>הערה מעשית:</strong> {concept.practicalNotes}
                                  </Typography>
                                </Alert>
                              )}
                            </Grid>
                            
                            <Grid item xs={12} md={6}>
                              {concept.precedent && (
                                <Box mb={2}>
                                  <Typography variant="h6" gutterBottom color="primary">
                                    ⚖️ פסיקה רלוונטית
                                  </Typography>
                                  <Paper elevation={1} sx={{ p: 2, backgroundColor: 'white' }}>
                                    <Typography variant="body2">
                                      {concept.precedent}
                                    </Typography>
                                  </Paper>
                                </Box>
                              )}
                              
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
                                  ) : null;
                                })}
                              </Box>
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

              {selectedConcept.precedent && (
                <Accordion>
                  <AccordionSummary expandIcon={<ExpandIcon />}>
                    <Typography variant="h6">⚖️ פסיקה רלוונטית</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography variant="body2">
                      {selectedConcept.precedent}
                    </Typography>
                  </AccordionDetails>
                </Accordion>
              )}

              {selectedConcept.practicalNotes && (
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

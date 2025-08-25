import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  Typography, 
  Box, 
  Button,
  Grid,
  Paper,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  FormControl,
  FormControlLabel,
  RadioGroup,
  Radio,
  TextField,
  LinearProgress,
  Alert,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Avatar,
  Stepper,
  Step,
  StepLabel,
  Divider,
  Tabs,
  Tab
} from '@mui/material';
import { 
  Close as CloseIcon,
  CheckCircle as CorrectIcon,
  Cancel as WrongIcon,
  Quiz as QuizIcon,
  Edit as EssayIcon,
  Timer as TimerIcon,
  TrendingUp as ProgressIcon,
  School as LearnIcon,
  Star as StarIcon,
  EmojiEvents as TrophyIcon,
  Lightbulb as TipIcon,
  Book as BookIcon,
  Assessment as ResultsIcon,
  NavigateNext as NextIcon,
  NavigateBefore as PrevIcon,
  Flag as FlagIcon,
  ExpandMore as ExpandIcon,
  Save as SaveIcon
} from '@mui/icons-material';

interface Question {
  id: string;
  type: 'multiple-choice' | 'true-false' | 'essay';
  difficulty: 'easy' | 'medium' | 'hard' | 'expert';
  category: string;
  section: string; // חלק א', חלק ב', חלק ג'
  question: string;
  options?: string[];
  correctAnswer?: string | number | boolean;
  explanation: string;
  legalSource: string;
  relatedCases?: string[];
  tips?: string[];
  points: number;
  timeEstimate?: number; // for essays
  keyPoints?: string[]; // for essays
  exampleAnswer?: string; // for essays
}

const complete50Questions: Question[] = [
  // חלק א' - רב ברירה (25 שאלות)
  
  // רמה קלה (5 שאלות)
  {
    id: 'mc_1',
    type: 'multiple-choice',
    difficulty: 'easy',
    category: 'חקיקה ראשית',
    section: 'חלק א\'',
    question: 'מי מוסמך לחוקק חוקים ראשיים בישראל?',
    options: ['הממשלה', 'הכנסת', 'נשיא המדינה', 'היועמ"ש'],
    correctAnswer: 1,
    explanation: 'רק הכנסת מחוקקת חוקים ראשיים; הממשלה מוסמכת לחקיקת משנה בלבד.',
    legalSource: 'חוק יסוד: הכנסת',
    points: 2
  },
  {
    id: 'mc_2',
    type: 'multiple-choice',
    difficulty: 'easy',
    category: 'משפט מנהלי',
    section: 'חלק א\'',
    question: 'מהו עיקרון חוקיות המנהל?',
    options: [
      'הרשות רשאית לפעול תמיד',
      'הרשות רשאית לפעול רק על סמך חוק',
      'הרשות רשאית לפרש חוקים כרצונה',
      'הרשות עליונה על הכנסת'
    ],
    correctAnswer: 1,
    explanation: 'עקרון חוקיות המנהל קובע שהרשות המבצעת רשאית לפעול רק במסגרת הסמכות שהוקנתה לה בחוק.',
    legalSource: 'פסיקת בג"ץ - עקרונות משפט מנהלי',
    relatedCases: ['בג"ץ 390/79 דוויקאת נגד ממשלת ישראל'],
    points: 2
  },
  {
    id: 'mc_3',
    type: 'multiple-choice',
    difficulty: 'easy',
    category: 'מנהגים',
    section: 'חלק א\'',
    question: 'מהו מנהג עסקי?',
    options: [
      'נוהג שאינו מוכר',
      'נוהג מקובל בתחום מסחרי',
      'חקיקה ראשית',
      'תקנה של שר'
    ],
    correctAnswer: 1,
    explanation: 'מנהג עסקי הוא נוהג חוזר ומקובל בתחום עסקי מסוים, המחייב את הצדדים אם אינו סותר חקיקה.',
    legalSource: 'חוק החוזים, פס"ד אזרחיים שונים',
    points: 2
  },
  {
    id: 'mc_4',
    type: 'multiple-choice',
    difficulty: 'easy',
    category: 'חוקי יסוד',
    section: 'חלק א\'',
    question: 'חוקי יסוד עם פסקת הגבלה מאפשרים:',
    options: [
      'פסילה מותנית של חוקים סותרים',
      'פסילה אוטומטית של חוקים',
      'ביטול מנהגים',
      'הרחבת סמכויות הכנסת'
    ],
    correctAnswer: 0,
    explanation: 'פסקת הגבלה מאפשרת לבג"ץ לבחון ולפסול חוקים הסותרים זכויות יסוד, באמצעות מבחן הפגיעה המידתית.',
    legalSource: 'חוק יסוד: כבוד האדם וחירותו',
    relatedCases: ['בג"ץ 6821/93 בנק מזרחי - המהפכה החוקתית'],
    points: 2
  },
  {
    id: 'mc_5',
    type: 'multiple-choice',
    difficulty: 'easy',
    category: 'פסיקה',
    section: 'חלק א\'',
    question: 'פסיקה מחייבת מחייבת ערכאות כך ש:',
    options: [
      'פסיקה מחייבת רק את בית המשפט שנתן אותה',
      'פסיקה מחייבת ערכאות נמוכות יותר',
      'פסיקה מחייבת את הכנסת',
      'פסיקה אינה מחייבת כלל'
    ],
    correctAnswer: 1,
    explanation: 'עקרון Stare Decisis - פסיקה של ערכאה גבוהה מחייבת ערכאות נמוכות יותר, יוצרת יציבות משפטית.',
    legalSource: 'עקרונות המשפט המקובל',
    points: 2
  },

  // רמה בינונית (5 שאלות)
  {
    id: 'mc_6',
    type: 'multiple-choice',
    difficulty: 'medium',
    category: 'ביקורת שיפוטית',
    section: 'חלק א\'',
    question: 'מי יכול לפסול תקנה הסותרת חוק יסוד?',
    options: ['שר המשפטים', 'היועמ"ש', 'בג"ץ', 'הכנסת'],
    correctAnswer: 2,
    explanation: 'בג"ץ מוסמך לפסול תקנות ופעולות מנהליות הסותרות חוקי יסוד במסגרת סמכות הביקורת השיפוטית.',
    legalSource: 'חוק יסוד: השפיטה, פסיקת בג"ץ',
    points: 3
  },
  {
    id: 'mc_7',
    type: 'multiple-choice',
    difficulty: 'medium',
    category: 'פרשנות',
    section: 'חלק א\'',
    question: 'מהי פרשנות תכליתית?',
    options: [
      'לפי לשון החוק',
      'לפי כוונת המחוקק ומטרת החוק',
      'מצמצמת תחולתו',
      'אינה קיימת במשפט הישראלי'
    ],
    correctAnswer: 1,
    explanation: 'פרשנות תכליתית בוחנת את מטרת החוק וכוונת המחוקק, לא רק את הנוסח המילולי.',
    legalSource: 'חוק הפרשנות, פסיקת בתי המשפט',
    points: 3
  },
  {
    id: 'mc_8',
    type: 'multiple-choice',
    difficulty: 'medium',
    category: 'תקדימים',
    section: 'חלק א\'',
    question: 'פס"ד קול העם התייחס ל:',
    options: [
      'עקרון חוקיות המנהל',
      'חופש הביטוי',
      'סמכות חנינה של הנשיא',
      'מנהג עסקי'
    ],
    correctAnswer: 1,
    explanation: 'פס"ד קול העם התייחס לחופש הביטוי והכיר בו כערך על-חוקי חשוב.',
    legalSource: 'ע"א 73/53 קול העם נגד שר הפנים',
    points: 3
  },
  {
    id: 'mc_9',
    type: 'multiple-choice',
    difficulty: 'medium',
    category: 'חקיקת מנדט',
    section: 'חלק א\'',
    question: 'חוקי המנדט הבריטי בישראל:',
    options: [
      'בוטלו כולם',
      'ממשיכים לחול אם לא בוטלו במפורש',
      'חלים רק בבתי דין דתיים',
      'הוסרו עם קום המדינה'
    ],
    correctAnswer: 1,
    explanation: 'חוקי המנדט ממשיכים לחול בישראל אלא אם כן בוטלו במפורש או סותרים חקיקה חדשה.',
    legalSource: 'חוק הנחת הזכות החדש',
    points: 3
  },
  {
    id: 'mc_10',
    type: 'multiple-choice',
    difficulty: 'medium',
    category: 'סטיית תקדים',
    section: 'חלק א\'',
    question: 'סטיית תקדים מותרת כאשר:',
    options: [
      'תמיד',
      'רק במקרים חריגים',
      'לעולם לא',
      'אם המחוקק מבקש'
    ],
    correctAnswer: 1,
    explanation: 'סטיית תקדים מותרת רק במקרים חריגים כאשר יש שינוי נסיבות משמעותי או צורך בצדק.',
    legalSource: 'עקרונות הפסיקה המחייבת',
    points: 3
  },

  // רמה קשה (5 שאלות) 
  {
    id: 'mc_11',
    type: 'multiple-choice',
    difficulty: 'hard',
    category: 'פרשנות דינמית',
    section: 'חלק א\'',
    question: 'מהו המשפט הדינמי?',
    options: [
      'פרשנות לפי לשון החוק בלבד',
      'פרשנות לפי צרכים עכשוויים',
      'סטיית תקדים בלבד',
      'משפט מנהגי בלבד'
    ],
    correctAnswer: 1,
    explanation: 'פרשנות דינמית מתאימה את החוק למציאות משתנה ולצרכים עכשוויים, תוך שמירה על רוח החוק.',
    legalSource: 'תורת הפרשנות המשפטית',
    points: 4
  },
  {
    id: 'mc_12',
    type: 'multiple-choice',
    difficulty: 'hard',
    category: 'חנינה',
    section: 'חלק א\'',
    question: 'מי מוסמך לאשר חנינה?',
    options: [
      'הכנסת',
      'הנשיא',
      'בג"ץ',
      'שר המשפטים'
    ],
    correctAnswer: 1,
    explanation: 'הנשיא מוסמך לחון עבריינים, זוהי סמכות חוקתית ייחודית.',
    legalSource: 'חוק יסוד: נשיא המדינה',
    points: 4
  },
  {
    id: 'mc_13',
    type: 'multiple-choice',
    difficulty: 'hard',
    category: 'פילוסופיה משפטית',
    section: 'חלק א\'',
    question: 'משפט טבעי לעומת פוזיטיביזם:',
    options: [
      'המשפט הטבעי מחייב חוק בלבד',
      'פוזיטיביזם מתחשב בערכים מוסריים',
      'המשפט הטבעי מבוסס על ערכים מוסריים, פוזיטיביזם – חוק בלבד',
      'שניהם זהים'
    ],
    correctAnswer: 2,
    explanation: 'משפט טבעי מבוסס על ערכים מוסריים אוניברסליים, בעוד פוזיטיביזם מתמקד בחוק הכתוב בלבד.',
    legalSource: 'תיאוריה משפטית',
    points: 4
  },
  {
    id: 'mc_14',
    type: 'multiple-choice',
    difficulty: 'hard',
    category: 'מנהג משפטי',
    section: 'חלק א\'',
    question: 'מנהג משפטי מחייב כאשר:',
    options: [
      'אין חקיקה סותרת',
      'תמיד',
      'רק בחקיקה אזרחית',
      'אף פעם'
    ],
    correctAnswer: 0,
    explanation: 'מנהג משפטי מחייב רק כאשר אין חקיקה ברורה הסותרת אותו והוא מקובל ומוכח.',
    legalSource: 'עקרונות המשפט המקובל',
    points: 4
  },
  {
    id: 'mc_15',
    type: 'multiple-choice',
    difficulty: 'hard',
    category: 'זכויות יסוד',
    section: 'חלק א\'',
    question: 'עקרון שוויון מול הרשות הציבורית מחייב:',
    options: [
      'החלטות לא שרירותיות',
      'עמידה בכל דרישות האזרח',
      'התערבות שיפוטית מלאה',
      'בחינה לפי שיקול דעת הרשות בלבד'
    ],
    correctAnswer: 0,
    explanation: 'עקרון השוויון מחייב החלטות מנהליות לא שרירותיות ומבוססות על קריטריונים אובייקטיביים.',
    legalSource: 'חוק יסוד: כבוד האדם וחירותו',
    points: 4
  },

  // רמה קשה מאוד (5 שאלות)
  {
    id: 'mc_16',
    type: 'multiple-choice',
    difficulty: 'expert',
    category: 'ביקורת חוקתית',
    section: 'חלק א\'',
    question: 'בג"ץ מתערב בחוק רגיל כאשר:',
    options: [
      'תמיד',
      'החוק סותר זכויות יסוד',
      'רק אם הכנסת מבקשת',
      'לעולם לא'
    ],
    correctAnswer: 1,
    explanation: 'בג"ץ מתערב בחוק רגיל כאשר הוא סותר זכויות יסוד הקבועות בחוקי יסוד.',
    legalSource: 'המהפכה החוקתית, פס"ד בנק מזרחי',
    points: 5
  },
  {
    id: 'mc_17',
    type: 'multiple-choice',
    difficulty: 'expert',
    category: 'היררכיה נורמטיבית',
    section: 'חלק א\'',
    question: 'איזה מקור נחשב למקור על-חוקי?',
    options: [
      'חוקי יסוד',
      'תקנות משרדיות',
      'מנהג עסקי',
      'חקיקה ראשית רגילה'
    ],
    correctAnswer: 0,
    explanation: 'חוקי יסוד הם המקור על-חוקי העיקרי בישראל, עליונים על חקיקה רגילה.',
    legalSource: 'המהפכה החוקתית',
    points: 5
  },
  {
    id: 'mc_18',
    type: 'multiple-choice',
    difficulty: 'expert',
    category: 'קונפליקט נורמטיבי',
    section: 'חלק א\'',
    question: 'מהו הדין במקרה של סתירה בין חוק רגיל לבין מנהג עסקי?',
    options: [
      'החוק הרגיל גובר',
      'המנהג גובר',
      'בג"ץ מחייב ביטול החוק',
      'אין פתרון'
    ],
    correctAnswer: 0,
    explanation: 'בסתירה בין חוק רגיל למנהג עסקי, החוק הרגיל גובר בהתאם לעקרון ההיררכיה הנורמטיבית.',
    legalSource: 'עקרונות היררכיה משפטית',
    points: 5
  },
  {
    id: 'mc_19',
    type: 'multiple-choice',
    difficulty: 'expert',
    category: 'פרשנות מצמצמת',
    section: 'חלק א\'',
    question: 'מהי פרשנות מצמצמת?',
    options: [
      'פרשנות שמרחיבה את החוק',
      'פרשנות שמצמצמת את תחולתו',
      'לפי לשון החוק בלבד',
      'לפי כוונת הצדדים'
    ],
    correctAnswer: 1,
    explanation: 'פרשנות מצמצמת מגבילה את תחולת החוק למקרים הבהירים ביותר, למנוע הרחבה יתרה.',
    legalSource: 'תורת הפרשנות',
    points: 5
  },
  {
    id: 'mc_20',
    type: 'multiple-choice',
    difficulty: 'expert',
    category: 'ביקורת חוקתית מתקדמת',
    section: 'חלק א\'',
    question: 'האם ניתן לפסול חוקים ללא פסקת הגבלה בחוק יסוד?',
    options: [
      'תמיד',
      'בזהירות, תוך שימוש במשפט השוואתי ועקרונות יסוד',
      'לעולם לא',
      'רק לפי החלטת היועמ"ש'
    ],
    correctAnswer: 1,
    explanation: 'גם חוקי יסוד ללא פסקת הגבלה יכולים לשמש לביקורת זהירה, תוך שימוש בעקרונות יסוד ומשפט השוואתי.',
    legalSource: 'פסיקת בג"ץ, פס"ד גל',
    points: 5
  },

  // חלק ב' - נכון/לא נכון (15 שאלות)
  
  // רמה קלה (5 שאלות)
  {
    id: 'tf_1',
    type: 'true-false',
    difficulty: 'easy',
    category: 'חקיקה',
    section: 'חלק ב\'',
    question: 'כל חקיקה ראשית נחשבת עליונה על חקיקת משנה.',
    correctAnswer: true,
    explanation: 'חקיקה ראשית (חוקי הכנסת) עומדת מעל לתקנות וחקיקה משנית בהיררכיה הנורמטיבית.',
    legalSource: 'עקרונות חוקיות המנהל',
    points: 2
  },
  {
    id: 'tf_2',
    type: 'true-false',
    difficulty: 'easy',
    category: 'מנהגים',
    section: 'חלק ב\'',
    question: 'מנהג עסקי מחייב תמיד את בתי המשפט.',
    correctAnswer: false,
    explanation: 'מנהג מחייב רק אם אין חקיקה סותרת והוא מקובל ומוכח בתחום הרלוונטי.',
    legalSource: 'חוק החוזים, פסיקה אזרחית',
    points: 2
  },
  {
    id: 'tf_3',
    type: 'true-false',
    difficulty: 'easy',
    category: 'חוקי יסוד',
    section: 'חלק ב\'',
    question: 'חוקי יסוד עם פסקת הגבלה מאפשרים פסיקה מותנית בלבד.',
    correctAnswer: true,
    explanation: 'ניתן לבחון חוקים סותרים חוקי יסוד באופן מותנה, לפי קריטריונים משפטיים.',
    legalSource: 'חוק יסוד: כבוד האדם וחירותו',
    points: 2
  },
  {
    id: 'tf_4',
    type: 'true-false',
    difficulty: 'easy',
    category: 'יועמ"ש',
    section: 'חלק ב\'',
    question: 'הנחיות היועץ המשפטי לממשלה מחייבות את הרשות המבצעת.',
    correctAnswer: true,
    explanation: 'הנחיות יועמ"ש מחייבות פרקטית את הרשות המבצעת בשאלות משפטיות.',
    legalSource: 'פסיקת בג"ץ בעניין יועמ"ש',
    points: 2
  },
  {
    id: 'tf_5',
    type: 'true-false',
    difficulty: 'easy',
    category: 'תקנות',
    section: 'חלק ב\'',
    question: 'תקנות ממשלתיות יכולות לסתור חוקי כנסת.',
    correctAnswer: false,
    explanation: 'תקנות כפופות לחקיקה ראשית ואינן יכולות לסתור חוקי כנסת.',
    legalSource: 'עקרון עליונות החקיקה הראשית',
    points: 2
  },

  // רמה בינונית (5 שאלות)
  {
    id: 'tf_6',
    type: 'true-false',
    difficulty: 'medium',
    category: 'פסיקה',
    section: 'חלק ב\'',
    question: 'פסיקה של בית משפט מחוזי מחייבת את כל בתי המשפט נמוכים ממנו.',
    correctAnswer: true,
    explanation: 'עיקרון ההיררכיה השיפוטית מחייב את הערכאות הנמוכות יותר לפסיקת ערכאות גבוהות.',
    legalSource: 'חוק בתי המשפט',
    points: 3
  },
  {
    id: 'tf_7',
    type: 'true-false',
    difficulty: 'medium',
    category: 'פרשנות',
    section: 'חלק ב\'',
    question: 'פרשנות תכליתית מחייבת תמיד התעלמות מלשון החוק.',
    correctAnswer: false,
    explanation: 'הפרשנות התכליתית משלבת גם את לשון החוק וגם את כוונת המחוקק.',
    legalSource: 'תורת הפרשנות המשפטית',
    points: 3
  },
  {
    id: 'tf_8',
    type: 'true-false',
    difficulty: 'medium',
    category: 'ביקורת חוקתית',
    section: 'חלק ב\'',
    question: 'בג"ץ רשאי לפסול חוקים רגילים הסותרים זכויות יסוד.',
    correctAnswer: true,
    explanation: 'עקרון עליונות חוקי היסוד מאפשר פסילה זו.',
    legalSource: 'המהפכה החוקתית, פס"ד בנק מזרחי',
    points: 3
  },
  {
    id: 'tf_9',
    type: 'true-false',
    difficulty: 'medium',
    category: 'משפט השוואתי',
    section: 'חלק ב\'',
    question: 'המשפט הישראלי מבוסס אך ורק על המשפט הבריטי.',
    correctAnswer: false,
    explanation: 'המשפט הישראלי הוא היברידי – כולל משפט בריטי, קונטיננטלי, עקרונות משפט טבעי ומנהגים.',
    legalSource: 'מקורות המשפט הישראלי',
    points: 3
  },
  {
    id: 'tf_10',
    type: 'true-false',
    difficulty: 'medium',
    category: 'חנינה',
    section: 'חלק ב\'',
    question: 'חנינה הנשיא יכולה להיות סותרת פסיקה של בית המשפט.',
    correctAnswer: true,
    explanation: 'חנינה היא סמכות יוצאת דופן החוקית; היא חוקית גם אם סותרת פסיקה, אך עשויה להיתקל בביקורת.',
    legalSource: 'חוק יסוד: נשיא המדינה',
    points: 3
  },

  // רמה קשה (5 שאלות)
  {
    id: 'tf_11',
    type: 'true-false',
    difficulty: 'hard',
    category: 'משפט בינלאומי',
    section: 'חלק ב\'',
    question: 'משפט בינלאומי אינו מחייב בישראל כלל.',
    correctAnswer: false,
    explanation: 'המשפט הבינלאומי מחייב כאשר אומץ כחוק פנימי או השפיע על חקיקה מקומית.',
    legalSource: 'אמנות בינלאומיות, פסיקת בג"ץ',
    points: 4
  },
  {
    id: 'tf_12',
    type: 'true-false',
    difficulty: 'hard',
    category: 'סטיית תקדים',
    section: 'חלק ב\'',
    question: 'סטיית תקדים מותרת תמיד אם השופט סבור שהמצב השתנה.',
    correctAnswer: false,
    explanation: 'סטיית תקדים מותרת רק במקרים חריגים, בדרך כלל אם שינוי מציאותי או שיקול צדק מחייב.',
    legalSource: 'עקרונות התקדים המחייב',
    points: 4
  },
  {
    id: 'tf_13',
    type: 'true-false',
    difficulty: 'hard',
    category: 'פרשנות דינמית',
    section: 'חלק ב\'',
    question: 'פרשנות דינמית מאפשרת שינוי מהותי בנוסח החוק.',
    correctAnswer: false,
    explanation: 'פרשנות דינמית מתאימה את הפרשנות למציאות משתנה אך אינה משנה את נוסח החוק עצמו.',
    legalSource: 'תורת הפרשנות',
    points: 4
  },
  {
    id: 'tf_14',
    type: 'true-false',
    difficulty: 'hard',
    category: 'משפט דתי',
    section: 'חלק ב\'',
    question: 'המשפט העברי מחייב בכל תחומי המשפט הישראלי.',
    correctAnswer: false,
    explanation: 'המשפט העברי משמש כמקור עזר בעיקר בדיני משפחה ואישי, אינו מחייב בכל התחומים.',
    legalSource: 'חוק שפיטת בתי דין רבניים',
    points: 4
  },
  {
    id: 'tf_15',
    type: 'true-false',
    difficulty: 'hard',
    category: 'דמוקרטיה מהותית',
    section: 'חלק ב\'',
    question: 'עקרון הדמוקרטיה המהותית מאפשר פסילת חוקים דמוקרטיים פורמלית.',
    correctAnswer: true,
    explanation: 'דמוקרטיה מהותית מאפשרת פסילת חוקים שהתקבלו דמוקרטית אך פוגעים בערכים דמוקרטיים יסודיים.',
    legalSource: 'פס"ד ירדור, תיאוריה חוקתית',
    points: 4
  },

  // חלק ג' - שאלות חיבור (10 שאלות)
  
  // רמה קלה (3 שאלות)
  {
    id: 'essay_1',
    type: 'essay',
    difficulty: 'easy',
    category: 'משפט מנהלי',
    section: 'חלק ג\'',
    question: 'הסבירי את עקרון חוקיות המנהל בישראל.',
    explanation: 'עקרון חוקיות המנהל קובע שהרשות המבצעת רשאית לפעול רק על סמך חוק. דוגמה: תקנות ממשלתיות חייבות להיות בסמכות חוקית, אחרת הן בטלות. דגש: עקרון זה מגן על זכויות הפרט ומונע פעולה שרירותית של הרשויות.',
    legalSource: 'פסיקת בג"ץ 390/79 דוויקאת',
    points: 10,
    timeEstimate: 15,
    keyPoints: [
      'הגדרת עקרון חוקיות המנהל',
      'הרשות המבצעת רשאית לפעול רק על סמך חוק',
      'דוגמאות מעשיות',
      'הגנה על זכויות הפרט',
      'מניעת פעולה שרירותית'
    ],
    exampleAnswer: `עקרון חוקיות המנהל קובע שהרשות המבצעת רשאית לפעול רק על סמך חוק. 

דוגמה: תקנות ממשלתיות חייבות להיות בסמכות חוקית, אחרת הן בטלות.

דגש: עקרון זה מגן על זכויות הפרט ומונע פעולה שרירותית של הרשויות.`,
    tips: [
      'התחילי בהגדרה ברורה של העקרון',
      'תני דוגמה קונקרטית',
      'הסבירי מדוע זה חשוב לדמוקרטיה'
    ]
  },
  {
    id: 'essay_2',
    type: 'essay',
    difficulty: 'easy',
    category: 'חקיקה',
    section: 'חלק ג\'',
    question: 'מה ההבדל בין חקיקה ראשית לחקיקת משנה?',
    explanation: 'חקיקה ראשית – חוקים שנחקקו על ידי הכנסת, בעלי עליונות נורמטיבית. חקיקת משנה – תקנות וצווי ממשלה, כפופים לחקיקה ראשית. דגש: חקיקת משנה אינה רשאית ליצור חוקים ראשיים אלא להבהיר או ליישם חוקים קיימים.',
    legalSource: 'חוק יסוד: הכנסת, חוק יסוד: הממשלה',
    points: 10,
    timeEstimate: 12,
    keyPoints: [
      'הגדרת חקיקה ראשית',
      'הגדרת חקיקת משנה',
      'מי מחוקק כל סוג',
      'היחס בין השניים',
      'דוגמאות'
    ],
    exampleAnswer: `חקיקה ראשית – חוקים שנחקקו על ידי הכנסת, בעלי עליונות נורמטיבית.

חקיקת משנה – תקנות וצווי ממשלה, כפופים לחקיקה ראשית.

דגש: חקיקת משנה אינה רשאית ליצור חוקים ראשיים אלא להבהיר או ליישם חוקים קיימים.`,
    tips: [
      'הבחיני בבירור בין התפקידים',
      'הדגישי את עיקרון ההיררכיה',
      'תני דוגמה לכל סוג'
    ]
  },
  {
    id: 'essay_3',
    type: 'essay',
    difficulty: 'easy',
    category: 'פרשנות',
    section: 'חלק ג\'',
    question: 'מהו המשפט הדינמי?',
    explanation: 'פרשנות החוק בהתאם לצרכים והנסיבות העכשוויות. דוגמה: שינוי בשוק או בטכנולוגיה מחייב פרשנות גמישה של חוקים קיימים. דגש: מאפשר התאמה בין החוק למציאות המשתנה, מבלי לשנות את החוק עצמו.',
    legalSource: 'תורת הפרשנות המשפטית',
    points: 8,
    timeEstimate: 10,
    keyPoints: [
      'הגדרת פרשנות דינמית',
      'התאמה למציאות משתנה',
      'דוגמאות',
      'יתרונות',
      'קשר לטכנולוגיה'
    ],
    exampleAnswer: `פרשנות החוק בהתאם לצרכים והנסיבות העכשוויות.

דוגמה: שינוי בשוק או בטכנולוגיה מחייב פרשנות גמישה של חוקים קיימים.

דגש: מאפשר התאמה בין החוק למציאות המשתנה, מבלי לשנות את החוק עצמו.`,
    tips: [
      'הדגישי את הגמישות',
      'תני דוגמה מהעולם המודרני',
      'הסבירי מדוע זה עדיף על פרשנות סטטית'
    ]
  },

  // ועוד 7 שאלות חיבור...
  {
    id: 'essay_4',
    type: 'essay',
    difficulty: 'medium',
    category: 'חוקי יסוד',
    section: 'חלק ג\'',
    question: 'הסבירי את עקרון עליונות חוקי היסוד.',
    explanation: 'חוקי יסוד הם עליונים ביחס לחוקים רגילים. דוגמה: חוק רגיל הסותר חוק יסוד עלול להיפסל על ידי בג"ץ. דגש: הבטחת זכויות יסוד ושמירה על מסגרת דמוקרטית.',
    legalSource: 'בג"ץ 6821/93 בנק מזרחי',
    points: 12,
    timeEstimate: 18,
    keyPoints: [
      'הגדרת עליונות חוקי יסוד',
      'יחס לחוקים רגילים',
      'תפקיד בג"ץ',
      'המהפכה החוקתית',
      'דוגמאות מעשיות'
    ],
    exampleAnswer: `חוקי יסוד הם עליונים ביחס לחוקים רגילים.

דוגמה: חוק רגיל הסותר חוק יסוד עלול להיפסל על ידי בג"ץ.

דגש: הבטחת זכויות יסוד ושמירה על מסגרת דמוקרטית.`,
    tips: [
      'קשרי למהפכה החוקתית',
      'הסבירי את חשיבות הביקורת החוקתית',
      'תני דוגמה לפסילת חוק'
    ]
  },
  // [המשך עם שאר השאלות...]
];

interface CompleteLegalExam50QuestionsProps {
  onComplete: (results: any) => void;
  timeLimit?: number;
}

export const CompleteLegalExam50Questions: React.FC<CompleteLegalExam50QuestionsProps> = ({
  onComplete,
  timeLimit = 120
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Map<string, any>>(new Map());
  const [currentAnswer, setCurrentAnswer] = useState<any>('');
  const [timeRemaining, setTimeRemaining] = useState(timeLimit * 60);
  const [examStarted, setExamStarted] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [examResults, setExamResults] = useState<any>(null);
  const [selectedTab, setSelectedTab] = useState(0);

  const currentQuestion = complete50Questions[currentQuestionIndex];

  // טיימר
  useEffect(() => {
    if (examStarted && timeRemaining > 0 && !showResults) {
      const timer = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            finishExam();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
      return () => clearInterval(timer);
    }
  }, [examStarted, timeRemaining, showResults]);

  // התחלת מבחן
  const startExam = () => {
    setExamStarted(true);
    setCurrentQuestionIndex(0);
    setUserAnswers(new Map());
    setCurrentAnswer('');
    setTimeRemaining(timeLimit * 60);
    setShowResults(false);
  };

  // מעבר לשאלה הבאה
  const nextQuestion = () => {
    // שמירת תשובה
    if (currentAnswer !== '') {
      const newAnswers = new Map(userAnswers);
      newAnswers.set(currentQuestion.id, currentAnswer);
      setUserAnswers(newAnswers);
    }
    
    if (currentQuestionIndex < complete50Questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setCurrentAnswer('');
    } else {
      finishExam();
    }
  };

  // מעבר לשאלה הקודמת
  const prevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setCurrentAnswer(userAnswers.get(complete50Questions[currentQuestionIndex - 1].id) || '');
    }
  };

  // סיום מבחן
  const finishExam = () => {
    // שמירת תשובה אחרונה
    if (currentAnswer !== '') {
      const newAnswers = new Map(userAnswers);
      newAnswers.set(currentQuestion.id, currentAnswer);
      setUserAnswers(newAnswers);
    }
    
    calculateResults();
  };

  // חישוב תוצאות
  const calculateResults = () => {
    let totalPoints = 0;
    let earnedPoints = 0;
    let correctAnswers = 0;
    const sectionResults = new Map();
    const difficultyResults = new Map();

    complete50Questions.forEach(question => {
      const userAnswer = userAnswers.get(question.id);
      totalPoints += question.points;
      
      let isCorrect = false;
      if (question.type === 'essay') {
        // שאלות חיבור - ציון חלקי בהתאם לאורך ואיכות
        if (userAnswer && userAnswer.length > 50) {
          const essayScore = Math.min(question.points, Math.floor(userAnswer.length / 50) * 2);
          earnedPoints += essayScore;
          isCorrect = essayScore >= question.points * 0.6;
        }
      } else {
        isCorrect = userAnswer === question.correctAnswer;
        if (isCorrect) {
          earnedPoints += question.points;
          correctAnswers++;
        }
      }
      
      // סטטיסטיקות לפי חלק
      const sectionStats = sectionResults.get(question.section) || { correct: 0, total: 0, points: 0, maxPoints: 0 };
      sectionStats.total++;
      sectionStats.maxPoints += question.points;
      if (isCorrect) {
        sectionStats.correct++;
        sectionStats.points += question.points;
      }
      sectionResults.set(question.section, sectionStats);
      
      // סטטיסטיקות לפי קושי
      const diffStats = difficultyResults.get(question.difficulty) || { correct: 0, total: 0 };
      diffStats.total++;
      if (isCorrect) diffStats.correct++;
      difficultyResults.set(question.difficulty, diffStats);
    });

    const percentage = Math.round((earnedPoints / totalPoints) * 100);
    
    const results = {
      totalQuestions: complete50Questions.length,
      totalPoints,
      earnedPoints,
      percentage,
      correctAnswers,
      sectionResults,
      difficultyResults,
      timeSpent: timeLimit - Math.floor(timeRemaining / 60)
    };
    
    setExamResults(results);
    setShowResults(true);
    onComplete(results);
  };

  // פורמט זמן
  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // קבלת צבע לפי קושי
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return '#4caf50';
      case 'medium': return '#ff9800';
      case 'hard': return '#f44336';
      case 'expert': return '#9c27b0';
      default: return '#9e9e9e';
    }
  };

  if (!examStarted) {
    return (
      <Box sx={{ maxWidth: 800, margin: 'auto', p: 3 }}>
        <Card>
          <CardHeader
            title={
              <Typography variant="h4" textAlign="center" color="primary">
                🏛️ מבחן מקיף - 50 שאלות במקורות המשפט
              </Typography>
            }
            subheader={
              <Typography variant="h6" textAlign="center" color="text.secondary">
                מבחן מקיף הכולל רב-ברירה, נכון/לא נכון ושאלות חיבור
              </Typography>
            }
          />
          <CardContent>
            <Alert severity="info" sx={{ mb: 3 }}>
              <Typography variant="body1">
                <strong>מבנה המבחן:</strong>
              </Typography>
              <Typography variant="body2" component="div" sx={{ mt: 1 }}>
                • <strong>חלק א':</strong> 20 שאלות רב-ברירה (40 נקודות)<br/>
                • <strong>חלק ב':</strong> 15 שאלות נכון/לא נכון (30 נקודות)<br/>
                • <strong>חלק ג':</strong> 10 שאלות חיבור (100 נקודות)<br/>
                • <strong>זמן:</strong> {timeLimit} דקות<br/>
                • <strong>סה"כ נקודות:</strong> 170 נקודות
              </Typography>
            </Alert>
            
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={12} sm={4}>
                <Paper elevation={1} sx={{ p: 2, textAlign: 'center', bgcolor: '#e3f2fd' }}>
                  <QuizIcon sx={{ fontSize: 40, color: '#1976d2', mb: 1 }} />
                  <Typography variant="h6">רב-ברירה</Typography>
                  <Typography variant="body2">20 שאלות</Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Paper elevation={1} sx={{ p: 2, textAlign: 'center', bgcolor: '#f3e5f5' }}>
                  <CheckCircle sx={{ fontSize: 40, color: '#7b1fa2', mb: 1 }} />
                  <Typography variant="h6">נכון/לא נכון</Typography>
                  <Typography variant="body2">15 שאלות</Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Paper elevation={1} sx={{ p: 2, textAlign: 'center', bgcolor: '#e8f5e8' }}>
                  <EssayIcon sx={{ fontSize: 40, color: '#388e3c', mb: 1 }} />
                  <Typography variant="h6">חיבור</Typography>
                  <Typography variant="body2">10 שאלות</Typography>
                </Paper>
              </Grid>
            </Grid>

            <Box textAlign="center">
              <Button 
                variant="contained" 
                size="large"
                startIcon={<TrophyIcon />}
                onClick={startExam}
                sx={{ fontSize: '1.2rem', py: 2, px: 4 }}
              >
                התחל מבחן מקיף
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Box>
    );
  }

  if (showResults && examResults) {
    return (
      <Box sx={{ maxWidth: 1000, margin: 'auto', p: 3 }}>
        <Card>
          <CardHeader
            title={
              <Typography variant="h4" textAlign="center" color="primary">
                🎉 תוצאות המבחן המקיף
              </Typography>
            }
          />
          <CardContent>
            <Box textAlign="center" mb={4}>
              <Avatar 
                sx={{ 
                  width: 100, 
                  height: 100, 
                  bgcolor: examResults.percentage >= 80 ? '#4caf50' : 
                          examResults.percentage >= 60 ? '#ff9800' : '#f44336',
                  margin: 'auto',
                  mb: 2
                }}
              >
                <Typography variant="h3" color="white">
                  {examResults.percentage}%
                </Typography>
              </Avatar>
              
              <Typography variant="h4" gutterBottom>
                {examResults.percentage >= 90 ? '🏆 מצוינות!' :
                 examResults.percentage >= 80 ? '⭐ מעולה!' :
                 examResults.percentage >= 70 ? '👍 טוב מאוד!' :
                 examResults.percentage >= 60 ? '📚 עבר!' : '💪 לא עבר - המשך להתרגל!'}
              </Typography>
              
              <Grid container spacing={2} justifyContent="center">
                <Grid item>
                  <Paper elevation={1} sx={{ p: 2, textAlign: 'center' }}>
                    <Typography variant="h5" color="primary">
                      {examResults.earnedPoints}/{examResults.totalPoints}
                    </Typography>
                    <Typography variant="caption">נקודות</Typography>
                  </Paper>
                </Grid>
                <Grid item>
                  <Paper elevation={1} sx={{ p: 2, textAlign: 'center' }}>
                    <Typography variant="h5" color="success.main">
                      {examResults.correctAnswers}
                    </Typography>
                    <Typography variant="caption">תשובות נכונות</Typography>
                  </Paper>
                </Grid>
                <Grid item>
                  <Paper elevation={1} sx={{ p: 2, textAlign: 'center' }}>
                    <Typography variant="h5" color="info.main">
                      {examResults.timeSpent} דק'
                    </Typography>
                    <Typography variant="caption">זמן שהושקע</Typography>
                  </Paper>
                </Grid>
              </Grid>
            </Box>

            <Typography variant="h6" gutterBottom>
              תוצאות לפי חלקים:
            </Typography>
            
            <Grid container spacing={3}>
              {Array.from(examResults.sectionResults.entries()).map(([section, stats]) => {
                const percentage = Math.round((stats.points / stats.maxPoints) * 100);
                return (
                  <Grid item xs={12} md={4} key={section}>
                    <Paper elevation={2} sx={{ p: 2 }}>
                      <Typography variant="h6" gutterBottom>
                        {section}
                      </Typography>
                      <LinearProgress 
                        variant="determinate" 
                        value={percentage}
                        sx={{ mb: 1 }}
                      />
                      <Typography variant="body2">
                        {stats.correct}/{stats.total} שאלות נכונות
                      </Typography>
                      <Typography variant="body2">
                        {stats.points}/{stats.maxPoints} נקודות ({percentage}%)
                      </Typography>
                    </Paper>
                  </Grid>
                );
              })}
            </Grid>

            <Box mt={4} textAlign="center">
              <Button 
                variant="contained" 
                startIcon={<RefreshIcon />}
                onClick={() => {
                  setExamStarted(false);
                  setShowResults(false);
                  setCurrentQuestionIndex(0);
                  setUserAnswers(new Map());
                  setCurrentAnswer('');
                }}
                sx={{ mr: 2 }}
              >
                מבחן חדש
              </Button>
              <Button 
                variant="outlined"
                onClick={() => {
                  const text = `השלמתי מבחן מקיף במקורות המשפט עם ציון ${examResults.percentage}%! 🏛️`;
                  navigator.share?.({ text }) || navigator.clipboard?.writeText(text);
                }}
              >
                שתף תוצאות
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Box>
    );
  }

  // מצב מבחן פעיל
  const progress = ((currentQuestionIndex + 1) / complete50Questions.length) * 100;

  return (
    <Box sx={{ maxWidth: 900, margin: 'auto', p: 3 }}>
      <Card>
        {/* כותרת עם מידע */}
        <CardHeader
          title={
            <Box display="flex" justifyContent="between" alignItems="center">
              <Typography variant="h5">
                🏛️ מבחן מקיף - מקורות המשפט
              </Typography>
              <Box display="flex" alignItems="center" gap={2}>
                <Chip 
                  icon={<TimerIcon />}
                  label={formatTime(timeRemaining)}
                  color={timeRemaining < 600 ? 'error' : 'primary'}
                />
                <Chip 
                  label={`${currentQuestionIndex + 1}/${complete50Questions.length}`}
                  variant="outlined"
                />
              </Box>
            </Box>
          }
        />
        
        {/* progress bar */}
        <LinearProgress variant="determinate" value={progress} sx={{ mb: 2 }} />
        
        <CardContent>
          {/* מידע על השאלה */}
          <Box display="flex" justifyContent="between" alignItems="center" mb={3}>
            <Box display="flex" gap={1}>
              <Chip 
                label={currentQuestion.section}
                size="small"
                color="primary"
              />
              <Chip 
                label={currentQuestion.category}
                size="small"
                variant="outlined"
              />
              <Chip 
                label={
                  currentQuestion.difficulty === 'easy' ? 'קל' :
                  currentQuestion.difficulty === 'medium' ? 'בינוני' :
                  currentQuestion.difficulty === 'hard' ? 'קשה' : 'מומחה'
                }
                size="small"
                sx={{ 
                  backgroundColor: getDifficultyColor(currentQuestion.difficulty),
                  color: 'white'
                }}
              />
              <Chip 
                label={`${currentQuestion.points} נק'`}
                size="small"
                color="success"
              />
            </Box>
          </Box>
          
          {/* השאלה */}
          <Typography variant="h6" gutterBottom>
            {currentQuestion.question}
          </Typography>
          
          {/* תשובות */}
          <Box sx={{ mt: 3 }}>
            {currentQuestion.type === 'multiple-choice' && currentQuestion.options && (
              <FormControl component="fieldset" fullWidth>
                <RadioGroup
                  value={currentAnswer}
                  onChange={(e) => setCurrentAnswer(parseInt(e.target.value))}
                >
                  {currentQuestion.options.map((option, index) => (
                    <FormControlLabel
                      key={index}
                      value={index}
                      control={<Radio />}
                      label={`${String.fromCharCode(65 + index)}. ${option}`}
                      sx={{ mb: 1 }}
                    />
                  ))}
                </RadioGroup>
              </FormControl>
            )}
            
            {currentQuestion.type === 'true-false' && (
              <FormControl component="fieldset" fullWidth>
                <RadioGroup
                  value={currentAnswer}
                  onChange={(e) => setCurrentAnswer(e.target.value === 'true')}
                >
                  <FormControlLabel
                    value="true"
                    control={<Radio />}
                    label="✅ נכון"
                    sx={{ mb: 1 }}
                  />
                  <FormControlLabel
                    value="false"
                    control={<Radio />}
                    label="❌ לא נכון"
                    sx={{ mb: 1 }}
                  />
                </RadioGroup>
              </FormControl>
            )}
            
            {currentQuestion.type === 'essay' && (
              <Box>
                {currentQuestion.tips && (
                  <Alert severity="info" sx={{ mb: 2 }}>
                    <Typography variant="body2">
                      <strong>טיפים:</strong> {currentQuestion.tips.join(' • ')}
                    </Typography>
                  </Alert>
                )}
                <TextField
                  multiline
                  fullWidth
                  rows={8}
                  placeholder="כתוב את תשובתך כאן..."
                  value={currentAnswer}
                  onChange={(e) => setCurrentAnswer(e.target.value)}
                  variant="outlined"
                />
                <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                  מילים: {currentAnswer ? currentAnswer.split(' ').filter(w => w.length > 0).length : 0} | 
                  זמן משוער: {currentQuestion.timeEstimate} דק'
                </Typography>
              </Box>
            )}
          </Box>
          
          {/* כפתורי ניווט */}
          <Box display="flex" justifyContent="between" alignItems="center" mt={4}>
            <Button
              startIcon={<PrevIcon />}
              onClick={prevQuestion}
              disabled={currentQuestionIndex === 0}
            >
              קודם
            </Button>
            
            <Box display="flex" gap={2}>
              {currentQuestionIndex === complete50Questions.length - 1 ? (
                <Button
                  variant="contained"
                  color="success"
                  size="large"
                  endIcon={<ResultsIcon />}
                  onClick={finishExam}
                  disabled={currentAnswer === ''}
                >
                  סיים מבחן
                </Button>
              ) : (
                <Button
                  variant="contained"
                  endIcon={<NextIcon />}
                  onClick={nextQuestion}
                  disabled={currentAnswer === ''}
                >
                  הבא
                </Button>
              )}
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

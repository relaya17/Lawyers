import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  Chip,
  LinearProgress,
  Paper,
  Alert,
  List,
  ListItem,
  ListItemText,
  ListItemIcon
} from '@mui/material';
import {
  CheckCircle,
  Cancel,
  Info,
  Assignment,
  LocalPolice,
  Balance,
  Article,
  Security
} from '@mui/icons-material';

interface Question {
  id: number;
  type: 'multiple-choice' | 'true-false' | 'case-study';
  difficulty: 'קל' | 'בינוני' | 'קשה' | 'קשה מאוד';
  icon: string;
  category: string;
  question: string;
  options?: { id: string; text: string }[];
  correctAnswer: string;
  explanation: string;
  precedent?: string;
  lawReference?: string;
}

interface OpenQuestion {
  id: number;
  question: string;
  category: string;
  difficulty: string;
  guidelines: string;
  keyPoints: string[];
  example?: string;
}

const openQuestions: OpenQuestion[] = [
  {
    id: 1,
    question: 'נתח עבירה שבה אדם גורם לנזק כלכלי אך לא פוגע פיזית באדם – סוג העבירה, יסוד נפשי, ריבוב.',
    category: 'ניתוח עבירות',
    difficulty: 'קשה',
    guidelines: 'נתח את רכיבי העבירה: התנהגות, נסיבות, תוצאה ויסוד נפשי',
    keyPoints: [
      'זיהוי סוג העבירה: התנהגות או תוצאה',
      'ניתוח היסוד הנפשי הנדרש',
      'בחינת אפשרות ריבוב משפטי או עובדתי',
      'דוגמאות: מרמה, עבירות ניירות ערך'
    ]
  },
  {
    id: 2,
    question: 'הסבר מקרה שבו אדם טעה בתום לב בהצהרה לעובדה מסוימת – האם מדובר ברשלנות או אחריות קפידה?',
    category: 'יסוד נפשי',
    difficulty: 'בינוני',
    guidelines: 'השווה בין רשלנות (מבחן האדם הסביר) לאחריות קפידה',
    keyPoints: [
      'הגדרת רשלנות: אי מודעות שאדם סביר היה מודע אליה',
      'הגדרת אחריות קפידה: חריגה מחובת הזהירות הקפידה',
      'בחינת תום הלב כגורם מקל',
      'מבחן האדם הסביר במצב דומה'
    ]
  },
  {
    id: 3,
    question: 'נתח את המשמעות של מודעות לתוצאה במקרה של ירי בנשק מסוכן.',
    category: 'מודעות ויסוד נפשי',
    difficulty: 'קשה',
    guidelines: 'בחן את רמות המודעות ויחסן ליסוד הנפשי',
    keyPoints: [
      'מודעות לסיכון החמור הטבוע בנשק מסוכן',
      'ההבחנה בין מחשבה פלילית לפזיזות',
      'תפקיד המודעות בקביעת היסוד הנפשי',
      'השפעת סוג הנשק על רמת המודעות הנדרשת'
    ]
  },
  {
    id: 4,
    question: 'הסבר הבדל בין "אדישות" לבין "קלות דעת" בעבירת תוצאה.',
    category: 'פזיזות',
    difficulty: 'בינוני',
    guidelines: 'הגדר שני מרכיבי הפזיזות ויחסם ליסוד הנפשי',
    keyPoints: [
      'אדישות: חוסר התחשבות במשמעות המעשה',
      'קלות דעת: הערכה שגויה של חומרת הסיכון',
      'שניהם מהווים פזיזות עם מודעות לסיכון',
      'ההבחנה מרשלנות (חוסר מודעות)'
    ]
  },
  {
    id: 5,
    question: 'ספק דוגמה לעבירת התנהגות עם פגיעה מקרית שמניבה אחריות קפידה.',
    category: 'אחריות קפידה',
    difficulty: 'קשה',
    guidelines: 'תאר מקרה ספציפי ונתח את רכיבי האחריות הקפידה',
    keyPoints: [
      'עבירת התנהגות: מעשה האסור ברגע ביצועו',
      'פגיעה מקרית: תוצאה לא צפויה',
      'אחריות קפידה: חריגה מתחום הסיכון המותר',
      'דוגמה: נהיגה מתחת להשפעה שגרמה לתאונה'
    ]
  },
  {
    id: 6,
    question: 'נתח מקרה שבו שני אנשים מבצעים אותו מעשה – האם מתקיים ריבוב משפטי?',
    category: 'ריבוב',
    difficulty: 'בינוני',
    guidelines: 'בחן את תנאי הריבוב המשפטי לעומת שותפות',
    keyPoints: [
      'ריבוב משפטי: אותה התנהגות, הגדרות עבירה שונות',
      'שותפות: מספר אנשים באותה עבירה',
      'ההבחנה בין ריבוב לשותפות בפשע',
      'דוגמה: שני אנשים תוקפים אדם שלישי'
    ]
  },
  {
    id: 7,
    question: 'כיצד מגדירים "תוצאה" בעבירה תוצאתית, ומה הקשר ליסוד נפשי?',
    category: 'עבירות תוצאה',
    difficulty: 'קשה',
    guidelines: 'הגדר תוצאה והסבר את הקשר בינה ליסוד הנפשי',
    keyPoints: [
      'תוצאה: שינוי במציאות החיצונית כתוצאה מההתנהגות',
      'קשר סיבתי: הצורך לקשר בין התנהגות לתוצאה',
      'יסוד נפשי לתוצאה: מודעות או אדישות לסיכון',
      'דוגמאות: מוות, נזק רכוש, נזק כלכלי'
    ]
  },
  {
    id: 8,
    question: 'נתח מצב שבו העדויות סותרות – כיצד משפיעה רמת ההוכחה על ההרשעה?',
    category: 'רמת הוכחה',
    difficulty: 'קשה',
    guidelines: 'הסבר את חזקת החפות ורמת ההוכחה הנדרשת',
    keyPoints: [
      'חזקת החפות: נטל ההוכחה על התביעה',
      'מעבר לכל ספק סביר: הרמה הגבוהה ביותר',
      'עדויות סותרות: פגיעה ברמת הוודאות',
      'התוצאה: זיכוי במקרה של ספק סביר'
    ]
  },
  {
    id: 9,
    question: 'הסבר מקרה שבו הסגרה התבצעה על עבירה אחת אך ההרשעה היא על עבירה אחרת – הקשר לריבוב משפטי.',
    category: 'ריבוב והסגרה',
    difficulty: 'קשה מאוד',
    guidelines: 'נתח את מקרה דמניוק כדוגמה לריבוב משפטי בהסגרה',
    keyPoints: [
      'ריבוב משפטי: אותה התנהגות, הגדרות שונות',
      'מקרה דמניוק: הסגרה בגין רצח, העמדה לדין על "עשיית דין בנאצים"',
      'הצורך בזהות ההתנהגות בין המדינות',
      'הגבלות על שינוי כתב האישום'
    ]
  },
  {
    id: 10,
    question: 'ספק ניתוח של מקרה רפואי שבו פעולה לא מקצועית גרמה למוות – סוג העבירה, יסוד נפשי.',
    category: 'רשלנות רפואית',
    difficulty: 'קשה',
    guidelines: 'נתח רשלנות רפואית כעבירת תוצאה עם יסוד נפשי של רשלנות',
    keyPoints: [
      'עבירת תוצאה: מוות כתוצאה מהפעולה הרפואית',
      'רשלנות: חריגה מהסטנדרט הרפואי הנדרש',
      'מבחן האדם הסביר: מה היה עושה רופא סביר',
      'דוגמה: ניתוח ללא הרדמה מתאימה'
    ]
  },
  {
    id: 11,
    question: 'הסבר כיצד נבדל מניע רגשי ממטרה בעבירת כוונה מיוחדת.',
    category: 'כוונה מיוחדת',
    difficulty: 'קשה',
    guidelines: 'הבחן בין המניע (הגורם הפנימי) למטרה (התוצאה הרצויה)',
    keyPoints: [
      'מניע רגשי: הרגש המניע לפעולה (נקמה, קנאה)',
      'מטרה: התוצאה שהפועל מבקש להשיג',
      'כוונה מיוחדת דורשת גם מניע וגם מטרה',
      'דוגמה: רצח מתוך נקמה (מניע) למען הנטילת חיים (מטרה)'
    ]
  },
  {
    id: 12,
    question: 'ספק דוגמה לעבירה שבה התנהגות זהה אך תוצאה שונה – האם מתקיים ריבוב משפטי?',
    category: 'ריבוב משפטי',
    difficulty: 'בינוני',
    guidelines: 'בחן מקרה עם התנהגות זהה ותוצאות שונות',
    keyPoints: [
      'ריבוב משפטי: התנהגות זהה, הגדרות עבירה שונות',
      'התוצאה השונה לא מונעת ריבוב משפטי',
      'הדגש על זהות ההתנהגות',
      'דוגמה: תקיפה שגרמה לחבלה ולמוות'
    ]
  },
  {
    id: 13,
    question: 'נתח עבירה שבה אדם מבצע מעשה מתוך פזיזות אך מבלי לדעת את התוצאה – סוג העבירה.',
    category: 'פזיזות וחוסר מודעות',
    difficulty: 'קשה',
    guidelines: 'נתח את השילוב של פזיזות עם חוסר מודעות מלאה',
    keyPoints: [
      'פזיזות: מודעות לסיכון עם אדישות',
      'חוסר מודעות לתוצאה הספציפית',
      'עדיין יש אחריות עקב הפזיזות',
      'דוגמה: נהיגה פזיזה שגרמה לתאונה'
    ]
  },
  {
    id: 14,
    question: 'הסבר את החשיבות של הבנה ועיבוד מידע בחקירה פלילית.',
    category: 'חקירה פלילית',
    difficulty: 'בינוני',
    guidelines: 'הסבר את תפקיד איסוף וניתוח הראיות בהוכחת היסוד הנפשי',
    keyPoints: [
      'איסוף ראיות להתנהגות ולתוצאה',
      'הוכחת היסוד הנפשי דרך ראיות חיצוניות',
      'החשיבות של רצף הארועים',
      'שימוש בחזקות משפטיות'
    ]
  },
  {
    id: 15,
    question: 'ספק ניתוח של מקרה מורכב המשלב עבירת התנהגות ותוצאה עם יסוד נפשי מעורב.',
    category: 'מקרה מורכב',
    difficulty: 'קשה מאוד',
    guidelines: 'צור מקרה עם מספר רכיבים ונתח כל חלק בנפרד',
    keyPoints: [
      'זיהוי רכיבי ההתנהגות והתוצאה',
      'ניתוח היסוד הנפשי לכל רכיב',
      'בחינת ריבוב משפטי או עובדתי',
      'דוגמה: שימוש במידע פנים שגרם לקריסת חברה'
    ]
  }
];

const questions: Question[] = [
  // חלק א' - יסודות עבירות פליליות
  {
    id: 1,
    type: 'multiple-choice',
    difficulty: 'בינוני',
    icon: '⚖️',
    category: 'יסודות עבירה',
    question: 'איזה מהרכיבים הבאים הוא חובה לכל עבירה פלילית?',
    options: [
      { id: 'a', text: 'התנהגות בלבד' },
      { id: 'b', text: 'תוצאה בלבד' },
      { id: 'c', text: 'התנהגות + יסוד נפשי' },
      { id: 'd', text: 'נסיבות מחמירות' }
    ],
    correctAnswer: 'c',
    explanation: 'כל עבירה פלילית חייבת לכלול שני רכיבים מינימליים: התנהגות (רכיב עובדתי) ויסוד נפשי. ללא אחד מהם, אין עבירה פלילית.',
    lawReference: 'עקרונות יסוד בדיני עונשין'
  },
  {
    id: 2,
    type: 'multiple-choice',
    difficulty: 'בינוני',
    icon: '🎯',
    category: 'סוגי עבירות',
    question: 'מה מאפיין עבירת התנהגות?',
    options: [
      { id: 'a', text: 'דורשת תוצאה חיצונית' },
      { id: 'b', text: 'מתרחשת ברגע ביצוע המעשה' },
      { id: 'c', text: 'תמיד דורשת נזק פיזי' },
      { id: 'd', text: 'מותנית בנסיבות מחמירות' }
    ],
    correctAnswer: 'b',
    explanation: 'עבירת התנהגות מתרחשת ברגע ביצוע המעשה הפלילי, ללא צורך בתוצאה חיצונית נוספת. דוגמה: שקר בעדות, שימוש במידע פנים.',
    lawReference: 'סעיף 241, 52ג לחוק העונשין'
  },
  {
    id: 3,
    type: 'case-study',
    difficulty: 'קשה',
    icon: '💰',
    category: 'סוגי עבירות',
    question: 'אדם משתמש במידע פנים בבורסה. איזה סוג עבירה זו?',
    options: [
      { id: 'a', text: 'עבירת תוצאה - כי נגרם נזק כלכלי' },
      { id: 'b', text: 'עבירת התנהגות - השימוש עצמו אסור' },
      { id: 'c', text: 'תלוי בגובה הרווח' },
      { id: 'd', text: 'תלוי בנזק שנגרם לשוק' }
    ],
    correctAnswer: 'b',
    explanation: 'שימוש במידע פנים הוא עבירת התנהגות לפי סעיף 52ג לחוק ניירות ערך. העבירה מתרחשת ברגע השימוש, ללא צורך להוכיח תוצאה או נזק.',
    lawReference: 'סעיף 52ג לחוק ניירות ערך'
  },

  // חלק ב' - יסוד נפשי
  {
    id: 4,
    type: 'multiple-choice',
    difficulty: 'בינוני',
    icon: '🧠',
    category: 'יסוד נפשי',
    question: 'מה ברירת המחדל ליסוד נפשי כאשר החוק שותק?',
    options: [
      { id: 'a', text: 'פזיזות' },
      { id: 'b', text: 'מחשבה פלילית' },
      { id: 'c', text: 'רשלנות' },
      { id: 'd', text: 'תלוי בסוג העבירה' }
    ],
    correctAnswer: 'd',
    explanation: 'כאשר החוק שותק: בעבירות התנהגות - ברירת המחדל היא מחשבה פלילית. בעבירות תוצאה - ברירת המחדל היא פזיזות.',
    lawReference: 'עקרונות יסוד בדיני עונשין'
  },
  {
    id: 5,
    type: 'multiple-choice',
    difficulty: 'קשה',
    icon: '💭',
    category: 'יסוד נפשי',
    question: 'מה ההבדל בין כוונה רגילה לכוונה מיוחדת?',
    options: [
      { id: 'a', text: 'כוונה רגילה - רצון לתוצאה; כוונה מיוחדת - פעולה למטרה/מניע' },
      { id: 'b', text: 'אין הבדל מהותי' },
      { id: 'c', text: 'כוונה מיוחדת חמורה יותר' },
      { id: 'd', text: 'כוונה רגילה מספיקה תמיד' }
    ],
    correctAnswer: 'a',
    explanation: 'כוונה רגילה = רצון שהתוצאה תקרה. כוונה מיוחדת = פעולה שבוצעה למען מטרה מסוימת או מניע מוגדר (נקמה, רווח אישי).',
    lawReference: 'דיני עונשין - סוגי יסוד נפשי'
  },
  {
    id: 6,
    type: 'case-study',
    difficulty: 'קשה',
    icon: '🩺',
    category: 'יסוד נפשי',
    question: 'רופא גרם למוות חולה עקב חוסר מקצועיות. מה היסוד הנפשי?',
    options: [
      { id: 'a', text: 'מחשבה פלילית' },
      { id: 'b', text: 'פזיזות' },
      { id: 'c', text: 'רשלנות' },
      { id: 'd', text: 'אחריות קפידה' }
    ],
    correctAnswer: 'c',
    explanation: 'רופא שגרם למוות עקב התרשלות מקצועית פועל ברשלנות. מבחן: מה היה עושה רופא סביר באותו מצב? אין כוונה לפגוע, אך יש הפרת חובת הזהירות.',
    lawReference: 'סעיף 304 לחוק העונשין'
  },
  {
    id: 7,
    type: 'multiple-choice',
    difficulty: 'קשה',
    icon: '😠',
    category: 'יסוד נפשי',
    question: 'מה מאפיין פזיזות?',
    options: [
      { id: 'a', text: 'רצון להזיק' },
      { id: 'b', text: 'אדישות או קלות דעת כלפי הסיכון' },
      { id: 'c', text: 'חוסר מודעות לחלוטין' },
      { id: 'd', text: 'מעשה בטעות' }
    ],
    correctAnswer: 'b',
    explanation: 'פזיזות = אדישות או קלות דעת כלפי הסיכון. האדם מודע לאפשרות של תוצאה רעה אך פועל בכל זאת מתוך אדישות או קלות דעת.',
    lawReference: 'דיני עונשין - הגדרת פזיזות'
  },

  // חלק ג' - ריבוב
  {
    id: 8,
    type: 'multiple-choice',
    difficulty: 'בינוני',
    icon: '🔢',
    category: 'ריבוב',
    question: 'מתי מתקיים ריבוב משפטי?',
    options: [
      { id: 'a', text: 'התנהגות זהה, תוצאות שונות' },
      { id: 'b', text: 'התנהגות זהה בלבד' },
      { id: 'c', text: 'תוצאות זהות בלבד' },
      { id: 'd', text: 'נסיבות זהות בלבד' }
    ],
    correctAnswer: 'b',
    explanation: 'ריבוב משפטי מתקיים כאשר ההתנהגות זהה, גם אם התוצאות או הנסיבות שונות. הכלל: אותה פעולה = ריבוב משפטי.',
    lawReference: 'עקרונות הריבוב בדיני עונשין'
  },
  {
    id: 9,
    type: 'case-study',
    difficulty: 'קשה',
    icon: '🔫',
    category: 'ריבוב',
    question: 'אדם יורה ירייה אחת ופוגע ב-3 אנשים. איזה ריבוב מתקיים?',
    options: [
      { id: 'a', text: 'ריבוב משפטי - התנהגות זהה' },
      { id: 'b', text: 'ריבוב עובדתי - תוצאות נפרדות' },
      { id: 'c', text: 'אין ריבוב - מעשה אחד' },
      { id: 'd', text: 'תלוי בכוונה' }
    ],
    correctAnswer: 'b',
    explanation: 'ירייה אחת שפוגעת במספר אנשים = ריבוב עובדתי. ההתנהגות זהה, אך כל פגיעה בתוצאה עצמאית נחשבת לעבירה נפרדת.',
    lawReference: 'סעיפים 19-21 לחוק העונשין'
  },
  {
    id: 10,
    type: 'case-study',
    difficulty: 'קשה מאוד',
    icon: '⚖️',
    category: 'ריבוב',
    question: 'במקרה דמניוק: הסגרה בגין רצח, העמדה לדין בעבירת "עשיית דין בנאצים". איזה ריבוב?',
    options: [
      { id: 'a', text: 'ריבוב משפטי - התנהגות זהה' },
      { id: 'b', text: 'ריבוב עובדתי - תוצאות שונות' },
      { id: 'c', text: 'אין ריבוב - עבירות שונות' },
      { id: 'd', text: 'תלוי בבית המשפט' }
    ],
    correctAnswer: 'a',
    explanation: 'מקרה דמניוק = ריבוב משפטי. ההתנהגות זהה ("גורם למותו של אדם"), אך ההגדרה המשפטי שונה במדינות שונות.',
    precedent: 'מקרה דמניוק - ריבוב משפטי בהסגרה',
    lawReference: 'עקרונות הריבוב בדיני עונשין'
  },

  // חלק ד' - מקרים מורכבים
  {
    id: 11,
    type: 'case-study',
    difficulty: 'קשה מאוד',
    icon: '🌳',
    category: 'מקרה מורכב',
    question: 'אדם חותך עץ ברגליו, העץ נופל ופוגע בבניין. איזה סוג עבירה?',
    options: [
      { id: 'a', text: 'עבירת התנהגות בלבד' },
      { id: 'b', text: 'עבירת תוצאה בלבד' },
      { id: 'c', text: 'עבירת התנהגות עם תוצאה' },
      { id: 'd', text: 'עבירת נסיבות' }
    ],
    correctAnswer: 'c',
    explanation: 'החיתוך ברגלי העץ = התנהגות. הנזק לבניין = תוצאה. זהו מקרה טיפוסי של עבירת תוצאה עם רכיב התנהגותי.',
    lawReference: 'סעיף 52ג לחוק העונשין'
  },
  {
    id: 12,
    type: 'case-study',
    difficulty: 'קשה',
    icon: '☠️',
    category: 'מקרה מורכב',
    question: 'הפצת חומרים רעילים שגרמה למוות. מה היסוד הנפשי?',
    options: [
      { id: 'a', text: 'מחשבה פלילית' },
      { id: 'b', text: 'פזיזות' },
      { id: 'c', text: 'רשלנות' },
      { id: 'd', text: 'תלוי בכוונה' }
    ],
    correctAnswer: 'b',
    explanation: 'הפצת חומרים רעילים היא עבירת תוצאה. אין כוונה ספציפית להרוג, אך יש מודעות לסיכון. פזיזות (אדישות או קלות דעת) מספיקה.',
    lawReference: 'סעיפים 54, 90 לחוק העונשין'
  },
  {
    id: 13,
    type: 'multiple-choice',
    difficulty: 'קשה',
    icon: '🚗',
    category: 'מקרה מורכב',
    question: 'חציית קו הפרדה כפול שגרמה למוות. מה היסוד הנפשי?',
    options: [
      { id: 'a', text: 'מחשבה פלילית' },
      { id: 'b', text: 'פזיזות - אדישות או קלות דעת' },
      { id: 'c', text: 'רשלנות' },
      { id: 'd', text: 'אחריות קפידה' }
    ],
    correctAnswer: 'b',
    explanation: 'חציית קו הפרדה כפול היא עבירת תוצאה. לא הייתה כוונה להרוג, אך נעשה סיכון בלתי סביר. אדישות או קלות דעת (פזיזות) מספקת.',
    lawReference: 'סעיפים 52, 53 לחוק העונשין'
  },

  // חלק ה' - נושאים מתקדמים
  {
    id: 14,
    type: 'multiple-choice',
    difficulty: 'בינוני',
    icon: '📊',
    category: 'רמת הוכחה',
    question: 'מה רמת ההוכחה הנדרשת בפלילי?',
    options: [
      { id: 'a', text: 'רוב הסתברות' },
      { id: 'b', text: 'מעל לכל ספק סביר' },
      { id: 'c', text: 'הסתברות גבוהה' },
      { id: 'd', text: 'עדות אחת מהימנה' }
    ],
    correctAnswer: 'b',
    explanation: 'בפלילי נדרש להוכיח את אשמת הנאשם מעל לכל ספק סביר. זו רמה גבוהה יותר מפלילי אזרחי שדורש רק רוב הסתברות.',
    precedent: 'מדינת ישראל נ\' כהן ע"פ 455/97',
    lawReference: 'עקרון חזקת החפות'
  },
  {
    id: 15,
    type: 'multiple-choice',
    difficulty: 'בינוני',
    icon: '🤝',
    category: 'שותפות',
    question: 'מה מאפיין עבירת סיוע?',
    options: [
      { id: 'a', text: 'ביצוע העבירה העיקרית' },
      { id: 'b', text: 'מודעות למעשה וכוונה לסייע' },
      { id: 'c', text: 'נוכחות בזירה' },
      { id: 'd', text: 'רק סיוע פיזי' }
    ],
    correctAnswer: 'b',
    explanation: 'סיוע הוא עבירה נלווית: האדם אינו מבצע את העבירה העיקרית, אך מודע למעשה ומכוון לסייע לביצועה.',
    lawReference: 'סעיפים 30-33 לחוק העונשין'
  },
  {
    id: 16,
    type: 'true-false',
    difficulty: 'בינוני',
    icon: '📝',
    category: 'עדות שקר',
    question: 'שקר בעדות הוא עבירת תוצאה.',
    correctAnswer: 'false',
    explanation: 'שקר בעדות הוא עבירת התנהגות. העבירה מתרחשת ברגע אמירת השקר, ללא צורך בתוצאה נוספת.',
    lawReference: 'סעיף 241 לחוק העונשין'
  },

  // שאלות מתקדמות ומשולבות
  {
    id: 17,
    type: 'case-study',
    difficulty: 'קשה מאוד',
    icon: '💊',
    category: 'ניתוח מתקדם',
    question: 'רופא ניצל מחדל רפואי בכוונה לפגוע בחולה. מה היסוד הנפשי?',
    options: [
      { id: 'a', text: 'רשלנות מקצועית' },
      { id: 'b', text: 'מחשבה פלילית' },
      { id: 'c', text: 'פזיזות' },
      { id: 'd', text: 'אחריות קפידה' }
    ],
    correctAnswer: 'b',
    explanation: 'ניצול מחדל רפואי בכוונה לפגוע הוא התרשלות מכוונת. המעשה נעשה מתוך מודעות מלאה למטרות ולתוצאה = מחשבה פלילית.',
    lawReference: 'דיני עונשין - התרשלות מכוונת'
  },
  {
    id: 18,
    type: 'case-study',
    difficulty: 'קשה מאוד',
    icon: '📄',
    category: 'ניתוח מתקדם',
    question: 'הסרת מסמכים שגרמה לנזק פיננסי. איזה סוג עבירה?',
    options: [
      { id: 'a', text: 'עבירת התנהגות בלבד' },
      { id: 'b', text: 'מרמה עם עבירת תוצאה' },
      { id: 'c', text: 'עבירת נסיבות' },
      { id: 'd', text: 'תלוי בגובה הנזק' }
    ],
    correctAnswer: 'b',
    explanation: 'הסרת מסמכים = התנהגות פלילית. הנזק הפיננסי = תוצאה. זוהי מרמה עם עבירת תוצאה, הדורשת מודעות לסיכון (פזיזות).',
    lawReference: 'סעיפים 415-418 לחוק העונשין'
  },
  {
    id: 19,
    type: 'case-study',
    difficulty: 'קשה מאוד',
    icon: '📈',
    category: 'ניתוח מתקדם',
    question: 'שכנוע לרכוש מניות על בסיס מידע כוזב. מה היסוד הנפשי?',
    options: [
      { id: 'a', text: 'מחשבה פלילית' },
      { id: 'b', text: 'פזיזות' },
      { id: 'c', text: 'רשלנות' },
      { id: 'd', text: 'כוונה מיוחדת' }
    ],
    correctAnswer: 'b',
    explanation: 'שכנוע על בסיס מידע כוזב הוא עבירת תוצאה (נזק לשוק ההון). לא נדרש רצון להשיג תוצאה מדויקת, אלא מודעות לסיכון - פזיזות מספקת.',
    lawReference: 'סעיף 54 לחוק העונשין'
  },

  // שאלות נוספות 16-30
  {
    id: 16,
    type: 'multiple-choice',
    difficulty: 'בינוני',
    icon: '🌳',
    category: 'עבירות תוצאה',
    question: 'אדם חותך ברגלי עץ ומאוחר יותר העץ נופל ופוגע בבניין. מהו סוג העבירה?',
    options: [
      { id: 'a', text: 'התנהגות בלבד' },
      { id: 'b', text: 'תוצאה בלבד' },
      { id: 'c', text: 'נסיבות בלבד' },
      { id: 'd', text: 'עבירת התנהגות עם תוצאה' }
    ],
    correctAnswer: 'd',
    explanation: 'החיתוך ברגלי העץ הוא ההתנהגות, הנזק לבניין הוא התוצאה. זוהי עבירת תוצאה המצריכה הן התנהגות והן תוצאה.',
    lawReference: 'סעיפים עבירות נזיקין'
  },
  {
    id: 17,
    type: 'multiple-choice',
    difficulty: 'בינוני',
    icon: '🔢',
    category: 'ריבוב',
    question: 'מה ההבדל בין ריבוב משפטי לריבוב עובדתי?',
    options: [
      { id: 'a', text: 'משפטי – התנהגות זהה; עובדתי – תוצאה זהה' },
      { id: 'b', text: 'משפטי – תוצאה זהה; עובדתי – התנהגות זהה' },
      { id: 'c', text: 'משפטי – התנהגות זהה; עובדתי – פגיעות שונות נחשבות לעבירה נפרדת' },
      { id: 'd', text: 'אין הבדל' }
    ],
    correctAnswer: 'c',
    explanation: 'ריבוב משפטי: אותה התנהגות יכולה להיכלל במספר הגדרות עבירה. ריבוב עובדתי: התנהגות שפוגעת בכמה קורבנות נחשבת לעבירות נפרדות.',
    lawReference: 'עקרונות הריבוב'
  },
  {
    id: 18,
    type: 'multiple-choice',
    difficulty: 'קשה',
    icon: '☠️',
    category: 'יסוד נפשי',
    question: 'מקרה שבו אדם מפזר חומרים רעילים ומאוחר יותר מתים 3 אנשים. יסוד נפשי?',
    options: [
      { id: 'a', text: 'מחשבה פלילית' },
      { id: 'b', text: 'פזיזות' },
      { id: 'c', text: 'רשלנות' },
      { id: 'd', text: 'אחריות קפידה' }
    ],
    correctAnswer: 'b',
    explanation: 'הפצת חומרים רעילים מעידה על מודעות לסיכון חמור עם אדישות לתוצאות - זוהי פזיזות (מודעות + אדישות או קלות דעת).',
    lawReference: 'דיני עונשין - פזיזות'
  },
  {
    id: 19,
    type: 'multiple-choice',
    difficulty: 'בינוני',
    icon: '🧠',
    category: 'מודעות',
    question: 'כיצד מגדירים "מודעות לנסיבות"?',
    options: [
      { id: 'a', text: 'לדעת שהתוצאה תתרחש' },
      { id: 'b', text: 'לדעת את הנתונים העובדתיים סביב המעשה' },
      { id: 'c', text: 'להבין את הענישה הצפויה' },
      { id: 'd', text: 'להבין את המניע הרגשי של האדם' }
    ],
    correctAnswer: 'b',
    explanation: 'מודעות לנסיבות פירושה ידיעת הנתונים העובדתיים והמצב הקונקרטי שבו מבוצע המעשה - לא תחזית לעתיד או הבנת מניעים.',
    lawReference: 'דיני עונשין - מודעות'
  },
  {
    id: 20,
    type: 'multiple-choice',
    difficulty: 'בינוני',
    icon: '💰',
    category: 'סוגי עבירות',
    question: 'אדם מבצע עבירת ניירות ערך, אך אין תוצאה מוחשית. מהו סוג העבירה?',
    options: [
      { id: 'a', text: 'עבירה תוצאתית' },
      { id: 'b', text: 'עבירת התנהגות' },
      { id: 'c', text: 'ריבוב משפטי' },
      { id: 'd', text: 'עבירה עם כוונה מיוחדת' }
    ],
    correctAnswer: 'b',
    explanation: 'עבירות ניירות ערך רבות הן עבירות התנהגות - העבירה מתרחשת ברגע ביצוע המעשה האסור, ללא צורך בתוצאה מוחשית.',
    lawReference: 'חוק ניירות ערך'
  },
  {
    id: 21,
    type: 'multiple-choice',
    difficulty: 'קל',
    icon: '⚖️',
    category: 'עקרונות יסוד',
    question: 'מהו העיקרון של חזקת החפות?',
    options: [
      { id: 'a', text: 'אדם חף מפשע עד שהוכח אחרת בספק סביר' },
      { id: 'b', text: 'אדם חייב להוכיח חפותו' },
      { id: 'c', text: 'בית המשפט חייב להניח שהנאשם אשם' },
      { id: 'd', text: 'כל אדם נחשב אשם' }
    ],
    correctAnswer: 'a',
    explanation: 'חזקת החפות היא עיקרון יסוד: אדם נחשב חף מפשע עד שהוכחה אשמתו מעבר לכל ספק סביר. נטל ההוכחה על התביעה.',
    lawReference: 'עקרון חזקת החפות'
  },
  {
    id: 22,
    type: 'multiple-choice',
    difficulty: 'קשה',
    icon: '🩺',
    category: 'רשלנות רפואית',
    question: 'אם אדם חותך אדם ברגל במרפאה ומוותו מתרחש בשל חוסר מקצועיות, יסוד נפשי?',
    options: [
      { id: 'a', text: 'מחשבה פלילית' },
      { id: 'b', text: 'פזיזות' },
      { id: 'c', text: 'רשלנות' },
      { id: 'd', text: 'אחריות קפידה' }
    ],
    correctAnswer: 'c',
    explanation: 'רופא שגרם למוות עקב חוסר מקצועיות פעל ברשלנות - לא עמד בסטנדרט הנדרש מרופא סביר באותו מצב.',
    lawReference: 'סעיף 304 לחוק העונשין - רשלנות'
  },
  {
    id: 23,
    type: 'multiple-choice',
    difficulty: 'קל',
    icon: '📊',
    category: 'רמת הוכחה',
    question: 'רמת ההוכחה הנדרשת בעבירות פליליות:',
    options: [
      { id: 'a', text: 'מעל לכל ספק סביר' },
      { id: 'b', text: 'רוב ההסתברות' },
      { id: 'c', text: 'יותר מ-50%' },
      { id: 'd', text: 'נמוכה ממספיק' }
    ],
    correctAnswer: 'a',
    explanation: 'בעבירות פליליות נדרשת רמת הוכחה גבוהה: מעבר לכל ספק סביר. זו רמה גבוהה יותר מהדין האזרחי.',
    lawReference: 'עקרון חזקת החפות'
  },
  {
    id: 24,
    type: 'multiple-choice',
    difficulty: 'בינוני',
    icon: '📜',
    category: 'פרשנות חוק',
    question: 'ס\'90א: מילה "מזיד" ברוב העבירות הישנות מתייחסת ל:',
    options: [
      { id: 'a', text: 'כוונה' },
      { id: 'b', text: 'פזיזות' },
      { id: 'c', text: 'רשלנות' },
      { id: 'd', text: 'אי כוונה' }
    ],
    correctAnswer: 'a',
    explanation: 'המילה "מזיד" בחקיקה ישנה מתייחסת לכוונה - רצון שהתוצאה תתרחש, לא רק מודעות לסיכון.',
    lawReference: 'סעיף 90א לחוק העונשין'
  },
  {
    id: 25,
    type: 'multiple-choice',
    difficulty: 'בינוני',
    icon: '🎯',
    category: 'כוונה',
    question: 'מה מגדיר כוונה רגילה בעבירות תוצאתיות?',
    options: [
      { id: 'a', text: 'רצון שהתוצאה תקרה' },
      { id: 'b', text: 'אי רצון שהתוצאה תקרה' },
      { id: 'c', text: 'מניע רגשי' },
      { id: 'd', text: 'פזיזות' }
    ],
    correctAnswer: 'a',
    explanation: 'כוונה רגילה = רצון שהתוצאה תתרחש. זה שונה מכוונה מיוחדת שדורשת מטרה או מניע מעבר לתוצאה עצמה.',
    lawReference: 'דיני עונשין - כוונה'
  },
  {
    id: 26,
    type: 'multiple-choice',
    difficulty: 'קשה',
    icon: '🎯',
    category: 'כוונה מיוחדת',
    question: 'עבירת התנהגות עם כוונה מיוחדת – מה הכוונה?',
    options: [
      { id: 'a', text: 'גרימת תוצאה בלבד' },
      { id: 'b', text: 'פעולה למען מטרה או מניע' },
      { id: 'c', text: 'פגיעה מקרית' },
      { id: 'd', text: 'רשלנות' }
    ],
    correctAnswer: 'b',
    explanation: 'כוונה מיוחדת דורשת שהפעולה נעשתה למען מטרה מסוימת או מניע (כמו נקמה, רווח אישי) מעבר לתוצאה הישירה.',
    lawReference: 'דיני עונשין - כוונה מיוחדת'
  },
  {
    id: 27,
    type: 'multiple-choice',
    difficulty: 'בינוני',
    icon: '🪙',
    category: 'ריבוב עובדתי',
    question: 'ריבוב עובדתי: אדם גונב 5 מטבעות בנפרד. מהי הערכת העבירה?',
    options: [
      { id: 'a', text: 'עבירה אחת' },
      { id: 'b', text: '5 עבירות' },
      { id: 'c', text: 'תלוי בגובה הכסף' },
      { id: 'd', text: 'תלוי בכוונה' }
    ],
    correctAnswer: 'a',
    explanation: 'אם הגניבה התרחשה במהלך רציף אחד (אותה התנהגות), זו עבירה אחת. ריבוב עובדתי מתקיים רק אם המעשים נפרדים בזמן/מקום.',
    lawReference: 'עקרונות ריבוב עובדתי'
  },
  {
    id: 28,
    type: 'multiple-choice',
    difficulty: 'בינוני',
    icon: '🔫',
    category: 'ריבוב',
    question: 'אדם יורה ירייה אחת שפוגעת במספר אנשים. סוג הריבוב?',
    options: [
      { id: 'a', text: 'משפטי' },
      { id: 'b', text: 'עובדתי' },
      { id: 'c', text: 'תלוי במניע' },
      { id: 'd', text: 'אין ריבוב' }
    ],
    correctAnswer: 'a',
    explanation: 'ירייה אחת = התנהגות זהה. פגיעה במספר אנשים = ריבוב משפטי (אותה התנהגות, מספר עבירות של פגיעה).',
    lawReference: 'עקרונות הריבוב'
  },
  {
    id: 29,
    type: 'multiple-choice',
    difficulty: 'בינוני',
    icon: '💼',
    category: 'מידע פנים',
    question: 'מהו מרכיב ההתנהגות בס\'52ג לחוק ניירות ערך?',
    options: [
      { id: 'a', text: 'עושה שימוש במידע פנים' },
      { id: 'b', text: 'מידע פנימי המצוי בידו' },
      { id: 'c', text: 'תוצאה של שינוי מניות' },
      { id: 'd', text: 'כוונה' }
    ],
    correctAnswer: 'a',
    explanation: 'רכיב ההתנהגות הוא "עושה שימוש" במידע פנים. זוהי עבירת התנהגות שמתרחשת ברגע השימוש.',
    lawReference: 'סעיף 52ג לחוק ניירות ערך'
  },
  {
    id: 30,
    type: 'multiple-choice',
    difficulty: 'קשה',
    icon: '🧠',
    category: 'הבחנות במחשבה',
    question: 'מה ההבדל בין מחשבה פלילית לפזיזות?',
    options: [
      { id: 'a', text: 'מודעות + רצון לעומת מודעות + אדישות' },
      { id: 'b', text: 'מודעות לכל העובדות לעומת מודעות חלקית או אי מודעות' },
      { id: 'c', text: 'כוונה מיוחדת לעומת כוונה רגילה' },
      { id: 'd', text: 'אין הבדל' }
    ],
    correctAnswer: 'a',
    explanation: 'מחשבה פלילית = מודעות + רצון. פזיזות = מודעות + אדישות או קלות דעת. ההבדל הוא ביחס לתוצאה: רצון מול אדישות.',
    lawReference: 'דיני עונשין - יסוד נפשי'
  },
  {
    id: 31,
    type: 'case-study',
    difficulty: 'קשה מאוד',
    icon: '🎭',
    category: 'ניתוח מתקדם',
    question: 'אדם מציית מבנה מכעס, הבניין נשרף ואדם נפצע. איזה ריבוב מתקיים?',
    options: [
      { id: 'a', text: 'ריבוב משפטי - התנהגות זהה' },
      { id: 'b', text: 'ריבוב עובדתי - תוצאות שונות' },
      { id: 'c', text: 'יכול להיות שניהם' },
      { id: 'd', text: 'אין ריבוב' }
    ],
    correctAnswer: 'c',
    explanation: 'יש כאן מספר עבירות אפשריות: הצתה (כוונה למבנה), פגיעה באדם (פזיזות). יכול להיות ריבוב משפטי (אותה התנהגות, עבירות שונות) או עובדתי (תוצאות שונות לאנשים שונים).',
    lawReference: 'עקרונות הריבוב בדיני עונשין'
  }
];

const CriminalLawExam: React.FC = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [showResult, setShowResult] = useState(false);
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
  const [showFinalResults, setShowFinalResults] = useState(false);
  const [examStarted, setExamStarted] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(90 * 60); // 90 minutes

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  useEffect(() => {
    if (examStarted && timeRemaining > 0 && !showFinalResults) {
      const timer = setTimeout(() => setTimeRemaining(timeRemaining - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeRemaining === 0) {
      setShowFinalResults(true);
    }
  }, [examStarted, timeRemaining, showFinalResults]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswerSelect = (answerId: string) => {
    setSelectedAnswer(answerId);
  };

  const handleSubmitAnswer = () => {
    setUserAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: selectedAnswer
    }));
    setShowResult(true);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer('');
      setShowResult(false);
    } else {
      setShowFinalResults(true);
    }
  };

  const calculateResults = () => {
    const correctAnswers = questions.filter(q => userAnswers[q.id] === q.correctAnswer).length;
    const percentage = Math.round((correctAnswers / questions.length) * 100);
    return { correctAnswers, total: questions.length, percentage };
  };

  const getGradeColor = (percentage: number) => {
    if (percentage >= 90) return '#4caf50';
    if (percentage >= 80) return '#8bc34a';
    if (percentage >= 70) return '#ff9800';
    return '#f44336';
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'קל': return 'success';
      case 'בינוני': return 'info';
      case 'קשה': return 'warning';
      case 'קשה מאוד': return 'error';
      default: return 'default';
    }
  };

  if (!examStarted) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
          <Box textAlign="center" mb={4}>
            <LocalPolice sx={{ fontSize: 60, color: '#d32f2f', mb: 2 }} />
            <Typography variant="h3" component="h1" gutterBottom color="primary" fontWeight="bold">
              🚔 מבחן דיני עונשין
            </Typography>
            <Typography variant="h6" color="text.secondary" mb={3}>
              מבחן מקיף על יסודות עבירות פליליות, יסוד נפשי, ריבוב ומקרים מורכבים
            </Typography>
          </Box>

          <Box sx={{ backgroundColor: '#f5f7fa', p: 3, borderRadius: 2, mb: 4 }}>
            <Typography variant="h6" gutterBottom color="primary">
              📋 פרטי המבחן:
            </Typography>
            <List>
              <ListItem>
                <ListItemIcon><Info color="primary" /></ListItemIcon>
                <ListItemText primary="20 שאלות ברמות קושי שונות" />
              </ListItem>
              <ListItem>
                <ListItemIcon><Assignment color="primary" /></ListItemIcon>
                <ListItemText primary="נושאים: יסודות עבירה, יסוד נפשי, ריבוב, מקרים מורכבים" />
              </ListItem>
              <ListItem>
                <ListItemIcon><Security color="primary" /></ListItemIcon>
                <ListItemText primary="זמן: 90 דקות" />
              </ListItem>
              <ListItem>
                <ListItemIcon><CheckCircle color="primary" /></ListItemIcon>
                <ListItemText primary="הסברים מפורטים עם פסיקה ומקורות חוק" />
              </ListItem>
            </List>
          </Box>

          <Alert severity="error" sx={{ mb: 3 }}>
            <Typography variant="body1">
              <strong>💡 טיפ ללמידה:</strong> המבחן כולל מקרים אמיתיים כמו מקרה דמניוק ומקרים מורכבים מהפסיקה.
              זכרו: התנהגות + יסוד נפשי = עבירה פלילית. שימו לב להבחנה בין ריבוב משפטי לעובדתי.
            </Typography>
          </Alert>

          <Box textAlign="center">
            <Button
              variant="contained"
              size="large"
              onClick={() => setExamStarted(true)}
              sx={{
                px: 6,
                py: 2,
                fontSize: '1.2rem',
                borderRadius: 3,
                background: 'linear-gradient(45deg, #d32f2f 30%, #f44336 90%)'
              }}
            >
              🚀 התחל מבחן
            </Button>
          </Box>
        </Paper>
      </Container>
    );
  }

  if (showFinalResults) {
    const results = calculateResults();
    const gradeColor = getGradeColor(results.percentage);

    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
          <Box textAlign="center" mb={4}>
            <Typography variant="h3" component="h1" gutterBottom color="primary">
              🎉 סיום המבחן!
            </Typography>
            <Typography variant="h4" sx={{ color: gradeColor, fontWeight: 'bold', mb: 2 }}>
              {results.correctAnswers}/{results.total} ({results.percentage}%)
            </Typography>
            <Chip
              label={`זמן שנותר: ${formatTime(timeRemaining)}`}
              color={timeRemaining > 1800 ? 'success' : 'warning'}
              sx={{ fontSize: '1rem', py: 1 }}
            />
          </Box>

          <Alert 
            severity={results.percentage >= 70 ? 'success' : 'warning'} 
            sx={{ mb: 4, fontSize: '1.1rem' }}
          >
            {results.percentage >= 90 && '🏆 מעולה! שליטה מושלמת בדיני עונשין'}
            {results.percentage >= 80 && results.percentage < 90 && '⭐ טוב מאוד! ידע חזק בנושא'}
            {results.percentage >= 70 && results.percentage < 80 && '👍 טוב! עדיין יש מקום לשיפור'}
            {results.percentage < 70 && '📚 מומלץ לחזור על החומר ולתרגל נוסף'}
          </Alert>

          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" gutterBottom color="primary">
              📊 פירוט תוצאות לפי קטגוריות:
            </Typography>
            {[
              'יסודות עבירה',
              'סוגי עבירות',
              'יסוד נפשי',
              'ריבוב',
              'מקרה מורכב',
              'רמת הוכחה',
              'שותפות',
              'עדות שקר',
              'ניתוח מתקדם'
            ].map(category => {
              const categoryQuestions = questions.filter(q => q.category === category);
              const categoryCorrect = categoryQuestions.filter(q => userAnswers[q.id] === q.correctAnswer).length;
              const categoryPercentage = categoryQuestions.length > 0 ? Math.round((categoryCorrect / categoryQuestions.length) * 100) : 0;
              
              return (
                <Box key={category} sx={{ mb: 2 }}>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    {category}: {categoryCorrect}/{categoryQuestions.length} ({categoryPercentage}%)
                  </Typography>
                  <LinearProgress 
                    variant="determinate" 
                    value={categoryPercentage} 
                    sx={{ height: 8, borderRadius: 4 }}
                  />
                </Box>
              );
            })}
          </Box>

          <Typography variant="h6" gutterBottom color="primary">
            📚 נושאים מרכזיים שנבחנו:
          </Typography>
          <List>
            <ListItem>
              <ListItemIcon><LocalPolice color="primary" /></ListItemIcon>
              <ListItemText 
                primary="יסודות עבירות פליליות" 
                secondary="התנהגות, תוצאה, נסיבות - רכיבי עבירה חובה ואופציונליים" 
              />
            </ListItem>
            <ListItem>
              <ListItemIcon><Article color="primary" /></ListItemIcon>
              <ListItemText 
                primary="יסוד נפשי" 
                secondary="מחשבה פלילית, פזיזות, רשלנות, כוונה רגילה ומיוחדת" 
              />
            </ListItem>
            <ListItem>
              <ListItemIcon><Assignment color="primary" /></ListItemIcon>
              <ListItemText 
                primary="ריבוב משפטי ועובדתי" 
                secondary="מקרה דמניוק, ירי בצרור, התנהגות זהה מול תוצאות נפרדות" 
              />
            </ListItem>
            <ListItem>
              <ListItemIcon><Balance color="primary" /></ListItemIcon>
              <ListItemText 
                primary="מקרים מורכבים" 
                secondary="רשלנות רפואית, מרמה, הצתה, שימוש במידע פנים" 
              />
            </ListItem>
          </List>
        </Paper>
      </Container>
    );
  }

  const isCorrect = showResult && selectedAnswer === currentQuestion.correctAnswer;
  const isWrong = showResult && selectedAnswer !== currentQuestion.correctAnswer;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
        {/* Header with progress */}
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h5" color="primary" fontWeight="bold">
              שאלה {currentQuestionIndex + 1} מתוך {questions.length}
            </Typography>
            <Chip
              label={`⏰ ${formatTime(timeRemaining)}`}
              color={timeRemaining > 1800 ? 'success' : timeRemaining > 600 ? 'warning' : 'error'}
              sx={{ fontSize: '1rem' }}
            />
          </Box>
          <LinearProgress variant="determinate" value={progress} sx={{ height: 8, borderRadius: 4 }} />
        </Box>

        {/* Question card */}
        <Card sx={{ mb: 4, border: `2px solid ${isCorrect ? '#4caf50' : isWrong ? '#f44336' : '#e0e0e0'}` }}>
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Typography variant="h4" sx={{ mr: 2 }}>
                {currentQuestion.icon}
              </Typography>
              <Box>
                <Chip
                  label={currentQuestion.difficulty}
                  color={getDifficultyColor(currentQuestion.difficulty)}
                  size="small"
                  sx={{ mr: 1 }}
                />
                <Chip
                  label={currentQuestion.category}
                  variant="outlined"
                  size="small"
                />
              </Box>
            </Box>

            <Typography variant="h6" sx={{ mb: 3, lineHeight: 1.6 }}>
              {currentQuestion.question}
            </Typography>

            {currentQuestion.type === 'multiple-choice' && currentQuestion.options && (
              <FormControl component="fieldset" sx={{ width: '100%' }}>
                <RadioGroup
                  value={selectedAnswer}
                  onChange={(e) => handleAnswerSelect(e.target.value)}
                >
                  {currentQuestion.options.map((option) => (
                    <FormControlLabel
                      key={option.id}
                      value={option.id}
                      control={<Radio />}
                      label={option.text}
                      sx={{
                        mb: 1,
                        p: 2,
                        border: '1px solid #e0e0e0',
                        borderRadius: 2,
                        '&:hover': { backgroundColor: '#f5f5f5' },
                        ...(showResult && option.id === currentQuestion.correctAnswer && {
                          backgroundColor: '#e8f5e8',
                          borderColor: '#4caf50'
                        }),
                        ...(showResult && option.id === selectedAnswer && option.id !== currentQuestion.correctAnswer && {
                          backgroundColor: '#ffebee',
                          borderColor: '#f44336'
                        })
                      }}
                    />
                  ))}
                </RadioGroup>
              </FormControl>
            )}

            {currentQuestion.type === 'true-false' && (
              <FormControl component="fieldset" sx={{ width: '100%' }}>
                <RadioGroup
                  value={selectedAnswer}
                  onChange={(e) => handleAnswerSelect(e.target.value)}
                >
                  <FormControlLabel
                    value="true"
                    control={<Radio />}
                    label="✅ נכון"
                    sx={{ mb: 2, p: 2, border: '1px solid #e0e0e0', borderRadius: 2 }}
                  />
                  <FormControlLabel
                    value="false"
                    control={<Radio />}
                    label="❌ לא נכון"
                    sx={{ p: 2, border: '1px solid #e0e0e0', borderRadius: 2 }}
                  />
                </RadioGroup>
              </FormControl>
            )}
          </CardContent>
        </Card>

        {/* Result section */}
        {showResult && (
          <Alert
            severity={isCorrect ? 'success' : 'error'}
            icon={isCorrect ? <CheckCircle /> : <Cancel />}
            sx={{ mb: 3 }}
          >
            <Typography variant="h6" gutterBottom>
              {isCorrect ? '🎉 תשובה נכונה!' : '❌ תשובה שגויה'}
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              <strong>הסבר:</strong> {currentQuestion.explanation}
            </Typography>
            {currentQuestion.precedent && (
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>📋 פסיקה:</strong> {currentQuestion.precedent}
              </Typography>
            )}
            {currentQuestion.lawReference && (
              <Typography variant="body2">
                <strong>📜 מקור חוקי:</strong> {currentQuestion.lawReference}
              </Typography>
            )}
          </Alert>
        )}

        {/* Action buttons */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            קטגוריה: {currentQuestion.category} | רמה: {currentQuestion.difficulty}
          </Typography>
          
          <Box>
            {!showResult ? (
              <Button
                variant="contained"
                onClick={handleSubmitAnswer}
                disabled={!selectedAnswer}
                sx={{ px: 4, py: 1.5 }}
              >
                שלח תשובה
              </Button>
            ) : (
              <Button
                variant="contained"
                onClick={handleNextQuestion}
                sx={{ px: 4, py: 1.5 }}
              >
                {currentQuestionIndex < questions.length - 1 ? 'שאלה הבאה' : 'סיים מבחן'}
              </Button>
            )}
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default CriminalLawExam;

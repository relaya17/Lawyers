import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  RadioGroup,
  FormControlLabel,
  Radio,
  Button,
  Paper,
  Chip,
  Alert,
  LinearProgress,
  Grid,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  TextField,
  List,
  ListItem,
  ListItemText,
  Avatar
} from '@mui/material';
import {
  ExpandMore,
  CheckCircle,
  Cancel,
  Lightbulb,
  Gavel,
  Quiz,
  AccountBalance
} from '@mui/icons-material';

interface Question {
  id: string;
  type: 'multiple-choice' | 'true-false' | 'case-analysis';
  section: string;
  difficulty: 'medium' | 'hard';
  question: string;
  options?: string[];
  correctAnswer: string;
  explanation: string;
  emphasis?: string;
  legalPrinciples?: string[];
  emoji?: string;
}

const multipleChoiceQuestions: Question[] = [
  {
    id: 'mc1',
    type: 'multiple-choice',
    section: 'רב-ברירה',
    difficulty: 'medium',
    question: 'מי מוסמך לאשר תקנות שעת חירום? ⚖️',
    options: ['א. הכנסת', 'ב. הממשלה', 'ג. נשיא המדינה', 'ד. בג"ץ'],
    correctAnswer: 'ב. הממשלה',
    explanation: 'הממשלה מוסמכת לאשר תקנות שעת חירום מכוח חוק יסוד: הממשלה וחוק סמכויות שעת חירום.',
    legalPrinciples: ['סמכויות חירום', 'הרשות המבצעת', 'חקיקת משנה'],
    emoji: '⚖️'
  },
  {
    id: 'mc2',
    type: 'multiple-choice',
    section: 'רב-ברירה',
    difficulty: 'medium',
    question: 'עקרון חוקיות המנהל קובע כי: ⚖️',
    options: [
      'א. הרשות המבצעת אינה רשאית לפעול בכל עת',
      'ב. הרשות המבצעת רשאית לפעול רק מכוח חוק',
      'ג. הרשות המבצעת רשאית לפרש חוקים כרצונה',
      'ד. הרשות המבצעת עליונה על החקיקה'
    ],
    correctAnswer: 'ב. הרשות המבצעת רשאית לפעול רק מכוח חוק',
    explanation: 'עקרון חוקיות המנהל הוא עקרון יסוד הקובע שהרשות המבצעת יכולה לפעול רק במסגרת הסמכויות שניתנו לה בחוק.',
    legalPrinciples: ['חוקיות המנהל', 'פרדת רשויות', 'שלטון החוק'],
    emoji: '⚖️'
  },
  {
    id: 'mc3',
    type: 'multiple-choice',
    section: 'רב-ברירה',
    difficulty: 'hard',
    question: 'מהי "פרשנות מצמצמת"? ⚖️',
    options: [
      'א. פרשנות על פי לשון החוק בלבד',
      'ב. פרשנות שמרחיבה את החוק',
      'ג. פרשנות שמצמצמת את תחולתו',
      'ד. פרשנות על פי כוונת הצדדים'
    ],
    correctAnswer: 'ג. פרשנות שמצמצמת את תחולתו',
    explanation: 'פרשנות מצמצמת היא גישת פרשנות שמבקשת לצמצם את תחולת החוק ולהגביל את היקפו.',
    legalPrinciples: ['פרשנות מצמצמת', 'גישות פרשנות', 'תחולת החוק'],
    emoji: '⚖️'
  },
  {
    id: 'mc4',
    type: 'multiple-choice',
    section: 'רב-ברירה',
    difficulty: 'medium',
    question: 'הנחיות היועץ המשפטי לממשלה: ⚖️',
    options: [
      'א. מחייבות את כל הרשויות',
      'ב. אינן מחייבות אלא המלצה',
      'ג. מחייבות את הכנסת',
      'ד. מחייבות את בתי המשפט'
    ],
    correctAnswer: 'א. מחייבות את כל הרשויות',
    explanation: 'הנחיות היועץ המשפטי לממשלה מחייבות את הרשות המבצעת ואת כל הרשויות הציבוריות.',
    legalPrinciples: ['יועץ משפטי לממשלה', 'הנחיות מחייבות', 'רשויות ציבוריות'],
    emoji: '⚖️'
  },
  {
    id: 'mc5',
    type: 'multiple-choice',
    section: 'רב-ברירה',
    difficulty: 'medium',
    question: 'עקרון פומביות הדיון מבטיח: ⚖️',
    options: [
      'א. שהצדדים יקבלו ייעוץ משפטי',
      'ב. שהציבור יכול לעקוב אחרי מערכת המשפט',
      'ג. שהדיון יתנהל בסודיות',
      'ד. שהיועץ המשפטי תמיד נוכח'
    ],
    correctAnswer: 'ב. שהציבור יכול לעקוב אחרי מערכת המשפט',
    explanation: 'עקרון פומביות הדיון מבטיח שדיונים בבתי המשפט יהיו פתוחים לציבור, כדי להבטיח שקיפות וביקורת ציבורית.',
    legalPrinciples: ['פומביות הדיון', 'שקיפות שיפוטית', 'ביקורת ציבורית'],
    emoji: '⚖️'
  },
  {
    id: 'mc6',
    type: 'multiple-choice',
    section: 'רב-ברירה',
    difficulty: 'medium',
    question: 'מקור סמכות החנינה של נשיא המדינה נמצא ב: ⚖️',
    options: [
      'א. חוק יסוד: הממשלה',
      'ב. חוק יסוד: נשיא המדינה',
      'ג. חוק יסוד: כבוד האדם וחירותו',
      'ד. פקודת סדר הדין הפלילי'
    ],
    correctAnswer: 'ב. חוק יסוד: נשיא המדינה',
    explanation: 'סמכות החנינה של נשיא המדינה מעוגנת בחוק יסוד: נשיא המדינה.',
    legalPrinciples: ['חנינה נשיאותית', 'חוק יסוד נשיא המדינה', 'סמכויות חוקתיות'],
    emoji: '⚖️'
  },
  {
    id: 'mc7',
    type: 'multiple-choice',
    section: 'רב-ברירה',
    difficulty: 'hard',
    question: 'מתי נבחרת פרשנות סובייקטיבית לחוק? ⚖️',
    options: [
      'א. כאשר החוק ברור ומוחלט',
      'ב. כאשר החוק אינו ברור או שיש סתירה',
      'ג. תמיד באופן אוטומטי',
      'ד. רק על פי דרישת היועץ המשפטי'
    ],
    correctAnswer: 'ב. כאשר החוק אינו ברור או שיש סתירה',
    explanation: 'פרשנות סובייקטיבית נבחרת כאשר לשון החוק אינה ברורה או כאשר יש סתירות, ואז פונים לכוונת המחוקק.',
    legalPrinciples: ['פרשנות סובייקטיבית', 'כוונת המחוקק', 'עמימות בחוק'],
    emoji: '⚖️'
  },
  {
    id: 'mc8',
    type: 'multiple-choice',
    section: 'רב-ברירה',
    difficulty: 'medium',
    question: 'פסיקה פלילית מחייבת: ⚖️',
    options: [
      'א. רק את בית המשפט שנתן אותה',
      'ב. את כל הערכאות הנמוכות יותר',
      'ג. את כלל הציבור',
      'ד. את הכנסת בחקיקה עתידית'
    ],
    correctAnswer: 'ב. את כל הערכאות הנמוכות יותר',
    explanation: 'פסיקה פלילית של ערכאה גבוהה מחייבת את כל הערכאות הנמוכות יותר על פי עקרון התקדים המחייב.',
    legalPrinciples: ['תקדים מחייב', 'היררכיה שיפוטית', 'פסיקה פלילית'],
    emoji: '⚖️'
  },
  {
    id: 'mc9',
    type: 'multiple-choice',
    section: 'רב-ברירה',
    difficulty: 'hard',
    question: 'איזו דוקטרינה מאפשרת לבית המשפט העליון לפסול חקיקה של הכנסת? ⚖️',
    options: [
      'א. עקרון הפומביות',
      'ב. ביקורת שיפוטית חוקתית',
      'ג. עקרון הסופיות',
      'ד. עקרון ההלכה הפסוקה'
    ],
    correctAnswer: 'ב. ביקורת שיפוטית חוקתית',
    explanation: 'דוקטרינת הביקורת השיפוטית החוקתית מאפשרת לבית המשפט העליון לבחון ולפסול חקיקה שסותרת חוקי יסוד.',
    legalPrinciples: ['ביקורת שיפוטית', 'ביקורת חוקתית', 'פסילת חקיקה'],
    emoji: '⚖️'
  },
  {
    id: 'mc10',
    type: 'multiple-choice',
    section: 'רב-ברירה',
    difficulty: 'medium',
    question: 'חוקי המנדט הבריטי בישראל כיום: ⚖️',
    options: [
      'א. כולם בוטלו',
      'ב. ממשיכים לחול אם לא בוטלו במפורש',
      'ג. חלים רק בבתי דין דתיים',
      'ד. בוטלו עם הקמת המדינה'
    ],
    correctAnswer: 'ב. ממשיכים לחול אם לא בוטלו במפורש',
    explanation: 'על פי פקודת סדרי השלטון והמשפט, חוקי המנדט ממשיכים לחול עד שיבוטלו או יוחלפו במפורש.',
    legalPrinciples: ['המשכיות משפטית', 'חוקי מנדט', 'פקודת סדרי השלטון'],
    emoji: '⚖️'
  },
  {
    id: 'mc11',
    type: 'multiple-choice',
    section: 'רב-ברירה',
    difficulty: 'hard',
    question: 'חוק יסוד עם פסקת הגבלה מאפשר: ⚖️',
    options: [
      'א. פסילה אוטומטית של חוקים סותרים',
      'ב. בחינה שיפוטית מותנית',
      'ג. ביטול תקנות ממשלה ללא פסיקה',
      'ד. חקיקה מחדש של הכנסת'
    ],
    correctAnswer: 'ב. בחינה שיפוטית מותנית',
    explanation: 'פסקת הגבלה מאפשרת ביקורת שיפוטית מותנית - בית המשפט יכול לבחון אם הפגיעה בזכות מוצדקת.',
    legalPrinciples: ['פסקת הגבלה', 'ביקורת שיפוטית מותנית', 'איזון זכויות'],
    emoji: '⚖️'
  },
  {
    id: 'mc12',
    type: 'multiple-choice',
    section: 'רב-ברירה',
    difficulty: 'hard',
    question: 'חוק יסוד ללא פסקת הגבלה מאפשר: ⚖️',
    options: [
      'א. פסיקה רגילה של בג"ץ בזהירות',
      'ב. פסילה אוטומטית של חוקים סותרים',
      'ג. ביטול מנהגי השוק',
      'ד. הרחבת סמכויות הכנסת'
    ],
    correctAnswer: 'א. פסיקה רגילה של בג"ץ בזהירות',
    explanation: 'חוק יסוד ללא פסקת הגבלה מחייב זהירות רבה יותר בביקורת שיפוטית.',
    legalPrinciples: ['ביקורת זהירה', 'חוק יסוד ללא פסקת הגבלה', 'איפוק שיפוטי'],
    emoji: '⚖️'
  },
  {
    id: 'mc13',
    type: 'multiple-choice',
    section: 'רב-ברירה',
    difficulty: 'medium',
    question: 'עקרון עליונות חוקי היסוד קובע: ⚖️',
    options: [
      'א. חוקים רגילים תמיד גוברים',
      'ב. חוקים רגילים כפופים לחוקי יסוד',
      'ג. חוקים רגילים ותיקונים מחייבים את בג"ץ',
      'ד. חוקים רגילים אינם ניתנים לפרשנות'
    ],
    correctAnswer: 'ב. חוקים רגילים כפופים לחוקי יסוד',
    explanation: 'עקרון עליונות חוקי היסוד קובע היררכיה נורמטיבית שבה חוקי היסוד עליונים לחוקים רגילים.',
    legalPrinciples: ['עליונות חוקי יסוד', 'היררכיה נורמטיבית', 'חוקה מהותית'],
    emoji: '⚖️'
  },
  {
    id: 'mc14',
    type: 'multiple-choice',
    section: 'רב-ברירה',
    difficulty: 'medium',
    question: 'מי יכול לפסול תקנה הסותרת חוק יסוד? ⚖️',
    options: ['א. הכנסת', 'ב. בג"ץ', 'ג. היועץ המשפטי', 'ד. שר המשפטים'],
    correctAnswer: 'ב. בג"ץ',
    explanation: 'בג"ץ הוא הגוף המוסמך לפסול תקנות הסותרות חוקי יסוד במסגרת הביקורת השיפוטית.',
    legalPrinciples: ['ביקורת שיפוטית', 'פסילת תקנות', 'בג"ץ'],
    emoji: '⚖️'
  },
  {
    id: 'mc15',
    type: 'multiple-choice',
    section: 'רב-ברירה',
    difficulty: 'medium',
    question: 'מתי נוהג עסקי מחייב בבית המשפט? ⚖️',
    options: [
      'א. תמיד',
      'ב. רק אם אין חקיקה סותרת',
      'ג. רק בחקיקה אזרחית',
      'ד. אף פעם'
    ],
    correctAnswer: 'ב. רק אם אין חקיקה סותרת',
    explanation: 'נוהג עסקי מחייב רק כאשר אין חקיקה הסותרת אותו ובתנאי שהוא עומד בקריטריונים הנדרשים.',
    legalPrinciples: ['נוהג עסקי', 'מקורות המשפט', 'עדיפות החקיקה'],
    emoji: '⚖️'
  },
  {
    id: 'mc16',
    type: 'multiple-choice',
    section: 'רב-ברירה',
    difficulty: 'hard',
    question: 'מהו המשפט הדינמי? ⚖️',
    options: [
      'א. פרשנות החוק בהתאם ללשון בלבד',
      'ב. פרשנות החוק בהתאם לצרכים עכשוויים',
      'ג. פרשנות נוקשה של החוק',
      'ד. פסיקה על בסיס משפט מקובל בלבד'
    ],
    correctAnswer: 'ב. פרשנות החוק בהתאם לצרכים עכשוויים',
    explanation: 'משפט דינמי הוא גישה המאפשרת פרשנות החוק בהתאם לשינויים חברתיים וצרכים עכשוויים.',
    legalPrinciples: ['פרשנות דינמית', 'התפתחות משפטית', 'הסתגלות לשינויים'],
    emoji: '⚖️'
  },
  {
    id: 'mc17',
    type: 'multiple-choice',
    section: 'רב-ברירה',
    difficulty: 'medium',
    question: 'משפט קודיפיקציה הוא: ⚖️',
    options: [
      'א. מערכת חוקים אחידה ומסודרת',
      'ב. פסיקה על פי הנחיות היועץ המשפטי',
      'ג. חקיקה על פי מנהגים בלבד',
      'ד. חוקי יסוד בלבד'
    ],
    correctAnswer: 'א. מערכת חוקים אחידה ומסודרת',
    explanation: 'קודיפיקציה היא תהליך של ארגון וסידור החוקים במערכת אחידה ומסודרת.',
    legalPrinciples: ['קודיפיקציה', 'סידור חוקים', 'מערכת משפטית מסודרת'],
    emoji: '⚖️'
  },
  {
    id: 'mc18',
    type: 'multiple-choice',
    section: 'רב-ברירה',
    difficulty: 'hard',
    question: 'עקרון השוויון מול הרשות הציבורית מחייב: ⚖️',
    options: [
      'א. עמידה בכל דרישת האזרח',
      'ב. בחינה מדורגת על פי עקרון הסובסידיאריות',
      'ג. מתן החלטות באופן שרירותי',
      'ד. התערבות שיפוטית מלאה'
    ],
    correctAnswer: 'ב. בחינה מדורגת על פי עקרון הסובסידיאריות',
    explanation: 'עקרון השוויון מחייב יחס שווה במצבים דומים ובחינה מדורגת של החלטות הרשות.',
    legalPrinciples: ['עקרון השוויון', 'סובסידיאריות', 'יחס שווה'],
    emoji: '⚖️'
  },
  {
    id: 'mc19',
    type: 'multiple-choice',
    section: 'רב-ברירה',
    difficulty: 'hard',
    question: 'מתי מתערב בג"ץ בחוק רגיל? ⚖️',
    options: [
      'א. תמיד',
      'ב. כאשר החוק סותר עקרונות יסוד',
      'ג. לעולם לא',
      'ד. רק אם הכנסת מבקשת'
    ],
    correctAnswer: 'ב. כאשר החוק סותר עקרונות יסוד',
    explanation: 'בג"ץ מתערב בחוק רגיל כאשר הוא סותר חוקי יסוד או עקרונות יסוד של המשפט.',
    legalPrinciples: ['ביקורת חוקתית', 'עקרונות יסוד', 'התערבות שיפוטית'],
    emoji: '⚖️'
  },
  {
    id: 'mc20',
    type: 'multiple-choice',
    section: 'רב-ברירה',
    difficulty: 'medium',
    question: 'מהו תפקידו המרכזי של בג"ץ? ⚖️',
    options: [
      'א. לדון בתיקים פליליים',
      'ב. לפסול חוקים ללא בדיקה',
      'ג. לשמוע עתירות נגד רשויות המדינה',
      'ד. לחקור פרקליטים'
    ],
    correctAnswer: 'ג. לשמוע עתירות נגד רשויות המדינה',
    explanation: 'התפקיד המרכזי של בג"ץ הוא ביקורת על פעולות הרשויות הציבוריות והגנה על זכויות הפרט.',
    legalPrinciples: ['בג"ץ', 'ביקורת על רשויות', 'הגנת זכויות'],
    emoji: '⚖️'
  }
];

const trueFalseQuestions: Question[] = [
  {
    id: 'tf1',
    type: 'true-false',
    section: 'נכון/לא נכון',
    difficulty: 'medium',
    question: 'כל חקיקה ראשית בישראל מחייבת את הרשות המבצעת לפעול באופן מיידי. 🔹',
    correctAnswer: 'שקר',
    explanation: 'הרשות המבצעת מחויבת לפעול על פי החוק, אך לעתים החקיקה כוללת תקנות משנה או הוראות יישום, והחובה אינה תמיד מיידית.',
    legalPrinciples: ['יישום חקיקה', 'הרשות המבצעת'],
    emoji: '🔹'
  },
  {
    id: 'tf1a',
    type: 'true-false',
    section: 'נכון/לא נכון',
    difficulty: 'medium',
    question: 'בג"ץ מוסמך לפסול חקיקה רגילה הסותרת חוקי יסוד. 🔹',
    correctAnswer: 'נכון',
    explanation: 'עקרון עליונות חוקי היסוד מאפשר לבית המשפט העליון לפסול חוקים רגילים הסותרים אותם.',
    legalPrinciples: ['ביקורת שיפוטית', 'עליונות חוקי יסוד'],
    emoji: '🔹'
  },
  {
    id: 'tf1b',
    type: 'true-false',
    section: 'נכון/לא נכון',
    difficulty: 'medium',
    question: 'פסיקה מחייבת רק את הצדדים המעורבים בתיק. 🔹',
    correctAnswer: 'שקר',
    explanation: 'פסיקה של ערכאות גבוהות מחייבת גם ערכאות נמוכות יותר, למשל פסיקת מחוזי מחייבת שלום.',
    legalPrinciples: ['תקדים מחייב', 'היררכיה שיפוטית'],
    emoji: '🔹'
  },
  {
    id: 'tf1c',
    type: 'true-false',
    section: 'נכון/לא נכון',
    difficulty: 'hard',
    question: 'פרשנות על פי לשון החוק תמיד עדיפה על פרשנות תכליתית. 🔹',
    correctAnswer: 'שקר',
    explanation: 'פרשנות תכליתית נועדה להשלים את לשון החוק כאשר יש צורך בפרשנות על פי מטרת המחוקק או תנאים חדשים.',
    legalPrinciples: ['פרשנות תכליתית', 'פרשנות לשונית'],
    emoji: '🔹'
  },
  {
    id: 'tf1d',
    type: 'true-false',
    section: 'נכון/לא נכון',
    difficulty: 'medium',
    question: 'הנחיות היועץ המשפטי הן תמיד מקורות משפטיים מחייבים. 🔹',
    correctAnswer: 'שקר',
    explanation: 'ההנחיות מחייבות את הרשויות המבצעות, אך אינן חקיקה ולכן אינן מחייבות את בתי המשפט.',
    legalPrinciples: ['יועץ משפטי לממשלה', 'מקורות משפט'],
    emoji: '🔹'
  },
  {
    id: 'tf2',
    type: 'true-false',
    section: 'נכון/לא נכון',
    difficulty: 'medium',
    question: 'המשפט העות\'מאני השפיע על המשפט האזרחי והמנהלי בישראל גם לאחר קום המדינה. 🔹',
    correctAnswer: 'נכון',
    explanation: 'חוקים מסוימים מהמג\'לה והחוק העות\'מאני נותרו בתוקף עד לביטולם או החלפתם בחקיקה מודרנית.',
    legalPrinciples: ['המשכיות משפטית', 'משפט עות\'מאני'],
    emoji: '🔹'
  },
  {
    id: 'tf3',
    type: 'true-false',
    section: 'נכון/לא נכון',
    difficulty: 'medium',
    question: 'משפט בינלאומי אינו נלקח בחשבון במערכת המשפטית הישראלית. 🔹',
    correctAnswer: 'שקר',
    explanation: 'ישראל מאמצת חלק מהמשפט הבינלאומי כחלק מהחקיקה או בפסיקה כאשר אין חוק פנימי מספק.',
    legalPrinciples: ['משפט בינלאומי', 'אימוץ פנימי'],
    emoji: '🔹'
  },
  {
    id: 'tf4',
    type: 'true-false',
    section: 'נכון/לא נכון',
    difficulty: 'hard',
    question: 'פסיקה אקטיביסטית מחייבת את הכנסת לשנות חקיקה בהתאם. 🔹',
    correctAnswer: 'שקר',
    explanation: 'בג"ץ יכול להורות על ביטול או כוונה, אך אינו מחייב חקיקה חדשה - הכנסת רשאית לפעול על פי שיקול דעתה.',
    legalPrinciples: ['אקטיביזם שיפוטי', 'פרדת רשויות'],
    emoji: '🔹'
  },
  {
    id: 'tf5',
    type: 'true-false',
    section: 'נכון/לא נכון',
    difficulty: 'medium',
    question: 'חוקי יסוד יכולים לשמש כ"על-חוקים" בישראל. 🔹',
    correctAnswer: 'נכון',
    explanation: 'חוקי יסוד מסוימים (כגון חוק יסוד: כבוד האדם וחירותו) מחזיקים במעמד על-חוקי ומאפשרים פסילת חוקים רגילים.',
    legalPrinciples: ['על-חוקיות', 'חוקי יסוד'],
    emoji: '🔹'
  },
  {
    id: 'tf6',
    type: 'true-false',
    section: 'נכון/לא נכון',
    difficulty: 'medium',
    question: 'המשפט הישראלי הוא מערכת הומוגנית המבוססת על מקור משפטי יחיד. 🔹',
    correctAnswer: 'שקר',
    explanation: 'המשפט הישראלי הוא היברידי, משלב משפט מקובל, משפט קונטיננטלי, משפט עברי ומנהגים.',
    legalPrinciples: ['שיטה היברידית', 'מקורות מעורבים'],
    emoji: '🔹'
  },
  {
    id: 'tf2',
    type: 'true-false',
    section: 'נכון/לא נכון',
    difficulty: 'medium',
    question: '"המהפכה החוקתית" בישראל התרחשה כתוצאה מחקיקת חוקה פורמלית. 🔹',
    correctAnswer: 'לא נכון',
    explanation: 'חוקה פורמלית מלאה לא קיימת; המהפכה החוקתית התרחשה עם חקיקת חוקי יסוד שהעניקו מעמד על-חוקי לזכויות האדם.',
    legalPrinciples: ['המהפכה החוקתית', 'חוקי יסוד', 'חוקה מהותית'],
    emoji: '🔹'
  },
  {
    id: 'tf3',
    type: 'true-false',
    section: 'נכון/לא נכון',
    difficulty: 'medium',
    question: 'כל התקנות שהממשלה מתקינה תקפות גם אם לא הוסמכו בחוק. 🔹',
    correctAnswer: 'לא נכון',
    explanation: 'תקנות חייבות להסתמך על סמכות חוקית, אחרת הן בטלות על פי עקרון חוקיות המנהל.',
    legalPrinciples: ['חוקיות המנהל', 'הסמכה לתקנות'],
    emoji: '🔹'
  },
  {
    id: 'tf4',
    type: 'true-false',
    section: 'נכון/לא נכון',
    difficulty: 'medium',
    question: 'פסיקה של בית משפט מחוזי מחייבת בית משפט שלום. 🔹',
    correctAnswer: 'נכון',
    explanation: 'בית משפט מחוזי הוא ערכאה גבוהה יותר מבית משפט שלום, ולכן פסיקותיו מחייבות את הערכאות הנמוכות יותר.',
    legalPrinciples: ['היררכיה שיפוטית', 'תקדים מחייב'],
    emoji: '🔹'
  },
  {
    id: 'tf5',
    type: 'true-false',
    section: 'נכון/לא נכון',
    difficulty: 'hard',
    question: 'פסק דין של בג"ץ יכול לשמש גם כתקדים במדינות אחרות. 🔹',
    correctAnswer: 'נכון',
    explanation: 'בג"ץ מפתח פסיקה חדשנית, ולעיתים פסקי דינו נלמדים ומנחים בתי משפט במדינות אחרות.',
    legalPrinciples: ['השפעה בינלאומית', 'משפט השוואתי'],
    emoji: '🔹'
  },
  {
    id: 'tf6',
    type: 'true-false',
    section: 'נכון/לא נכון',
    difficulty: 'medium',
    question: 'חוק יסודות המשפט מחייב שופטים לפנות למשפט העברי בכל מקרה. 🔹',
    correctAnswer: 'לא נכון',
    explanation: 'חוק יסודות המשפט או עקרונות יסוד אינם מחייבים פנייה תמידית למשפט העברי; שימוש במשפט העברי הוא מקור עזר.',
    legalPrinciples: ['חוק יסודות המשפט', 'מקורות עזר', 'משפט עברי'],
    emoji: '🔹'
  },
  {
    id: 'tf7',
    type: 'true-false',
    section: 'נכון/לא נכון',
    difficulty: 'hard',
    question: 'פרשנות תכליתית נועדה לגלות את אומד דעת המחוקק. 🔹',
    correctAnswer: 'נכון',
    explanation: 'הפרשנות התכליתית מאפשרת לשופט לפרש את החוק על פי מטרתו או כוונת המחוקק, ולא רק על פי לשון החוק.',
    legalPrinciples: ['פרשנות תכליתית', 'כוונת המחוקק'],
    emoji: '🔹'
  },
  {
    id: 'tf8',
    type: 'true-false',
    section: 'נכון/לא נכון',
    difficulty: 'hard',
    question: 'פסק דין קול העם ביסס בישראל את חופש הביטוי כמקור על-חוקי. 🔹',
    correctAnswer: 'נכון',
    explanation: 'פסק הדין הכיר בחשיבות חופש הביטוי וביסס אותו כערך על-חוקי שניתן להגן עליו גם מעבר לחקיקה רגילה.',
    legalPrinciples: ['חופש ביטוי', 'פסיקה חוקתית'],
    emoji: '🔹'
  },
  {
    id: 'tf9',
    type: 'true-false',
    section: 'נכון/לא נכון',
    difficulty: 'medium',
    question: 'משפט בינלאומי אינו מחייב בישראל באופן כללי. 🔹',
    correctAnswer: 'לא נכון',
    explanation: 'המשפט הבינלאומי מחייב את ישראל במידה שהוא אומץ כחוק פנימי או בהסכמים בינלאומיים שאושרו.',
    legalPrinciples: ['משפט בינלאומי', 'אימוץ פנימי'],
    emoji: '🔹'
  },
  {
    id: 'tf10',
    type: 'true-false',
    section: 'נכון/לא נכון',
    difficulty: 'medium',
    question: 'חקיקה ראשית עדיפה נורמטיבית על חקיקת משנה. 🔹',
    correctAnswer: 'נכון',
    explanation: 'חקיקה ראשית (חוקים שנחקקו על ידי הכנסת) עומדת מעל חוקי משנה ותקנות ומחייבת את הרשויות השונות.',
    legalPrinciples: ['היררכיה נורמטיבית', 'חקיקה ראשית'],
    emoji: '🔹'
  }
];

// Using the same case analysis questions from the previous exam
const caseAnalysisQuestions: Question[] = [
  {
    id: 'case1',
    type: 'case-analysis',
    section: 'ניתוח מקרים',
    difficulty: 'hard',
    question: 'רשות מפרסמת תקנה הסותרת חוק יסוד. מה דינה? ⚖️',
    correctAnswer: 'התקנה בטלה באופן אוטומטי על פי עיקרון עליונות חוקי היסוד. בית המשפט הגבוה לצדק מוסמך לפסול את התקנה.',
    explanation: 'התקנה בטלה באופן אוטומטי על פי עיקרון עליונות חוקי היסוד. בית המשפט הגבוה לצדק מוסמך לפסול את התקנה.',
    emphasis: 'חובת הרשות המבצעת לפעול על פי החוק.',
    legalPrinciples: ['עליונות חוקי היסוד', 'חוקיות המנהל', 'ביקורת שיפוטית'],
    emoji: '⚖️'
  }
  // ... כאן נוכל להוסיף עוד מקרי ניתוח
];

const allQuestions = [...multipleChoiceQuestions, ...trueFalseQuestions, ...caseAnalysisQuestions];

interface ExamResults {
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  sectionBreakdown: { [key: string]: { correct: number; total: number } };
}

export const ComprehensiveLegalSystemExam: React.FC = () => {
  const [currentSection, setCurrentSection] = useState<'intro' | 'exam' | 'results'>('intro');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<{ [key: string]: string }>({});
  const [showAnswers, setShowAnswers] = useState(false);

  const startExam = () => {
    setCurrentSection('exam');
    setCurrentQuestionIndex(0);
  };

  const handleAnswer = (questionId: string, answer: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < allQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      finishExam();
    }
  };

  const prevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const finishExam = () => {
    setCurrentSection('results');
  };

  const calculateResults = (): ExamResults => {
    let correctAnswers = 0;
    const sectionBreakdown: { [key: string]: { correct: number; total: number } } = {};

    allQuestions.forEach(question => {
      const userAnswer = answers[question.id];
      const isCorrect = userAnswer === question.correctAnswer;
      
      if (isCorrect) correctAnswers++;
      
      if (!sectionBreakdown[question.section]) {
        sectionBreakdown[question.section] = { correct: 0, total: 0 };
      }
      sectionBreakdown[question.section].total++;
      if (isCorrect) sectionBreakdown[question.section].correct++;
    });

    return {
      score: Math.round((correctAnswers / allQuestions.length) * 100),
      totalQuestions: allQuestions.length,
      correctAnswers,
      sectionBreakdown
    };
  };

  if (currentSection === 'intro') {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Card elevation={4}>
          <CardContent sx={{ p: 4 }}>
            <Box textAlign="center" mb={4}>
              <Avatar sx={{ bgcolor: '#1976d2', width: 80, height: 80, margin: 'auto', mb: 2 }}>
                <AccountBalance sx={{ fontSize: 40 }} />
              </Avatar>
              <Typography variant="h3" gutterBottom color="primary">
                🏛️ מבחן מערכת המשפט המקיף
              </Typography>
              <Typography variant="h6" color="text.secondary">
                מבחן מקיף על מערכת המשפט הישראלית
              </Typography>
            </Box>

            <Alert severity="info" sx={{ mb: 3 }}>
              <Typography variant="body1" gutterBottom>
                <strong>המבחן כולל:</strong>
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemText primary="📝 20 שאלות רב-ברירה על נושאים מרכזיים" />
                </ListItem>
                <ListItem>
                  <ListItemText primary="✅ 10 שאלות נכון/לא נכון עם נימוקים" />
                </ListItem>
                <ListItem>
                  <ListItemText primary="⚖️ מקרי ניתוח משפטיים מעשיים" />
                </ListItem>
                <ListItem>
                  <ListItemText primary="💡 הסברים מפורטים עם עקרונות משפטיים" />
                </ListItem>
              </List>
            </Alert>

            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item xs={12} sm={6} md={4}>
                <Paper elevation={2} sx={{ p: 3, textAlign: 'center' }}>
                  <Quiz sx={{ fontSize: 40, color: '#4caf50', mb: 1 }} />
                  <Typography variant="h5">20</Typography>
                  <Typography variant="body2">רב-ברירה</Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Paper elevation={2} sx={{ p: 3, textAlign: 'center' }}>
                  <CheckCircle sx={{ fontSize: 40, color: '#ff9800', mb: 1 }} />
                  <Typography variant="h5">10</Typography>
                  <Typography variant="body2">נכון/לא נכון</Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Paper elevation={2} sx={{ p: 3, textAlign: 'center' }}>
                  <Gavel sx={{ fontSize: 40, color: '#f44336', mb: 1 }} />
                  <Typography variant="h5">מקרים</Typography>
                  <Typography variant="body2">ניתוח משפטי</Typography>
                </Paper>
              </Grid>
            </Grid>

            <Alert severity="warning" sx={{ mb: 3 }}>
              <Typography variant="body1">
                <strong>נושאים עיקריים:</strong> עקרונות יסוד, ביקורת שיפוטית, מקורות המשפט, פרשנות, היררכיה נורמטיבית, חוקי יסוד, ועוד.
              </Typography>
            </Alert>

            <Box textAlign="center">
              <Button
                variant="contained"
                size="large"
                onClick={startExam}
                sx={{ 
                  minWidth: 200, 
                  py: 2,
                  fontSize: '1.2rem',
                  background: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)'
                }}
              >
                התחל מבחן
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Container>
    );
  }

  if (currentSection === 'results') {
    const results = calculateResults();
    
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Card elevation={4}>
          <CardContent sx={{ p: 4 }}>
            <Box textAlign="center" mb={4}>
              <Typography variant="h3" gutterBottom color="primary">
                🎉 תוצאות המבחן המקיף
              </Typography>
              <Typography variant="h4" color="success.main">
                {results.score}%
              </Typography>
              <Typography variant="h6" color="text.secondary">
                {results.correctAnswers} מתוך {results.totalQuestions} נכונות
              </Typography>
            </Box>

            <Grid container spacing={3} sx={{ mb: 4 }}>
              {Object.entries(results.sectionBreakdown).map(([section, stats]) => (
                <Grid item xs={12} md={4} key={section}>
                  <Paper elevation={1} sx={{ p: 2 }}>
                    <Typography variant="subtitle1" fontWeight="bold">
                      {section}
                    </Typography>
                    <LinearProgress 
                      variant="determinate" 
                      value={(stats.correct / stats.total) * 100}
                      sx={{ my: 1 }}
                    />
                    <Typography variant="body2">
                      {stats.correct} / {stats.total} ({Math.round((stats.correct / stats.total) * 100)}%)
                    </Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>

            <Box textAlign="center" sx={{ mb: 4 }}>
              <Button
                variant="contained"
                onClick={() => setShowAnswers(!showAnswers)}
                size="large"
                startIcon={<Lightbulb />}
              >
                {showAnswers ? 'הסתר תשובות' : 'הצג תשובות מפורטות'}
              </Button>
            </Box>

            {showAnswers && (
              <Box>
                <Typography variant="h5" gutterBottom color="primary">
                  📚 תשובות מפורטות והסברים
                </Typography>
                {allQuestions.map((question, index) => {
                  const userAnswer = answers[question.id];
                  const isCorrect = userAnswer === question.correctAnswer;
                  
                  return (
                    <Accordion key={question.id} sx={{ mb: 2 }}>
                      <AccordionSummary expandIcon={<ExpandMore />}>
                        <Box display="flex" alignItems="center" gap={2} width="100%">
                          {isCorrect ? (
                            <CheckCircle color="success" />
                          ) : (
                            <Cancel color="error" />
                          )}
                          <Typography variant="subtitle1" flex={1}>
                            שאלה {index + 1}: {question.question}
                          </Typography>
                          <Chip 
                            label={question.section}
                            size="small"
                            variant="outlined"
                          />
                        </Box>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Box>
                          {question.options && (
                            <Box mb={2}>
                              <Typography variant="subtitle2" gutterBottom>אפשרויות:</Typography>
                              {question.options.map(option => (
                                <Typography 
                                  key={option} 
                                  variant="body2"
                                  sx={{ 
                                    color: option === question.correctAnswer ? 'success.main' : 
                                           option === userAnswer ? 'error.main' : 'text.primary',
                                    fontWeight: option === question.correctAnswer ? 'bold' : 'normal',
                                    ml: 2
                                  }}
                                >
                                  {option}
                                </Typography>
                              ))}
                            </Box>
                          )}

                          {question.type === 'true-false' && (
                            <Box mb={2}>
                              <Typography variant="subtitle2" gutterBottom>אפשרויות:</Typography>
                              <Typography 
                                variant="body2"
                                sx={{ 
                                  color: 'נכון' === question.correctAnswer ? 'success.main' : 
                                         'נכון' === userAnswer ? 'error.main' : 'text.primary',
                                  fontWeight: 'נכון' === question.correctAnswer ? 'bold' : 'normal',
                                  ml: 2
                                }}
                              >
                                ✅ נכון
                              </Typography>
                              <Typography 
                                variant="body2"
                                sx={{ 
                                  color: 'לא נכון' === question.correctAnswer ? 'success.main' : 
                                         'לא נכון' === userAnswer ? 'error.main' : 'text.primary',
                                  fontWeight: 'לא נכון' === question.correctAnswer ? 'bold' : 'normal',
                                  ml: 2
                                }}
                              >
                                ❌ לא נכון
                              </Typography>
                            </Box>
                          )}

                          <Alert severity={isCorrect ? 'success' : 'error'} sx={{ mb: 2 }}>
                            <Typography variant="subtitle2">
                              תשובה נכונה: {question.correctAnswer}
                            </Typography>
                            {userAnswer && userAnswer !== question.correctAnswer && (
                              <Typography variant="body2">
                                התשובה שלך: {userAnswer}
                              </Typography>
                            )}
                          </Alert>

                          <Box mb={2}>
                            <Typography variant="subtitle2" gutterBottom color="primary">
                              💡 הסבר:
                            </Typography>
                            <Typography variant="body2" paragraph>
                              {question.explanation}
                            </Typography>
                          </Box>

                          {question.emphasis && (
                            <Box mb={2}>
                              <Typography variant="subtitle2" gutterBottom color="warning.main">
                                ✨ נקודת דגש:
                              </Typography>
                              <Typography variant="body2" paragraph>
                                {question.emphasis}
                              </Typography>
                            </Box>
                          )}

                          {question.legalPrinciples && question.legalPrinciples.length > 0 && (
                            <Box>
                              <Typography variant="subtitle2" gutterBottom color="secondary.main">
                                ⚖️ עקרונות משפטיים:
                              </Typography>
                              {question.legalPrinciples.map((principle, i) => (
                                <Chip 
                                  key={i} 
                                  label={principle} 
                                  size="small" 
                                  variant="outlined" 
                                  sx={{ mr: 1, mb: 1 }} 
                                />
                              ))}
                            </Box>
                          )}
                        </Box>
                      </AccordionDetails>
                    </Accordion>
                  );
                })}
              </Box>
            )}

            <Box textAlign="center" mt={4}>
              <Button
                variant="outlined"
                onClick={() => {
                  setCurrentSection('intro');
                  setCurrentQuestionIndex(0);
                  setAnswers({});
                  setShowAnswers(false);
                }}
                size="large"
              >
                התחל מבחן חדש
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Container>
    );
  }

  // Question view
  const currentQuestion = allQuestions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / allQuestions.length) * 100;

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Card elevation={4}>
        <CardContent sx={{ p: 4 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography variant="h6" color="primary">
              {currentQuestion.section}
            </Typography>
            <Chip 
              label={currentQuestion.type}
              size="small"
              variant="outlined"
            />
          </Box>

          <LinearProgress variant="determinate" value={progress} sx={{ mb: 3 }} />
          
          <Typography variant="body2" color="text.secondary" gutterBottom>
            שאלה {currentQuestionIndex + 1} מתוך {allQuestions.length}
          </Typography>

          <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
            {currentQuestion.question}
          </Typography>

          {/* Answer input based on question type */}
          {currentQuestion.type === 'multiple-choice' && (
            <RadioGroup
              value={answers[currentQuestion.id] || ''}
              onChange={(e) => handleAnswer(currentQuestion.id, e.target.value)}
            >
              {currentQuestion.options?.map(option => (
                <FormControlLabel
                  key={option}
                  value={option}
                  control={<Radio />}
                  label={option}
                  sx={{ mb: 1 }}
                />
              ))}
            </RadioGroup>
          )}

          {currentQuestion.type === 'true-false' && (
            <RadioGroup
              value={answers[currentQuestion.id] || ''}
              onChange={(e) => handleAnswer(currentQuestion.id, e.target.value)}
            >
              <FormControlLabel value="נכון" control={<Radio />} label="נכון ✅" />
              <FormControlLabel value="לא נכון" control={<Radio />} label="לא נכון ❌" />
            </RadioGroup>
          )}

          {currentQuestion.type === 'case-analysis' && (
            <TextField
              fullWidth
              multiline
              rows={4}
              value={answers[currentQuestion.id] || ''}
              onChange={(e) => handleAnswer(currentQuestion.id, e.target.value)}
              placeholder="כתוב כאן את הניתוח המשפטי שלך..."
              variant="outlined"
            />
          )}

          <Box display="flex" justifyContent="space-between" mt={4}>
            <Button
              variant="outlined"
              onClick={prevQuestion}
              disabled={currentQuestionIndex === 0}
            >
              שאלה קודמת
            </Button>

            <Button
              variant="contained"
              onClick={nextQuestion}
              disabled={!answers[currentQuestion.id]}
            >
              {currentQuestionIndex === allQuestions.length - 1 ? 'סיים מבחן' : 'שאלה הבאה'}
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

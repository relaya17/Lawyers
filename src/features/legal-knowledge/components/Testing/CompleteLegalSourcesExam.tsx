import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  RadioGroup,
  FormControlLabel,
  Radio,
  Chip,
  Alert,
  LinearProgress,
  Card,
  CardContent,
  Divider,
  Grid,
  IconButton,
  Collapse
} from '@mui/material';
import {
  CheckCircle,
  Cancel,
  ExpandMore,
  ExpandLess,
  School,
  Gavel,
  AccountBalance,
  Psychology,
  Star
} from '@mui/icons-material';

interface Question {
  id: string;
  type: 'multiple-choice' | 'true-false' | 'short-answer' | 'case-analysis';
  section: string;
  difficulty: 'easy' | 'medium' | 'hard' | 'expert';
  question: string;
  options?: string[];
  correctAnswer: string;
  explanation: string;
  legalPrinciples?: string[];
  emphasis?: string;
  emoji?: string;
}

const multipleChoiceQuestions: Question[] = [
  // רמה קלה (5 שאלות)
  {
    id: 'mc1',
    type: 'multiple-choice',
    section: 'רב-ברירה',
    difficulty: 'easy',
    question: 'מי מוסמך לחוקק חוקים ראשיים בישראל?',
    options: ['הממשלה', 'הכנסת', 'נשיא המדינה', 'היועץ המשפטי לממשלה'],
    correctAnswer: 'הכנסת',
    explanation: 'הכנסת מחוקקת חוקים ראשיים; הממשלה מוסמכת רק לחקיקת משנה.',
    legalPrinciples: ['חקיקה ראשית', 'פרדת רשויות'],
    emoji: '📜'
  },
  {
    id: 'mc2',
    type: 'multiple-choice',
    section: 'רב-ברירה',
    difficulty: 'easy',
    question: 'מהו עקרון חוקיות המנהל?',
    options: ['הרשות רשאית לפעול תמיד', 'הרשות רשאית לפעול רק מכוח הסמכה בחוק', 'הרשות רשאית לפרש חוקים כרצונה', 'הרשות העליונה על הכנסת'],
    correctAnswer: 'הרשות רשאית לפעול רק מכוח הסמכה בחוק',
    explanation: 'עקרון חוקיות המנהל קובע שכל פעולה מנהלית חייבת להיות מבוססת על חוק או סמכות רשמית.',
    legalPrinciples: ['חוקיות המנהל', 'סמכות חוקית'],
    emoji: '⚖️'
  },
  {
    id: 'mc3',
    type: 'multiple-choice',
    section: 'רב-ברירה',
    difficulty: 'easy',
    question: 'מהו נוהג עסקי?',
    options: ['נוהג שאינו מוכר', 'נוהג מקובל בתחום מסחרי', 'חקיקה ראשית', 'תקנה של שר'],
    correctAnswer: 'נוהג מקובל בתחום מסחרי',
    explanation: 'נוהג עסקי הוא פרקטיקה מקובלת בתחום מסחרי מסוים שיכולה להיות מחייבת אם היא עומדת בתנאים המשפטיים.',
    legalPrinciples: ['נוהג עסקי', 'מקורות משפט'],
    emoji: '💼'
  },
  {
    id: 'mc4',
    type: 'multiple-choice',
    section: 'רב-ברירה',
    difficulty: 'easy',
    question: 'חוקי יסוד עם פסקת הגבלה מאפשרים:',
    options: ['פסילה מותנית של חוקים סותרים', 'פסילה אוטומטית של חוקים', 'ביטול מנהגים', 'הרחבת סמכויות הכנסת'],
    correctAnswer: 'פסילה מותנית של חוקים סותרים',
    explanation: 'פסקת הגבלה מאפשרת לבית המשפט לבחון חוקים הסותרים חוקי יסוד באופן מותנה, על פי קריטריונים משפטיים.',
    legalPrinciples: ['חוקי יסוד', 'פסקת הגבלה', 'ביקורת שיפוטית'],
    emoji: '📋'
  },
  {
    id: 'mc5',
    type: 'multiple-choice',
    section: 'רב-ברירה',
    difficulty: 'easy',
    question: 'פסיקה מחייבת מחלקת את הערכאות כך ש:',
    options: ['פסיקה מחייבת רק את בית המשפט שנתן אותה', 'פסיקה מחייבת ערכאות נמוכות יותר', 'פסיקה מחייבת את הכנסת', 'פסיקה אינה מחייבת כלל'],
    correctAnswer: 'פסיקה מחייבת ערכאות נמוכות יותר',
    explanation: 'עקרון התקדים המחייב (stare decisis) קובע שפסיקה של ערכאות גבוהות מחייבת ערכאות נמוכות יותר.',
    legalPrinciples: ['תקדים מחייב', 'היררכיה שיפוטית'],
    emoji: '⚖️'
  },
  
  // רמה בינונית (5 שאלות)
  {
    id: 'mc6',
    type: 'multiple-choice',
    section: 'רב-ברירה',
    difficulty: 'medium',
    question: 'מי יכול לפסול תקנה הסותרת חוק יסוד?',
    options: ['שר המשפטים', 'היועץ המשפטי לממשלה', 'בג"ץ', 'הכנסת'],
    correctAnswer: 'בג"ץ',
    explanation: 'בית המשפט הגבוה לצדק מוסמך לפסול תקנות הסותרות חוקי יסוד מכוח עקרון עליונות חוקי היסוד.',
    legalPrinciples: ['ביקורת שיפוטית', 'עליונות חוקי יסוד'],
    emoji: '⚖️'
  },
  {
    id: 'mc7',
    type: 'multiple-choice',
    section: 'רב-ברירה',
    difficulty: 'medium',
    question: 'מהי פרשנות תכליתית?',
    options: ['על פי לשון החוק', 'על פי מטרת החוק וכוונת המחוקק', 'שמצמצמת את תחולתו', 'אינה קיימת במשפט הישראלי'],
    correctAnswer: 'על פי מטרת החוק וכוונת המחוקק',
    explanation: 'פרשנות תכליתית מאפשרת לשופט לפרש את החוק על פי מטרתו וכוונת המחוקק, ולא רק על פי לשונו.',
    legalPrinciples: ['פרשנות תכליתית', 'כוונת המחוקק'],
    emoji: '🔍'
  },
  {
    id: 'mc8',
    type: 'multiple-choice',
    section: 'רב-ברירה',
    difficulty: 'medium',
    question: 'פסק דין קול העם התייחס ל:',
    options: ['עקרון חוקיות המנהל', 'חופש הביטוי', 'סמכות החנינה של הנשיא', 'נוהג עסקי'],
    correctAnswer: 'חופש הביטוי',
    explanation: 'פסק דין קול העם חיזק את חופש הביטוי כערך על-חוקי בישראל ויצר תקדים חשוב להגנה על זכות זו.',
    legalPrinciples: ['חופש ביטוי', 'זכויות יסוד', 'תקדים מחייב'],
    emoji: '🗣️'
  },
  {
    id: 'mc9',
    type: 'multiple-choice',
    section: 'רב-ברירה',
    difficulty: 'medium',
    question: 'חוקי המנדט הבריטי בישראל היום:',
    options: ['כולם בוטלו', 'ממשיכים לחול אם לא בוטלו במפורש', 'חלים רק בבתי דין דתיים', 'בוטלו עם הקמת המדינה'],
    correctAnswer: 'ממשיכים לחול אם לא בוטלו במפורש',
    explanation: 'חוקים ישנים מתקופת המנדט נשארים בתוקף עד החלפתם בחקיקה ישראלית או ביטולם המפורש.',
    legalPrinciples: ['המשכיות משפטית', 'חקיקה היסטורית'],
    emoji: '📜'
  },
  {
    id: 'mc10',
    type: 'multiple-choice',
    section: 'רב-ברירה',
    difficulty: 'medium',
    question: 'סטייה מתקדים מותרת כאשר:',
    options: ['תמיד', 'רק במקרים חריגים', 'לעולם לא', 'אם המחוקק מבקש'],
    correctAnswer: 'רק במקרים חריגים',
    explanation: 'סטייה מתקדים מחייב מותרת רק במקרים חריגים שבהם נדרש שינוי לצורך שמירה על צדק או עקרונות יסוד.',
    legalPrinciples: ['סטיית תקדים', 'תקדים מחייב'],
    emoji: '⚖️'
  },

  // רמה קשה (5 שאלות)
  {
    id: 'mc11',
    type: 'multiple-choice',
    section: 'רב-ברירה',
    difficulty: 'hard',
    question: 'מהו המשפט הדינמי?',
    options: ['פרשנות על פי לשון החוק בלבד', 'פרשנות על פי צרכים עכשוויים', 'סטייה מתקדים בלבד', 'משפט מנהגי בלבד'],
    correctAnswer: 'פרשנות על פי צרכים עכשוויים',
    explanation: 'המשפט הדינמי מאפשר פרשנות החוק בהתאם למציאות המשתנה וצרכים עכשוויים, תוך שמירה על רלוונטיות החוק.',
    legalPrinciples: ['פרשנות דינמית', 'התאמה למציאות'],
    emoji: '🔄'
  },
  {
    id: 'mc12',
    type: 'multiple-choice',
    section: 'רב-ברירה',
    difficulty: 'hard',
    question: 'מי מוסמך לאשר חנינה?',
    options: ['הכנסת', 'הנשיא', 'בג"ץ', 'שר המשפטים'],
    correctAnswer: 'הנשיא',
    explanation: 'נשיא המדינה מוסמך לתת חנינה על פי חוק יסוד: נשיא המדינה. זו סמכות עצמאית שיכולה להיות סותרת פסיקה.',
    legalPrinciples: ['חנינה נשיאותית', 'סמכויות הנשיא'],
    emoji: '🏛️'
  },
  {
    id: 'mc13',
    type: 'multiple-choice',
    section: 'רב-ברירה',
    difficulty: 'hard',
    question: 'משפט טבעי לעומת פוזיטיביזם:',
    options: ['המשפט הטבעי מחייב חוק בלבד', 'פוזיטיביזם מתחשב בערכים מוסריים', 'המשפט הטבעי מבוסס על ערכים מוסריים, פוזיטיביזם – חוק בלבד', 'שניהם זהים'],
    correctAnswer: 'המשפט הטבעי מבוסס על ערכים מוסריים, פוזיטיביזם – חוק בלבד',
    explanation: 'משפט טבעי מבוסס על עקרונות מוסריים אוניברסליים, בעוד פוזיטיביזם משפטי רואה בחוק הכתוב את המקור הסמכותי היחיד.',
    legalPrinciples: ['משפט טבעי', 'פוזיטיביזם משפטי'],
    emoji: '⚖️'
  },
  {
    id: 'mc14',
    type: 'multiple-choice',
    section: 'רב-ברירה',
    difficulty: 'hard',
    question: 'מתי נוהג משפטי מחייב?',
    options: ['אין חקיקה סותרת', 'תמיד', 'רק בחקיקה אזרחית', 'אף פעם'],
    correctAnswer: 'אין חקיקה סותרת',
    explanation: 'נוהג משפטי מחייב רק כאשר הוא מוכח ומקובל ואין חקיקה כתובה הסותרת אותו.',
    legalPrinciples: ['נוהג משפטי', 'היררכיה נורמטיבית'],
    emoji: '📋'
  },
  {
    id: 'mc15',
    type: 'multiple-choice',
    section: 'רב-ברירה',
    difficulty: 'hard',
    question: 'עקרון השוויון מול הרשות הציבורית מחייב:',
    options: ['החלטות לא שרירותיות', 'עמידה בכל דרישות האזרח', 'התערבות שיפוטית מלאה', 'בחינה על פי שיקול דעת הרשות בלבד'],
    correctAnswer: 'החלטות לא שרירותיות',
    explanation: 'עקרון השוויון מחייב את הרשות הציבורית לקבל החלטות מנומקות ולא שרירותיות, תוך שמירה על עקרונות הצדק.',
    legalPrinciples: ['עקרון השוויון', 'איסור שרירותיות'],
    emoji: '⚖️'
  },

  // רמה קשה מאוד (5 שאלות)
  {
    id: 'mc16',
    type: 'multiple-choice',
    section: 'רב-ברירה',
    difficulty: 'expert',
    question: 'מתי בג"ץ מתערב בחוק רגיל?',
    options: ['תמיד', 'החוק סותר זכויות יסוד', 'רק אם הכנסת מבקשת', 'לעולם לא'],
    correctAnswer: 'החוק סותר זכויות יסוד',
    explanation: 'בג"ץ מתערב בחוק רגיל באמצעות ביקורת שיפוטית חוקתית כאשר החוק סותר זכויות יסוד או עקרונות חוקתיים.',
    legalPrinciples: ['ביקורת שיפוטית', 'זכויות יסוד'],
    emoji: '⚖️'
  },
  {
    id: 'mc17',
    type: 'multiple-choice',
    section: 'רב-ברירה',
    difficulty: 'expert',
    question: 'איזה מקור נחשב למקור על-חוקי?',
    options: ['חוקי יסוד', 'תקנות משרדיות', 'נוהג עסקי', 'חקיקה ראשית רגילה'],
    correctAnswer: 'חוקי יסוד',
    explanation: 'חוקי יסוד מחזיקים במעמד על-חוקי ומאפשרים פסילת חוקים רגילים הסותרים אותם.',
    legalPrinciples: ['על-חוקיות', 'חוקי יסוד'],
    emoji: '📜'
  },
  {
    id: 'mc18',
    type: 'multiple-choice',
    section: 'רב-ברירה',
    difficulty: 'expert',
    question: 'מה הדין במקרה של סתירה בין חוק רגיל לבין נוהג עסקי?',
    options: ['החוק הרגיל גובר', 'הנוהג גובר', 'בג"ץ מחייב ביטול החוק', 'אין פתרון'],
    correctAnswer: 'החוק הרגיל גובר',
    explanation: 'במקרה של סתירה, חקיקה ראשית גוברת על נוהג עסקי, על פי עקרון ההיררכיה הנורמטיבית.',
    legalPrinciples: ['היררכיה נורמטיבית', 'עליונות החקיקה'],
    emoji: '⚖️'
  },
  {
    id: 'mc19',
    type: 'multiple-choice',
    section: 'רב-ברירה',
    difficulty: 'expert',
    question: 'מהי פרשנות מצמצמת?',
    options: ['פרשנות שמרחיבה את החוק', 'פרשנות שמצמצמת את תחולתו', 'על פי לשון החוק בלבד', 'על פי כוונת הצדדים'],
    correctAnswer: 'פרשנות שמצמצמת את תחולתו',
    explanation: 'פרשנות מצמצמת נועדה להגביל את החוק למקרים שהמחוקק התכוון אליהם במפורש, מבלי להרחיב מעבר למותר.',
    legalPrinciples: ['פרשנות מצמצמת', 'הגבלת תחולה'],
    emoji: '🔍'
  },
  {
    id: 'mc20',
    type: 'multiple-choice',
    section: 'רב-ברירה',
    difficulty: 'expert',
    question: 'האם ניתן לפסול חוקים ללא פסקת הגבלה בחוק יסוד?',
    options: ['תמיד', 'בזהירות, תוך שימוש בעקרונות יסוד ובמשפט השוואתי', 'לעולם לא', 'רק על פי החלטת היועץ המשפטי לממשלה'],
    correctAnswer: 'בזהירות, תוך שימוש בעקרונות יסוד ובמשפט השוואתי',
    explanation: 'ללא פסקת הגבלה, בג"ץ יכול עדיין לפסול חוקים בזהירות רבה, תוך שימוש בעקרונות יסוד ומשפט השוואתי.',
    legalPrinciples: ['ביקורת שיפוטית', 'עקרונות יסוד'],
    emoji: '⚖️'
  }
];

const essayQuestions: Question[] = [
  // רמה קלה (3 שאלות)
  {
    id: 'essay1',
    type: 'short-answer',
    section: 'שאלות סיכום/חיבור',
    difficulty: 'easy',
    question: 'הסבר את עקרון חוקיות המנהל בישראל. ✏️',
    correctAnswer: 'עקרון חוקיות המנהל קובע שהרשות המבצעת רשאית לפעול רק מכוח חוק. לדוגמה: תקנות ממשלתיות חייבות להיות בסמכות חוקית, אחרת הן בטלות.',
    explanation: 'עקרון זה מגן על זכויות הפרט ומונע פעולה שרירותית של הרשויות.',
    legalPrinciples: ['חוקיות המנהל', 'הגנת זכויות', 'סמכות חוקית'],
    emoji: '✏️'
  },
  {
    id: 'essay2',
    type: 'short-answer',
    section: 'שאלות סיכום/חיבור',
    difficulty: 'easy',
    question: 'מה ההבדל בין חקיקה ראשית לחקיקת משנה? ✏️',
    correctAnswer: 'חקיקה ראשית – חוקים שחוקקו על ידי הכנסת, בעלי עליונות נורמטיבית. חקיקת משנה – תקנות וצווים ממשלתיים, כפופים לחקיקה ראשית.',
    explanation: 'חקיקת משנה אינה רשאית ליצור חוקים ראשיים אלא רק להבהיר או ליישם חוקים קיימים.',
    legalPrinciples: ['חקיקה ראשית', 'חקיקת משנה', 'היררכיה נורמטיבית'],
    emoji: '✏️'
  },
  {
    id: 'essay3',
    type: 'short-answer',
    section: 'שאלות סיכום/חיבור',
    difficulty: 'easy',
    question: 'מהו המשפט הדינמי? ✏️',
    correctAnswer: 'פרשנות החוק בהתאם לצרכים ולנסיבות העכשוויים.',
    explanation: 'מאפשר התאמה בין החוק למציאות המשתנה, מבלי לשנות את החוק עצמו.',
    legalPrinciples: ['פרשנות דינמית', 'התאמה למציאות'],
    emoji: '✏️'
  },

  // רמה בינונית (3 שאלות)
  {
    id: 'essay4',
    type: 'short-answer',
    section: 'שאלות סיכום/חיבור',
    difficulty: 'medium',
    question: 'הסבר את עקרון עליונות חוקי היסוד. ✏️',
    correctAnswer: 'חוקי יסוד הם עליונים ביחס לחוקים רגילים.',
    explanation: 'חוק רגיל הסותר חוק יסוד עלול להיפסל על ידי בג"ץ. עקרון זה הוא להבטחת זכויות יסוד ושמירה על מסגרת דמוקרטית.',
    legalPrinciples: ['עליונות חוקי יסוד', 'ביקורת שיפוטית', 'זכויות יסוד'],
    emoji: '✏️'
  },
  {
    id: 'essay5',
    type: 'short-answer',
    section: 'שאלות סיכום/חיבור',
    difficulty: 'medium',
    question: 'התייחס למשמעות "פסיקה מנחה" ולהקשר שלה לסטייה מתקדים. ✏️',
    correctAnswer: 'פסיקה מנחה – פסק דין שהופך לתקדים מחייב עבור ערכאות נמוכות יותר. לדוגמה: בג"ץ קובע כללים לפסילת חוקים – והערכאות מחויבות לפעול בהתאם.',
    explanation: 'סטייה מתקדים אפשרית רק במצבים חריגים ומוצדקים.',
    legalPrinciples: ['פסיקה מנחה', 'תקדים מחייב', 'סטיית תקדים'],
    emoji: '✏️'
  },
  {
    id: 'essay6',
    type: 'short-answer',
    section: 'שאלות סיכום/חיבור',
    difficulty: 'medium',
    question: 'מהו תפקידן של הנחיות היועץ המשפטי לממשלה? ✏️',
    correctAnswer: 'הנחיות המנחות את פעילות הרשויות המבצעות.',
    explanation: 'הן מחייבות פרקטית את הרשות המבצעת, אך אינן חקיקה.',
    legalPrinciples: ['יועץ משפטי לממשלה', 'הנחיות מנהליות'],
    emoji: '✏️'
  },

  // רמה קשה (2 שאלות)
  {
    id: 'essay7',
    type: 'short-answer',
    section: 'שאלות סיכום/חיבור',
    difficulty: 'hard',
    question: 'נתח את פסק דין קול העם והשפעתו על חופש הביטוי. ✏️',
    correctAnswer: 'פסק דין קול העם הכיר בחשיבות חופש הביטוי כערך על-חוקי.',
    explanation: 'פסק הדין יאפשר פגיעה בחופש הביטוי בחקיקה רק לצורכי ביטחון הציבור, ובכך חיזק את מעמד בג"ץ כמגן זכויות יסוד.',
    legalPrinciples: ['חופש ביטוי', 'זכויות יסוד', 'פסק דין קול העם'],
    emoji: '✏️'
  },
  {
    id: 'essay8',
    type: 'short-answer',
    section: 'שאלות סיכום/חיבור',
    difficulty: 'hard',
    question: 'מהי תורת השיפוט האקטיביסטית וכיצד היא קשורה לפרשנות תכליתית? ✏️',
    correctAnswer: 'השיפוט האקטיביסטי מאפשר לבית המשפט להתערב גם ללא הוראות חוק מפורשות.',
    explanation: 'מחזקת את מעמד בג"ץ ומאפשרת פרשנות דינמית של החקיקה.',
    legalPrinciples: ['אקטיביזם שיפוטי', 'פרשנות תכליתית'],
    emoji: '✏️'
  },

  // רמה קשה מאוד (2 שאלות)
  {
    id: 'essay9',
    type: 'short-answer',
    section: 'שאלות סיכום/חיבור',
    difficulty: 'expert',
    question: 'נתח את מעמד המשפט העברי במערכת המשפטית הישראלית. ✏️',
    correctAnswer: 'מקור עזר במקרים שאין חקיקה ברורה, בעיקר בדיני משפחה ואישי.',
    explanation: 'אינו מחייב, אך מספק עוגן מוסרי וחוקתי.',
    legalPrinciples: ['משפט עברי', 'מקור עזר', 'דיני משפחה'],
    emoji: '✏️'
  },
  {
    id: 'essay10',
    type: 'short-answer',
    section: 'שאלות סיכום/חיבור',
    difficulty: 'expert',
    question: 'האם בישראל יש "עליון" נורמטיבי אחד או ריבוי מקורות עליונים? נמק. ✏️',
    correctAnswer: 'ריבוי מקורות עליונים: חוקי יסוד, פסיקה על-חוקית (כמו קול העם), עקרונות משפט טבעי.',
    explanation: 'המערכת אינה חוקה פורמלית אחת, אלא היא היברידית.',
    legalPrinciples: ['ריבוי מקורות', 'שיטה היברידית', 'עליונות נורמטיבית'],
    emoji: '✏️'
  }
];

const trueFalseQuestions: Question[] = [
  // רמה קלה (3 שאלות)
  {
    id: 'tf1',
    type: 'true-false',
    section: 'נכון/לא נכון',
    difficulty: 'easy',
    question: 'כל חקיקה ראשית נחשבת לעליונה על חקיקת משנה. 🔹',
    correctAnswer: 'נכון',
    explanation: 'חקיקה ראשית (חוקי הכנסת) עומדת מעל תקנות וחקיקה משנית על פי עקרון ההיררכיה הנורמטיבית.',
    legalPrinciples: ['היררכיה נורמטיבית', 'חקיקה ראשית'],
    emoji: '🔹'
  },
  {
    id: 'tf2',
    type: 'true-false',
    section: 'נכון/לא נכון',
    difficulty: 'easy',
    question: 'נוהג עסקי מחייב תמיד את בתי המשפט. 🔹',
    correctAnswer: 'לא נכון',
    explanation: 'נוהג מחייב רק אם הוא מקובל בתחום הרלוונטי ואין חקיקה סותרת.',
    legalPrinciples: ['נוהג עסקי', 'תנאי מחייבות'],
    emoji: '🔹'
  },
  {
    id: 'tf3',
    type: 'true-false',
    section: 'נכון/לא נכון',
    difficulty: 'easy',
    question: 'חוקי יסוד עם פסקת הגבלה מאפשרים רק פסיקה מותנית. 🔹',
    correctAnswer: 'נכון',
    explanation: 'ניתן לבחון חוקים הסותרים חוקי יסוד באופן מותנה, על פי קריטריונים משפטיים.',
    legalPrinciples: ['חוקי יסוד', 'פסקת הגבלה'],
    emoji: '🔹'
  },

  // רמה בינונית (3 שאלות)
  {
    id: 'tf4',
    type: 'true-false',
    section: 'נכון/לא נכון',
    difficulty: 'medium',
    question: 'פסיקה של בית משפט מחוזי מחייבת את כל בתי המשפט הנמוכים ממנו. 🔹',
    correctAnswer: 'נכון',
    explanation: 'עקרון ההיררכיה מחייב את הערכאות הנמוכות יותר לפסוק על פי פסיקת הערכאות הגבוהות.',
    legalPrinciples: ['היררכיה שיפוטית', 'תקדים מחייב'],
    emoji: '🔹'
  },
  {
    id: 'tf5',
    type: 'true-false',
    section: 'נכון/לא נכון',
    difficulty: 'medium',
    question: 'פרשנות תכליתית מחייבת תמיד התעלמות מלשון החוק. 🔹',
    correctAnswer: 'לא נכון',
    explanation: 'הפרשנות התכליתית משלבת גם את לשון החוק וגם את כוונת המחוקק.',
    legalPrinciples: ['פרשנות תכליתית', 'איזון פרשני'],
    emoji: '🔹'
  },
  {
    id: 'tf6',
    type: 'true-false',
    section: 'נכון/לא נכון',
    difficulty: 'medium',
    question: 'בג"ץ רשאי לפסול חוקים רגילים הסותרים זכויות יסוד. 🔹',
    correctAnswer: 'נכון',
    explanation: 'עקרון עליונות חוקי היסוד מאפשר לבג"ץ לפסול חוקים רגילים הסותרים זכויות יסוד.',
    legalPrinciples: ['ביקורת שיפוטית', 'זכויות יסוד'],
    emoji: '🔹'
  },

  // רמה קשה (2 שאלות)
  {
    id: 'tf7',
    type: 'true-false',
    section: 'נכון/לא נכון',
    difficulty: 'hard',
    question: 'המשפט הישראלי מבוסס רק על המשפט הבריטי. 🔹',
    correctAnswer: 'לא נכון',
    explanation: 'המשפט הישראלי הוא היברידי - הוא כולל משפט בריטי, קונטיננטלי, עקרונות משפט טבעי ומנהגים.',
    legalPrinciples: ['שיטה היברידית', 'מקורות מעורבים'],
    emoji: '🔹'
  },
  {
    id: 'tf8',
    type: 'true-false',
    section: 'נכון/לא נכון',
    difficulty: 'hard',
    question: 'חנינת הנשיא יכולה להיות סותרת פסיקה של בית המשפט. 🔹',
    correctAnswer: 'נכון',
    explanation: 'החנינה היא סמכות חוץ-חוקית; היא חוקית גם אם היא סותרת פסיקה, אך עשויה להיתקל בביקורת.',
    legalPrinciples: ['חנינה נשיאותית', 'סמכות עצמאית'],
    emoji: '🔹'
  },

  // רמה קשה מאוד (2 שאלות)
  {
    id: 'tf9',
    type: 'true-false',
    section: 'נכון/לא נכון',
    difficulty: 'expert',
    question: 'משפט בינלאומי אינו מחייב בישראל כלל. 🔹',
    correctAnswer: 'לא נכון',
    explanation: 'המשפט הבינלאומי מחייב כאשר הוא מאומץ כחוק פנימי או משפיע על חקיקה מקומית.',
    legalPrinciples: ['משפט בינלאומי', 'אימוץ פנימי'],
    emoji: '🔹'
  },
  {
    id: 'tf10',
    type: 'true-false',
    section: 'נכון/לא נכון',
    difficulty: 'expert',
    question: 'סטייה מתקדים מותרת תמיד אם השופט סבור שהמצב השתנה. 🔹',
    correctAnswer: 'לא נכון',
    explanation: 'סטייה מתקדים מותרת רק במקרים חריגים, בדרך כלל אם יש שינוי מהותי או שיקולי צדק.',
    legalPrinciples: ['סטיית תקדים', 'מקרים חריגים'],
    emoji: '🔹'
  }
];

const CompleteLegalSourcesExam: React.FC = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showResults, setShowResults] = useState(false);
  const [expandedExplanations, setExpandedExplanations] = useState<Set<string>>(new Set());
  const [currentSection, setCurrentSection] = useState<'multiple-choice' | 'true-false'>('multiple-choice');

  const allQuestions = currentSection === 'multiple-choice' ? multipleChoiceQuestions : trueFalseQuestions;
  const currentQuestion = allQuestions[currentQuestionIndex];

  const handleAnswerChange = (value: string) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: value
    }));
  };

  const handleNext = () => {
    if (currentSection === 'multiple-choice' && currentQuestionIndex === multipleChoiceQuestions.length - 1) {
      setCurrentSection('true-false');
      setCurrentQuestionIndex(0);
    } else if (currentQuestionIndex < allQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setShowResults(true);
    }
  };

  const handlePrevious = () => {
    if (currentSection === 'true-false' && currentQuestionIndex === 0) {
      setCurrentSection('multiple-choice');
      setCurrentQuestionIndex(multipleChoiceQuestions.length - 1);
    } else if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const toggleExplanation = (questionId: string) => {
    setExpandedExplanations(prev => {
      const newSet = new Set(prev);
      if (newSet.has(questionId)) {
        newSet.delete(questionId);
      } else {
        newSet.add(questionId);
      }
      return newSet;
    });
  };

  const calculateResults = () => {
    const totalQuestions = multipleChoiceQuestions.length + trueFalseQuestions.length;
    const allQuestionsArray = [...multipleChoiceQuestions, ...trueFalseQuestions];
    const correctAnswers = allQuestionsArray.filter(q => answers[q.id] === q.correctAnswer).length;
    const percentage = Math.round((correctAnswers / totalQuestions) * 100);
    
    return {
      total: totalQuestions,
      correct: correctAnswers,
      percentage,
      grade: percentage >= 90 ? 'מעולה' : percentage >= 80 ? 'טוב מאוד' : percentage >= 70 ? 'טוב' : percentage >= 60 ? 'מספק' : 'לא מספק'
    };
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return '#4caf50';
      case 'medium': return '#ff9800';
      case 'hard': return '#f44336';
      case 'expert': return '#9c27b0';
      default: return '#757575';
    }
  };

  const getDifficultyLabel = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'קל';
      case 'medium': return 'בינוני';
      case 'hard': return 'קשה';
      case 'expert': return 'קשה מאוד';
      default: return difficulty;
    }
  };

  const progress = ((multipleChoiceQuestions.length + trueFalseQuestions.length - allQuestions.length + currentQuestionIndex + 1) / (multipleChoiceQuestions.length + trueFalseQuestions.length)) * 100;

  if (showResults) {
    const results = calculateResults();
    const allQuestionsArray = [...multipleChoiceQuestions, ...trueFalseQuestions];

    return (
      <Box sx={{ maxWidth: 1000, mx: 'auto', p: 3 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h4" gutterBottom align="center" color="primary">
            📊 תוצאות המבחן
          </Typography>
          
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography variant="h5" sx={{ mb: 2 }}>
              הציון שלך: {results.correct}/{results.total} ({results.percentage}%)
            </Typography>
            <Chip 
              label={results.grade} 
              color={results.percentage >= 70 ? 'success' : 'error'} 
              size="medium" 
              sx={{ fontSize: '1.2rem', p: 2 }} 
            />
          </Box>

          <Divider sx={{ my: 3 }} />

          <Typography variant="h6" gutterBottom>
            📋 סיכום תשובות:
          </Typography>

          {allQuestionsArray.map((question, index) => {
            const userAnswer = answers[question.id];
            const isCorrect = userAnswer === question.correctAnswer;
            const isExpanded = expandedExplanations.has(question.id);

            return (
              <Card key={question.id} sx={{ mb: 2, border: isCorrect ? '2px solid #4caf50' : '2px solid #f44336' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="h6" sx={{ flex: 1 }}>
                      {index + 1}. {question.question}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Chip 
                        label={getDifficultyLabel(question.difficulty)} 
                        size="small" 
                        sx={{ backgroundColor: getDifficultyColor(question.difficulty), color: 'white' }} 
                      />
                      {isCorrect ? <CheckCircle color="success" /> : <Cancel color="error" />}
                      <IconButton onClick={() => toggleExplanation(question.id)}>
                        {isExpanded ? <ExpandLess /> : <ExpandMore />}
                      </IconButton>
                    </Box>
                  </Box>

                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        התשובה שלך: <strong style={{ color: isCorrect ? '#4caf50' : '#f44336' }}>
                          {userAnswer || 'לא נענה'}
                        </strong>
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        התשובה הנכונה: <strong style={{ color: '#4caf50' }}>
                          {question.correctAnswer}
                        </strong>
                      </Typography>
                    </Grid>
                  </Grid>

                  <Collapse in={isExpanded}>
                    <Box sx={{ mt: 2, p: 2, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        <strong>הסבר:</strong> {question.explanation}
                      </Typography>
                      {question.legalPrinciples && (
                        <Box sx={{ mt: 1 }}>
                          <Typography variant="body2" sx={{ mb: 1 }}>
                            <strong>עקרונות משפטיים:</strong>
                          </Typography>
                          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                            {question.legalPrinciples.map((principle, idx) => (
                              <Chip key={idx} label={principle} size="small" variant="outlined" />
                            ))}
                          </Box>
                        </Box>
                      )}
                      {question.emphasis && (
                        <Alert severity="info" sx={{ mt: 2 }}>
                          <Typography variant="body2">
                            <strong>דגש:</strong> {question.emphasis}
                          </Typography>
                        </Alert>
                      )}
                    </Box>
                  </Collapse>
                </CardContent>
              </Card>
            );
          })}

          <Box sx={{ textAlign: 'center', mt: 4 }}>
            <Button 
              variant="contained" 
              size="large" 
              onClick={() => {
                setCurrentQuestionIndex(0);
                setAnswers({});
                setShowResults(false);
                setCurrentSection('multiple-choice');
                setExpandedExplanations(new Set());
              }}
            >
              🔄 התחל מבחן חדש
            </Button>
          </Box>
        </Paper>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Typography variant="h4" gutterBottom color="primary">
            📜 מבחן מקיף: מקורות המשפט בישראל
          </Typography>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            {currentSection === 'multiple-choice' ? 'חלק א\': שאלות רב-ברירה' : 'חלק ב\': נכון/לא נכון'}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, justifyContent: 'center', mb: 2 }}>
            <Chip 
              label={getDifficultyLabel(currentQuestion.difficulty)} 
              sx={{ backgroundColor: getDifficultyColor(currentQuestion.difficulty), color: 'white' }} 
            />
            <Typography variant="body2">
              שאלה {currentQuestionIndex + 1} מתוך {allQuestions.length}
            </Typography>
          </Box>
          <LinearProgress variant="determinate" value={progress} sx={{ mb: 2 }} />
        </Box>

        <Card sx={{ mb: 3, p: 3 }}>
          <Typography variant="h6" gutterBottom>
            {currentQuestion.emoji} {currentQuestion.question}
          </Typography>

          {currentQuestion.type === 'multiple-choice' ? (
            <RadioGroup
              value={answers[currentQuestion.id] || ''}
              onChange={(e) => handleAnswerChange(e.target.value)}
            >
              {currentQuestion.options?.map((option, index) => (
                <FormControlLabel
                  key={index}
                  value={option}
                  control={<Radio />}
                  label={option}
                  sx={{ mb: 1 }}
                />
              ))}
            </RadioGroup>
          ) : (
            <RadioGroup
              value={answers[currentQuestion.id] || ''}
              onChange={(e) => handleAnswerChange(e.target.value)}
              row
              sx={{ justifyContent: 'center', gap: 4 }}
            >
              <FormControlLabel
                value="נכון"
                control={<Radio />}
                label="✅ נכון"
              />
              <FormControlLabel
                value="לא נכון"
                control={<Radio />}
                label="❌ לא נכון"
              />
            </RadioGroup>
          )}
        </Card>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
          <Button 
            variant="outlined" 
            onClick={handlePrevious}
            disabled={currentSection === 'multiple-choice' && currentQuestionIndex === 0}
            startIcon={<ExpandLess sx={{ transform: 'rotate(-90deg)' }} />}
          >
            שאלה קודמת
          </Button>
          
          <Button 
            variant="contained" 
            onClick={handleNext}
            disabled={!answers[currentQuestion.id]}
            endIcon={
              currentSection === 'true-false' && currentQuestionIndex === allQuestions.length - 1 ? 
              <Star /> : 
              <ExpandMore sx={{ transform: 'rotate(-90deg)' }} />
            }
          >
            {currentSection === 'true-false' && currentQuestionIndex === allQuestions.length - 1 ? 
              'סיים מבחן' : 'שאלה הבאה'}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default CompleteLegalSourcesExam;

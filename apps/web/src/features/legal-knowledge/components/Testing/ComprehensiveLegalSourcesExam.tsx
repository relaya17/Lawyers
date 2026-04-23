import React, { useState } from 'react';
import { Box } from '@mui/material';
import { CheckCircle, Cancel as XCircle, AccessTime as Clock, EmojiEvents as Trophy, MenuBook as BookOpen, Balance as Scale, Description as FileText } from '@mui/icons-material';

interface Question {
  id: number;
  type: 'multiple-choice' | 'true-false' | 'short-answer' | 'case-study';
  difficulty: 'קל' | 'בינוני' | 'קשה' | 'קשה מאוד';
  icon: string;
  question: string;
  options?: {
    id: string;
    text: string;
  }[];
  correctAnswer: string;
  explanation: string;
  precedent?: string;
  category: string;
}

const questions: Question[] = [
  // 🟢 רמה קלה (10 שאלות)
  {
    id: 1,
    type: 'multiple-choice',
    difficulty: 'קל',
    icon: '📜',
    category: 'חקיקה',
    question: 'מי מוסמך לחוקק חוקים ראשיים בישראל?',
    options: [
      { id: 'a', text: 'הממשלה' },
      { id: 'b', text: 'הכנסת' },
      { id: 'c', text: 'היועץ המשפטי לממשלה' },
      { id: 'd', text: 'נשיא המדינה' }
    ],
    correctAnswer: 'b',
    explanation: 'הכנסת היא הרשות המחוקקת המרכזית; הממשלה יכולה לחוקק רק חקיקת משנה.'
  },
  {
    id: 2,
    type: 'multiple-choice',
    difficulty: 'קל',
    icon: '⚖️',
    category: 'עקרונות יסוד',
    question: 'תקנות שמפרות חוק בטלות כי:',
    options: [
      { id: 'a', text: 'הן לא כתובות היטב' },
      { id: 'b', text: 'חקיקת משנה חייבת להסתמך על חוק ראשי' },
      { id: 'c', text: 'הן מחייבות רק במוסדות מסוימים' },
      { id: 'd', text: 'פסיקה לא מחייבת אותן' }
    ],
    correctAnswer: 'b',
    explanation: 'עקרון חוקיות המנהל מחייב שמנהלים יתנהגו לפי סמכות בחוק בלבד.'
  },
  {
    id: 3,
    type: 'multiple-choice',
    difficulty: 'קל',
    icon: '⚖️',
    category: 'פסיקה',
    question: 'פסיקה מחייבת בערכאות נמוכות יותר היא דוגמה ל:',
    options: [
      { id: 'a', text: 'סטיית תקדים' },
      { id: 'b', text: 'משפט דינמי' },
      { id: 'c', text: 'קודיפיקציה' },
      { id: 'd', text: 'פסיקה מחייבת' }
    ],
    correctAnswer: 'd',
    explanation: 'פסיקה בערכאה גבוהה מחייבת את הערכאות הנמוכות יותר, כדי לשמור על עקביות.'
  },
  {
    id: 4,
    type: 'multiple-choice',
    difficulty: 'קל',
    icon: '✨',
    category: 'מנהגים',
    question: 'מנהג עסקי מחייב כאשר:',
    options: [
      { id: 'a', text: 'הוא סותר חוק' },
      { id: 'b', text: 'הוא נפוץ ומקובל בתחום' },
      { id: 'c', text: 'הוא חדש ומיוחד' },
      { id: 'd', text: 'לא קיים חוק אחר' }
    ],
    correctAnswer: 'b',
    explanation: 'חובה להראות שהמנהג קבוע ונפוץ, ואינו סותר חקיקה.'
  },
  {
    id: 5,
    type: 'multiple-choice',
    difficulty: 'קל',
    icon: '📜',
    category: 'פרשנות',
    question: 'פרשנות לשונית מתמקדת ב:',
    options: [
      { id: 'a', text: 'לשון החוק בלבד' },
      { id: 'b', text: 'מטרת המחוקק' },
      { id: 'c', text: 'המציאות החברתית' },
      { id: 'd', text: 'פסיקה זרה' }
    ],
    correctAnswer: 'a',
    explanation: 'הפרשנות הלשונית מתייחסת ללשון המדויקת של החוק.'
  },
  {
    id: 6,
    type: 'multiple-choice',
    difficulty: 'קל',
    icon: '⚖️',
    category: 'חוקי יסוד',
    question: 'חוקי יסוד בישראל מחזיקים:',
    options: [
      { id: 'a', text: 'מעמד על-חוקי ביחס לחוקים רגילים' },
      { id: 'b', text: 'אותו מעמד כמו חוקים רגילים' },
      { id: 'c', text: 'רק פסיקה מחייבת אותם' },
      { id: 'd', text: 'חלה רק בתקנות' }
    ],
    correctAnswer: 'a',
    explanation: 'חוקים רגילים כפופים לחוקי יסוד; בג"ץ מוסמך לפסול חוקים סותרים.'
  },
  {
    id: 7,
    type: 'multiple-choice',
    difficulty: 'קל',
    icon: '⚖️',
    category: 'משפט השוואתי',
    question: 'פסקי דין זרים:',
    options: [
      { id: 'a', text: 'מחייבים את בתי המשפט בישראל' },
      { id: 'b', text: 'משמשים כתקדים מחייב' },
      { id: 'c', text: 'יכולים להוות מקור השראה בלבד' },
      { id: 'd', text: 'אין להם כל משמעות' }
    ],
    correctAnswer: 'c',
    explanation: 'פסיקה זרה אינה מחייבת, אך יכולה להוות מקור עזר או השראה בפרשנות.'
  },
  {
    id: 8,
    type: 'multiple-choice',
    difficulty: 'קל',
    icon: '⚖️',
    category: 'חוקי יסוד',
    question: 'פסקת ההגבלה בחוק יסוד מאפשרת:',
    options: [
      { id: 'a', text: 'פסילה אוטומטית של חוקים סותרים' },
      { id: 'b', text: 'בחינה משפטית מותנית' },
      { id: 'c', text: 'ביטול מנהגי השוק' },
      { id: 'd', text: 'הרחבת סמכויות הממשלה' }
    ],
    correctAnswer: 'b',
    explanation: 'מאפשר לבית המשפט לאזן בין זכויות יסוד לבין אינטרסים אחרים.'
  },
  {
    id: 9,
    type: 'multiple-choice',
    difficulty: 'קל',
    icon: '⚖️',
    category: 'פרשנות',
    question: 'המשפט הדינמי מתייחס ל:',
    options: [
      { id: 'a', text: 'פרשנות נוקשה לפי לשון החוק' },
      { id: 'b', text: 'פרשנות החוק בהתאם לצרכים עכשוויים' },
      { id: 'c', text: 'חוקים כתובים בלבד' },
      { id: 'd', text: 'פסיקה מחייבת' }
    ],
    correctAnswer: 'b',
    explanation: 'מאפשר התאמה למציאות חברתית חדשה ושינוי תנאים.'
  },
  {
    id: 10,
    type: 'multiple-choice',
    difficulty: 'קל',
    icon: '⚖️',
    category: 'עקרונות יסוד',
    question: 'עקרון עליונות חוקי היסוד קובע:',
    options: [
      { id: 'a', text: 'חוקים רגילים גוברים תמיד' },
      { id: 'b', text: 'חוקים רגילים כפופים לחוקי יסוד' },
      { id: 'c', text: 'פסיקה לא חלה על חוקים' },
      { id: 'd', text: 'חוקי יסוד מחייבים רק את הכנסת' }
    ],
    correctAnswer: 'b',
    explanation: 'חוקים רגילים כפופים לחוקי יסוד; בג"ץ יכול לפסול חוקים סותרים.'
  },
  
  // 🟡 רמה בינונית (10 שאלות)
  {
    id: 11,
    type: 'multiple-choice',
    difficulty: 'בינוני',
    icon: '✨',
    category: 'מנהגים',
    question: 'איזה מקור משפטי יכול לשמש רק כ"עזר" ואינו מחייב?',
    options: [
      { id: 'a', text: 'פסיקה מחייבת' },
      { id: 'b', text: 'חוק יסוד' },
      { id: 'c', text: 'מנהג' },
      { id: 'd', text: 'חקיקה ראשית' }
    ],
    correctAnswer: 'c',
    explanation: 'מנהגים, גם אם נפוצים, אינם מחייבים את בית המשפט, אלא אם אין חקיקה סותרת.'
  },
  {
    id: 12,
    type: 'multiple-choice',
    difficulty: 'בינוני',
    icon: '⚖️',
    category: 'ביקורת שיפוטית',
    question: 'בג"ץ מתערב בחוק רגיל כאשר:',
    options: [
      { id: 'a', text: 'החוק ברור ואינו סותר כלום' },
      { id: 'b', text: 'החוק סותר עקרונות יסוד' },
      { id: 'c', text: 'הכנסת מבקשת זאת' },
      { id: 'd', text: 'כל חוק רגיל' }
    ],
    correctAnswer: 'b',
    explanation: 'ביקורת שיפוטית על חוק רגיל מתבצעת רק כאשר החוק פוגע בזכויות יסוד או סותר חוקי יסוד.'
  },
  {
    id: 13,
    type: 'multiple-choice',
    difficulty: 'בינוני',
    icon: '📜',
    category: 'פרשנות',
    question: 'פרשנות מצמצמת נועדה:',
    options: [
      { id: 'a', text: 'להרחיב את תחולתו של החוק' },
      { id: 'b', text: 'לצמצם את תחולתו של החוק' },
      { id: 'c', text: 'לפרש תמיד לפי כוונת המחוקק' },
      { id: 'd', text: 'להתעלם מהלשון' }
    ],
    correctAnswer: 'b',
    explanation: 'הפרשנות המצמצמת מצמצמת את תחולתו של החוק על מנת למנוע הרחבה שלא התכוון המחוקק.'
  },
  {
    id: 14,
    type: 'multiple-choice',
    difficulty: 'בינוני',
    icon: '⚖️',
    category: 'חנינה נשיאותית',
    question: 'האם נשיא המדינה יכול לתת חנינה הסותרת פסיקה?',
    options: [
      { id: 'a', text: 'כן, החוק מאפשר זאת' },
      { id: 'b', text: 'לא, פסיקה תמיד גוברת' },
      { id: 'c', text: 'רק עם אישור הכנסת' },
      { id: 'd', text: 'רק אם בג"ץ מאשר' }
    ],
    correctAnswer: 'a',
    explanation: 'לפי חוק יסוד: נשיא המדינה, החנינה חוקית גם אם סותרת פסיקה, אך יש לה השלכות משפטיות וציבוריות.',
    precedent: 'חוק יסוד: נשיא המדינה - סמכות החנינה'
  },
  {
    id: 15,
    type: 'multiple-choice',
    difficulty: 'בינוני',
    icon: '⚖️',
    category: 'תיאוריית משפט',
    question: 'משפט טבעי שונה מפוזיטיביזם משפטי בכך ש:',
    options: [
      { id: 'a', text: 'מחייב פעולה לפי חוק בלבד' },
      { id: 'b', text: 'מבוסס על עקרונות מוסריים כלליים' },
      { id: 'c', text: 'אינו רלוונטי למשפט מודרני' },
      { id: 'd', text: 'מחייב את פסיקת בג"ץ' }
    ],
    correctAnswer: 'b',
    explanation: 'משפט טבעי מבוסס על עקרונות מוסריים אוניברסליים, בעוד פוזיטיביזם משפטי מדגיש ציות לחוק הכתוב בלבד.'
  },
  {
    id: 16,
    type: 'multiple-choice',
    difficulty: 'בינוני',
    icon: '⚖️',
    category: 'משפט השוואתי',
    question: 'פסיקה זרה יכולה להשפיע על המשפט הישראלי כאשר:',
    options: [
      { id: 'a', text: 'היא מחייבת מחייבת' },
      { id: 'b', text: 'השופט מחליט להשתמש בה כתקדים עזר' },
      { id: 'c', text: 'היא מהווה חוק בינלאומי' },
      { id: 'd', text: 'אין לה כל השפעה' }
    ],
    correctAnswer: 'b',
    explanation: 'בתי המשפט בישראל יכולים להשתמש בפסיקה זרה כעזר בפרשנות, אך היא אינה מחייבת.'
  },
  {
    id: 17,
    type: 'multiple-choice',
    difficulty: 'בינוני',
    icon: '⚖️',
    category: 'חוקי יסוד',
    question: 'פסקת ההגבלה בחוק יסוד מאפשרת:',
    options: [
      { id: 'a', text: 'ביטול אוטומטי של כל חוק סותר' },
      { id: 'b', text: 'איזון בין זכויות יסוד לאינטרסים ציבוריים' },
      { id: 'c', text: 'ביטול מנהגי השוק' },
      { id: 'd', text: 'הרחבת סמכויות הממשלה' }
    ],
    correctAnswer: 'b',
    explanation: 'מאפשר לבית המשפט לאזן בין זכויות הפרט לבין צרכים ציבוריים, ולא לבצע פסילה אוטומטית.'
  },
  {
    id: 18,
    type: 'multiple-choice',
    difficulty: 'בינוני',
    icon: '⚖️',
    category: 'פרשנות',
    question: 'משפט דינמי הוא:',
    options: [
      { id: 'a', text: 'פרשנות נוקשה לפי לשון החוק בלבד' },
      { id: 'b', text: 'פרשנות מותאמת למציאות חברתית חדשה' },
      { id: 'c', text: 'חקיקה מחדש של הכנסת' },
      { id: 'd', text: 'מנהג משפטי בלבד' }
    ],
    correctAnswer: 'b',
    explanation: 'מאפשר שינוי והסתגלות של החוק למציאות המשתנה, תוך שמירה על עקרונות בסיסיים.'
  },
  {
    id: 19,
    type: 'multiple-choice',
    difficulty: 'בינוני',
    icon: '⚖️',
    category: 'תקדימים',
    question: 'סטיית תקדים מחייבת את:',
    options: [
      { id: 'a', text: 'כלל הציבור' },
      { id: 'b', text: 'ערכאות נמוכות יותר' },
      { id: 'c', text: 'הכנסת' },
      { id: 'd', text: 'רק בית המשפט שהוציא את הפסיקה' }
    ],
    correctAnswer: 'b',
    explanation: 'סטיית תקדים מחייבת בעיקר ערכאות נמוכות יותר כדי לשמור על עקביות משפטית.'
  },
  {
    id: 20,
    type: 'multiple-choice',
    difficulty: 'בינוני',
    icon: '⚖️',
    category: 'עקרונות מנהליים',
    question: 'עקרון סבירות מחייב את הרשות הציבורית:',
    options: [
      { id: 'a', text: 'לפעול לפי רגשות' },
      { id: 'b', text: 'לפעול באופן סביר ומידתי' },
      { id: 'c', text: 'לפסול כל חוק' },
      { id: 'd', text: 'לעקוף חקיקה' }
    ],
    correctAnswer: 'b',
    explanation: 'סבירות היא עקרון יסוד המחייב את הרשות הציבורית לפעול באופן מידתי והגון, בהתאם למטרת החוק.'
  },
  
  // 🔴 רמה קשה (10 שאלות)
  {
    id: 21,
    type: 'multiple-choice',
    difficulty: 'קשה',
    icon: '⚖️',
    category: 'ביקורת שיפוטית',
    question: 'חוק רגיל סותר חוק יסוד: כבוד האדם וחירותו. מה יכולה לעשות רשות השיפוט?',
    options: [
      { id: 'a', text: 'לא מתערבת' },
      { id: 'b', text: 'בג"ץ יכול לפסול את החוק או חלקו' },
      { id: 'c', text: 'הכנסת יכולה לבטל אותו' },
      { id: 'd', text: 'החוק נכנס לתוקף באופן אוטומטי' }
    ],
    correctAnswer: 'b',
    explanation: 'חוקי יסוד בעלי פסקת הגבלה מאפשרים לבג"ץ לאזן בין חירות הפרט לאינטרס הציבורי, ולפסול חוקים סותרים.'
  },
  {
    id: 22,
    type: 'multiple-choice',
    difficulty: 'קשה',
    icon: '⚖️',
    category: 'סכסוכי מקורות',
    question: 'שופט נתקל במנהג עסקי הסותר חוק כתוב. כיצד עליו לפעול?',
    options: [
      { id: 'a', text: 'להחיל את המנהג' },
      { id: 'b', text: 'לפסול את המנהג' },
      { id: 'c', text: 'לאכוף את החוק, המנהג אינו מחייב' },
      { id: 'd', text: 'להפעיל שיקול דעת חופשי' }
    ],
    correctAnswer: 'c',
    explanation: 'חקיקה כתובה גוברת על מנהגים; המנהג יכול לשמש כעזר רק אם אין חקיקה סותרת.'
  },
  {
    id: 23,
    type: 'multiple-choice',
    difficulty: 'קשה',
    icon: '⚖️',
    category: 'פרשנות',
    question: 'כיצד בית המשפט יכול ליישם פרשנות דינמית?',
    options: [
      { id: 'a', text: 'לפרש את החוק כפי שנכתב בלבד' },
      { id: 'b', text: 'להתאים את החוק למציאות חברתית חדשה תוך שמירה על כוונת המחוקק' },
      { id: 'c', text: 'להתעלם מחוקי יסוד' },
      { id: 'd', text: 'לכתוב חקיקה חדשה במקום הכנסת' }
    ],
    correctAnswer: 'b',
    explanation: 'פרשנות דינמית מאפשרת הסתגלות למציאות משתנה, תוך שמירה על גבולות החוק.'
  },
  {
    id: 24,
    type: 'multiple-choice',
    difficulty: 'קשה',
    icon: '⚖️',
    category: 'משפט השוואתי',
    question: 'פסיקה זרה מומלצת כשימוש בישראל כאשר:',
    options: [
      { id: 'a', text: 'מדובר בתקדים מחייב' },
      { id: 'b', text: 'השופט רואה בכך עזר לפרשנות החוק המקומי' },
      { id: 'c', text: 'החוק הישראלי אינו חל' },
      { id: 'd', text: 'היא מהווה חלק מהחוקה' }
    ],
    correctAnswer: 'b',
    explanation: 'פסיקה זרה אינה מחייבת אך יכולה לשמש כהשראה או תובנה לניתוח משפטי.'
  },
  {
    id: 25,
    type: 'multiple-choice',
    difficulty: 'קשה',
    icon: '⚖️',
    category: 'חנינה נשיאותית',
    question: 'נשיא המדינה נותן חנינה אך החוק מפלה אזרח מסוים. מה יקרה?',
    options: [
      { id: 'a', text: 'החנינה אינה חוקית' },
      { id: 'b', text: 'החנינה חוקית, אך קיימת ביקורת משפטית וציבורית' },
      { id: 'c', text: 'החוק מבוטל אוטומטית' },
      { id: 'd', text: 'הכנסת חייבת לאשר מחדש' }
    ],
    correctAnswer: 'b',
    explanation: 'חנינה היא סמכות יוצאת דופן; היא חוקית גם אם סותרת פסיקה, אך עשויה לעורר ביקורת.'
  },
  {
    id: 26,
    type: 'multiple-choice',
    difficulty: 'קשה',
    icon: '⚖️',
    category: 'חקיקה היסטורית',
    question: 'כיצד בג"ץ מתייחס לחוקי מנדט ישנים?',
    options: [
      { id: 'a', text: 'הם תמיד תקפים' },
      { id: 'b', text: 'בג"ץ בוחן אם הם סותרים זכויות יסוד' },
      { id: 'c', text: 'הם מבוטלים אוטומטית' },
      { id: 'd', text: 'רק הכנסת יכולה לבטל אותם' }
    ],
    correctAnswer: 'b',
    explanation: 'חוקים ישנים נשארים בתוקף כל עוד אינם סותרים עקרונות יסוד או חקיקה מודרנית.'
  },
  {
    id: 27,
    type: 'multiple-choice',
    difficulty: 'קשה',
    icon: '⚖️',
    category: 'עקרונות מנהליים',
    question: 'עקרון מידתיות מחייב את הרשות הציבורית:',
    options: [
      { id: 'a', text: 'להפעיל כוח מינימלי כדי להשיג מטרה חוקית' },
      { id: 'b', text: 'לפעול לפי שיקול דעת אישי בלבד' },
      { id: 'c', text: 'להתעלם מחוקי יסוד' },
      { id: 'd', text: 'לאכוף חוקים באופן שרירותי' }
    ],
    correctAnswer: 'a',
    explanation: 'מידתיות היא יסוד בהפעלת סמכויות ציבוריות, המאזן בין מטרה לחירות הפרט.'
  },
  {
    id: 28,
    type: 'multiple-choice',
    difficulty: 'קשה',
    icon: '⚖️',
    category: 'תקדימים',
    question: 'סטיית תקדים בבתי משפט ישראליים:',
    options: [
      { id: 'a', text: 'תמיד מחייבת את כל הערכאות' },
      { id: 'b', text: 'מחייבת בעיקר ערכאות נמוכות יותר' },
      { id: 'c', text: 'אינה קיימת' },
      { id: 'd', text: 'מחייבת את הכנסת' }
    ],
    correctAnswer: 'b',
    explanation: 'סטיית תקדים מחייבת את הערכאות הנמוכות יותר כדי לשמור על עקביות, אך לא מחייבת שיפוט עצמאי של בג"ץ.'
  },
  {
    id: 29,
    type: 'multiple-choice',
    difficulty: 'קשה',
    icon: '⚖️',
    category: 'קודיפיקציה',
    question: 'קודיפיקציה היא:',
    options: [
      { id: 'a', text: 'מערכת חוקים מאורגנת ומאוחדת' },
      { id: 'b', text: 'פסיקה לפי מנהג בלבד' },
      { id: 'c', text: 'חקיקה חדשה ללא בסיס' },
      { id: 'd', text: 'פסק דין מחייב' }
    ],
    correctAnswer: 'a',
    explanation: 'קודיפיקציה היא ארגון חקיקה למערכת אחת מסודרת, המקלה על פרשנות ויישום.'
  },
  {
    id: 30,
    type: 'multiple-choice',
    difficulty: 'קשה',
    icon: '⚖️',
    category: 'משפט בינלאומי',
    question: 'משפט בינלאומי מחייב בישראל כאשר:',
    options: [
      { id: 'a', text: 'הוא חלק מהחוקה' },
      { id: 'b', text: 'אומץ כחוק פנימי או התקבל בפסיקה' },
      { id: 'c', text: 'תמיד ללא תנאי' },
      { id: 'd', text: 'רק במקרה של מלחמה' }
    ],
    correctAnswer: 'b',
    explanation: 'המשפט הבינלאומי מחייב רק אם אומץ כחוק פנימי או אם בית המשפט מתחשב בו כתקדים עזר.'
  },
  
  // 🔥 רמה קשה מאוד (10 שאלות)
  {
    id: 31,
    type: 'multiple-choice',
    difficulty: 'קשה מאוד',
    icon: '⚖️',
    category: 'ביקורת שיפוטית מורכבת',
    question: 'שופט נתקל בחוק רגיל הסותר חוק יסוד: כבוד האדם וחירותו, אך החוק לא כולל פסקת הגבלה. מה עליו לעשות?',
    options: [
      { id: 'a', text: 'לפסול את החוק באופן אוטומטי' },
      { id: 'b', text: 'לנסות לפרש את החוק כך שיתאים לחוק יסוד' },
      { id: 'c', text: 'לאכוף את החוק כפי שהוא' },
      { id: 'd', text: 'להפנות את העניין לממשלה' }
    ],
    correctAnswer: 'b',
    explanation: 'כאשר חוק רגיל סותר חוק יסוד ללא פסקת הגבלה, בג"ץ ינסה לפרש את החוק כך שיתיישב עם עקרונות החוק, אך לא תמיד יוכל לפסול אותו.'
  },
  {
    id: 32,
    type: 'multiple-choice',
    difficulty: 'קשה מאוד',
    icon: '⚖️',
    category: 'סכסוכי מקורות מורכבים',
    question: 'רשות מנהלית מפרסמת תקנה הסותרת מנהג עסקי קיים. כיצד פועל השופט במקרה זה?',
    options: [
      { id: 'a', text: 'התקנה גוברת על המנהג' },
      { id: 'b', text: 'המנהג גובר על התקנה' },
      { id: 'c', text: 'מתקיים איזון בין השניים' },
      { id: 'd', text: 'השופט מחליט לפי רצונו' }
    ],
    correctAnswer: 'a',
    explanation: 'חקיקה מנהלית מחייבת; מנהגים נחשבים לעזר פרשני בלבד אם אין חוק סותר.'
  },
  {
    id: 33,
    type: 'multiple-choice',
    difficulty: 'קשה מאוד',
    icon: '⚖️',
    category: 'היררכיה נורמטיבית',
    question: 'ניתוח סכסוך סמכויות: הכנסת חוקקת חוק רגיל, הממשלה מפרסמת תקנה סותרת, ובית המשפט צריך להכריע. מהו הסדר העדיפויות?',
    options: [
      { id: 'a', text: 'חוק רגיל > תקנה > פסיקה' },
      { id: 'b', text: 'חוק יסוד > חוק רגיל > תקנה > מנהג > פסיקה' },
      { id: 'c', text: 'פסיקה > מנהג > חוק רגיל > תקנה' },
      { id: 'd', text: 'תקנה > חוק רגיל > חוק יסוד' }
    ],
    correctAnswer: 'b',
    explanation: 'היררכיית מקורות המשפט קובעת את סדר העדיפויות – חוק יסוד בראש, אחריו חקיקה ראשית, חקיקת משנה/מנהלית, מנהגים ואז פסיקה.'
  },
  {
    id: 34,
    type: 'multiple-choice',
    difficulty: 'קשה מאוד',
    icon: '⚖️',
    category: 'משפט השוואתי מורכב',
    question: 'בעת סכסוך בין פסיקה זרה לבין מנהג עסקי מקומי, מה נפוץ בבית המשפט?',
    options: [
      { id: 'a', text: 'ליישם את הפסיקה הזרה באופן מחייב' },
      { id: 'b', text: 'להעדיף את המנהג המקומי' },
      { id: 'c', text: 'להשתמש בפסיקה הזרה כהשראה בלבד' },
      { id: 'd', text: 'לבטל את המנהג' }
    ],
    correctAnswer: 'c',
    explanation: 'פסיקה זרה אינה מחייבת אך יכולה לסייע לפרשנות; מנהג מקומי יכול להיות עזר בלבד.'
  },
  {
    id: 35,
    type: 'multiple-choice',
    difficulty: 'קשה מאוד',
    icon: '⚖️',
    category: 'עקרון מידתיות',
    question: 'שופט צריך להחליט על עתירה חוקית נגד החלטת רשות ציבורית, כאשר החוק סותר עקרון מידתיות. מה הפעולה הנכונה?',
    options: [
      { id: 'a', text: 'לאכוף את החוק ללא שאלות' },
      { id: 'b', text: 'לפסול את החוק' },
      { id: 'c', text: 'להפעיל עקרון מידתיות ולהתאים את החוק' },
      { id: 'd', text: 'לשלוח לדיון בכנסת' }
    ],
    correctAnswer: 'c',
    explanation: 'עקרון מידתיות מאפשר לשופט להתאים את החוק לצורך ההגנה על זכויות יסוד.'
  },
  {
    id: 36,
    type: 'multiple-choice',
    difficulty: 'קשה מאוד',
    icon: '⚖️',
    category: 'פסקת הגבלה',
    question: 'חוקי יסוד מכילים פסקת הגבלה – כיצד היא פועלת?',
    options: [
      { id: 'a', text: 'מאפשרת לחוק רגיל לגבור על חוק יסוד' },
      { id: 'b', text: 'מאפשרת לממשלה לפסול חוקים' },
      { id: 'c', text: 'מאפשרת הגבלת זכויות תוך שמירה על יחסיות ומידתיות' },
      { id: 'd', text: 'אינה משנה את חוקי היסוד' }
    ],
    correctAnswer: 'c',
    explanation: 'פסקת ההגבלה היא כלי שמאזן בין חירות הפרט לאינטרס ציבורי, בהתאם לעקרון מידתיות.'
  },
  {
    id: 37,
    type: 'multiple-choice',
    difficulty: 'קשה מאוד',
    icon: '⚖️',
    category: 'פרשנות הרמונית',
    question: 'סיטואציה: חוק ישן סותר תקנה מנהלית חדשה – מה עדיף לבית המשפט?',
    options: [
      { id: 'a', text: 'החוק הישן תמיד גובר' },
      { id: 'b', text: 'התקנה מנהלית גוברת' },
      { id: 'c', text: 'בית המשפט ינסה לאחד את שני המקורות לפרשנות הולמת' },
      { id: 'd', text: 'לבטל את שניהם' }
    ],
    correctAnswer: 'c',
    explanation: 'שופטים נוטים ליישם פרשנות הרמונית שתשלב בין חקיקה ותיקונים, אלא אם מדובר בסתירה מוחלטת.'
  },
  {
    id: 38,
    type: 'multiple-choice',
    difficulty: 'קשה מאוד',
    icon: '⚖️',
    category: 'פרשנות דינמית מתקדמת',
    question: 'בעת פרשנות דינמית, בית המשפט צריך לשקול:',
    options: [
      { id: 'a', text: 'רק את לשון החוק' },
      { id: 'b', text: 'את המציאות החברתית ואת כוונת המחוקק' },
      { id: 'c', text: 'לפסול כל חוק שלא מתאים לחברה' },
      { id: 'd', text: 'להחיל חוקים זרים בלבד' }
    ],
    correctAnswer: 'b',
    explanation: 'פרשנות דינמית מאפשרת הסתגלות למציאות משתנה תוך שמירה על כוונת המחוקק.'
  },
  {
    id: 39,
    type: 'multiple-choice',
    difficulty: 'קשה מאוד',
    icon: '⚖️',
    category: 'משפט בינלאומי מורכב',
    question: 'אם חוקה בינלאומית קובעת זכות שאינה קיימת בחוק המקומי – מהי השפעתה?',
    options: [
      { id: 'a', text: 'חלה אוטומטית בישראל' },
      { id: 'b', text: 'פסיקה מקומית יכולה להפעיל את הזכות תוך הסתמכות על המשפט הבינלאומי' },
      { id: 'c', text: 'אין לה כל השפעה' },
      { id: 'd', text: 'הכנסת חייבת לאשר אותה' }
    ],
    correctAnswer: 'b',
    explanation: 'המשפט הבינלאומי מחייב רק אם אומץ כחוק פנימי או כתקדים עזר לפסיקה מקומית.'
  },
  {
    id: 40,
    type: 'case-study',
    difficulty: 'קשה מאוד',
    icon: '⚖️',
    category: 'סימולציית בית משפט',
    question: 'סימולציית בית משפט מלאה: עתירה על פסק דין הנוגד מנהג ומקובל עסקי. המשתמש הוא השופט – מה עליו לעשות?',
    options: [
      { id: 'a', text: 'להחיל את הפסיקה בלבד' },
      { id: 'b', text: 'להפעיל ניתוח מקיף: חוקי יסוד, חוקים רגילים, מנהגים והשפעתם' },
      { id: 'c', text: 'להתעלם מהמנהג' },
      { id: 'd', text: 'לפנות לממשלה' }
    ],
    correctAnswer: 'b',
    explanation: 'ניתוח מקיף של מקורות המשפט הוא כלי הכרחי לפסיקה נכונה במקרים מורכבים.',
    precedent: 'עקרונות ניתוח משפטי מקיף בפסיקה מורכבת'
  },
  
  // 🚀 שאלות סימולציה וניתוח מתקדמות (41-50)
  {
    id: 41,
    type: 'case-study',
    difficulty: 'קשה מאוד',
    icon: '⚖️',
    category: 'סימולציה משפטית',
    question: 'סיטואציה: חוק רגיל סותר חוק יסוד: חופש הביטוי. התקבלה עתירה לבג"ץ. מה על השופט לעשות?',
    options: [
      { id: 'a', text: 'לפסול את החוק הרגיל' },
      { id: 'b', text: 'לפרש את החוק הרגיל כך שיתיישב עם חוק היסוד' },
      { id: 'c', text: 'לאכוף את החוק הרגיל ללא שינוי' },
      { id: 'd', text: 'לשלוח את העניין לכנסת' }
    ],
    correctAnswer: 'b',
    explanation: 'בג"ץ נוטה לפרש חוקים רגילים כך שיתיישבו עם חוקי יסוד, אלא אם יש סתירה מוחלטת. תרשים היררכיה: חוקי יסוד ⚡ > חוקים רגילים > תקנות > מנהגים > פסיקה',
    precedent: 'עקרון פרשנות הרמונית בפסיקת בג"ץ'
  },
  {
    id: 42,
    type: 'case-study',
    difficulty: 'קשה מאוד',
    icon: '✨',
    category: 'סכסוכי מקורות',
    question: 'סיטואציה: מנהג עסקי סותר תקנה מנהלית חדשה. מהי ההכרעה המשפטית?',
    options: [
      { id: 'a', text: 'המנהג גובר על התקנה' },
      { id: 'b', text: 'התקנה גוברת על המנהג' },
      { id: 'c', text: 'אין הכרעה' },
      { id: 'd', text: 'ניתן להחיל את שני המקורות בו זמנית' }
    ],
    correctAnswer: 'b',
    explanation: 'חקיקה מנהלית מחייבת; מנהגים מהווים כלי פרשני בלבד.',
    precedent: 'עליונות חקיקה על מנהגים'
  },
  {
    id: 43,
    type: 'case-study',
    difficulty: 'קשה מאוד',
    icon: '🧩',
    category: 'היררכיה נורמטיבית',
    question: 'סיטואציה: נדרש ניתוח סכסוך סמכויות בין חוקים שונים – חוק רגיל מול תקנה מנהלית. מהו סדר העדיפויות?',
    options: [
      { id: 'a', text: 'חוק רגיל > תקנה' },
      { id: 'b', text: 'חוק יסוד > חוק רגיל > תקנה > מנהג > פסיקה' },
      { id: 'c', text: 'תקנה > חוק רגיל' },
      { id: 'd', text: 'פסיקה > מנהג > חוק רגיל' }
    ],
    correctAnswer: 'b',
    explanation: 'היררכיה ברורה עוזרת לשופט במצבי סתירה בין מקורות משפט.',
    precedent: 'היררכיית מקורות המשפט הישראלי'
  },
  {
    id: 44,
    type: 'case-study',
    difficulty: 'קשה מאוד',
    icon: '🌐',
    category: 'משפט השוואתי',
    question: 'סיטואציה: פסיקה זרה מצוטטת במערכת המשפט המקומית, סותרת מנהג עסקי מקומי. מהי ההשפעה?',
    options: [
      { id: 'a', text: 'פסיקה זרה מחייבת' },
      { id: 'b', text: 'מנהג גובר' },
      { id: 'c', text: 'פסיקה זרה משמשת כהשראה בלבד' },
      { id: 'd', text: 'המנהג מבוטל' }
    ],
    correctAnswer: 'c',
    explanation: 'פסיקה זרה אינה מחייבת, אך עשויה להעשיר את הפרשנות המקומית.',
    precedent: 'מעמד המשפט השוואתי בפסיקה ישראלית'
  },
  {
    id: 45,
    type: 'case-study',
    difficulty: 'קשה מאוד',
    icon: '📌',
    category: 'עקרון מידתיות',
    question: 'סיטואציה: שופט צריך להחליט על עתירה נגד החלטת רשות ציבורית, החוק סותר עקרון מידתיות. מה הפעולה הנכונה?',
    options: [
      { id: 'a', text: 'לאכוף החוק ללא שאלות' },
      { id: 'b', text: 'לפסול את החוק' },
      { id: 'c', text: 'להפעיל עקרון מידתיות ולהתאים את החוק' },
      { id: 'd', text: 'לשלוח לדיון בכנסת' }
    ],
    correctAnswer: 'c',
    explanation: 'עקרון מידתיות מאפשר לשופט להתאים את החוק תוך שמירה על זכויות יסוד.',
    precedent: 'הלכת מידתיות במשפט הישראלי'
  },
  {
    id: 46,
    type: 'case-study',
    difficulty: 'קשה מאוד',
    icon: '⚡',
    category: 'פסקת הגבלה',
    question: 'סיטואציה: חוקי יסוד כוללים פסקת הגבלה – כיצד היא פועלת?',
    options: [
      { id: 'a', text: 'מאפשרת לחוק רגיל לגבור על חוק יסוד' },
      { id: 'b', text: 'מאפשרת לממשלה לפסול חוקים' },
      { id: 'c', text: 'מאפשרת הגבלת זכויות תוך שמירה על יחסיות ומידתיות' },
      { id: 'd', text: 'אינה משנה את חוקי היסוד' }
    ],
    correctAnswer: 'c',
    explanation: 'פסקת ההגבלה מאזנת בין חירות הפרט לאינטרס ציבורי בהתאם לעקרון מידתיות.',
    precedent: 'פסקת ההגבלה בחוק יסוד: כבוד האדם וחירותו'
  },
  {
    id: 47,
    type: 'case-study',
    difficulty: 'קשה מאוד',
    icon: '🧩',
    category: 'פרשנות הרמונית',
    question: 'סיטואציה: חוק ישן סותר תקנה מנהלית חדשה. מהי הדרך המשפטית הנכונה?',
    options: [
      { id: 'a', text: 'החוק הישן תמיד גובר' },
      { id: 'b', text: 'התקנה גוברת' },
      { id: 'c', text: 'בית המשפט ינסה לאחד את שני המקורות לפרשנות הולמת' },
      { id: 'd', text: 'לבטל את שניהם' }
    ],
    correctAnswer: 'c',
    explanation: 'פרשנות הרמונית מאפשרת שילוב בין חקיקה ותיקונים.',
    precedent: 'דוקטרינת הפרשנות ההרמונית'
  },
  {
    id: 48,
    type: 'case-study',
    difficulty: 'קשה מאוד',
    icon: '🌐',
    category: 'פרשנות דינמית',
    question: 'סיטואציה: פרשנות דינמית – בית המשפט צריך להתאים חוק למציאות חברתית חדשה. מה עליו לשקול?',
    options: [
      { id: 'a', text: 'רק את לשון החוק' },
      { id: 'b', text: 'את המציאות החברתית ואת כוונת המחוקק' },
      { id: 'c', text: 'לפסול כל חוק לא מתאים' },
      { id: 'd', text: 'להחיל חוקים זרים בלבד' }
    ],
    correctAnswer: 'b',
    explanation: 'פרשנות דינמית מאפשרת הסתגלות למציאות משתנה תוך שמירה על כוונת המחוקק.',
    precedent: 'דוקטרינת הפרשנות הדינמית'
  },
  {
    id: 49,
    type: 'case-study',
    difficulty: 'קשה מאוד',
    icon: '🌍',
    category: 'משפט בינלאומי',
    question: 'סיטואציה: חוקה בינלאומית קובעת זכות שאינה קיימת בחוק המקומי. מהי השפעתה?',
    options: [
      { id: 'a', text: 'חלה אוטומטית' },
      { id: 'b', text: 'פסיקה מקומית יכולה להפעיל את הזכות תוך הסתמכות על המשפט הבינלאומי' },
      { id: 'c', text: 'אין לה כל השפעה' },
      { id: 'd', text: 'הכנסת חייבת לאשר אותה' }
    ],
    correctAnswer: 'b',
    explanation: 'המשפט הבינלאומי משמש השראה בלבד אלא אם אומץ כחוק פנימי.',
    precedent: 'מעמד המשפט הבינלאומי במערכת המשפט הישראלית'
  },
  {
    id: 50,
    type: 'case-study',
    difficulty: 'קשה מאוד',
    icon: '🧩',
    category: 'סימולציית בית משפט מלאה',
    question: 'סימולציית בית משפט מלאה: עתירה על פסק דין הנוגד מנהג ומקובל עסקי. המשתמש הוא השופט – מה עליו לעשות?',
    options: [
      { id: 'a', text: 'להחיל את הפסיקה בלבד' },
      { id: 'b', text: 'להפעיל ניתוח מקיף: חוקי יסוד, חוקים רגילים, מנהגים והשפעתם' },
      { id: 'c', text: 'להתעלם מהמנהג' },
      { id: 'd', text: 'לפנות לממשלה' }
    ],
    correctAnswer: 'b',
    explanation: 'ניתוח מקיף של מקורות המשפט הוא כלי הכרחי לפסיקה נכונה במקרים מורכבים. השופט חייב לשקול את כל המקורות: חוקי יסוד, חקיקה רגילה, תקדימים, מנהגים ועקרונות יסוד.',
    precedent: 'מתודולוגיה לניתוח משפטי מקיף בפסיקה מורכבת'
  }
];

const ComprehensiveLegalSourcesExam: React.FC = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const [score, setScore] = useState(0);
  const [timeStarted, setTimeStarted] = useState<Date | null>(null);
  const [examCompleted, setExamCompleted] = useState(false);

  const currentQuestion = questions[currentQuestionIndex];

  const handleAnswerSelect = (answerId: string) => {
    if (showFeedback) return;
    
    setSelectedAnswer(answerId);
    setAnswers({ ...answers, [currentQuestion.id]: answerId });
    setShowFeedback(true);
    
    if (answerId === currentQuestion.correctAnswer) {
      setScore(score + 1);
    }
    
    if (!timeStarted) {
      setTimeStarted(new Date());
    }
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setShowFeedback(false);
    } else {
      setExamCompleted(true);
    }
  };

  const prevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setSelectedAnswer(answers[questions[currentQuestionIndex - 1].id] || null);
      setShowFeedback(!!answers[questions[currentQuestionIndex - 1].id]);
    }
  };

  const resetExam = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setShowFeedback(false);
    setAnswers({});
    setScore(0);
    setTimeStarted(null);
    setExamCompleted(false);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'קל': return 'text-green-600 bg-green-100';
      case 'בינוני': return 'text-yellow-600 bg-yellow-100';
      case 'קשה': return 'text-orange-600 bg-orange-100';
      case 'קשה מאוד': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getScoreColor = (percentage: number) => {
    if (percentage >= 90) return 'text-green-600 bg-green-100';
    if (percentage >= 80) return 'text-blue-600 bg-blue-100';
    if (percentage >= 70) return 'text-yellow-600 bg-yellow-100';
    if (percentage >= 60) return 'text-orange-600 bg-orange-100';
    return 'text-red-600 bg-red-100';
  };

  if (examCompleted) {
    const percentage = Math.round((score / questions.length) * 100);
    
    return (
      <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg" dir="rtl">
        <div className="text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Trophy className="w-12 h-12 text-yellow-500" />
            <h1 className="text-3xl font-bold text-gray-800">מבחן הושלם!</h1>
            <Trophy className="w-12 h-12 text-yellow-500" />
          </div>
          
          <div className={`inline-block px-8 py-4 rounded-lg mb-6 ${getScoreColor(percentage)}`}>
            <h2 className="text-2xl font-bold mb-2">הציון שלך: {score}/{questions.length}</h2>
            <p className="text-xl">{percentage}%</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="text-lg font-bold text-blue-800 mb-4">📊 סטטיסטיקות</h3>
              <div className="space-y-2 text-blue-700">
                <p>שאלות נכונות: {score}</p>
                <p>שאלות שגויות: {questions.length - score}</p>
                <p>אחוז הצלחה: {percentage}%</p>
              </div>
            </div>
            
            <div className="bg-green-50 p-6 rounded-lg">
              <h3 className="text-lg font-bold text-green-800 mb-4">🎯 המלצות</h3>
              <div className="space-y-2 text-green-700">
                {percentage >= 90 && <p>מעולה! שליטה מצוינת בחומר</p>}
                {percentage >= 80 && percentage < 90 && <p>טוב מאוד! עדיין יש מקום לשיפור קל</p>}
                {percentage >= 70 && percentage < 80 && <p>בסדר, כדאי לחזור על חלק מהחומר</p>}
                {percentage < 70 && <p>מומלץ לחזור על החומר ולנסות שוב</p>}
              </div>
            </div>
          </div>
          
          <div className="flex justify-center gap-4">
            <button
              onClick={resetExam}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <BookOpen className="w-5 h-5" />
              נסה שוב
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg" dir="rtl">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Scale className="w-8 h-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-800">מבחן מקיף - מקורות המשפט</h1>
          <FileText className="w-8 h-8 text-green-600" />
        </div>
        <p className="text-lg text-gray-600">מבחן מקיף עם 50 שאלות מחולקות לפי רמות קושי</p>
        
        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-3 mt-6">
          <Box 
            className="bg-blue-600 h-3 rounded-full transition-all duration-300"
            sx={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
          />
        </div>
        <p className="text-sm text-gray-600 mt-2">
          שאלה {currentQuestionIndex + 1} מתוך {questions.length}
        </p>
        
        {/* Stats */}
        <div className="flex justify-between items-center mt-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-600" />
            <span className="font-semibold">ציון נוכחי: {score}/{Object.keys(answers).length}</span>
          </div>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(currentQuestion.difficulty)}`}>
            {currentQuestion.difficulty}
          </span>
        </div>
      </div>

      {/* Question */}
      <div className="bg-blue-50 rounded-lg p-6 mb-6">
        <div className="flex items-start gap-4 mb-4">
          <span className="text-3xl">{currentQuestion.icon}</span>
          <div className="flex-1">
            <div className="flex justify-between items-start mb-2">
              <h2 className="text-xl font-bold text-blue-800">
                שאלה {currentQuestion.id}
              </h2>
              <span className="text-sm bg-blue-200 text-blue-800 px-2 py-1 rounded">
                {currentQuestion.category}
              </span>
            </div>
            <p className="text-blue-700 text-lg leading-relaxed">{currentQuestion.question}</p>
          </div>
        </div>
      </div>

      {/* Answer Options */}
      {currentQuestion.type === 'multiple-choice' && (
        <div className="space-y-4 mb-6">
          {currentQuestion.options?.map((option) => (
            <button
              key={option.id}
              onClick={() => handleAnswerSelect(option.id)}
              disabled={showFeedback}
              className={`w-full p-4 text-right rounded-lg border-2 transition-all duration-200 ${
                showFeedback
                  ? option.id === currentQuestion.correctAnswer
                    ? 'border-green-500 bg-green-50 text-green-800'
                    : option.id === selectedAnswer
                    ? 'border-red-500 bg-red-50 text-red-800'
                    : 'border-gray-200 bg-gray-50 text-gray-600'
                  : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50 cursor-pointer'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="font-bold text-lg">{option.id.toUpperCase()}.</span>
                  <span className="text-lg">{option.text}</span>
                </div>
                <div>
                  {showFeedback && option.id === currentQuestion.correctAnswer && (
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  )}
                  {showFeedback && option.id === selectedAnswer && option.id !== currentQuestion.correctAnswer && (
                    <XCircle className="w-6 h-6 text-red-600" />
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Feedback */}
      {showFeedback && (
        <div className="bg-gray-50 rounded-lg p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            {selectedAnswer === currentQuestion.correctAnswer ? (
              <CheckCircle className="w-6 h-6 text-green-600" />
            ) : (
              <XCircle className="w-6 h-6 text-red-600" />
            )}
            <h3 className="text-lg font-bold text-gray-800">
              {selectedAnswer === currentQuestion.correctAnswer ? '✅ נכון!' : '❌ לא נכון'}
            </h3>
          </div>
          
          <div className="bg-white p-4 rounded-lg border-r-4 border-blue-500">
            <h4 className="font-bold text-blue-800 mb-2 flex items-center gap-2">
              💡 הסבר:
            </h4>
            <p className="text-gray-700">{currentQuestion.explanation}</p>
          </div>
          
          {currentQuestion.precedent && (
            <div className="bg-white p-4 rounded-lg border-r-4 border-green-500 mt-4">
              <h4 className="font-bold text-green-800 mb-2 flex items-center gap-2">
                📜 פסיקה רלוונטית:
              </h4>
              <p className="text-gray-700">{currentQuestion.precedent}</p>
            </div>
          )}
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between items-center">
        <div className="flex gap-4">
          {currentQuestionIndex > 0 && (
            <button
              onClick={prevQuestion}
              className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              ← שאלה קודמת
            </button>
          )}
        </div>
        
        <div className="flex gap-4">
          {showFeedback && (
            <button
              onClick={nextQuestion}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {currentQuestionIndex < questions.length - 1 ? 'שאלה הבאה →' : 'סיים מבחן 🏁'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ComprehensiveLegalSourcesExam;

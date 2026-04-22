import React, { useState, useCallback } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Chip,
  LinearProgress,
  Grid,
  Paper,
  IconButton,
  Tooltip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
} from '@mui/material';
import {
  Refresh as RefreshIcon,
  CheckCircle as KnewItIcon,
  Cancel as DidntKnowIcon,
  Shuffle as ShuffleIcon,
  FilterList as FilterIcon,
  EmojiEvents as TrophyIcon,
  School as SchoolIcon,
} from '@mui/icons-material';

interface Flashcard {
  id: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard' | 'very-hard';
  front: string;
  back: string;
  hint?: string;
  example?: string;
}

const flashcards: Flashcard[] = [
  // מקורות המשפט
  { id: 'f1', category: 'מקורות המשפט', difficulty: 'easy', front: 'מהי החקיקה הראשית?', back: 'חוקים שמחוקקת הכנסת כמוסד המחוקק העליון. עליונים על חקיקת משנה ותקנות.', example: 'חוק העונשין, חוק החוזים, חוק יסוד: כבוד האדם' },
  { id: 'f2', category: 'מקורות המשפט', difficulty: 'easy', front: 'מהי חקיקת משנה?', back: 'תקנות, צווים והוראות המונעות על פי חוק ראשי. כפופה לחקיקה ראשית וחייבת בסיס חוקי.', example: 'תקנות עבודה, תקנות תעבורה, צווי שעת חירום' },
  { id: 'f3', category: 'מקורות המשפט', difficulty: 'medium', front: 'מהם חוקי היסוד ומה מעמדם?', back: 'מהווים מעין חוקה חלקית. עליונים על חוקים רגילים. חוקים עם פסקת הגבלה מאפשרים ביקורת שיפוטית.', hint: 'חשוב על "חוקה" ישראלית' },
  { id: 'f4', category: 'מקורות המשפט', difficulty: 'hard', front: 'מה קובע חוק יסודות המשפט 1980?', back: 'כאשר יש לאקונה בחוק שלא ניתן למלאה מחקיקה, פסיקה או היקש — יפנה השופט למורשת ישראל (עקרונות חירות, צדק, יושר ושלום של מורשת ישראל).', example: 'שופט שנתקל בחסר משפטי שלא מוסדר — פונה למורשת ישראל לפני משפט השוואתי' },
  { id: 'f5', category: 'מקורות המשפט', difficulty: 'medium', front: 'מה הם מקורות עזר במשפט הישראלי?', back: 'ספרות משפטית, משפט השוואתי, מורשת ישראל ועקרונות כלליים. אינם מחייבים אך משמשים לפרשנות.', hint: 'מנחים, לא מחייבים' },

  // תקדימים
  { id: 'f6', category: 'תקדימים', difficulty: 'easy', front: 'מה זה Stare Decisis?', back: 'עיקרון התקדים המחייב — ערכאות נמוכות חייבות לפסוק לפי תקדים שנקבע בערכאות גבוהות, לשם יציבות ועקביות.', example: 'בית משפט שלום חייב ללכת לפי פסיקת עליון' },
  { id: 'f7', category: 'תקדימים', difficulty: 'hard', front: 'מה זה Ratio Decidendi?', back: 'הנימוק המשפטי המהותי שעליו מבוסס פסק הדין והמחייב כתקדים — להבדיל מה-Obiter Dictum שאינו מחייב.', hint: 'הלב המחייב של פסק הדין' },
  { id: 'f8', category: 'תקדימים', difficulty: 'hard', front: 'מה זה Obiter Dictum?', back: 'אמרה אגבית בפסק דין שאינה נחוצה לפסיקה עצמה — אינה מחייבת אך עשויה להנחות (בפרט כשמדובר בעליון).', example: 'שופט שמביע דעה על שאלה שאינה לב הסכסוך' },
  { id: 'f9', category: 'תקדימים', difficulty: 'medium', front: 'כיצד בית המשפט העליון יכול לסטות מתקדים קודם?', back: 'בהרכב מורחב (9-11 שופטים) עם נימוק מפורט: שינוי נסיבות, התפתחות חברתית, תיקון טעות משפטית או פגיעה בצדק.', hint: 'הרכב מיוחד נדרש' },
  { id: 'f10', category: 'תקדימים', difficulty: 'medium', front: 'מה זה תקדים מנחה (Persuasive Precedent)?', back: 'פסיקה שאינה מחייבת פורמלית אך בית המשפט יתחשב בה: פסיקות ממדינות מערב, ערכאות מקבילות, ואמרות אגב של העליון.', example: 'פסיקת בית הלורדים הבריטי בנושאי חוזים' },

  // פרשנות
  { id: 'f11', category: 'פרשנות', difficulty: 'easy', front: 'מה זה פרשנות לשונית?', back: 'פירוש על בסיס המילים והניסוח בלבד, ללא התייחסות לכוונות. מתאים לחוקים ברורים וחד-משמעיים.', hint: 'עצור בלשון החוק' },
  { id: 'f12', category: 'פרשנות', difficulty: 'medium', front: 'מה זה פרשנות תכליתית?', back: 'פרשנות החוק לפי מטרתו וכוונת המחוקק. גישה גמישה המאפשרת איזון זכויות יסוד מול אינטרסים ציבוריים.', example: 'בג"ץ 6055/95 צמח נגד שר הביטחון' },
  { id: 'f13', category: 'פרשנות', difficulty: 'medium', front: 'מה זה Contra Proferentem?', back: 'כאשר יש ספק בנוסח חוזה — יפורש לרעת הצד שניסח אותו. נפוץ בחוזים אחידים ובפוליסות ביטוח.', example: 'חברת ביטוח שניסחה פוליסה עמומה — יפורש לטובת המבוטח' },
  { id: 'f14', category: 'פרשנות', difficulty: 'hard', front: 'מה ההבדל בין פרשנות היסטורית לתכליתית?', back: 'היסטורית: כוונת המחוקק המקורית (דברי הכנסת, פרוטוקולים). תכליתית: מטרת החוק כיום. בישראל — התכליתית גוברת.', hint: 'בית המשפט הישראלי מעדיף אחת על השנייה' },

  // עקרונות מנהליים
  { id: 'f15', category: 'עקרונות', difficulty: 'easy', front: 'מה זה עקרון חוקיות המנהל?', back: 'הרשות המבצעת רשאית לפעול רק על סמך חוק או תקנה תקפה. פעולה ללא סמכות — בטלה.', example: 'שר שמוציא צו ללא הסמכה בחוק — הצו בטל' },
  { id: 'f16', category: 'עקרונות', difficulty: 'medium', front: 'מהם שלושת שלבי מבחן המידתיות?', back: '1. קשר רציונלי (הפגיעה קשורה לתכלית) 2. אמצעי פחות פוגעני (אין חלופה) 3. מידתיות במובן הצר (יחס ראוי בין פגיעה לתועלת).', hint: 'שלושה שלבים, כולם חייבים להתקיים' },
  { id: 'f17', category: 'עקרונות', difficulty: 'medium', front: 'מה זה זכות הטיעון (שימוע)?', back: 'מי שעלול להיפגע מהחלטה מנהלית זכאי לשמוע ולהישמע לפני קבלתה. הפרה עשויה לגרום לבטלות ההחלטה.', example: 'פיטורי עובד בלי לשמוע אותו — ההחלטה עשויה להתבטל' },
  { id: 'f18', category: 'עקרונות', difficulty: 'hard', front: 'מה זה עקרון הסבירות ומה קרה לו ב-2023?', back: 'החלטות מנהליות חייבות להיות סבירות. תיקון לחוק יסוד: השפיטה (2023) ביקש להגביל את שימוש בגץ בעילה זו (בוטל בבג"ץ).', hint: 'שינוי משפטי-חוקתי שנוי במחלוקת' },
  { id: 'f19', category: 'עקרונות', difficulty: 'easy', front: 'מהי הפרדת הרשויות?', back: 'חלוקת הסמכות בין רשות מחוקקת (כנסת), מבצעת (ממשלה) ושופטת (בתי משפט), כאשר כל רשות מבקרת ומאזנת את האחרות.', example: 'בג"ץ מבקר ממשלה; ועדת חוקה מפקחת; הממשלה מבצעת חוקי כנסת' },

  // דיני חוזים
  { id: 'f20', category: 'דיני חוזים', difficulty: 'easy', front: 'מהם יסודות כריתת חוזה?', back: 'הצעה + קיבול + גמירת דעת + מסוימות. ארבעת יסודות אלה חייבים להתקיים לכריתת חוזה תקף.', example: 'מוכר מציע מחיר, קונה מקבל, שניהם רוצים לקשור עצמם, הפרטים מוגדרים' },
  { id: 'f21', category: 'דיני חוזים', difficulty: 'medium', front: 'מה זה עושק בחוזה?', back: 'ניצול מצוקה, חולשה שכלית, חוסר ניסיון או קלות דעת כדי לכרות חוזה בתנאים גרועים. מאפשר ביטול החוזה.', example: 'מלווה בריבית עצומה לאדם במצוקה כלכלית קשה' },
  { id: 'f22', category: 'דיני חוזים', difficulty: 'medium', front: 'מה זה חוזה אחיד?', back: 'חוזה שתנאיו נקבעו מראש ע"י צד אחד לשימוש חוזר — הצד השני רק מצרף. בית משפט יכול לבטל תנאים מקפחים.', example: 'חוזי בנקים, ביטוח, פלאפון, שירותי אינטרנט' },
  { id: 'f23', category: 'דיני חוזים', difficulty: 'hard', front: 'מה ההבדל בין הפרה יסודית להפרה רגילה?', back: 'יסודית: מה שהצד הנפגע ראה כחיוני שיקויים (בפועל או מהות העסקה) — מזכה בביטול מיידי. רגילה: רק בפיצויים, לא ביטול.', hint: 'הפרה יסודית = ביטול + פיצויים; רגילה = פיצויים בלבד' },
  { id: 'f24', category: 'דיני חוזים', difficulty: 'medium', front: 'מה זה עיקרון תום הלב בחוזה?', back: 'סעיף 12 לחוק החוזים: חובה לנהל משא ומתן בתום לב. סעיף 39: חובה לקיים חוזה בתום לב. הפרה — אחריות בנזיקין.', example: 'מי שמנהל מו"מ ומתכוון לא לכרות חוזה — מפר תום לב' },

  // דיני עונשין
  { id: 'f25', category: 'דיני עונשין', difficulty: 'medium', front: 'מהם יסודות העבירה הפלילית?', back: '1. יסוד עובדתי (Actus Reus) — ההתנהגות האסורה 2. יסוד נפשי (Mens Rea) — הכוונה או הרשלנות. שניהם נדרשים לרוב.', hint: 'מחשבה + מעשה' },
  { id: 'f26', category: 'דיני עונשין', difficulty: 'hard', front: 'מה ההבדל בין כוונה לפזיזות לרשלנות פלילית?', back: 'כוונה: רוצה את התוצאה. פזיזות: אדיש לסיכון שיוצר. רשלנות: צריך היה לצפות הסיכון אבל לא צפה אותו.', example: 'מתכנן רצח (כוונה) vs. נסע מהר בדרך שוממה (פזיזות) vs. שכח ילד ברכב (רשלנות)' },
  { id: 'f27', category: 'דיני עונשין', difficulty: 'medium', front: 'מה זה הגנת אי-שפיות?', back: 'נאשם שעקב מחלת נפש לא הבין את טיב מעשיו או שלא היה כוח להימנע ממנו — פטור מאחריות פלילית (סעיף 34ח לחוק העונשין).', hint: 'חוסר יכולת להבין או לשלוט' },

  // משפט מנהלי
  { id: 'f28', category: 'משפט מנהלי', difficulty: 'medium', front: 'מהן עילות הביקורת השיפוטית על מנהל?', back: '1. חוקיות (חריגה מסמכות) 2. סבירות (החלטה בלתי סבירה) 3. שיקולים זרים 4. הפליה 5. הפרת כללי צדק טבעי.', hint: 'חמש עילות עיקריות' },
  { id: 'f29', category: 'משפט מנהלי', difficulty: 'hard', front: 'מה זה "בטלות יחסית" בהחלטה מנהלית?', back: 'החלטה מנהלית פגומה אינה בטלה אוטומטית — בית המשפט שוקל מידת הפגם, אינטרסים מוגנים, ותוצאות הביטול לפני שמבטל.', example: 'פגם פרוצדורלי קל לא יגרום בהכרח לביטול רישיון שכבר ניתן' },
  { id: 'f30', category: 'משפט מנהלי', difficulty: 'medium', front: 'מהי זכות העיון בתיק מנהלי?', back: 'מי שעלול להיפגע מהחלטה מנהלית זכאי לעיין בחומר שעל בסיסו תתקבל ההחלטה, כחלק מזכות הטיעון.', hint: 'קשור לזכות הטיעון — אי אפשר להתגונן על מה שלא ידוע לך' },

  // משפט בינלאומי
  { id: 'f31', category: 'משפט בינלאומי', difficulty: 'medium', front: 'כיצד אמנות בינלאומיות נקלטות בישראל?', back: 'שיטת ה-Transformation הבריטית: אמנה חלה פנימית רק לאחר עיגון בחקיקה. עם זאת — משמשת לפרשנות חקיקה קיימת.', example: 'אמנת זכויות הילד עוגנה בחוק הנוער; אמנת UN לנכויות עוגנה בחוק השוויון' },
  { id: 'f32', category: 'משפט בינלאומי', difficulty: 'hard', front: 'מה זה Jus Cogens?', back: 'נורמות בינלאומיות עליונות שאין להתנות עליהן ואיתן לא ניתן להתנות. אמנה שסותרת נורמת Jus Cogens — בטלה.', example: 'איסור רצח עם, איסור עבדות, איסור עינויים, Non-refoulement' },
  { id: 'f33', category: 'משפט בינלאומי', difficulty: 'medium', front: 'מה זה משפט בינלאומי מנהגי?', back: 'נורמות שנוצרו מנוהג חוזר של מדינות + אמונה שמחייב (Opinio Juris). חל על כל המדינות ונקלט בישראל ישירות.', hint: 'בניגוד לאמנות — חל ללא חתימה' },

  // משפט חוקתי
  { id: 'f34', category: 'משפט חוקתי', difficulty: 'medium', front: 'מה זה פסקת ההגבלה בחוקי יסוד?', back: 'הוראה בחוק יסוד המאפשרת לבית המשפט לבחון אם חוק רגיל פוגע בזכות יסוד. תנאים: מבחן מידתיות, ערכי מדינה, הגינות.', example: 'חוק יסוד: כבוד האדם — סעיף 8 (פסקת ההגבלה)' },
  { id: 'f35', category: 'משפט חוקתי', difficulty: 'easy', front: 'מהם חוקי היסוד העיקריים הקיימים?', back: 'הכנסת, נשיא המדינה, הממשלה, משק המדינה, צבא, ירושלים, שפיטה, כבוד האדם וחירותו, חופש העיסוק, משאל העם.', hint: '11 חוקי יסוד קיימים כיום' },
  { id: 'f36', category: 'משפט חוקתי', difficulty: 'hard', front: 'מה זה פסק הדין "בנק המזרחי" ומה חשיבותו?', back: 'בג"ץ 6821/93 — בית המשפט העליון הכיר לראשונה בסמכותו לבטל חקיקה הסותרת חוקי יסוד. "מהפכה חוקתית".', hint: 'נקודת מפנה בדיני החוקה הישראלית' },

  // נזיקין
  { id: 'f37', category: 'דיני נזיקין', difficulty: 'medium', front: 'מהם יסודות עוולת הרשלנות?', back: '1. חובת זהירות 2. הפרת חובת הזהירות 3. נזק 4. קשר סיבתי בין ההפרה לנזק. כולם חייבים להתקיים.', hint: 'ארבעה יסודות — כולם הכרחיים' },
  { id: 'f38', category: 'דיני נזיקין', difficulty: 'hard', front: 'מה זה "האדם הסביר" במבחן הרשלנות?', back: 'סטנדרט אובייקטיבי: מה היה עושה אדם סביר ומיומן בנסיבות אלה? לא תלוי ביכולות הנתבע הספציפי.', example: 'רופא נשפט לפי סטנדרט הרופא הסביר, לא לפי יכולותיו האישיות' },
  { id: 'f39', category: 'דיני נזיקין', difficulty: 'medium', front: 'מה זה "מעשה תורם" (רשלנות תורמת)?', back: 'כשהניזוק תרם בעצמו לנזקו — אחריות מחלק לפי אחוזים. אינו שולל פיצוי אלא מקטין אותו (פקודת הנזיקין סעיף 68).', example: 'נהג שנפגע אך לא חבש חגורת בטיחות — פיצויו יקטן' },

  // דיני משפחה
  { id: 'f40', category: 'דיני משפחה', difficulty: 'easy', front: 'מה קובע חוק שיווי זכויות האישה לעניין גירושין?', back: 'אין לכפות גירושין על אישה, אך גם לא ניתן לחייב גבר לגרש ללא הסכמתו (בישראל — גט פיטורין הדדי דרוש). בעיית "עגונות".', hint: 'הצומת בין המשפט הדתי לאזרחי' },
  { id: 'f41', category: 'דיני משפחה', difficulty: 'medium', front: 'כיצד נקבעת משמורת ילדים בישראל?', back: 'עקרון "טובת הילד" הוא הקובע. בית המשפט שוקל: גיל הילד, קשר עם כל הורה, יציבות, העדפת הילד (מגיל מסוים) ועוד.', example: 'ילדים עד גיל 6 — נטייה לאם; מעל 6 — טובת הילד כפרמטר מרכזי' },
  { id: 'f42', category: 'דיני משפחה', difficulty: 'hard', front: 'מה זה "חזקת השיתוף" בנכסי בני זוג?', back: 'בני זוג שחיים בשיתוף ויוצרים משק בית משותף — חזקה שהנכסים שנצברו יחולקו שווה בשווה, גם אם רשומים על שם אחד.', example: 'בית שנרכש ע"ש הבעל בלבד — אשתו זכאית למחציתו בגירושין (בנסיבות מסוימות)' },

  // דיני עבודה
  { id: 'f43', category: 'דיני עבודה', difficulty: 'easy', front: 'מהן זכויות יסוד של עובד בישראל?', back: 'שכר מינימום, ימי חופשה, דמי מחלה, פיצויי פיטורין (שנה+), הפרשה לפנסיה, הגנה מפני פיטורים שלא כדין.', hint: 'כל אלה מוגנים בחקיקה ספציפית' },
  { id: 'f44', category: 'דיני עבודה', difficulty: 'medium', front: 'מתי מגיעים פיצויי פיטורין?', back: 'עובד שפוטר לאחר שנה (ולעיתים גם בהתפטרות מסיבות מוצדקות). חישוב: שכר חודשי × שנות עבודה.', example: 'עובד שעבד 5 שנים ושכרו 10,000 ₪ — מגיעים לו 50,000 ₪ פיצויי פיטורין' },

  // ירושה
  { id: 'f45', category: 'דיני ירושה', difficulty: 'medium', front: 'מה ההבדל בין ירושה על פי דין לצוואה?', back: 'דין: ברירת מחדל — בן/בת זוג + ילדים ראשונים, אחר כך קרובים נוספים. צוואה: קובעת אחרת — מחייבת מתנת מחייה.', hint: 'צוואה גוברת על הדין — אלא אם פסולה' },
  { id: 'f46', category: 'דיני ירושה', difficulty: 'hard', front: 'מה זה "חלק שמור" בירושה?', back: 'אין בישראל "חלק שמור" חוקי (Forced Share) כמו בצרפת — מצוות המחוקק ניתן לנשל ילדים מירושה אם יש צוואה תקפה.', hint: 'בניגוד לשיטות אירופיות רבות' },
];

const categories = ['הכל', 'מקורות המשפט', 'תקדימים', 'פרשנות', 'עקרונות', 'דיני חוזים', 'דיני עונשין', 'משפט מנהלי', 'משפט בינלאומי', 'משפט חוקתי', 'דיני נזיקין', 'דיני משפחה', 'דיני עבודה', 'דיני ירושה'];

const difficultyColors: Record<string, string> = {
  easy: '#4caf50',
  medium: '#ff9800',
  hard: '#f44336',
  'very-hard': '#9c27b0',
};

const difficultyLabels: Record<string, string> = {
  easy: 'קל',
  medium: 'בינוני',
  hard: 'קשה',
  'very-hard': 'קשה מאוד',
};

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export const LegalFlashcards: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('הכל');
  const [deck, setDeck] = useState<Flashcard[]>(() => shuffle(flashcards));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [known, setKnown] = useState<Set<string>>(new Set());
  const [unknown, setUnknown] = useState<Set<string>>(new Set());
  const [showHint, setShowHint] = useState(false);
  const [sessionDone, setSessionDone] = useState(false);

  const filteredDeck = selectedCategory === 'הכל'
    ? deck
    : deck.filter(c => c.category === selectedCategory);

  const current = filteredDeck[currentIndex];
  const progress = filteredDeck.length > 0 ? ((currentIndex) / filteredDeck.length) * 100 : 0;

  const handleCategoryChange = useCallback((cat: string) => {
    setSelectedCategory(cat);
    setCurrentIndex(0);
    setIsFlipped(false);
    setShowHint(false);
    setSessionDone(false);
  }, []);

  const handleReshuffle = useCallback(() => {
    setDeck(shuffle(flashcards));
    setCurrentIndex(0);
    setIsFlipped(false);
    setShowHint(false);
    setKnown(new Set());
    setUnknown(new Set());
    setSessionDone(false);
  }, []);

  const advance = useCallback((markAs: 'known' | 'unknown') => {
    if (!current) return;
    if (markAs === 'known') {
      setKnown(prev => new Set(prev).add(current.id));
    } else {
      setUnknown(prev => new Set(prev).add(current.id));
    }
    setIsFlipped(false);
    setShowHint(false);
    const next = currentIndex + 1;
    if (next >= filteredDeck.length) {
      setSessionDone(true);
    } else {
      setCurrentIndex(next);
    }
  }, [current, currentIndex, filteredDeck.length]);

  const reviewUnknown = useCallback(() => {
    const unknownCards = flashcards.filter(c => unknown.has(c.id));
    setDeck(shuffle(unknownCards));
    setCurrentIndex(0);
    setIsFlipped(false);
    setShowHint(false);
    setKnown(new Set());
    setUnknown(new Set());
    setSessionDone(false);
  }, [unknown]);

  if (sessionDone) {
    const total = known.size + unknown.size;
    const pct = total > 0 ? Math.round((known.size / total) * 100) : 0;
    return (
      <Box sx={{ maxWidth: 600, mx: 'auto', p: 3 }}>
        <Card elevation={4} sx={{ textAlign: 'center', p: 4 }}>
          <TrophyIcon sx={{ fontSize: 80, color: pct >= 70 ? '#ffc107' : '#9e9e9e', mb: 2 }} />
          <Typography variant="h4" gutterBottom color="primary">סיימת את החפיסה!</Typography>
          <Typography variant="h2" fontWeight="bold" color={pct >= 70 ? 'success.main' : 'error.main'}>{pct}%</Typography>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            ידעת {known.size} מתוך {total} כרטיסיות
          </Typography>

          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mt: 3, flexWrap: 'wrap' }}>
            {unknown.size > 0 && (
              <Button variant="contained" color="warning" onClick={reviewUnknown} startIcon={<SchoolIcon />}>
                חזור על {unknown.size} שלא ידעת
              </Button>
            )}
            <Button variant="outlined" onClick={handleReshuffle} startIcon={<RefreshIcon />}>
              התחל מחדש
            </Button>
          </Box>
        </Card>
      </Box>
    );
  }

  if (!current) {
    return (
      <Box sx={{ textAlign: 'center', p: 4 }}>
        <Typography>אין כרטיסיות בקטגוריה זו.</Typography>
        <Button onClick={() => handleCategoryChange('הכל')} sx={{ mt: 2 }}>הצג הכל</Button>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 700, mx: 'auto', p: 2 }}>
      {/* כותרת */}
      <Box display="flex" alignItems="center" gap={2} mb={3}>
        <SchoolIcon color="primary" sx={{ fontSize: 36 }} />
        <Box>
          <Typography variant="h5" fontWeight="bold" color="primary">כרטיסיות חזרה</Typography>
          <Typography variant="body2" color="text.secondary">
            {flashcards.length} כרטיסיות בכל הקטגוריות
          </Typography>
        </Box>
        <Box sx={{ ml: 'auto', display: 'flex', gap: 1 }}>
          <Tooltip title="ערבב מחדש">
            <IconButton aria-label="ערבב מחדש" onClick={handleReshuffle}><ShuffleIcon /></IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* סינון קטגוריה */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3, flexWrap: 'wrap' }}>
        <FilterIcon fontSize="small" color="action" />
        <FormControl size="small" sx={{ minWidth: 180 }}>
          <InputLabel>קטגוריה</InputLabel>
          <Select value={selectedCategory} label="קטגוריה" onChange={e => handleCategoryChange(e.target.value)}>
            {categories.map(cat => (
              <MenuItem key={cat} value={cat}>{cat}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <Chip label={`${known.size} ✓`} color="success" size="small" variant="outlined" />
        <Chip label={`${unknown.size} ✗`} color="error" size="small" variant="outlined" />
      </Box>

      {/* פרוגרס */}
      <Box mb={2}>
        <Box display="flex" justifyContent="space-between" mb={0.5}>
          <Typography variant="caption" color="text.secondary">כרטיסייה {currentIndex + 1} מתוך {filteredDeck.length}</Typography>
          <Typography variant="caption" color="text.secondary">{Math.round(progress)}%</Typography>
        </Box>
        <LinearProgress variant="determinate" value={progress} sx={{ height: 6, borderRadius: 3 }} />
      </Box>

      {/* כרטיסייה */}
      <Card
        elevation={6}
        onClick={() => setIsFlipped(f => !f)}
        sx={{
          cursor: 'pointer',
          minHeight: 260,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          border: `2px solid ${difficultyColors[current.difficulty]}30`,
          transition: 'box-shadow 0.2s',
          '&:hover': { boxShadow: 10 },
          mb: 2,
          position: 'relative',
        }}
      >
        <Box sx={{ position: 'absolute', top: 12, right: 12, display: 'flex', gap: 1 }}>
          <Chip label={current.category} size="small" variant="outlined" color="primary" />
          <Chip
            label={difficultyLabels[current.difficulty]}
            size="small"
            sx={{ bgcolor: difficultyColors[current.difficulty], color: 'white' }}
          />
        </Box>

        <CardContent sx={{ pt: 6, pb: '16px !important' }}>
          {!isFlipped ? (
            <Box textAlign="center">
              <Typography variant="overline" color="text.secondary">שאלה — לחץ להפוך</Typography>
              <Typography variant="h5" fontWeight="bold" mt={1} sx={{ lineHeight: 1.5 }}>
                {current.front}
              </Typography>
              {showHint && current.hint && (
                <Alert severity="info" sx={{ mt: 2, textAlign: 'right' }}>
                  <Typography variant="body2">💡 {current.hint}</Typography>
                </Alert>
              )}
            </Box>
          ) : (
            <Box textAlign="center">
              <Typography variant="overline" color="success.main">תשובה</Typography>
              <Typography variant="h6" mt={1} sx={{ lineHeight: 1.6 }}>
                {current.back}
              </Typography>
              {current.example && (
                <Paper variant="outlined" sx={{ mt: 2, p: 1.5, bgcolor: 'action.hover', textAlign: 'right' }}>
                  <Typography variant="body2" color="text.secondary">
                    <strong>דוגמה: </strong>{current.example}
                  </Typography>
                </Paper>
              )}
            </Box>
          )}
        </CardContent>
      </Card>

      {/* כפתורים */}
      {!isFlipped ? (
        <Box display="flex" justifyContent="center" gap={2} flexWrap="wrap">
          <Button variant="outlined" onClick={() => setIsFlipped(true)}>
            הצג תשובה
          </Button>
          {current.hint && (
            <Button variant="text" color="warning" onClick={e => { e.stopPropagation(); setShowHint(s => !s); }}>
              {showHint ? 'הסתר רמז' : 'רמז 💡'}
            </Button>
          )}
        </Box>
      ) : (
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Button
              fullWidth
              variant="contained"
              color="error"
              size="large"
              startIcon={<DidntKnowIcon />}
              onClick={() => advance('unknown')}
            >
              לא ידעתי
            </Button>
          </Grid>
          <Grid item xs={6}>
            <Button
              fullWidth
              variant="contained"
              color="success"
              size="large"
              startIcon={<KnewItIcon />}
              onClick={() => advance('known')}
            >
              ידעתי!
            </Button>
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

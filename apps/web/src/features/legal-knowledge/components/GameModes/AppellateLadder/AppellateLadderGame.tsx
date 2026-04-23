import React, { useCallback, useMemo, useState } from 'react'
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Chip,
  FormControl,
  FormControlLabel,
  LinearProgress,
  Paper,
  Radio,
  RadioGroup,
  Typography,
} from '@mui/material'
import AltRouteIcon from '@mui/icons-material/AltRoute'
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'

export interface AppellateLadderGameProps {
  /** אופציונלי — לא מועבר מדף מקורות המשפט */
  onGameComplete?: (score: number, totalQuestions: number) => void
}

interface LadderQuestion {
  id: string
  scenario: string
  contextLine: string
  options: { id: string; label: string }[]
  correctOptionId: string
  explanation: string
  difficulty: 'easy' | 'medium' | 'hard'
}

/** תוכן לימודי מקוצר — מסלולי ערעור נפוצים בישראל (ללא ייעוץ משפטי) */
const LADDER_QUESTIONS: LadderQuestion[] = [
  {
    id: 'civil-shalom-mehozi',
    scenario: 'תובענה אזרחית — בית משפט השלום נתן פסק דין סופי בתביעה כספית.',
    contextLine: 'באיזו ערכאה נפתח בדרך־כלל הערעור הראשון?',
    options: [
      { id: 'a', label: 'בית משפט מחוזי' },
      { id: 'b', label: 'בית המשפט העליון (ישירות)' },
      { id: 'c', label: 'בג"ץ' },
      { id: 'd', label: 'בוררות מוסכמת בלבד' },
    ],
    correctOptionId: 'a',
    explanation:
      'במסלול האזרחי הרגיל, ערעור על פסק דין של בית משפט השלום מוגש בדרך־כלל לבית משפט מחוזי. מעבר לבית המשפט העליון כרוך לרוב ברשות ערעור או בעילות אחרות — לא «קפיצה» שגרתית משלום.',
    difficulty: 'easy',
  },
  {
    id: 'labor-regional-national',
    scenario: 'הליך בפני בית דין אזורי לעבודה — ניתן פסק דין.',
    contextLine: 'לאן פונים בערעור על פסק בית הדין האזורי?',
    options: [
      { id: 'a', label: 'בית הדין הארצי לעבודה בירושלים' },
      { id: 'b', label: 'בית משפט השלום באותו מחוז' },
      { id: 'c', label: 'ישירות לבית המשפט העליון בכל מקרה' },
      { id: 'd', label: 'למשרד העבודה — ועדת עררים מינהלית' },
    ],
    correctOptionId: 'a',
    explanation:
      'בדיני עבודה, שרשרת הערעור בבתי הדין לעבודה היא לרוב: אזורי → ארצי. רק לאחר מכן, בעילות מצומצמות, אפשרות פנייה לבית המשפט העליון (הרחבה — בקורס).',
    difficulty: 'medium',
  },
  {
    id: 'admin-first-instance',
    scenario: 'עתירה נגד החלטת רשות ממשלתית (שאינה חוזה פרטי).',
    contextLine: 'באיזו מערכת שיפוטית נפתח בדרך־כלל ההליך הראשון?',
    options: [
      { id: 'a', label: 'בתי משפט לעניינים מינהליים' },
      { id: 'b', label: 'בית משפט השלום לכל סוגי התביעות' },
      { id: 'c', label: 'בג"ץ בלבד — אין ערכאה אחרת' },
      { id: 'd', label: 'אצל היועץ המשפטי לממשלה כערכאה ראשונה' },
    ],
    correctOptionId: 'a',
    explanation:
      'עתירות מינהליות נשמעות בדרך־כלל בבתי המשפט לעניינים מינהליים (לפי כללי סמכות מקומית). בג"ץ הוא ערכאה עליונה מיוחדת — לא תחליף לכל ערעור מינהללי ראשון.',
    difficulty: 'medium',
  },
  {
    id: 'district-to-supreme',
    scenario: 'פסק דין של בית משפט מחוזי בתובענה אזרחית — מבקשים ערעור נוסף.',
    contextLine: 'מהו הצעד הבא האופייני במסלול הרגיל?',
    options: [
      { id: 'a', label: 'בקשת רשות ערעור לבית המשפט העליון' },
      { id: 'b', label: 'חזרה לבית משפט השלום לדיון חוזר' },
      { id: 'c', label: 'הגשה לבורר שני' },
      { id: 'd', label: 'ערעור אוטומטי ללא אישור שיפוטי' },
    ],
    correctOptionId: 'a',
    explanation:
      'מבית משפט מחוזי לרוב עולים לבית המשפט העליון ברשות ערעור (או בעילות אחרות לפי העניין). אין «ערעור אוטומטי» לכל עניין.',
    difficulty: 'hard',
  },
  {
    id: 'criminal-state-appeal',
    scenario: 'משפט פלילי בבית משפט השלום — הנאשם זוכה, והמדינה מבקשת לערער.',
    contextLine: 'לאן מוגש בדרך־כלל ערעור המדינה?',
    options: [
      { id: 'a', label: 'בית משפט מחוזי' },
      { id: 'b', label: 'ישירות לבית המשפט העליון' },
      { id: 'c', label: 'לפרקליטות בלבד — ללא בית משפט' },
      { id: 'd', label: 'לנשיא המדינה' },
    ],
    correctOptionId: 'a',
    explanation:
      'ערעור המדינה על זיכוי בבית משפט השלום מוגש בדרך־כלל לבית משפט מחוזי. שרשרת הפלילי שונה מהאזרחי בפרטים — חשוב להבחין בין ערכאות.',
    difficulty: 'medium',
  },
  {
    id: 'family-court',
    scenario: 'הליך בבית משפט לענייני משפחה — ניתן פסק דין.',
    contextLine: 'לאן פונים בדרך־כלל בערעור?',
    options: [
      { id: 'a', label: 'בית משפט מחוזי' },
      { id: 'b', label: 'בית משפט השלום הכללי באותה עיר' },
      { id: 'c', label: 'ישירות לבג"ץ' },
      { id: 'd', label: 'לרבנות בלבד' },
    ],
    correctOptionId: 'a',
    explanation:
      'ערעור על פסקי בית משפט לענייני משפחה מוגש בדרך־כלל לבית משפט מחוזי (לפי הכללים החלים).',
    difficulty: 'easy',
  },
  {
    id: 'small-claims',
    scenario: 'תביעה בבית משפט השלום במסלול תביעות קטנות — ניתן פסק סופי.',
    contextLine: 'מהו מסלול הערעור האפשרי (באופן מקוצר לימודי)?',
    options: [
      { id: 'a', label: 'ערעור מוגבל — לרוב על שאלה משפטית לבית משפט מחוזי' },
      { id: 'b', label: 'אין שום ערעור במסלול זה' },
      { id: 'c', label: 'ערעור ישיר לבית המשפט העליון תמיד' },
      { id: 'd', label: 'רק בוררות מחייבת' },
    ],
    correctOptionId: 'a',
    explanation:
      'בתביעות קטנות הערעור צר ומוגבל יחסית; לעיתים קרובות הוא נוגע לשאלות משפטיות ונשמע בבית משפט מחוזי. הפרטים בחקיקה ובפסיקה — חשוב ללמוד אותם בנפרד.',
    difficulty: 'hard',
  },
  {
    id: 'bgatz-not-appeal',
    scenario: 'מבקשים לבטל החלטת רשות בשל חוסר סבירות או אי־חוקיות.',
    contextLine: 'מה ההבדל בין עתירה לבג"ץ לבין «ערעור שגרתי»?',
    options: [
      {
        id: 'a',
        label: 'עתירה לבג"ץ היא הליך חוקתי־מינהלי מיוחד — לא תחליף לכל ערעור על פסק של שלום או מחוזי',
      },
      { id: 'b', label: 'בג"ץ הוא תמיד הערעור השני אחרי מחוזי' },
      { id: 'c', label: 'אין הבדל — כל ערעור הולך לבג"ץ' },
      { id: 'd', label: 'בג"ץ דן רק בחוזים פרטיים' },
    ],
    correctOptionId: 'a',
    explanation:
      'בג"ץ (כשהוא יושב כבית משפט גבוה לצדק) מטפל בעתירות לפי סמכויות מיוחדות. אין לבלבל בין מסלול ערעור אזרחי רגיל לבין עתירה מינהלית־חוקתית.',
    difficulty: 'medium',
  },
  {
    id: 'labor-then-supreme',
    scenario: 'סיימתם שרשרת בבית הדין הארצי לעבודה ויש החלטה סופית שם.',
    contextLine: 'מהו הצעד הבא האפשרי (בהכללה אקדמית)?',
    options: [
      {
        id: 'a',
        label: 'בקשת רשות ערעור לבית המשפט העליון — רק כשמתקיימות עילות מסוימות',
      },
      { id: 'b', label: 'חזרה לבית דין אזורי לאותו דיון' },
      { id: 'c', label: 'ערעור אוטומטי לבית משפט השלום' },
      { id: 'd', label: 'סיום ההליך — אין מעלה' },
    ],
    correctOptionId: 'a',
    explanation:
      'מבית הדין הארצי לעבודה אפשר, בעילות מצומצמות, לעלות לבית המשפט העליון. זה לא «אוטומטי» ולא חוזר לאזורי.',
    difficulty: 'hard',
  },
  {
    id: 'magistrate-not-final',
    scenario: 'בית משפט השלום נתן החלטה שאינה פסק דין סופי (למשל: החלטת ביניים).',
    contextLine: 'מה נכון בדרך־כלל בהשוואה לערעור על פסק סופי?',
    options: [
      {
        id: 'a',
        label: 'יש הבדלים מהותיים בין ערעור על החלטת ביניים לבין פסק סופי — לפי חוק וכללים',
      },
      { id: 'b', label: 'תמיד מותר רק לערער אחרי 30 יום מכל החלטה' },
      { id: 'c', label: 'אסור לערער על החלטות ביניים' },
      { id: 'd', label: 'רק בג"ץ מטפל בביניים' },
    ],
    correctOptionId: 'a',
    explanation:
      'הליכי ערעור והגשה בזמן תלויים בסוג ההחלטה (ביניים מול סופי) ובחקיקה הרלוונטית. זה נקודת ליבה בסדר דין.',
    difficulty: 'hard',
  },
  {
    id: 'two-instance-civil',
    scenario: 'ניתן פסק דין של בית משפט מחוזי יושב כערכאת ערעור (כלומר כבר שמע ערעור משלום).',
    contextLine: 'מהו הצעד הבא האפשרי כלפי מעלה?',
    options: [
      { id: 'a', label: 'בקשת רשות ערעור לבית המשפט העליון' },
      { id: 'b', label: 'חזרה לבית משפט השלום לדיון ראשון מחדש' },
      { id: 'c', label: 'בית דין לעבודה אזורי' },
      { id: 'd', label: 'אין אפשרות נוספת' },
    ],
    correctOptionId: 'a',
    explanation:
      'כאשר בית המשפט המחוזי יושב כערכאת ערעור, הצעד הבא כלפי מעלה הוא לרוב בית המשפט העליון — שוב, לרוב ברשות או בעילות מוגדרות.',
    difficulty: 'medium',
  },
  {
    id: 'mediation-vs-court',
    scenario: 'צדדים הסכימו על בוררות מוסכמת והבורר נתן מועד החלטה.',
    contextLine: 'איך זה מתייחס ל«סולם הערעור» של בתי המשפט?',
    options: [
      {
        id: 'a',
        label: 'בוררות היא מסלול נפרד — אין זה ערעור «רגיל» בשלום־מחוזי אלא לפי חוק הבוררות',
      },
      { id: 'b', label: 'תמיד עוררים לבית משפט השלום אחרי בורר' },
      { id: 'c', label: 'בורר מחליף את בית המשפט העליון' },
      { id: 'd', label: 'אין הבדל בין בורר לשופט שלום' },
    ],
    correctOptionId: 'a',
    explanation:
      'בוררות מבוססת על הסכמה וחוק ייעודי; ערעור או ביטול פסק בוררות עוקבים כללים אחרים מערעור אזרחי שגרתי.',
    difficulty: 'medium',
  },

  // ─── שאלות נוספות — ערכאות מתמחות ומסלולים מורכבים ────────────────────────
  {
    id: 'rabbinical-hierarchy',
    scenario: 'בית דין רבני אזורי נתן פסק דין בענייני גירושין וכתובה.',
    contextLine: 'לאן פונים בערעור על פסק בית הדין הרבני האזורי?',
    options: [
      { id: 'a', label: 'בית הדין הרבני הגדול' },
      { id: 'b', label: 'בית משפט לענייני משפחה' },
      { id: 'c', label: 'בג"ץ ישירות בכל מקרה' },
      { id: 'd', label: 'ועדת ערר ייעודית של משרד הדתות' },
    ],
    correctOptionId: 'a',
    explanation:
      'הערכאה הרבנית פועלת במסלול נפרד: בית דין אזורי → בית הדין הרבני הגדול. פנייה לבג"ץ אפשרית רק לאחר מיצוי הסעדים ובנסיבות מיוחדות.',
    difficulty: 'easy',
  },
  {
    id: 'traffic-court',
    scenario: 'תיק תעבורה (עבירת תנועה) נדון בבית משפט לתעבורה ונגזר על הנאשם קנס ושלילת רישיון.',
    contextLine: 'לאן פונים בערעור על פסק בית משפט לתעבורה?',
    options: [
      { id: 'a', label: 'בית משפט מחוזי' },
      { id: 'b', label: 'בית משפט עליון ישירות' },
      { id: 'c', label: 'רשות הרישוי (אין ערכאה שיפוטית)' },
      { id: 'd', label: 'חוזרים לבית משפט לתעבורה אחר' },
    ],
    correctOptionId: 'a',
    explanation:
      'בית משפט לתעבורה הוא סמכות ייחודית שמוקנית לשלום; ערעור על פסקיו מוגש לבית משפט מחוזי, בדומה לשאר ערעורי שלום.',
    difficulty: 'medium',
  },
  {
    id: 'national-insurance-appeals',
    scenario: 'ועדה רפואית של המוסד לביטוח לאומי דחתה תביעת נפגע עבודה.',
    contextLine: 'מהו המסלול השיפוטי הראשון לאחר מיצוי ערעורים מינהליים פנים-מוסדיים?',
    options: [
      { id: 'a', label: 'בית דין אזורי לעבודה' },
      { id: 'b', label: 'בית משפט השלום הכללי' },
      { id: 'c', label: 'ישירות לבג"ץ' },
      { id: 'd', label: 'בית משפט מנהלי' },
    ],
    correctOptionId: 'a',
    explanation:
      'תביעות נגד המוסד לביטוח לאומי (נפגעי עבודה, דמי אבטלה וכד\'‏) נידונות בבית דין אזורי לעבודה — לא בשלום הכללי ולא ישירות בבג"ץ.',
    difficulty: 'medium',
  },
  {
    id: 'planning-and-building',
    scenario: 'ועדה מקומית לתכנון ובנייה דחתה בקשה להיתר בנייה.',
    contextLine: 'מהו הגוף המוסמך לדון בערר על החלטת ועדה מקומית?',
    options: [
      { id: 'a', label: 'ועדת ערר מחוזית לתכנון ובנייה' },
      { id: 'b', label: 'בית משפט השלום לאלתר' },
      { id: 'c', label: 'בג"ץ כגוף הדן בענייני רישוי' },
      { id: 'd', label: 'שר הפנים ישירות' },
    ],
    correctOptionId: 'a',
    explanation:
      'חוק התכנון והבנייה מסדיר ועדות ערר מחוזיות שמוסמכות לדון בעררים על החלטות ועדות מקומיות. אחר כך ניתן לפנות לבית משפט לעניינים מינהליים.',
    difficulty: 'medium',
  },
  {
    id: 'economic-court',
    scenario: 'תביעה בתחום ניירות ערך, הגבלים עסקיים או שוק ההון הוגשה לבית המשפט.',
    contextLine: 'לאיזו ערכאה ראשונית מועברים בדרך-כלל תיקים כלכליים ייחודיים?',
    options: [
      { id: 'a', label: 'בית המשפט הכלכלי (יחידה מיוחדת במחוזי)' },
      { id: 'b', label: 'בית משפט לתביעות קטנות תמיד' },
      { id: 'c', label: 'ועדת ניירות ערך בלבד' },
      { id: 'd', label: 'ישירות לבית המשפט העליון' },
    ],
    correctOptionId: 'a',
    explanation:
      'בית המשפט הכלכלי הוקם כחטיבה ייחודית בתוך בית המשפט המחוזי בת"א לצורך דיון בתיקים כלכליים מורכבים — ניירות ערך, הגבלים עסקיים ועוד.',
    difficulty: 'hard',
  },
  {
    id: 'juvenile-court',
    scenario: 'קטין (מתחת לגיל 18) הואשם בעבירה פלילית.',
    contextLine: 'באיזו ערכאה ייחודית נדון בדרך-כלל המשפט?',
    options: [
      { id: 'a', label: 'בית משפט לנוער (ייחודי לקטינים)' },
      { id: 'b', label: 'בית משפט שלום רגיל — אין הבדל' },
      { id: 'c', label: 'בית דין צבאי בכל מקרה' },
      { id: 'd', label: 'ועדת רווחה — ללא ערכאה שיפוטית' },
    ],
    correctOptionId: 'a',
    explanation:
      'חוק הנוער (שפיטה, ענישה ודרכי טיפול) קובע ערכאה ייחודית — בית משפט לנוער — הדן בקטינים. הליך זה שונה בהרבה ממשפט פלילי למבוגרים.',
    difficulty: 'easy',
  },
  {
    id: 'tax-appeals',
    scenario: 'שומת מס הכנסה שהוציאה רשות המסים נוגדת את דעת הנישום.',
    contextLine: 'מהו המסלול המשפטי הראשון לאחר הגשת השגה?',
    options: [
      { id: 'a', label: 'ערעור לבית משפט מחוזי (מחלקת ערעורים מס)' },
      { id: 'b', label: 'בית משפט השלום הכללי' },
      { id: 'c', label: 'בית הדין הארצי לעבודה' },
      { id: 'd', label: 'בית משפט לעניינים מינהליים ישירות' },
    ],
    correctOptionId: 'a',
    explanation:
      'לאחר השגה מינהלית, ערעורי מס הכנסה נדונים בדרך-כלל בבית משפט מחוזי. מדובר בהליך ייחודי המוסדר בפקודת מס הכנסה.',
    difficulty: 'hard',
  },
  {
    id: 'arbitration-set-aside',
    scenario: 'צד טוען שפסק בוררות ניתן בחריגה מסמכות ורוצה לבטלו.',
    contextLine: 'לאיזו ערכאה שיפוטית פונים לביטול פסק בוררות?',
    options: [
      { id: 'a', label: 'בית משפט מחוזי — לפי חוק הבוררות' },
      { id: 'b', label: 'בית המשפט העליון ישירות' },
      { id: 'c', label: 'חוזרים לאותו בורר' },
      { id: 'd', label: 'ועדת בוררות לאומית' },
    ],
    correctOptionId: 'a',
    explanation:
      'ביטול פסק בוררות מבוקש מבית משפט מחוזי לפי סעיפי חוק הבוררות. קיימות עילות מצומצמות לביטול (כגון חריגה מסמכות, מרמה, הפרת כללי צדק טבעי).',
    difficulty: 'hard',
  },
  {
    id: 'bagatz-after-admin',
    scenario: 'עותר מיצה את כל ערכאות הערעור המינהליות הזמינות ועדיין אינו מרוצה.',
    contextLine: 'מתי ניתן לפנות לבג"ץ לאחר מיצוי הליכים?',
    options: [
      {
        id: 'a',
        label: 'כאשר אין סעד חלופי יעיל — בג"ץ הוא ערכאה "אחרונת מפלט"',
      },
      { id: 'b', label: 'תמיד, ללא כל תנאי' },
      { id: 'c', label: 'רק בענייני חוץ ובטחון' },
      { id: 'd', label: 'אסור לפנות לבג"ץ לאחר ועדת ערר' },
    ],
    correctOptionId: 'a',
    explanation:
      'בג"ץ פועל כ"ערכאת מפלט" כשאין סעד חלופי יעיל. בדרך-כלל נדרש מיצוי הליכים קודם. הוא יכול להתערב בפעולות רשויות המדינה ומסרב לדון בנושאים שיש להם מסלול ערעור ייחודי.',
    difficulty: 'hard',
  },
  {
    id: 'military-court',
    scenario: 'חייל פעיל הואשם בעבירה פלילית שבוצעה בתפקידו הצבאי.',
    contextLine: 'באיזו מערכת שיפוטית ינוהל המשפט?',
    options: [
      { id: 'a', label: 'בית דין צבאי — מערכת שיפוט נפרדת' },
      { id: 'b', label: 'בית משפט שלום אזרחי רגיל' },
      { id: 'c', label: 'בית דין לעבודה' },
      { id: 'd', label: 'ועדת חקירה ממשלתית' },
    ],
    correctOptionId: 'a',
    explanation:
      'חוק השיפוט הצבאי קובע מערכת שיפוט נפרדת לצבא: בתי דין צבאיים מחוזיים ובית דין צבאי לערעורים. ערעור נוסף אפשרי לבית המשפט העליון בעניינים מסוימים.',
    difficulty: 'medium',
  },
  {
    id: 'two-appeals-right-vs-leave',
    scenario: 'בית משפט מחוזי פסק כערכאה ראשונה (לא כערכאת ערעור) בתביעה אזרחית.',
    contextLine: 'כיצד שונה מסלול הגעה לבית המשפט העליון במקרה זה?',
    options: [
      {
        id: 'a',
        label: 'ניתן לערער כזכות — לא רק ברשות — לבית המשפט העליון',
      },
      { id: 'b', label: 'חייבים להגיש בקשת רשות ערעור כמו תמיד' },
      { id: 'c', label: 'אין אפשרות ערעור מבית המשפט המחוזי כלל' },
      { id: 'd', label: 'מוגשים לבית משפט שלום בחזרה' },
    ],
    correctOptionId: 'a',
    explanation:
      'כאשר מחוזי יושב כערכאה ראשונה (לא כערכאת ערעור) בתביעה אזרחית, הדרך לעליון היא ערעור כזכות — לא ברשות. זהו ההבדל המהותי לעומת מחוזי כערכאת ערעור.',
    difficulty: 'hard',
  },
]

function difficultyLabel(d: LadderQuestion['difficulty']): string {
  switch (d) {
    case 'easy':
      return 'קל'
    case 'medium':
      return 'בינוני'
    case 'hard':
      return 'קשה'
    default:
      return d
  }
}

export const AppellateLadderGame: React.FC<AppellateLadderGameProps> = ({ onGameComplete }) => {
  const questions = useMemo(() => LADDER_QUESTIONS, [])
  const [idx, setIdx] = useState(0)
  const [score, setScore] = useState(0)
  const [choice, setChoice] = useState<string>('')
  const [revealed, setRevealed] = useState(false)
  const [done, setDone] = useState(false)

  const q = questions[idx]
  const progress = (100 * (idx + (revealed ? 1 : 0.5))) / questions.length

  const reset = useCallback(() => {
    setIdx(0)
    setScore(0)
    setChoice('')
    setRevealed(false)
    setDone(false)
  }, [])

  const submit = () => {
    if (!choice || revealed) return
    setRevealed(true)
    if (choice === q.correctOptionId) {
      setScore((s) => s + 1)
    }
  }

  const next = () => {
    if (idx >= questions.length - 1) return
    setIdx((i) => i + 1)
    setChoice('')
    setRevealed(false)
  }

  const finalize = () => {
    setDone(true)
    onGameComplete?.(score, questions.length)
  }

  if (done) {
    return (
      <Card sx={{ maxWidth: 640, mx: 'auto', mt: 2 }}>
        <CardContent sx={{ textAlign: 'center', py: 4 }}>
          <EmojiEventsIcon sx={{ fontSize: 72, color: 'warning.main', mb: 2 }} />
          <Typography variant="h5" gutterBottom>
            סיימת את «סולם הערעור»
          </Typography>
          <Typography variant="h4" color="primary" gutterBottom>
            {score} / {questions.length} נכון
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            חזרו על ההסברים בשאלות שטעיתם — מסלולי שיפוט הם נושא שחוזר בבחינות.
          </Typography>
          <Button variant="contained" size="large" onClick={reset}>
            משחק חדש
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card sx={{ maxWidth: 800, mx: 'auto', mt: 2 }}>
      <CardHeader
        title={
          <Box display="flex" alignItems="center" justifyContent="space-between" flexWrap="wrap" gap={1}>
            <Box display="flex" alignItems="center" gap={1}>
              <AltRouteIcon color="primary" fontSize="large" />
              <Typography variant="h6">סולם הערעור</Typography>
            </Box>
            <Box display="flex" gap={1} flexWrap="wrap">
              <Chip label={`שאלה ${idx + 1} / ${questions.length}`} size="small" />
              <Chip label={difficultyLabel(q.difficulty)} size="small" variant="outlined" />
              <Chip label={`${score} נכונות`} color="success" size="small" />
            </Box>
          </Box>
        }
        subheader="מסלולי ערעור וערכאות בישראל — משחק לימודי (כללים מקוצרים)."
      />
      <CardContent>
        <LinearProgress variant="determinate" value={Math.min(100, progress)} sx={{ mb: 2 }} />

        <Paper variant="outlined" sx={{ p: 2, mb: 2, bgcolor: 'grey.50' }}>
          <Typography variant="body1" sx={{ lineHeight: 1.75 }} paragraph>
            {q.scenario}
          </Typography>
          <Typography variant="subtitle2" color="primary">
            {q.contextLine}
          </Typography>
        </Paper>

        <FormControl component="fieldset" fullWidth disabled={revealed}>
          <RadioGroup value={choice} onChange={(e) => setChoice(e.target.value)}>
            {q.options.map((opt) => (
              <FormControlLabel
                key={opt.id}
                value={opt.id}
                control={<Radio />}
                label={opt.label}
                sx={{
                  alignItems: 'flex-start',
                  mb: 1,
                  p: 1,
                  borderRadius: 1,
                  border: '1px solid',
                  borderColor:
                    revealed && opt.id === q.correctOptionId
                      ? 'success.main'
                      : revealed && choice === opt.id && opt.id !== q.correctOptionId
                        ? 'error.main'
                        : 'divider',
                  bgcolor:
                    revealed && opt.id === q.correctOptionId
                      ? 'rgba(46, 125, 50, 0.08)'
                      : revealed && choice === opt.id && opt.id !== q.correctOptionId
                        ? 'rgba(211, 47, 47, 0.08)'
                        : 'background.paper',
                }}
              />
            ))}
          </RadioGroup>
        </FormControl>

        {revealed && (
          <Alert
            severity={choice === q.correctOptionId ? 'success' : 'warning'}
            sx={{ mt: 2, whiteSpace: 'pre-wrap' }}
          >
            <Typography variant="subtitle2" gutterBottom>
              {choice === q.correctOptionId ? 'נכון' : 'לא בדיוק'}
            </Typography>
            <Typography variant="body2">{q.explanation}</Typography>
          </Alert>
        )}

        <Box display="flex" gap={2} justifyContent="flex-end" flexWrap="wrap" mt={3}>
          {!revealed ? (
            <Button variant="contained" onClick={submit} disabled={!choice}>
              בדוק תשובה
            </Button>
          ) : idx < questions.length - 1 ? (
            <Button variant="contained" onClick={next}>
              השאלה הבאה
            </Button>
          ) : (
            <Button variant="contained" onClick={finalize} color="success">
              סיום וציון
            </Button>
          )}
        </Box>
      </CardContent>
    </Card>
  )
}

export default AppellateLadderGame

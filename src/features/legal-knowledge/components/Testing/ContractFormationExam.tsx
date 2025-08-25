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
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon
} from '@mui/material';
import {
  CheckCircle,
  Cancel,
  Info,
  Gavel,
  Description,
  Assignment,
  Handshake,
  Balance,
  AccountBalance,
  Article
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

const questions: Question[] = [
  // חלק א' - דרישת הכתב במקרקעין
  {
    id: 1,
    type: 'multiple-choice',
    difficulty: 'בינוני',
    icon: '📜',
    category: 'דרישת הכתב במקרקעין',
    question: 'מה קורה אם חוזה למכירת דירה נעשה בעל-פה בלבד?',
    options: [
      { id: 'a', text: 'החוזה תקף אך ניתן לבטלו' },
      { id: 'b', text: 'החוזה בטל מעיקרו' },
      { id: 'c', text: 'החוזה תקף אם שני הצדדים מסכימים' },
      { id: 'd', text: 'החוזה תקף אם שולם מקדמה' }
    ],
    correctAnswer: 'b',
    explanation: 'לפי סעיף 8 לחוק המקרקעין, דרישת הכתב היא מהותית - ללא כתב אין תוקף לחוזה במקרקעין. החוזה בטל מעיקרו ולא רק ניתן לביטול.',
    lawReference: 'חוק המקרקעין, סעיף 8'
  },
  {
    id: 2,
    type: 'case-study',
    difficulty: 'קשה',
    icon: '🏠',
    category: 'דרישת הכתב במקרקעין',
    question: 'בזכרון דברים למכירת בית חסרים פרטי המחיר. לפי פס"ד בוטקובסקי, האם החוזה תקף?',
    options: [
      { id: 'a', text: 'בטל - חסר פרט מהותי' },
      { id: 'b', text: 'תקף אם ניתן להשלים לפי דין או נוהג' },
      { id: 'c', text: 'תקף רק אם יש הסכמה מפורשת של הצדדים' },
      { id: 'd', text: 'תלוי בערך הנכס' }
    ],
    correctAnswer: 'b',
    explanation: 'לפי פס"ד בוטקובסקי, זכרון דברים עשוי לענות על דרישת הכתב גם אם חלק מהפרטים חסרים, בתנאי שניתן להשלים לפי דין או נוהג מקובל ובהסכמה בין הצדדים.',
    precedent: 'פס"ד בוטקובסקי - השלמת פרטים חסרים בזכרון דברים',
    lawReference: 'חוק המקרקעין, סעיף 8'
  },
  {
    id: 3,
    type: 'multiple-choice',
    difficulty: 'בינוני',
    icon: '✍️',
    category: 'דרישת הכתב במקרקעין',
    question: 'לפי פס"ד קפולסקי, איזה מהפרטים הבאים חייב להופיע בכתב?',
    options: [
      { id: 'a', text: 'רק זהות הצדדים והמחיר' },
      { id: 'b', text: 'זהות הצדדים, מהות העסקה, תיאור הנכס, מחיר ותנאי תשלום' },
      { id: 'c', text: 'רק תיאור הנכס והמחיר' },
      { id: 'd', text: 'כל הפרטים הטכניים של הנכס' }
    ],
    correctAnswer: 'b',
    explanation: 'פס"ד קפולסקי קבע שהפרטים המהותיים שחייבים להופיע בכתב הם: זהות הצדדים, מהות העסקה, תיאור וזיהוי הנכס, מחיר ותנאי תשלום.',
    precedent: 'פס"ד קפולסקי - פרטים מהותיים בכתב',
    lawReference: 'חוק המקרקעין, סעיף 8'
  },

  // חלק ב' - כריתת חוזה: הצעה וקיבול
  {
    id: 4,
    type: 'multiple-choice',
    difficulty: 'בינוני',
    icon: '🤝',
    category: 'הצעה וקיבול',
    question: 'מה נדרש כדי שהצעה תהיה תקפה?',
    options: [
      { id: 'a', text: 'רק פנייה לצד השני' },
      { id: 'b', text: 'פנייה וגמירות דעת' },
      { id: 'c', text: 'פנייה, גמירות דעת ומסוימות' },
      { id: 'd', text: 'רק רצון להתקשר' }
    ],
    correctAnswer: 'c',
    explanation: 'לפי סעיף 2 לחוק החוזים, הצעה חייבת לכלול שלושה יסודות: פנייה (למי ההצעה מופנית), גמירות דעת (החלטיות ולא היסוס), ומסוימות (פרטים מהותיים).',
    lawReference: 'חוק החוזים, סעיף 2'
  },
  {
    id: 5,
    type: 'case-study',
    difficulty: 'קשה',
    icon: '📧',
    category: 'הצעה וקיבול',
    question: 'אדם שלח מייל: "אני שוקל למכור את הרכב שלי ב-50,000 ש"ח". האם זו הצעה תקפה?',
    options: [
      { id: 'a', text: 'כן - יש פנייה, מחיר ותיאור' },
      { id: 'b', text: 'לא - חסרת גמירות דעת' },
      { id: 'c', text: 'כן - אם הנמען הבין שזו הצעה' },
      { id: 'd', text: 'תלוי ביחסים בין הצדדים' }
    ],
    correctAnswer: 'b',
    explanation: 'המילה "שוקל" מעידה על היסוס וחוסר גמירות דעת. לפי המבחן האובייקטיבי, לשון ההצעה חייבת להיות החלטית ולא מהססת כדי להיחשב הצעה תקפה.',
    lawReference: 'חוק החוזים, סעיף 2 - גמירות דעת'
  },
  {
    id: 6,
    type: 'multiple-choice',
    difficulty: 'קשה',
    icon: '🕒',
    category: 'הצעה וקיבול',
    question: 'מתי מתקבלת הודעת קיבול לפי פס"ד מנורה?',
    options: [
      { id: 'a', text: 'כשהנמען כותב את ההודעה' },
      { id: 'b', text: 'כשההודעה נשלחת' },
      { id: 'c', text: 'כשההודעה נמסרת למציע' },
      { id: 'd', text: 'כשהמציע קורא את ההודעה' }
    ],
    correctAnswer: 'c',
    explanation: 'פס"ד מנורה קבע שקיבול התקבל ברגע שההודעה נמסרת למציע, גם אם הוא עדיין לא קרא אותה. זהו כלל חשוב לקביעת מועד יצירת החוזה.',
    precedent: 'פס"ד מנורה - מועד קבלת הודעת קיבול',
    lawReference: 'חוק החוזים, סעיף 5'
  },
  {
    id: 7,
    type: 'true-false',
    difficulty: 'בינוני',
    icon: '🤐',
    category: 'הצעה וקיבול',
    question: 'שתיקה יכולה להיחשב קיבול תקף בכל מקרה.',
    correctAnswer: 'false',
    explanation: 'לפי סעיף 6(ב) לחוק החוזים, קיבול בשתיקה בדרך כלל אינו תקף. חריגים: יחסים קודמים בין הצדדים או הצעה מזכה שבה חזקת הקיבול קיימת עד התנגדות.',
    lawReference: 'חוק החוזים, סעיף 6(ב)'
  },
  {
    id: 8,
    type: 'case-study',
    difficulty: 'קשה',
    icon: '🏃‍♂️',
    category: 'הצעה וקיבול',
    question: 'בעל חנות ביקש מספק לספק סחורה. הספק התחיל להכין את הסחורה מבלי להודיע. האם זה קיבול תקף?',
    options: [
      { id: 'a', text: 'לא - חובה להודיע' },
      { id: 'b', text: 'כן - קיבול בהתנהגות' },
      { id: 'c', text: 'תלוי אם הסחורה הושלמה' },
      { id: 'd', text: 'תלוי בתנאי ההצעה' }
    ],
    correctAnswer: 'd',
    explanation: 'לפי סעיף 6(א), קיבול בהתנהגות תלוי בתנאי ההצעה: אם ההצעה אינה דורשת תוצאה - תחילת הביצוע מהווה קיבול. אם ההצעה דורשת תוצאה - רק השגת התוצאה מהווה קיבול.',
    lawReference: 'חוק החוזים, סעיף 6(א)'
  },

  // חלק ג' - פקיעה וחזרה
  {
    id: 9,
    type: 'multiple-choice',
    difficulty: 'בינוני',
    icon: '⏰',
    category: 'פקיעה וחזרה',
    question: 'מתי פוקעת הצעה לפי חוק החוזים?',
    options: [
      { id: 'a', text: 'רק כשהנמען דוחה אותה' },
      { id: 'b', text: 'כשהמועד לקיבול עבר, הנמען דחה, או צד מת/פסול דין' },
      { id: 'c', text: 'רק כשהמציע חוזר בו' },
      { id: 'd', text: 'כשעוברים 30 יום' }
    ],
    correctAnswer: 'b',
    explanation: 'סעיף 4 קובע שההצעה פוקעת בשלושה מקרים: הנמען דחה את ההצעה, המועד לקיבול עבר, או שהמציע/הנמען מת או נעשה פסול דין.',
    lawReference: 'חוק החוזים, סעיף 4'
  },
  {
    id: 10,
    type: 'case-study',
    difficulty: 'קשה',
    icon: '📅',
    category: 'פקיעה וחזרה',
    question: 'לפי פס"ד ברוך, מה קורה כשמישהו מקבל הצעה לאחר שפג המועד?',
    options: [
      { id: 'a', text: 'הקיבול תקף אם המציע מסכים' },
      { id: 'b', text: 'הקיבול נחשב הצעה חדשה' },
      { id: 'c', text: 'החוזה נוצר בכל מקרה' },
      { id: 'd', text: 'תלוי כמה זמן עבר' }
    ],
    correctAnswer: 'b',
    explanation: 'פס"ד ברוך וסעיף 9 לחוק קובעים שקיבול לאחר פקיעת ההצעה נחשב להצעה חדשה ולא לקיבול של ההצעה המקורית.',
    precedent: 'פס"ד ברוך - קיבול לאחר פקיעה',
    lawReference: 'חוק החוזים, סעיף 9'
  },
  {
    id: 11,
    type: 'multiple-choice',
    difficulty: 'בינוני',
    icon: '↩️',
    category: 'פקיעה וחזרה',
    question: 'מתי ניתן לחזור מהצעה רגילה?',
    options: [
      { id: 'a', text: 'בכל זמן' },
      { id: 'b', text: 'עד שהתקבלה הודעת הקיבול' },
      { id: 'c', text: 'רק תוך 24 שעות' },
      { id: 'd', text: 'אסור לחזור מהצעה' }
    ],
    correctAnswer: 'b',
    explanation: 'סעיף 3(א) קובע שמהצעה רגילה ניתן לחזור עד שהתקבלה הודעת הקיבול. לעומת זאת, מהצעה בלתי חוזרת אי אפשר לחזור לאחר קיבול.',
    lawReference: 'חוק החוזים, סעיף 3(א)'
  },
  {
    id: 12,
    type: 'case-study',
    difficulty: 'קשה מאוד',
    icon: '🎁',
    category: 'הצעה מזכה',
    question: 'לפי פס"ד כהן, בעל בית הציע לשכן זכות שימוש בחצר. השכן לא הגיב. מה המעמד המשפטי?',
    options: [
      { id: 'a', text: 'אין חוזה - לא היה קיבול' },
      { id: 'b', text: 'יש חוזה - חזקת קיבול בהצעה מזכה' },
      { id: 'c', text: 'תלוי אם השכן השתמש בחצר' },
      { id: 'd', text: 'צריך הסכמה מפורשת' }
    ],
    correctAnswer: 'b',
    explanation: 'פס"ד כהן וסעיף 7 קובעים שבהצעה מזכה (שמועילה רק לנמען) קיימת חזקת קיבול. הנמען לא צריך להודיע על קבלה, אלא להתנגד אם אינו רוצה.',
    precedent: 'פס"ד כהן - הצעה מזכה וחזקת קיבול',
    lawReference: 'חוק החוזים, סעיף 7'
  },

  // חלק ד' - פירוש חוזה
  {
    id: 13,
    type: 'multiple-choice',
    difficulty: 'קשה',
    icon: '🔍',
    category: 'פירוש חוזה',
    question: 'מה העקרון הראשון בהיררכיית פירוש החוזה לפי סעיף 25?',
    options: [
      { id: 'a', text: 'פירוש לפי הוראות חוק' },
      { id: 'b', text: 'אומד דעת הצדדים' },
      { id: 'c', text: 'פירוש המקיים את החוזה' },
      { id: 'd', text: 'פירוש לפי תום לב' }
    ],
    correctAnswer: 'b',
    explanation: 'סעיף 25(א) קובע שהעקרון הראשון הוא אומד דעת הצדדים - מה רצו הצדדים בזמן כריתת החוזה, על בסיס לשון החוזה וסיבות העסקה.',
    lawReference: 'חוק החוזים, סעיף 25(א)'
  },
  {
    id: 14,
    type: 'case-study',
    difficulty: 'קשה',
    icon: '⚖️',
    category: 'פירוש חוזה',
    question: 'לחוזה יש שני פירושים אפשריים: אחד מבטל את החוזה ואחד משאיר אותו תקף. איזה פירוש ייבחר?',
    options: [
      { id: 'a', text: 'הפירוש המבטל - זהיר יותר' },
      { id: 'b', text: 'הפירוש המקיים את החוזה' },
      { id: 'c', text: 'תלוי בכוונת הצדדים' },
      { id: 'd', text: 'הפירוש הפשוט יותר' }
    ],
    correctAnswer: 'b',
    explanation: 'סעיף 25(ב) קובע את עקרון "פירוש המקיים את החוזה" - יש להעדיף פירוש שמונע בטלות החוזה ומאפשר קיומו.',
    lawReference: 'חוק החוזים, סעיף 25(ב)'
  },
  {
    id: 15,
    type: 'multiple-choice',
    difficulty: 'קשה מאוד',
    icon: '📚',
    category: 'פירוש חוזה',
    question: 'לפי פס"ד אפרופים מ-2011, מה השתנה באופן פירוש החוזה?',
    options: [
      { id: 'a', text: 'נוסף שלב נוסף של פירוש' },
      { id: 'b', text: 'מבחן חד-שלבי: לשון וסיבות יחד' },
      { id: 'c', text: 'ביטול פירוש לפי סיבות' },
      { id: 'd', text: 'עדיפות מוחלטת ללשון' }
    ],
    correctAnswer: 'b',
    explanation: 'פס"ד אפרופים קבע מבחן חד-שלבי שבו בוחנים את לשון החוזה וסיבות העסקה יחד, תוך מתן עדיפות ללשון החוזה כאשר היא ברורה.',
    precedent: 'פס"ד אפרופים - מבחן חד-שלבי לפירוש חוזה',
    lawReference: 'חוק החוזים, סעיף 25'
  },

  // חלק ה' - השלמת חוזה
  {
    id: 16,
    type: 'multiple-choice',
    difficulty: 'בינוני',
    icon: '🧩',
    category: 'השלמת חוזה',
    question: 'מה העדיפות הראשונה בהשלמת חוזה לפי סעיף 26?',
    options: [
      { id: 'a', text: 'הוראות חוק' },
      { id: 'b', text: 'נוהג פרטי בין הצדדים' },
      { id: 'c', text: 'נוהג כללי בענף' },
      { id: 'd', text: 'שיקול דעת השופט' }
    ],
    correctAnswer: 'b',
    explanation: 'ההיררכיה בסעיף 26 היא: נוהג פרטי (איך הצדדים פעלו בעבר ביחד), נוהג כללי (מנהג הענף), והוראות חוק דיספוזיטיביות.',
    lawReference: 'חוק החוזים, סעיף 26'
  },
  {
    id: 17,
    type: 'case-study',
    difficulty: 'קשה',
    category: 'השלמת חוזה',
    icon: '🏪',
    question: 'בחוזה אספקה חסר מועד האספקה. בעבר הספק תמיד סיפק תוך שבועיים. מה יהיה המועד?',
    options: [
      { id: 'a', text: 'המועד הקבוע בחוק' },
      { id: 'b', text: 'שבועיים - לפי הנוהג הפרטי' },
      { id: 'c', text: 'המקובל בענף' },
      { id: 'd', text: 'זמן סביר כללי' }
    ],
    correctAnswer: 'b',
    explanation: 'נוהג פרטי בין הצדדים (איך הם פעלו בעבר) קודם לנוהג כללי או הוראות חוק. שבועיים זה הנוהג הפרטי שנקבע בין הצדדים.',
    lawReference: 'חוק החוזים, סעיף 26 - נוהג פרטי'
  },

  // חלק ו' - פגמים בכריתת חוזה
  {
    id: 18,
    type: 'multiple-choice',
    difficulty: 'בינוני',
    icon: '👶',
    category: 'פגמים בכריתת חוזה',
    question: 'עד איזה גיל נחשב אדם לקטין לעניין חוזים?',
    options: [
      { id: 'a', text: '16' },
      { id: 'b', text: '18' },
      { id: 'c', text: '21' },
      { id: 'd', text: '25' }
    ],
    correctAnswer: 'b',
    explanation: 'לפי החוק, קטין הוא מי שטרם מלאו לו 18 שנים. קטין יכול לבצע פעולות רגילות, אך לרכישה באשראי או מקרקעין נדרש אישור בית משפט.',
    lawReference: 'דיני הכשרות המשפטית'
  },
  {
    id: 19,
    type: 'case-study',
    difficulty: 'קשה',
    icon: '🤔',
    category: 'פגמים בכריתת חוזה',
    question: 'רוכש דירה טעה בגודלה (חשב 100 מ"ר במקום 80). הוא ידע על הטעות לפני החתימה אך שכח. איזו עילה רלוונטית?',
    options: [
      { id: 'a', text: 'טעות ידועה - סעיף 14(א)' },
      { id: 'b', text: 'טעות לא ידועה - סעיף 14(ב)' },
      { id: 'c', text: 'הטעיה - סעיף 15' },
      { id: 'd', text: 'אין עילה - הוא ידע' }
    ],
    correctAnswer: 'b',
    explanation: 'למרות שהקונה ידע בעבר, בזמן החתימה הוא לא ידע על הטעות (שכח). הצד השני לא ידע ולא היה עליו לדעת, לכן זו טעות לא ידועה לפי סעיף 14(ב).',
    lawReference: 'חוק החוזים, סעיף 14(ב)'
  },
  {
    id: 20,
    type: 'case-study',
    difficulty: 'קשה מאוד',
    icon: '💰',
    category: 'פגמים בכריתת חוזה',
    question: 'לפי פס"ד לוטם רהיטים, מתי מתקיימת כפייה כלכלית?',
    options: [
      { id: 'a', text: 'כשיש לחץ כלכלי כללי' },
      { id: 'b', text: 'כשהמחיר גבוה מהרגיל' },
      { id: 'c', text: 'איום מיידי ואין חלופה סבירה' },
      { id: 'd', text: 'כשהחוזה לא הוגן' }
    ],
    correctAnswer: 'c',
    explanation: 'פס"ד לוטם רהיטים קבע שכפייה כלכלית מתקיימת כאשר יש איום כלכלי מיידי ואין לצד חלופה סבירה. לא כל לחץ כלכלי מהווה כפייה.',
    precedent: 'פס"ד לוטם רהיטים - כפייה כלכלית',
    lawReference: 'חוק החוזים, סעיף 17'
  }
];

const ContractFormationExam: React.FC = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [showResult, setShowResult] = useState(false);
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
  const [showFinalResults, setShowFinalResults] = useState(false);
  const [examStarted, setExamStarted] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(75 * 60); // 75 minutes

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
            <Description sx={{ fontSize: 60, color: '#1976d2', mb: 2 }} />
            <Typography variant="h3" component="h1" gutterBottom color="primary" fontWeight="bold">
              📜 מבחן דיני חוזים - כריתת חוזה
            </Typography>
            <Typography variant="h6" color="text.secondary" mb={3}>
              מבחן מקיף על כריתת חוזה, פירוש, השלמה ופגמים בכריתת חוזה
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
                <ListItemText primary="נושאים: דרישת הכתב, הצעה וקיבול, פירוש והשלמה, פגמים" />
              </ListItem>
              <ListItem>
                <ListItemIcon><Balance color="primary" /></ListItemIcon>
                <ListItemText primary="זמן: 75 דקות" />
              </ListItem>
              <ListItem>
                <ListItemIcon><CheckCircle color="primary" /></ListItemIcon>
                <ListItemText primary="הסברים מפורטים עם פסיקה ומקורות חוק" />
              </ListItem>
            </List>
          </Box>

          <Alert severity="info" sx={{ mb: 3 }}>
            <Typography variant="body1">
              <strong>💡 טיפ ללמידה:</strong> המבחן כולל פסקי דין מרכזיים כמו קפולסקי, בוטקובסקי, מנורה, ברוך, כהן ואפרופים.
              חשבו על השלבים: הצעה → קיבול → חוזה, ועל הפגמים האפשריים בכל שלב.
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
                background: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)'
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
            {results.percentage >= 90 && '🏆 מעולה! שליטה מושלמת בדיני חוזים'}
            {results.percentage >= 80 && results.percentage < 90 && '⭐ טוב מאוד! ידע חזק בנושא'}
            {results.percentage >= 70 && results.percentage < 80 && '👍 טוב! עדיין יש מקום לשיפור'}
            {results.percentage < 70 && '📚 מומלץ לחזור על החומר ולתרגל נוסף'}
          </Alert>

          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" gutterBottom color="primary">
              📊 פירוט תוצאות לפי קטגוריות:
            </Typography>
            {[
              'דרישת הכתב במקרקעין',
              'הצעה וקיבול',
              'פקיעה וחזרה',
              'הצעה מזכה',
              'פירוש חוזה',
              'השלמת חוזה',
              'פגמים בכריתת חוזה'
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
              <ListItemIcon><Article color="primary" /></ListItemIcon>
              <ListItemText 
                primary="דרישת הכתב במקרקעין" 
                secondary="פס"ד קפולסקי, בוטקובסקי - פרטים מהותיים וזכרון דברים" 
              />
            </ListItem>
            <ListItem>
              <ListItemIcon><Handshake color="primary" /></ListItemIcon>
              <ListItemText 
                primary="הצעה וקיבול" 
                secondary="פס"ד מנורה, ברוך, כהן - מועד קבלה, פקיעה, הצעה מזכה" 
              />
            </ListItem>
            <ListItem>
              <ListItemIcon><Balance color="primary" /></ListItemIcon>
              <ListItemText 
                primary="פירוש והשלמת חוזה" 
                secondary="פס"ד אפרופים - מבחן חד-שלבי, היררכיית פירוש" 
              />
            </ListItem>
            <ListItem>
              <ListItemIcon><Gavel color="primary" /></ListItemIcon>
              <ListItemText 
                primary="פגמים בכריתת חוזה" 
                secondary="טעות, הטעיה, כפייה - פס"ד לוטם רהיטים" 
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

export default ContractFormationExam;

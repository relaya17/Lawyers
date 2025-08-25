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
  HowToVote,
  Balance,
  Work,
  Public,
  Scale,
  AccountBalance
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
  // חלק א' - תנאי מועמדות לכנסת
  {
    id: 1,
    type: 'multiple-choice',
    difficulty: 'בינוני',
    icon: '🏛️',
    category: 'תנאי מועמדות לכנסת',
    question: 'איזה מהתנאים הבאים מונע התמודדות לכנסת?',
    options: [
      { id: 'a', text: 'מאסר בפועל של חודשיים על עבירת תעבורה' },
      { id: 'b', text: 'מאסר בפועל של 4 חודשים על עבירת שוחד' },
      { id: 'c', text: 'עבודות שירות של 6 חודשים' },
      { id: 'd', text: 'מאסר על תנאי של שנה' }
    ],
    correctAnswer: 'b',
    explanation: 'מאסר בפועל של יותר מ-3 חודשים על עבירה שיש בה קלון (כמו שוחד) מונע התמודדות לכנסת למשך 7 שנים מסיום ריצוי העונש.',
    lawReference: 'חוק יסוד: הכנסת, סעיף 6א'
  },
  {
    id: 2,
    type: 'multiple-choice',
    difficulty: 'קשה',
    icon: '⚖️',
    category: 'תנאי מועמדות לכנסת',
    question: 'מתי מתחילה לרוץ תקופת איסור ההתמודדות של 7 שנים?',
    options: [
      { id: 'a', text: 'מרגע מתן פסק הדין' },
      { id: 'b', text: 'מרגע כניסה לכלא' },
      { id: 'c', text: 'מרגע סיום ריצוי המאסר המלא' },
      { id: 'd', text: 'מרגע השחרור המוקדם' }
    ],
    correctAnswer: 'c',
    explanation: 'לפי פסק דין אריה דרעי, תקופת הקלון נספרת מסיום ריצוי העונש המלא ולא מהשחרור המוקדם. זאת כדי למנוע מצב שבו שחרור מוקדם יקצר את תקופת הענישה הפוליטית.',
    precedent: 'פסק דין אריה דרעי - ספירת תקופת הקלון'
  },
  {
    id: 3,
    type: 'true-false',
    difficulty: 'בינוני',
    icon: '📜',
    category: 'תנאי מועמדות לכנסת',
    question: 'שופט בית משפט שלום יכול להתמודד לכנסת מבלי להתפטר מתפקידו.',
    correctAnswer: 'false',
    explanation: 'שופטים, כמו משרתי ציבור בכירים אחרים, חייבים להתפטר זמן סביר לפני הבחירות למנוע ניגוד עניינים ושימוש לרעה בסמכות ציבורית.',
    lawReference: 'חוק יסוד: הכנסת - הגבלות על משרתי ציבור'
  },
  {
    id: 4,
    type: 'multiple-choice',
    difficulty: 'בינוני',
    icon: '🗳️',
    category: 'זכות בחירה',
    question: 'מי מהבאים יכול להצביע מחוץ לישראל?',
    options: [
      { id: 'a', text: 'כל ישראלי המתגורר בחו"ל' },
      { id: 'b', text: 'עובד שגרירות ישראלית בחו"ל' },
      { id: 'c', text: 'חייל משרת במשימה בחו"ל' },
      { id: 'd', text: 'תושב חוץ זמני' }
    ],
    correctAnswer: 'b',
    explanation: 'רק עובדי נציגויות דיפלומטיות וקונסוליות ישראליות יכולים להצביע מחוץ לישראל במקום עבודתם. כל ישראלי אחר חייב להגיע לישראל כדי להצביע.',
    lawReference: 'חוק הבחירות לכנסת - הצבעה מחוץ לישראל'
  },
  {
    id: 5,
    type: 'multiple-choice',
    difficulty: 'קל',
    icon: '📊',
    category: 'אחוז החסימה',
    question: 'מהו אחוז החסימה הנוכחי לכניסה לכנסת?',
    options: [
      { id: 'a', text: '2%' },
      { id: 'b', text: '3.25%' },
      { id: 'c', text: '4%' },
      { id: 'd', text: '5%' }
    ],
    correctAnswer: 'b',
    explanation: 'אחוז החסימה עומד על 3.25% מסך הקולות הכשרים. מטרתו למנוע ריבוי מפלגות קטנות ולהבטיח יציבות שלטונית. מפלגות שלא עוברות את האחוז לא מקבלות מנדטים.',
    lawReference: 'חוק הבחירות לכנסת, סעיף 81'
  },

  // חלק ב' - פרישה והתפלגות
  {
    id: 6,
    type: 'case-study',
    difficulty: 'קשה',
    icon: '🏛️',
    category: 'פרישה והתפלגות',
    question: 'סיטואציה: סיעה של 9 חברי כנסת התפלגה כשבה 3 חברים הקימו סיעה חדשה. האם מדובר בהתפלגות או פרישה?',
    options: [
      { id: 'a', text: 'התפלגות - כי 3 חברים הם שליש מהסיעה' },
      { id: 'b', text: 'פרישה - כי פחות מ-4 חברים' },
      { id: 'c', text: 'תלוי בהחלטת ועדת הכנסת' },
      { id: 'd', text: 'התפלגות - כי יש לפחות 2 חברים' }
    ],
    correctAnswer: 'a',
    explanation: 'התפלגות מתקיימת כאשר קבוצה של לפחות 2 חברי כנסת מהווים שליש מהסיעה או קבוצה של לפחות 4 חברים. כאן 3 מתוך 9 זה שליש, לכן זו התפלגות ולא פרישה.',
    lawReference: 'חוק הכנסת, סעיף 61 - תנאי התפלגות'
  },
  {
    id: 7,
    type: 'true-false',
    difficulty: 'בינוני',
    icon: '⚖️',
    category: 'פרישה והתפלגות',
    question: 'חבר כנסת שהוכרז כפורש יכול לערער על ההחלטה לבית המשפט העליון.',
    correctAnswer: 'false',
    explanation: 'ערעור על החלטת ועדת הכנסת בדבר פרישה מוגש לבית המשפט המחוזי בירושלים, ולא לבית המשפט העליון.',
    lawReference: 'חוק הכנסת - הליך ערעור על החלטת פרישה'
  },

  // חלק ג' - שוויון הזדמנויות בעבודה
  {
    id: 8,
    type: 'multiple-choice',
    difficulty: 'בינוני',
    icon: '👥',
    category: 'שוויון בעבודה',
    question: 'על איזה מעסיק לא חל חוק שוויון הזדמנויות בעבודה?',
    options: [
      { id: 'a', text: 'מעסיק עם 10 עובדים' },
      { id: 'b', text: 'מעסיק עם 5 עובדים' },
      { id: 'c', text: 'מעסיק עם 8 עובדים' },
      { id: 'd', text: 'כל מעסיק חייב בחוק' }
    ],
    correctAnswer: 'b',
    explanation: 'חוק שוויון הזדמנויות בעבודה לא חל על עסק עם פחות מ-6 עובדים. זאת כדי להקל על עסקים קטנים מאוד.',
    lawReference: 'חוק שוויון הזדמנויות בעבודה, סעיף 21(ג)'
  },
  {
    id: 9,
    type: 'case-study',
    difficulty: 'קשה',
    icon: '⚖️',
    category: 'שוויון בעבודה',
    question: 'רופאה מוסלמית עם חיג\'אב סורבה לעבודה בקליניקה. על מי נטל ההוכחה?',
    options: [
      { id: 'a', text: 'על הרופאה להוכיח הפליה' },
      { id: 'b', text: 'על הקליניקה להוכיח שאין הפליה' },
      { id: 'c', text: 'נטל משותף על שני הצדדים' },
      { id: 'd', text: 'אין נטל הוכחה בעניין זה' }
    ],
    correctAnswer: 'b',
    explanation: 'בתובענה על הפרת סעיף 2 (איסור הפליה בקבלה לעבודה), נטל ההוכחה הופך למעסיק. זה מקרה דומה לפס"ד מריה מחאמיד נ\' ניו שן קליניק.',
    precedent: 'מריה מחאמיד נ\' ניו שן קליניק - הפליה על רקע דתי',
    lawReference: 'חוק שוויון הזדמנויות בעבודה, סעיף 9(א)'
  },
  {
    id: 10,
    type: 'multiple-choice',
    difficulty: 'בינוני',
    icon: '🕊️',
    category: 'שוויון בעבודה',
    question: 'באיזה מקרה מותר להפלות בקבלה לעבודה?',
    options: [
      { id: 'a', text: 'העדפת גברים למשרת מנהל' },
      { id: 'b', text: 'דרישה שמשגיח כשרות יהיה יהודי' },
      { id: 'c', text: 'העדפת רווקים על נשואים' },
      { id: 'd', text: 'העדפת צעירים על מבוגרים' }
    ],
    correctAnswer: 'b',
    explanation: 'אפליה מותרת כאשר היא נובעת מהאופי המיוחד של התפקיד. משגיח כשרות חייב להיות יהודי מטבע התפקיד, ולכן זו אפליה לגיטימית.',
    lawReference: 'חוק שוויון הזדמנויות בעבודה - חריג לאופי התפקיד'
  },

  // חלק ד' - איסור הפליה במקומות ציבוריים
  {
    id: 11,
    type: 'multiple-choice',
    difficulty: 'בינוני',
    icon: '🏪',
    category: 'איסור הפליה במקומות ציבוריים',
    question: 'איזה מהבאים אינו נחשב למקום ציבורי לפי החוק?',
    options: [
      { id: 'a', text: 'מסעדה' },
      { id: 'b', text: 'בית כנסת' },
      { id: 'c', text: 'בית חולים פרטי' },
      { id: 'd', text: 'מועדון כושר' }
    ],
    correctAnswer: 'b',
    explanation: 'בית כנסת נהנה מחריג לפי סעיף 3(ד)(1) - מקומות שבהם הפליה נדרשת מטבע המקום או השירות, כמו בתי תפילה המיועדים לקהילה דתית מסוימת.',
    lawReference: 'חוק איסור הפליה במקומות ציבוריים, סעיף 3(ד)(1)'
  },
  {
    id: 12,
    type: 'case-study',
    difficulty: 'קשה',
    icon: '💒',
    category: 'איסור הפליה במקומות ציבוריים',
    question: 'בית ארחה סירב לארח חתונה של זוג לסביות. מה יהיה פסק הדין?',
    options: [
      { id: 'a', text: 'מותר - חופש דתי של בעל הבית' },
      { id: 'b', text: 'אסור - הפליה על בסיס נטייה מינית' },
      { id: 'c', text: 'תלוי באופי הדתי של המקום' },
      { id: 'd', text: 'מותר אם יש חלופה באזור' }
    ],
    correctAnswer: 'b',
    explanation: 'בפס"ד טל יעקובוביץ ויעל בירן נ\' בית הארחה יד השמונה נקבע שמדובר בהפליה אסורה על בסיס נטייה מינית במקום ציבורי. הזוג קיבל פיצוי של 60,000 ש"ח.',
    precedent: 'טל יעקובוביץ ויעל בירן נ\' בית הארחה יד השמונה',
    lawReference: 'חוק איסור הפליה במקומות ציבוריים, סעיף 3(א)'
  },
  {
    id: 13,
    type: 'true-false',
    difficulty: 'בינוני',
    icon: '🏛️',
    category: 'איסור הפליה במקומות ציבוריים',
    question: 'עירייה יכולה לתת הנחה בארנונה רק לתושבים ולא לתושבי ערים אחרות.',
    correctAnswer: 'true',
    explanation: 'לפי סעיף 3(א)(1), מותר לרשות מקומית להפלות על בסיס מקום מגורים כדי להעדיף תושבים על פני אחרים במידה הנדרשת לביצוע סמכויותיה.',
    lawReference: 'חוק איסור הפליה במקומות ציבוריים, סעיף 3(א)(1)'
  },
  {
    id: 14,
    type: 'multiple-choice',
    difficulty: 'קשה',
    icon: '🎭',
    category: 'איסור הפליה במקומות ציבוריים',
    question: 'מתי מותרת הפרדה מגדרית באירוע ציבורי?',
    options: [
      { id: 'a', text: 'תמיד אסור' },
      { id: 'b', text: 'כאשר זה מקובל בציבור המקומי' },
      { id: 'c', text: 'כאשר אי-הפרדה תפגע בהספקת השירות ויש פתרון חלופי' },
      { id: 'd', text: 'רק באירועים דתיים' }
    ],
    correctAnswer: 'c',
    explanation: 'לפי סעיף 3(ד)(3), הפרדה מגדרית מותרת כאשר אי-הפרדה תפגע בהספקת השירות, ובלבד שניתן פתרון חלופי לנפגעי הציבור. כך בפס"ד ארבל נ\' עיריית עפולה.',
    precedent: 'ארבל נ\' עיריית עפולה - הפרדה מגדרית בהופעה',
    lawReference: 'חוק איסור הפליה במקומות ציבוריים, סעיף 3(ד)(3)'
  },

  // חלק ה' - נטל הוכחה וסנקציות
  {
    id: 15,
    type: 'case-study',
    difficulty: 'קשה מאוד',
    icon: '⚖️',
    category: 'נטל הוכחה',
    question: 'לאחר שערבי נכנס למועדון ועוכב בכניסה בעוד לקוחות אחרים נכנסו, על מי נטל ההוכחה?',
    options: [
      { id: 'a', text: 'על הערבי להוכיח הפליה גזענית' },
      { id: 'b', text: 'על המועדון להוכיח שלא היה זה בגלל הגזע' },
      { id: 'c', text: 'על בית המשפט לחקור את העובדות' },
      { id: 'd', text: 'אין נטל הוכחה במקרה זה' }
    ],
    correctAnswer: 'b',
    explanation: 'לפי סעיף 6 לחוק איסור הפליה, כאשר התובע מציג נסיבות שמעוררות חשד להפליה, נטל ההוכחה עובר לנתבע. כך בפס"ד יצחק מזרחי נ\' קיבוץ רמות מנשה.',
    precedent: 'יצחק מזרחי נ\' קיבוץ רמות מנשה - נטל הוכחה בהפליה גזענית',
    lawReference: 'חוק איסור הפליה במקומות ציבוריים, סעיף 6'
  },
  {
    id: 16,
    type: 'multiple-choice',
    difficulty: 'בינוני',
    icon: '💰',
    category: 'סנקציות',
    question: 'מה הסנקציה הרגילה על הפליה במקום ציבורי?',
    options: [
      { id: 'a', text: 'קנס פלילי בלבד' },
      { id: 'b', text: 'פיצוי כספי ללא הוכחת נזק' },
      { id: 'c', text: 'רק סגירת העסק' },
      { id: 'd', text: 'התנצלות פומבית' }
    ],
    correctAnswer: 'b',
    explanation: 'הסנקציה העיקרית היא פיצוי כספי ללא צורך בהוכחת נזק, כפי שניתן בפסקי הדין השונים (למשל 60,000 ש"ח בפס"ד יד השמונה).',
    lawReference: 'חוק איסור הפליה במקומות ציבוריים - סנקציות אזרחיות'
  },

  // חלק ו' - מינוי שופטים
  {
    id: 17,
    type: 'multiple-choice',
    difficulty: 'בינוני',
    icon: '👨‍⚖️',
    category: 'מינוי שופטים',
    question: 'כמה חברים יש בוועדה למינוי שופטים?',
    options: [
      { id: 'a', text: '7' },
      { id: 'b', text: '9' },
      { id: 'c', text: '11' },
      { id: 'd', text: '5' }
    ],
    correctAnswer: 'b',
    explanation: 'הוועדה מורכבת מ-9 חברים: 3 שופטים (נשיא העליון ו-2 נוספים), 2 שרים, 2 חברי כנסת ו-2 נציגי לשכת עורכי הדין.',
    lawReference: 'חוק יסוד: השפיטה, סעיף 4'
  },
  {
    id: 18,
    type: 'multiple-choice',
    difficulty: 'קשה',
    icon: '🏛️',
    category: 'מינוי שופטים',
    question: 'כמה קולות נדרשים למינוי שופט לבית המשפט העליון?',
    options: [
      { id: 'a', text: '5 מתוך 9' },
      { id: 'b', text: '6 מתוך 9' },
      { id: 'c', text: '7 מתוך 9' },
      { id: 'd', text: '8 מתוך 9' }
    ],
    correctAnswer: 'c',
    explanation: 'נדרש רוב של 7 מתוך 9 חברי הוועדה למינוי שופט לבית המשפט העליון. זהו רוב גדול המבטיח קונסנזוס רחב.',
    lawReference: 'חוק יסוד: השפיטה - דרישת רוב למינוי לעליון'
  },

  // שאלות מתקדמות וניתוח מקרים
  {
    id: 19,
    type: 'case-study',
    difficulty: 'קשה מאוד',
    icon: '🎯',
    category: 'ניתוח משולב',
    question: 'שופט בג"ץ מעוניין להתמודד לכנסת, אך נגדו הוגשה תלונה פלילית. מה עליו לעשות?',
    options: [
      { id: 'a', text: 'יכול להתמודד מיד' },
      { id: 'b', text: 'חייב להתפטר זמן סביר לפני הבחירות' },
      { id: 'c', text: 'חייב לחכות לסיום ההליך הפלילי' },
      { id: 'd', text: 'תלוי בתוצאת ההליך הפלילי' }
    ],
    correctAnswer: 'b',
    explanation: 'שופט חייב להתפטר זמן סביר לפני הבחירות למנוע ניגוד עניינים, ללא תלות בהליך הפלילי. אם יורשע - יחולו מגבלות נוספות לפי הענישה.',
    lawReference: 'חוק יסוד: הכנסת - הגבלות על משרתי ציבור בכירים'
  },
  {
    id: 20,
    type: 'case-study',
    difficulty: 'קשה מאוד',
    icon: '🏛️',
    category: 'ניתוח משולב',
    question: 'בנק סירב לתת משכנתא לזוג צעיר בטענה שהם מתחת לגיל 25. האם זו הפליה אסורה?',
    options: [
      { id: 'a', text: 'לא - הבנק פרטי ולא מקום ציבורי' },
      { id: 'b', text: 'כן - הפליה על בסיס גיל במקום ציבורי' },
      { id: 'c', text: 'תלוי בנהלי הבנק' },
      { id: 'd', text: 'מותר אם יש הצדקה עסקית' }
    ],
    correctAnswer: 'b',
    explanation: 'בנק נחשב למקום ציבורי הנותן שירות לציבור. הפליה על בסיס גיל אסורה אלא אם ניתן להוכיח הצדקה אמיתית מאופי השירות. בפס"ד שי נ\' בנק אוצר החייל נדחתה הצדקה דומה.',
    precedent: 'שי נ\' בנק אוצר החייל - הפליה על בסיס גיל בבנק',
    lawReference: 'חוק איסור הפליה במקומות ציבוריים, סעיף 3(א)'
  }
];

const ParliamentaryAndEqualityLawExam: React.FC = () => {
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
            <AccountBalance sx={{ fontSize: 60, color: '#1976d2', mb: 2 }} />
            <Typography variant="h3" component="h1" gutterBottom color="primary" fontWeight="bold">
              🏛️ מבחן תנאי מועמדות ושוויון במשפט
            </Typography>
            <Typography variant="h6" color="text.secondary" mb={3}>
              מבחן מקיף על תנאי מועמדות לכנסת, שוויון הזדמנויות בעבודה ואיסור הפליה במקומות ציבוריים
            </Typography>
          </Box>

          <Box sx={{ backgroundColor: '#f5f7fa', p: 3, borderRadius: 2, mb: 4 }}>
            <Typography variant="h6" gutterBottom color="primary">
              📋 פרטי המבחן:
            </Typography>
            <List>
              <ListItem>
                <ListItemIcon><Info color="primary" /></ListItemIcon>
                <ListItemText primary="20 שאלות מתקדמות ברמות קושי שונות" />
              </ListItem>
              <ListItem>
                <ListItemIcon><Gavel color="primary" /></ListItemIcon>
                <ListItemText primary="נושאים: תנאי מועמדות, זכויות בחירה, שוויון בעבודה, איסור הפליה" />
              </ListItem>
              <ListItem>
                <ListItemIcon><Scale color="primary" /></ListItemIcon>
                <ListItemText primary="זמן: 90 דקות" />
              </ListItem>
              <ListItem>
                <ListItemIcon><CheckCircle color="primary" /></ListItemIcon>
                <ListItemText primary="הסברים מפורטים עם פסיקה ומקורות חוק" />
              </ListItem>
            </List>
          </Box>

          <Alert severity="info" sx={{ mb: 3 }}>
            <Typography variant="body1">
              <strong>💡 טיפ ללמידה:</strong> המבחן כולל מקרי מבחן אמיתיים מפסיקת בתי המשפט.
              קראו כל שאלה בעינים וחשבו על העקרונות המשפטיים הרלוונטיים לפני המענה.
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
            {results.percentage >= 90 && '🏆 מעולה! שליטה מושלמת בחומר'}
            {results.percentage >= 80 && results.percentage < 90 && '⭐ טוב מאוד! ידע חזק בנושא'}
            {results.percentage >= 70 && results.percentage < 80 && '👍 טוב! עדיין יש מקום לשיפור'}
            {results.percentage < 70 && '📚 מומלץ לחזור על החומר ולתרגל נוסף'}
          </Alert>

          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" gutterBottom color="primary">
              📊 פירוט תוצאות לפי קטגוריות:
            </Typography>
            {[
              'תנאי מועמדות לכנסת',
              'שוויון בעבודה', 
              'איסור הפליה במקומות ציבוריים',
              'פרישה והתפלגות',
              'מינוי שופטים',
              'ניתוח משולב'
            ].map(category => {
              const categoryQuestions = questions.filter(q => q.category === category);
              const categoryCorrect = categoryQuestions.filter(q => userAnswers[q.id] === q.correctAnswer).length;
              const categoryPercentage = Math.round((categoryCorrect / categoryQuestions.length) * 100);
              
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
            📚 סיכום נושאים מרכזיים:
          </Typography>
          <List>
            <ListItem>
              <ListItemIcon><HowToVote color="primary" /></ListItemIcon>
              <ListItemText 
                primary="תנאי מועמדות לכנסת" 
                secondary="מגבלות עבר פלילי, תפקידים ציבוריים, אידיאולוגיה" 
              />
            </ListItem>
            <ListItem>
              <ListItemIcon><Work color="primary" /></ListItemIcon>
              <ListItemText 
                primary="שוויון הזדמנויות בעבודה" 
                secondary="חובות מעסיקים, חריגים, נטל הוכחה" 
              />
            </ListItem>
            <ListItem>
              <ListItemIcon><Public color="primary" /></ListItemIcon>
              <ListItemText 
                primary="איסור הפליה במקומות ציבוריים" 
                secondary="הגדרת מקום ציבורי, חריגים מותרים, סנקציות" 
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

export default ParliamentaryAndEqualityLawExam;

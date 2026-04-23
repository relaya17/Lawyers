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
  Warning,
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

const questions: Question[] = [
  // חלק א' - עושק
  {
    id: 1,
    type: 'multiple-choice',
    difficulty: 'בינוני',
    icon: '⚠️',
    category: 'עושק',
    question: 'איזה מהבאים אינו נדרש כדי להוכיח עילת עושק?',
    options: [
      { id: 'a', text: 'קיום חוזה' },
      { id: 'b', text: 'מצב של מצוקה או חולשה' },
      { id: 'c', text: 'נזק כספי בפועל' },
      { id: 'd', text: 'קשר סיבתי סובייקטיבי' }
    ],
    correctAnswer: 'c',
    explanation: 'לפי סעיף 16 לחוק החוזים, אין צורך להוכיח נזק כספי בפועל. די בהוכחת היסודות: קיום חוזה, מצב העשוק, התנהגות העושק, קשר סיבתי ותנאים גרועים.',
    lawReference: 'חוק החוזים, סעיף 16'
  },
  {
    id: 2,
    type: 'case-study',
    difficulty: 'קשה',
    icon: '🏥',
    category: 'עושק',
    question: 'לפי פס"ד חיים כהן ושות\', מתי חולשה גופנית יכולה להיחשב גם כחולשה שכלית?',
    options: [
      { id: 'a', text: 'תמיד - הם זהים' },
      { id: 'b', text: 'כשהחולשה הגופנית משפיעה על הרצון ושיקול הדעת' },
      { id: 'c', text: 'רק במקרה של מחלת נפש' },
      { id: 'd', text: 'אף פעם - הם נפרדים' }
    ],
    correctAnswer: 'b',
    explanation: 'פס"ד חיים כהן ושות\' גבע קבע שחולשה פיזית יכולה להיחשב גם כשכלית כאשר היא משפיעה על הרצון וכושר השיפוט של האדם במצוקה.',
    precedent: 'פס"ד חיים כהן ושות\' גבע - קשר בין חולשה גופנית לשכלית',
    lawReference: 'חוק החוזים, סעיף 16'
  },
  {
    id: 3,
    type: 'case-study',
    difficulty: 'קשה מאוד',
    icon: '⏰',
    category: 'עושק',
    question: 'לפי פס"ד סאסי קיקאון, האם מצוקה רגעית מספיקה לעילת עושק?',
    options: [
      { id: 'a', text: 'כן - כל מצוקה מספיקה' },
      { id: 'b', text: 'לא - חובה מצוקה מתמשכת' },
      { id: 'c', text: 'הפסיקה חלוקה ואינה חד משמעית' },
      { id: 'd', text: 'תלוי בסכום החוזה' }
    ],
    correctAnswer: 'c',
    explanation: 'פס"ד סאסי קיקאון העלה את סוגיית מצוקה רגעית מול מתמשכת, אך הפסיקה נותרה חלוקה ואינה חד משמעית בנושא זה.',
    precedent: 'פס"ד סאסי קיקאון - מצוקה רגעית מול מתמשכת',
    lawReference: 'חוק החוזים, סעיף 16'
  },
  {
    id: 4,
    type: 'multiple-choice',
    difficulty: 'בינוני',
    icon: '🔄',
    category: 'עושק',
    question: 'מה הסעד העיקרי בעילת עושק?',
    options: [
      { id: 'a', text: 'פיצויים כספיים בלבד' },
      { id: 'b', text: 'ביטול אוטומטי של החוזה' },
      { id: 'c', text: 'שינוי תנאי החוזה' },
      { id: 'd', text: 'קנס למעשיק' }
    ],
    correctAnswer: 'b',
    explanation: 'סעיף 18 לחוק החוזים קובע זכות ביטול אוטומטית בעילת עושק. ניתן גם ביטול חלקי (סעיף 19) והודעה לצד השני (סעיף 20).',
    lawReference: 'חוק החוזים, סעיפים 18-21'
  },

  // חלק ב' - חוזה למראית עין
  {
    id: 5,
    type: 'multiple-choice',
    difficulty: 'קשה',
    icon: '🎭',
    category: 'חוזה למראית עין',
    question: 'מה ההבדל בין חוזה למראית עין מוחלטת ליחסית?',
    options: [
      { id: 'a', text: 'מוחלטת - הצדדים לא מתכוונים לקיים כלל; יחסית - יש חוזה סמוי' },
      { id: 'b', text: 'מוחלטת - חוזה תקף; יחסית - חוזה בטל' },
      { id: 'c', text: 'אין הבדל - שניהם בטלים' },
      { id: 'd', text: 'תלוי בצד שלישי' }
    ],
    correctAnswer: 'a',
    explanation: 'מראית עין מוחלטת - הצדדים אינם מתכוונים לקיים את החוזה כלל (בטל). יחסית - החוזה הגלוי בטל אך קיים חוזה סמוי שהצדדים כן מתכוונים לקיים.',
    lawReference: 'חוק החוזים, סעיף 13'
  },
  {
    id: 6,
    type: 'case-study',
    difficulty: 'קשה',
    icon: '🏢',
    category: 'חוזה למראית עין',
    question: 'לפי פס"ד סולל צוקרמן, מה קורה לחוזה מלאכותי?',
    options: [
      { id: 'a', text: 'בטל לחלוטין' },
      { id: 'b', text: 'תקף, אך רשויות המס יכולות להתעלם מהעסקה' },
      { id: 'c', text: 'תקף רק בין הצדדים' },
      { id: 'd', text: 'תלוי בהחלטת השופט' }
    ],
    correctAnswer: 'b',
    explanation: 'פס"ד סולל צוקרמן קבע שחוזה מלאכותי (שמתקיים אך למטרה אחרת מהמוצהר) יישאר תקף, אך רשויות המס רשאיות להתעלם מהעסקה.',
    precedent: 'פס"ד סולל צוקרמן - חוזה מלאכותי',
    lawReference: 'חוק החוזים, סעיף 13'
  },
  {
    id: 7,
    type: 'true-false',
    difficulty: 'בינוני',
    icon: '👥',
    category: 'חוזה למראית עין',
    question: 'צד שלישי שהסתמך בתום לב על חוזה למראית עין תמיד ייפגע.',
    correctAnswer: 'false',
    explanation: 'לפי סעיף 13 סיפא לחוק החוזים, צד שלישי שהסתמך בתום לב על החוזה למראית עין אינו נפגע. זהו סייג חשוב להגנה על הצד השלישי.',
    lawReference: 'חוק החוזים, סעיף 13 סיפא'
  },

  // חלק ג' - חוזה על תנאי
  {
    id: 8,
    type: 'multiple-choice',
    difficulty: 'בינוני',
    icon: '📋',
    category: 'חוזה על תנאי',
    question: 'מה ההבדל בין תנאי מתלה לתנאי מפסיק?',
    options: [
      { id: 'a', text: 'מתלה - החוזה לא אכיף עד למימוש; מפסיק - החוזה אכיף אך פוקע במימוש' },
      { id: 'b', text: 'מתלה - תמיד בטל; מפסיק - תמיד תקף' },
      { id: 'c', text: 'אין הבדל - שניהם זהים' },
      { id: 'd', text: 'תלוי בסוג החוזה' }
    ],
    correctAnswer: 'a',
    explanation: 'תנאי מתלה - החוזה תקף אך לא אכיף עד למימוש האירוע. תנאי מפסיק - החוזה תקף ואכיף מרגע כריתתו, אך פוקע אם האירוע מתקיים.',
    lawReference: 'חוק החוזים, סעיפים 27-29'
  },
  {
    id: 9,
    type: 'multiple-choice',
    difficulty: 'קשה',
    icon: '🎯',
    category: 'חוזה על תנאי',
    question: 'איזה מהבאים אינו דרישה לתנאי תקף?',
    options: [
      { id: 'a', text: 'אי ודאות' },
      { id: 'b', text: 'חיצוניות' },
      { id: 'c', text: 'השפעה על תוקף החוזה' },
      { id: 'd', text: 'אישור בית משפט' }
    ],
    correctAnswer: 'd',
    explanation: 'הדרישות לתנאי תקף הן: אי ודאות (האירוע אינו ודאי), חיצוניות (לא בשליטת צד אחד בלבד), והשפעה ישירה על תוקף החוזה. אין צורך באישור בית משפט.',
    lawReference: 'חוק החוזים, סעיפים 27-29'
  },
  {
    id: 10,
    type: 'case-study',
    difficulty: 'קשה מאוד',
    icon: '🚫',
    category: 'חוזה על תנאי',
    question: 'מה קורה כאשר צד מסכל תנאי מתלה בכוונה?',
    options: [
      { id: 'a', text: 'החוזה בטל' },
      { id: 'b', text: 'לא יוכל להסתמך על הסיכול' },
      { id: 'c', text: 'החוזה הופך למוחלט' },
      { id: 'd', text: 'תלוי אם עשה זאת בתום לב' }
    ],
    correctAnswer: 'd',
    explanation: 'לפי סעיף 28, צד שיגרום לסיכול תנאי מתלה או מפסיק לא יוכל להסתמך על הסיכול, אלא אם נעשה בתום לב. התום לב הוא הקריטריון החשוב.',
    lawReference: 'חוק החוזים, סעיף 28'
  },

  // חלק ד' - חוזה פסול
  {
    id: 11,
    type: 'multiple-choice',
    difficulty: 'בינוני',
    icon: '⚖️',
    category: 'חוזה פסול',
    question: 'איזה מהבאים הוא סוג של פסלות חוזה?',
    options: [
      { id: 'a', text: 'רק חוזה לא חוקי' },
      { id: 'b', text: 'רק חוזה לא מוסרי' },
      { id: 'c', text: 'לא חוקי, לא מוסרי, ונוגד תקנת הציבור' },
      { id: 'd', text: 'רק חוזה יקר מדי' }
    ],
    correctAnswer: 'c',
    explanation: 'סעיף 30 לחוק קובע שלושה סוגי פסלות: לא חוקי (נוגד חוק קוגנטי), לא מוסרי, ונוגד תקנת הציבור (כמו הגבלת חופש עיסוק או סעיפי פטור קיצוניים).',
    lawReference: 'חוק החוזים, סעיף 30'
  },
  {
    id: 12,
    type: 'case-study',
    difficulty: 'קשה',
    icon: '🏭',
    category: 'חוזה פסול',
    question: 'לפי פס"ד צים מזיאר, מה הקריטריונים לבחינת הגבלת חופש עיסוק?',
    options: [
      { id: 'a', text: 'רק היקף גיאוגרפי' },
      { id: 'b', text: 'סוג היחסים, אינטרסים מוגנים, שטח, זמן והיקף' },
      { id: 'c', text: 'רק משך הזמן' },
      { id: 'd', text: 'רק סוג העבודה' }
    ],
    correctAnswer: 'b',
    explanation: 'פס"ד צים מזיאר קבע קריטריונים מקיפים לבחינת סבירות הגבלת חופש עיסוק: סוג היחסים (עובד-מעסיק/מוכר-קונה), אינטרסים מוגנים (סודות מסחריים), והיקף ההגבלה (מיקום, זמן והיקף עיסוק).',
    precedent: 'פס"ד צים מזיאר - קריטריונים להגבלת חופש עיסוק',
    lawReference: 'חוק יסוד: חופש העיסוק'
  },
  {
    id: 13,
    type: 'multiple-choice',
    difficulty: 'קשה',
    icon: '🛡️',
    category: 'חוזה פסול',
    question: 'מה קורה כאשר צד אחד מודע לאי חוקיות החוזה והשני תמים?',
    options: [
      { id: 'a', text: 'כל החוזה בטל' },
      { id: 'b', text: 'החוזה פסול לגבי הצד המודע; זכויות הצד התמים נשמרות' },
      { id: 'c', text: 'החוזה תקף לגבי שניהם' },
      { id: 'd', text: 'תלוי בסוג האי חוקיות' }
    ],
    correctAnswer: 'b',
    explanation: 'כאשר צד אחד מודע לאי חוקיות והשני תמים, החוזה פסול לגבי הצד המודע אך זכויותיו של הצד התמים נשמרות. זהו עקרון הגנה על הצד התמים.',
    lawReference: 'חוק החוזים, סעיף 30 - הגנה על צד תמים'
  },

  // שאלות מתקדמות ומשולבות
  {
    id: 14,
    type: 'case-study',
    difficulty: 'קשה מאוד',
    icon: '🧩',
    category: 'ניתוח משולב',
    question: 'חוזה נחתם בעת מצוקה כלכלית, אך התברר שהוא גם למראית עין. איזו עילה תקדם?',
    options: [
      { id: 'a', text: 'רק עושק' },
      { id: 'b', text: 'רק מראית עין' },
      { id: 'c', text: 'שתי העילות במקביל' },
      { id: 'd', text: 'העילה החזקה יותר עפ"י הראיות' }
    ],
    correctAnswer: 'd',
    explanation: 'כאשר יש מספר עילות אפשריות, בית המשפט יבחן את העילה שניתן להוכיח בצורה החזקה יותר על בסיס הראיות. לעתים ניתן לטעון לשתי עילות במקביל.',
    lawReference: 'עקרונות דיני חוזים - ריבוי עילות'
  },
  {
    id: 15,
    type: 'case-study',
    difficulty: 'קשה מאוד',
    icon: '⚖️',
    category: 'ניתוח משולב',
    question: 'חוזה עבודה כולל סעיף איסור תחרות לא סביר + נחתם בעת מצוקה. מה הסעד המתאים?',
    options: [
      { id: 'a', text: 'ביטול חלקי של סעיף איסור התחרות' },
      { id: 'b', text: 'ביטול כל החוזה בעילת עושק' },
      { id: 'c', text: 'בחינה נפרדת של כל עילה' },
      { id: 'd', text: 'כל התשובות נכונות בהתאם לנסיבות' }
    ],
    correctAnswer: 'd',
    explanation: 'במקרה מורכב כזה, בית המשפט יכול: לבטל חלקית את סעיף איסור התחרות (סעיף 19), לבטל את כל החוזה בעילת עושק, או לבחון כל עילה בנפרד. הפתרון תלוי בנסיבות הספציפיות.',
    lawReference: 'חוק החוזים, סעיפים 19, 30'
  },

  // שאלות על תום לב
  {
    id: 16,
    type: 'multiple-choice',
    difficulty: 'בינוני',
    icon: '🤝',
    category: 'תום לב',
    question: 'מתי חלה חובת תום לב לפי חוק החוזים?',
    options: [
      { id: 'a', text: 'רק אחרי חתימת החוזה' },
      { id: 'b', text: 'רק בשלב המו"מ' },
      { id: 'c', text: 'בשלב המו"מ ובקיום החוזה' },
      { id: 'd', text: 'רק במקרה של סכסוך' }
    ],
    correctAnswer: 'c',
    explanation: 'לפי סעיפים 12 ו-39 לחוק החוזים, חובת תום לב חלה הן בשלב המו"מ הטרום חוזי והן בקיום החוזה עצמו.',
    lawReference: 'חוק החוזים, סעיפים 12 ו-39'
  },
  {
    id: 17,
    type: 'case-study',
    difficulty: 'קשה',
    icon: '💼',
    category: 'תום לב',
    question: 'איזה מהבאים מהווה הפרת תום לב בשלב המו"מ?',
    options: [
      { id: 'a', text: 'ניהול מו"מ מקביל עם מתחרה' },
      { id: 'b', text: 'אי גילוי עובדה מהותית' },
      { id: 'c', text: 'יציאה ממו"מ מתקדם ללא סיבה' },
      { id: 'd', text: 'כל התשובות נכונות' }
    ],
    correctAnswer: 'd',
    explanation: 'כל המקרים הללו מהווים הפרת תום לב בשלב המו"מ: ניהול מו"מ מקביל, אי גילוי עובדה מהותית, ויציאה ממו"מ מתקדם ללא הצדקה.',
    lawReference: 'חוק החוזים, סעיף 12'
  },
  {
    id: 18,
    type: 'multiple-choice',
    difficulty: 'קשה',
    icon: '💰',
    category: 'תום לב',
    question: 'מה ההבדל בין פיצויי הסתמכות לפיצויים חיוביים?',
    options: [
      { id: 'a', text: 'הסתמלות - החזר הוצאות; חיוביים - רווח אבוד' },
      { id: 'b', text: 'אין הבדל' },
      { id: 'c', text: 'תלוי בסוג החוזה' },
      { id: 'd', text: 'תלוי בשלב המו"מ' }
    ],
    correctAnswer: 'a',
    explanation: 'פיצויי הסתמכות מכסים הוצאות שנגרמו כתוצאה מההסתמכות על המו"מ. פיצויים חיוביים כוללים את הרווח שהיה מתקבל אילו החוזה היה נחתם - ניתנים רק במו"מ מתקדם.',
    lawReference: 'חוק החוזים - סעדים בהפרת תום לב'
  },

  // שאלות מעשיות נוספות
  {
    id: 19,
    type: 'case-study',
    difficulty: 'קשה מאוד',
    icon: '🏠',
    category: 'מקרה מעשי',
    question: 'אישה מבוגרת מכרה דירה במחיר נמוך בעת מחלה קשה. החוזה כולל סעיף פטור מאחריות. איזו עילה החזקה ביותר?',
    options: [
      { id: 'a', text: 'עושק - בגלל המצב הבריאותי' },
      { id: 'b', text: 'חוזה פסול - בגלל סעיף הפטור' },
      { id: 'c', text: 'טעות - לגבי השווי' },
      { id: 'd', text: 'שילוב של עושק וחוזה פסול' }
    ],
    correctAnswer: 'd',
    explanation: 'במקרה זה יש שילוב של מספר עילות: עושק (מצב של חולשה גופנית ושכלית, תנאים גרועים), וחוזה פסול (סעיף פטור קיצוני). השילוב מחזק את התביעה.',
    lawReference: 'חוק החוזים, סעיפים 16, 30'
  },
  {
    id: 20,
    type: 'case-study',
    difficulty: 'קשה מאוד',
    icon: '📄',
    category: 'מקרה מעשי',
    question: 'חוזה שכירות דירה נחתם בתנאי שהשכיר יקבל אישור עירייה. האישור לא התקבל. מה מעמד החוזה?',
    options: [
      { id: 'a', text: 'בטל - תנאי מתלה לא התקיים' },
      { id: 'b', text: 'תקף - התנאי לא חיצוני' },
      { id: 'c', text: 'תלוי מי אחראי לקבל את האישור' },
      { id: 'd', text: 'הופך למוחלט אחרי זמן סביר' }
    ],
    correctAnswer: 'a',
    explanation: 'זהו תנאי מתלה תקף (אי ודאות, חיצוניות, השפעה על תוקף). כאשר התנאי לא מתקיים בזמן סביר, החוזה מתבטל לפי סעיפים 27-29.',
    lawReference: 'חוק החוזים, סעיפים 27-29'
  }
];

const ContractDefectsExam: React.FC = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [showResult, setShowResult] = useState(false);
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
  const [showFinalResults, setShowFinalResults] = useState(false);
  const [examStarted, setExamStarted] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(80 * 60); // 80 minutes

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
            <Warning sx={{ fontSize: 60, color: '#ff9800', mb: 2 }} />
            <Typography variant="h3" component="h1" gutterBottom color="primary" fontWeight="bold">
              ⚠️ מבחן פגמים בכריתת חוזה
            </Typography>
            <Typography variant="h6" color="text.secondary" mb={3}>
              מבחן מקיף על עושק, חוזה למראית עין, חוזה על תנאי, חוזה פסול ותום לב
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
                <ListItemText primary="נושאים: עושק, מראית עין, חוזה על תנאי, חוזה פסול, תום לב" />
              </ListItem>
              <ListItem>
                <ListItemIcon><Security color="primary" /></ListItemIcon>
                <ListItemText primary="זמן: 80 דקות" />
              </ListItem>
              <ListItem>
                <ListItemIcon><CheckCircle color="primary" /></ListItemIcon>
                <ListItemText primary="הסברים מפורטים עם פסיקה ומקורות חוק" />
              </ListItem>
            </List>
          </Box>

          <Alert severity="warning" sx={{ mb: 3 }}>
            <Typography variant="body1">
              <strong>💡 טיפ ללמידה:</strong> המבחן כולל פסקי דין מרכזיים כמו סאסי קיקאון, חיים כהן ושות', סולל צוקרמן וצים מזיאר.
              שימו לב לשילובים מורכבים של מספר עילות במקרה אחד.
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
                background: 'linear-gradient(45deg, #ff9800 30%, #ffb74d 90%)'
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
            {results.percentage >= 90 && '🏆 מעולה! שליטה מושלמת בפגמים בכריתת חוזה'}
            {results.percentage >= 80 && results.percentage < 90 && '⭐ טוב מאוד! ידע חזק בנושא'}
            {results.percentage >= 70 && results.percentage < 80 && '👍 טוב! עדיין יש מקום לשיפור'}
            {results.percentage < 70 && '📚 מומלץ לחזור על החומר ולתרגל נוסף'}
          </Alert>

          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" gutterBottom color="primary">
              📊 פירוט תוצאות לפי קטגוריות:
            </Typography>
            {[
              'עושק',
              'חוזה למראית עין',
              'חוזה על תנאי',
              'חוזה פסול',
              'תום לב',
              'ניתוח משולב',
              'מקרה מעשי'
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
              <ListItemIcon><Warning color="primary" /></ListItemIcon>
              <ListItemText 
                primary="עושק" 
                secondary="מצוקה, חולשה, ניצול - פס&quot;ד סאסי קיקאון, חיים כהן ושות'" 
              />
            </ListItem>
            <ListItem>
              <ListItemIcon><Article color="primary" /></ListItemIcon>
              <ListItemText 
                primary="חוזה למראית עין" 
                secondary="מוחלט/יחסי, חוזה מלאכותי - פס&quot;ד סולל צוקרמן" 
              />
            </ListItem>
            <ListItem>
              <ListItemIcon><Assignment color="primary" /></ListItemIcon>
              <ListItemText 
                primary="חוזה על תנאי ופסול" 
                secondary="תנאי מתלה/מפסיק, הגבלת חופש עיסוק - פס&quot;ד צים מזיאר" 
              />
            </ListItem>
            <ListItem>
              <ListItemIcon><Balance color="primary" /></ListItemIcon>
              <ListItemText 
                primary="תום לב" 
                secondary="חובות בשלב המו&quot;מ ובקיום החוזה, פיצויי הסתמכות" 
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

export default ContractDefectsExam;

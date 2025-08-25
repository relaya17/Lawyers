import React, { useState, useEffect } from 'react';
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
  Divider,
  Alert,
  LinearProgress,
  Grid,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  TextField,
  Checkbox,
  FormGroup,
  List,
  ListItem,
  ListItemText,
  Avatar,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  ExpandMore,
  CheckCircle,
  Cancel,
  Lightbulb,
  School,
  Quiz,
  Assessment,
  Timer,
  TrendingUp,
  BookmarkBorder,
  Bookmark
} from '@mui/icons-material';

interface Question {
  id: string;
  type: 'multiple-choice' | 'true-false' | 'short-answer' | 'essay';
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  question: string;
  options?: string[];
  correctAnswer: string | string[];
  explanation: string;
  example?: string;
  emphasis?: string;
  references?: string[];
}

interface ExamResults {
  score: number;
  totalQuestions: number;
  answeredQuestions: number;
  correctAnswers: number;
  timeSpent: number;
  categoryBreakdown: { [key: string]: { correct: number; total: number } };
}

const legalExamQuestions: Question[] = [
  // חלק א' - רב־ברירה
  {
    id: 'mc1',
    type: 'multiple-choice',
    category: 'מקורות המשפט הראשיים',
    difficulty: 'easy',
    question: 'מהו המקור הראשון והעיקרי במערכת המשפט הישראלית?',
    options: ['א. חקיקה', 'ב. פסיקה', 'ג. נוהג', 'ד. משפט השוואתי'],
    correctAnswer: 'א. חקיקה',
    explanation: 'חקיקת הכנסת היא המקור הראשון והעיקרי במערכת המשפט הישראלית. היא קובעת נורמות כלליות וברורות שמחייבות את הרשויות והציבור.',
    example: 'חוק החוזים, חוק העונשין.',
    emphasis: 'פסיקה ונוהג משלימים ומפרשים את החוק, אך אינם מחליפים אותו.'
  },
  {
    id: 'mc2',
    type: 'multiple-choice',
    category: 'תקדימים ופסיקה',
    difficulty: 'medium',
    question: 'לפי עקרון התקדים המחייב (stare decisis):',
    options: [
      'א. כל פסיקה מחייבת את כל בתי המשפט',
      'ב. פסיקה של בית המשפט העליון מחייבת את הערכאות הנמוכות',
      'ג. פסיקה של בית משפט מחוזי מחייבת את כל בתי המשפט',
      'ד. אין תקדים מחייב בישראל'
    ],
    correctAnswer: 'ב. פסיקה של בית המשפט העליון מחייבת את הערכאות הנמוכות',
    explanation: 'זהו עיקרון תקדים מחייב (stare decisis), שמבטיח אחידות ויציבות משפטית.',
    example: 'בית משפט שלום חייב לפסוק לפי פסיקת העליון, גם אם הוא חושב אחרת.'
  },
  {
    id: 'mc3',
    type: 'multiple-choice',
    category: 'מקורות עזר',
    difficulty: 'hard',
    question: 'לפי חוק יסודות המשפט, השופט יפנה למורשת ישראל כאשר:',
    options: [
      'א. בכל מקרה',
      'ב. עקרונות הצדק, היושר והשלום של מורשת ישראל',
      'ג. כאשר המקרה נוגע לדת',
      'ד. כאשר הצדדים יהודים'
    ],
    correctAnswer: 'ב. עקרונות הצדק, היושר והשלום של מורשת ישראל',
    explanation: 'במקרה שאין תשובה מפורשת בחוק או בפסיקה, השופט רשאי לפנות לעקרונות אלה בדרך של היקש (השופט משלים את החסר).',
    example: 'שאלה אזרחית חדשה ללא הסדרה חוקית או פסיקתית.'
  },
  {
    id: 'mc4',
    type: 'multiple-choice',
    category: 'חקיקה',
    difficulty: 'easy',
    question: 'מי רשאי לחוקק חקיקה ראשית בישראל?',
    options: ['א. הממשלה', 'ב. הכנסת', 'ג. בית המשפט העליון', 'ד. הנשיא'],
    correctAnswer: 'ב. הכנסת',
    explanation: 'הכנסת היא הרשות המחוקקת העיקרית, וסמכות החקיקה הראשית נתונה לה מכוח עקרון הפרדת הרשויות.'
  },
  {
    id: 'mc5',
    type: 'multiple-choice',
    category: 'נוהג',
    difficulty: 'medium',
    question: 'נוהג מהווה מקור משפטי מחייב:',
    options: [
      'א. בכל מקרה',
      'ב. רק במשפט מסחרי',
      'ג. כאשר הדין שותק ואין מקור אחר',
      'ד. רק בהסכמת הצדדים'
    ],
    correctAnswer: 'ג. כאשר הדין שותק ואין מקור אחר',
    explanation: 'נוהג מהווה מקור מפרש או משלים בהיעדר חקיקה או הלכה מחייבת. עליו להיות כללי, קבוע ונתפס כחובה.',
    example: 'נוהג מסחרי בענף מסוים לגבי מועדי תשלום.'
  },
  {
    id: 'mc6',
    type: 'multiple-choice',
    category: 'תקדימים ופסיקה',
    difficulty: 'medium',
    question: 'תקדים של בית המשפט העליון מחייב:',
    options: [
      'א. רק את בית המשפט העליון עצמו',
      'ב. את כל הערכאות הנמוכות',
      'ג. רק בתי משפט במחוז הרלוונטי',
      'ד. אינו מחייב אף אחד'
    ],
    correctAnswer: 'ב. את כל הערכאות הנמוכות',
    explanation: 'תקדים עליון מחייב את בתי משפט השלום והמחוזי.'
  },
  {
    id: 'mc7',
    type: 'multiple-choice',
    category: 'חוקי יסוד',
    difficulty: 'hard',
    question: 'מעמדם החוקתי של חוקי היסוד בישראל:',
    options: [
      'א. זהה לחוקים רגילים',
      'ב. חוקי היסוד קיבלו מעמד נורמטיבי־על־חוקי בפסיקה',
      'ג. עליונים רק בתחום זכויות האדם',
      'ד. אינם מחייבים את הרשות המבצעת'
    ],
    correctAnswer: 'ב. חוקי היסוד קיבלו מעמד נורמטיבי־על־חוקי בפסיקה',
    explanation: 'חוקי היסוד יוצרים מסגרת חוקתית וזכו למעמד על־חוקי המאפשר ביקורת שיפוטית על חוקים שפוגעים בזכויות חוקתיות.',
    example: 'ביקורת שיפוטית על חוקים שפוגעים בזכויות חוקתיות, כמו בפסק דין בנק מזרחי.'
  },
  {
    id: 'mc8',
    type: 'multiple-choice',
    category: 'משפט השוואתי',
    difficulty: 'medium',
    question: 'משפט השוואתי הוא:',
    options: [
      'א. שימוש בפסיקה של בתי משפט במדינות אחרות',
      'ב. השוואה בין חוקים שונים',
      'ג. משפט בינלאומי',
      'ד. רק למקרי חירום'
    ],
    correctAnswer: 'א. שימוש בפסיקה של בתי משפט במדינות אחרות',
    explanation: 'משפט משווה הוא מקור מנחה בלבד, לשם השראה ושכנוע, ולא מחייב.',
    example: 'הסתמכות על פסיקה קנדית בנושא זכויות אדם.'
  },
  {
    id: 'mc9',
    type: 'multiple-choice',
    category: 'תקדימים ופסיקה',
    difficulty: 'hard',
    question: 'לגבי כוח המחייב של תקדים:',
    options: [
      'א. תקדים מחייב את כל בתי המשפט באופן מוחלט',
      'ב. תקדים מחייב את הערכאות הנמוכות אך לא את עצמו',
      'ג. תקדים אינו מחייב כלל',
      'ד. תקדים מחייב רק בהסכמת הצדדים'
    ],
    correctAnswer: 'ב. תקדים מחייב את הערכאות הנמוכות אך לא את עצמו',
    explanation: 'העיקרון מבטיח יציבות לצד גמישות שיפוטית. בית המשפט העליון יכול לסטות מתקדים קודם שלו בנימוק כבד.',
    example: 'פסקי דין של מחוזי לרוב מנחים עבור מחוזות אחרים.'
  },
  {
    id: 'mc10',
    type: 'multiple-choice',
    category: 'פרשנות',
    difficulty: 'hard',
    question: 'פרשנות תכליתית מתבססת על:',
    options: [
      'א. המילים בלבד',
      'ב. אומדן דעת המחוקק ותכלית החוק',
      'ג. רק על התוצאה הרצויה',
      'ד. רק על פסיקה קודמת'
    ],
    correctAnswer: 'ב. אומדן דעת המחוקק ותכלית החוק',
    explanation: 'פרשנות תכליתית משלבת בין התכלית הסובייקטיבית (כוונת המחוקק) והתכלית האובייקטיבית (הערכים של השיטה).',
    references: ['אהרן ברק, פרשנות במשפט.']
  }
];

// חלק ב' - שאלות קצרות
const shortAnswerQuestions: Question[] = [
  {
    id: 'sa1',
    type: 'short-answer',
    category: 'חוק יסודות המשפט',
    difficulty: 'medium',
    question: 'מה החשיבות של חוק יסודות המשפט במערכת המשפט הישראלית?',
    correctAnswer: 'משמש כ"גשר" נורמטיבי להשלמת חסר: במקרה של היעדר חוק/פסיקה/היקש, מפנה לעקרונות מורשת ישראל.',
    explanation: 'שומר על רצף משפטי ללא צורך לייבא דין זר או להותיר חלל משפטי.'
  },
  {
    id: 'sa2',
    type: 'short-answer',
    category: 'נוהג',
    difficulty: 'medium',
    question: 'מהם התנאים לכך שנוהג יהיה מחייב?',
    correctAnswer: '(1) כלליות והיקף (2) עקביות ורציפות (3) הכרה נורמטיבית כ"דעת חובה" (4) הוכחה עובדתית.',
    explanation: 'כל התנאים חייבים להתקיים כדי שנוהג יוכר כמחייב.'
  },
  {
    id: 'sa3',
    type: 'short-answer',
    category: 'חקיקה',
    difficulty: 'easy',
    question: 'הסבר את ההבדל בין חקיקה ראשית לחקיקת משנה.',
    correctAnswer: 'חקיקה ראשית – חוקי הכנסת; נורמה עליונה. חקיקת משנה – תקנות/צווים/כללים שהותקנו מכוח חוק; כפופה לחוק.',
    explanation: 'עקרון חוקיות המינהל.'
  },
  {
    id: 'sa4',
    type: 'short-answer',
    category: 'פסיקה',
    difficulty: 'medium',
    question: 'מהם היתרונות והחסרונות של הפסיקה כיוצרת משפט?',
    correctAnswer: 'יתרונות: (1) התאמה למציאות משתנה (2) פרשנות ממוקדת לנסיבות. חסרונות: (1) חוסר ודאות (2) תלות בהרכב.',
    explanation: 'הפסיקה מאפשרת גמישות אך יוצרת אי-ודאות.'
  },
  {
    id: 'sa5',
    type: 'short-answer',
    category: 'חוקה',
    difficulty: 'hard',
    question: 'הסבר את ההבדל בין חוקה פורמלית לחוקה מהותית.',
    correctAnswer: 'פורמלית – מסמך כתוב עליון אחד. מהותית – נורמות בעלות מעמד חוקתי, גם ללא מסמך אחד (המצב בישראל).',
    explanation: 'ישראל אימצה מודל של חוקה מהותית באמצעות חוקי יסוד.'
  }
];

// חלק ג' - שאלות אמת/שקר
const trueFalseQuestions: Question[] = [
  {
    id: 'tf1',
    type: 'true-false',
    category: 'תקדימים',
    difficulty: 'medium',
    question: 'פסיקת בית משפט מחוזי מחייבת את בתי המשפט השלום.',
    correctAnswer: 'שקר',
    explanation: 'הכלל הוא הפוך: פסיקת מחוזי לא מחייבת שלום. רק פסיקת העליון מחייבת את הערכאות הנמוכות.'
  },
  {
    id: 'tf2',
    type: 'true-false',
    category: 'נוהג',
    difficulty: 'easy',
    question: 'נוהג הוא מקור משפטי ראשוני הגובר על חקיקה.',
    correctAnswer: 'שקר',
    explanation: 'נוהג הוא מקור משלים ולא "ראשוני" מול חקיקה. חקיקה גוברת על נוהג.'
  },
  {
    id: 'tf3',
    type: 'true-false',
    category: 'ספרות משפטית',
    difficulty: 'easy',
    question: 'ספרות משפטית מהווה מקור משפטי מחייב.',
    correctAnswer: 'שקר',
    explanation: 'ספרות משפטית היא מקור משכנע ולא מחייב.'
  },
  {
    id: 'tf4',
    type: 'true-false',
    category: 'ביקורת שיפוטית',
    difficulty: 'hard',
    question: 'בישראל אין ביקורת שיפוטית על חקיקה.',
    correctAnswer: 'שקר',
    explanation: 'ביקורת שיפוטית על חקיקה רגילה קיימת מול חוקי היסוד (מאז הלכת בנק מזרחי).'
  },
  {
    id: 'tf5',
    type: 'true-false',
    category: 'בג"ץ',
    difficulty: 'easy',
    question: 'פסיקת בג"ץ מחייבת את כל הערכאות.',
    correctAnswer: 'אמת',
    explanation: 'פסיקת בג"ץ (כשהוא יושב כבית המשפט העליון) מחייבת את כל הערכאות.'
  }
];

export const DetailedLegalExamWithAnswers: React.FC = () => {
  const [currentSection, setCurrentSection] = useState<'intro' | 'multiple-choice' | 'short-answer' | 'true-false' | 'results'>('intro');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<{ [key: string]: string }>({});
  const [showAnswers, setShowAnswers] = useState(false);
  const [examStartTime, setExamStartTime] = useState<Date | null>(null);
  const [examEndTime, setExamEndTime] = useState<Date | null>(null);
  const [bookmarkedQuestions, setBookmarkedQuestions] = useState<Set<string>>(new Set());
  const [selectedQuestions, setSelectedQuestions] = useState<Question[]>([]);

  const allQuestions = [...legalExamQuestions, ...shortAnswerQuestions, ...trueFalseQuestions];

  useEffect(() => {
    if (currentSection === 'multiple-choice') {
      setSelectedQuestions(legalExamQuestions);
    } else if (currentSection === 'short-answer') {
      setSelectedQuestions(shortAnswerQuestions);
    } else if (currentSection === 'true-false') {
      setSelectedQuestions(trueFalseQuestions);
    }
  }, [currentSection]);

  const startExam = () => {
    setExamStartTime(new Date());
    setCurrentSection('multiple-choice');
    setCurrentQuestionIndex(0);
  };

  const handleAnswer = (questionId: string, answer: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
  };

  const toggleBookmark = (questionId: string) => {
    setBookmarkedQuestions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(questionId)) {
        newSet.delete(questionId);
      } else {
        newSet.add(questionId);
      }
      return newSet;
    });
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < selectedQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      // Move to next section
      if (currentSection === 'multiple-choice') {
        setCurrentSection('short-answer');
        setCurrentQuestionIndex(0);
      } else if (currentSection === 'short-answer') {
        setCurrentSection('true-false');
        setCurrentQuestionIndex(0);
      } else if (currentSection === 'true-false') {
        finishExam();
      }
    }
  };

  const prevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    } else {
      // Move to previous section
      if (currentSection === 'true-false') {
        setCurrentSection('short-answer');
        setCurrentQuestionIndex(shortAnswerQuestions.length - 1);
      } else if (currentSection === 'short-answer') {
        setCurrentSection('multiple-choice');
        setCurrentQuestionIndex(legalExamQuestions.length - 1);
      }
    }
  };

  const finishExam = () => {
    setExamEndTime(new Date());
    setCurrentSection('results');
  };

  const calculateResults = (): ExamResults => {
    let correctAnswers = 0;
    let totalQuestions = allQuestions.length;
    let answeredQuestions = Object.keys(answers).length;
    
    const categoryBreakdown: { [key: string]: { correct: number; total: number } } = {};

    allQuestions.forEach(question => {
      const userAnswer = answers[question.id];
      const isCorrect = userAnswer === question.correctAnswer;
      
      if (isCorrect) correctAnswers++;
      
      if (!categoryBreakdown[question.category]) {
        categoryBreakdown[question.category] = { correct: 0, total: 0 };
      }
      categoryBreakdown[question.category].total++;
      if (isCorrect) categoryBreakdown[question.category].correct++;
    });

    const timeSpent = examStartTime && examEndTime 
      ? Math.round((examEndTime.getTime() - examStartTime.getTime()) / (1000 * 60))
      : 0;

    return {
      score: Math.round((correctAnswers / totalQuestions) * 100),
      totalQuestions,
      answeredQuestions,
      correctAnswers,
      timeSpent,
      categoryBreakdown
    };
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return '#4caf50';
      case 'medium': return '#ff9800';
      case 'hard': return '#f44336';
      default: return '#9e9e9e';
    }
  };

  const getDifficultyLabel = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'קל';
      case 'medium': return 'בינוני';
      case 'hard': return 'קשה';
      default: return 'לא ידוע';
    }
  };

  if (currentSection === 'intro') {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Card elevation={4}>
          <CardContent sx={{ p: 4 }}>
            <Box textAlign="center" mb={4}>
              <Avatar sx={{ bgcolor: '#1976d2', width: 80, height: 80, margin: 'auto', mb: 2 }}>
                <Assessment sx={{ fontSize: 40 }} />
              </Avatar>
              <Typography variant="h3" gutterBottom color="primary">
                🏛️ מבחן מקורות המשפט המפורט
              </Typography>
              <Typography variant="h6" color="text.secondary">
                מבחן מקיף עם תשובות והסברים מפורטים
              </Typography>
            </Box>

            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item xs={12} md={4}>
                <Paper elevation={2} sx={{ p: 3, textAlign: 'center' }}>
                  <Quiz sx={{ fontSize: 40, color: '#4caf50', mb: 1 }} />
                  <Typography variant="h5">{legalExamQuestions.length}</Typography>
                  <Typography variant="body2">שאלות רב-ברירה</Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} md={4}>
                <Paper elevation={2} sx={{ p: 3, textAlign: 'center' }}>
                  <School sx={{ fontSize: 40, color: '#ff9800', mb: 1 }} />
                  <Typography variant="h5">{shortAnswerQuestions.length}</Typography>
                  <Typography variant="body2">שאלות קצרות</Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} md={4}>
                <Paper elevation={2} sx={{ p: 3, textAlign: 'center' }}>
                  <CheckCircle sx={{ fontSize: 40, color: '#f44336', mb: 1 }} />
                  <Typography variant="h5">{trueFalseQuestions.length}</Typography>
                  <Typography variant="body2">אמת/שקר</Typography>
                </Paper>
              </Grid>
            </Grid>

            <Alert severity="info" sx={{ mb: 3 }}>
              <Typography variant="body1">
                <strong>מה יכלול המבחן:</strong>
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemText primary="✅ תשובות נכונות מפורטות" />
                </ListItem>
                <ListItem>
                  <ListItemText primary="📚 הסברים עמוקים לכל תשובה" />
                </ListItem>
                <ListItem>
                  <ListItemText primary="💡 דוגמאות מהפרקטיקה" />
                </ListItem>
                <ListItem>
                  <ListItemText primary="⭐ נקודות דגש חשובות" />
                </ListItem>
                <ListItem>
                  <ListItemText primary="📖 הפניות לפסיקה ולספרות" />
                </ListItem>
              </List>
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
                🎉 תוצאות המבחן
              </Typography>
              <Typography variant="h4" color="success.main">
                {results.score}%
              </Typography>
              <Typography variant="h6" color="text.secondary">
                {results.correctAnswers} מתוך {results.totalQuestions} נכונות
              </Typography>
            </Box>

            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item xs={12} sm={6} md={3}>
                <Paper elevation={2} sx={{ p: 2, textAlign: 'center' }}>
                  <Typography variant="h6">{results.score}%</Typography>
                  <Typography variant="body2">ציון כללי</Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Paper elevation={2} sx={{ p: 2, textAlign: 'center' }}>
                  <Typography variant="h6">{results.timeSpent}</Typography>
                  <Typography variant="body2">דקות</Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Paper elevation={2} sx={{ p: 2, textAlign: 'center' }}>
                  <Typography variant="h6">{results.answeredQuestions}</Typography>
                  <Typography variant="body2">שאלות נענו</Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Paper elevation={2} sx={{ p: 2, textAlign: 'center' }}>
                  <Typography variant="h6">{bookmarkedQuestions.size}</Typography>
                  <Typography variant="body2">שאלות מועדפות</Typography>
                </Paper>
              </Grid>
            </Grid>

            <Typography variant="h5" gutterBottom>
              פירוט לפי נושאים:
            </Typography>
            <Grid container spacing={2} sx={{ mb: 4 }}>
              {Object.entries(results.categoryBreakdown).map(([category, stats]) => (
                <Grid item xs={12} sm={6} md={4} key={category}>
                  <Paper elevation={1} sx={{ p: 2 }}>
                    <Typography variant="subtitle1" fontWeight="bold">
                      {category}
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
                            label={getDifficultyLabel(question.difficulty)}
                            size="small"
                            sx={{ backgroundColor: getDifficultyColor(question.difficulty), color: 'white' }}
                          />
                          {bookmarkedQuestions.has(question.id) && (
                            <Bookmark color="primary" />
                          )}
                        </Box>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Box>
                          <Typography variant="body2" color="text.secondary" gutterBottom>
                            נושא: {question.category}
                          </Typography>
                          
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
                                    fontWeight: option === question.correctAnswer ? 'bold' : 'normal'
                                  }}
                                >
                                  {option}
                                </Typography>
                              ))}
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

                          {question.example && (
                            <Box mb={2}>
                              <Typography variant="subtitle2" gutterBottom color="warning.main">
                                📝 דוגמה:
                              </Typography>
                              <Typography variant="body2" paragraph>
                                {question.example}
                              </Typography>
                            </Box>
                          )}

                          {question.emphasis && (
                            <Box mb={2}>
                              <Typography variant="subtitle2" gutterBottom color="error.main">
                                ⭐ נקודת דגש חשובה:
                              </Typography>
                              <Typography variant="body2" paragraph>
                                {question.emphasis}
                              </Typography>
                            </Box>
                          )}

                          {question.references && question.references.length > 0 && (
                            <Box>
                              <Typography variant="subtitle2" gutterBottom color="info.main">
                                📚 מקורות והפניות:
                              </Typography>
                              {question.references.map((ref, i) => (
                                <Typography key={i} variant="body2" sx={{ fontStyle: 'italic' }}>
                                  • {ref}
                                </Typography>
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
                  setExamStartTime(null);
                  setExamEndTime(null);
                  setBookmarkedQuestions(new Set());
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
  const currentQuestion = selectedQuestions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / selectedQuestions.length) * 100;

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Card elevation={4}>
        <CardContent sx={{ p: 4 }}>
          {/* Progress and navigation */}
          <Box display="flex" justifyContent="between" alignItems="center" mb={3}>
            <Typography variant="h6" color="primary">
              {currentSection === 'multiple-choice' ? 'רב-ברירה' :
               currentSection === 'short-answer' ? 'שאלות קצרות' : 'אמת/שקר'}
            </Typography>
            <Box display="flex" alignItems="center" gap={2}>
              <Chip 
                label={getDifficultyLabel(currentQuestion.difficulty)}
                size="small"
                sx={{ backgroundColor: getDifficultyColor(currentQuestion.difficulty), color: 'white' }}
              />
              <Tooltip title={bookmarkedQuestions.has(currentQuestion.id) ? 'הסר מסימניות' : 'הוסף לסימניות'}>
                <IconButton
                  onClick={() => toggleBookmark(currentQuestion.id)}
                  color={bookmarkedQuestions.has(currentQuestion.id) ? 'primary' : 'default'}
                >
                  {bookmarkedQuestions.has(currentQuestion.id) ? <Bookmark /> : <BookmarkBorder />}
                </IconButton>
              </Tooltip>
            </Box>
          </Box>

          <LinearProgress variant="determinate" value={progress} sx={{ mb: 3 }} />
          
          <Typography variant="body2" color="text.secondary" gutterBottom>
            שאלה {currentQuestionIndex + 1} מתוך {selectedQuestions.length} • {currentQuestion.category}
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
              <FormControlLabel value="אמת" control={<Radio />} label="אמת ✅" />
              <FormControlLabel value="שקר" control={<Radio />} label="שקר ❌" />
            </RadioGroup>
          )}

          {currentQuestion.type === 'short-answer' && (
            <TextField
              fullWidth
              multiline
              rows={4}
              value={answers[currentQuestion.id] || ''}
              onChange={(e) => handleAnswer(currentQuestion.id, e.target.value)}
              placeholder="כתוב כאן את התשובה..."
              variant="outlined"
            />
          )}

          {/* Navigation buttons */}
          <Box display="flex" justifyContent="space-between" mt={4}>
            <Button
              variant="outlined"
              onClick={prevQuestion}
              disabled={currentSection === 'multiple-choice' && currentQuestionIndex === 0}
            >
              שאלה קודמת
            </Button>

            <Button
              variant="contained"
              onClick={nextQuestion}
              disabled={!answers[currentQuestion.id]}
            >
              {(currentSection === 'true-false' && currentQuestionIndex === selectedQuestions.length - 1) 
                ? 'סיים מבחן' : 'שאלה הבאה'}
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

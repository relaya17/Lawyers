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
  Avatar,
  Divider
} from '@mui/material';
import {
  ExpandMore,
  CheckCircle,
  Cancel,
  Lightbulb,
  Gavel,
  Quiz,
  Assessment,
  Balance,
  Business,
  Psychology
} from '@mui/icons-material';

interface Question {
  id: string;
  type: 'case-analysis' | 'true-false';
  section: string;
  difficulty: 'medium' | 'hard';
  question: string;
  correctAnswer: string;
  explanation: string;
  emphasis?: string;
  legalPrinciples?: string[];
  emoji?: string;
}

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
  },
  {
    id: 'case2',
    type: 'case-analysis',
    section: 'ניתוח מקרים',
    difficulty: 'medium',
    question: 'בית משפט שלום נתקל בפסיקה סותרת של שני בתי משפט מחוזיים. כיצד עליו לנהוג? ⚖️',
    correctAnswer: 'השופט צריך לבחור באחת הפסיקות או לפנות לערכאה גבוהה יותר (מחוזי/עליון).',
    explanation: 'השופט צריך לבחור באחת הפסיקות או לפנות לערכאה גבוהה יותר (מחוזי/עליון).',
    emphasis: 'קיים עקרון ההיררכיה - פסיקות הערכאות הגבוהות מחייבות את הנמוכות יותר.',
    legalPrinciples: ['היררכיה שיפוטית', 'תקדים מחייב', 'אחידות הפסיקה'],
    emoji: '⚖️'
  },
  {
    id: 'case3',
    type: 'case-analysis',
    section: 'ניתוח מקרים',
    difficulty: 'hard',
    question: 'חוק ישן מימי המנדט עומד בניגוד לעקרונות יסוד של שוויון. מה יעשה בג"ץ? ⚖️',
    correctAnswer: 'בג"ץ יכול לפסול את החוק או חלק ממנו אם הוא סותר זכויות יסוד.',
    explanation: 'בג"ץ יכול לפסול את החוק או חלק ממנו אם הוא סותר זכויות יסוד.',
    emphasis: 'הנימוק - עקרונות היסוד נחשבים עליונים על חקיקה רגילה.',
    legalPrinciples: ['ביקורת שיפוטית', 'זכויות יסוד', 'עקרון השוויון'],
    emoji: '⚖️'
  },
  {
    id: 'case4',
    type: 'case-analysis',
    section: 'ניתוח מקרים',
    difficulty: 'medium',
    question: 'שופט מתלבט אם לפרש חוק על פי לשונו או על פי תכליתו. כיצד עליו לנהוג? ⚖️',
    correctAnswer: 'יש לשקול את לשון החוק וגם את כוונת המחוקק ומטרת החוק.',
    explanation: 'יש לשקול את לשון החוק וגם את כוונת המחוקק ומטרת החוק.',
    emphasis: 'פרשנות תכליתית משמשת ככלי איזון בין החוק לבין עקרונות הצדק.',
    legalPrinciples: ['פרשנות תכליתית', 'פרשנות לשונית', 'כוונת המחוקק'],
    emoji: '⚖️'
  },
  {
    id: 'case5',
    type: 'case-analysis',
    section: 'ניתוח מקרים',
    difficulty: 'hard',
    question: 'הכנסת מחוקקת חוק הפוגע בחופש הביטוי. באילו נסיבות ניתן לפסול אותו? ⚖️',
    correctAnswer: 'בג"ץ מוסמך לפסול את החוק אם הוא סותר את "חוק יסוד: כבוד האדם וחירותו".',
    explanation: 'בג"ץ מוסמך לפסול את החוק אם הוא סותר את "חוק יסוד: כבוד האדם וחירותו".',
    emphasis: 'השיקולים - איזון בין חירות הפרט לבין האינטרס הציבורי.',
    legalPrinciples: ['חופש ביטוי', 'איזון זכויות', 'ביקורת חוקתית'],
    emoji: '⚖️'
  },
  {
    id: 'case6',
    type: 'case-analysis',
    section: 'ניתוח מקרים',
    difficulty: 'medium',
    question: 'חברה טוענת לנוהג עסקי מחייב. מה עליה להוכיח בבית המשפט? ⚖️',
    correctAnswer: 'עליה להוכיח שהנוהג נפוץ, קבוע ומקובל בתחום הרלוונטי.',
    explanation: 'עליה להוכיח שהנוהג נפוץ, קבוע ומקובל בתחום הרלוונטי.',
    emphasis: 'שהנוהג אינו סותר חקיקה כתובה.',
    legalPrinciples: ['נוהג מחייב', 'עקביות הנוהג', 'הוכחת נוהג'],
    emoji: '⚖️'
  },
  {
    id: 'case7',
    type: 'case-analysis',
    section: 'ניתוח מקרים',
    difficulty: 'hard',
    question: 'בג"ץ נדרש לעניין שאין בו חקיקה מפורשת. על פי איזה חוק יכריע? ⚖️',
    correctAnswer: 'בג"ץ יכול לפנות לעקרונות יסוד, משפט מנהגי, פסיקה קודמת או משפט השוואתי.',
    explanation: 'בג"ץ יכול לפנות לעקרונות יסוד, משפט מנהגי, פסיקה קודמת או משפט השוואתי.',
    emphasis: 'השימוש במקורות אלה הוא מוצא לאין חקיקה מפורשת.',
    legalPrinciples: ['מקורות המשפט', 'חוק יסודות המשפט', 'משפט השוואתי'],
    emoji: '⚖️'
  },
  {
    id: 'case8',
    type: 'case-analysis',
    section: 'ניתוח מקרים',
    difficulty: 'hard',
    question: 'האם הדבר אפשרי? נשיא המדינה נותן חנינה הסותרת פסיקה. ⚖️',
    correctAnswer: 'על פי חוק יסוד: נשיא המדינה, החנינה היא חוקית גם אם היא סותרת פסיקה, אך היא עלולה להיתקל בביקורת ציבורית ומשפטית.',
    explanation: 'על פי חוק יסוד: נשיא המדינה, החנינה היא חוקית גם אם היא סותרת פסיקה, אך היא עלולה להיתקל בביקורת ציבורית ומשפטית.',
    emphasis: 'החנינה היא סמכות יוצאת דופן בלבד.',
    legalPrinciples: ['חנינה נשיאותית', 'פרדת רשויות', 'סמכויות חוקתיות'],
    emoji: '⚖️'
  },
  {
    id: 'case9',
    type: 'case-analysis',
    section: 'ניתוח מקרים',
    difficulty: 'medium',
    question: 'האם ניתן לאכוף חובות אזרחיות על בסיס נוהג בלבד? ⚖️',
    correctAnswer: 'ניתן, אך רק אם הנוהג ברור ומקובל ואין חקיקה סותרת.',
    explanation: 'ניתן, אך רק אם הנוהג ברור ומקובל ואין חקיקה סותרת.',
    emphasis: 'החובה על הוכחת הנוהג ואכיפתו.',
    legalPrinciples: ['נוהג כמקור משפט', 'אכיפת חובות', 'עדיפות החקיקה'],
    emoji: '⚖️'
  },
  {
    id: 'case10',
    type: 'case-analysis',
    section: 'ניתוח מקרים',
    difficulty: 'hard',
    question: 'כיצד ניתן לסטות מתקדים מחייב? ⚖️',
    correctAnswer: 'ניתן לסטות רק במקרים חריגים, כגון שינוי מציאותי או שיקול צדק מחייב.',
    explanation: 'ניתן לסטות רק במקרים חריגים, כגון שינוי מציאותי או שיקול צדק מחייב.',
    emphasis: 'הסטייה אינה נורמה אלא אמצעי מוגבל בלבד.',
    legalPrinciples: ['תקדים מחייב', 'סטייה מתקדים', 'גמישות שיפוטית'],
    emoji: '⚖️'
  }
];

const trueFalseQuestions: Question[] = [
  {
    id: 'tf1',
    type: 'true-false',
    section: 'אמת או שקר',
    difficulty: 'medium',
    question: 'כל התקנות שהממשלה מתקינה תקפות גם אם לא הוסמכו בחוק. 🔹',
    correctAnswer: 'שקר',
    explanation: 'תקנות חייבות להסתמך על סמכות בחוק, אחרת הן בטלות על פי עקרון חוקיות המנהל.',
    legalPrinciples: ['חוקיות המנהל', 'הסמכה לחקיקת משנה'],
    emoji: '🔹'
  },
  {
    id: 'tf2',
    type: 'true-false',
    section: 'אמת או שקר',
    difficulty: 'medium',
    question: 'פסיקה של בית משפט מחוזי מחייבת בית משפט שלום. 🔹',
    correctAnswer: 'נכון',
    explanation: 'בית משפט מחוזי הוא ערכאה גבוהה יותר ובית משפט שלום כפוף לפסיקותיו.',
    legalPrinciples: ['היררכיה שיפוטית', 'תקדים מחייב'],
    emoji: '🔹'
  },
  {
    id: 'tf3',
    type: 'true-false',
    section: 'אמת או שקר',
    difficulty: 'hard',
    question: 'פסק דין של בג"ץ יכול לשמש גם כתקדים במדינות אחרות. 🔹',
    correctAnswer: 'נכון',
    explanation: 'פסקי דין של בג"ץ, במיוחד בנושאי זכויות יסוד, נלמדים ולעיתים מנחים בתי משפט במדינות אחרות.',
    legalPrinciples: ['משפט השוואתי', 'השפעה בינלאומית', 'זכויות יסוד'],
    emoji: '🔹'
  },
  {
    id: 'tf4',
    type: 'true-false',
    section: 'אמת או שקר',
    difficulty: 'medium',
    question: 'חוק יסודות המשפט מחייב שופטים לפנות למשפט העברי בכל מקרה. 🔹',
    correctAnswer: 'שקר',
    explanation: 'המשפט העברי משמש בעיקר כמקור עזר כאשר אין חקיקה מפורשת, ולא כחובה תמידית.',
    legalPrinciples: ['חוק יסודות המשפט', 'מקורות עזר', 'משפט עברי'],
    emoji: '🔹'
  },
  {
    id: 'tf5',
    type: 'true-false',
    section: 'אמת או שקר',
    difficulty: 'hard',
    question: 'פרשנות תכליתית נועדה לגלות את אומד דעת המחוקק. 🔹',
    correctAnswer: 'נכון',
    explanation: 'היא מאפשרת לשופט לפרש את החוק על פי מטרתו או כוונת המחוקק, ולא רק על פי לשונו.',
    legalPrinciples: ['פרשנות תכליתית', 'כוונת המחוקק', 'מטרת החוק'],
    emoji: '🔹'
  },
  {
    id: 'tf6',
    type: 'true-false',
    section: 'אמת או שקר',
    difficulty: 'hard',
    question: 'פסק דין קול העם ביסס בישראל את חופש הביטוי כמקור על-חוקי. 🔹',
    correctAnswer: 'נכון',
    explanation: 'פסק הדין הכיר בחשיבות חופש הביטוי והעמיד אותו מעל חקיקה רגילה.',
    legalPrinciples: ['חופש ביטוי', 'פסיקה חוקתית', 'זכויות על-חוקיות'],
    emoji: '🔹'
  },
  {
    id: 'tf7',
    type: 'true-false',
    section: 'אמת או שקר',
    difficulty: 'medium',
    question: 'משפט בינלאומי אינו מחייב בישראל באופן כללי. 🔹',
    correctAnswer: 'שקר',
    explanation: 'המשפט הבינלאומי מחייב כאשר הוא אומץ כחוק פנימי על ידי הכנסת או קיבל תוקף משפטי אחר.',
    legalPrinciples: ['משפט בינלאומי', 'אימוץ פנימי', 'הכנסת'],
    emoji: '🔹'
  },
  {
    id: 'tf8',
    type: 'true-false',
    section: 'אמת או שקר',
    difficulty: 'easy',
    question: 'חקיקה ראשית עדיפה נורמטיבית על חקיקת משנה. 🔹',
    correctAnswer: 'נכון',
    explanation: 'חוקים ראשיים נחקקים על ידי הכנסת ומחזיקים בעליונות נורמטיבית מול תקנות וחוקי משנה.',
    legalPrinciples: ['היררכיה נורמטיבית', 'חקיקה ראשית', 'חקיקת משנה'],
    emoji: '🔹'
  },
  {
    id: 'tf9',
    type: 'true-false',
    section: 'אמת או שקר',
    difficulty: 'medium',
    question: 'המהפכה החוקתית בישראל התרחשה כתוצאה מחקיקת חוקה פורמלית. 🔹',
    correctAnswer: 'שקר',
    explanation: 'המהפכה החוקתית התרחשה עם חקיקת חוקי יסוד ולא חוקה פורמלית מלאה.',
    legalPrinciples: ['המהפכה החוקתית', 'חוקי יסוד', 'חוקה מהותית'],
    emoji: '🔹'
  },
  {
    id: 'tf10',
    type: 'true-false',
    section: 'אמת או שקר',
    difficulty: 'easy',
    question: 'המשפט בישראל מבוסס באופן מלא על המשפט הבריטי בלבד. 🔹',
    correctAnswer: 'שקר',
    explanation: 'המשפט בישראל הוא היברידי, ומשלב את המשפט הבריטי, המשפט הקונטיננטלי, המשפט העברי ונוהגים.',
    legalPrinciples: ['שיטה היברידית', 'מקורות מעורבים', 'משפט מעורב'],
    emoji: '🔹'
  }
];

const allQuestions = [...caseAnalysisQuestions, ...trueFalseQuestions];

interface ExamResults {
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  sectionBreakdown: { [key: string]: { correct: number; total: number } };
}

export const CaseAnalysisAndTrueFalseExam: React.FC = () => {
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

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'medium': return '#ff9800';
      case 'hard': return '#f44336';
      default: return '#9e9e9e';
    }
  };

  const getDifficultyLabel = (difficulty: string) => {
    switch (difficulty) {
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
                <Psychology sx={{ fontSize: 40 }} />
              </Avatar>
              <Typography variant="h3" gutterBottom color="primary">
                🧠 מבחן ניתוח מקרים ואמת/שקר
              </Typography>
              <Typography variant="h6" color="text.secondary">
                מבחן מתקדם לפיתוח חשיבה משפטית מעשית
              </Typography>
            </Box>

            <Alert severity="info" sx={{ mb: 3 }}>
              <Typography variant="body1" gutterBottom>
                <strong>המבחן כולל:</strong>
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemText primary="⚖️ ניתוח מקרים משפטיים מעשיים - 10 מקרים" />
                </ListItem>
                <ListItem>
                  <ListItemText primary="🔹 שאלות אמת/שקר עם נימוקים - 10 שאלות" />
                </ListItem>
                <ListItem>
                  <ListItemText primary="💡 הסברים מפורטים עם נקודות דגש" />
                </ListItem>
                <ListItem>
                  <ListItemText primary="🎯 עקרונות משפטיים מרכזיים" />
                </ListItem>
              </List>
            </Alert>

            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item xs={12} sm={6} md={3}>
                <Paper elevation={2} sx={{ p: 3, textAlign: 'center' }}>
                  <Gavel sx={{ fontSize: 40, color: '#4caf50', mb: 1 }} />
                  <Typography variant="h5">10</Typography>
                  <Typography variant="body2">ניתוח מקרים</Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Paper elevation={2} sx={{ p: 3, textAlign: 'center' }}>
                  <Quiz sx={{ fontSize: 40, color: '#ff9800', mb: 1 }} />
                  <Typography variant="h5">10</Typography>
                  <Typography variant="body2">אמת/שקר</Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Paper elevation={2} sx={{ p: 3, textAlign: 'center' }}>
                  <Business sx={{ fontSize: 40, color: '#f44336', mb: 1 }} />
                  <Typography variant="h5">מתקדם</Typography>
                  <Typography variant="body2">רמת קושי</Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Paper elevation={2} sx={{ p: 3, textAlign: 'center' }}>
                  <Assessment sx={{ fontSize: 40, color: '#9c27b0', mb: 1 }} />
                  <Typography variant="h5">{allQuestions.length}</Typography>
                  <Typography variant="body2">סה"כ שאלות</Typography>
                </Paper>
              </Grid>
            </Grid>

            <Alert severity="warning" sx={{ mb: 3 }}>
              <Typography variant="body1">
                <strong>שימו לב:</strong> מבחן זה מתמקד בחשיבה משפטית מעשית ודורש הבנה עמוקה של עקרונות המשפט הישראלי. כל מקרה דורש ניתוח מדוקדק והחלה של עקרונות משפטיים רלוונטיים.
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
                🎉 תוצאות מבחן ניתוח מקרים
              </Typography>
              <Typography variant="h4" color="success.main">
                {results.score}%
              </Typography>
              <Typography variant="h6" color="text.secondary">
                {results.correctAnswers} מתוך {results.totalQuestions} נכונות
              </Typography>
            </Box>

            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>פירוט לפי חלקים:</Typography>
                {Object.entries(results.sectionBreakdown).map(([section, stats]) => (
                  <Paper key={section} elevation={1} sx={{ p: 2, mb: 2 }}>
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
                ))}
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Paper elevation={2} sx={{ p: 3, textAlign: 'center' }}>
                  <Typography variant="h6" gutterBottom>הערכת ביצועים</Typography>
                  {results.score >= 90 && (
                    <Box>
                      <Typography variant="h4" color="success.main">מצוין! 🏆</Typography>
                      <Typography variant="body1">הבנה מעמיקה של עקרונות המשפט</Typography>
                    </Box>
                  )}
                  {results.score >= 75 && results.score < 90 && (
                    <Box>
                      <Typography variant="h4" color="primary">טוב מאוד! 🎯</Typography>
                      <Typography variant="body1">ידע טוב עם מקום לשיפור קל</Typography>
                    </Box>
                  )}
                  {results.score >= 60 && results.score < 75 && (
                    <Box>
                      <Typography variant="h4" color="warning.main">בינוני 📚</Typography>
                      <Typography variant="body1">כדאי לחזור על החומר</Typography>
                    </Box>
                  )}
                  {results.score < 60 && (
                    <Box>
                      <Typography variant="h4" color="error">זקוק לחזרה 📖</Typography>
                      <Typography variant="body1">מומלץ ללמוד את החומר שוב</Typography>
                    </Box>
                  )}
                </Paper>
              </Grid>
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
                            {question.type === 'case-analysis' ? 'מקרה' : 'שאלה'} {index + 1}: {question.question}
                          </Typography>
                          <Chip 
                            label={getDifficultyLabel(question.difficulty)}
                            size="small"
                            sx={{ backgroundColor: getDifficultyColor(question.difficulty), color: 'white' }}
                          />
                        </Box>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Box>
                          <Grid container spacing={2} sx={{ mb: 2 }}>
                            <Grid item xs={12} sm={6}>
                              <Chip label={question.section} variant="outlined" size="small" />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                              <Chip label={question.type} variant="outlined" size="small" />
                            </Grid>
                          </Grid>

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
                                  color: 'שקר' === question.correctAnswer ? 'success.main' : 
                                         'שקר' === userAnswer ? 'error.main' : 'text.primary',
                                  fontWeight: 'שקר' === question.correctAnswer ? 'bold' : 'normal',
                                  ml: 2
                                }}
                              >
                                ❌ שקר
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
              {currentQuestion.section} • {currentQuestion.type === 'case-analysis' ? 'ניתוח מקרה' : 'אמת/שקר'}
            </Typography>
            <Chip 
              label={getDifficultyLabel(currentQuestion.difficulty)}
              size="small"
              sx={{ backgroundColor: getDifficultyColor(currentQuestion.difficulty), color: 'white' }}
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
          {currentQuestion.type === 'case-analysis' && (
            <TextField
              fullWidth
              multiline
              rows={4}
              value={answers[currentQuestion.id] || ''}
              onChange={(e) => handleAnswer(currentQuestion.id, e.target.value)}
              placeholder="כתוב כאן את הניתוח המשפטי שלך..."
              variant="outlined"
              helperText="ענה בהתבסס על עקרונות משפטיים רלוונטיים ותקדימים"
            />
          )}

          {currentQuestion.type === 'true-false' && (
            <RadioGroup
              value={answers[currentQuestion.id] || ''}
              onChange={(e) => handleAnswer(currentQuestion.id, e.target.value)}
            >
              <FormControlLabel value="נכון" control={<Radio />} label="נכון ✅" />
              <FormControlLabel value="שקר" control={<Radio />} label="שקר ❌" />
            </RadioGroup>
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

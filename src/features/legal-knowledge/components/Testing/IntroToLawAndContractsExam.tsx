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
  School,
  Quiz,
  Assessment,
  Balance,
  Gavel,
  Description,
  Business
} from '@mui/icons-material';

interface Question {
  id: string;
  type: 'multiple-choice' | 'true-false' | 'short-answer' | 'case-study';
  section: string;
  topic: string;
  difficulty: 'easy' | 'medium' | 'hard';
  question: string;
  options?: string[];
  correctAnswer: string;
  explanation: string;
  detailedExplanation?: string;
  examples?: string[];
  legalPrinciples?: string[];
}

const introLawContractsQuestions: Question[] = [
  // חלק א': מבוא למשפט - מקורות המשפט
  {
    id: 'intro1',
    type: 'multiple-choice',
    section: 'מבוא למשפט',
    topic: 'מקורות המשפט',
    difficulty: 'easy',
    question: 'מהו המקור המרכזי של המשפט הישראלי?',
    options: [
      'א. פסיקת בתי המשפט',
      'ב. חקיקת הכנסת',
      'ג. הנוהג המסחרי',
      'ד. המשפט העברי'
    ],
    correctAnswer: 'ב. חקיקת הכנסת',
    explanation: 'החקיקה היא מקור המשפט המרכזי. היא נוצרת על ידי רשות מוסמכת ובסדר מסוים.',
    detailedExplanation: 'החקיקה מחולקת לשני סוגים: חקיקה ראשית (חוקים שהתקבלו על ידי הכנסת) וחקיקת משנה (תקנות, צווים וכללים שנקבעו על ידי הרשות המבצעת מכוח הסמכה מפורשת).',
    examples: ['חוק החוזים, התש"ל-1970', 'חוק העונשין, התשל"ז-1977', 'תקנות התעבורה (חקיקת משנה)']
  },
  {
    id: 'intro2',
    type: 'multiple-choice',
    section: 'מבוא למשפט',
    topic: 'תקדימים',
    difficulty: 'medium',
    question: 'מהו עיקרון ה-"stare decisis"?',
    options: [
      'א. חובת הוכחת האשמה',
      'ב. לדבוק במה שהוחלט - תקדים מחייב',
      'ג. חזקת החפות',
      'ד. עקרון השוויון בפני החוק'
    ],
    correctAnswer: 'ב. לדבוק במה שהוחלט - תקדים מחייב',
    explanation: 'עיקרון התקדים קובע שהחלטות שופטים בתיקים קודמים מהוות בסיס להחלטות בתיקים עתידיים עם עובדות דומות.',
    detailedExplanation: 'מטרת התקדים היא ליצור ודאות משפטית ואחידות בפסיקה. תקדים של בית המשפט העליון מחייב את כל בתי המשפט הנמוכים, אך בית המשפט העליון רשאי לסטות מתקדימים קודמים שלו במקרים חריגים.',
    legalPrinciples: ['ודאות משפטית', 'אחידות בפסיקה', 'היררכיה שיפוטית']
  },
  {
    id: 'intro3',
    type: 'true-false',
    section: 'מבוא למשפט',
    topic: 'משפט השוואתי',
    difficulty: 'medium',
    question: 'המשפט הישראלי הוא שיטה היברידית המשלבת יסודות מהמשפט הקונטיננטלי והמשפט האנגלו-אמריקאי.',
    correctAnswer: 'נכון',
    explanation: 'המשפט הישראלי אכן משלב יסודות מהמשפט הקונטיננטלי (קודקסים כתובים) ומהמשפט האנגלו-אמריקאי (תקדימים).',
    detailedExplanation: 'בשיטת המשפט הקונטיננטלי, השופט מיישם כללים כתובים בקודקס. בשיטת המשפט האנגלו-אמריקאי, השופט מחפש תקדימים קודמים. ישראל משלבת את שתי הגישות.',
    examples: ['חקיקה כמקור עיקרי (קונטיננטלי)', 'התקדים המחייב (אנגלו-אמריקאי)', 'היעדר חבר מושבעים (אנגלו-אמריקאי)']
  },
  {
    id: 'intro4',
    type: 'multiple-choice',
    section: 'מבוא למשפט',
    topic: 'ענפי המשפט',
    difficulty: 'easy',
    question: 'איזה מהענפים הבאים שייך למשפט הפרטי?',
    options: [
      'א. משפט פלילי',
      'ב. משפט חוקתי',
      'ג. דיני חוזים',
      'ד. משפט מנהלי'
    ],
    correctAnswer: 'ג. דיני חוזים',
    explanation: 'דיני חוזים הם חלק מהמשפט הפרטי, המסדיר את היחסים המשפטיים בין אדם לחברו.',
    detailedExplanation: 'המשפט הפרטי כולל: דיני חוזים, דיני נזיקין, דיני קניין. המשפט הציבורי כולל: משפט פלילי, משפט חוקתי, משפט מנהלי.',
    examples: ['דיני חוזים - הסכמים מחייבים', 'דיני נזיקין - פיצוי בגין נזק', 'דיני קניין - בעלות על נכסים']
  },

  // חלק ב': דיני חוזים - יסודות
  {
    id: 'contracts1',
    type: 'multiple-choice',
    section: 'דיני חוזים',
    topic: 'יסודות כריתת החוזה',
    difficulty: 'medium',
    question: 'מהם היסודות הנדרשים לכריתת חוזה לפי חוק החוזים?',
    options: [
      'א. הצעה וקיבול בלבד',
      'ב. הצעה, קיבול וגמירות דעת',
      'ג. הצעה, קיבול, גמירות דעת ומסוימות',
      'ד. הצעה, קיבול, גמירות דעת, מסוימות ותמורה'
    ],
    correctAnswer: 'ג. הצעה, קיבול, גמירות דעת ומסוימות',
    explanation: 'לפי סעיף 1 לחוק החוזים, יסודות הכריתה הם הצעה וקיבול, אך בנוסף נדרשים גמירות דעת ומסוימות.',
    detailedExplanation: 'גמירות דעת - כוונה מלאה ליצור קשר משפטי מחייב. מסוימות - פרטי ההסכם חייבים להיות ברורים ומפורטים מספיק.',
    examples: ['הצעה: "אני מציע לך לקנות את המכונית שלי ב-50,000 ש״ח"', 'קיבול: "אני מסכים לקנות במחיר המוצע"']
  },
  {
    id: 'contracts2',
    type: 'case-study',
    section: 'דיני חוזים',
    topic: 'גמירות דעת',
    difficulty: 'hard',
    question: 'דן ורונית נפגשו בקפה. דן אמר לרונית: "אולי נמכור לך את הדירה שלנו, אם תרצי תחשבי על זה". רונית ענתה: "נשמע לי מעניין". האם נכרת חוזה?',
    correctAnswer: 'לא נכרת חוזה',
    explanation: 'לא הייתה גמירות דעת מצד דן. השימוש במילים "אולי" ו"אם תרצי תחשבי" מעיד על חוסר כוונה ליצור התחייבות מחייבת.',
    detailedExplanation: 'גמירות דעת נבחנת במבחן אובייקטיבי - איך אדם סביר היה מבין את הדברים. כאן השפה מעידה על חוסר וודאות וכוונה לא מחייבת.',
    legalPrinciples: ['גמירות דעת', 'מבחן אובייקטיבי', 'שפה משפטית מחייבת']
  },
  {
    id: 'contracts3',
    type: 'multiple-choice',
    section: 'דיני חוזים',
    topic: 'תום לב',
    difficulty: 'medium',
    question: 'מתי חל עקרון תום הלב בדיני חוזים?',
    options: [
      'א. רק בשלב המשא ומתן',
      'ב. רק בשלב קיום החוזה',
      'ג. הן בשלב המשא ומתן והן בשלב קיום החוזה',
      'ד. רק כאשר נכרת חוזה בכתב'
    ],
    correctAnswer: 'ג. הן בשלב המשא ומתן והן בשלב קיום החוזה',
    explanation: 'עקרון תום הלב חל בכל שלבי התהליך החוזי - החל מהמשא ומתן ועד לקיום החוזה.',
    detailedExplanation: 'תום לב מחייב הגינות, יושר והוגנות. דוגמאות לחוסר תום לב: פרישה ממשא ומתן מתקדם ללא סיבה עניינית, אי-גילוי מידע מהותי.',
    examples: ['גילוי מידע רלוונטי במשא ומתן', 'אי-פגיעה במטרה המשותפת של החוזה', 'הימנעות מניצול לרעה של מצב הצד השני']
  },
  {
    id: 'contracts4',
    type: 'case-study',
    section: 'דיני חוזים',
    topic: 'הפרת תום לב במשא ומתן',
    difficulty: 'hard',
    question: 'שרה ויוסי ניהלו משא ומתן מתקדם למכירת עסק במשך 3 חודשים. שרה השקיעה 20,000 ש״ח בשכר טרחת עו״ד ובחינת העסק. יום לפני החתימה, יוסי הודיע שהוא פורש מהעסקה כי מצא קונה אחר שמציע יותר. מה זכויותיה של שרה?',
    correctAnswer: 'שרה זכאית לפיצויי הסתמכות בגין הפרת תום הלב במשא ומתן',
    explanation: 'יוסי הפר את חובת תום הלב במשא ומתן על ידי פרישה ממשא ומתן מתקדם מסיבה שאינה עניינית.',
    detailedExplanation: 'במקרה כזה, הצד הנפגע זכאי לפיצויי הסתמכות - החזר ההוצאות שהוציא בהסתמך על המשא ומתן. זה לא פיצוי על "רווח אבוד" כי לא נכרת חוזה.',
    legalPrinciples: ['חובת תום לב במשא ומתן', 'פיצויי הסתמכות', 'משא ומתן מתקדם']
  },

  // חלק ג': תרופות בשל הפרת חוזה
  {
    id: 'remedies1',
    type: 'multiple-choice',
    section: 'דיני חוזים',
    topic: 'תרופות להפרת חוזה',
    difficulty: 'medium',
    question: 'מהי התרופה המועדפת בישראל להפרת חוזה?',
    options: [
      'א. פיצויים כספיים',
      'ב. ביטול החוזה',
      'ג. אכיפה בעין',
      'ד. פיצויים מוסכמים'
    ],
    correctAnswer: 'ג. אכיפה בעין',
    explanation: 'בישראל התרופה המועדפת היא אכיפה בעין - צו המחייב את המפר לקיים את החוזה.',
    detailedExplanation: 'אכיפה בעין לא תינתן במקרים שבהם קיום החוזה בלתי אפשרי או כאשר הדבר יוצר קושי בלתי סביר.',
    examples: ['חוזה למכירת דירה - יש לחייב את המוכר להעביר את הדירה', 'חוזה לביצוע עבודה - יש לחייב את הקבלן לבצע את העבודה']
  },
  {
    id: 'remedies2',
    type: 'true-false',
    section: 'דיני חוזים',
    topic: 'ביטול חוזה',
    difficulty: 'medium',
    question: 'ביטול חוזה אפשרי רק במקרה של הפרה יסודית.',
    correctAnswer: 'נכון',
    explanation: 'הצד הנפגע רשאי לבטל את החוזה רק כאשר ההפרה היא יסודית - הפרה המונעת את השגת המטרה העיקרית של החוזה.',
    detailedExplanation: 'ביטול מוביל להשבה הדדית של מה שהועבר בין הצדדים. זוהי תרופה דרסטית ולכן היא מוגבלת להפרות יסודיות בלבד.',
    legalPrinciples: ['הפרה יסודית', 'השבה הדדית', 'פרופורציונליות בתרופות']
  },
  {
    id: 'remedies3',
    type: 'multiple-choice',
    section: 'דיני חוזים',
    topic: 'סוגי פיצויים',
    difficulty: 'hard',
    question: 'איזה סוג פיצויים נועד להעמיד את הנפגע במצב שבו היה אילו החוזה היה מקוים?',
    options: [
      'א. פיצויי הסתמכות',
      'ב. פיצויי קיום',
      'ג. פיצויים מוסכמים',
      'ד. פיצויים עונשיים'
    ],
    correctAnswer: 'ב. פיצויי קיום',
    explanation: 'פיצויי קיום נועדו לפצות על הרווח הצפוי מהחוזה ולהעמיד את הנפגע במצב שבו היה אילו החוזה היה מקוים.',
    detailedExplanation: 'פיצויי הסתמכות מפצים על ההוצאות שהוציא הנפגע בהסתמך על החוזה. פיצויים מוסכמים הם פיצויים שסוכמו מראש בחוזה.',
    examples: ['רווח שהיה צפוי מהעסקה', 'התייקרות שנגרמה עקב האיחור', 'הכנסה שאבדה עקב ההפרה']
  },
  {
    id: 'remedies4',
    type: 'case-study',
    section: 'דיני חוזים',
    topic: 'יישום תרופות',
    difficulty: 'hard',
    question: 'מיכל הזמינה חברת קייטרינג לאירוע חתונה ב-100,000 ש״ח. יום לפני האירוע החברה הודיעה שהיא מבטלת. מיכל נאלצה למצוא חברה אחרת במחיר של 150,000 ש״ח. אילו תרופות עומדות לרשותה?',
    correctAnswer: 'מיכל יכולה לתבוע פיצויי קיום בסך 50,000 ש״ח - ההפרש במחיר',
    explanation: 'מכיוון שמיכל מצאה תחליף, היא יכולה לתבוע את ההפרש במחיר כפיצויי קיום.',
    detailedExplanation: 'אכיפה בעין לא רלוונטית כי השירות כבר לא ניתן. ביטול גם לא רלוונטי כי מיכל רוצה את השירות. פיצויי קיום הם התרופה המתאימה.',
    legalPrinciples: ['פיצויי קיום', 'עקרון ההפרש', 'מציאת תחליף סביר']
  }
];

interface ExamResults {
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  sectionBreakdown: { [key: string]: { correct: number; total: number } };
  topicBreakdown: { [key: string]: { correct: number; total: number } };
}

export const IntroToLawAndContractsExam: React.FC = () => {
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
    if (currentQuestionIndex < introLawContractsQuestions.length - 1) {
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
    const topicBreakdown: { [key: string]: { correct: number; total: number } } = {};

    introLawContractsQuestions.forEach(question => {
      const userAnswer = answers[question.id];
      const isCorrect = userAnswer === question.correctAnswer;
      
      if (isCorrect) correctAnswers++;
      
      // Section breakdown
      if (!sectionBreakdown[question.section]) {
        sectionBreakdown[question.section] = { correct: 0, total: 0 };
      }
      sectionBreakdown[question.section].total++;
      if (isCorrect) sectionBreakdown[question.section].correct++;

      // Topic breakdown  
      if (!topicBreakdown[question.topic]) {
        topicBreakdown[question.topic] = { correct: 0, total: 0 };
      }
      topicBreakdown[question.topic].total++;
      if (isCorrect) topicBreakdown[question.topic].correct++;
    });

    return {
      score: Math.round((correctAnswers / introLawContractsQuestions.length) * 100),
      totalQuestions: introLawContractsQuestions.length,
      correctAnswers,
      sectionBreakdown,
      topicBreakdown
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
                <Balance sx={{ fontSize: 40 }} />
              </Avatar>
              <Typography variant="h3" gutterBottom color="primary">
                ⚖️ מבחן מבוא למשפט ודיני חוזים
              </Typography>
              <Typography variant="h6" color="text.secondary">
                מבחן מקיף על יסודות המשפט ודיני החוזים
              </Typography>
            </Box>

            <Alert severity="info" sx={{ mb: 3 }}>
              <Typography variant="body1" gutterBottom>
                <strong>המבחן כולל:</strong>
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemText primary="📚 מבוא למשפט - מקורות המשפט, תקדימים, ענפי המשפט" />
                </ListItem>
                <ListItem>
                  <ListItemText primary="📜 דיני חוזים - יסודות כריתה, תום לב, הפרות ותרופות" />
                </ListItem>
                <ListItem>
                  <ListItemText primary="⚖️ מקרי מבחן מעשיים ודוגמאות מהפרקטיקה" />
                </ListItem>
                <ListItem>
                  <ListItemText primary="🎯 הסברים מפורטים עם עקרונות משפטיים" />
                </ListItem>
              </List>
            </Alert>

            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item xs={12} sm={6} md={3}>
                <Paper elevation={2} sx={{ p: 3, textAlign: 'center' }}>
                  <School sx={{ fontSize: 40, color: '#4caf50', mb: 1 }} />
                  <Typography variant="h5">4</Typography>
                  <Typography variant="body2">מבוא למשפט</Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Paper elevation={2} sx={{ p: 3, textAlign: 'center' }}>
                  <Description sx={{ fontSize: 40, color: '#ff9800', mb: 1 }} />
                  <Typography variant="h5">6</Typography>
                  <Typography variant="body2">דיני חוזים</Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Paper elevation={2} sx={{ p: 3, textAlign: 'center' }}>
                  <Business sx={{ fontSize: 40, color: '#f44336', mb: 1 }} />
                  <Typography variant="h5">4</Typography>
                  <Typography variant="body2">מקרי מבחן</Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Paper elevation={2} sx={{ p: 3, textAlign: 'center' }}>
                  <Assessment sx={{ fontSize: 40, color: '#9c27b0', mb: 1 }} />
                  <Typography variant="h5">{introLawContractsQuestions.length}</Typography>
                  <Typography variant="body2">סה"כ שאלות</Typography>
                </Paper>
              </Grid>
            </Grid>

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
                <Typography variant="h6" gutterBottom>פירוט לפי נושאים:</Typography>
                {Object.entries(results.topicBreakdown).map(([topic, stats]) => (
                  <Paper key={topic} elevation={1} sx={{ p: 2, mb: 2 }}>
                    <Typography variant="subtitle1" fontWeight="bold">
                      {topic}
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
                {introLawContractsQuestions.map((question, index) => {
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
                        </Box>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Box>
                          <Grid container spacing={2} sx={{ mb: 2 }}>
                            <Grid item xs={12} sm={4}>
                              <Chip label={question.section} variant="outlined" size="small" />
                            </Grid>
                            <Grid item xs={12} sm={4}>
                              <Chip label={question.topic} variant="outlined" size="small" />
                            </Grid>
                            <Grid item xs={12} sm={4}>
                              <Chip label={question.type} variant="outlined" size="small" />
                            </Grid>
                          </Grid>

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

                          {question.detailedExplanation && (
                            <Box mb={2}>
                              <Typography variant="subtitle2" gutterBottom color="info.main">
                                📖 הסבר מפורט:
                              </Typography>
                              <Typography variant="body2" paragraph>
                                {question.detailedExplanation}
                              </Typography>
                            </Box>
                          )}

                          {question.examples && question.examples.length > 0 && (
                            <Box mb={2}>
                              <Typography variant="subtitle2" gutterBottom color="warning.main">
                                📝 דוגמאות:
                              </Typography>
                              {question.examples.map((example, i) => (
                                <Typography key={i} variant="body2" sx={{ ml: 2 }}>
                                  • {example}
                                </Typography>
                              ))}
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
  const currentQuestion = introLawContractsQuestions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / introLawContractsQuestions.length) * 100;

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Card elevation={4}>
        <CardContent sx={{ p: 4 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography variant="h6" color="primary">
              {currentQuestion.section} • {currentQuestion.topic}
            </Typography>
            <Chip 
              label={getDifficultyLabel(currentQuestion.difficulty)}
              size="small"
              sx={{ backgroundColor: getDifficultyColor(currentQuestion.difficulty), color: 'white' }}
            />
          </Box>

          <LinearProgress variant="determinate" value={progress} sx={{ mb: 3 }} />
          
          <Typography variant="body2" color="text.secondary" gutterBottom>
            שאלה {currentQuestionIndex + 1} מתוך {introLawContractsQuestions.length} • {currentQuestion.type}
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

          {(currentQuestion.type === 'short-answer' || currentQuestion.type === 'case-study') && (
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
              {currentQuestionIndex === introLawContractsQuestions.length - 1 ? 'סיים מבחן' : 'שאלה הבאה'}
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

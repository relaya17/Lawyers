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
  Avatar
} from '@mui/material';
import {
  ExpandMore,
  CheckCircle,
  Cancel,
  Lightbulb,
  School,
  Quiz,
  History
} from '@mui/icons-material';

interface Question {
  id: string;
  type: 'multiple-choice' | 'true-false' | 'essay';
  section: string;
  points: number;
  question: string;
  options?: string[];
  correctAnswer: string;
  explanation: string;
  detailedExplanation?: string;
}

const foundationsExamQuestions: Question[] = [
  // חלק א': שאלות רבות ברירה
  {
    id: 'mc1',
    type: 'multiple-choice',
    section: 'חלק א\' - רבות ברירה',
    points: 10,
    question: 'איזה מהמקורות הבאים אינו נחשב למקור משפטי עיקרי של המשפט הישראלי כיום?',
    options: [
      'א. חקיקת הכנסת',
      'ב. תקדימי בתי המשפט',
      'ג. חוקי היסוד',
      'ד. חוקי המג\'לה העות\'מאנית'
    ],
    correctAnswer: 'ד. חוקי המג\'לה העות\'מאנית',
    explanation: 'המג\'לה בוטלה באופן רשמי עם חקיקת "החוק לביטול המג\'לה" בשנת 1984.',
    detailedExplanation: 'המג\'לה העות\'מאנית הייתה אחד מהמקורות ההיסטוריים של המשפט הישראלי, אך עם התפתחות המדינה וחקיקת חוקים ישראליים מקוריים, היא איבדה את רלוונטיותה. ביטולה הפורמלי ב-1984 סימן את הסיום הרשמי של השפעתה על המשפט הישראלי המודרני.'
  },
  {
    id: 'mc2',
    type: 'multiple-choice',
    section: 'חלק א\' - רבות ברירה',
    points: 10,
    question: 'מהו המאפיין הייחודי שהתפתח במשפט הישראלי החל משנות ה-90?',
    options: [
      'א. יישום מלא של המשפט הקונטיננטלי',
      'ב. ביטול מוחלט של המשפט המקובל',
      'ג. אקטיביזם שיפוטי',
      'ד. חבר מושבעים'
    ],
    correctAnswer: 'ג. אקטיביזם שיפוטי',
    explanation: 'גישה זו התפתחה החל משנות ה-90, בעיקר בהנהגת בית המשפט העליון, והובילה להתערבות רבה יותר של בתי המשפט בנושאים חברתיים ופוליטיים.',
    detailedExplanation: 'האקטיביזם השיפוטי בישראל התאפיין בהתערבות פעילה של בתי המשפט, ובמיוחד בית המשפט העליון, בסוגיות חברתיות, פוליטיות וחוקתיות. תופעה זו כללה פרשנות מרחיבה של זכויות יסוד, ביקורת שיפוטית על החלטות הרשות המבצעת והמחוקקת, והרחבת הגישה לבתי המשפט.'
  },
  {
    id: 'mc3',
    type: 'multiple-choice',
    section: 'חלק א\' - רבות ברירה',
    points: 10,
    question: 'איזה מבין הגופים הבאים אינו חלק ממערכת שלוש הערכאות העיקריות של בתי המשפט?',
    options: [
      'א. בית משפט השלום',
      'ב. בית המשפט המחוזי',
      'ג. בית המשפט העליון',
      'ד. בית הדין לעבודה'
    ],
    correctAnswer: 'ד. בית הדין לעבודה',
    explanation: 'בית הדין לעבודה הוא חלק ממערכת של בתי דין מקצועיים, ולא חלק ממערכת בתי המשפט הכללית (שלום, מחוזי, עליון).',
    detailedExplanation: 'מערכת המשפט הישראלית מאורגנת בשלוש ערכאות עיקריות: בתי משפט השלום (ערכאה ראשונה), בתי המשפט המחוזיים (ערכאת ערעור וגם ערכאה ראשונה במקרים מסוימים), ובית המשפט העליון (ערכאת הערעור הגבוהה ובג"ץ). בתי הדין המקצועיים כמו בית הדין לעבודה פועלים במקביל למערכת הכללית בתחומים ספציפיים.'
  },
  {
    id: 'mc4',
    type: 'multiple-choice',
    section: 'חלק א\' - רבות ברירה',
    points: 10,
    question: 'מה תפקידו העיקרי של בית המשפט הגבוה לצדק (בג"ץ)?',
    options: [
      'א. לדון בתיקים פליליים חמורים',
      'ב. לדון בתביעות קטנות',
      'ג. לשמוע ערעורים על בתי המשפט המחוזיים',
      'ד. לשמוע עתירות נגד רשויות המדינה'
    ],
    correctAnswer: 'ד. לשמוע עתירות נגד רשויות המדינה',
    explanation: 'זהו תפקידו העיקרי של בג"ץ, כפי שמצוין במסמך.',
    detailedExplanation: 'בית המשפט הגבוה לצדק (בג"ץ) הוא המוסד השיפוטי המרכזי לביקורת על פעולות הרשויות הציבוריות בישראל. הוא דן בעתירות נגד החלטות הממשלה, השרים, הרשויות המקומיות וגופים ציבוריים אחרים. תפקידו חיוני לשמירה על שלטון החוק ועל זכויות הפרט מפני פגיעות של הרשות.'
  },

  // חלק ב': שאלות נכון/לא נכון
  {
    id: 'tf1',
    type: 'true-false',
    section: 'חלק ב\' - נכון/לא נכון',
    points: 10,
    question: 'המשפט בישראל מבוסס באופן מלא ובלעדי על המשפט המקובל הבריטי, ללא השפעות משיטות משפט אחרות.',
    correctAnswer: 'לא נכון',
    explanation: 'המשפט הישראלי הוא תערובת (היברידית) של המשפט המקובל והמשפט הקונטיננטלי, ומושפע גם מהמשפט העברי.',
    detailedExplanation: 'המשפט הישראלי מאופיין בהיותו שיטת משפט מעורבת (היברידית) הכוללת יסודות מהמשפט המקובל הבריטי (כמו עקרון התקדים המחייב), מהמשפט הקונטיננטלי (חקיקה כמקור עיקרי), ומהמשפט העברי (בעיקר בדיני משפחה ואישות). תערובת זו יוצרת מערכת משפטית ייחודית המשלבת מסורות משפטיות שונות.'
  },
  {
    id: 'tf2',
    type: 'true-false',
    section: 'חלק ב\' - נכון/לא נכון',
    points: 10,
    question: '"המהפכה החוקתית" בישראל התרחשה כתוצאה מחקיקת חוקה פורמלית.',
    correctAnswer: 'לא נכון',
    explanation: 'המהפכה החוקתית התרחשה למרות העדר חוקה פורמלית, עם חקיקת חוקי יסוד כמו "חוק יסוד: כבוד האדם וחירותו", שהעניקו מעמד על-חוקי לזכויות אדם.',
    detailedExplanation: 'המהפכה החוקתית בישראל התרחשה בשנות ה-90 ללא חקיקת חוקה פורמלית מקיפה. במקום זאת, היא התבססה על חקיקתם של חוקי יסוד ספציפיים (כמו "כבוד האדם וחירותו" ו"חופש העיסוק") ועל פרשנות פעילה של בית המשפט העליון שהעניקה לחוקי היסוד מעמד חוקתי ואפשרה ביקורת שיפוטית על חקיקה רגילה.'
  },

  // חלק ג': שאלת תמצות
  {
    id: 'essay1',
    type: 'essay',
    section: 'חלק ג\' - שאלת תמצות',
    points: 20,
    question: 'הסבר/י בקצרה כיצד השפיעו המשפט העות\'מאני והמשפט הבריטי על התפתחות המשפט בישראל, וכיצד רוב חוקיהם הוחלפו לבסוף.',
    correctAnswer: 'תשובה לדוגמה מובאת בהסבר המפורט',
    explanation: 'המשפט העות\'מאני והמשפט הבריטי היוו את הבסיס למשפט הישראלי עם הקמת המדינה.',
    detailedExplanation: `תשובה מלאה לדוגמה:

**השפעת המשפט העות'מאני:**
המשפט העות'מאני השפיע על המשפט הישראלי בעיקר בתחומי דיני הקרקעות והחוזים (המג'לה). חוקי הקרקעות העות'מאניים והמג'לה הושארו בתוקף לאחר תום השלטון העות'מאני ואף במהלך תקופת המנדט הבריטי.

**השפעת המשפט הבריטי:**
עם כינון המנדט הבריטי, הוחל המשפט המקובל האנגלי בפלשתינה. זה כלל עקרונות כמו:
- התקדים המחייב (stare decisis)
- היעדר חבר מושבעים
- מערכת הערכאות הבריטית
- עקרונות הביקורת השיפוטית

**תהליך ההחלפה:**
1. **פקודת סדרי השלטון והמשפט (1948)** - קבעה המשכיות משפטית והותירה את החוקים הקיימים בתוקף
2. **חקיקה הדרגתית** - הכנסת החלה בחקיקת חוקים ישראליים מקוריים
3. **ביטול המג'לה (1984)** - סימן את הסיום הרשמי של המשפט העות'מאני
4. **חקיקת חוקים חדשים** - כמו חוק המקרקעין, חוק החוזים, וחוקי יסוד

**התוצאה:**
נוצרה שיטת משפט היברידית ישראלית המשלבת יסודות מהמשפט המקובל (תקדימים), מהמשפט הקונטיננטלי (חקיקה כמקור עיקרי), ומהמשפט העברי (בתחומים מסוימים).`
  }
];

interface ExamResults {
  score: number;
  totalPoints: number;
  earnedPoints: number;
  answeredQuestions: number;
  correctAnswers: number;
  timeSpent: number;
  sectionBreakdown: { [key: string]: { correct: number; total: number; points: number } };
}

export const FoundationsOfIsraeliLawExam: React.FC = () => {
  const [currentSection, setCurrentSection] = useState<'intro' | 'exam' | 'results'>('intro');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<{ [key: string]: string }>({});
  const [showAnswers, setShowAnswers] = useState(false);
  const [examStartTime, setExamStartTime] = useState<Date | null>(null);
  const [examEndTime, setExamEndTime] = useState<Date | null>(null);

  const startExam = () => {
    setExamStartTime(new Date());
    setCurrentSection('exam');
    setCurrentQuestionIndex(0);
  };

  const handleAnswer = (questionId: string, answer: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < foundationsExamQuestions.length - 1) {
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
    setExamEndTime(new Date());
    setCurrentSection('results');
  };

  const calculateResults = (): ExamResults => {
    let correctAnswers = 0;
    let earnedPoints = 0;
    const totalPoints = foundationsExamQuestions.reduce((sum, q) => sum + q.points, 0);
    const answeredQuestions = Object.keys(answers).length;
    
    const sectionBreakdown: { [key: string]: { correct: number; total: number; points: number } } = {};

    foundationsExamQuestions.forEach(question => {
      const userAnswer = answers[question.id];
      const isCorrect = userAnswer === question.correctAnswer;
      
      if (isCorrect) {
        correctAnswers++;
        earnedPoints += question.points;
      }
      
      if (!sectionBreakdown[question.section]) {
        sectionBreakdown[question.section] = { correct: 0, total: 0, points: 0 };
      }
      sectionBreakdown[question.section].total++;
      sectionBreakdown[question.section].points += question.points;
      if (isCorrect) sectionBreakdown[question.section].correct++;
    });

    const timeSpent = examStartTime && examEndTime 
      ? Math.round((examEndTime.getTime() - examStartTime.getTime()) / (1000 * 60))
      : 0;

    return {
      score: Math.round((earnedPoints / totalPoints) * 100),
      totalPoints,
      earnedPoints,
      answeredQuestions,
      correctAnswers,
      timeSpent,
      sectionBreakdown
    };
  };

  if (currentSection === 'intro') {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Card elevation={4}>
          <CardContent sx={{ p: 4 }}>
            <Box textAlign="center" mb={4}>
              <Avatar sx={{ bgcolor: '#1976d2', width: 80, height: 80, margin: 'auto', mb: 2 }}>
                <History sx={{ fontSize: 40 }} />
              </Avatar>
              <Typography variant="h3" gutterBottom color="primary">
                🏛️ מבחן יסודות המשפט בישראל
              </Typography>
              <Typography variant="h6" color="text.secondary">
                מבחן מקיף על התפתחות שיטת המשפט הישראלית
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                מבוסס על "סקירה על שיטת המשפט בישראל"
              </Typography>
            </Box>

            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item xs={12} md={4}>
                <Paper elevation={2} sx={{ p: 3, textAlign: 'center' }}>
                  <Quiz sx={{ fontSize: 40, color: '#4caf50', mb: 1 }} />
                  <Typography variant="h5">4</Typography>
                  <Typography variant="body2">שאלות רב-ברירה</Typography>
                  <Typography variant="caption" color="text.secondary">10 נקודות כל שאלה</Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} md={4}>
                <Paper elevation={2} sx={{ p: 3, textAlign: 'center' }}>
                  <CheckCircle sx={{ fontSize: 40, color: '#ff9800', mb: 1 }} />
                  <Typography variant="h5">2</Typography>
                  <Typography variant="body2">שאלות נכון/לא נכון</Typography>
                  <Typography variant="caption" color="text.secondary">10 נקודות כל שאלה</Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} md={4}>
                <Paper elevation={2} sx={{ p: 3, textAlign: 'center' }}>
                  <School sx={{ fontSize: 40, color: '#f44336', mb: 1 }} />
                  <Typography variant="h5">1</Typography>
                  <Typography variant="body2">שאלת תמצות</Typography>
                  <Typography variant="caption" color="text.secondary">20 נקודות</Typography>
                </Paper>
              </Grid>
            </Grid>

            <Alert severity="info" sx={{ mb: 3 }}>
              <Typography variant="body1" gutterBottom>
                <strong>נושאי המבחן:</strong>
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemText primary="📜 מקורות המשפט הישראלי ההיסטוריים" />
                </ListItem>
                <ListItem>
                  <ListItemText primary="🏛️ מערכת בתי המשפט ותפקידיהם" />
                </ListItem>
                <ListItem>
                  <ListItemText primary="⚖️ האקטיביזם השיפוטי והמהפכה החוקתית" />
                </ListItem>
                <ListItem>
                  <ListItemText primary="🔄 מעבר מהמשפט העות'מאני והבריטי למשפט הישראלי" />
                </ListItem>
                <ListItem>
                  <ListItemText primary="🎯 בג&quot;ץ ותפקידו במערכת המשפט" />
                </ListItem>
              </List>
            </Alert>

            <Alert severity="warning" sx={{ mb: 3 }}>
              <Typography variant="body1">
                <strong>הערות חשובות:</strong>
              </Typography>
              <Typography variant="body2">
                • המבחן כולל 7 שאלות בסך 70 נקודות<br/>
                • שאלות הנכון/לא נכון דורשות נימוק קצר<br/>
                • שאלת התמצות מצפה לתשובה מפורטת עם דוגמאות היסטוריות
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
                🎉 תוצאות מבחן יסודות המשפט
              </Typography>
              <Typography variant="h4" color="success.main">
                {results.score}%
              </Typography>
              <Typography variant="h6" color="text.secondary">
                {results.earnedPoints} מתוך {results.totalPoints} נקודות
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {results.correctAnswers} תשובות נכונות מתוך {foundationsExamQuestions.length}
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
                  <Typography variant="h6">{results.earnedPoints}</Typography>
                  <Typography variant="body2">נקודות שנצברו</Typography>
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
            </Grid>

            <Typography variant="h5" gutterBottom>
              פירוט לפי חלקים:
            </Typography>
            <Grid container spacing={2} sx={{ mb: 4 }}>
              {Object.entries(results.sectionBreakdown).map(([section, stats]) => (
                <Grid item xs={12} md={6} key={section}>
                  <Paper elevation={1} sx={{ p: 2 }}>
                    <Typography variant="subtitle1" fontWeight="bold">
                      {section}
                    </Typography>
                    <LinearProgress 
                      variant="determinate" 
                      value={(stats.correct / stats.total) * 100}
                      sx={{ my: 1 }}
                    />
                    <Typography variant="body2">
                      {stats.correct} / {stats.total} שאלות נכונות ({Math.round((stats.correct / stats.total) * 100)}%)
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {(stats.correct / stats.total) * stats.points} מתוך {stats.points} נקודות
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
                {foundationsExamQuestions.map((question, index) => {
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
                            שאלה {index + 1} ({question.points} נקודות): {question.question}
                          </Typography>
                          <Chip 
                            label={question.section}
                            size="small"
                            variant="outlined"
                          />
                        </Box>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Box>
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
                              <Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}>
                                {question.detailedExplanation}
                              </Typography>
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
  const currentQuestion = foundationsExamQuestions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / foundationsExamQuestions.length) * 100;

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Card elevation={4}>
        <CardContent sx={{ p: 4 }}>
          {/* Progress and navigation */}
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography variant="h6" color="primary">
              {currentQuestion.section}
            </Typography>
            <Chip 
              label={`${currentQuestion.points} נקודות`}
              size="small"
              color="primary"
            />
          </Box>

          <LinearProgress variant="determinate" value={progress} sx={{ mb: 3 }} />
          
          <Typography variant="body2" color="text.secondary" gutterBottom>
            שאלה {currentQuestionIndex + 1} מתוך {foundationsExamQuestions.length}
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
            <Box>
              <RadioGroup
                value={answers[currentQuestion.id] || ''}
                onChange={(e) => handleAnswer(currentQuestion.id, e.target.value)}
                sx={{ mb: 2 }}
              >
                <FormControlLabel value="נכון" control={<Radio />} label="נכון ✅" />
                <FormControlLabel value="לא נכון" control={<Radio />} label="לא נכון ❌" />
              </RadioGroup>
              <Typography variant="subtitle2" gutterBottom color="warning.main">
                הוסף נימוק קצר לתשובתך:
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={2}
                value={answers[`${currentQuestion.id}_reasoning`] || ''}
                onChange={(e) => handleAnswer(`${currentQuestion.id}_reasoning`, e.target.value)}
                placeholder="נמק את תשובתך..."
                variant="outlined"
                size="small"
              />
            </Box>
          )}

          {currentQuestion.type === 'essay' && (
            <Box>
              <Alert severity="info" sx={{ mb: 2 }}>
                <Typography variant="body2">
                  שאלת תמצות - כתוב תשובה מפורטת הכוללת הסבר היסטורי, דוגמאות ספציפיות, ותיאור התפתחות המשפט הישראלי.
                </Typography>
              </Alert>
              <TextField
                fullWidth
                multiline
                rows={8}
                value={answers[currentQuestion.id] || ''}
                onChange={(e) => handleAnswer(currentQuestion.id, e.target.value)}
                placeholder="כתוב כאן את התשובה המפורטת..."
                variant="outlined"
              />
            </Box>
          )}

          {/* Navigation buttons */}
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
              {currentQuestionIndex === foundationsExamQuestions.length - 1 ? 'סיים מבחן' : 'שאלה הבאה'}
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

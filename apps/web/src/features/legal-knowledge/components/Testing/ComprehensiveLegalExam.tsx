import React, { useState, useEffect, useCallback } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  Typography, 
  Box, 
  Button,
  Grid,
  Paper,
  Chip,
  IconButton,
  FormControl,
  FormControlLabel,
  RadioGroup,
  Radio,
  LinearProgress,
  Alert,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Avatar,
  Tabs,
  Tab,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import {
  CheckCircle as CorrectIcon,
  Cancel as WrongIcon,
  Timer as TimerIcon,
  School as LearnIcon,
  EmojiEvents as TrophyIcon,
  Lightbulb as BulbIcon,
  Book as BookIcon,
  Assessment as ResultsIcon,
  Refresh as RetryIcon,
  Share as ShareIcon,
  ExpandMore as ExpandIcon,
  NavigateNext as NextIcon,
  NavigateBefore as PrevIcon,
  Flag as FlagIcon
} from '@mui/icons-material';

interface Question {
  id: string;
  type: 'multiple-choice' | 'true-false';
  difficulty: 'easy' | 'medium' | 'hard' | 'expert';
  category: string;
  question: string;
  options?: string[];
  correctAnswer: string | number | boolean;
  explanation: string;
  legalSource: string;
  relatedCases?: string[];
  tips?: string[];
  points: number;
}

interface ExamSession {
  sessionId: string;
  startTime: Date;
  endTime?: Date;
  questions: Question[];
  userAnswers: Map<string, string | number | boolean>;
  currentQuestionIndex: number;
  timeLimit?: number; // in minutes
  examMode: 'practice' | 'timed' | 'comprehensive';
}

interface ExamResult {
  totalQuestions: number;
  correctAnswers: number;
  wrongAnswers: number;
  score: number;
  percentage: number;
  timeSpent: number;
  categoryBreakdown: Map<string, { correct: number; total: number }>;
  difficultyBreakdown: Map<string, { correct: number; total: number }>;
  recommendations: string[];
}

const legalSourcesQuestions: Question[] = [
  // רמה קלה - רב ברירה
  {
    id: 'q1',
    type: 'multiple-choice',
    difficulty: 'easy',
    category: 'חקיקה ראשית',
    question: 'מי מוסמך לחוקק חוקים ראשיים בישראל?',
    options: ['הממשלה', 'הכנסת', 'נשיא המדינה', 'היועמ"ש'],
    correctAnswer: 1,
    explanation: 'רק הכנסת מחוקקת חוקים ראשיים; הממשלה מוסמכת לחקיקת משנה בלבד.',
    legalSource: 'חוק יסוד: הכנסת',
    points: 2
  },
  {
    id: 'q2',
    type: 'multiple-choice',
    difficulty: 'easy',
    category: 'משפט מנהלי',
    question: 'מהו עיקרון חוקיות המנהל?',
    options: [
      'הרשות רשאית לפעול תמיד',
      'הרשות רשאית לפעול רק על סמך חוק',
      'הרשות רשאית לפרש חוקים כרצונה',
      'הרשות עליונה על הכנסת'
    ],
    correctAnswer: 1,
    explanation: 'עקרון חוקיות המנהל קובע שהרשות המבצעת רשאית לפעול רק במסגרת הסמכות שהוקנתה לה בחוק.',
    legalSource: 'פסיקת בג"ץ - עקרונות משפט מנהלי',
    relatedCases: ['בג"ץ 390/79 דוויקאת נגד ממשלת ישראל'],
    points: 2
  },
  {
    id: 'q3',
    type: 'multiple-choice',
    difficulty: 'easy',
    category: 'מנהגים',
    question: 'מהו מנהג עסקי?',
    options: [
      'נוהג שאינו מוכר',
      'נוהג מקובל בתחום מסחרי',
      'חקיקה ראשית',
      'תקנה של שר'
    ],
    correctAnswer: 1,
    explanation: 'מנהג עסקי הוא נוהג חוזר ומקובל בתחום עסקי מסוים, המחייב את הצדדים אם אינו סותר חקיקה.',
    legalSource: 'חוק החוזים, פס"ד אזרחיים שונים',
    points: 2
  },
  {
    id: 'q4',
    type: 'multiple-choice',
    difficulty: 'easy',
    category: 'חוקי יסוד',
    question: 'חוקי יסוד עם פסקת הגבלה מאפשרים:',
    options: [
      'פסילה מותנית של חוקים סותרים',
      'פסילה אוטומטית של חוקים',
      'ביטול מנהגים',
      'הרחבת סמכויות הכנסת'
    ],
    correctAnswer: 0,
    explanation: 'פסקת הגבלה מאפשרת לבג"ץ לבחון ולפסול חוקים הסותרים זכויות יסוד, באמצעות מבחן הפגיעה המידתית.',
    legalSource: 'חוק יסוד: כבוד האדם וחירותו',
    relatedCases: ['בג"ץ 6821/93 בנק מזרחי - המהפכה החוקתית'],
    points: 2
  },
  {
    id: 'q5',
    type: 'multiple-choice',
    difficulty: 'easy',
    category: 'פסיקה',
    question: 'פסיקה מחייבת מחייבת ערכאות כך ש:',
    options: [
      'פסיקה מחייבת רק את בית המשפט שנתן אותה',
      'פסיקה מחייבת ערכאות נמוכות יותר',
      'פסיקה מחייבת את הכנסת',
      'פסיקה אינה מחייבת כלל'
    ],
    correctAnswer: 1,
    explanation: 'עקרון Stare Decisis - פסיקה של ערכאה גבוהה מחייבת ערכאות נמוכות יותר, יוצרת יציבות משפטית.',
    legalSource: 'עקרונות המשפט המקובל',
    points: 2
  },

  // רמה בינונית
  {
    id: 'q6',
    type: 'multiple-choice',
    difficulty: 'medium',
    category: 'ביקורת שיפוטית',
    question: 'מי יכול לפסול תקנה הסותרת חוק יסוד?',
    options: ['שר המשפטים', 'היועמ"ש', 'בג"ץ', 'הכנסת'],
    correctAnswer: 2,
    explanation: 'בג"ץ מוסמך לפסול תקנות ופעולות מנהליות הסותרות חוקי יסוד במסגרת סמכות הביקורת השיפוטית.',
    legalSource: 'חוק יסוד: השפיטה, פסיקת בג"ץ',
    points: 3
  },
  {
    id: 'q7',
    type: 'multiple-choice',
    difficulty: 'medium',
    category: 'פרשנות',
    question: 'מהי פרשנות תכליתית?',
    options: [
      'לפי לשון החוק',
      'לפי כוונת המחוקק ומטרת החוק',
      'מצמצמת תחולתו',
      'אינה קיימת במשפט הישראלי'
    ],
    correctAnswer: 1,
    explanation: 'פרשנות תכליתית בוחנת את מטרת החוק וכוונת המחוקק, לא רק את הנוסח המילולי.',
    legalSource: 'חוק הפרשנות, פסיקת בתי המשפט',
    points: 3
  },

  // רמה קשה
  {
    id: 'q8',
    type: 'multiple-choice',
    difficulty: 'hard',
    category: 'פרשנות דינמית',
    question: 'מהו המשפט הדינמי?',
    options: [
      'פרשנות לפי לשון החוק בלבד',
      'פרשנות לפי צרכים עכשוויים',
      'סטיית תקדים בלבד',
      'משפט מנהגי בלבד'
    ],
    correctAnswer: 1,
    explanation: 'פרשנות דינמית מתאימה את החוק למציאות משתנה ולצרכים עכשוויים, תוך שמירה על רוח החוק.',
    legalSource: 'תורת הפרשנות המשפטית',
    points: 4
  },

  // שאלות נכון/לא נכון
  {
    id: 'tf1',
    type: 'true-false',
    difficulty: 'easy',
    category: 'חקיקה',
    question: 'כל חקיקה ראשית נחשבת עליונה על חקיקת משנה.',
    correctAnswer: true,
    explanation: 'חקיקה ראשית (חוקי הכנסת) עומדת מעל לתקנות וחקיקה משנית בהיררכיה הנורמטיבית.',
    legalSource: 'עקרונות חוקיות המנהל',
    points: 2
  },
  {
    id: 'tf2',
    type: 'true-false',
    difficulty: 'easy',
    category: 'מנהגים',
    question: 'מנהג עסקי מחייב תמיד את בתי המשפט.',
    correctAnswer: false,
    explanation: 'מנהג מחייב רק אם אין חקיקה סותרת והוא מקובל ומוכח בתחום הרלוונטי.',
    legalSource: 'חוק החוזים, פסיקה אזרחית',
    points: 2
  },
  {
    id: 'tf3',
    type: 'true-false',
    difficulty: 'medium',
    category: 'פסיקה',
    question: 'פסיקה של בית משפט מחוזי מחייבת את כל בתי המשפט נמוכים ממנו.',
    correctAnswer: true,
    explanation: 'עיקרון ההיררכיה השיפוטית מחייב את הערכאות הנמוכות יותר לפסיקת ערכאות גבוהות.',
    legalSource: 'חוק בתי המשפט',
    points: 3
  },
  {
    id: 'tf4',
    type: 'true-false',
    difficulty: 'hard',
    category: 'משפט בינלאומי',
    question: 'משפט בינלאומי אינו מחייב בישראל כלל.',
    correctAnswer: false,
    explanation: 'המשפט הבינלאומי מחייב כאשר אומץ כחוק פנימי או השפיע על חקיקה מקומית.',
    legalSource: 'אמנות בינלאומיות, פסיקת בג"ץ',
    points: 4
  }
];

type AnswerValue = string | number | boolean;

const getOptionBgColor = (
  index: number,
  correctAnswer: AnswerValue,
  currentAnswer: AnswerValue,
  showFeedback: boolean
): string | undefined => {
  if (!showFeedback) return undefined;
  if (index === correctAnswer) return '#e8f5e9';
  if (index === currentAnswer && currentAnswer !== correctAnswer) return '#ffebee';
  return undefined;
};

const getTFBgColor = (
  value: boolean,
  correctAnswer: AnswerValue,
  currentAnswer: AnswerValue,
  showFeedback: boolean
): string | undefined => {
  if (!showFeedback) return undefined;
  if (value === correctAnswer) return '#e8f5e9';
  if (value === currentAnswer && currentAnswer !== correctAnswer) return '#ffebee';
  return undefined;
};

const getExplanationSeverity = (correctAnswer: AnswerValue, currentAnswer: AnswerValue): 'success' | 'error' => {
  if (currentAnswer === correctAnswer) return 'success';
  return 'error';
};

interface ComprehensiveLegalExamProps {
  onComplete: (results: ExamResult) => void;
  examMode?: 'practice' | 'timed' | 'comprehensive';
  timeLimit?: number;
}

export const ComprehensiveLegalExam: React.FC<ComprehensiveLegalExamProps> = ({
  onComplete,
  examMode = 'practice',
  timeLimit = 60
}) => {
  const [examSession, setExamSession] = useState<ExamSession | null>(null);
  const [currentAnswer, setCurrentAnswer] = useState<AnswerValue>('');
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const [flaggedQuestions, setFlaggedQuestions] = useState<Set<string>>(new Set());
  const [reviewMode, setReviewMode] = useState(false);
  const [examResults, setExamResults] = useState<ExamResult | null>(null);
  const [selectedTab, setSelectedTab] = useState(0);

  // התחלת מבחן
  const startExam = useCallback((mode: 'practice' | 'timed' | 'comprehensive') => {
    const questions = mode === 'comprehensive' 
      ? legalSourcesQuestions 
      : legalSourcesQuestions.slice(0, 10);
    
    const session: ExamSession = {
      sessionId: `exam_${Date.now()}`,
      startTime: new Date(),
      questions: [...questions].sort(() => Math.random() - 0.5), // ערבוב שאלות
      userAnswers: new Map(),
      currentQuestionIndex: 0,
      timeLimit: mode === 'timed' ? timeLimit : undefined,
      examMode: mode
    };
    
    setExamSession(session);
    setTimeRemaining(mode === 'timed' ? timeLimit * 60 : 0);
    setCurrentAnswer('');
    setShowExplanation(false);
    setReviewMode(false);
    setExamResults(null);
  }, [timeLimit]);

  // טיימר
  useEffect(() => {
    if (examSession?.examMode === 'timed' && timeRemaining > 0 && !reviewMode) {
      const timer = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            finishExam();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
      return () => clearInterval(timer);
    }
  }, [examSession, timeRemaining, reviewMode]);

  // מעבר לשאלה הבאה
  const nextQuestion = () => {
    if (!examSession) return;
    
    // שמירת תשובה
    if (currentAnswer !== '') {
      examSession.userAnswers.set(
        examSession.questions[examSession.currentQuestionIndex].id, 
        currentAnswer
      );
    }
    
    if (examSession.currentQuestionIndex < examSession.questions.length - 1) {
      setExamSession({
        ...examSession,
        currentQuestionIndex: examSession.currentQuestionIndex + 1
      });
      setCurrentAnswer('');
      setShowExplanation(false);
    } else {
      finishExam();
    }
  };

  // מעבר לשאלה הקודמת
  const prevQuestion = () => {
    if (!examSession || examSession.currentQuestionIndex === 0) return;
    
    setExamSession({
      ...examSession,
      currentQuestionIndex: examSession.currentQuestionIndex - 1
    });
    
    const prevQuestionId = examSession.questions[examSession.currentQuestionIndex - 1].id;
    setCurrentAnswer(examSession.userAnswers.get(prevQuestionId) || '');
    setShowExplanation(false);
  };

  // סיום מבחן וחישוב תוצאות
  const finishExam = () => {
    if (!examSession) return;
    
    // שמירת תשובה אחרונה
    if (currentAnswer !== '') {
      examSession.userAnswers.set(
        examSession.questions[examSession.currentQuestionIndex].id,
        currentAnswer
      );
    }
    
    examSession.endTime = new Date();
    const timeSpent = (examSession.endTime.getTime() - examSession.startTime.getTime()) / 1000 / 60;
    
    let correctAnswers = 0;
    let totalPoints = 0;
    let earnedPoints = 0;
    const categoryBreakdown = new Map<string, { correct: number; total: number }>();
    const difficultyBreakdown = new Map<string, { correct: number; total: number }>();
    
    examSession.questions.forEach(question => {
      const userAnswer = examSession.userAnswers.get(question.id);
      const isCorrect = userAnswer === question.correctAnswer;
      
      if (isCorrect) {
        correctAnswers++;
        earnedPoints += question.points;
      }
      totalPoints += question.points;
      
      // ניתוח לפי קטגוריה
      const categoryStats = categoryBreakdown.get(question.category) || { correct: 0, total: 0 };
      categoryStats.total++;
      if (isCorrect) categoryStats.correct++;
      categoryBreakdown.set(question.category, categoryStats);
      
      // ניתוח לפי קושי
      const difficultyStats = difficultyBreakdown.get(question.difficulty) || { correct: 0, total: 0 };
      difficultyStats.total++;
      if (isCorrect) difficultyStats.correct++;
      difficultyBreakdown.set(question.difficulty, difficultyStats);
    });
    
    const percentage = (earnedPoints / totalPoints) * 100;
    
    const results: ExamResult = {
      totalQuestions: examSession.questions.length,
      correctAnswers,
      wrongAnswers: examSession.questions.length - correctAnswers,
      score: earnedPoints,
      percentage: Math.round(percentage),
      timeSpent: Math.round(timeSpent),
      categoryBreakdown,
      difficultyBreakdown,
      recommendations: generateRecommendations(percentage, categoryBreakdown, difficultyBreakdown)
    };
    
    setExamResults(results);
    setReviewMode(true);
    onComplete(results);
  };

  // יצירת המלצות
  const generateRecommendations = (
    percentage: number,
    categoryBreakdown: Map<string, { correct: number; total: number }>,
    difficultyBreakdown: Map<string, { correct: number; total: number }>
  ): string[] => {
    const recommendations: string[] = [];
    
    if (percentage < 60) {
      recommendations.push('מומלץ לחזור על החומר הבסיסי במקורות המשפט');
    } else if (percentage < 80) {
      recommendations.push('ביצועים טובים! מומלץ להעמיק בנושאים המורכבים יותר');
    } else {
      recommendations.push('ביצועים מצוינים! אתה שולט היטב בחומר');
    }
    
    // המלצות לפי קטגוריות חלשות
    categoryBreakdown.forEach((stats, category) => {
      const categoryPercentage = (stats.correct / stats.total) * 100;
      if (categoryPercentage < 60) {
        recommendations.push(`מומלץ להעמיק בנושא: ${category}`);
      }
    });
    
    // המלצות לפי רמת קושי
    difficultyBreakdown.forEach((stats, difficulty) => {
      const difficultyPercentage = (stats.correct / stats.total) * 100;
      if (difficultyPercentage < 50 && difficulty === 'hard') {
        recommendations.push('מומלץ לתרגל יותר שאלות ברמת קושי גבוהה');
      }
    });
    
    return recommendations;
  };

  // סימון שאלה
  const toggleFlag = (questionId: string) => {
    const newFlagged = new Set(flaggedQuestions);
    if (newFlagged.has(questionId)) {
      newFlagged.delete(questionId);
    } else {
      newFlagged.add(questionId);
    }
    setFlaggedQuestions(newFlagged);
  };

  // פורמט זמן
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // קבלת צבע לפי קושי
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return '#4caf50';
      case 'medium': return '#ff9800';
      case 'hard': return '#f44336';
      case 'expert': return '#9c27b0';
      default: return '#9e9e9e';
    }
  };

  // קבלת תווית קושי
  const getDifficultyLabel = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'קל';
      case 'medium': return 'בינוני';
      case 'hard': return 'קשה';
      case 'expert': return 'מומחה';
      default: return 'לא ידוע';
    }
  };

  if (!examSession) {
    return (
      <Box sx={{ maxWidth: 800, margin: 'auto', p: 3 }}>
        <Card>
          <CardHeader
            title={
              <Typography variant="h4" textAlign="center" color="primary">
                🏛️ מבחן מקורות המשפט
              </Typography>
            }
            subheader={
              <Typography variant="h6" textAlign="center" color="text.secondary">
                בחר מצב מבחן להתחלה
              </Typography>
            }
          />
          <CardContent>
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <Card 
                  variant="outlined" 
                  sx={{ cursor: 'pointer', '&:hover': { bgcolor: '#f5f5f5' } }}
                  onClick={() => startExam('practice')}
                >
                  <CardContent>
                    <Box textAlign="center">
                      <LearnIcon sx={{ fontSize: 48, color: '#4caf50', mb: 2 }} />
                      <Typography variant="h6" gutterBottom>
                        מבחן תרגול
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        10 שאלות • ללא הגבלת זמן • עם הסברים
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <Card 
                  variant="outlined" 
                  sx={{ cursor: 'pointer', '&:hover': { bgcolor: '#f5f5f5' } }}
                  onClick={() => startExam('timed')}
                >
                  <CardContent>
                    <Box textAlign="center">
                      <TimerIcon sx={{ fontSize: 48, color: '#ff9800', mb: 2 }} />
                      <Typography variant="h6" gutterBottom>
                        מבחן מתוזמן
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        10 שאלות • {timeLimit} דקות • לחץ זמן
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <Card 
                  variant="outlined" 
                  sx={{ cursor: 'pointer', '&:hover': { bgcolor: '#f5f5f5' } }}
                  onClick={() => startExam('comprehensive')}
                >
                  <CardContent>
                    <Box textAlign="center">
                      <TrophyIcon sx={{ fontSize: 48, color: '#f44336', mb: 2 }} />
                      <Typography variant="h6" gutterBottom>
                        מבחן מקיף
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        50 שאלות • ללא הגבלת זמן • אתגר מלא
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Box>
    );
  }

  if (reviewMode && examResults) {
    return (
      <Box sx={{ maxWidth: 1200, margin: 'auto', p: 3 }}>
        <Card>
          <CardHeader
            title={
              <Typography variant="h4" textAlign="center" color="primary">
                📊 תוצאות המבחן
              </Typography>
            }
          />
          <CardContent>
            <Box textAlign="center" mb={3}>
              <Avatar 
                sx={{ 
                  width: 80, 
                  height: 80, 
                  bgcolor: examResults.percentage >= 80 ? '#4caf50' : 
                          examResults.percentage >= 60 ? '#ff9800' : '#f44336',
                  margin: 'auto',
                  mb: 2
                }}
              >
                <Typography variant="h4" color="white">
                  {examResults.percentage}%
                </Typography>
              </Avatar>
              
              <Typography variant="h5" gutterBottom>
                {examResults.percentage >= 90 ? '🏆 מצוין!' :
                 examResults.percentage >= 80 ? '⭐ טוב מאוד!' :
                 examResults.percentage >= 70 ? '👍 טוב!' :
                 examResults.percentage >= 60 ? '📚 סביר!' : '💪 צריך שיפור!'}
              </Typography>
              
              <Grid container spacing={2} justifyContent="center">
                <Grid item>
                  <Paper elevation={1} sx={{ p: 2, textAlign: 'center' }}>
                    <Typography variant="h6" color="success.main">
                      {examResults.correctAnswers}
                    </Typography>
                    <Typography variant="caption">תשובות נכונות</Typography>
                  </Paper>
                </Grid>
                <Grid item>
                  <Paper elevation={1} sx={{ p: 2, textAlign: 'center' }}>
                    <Typography variant="h6" color="error.main">
                      {examResults.wrongAnswers}
                    </Typography>
                    <Typography variant="caption">תשובות שגויות</Typography>
                  </Paper>
                </Grid>
                <Grid item>
                  <Paper elevation={1} sx={{ p: 2, textAlign: 'center' }}>
                    <Typography variant="h6" color="info.main">
                      {examResults.timeSpent} דק'
                    </Typography>
                    <Typography variant="caption">זמן שהושקע</Typography>
                  </Paper>
                </Grid>
              </Grid>
            </Box>

            <Tabs value={selectedTab} onChange={(_, newValue) => setSelectedTab(newValue)}>
              <Tab label="סיכום כללי" />
              <Tab label="ניתוח לפי נושאים" />
              <Tab label="סקירת שאלות" />
              <Tab label="המלצות" />
            </Tabs>

            {/* טאב סיכום כללי */}
            {selectedTab === 0 && (
              <Box sx={{ mt: 3 }}>
                <Typography variant="h6" gutterBottom>
                  ניתוח לפי רמת קושי
                </Typography>
                <Grid container spacing={2}>
                  {Array.from(examResults.difficultyBreakdown.entries()).map(([difficulty, stats]) => {
                    const percentage = Math.round((stats.correct / stats.total) * 100);
                    return (
                      <Grid item xs={12} sm={6} md={3} key={difficulty}>
                        <Paper elevation={1} sx={{ p: 2 }}>
                          <Typography variant="subtitle1" gutterBottom>
                            {getDifficultyLabel(difficulty)}
                          </Typography>
                          <LinearProgress 
                            variant="determinate" 
                            value={percentage}
                            sx={{ 
                              mb: 1,
                              '& .MuiLinearProgress-bar': {
                                backgroundColor: getDifficultyColor(difficulty)
                              }
                            }}
                          />
                          <Typography variant="body2">
                            {stats.correct}/{stats.total} ({percentage}%)
                          </Typography>
                        </Paper>
                      </Grid>
                    );
                  })}
                </Grid>
              </Box>
            )}

            {/* טאב ניתוח לפי נושאים */}
            {selectedTab === 1 && (
              <Box sx={{ mt: 3 }}>
                <Typography variant="h6" gutterBottom>
                  ביצועים לפי נושאים
                </Typography>
                <List>
                  {Array.from(examResults.categoryBreakdown.entries()).map(([category, stats]) => {
                    const percentage = Math.round((stats.correct / stats.total) * 100);
                    return (
                      <ListItem key={category}>
                        <ListItemIcon>
                          <BookIcon color={percentage >= 70 ? 'success' : percentage >= 50 ? 'warning' : 'error'} />
                        </ListItemIcon>
                        <ListItemText
                          primary={category}
                          secondary={
                            <Box>
                              <LinearProgress 
                                variant="determinate" 
                                value={percentage}
                                sx={{ mt: 1, mb: 1 }}
                              />
                              <Typography variant="caption">
                                {stats.correct}/{stats.total} שאלות נכונות ({percentage}%)
                              </Typography>
                            </Box>
                          }
                        />
                      </ListItem>
                    );
                  })}
                </List>
              </Box>
            )}

            {/* טאב סקירת שאלות */}
            {selectedTab === 2 && (
              <Box sx={{ mt: 3 }}>
                <Typography variant="h6" gutterBottom>
                  סקירת כל השאלות
                </Typography>
                {examSession.questions.map((question, index) => {
                  const userAnswer = examSession.userAnswers.get(question.id);
                  const isCorrect = userAnswer === question.correctAnswer;
                  
                  return (
                    <Accordion key={question.id}>
                      <AccordionSummary expandIcon={<ExpandIcon />}>
                        <Box display="flex" alignItems="center" gap={2} width="100%">
                          {isCorrect ? 
                            <CorrectIcon color="success" /> : 
                            <WrongIcon color="error" />
                          }
                          <Typography variant="body1">
                            שאלה {index + 1}: {question.question.slice(0, 50)}...
                          </Typography>
                          <Chip 
                            label={getDifficultyLabel(question.difficulty)}
                            size="small"
                            sx={{ 
                              backgroundColor: getDifficultyColor(question.difficulty),
                              color: 'white'
                            }}
                          />
                        </Box>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Typography variant="body1" gutterBottom>
                          <strong>השאלה:</strong> {question.question}
                        </Typography>
                        
                        {question.type === 'multiple-choice' && question.options && (
                          <Box mb={2}>
                            {question.options.map((option, optIndex) => (
                              <Typography 
                                key={optIndex}
                                variant="body2"
                                sx={{
                                  color: optIndex === question.correctAnswer ? 'success.main' :
                                         optIndex === userAnswer ? 'error.main' : 'text.primary',
                                  fontWeight: optIndex === question.correctAnswer || optIndex === userAnswer ? 'bold' : 'normal'
                                }}
                              >
                                {String.fromCharCode(65 + optIndex)}. {option}
                                {optIndex === question.correctAnswer && ' ✅'}
                                {optIndex === userAnswer && optIndex !== question.correctAnswer && ' ❌'}
                              </Typography>
                            ))}
                          </Box>
                        )}
                        
                        <Alert severity={isCorrect ? 'success' : 'error'} sx={{ mb: 2 }}>
                          <Typography variant="body2">
                            <strong>הסבר:</strong> {question.explanation}
                          </Typography>
                        </Alert>
                        
                        <Typography variant="caption" color="text.secondary">
                          מקור משפטי: {question.legalSource}
                        </Typography>
                      </AccordionDetails>
                    </Accordion>
                  );
                })}
              </Box>
            )}

            {/* טאב המלצות */}
            {selectedTab === 3 && (
              <Box sx={{ mt: 3 }}>
                <Typography variant="h6" gutterBottom>
                  המלצות ללימוד נוסף
                </Typography>
                <List>
                  {examResults.recommendations.map((recommendation, index) => (
                    <ListItem key={index}>
                      <ListItemIcon>
                        <BulbIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText primary={recommendation} />
                    </ListItem>
                  ))}
                </List>
              </Box>
            )}

            <Box display="flex" gap={2} justifyContent="center" mt={3}>
              <Button 
                variant="contained" 
                startIcon={<RetryIcon />}
                onClick={() => startExam(examSession.examMode)}
              >
                מבחן חדש
              </Button>
              <Button 
                variant="outlined" 
                startIcon={<ShareIcon />}
                onClick={() => {
                  const resultText = `השגתי ${examResults.percentage}% במבחן מקורות המשפט! 🏛️`;
                  navigator.share?.({ text: resultText }) || 
                  navigator.clipboard?.writeText(resultText);
                }}
              >
                שתף תוצאות
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Box>
    );
  }

  // מצב מבחן פעיל
  const currentQuestion = examSession.questions[examSession.currentQuestionIndex];
  const progress = ((examSession.currentQuestionIndex + 1) / examSession.questions.length) * 100;

  return (
    <Box sx={{ maxWidth: 800, margin: 'auto', p: 3 }}>
      <Card>
        {/* כותרת עם מידע על המבחן */}
        <CardHeader
          title={
            <Box display="flex" justifyContent="between" alignItems="center">
              <Typography variant="h5">
                🏛️ מבחן מקורות המשפט
              </Typography>
              <Box display="flex" alignItems="center" gap={2}>
                {examSession.examMode === 'timed' && (
                  <Chip 
                    icon={<TimerIcon />}
                    label={formatTime(timeRemaining)}
                    color={timeRemaining < 300 ? 'error' : 'primary'}
                  />
                )}
                <Chip 
                  label={`${examSession.currentQuestionIndex + 1}/${examSession.questions.length}`}
                  variant="outlined"
                />
              </Box>
            </Box>
          }
        />
        
        {/* progress bar */}
        <LinearProgress variant="determinate" value={progress} sx={{ mb: 2 }} />
        
        <CardContent>
          {/* מידע על השאלה */}
          <Box display="flex" justifyContent="between" alignItems="center" mb={3}>
            <Box display="flex" gap={1}>
              <Chip 
                label={currentQuestion.category}
                size="small"
                color="primary"
              />
              <Chip 
                label={getDifficultyLabel(currentQuestion.difficulty)}
                size="small"
                sx={{ 
                  backgroundColor: getDifficultyColor(currentQuestion.difficulty),
                  color: 'white'
                }}
              />
              <Chip 
                label={`${currentQuestion.points} נקודות`}
                size="small"
                variant="outlined"
              />
            </Box>
            
            <IconButton 
              onClick={() => toggleFlag(currentQuestion.id)}
              color={flaggedQuestions.has(currentQuestion.id) ? 'warning' : 'default'}
            >
              <FlagIcon />
            </IconButton>
          </Box>
          
          {/* השאלה */}
          <Typography variant="h6" gutterBottom>
            {currentQuestion.question}
          </Typography>
          
          {/* תשובות */}
          <FormControl component="fieldset" fullWidth sx={{ mt: 3 }}>
            {currentQuestion.type === 'multiple-choice' && currentQuestion.options ? (
              <RadioGroup
                value={currentAnswer}
                onChange={(e) => setCurrentAnswer(parseInt(e.target.value))}
              >
                {currentQuestion.options.map((option, index) => (
                  <FormControlLabel
                    key={index}
                    value={index}
                    control={<Radio />}
                    label={`${String.fromCharCode(65 + index)}. ${option}`}
                    sx={{
                      mb: 1,
                      borderRadius: 1,
                      px: 1,
                      backgroundColor: getOptionBgColor(index, currentQuestion.correctAnswer, currentAnswer, showExplanation)
                    }}
                  />
                ))}
              </RadioGroup>
            ) : (
              <RadioGroup
                value={currentAnswer}
                onChange={(e) => setCurrentAnswer(e.target.value === 'true')}
              >
                <FormControlLabel
                  value="true"
                  control={<Radio />}
                  label="✅ נכון"
                  sx={{
                    mb: 1,
                    borderRadius: 1,
                    px: 1,
                    backgroundColor: getTFBgColor(true, currentQuestion.correctAnswer, currentAnswer, showExplanation)
                  }}
                />
                <FormControlLabel
                  value="false"
                  control={<Radio />}
                  label="❌ לא נכון"
                  sx={{
                    mb: 1,
                    borderRadius: 1,
                    px: 1,
                    backgroundColor: getTFBgColor(false, currentQuestion.correctAnswer, currentAnswer, showExplanation)
                  }}
                />
              </RadioGroup>
            )}
          </FormControl>
          
          {/* הסבר (במצב תרגול) */}
          {examSession.examMode === 'practice' && showExplanation && (
            <Alert severity={getExplanationSeverity(currentQuestion.correctAnswer, currentAnswer)} sx={{ mt: 3 }}>
              <Typography variant="body2">
                <strong>הסבר:</strong> {currentQuestion.explanation}
              </Typography>
              <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                מקור משפטי: {currentQuestion.legalSource}
              </Typography>
              {currentQuestion.relatedCases && (
                <Typography variant="caption" display="block">
                  מקרים רלוונטיים: {currentQuestion.relatedCases.join(', ')}
                </Typography>
              )}
            </Alert>
          )}
          
          {/* כפתורי ניווט */}
          <Box display="flex" justifyContent="between" alignItems="center" mt={4}>
            <Button
              startIcon={<PrevIcon />}
              onClick={prevQuestion}
              disabled={examSession.currentQuestionIndex === 0}
            >
              קודם
            </Button>
            
            <Box display="flex" gap={2}>
              {examSession.examMode === 'practice' && currentAnswer !== '' && (
                <Button
                  variant="outlined"
                  startIcon={<BulbIcon />}
                  onClick={() => setShowExplanation(!showExplanation)}
                >
                  {showExplanation ? 'הסתר הסבר' : 'הצג הסבר'}
                </Button>
              )}
              
              {examSession.currentQuestionIndex === examSession.questions.length - 1 ? (
                <Button
                  variant="contained"
                  color="success"
                  endIcon={<ResultsIcon />}
                  onClick={finishExam}
                  disabled={currentAnswer === ''}
                >
                  סיים מבחן
                </Button>
              ) : (
                <Button
                  variant="contained"
                  endIcon={<NextIcon />}
                  onClick={nextQuestion}
                  disabled={currentAnswer === ''}
                >
                  הבא
                </Button>
              )}
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

import React, { useState, useEffect } from 'react';
import { useTrackAnswer } from '../../../../features/personal-learning/hooks/useTrackAnswer';
import { useEntitlements } from '@/features/billing/providers/EntitlementsProvider';
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
  Avatar,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  Tab,
  Alert
} from '@mui/material';
import { 
  Quiz as QuizIcon,
  TrendingUp as ProgressIcon,
  History as HistoryIcon,
  EmojiEvents as TrophyIcon,
  Timer as TimerIcon,
  School as LearnIcon,
  CheckCircle as CorrectIcon,
  Cancel as WrongIcon,
  Info as InfoIcon
} from '@mui/icons-material';
import { ComprehensiveLegalExam } from './ComprehensiveLegalExam';

interface ExamHistory {
  id: string;
  date: Date;
  examMode: 'practice' | 'timed' | 'comprehensive';
  score: number;
  percentage: number;
  totalQuestions: number;
  correctAnswers: number;
  timeSpent: number;
  categoryBreakdown: Map<string, { correct: number; total: number }>;
  difficultyBreakdown: Map<string, { correct: number; total: number }>;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  earned: boolean;
  earnedDate?: Date;
  condition: string;
}

interface LearningPath {
  id: string;
  title: string;
  description: string;
  topics: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: number;
  completed: boolean;
  progress: number;
}

const achievements: Achievement[] = [
  {
    id: 'first_exam',
    title: 'המבחן הראשון',
    description: 'השלמת המבחן הראשון שלך',
    icon: '🎯',
    earned: false,
    condition: 'השלם מבחן אחד'
  },
  {
    id: 'perfect_score',
    title: 'ציון מושלם',
    description: 'השג 100% במבחן',
    icon: '🏆',
    earned: false,
    condition: 'השג 100% במבחן כלשהו'
  },
  {
    id: 'speed_demon',
    title: 'שד המהירות',
    description: 'השלם מבחן מתוזמן בפחות מ-30 דקות',
    icon: '⚡',
    earned: false,
    condition: 'השלם מבחן מתוזמן מתחת לזמן הממוצע'
  },
  {
    id: 'comprehensive_master',
    title: 'מאסטר מקיף',
    description: 'השלם מבחן מקיף עם ציון מעל 85%',
    icon: '🎓',
    earned: false,
    condition: 'השלם מבחן מקיף עם ציון מעל 85%'
  },
  {
    id: 'consistency_king',
    title: 'מלך העקביות',
    description: 'השלם 5 מבחנים ברציפות עם ציון מעל 80%',
    icon: '👑',
    earned: false,
    condition: 'השלם 5 מבחנים ברציפות עם ציון טוב'
  },
  {
    id: 'hard_questions_master',
    title: 'מאסטר השאלות הקשות',
    description: 'ענה נכון על 90% מהשאלות הקשות',
    icon: '🧠',
    earned: false,
    condition: 'הצלחה גבוהה בשאלות קשות'
  }
];

const learningPaths: LearningPath[] = [
  {
    id: 'basics',
    title: 'יסודות המשפט הישראלי',
    description: 'נושאים בסיסיים במקורות המשפט',
    topics: ['חקיקה ראשית', 'חקיקת משנה', 'פסיקה בסיסית', 'מנהגים'],
    difficulty: 'beginner',
    estimatedTime: 120,
    completed: false,
    progress: 0
  },
  {
    id: 'constitutional',
    title: 'משפט חוקתי',
    description: 'חוקי יסוד וזכויות יסוד',
    topics: ['חוקי יסוד', 'זכויות אדם', 'ביקורת חוקתית', 'המהפכה החוקתית'],
    difficulty: 'intermediate',
    estimatedTime: 180,
    completed: false,
    progress: 0
  },
  {
    id: 'advanced_interpretation',
    title: 'פרשנות מתקדמת',
    description: 'שיטות פרשנות וכלים מתקדמים',
    topics: ['פרשנות תכליתית', 'פרשנות דינמית', 'משפט השוואתי', 'עקרונות על-חוקיים'],
    difficulty: 'advanced',
    estimatedTime: 240,
    completed: false,
    progress: 0
  },
  {
    id: 'administrative_law',
    title: 'משפט מנהלי',
    description: 'עקרונות ובקרה על הרשות המבצעת',
    topics: ['חוקיות המנהל', 'סבירות', 'פרופורציונליות', 'ביקורת שיפוטית'],
    difficulty: 'intermediate',
    estimatedTime: 150,
    completed: false,
    progress: 0
  }
];

interface ExamManagerProps {
  onStartExam: (mode: 'practice' | 'timed' | 'comprehensive') => void;
}

export const ExamManager: React.FC<ExamManagerProps> = ({ onStartExam }) => {
  const { trackAnswer } = useTrackAnswer();
  const { dailyQuestions, refresh: refreshEntitlements } = useEntitlements();
  const [selectedTab, setSelectedTab] = useState(0);
  const [examHistory, setExamHistory] = useState<ExamHistory[]>([]);
  const [userAchievements, setUserAchievements] = useState<Achievement[]>(achievements);
  const [showExam, setShowExam] = useState(false);
  const [examMode, setExamMode] = useState<'practice' | 'timed' | 'comprehensive'>('practice');
  const [userStats, setUserStats] = useState({
    totalExams: 0,
    averageScore: 0,
    bestScore: 0,
    totalTimeSpent: 0,
    strongestCategory: '',
    weakestCategory: ''
  });
  const [adaptiveTopicHint, setAdaptiveTopicHint] = useState<string | null>(null);
  const [dailyQuotaNote, setDailyQuotaNote] = useState<string | null>(null);

  // טעינת נתונים מ-localStorage
  useEffect(() => {
    const savedHistory = localStorage.getItem('exam_history');
    if (savedHistory) {
      const history = JSON.parse(savedHistory);
      setExamHistory(history);
      calculateStats(history);
    }

    const savedAchievements = localStorage.getItem('user_achievements');
    if (savedAchievements) {
      setUserAchievements(JSON.parse(savedAchievements));
    }
  }, []);

  useEffect(() => {
    try {
      const t = sessionStorage.getItem('lexstudy_weak_topic');
      if (t) {
        setAdaptiveTopicHint(t);
        sessionStorage.removeItem('lexstudy_weak_topic');
      }
    } catch {
      /* ignore */
    }
  }, []);

  // חישוב סטטיסטיקות
  const calculateStats = (history: ExamHistory[]) => {
    if (history.length === 0) return;

    const totalExams = history.length;
    const averageScore = Math.round(history.reduce((sum, exam) => sum + exam.percentage, 0) / totalExams);
    const bestScore = Math.max(...history.map(exam => exam.percentage));
    const totalTimeSpent = history.reduce((sum, exam) => sum + exam.timeSpent, 0);

    // חישוב קטגוריה חזקה וחלשה
    const categoryStats = new Map<string, { correct: number; total: number }>();
    history.forEach(exam => {
      exam.categoryBreakdown.forEach((stats, category) => {
        const existing = categoryStats.get(category) || { correct: 0, total: 0 };
        existing.correct += stats.correct;
        existing.total += stats.total;
        categoryStats.set(category, existing);
      });
    });

    let strongestCategory = '';
    let weakestCategory = '';
    let highestPercentage = 0;
    let lowestPercentage = 100;

    categoryStats.forEach((stats, category) => {
      const percentage = (stats.correct / stats.total) * 100;
      if (percentage > highestPercentage) {
        highestPercentage = percentage;
        strongestCategory = category;
      }
      if (percentage < lowestPercentage) {
        lowestPercentage = percentage;
        weakestCategory = category;
      }
    });

    setUserStats({
      totalExams,
      averageScore,
      bestScore,
      totalTimeSpent: Math.round(totalTimeSpent),
      strongestCategory,
      weakestCategory
    });
  };

  // השלמת מבחן
  const handleExamComplete = async (results: any) => {
    const newExam: ExamHistory = {
      id: `exam_${Date.now()}`,
      date: new Date(),
      examMode,
      score: results.score,
      percentage: results.percentage,
      totalQuestions: results.totalQuestions,
      correctAnswers: results.correctAnswers,
      timeSpent: results.timeSpent,
      categoryBreakdown: results.categoryBreakdown,
      difficultyBreakdown: results.difficultyBreakdown
    };

    const updatedHistory = [...examHistory, newExam];
    setExamHistory(updatedHistory);
    localStorage.setItem('exam_history', JSON.stringify(updatedHistory));

    // רישום התקדמות אישית לפי נושא (+ מכסה יומית בשרת למשתמשי Free)
    setDailyQuotaNote(null);
    let hitDailyCap = false;
    if (results.categoryBreakdown instanceof Map) {
      outer: for (const [category, stats] of results.categoryBreakdown.entries()) {
        const s = stats as { correct: number; total: number };
        for (let i = 0; i < s.correct; i++) {
          const r = await trackAnswer({
            questionId: `${examMode}_${category}_c_${i}`,
            topic: category,
            subTopic: 'כללי',
            correct: true,
            source: 'exam-manager',
          });
          if (!r.ok) {
            hitDailyCap = true;
            break outer;
          }
        }
        for (let i = 0; i < s.total - s.correct; i++) {
          const r = await trackAnswer({
            questionId: `${examMode}_${category}_w_${i}`,
            topic: category,
            subTopic: 'כללי',
            correct: false,
            source: 'exam-manager',
          });
          if (!r.ok) {
            hitDailyCap = true;
            break outer;
          }
        }
      }
    }
    if (hitDailyCap) {
      setDailyQuotaNote(
        'חלק מהתשובות לא נרשמו בשרת — הגעת למגבלת 20 שאלות ביום במסלול החינם. שדרגי ל-Student Pro לתרגול ללא הגבלה.',
      );
    }
    void refreshEntitlements();

    calculateStats(updatedHistory);
    checkAchievements(newExam, updatedHistory);
    setShowExam(false);
  };

  // בדיקת הישגים
  const checkAchievements = (newExam: ExamHistory, history: ExamHistory[]) => {
    const updatedAchievements = [...userAchievements];
    let hasNewAchievement = false;

    // המבחן הראשון
    if (!updatedAchievements.find(a => a.id === 'first_exam')?.earned && history.length === 1) {
      const achievement = updatedAchievements.find(a => a.id === 'first_exam');
      if (achievement) {
        achievement.earned = true;
        achievement.earnedDate = new Date();
        hasNewAchievement = true;
      }
    }

    // ציון מושלם
    if (!updatedAchievements.find(a => a.id === 'perfect_score')?.earned && newExam.percentage === 100) {
      const achievement = updatedAchievements.find(a => a.id === 'perfect_score');
      if (achievement) {
        achievement.earned = true;
        achievement.earnedDate = new Date();
        hasNewAchievement = true;
      }
    }

    // מבחן מקיף מעל 85%
    if (!updatedAchievements.find(a => a.id === 'comprehensive_master')?.earned && 
        newExam.examMode === 'comprehensive' && newExam.percentage >= 85) {
      const achievement = updatedAchievements.find(a => a.id === 'comprehensive_master');
      if (achievement) {
        achievement.earned = true;
        achievement.earnedDate = new Date();
        hasNewAchievement = true;
      }
    }

    // עקביות - 5 מבחנים ברציפות מעל 80%
    if (!updatedAchievements.find(a => a.id === 'consistency_king')?.earned && history.length >= 5) {
      const lastFive = history.slice(-5);
      if (lastFive.every(exam => exam.percentage >= 80)) {
        const achievement = updatedAchievements.find(a => a.id === 'consistency_king');
        if (achievement) {
          achievement.earned = true;
          achievement.earnedDate = new Date();
          hasNewAchievement = true;
        }
      }
    }

    if (hasNewAchievement) {
      setUserAchievements(updatedAchievements);
      localStorage.setItem('user_achievements', JSON.stringify(updatedAchievements));
    }
  };

  // התחלת מבחן
  const startExam = (mode: 'practice' | 'timed' | 'comprehensive') => {
    setExamMode(mode);
    setShowExam(true);
  };

  // קבלת צבע לפי ציון
  const getScoreColor = (percentage: number) => {
    if (percentage >= 90) return '#4caf50';
    if (percentage >= 80) return '#8bc34a';
    if (percentage >= 70) return '#ffc107';
    if (percentage >= 60) return '#ff9800';
    return '#f44336';
  };

  // פורמט תאריך
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('he-IL', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  if (showExam) {
    return (
      <ComprehensiveLegalExam
        examMode={examMode}
        onComplete={handleExamComplete}
        timeLimit={60}
      />
    );
  }

  return (
    <Box sx={{ maxWidth: 1200, margin: 'auto', p: 3 }}>
      {dailyQuestions?.limit != null && (
        <Alert severity="info" sx={{ mb: 2 }}>
          שאלות היום (מסלול חינם): {dailyQuestions.used} / {dailyQuestions.limit}
        </Alert>
      )}
      {dailyQuotaNote && (
        <Alert severity="warning" sx={{ mb: 2 }} onClose={() => setDailyQuotaNote(null)}>
          {dailyQuotaNote}
        </Alert>
      )}
      {adaptiveTopicHint && (
        <Alert
          severity="info"
          sx={{ mb: 2 }}
          onClose={() => setAdaptiveTopicHint(null)}
        >
          מומלץ לתרגל עכשיו נושא שזוהה כחלש: <strong>{adaptiveTopicHint}</strong>
        </Alert>
      )}
      {/* כותרת */}
      <Card sx={{ mb: 3, background: 'linear-gradient(135deg, #1e88e5 0%, #1565c0 100%)', color: 'white' }}>
        <CardHeader
          title={
            <Typography variant="h4" sx={{ fontWeight: 'bold', textAlign: 'center' }}>
              🏛️ מרכז המבחנים במשפט הישראלי
            </Typography>
          }
          subheader={
            <Typography variant="h6" sx={{ textAlign: 'center', opacity: 0.9 }}>
              בחן את הידע שלך, עקב אחרי ההתקדמות וזכה בהישגים
            </Typography>
          }
        />
      </Card>

      {/* סטטיסטיקות כלליות */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper elevation={2} sx={{ p: 2, textAlign: 'center' }}>
            <Avatar sx={{ bgcolor: '#2196f3', margin: 'auto', mb: 1 }}>
              <QuizIcon />
            </Avatar>
            <Typography variant="h4" color="primary">
              {userStats.totalExams}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              מבחנים שהושלמו
            </Typography>
          </Paper>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Paper elevation={2} sx={{ p: 2, textAlign: 'center' }}>
            <Avatar sx={{ bgcolor: '#4caf50', margin: 'auto', mb: 1 }}>
              <ProgressIcon />
            </Avatar>
            <Typography variant="h4" color="success.main">
              {userStats.averageScore}%
            </Typography>
            <Typography variant="body2" color="text.secondary">
              ציון ממוצע
            </Typography>
          </Paper>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Paper elevation={2} sx={{ p: 2, textAlign: 'center' }}>
            <Avatar sx={{ bgcolor: '#ff9800', margin: 'auto', mb: 1 }}>
              <TrophyIcon />
            </Avatar>
            <Typography variant="h4" color="warning.main">
              {userStats.bestScore}%
            </Typography>
            <Typography variant="body2" color="text.secondary">
              הציון הטוב ביותר
            </Typography>
          </Paper>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Paper elevation={2} sx={{ p: 2, textAlign: 'center' }}>
            <Avatar sx={{ bgcolor: '#9c27b0', margin: 'auto', mb: 1 }}>
              <TimerIcon />
            </Avatar>
            <Typography variant="h4" color="secondary.main">
              {userStats.totalTimeSpent}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              דקות למידה
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* טאבים */}
      <Card>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs 
            value={selectedTab} 
            onChange={(_, newValue) => setSelectedTab(newValue)}
            variant="fullWidth"
          >
            <Tab icon={<QuizIcon />} label="מבחנים חדשים" />
            <Tab icon={<HistoryIcon />} label="היסטוריית מבחנים" />
            <Tab icon={<TrophyIcon />} label="הישגים" />
            <Tab icon={<LearnIcon />} label="מסלולי למידה" />
          </Tabs>
        </Box>

        {/* טאב מבחנים חדשים */}
        {selectedTab === 0 && (
          <CardContent>
            <Typography variant="h6" gutterBottom color="primary">
              🎯 בחר סוג מבחן
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <Card 
                  variant="outlined" 
                  sx={{ 
                    cursor: 'pointer', 
                    '&:hover': { bgcolor: '#f5f5f5', transform: 'translateY(-2px)' },
                    transition: 'all 0.3s'
                  }}
                  onClick={() => startExam('practice')}
                >
                  <CardContent>
                    <Box textAlign="center">
                      <Avatar sx={{ bgcolor: '#4caf50', margin: 'auto', mb: 2, width: 64, height: 64 }}>
                        <LearnIcon sx={{ fontSize: 32 }} />
                      </Avatar>
                      <Typography variant="h6" gutterBottom>
                        מבחן תרגול
                      </Typography>
                      <Typography variant="body2" color="text.secondary" paragraph>
                        10 שאלות מגוונות עם הסברים מפורטים
                      </Typography>
                      <Box display="flex" flexWrap="wrap" gap={1} justifyContent="center">
                        <Chip label="ללא לחץ זמן" size="small" />
                        <Chip label="עם הסברים" size="small" />
                        <Chip label="לכל הרמות" size="small" />
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <Card 
                  variant="outlined" 
                  sx={{ 
                    cursor: 'pointer', 
                    '&:hover': { bgcolor: '#f5f5f5', transform: 'translateY(-2px)' },
                    transition: 'all 0.3s'
                  }}
                  onClick={() => startExam('timed')}
                >
                  <CardContent>
                    <Box textAlign="center">
                      <Avatar sx={{ bgcolor: '#ff9800', margin: 'auto', mb: 2, width: 64, height: 64 }}>
                        <TimerIcon sx={{ fontSize: 32 }} />
                      </Avatar>
                      <Typography variant="h6" gutterBottom>
                        מבחן מתוזמן
                      </Typography>
                      <Typography variant="body2" color="text.secondary" paragraph>
                        10 שאלות במגבלת זמן של 60 דקות
                      </Typography>
                      <Box display="flex" flexWrap="wrap" gap={1} justifyContent="center">
                        <Chip label="60 דקות" size="small" color="warning" />
                        <Chip label="לחץ זמן" size="small" color="warning" />
                        <Chip label="אתגר" size="small" color="warning" />
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <Card 
                  variant="outlined" 
                  sx={{ 
                    cursor: 'pointer', 
                    '&:hover': { bgcolor: '#f5f5f5', transform: 'translateY(-2px)' },
                    transition: 'all 0.3s'
                  }}
                  onClick={() => startExam('comprehensive')}
                >
                  <CardContent>
                    <Box textAlign="center">
                      <Avatar sx={{ bgcolor: '#f44336', margin: 'auto', mb: 2, width: 64, height: 64 }}>
                        <TrophyIcon sx={{ fontSize: 32 }} />
                      </Avatar>
                      <Typography variant="h6" gutterBottom>
                        מבחן מקיף
                      </Typography>
                      <Typography variant="body2" color="text.secondary" paragraph>
                        50 שאלות מכל הרמות והנושאים
                      </Typography>
                      <Box display="flex" flexWrap="wrap" gap={1} justifyContent="center">
                        <Chip label="50 שאלות" size="small" color="error" />
                        <Chip label="כל הנושאים" size="small" color="error" />
                        <Chip label="מאתגר" size="small" color="error" />
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            {userStats.strongestCategory && userStats.weakestCategory && (
              <Alert severity="info" sx={{ mt: 3 }}>
                <Typography variant="body2">
                  💡 <strong>טיפ אישי:</strong> הנושא החזק שלך הוא "{userStats.strongestCategory}" 
                  והנושא שצריך חיזוק הוא "{userStats.weakestCategory}". 
                  מומלץ להתמקד בנושאים החלשים יותר.
                </Typography>
              </Alert>
            )}
          </CardContent>
        )}

        {/* טאב היסטוריית מבחנים */}
        {selectedTab === 1 && (
          <CardContent>
            <Typography variant="h6" gutterBottom color="primary">
              📈 היסטוריית המבחנים שלך
            </Typography>
            
            {examHistory.length === 0 ? (
              <Paper elevation={1} sx={{ p: 4, textAlign: 'center' }}>
                <QuizIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  עדיין לא ביצעת מבחנים
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  התחל עם המבחן הראשון שלך כדי לעקוב אחרי ההתקדמות!
                </Typography>
              </Paper>
            ) : (
              <TableContainer component={Paper} elevation={1}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>תאריך</TableCell>
                      <TableCell>סוג מבחן</TableCell>
                      <TableCell align="center">ציון</TableCell>
                      <TableCell align="center">שאלות נכונות</TableCell>
                      <TableCell align="center">זמן</TableCell>
                      <TableCell align="center">מצב</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {examHistory
                      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                      .slice(0, 10)
                      .map((exam) => (
                        <TableRow key={exam.id}>
                          <TableCell>
                            {formatDate(new Date(exam.date))}
                          </TableCell>
                          <TableCell>
                            <Chip 
                              label={
                                exam.examMode === 'practice' ? 'תרגול' :
                                exam.examMode === 'timed' ? 'מתוזמן' : 'מקיף'
                              }
                              size="small"
                              color={
                                exam.examMode === 'practice' ? 'success' :
                                exam.examMode === 'timed' ? 'warning' : 'error'
                              }
                            />
                          </TableCell>
                          <TableCell align="center">
                            <Typography 
                              variant="body2" 
                              fontWeight="bold"
                              sx={{ color: getScoreColor(exam.percentage) }}
                            >
                              {exam.percentage}%
                            </Typography>
                          </TableCell>
                          <TableCell align="center">
                            {exam.correctAnswers}/{exam.totalQuestions}
                          </TableCell>
                          <TableCell align="center">
                            {exam.timeSpent} דק'
                          </TableCell>
                          <TableCell align="center">
                            {exam.percentage >= 80 ? 
                              <CorrectIcon color="success" /> : 
                              exam.percentage >= 60 ?
                              <InfoIcon color="warning" /> :
                              <WrongIcon color="error" />
                            }
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </CardContent>
        )}

        {/* טאב הישגים */}
        {selectedTab === 2 && (
          <CardContent>
            <Typography variant="h6" gutterBottom color="primary">
              🏆 ההישגים שלך
            </Typography>
            
            <Grid container spacing={3}>
              {userAchievements.map((achievement) => (
                <Grid item xs={12} sm={6} md={4} key={achievement.id}>
                  <Card 
                    variant="outlined"
                    sx={{ 
                      opacity: achievement.earned ? 1 : 0.6,
                      border: achievement.earned ? '2px solid #4caf50' : undefined
                    }}
                  >
                    <CardContent>
                      <Box textAlign="center">
                        <Typography variant="h3" component="div" sx={{ mb: 1 }}>
                          {achievement.icon}
                        </Typography>
                        <Typography variant="h6" gutterBottom>
                          {achievement.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" paragraph>
                          {achievement.description}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {achievement.condition}
                        </Typography>
                        {achievement.earned && achievement.earnedDate && (
                          <Typography variant="caption" display="block" color="success.main" sx={{ mt: 1 }}>
                            ✅ הושג ב-{formatDate(achievement.earnedDate)}
                          </Typography>
                        )}
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        )}

        {/* טאב מסלולי למידה */}
        {selectedTab === 3 && (
          <CardContent>
            <Typography variant="h6" gutterBottom color="primary">
              🛤️ מסלולי למידה מומלצים
            </Typography>
            
            <Typography variant="body2" color="text.secondary" paragraph>
              מסלולי למידה מובנים המותאמים לרמות שונות ומתמקדים בנושאים ספציפיים
            </Typography>
            
            <Grid container spacing={3}>
              {learningPaths.map((path) => (
                <Grid item xs={12} md={6} key={path.id}>
                  <Card variant="outlined">
                    <CardContent>
                      <Box display="flex" justifyContent="between" alignItems="start" mb={2}>
                        <Box>
                          <Typography variant="h6" gutterBottom>
                            {path.title}
                          </Typography>
                          <Chip 
                            label={
                              path.difficulty === 'beginner' ? 'מתחיל' :
                              path.difficulty === 'intermediate' ? 'בינוני' : 'מתקדם'
                            }
                            size="small"
                            color={
                              path.difficulty === 'beginner' ? 'success' :
                              path.difficulty === 'intermediate' ? 'warning' : 'error'
                            }
                          />
                        </Box>
                        <Typography variant="caption" color="text.secondary">
                          {path.estimatedTime} דק'
                        </Typography>
                      </Box>
                      
                      <Typography variant="body2" color="text.secondary" paragraph>
                        {path.description}
                      </Typography>
                      
                      <Typography variant="subtitle2" gutterBottom>
                        נושאים:
                      </Typography>
                      <Box display="flex" flexWrap="wrap" gap={1} mb={2}>
                        {path.topics.map((topic, index) => (
                          <Chip key={index} label={topic} size="small" variant="outlined" />
                        ))}
                      </Box>
                      
                      <LinearProgress 
                        variant="determinate" 
                        value={path.progress}
                        sx={{ mb: 2 }}
                      />
                      <Typography variant="caption" color="text.secondary">
                        התקדמות: {path.progress}%
                      </Typography>
                      
                      <Box mt={2}>
                        <Button 
                          variant={path.completed ? "outlined" : "contained"}
                          size="small"
                          disabled={path.completed}
                        >
                          {path.completed ? 'הושלם' : 'התחל מסלול'}
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        )}
      </Card>
    </Box>
  );
};

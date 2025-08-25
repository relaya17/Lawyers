import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  Box, 
  Alert,
  Button,
  Chip,
  Paper,
  LinearProgress,
  Divider,
  Collapse,
  Zoom,
  Slide
} from '@mui/material';
import { 
  CheckCircle as CheckIcon,
  Cancel as WrongIcon,
  Lightbulb as LightbulbIcon,
  School as SchoolIcon,
  Timer as TimerIcon,
  TrendingUp as TrendingUpIcon,
  BookmarkAdd as BookmarkIcon
} from '@mui/icons-material';

interface FeedbackProps {
  isCorrect: boolean;
  userAnswer: string;
  correctAnswer: string;
  explanation: string;
  timeSpent: number;
  difficulty: 'easy' | 'medium' | 'hard' | 'very-hard';
  topic: string;
  relatedSources?: LegalSource[];
  tips?: string[];
  nextSteps?: string[];
  onContinue: () => void;
  onBookmark?: () => void;
  onReviewTopic?: () => void;
}

interface LegalSource {
  type: 'law' | 'precedent' | 'custom' | 'regulation';
  title: string;
  content: string;
  icon: string;
  color: string;
}

const feedbackConfig = {
  correct: {
    color: '#4caf50',
    bgColor: '#e8f5e8',
    icon: <CheckIcon />,
    title: '🎉 תשובה נכונה!',
    messages: [
      'מעולה! הבנת את הנושא היטב',
      'פתרון מושלם! אתה בדרך הנכונה',
      'כל הכבוד! הידע שלך מרשים',
      'נהדר! התשובה מדויקת לחלוטין'
    ]
  },
  incorrect: {
    color: '#f44336',
    bgColor: '#ffebee', 
    icon: <WrongIcon />,
    title: '❌ תשובה שגויה',
    messages: [
      'לא נורא, זה חלק מהלמידה',
      'טעות היא הזדמנות ללמוד',
      'כל טעות מקרבת אותנו להצלחה',
      'נסה שוב, אתה יכול!'
    ]
  }
};

const difficultyPoints = {
  easy: 10,
  medium: 20,
  hard: 30,
  'very-hard': 50
};

export const InstantFeedback: React.FC<FeedbackProps> = ({
  isCorrect,
  userAnswer,
  correctAnswer,
  explanation,
  timeSpent,
  difficulty,
  topic,
  relatedSources = [],
  tips = [],
  nextSteps = [],
  onContinue,
  onBookmark,
  onReviewTopic
}) => {
  const [showDetails, setShowDetails] = useState(false);
  const [animationComplete, setAnimationComplete] = useState(false);
  const [scoreAnimation, setScoreAnimation] = useState(0);

  const config = isCorrect ? feedbackConfig.correct : feedbackConfig.incorrect;
  const randomMessage = config.messages[Math.floor(Math.random() * config.messages.length)];
  const pointsEarned = isCorrect ? difficultyPoints[difficulty] : 0;
  const timeBonus = isCorrect && timeSpent < 30 ? Math.floor((30 - timeSpent) / 3) : 0;
  const totalPoints = pointsEarned + timeBonus;

  useEffect(() => {
    // אנימציית ציון
    const timer = setTimeout(() => {
      setAnimationComplete(true);
      if (isCorrect) {
        let current = 0;
        const increment = totalPoints / 20;
        const scoreTimer = setInterval(() => {
          current += increment;
          if (current >= totalPoints) {
            setScoreAnimation(totalPoints);
            clearInterval(scoreTimer);
          } else {
            setScoreAnimation(Math.floor(current));
          }
        }, 50);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [isCorrect, totalPoints]);

  const getTimeMessage = () => {
    if (timeSpent < 10) return '⚡ מהירות מדהימה!';
    if (timeSpent < 20) return '🚀 מהירות טובה';
    if (timeSpent < 30) return '⏱️ זמן סביר';
    return '🐌 אולי כדאי להאיץ קצת';
  };

  return (
    <Zoom in={true} timeout={500}>
      <Card 
        sx={{ 
          maxWidth: 800,
          margin: 'auto',
          mt: 3,
          border: `3px solid ${config.color}`,
          backgroundColor: config.bgColor
        }}
      >
        <CardContent sx={{ p: 4 }}>
          {/* כותרת ראשית */}
          <Box display="flex" alignItems="center" justifyContent="center" gap={2} mb={3}>
            <Box sx={{ fontSize: '3rem', color: config.color }}>
              {config.icon}
            </Box>
            <Typography variant="h4" sx={{ color: config.color, fontWeight: 'bold' }}>
              {config.title}
            </Typography>
          </Box>

          {/* הודעה מעודדת */}
          <Typography 
            variant="h6" 
            sx={{ 
              textAlign: 'center', 
              mb: 3,
              fontStyle: 'italic',
              color: 'text.secondary'
            }}
          >
            {randomMessage}
          </Typography>

          {/* סטטיסטיקות מהירות */}
          <Box display="flex" justifyContent="center" gap={3} mb={3}>
            <Chip 
              icon={<TimerIcon />}
              label={`${timeSpent} שניות`}
              color={timeSpent < 20 ? 'success' : timeSpent < 40 ? 'warning' : 'default'}
              size="medium"
            />
            <Chip 
              label={getTimeMessage()}
              color={timeSpent < 20 ? 'success' : 'default'}
              size="medium"
            />
            {isCorrect && (
              <Chip 
                icon={<TrendingUpIcon />}
                label={`+${scoreAnimation} נקודות`}
                color="success"
                size="medium"
                sx={{ fontWeight: 'bold' }}
              />
            )}
          </Box>

          {/* תשובות */}
          <Box mb={3}>
            {!isCorrect && (
              <Alert severity="info" sx={{ mb: 2 }}>
                <Typography variant="body1">
                  <strong>התשובה שלך:</strong> {userAnswer}
                </Typography>
              </Alert>
            )}
            <Alert severity={isCorrect ? 'success' : 'warning'}>
              <Typography variant="body1">
                <strong>התשובה הנכונה:</strong> {correctAnswer}
              </Typography>
            </Alert>
          </Box>

          {/* הסבר מפורט */}
          <Paper 
            elevation={2} 
            sx={{ 
              p: 3, 
              mb: 3,
              backgroundColor: 'white',
              border: `1px solid ${config.color}40`
            }}
          >
            <Box display="flex" alignItems="center" gap={1} mb={2}>
              <SchoolIcon sx={{ color: config.color }} />
              <Typography variant="h6" sx={{ color: config.color }}>
                הסבר מפורט
              </Typography>
            </Box>
            <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
              {explanation}
            </Typography>
          </Paper>

          {/* כפתור לפרטים נוספים */}
          <Box display="flex" justifyContent="center" mb={3}>
            <Button
              variant="outlined"
              onClick={() => setShowDetails(!showDetails)}
              sx={{ 
                borderColor: config.color,
                color: config.color,
                '&:hover': { backgroundColor: `${config.color}10` }
              }}
            >
              {showDetails ? 'הסתר פרטים' : 'הצג פרטים נוספים'}
            </Button>
          </Box>

          {/* פרטים נוספים */}
          <Collapse in={showDetails}>
            <Box>
              {/* מקורות משפטיים */}
              {relatedSources.length > 0 && (
                <Box mb={3}>
                  <Typography variant="h6" gutterBottom sx={{ color: config.color }}>
                    📚 מקורות משפטיים רלוונטיים
                  </Typography>
                  {relatedSources.map((source, index) => (
                    <Paper key={index} elevation={1} sx={{ p: 2, mb: 2 }}>
                      <Box display="flex" alignItems="center" gap={1} mb={1}>
                        <span style={{ fontSize: '1.2rem' }}>{source.icon}</span>
                        <Typography variant="subtitle1" fontWeight="bold">
                          {source.title}
                        </Typography>
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        {source.content}
                      </Typography>
                    </Paper>
                  ))}
                </Box>
              )}

              {/* טיפים */}
              {tips.length > 0 && (
                <Box mb={3}>
                  <Typography variant="h6" gutterBottom sx={{ color: config.color }}>
                    💡 טיפים לזכירה
                  </Typography>
                  {tips.map((tip, index) => (
                    <Paper 
                      key={index} 
                      elevation={1} 
                      sx={{ 
                        p: 2, 
                        mb: 1,
                        backgroundColor: '#fff3e0',
                        borderRight: `3px solid #ff9800`
                      }}
                    >
                      <Typography variant="body2">🎯 {tip}</Typography>
                    </Paper>
                  ))}
                </Box>
              )}

              {/* צעדים הבאים */}
              {nextSteps.length > 0 && (
                <Box mb={3}>
                  <Typography variant="h6" gutterBottom sx={{ color: config.color }}>
                    🎯 מה הלאה?
                  </Typography>
                  {nextSteps.map((step, index) => (
                    <Chip 
                      key={index}
                      label={step}
                      variant="outlined"
                      sx={{ mr: 1, mb: 1 }}
                    />
                  ))}
                </Box>
              )}
            </Box>
          </Collapse>

          <Divider sx={{ mb: 3 }} />

          {/* כפתורי פעולה */}
          <Box display="flex" justifyContent="center" gap={2} flexWrap="wrap">
            <Button
              variant="contained"
              onClick={onContinue}
              sx={{ 
                backgroundColor: config.color,
                '&:hover': { backgroundColor: `${config.color}dd` },
                minWidth: 150
              }}
            >
              המשך
            </Button>

            {onBookmark && (
              <Button
                variant="outlined"
                startIcon={<BookmarkIcon />}
                onClick={onBookmark}
                sx={{ borderColor: config.color, color: config.color }}
              >
                שמור לחזרה
              </Button>
            )}

            {!isCorrect && onReviewTopic && (
              <Button
                variant="outlined"
                startIcon={<SchoolIcon />}
                onClick={onReviewTopic}
                sx={{ borderColor: config.color, color: config.color }}
              >
                חזור על הנושא
              </Button>
            )}
          </Box>
        </CardContent>
      </Card>
    </Zoom>
  );
};

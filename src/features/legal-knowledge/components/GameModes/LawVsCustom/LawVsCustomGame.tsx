import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  Typography, 
  Button, 
  Box, 
  Chip, 
  Paper,
  LinearProgress,
  Alert,
  Grid
} from '@mui/material';
import { 
  MenuBook as LawIcon,
  AutoFixHigh as CustomIcon,
  Gavel as PrecedentIcon,
  AccountBalance as BasicLawIcon,
  EmojiEvents as TrophyIcon
} from '@mui/icons-material';
import { LegalHierarchy } from '../../../types';

interface LawVsCustomGameProps {
  onGameComplete: (score: number, totalQuestions: number) => void;
}

interface GameQuestion {
  id: string;
  scenario: string;
  conflictingSources: ConflictingSource[];
  correctAnswer: 'basic-law' | 'regular-law' | 'precedent' | 'custom';
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard' | 'very-hard';
}

interface ConflictingSource {
  type: 'basic-law' | 'regular-law' | 'precedent' | 'custom';
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

const sourceConfig = {
  'basic-law': {
    icon: <BasicLawIcon />,
    color: '#d32f2f',
    label: 'חוק יסוד',
    priority: 1
  },
  'regular-law': {
    icon: <LawIcon />,
    color: '#1976d2',
    label: 'חוק רגיל',
    priority: 2
  },
  'precedent': {
    icon: <PrecedentIcon />,
    color: '#7b1fa2',
    label: 'פסיקה',
    priority: 3
  },
  'custom': {
    icon: <CustomIcon />,
    color: '#f57c00',
    label: 'מנהג',
    priority: 4
  }
};

// דוגמאות שאלות למשחק
const sampleQuestions: GameQuestion[] = [
  {
    id: '1',
    scenario: 'התנגשות בין חוק הכנסת שמאפשר הפגנות לבין חוק יסוד כבוד האדם וחירותו המגביל אותן במקרים מסוימים',
    conflictingSources: [
      {
        type: 'basic-law',
        title: 'חוק יסוד: כבוד האדם וחירותו',
        description: 'מגביל הפגנות כאשר הן פוגעות בביטחון הציבור',
        icon: sourceConfig['basic-law'].icon,
        color: sourceConfig['basic-law'].color
      },
      {
        type: 'regular-law',
        title: 'חוק הכנסת',
        description: 'מאפשר הפגנות ללא הגבלות מיוחדות',
        icon: sourceConfig['regular-law'].icon,
        color: sourceConfig['regular-law'].color
      }
    ],
    correctAnswer: 'basic-law',
    explanation: 'חוק יסוד עדיף על חוק רגיל. חוקי היסוד הם החוקה של ישראל ויש להם עליונות על חקיקה רגילה.',
    difficulty: 'medium'
  },
  {
    id: '2',
    scenario: 'מנהג עתיק בקהילה מסוימת לחלוקת רכוש לעומת חוק הירושה הישראלי',
    conflictingSources: [
      {
        type: 'custom',
        title: 'מנהג קהילתי עתיק',
        description: 'חלוקת רכוש על פי מסורת של מאות שנים',
        icon: sourceConfig['custom'].icon,
        color: sourceConfig['custom'].color
      },
      {
        type: 'regular-law',
        title: 'חוק הירושה',
        description: 'קובע כללים ברורים לחלוקת רכוש',
        icon: sourceConfig['regular-law'].icon,
        color: sourceConfig['regular-law'].color
      }
    ],
    correctAnswer: 'regular-law',
    explanation: 'חוק רגיל עדיף על מנהג. למרות חשיבות המנהגים, חקיקה ברורה גוברת עליהם במקרי התנגשות.',
    difficulty: 'easy'
  },
  {
    id: '3',
    scenario: 'פסיקת בית המשפט העליון מול חוק חדש שמנסה לעקוף אותה',
    conflictingSources: [
      {
        type: 'precedent',
        title: 'פסיקת בג"ץ',
        description: 'פסיקה שיפוטית מחייבת מבית המשפט העליון',
        icon: sourceConfig['precedent'].icon,
        color: sourceConfig['precedent'].color
      },
      {
        type: 'regular-law',
        title: 'חוק חדש',
        description: 'חקיקה שמנסה לשנות את המצב המשפטי',
        icon: sourceConfig['regular-law'].icon,
        color: sourceConfig['regular-law'].color
      }
    ],
    correctAnswer: 'regular-law',
    explanation: 'חוק חדש יכול לשנות פסיקה קודמת, אך בית המשפט יכול לבחון את חוקתיותו. זהו נושא מורכב בהפרדת הרשויות.',
    difficulty: 'hard'
  }
];

export const LawVsCustomGame: React.FC<LawVsCustomGameProps> = ({ onGameComplete }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30); // 30 שניות לכל שאלה

  useEffect(() => {
    if (timeLeft > 0 && !showResult && !gameCompleted) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !showResult) {
      handleAnswer(''); // תשובה ריקה אם הזמן נגמר
    }
  }, [timeLeft, showResult, gameCompleted]);

  const handleAnswer = (answer: string) => {
    setSelectedAnswer(answer);
    setShowResult(true);
    
    if (answer === sampleQuestions[currentQuestion].correctAnswer) {
      const timeBonus = Math.floor(timeLeft / 3); // בונוס על מהירות
      setScore(score + 10 + timeBonus);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestion < sampleQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowResult(false);
      setTimeLeft(30);
    } else {
      setGameCompleted(true);
      onGameComplete(score, sampleQuestions.length);
    }
  };

  const currentQ = sampleQuestions[currentQuestion];
  const progress = ((currentQuestion + 1) / sampleQuestions.length) * 100;

  if (gameCompleted) {
    return (
      <Card sx={{ maxWidth: 600, margin: 'auto', mt: 4 }}>
        <CardContent sx={{ textAlign: 'center', p: 4 }}>
          <TrophyIcon sx={{ fontSize: 80, color: 'gold', mb: 2 }} />
          <Typography variant="h4" gutterBottom>
            משחק הושלם!
          </Typography>
          <Typography variant="h5" color="primary" gutterBottom>
            הציון שלך: {score} נקודות
          </Typography>
          <Typography variant="body1" paragraph>
            עניתי נכון על {Math.floor(score / 10)} מתוך {sampleQuestions.length} שאלות
          </Typography>
          <Button variant="contained" onClick={() => window.location.reload()}>
            משחק חדש
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card sx={{ maxWidth: 800, margin: 'auto', mt: 2 }}>
      <CardHeader
        title={
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h5">🧩 חוק נגד מנהג</Typography>
            <Box display="flex" gap={2} alignItems="center">
              <Chip label={`שאלה ${currentQuestion + 1}/${sampleQuestions.length}`} />
              <Chip 
                label={`${timeLeft}s`} 
                color={timeLeft <= 10 ? 'error' : 'primary'} 
              />
              <Chip label={`${score} נקודות`} color="success" />
            </Box>
          </Box>
        }
      />
      
      <CardContent>
        <LinearProgress variant="determinate" value={progress} sx={{ mb: 3 }} />
        
        <Typography variant="h6" gutterBottom color="primary">
          ⚖️ מה גובר במקרה הזה?
        </Typography>
        
        <Paper elevation={1} sx={{ p: 3, mb: 3, backgroundColor: '#f8f9fa' }}>
          <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
            {currentQ.scenario}
          </Typography>
        </Paper>

        <Typography variant="h6" gutterBottom>
          בחר את המקור המשפטי החזק יותר:
        </Typography>

        <Grid container spacing={2}>
          {currentQ.conflictingSources.map((source, index) => (
            <Grid item xs={12} md={6} key={index}>
              <Paper 
                elevation={selectedAnswer === source.type ? 3 : 1}
                sx={{ 
                  p: 2, 
                  cursor: showResult ? 'default' : 'pointer',
                  border: selectedAnswer === source.type ? `2px solid ${source.color}` : '1px solid #e0e0e0',
                  backgroundColor: showResult && selectedAnswer === source.type ? 
                    (selectedAnswer === currentQ.correctAnswer ? '#e8f5e8' : '#ffebee') : 'white',
                  '&:hover': !showResult ? { 
                    backgroundColor: '#f5f5f5',
                    transform: 'translateY(-2px)',
                    transition: 'all 0.2s ease'
                  } : {}
                }}
                onClick={() => !showResult && handleAnswer(source.type)}
              >
                <Box display="flex" alignItems="center" gap={1} mb={1}>
                  <Box sx={{ color: source.color }}>
                    {source.icon}
                  </Box>
                  <Typography variant="h6" sx={{ color: source.color }}>
                    {sourceConfig[source.type].label}
                  </Typography>
                </Box>
                <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
                  {source.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {source.description}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>

        {showResult && (
          <Box sx={{ mt: 3 }}>
            <Alert severity={selectedAnswer === currentQ.correctAnswer ? 'success' : 'error'}>
              <Typography variant="h6">
                {selectedAnswer === currentQ.correctAnswer ? '✅ נכון!' : '❌ לא נכון'}
              </Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>
                התשובה הנכונה: {sourceConfig[currentQ.correctAnswer].label}
              </Typography>
            </Alert>
            
            <Paper elevation={1} sx={{ p: 2, mt: 2, backgroundColor: '#f0f8ff' }}>
              <Typography variant="body1">
                <strong>הסבר:</strong> {currentQ.explanation}
              </Typography>
            </Paper>

            <Box sx={{ textAlign: 'center', mt: 3 }}>
              <Button 
                variant="contained" 
                onClick={handleNextQuestion}
                size="large"
              >
                {currentQuestion < sampleQuestions.length - 1 ? 'שאלה הבאה' : 'סיים משחק'}
              </Button>
            </Box>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

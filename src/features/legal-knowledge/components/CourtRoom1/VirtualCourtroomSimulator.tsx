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
  Grid,
  Avatar,
  Divider
} from '@mui/material';
import { 
  AccountBalance as CourtIcon,
  Gavel as GavelIcon,
  MenuBook as LawIcon,
  AutoFixHigh as CustomIcon,
  Timer as TimerIcon,
  Person as JudgeIcon,
  EmojiEvents as TrophyIcon
} from '@mui/icons-material';

interface CourtCase {
  id: string;
  title: string;
  petition: string;
  facts: string[];
  conflictingSources: LegalSource[];
  correctSource: 'basic-law' | 'regular-law' | 'precedent' | 'custom';
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard' | 'very-hard';
  timeLimit: number; // בשניות
  complexity: 'simple' | 'conflicting' | 'complex';
}

interface LegalSource {
  type: 'basic-law' | 'regular-law' | 'precedent' | 'custom';
  title: string;
  content: string;
  priority: number;
  icon: React.ReactNode;
  color: string;
}

const legalSources = {
  'basic-law': {
    icon: <CourtIcon />,
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
    icon: <GavelIcon />,
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

// דוגמאות מקרים לסימולציה
const sampleCases: CourtCase[] = [
  {
    id: '1',
    title: 'עתירה נגד הגבלת חופש הביטוי',
    petition: 'עותרים פונים נגד צו איסור הפגנה בכיכר ציון בירושלים',
    facts: [
      'העירייה הוציאה צו איסור הפגנה באזור מסוים',
      'הצו מבוסס על חוק סדר ציבורי משנת 1970',
      'העותרים טוענים לפגיעה בחופש הביטוי',
      'קיים חוק יסוד כבוד האדם וחירותו המגן על חופש הביטוי'
    ],
    conflictingSources: [
      {
        type: 'basic-law',
        title: 'חוק יסוד: כבוד האדם וחירותו',
        content: 'כל אדם זכאי לחופש ביטוי',
        priority: 1,
        icon: legalSources['basic-law'].icon,
        color: legalSources['basic-law'].color
      },
      {
        type: 'regular-law',
        title: 'חוק סדר ציבורי (1970)',
        content: 'הרשות המקומית רשאית להגביל הפגנות לשמירה על הסדר',
        priority: 2,
        icon: legalSources['regular-law'].icon,
        color: legalSources['regular-law'].color
      }
    ],
    correctSource: 'basic-law',
    explanation: 'חוק יסוד עדיף על חוק רגיל. אמנם יש צורך בשמירה על הסדר, אך הגבלה גורפת של חופש הביטוי סותרת את חוק היסוד. יש לבחון איזון בין הערכים.',
    difficulty: 'medium',
    timeLimit: 45,
    complexity: 'conflicting'
  },
  {
    id: '2',
    title: 'סכסוך ירושה בקהילה דרוזית',
    petition: 'יורשים דרוזים דורשים חלוקת ירושה לפי המנהג הדרוזי',
    facts: [
      'אב דרוזי נפטר והותיר רכוש',
      'קיים מנהג דרוזי עתיק לחלוקת ירושה',
      'חוק הירושה הישראלי קובע חלוקה שונה',
      'המשפחה חיה לפי המנהג במשך דורות'
    ],
    conflictingSources: [
      {
        type: 'regular-law',
        title: 'חוק הירושה הישראלי',
        content: 'קובע חלוקה שווה בין כל היורשים',
        priority: 2,
        icon: legalSources['regular-law'].icon,
        color: legalSources['regular-law'].color
      },
      {
        type: 'custom',
        title: 'מנהג דרוזי מסורתי',
        content: 'חלוקה מיוחדת לפי מסורת דתית',
        priority: 4,
        icon: legalSources['custom'].icon,
        color: legalSources['custom'].color
      }
    ],
    correctSource: 'regular-law',
    explanation: 'למרות חשיבות המנהג הדרוזי, בענייני ירושה החוק הישראלי גובר. עם זאת, בפועל לעיתים יש מקום לפשרה המכבדת את המנהג במסגרת החוק.',
    difficulty: 'hard',
    timeLimit: 60,
    complexity: 'complex'
  },
  {
    id: '3',
    title: 'עתירה נגד חוק פיקדון בקבוק',
    petition: 'יצרני משקאות עותרים נגד חוק פיקדון חדש',
    facts: [
      'הכנסת העבירה חוק פיקדון בקבוק חדש',
      'החוק פוגע בחופש העיסוק של היצרנים',
      'קיימת פסיקה קודמת שהגנה על חופש העיסוק',
      'החוק נועד להגן על הסביבה'
    ],
    conflictingSources: [
      {
        type: 'regular-law',
        title: 'חוק פיקדון בקבוק (2023)',
        content: 'מחייב פיקדון על כל בקבוק',
        priority: 2,
        icon: legalSources['regular-law'].icon,
        color: legalSources['regular-law'].color
      },
      {
        type: 'precedent',
        title: 'פסיקת בג"ץ בעניין חופש עיסוק',
        content: 'הגנה חזקה על חופש העיסוק',
        priority: 3,
        icon: legalSources['precedent'].icon,
        color: legalSources['precedent'].color
      }
    ],
    correctSource: 'regular-law',
    explanation: 'חוק חדש יכול לשנות מצב משפטי קיים, גם אם יש פסיקה קודמת. בית המשפט יבחן את סבירות החוק ואת האיזון בין האינטרסים השונים.',
    difficulty: 'very-hard',
    timeLimit: 30,
    complexity: 'conflicting'
  }
];

interface VirtualCourtroomSimulatorProps {
  onCaseComplete: (caseId: string, correct: boolean, timeUsed: number) => void;
}

export const VirtualCourtroomSimulator: React.FC<VirtualCourtroomSimulatorProps> = ({
  onCaseComplete
}) => {
  const [currentCase, setCurrentCase] = useState(0);
  const [selectedSource, setSelectedSource] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [timeLeft, setTimeLeft] = useState(sampleCases[0].timeLimit);
  const [caseStartTime, setCaseStartTime] = useState(Date.now());
  const [sessionScore, setSessionScore] = useState(0);
  const [sessionCompleted, setSessionCompleted] = useState(false);

  const currentCaseData = sampleCases[currentCase];

  useEffect(() => {
    setCaseStartTime(Date.now());
    setTimeLeft(currentCaseData.timeLimit);
  }, [currentCase, currentCaseData.timeLimit]);

  useEffect(() => {
    if (timeLeft > 0 && !showResult && !sessionCompleted) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !showResult) {
      handleSourceSelection(''); // זמן נגמר
    }
  }, [timeLeft, showResult, sessionCompleted]);

  const handleSourceSelection = (sourceType: string) => {
    setSelectedSource(sourceType);
    setShowResult(true);
    
    const timeUsed = currentCaseData.timeLimit - timeLeft;
    const isCorrect = sourceType === currentCaseData.correctSource;
    
    if (isCorrect) {
      const timeBonus = Math.max(0, Math.floor((timeLeft / currentCaseData.timeLimit) * 20));
      setSessionScore(sessionScore + 100 + timeBonus);
    }
    
    onCaseComplete(currentCaseData.id, isCorrect, timeUsed);
  };

  const handleNextCase = () => {
    if (currentCase < sampleCases.length - 1) {
      setCurrentCase(currentCase + 1);
      setSelectedSource(null);
      setShowResult(false);
    } else {
      setSessionCompleted(true);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'success';
      case 'medium': return 'warning'; 
      case 'hard': return 'error';
      case 'very-hard': return 'error';
      default: return 'default';
    }
  };

  const getComplexityLabel = (complexity: string) => {
    switch (complexity) {
      case 'simple': return 'פשוט';
      case 'conflicting': return 'סותר';
      case 'complex': return 'מורכב';
      default: return 'רגיל';
    }
  };

  if (sessionCompleted) {
    return (
      <Card sx={{ maxWidth: 600, margin: 'auto', mt: 4 }}>
        <CardContent sx={{ textAlign: 'center', p: 4 }}>
          <TrophyIcon sx={{ fontSize: 80, color: 'gold', mb: 2 }} />
          <Typography variant="h4" gutterBottom>
            🏛️ סימולציה הושלמה!
          </Typography>
          <Typography variant="h5" color="primary" gutterBottom>
            ציון סופי: {sessionScore} נקודות
          </Typography>
          <Typography variant="body1" paragraph>
            סיימת {sampleCases.length} מקרים משפטיים
          </Typography>
          <Button 
            variant="contained" 
            onClick={() => window.location.reload()}
            sx={{ mt: 2 }}
          >
            סימולציה חדשה
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Box sx={{ maxWidth: 1000, margin: 'auto', mt: 2 }}>
      {/* כותרת אולם בית המשפט */}
      <Card sx={{ mb: 3, backgroundColor: '#1a237e', color: 'white' }}>
        <CardContent>
          <Box display="flex" justifyContent="center" alignItems="center" gap={2}>
            <Avatar sx={{ bgcolor: 'white', color: '#1a237e' }}>
              <JudgeIcon />
            </Avatar>
            <Typography variant="h4">
              🏛️ אולם בית משפט וירטואלי - אולם 1
            </Typography>
          </Box>
          <Typography variant="subtitle1" sx={{ textAlign: 'center', mt: 1 }}>
            אתה בתפקיד השופט - קבל החלטה מהירה ומדויקת
          </Typography>
        </CardContent>
      </Card>

      {/* פאנל מידע */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={6} md={3}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h6">{currentCase + 1}/{sampleCases.length}</Typography>
            <Typography variant="caption">מקרה נוכחי</Typography>
          </Paper>
        </Grid>
        <Grid item xs={6} md={3}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Box display="flex" alignItems="center" justifyContent="center" gap={1}>
              <TimerIcon color={timeLeft <= 10 ? 'error' : 'primary'} />
              <Typography variant="h6" color={timeLeft <= 10 ? 'error' : 'primary'}>
                {timeLeft}s
              </Typography>
            </Box>
            <Typography variant="caption">זמן נותר</Typography>
          </Paper>
        </Grid>
        <Grid item xs={6} md={3}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h6" color="success.main">{sessionScore}</Typography>
            <Typography variant="caption">ציון</Typography>
          </Paper>
        </Grid>
        <Grid item xs={6} md={3}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Chip 
              label={getComplexityLabel(currentCaseData.complexity)}
              size="small"
              color={currentCaseData.complexity === 'complex' ? 'error' : 
                     currentCaseData.complexity === 'conflicting' ? 'warning' : 'success'}
            />
            <Typography variant="caption" display="block">סוג מקרה</Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* המקרה המשפטי */}
      <Card sx={{ mb: 3 }}>
        <CardHeader
          title={
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="h5">{currentCaseData.title}</Typography>
              <Chip 
                label={currentCaseData.difficulty === 'very-hard' ? 'קשה מאוד' : 
                      currentCaseData.difficulty === 'hard' ? 'קשה' :
                      currentCaseData.difficulty === 'medium' ? 'בינוני' : 'קל'}
                color={getDifficultyColor(currentCaseData.difficulty) as any}
              />
            </Box>
          }
        />
        <CardContent>
          <Paper elevation={1} sx={{ p: 3, mb: 3, backgroundColor: '#f8f9fa' }}>
            <Typography variant="h6" gutterBottom color="primary">
              📋 העתירה
            </Typography>
            <Typography variant="body1" paragraph>
              {currentCaseData.petition}
            </Typography>
            
            <Typography variant="h6" gutterBottom color="primary" sx={{ mt: 3 }}>
              📚 עובדות המקרה
            </Typography>
            {currentCaseData.facts.map((fact, index) => (
              <Typography key={index} variant="body2" paragraph>
                • {fact}
              </Typography>
            ))}
          </Paper>

          <Typography variant="h6" gutterBottom color="primary">
            ⚖️ בחר את המקור המשפטי הראוי להכריע:
          </Typography>

          <Grid container spacing={2}>
            {currentCaseData.conflictingSources.map((source, index) => (
              <Grid item xs={12} md={6} key={index}>
                <Paper 
                  elevation={selectedSource === source.type ? 3 : 1}
                  sx={{ 
                    p: 3, 
                    cursor: showResult ? 'default' : 'pointer',
                    border: selectedSource === source.type ? `3px solid ${source.color}` : '1px solid #e0e0e0',
                    backgroundColor: showResult && selectedSource === source.type ? 
                      (selectedSource === currentCaseData.correctSource ? '#e8f5e8' : '#ffebee') : 'white',
                    '&:hover': !showResult ? { 
                      backgroundColor: '#f5f5f5',
                      transform: 'translateY(-4px)',
                      transition: 'all 0.3s ease',
                      boxShadow: 3
                    } : {},
                    minHeight: 150
                  }}
                  onClick={() => !showResult && handleSourceSelection(source.type)}
                >
                  <Box display="flex" alignItems="center" gap={2} mb={2}>
                    <Box sx={{ color: source.color, fontSize: 30 }}>
                      {source.icon}
                    </Box>
                    <Typography variant="h6" sx={{ color: source.color }}>
                      {legalSources[source.type].label}
                    </Typography>
                  </Box>
                  <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
                    {source.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {source.content}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>

          {/* תוצאות */}
          {showResult && (
            <Box sx={{ mt: 4 }}>
              <Alert 
                severity={selectedSource === currentCaseData.correctSource ? 'success' : 'error'}
                sx={{ mb: 3 }}
              >
                <Typography variant="h6">
                  {selectedSource === currentCaseData.correctSource ? 
                    '⚖️ פסיקה נכונה!' : '❌ פסיקה שגויה'}
                </Typography>
                <Typography variant="body2">
                  המקור הנכון: {legalSources[currentCaseData.correctSource].label}
                </Typography>
              </Alert>

              <Paper elevation={2} sx={{ p: 3, backgroundColor: '#f0f8ff' }}>
                <Typography variant="h6" gutterBottom color="primary">
                  📖 נימוק שיפוטי
                </Typography>
                <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
                  {currentCaseData.explanation}
                </Typography>
              </Paper>

              <Box sx={{ textAlign: 'center', mt: 3 }}>
                <Button 
                  variant="contained" 
                  size="large"
                  onClick={handleNextCase}
                  sx={{ minWidth: 200 }}
                >
                  {currentCase < sampleCases.length - 1 ? 'מקרה הבא' : 'סיים סימולציה'}
                </Button>
              </Box>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* פס התקדמות */}
      <LinearProgress 
        variant="determinate" 
        value={((currentCase + 1) / sampleCases.length) * 100} 
        sx={{ height: 8, borderRadius: 4 }}
      />
    </Box>
  );
};

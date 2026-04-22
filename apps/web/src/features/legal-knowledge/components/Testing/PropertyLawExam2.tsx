import React, { useState } from 'react';
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
  Alert
} from '@mui/material';

interface Question {
  id: number;
  difficulty: 'קל' | 'בינוני' | 'קשה';
  icon: string;
  category: string;
  question: string;
  options: { id: string; text: string }[];
  correctAnswer: string;
  explanation: string;
  lawReference?: string;
}

const questions: Question[] = [
  {
    id: 1,
    difficulty: 'קל',
    icon: '🏠',
    category: 'חוק המקרקעין',
    question: 'מה קובע חוק המקרקעין, התשכ"ט-1969?',
    options: [
      { id: 'a', text: 'כללי ניסוח חוזים' },
      { id: 'b', text: 'זכויות במקרקעין וסוגיהן' },
      { id: 'c', text: 'עבירות פליליות' },
      { id: 'd', text: 'יחסי עבודה' }
    ],
    correctAnswer: 'b',
    explanation: 'חוק המקרקעין קובע את סוגי הזכויות במקרקעין (בעלות, שכירות, זיקת הנאה, עכבון ומשכנתא), את עקרון הרישום ואת דיני השיתוף.',
    lawReference: 'חוק המקרקעין, התשכ"ט-1969'
  },
  {
    id: 2,
    difficulty: 'בינוני',
    icon: '🔑',
    category: 'זיקת הנאה',
    question: 'מהי זיקת הנאה?',
    options: [
      { id: 'a', text: 'בעלות מלאה על מקרקעין' },
      { id: 'b', text: 'זכות שימוש מוגבלת במקרקעין של אחר' },
      { id: 'c', text: 'חוזה שכירות' },
      { id: 'd', text: 'עסקת מכר' }
    ],
    correctAnswer: 'b',
    explanation: 'זיקת הנאה היא זכות קניינית המקנה לבעל קרקע אחת (הקרקע הזכאית) זכות שימוש מוגבלת בקרקע אחרת (הקרקע החייבת), כגון זכות מעבר.',
    lawReference: 'חוק המקרקעין, סעיפים 92-102'
  },
  {
    id: 3,
    difficulty: 'קשה',
    icon: '📋',
    category: 'רישום בטאבו',
    question: 'מהי חשיבות רישום הזכות בטאבו (לשכת רישום המקרקעין)?',
    options: [
      { id: 'a', text: 'אינו חייב — ניתן להסתפק בחוזה' },
      { id: 'b', text: 'הרישום מקנה זכות קניינית מוחלטת' },
      { id: 'c', text: 'הרישום הוא המלצה בלבד' },
      { id: 'd', text: 'הרישום מחליף חוזה' }
    ],
    correctAnswer: 'b',
    explanation: 'לפי חוק המקרקעין, עסקה במקרקעין טעונה רישום, ורק ברישום מושלמת הזכות הקניינית. ללא רישום, הקונה מחזיק בזכות חוזית בלבד.',
    lawReference: 'חוק המקרקעין, סעיף 7'
  },
  {
    id: 4,
    difficulty: 'בינוני',
    icon: '🏦',
    category: 'משכנתא',
    question: 'מהי משכנתא?',
    options: [
      { id: 'a', text: 'חוזה עבודה' },
      { id: 'b', text: 'שעבוד מקרקעין להבטחת חוב' },
      { id: 'c', text: 'קנס מנהלי' },
      { id: 'd', text: 'מס רכישה' }
    ],
    correctAnswer: 'b',
    explanation: 'משכנתא היא זכות קניינית הנוצרת בדרך של שעבוד מקרקעין להבטחת פירעון חוב או קיום חיוב. הנושה (בנק) רשאי למכור את הנכס אם החוב לא ישולם.',
    lawReference: 'חוק המקרקעין, סעיפים 85-91'
  },
  {
    id: 5,
    difficulty: 'בינוני',
    icon: '🤝',
    category: 'שיתוף במקרקעין',
    question: 'שיתוף במקרקעין — מה פירושו?',
    options: [
      { id: 'a', text: 'בעלות של בעל אחד בלבד' },
      { id: 'b', text: 'בעלות משותפת של כמה בעלים' },
      { id: 'c', text: 'היעדר בעלות' },
      { id: 'd', text: 'בעלות המדינה' }
    ],
    correctAnswer: 'b',
    explanation: 'שיתוף במקרקעין הוא מצב שבו כמה בעלים הם הבעלים המשותפים של אותו נכס, כל אחד לפי חלקו. כל שותף רשאי לדרוש פירוק השיתוף בכל עת.',
    lawReference: 'חוק המקרקעין, סעיפים 27-40'
  }
];

const getResultMessage = (pct: number) => {
  if (pct >= 80) return 'מצוין! שלטת בחומר דיני הקניין.';
  if (pct >= 60) return 'טוב! כדאי לחזור על עקרון הרישום.';
  return 'יש מקום לשיפור. חזור על חוק המקרקעין.';
};

const PropertyLawExam2: React.FC = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [examCompleted, setExamCompleted] = useState(false);
  const [score, setScore] = useState(0);

  const currentQuestion = questions[currentQuestionIndex];

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswers(prev => ({ ...prev, [currentQuestion.id]: answer }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      finishExam();
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const finishExam = () => {
    let correctAnswers = 0;
    questions.forEach(q => {
      if (selectedAnswers[q.id] === q.correctAnswer) correctAnswers++;
    });
    setScore(correctAnswers);
    setExamCompleted(true);
  };

  const resetExam = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setExamCompleted(false);
    setScore(0);
  };

  const getDifficultyColor = (d: string) => {
    if (d === 'קל') return 'success';
    if (d === 'קשה') return 'error';
    return 'warning';
  };

  if (examCompleted) {
    const pct = Math.round((score / questions.length) * 100);
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Card elevation={4}>
          <CardContent sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h4" gutterBottom color="primary">🏠 תוצאות המבחן</Typography>
            <Typography variant="h2" color={pct >= 70 ? 'success.main' : 'error.main'} gutterBottom>
              {pct}%
            </Typography>
            <Typography variant="h6" gutterBottom>
              {score} נכונות מתוך {questions.length} שאלות
            </Typography>
            <Alert severity={pct >= 70 ? 'success' : 'warning'} sx={{ my: 3 }}>
              {getResultMessage(pct)}
            </Alert>
            {questions.map(q => (
              <Box key={q.id} sx={{ mb: 2, textAlign: 'right', p: 2, border: '1px solid #e0e0e0', borderRadius: 2 }}>
                <Typography variant="body2" fontWeight="bold">{q.icon} {q.question}</Typography>
                <Typography variant="body2" color={selectedAnswers[q.id] === q.correctAnswer ? 'success.main' : 'error.main'}>
                  {selectedAnswers[q.id] === q.correctAnswer ? '✅ תשובה נכונה' : `❌ תשובתך: ${q.options.find(o => o.id === selectedAnswers[q.id])?.text ?? '—'}`}
                </Typography>
                <Typography variant="caption" color="text.secondary">{q.explanation}</Typography>
              </Box>
            ))}
            <Button variant="contained" onClick={resetExam} sx={{ mt: 2 }}>🔄 מבחן חדש</Button>
          </CardContent>
        </Card>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Card elevation={4}>
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="h4" gutterBottom color="primary">🏠 מבחן קניין ומקרקעין</Typography>
            <Typography variant="body1" color="text.secondary">
              שאלה {currentQuestionIndex + 1} מתוך {questions.length}
            </Typography>
            <LinearProgress
              variant="determinate"
              value={((currentQuestionIndex + 1) / questions.length) * 100}
              sx={{ mt: 2 }}
            />
          </Box>

          <Box sx={{ mb: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 1 }}>
              <Typography variant="h6">{currentQuestion.icon}</Typography>
              <Chip label={currentQuestion.category} color="primary" variant="outlined" />
              <Chip label={currentQuestion.difficulty} color={getDifficultyColor(currentQuestion.difficulty)} size="small" />
            </Box>
            <Typography variant="h6" paragraph>{currentQuestion.question}</Typography>

            <FormControl component="fieldset" fullWidth>
              <RadioGroup
                value={selectedAnswers[currentQuestion.id] || ''}
                onChange={e => handleAnswerSelect(e.target.value)}
              >
                {currentQuestion.options.map(opt => (
                  <FormControlLabel key={opt.id} value={opt.id} control={<Radio />} label={opt.text} />
                ))}
              </RadioGroup>
            </FormControl>

            {currentQuestion.lawReference && (
              <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                📚 {currentQuestion.lawReference}
              </Typography>
            )}
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button variant="outlined" onClick={handlePrevious} disabled={currentQuestionIndex === 0}>◀ הקודם</Button>
            <Button
              variant="contained"
              onClick={handleNext}
              disabled={!selectedAnswers[currentQuestion.id]}
            >
              {currentQuestionIndex === questions.length - 1 ? 'סיים מבחן ✓' : 'הבא ▶'}
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default PropertyLawExam2;

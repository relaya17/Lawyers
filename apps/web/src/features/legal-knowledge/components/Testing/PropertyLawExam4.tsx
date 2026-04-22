import React, { useState } from 'react';
import {
  Box, Container, Typography, Card, CardContent, Button,
  Radio, RadioGroup, FormControlLabel, FormControl,
  Chip, LinearProgress, Alert
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
    id: 1, difficulty: 'בינוני', icon: '🏠', category: 'זכות חוזית מול קניינית',
    question: 'עסקה במקרקעין שנחתמה ושולמה במלואה — אך לא נרשמה בטאבו. מה מצב הרוכש?',
    options: [
      { id: 'a', text: 'בעלות קניינית מלאה — התמורה ששולמה מספיקה' },
      { id: 'b', text: 'זכות חוזית בלבד — חשוף לסיכון עסקה נוגדת' },
      { id: 'c', text: 'אין לו זכויות כלל' },
      { id: 'd', text: 'העסקה בטלה' }
    ],
    correctAnswer: 'b',
    explanation: 'ללא רישום, לרוכש יש זכות חוזית בלבד — לא קניינית. הוא חשוף לכך שהמוכר ימכור לאחר, ואם האחר ירשום — יגבר.',
    lawReference: 'חוק המקרקעין, סעיפים 7-9'
  },
  {
    id: 2, difficulty: 'קשה', icon: '🔄', category: 'עסקה נוגדת',
    question: 'מהי "עסקה נוגדת" בדיני מקרקעין?',
    options: [
      { id: 'a', text: 'חוזה מכר רגיל' },
      { id: 'b', text: 'שתי עסקאות על אותו נכס לשני קונים שונים' },
      { id: 'c', text: 'חוזה שכירות' },
      { id: 'd', text: 'עסקת מכר ללא מחיר' }
    ],
    correctAnswer: 'b',
    explanation: 'עסקה נוגדת היא מצב שבו מוכר מכר את אותו נכס לשני קונים שונים. הדין קובע מי יגבר לפי סדר הרישום ותום הלב.',
    lawReference: 'חוק המקרקעין, סעיף 9'
  },
  {
    id: 3, difficulty: 'קשה', icon: '🏆', category: 'עדיפות ברישום',
    question: 'ראובן מכר דירה לשמעון (לא רשם), ולאחר מכן מכר ללוי (רשם בתום לב). מי יגבר?',
    options: [
      { id: 'a', text: 'שמעון — הוא הראשון בזמן' },
      { id: 'b', text: 'לוי — הרוכש השני בתום לב שרשם' },
      { id: 'c', text: 'ראובן — המוכר שומר על הנכס' },
      { id: 'd', text: 'שניהם מקבלים חצי' }
    ],
    correctAnswer: 'b',
    explanation: 'בעסקה נוגדת — עדיפות לרוכש שרשם בתום לב ובתמורה, גם אם בא שני בזמן. שמעון היה צריך לרשום הערת אזהרה להגנתו.',
    lawReference: 'חוק המקרקעין, סעיף 9'
  },
  {
    id: 4, difficulty: 'קל', icon: '🤝', category: 'פירוק שיתוף',
    question: 'מהו "פירוק שיתוף" במקרקעין?',
    options: [
      { id: 'a', text: 'איסור שימוש בנכס' },
      { id: 'b', text: 'פעולה לחלוקת נכס בין שותפים או מכירתו' },
      { id: 'c', text: 'מכירת חלקם של כולם לזר' },
      { id: 'd', text: 'חוזה בין שותפים' }
    ],
    correctAnswer: 'b',
    explanation: 'פירוק שיתוף הוא הפרדת הבעלות המשותפת — בין בחלוקה פיזית ובין במכירת הנכס וחלוקת התמורה. כל שותף יכול לדרוש פירוק.',
    lawReference: 'חוק המקרקעין, סעיפים 37-43'
  },
  {
    id: 5, difficulty: 'בינוני', icon: '📋', category: 'רישום',
    question: 'רישום בטאבו (לשכת רישום המקרקעין) יוצר:',
    options: [
      { id: 'a', text: 'זכות חוזית בלבד' },
      { id: 'b', text: 'זכות קניינית מוחלטת' },
      { id: 'c', text: 'המלצה שאינה מחייבת' },
      { id: 'd', text: 'תחליף לחוזה' }
    ],
    correctAnswer: 'b',
    explanation: 'רישום בטאבו מקנה זכות קניינית — הזכות שמוכרת כלפי כולם. רק ברישום מושלמת עסקת המקרקעין ועוברת הבעלות לרוכש.',
    lawReference: 'חוק המקרקעין, סעיפים 6-7'
  }
];

const getResultMessage = (pct: number) => {
  if (pct >= 80) return 'מצוין! שלטת בדיני קניין — עסקאות נוגדות ורישום.';
  if (pct >= 60) return 'טוב! כדאי לחזור על עסקה נוגדת וחשיבות הרישום.';
  return 'יש מקום לשיפור. חזור על סעיפים 7-9 לחוק המקרקעין.';
};

const getDifficultyColor = (d: string) => {
  if (d === 'קל') return 'success';
  if (d === 'קשה') return 'error';
  return 'warning';
};

const PropertyLawExam4: React.FC = () => {
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
      let correct = 0;
      questions.forEach(q => { if (selectedAnswers[q.id] === q.correctAnswer) correct++; });
      setScore(correct);
      setExamCompleted(true);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) setCurrentQuestionIndex(prev => prev - 1);
  };

  const resetExam = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setExamCompleted(false);
    setScore(0);
  };

  if (examCompleted) {
    const pct = Math.round((score / questions.length) * 100);
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Card elevation={4}>
          <CardContent sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h4" gutterBottom color="primary">🏠 תוצאות — קניין סט 3</Typography>
            <Typography variant="h2" color={pct >= 70 ? 'success.main' : 'error.main'} gutterBottom>{pct}%</Typography>
            <Typography variant="h6" gutterBottom>{score} נכונות מתוך {questions.length}</Typography>
            <Alert severity={pct >= 70 ? 'success' : 'warning'} sx={{ my: 3 }}>{getResultMessage(pct)}</Alert>
            {questions.map(q => (
              <Box key={q.id} sx={{ mb: 2, textAlign: 'right', p: 2, border: '1px solid #e0e0e0', borderRadius: 2 }}>
                <Typography variant="body2" fontWeight="bold">{q.icon} {q.question}</Typography>
                <Typography variant="body2" color={selectedAnswers[q.id] === q.correctAnswer ? 'success.main' : 'error.main'}>
                  {selectedAnswers[q.id] === q.correctAnswer ? '✅ נכון' : `❌ ${q.options.find(o => o.id === selectedAnswers[q.id])?.text ?? '—'}`}
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
            <Typography variant="h4" gutterBottom color="primary">🏠 קניין ומקרקעין — סט 3</Typography>
            <Typography variant="body1" color="text.secondary">שאלה {currentQuestionIndex + 1} מתוך {questions.length}</Typography>
            <LinearProgress variant="determinate" value={((currentQuestionIndex + 1) / questions.length) * 100} sx={{ mt: 2 }} />
          </Box>
          <Box sx={{ mb: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 1 }}>
              <Typography variant="h6">{currentQuestion.icon}</Typography>
              <Chip label={currentQuestion.category} color="primary" variant="outlined" />
              <Chip label={currentQuestion.difficulty} color={getDifficultyColor(currentQuestion.difficulty)} size="small" />
            </Box>
            <Typography variant="h6" paragraph>{currentQuestion.question}</Typography>
            <FormControl component="fieldset" fullWidth>
              <RadioGroup value={selectedAnswers[currentQuestion.id] || ''} onChange={e => handleAnswerSelect(e.target.value)}>
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
            <Button variant="contained" onClick={handleNext} disabled={!selectedAnswers[currentQuestion.id]}>
              {currentQuestionIndex === questions.length - 1 ? 'סיים מבחן ✓' : 'הבא ▶'}
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default PropertyLawExam4;

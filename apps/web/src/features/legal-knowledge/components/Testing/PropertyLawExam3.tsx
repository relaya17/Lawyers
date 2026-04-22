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
    id: 1, difficulty: 'בינוני', icon: '🏠', category: 'רישום מקרקעין',
    question: 'אדם רכש דירה ושילם את מלוא התמורה, אך לא רשם אותה בטאבו. מה המצב המשפטי?',
    options: [
      { id: 'a', text: 'אין לו זכויות כלל' },
      { id: 'b', text: 'יש לו זכות חוזית בלבד — לא קניינית' },
      { id: 'c', text: 'בעלות מלאה — התמורה ששולמה מספיקה' },
      { id: 'd', text: 'אין משמעות לרישום' }
    ],
    correctAnswer: 'b',
    explanation: 'לפי חוק המקרקעין, ללא רישום — הקונה מחזיק בזכות חוזית בלבד. הבעלות הקניינית עוברת רק ברישום. היעדר רישום חשוף לסיכון של "עסקה נוגדת".',
    lawReference: 'חוק המקרקעין, סעיף 7'
  },
  {
    id: 2, difficulty: 'בינוני', icon: '🚶', category: 'זיקת הנאה',
    question: 'שכן משתמש בשביל של שכנו במשך 30 שנה ללא התנגדות. מה ייתכן מבחינה משפטית?',
    options: [
      { id: 'a', text: 'רכש בעלות על השביל' },
      { id: 'b', text: 'נוצרה זיקת הנאה מכוח שנים' },
      { id: 'c', text: 'מדובר בשכירות' },
      { id: 'd', text: 'מדובר בחוזה מכללא' }
    ],
    correctAnswer: 'b',
    explanation: 'שימוש גלוי, רציף ולא מוסווה במשך שנים ארוכות עשוי ליצור זיקת הנאה מכוח שנים (כ-30 שנה) — גם ללא הסכם מפורש.',
    lawReference: 'חוק המקרקעין, סעיף 94'
  },
  {
    id: 3, difficulty: 'קל', icon: '🤝', category: 'פירוק שיתוף',
    question: 'שני שותפים (כל אחד 50%) רוצים לפרק שיתוף במקרקעין. מה הדין?',
    options: [
      { id: 'a', text: 'אסור לפרק ללא הסכמת שניהם' },
      { id: 'b', text: 'כל שותף רשאי לדרוש פירוק בכל עת' },
      { id: 'c', text: 'רק בהסכמת שניהם ניתן לפרק' },
      { id: 'd', text: 'רק דרך בית משפט' }
    ],
    correctAnswer: 'b',
    explanation: 'עקרון יסוד בחוק המקרקעין — כל שותף רשאי לדרוש פירוק שיתוף בכל עת, בית המשפט יפרק אם לא הוסכם אחרת.',
    lawReference: 'חוק המקרקעין, סעיף 37'
  },
  {
    id: 4, difficulty: 'בינוני', icon: '📄', category: 'צורת עסקה',
    question: 'מה תוקפה של עסקה במקרקעין שנעשתה בעל פה בלבד, ללא מסמך כתוב?',
    options: [
      { id: 'a', text: 'תקפה — חוזה בעל פה מחייב' },
      { id: 'b', text: 'בטלה' },
      { id: 'c', text: 'תקפה חלקית' },
      { id: 'd', text: 'תלויה בזמן ביצוע' }
    ],
    correctAnswer: 'b',
    explanation: 'עסקה במקרקעין טעונה מסמך בכתב — ללא כתב, העסקה בטלה. זאת בניגוד לחוזה רגיל שאינו טעון כתב בהכרח.',
    lawReference: 'חוק המקרקעין, סעיף 8'
  },
  {
    id: 5, difficulty: 'בינוני', icon: '⚠️', category: 'הערת אזהרה',
    question: 'מהי הערת אזהרה בטאבו?',
    options: [
      { id: 'a', text: 'אזהרה פלילית על הנכס' },
      { id: 'b', text: 'רישום שמגן על הרוכש ומונע עסקאות נוגדות' },
      { id: 'c', text: 'חוזה מכר' },
      { id: 'd', text: 'מס מיוחד' }
    ],
    correctAnswer: 'b',
    explanation: 'הערת אזהרה נרשמת לטובת מי שיש לו זכות לרכוש נכס, ומגינה עליו מפני עסקאות נוגדות עד לרישום הסופי. הרוכש שרשם הערת אזהרה גובר על מי שרכש לאחריו.',
    lawReference: 'חוק המקרקעין, סעיף 126'
  }
];

const getResultMessage = (pct: number) => {
  if (pct >= 80) return 'מצוין! שלטת בדיני קניין ומקרקעין — סט 2.';
  if (pct >= 60) return 'טוב! כדאי לחזור על רישום, זיקת הנאה והערת אזהרה.';
  return 'יש מקום לשיפור. חזור על חוק המקרקעין סעיפים 7–8 ו-94.';
};

const getDifficultyColor = (d: string) => {
  if (d === 'קל') return 'success';
  if (d === 'קשה') return 'error';
  return 'warning';
};

const PropertyLawExam3: React.FC = () => {
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
            <Typography variant="h4" gutterBottom color="primary">🏠 תוצאות — קניין סט 2</Typography>
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
            <Typography variant="h4" gutterBottom color="primary">🏠 קניין ומקרקעין — סט 2</Typography>
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

export default PropertyLawExam3;

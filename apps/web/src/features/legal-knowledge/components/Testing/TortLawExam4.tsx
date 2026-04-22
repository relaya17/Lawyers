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
    id: 1, difficulty: 'בינוני', icon: '🪟', category: 'סוג העוולה',
    question: 'אדם זרק חפץ במזיד מחלון ופגע בעובר אורח. מהי העוולה הנכונה?',
    options: [
      { id: 'a', text: 'רשלנות' },
      { id: 'b', text: 'תקיפה' },
      { id: 'c', text: 'אחריות מוחלטת' },
      { id: 'd', text: 'הפרת חוזה' }
    ],
    correctAnswer: 'b',
    explanation: 'מעשה מכוון שגרם לפגיעה גופנית ישירה = תקיפה (battery). בניגוד לרשלנות, לתקיפה נדרש מכוונות — לא סתם רשלנות.',
    lawReference: 'פקודת הנזיקין, סעיף 23'
  },
  {
    id: 2, difficulty: 'קשה', icon: '🔍', category: 'res ipsa loquitur',
    question: 'מהי עקרון "הדבר מעיד על עצמו" (res ipsa loquitur)?',
    options: [
      { id: 'a', text: 'אין צורך בהוכחה כלל' },
      { id: 'b', text: 'העברת נטל ההוכחה — הנתבע מוכיח שלא התרשל' },
      { id: 'c', text: 'ביטול אוטומטי של התביעה' },
      { id: 'd', text: 'הסכם פשרה' }
    ],
    correctAnswer: 'b',
    explanation: 'כאשר הנסיבות מעידות על רשלנות כמעט בוודאות (כגון: מספריים ניתוח שנשכחו בגוף המנותח) — נטל ההוכחה עובר לנתבע להוכיח שלא התרשל.',
    lawReference: 'פסיקת בית המשפט העליון — res ipsa loquitur'
  },
  {
    id: 3, difficulty: 'בינוני', icon: '⚡', category: 'אחריות מוחלטת',
    question: 'מהי "אחריות מוחלטת" בדיני נזיקין?',
    options: [
      { id: 'a', text: 'אחריות ללא צורך בהוכחת אשם כלל' },
      { id: 'b', text: 'אחריות רק ברשלנות חמורה' },
      { id: 'c', text: 'אחריות רק בחוזים' },
      { id: 'd', text: 'אין מושג כזה בחוק' }
    ],
    correctAnswer: 'a',
    explanation: 'אחריות מוחלטת (strict liability) מוטלת ללא צורך בהוכחת אשם. קיימת למשל בחוק הפיצויים לנפגעי תאונות דרכים — ללא קשר לאשמת הנהג.',
    lawReference: 'חוק הפיצויים לנפגעי תאונות דרכים, התשל"ה-1975'
  },
  {
    id: 4, difficulty: 'קשה', icon: '🎯', category: 'צפיות נזק',
    question: 'נגרם נזק שלא ניתן היה לצפות אותו בצורה סבירה. מה הדין?',
    options: [
      { id: 'a', text: 'תמיד יש פיצוי' },
      { id: 'b', text: 'בדרך כלל אין אחריות — הנזק לא היה צפוי' },
      { id: 'c', text: 'תלוי בסכום הנזק' },
      { id: 'd', text: 'תמיד יש אחריות' }
    ],
    correctAnswer: 'b',
    explanation: 'הקשר הסיבתי המשפטי דורש צפיות. אם הנזק לא היה צפוי על ידי אדם סביר — לרוב לא תוטל אחריות (Wagon Mound test).',
    lawReference: 'פסיקת Wagon Mound No.1 (1961); פסיקת בית המשפט העליון'
  },
  {
    id: 5, difficulty: 'בינוני', icon: '🏙️', category: 'אחריות רשות',
    question: 'מפגע מסוכן ברחוב לא טופל על ידי העירייה, ואדם נפגע. מה ייתכן?',
    options: [
      { id: 'a', text: 'אין אחריות לעירייה' },
      { id: 'b', text: 'ייתכן אחריות ברשלנות של הרשות הציבורית' },
      { id: 'c', text: 'רק הליך פלילי' },
      { id: 'd', text: 'אין עילה נגד גוף ציבורי' }
    ],
    correctAnswer: 'b',
    explanation: 'רשות ציבורית יכולה לחוב ברשלנות אם הייתה לה ידיעה על המפגע ולא פעלה. חובת הזהירות של רשויות נבחנת בקפידה יחסית.',
    lawReference: 'פסיקת בית המשפט העליון — אחריות רשויות ציבוריות'
  }
];

const getResultMessage = (pct: number) => {
  if (pct >= 80) return 'מצוין! שלטת בדיני נזיקין — סט 3.';
  if (pct >= 60) return 'טוב! כדאי לחזור על res ipsa loquitur ואחריות מוחלטת.';
  return 'יש מקום לשיפור. חזור על סוגי האחריות בנזיקין.';
};

const getDifficultyColor = (d: string) => {
  if (d === 'קל') return 'success';
  if (d === 'קשה') return 'error';
  return 'warning';
};

const TortLawExam4: React.FC = () => {
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
            <Typography variant="h4" gutterBottom color="primary">⚖️ תוצאות — נזיקין סט 3</Typography>
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
            <Typography variant="h4" gutterBottom color="primary">⚖️ דיני נזיקין — סט 3</Typography>
            <Typography variant="body1" color="text.secondary">שאלה {currentQuestionIndex + 1} מתוך {questions.length}</Typography>
            <LinearProgress variant="determinate" value={((currentQuestionIndex + 1) / questions.length) * 100} sx={{ mt: 2 }} />
          </Box>
          <Box sx={{ mb: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 1 }}>
              <Typography variant="h6">{currentQuestion.icon}</Typography>
              <Chip label={currentQuestion.category} color="primary" variant="outlined" />
              <Chip label={currentQuestion.difficulty} color={getDifficultyColor(currentQuestion.difficulty) as any} size="small" />
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

export default TortLawExam4;

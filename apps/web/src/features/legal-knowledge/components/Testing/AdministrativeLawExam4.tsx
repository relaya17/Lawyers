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
    id: 1, difficulty: 'בינוני', icon: '📄', category: 'חובת הנמקה',
    question: 'רשות ציבורית קיבלה החלטה שפגעה באזרח ולא נתנה לה כל נימוק. מה הדין?',
    options: [
      { id: 'a', text: 'תקין — אין חובה לנמק' },
      { id: 'b', text: 'פגם מנהלי — קיימת חובת הנמקה' },
      { id: 'c', text: 'רק כאשר מדובר בהחלטה כספית' },
      { id: 'd', text: 'הנמקה נדרשת רק בצו שיפוטי' }
    ],
    correctAnswer: 'b',
    explanation: 'חובת ההנמקה היא עיקרון יסוד של המשפט המנהלי. ללא נימוק לא ניתן לבדוק תקינות ההחלטה ולהגיש עתירה. אי מתן נימוק הוא פגם מנהלי.',
    lawReference: 'חוק לתיקון סדרי המינהל (החלטות והנמקות), התשי"ט-1958'
  },
  {
    id: 2, difficulty: 'קשה', icon: '🎭', category: 'שיקולים זרים',
    question: 'החלטה מנהלית שהתקבלה משיקולים שאינם רלוונטיים למטרת החוק. מה תוצאתה?',
    options: [
      { id: 'a', text: 'תקפה — לרשות שיקול דעת רחב' },
      { id: 'b', text: 'עשויה להיפסל בשל שיקולים זרים' },
      { id: 'c', text: 'תלוי אם הייתה כוונה' },
      { id: 'd', text: 'ניתנת לאישור בבית משפט' }
    ],
    correctAnswer: 'b',
    explanation: 'עילת השיקולים הזרים היא אחת מעילות הביטול העיקריות. רשות שהפעילה שיקול דעת שאינו מאוזן לתכלית החוק — החלטתה תיפסל.',
    lawReference: 'פסיקת בג"ץ — עילת השיקולים הזרים'
  },
  {
    id: 3, difficulty: 'קל', icon: '🔢', category: 'שיקול דעת מנהלי',
    question: 'מהו "שיקול דעת מנהלי"?',
    options: [
      { id: 'a', text: 'חופש פעולה מוחלט ללא הגבלה' },
      { id: 'b', text: 'הפעלת סמכות לפי הוראות החוק ותכליתו' },
      { id: 'c', text: 'כל החלטה שהרשות חפצה בה' },
      { id: 'd', text: 'אין כלים לבחון אותו' }
    ],
    correctAnswer: 'b',
    explanation: 'שיקול דעת מנהלי הוא הפעלת סמכות בגדרי החוק ותכליתו — לא חופש פעולה מוחלט. בית המשפט בוחן את אופן הפעלתו.',
    lawReference: 'פסיקת בית המשפט העליון — ביקורת שיפוטית'
  },
  {
    id: 4, difficulty: 'קשה', icon: '📏', category: 'מידתיות',
    question: 'רשות פגעה בזכות יסוד של אזרח ללא שבחנה עמידה במבחן המידתיות. מה הדין?',
    options: [
      { id: 'a', text: 'תקין — הרשות בדקה את הנחיצות' },
      { id: 'b', text: 'עשוי להיות פסול — נדרשת מידתיות' },
      { id: 'c', text: 'ספציפי רק לזכויות כלכליות' },
      { id: 'd', text: 'רק שאלה חוקתית' }
    ],
    correctAnswer: 'b',
    explanation: 'מידתיות היא תנאי חוקתי-מנהלי לפגיעה בזכות יסוד. הרשות חייבת לעבור את שלושת מבחני המשנה (קשר רציונלי, הפגיעה הפחותה, יחסיות).',
    lawReference: 'חוק יסוד: כבוד האדם וחירותו, סעיף 8'
  },
  {
    id: 5, difficulty: 'בינוני', icon: '🏛️', category: 'עתירה לבג"ץ',
    question: 'מתי ניתן להגיש עתירה לבג"ץ?',
    options: [
      { id: 'a', text: 'רק בסכסוכים כספיים' },
      { id: 'b', text: 'כאשר רשות ציבורית פגעה בזכויות האזרח' },
      { id: 'c', text: 'רק בסכסוכים פליליים' },
      { id: 'd', text: 'ניתן תמיד ללא תנאים' }
    ],
    correctAnswer: 'b',
    explanation: 'עתירה לבג"ץ (בית המשפט הגבוה לצדק) מוגשת כאשר רשות ציבורית פגעה שלא כדין בזכויות. בית המשפט בוחן את חוקיות ההחלטה.',
    lawReference: 'חוק בתי המשפט, סעיף 15(ג)'
  }
];

const getResultMessage = (pct: number) => {
  if (pct >= 80) return 'מצוין! שלטת במשפט המנהלי — סט 3.';
  if (pct >= 60) return 'טוב! כדאי לחזור על חובת הנמקה ומידתיות.';
  return 'יש מקום לשיפור. חזור על עילות הביקורת השיפוטית ועתירה לבג"ץ.';
};

const getDifficultyColor = (d: string) => {
  if (d === 'קל') return 'success';
  if (d === 'קשה') return 'error';
  return 'warning';
};

const AdministrativeLawExam4: React.FC = () => {
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
            <Typography variant="h4" gutterBottom color="primary">🏛️ תוצאות — מנהלי סט 3</Typography>
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
            <Typography variant="h4" gutterBottom color="primary">🏛️ משפט מנהלי — סט 3</Typography>
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

export default AdministrativeLawExam4;

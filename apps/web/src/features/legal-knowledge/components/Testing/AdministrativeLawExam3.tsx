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
    id: 1, difficulty: 'קשה', icon: '🏛️', category: 'שיקולים זרים',
    question: 'רשות ציבורית קיבלה החלטה משיקולים פוליטיים בלבד, ולא לפי שיקולים מקצועיים. מה הדין?',
    options: [
      { id: 'a', text: 'תקין — לרשות יש שיקול דעת רחב' },
      { id: 'b', text: 'פסול — שיקולים זרים פוסלים החלטה' },
      { id: 'c', text: 'תלוי בתוצאת ההחלטה' },
      { id: 'd', text: 'חוקי תמיד' }
    ],
    correctAnswer: 'b',
    explanation: 'שיקולים פוליטיים הם שיקולים זרים לתכלית ההסמכה — החלטה שהתקבלה מהם פסולה וניתנת לביטול בבית משפט.',
    lawReference: 'פסיקת בג"ץ — עילת השיקולים הזרים'
  },
  {
    id: 2, difficulty: 'בינוני', icon: '🗣️', category: 'שימוע',
    question: 'אדם לא קיבל זכות שימוע לפני שרשות פגעה בזכויותיו. מה המשמעות?',
    options: [
      { id: 'a', text: 'אין בעיה — ניתן להליך פנייה בדיעבד' },
      { id: 'b', text: 'פגם מהותי — עשוי להוביל לביטול ההחלטה' },
      { id: 'c', text: 'רק פיצוי כספי' },
      { id: 'd', text: 'תלוי בגודל הרשות' }
    ],
    correctAnswer: 'b',
    explanation: 'זכות השימוע היא עקרון צדק טבעי יסודי. אי מתן שימוע הוא פגם מהותי העלול להוביל לביטול ההחלטה המנהלית.',
    lawReference: 'עקרון הצדק הטבעי — audi alteram partem'
  },
  {
    id: 3, difficulty: 'בינוני', icon: '📂', category: 'חופש המידע',
    question: 'רשות סירבה למסור מידע ציבורי ללא כל נימוק. מה ניתן לטעון?',
    options: [
      { id: 'a', text: 'חוקי — לרשות סודיות מוחלטת' },
      { id: 'b', text: 'הפרת חוק חופש המידע' },
      { id: 'c', text: 'סודיות מוחלטת של המדינה' },
      { id: 'd', text: 'אין עילה משפטית' }
    ],
    correctAnswer: 'b',
    explanation: 'חוק חופש המידע מחייב את הרשות למסור מידע ציבורי, ואם מסרבת — חייבת לנמק. סירוב ללא נימוק = הפרת החוק.',
    lawReference: 'חוק חופש המידע, התשנ"ח-1998'
  },
  {
    id: 4, difficulty: 'קשה', icon: '📏', category: 'סבירות',
    question: 'החלטה מנהלית שנמצאת "לא סבירה באופן קיצוני" — מה משמעותה בביקורת שיפוטית?',
    options: [
      { id: 'a', text: 'תקינה אם יש נימוק' },
      { id: 'b', text: 'בטלה — בית המשפט יתערב' },
      { id: 'c', text: 'רק פיצוי כספי' },
      { id: 'd', text: 'אין עילה לביקורת שיפוטית' }
    ],
    correctAnswer: 'b',
    explanation: 'החלטה שחורגת ממתחם הסבירות בצורה קיצונית — בית המשפט יתערב ויבטלנה. זוהי עילת הסבירות הקלאסית בביקורת שיפוטית.',
    lawReference: 'בג"ץ 6163/92 אייזנברג — עילת הסבירות'
  },
  {
    id: 5, difficulty: 'בינוני', icon: '⚖️', category: 'מידתיות',
    question: 'מהו עקרון המידתיות במשפט המנהלי?',
    options: [
      { id: 'a', text: 'קבלת החלטה במהירות' },
      { id: 'b', text: 'התאמה בין האמצעי שנבחר לבין המטרה שהוגדרה' },
      { id: 'c', text: 'שיקולים פוליטיים' },
      { id: 'd', text: 'חופש פעולה מוחלט' }
    ],
    correctAnswer: 'b',
    explanation: 'עקרון המידתיות מחייב שהאמצעי שנבחר יהיה מידתי למטרה — יפגע בזכויות פחות ככל האפשר תוך השגת המטרה. מורכב משלושה מבחני משנה.',
    lawReference: 'חוק יסוד: כבוד האדם וחירותו, סעיף 8'
  }
];

const getResultMessage = (pct: number) => {
  if (pct >= 80) return 'מצוין! שלטת במשפט המנהלי — סט 2.';
  if (pct >= 60) return 'טוב! כדאי לחזור על שיקולים זרים, שימוע ומידתיות.';
  return 'יש מקום לשיפור. חזור על עילות הביקורת השיפוטית.';
};

const getDifficultyColor = (d: string) => {
  if (d === 'קל') return 'success';
  if (d === 'קשה') return 'error';
  return 'warning';
};

const AdministrativeLawExam3: React.FC = () => {
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
            <Typography variant="h4" gutterBottom color="primary">🏛️ תוצאות — מנהלי סט 2</Typography>
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
            <Typography variant="h4" gutterBottom color="primary">🏛️ משפט מנהלי — סט 2</Typography>
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

export default AdministrativeLawExam3;

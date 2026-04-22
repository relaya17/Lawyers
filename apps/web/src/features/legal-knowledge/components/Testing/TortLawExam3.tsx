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
    id: 1, difficulty: 'בינוני', icon: '🛒', category: 'רשלנות — הוכחה',
    question: 'רוני החליק בסופרמרקט על רצפה רטובה, ללא שלט אזהרה. נגרם נזק. מה הסיכוי להטיל אחריות על הסופר?',
    options: [
      { id: 'a', text: 'אין אחריות — אירוע מקרי' },
      { id: 'b', text: 'אחריות מוחלטת אוטומטית' },
      { id: 'c', text: 'ייתכן — תלוי בהוכחת רשלנות' },
      { id: 'd', text: 'רק אם יש חוזה בין הצדדים' }
    ],
    correctAnswer: 'c',
    explanation: 'צריך להוכיח: חובת זהירות (קיימת לבעל עסק כלפי לקוחות), הפרה (ללא שלט), נזק וקשר סיבתי. ייתכן גם "res ipsa loquitur".',
    lawReference: 'פקודת הנזיקין, סעיף 35'
  },
  {
    id: 2, difficulty: 'בינוני', icon: '🚗', category: 'אשם תורם',
    question: 'נהג נסע כחוק. הולך רגל חצה את הכביש באור אדום ונפגע. מה הדין?',
    options: [
      { id: 'a', text: 'הנהג תמיד אחראי' },
      { id: 'b', text: 'אין אחריות לנהג בכלל' },
      { id: 'c', text: 'ייתכן אשם תורם — הפחתת פיצוי לנהג' },
      { id: 'd', text: 'רק הביטוח מכסה, אין עילה' }
    ],
    correctAnswer: 'c',
    explanation: 'הולך הרגל תרם לנזקו. בית המשפט יפחית את הפיצוי לפי אחוז האשם התורם. ייתכן שהנהג יישא בחלק קטן אם חצה בתנאים שניתן לצפות.',
    lawReference: 'פקודת הנזיקין, סעיף 68'
  },
  {
    id: 3, difficulty: 'קשה', icon: '🏥', category: 'רשלנות רפואית',
    question: 'רופא טעה באבחון אך פעל לפי הפרקטיקה הרפואית המקובלת. האם קיימת רשלנות?',
    options: [
      { id: 'a', text: 'כן — כל שגיאה היא רשלנות' },
      { id: 'b', text: 'לא בהכרח — פרקטיקה מקובלת שוללת רשלנות' },
      { id: 'c', text: 'כן — אוטומטית כשיש נזק' },
      { id: 'd', text: 'כן — רק אם יש נזק כספי' }
    ],
    correctAnswer: 'b',
    explanation: 'פעולה לפי פרקטיקה רפואית מקובלת יכולה לשלול קיום רשלנות. אולם אם הפרקטיקה עצמה אינה סבירה — עדיין תהיה רשלנות.',
    lawReference: 'פסיקת בית המשפט העליון — ע"א 3108/91 רייבי'
  },
  {
    id: 4, difficulty: 'בינוני', icon: '🔗', category: 'סוגי נזק',
    question: 'מהו "נזק עקיף" בדיני נזיקין?',
    options: [
      { id: 'a', text: 'נזק גופני ישיר' },
      { id: 'b', text: 'נזק שאינו תוצאה ישירה של ההתנהגות' },
      { id: 'c', text: 'נזק כספי בלבד' },
      { id: 'd', text: 'נזק פלילי' }
    ],
    correctAnswer: 'b',
    explanation: 'נזק עקיף הוא נזק שנגרם בעקיפין מהמעשה — כגון אובדן הכנסה של קרוב משפחה עקב פגיעה בנפגע. ניתן לפצות עליו בתנאים מסוימים.',
    lawReference: 'פקודת הנזיקין, סעיפים 64-65'
  },
  {
    id: 5, difficulty: 'בינוני', icon: '🏭', category: 'מטרד',
    question: 'מפעל גרם לרעש חזק הפוגע באיכות חייהם של שכנים. איזו עוולה רלוונטית?',
    options: [
      { id: 'a', text: 'תקיפה' },
      { id: 'b', text: 'מטרד ליחיד' },
      { id: 'c', text: 'רשלנות בלבד' },
      { id: 'd', text: 'גניבה' }
    ],
    correctAnswer: 'b',
    explanation: 'מטרד ליחיד (private nuisance) — פגיעה בשימוש ובהנאה מסבירה במקרקעין על ידי פעולה מתמשכת של אחר. הרעש הפוגע באיכות החיים הוא דוגמה קלאסית.',
    lawReference: 'פקודת הנזיקין, סעיף 44'
  }
];

const getResultMessage = (pct: number) => {
  if (pct >= 80) return 'מצוין! שלטת בדיני נזיקין — סט 2.';
  if (pct >= 60) return 'טוב! כדאי לחזור על רשלנות, אשם תורם ומטרד.';
  return 'יש מקום לשיפור. חזור על פקודת הנזיקין.';
};

const getDifficultyColor = (d: string) => {
  if (d === 'קל') return 'success';
  if (d === 'קשה') return 'error';
  return 'warning';
};

const TortLawExam3: React.FC = () => {
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
            <Typography variant="h4" gutterBottom color="primary">⚖️ תוצאות — נזיקין סט 2</Typography>
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
            <Typography variant="h4" gutterBottom color="primary">⚖️ דיני נזיקין — סט 2</Typography>
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

export default TortLawExam3;

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
    id: 1, difficulty: 'קשה', icon: '⚖️', category: 'שימוע — מועד',
    question: 'מעביד הודיע לעובד על פיטורין, ורק לאחר ההודעה ערך לו שימוע. מה הדין?',
    options: [
      { id: 'a', text: 'תקין — השימוע נעשה' },
      { id: 'b', text: 'פגם טכני קל בלבד' },
      { id: 'c', text: 'פגם מהותי — שימוע לאחר ההחלטה אינו שימוע' },
      { id: 'd', text: 'אין משמעות למועד השימוע' }
    ],
    correctAnswer: 'c',
    explanation: 'שימוע חייב להיות לפני קבלת ההחלטה — לא אחריה. שימוע שנעשה לאחר שהוחלט על פיטורין הוא פגם מהותי, מכיוון שאינו מאפשר לעובד להשפיע על ההחלטה.',
    lawReference: 'פסיקת בית הדין הארצי לעבודה'
  },
  {
    id: 2, difficulty: 'בינוני', icon: '🤰', category: 'הגנה על עובדת בהריון',
    question: 'עובדת בהריון פוטרה ללא היתר מהממונה על יחסי עבודה. מה הדין?',
    options: [
      { id: 'a', text: 'הפיטורין תקפים' },
      { id: 'b', text: 'הפיטורין בטלים' },
      { id: 'c', text: 'רק זכות לפיצוי כספי' },
      { id: 'd', text: 'תלוי בשיקול דעת המעביד' }
    ],
    correctAnswer: 'b',
    explanation: 'החוק אוסר לפטר עובדת בהריון ללא היתר מהממונה על יחסי עבודה. פיטורין ללא היתר הם בטלים, והעובדת זכאית לשוב לעבודה.',
    lawReference: 'חוק עבודת נשים, סעיף 9'
  },
  {
    id: 3, difficulty: 'קשה', icon: '🔍', category: 'עובד / קבלן עצמאי',
    question: 'עובד הוגדר כ"פרילנסר" בחוזה, אך בפועל עבד כשכיר לכל דבר. מה ייתכן מבחינה משפטית?',
    options: [
      { id: 'a', text: 'אין לו זכויות — החוזה קובע' },
      { id: 'b', text: 'עשוי להיות מוכר כעובד ולקבל כל זכויות שכיר' },
      { id: 'c', text: 'ההגדרה בחוזה מחייבת תמיד' },
      { id: 'd', text: 'אין עילה משפטית' }
    ],
    correctAnswer: 'b',
    explanation: 'בית הדין לעבודה בוחן את המציאות בפועל ולא את הכותרת. עובד שעמד במבחן ההשתלבות ייוכר כעובד, גם אם נקרא "קבלן עצמאי".',
    lawReference: 'מבחן ההשתלבות — פסיקת בית הדין הארצי לעבודה'
  },
  {
    id: 4, difficulty: 'קל', icon: '📜', category: 'חוק קוגנטי',
    question: 'מהו "חוק קוגנטי"?',
    options: [
      { id: 'a', text: 'חוק שניתן לשנות בהסכמה' },
      { id: 'b', text: 'חוק שאינו ניתן להתניה ולויתור' },
      { id: 'c', text: 'חוק פלילי בלבד' },
      { id: 'd', text: 'חוק זמני' }
    ],
    correctAnswer: 'b',
    explanation: 'חוק קוגנטי (jus cogens) הוא חוק שאין לוותר עליו, גם בהסכמה. בדיני עבודה: חוק שכר מינימום, חופשה שנתית, פיצויי פיטורים — כולם קוגנטיים.',
    lawReference: 'עקרון ההגנה על העובד'
  },
  {
    id: 5, difficulty: 'בינוני', icon: '⏸️', category: 'הפסקות',
    question: 'עובד לא קיבל את ההפסקות הקבועות בחוק שעות עבודה ומנוחה. מה המשמעות?',
    options: [
      { id: 'a', text: 'אין בעיה אם העובד לא התלונן' },
      { id: 'b', text: 'הפרת חוק — המעביד חשוף לתביעה ולסנקציות' },
      { id: 'c', text: 'רק המלצה — לא חובה' },
      { id: 'd', text: 'תלוי בסוג העבודה' }
    ],
    correctAnswer: 'b',
    explanation: 'חוק שעות עבודה ומנוחה קובע זכות לפסקות מנוחה במהלך יום העבודה. אי מתן הפסקות הוא הפרת חוק, ושתיקת העובד לא מוותרת על זכותו.',
    lawReference: 'חוק שעות עבודה ומנוחה, התשי"א-1951'
  }
];

const getResultMessage = (pct: number) => {
  if (pct >= 80) return 'מצוין! שלטת בדיני עבודה — סט 3 מתקדם.';
  if (pct >= 60) return 'טוב! כדאי לחזור על שימוע, עובד/קבלן והגנה בהריון.';
  return 'יש מקום לשיפור. חזור על חוק עבודת נשים וחוק שעות עבודה.';
};

const getDifficultyColor = (d: string) => {
  if (d === 'קל') return 'success';
  if (d === 'קשה') return 'error';
  return 'warning';
};

const LaborLawExam4: React.FC = () => {
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
            <Typography variant="h4" gutterBottom color="primary">💼 תוצאות — עבודה סט 3</Typography>
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
            <Typography variant="h4" gutterBottom color="primary">💼 דיני עבודה — סט 3 מתקדם</Typography>
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

export default LaborLawExam4;

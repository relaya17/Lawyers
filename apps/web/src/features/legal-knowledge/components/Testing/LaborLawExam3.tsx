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
    id: 1, difficulty: 'קשה', icon: '⚖️', category: 'שימוע ופיטורין',
    question: 'דנה עבדה בחברה פרטית שנתיים. זומנה לשיחה קצרה, נאמר לה שתפקודה אינו מספק — והיא מפוטרת מיידית, ללא שימוע מוקדם. מה הסעד הסביר ביותר?',
    options: [
      { id: 'a', text: 'ביטול הפיטורין והשבתה לעבודה' },
      { id: 'b', text: 'פיצוי כספי בגין פגם בהליך הפיטורין' },
      { id: 'c', text: 'אין עילה — הפיטורין תקפים לחלוטין' },
      { id: 'd', text: 'פיצויי פיטורין כפולים אוטומטית' }
    ],
    correctAnswer: 'b',
    explanation: 'אי עריכת שימוע = פגם מהותי, אך הסעד הרגיל הוא פיצוי ולא ביטול הפיטורין — במיוחד במגזר הפרטי.',
    lawReference: 'פסיקת בית הדין הארצי לעבודה'
  },
  {
    id: 2, difficulty: 'קשה', icon: '💼', category: 'התפטרות בדין מפוטר',
    question: 'יוסי התפטר לאחר 11 חודשים עקב הרעה מוחשית בתנאי עבודה. האם זכאי לפיצויי פיטורין?',
    options: [
      { id: 'a', text: 'לא — לא השלים שנה' },
      { id: 'b', text: 'כן — תמיד' },
      { id: 'c', text: 'ייתכן — אם יוכיח שההתפטרות כדין מפוטר' },
      { id: 'd', text: 'רק אם יש חוזה כתוב' }
    ],
    correctAnswer: 'c',
    explanation: 'התפטרות עקב הרעה מוחשית יכולה להיחשב "התפטרות בדין מפוטר" — הדבר מחייב הוכחה שההרעה הייתה ממשית ושהעובד לא הסכים לה.',
    lawReference: 'חוק פיצויי פיטורים, סעיף 11(א)'
  },
  {
    id: 3, difficulty: 'בינוני', icon: '💰', category: 'הלנת שכר',
    question: 'מעסיק שילם לעובד שכר באיחור של 20 יום באופן קבוע. מה המשמעות המשפטית?',
    options: [
      { id: 'a', text: 'אין בעיה אם העובד מסכים' },
      { id: 'b', text: 'מדובר בהלנת שכר' },
      { id: 'c', text: 'רק הפרה חוזית ללא סנקציה' },
      { id: 'd', text: 'עבירה פלילית בלבד' }
    ],
    correctAnswer: 'b',
    explanation: 'איחור בתשלום שכר = הלנת שכר, גם אם העובד שותק. ההסכמה לאיחור אינה מבטלת את הזכות לפיצויי הלנה.',
    lawReference: 'חוק הגנת השכר, סעיפים 17-18'
  },
  {
    id: 4, difficulty: 'בינוני', icon: '📜', category: 'זכויות קוגנטיות',
    question: 'עובדת חתמה על מסמך שבו היא מוותרת על ימי חופשה שנתית בתמורה לתוספת שכר. מה הדין?',
    options: [
      { id: 'a', text: 'ההסכם תקף — חופש החוזים גובר' },
      { id: 'b', text: 'ההסכם בטל' },
      { id: 'c', text: 'תקף חלקית' },
      { id: 'd', text: 'תלוי בשיקול דעת המעסיק' }
    ],
    correctAnswer: 'b',
    explanation: 'זכויות קוגנטיות לא ניתנות לויתור — גם אם העובד הסכים. חופשה שנתית היא זכות קוגנטית לפי חוק חופשה שנתית.',
    lawReference: 'חוק חופשה שנתית, התשי"א-1951'
  },
  {
    id: 5, difficulty: 'קשה', icon: '🏥', category: 'פיטורין במחלה',
    question: 'עובד פוטר במהלך חופשת מחלה, ללא היתר מוקדם מהממונה על יחסי עבודה. מה הדין?',
    options: [
      { id: 'a', text: 'הפיטורין תקפים' },
      { id: 'b', text: 'הפיטורין בטלים' },
      { id: 'c', text: 'רק זכות לפיצוי' },
      { id: 'd', text: 'אין משמעות חוקית למועד הפיטורין' }
    ],
    correctAnswer: 'b',
    explanation: 'פיטורין של עובד בתקופת מחלה ללא היתר מפקיד עבודה הם בטלים. החוק קובע הגנות מפורשות על עובדים חולים.',
    lawReference: 'חוק דמי מחלה, התשל"ו-1976; חוק העסקת עובדים על ידי קבלני כוח אדם'
  }
];

const getResultMessage = (pct: number) => {
  if (pct >= 80) return 'מצוין! שלטת בדיני עבודה — Case Study.';
  if (pct >= 60) return 'טוב! כדאי לחזור על שימוע, הרעה מוחשית ופיטורין במחלה.';
  return 'יש מקום לשיפור. חזור על חוק פיצויי פיטורים וחוק הגנת השכר.';
};

const getDifficultyColor = (d: string) => {
  if (d === 'קל') return 'success';
  if (d === 'קשה') return 'error';
  return 'warning';
};

const LaborLawExam3: React.FC = () => {
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
            <Typography variant="h4" gutterBottom color="primary">💼 תוצאות — Case Study</Typography>
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
            <Typography variant="h4" gutterBottom color="primary">💼 דיני עבודה — Case Study</Typography>
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

export default LaborLawExam3;

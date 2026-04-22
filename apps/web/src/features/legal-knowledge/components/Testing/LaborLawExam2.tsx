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
    difficulty: 'בינוני',
    icon: '⚖️',
    category: 'פיטורין ושימוע',
    question: 'עובד פוטר ללא שימוע מוקדם. מה הדין?',
    options: [
      { id: 'a', text: 'הפיטורין בטלים אוטומטית' },
      { id: 'b', text: 'יש עילה לפיצוי בלבד' },
      { id: 'c', text: 'הפיטורין תקפים תמיד' },
      { id: 'd', text: 'אין משמעות לשימוע' }
    ],
    correctAnswer: 'b',
    explanation: 'אי קיום שימוע הוא פגם מהותי, אך לרוב מוביל לפיצוי כספי ולא לביטול הפיטורין. בית הדין לעבודה פסק שחובת השימוע היא זכות יסוד של העובד.',
    lawReference: 'פסיקת בית הדין הארצי לעבודה'
  },
  {
    id: 2,
    difficulty: 'קל',
    icon: '💰',
    category: 'שכר מינימום',
    question: 'מהו שכר מינימום לפי הדין?',
    options: [
      { id: 'a', text: 'נקבע בהסכם אישי בין הצדדים' },
      { id: 'b', text: 'נקבע בחוק ואינו ניתן לויתור' },
      { id: 'c', text: 'נקבע ע"י המעביד לפי שיקול דעתו' },
      { id: 'd', text: 'משתנה לפי רצון הצדדים' }
    ],
    correctAnswer: 'b',
    explanation: 'שכר מינימום נקבע בחוק שכר מינימום ומהווה רצפה שלא ניתן להתנות עליה לרעת העובד. כל הסכם שמשלם פחות מהמינימום הוא בטל.',
    lawReference: 'חוק שכר מינימום, התשמ"ז-1987'
  },
  {
    id: 3,
    difficulty: 'בינוני',
    icon: '📋',
    category: 'פיצויי פיטורין',
    question: 'מתי עובד זכאי לפיצויי פיטורין?',
    options: [
      { id: 'a', text: 'בכל מקרה של התפטרות' },
      { id: 'b', text: 'רק לאחר 3 חודשי עבודה' },
      { id: 'c', text: 'לאחר שנת עבודה, בתנאים מסוימים' },
      { id: 'd', text: 'רק אם קיים חוזה כתוב' }
    ],
    correctAnswer: 'c',
    explanation: 'עובד שפוטר לאחר שנת עבודה זכאי לפיצויי פיטורין. גם מתפטר יכול להיות זכאי בנסיבות מסוימות כגון מחלה, לידה, העתקת מגורים בשל בן זוג ועוד.',
    lawReference: 'חוק פיצויי פיטורים, התשכ"ג-1963'
  },
  {
    id: 4,
    difficulty: 'קל',
    icon: '⏰',
    category: 'הלנת שכר',
    question: 'מהי הלנת שכר?',
    options: [
      { id: 'a', text: 'תשלום שכר גבוה מהמוסכם' },
      { id: 'b', text: 'אי תשלום שכר במועד הקבוע' },
      { id: 'c', text: 'תשלום שכר במזומן בלבד' },
      { id: 'd', text: 'תשלום שכר חלקי' }
    ],
    correctAnswer: 'b',
    explanation: 'הלנת שכר היא אי תשלום השכר עד ה-1 בחודש שאחרי החודש שבו נצבר, ומזכה בפיצויי הלנה בשיעור גבוה.',
    lawReference: 'חוק הגנת השכר, התשי"ח-1958'
  },
  {
    id: 5,
    difficulty: 'קשה',
    icon: '📜',
    category: 'זכויות קוגנטיות',
    question: 'עובד חתם על מסמך ויתור על זכויות מכוח החוק — האם הויתור תקף?',
    options: [
      { id: 'a', text: 'כן, תמיד — חוזה תקף' },
      { id: 'b', text: 'לא — זכויות קוגנטיות לא ניתנות לויתור' },
      { id: 'c', text: 'כן, רק אם קיבל תמורה כספית' },
      { id: 'd', text: 'תלוי בשיקול דעת המעביד' }
    ],
    correctAnswer: 'b',
    explanation: 'זכויות הנובעות מחוקי מגן כגון פיצויי פיטורין, שכר מינימום, חופשה שנתית — הן זכויות קוגנטיות שאי אפשר לוותר עליהן, גם בהסכמה מפורשת.',
    lawReference: 'עקרון ההגנה על העובד — פסיקה עקבית של בית הדין לעבודה'
  }
];

const getResultMessage = (pct: number) => {
  if (pct >= 80) return 'מצוין! שלטת בחומר דיני העבודה.';
  if (pct >= 60) return 'טוב! כדאי לחזור על נושא הזכויות הקוגנטיות.';
  return 'יש מקום לשיפור. חזור על חוק פיצויי פיטורים וחוק הגנת השכר.';
};

const LaborLawExam2: React.FC = () => {
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
            <Typography variant="h4" gutterBottom color="primary">💼 תוצאות המבחן</Typography>
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
            <Typography variant="h4" gutterBottom color="primary">💼 מבחן דיני עבודה — מתקדם</Typography>
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
              <Chip label={currentQuestion.difficulty} color={getDifficultyColor(currentQuestion.difficulty) as any} size="small" />
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

export default LaborLawExam2;

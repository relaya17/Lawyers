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
    category: 'יסודות עוולת הרשלנות',
    question: 'מהם יסודות עוולת הרשלנות?',
    options: [
      { id: 'a', text: 'נזק בלבד' },
      { id: 'b', text: 'חובת זהירות, הפרתה, נזק וקשר סיבתי' },
      { id: 'c', text: 'כוונה בלבד' },
      { id: 'd', text: 'קיום חוזה בין הצדדים' }
    ],
    correctAnswer: 'b',
    explanation: 'עוולת הרשלנות מורכבת מארבעה יסודות: (1) חובת זהירות — מושגית ומסוימת, (2) הפרת החובה, (3) נזק, (4) קשר סיבתי בין ההפרה לנזק.',
    lawReference: 'פקודת הנזיקין [נוסח חדש], סעיף 35'
  },
  {
    id: 2,
    difficulty: 'בינוני',
    icon: '🏢',
    category: 'אחריות שילוחית',
    question: 'מהי אחריות שילוחית?',
    options: [
      { id: 'a', text: 'אחריות אישית של הנפגע' },
      { id: 'b', text: 'אחריות מעביד למעשי עובדיו בשעת עבודה' },
      { id: 'c', text: 'אחריות המדינה בלבד' },
      { id: 'd', text: 'אחריות פלילית' }
    ],
    correctAnswer: 'b',
    explanation: 'אחריות שילוחית (vicarious liability) מטילה על המעביד אחריות נזיקית בגין מעשי עובדיו שנעשו במסגרת תפקידם, גם אם המעביד עצמו לא התרשל.',
    lawReference: 'פקודת הנזיקין, סעיף 13'
  },
  {
    id: 3,
    difficulty: 'קשה',
    icon: '🔗',
    category: 'קשר סיבתי',
    question: 'מהו המבחן לקשר סיבתי משפטי?',
    options: [
      { id: 'a', text: 'קרבה פיזית בין הצדדים' },
      { id: 'b', text: 'מבחן הצפיות — האם הנזק היה צפוי' },
      { id: 'c', text: 'הזמן שחלף מהאירוע' },
      { id: 'd', text: 'כוונת המזיק' }
    ],
    correctAnswer: 'b',
    explanation: 'הקשר הסיבתי המשפטי נבחן לפי מבחן הצפיות — האם אדם סביר יכול היה לצפות שהתנהגותו תגרום לנזק מסוג זה. זאת בנוסף לקשר עובדתי ("אלמלא").',
    lawReference: 'פסיקת בית המשפט העליון — ע"א 145/80 ועוד'
  },
  {
    id: 4,
    difficulty: 'קל',
    icon: '💔',
    category: 'סוגי נזק',
    question: 'מהו נזק לא ממוני?',
    options: [
      { id: 'a', text: 'הפסד כספי ישיר' },
      { id: 'b', text: 'כאב, סבל ועגמת נפש' },
      { id: 'c', text: 'נזק לרכוש' },
      { id: 'd', text: 'הפסד חוזי' }
    ],
    correctAnswer: 'b',
    explanation: 'נזק לא ממוני כולל כאב וסבל גופני, עגמת נפש, פגיעה באיכות החיים ואובדן תוחלת חיים. הוא מפוצה בסכום כספי לפי שיקול דעת בית המשפט.',
    lawReference: 'פקודת הנזיקין, סעיפים 76-78'
  },
  {
    id: 5,
    difficulty: 'בינוני',
    icon: '⚖️',
    category: 'אשם תורם',
    question: 'הגנת "אשם תורם" — מהי משמעותה?',
    options: [
      { id: 'a', text: 'ביטול מלא של התביעה' },
      { id: 'b', text: 'הפחתה יחסית בפיצוי לפי אחוז אשמת הניזוק' },
      { id: 'c', text: 'הגדלת הפיצוי' },
      { id: 'd', text: 'העברת האחריות לניזוק בלבד' }
    ],
    correctAnswer: 'b',
    explanation: 'כאשר הניזוק תרם לנזקו בהתנהגות רשלנית, בית המשפט מפחית את הפיצוי באחוז המשקף את אשמת הניזוק. למשל: 70% אחריות המזיק, 30% אשם תורם = 70% מהפיצוי.',
    lawReference: 'פקודת הנזיקין, סעיף 68'
  }
];

const TortLawExam2: React.FC = () => {
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
            <Typography variant="h4" gutterBottom color="primary">⚖️ תוצאות המבחן</Typography>
            <Typography variant="h2" color={pct >= 70 ? 'success.main' : 'error.main'} gutterBottom>
              {pct}%
            </Typography>
            <Typography variant="h6" gutterBottom>
              {score} נכונות מתוך {questions.length} שאלות
            </Typography>
            <Alert severity={pct >= 70 ? 'success' : 'warning'} sx={{ my: 3 }}>
              {pct >= 80 ? 'מצוין! שלטת בחומר דיני הנזיקין.' :
               pct >= 60 ? 'טוב! כדאי לחזור על יסודות הרשלנות.' :
               'יש מקום לשיפור. חזור על פקודת הנזיקין.'}
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
            <Typography variant="h4" gutterBottom color="primary">⚖️ מבחן דיני נזיקין — מתקדם</Typography>
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

export default TortLawExam2;

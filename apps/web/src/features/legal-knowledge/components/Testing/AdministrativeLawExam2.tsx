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
    icon: '🏛️',
    category: 'עקרון החוקיות',
    question: 'עקרון החוקיות במשפט המנהלי קובע כי:',
    options: [
      { id: 'a', text: 'הרשות הציבורית רשאית לעשות כל מה שאינו אסור' },
      { id: 'b', text: 'הרשות הציבורית פועלת לפי הסמכה מפורשת בחוק בלבד' },
      { id: 'c', text: 'אין מגבלות על שיקול הדעת המנהלי' },
      { id: 'd', text: 'רק בתי משפט כפופים לחוק' }
    ],
    correctAnswer: 'b',
    explanation: 'עקרון החוקיות קובע שרשות ציבורית חייבת להצביע על הסמכה חוקית לכל פעולה. בניגוד לאדם פרטי, הרשות אינה רשאית לעשות מה שאינו אסור — אלא רק מה שהוסמכה לעשות.',
    lawReference: 'חוק יסוד: השפיטה; פסיקת בג"ץ'
  },
  {
    id: 2,
    difficulty: 'קל',
    icon: '🗣️',
    category: 'שימוע',
    question: 'מהו שימוע במשפט המנהלי?',
    options: [
      { id: 'a', text: 'עונש מנהלי' },
      { id: 'b', text: 'זכות האזרח להשמיע טענותיו לפני קבלת החלטה הפוגעת בו' },
      { id: 'c', text: 'חוזה עם הרשות' },
      { id: 'd', text: 'פיצוי כספי' }
    ],
    correctAnswer: 'b',
    explanation: 'השימוע הוא זכות יסוד — הרשות חייבת לאפשר לאזרח להציג את עמדתו לפני שמתקבלת החלטה שפוגעת בו. אי קיום שימוע מהווה פגם מהותי המצדיק ביטול ההחלטה.',
    lawReference: 'עקרון הצדק הטבעי; בג"ץ 3/58 ועוד'
  },
  {
    id: 3,
    difficulty: 'בינוני',
    icon: '🚫',
    category: 'שיקולים זרים',
    question: 'מהם "שיקולים זרים" שפוסלים החלטה מנהלית?',
    options: [
      { id: 'a', text: 'שיקולים מקצועיים ענייניים' },
      { id: 'b', text: 'שיקולים שאינם רלוונטיים למטרת ההסמכה' },
      { id: 'c', text: 'שיקולים הנובעים מהחוק המסמיך' },
      { id: 'd', text: 'שיקולים כספיים לגיטימיים' }
    ],
    correctAnswer: 'b',
    explanation: 'רשות שפועלת משיקולים שאינם רלוונטיים לתכלית שלשמה הוסמכה, פועלת בחוסר סמכות. לדוגמה: שיקולים פוליטיים במינוי מקצועי.',
    lawReference: 'פסיקת בג"ץ — עילת הסבירות וחוסר הסמכות'
  },
  {
    id: 4,
    difficulty: 'קשה',
    icon: '📏',
    category: 'עילת הסבירות',
    question: 'מהי "סבירות" כעילה לביקורת שיפוטית על החלטה מנהלית?',
    options: [
      { id: 'a', text: 'החלטה שהיא מושלמת בכל היבטיה' },
      { id: 'b', text: 'החלטה שנופלת בתוך מתחם הסבירות שרשות סבירה הייתה מקבלת' },
      { id: 'c', text: 'החלטה שרירותית לחלוטין' },
      { id: 'd', text: 'החלטה המועדפת פוליטית' }
    ],
    correctAnswer: 'b',
    explanation: 'בית המשפט לא בוחן אם ההחלטה היא הטובה ביותר, אלא אם היא נופלת במתחם הסבירות. רק החלטה שחורגת ממתחם זה בצורה קיצונית תיפסל. לאחרונה הוגבלה עילה זו בתיקון לחוק יסוד: השפיטה.',
    lawReference: 'חוק יסוד: השפיטה (תיקון 2023); בג"ץ 6163/92'
  },
  {
    id: 5,
    difficulty: 'קל',
    icon: '📂',
    category: 'חופש המידע',
    question: 'חוק חופש המידע, התשנ"ח-1998, מאפשר:',
    options: [
      { id: 'a', text: 'סודיות מלאה של פעילות הממשלה' },
      { id: 'b', text: 'גישה של כל אזרח למידע המוחזק בידי רשויות ציבוריות' },
      { id: 'c', text: 'חסימת מידע מכל אדם' },
      { id: 'd', text: 'גישה לעובדי מדינה בלבד' }
    ],
    correctAnswer: 'b',
    explanation: 'חוק חופש המידע מעגן את זכות הציבור לקבל מידע מרשויות ציבוריות. כל אזרח רשאי לפנות ולבקש מידע, וחריגי הסודיות מצומצמים (ביטחון לאומי, פרטיות וכו\').',
    lawReference: 'חוק חופש המידע, התשנ"ח-1998'
  }
];

const getResultMessage = (pct: number) => {
  if (pct >= 80) return 'מצוין! שלטת בחומר המשפט המנהלי.';
  if (pct >= 60) return 'טוב! כדאי לחזור על עקרון החוקיות ועילת הסבירות.';
  return 'יש מקום לשיפור. חזור על עילות הביקורת השיפוטית.';
};

const AdministrativeLawExam2: React.FC = () => {
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
            <Typography variant="h4" gutterBottom color="primary">🏛️ תוצאות המבחן</Typography>
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
            <Typography variant="h4" gutterBottom color="primary">🏛️ מבחן משפט מנהלי</Typography>
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
              <Chip label={currentQuestion.difficulty} color={getDifficultyColor(currentQuestion.difficulty)} size="small" />
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

export default AdministrativeLawExam2;

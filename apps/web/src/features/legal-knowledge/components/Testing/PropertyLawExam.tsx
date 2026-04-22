import React, { useState } from 'react';
import {
  Box, Container, Typography, Card, CardContent, Button,
  Radio, RadioGroup, FormControlLabel, FormControl,
  Chip, LinearProgress, Alert
} from '@mui/material';

interface Question {
  id: number;
  type: 'multiple-choice' | 'true-false' | 'case-study';
  difficulty: 'קל' | 'בינוני' | 'קשה' | 'קשה מאוד';
  icon: string;
  category: string;
  question: string;
  options?: { id: string; text: string }[];
  correctAnswer: string;
  explanation: string;
  lawReference?: string;
}

const questions: Question[] = [
  {
    id: 1, type: 'multiple-choice', difficulty: 'בינוני', icon: '🏠',
    category: 'חוק המקרקעין',
    question: 'מהי הגדרת "מקרקעין" לפי חוק המקרקעין, תשכ"ט–1969?',
    options: [
      { id: 'a', text: 'קרקע בלבד' },
      { id: 'b', text: 'קרקע וכל הבנוי והנטוע עליה' },
      { id: 'c', text: 'כל נכס מוחשי' },
      { id: 'd', text: 'בית מגורים בלבד' }
    ],
    correctAnswer: 'b',
    explanation: 'לפי סעיף 1 לחוק המקרקעין תשכ"ט–1969, "מקרקעין" הם קרקע, כל הבנוי והנטוע עליה וכל דבר אחר המחובר אליה חיבור של קבע.',
    lawReference: 'סעיף 1 לחוק המקרקעין, תשכ"ט–1969'
  },
  {
    id: 2, type: 'multiple-choice', difficulty: 'בינוני', icon: '📋',
    category: 'רישום מקרקעין',
    question: 'מתי עסקת מקרקעין תקפה כלפי צדדים שלישיים?',
    options: [
      { id: 'a', text: 'עם חתימת החוזה' },
      { id: 'b', text: 'עם תשלום מלוא התמורה' },
      { id: 'c', text: 'עם רישומה בפנקסי המקרקעין (טאבו)' },
      { id: 'd', text: 'עם קבלת החזקה בנכס' }
    ],
    correctAnswer: 'c',
    explanation: 'לפי סעיף 7 לחוק המקרקעין, עסקה במקרקעין טעונה רישום, ועד לרישומה היא אינה תקפה כלפי צדדים שלישיים.',
    lawReference: 'סעיף 7 לחוק המקרקעין, תשכ"ט–1969'
  },
  {
    id: 3, type: 'case-study', difficulty: 'קשה', icon: '⚖️',
    category: 'זכות קדימה',
    question: 'ראובן ושמעון בעלים משותפים במקרקעין. ראובן מעוניין למכור את חלקו ללוי. מה זכותו של שמעון?',
    options: [
      { id: 'a', text: 'אין לשמעון כל זכות' },
      { id: 'b', text: 'שמעון זכאי לדמי פירוק שותפות' },
      { id: 'c', text: 'שמעון זכאי לרכוש את חלק ראובן בתנאי המכירה ללוי (זכות קדימה)' },
      { id: 'd', text: 'שמעון יכול לבטל את המכירה ללוי ללא הגבלה' }
    ],
    correctAnswer: 'c',
    explanation: 'סעיף 101 לחוק המקרקעין מעניק לשותף זכות קדימה לרכוש את חלקו של השותף המוכר בתנאים זהים לעסקה המוצעת.',
    lawReference: 'סעיף 101 לחוק המקרקעין, תשכ"ט–1969'
  },
  {
    id: 4, type: 'true-false', difficulty: 'קל', icon: '🔑',
    category: 'שכירות',
    question: 'שכירות לתקופה שאינה עולה על 5 שנים אינה טעונה רישום בפנקסי המקרקעין',
    correctAnswer: 'true',
    explanation: 'נכון. לפי סעיף 79 לחוק המקרקעין, שכירות לתקופה שאינה עולה על 5 שנים אינה טעונה רישום ותקפה גם ללא רישום.',
    lawReference: 'סעיף 79 לחוק המקרקעין'
  },
  {
    id: 5, type: 'multiple-choice', difficulty: 'קשה', icon: '🏗️',
    category: 'זיקת הנאה',
    question: 'מהי זיקת הנאה לפי חוק המקרקעין?',
    options: [
      { id: 'a', text: 'זכות בעלות על מקרקעין' },
      { id: 'b', text: 'זכות שימוש מוגבלת במקרקעין של אחר לטובת מקרקעין אחרים או לטובת אדם' },
      { id: 'c', text: 'זכות שכירות לטווח ארוך' },
      { id: 'd', text: 'זכות לקבל דמי שכירות' }
    ],
    correctAnswer: 'b',
    explanation: 'זיקת הנאה (סעיף 5 לחוק המקרקעין) היא זכות שימוש מוגבלת במקרקעין של אחר, לטובת מקרקעין גובלים (זיקת הנאה כשרות) או לטובת אדם מסוים.',
    lawReference: 'סעיפים 5, 92–101 לחוק המקרקעין'
  },
  {
    id: 6, type: 'case-study', difficulty: 'קשה מאוד', icon: '🏛️',
    category: 'הסכם שיתוף',
    question: 'שלושה שותפים במגרש. שניים מהם רוצים לבנות, השלישי מסרב. מה הדין?',
    options: [
      { id: 'a', text: 'ללא הסכמת כל השותפים אי אפשר לפעול' },
      { id: 'b', text: 'הרוב יכול לפעול ללא הגבלה' },
      { id: 'c', text: 'בית המשפט יכול להורות על פירוק השיתוף' },
      { id: 'd', text: 'השלישי חייח להתפשר' }
    ],
    correctAnswer: 'c',
    explanation: 'לפי סעיף 37 לחוק המקרקעין, כל שותף יכול לתבוע בית משפט לצוות על פירוק השיתוף. פירוק השיתוף יכול להיעשות בחלוקה בעין, בהפחתה ובמכירה.',
    lawReference: 'סעיפים 27–42 לחוק המקרקעין'
  },
  {
    id: 7, type: 'multiple-choice', difficulty: 'בינוני', icon: '💼',
    category: 'משכנתא',
    question: 'מהו תפקיד המשכנתא כבטוחה?',
    options: [
      { id: 'a', text: 'העברת הבעלות לנושה' },
      { id: 'b', text: 'שעבוד מקרקעין כבטוחה לקיום חיוב, תוך שמירת הבעלות בידי הממשכן' },
      { id: 'c', text: 'איסור מכירת הנכס' },
      { id: 'd', text: 'זכות שכירות לנושה' }
    ],
    correctAnswer: 'b',
    explanation: 'משכנתא (סעיפים 85–87 לחוק המקרקעין) היא שעבוד מקרקעין לטובת הנושה, תוך שהממשכן שומר על הבעלות. לנושה זכות לממש את המשכנתא אם החוב לא ישולם.',
    lawReference: 'סעיפים 85–87 לחוק המקרקעין'
  },
  {
    id: 8, type: 'true-false', difficulty: 'בינוני', icon: '📝',
    category: 'חוק המכר דירות',
    question: 'על פי חוק המכר (דירות) תשל"ג–1973, קבלן חייב למסור לרוכש תשריט ומפרט טכני לפני כריתת החוזה',
    correctAnswer: 'true',
    explanation: 'נכון. חוק המכר דירות חייב את הקבלן למסור לרוכש מסמכים מפורטים לפני כריתת החוזה, כולל תשריט, מפרט טכני ורשימת ציוד.',
    lawReference: 'חוק המכר (דירות), תשל"ג–1973'
  }
];

const PropertyLawExam: React.FC = () => {
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
    if (currentQuestionIndex > 0) setCurrentQuestionIndex(prev => prev - 1);
  };

  const finishExam = () => {
    const correctAnswers = questions.filter(q => selectedAnswers[q.id] === q.correctAnswer).length;
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
    switch (d) {
      case 'קל': return 'success';
      case 'בינוני': return 'warning';
      case 'קשה': return 'error';
      default: return 'error';
    }
  };

  if (examCompleted) {
    const percentage = Math.round((score / questions.length) * 100);
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Card elevation={4}>
          <CardContent sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h4" gutterBottom color="primary">🏠 מבחן דיני קניין ומקרקעין הושלם!</Typography>
            <Box sx={{ my: 3 }}>
              <Typography variant="h2" color={percentage >= 70 ? 'success.main' : 'error.main'}>{score}/{questions.length}</Typography>
              <Typography variant="h5" color="text.secondary">{percentage}%</Typography>
            </Box>
            <Alert severity={percentage >= 70 ? 'success' : 'warning'} sx={{ mb: 3 }}>
              {percentage >= 70 ? 'כל הכבוד! הצגת ידע טוב בדיני קניין ומקרקעין' : 'מומלץ לחזור על חוק המקרקעין תשכ"ט–1969 ולנסות שוב'}
            </Alert>
            <Button variant="contained" onClick={resetExam}>🔄 מבחן חדש</Button>
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
            <Typography variant="h4" gutterBottom color="primary">🏠 מבחן דיני קניין ומקרקעין</Typography>
            <Typography variant="body1" color="text.secondary">שאלה {currentQuestionIndex + 1} מתוך {questions.length}</Typography>
            <LinearProgress variant="determinate" value={((currentQuestionIndex + 1) / questions.length) * 100} sx={{ mt: 2 }} />
          </Box>
          <Box sx={{ mb: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, flexWrap: 'wrap', gap: 1 }}>
              <Typography variant="h6">{currentQuestion.icon}</Typography>
              <Chip label={currentQuestion.category} color="primary" variant="outlined" />
              <Chip label={currentQuestion.difficulty} color={getDifficultyColor(currentQuestion.difficulty)} size="small" />
              {currentQuestion.lawReference && (
                <Chip label={currentQuestion.lawReference} variant="outlined" size="small" sx={{ fontSize: '0.65rem' }} />
              )}
            </Box>
            <Typography variant="h6" paragraph>{currentQuestion.question}</Typography>
            {currentQuestion.options && (
              <FormControl component="fieldset" fullWidth>
                <RadioGroup value={selectedAnswers[currentQuestion.id] || ''} onChange={(e) => handleAnswerSelect(e.target.value)}>
                  {currentQuestion.options.map((option) => (
                    <FormControlLabel key={option.id} value={option.id} control={<Radio />} label={option.text} sx={{ mb: 1 }} />
                  ))}
                </RadioGroup>
              </FormControl>
            )}
            {currentQuestion.type === 'true-false' && !currentQuestion.options && (
              <FormControl component="fieldset" fullWidth>
                <RadioGroup value={selectedAnswers[currentQuestion.id] || ''} onChange={(e) => handleAnswerSelect(e.target.value)}>
                  <FormControlLabel value="true" control={<Radio />} label="נכון" sx={{ mb: 1 }} />
                  <FormControlLabel value="false" control={<Radio />} label="לא נכון" />
                </RadioGroup>
              </FormControl>
            )}
            {selectedAnswers[currentQuestion.id] && (
              <Alert severity={selectedAnswers[currentQuestion.id] === currentQuestion.correctAnswer ? 'success' : 'error'} sx={{ mt: 2 }}>
                {currentQuestion.explanation}
              </Alert>
            )}
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button variant="outlined" onClick={handlePrevious} disabled={currentQuestionIndex === 0}>שאלה קודמת</Button>
            <Button variant="contained" onClick={handleNext} disabled={!selectedAnswers[currentQuestion.id]}>
              {currentQuestionIndex === questions.length - 1 ? 'סיום מבחן' : 'שאלה הבאה'}
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default PropertyLawExam;

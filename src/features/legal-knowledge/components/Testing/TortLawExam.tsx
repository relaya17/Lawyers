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
  type: 'multiple-choice' | 'true-false' | 'case-study';
  difficulty: 'קל' | 'בינוני' | 'קשה' | 'קשה מאוד';
  icon: string;
  category: string;
  question: string;
  options?: { id: string; text: string }[];
  correctAnswer: string;
  explanation: string;
  precedent?: string;
  lawReference?: string;
}

const questions: Question[] = [
  // חלק א' - יסודות דיני נזיקין
  {
    id: 1,
    type: 'multiple-choice',
    difficulty: 'בינוני',
    icon: '⚖️',
    category: 'עוולת הרשלנות',
    question: 'מה היסודות הנדרשים להוכחת עוולת הרשלנות?',
    options: [
      { id: 'a', text: 'נזק וקשר סיבתי בלבד' },
      { id: 'b', text: 'חובת זהירות, הפרה, נזק וקשר סיבתי' },
      { id: 'c', text: 'כוונה לפגוע בלבד' },
      { id: 'd', text: 'נזק כספי בלבד' }
    ],
    correctAnswer: 'b',
    explanation: 'עוולת הרשלנות דורשת ארבעה יסודות: חובת זהירות, הפרת החובה, נזק וקשר סיבתי בין ההפרה לנזק.',
    lawReference: 'סעיף 35 לפקודת הנזיקין'
  },
  {
    id: 2,
    type: 'case-study',
    difficulty: 'קשה',
    icon: '🏥',
    category: 'רשלנות רפואית',
    question: 'רופא שגרם לנזק לחולה עקב טעות מקצועית. מה הדין?',
    options: [
      { id: 'a', text: 'לא אחראי כי פעל בתום לב' },
      { id: 'b', text: 'אחראי רק אם פעל ברשלנות קיצונית' },
      { id: 'c', text: 'אחראי אם הפר את חובת הזהירות המקצועית' },
      { id: 'd', text: 'אחראי רק אם התכוון לפגוע' }
    ],
    correctAnswer: 'c',
    explanation: 'רופא אחראי בנזיקין אם הפר את חובת הזהירות המקצועית שלו כלפי החולה, גם אם לא התכוון לפגוע.',
    precedent: 'פס"ד בית המשפט העליון - רשלנות רפואית',
    lawReference: 'סעיף 35 לפקודת הנזיקין'
  },
  {
    id: 3,
    type: 'multiple-choice',
    difficulty: 'בינוני',
    icon: '💰',
    category: 'פיצויים',
    question: 'מה סוגי הפיצויים העיקריים בדיני נזיקין?',
    options: [
      { id: 'a', text: 'פיצוי כספי בלבד' },
      { id: 'b', text: 'פיצוי כספי ופיצוי עונשי' },
      { id: 'c', text: 'פיצוי כספי, פיצוי עונשי ופיצוי עונשי' },
      { id: 'd', text: 'פיצוי כספי, פיצוי עונשי ופיצוי עונשי' }
    ],
    correctAnswer: 'b',
    explanation: 'הפיצויים העיקריים בדיני נזיקין הם פיצוי כספי (פיצוי נזיקי) ופיצוי עונשי (פיצוי עונשי).',
    lawReference: 'פקודת הנזיקין'
  },
  {
    id: 4,
    type: 'true-false',
    difficulty: 'קל',
    icon: '🛡️',
    category: 'אחריות',
    question: 'הורה אחראי בנזיקין על מעשי ילדו הקטין',
    correctAnswer: 'true',
    explanation: 'כן, הורה אחראי בנזיקין על מעשי ילדו הקטין לפי סעיף 13 לפקודת הנזיקין.',
    lawReference: 'סעיף 13 לפקודת הנזיקין'
  },
  {
    id: 5,
    type: 'case-study',
    difficulty: 'קשה מאוד',
    icon: '🏢',
    category: 'אחריות מעביד',
    question: 'עובד גרם נזק לאדם שלישי במהלך עבודתו. מי אחראי?',
    options: [
      { id: 'a', text: 'העובד בלבד' },
      { id: 'b', text: 'המעביד בלבד' },
      { id: 'c', text: 'המעביד והעובד יחד' },
      { id: 'd', text: 'אין אחריות' }
    ],
    correctAnswer: 'c',
    explanation: 'המעביד אחראי בנזיקין על מעשי עובדו במהלך עבודתו, אך העובד יכול להיות אחראי גם כן.',
    precedent: 'פס"ד בית המשפט העליון - אחריות מעביד',
    lawReference: 'סעיף 12 לפקודת הנזיקין'
  }
];

const TortLawExam: React.FC = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [examCompleted, setExamCompleted] = useState(false);
  const [score, setScore] = useState(0);

  const currentQuestion = questions[currentQuestionIndex];

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: answer
    }));
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
    questions.forEach(question => {
      if (selectedAnswers[question.id] === question.correctAnswer) {
        correctAnswers++;
      }
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

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'קל': return 'success';
      case 'בינוני': return 'warning';
      case 'קשה': return 'error';
      case 'קשה מאוד': return 'error';
      default: return 'default';
    }
  };

  if (examCompleted) {
    const percentage = Math.round((score / questions.length) * 100);
    
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Card elevation={4}>
          <CardContent sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h4" gutterBottom color="primary">
              ⚖️ מבחן דיני נזיקין הושלם!
            </Typography>
            
            <Box sx={{ my: 3 }}>
              <Typography variant="h2" color={percentage >= 70 ? 'success.main' : 'error.main'}>
                {score}/{questions.length}
              </Typography>
              <Typography variant="h5" color="text.secondary">
                {percentage}%
              </Typography>
            </Box>

            <Alert severity={percentage >= 70 ? 'success' : 'warning'} sx={{ mb: 3 }}>
              {percentage >= 70 
                ? 'כל הכבוד! הצגת ידע טוב בדיני נזיקין'
                : 'מומלץ לחזור על החומר ולנסות שוב'
              }
            </Alert>

            <Button variant="contained" onClick={resetExam} sx={{ mr: 2 }}>
              🔄 מבחן חדש
            </Button>
          </CardContent>
        </Card>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Card elevation={4}>
        <CardContent sx={{ p: 4 }}>
          {/* Header */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="h4" gutterBottom color="primary">
              ⚖️ מבחן דיני נזיקין
            </Typography>
            <Typography variant="body1" color="text.secondary">
              שאלה {currentQuestionIndex + 1} מתוך {questions.length}
            </Typography>
            <LinearProgress 
              variant="determinate" 
              value={((currentQuestionIndex + 1) / questions.length) * 100} 
              sx={{ mt: 2 }}
            />
          </Box>

          {/* Question */}
          <Box sx={{ mb: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" sx={{ mr: 2 }}>
                {currentQuestion.icon}
              </Typography>
              <Chip 
                label={currentQuestion.category}
                color="primary"
                variant="outlined"
                sx={{ mr: 2 }}
              />
              <Chip 
                label={currentQuestion.difficulty}
                color={getDifficultyColor(currentQuestion.difficulty) as any}
                size="small"
              />
            </Box>

            <Typography variant="h6" paragraph>
              {currentQuestion.question}
            </Typography>

            {/* Options */}
            {currentQuestion.options && (
              <FormControl component="fieldset" fullWidth>
                <RadioGroup
                  value={selectedAnswers[currentQuestion.id] || ''}
                  onChange={(e) => handleAnswerSelect(e.target.value)}
                >
                  {currentQuestion.options.map((option) => (
                    <FormControlLabel
                      key={option.id}
                      value={option.id}
                      control={<Radio />}
                      label={option.text}
                      sx={{ mb: 1 }}
                    />
                  ))}
                </RadioGroup>
              </FormControl>
            )}

            {/* True/False */}
            {currentQuestion.type === 'true-false' && (
              <FormControl component="fieldset" fullWidth>
                <RadioGroup
                  value={selectedAnswers[currentQuestion.id] || ''}
                  onChange={(e) => handleAnswerSelect(e.target.value)}
                >
                  <FormControlLabel
                    value="true"
                    control={<Radio />}
                    label="נכון"
                    sx={{ mb: 1 }}
                  />
                  <FormControlLabel
                    value="false"
                    control={<Radio />}
                    label="לא נכון"
                  />
                </RadioGroup>
              </FormControl>
            )}
          </Box>

          {/* Navigation */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button
              variant="outlined"
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0}
            >
              שאלה קודמת
            </Button>

            <Button
              variant="contained"
              onClick={handleNext}
              disabled={!selectedAnswers[currentQuestion.id]}
            >
              {currentQuestionIndex === questions.length - 1 ? 'סיום מבחן' : 'שאלה הבאה'}
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default TortLawExam;

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
  // חלק א' - יסודות דיני עבודה
  {
    id: 1,
    type: 'multiple-choice',
    difficulty: 'בינוני',
    icon: '💼',
    category: 'חוזה עבודה',
    question: 'מה הדין לגבי חוזה עבודה בעל פה?',
    options: [
      { id: 'a', text: 'לא חוקי' },
      { id: 'b', text: 'חוקי רק לתקופה קצרה' },
      { id: 'c', text: 'חוקי לחלוטין' },
      { id: 'd', text: 'חוקי רק לעובדים זמניים' }
    ],
    correctAnswer: 'c',
    explanation: 'חוזה עבודה בעל פה הוא חוקי לחלוטין בישראל. החוק אינו דורש כתיבה פורמלית לחוזה עבודה.',
    lawReference: 'חוק חוזה עבודה, התשכ"ט-1969'
  },
  {
    id: 2,
    type: 'case-study',
    difficulty: 'קשה',
    icon: '⚖️',
    category: 'פיטורין',
    question: 'עובד פוטר ללא הודעה מוקדמת. מה הזכויות שלו?',
    options: [
      { id: 'a', text: 'אין לו זכויות' },
      { id: 'b', text: 'זכאי רק לפיצויי פיטורין' },
      { id: 'c', text: 'זכאי להודעה מוקדמת ופיצויי פיטורין' },
      { id: 'd', text: 'זכאי רק להודעה מוקדמת' }
    ],
    correctAnswer: 'c',
    explanation: 'עובד שפוטר ללא הודעה מוקדמת זכאי הן לתשלום הודעה מוקדמת והן לפיצויי פיטורין.',
    precedent: 'פס"ד בית הדין לעבודה - זכויות עובד שפוטר',
    lawReference: 'חוק הודעה מוקדמת לפיטורין ולפרישה, התשס"א-2001'
  },
  {
    id: 3,
    type: 'multiple-choice',
    difficulty: 'בינוני',
    icon: '💰',
    category: 'שכר מינימום',
    question: 'מה שכר המינימום הנוכחי בישראל?',
    options: [
      { id: 'a', text: '5,000 ₪' },
      { id: 'b', text: '5,571.75 ₪' },
      { id: 'c', text: '6,000 ₪' },
      { id: 'd', text: '7,000 ₪' }
    ],
    correctAnswer: 'b',
    explanation: 'שכר המינימום הנוכחי בישראל הוא 5,571.75 ₪ לחודש עבודה מלא (186 שעות).',
    lawReference: 'צו הרחבה לשכר מינימום'
  },
  {
    id: 4,
    type: 'true-false',
    difficulty: 'קל',
    icon: '⏰',
    category: 'שעות עבודה',
    question: 'עובד יכול לעבוד יותר מ-8 שעות ביום ללא אישור מיוחד',
    correctAnswer: 'false',
    explanation: 'עובד לא יכול לעבוד יותר מ-8 שעות ביום ללא אישור מיוחד של שר העבודה.',
    lawReference: 'חוק שעות עבודה ומנוחה, התשי"א-1951'
  },
  {
    id: 5,
    type: 'case-study',
    difficulty: 'קשה מאוד',
    icon: '🏥',
    category: 'בריאות ובטיחות',
    question: 'עובד נפגע בתאונת עבודה. מה הזכויות שלו?',
    options: [
      { id: 'a', text: 'זכאי רק לטיפול רפואי' },
      { id: 'b', text: 'זכאי לטיפול רפואי ופיצוי' },
      { id: 'c', text: 'זכאי לטיפול רפואי, פיצוי ודמי פגיעה' },
      { id: 'd', text: 'זכאי רק לדמי פגיעה' }
    ],
    correctAnswer: 'c',
    explanation: 'עובד שנפגע בתאונת עבודה זכאי לטיפול רפואי מלא, פיצוי בגין הנזק ודמי פגיעה מהביטוח הלאומי.',
    precedent: 'פס"ד בית הדין לעבודה - תאונות עבודה',
    lawReference: 'חוק הביטוח הלאומי, התשכ"ח-1968'
  }
];

const LaborLawExam: React.FC = () => {
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
              💼 מבחן דיני עבודה הושלם!
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
                ? 'כל הכבוד! הצגת ידע טוב בדיני עבודה'
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
              💼 מבחן דיני עבודה
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

export default LaborLawExam;

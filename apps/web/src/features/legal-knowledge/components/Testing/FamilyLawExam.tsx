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
  // חלק א' - נישואין וגירושין
  {
    id: 1,
    type: 'multiple-choice',
    difficulty: 'בינוני',
    icon: '💒',
    category: 'נישואין',
    question: 'מה הדין לגבי נישואין אזרחיים בישראל?',
    options: [
      { id: 'a', text: 'אסורים לחלוטין' },
      { id: 'b', text: 'מותרים רק לזוגות מעורבים' },
      { id: 'c', text: 'מותרים רק בחו"ל' },
      { id: 'd', text: 'מותרים רק לחסרי דת' }
    ],
    correctAnswer: 'c',
    explanation: 'נישואין אזרחיים בישראל מותרים רק בחו"ל. בתי המשפט בישראל מכירים בנישואין אזרחיים שנערכו בחו"ל.',
    lawReference: 'חוק שיפוט בתי דין רבניים (נישואין וגירושין), התשי"ג-1953'
  },
  {
    id: 2,
    type: 'case-study',
    difficulty: 'קשה',
    icon: '⚖️',
    category: 'גירושין',
    question: 'אישה מסרבת לקבל גט מבעלה. מה הדין?',
    options: [
      { id: 'a', text: 'הבעל יכול לגרש בעל כורחה' },
      { id: 'b', text: 'בית הדין יכול לכפות גט' },
      { id: 'c', text: 'הבעל יכול לקבל היתר נישואין' },
      { id: 'd', text: 'הבעל יכול להתחתן עם אישה נוספת' }
    ],
    correctAnswer: 'c',
    explanation: 'במקרה של סרבנות גט, הבעל יכול לפנות לבית הדין הרבני ולבקש היתר נישואין עם אישה נוספת.',
    precedent: 'פס"ד בית הדין הרבני הגדול - היתר נישואין במקרה של סרבנות גט',
    lawReference: 'חוק שיפוט בתי דין רבניים'
  },
  {
    id: 3,
    type: 'multiple-choice',
    difficulty: 'בינוני',
    icon: '💰',
    category: 'מזונות',
    question: 'עד איזה גיל חייב אב במזונות ילדיו?',
    options: [
      { id: 'a', text: 'עד גיל 18' },
      { id: 'b', text: 'עד גיל 21' },
      { id: 'c', text: 'עד גיל 24' },
      { id: 'd', text: 'עד גיל 25' }
    ],
    correctAnswer: 'a',
    explanation: 'האב חייב במזונות ילדיו עד גיל 18. לאחר מכן, אם הילד לומד, החובה נמשכת עד גיל 21.',
    lawReference: 'חוק לתיקון דיני המשפחה (מזונות), התשי"ט-1959'
  },
  {
    id: 4,
    type: 'true-false',
    difficulty: 'קל',
    icon: '👶',
    category: 'משמורת',
    question: 'במקרה של גירושין, האם תמיד מקבלת משמורת על הילדים',
    correctAnswer: 'false',
    explanation: 'לא תמיד. בית המשפט בוחן את טובת הילד ומחליט מי ההורה המתאים למשמורת. כיום יש נטייה למשמורת משותפת.',
    lawReference: 'חוק הכשרות המשפטית והאפוטרופסות, התשכ"ב-1962'
  },
  {
    id: 5,
    type: 'case-study',
    difficulty: 'קשה מאוד',
    icon: '🏠',
    category: 'חלוקת רכוש',
    question: 'זוג נשוי 20 שנה מתגרש. איך יחולק הרכוש המשותף?',
    options: [
      { id: 'a', text: '50-50 תמיד' },
      { id: 'b', text: 'לפי תרומת כל צד' },
      { id: 'c', text: 'לפי הסכם ממון' },
      { id: 'd', text: 'לפי החלטת בית המשפט' }
    ],
    correctAnswer: 'a',
    explanation: 'בנישואין בישראל חל חזקת השיתוף. כל הרכוש שנצבר במהלך הנישואין נחשב משותף ומתחלק 50-50.',
    precedent: 'פס"ד נחשון - חזקת השיתוף ברכוש',
    lawReference: 'חזקת השיתוף - פסיקה'
  }
];

const FamilyLawExam: React.FC = () => {
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

  const getDifficultyColor = (difficulty: string): 'success' | 'warning' | 'error' | 'default' => {
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
              🏛️ מבחן דיני משפחה הושלם!
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
                ? 'כל הכבוד! הצגת ידע טוב בדיני משפחה'
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
              🏛️ מבחן דיני משפחה
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
                color={getDifficultyColor(currentQuestion.difficulty)}
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

export default FamilyLawExam;

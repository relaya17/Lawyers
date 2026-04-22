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
    id: 1, type: 'multiple-choice', difficulty: 'בינוני', icon: '🏛️',
    category: 'עקרונות יסוד',
    question: 'מהו עקרון "חוקיות המינהל" במשפט המינהלי הישראלי?',
    options: [
      { id: 'a', text: 'הרשות רשאית לעשות כל דבר שאינו אסור בחוק' },
      { id: 'b', text: 'הרשות רשאית לפעול רק בגבולות הסמכות שהוקנתה לה בחוק' },
      { id: 'c', text: 'הרשות מחויבת לפעול לפי הוראות הממשלה בלבד' },
      { id: 'd', text: 'הרשות יכולה לפעול לפי שיקול דעתה הבלעדי' }
    ],
    correctAnswer: 'b',
    explanation: 'עקרון חוקיות המינהל קובע שרשות מינהלית רשאית לפעול אך ורק בגבולות הסמכות המוקנית לה בחוק. כל פעולה חורגת מסמכות בטלה.',
    lawReference: 'חוק יסוד: משק המדינה; פסיקת בג"ץ'
  },
  {
    id: 2, type: 'multiple-choice', difficulty: 'בינוני', icon: '⚖️',
    category: 'עילות ביקורת שיפוטית',
    question: 'מהי "עילת חוסר סבירות" המקנה לבית המשפט הגבוה לצדק לבטל החלטה מינהלית?',
    options: [
      { id: 'a', text: 'החלטה שאינה נראית נכונה לבית המשפט' },
      { id: 'b', text: 'החלטה שחרגה באופן קיצוני מגבולות הסבירות עד שאף רשות סבירה לא הייתה מקבלת אותה' },
      { id: 'c', text: 'כל החלטה שנגדה הוגרה עתירה' },
      { id: 'd', text: 'החלטה שנתקבלה ללא שימוע' }
    ],
    correctAnswer: 'b',
    explanation: 'עילת חוסר הסבירות (מבחן "Wednesbury") מחייבת שהחלטה תחרוג באופן קיצוני וברור ממה שרשות סבירה הייתה מחליטה. אין בית המשפט מחליף את שיקול דעת הרשות.',
    lawReference: 'בג"ץ 389/80 דפי זהב; בג"ץ 935/89 גנור'
  },
  {
    id: 3, type: 'case-study', difficulty: 'קשה', icon: '📋',
    category: 'חובת השימוע',
    question: 'רשות מינהלית ביטלה רישיון עסק ללא מתן הזדמנות לבעל הרישיון להשמיע את טענותיו. מה הדין?',
    options: [
      { id: 'a', text: 'ההחלטה תקפה, הרשות רשאית לפעול כרצונה' },
      { id: 'b', text: 'ההחלטה בטלה מפני הפרת חובת השימוע' },
      { id: 'c', text: 'ניתן לתקן את הפגם בדיעבד' },
      { id: 'd', text: 'ביטול ללא שימוע אפשרי במקרי חירום בלבד' }
    ],
    correctAnswer: 'b',
    explanation: 'חובת השימוע היא אחד מעקרונות הצדק הטבעי הבסיסיים. ביטול רישיון ללא שימוע מהווה פגם מהותי המביא לבטלות ההחלטה לפי הלכת "חוק השימוע" וחוק הפרשנות.',
    lawReference: 'בג"ץ 3/58; בג"ץ 1843/93 פנחסי'
  },
  {
    id: 4, type: 'true-false', difficulty: 'קל', icon: '📜',
    category: 'שיקולים זרים',
    question: 'רשות מינהלית המפעילה שיקולים זרים להחלטתה פועלת כדין',
    correctAnswer: 'false',
    explanation: 'שגוי. שימוש בשיקולים זרים (שאינם רלוונטיים לעניין) הוא עילה לביטול ההחלטה. הרשות חייבת להפעיל שיקול דעת לפי מטרת החוק המסמיך בלבד.',
    lawReference: 'סעיף 2 לחוק הפרשנות, תשמ"א–1981'
  },
  {
    id: 5, type: 'multiple-choice', difficulty: 'קשה', icon: '🔍',
    category: 'גילוי מידע',
    question: 'על פי חוק חופש המידע, תשנ"ח–1998, מי זכאי לבקש מידע מרשות ציבורית?',
    options: [
      { id: 'a', text: 'אזרחים ישראלים בלבד' },
      { id: 'b', text: 'כל אדם, כולל תאגידים ותושבים זרים' },
      { id: 'c', text: 'רק מי שיוכיח אינטרס אישי' },
      { id: 'd', text: 'עיתונאים ועורכי דין בלבד' }
    ],
    correctAnswer: 'b',
    explanation: 'חוק חופש המידע מקנה לכל אדם (לרבות תאגידים) את הזכות לקבל מידע מרשות ציבורית, ללא חובת הצדקה. הזכות כפופה לחריגים מפורשים בחוק.',
    lawReference: 'סעיף 1 לחוק חופש המידע, תשנ"ח–1998'
  },
  {
    id: 6, type: 'case-study', difficulty: 'קשה מאוד', icon: '⚡',
    category: 'שינוי מדיניות',
    question: 'רשות שינתה מדיניות לפיה הסתמכו אזרחים לשנים. מהי חובתה?',
    options: [
      { id: 'a', text: 'יכולה לשנות מדיניות ללא כל הגבלה' },
      { id: 'b', text: 'חייבת לפצות את כולם' },
      { id: 'c', text: 'חייבת לתת הודעה מוקדמת סבירה ולשקול הסתמכות' },
      { id: 'd', text: 'אסור לה לשנות מדיניות לעולם' }
    ],
    correctAnswer: 'c',
    explanation: 'עיקרון ההגנה על הציפייה הסבירה מחייב את הרשות ליתן התראה מוקדמת ולשקול את אינטרס ההסתמכות של האזרחים שפעלו לפי המדיניות הקודמת.',
    lawReference: 'בג"ץ 4146/95 עזבון המנוח מוסלח; בג"ץ 5765/14'
  },
  {
    id: 7, type: 'multiple-choice', difficulty: 'בינוני', icon: '🏗️',
    category: 'ועדות תכנון',
    question: 'מה הגוף המוסמך לאשר תוכנית בניין עיר (תב"ע) ברמה המחוזית?',
    options: [
      { id: 'a', text: 'הממשלה' },
      { id: 'b', text: 'הוועדה המקומית לתכנון ובניה' },
      { id: 'c', text: 'הוועדה המחוזית לתכנון ובניה' },
      { id: 'd', text: 'בית המשפט המחוזי' }
    ],
    correctAnswer: 'c',
    explanation: 'לפי חוק התכנון והבניה תשכ"ה–1965, הוועדה המחוזית לתכנון ובניה מוסמכת לאשר תב"עות ברמה המחוזית. הוועדה המקומית מוסמכת לתת היתרי בניה.',
    lawReference: 'חוק התכנון והבניה, תשכ"ה–1965'
  },
  {
    id: 8, type: 'true-false', difficulty: 'בינוני', icon: '📊',
    category: 'חובת הנמקה',
    question: 'החלטה מינהלית חייבת תמיד להיות מלווה בהנמקה בכתב',
    correctAnswer: 'false',
    explanation: 'לא תמיד. חובת ההנמקה חלה על החלטות פוגעות (סירוב, ביטול, הגבלה). עם זאת, בעניינים מינהליים רגילים, ניתן לוותר על הנמקה בכתב. חוק הפרשנות וחקיקה ספציפית קובעים מתי חובת הנמקה מפורשת.',
    lawReference: 'בג"ץ 3/58; חוק חופש המידע'
  }
];

const AdministrativeLawExam: React.FC = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [examCompleted, setExamCompleted] = useState(false);
  const [score, setScore] = useState(0);

  const currentQuestion = questions[currentQuestionIndex];

  const handleAnswerSelect = (answer: string) =>
    setSelectedAnswers(prev => ({ ...prev, [currentQuestion.id]: answer }));

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      const correct = questions.filter(q => selectedAnswers[q.id] === q.correctAnswer).length;
      setScore(correct);
      setExamCompleted(true);
    }
  };

  const resetExam = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setExamCompleted(false);
    setScore(0);
  };

  const getDifficultyColor = (d: string) => {
    switch (d) {
      case 'קל': return 'success'; case 'בינוני': return 'warning'; default: return 'error';
    }
  };

  if (examCompleted) {
    const pct = Math.round((score / questions.length) * 100);
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Card elevation={4}><CardContent sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h4" gutterBottom color="primary">🏛️ מבחן משפט מינהלי הושלם!</Typography>
          <Box sx={{ my: 3 }}>
            <Typography variant="h2" color={pct >= 70 ? 'success.main' : 'error.main'}>{score}/{questions.length}</Typography>
            <Typography variant="h5" color="text.secondary">{pct}%</Typography>
          </Box>
          <Alert severity={pct >= 70 ? 'success' : 'warning'} sx={{ mb: 3 }}>
            {pct >= 70 ? 'מצוין! הצגת ידע טוב בעקרונות המשפט המינהלי' : 'מומלץ לחזור על פסיקת בג"ץ ועקרונות הצדק הטבעי'}
          </Alert>
          <Button variant="contained" onClick={resetExam}>🔄 מבחן חדש</Button>
        </CardContent></Card>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Card elevation={4}><CardContent sx={{ p: 4 }}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h4" gutterBottom color="primary">🏛️ מבחן משפט מינהלי</Typography>
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
              <RadioGroup value={selectedAnswers[currentQuestion.id] || ''} onChange={e => handleAnswerSelect(e.target.value)}>
                {currentQuestion.options.map(opt => (
                  <FormControlLabel key={opt.id} value={opt.id} control={<Radio />} label={opt.text} sx={{ mb: 1 }} />
                ))}
              </RadioGroup>
            </FormControl>
          )}
          {currentQuestion.type === 'true-false' && !currentQuestion.options && (
            <FormControl component="fieldset" fullWidth>
              <RadioGroup value={selectedAnswers[currentQuestion.id] || ''} onChange={e => handleAnswerSelect(e.target.value)}>
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
          <Button variant="outlined" onClick={() => setCurrentQuestionIndex(p => p - 1)} disabled={currentQuestionIndex === 0}>שאלה קודמת</Button>
          <Button variant="contained" onClick={handleNext} disabled={!selectedAnswers[currentQuestion.id]}>
            {currentQuestionIndex === questions.length - 1 ? 'סיום מבחן' : 'שאלה הבאה'}
          </Button>
        </Box>
      </CardContent></Card>
    </Container>
  );
};

export default AdministrativeLawExam;

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
    id: 1, type: 'multiple-choice', difficulty: 'בינוני', icon: '🌿',
    category: 'חוק הגנת הסביבה',
    question: 'איזה גוף אחראי לאכיפת דיני איכות הסביבה בישראל?',
    options: [
      { id: 'a', text: 'משרד הבריאות' },
      { id: 'b', text: 'המשרד להגנת הסביבה' },
      { id: 'c', text: 'הממשלה ישירות' },
      { id: 'd', text: 'הוועדות המקומיות בלבד' }
    ],
    correctAnswer: 'b',
    explanation: 'המשרד להגנת הסביבה (לשעבר משרד איכות הסביבה) אחראי לגיבוש מדיניות ולאכיפה. הוא פועל לפי חוקים כגון חוק אוויר נקי, חוק למניעת מפגעים ותקנות מים.',
    lawReference: 'חוק הגנת הסביבה (חובות יצרנים), תשע"ב–2011'
  },
  {
    id: 2, type: 'multiple-choice', difficulty: 'קשה', icon: '💨',
    category: 'זיהום אוויר',
    question: 'מה מנגנון ה"רישיון לעסק" ביחס לפליטות מזהמים לפי חוק אוויר נקי?',
    options: [
      { id: 'a', text: 'כל עסק חייב ברישיון' },
      { id: 'b', text: 'מפעלים עם פליטות מעל לסף קבוע חייבים בהיתר פליטה ועמידה בתקני פליטה' },
      { id: 'c', text: 'רק מפעלי כימיה' },
      { id: 'd', text: 'אין הסדרה לפליטות' }
    ],
    correctAnswer: 'b',
    explanation: 'חוק אוויר נקי, תש"ח–2008 מחייב מפעלים המעל לסף פליטה מוגדר בהיתר פליטה. ההיתר קובע תקרות פליטה, אמצעי ניטור ורישום. הפרה עשויה לגרור קנסות ואף סגירת עסק.',
    lawReference: 'חוק אוויר נקי, תשס"ח–2008'
  },
  {
    id: 3, type: 'true-false', difficulty: 'קל', icon: '💧',
    category: 'זיהום מים',
    question: 'זיהום מקור מים בישראל הוא עבירה פלילית',
    correctAnswer: 'true',
    explanation: 'נכון. חוק המים, תשי"ט–1959 ותקנות המים (מניעת זיהום מים) אוסרים מפורשות על זיהום מקורות מים. הפרה מהווה עבירה פלילית שעונשה קנסות גבוהים ועד 3 שנות מאסר.',
    lawReference: 'חוק המים, תשי"ט–1959; תקנות המים (מניעת זיהום מים)'
  },
  {
    id: 4, type: 'case-study', difficulty: 'קשה', icon: '🏭',
    category: 'עוולת מטרד',
    question: 'מפעל שכן גורם לרעש מפריע לשכנים. מה עילת התביעה הנזיקית הרלוונטית?',
    options: [
      { id: 'a', text: 'עוולת רשלנות' },
      { id: 'b', text: 'מטרד לציבור ומטרד ליחיד לפי פקודת הנזיקין' },
      { id: 'c', text: 'הפרת חוזה' },
      { id: 'd', text: 'עשיית עושר' }
    ],
    correctAnswer: 'b',
    explanation: 'פקודת הנזיקין (נוסח חדש) מגדירה "מטרד לציבור" ו"מטרד ליחיד" — רעש, זיהום ומפגעים הפוגעים בהנאה מרכוש או בבריאות. השכנים זכאים לסעדים — פיצויים וצו מניעה.',
    lawReference: 'סעיפים 44–48 לפקודת הנזיקין (נוסח חדש); חוק למניעת מפגעים תשכ"א'
  },
  {
    id: 5, type: 'multiple-choice', difficulty: 'קשה', icon: '🗑️',
    category: 'פסולת',
    question: 'מה עיקרון "מזהם משלם" (Polluter Pays) בדיני הסביבה הישראלי?',
    options: [
      { id: 'a', text: 'המדינה מממנת ניקוי זיהום' },
      { id: 'b', text: 'מי שגרם לזיהום חייב לשאת בעלות הניקוי ובנזקים' },
      { id: 'c', text: 'הציבור חולק בעלות שווה' },
      { id: 'd', text: 'עיקרון ממשפט אירופי ואינו חל בישראל' }
    ],
    correctAnswer: 'b',
    explanation: 'עיקרון "מזהם משלם" מוכר בדין הישראלי ובפסיקה. חוק אחריות לנזקי הסביבה (כגון חוק למניעת מפגעים) ופסיקת בתי המשפט מחייבים את מי שגרם לזיהום לשאת בכל עלויות הניקוי והפיצוי.',
    lawReference: 'חוק למניעת מפגעים, תשכ"א–1961; פסיקת ביהמ"ש העליון'
  },
  {
    id: 6, type: 'true-false', difficulty: 'בינוני', icon: '🌊',
    category: 'ים וחופים',
    question: 'חוף הים בישראל הוא נחלת הציבור ואין להפריט שטחים ממנו',
    correctAnswer: 'true',
    explanation: 'נכון. חוק שמירת הסביבה החופית, תשס"ד–2004 קובע שחוף הים הוא משאב ציבורי. אסור לבנות מבנים קבועים בתחום 100 מטר מקו המים (אזור ההגנה החופי) ואסור להגביל את הגישה הציבורית לים.',
    lawReference: 'חוק שמירת הסביבה החופית, תשס"ד–2004'
  },
  {
    id: 7, type: 'case-study', difficulty: 'קשה מאוד', icon: '🏗️',
    category: 'הערכת השפעה על הסביבה',
    question: 'פרויקט בנייה גדול מחייב "הערכת השפעה על הסביבה" (EIA). מה מטרתה?',
    options: [
      { id: 'a', text: 'רק לתעד את הנזקים לאחר הבנייה' },
      { id: 'b', text: 'לבחון את ההשפעות הסביבתיות לפני אישור הפרויקט ולהגדיר אמצעי הפחתה' },
      { id: 'c', text: 'לאפשר לאזרחים להתנגד לפרויקט' },
      { id: 'd', text: 'לקבוע מחיר הפרויקט' }
    ],
    correctAnswer: 'b',
    explanation: 'תקנות התכנון והבניה (סטטוטורית של הערכת השפעה על הסביבה) מחייבות בדיקת השפעות סביבתיות לפני אישור מתקנים גדולים. המסמך כולל ניתוח חלופות ואמצעי הפחתת נזק.',
    lawReference: 'תקנות התכנון והבניה (הכנת תסקיר השפעה על הסביבה), תשס"ג–2003'
  },
  {
    id: 8, type: 'multiple-choice', difficulty: 'קשה', icon: '⚡',
    category: 'אנרגיה ואקלים',
    question: 'ישראל התחייבה להגיע לאנרגיה מתחדשת בשנת 2030 — מה האחוז המוגדר?',
    options: [
      { id: 'a', text: '15%' },
      { id: 'b', text: '30%' },
      { id: 'c', text: '50%' },
      { id: 'd', text: '100%' }
    ],
    correctAnswer: 'b',
    explanation: 'ממשלת ישראל קבעה יעד של 30% אנרגיה מתחדשת מסך ייצור החשמל עד 2030. המדיניות מתבצעת דרך מכרזים לאנרגיה סולארית ורוח ותמריצים לאנרגיה ירוקה.',
    lawReference: 'החלטת ממשלה מס. 4450 (2019); תוכנית הממשלה לאנרגיה מתחדשת'
  }
];

const EnvironmentalLawExam: React.FC = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [examCompleted, setExamCompleted] = useState(false);
  const [score, setScore] = useState(0);

  const currentQuestion = questions[currentQuestionIndex];
  const handleAnswerSelect = (answer: string) =>
    setSelectedAnswers(prev => ({ ...prev, [currentQuestion.id]: answer }));

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(p => p + 1);
    } else {
      setScore(questions.filter(q => selectedAnswers[q.id] === q.correctAnswer).length);
      setExamCompleted(true);
    }
  };

  const resetExam = () => {
    setCurrentQuestionIndex(0); setSelectedAnswers({}); setExamCompleted(false); setScore(0);
  };

  const getDC = (d: string) => { switch (d) { case 'קל': return 'success'; case 'בינוני': return 'warning'; default: return 'error'; } };

  if (examCompleted) {
    const pct = Math.round((score / questions.length) * 100);
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Card elevation={4}><CardContent sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h4" gutterBottom color="primary">🌿 מבחן משפט סביבתי הושלם!</Typography>
          <Box sx={{ my: 3 }}>
            <Typography variant="h2" color={pct >= 70 ? 'success.main' : 'error.main'}>{score}/{questions.length}</Typography>
            <Typography variant="h5" color="text.secondary">{pct}%</Typography>
          </Box>
          <Alert severity={pct >= 70 ? 'success' : 'warning'} sx={{ mb: 3 }}>
            {pct >= 70 ? 'מצוין! הצגת ידע טוב במשפט הסביבתי' : 'מומלץ לחזור על חוקי הסביבה הישראליים'}
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
          <Typography variant="h4" gutterBottom color="primary">🌿 מבחן משפט סביבתי</Typography>
          <Typography variant="body1" color="text.secondary">שאלה {currentQuestionIndex + 1} מתוך {questions.length}</Typography>
          <LinearProgress variant="determinate" value={((currentQuestionIndex + 1) / questions.length) * 100} sx={{ mt: 2 }} />
        </Box>
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, flexWrap: 'wrap', gap: 1 }}>
            <Typography variant="h6">{currentQuestion.icon}</Typography>
            <Chip label={currentQuestion.category} color="primary" variant="outlined" />
            <Chip label={currentQuestion.difficulty} color={getDC(currentQuestion.difficulty) as any} size="small" />
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

export default EnvironmentalLawExam;

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
    id: 1, type: 'multiple-choice', difficulty: 'קל', icon: '💸',
    category: 'חדלות פרעון — יסודות',
    question: 'מתי חברה נחשבת "חדלת פרעון" לפי חוק חדלות פרעון ושיקום כלכלי, תשע"ח–2018?',
    options: [
      { id: 'a', text: 'כאשר אין לה רווח' },
      { id: 'b', text: 'כאשר אינה יכולה לפרוע את חובותיה בהגיע מועד פירעונם' },
      { id: 'c', text: 'כאשר הפסידה כסף שנה אחת' },
      { id: 'd', text: 'כאשר ערך נכסיה קטן מ-100,000 ₪' }
    ],
    correctAnswer: 'b',
    explanation: 'חדלות פרעון מוגדרת כמצב שבו אדם (יחיד או תאגיד) אינו מסוגל לפרוע את חובותיו בהגיע מועד פירעונם. חוק חדלות פרעון תשע"ח–2018 החליף את פקודת פשיטת הרגל ומייחד גישה שיקומית.',
    lawReference: 'חוק חדלות פרעון ושיקום כלכלי, תשע"ח–2018; סעיף 2'
  },
  {
    id: 2, type: 'multiple-choice', difficulty: 'בינוני', icon: '🔄',
    category: 'שיקום כלכלי',
    question: 'מה מטרת "ההליך לשיקום כלכלי" בחוק חדלות פרעון?',
    options: [
      { id: 'a', text: 'לחסל את הנכסים ולחלקם בין הנושים' },
      { id: 'b', text: 'לאפשר לחייב להמשיך לפעול תוך ארגון מחדש של חובותיו' },
      { id: 'c', text: 'להטיל מאסר על החייב' },
      { id: 'd', text: 'לבטל את כל חובות החייב' }
    ],
    correctAnswer: 'b',
    explanation: 'חוק חדלות פרעון תשע"ח–2018 אימץ גישה שיקומית (כמו Chapter 11 האמריקאי). המטרה היא לאפשר לחייב להמשיך לפעול ולשקם את עסקיו תוך הגעה להסדר עם נושיו, במקום לחסל מיד.',
    lawReference: 'סעיף 1 לחוק חדלות פרעון, תשע"ח–2018'
  },
  {
    id: 3, type: 'multiple-choice', difficulty: 'קשה', icon: '⚖️',
    category: 'קדימויות נושים',
    question: 'מהו סדר הקדימויות בחלוקת נכסים בחברה בהליך פירוק?',
    options: [
      { id: 'a', text: 'נושים רגילים, עובדים, ממשלה, נושים מובטחים' },
      { id: 'b', text: 'נושים מובטחים, הוצאות פירוק, עובדים ונושים מועדפים, נושים רגילים, בעלי מניות' },
      { id: 'c', text: 'בעלי מניות קודם לנושים' },
      { id: 'd', text: 'חלוקה שווה בין כל הנושים' }
    ],
    correctAnswer: 'b',
    explanation: 'סדר הקדימויות: (1) נושים מובטחים (בטוחה על נכס ספציפי), (2) הוצאות הפירוק, (3) עובדים וחובות מועדפים, (4) נושים לא מובטחים רגילים, (5) בעלי המניות — אחרונים ולרוב לא מקבלים כלום.',
    lawReference: 'חוק חדלות פרעון, תשע"ח–2018; פרק ז'
  },
  {
    id: 4, type: 'true-false', difficulty: 'בינוני', icon: '🛑',
    category: 'עיכוב הליכים',
    question: 'עם פתיחת הליך חדלות פרעון מוקנה "עיכוב הליכים" אוטומטי נגד החייב',
    correctAnswer: 'true',
    explanation: 'נכון. חוק חדלות פרעון תשע"ח קובע שעם מינוי נאמן או ממונה מוקנה עיכוב הליכים ("Stay") אוטומטי — כל הנושים מנועים מלנקוט הליכי גבייה נפרדים. המטרה: שמירה על שוויון בין נושים.',
    lawReference: 'סעיפים 32–40 לחוק חדלות פרעון'
  },
  {
    id: 5, type: 'case-study', difficulty: 'קשה', icon: '📋',
    category: 'עסקאות נושים',
    question: 'חברה העבירה נכסים לצד קשור בסמוך לפני הגשת בקשת פירוק. מה הנאמן יכול לעשות?',
    options: [
      { id: 'a', text: 'כלום, העסקה בוצעה לפני הפירוק' },
      { id: 'b', text: 'לבטל את העסקה כ"פעולה הניתנת לביטול" אם נעשתה בתקופת החשד' },
      { id: 'c', text: 'לתבוע את בית המשפט' },
      { id: 'd', text: 'לדרוש פיצויים בלבד' }
    ],
    correctAnswer: 'b',
    explanation: 'חוק חדלות פרעון מקנה לנאמן סמכות לבטל "עסקאות בניגוד לאינטרס הנושים" שבוצעו בתקופת חשד (עד שנתיים לפני הפירוק לגורם קשור). הפעולה מוחזרת לקופת הפירוק.',
    lawReference: 'סעיפים 220–235 לחוק חדלות פרעון'
  },
  {
    id: 6, type: 'multiple-choice', difficulty: 'קשה', icon: '👤',
    category: 'יחיד בחדלות פרעון',
    question: 'מה מסלול "מחיקת חובות" לאדם פרטי לפי חוק חדלות פרעון?',
    options: [
      { id: 'a', text: 'מחיקה מיידית של כל החובות' },
      { id: 'b', text: 'תוכנית תשלומים של 3 שנים, ובסיומה מחיקת יתרת חובות שאינם ניתנים לגבייה' },
      { id: 'c', text: 'מחיקת חובות רק לאחר 7 שנים' },
      { id: 'd', text: 'אין מחיקת חובות ליחידים' }
    ],
    correctAnswer: 'b',
    explanation: 'חוק חדלות פרעון מספק ליחיד מסלול "כינוס נכסים ותוכנית פירעון" של 3 שנים. בסיום, יתרת חובות בלתי ניתנת לגבייה נמחקת ("הפטר"). אלא שחובות מסוימים (מזונות, קנסות פלילים) אינם נמחקים.',
    lawReference: 'סעיפים 163–180 לחוק חדלות פרעון'
  },
  {
    id: 7, type: 'true-false', difficulty: 'קשה', icon: '🔒',
    category: 'בטוחות',
    question: 'שעבוד צף על כלל נכסי חברה הוא בטוחה ראשונה בסדר הקדימויות',
    correctAnswer: 'false',
    explanation: 'שגוי. שעבוד צף (Floating Charge) נחות מנושים מועדפים (עובדים, מס) ומשעבוד קבוע על נכס ספציפי. הוא "מתגבש" רק עם כניסה לפירוק, ולכן מדרגתו נמוכה יחסית.',
    lawReference: 'חוק חדלות פרעון, תשע"ח; פקודת החברות (בטוחות)'
  },
  {
    id: 8, type: 'case-study', difficulty: 'קשה מאוד', icon: '🏛️',
    category: 'הסדר נושים',
    question: 'חברה בקשיים רוצה לכפות הסדר חוב על כלל הנושים. כמה אחוז מהנושים צריכים להסכים?',
    options: [
      { id: 'a', text: '50%' },
      { id: 'b', text: 'רוב רגיל של המצביעים וכן 75% מסכום החוב בכל קבוצת נושים' },
      { id: 'c', text: '100% — כל הנושים חייבים להסכים' },
      { id: 'd', text: 'אין צורך בהסכמה' }
    ],
    correctAnswer: 'b',
    explanation: 'הסדר נושים לפי חוק חדלות פרעון מחייב אישור של רוב מספרי ו-75% מסכום החוב בכל קבוצת נושים. לאחר אישור בית המשפט, ההסדר כופף גם על מתנגדים באותה קבוצה.',
    lawReference: 'סעיפים 320–350 לחוק חדלות פרעון, תשע"ח–2018'
  }
];

const InsolvencyLawExam: React.FC = () => {
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

  const getDC = (d: string): 'success' | 'warning' | 'error' => { switch (d) { case 'קל': return 'success'; case 'בינוני': return 'warning'; default: return 'error'; } };

  if (examCompleted) {
    const pct = Math.round((score / questions.length) * 100);
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Card elevation={4}><CardContent sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h4" gutterBottom color="primary">💸 מבחן חדלות פרעון הושלם!</Typography>
          <Box sx={{ my: 3 }}>
            <Typography variant="h2" color={pct >= 70 ? 'success.main' : 'error.main'}>{score}/{questions.length}</Typography>
            <Typography variant="h5" color="text.secondary">{pct}%</Typography>
          </Box>
          <Alert severity={pct >= 70 ? 'success' : 'warning'} sx={{ mb: 3 }}>
            {pct >= 70 ? 'מצוין! הצגת ידע טוב בדיני חדלות פרעון' : 'מומלץ לחזור על חוק חדלות פרעון תשע"ח–2018'}
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
          <Typography variant="h4" gutterBottom color="primary">💸 מבחן חדלות פרעון ושיקום כלכלי</Typography>
          <Typography variant="body1" color="text.secondary">שאלה {currentQuestionIndex + 1} מתוך {questions.length}</Typography>
          <LinearProgress variant="determinate" value={((currentQuestionIndex + 1) / questions.length) * 100} sx={{ mt: 2 }} />
        </Box>
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, flexWrap: 'wrap', gap: 1 }}>
            <Typography variant="h6">{currentQuestion.icon}</Typography>
            <Chip label={currentQuestion.category} color="primary" variant="outlined" />
            <Chip label={currentQuestion.difficulty} color={getDC(currentQuestion.difficulty)} size="small" />
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

export default InsolvencyLawExam;

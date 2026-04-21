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
    id: 1, type: 'multiple-choice', difficulty: 'בינוני', icon: '🏢',
    category: 'הקמת חברה',
    question: 'מהי ה"אישיות המשפטית הנפרדת" של חברה לפי חוק החברות, תשנ"ט–1999?',
    options: [
      { id: 'a', text: 'החברה פועלת רק דרך בעלי מניותיה' },
      { id: 'b', text: 'החברה היא אישיות משפטית עצמאית, הנפרדת מבעלי המניות, בעלת זכויות וחובות בעצמה' },
      { id: 'c', text: 'בעלי המניות אחראים לחובות החברה' },
      { id: 'd', text: 'החברה זהה לשותפות' }
    ],
    correctAnswer: 'b',
    explanation: 'סעיף 4 לחוק החברות קובע שחברה היא תאגיד בעל אישיות משפטית נפרדת מהמייסדים ומבעלי המניות. החברה יכולה לרכוש נכסים, להתקשר בחוזים ולתבוע ולהיתבע בשמה העצמאי.',
    lawReference: 'סעיפים 1–4 לחוק החברות, תשנ"ט–1999'
  },
  {
    id: 2, type: 'multiple-choice', difficulty: 'בינוני', icon: '🛡️',
    category: 'הגבלת אחריות',
    question: 'מהי "הרמת מסך" בדיני החברות?',
    options: [
      { id: 'a', text: 'ביטול החברה על ידי הרשם' },
      { id: 'b', text: 'טכניקה משפטית להטלת אחריות אישית על בעלי מניות/נושאי משרה בנסיבות מיוחדות' },
      { id: 'c', text: 'הגשת דוחות לבורסה' },
      { id: 'd', text: 'מינוי מפרק לחברה' }
    ],
    correctAnswer: 'b',
    explanation: 'סעיף 6 לחוק החברות מאפשר לבית המשפט להרים את "מסך ההתאגדות" ולהטיל אחריות אישית על בעלי מניות — בעיקר כאשר החברה שימשה כלי להונאה, לתרמית, או כאשר הייתה ערבוב נכסים חמור.',
    lawReference: 'סעיף 6 לחוק החברות, תשנ"ט–1999'
  },
  {
    id: 3, type: 'multiple-choice', difficulty: 'קשה', icon: '👔',
    category: 'דירקטוריון',
    question: 'מהי "חובת הזהירות" של דירקטור בחברה לפי חוק החברות?',
    options: [
      { id: 'a', text: 'חובה לא לנהל עסקים מתחרים' },
      { id: 'b', text: 'חובה לפעול ברמת מיומנות ויסודיות שדירקטור סביר בעל כישורים דומים היה פועל' },
      { id: 'c', text: 'חובה לדווח לבורסה על כל עסקה' },
      { id: 'd', text: 'חובה להשתתף בכל ישיבת דירקטוריון' }
    ],
    correctAnswer: 'b',
    explanation: 'סעיף 252 לחוק החברות קובע שנושא משרה חייב לפעול ברמת מיומנות שדירקטור סביר בעל כישוריו היה נוקט. הדירקטור אינו ערב לתוצאות, אך חייב לנהל את עסקי החברה בשקידה ומיומנות.',
    lawReference: 'סעיף 252 לחוק החברות'
  },
  {
    id: 4, type: 'true-false', difficulty: 'קל', icon: '📊',
    category: 'מניות ובעלי מניות',
    question: 'בחברה בע"מ, בעל מניה אחראי לחובות החברה עד שווי השקעתו בלבד',
    correctAnswer: 'true',
    explanation: 'נכון. זהו עיקרון הגבלת האחריות — ה"Limited Liability". בעל מניה בחברה בע"מ עלול לאבד את ההשקעה אך אינו אחראי אישית לחובות החברה מעבר לסכום ששילם עבור מניותיו.',
    lawReference: 'סעיף 35 לחוק החברות'
  },
  {
    id: 5, type: 'case-study', difficulty: 'קשה', icon: '⚖️',
    category: 'ניגוד עניינים',
    question: 'דירקטור בחברה א\' מעוניין לבצע עסקה בין חברה א\' לחברה ב\' שבה הוא בעל עניין. מה עליו לעשות?',
    options: [
      { id: 'a', text: 'יכול לבצע את העסקה מבלי לגלות' },
      { id: 'b', text: 'חייב לגלות את עניינו לחברה ולא ליטול חלק בהצבעה על אישור העסקה' },
      { id: 'c', text: 'חייב להתפטר מהדירקטוריון' },
      { id: 'd', text: 'חייב לקבל אישור בית משפט' }
    ],
    correctAnswer: 'b',
    explanation: 'סעיפים 255–268 לחוק החברות קובעים את חובת הגילוי בניגוד עניינים. הדירקטור חייב לגלות את עניינו, לא להשתתף בדיון ולא להצביע. עסקאות חריגות עם בעל עניין דורשות אישור ועדת ביקורת, דירקטוריון ואסיפה כללית.',
    lawReference: 'סעיפים 255–270 לחוק החברות'
  },
  {
    id: 6, type: 'multiple-choice', difficulty: 'קשה', icon: '🏛️',
    category: 'אסיפה כללית',
    question: 'אסיפה כללית שנתית (אג"כ) — מה חובה להציג בה לפי חוק החברות?',
    options: [
      { id: 'a', text: 'רק מינוי רואה חשבון' },
      { id: 'b', text: 'דוחות כספיים, מינוי דירקטורים ורואה חשבון, ועניינים כפי שנקבעו בתקנון' },
      { id: 'c', text: 'עסקאות מיזוג בלבד' },
      { id: 'd', text: 'שינויי תקנון בלבד' }
    ],
    correctAnswer: 'b',
    explanation: 'סעיף 60 לחוק החברות קובע שחברה ציבורית חייבת לקיים אסיפה כללית שנתית בה יוצגו הדוחות הכספיים, ייבחרו דירקטורים ורואה חשבון, וידונו בעניינים שנקבעו בתקנון.',
    lawReference: 'סעיף 60 לחוק החברות'
  },
  {
    id: 7, type: 'true-false', difficulty: 'בינוני', icon: '📑',
    category: 'חברה ציבורית',
    question: 'חברה ציבורית חייבת לכלול בדירקטוריון שלה דירקטורים בלתי תלויים',
    correctAnswer: 'true',
    explanation: 'נכון. חוק החברות מחייב חברות ציבוריות לכלול לפחות שני דירקטורים חיצוניים בלתי תלויים (דח"צים). אלה אינם יכולים להיות קשורים לבעלי השליטה ומועסקים להגן על אינטרסי בעלי מניות המיעוט.',
    lawReference: 'סעיפים 239–249 לחוק החברות'
  },
  {
    id: 8, type: 'case-study', difficulty: 'קשה מאוד', icon: '🔎',
    category: 'תביעה נגזרת',
    question: 'בעל מניה מיעוט רוצה לתבוע בשם החברה נגד דירקטור שגרם לה נזק. מה האפשרות שלו?',
    options: [
      { id: 'a', text: 'יכול לתבוע ישירות בשמו' },
      { id: 'b', text: 'חייב לפנות לחברה תחילה; אם החברה מסרבת — יכול להגיש "תביעה נגזרת" בשם החברה עם אישור בית משפט' },
      { id: 'c', text: 'אינו יכול לתבוע כלל' },
      { id: 'd', text: 'רק רשות ניירות ערך רשאית לתבוע' }
    ],
    correctAnswer: 'b',
    explanation: 'סעיפים 194–206 לחוק החברות מסדירים את "התביעה הנגזרת". בעל מניה יכול לפנות לחברה עם דרישה לנקוט הליכים; אם החברה מסרבת, הוא רשאי לבקש מבית המשפט לאשר הגשת תביעה בשם החברה.',
    lawReference: 'סעיפים 194–206 לחוק החברות, תשנ"ט–1999'
  }
];

const CompanyLawExam: React.FC = () => {
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
          <Typography variant="h4" gutterBottom color="primary">🏢 מבחן דיני חברות הושלם!</Typography>
          <Box sx={{ my: 3 }}>
            <Typography variant="h2" color={pct >= 70 ? 'success.main' : 'error.main'}>{score}/{questions.length}</Typography>
            <Typography variant="h5" color="text.secondary">{pct}%</Typography>
          </Box>
          <Alert severity={pct >= 70 ? 'success' : 'warning'} sx={{ mb: 3 }}>
            {pct >= 70 ? 'מצוין! הצגת ידע טוב בדיני חברות' : 'מומלץ לחזור על חוק החברות תשנ"ט–1999'}
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
          <Typography variant="h4" gutterBottom color="primary">🏢 מבחן דיני חברות</Typography>
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

export default CompanyLawExam;

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
    id: 1, type: 'multiple-choice', difficulty: 'בינוני', icon: '📜',
    category: 'יסודות דיני הירושה',
    question: 'מי מוסמך לדון בעניינים של ירושה בישראל לגבי יהודים?',
    options: [
      { id: 'a', text: 'בית המשפט המחוזי בלבד' },
      { id: 'b', text: 'הרשם לענייני ירושה ובית המשפט לענייני משפחה' },
      { id: 'c', text: 'בית הדין הרבני בלבד' },
      { id: 'd', text: 'בית המשפט השלום' }
    ],
    correctAnswer: 'b',
    explanation: 'דיני הירושה נדונים בפני הרשם לענייני ירושה (לעניינים שאינם שנויים במחלוקת) ובית המשפט לענייני משפחה (לעניינים שנויים במחלוקת), לפי חוק הירושה תשכ"ה–1965.',
    lawReference: 'חוק הירושה, תשכ"ה–1965; חוק בית המשפט לענייני משפחה'
  },
  {
    id: 2, type: 'multiple-choice', difficulty: 'בינוני', icon: '👨‍👩‍👧',
    category: 'יורשים על פי דין',
    question: 'לפי חוק הירושה, מי הם היורשים הראשוניים של המוריש כשאין צוואה?',
    options: [
      { id: 'a', text: 'המדינה' },
      { id: 'b', text: 'ילדי המוריש ובן/בת הזוג' },
      { id: 'c', text: 'אחי ואחיות המוריש' },
      { id: 'd', text: 'הורי המוריש' }
    ],
    correctAnswer: 'b',
    explanation: 'לפי סעיפים 10–16 לחוק הירושה, הצאצאים ובן/בת הזוג הם יורשים ראשוניים. בן הזוג יורש חלק שווה עם הילדים, ובנוסף זכאי למחצית הרכוש המשפחתי.',
    lawReference: 'סעיפים 10–16 לחוק הירושה, תשכ"ה–1965'
  },
  {
    id: 3, type: 'multiple-choice', difficulty: 'קשה', icon: '📋',
    category: 'צוואה',
    question: 'מה הדרישה הקריטית לתוקפה של "צוואה בכתב יד" לפי חוק הירושה?',
    options: [
      { id: 'a', text: 'עדים ונוטריון' },
      { id: 'b', text: 'כתיבה, תאריך וחתימה — הכול בכתב ידו של המצווה' },
      { id: 'c', text: 'הפקדה בבית משפט' },
      { id: 'd', text: 'שני עדים חתומים' }
    ],
    correctAnswer: 'b',
    explanation: 'צוואה בכתב יד (סעיף 19 לחוק הירושה) חייבת להיות כתובה כולה בכתב ידו של המצווה, עם תאריך ועם חתימת המצווה. טקסט מודפס מבטל את תוקפה.',
    lawReference: 'סעיף 19 לחוק הירושה, תשכ"ה–1965'
  },
  {
    id: 4, type: 'true-false', difficulty: 'קל', icon: '🏦',
    category: 'עיזבון',
    question: 'עיזבון המוריש כולל גם חובות ולא רק נכסים',
    correctAnswer: 'true',
    explanation: 'נכון. עיזבון המוריש (סעיף 1 לחוק הירושה) כולל את כלל הנכסים, הזכויות והחובות שהיו לו בעת פטירתו. היורשים נכנסים לנעלי המוריש גם לעניין החובות.',
    lawReference: 'סעיף 1 לחוק הירושה'
  },
  {
    id: 5, type: 'case-study', difficulty: 'קשה', icon: '⚖️',
    category: 'חלוקת ירושה',
    question: 'המנוח השאיר אחריו בן זוג ושלושה ילדים. כיצד יחולק העיזבון לפי חוק הירושה?',
    options: [
      { id: 'a', text: 'הכול לבן הזוג' },
      { id: 'b', text: 'חצי לבן הזוג וחצי לילדים בשווה' },
      { id: 'c', text: 'בן הזוג יורש ¼ מהעיזבון ושלושת הילדים יורשים ¾ בחלקים שווים' },
      { id: 'd', text: 'הכול לילדים' }
    ],
    correctAnswer: 'c',
    explanation: 'לפי סעיפים 11–13 לחוק הירושה, כשיש ילדים, בן הזוג יורש את מחצית הרכוש המשפחתי + רבע מהשאר; שאר העיזבון מתחלק בין הילדים. בסה"כ: בן הזוג ~¼, ילדים ¾ מחולק ביניהם.',
    lawReference: 'סעיפים 11–13 לחוק הירושה'
  },
  {
    id: 6, type: 'multiple-choice', difficulty: 'קשה', icon: '🚫',
    category: 'פסול לרשת',
    question: 'מתי יורש יהיה "פסול לרשת" לפי חוק הירושה?',
    options: [
      { id: 'a', text: 'אם גר מחוץ לישראל' },
      { id: 'b', text: 'אם הרג במתכוון או ניסה להרוג את המוריש' },
      { id: 'c', text: 'אם לא היה בקשר עם המוריש' },
      { id: 'd', text: 'אם חב חובות' }
    ],
    correctAnswer: 'b',
    explanation: 'סעיף 5 לחוק הירושה קובע שמי שהרג במתכוון את המוריש, ניסה להרגו, או הרשיע בעבירות חמורות נגדו — פסול לרשת. זהו עיקרון של "ידיים שפיכות דם לא יירשו".',
    lawReference: 'סעיף 5 לחוק הירושה, תשכ"ה–1965'
  },
  {
    id: 7, type: 'true-false', difficulty: 'בינוני', icon: '📄',
    category: 'ביטול צוואה',
    question: 'כריתת נישואין של המצווה לאחר עריכת הצוואה מבטלת אותה אוטומטית',
    correctAnswer: 'true',
    explanation: 'נכון. לפי סעיף 36 לחוק הירושה, נישואין אחרי עריכת הצוואה מבטלים את הצוואה אוטומטית, אלא אם הצוואה נעשתה בהינתן הנישואין הצפויים.',
    lawReference: 'סעיף 36 לחוק הירושה'
  },
  {
    id: 8, type: 'case-study', difficulty: 'קשה מאוד', icon: '🔎',
    category: 'עיכוב ירושה',
    question: 'נושה של המנוח רוצה לגבות חובו מהיורשים. מה האפשרויות שעומדות לו?',
    options: [
      { id: 'a', text: 'אינו יכול לתבוע את היורשים כלל' },
      { id: 'b', text: 'יכול לתבוע את היורשים עד גובה הירושה שקיבלו' },
      { id: 'c', text: 'יכול לתבוע כל יורש על כל סכום החוב' },
      { id: 'd', text: 'רק אם הנושה קיבל צו מבית המשפט' }
    ],
    correctAnswer: 'b',
    explanation: 'יורשים אחראים לחובות המוריש רק עד שווי הירושה שקיבלו (סעיף 107 לחוק הירושה). מעבר לכך, הנושה אינו יכול לגבות מנכסיהם האישיים.',
    lawReference: 'סעיף 107 לחוק הירושה, תשכ"ה–1965'
  }
];

const InheritanceLawExam: React.FC = () => {
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

  const getDC = (d: string): 'success' | 'warning' | 'error' => { switch (d) { case 'קל': return 'success'; case 'בינוני': return 'warning'; default: return 'error'; } };

  if (examCompleted) {
    const pct = Math.round((score / questions.length) * 100);
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Card elevation={4}><CardContent sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h4" gutterBottom color="primary">📜 מבחן דיני ירושה הושלם!</Typography>
          <Box sx={{ my: 3 }}>
            <Typography variant="h2" color={pct >= 70 ? 'success.main' : 'error.main'}>{score}/{questions.length}</Typography>
            <Typography variant="h5" color="text.secondary">{pct}%</Typography>
          </Box>
          <Alert severity={pct >= 70 ? 'success' : 'warning'} sx={{ mb: 3 }}>
            {pct >= 70 ? 'מצוין! הצגת ידע טוב בדיני הירושה הישראלי' : 'מומלץ לחזור על חוק הירושה תשכ"ה–1965'}
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
          <Typography variant="h4" gutterBottom color="primary">📜 מבחן דיני ירושה ועיזבון</Typography>
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

export default InheritanceLawExam;

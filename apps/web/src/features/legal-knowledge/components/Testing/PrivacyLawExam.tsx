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
    id: 1, type: 'multiple-choice', difficulty: 'קל', icon: '🔒',
    category: 'יסוד חוק הפרטיות',
    question: 'מה מגדיר "פגיעה בפרטיות" לפי חוק הגנת הפרטיות, תשמ"א–1981?',
    options: [
      { id: 'a', text: 'רק צילום אדם ללא רשותו' },
      { id: 'b', text: 'רשימה סגורה של מעשים האסורים — בין היתר: האזנת סתר, פרסום ענייניו הפרטיים ומסירת מידע שגוי' },
      { id: 'c', text: 'כל פרסום של מידע על אדם' },
      { id: 'd', text: 'גישה לאימייל בלבד' }
    ],
    correctAnswer: 'b',
    explanation: 'סעיף 2 לחוק הגנת הפרטיות מגדיר רשימה סגורה של פגיעות פרטיות: האזנה, מעקב, צילום במקום פרטי, פרסום עניין שנמסר בסוד, מסירת מידע שגוי ועוד. הרשימה אינה פתוחה.',
    lawReference: 'סעיף 2 לחוק הגנת הפרטיות, תשמ"א–1981'
  },
  {
    id: 2, type: 'multiple-choice', difficulty: 'בינוני', icon: '🗂️',
    category: 'מאגרי מידע',
    question: 'מי חייב לרשום מאגר מידע ברשם מאגרי המידע לפי חוק הגנת הפרטיות?',
    options: [
      { id: 'a', text: 'כל אדם המחזיק מידע על אחרים' },
      { id: 'b', text: 'מאגרים המכילים מידע על 10,000 אנשים ומעלה, מאגרים עם מידע רגיש, ומאגרים המשמשים לשיווק ישיר' },
      { id: 'c', text: 'רק תאגידים גדולים' },
      { id: 'd', text: 'רק גופים ממשלתיים' }
    ],
    correctAnswer: 'b',
    explanation: 'תקנות הגנת הפרטיות (תנאים לשמירת מידע ועיבודו) קובעות חובת רישום לסוגי מאגרים מסוימים. מאגרים עם מידע רגיש (בריאות, פוליטי, ביומטרי) חייבים ברישום ללא תלות בגודלם.',
    lawReference: 'פרק ב לחוק הגנת הפרטיות; תקנות הגנת הפרטיות 2017'
  },
  {
    id: 3, type: 'case-study', difficulty: 'קשה', icon: '🏥',
    category: 'מידע רגיש',
    question: 'חברת ביטוח ביקשה גישה לרשומות רפואיות של מועמד לביטוח חיים. מה הדין?',
    options: [
      { id: 'a', text: 'החברה רשאית לגשת לכל רשומה רפואית' },
      { id: 'b', text: 'נדרשת הסכמה מפורשת בכתב של המבוטח לגילוי הרשומות הרלוונטיות' },
      { id: 'c', text: 'הרשומות הרפואיות חסויות לחלוטין' },
      { id: 'd', text: 'חברת ביטוח פטורה מחוק הפרטיות' }
    ],
    correctAnswer: 'b',
    explanation: 'מידע רפואי הוא מידע רגיש לפי חוק הגנת הפרטיות. העברתו לחברת ביטוח חייבת להיות מלווה בהסכמה חתומה של הנושא, ובגדרה ניתן רק למסור מידע רלוונטי לענין הביטוח המבוקש.',
    lawReference: 'סעיפים 7ב–7ג לחוק הגנת הפרטיות; תקנות הגנת הפרטיות (אבטחת מידע)'
  },
  {
    id: 4, type: 'true-false', difficulty: 'בינוני', icon: '🌐',
    category: 'GDPR וישראל',
    question: 'ישראל הוכרה על ידי האיחוד האירופי כמדינה המעניקה הגנה נאותה על פרטיות, המאפשרת העברת מידע חופשית',
    correctAnswer: 'true',
    explanation: 'נכון. נכון לשנת 2011, ישראל הוכרה על ידי האיחוד האירופי כ"מדינה שלישית" עם הגנת פרטיות נאותה (Adequacy Decision), המאפשרת זרימת מידע בין ישראל למדינות ה-EU ללא מנגנוני הסכמה נוספים.',
    lawReference: 'GDPR (EU) 2016/679; החלטת נאותות של האיחוד האירופי לישראל'
  },
  {
    id: 5, type: 'multiple-choice', difficulty: 'קשה', icon: '📊',
    category: 'זכות עיון',
    question: 'מה זכות הנושא (Subject Access Right) לפי חוק הגנת הפרטיות?',
    options: [
      { id: 'a', text: 'הזכות לדרוש מחיקת כל המידע' },
      { id: 'b', text: 'הזכות לעיין במידע המוחזק עליו במאגר ולדרוש תיקונו' },
      { id: 'c', text: 'הזכות לקבל פיצוי כספי' },
      { id: 'd', text: 'הזכות להגיש תלונה לבית משפט בלבד' }
    ],
    correctAnswer: 'b',
    explanation: 'סעיף 13 לחוק הגנת הפרטיות מקנה לכל אדם זכות לעיין במידע השמור עליו במאגר מידע ולדרוש תיקון מידע שגוי. בעל המאגר חייב לאפשר עיון תוך 30 יום.',
    lawReference: 'סעיף 13–14 לחוק הגנת הפרטיות'
  },
  {
    id: 6, type: 'case-study', difficulty: 'קשה', icon: '🔍',
    category: 'עבירות',
    question: 'עובד מאגר מידע מסר פרטי לקוחות לצד שלישי ללא הרשאה. מהי האחריות הפלילית?',
    options: [
      { id: 'a', text: 'אין אחריות פלילית' },
      { id: 'b', text: 'עבירה פלילית שעונשה מאסר עד 5 שנים' },
      { id: 'c', text: 'קנס בלבד' },
      { id: 'd', text: 'עיצום כספי בלבד' }
    ],
    correctAnswer: 'b',
    explanation: 'סעיף 31א לחוק הגנת הפרטיות קובע שמסירת מידע ממאגר מידע שלא כדין מהווה עבירה פלילית. עונשה מאסר עד 5 שנים. ניתן גם לתבוע בתביעה אזרחית ולזכות בפיצויים ללא הוכחת נזק.',
    lawReference: 'סעיף 31א לחוק הגנת הפרטיות; סעיף 29ב לפיצויים'
  },
  {
    id: 7, type: 'multiple-choice', difficulty: 'קשה מאוד', icon: '🧠',
    category: 'AI ופרטיות',
    question: 'בישראל, שימוש ב-AI לעיבוד מידע אישי — מה הדרישה הרגולטורית העיקרית?',
    options: [
      { id: 'a', text: 'אסור לחלוטין' },
      { id: 'b', text: 'מותר ללא הגבלה' },
      { id: 'c', text: 'מחייב הגנות על הנתונים, מינוי ממונה פרטיות ועמידה בעקרון מינימום הנתונים' },
      { id: 'd', text: 'דרוש רק אם מעבדים מידע של ילדים' }
    ],
    correctAnswer: 'c',
    explanation: 'הרשות להגנת הפרטיות פרסמה הנחיות לשימוש ב-AI. עיבוד מידע אישי בעזרת AI מחייב: עמידה בחוק הגנת הפרטיות, מינימום נתונים, שקיפות, אבטחת מידע ועיצוב פרטיות (Privacy by Design).',
    lawReference: 'הנחיות הרשות להגנת הפרטיות בנושא AI, 2024'
  },
  {
    id: 8, type: 'true-false', difficulty: 'בינוני', icon: '🗑️',
    category: 'זכות למחיקה',
    question: 'קיימת בישראל "זכות לשכוח" — זכות למחיקת מידע מהאינטרנט',
    correctAnswer: 'true',
    explanation: 'נכון. בעקבות פסיקת בית המשפט הישראלי ובהשפעת ה-GDPR, הרשות להגנת הפרטיות הכירה בזכות לשכוח. אפשר לדרוש הסרת מידע מזוהה מגוגל ואתרים, בתנאים מסוימים הקבועים בנוהל שפרסמה הרשות.',
    lawReference: 'הנחיות הרשות להגנת הפרטיות — "הזכות לשכוח", 2021'
  }
];

const PrivacyLawExam: React.FC = () => {
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
      setScore(correct); setExamCompleted(true);
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
          <Typography variant="h4" gutterBottom color="primary">🔒 מבחן הגנת הפרטיות הושלם!</Typography>
          <Box sx={{ my: 3 }}>
            <Typography variant="h2" color={pct >= 70 ? 'success.main' : 'error.main'}>{score}/{questions.length}</Typography>
            <Typography variant="h5" color="text.secondary">{pct}%</Typography>
          </Box>
          <Alert severity={pct >= 70 ? 'success' : 'warning'} sx={{ mb: 3 }}>
            {pct >= 70 ? 'מצוין! הצגת ידע טוב בדיני הגנת הפרטיות' : 'מומלץ לחזור על חוק הגנת הפרטיות ותקנות אבטחת מידע'}
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
          <Typography variant="h4" gutterBottom color="primary">🔒 מבחן הגנת הפרטיות ומאגרי מידע</Typography>
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

export default PrivacyLawExam;

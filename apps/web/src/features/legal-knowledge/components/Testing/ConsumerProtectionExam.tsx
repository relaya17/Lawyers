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
    id: 1, type: 'multiple-choice', difficulty: 'קל', icon: '🛒',
    category: 'חוק הגנת הצרכן',
    question: 'מה מגדיר "עוסק" לפי חוק הגנת הצרכן, תשמ"א–1981?',
    options: [
      { id: 'a', text: 'כל אדם שמוכר מוצר' },
      { id: 'b', text: 'מי שמוכר נכס או נותן שירות במהלך עסקו, אף אם אינו עיסוקו העיקרי' },
      { id: 'c', text: 'תאגיד בלבד' },
      { id: 'd', text: 'מי שמכיר ב-1,000 ₪ ומעלה בשנה' }
    ],
    correctAnswer: 'b',
    explanation: 'חוק הגנת הצרכן מגדיר "עוסק" באופן רחב — כל מי שמוכר נכס או נותן שירות במסגרת עסק, מלאכה, משלח יד, כולל עצמאים ואף חלקיים.',
    lawReference: 'סעיף 1 לחוק הגנת הצרכן, תשמ"א–1981'
  },
  {
    id: 2, type: 'multiple-choice', difficulty: 'בינוני', icon: '🔖',
    category: 'גילוי מחיר',
    question: 'מה החובה העיקרית של עוסק לפי חוק הגנת הצרכן ביחס לתמחור?',
    options: [
      { id: 'a', text: 'לא לגבות יותר מהמחיר שנקבע על ידי הממשלה' },
      { id: 'b', text: 'לציין את מחיר הנכס/השירות באופן ברור לפני כריתת העסקה' },
      { id: 'c', text: 'לציין מחיר רק אם נדרש על ידי הצרכן' },
      { id: 'd', text: 'לתת הנחה לצרכן הראשון' }
    ],
    correctAnswer: 'b',
    explanation: 'חוק הגנת הצרכן מחייב גילוי מחיר ברור, מלא ומראש. הצגת מחיר חלקי, מחיר לא ברור, או הוספת עלויות נסתרות היא עבירה על החוק.',
    lawReference: 'סעיפים 2–4 לחוק הגנת הצרכן'
  },
  {
    id: 3, type: 'case-study', difficulty: 'קשה', icon: '📱',
    category: 'ביטול עסקה',
    question: 'צרכן רכש מוצר אלקטרוני באינטרנט. לאחר שלושה ימים הוא מעוניין להחזיר אותו ללא סיבה. מה זכותו?',
    options: [
      { id: 'a', text: 'אין לו זכות החזרה ללא סיבה' },
      { id: 'b', text: 'זכאי לבטל תוך 14 יום מקבלת הנכס, ולקבל החזר כספי' },
      { id: 'c', text: 'זכאי רק לקבל זיכוי בחנות' },
      { id: 'd', text: 'זכאי לביטול רק אם הנכס פגום' }
    ],
    correctAnswer: 'b',
    explanation: 'תקנות הגנת הצרכן (ביטול עסקה) מאפשרות לצרכן לבטל עסקה שנכרתה מרחוק (אינטרנט, טלפון) תוך 14 יום ממועד קבלת הנכס, ולקבל החזר כספי מלא בניכוי 5% דמי ביטול.',
    lawReference: 'תקנות הגנת הצרכן (ביטול עסקה), תשע"א–2010'
  },
  {
    id: 4, type: 'true-false', difficulty: 'קל', icon: '📞',
    category: 'הטעיה',
    question: 'פרסום שקרי או מטעה של עוסק על מוצריו הוא עבירה לפי חוק הגנת הצרכן',
    correctAnswer: 'true',
    explanation: 'נכון. סעיף 2 לחוק הגנת הצרכן אוסר מפורשות הטעיה של צרכן — בין בפרסום, בתיאור המוצר, בתנאי העסקה ובמחיר. הטעיה עשויה לעלות גם כעבירה פלילית.',
    lawReference: 'סעיף 2 לחוק הגנת הצרכן'
  },
  {
    id: 5, type: 'multiple-choice', difficulty: 'קשה', icon: '🔧',
    category: 'אחריות על מוצר',
    question: 'מהי תקופת האחריות המינימלית על מוצרי חשמל ביתיים לפי חוק הגנת הצרכן?',
    options: [
      { id: 'a', text: 'שלושה חודשים' },
      { id: 'b', text: 'שישה חודשים' },
      { id: 'c', text: 'שנה אחת' },
      { id: 'd', text: 'שנתיים' }
    ],
    correctAnswer: 'c',
    explanation: 'חוק הגנת הצרכן ותקנותיו קובעים אחריות מינימלית של שנה על מוצרי חשמל ביתיים. תקופה זו אינה ניתנת להתנאה בחוזה, וכל הגבלה קצרה יותר בטלה.',
    lawReference: 'חוק הגנת הצרכן ותקנות המוצרים ושירותים'
  },
  {
    id: 6, type: 'case-study', difficulty: 'קשה', icon: '🏦',
    category: 'חוזה אחיד',
    question: 'חברת טלפון הכניסה בחוזה הצטרפות סעיף המאפשר לה לשנות מחירים ללא הודעה. מה הדין?',
    options: [
      { id: 'a', text: 'הסעיף תקף כחלק מחופש החוזים' },
      { id: 'b', text: 'הסעיף בטל כ"תנאי מקפח" לפי חוק חוזים אחידים' },
      { id: 'c', text: 'הסעיף תקף רק אם הצרכן הסכים לו בחתימה' },
      { id: 'd', text: 'ביהמ"ש יכריע לפי שיקול דעת בלבד' }
    ],
    correctAnswer: 'b',
    explanation: 'חוק חוזים אחידים, תשמ"ג–1982 קובע שתנאי המאפשר לספק לשנות את תנאי החוזה ללא הסכמת הלקוח הוא תנאי מקפח ובטל. בית הדין לחוזים אחידים יכול לבטל תנאים כאלה.',
    lawReference: 'חוק חוזים אחידים, תשמ"ג–1982; סעיף 3'
  },
  {
    id: 7, type: 'true-false', difficulty: 'בינוני', icon: '🌐',
    category: 'מסחר אלקטרוני',
    question: 'אתר מסחר חייב לאפשר ביטול עסקה באמצעות אותו ערוץ שבו נכרתה',
    correctAnswer: 'true',
    explanation: 'נכון. חוק הגנת הצרכן מחייב שהצרכן יוכל לבטל עסקה שנכרתה בערוץ מרחוק (אינטרנט, טלפון) באותו ערוץ — כלומר, אם קנה באינטרנט, חייב להיות מסוגל לבטל באינטרנט.',
    lawReference: 'תקנות הגנת הצרכן (ביטול עסקה), תשע"א–2010; תיקון 2021'
  },
  {
    id: 8, type: 'multiple-choice', difficulty: 'קשה מאוד', icon: '⚖️',
    category: 'הגנת הצרכן בביטוח',
    question: 'מה חובת הגילוי של המבוטח לחברת הביטוח לפי חוק חוזה הביטוח?',
    options: [
      { id: 'a', text: 'לגלות רק עובדות שנשאל עליהן בפוליסה' },
      { id: 'b', text: 'לגלות כל עובדה מהותית שהמבוטח יודע ושמבטח סביר היה מתחשב בה' },
      { id: 'c', text: 'אין חובת גילוי' },
      { id: 'd', text: 'לגלות רק נתוני בריאות' }
    ],
    correctAnswer: 'b',
    explanation: 'סעיף 6 לחוק חוזה הביטוח תשמ"א–1981 מחייב את המבוטח לגלות כל עובדה מהותית שמבטח סביר היה מתחשב בה. הפרת חובה זו עשויה להוביל לביטול הפוליסה או הפחתת תגמולים.',
    lawReference: 'סעיפים 6–7 לחוק חוזה הביטוח, תשמ"א–1981'
  }
];

const ConsumerProtectionExam: React.FC = () => {
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
          <Typography variant="h4" gutterBottom color="primary">🛒 מבחן הגנת הצרכן הושלם!</Typography>
          <Box sx={{ my: 3 }}>
            <Typography variant="h2" color={pct >= 70 ? 'success.main' : 'error.main'}>{score}/{questions.length}</Typography>
            <Typography variant="h5" color="text.secondary">{pct}%</Typography>
          </Box>
          <Alert severity={pct >= 70 ? 'success' : 'warning'} sx={{ mb: 3 }}>
            {pct >= 70 ? 'מצוין! הצגת ידע טוב בדיני הגנת הצרכן' : 'מומלץ לחזור על חוק הגנת הצרכן ותקנות ביטול עסקה'}
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
          <Typography variant="h4" gutterBottom color="primary">🛒 מבחן הגנת הצרכן</Typography>
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

export default ConsumerProtectionExam;

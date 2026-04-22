import React, { useState } from 'react';
import {
  Box, Container, Typography, Card, CardContent, Button,
  Radio, RadioGroup, FormControlLabel, FormControl,
  Chip, LinearProgress, Alert
} from '@mui/material';

interface Question {
  id: number;
  difficulty: 'קל' | 'בינוני' | 'קשה';
  icon: string;
  category: string;
  area: string;
  question: string;
  options: { id: string; text: string }[];
  correctAnswer: string;
  explanation: string;
  lawReference?: string;
}

const questions: Question[] = [
  {
    id: 1, difficulty: 'קשה', icon: '💼', category: 'שימוע', area: 'דיני עבודה',
    question: 'מיכל עובדת 3 שנים. מעבידה קיים שימוע אך בצורת הודעה לא מאפשרת תגובה, ופיטרה אותה למחרת. מה הדין?',
    options: [
      { id: 'a', text: 'הפיטורין תקינים — שימוע נעשה' },
      { id: 'b', text: 'פגם קל — רק פיצוי סמלי' },
      { id: 'c', text: 'פגם מהותי — שימוע לא אמיתי, ייתכן פיצוי' },
      { id: 'd', text: 'מיכל חייבת להגיש עתירה תוך 7 ימים' }
    ],
    correctAnswer: 'c',
    explanation: 'שימוע שאינו מאפשר לעובד להגיב ולהשפיע על ההחלטה — אינו שימוע אמיתי. זהו פגם מהותי שעלול להוביל לפיצוי בגין פיטורין שלא כדין.',
    lawReference: 'פסיקת בית הדין הארצי לעבודה'
  },
  {
    id: 2, difficulty: 'קשה', icon: '🛒', category: 'רשלנות', area: 'דיני נזיקין',
    question: 'מדף בחנות קרס ופגע בלקוח. החנות לא ידעה על פגם. מה ייתכן מבחינה משפטית?',
    options: [
      { id: 'a', text: 'אין אחריות כי לא ידעו' },
      { id: 'b', text: 'אחריות מוחלטת תמיד' },
      { id: 'c', text: 'ייתכן תביעת רשלנות — חובת בדיקה שוטפת' },
      { id: 'd', text: 'רק אחריות יצרן המדף' }
    ],
    correctAnswer: 'c',
    explanation: 'לחנות חובת זהירות לבדוק ולתחזק את הציוד. גם ללא ידיעה ספציפית — עשויה להתגבש רשלנות אם לא קיימה בדיקות סבירות.',
    lawReference: 'פקודת הנזיקין — עוולת הרשלנות'
  },
  {
    id: 3, difficulty: 'קשה', icon: '🏠', category: 'עסקה נוגדת', area: 'קניין ומקרקעין',
    question: 'ראובן מכר לשמעון (שילם, לא רשם), ואחר כך מכר ללוי (רשם בתום לב). מי יגבר?',
    options: [
      { id: 'a', text: 'שמעון — ראשון בזמן' },
      { id: 'b', text: 'לוי — הרוכש בתום לב שרשם' },
      { id: 'c', text: 'ראובן — המוכר שומר זכות' },
      { id: 'd', text: 'שניהם מקבלים חצי' }
    ],
    correctAnswer: 'b',
    explanation: 'בעסקה נוגדת עדיפות לרוכש שרשם בתום לב ובתמורה, גם אם בא שני בזמן. שמעון היה צריך לרשום הערת אזהרה מיד עם קניית הזכות.',
    lawReference: 'חוק המקרקעין, סעיף 9'
  },
  {
    id: 4, difficulty: 'קשה', icon: '🏛️', category: 'שיקולים זרים', area: 'משפט מנהלי',
    question: 'רשות מקומית סגרה עסק בטענת "אינטרס ציבורי" אך בפועל היו לחצים פוליטיים. מה ייתכן?',
    options: [
      { id: 'a', text: 'תקין — לרשות שיקול דעת רחב' },
      { id: 'b', text: 'עשוי להיפסל — שיקולים זרים' },
      { id: 'c', text: 'חוקי אם ניתן נימוק כלשהו' },
      { id: 'd', text: 'רק בית משפט מחוזי יוכל לדון' }
    ],
    correctAnswer: 'b',
    explanation: 'שיקולים פוליטיים הם שיקולים זרים לתכלית הסמכה. ההחלטה עשויה להיפסל בשל שימוש לרעה בסמכות.',
    lawReference: 'פסיקת בג"ץ — עילת השיקולים הזרים'
  },
  {
    id: 5, difficulty: 'בינוני', icon: '🚗', category: 'אשם תורם', area: 'דיני נזיקין',
    question: 'נהג נסע כחוק, הולך רגל התפרץ לכביש פתאום. הנהג פגע בו. מה הדין?',
    options: [
      { id: 'a', text: 'הנהג אחראי לחלוטין' },
      { id: 'b', text: 'הנהג פטור לחלוטין' },
      { id: 'c', text: 'ייתכן חלוקת אחריות — אשם תורם' },
      { id: 'd', text: 'אין אחריות לאף אחד' }
    ],
    correctAnswer: 'c',
    explanation: 'כאשר הניזוק תרם לנזקו (פריצה פתאומית לכביש) — עשויה להיות חלוקת אחריות בין הצדדים. עיקרון "אשם תורם" מקטין את הפיצוי.',
    lawReference: 'פקודת הנזיקין, סעיף 68 — אשם תורם'
  },
  {
    id: 6, difficulty: 'קשה', icon: '📋', category: 'התפטרות בדין מפוטר', area: 'דיני עבודה',
    question: 'עובד התפטר לאחר 10 חודשים עקב הרעה מוחשית בתנאי עבודה. האם זכאי לפיצויי פיטורים?',
    options: [
      { id: 'a', text: 'כן — תמיד' },
      { id: 'b', text: 'לא — התפטר מרצונו' },
      { id: 'c', text: 'ייתכן — אם יוכיח הרעה מוחשית' },
      { id: 'd', text: 'לא — לא השלים שנה' }
    ],
    correctAnswer: 'c',
    explanation: 'התפטרות בשל הרעה מוחשית מזכה בפיצויים "כמפוטר" — אך על העובד להוכיח שאכן הייתה הרעה מהותית, ועליו להתריע תחילה לפני ההתפטרות.',
    lawReference: 'חוק פיצויי פיטורים, סעיף 11(א)'
  },
  {
    id: 7, difficulty: 'בינוני', icon: '📝', category: 'צורת עסקה', area: 'קניין ומקרקעין',
    question: 'עסקה במקרקעין שנסגרה בעל פה (בלי מסמך בכתב). מה תוקפה?',
    options: [
      { id: 'a', text: 'תקפה — הסכמה מספיקה' },
      { id: 'b', text: 'בטלה — נדרש כתב' },
      { id: 'c', text: 'ניתנת לאישור בבית משפט' },
      { id: 'd', text: 'תקפה רק בין קרובי משפחה' }
    ],
    correctAnswer: 'b',
    explanation: 'חוק המקרקעין מחייב שעסקה במקרקעין תיעשה בכתב. עסקה בעל פה אינה תקפה ולא ניתן לאוכפה.',
    lawReference: 'חוק המקרקעין, סעיף 8; חוק החוזים (חלק כללי), סעיף 23'
  },
  {
    id: 8, difficulty: 'בינוני', icon: '🎤', category: 'שימוע מנהלי', area: 'משפט מנהלי',
    question: 'אזרח לא קיבל שימוע לפני שלילת רישיונו מסיבה מנהלית. מה הדין?',
    options: [
      { id: 'a', text: 'תקין — שלילת רישיון אינה מחייבת שימוע' },
      { id: 'b', text: 'פגם מהותי — שימוע נדרש לפני פגיעה בזכויות' },
      { id: 'c', text: 'ניתן לתקן בדיעבד' },
      { id: 'd', text: 'שימוע נדרש רק בפיטורים' }
    ],
    correctAnswer: 'b',
    explanation: 'שלילת רישיון היא פגיעה משמעותית בזכויות — מחייבת שימוע לפני ההחלטה. אי קיום שימוע הוא פגם מהותי.',
    lawReference: 'עקרון הצדק הטבעי — זכות הטיעון'
  },
  {
    id: 9, difficulty: 'קשה', icon: '🏥', category: 'רשלנות רפואית', area: 'דיני נזיקין',
    question: 'רופא פעל לפי הפרקטיקה המקובלת, אך נגרם נזק. האם בהכרח רשלנות?',
    options: [
      { id: 'a', text: 'כן — נגרם נזק ולכן יש אחריות' },
      { id: 'b', text: 'לא בהכרח — עמידה בסטנדרט סביר שוללת רשלנות' },
      { id: 'c', text: 'תמיד אחריות מוחלטת' },
      { id: 'd', text: 'רק אם הנזק גדול מסכום מסוים' }
    ],
    correctAnswer: 'b',
    explanation: 'רשלנות רפואית בוחנת האם הרופא חרג מסטנדרט הטיפול הסביר. פעולה לפי פרקטיקה מקובלת — אינה בהכרח רשלנות, גם אם נגרם נזק.',
    lawReference: 'פקודת הנזיקין — מבחן הרופא הסביר'
  },
  {
    id: 10, difficulty: 'בינוני', icon: '⚖️', category: 'מידתיות', area: 'משפט מנהלי',
    question: 'מהו עקרון המידתיות?',
    options: [
      { id: 'a', text: 'קבלת החלטה מהירה' },
      { id: 'b', text: 'התאמה בין האמצעי שנבחר לבין המטרה שהוגדרה' },
      { id: 'c', text: 'שיקול דעת ללא הגבלה' },
      { id: 'd', text: 'כל אמצעי מוצדק אם המטרה חשובה' }
    ],
    correctAnswer: 'b',
    explanation: 'מידתיות (proportionality) מחייבת שהאמצעי יהיה מתאים למטרה, יפגע בפחות אפשרי, ויהיה יחסי. שלושה מבחני משנה: קשר רציונלי, פגיעה פחותה, יחסיות.',
    lawReference: 'חוק יסוד: כבוד האדם וחירותו, סעיף 8'
  }
];

const getResultMessage = (pct: number) => {
  if (pct >= 80) return 'מצוין! עמדת בסימולציה המשולבת — רמת לשכה!';
  if (pct >= 60) return 'טוב! חזור על הנושאים שטעית בהם וחזור לסימולציה.';
  return 'יש מקום לשיפור. לשכת עורכי הדין מחייבת ידע מעמיק — המשך לתרגל!';
};

const getAreaColor = (area: string) => {
  if (area === 'דיני עבודה') return '#388e3c';
  if (area === 'דיני נזיקין') return '#e65100';
  if (area === 'קניין ומקרקעין') return '#4e342e';
  return '#283593';
};

const getDifficultyColor = (d: string) => {
  if (d === 'קל') return 'success';
  if (d === 'קשה') return 'error';
  return 'warning';
};

const MixedLegalSimulation: React.FC = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [examCompleted, setExamCompleted] = useState(false);
  const [score, setScore] = useState(0);

  const currentQuestion = questions[currentQuestionIndex];

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswers(prev => ({ ...prev, [currentQuestion.id]: answer }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      let correct = 0;
      questions.forEach(q => { if (selectedAnswers[q.id] === q.correctAnswer) correct++; });
      setScore(correct);
      setExamCompleted(true);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) setCurrentQuestionIndex(prev => prev - 1);
  };

  const resetExam = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setExamCompleted(false);
    setScore(0);
  };

  if (examCompleted) {
    const pct = Math.round((score / questions.length) * 100);
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Card elevation={4}>
          <CardContent sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h4" gutterBottom color="primary">🎓 תוצאות — סימולציה משולבת</Typography>
            <Typography variant="h2" color={pct >= 70 ? 'success.main' : 'error.main'} gutterBottom>{pct}%</Typography>
            <Typography variant="h6" gutterBottom>{score} נכונות מתוך {questions.length}</Typography>
            <Alert severity={pct >= 70 ? 'success' : 'warning'} sx={{ my: 3 }}>{getResultMessage(pct)}</Alert>
            {questions.map(q => (
              <Box key={q.id} sx={{ mb: 2, textAlign: 'right', p: 2, border: '1px solid #e0e0e0', borderRadius: 2, borderRight: `4px solid ${getAreaColor(q.area)}` }}>
                <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                  <Chip label={q.area} size="small" sx={{ backgroundColor: getAreaColor(q.area), color: 'white' }} />
                </Box>
                <Typography variant="body2" fontWeight="bold">{q.icon} {q.question}</Typography>
                <Typography variant="body2" color={selectedAnswers[q.id] === q.correctAnswer ? 'success.main' : 'error.main'}>
                  {selectedAnswers[q.id] === q.correctAnswer ? '✅ נכון' : `❌ ${q.options.find(o => o.id === selectedAnswers[q.id])?.text ?? '—'}`}
                </Typography>
                <Typography variant="caption" color="text.secondary">{q.explanation}</Typography>
              </Box>
            ))}
            <Button variant="contained" onClick={resetExam} sx={{ mt: 2 }}>🔄 סימולציה חדשה</Button>
          </CardContent>
        </Card>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Card elevation={4}>
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="h4" gutterBottom color="primary">🎓 סימולציית מבחן משולב — סגנון לשכה</Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              10 שאלות: עבודה, נזיקין, קניין ומנהלי | זמן מוערך: 40 דקות
            </Typography>
            <Typography variant="body1" color="text.secondary">שאלה {currentQuestionIndex + 1} מתוך {questions.length}</Typography>
            <LinearProgress variant="determinate" value={((currentQuestionIndex + 1) / questions.length) * 100} sx={{ mt: 2 }} />
          </Box>
          <Box sx={{ mb: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 1, flexWrap: 'wrap' }}>
              <Typography variant="h6">{currentQuestion.icon}</Typography>
              <Chip label={currentQuestion.area} size="small" sx={{ backgroundColor: getAreaColor(currentQuestion.area), color: 'white' }} />
              <Chip label={currentQuestion.category} color="primary" variant="outlined" size="small" />
              <Chip label={currentQuestion.difficulty} color={getDifficultyColor(currentQuestion.difficulty)} size="small" />
            </Box>
            <Typography variant="h6" paragraph>{currentQuestion.question}</Typography>
            <FormControl component="fieldset" fullWidth>
              <RadioGroup value={selectedAnswers[currentQuestion.id] || ''} onChange={e => handleAnswerSelect(e.target.value)}>
                {currentQuestion.options.map(opt => (
                  <FormControlLabel key={opt.id} value={opt.id} control={<Radio />} label={opt.text} />
                ))}
              </RadioGroup>
            </FormControl>
            {currentQuestion.lawReference && (
              <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                📚 {currentQuestion.lawReference}
              </Typography>
            )}
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button variant="outlined" onClick={handlePrevious} disabled={currentQuestionIndex === 0}>◀ הקודם</Button>
            <Button variant="contained" onClick={handleNext} disabled={!selectedAnswers[currentQuestion.id]}>
              {currentQuestionIndex === questions.length - 1 ? 'סיים סימולציה ✓' : 'הבא ▶'}
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default MixedLegalSimulation;

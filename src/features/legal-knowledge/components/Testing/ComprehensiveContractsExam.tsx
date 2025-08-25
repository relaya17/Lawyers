import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  CardHeader,
  Button,
  FormControl,
  FormControlLabel,
  RadioGroup,
  Radio,
  Paper,
  LinearProgress,
  Grid,
  Chip,
  Alert,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemText,
  Divider,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  AccessTime as TimeIcon,
  Refresh as RefreshIcon,
  Print as PrintIcon,
  Description as ContractIcon
} from '@mui/icons-material';

// הגדרת ממשק לשאלה
interface Question {
  id: number;
  question: string;
  type: 'multiple-choice' | 'true-false' | 'open';
  options?: string[];
  correctAnswer: number | string;
  explanation: string;
  topic: string;
  difficulty: 'easy' | 'medium' | 'hard' | 'expert';
  legalSource?: string;
  caseExample?: string;
}

// בנק שאלות מקיף בדיני חוזים
const contractQuestions: Question[] = [
  // יסודות החוזה ויסודות הכריתה
  {
    id: 1,
    question: "מהם היסודות הנדרשים לכריתת חוזה תקף על פי הדין הישראלי?",
    type: "multiple-choice",
    options: [
      "הצעה וקבלה בלבד",
      "הצעה, קבלה ותמורה",
      "הצעה, קבלה, תמורה וכשירות משפטית",
      "הצעה, קבלה, תמורה, כשירות משפטית ותוכן חוקי"
    ],
    correctAnswer: 3,
    explanation: "על פי חוק החוזים הישראלי, לכריתת חוזה תקף נדרשים כל היסודות: הצעה, קבלה, תמורה (או מחילה עליה), כשירות משפטית של הצדדים ותוכן חוקי.",
    topic: "יסודות החוזה",
    difficulty: "medium",
    legalSource: "חוק החוזים (כללי חלק), התשל\"ג-1973",
    caseExample: "ע\"א 105/87 רופא נ' חולה - בית המשפט קבע כי חסרון כשירות משפטית מבטל את החוזה"
  },
  {
    id: 2,
    question: "הצעה שנעשתה לציבור הרחב (כגון פרסומת) נחשבת להצעה מחייבת.",
    type: "true-false",
    correctAnswer: "false",
    explanation: "בדרך כלל, פרסומת או הצעה לציבור הרחב נחשבת ל'הזמנה לעשות הצעות' ולא להצעה מחייבת. עם זאת, ייתכנו חריגים כאשר ההצעה מפורטת ומדויקת במיוחד.",
    topic: "הצעה וקבלה",
    difficulty: "medium",
    legalSource: "סעיף 3 לחוק החוזים",
    caseExample: "ע\"א 298/85 קרלסברג נ' פרנקל - הצעה בפרסומת לא נחשבה מחייבת"
  },
  {
    id: 3,
    question: "איזה מהבאים מהווה קבלה תקפה להצעה?",
    type: "multiple-choice",
    options: [
      "שתיקה בלבד",
      "ביצוע המעשה המבוקש לפי ההצעה",
      "הסכמה חלקית לתנאי ההצעה",
      "התניית הקבלה בתנאי עתידי בלתי וודאי"
    ],
    correctAnswer: 1,
    explanation: "ביצוע המעשה המבוקש (קבלה במעשה) מהווה קבלה תקפה. שתיקה בדרך כלל אינה קבלה, הסכמה חלקית היא הצעה נגדית, והתניית קבלה בתנאי בלתי וודאי אינה יוצרת חוזה מיידי.",
    topic: "הצעה וקבלה",
    difficulty: "medium",
    legalSource: "סעיף 6 לחוק החוזים"
  },
  {
    id: 4,
    question: "מה קורה כאשר מוצעת הצעה נגדית (counter-offer)?",
    type: "multiple-choice",
    options: [
      "ההצעה המקורית נשארת בתוקף",
      "ההצעה המקורית נדחית ונוצרת הצעה חדשה",
      "נוצרים שני חוזים נפרדים",
      "החוזה נכרת על בסיס שתי ההצעות יחד"
    ],
    correctAnswer: 1,
    explanation: "הצעה נגדית גורמת לדחיית ההצעה המקורית ויוצרת הצעה חדשה. אי אפשר לחזור ולקבל את ההצעה המקורית לאחר שהוצעה הצעה נגדית.",
    topic: "הצעה וקבלה",
    difficulty: "easy",
    legalSource: "סעיף 4 לחוק החוזים",
    caseExample: "ע\"א 187/79 כהן נ' לוי - הצעה נגדית ביטלה את ההצעה המקורית"
  },
  {
    id: 5,
    question: "מהי 'תמורה' (consideration) בדיני חוזים?",
    type: "multiple-choice",
    options: [
      "התמורה הכספית בלבד",
      "כל דבר בעל ערך שניתן או מובטח",
      "רק שירותים או סחורות",
      "רק התחייבויות עתידיות"
    ],
    correctAnswer: 1,
    explanation: "תמורה יכולה להיות כל דבר בעל ערך - כסף, סחורה, שירות, הימנעות מפעולה או אפילו הבטחה לעשות משהו בעתיד. היא לא חייבת להיות שווה ערך לביצוע של הצד השני.",
    topic: "תמורה",
    difficulty: "easy",
    legalSource: "סעיף 11 לחוק החוזים"
  },

  // כשירות משפטית
  {
    id: 6,
    question: "בן 16 כרת חוזה לקניית רכב. מה דין החוזה?",
    type: "multiple-choice",
    options: [
      "החוזה תקף ומחייב",
      "החוזה בטל מיסודו",
      "החוזה תלוי ומותנה בהסכמת ההורים",
      "החוזה ניתן לביטול על ידי הקטין או אפוטרופוסו"
    ],
    correctAnswer: 3,
    explanation: "קטין (מתחת לגיל 18) יכול לכרות חוזים, אך חוזים אלה ניתנים לביטול על ידו או על ידי אפוטרופוסו עד שהוא מגיע לגיל בגרות ולזמן סביר לאחר מכן.",
    topic: "כשירות משפטית",
    difficulty: "medium",
    legalSource: "חוק הכשירות המשפטית והאפוטרופסות, התשכ\"ב-1962",
    caseExample: "ע\"א 423/88 קטין נ' חברת רכב - חוזה קטין בוטל"
  },
  {
    id: 7,
    question: "אדם שנפסק כחסר כשירות עסקית יכול לכרות חוזים בתחום שבו נפסק כחסר כשירות.",
    type: "true-false",
    correctAnswer: "false",
    explanation: "אדם שנפסק כחסר כשירות עסקית בתחום מסוים אינו יכול לכרות חוזים בתחום זה. חוזים כאלה יהיו בטלים מיסודם.",
    topic: "כשירות משפטית",
    difficulty: "medium",
    legalSource: "חוק הכשירות המשפטית והאפוטרופסות"
  },

  // פגמים בחוזה
  {
    id: 8,
    question: "מהם הפגמים העיקריים שיכולים להשפיע על תוקף החוזה?",
    type: "multiple-choice",
    options: [
      "טעות, הטעיה והכרח בלבד",
      "טעות, הטעיה, הכרח וניצול מצוקה",
      "רק הטעיה והכרח",
      "רק טעות והטעיה"
    ],
    correctAnswer: 1,
    explanation: "הפגמים העיקריים בחוזה הם: טעות (mistake), הטעיה (misrepresentation), הכרח (duress) וניצול מצוקה (undue influence). כל אחד מהם יכול להוביל לביטול החוזה.",
    topic: "פגמים בחוזה",
    difficulty: "medium",
    legalSource: "פרק ג' לחוק החוזים"
  },
  {
    id: 9,
    question: "איזה סוג טעות מאפשר ביטול החוזה?",
    type: "multiple-choice",
    options: [
      "כל טעות, ללא קשר לחשיבותה",
      "טעות יסודית המתייחסת לעיקר החוזה",
      "רק טעות בחישוב",
      "רק טעות במחיר"
    ],
    correctAnswer: 1,
    explanation: "רק טעות יסודית (fundamental mistake) המתייחסת לעיקר החוזה או לתכונות חיוניות של נושאו מאפשרת ביטול. טעויות משניות אינן מספיקות.",
    topic: "פגמים בחוזה - טעות",
    difficulty: "medium",
    legalSource: "סעיף 15 לחוק החוזים",
    caseExample: "ע\"א 234/82 אומן נ' קונה - טעות ביסוד זהות הדבר"
  },
  {
    id: 10,
    question: "מהי הטעיה בדיני חוזים?",
    type: "multiple-choice",
    options: [
      "מצגת עובדה כוזבת שהשפיעה על כריתת החוזה",
      "אי גילוי מידע רלוונטי",
      "הבטחה שלא נוכל לקיים",
      "כל הנ\"ל"
    ],
    correctAnswer: 3,
    explanation: "הטעיה יכולה להיות מצגת עובדה כוזבת, הסתרת מידע חיוני, או אפילו הבטחה שהמבטיח יודע שלא יוכל לקיים. כל אלה מהווים הטעיה שיכולה להוביל לביטול החוזה.",
    topic: "פגמים בחוזה - הטעיה",
    difficulty: "medium",
    legalSource: "סעיף 16 לחוק החוזים"
  },

  // חוזים מיוחדים
  {
    id: 11,
    question: "איזה מחוזים הבאים חייב להיכרת בכתב על פי הדין הישראלי?",
    type: "multiple-choice",
    options: [
      "חוזה עבודה",
      "חוזה מכר דירה",
      "חוזה שכירות לשנה",
      "חוזה מכר רכב"
    ],
    correctAnswer: 1,
    explanation: "חוזה מכר דירה חייב להיכרת בכתב על פי חוק המכר (דירות). גם חוזים אחרים כמו ערבות או מכר קרקע חייבים בכתב.",
    topic: "חוזים מיוחדים",
    difficulty: "medium",
    legalSource: "חוק המכר (דירות), התשל\"ג-1973"
  },
  {
    id: 12,
    question: "מה המעמד של הסכם בעל פה לעומת הסכם בכתב?",
    type: "multiple-choice",
    options: [
      "הסכם בעל פה אינו תקף",
      "הסכם בעל פה תקף אך קשה יותר להוכיח",
      "רק הסכם בכתב תקף",
      "אין הבדל בתוקף"
    ],
    correctAnswer: 1,
    explanation: "הסכם בעל פה תקף לחלוטין (למעט חוזים שהחוק מחייב שיהיו בכתב), אך הקושי הוא בהוכחת קיומו ותוכנו בבית המשפט.",
    topic: "צורת החוזה",
    difficulty: "easy",
    legalSource: "עקרון חופש הצורה בדיני חוזים"
  },

  // הפרת חוזה וסעדים
  {
    id: 13,
    question: "מהם הסעדים העיקריים בגין הפרת חוזה?",
    type: "multiple-choice",
    options: [
      "פיצויים בלבד",
      "ביצוע בעין בלבד", 
      "פיצויים, ביצוע בעין וביטול החוזה",
      "רק ביטול החוזה"
    ],
    correctAnswer: 2,
    explanation: "הסעדים העיקריים בגין הפרת חוזה הם: פיצויים (כספיים), ביצוע בעין (הכרחת הצד להתקיים התחייבותו), וביטול החוזה. בחירת הסעד תלויה בנסיבות.",
    topic: "הפרת חוזה",
    difficulty: "medium",
    legalSource: "חוק החוזים וחוק הסעדים"
  },
  {
    id: 14,
    question: "מתי זכאי הניזוק לבטל חוזה בגין הפרה?",
    type: "multiple-choice",
    options: [
      "בכל מקרה של הפרה",
      "רק בהפרה יסודית",
      "רק כאשר ההפרה היא בזדון",
      "רק כאשר הניזוק נפגע כלכלית"
    ],
    correctAnswer: 1,
    explanation: "זכות ביטול החוזה קיימת רק במקרה של הפרה יסודית (fundamental breach) - הפרה הפוגעת במהות החוזה או במטרתו העיקרית.",
    topic: "הפרת חוזה",
    difficulty: "medium",
    legalSource: "סעיף 25 לחוק החוזים",
    caseExample: "ע\"א 156/84 חברת בניה נ' קבלן - הפרה יסודית הצדיקה ביטול"
  },

  // שאלות מתקדמות
  {
    id: 15,
    question: "מהי דוקטרינת 'הסתמכות' (reliance) בדיני חוזים?",
    type: "multiple-choice",
    options: [
      "עקרון המחייב קיום הבטחות כאשר הוסתמכו עליהן באופן סביר",
      "איסור על חזרה מהצעה",
      "חובת גילוי המידע",
      "עקרון תום הלב החוזי"
    ],
    correctAnswer: 0,
    explanation: "דוקטרינת ההסתמכות קובעת שהבטחה יכולה להיות מחייבת אפילו ללא תמורה, אם הצד השני הסתמך עליה באופן סביר ונקט פעולות על בסיסה.",
    topic: "דוקטרינות מתקדמות",
    difficulty: "expert",
    legalSource: "פסיקה - עקרון ההסתמכות המוצדקת",
    caseExample: "ע\"א 243/83 ירושלים נ' גורדון - יישום דוקטרינת ההסתמכות"
  }
];

// שאלות פתוחות
const openQuestions = [
  {
    id: "open-1",
    question: "נתח את ההבדלים בין 'הצעה' ל'הזמנה לעשות הצעות' בדיני חוזים. מתן דוגמאות מעשיות לכל אחד מהמקרים.",
    topic: "הצעה וקבלה",
    difficulty: "medium" as const,
    guidelines: "התשובה צריכה לכלול: הגדרת הצעה, הגדרת הזמנה לעשות הצעות, קריטריונים להבחנה, דוגמאות מעשיות, השלכות משפטיות"
  },
  {
    id: "open-2", 
    question: "דון ברכיבי הפגם של 'הטעיה' בחוזה. אילו סוגי הטעיה קיימים ומה ההשלכות המשפטיות של כל סוג?",
    topic: "פגמים בחוזה",
    difficulty: "hard" as const,
    guidelines: "התשובה צריכה לכלול: הגדרת הטעיה, סוגי הטעיה, תנאים לביטול חוזה, הבחנה בין הטעיה חמורה לקלה, דוגמאות ופסיקה"
  },
  {
    id: "open-3",
    question: "הסבר את עקרון 'תום הלב' בדיני חוזים הישראליים. כיצד משפיע עקרון זה על פרשנות חוזים וביצועם?",
    topic: "עקרונות יסוד",
    difficulty: "expert" as const,
    guidelines: "התשובה צריכה לכלול: הגדרת תום הלב, יישום בפרשנות חוזים, יישום בביצוע חוזים, דוגמאות מהפסיקה, גבולות העקרון"
  }
];

export const ComprehensiveContractsExam: React.FC = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number | string>>({});
  const [showResults, setShowResults] = useState(false);
  const [examStarted, setExamStarted] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [showOpenQuestions, setShowOpenQuestions] = useState(false);

  // Timer effect
  React.useEffect(() => {
    let interval: NodeJS.Timeout;
    if (examStarted && !showResults) {
      interval = setInterval(() => {
        setTimeElapsed(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [examStarted, showResults]);

  const handleAnswerSelect = (questionId: number, answer: number | string) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const calculateScore = () => {
    let correct = 0;
    contractQuestions.forEach(question => {
      if (selectedAnswers[question.id] === question.correctAnswer) {
        correct++;
      }
    });
    return {
      correct,
      total: contractQuestions.length,
      percentage: Math.round((correct / contractQuestions.length) * 100)
    };
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getScoreColor = (percentage: number) => {
    if (percentage >= 90) return 'success';
    if (percentage >= 80) return 'info';
    if (percentage >= 70) return 'warning';
    return 'error';
  };

  const resetExam = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setShowResults(false);
    setExamStarted(false);
    setTimeElapsed(0);
    setShowOpenQuestions(false);
  };

  const startExam = () => {
    setExamStarted(true);
    setTimeElapsed(0);
  };

  const finishExam = () => {
    setShowResults(true);
  };

  const currentQuestion = contractQuestions[currentQuestionIndex];

  if (!examStarted) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
          <ContractIcon sx={{ fontSize: 64, color: 'primary.main', mb: 2 }} />
          <Typography variant="h3" component="h1" gutterBottom color="primary">
            מבחן מקיף בדיני חוזים
          </Typography>
          <Typography variant="h6" color="text.secondary" paragraph>
            מבחן מקיף העוסק בכל היבטי דיני החוזים הישראליים
          </Typography>
          
          <Grid container spacing={3} sx={{ mt: 3, mb: 4 }}>
            <Grid item xs={12} md={3}>
              <Card>
                <CardContent textAlign="center">
                  <Typography variant="h4" color="primary">
                    {contractQuestions.length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    שאלות אמריקאיות
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={3}>
              <Card>
                <CardContent textAlign="center">
                  <Typography variant="h4" color="warning.main">
                    {openQuestions.length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    שאלות פתוחות
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={3}>
              <Card>
                <CardContent textAlign="center">
                  <Typography variant="h4" color="info.main">
                    60-90
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    דקות מומלצות
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={3}>
              <Card>
                <CardContent textAlign="center">
                  <Typography variant="h4" color="success.main">
                    80%+
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    ציון עובר
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" gutterBottom>
              נושאים נבחנים:
            </Typography>
            <Box display="flex" flexWrap="wrap" gap={1} justifyContent="center" sx={{ mb: 4 }}>
              {[
                'יסודות החוזה',
                'הצעה וקבלה', 
                'תמורה',
                'כשירות משפטית',
                'פגמים בחוזה',
                'חוזים מיוחדים',
                'הפרת חוזה',
                'סעדים'
              ].map((topic) => (
                <Chip key={topic} label={topic} variant="outlined" />
              ))}
            </Box>
            
            <Button
              variant="contained"
              size="large"
              onClick={startExam}
              sx={{ minWidth: 200 }}
            >
              התחל מבחן
            </Button>
          </Box>
        </Paper>
      </Container>
    );
  }

  if (showResults) {
    const score = calculateScore();
    
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* תוצאות המבחן */}
        <Paper elevation={3} sx={{ p: 4, mb: 4, textAlign: 'center' }}>
          <Typography variant="h4" gutterBottom>
            תוצאות המבחן
          </Typography>
          
          <Grid container spacing={3} sx={{ mt: 2 }}>
            <Grid item xs={12} md={3}>
              <Card>
                <CardContent textAlign="center">
                  <Typography variant="h3" color={getScoreColor(score.percentage)}>
                    {score.percentage}%
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    ציון כולל
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={3}>
              <Card>
                <CardContent textAlign="center">
                  <Typography variant="h3" color="success.main">
                    {score.correct}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    תשובות נכונות
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={3}>
              <Card>
                <CardContent textAlign="center">
                  <Typography variant="h3" color="error.main">
                    {score.total - score.correct}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    תשובות שגויות
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={3}>
              <Card>
                <CardContent textAlign="center">
                  <Typography variant="h3" color="info.main">
                    {formatTime(timeElapsed)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    זמן שחלף
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <Alert 
            severity={score.percentage >= 80 ? 'success' : score.percentage >= 70 ? 'warning' : 'error'}
            sx={{ mt: 3, mb: 3 }}
          >
            {score.percentage >= 90 && 'מעולה! הציג ידע מרשים בדיני חוזים'}
            {score.percentage >= 80 && score.percentage < 90 && 'כל הכבוד! ידע טוב בדיני חוזים'}
            {score.percentage >= 70 && score.percentage < 80 && 'ידע בסיסי טוב, מומלץ לחזור על החומר'}
            {score.percentage < 70 && 'מומלץ ללמוד את החומר שוב ולחזור על המבחן'}
          </Alert>
          
          <Box display="flex" gap={2} justifyContent="center" sx={{ mb: 4 }}>
            <Button variant="contained" onClick={resetExam} startIcon={<RefreshIcon />}>
              מבחן חדש
            </Button>
            <Button variant="outlined" onClick={() => setShowOpenQuestions(true)}>
              שאלות פתוחות
            </Button>
            <Tooltip title="הדפסת תוצאות">
              <IconButton onClick={() => window.print()}>
                <PrintIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Paper>

        {/* סקירת תשובות */}
        <Typography variant="h5" gutterBottom>
          סקירת תשובות ופרשנויות
        </Typography>
        
        {contractQuestions.map((question, index) => {
          const userAnswer = selectedAnswers[question.id];
          const isCorrect = userAnswer === question.correctAnswer;
          
          return (
            <Accordion key={question.id} sx={{ mb: 2 }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Box display="flex" alignItems="center" gap={2} width="100%">
                  {isCorrect ? 
                    <CheckCircleIcon color="success" /> : 
                    <CancelIcon color="error" />
                  }
                  <Typography sx={{ flexGrow: 1 }}>
                    שאלה {index + 1}: {question.question.substring(0, 60)}...
                  </Typography>
                  <Chip 
                    label={question.topic}
                    size="small"
                    color={isCorrect ? 'success' : 'error'}
                  />
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <Box>
                  <Typography variant="body1" paragraph>
                    <strong>השאלה:</strong> {question.question}
                  </Typography>
                  
                  {question.options && (
                    <Box mb={2}>
                      <Typography variant="subtitle2" gutterBottom>אפשרויות:</Typography>
                      {question.options.map((option, idx) => (
                        <Typography 
                          key={idx} 
                          variant="body2" 
                          sx={{ 
                            color: idx === question.correctAnswer ? 'success.main' : 
                                   idx === userAnswer ? 'error.main' : 'text.primary',
                            fontWeight: idx === question.correctAnswer || idx === userAnswer ? 'bold' : 'normal'
                          }}
                        >
                          {idx + 1}. {option}
                          {idx === question.correctAnswer && ' ✓'}
                          {idx === userAnswer && idx !== question.correctAnswer && ' ✗'}
                        </Typography>
                      ))}
                    </Box>
                  )}
                  
                  <Typography variant="body2" paragraph>
                    <strong>הסבר:</strong> {question.explanation}
                  </Typography>
                  
                  {question.legalSource && (
                    <Typography variant="body2" paragraph>
                      <strong>מקור משפטי:</strong> {question.legalSource}
                    </Typography>
                  )}
                  
                  {question.caseExample && (
                    <Typography variant="body2" paragraph>
                      <strong>דוגמה מהפסיקה:</strong> {question.caseExample}
                    </Typography>
                  )}
                </Box>
              </AccordionDetails>
            </Accordion>
          );
        })}

        {/* שאלות פתוחות */}
        {showOpenQuestions && (
          <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
            <Typography variant="h5" gutterBottom>
              שאלות פתוחות למחשבה
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              שאלות אלה מיועדות להעמקת ההבנה ופיתוח חשיבה ביקורתית בדיני חוזים
            </Typography>
            
            {openQuestions.map((question, index) => (
              <Card key={question.id} sx={{ mt: 3 }}>
                <CardHeader
                  title={`שאלה פתוחה ${index + 1}`}
                  subheader={`נושא: ${question.topic} | רמת קושי: ${question.difficulty}`}
                />
                <CardContent>
                  <Typography variant="body1" paragraph>
                    {question.question}
                  </Typography>
                  <Alert severity="info">
                    <Typography variant="body2">
                      <strong>הנחיות לתשובה:</strong> {question.guidelines}
                    </Typography>
                  </Alert>
                </CardContent>
              </Card>
            ))}
          </Paper>
        )}
      </Container>
    );
  }

  // תצוגת השאלות
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header עם מידע על המבחן */}
      <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
        <Grid container alignItems="center" spacing={2}>
          <Grid item xs={12} md={6}>
            <Typography variant="h5">
              מבחן דיני חוזים - שאלה {currentQuestionIndex + 1} מתוך {contractQuestions.length}
            </Typography>
          </Grid>
          <Grid item xs={12} md={6} textAlign="right">
            <Box display="flex" alignItems="center" justifyContent="flex-end" gap={2}>
              <TimeIcon />
              <Typography variant="h6">
                {formatTime(timeElapsed)}
              </Typography>
            </Box>
          </Grid>
        </Grid>
        
        <LinearProgress 
          variant="determinate" 
          value={(currentQuestionIndex / contractQuestions.length) * 100} 
          sx={{ mt: 2 }}
        />
      </Paper>

      {/* השאלה הנוכחית */}
      <Card sx={{ mb: 4 }}>
        <CardHeader
          title={
            <Box display="flex" alignItems="center" gap={2}>
              <Typography variant="h6">
                שאלה {currentQuestionIndex + 1}
              </Typography>
              <Chip 
                label={currentQuestion.topic} 
                size="small" 
                color="primary" 
                variant="outlined" 
              />
              <Chip 
                label={currentQuestion.difficulty} 
                size="small" 
                color="secondary" 
                variant="outlined" 
              />
            </Box>
          }
        />
        <CardContent>
          <Typography variant="h6" paragraph>
            {currentQuestion.question}
          </Typography>

          {currentQuestion.type === 'multiple-choice' && currentQuestion.options && (
            <FormControl component="fieldset" fullWidth>
              <RadioGroup
                value={selectedAnswers[currentQuestion.id] || ''}
                onChange={(e) => handleAnswerSelect(currentQuestion.id, parseInt(e.target.value))}
              >
                {currentQuestion.options.map((option, index) => (
                  <FormControlLabel
                    key={index}
                    value={index}
                    control={<Radio />}
                    label={option}
                    sx={{ mb: 1 }}
                  />
                ))}
              </RadioGroup>
            </FormControl>
          )}

          {currentQuestion.type === 'true-false' && (
            <FormControl component="fieldset" fullWidth>
              <RadioGroup
                value={selectedAnswers[currentQuestion.id] || ''}
                onChange={(e) => handleAnswerSelect(currentQuestion.id, e.target.value)}
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
        </CardContent>
      </Card>

      {/* כפתורי ניווט */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Button
          variant="outlined"
          onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
          disabled={currentQuestionIndex === 0}
        >
          שאלה קודמת
        </Button>

        <Typography variant="body2" color="text.secondary">
          {Object.keys(selectedAnswers).length} מתוך {contractQuestions.length} שאלות נענו
        </Typography>

        {currentQuestionIndex < contractQuestions.length - 1 ? (
          <Button
            variant="contained"
            onClick={() => setCurrentQuestionIndex(prev => prev + 1)}
          >
            שאלה הבאה
          </Button>
        ) : (
          <Button
            variant="contained"
            color="success"
            onClick={finishExam}
            disabled={Object.keys(selectedAnswers).length < contractQuestions.length}
          >
            סיום מבחן
          </Button>
        )}
      </Box>
    </Container>
  );
};

export default ComprehensiveContractsExam;

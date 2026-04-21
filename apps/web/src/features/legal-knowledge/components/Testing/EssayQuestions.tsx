import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  Typography, 
  Box, 
  Button,
  Grid,
  Paper,
  Chip,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Alert,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Avatar,
  Tabs,
  Tab,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import { 
  Close as CloseIcon,
  Edit as EditIcon,
  CheckCircle as CheckIcon,
  Star as StarIcon,
  Timer as TimerIcon,
  Save as SaveIcon,
  ExpandMore as ExpandIcon,
  Lightbulb as TipIcon,
  Assessment as GradeIcon,
  AutoAwesome as ExampleIcon
} from '@mui/icons-material';

interface EssayQuestion {
  id: string;
  difficulty: 'easy' | 'medium' | 'hard' | 'expert';
  category: string;
  question: string;
  points: number;
  timeEstimate: number; // in minutes
  keyPoints: string[];
  exampleAnswer: string;
  gradingCriteria: GradingCriterion[];
  legalSources: string[];
  relatedCases?: string[];
  tips: string[];
}

interface GradingCriterion {
  aspect: string;
  description: string;
  maxPoints: number;
  keywords: string[];
}

interface UserAnswer {
  questionId: string;
  answer: string;
  timeSpent: number;
  savedAt: Date;
  grade?: number;
  feedback?: string;
}

const essayQuestions: EssayQuestion[] = [
  // רמה קלה
  {
    id: 'essay_1',
    difficulty: 'easy',
    category: 'משפט מנהלי',
    question: 'הסבירי את עקרון חוקיות המנהל בישראל.',
    points: 10,
    timeEstimate: 15,
    keyPoints: [
      'הגדרת עקרון חוקיות המנהל',
      'הרשות המבצעת רשאית לפעול רק על סמך חוק',
      'דוגמאות מעשיות',
      'הגנה על זכויות הפרט',
      'מניעת פעולה שרירותית'
    ],
    exampleAnswer: `עקרון חוקיות המנהל קובע שהרשות המבצעת רשאית לפעול רק על סמך חוק. 

דוגמה: תקנות ממשלתיות חייבות להיות בסמכות חוקית, אחרת הן בטלות.

דגש: עקרון זה מגן על זכויות הפרט ומונע פעולה שרירותית של הרשויות.

העקרון מבטיח שכל פעולה מנהלית תהיה מוצדקת ומבוססת על סמכות חוקית ברורה, ולא על שיקול דעת שרירותי של פקידים.`,
    gradingCriteria: [
      {
        aspect: 'הגדרה נכונה',
        description: 'הגדרה מדויקת של עקרון חוקיות המנהל',
        maxPoints: 3,
        keywords: ['רשאית לפעול רק על סמך חוק', 'רשות מבצעת', 'סמכות חוקית']
      },
      {
        aspect: 'דוגמאות',
        description: 'מתן דוגמאות מעשיות ורלוונטיות',
        maxPoints: 3,
        keywords: ['תקנות', 'בטלות', 'סמכות', 'פעולה מנהלית']
      },
      {
        aspect: 'משמעות והגנה',
        description: 'הסבר על חשיבות העקרון להגנת זכויות',
        maxPoints: 4,
        keywords: ['זכויות פרט', 'שרירותית', 'הגנה', 'מוצדק']
      }
    ],
    legalSources: ['פסיקת בג"ץ 390/79 דוויקאת', 'עקרונות משפט מנהלי'],
    tips: [
      'התחילי בהגדרה ברורה של העקרון',
      'תני דוגמה קונקרטית',
      'הסבירי מדוע זה חשוב לדמוקרטיה'
    ]
  },
  {
    id: 'essay_2',
    difficulty: 'easy',
    category: 'חקיקה',
    question: 'מה ההבדל בין חקיקה ראשית לחקיקת משנה?',
    points: 10,
    timeEstimate: 12,
    keyPoints: [
      'הגדרת חקיקה ראשית',
      'הגדרת חקיקת משנה',
      'מי מחוקק כל סוג',
      'היחס בין השניים',
      'דוגמאות'
    ],
    exampleAnswer: `חקיקה ראשית – חוקים שנחקקו על ידי הכנסת, בעלי עליונות נורמטיבית.

חקיקת משנה – תקנות וצווי ממשלה, כפופים לחקיקה ראשית.

דגש: חקיקת משנה אינה רשאית ליצור חוקים ראשיים אלא להבהיר או ליישם חוקים קיימים.

הכנסת מחוקקת חוקים בסיסיים, והממשלה יוצרת תקנות מפורטות ליישומם.`,
    gradingCriteria: [
      {
        aspect: 'הגדרות נכונות',
        description: 'הגדרה מדויקת של שני סוגי החקיקה',
        maxPoints: 4,
        keywords: ['כנסת', 'ממשלה', 'תקנות', 'עליונות']
      },
      {
        aspect: 'יחסי כפיפות',
        description: 'הסבר נכון של היחס ההיררכי',
        maxPoints: 3,
        keywords: ['כפופים', 'עליונות', 'לא רשאית']
      },
      {
        aspect: 'דוגמאות',
        description: 'מתן דוגמאות מתאימות',
        maxPoints: 3,
        keywords: ['חוק', 'תקנה', 'יישום', 'הבהרה']
      }
    ],
    legalSources: ['חוק יסוד: הכנסת', 'חוק יסוד: הממשלה'],
    tips: [
      'הבחיני בבירור בין התפקידים',
      'הדגישי את עיקרון ההיררכיה',
      'תני דוגמה לכל סוג'
    ]
  },
  {
    id: 'essay_3',
    difficulty: 'easy',
    category: 'פרשנות',
    question: 'מהו המשפט הדינמי?',
    points: 8,
    timeEstimate: 10,
    keyPoints: [
      'הגדרת פרשנות דינמית',
      'התאמה למציאות משתנה',
      'דוגמאות',
      'יתרונות',
      'קשר לטכנולוגיה'
    ],
    exampleAnswer: `פרשנות החוק בהתאם לצרכים והנסיבות העכשוויות.

דוגמה: שינוי בשוק או בטכנולוגיה מחייב פרשנות גמישה של חוקים קיימים.

דגש: מאפשר התאמה בין החוק למציאות המשתנה, מבלי לשנות את החוק עצמו.`,
    gradingCriteria: [
      {
        aspect: 'הגדרה',
        description: 'הגדרה נכונה של פרשנות דינמית',
        maxPoints: 3,
        keywords: ['צרכים עכשוויים', 'מציאות משתנה', 'התאמה']
      },
      {
        aspect: 'דוגמאות',
        description: 'דוגמאות רלוונטיות',
        maxPoints: 3,
        keywords: ['טכנולוגיה', 'שוק', 'שינוי']
      },
      {
        aspect: 'יתרונות',
        description: 'הסבר על חשיבות הגמישות',
        maxPoints: 2,
        keywords: ['גמישות', 'ללא שינוי החוק']
      }
    ],
    legalSources: ['תורת הפרשנות המשפטית'],
    tips: [
      'הדגישי את הגמישות',
      'תני דוגמה מהעולם המודרני',
      'הסבירי מדוע זה עדיף על פרשנות סטטית'
    ]
  },

  // רמה בינונית
  {
    id: 'essay_4',
    difficulty: 'medium',
    category: 'חוקי יסוד',
    question: 'הסבירי את עקרון עליונות חוקי היסוד.',
    points: 12,
    timeEstimate: 18,
    keyPoints: [
      'הגדרת עליונות חוקי יסוד',
      'יחס לחוקים רגילים',
      'תפקיד בג"ץ',
      'המהפכה החוקתית',
      'דוגמאות מעשיות'
    ],
    exampleAnswer: `חוקי יסוד הם עליונים ביחס לחוקים רגילים.

דוגמה: חוק רגיל הסותר חוק יסוד עלול להיפסל על ידי בג"ץ.

דגש: הבטחת זכויות יסוד ושמירה על מסגרת דמוקרטית.

המהפכה החוקתית של שנות ה-90 חיזקה עקרון זה ויצרה ביקורת חוקתית אפקטיבית.`,
    gradingCriteria: [
      {
        aspect: 'עקרון העליונות',
        description: 'הסבר נכון של עליונות חוקי היסוד',
        maxPoints: 4,
        keywords: ['עליונים', 'חוקים רגילים', 'היררכיה']
      },
      {
        aspect: 'תפקיד בג"ץ',
        description: 'הסבר על ביקורת חוקתית',
        maxPoints: 4,
        keywords: ['בג"ץ', 'פסילה', 'ביקורת חוקתית']
      },
      {
        aspect: 'משמעות דמוקרטית',
        description: 'קשר לזכויות יסוד ודמוקרטיה',
        maxPoints: 4,
        keywords: ['זכויות יסוד', 'דמוקרטיה', 'הגנה']
      }
    ],
    legalSources: ['בג"ץ 6821/93 בנק מזרחי', 'חוק יסוד: כבוד האדם וחירותו'],
    relatedCases: ['פס"ד בנק מזרחי - המהפכה החוקתית'],
    tips: [
      'קשרי למהפכה החוקתית',
      'הסבירי את חשיבות הביקורת החוקתית',
      'תני דוגמה לפסילת חוק'
    ]
  },
  {
    id: 'essay_5',
    difficulty: 'medium',
    category: 'פסיקה',
    question: 'נתחי את משמעות "פסיקה מנחה" והקשר שלה לסטיית תקדים.',
    points: 12,
    timeEstimate: 20,
    keyPoints: [
      'הגדרת פסיקה מנחה',
      'עקרון Stare Decisis',
      'מתי מותרת סטיית תקדים',
      'דוגמאות',
      'איזון בין יציבות לגמישות'
    ],
    exampleAnswer: `פסיקה מנחה – פסק דין שמהווה תקדים מחייב לערכאות נמוכות יותר.

דוגמה: בג"ץ קובע כללים לפסילת חוקים – הערכאות חייבות לפעול בהתאם.

דגש: סטיית תקדים אפשרית רק במצבים חריגים ושקולים.

העקרון יוצר יציבות משפטית אך מאפשר התפתחות במקרים מוצדקים.`,
    gradingCriteria: [
      {
        aspect: 'הגדרת פסיקה מנחה',
        description: 'הבנה נכונה של תקדים מחייב',
        maxPoints: 4,
        keywords: ['תקדים', 'מחייב', 'ערכאות נמוכות']
      },
      {
        aspect: 'סטיית תקדים',
        description: 'הסבר מתי ואיך מותר לסטות',
        maxPoints: 4,
        keywords: ['מצבים חריגים', 'מוצדק', 'שינוי נסיבות']
      },
      {
        aspect: 'איזון',
        description: 'הבנת האיזון בין יציבות וגמישות',
        maxPoints: 4,
        keywords: ['יציבות', 'גמישות', 'התפתחות']
      }
    ],
    legalSources: ['עקרונות המשפט המקובל', 'פסיקת בג"ץ'],
    tips: [
      'הסבירי את חשיבות היציבות המשפטית',
      'תני דוגמה לסטיית תקדים מוצדקת',
      'הדגישי את האיזון הנדרש'
    ]
  },

  // רמה קשה
  {
    id: 'essay_7',
    difficulty: 'hard',
    category: 'פסיקה חוקתית',
    question: 'נתחי את פס"ד קול העם והשפעתו על חופש הביטוי.',
    points: 15,
    timeEstimate: 25,
    keyPoints: [
      'רקע פס"ד קול העם',
      'חופש ביטוי כערך על-חוקי',
      'מבחן הפגיעה המידתית',
      'השפעה על פסיקה עתידית',
      'מעמד בג"ץ כמגן זכויות'
    ],
    exampleAnswer: `פס"ד קול העם הכיר בחשיבות חופש הביטוי כערך על-חוקי.

דוגמה: פסק הדין איפשר פגיעה מוגבלת בחקיקה רק לצרכי בטחון הציבור.

דגש: חיזק את מעמד בג"ץ כמגן זכויות יסוד.

הפסיקה יצרה תקדים חשוב לאיזון בין חופש ביטוי לבטחון ציבורי, והביסה את הבסיס לפיתוח זכויות חוקתיות בישראל.`,
    gradingCriteria: [
      {
        aspect: 'הכרת הפסיקה',
        description: 'ידע על פס"ד קול העם',
        maxPoints: 5,
        keywords: ['קול העם', 'חופש ביטוי', 'ערך על-חוקי']
      },
      {
        aspect: 'מבחן איזון',
        description: 'הבנת מבחן האיזון שנקבע',
        maxPoints: 5,
        keywords: ['בטחון ציבור', 'איזון', 'פגיעה מוגבלת']
      },
      {
        aspect: 'השפעה היסטורית',
        description: 'הבנת השפעת הפסיקה על המשפט הישראלי',
        maxPoints: 5,
        keywords: ['תקדים', 'זכויות חוקתיות', 'מגן זכויות']
      }
    ],
    legalSources: ['ע"א 73/53 קול העם נגד שר הפנים'],
    relatedCases: ['פס"ד קול העם', 'פיתוח זכויות יסוד'],
    tips: [
      'הקשירי להקשר ההיסטורי',
      'הסבירי את חשיבות התקדים',
      'נתחי את מבחן האיזון שנקבע'
    ]
  },

  // רמה מומחה
  {
    id: 'essay_9',
    difficulty: 'expert',
    category: 'משפט דתי',
    question: 'נתחי את מעמד המשפט העברי במערכת המשפטית הישראלית.',
    points: 18,
    timeEstimate: 30,
    keyPoints: [
      'מעמד המשפט העברי כמקור עזר',
      'תחומי יישום עיקריים',
      'יחס לחקיקה כללית',
      'דוגמאות מדיני משפחה',
      'הבעייתיות והפוטנציאל'
    ],
    exampleAnswer: `מקור עזר במקרים שאין חקיקה ברורה, בעיקר בדיני משפחה ואישי.

דוגמה: שימוש בכתבי ההלכה או פסקי דין עבריים להשלים פערים.

דגש: אינו מחייב, אך מספק עוגן מוסרי וחוקתי.

המשפט העברי משמש כמקור השראה וכלי פרשני, אך אינו יכול לגבור על חקיקה חילונית ברורה.`,
    gradingCriteria: [
      {
        aspect: 'מעמד משפטי',
        description: 'הבנת המעמד כמקור עזר',
        maxPoints: 6,
        keywords: ['מקור עזר', 'לא מחייב', 'פערים']
      },
      {
        aspect: 'תחומי יישום',
        description: 'ידע על תחומי השימוש העיקריים',
        maxPoints: 6,
        keywords: ['דיני משפחה', 'אישי', 'הלכה']
      },
      {
        aspect: 'יחס לחקיקה',
        description: 'הבנת הקשר למשפט החילוני',
        maxPoints: 6,
        keywords: ['חקיקה חילונית', 'עוגן מוסרי', 'השראה']
      }
    ],
    legalSources: ['חוק שפיטת בתי דין רבניים', 'פסיקת בג"ץ בעניינים דתיים'],
    tips: [
      'הבחיני בין דיני משפחה לתחומים אחרים',
      'הסבירי את המגבלות',
      'תני דוגמה קונקרטית'
    ]
  },
  {
    id: 'essay_10',
    difficulty: 'expert',
    category: 'תיאוריה משפטית',
    question: 'האם יש בישראל "עליון" נורמטיבי אחד או ריבוי מקורות עליונות? נמקי.',
    points: 20,
    timeEstimate: 35,
    keyPoints: [
      'ניתוח המערכת החוקתית הישראלית',
      'חוקי יסוד כמקור עליון',
      'פסיקה על-חוקית',
      'עקרונות משפט טבעי',
      'השוואה למערכות אחרות'
    ],
    exampleAnswer: `ריבוי מקורות עליונות – חוקי יסוד, פסיקה על-חוקית (כמו קול העם), עקרונות משפט טבעי.

דוגמה: כל מקור עשוי להשפיע על פרשנות או פסיקה.

דגש: המערכת אינה חוקה פורמלית אחת, אלא היברידית הכוללת מקורות מגוונים.

זה יוצר גמישות אך גם אי-ודאות לעיתים בקביעת המקור העליון בכל מקרה ספציפי.`,
    gradingCriteria: [
      {
        aspect: 'ניתוח המערכת',
        description: 'הבנה מעמיקה של המערכת החוקתית',
        maxPoints: 7,
        keywords: ['היברידית', 'ריבוי מקורות', 'לא חוקה פורמלית']
      },
      {
        aspect: 'זיהוי מקורות',
        description: 'זיהוי נכון של המקורות העליונים',
        maxPoints: 7,
        keywords: ['חוקי יסוד', 'פסיקה על-חוקית', 'משפט טבעי']
      },
      {
        aspect: 'הערכה ביקורתית',
        description: 'הערכת היתרונות והחסרונות',
        maxPoints: 6,
        keywords: ['גמישות', 'אי-ודאות', 'יתרונות', 'חסרונות']
      }
    ],
    legalSources: ['חוקי יסוד שונים', 'פסיקת בג"ץ', 'תיאוריה חוקתית'],
    tips: [
      'השווי למערכות אחרות',
      'נתחי יתרונות וחסרונות',
      'תני דוגמאות ספציפיות'
    ]
  }
];

interface EssayQuestionsProps {
  onSaveAnswer: (answer: UserAnswer) => void;
  savedAnswers?: UserAnswer[];
}

export const EssayQuestions: React.FC<EssayQuestionsProps> = ({
  onSaveAnswer,
  savedAnswers = []
}) => {
  const [selectedQuestion, setSelectedQuestion] = useState<EssayQuestion | null>(null);
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [timeSpent, setTimeSpent] = useState(0);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [selectedTab, setSelectedTab] = useState(0);
  const [filterDifficulty, setFilterDifficulty] = useState<string>('all');
  const [autoSave, setAutoSave] = useState(true);

  // טיימר
  useEffect(() => {
    if (selectedQuestion && startTime) {
      const timer = setInterval(() => {
        setTimeSpent(Math.floor((new Date().getTime() - startTime.getTime()) / 1000 / 60));
      }, 60000); // עדכון כל דקה
      
      return () => clearInterval(timer);
    }
  }, [selectedQuestion, startTime]);

  // שמירה אוטומטית
  useEffect(() => {
    if (autoSave && selectedQuestion && currentAnswer.length > 50) {
      const saveTimeout = setTimeout(() => {
        handleSaveAnswer();
      }, 5000); // שמירה אחרי 5 שניות של חוסר פעילות
      
      return () => clearTimeout(saveTimeout);
    }
  }, [currentAnswer, autoSave, selectedQuestion]);

  // פתיחת שאלה
  const openQuestion = (question: EssayQuestion) => {
    setSelectedQuestion(question);
    setStartTime(new Date());
    setTimeSpent(0);
    
    // טעינת תשובה שמורה אם קיימת
    const savedAnswer = savedAnswers.find(a => a.questionId === question.id);
    if (savedAnswer) {
      setCurrentAnswer(savedAnswer.answer);
    } else {
      setCurrentAnswer('');
    }
  };

  // שמירת תשובה
  const handleSaveAnswer = () => {
    if (!selectedQuestion || !currentAnswer.trim()) return;
    
    const answer: UserAnswer = {
      questionId: selectedQuestion.id,
      answer: currentAnswer.trim(),
      timeSpent,
      savedAt: new Date()
    };
    
    onSaveAnswer(answer);
  };

  // קבלת צבע לפי קושי
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return '#4caf50';
      case 'medium': return '#ff9800';
      case 'hard': return '#f44336';
      case 'expert': return '#9c27b0';
      default: return '#9e9e9e';
    }
  };

  // קבלת תווית קושי
  const getDifficultyLabel = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'קל';
      case 'medium': return 'בינוני';
      case 'hard': return 'קשה';
      case 'expert': return 'מומחה';
      default: return 'לא ידוע';
    }
  };

  // פילטור שאלות
  const filteredQuestions = essayQuestions.filter(q => 
    filterDifficulty === 'all' || q.difficulty === filterDifficulty
  );

  const TabPanel = ({ children, value, index }: any) => (
    <div hidden={value !== index}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );

  return (
    <Box sx={{ maxWidth: 1200, margin: 'auto', p: 3 }}>
      {/* כותרת */}
      <Card sx={{ mb: 3, background: 'linear-gradient(135deg, #6a1b9a 0%, #4a148c 100%)', color: 'white' }}>
        <CardHeader
          title={
            <Typography variant="h4" sx={{ fontWeight: 'bold', textAlign: 'center' }}>
              ✏️ שאלות חיבור ותמצות
            </Typography>
          }
          subheader={
            <Typography variant="h6" sx={{ textAlign: 'center', opacity: 0.9 }}>
              בחן את יכולת הניתוח והביטוי שלך בשאלות פתוחות מעמיקות
            </Typography>
          }
        />
      </Card>

      {/* טאבים */}
      <Card>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs 
            value={selectedTab} 
            onChange={(_, newValue) => setSelectedTab(newValue)}
            variant="fullWidth"
          >
            <Tab icon={<EditIcon />} label="שאלות זמינות" />
            <Tab icon={<SaveIcon />} label="התשובות שלי" />
            <Tab icon={<GradeIcon />} label="הערכה עצמית" />
          </Tabs>
        </Box>

        {/* טאב שאלות זמינות */}
        <TabPanel value={selectedTab} index={0}>
          <Box display="flex" justifyContent="between" alignItems="center" mb={3}>
            <Typography variant="h6" color="primary">
              📝 בחר שאלה לכתיבה
            </Typography>
            
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>רמת קושי</InputLabel>
              <Select
                value={filterDifficulty}
                onChange={(e) => setFilterDifficulty(e.target.value)}
                label="רמת קושי"
              >
                <MenuItem value="all">הכל</MenuItem>
                <MenuItem value="easy">קל</MenuItem>
                <MenuItem value="medium">בינוני</MenuItem>
                <MenuItem value="hard">קשה</MenuItem>
                <MenuItem value="expert">מומחה</MenuItem>
              </Select>
            </FormControl>
          </Box>
          
          <Grid container spacing={3}>
            {filteredQuestions.map(question => {
              const savedAnswer = savedAnswers.find(a => a.questionId === question.id);
              const hasAnswer = !!savedAnswer;
              
              return (
                <Grid item xs={12} md={6} key={question.id}>
                  <Card 
                    variant="outlined"
                    sx={{ 
                      cursor: 'pointer',
                      border: `2px solid ${getDifficultyColor(question.difficulty)}20`,
                      '&:hover': { 
                        transform: 'translateY(-2px)',
                        boxShadow: 4,
                        transition: 'all 0.3s'
                      }
                    }}
                    onClick={() => openQuestion(question)}
                  >
                    <CardContent>
                      <Box display="flex" justifyContent="between" alignItems="start" mb={2}>
                        <Box display="flex" gap={1}>
                          <Chip 
                            label={getDifficultyLabel(question.difficulty)}
                            size="small"
                            sx={{ 
                              backgroundColor: getDifficultyColor(question.difficulty),
                              color: 'white'
                            }}
                          />
                          <Chip 
                            label={question.category}
                            size="small"
                            variant="outlined"
                          />
                          <Chip 
                            label={`${question.points} נק'`}
                            size="small"
                            color="primary"
                          />
                        </Box>
                        
                        {hasAnswer && (
                          <Avatar sx={{ bgcolor: '#4caf50', width: 24, height: 24 }}>
                            <CheckIcon sx={{ fontSize: 16 }} />
                          </Avatar>
                        )}
                      </Box>
                      
                      <Typography variant="h6" gutterBottom>
                        {question.question}
                      </Typography>
                      
                      <Box display="flex" alignItems="center" gap={2} mb={2}>
                        <Box display="flex" alignItems="center" gap={1}>
                          <TimerIcon fontSize="small" color="action" />
                          <Typography variant="caption" color="text.secondary">
                            זמן משוער: {question.timeEstimate} דק'
                          </Typography>
                        </Box>
                        
                        <Box display="flex" alignItems="center" gap={1}>
                          <TipIcon fontSize="small" color="action" />
                          <Typography variant="caption" color="text.secondary">
                            {question.tips.length} טיפים
                          </Typography>
                        </Box>
                      </Box>
                      
                      {hasAnswer && (
                        <Alert severity="success" sx={{ mt: 2 }}>
                          <Typography variant="body2">
                            יש לך תשובה שמורה לשאלה זו - לחץ לעריכה
                          </Typography>
                        </Alert>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        </TabPanel>

        {/* טאב התשובות שלי */}
        <TabPanel value={selectedTab} index={1}>
          <Typography variant="h6" gutterBottom color="primary">
            💾 התשובות השמורות שלך
          </Typography>
          
          {savedAnswers.length === 0 ? (
            <Paper elevation={1} sx={{ p: 4, textAlign: 'center' }}>
              <EditIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                עדיין לא כתבת תשובות
              </Typography>
              <Typography variant="body2" color="text.secondary">
                התחל עם השאלה הראשונה שלך בטאב "שאלות זמינות"
              </Typography>
            </Paper>
          ) : (
            <Grid container spacing={3}>
              {savedAnswers.map(answer => {
                const question = essayQuestions.find(q => q.id === answer.questionId);
                if (!question) return null;
                
                return (
                  <Grid item xs={12} key={answer.questionId}>
                    <Accordion>
                      <AccordionSummary expandIcon={<ExpandIcon />}>
                        <Box display="flex" justifyContent="between" alignItems="center" width="100%">
                          <Box>
                            <Typography variant="h6">
                              {question.question}
                            </Typography>
                            <Box display="flex" gap={1} mt={1}>
                              <Chip 
                                label={getDifficultyLabel(question.difficulty)}
                                size="small"
                                sx={{ 
                                  backgroundColor: getDifficultyColor(question.difficulty),
                                  color: 'white'
                                }}
                              />
                              <Chip 
                                label={`${answer.timeSpent} דק'`}
                                size="small"
                                color="info"
                              />
                            </Box>
                          </Box>
                          
                          <Typography variant="caption" color="text.secondary">
                            נשמר: {new Intl.DateTimeFormat('he-IL', {
                              day: 'numeric',
                              month: 'short',
                              hour: '2-digit',
                              minute: '2-digit'
                            }).format(answer.savedAt)}
                          </Typography>
                        </Box>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Typography variant="body1" component="pre" sx={{ whiteSpace: 'pre-wrap' }}>
                          {answer.answer}
                        </Typography>
                        
                        <Box mt={2}>
                          <Button
                            variant="outlined"
                            startIcon={<EditIcon />}
                            onClick={() => openQuestion(question)}
                          >
                            ערוך תשובה
                          </Button>
                        </Box>
                      </AccordionDetails>
                    </Accordion>
                  </Grid>
                );
              })}
            </Grid>
          )}
        </TabPanel>

        {/* טאב הערכה עצמית */}
        <TabPanel value={selectedTab} index={2}>
          <Typography variant="h6" gutterBottom color="primary">
            📊 הערכה עצמית של התשובות
          </Typography>
          
          <Alert severity="info" sx={{ mb: 3 }}>
            <Typography variant="body2">
              השווה את התשובות שלך לתשובות לדוגמה וציינים לעצמך בהתאם לקריטריונים
            </Typography>
          </Alert>
          
          {savedAnswers.length === 0 ? (
            <Paper elevation={1} sx={{ p: 4, textAlign: 'center' }}>
              <GradeIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                אין תשובות להערכה
              </Typography>
              <Typography variant="body2" color="text.secondary">
                כתוב תשובות לשאלות כדי להעריך את עצמך
              </Typography>
            </Paper>
          ) : (
            <Grid container spacing={3}>
              {savedAnswers.map(answer => {
                const question = essayQuestions.find(q => q.id === answer.questionId);
                if (!question) return null;
                
                return (
                  <Grid item xs={12} key={answer.questionId}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography variant="h6" gutterBottom>
                          {question.question}
                        </Typography>
                        
                        <Accordion>
                          <AccordionSummary expandIcon={<ExpandIcon />}>
                            <Typography variant="subtitle1">
                              התשובה שלך
                            </Typography>
                          </AccordionSummary>
                          <AccordionDetails>
                            <Typography variant="body2" component="pre" sx={{ whiteSpace: 'pre-wrap' }}>
                              {answer.answer}
                            </Typography>
                          </AccordionDetails>
                        </Accordion>
                        
                        <Accordion>
                          <AccordionSummary expandIcon={<ExpandIcon />}>
                            <Typography variant="subtitle1" color="primary">
                              <ExampleIcon sx={{ mr: 1 }} />
                              תשובה לדוגמה
                            </Typography>
                          </AccordionSummary>
                          <AccordionDetails>
                            <Typography variant="body2" component="pre" sx={{ whiteSpace: 'pre-wrap' }}>
                              {question.exampleAnswer}
                            </Typography>
                          </AccordionDetails>
                        </Accordion>
                        
                        <Accordion>
                          <AccordionSummary expandIcon={<ExpandIcon />}>
                            <Typography variant="subtitle1">
                              קריטריוני הערכה
                            </Typography>
                          </AccordionSummary>
                          <AccordionDetails>
                            <List>
                              {question.gradingCriteria.map((criterion, index) => (
                                <ListItem key={index}>
                                  <ListItemIcon>
                                    <StarIcon color="warning" />
                                  </ListItemIcon>
                                  <ListItemText
                                    primary={`${criterion.aspect} (${criterion.maxPoints} נק')`}
                                    secondary={
                                      <Box>
                                        <Typography variant="body2" gutterBottom>
                                          {criterion.description}
                                        </Typography>
                                        <Typography variant="caption">
                                          מילות מפתח: {criterion.keywords.join(', ')}
                                        </Typography>
                                      </Box>
                                    }
                                  />
                                </ListItem>
                              ))}
                            </List>
                          </AccordionDetails>
                        </Accordion>
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>
          )}
        </TabPanel>
      </Card>

      {/* דיאלוג כתיבת תשובה */}
      <Dialog 
        open={!!selectedQuestion} 
        onClose={() => setSelectedQuestion(null)}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: { height: '90vh' }
        }}
      >
        {selectedQuestion && (
          <>
            <DialogTitle>
              <Box display="flex" justifyContent="between" alignItems="center">
                <Box>
                  <Typography variant="h6">
                    {selectedQuestion.question}
                  </Typography>
                  <Box display="flex" gap={1} mt={1}>
                    <Chip 
                      label={getDifficultyLabel(selectedQuestion.difficulty)}
                      size="small"
                      sx={{ 
                        backgroundColor: getDifficultyColor(selectedQuestion.difficulty),
                        color: 'white'
                      }}
                    />
                    <Chip 
                      label={selectedQuestion.category}
                      size="small"
                      variant="outlined"
                    />
                    <Chip 
                      label={`${selectedQuestion.points} נק'`}
                      size="small"
                      color="primary"
                    />
                  </Box>
                </Box>
                
                <Box display="flex" alignItems="center" gap={2}>
                  <Box display="flex" alignItems="center" gap={1}>
                    <TimerIcon fontSize="small" />
                    <Typography variant="body2">
                      {timeSpent} / {selectedQuestion.timeEstimate} דק'
                    </Typography>
                  </Box>
                  <IconButton onClick={() => setSelectedQuestion(null)}>
                    <CloseIcon />
                  </IconButton>
                </Box>
              </Box>
            </DialogTitle>
            
            <DialogContent>
              <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                {/* טיפים */}
                <Accordion sx={{ mb: 2 }}>
                  <AccordionSummary expandIcon={<ExpandIcon />}>
                    <Typography variant="subtitle1">
                      <TipIcon sx={{ mr: 1 }} />
                      טיפים לכתיבה
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <List dense>
                      {selectedQuestion.tips.map((tip, index) => (
                        <ListItem key={index}>
                          <ListItemIcon>
                            <TipIcon color="primary" fontSize="small" />
                          </ListItemIcon>
                          <ListItemText primary={tip} />
                        </ListItem>
                      ))}
                    </List>
                  </AccordionDetails>
                </Accordion>
                
                {/* אזור כתיבה */}
                <TextField
                  multiline
                  fullWidth
                  placeholder="התחל לכתוב את התשובה שלך כאן..."
                  value={currentAnswer}
                  onChange={(e) => setCurrentAnswer(e.target.value)}
                  variant="outlined"
                  sx={{ 
                    flex: 1,
                    '& .MuiInputBase-root': {
                      height: '100%',
                      alignItems: 'flex-start'
                    },
                    '& .MuiInputBase-input': {
                      height: '100% !important',
                      overflow: 'auto !important'
                    }
                  }}
                />
                
                <Box mt={2}>
                  <Typography variant="caption" color="text.secondary">
                    מילים: {currentAnswer.split(' ').filter(word => word.length > 0).length} | 
                    תווים: {currentAnswer.length}
                    {autoSave && ' | שמירה אוטומטית פעילה'}
                  </Typography>
                </Box>
              </Box>
            </DialogContent>
            
            <DialogActions>
              <Button onClick={() => setSelectedQuestion(null)}>
                סגור
              </Button>
              <Button 
                variant="contained" 
                startIcon={<SaveIcon />}
                onClick={handleSaveAnswer}
                disabled={!currentAnswer.trim()}
              >
                שמור תשובה
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
};

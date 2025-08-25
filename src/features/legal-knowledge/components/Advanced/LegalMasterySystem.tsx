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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  FormControl,
  FormControlLabel,
  RadioGroup,
  Radio,
  Alert,
  LinearProgress,
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
  Rating,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Tooltip
} from '@mui/material';
import { 
  Close as CloseIcon,
  CheckCircle as CorrectIcon,
  Cancel as WrongIcon,
  Quiz as QuizIcon,
  Gavel as JudgeIcon,
  AccountBalance as CourtIcon,
  MenuBook as BookIcon,
  Public as GlobalIcon,
  Psychology as PhilosophyIcon,
  AdminPanelSettings as AdminIcon,
  Balance as BalanceIcon,
  Explore as ExploreIcon,
  Timeline as TimelineIcon,
  School as LearnIcon,
  Star as StarIcon,
  EmojiEvents as TrophyIcon,
  Lightbulb as TipIcon,
  ExpandMore as ExpandIcon,
  PlayArrow as PlayIcon,
  Layers as HierarchyIcon,
  Search as AnalysisIcon,
  Language as InternationalIcon,
  Fingerprint as CustomIcon,
  Foundation as PrinciplesIcon,
  Engineering as ToolsIcon,
  Handshake as NegotiationIcon
} from '@mui/icons-material';

interface LegalModule {
  id: string;
  title: string;
  icon: React.ReactElement;
  color: string;
  description: string;
  objectives: string[];
  exercises: Exercise[];
  difficulty: 'intermediate' | 'advanced' | 'expert';
  estimatedTime: number;
  prerequisite?: string;
}

interface Exercise {
  id: string;
  type: 'hierarchy-game' | 'interpretation-choice' | 'law-vs-custom' | 'principle-analysis' | 'case-analysis' | 'court-simulation';
  title: string;
  scenario: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  feedback: ExerciseFeedback;
  relatedCases?: string[];
  legalSources: string[];
  difficulty: number; // 1-5
}

interface ExerciseFeedback {
  correctResponse: string;
  incorrectResponse: string;
  additionalInfo: string;
  practicalExample: string;
  icons: string[];
}

interface UserProgress {
  moduleId: string;
  completed: boolean;
  score: number;
  exercisesCompleted: number;
  timeSpent: number;
  lastAccessed: Date;
}

const legalModules: LegalModule[] = [
  {
    id: 'hierarchy-influence',
    title: 'היררכיה והשפעות ביניים',
    icon: <HierarchyIcon />,
    color: '#d32f2f',
    description: 'לימוד מתי חוק יסוד גובר על חוק רגיל, מתי תקנות בטלות מול חקיקה, ואיך פסיקה משפיעה על הערכאות הנמוכות',
    objectives: [
      'הבנת היררכיה נורמטיבית',
      'זיהוי סכסוכי סמכויות',
      'ניתוח השפעות פסיקה',
      'יישום עקרונות עליונות'
    ],
    difficulty: 'intermediate',
    estimatedTime: 45,
    exercises: [
      {
        id: 'hierarchy_game_1',
        type: 'hierarchy-game',
        title: 'משחק היררכיה - סכסוך סמכויות',
        scenario: 'שר הבריאות הוציא תקנה המתירה דבר שחוק הבריאות אוסר במפורש. אזרח עותר לבג"ץ נגד התקנה.',
        question: 'מהי ההיררכיה הנכונה במקרה זה?',
        options: [
          'התקנה גוברת כי השר מומחה בתחום',
          'החוק גובר על התקנה - התקנה בטלה',
          'יש לבדוק את כוונת המחוקק',
          'בג"ץ יכריע לפי שיקול דעתו'
        ],
        correctAnswer: 1,
        explanation: 'חוק ראשי גובר תמיד על תקנות. תקנה אינה יכולה לסתור חוק - עקרון האולטרא ויירס.',
        feedback: {
          correctResponse: '⚖️ נכון! החוק הראשי עליון על התקנה',
          incorrectResponse: '❌ לא נכון. תקנה כפופה לחוק ראשי',
          additionalInfo: 'עקרון האולטרא ויירס קובע שרשות לא יכולה לחרוג מסמכותה החוקית',
          practicalExample: 'בג"ץ 5364/94 ולף נגד שר הבריאות - פסילת תקנה סותרת',
          icons: ['⚖️', '📜', '🏛️']
        },
        legalSources: ['עקרון חוקיות המנהל', 'בג"ץ פסיקות שונות'],
        difficulty: 3
      },
      {
        id: 'hierarchy_game_2',
        type: 'hierarchy-game',
        title: 'חוק יסוד מול חוק רגיל',
        scenario: 'הכנסת חוקקה חוק המגביל זכות התנועה, אך אזרחים טוענים שהוא סותר חוק יסוד: כבוד האדם וחירותו.',
        question: 'כיצד יפסוק בג"ץ?',
        options: [
          'החוק החדש גובר כי הכנסת ריבונית',
          'יבחן את החוק במבחן הפגיעה המידתית',
          'יפסול את החוק מיידית',
          'לא יתערב בחקיקה'
        ],
        correctAnswer: 1,
        explanation: 'בג"ץ יבחן האם החוק עומד במבחן הפגיעה המידתית - מטרה ראויה, קשר רציונלי, פגיעה מינימלית ואיזון כולל.',
        feedback: {
          correctResponse: '🎯 מצוין! מבחן הפגיעה המידתית הוא הכלי הנכון',
          incorrectResponse: '❌ לא מדויק. יש לבחון לפי מבחן מובנה',
          additionalInfo: 'המהפכה החוקתית של שנות ה-90 הקנתה לבג"ץ סמכות ביקורת חוקתית',
          practicalExample: 'בג"ץ 6821/93 בנק מזרחי - קביעת מבחן הפגיעה המידתית',
          icons: ['⚖️', '✨', '🏛️']
        },
        legalSources: ['חוק יסוד: כבוד האדם וחירותו', 'פס"ד בנק מזרחי'],
        difficulty: 4
      }
    ]
  },
  {
    id: 'advanced-interpretation',
    title: 'פרשנויות מתקדמות',
    icon: <ExploreIcon />,
    color: '#388e3c',
    description: 'הבנת ההבדל בין פרשנות לשונית, תכליתית, מצמצמת/מרחיבה ודינמית',
    objectives: [
      'זיהוי סוגי פרשנות שונים',
      'יישום פרשנות מתאימה למקרה',
      'הבנת השפעת הפרשנות על התוצאה',
      'ניתוח פסיקה מבחינת הפרשנות'
    ],
    difficulty: 'advanced',
    estimatedTime: 35,
    exercises: [
      {
        id: 'interpretation_1',
        type: 'interpretation-choice',
        title: 'בחירת שיטת פרשנות',
        scenario: 'חוק משנת 1960 קובע "כלי תחבורה ציבורית". השאלה היא האם זה כולל גם רכבת תחתית שנבנתה ב-2020.',
        question: 'איזה סוג פרשנות מתאים?',
        options: [
          'פרשנות לשונית - רק לפי הכתוב',
          'פרשנות תכליתית - לפי מטרת החוק',
          'פרשנות דינמית - התאמה למציאות מודרנית',
          'פרשנות מצמצמת - הגבלה למקרים ברורים'
        ],
        correctAnswer: 2,
        explanation: 'פרשנות דינמית מתאימה כי החוק ישן והמציאות השתנתה. צריך להתאים את החוק לטכנולוגיות חדשות.',
        feedback: {
          correctResponse: '🔮 נכון! פרשנות דינמית מתאימה למציאות משתנה',
          incorrectResponse: '❌ לא מתאים. חוק ישן זקוק להתאמה',
          additionalInfo: 'פרשנות דינמית מאפשרת למשפט להישאר רלוונטי',
          practicalExample: 'הרחבת המושג "כתב" לכלול מסמכים דיגיטליים',
          icons: ['🔍', '🔮', '⚡']
        },
        legalSources: ['תורת הפרשנות המשפטית'],
        difficulty: 4
      }
    ]
  },
  {
    id: 'informal-sources',
    title: 'מקורות לא פורמליים',
    icon: <CustomIcon />,
    color: '#ff9800',
    description: 'הכרת מנהגים עסקיים ומשפטיים, משפט עברי והשפעות משפט בינלאומי',
    objectives: [
      'הבנת תפקיד המנהגים במשפט',
      'זיהוי השפעות משפט בינלאומי',
      'הכרת מקום המשפט העברי',
      'ניתוח קונפליקטים בין מקורות'
    ],
    difficulty: 'advanced',
    estimatedTime: 40,
    exercises: [
      {
        id: 'law_vs_custom_1',
        type: 'law-vs-custom',
        title: 'חוק נגד מנהג',
        scenario: 'בשוק הכרמל יש מנהג עתיק שסוחרים סוגרים בשעה 14:00 בימי שישי. עירית תל אביב חוקקה תקנה החייבת פתיחה עד 16:00.',
        question: 'מה גובר במקרה זה?',
        options: [
          'המנהג העתיק גובר',
          'התקנה החדשה גוברת',
          'צריך להגיע לפשרה',
          'השוק יחליט בעצמו'
        ],
        correctAnswer: 1,
        explanation: 'חקיקה פורמלית (גם תקנה חוקית) גוברת על מנהג. המנהג יכול להשפיע על הפרשנות אך לא לבטל את החוק.',
        feedback: {
          correctResponse: '📜 נכון! חקיקה פורמלית גוברת על מנהג',
          incorrectResponse: '❌ לא נכון. מנהג כפוף לחקיקה',
          additionalInfo: 'מנהג יכול להשפיע על פרשנות או על שינוי עתידי של החוק',
          practicalExample: 'מנהג מסחרי בתשלום עמלות שונה לפי חקיקה חדשה',
          icons: ['📜', '✨', '⚖️']
        },
        legalSources: ['עקרונות היררכיה משפטית'],
        difficulty: 3
      }
    ]
  },
  {
    id: 'fundamental-principles',
    title: 'עקרונות יסוד משפטיים',
    icon: <PrinciplesIcon />,
    color: '#7b1fa2',
    description: 'הבנת עקרונות כמו סבירות, מידתיות, פסקת ההגבלה, שוויון, משפט טבעי מול פוזיטיביזם',
    objectives: [
      'זיהוי עקרונות משפטיים במקרים מורכבים',
      'יישום מבחני סבירות ומידתיות',
      'הבנת המתח בין משפט טבעי לפוזיטיביזם',
      'ניתוח השפעת עקרונות על פסיקה'
    ],
    difficulty: 'expert',
    estimatedTime: 50,
    exercises: [
      {
        id: 'principles_1',
        type: 'principle-analysis',
        title: 'זיהוי עקרון משפטי',
        scenario: 'עירייה דחתה בקשת רישיון בנייה מטעמים שאינם קשורים לבנייה עצמה אלא לדעות פוליטיות של המבקש.',
        question: 'איזה עקרון משפטי הופר?',
        options: [
          'עקרון השוויון',
          'עקרון הסבירות',
          'עקרון המידתיות',
          'כל התשובות נכונות'
        ],
        correctAnswer: 3,
        explanation: 'הופרו מספר עקרונות: שוויון (אפליה), סבירות (שיקולים זרים), ומידתיות (אמצעי קיצוני).',
        feedback: {
          correctResponse: '🎯 מצוין! זיהית את כל העקרונות הרלוונטיים',
          incorrectResponse: '❌ חסר. יש כאן הפרה של מספר עקרונות',
          additionalInfo: 'החלטות מנהליות חייבות להיות מבוססות על שיקולים רלוונטיים בלבד',
          practicalExample: 'בג"ץ 389/80 רסלר - קביעת מבחן הסבירות הקיצונית',
          icons: ['⚖️', '🎯', '🏛️']
        },
        legalSources: ['עקרונות משפט מנהלי', 'פסיקת בג"ץ'],
        difficulty: 4
      }
    ]
  },
  {
    id: 'practical-tools',
    title: 'כלים פרקטיים לניתוח משפטי',
    icon: <ToolsIcon />,
    color: '#00bcd4',
    description: 'לימוד ניתוח התנגשויות, קודיפיקציה ותורת השפיטה האקטיביסטית',
    objectives: [
      'ניתוח סכסוכים בין חוקים ותקנות',
      'הבנת השפיטה האקטיביסטית',
      'יישום כלי ניתוח משפטי',
      'פיתוח חשיבה ביקורתית'
    ],
    difficulty: 'expert',
    estimatedTime: 60,
    exercises: [
      {
        id: 'complex_analysis_1',
        type: 'case-analysis',
        title: 'ניתוח מקרה מורכב',
        scenario: 'חוק מ-1995 אוסר על פרסום מידע רפואי. תקנה מ-2020 מחייבת פרסום נתוני קורונה. פסיקת בג"ץ מ-2018 הגנה על פרטיות. מנהג בינלאומי מחייב שקיפות.',
        question: 'כיצד יש לפתור את הסכסוך?',
        options: [
          'החוק מ-1995 גובר על הכל',
          'התקנה החדשה ביטלה את החוק הישן',
          'יש לאזן בין הערכים לפי נסיבות',
          'המנהג הבינלאומי קובע'
        ],
        correctAnswer: 2,
        explanation: 'זהו מקרה מורכב הדורש איזון בין ערכים: פרטיות מול בריאות הציבור. יש להחיל מבחן מידתיות.',
        feedback: {
          correctResponse: '🧩 מעולה! זיהית את הצורך באיזון מורכב',
          incorrectResponse: '❌ לא מספיק. זה מקרה של איזון ערכים',
          additionalInfo: 'במקרים מורכבים בג"ץ מיישם איזון רב-שכבתי',
          practicalExample: 'איזון בין חופש עיתונות לפרטיות במשפט הישראלי',
          icons: ['🧩', '⚖️', '🔍']
        },
        legalSources: ['איזון ערכים במשפט', 'פסיקת בג"ץ מורכבת'],
        difficulty: 5
      }
    ]
  },
  {
    id: 'international-comparative',
    title: 'היבטים בינלאומיים והשוואתיים',
    icon: <InternationalIcon />,
    color: '#795548',
    description: 'הבנת משפט בינלאומי מול פנימי, חוזים בינלאומיים, השפעת מנהגים זרים',
    objectives: [
      'הבנת יחסים בין משפט מקומי לבינלאומי',
      'ניתוח השפעות משפט זר',
      'זיהוי אמנות מחייבות',
      'יישום משפט השוואתי'
    ],
    difficulty: 'expert',
    estimatedTime: 45,
    exercises: [
      {
        id: 'international_1',
        type: 'case-analysis',
        title: 'חוק פנימי מול אמנה בינלאומית',
        scenario: 'ישראל חתמה על אמנה בינלאומית להגנת הסביבה, אך חוק ישראלי מאפשר פעילות המזהמת את הסביבה.',
        question: 'איך יש לפתור את הסתירה?',
        options: [
          'החוק הישראלי גובר תמיד',
          'האמנה הבינלאומית גוברת',
          'תלוי אם האמנה אומצה כחוק פנימי',
          'בג"ץ יכריע לפי שיקול דעתו'
        ],
        correctAnswer: 2,
        explanation: 'אמנה בינלאומית מחייבת רק אם אומצה כחוק פנימי או קיבלה תוקף חוקי אחר.',
        feedback: {
          correctResponse: '🌐 נכון! האימוץ הפנימי הוא המפתח',
          incorrectResponse: '❌ לא מדויק. יש להבחין בין זכות בינלאומית לפנימית',
          additionalInfo: 'ישראל נוקטת בגישה דואליסטית לזכות בינלאומית',
          practicalExample: 'אימוץ אמנת זכויות הילד כחלק מהחקיקה הישראלית',
          icons: ['🌐', '📜', '⚖️']
        },
        legalSources: ['משפט בינלאומי', 'דוקטרינה דואליסטית'],
        difficulty: 5
      }
    ]
  },
  {
    id: 'practical-jurisprudence',
    title: 'פסיקה ותרגול יישומי',
    icon: <NegotiationIcon />,
    color: '#e91e63',
    description: 'חיזוק למידה דרך ניתוח פסיקה, סיטואציות קונקרטיות וסימולציות בית משפט',
    objectives: [
      'ניתוח פסיקה מורכבת',
      'קבלת החלטות שיפוטיות',
      'יישום עקרונות בפרקטיקה',
      'פיתוח חשיבה משפטית'
    ],
    difficulty: 'expert',
    estimatedTime: 70,
    exercises: [
      {
        id: 'court_simulation_1',
        type: 'court-simulation',
        title: 'סימולציית בית משפט',
        scenario: 'אתה השופט: עתירה נגד החלטת שר החינוך לסגור בית ספר ללא הליך. העותרים טוענים לפגיעה בזכות לחינוך וחוסר הליך הוגן.',
        question: 'מה תחליט כשופט?',
        options: [
          'אדחה העתירה - השר מוסמך להחליט',
          'אקבל העתירה - חוסר הליך הוגן',
          'אחזיר לשר לדיון מחדש עם הליך תקין',
          'אפנה לועדת חינוך של הכנסת'
        ],
        correctAnswer: 2,
        explanation: 'הפתרון הנכון הוא להחזיר לשר לדיון מחדש עם הליך הוגן. זה מכבד את סמכות השר אך מבטיח הליך תקין.',
        feedback: {
          correctResponse: '⚖️ החלטה שיפוטית מעולה! איזנת בין הערכים',
          incorrectResponse: '❌ לא מאוזן מספיק. יש לכבד גם סמכות וגם הליך',
          additionalInfo: 'עקרון ההליך ההוגן הוא יסוד במשפט המנהלי',
          practicalExample: 'בג"ץ 4769/95 מנחם נגד שר התחבורה - חובת הליך הוגן',
          icons: ['⚖️', '🏛️', '📚']
        },
        legalSources: ['עקרון ההליך ההוגן', 'פסיקת בג"ץ מנהלי'],
        difficulty: 5
      }
    ]
  }
];

interface LegalMasterySystemProps {
  onModuleComplete: (moduleId: string, score: number) => void;
}

export const LegalMasterySystem: React.FC<LegalMasterySystemProps> = ({
  onModuleComplete
}) => {
  const [selectedModule, setSelectedModule] = useState<LegalModule | null>(null);
  const [currentExercise, setCurrentExercise] = useState<Exercise | null>(null);
  const [exerciseIndex, setExerciseIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [moduleProgress, setModuleProgress] = useState<Map<string, UserProgress>>(new Map());
  const [selectedTab, setSelectedTab] = useState(0);

  // התחלת מודול
  const startModule = (module: LegalModule) => {
    setSelectedModule(module);
    setCurrentExercise(module.exercises[0]);
    setExerciseIndex(0);
    setUserAnswer(null);
    setShowFeedback(false);
  };

  // התחלת תרגיל
  const startExercise = (exercise: Exercise) => {
    setCurrentExercise(exercise);
    setUserAnswer(null);
    setShowFeedback(false);
  };

  // בדיקת תשובה
  const checkAnswer = () => {
    if (userAnswer === null || !currentExercise) return;
    setShowFeedback(true);
  };

  // מעבר לתרגיל הבא
  const nextExercise = () => {
    if (!selectedModule) return;
    
    if (exerciseIndex < selectedModule.exercises.length - 1) {
      const nextIndex = exerciseIndex + 1;
      setExerciseIndex(nextIndex);
      setCurrentExercise(selectedModule.exercises[nextIndex]);
      setUserAnswer(null);
      setShowFeedback(false);
    } else {
      // סיום המודול
      completeModule();
    }
  };

  // סיום מודול
  const completeModule = () => {
    if (!selectedModule) return;
    
    const score = 85; // חישוב ציון בהתאם לתשובות
    onModuleComplete(selectedModule.id, score);
    
    // עדכון progress
    const progress: UserProgress = {
      moduleId: selectedModule.id,
      completed: true,
      score,
      exercisesCompleted: selectedModule.exercises.length,
      timeSpent: selectedModule.estimatedTime,
      lastAccessed: new Date()
    };
    
    const newProgress = new Map(moduleProgress);
    newProgress.set(selectedModule.id, progress);
    setModuleProgress(newProgress);
    
    setSelectedModule(null);
    setCurrentExercise(null);
  };

  // קבלת צבע לפי קושי
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'intermediate': return '#4caf50';
      case 'advanced': return '#ff9800';
      case 'expert': return '#f44336';
      default: return '#9e9e9e';
    }
  };

  const getDifficultyLabel = (difficulty: string) => {
    switch (difficulty) {
      case 'intermediate': return 'בינוני';
      case 'advanced': return 'מתקדם';
      case 'expert': return 'מומחה';
      default: return 'לא ידוע';
    }
  };

  const TabPanel = ({ children, value, index }: any) => (
    <div hidden={value !== index}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );

  // אם נבחר מודול ותרגיל
  if (selectedModule && currentExercise) {
    const isCorrect = userAnswer === currentExercise.correctAnswer;
    const progress = ((exerciseIndex + 1) / selectedModule.exercises.length) * 100;

    return (
      <Box sx={{ maxWidth: 1000, margin: 'auto', p: 3 }}>
        <Card>
          <CardHeader
            title={
              <Box display="flex" justifyContent="between" alignItems="center">
                <Typography variant="h5">
                  {selectedModule.icon} {selectedModule.title}
                </Typography>
                <Box display="flex" alignItems="center" gap={2}>
                  <Chip 
                    label={`${exerciseIndex + 1}/${selectedModule.exercises.length}`}
                    variant="outlined"
                  />
                  <IconButton onClick={() => setSelectedModule(null)}>
                    <CloseIcon />
                  </IconButton>
                </Box>
              </Box>
            }
          />
          
          <LinearProgress variant="determinate" value={progress} sx={{ mb: 2 }} />
          
          <CardContent>
            {/* מידע על התרגיל */}
            <Box display="flex" gap={1} mb={3}>
              <Chip 
                label={currentExercise.title}
                color="primary"
              />
              <Chip 
                label={`קושי: ${currentExercise.difficulty}/5`}
                sx={{ backgroundColor: getDifficultyColor(selectedModule.difficulty), color: 'white' }}
              />
            </Box>
            
            {/* תרחיש */}
            <Paper elevation={1} sx={{ p: 3, mb: 3, bgcolor: '#f8f9fa' }}>
              <Typography variant="h6" gutterBottom color="primary">
                📋 תרחיש:
              </Typography>
              <Typography variant="body1">
                {currentExercise.scenario}
              </Typography>
            </Paper>
            
            {/* שאלה */}
            <Typography variant="h6" gutterBottom>
              {currentExercise.question}
            </Typography>
            
            {/* אפשרויות */}
            <FormControl component="fieldset" fullWidth sx={{ mt: 2 }}>
              <RadioGroup
                value={userAnswer}
                onChange={(e) => setUserAnswer(parseInt(e.target.value))}
              >
                {currentExercise.options.map((option, index) => (
                  <FormControlLabel
                    key={index}
                    value={index}
                    control={<Radio />}
                    label={option}
                    disabled={showFeedback}
                    sx={{ 
                      mb: 1,
                      '& .MuiFormControlLabel-label': {
                        color: showFeedback ? 
                          (index === currentExercise.correctAnswer ? 'success.main' :
                           index === userAnswer ? 'error.main' : 'text.primary') :
                          'text.primary'
                      }
                    }}
                  />
                ))}
              </RadioGroup>
            </FormControl>
            
            {/* משוב */}
            {showFeedback && (
              <Alert 
                severity={isCorrect ? 'success' : 'error'} 
                sx={{ mt: 3 }}
              >
                <Typography variant="body1" gutterBottom>
                  {isCorrect ? 
                    currentExercise.feedback.correctResponse : 
                    currentExercise.feedback.incorrectResponse
                  }
                </Typography>
                
                <Typography variant="body2" paragraph>
                  <strong>הסבר:</strong> {currentExercise.explanation}
                </Typography>
                
                <Typography variant="body2" paragraph>
                  <strong>מידע נוסף:</strong> {currentExercise.feedback.additionalInfo}
                </Typography>
                
                <Typography variant="body2" paragraph>
                  <strong>דוגמה מעשית:</strong> {currentExercise.feedback.practicalExample}
                </Typography>
                
                <Box display="flex" gap={1} mt={2}>
                  {currentExercise.feedback.icons.map((icon, index) => (
                    <Typography key={index} variant="h6" component="span">
                      {icon}
                    </Typography>
                  ))}
                </Box>
              </Alert>
            )}
            
            {/* כפתורי פעולה */}
            <Box display="flex" justifyContent="between" mt={4}>
              <Button
                onClick={() => setSelectedModule(null)}
                variant="outlined"
              >
                חזרה למודולים
              </Button>
              
              <Box display="flex" gap={2}>
                {!showFeedback ? (
                  <Button
                    variant="contained"
                    onClick={checkAnswer}
                    disabled={userAnswer === null}
                  >
                    בדוק תשובה
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    onClick={nextExercise}
                    color="success"
                  >
                    {exerciseIndex < selectedModule.exercises.length - 1 ? 'הבא' : 'סיים מודול'}
                  </Button>
                )}
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 1400, margin: 'auto', p: 3 }}>
      {/* כותרת */}
      <Card sx={{ mb: 3, background: 'linear-gradient(135deg, #6a1b9a 0%, #4a148c 100%)', color: 'white' }}>
        <CardHeader
          title={
            <Typography variant="h4" sx={{ fontWeight: 'bold', textAlign: 'center' }}>
              🎓 מערכת מאסטרי משפטי
            </Typography>
          }
          subheader={
            <Typography variant="h6" sx={{ textAlign: 'center', opacity: 0.9 }}>
              לימוד מתקדם ותרגול פרקטי של מקורות המשפט הישראלי
            </Typography>
          }
        />
      </Card>

      <Tabs value={selectedTab} onChange={(_, newValue) => setSelectedTab(newValue)}>
        <Tab label="מודולי למידה" />
        <Tab label="ההתקדמות שלי" />
      </Tabs>

      {/* טאב מודולי למידה */}
      <TabPanel value={selectedTab} index={0}>
        <Typography variant="h6" gutterBottom color="primary">
          🎯 בחר מודול למידה
        </Typography>
        
        <Grid container spacing={3}>
          {legalModules.map(module => {
            const progress = moduleProgress.get(module.id);
            const isCompleted = progress?.completed || false;
            
            return (
              <Grid item xs={12} md={6} lg={4} key={module.id}>
                <Card 
                  elevation={3}
                  sx={{ 
                    height: '100%',
                    border: `2px solid ${module.color}20`,
                    cursor: 'pointer',
                    '&:hover': { 
                      transform: 'translateY(-4px)',
                      boxShadow: 6,
                      transition: 'all 0.3s ease'
                    }
                  }}
                  onClick={() => startModule(module)}
                >
                  <CardContent>
                    <Box display="flex" alignItems="center" gap={2} mb={2}>
                      <Avatar sx={{ bgcolor: module.color, width: 56, height: 56 }}>
                        {module.icon}
                      </Avatar>
                      <Box flex={1}>
                        <Typography variant="h6" fontWeight="bold">
                          {module.title}
                        </Typography>
                        <Box display="flex" gap={1} mt={1}>
                          <Chip 
                            label={getDifficultyLabel(module.difficulty)}
                            size="small"
                            sx={{ 
                              backgroundColor: getDifficultyColor(module.difficulty),
                              color: 'white'
                            }}
                          />
                          <Chip 
                            label={`${module.estimatedTime} דק'`}
                            size="small"
                            variant="outlined"
                          />
                          {isCompleted && (
                            <Chip 
                              label="הושלם"
                              size="small"
                              color="success"
                              icon={<CorrectIcon />}
                            />
                          )}
                        </Box>
                      </Box>
                    </Box>
                    
                    <Typography variant="body2" color="text.secondary" paragraph>
                      {module.description}
                    </Typography>
                    
                    <Typography variant="subtitle2" gutterBottom>
                      יעדי למידה:
                    </Typography>
                    <List dense>
                      {module.objectives.slice(0, 2).map((objective, index) => (
                        <ListItem key={index} sx={{ pl: 0 }}>
                          <ListItemIcon sx={{ minWidth: 20 }}>
                            <StarIcon fontSize="small" color="primary" />
                          </ListItemIcon>
                          <ListItemText 
                            primary={objective}
                            primaryTypographyProps={{ variant: 'body2' }}
                          />
                        </ListItem>
                      ))}
                    </List>
                    
                    <Box display="flex" justifyContent="between" alignItems="center" mt={2}>
                      <Typography variant="caption" color="text.secondary">
                        {module.exercises.length} תרגילים
                      </Typography>
                      <Button 
                        variant="contained"
                        size="small"
                        startIcon={<PlayIcon />}
                        sx={{ backgroundColor: module.color }}
                      >
                        התחל
                      </Button>
                    </Box>
                    
                    {progress && (
                      <Box mt={2}>
                        <LinearProgress 
                          variant="determinate" 
                          value={(progress.exercisesCompleted / module.exercises.length) * 100}
                        />
                        <Typography variant="caption" color="text.secondary">
                          התקדמות: {progress.exercisesCompleted}/{module.exercises.length}
                        </Typography>
                      </Box>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      </TabPanel>

      {/* טאב התקדמות */}
      <TabPanel value={selectedTab} index={1}>
        <Typography variant="h6" gutterBottom color="primary">
          📊 ההתקדמות שלך
        </Typography>
        
        {moduleProgress.size === 0 ? (
          <Paper elevation={1} sx={{ p: 4, textAlign: 'center' }}>
            <LearnIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              עדיין לא התחלת מודולים
            </Typography>
            <Typography variant="body2" color="text.secondary">
              בחר מודול ראשון כדי להתחיל את המסע שלך!
            </Typography>
          </Paper>
        ) : (
          <Grid container spacing={3}>
            {Array.from(moduleProgress.entries()).map(([moduleId, progress]) => {
              const module = legalModules.find(m => m.id === moduleId);
              if (!module) return null;
              
              return (
                <Grid item xs={12} md={6} key={moduleId}>
                  <Card elevation={2}>
                    <CardContent>
                      <Box display="flex" alignItems="center" gap={2} mb={2}>
                        <Avatar sx={{ bgcolor: module.color }}>
                          {module.icon}
                        </Avatar>
                        <Box>
                          <Typography variant="h6">{module.title}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            הושלם: {new Intl.DateTimeFormat('he-IL').format(progress.lastAccessed)}
                          </Typography>
                        </Box>
                      </Box>
                      
                      <Box display="flex" justifyContent="between" mb={2}>
                        <Box textAlign="center">
                          <Typography variant="h4" color="primary">
                            {progress.score}%
                          </Typography>
                          <Typography variant="caption">ציון</Typography>
                        </Box>
                        <Box textAlign="center">
                          <Typography variant="h4" color="success.main">
                            {progress.exercisesCompleted}
                          </Typography>
                          <Typography variant="caption">תרגילים</Typography>
                        </Box>
                        <Box textAlign="center">
                          <Typography variant="h4" color="info.main">
                            {progress.timeSpent}
                          </Typography>
                          <Typography variant="caption">דקות</Typography>
                        </Box>
                      </Box>
                      
                      {progress.completed && (
                        <Chip 
                          label="מודול הושלם בהצלחה"
                          color="success"
                          icon={<TrophyIcon />}
                          sx={{ width: '100%' }}
                        />
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        )}
      </TabPanel>
    </Box>
  );
};

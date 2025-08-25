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
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Alert,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  LinearProgress,
  Avatar,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Tooltip,
  Rating
} from '@mui/material';
import { 
  ExpandMore as ExpandIcon,
  Close as CloseIcon,
  Gavel as JudgeIcon,
  AccountBalance as CourtIcon,
  MenuBook as BookIcon,
  Public as GlobalIcon,
  Psychology as PhilosophyIcon,
  AdminPanelSettings as AdminIcon,
  Balance as BalanceIcon,
  Explore as ExploreIcon,
  Timeline as TimelineIcon,
  Quiz as QuizIcon,
  School as LearnIcon,
  TrendingUp as TrendIcon,
  Group as GroupIcon,
  Security as SecurityIcon,
  Verified as VerifiedIcon,
  Warning as WarningIcon,
  CheckCircle as CheckIcon,
  Error as ErrorIcon,
  Info as InfoIcon
} from '@mui/icons-material';

interface AdvancedConcept {
  id: string;
  title: string;
  category: 'hierarchy' | 'philosophy' | 'administrative' | 'judicial' | 'interpretation' | 'international' | 'religious' | 'precedent' | 'integration';
  level: 'intermediate' | 'advanced' | 'expert';
  icon: string;
  color: string;
  description: string;
  keyPoints: string[];
  realCases: RealCase[];
  practicalScenarios: PracticalScenario[];
  complexities: string[];
  modernImplications: string[];
  relatedConcepts: string[];
}

interface RealCase {
  id: string;
  name: string;
  year: string;
  court: string;
  principle: string;
  outcome: string;
  significance: string;
  relevantLaw: string[];
}

interface PracticalScenario {
  id: string;
  title: string;
  situation: string;
  conflictingSources: ConflictingSource[];
  correctApproach: string;
  reasoning: string;
  difficulty: 'medium' | 'hard' | 'expert';
  practicalTips: string[];
}

interface ConflictingSource {
  source: string;
  position: string;
  strength: number; // 1-5
}

interface JudicialReviewType {
  type: string;
  description: string;
  examples: string[];
  limitations: string[];
  effectiveness: number;
}

const advancedConcepts: AdvancedConcept[] = [
  {
    id: 'normative-hierarchy',
    title: 'היררכיה נורמטיבית מתקדמת',
    category: 'hierarchy',
    level: 'advanced',
    icon: '🏗️',
    color: '#d32f2f',
    description: 'יחסי עליונות מורכבים בין מקורות משפט שונים ופתרון קונפליקטים נורמטיביים',
    keyPoints: [
      'חוקים רגילים מול חקיקת משנה - עקרון האולטרא ויירס',
      'פסיקה עיונית מול חקיקה ברורה',
      'עקרונות משפט טבעי מול חקיקה פוזיטיבית',
      'פסיקה מול מנהגים מקומיים מושרשים',
      'חוקי יסוד עם/בלי פסקת הגבלה'
    ],
    realCases: [
      {
        id: 'mizrahi-bank',
        name: 'בג"ץ 6821/93 בנק מזרחי',
        year: '1995',
        court: 'בג"ץ מורחב',
        principle: 'ביקורת חוקתיות',
        outcome: 'קביעת זכות הביקורת החוקתית',
        significance: 'יצירת המהפכה החוקתית',
        relevantLaw: ['חוק יסוד: כבוד האדם וחירותו', 'חוק הבנקאות']
      },
      {
        id: 'gal-knesset',
        name: 'בג"ץ 1466/07 גל נגד כנסת ישראל',
        year: '2012',
        court: 'בג"ץ מורחב',
        principle: 'גבולות הביקורת החוקתיות',
        outcome: 'קביעת מגבלות על כוח הביקורת',
        significance: 'איזון בין הפרדת רשויות לביקורת',
        relevantLaw: ['חוק יסוד: הכנסת', 'חוק המפלגות']
      }
    ],
    practicalScenarios: [
      {
        id: 'regulation-vs-law',
        title: 'תקנה סותרת חוק',
        situation: 'שר הבריאות הוציא תקנה המתירה דבר שחוק הבריאות אוסר במפורש',
        conflictingSources: [
          { source: 'חוק הבריאות הציבורית', position: 'אוסר', strength: 5 },
          { source: 'תקנת שר הבריאות', position: 'מתיר', strength: 2 }
        ],
        correctApproach: 'החוק גובר על התקנה',
        reasoning: 'תקנה אינה יכולה לסתור חוק ראשי - עקרון האולטרא ויירס',
        difficulty: 'medium',
        practicalTips: [
          'בדוק את מקור הסמכות לתקנה',
          'וודא שהתקנה בגבולות הסמכות שהוקנתה',
          'בחן אם יש פרשנות אחרת לחוק'
        ]
      },
      {
        id: 'precedent-vs-new-law',
        title: 'פסיקה מול חקיקה חדשה',
        situation: 'בג"ץ פסק שפעולה מסוימת חוקית, אך הכנסת חוקקה חוק האוסר אותה',
        conflictingSources: [
          { source: 'פסיקת בג"ץ', position: 'מותר', strength: 4 },
          { source: 'חוק חדש', position: 'אסור', strength: 5 }
        ],
        correctApproach: 'החוק החדש גובר',
        reasoning: 'הכנסת יכולה לשנות פסיקה באמצעות חקיקה, אך בג"ץ יבחן חוקתיות',
        difficulty: 'hard',
        practicalTips: [
          'בחן אם החוק החדש חוקתי',
          'בדוק פסקת הגבלה ברלוונטיים',
          'שקול הגשת עתירה חוקתית'
        ]
      }
    ],
    complexities: [
      'חוקים עם פסקת הגבלה מאפשרים ביקורת חמורה יותר',
      'פסיקה יכולה ליצור "חוק לא כתוב" בהיעדר חקיקה',
      'מנהגים מקומיים עשויים להתנגש עם חקיקה לאומית',
      'עקרונות משפט טבעי עשויים לגבור על חקיקה פוזיטיבית'
    ],
    modernImplications: [
      'המהפכה החוקתית של שנות ה-90 שינתה את היחסים',
      'בג"ץ נזהר יותר בביקורת אחרי פס"ד גל',
      'דיון ציבורי על גבולות הביקורת השיפוטית',
      'התפתחות תפיסת "דמוקרטיה מהותית"'
    ],
    relatedConcepts: ['judicial-review', 'natural-law-positivism', 'administrative-law']
  },
  {
    id: 'natural-law-positivism',
    title: 'משפט טבעי מול פוזיטיביזם',
    category: 'philosophy',
    level: 'expert',
    icon: '⚖️🤔',
    color: '#7b1fa2',
    description: 'המתח הפילוסופי בין ערכים מוסריים אוניברסליים לבין חובת ציות לחוק הכתוב',
    keyPoints: [
      'משפט טבעי - עקרונות מוסריים עליונים',
      'פוזיטיביזם - חובת ציות לחוק בלבד',
      'השפעה על פרשנות בג"ץ',
      'אפשרות פסילת חוקים על בסיס מוסרי',
      'איזון בין צדק לוודאות משפטית'
    ],
    realCases: [
      {
        id: 'yardor',
        name: 'ע"ב 1/65 ירדור נגד יו"ר הועדה המרכזית',
        year: '1965',
        court: 'בג"ץ',
        principle: 'דמוקרטיה מהותית',
        outcome: 'פסילת מועמד אנטי-דמוקרטי',
        significance: 'יישום עקרונות על-חוקיים',
        relevantLaw: ['חוק יסוד: הכנסת', 'עקרונות דמוקרטיים']
      },
      {
        id: 'kol-haam',
        name: 'ע"א 73/53 קול העם נגד שר הפנים',
        year: '1953',
        court: 'בג"ץ',
        principle: 'חופש הביטוי כעקרון על-חוקי',
        outcome: 'הגנה על חופש עיתונות',
        significance: 'קביעת עקרונות טבעיים',
        relevantLaw: ['עקרונות דמוקרטיים', 'חופש הביטוי']
      }
    ],
    practicalScenarios: [
      {
        id: 'immoral-but-legal',
        title: 'חוק חוקי אך לא מוסרי',
        situation: 'חוק חוקי מבחינה פורמלית אך פוגע קשות בזכויות יסוד',
        conflictingSources: [
          { source: 'החוק הפורמלי', position: 'חוקי', strength: 4 },
          { source: 'עקרונות צדק טבעי', position: 'לא מוסרי', strength: 4 }
        ],
        correctApproach: 'פרשנות מאזנת או עתירה חוקתית',
        reasoning: 'בג"ץ ינסה לפרש באופן המכבד עקרונות יסוד, או יפסול אם חמור',
        difficulty: 'expert',
        practicalTips: [
          'חפש פרשנות המכבדת עקרונות יסוד',
          'בחן אם יש פגיעה מידתית',
          'שקול עתירה על בסיס חוקי יסוד'
        ]
      }
    ],
    complexities: [
      'הגדרת "עקרונות טבעיים" שנויה במחלוקת',
      'איזון בין ביטחון לזכויות יסוד',
      'השפעת ערכים דתיים על חקיקה חילונית',
      'שאלת המקור לעקרונות על-חוקיים'
    ],
    modernImplications: [
      'דיון ציבורי על תפקיד בג"ץ בחברה',
      'מתח בין דמוקרטיה רובנית למהותית',
      'השפעה על חקיקה עתידית',
      'התפתחות זכויות אדם בינלאומיות'
    ],
    relatedConcepts: ['judicial-review', 'constitutional-law', 'human-rights']
  },
  {
    id: 'attorney-general-authority',
    title: 'סמכות היועץ המשפטי לממשלה',
    category: 'administrative',
    level: 'advanced',
    icon: '👨‍💼⚖️',
    color: '#388e3c',
    description: 'תפקידו הייחודי של היועמ"ש כגורם מחייב וכמפקח על חוקיות פעולות הממשלה',
    keyPoints: [
      'הנחיות מחייבות מול המלצות',
      'סמכות ייעוץ מול סמכות אכיפה',
      'השפעה על חקיקה ומינהל',
      'יחסים עם ביקורת שיפוטית',
      'עצמאות מול אחריותיות פוליטית'
    ],
    realCases: [
      {
        id: 'dery-appointment',
        name: 'בג"ץ 5167/00 ועדת המשפטנים נגד ראש הממשלה',
        year: '2001',
        court: 'בג"ץ',
        principle: 'חוקיות מינוי שר עם כתב אישום',
        outcome: 'קביעת עקרון הנגדת יועמ"ש',
        significance: 'חיזוק סמכות היועמ"ש',
        relevantLaw: ['חוק יסוד: הממשלה', 'הנחיות יועמ"ש']
      }
    ],
    practicalScenarios: [
      {
        id: 'government-vs-attorney',
        title: 'ממשלה מול יועמ"ש',
        situation: 'הממשלה רוצה לקבל החלטה שהיועמ"ש מתנגד לה מבחינה משפטית',
        conflictingSources: [
          { source: 'החלטת הממשלה', position: 'מדיני מוצדק', strength: 3 },
          { source: 'התנגדות יועמ"ש', position: 'לא חוקי', strength: 5 }
        ],
        correctApproach: 'הממשלה לא יכולה לפעול נגד עמדת יועמ"ש',
        reasoning: 'יועמ"ש מחייב בשאלות משפטיות, לא מדיניות',
        difficulty: 'hard',
        practicalTips: [
          'הבחן בין שאלות משפט למדיניות',
          'בחן אפשרות לעיון משפטי נוסף',
          'שקול שינוי נסיבות עובדתיות'
        ]
      }
    ],
    complexities: [
      'גבול בין שאלות משפט למדיניות',
      'עצמאות מול אחריותיות לממשלה',
      'הבדל בין הנחיות להמלצות',
      'יחס להנחיות של יועמ"ש קודמים'
    ],
    modernImplications: [
      'חיזוק מעמד היועמ"ש בעשורים האחרונים',
      'דיון על איזון בין חוקיות למדיניות',
      'השפעה על יציבות ממשלתית',
      'התפתחות תפיסת שלטון החוק'
    ],
    relatedConcepts: ['administrative-law', 'rule-of-law', 'separation-powers']
  },
  {
    id: 'administrative-law',
    title: 'משפט מנהלי ופסיקה מנהלית',
    category: 'administrative',
    level: 'advanced',
    icon: '🏛️📋',
    color: '#f57c00',
    description: 'עקרונות התערבות בג"ץ ברשות המבצעת וביקורת על פעולות מנהליות',
    keyPoints: [
      'חוקיות המנהל - פעולה על בסיס חוק',
      'סבירות - מניעת החלטות בלתי סבירות',
      'פרופורציונליות - איזון בין אמצעי למטרה',
      'אמון הציבור ותום לב',
      'שיקולים זרים ורלוונטיים'
    ],
    realCases: [
      {
        id: 'dwikat',
        name: 'בג"ץ 390/79 דוויקאת נגד ממשלת ישראל',
        year: '1979',
        court: 'בג"ץ',
        principle: 'חוקיות המנהל',
        outcome: 'ביסוס עקרון הפעולה על פי חוק',
        significance: 'יצירת בסיס למשפט מנהלי',
        relevantLaw: ['עקרונות משפט מנהלי']
      },
      {
        id: 'ressler',
        name: 'בג"ץ 389/80 רסלר נגד שר הפנים',
        year: '1980',
        court: 'בג"ץ',
        principle: 'עקרון הסבירות',
        outcome: 'קביעת מבחן הסבירות הקיצונית',
        significance: 'פיתוח ביקורת על שיקול דעת',
        relevantLaw: ['עקרון הסבירות המנהלית']
      }
    ],
    practicalScenarios: [
      {
        id: 'unreasonable-decision',
        title: 'החלטה מנהלית בלתי סבירה',
        situation: 'עירייה סירבה לרישיון עסק מטעמים שאינם קשורים לתחום הרישוי',
        conflictingSources: [
          { source: 'שיקול דעת העירייה', position: 'סירוב', strength: 2 },
          { source: 'עקרון הסבירות', position: 'צריך להתיר', strength: 4 }
        ],
        correctApproach: 'עתירה לבג"ץ על בסיס אי-סבירות',
        reasoning: 'שיקולים זרים אינם רלוונטיים להחלטה מנהלית',
        difficulty: 'medium',
        practicalTips: [
          'בדוק אם השיקולים רלוונטיים לסמכות',
          'חפש תקדימים דומים',
          'הוכח נזק ממשי'
        ]
      }
    ],
    complexities: [
      'גבול בין ביקורת שיפוטית לשיקול דעת מנהלי',
      'מבחני סבירות שונים לתחומים שונים',
      'איזון בין יעילות מנהלית לזכויות פרט',
      'השפעת שיקולי ביטחון על עקרונות מנהליים'
    ],
    modernImplications: [
      'התפתחות חוק יסוד: כבוד האדם השפיעה על המשפט המנהלי',
      'עליה בעתירות נגד רשויות מקומיות',
      'דרישה לשקיפות ונגישות מנהלית',
      'השפעת טכנולוגיה על הליכים מנהליים'
    ],
    relatedConcepts: ['judicial-review', 'rule-of-law', 'proportionality']
  },
  {
    id: 'judicial-review',
    title: 'מנגנוני ביקורת שיפוטית',
    category: 'judicial',
    level: 'expert',
    icon: '⚖️🔍',
    color: '#1976d2',
    description: 'רמות וצורות שונות של ביקורת שיפוטית על חקיקה ופעולות מנהליות',
    keyPoints: [
      'פסילה אוטומטית מול מותנית',
      'חוקים עם פסקת הגבלה מול ללא',
      'ביקורת על חקיקה ראשית מול משנה',
      'מבחני פגיעה וחלופות פחות פוגעניות',
      'איזון בין הפרדת רשויות לזכויות יסוד'
    ],
    realCases: [
      {
        id: 'mizrahi-constitutional',
        name: 'בג"ץ 6821/93 בנק מזרחי - המהפכה החוקתית',
        year: '1995',
        court: 'בג"ץ מורחב',
        principle: 'ביקורת חוקתית על חקיקה',
        outcome: 'קביעת זכות ביקורת חוקתית',
        significance: 'שינוי מהותי במערכת המשפטית',
        relevantLaw: ['חוק יסוד: כבוד האדם וחירותו']
      }
    ],
    practicalScenarios: [
      {
        id: 'limitation-clause',
        title: 'חוק עם פסקת הגבלה',
        situation: 'חוק מגביל זכות יסוד אך כולל פסקת הגבלה',
        conflictingSources: [
          { source: 'חוק המגביל זכות', position: 'הגבלה מוצדקת', strength: 3 },
          { source: 'זכות יסוד', position: 'חופש מלא', strength: 4 }
        ],
        correctApproach: 'מבחן הפגיעה המידתית',
        reasoning: 'פסקת הגבלה מחייבת הוכחת מטרה ראויה ואמצעי מידתי',
        difficulty: 'expert',
        practicalTips: [
          'בחן אם המטרה ראויה',
          'הוכח קשר רציונלי בין אמצעי למטרה',
          'מצא חלופות פחות פוגעניות'
        ]
      }
    ],
    complexities: [
      'הבחנה בין ביקורת חוקתית רגילה למעמיקה',
      'השפעת הרכב בית המשפט על תוצאות',
      'איזון בין ביקורת לדמוקרטיה',
      'שאלת הלגיטימציה הדמוקרטית של בג"ץ'
    ],
    modernImplications: [
      'דיון ציבורי על "אקטיביזם שיפוטי"',
      'הצעות לרפורמה במערכת המשפט',
      'השפעה על תהליכי חקיקה',
      'התפתחות זכויות חוקתיות'
    ],
    relatedConcepts: ['constitutional-law', 'separation-powers', 'human-rights']
  }
];

const judicialReviewTypes: JudicialReviewType[] = [
  {
    type: 'ביקורת חוקתית מעמיקה',
    description: 'חוקים עם פסקת הגבלה - מבחן פגיעה מידתית מלא',
    examples: [
      'חוק איסור לשון הרע מול חופש ביטוי',
      'הגבלות על התכנסות מול זכות הפגנה'
    ],
    limitations: [
      'רק לחוקים עם פסקת הגבלה',
      'דורש הוכחת פגיעה משמעותית'
    ],
    effectiveness: 5
  },
  {
    type: 'ביקורת חוקתית זהירה',
    description: 'חוקים ללא פסקת הגבלה - ביקורת מוגבלת יותר',
    examples: [
      'חוק יסוד: הכנסת',
      'חוק יסוד: השפיטה'
    ],
    limitations: [
      'נזהרת מהתערבות יתרה',
      'מכבדת שיקול דעת הכנסת'
    ],
    effectiveness: 3
  },
  {
    type: 'ביקורת מנהלית',
    description: 'בחינת חוקיות, סבירות ופרופורציונליות של פעולות מנהליות',
    examples: [
      'החלטות שרים ורשויות מקומיות',
      'פעולות גופים ציבוריים'
    ],
    limitations: [
      'אין התערבות בשיקול דעת מקצועי',
      'רק בפעולות בלתי סבירות קיצונית'
    ],
    effectiveness: 4
  }
];

interface AdvancedLegalConceptsProps {
  onStartScenario: (scenario: PracticalScenario, conceptId: string) => void;
  onViewCase: (caseItem: RealCase) => void;
}

export const AdvancedLegalConcepts: React.FC<AdvancedLegalConceptsProps> = ({
  onStartScenario,
  onViewCase
}) => {
  const [selectedConcept, setSelectedConcept] = useState<AdvancedConcept | null>(null);
  const [selectedTab, setSelectedTab] = useState(0);
  const [activeStep, setActiveStep] = useState(0);

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'intermediate': return '#4caf50';
      case 'advanced': return '#ff9800';
      case 'expert': return '#f44336';
      default: return '#9e9e9e';
    }
  };

  const getLevelLabel = (level: string) => {
    switch (level) {
      case 'intermediate': return 'בינוני';
      case 'advanced': return 'מתקדם';
      case 'expert': return 'מומחה';
      default: return 'בסיסי';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'hierarchy': return <TrendIcon />;
      case 'philosophy': return <PhilosophyIcon />;
      case 'administrative': return <AdminIcon />;
      case 'judicial': return <JudgeIcon />;
      case 'interpretation': return <ExploreIcon />;
      case 'international': return <GlobalIcon />;
      case 'religious': return <BookIcon />;
      case 'precedent': return <CourtIcon />;
      case 'integration': return <BalanceIcon />;
      default: return <InfoIcon />;
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'hierarchy': return 'היררכיה';
      case 'philosophy': return 'פילוסופיה';
      case 'administrative': return 'מנהלי';
      case 'judicial': return 'שיפוטי';
      case 'interpretation': return 'פרשנות';
      case 'international': return 'בינלאומי';
      case 'religious': return 'דתי';
      case 'precedent': return 'תקדימים';
      case 'integration': return 'שילוב';
      default: return 'כללי';
    }
  };

  const TabPanel = ({ children, value, index }: any) => (
    <div hidden={value !== index}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );

  const DifficultyMeter = ({ difficulty }: { difficulty: string }) => {
    const level = difficulty === 'medium' ? 2 : difficulty === 'hard' ? 3 : 4;
    return (
      <Box display="flex" alignItems="center" gap={1}>
        <Typography variant="caption">קושי:</Typography>
        <Box sx={{ width: 60 }}>
          <LinearProgress 
            variant="determinate" 
            value={(level / 4) * 100}
            color={level <= 2 ? 'success' : level === 3 ? 'warning' : 'error'}
          />
        </Box>
      </Box>
    );
  };

  return (
    <Box sx={{ maxWidth: 1400, margin: 'auto', p: 2 }}>
      {/* כותרת */}
      <Card sx={{ mb: 3, background: 'linear-gradient(135deg, #6a1b9a 0%, #4a148c 100%)', color: 'white' }}>
        <CardHeader
          title={
            <Typography variant="h4" sx={{ fontWeight: 'bold', textAlign: 'center' }}>
              🎓 מושגים מתקדמים במשפט הישראלי
            </Typography>
          }
          subheader={
            <Typography variant="h6" sx={{ textAlign: 'center', opacity: 0.9 }}>
              עומק, מורכבות ודילמות בעולם המשפט הישראלי
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
            <Tab 
              icon={<ExploreIcon />} 
              label="מושגים מתקדמים" 
            />
            <Tab 
              icon={<BalanceIcon />} 
              label="סוגי ביקורת שיפוטית" 
            />
            <Tab 
              icon={<TimelineIcon />} 
              label="מקרים מורכבים" 
            />
          </Tabs>
        </Box>

        {/* טאב מושגים מתקדמים */}
        <TabPanel value={selectedTab} index={0}>
          <Typography variant="h6" gutterBottom color="primary">
            🔬 חקור מושגים משפטיים מתקדמים
          </Typography>
          
          <Grid container spacing={3}>
            {advancedConcepts.map(concept => (
              <Grid item xs={12} sm={6} md={4} key={concept.id}>
                <Card 
                  elevation={3}
                  sx={{ 
                    height: '100%',
                    border: `2px solid ${concept.color}20`,
                    cursor: 'pointer',
                    '&:hover': { 
                      transform: 'translateY(-4px)',
                      boxShadow: 6,
                      transition: 'all 0.3s ease'
                    }
                  }}
                  onClick={() => setSelectedConcept(concept)}
                >
                  <CardContent>
                    <Box display="flex" alignItems="center" gap={2} mb={2}>
                      <Box sx={{ fontSize: '2rem' }}>{concept.icon}</Box>
                      <Box flex={1}>
                        <Typography variant="h6" fontWeight="bold">
                          {concept.title}
                        </Typography>
                        <Box display="flex" gap={1} mt={1}>
                          <Chip 
                            label={getCategoryLabel(concept.category)}
                            size="small"
                            icon={getCategoryIcon(concept.category)}
                            sx={{ backgroundColor: concept.color, color: 'white' }}
                          />
                          <Chip 
                            label={getLevelLabel(concept.level)}
                            size="small"
                            sx={{ 
                              backgroundColor: getLevelColor(concept.level), 
                              color: 'white' 
                            }}
                          />
                        </Box>
                      </Box>
                    </Box>
                    
                    <Typography variant="body2" color="text.secondary" paragraph>
                      {concept.description}
                    </Typography>
                    
                    <Box display="flex" gap={1} alignItems="center" mb={2}>
                      <Typography variant="caption" color="success.main">
                        📚 {concept.realCases.length} מקרים אמיתיים
                      </Typography>
                      <Typography variant="caption" color="warning.main">
                        🎯 {concept.practicalScenarios.length} תרחישים מעשיים
                      </Typography>
                    </Box>
                    
                    <Box display="flex" gap={1} mt={2}>
                      <Button 
                        size="small" 
                        variant="contained"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedConcept(concept);
                        }}
                        sx={{ backgroundColor: concept.color }}
                      >
                        חקור
                      </Button>
                      {concept.practicalScenarios.length > 0 && (
                        <Button 
                          size="small" 
                          variant="outlined"
                          onClick={(e) => {
                            e.stopPropagation();
                            onStartScenario(concept.practicalScenarios[0], concept.id);
                          }}
                          sx={{ borderColor: concept.color, color: concept.color }}
                        >
                          תרחיש
                        </Button>
                      )}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </TabPanel>

        {/* טאב סוגי ביקורת שיפוטית */}
        <TabPanel value={selectedTab} index={1}>
          <Typography variant="h6" gutterBottom color="primary">
            ⚖️ מנגנוני ביקורת שיפוטית
          </Typography>
          
          <Alert severity="info" sx={{ mb: 3 }}>
            <Typography variant="body2">
              בג"ץ משתמש במנגנוני ביקורת שונים בהתאם לסוג החוק או הפעולה הנבחנת
            </Typography>
          </Alert>

          <Grid container spacing={3}>
            {judicialReviewTypes.map((reviewType, index) => (
              <Grid item xs={12} md={6} key={index}>
                <Card elevation={2} sx={{ height: '100%' }}>
                  <CardContent>
                    <Box display="flex" alignItems="center" gap={2} mb={2}>
                      <Avatar sx={{ bgcolor: `hsl(${index * 120}, 70%, 50%)` }}>
                        <JudgeIcon />
                      </Avatar>
                      <Typography variant="h6" fontWeight="bold">
                        {reviewType.type}
                      </Typography>
                    </Box>
                    
                    <Typography variant="body2" paragraph>
                      {reviewType.description}
                    </Typography>
                    
                    <Box mb={2}>
                      <Typography variant="subtitle2" gutterBottom>
                        📋 דוגמאות:
                      </Typography>
                      <List dense>
                        {reviewType.examples.map((example, idx) => (
                          <ListItem key={idx} sx={{ pl: 0 }}>
                            <ListItemText 
                              primary={`• ${example}`}
                              primaryTypographyProps={{ variant: 'body2' }}
                            />
                          </ListItem>
                        ))}
                      </List>
                    </Box>
                    
                    <Box mb={2}>
                      <Typography variant="subtitle2" gutterBottom>
                        ⚠️ מגבלות:
                      </Typography>
                      <List dense>
                        {reviewType.limitations.map((limitation, idx) => (
                          <ListItem key={idx} sx={{ pl: 0 }}>
                            <ListItemText 
                              primary={`• ${limitation}`}
                              primaryTypographyProps={{ variant: 'body2', color: 'text.secondary' }}
                            />
                          </ListItem>
                        ))}
                      </List>
                    </Box>
                    
                    <Box display="flex" alignItems="center" gap={1}>
                      <Typography variant="caption">יעילות:</Typography>
                      <Rating 
                        value={reviewType.effectiveness} 
                        max={5} 
                        readOnly 
                        size="small"
                      />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </TabPanel>

        {/* טאב מקרים מורכבים */}
        <TabPanel value={selectedTab} index={2}>
          <Typography variant="h6" gutterBottom color="primary">
            🧩 תרחישים משפטיים מורכבים
          </Typography>
          
          <Stepper activeStep={activeStep} orientation="vertical">
            {advancedConcepts
              .filter(concept => concept.practicalScenarios.length > 0)
              .map((concept, index) => (
                <Step key={concept.id}>
                  <StepLabel>
                    <Typography variant="h6">
                      {concept.icon} {concept.title}
                    </Typography>
                  </StepLabel>
                  <StepContent>
                    <Grid container spacing={2}>
                      {concept.practicalScenarios.map(scenario => (
                        <Grid item xs={12} key={scenario.id}>
                          <Paper elevation={2} sx={{ p: 3 }}>
                            <Typography variant="h6" gutterBottom color="primary">
                              {scenario.title}
                            </Typography>
                            
                            <Typography variant="body1" paragraph>
                              <strong>המצב:</strong> {scenario.situation}
                            </Typography>
                            
                            <Box mb={2}>
                              <Typography variant="subtitle1" gutterBottom>
                                ⚔️ מקורות סותרים:
                              </Typography>
                              {scenario.conflictingSources.map((source, idx) => (
                                <Paper 
                                  key={idx} 
                                  elevation={1} 
                                  sx={{ p: 2, mb: 1, bgcolor: '#f5f5f5' }}
                                >
                                  <Box display="flex" justifyContent="between" alignItems="center">
                                    <Typography variant="body2">
                                      <strong>{source.source}:</strong> {source.position}
                                    </Typography>
                                    <Box display="flex" alignItems="center" gap={1}>
                                      <Typography variant="caption">עוצמה:</Typography>
                                      <Rating 
                                        value={source.strength} 
                                        max={5} 
                                        readOnly 
                                        size="small"
                                      />
                                    </Box>
                                  </Box>
                                </Paper>
                              ))}
                            </Box>
                            
                            <Alert severity="success" sx={{ mb: 2 }}>
                              <Typography variant="body2">
                                <strong>הפתרון הנכון:</strong> {scenario.correctApproach}
                              </Typography>
                            </Alert>
                            
                            <Typography variant="body2" paragraph>
                              <strong>הנמקה:</strong> {scenario.reasoning}
                            </Typography>
                            
                            <Box mb={2}>
                              <DifficultyMeter difficulty={scenario.difficulty} />
                            </Box>
                            
                            <Accordion>
                              <AccordionSummary expandIcon={<ExpandIcon />}>
                                <Typography variant="subtitle2">
                                  💡 טיפים מעשיים
                                </Typography>
                              </AccordionSummary>
                              <AccordionDetails>
                                <List dense>
                                  {scenario.practicalTips.map((tip, idx) => (
                                    <ListItem key={idx}>
                                      <ListItemIcon>
                                        <CheckIcon color="success" />
                                      </ListItemIcon>
                                      <ListItemText primary={tip} />
                                    </ListItem>
                                  ))}
                                </List>
                              </AccordionDetails>
                            </Accordion>
                            
                            <Box mt={2}>
                              <Button
                                variant="contained"
                                size="small"
                                onClick={() => onStartScenario(scenario, concept.id)}
                                sx={{ backgroundColor: concept.color }}
                              >
                                התחל תרגול אינטראקטיבי
                              </Button>
                            </Box>
                          </Paper>
                        </Grid>
                      ))}
                    </Grid>
                    
                    <Box sx={{ mb: 1, mt: 2 }}>
                      <Button
                        variant="contained"
                        onClick={() => setActiveStep(activeStep + 1)}
                        sx={{ mt: 1, mr: 1 }}
                        disabled={index === advancedConcepts.filter(c => c.practicalScenarios.length > 0).length - 1}
                      >
                        הבא
                      </Button>
                      <Button
                        disabled={index === 0}
                        onClick={() => setActiveStep(activeStep - 1)}
                        sx={{ mt: 1, mr: 1 }}
                      >
                        קודם
                      </Button>
                    </Box>
                  </StepContent>
                </Step>
              ))}
          </Stepper>
        </TabPanel>
      </Card>

      {/* דיאלוג מושג מפורט */}
      <Dialog 
        open={!!selectedConcept} 
        onClose={() => setSelectedConcept(null)}
        maxWidth="lg"
        fullWidth
      >
        {selectedConcept && (
          <>
            <DialogTitle>
              <Box display="flex" justifyContent="between" alignItems="center">
                <Box display="flex" alignItems="center" gap={2}>
                  <Box component="span" sx={{ fontSize: '2.5rem' }}>{selectedConcept.icon}</Box>
                  <Box>
                    <Typography variant="h5" fontWeight="bold">
                      {selectedConcept.title}
                    </Typography>
                    <Box display="flex" gap={1} mt={1}>
                      <Chip 
                        label={getCategoryLabel(selectedConcept.category)}
                        size="small"
                        icon={getCategoryIcon(selectedConcept.category)}
                        sx={{ backgroundColor: selectedConcept.color, color: 'white' }}
                      />
                      <Chip 
                        label={getLevelLabel(selectedConcept.level)}
                        size="small"
                        sx={{ 
                          backgroundColor: getLevelColor(selectedConcept.level), 
                          color: 'white' 
                        }}
                      />
                    </Box>
                  </Box>
                </Box>
                <IconButton onClick={() => setSelectedConcept(null)}>
                  <CloseIcon />
                </IconButton>
              </Box>
            </DialogTitle>
            
            <DialogContent>
              <Typography variant="body1" paragraph>
                {selectedConcept.description}
              </Typography>

              <Accordion defaultExpanded>
                <AccordionSummary expandIcon={<ExpandIcon />}>
                  <Typography variant="h6">🎯 נקודות מפתח</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <List>
                    {selectedConcept.keyPoints.map((point, index) => (
                      <ListItem key={index}>
                        <ListItemIcon>
                          <CheckIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText primary={point} />
                      </ListItem>
                    ))}
                  </List>
                </AccordionDetails>
              </Accordion>

              <Accordion>
                <AccordionSummary expandIcon={<ExpandIcon />}>
                  <Typography variant="h6">📚 מקרים אמיתיים</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Grid container spacing={2}>
                    {selectedConcept.realCases.map((caseItem, index) => (
                      <Grid item xs={12} md={6} key={caseItem.id}>
                        <Paper 
                          elevation={1} 
                          sx={{ p: 2, cursor: 'pointer' }}
                          onClick={() => onViewCase(caseItem)}
                        >
                          <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                            {caseItem.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary" display="block">
                            {caseItem.court} • {caseItem.year}
                          </Typography>
                          <Typography variant="body2" paragraph>
                            <strong>עקרון:</strong> {caseItem.principle}
                          </Typography>
                          <Typography variant="body2" paragraph>
                            <strong>תוצאה:</strong> {caseItem.outcome}
                          </Typography>
                          <Typography variant="body2">
                            <strong>משמעות:</strong> {caseItem.significance}
                          </Typography>
                        </Paper>
                      </Grid>
                    ))}
                  </Grid>
                </AccordionDetails>
              </Accordion>

              <Accordion>
                <AccordionSummary expandIcon={<ExpandIcon />}>
                  <Typography variant="h6">🧩 מורכבויות</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <List>
                    {selectedConcept.complexities.map((complexity, index) => (
                      <ListItem key={index}>
                        <ListItemIcon>
                          <WarningIcon color="warning" />
                        </ListItemIcon>
                        <ListItemText primary={complexity} />
                      </ListItem>
                    ))}
                  </List>
                </AccordionDetails>
              </Accordion>

              <Accordion>
                <AccordionSummary expandIcon={<ExpandIcon />}>
                  <Typography variant="h6">🔮 השלכות מודרניות</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <List>
                    {selectedConcept.modernImplications.map((implication, index) => (
                      <ListItem key={index}>
                        <ListItemIcon>
                          <TrendIcon color="info" />
                        </ListItemIcon>
                        <ListItemText primary={implication} />
                      </ListItem>
                    ))}
                  </List>
                </AccordionDetails>
              </Accordion>
            </DialogContent>
            
            <DialogActions>
              <Button onClick={() => setSelectedConcept(null)}>
                סגור
              </Button>
              {selectedConcept.practicalScenarios.length > 0 && (
                <Button 
                  variant="contained" 
                  startIcon={<QuizIcon />}
                  onClick={() => {
                    onStartScenario(selectedConcept.practicalScenarios[0], selectedConcept.id);
                    setSelectedConcept(null);
                  }}
                  sx={{ backgroundColor: selectedConcept.color }}
                >
                  התחל תרחיש
                </Button>
              )}
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
};

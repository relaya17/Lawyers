import React, { useState } from 'react';
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
  LinearProgress,
  Avatar,
  Stepper,
  Step,
  StepLabel,
  StepContent,
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
  TrendingUp as TrendIcon,
  Warning as WarningIcon,
  CheckCircle as CheckIcon,
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
  },

  // ─── מושגים נוספים ───────────────────────────────────────────────────────────
  {
    id: 'statutory-interpretation',
    title: 'פרשנות חקיקה — לשון מול תכלית',
    category: 'interpretation',
    level: 'advanced',
    icon: '🔍📜',
    color: '#00838f',
    description: 'המתח בין פרשנות דקדוקית–לשונית לבין הגישה התכליתית המודרנית בפרשנות חוק',
    keyPoints: [
      'גישה לשונית — פירוש לפי מילות החוק בלבד',
      'גישה תכליתית — מטרת החוק מנחה את הפרשנות',
      'תכלית סובייקטיבית — כוונת המחוקק',
      'תכלית אובייקטיבית — המטרה הראויה',
      'הכלל: לשון היא נקודת הפתיחה, תכלית — נקודת הסיום'
    ],
    realCases: [
      {
        id: 'haifa-municipality',
        name: 'ע"א 165/82 קיבוץ חצור נגד פקיד שומה',
        year: '1985',
        court: 'בית המשפט העליון',
        principle: 'פרשנות תכליתית',
        outcome: 'אימוץ גישת הפרשנות התכליתית',
        significance: 'מהפכה בגישת הפרשנות בישראל',
        relevantLaw: ['חוק הפרשנות, תשמ"א–1981']
      },
      {
        id: 'barak-interpretation',
        name: 'בג"ץ 693/91 אפרת נגד הממונה על מרשם האוכלוסין',
        year: '1993',
        court: 'בג"ץ',
        principle: 'תכלית אובייקטיבית',
        outcome: 'הרחבת פרשנות מעבר לפשט הלשוני',
        significance: 'ביסוס השיטה התכליתית',
        relevantLaw: ['חוק מרשם האוכלוסין']
      }
    ],
    practicalScenarios: [
      {
        id: 'ambiguous-tax-law',
        title: 'חוק מס דו-משמעי',
        situation: 'חוק מס מנוסח בצורה דו-משמעית — ניתן לפרשו לטובת האזרח או לטובת רשות המסים',
        conflictingSources: [
          { source: 'פשט לשון החוק', position: 'פרשנות מצמצמת', strength: 3 },
          { source: 'תכלית החקיקה', position: 'פרשנות מרחיבה', strength: 4 }
        ],
        correctApproach: 'פרשנות תכליתית תוך עדיפות לאזרח בספק מס',
        reasoning: 'חוקי מס מפורשים בצמצום כשיש ספק — אך התכלית מנחה את הניתוח',
        difficulty: 'hard',
        practicalTips: [
          'בדוק דברי הסבר להצעת החוק',
          'בחן פסיקה קיימת בנושא',
          'ישם כלל: ספק מס לטובת הנישום'
        ]
      }
    ],
    complexities: [
      'מתח בין שלטון החוק לגמישות שיפוטית',
      'אבחנה בין "תכלית" ל"רצון שיפוטי"',
      'פרשנות בחוקי עונשין — לרוב מצמצמת',
      'שינויי נסיבות שהמחוקק לא צפה'
    ],
    modernImplications: [
      'גישת ברק שינתה את אופן כתיבת החקיקה',
      'מחלוקות על גבולות הפרשנות השיפוטית',
      'השפעה על ניסוח חוזים עסקיים',
      'ויכוח: האם שופטים "מחוקקים" בפרשנות?'
    ],
    relatedConcepts: ['normative-hierarchy', 'judicial-review', 'natural-law-positivism']
  },
  {
    id: 'religion-state-law',
    title: 'דת ומדינה — מקורות דין דתי',
    category: 'religious',
    level: 'advanced',
    icon: '✡️⚖️',
    color: '#1a237e',
    description: 'מעמד ההלכה היהודית, דיני שריעה ודין קנוני כמקורות משפט ייחודיים במדינת ישראל',
    keyPoints: [
      'סמכות בתי הדין הדתיים בנישואין וגירושין',
      'הלכה יהודית כמקור משפט מקביל',
      'חוק יסודות המשפט — עקרונות מורשת ישראל',
      'מתח בין דין אישי לדין אזרחי',
      'ועדות מעוניינים וסמכות ייחודית'
    ],
    realCases: [
      {
        id: 'rabbinical-personal-status',
        name: 'בג"ץ 130/66 שסס נגד הרב הראשי לתל אביב',
        year: '1967',
        court: 'בג"ץ',
        principle: 'גבולות סמכות בית דין רבני',
        outcome: 'ביסוס ביקורת על בתי דין דתיים',
        significance: 'הגדרת תחום סמכות הרבנות',
        relevantLaw: ['חוק שיפוט בתי דין רבניים, תשי"ג–1953']
      },
      {
        id: 'morality-vs-religion',
        name: 'בג"ץ 5016/96 חורב נגד שר התחבורה',
        year: '1997',
        court: 'בג"ץ',
        principle: 'איזון בין דת ו זכויות אזרח',
        outcome: 'סגירת כביש לצורכי דת — בטל',
        significance: 'גבולות כפיית דת ברשות הציבור',
        relevantLaw: ['חוק יסוד: כבוד האדם וחירותו']
      }
    ],
    practicalScenarios: [
      {
        id: 'get-refusal',
        title: 'סירוב גט — התנגשות בתי משפט',
        situation: 'בית הדין הרבני ובית המשפט לענייני משפחה נותנים פסיקות סותרות בעניין המשמורת',
        conflictingSources: [
          { source: 'פסיקת בית הדין הרבני', position: 'נוח לאב', strength: 3 },
          { source: 'פסיקת בית המשפט לענייני משפחה', position: 'טובת הילד', strength: 5 }
        ],
        correctApproach: 'מי שהגיש ראשון קובע — כלל "הקדמה" לסמכות',
        reasoning: 'הסמכות נקבעת לפי מי פתח ראשון — בית הדין הרבני או בית משפט לענייני משפחה',
        difficulty: 'hard',
        practicalTips: [
          'בדוק מי פתח ראשון',
          'בחן האם הוסכם על ערכאה',
          'שקול מגוון סעדים אזרחיים'
        ]
      }
    ],
    complexities: [
      'הסדר פסיכולוגי של ה"שתי מערכות" בישראל',
      'עגינות — בעיה בלתי פתורה בדין הדתי',
      'ייהוד מול הכרה בפלורליזם',
      'גיור — מחלוקת בין זרמי היהדות'
    ],
    modernImplications: [
      'דיון ציבורי על נישואין אזרחיים',
      'פסיקות בג"ץ על חלוקת נטל בין חרדים לחילונים',
      'הכרה בשלוחות אחרות ביהדות',
      'מתח בין ערכים יהודים לדמוקרטיים'
    ],
    relatedConcepts: ['normative-hierarchy', 'judicial-review', 'natural-law-positivism']
  },
  {
    id: 'international-vs-domestic',
    title: 'משפט בינלאומי ודין פנימי',
    category: 'international',
    level: 'advanced',
    icon: '🌍⚖️',
    color: '#0277bd',
    description: 'יחסי ההדדיות בין התחייבויות בינלאומיות לבין הדין הפנימי הישראלי',
    keyPoints: [
      'מונחת vs. דואליסטית — שתי שיטות שילוב',
      'ישראל — מדינה דואליסטית מסורתית',
      'אמנות זכויות אדם ומשפט מנהגי',
      'חוק יסוד: כבוד האדם — השראה מבינלאומי',
      'חסינות ריבונית ומשפט בינלאומי פרטי'
    ],
    realCases: [
      {
        id: 'eichmann',
        name: 'ע"פ 336/61 אייכמן נגד מדינת ישראל',
        year: '1962',
        court: 'בית המשפט העליון',
        principle: 'סמכות אוניברסלית',
        outcome: 'הכרה בסמכות אוניברסלית לפשעי מלחמה',
        significance: 'מקרה דגל בפשעים נגד האנושות',
        relevantLaw: ['חוק לעשיית דין בנאצים, תש"י–1950']
      },
      {
        id: 'international-customary',
        name: 'בג"ץ 393/82 ג\'מאעה נגד שר הביטחון',
        year: '1983',
        court: 'בג"ץ',
        principle: 'משפט בינלאומי מנהגי',
        outcome: 'הכרה באמות מידה בינלאומיות',
        significance: 'שילוב מינהגי בינלאומי בפנימי',
        relevantLaw: ['אמנת ז\'נבה, 1949']
      }
    ],
    practicalScenarios: [
      {
        id: 'treaty-vs-statute',
        title: 'אמנה בינלאומית מול חוק ישראלי',
        situation: 'ישראל חתמה על אמנת זכויות ילד, אך חוק פנימי סותר את ההוראה',
        conflictingSources: [
          { source: 'חוק פנימי ישראלי', position: 'לא מאמץ את האמנה', strength: 4 },
          { source: 'אמנת זכויות הילד', position: 'מחייבת הגנה', strength: 3 }
        ],
        correctApproach: 'החוק הפנימי גובר — אלא אם אומץ בחוק',
        reasoning: 'ישראל דואליסטית: אמנה מחייבת רק לאחר עיגון בחוק פנימי',
        difficulty: 'hard',
        practicalTips: [
          'בדוק אם האמנה עוגנה בחוק',
          'שקל פרשנות מאמצת',
          'בחן פסיקה על "פרשנות ברוח הבינלאומי"'
        ]
      }
    ],
    complexities: [
      'אין מנגנון אכיפה בינלאומי יעיל',
      'שאלת הגדרת "מנהג בינלאומי"',
      'מתח בין ריבונות לזכויות אדם',
      'כוחן המחייב של החלטות מועצת הביטחון'
    ],
    modernImplications: [
      'תיקים ב-ICJ נגד ישראל',
      'לחץ בינלאומי כגורם עיצוב חקיקה',
      'שאלת חסינות מדינתית בתביעות',
      'הסכמי שלום וחוזים בינלאומיים'
    ],
    relatedConcepts: ['normative-hierarchy', 'judicial-review', 'natural-law-positivism']
  },
  {
    id: 'precedent-stare-decisis',
    title: 'תקדים ועקרון Stare Decisis',
    category: 'precedent',
    level: 'advanced',
    icon: '📚⚖️',
    color: '#4e342e',
    description: 'מחייבוּת פסיקת הערכאות הגבוהות, מתי ניתן לסטות מתקדים ומה כוח התקדים האנכי',
    keyPoints: [
      'תקדים מחייב — ערכאה גבוהה כלפי נמוכה',
      'תקדים משכנע — ערכאות זרות ומקביליות',
      'סטייה מתקדים — מתי ואיך?',
      'Ratio decidendi מול Obiter dicta',
      'הרכב מורחב כדרך שינוי תקדים'
    ],
    realCases: [
      {
        id: 'cogot-case',
        name: 'ע"א 243/83 עיריית ירושלים נגד גורדון',
        year: '1985',
        court: 'בית המשפט העליון',
        principle: 'עקרון התקדים',
        outcome: 'ביסוס כפיפות של ערכאות לפסיקת עליון',
        significance: 'עיגון מחייבות התקדים בישראל',
        relevantLaw: ['חוק בתי המשפט, תשמ"ד–1984; סעיף 20']
      },
      {
        id: 'kaniel-override',
        name: 'ע"א 1027/96 קניאל נגד ממשלת ישראל',
        year: '1999',
        court: 'בית המשפט העליון',
        principle: 'שינוי תקדים',
        outcome: 'פסיקה שינתה עמדה קיימת — עם נימוק',
        significance: 'מסלול לגיטימי לשינוי פסיקה',
        relevantLaw: ['עקרון Stare Decisis']
      }
    ],
    practicalScenarios: [
      {
        id: 'conflict-precedent',
        title: 'שני תקדימים סותרים',
        situation: 'פסיקת מחוזי אחד סותרת פסיקת מחוזי אחר, ואין עדיין פסיקת עליון',
        conflictingSources: [
          { source: 'מחוזי ת"א', position: 'פרשנות א', strength: 3 },
          { source: 'מחוזי חיפה', position: 'פרשנות ב', strength: 3 }
        ],
        correctApproach: 'בהיעדר תקדים מחייב — שיקול דעת שיפוטי ופרשנות עצמאית',
        reasoning: 'פסיקות מחוזי אינן מחייבות מחוזי אחר — מחכים לבירור בעליון',
        difficulty: 'medium',
        practicalTips: [
          'בחן ratio vs obiter בשתי הפסיקות',
          'בחן נסיבות עובדתיות שונות',
          'שקל הגשת ערעור ליצירת תקדים'
        ]
      }
    ],
    complexities: [
      'הבחנה בין ratio decidendi לאוביטר',
      'כמה "דומים" צריכים להיות מקרים?',
      'תקדימים "מיושנים" ושינוי נסיבות',
      'תקדים מחייב מול "יושר שיפוטי"'
    ],
    modernImplications: [
      'פסיקות בג"ץ בנושאי ביטחון מול חירות',
      'שינויים בתקדים בדיני משפחה לאורך שנים',
      'ויכוח על "אקטיביזם" לעומת "ריסון"',
      'השפעת ביקורת ציבורית על שינוי עמדה'
    ],
    relatedConcepts: ['normative-hierarchy', 'judicial-review', 'statutory-interpretation']
  },
  {
    id: 'equality-anti-discrimination',
    title: 'שוויון ואיסור אפליה',
    category: 'judicial',
    level: 'advanced',
    icon: '🤝⚖️',
    color: '#00695c',
    description: 'עקרון השוויון כזכות חוקתית, אפליה ישירה ועקיפה, ועקרון ה"מדינה יהודית ודמוקרטית"',
    keyPoints: [
      'שוויון פורמלי מול שוויון מהותי',
      'אפליה ישירה — טיפול שונה בגלוי',
      'אפליה עקיפה — קריטריון ניטרלי עם השפעה פוגעת',
      'הבחנה מותרת — הצדקה ענינית',
      'פעולה מתקנת — העדפה מתקנת'
    ],
    realCases: [
      {
        id: 'ka\'adan',
        name: 'בג"ץ 6698/95 קעדאן נגד מינהל מקרקעי ישראל',
        year: '2000',
        court: 'בג"ץ',
        principle: 'איסור אפליה של ערבים בהקצאת קרקע',
        outcome: 'חובת מינהל מקרקעי לנהוג בשוויון',
        significance: 'יישום שוויון מהותי בהקצאת משאבים',
        relevantLaw: ['חוק יסוד: כבוד האדם וחירותו']
      },
      {
        id: 'miller-womens-rights',
        name: 'בג"ץ 153/87 שקדיאל נגד שר הדתות',
        year: '1988',
        court: 'בג"ץ',
        principle: 'שוויון מגדרי',
        outcome: 'זכות אישה לכהן בוועד דתי',
        significance: 'שוויון כנגד מוסדות דתיים',
        relevantLaw: ['חוק שוויון האישה, תשי"א–1951']
      }
    ],
    practicalScenarios: [
      {
        id: 'indirect-discrimination',
        title: 'מדיניות ניטרלית עם תוצאה אפליתית',
        situation: 'מעביד דורש "שירות צבאי" כתנאי קבלה — פוגע בפועל במיעוטים פטורים משירות',
        conflictingSources: [
          { source: 'דרישת מעביד', position: 'לגיטימית לכאורה', strength: 3 },
          { source: 'עקרון שוויון', position: 'אפליה עקיפה', strength: 4 }
        ],
        correctApproach: 'אפליה עקיפה — יש להצדיק בצורך עסקי אמיתי',
        reasoning: 'קריטריון ניטרלי שפוגע בקבוצה מסוימת — טעון הצדקה',
        difficulty: 'hard',
        practicalTips: [
          'בחן האם הקריטריון הכרחי לתפקיד',
          'הוכח הצדקה עסקית ממשית',
          'שקל חלופות פחות אפליתיות'
        ]
      }
    ],
    complexities: [
      'מתח בין שוויון לחופש התקשרות',
      'העדפה מתקנת — מתי מוצדקת?',
      'שוויון בין יהודים לערבים בחברה המדינה',
      'שוויון מגדרי מול עקרונות דתיים'
    ],
    modernImplications: [
      'חקיקות נגד הפליה בשוק העבודה',
      'נגישות לנכים — חוק שוויון זכויות',
      'שוויון LGBTQ+ — דיון ציבורי מתמשך',
      'דיון על "מדינת כל אזרחיה"'
    ],
    relatedConcepts: ['judicial-review', 'natural-law-positivism', 'religion-state-law']
  },
  {
    id: 'rule-of-law-accountability',
    title: 'שלטון החוק ואחריות הרשות',
    category: 'administrative',
    level: 'expert',
    icon: '🏛️🔒',
    color: '#4527a0',
    description: 'עקרון שלטון החוק כיסוד הדמוקרטיה — אחריות השלטון, מניעת שרירות וחובת הנמקה',
    keyPoints: [
      'חוקיות — כל פעולה שלטונית חייבת עיגון בחוק',
      'שוויון בפני החוק — אין אדם מעל החוק',
      'ביקורת שיפוטית — ערובה ל"חוק שולט"',
      'חובת הנמקה — שקיפות כעקרון יסוד',
      'עקרון הצפיות — יציבות ההסדר'
    ],
    realCases: [
      {
        id: 'rubinstein-pm',
        name: 'בג"ץ 3094/93 התנועה לאיכות השלטון',
        year: '1993',
        court: 'בג"ץ',
        principle: 'חובת שר/ראש ממשלה לציית לחוק',
        outcome: 'חיזוק עקרון שלטון החוק כנגד בכירים',
        significance: 'אין חסינות מפעולות שלטוניות',
        relevantLaw: ['חוק יסוד: הממשלה']
      },
      {
        id: 'disclosure-reasonableness',
        name: 'בג"ץ 2902/11 אגודת הסוחרים נגד ממשלת ישראל',
        year: '2012',
        court: 'בג"ץ',
        principle: 'חובת הנמקה בהחלטות ממשלה',
        outcome: 'ביטול החלטה ללא נימוק מספק',
        significance: 'שקיפות כעקרון מנהלי',
        relevantLaw: ['עקרון חובת הנמקה']
      }
    ],
    practicalScenarios: [
      {
        id: 'retroactive-law',
        title: 'חקיקה רטרואקטיבית',
        situation: 'הכנסת חוקקה חוק רטרואקטיבי שפוגע בזכויות קיימות',
        conflictingSources: [
          { source: 'חוק חדש (רטרואקטיבי)', position: 'שולל זכות', strength: 4 },
          { source: 'עקרון הצפיות', position: 'הגנה על ציפייה לגיטימית', strength: 4 }
        ],
        correctApproach: 'בג"ץ יבחן חוקתיות — חקיקה רטרואקטיבית חשודה',
        reasoning: 'פגיעה בציפיות ליגיטימיות היא עילה לביקורת חוקתית',
        difficulty: 'expert',
        practicalTips: [
          'בחן האם הפגיעה מידתית',
          'הוכח ציפייה לגיטימית',
          'שקול עתירה לבג"ץ'
        ]
      }
    ],
    complexities: [
      'מתח בין יעילות ממשלתית לביקורת',
      'שאלת "שיקול דעת מדיני" הפטור מביקורת',
      'עקרון הצפיות מול גמישות מדינית',
      'חסינות עד למה — שרים ורוה"מ'
    ],
    modernImplications: [
      'הרחבת עמידה בפני בג"ץ לגופים פרטיים',
      'חוק חופש המידע — שקיפות מינהלית',
      'פשקויות במינויים ובניגודי עניינים',
      'השפעת תיקי שחיתות על עיצוב החוק'
    ],
    relatedConcepts: ['judicial-review', 'attorney-general-authority', 'administrative-law']
  },
  {
    id: 'private-public-law-integration',
    title: 'שילוב משפט פרטי וציבורי',
    category: 'integration',
    level: 'intermediate',
    icon: '🔗⚖️',
    color: '#e65100',
    description: 'כיצד עקרונות חוקתיים ומינהליים "חודרים" לתחומי המשפט הפרטי: חוזים, נזיקין, עבודה',
    keyPoints: [
      'חדירת זכויות יסוד לחוזים פרטיים',
      'תקנת הציבור כגשר בין פרטי לציבורי',
      'עקרון תום הלב — מושפע מחוקתי',
      'אחריות מעין ציבורית של גופים פרטיים',
      'עוולה חוקתית בנזיקין'
    ],
    realCases: [
      {
        id: 'contract-dignity',
        name: 'ע"א 294/91 חברה קדישא נגד קסטנבאום',
        year: '1992',
        court: 'בית המשפט העליון',
        principle: 'כבוד האדם בחוזה פרטי',
        outcome: 'זכויות יסוד חלות גם בהקשר חוזי',
        significance: 'גשר בין מישור הציבורי לפרטי',
        relevantLaw: ['חוק החוזים', 'חוק יסוד: כבוד האדם']
      },
      {
        id: 'monopoly-private',
        name: 'ע"א 3414/93 אלמוג נגד ח.ב שדות',
        year: '1997',
        court: 'בית המשפט העליון',
        principle: 'גוף פרטי דומיננטי — חובות ציבוריות',
        outcome: 'הטלת חובות שוויון על מונופול פרטי',
        significance: 'הרחבת נורמות ציבוריות לפרטיים',
        relevantLaw: ['חוק ההגבלים העסקיים']
      }
    ],
    practicalScenarios: [
      {
        id: 'contract-violates-rights',
        title: 'חוזה פרטי הפוגע בזכות יסוד',
        situation: 'חוזה עבודה המגביל זכות ביטוי של עובד — האם תקף?',
        conflictingSources: [
          { source: 'חופש ההתקשרות', position: 'חוזה תקף', strength: 3 },
          { source: 'חוק יסוד: כבוד האדם', position: 'פגיעה בחופש ביטוי', strength: 4 }
        ],
        correctApproach: 'בחינה לפי תקנת הציבור — ייתכן בטלות חלקית',
        reasoning: 'חוזה הסותר תקנת הציבור — בטל לפי סעיף 30 חוק החוזים',
        difficulty: 'hard',
        practicalTips: [
          'בחן האם הגבלה סבירה ומידתית',
          'בדוק חלופות פחות פוגעות',
          'שקול בטלות חלקית בלבד'
        ]
      }
    ],
    complexities: [
      'עד כמה חוקה חלה על יחסים פרטיים?',
      'חופש חוזים מול הגנות חוקתיות',
      'גוף פרטי "ציבורי" — מתי?',
      'אחריות נזיקית על עוולה חוקתית'
    ],
    modernImplications: [
      'חדירת עקרונות שוויון לשוק העבודה הפרטי',
      'אחריות פלטפורמות דיגיטליות כגופים ציבוריים',
      'חוזים צרכניים — הגנה חוקתית מוגברת',
      'תקנת הציבור בעידן האינטרנט'
    ],
    relatedConcepts: ['normative-hierarchy', 'equality-anti-discrimination', 'statutory-interpretation']
  },
  {
    id: 'emergency-powers',
    title: 'סמכויות חירום ומגבלותיהן',
    category: 'administrative',
    level: 'expert',
    icon: '🚨🏛️',
    color: '#b71c1c',
    description: 'כוחות החירום של הממשלה — פקודות המלחמה, תקנות שעת חירום וביקורת בג"ץ בעת משבר',
    keyPoints: [
      'תקנות שעת חירום — מסד חוקי (סעיף 38 לחוק יסוד: הממשלה)',
      'ביטחון לאומי מול זכויות יסוד',
      'ביקורת שיפוטית בזמן חירום — מוגבלת?',
      'פיקוח כנסת על הכרזות חירום',
      'פסקת ההתגברות וסמכויות חירום'
    ],
    realCases: [
      {
        id: 'public-committee-torture',
        name: 'בג"ץ 5100/94 הוועד הציבורי נגד שב"כ',
        year: '1999',
        court: 'בג"ץ מורחב',
        principle: 'איסור עינויים גם בחירום',
        outcome: 'אין הרשאה מוחלטת לעינויים',
        significance: 'גבולות ביטחון לאומי מול כבוד האדם',
        relevantLaw: ['חוק יסוד: כבוד האדם וחירותו', 'אמנת האו"ם נגד עינויים']
      },
      {
        id: 'separation-barrier',
        name: 'בג"ץ 2056/04 ביל\'ין נגד שר הביטחון',
        year: '2006',
        court: 'בג"ץ',
        principle: 'ביקורת על פעולות ביטחוניות',
        outcome: 'שינוי מסלול גדר ההפרדה',
        significance: 'ביקורת שיפוטית גם על מהלכים ביטחוניים',
        relevantLaw: ['תקנות ג\'נבה; דיני הכיבוש']
      }
    ],
    practicalScenarios: [
      {
        id: 'emergency-regulations-abuse',
        title: 'תקנות חירום לא מדינתיות',
        situation: 'ממשלה משתמשת בתקנות חירום לטיפול בסכסוך עבודה פנים-כלכלי',
        conflictingSources: [
          { source: 'סמכות חירום חוקית', position: 'ממשלה רשאית', strength: 2 },
          { source: 'מטרת תקנות החירום', position: 'נועדו לאיומים ביטחוניים', strength: 5 }
        ],
        correctApproach: 'חריגה ממטרת הסמכות — אולטרא ויירס',
        reasoning: 'תקנות חירום נועדו לאיומים על ביטחון — לא לסכסוכי עבודה',
        difficulty: 'expert',
        practicalTips: [
          'בחן תכלית הסמכות המקורית',
          'הוכח שימוש לרעה בסמכות',
          'עתור לבג"ץ בדחיפות'
        ]
      }
    ],
    complexities: [
      'מי מגדיר "מצב חירום"?',
      'כמה זמן יכול חירום להימשך?',
      'פיקוח על שב"כ ויחידות מסווגות',
      'ביקורת שיפוטית בזמן אמת של מלחמה'
    ],
    modernImplications: [
      'הלקחים ממגפת הקורונה — סמכויות מדינה בחירום',
      'ביקורת בג"ץ על מבצעים צבאיים עכשוויים',
      'דיון: האם לאפשר הגנה לחייל מהאישום הפלילי?',
      'פסקת ההתגברות — האם משנה מאזן חירום?'
    ],
    relatedConcepts: ['judicial-review', 'rule-of-law-accountability', 'international-vs-domestic']
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
  /** אופציונלי — כשלא מועבר (כמו מדף מקורות המשפט), התרחיש יוצג בדיאלוג מקומי */
  onStartScenario?: (scenario: PracticalScenario, conceptId: string) => void;
  onViewCase?: (caseItem: RealCase) => void;
}

export const AdvancedLegalConcepts: React.FC<AdvancedLegalConceptsProps> = ({
  onStartScenario,
  onViewCase,
}) => {
  const [selectedConcept, setSelectedConcept] = useState<AdvancedConcept | null>(null);
  const [selectedTab, setSelectedTab] = useState(0);
  const [activeStep, setActiveStep] = useState(0);
  const [scenarioPreview, setScenarioPreview] = useState<{
    scenario: PracticalScenario;
    conceptId: string;
  } | null>(null);

  const handleStartScenario = (
    scenario: PracticalScenario,
    conceptId: string,
    closeConceptDialog = false,
  ) => {
    if (onStartScenario) {
      onStartScenario(scenario, conceptId);
      if (closeConceptDialog) setSelectedConcept(null);
      return;
    }
    if (closeConceptDialog) setSelectedConcept(null);
    setScenarioPreview({ scenario, conceptId });
  };

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
                            handleStartScenario(concept.practicalScenarios[0], concept.id);
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
                                onClick={() => handleStartScenario(scenario, concept.id)}
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
                          sx={{ p: 2, cursor: onViewCase ? 'pointer' : 'default' }}
                          onClick={onViewCase ? () => onViewCase(caseItem) : undefined}
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
                    handleStartScenario(
                      selectedConcept.practicalScenarios[0],
                      selectedConcept.id,
                      true,
                    );
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

      <Dialog
        open={!!scenarioPreview}
        onClose={() => setScenarioPreview(null)}
        maxWidth="md"
        fullWidth
      >
        {scenarioPreview && (
          <>
            <DialogTitle>
              <Typography variant="h6">{scenarioPreview.scenario.title}</Typography>
              <Typography variant="caption" color="text.secondary" display="block">
                סיכום התרחיש: המצב, גישה מוצעת, נימוק וטיפים לתרגול
              </Typography>
            </DialogTitle>
            <DialogContent>
              <Typography variant="body1" paragraph>
                <strong>המצב:</strong> {scenarioPreview.scenario.situation}
              </Typography>
              <Alert severity="success" sx={{ mb: 2 }}>
                <Typography variant="body2">
                  <strong>גישה נכונה:</strong> {scenarioPreview.scenario.correctApproach}
                </Typography>
              </Alert>
              <Typography variant="body2" paragraph>
                <strong>נימוק:</strong> {scenarioPreview.scenario.reasoning}
              </Typography>
              <Box mb={2}>
                <DifficultyMeter difficulty={scenarioPreview.scenario.difficulty} />
              </Box>
              {scenarioPreview.scenario.conflictingSources.length > 0 && (
                <Typography variant="subtitle2" gutterBottom>
                  מקורות בסתירה
                </Typography>
              )}
              {scenarioPreview.scenario.conflictingSources.map((cs, i) => (
                <Paper key={i} variant="outlined" sx={{ p: 1.5, mb: 1 }}>
                  <Typography variant="body2" fontWeight="bold">
                    {cs.source}
                  </Typography>
                  <Typography variant="body2">{cs.position}</Typography>
                </Paper>
              ))}
              <Typography variant="subtitle2" gutterBottom sx={{ mt: 2 }}>
                טיפים מעשיים
              </Typography>
              <List dense>
                {scenarioPreview.scenario.practicalTips.map((tip, idx) => (
                  <ListItem key={idx}>
                    <ListItemIcon>
                      <CheckIcon color="success" />
                    </ListItemIcon>
                    <ListItemText primary={tip} />
                  </ListItem>
                ))}
              </List>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setScenarioPreview(null)}>סגור</Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
};

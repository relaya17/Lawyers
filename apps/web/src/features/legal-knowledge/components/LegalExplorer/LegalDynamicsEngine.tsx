import React, { useCallback, useState } from 'react';
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
  Rating,
  Slider,
  Switch,
  FormControlLabel
} from '@mui/material';
import { 
  ExpandMore as ExpandIcon,
  Close as CloseIcon,
  MenuBook as BookIcon,
  Public as GlobalIcon,
  Psychology as PhilosophyIcon,
  AdminPanelSettings as AdminIcon,
  Balance as BalanceIcon,
  TrendingUp as TrendIcon,
  Security as SecurityIcon,
  Warning as WarningIcon,
  CheckCircle as CheckIcon,
  Info as InfoIcon,
  PlayArrow as PlayIcon,
  CompareArrows as CompareIcon,
  DeviceHub as NetworkIcon,
  AutoGraph as DynamicIcon,
  Shield as ProtectionIcon,
  Layers as LayersIcon
} from '@mui/icons-material';

interface LegalPrinciple {
  id: string;
  name: string;
  category: 'subsidiarity' | 'hierarchy' | 'fundamental-rights' | 'conflict-resolution' | 'executive-control' | 'dynamic-legislation' | 'international-influence' | 'doctrines' | 'codification';
  description: string;
  strength: number; // 1-10
  applications: string[];
  limitations: string[];
  interactions: PrincipleInteraction[];
  modernChallenges: string[];
  realWorldScenarios: ConflictScenario[];
}

interface PrincipleInteraction {
  targetPrincipleId: string;
  relationship: 'supports' | 'conflicts' | 'balances' | 'overrides' | 'complements';
  strength: number; // 1-5
  description: string;
}

interface ConflictScenario {
  id: string;
  title: string;
  description: string;
  involvedSources: SourceInConflict[];
  resolutionMechanism: string;
  outcome: string;
  precedentValue: number; // 1-5
  modernRelevance: string;
}

interface SourceInConflict {
  sourceType: 'basic-law' | 'regular-law' | 'regulation' | 'precedent' | 'custom' | 'international' | 'administrative';
  position: string;
  strength: number;
  legalBasis: string;
}

interface BalancingTest {
  name: string;
  description: string;
  steps: string[];
  applicableTo: string[];
  effectiveness: number;
  limitations: string[];
}

const legalPrinciples: LegalPrinciple[] = [
  {
    id: 'subsidiarity',
    name: 'עקרון הסובסידיאריות',
    category: 'subsidiarity',
    description: 'חובת הרשויות הציבוריות לפעול בצורה מינימלית - לא להתערב יותר מהנדרש',
    strength: 8,
    applications: [
      'ביקורת על פעולות מנהליות מיותרות',
      'הגנה על זכויות פרט מול אינטרס ציבורי',
      'מבחן הפגיעה המידתית',
      'עקרון האמצעי הפחות פוגעני'
    ],
    limitations: [
      'לא חל במצבי חירום',
      'מוגבל כאשר יש אינטרס ציבורי דחוף',
      'תלוי בפרשנות של "מינימלי"'
    ],
    interactions: [
      {
        targetPrincipleId: 'fundamental-rights',
        relationship: 'supports',
        strength: 5,
        description: 'חיזוק זכויות יסוד באמצעות הגבלת התערבות מדינה'
      },
      {
        targetPrincipleId: 'executive-control',
        relationship: 'balances',
        strength: 4,
        description: 'איזון בין יעילות מנהלית לזכויות פרט'
      }
    ],
    modernChallenges: [
      'איזון בין ביטחון לחירות בעידן הטרור',
      'הגבלות קורונה מול זכויות חוקתיות',
      'רגולציה טכנולוגית מול חדשנות',
      'שיקולי סביבה מול זכויות קניין'
    ],
    realWorldScenarios: [
      {
        id: 'lockdown-restrictions',
        title: 'הגבלות סגר מול חופש תנועה',
        description: 'הממשלה הטילה סגר כללי, אזרחים עותרים על פגיעה בחופש התנועה',
        involvedSources: [
          {
            sourceType: 'regular-law',
            position: 'מתיר הגבלות בחירום',
            strength: 4,
            legalBasis: 'חוק שעת חירום'
          },
          {
            sourceType: 'basic-law',
            position: 'מגן על חופש תנועה',
            strength: 5,
            legalBasis: 'חוק יסוד: כבוד האדם וחירותו'
          }
        ],
        resolutionMechanism: 'מבחן הפגיעה המידתית + עקרון הסובסידיאריות',
        outcome: 'הגבלות מותרות אך חייבות להיות מידתיות וזמניות',
        precedentValue: 4,
        modernRelevance: 'קובע תקדים לאיזון בין בריאות הציבור לזכויות יסוד'
      }
    ]
  },
  {
    id: 'internal-hierarchy',
    name: 'היררכיה פנימית במשפט הישראלי',
    category: 'hierarchy',
    description: 'מערכת יחסים מובנית בין מקורות משפט שונים הקובעת עדיפויות בסתירה',
    strength: 9,
    applications: [
      'פתרון סתירות בין חוקים',
      'קביעת מקור המשפט החל',
      'הנחיה לפרשנות משפטית',
      'יצירת יציבות נורמטיבית'
    ],
    limitations: [
      'לא תמיד ברורה בגבולות',
      'משתנה לפי הקשר ונסיבות',
      'השפעת פרשנות שיפוטית'
    ],
    interactions: [
      {
        targetPrincipleId: 'fundamental-rights',
        relationship: 'complements',
        strength: 4,
        description: 'חוקי יסוד בראש ההיררכיה מחזקים זכויות'
      },
      {
        targetPrincipleId: 'conflict-resolution',
        relationship: 'supports',
        strength: 5,
        description: 'מספק כלים לפתרון סתירות נורמטיביות'
      }
    ],
    modernChallenges: [
      'סתירות בין חוקי יסוד שונים',
      'מקום הפסיקה בהיררכיה',
      'השפעת משפט בינלאומי',
      'התפתחות נורמות חדשות'
    ],
    realWorldScenarios: [
      {
        id: 'regulation-contradicts-law',
        title: 'תקנה סותרת חוק',
        description: 'תקנת שר הבריאות מתירה דבר שחוק הבריאות אוסר',
        involvedSources: [
          {
            sourceType: 'regular-law',
            position: 'אוסר את הפעולה',
            strength: 5,
            legalBasis: 'חוק הבריאות הציבורית'
          },
          {
            sourceType: 'regulation',
            position: 'מתיר את הפעולה',
            strength: 2,
            legalBasis: 'תקנת שר הבריאות'
          }
        ],
        resolutionMechanism: 'עקרון עליונות החוק על התקנה',
        outcome: 'התקנה בטלה מחמת סתירה לחוק',
        precedentValue: 5,
        modernRelevance: 'חיזוק עקרון חוקיות המנהל'
      }
    ]
  },
  {
    id: 'fundamental-rights',
    name: 'זכויות יסוד והשפעתן',
    category: 'fundamental-rights',
    description: 'זכויות חוקתיות המוגנות על ידי חוקי יסוד ופסיקה ומשפיעות על כל מקורות המשפט',
    strength: 10,
    applications: [
      'ביקורת חוקתיות של חקיקה',
      'פרשנות חוקים בהתאם לזכויות',
      'הגבלת פעולות מנהליות',
      'יצירת חובות חיוביות למדינה'
    ],
    limitations: [
      'עדיין ניתנות להגבלה בתנאים',
      'איזון מול אינטרסים ציבוריים',
      'תלויות בפרשנות שיפוטית'
    ],
    interactions: [
      {
        targetPrincipleId: 'subsidiarity',
        relationship: 'supports',
        strength: 5,
        description: 'דורש התערבות מינימלית ברכויות'
      },
      {
        targetPrincipleId: 'international-influence',
        relationship: 'complements',
        strength: 4,
        description: 'מושפע ממשפט זכויות אדם בינלאומי'
      }
    ],
    modernChallenges: [
      'איזון בין ביטחון לחירות',
      'זכויות דיגיטליות ופרטיות',
      'זכויות קולקטיביות מול אישיות',
      'זכויות חברתיות וכלכליות'
    ],
    realWorldScenarios: [
      {
        id: 'freedom-of-speech-limits',
        title: 'גבולות חופש הביטוי',
        description: 'חוק אוסר הסתה, אך עיתונאי טוען לפגיעה בחופש העיתונות',
        involvedSources: [
          {
            sourceType: 'regular-law',
            position: 'אוסר הסתה',
            strength: 4,
            legalBasis: 'חוק מניעת הסתה'
          },
          {
            sourceType: 'basic-law',
            position: 'מגן על חופש ביטוי',
            strength: 5,
            legalBasis: 'חוק יסוד: כבוד האדם וחירותו'
          }
        ],
        resolutionMechanism: 'מבחן הפגיעה המידתית',
        outcome: 'איזון בין חופש ביטוי למניעת נזק',
        precedentValue: 5,
        modernRelevance: 'רלוונטי לרשתות חברתיות ותקשורת דיגיטלית'
      }
    ]
  },
  {
    id: 'conflict-resolution',
    name: 'ניהול סכסוכים בין מקורות',
    category: 'conflict-resolution',
    description: 'מנגנונים לפתרון סתירות בין מקורות משפט שונים באמצעות היררכיה ופרשנות',
    strength: 8,
    applications: [
      'פתרון סתירות נורמטיביות',
      'פרשנות מערכתית של החוק',
      'יישום עקרון החוק העליון',
      'איזון בין אינטרסים סותרים'
    ],
    limitations: [
      'לא תמיד יש פתרון ברור',
      'תלוי בפרשנות שיפוטית',
      'עלול ליצור אי-ודאות'
    ],
    interactions: [
      {
        targetPrincipleId: 'internal-hierarchy',
        relationship: 'supports',
        strength: 5,
        description: 'משתמש בהיררכיה לפתרון סתירות'
      },
      {
        targetPrincipleId: 'dynamic-legislation',
        relationship: 'balances',
        strength: 3,
        description: 'איזון בין יציבות לגמישות'
      }
    ],
    modernChallenges: [
      'סתירות בין חוקי יסוד',
      'משפט בינלאומי מול מקומי',
      'טכנולוגיה מול חקיקה ישנה',
      'זכויות קולקטיביות מול אישיות'
    ],
    realWorldScenarios: [
      {
        id: 'old-law-modern-reality',
        title: 'חוק ישן מול מציאות מודרנית',
        description: 'חוק מימי המנדט מתנגש עם טכנולוגיה מודרנית',
        involvedSources: [
          {
            sourceType: 'regular-law',
            position: 'חוק ישן לא מכיר בטכנולוגיה',
            strength: 3,
            legalBasis: 'חקיקת מנדט'
          },
          {
            sourceType: 'precedent',
            position: 'פרשנות מודרנית',
            strength: 4,
            legalBasis: 'פסיקה עדכנית'
          }
        ],
        resolutionMechanism: 'פרשנות דינמית ותכליתית',
        outcome: 'התאמת החוק למציאות המודרנית',
        precedentValue: 4,
        modernRelevance: 'חשוב לעידן הדיגיטלי והטכנולוגיה'
      }
    ]
  },
  {
    id: 'executive-control',
    name: 'מנגנוני בקרה על הרשות המבצעת',
    category: 'executive-control',
    description: 'כלים שיפוטיים לביקורת על פעולות הממשלה ומניעת עודף כוח מנהלי',
    strength: 7,
    applications: [
      'ביקורת על תקנות ופעולות מנהליות',
      'פסיקה מחייבת נגד רשויות',
      'הבטחת חוקיות המנהל',
      'הגנה על זכויות פרט'
    ],
    limitations: [
      'לא התערבות בשיקול דעת מקצועי',
      'הכרה בסמכות מנהלית',
      'הפרדת רשויות'
    ],
    interactions: [
      {
        targetPrincipleId: 'subsidiarity',
        relationship: 'balances',
        strength: 4,
        description: 'איזון בין יעילות מנהלית לזכויות'
      },
      {
        targetPrincipleId: 'fundamental-rights',
        relationship: 'supports',
        strength: 5,
        description: 'מגן על זכויות יסוד מפני פגיעה מנהלית'
      }
    ],
    modernChallenges: [
      'ממשל דיגיטלי ואלגוריתמים',
      'החלטות אוטומטיות',
      'בינה מלאכותית במינהל',
      'שקיפות מול יעילות'
    ],
    realWorldScenarios: [
      {
        id: 'unreasonable-administrative-decision',
        title: 'החלטה מנהלית בלתי סבירה',
        description: 'עירייה דוחה בקשת רישוי מטעמים שאינם קשורים לתחום',
        involvedSources: [
          {
            sourceType: 'administrative',
            position: 'דחיית הבקשה',
            strength: 2,
            legalBasis: 'החלטת עירייה'
          },
          {
            sourceType: 'precedent',
            position: 'עקרון הסבירות',
            strength: 5,
            legalBasis: 'פסיקת בג"ץ'
          }
        ],
        resolutionMechanism: 'מבחן הסבירות הקיצונית',
        outcome: 'ביטול ההחלטה והחזרה לדיון',
        precedentValue: 4,
        modernRelevance: 'חשוב לביקורת על רשויות מקומיות'
      }
    ]
  }
];

const balancingTests: BalancingTest[] = [
  {
    name: 'מבחן הפגיעה המידתית',
    description: 'בחינה שלבית של הגבלות זכויות יסוד',
    steps: [
      '1. בחינת מטרה ראויה',
      '2. קשר רציונלי בין אמצעי למטרה', 
      '3. פגיעה במידה הנמוכה ביותר',
      '4. איזון כולל - יחס הולם בין התועלת לנזק'
    ],
    applicableTo: [
      'הגבלות על זכויות יסוד',
      'חקיקה עם פסקת הגבלה',
      'פעולות מנהליות פוגעניות'
    ],
    effectiveness: 9,
    limitations: [
      'סובייקטיבי במידה מסוימת',
      'תלוי בהרכב בית המשפט',
      'קשה ליישום במקרים דחופים'
    ]
  },
  {
    name: 'מבחן הסבירות הקיצונית',
    description: 'בחינה אם החלטה מנהלית חרגה מגבול הסבירות',
    steps: [
      '1. בחינת הסמכות החוקית',
      '2. זיהוי השיקולים שנלקחו בחשבון',
      '3. בדיקת שיקולים זרים',
      '4. הערכת הסבירות הכוללת'
    ],
    applicableTo: [
      'החלטות מנהליות',
      'פעולות רשויות מקומיות',
      'החלטות גופים ציבוריים'
    ],
    effectiveness: 7,
    limitations: [
      'רף גבוה להתערבות',
      'כבוד לשיקול דעת מנהלי',
      'קושי בהוכחת אי-סבירות'
    ]
  },
  {
    name: 'מבחן האינטרס הציבורי',
    description: 'איזון בין אינטרסים פרטיים לציבוריים',
    steps: [
      '1. זיהוי האינטרס הציבורי',
      '2. הערכת חשיבות האינטרס הפרטי',
      '3. בחינת חלופות פחות פוגעניות',
      '4. איזון כולל של האינטרסים'
    ],
    applicableTo: [
      'הפקעות קרקע',
      'הגבלות סביבתיות',
      'רגולציה כלכלית'
    ],
    effectiveness: 6,
    limitations: [
      'קושי בכימות אינטרסים',
      'השפעת שיקולים פוליטיים',
      'אי-ודאות בתוצאות'
    ]
  }
];

interface LegalDynamicsEngineProps {
  /** כשלא מועבר (מדף מקורות המשפט) — נפתח דיאלוג סימולציה מקומי */
  onStartSimulation?: (scenario: ConflictScenario) => void;
  onExploreInteraction?: (principleId: string, targetId: string) => void;
}

export const LegalDynamicsEngine: React.FC<LegalDynamicsEngineProps> = ({
  onStartSimulation,
  onExploreInteraction: _onExploreInteraction,
}) => {
  const [selectedPrinciple, setSelectedPrinciple] = useState<LegalPrinciple | null>(null);
  const [selectedTab, setSelectedTab] = useState(0);
  const [simulationMode, setSimulationMode] = useState(false);
  const [complexityLevel, setComplexityLevel] = useState(5);
  const [showInteractions, setShowInteractions] = useState(true);
  const [localSimulationScenario, setLocalSimulationScenario] = useState<ConflictScenario | null>(null);

  const runSimulation = useCallback(
    (scenario: ConflictScenario) => {
      if (onStartSimulation) {
        onStartSimulation(scenario);
      } else {
        setLocalSimulationScenario(scenario);
      }
    },
    [onStartSimulation],
  );

  const getPrincipleColor = (category: string) => {
    const colors = {
      'subsidiarity': '#4caf50',
      'hierarchy': '#2196f3', 
      'fundamental-rights': '#f44336',
      'conflict-resolution': '#ff9800',
      'executive-control': '#9c27b0',
      'dynamic-legislation': '#00bcd4',
      'international-influence': '#607d8b',
      'doctrines': '#795548',
      'codification': '#ffc107'
    };
    return colors[category as keyof typeof colors] || '#9e9e9e';
  };

  const getCategoryIcon = (category: string) => {
    const icons = {
      'subsidiarity': <ProtectionIcon />,
      'hierarchy': <LayersIcon />,
      'fundamental-rights': <SecurityIcon />,
      'conflict-resolution': <CompareIcon />,
      'executive-control': <AdminIcon />,
      'dynamic-legislation': <DynamicIcon />,
      'international-influence': <GlobalIcon />,
      'doctrines': <PhilosophyIcon />,
      'codification': <BookIcon />
    };
    return icons[category as keyof typeof icons] || <InfoIcon />;
  };

  const getCategoryLabel = (category: string) => {
    const labels = {
      'subsidiarity': 'סובסידיאריות',
      'hierarchy': 'היררכיה',
      'fundamental-rights': 'זכויות יסוד',
      'conflict-resolution': 'פתרון סכסוכים',
      'executive-control': 'בקרת רשות מבצעת',
      'dynamic-legislation': 'חקיקה דינמית',
      'international-influence': 'השפעה בינלאומית',
      'doctrines': 'דוקטרינות',
      'codification': 'קודיפיקציה'
    };
    return labels[category as keyof typeof labels] || 'כללי';
  };

  const getRelationshipIcon = (relationship: string) => {
    switch (relationship) {
      case 'supports': return '🤝';
      case 'conflicts': return '⚔️';
      case 'balances': return '⚖️';
      case 'overrides': return '🔝';
      case 'complements': return '🔗';
      default: return '🔄';
    }
  };

  const getStrengthColor = (strength: number) => {
    if (strength >= 8) return '#4caf50';
    if (strength >= 6) return '#ff9800';
    if (strength >= 4) return '#2196f3';
    return '#f44336';
  };

  const TabPanel = ({ children, value, index }: any) => (
    <div hidden={value !== index}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );

  const InteractionNetwork = () => (
    <Box sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom color="primary">
        🕸️ רשת יחסים בין עקרונות משפטיים
      </Typography>
      
      <Box display="flex" gap={2} mb={3}>
        <FormControlLabel
          control={
            <Switch 
              checked={showInteractions} 
              onChange={(e) => setShowInteractions(e.target.checked)}
            />
          }
          label="הצג קשרים"
        />
        
        <Box sx={{ width: 200 }}>
          <Typography variant="caption">רמת מורכבות</Typography>
          <Slider
            value={complexityLevel}
            onChange={(_, value) => setComplexityLevel(value as number)}
            min={1}
            max={10}
            step={1}
            marks
            valueLabelDisplay="auto"
          />
        </Box>
      </Box>

      <Grid container spacing={3}>
        {legalPrinciples
          .filter(p => p.strength >= (10 - complexityLevel))
          .map(principle => (
            <Grid item xs={12} sm={6} md={4} key={principle.id}>
              <Card 
                elevation={3}
                sx={{ 
                  border: `3px solid ${getPrincipleColor(principle.category)}`,
                  position: 'relative',
                  '&:hover': { transform: 'scale(1.02)', transition: 'all 0.3s' }
                }}
              >
                <CardContent>
                  <Box display="flex" alignItems="center" gap={2} mb={2}>
                    {getCategoryIcon(principle.category)}
                    <Box>
                      <Typography variant="h6" fontWeight="bold">
                        {principle.name}
                      </Typography>
                      <Chip 
                        label={getCategoryLabel(principle.category)}
                        size="small"
                        sx={{ backgroundColor: getPrincipleColor(principle.category), color: 'white' }}
                      />
                    </Box>
                  </Box>
                  
                  <Typography variant="body2" paragraph>
                    {principle.description}
                  </Typography>
                  
                  <Box display="flex" alignItems="center" gap={1} mb={2}>
                    <Typography variant="caption">עוצמה:</Typography>
                    <LinearProgress 
                      variant="determinate" 
                      value={principle.strength * 10}
                      sx={{ 
                        width: 60, 
                        height: 8,
                        '& .MuiLinearProgress-bar': {
                          backgroundColor: getStrengthColor(principle.strength)
                        }
                      }}
                    />
                    <Typography variant="caption" fontWeight="bold">
                      {principle.strength}/10
                    </Typography>
                  </Box>

                  {showInteractions && principle.interactions.length > 0 && (
                    <Box>
                      <Typography variant="caption" color="primary" gutterBottom>
                        קשרים:
                      </Typography>
                      {principle.interactions.slice(0, 2).map((interaction, idx) => {
                        const targetPrinciple = legalPrinciples.find(p => p.id === interaction.targetPrincipleId);
                        return (
                          <Box key={idx} display="flex" alignItems="center" gap={1} mb={1}>
                            <span>{getRelationshipIcon(interaction.relationship)}</span>
                            <Typography variant="caption">
                              {targetPrinciple?.name}
                            </Typography>
                            <Rating value={interaction.strength} max={5} size="small" readOnly />
                          </Box>
                        );
                      })}
                    </Box>
                  )}
                  
                  <Box mt={2}>
                    <Button 
                      size="small" 
                      variant="contained"
                      onClick={() => setSelectedPrinciple(principle)}
                      sx={{ backgroundColor: getPrincipleColor(principle.category) }}
                    >
                      חקור
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
      </Grid>
    </Box>
  );

  const ConflictSimulator = () => (
    <Box sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom color="primary">
        ⚔️ סימולטור קונפליקטים משפטיים
      </Typography>
      
      <Alert severity="info" sx={{ mb: 3 }}>
        <Typography variant="body2">
          בחר תרחיש קונפליקט כדי לחקור כיצד המערכת המשפטית פותרת סתירות בין מקורות שונים
        </Typography>
      </Alert>

      <Grid container spacing={3}>
        {legalPrinciples
          .filter(p => p.realWorldScenarios.length > 0)
          .map(principle => (
            <Grid item xs={12} md={6} key={principle.id}>
              <Card elevation={2}>
                <CardContent>
                  <Typography variant="h6" gutterBottom color="primary">
                    {principle.name}
                  </Typography>
                  
                  {principle.realWorldScenarios.map(scenario => (
                    <Paper key={scenario.id} elevation={1} sx={{ p: 2, mb: 2 }}>
                      <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                        {scenario.title}
                      </Typography>
                      
                      <Typography variant="body2" paragraph>
                        {scenario.description}
                      </Typography>
                      
                      <Box mb={2}>
                        <Typography variant="caption" color="warning.main" gutterBottom>
                          מקורות סותרים:
                        </Typography>
                        {scenario.involvedSources.map((source, idx) => (
                          <Box key={idx} display="flex" alignItems="center" gap={1} mt={1}>
                            <Chip 
                              label={source.sourceType}
                              size="small"
                              variant="outlined"
                            />
                            <Typography variant="caption">
                              {source.position}
                            </Typography>
                            <Rating value={source.strength} max={5} size="small" readOnly />
                          </Box>
                        ))}
                      </Box>
                      
                      <Alert severity="success" sx={{ mb: 2 }}>
                        <Typography variant="body2">
                          <strong>מנגנון פתרון:</strong> {scenario.resolutionMechanism}
                        </Typography>
                      </Alert>
                      
                      <Typography variant="body2" paragraph>
                        <strong>תוצאה:</strong> {scenario.outcome}
                      </Typography>
                      
                      <Box display="flex" alignItems="center" gap={2} mb={2}>
                        <Box display="flex" alignItems="center" gap={1}>
                          <Typography variant="caption">ערך תקדימי:</Typography>
                          <Rating value={scenario.precedentValue} max={5} size="small" readOnly />
                        </Box>
                      </Box>
                      
                      <Typography variant="caption" color="text.secondary" display="block" mb={2}>
                        רלוונטיות מודרנית: {scenario.modernRelevance}
                      </Typography>
                      
                      <Button
                        variant="contained"
                        size="small"
                        startIcon={<PlayIcon />}
                        onClick={() => runSimulation(scenario)}
                        sx={{ backgroundColor: getPrincipleColor(principle.category) }}
                      >
                        התחל סימולציה
                      </Button>
                    </Paper>
                  ))}
                </CardContent>
              </Card>
            </Grid>
          ))}
      </Grid>
    </Box>
  );

  const BalancingMechanisms = () => (
    <Box sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom color="primary">
        ⚖️ מנגנוני איזון משפטיים
      </Typography>
      
      <Typography variant="body2" color="text.secondary" paragraph>
        כלים שפותחו על ידי בית המשפט לאיזון בין ערכים ואינטרסים סותרים
      </Typography>

      <Grid container spacing={3}>
        {balancingTests.map((test, index) => (
          <Grid item xs={12} md={6} key={index}>
            <Card elevation={2} sx={{ height: '100%' }}>
              <CardContent>
                <Box display="flex" alignItems="center" gap={2} mb={2}>
                  <Avatar sx={{ bgcolor: `hsl(${index * 60}, 70%, 50%)` }}>
                    <BalanceIcon />
                  </Avatar>
                  <Typography variant="h6" fontWeight="bold">
                    {test.name}
                  </Typography>
                </Box>
                
                <Typography variant="body2" paragraph>
                  {test.description}
                </Typography>
                
                <Box mb={2}>
                  <Typography variant="subtitle2" gutterBottom>
                    🎯 שלבי המבחן:
                  </Typography>
                  <List dense>
                    {test.steps.map((step, idx) => (
                      <ListItem key={idx} sx={{ pl: 0 }}>
                        <ListItemText 
                          primary={step}
                          primaryTypographyProps={{ variant: 'body2' }}
                        />
                      </ListItem>
                    ))}
                  </List>
                </Box>
                
                <Box mb={2}>
                  <Typography variant="subtitle2" gutterBottom>
                    📋 תחומי יישום:
                  </Typography>
                  <Box display="flex" flexWrap="wrap" gap={1}>
                    {test.applicableTo.map((area, idx) => (
                      <Chip 
                        key={idx}
                        label={area}
                        size="small"
                        variant="outlined"
                      />
                    ))}
                  </Box>
                </Box>
                
                <Box display="flex" alignItems="center" gap={1} mb={2}>
                  <Typography variant="caption">יעילות:</Typography>
                  <Rating value={test.effectiveness} max={10} readOnly size="small" />
                  <Typography variant="caption">
                    {test.effectiveness}/10
                  </Typography>
                </Box>
                
                <Accordion>
                  <AccordionSummary expandIcon={<ExpandIcon />}>
                    <Typography variant="caption">מגבלות המבחן</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <List dense>
                      {test.limitations.map((limitation, idx) => (
                        <ListItem key={idx}>
                          <ListItemIcon>
                            <WarningIcon color="warning" fontSize="small" />
                          </ListItemIcon>
                          <ListItemText 
                            primary={limitation}
                            primaryTypographyProps={{ variant: 'body2' }}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </AccordionDetails>
                </Accordion>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );

  return (
    <Box sx={{ maxWidth: 1400, margin: 'auto', p: 2 }}>
      {/* כותרת */}
      <Card sx={{ mb: 3, background: 'linear-gradient(135deg, #673ab7 0%, #3f51b5 100%)', color: 'white' }}>
        <CardHeader
          title={
            <Typography variant="h4" sx={{ fontWeight: 'bold', textAlign: 'center' }}>
              🔬 מנוע הדינמיקה המשפטית
            </Typography>
          }
          subheader={
            <Typography variant="h6" sx={{ textAlign: 'center', opacity: 0.9 }}>
              חקור יחסים, קונפליקטים ומנגנוני איזון במערכת המשפט הישראלית
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
              icon={<NetworkIcon />} 
              label="רשת יחסים" 
            />
            <Tab 
              icon={<CompareIcon />} 
              label="סימולטור קונפליקטים" 
            />
            <Tab 
              icon={<BalanceIcon />} 
              label="מנגנוני איזון" 
            />
          </Tabs>
        </Box>

        {/* טאב רשת יחסים */}
        <TabPanel value={selectedTab} index={0}>
          <InteractionNetwork />
        </TabPanel>

        {/* טאב סימולטור קונפליקטים */}
        <TabPanel value={selectedTab} index={1}>
          <ConflictSimulator />
        </TabPanel>

        {/* טאב מנגנוני איזון */}
        <TabPanel value={selectedTab} index={2}>
          <BalancingMechanisms />
        </TabPanel>
      </Card>

      {/* דיאלוג עקרון מפורט */}
      <Dialog 
        open={!!selectedPrinciple} 
        onClose={() => setSelectedPrinciple(null)}
        maxWidth="lg"
        fullWidth
      >
        {selectedPrinciple && (
          <>
            <DialogTitle>
              <Box display="flex" justifyContent="between" alignItems="center">
                <Box display="flex" alignItems="center" gap={2}>
                  {getCategoryIcon(selectedPrinciple.category)}
                  <Box>
                    <Typography variant="h5" fontWeight="bold">
                      {selectedPrinciple.name}
                    </Typography>
                    <Chip 
                      label={getCategoryLabel(selectedPrinciple.category)}
                      size="small"
                      sx={{ backgroundColor: getPrincipleColor(selectedPrinciple.category), color: 'white' }}
                    />
                  </Box>
                </Box>
                <IconButton onClick={() => setSelectedPrinciple(null)}>
                  <CloseIcon />
                </IconButton>
              </Box>
            </DialogTitle>
            
            <DialogContent>
              <Typography variant="body1" paragraph>
                {selectedPrinciple.description}
              </Typography>

              <Box display="flex" alignItems="center" gap={2} mb={3}>
                <Typography variant="h6">עוצמת השפעה:</Typography>
                <LinearProgress 
                  variant="determinate" 
                  value={selectedPrinciple.strength * 10}
                  sx={{ 
                    width: 100, 
                    height: 10,
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: getStrengthColor(selectedPrinciple.strength)
                    }
                  }}
                />
                <Typography variant="h6" color={getStrengthColor(selectedPrinciple.strength)}>
                  {selectedPrinciple.strength}/10
                </Typography>
              </Box>

              <Accordion defaultExpanded>
                <AccordionSummary expandIcon={<ExpandIcon />}>
                  <Typography variant="h6">💼 תחומי יישום</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <List>
                    {selectedPrinciple.applications.map((application, index) => (
                      <ListItem key={index}>
                        <ListItemIcon>
                          <CheckIcon color="success" />
                        </ListItemIcon>
                        <ListItemText primary={application} />
                      </ListItem>
                    ))}
                  </List>
                </AccordionDetails>
              </Accordion>

              <Accordion>
                <AccordionSummary expandIcon={<ExpandIcon />}>
                  <Typography variant="h6">🔗 יחסים עם עקרונות אחרים</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Grid container spacing={2}>
                    {selectedPrinciple.interactions.map((interaction, index) => {
                      const targetPrinciple = legalPrinciples.find(p => p.id === interaction.targetPrincipleId);
                      return (
                        <Grid item xs={12} md={6} key={index}>
                          <Paper elevation={1} sx={{ p: 2 }}>
                            <Box display="flex" alignItems="center" gap={1} mb={1}>
                              <Box component="span" sx={{ fontSize: '1.5rem' }}>
                                {getRelationshipIcon(interaction.relationship)}
                              </Box>
                              <Typography variant="subtitle1" fontWeight="bold">
                                {targetPrinciple?.name}
                              </Typography>
                            </Box>
                            <Typography variant="body2" paragraph>
                              {interaction.description}
                            </Typography>
                            <Box display="flex" alignItems="center" gap={1}>
                              <Typography variant="caption">עוצמת קשר:</Typography>
                              <Rating value={interaction.strength} max={5} size="small" readOnly />
                            </Box>
                          </Paper>
                        </Grid>
                      );
                    })}
                  </Grid>
                </AccordionDetails>
              </Accordion>

              <Accordion>
                <AccordionSummary expandIcon={<ExpandIcon />}>
                  <Typography variant="h6">⚠️ מגבלות ואתגרים</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <List>
                    {selectedPrinciple.limitations.map((limitation, index) => (
                      <ListItem key={index}>
                        <ListItemIcon>
                          <WarningIcon color="warning" />
                        </ListItemIcon>
                        <ListItemText primary={limitation} />
                      </ListItem>
                    ))}
                  </List>
                </AccordionDetails>
              </Accordion>

              <Accordion>
                <AccordionSummary expandIcon={<ExpandIcon />}>
                  <Typography variant="h6">🚀 אתגרים מודרניים</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <List>
                    {selectedPrinciple.modernChallenges.map((challenge, index) => (
                      <ListItem key={index}>
                        <ListItemIcon>
                          <TrendIcon color="info" />
                        </ListItemIcon>
                        <ListItemText primary={challenge} />
                      </ListItem>
                    ))}
                  </List>
                </AccordionDetails>
              </Accordion>
            </DialogContent>
            
            <DialogActions>
              <Button onClick={() => setSelectedPrinciple(null)}>
                סגור
              </Button>
              {selectedPrinciple.realWorldScenarios.length > 0 && (
                <Button 
                  variant="contained" 
                  startIcon={<PlayIcon />}
                  onClick={() => {
                    runSimulation(selectedPrinciple.realWorldScenarios[0]);
                    setSelectedPrinciple(null);
                  }}
                  sx={{ backgroundColor: getPrincipleColor(selectedPrinciple.category) }}
                >
                  התחל סימולציה
                </Button>
              )}
            </DialogActions>
          </>
        )}
      </Dialog>

      <Dialog
        open={!!localSimulationScenario}
        onClose={() => setLocalSimulationScenario(null)}
        maxWidth="md"
        fullWidth
      >
        {localSimulationScenario && (
          <>
            <DialogTitle>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="h6">סימולציה: {localSimulationScenario.title}</Typography>
                <IconButton onClick={() => setLocalSimulationScenario(null)} aria-label="סגור">
                  <CloseIcon />
                </IconButton>
              </Box>
            </DialogTitle>
            <DialogContent>
              <Typography variant="body1" paragraph sx={{ lineHeight: 1.75 }}>
                {localSimulationScenario.description}
              </Typography>
              <Typography variant="caption" color="warning.main" display="block" gutterBottom>
                מקורות סותרים:
              </Typography>
              {localSimulationScenario.involvedSources.map((source, idx) => (
                <Box key={idx} display="flex" alignItems="center" gap={1} mb={1}>
                  <Chip label={source.sourceType} size="small" variant="outlined" />
                  <Typography variant="body2">{source.position}</Typography>
                  <Rating value={source.strength} max={5} size="small" readOnly />
                </Box>
              ))}
              <Alert severity="success" sx={{ my: 2 }}>
                <Typography variant="body2">
                  <strong>מנגנון פתרון:</strong> {localSimulationScenario.resolutionMechanism}
                </Typography>
              </Alert>
              <Typography variant="body2" paragraph>
                <strong>תוצאה:</strong> {localSimulationScenario.outcome}
              </Typography>
              <Box display="flex" alignItems="center" gap={1} mb={1}>
                <Typography variant="caption">ערך תקדימי:</Typography>
                <Rating value={localSimulationScenario.precedentValue} max={5} size="small" readOnly />
              </Box>
              <Typography variant="caption" color="text.secondary" display="block">
                רלוונטיות מודרנית: {localSimulationScenario.modernRelevance}
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setLocalSimulationScenario(null)} variant="contained">
                סגור
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
};

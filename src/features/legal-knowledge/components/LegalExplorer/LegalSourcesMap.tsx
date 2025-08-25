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
  Tooltip
} from '@mui/material';
import { 
  Explore as ExploreIcon,
  ExpandMore as ExpandIcon,
  Close as CloseIcon,
  PlayArrow as PlayIcon,
  School as LearnIcon,
  Quiz as QuizIcon,
  Timeline as TimelineIcon,
  AccountBalance as CourtIcon,
  Gavel as JudgeIcon,
  MenuBook as BookIcon,
  Public as GlobalIcon,
  TrendingUp as TrendIcon
} from '@mui/icons-material';

interface LegalSource {
  id: string;
  name: string;
  category: 'legislation' | 'precedent' | 'custom' | 'interpretation' | 'international' | 'principle';
  hierarchy: number; // 1 = highest
  icon: string;
  color: string;
  description: string;
  examples: string[];
  keyPrinciples: string[];
  practicalApplications: string[];
  overrides: string[]; // IDs של מקורות שהוא גובר עליהם
  overriddenBy: string[]; // IDs של מקורות שגוברים עליו
  relatedCases?: string[];
  modernRelevance: string;
  challengeScenarios: ChallengeScenario[];
}

interface ChallengeScenario {
  id: string;
  title: string;
  description: string;
  conflict: string[];
  correctAnswer: string;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

interface LegalPrinciple {
  id: string;
  name: string;
  description: string;
  applications: string[];
  limitations: string[];
  examples: string[];
  relatedSources: string[];
}

const legalSources: LegalSource[] = [
  {
    id: 'basic-laws',
    name: 'חוקי יסוד',
    category: 'legislation',
    hierarchy: 1,
    icon: '📜✨',
    color: '#d32f2f',
    description: 'חוקים בעלי מעמד על-חוקי, מהווים "חוקה חלקית" של ישראל',
    examples: [
      'חוק יסוד: כבוד האדם וחירותו',
      'חוק יסוד: הכנסת',
      'חוק יסוד: הממשלה',
      'חוק יסוד: חופש העיסוק'
    ],
    keyPrinciples: [
      'פסקת הגבלה מאפשרת ביקורת שיפוטית',
      'עליונים על חוקים רגילים',
      'מגינים על זכויות יסוד',
      'דורשים רוב מיוחד לשינוי'
    ],
    practicalApplications: [
      'עתירות לבג"ץ נגד חקיקה',
      'הגנה על זכויות אזרח',
      'ביקורת חוקתיות',
      'איזון בין זכויות לביטחון'
    ],
    overrides: ['regular-laws', 'secondary-legislation', 'customs', 'administrative-guidelines'],
    overriddenBy: [],
    relatedCases: [
      'בג"ץ 1466/07 גל נגד כנסת ישראל',
      'בג"ץ 6427/02 התנועה לאיכות השלטון'
    ],
    modernRelevance: 'מהווים את הבסיס החוקתי למדינת ישראל ומשפיעים על כל התחיקה',
    challengeScenarios: [
      {
        id: 'basic-vs-regular-1',
        title: 'חוק יסוד מול חוק רגיל',
        description: 'הכנסת חוקקה חוק המגביל הפגנות ברחבי העיר, אך התושבים טוענים לפגיעה בחופש הביטוי',
        conflict: ['חוק יסוד: כבוד האדם וחירותו', 'חוק הגבלת הפגנות'],
        correctAnswer: 'חוק יסוד: כבוד האדם וחירותו',
        explanation: 'חוק יסוד עדיף על חוק רגיל. בג"ץ יבחן אם ההגבלה עומדת במבחן הפגיעה המידתית',
        difficulty: 'medium'
      }
    ]
  },
  {
    id: 'regular-laws',
    name: 'חקיקה ראשית',
    category: 'legislation',
    hierarchy: 2,
    icon: '📜',
    color: '#1976d2',
    description: 'חוקים שנחקקו על ידי הכנסת בהליך חקיקה רגיל',
    examples: [
      'חוק החוזים',
      'חוק העונשין',
      'חוק נזיקין אזרחיים',
      'חוק הערבות'
    ],
    keyPrinciples: [
      'נחקקים על ידי הכנסת',
      'עליונים על חקיקת משנה',
      'כפופים לחוקי יסוד',
      'ניתן לשינוי ברוב רגיל'
    ],
    practicalApplications: [
      'ניהול הליכים משפטיים',
      'יעוץ משפטי',
      'ניסוח חוזים',
      'הגשת תביעות'
    ],
    overrides: ['secondary-legislation', 'customs', 'administrative-guidelines'],
    overriddenBy: ['basic-laws'],
    modernRelevance: 'מהווים את עיקר המסגרת המשפטית לחיי היומיום',
    challengeScenarios: [
      {
        id: 'regular-vs-custom-1',
        title: 'חוק רגיל מול מנהג',
        description: 'בשוק המקומי יש מנהג עתיק לחלוקת דוכנים, אך חוק חדש קובע חלוקה שונה',
        conflict: ['חוק הרישוי העסקי', 'מנהג השוק העתיק'],
        correctAnswer: 'חוק הרישוי העסקי',
        explanation: 'חקיקה ברורה גוברת על מנהג, אך בתי המשפט יחפשו דרכים לכבד המנהג במסגרת החוק',
        difficulty: 'easy'
      }
    ]
  },
  {
    id: 'binding-precedent',
    name: 'פסיקה מחייבת',
    category: 'precedent',
    hierarchy: 2,
    icon: '⚖️',
    color: '#7b1fa2',
    description: 'תקדימים של ערכאות גבוהות המחייבים ערכאות נמוכות יותר',
    examples: [
      'פס"ד קול העם - חופש הביטוי',
      'פס"ד ירדור - דמוקרטיה מהותית',
      'פס"ד צמח - איזון ביטחון וזכויות',
      'פס"ד מילר - חוקיות המנהל'
    ],
    keyPrinciples: [
      'עקרון Stare Decisis',
      'מחייבת ערכאות נמוכות',
      'יוצרת יציבות משפטית',
      'ניתן לסטות במקרים חריגים'
    ],
    practicalApplications: [
      'הכנת כתבי טענות',
      'חיזוי תוצאות משפטיות',
      'פיתוח אסטרטגיה משפטית',
      'הגשת ערעורים'
    ],
    overrides: ['customs', 'administrative-guidelines'],
    overriddenBy: ['basic-laws', 'regular-laws'],
    relatedCases: [
      'ע"א 10/69 קול העם נגד שר הפנים',
      'בג"ץ 6055/95 צמח נגד שר הביטחון'
    ],
    modernRelevance: 'משפיעה על פיתוח המשפט ויצירת נורמות חדשות',
    challengeScenarios: [
      {
        id: 'precedent-vs-new-law-1',
        title: 'פסיקה מול חוק חדש',
        description: 'פסיקת בג"ץ הגנה על זכות מסוימת, אך הכנסת חוקקה חוק חדש המגביל אותה',
        conflict: ['פסיקת בג"ץ בעניין חופש התנועה', 'חוק הגבלת תנועה חדש'],
        correctAnswer: 'חוק הגבלת תנועה חדש',
        explanation: 'חוק חדש יכול לשנות פסיקה קודמת, אך בג"ץ יבחן את חוקתיותו לאור חוקי היסוד',
        difficulty: 'hard'
      }
    ]
  },
  {
    id: 'interpretation-methods',
    name: 'שיטות פרשנות',
    category: 'interpretation',
    hierarchy: 4,
    icon: '🔍',
    color: '#388e3c',
    description: 'שיטות שונות לפירוש וייעול החוק לפי נסיבות שונות',
    examples: [
      'פרשנות לשון החוק',
      'פרשנות תכליתית',
      'פרשנות מצמצמת',
      'פרשנות מרחיבה',
      'פרשנות דינמית'
    ],
    keyPrinciples: [
      'התאמה לכוונת המחוקק',
      'התחשבות במציאות משתנה',
      'איזון בין יציבות לגמישות',
      'הגנה על זכויות יסוד'
    ],
    practicalApplications: [
      'פרשנות חוזים',
      'יישום חקיקה',
      'פסיקה שיפוטית',
      'יעוץ משפטי'
    ],
    overrides: ['customs'],
    overriddenBy: ['basic-laws', 'regular-laws', 'binding-precedent'],
    modernRelevance: 'מאפשרת התאמת המשפט למציאות מתפתחת',
    challengeScenarios: [
      {
        id: 'interpretation-choice-1',
        title: 'בחירת שיטת פרשנות',
        description: 'חוק מעורפל מה 1950 צריך ליישם על טכנולוגיה מודרנית',
        conflict: ['פרשנות לשון החוק', 'פרשנות דינמית'],
        correctAnswer: 'פרשנות דינמית',
        explanation: 'כאשר החוק עתיק והמציאות השתנתה, עדיפה פרשנות דינמית המתאימה למציאות הנוכחית',
        difficulty: 'medium'
      }
    ]
  }
];

const principles: LegalPrinciple[] = [
  {
    id: 'rule-of-law',
    name: 'חוקיות המנהל',
    description: 'הרשות המבצעת רשאית לפעול רק על סמך חוק',
    applications: [
      'ביקורת על פעולות ממשלתיות',
      'הגבלת שרירותיות מנהלית',
      'הגנה על זכויות האזרח'
    ],
    limitations: [
      'עדיין מאפשר פעולה במסגרת החוק',
      'לא מונע שיקול דעת מנהלי סביר'
    ],
    examples: [
      'בג"ץ 390/79 דוויקאת נגד ממשלת ישראל',
      'עתירות נגד החלטות שרים ללא בסיס חוקי'
    ],
    relatedSources: ['basic-laws', 'binding-precedent']
  },
  {
    id: 'democracy',
    name: 'דמוקרטיה מהותית',
    description: 'פעולה לפי עקרונות דמוקרטיים, לא רק פורמליזם',
    applications: [
      'הגנה על זכויות מיעוטים',
      'שמירה על הפרדת רשויות',
      'הבטחת זכויות יסוד'
    ],
    limitations: [
      'עדיין מכבדת את רצון הרוב',
      'מאוזנת עם שיקולי ביטחון'
    ],
    examples: [
      'פס"ד ירדור - סילוק מועמד לא דמוקרטי',
      'הגנה על חופש הביטוי במיעוט'
    ],
    relatedSources: ['basic-laws', 'binding-precedent']
  }
];

interface LegalSourcesMapProps {
  onStartChallenge: (scenario: ChallengeScenario, sourceId: string) => void;
  onLearnMore: (source: LegalSource) => void;
}

export const LegalSourcesMap: React.FC<LegalSourcesMapProps> = ({
  onStartChallenge,
  onLearnMore
}) => {
  const [selectedSource, setSelectedSource] = useState<LegalSource | null>(null);
  const [selectedMode, setSelectedMode] = useState<'explore' | 'hierarchy' | 'timeline' | 'challenges'>('explore');
  const [hierarchyView, setHierarchyView] = useState(false);

  const getHierarchyLevel = (hierarchy: number) => {
    switch (hierarchy) {
      case 1: return { level: 'עליון', color: '#d32f2f', badge: '🏆' };
      case 2: return { level: 'גבוה', color: '#1976d2', badge: '⭐' };
      case 3: return { level: 'בינוני', color: '#388e3c', badge: '📋' };
      case 4: return { level: 'נמוך', color: '#f57c00', badge: '📝' };
      default: return { level: 'עזר', color: '#9e9e9e', badge: '💡' };
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'legislation': return <BookIcon />;
      case 'precedent': return <JudgeIcon />;
      case 'custom': return <GlobalIcon />;
      case 'interpretation': return <ExploreIcon />;
      case 'international': return <GlobalIcon />;
      case 'principle': return <CourtIcon />;
      default: return <BookIcon />;
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'legislation': return 'חקיקה';
      case 'precedent': return 'פסיקה';
      case 'custom': return 'מנהגים';
      case 'interpretation': return 'פרשנות';
      case 'international': return 'בינלאומי';
      case 'principle': return 'עקרונות';
      default: return 'אחר';
    }
  };

  const TabPanel = ({ children, value, index }: any) => (
    <div hidden={value !== index}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );

  return (
    <Box sx={{ maxWidth: 1400, margin: 'auto', p: 2 }}>
      {/* כותרת */}
      <Card sx={{ mb: 3, background: 'linear-gradient(135deg, #1e88e5 0%, #1565c0 100%)', color: 'white' }}>
        <CardHeader
          title={
            <Typography variant="h4" sx={{ fontWeight: 'bold', textAlign: 'center' }}>
              🗺️ Legal Explorer - מפת מקורות המשפט
            </Typography>
          }
          subheader={
            <Typography variant="h6" sx={{ textAlign: 'center', opacity: 0.9 }}>
              גלה את ההיררכיה, הקשרים והדינמיקה של מקורות המשפט הישראלי
            </Typography>
          }
        />
      </Card>

      {/* טאבים */}
      <Card>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs 
            value={selectedMode} 
            onChange={(_, newValue) => setSelectedMode(newValue)}
            variant="fullWidth"
          >
            <Tab 
              value="explore" 
              icon={<ExploreIcon />} 
              label="חקור מקורות" 
            />
            <Tab 
              value="hierarchy" 
              icon={<TrendIcon />} 
              label="היררכיה" 
            />
            <Tab 
              value="timeline" 
              icon={<TimelineIcon />} 
              label="דינמיקה" 
            />
            <Tab 
              value="challenges" 
              icon={<QuizIcon />} 
              label="אתגרים" 
            />
          </Tabs>
        </Box>

        {/* טאב חקירת מקורות */}
        <TabPanel value={selectedMode} index="explore">
          <Typography variant="h6" gutterBottom color="primary">
            🔍 בחר מקור משפטי לחקירה מעמיקה
          </Typography>
          
          <Grid container spacing={3}>
            {legalSources.map(source => {
              const hierarchyInfo = getHierarchyLevel(source.hierarchy);
              return (
                <Grid item xs={12} sm={6} md={4} key={source.id}>
                  <Card 
                    elevation={3}
                    sx={{ 
                      height: '100%',
                      border: `2px solid ${source.color}20`,
                      cursor: 'pointer',
                      '&:hover': { 
                        transform: 'translateY(-4px)',
                        boxShadow: 6,
                        transition: 'all 0.3s ease'
                      }
                    }}
                    onClick={() => setSelectedSource(source)}
                  >
                    <CardContent>
                      <Box display="flex" alignItems="center" gap={2} mb={2}>
                        <Box sx={{ fontSize: '2rem' }}>{source.icon}</Box>
                        <Box flex={1}>
                          <Typography variant="h6" fontWeight="bold">
                            {source.name}
                          </Typography>
                          <Box display="flex" gap={1} mt={1}>
                            <Chip 
                              label={getCategoryLabel(source.category)}
                              size="small"
                              icon={getCategoryIcon(source.category)}
                              sx={{ backgroundColor: source.color, color: 'white' }}
                            />
                            <Chip 
                              label={`${hierarchyInfo.badge} ${hierarchyInfo.level}`}
                              size="small"
                              sx={{ backgroundColor: hierarchyInfo.color, color: 'white' }}
                            />
                          </Box>
                        </Box>
                      </Box>
                      
                      <Typography variant="body2" color="text.secondary" paragraph>
                        {source.description}
                      </Typography>
                      
                      <Typography variant="caption" display="block" gutterBottom>
                        דוגמאות: {source.examples.slice(0, 2).join(', ')}...
                      </Typography>
                      
                      <Box display="flex" gap={1} mt={2}>
                        <Button 
                          size="small" 
                          variant="contained"
                          onClick={(e) => {
                            e.stopPropagation();
                            onLearnMore(source);
                          }}
                          sx={{ backgroundColor: source.color }}
                        >
                          חקור
                        </Button>
                        {source.challengeScenarios.length > 0 && (
                          <Button 
                            size="small" 
                            variant="outlined"
                            onClick={(e) => {
                              e.stopPropagation();
                              onStartChallenge(source.challengeScenarios[0], source.id);
                            }}
                            sx={{ borderColor: source.color, color: source.color }}
                          >
                            אתגר
                          </Button>
                        )}
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        </TabPanel>

        {/* טאב היררכיה */}
        <TabPanel value={selectedMode} index="hierarchy">
          <Typography variant="h6" gutterBottom color="primary">
            📊 היררכיית מקורות המשפט - מי גובר על מי?
          </Typography>
          
          <Alert severity="info" sx={{ mb: 3 }}>
            <Typography variant="body2">
              ככל שהמקור גבוה יותר, כך הוא גובר על מקורות נמוכים יותר במקרה של סתירה
            </Typography>
          </Alert>

          {[1, 2, 3, 4].map(level => {
            const sourcesAtLevel = legalSources.filter(s => s.hierarchy === level);
            const hierarchyInfo = getHierarchyLevel(level);
            
            return (
              <Paper key={level} elevation={2} sx={{ mb: 3, p: 3 }}>
                <Typography variant="h6" gutterBottom sx={{ color: hierarchyInfo.color }}>
                  {hierarchyInfo.badge} רמה {level} - {hierarchyInfo.level}
                </Typography>
                
                <Grid container spacing={2}>
                  {sourcesAtLevel.map(source => (
                    <Grid item xs={12} md={6} key={source.id}>
                      <Card variant="outlined" sx={{ border: `2px solid ${source.color}` }}>
                        <CardContent>
                          <Box display="flex" alignItems="center" gap={1} mb={1}>
                            <Box component="span" sx={{ fontSize: '1.5rem' }}>{source.icon}</Box>
                            <Typography variant="subtitle1" fontWeight="bold">
                              {source.name}
                            </Typography>
                          </Box>
                          
                          <Typography variant="body2" paragraph>
                            {source.description}
                          </Typography>
                          
                          {source.overrides.length > 0 && (
                            <Typography variant="caption" color="success.main" display="block">
                              ✅ גובר על: {source.overrides.map(id => 
                                legalSources.find(s => s.id === id)?.name
                              ).join(', ')}
                            </Typography>
                          )}
                          
                          {source.overriddenBy.length > 0 && (
                            <Typography variant="caption" color="error.main" display="block">
                              ❌ כפוף ל: {source.overriddenBy.map(id => 
                                legalSources.find(s => s.id === id)?.name
                              ).join(', ')}
                            </Typography>
                          )}
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Paper>
            );
          })}
        </TabPanel>

        {/* טאב דינמיקה */}
        <TabPanel value={selectedMode} index="timeline">
          <Typography variant="h6" gutterBottom color="primary">
            🔄 דינמיקה של המשפט - איך מקורות משפיעים זה על זה
          </Typography>
          
          <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              מחזור החיים של כלל משפטי
            </Typography>
            
            <Box display="flex" alignItems="center" gap={2} flexWrap="wrap">
              <Chip label="1️⃣ חקיקה" color="primary" />
              <span>→</span>
              <Chip label="2️⃣ פסיקה" color="secondary" />
              <span>→</span>
              <Chip label="3️⃣ מנהגים" color="warning" />
              <span>→</span>
              <Chip label="4️⃣ פרשנות" color="success" />
              <span>→</span>
              <Chip label="5️⃣ חקיקה חדשה" color="info" />
            </Box>
            
            <Typography variant="body2" sx={{ mt: 2 }}>
              כל מקור משפטי משפיע על האחרים ויוצר דינמיקה מתמשכת של התפתחות המשפט
            </Typography>
          </Paper>

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Paper elevation={2} sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom color="primary">
                  📈 השפעות חיוביות
                </Typography>
                <List dense>
                  <ListItem>
                    <ListItemIcon>✅</ListItemIcon>
                    <ListItemText 
                      primary="פסיקה יוצרת תקדים"
                      secondary="מנחה החלטות עתידיות"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>✅</ListItemIcon>
                    <ListItemText 
                      primary="מנהגים משפיעים על חקיקה"
                      secondary="החקיקה מתאימה למציאות"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>✅</ListItemIcon>
                    <ListItemText 
                      primary="פרשנות מעדכנת חוקים"
                      secondary="התאמה למציאות משתנה"
                    />
                  </ListItem>
                </List>
              </Paper>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Paper elevation={2} sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom color="error">
                  ⚡ מקרי סתירה
                </Typography>
                <List dense>
                  <ListItem>
                    <ListItemIcon>⚠️</ListItemIcon>
                    <ListItemText 
                      primary="חוק יסוד vs חוק רגיל"
                      secondary="חוק היסוד גובר"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>⚠️</ListItemIcon>
                    <ListItemText 
                      primary="חקיקה vs מנהג"
                      secondary="החקיקה גוברת"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>⚠️</ListItemIcon>
                    <ListItemText 
                      primary="פסיקה vs חוק חדש"
                      secondary="החוק החדש גובר"
                    />
                  </ListItem>
                </List>
              </Paper>
            </Grid>
          </Grid>
        </TabPanel>

        {/* טאב אתגרים */}
        <TabPanel value={selectedMode} index="challenges">
          <Typography variant="h6" gutterBottom color="primary">
            🎯 אתגרי "מי גובר על מי" - בחן את הידע שלך!
          </Typography>
          
          <Grid container spacing={3}>
            {legalSources
              .filter(source => source.challengeScenarios.length > 0)
              .map(source => (
                <Grid item xs={12} md={6} key={source.id}>
                  <Card elevation={2}>
                    <CardContent>
                      <Box display="flex" alignItems="center" gap={2} mb={2}>
                        <Box component="span" sx={{ fontSize: '1.5rem' }}>{source.icon}</Box>
                        <Typography variant="h6">{source.name}</Typography>
                      </Box>
                      
                      {source.challengeScenarios.map(scenario => (
                        <Paper 
                          key={scenario.id} 
                          elevation={1} 
                          sx={{ p: 2, mb: 2, backgroundColor: '#f8f9fa' }}
                        >
                          <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                            {scenario.title}
                          </Typography>
                          <Typography variant="body2" paragraph>
                            {scenario.description}
                          </Typography>
                          <Box display="flex" gap={1} alignItems="center" mb={2}>
                            <Chip 
                              label={scenario.difficulty === 'easy' ? 'קל' : 
                                    scenario.difficulty === 'medium' ? 'בינוני' : 'קשה'}
                              size="small"
                              color={scenario.difficulty === 'easy' ? 'success' : 
                                     scenario.difficulty === 'medium' ? 'warning' : 'error'}
                            />
                          </Box>
                          <Button
                            variant="contained"
                            size="small"
                            startIcon={<PlayIcon />}
                            onClick={() => onStartChallenge(scenario, source.id)}
                            sx={{ backgroundColor: source.color }}
                          >
                            התחל אתגר
                          </Button>
                        </Paper>
                      ))}
                    </CardContent>
                  </Card>
                </Grid>
              ))}
          </Grid>
        </TabPanel>
      </Card>

      {/* דיאלוג מקור מפורט */}
      <Dialog 
        open={!!selectedSource} 
        onClose={() => setSelectedSource(null)}
        maxWidth="lg"
        fullWidth
      >
        {selectedSource && (
          <>
            <DialogTitle>
              <Box display="flex" justifyContent="between" alignItems="center">
                <Box display="flex" alignItems="center" gap={2}>
                  <Box component="span" sx={{ fontSize: '2.5rem' }}>{selectedSource.icon}</Box>
                  <Box>
                    <Typography variant="h5" fontWeight="bold">
                      {selectedSource.name}
                    </Typography>
                    <Typography variant="subtitle1" color="text.secondary">
                      {getCategoryLabel(selectedSource.category)}
                    </Typography>
                  </Box>
                </Box>
                <IconButton onClick={() => setSelectedSource(null)}>
                  <CloseIcon />
                </IconButton>
              </Box>
            </DialogTitle>
            
            <DialogContent>
              <Typography variant="body1" paragraph>
                {selectedSource.description}
              </Typography>

              <Accordion>
                <AccordionSummary expandIcon={<ExpandIcon />}>
                  <Typography variant="h6">📋 דוגמאות</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <List>
                    {selectedSource.examples.map((example, index) => (
                      <ListItem key={index}>
                        <ListItemText primary={`• ${example}`} />
                      </ListItem>
                    ))}
                  </List>
                </AccordionDetails>
              </Accordion>

              <Accordion>
                <AccordionSummary expandIcon={<ExpandIcon />}>
                  <Typography variant="h6">🎯 עקרונות מפתח</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <List>
                    {selectedSource.keyPrinciples.map((principle, index) => (
                      <ListItem key={index}>
                        <ListItemText primary={`• ${principle}`} />
                      </ListItem>
                    ))}
                  </List>
                </AccordionDetails>
              </Accordion>

              <Accordion>
                <AccordionSummary expandIcon={<ExpandIcon />}>
                  <Typography variant="h6">💼 יישומים מעשיים</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <List>
                    {selectedSource.practicalApplications.map((application, index) => (
                      <ListItem key={index}>
                        <ListItemText primary={`• ${application}`} />
                      </ListItem>
                    ))}
                  </List>
                </AccordionDetails>
              </Accordion>

              {selectedSource.relatedCases && (
                <Accordion>
                  <AccordionSummary expandIcon={<ExpandIcon />}>
                    <Typography variant="h6">⚖️ פסיקה רלוונטית</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <List>
                      {selectedSource.relatedCases.map((caseItem, index) => (
                        <ListItem key={index}>
                          <ListItemText primary={`• ${caseItem}`} />
                        </ListItem>
                      ))}
                    </List>
                  </AccordionDetails>
                </Accordion>
              )}

              <Alert severity="info" sx={{ mt: 2 }}>
                <Typography variant="body2">
                  <strong>רלוונטיות מודרנית:</strong> {selectedSource.modernRelevance}
                </Typography>
              </Alert>
            </DialogContent>
            
            <DialogActions>
              <Button onClick={() => setSelectedSource(null)}>
                סגור
              </Button>
              {selectedSource.challengeScenarios.length > 0 && (
                <Button 
                  variant="contained" 
                  startIcon={<QuizIcon />}
                  onClick={() => {
                    onStartChallenge(selectedSource.challengeScenarios[0], selectedSource.id);
                    setSelectedSource(null);
                  }}
                  sx={{ backgroundColor: selectedSource.color }}
                >
                  התחל אתגר
                </Button>
              )}
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
};

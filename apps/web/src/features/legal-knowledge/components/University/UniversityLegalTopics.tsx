import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  Typography, 
  Box, 
  Button,
  Grid,
  Chip,
  LinearProgress,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Alert,
  Tabs,
  Tab
} from '@mui/material';
import { 
  School as SchoolIcon,
  Quiz as QuizIcon,
  TrendingUp as ProgressIcon,
  Star as StarIcon,
  AccessTime as TimeIcon,
  CheckCircle as CompletedIcon,
  PlayArrow as StartIcon,
  EmojiEvents as AchievementIcon
} from '@mui/icons-material';

interface LegalTopic {
  id: string;
  name: string;
  nameEn: string;
  category: string;
  semester: number;
  credits: number;
  description: string;
  prerequisite?: string[];
  icon: string;
  color: string;
  questionsCount: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedHours: number;
  keyTopics: string[];
  practicalAreas: string[];
}

interface UserProgress {
  topicId: string;
  questionsAnswered: number;
  correctAnswers: number;
  lastScore: number;
  totalTimeSpent: number; // minutes
  lastAccessed: Date;
  completionRate: number; // 0-100
  averageScore: number;
  streak: number;
  achievements: string[];
}

// נושאי משפטים אוניברסיטאיים מלאים
const legalTopics: LegalTopic[] = [
  // שנה א' - סמסטר א'
  {
    id: 'intro-law',
    name: 'מבוא למשפטים',
    nameEn: 'Introduction to Law',
    category: 'שנה א\'',
    semester: 1,
    credits: 4,
    description: 'יסודות המשפט, מקורות המשפט, מערכת המשפט הישראלית',
    icon: '⚖️',
    color: '#1976d2',
    questionsCount: 150,
    difficulty: 'beginner',
    estimatedHours: 60,
    keyTopics: ['מקורות המשפט', 'מערכת השיפוט', 'עקרונות יסוד'],
    practicalAreas: ['הכרת המערכת', 'יסודות משפטיים']
  },
  {
    id: 'constitutional-law-1',
    name: 'משפט חוקתי א\'',
    nameEn: 'Constitutional Law I',
    category: 'שנה א\'',
    semester: 1,
    credits: 4,
    description: 'חוקי יסוד, זכויות אדם, הפרדת רשויות',
    icon: '🏛️',
    color: '#d32f2f',
    questionsCount: 200,
    difficulty: 'intermediate',
    estimatedHours: 80,
    keyTopics: ['חוקי יסוד', 'זכויות אדם', 'הפרדת רשויות', 'ביקורת שיפוטית'],
    practicalAreas: ['עתירות לבג"ץ', 'זכויות אזרח']
  },
  {
    id: 'civil-procedure',
    name: 'דיני סדר דין אזרחי',
    nameEn: 'Civil Procedure',
    category: 'שנה א\'',
    semester: 1,
    credits: 3,
    description: 'תהליך משפטי אזרחי, תובענות, הוכחות',
    icon: '📋',
    color: '#388e3c',
    questionsCount: 180,
    difficulty: 'intermediate',
    estimatedHours: 70,
    keyTopics: ['הגשת תובענה', 'הוכחות', 'ערעורים', 'ביצוע פסקי דין'],
    practicalAreas: ['ניהול תיקים', 'ליטיגציה']
  },

  // שנה א' - סמסטר ב'
  {
    id: 'contracts',
    name: 'דיני חוזים',
    nameEn: 'Contract Law',
    category: 'שנה א\'',
    semester: 2,
    credits: 4,
    description: 'כריתת חוזים, תנאי חוזה, הפרת חוזה, סעדים',
    prerequisite: ['intro-law'],
    icon: '📝',
    color: '#7b1fa2',
    questionsCount: 220,
    difficulty: 'intermediate',
    estimatedHours: 85,
    keyTopics: ['כריתת חוזה', 'פרשנות חוזים', 'הפרת חוזה', 'סעדים'],
    practicalAreas: ['ניסוח חוזים', 'יעוץ עסקי', 'ליטיגציה חוזית']
  },
  {
    id: 'torts',
    name: 'דיני נזיקין',
    nameEn: 'Tort Law',
    category: 'שנה א\'',
    semester: 2,
    credits: 4,
    description: 'אחריות בנזיקין, רשלנות, דיבה, פגיעה בפרטיות',
    icon: '⚡',
    color: '#f57c00',
    questionsCount: 190,
    difficulty: 'intermediate',
    estimatedHours: 75,
    keyTopics: ['רשלנות', 'נזק', 'קשר סיבתי', 'דיבה ולשון הרע'],
    practicalAreas: ['תביעות פיצוי', 'ביטוח', 'אחריות מקצועית']
  },
  {
    id: 'criminal-law',
    name: 'דיני עונשין',
    nameEn: 'Criminal Law',
    category: 'שנה א\'',
    semester: 2,
    credits: 4,
    description: 'עבירות פליליות, אחריות פלילית, עונשים',
    icon: '🚨',
    color: '#e91e63',
    questionsCount: 170,
    difficulty: 'intermediate',
    estimatedHours: 80,
    keyTopics: ['עבירות', 'כוונה פלילית', 'הגנות', 'עונשים'],
    practicalAreas: ['הגנה פלילית', 'תביעה', 'יעוץ פלילי']
  },

  // שנה ב'
  {
    id: 'property-law',
    name: 'דיני רכוש',
    nameEn: 'Property Law',
    category: 'שנה ב\'',
    semester: 3,
    credits: 4,
    description: 'בעלות, זכויות ברכוש, משכון, חכירה',
    prerequisite: ['civil-procedure'],
    icon: '🏠',
    color: '#5d4037',
    questionsCount: 160,
    difficulty: 'intermediate',
    estimatedHours: 70,
    keyTopics: ['בעלות', 'זכויות חברה', 'משכון', 'חכירה'],
    practicalAreas: ['נדל"ן', 'הסכמי מכר', 'זכויות בקרקע']
  },
  {
    id: 'family-law',
    name: 'דיני משפחה',
    nameEn: 'Family Law',
    category: 'שנה ב\'',
    semester: 3,
    credits: 3,
    description: 'נישואין, גירושין, ילדים, מזונות',
    icon: '👨‍👩‍👧‍👦',
    color: '#ad1457',
    questionsCount: 140,
    difficulty: 'intermediate',
    estimatedHours: 60,
    keyTopics: ['נישואין', 'גירושין', 'משמורת', 'מזונות', 'רכוש הזוג'],
    practicalAreas: ['דיני משפחה', 'גירושין', 'משמורת ילדים']
  },
  {
    id: 'administrative-law',
    name: 'משפט מנהלי',
    nameEn: 'Administrative Law',
    category: 'שנה ב\'',
    semester: 4,
    credits: 4,
    description: 'פעולות מנהליות, עקרונות משפט מנהלי, ביקורת שיפוטית',
    prerequisite: ['constitutional-law-1'],
    icon: '🏢',
    color: '#455a64',
    questionsCount: 180,
    difficulty: 'advanced',
    estimatedHours: 85,
    keyTopics: ['חוקיות המנהל', 'שמיעה', 'סבירות', 'ביקורת שיפוטית'],
    practicalAreas: ['עתירות מנהליות', 'יעוץ לרשויות', 'רגולציה']
  },

  // שנה ג' - התמחויות
  {
    id: 'commercial-law',
    name: 'משפט מסחרי',
    nameEn: 'Commercial Law',
    category: 'שנה ג\'',
    semester: 5,
    credits: 4,
    description: 'חברות, שותפויות, ני"ע, פשיטת רגל',
    prerequisite: ['contracts'],
    icon: '💼',
    color: '#1565c0',
    questionsCount: 200,
    difficulty: 'advanced',
    estimatedHours: 90,
    keyTopics: ['דיני חברות', 'ני"ע', 'פשיטת רגל', 'מיזוגים ורכישות'],
    practicalAreas: ['יעוץ עסקי', 'רגולטורי', 'M&A', 'הנפקות']
  },
  {
    id: 'labor-law',
    name: 'דיני עבודה',
    nameEn: 'Labor Law',
    category: 'שנה ג\'',
    semester: 5,
    credits: 3,
    description: 'יחסי עבודה, פיטורים, אפליה, ביטחון סוציאלי',
    icon: '👷',
    color: '#ef6c00',
    questionsCount: 150,
    difficulty: 'intermediate',
    estimatedHours: 65,
    keyTopics: ['חוזה עבודה', 'פיטורים', 'אפליה', 'התאגדות'],
    practicalAreas: ['יחסי עבודה', 'ליטיגציה עבודה', 'יעוץ HR']
  },
  {
    id: 'tax-law',
    name: 'דיני מיסים',
    nameEn: 'Tax Law',
    category: 'שנה ג\'',
    semester: 6,
    credits: 3,
    description: 'מס הכנסה, מע"מ, תכנון מס, הליכי מיסוי',
    icon: '💰',
    color: '#558b2f',
    questionsCount: 130,
    difficulty: 'advanced',
    estimatedHours: 70,
    keyTopics: ['מס הכנסה', 'מע"מ', 'תכנון מס', 'הערכות'],
    practicalAreas: ['ייעוץ מס', 'תכנון מס', 'ליטיגציה מס']
  },
  {
    id: 'international-law',
    name: 'משפט בינלאומי',
    nameEn: 'International Law',
    category: 'שנה ג\'',
    semester: 6,
    credits: 3,
    description: 'משפט בינלאומי ציבורי ופרטי, אמנות, סכסוכים',
    icon: '🌍',
    color: '#0277bd',
    questionsCount: 120,
    difficulty: 'advanced',
    estimatedHours: 60,
    keyTopics: ['משפט בינלאומי ציבורי', 'משפט בינלאומי פרטי', 'זכויות אדם'],
    practicalAreas: ['יעוץ בינלאומי', 'סחר בינלאומי', 'זכויות אדם']
  },

  // קורסי בחירה מתקדמים
  {
    id: 'intellectual-property',
    name: 'קניין רוחני',
    nameEn: 'Intellectual Property',
    category: 'בחירה',
    semester: 0,
    credits: 3,
    description: 'פטנטים, זכויות יוצרים, סימני מסחר',
    icon: '💡',
    color: '#7e57c2',
    questionsCount: 110,
    difficulty: 'advanced',
    estimatedHours: 55,
    keyTopics: ['פטנטים', 'זכויות יוצרים', 'סימני מסחר', 'סודות מסחריים'],
    practicalAreas: ['טכנולוגיה', 'רגיסטרציה', 'הגנה על IP']
  },
  {
    id: 'environmental-law',
    name: 'דיני סביבה',
    nameEn: 'Environmental Law',
    category: 'בחירה',
    semester: 0,
    credits: 2,
    description: 'הגנת הסביבה, רגולציה סביבתית, אחריות סביבתית',
    icon: '🌱',
    color: '#388e3c',
    questionsCount: 90,
    difficulty: 'intermediate',
    estimatedHours: 45,
    keyTopics: ['הגנת הסביבה', 'רישוי', 'אחריות סביבתית'],
    practicalAreas: ['יעוץ סביבתי', 'רגולציה', 'תכנון ובנייה']
  },
  {
    id: 'securities-law',
    name: 'דיני ני"ע',
    nameEn: 'Securities Law',
    category: 'בחירה',
    semester: 0,
    credits: 3,
    description: 'שוק ההון, הנפקות, רגולציה, גילוי',
    prerequisite: ['commercial-law'],
    icon: '📈',
    color: '#d84315',
    questionsCount: 100,
    difficulty: 'advanced',
    estimatedHours: 50,
    keyTopics: ['הנפקות', 'גילוי', 'מניפולציות', 'רגולציה'],
    practicalAreas: ['שוק ההון', 'הנפקות', 'יעוץ רגולטורי']
  }
];

interface UniversityLegalTopicsProps {
  onTopicSelect: (topic: LegalTopic) => void;
  userProgress: UserProgress[];
  onStartQuiz: (topicId: string) => void;
}

export const UniversityLegalTopics: React.FC<UniversityLegalTopicsProps> = ({
  onTopicSelect,
  userProgress,
  onStartQuiz
}) => {
  const [selectedCategory, setSelectedCategory] = useState('הכל');
  const [selectedTopic, setSelectedTopic] = useState<LegalTopic | null>(null);
  const [activeTab, setActiveTab] = useState(0);

  const categories = ['הכל', 'שנה א\'', 'שנה ב\'', 'שנה ג\'', 'בחירה'];

  const filteredTopics = selectedCategory === 'הכל' 
    ? legalTopics 
    : legalTopics.filter(topic => topic.category === selectedCategory);

  const getTopicProgress = (topicId: string): UserProgress | undefined => {
    return userProgress.find(progress => progress.topicId === topicId);
  };

  const getOverallStats = () => {
    const totalTopics = legalTopics.length;
    const studiedTopics = userProgress.filter(p => p.questionsAnswered > 0).length;
    const completedTopics = userProgress.filter(p => p.completionRate >= 80).length;
    const totalQuestions = userProgress.reduce((sum, p) => sum + p.questionsAnswered, 0);
    const totalCorrect = userProgress.reduce((sum, p) => sum + p.correctAnswers, 0);
    const averageScore = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;

    return {
      totalTopics,
      studiedTopics,
      completedTopics,
      totalQuestions,
      averageScore
    };
  };

  const stats = getOverallStats();

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return '#4caf50';
      case 'intermediate': return '#ff9800';
      case 'advanced': return '#f44336';
      default: return '#9e9e9e';
    }
  };

  const getDifficultyLabel = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'מתחילים';
      case 'intermediate': return 'בינוני';
      case 'advanced': return 'מתקדם';
      default: return 'לא מוגדר';
    }
  };

  const TabPanel = ({ children, value, index }: { children: React.ReactNode; value: number; index: number }) => (
    <div hidden={value !== index}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );

  return (
    <Box sx={{ maxWidth: 1400, margin: 'auto', p: 2 }}>
      {/* כותרת */}
      <Card sx={{ mb: 3, background: 'linear-gradient(135deg, #1565c0 0%, #0d47a1 100%)', color: 'white' }}>
        <CardHeader
          avatar={
            <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 60, height: 60 }}>
              <SchoolIcon sx={{ fontSize: '2rem' }} />
            </Avatar>
          }
          title={
            <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
              🎓 נושאי משפטים אוניברסיטאיים
            </Typography>
          }
          subheader={
            <Typography variant="h6" sx={{ opacity: 0.9, mt: 1 }}>
              מאגר שאלות אמריקאי מקצועי • מעקב התקדמות • ציונים מפורטים
            </Typography>
          }
        />
      </Card>

      {/* סטטיסטיקות כלליות */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom color="primary">
            📊 הסטטיסטיקות שלך
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={6} md={2}>
              <Paper elevation={2} sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="h4" color="primary" fontWeight="bold">
                  {stats.studiedTopics}
                </Typography>
                <Typography variant="caption">
                  מתוך {stats.totalTopics} נושאים
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  נושאים שנלמדו
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={6} md={2}>
              <Paper elevation={2} sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="h4" color="success.main" fontWeight="bold">
                  {stats.completedTopics}
                </Typography>
                <Typography variant="caption">
                  הושלמו
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  נושאים מושלמים
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={6} md={2}>
              <Paper elevation={2} sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="h4" color="info.main" fontWeight="bold">
                  {stats.totalQuestions}
                </Typography>
                <Typography variant="caption">
                  שאלות
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  סה"כ נענו
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={6} md={2}>
              <Paper elevation={2} sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="h4" color="warning.main" fontWeight="bold">
                  {stats.averageScore}%
                </Typography>
                <Typography variant="caption">
                  ציון ממוצע
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  דיוק כללי
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper elevation={2} sx={{ p: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  התקדמות כללית
                </Typography>
                <LinearProgress 
                  variant="determinate" 
                  value={(stats.studiedTopics / stats.totalTopics) * 100}
                  sx={{ height: 8, borderRadius: 4, mb: 1 }}
                />
                <Typography variant="caption" color="text.secondary">
                  {Math.round((stats.studiedTopics / stats.totalTopics) * 100)}% מהנושאים נלמדו
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* טאבים */}
      <Card>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={activeTab} onChange={(_, newValue) => setActiveTab(newValue)}>
            <Tab icon={<SchoolIcon />} label="כל הנושאים" />
            <Tab icon={<ProgressIcon />} label="התקדמות מפורטת" />
            <Tab icon={<AchievementIcon />} label="הישגים" />
          </Tabs>
        </Box>

        {/* טאב כל הנושאים */}
        <TabPanel value={activeTab} index={0}>
          {/* פילטר קטגוריות */}
          <Box mb={3}>
            <Typography variant="h6" gutterBottom>
              📚 בחר קטגוריה
            </Typography>
            <Box display="flex" gap={1} flexWrap="wrap">
              {categories.map(category => (
                <Chip
                  key={category}
                  label={category}
                  color={selectedCategory === category ? 'primary' : 'default'}
                  onClick={() => setSelectedCategory(category)}
                  variant={selectedCategory === category ? 'filled' : 'outlined'}
                />
              ))}
            </Box>
          </Box>

          {/* רשת נושאים */}
          <Grid container spacing={3}>
            {filteredTopics.map(topic => {
              const progress = getTopicProgress(topic.id);
              return (
                <Grid item xs={12} sm={6} md={4} lg={3} key={topic.id}>
                  <Card 
                    elevation={3}
                    sx={{ 
                      height: '100%',
                      border: `2px solid ${topic.color}20`,
                      '&:hover': { 
                        transform: 'translateY(-4px)',
                        boxShadow: 6,
                        transition: 'all 0.3s ease'
                      }
                    }}
                  >
                    <CardContent sx={{ p: 3 }}>
                      {/* כותרת הנושא */}
                      <Box display="flex" alignItems="center" gap={1} mb={2}>
                        <Box sx={{ fontSize: '2rem' }}>{topic.icon}</Box>
                        <Box flex={1}>
                          <Typography variant="h6" fontWeight="bold" sx={{ lineHeight: 1.2 }}>
                            {topic.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {topic.nameEn}
                          </Typography>
                        </Box>
                      </Box>

                      {/* מידע בסיסי */}
                      <Box mb={2}>
                        <Box display="flex" gap={1} mb={1} flexWrap="wrap">
                          <Chip 
                            label={`${topic.credits} נק"ז`}
                            size="small"
                            color="primary"
                          />
                          <Chip 
                            label={getDifficultyLabel(topic.difficulty)}
                            size="small"
                            sx={{ 
                              backgroundColor: getDifficultyColor(topic.difficulty),
                              color: 'white'
                            }}
                          />
                          {topic.semester > 0 && (
                            <Chip 
                              label={`סמסטר ${topic.semester}`}
                              size="small"
                              variant="outlined"
                            />
                          )}
                        </Box>
                        
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                          {topic.description}
                        </Typography>
                        
                        <Typography variant="caption" color="text.secondary">
                          {topic.questionsCount} שאלות • {topic.estimatedHours} שעות משוערות
                        </Typography>
                      </Box>

                      {/* התקדמות */}
                      {progress && (
                        <Box mb={2}>
                          <Typography variant="caption" gutterBottom>
                            התקדמות: {progress.completionRate}%
                          </Typography>
                          <LinearProgress 
                            variant="determinate" 
                            value={progress.completionRate}
                            sx={{ 
                              height: 6, 
                              borderRadius: 3,
                              backgroundColor: '#f0f0f0',
                              '& .MuiLinearProgress-bar': {
                                backgroundColor: topic.color
                              }
                            }}
                          />
                          <Box display="flex" justifyContent="space-between" mt={1}>
                            <Typography variant="caption">
                              ציון אחרון: {progress.lastScore}%
                            </Typography>
                            <Typography variant="caption">
                              {progress.questionsAnswered} שאלות נענו
                            </Typography>
                          </Box>
                        </Box>
                      )}

                      {/* כפתורי פעולה */}
                      <Box display="flex" gap={1}>
                        <Button
                          variant="contained"
                          size="small"
                          startIcon={<QuizIcon />}
                          onClick={() => onStartQuiz(topic.id)}
                          sx={{ 
                            backgroundColor: topic.color,
                            '&:hover': { backgroundColor: `${topic.color}dd` },
                            flex: 1
                          }}
                        >
                          התחל מבחן
                        </Button>
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => setSelectedTopic(topic)}
                          sx={{ 
                            borderColor: topic.color,
                            color: topic.color
                          }}
                        >
                          פרטים
                        </Button>
                      </Box>

                      {/* דרישות קדם */}
                      {topic.prerequisite && topic.prerequisite.length > 0 && (
                        <Alert severity="info" sx={{ mt: 2, fontSize: '0.75rem' }}>
                          <Typography variant="caption">
                            דרישות קדם: {topic.prerequisite.map(prereq => {
                              const prereqTopic = legalTopics.find(t => t.id === prereq);
                              return prereqTopic?.name;
                            }).join(', ')}
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

        {/* טאב התקדמות מפורטת */}
        <TabPanel value={activeTab} index={1}>
          <Typography variant="h6" gutterBottom>
            📈 התקדמות מפורטת לפי נושא
          </Typography>
          <List>
            {legalTopics.map(topic => {
              const progress = getTopicProgress(topic.id);
              return (
                <ListItem key={topic.id} divider>
                  <ListItemIcon>
                    <Box sx={{ fontSize: '1.5rem' }}>{topic.icon}</Box>
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Box display="flex" alignItems="center" gap={2}>
                        <Typography variant="subtitle1" fontWeight="bold">
                          {topic.name}
                        </Typography>
                        {progress && progress.completionRate >= 80 && (
                          <CompletedIcon color="success" />
                        )}
                      </Box>
                    }
                    secondary={
                      progress ? (
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            שאלות נענו: {progress.questionsAnswered} • 
                            דיוק: {Math.round((progress.correctAnswers / Math.max(progress.questionsAnswered, 1)) * 100)}% • 
                            זמן לימוד: {Math.round(progress.totalTimeSpent / 60)} שעות
                          </Typography>
                          <LinearProgress 
                            variant="determinate" 
                            value={progress.completionRate}
                            sx={{ mt: 1, height: 4, borderRadius: 2 }}
                          />
                        </Box>
                      ) : (
                        <Typography variant="body2" color="text.secondary">
                          טרם החל לימוד
                        </Typography>
                      )
                    }
                  />
                  <Box display="flex" gap={1}>
                    <Button
                      size="small"
                      variant="outlined"
                      startIcon={<QuizIcon />}
                      onClick={() => onStartQuiz(topic.id)}
                    >
                      מבחן
                    </Button>
                  </Box>
                </ListItem>
              );
            })}
          </List>
        </TabPanel>

        {/* טאב הישגים */}
        <TabPanel value={activeTab} index={2}>
          <Typography variant="h6" gutterBottom>
            🏆 הישגים והצטיינות
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Paper elevation={2} sx={{ p: 3, textAlign: 'center' }}>
                <AchievementIcon sx={{ fontSize: '3rem', color: 'gold', mb: 1 }} />
                <Typography variant="h6" gutterBottom>
                  מתמחה ראשון
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  השלמת 5 נושאים בציון מעל 90%
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper elevation={2} sx={{ p: 3, textAlign: 'center' }}>
                <StarIcon sx={{ fontSize: '3rem', color: '#1976d2', mb: 1 }} />
                <Typography variant="h6" gutterBottom>
                  לומד מתמיד
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  7 ימי רצף בלמידה
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper elevation={2} sx={{ p: 3, textAlign: 'center' }}>
                <TimeIcon sx={{ fontSize: '3rem', color: '#f57c00', mb: 1 }} />
                <Typography variant="h6" gutterBottom>
                  מרתונץ
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  100 שעות לימוד מצטברות
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </TabPanel>
      </Card>

      {/* דיאלוג פרטי נושא */}
      <Dialog 
        open={!!selectedTopic} 
        onClose={() => setSelectedTopic(null)}
        maxWidth="md"
        fullWidth
      >
        {selectedTopic && (
          <>
            <DialogTitle>
              <Box display="flex" alignItems="center" gap={2}>
                <Box sx={{ fontSize: '2.5rem' }}>{selectedTopic.icon}</Box>
                <Box>
                  <Typography variant="h5" fontWeight="bold">
                    {selectedTopic.name}
                  </Typography>
                  <Typography variant="subtitle1" color="text.secondary">
                    {selectedTopic.nameEn}
                  </Typography>
                </Box>
              </Box>
            </DialogTitle>
            
            <DialogContent>
              <Box mb={3}>
                <Box display="flex" gap={1} mb={2} flexWrap="wrap">
                  <Chip label={`${selectedTopic.credits} נק"ז`} color="primary" />
                  <Chip 
                    label={getDifficultyLabel(selectedTopic.difficulty)}
                    sx={{ 
                      backgroundColor: getDifficultyColor(selectedTopic.difficulty),
                      color: 'white'
                    }}
                  />
                  <Chip label={`${selectedTopic.questionsCount} שאלות`} variant="outlined" />
                  <Chip label={`${selectedTopic.estimatedHours} שעות`} variant="outlined" />
                </Box>
                
                <Typography variant="body1" paragraph>
                  {selectedTopic.description}
                </Typography>
              </Box>

              <Typography variant="h6" gutterBottom color="primary">
                🎯 נושאי מפתח
              </Typography>
              <Box display="flex" gap={1} flexWrap="wrap" mb={3}>
                {selectedTopic.keyTopics.map((topic, index) => (
                  <Chip 
                    key={index}
                    label={topic}
                    size="small"
                    variant="outlined"
                  />
                ))}
              </Box>

              <Typography variant="h6" gutterBottom color="primary">
                💼 תחומי יישום מעשיים
              </Typography>
              <List dense>
                {selectedTopic.practicalAreas.map((area, index) => (
                  <ListItem key={index}>
                    <ListItemText primary={`• ${area}`} />
                  </ListItem>
                ))}
              </List>
            </DialogContent>
            
            <DialogActions>
              <Button onClick={() => setSelectedTopic(null)}>
                סגור
              </Button>
              <Button 
                variant="contained" 
                startIcon={<StartIcon />}
                onClick={() => {
                  onStartQuiz(selectedTopic.id);
                  setSelectedTopic(null);
                }}
                sx={{ 
                  backgroundColor: selectedTopic.color,
                  '&:hover': { backgroundColor: `${selectedTopic.color}dd` }
                }}
              >
                התחל מבחן
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
};

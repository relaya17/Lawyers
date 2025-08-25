import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  Typography, 
  Box, 
  Button,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Chip,
  Alert,
  LinearProgress,
  Paper,
  Grid,
  Tabs,
  Tab,
  IconButton,
  Tooltip
} from '@mui/material';
import { 
  Psychology as AIIcon,
  TrendingUp as TrendingUpIcon,
  School as SchoolIcon,
  Target as TargetIcon,
  Lightbulb as IdeaIcon,
  Schedule as ScheduleIcon,
  Assessment as AssessmentIcon,
  Refresh as RefreshIcon,
  SmartToy as BotIcon,
  Star as StarIcon
} from '@mui/icons-material';

interface UserProfile {
  id: string;
  name: string;
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  studyGoals: string[];
  weakAreas: string[];
  strongAreas: string[];
  preferredDifficulty: string;
  studyTime: number; // minutes per week
  lastActive: Date;
  streak: number;
}

interface AIRecommendation {
  id: string;
  type: 'study' | 'practice' | 'review' | 'challenge';
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  estimatedTime: number;
  reason: string;
  confidence: number;
  topics: string[];
  icon: string;
}

interface AIInsight {
  id: string;
  category: 'performance' | 'pattern' | 'prediction' | 'opportunity';
  message: string;
  data: any;
  actionable: boolean;
  timestamp: Date;
}

interface LearningPattern {
  bestStudyTime: string;
  preferredQuestionTypes: string[];
  averageSessionDuration: number;
  peakPerformanceDays: string[];
  improvementRate: number;
}

interface AIPersonalAssistantProps {
  userProfile: UserProfile;
  recentActivity: any[];
  onRecommendationAccept: (recommendation: AIRecommendation) => void;
}

export const AIPersonalAssistant: React.FC<AIPersonalAssistantProps> = ({
  userProfile,
  recentActivity,
  onRecommendationAccept
}) => {
  const [activeTab, setActiveTab] = useState(0);
  const [recommendations, setRecommendations] = useState<AIRecommendation[]>([]);
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [learningPattern, setLearningPattern] = useState<LearningPattern | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  useEffect(() => {
    generateAIRecommendations();
    generateAIInsights();
    analyzeLearningPatterns();
  }, [userProfile, recentActivity]);

  const generateAIRecommendations = async () => {
    setIsAnalyzing(true);
    
    // סימולציה של ניתוח AI
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const aiRecommendations: AIRecommendation[] = [
      {
        id: '1',
        type: 'practice',
        title: 'תרגול מקרים בחוק יסוד',
        description: 'זיהיתי שאתה מתקשה במקרים המערבים חוק יסוד מול חוק רגיל. מומלץ תרגול מעמיק.',
        priority: 'high',
        estimatedTime: 25,
        reason: 'דיוק של 62% בנושא זה לעומת 85% ממוצע',
        confidence: 94,
        topics: ['חוק יסוד', 'היררכיה משפטית'],
        icon: '⚖️'
      },
      {
        id: '2',
        type: 'study',
        title: 'למד על פסיקת בג"ץ החדשה',
        description: 'יש כמה פסיקות חדשות שרלוונטיות לתחומי הענין שלך ויכולות לשפר את הביצועים.',
        priority: 'medium',
        estimatedTime: 15,
        reason: 'התעדכנות בפסיקה עדכנית תעזור בשאלות קשות',
        confidence: 87,
        topics: ['פסיקה עדכנית', 'בג"ץ'],
        icon: '📚'
      },
      {
        id: '3',
        type: 'challenge',
        title: 'אתגר שבועי: מקרים מורכבים',
        description: 'אתה מוכן לאתגר הבא! מקרים מורכבים שישפרו את הכישורים המתקדמים שלך.',
        priority: 'low',
        estimatedTime: 45,
        reason: 'הביצועים שלך משתפרים וזה הזמן לאתגר הבא',
        confidence: 78,
        topics: ['מקרים מורכבים', 'אתגרים'],
        icon: '🏆'
      },
      {
        id: '4',
        type: 'review',
        title: 'חזרה על נושאי חולשה',
        description: 'חזרה מהירה על מנהגים ופסיקה - הנושאים שצריכים חיזוק קטן.',
        priority: 'medium',
        estimatedTime: 20,
        reason: 'חזרה תעזור לשמר את הידע ולשפר ביטחון',
        confidence: 91,
        topics: ['מנהגים', 'פסיקה'],
        icon: '🔄'
      }
    ];

    setRecommendations(aiRecommendations);
    setIsAnalyzing(false);
  };

  const generateAIInsights = async () => {
    const aiInsights: AIInsight[] = [
      {
        id: '1',
        category: 'performance',
        message: 'הביצועים שלך משתפרים! עלייה של 15% בשבועיים האחרונים',
        data: { improvement: 15, timeframe: '2 weeks' },
        actionable: false,
        timestamp: new Date()
      },
      {
        id: '2',
        category: 'pattern',
        message: 'זיהיתי שאתה הכי יעיל בלמידה בין 19:00-21:00',
        data: { bestHours: '19:00-21:00', efficiency: 92 },
        actionable: true,
        timestamp: new Date()
      },
      {
        id: '3',
        category: 'prediction',
        message: 'בקצב הנוכחי, תגיע למיומנות מתקדמת בעוד 3 שבועות',
        data: { currentLevel: 'intermediate', estimatedWeeks: 3 },
        actionable: false,
        timestamp: new Date()
      },
      {
        id: '4',
        category: 'opportunity',
        message: 'יש לך פוטנציאל גבוה בתחום המשפט החוקתי - שקול התמחות',
        data: { area: 'constitutional-law', potential: 'high' },
        actionable: true,
        timestamp: new Date()
      }
    ];

    setInsights(aiInsights);
  };

  const analyzeLearningPatterns = async () => {
    const pattern: LearningPattern = {
      bestStudyTime: '19:00-21:00',
      preferredQuestionTypes: ['multiple-choice', 'case-study'],
      averageSessionDuration: 32,
      peakPerformanceDays: ['Tuesday', 'Wednesday', 'Sunday'],
      improvementRate: 12.5
    };

    setLearningPattern(pattern);
  };

  const refreshAnalysis = () => {
    setLastUpdate(new Date());
    generateAIRecommendations();
    generateAIInsights();
    analyzeLearningPatterns();
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return '#f44336';
      case 'medium': return '#ff9800';
      case 'low': return '#4caf50';
      default: return '#9e9e9e';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'performance': return <TrendingUpIcon />;
      case 'pattern': return <AssessmentIcon />;
      case 'prediction': return <TargetIcon />;
      case 'opportunity': return <IdeaIcon />;
      default: return <BotIcon />;
    }
  };

  const TabPanel = ({ children, value, index }: any) => (
    <div hidden={value !== index}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );

  return (
    <Box sx={{ maxWidth: 1000, margin: 'auto', mt: 2 }}>
      {/* כותרת AI */}
      <Card sx={{ mb: 3, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
        <CardHeader
          avatar={
            <Avatar sx={{ 
              bgcolor: 'rgba(255,255,255,0.2)',
              animation: isAnalyzing ? 'pulse 2s infinite' : 'none'
            }}>
              <AIIcon />
            </Avatar>
          }
          title={
            <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
              🤖 העוזר האישי החכם שלך
            </Typography>
          }
          subheader={
            <Typography variant="subtitle1" sx={{ opacity: 0.9 }}>
              מנתח את הלמידה שלך ומספק המלצות מותאמות אישית
            </Typography>
          }
          action={
            <Box display="flex" alignItems="center" gap={1}>
              <Typography variant="caption" sx={{ opacity: 0.8 }}>
                עודכן לאחרונה: {lastUpdate.toLocaleTimeString('he-IL')}
              </Typography>
              <Tooltip title="רענן ניתוח">
                <IconButton onClick={refreshAnalysis} sx={{ color: 'white' }}>
                  <RefreshIcon />
                </IconButton>
              </Tooltip>
            </Box>
          }
        />
      </Card>

      {/* טאבים */}
      <Card>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs 
            value={activeTab} 
            onChange={(_, newValue) => setActiveTab(newValue)}
            sx={{ px: 2 }}
          >
            <Tab icon={<IdeaIcon />} label="המלצות AI" />
            <Tab icon={<AssessmentIcon />} label="תובנות" />
            <Tab icon={<TargetIcon />} label="דפוסי למידה" />
          </Tabs>
        </Box>

        {/* טאב המלצות */}
        <TabPanel value={activeTab} index={0}>
          <Box display="flex" justifyContent="between" alignItems="center" mb={2}>
            <Typography variant="h6">
              🎯 המלצות מותאמות אישית
            </Typography>
            {isAnalyzing && <LinearProgress sx={{ width: 200 }} />}
          </Box>
          
          <Grid container spacing={2}>
            {recommendations.map((rec) => (
              <Grid item xs={12} md={6} key={rec.id}>
                <Card 
                  elevation={2}
                  sx={{ 
                    border: `2px solid ${getPriorityColor(rec.priority)}20`,
                    '&:hover': { transform: 'translateY(-2px)', transition: 'all 0.2s' }
                  }}
                >
                  <CardContent>
                    <Box display="flex" alignItems="center" gap={2} mb={2}>
                      <Box sx={{ fontSize: '1.8rem' }}>{rec.icon}</Box>
                      <Box flex={1}>
                        <Typography variant="h6" gutterBottom>
                          {rec.title}
                        </Typography>
                        <Box display="flex" gap={1} mb={1}>
                          <Chip 
                            label={rec.priority === 'high' ? 'עדיפות גבוהה' : 
                                  rec.priority === 'medium' ? 'עדיפות בינונית' : 'עדיפות נמוכה'}
                            size="small"
                            sx={{ 
                              backgroundColor: getPriorityColor(rec.priority),
                              color: 'white'
                            }}
                          />
                          <Chip 
                            label={`${rec.estimatedTime} דקות`}
                            size="small"
                            variant="outlined"
                          />
                          <Chip 
                            label={`${rec.confidence}% ביטחון`}
                            size="small"
                            color={rec.confidence > 85 ? 'success' : 'warning'}
                          />
                        </Box>
                      </Box>
                    </Box>

                    <Typography variant="body2" paragraph>
                      {rec.description}
                    </Typography>

                    <Alert severity="info" sx={{ mb: 2 }}>
                      <Typography variant="caption">
                        <strong>למה זה מומלץ:</strong> {rec.reason}
                      </Typography>
                    </Alert>

                    <Box display="flex" gap={1} mb={2}>
                      {rec.topics.map((topic, index) => (
                        <Chip 
                          key={index}
                          label={topic}
                          size="small"
                          variant="outlined"
                        />
                      ))}
                    </Box>

                    <Button
                      variant="contained"
                      fullWidth
                      onClick={() => onRecommendationAccept(rec)}
                      sx={{ 
                        backgroundColor: getPriorityColor(rec.priority),
                        '&:hover': { backgroundColor: `${getPriorityColor(rec.priority)}dd` }
                      }}
                    >
                      התחל עכשיו
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </TabPanel>

        {/* טאב תובנות */}
        <TabPanel value={activeTab} index={1}>
          <Typography variant="h6" gutterBottom>
            💡 תובנות מתקדמות
          </Typography>
          
          <List>
            {insights.map((insight) => (
              <ListItem key={insight.id}>
                <ListItemAvatar>
                  <Avatar sx={{ 
                    bgcolor: insight.actionable ? '#4caf50' : '#2196f3'
                  }}>
                    {getCategoryIcon(insight.category)}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={insight.message}
                  secondary={
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        {insight.timestamp.toLocaleString('he-IL')}
                      </Typography>
                      {insight.actionable && (
                        <Chip 
                          label="ניתן לפעולה" 
                          size="small" 
                          color="success" 
                          sx={{ ml: 1 }}
                        />
                      )}
                    </Box>
                  }
                />
              </ListItem>
            ))}
          </List>
        </TabPanel>

        {/* טאב דפוסי למידה */}
        <TabPanel value={activeTab} index={2}>
          <Typography variant="h6" gutterBottom>
            📊 הדפוסים שזיהיתי בלמידה שלך
          </Typography>
          
          {learningPattern && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Paper elevation={2} sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom color="primary">
                    ⏰ זמני לימוד אופטימליים
                  </Typography>
                  <Box mb={2}>
                    <Typography variant="body1" fontWeight="bold">
                      השעות הכי יעילות: {learningPattern.bestStudyTime}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      בזמנים אלה הביצועים שלך 23% יותר טובים מהממוצע
                    </Typography>
                  </Box>
                  
                  <Typography variant="subtitle2" gutterBottom>
                    ימים עם ביצועים שיא:
                  </Typography>
                  <Box display="flex" gap={1} flexWrap="wrap">
                    {learningPattern.peakPerformanceDays.map((day, index) => (
                      <Chip key={index} label={day} color="success" size="small" />
                    ))}
                  </Box>
                </Paper>
              </Grid>

              <Grid item xs={12} md={6}>
                <Paper elevation={2} sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom color="primary">
                    📈 התקדמות והעדפות
                  </Typography>
                  <Box mb={2}>
                    <Typography variant="body2" gutterBottom>
                      קצב שיפור שבועי: {learningPattern.improvementRate}%
                    </Typography>
                    <LinearProgress 
                      variant="determinate" 
                      value={learningPattern.improvementRate * 2} 
                      color="success"
                      sx={{ mb: 1 }}
                    />
                  </Box>

                  <Typography variant="body2" gutterBottom>
                    משך סשן ממוצע: {learningPattern.averageSessionDuration} דקות
                  </Typography>

                  <Typography variant="subtitle2" gutterBottom sx={{ mt: 2 }}>
                    סוגי שאלות מועדפים:
                  </Typography>
                  <Box display="flex" gap={1} flexWrap="wrap">
                    {learningPattern.preferredQuestionTypes.map((type, index) => (
                      <Chip 
                        key={index} 
                        label={type} 
                        variant="outlined" 
                        size="small" 
                      />
                    ))}
                  </Box>
                </Paper>
              </Grid>

              <Grid item xs={12}>
                <Alert severity="success">
                  <Typography variant="subtitle2" gutterBottom>
                    🎯 המלצות לאופטימיזציה:
                  </Typography>
                  <Typography variant="body2">
                    • תכנן את הלמידה העיקרית ל{learningPattern.bestStudyTime}<br/>
                    • התמקד ב{learningPattern.peakPerformanceDays.join(', ')} ללמידה מאומצת<br/>
                    • שמור על סשנים של {learningPattern.averageSessionDuration} דקות לתוצאות מיטביות
                  </Typography>
                </Alert>
              </Grid>
            </Grid>
          )}
        </TabPanel>

        {/* אנימציית CSS */}
        <style>
          {`
            @keyframes pulse {
              0% { transform: scale(1); }
              50% { transform: scale(1.1); }
              100% { transform: scale(1); }
            }
          `}
        </style>
      </Card>
    </Box>
  );
};

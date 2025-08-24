import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Alert,
  IconButton,
  Collapse,
  Paper,
  Avatar,
  Badge
} from '@mui/material';
import {
  School as SchoolIcon,
  TrendingUp as TrendingUpIcon,
  Lightbulb as LightbulbIcon,
  Assignment as AssignmentIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  PlayArrow as PlayArrowIcon,
  Assessment as AssessmentIcon,
  Timeline as TimelineIcon,
  EmojiEvents as EmojiEventsIcon
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { 
  adaptiveLearningService,
  UserLearningProfile,
  PersonalizedRecommendation,
  LearningAnalytics,
  AdaptiveQuestion
} from '@shared/services/adaptiveLearning';

export const AdaptiveLearningPage: React.FC = () => {
  const { t } = useTranslation();
  const [userProfile, setUserProfile] = useState<UserLearningProfile | null>(null);
  const [recommendations, setRecommendations] = useState<PersonalizedRecommendation[]>([]);
  const [analytics, setAnalytics] = useState<LearningAnalytics | null>(null);
  const [adaptiveQuestions, setAdaptiveQuestions] = useState<AdaptiveQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedRecommendation, setExpandedRecommendation] = useState<string | null>(null);

  useEffect(() => {
    loadAdaptiveLearningData();
  }, []);

  const loadAdaptiveLearningData = async () => {
    try {
      setLoading(true);
      const userId = 'user_123'; // Mock user ID
      
      // Load user profile
      const profile = await adaptiveLearningService.getUserProfile(userId);
      setUserProfile(profile);

      // Load personalized recommendations
      const recs = await adaptiveLearningService.getPersonalizedRecommendations(userId);
      setRecommendations(recs);

      // Load learning analytics
      const analyticsData = await adaptiveLearningService.getLearningAnalytics(userId);
      setAnalytics(analyticsData);

      // Load adaptive questions
      const questions = await adaptiveLearningService.generateAdaptiveQuestions(userId, 'rental', 5);
      setAdaptiveQuestions(questions);
    } catch (error) {
      console.error('Error loading adaptive learning data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStartPractice = (recommendation: PersonalizedRecommendation) => {
    // Navigate to practice session
    console.log('Starting practice for:', recommendation.title);
  };

  const handleExpandRecommendation = (recommendationId: string) => {
    setExpandedRecommendation(expandedRecommendation === recommendationId ? null : recommendationId);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': {
        return 'error';
      }
      case 'medium': {
        return 'warning';
      }
      case 'low': {
        return 'success';
      }
      default: {
        return 'default';
      }
    }
  };

  const getRecommendationIcon = (type: string) => {
    switch (type) {
      case 'practice': {
        return <AssignmentIcon />;
      }
      case 'review': {
        return <SchoolIcon />;
      }
      case 'challenge': {
        return <EmojiEventsIcon />;
      }
      default: {
        return <LightbulbIcon />;
      }
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <LinearProgress />
        <Typography variant="h6" sx={{ mt: 2 }}>
          טוען נתוני למידה מותאמים אישית...
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
        <SchoolIcon sx={{ mr: 2, verticalAlign: 'middle' }} />
        למידה מותאמת אישית
      </Typography>

      {/* Learning Progress Overview */}
      {analytics && (
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              התקדמות הלמידה שלך
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={3}>
                <Box textAlign="center">
                  <Typography variant="h4" color="primary">
                    {analytics.overallProgress.toFixed(1)}%
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    התקדמות כללית
                  </Typography>
                  <LinearProgress 
                    variant="determinate" 
                    value={analytics.overallProgress} 
                    sx={{ mt: 1 }}
                  />
                </Box>
              </Grid>
              <Grid item xs={12} md={3}>
                <Box textAlign="center">
                  <Typography variant="h4" color="success.main">
                    {analytics.estimatedTimeToMastery}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    דקות עד מומחיות
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1" gutterBottom>
                  אבן דרך הבאה: {analytics.nextMilestone}
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {analytics.recommendedFocus.map((focus, index) => (
                    <Chip key={index} label={focus} size="small" color="primary" variant="outlined" />
                  ))}
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      )}

      {/* Personalized Recommendations */}
      <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
        <LightbulbIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
        המלצות מותאמות אישית
      </Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        {recommendations.map((recommendation) => (
          <Grid item xs={12} md={6} lg={4} key={recommendation.title}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  {getRecommendationIcon(recommendation.type)}
                  <Typography variant="h6" sx={{ ml: 1, flexGrow: 1 }}>
                    {recommendation.title}
                  </Typography>
                  <Chip 
                    label={recommendation.priority} 
                    color={getPriorityColor(recommendation.priority)}
                    size="small"
                  />
                </Box>
                
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {recommendation.description}
                </Typography>

                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <TimelineIcon sx={{ mr: 1, fontSize: 'small' }} />
                  <Typography variant="body2">
                    זמן משוער: {recommendation.estimatedTime} דקות
                  </Typography>
                </Box>

                <Button
                  size="small"
                  onClick={() => handleExpandRecommendation(recommendation.title)}
                  endIcon={expandedRecommendation === recommendation.title ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                >
                  פרטים נוספים
                </Button>

                <Collapse in={expandedRecommendation === recommendation.title}>
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      תוצאה צפויה:
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 2 }}>
                      {recommendation.expectedOutcome}
                    </Typography>
                    
                    <Typography variant="subtitle2" gutterBottom>
                      נושאים קשורים:
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {recommendation.relatedTopics.map((topic, index) => (
                        <Chip key={index} label={topic} size="small" variant="outlined" />
                      ))}
                    </Box>
                  </Box>
                </Collapse>
              </CardContent>
              
              <CardActions>
                <Button 
                  startIcon={<PlayArrowIcon />}
                  variant="contained" 
                  fullWidth
                  onClick={() => handleStartPractice(recommendation)}
                >
                  התחל תרגול
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Learning Analytics */}
      {analytics && (
        <>
          <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
            <AssessmentIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
            ניתוח ביצועים
          </Typography>

          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    אזורים חזקים
                  </Typography>
                  <List dense>
                    {analytics.strengthAreas.map((strength, index) => (
                      <ListItem key={index}>
                        <ListItemIcon>
                          <CheckCircleIcon color="success" />
                        </ListItemIcon>
                        <ListItemText primary={strength} />
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    אזורים לשיפור
                  </Typography>
                  <List dense>
                    {analytics.improvementAreas.map((area, index) => (
                      <ListItem key={index}>
                        <ListItemIcon>
                          <WarningIcon color="warning" />
                        </ListItemIcon>
                        <ListItemText primary={area} />
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </>
      )}

      {/* Adaptive Questions */}
      {adaptiveQuestions.length > 0 && (
        <>
          <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
            <AssignmentIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
            שאלות מותאמות אישית
          </Typography>

          <Grid container spacing={3}>
            {adaptiveQuestions.map((question, index) => (
              <Grid item xs={12} key={question.id}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Chip 
                        label={question.category} 
                        color="primary" 
                        size="small" 
                        sx={{ mr: 2 }}
                      />
                      <Chip 
                        label={question.difficulty} 
                        variant="outlined" 
                        size="small"
                      />
                    </Box>

                    <Typography variant="h6" gutterBottom>
                      שאלה {index + 1}
                    </Typography>
                    
                    <Typography variant="body1" sx={{ mb: 2 }}>
                      {question.adaptedQuestion}
                    </Typography>

                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                      {question.hints.map((hint, hintIndex) => (
                        <Chip 
                          key={hintIndex} 
                          label={`רמז ${hintIndex + 1}`} 
                          size="small" 
                          variant="outlined"
                          icon={<LightbulbIcon />}
                        />
                      ))}
                    </Box>

                    <Button 
                      variant="outlined" 
                      startIcon={<PlayArrowIcon />}
                      onClick={() => console.log('Start question:', question.id)}
                    >
                      התחל שאלה
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </>
      )}

      {/* User Profile Summary */}
      {userProfile && (
        <Card sx={{ mt: 4 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              פרופיל למידה
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <Typography variant="subtitle2" color="text.secondary">
                  סגנון למידה מועדף
                </Typography>
                <Typography variant="body1">
                  {userProfile.preferences.learningStyle === 'interactive' ? 'אינטראקטיבי' :
                   userProfile.preferences.learningStyle === 'visual' ? 'ויזואלי' : 'טקסטואלי'}
                </Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography variant="subtitle2" color="text.secondary">
                  רמת קושי מועדפת
                </Typography>
                <Typography variant="body1">
                  {userProfile.preferences.preferredDifficulty}
                </Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography variant="subtitle2" color="text.secondary">
                  זמן ממוצע לשאלה
                </Typography>
                <Typography variant="body1">
                  {userProfile.preferences.timePerQuestion} שניות
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      )}
    </Container>
  );
};

import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  Typography, 
  Box, 
  LinearProgress,
  Chip,
  Grid,
  Paper,
  Avatar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Tooltip,
  IconButton,
  Tabs,
  Tab
} from '@mui/material';
import { 
  TrendingUp as TrendingUpIcon,
  Timer as TimerIcon,
  School as SchoolIcon,
  Star as StarIcon,
  EmojiEvents as TrophyIcon,
  Speed as SpeedIcon,
  GpsFixed as TargetIcon,
  CalendarToday as CalendarIcon,
  Bookmark as BookmarkIcon,
  Download as DownloadIcon
} from '@mui/icons-material';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Cell,
  PieChart,
  Pie
} from 'recharts';

interface ProgressData {
  userId: string;
  totalPoints: number;
  level: number;
  nextLevelPoints: number;
  studyStreak: number;
  totalStudyTime: number; // בדקות
  topicsCompleted: number;
  totalTopics: number;
  averageAccuracy: number;
  dailyProgress: DailyProgress[];
  topicProgress: TopicProgress[];
  achievements: Achievement[];
  weeklyGoal: number;
  monthlyGoal: number;
  bookmarkedItems: number;
}

interface DailyProgress {
  date: string;
  points: number;
  studyTime: number;
  accuracy: number;
  questionsAnswered: number;
}

interface TopicProgress {
  topic: string;
  icon: string;
  color: string;
  mastery: number; // 0-100
  timeSpent: number;
  lastStudied: Date;
  difficulty: number;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  dateEarned: Date;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

interface ProgressTrackerProps {
  progressData: ProgressData;
  onExportProgress?: () => void;
  onSetGoal?: (type: 'weekly' | 'monthly', value: number) => void;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const rarityColors = {
  common: '#9e9e9e',
  rare: '#2196f3', 
  epic: '#9c27b0',
  legendary: '#ff9800'
};

export const ProgressTracker: React.FC<ProgressTrackerProps> = ({
  progressData,
  onExportProgress,
  onSetGoal
}) => {
  const [activeTab, setActiveTab] = useState(0);

  const levelProgress = (progressData.totalPoints % 1000) / 10; // כל 1000 נקודות = רמה
  const pointsToNextLevel = progressData.nextLevelPoints - progressData.totalPoints;
  
  // הכנת נתונים לתרשימים
  const radarData = progressData.topicProgress.map(topic => ({
    subject: topic.topic,
    mastery: topic.mastery,
    fullMark: 100
  }));

  const pieData = progressData.topicProgress.map((topic, index) => ({
    name: topic.topic,
    value: topic.timeSpent,
    color: COLORS[index % COLORS.length]
  }));

  const getStreakColor = (streak: number) => {
    if (streak >= 30) return '#4caf50';
    if (streak >= 14) return '#ff9800';
    if (streak >= 7) return '#2196f3';
    return '#9e9e9e';
  };

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}ש ${mins}ד` : `${mins}ד`;
  };

  const TabPanel = ({ children, value, index }: any) => (
    <div hidden={value !== index}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );

  return (
    <Box sx={{ maxWidth: 1200, margin: 'auto', p: 2 }}>
      {/* כותרת עם נתונים כלליים */}
      <Card sx={{ mb: 3, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
        <CardContent>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={3}>
              <Box textAlign="center">
                <Avatar sx={{ 
                  width: 80, 
                  height: 80, 
                  fontSize: '2rem',
                  bgcolor: 'rgba(255,255,255,0.2)',
                  margin: 'auto',
                  mb: 1
                }}>
                  <TrophyIcon fontSize="large" />
                </Avatar>
                <Typography variant="h4" fontWeight="bold">
                  רמה {progressData.level}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                  {pointsToNextLevel} נקודות לרמה הבאה
                </Typography>
              </Box>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                התקדמות לרמה הבאה
              </Typography>
              <LinearProgress 
                variant="determinate" 
                value={levelProgress} 
                sx={{ 
                  height: 12, 
                  borderRadius: 6,
                  backgroundColor: 'rgba(255,255,255,0.3)',
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: 'white'
                  }
                }}
              />
              <Typography variant="body2" sx={{ mt: 1, opacity: 0.9 }}>
                {progressData.totalPoints.toLocaleString()} נקודות כוללות
              </Typography>
            </Grid>
            
            <Grid item xs={12} md={3}>
              <Box display="flex" flexDirection="column" gap={1}>
                <Chip 
                  icon={<StarIcon />}
                  label={`${progressData.studyStreak} ימי רצף`}
                  sx={{ 
                    backgroundColor: getStreakColor(progressData.studyStreak),
                    color: 'white'
                  }}
                />
                <Chip 
                  icon={<TimerIcon />}
                  label={formatTime(progressData.totalStudyTime)}
                  sx={{ backgroundColor: 'rgba(255,255,255,0.2)', color: 'white' }}
                />
                <Chip 
                  icon={<SchoolIcon />}
                  label={`${progressData.topicsCompleted}/${progressData.totalTopics} נושאים`}
                  sx={{ backgroundColor: 'rgba(255,255,255,0.2)', color: 'white' }}
                />
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* טאבים */}
      <Card>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs 
            value={activeTab} 
            onChange={(_, newValue) => setActiveTab(newValue)}
            sx={{ px: 2 }}
          >
            <Tab icon={<TrendingUpIcon />} label="התקדמות יומית" />
            <Tab icon={<TargetIcon />} label="מיומנות בנושאים" />
            <Tab icon={<TrophyIcon />} label="הישגים" />
            <Tab icon={<SpeedIcon />} label="סטטיסטיקות" />
          </Tabs>
        </Box>

        {/* טאב התקדמות יומית */}
        <TabPanel value={activeTab} index={0}>
          <Typography variant="h6" gutterBottom>
            📈 התקדמות השבועיים האחרונים
          </Typography>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={progressData.dailyProgress}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <RechartsTooltip 
                formatter={(value: any, name: string) => [
                  name === 'points' ? `${value} נקודות` :
                  name === 'studyTime' ? `${value} דקות` :
                  name === 'accuracy' ? `${value}%` : value,
                  name === 'points' ? 'נקודות' :
                  name === 'studyTime' ? 'זמן לימוד' :
                  name === 'accuracy' ? 'דיוק' : name
                ]}
              />
              <Area 
                type="monotone" 
                dataKey="points" 
                stackId="1"
                stroke="#8884d8" 
                fill="#8884d8" 
                fillOpacity={0.6}
              />
              <Area 
                type="monotone" 
                dataKey="studyTime" 
                stackId="2"
                stroke="#82ca9d" 
                fill="#82ca9d" 
                fillOpacity={0.6}
              />
            </AreaChart>
          </ResponsiveContainer>
        </TabPanel>

        {/* טאב מיומנות בנושאים */}
        <TabPanel value={activeTab} index={1}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                🎯 רמת מיומנות בנושאים
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <RadarChart data={radarData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="subject" />
                  <PolarRadiusAxis 
                    angle={90} 
                    domain={[0, 100]}
                    tick={false}
                  />
                  <Radar 
                    name="מיומנות" 
                    dataKey="mastery" 
                    stroke="#8884d8" 
                    fill="#8884d8" 
                    fillOpacity={0.3}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                ⏱️ זמן לימוד לפי נושא
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip formatter={(value) => `${value} דקות`} />
                </PieChart>
              </ResponsiveContainer>
            </Grid>
          </Grid>

          {/* רשימת נושאים */}
          <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
            📚 פירוט נושאים
          </Typography>
          <Grid container spacing={2}>
            {progressData.topicProgress.map((topic, index) => (
              <Grid item xs={12} md={6} key={index}>
                <Paper elevation={1} sx={{ p: 2 }}>
                  <Box display="flex" alignItems="center" gap={2} mb={1}>
                    <Box sx={{ fontSize: '1.5rem' }}>{topic.icon}</Box>
                    <Typography variant="subtitle1" fontWeight="bold">
                      {topic.topic}
                    </Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={topic.mastery} 
                    sx={{ 
                      mb: 1,
                      backgroundColor: '#f0f0f0',
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: topic.color
                      }
                    }}
                  />
                  <Box display="flex" justifyContent="space-between">
                    <Typography variant="caption">
                      מיומנות: {topic.mastery}%
                    </Typography>
                    <Typography variant="caption">
                      {formatTime(topic.timeSpent)}
                    </Typography>
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </TabPanel>

        {/* טאב הישגים */}
        <TabPanel value={activeTab} index={2}>
          <Typography variant="h6" gutterBottom>
            🏆 הישגים שנצברו
          </Typography>
          <Grid container spacing={2}>
            {progressData.achievements.map((achievement, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card 
                  elevation={2}
                  sx={{ 
                    border: `2px solid ${rarityColors[achievement.rarity]}`,
                    backgroundColor: `${rarityColors[achievement.rarity]}10`
                  }}
                >
                  <CardContent sx={{ textAlign: 'center' }}>
                    <Typography variant="h3" sx={{ mb: 1 }}>
                      {achievement.icon}
                    </Typography>
                    <Typography variant="h6" gutterBottom>
                      {achievement.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" paragraph>
                      {achievement.description}
                    </Typography>
                    <Chip 
                      label={achievement.rarity}
                      size="small"
                      sx={{ 
                        backgroundColor: rarityColors[achievement.rarity],
                        color: 'white'
                      }}
                    />
                    <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                      {achievement.dateEarned.toLocaleDateString('he-IL')}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </TabPanel>

        {/* טאב סטטיסטיקות */}
        <TabPanel value={activeTab} index={3}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Paper elevation={2} sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  📊 סטטיסטיקות כלליות
                </Typography>
                <List>
                  <ListItem>
                    <ListItemIcon><SpeedIcon /></ListItemIcon>
                    <ListItemText 
                      primary="דיוק ממוצע"
                      secondary={`${progressData.averageAccuracy}%`}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><TimerIcon /></ListItemIcon>
                    <ListItemText 
                      primary="זמן לימוד כולל"
                      secondary={formatTime(progressData.totalStudyTime)}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><BookmarkIcon /></ListItemIcon>
                    <ListItemText 
                      primary="פריטים שמורים"
                      secondary={`${progressData.bookmarkedItems} פריטים`}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><StarIcon /></ListItemIcon>
                    <ListItemText 
                      primary="רצף לימוד נוכחי"
                      secondary={`${progressData.studyStreak} ימים`}
                    />
                  </ListItem>
                </List>
              </Paper>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Paper elevation={2} sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  🎯 יעדים
                </Typography>
                <Box mb={2}>
                  <Typography variant="body2" gutterBottom>
                    יעד שבועי: {progressData.weeklyGoal} נקודות
                  </Typography>
                  <LinearProgress 
                    variant="determinate" 
                    value={Math.min((progressData.totalPoints / progressData.weeklyGoal) * 100, 100)}
                    color="primary"
                  />
                </Box>
                <Box mb={3}>
                  <Typography variant="body2" gutterBottom>
                    יעד חודשי: {progressData.monthlyGoal} נקודות
                  </Typography>
                  <LinearProgress 
                    variant="determinate" 
                    value={Math.min((progressData.totalPoints / progressData.monthlyGoal) * 100, 100)}
                    color="secondary"
                  />
                </Box>
                
                {onExportProgress && (
                  <Box textAlign="center">
                    <IconButton 
                      onClick={onExportProgress}
                      color="primary"
                      size="large"
                    >
                      <DownloadIcon />
                    </IconButton>
                    <Typography variant="caption" display="block">
                      ייצא התקדמות ל-PDF
                    </Typography>
                  </Box>
                )}
              </Paper>
            </Grid>
          </Grid>
        </TabPanel>
      </Card>
    </Box>
  );
};

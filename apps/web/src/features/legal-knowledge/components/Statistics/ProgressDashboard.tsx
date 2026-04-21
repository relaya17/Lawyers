import React from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  Typography, 
  Grid, 
  Box,
  Chip,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import {
  Timer as TimerIcon,
  CheckCircle as CheckIcon,
  Cancel as CancelIcon,
  School as SchoolIcon,
  EmojiEvents as TrophyIcon,
  MenuBook as BookIcon,
  Gavel as GavelIcon,
  AutoFixHigh as CustomIcon
} from '@mui/icons-material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { UserProgress } from '../../types';

interface ProgressDashboardProps {
  userProgress: UserProgress;
}

const categoryIcons = {
  'laws': <BookIcon />,
  'precedents': <GavelIcon />,
  'customs': <CustomIcon />,
  'comparative-law': <SchoolIcon />,
  'interpretations': <BookIcon />
};

const categoryNames = {
  'laws': 'חוקים',
  'precedents': 'תקדימים', 
  'customs': 'מנהגים',
  'comparative-law': 'משפט השוואתי',
  'interpretations': 'פרשנויות',
  'constitutional-law': 'משפט חוקתי',
  'civil-law': 'משפט אזרחי',
  'criminal-law': 'משפט פלילי',
  'administrative-law': 'משפט מנהלי'
};

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export const ProgressDashboard: React.FC<ProgressDashboardProps> = ({ userProgress }) => {
  const overallAccuracy = userProgress.totalQuestionsAnswered > 0 
    ? Math.round((userProgress.totalCorrectAnswers / userProgress.totalQuestionsAnswered) * 100)
    : 0;

  // הכנת נתונים לתרשימים
  const categoryData = Object.entries(userProgress.categoryProgress).map(([category, progress]) => ({
    name: categoryNames[category as keyof typeof categoryNames] || category,
    accuracy: progress.questionsAnswered > 0 ? Math.round((progress.correctAnswers / progress.questionsAnswered) * 100) : 0,
    questions: progress.questionsAnswered,
    avgTime: Math.round(progress.averageTime)
  }));

  const pieData = categoryData.map((item, index) => ({
    name: item.name,
    value: item.questions,
    color: COLORS[index % COLORS.length]
  }));

  const getMasteryColor = (level: string) => {
    switch (level) {
      case 'expert': return 'success';
      case 'advanced': return 'info';
      case 'intermediate': return 'warning';
      default: return 'default';
    }
  };

  const getMasteryLabel = (level: string) => {
    switch (level) {
      case 'expert': return 'מומחה';
      case 'advanced': return 'מתקדם';
      case 'intermediate': return 'בינוני';
      default: return 'מתחיל';
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 4, textAlign: 'center' }}>
        📊 לוח התקדמות אישי
      </Typography>

      {/* סטטיסטיקות כלליות */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <CheckIcon sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
              <Typography variant="h4" color="success.main">
                {overallAccuracy}%
              </Typography>
              <Typography variant="body2" color="text.secondary">
                דיוק כללי
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <SchoolIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
              <Typography variant="h4" color="primary.main">
                {userProgress.totalQuestionsAnswered}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                שאלות נענו
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <TimerIcon sx={{ fontSize: 40, color: 'warning.main', mb: 1 }} />
              <Typography variant="h4" color="warning.main">
                {Math.round(userProgress.averageTimePerQuestion)}s
              </Typography>
              <Typography variant="body2" color="text.secondary">
                זמן ממוצע לשאלה
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <TrophyIcon sx={{ fontSize: 40, color: 'gold', mb: 1 }} />
              <Typography variant="h4" sx={{ color: 'gold' }}>
                {userProgress.achievements.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                הישגים
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* תרשימים */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardHeader title="📈 דיוק לפי קטגוריות" />
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={categoryData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value, name) => [
                      name === 'accuracy' ? `${value}%` : value,
                      name === 'accuracy' ? 'דיוק' : name === 'questions' ? 'שאלות' : 'זמן ממוצע'
                    ]}
                  />
                  <Legend />
                  <Bar dataKey="accuracy" fill="#8884d8" name="דיוק %" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card>
            <CardHeader title="🥧 חלוקת שאלות לפי נושא" />
            <CardContent>
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
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* התקדמות לפי קטגוריות */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader title="💪 נקודות חוזק" />
            <CardContent>
              <List>
                {userProgress.strongAreas.map((area, index) => (
                  <ListItem key={index}>
                    <ListItemIcon sx={{ color: 'success.main' }}>
                      {categoryIcons[area as keyof typeof categoryIcons] || <CheckIcon />}
                    </ListItemIcon>
                    <ListItemText 
                      primary={categoryNames[area as keyof typeof categoryNames] || area}
                      secondary={`רמת מיומנות: ${getMasteryLabel(userProgress.categoryProgress[area]?.masteryLevel || 'beginner')}`}
                    />
                    <Chip 
                      size="small" 
                      label={getMasteryLabel(userProgress.categoryProgress[area]?.masteryLevel || 'beginner')}
                      color={getMasteryColor(userProgress.categoryProgress[area]?.masteryLevel || 'beginner') as any}
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader title="📚 נושאים לחיזוק" />
            <CardContent>
              <List>
                {userProgress.weakAreas.map((area, index) => (
                  <ListItem key={index}>
                    <ListItemIcon sx={{ color: 'warning.main' }}>
                      {categoryIcons[area as keyof typeof categoryIcons] || <CancelIcon />}
                    </ListItemIcon>
                    <ListItemText 
                      primary={categoryNames[area as keyof typeof categoryNames] || area}
                      secondary="דורש תרגול נוסף"
                    />
                    <Chip size="small" label="לתרגול" color="warning" />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* המלצות ללימוד */}
      <Card>
        <CardHeader title="🎯 המלצות ללימוד נוסף" />
        <CardContent>
          <Grid container spacing={2}>
            {userProgress.recommendedStudy.map((recommendation, index) => (
              <Grid item xs={12} md={6} key={index}>
                <Paper elevation={1} sx={{ p: 2 }}>
                  <Typography variant="body1" gutterBottom>
                    📖 {recommendation}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>

      {/* הישגים */}
      {userProgress.achievements.length > 0 && (
        <Card sx={{ mt: 3 }}>
          <CardHeader title="🏆 הישגים שלי" />
          <CardContent>
            <Grid container spacing={2}>
              {userProgress.achievements.map((achievement, index) => (
                <Grid item xs={12} md={4} key={index}>
                  <Paper elevation={2} sx={{ p: 2, textAlign: 'center', backgroundColor: '#fff3e0' }}>
                    <Typography variant="h4" sx={{ mb: 1 }}>
                      {achievement.icon}
                    </Typography>
                    <Typography variant="h6" gutterBottom>
                      {achievement.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {achievement.description}
                    </Typography>
                    <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                      הושג ב: {new Date(achievement.unlockedAt).toLocaleDateString('he-IL')}
                    </Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

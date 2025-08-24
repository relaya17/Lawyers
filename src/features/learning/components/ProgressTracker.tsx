import React, { useState } from 'react'
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  LinearProgress,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Divider,
  Button,
  IconButton,
  Tooltip,
  Avatar,
  Badge,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material'
import {
  School,
  PlayArrow,
  CheckCircle,
  Schedule,
  TrendingUp,
  TrendingDown,
  Assignment,
  Quiz,
  VideoLibrary,
  Book,
  Star,
  StarBorder,
  ExpandMore,
  CalendarToday,
  AccessTime,
  Person,
  EmojiEvents,
  Psychology,
  Speed
} from '@mui/icons-material'
import { useTranslation } from 'react-i18next'

interface CourseProgress {
  id: string
  title: string
  description: string
  totalLessons: number
  completedLessons: number
  totalQuizzes: number
  completedQuizzes: number
  totalAssignments: number
  completedAssignments: number
  overallProgress: number
  lastAccessed: Date
  estimatedCompletion: Date
  grade?: number
  certificate?: boolean
  category: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  timeSpent: number // in minutes
  streak: number // consecutive days
}

interface LearningStats {
  totalCourses: number
  completedCourses: number
  totalTimeSpent: number
  averageGrade: number
  currentStreak: number
  longestStreak: number
  certificatesEarned: number
  weeklyProgress: Array<{
    date: string
    timeSpent: number
    lessonsCompleted: number
  }>
  monthlyProgress: Array<{
    month: string
    coursesCompleted: number
    timeSpent: number
  }>
}

interface ProgressTrackerProps {
  courses: CourseProgress[]
  stats: LearningStats
  onViewCourse: (courseId: string) => void
  onContinueCourse: (courseId: string) => void
  onViewCertificate: (courseId: string) => void
}

const ProgressTracker: React.FC<ProgressTrackerProps> = ({
  courses,
  stats,
  onViewCourse,
  onContinueCourse,
  onViewCertificate
}) => {
  const { t } = useTranslation()
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [sortBy, setSortBy] = useState<string>('progress')

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'success'
      case 'intermediate':
        return 'warning'
      case 'advanced':
        return 'error'
      default:
        return 'default'
    }
  }

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'success'
    if (progress >= 60) return 'warning'
    return 'error'
  }

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('he-IL')
  }

  const filteredCourses = selectedCategory === 'all' 
    ? courses 
    : courses.filter(course => course.category === selectedCategory)

  const sortedCourses = [...filteredCourses].sort((a, b) => {
    switch (sortBy) {
      case 'progress':
        return b.overallProgress - a.overallProgress
      case 'recent':
        return b.lastAccessed.getTime() - a.lastAccessed.getTime()
      case 'time':
        return b.timeSpent - a.timeSpent
      case 'streak':
        return b.streak - a.streak
      default:
        return 0
    }
  })

  const categories = ['all', ...Array.from(new Set(courses.map(c => c.category)))]

  return (
    <Box>
      {/* Header Stats */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <School sx={{ color: 'primary.main' }} />
            <Typography variant="h5" component="h2">
              {t('learning.progressTracker.title')}
            </Typography>
          </Box>
          <Chip
            icon={<TrendingUp />}
            label={`${stats.currentStreak} ${t('learning.daysStreak')}`}
            color="primary"
            variant="outlined"
          />
        </Box>
        <Typography variant="body1" color="text.secondary">
          {t('learning.progressTracker.description')}
        </Typography>
      </Paper>

      {/* Overall Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                <Book color="primary" />
                <Typography variant="h6">
                  {t('learning.courses')}
                </Typography>
              </Box>
              <Typography variant="h3" color="primary">
                {stats.completedCourses}/{stats.totalCourses}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {t('learning.completed')}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                <AccessTime color="success" />
                <Typography variant="h6">
                  {t('learning.timeSpent')}
                </Typography>
              </Box>
              <Typography variant="h3" color="success.main">
                {formatTime(stats.totalTimeSpent)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {t('learning.totalTime')}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                <Star color="warning" />
                <Typography variant="h6">
                  {t('learning.averageGrade')}
                </Typography>
              </Box>
              <Typography variant="h3" color="warning.main">
                {stats.averageGrade}%
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {t('learning.overallGrade')}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                <EmojiEvents color="error" />
                <Typography variant="h6">
                  {t('learning.certificates')}
                </Typography>
              </Box>
              <Typography variant="h3" color="error.main">
                {stats.certificatesEarned}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {t('learning.earned')}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Course Progress List */}
      <Paper elevation={2} sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6">
            {t('learning.courseProgress')}
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Chip
              label={t('learning.allCategories')}
              color={selectedCategory === 'all' ? 'primary' : 'default'}
              onClick={() => setSelectedCategory('all')}
              clickable
            />
            {categories.filter(c => c !== 'all').map(category => (
              <Chip
                key={category}
                label={t(`learning.categories.${category}`)}
                color={selectedCategory === category ? 'primary' : 'default'}
                onClick={() => setSelectedCategory(category)}
                clickable
              />
            ))}
          </Box>
        </Box>

        <List>
          {sortedCourses.map((course, index) => (
            <React.Fragment key={course.id}>
              <ListItem
                sx={{
                  border: 1,
                  borderColor: 'divider',
                  borderRadius: 1,
                  mb: 1,
                  '&:hover': {
                    backgroundColor: 'action.hover'
                  }
                }}
              >
                <ListItemIcon>
                  <Avatar sx={{ bgcolor: getProgressColor(course.overallProgress) }}>
                    <School />
                  </Avatar>
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="h6">
                        {course.title}
                      </Typography>
                      <Chip
                        label={t(`learning.difficulty.${course.difficulty}`)}
                        color={getDifficultyColor(course.difficulty) as any}
                        size="small"
                      />
                      {course.certificate && (
                        <Tooltip title={t('learning.certificateEarned')}>
                          <EmojiEvents color="success" />
                        </Tooltip>
                      )}
                    </Box>
                  }
                  secondary={
                    <Box>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        {course.description}
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 1 }}>
                        <Typography variant="caption" color="text.secondary">
                          {t('learning.lessons')}: {course.completedLessons}/{course.totalLessons}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {t('learning.quizzes')}: {course.completedQuizzes}/{course.totalQuizzes}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {t('learning.assignments')}: {course.completedAssignments}/{course.totalAssignments}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                        <Typography variant="caption" color="text.secondary">
                          {t('learning.timeSpent')}: {formatTime(course.timeSpent)}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {t('learning.streak')}: {course.streak} {t('learning.days')}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {t('learning.lastAccessed')}: {formatDate(course.lastAccessed)}
                        </Typography>
                      </Box>
                    </Box>
                  }
                />
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                  <Typography variant="h4" color={getProgressColor(course.overallProgress)}>
                    {course.overallProgress}%
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={course.overallProgress}
                    color={getProgressColor(course.overallProgress) as any}
                    sx={{ width: 100, height: 8, borderRadius: 4 }}
                  />
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                      size="small"
                      startIcon={<PlayArrow />}
                      onClick={() => onContinueCourse(course.id)}
                      disabled={course.overallProgress === 100}
                    >
                      {course.overallProgress === 100 ? t('learning.completed') : t('learning.continue')}
                    </Button>
                    {course.certificate && (
                      <Button
                        size="small"
                        startIcon={<EmojiEvents />}
                        onClick={() => onViewCertificate(course.id)}
                      >
                        {t('learning.viewCertificate')}
                      </Button>
                    )}
                  </Box>
                </Box>
              </ListItem>
              {index < sortedCourses.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </List>

        {sortedCourses.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <School sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              {t('learning.noCourses')}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {t('learning.noCoursesDescription')}
            </Typography>
          </Box>
        )}
      </Paper>
    </Box>
  )
}

export default ProgressTracker

import React, { useState } from 'react'
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  Avatar,
  LinearProgress,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Rating,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Divider,
  IconButton,
  Tooltip
} from '@mui/material'
import {
  Search,
  School,
  PlayArrow,
  Book,
  Assignment,
  Quiz,
  Star,
  AccessTime,
  Person,
  FilterList,
  Sort,
  Favorite,
  FavoriteBorder,
  Share,
  Download,
  Info
} from '@mui/icons-material'
import { useTranslation } from 'react-i18next'

interface Course {
  id: string
  title: string
  description: string
  instructor: string
  category: string
  level: 'beginner' | 'intermediate' | 'advanced'
  duration: number // in minutes
  lessons: number
  rating: number
  enrolledStudents: number
  price: number
  isFree: boolean
  thumbnail: string
  tags: string[]
  progress?: number
  isEnrolled?: boolean
  isFavorite?: boolean
}

interface CourseListProps {
  courses: Course[]
  onEnroll: (courseId: string) => void
  onViewCourse: (courseId: string) => void
  onToggleFavorite: (courseId: string) => void
}

const CourseList: React.FC<CourseListProps> = ({
  courses,
  onEnroll,
  onViewCourse,
  onToggleFavorite
}) => {
  const { t } = useTranslation()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedLevel, setSelectedLevel] = useState('all')
  const [sortBy, setSortBy] = useState('popularity')
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null)

  const categories = [
    'all',
    'contract-law',
    'business-law',
    'employment-law',
    'real-estate-law',
    'intellectual-property',
    'compliance',
    'negotiation',
    'legal-writing'
  ]

  const levels = [
    'all',
    'beginner',
    'intermediate',
    'advanced'
  ]

  const sortOptions = [
    { value: 'popularity', label: 'פופולריות' },
    { value: 'rating', label: 'דירוג' },
    { value: 'newest', label: 'חדש ביותר' },
    { value: 'price', label: 'מחיר' },
    { value: 'duration', label: 'משך' }
  ]

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.instructor.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || course.category === selectedCategory
    const matchesLevel = selectedLevel === 'all' || course.level === selectedLevel
    
    return matchesSearch && matchesCategory && matchesLevel
  })

  const sortedCourses = [...filteredCourses].sort((a, b) => {
    switch (sortBy) {
      case 'rating':
        return b.rating - a.rating
      case 'newest':
        return new Date(b.id).getTime() - new Date(a.id).getTime()
      case 'price':
        return a.price - b.price
      case 'duration':
        return a.duration - b.duration
      default:
        return b.enrolledStudents - a.enrolledStudents
    }
  })

  const getLevelColor = (level: string) => {
    switch (level) {
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

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return hours > 0 ? `${hours} שעות ${mins} דקות` : `${mins} דקות`
  }

  const handleViewCourse = (course: Course) => {
    setSelectedCourse(course)
  }

  const handleCloseDialog = () => {
    setSelectedCourse(null)
  }

  return (
    <Box>
      {/* Search and Filters */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              placeholder={t('learning.searchCourses')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                )
              }}
            />
          </Grid>
          <Grid item xs={12} md={2}>
            <FormControl fullWidth>
              <InputLabel>{t('learning.category')}</InputLabel>
              <Select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                label={t('learning.category')}
              >
                {categories.map(category => (
                  <MenuItem key={category} value={category}>
                    {t(`learning.categories.${category}`)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={2}>
            <FormControl fullWidth>
              <InputLabel>{t('learning.level')}</InputLabel>
              <Select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                label={t('learning.level')}
              >
                {levels.map(level => (
                  <MenuItem key={level} value={level}>
                    {t(`learning.levels.${level}`)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={2}>
            <FormControl fullWidth>
              <InputLabel>{t('learning.sortBy')}</InputLabel>
              <Select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                label={t('learning.sortBy')}
              >
                {sortOptions.map(option => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={2}>
            <Typography variant="body2" color="text.secondary">
              {t('learning.foundCourses', { count: sortedCourses.length })}
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      {/* Course Grid */}
      <Grid container spacing={3}>
        {sortedCourses.map((course) => (
          <Grid item xs={12} sm={6} md={4} key={course.id}>
            <Card 
              elevation={2}
              sx={{ 
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                cursor: 'pointer',
                '&:hover': {
                  elevation: 4
                }
              }}
              onClick={() => handleViewCourse(course)}
            >
              <Box sx={{ position: 'relative' }}>
                <Box
                  sx={{
                    height: 160,
                    background: `linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white'
                  }}
                >
                  <School sx={{ fontSize: 60 }} />
                </Box>
                <IconButton
                  sx={{ position: 'absolute', top: 8, right: 8 }}
                  onClick={(e) => {
                    e.stopPropagation()
                    onToggleFavorite(course.id)
                  }}
                >
                  {course.isFavorite ? <Favorite color="error" /> : <FavoriteBorder />}
                </IconButton>
                {course.isEnrolled && (
                  <Chip
                    label={t('learning.enrolled')}
                    color="success"
                    size="small"
                    sx={{ position: 'absolute', top: 8, left: 8 }}
                  />
                )}
              </Box>

              <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                <Typography variant="h6" gutterBottom>
                  {course.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  {course.description}
                </Typography>

                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Person sx={{ fontSize: 16, mr: 0.5 }} />
                  <Typography variant="caption" color="text.secondary">
                    {course.instructor}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Rating value={course.rating} readOnly size="small" />
                  <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                    ({course.rating})
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                  <Chip
                    label={t(`learning.levels.${course.level}`)}
                    color={getLevelColor(course.level) as any}
                    size="small"
                  />
                  <Chip
                    label={t(`learning.categories.${course.category}`)}
                    variant="outlined"
                    size="small"
                  />
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <AccessTime sx={{ fontSize: 16, mr: 0.5 }} />
                    <Typography variant="caption" color="text.secondary">
                      {formatDuration(course.duration)}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Book sx={{ fontSize: 16, mr: 0.5 }} />
                    <Typography variant="caption" color="text.secondary">
                      {course.lessons} {t('learning.lessons')}
                    </Typography>
                  </Box>
                </Box>

                {course.isEnrolled && course.progress !== undefined && (
                  <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                      <Typography variant="caption" color="text.secondary">
                        {t('learning.progress')}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {course.progress}%
                      </Typography>
                    </Box>
                    <LinearProgress variant="determinate" value={course.progress} />
                  </Box>
                )}

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 'auto' }}>
                  <Typography variant="h6" color="primary">
                    {course.isFree ? t('learning.free') : `₪${course.price}`}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {course.enrolledStudents} {t('learning.students')}
                  </Typography>
                </Box>
              </CardContent>

              <CardActions>
                {course.isEnrolled ? (
                  <Button
                    fullWidth
                    variant="contained"
                    startIcon={<PlayArrow />}
                    onClick={(e) => {
                      e.stopPropagation()
                      onViewCourse(course.id)
                    }}
                  >
                    {t('learning.continue')}
                  </Button>
                ) : (
                  <Button
                    fullWidth
                    variant="contained"
                    onClick={(e) => {
                      e.stopPropagation()
                      onEnroll(course.id)
                    }}
                  >
                    {course.isFree ? t('learning.enroll') : t('learning.buy')}
                  </Button>
                )}
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Course Details Dialog */}
      <Dialog
        open={!!selectedCourse}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        {selectedCourse && (
          <>
            <DialogTitle>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h5">
                  {selectedCourse.title}
                </Typography>
                <Box>
                  <IconButton>
                    <Share />
                  </IconButton>
                  <IconButton>
                    <Download />
                  </IconButton>
                  <IconButton onClick={handleCloseDialog}>
                    <Info />
                  </IconButton>
                </Box>
              </Box>
            </DialogTitle>
            <DialogContent>
              <Grid container spacing={3}>
                <Grid item xs={12} md={8}>
                  <Typography variant="body1" paragraph>
                    {selectedCourse.description}
                  </Typography>
                  
                  <Typography variant="h6" gutterBottom>
                    {t('learning.whatYouWillLearn')}
                  </Typography>
                  <List dense>
                    <ListItem>
                      <ListItemText primary="יסודות החוק החוזי" />
                    </ListItem>
                    <ListItem>
                      <ListItemText primary="זיהוי וניהול סיכונים" />
                    </ListItem>
                    <ListItem>
                      <ListItemText primary="כתיבת חוזים מקצועיים" />
                    </ListItem>
                    <ListItem>
                      <ListItemText primary="טכניקות משא ומתן" />
                    </ListItem>
                  </List>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        {t('learning.courseDetails')}
                      </Typography>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="body2" color="text.secondary">
                            {t('learning.instructor')}
                          </Typography>
                          <Typography variant="body2">
                            {selectedCourse.instructor}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="body2" color="text.secondary">
                            {t('learning.level')}
                          </Typography>
                          <Typography variant="body2">
                            {t(`learning.levels.${selectedCourse.level}`)}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="body2" color="text.secondary">
                            {t('learning.duration')}
                          </Typography>
                          <Typography variant="body2">
                            {formatDuration(selectedCourse.duration)}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="body2" color="text.secondary">
                            {t('learning.lessons')}
                          </Typography>
                          <Typography variant="body2">
                            {selectedCourse.lessons}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="body2" color="text.secondary">
                            {t('learning.students')}
                          </Typography>
                          <Typography variant="body2">
                            {selectedCourse.enrolledStudents}
                          </Typography>
                        </Box>
                        <Divider sx={{ my: 1 }} />
                        <Typography variant="h5" color="primary" align="center">
                          {selectedCourse.isFree ? t('learning.free') : `₪${selectedCourse.price}`}
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog}>
                {t('common.close')}
              </Button>
              {selectedCourse.isEnrolled ? (
                <Button
                  variant="contained"
                  startIcon={<PlayArrow />}
                  onClick={() => {
                    onViewCourse(selectedCourse.id)
                    handleCloseDialog()
                  }}
                >
                  {t('learning.continue')}
                </Button>
              ) : (
                <Button
                  variant="contained"
                  onClick={() => {
                    onEnroll(selectedCourse.id)
                    handleCloseDialog()
                  }}
                >
                  {selectedCourse.isFree ? t('learning.enroll') : t('learning.buy')}
                </Button>
              )}
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  )
}

export default CourseList

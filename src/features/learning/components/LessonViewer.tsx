import React, { useState, useRef, useEffect } from 'react'
import {
  Box,
  Paper,
  Typography,
  Card,
  CardContent,
  Button,
  IconButton,
  LinearProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Chip,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  SpeedDial,
  SpeedDialAction,
  SpeedDialIcon
} from '@mui/material'
import {
  PlayArrow,
  Pause,
  SkipNext,
  SkipPrevious,
  VolumeUp,
  VolumeOff,
  Fullscreen,
  FullscreenExit,
  Book,
  Assignment,
  Quiz,
  VideoLibrary,
  AccessTime,
  CheckCircle,
  RadioButtonUnchecked,
  ExpandMore,
  Speed,
  Subtitles,
  PictureInPicture,
  Download,
  Share,
  Notes,
  QuestionAnswer,
  StarBorder
} from '@mui/icons-material'
import { useTranslation } from 'react-i18next'

interface Lesson {
  id: string
  title: string
  description: string
  duration: number // in seconds
  type: 'video' | 'text' | 'quiz' | 'assignment'
  content: string
  videoUrl?: string
  isCompleted: boolean
  isLocked: boolean
  resources?: Array<{
    id: string
    name: string
    type: 'pdf' | 'doc' | 'video' | 'link'
    url: string
  }>
  notes?: string
  questions?: Array<{
    id: string
    question: string
    options: string[]
    correctAnswer: number
    explanation: string
  }>
}

interface LessonViewerProps {
  courseId: string
  lessonId: string
  lesson: Lesson
  lessons: Lesson[]
  onCompleteLesson: (lessonId: string) => void
  onNextLesson: () => void
  onPreviousLesson: () => void
  onSaveNotes: (lessonId: string, notes: string) => void
}

export const LessonViewer: React.FC<LessonViewerProps> = ({
  lessonId,
  lesson,
  lessons,
  onCompleteLesson,
  onNextLesson,
  onPreviousLesson,
  onSaveNotes
}) => {
  const { t } = useTranslation()
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume] = useState(1)
  const [isMuted, setIsMuted] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [playbackRate, setPlaybackRate] = useState(1)
  const [showNotes, setShowNotes] = useState(false)
  const [notes, setNotes] = useState(lesson.notes || '')
  const [, setShowQuiz] = useState(false)
  const [quizAnswers, setQuizAnswers] = useState<number[]>([])
  const [showSpeedDial, setShowSpeedDial] = useState(false)

  const currentLessonIndex = lessons.findIndex(l => l.id === lessonId)
  const hasNextLesson = currentLessonIndex < lessons.length - 1
  const hasPreviousLesson = currentLessonIndex > 0

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime)
    }

    const handleLoadedMetadata = () => {
      setDuration(video.duration)
    }

    const handleEnded = () => {
      setIsPlaying(false)
      if (!lesson.isCompleted) {
        onCompleteLesson(lessonId)
      }
    }

    video.addEventListener('timeupdate', handleTimeUpdate)
    video.addEventListener('loadedmetadata', handleLoadedMetadata)
    video.addEventListener('ended', handleEnded)

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate)
      video.removeEventListener('loadedmetadata', handleLoadedMetadata)
      video.removeEventListener('ended', handleEnded)
    }
  }, [lessonId, lesson.isCompleted, onCompleteLesson])

  const handlePlayPause = () => {
    const video = videoRef.current
    if (!video) return

    if (isPlaying) {
      video.pause()
    } else {
      video.play()
    }
    setIsPlaying(!isPlaying)
  }



  const handleMuteToggle = () => {
    const video = videoRef.current
    if (!video) return

    if (isMuted) {
      video.volume = volume
      setIsMuted(false)
    } else {
      video.volume = 0
      setIsMuted(true)
    }
  }

  const handleFullscreenToggle = () => {
    if (!document.fullscreenElement) {
      videoRef.current?.requestFullscreen()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }

  const handlePlaybackRateChange = (rate: number) => {
    const video = videoRef.current
    if (!video) return

    video.playbackRate = rate
    setPlaybackRate(rate)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const handleSaveNotes = () => {
    onSaveNotes(lessonId, notes)
    setShowNotes(false)
  }

  const handleQuizAnswer = (questionIndex: number, answerIndex: number) => {
    const newAnswers = [...quizAnswers]
    newAnswers[questionIndex] = answerIndex
    setQuizAnswers(newAnswers)
  }

  const handleSubmitQuiz = () => {
    const correctAnswers = lesson.questions?.map((q) => q.correctAnswer) || []
    const score = quizAnswers.reduce((acc, answer, i) => 
      answer === correctAnswers[i] ? acc + 1 : acc, 0
    )
    const percentage = (score / (lesson.questions?.length || 1)) * 100

    if (percentage >= 70) {
      onCompleteLesson(lessonId)
    }
    setShowQuiz(false)
  }

  const getLessonTypeIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <VideoLibrary />
      case 'text':
        return <Book />
      case 'quiz':
        return <Quiz />
      case 'assignment':
        return <Assignment />
      default:
        return <Book />
    }
  }

  const getLessonTypeColor = (type: string) => {
    switch (type) {
      case 'video':
        return 'primary'
      case 'text':
        return 'info'
      case 'quiz':
        return 'warning'
      case 'assignment':
        return 'error'
      default:
        return 'default'
    }
  }

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <Paper elevation={2} sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">
            {lesson.title}
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Chip
              icon={getLessonTypeIcon(lesson.type)}
              label={t(`learning.lessonTypes.${lesson.type}`)}
              color={getLessonTypeColor(lesson.type) as 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning'}
              size="small"
            />
            <Chip
              icon={<AccessTime />}
              label={formatTime(lesson.duration)}
              variant="outlined"
              size="small"
            />
            {lesson.isCompleted && (
              <Chip
                icon={<CheckCircle />}
                label={t('learning.completed')}
                color="success"
                size="small"
              />
            )}
          </Box>
        </Box>
      </Paper>

      <Box sx={{ display: 'flex', flexGrow: 1, overflow: 'hidden' }}>
        {/* Main Content */}
        <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
          {/* Video Player */}
          {lesson.type === 'video' && lesson.videoUrl && (
            <Box sx={{ position: 'relative', backgroundColor: 'black' }}>
              <Box
                component="video"
                ref={videoRef}
                src={lesson.videoUrl}
                sx={{ width: '100%', height: 'auto', maxHeight: '60vh' }}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
              />
              
              {/* Video Controls */}
              <Box sx={{ 
                position: 'absolute', 
                bottom: 0, 
                left: 0, 
                right: 0, 
                background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
                p: 2
              }}>
                <LinearProgress
                  variant="determinate"
                  value={(currentTime / duration) * 100}
                  sx={{ mb: 1 }}
                />
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <IconButton onClick={handlePlayPause} sx={{ color: 'white' }}>
                    {isPlaying ? <Pause /> : <PlayArrow />}
                  </IconButton>
                  <Typography variant="caption" color="white">
                    {formatTime(currentTime)} / {formatTime(duration)}
                  </Typography>
                  <Box sx={{ flexGrow: 1 }} />
                  <IconButton onClick={handleMuteToggle} sx={{ color: 'white' }}>
                    {isMuted ? <VolumeOff /> : <VolumeUp />}
                  </IconButton>
                  <IconButton onClick={handleFullscreenToggle} sx={{ color: 'white' }}>
                    {isFullscreen ? <FullscreenExit /> : <Fullscreen />}
                  </IconButton>
                </Box>
              </Box>
            </Box>
          )}

          {/* Lesson Content */}
          <Box sx={{ flexGrow: 1, p: 3, overflow: 'auto' }}>
            <Typography variant="body1" paragraph>
              {lesson.description}
            </Typography>

            {lesson.type === 'text' && (
              <Box sx={{ 
                backgroundColor: 'grey.50', 
                p: 3, 
                borderRadius: 2,
                fontFamily: 'inherit'
              }}>
                <div dangerouslySetInnerHTML={{ __html: lesson.content }} />
              </Box>
            )}

            {lesson.type === 'quiz' && lesson.questions && (
              <Box>
                <Typography variant="h6" gutterBottom>
                  {t('learning.quiz')}
                </Typography>
                {lesson.questions.map((question, index) => (
                  <Card key={question.id} sx={{ mb: 2 }}>
                    <CardContent>
                      <Typography variant="subtitle1" gutterBottom>
                        {index + 1}. {question.question}
                      </Typography>
                      <List>
                        {question.options.map((option, optionIndex) => (
                          <ListItem key={optionIndex} disablePadding>
                            <ListItemButton
                              onClick={() => handleQuizAnswer(index, optionIndex)}
                              selected={quizAnswers[index] === optionIndex}
                            >
                              <ListItemIcon>
                                {quizAnswers[index] === optionIndex ? 
                                  <RadioButtonUnchecked color="primary" /> : 
                                  <RadioButtonUnchecked />
                                }
                              </ListItemIcon>
                              <ListItemText primary={option} />
                            </ListItemButton>
                          </ListItem>
                        ))}
                      </List>
                    </CardContent>
                  </Card>
                ))}
                <Button
                  variant="contained"
                  onClick={handleSubmitQuiz}
                  disabled={quizAnswers.length !== lesson.questions.length}
                >
                  {t('learning.submitQuiz')}
                </Button>
              </Box>
            )}

            {/* Resources */}
            {lesson.resources && lesson.resources.length > 0 && (
              <Accordion sx={{ mt: 2 }}>
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <Typography variant="h6">
                    {t('learning.resources')}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <List>
                    {lesson.resources.map((resource) => (
                      <ListItem key={resource.id}>
                        <ListItemIcon>
                          {getLessonTypeIcon(resource.type)}
                        </ListItemIcon>
                        <ListItemText primary={resource.name} />
                        <IconButton>
                          <Download />
                        </IconButton>
                      </ListItem>
                    ))}
                  </List>
                </AccordionDetails>
              </Accordion>
            )}
          </Box>

          {/* Navigation */}
          <Paper elevation={2} sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Button
                startIcon={<SkipPrevious />}
                onClick={onPreviousLesson}
                disabled={!hasPreviousLesson}
              >
                {t('learning.previousLesson')}
              </Button>
              
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  startIcon={<Notes />}
                  onClick={() => setShowNotes(true)}
                >
                  {t('learning.notes')}
                </Button>
                <Button
                  startIcon={<QuestionAnswer />}
                  onClick={() => setShowQuiz(true)}
                >
                  {t('learning.questions')}
                </Button>
                <Button
                  startIcon={<StarBorder />}
                >
                  {t('learning.rate')}
                </Button>
              </Box>

              <Button
                endIcon={<SkipNext />}
                onClick={onNextLesson}
                disabled={!hasNextLesson}
                variant="contained"
              >
                {t('learning.nextLesson')}
              </Button>
            </Box>
          </Paper>
        </Box>

        {/* Sidebar - Lesson List */}
        <Paper elevation={2} sx={{ width: 300, overflow: 'auto' }}>
          <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
            <Typography variant="h6">
              {t('learning.lessons')}
            </Typography>
          </Box>
          <List>
            {lessons.map((lessonItem, index) => (
              <ListItem key={lessonItem.id} disablePadding>
                <ListItemButton
                  selected={lessonItem.id === lessonId}
                  disabled={lessonItem.isLocked}
                  onClick={() => {
                    // Navigate to lesson
                  }}
                >
                  <ListItemIcon>
                    {lessonItem.isCompleted ? (
                      <CheckCircle color="success" />
                    ) : (
                      getLessonTypeIcon(lessonItem.type)
                    )}
                  </ListItemIcon>
                  <ListItemText
                    primary={`${index + 1}. ${lessonItem.title}`}
                    secondary={formatTime(lessonItem.duration)}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Paper>
      </Box>

      {/* Speed Dial */}
      <SpeedDial
        ariaLabel="Lesson actions"
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
        icon={<SpeedDialIcon />}
        open={showSpeedDial}
        onOpen={() => setShowSpeedDial(true)}
        onClose={() => setShowSpeedDial(false)}
      >
        <SpeedDialAction
          icon={<Speed />}
          tooltipTitle={t('learning.playbackSpeed')}
          onClick={() => {
            const newRate = playbackRate === 1 ? 1.5 : playbackRate === 1.5 ? 2 : 1
            handlePlaybackRateChange(newRate)
          }}
        />
        <SpeedDialAction
          icon={<Subtitles />}
          tooltipTitle={t('learning.subtitles')}
        />
        <SpeedDialAction
          icon={<PictureInPicture />}
          tooltipTitle={t('learning.pictureInPicture')}
        />
        <SpeedDialAction
          icon={<Share />}
          tooltipTitle={t('learning.share')}
        />
      </SpeedDial>

      {/* Notes Dialog */}
      <Dialog open={showNotes} onClose={() => setShowNotes(false)} maxWidth="md" fullWidth>
        <DialogTitle>{t('learning.notes')}</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            multiline
            rows={10}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder={t('learning.notesPlaceholder')}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowNotes(false)}>
            {t('common.cancel')}
          </Button>
          <Button onClick={handleSaveNotes} variant="contained">
            {t('common.save')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default LessonViewer

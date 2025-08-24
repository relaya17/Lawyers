import React, { useState } from 'react'
import { 
  Box, 
  Container, 
  Typography, 
  Button, 
  Grid, 
  Card, 
  CardContent, 
  Chip, 
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  RadioGroup,
  FormControlLabel,
  Radio,
  Alert,
  IconButton
} from '@mui/material'
import { 
  PlayArrow, 
  School, 
  Timer, 
  QuestionAnswer, 
  CheckCircle,
  Warning,
  TrendingUp,
  Close,
  ArrowBack,
  ArrowForward
} from '@mui/icons-material'


interface Question {
  id: string
  text: string
  options: string[]
  correctAnswer: number
  explanation: string
  category: string
}

interface Simulation {
  id: string
  title: string
  description: string
  difficulty: 'easy' | 'medium' | 'hard'
  duration: string
  questions: Question[]
  completed: boolean
  score?: number
  timeSpent?: number
}

export const SimulatorPage: React.FC = () => {
  const [selectedSimulation, setSelectedSimulation] = useState<Simulation | null>(null)
  const [showStartDialog, setShowStartDialog] = useState(false)
  const [isSimulationActive, setIsSimulationActive] = useState(false)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: string]: number }>({})
  const [showResults, setShowResults] = useState(false)
  const [timeSpent, setTimeSpent] = useState(0)

  const simulations: Simulation[] = [
    {
      id: '1',
      title: 'ניתוח חוזה שכירות',
      description: 'למדו לזהות סיכונים בחוזי שכירות ולזהות סעיפים בעייתיים',
      difficulty: 'easy',
      duration: '15 דקות',
      questions: [
        {
          id: '1-1',
          text: 'בחוזה שכירות דירה, מהו הסעיף החשוב ביותר שיש לבדוק?',
          options: [
            'סעיף המחיר והתשלומים',
            'סעיף הפיקדון והחזרתו',
            'סעיף תיקון תקלות',
            'סעיף ביטול החוזה'
          ],
          correctAnswer: 1,
          explanation: 'סעיף הפיקדון הוא קריטי כי הוא מגן על השוכר מפני ניכויים לא מוצדקים ועל המשכיר מפני נזקים.',
          category: 'שכירות'
        },
        {
          id: '1-2',
          text: 'מה צריך להיות מפורט בסעיף תיקון תקלות?',
          options: [
            'רק מי אחראי לתיקון',
            'זמני תגובה ותיקון',
            'רק סוגי התקלות',
            'רק עלויות התיקון'
          ],
          correctAnswer: 1,
          explanation: 'סעיף תיקון תקלות חייב לכלול זמני תגובה ותיקון כדי להבטיח תיקון מהיר ויעיל.',
          category: 'שכירות'
        },
        {
          id: '1-3',
          text: 'מהו הסיכון העיקרי בחוזה שכירות ללא סעיף פיצוי על ביטול מוקדם?',
          options: [
            'השוכר לא יוכל לעזוב',
            'המשכיר לא יוכל לסיים את החוזה',
            'אין הגנה מפני נזקים כספיים',
            'החוזה לא יהיה תקף'
          ],
          correctAnswer: 2,
          explanation: 'ללא סעיף פיצוי, הצדדים לא מוגנים מפני נזקים כספיים במקרה של ביטול מוקדם.',
          category: 'שכירות'
        }
      ],
      completed: false,
    },
    {
      id: '2',
      title: 'הסכמי עבודה',
      description: 'הכירו את הדקויות בחוזי עבודה וסעיפי סיום העסקה',
      difficulty: 'medium',
      duration: '25 דקות',
      questions: [
        {
          id: '2-1',
          text: 'מה חייב להיות מפורט בחוזה עבודה לפי חוק?',
          options: [
            'רק שכר העבודה',
            'תנאי העבודה והשכר',
            'רק שעות העבודה',
            'רק תפקיד העובד'
          ],
          correctAnswer: 1,
          explanation: 'חוק חוזה עבודה מחייב פירוט של תנאי העבודה והשכר בחוזה.',
          category: 'עבודה'
        },
        {
          id: '2-2',
          text: 'מהו סעיף אי תחרות בחוזה עבודה?',
          options: [
            'איסור על העובד לעבוד במקביל',
            'איסור על העובד לעבוד אצל מתחרה',
            'איסור על העובד להתפטר',
            'איסור על המעסיק לפטר'
          ],
          correctAnswer: 1,
          explanation: 'סעיף אי תחרות מגביל את העובד מלעבוד אצל מתחרה לאחר סיום העסקתו.',
          category: 'עבודה'
        },
        {
          id: '2-3',
          text: 'מה צריך להיות מפורט בסעיף סיום העסקה?',
          options: [
            'רק הודעה מוקדמת',
            'תנאי פיצויים ופיצויי פיטורין',
            'רק סיבות לפיטורין',
            'רק תאריך סיום'
          ],
          correctAnswer: 1,
          explanation: 'סעיף סיום העסקה חייב לכלול תנאי פיצויים ופיצויי פיטורין.',
          category: 'עבודה'
        }
      ],
      completed: false,
    },
    {
      id: '3',
      title: 'חוזי מכר מורכבים',
      description: 'טפלו בחוזי מכר עם תנאים מיוחדים וסעיפי אחריות',
      difficulty: 'hard',
      duration: '40 דקות',
      questions: [
        {
          id: '3-1',
          text: 'מהו סעיף אחריות בחוזה מכר?',
          options: [
            'התחייבות הקונה לשלם',
            'התחייבות המוכר לתיקון פגמים',
            'התחייבות הקונה לבדוק',
            'התחייבות המוכר למסירה'
          ],
          correctAnswer: 1,
          explanation: 'סעיף אחריות מגדיר את התחייבות המוכר לתקן פגמים שנמצאו במוצר.',
          category: 'מכר'
        },
        {
          id: '3-2',
          text: 'מה צריך להיות מפורט בסעיף מסירה?',
          options: [
            'רק תאריך המסירה',
            'תאריך, מקום ובדיקת המסירה',
            'רק מקום המסירה',
            'רק בדיקת המסירה'
          ],
          correctAnswer: 1,
          explanation: 'סעיף מסירה חייב לכלול תאריך, מקום ובדיקת המסירה.',
          category: 'מכר'
        },
        {
          id: '3-3',
          text: 'מהו הסיכון העיקרי בחוזה מכר ללא סעיף ביטול?',
          options: [
            'המוכר לא יוכל לבטל',
            'הקונה לא יוכל לבטל',
            'אין הגנה מפני כשלים',
            'החוזה לא יהיה תקף'
          ],
          correctAnswer: 2,
          explanation: 'ללא סעיף ביטול, הצדדים לא מוגנים מפני כשלים או שינויי נסיבות.',
          category: 'מכר'
        }
      ],
      completed: false,
    }
  ]

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'success'
      case 'medium': return 'warning'
      case 'hard': return 'error'
      default: return 'default'
    }
  }

  const getDifficultyIcon = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return <CheckCircle color="success" />
      case 'medium': return <Warning color="warning" />
      case 'hard': return <TrendingUp color="error" />
      default: return <School />
    }
  }

  const handleStartSimulation = (simulation: Simulation) => {
    setSelectedSimulation(simulation)
    setShowStartDialog(true)
  }

  const confirmStartSimulation = () => {
    if (selectedSimulation) {
      setIsSimulationActive(true)
      setCurrentQuestionIndex(0)
      setSelectedAnswers({})
      setShowResults(false)
      setTimeSpent(0)
    }
    setShowStartDialog(false)
  }

  const handleAnswerSelect = (questionId: string, answerIndex: number) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: answerIndex
    }))
  }

  const handleNextQuestion = () => {
    if (selectedSimulation && currentQuestionIndex < selectedSimulation.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1)
    } else {
      finishSimulation()
    }
  }

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1)
    }
  }

  const finishSimulation = () => {
    if (selectedSimulation) {
      const correctAnswers = selectedSimulation.questions.filter(q => 
        selectedAnswers[q.id] === q.correctAnswer
      ).length
      const score = Math.round((correctAnswers / selectedSimulation.questions.length) * 100)
      
      // Update simulation with results
      const updatedSimulation = {
        ...selectedSimulation,
        completed: true,
        score,
        timeSpent
      }
      
      setSelectedSimulation(updatedSimulation)
      setShowResults(true)
    }
  }

  const resetSimulation = () => {
    setIsSimulationActive(false)
    setSelectedSimulation(null)
    setCurrentQuestionIndex(0)
    setSelectedAnswers({})
    setShowResults(false)
    setTimeSpent(0)
  }

  const completedSimulations = simulations.filter(s => s.completed)
  const totalScore = completedSimulations.reduce((sum, s) => sum + (s.score || 0), 0)
  const averageScore = completedSimulations.length > 0 ? Math.round(totalScore / completedSimulations.length) : 0
  const totalTimeSpent = completedSimulations.reduce((sum, s) => sum + (s.timeSpent || 0), 0)

  // Simulation Interface
  if (isSimulationActive && selectedSimulation) {
    const currentQuestion = selectedSimulation.questions[currentQuestionIndex]
    const progress = ((currentQuestionIndex + 1) / selectedSimulation.questions.length) * 100

    return (
      <Container maxWidth="md">
        <Box sx={{ py: 4 }}>
          {/* Header */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h5" component="h1">
              {selectedSimulation.title}
            </Typography>
            <IconButton onClick={resetSimulation}>
              <Close />
            </IconButton>
          </Box>

          {/* Progress */}
          <Box sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2">
                שאלה {currentQuestionIndex + 1} מתוך {selectedSimulation.questions.length}
              </Typography>
              <Typography variant="body2">
                {Math.round(progress)}%
              </Typography>
            </Box>
            <LinearProgress variant="determinate" value={progress} />
          </Box>

          {/* Question */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {currentQuestion.text}
              </Typography>
              
              <RadioGroup
                value={selectedAnswers[currentQuestion.id] || ''}
                onChange={(e) => handleAnswerSelect(currentQuestion.id, parseInt(e.target.value))}
              >
                {currentQuestion.options.map((option, index) => (
                  <FormControlLabel
                    key={index}
                    value={index}
                    control={<Radio />}
                    label={option}
                    sx={{ 
                      mb: 1,
                      p: 1,
                      borderRadius: 1,
                      '&:hover': { backgroundColor: 'action.hover' }
                    }}
                  />
                ))}
              </RadioGroup>
            </CardContent>
          </Card>

          {/* Navigation */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button
              variant="outlined"
              onClick={handlePreviousQuestion}
              disabled={currentQuestionIndex === 0}
              startIcon={<ArrowBack />}
            >
              קודם
            </Button>
            
            <Button
              variant="contained"
              onClick={handleNextQuestion}
              disabled={selectedAnswers[currentQuestion.id] === undefined}
              endIcon={currentQuestionIndex === selectedSimulation.questions.length - 1 ? <CheckCircle /> : <ArrowForward />}
            >
              {currentQuestionIndex === selectedSimulation.questions.length - 1 ? 'סיים' : 'הבא'}
            </Button>
          </Box>
        </Box>
      </Container>
    )
  }

  // Results Interface
  if (showResults && selectedSimulation) {
    const correctAnswers = selectedSimulation.questions.filter(q => 
      selectedAnswers[q.id] === q.correctAnswer
    ).length

    return (
      <Container maxWidth="md">
        <Box sx={{ py: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom textAlign="center">
            תוצאות הסימולציה
          </Typography>
          
          <Card sx={{ mb: 4 }}>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                {selectedSimulation.title}
              </Typography>
              
              <Grid container spacing={3} sx={{ mt: 2 }}>
                <Grid item xs={6}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h3" color="primary" fontWeight="bold">
                      {selectedSimulation.score}%
                    </Typography>
                    <Typography variant="body1">ציון סופי</Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h3" color="success.main" fontWeight="bold">
                      {correctAnswers}/{selectedSimulation.questions.length}
                    </Typography>
                    <Typography variant="body1">תשובות נכונות</Typography>
                  </Box>
                </Grid>
              </Grid>

                             <Alert severity={(selectedSimulation.score || 0) >= 80 ? 'success' : (selectedSimulation.score || 0) >= 60 ? 'warning' : 'error'} sx={{ mt: 2 }}>
                 {(selectedSimulation.score || 0) >= 80 ? 'מצוין! אתה מוכן לניתוח חוזים מתקדם' :
                  (selectedSimulation.score || 0) >= 60 ? 'טוב, אבל יש מקום לשיפור' :
                  'צריך לתרגל יותר - נסה שוב'}
               </Alert>
            </CardContent>
          </Card>

          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
            <Button variant="outlined" onClick={resetSimulation}>
              חזור לרשימה
            </Button>
            <Button variant="contained" onClick={() => {
              setShowResults(false)
              setIsSimulationActive(true)
              setCurrentQuestionIndex(0)
              setSelectedAnswers({})
            }}>
              נסה שוב
            </Button>
          </Box>
        </Box>
      </Container>
    )
  }

  // Main Interface
  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            סימולטור משפטי
          </Typography>
          <Typography variant="h6" color="text.secondary" paragraph>
            תרגלו את כישורי ניתוח החוזים שלכם בסימולציות אינטראקטיביות
          </Typography>
        </Box>

        {/* Progress Overview */}
        <Card sx={{ mb: 4, p: 3 }}>
          <Typography variant="h6" gutterBottom>
            התקדמות למידה
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h4" color="primary" fontWeight="bold">
                  {completedSimulations.length}/{simulations.length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  סימולציות הושלמו
                </Typography>
                <LinearProgress 
                  variant="determinate" 
                  value={(completedSimulations.length / simulations.length) * 100} 
                  sx={{ mt: 1 }}
                />
              </Box>
            </Grid>
            <Grid item xs={12} md={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h4" color="success.main" fontWeight="bold">
                  {averageScore}%
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  ממוצע ציונים
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h4" color="warning.main" fontWeight="bold">
                  {totalTimeSpent}h
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  זמן למידה כולל
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h4" color="info.main" fontWeight="bold">
                  {completedSimulations.length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  תגיות הושגו
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Card>

        {/* Simulations List */}
        <Grid container spacing={3}>
          {simulations.map((simulation) => (
            <Grid item xs={12} md={6} lg={4} key={simulation.id}>
              <Card 
                sx={{ 
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  '&:hover': { boxShadow: 4 }
                }}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Typography variant="h6" component="h2" gutterBottom>
                      {simulation.title}
                    </Typography>
                    {getDifficultyIcon(simulation.difficulty)}
                  </Box>
                  
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {simulation.description}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                    <Chip 
                      label={simulation.difficulty} 
                      color={getDifficultyColor(simulation.difficulty) as any}
                      size="small"
                    />
                    <Chip 
                      icon={<Timer />} 
                      label={simulation.duration} 
                      size="small"
                    />
                    <Chip 
                      icon={<QuestionAnswer />} 
                      label={`${simulation.questions.length} שאלות`} 
                      size="small"
                    />
                  </Box>

                  {simulation.completed && simulation.score && (
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="success.main" fontWeight="bold">
                        הושלם! ציון: {simulation.score}%
                      </Typography>
                    </Box>
                  )}
                </CardContent>
                
                <Box sx={{ p: 2, pt: 0 }}>
                  <Button
                    variant="contained"
                    fullWidth
                    startIcon={<PlayArrow />}
                    onClick={() => handleStartSimulation(simulation)}
                    disabled={simulation.completed}
                  >
                    {simulation.completed ? 'הושלם' : 'התחל סימולציה'}
                  </Button>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Start Dialog */}
        <Dialog open={showStartDialog} onClose={() => setShowStartDialog(false)} maxWidth="sm" fullWidth>
          <DialogTitle>
            התחל סימולציה: {selectedSimulation?.title}
          </DialogTitle>
          <DialogContent>
            <Typography paragraph>
              {selectedSimulation?.description}
            </Typography>
            <List>
              <ListItem>
                <ListItemIcon>
                  <Timer />
                </ListItemIcon>
                <ListItemText 
                  primary="משך זמן" 
                  secondary={selectedSimulation?.duration} 
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <QuestionAnswer />
                </ListItemIcon>
                <ListItemText 
                  primary="מספר שאלות" 
                  secondary={selectedSimulation?.questions.length} 
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  {getDifficultyIcon(selectedSimulation?.difficulty || 'easy')}
                </ListItemIcon>
                <ListItemText 
                  primary="רמת קושי" 
                  secondary={selectedSimulation?.difficulty} 
                />
              </ListItem>
            </List>
            <Alert severity="info" sx={{ mt: 2 }}>
              הסימולציה תכלול ניתוח חוזים, זיהוי סיכונים, והמלצות לשיפור. תוכלו לעצור ולחזור בכל זמן.
            </Alert>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowStartDialog(false)}>
              ביטול
            </Button>
            <Button onClick={confirmStartSimulation} variant="contained">
              התחל סימולציה
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Container>
  )
}

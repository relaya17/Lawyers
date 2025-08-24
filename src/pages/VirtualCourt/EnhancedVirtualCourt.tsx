import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  CardActions,
  Grid,
  Tabs,
  Tab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Switch,
  FormControlLabel,
  Chip,
  Avatar,
  IconButton,
  Badge,
  useTheme,
  useMediaQuery,
  Slider,
  Paper,
  LinearProgress,
  Alert,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Rating,
  SpeedDial,
  SpeedDialAction,
  SpeedDialIcon,
} from '@mui/material'
import {
  PlayArrow,
  Mic,
  Fullscreen,
  Settings,
  Analytics,
  Gavel,
  Add,
  KeyboardArrowLeft,
  VolumeOff,
  VolumeUp,
  Group,
  Send,
  Description,
  Image as ImageIcon,
  Star,
  Visibility,
  Favorite,
  FavoriteBorder,
  History,
  ScreenShare,
} from '@mui/icons-material'

interface EnhancedVirtualCourtProps {
  onSessionStart?: (sessionId: string) => void
  onSessionEnd?: (sessionId: string) => void
}

// Type definitions
interface VirtualCourtSession {
  id: string
  title: string
  type: string
  status: 'waiting' | 'active' | 'completed' | 'cancelled'
  participants: number
  duration: number
  progress?: number
  currentStep?: number
  totalSteps?: number
  score?: number
  description?: string
  difficulty?: string
}

interface CourtScenario {
  id: string
  title: string
  description: string
  type: string
  difficulty: string
  participants: number
  duration: number
  tags: string[]
  rating?: number
  completedCount?: number
  isFavorite?: boolean
}



export const EnhancedVirtualCourt: React.FC<EnhancedVirtualCourtProps> = ({
  onSessionStart,
  onSessionEnd
}) => {
  const { t } = useTranslation()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  // State management
  const [activeSession, setActiveSession] = useState<VirtualCourtSession | null>(null)
  const [sessions, setSessions] = useState<VirtualCourtSession[]>([])
  const [scenarios, setScenarios] = useState<CourtScenario[]>([])
  const [selectedTab, setSelectedTab] = useState(0)
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [aiSuggestions] = useState<string[]>([])
  const [chatMessage, setChatMessage] = useState('')
  const [selectedScenario, setSelectedScenario] = useState<CourtScenario | null>(null)
  const [sessionType, setSessionType] = useState('civil')
  const [difficulty, setDifficulty] = useState('intermediate')
  const [participantCount, setParticipantCount] = useState(6)
  const [duration, setDuration] = useState(60)
  const [aiAssistant, setAiAssistant] = useState(true)
  const [transcript, setTranscript] = useState(true)

  // Mock data initialization
  useEffect(() => {
    // Initialize with mock scenarios
    const mockScenarios = [
      {
        id: 'civil_contract_dispute',
        title: 'חוזה שכירות',
        description: 'Civil case involving breach of commercial contract',
        type: 'civil',
        difficulty: 'intermediate',
        duration: 90,
        participants: 6,
        tags: ['contract', 'civil', 'dispute'],
        rating: 4.5,
        completedCount: 1250,
        isFavorite: false
      },
      {
        id: 'criminal_fraud_case',
        title: 'תיק פלילי',
        description: 'Criminal case involving financial fraud',
        type: 'criminal',
        difficulty: 'advanced',
        duration: 120,
        participants: 8,
        tags: ['criminal', 'fraud', 'financial'],
        rating: 4.8,
        completedCount: 890,
        isFavorite: true
      },
      {
        id: 'family_custody_case',
        title: 'דיני משפחה',
        description: 'Family court case involving child custody',
        type: 'family',
        difficulty: 'intermediate',
        duration: 75,
        participants: 5,
        tags: ['family', 'custody', 'children'],
        rating: 4.2,
        completedCount: 2100,
        isFavorite: false
      }
    ]
    setScenarios(mockScenarios)

    // Initialize with mock sessions
    const mockSessions: VirtualCourtSession[] = [
      {
        id: '1',
        title: 'חוזה שכירות',
        description: 'Active session with 4 participants',
        type: 'civil',
        difficulty: 'intermediate',
        status: 'active' as const,
        currentStep: 3,
        totalSteps: 8,
        participants: 4,
        duration: 45,
        progress: 37.5
      },
      {
        id: '2',
        title: 'תיק פלילי',
        description: 'Completed session with full transcript',
        type: 'criminal',
        difficulty: 'advanced',
        status: 'completed' as const,
        participants: 6,
        duration: 120,
        progress: 100,
        score: 85
      }
    ]
    setSessions(mockSessions)
  }, [])

  // Handlers
  const handleCreateSession = () => {
    if (selectedScenario) {
      const newSession: VirtualCourtSession = {
        id: `session_${Date.now()}`,
        title: selectedScenario.title,
        description: selectedScenario.description,
        type: sessionType,
        difficulty,
        status: 'waiting' as const,
        participants: participantCount,
        duration,
        progress: 0
      }
      setSessions(prev => [newSession, ...prev])
      setActiveSession(newSession)
      setShowCreateDialog(false)
      onSessionStart?.(newSession.id)
    }
  }

  const handleJoinSession = (session: VirtualCourtSession) => {
    setActiveSession(session)
    onSessionStart?.(session.id)
  }

  const handleEndSession = () => {
    if (activeSession) {
      setActiveSession(null)
      onSessionEnd?.(activeSession.id)
    }
  }

  const handleToggleRecording = () => {
    setIsRecording(!isRecording)
  }

  const handleToggleMute = () => {
    setIsMuted(!isMuted)
  }

  const handleToggleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
  }

  const handleSendMessage = () => {
    if (chatMessage.trim()) {
      // Add message to chat
      setChatMessage('')
    }
  }

  const handleToggleFavorite = (scenarioId: string) => {
    setScenarios(prev => prev.map(scenario => 
      scenario.id === scenarioId 
        ? { ...scenario, isFavorite: !scenario.isFavorite }
        : scenario
    ))
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'success'
      case 'waiting': return 'warning'
      case 'completed': return 'info'
      case 'paused': return 'error'
      default: return 'default'
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'success'
      case 'intermediate': return 'warning'
      case 'advanced': return 'error'
      default: return 'default'
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'civil': return 'primary'
      case 'criminal': return 'error'
      case 'family': return 'secondary'
      case 'commercial': return 'info'
      case 'labor': return 'warning'
      default: return 'default'
    }
  }

  // Speed dial actions
  const speedDialActions = [
    { icon: <Mic />, name: 'הקלטה', action: handleToggleRecording },
    { icon: <ScreenShare />, name: 'שיתוף מסך', action: () => {} },
    { icon: <Settings />, name: 'הגדרות', action: () => {} },
    { icon: <Analytics />, name: 'ניתוח', action: () => {} },
  ]

  if (activeSession) {
    return (
      <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
        {/* Session Header */}
        <Paper elevation={2} sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton onClick={handleEndSession}>
              <KeyboardArrowLeft />
            </IconButton>
            <Box>
              <Typography variant="h6">{activeSession.title}</Typography>
              <Typography variant="body2" color="text.secondary">
                {'פעיל'} • {activeSession.participants} {'עורכי דין'}
              </Typography>
            </Box>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Chip 
              label={t(`virtualCourt.sessionTypes.${activeSession.type}`)} 
              color={getTypeColor(activeSession.type)} 
              size="small" 
            />
            {activeSession.difficulty && (
              <Chip 
                label={t(`virtualCourt.difficulty.${activeSession.difficulty}`)} 
                color={getDifficultyColor(activeSession.difficulty)} 
                size="small" 
              />
            )}
            <IconButton onClick={handleToggleMute}>
              {isMuted ? <VolumeOff /> : <VolumeUp />}
            </IconButton>
            <IconButton onClick={handleToggleFullscreen}>
              {isFullscreen ? <Fullscreen /> : <Fullscreen />}
            </IconButton>
          </Box>
        </Paper>

        {/* Session Content */}
        <Box sx={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
          {/* Main Court Area */}
          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', p: 2 }}>
            {/* Progress Bar */}
            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2">
                  {'יעילות זמן'}: {activeSession.progress}%
                </Typography>
                <Typography variant="body2">
                  {activeSession.currentStep}/{activeSession.totalSteps} {'שלבים'}
                </Typography>
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={activeSession.progress} 
                sx={{ height: 8, borderRadius: 4 }}
              />
            </Box>

            {/* Court Room View */}
            <Paper 
              elevation={3} 
              sx={{ 
                flex: 1, 
                display: 'flex', 
                flexDirection: 'column', 
                p: 3, 
                background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
                borderRadius: 3
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                  {'בית משפט וירטואלי'}
                </Typography>
              </Box>

              {/* Participants Grid */}
              <Grid container spacing={2} sx={{ mb: 3 }}>
                {Array.from({ length: activeSession.participants }, (_, i) => (
                  <Grid item xs={6} sm={4} md={3} key={i}>
                    <Card sx={{ textAlign: 'center', position: 'relative' }}>
                      <CardContent>
                        <Avatar 
                          sx={{ 
                            width: 56, 
                            height: 56, 
                            mx: 'auto', 
                            mb: 1,
                            bgcolor: i === 0 ? 'primary.main' : 'secondary.main'
                          }}
                        >
                          {i === 0 ? <Gavel /> : <Group />}
                        </Avatar>
                        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                          {i === 0 ? 'שופט' : 'עורך דין'}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Participant {i + 1}
                        </Typography>
                        {i === 0 && (
                          <Badge 
                            color="success" 
                            variant="dot" 
                            sx={{ position: 'absolute', top: 8, right: 8 }}
                          />
                        )}
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>

              {/* Current Action */}
              <Paper elevation={2} sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="h6" gutterBottom>
                  {'שלב נוכחי'}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {'נאומי פתיחה'}
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <Button variant="contained" startIcon={<PlayArrow />}>
                    {'המשך'}
                  </Button>
                </Box>
              </Paper>
            </Paper>
          </Box>

          {/* Side Panel */}
          {!isMobile && (
            <Box sx={{ width: 350, borderLeft: 1, borderColor: 'divider' }}>
              <Tabs value={selectedTab} onChange={(_, newValue) => setSelectedTab(newValue)}>
                <Tab label={'צ\'אט'} />
                <Tab label={'ראיות'} />
                <Tab label={'ניתוח'} />
              </Tabs>

              <Box sx={{ p: 2, height: 'calc(100vh - 200px)', overflow: 'auto' }}>
                {selectedTab === 0 && (
                  <Box>
                    {/* Chat Messages */}
                    <Box sx={{ mb: 2, maxHeight: 300, overflow: 'auto' }}>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        {'הודעת מערכת'}
                      </Typography>
                      <Typography variant="body2">
                        Session started. All participants are present.
                      </Typography>
                    </Box>

                    {/* AI Suggestions */}
                    {aiSuggestions.length > 0 && (
                      <Alert severity="info" sx={{ mb: 2 }}>
                        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                          {'הצעות AI'}:
                        </Typography>
                        {aiSuggestions.map((suggestion, index) => (
                          <Typography key={index} variant="body2">
                            • {suggestion}
                          </Typography>
                        ))}
                      </Alert>
                    )}

                    {/* Message Input */}
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <TextField
                        fullWidth
                        size="small"
                        placeholder={'שלח הודעה'}
                        value={chatMessage}
                        onChange={(e) => setChatMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      />
                      <IconButton onClick={handleSendMessage}>
                        <Send />
                      </IconButton>
                    </Box>
                  </Box>
                )}

                {selectedTab === 1 && (
                  <Box>
                    <Typography variant="h6" gutterBottom>
                      {'ראיות'}
                    </Typography>
                    <List>
                      <ListItem>
                        <ListItemIcon>
                          <Description />
                        </ListItemIcon>
                        <ListItemText 
                          primary="Contract Document" 
                          secondary={'הוכנסו'}
                        />
                        <Chip label={'מסמך'} size="small" />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon>
                          <ImageIcon />
                        </ListItemIcon>
                        <ListItemText 
                          primary="Evidence Photos" 
                          secondary={'ממתינות'}
                        />
                        <Chip label={'תמונה'} size="small" />
                      </ListItem>
                    </List>
                    <Button 
                      variant="outlined" 
                      startIcon={<Add />}
                      fullWidth
                      sx={{ mt: 2 }}
                    >
                      {'הגש ראיות'}
                    </Button>
                  </Box>
                )}

                {selectedTab === 2 && (
                  <Box>
                    <Typography variant="h6" gutterBottom>
                      {'ניתוח'}
                    </Typography>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" gutterBottom>
                        {'זמן דיבור'}
                      </Typography>
                      <LinearProgress 
                        variant="determinate" 
                        value={65} 
                        sx={{ height: 8, borderRadius: 4 }}
                      />
                      <Typography variant="caption" color="text.secondary">
                        65% of total time
                      </Typography>
                    </Box>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" gutterBottom>
                        {'יעילות טיעונים'}
                      </Typography>
                      <Rating value={4} readOnly size="small" />
                    </Box>
                    <Box>
                      <Typography variant="body2" gutterBottom>
                        {'יעילות זמן'}
                      </Typography>
                      <Typography variant="h6" color="success.main">
                        85%
                      </Typography>
                    </Box>
                  </Box>
                )}
              </Box>
            </Box>
          )}
        </Box>

        {/* Speed Dial for Mobile */}
        {isMobile && (
          <SpeedDial
            ariaLabel="Virtual Court Actions"
            sx={{ position: 'absolute', bottom: 16, right: 16 }}
            icon={<SpeedDialIcon />}
          >
            {speedDialActions.map((action) => (
              <SpeedDialAction
                key={action.name}
                icon={action.icon}
                tooltipTitle={action.name}
                onClick={action.action}
              />
            ))}
          </SpeedDial>
        )}
      </Box>
    )
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" component="h1" gutterBottom>
            {'בית משפט וירטואלי'}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {'תיאור'}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<History />}
            onClick={() => setSelectedTab(1)}
          >
            {'סשנים הושלמו'}
          </Button>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setShowCreateDialog(true)}
          >
            {'צור סשן'}
          </Button>
        </Box>
      </Box>

      {/* Tabs */}
      <Tabs value={selectedTab} onChange={(_, newValue) => setSelectedTab(newValue)} sx={{ mb: 3 }}>
        <Tab label={'סשנים פעילים'} />
        <Tab label={'תרחישים'} />
        <Tab label={'ניתוח'} />
      </Tabs>

      {/* Active Sessions Tab */}
      {selectedTab === 0 && (
        <Grid container spacing={3}>
          {sessions.map((session) => (
            <Grid item xs={12} md={6} lg={4} key={session.id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flex: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Typography variant="h6" gutterBottom>
                      {session.title}
                    </Typography>
                    <Chip
                      label={t(`virtualCourt.status.${session.status}`)}
                      color={getStatusColor(session.status)}
                      size="small"
                    />
                  </Box>
                  
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {session.description}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                    <Chip label={t(`virtualCourt.sessionTypes.${session.type}`)} color={getTypeColor(session.type)} size="small" />
                    {session.difficulty && (
                      <Chip label={t(`virtualCourt.difficulty.${session.difficulty}`)} color={getDifficultyColor(session.difficulty)} size="small" />
                    )}
                    <Chip label={`${session.duration} {'דקות'}`} size="small" />
                  </Box>
                  
                  {session.status === 'active' && (
                    <Box sx={{ mb: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2">
                          {'התקדמות'}
                        </Typography>
                        <Typography variant="body2">
                          {session.progress}%
                        </Typography>
                      </Box>
                      <LinearProgress 
                        variant="determinate" 
                        value={session.progress} 
                        sx={{ height: 6, borderRadius: 3 }}
                      />
                    </Box>
                  )}
                  
                  {session.status === 'completed' && session.score && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                      <Star color="primary" />
                      <Typography variant="body2">
                        {'ציון'}: {session.score}%
                      </Typography>
                    </Box>
                  )}
                </CardContent>
                
                <CardActions>
                  {session.status === 'active' ? (
                    <Button 
                      variant="contained" 
                      fullWidth 
                      onClick={() => handleJoinSession(session)}
                    >
                      {'הצטרף לסשן'}
                    </Button>
                  ) : (
                    <Button 
                      variant="outlined" 
                      fullWidth 
                      startIcon={<Visibility />}
                    >
                      {'צפה בפרטים'}
                    </Button>
                  )}
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Scenarios Tab */}
      {selectedTab === 1 && (
        <Grid container spacing={3}>
          {scenarios.map((scenario) => (
            <Grid item xs={12} md={6} lg={4} key={scenario.id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flex: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Typography variant="h6" gutterBottom>
                      {scenario.title}
                    </Typography>
                    <IconButton 
                      size="small"
                      onClick={() => handleToggleFavorite(scenario.id)}
                    >
                      {scenario.isFavorite ? <Favorite color="error" /> : <FavoriteBorder />}
                    </IconButton>
                  </Box>
                  
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {scenario.description}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                    <Chip label={t(`virtualCourt.sessionTypes.${scenario.type}`)} color={getTypeColor(scenario.type)} size="small" />
                    <Chip label={t(`virtualCourt.difficulty.${scenario.difficulty}`)} color={getDifficultyColor(scenario.difficulty)} size="small" />
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <Rating value={scenario.rating} readOnly size="small" />
                    <Typography variant="body2" color="text.secondary">
                      ({scenario.completedCount} {'הושלמו'})
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2" color="text.secondary">
                      {scenario.duration} {'דקות'} • {scenario.participants} {'משתתפים'}
                    </Typography>
                  </Box>
                </CardContent>
                
                <CardActions>
                  <Button 
                    variant="contained" 
                    fullWidth 
                    onClick={() => {
                      setSelectedScenario(scenario)
                      setShowCreateDialog(true)
                    }}
                  >
                    {'צור סשן'}
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Analytics Tab */}
      {selectedTab === 2 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {'ביצועים'}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Typography variant="h4" color="primary.main">
                    85%
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {'ציון ממוצע'}
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  {'מבוסס על הסשנים האחרונים'}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {'סשנים הושלמו'}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Typography variant="h4" color="success.main">
                    24
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {'החודש'}
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  {'עלייה מהחודש שעבר'}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Create Session Dialog */}
      <Dialog 
        open={showCreateDialog} 
        onClose={() => setShowCreateDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {'צור סשן'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>{'סוג סשן'}</InputLabel>
                <Select
                  value={sessionType}
                  onChange={(e) => setSessionType(e.target.value)}
                  label={'סוג סשן'}
                >
                  <MenuItem value="civil">{'אזרחי'}</MenuItem>
                  <MenuItem value="criminal">{'פלילי'}</MenuItem>
                  <MenuItem value="family">{'משפחה'}</MenuItem>
                  <MenuItem value="commercial">{'מסחרי'}</MenuItem>
                  <MenuItem value="labor">{'עבודה'}</MenuItem>
                  <MenuItem value="arbitration">{'בוררות'}</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>{'רמה'}</InputLabel>
                <Select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                  label={'רמה'}
                >
                  <MenuItem value="beginner">{'מתחיל'}</MenuItem>
                  <MenuItem value="intermediate">{'בינוני'}</MenuItem>
                  <MenuItem value="advanced">{'מתקדם'}</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Typography variant="body2" gutterBottom>
                {'משתתפים'}: {participantCount}
              </Typography>
              <Slider
                value={participantCount}
                onChange={(_: Event, value: number | number[]) => setParticipantCount(value as number)}
                min={2}
                max={12}
                marks
                valueLabelDisplay="auto"
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Typography variant="body2" gutterBottom>
                {'משך'}: {duration} {'דקות'}
              </Typography>
              <Slider
                value={duration}
                onChange={(_: Event, value: number | number[]) => setDuration(value as number)}
                min={30}
                max={180}
                step={15}
                marks
                valueLabelDisplay="auto"
              />
            </Grid>
            
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={aiAssistant}
                    onChange={(e) => setAiAssistant(e.target.checked)}
                  />
                }
                label={'עוזר AI'}
              />
            </Grid>
            
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={transcript}
                    onChange={(e) => setTranscript(e.target.checked)}
                  />
                }
                label={'יצירת תמלול'}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowCreateDialog(false)}>
            {'ביטול'}
          </Button>
          <Button 
            variant="contained" 
            onClick={handleCreateSession}
            disabled={!selectedScenario}
          >
            {'צור סשן'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
}

export default EnhancedVirtualCourt

import React, { useState, useEffect, useRef } from 'react'
import { useDispatch } from 'react-redux'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Button,
  IconButton,
  Chip,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  LinearProgress,
  Tabs,
  Tab,
  Badge,
  Tooltip,
  Menu,
  MenuItem,
  Switch,
  FormControlLabel,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material'
import {
  Send,
  AttachFile,
  Mic,
  MicOff,
  VideoCall,
  VideocamOff,
  ScreenShare,
  StopScreenShare,
  MoreVert,
  ExpandMore,
  Person,
  Chat,
  Description,
  Schedule,
  RecordVoiceOver,
  Stop,
  Settings,
  Close,
  EmojiEmotions
} from '@mui/icons-material'
import { AppDispatch } from '@shared/store'
import { logger } from '@shared/utils/logger'
import { 
  fetchRoom, 
  joinRoom, 
  leaveRoom,
  fetchParticipants,
  fetchMessages,
  sendMessage
} from '../store/negotiationSlice'
import type { 
  INegotiationRoom, 
  Participant, 
  NegotiationMessage,
  NegotiationDocument 
} from '../types/negotiationTypes'

interface NegotiationRoomProps {
  roomId?: string
}
const NegotiationRoom: React.FC<NegotiationRoomProps> = ({ roomId: propRoomId }) => {
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  const { roomId: paramRoomId } = useParams<{ roomId: string }>()
  const roomId = propRoomId || paramRoomId

  // Redux state - TODO: Add negotiation slice to store
  const currentRoom: INegotiationRoom | null = null
  const participants: Participant[] = []
  const messages: NegotiationMessage[] = []
  const documents: NegotiationDocument[] = []
  const loading = false
  const error = null
  const connectionStatus = 'connected' as const
  const typingUsers: string[] = []

  // Local state
  const [activeTab, setActiveTab] = useState(0)
  const [messageText, setMessageText] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [showParticipants, setShowParticipants] = useState(true)
  const [showDocuments, setShowDocuments] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [isScreenSharing, setIsScreenSharing] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [isVideoOn, setIsVideoOn] = useState(true)
  const [showSettings, setShowSettings] = useState(false)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  // Refs
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const typingTimeoutRef = useRef<NodeJS.Timeout>()

  useEffect(() => {
    if (roomId) {
      dispatch(fetchRoom(roomId))
      dispatch(joinRoom({ roomId, userId: 'current-user' }))
      dispatch(fetchParticipants(roomId))
      dispatch(fetchMessages({ roomId }))
    }

    return () => {
      if (roomId) {
        dispatch(leaveRoom({ roomId, userId: 'current-user' }))
      }
    }
  }, [roomId, dispatch])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (isTyping) {
      // dispatch(updateTypingStatus({ roomId: roomId!, isTyping: true }))
      
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current)
      }
      
      typingTimeoutRef.current = setTimeout(() => {
        setIsTyping(false)
        // dispatch(updateTypingStatus({ roomId: roomId!, isTyping: false }))
      }, 3000)
    }
  }, [isTyping, roomId, dispatch])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleSendMessage = async () => {
    if (!messageText.trim() || !roomId) return

    try {
      await dispatch(sendMessage({
        roomId,
        type: 'text',
        content: messageText
      })).unwrap()
      
      setMessageText('')
      setIsTyping(false)
    } catch (error) {
      logger.error('שגיאה בשליחת הודעה:', error)
    }
  }

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      handleSendMessage()
    } else if (event.key !== 'Enter') {
      if (!isTyping) {
        setIsTyping(true)
      }
    }
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files && files.length > 0) {
      // TODO: Implement file upload
      // console.log('Uploading files:', files)
    }
  }

  const handleParticipantAction = (action: string) => {
    switch (action) {
      case 'mute':
        // TODO: Implement mute participant
        break
      case 'remove':
        // TODO: Implement remove participant
        break
      case 'block':
        // TODO: Implement block participant
        break
      default:
        break
    }
    setAnchorEl(null)
  }

  const getConnectionStatusColor = (): 'success' | 'warning' | 'error' | 'default' => {
    const status = connectionStatus as 'connected' | 'connecting' | 'disconnected'
    switch (status) {
      case 'connected': return 'success'
      case 'connecting': return 'warning'
      case 'disconnected': return 'error'
      default: return 'default'
    }
  }

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('he-IL', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <LinearProgress />
        <Typography sx={{ mt: 2 }}>טוען חדר מו"מ...</Typography>
      </Box>
    )
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ m: 2 }}>
        שגיאה בטעינת חדר המו"מ: {error}
      </Alert>
    )
  }

  if (!currentRoom) {
    return (
      <Alert severity="info" sx={{ m: 2 }}>
        לא נמצא חדר מו"מ
      </Alert>
    )
  }

  return (
    <Container maxWidth="xl" sx={{ height: '100vh', py: 2 }}>
      <Grid container spacing={2} sx={{ height: '100%' }}>
        {/* Main Content */}
        <Grid item xs={12} md={9} sx={{ height: '100%' }}>
          <Paper sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            {/* Header */}
            <Box sx={{ 
              p: 2, 
              borderBottom: 1, 
              borderColor: 'divider',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <Box>
                <Typography variant="h6">{'חדר משא ומתן'}</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                  <Chip 
                    label={connectionStatus} 
                    color={getConnectionStatusColor()}
                    size="small"
                  />
                  <Typography variant="body2" color="textSecondary">
                    {participants.length} משתתפים
                  </Typography>
                </Box>
              </Box>
              
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Tooltip title="הקלטה">
                  <IconButton 
                    color={isRecording ? 'error' : 'default'}
                    onClick={() => setIsRecording(!isRecording)}
                  >
                    {isRecording ? <Stop /> : <RecordVoiceOver />}
                  </IconButton>
                </Tooltip>
                
                <Tooltip title="שיתוף מסך">
                  <IconButton 
                    color={isScreenSharing ? 'primary' : 'default'}
                    onClick={() => setIsScreenSharing(!isScreenSharing)}
                  >
                    {isScreenSharing ? <StopScreenShare /> : <ScreenShare />}
                  </IconButton>
                </Tooltip>
                
                <Tooltip title="הגדרות">
                  <IconButton onClick={() => setShowSettings(true)}>
                    <Settings />
                  </IconButton>
                </Tooltip>
                
                <Button 
                  variant="outlined" 
                  color="error"
                  onClick={() => navigate('/negotiation')}
                  startIcon={<Close />}
                >
                  עזוב חדר
                </Button>
              </Box>
            </Box>

            {/* Content Tabs */}
            <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
              <Tab icon={<Chat />} label="צ'אט" />
              <Tab icon={<VideoCall />} label="וידאו" />
              <Tab icon={<Description />} label="מסמכים" />
              <Tab icon={<Schedule />} label="סדר יום" />
            </Tabs>

            {/* Tab Content */}
            <Box sx={{ flex: 1, overflow: 'hidden' }}>
              {activeTab === 0 && (
                <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  {/* Messages */}
                  <Box sx={{ 
                    flex: 1, 
                    overflow: 'auto', 
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 1
                  }}>
                    {messages.map((message) => (
                      <Box
                        key={message.id}
                        sx={{
                          display: 'flex',
                          justifyContent: message.senderId === 'current-user' ? 'flex-end' : 'flex-start',
                          mb: 1
                        }}
                      >
                        <Paper
                          sx={{
                            p: 1.5,
                            maxWidth: '70%',
                            backgroundColor: message.senderId === 'current-user' 
                              ? 'primary.main' 
                              : 'grey.100',
                            color: message.senderId === 'current-user' 
                              ? 'primary.contrastText' 
                              : 'text.primary'
                          }}
                        >
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                            <Typography variant="caption" fontWeight="bold">
                              {message.senderName}
                            </Typography>
                            <Typography variant="caption" color="textSecondary">
                              {formatTime(message.timestamp)}
                            </Typography>
                          </Box>
                          <Typography variant="body2">
                            {message.content}
                          </Typography>
                        </Paper>
                      </Box>
                    ))}
                    
                    {typingUsers.length > 0 && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, p: 1 }}>
                        <Typography variant="caption" color="textSecondary">
                          {typingUsers.join(', ')} כותבים...
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 0.5 }}>
                          <Box sx={{ 
                            width: 4, 
                            height: 4, 
                            borderRadius: '50%', 
                            backgroundColor: 'grey.400',
                            animation: 'pulse 1.5s infinite'
                          }} />
                          <Box sx={{ 
                            width: 4, 
                            height: 4, 
                            borderRadius: '50%', 
                            backgroundColor: 'grey.400',
                            animation: 'pulse 1.5s infinite 0.2s'
                          }} />
                          <Box sx={{ 
                            width: 4, 
                            height: 4, 
                            borderRadius: '50%', 
                            backgroundColor: 'grey.400',
                            animation: 'pulse 1.5s infinite 0.4s'
                          }} />
                        </Box>
                      </Box>
                    )}
                    
                    <div ref={messagesEndRef} />
                  </Box>

                  {/* Message Input */}
                  <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-end' }}>
                      <TextField
                        fullWidth
                        multiline
                        maxRows={4}
                        value={messageText}
                        onChange={(e) => setMessageText(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="הקלד הודעה..."
                        variant="outlined"
                        size="small"
                      />
                      
                      <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        hidden
                        onChange={handleFileUpload}
                      />
                      
                      <Tooltip title="צרף קובץ">
                        <IconButton onClick={() => fileInputRef.current?.click()}>
                          <AttachFile />
                        </IconButton>
                      </Tooltip>
                      
                      <Tooltip title="אימוג'י">
                        <IconButton>
                          <EmojiEmotions />
                        </IconButton>
                      </Tooltip>
                      
                      <Button
                        variant="contained"
                        onClick={handleSendMessage}
                        disabled={!messageText.trim()}
                        startIcon={<Send />}
                      >
                        שלח
                      </Button>
                    </Box>
                  </Box>
                </Box>
              )}

              {activeTab === 1 && (
                <Box sx={{ p: 3, textAlign: 'center' }}>
                  <Typography variant="h6" gutterBottom>
                    פגישת וידאו
                  </Typography>
                  <Typography color="textSecondary">
                    כאן יוצג ממשק וידאו עם המשתתפים
                  </Typography>
                </Box>
              )}

              {activeTab === 2 && (
                <Box sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    מסמכים משותפים
                  </Typography>
                  <Typography color="textSecondary">
                    כאן יוצגו המסמכים המשותפים בחדר
                  </Typography>
                </Box>
              )}

              {activeTab === 3 && (
                <Box sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    סדר יום
                  </Typography>
                  <Typography color="textSecondary">
                    כאן יוצג סדר היום של המו"מ
                  </Typography>
                </Box>
              )}
            </Box>
          </Paper>
        </Grid>

        {/* Sidebar */}
        <Grid item xs={12} md={3} sx={{ height: '100%' }}>
          <Paper sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            {/* Participants */}
            <Accordion 
              expanded={showParticipants} 
              onChange={() => setShowParticipants(!showParticipants)}
            >
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Typography variant="h6">
                  משתתפים ({participants.length})
                </Typography>
              </AccordionSummary>
              <AccordionDetails sx={{ p: 0 }}>
                <List dense>
                  {participants.map((participant) => (
                    <ListItem key={participant.id}>
                      <ListItemAvatar>
                        <Badge
                          color={participant.status === 'online' ? 'success' : 'default'}
                          variant="dot"
                          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                        >
                          <Avatar>
                            <Person />
                          </Avatar>
                        </Badge>
                      </ListItemAvatar>
                      <ListItemText
                        primary={participant.name}
                        secondary={participant.role}
                      />
                      <ListItemSecondaryAction>
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            setAnchorEl(e.currentTarget)
                          }}
                        >
                          <MoreVert />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                  ))}
                </List>
              </AccordionDetails>
            </Accordion>

            {/* Documents */}
            <Accordion 
              expanded={showDocuments} 
              onChange={() => setShowDocuments(!showDocuments)}
            >
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Typography variant="h6">
                  מסמכים ({documents.length})
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography color="textSecondary">
                  כאן יוצגו המסמכים המשותפים
                </Typography>
              </AccordionDetails>
            </Accordion>

            {/* Controls */}
            <Box sx={{ p: 2, mt: 'auto', borderTop: 1, borderColor: 'divider' }}>
              <Grid container spacing={1}>
                <Grid item xs={6}>
                  <Button
                    fullWidth
                    variant={isMuted ? 'contained' : 'outlined'}
                    color={isMuted ? 'error' : 'inherit'}
                    onClick={() => setIsMuted(!isMuted)}
                    startIcon={isMuted ? <MicOff /> : <Mic />}
                  >
                    {isMuted ? 'מושתק' : 'מיקרופון'}
                  </Button>
                </Grid>
                <Grid item xs={6}>
                  <Button
                    fullWidth
                    variant={isVideoOn ? 'outlined' : 'contained'}
                    color={isVideoOn ? 'inherit' : 'error'}
                    onClick={() => setIsVideoOn(!isVideoOn)}
                    startIcon={isVideoOn ? <VideoCall /> : <VideocamOff />}
                  >
                    {isVideoOn ? 'וידאו' : 'כבוי'}
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Participant Actions Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
      >
        <MenuItem onClick={() => handleParticipantAction('mute')}>
          השתק
        </MenuItem>
        <MenuItem onClick={() => handleParticipantAction('remove')}>
          הסר מהחדר
        </MenuItem>
        <MenuItem onClick={() => handleParticipantAction('block')}>
          חסום
        </MenuItem>
      </Menu>

      {/* Settings Dialog */}
      <Dialog open={showSettings} onClose={() => setShowSettings(false)} maxWidth="sm" fullWidth>
        <DialogTitle>הגדרות חדר מו"מ</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <FormControlLabel
              control={
                <Switch 
                  checked={isRecording} 
                  onChange={(e) => setIsRecording(e.target.checked)}
                />
              }
              label="הקלטה אוטומטית"
            />
            <FormControlLabel
              control={
                <Switch 
                  checked={isScreenSharing} 
                  onChange={(e) => setIsScreenSharing(e.target.checked)}
                />
              }
              label="שיתוף מסך אוטומטי"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowSettings(false)}>ביטול</Button>
          <Button variant="contained" onClick={() => setShowSettings(false)}>
            שמור
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
}

export default NegotiationRoom

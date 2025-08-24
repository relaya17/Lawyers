import React, { useState, useRef, useEffect } from 'react'
import { 
  Box, 
  Container, 
  Typography, 
  Button, 
  Grid, 
  Card, 
  CardContent, 
  Chip,
  TextField,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  LinearProgress,
  Tooltip,
  Badge
} from '@mui/material'
import { 
  Handshake, 
  Chat, 
  Send, 
  AttachFile, 
  EmojiEmotions,
  SmartToy,
  TrendingUp,
  Warning,
  CheckCircle,
  Error,
  MoreVert,
  History,
  Assessment,
  Psychology,
  Lightbulb
} from '@mui/icons-material'


interface Message {
  id: string
  sender: 'user' | 'counterparty' | 'ai'
  content: string
  timestamp: Date
  type: 'text' | 'offer' | 'counter-offer' | 'accept' | 'reject'
  metadata?: {
    offer?: {
      amount: number
      terms: string[]
      risk: 'low' | 'medium' | 'high'
    }
  }
}

interface NegotiationSession {
  id: string
  contractTitle: string
  counterparty: string
  status: 'active' | 'completed' | 'failed'
  startDate: Date
  lastActivity: Date
  messages: Message[]
}

export const NegotiationPage: React.FC = () => {
  const [sessions, setSessions] = useState<NegotiationSession[]>([])
  const [currentSession, setCurrentSession] = useState<NegotiationSession | null>(null)
  const [message, setMessage] = useState('')
  const [showNewSessionDialog, setShowNewSessionDialog] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Mock data
  const mockSessions: NegotiationSession[] = [
    {
      id: '1',
      contractTitle: 'חוזה שכירות דירה',
      counterparty: 'יוסי כהן',
      status: 'active',
      startDate: new Date('2024-01-15'),
      lastActivity: new Date('2024-01-20'),
      messages: [
        {
          id: '1',
          sender: 'counterparty',
          content: 'שלום, אני מעוניין לשכור את הדירה שלך. מה התנאים?',
          timestamp: new Date('2024-01-15T10:00:00'),
          type: 'text'
        },
        {
          id: '2',
          sender: 'user',
          content: 'שלום! השכירות היא 5,000 ₪ לחודש עם הפקדת פיקדון של 3 חודשי שכירות',
          timestamp: new Date('2024-01-15T10:05:00'),
          type: 'offer',
          metadata: {
            offer: {
              amount: 5000,
              terms: ['הפקדת פיקדון של 3 חודשי שכירות'],
              risk: 'low'
            }
          }
        },
        {
          id: '3',
          sender: 'counterparty',
          content: 'האם אפשר להפחית את הפיקדון ל-2 חודשים?',
          timestamp: new Date('2024-01-15T10:10:00'),
          type: 'text'
        },
        {
          id: '4',
          sender: 'ai',
          content: 'המלצה: הציעו פיקדון של 2.5 חודשים כפשרה. זה מאוזן ומראה גמישות',
          timestamp: new Date('2024-01-15T10:11:00'),
          type: 'text'
        },
        {
          id: '5',
          sender: 'user',
          content: 'אני מוכן להפחית את הפיקדון ל-2.5 חודשים',
          timestamp: new Date('2024-01-15T10:15:00'),
          type: 'counter-offer',
          metadata: {
            offer: {
              amount: 5000,
              terms: ['הפקדת פיקדון של 2.5 חודשי שכירות'],
              risk: 'medium'
            }
          }
        }
      ]
    },
    {
      id: '2',
      contractTitle: 'חוזה שירותי IT',
      counterparty: 'חברת טכנולוגיה בע״מ',
      status: 'active',
      startDate: new Date('2024-01-18'),
      lastActivity: new Date('2024-01-19'),
      messages: [
        {
          id: '1',
          sender: 'counterparty',
          content: 'אנחנו מעוניינים בשירותי תחזוקת מערכות. מה המחיר?',
          timestamp: new Date('2024-01-18T14:00:00'),
          type: 'text'
        }
      ]
    }
  ]

  useEffect(() => {
    setSessions(mockSessions)
    if (mockSessions.length > 0) {
      setCurrentSession(mockSessions[0])
    }
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [currentSession?.messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleSendMessage = async () => {
    if (!message.trim() || !currentSession) return

    const newMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      content: message,
      timestamp: new Date(),
      type: 'text'
    }

    const updatedSession = {
      ...currentSession,
      messages: [...currentSession.messages, newMessage],
      lastActivity: new Date()
    }

    setCurrentSession(updatedSession)
    setMessage('')
    setIsTyping(true)

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        content: generateAIResponse(message),
        timestamp: new Date(),
        type: 'text'
      }

      const finalSession = {
        ...updatedSession,
        messages: [...updatedSession.messages, aiResponse]
      }

      setCurrentSession(finalSession)
      setIsTyping(false)
    }, 2000)
  }

  const generateAIResponse = (userMessage: string): string => {
    const responses = [
      'המלצה: הציעו פשרה של 10% מהמחיר המקורי',
      'אסטרטגיה: התמקדו בערך המוסף שאתם מביאים',
      'סיכון נמוך - הצד השני נראה מעוניין',
      'הציעו תנאי תשלום גמישים יותר',
      'הדגישו את הניסיון והידע שלכם בתחום'
    ]
    return responses[Math.floor(Math.random() * responses.length)]
  }

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      handleSendMessage()
    }
  }

  const getSenderAvatar = (sender: string) => {
    switch (sender) {
      case 'user':
        return <Avatar sx={{ bgcolor: 'primary.main' }}>אני</Avatar>
      case 'counterparty':
        return <Avatar sx={{ bgcolor: 'secondary.main' }}>צד</Avatar>
      case 'ai':
        return <Avatar sx={{ bgcolor: 'success.main' }}><SmartToy /></Avatar>
      default:
        return <Avatar>?</Avatar>
    }
  }

  const getMessageStyle = (sender: string) => {
    switch (sender) {
      case 'user':
        return { alignSelf: 'flex-end', bgcolor: 'primary.main', color: 'white' }
      case 'counterparty':
        return { alignSelf: 'flex-start', bgcolor: 'grey.100' }
      case 'ai':
        return { alignSelf: 'flex-start', bgcolor: 'success.light', color: 'success.contrastText' }
      default:
        return {}
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'success'
      case 'completed': return 'primary'
      case 'failed': return 'error'
      default: return 'default'
    }
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h4" component="h1">
            חדר משא ומתן
          </Typography>
          <Button
            variant="contained"
            startIcon={<Chat />}
            onClick={() => setShowNewSessionDialog(true)}
          >
            מו״מ חדש
          </Button>
        </Box>

        <Grid container spacing={3}>
          {/* Sessions List */}
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  מו״מ פעילים
                </Typography>
                <List>
                  {sessions.map((session) => (
                    <React.Fragment key={session.id}>
                      <ListItem 
                        button 
                        selected={currentSession?.id === session.id}
                        onClick={() => setCurrentSession(session)}
                      >
                        <ListItemAvatar>
                          <Badge
                            badgeContent={session.messages.filter(m => m.sender === 'counterparty').length}
                            color="primary"
                          >
                            <Avatar>
                              <Handshake />
                            </Avatar>
                          </Badge>
                        </ListItemAvatar>
                        <ListItemText
                          primary={session.contractTitle}
                          secondary={
                            <Box>
                              <Typography variant="body2" color="text.secondary">
                                {session.counterparty}
                              </Typography>
                              <Chip 
                                label={session.status} 
                                size="small" 
                                color={getStatusColor(session.status)}
                                sx={{ mt: 0.5 }}
                              />
                            </Box>
                          }
                        />
                      </ListItem>
                      <Divider />
                    </React.Fragment>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>

          {/* Chat Area */}
          <Grid item xs={12} md={8}>
            {currentSession ? (
              <Card sx={{ height: '70vh', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                  {/* Chat Header */}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, pb: 2, borderBottom: 1, borderColor: 'divider' }}>
                    <Box>
                      <Typography variant="h6">{currentSession.contractTitle}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        עם {currentSession.counterparty}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Tooltip title="היסטוריית מו״מ">
                        <IconButton size="small">
                          <History />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="ניתוח מו״מ">
                        <IconButton size="small">
                          <Assessment />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Box>

                  {/* Messages */}
                  <Box sx={{ flexGrow: 1, overflow: 'auto', mb: 2 }}>
                    {currentSession.messages.map((msg) => (
                      <Box
                        key={msg.id}
                        sx={{
                          display: 'flex',
                          mb: 2,
                          flexDirection: msg.sender === 'user' ? 'row-reverse' : 'row'
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, maxWidth: '70%' }}>
                          {msg.sender !== 'user' && getSenderAvatar(msg.sender)}
                          <Paper
                            sx={{
                              p: 2,
                              ...getMessageStyle(msg.sender),
                              borderRadius: 2
                            }}
                          >
                            <Typography variant="body2">
                              {msg.content}
                            </Typography>
                            {msg.metadata?.offer && (
                              <Box sx={{ mt: 1 }}>
                                <Chip 
                                  label={`₪${msg.metadata.offer.amount.toLocaleString()}`} 
                                  size="small" 
                                  color="primary"
                                />
                                <Typography variant="caption" display="block" sx={{ mt: 0.5 }}>
                                  {msg.metadata.offer.terms.join(', ')}
                                </Typography>
                              </Box>
                            )}
                            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                              {msg.timestamp.toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' })}
                            </Typography>
                          </Paper>
                          {msg.sender === 'user' && getSenderAvatar(msg.sender)}
                        </Box>
                      </Box>
                    ))}
                    
                    {isTyping && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                        <Avatar sx={{ bgcolor: 'success.main' }}><SmartToy /></Avatar>
                        <Paper sx={{ p: 2, bgcolor: 'success.light' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="body2">AI כותב...</Typography>
                            <LinearProgress sx={{ width: 50 }} />
                          </Box>
                        </Paper>
                      </Box>
                    )}
                    
                    <div ref={messagesEndRef} />
                  </Box>

                  {/* Input Area */}
                  <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-end' }}>
                    <TextField
                      fullWidth
                      multiline
                      maxRows={4}
                      placeholder="הקלד הודעה..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      InputProps={{
                        endAdornment: (
                          <Box sx={{ display: 'flex', gap: 0.5 }}>
                            <IconButton size="small">
                              <AttachFile />
                            </IconButton>
                            <IconButton size="small">
                              <EmojiEmotions />
                            </IconButton>
                          </Box>
                        )
                      }}
                    />
                    <Button
                      variant="contained"
                      onClick={handleSendMessage}
                      disabled={!message.trim()}
                    >
                      <Send />
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            ) : (
              <Card sx={{ p: 4, textAlign: 'center' }}>
                <Handshake sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  בחר מו״מ להתחיל
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  או צור מו״מ חדש
                </Typography>
              </Card>
            )}
          </Grid>
        </Grid>

        {/* AI Recommendations */}
        {currentSession && (
          <Card sx={{ mt: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Psychology color="primary" />
                המלצות AI למו״מ
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <Alert severity="info" icon={<Lightbulb />}>
                    <Typography variant="subtitle2" gutterBottom>
                      אסטרטגיה
                    </Typography>
                    <Typography variant="body2">
                      התמקדו בתנאי הפיקדון כנקודת מיקוח
                    </Typography>
                  </Alert>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Alert severity="success" icon={<TrendingUp />}>
                    <Typography variant="subtitle2" gutterBottom>
                      הזדמנות
                    </Typography>
                    <Typography variant="body2">
                      הצד השני נראה מעוניין - זמן טוב להציע פשרה
                    </Typography>
                  </Alert>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Alert severity="warning" icon={<Warning />}>
                    <Typography variant="subtitle2" gutterBottom>
                      סיכון
                    </Typography>
                    <Typography variant="body2">
                      סיכון בינוני - הצד השני עשוי לסרב להצעה
                    </Typography>
                  </Alert>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        )}

        {/* New Session Dialog */}
        <Dialog open={showNewSessionDialog} onClose={() => setShowNewSessionDialog(false)} maxWidth="sm" fullWidth>
          <DialogTitle>מו״מ חדש</DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              label="כותרת החוזה"
              margin="normal"
              placeholder="למשל: חוזה שכירות דירה"
            />
            <TextField
              fullWidth
              label="צד שני"
              margin="normal"
              placeholder="שם הצד השני"
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>סוג חוזה</InputLabel>
              <Select label="סוג חוזה">
                <MenuItem value="rental">שכירות</MenuItem>
                <MenuItem value="employment">העסקה</MenuItem>
                <MenuItem value="service">שירותים</MenuItem>
                <MenuItem value="partnership">שותפות</MenuItem>
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowNewSessionDialog(false)}>
              ביטול
            </Button>
            <Button variant="contained">
              התחל מו״מ
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Container>
  )
}

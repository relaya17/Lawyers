import React, { useState, useRef, useEffect } from 'react'
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  Avatar,
  Chip,
  LinearProgress,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Tooltip,
  Divider,
  Tab,
  Tabs,
  Paper,
} from '@mui/material'
import {
  Send,
  Psychology,
  ExpandMore,
  Settings,
  History,
  Clear,
  Upload,
  Download,
  Share,
  Star,
  Warning,
  CheckCircle,
  Info,
  SmartToy,
  Lightbulb,
  Security,
  Gavel,
  Language,
  Summarize,
} from '@mui/icons-material'
import { useTranslation } from 'react-i18next'
import { aiService } from '../services/aiService'
import { AIChat, AIChatMessage, AIAnalysisResult, AISuggestion } from '../types/aiTypes'

interface AIAssistantProps {
  onClose?: () => void
  initialContent?: string
  mode?: 'chat' | 'analysis' | 'generation'
}

export const AIAssistant: React.FC<AIAssistantProps> = ({
  onClose,
  initialContent,
  mode = 'chat'
}) => {
  const { t } = useTranslation()
  const [currentChat, setCurrentChat] = useState<AIChat | null>(null)
  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState(0)
  const [analysisResult, setAnalysisResult] = useState<AIAnalysisResult | null>(null)
  const [suggestions, setSuggestions] = useState<AISuggestion[]>([])
  const [settingsOpen, setSettingsOpen] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    initializeChat()
    if (initialContent) {
      setMessage(initialContent)
    }
  }, [initialContent])

  useEffect(() => {
    scrollToBottom()
  }, [currentChat?.messages])

  const initializeChat = async () => {
    try {
      const chat = await aiService.createChat('ייעוץ משפטי')
      setCurrentChat(chat)
    } catch (error) {
      console.error('Failed to initialize chat:', error)
    }
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleSendMessage = async () => {
    if (!message.trim() || !currentChat || isLoading) return

    setIsLoading(true)
    try {
      const response = await aiService.sendChatMessage(currentChat.id, message)
      
      // Update current chat
      const updatedChat = {
        ...currentChat,
        messages: [...currentChat.messages, {
          id: Date.now().toString(),
          role: 'user' as const,
          content: message,
          timestamp: Date.now()
        }, response]
      }
      
      setCurrentChat(updatedChat)
      setMessage('')

      // If response includes suggestions, update suggestions
      if (response.metadata?.suggestions) {
        setSuggestions(response.metadata.suggestions)
      }
    } catch (error) {
      console.error('Failed to send message:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAnalyzeDocument = async () => {
    if (!message.trim()) return

    setIsLoading(true)
    try {
      const result = await aiService.analyzeContract(message)
      // Convert AIResponse to AIAnalysisResult
      const analysisResult: AIAnalysisResult = {
        id: result.id,
        type: result.type as any,
        summary: result.content,
        details: {},
        risks: [],
        suggestions: result.suggestions || [],
        confidence: 0.85,
        metadata: result.metadata || {}
      }
      setAnalysisResult(analysisResult)
      setSuggestions(result.suggestions || [])
      setActiveTab(1) // Switch to analysis tab
    } catch (error) {
      console.error('Failed to analyze document:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleGenerateDocument = async () => {
    if (!message.trim()) return

    setIsLoading(true)
    try {
      const response = await aiService.generateDocument(message, 'contract')
      if (currentChat) {
        const updatedChat = {
          ...currentChat,
          messages: [...currentChat.messages, {
            id: Date.now().toString(),
            role: 'assistant' as const,
            content: response.content,
            type: 'document' as const,
            timestamp: Date.now()
          }]
        }
        setCurrentChat(updatedChat)
      }
      setActiveTab(2) // Switch to generation tab
    } catch (error) {
      console.error('Failed to generate document:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const renderMessage = (message: AIChatMessage) => {
    const isUser = message.role === 'user'
    
    return (
      <ListItem key={message.id} sx={{ alignItems: 'flex-start', px: 1 }}>
        <Avatar
          sx={{
            bgcolor: isUser ? 'primary.main' : 'secondary.main',
            width: 32,
            height: 32,
            mr: 1
          }}
        >
          {isUser ? 'U' : <SmartToy />}
        </Avatar>
        <Box sx={{ flex: 1 }}>
          <Paper
            elevation={1}
            sx={{
              p: 2,
              bgcolor: isUser ? 'primary.light' : 'grey.100',
              color: isUser ? 'primary.contrastText' : 'text.primary',
              borderRadius: 2,
            }}
          >
            <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
              {message.content}
            </Typography>
            {message.type === 'document' && (
              <Box sx={{ mt: 1 }}>
                <Chip
                  icon={<Gavel />}
                  label="מסמך שנוצר"
                  size="small"
                  color="secondary"
                />
              </Box>
            )}
          </Paper>
          <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
            {new Date(message.timestamp).toLocaleTimeString('he-IL')}
          </Typography>
        </Box>
      </ListItem>
    )
  }

  const renderAnalysisResult = () => {
    if (!analysisResult) return null

    return (
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            תוצאות הניתוח
          </Typography>
          
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" color="text.secondary">
              רמת ביטחון: {Math.round(analysisResult.confidence * 100)}%
            </Typography>
            <LinearProgress
              variant="determinate"
              value={analysisResult.confidence * 100}
              sx={{ mt: 1 }}
              color={analysisResult.confidence > 0.8 ? 'success' : analysisResult.confidence > 0.6 ? 'warning' : 'error'}
            />
          </Box>

          <Typography variant="body1" sx={{ mb: 2 }}>
            {analysisResult.summary}
          </Typography>

          {analysisResult.risks.length > 0 && (
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Warning color="warning" />
                  <Typography>סיכונים שזוהו ({analysisResult.risks.length})</Typography>
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                {analysisResult.risks.map((risk) => (
                  <Card key={risk.id} sx={{ mb: 1 }}>
                    <CardContent sx={{ py: 1 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <Typography variant="subtitle2">{risk.description}</Typography>
                        <Chip
                          label={risk.severity}
                          size="small"
                          color={
                            risk.severity === 'critical' ? 'error' :
                            risk.severity === 'high' ? 'warning' :
                            risk.severity === 'medium' ? 'info' : 'default'
                          }
                        />
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        השפעה: {risk.impact}
                      </Typography>
                      <Typography variant="body2" color="success.main">
                        המלצה: {risk.mitigation}
                      </Typography>
                    </CardContent>
                  </Card>
                ))}
              </AccordionDetails>
            </Accordion>
          )}
        </CardContent>
      </Card>
    )
  }

  const renderSuggestions = () => {
    if (suggestions.length === 0) return null

    return (
      <Card sx={{ mt: 2 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            <Lightbulb sx={{ mr: 1, verticalAlign: 'middle' }} />
            המלצות לשיפור
          </Typography>
          
          {suggestions.map((suggestion) => (
            <Card key={suggestion.id} sx={{ mb: 1, bgcolor: 'background.default' }}>
              <CardContent sx={{ py: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Typography variant="subtitle2">{suggestion.title}</Typography>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Chip
                      label={suggestion.priority}
                      size="small"
                      color={
                        suggestion.priority === 'critical' ? 'error' :
                        suggestion.priority === 'high' ? 'warning' :
                        suggestion.priority === 'medium' ? 'info' : 'default'
                      }
                    />
                    <Chip
                      label={`${Math.round(suggestion.confidence * 100)}%`}
                      size="small"
                      variant="outlined"
                    />
                  </Box>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  {suggestion.description}
                </Typography>
                {suggestion.action && (
                  <Button size="small" sx={{ mt: 1 }}>
                    {suggestion.action}
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </CardContent>
      </Card>
    )
  }

  const quickActions = [
    { label: 'נתח חוזה', icon: <Gavel />, action: handleAnalyzeDocument },
    { label: 'צור מסמך', icon: <Summarize />, action: handleGenerateDocument },
    { label: 'בדוק סיכונים', icon: <Security />, action: () => handleAnalyzeDocument() },
    { label: 'תרגם', icon: <Language />, action: () => {} },
  ]

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Psychology color="primary" />
            <Typography variant="h6">עוזר AI משפטי</Typography>
          </Box>
          <Box>
            <IconButton onClick={() => setSettingsOpen(true)}>
              <Settings />
            </IconButton>
            {onClose && (
              <IconButton onClick={onClose}>
                <Clear />
              </IconButton>
            )}
          </Box>
        </Box>

        {/* Tabs */}
        <Tabs value={activeTab} onChange={(_, newValue) => setActiveTab(newValue)} sx={{ mt: 1 }}>
          <Tab label="צ'אט" />
          <Tab label="ניתוח" />
          <Tab label="יצירה" />
        </Tabs>
      </Box>

      {/* Content */}
      <Box sx={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        {activeTab === 0 && (
          <>
            {/* Messages */}
            <Box sx={{ flex: 1, overflow: 'auto', px: 1 }}>
              {currentChat && (
                <List>
                  {currentChat.messages.map(renderMessage)}
                </List>
              )}
              <div ref={messagesEndRef} />
            </Box>

            {/* Quick Actions */}
            <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
              <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                פעולות מהירות:
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {quickActions.map((action, index) => (
                  <Chip
                    key={index}
                    icon={action.icon}
                    label={action.label}
                    onClick={action.action}
                    clickable
                    size="small"
                    variant="outlined"
                  />
                ))}
              </Box>
            </Box>
          </>
        )}

        {activeTab === 1 && (
          <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
            {renderAnalysisResult()}
            {renderSuggestions()}
          </Box>
        )}

        {activeTab === 2 && (
          <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
            <Typography variant="h6" gutterBottom>
              יצירת מסמכים
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              תאר את סוג המסמך שברצונך ליצור והמערכת תיצור עבורך טיוטה ראשונית.
            </Typography>
            
            {currentChat?.messages
              .filter(msg => msg.type === 'document')
              .map(renderMessage)}
          </Box>
        )}
      </Box>

      {/* Input */}
      <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <TextField
            fullWidth
            multiline
            maxRows={4}
            placeholder="הקלד את שאלתך או הדבק טקסט לניתוח..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                handleSendMessage()
              }
            }}
            disabled={isLoading}
          />
          <Button
            variant="contained"
            onClick={handleSendMessage}
            disabled={isLoading || !message.trim()}
            sx={{ minWidth: 'auto', px: 2 }}
          >
            <Send />
          </Button>
        </Box>
        
        {isLoading && (
          <Box sx={{ mt: 1 }}>
            <LinearProgress />
            <Typography variant="caption" color="text.secondary">
              מעבד את הבקשה...
            </Typography>
          </Box>
        )}
      </Box>

      {/* Settings Dialog */}
      <Dialog open={settingsOpen} onClose={() => setSettingsOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>הגדרות AI</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary">
            כאן ניתן להגדיר העדפות עבור עוזר ה-AI
          </Typography>
          {/* Add settings controls here */}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSettingsOpen(false)}>סגור</Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default AIAssistant
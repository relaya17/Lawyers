// AI Assistant - רכיב עוזר חכם
// תמיכה בנגישות, רספונסיביות ופונקציונליות מתקדמת

import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Paper,
  TextField,
  IconButton,
  Typography,
  Chip,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  CircularProgress,
  Alert,
  useTheme,
  useMediaQuery,
  Tooltip,
  Collapse,
  Divider,
  Badge,
  Switch,
  FormControlLabel,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Card,
  CardContent,
  Grid,
  Menu,
  MenuItem,
} from '@mui/material';
import {
  Send,
  SmartToy,
  Person,
  ExpandMore,
  ExpandLess,
  Settings,
  Mic,
  Stop,
  VolumeUp,
  VolumeOff,
  AutoAwesome,
  Psychology,
  School,
  Gavel,
  Description,
  Assessment,
  Handshake,
  Store,
  Security,
  Timeline,
  Close,
  Minimize,
  Maximize,
  MoreVert,
  FileUpload,
  Lightbulb,
  TrendingUp,
  Warning,
  CheckCircle,
  Error,
  Info,
  Help,
  Book,
  Search,
  FilterList,
  Download,
  Share,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  type: 'text' | 'suggestion' | 'error' | 'loading' | 'analysis' | 'recommendation';
  suggestions?: string[];
  context?: string;
  analysis?: {
    riskLevel: 'low' | 'medium' | 'high' | 'critical';
    confidence: number;
    recommendations: string[];
    issues: string[];
  };
  attachments?: Array<{
    name: string;
    type: string;
    size: number;
  }>;
}

interface AIAssistantProps {
  isOpen?: boolean;
  onToggle?: (open: boolean) => void;
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  compact?: boolean;
  initialContext?: string;
}

export const AIAssistant: React.FC<AIAssistantProps> = ({
  isOpen = false,
  onToggle,
  position = 'bottom-right',
  compact = false,
  initialContext,
}) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [autoSuggestions, setAutoSuggestions] = useState(true);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // הודעת פתיחה
  useEffect(() => {
    if (messages.length === 0) {
      const welcomeMessage: Message = {
        id: '1',
        content: 'שלום! אני העוזר החכם של ContractLab Pro. איך אוכל לעזור לך היום?',
        sender: 'ai',
        timestamp: new Date(),
        type: 'text',
        suggestions: [
          'צור חוזה חדש',
          'בדוק סיכונים בחוזה',
          'הפעל סימולטור משפטי',
          'עזרה במו״מ',
          'ניתוח מסמך משפטי',
        ],
      };
      setMessages([welcomeMessage]);
    }
  }, [messages.length]);

  // גלילה אוטומטית להודעה האחרונה
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // שליחת הודעה
  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: 'user',
      timestamp: new Date(),
      type: 'text',
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    // הודעת טעינה
    const loadingMessage: Message = {
      id: (Date.now() + 1).toString(),
      content: '',
      sender: 'ai',
      timestamp: new Date(),
      type: 'loading',
    };

    setMessages(prev => [...prev, loadingMessage]);

    try {
      // סימולציה של תגובת AI
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const aiResponse = await generateAIResponse(inputValue);
      
      setMessages(prev => prev.map(msg => 
        msg.id === loadingMessage.id 
          ? { ...aiResponse, id: msg.id }
          : msg
      ));
    } catch (error) {
      setMessages(prev => prev.map(msg => 
        msg.id === loadingMessage.id 
          ? {
              id: msg.id,
              content: 'מצטער, אירעה שגיאה. נסה שוב.',
              sender: 'ai',
              timestamp: new Date(),
              type: 'error',
            }
          : msg
      ));
    } finally {
      setIsLoading(false);
    }
  };

  // יצירת תגובת AI
  const generateAIResponse = async (userInput: string): Promise<Message> => {
    const lowerInput = userInput.toLowerCase();
    
    // תגובות מותאמות לפי הקלט
    if (lowerInput.includes('חוזה') || lowerInput.includes('contract')) {
      return {
        id: Date.now().toString(),
        content: 'אני יכול לעזור לך ליצור חוזה חדש! איזה סוג חוזה אתה צריך?',
        sender: 'ai',
        timestamp: new Date(),
        type: 'text',
        suggestions: ['חוזה שכירות', 'חוזה עבודה', 'חוזה שירות', 'חוזה מסחרי'],
      };
    }
    
    if (lowerInput.includes('סיכון') || lowerInput.includes('risk')) {
      return {
        id: Date.now().toString(),
        content: 'בואו נבדוק את הסיכונים בחוזה שלך. העלה את החוזה ואני אנתח אותו.',
        sender: 'ai',
        timestamp: new Date(),
        type: 'analysis',
        suggestions: ['העלה חוזה', 'בדיקת סיכונים', 'המלצות לשיפור'],
        analysis: {
          riskLevel: 'medium',
          confidence: 85,
          recommendations: [
            'הוסף סעיף פיצוי במקרה של הפרה',
            'הגדר תנאי סיום ברורים',
            'הוסף סעיף בוררות',
          ],
          issues: [
            'חסר סעיף פיצוי',
            'תנאי סיום לא ברורים',
          ],
        },
      };
    }
    
    if (lowerInput.includes('סימולטור') || lowerInput.includes('simulator')) {
      return {
        id: Date.now().toString(),
        content: 'הסימולטור מאפשר לך לתרגל תרחישים משפטיים. איזה תרחיש תרצה לנסות?',
        sender: 'ai',
        timestamp: new Date(),
        type: 'text',
        suggestions: ['תביעה אזרחית', 'מו״מ חוזי', 'בוררות', 'גישור'],
      };
    }
    
    if (lowerInput.includes('מו״מ') || lowerInput.includes('negotiation')) {
      return {
        id: Date.now().toString(),
        content: 'אני יכול לעזור לך במו״מ! מה המטרה שלך?',
        sender: 'ai',
        timestamp: new Date(),
        type: 'recommendation',
        suggestions: ['אסטרטגיות מו״מ', 'טקטיקות משפטיות', 'ניתוח עמדות'],
      };
    }
    
    // תגובה כללית
    return {
      id: Date.now().toString(),
      content: 'אני כאן כדי לעזור לך עם כל דבר הקשור לחוזים ומשפט. מה תרצה לדעת?',
      sender: 'ai',
      timestamp: new Date(),
      type: 'text',
      suggestions: ['צור חוזה', 'בדוק סיכונים', 'הפעל סימולטור', 'עזרה במו״מ'],
    };
  };

  // טיפול בהצעות
  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
    inputRef.current?.focus();
  };

  // הקלטה קולית
  const handleVoiceToggle = () => {
    if (isRecording) {
      setIsRecording(false);
      // עצירת הקלטה
    } else {
      setIsRecording(true);
      // התחלת הקלטה
      setTimeout(() => {
        setIsRecording(false);
        setInputValue('הודעה מוקלטת לדוגמה');
      }, 3000);
    }
  };

  // העלאת קובץ
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      const fileMessage: Message = {
        id: Date.now().toString(),
        content: `העליתי קובץ: ${file.name}`,
        sender: 'user',
        timestamp: new Date(),
        type: 'text',
        attachments: [{
          name: file.name,
          type: file.type,
          size: file.size,
        }],
      };
      setMessages(prev => [...prev, fileMessage]);
      
      // ניתוח הקובץ
      setTimeout(() => {
        const analysisMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: 'אני מנתח את הקובץ שלך...',
          sender: 'ai',
          timestamp: new Date(),
          type: 'analysis',
          analysis: {
            riskLevel: 'low',
            confidence: 92,
            recommendations: [
              'החוזה נראה תקין',
              'הוסף סעיף פיצוי',
              'הגדר תנאי סיום',
            ],
            issues: [
              'חסר סעיף פיצוי',
            ],
          },
        };
        setMessages(prev => [...prev, analysisMessage]);
      }, 2000);
    }
  };

  // פעולות מהירות
  const quickActions = [
    { title: 'צור חוזה', icon: <Description />, action: () => handleSuggestionClick('צור חוזה חדש') },
    { title: 'בדוק סיכונים', icon: <Assessment />, action: () => handleSuggestionClick('בדוק סיכונים בחוזה') },
    { title: 'הפעל סימולטור', icon: <School />, action: () => handleSuggestionClick('הפעל סימולטור משפטי') },
    { title: 'עזרה במו״מ', icon: <Handshake />, action: () => handleSuggestionClick('עזרה במו״מ') },
    { title: 'ניתוח מסמך', icon: <Search />, action: () => fileInputRef.current?.click() },
  ];

  // רכיב הודעה
  const MessageItem: React.FC<{ message: Message }> = ({ message }) => (
    <ListItem
      sx={{
        flexDirection: 'column',
        alignItems: message.sender === 'user' ? 'flex-end' : 'flex-start',
        px: 1,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: 1,
          maxWidth: '80%',
          flexDirection: message.sender === 'user' ? 'row-reverse' : 'row',
        }}
      >
        <Avatar
          sx={{
            bgcolor: message.sender === 'ai' ? 'primary.main' : 'secondary.main',
            width: 32,
            height: 32,
          }}
        >
          {message.sender === 'ai' ? <SmartToy /> : <Person />}
        </Avatar>
        
        <Paper
          sx={{
            p: 2,
            bgcolor: message.sender === 'user' ? 'primary.main' : 'grey.100',
            color: message.sender === 'user' ? 'white' : 'text.primary',
            borderRadius: 2,
            maxWidth: '100%',
          }}
        >
          {message.type === 'loading' ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CircularProgress size={16} />
              <Typography variant="body2">כותב...</Typography>
            </Box>
          ) : (
            <>
              <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                {message.content}
              </Typography>
              
              {/* ניתוח סיכונים */}
              {message.analysis && (
                <Box sx={{ mt: 2, p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <Assessment fontSize="small" />
                    <Typography variant="subtitle2">ניתוח סיכונים</Typography>
                    <Chip 
                      label={`ביטחון: ${message.analysis.confidence}%`} 
                      size="small" 
                      color="primary"
                    />
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <Typography variant="body2">רמת סיכון:</Typography>
                    <Chip 
                      label={message.analysis.riskLevel === 'low' ? 'נמוכה' : 
                             message.analysis.riskLevel === 'medium' ? 'בינונית' :
                             message.analysis.riskLevel === 'high' ? 'גבוהה' : 'קריטית'} 
                      size="small" 
                      color={message.analysis.riskLevel === 'low' ? 'success' : 
                             message.analysis.riskLevel === 'medium' ? 'warning' : 'error'}
                    />
                  </Box>
                  
                  {message.analysis.recommendations.length > 0 && (
                    <Box sx={{ mb: 1 }}>
                      <Typography variant="body2" fontWeight="bold" sx={{ mb: 0.5 }}>
                        המלצות:
                      </Typography>
                      <List dense sx={{ py: 0 }}>
                        {message.analysis.recommendations.map((rec, index) => (
                          <ListItem key={index} sx={{ py: 0.5 }}>
                            <CheckCircle fontSize="small" color="success" sx={{ mr: 1 }} />
                            <ListItemText primary={rec} />
                          </ListItem>
                        ))}
                      </List>
                    </Box>
                  )}
                  
                  {message.analysis.issues.length > 0 && (
                    <Box>
                      <Typography variant="body2" fontWeight="bold" sx={{ mb: 0.5 }}>
                        בעיות שזוהו:
                      </Typography>
                      <List dense sx={{ py: 0 }}>
                        {message.analysis.issues.map((issue, index) => (
                          <ListItem key={index} sx={{ py: 0.5 }}>
                            <Warning fontSize="small" color="warning" sx={{ mr: 1 }} />
                            <ListItemText primary={issue} />
                          </ListItem>
                        ))}
                      </List>
                    </Box>
                  )}
                </Box>
              )}
              
              {/* קבצים מצורפים */}
              {message.attachments && message.attachments.length > 0 && (
                <Box sx={{ mt: 1 }}>
                  {message.attachments.map((file, index) => (
                    <Chip
                      key={index}
                      label={`${file.name} (${(file.size / 1024).toFixed(1)}KB)`}
                      size="small"
                      sx={{ mr: 0.5, mb: 0.5 }}
                    />
                  ))}
                </Box>
              )}
              
              {message.suggestions && message.suggestions.length > 0 && (
                <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {message.suggestions.map((suggestion, index) => (
                    <Chip
                      key={index}
                      label={suggestion}
                      size="small"
                      onClick={() => handleSuggestionClick(suggestion)}
                      sx={{
                        cursor: 'pointer',
                        bgcolor: 'rgba(255,255,255,0.2)',
                        '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' },
                      }}
                    />
                  ))}
                </Box>
              )}
            </>
          )}
        </Paper>
      </Box>
      
      <Typography variant="caption" sx={{ mt: 0.5, opacity: 0.7 }}>
        {message.timestamp.toLocaleTimeString()}
      </Typography>
    </ListItem>
  );

  // רכיב קומפקטי למובייל
  if (compact && !isOpen) {
    return (
      <Fab
        color="primary"
        aria-label="פתח עוזר AI"
        onClick={() => onToggle?.(true)}
        sx={{
          position: 'fixed',
          [position.split('-')[0]]: 16,
          [position.split('-')[1]]: 16,
          zIndex: 1000,
        }}
      >
        <Badge badgeContent={messages.length > 1 ? messages.length - 1 : 0} color="error">
          <SmartToy />
        </Badge>
      </Fab>
    );
  }

  return (
    <Dialog
      open={isOpen}
      onClose={() => onToggle?.(false)}
      fullScreen={isMobile}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          height: isMobile ? '100%' : 600,
          maxHeight: isMobile ? '100%' : 600,
        },
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Avatar sx={{ bgcolor: 'primary.main' }}>
            <SmartToy />
          </Avatar>
          <Typography variant="h6">עוזר AI חכם</Typography>
          <Box sx={{ flexGrow: 1 }} />
          
          <Tooltip title="פעולות מהירות">
            <IconButton onClick={() => setShowQuickActions(!showQuickActions)}>
              <AutoAwesome />
            </IconButton>
          </Tooltip>
          
          <Tooltip title="הגדרות">
            <IconButton onClick={() => setShowSettings(!showSettings)}>
              <Settings />
            </IconButton>
          </Tooltip>
          
          <Tooltip title="מזער">
            <IconButton onClick={() => setIsMinimized(!isMinimized)}>
              {isMinimized ? <Maximize /> : <Minimize />}
            </IconButton>
          </Tooltip>
          
          <Tooltip title="סגור">
            <IconButton onClick={() => onToggle?.(false)}>
              <Close />
            </IconButton>
          </Tooltip>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ p: 0, display: 'flex', flexDirection: 'column' }}>
        {/* פעולות מהירות */}
        <Collapse in={showQuickActions}>
          <Box sx={{ p: 2, bgcolor: 'primary.light', color: 'white' }}>
            <Typography variant="subtitle2" gutterBottom>
              פעולות מהירות:
            </Typography>
            <Grid container spacing={1}>
              {quickActions.map((action, index) => (
                <Grid item xs={6} sm={4} key={index}>
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={action.icon}
                    onClick={action.action}
                    sx={{ 
                      color: 'white', 
                      borderColor: 'white',
                      '&:hover': { borderColor: 'white', bgcolor: 'rgba(255,255,255,0.1)' }
                    }}
                    fullWidth
                  >
                    {action.title}
                  </Button>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Collapse>

        {/* הגדרות */}
        <Collapse in={showSettings}>
          <Box sx={{ p: 2, bgcolor: 'grey.50' }}>
            <FormControlLabel
              control={
                <Switch
                  checked={autoSuggestions}
                  onChange={(e) => setAutoSuggestions(e.target.checked)}
                />
              }
              label="הצעות אוטומטיות"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={voiceEnabled}
                  onChange={(e) => setVoiceEnabled(e.target.checked)}
                />
              }
              label="הקלטה קולית"
            />
          </Box>
          <Divider />
        </Collapse>

        {/* הודעות */}
        <Box sx={{ flex: 1, overflow: 'auto', minHeight: 300 }}>
          <List sx={{ py: 0 }}>
            {messages.map((message) => (
              <MessageItem key={message.id} message={message} />
            ))}
          </List>
          <div ref={messagesEndRef} />
        </Box>

        {/* קלט */}
        <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-end' }}>
            <TextField
              ref={inputRef}
              fullWidth
              multiline
              maxRows={4}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              placeholder="כתוב הודעה..."
              variant="outlined"
              size="small"
            />
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
              <Tooltip title="העלה קובץ">
                <IconButton 
                  size="small"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <FileUpload />
                </IconButton>
              </Tooltip>
              
              {voiceEnabled && (
                <Tooltip title={isRecording ? "עצור הקלטה" : "הקלטה קולית"}>
                  <IconButton 
                    size="small"
                    onClick={handleVoiceToggle}
                    color={isRecording ? 'error' : 'default'}
                  >
                    {isRecording ? <Stop /> : <Mic />}
                  </IconButton>
                </Tooltip>
              )}
              
              <Tooltip title="שלח">
                <IconButton 
                  size="small"
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isLoading}
                  color="primary"
                >
                  <Send />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
        </Box>
      </DialogContent>

      {/* קובץ נסתר להעלאה */}
      <Box
        component="input"
        ref={fileInputRef}
        type="file"
        sx={{ display: 'none' }}
        accept=".pdf,.doc,.docx,.txt"
        onChange={handleFileUpload}
        aria-label="העלה קובץ לניתוח"
        title="העלה קובץ לניתוח"
      />
    </Dialog>
  );
};

export default AIAssistant;

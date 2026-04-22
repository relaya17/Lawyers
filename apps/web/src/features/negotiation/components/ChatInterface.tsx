import React, { useState, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  IconButton,
  Avatar,
  Chip,
  Divider,
  Tooltip,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  Alert,
  LinearProgress,
  Card,
  CardContent,
  Grid
} from '@mui/material'
import {
  Send,
  AttachFile,
  EmojiEmotions,
  MoreVert,
  Reply,
  Edit,
  Delete,
  Flag,
  Download,
  Share,
  ContentCopy,
  ThumbUp,
  ThumbDown,
  Person,
  Description,
  Image,
  VideoFile,
  AudioFile,
  InsertDriveFile,
  Close,
  Cancel,
  Check
} from '@mui/icons-material'

interface ChatMessage {
  id: string
  senderId: string
  senderName: string
  senderAvatar?: string
  content: string
  timestamp: string
  type: 'text' | 'file' | 'image' | 'video' | 'audio'
  fileUrl?: string
  fileName?: string
  fileSize?: number
  replyTo?: string
  reactions: { emoji: string; count: number; users: string[] }[]
  isEdited: boolean
  isDeleted: boolean
}

interface ChatInterfaceProps {
  roomId?: string
  messages?: ChatMessage[]
  onSendMessage?: (message: string, type?: string, file?: File) => void
  onReply?: (messageId: string) => void
  onEdit?: (messageId: string, newContent: string) => void
  onDelete?: (messageId: string) => void
  onReact?: (messageId: string, emoji: string) => void
  loading?: boolean
  error?: string
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({
  roomId,
  messages = [],
  onSendMessage,
  onReply,
  onEdit,
  onDelete,
  onReact,
  loading = false,
  error
}) => {
  const { t } = useTranslation()

  // Local state
  const [messageText, setMessageText] = useState('')
  const [replyToMessage, setReplyToMessage] = useState<ChatMessage | null>(null)
  const [editingMessage, setEditingMessage] = useState<ChatMessage | null>(null)
  const [selectedMessage, setSelectedMessage] = useState<ChatMessage | null>(null)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [showFileUpload, setShowFileUpload] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [messageType, setMessageType] = useState<'text' | 'file'>('text')

  // Refs
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const textAreaRef = useRef<HTMLDivElement>(null)

  // Mock data for demonstration
  const mockMessages: ChatMessage[] = [
    {
      id: '1',
      senderId: 'user1',
      senderName: 'עו"ד דוד כהן',
      content: 'שלום לכולם, בואו נתחיל את המו"מ על חוזה השכירות',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      type: 'text',
      reactions: [],
      isEdited: false,
      isDeleted: false
    },
    {
      id: '2',
      senderId: 'user2',
      senderName: 'בעל הבית',
      content: 'אני מסכים, יש לי כמה נקודות חשובות לדון בהן',
      timestamp: new Date(Date.now() - 3000000).toISOString(),
      type: 'text',
      reactions: [{ emoji: '👍', count: 2, users: ['user1', 'user3'] }],
      isEdited: false,
      isDeleted: false
    },
    {
      id: '3',
      senderId: 'user1',
      senderName: 'עו"ד דוד כהן',
      content: 'הנה טיוטת החוזה הראשונית',
      timestamp: new Date(Date.now() - 2400000).toISOString(),
      type: 'file',
      fileName: 'חוזה_שכירות_טיוטה.pdf',
      fileSize: 245760,
      reactions: [],
      isEdited: false,
      isDeleted: false
    }
  ]

  const displayMessages = messages.length > 0 ? messages : mockMessages

  useEffect(() => {
    scrollToBottom()
  }, [displayMessages])

  useEffect(() => {
    if (editingMessage && textAreaRef.current) {
      textAreaRef.current.focus()
    }
  }, [editingMessage])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleSendMessage = () => {
    if (!messageText.trim() && !selectedFile) return

    if (onSendMessage) {
      if (messageType === 'file' && selectedFile) {
        onSendMessage(selectedFile.name, 'file', selectedFile)
      } else {
        onSendMessage(messageText, 'text')
      }
    }

    setMessageText('')
    setSelectedFile(null)
    setMessageType('text')
    setReplyToMessage(null)
  }

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      handleSendMessage()
    }
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files && files.length > 0) {
      const file = files[0]
      setSelectedFile(file)
      setMessageType('file')
      setMessageText(file.name)
    }
  }

  const handleReply = (message: ChatMessage) => {
    setReplyToMessage(message)
    setAnchorEl(null)
  }

  const handleEdit = (message: ChatMessage) => {
    setEditingMessage(message)
    setMessageText(message.content)
    setAnchorEl(null)
  }

  const handleSaveEdit = () => {
    if (editingMessage && onEdit) {
      onEdit(editingMessage.id, messageText)
    }
    setEditingMessage(null)
    setMessageText('')
  }

  const handleCancelEdit = () => {
    setEditingMessage(null)
    setMessageText('')
  }

  const handleDelete = (message: ChatMessage) => {
    if (onDelete) {
      onDelete(message.id)
    }
    setAnchorEl(null)
  }

  const handleReaction = (messageId: string, emoji: string) => {
    if (onReact) {
      onReact(messageId, emoji)
    }
  }

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('he-IL', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase()
    switch (extension) {
      case 'pdf': return <Description />
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif': return <Image />
      case 'mp4':
      case 'avi':
      case 'mov': return <VideoFile />
      case 'mp3':
      case 'wav': return <AudioFile />
      default: return <InsertDriveFile />
    }
  }

  const getFileColor = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase()
    switch (extension) {
      case 'pdf': return 'error'
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif': return 'success'
      case 'mp4':
      case 'avi':
      case 'mov': return 'warning'
      case 'mp3':
      case 'wav': return 'info'
      default: return 'default'
    }
  }

  if (loading) {
    return (
      <Box sx={{ p: 2 }}>
        <LinearProgress />
        <Typography sx={{ mt: 2 }}>טוען הודעות...</Typography>
      </Box>
    )
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ m: 2 }}>
        שגיאה בטעינת הצ'אט: {error}
      </Alert>
    )
  }

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
        <Typography variant="h6">צ'אט מו"מ</Typography>
        <Typography variant="body2" color="textSecondary">
          {displayMessages.length} הודעות
        </Typography>
      </Box>

      {/* Messages */}
      <Box sx={{ 
        flex: 1, 
        overflow: 'auto', 
        p: 2,
        display: 'flex',
        flexDirection: 'column',
        gap: 1
      }}>
        {displayMessages.map((message) => (
          <Box
            key={message.id}
            sx={{
              display: 'flex',
              justifyContent: message.senderId === 'current-user' ? 'flex-end' : 'flex-start',
              mb: 2
            }}
          >
            <Paper
              sx={{
                p: 2,
                maxWidth: '70%',
                backgroundColor: message.senderId === 'current-user' 
                  ? 'primary.main' 
                  : 'grey.100',
                color: message.senderId === 'current-user' 
                  ? 'primary.contrastText' 
                  : 'text.primary',
                position: 'relative'
              }}
            >
              {/* Reply indicator */}
              {message.replyTo && (
                <Box sx={{ 
                  mb: 1, 
                  p: 1, 
                  backgroundColor: 'rgba(0,0,0,0.1)', 
                  borderRadius: 1,
                  fontSize: '0.875rem'
                }}>
                  <Typography variant="caption" fontWeight="bold">
                    תגובה ל:
                  </Typography>
                  <Typography variant="caption" display="block">
                    {message.replyTo}
                  </Typography>
                </Box>
              )}

              {/* Message header */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <Avatar sx={{ width: 24, height: 24 }}>
                  <Person />
                </Avatar>
                <Typography variant="caption" fontWeight="bold">
                  {message.senderName}
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  {formatTime(message.timestamp)}
                </Typography>
                {message.isEdited && (
                  <Typography variant="caption" color="textSecondary">
                    (עודכן)
                  </Typography>
                )}
              </Box>

              {/* Message content */}
              {message.type === 'file' ? (
                <Card variant="outlined" sx={{ mt: 1 }}>
                  <CardContent sx={{ p: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <IconButton 
                        size="small" 
                        color={getFileColor(message.fileName!)}
                      >
                        {getFileIcon(message.fileName!)}
                      </IconButton>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="body2" fontWeight="bold">
                          {message.fileName}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          {formatFileSize(message.fileSize!)}
                        </Typography>
                      </Box>
                      <IconButton size="small">
                        <Download />
                      </IconButton>
                    </Box>
                  </CardContent>
                </Card>
              ) : (
                <Typography variant="body2">
                  {message.content}
                </Typography>
              )}

              {/* Reactions */}
              {message.reactions.length > 0 && (
                <Box sx={{ display: 'flex', gap: 0.5, mt: 1, flexWrap: 'wrap' }}>
                  {message.reactions.map((reaction, index) => (
                    <Chip
                      key={index}
                      label={`${reaction.emoji} ${reaction.count}`}
                      size="small"
                      variant="outlined"
                      onClick={() => handleReaction(message.id, reaction.emoji)}
                      sx={{ cursor: 'pointer' }}
                    />
                  ))}
                </Box>
              )}

              {/* Message actions */}
              <Box sx={{ 
                position: 'absolute', 
                top: 4, 
                right: 4,
                opacity: 0,
                transition: 'opacity 0.2s',
                '&:hover': { opacity: 1 }
              }}>
                <IconButton
                  size="small"
                  onClick={(e) => {
                    setSelectedMessage(message)
                    setAnchorEl(e.currentTarget)
                  }}
                >
                  <MoreVert />
                </IconButton>
              </Box>
            </Paper>
          </Box>
        ))}
        
        <div ref={messagesEndRef} />
      </Box>

      {/* Reply indicator */}
      {replyToMessage && (
        <Box sx={{ 
          p: 1, 
          backgroundColor: 'grey.100', 
          borderTop: 1, 
          borderColor: 'divider',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <Box>
            <Typography variant="caption" fontWeight="bold">
              תגובה ל: {replyToMessage.senderName}
            </Typography>
            <Typography variant="caption" display="block" color="textSecondary">
              {replyToMessage.content.substring(0, 50)}...
            </Typography>
          </Box>
          <IconButton size="small" onClick={() => setReplyToMessage(null)}>
            <Close />
          </IconButton>
        </Box>
      )}

      {/* Edit indicator */}
      {editingMessage && (
        <Box sx={{ 
          p: 1, 
          backgroundColor: 'warning.light', 
          borderTop: 1, 
          borderColor: 'divider',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <Typography variant="caption" fontWeight="bold">
            עריכת הודעה
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <IconButton size="small" onClick={handleSaveEdit}>
              <Check />
            </IconButton>
            <IconButton size="small" onClick={handleCancelEdit}>
              <Cancel />
            </IconButton>
          </Box>
        </Box>
      )}

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
            placeholder={editingMessage ? "ערוך הודעה..." : "הקלד הודעה..."}
            variant="outlined"
            size="small"
            ref={textAreaRef}
          />
          
          <input
            ref={fileInputRef}
            type="file"
            hidden
            onChange={handleFileSelect}
          />
          
          <Tooltip title="צרף קובץ">
            <IconButton aria-label="צרף קובץ" onClick={() => fileInputRef.current?.click()}>
              <AttachFile />
            </IconButton>
          </Tooltip>
          
          <Tooltip title="אימוג'י">
            <IconButton aria-label="אימוג'י" onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
              <EmojiEmotions />
            </IconButton>
          </Tooltip>
          
          <Button
            variant="contained"
            onClick={handleSendMessage}
            disabled={!messageText.trim() && !selectedFile}
            startIcon={<Send />}
          >
            {editingMessage ? 'עדכן' : 'שלח'}
          </Button>
        </Box>

        {/* File preview */}
        {selectedFile && (
          <Box sx={{ mt: 1, p: 1, backgroundColor: 'grey.50', borderRadius: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <IconButton size="small" color={getFileColor(selectedFile.name)}>
                {getFileIcon(selectedFile.name)}
              </IconButton>
              <Box sx={{ flex: 1 }}>
                <Typography variant="body2" fontWeight="bold">
                  {selectedFile.name}
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  {formatFileSize(selectedFile.size)}
                </Typography>
              </Box>
              <IconButton size="small" onClick={() => setSelectedFile(null)}>
                <Close />
              </IconButton>
            </Box>
          </Box>
        )}
      </Box>

      {/* Message Actions Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
      >
        <MenuItem onClick={() => handleReply(selectedMessage!)}>
          <Reply sx={{ mr: 1 }} />
          תגובה
        </MenuItem>
        <MenuItem onClick={() => handleEdit(selectedMessage!)}>
          <Edit sx={{ mr: 1 }} />
          ערוך
        </MenuItem>
        <MenuItem onClick={() => handleDelete(selectedMessage!)}>
          <Delete sx={{ mr: 1 }} />
          מחק
        </MenuItem>
        <Divider />
        <MenuItem>
          <ThumbUp sx={{ mr: 1 }} />
          👍
        </MenuItem>
        <MenuItem>
          <ThumbDown sx={{ mr: 1 }} />
          👎
        </MenuItem>
        <Divider />
                 <MenuItem>
           <ContentCopy sx={{ mr: 1 }} />
           העתק
         </MenuItem>
        <MenuItem>
          <Share sx={{ mr: 1 }} />
          שתף
        </MenuItem>
        <Divider />
        <MenuItem>
          <Flag sx={{ mr: 1 }} />
          דווח
        </MenuItem>
      </Menu>

      {/* Emoji Picker Dialog */}
      <Dialog open={showEmojiPicker} onClose={() => setShowEmojiPicker(false)}>
        <DialogTitle>בחר אימוג'י</DialogTitle>
        <DialogContent>
          <Grid container spacing={1}>
            {['😀', '😂', '😍', '👍', '👎', '❤️', '🔥', '💯', '🎉', '👏'].map((emoji) => (
              <Grid item key={emoji}>
                <IconButton
                  onClick={() => {
                    setMessageText(prev => prev + emoji)
                    setShowEmojiPicker(false)
                  }}
                >
                  {emoji}
                </IconButton>
              </Grid>
            ))}
          </Grid>
        </DialogContent>
      </Dialog>
    </Box>
  )
}

export default ChatInterface

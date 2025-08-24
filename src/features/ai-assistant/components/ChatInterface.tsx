import React, { useState, useRef, useEffect } from 'react'
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Chip,
  Divider,
  Tooltip,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  Grid,
  Menu,
  MenuItem,
  ListItemIcon
} from '@mui/material'
import {
  Send,
  AttachFile,
  Mic,
  Stop,
  SmartToy,
  Person,
  ContentCopy,
  ThumbUp,
  ThumbDown,
  MoreVert,
  Refresh,
  Delete,
  Edit,
  Download,
  Share,
  EmojiEmotions,
  Code,
  Image,
  VideoFile,
  AudioFile,
  Description
} from '@mui/icons-material'
import { useTranslation } from 'react-i18next'

interface Message {
  id: string
  content: string
  sender: 'user' | 'ai'
  timestamp: Date
  type: 'text' | 'code' | 'image' | 'file'
  attachments?: Array<{
    name: string
    type: string
    url: string
    size: number
  }>
  codeLanguage?: string
  isTyping?: boolean
  reactions?: {
    thumbsUp: number
    thumbsDown: number
  }
  metadata?: {
    model?: string
    tokens?: number
    processingTime?: number
  }
}

interface ChatInterfaceProps {
  messages: Message[]
  onSendMessage: (content: string, attachments?: File[]) => void
  onReact: (messageId: string, reaction: 'thumbsUp' | 'thumbsDown') => void
  onCopy: (messageId: string) => void
  onEdit: (messageId: string, newContent: string) => void
  onDelete: (messageId: string) => void
  onDownload: (messageId: string) => void
  onShare: (messageId: string) => void
  isTyping: boolean
  isRecording: boolean
  onStartRecording: () => void
  onStopRecording: () => void
  onFileUpload: (files: File[]) => void
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({
  messages,
  onSendMessage,
  onReact,
  onCopy,
  onEdit,
  onDelete,
  onDownload,
  onShare,
  isTyping,
  isRecording,
  onStartRecording,
  onStopRecording,
  onFileUpload
}) => {
  const { t } = useTranslation()
  const [inputValue, setInputValue] = useState('')
  const [isEditing, setIsEditing] = useState<string | null>(null)
  const [editValue, setEditValue] = useState('')
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [selectedMessage, setSelectedMessage] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = () => {
    if (inputValue.trim()) {
      onSendMessage(inputValue.trim())
      setInputValue('')
    }
  }

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      handleSend()
    }
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    if (files.length > 0) {
      onFileUpload(files)
    }
  }

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, messageId: string) => {
    setAnchorEl(event.currentTarget)
    setSelectedMessage(messageId)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
    setSelectedMessage(null)
  }

  const handleMenuAction = (action: string) => {
    if (!selectedMessage) return

    switch (action) {
      case 'copy':
        onCopy(selectedMessage)
        break
      case 'edit': {
        const message = messages.find(m => m.id === selectedMessage)
        if (message) {
          setIsEditing(selectedMessage)
          setEditValue(message.content)
        }
        break
      }
      case 'delete':
        onDelete(selectedMessage)
        break
      case 'download':
        onDownload(selectedMessage)
        break
      case 'share':
        onShare(selectedMessage)
        break
    }
    handleMenuClose()
  }

  const handleEditSave = () => {
    if (isEditing && editValue.trim()) {
      onEdit(isEditing, editValue.trim())
      setIsEditing(null)
      setEditValue('')
    }
  }

  const handleEditCancel = () => {
    setIsEditing(null)
    setEditValue('')
  }

  const formatTimestamp = (date: Date) => {
    return date.toLocaleTimeString('he-IL', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return <Image />
    if (type.startsWith('video/')) return <VideoFile />
    if (type.startsWith('audio/')) return <AudioFile />
    if (type.includes('pdf')) return <Description />
    return <Description />
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const renderMessage = (message: Message) => {
    const isUser = message.sender === 'user'
    const isEditingThis = isEditing === message.id

    return (
      <ListItem
        key={message.id}
        sx={{
          flexDirection: 'column',
          alignItems: isUser ? 'flex-end' : 'flex-start',
          mb: 2
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, maxWidth: '70%' }}>
          {!isUser && (
            <Avatar sx={{ bgcolor: 'primary.main', width: 32, height: 32 }}>
              <SmartToy />
            </Avatar>
          )}
          
          <Paper
            elevation={1}
            sx={{
              p: 2,
              bgcolor: isUser ? 'primary.main' : 'background.paper',
              color: isUser ? 'primary.contrastText' : 'text.primary',
              borderRadius: 2,
              position: 'relative',
              minWidth: 200
            }}
          >
            {isEditingThis ? (
              <Box>
                <TextField
                  fullWidth
                  multiline
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  variant="outlined"
                  size="small"
                  sx={{ mb: 1 }}
                />
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button size="small" onClick={handleEditSave}>
                    {t('common.save')}
                  </Button>
                  <Button size="small" onClick={handleEditCancel}>
                    {t('common.cancel')}
                  </Button>
                </Box>
              </Box>
            ) : (
              <>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                  <Typography variant="caption" color={isUser ? 'primary.contrastText' : 'text.secondary'}>
                    {formatTimestamp(message.timestamp)}
                  </Typography>
                  <IconButton
                    size="small"
                    onClick={(e) => handleMenuOpen(e, message.id)}
                    sx={{ color: isUser ? 'primary.contrastText' : 'text.secondary' }}
                  >
                    <MoreVert fontSize="small" />
                  </IconButton>
                </Box>

                {message.type === 'code' ? (
                  <Card variant="outlined" sx={{ bgcolor: 'grey.100', mb: 1 }}>
                    <CardContent sx={{ py: 1, '&:last-child': { pb: 1 } }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <Chip
                          icon={<Code />}
                          label={message.codeLanguage || 'code'}
                          size="small"
                          variant="outlined"
                        />
                        <IconButton size="small" onClick={() => onCopy(message.id)}>
                          <ContentCopy fontSize="small" />
                        </IconButton>
                      </Box>
                      <Typography
                        component="pre"
                        variant="body2"
                        sx={{
                          fontFamily: 'monospace',
                          whiteSpace: 'pre-wrap',
                          wordBreak: 'break-word',
                          m: 0
                        }}
                      >
                        {message.content}
                      </Typography>
                    </CardContent>
                  </Card>
                ) : (
                  <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                    {message.content}
                  </Typography>
                )}

                {message.attachments && message.attachments.length > 0 && (
                  <Box sx={{ mt: 1 }}>
                    {message.attachments.map((attachment, index) => (
                      <Card key={index} variant="outlined" sx={{ mb: 1 }}>
                        <CardContent sx={{ py: 1, '&:last-child': { pb: 1 } }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            {getFileIcon(attachment.type)}
                            <Box sx={{ flexGrow: 1 }}>
                              <Typography variant="body2" noWrap>
                                {attachment.name}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {formatFileSize(attachment.size)}
                              </Typography>
                            </Box>
                            <IconButton size="small" onClick={() => window.open(attachment.url)}>
                              <Download fontSize="small" />
                            </IconButton>
                          </Box>
                        </CardContent>
                      </Card>
                    ))}
                  </Box>
                )}

                {message.metadata && (
                  <Box sx={{ mt: 1, pt: 1, borderTop: 1, borderColor: 'divider' }}>
                    <Typography variant="caption" color={isUser ? 'primary.contrastText' : 'text.secondary'}>
                      {message.metadata.model && `${t('ai.model')}: ${message.metadata.model}`}
                      {message.metadata.tokens && ` | ${t('ai.tokens')}: ${message.metadata.tokens}`}
                      {message.metadata.processingTime && ` | ${t('ai.processingTime')}: ${message.metadata.processingTime}ms`}
                    </Typography>
                  </Box>
                )}

                <Box sx={{ display: 'flex', gap: 0.5, mt: 1 }}>
                  <Tooltip title={t('ai.thumbsUp')}>
                    <IconButton
                      size="small"
                      onClick={() => onReact(message.id, 'thumbsUp')}
                      sx={{ color: isUser ? 'primary.contrastText' : 'text.secondary' }}
                    >
                      <ThumbUp fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title={t('ai.thumbsDown')}>
                    <IconButton
                      size="small"
                      onClick={() => onReact(message.id, 'thumbsDown')}
                      sx={{ color: isUser ? 'primary.contrastText' : 'text.secondary' }}
                    >
                      <ThumbDown fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title={t('common.copy')}>
                    <IconButton
                      size="small"
                      onClick={() => onCopy(message.id)}
                      sx={{ color: isUser ? 'primary.contrastText' : 'text.secondary' }}
                    >
                      <ContentCopy fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>
              </>
            )}
          </Paper>

          {isUser && (
            <Avatar sx={{ bgcolor: 'secondary.main', width: 32, height: 32 }}>
              <Person />
            </Avatar>
          )}
        </Box>
      </ListItem>
    )
  }

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Messages Area */}
      <Box sx={{ flexGrow: 1, overflow: 'auto', p: 2 }}>
        <List sx={{ p: 0 }}>
          {messages.map(renderMessage)}
          {isTyping && (
            <ListItem sx={{ justifyContent: 'flex-start' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Avatar sx={{ bgcolor: 'primary.main', width: 32, height: 32 }}>
                  <SmartToy />
                </Avatar>
                <Paper elevation={1} sx={{ p: 2, borderRadius: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CircularProgress size={16} />
                    <Typography variant="body2" color="text.secondary">
                      {t('ai.typing')}
                    </Typography>
                  </Box>
                </Paper>
              </Box>
            </ListItem>
          )}
        </List>
        <div ref={messagesEndRef} />
      </Box>

      {/* Input Area */}
      <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-end' }}>
          <TextField
            fullWidth
            multiline
            maxRows={4}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={t('ai.typeMessage')}
            variant="outlined"
            size="small"
            InputProps={{
              endAdornment: (
                <Box sx={{ display: 'flex', gap: 0.5 }}>
                  <Tooltip title={t('ai.attachFile')}>
                    <IconButton
                      size="small"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <AttachFile />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title={t('ai.emoji')}>
                    <IconButton size="small">
                      <EmojiEmotions />
                    </IconButton>
                  </Tooltip>
                </Box>
              )
            }}
          />
          <input
            ref={fileInputRef}
            type="file"
            multiple
            hidden
            onChange={handleFileUpload}
          />
          
          {isRecording ? (
            <Button
              variant="contained"
              color="error"
              onClick={onStopRecording}
              startIcon={<Stop />}
            >
              {t('ai.stopRecording')}
            </Button>
          ) : (
            <Button
              variant="contained"
              onClick={onStartRecording}
              startIcon={<Mic />}
            >
              {t('ai.record')}
            </Button>
          )}
          
          <Button
            variant="contained"
            onClick={handleSend}
            disabled={!inputValue.trim()}
            startIcon={<Send />}
          >
            {t('common.send')}
          </Button>
        </Box>
      </Box>

      {/* Context Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => handleMenuAction('copy')}>
          <ListItemIcon>
            <ContentCopy fontSize="small" />
          </ListItemIcon>
          <ListItemText>{t('common.copy')}</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleMenuAction('edit')}>
          <ListItemIcon>
            <Edit fontSize="small" />
          </ListItemIcon>
          <ListItemText>{t('common.edit')}</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleMenuAction('download')}>
          <ListItemIcon>
            <Download fontSize="small" />
          </ListItemIcon>
          <ListItemText>{t('common.download')}</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleMenuAction('share')}>
          <ListItemIcon>
            <Share fontSize="small" />
          </ListItemIcon>
          <ListItemText>{t('common.share')}</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleMenuAction('delete')}>
          <ListItemIcon>
            <Delete fontSize="small" />
          </ListItemIcon>
          <ListItemText>{t('common.delete')}</ListItemText>
        </MenuItem>
      </Menu>
    </Box>
  )
}

export default ChatInterface

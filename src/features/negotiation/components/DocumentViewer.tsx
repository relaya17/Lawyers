import React, { useState, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Box,
  Paper,
  Typography,
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
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  LinearProgress,
  Card,
  CardContent,
  CardHeader,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  Switch,
  FormControlLabel,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Tabs,
  Tab,
  Badge,
  Slider
} from '@mui/material'
import {
  ZoomIn,
  ZoomOut,
  Fullscreen,
  FullscreenExit,
  RotateLeft,
  RotateRight,
  Download,
  Share,
  Print,
  Edit,
  Delete,
  Comment,
  Visibility,
  VisibilityOff,
  Lock,
  LockOpen,
  Star,
  StarBorder,
  Bookmark,
  BookmarkBorder,
  MoreVert,
  ExpandMore,
  Description,
  Image,
  VideoFile,
  AudioFile,
  InsertDriveFile,
  PictureAsPdf,
  Close,
  Save,
  Cancel,
  Check,
  Warning,
  Info,
  Error,
  Search,
  FilterList,
  Sort,
  ViewList,
  ViewModule,
  Refresh
} from '@mui/icons-material'

interface DocumentComment {
  id: string
  userId: string
  userName: string
  content: string
  timestamp: string
  position?: { x: number; y: number; page: number }
  resolved: boolean
}

interface DocumentVersion {
  id: string
  version: string
  timestamp: string
  uploadedBy: string
  changes: string
  fileSize: number
}

interface NegotiationDocument {
  id: string
  name: string
  type: 'pdf' | 'doc' | 'docx' | 'image' | 'video' | 'audio' | 'other'
  url: string
  fileSize: number
  uploadedBy: string
  uploadedAt: string
  version: string
  status: 'draft' | 'review' | 'approved' | 'rejected'
  tags: string[]
  comments: DocumentComment[]
  versions: DocumentVersion[]
  isPublic: boolean
  isLocked: boolean
  isStarred: boolean
  isBookmarked: boolean
  permissions: {
    view: boolean
    edit: boolean
    comment: boolean
    download: boolean
    share: boolean
  }
}

interface DocumentViewerProps {
  document?: NegotiationDocument
  documents?: NegotiationDocument[]
  onDocumentSelect?: (documentId: string) => void
  onDocumentUpload?: (file: File) => void
  onDocumentEdit?: (documentId: string, updates: Partial<NegotiationDocument>) => void
  onDocumentDelete?: (documentId: string) => void
  onCommentAdd?: (documentId: string, comment: Omit<DocumentComment, 'id' | 'timestamp'>) => void
  onCommentResolve?: (documentId: string, commentId: string) => void
  loading?: boolean
  error?: string
}

const DocumentViewer: React.FC<DocumentViewerProps> = ({
  document,
  documents = [],
  onDocumentSelect,
  onDocumentUpload,
  onDocumentEdit,
  onDocumentDelete,
  onCommentAdd,
  onCommentResolve,
  loading = false,
  error
}) => {
  const { t } = useTranslation()

  // Local state
  const [selectedDocument, setSelectedDocument] = useState<NegotiationDocument | null>(document || null)
  const [activeTab, setActiveTab] = useState(0)
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list')
  const [zoom, setZoom] = useState(100)
  const [rotation, setRotation] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showComments, setShowComments] = useState(true)
  const [showUploadDialog, setShowUploadDialog] = useState(false)
  const [showCommentDialog, setShowCommentDialog] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [commentText, setCommentText] = useState('')
  const [selectedComment, setSelectedComment] = useState<DocumentComment | null>(null)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')

  // Refs
  const fileInputRef = useRef<HTMLInputElement>(null)
  const viewerRef = useRef<HTMLDivElement>(null)

  // Mock data for demonstration
  const mockDocuments: NegotiationDocument[] = [
    {
      id: '1',
      name: 'חוזה_שכירות_טיוטה.pdf',
      type: 'pdf',
      url: '/documents/contract-draft.pdf',
      fileSize: 245760,
      uploadedBy: 'עו"ד דוד כהן',
      uploadedAt: new Date(Date.now() - 86400000).toISOString(),
      version: '1.0',
      status: 'review',
      tags: ['חוזה', 'שכירות', 'טיוטה'],
      comments: [
        {
          id: '1',
          userId: 'user1',
          userName: 'בעל הבית',
          content: 'צריך להוסיף סעיף על תחזוקה',
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          position: { x: 100, y: 200, page: 1 },
          resolved: false
        }
      ],
      versions: [
        {
          id: '1',
          version: '1.0',
          timestamp: new Date(Date.now() - 86400000).toISOString(),
          uploadedBy: 'עו"ד דוד כהן',
          changes: 'גרסה ראשונית',
          fileSize: 245760
        }
      ],
      isPublic: true,
      isLocked: false,
      isStarred: false,
      isBookmarked: false,
      permissions: {
        view: true,
        edit: true,
        comment: true,
        download: true,
        share: true
      }
    },
    {
      id: '2',
      name: 'תנאים_כלליים.docx',
      type: 'docx',
      url: '/documents/terms.docx',
      fileSize: 156789,
      uploadedBy: 'בעל הבית',
      uploadedAt: new Date(Date.now() - 172800000).toISOString(),
      version: '2.1',
      status: 'approved',
      tags: ['תנאים', 'כללי'],
      comments: [],
      versions: [],
      isPublic: true,
      isLocked: false,
      isStarred: true,
      isBookmarked: false,
      permissions: {
        view: true,
        edit: false,
        comment: true,
        download: true,
        share: true
      }
    }
  ]

  const displayDocuments = documents.length > 0 ? documents : mockDocuments

  useEffect(() => {
    if (document) {
      setSelectedDocument(document)
    }
  }, [document])

  const handleDocumentSelect = (doc: NegotiationDocument) => {
    setSelectedDocument(doc)
    if (onDocumentSelect) {
      onDocumentSelect(doc.id)
    }
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files && files.length > 0) {
      setSelectedFile(files[0])
    }
  }

  const handleUpload = () => {
    if (selectedFile && onDocumentUpload) {
      onDocumentUpload(selectedFile)
      setSelectedFile(null)
      setShowUploadDialog(false)
    }
  }

  const handleAddComment = () => {
    if (commentText.trim() && selectedDocument && onCommentAdd) {
             onCommentAdd(selectedDocument.id, {
         userId: 'current-user',
         userName: 'משתמש נוכחי',
         content: commentText,
         resolved: false
       })
      setCommentText('')
      setShowCommentDialog(false)
    }
  }

  const handleResolveComment = (commentId: string) => {
    if (selectedDocument && onCommentResolve) {
      onCommentResolve(selectedDocument.id, commentId)
    }
  }

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 25, 200))
  }

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 25, 25))
  }

  const handleRotate = (direction: 'left' | 'right') => {
    setRotation(prev => direction === 'left' ? prev - 90 : prev + 90)
  }

  const toggleFullscreen = () => {
    if (viewerRef.current) {
      if (!isFullscreen) {
        viewerRef.current.requestFullscreen()
      } else {
        (document as any).exitFullscreen()
      }
      setIsFullscreen(!isFullscreen)
    }
  }

  const getDocumentIcon = (type: string) => {
    switch (type) {
      case 'pdf': return <PictureAsPdf />
      case 'doc':
      case 'docx': return <Description />
      case 'image': return <Image />
      case 'video': return <VideoFile />
      case 'audio': return <AudioFile />
      default: return <InsertDriveFile />
    }
  }

  const getDocumentColor = (type: string) => {
    switch (type) {
      case 'pdf': return 'error'
      case 'doc':
      case 'docx': return 'primary'
      case 'image': return 'success'
      case 'video': return 'warning'
      case 'audio': return 'info'
      default: return 'default'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'success'
      case 'review': return 'warning'
      case 'rejected': return 'error'
      case 'draft': return 'default'
      default: return 'default'
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const filteredDocuments = displayDocuments.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         doc.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesStatus = filterStatus === 'all' || doc.status === filterStatus
    return matchesSearch && matchesStatus
  })

  if (loading) {
    return (
      <Box sx={{ p: 2 }}>
        <LinearProgress />
        <Typography sx={{ mt: 2 }}>טוען מסמכים...</Typography>
      </Box>
    )
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ m: 2 }}>
        שגיאה בטעינת המסמכים: {error}
      </Alert>
    )
  }

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">צפייה במסמכים</Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant="outlined"
              startIcon={<ViewList />}
              onClick={() => setViewMode('list')}
              color={viewMode === 'list' ? 'primary' : 'inherit'}
            >
              רשימה
            </Button>
            <Button
              variant="outlined"
              startIcon={<ViewModule />}
              onClick={() => setViewMode('grid')}
              color={viewMode === 'grid' ? 'primary' : 'inherit'}
            >
              רשת
            </Button>
            <Button
              variant="contained"
              onClick={() => setShowUploadDialog(true)}
            >
              העלה מסמך
            </Button>
          </Box>
        </Box>

        {/* Search and Filters */}
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <TextField
            size="small"
            placeholder="חיפוש מסמכים..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />
            }}
            sx={{ flex: 1 }}
          />
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>סטטוס</InputLabel>
            <Select
              value={filterStatus}
              label="סטטוס"
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <MenuItem value="all">הכל</MenuItem>
              <MenuItem value="draft">טיוטה</MenuItem>
              <MenuItem value="review">בבדיקה</MenuItem>
              <MenuItem value="approved">אושר</MenuItem>
              <MenuItem value="rejected">נדחה</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>

      {/* Content */}
      <Box sx={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* Document List */}
        <Box sx={{ width: 300, borderRight: 1, borderColor: 'divider', overflow: 'auto' }}>
          {viewMode === 'list' ? (
            <List dense>
              {filteredDocuments.map((doc) => (
                <ListItem
                  key={doc.id}
                  button
                  selected={selectedDocument?.id === doc.id}
                  onClick={() => handleDocumentSelect(doc)}
                >
                  <ListItemAvatar>
                    <Badge
                      color={doc.isStarred ? 'warning' : 'default'}
                      badgeContent={doc.isStarred ? <Star sx={{ fontSize: 12 }} /> : null}
                    >
                      <Avatar color={getDocumentColor(doc.type) as any}>
                        {getDocumentIcon(doc.type)}
                      </Avatar>
                    </Badge>
                  </ListItemAvatar>
                  <ListItemText
                    primary={doc.name}
                    secondary={
                      <Box>
                        <Typography variant="caption" display="block">
                          {doc.uploadedBy} • {formatFileSize(doc.fileSize)}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 0.5, mt: 0.5 }}>
                          <Chip
                            label={doc.status}
                            size="small"
                            color={getStatusColor(doc.status) as any}
                          />
                          {doc.isLocked && <Lock sx={{ fontSize: 12 }} />}
                        </Box>
                      </Box>
                    }
                  />
                </ListItem>
              ))}
            </List>
          ) : (
            <Grid container spacing={1} sx={{ p: 1 }}>
              {filteredDocuments.map((doc) => (
                <Grid item xs={6} key={doc.id}>
                  <Card
                    sx={{
                      cursor: 'pointer',
                      border: selectedDocument?.id === doc.id ? 2 : 1,
                      borderColor: selectedDocument?.id === doc.id ? 'primary.main' : 'divider'
                    }}
                    onClick={() => handleDocumentSelect(doc)}
                  >
                    <CardContent sx={{ p: 1, textAlign: 'center' }}>
                      <Avatar
                        sx={{ width: 40, height: 40, mx: 'auto', mb: 1 }}
                        color={getDocumentColor(doc.type) as any}
                      >
                        {getDocumentIcon(doc.type)}
                      </Avatar>
                      <Typography variant="caption" display="block" noWrap>
                        {doc.name}
                      </Typography>
                      <Chip
                        label={doc.status}
                        size="small"
                        color={getStatusColor(doc.status) as any}
                        sx={{ mt: 0.5 }}
                      />
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Box>

        {/* Document Viewer */}
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          {selectedDocument ? (
            <>
              {/* Viewer Header */}
              <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <Typography variant="h6">{selectedDocument.name}</Typography>
                    <Typography variant="body2" color="textSecondary">
                      גרסה {selectedDocument.version} • {selectedDocument.uploadedBy}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Tooltip title="הגדל">
                      <IconButton onClick={handleZoomIn}>
                        <ZoomIn />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="הקטן">
                      <IconButton onClick={handleZoomOut}>
                        <ZoomOut />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="סובב שמאלה">
                      <IconButton onClick={() => handleRotate('left')}>
                        <RotateLeft />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="סובב ימינה">
                      <IconButton onClick={() => handleRotate('right')}>
                        <RotateRight />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="מסך מלא">
                      <IconButton onClick={toggleFullscreen}>
                        {isFullscreen ? <FullscreenExit /> : <Fullscreen />}
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="הוסף הערה">
                      <IconButton onClick={() => setShowCommentDialog(true)}>
                        <Comment />
                      </IconButton>
                    </Tooltip>
                    <IconButton
                      onClick={(e) => setAnchorEl(e.currentTarget)}
                    >
                      <MoreVert />
                    </IconButton>
                  </Box>
                </Box>
              </Box>

              {/* Viewer Content */}
              <Box sx={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
                {/* Document Display */}
                <Box 
                  ref={viewerRef}
                  sx={{ 
                    flex: 1, 
                    p: 2, 
                    overflow: 'auto',
                    backgroundColor: 'grey.100',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Paper
                    sx={{
                      width: '100%',
                      height: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transform: `scale(${zoom / 100}) rotate(${rotation}deg)`,
                      transition: 'transform 0.3s ease'
                    }}
                  >
                    <Box sx={{ textAlign: 'center' }}>
                      <Avatar
                        sx={{ width: 80, height: 80, mx: 'auto', mb: 2 }}
                        color={getDocumentColor(selectedDocument.type) as any}
                      >
                        {getDocumentIcon(selectedDocument.type)}
                      </Avatar>
                      <Typography variant="h6" gutterBottom>
                        {selectedDocument.name}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        כאן יוצג תוכן המסמך
                      </Typography>
                      <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                        זום: {zoom}% • סיבוב: {rotation}°
                      </Typography>
                    </Box>
                  </Paper>
                </Box>

                {/* Comments Panel */}
                {showComments && (
                  <Box sx={{ width: 300, borderLeft: 1, borderColor: 'divider', overflow: 'auto' }}>
                    <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
                      <Typography variant="h6">הערות ({selectedDocument.comments.length})</Typography>
                    </Box>
                    <List dense>
                      {selectedDocument.comments.map((comment) => (
                        <ListItem key={comment.id}>
                          <ListItemText
                            primary={comment.userName}
                            secondary={
                              <Box>
                                <Typography variant="body2">
                                  {comment.content}
                                </Typography>
                                <Typography variant="caption" color="textSecondary">
                                  {new Date(comment.timestamp).toLocaleString('he-IL')}
                                </Typography>
                              </Box>
                            }
                          />
                          <IconButton
                            size="small"
                            onClick={() => handleResolveComment(comment.id)}
                            color={comment.resolved ? 'success' : 'default'}
                          >
                            <Check />
                          </IconButton>
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                )}
              </Box>
            </>
          ) : (
            <Box sx={{ 
              flex: 1, 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              flexDirection: 'column'
            }}>
              <Description sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" color="textSecondary" gutterBottom>
                בחר מסמך לצפייה
              </Typography>
              <Typography variant="body2" color="textSecondary">
                בחר מסמך מהרשימה כדי לצפות בתוכנו
              </Typography>
            </Box>
          )}
        </Box>
      </Box>

      {/* Document Actions Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
      >
        <MenuItem>
          <Download sx={{ mr: 1 }} />
          הורד
        </MenuItem>
        <MenuItem>
          <Share sx={{ mr: 1 }} />
          שתף
        </MenuItem>
        <MenuItem>
          <Print sx={{ mr: 1 }} />
          הדפס
        </MenuItem>
        <Divider />
        <MenuItem>
          <Edit sx={{ mr: 1 }} />
          ערוך
        </MenuItem>
        <MenuItem>
          <Delete sx={{ mr: 1 }} />
          מחק
        </MenuItem>
        <Divider />
        <MenuItem>
          <Star sx={{ mr: 1 }} />
          סמן כמועדף
        </MenuItem>
        <MenuItem>
          <Bookmark sx={{ mr: 1 }} />
          שמור
        </MenuItem>
      </Menu>

      {/* Upload Dialog */}
      <Dialog open={showUploadDialog} onClose={() => setShowUploadDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>העלה מסמך חדש</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <input
              ref={fileInputRef}
              type="file"
              hidden
              onChange={handleFileSelect}
            />
            <Button
              variant="outlined"
              onClick={() => fileInputRef.current?.click()}
              fullWidth
              sx={{ mb: 2 }}
            >
              בחר קובץ
            </Button>
            {selectedFile && (
              <Box sx={{ p: 2, backgroundColor: 'grey.50', borderRadius: 1 }}>
                <Typography variant="body2" fontWeight="bold">
                  {selectedFile.name}
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  {formatFileSize(selectedFile.size)}
                </Typography>
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowUploadDialog(false)}>ביטול</Button>
          <Button 
            variant="contained" 
            onClick={handleUpload}
            disabled={!selectedFile}
          >
            העלה
          </Button>
        </DialogActions>
      </Dialog>

      {/* Comment Dialog */}
      <Dialog open={showCommentDialog} onClose={() => setShowCommentDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>הוסף הערה</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            multiline
            rows={4}
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="הקלד את ההערה שלך..."
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowCommentDialog(false)}>ביטול</Button>
          <Button 
            variant="contained" 
            onClick={handleAddComment}
            disabled={!commentText.trim()}
          >
            הוסף
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default DocumentViewer

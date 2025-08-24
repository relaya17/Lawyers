// Document Viewer Component
// רכיב צפייה במסמכים

import React, { useState, useRef, useEffect } from 'react'
import {
  Box,
  Paper,
  Typography,
  IconButton,
  Toolbar,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Tabs,
  Tab,
  useTheme,
  TextField,
} from '@mui/material'
import {
  ZoomIn,
  ZoomOut,
  RotateLeft,
  RotateRight,
  Download,
  Print,
  Fullscreen,
  FullscreenExit,
} from '@mui/icons-material'
import {
  ChevronLeft,
  ChevronRight,
  FirstPage,
  LastPage,
  Search,
  Edit,
  Comment,
  Share,
  MoreVert,
} from '@mui/icons-material'
import { useTranslation } from 'react-i18next'

interface DocumentViewerProps {
  document: {
    id: string
    name: string
    type: 'pdf' | 'doc' | 'docx' | 'txt' | 'html'
    url: string
    content?: string
    pages?: number
  }
  onEdit?: (documentId: string) => void
  onComment?: (documentId: string, comment: string) => void
  onShare?: (documentId: string) => void
  readOnly?: boolean
}

interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`document-tabpanel-${index}`}
      aria-labelledby={`document-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  )
}

export const DocumentViewer: React.FC<DocumentViewerProps> = ({
  document,
  onEdit,
  onComment,
  onShare,
  readOnly = false,
}) => {
  const { t } = useTranslation()
  const theme = useTheme()
  const [currentPage, setCurrentPage] = useState(1)
  const [zoom, setZoom] = useState(100)
  const [rotation, setRotation] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [tabValue, setTabValue] = useState(0)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<number[]>([])
  const [currentSearchIndex, setCurrentSearchIndex] = useState(0)
  const [showSearchDialog, setShowSearchDialog] = useState(false)

  const containerRef = useRef<HTMLDivElement>(null)
  const documentRef = useRef<HTMLDivElement>(null)

  const totalPages = document.pages || 1

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 25, 300))
  }

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 25, 25))
  }

  const handleRotateLeft = () => {
    setRotation(prev => prev - 90)
  }

  const handleRotateRight = () => {
    setRotation(prev => prev + 90)
  }

  const handleFirstPage = () => {
    setCurrentPage(1)
  }

  const handleLastPage = () => {
    setCurrentPage(totalPages)
  }

  const handlePrevPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1))
  }

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages))
  }

  const handleFullscreen = () => {
    if (!(document as any).fullscreenElement) {
      containerRef.current?.requestFullscreen()
      setIsFullscreen(true)
    } else {
      (document as any).exitFullscreen()
      setIsFullscreen(false)
    }
  }

  const handleSearch = () => {
    if (!searchQuery.trim()) return

    // Mock search functionality
    const mockResults = Array.from({ length: Math.floor(Math.random() * 10) + 1 }, (_, i) => i + 1)
    setSearchResults(mockResults)
    setCurrentSearchIndex(0)
    
    if (mockResults.length > 0) {
      setCurrentPage(mockResults[0])
    }
  }

  const handleNextSearch = () => {
    if (searchResults.length === 0) return
    
    const nextIndex = (currentSearchIndex + 1) % searchResults.length
    setCurrentSearchIndex(nextIndex)
    setCurrentPage(searchResults[nextIndex])
  }

  const handlePrevSearch = () => {
    if (searchResults.length === 0) return
    
    const prevIndex = currentSearchIndex === 0 ? searchResults.length - 1 : currentSearchIndex - 1
    setCurrentSearchIndex(prevIndex)
    setCurrentPage(searchResults[prevIndex])
  }

  const renderDocumentContent = () => {
    switch (document.type) {
      case 'pdf':
        return (
          <Box
            sx={{
              width: '100%',
              height: '600px',
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: theme.shape.borderRadius,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: theme.palette.grey[100],
            }}
          >
            <Typography variant="h6" color="textSecondary">
              PDF Viewer - {document.name}
            </Typography>
          </Box>
        )

      case 'doc':
      case 'docx':
        return (
          <Box
            sx={{
              width: '100%',
              minHeight: '600px',
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: theme.shape.borderRadius,
              padding: 2,
              backgroundColor: theme.palette.background.paper,
            }}
          >
            <Typography variant="h6" gutterBottom>
              {document.name}
            </Typography>
            <Typography variant="body1" paragraph>
              {document.content || 'תוכן המסמך יוצג כאן...'}
            </Typography>
          </Box>
        )

      case 'txt':
        return (
          <Box
            component="pre"
            sx={{
              width: '100%',
              minHeight: '600px',
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: theme.shape.borderRadius,
              padding: 2,
              backgroundColor: theme.palette.background.paper,
              fontFamily: 'monospace',
              fontSize: '14px',
              overflow: 'auto',
              whiteSpace: 'pre-wrap',
              wordWrap: 'break-word',
            }}
          >
            {document.content || 'תוכן המסמך יוצג כאן...'}
          </Box>
        )

      case 'html':
        return (
          <Box
            sx={{
              width: '100%',
              minHeight: '600px',
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: theme.shape.borderRadius,
              overflow: 'auto',
            }}
            dangerouslySetInnerHTML={{
              __html: document.content || '<p>תוכן המסמך יוצג כאן...</p>'
            }}
          />
        )

      default:
        return (
          <Box
            sx={{
              width: '100%',
              height: '600px',
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: theme.shape.borderRadius,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: theme.palette.grey[100],
            }}
          >
            <Typography variant="h6" color="textSecondary">
              {t('documentViewer.unsupportedFormat')}
            </Typography>
          </Box>
        )
    }
  }

  return (
    <Paper
      ref={containerRef}
      elevation={3}
      sx={{
        width: '100%',
        height: isFullscreen ? '100vh' : 'auto',
        overflow: 'hidden',
      }}
    >
      {/* Toolbar */}
      <Toolbar sx={{ borderBottom: `1px solid ${theme.palette.divider}` }}>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          {document.name}
        </Typography>

        <Box sx={{ display: 'flex', gap: 1 }}>
          <Tooltip title={t('documentViewer.search')}>
            <IconButton onClick={() => setShowSearchDialog(true)}>
              <Search />
            </IconButton>
          </Tooltip>

          {!readOnly && (
            <Tooltip title={t('documentViewer.edit')}>
              <IconButton onClick={() => onEdit?.(document.id)}>
                <Edit />
              </IconButton>
            </Tooltip>
          )}

          <Tooltip title={t('documentViewer.comment')}>
            <IconButton onClick={() => onComment?.(document.id, '')}>
              <Comment />
            </IconButton>
          </Tooltip>

          <Tooltip title={t('documentViewer.share')}>
            <IconButton onClick={() => onShare?.(document.id)}>
              <Share />
            </IconButton>
          </Tooltip>

          <Tooltip title={t('documentViewer.download')}>
            <IconButton>
              <Download />
            </IconButton>
          </Tooltip>

          <Tooltip title={t('documentViewer.print')}>
            <IconButton>
              <Print />
            </IconButton>
          </Tooltip>

          <Tooltip title={isFullscreen ? t('documentViewer.exitFullscreen') : t('documentViewer.fullscreen')}>
            <IconButton onClick={handleFullscreen}>
              {isFullscreen ? <FullscreenExit /> : <Fullscreen />}
            </IconButton>
          </Tooltip>
        </Box>
      </Toolbar>

      {/* Navigation Toolbar */}
      <Toolbar variant="dense" sx={{ borderBottom: `1px solid ${theme.palette.divider}` }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexGrow: 1 }}>
          <Tooltip title={t('documentViewer.firstPage')}>
            <IconButton onClick={handleFirstPage} disabled={currentPage === 1}>
              <FirstPage />
            </IconButton>
          </Tooltip>

          <Tooltip title={t('documentViewer.previousPage')}>
            <IconButton onClick={handlePrevPage} disabled={currentPage === 1}>
              <ChevronLeft />
            </IconButton>
          </Tooltip>

          <Typography variant="body2" sx={{ mx: 2 }}>
            {t('documentViewer.pageInfo', { current: currentPage, total: totalPages })}
          </Typography>

          <Tooltip title={t('documentViewer.nextPage')}>
            <IconButton onClick={handleNextPage} disabled={currentPage === totalPages}>
              <ChevronRight />
            </IconButton>
          </Tooltip>

          <Tooltip title={t('documentViewer.lastPage')}>
            <IconButton onClick={handleLastPage} disabled={currentPage === totalPages}>
              <LastPage />
            </IconButton>
          </Tooltip>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Tooltip title={t('documentViewer.zoomOut')}>
            <IconButton onClick={handleZoomOut}>
              <ZoomOut />
            </IconButton>
          </Tooltip>

          <Typography variant="body2" sx={{ minWidth: '60px', textAlign: 'center' }}>
            {zoom}%
          </Typography>

          <Tooltip title={t('documentViewer.zoomIn')}>
            <IconButton onClick={handleZoomIn}>
              <ZoomIn />
            </IconButton>
          </Tooltip>

          <Tooltip title={t('documentViewer.rotateLeft')}>
            <IconButton onClick={handleRotateLeft}>
              <RotateLeft />
            </IconButton>
          </Tooltip>

          <Tooltip title={t('documentViewer.rotateRight')}>
            <IconButton onClick={handleRotateRight}>
              <RotateRight />
            </IconButton>
          </Tooltip>
        </Box>
      </Toolbar>

      {/* Document Content */}
      <Box
        ref={documentRef}
        sx={{
          transform: `scale(${zoom / 100}) rotate(${rotation}deg)`,
          transformOrigin: 'top left',
          transition: 'transform 0.3s ease',
          padding: 2,
        }}
      >
        <Tabs value={tabValue} onChange={(_, newValue) => setTabValue(newValue)}>
          <Tab label={t('documentViewer.view')} />
          <Tab label={t('documentViewer.comments')} />
          <Tab label={t('documentViewer.history')} />
        </Tabs>

        <TabPanel value={tabValue} index={0}>
          {renderDocumentContent()}
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <Typography variant="h6" gutterBottom>
            {t('documentViewer.comments')}
          </Typography>
          <Typography color="textSecondary">
            {t('documentViewer.noComments')}
          </Typography>
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <Typography variant="h6" gutterBottom>
            {t('documentViewer.history')}
          </Typography>
          <Typography color="textSecondary">
            {t('documentViewer.noHistory')}
          </Typography>
        </TabPanel>
      </Box>

      {/* Search Dialog */}
      <Dialog open={showSearchDialog} onClose={() => setShowSearchDialog(false)}>
        <DialogTitle>{t('documentViewer.search')}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mt: 1 }}>
            <TextField
              size="small"
              placeholder={t('documentViewer.searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
            <Button variant="contained" onClick={handleSearch}>
              {t('documentViewer.search')}
            </Button>
          </Box>
          {searchResults.length > 0 && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" gutterBottom>
                {t('documentViewer.searchResults', { count: searchResults.length })}
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button size="small" onClick={handlePrevSearch}>
                  {t('documentViewer.previous')}
                </Button>
                <Typography variant="body2" sx={{ alignSelf: 'center' }}>
                  {currentSearchIndex + 1} / {searchResults.length}
                </Typography>
                <Button size="small" onClick={handleNextSearch}>
                  {t('documentViewer.next')}
                </Button>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowSearchDialog(false)}>
            {t('common.close')}
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  )
}

export default DocumentViewer

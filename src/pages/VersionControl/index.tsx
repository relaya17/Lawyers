import React, { useState, useEffect, useRef } from 'react'
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Paper,
  IconButton,
  Tooltip,
  Badge
} from '@mui/material'
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineOppositeContent
} from '@mui/lab'
import {
  History,
  Compare,
  Restore,
  Add,
  Edit,
  Delete,
  Download,
  Share,
  Warning,
  CheckCircle,
  Error,
  Info,
  ExpandMore,
  Timeline as TimelineIcon,
  Assessment,
  Security,
  TrendingUp,
  TrendingDown,
  TrendingFlat
} from '@mui/icons-material'
import { useTranslation } from 'react-i18next'
import { versionControlService, ContractVersion, VersionHistory, VersionComparison } from '@shared/services/versionControl'
import { logger } from '@shared/utils/logger'

export const VersionControlPage: React.FC = () => {
  const { t } = useTranslation()
  const [versionHistory, setVersionHistory] = useState<VersionHistory | null>(null)
  const [selectedVersion, setSelectedVersion] = useState<ContractVersion | null>(null)
  
  // Debug: Log when selectedVersion changes
  useEffect(() => {
    // console.log('selectedVersion changed:', selectedVersion)
  }, [selectedVersion])
  const [comparison, setComparison] = useState<VersionComparison | null>(null)
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [showCompareDialog, setShowCompareDialog] = useState(false)
  const [newVersionContent, setNewVersionContent] = useState('')
  const [changeReason, setChangeReason] = useState('')
  const [loading, setLoading] = useState(true)
  const [notification, setNotification] = useState<{
    type: 'success' | 'error' | 'info'
    message: string
  } | null>(null)
  const detailsRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    loadVersionHistory()
  }, [])

  const showNotification = (type: 'success' | 'error' | 'info', message: string) => {
    setNotification({ type, message })
    setTimeout(() => setNotification(null), 5000)
  }

  const loadVersionHistory = async () => {
    setLoading(true)
    try {
      const history = await versionControlService.getVersionHistory('contract_1')
      // console.log('Loaded version history:', history)
      setVersionHistory(history)
    } catch (error) {
      logger.error('Failed to load version history:', error)
      showNotification('error', 'שגיאה בטעינת היסטוריית הגרסאות')
    } finally {
      setLoading(false)
    }
  }

  const handleCreateVersion = async () => {
    if (!newVersionContent.trim() || !changeReason.trim()) return

    setLoading(true)
    try {
      const newVersion = await versionControlService.createVersion({
        contractId: 'contract_1',
        content: newVersionContent,
        changeReason,
        stakeholders: ['משכיר', 'שוכר'],
        tags: ['עדכון', 'שיפור'],
        includeAiAnalysis: true
      })
      
      setShowCreateDialog(false)
      setNewVersionContent('')
      setChangeReason('')
      showNotification('success', 'גרסה חדשה נוצרה בהצלחה!')
      await loadVersionHistory()
    } catch (error) {
      console.error('Failed to create version:', error)
      showNotification('error', 'שגיאה ביצירת גרסה חדשה')
    } finally {
      setLoading(false)
    }
  }

  const handleCompareVersions = async (version1Id: string, version2Id: string) => {
    setLoading(true)
    try {
      const comparison = await versionControlService.compareVersions({
        version1Id,
        version2Id,
        includeAiAnalysis: true,
        highlightChanges: true
      })
      setComparison(comparison)
      setShowCompareDialog(true)
    } catch (error) {
      console.error('Failed to compare versions:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleRollback = async (targetVersionId: string) => {
    if (!confirm('האם אתה בטוח שברצונך לחזור לגרסה זו?')) return

    setLoading(true)
    try {
      await versionControlService.rollbackToVersion('contract_1', targetVersionId)
      await loadVersionHistory()
    } catch (error) {
      console.error('Failed to rollback:', error)
    } finally {
      setLoading(false)
    }
  }

  const getRiskTrendIcon = (trend: string) => {
    switch (trend) {
      case 'increasing': return <TrendingUp color="error" />
      case 'decreasing': return <TrendingDown color="success" />
      case 'stable': return <TrendingFlat color="info" />
      default: return <TrendingFlat />
    }
  }

  const getRiskTrendText = (trend: string) => {
    switch (trend) {
      case 'increasing': return 'עליית סיכון'
      case 'decreasing': return 'ירידת סיכון'
      case 'stable': return 'סיכון יציב'
      default: return 'לא ידוע'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'success'
      case 'review': return 'warning'
      case 'draft': return 'info'
      case 'archived': return 'default'
      default: return 'default'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircle />
      case 'review': return <Warning />
      case 'draft': return <Edit />
      case 'archived': return <Delete />
      default: return <Info />
    }
  }

  if (!versionHistory) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ 
          py: 8, 
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 3
        }}>
          <TimelineIcon sx={{ fontSize: 64, color: 'primary.main', animation: 'pulse 2s infinite' }} />
          <Typography variant="h4" gutterBottom>
            טוען היסטוריית גרסאות...
          </Typography>
          <Typography variant="body1" color="text.secondary">
            מתחבר לשרת ומביא את הנתונים
          </Typography>
        </Box>
      </Container>
    )
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }} className="fade-in">
        {notification && (
          <Alert 
            severity={notification.type} 
            sx={{ mb: 3 }}
            onClose={() => setNotification(null)}
          >
            {notification.message}
          </Alert>
        )}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Box>
            <Typography variant="h4" component="h1" gutterBottom>
              ניהול גרסאות מתקדם
            </Typography>
            <Typography variant="h6" color="text.secondary">
              מעקב אחר שינויים, השוואת גרסאות וניהול היסטוריה
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setShowCreateDialog(true)}
            disabled={loading}
          >
            {loading ? 'טוען...' : 'צור גרסה חדשה'}
          </Button>
        </Box>

        {/* Statistics Overview */}
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              סטטיסטיקות גרסאות
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={3}>
                <Box sx={{ textAlign: 'center' }}>
                                     <Typography variant="h4" color="primary" fontWeight="bold">
                     {versionHistory.statistics?.totalVersions || 0}
                   </Typography>
                  <Typography variant="body2" color="text.secondary">
                    גרסאות סה״כ
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={3}>
                <Box sx={{ textAlign: 'center' }}>
                                     <Typography variant="h4" color="success.main" fontWeight="bold">
                     {(versionHistory.statistics?.averageChangesPerVersion || 0).toFixed(1)}
                   </Typography>
                  <Typography variant="body2" color="text.secondary">
                    שינויים ממוצע לגרסה
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={3}>
                <Box sx={{ textAlign: 'center' }}>
                                     <Typography variant="h4" color="info.main" fontWeight="bold">
                     {versionHistory.statistics?.mostActiveAuthor || 'לא מוגדר'}
                   </Typography>
                  <Typography variant="body2" color="text.secondary">
                    עורך פעיל ביותר
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={3}>
                <Box sx={{ textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                     {getRiskTrendIcon(versionHistory.statistics?.riskTrend || 'stable')}
                   <Typography variant="h6" sx={{ ml: 1 }}>
                     {getRiskTrendText(versionHistory.statistics?.riskTrend || 'stable')}
                   </Typography>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        <Grid container spacing={3}>
          {/* Version Timeline */}
          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <TimelineIcon sx={{ mr: 2, color: 'primary.main' }} />
                  <Typography variant="h6">
                                         היסטוריית גרסאות ({versionHistory.versions?.length || 0} גרסאות)
                  </Typography>
                </Box>
                
                                 <Timeline>
                   {versionHistory.versions && Array.isArray(versionHistory.versions) && versionHistory.versions.map((version, index) => (
                                         <TimelineItem key={version.id || `version-${index}`}>
                                             <TimelineOppositeContent sx={{ m: 'auto 0' }} variant="body2" color="text.secondary">
                         {version.createdAt ? new Date(version.createdAt).toLocaleDateString('he-IL') : 'לא מוגדר'}
                       </TimelineOppositeContent>
                      <TimelineSeparator>
                                                 <TimelineDot color={getStatusColor(version.status || 'draft') as any}>
                           {getStatusIcon(version.status || 'draft')}
                         </TimelineDot>
                                                 {index < (versionHistory.versions?.length || 0) - 1 && <TimelineConnector />}
                      </TimelineSeparator>
                      <TimelineContent sx={{ py: '12px', px: 2 }}>
                        <Paper sx={{ p: 2 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                                                       <Typography variant="h6" component="span">
                             {version.title || 'כותרת לא מוגדרת'}
                           </Typography>
                            <Box sx={{ display: 'flex', gap: 1 }}>
                                                             <Chip 
                                 label={`גרסה ${version.versionNumber || 'לא מוגדרת'}`} 
                                 size="small" 
                                 color="primary" 
                                 variant="outlined"
                               />
                                                             {version.riskScore !== undefined && version.riskScore !== null && (
                                 <Chip 
                                   label={`סיכון: ${version.riskScore}%`} 
                                   size="small" 
                                   color={version.riskScore > 70 ? 'error' : version.riskScore > 40 ? 'warning' : 'success'}
                                 />
                               )}
                            </Box>
                          </Box>
                          
                                                     <Typography variant="body2" color="text.secondary" paragraph>
                             {version.metadata?.changeReason || 'לא צוינה סיבת שינוי'}
                           </Typography>
                          
                                                     <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                             {version.tags && Array.isArray(version.tags) && version.tags.map((tag, tagIndex) => (
                               <Chip key={tagIndex} label={tag || 'תג לא מוגדר'} size="small" variant="outlined" />
                             ))}
                           </Box>
                          
                                                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                                          <Button
                                size="small"
                                variant="outlined"
                                onClick={() => {
                                  console.log('Selected version:', version)
                                  setSelectedVersion(version)
                                  setTimeout(() => {
                                    if (detailsRef.current) {
                                      detailsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
                                      try { (detailsRef.current as any).focus?.() } catch { /* ignore focus errors */ }
                                    }
                                  }, 50)
                                }}
                                disabled={loading}
                              >
                                {loading ? 'טוען...' : 'צפה'}
                              </Button>
                                                         {index !== undefined && index > 0 && (
                              <Button
                                size="small"
                                variant="outlined"
                                                                 onClick={() => {
                                   if (versionHistory.versions && versionHistory.versions[index - 1]) {
                                     handleCompareVersions(versionHistory.versions[index - 1].id, version.id)
                                   }
                                 }}
                                disabled={loading}
                              >
                                {loading ? 'טוען...' : 'השווה'}
                              </Button>
                            )}
                                                         {version.status && version.status === 'approved' && (
                              <Button
                                size="small"
                                variant="outlined"
                                color="warning"
                                onClick={() => handleRollback(version.id)}
                                disabled={loading}
                              >
                                {loading ? 'טוען...' : 'חזור לגרסה זו'}
                              </Button>
                            )}
                          </Box>
                        </Paper>
                      </TimelineContent>
                    </TimelineItem>
                  ))}
                </Timeline>
              </CardContent>
            </Card>
          </Grid>

                     {/* Version Details */}
           <Grid
             item
             xs={12}
             md={4}
             ref={detailsRef}
             tabIndex={-1}
             role="region"
             aria-label="פרטי גרסה"
           >
             {selectedVersion && selectedVersion.id ? (
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h6">
                      פרטי גרסה
                    </Typography>
                    <IconButton onClick={() => setSelectedVersion(null)}>
                      <Delete />
                    </IconButton>
                  </Box>
                  
                                     <Typography variant="h6" gutterBottom>
                     {selectedVersion.title || 'כותרת לא מוגדרת'}
                   </Typography>
                  
                  <Box sx={{ mb: 2 }}>
                                         <Typography variant="body2" color="text.secondary">
                       <strong>יוצר:</strong> {selectedVersion.createdBy || 'לא מוגדר'}
                     </Typography>
                                         <Typography variant="body2" color="text.secondary">
                       <strong>תאריך:</strong> {selectedVersion.createdAt ? new Date(selectedVersion.createdAt).toLocaleDateString('he-IL') : 'לא מוגדר'}
                     </Typography>
                                         <Typography variant="body2" color="text.secondary">
                       <strong>סטטוס:</strong> {selectedVersion.status || 'לא מוגדר'}
                     </Typography>
                                         {selectedVersion.riskScore !== undefined && selectedVersion.riskScore !== null && (
                       <Typography variant="body2" color="text.secondary">
                         <strong>רמת סיכון:</strong> {selectedVersion.riskScore}%
                       </Typography>
                     )}
                  </Box>
                  
                  <Typography variant="subtitle2" gutterBottom>
                    סיבת השינוי:
                  </Typography>
                  <Typography variant="body2" paragraph>
                    {selectedVersion.metadata?.changeReason || 'לא צוינה סיבת שינוי'}
                  </Typography>
                  
                  {selectedVersion.changes && selectedVersion.changes.length > 0 && (
                    <Accordion>
                      <AccordionSummary expandIcon={<ExpandMore />}>
                        <Typography variant="subtitle2">
                                                     שינויים ({selectedVersion.changes?.length || 0})
                        </Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                                                 <List dense>
                           {selectedVersion.changes && selectedVersion.changes.map((change) => (
                            <ListItem key={change.id || `change-${Math.random()}`}>
                              <ListItemIcon>
                                <Info color={(change.impact || 'medium') === 'critical' ? 'error' : (change.impact || 'medium') === 'high' ? 'warning' : 'info'} />
                              </ListItemIcon>
                                                             <ListItemText
                                 primary={change.description || 'תיאור לא מוגדר'}
                                 secondary={`${change.section || 'סעיף לא מוגדר'} - ${change.impact || 'לא מוגדר'}`}
                               />
                            </ListItem>
                          ))}
                        </List>
                      </AccordionDetails>
                    </Accordion>
                  )}
                  
                  {selectedVersion.aiSuggestions && Array.isArray(selectedVersion.aiSuggestions) && selectedVersion.aiSuggestions.length > 0 && (
                    <Accordion>
                      <AccordionSummary expandIcon={<ExpandMore />}>
                        <Typography variant="subtitle2">
                                                     המלצות AI ({selectedVersion.aiSuggestions?.length || 0})
                        </Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                                                 <List dense>
                           {selectedVersion.aiSuggestions && selectedVersion.aiSuggestions.map((suggestion, index) => (
                            <ListItem key={index}>
                              <ListItemIcon>
                                <Security color="primary" />
                              </ListItemIcon>
                                                             <ListItemText primary={suggestion || 'המלצה לא מוגדרת'} />
                            </ListItem>
                          ))}
                        </List>
                      </AccordionDetails>
                    </Accordion>
                  )}
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    מידע מהיר
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    בחר גרסה מהרשימה כדי לראות פרטים מלאים
                  </Typography>
                </CardContent>
              </Card>
            )}
          </Grid>
        </Grid>

        {/* Create Version Dialog */}
        <Dialog open={showCreateDialog} onClose={() => setShowCreateDialog(false)} maxWidth="md" fullWidth>
          <DialogTitle>צור גרסה חדשה</DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              multiline
              rows={8}
              label="תוכן החוזה"
              value={newVersionContent}
              onChange={(e) => setNewVersionContent(e.target.value)}
              placeholder="הדבק כאן את תוכן החוזה..."
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="סיבת השינוי"
              value={changeReason}
              onChange={(e) => setChangeReason(e.target.value)}
              placeholder="תאר את הסיבה לשינוי..."
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowCreateDialog(false)}>
              ביטול
            </Button>
            <Button 
              onClick={handleCreateVersion} 
              variant="contained"
              disabled={loading || !newVersionContent.trim() || !changeReason.trim()}
            >
              {loading ? 'יוצר...' : 'צור גרסה'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Compare Versions Dialog */}
        <Dialog open={showCompareDialog} onClose={() => setShowCompareDialog(false)} maxWidth="lg" fullWidth>
          <DialogTitle>השוואת גרסאות</DialogTitle>
                     <DialogContent>
             {comparison && comparison.version1 && comparison.version2 && (
              <Box>
                <Grid container spacing={2} sx={{ mb: 3 }}>
                  <Grid item xs={6}>
                                         <Typography variant="h6" gutterBottom>
                       {comparison.version1?.title || 'כותרת לא מוגדרת'}
                     </Typography>
                     <Typography variant="body2" color="text.secondary">
                       גרסה {comparison.version1?.versionNumber || 'לא מוגדרת'}
                     </Typography>
                  </Grid>
                  <Grid item xs={6}>
                                         <Typography variant="h6" gutterBottom>
                       {comparison.version2?.title || 'כותרת לא מוגדרת'}
                     </Typography>
                     <Typography variant="body2" color="text.secondary">
                       גרסה {comparison.version2?.versionNumber || 'לא מוגדרת'}
                     </Typography>
                  </Grid>
                </Grid>
                
                <Alert severity="info" sx={{ mb: 3 }}>
                  <Typography variant="body2">
                                         <strong>סיכום השינויים:</strong> {comparison.summary?.additions || 0} הוספות, {comparison.summary?.deletions || 0} מחיקות, {comparison.summary?.modifications || 0} שינויים
                  </Typography>
                </Alert>
                
                <Typography variant="h6" gutterBottom>
                                     שינויים מפורטים ({comparison.differences?.length || 0}):
                </Typography>
                                 <List>
                   {comparison.differences && Array.isArray(comparison.differences) && comparison.differences.map((diff) => (
                                         <ListItem key={diff.id || `diff-${Math.random()}`}>
                      <ListItemIcon>
                                                 <Info color={(diff.impact || 'medium') === 'critical' ? 'error' : (diff.impact || 'medium') === 'high' ? 'warning' : 'info'} />
                      </ListItemIcon>
                                               <ListItemText
                           primary={diff.description || 'תיאור לא מוגדר'}
                           secondary={`${diff.section || 'סעיף לא מוגדר'} - ${diff.impact || 'לא מוגדר'}`}
                         />
                    </ListItem>
                  ))}
                </List>
                
                                 {comparison.summary?.riskChanges && Array.isArray(comparison.summary.riskChanges) && comparison.summary.riskChanges.length > 0 && (
                  <Box sx={{ mt: 3 }}>
                    <Typography variant="h6" gutterBottom>
                                             שינויים ברמת הסיכון ({comparison.summary?.riskChanges?.length || 0}):
                    </Typography>
                                         <List dense>
                       {comparison.summary.riskChanges && comparison.summary.riskChanges.map((change, index) => (
                        <ListItem key={index}>
                          <ListItemIcon>
                            <Assessment color="warning" />
                          </ListItemIcon>
                          <ListItemText primary={change || 'שינוי לא מוגדר'} />
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                )}
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowCompareDialog(false)}>
              סגור
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Container>
  )
}

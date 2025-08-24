import React, { useState } from 'react'
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Switch,
  FormControlLabel,
  Tabs,
  Tab,
  Alert,
  LinearProgress,
  Avatar,
  Divider,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material'
import {
  Watch,
  Sync,
  Notifications,
  Settings,
  Speed,
  TrendingUp,
  CheckCircle,
  Error,
  Warning,
  Info,
  Send,
  PlayArrow,
  Stop,
  Refresh,
  ExpandMore,
  Favorite,
  DirectionsRun,
  Timeline,
  TouchApp,
  VolumeUp,
  AccessTime,
} from '@mui/icons-material'
import { useTranslation } from 'react-i18next'
import { useWatchApp } from '../hooks/useAppleWatch'
import { WatchSession } from '../types/watchTypes'

// Define missing types
type WatchSessionType = 'document_review' | 'meeting' | 'research' | 'general'

export const AppleWatchDashboard: React.FC = () => {
  const { t } = useTranslation()
  const watchApp = useWatchApp()
  const [activeTab, setActiveTab] = useState(0)
  const [testNotificationOpen, setTestNotificationOpen] = useState(false)
  const [sessionDialogOpen, setSessionDialogOpen] = useState(false)
  const [settingsDialogOpen, setSettingsDialogOpen] = useState(false)

  const getConnectionStatusIcon = () => {
    if (!watchApp.connection.connectivity) return <Error color="error" />
    
    if (watchApp.connection.connectivity.isReachable) {
      return <CheckCircle color="success" />
    } else if (watchApp.connection.connectivity.isPaired) {
      return <Warning color="warning" />
    } else {
      return <Error color="error" />
    }
  }

  const getConnectionStatusText = () => {
    if (!watchApp.connection.connectivity) return 'לא זמין'
    
    const { connectivity } = watchApp.connection
    if (connectivity.isReachable) return 'מחובר'
    if (connectivity.isPaired) return 'מזווג אך לא זמין'
    return 'לא מחובר'
  }

  const handleTestNotification = async () => {
    const success = await watchApp.notifications.sendUrgentContractAlert(
      'חוזה שירותי ייעוץ',
      'מחר'
    )
    
    if (success) {
      setTestNotificationOpen(false)
    }
  }

  const handleStartSession = async (type: 'document_review' | 'meeting' | 'research' | 'general') => {
    watchApp.sessions.startSession(type)
    setSessionDialogOpen(false)
  }

  const handleEndActiveSession = () => {
    if (watchApp.sessions.activeSession) {
      watchApp.sessions.endSession(watchApp.sessions.activeSession.id)
    }
  }

  const renderConnectionStatus = () => (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">
            <Watch sx={{ mr: 1, verticalAlign: 'middle' }} />
            סטטוס חיבור
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <IconButton 
              onClick={watchApp.connection.sync}
              disabled={watchApp.connection.isLoading}
            >
              <Sync />
            </IconButton>
            <IconButton onClick={watchApp.connection.connect}>
              <Refresh />
            </IconButton>
          </Box>
        </Box>

        {watchApp.connection.isLoading && <LinearProgress sx={{ mb: 2 }} />}

        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              {getConnectionStatusIcon()}
              <Typography variant="body1">
                {getConnectionStatusText()}
              </Typography>
            </Box>
            
            {watchApp.connection.connectivity && (
              <Box>
                <Typography variant="body2" color="text.secondary">
                  watchOS: {watchApp.connection.connectivity.watchOS}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  חיבור אחרון: {
                    watchApp.connection.connectivity.lastConnection > 0
                      ? new Date(watchApp.connection.connectivity.lastConnection).toLocaleString('he-IL')
                      : 'מעולם לא'
                  }
                </Typography>
              </Box>
            )}
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {watchApp.connection.connectivity?.isPaired && (
                <Chip label="מזווג" color="success" size="small" />
              )}
              {watchApp.connection.connectivity?.isWatchAppInstalled && (
                <Chip label="אפליקציה מותקנת" color="info" size="small" />
              )}
              {watchApp.connection.connectivity?.isReachable && (
                <Chip label="זמין" color="primary" size="small" />
              )}
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )

  const renderComplications = () => (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Complications
        </Typography>
        
        {watchApp.complications.isLoading && <LinearProgress sx={{ mb: 2 }} />}
        
        <List>
          {watchApp.complications.complications.map((complication) => (
            <React.Fragment key={complication.id}>
              <ListItem>
                <ListItemIcon>
                  <Watch color={complication.isActive ? 'primary' : 'disabled'} />
                </ListItemIcon>
                <ListItemText
                  primary={complication.displayName}
                  secondary={
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        {complication.family} • עדכון כל {Math.round(complication.updateFrequency / 60)} דקות
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        נתונים: {JSON.stringify(complication.data)}
                      </Typography>
                    </Box>
                  }
                />
                <ListItemSecondaryAction>
                  <Chip
                    label={complication.isActive ? 'פעיל' : 'לא פעיל'}
                    color={complication.isActive ? 'success' : 'default'}
                    size="small"
                  />
                </ListItemSecondaryAction>
              </ListItem>
              <Divider />
            </React.Fragment>
          ))}
        </List>
        
        <Button
          variant="outlined"
          onClick={watchApp.complications.refresh}
          disabled={watchApp.complications.isLoading}
          sx={{ mt: 2 }}
        >
          רענן Complications
        </Button>
      </CardContent>
    </Card>
  )

  const renderQuickActions = () => (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          פעולות מהירות
        </Typography>
        
        <Grid container spacing={2}>
          {watchApp.quickActions.quickActions.map((action) => (
            <Grid item xs={12} sm={6} md={4} key={action.id}>
              <Paper
                sx={{
                  p: 2,
                  textAlign: 'center',
                  cursor: action.isEnabled ? 'pointer' : 'not-allowed',
                  opacity: action.isEnabled ? 1 : 0.5,
                  '&:hover': action.isEnabled ? {
                    bgcolor: 'action.hover'
                  } : {}
                }}
                onClick={() => action.isEnabled && watchApp.quickActions.executeAction(action.id)}
              >
                <TouchApp sx={{ fontSize: 40, mb: 1, color: 'primary.main' }} />
                <Typography variant="subtitle2">
                  {action.title}
                </Typography>
                {action.requiresAuth && (
                  <Chip label="דורש אימות" size="small" sx={{ mt: 1 }} />
                )}
              </Paper>
            </Grid>
          ))}
        </Grid>
        
        <Alert severity="info" sx={{ mt: 2 }}>
          פעולות מהירות זמינות בשעון Apple Watch לגישה מהירה
        </Alert>
      </CardContent>
    </Card>
  )

  const renderSessions = () => (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">
            סשנים
          </Typography>
          <Box>
            {watchApp.sessions.activeSession ? (
              <Button
                variant="contained"
                color="error"
                startIcon={<Stop />}
                onClick={handleEndActiveSession}
              >
                סיים סשן
              </Button>
            ) : (
              <Button
                variant="contained"
                startIcon={<PlayArrow />}
                onClick={() => setSessionDialogOpen(true)}
              >
                התחל סשן
              </Button>
            )}
          </Box>
        </Box>
        
        {watchApp.sessions.activeSession && (
          <Alert severity="info" sx={{ mb: 2 }}>
            סשן פעיל: {watchApp.sessions.activeSession.type} • 
            התחיל ב-{new Date(watchApp.sessions.activeSession.startTime).toLocaleTimeString('he-IL')}
          </Alert>
        )}
        
        <Typography variant="subtitle2" gutterBottom>
          סשנים אחרונים:
        </Typography>
        
        <List>
          {watchApp.sessions.sessions.slice(-5).reverse().map((session) => (
            <ListItem key={session.id}>
              <ListItemIcon>
                <Timeline />
              </ListItemIcon>
              <ListItemText
                primary={session.type}
                secondary={
                  <Box>
                    <Typography variant="body2">
                      משך: {Math.round(session.metrics.duration / 60000)} דקות
                    </Typography>
                    <Typography variant="body2">
                      פרודוקטיביות: {session.metrics.productivity}%
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {new Date(session.startTime).toLocaleString('he-IL')}
                    </Typography>
                  </Box>
                }
              />
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  )

  const renderHealthData = () => {
    if (!watchApp.health.healthData) {
      return (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              נתוני בריאות
            </Typography>
            <Typography variant="body2" color="text.secondary">
              נתוני בריאות לא זמינים
            </Typography>
            <Button
              variant="outlined"
              onClick={watchApp.health.refresh}
              disabled={watchApp.health.isLoading}
              sx={{ mt: 2 }}
            >
              רענן נתונים
            </Button>
          </CardContent>
        </Card>
      )
    }

    const { healthData } = watchApp.health

    return (
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">
              נתוני בריאות
            </Typography>
            <IconButton
              onClick={watchApp.health.refresh}
              disabled={watchApp.health.isLoading}
            >
              <Refresh />
            </IconButton>
          </Box>
          
          {watchApp.health.isLoading && <LinearProgress sx={{ mb: 2 }} />}
          
          <Grid container spacing={2}>
            <Grid item xs={6} sm={4}>
              <Box sx={{ textAlign: 'center' }}>
                <Favorite sx={{ fontSize: 40, color: 'error.main', mb: 1 }} />
                <Typography variant="h6">{Math.round(healthData.heartRate)}</Typography>
                <Typography variant="body2" color="text.secondary">דופק</Typography>
              </Box>
            </Grid>
            
            <Grid item xs={6} sm={4}>
              <Box sx={{ textAlign: 'center' }}>
                <DirectionsRun sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                <Typography variant="h6">{healthData.steps.toLocaleString()}</Typography>
                <Typography variant="body2" color="text.secondary">צעדים</Typography>
              </Box>
            </Grid>
            
            <Grid item xs={6} sm={4}>
              <Box sx={{ textAlign: 'center' }}>
                <TrendingUp sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
                <Typography variant="h6">{Math.round(healthData.activeEnergy)}</Typography>
                <Typography variant="body2" color="text.secondary">קלוריות</Typography>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    )
  }

  const renderMetrics = () => (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          מדדי שימוש
        </Typography>
        
        {watchApp.metrics.metrics && (
          <Grid container spacing={2}>
            <Grid item xs={6} sm={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h4">{watchApp.metrics.metrics.dailyInteractions}</Typography>
                <Typography variant="body2" color="text.secondary">אינטראקציות יומיות</Typography>
              </Box>
            </Grid>
            
            <Grid item xs={6} sm={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h4">{watchApp.metrics.metrics.notificationsReceived}</Typography>
                <Typography variant="body2" color="text.secondary">התראות שהתקבלו</Typography>
              </Box>
            </Grid>
            
            <Grid item xs={6} sm={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h4">{watchApp.metrics.metrics.complicationViews}</Typography>
                <Typography variant="body2" color="text.secondary">צפיות ב-Complications</Typography>
              </Box>
            </Grid>
            
            <Grid item xs={6} sm={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h4">{Math.round(watchApp.metrics.metrics.avgResponseTime / 1000)}s</Typography>
                <Typography variant="body2" color="text.secondary">זמן תגובה ממוצע</Typography>
              </Box>
            </Grid>
          </Grid>
        )}
        
        <Button
          variant="outlined"
          onClick={watchApp.metrics.refresh}
          sx={{ mt: 2 }}
        >
          רענן מדדים
        </Button>
      </CardContent>
    </Card>
  )

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Apple Watch Dashboard
      </Typography>

      <Tabs value={activeTab} onChange={(_, newValue) => setActiveTab(newValue)} sx={{ mb: 3 }}>
        <Tab label="סקירה כללית" />
        <Tab label="Complications" />
        <Tab label="פעולות מהירות" />
        <Tab label="סשנים" />
        <Tab label="בריאות" />
        <Tab label="הגדרות" />
      </Tabs>

      {activeTab === 0 && (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            {renderConnectionStatus()}
          </Grid>
          <Grid item xs={12} md={6}>
            {renderMetrics()}
          </Grid>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  פעולות בדיקה
                </Typography>
                
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  <Button
                    variant="outlined"
                    startIcon={<Notifications />}
                    onClick={() => setTestNotificationOpen(true)}
                    disabled={!watchApp.connection.isConnected}
                  >
                    שלח התראה
                  </Button>
                  
                  <Button
                    variant="outlined"
                    startIcon={<Sync />}
                    onClick={watchApp.connection.sync}
                    disabled={watchApp.connection.isLoading}
                  >
                    סנכרן
                  </Button>
                  
                  <Button
                    variant="outlined"
                    startIcon={<Settings />}
                    onClick={() => setSettingsDialogOpen(true)}
                  >
                    הגדרות
                  </Button>
                </Box>
                
                {!watchApp.connection.isConnected && (
                  <Alert severity="warning" sx={{ mt: 2 }}>
                    Apple Watch לא מחובר. חלק מהתכונות לא יהיו זמינות.
                  </Alert>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {activeTab === 1 && renderComplications()}
      {activeTab === 2 && renderQuickActions()}
      {activeTab === 3 && renderSessions()}
      {activeTab === 4 && renderHealthData()}
      
      {activeTab === 5 && (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              הגדרות Apple Watch
            </Typography>
            
            {watchApp.settings.settings && (
              <Accordion>
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <Typography>הגדרות התראות</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={watchApp.settings.settings.notifications.enabled}
                        onChange={(e) => watchApp.settings.updateSettings({
                          notifications: {
                            ...watchApp.settings.settings!.notifications,
                            enabled: e.target.checked
                          }
                        })}
                      />
                    }
                    label="התראות פעילות"
                  />
                  
                  <FormControlLabel
                    control={
                      <Switch
                        checked={watchApp.settings.settings.notifications.urgentOnly}
                        onChange={(e) => watchApp.settings.updateSettings({
                          notifications: {
                            ...watchApp.settings.settings!.notifications,
                            urgentOnly: e.target.checked
                          }
                        })}
                      />
                    }
                    label="התראות דחופות בלבד"
                  />
                </AccordionDetails>
              </Accordion>
            )}
          </CardContent>
        </Card>
      )}

      {/* Test Notification Dialog */}
      <Dialog open={testNotificationOpen} onClose={() => setTestNotificationOpen(false)}>
        <DialogTitle>שליחת התראת בדיקה</DialogTitle>
        <DialogContent>
          <Typography>האם לשלוח התראת בדיקה ל-Apple Watch?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setTestNotificationOpen(false)}>ביטול</Button>
          <Button onClick={handleTestNotification} variant="contained">שלח</Button>
        </DialogActions>
      </Dialog>

      {/* Session Dialog */}
      <Dialog open={sessionDialogOpen} onClose={() => setSessionDialogOpen(false)}>
        <DialogTitle>התחלת סשן חדש</DialogTitle>
        <DialogContent>
          <Typography gutterBottom>בחר סוג סשן:</Typography>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            {[
              { type: 'document_review', label: 'סקירת מסמכים' },
              { type: 'meeting', label: 'פגישה' },
              { type: 'research', label: 'מחקר' },
              { type: 'general', label: 'כללי' }
            ].map((session) => (
              <Grid item xs={6} key={session.type}>
                <Button
                  variant="outlined"
                  fullWidth
                  onClick={() => handleStartSession(session.type as WatchSessionType)}
                >
                  {session.label}
                </Button>
              </Grid>
            ))}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSessionDialogOpen(false)}>ביטול</Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

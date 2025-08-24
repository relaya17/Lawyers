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
  Divider,
  Alert,
  LinearProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material'
import {
  PhoneIphone,
  Battery20,
  Storage,
  Speed,
  Vibration,
  Notifications,
  Share,
  ContactPage,
  Event,
  RecordVoiceOver,
  Accessibility,
  ExpandMore,
  Info,
  CheckCircle,
  Error,
  Refresh,
  Send,
  Add,
} from '@mui/icons-material'
import {
  useIOSDevice,
  useIOSKeyboard,
  useIOSBattery,
  useIOSStorage,
  useIOSPerformance,
  useIOSHaptics,
  useIOSNotifications,
  useIOSShare,
  useIOSContacts,
  useIOSCalendar,
  useIOSSpeech,
  useIOSAccessibility
} from '../hooks/useIOSFeatures'

export const IOSFeaturePanel: React.FC = () => {
  const device = useIOSDevice()
  const keyboard = useIOSKeyboard()
  const { batteryInfo, loading: batteryLoading, refresh: refreshBattery } = useIOSBattery()
  const { storageInfo, loading: storageLoading, refresh: refreshStorage } = useIOSStorage()
  const performance = useIOSPerformance()
  const haptics = useIOSHaptics()
  const notifications = useIOSNotifications()
  const sharing = useIOSShare()
  const contacts = useIOSContacts()
  const calendar = useIOSCalendar()
  const speech = useIOSSpeech()
  const accessibility = useIOSAccessibility()

  const [testNotificationOpen, setTestNotificationOpen] = useState(false)
  const [testShareOpen, setTestShareOpen] = useState(false)
  const [testContactOpen, setTestContactOpen] = useState(false)
  const [testEventOpen, setTestEventOpen] = useState(false)
  const [testSpeechOpen, setTestSpeechOpen] = useState(false)

  const handleTestHaptic = (type: 'impact' | 'notification' | 'selection') => {
    switch (type) {
      case 'impact':
        haptics.impact('medium')
        break
      case 'notification':
        haptics.notification('success')
        break
      case 'selection':
        haptics.selection()
        break
    }
  }

  const handleTestNotification = async () => {
    try {
      if (notifications.permission !== 'granted') {
        await notifications.requestPermission()
      }
      
      await notifications.sendNotification({
        id: `test-${Date.now()}`,
        title: 'התראה ממערכת החוזים',
        body: 'זוהה חוזה חדש הדורש תשומת לב'
      })
      
      setTestNotificationOpen(false)
    } catch (error) {
      console.error('Notification test failed:', error)
    }
  }

  const handleTestShare = async () => {
    try {
      await sharing.share({
        title: 'מערכת ניהול חוזים',
        text: 'בדוק את המערכת החדשה לניהול חוזים',
        url: window.location.href
      })
      setTestShareOpen(false)
    } catch (error) {
      console.error('Share test failed:', error)
    }
  }

  const handleTestContact = async () => {
    try {
      await contacts.addContact({
        firstName: 'יועץ',
        lastName: 'משפטי',
        emails: ['legal@example.com'],
        phoneNumbers: ['+972-50-1234567'],
        organization: 'משרד עורכי דין',
        jobTitle: 'יועץ משפטי'
      })
      setTestContactOpen(false)
    } catch (error) {
      console.error('Contact test failed:', error)
    }
  }

  const handleTestCalendarEvent = async () => {
    try {
      const tomorrow = new Date()
      tomorrow.setDate(tomorrow.getDate() + 1)
      tomorrow.setHours(10, 0, 0, 0)
      
      const endTime = new Date(tomorrow)
      endTime.setHours(11, 0, 0, 0)

      await calendar.addEvent({
        title: 'פגישת ייעוץ משפטי',
        startDate: tomorrow,
        endDate: endTime,
        location: 'משרד עורכי דין',
        notes: 'דיון בחוזה חדש'
      })
      setTestEventOpen(false)
    } catch (error) {
      console.error('Calendar test failed:', error)
    }
  }

  const handleTestSpeech = async () => {
    try {
      await speech.speak('שלום, זוהי מערכת ניהול חוזים חכמה', 'he-IL')
      setTestSpeechOpen(false)
    } catch (error) {
      console.error('Speech test failed:', error)
    }
  }

  const renderDeviceInfo = () => (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          <PhoneIphone sx={{ mr: 1, verticalAlign: 'middle' }} />
          מידע על המכשיר
        </Typography>
        
        {device.deviceInfo && (
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="text.secondary">
                דגם: {device.deviceInfo.model}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                גרסה: {device.deviceInfo.version}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                כיוון: {device.deviceInfo.orientation}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {device.isIOS && <Chip label="iOS" color="primary" size="small" />}
                {device.isStandalone && <Chip label="PWA" color="success" size="small" />}
                {device.deviceInfo.hasNotch && <Chip label="Notch" color="info" size="small" />}
                {device.deviceInfo.hasDynamicIsland && <Chip label="Dynamic Island" color="info" size="small" />}
              </Box>
            </Grid>
          </Grid>
        )}

        {keyboard.isVisible && (
          <Alert severity="info" sx={{ mt: 2 }}>
            מקלדת פעילה - גובה: {keyboard.height}px
          </Alert>
        )}
      </CardContent>
    </Card>
  )

  const renderSystemInfo = () => (
    <Grid container spacing={3}>
      {/* Battery */}
      <Grid item xs={12} md={4}>
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">
                <Battery20 sx={{ mr: 1, verticalAlign: 'middle' }} />
                סוללה
              </Typography>
              <IconButton onClick={refreshBattery} disabled={batteryLoading}>
                <Refresh />
              </IconButton>
            </Box>
            
            {batteryLoading && <LinearProgress sx={{ mb: 2 }} />}
            
            {batteryInfo ? (
              <Box>
                <Typography variant="h4">
                  {Math.round(batteryInfo.level * 100)}%
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {batteryInfo.isCharging ? 'נטען' : 'פועל על סוללה'}
                </Typography>
                {batteryInfo.chargingTime && batteryInfo.chargingTime !== Infinity && (
                  <Typography variant="body2" color="text.secondary">
                    זמן טעינה: {Math.round(batteryInfo.chargingTime / 60)} דקות
                  </Typography>
                )}
              </Box>
            ) : (
              <Typography variant="body2" color="text.secondary">
                מידע על סוללה לא זמין
              </Typography>
            )}
          </CardContent>
        </Card>
      </Grid>

      {/* Storage */}
      <Grid item xs={12} md={4}>
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">
                <Storage sx={{ mr: 1, verticalAlign: 'middle' }} />
                אחסון
              </Typography>
              <IconButton onClick={refreshStorage} disabled={storageLoading}>
                <Refresh />
              </IconButton>
            </Box>
            
            {storageLoading && <LinearProgress sx={{ mb: 2 }} />}
            
            {storageInfo ? (
              <Box>
                <Typography variant="h4">
                  {Math.round((storageInfo.usage / storageInfo.quota) * 100)}%
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  בשימוש: {Math.round(storageInfo.usage / 1024 / 1024)} MB
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  זמין: {Math.round(storageInfo.available / 1024 / 1024)} MB
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={(storageInfo.usage / storageInfo.quota) * 100}
                  sx={{ mt: 1 }}
                />
              </Box>
            ) : (
              <Typography variant="body2" color="text.secondary">
                מידע על אחסון לא זמין
              </Typography>
            )}
          </CardContent>
        </Card>
      </Grid>

      {/* Performance */}
      <Grid item xs={12} md={4}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              <Speed sx={{ mr: 1, verticalAlign: 'middle' }} />
              ביצועים
            </Typography>
            
            {performance ? (
              <Box>
                <Typography variant="body2" color="text.secondary">
                  זיכרון: {Math.round(performance.memory.used / 1024 / 1024)} MB
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  טעינת DOM: {Math.round(performance.navigation.domContentLoaded)}ms
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  ציור ראשון: {Math.round(performance.rendering.firstPaint)}ms
                </Typography>
              </Box>
            ) : (
              <Typography variant="body2" color="text.secondary">
                מידע על ביצועים לא זמין
              </Typography>
            )}
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )

  const renderFeatureTests = () => (
    <Grid container spacing={3}>
      {/* Haptics */}
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              <Vibration sx={{ mr: 1, verticalAlign: 'middle' }} />
              רטט (Haptics)
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <Button
                variant="outlined"
                size="small"
                onClick={() => handleTestHaptic('impact')}
                disabled={!haptics.isSupported}
              >
                Impact
              </Button>
              <Button
                variant="outlined"
                size="small"
                onClick={() => handleTestHaptic('notification')}
                disabled={!haptics.isSupported}
              >
                Notification
              </Button>
              <Button
                variant="outlined"
                size="small"
                onClick={() => handleTestHaptic('selection')}
                disabled={!haptics.isSupported}
              >
                Selection
              </Button>
            </Box>
            
            {!haptics.isSupported && (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                רטט לא נתמך במכשיר זה
              </Typography>
            )}
          </CardContent>
        </Card>
      </Grid>

      {/* Notifications */}
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              <Notifications sx={{ mr: 1, verticalAlign: 'middle' }} />
              התראות
            </Typography>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <Chip
                label={notifications.permission}
                color={notifications.permission === 'granted' ? 'success' : 'warning'}
                size="small"
              />
              <Button
                variant="outlined"
                size="small"
                onClick={() => setTestNotificationOpen(true)}
                disabled={!notifications.isSupported}
              >
                בדיקה
              </Button>
            </Box>
            
            {notifications.permission === 'default' && (
              <Button
                variant="contained"
                size="small"
                onClick={notifications.requestPermission}
                sx={{ mt: 1 }}
              >
                בקש הרשאה
              </Button>
            )}
          </CardContent>
        </Card>
      </Grid>

      {/* Sharing */}
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              <Share sx={{ mr: 1, verticalAlign: 'middle' }} />
              שיתוף
            </Typography>
            
            <Button
              variant="outlined"
              size="small"
              onClick={() => setTestShareOpen(true)}
              disabled={!sharing.isSupported}
              startIcon={<Send />}
            >
              בדיקת שיתוף
            </Button>
            
            {!sharing.isSupported && (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                שיתוף לא נתמך במכשיר זה
              </Typography>
            )}
          </CardContent>
        </Card>
      </Grid>

      {/* Contacts */}
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              <ContactPage sx={{ mr: 1, verticalAlign: 'middle' }} />
              אנשי קשר
            </Typography>
            
            <Button
              variant="outlined"
              size="small"
              onClick={() => setTestContactOpen(true)}
              startIcon={<Add />}
            >
              הוסף איש קשר
            </Button>
          </CardContent>
        </Card>
      </Grid>

      {/* Calendar */}
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              <Event sx={{ mr: 1, verticalAlign: 'middle' }} />
              יומן
            </Typography>
            
            <Button
              variant="outlined"
              size="small"
              onClick={() => setTestEventOpen(true)}
              startIcon={<Add />}
            >
              הוסף אירוע
            </Button>
          </CardContent>
        </Card>
      </Grid>

      {/* Speech */}
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              <RecordVoiceOver sx={{ mr: 1, verticalAlign: 'middle' }} />
              דיבור
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant="outlined"
                size="small"
                onClick={() => setTestSpeechOpen(true)}
                disabled={!speech.isSupported || speech.isSpeaking}
              >
                דבר
              </Button>
              {speech.isSpeaking && (
                <Button
                  variant="outlined"
                  size="small"
                  onClick={speech.stop}
                  color="error"
                >
                  עצור
                </Button>
              )}
            </Box>
            
            {!speech.isSupported && (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                דיבור לא נתמך במכשיר זה
              </Typography>
            )}
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        תכונות iOS ילידיות
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          {renderDeviceInfo()}
        </Grid>
        
        <Grid item xs={12}>
          <Typography variant="h5" gutterBottom>
            מידע מערכת
          </Typography>
          {renderSystemInfo()}
        </Grid>
        
        <Grid item xs={12}>
          <Typography variant="h5" gutterBottom>
            בדיקת תכונות
          </Typography>
          {renderFeatureTests()}
        </Grid>

        {/* Accessibility Info */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                <Accessibility sx={{ mr: 1, verticalAlign: 'middle' }} />
                נגישות
              </Typography>
              
              <Typography variant="body2" color="text.secondary">
                VoiceOver: {accessibility.voiceOver.enabled ? 'פעיל' : 'לא פעיל'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                שפה: {accessibility.voiceOver.language}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Test Dialogs */}
      <Dialog open={testNotificationOpen} onClose={() => setTestNotificationOpen(false)}>
        <DialogTitle>בדיקת התראות</DialogTitle>
        <DialogContent>
          <Typography>האם לשלוח התראת בדיקה?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setTestNotificationOpen(false)}>ביטול</Button>
          <Button onClick={handleTestNotification} variant="contained">שלח</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={testShareOpen} onClose={() => setTestShareOpen(false)}>
        <DialogTitle>בדיקת שיתוף</DialogTitle>
        <DialogContent>
          <Typography>האם לשתף את המערכת?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setTestShareOpen(false)}>ביטול</Button>
          <Button onClick={handleTestShare} variant="contained">שתף</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={testContactOpen} onClose={() => setTestContactOpen(false)}>
        <DialogTitle>הוספת איש קשר</DialogTitle>
        <DialogContent>
          <Typography>האם להוסיף איש קשר לדוגמה?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setTestContactOpen(false)}>ביטול</Button>
          <Button onClick={handleTestContact} variant="contained">הוסף</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={testEventOpen} onClose={() => setTestEventOpen(false)}>
        <DialogTitle>הוספת אירוע ליומן</DialogTitle>
        <DialogContent>
          <Typography>האם להוסיף אירוע לדוגמה ליומן?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setTestEventOpen(false)}>ביטול</Button>
          <Button onClick={handleTestCalendarEvent} variant="contained">הוסף</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={testSpeechOpen} onClose={() => setTestSpeechOpen(false)}>
        <DialogTitle>בדיקת דיבור</DialogTitle>
        <DialogContent>
          <Typography>האם להשמיע טקסט לדוגמה?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setTestSpeechOpen(false)}>ביטול</Button>
          <Button onClick={handleTestSpeech} variant="contained">השמע</Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

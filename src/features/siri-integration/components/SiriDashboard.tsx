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
  Slider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material'
import {
  RecordVoiceOver,
  VoiceChat,
  Mic,
  MicOff,
  Settings,
  Add,
  Edit,
  Delete,
  PlayArrow,
  Stop,
  VolumeUp,
  Speed,
  ExpandMore,
  Assessment,
  Lightbulb,
  CheckCircle,
  Error,
  Warning,
  Refresh,
  SmartToy,
  Hearing,
  Accessibility,
  TouchApp,
} from '@mui/icons-material'
import { useTranslation } from 'react-i18next'
import { useSiri } from '../hooks/useSiri'
import { SiriShortcut, SiriCategory } from '../types/siriTypes'

export const SiriDashboard: React.FC = () => {
  const { t } = useTranslation()
  const siri = useSiri()
  const [activeTab, setActiveTab] = useState(0)
  const [shortcutDialogOpen, setShortcutDialogOpen] = useState(false)
  const [testDialogOpen, setTestDialogOpen] = useState(false)
  const [settingsDialogOpen, setSettingsDialogOpen] = useState(false)
  const [testInput, setTestInput] = useState('')
  const [newShortcut, setNewShortcut] = useState({
    title: '',
    phrase: '',
    description: '',
    category: 'quick_actions' as SiriCategory
  })

  const handleCreateShortcut = async () => {
    if (!newShortcut.title || !newShortcut.phrase) return

    const success = await siri.shortcuts.createShortcut({
      ...newShortcut,
      parameters: [],
      isEnabled: true
    })

    if (success) {
      setShortcutDialogOpen(false)
      setNewShortcut({
        title: '',
        phrase: '',
        description: '',
        category: 'quick_actions'
      })
    }
  }

  const handleTestTextInput = async () => {
    if (!testInput.trim()) return

    await siri.voiceInteraction.processTextInput(testInput)
    setTestInput('')
  }

  const renderOverview = () => (
    <Grid container spacing={3}>
      {/* Status Card */}
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              <RecordVoiceOver sx={{ mr: 1, verticalAlign: 'middle' }} />
              סטטוס Siri
            </Typography>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              {siri.isSupported ? (
                <CheckCircle color="success" />
              ) : (
                <Error color="error" />
              )}
              <Typography>
                {siri.isSupported ? 'Siri זמין' : 'Siri לא זמין'}
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
              {siri.configuration.configuration?.isEnabled && (
                <Chip label="מופעל" color="success" size="small" />
              )}
              {siri.voiceInteraction.isListening && (
                <Chip label="מאזין" color="info" size="small" />
              )}
              {siri.voiceInteraction.isProcessing && (
                <Chip label="מעבד" color="warning" size="small" />
              )}
            </Box>

            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant={siri.voiceInteraction.isListening ? "contained" : "outlined"}
                color={siri.voiceInteraction.isListening ? "error" : "primary"}
                startIcon={siri.voiceInteraction.isListening ? <MicOff /> : <Mic />}
                onClick={siri.voiceInteraction.isListening ? 
                  siri.voiceInteraction.stopListening : 
                  siri.voiceInteraction.startListening
                }
                disabled={!siri.isSupported}
              >
                {siri.voiceInteraction.isListening ? 'עצור האזנה' : 'התחל האזנה'}
              </Button>
              
              <Button
                variant="outlined"
                startIcon={<VoiceChat />}
                onClick={() => setTestDialogOpen(true)}
              >
                בדיקת טקסט
              </Button>
            </Box>

            {siri.voiceInteraction.error && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {siri.voiceInteraction.error}
              </Alert>
            )}

            {siri.voiceInteraction.lastResponse && (
              <Alert severity="info" sx={{ mt: 2 }}>
                <Typography variant="subtitle2">תגובה אחרונה:</Typography>
                <Typography variant="body2">
                  {siri.voiceInteraction.lastResponse.text}
                </Typography>
              </Alert>
            )}
          </CardContent>
        </Card>
      </Grid>

      {/* Analytics Card */}
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">
                <Assessment sx={{ mr: 1, verticalAlign: 'middle' }} />
                נתוני שימוש
              </Typography>
              <IconButton onClick={siri.analytics.refresh}>
                <Refresh />
              </IconButton>
            </Box>

            {siri.analytics.analytics && (
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4">
                      {siri.analytics.analytics.totalInvocations}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      סה"כ פניות
                    </Typography>
                  </Box>
                </Grid>
                
                <Grid item xs={6}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4">
                      {siri.analytics.analytics.successfulResponses}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      תגובות מוצלחות
                    </Typography>
                  </Box>
                </Grid>
                
                <Grid item xs={6}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4">
                      {Math.round(siri.analytics.analytics.averageResponseTime / 1000)}s
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      זמן תגובה ממוצע
                    </Typography>
                  </Box>
                </Grid>
                
                <Grid item xs={6}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4">
                      {siri.shortcuts.shortcuts.filter(s => s.isEnabled).length}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      קיצורי דרך פעילים
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            )}
          </CardContent>
        </Card>
      </Grid>

      {/* Quick Actions */}
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              בדיקות מהירות
            </Typography>
            
            <Grid container spacing={2}>
              {[
                { phrase: 'מה המצב', description: 'בדיקת סטטוס כללי' },
                { phrase: 'חפש חוזים', description: 'חיפוש חוזים' },
                { phrase: 'בדוק מועדים', description: 'בדיקת מועדים' },
                { phrase: 'קבע פגישה', description: 'קביעת פגישה' }
              ].map((test, index) => (
                <Grid item xs={12} sm={6} md={3} key={index}>
                  <Paper
                    sx={{
                      p: 2,
                      textAlign: 'center',
                      cursor: 'pointer',
                      '&:hover': {
                        bgcolor: 'action.hover'
                      }
                    }}
                    onClick={() => siri.voiceInteraction.processTextInput(test.phrase)}
                  >
                    <TouchApp sx={{ fontSize: 40, mb: 1, color: 'primary.main' }} />
                    <Typography variant="subtitle2" gutterBottom>
                      "{test.phrase}"
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {test.description}
                    </Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )

  const renderShortcuts = () => (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">קיצורי דרך Siri</Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setShortcutDialogOpen(true)}
          >
            הוסף קיצור דרך
          </Button>
        </Box>

        {siri.shortcuts.isLoading && <LinearProgress sx={{ mb: 2 }} />}

        <List>
          {siri.shortcuts.shortcuts.map((shortcut) => (
            <React.Fragment key={shortcut.id}>
              <ListItem>
                <ListItemIcon>
                  <SmartToy color={shortcut.isEnabled ? 'primary' : 'disabled'} />
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="subtitle1">{shortcut.title}</Typography>
                      <Chip
                        label={shortcut.category}
                        size="small"
                        variant="outlined"
                      />
                    </Box>
                  }
                  secondary={
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        ביטוי: "{shortcut.phrase}"
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {shortcut.description}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        שימוש: {shortcut.usageCount} פעמים
                        {shortcut.lastUsed > 0 && (
                          ` • אחרון: ${new Date(shortcut.lastUsed).toLocaleDateString('he-IL')}`
                        )}
                      </Typography>
                    </Box>
                  }
                />
                <ListItemSecondaryAction>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Switch
                      checked={shortcut.isEnabled}
                      onChange={(e) => siri.shortcuts.updateShortcut(shortcut.id, {
                        isEnabled: e.target.checked
                      })}
                      size="small"
                    />
                    <IconButton
                      size="small"
                      onClick={() => siri.shortcuts.deleteShortcut(shortcut.id)}
                    >
                      <Delete />
                    </IconButton>
                  </Box>
                </ListItemSecondaryAction>
              </ListItem>
              <Divider />
            </React.Fragment>
          ))}
        </List>

        {siri.shortcuts.shortcuts.length === 0 && (
          <Alert severity="info">
            עדיין לא נוצרו קיצורי דרך. לחץ על "הוסף קיצור דרך" כדי להתחיל.
          </Alert>
        )}
      </CardContent>
    </Card>
  )

  const renderSettings = () => (
    <Grid container spacing={3}>
      {/* Voice Settings */}
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              <VolumeUp sx={{ mr: 1, verticalAlign: 'middle' }} />
              הגדרות קול
            </Typography>

            {siri.configuration.configuration && (
              <Box>
                <FormControlLabel
                  control={
                    <Switch
                      checked={siri.configuration.configuration.voiceSettings.enabled}
                      onChange={(e) => siri.configuration.updateVoiceSettings({
                        enabled: e.target.checked
                      })}
                    />
                  }
                  label="תגובות קוליות"
                />

                <Box sx={{ mt: 2 }}>
                  <Typography gutterBottom>מהירות דיבור</Typography>
                  <Slider
                    value={siri.configuration.configuration.voiceSettings.rate}
                    min={0.5}
                    max={2}
                    step={0.1}
                    marks
                    valueLabelDisplay="auto"
                    onChange={(_, value) => siri.configuration.updateVoiceSettings({
                      rate: value as number
                    })}
                  />
                </Box>

                <Box sx={{ mt: 2 }}>
                  <Typography gutterBottom>גובה קול</Typography>
                  <Slider
                    value={siri.configuration.configuration.voiceSettings.pitch}
                    min={0.5}
                    max={2}
                    step={0.1}
                    marks
                    valueLabelDisplay="auto"
                    onChange={(_, value) => siri.configuration.updateVoiceSettings({
                      pitch: value as number
                    })}
                  />
                </Box>

                <Box sx={{ mt: 2 }}>
                  <Typography gutterBottom>עוצמת קול</Typography>
                  <Slider
                    value={siri.configuration.configuration.voiceSettings.volume}
                    min={0}
                    max={1}
                    step={0.1}
                    marks
                    valueLabelDisplay="auto"
                    onChange={(_, value) => siri.configuration.updateVoiceSettings({
                      volume: value as number
                    })}
                  />
                </Box>

                <Box sx={{ mt: 2 }}>
                  <FormControl fullWidth>
                    <InputLabel>שפה</InputLabel>
                    <Select
                      value={siri.configuration.configuration.voiceSettings.language}
                      onChange={(e) => siri.configuration.updateVoiceSettings({
                        language: e.target.value
                      })}
                    >
                      <MenuItem value="he-IL">עברית</MenuItem>
                      <MenuItem value="en-US">English</MenuItem>
                      <MenuItem value="ar-SA">العربية</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              </Box>
            )}
          </CardContent>
        </Card>
      </Grid>

      {/* Accessibility Settings */}
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              <Accessibility sx={{ mr: 1, verticalAlign: 'middle' }} />
              הגדרות נגישות
            </Typography>

            {siri.configuration.configuration && (
              <Box>
                <FormControlLabel
                  control={
                    <Switch
                      checked={siri.configuration.configuration.accessibilitySettings.announceNotifications}
                      onChange={(e) => siri.configuration.updateAccessibilitySettings({
                        announceNotifications: e.target.checked
                      })}
                    />
                  }
                  label="הכרזה על התראות"
                />

                <FormControlLabel
                  control={
                    <Switch
                      checked={siri.configuration.configuration.accessibilitySettings.confirmActions}
                      onChange={(e) => siri.configuration.updateAccessibilitySettings({
                        confirmActions: e.target.checked
                      })}
                    />
                  }
                  label="אישור פעולות"
                />

                <FormControlLabel
                  control={
                    <Switch
                      checked={siri.configuration.configuration.accessibilitySettings.verboseMode}
                      onChange={(e) => siri.configuration.updateAccessibilitySettings({
                        verboseMode: e.target.checked
                      })}
                    />
                  }
                  label="מצב מפורט"
                />

                <FormControlLabel
                  control={
                    <Switch
                      checked={siri.configuration.configuration.accessibilitySettings.shortcuts}
                      onChange={(e) => siri.configuration.updateAccessibilitySettings({
                        shortcuts: e.target.checked
                      })}
                    />
                  }
                  label="קיצורי דרך נגישים"
                />
              </Box>
            )}
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )

  const categories = [
    { value: 'contract_management', label: 'ניהול חוזים' },
    { value: 'legal_search', label: 'חיפוש משפטי' },
    { value: 'meeting_management', label: 'ניהול פגישות' },
    { value: 'document_review', label: 'סקירת מסמכים' },
    { value: 'client_communication', label: 'תקשורת לקוחות' },
    { value: 'risk_assessment', label: 'הערכת סיכונים' },
    { value: 'quick_actions', label: 'פעולות מהירות' }
  ]

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Siri Integration Dashboard
      </Typography>

      <Tabs value={activeTab} onChange={(_, newValue) => setActiveTab(newValue)} sx={{ mb: 3 }}>
        <Tab label="סקירה כללית" />
        <Tab label="קיצורי דרך" />
        <Tab label="הגדרות" />
      </Tabs>

      {activeTab === 0 && renderOverview()}
      {activeTab === 1 && renderShortcuts()}
      {activeTab === 2 && renderSettings()}

      {/* Create Shortcut Dialog */}
      <Dialog open={shortcutDialogOpen} onClose={() => setShortcutDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>יצירת קיצור דרך חדש</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="כותרת"
            value={newShortcut.title}
            onChange={(e) => setNewShortcut({ ...newShortcut, title: e.target.value })}
            margin="normal"
          />
          
          <TextField
            fullWidth
            label="ביטוי Siri"
            value={newShortcut.phrase}
            onChange={(e) => setNewShortcut({ ...newShortcut, phrase: e.target.value })}
            margin="normal"
            helperText="הביטוי שתגיד ל-Siri כדי להפעיל את הקיצור"
          />
          
          <TextField
            fullWidth
            label="תיאור"
            value={newShortcut.description}
            onChange={(e) => setNewShortcut({ ...newShortcut, description: e.target.value })}
            margin="normal"
            multiline
            rows={2}
          />
          
          <FormControl fullWidth margin="normal">
            <InputLabel>קטגוריה</InputLabel>
            <Select
              value={newShortcut.category}
              onChange={(e) => setNewShortcut({ ...newShortcut, category: e.target.value as SiriCategory })}
            >
              {categories.map((category) => (
                <MenuItem key={category.value} value={category.value}>
                  {category.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShortcutDialogOpen(false)}>ביטול</Button>
          <Button
            onClick={handleCreateShortcut}
            variant="contained"
            disabled={!newShortcut.title || !newShortcut.phrase}
          >
            צור קיצור דרך
          </Button>
        </DialogActions>
      </Dialog>

      {/* Test Dialog */}
      <Dialog open={testDialogOpen} onClose={() => setTestDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>בדיקת פקודות טקסט</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="הקלד פקודה"
            value={testInput}
            onChange={(e) => setTestInput(e.target.value)}
            margin="normal"
            placeholder='לדוגמה: "חפש חוזים" או "מה המצב"'
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleTestTextInput()
              }
            }}
          />
          
          {siri.voiceInteraction.isProcessing && (
            <Box sx={{ mt: 2 }}>
              <LinearProgress />
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                מעבד בקשה...
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setTestDialogOpen(false)}>סגור</Button>
          <Button
            onClick={handleTestTextInput}
            variant="contained"
            disabled={!testInput.trim() || siri.voiceInteraction.isProcessing}
          >
            שלח
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

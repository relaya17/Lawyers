import React, { useState } from 'react'
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Switch,
  FormControlLabel,
  Divider,
  Alert,
  Button,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Slider,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from '@mui/material'
import {
  Palette,
  Language,
  Notifications,
  Accessibility,
  Save,
  AutoAwesome,
  DarkMode,
  LightMode,
  SettingsBrightness,
} from '@mui/icons-material'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@shared/store'
import { setMode, setLanguage } from '@shared/store/slices/themeSlice'

const Preferences: React.FC = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  
  const { mode, language } = useSelector((state: RootState) => state.theme)
  
  const [preferences, setPreferences] = useState({
    autoSave: true,
    notifications: true,
    soundEffects: false,
    animations: true,
    accessibility: false,
    compactMode: false,
  })

  const [fontSize, setFontSize] = useState(16)
  const [saved, setSaved] = useState(false)

  const handlePreferenceChange = (preference: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setPreferences(prev => ({
      ...prev,
      [preference]: event.target.checked
    }))
    setSaved(false)
  }

  const handleThemeChange = (newTheme: string) => {
    dispatch(setMode(newTheme as 'light' | 'dark'))
    setSaved(false)
  }

  const handleLanguageChange = (newLanguage: string) => {
    dispatch(setLanguage(newLanguage))
    setSaved(false)
  }

  const handleSave = () => {
    // כאן יהיה לוגיקת שמירה
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const themeOptions = [
    { value: 'light', label: 'בהיר', icon: LightMode },
    { value: 'dark', label: 'כהה', icon: DarkMode },
    { value: 'auto', label: 'אוטומטי', icon: SettingsBrightness },
  ]

  const languageOptions = [
    { value: 'he', label: 'עברית' },
    { value: 'en', label: 'English' },
    { value: 'ar', label: 'العربية' },
  ]

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        העדפות
      </Typography>
      
      {saved && (
        <Alert severity="success" sx={{ mb: 3 }}>
          ההעדפות נשמרו בהצלחה!
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* עיצוב ושפה */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                עיצוב ושפה
              </Typography>
              
              <Box sx={{ mt: 3 }}>
                <FormControl fullWidth sx={{ mb: 3 }}>
                  <InputLabel>ערכת נושא</InputLabel>
                  <Select
                    value={mode}
                    label="ערכת נושא"
                    onChange={(e) => handleThemeChange(e.target.value)}
                  >
                    {themeOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <option.icon sx={{ mr: 1 }} />
                          {option.label}
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControl fullWidth sx={{ mb: 3 }}>
                  <InputLabel>שפה</InputLabel>
                  <Select
                    value={language}
                    label="שפה"
                    onChange={(e) => handleLanguageChange(e.target.value)}
                  >
                    {languageOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <Typography gutterBottom>גודל טקסט</Typography>
                <Slider
                  value={fontSize}
                  onChange={(_, value) => setFontSize(value as number)}
                  min={12}
                  max={24}
                  step={1}
                  marks
                  valueLabelDisplay="auto"
                  sx={{ mb: 3 }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* הגדרות כלליות */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                הגדרות כלליות
              </Typography>
              
              <Box sx={{ mt: 3 }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={preferences.autoSave}
                      onChange={handlePreferenceChange('autoSave')}
                    />
                  }
                  label="שמירה אוטומטית"
                  sx={{ mb: 2 }}
                />
                
                <FormControlLabel
                  control={
                    <Switch
                      checked={preferences.notifications}
                      onChange={handlePreferenceChange('notifications')}
                    />
                  }
                  label="התראות"
                  sx={{ mb: 2 }}
                />
                
                <FormControlLabel
                  control={
                    <Switch
                      checked={preferences.soundEffects}
                      onChange={handlePreferenceChange('soundEffects')}
                    />
                  }
                  label="אפקטים קוליים"
                  sx={{ mb: 2 }}
                />
                
                <FormControlLabel
                  control={
                    <Switch
                      checked={preferences.animations}
                      onChange={handlePreferenceChange('animations')}
                    />
                  }
                  label="אנימציות"
                  sx={{ mb: 2 }}
                />
                
                <FormControlLabel
                  control={
                    <Switch
                      checked={preferences.accessibility}
                      onChange={handlePreferenceChange('accessibility')}
                    />
                  }
                  label="מצב נגישות"
                  sx={{ mb: 2 }}
                />
                
                <FormControlLabel
                  control={
                    <Switch
                      checked={preferences.compactMode}
                      onChange={handlePreferenceChange('compactMode')}
                    />
                  }
                  label="מצב קומפקטי"
                  sx={{ mb: 2 }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* תכונות מתקדמות */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                תכונות מתקדמות
              </Typography>
              
              <List>
                <ListItem>
                  <ListItemIcon>
                    <AutoAwesome color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary="AI Assistant"
                    secondary="עוזר בינה מלאכותית לניתוח חוזים"
                  />
                  <Chip label="פעיל" color="success" size="small" />
                </ListItem>
                
                <ListItem>
                  <ListItemIcon>
                    <Notifications color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary="התראות בזמן אמת"
                    secondary="קבלת עדכונים מיידיים על שינויים"
                  />
                  <Chip label="פעיל" color="success" size="small" />
                </ListItem>
                
                <ListItem>
                  <ListItemIcon>
                    <Accessibility color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary="ניתוח ביצועים"
                    secondary="מעקב אחר ביצועי האפליקציה"
                  />
                  <Chip label="פעיל" color="success" size="small" />
                </ListItem>
              </List>
              
              <Divider sx={{ my: 3 }} />
              
              <Button
                variant="contained"
                startIcon={<Save />}
                onClick={handleSave}
                sx={{ mt: 2 }}
              >
                שמור העדפות
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  )
}

export default Preferences

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
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
} from '@mui/material'
import {
  Security,
  Visibility,
  VisibilityOff,
  DataUsage,
  Notifications,
  LocationOn,
  Analytics,
  Save,
} from '@mui/icons-material'
import { useTranslation } from 'react-i18next'

const Privacy: React.FC = () => {
  const { t } = useTranslation()
  const [settings, setSettings] = useState({
    dataCollection: true,
    analytics: true,
    notifications: true,
    location: false,
    thirdParty: false,
    marketing: false,
  })

  const [saved, setSaved] = useState(false)

  const handleSettingChange = (setting: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setSettings(prev => ({
      ...prev,
      [setting]: event.target.checked
    }))
    setSaved(false)
  }

  const handleSave = () => {
    // כאן יהיה לוגיקת שמירה
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const privacyFeatures = [
    {
      title: 'אבטחת נתונים',
      description: 'כל הנתונים שלך מוצפנים ומאובטחים',
      icon: Security,
      status: 'active',
    },
    {
      title: 'שקיפות מלאה',
      description: 'אתה יכול לראות איזה נתונים נאספים',
      icon: Visibility,
      status: 'active',
    },
    {
      title: 'מחיקת נתונים',
      description: 'אתה יכול למחוק את כל הנתונים שלך בכל עת',
      icon: DataUsage,
      status: 'active',
    },
  ]

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        הגדרות פרטיות
      </Typography>
      
      {saved && (
        <Alert severity="success" sx={{ mb: 3 }}>
          ההגדרות נשמרו בהצלחה!
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* הגדרות פרטיות */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                הגדרות פרטיות
              </Typography>
              
              <Box sx={{ mt: 3 }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.dataCollection}
                      onChange={handleSettingChange('dataCollection')}
                    />
                  }
                  label="איסוף נתונים לשיפור השירות"
                  sx={{ mb: 2 }}
                />
                
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.analytics}
                      onChange={handleSettingChange('analytics')}
                    />
                  }
                  label="ניתוח שימוש באפליקציה"
                  sx={{ mb: 2 }}
                />
                
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.notifications}
                      onChange={handleSettingChange('notifications')}
                    />
                  }
                  label="התראות push"
                  sx={{ mb: 2 }}
                />
                
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.location}
                      onChange={handleSettingChange('location')}
                    />
                  }
                  label="גישה למיקום"
                  sx={{ mb: 2 }}
                />
                
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.thirdParty}
                      onChange={handleSettingChange('thirdParty')}
                    />
                  }
                  label="שיתוף עם צדדים שלישיים"
                  sx={{ mb: 2 }}
                />
                
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.marketing}
                      onChange={handleSettingChange('marketing')}
                    />
                  }
                  label="אישור לפרסום ושיווק"
                  sx={{ mb: 2 }}
                />
              </Box>
              
              <Divider sx={{ my: 3 }} />
              
              <Button
                variant="contained"
                startIcon={<Save />}
                onClick={handleSave}
                sx={{ mt: 2 }}
              >
                שמור הגדרות
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* תכונות פרטיות */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                תכונות פרטיות
              </Typography>
              
              <List>
                {privacyFeatures.map((feature, index) => (
                  <ListItem key={index} sx={{ px: 0 }}>
                    <ListItemIcon>
                      <feature.icon color="primary" />
                    </ListItemIcon>
                    <ListItemText
                      primary={feature.title}
                      secondary={feature.description}
                    />
                    <Chip
                      label={feature.status === 'active' ? 'פעיל' : 'לא פעיל'}
                      color={feature.status === 'active' ? 'success' : 'default'}
                      size="small"
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* מדיניות פרטיות */}
      <Card sx={{ mt: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            מדיניות פרטיות
          </Typography>
          
          <Typography variant="body2" color="text.secondary" paragraph>
            אנו מחויבים להגן על הפרטיות שלך. מדיניות הפרטיות שלנו מסבירה כיצד אנו אוספים, 
            משתמשים ומגנים על המידע שלך.
          </Typography>
          
          <Box sx={{ mt: 2 }}>
            <Button variant="outlined" sx={{ mr: 2 }}>
              קרא מדיניות פרטיות
            </Button>
            <Button variant="outlined">
              הורד נתונים שלי
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Container>
  )
}

export default Privacy

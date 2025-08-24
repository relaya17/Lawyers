import React, { useState } from 'react'
import { 
  Box, 
  Container, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  Avatar, 
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemAvatar,
  Divider,
  Chip,
  IconButton,
  Switch,
  FormControlLabel,
  Alert,
  LinearProgress,
  Paper
} from '@mui/material'
import { 
  Edit, 
  Person, 
  Settings,
  Security,
  Notifications,
  Language,
  Palette,
  Save,
  Cancel,
  Email,
  Phone,
  Business,
  LocationOn,
  CalendarToday,
  TrendingUp,
  Assessment,
  Handshake,
  Store,
  Visibility,
  VisibilityOff,
  Lock,
  NotificationsActive,
  NotificationsOff
} from '@mui/icons-material'
import { useTranslation } from 'react-i18next'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '@shared/store'

interface UserProfile {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  company: string
  position: string
  location: string
  avatar: string
  joinDate: string
  lastLogin: string
  preferences: {
    language: string
    theme: 'light' | 'dark'
    notifications: {
      email: boolean
      push: boolean
      sms: boolean
    }
    privacy: {
      profileVisibility: 'public' | 'private'
      activityVisibility: 'public' | 'private'
    }
  }
}

interface Activity {
  id: string
  type: 'contract_analysis' | 'simulation' | 'negotiation' | 'template_download'
  title: string
  description: string
  timestamp: string
  icon: React.ReactNode
  color: string
}

export const ProfilePage: React.FC = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const [activeTab, setActiveTab] = useState(0)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showSettingsDialog, setShowSettingsDialog] = useState(false)
  const [showPasswordDialog, setShowPasswordDialog] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  // Mock user data
  const userProfile: UserProfile = {
    id: '1',
    firstName: 'יוסי',
    lastName: 'כהן',
    email: 'yossi@example.com',
    phone: '+972-50-123-4567',
    company: 'משרד עו״ד כהן ושות׳',
    position: 'עורך דין בכיר',
    location: 'תל אביב, ישראל',
    avatar: '',
    joinDate: '2023-01-15',
    lastLogin: '2024-01-20T10:30:00',
    preferences: {
      language: 'he',
      theme: 'light',
      notifications: {
        email: true,
        push: true,
        sms: false
      },
      privacy: {
        profileVisibility: 'public',
        activityVisibility: 'private'
      }
    }
  }

  const [profile, setProfile] = useState<UserProfile>(userProfile)
  const [editForm, setEditForm] = useState(userProfile)

  // Mock activity data
  const activities: Activity[] = [
    {
      id: '1',
      type: 'contract_analysis',
      title: 'ניתוח חוזה שכירות',
      description: 'ניתחת חוזה שכירות דירה - רמת סיכון: בינונית',
      timestamp: '2024-01-20T09:15:00',
      icon: <Assessment />,
      color: 'primary'
    },
    {
      id: '2',
      type: 'simulation',
      title: 'השלמת סימולציה',
      description: 'השלמת סימולציה "ניתוח חוזה שכירות" - ציון: 85%',
      timestamp: '2024-01-19T14:30:00',
      icon: <TrendingUp />,
      color: 'success'
    },
    {
      id: '3',
      type: 'negotiation',
      title: 'מו״מ חדש',
      description: 'התחלת מו״מ על חוזה שכירות דירה',
      timestamp: '2024-01-18T11:45:00',
      icon: <Handshake />,
      color: 'warning'
    },
    {
      id: '4',
      type: 'template_download',
      title: 'הורדת תבנית',
      description: 'הורדת תבנית "חוזה שכירות דירה מקיף"',
      timestamp: '2024-01-17T16:20:00',
      icon: <Store />,
      color: 'info'
    }
  ]

  const stats = {
    contractsAnalyzed: 25,
    simulationsCompleted: 15,
    activeNegotiations: 8,
    averageScore: 92,
    templatesDownloaded: 12,
    totalActivity: 156
  }

  const handleEditProfile = () => {
    setEditForm(profile)
    setShowEditDialog(true)
  }

  const handleSaveProfile = () => {
    setProfile(editForm)
    setShowEditDialog(false)
  }

  const handleCancelEdit = () => {
    setEditForm(profile)
    setShowEditDialog(false)
  }

  const handleInputChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setEditForm(prev => ({
      ...prev,
      [field]: event.target.value
    }))
  }

  const handlePreferenceChange = (section: string, field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setProfile(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [section]: {
          ...(prev.preferences as any)[section],
          [field]: event.target.checked
        }
      }
    }))
  }

  const getActivityIcon = (activity: Activity) => {
    return React.cloneElement(activity.icon as React.ReactElement, {
      sx: { color: `${activity.color}.main` }
    })
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h4" component="h1">
            {t('navigation.profile')}
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant="outlined"
              startIcon={<Settings />}
              onClick={() => setShowSettingsDialog(true)}
            >
              הגדרות
            </Button>
            <Button
              variant="contained"
              startIcon={<Edit />}
              onClick={handleEditProfile}
            >
              ערוך פרופיל
            </Button>
          </Box>
        </Box>

        <Grid container spacing={3}>
          {/* Profile Card */}
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Avatar
                  sx={{ width: 120, height: 120, mx: 'auto', mb: 2, fontSize: 60 }}
                >
                  {profile.avatar ? (
                    <img src={profile.avatar} alt="Profile" />
                  ) : (
                    <Person />
                  )}
                </Avatar>
                
                <Typography variant="h5" gutterBottom>
                  {profile.firstName} {profile.lastName}
                </Typography>
                
                <Typography variant="body1" color="text.secondary" gutterBottom>
                  {profile.position}
                </Typography>
                
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {profile.company}
                </Typography>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                    <Email fontSize="small" color="action" />
                    <Typography variant="body2">{profile.email}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                    <Phone fontSize="small" color="action" />
                    <Typography variant="body2">{profile.phone}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                    <LocationOn fontSize="small" color="action" />
                    <Typography variant="body2">{profile.location}</Typography>
                  </Box>
                </Box>

                <Divider sx={{ my: 2 }} />

                <Box sx={{ textAlign: 'left' }}>
                  <Typography variant="body2" color="text.secondary">
                    <CalendarToday fontSize="small" sx={{ mr: 1, verticalAlign: 'middle' }} />
                    הצטרף: {new Date(profile.joinDate).toLocaleDateString('he-IL')}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    כניסה אחרונה: {new Date(profile.lastLogin).toLocaleString('he-IL')}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          {/* Main Content */}
          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <Tabs value={activeTab} onChange={(_, newValue) => setActiveTab(newValue)} sx={{ mb: 3 }}>
                  <Tab label="סטטיסטיקות" />
                  <Tab label="פעילות אחרונה" />
                  <Tab label="הישגים" />
                </Tabs>

                {activeTab === 0 && (
                  <Grid container spacing={3}>
                    <Grid item xs={6} sm={3}>
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h4" color="primary" fontWeight="bold">
                          {stats.contractsAnalyzed}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          חוזים נותחו
                        </Typography>
                      </Box>
                    </Grid>
                    
                    <Grid item xs={6} sm={3}>
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h4" color="success.main" fontWeight="bold">
                          {stats.simulationsCompleted}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          סימולציות הושלמו
                        </Typography>
                      </Box>
                    </Grid>
                    
                    <Grid item xs={6} sm={3}>
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h4" color="warning.main" fontWeight="bold">
                          {stats.activeNegotiations}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          מו״מים פעילים
                        </Typography>
                      </Box>
                    </Grid>
                    
                    <Grid item xs={6} sm={3}>
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h4" color="info.main" fontWeight="bold">
                          {stats.averageScore}%
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          ממוצע ציונים
                        </Typography>
                      </Box>
                    </Grid>

                    <Grid item xs={12}>
                      <Divider sx={{ my: 2 }} />
                      <Typography variant="h6" gutterBottom>
                        התקדמות למידה
                      </Typography>
                      <Box sx={{ mb: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography variant="body2">סימולציות</Typography>
                          <Typography variant="body2">{stats.simulationsCompleted}/20</Typography>
                        </Box>
                        <LinearProgress 
                          variant="determinate" 
                          value={(stats.simulationsCompleted / 20) * 100} 
                          sx={{ height: 8, borderRadius: 4 }}
                        />
                      </Box>
                      <Box sx={{ mb: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography variant="body2">ניתוח חוזים</Typography>
                          <Typography variant="body2">{stats.contractsAnalyzed}/50</Typography>
                        </Box>
                        <LinearProgress 
                          variant="determinate" 
                          value={(stats.contractsAnalyzed / 50) * 100} 
                          sx={{ height: 8, borderRadius: 4 }}
                        />
                      </Box>
                    </Grid>
                  </Grid>
                )}

                {activeTab === 1 && (
                  <List>
                    {activities.map((activity, index) => (
                      <React.Fragment key={activity.id}>
                        <ListItem alignItems="flex-start">
                          <ListItemAvatar>
                            <Avatar sx={{ bgcolor: `${activity.color}.light` }}>
                              {getActivityIcon(activity)}
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText
                            primary={activity.title}
                            secondary={
                              <>
                                <Typography variant="body2" color="text.secondary">
                                  {activity.description}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  {new Date(activity.timestamp).toLocaleString('he-IL')}
                                </Typography>
                              </>
                            }
                          />
                        </ListItem>
                        {index < activities.length - 1 && <Divider variant="inset" component="li" />}
                      </React.Fragment>
                    ))}
                  </List>
                )}

                {activeTab === 2 && (
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Card variant="outlined">
                        <CardContent>
                          <Typography variant="h6" gutterBottom>
                            תגיות הושגו
                          </Typography>
                          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                            <Chip label="מנתח חוזים" color="primary" />
                            <Chip label="מנהל מו״מ" color="success" />
                            <Chip label="לומד מתמיד" color="warning" />
                            <Chip label="משתמש פעיל" color="info" />
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Card variant="outlined">
                        <CardContent>
                          <Typography variant="h6" gutterBottom>
                            הישגים מיוחדים
                          </Typography>
                          <List dense>
                            <ListItem>
                              <ListItemIcon>
                                <TrendingUp color="success" />
                              </ListItemIcon>
                              <ListItemText 
                                primary="מנתח חוזים מומחה"
                                secondary="ניתחת 25+ חוזים"
                              />
                            </ListItem>
                            <ListItem>
                              <ListItemIcon>
                                <Assessment color="primary" />
                              </ListItemIcon>
                              <ListItemText 
                                primary="לומד מצטיין"
                                secondary="ממוצע ציונים 92%"
                              />
                            </ListItem>
                          </List>
                        </CardContent>
                      </Card>
                    </Grid>
                  </Grid>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Edit Profile Dialog */}
        <Dialog open={showEditDialog} onClose={handleCancelEdit} maxWidth="sm" fullWidth>
          <DialogTitle>ערוך פרופיל</DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="שם פרטי"
                  value={editForm.firstName}
                  onChange={handleInputChange('firstName')}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="שם משפחה"
                  value={editForm.lastName}
                  onChange={handleInputChange('lastName')}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="אימייל"
                  type="email"
                  value={editForm.email}
                  onChange={handleInputChange('email')}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="טלפון"
                  value={editForm.phone}
                  onChange={handleInputChange('phone')}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="חברה"
                  value={editForm.company}
                  onChange={handleInputChange('company')}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="תפקיד"
                  value={editForm.position}
                  onChange={handleInputChange('position')}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="מיקום"
                  value={editForm.location}
                  onChange={handleInputChange('location')}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCancelEdit}>
              ביטול
            </Button>
            <Button onClick={handleSaveProfile} variant="contained">
              שמור
            </Button>
          </DialogActions>
        </Dialog>

        {/* Settings Dialog */}
        <Dialog open={showSettingsDialog} onClose={() => setShowSettingsDialog(false)} maxWidth="md" fullWidth>
          <DialogTitle>הגדרות</DialogTitle>
          <DialogContent>
            <Tabs value={0} sx={{ mb: 3 }}>
              <Tab label="הגדרות כלליות" />
              <Tab label="הגדרות פרטיות" />
              <Tab label="הגדרות התראות" />
            </Tabs>

            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>
                  הגדרות שפה ועיצוב
                </Typography>
                <FormControlLabel
                  control={
                    <Switch
                      checked={profile.preferences.theme === 'dark'}
                      onChange={(e) => {
                        setProfile(prev => ({
                          ...prev,
                          preferences: {
                            ...prev.preferences,
                            theme: e.target.checked ? 'dark' : 'light'
                          }
                        }))
                      }}
                    />
                  }
                  label="מצב כהה"
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>
                  הגדרות התראות
                </Typography>
                <FormControlLabel
                  control={
                    <Switch
                      checked={profile.preferences.notifications.email}
                      onChange={handlePreferenceChange('notifications', 'email')}
                    />
                  }
                  label="התראות אימייל"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={profile.preferences.notifications.push}
                      onChange={handlePreferenceChange('notifications', 'push')}
                    />
                  }
                  label="התראות דחיפה"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={profile.preferences.notifications.sms}
                      onChange={handlePreferenceChange('notifications', 'sms')}
                    />
                  }
                  label="התראות SMS"
                />
              </Grid>

              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  הגדרות פרטיות
                </Typography>
                <FormControlLabel
                  control={
                    <Switch
                      checked={profile.preferences.privacy.profileVisibility === 'public'}
                      onChange={(e) => {
                        setProfile(prev => ({
                          ...prev,
                          preferences: {
                            ...prev.preferences,
                            privacy: {
                              ...prev.preferences.privacy,
                              profileVisibility: e.target.checked ? 'public' : 'private'
                            }
                          }
                        }))
                      }}
                    />
                  }
                  label="פרופיל ציבורי"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={profile.preferences.privacy.activityVisibility === 'public'}
                      onChange={(e) => {
                        setProfile(prev => ({
                          ...prev,
                          preferences: {
                            ...prev.preferences,
                            privacy: {
                              ...prev.preferences.privacy,
                              activityVisibility: e.target.checked ? 'public' : 'private'
                            }
                          }
                        }))
                      }}
                    />
                  }
                  label="פעילות ציבורית"
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowSettingsDialog(false)}>
              סגור
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Container>
  )
}

import React, { useState } from 'react'
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Avatar,
  Button,
  Grid,
  TextField,
  Divider,
  Alert,
  IconButton,
  Badge,
} from '@mui/material'
import {
  Edit,
  Save,
  Cancel,
  PhotoCamera,
  Person,
  Email,
  Phone,
  Business,
  LocationOn,
} from '@mui/icons-material'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '@shared/store'

interface UserProfile {
  name: string
  email: string
  phone: string
  company: string
  position: string
  address: string
  bio: string
  avatar?: string
}

const ProfileSettings: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth)
  const dispatch = useDispatch()
  
  const [editing, setEditing] = useState(false)
  const [saved, setSaved] = useState(false)
  const [profile, setProfile] = useState<UserProfile>({
    name: user ? `${user.firstName} ${user.lastName}` : '',
    email: user?.email || '',
    phone: user?.phone || '',
    company: '',
    position: '',
    address: '',
    bio: '',
    avatar: user?.avatar || '',
  })

  const handleEditToggle = () => {
    setEditing(!editing)
    if (editing) {
      // Reset to original values if canceling
      setProfile({
        name: user ? `${user.firstName} ${user.lastName}` : '',
        email: user?.email || '',
        phone: user?.phone || '',
        company: '',
        position: '',
        address: '',
        bio: '',
        avatar: user?.avatar || '',
      })
    }
  }

  const handleSave = () => {
    // כאן יהיה לוגיקת שמירה
    setEditing(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const handleInputChange = (field: keyof UserProfile) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setProfile(prev => ({
      ...prev,
      [field]: event.target.value
    }))
  }

  const handleAvatarChange = () => {
    // כאן יהיה לוגיקת העלאת תמונה
    console.log('Upload avatar')
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        פרופיל משתמש
      </Typography>
      
      {saved && (
        <Alert severity="success" sx={{ mb: 3 }}>
          הפרופיל נשמר בהצלחה!
        </Alert>
      )}

      <Card>
        <CardContent>
          {/* Header with avatar and basic info */}
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
            <Badge
              overlap="circular"
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              badgeContent={
                editing ? (
                  <IconButton
                    color="primary"
                    aria-label="upload picture"
                    component="label"
                    size="small"
                    onClick={handleAvatarChange}
                    sx={{
                      backgroundColor: 'background.paper',
                      '&:hover': {
                        backgroundColor: 'grey.100',
                      },
                    }}
                  >
                    <PhotoCamera fontSize="small" />
                  </IconButton>
                ) : null
              }
            >
              <Avatar
                src={profile.avatar}
                alt={profile.name}
                sx={{ width: 100, height: 100, mr: 3 }}
              >
                {profile.name.charAt(0)}
              </Avatar>
            </Badge>
            
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="h5" gutterBottom>
                {profile.name || 'שם משתמש'}
              </Typography>
              <Typography variant="body1" color="text.secondary" gutterBottom>
                {profile.position || 'תפקיד'} • {profile.company || 'חברה'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {profile.email}
              </Typography>
            </Box>
            
            <Button
              variant={editing ? "outlined" : "contained"}
              startIcon={editing ? <Cancel /> : <Edit />}
              onClick={handleEditToggle}
            >
              {editing ? 'ביטול' : 'עריכה'}
            </Button>
            
            {editing && (
              <Button
                variant="contained"
                startIcon={<Save />}
                onClick={handleSave}
                sx={{ ml: 1 }}
              >
                שמירה
              </Button>
            )}
          </Box>

          <Divider sx={{ mb: 3 }} />

          {/* Profile form */}
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="שם מלא"
                value={profile.name}
                onChange={handleInputChange('name')}
                disabled={!editing}
                InputProps={{
                  startAdornment: <Person sx={{ mr: 1, color: 'text.secondary' }} />,
                }}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="אימייל"
                type="email"
                value={profile.email}
                onChange={handleInputChange('email')}
                disabled={!editing}
                InputProps={{
                  startAdornment: <Email sx={{ mr: 1, color: 'text.secondary' }} />,
                }}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="טלפון"
                value={profile.phone}
                onChange={handleInputChange('phone')}
                disabled={!editing}
                InputProps={{
                  startAdornment: <Phone sx={{ mr: 1, color: 'text.secondary' }} />,
                }}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="חברה"
                value={profile.company}
                onChange={handleInputChange('company')}
                disabled={!editing}
                InputProps={{
                  startAdornment: <Business sx={{ mr: 1, color: 'text.secondary' }} />,
                }}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="תפקיד"
                value={profile.position}
                onChange={handleInputChange('position')}
                disabled={!editing}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="כתובת"
                value={profile.address}
                onChange={handleInputChange('address')}
                disabled={!editing}
                InputProps={{
                  startAdornment: <LocationOn sx={{ mr: 1, color: 'text.secondary' }} />,
                }}
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="אודות"
                multiline
                rows={4}
                value={profile.bio}
                onChange={handleInputChange('bio')}
                disabled={!editing}
                placeholder="ספר על עצמך..."
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Container>
  )
}

export default ProfileSettings

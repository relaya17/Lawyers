import React, { useState } from 'react'
import { Box, Container, Typography, TextField, Button, Card, CardContent, Link, Alert, CircularProgress, Grid } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { register } from '@shared/store/slices/authSlice'
import { RootState } from '@shared/store'

export const RegisterPage: React.FC = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  
  const { isLoading: loading, error } = useSelector((state: RootState) => state.auth)
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    company: '',
  })
  
  const [validationErrors, setValidationErrors] = useState<{
    firstName?: string
    lastName?: string
    email?: string
    password?: string
    confirmPassword?: string
    phone?: string
    company?: string
  }>({})

  const validateForm = () => {
    const errors: typeof validationErrors = {}
    
    if (!formData.firstName) {
      errors.firstName = t('validation.required')
    }
    
    if (!formData.lastName) {
      errors.lastName = t('validation.required')
    }
    
    if (!formData.email) {
      errors.email = t('validation.required')
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = t('validation.email')
    }
    
    if (!formData.password) {
      errors.password = t('validation.required')
    } else if (formData.password.length < 8) {
      errors.password = t('validation.passwordMin')
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      errors.password = t('validation.passwordComplex')
    }
    
    if (!formData.confirmPassword) {
      errors.confirmPassword = t('validation.required')
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = t('validation.passwordMatch')
    }
    
    if (formData.phone && !/^[+]?[1-9][0-9]{0,15}$/.test(formData.phone)) {
      errors.phone = t('validation.phone')
    }
    
    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleInputChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value
    }))
    
    // Clear validation error when user starts typing
    if (validationErrors[field as keyof typeof validationErrors]) {
      setValidationErrors(prev => ({
        ...prev,
        [field]: undefined
      }))
    }
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    
    if (!validateForm()) {
      return
    }
    
    try {
      await dispatch(register(formData) as any)
      navigate('/dashboard')
    } catch (error) {
      console.error('Registration failed:', error)
    }
  }

  return (
    <Container maxWidth="md">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          py: 4,
        }}
      >
        <Card sx={{ width: '100%', maxWidth: 600 }}>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom textAlign="center">
              {t('auth.register')}
            </Typography>
            
            <Typography variant="body2" color="text.secondary" textAlign="center" paragraph>
              {t('auth.registerSubtitle')}
            </Typography>
            
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}
            
            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label={t('auth.firstName')}
                    margin="normal"
                    required
                    value={formData.firstName}
                    onChange={handleInputChange('firstName')}
                    error={!!validationErrors.firstName}
                    helperText={validationErrors.firstName}
                    disabled={loading}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label={t('auth.lastName')}
                    margin="normal"
                    required
                    value={formData.lastName}
                    onChange={handleInputChange('lastName')}
                    error={!!validationErrors.lastName}
                    helperText={validationErrors.lastName}
                    disabled={loading}
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label={t('auth.email')}
                    type="email"
                    margin="normal"
                    required
                    value={formData.email}
                    onChange={handleInputChange('email')}
                    error={!!validationErrors.email}
                    helperText={validationErrors.email}
                    disabled={loading}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label={t('auth.password')}
                    type="password"
                    margin="normal"
                    required
                    value={formData.password}
                    onChange={handleInputChange('password')}
                    error={!!validationErrors.password}
                    helperText={validationErrors.password}
                    disabled={loading}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label={t('auth.confirmPassword')}
                    type="password"
                    margin="normal"
                    required
                    value={formData.confirmPassword}
                    onChange={handleInputChange('confirmPassword')}
                    error={!!validationErrors.confirmPassword}
                    helperText={validationErrors.confirmPassword}
                    disabled={loading}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label={t('auth.phone')}
                    margin="normal"
                    value={formData.phone}
                    onChange={handleInputChange('phone')}
                    error={!!validationErrors.phone}
                    helperText={validationErrors.phone}
                    disabled={loading}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label={t('auth.company')}
                    margin="normal"
                    value={formData.company}
                    onChange={handleInputChange('company')}
                    error={!!validationErrors.company}
                    helperText={validationErrors.company}
                    disabled={loading}
                  />
                </Grid>
              </Grid>
              
              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                sx={{ mt: 3, mb: 2 }}
                disabled={loading}
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  t('auth.register')
                )}
              </Button>
              
              <Box sx={{ textAlign: 'center', mt: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  {t('auth.haveAccount')}{' '}
                  <Link href="/login" variant="body2">
                    {t('auth.login')}
                  </Link>
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Container>
  )
}

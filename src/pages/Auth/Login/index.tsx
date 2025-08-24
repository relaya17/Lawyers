import React, { useState } from 'react'
import { Box, Container, Typography, TextField, Button, Card, CardContent, Link, Alert, CircularProgress, Divider } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { login } from '@shared/store/slices/authSlice'
import { RootState } from '@shared/store'
import { BiometricButton } from '@shared/components/ui/BiometricButton'

export const LoginPage: React.FC = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  
  const { isLoading: loading, error } = useSelector((state: RootState) => state.auth)
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  
  const [validationErrors, setValidationErrors] = useState<{
    email?: string
    password?: string
  }>({})

  const validateForm = () => {
    const errors: { email?: string; password?: string } = {}
    
    if (!formData.email) {
      errors.email = t('validation.required')
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = t('validation.email')
    }
    
    if (!formData.password) {
      errors.password = t('validation.required')
    } else if (formData.password.length < 6) {
      errors.password = t('validation.passwordMin')
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
      await dispatch(login(formData) as any)
      navigate('/dashboard')
    } catch (error) {
      console.error('Login failed:', error)
    }
  }

  const handleBiometricSuccess = (token: string) => {
    // Handle successful biometric authentication
    console.log('Biometric authentication successful:', token)
    navigate('/dashboard')
  }

  const handleBiometricError = (error: string) => {
    console.error('Biometric authentication failed:', error)
  }

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Card sx={{ width: '100%', maxWidth: 400 }}>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom textAlign="center">
              {t('auth.login')}
            </Typography>
            
            <Typography variant="body2" color="text.secondary" textAlign="center" paragraph>
              {t('auth.loginSubtitle')}
            </Typography>
            
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}
            
            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
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
                  t('auth.login')
                )}
              </Button>

              {/* Biometric Authentication */}
              <Box sx={{ mt: 2, mb: 2 }}>
                <Divider sx={{ my: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    {t('biometric.or')}
                  </Typography>
                </Divider>
                
                <BiometricButton
                  onSuccess={handleBiometricSuccess}
                  onError={handleBiometricError}
                  fullWidth
                  size="large"
                  promptMessage={t('biometric.loginPrompt')}
                />
              </Box>
              
              <Box sx={{ textAlign: 'center' }}>
                <Link href="/forgot-password" variant="body2">
                  {t('auth.forgotPassword')}
                </Link>
              </Box>
              
              <Box sx={{ textAlign: 'center', mt: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  {t('auth.noAccount')}{' '}
                  <Link href="/register" variant="body2">
                    {t('auth.register')}
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

import React, { useEffect, useState } from 'react'
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  Link,
  Alert,
  CircularProgress,
  Divider,
} from '@mui/material'
import { Link as RouterLink, useNavigate, useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { loginSchema } from '@shared/validation/auth'
import type { RootState } from '@/store'
import { BiometricButton } from '@/components/ui/BiometricButton'
import { useSessionAuth } from '@/features/auth/providers/SessionAuthProvider'
import { prefetchCsrf } from '@/features/auth/api/authHttp'
import { safeNextPath } from '@/utils/safeNextPath'

export const LoginPage: React.FC = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { signIn } = useSessionAuth()
  const { isLoading: loading } = useSelector((state: RootState) => state.auth)

  const [formData, setFormData] = useState({ email: '', password: '' })
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({})
  const [submitError, setSubmitError] = useState<string | null>(null)

  useEffect(() => {
    prefetchCsrf().catch(() => {
      /* נסיון שקט — SessionAuth כבר מאתחל */
    })
  }, [])

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setSubmitError(null)
    const parsed = loginSchema.safeParse(formData)
    if (!parsed.success) {
      const flat = parsed.error.flatten().fieldErrors
      setFieldErrors({
        email: flat.email?.[0],
        password: flat.password?.[0],
      })
      return
    }
    setFieldErrors({})
    try {
      await signIn(parsed.data.email, parsed.data.password)
      const nextRaw = searchParams.get('next') ?? searchParams.get('redirect')
      navigate(safeNextPath(nextRaw), { replace: true })
    } catch (e) {
      setSubmitError(e instanceof Error ? e.message : 'התחברות נכשלה')
    }
  }

  const handleBiometricSuccess = (_token: string) => {
    const nextRaw = searchParams.get('next') ?? searchParams.get('redirect')
    navigate(safeNextPath(nextRaw))
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
        <Card sx={{ width: '100%', maxWidth: 420 }}>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom textAlign="center">
              {t('auth.login')}
            </Typography>
            <Typography variant="body2" color="text.secondary" textAlign="center" paragraph>
              {t('auth.loginSubtitle')}
            </Typography>
            <Alert severity="info" sx={{ mb: 2 }}>
              התחברות מאובטחת: Access JWT בזיכרון בלבד, Refresh ב־HttpOnly cookie. ודאו ש־CORS בשרת
              כולל את פורט ה־Vite ו־<code>credentials: true</code>.
            </Alert>
            {submitError && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {submitError}
              </Alert>
            )}
            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
              <TextField
                fullWidth
                label={t('auth.email')}
                type="email"
                autoComplete="email"
                margin="normal"
                value={formData.email}
                onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))}
                error={!!fieldErrors.email}
                helperText={fieldErrors.email}
                disabled={loading}
              />
              <TextField
                fullWidth
                label={t('auth.password')}
                type="password"
                autoComplete="current-password"
                margin="normal"
                value={formData.password}
                onChange={(e) => setFormData((p) => ({ ...p, password: e.target.value }))}
                error={!!fieldErrors.password}
                helperText={fieldErrors.password}
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
                {loading ? <CircularProgress size={24} color="inherit" /> : t('auth.login')}
              </Button>
              <Divider sx={{ my: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  {t('biometric.or')}
                </Typography>
              </Divider>
              <BiometricButton
                onSuccess={handleBiometricSuccess}
                onError={() => undefined}
                fullWidth
                size="large"
                promptMessage={t('biometric.loginPrompt')}
              />
              <Box sx={{ textAlign: 'center', mt: 2 }}>
                <Link href="/forgot-password" variant="body2">
                  {t('auth.forgotPassword')}
                </Link>
              </Box>
              <Box sx={{ textAlign: 'center', mt: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  {t('auth.noAccount')}{' '}
                  <Link
                    component={RouterLink}
                    to={searchParams.toString() ? `/register?${searchParams.toString()}` : '/register'}
                    variant="body2"
                  >
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

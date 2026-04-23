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
  Grid,
} from '@mui/material'
import { Link as RouterLink, useNavigate, useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { registerSchema, verifyEmailSchema } from '@shared/validation/auth'
import type { RootState } from '@/store'
import { useSessionAuth } from '@/features/auth/providers/SessionAuthProvider'
import { prefetchCsrf } from '@/features/auth/api/authHttp'
import { GoogleLoginButton } from '@/features/auth/components/GoogleLoginButton'
import { Divider } from '@mui/material'
import { safeNextPath } from '@/utils/safeNextPath'

type Step = 'form' | 'verify'

export const RegisterPage: React.FC = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { signUp, verifyOtp, resendOtp } = useSessionAuth()
  const { isLoading: loading } = useSelector((state: RootState) => state.auth)

  const [step, setStep] = useState<Step>('form')
  const [pendingEmail, setPendingEmail] = useState('')

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
  })

  const [otp, setOtp] = useState('')
  const [fieldErrors, setFieldErrors] = useState<Record<string, string | undefined>>({})
  const [submitError, setSubmitError] = useState<string | null>(null)

  useEffect(() => {
    prefetchCsrf().catch(() => undefined)
  }, [])

  const handleRegister = async (event: React.FormEvent) => {
    event.preventDefault()
    setSubmitError(null)
    if (formData.password !== formData.confirmPassword) {
      setFieldErrors({ confirmPassword: 'הסיסמאות אינן תואמות' })
      return
    }
    const parsed = registerSchema.safeParse({
      email: formData.email,
      password: formData.password,
      firstName: formData.firstName,
      lastName: formData.lastName,
      phone: formData.phone || undefined,
    })
    if (!parsed.success) {
      const f = parsed.error.flatten().fieldErrors
      setFieldErrors({
        email: f.email?.[0],
        password: f.password?.[0],
        firstName: f.firstName?.[0],
        lastName: f.lastName?.[0],
        phone: f.phone?.[0],
      })
      return
    }
    setFieldErrors({})
    try {
      await signUp(parsed.data)
      setPendingEmail(parsed.data.email)
      setStep('verify')
    } catch (e) {
      setSubmitError(e instanceof Error ? e.message : 'הרשמה נכשלה')
    }
  }

  const handleVerify = async (event: React.FormEvent) => {
    event.preventDefault()
    setSubmitError(null)
    const parsed = verifyEmailSchema.safeParse({ email: pendingEmail, code: otp })
    if (!parsed.success) {
      const f = parsed.error.flatten().fieldErrors
      setFieldErrors({ otp: f.code?.[0] })
      return
    }
    setFieldErrors({})
    try {
      await verifyOtp(parsed.data.email, parsed.data.code)
      navigate(safeNextPath(searchParams.get('next')), { replace: true })
    } catch (e) {
      setSubmitError(e instanceof Error ? e.message : 'אימות נכשל')
    }
  }

  const handleResend = async () => {
    setSubmitError(null)
    try {
      await resendOtp(pendingEmail)
    } catch (e) {
      setSubmitError(e instanceof Error ? e.message : 'שליחה נכשלה')
    }
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
        <Card sx={{ width: '100%', maxWidth: 480 }}>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom textAlign="center">
              {step === 'form' ? t('auth.register') : 'אימות אימייל'}
            </Typography>
            {submitError && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {submitError}
              </Alert>
            )}
            {step === 'form' ? (
              <Box component="form" onSubmit={handleRegister}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label={t('auth.firstName')}
                      value={formData.firstName}
                      onChange={(e) =>
                        setFormData((p) => ({ ...p, firstName: e.target.value }))
                      }
                      error={!!fieldErrors.firstName}
                      helperText={fieldErrors.firstName}
                      disabled={loading}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label={t('auth.lastName')}
                      value={formData.lastName}
                      onChange={(e) =>
                        setFormData((p) => ({ ...p, lastName: e.target.value }))
                      }
                      error={!!fieldErrors.lastName}
                      helperText={fieldErrors.lastName}
                      disabled={loading}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label={t('auth.email')}
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))}
                      error={!!fieldErrors.email}
                      helperText={fieldErrors.email}
                      disabled={loading}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label={t('auth.phone')}
                      value={formData.phone}
                      onChange={(e) => setFormData((p) => ({ ...p, phone: e.target.value }))}
                      error={!!fieldErrors.phone}
                      helperText={fieldErrors.phone}
                      disabled={loading}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label={t('auth.password')}
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData((p) => ({ ...p, password: e.target.value }))}
                      error={!!fieldErrors.password}
                      helperText={fieldErrors.password}
                      disabled={loading}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label={t('auth.confirmPassword')}
                      type="password"
                      value={formData.confirmPassword}
                      onChange={(e) =>
                        setFormData((p) => ({ ...p, confirmPassword: e.target.value }))
                      }
                      error={!!fieldErrors.confirmPassword}
                      helperText={fieldErrors.confirmPassword}
                      disabled={loading}
                    />
                  </Grid>
                </Grid>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  size="large"
                  sx={{ mt: 3 }}
                  disabled={loading}
                >
                  {loading ? <CircularProgress size={24} color="inherit" /> : t('auth.register')}
                </Button>
              </Box>
            ) : (
              <Box component="form" onSubmit={handleVerify}>
                <Alert severity="info" sx={{ mb: 2 }}>
                  נשלח קוד בן 6 ספרות ל־<strong>{pendingEmail}</strong>. בלי מפתח Resend בשרת הקוד
                  מופיע בלוג הקונסול (פיתוח).
                </Alert>
                <TextField
                  fullWidth
                  label="קוד אימות"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  error={!!fieldErrors.otp}
                  helperText={fieldErrors.otp}
                  disabled={loading}
                  inputProps={{ inputMode: 'numeric', maxLength: 6 }}
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  size="large"
                  sx={{ mt: 2 }}
                  disabled={loading || otp.length !== 6}
                >
                  {loading ? <CircularProgress size={24} color="inherit" /> : 'אמת והמשך'}
                </Button>
                <Button fullWidth sx={{ mt: 1 }} onClick={handleResend} disabled={loading}>
                  שלח קוד מחדש
                </Button>
              </Box>
            )}
            {step === 'form' && (
              <>
                <Divider sx={{ my: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    או הירשם עם
                  </Typography>
                </Divider>
                <GoogleLoginButton />
              </>
            )}
            <Box sx={{ textAlign: 'center', mt: 3 }}>
              <Typography variant="body2" color="text.secondary">
                {t('auth.haveAccount')}{' '}
                <Link
                  component={RouterLink}
                  to={searchParams.toString() ? `/login?${searchParams.toString()}` : '/login'}
                  variant="body2"
                >
                  {t('auth.login')}
                </Link>
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Container>
  )
}

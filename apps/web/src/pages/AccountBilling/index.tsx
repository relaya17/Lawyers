import React, { useState } from 'react'
import {
  Alert,
  Box,
  Button,
  Chip,
  Container,
  Divider,
  Paper,
  Stack,
  Typography,
} from '@mui/material'
import SettingsIcon from '@mui/icons-material/Settings'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import { useSessionAuth } from '@/features/auth/providers/SessionAuthProvider'
import { useEntitlements } from '@/features/billing/providers/EntitlementsProvider'
import { createBillingPortal } from '@/features/billing/api/billingHttp'
import { useAnalytics } from '@/features/analytics/providers/AnalyticsProvider'
import { AnalyticsEvents } from '@/features/analytics/events'

function fmtDate(d: Date | null): string {
  if (!d) return '—'
  return new Intl.DateTimeFormat('he-IL', { dateStyle: 'long' }).format(d)
}

export const AccountBillingPage: React.FC = () => {
  const navigate = useNavigate()
  const { isAuthenticated, accessToken } = useSessionAuth()
  const { plan, status, currentPeriodEnd, cancelAtPeriodEnd, loading } = useEntitlements()
  const { track } = useAnalytics()
  const [portalLoading, setPortalLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (!isAuthenticated) {
    navigate('/login?redirect=/account/billing')
    return null
  }

  const openPortal = async () => {
    if (!accessToken) return
    setError(null)
    setPortalLoading(true)
    track(AnalyticsEvents.BILLING_PORTAL_OPENED, { plan })
    try {
      const r = await createBillingPortal(accessToken)
      window.location.href = r.url
    } catch (e) {
      const err = e as { message?: string }
      setError(err.message ?? 'פתיחת לוח הניהול נכשלה')
      setPortalLoading(false)
    }
  }

  return (
    <Container maxWidth="md" sx={{ py: { xs: 4, md: 6 } }}>
      <Stack spacing={3}>
        <Box>
          <Typography variant="h4" fontWeight={800}>
            חיוב ומנוי
          </Typography>
          <Typography color="text.secondary">
            ניהול אמצעי התשלום, חשבוניות וביטול מנוי.
          </Typography>
        </Box>

        <Paper elevation={2} sx={{ p: 3, borderRadius: 3 }}>
          <Stack spacing={2}>
            <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
              <Typography variant="h6">מסלול נוכחי:</Typography>
              <Chip
                label={plan.toUpperCase()}
                color={plan === 'free' ? 'default' : 'primary'}
                size="medium"
              />
              <Chip
                label={status === 'active' ? 'פעיל' : status === 'trialing' ? 'ניסיון' : status}
                size="small"
                variant="outlined"
              />
              {cancelAtPeriodEnd && (
                <Chip label="מתבטל בסוף המחזור" color="warning" size="small" />
              )}
            </Stack>
            <Divider />
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={4}>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  חיוב הבא
                </Typography>
                <Typography variant="body1">{fmtDate(currentPeriodEnd)}</Typography>
              </Box>
            </Stack>
            {error && <Alert severity="error">{error}</Alert>}
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
              {plan === 'free' ? (
                <Button component={RouterLink} to="/pricing" variant="contained" size="large">
                  שדרגי למסלול פרו
                </Button>
              ) : (
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<SettingsIcon />}
                  endIcon={<OpenInNewIcon fontSize="small" />}
                  onClick={openPortal}
                  disabled={portalLoading || loading}
                >
                  {portalLoading ? 'פותח לוח ניהול…' : 'ניהול חיוב (Stripe)'}
                </Button>
              )}
              <Button component={RouterLink} to="/pricing" variant="outlined" size="large">
                השוואת מסלולים
              </Button>
            </Stack>
          </Stack>
        </Paper>

        <Typography variant="body2" color="text.secondary">
          התשלומים מעובדים על ידי Stripe. LexStudy לא שומרת פרטי כרטיסי אשראי. ניתן לבטל בכל
          עת מתוך לוח הניהול, והגישה תמשיך עד סוף המחזור ששולם עליו.
        </Typography>
      </Stack>
    </Container>
  )
}

export default AccountBillingPage

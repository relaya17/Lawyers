import React, { useEffect, useRef, useState } from 'react'
import { Box, Button, CircularProgress, Container, Paper, Stack, Typography } from '@mui/material'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { Link as RouterLink } from 'react-router-dom'
import { useEntitlements } from '@/features/billing/providers/EntitlementsProvider'
import { useAnalytics } from '@/features/analytics/providers/AnalyticsProvider'
import { AnalyticsEvents } from '@/features/analytics/events'

export const BillingSuccessPage: React.FC = () => {
  const { plan, refresh } = useEntitlements()
  const { track } = useAnalytics()
  const [polling, setPolling] = useState(true)
  const fired = useRef(false)

  useEffect(() => {
    if (!fired.current && plan !== 'free') {
      fired.current = true
      track(AnalyticsEvents.CHECKOUT_COMPLETED, { plan })
    }
  }, [plan, track])

  useEffect(() => {
    let attempts = 0
    const interval = window.setInterval(async () => {
      attempts += 1
      await refresh()
      if (plan !== 'free' || attempts >= 6) {
        setPolling(false)
        window.clearInterval(interval)
      }
    }, 1500)
    return () => window.clearInterval(interval)
  }, [plan, refresh])

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Paper elevation={4} sx={{ p: 5, borderRadius: 3, textAlign: 'center' }}>
        <Stack spacing={3} alignItems="center">
          <Box
            sx={{
              width: 72,
              height: 72,
              borderRadius: '50%',
              display: 'grid',
              placeItems: 'center',
              bgcolor: 'success.light',
              color: 'success.contrastText',
            }}
          >
            <CheckCircleIcon sx={{ fontSize: 40 }} aria-hidden />
          </Box>
          <Typography variant="h4" fontWeight={800}>
            תודה! התשלום עבר בהצלחה
          </Typography>
          {polling ? (
            <Stack direction="row" spacing={1} alignItems="center" color="text.secondary">
              <CircularProgress size={18} />
              <Typography>מסנכרן את המנוי החדש…</Typography>
            </Stack>
          ) : plan === 'free' ? (
            <Typography color="text.secondary">
              המנוי יופעל בדקות הקרובות. אפשר לגלוש ולחזור בעוד רגע.
            </Typography>
          ) : (
            <Typography color="success.main">
              המסלול שלך כעת: <strong>{plan.toUpperCase()}</strong>
            </Typography>
          )}
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} sx={{ pt: 1 }}>
            <Button component={RouterLink} to="/dashboard" variant="contained" size="large">
              לדאשבורד
            </Button>
            <Button component={RouterLink} to="/legal-knowledge" variant="outlined" size="large">
              התחלת לימוד
            </Button>
          </Stack>
        </Stack>
      </Paper>
    </Container>
  )
}

export default BillingSuccessPage

import React, { useCallback, useEffect, useState } from 'react'
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Container,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Stack,
  Typography,
} from '@mui/material'
import CheckIcon from '@mui/icons-material/Check'
import StarIcon from '@mui/icons-material/Star'
import { useNavigate } from 'react-router-dom'
import { createCheckout, fetchPlans } from '@/features/billing/api/billingHttp'
import { useEntitlements } from '@/features/billing/providers/EntitlementsProvider'
import { useSessionAuth } from '@/features/auth/providers/SessionAuthProvider'
import { useAnalytics } from '@/features/analytics/providers/AnalyticsProvider'
import { AnalyticsEvents } from '@/features/analytics/events'
import type { BillingPromoSummary, Plan, PlanId } from '@/features/billing/types'

const HIGHLIGHT_PLAN: PlanId = 'pro'

export const PricingPage: React.FC = () => {
  const navigate = useNavigate()
  const { accessToken, isAuthenticated } = useSessionAuth()
  const { plan: currentPlan, refresh } = useEntitlements()
  const { track } = useAnalytics()
  const [plans, setPlans] = useState<Plan[]>([])
  const [stripeConfigured, setStripeConfigured] = useState(true)
  const [loading, setLoading] = useState(true)
  const [checkoutPlan, setCheckoutPlan] = useState<PlanId | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [promo, setPromo] = useState<BillingPromoSummary | null>(null)

  useEffect(() => {
    track(AnalyticsEvents.PRICING_VIEWED, { current_plan: currentPlan })
  }, [track, currentPlan])

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const r = await fetchPlans()
        if (cancelled) return
        setPlans(r.plans)
        setStripeConfigured(r.stripeConfigured)
        setPromo(r.promo ?? null)
      } catch {
        if (!cancelled) setError('לא הצלחנו לטעון את המסלולים. נסי לרענן את הדף.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  const startCheckout = useCallback(
    async (planId: Exclude<PlanId, 'free'>) => {
      setError(null)
      if (!isAuthenticated || !accessToken) {
        navigate(`/register?next=${encodeURIComponent('/pricing')}`)
        return
      }
      setCheckoutPlan(planId)
      track(AnalyticsEvents.CHECKOUT_STARTED, {
        plan: planId,
        from_plan: currentPlan,
      })
      try {
        const r = await createCheckout({ accessToken, plan: planId })
        window.location.href = r.url
      } catch (err) {
        const e = err as { status?: number; message?: string }
        setError(e.message ?? 'הפעלת התשלום נכשלה')
        setCheckoutPlan(null)
      }
    },
    [accessToken, isAuthenticated, navigate, track, currentPlan],
  )

  useEffect(() => {
    void refresh()
  }, [refresh])

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Stack alignItems="center" spacing={2}>
          <CircularProgress />
          <Typography color="text.secondary">טוען מסלולים…</Typography>
        </Stack>
      </Container>
    )
  }

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 4, md: 8 } }}>
      <Stack spacing={1.5} alignItems="center" textAlign="center" sx={{ mb: 5 }}>
        <Chip label="LexStudy — הכנה למבחני לשכה" color="primary" />
        <Typography variant="h3" fontWeight={800}>
          מסלול שמתאים לקצב הלימוד שלך
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 720 }}>
          1200+ שאלות אמת, AI Coach שמזהה חולשות, וסימולציות בבית משפט וירטואלי —
          הכול במקום אחד. ביטול בכל רגע.
        </Typography>
      </Stack>

      {promo?.active && (
        <Alert severity="success" sx={{ mb: 3 }}>
          <strong>מבצע השקה:</strong> עד{' '}
          {promo.endsAt
            ? new Date(promo.endsAt).toLocaleDateString('he-IL', {
                dateStyle: 'long',
                timeZone: 'Asia/Jerusalem',
              })
            : 'תאריך הסיום'}
          — הרשמה חינם נותנת גישה ליכולות Student Pro (ללא ייבוא תיקים אמיתיים וניתוח חוזים למומחים).
          שירותי AI במגבלה של {promo.freeAiPerDay} קריאות ליום; במנוי Pro — ללא מגבלה.
        </Alert>
      )}
      {!stripeConfigured && (
        <Alert severity="info" sx={{ mb: 3 }}>
          מצב פיתוח: Stripe עדיין לא מוגדר בשרת. השלימי את <code>STRIPE_SECRET_KEY</code> ואת
          ה-Price IDs ב-<code>apps/server/.env</code> כדי להפעיל תשלומים.
        </Alert>
      )}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3} alignItems="stretch">
        {plans.map((plan) => {
          const isCurrent = plan.id === currentPlan
          const isHighlight = plan.id === HIGHLIGHT_PLAN
          const canCheckout = plan.id !== 'free' && plan.available
          return (
            <Grid item xs={12} md={4} key={plan.id}>
              <Paper
                elevation={isHighlight ? 10 : 2}
                sx={{
                  p: 3,
                  borderRadius: 3,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  border: isHighlight
                    ? '2px solid'
                    : '1px solid',
                  borderColor: isHighlight ? 'primary.main' : 'divider',
                  position: 'relative',
                }}
              >
                {isHighlight && (
                  <Chip
                    icon={<StarIcon />}
                    label="הכי פופולרי"
                    color="primary"
                    size="small"
                    sx={{ position: 'absolute', top: -12, right: 16 }}
                  />
                )}
                <Stack spacing={1} sx={{ mb: 2 }}>
                  <Typography variant="overline" color="primary">
                    {plan.id.toUpperCase()}
                  </Typography>
                  <Typography variant="h5" fontWeight={700}>
                    {plan.displayNameHe}
                  </Typography>
                  <Stack direction="row" alignItems="baseline" spacing={1}>
                    <Typography variant="h3" fontWeight={800}>
                      ₪{plan.monthlyPriceIls}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      / חודש
                    </Typography>
                  </Stack>
                </Stack>

                <List dense disablePadding sx={{ flexGrow: 1, mb: 2 }}>
                  {plan.features.map((f) => (
                    <ListItem key={f} disableGutters sx={{ py: 0.5 }}>
                      <ListItemIcon sx={{ minWidth: 30 }}>
                        <CheckIcon fontSize="small" color="primary" />
                      </ListItemIcon>
                      <ListItemText primary={f} />
                    </ListItem>
                  ))}
                </List>

                {isCurrent ? (
                  <Button fullWidth disabled variant="outlined">
                    המסלול הנוכחי שלך
                  </Button>
                ) : plan.id === 'free' ? (
                  <Button
                    fullWidth
                    variant="outlined"
                    onClick={() => navigate(isAuthenticated ? '/dashboard' : '/register')}
                  >
                    {isAuthenticated ? 'המשך חינם' : 'הרשמה חינמית'}
                  </Button>
                ) : (
                  <Button
                    fullWidth
                    size="large"
                    variant={isHighlight ? 'contained' : 'outlined'}
                    disabled={!canCheckout || checkoutPlan !== null}
                    onClick={() => startCheckout(plan.id as 'pro' | 'premium')}
                  >
                    {checkoutPlan === plan.id ? (
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <CircularProgress size={18} />
                        <Box component="span">מעביר לתשלום…</Box>
                      </Stack>
                    ) : canCheckout ? (
                      `שדרגי ל-${plan.displayNameHe}`
                    ) : (
                      'מסלול זה טרם נפתח'
                    )}
                  </Button>
                )}
              </Paper>
            </Grid>
          )
        })}
      </Grid>

      <Stack spacing={1} alignItems="center" sx={{ mt: 6 }}>
        <Typography variant="body2" color="text.secondary">
          המחירים כוללים מע״מ. ניתן לבטל בכל רגע דרך לוח הניהול → חיוב.
        </Typography>
        <Typography variant="body2" color="text.secondary">
          תשלומים מאובטחים ומעובדים על ידי Stripe. LexStudy לא שומרת פרטי כרטיסי אשראי.
        </Typography>
      </Stack>
    </Container>
  )
}

export default PricingPage

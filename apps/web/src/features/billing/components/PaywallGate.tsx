import React, { useEffect } from 'react'
import { Box, Button, Paper, Stack, Typography, Chip } from '@mui/material'
import LockIcon from '@mui/icons-material/Lock'
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome'
import { Link as RouterLink } from 'react-router-dom'
import { useEntitlements } from '../providers/EntitlementsProvider'
import type { PlanEntitlements } from '../types'
import { useAnalytics } from '@/features/analytics/providers/AnalyticsProvider'
import { AnalyticsEvents } from '@/features/analytics/events'

type EntitlementFlag = Exclude<
  keyof PlanEntitlements,
  'monthlyQuestionQuota' | 'dailyQuestionLimit'
>

interface PaywallGateProps {
  flag: EntitlementFlag
  children: React.ReactNode
  /** Heading shown when the user doesn't have access. */
  title?: string
  /** Subtitle / sell copy. */
  description?: string
  /** When true, render children grayed/blurred behind the paywall card. */
  preview?: boolean
}

const FLAG_COPY: Record<EntitlementFlag, { title: string; description: string }> = {
  aiCoach: {
    title: 'AI Coach — מאמן אישי',
    description:
      'קבל ניתוח חולשות חכם, תוכנית לימוד יומית ושאלות חיזוק ממוקדות. זמין במסלול Pro ומעלה.',
  },
  adaptiveDrills: {
    title: 'מסלול Adaptive Learning',
    description:
      'מערכת לומדת אוטומטית איפה נכשלת ובונה מסלול שלם מותאם אישית להכנה ללשכה.',
  },
  virtualCourtLimited: {
    title: 'בית משפט וירטואלי — מצב בסיס',
    description:
      'ניהול תיקים ודיונים מקומיים. ייצור תיק ב-AI ושופט AI זמינים במסלול Student Pro.',
  },
  virtualCourtFull: {
    title: 'בית משפט וירטואלי — מסלול מלא',
    description:
      'סימולציות דיון מלאות עם שופט AI, עדים וצד שני — זמין במסלול Student Pro ומעלה.',
  },
  contractRiskAnalysis: {
    title: 'ניתוח סיכונים בחוזים',
    description:
      'זיהוי סעיפים בעייתיים, סיכונים משפטיים והמלצות — במסלול Lawyer / Expert.',
  },
  realCaseImport: {
    title: 'ייבוא תיקים אמיתיים',
    description:
      'העלאת תיק אמיתי והפקה אוטומטית של סיכום, סתירות בעדויות וטקטיקת חקירה נגדית.',
  },
  unlimitedExamQuestions: {
    title: 'שאלות מבחן ללא הגבלה',
    description:
      'גישה ל-1200+ שאלות ממבחני לשכה אמיתיים, פלוס תשובות מפורטות והסברי פסיקה.',
  },
}

export const PaywallGate: React.FC<PaywallGateProps> = ({
  flag,
  children,
  title,
  description,
  preview = false,
}) => {
  const { can, plan, loading } = useEntitlements()
  const { track } = useAnalytics()
  const blocked = !loading && !can(flag)

  useEffect(() => {
    if (blocked) {
      track(AnalyticsEvents.PAYWALL_VIEWED, { flag, current_plan: plan })
    }
  }, [blocked, flag, plan, track])

  if (loading) return <>{children}</>
  if (can(flag)) return <>{children}</>

  const copy = FLAG_COPY[flag]
  const finalTitle = title ?? copy.title
  const finalDescription = description ?? copy.description

  const onUpgradeClick = () => {
    track(AnalyticsEvents.PAYWALL_CTA_CLICKED, { flag, current_plan: plan, cta: 'upgrade' })
  }
  const onCompareClick = () => {
    track(AnalyticsEvents.PAYWALL_CTA_CLICKED, { flag, current_plan: plan, cta: 'compare' })
  }

  return (
    <Box sx={{ position: 'relative' }}>
      {preview && (
        <Box
          sx={{
            filter: 'blur(4px)',
            pointerEvents: 'none',
            userSelect: 'none',
            opacity: 0.4,
          }}
          aria-hidden
        >
          {children}
        </Box>
      )}
      <Paper
        elevation={6}
        sx={{
          position: preview ? 'absolute' : 'relative',
          inset: preview ? 0 : undefined,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          m: preview ? 0 : 2,
          p: { xs: 3, md: 5 },
          textAlign: 'center',
          borderRadius: 3,
          background:
            'linear-gradient(135deg, rgba(79,70,229,0.08) 0%, rgba(99,102,241,0.12) 100%)',
          border: '1px solid rgba(79,70,229,0.25)',
        }}
      >
        <Stack spacing={2} alignItems="center" sx={{ maxWidth: 520 }}>
          <Box
            sx={{
              width: 56,
              height: 56,
              borderRadius: '50%',
              display: 'grid',
              placeItems: 'center',
              bgcolor: 'primary.main',
              color: 'primary.contrastText',
            }}
          >
            <LockIcon aria-hidden />
          </Box>
          <Chip
            label={`התכונה זמינה במסלול פרו — את/ה כרגע במסלול ${plan === 'free' ? 'חינם' : plan}`}
            color="primary"
            variant="outlined"
            size="small"
          />
          <Typography variant="h5" fontWeight={700}>
            {finalTitle}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {finalDescription}
          </Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
            <Button
              component={RouterLink}
              to="/pricing"
              variant="contained"
              size="large"
              startIcon={<AutoAwesomeIcon />}
              onClick={onUpgradeClick}
            >
              שדרגי למסלול פרו
            </Button>
            <Button
              component={RouterLink}
              to="/pricing"
              variant="text"
              size="large"
              onClick={onCompareClick}
            >
              השוואת מסלולים
            </Button>
          </Stack>
        </Stack>
      </Paper>
    </Box>
  )
}

import React, { useState } from 'react'
import {
  Box,
  Button,
  Container,
  Grid,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { motion } from 'framer-motion'
import { Link as RouterLink } from 'react-router-dom'
import { authJson } from '@/features/auth/api/authHttp'

const navy = '#0A1929'
const gold = '#DAA520'

export const LandingPage: React.FC = () => {
  const [email, setEmail] = useState('')
  const [waitlistStatus, setWaitlistStatus] = useState<'idle' | 'loading' | 'ok' | 'err'>('idle')
  const [waitlistMsg, setWaitlistMsg] = useState<string | null>(null)

  const submitWaitlist = async (e: React.FormEvent) => {
    e.preventDefault()
    setWaitlistStatus('loading')
    setWaitlistMsg(null)
    try {
      const r = await authJson<{ ok: boolean; alreadyRegistered?: boolean }>('/marketing/waitlist', {
        method: 'POST',
        body: JSON.stringify({ email: email.trim(), source: 'landing' }),
      })
      if (r.alreadyRegistered) {
        setWaitlistMsg('כבר רשומים — נשמח לעדכן אותך כשיהיה חדש.')
      } else {
        setWaitlistMsg('נרשמת בהצלחה! בדקי את תיבת האימייל לאישור.')
      }
      setWaitlistStatus('ok')
      setEmail('')
    } catch {
      setWaitlistStatus('err')
      setWaitlistMsg('לא הצלחנו לשמור — נסי שוב בעוד רגע.')
    }
  }

  return (
    <Box dir="rtl" sx={{ bgcolor: '#fafafa', minHeight: '100%', pb: 6 }}>
      <Box sx={{ bgcolor: navy, color: 'common.white', py: { xs: 8, md: 12 }, textAlign: 'center' }}>
        <Container maxWidth="md">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Typography variant="h2" sx={{ fontWeight: 800, fontSize: { xs: '1.85rem', md: '2.75rem' } }} gutterBottom>
              לעבור את מבחני הלשכה עם המאמן המשפטי של המחר
            </Typography>
            <Typography variant="h6" sx={{ mb: 4, opacity: 0.85, fontWeight: 400, lineHeight: 1.6 }}>
              LexStudy — פלטפורמת ה-AI שמחברת בין יוקרה משפטית לטכנולוגיה: תרגול חכם, בית משפט וירטואלי,
              וניתוח חוזים במקום אחד.
            </Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
              <Button
                component={RouterLink}
                to="/register"
                variant="contained"
                size="large"
                sx={{ bgcolor: gold, color: 'common.black', fontWeight: 700, '&:hover': { bgcolor: '#c4941c' } }}
              >
                התחילי תרגול חינם
              </Button>
              <Button
                component={RouterLink}
                to="/legal-knowledge"
                variant="outlined"
                size="large"
                sx={{ color: 'common.white', borderColor: 'rgba(255,255,255,0.7)' }}
              >
                כניסה לאפליקציה
              </Button>
            </Stack>
          </motion.div>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ mt: 6 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid', borderColor: 'divider', height: '100%' }}>
              <Typography variant="overline" color="primary" fontWeight={700}>
                הבעיה
              </Typography>
              <Typography variant="h5" fontWeight={700} gutterBottom>
                חומר עמוס, מפוזר — והתרגול מתיש
              </Typography>
              <Typography color="text.secondary" sx={{ lineHeight: 1.8 }}>
                לימודי משפטים דורשים סינתזה של חקיקה, פסיקה והיגיון — כשהמידע מפוזר והתרגול לא מדבר אליך,
                קשה לשמור מומנטום עד למבחן.
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid', borderColor: 'divider', height: '100%' }}>
              <Typography variant="overline" color="primary" fontWeight={700}>
                הפתרון
              </Typography>
              <Typography variant="h5" fontWeight={700} gutterBottom>
                סימולציות חיות ו-AI שמכיר את החולשות שלך
              </Typography>
              <Typography color="text.secondary" sx={{ lineHeight: 1.8 }}>
                LexStudy הופכת חוקים &quot;יבשים&quot; לתרחישים אינטראקטיביים: מאות שאלות מאומתות, מאמן AI אישי,
                ובית משפט וירטואלי שמרגיש כמו הכנה אמיתית לדיון.
              </Typography>
            </Paper>
          </Grid>
        </Grid>

        <Paper sx={{ mt: 5, p: { xs: 3, md: 4 }, borderRadius: 3, bgcolor: navy, color: 'common.white' }}>
          <Typography variant="h5" fontWeight={800} gutterBottom>
            מה תקבלי בפלטפורמה
          </Typography>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            {[
              'בית משפט וירטואלי — סימולציות דיון עם שופט AI',
              '1,200+ שאלות מאומתות להכנה ללשכה',
              'ניתוח סיכונים בחוזים (מסלול מקצועי)',
              'ייבוא תיקים ופסיקה אמיתית מהרשת (מסלול מקצועי)',
            ].map((t) => (
              <Grid item xs={12} sm={6} key={t}>
                <Typography sx={{ display: 'flex', gap: 1, alignItems: 'flex-start', lineHeight: 1.6 }}>
                  <Box component="span" sx={{ color: gold, fontWeight: 800 }}>
                    ✓
                  </Box>
                  {t}
                </Typography>
              </Grid>
            ))}
          </Grid>
        </Paper>

        <Stack alignItems="center" textAlign="center" sx={{ mt: 6, mb: 2 }}>
          <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 560 }}>
            הצטרפו למאות סטודנטים שכבר משדרגים את קצב הלמידה — והירשמו לרשימה לעדכוני מוצר והטבות השקה.
          </Typography>
        </Stack>

        <Paper
          component="form"
          onSubmit={(e) => void submitWaitlist(e)}
          elevation={2}
          sx={{ maxWidth: 480, mx: 'auto', p: 3, borderRadius: 3 }}
        >
          <Typography variant="h6" fontWeight={700} gutterBottom>
            רשימת המתנה — LexStudy
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            הזיני אימייל ונשלח אישור קצר (Resend). ללא ספאם.
          </Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
            <TextField
              fullWidth
              type="email"
              required
              label="אימייל"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={waitlistStatus === 'loading'}
            />
            <Button
              type="submit"
              variant="contained"
              disabled={waitlistStatus === 'loading'}
              sx={{ minWidth: 140, fontWeight: 700, bgcolor: gold, color: 'common.black', '&:hover': { bgcolor: '#c4941c' } }}
            >
              {waitlistStatus === 'loading' ? 'שולח…' : 'הרשמה'}
            </Button>
          </Stack>
          {waitlistMsg && (
            <Typography variant="body2" sx={{ mt: 2 }} color={waitlistStatus === 'err' ? 'error' : 'success.main'}>
              {waitlistMsg}
            </Typography>
          )}
        </Paper>

        <Stack direction="row" justifyContent="center" spacing={2} sx={{ mt: 4 }}>
          <Button component={RouterLink} to="/pricing" color="primary" variant="text">
            מסלולים ומחירים
          </Button>
          <Button component={RouterLink} to="/login" color="inherit" variant="text">
            יש לך כבר חשבון? התחברי
          </Button>
        </Stack>
      </Container>
    </Box>
  )
}

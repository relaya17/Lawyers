import React, { useRef } from 'react'
import {
  Box,
  Typography,
  Grid,
  Chip,
  Button,
  Container,
  Stack,
  useTheme,
} from '@mui/material'
import { alpha } from '@mui/material/styles'
import {
  Description,
  LibraryBooks,
  Handshake,
  Timeline,
  ArrowForward,
  CheckCircleOutline,
  VerifiedUser,
  SupportAgent,
} from '@mui/icons-material'
import { motion, useInView } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'

const MotionBox = motion(Box)

const easeOut = [0.22, 1, 0.36, 1] as const

const fadeUp = {
  hidden: { opacity: 0, y: 36 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, delay: i * 0.1, ease: easeOut },
  }),
}

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09 } },
}

// ── Service cards ─────────────────────────────────────────────────────────────
interface Service {
  icon: React.ElementType
  title: string
  desc: string
  route: string
  gradient: string
  tags: string[]
}

const services: Service[] = [
  {
    icon: Description,
    title: 'חוזים',
    desc: 'ניהול חוזים מקצועי – יצירה, עריכה, מעקב ועדכון. ארכיב מסודר עם חיפוש מתקדם וסטטוסים.',
    route: '/contracts',
    gradient: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
    tags: ['יצירה', 'עריכה', 'מעקב'],
  },
  {
    icon: LibraryBooks,
    title: 'תבניות חוזים',
    desc: 'ספריית תבניות מקצועיות מוכנות לשימוש בעשרות תחומים – שכירות, העסקה, שותפות, NDA ועוד.',
    route: '/contract-templates',
    gradient: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)',
    tags: ['תבניות מוכנות', 'התאמה אישית'],
  },
  {
    icon: Handshake,
    title: 'משא ומתן',
    desc: 'מו״מ וגישור במסגרת בתי המשפט הווירטואליים — ניהול תיק, דיונים וכלים לסיכום עמדות.',
    route: '/virtual-court-2',
    gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    tags: ['מו"מ', 'שיתוף פעולה'],
  },

  {
    icon: Timeline,
    title: 'ניהול גרסאות',
    desc: 'מעקב מלא אחר היסטוריית שינויים בכל חוזה. השוואת גרסאות, שחזור ותיעוד מלא.',
    route: '/version-control',
    gradient: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
    tags: ['גרסאות', 'היסטוריה'],
  },

]

// ── Why us ────────────────────────────────────────────────────────────────────
const benefits = [
  { icon: VerifiedUser, text: 'ביטחון ופרטיות – ההצפנה ברמת בנקאות' },
  { icon: SupportAgent, text: 'תמיכה מקצועית זמינה לעסקים' },
  { icon: CheckCircleOutline, text: 'עמידה בתקני ISO 27001 ו-GDPR' },
]

// ── ServiceCard ───────────────────────────────────────────────────────────────
const ServiceCard: React.FC<{ service: Service; index: number }> = ({ service, index }) => {
  const navigate = useNavigate()
  const Icon = service.icon

  return (
    <MotionBox
      custom={index}
      variants={fadeUp}
      onClick={() => navigate(service.route)}
      role="article"
      aria-label={service.title}
      tabIndex={0}
      onKeyDown={(e: React.KeyboardEvent) => { if (e.key === 'Enter') navigate(service.route) }}
      sx={{
        cursor: 'pointer',
        borderRadius: 4,
        border: '1px solid',
        borderColor: 'divider',
        background: 'background.paper',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        transition: 'transform 0.3s cubic-bezier(0.22,1,0.36,1), box-shadow 0.3s ease',
        '&:hover': {
          transform: 'translateY(-6px)',
          boxShadow: '0 20px 50px rgba(0,0,0,0.13)',
        },
        '&:focus-visible': { outline: '3px solid #6366f1', outlineOffset: 3 },
      }}
    >
      {/* gradient top bar */}
      <Box aria-hidden="true" sx={{ height: 5, background: service.gradient, flexShrink: 0 }} />

      <Box sx={{ p: 3.5, flexGrow: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
        {/* icon */}
        <Box
          aria-hidden="true"
          sx={{
            width: 60,
            height: 60,
            borderRadius: 2.5,
            background: service.gradient,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 6px 20px rgba(0,0,0,0.16)',
          }}
        >
          <Icon sx={{ fontSize: 30, color: '#fff' }} />
        </Box>

        <Box>
          <Typography variant="h6" fontWeight={800} sx={{ mb: 0.75, lineHeight: 1.2 }}>
            {service.title}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
            {service.desc}
          </Typography>
        </Box>

        {/* tags */}
        <Box sx={{ display: 'flex', gap: 0.75, flexWrap: 'wrap', mt: 'auto' }}>
          {service.tags.map((tag) => (
            <Chip
              key={tag}
              label={tag}
              size="small"
              sx={{
                fontSize: '0.68rem',
                fontWeight: 600,
                background: (t) => alpha(t.palette.primary.main, 0.08),
                color: 'primary.main',
              }}
            />
          ))}
        </Box>

        {/* CTA */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'primary.main', mt: 0.5 }}>
          <Typography variant="body2" fontWeight={700}>
            כנס לשירות
          </Typography>
          <ArrowForward sx={{ fontSize: 15 }} aria-hidden="true" />
        </Box>
      </Box>
    </MotionBox>
  )
}

// ── ServicesPage ──────────────────────────────────────────────────────────────
export const ServicesPage: React.FC = () => {
  const navigate = useNavigate()
  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'

  const gridRef = useRef<HTMLDivElement>(null)
  const gridInView = useInView(gridRef, { once: true, margin: '-80px' })

  return (
    <>
      <Helmet>
        <title>שירותים מקצועיים | LexStudy</title>
        <meta name="description" content="כלים מקצועיים לעריכת דין – חוזים, תבניות, משא-ומתן, אוטומציה וניהול גרסאות" />
      </Helmet>

      <Box component="main" sx={{ width: '100%', overflowX: 'hidden' }}>

        {/* ── HERO ─────────────────────────────────────────────────────────── */}
        <Box
          component="section"
          aria-labelledby="services-hero-heading"
          sx={{
            position: 'relative',
            overflow: 'hidden',
            mx: { xs: -2, sm: -3, md: -4 },
            px: { xs: 3, sm: 6, md: 10 },
            py: { xs: 8, md: 11 },
            background: isDark
              ? 'linear-gradient(160deg,#0f172a 0%,#1e1b4b 60%,#0f0f23 100%)'
              : 'linear-gradient(160deg,#0f172a 0%,#1e1b4b 60%,#0c1445 100%)',
          }}
        >
          {/* blobs */}
          <Box aria-hidden="true" sx={{ position: 'absolute', top: -80, right: -80, width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle,rgba(99,102,241,0.3) 0%,transparent 70%)', filter: 'blur(70px)', pointerEvents: 'none' }} />
          <Box aria-hidden="true" sx={{ position: 'absolute', bottom: -60, left: -60, width: 350, height: 350, borderRadius: '50%', background: 'radial-gradient(circle,rgba(16,185,129,0.2) 0%,transparent 70%)', filter: 'blur(70px)', pointerEvents: 'none' }} />

          <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
            <MotionBox initial="hidden" animate="visible" variants={stagger}>
              <MotionBox variants={fadeUp} custom={0} sx={{ mb: 2.5 }}>
                <Chip
                  label="שירותים מקצועיים לעורכי דין ומשפטנים"
                  sx={{
                    background: 'rgba(99,102,241,0.15)',
                    border: '1px solid rgba(99,102,241,0.4)',
                    color: '#a5b4fc',
                    fontWeight: 700,
                    fontSize: '0.75rem',
                    height: 30,
                  }}
                />
              </MotionBox>

              <MotionBox variants={fadeUp} custom={1}>
                <Typography
                  id="services-hero-heading"
                  component="h1"
                  sx={{
                    fontSize: { xs: '2rem', sm: '2.8rem', md: '3.5rem' },
                    fontWeight: 900,
                    color: '#fff',
                    lineHeight: 1.1,
                    letterSpacing: -1,
                    mb: 2,
                  }}
                >
                  הכלים שצריך
                  <Box
                    component="span"
                    sx={{
                      display: 'block',
                      background: 'linear-gradient(90deg,#818cf8,#38bdf8)',
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}
                  >
                    לעורך דין מודרני
                  </Box>
                </Typography>
              </MotionBox>

              <MotionBox variants={fadeUp} custom={2}>
                <Typography
                  variant="h6"
                  sx={{ color: 'rgba(255,255,255,0.6)', fontWeight: 400, lineHeight: 1.65, mb: 4, fontSize: { xs: '1rem', md: '1.1rem' } }}
                >
                  כל הכלים המקצועיים במקום אחד – ניהול חוזים, תבניות, מו&quot;מ, אוטומציה וגרסאות
                </Typography>
              </MotionBox>

              <MotionBox variants={fadeUp} custom={3} sx={{ display: 'flex', gap: 1.5, justifyContent: 'center', flexWrap: 'wrap' }}>
                {benefits.map(({ icon: BIcon, text }) => (
                  <Stack key={text} direction="row" alignItems="center" spacing={0.6}>
                    <BIcon sx={{ fontSize: 15, color: '#34d399' }} aria-hidden="true" />
                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.65)', fontWeight: 600 }}>{text}</Typography>
                  </Stack>
                ))}
              </MotionBox>
            </MotionBox>
          </Container>
        </Box>

        {/* ── SERVICES GRID ────────────────────────────────────────────────── */}
        <Box
          ref={gridRef}
          component="section"
          aria-labelledby="services-grid-heading"
          sx={{ py: { xs: 7, md: 10 } }}
        >
          <Container maxWidth="lg">
            <Box sx={{ textAlign: 'center', mb: 7 }}>
              <Typography
                id="services-grid-heading"
                variant="h4"
                component="h2"
                fontWeight={900}
                sx={{ letterSpacing: -0.5, mb: 1.5 }}
              >
                בחר שירות
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 480, mx: 'auto' }}>
                לחץ על כרטיס לכניסה ישירה לשירות
              </Typography>
            </Box>

            <MotionBox
              initial="hidden"
              animate={gridInView ? 'visible' : 'hidden'}
              variants={stagger}
            >
              <Grid container spacing={3} alignItems="stretch">
                {services.map((service, index) => (
                  <Grid item xs={12} sm={6} md={4} key={service.route} sx={{ display: 'flex' }}>
                    <Box sx={{ width: '100%' }}>
                      <ServiceCard service={service} index={index} />
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </MotionBox>
          </Container>
        </Box>

        {/* ── BACK TO LEARNING ─────────────────────────────────────────────── */}
        <Box
          component="section"
          sx={{
            py: { xs: 6, md: 8 },
            mx: { xs: -2, sm: -3, md: -4 },
            mb: { xs: -2, sm: -3, md: -4 },
            px: 4,
            borderTop: '1px solid',
            borderColor: 'divider',
            background: (t) => alpha(t.palette.primary.main, 0.03),
            textAlign: 'center',
          }}
        >
          <Typography variant="h6" fontWeight={700} sx={{ mb: 1 }}>
            רוצה לחזור ללמוד?
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            הפלטפורמה שלנו מיועדת גם לסטודנטים – מבחנים, הסברים וסימולטור
          </Typography>
          <Button
            variant="outlined"
            size="large"
            onClick={() => navigate('/')}
            aria-label="חזור לדף הלמידה הראשי"
            endIcon={<ArrowForward aria-hidden="true" />}
            sx={{ px: 4, py: 1.4, borderRadius: 3, fontWeight: 700, borderWidth: 2, '&:hover': { borderWidth: 2, transform: 'translateY(-2px)' }, transition: 'all 0.25s ease' }}
          >
            לדף הלמידה
          </Button>
        </Box>

      </Box>
    </>
  )
}

export default ServicesPage

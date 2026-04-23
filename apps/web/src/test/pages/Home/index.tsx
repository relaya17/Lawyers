import React, { useRef } from 'react'
import {
  Box,
  Typography,
  Grid,
  Card,
  Button,
  Chip,
  useTheme,
  useMediaQuery,
  Container,
  Stack,
} from '@mui/material'
import { alpha } from '@mui/material/styles'
import {
  Gavel,
  AutoAwesome,
  QuizOutlined,
  MenuBook,
  EmojiEvents,
  Group,
  CheckCircleOutline,
  ArrowForward,
  PlayCircleOutline,
  BalanceOutlined,
  PsychologyOutlined,
  LibraryBooksOutlined,
  FlashOn,
  TrendingUp,
  WorkspacePremium,
  School,
  FormatQuote,
  Star,
} from '@mui/icons-material'
import { motion, useInView } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

// ── Motion helpers ─────────────────────────────────────────────────────────────
const MotionBox = motion(Box)
const MotionCard = motion(Card)

const easeOut = [0.22, 1, 0.36, 1] as const

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.12, ease: easeOut },
  }),
}

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
}

// ── Pillar data ────────────────────────────────────────────────────────────────
interface Pillar {
  icon: React.ElementType
  title: string
  desc: string
  route: string
  gradient: string
  badge: string
  features: string[]
}

const pillars: Pillar[] = [
  {
    icon: QuizOutlined,
    title: 'מבחנים אינטראקטיביים',
    desc: 'מעל 1,200 שאלות רב-ברירה, נכון/לא-נכון וניתוח פסיקה — מכוסות לפי סילבוס הפקולטות המובילות. כל תשובה מלווה בהסבר מעמיק ומקורות חוק.',
    route: '/legal-knowledge',
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    badge: '+1,200 שאלות',
    features: ['משוב מיידי לכל שאלה', 'סיכום ביצועים מפורט', 'מצב תרגול ומצב מבחן'],
  },
  {
    icon: MenuBook,
    title: 'למידה מותאמת AI',
    desc: 'מסלול לימוד אישי שנבנה בזמן אמת לפי נקודות החוזק והחולשה שלך. האלגוריתם מזהה פערים, ממליץ על נושאים ומתאים את הקצב לסגנון הלמידה שלך.',
    route: '/adaptive-learning',
    gradient: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
    badge: 'AI מותאם אישית',
    features: ['מפת ידע אישית', 'חזרה מרווחת (Spaced Repetition)', 'המלצות בזמן אמת'],
  },
  {
    icon: Gavel,
    title: 'סימולטור בית המשפט',
    desc: 'תרגל הופעה בפני שופט וירטואלי, טיעונים משפטיים, חקירת עדים וכתיבת סיכומים — הכל בסביבה בטוחה ועם משוב AI על הביצועים שלך.',
    route: '/simulator',
    gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
    badge: 'בית משפט וירטואלי',
    features: ['מקרים מבוססים על פסיקה אמיתית', 'משוב AI על טיעונים', 'תרחישים של מו"מ ופשרות'],
  },
]

// ── Stats ──────────────────────────────────────────────────────────────────────
const stats: { icon: React.ElementType; value: string; label: string; sub: string }[] = [
  { icon: Group, value: '15,000+', label: 'סטודנטים פעילים', sub: 'מ-7 פקולטות למשפטים' },
  { icon: QuizOutlined, value: '1,200+', label: 'שאלות מבחן', sub: 'מכוסות לפי סילבוס' },
  { icon: EmojiEvents, value: '91%', label: 'שיפור בציונים', sub: 'לאחר חודש שימוש' },
  { icon: LibraryBooksOutlined, value: '340+', label: 'נושאים משפטיים', sub: 'בכל ענפי המשפט' },
]

// ── Why LexStudy ────────────────────────────────────────────────────────────────
interface WhyItem {
  icon: React.ElementType
  title: string
  desc: string
  color: string
}

const whyItems: WhyItem[] = [
  {
    icon: PsychologyOutlined,
    title: 'מבוסס על מחקר פדגוגי',
    desc: 'השיטות שלנו מבוססות על מחקרי למידה מוכחים: חזרה מרווחת, אפקט הבדיקה (Testing Effect) ולמידה בהקשר — בדיוק כמו BARBRI ו-Quimbee.',
    color: '#6366f1',
  },
  {
    icon: BalanceOutlined,
    title: 'תוכן מותאם למשפט הישראלי',
    desc: 'כל השאלות, הפסיקות ודוגמאות המקרה מבוססות על חוק ישראלי: חוק החוזים, חוק העונשין, חוקי יסוד ופסיקת בית המשפט העליון.',
    color: '#14b8a6',
  },
  {
    icon: TrendingUp,
    title: 'מעקב התקדמות מדויק',
    desc: 'לוח בקרה אישי עם גרפי ביצועים, זיהוי פערים אוטומטי ותחזית ציון בכל מקצוע — כדי שתדע בדיוק איפה להתמקד.',
    color: '#f59e0b',
  },
  {
    icon: FlashOn,
    title: 'מהיר לתוצאות',
    desc: 'ממוצע של 3-4 שבועות לשיפור משמעותי בציונים. סטודנטים מדווחים על שיפור ממוצע של 15-20 נקודות לאחר חודש שימוש.',
    color: '#ec4899',
  },
]

// ── How It Works ────────────────────────────────────────────────────────────────
const steps = [
  {
    num: '01',
    title: 'בחר את הנושא',
    desc: 'בחר מתחומי המשפט שאתה לומד — חוזים, פלילי, חוקתי, נזיקין ועוד.',
    color: '#6366f1',
  },
  {
    num: '02',
    title: 'ענה על שאלות',
    desc: 'פתור שאלות רב-ברירה ומקרי ניתוח. קבל משוב מיידי עם הסברים מפורטים.',
    color: '#06b6d4',
  },
  {
    num: '03',
    title: 'AI מזהה פערים',
    desc: 'הפלטפורמה מנתחת את הביצועים שלך ובונה מסלול לימוד מותאם אישית.',
    color: '#f59e0b',
  },
  {
    num: '04',
    title: 'תרגל בסימולטור',
    desc: 'העמק את ההבנה עם תרחישים של בית משפט וירטואלי, מו"מ ועריכת חוזים.',
    color: '#34d399',
  },
]

// ── Testimonials ────────────────────────────────────────────────────────────────
const testimonials = [
  {
    name: 'שירה כהן',
    role: 'סטודנטית שנה ג׳, אוניברסיטת תל אביב',
    text: 'הסימולטור שינה לי את הגישה לחלוטין. תרגלתי הופעה בפני שופט וירטואלי לפני המוח"ש ונכנסתי עם ביטחון מלא. עליתי ב-18 נקודות.',
    initials: 'ש.כ',
    color: '#6366f1',
  },
  {
    name: 'יואב לוי',
    role: 'סטודנט שנה ב׳, האוניברסיטה העברית',
    text: 'המבחנים עם ההסברים לכל שאלה שווים כל הספרים שקניתי. הפלטפורמה מזהה בדיוק איפה אני נתקע ומכוונת אותי לנושאים הנכונים.',
    initials: 'י.ל',
    color: '#06b6d4',
  },
  {
    name: 'מיכל אברהם',
    role: 'סטודנטית שנה א׳, IDC הרצליה',
    text: 'כסטודנטית ראשונה שנה הייתי אבודה. LexStudy נתנה לי מפה ברורה — מאיפה להתחיל, מה לחזור, ואיך לתרגל. ממש חבל שלא מצאתי קודם.',
    initials: 'מ.א',
    color: '#f59e0b',
  },
]

// ── Exam categories ────────────────────────────────────────────────────────────
interface ExamCategory {
  icon: React.ElementType
  title: string
  count: string
  route: string
  color: string
}

const examCategories: ExamCategory[] = [
  { icon: BalanceOutlined, title: 'דיני חוזים', count: '18 מבחנים · 210 שאלות', route: '/legal-knowledge', color: '#6366f1' },
  { icon: Gavel, title: 'משפט פלילי', count: '14 מבחנים · 160 שאלות', route: '/legal-knowledge', color: '#ec4899' },
  { icon: PsychologyOutlined, title: 'משפט חוקתי וזכויות אדם', count: '12 מבחנים · 140 שאלות', route: '/legal-knowledge', color: '#14b8a6' },
  { icon: School, title: 'דיני נזיקין', count: '11 מבחנים · 130 שאלות', route: '/legal-knowledge', color: '#f59e0b' },
  { icon: WorkspacePremium, title: 'דיני עבודה', count: '9 מבחנים · 100 שאלות', route: '/legal-knowledge', color: '#8b5cf6' },
  { icon: FlashOn, title: 'מקורות המשפט', count: '16 מבחנים · 180 שאלות', route: '/legal-knowledge', color: '#0ea5e9' },
  { icon: LibraryBooksOutlined, title: 'דיני משפחה', count: '8 מבחנים · 90 שאלות', route: '/legal-knowledge', color: '#f43f5e' },
  { icon: TrendingUp, title: 'דיני קניין ומקרקעין', count: '7 מבחנים · 80 שאלות', route: '/legal-knowledge', color: '#10b981' },
]

// ── AnimatedCounter ────────────────────────────────────────────────────────────
const AnimatedCounter: React.FC<{ value: string }> = ({ value }) => {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  return (
    <span ref={ref} aria-label={value}>
      <motion.span initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ duration: 0.8 }}>
        {value}
      </motion.span>
    </span>
  )
}

// ── PillarCard ─────────────────────────────────────────────────────────────────
const PillarCard: React.FC<{ pillar: Pillar; index: number }> = ({ pillar, index }) => {
  const navigate = useNavigate()
  const Icon = pillar.icon
  return (
    <MotionCard
      custom={index}
      variants={fadeUp}
      onClick={() => navigate(pillar.route)}
      role="article"
      aria-label={pillar.title}
      tabIndex={0}
      onKeyDown={(e: React.KeyboardEvent) => { if (e.key === 'Enter') navigate(pillar.route) }}
      sx={{
        position: 'relative',
        overflow: 'hidden',
        cursor: 'pointer',
        borderRadius: 4,
        border: '1px solid',
        borderColor: 'divider',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.3s cubic-bezier(0.22,1,0.36,1), box-shadow 0.3s ease',
        '&:hover': { transform: 'translateY(-8px)', boxShadow: '0 24px 60px rgba(0,0,0,0.15)' },
        '&:focus-visible': { outline: '3px solid #6366f1', outlineOffset: 3 },
      }}
    >
      <Box aria-hidden="true" sx={{ height: 5, background: pillar.gradient, width: '100%', flexShrink: 0 }} />
      <Box sx={{ p: { xs: 3, md: 4 }, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Chip label={pillar.badge} size="small" sx={{ alignSelf: 'flex-start', mb: 3, background: (t) => alpha(t.palette.primary.main, 0.1), color: 'primary.main', fontWeight: 700, fontSize: '0.7rem' }} />
        <Box aria-hidden="true" sx={{ width: 68, height: 68, borderRadius: 3, background: pillar.gradient, display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 3, boxShadow: '0 8px 24px rgba(0,0,0,0.18)' }}>
          <Icon sx={{ fontSize: 34, color: '#fff' }} />
        </Box>
        <Typography variant="h5" fontWeight={800} gutterBottom sx={{ lineHeight: 1.2 }}>{pillar.title}</Typography>
        <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.7, flexGrow: 0, mb: 2 }}>{pillar.desc}</Typography>
        <Box component="ul" sx={{ m: 0, p: 0, listStyle: 'none', mb: 2 }}>
          {pillar.features.map((f) => (
            <Box component="li" key={f} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.8 }}>
              <CheckCircleOutline sx={{ fontSize: 15, color: 'success.main', flexShrink: 0 }} aria-hidden="true" />
              <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>{f}</Typography>
            </Box>
          ))}
        </Box>
        <Box sx={{ mt: 3, display: 'flex', alignItems: 'center', gap: 0.5, color: 'primary.main' }}>
          <Typography variant="body2" fontWeight={700}>התחל עכשיו</Typography>
          <ArrowForward sx={{ fontSize: 16 }} aria-hidden="true" />
        </Box>
      </Box>
    </MotionCard>
  )
}

// ── HomePage ───────────────────────────────────────────────────────────────────
export const HomePage: React.FC = () => {
  const { t: _t } = useTranslation()
  const navigate = useNavigate()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  const pillarsRef = useRef<HTMLDivElement>(null)
  const statsRef = useRef<HTMLDivElement>(null)
  const pillarsInView = useInView(pillarsRef, { once: true, margin: '-80px' })
  const statsInView = useInView(statsRef, { once: true, margin: '-80px' })
  const isDark = theme.palette.mode === 'dark'

  return (
    <Box component="main" sx={{ width: '100%', overflowX: 'hidden' }} aria-label="דף הבית - פלטפורמת לימוד משפט">

      {/* ── HERO ─────────────────────────────────────────────────────────────── */}
      <Box
        component="section"
        aria-labelledby="hero-heading"
        sx={{
          position: 'relative',
          minHeight: { xs: '92vh', md: '88vh' },
          display: 'flex',
          alignItems: 'center',
          overflow: 'hidden',
          background: isDark
            ? 'linear-gradient(160deg,#0f0f23 0%,#1a1a3e 40%,#0f172a 100%)'
            : 'linear-gradient(160deg,#0f0f23 0%,#1e1b4b 40%,#0c1445 100%)',
          mx: { xs: -2, sm: -3, md: -4 },
          px: { xs: 3, sm: 5, md: 8, lg: 12 },
          py: { xs: 10, md: 14 },
        }}
      >
        {/* decorative blobs */}
        <Box aria-hidden="true" sx={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
          {[
            { top: '-20%', right: '-10%', w: [400, 700], color: 'rgba(99,102,241,0.35)' },
            { bottom: '-15%', left: '-8%', w: [300, 600], color: 'rgba(6,182,212,0.25)' },
            { top: '40%', left: '30%', w: [200, 400], color: 'rgba(245,158,11,0.15)' },
          ].map((b, i) => (
            <Box key={i} sx={{ position: 'absolute', ...b, width: { xs: b.w[0], md: b.w[1] }, height: { xs: b.w[0], md: b.w[1] }, borderRadius: '50%', background: `radial-gradient(circle,${b.color} 0%,transparent 70%)`, filter: 'blur(60px)' }} />
          ))}
        </Box>
        {/* grid overlay */}
        <Box aria-hidden="true" sx={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.03) 1px,transparent 1px)', backgroundSize: '60px 60px', pointerEvents: 'none' }} />

        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={7}>
              <MotionBox initial="hidden" animate="visible" variants={stagger}>
                {/* badge */}
                <MotionBox variants={fadeUp} custom={0} sx={{ mb: 3 }}>
                  <Chip icon={<AutoAwesome sx={{ fontSize: 14, color: '#f59e0b !important' }} />} label="פלטפורמת לימוד משפטי מהדור הבא" sx={{ background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.4)', color: '#fbbf24', fontWeight: 700, fontSize: '0.75rem', height: 32 }} />
                </MotionBox>
                {/* headline */}
                <MotionBox variants={fadeUp} custom={1}>
                  <Typography id="hero-heading" component="h1" sx={{ fontSize: { xs: '2.4rem', sm: '3.2rem', md: '4rem', lg: '4.8rem' }, fontWeight: 900, lineHeight: 1.08, color: '#fff', mb: 1, letterSpacing: -1.5 }}>
                    לומד משפטים?
                  </Typography>
                  <Typography component="p" sx={{ fontSize: { xs: '2.4rem', sm: '3.2rem', md: '4rem', lg: '4.8rem' }, fontWeight: 900, lineHeight: 1.08, letterSpacing: -1.5, mb: 3, background: 'linear-gradient(90deg,#818cf8,#38bdf8,#fb923c)', backgroundClip: 'text', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    הגעת למקום הנכון.
                  </Typography>
                </MotionBox>
                {/* sub */}
                <MotionBox variants={fadeUp} custom={2}>
                  <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.65)', fontWeight: 400, lineHeight: 1.65, mb: 4, maxWidth: 540, fontSize: { xs: '1rem', md: '1.15rem' } }}>
                    מעל 1,200 שאלות מבחן, למידה מותאמת AI וסימולטור בית-משפט — הכל מבוסס על סילבוס הפקולטות ופסיקה ישראלית מעודכנת ל-2026.
                  </Typography>
                </MotionBox>
                {/* CTAs */}
                <MotionBox variants={fadeUp} custom={3} sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  <Button variant="contained" size="large" onClick={() => navigate('/legal-knowledge')} aria-label="התחל ללמוד - עבור לדף מבחנים" endIcon={<ArrowForward aria-hidden="true" />} sx={{ px: 4, py: 1.6, fontSize: '1.05rem', fontWeight: 800, borderRadius: 3, background: 'linear-gradient(135deg,#6366f1 0%,#818cf8 100%)', boxShadow: '0 8px 30px rgba(99,102,241,0.5)', color: '#fff', '&:hover': { background: 'linear-gradient(135deg,#4f46e5 0%,#6366f1 100%)', boxShadow: '0 12px 40px rgba(99,102,241,0.6)', transform: 'translateY(-2px)' }, transition: 'all 0.25s ease' }}>
                    התחל ללמוד בחינם
                  </Button>
                  <Button variant="outlined" size="large" onClick={() => navigate('/simulator')} aria-label="נסה את סימולטור בית המשפט" startIcon={<PlayCircleOutline aria-hidden="true" />} sx={{ px: 4, py: 1.6, fontSize: '1.05rem', fontWeight: 700, borderRadius: 3, color: '#fff', border: '2px solid rgba(255,255,255,0.25)', backdropFilter: 'blur(8px)', '&:hover': { border: '2px solid rgba(255,255,255,0.6)', background: 'rgba(255,255,255,0.08)', transform: 'translateY(-2px)' }, transition: 'all 0.25s ease' }}>
                    נסה את הסימולטור
                  </Button>
                  <Button variant="text" size="large" onClick={() => navigate('/services')} aria-label="שירותים מקצועיים לעורכי דין" sx={{ px: 3, py: 1.6, fontSize: '0.95rem', fontWeight: 600, borderRadius: 3, color: 'rgba(255,255,255,0.55)', '&:hover': { color: 'rgba(255,255,255,0.9)', background: 'rgba(255,255,255,0.05)' }, transition: 'all 0.25s ease' }}>
                    שירותים מקצועיים ←
                  </Button>
                </MotionBox>
                {/* trust line */}
                <MotionBox variants={fadeUp} custom={4} sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mt: 4, flexWrap: 'wrap' }}>
                  {['ללא צורך בהרשמה', '1,200+ שאלות', 'פסיקה ישראלית עדכנית'].map((item) => (
                    <Stack key={item} direction="row" alignItems="center" spacing={0.5}>
                      <CheckCircleOutline sx={{ fontSize: 15, color: '#34d399' }} aria-hidden="true" />
                      <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)', fontWeight: 600 }}>{item}</Typography>
                    </Stack>
                  ))}
                </MotionBox>
              </MotionBox>
            </Grid>

            {/* floating cards visual */}
            {!isMobile && (
              <Grid item md={5} sx={{ display: { xs: 'none', md: 'block' } }}>
                <MotionBox initial={{ opacity: 0, x: 60, scale: 0.94 }} animate={{ opacity: 1, x: 0, scale: 1 }} transition={{ duration: 0.9, delay: 0.3, ease: easeOut }} aria-hidden="true" sx={{ position: 'relative', height: 420 }}>
                  {/* exam result card */}
                  <Box sx={{ position: 'absolute', top: 0, right: 0, width: 280, p: 2.5, borderRadius: 3, background: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.12)', boxShadow: '0 20px 60px rgba(0,0,0,0.4)' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                      <Box sx={{ width: 36, height: 36, borderRadius: 2, background: 'linear-gradient(135deg,#6366f1,#818cf8)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><QuizOutlined sx={{ fontSize: 20, color: '#fff' }} /></Box>
                      <Box>
                        <Typography sx={{ color: '#fff', fontWeight: 700, fontSize: '0.85rem' }}>מבחן דיני חוזים — סעיף 14</Typography>
                        <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.72rem' }}>40 שאלות · שאלות ניתוח פסיקה</Typography>
                      </Box>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                      <Box>
                        <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.72rem', mb: 0.5 }}>ציון</Typography>
                        <Typography sx={{ color: '#34d399', fontSize: '2rem', fontWeight: 900, lineHeight: 1 }}>94%</Typography>
                      </Box>
                      <Chip label="עלית בדרגה! 🏆" size="small" sx={{ background: 'rgba(52,211,153,0.15)', color: '#34d399', fontWeight: 700, fontSize: '0.7rem' }} />
                    </Box>
                  </Box>
                  {/* progress card */}
                  <Box sx={{ position: 'absolute', top: 150, left: 0, width: 260, p: 2.5, borderRadius: 3, background: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.12)', boxShadow: '0 20px 60px rgba(0,0,0,0.4)' }}>
                    <Typography sx={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.72rem', mb: 1.5, fontWeight: 600 }}>התקדמות שבועית</Typography>
                    {['דיני חוזים', 'משפט חוקתי', 'דיני נזיקין'].map((topic, i) => (
                      <Box key={topic} sx={{ mb: 1.5 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.4 }}>
                          <Typography sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.72rem' }}>{topic}</Typography>
                          <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.72rem' }}>{[78, 61, 45][i]}%</Typography>
                        </Box>
                        <Box sx={{ height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.08)', overflow: 'hidden' }}>
                          <Box sx={{ height: '100%', width: `${[78, 61, 45][i]}%`, borderRadius: 2, background: ['#6366f1', '#06b6d4', '#f59e0b'][i] }} />
                        </Box>
                      </Box>
                    ))}
                  </Box>
                  {/* simulator badge */}
                  <Box sx={{ position: 'absolute', bottom: 0, right: 20, p: 2, borderRadius: 3, background: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.12)', boxShadow: '0 20px 60px rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Box sx={{ width: 40, height: 40, borderRadius: 2, background: 'linear-gradient(135deg,#f59e0b,#d97706)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Gavel sx={{ fontSize: 22, color: '#fff' }} /></Box>
                    <Box>
                      <Typography sx={{ color: '#fff', fontWeight: 700, fontSize: '0.85rem' }}>סימולטור בית משפט</Typography>
                      <Typography sx={{ color: '#34d399', fontSize: '0.72rem', fontWeight: 600 }}>● פעיל עכשיו</Typography>
                    </Box>
                  </Box>
                </MotionBox>
              </Grid>
            )}
          </Grid>
        </Container>
      </Box>

      {/* ── PILLARS ──────────────────────────────────────────────────────────── */}
      <Box ref={pillarsRef} component="section" aria-labelledby="pillars-heading" sx={{ py: { xs: 8, md: 12 } }}>
        <Container maxWidth="lg">
          <MotionBox initial="hidden" animate={pillarsInView ? 'visible' : 'hidden'} variants={stagger}>
            <MotionBox variants={fadeUp} custom={0} sx={{ textAlign: 'center', mb: 8 }}>
              <Chip label="שלושת עמודי הלמידה" size="small" sx={{ mb: 2, background: (t) => alpha(t.palette.primary.main, 0.08), color: 'primary.main', fontWeight: 700, fontSize: '0.72rem', letterSpacing: 1 }} />
              <Typography id="pillars-heading" variant="h3" component="h2" fontWeight={900} sx={{ fontSize: { xs: '2rem', md: '2.6rem' }, letterSpacing: -0.5, mb: 1.5 }}>
                כל מה שצריך ללמוד משפט
              </Typography>
              <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 400, maxWidth: 520, mx: 'auto', lineHeight: 1.6 }}>
                שלוש דרכים ללמידה שמשתלבות לחוויה מלאה ומדויקת
              </Typography>
            </MotionBox>
            <Grid container spacing={3} alignItems="stretch">
              {pillars.map((pillar, index) => (
                <Grid item xs={12} md={4} key={pillar.route} sx={{ display: 'flex' }}>
                  <MotionBox variants={fadeUp} custom={index + 1} sx={{ width: '100%' }}>
                    <PillarCard pillar={pillar} index={index} />
                  </MotionBox>
                </Grid>
              ))}
            </Grid>
          </MotionBox>
        </Container>
      </Box>

      {/* ── STATS ────────────────────────────────────────────────────────────── */}
      <Box ref={statsRef} component="section" aria-label="סטטיסטיקות הפלטפורמה" sx={{ py: { xs: 8, md: 10 }, mx: { xs: -2, sm: -3, md: -4 }, px: { xs: 3, sm: 5, md: 8 }, background: 'linear-gradient(135deg,#1e1b4b 0%,#0f0f23 100%)', position: 'relative', overflow: 'hidden' }}>
        <Box aria-hidden="true" sx={{ position: 'absolute', top: -100, right: -100, width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle,rgba(99,102,241,0.2) 0%,transparent 70%)', filter: 'blur(80px)', pointerEvents: 'none' }} />
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Grid container spacing={4}>
            {stats.map((stat, i) => {
              const StatIcon = stat.icon
              return (
                <Grid item xs={6} md={3} key={stat.label}>
                  <MotionBox initial="hidden" animate={statsInView ? 'visible' : 'hidden'} variants={fadeUp} custom={i} sx={{ textAlign: 'center' }}>
                    <Box aria-hidden="true" sx={{ width: 56, height: 56, borderRadius: 2.5, background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 2 }}>
                      <StatIcon sx={{ fontSize: 28, color: '#818cf8' }} />
                    </Box>
                    <Typography component="p" sx={{ fontSize: { xs: '2rem', md: '2.6rem' }, fontWeight: 900, color: '#fff', lineHeight: 1, mb: 0.5 }}>
                      <AnimatedCounter value={stat.value} />
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.75)', fontWeight: 700, mb: 0.3 }}>{stat.label}</Typography>
                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)', fontWeight: 500 }}>{stat.sub}</Typography>
                  </MotionBox>
                </Grid>
              )
            })}
          </Grid>
        </Container>
      </Box>

      {/* ── EXAM CATEGORIES ──────────────────────────────────────────────────── */}
      <Box component="section" aria-labelledby="categories-heading" sx={{ py: { xs: 8, md: 12 } }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 7 }}>
            <Chip label="קטלוג מבחנים" size="small" sx={{ mb: 2, background: (t) => alpha(t.palette.primary.main, 0.08), color: 'primary.main', fontWeight: 700, fontSize: '0.72rem', letterSpacing: 1 }} />
            <Typography id="categories-heading" variant="h3" component="h2" fontWeight={900} sx={{ fontSize: { xs: '2rem', md: '2.6rem' }, letterSpacing: -0.5, mb: 1.5 }}>גלה את תחומי המשפט</Typography>
            <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 400, lineHeight: 1.6 }}>מבחנים מקיפים בכל תחומי המשפט הישראלי</Typography>
          </Box>
          <Grid container spacing={2.5}>
            {examCategories.map((cat, i) => {
              const CatIcon = cat.icon
              return (
                <Grid item xs={12} sm={6} md={3} key={cat.title}>
                  <MotionBox initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-60px' }} variants={fadeUp} custom={i}>
                    <Box
                      component="button"
                      onClick={() => navigate(cat.route)}
                      aria-label={`${cat.title} - ${cat.count}`}
                      sx={{ width: '100%', display: 'flex', alignItems: 'center', gap: 2, p: 2.5, borderRadius: 3, border: '1px solid', borderColor: 'divider', background: 'background.paper', cursor: 'pointer', textAlign: 'start', transition: 'all 0.25s ease', '&:hover': { borderColor: cat.color, transform: 'translateY(-3px)', boxShadow: `0 12px 32px ${cat.color}22` }, '&:focus-visible': { outline: `3px solid ${cat.color}`, outlineOffset: 2 } }}
                    >
                      <Box aria-hidden="true" sx={{ width: 48, height: 48, borderRadius: 2, background: `${cat.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <CatIcon sx={{ fontSize: 26, color: cat.color }} />
                      </Box>
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="body1" fontWeight={700} sx={{ mb: 0.3 }}>{cat.title}</Typography>
                        <Typography variant="caption" color="text.secondary" fontWeight={500}>{cat.count}</Typography>
                      </Box>
                      <ArrowForward sx={{ fontSize: 18, color: 'text.disabled', flexShrink: 0 }} aria-hidden="true" />
                    </Box>
                  </MotionBox>
                </Grid>
              )
            })}
          </Grid>
          <Box sx={{ textAlign: 'center', mt: 5 }}>
            <Button variant="outlined" size="large" onClick={() => navigate('/legal-knowledge')} aria-label="צפה בכל המבחנים" endIcon={<ArrowForward aria-hidden="true" />} sx={{ px: 5, py: 1.5, borderRadius: 3, fontWeight: 700, borderWidth: 2, '&:hover': { borderWidth: 2, transform: 'translateY(-2px)' }, transition: 'all 0.25s ease' }}>
              כל המבחנים
            </Button>
          </Box>
        </Container>
      </Box>

      {/* ── HOW IT WORKS ─────────────────────────────────────────────────────── */}
      <Box component="section" aria-labelledby="how-heading" sx={{ py: { xs: 8, md: 12 }, mx: { xs: -2, sm: -3, md: -4 }, px: { xs: 3, sm: 5, md: 8 }, background: (t) => t.palette.mode === 'dark' ? 'rgba(255,255,255,0.02)' : 'rgba(99,102,241,0.03)', borderTop: '1px solid', borderBottom: '1px solid', borderColor: 'divider' }}>
        <Container maxWidth="lg">
          <MotionBox initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }} variants={stagger}>
            <MotionBox variants={fadeUp} custom={0} sx={{ textAlign: 'center', mb: 8 }}>
              <Chip label="איך זה עובד" size="small" sx={{ mb: 2, background: (t) => alpha(t.palette.primary.main, 0.08), color: 'primary.main', fontWeight: 700, fontSize: '0.72rem', letterSpacing: 1 }} />
              <Typography id="how-heading" variant="h3" component="h2" fontWeight={900} sx={{ fontSize: { xs: '2rem', md: '2.6rem' }, letterSpacing: -0.5, mb: 1.5 }}>
                ארבעה צעדים להצלחה
              </Typography>
              <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 400, maxWidth: 480, mx: 'auto', lineHeight: 1.6 }}>
                מתחילים ומתקדמים — הדרך שלך ללמידה חכמה
              </Typography>
            </MotionBox>
            <Grid container spacing={3}>
              {steps.map((step, i) => (
                <Grid item xs={12} sm={6} md={3} key={step.num}>
                  <MotionBox variants={fadeUp} custom={i + 1} sx={{ textAlign: 'center', p: 3 }}>
                    <Box sx={{ width: 64, height: 64, borderRadius: 3, background: `${step.color}18`, border: `2px solid ${step.color}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 2.5 }}>
                      <Typography sx={{ fontSize: '1.4rem', fontWeight: 900, color: step.color }}>{step.num}</Typography>
                    </Box>
                    <Typography variant="h6" fontWeight={800} gutterBottom>{step.title}</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>{step.desc}</Typography>
                  </MotionBox>
                </Grid>
              ))}
            </Grid>
          </MotionBox>
        </Container>
      </Box>

      {/* ── WHY LEXSTUDY ─────────────────────────────────────────────────────── */}
      <Box component="section" aria-labelledby="why-heading" sx={{ py: { xs: 8, md: 12 } }}>
        <Container maxWidth="lg">
          <MotionBox initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }} variants={stagger}>
            <MotionBox variants={fadeUp} custom={0} sx={{ textAlign: 'center', mb: 8 }}>
              <Chip label="למה LexStudy?" size="small" sx={{ mb: 2, background: (t) => alpha(t.palette.primary.main, 0.08), color: 'primary.main', fontWeight: 700, fontSize: '0.72rem', letterSpacing: 1 }} />
              <Typography id="why-heading" variant="h3" component="h2" fontWeight={900} sx={{ fontSize: { xs: '2rem', md: '2.6rem' }, letterSpacing: -0.5, mb: 1.5 }}>
                הגישה שמשנה תוצאות
              </Typography>
              <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 400, maxWidth: 520, mx: 'auto', lineHeight: 1.6 }}>
                מבוסס על שיטות הלמידה המוכחות של פלטפורמות כמו Quimbee ו-BARBRI, מותאם לחוק הישראלי
              </Typography>
            </MotionBox>
            <Grid container spacing={3}>
              {whyItems.map((item, i) => {
                const WhyIcon = item.icon
                return (
                  <Grid item xs={12} sm={6} key={item.title}>
                    <MotionBox variants={fadeUp} custom={i + 1}>
                      <Box sx={{ display: 'flex', gap: 3, p: 3.5, borderRadius: 3, border: '1px solid', borderColor: 'divider', '&:hover': { borderColor: item.color, boxShadow: `0 8px 24px ${item.color}18` }, transition: 'all 0.25s ease', height: '100%' }}>
                        <Box sx={{ width: 52, height: 52, borderRadius: 2.5, background: `${item.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }} aria-hidden="true">
                          <WhyIcon sx={{ fontSize: 28, color: item.color }} />
                        </Box>
                        <Box>
                          <Typography variant="h6" fontWeight={800} gutterBottom>{item.title}</Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.75 }}>{item.desc}</Typography>
                        </Box>
                      </Box>
                    </MotionBox>
                  </Grid>
                )
              })}
            </Grid>
          </MotionBox>
        </Container>
      </Box>

      {/* ── TESTIMONIALS ─────────────────────────────────────────────────────── */}
      <Box component="section" aria-labelledby="testimonials-heading" sx={{ py: { xs: 8, md: 12 }, mx: { xs: -2, sm: -3, md: -4 }, px: { xs: 3, sm: 5, md: 8 }, background: 'linear-gradient(160deg,#0f0f23 0%,#1a1a3e 100%)', position: 'relative', overflow: 'hidden' }}>
        <Box aria-hidden="true" sx={{ position: 'absolute', top: -80, right: -80, width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle,rgba(99,102,241,0.18) 0%,transparent 70%)', filter: 'blur(80px)', pointerEvents: 'none' }} />
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <MotionBox initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }} variants={stagger}>
            <MotionBox variants={fadeUp} custom={0} sx={{ textAlign: 'center', mb: 7 }}>
              <Chip label="מה אומרים הסטודנטים" size="small" sx={{ mb: 2, background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.3)', color: '#fbbf24', fontWeight: 700, fontSize: '0.72rem' }} />
              <Typography id="testimonials-heading" variant="h3" component="h2" fontWeight={900} sx={{ color: '#fff', fontSize: { xs: '2rem', md: '2.6rem' }, letterSpacing: -0.5 }}>
                סטודנטים שכבר מצליחים
              </Typography>
            </MotionBox>
            <Grid container spacing={3}>
              {testimonials.map((t, i) => (
                <Grid item xs={12} md={4} key={t.name}>
                  <MotionBox variants={fadeUp} custom={i + 1}>
                    <Box sx={{ p: 3.5, borderRadius: 3, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(12px)', height: '100%', display: 'flex', flexDirection: 'column' }}>
                      <Box sx={{ display: 'flex', gap: 0.3, mb: 2 }} aria-label="5 כוכבים">
                        {[...Array(5)].map((_, si) => <Star key={si} sx={{ fontSize: 16, color: '#fbbf24' }} aria-hidden="true" />)}
                      </Box>
                      <FormatQuote sx={{ fontSize: 32, color: t.color, mb: 1, transform: 'rotate(180deg)' }} aria-hidden="true" />
                      <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.82)', lineHeight: 1.75, flexGrow: 1, fontStyle: 'italic', mb: 2.5 }}>
                        {t.text}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Box sx={{ width: 40, height: 40, borderRadius: '50%', background: `${t.color}30`, border: `2px solid ${t.color}60`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Typography sx={{ color: t.color, fontWeight: 800, fontSize: '0.78rem' }}>{t.initials}</Typography>
                        </Box>
                        <Box>
                          <Typography sx={{ color: '#fff', fontWeight: 700, fontSize: '0.88rem' }}>{t.name}</Typography>
                          <Typography sx={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.75rem' }}>{t.role}</Typography>
                        </Box>
                      </Box>
                    </Box>
                  </MotionBox>
                </Grid>
              ))}
            </Grid>
          </MotionBox>
        </Container>
      </Box>

      {/* ── CTA BANNER ───────────────────────────────────────────────────────── */}
      <Box component="section" aria-labelledby="cta-heading" sx={{ py: { xs: 8, md: 12 }, mx: { xs: -2, sm: -3, md: -4 }, px: { xs: 3, sm: 5, md: 8 }, mb: { xs: -2, sm: -3, md: -4 }, background: 'linear-gradient(135deg,#6366f1 0%,#4f46e5 50%,#3730a3 100%)', position: 'relative', overflow: 'hidden' }}>
        <Box aria-hidden="true" sx={{ position: 'absolute', top: -80, left: -80, width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle,rgba(255,255,255,0.12) 0%,transparent 70%)', filter: 'blur(40px)', pointerEvents: 'none' }} />
        <Box aria-hidden="true" sx={{ position: 'absolute', bottom: -80, right: -80, width: 350, height: 350, borderRadius: '50%', background: 'radial-gradient(circle,rgba(245,158,11,0.25) 0%,transparent 70%)', filter: 'blur(50px)', pointerEvents: 'none' }} />
        <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
          <MotionBox initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }} variants={stagger}>
            <MotionBox variants={fadeUp} custom={0}>
              <Box aria-hidden="true" sx={{ mb: 2 }}><TrendingUp sx={{ fontSize: 48, color: 'rgba(255,255,255,0.6)' }} /></Box>
              <Typography id="cta-heading" variant="h3" component="h2" fontWeight={900} sx={{ color: '#fff', fontSize: { xs: '1.8rem', md: '2.6rem' }, letterSpacing: -0.5, mb: 2 }}>
                מוכן להתחיל?
              </Typography>
              <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.75)', fontWeight: 400, mb: 4, lineHeight: 1.6 }}>
                הצטרף ל-15,000+ סטודנטים שכבר לומדים משפטים בצורה החכמה ביותר
              </Typography>
            </MotionBox>
            <MotionBox variants={fadeUp} custom={1} sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Button variant="contained" size="large" onClick={() => navigate('/legal-knowledge')} aria-label="התחל ללמוד עכשיו בחינם" endIcon={<ArrowForward aria-hidden="true" />} sx={{ px: 5, py: 1.7, fontSize: '1.05rem', fontWeight: 800, borderRadius: 3, background: '#fff', color: '#4f46e5', boxShadow: '0 8px 30px rgba(0,0,0,0.25)', '&:hover': { background: '#f0f0ff', transform: 'translateY(-3px)', boxShadow: '0 16px 40px rgba(0,0,0,0.3)' }, transition: 'all 0.25s ease' }}>
                התחל עכשיו  בחינם
              </Button>
              <Button variant="text" size="large" onClick={() => navigate('/simulator')} aria-label="נסה את הסימולטור" sx={{ px: 4, py: 1.7, fontSize: '1.05rem', fontWeight: 700, borderRadius: 3, color: 'rgba(255,255,255,0.9)', '&:hover': { background: 'rgba(255,255,255,0.1)', color: '#fff' }, transition: 'all 0.25s ease' }}>
                נסה את הסימולטור
              </Button>
            </MotionBox>
            <MotionBox variants={fadeUp} custom={2} sx={{ display: 'flex', gap: 1.5, justifyContent: 'center', flexWrap: 'wrap', mt: 4 }}>
              {['ללא כרטיס אשראי', 'גישה מלאה למבחנים', 'תמיכה בעברית'].map((item) => (
                <Stack key={item} direction="row" alignItems="center" spacing={0.5}>
                  <CheckCircleOutline sx={{ fontSize: 15, color: 'rgba(255,255,255,0.7)' }} aria-hidden="true" />
                  <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)', fontWeight: 600 }}>{item}</Typography>
                </Stack>
              ))}
            </MotionBox>
          </MotionBox>
        </Container>
      </Box>

    </Box>
  )
}

export default HomePage

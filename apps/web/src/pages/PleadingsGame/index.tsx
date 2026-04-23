import React, { useState, useCallback, useRef } from 'react'
import {
  Box, Container, Typography, Button, Card, CardContent, Grid,
  Chip, LinearProgress, Alert, CircularProgress, Divider,
  Accordion, AccordionSummary, AccordionDetails, Tooltip,
  Dialog, DialogTitle, DialogContent, DialogActions, Paper,
  Stepper, Step, StepLabel, Badge, IconButton, Tab, Tabs,
} from '@mui/material'
import {
  Gavel, Balance, Security, EmojiEvents, Lightbulb,
  ExpandMore, CheckCircle, Cancel, ArrowForward, ArrowBack,
  School, Psychology, MenuBook, Timer, Star, Info,
  PlayArrow, Refresh, AutoFixHigh,
} from '@mui/icons-material'
import { useTranslation } from 'react-i18next'
import { axiosClient } from '@/services/api/axiosClient'

// ────────────────────────────────────────────────────
// Types (mirrored from backend)
// ────────────────────────────────────────────────────
type GameStage = 'investigation' | 'indictment' | 'defense_response' | 'pretrial' | 'evidence' | 'summation' | 'verdict'
type PlayerRole = 'prosecutor' | 'defense' | 'judge'
type Difficulty = 'easy' | 'medium' | 'hard'

interface CaseEvidence {
  id: string; type: string; description: string; strength: 'strong' | 'medium' | 'weak'
}
interface CaseScenario {
  id: string; category: string; difficulty: Difficulty; title: string; facts: string
  charges: string[]; evidence: CaseEvidence[]; defendant: string; prosecutor: string
  court: string; fundamentalRightsAtRisk: string[]; maxSentence: string
}
interface EvaluationResult {
  score: number
  breakdown: { factualAccuracy: number; legalClarity: number; brevity: number; fundamentalRights: number; legalLanguage: number; logicalOrder: number }
  feedback: string; improvements: string[]; strongPoints: string[]; suggestedPhrases: string[]
  grade: 'מצוין' | 'טוב' | 'עובר' | 'נכשל'
}
interface FundamentalRight {
  name: string; law: string; description: string; relevantStages: string[]
}

// ────────────────────────────────────────────────────
// Constants
// ────────────────────────────────────────────────────
const STAGES: { key: GameStage; label: string; icon: React.ReactNode }[] = [
  { key: 'investigation', label: 'חקירה', icon: <Psychology fontSize="small" /> },
  { key: 'indictment', label: 'כתב אישום', icon: <Gavel fontSize="small" /> },
  { key: 'defense_response', label: 'תגובת הגנה', icon: <Security fontSize="small" /> },
  { key: 'pretrial', label: 'קדם משפט', icon: <MenuBook fontSize="small" /> },
  { key: 'evidence', label: 'הוכחות', icon: <Balance fontSize="small" /> },
  { key: 'summation', label: 'סיכומים', icon: <School fontSize="small" /> },
  { key: 'verdict', label: 'גזר דין', icon: <EmojiEvents fontSize="small" /> },
]

const ROLE_LABELS: Record<PlayerRole, string> = {
  prosecutor: '⚖️ תובע',
  defense: '🛡️ סנגור',
  judge: '👨‍⚖️ שופט',
}

const DIFFICULTY_LABELS: Record<Difficulty, { label: string; color: 'success' | 'warning' | 'error' }> = {
  easy: { label: 'קל', color: 'success' },
  medium: { label: 'בינוני', color: 'warning' },
  hard: { label: 'קשה', color: 'error' },
}

const CATEGORY_ICONS: Record<string, string> = {
  assault: '🥊', theft: '💼', fraud: '🎭', homicide: '⚔️',
  drug: '💊', weapon: '🔫', traffic: '🚗', financial: '💰',
}

// ────────────────────────────────────────────────────
// Sub-components
// ────────────────────────────────────────────────────
function ScoreBar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <Box sx={{ mb: 1 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.3 }}>
        <Typography variant="caption" color="text.secondary">{label}</Typography>
        <Typography variant="caption" fontWeight="bold">{value}%</Typography>
      </Box>
      <LinearProgress
        variant="determinate" value={value}
        sx={{ height: 8, borderRadius: 4, bgcolor: 'grey.200', '& .MuiLinearProgress-bar': { bgcolor: color, borderRadius: 4 } }}
      />
    </Box>
  )
}

function EvidenceCard({ ev }: { ev: CaseEvidence }) {
  const typeIcon: Record<string, string> = { witness: '👤', document: '📄', forensic: '🔬', cctv: '📹', financial: '💳' }
  const strengthColor: Record<string, 'success' | 'warning' | 'error'> = { strong: 'success', medium: 'warning', weak: 'error' }
  const strengthLabel: Record<string, string> = { strong: 'חזקה', medium: 'בינונית', weak: 'חלשה' }
  return (
    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, py: 0.8, borderBottom: '1px solid', borderColor: 'divider' }}>
      <Typography fontSize={20}>{typeIcon[ev.type] ?? '📋'}</Typography>
      <Box flex={1}>
        <Typography variant="body2">{ev.description}</Typography>
        <Chip label={strengthLabel[ev.strength]} color={strengthColor[ev.strength]} size="small" sx={{ mt: 0.3, height: 18, fontSize: 10 }} />
      </Box>
    </Box>
  )
}

// ────────────────────────────────────────────────────
// Main Page
// ────────────────────────────────────────────────────
type Screen = 'lobby' | 'role-select' | 'case-select' | 'game' | 'result'

export const PleadingsGamePage: React.FC = () => {
  const { i18n } = useTranslation()
  const isRtl = i18n.language !== 'en'

  // Navigation state
  const [screen, setScreen] = useState<Screen>('lobby')
  const [selectedRole, setSelectedRole] = useState<PlayerRole>('prosecutor')
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>('easy')
  const [selectedCase, setSelectedCase] = useState<CaseScenario | null>(null)
  const [currentStageIdx, setCurrentStageIdx] = useState(0)

  // Data state
  const [cases, setCases] = useState<CaseScenario[]>([])
  const [rights, setRights] = useState<FundamentalRight[]>([])
  const [hints, setHints] = useState<string[]>([])
  const [suggestedPhrases, setSuggestedPhrases] = useState<string[]>([])
  const [evaluation, setEvaluation] = useState<EvaluationResult | null>(null)
  const [stageHistory, setStageHistory] = useState<Array<{ stage: GameStage; score: number; text: string }>>([])

  // Editor state
  const [pleadingText, setPleadingText] = useState('')
  const [loading, setLoading] = useState(false)
  const [evaluating, setEvaluating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [tabIdx, setTabIdx] = useState(0)
  const [showRightsDialog, setShowRightsDialog] = useState(false)
  const [timeLeft, setTimeLeft] = useState<number | null>(null)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const textAreaRef = useRef<HTMLTextAreaElement>(null)

  const currentStage = STAGES[currentStageIdx]
  const totalScore = stageHistory.length > 0
    ? Math.round(stageHistory.reduce((s, h) => s + h.score, 0) / stageHistory.length)
    : 0

  // ── Load cases ──
  const loadCases = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await axiosClient.get<{ cases: CaseScenario[] }>('/pleadings-game/cases')
      const filtered = res.data.cases.filter((c) => c.difficulty === selectedDifficulty)
      setCases(filtered.length > 0 ? filtered : res.data.cases)
    } catch {
      setError('לא ניתן לטעון תיקים — בדוק חיבור לשרת')
    } finally {
      setLoading(false)
    }
  }, [selectedDifficulty])

  const loadRights = useCallback(async () => {
    try {
      const res = await axiosClient.get<{ rights: FundamentalRight[] }>('/pleadings-game/rights')
      setRights(res.data.rights)
    } catch { /* fail silently */ }
  }, [])

  const loadHint = useCallback(async () => {
    if (!currentStage) return
    try {
      const res = await axiosClient.post<{ hint: string; examplePhrase: string; legalBasis: string }>(
        '/pleadings-game/hint',
        { stage: currentStage.key, role: selectedRole },
      )
      setHints((prev) => [...prev.slice(-4), `💡 ${res.data.hint}`])
      if (res.data.examplePhrase) {
        setSuggestedPhrases((prev) => [...new Set([...prev, res.data.examplePhrase])])
      }
    } catch { /* fail silently */ }
  }, [currentStage, selectedRole])

  // ── Start game ──
  const startGame = useCallback((caseItem: CaseScenario) => {
    setSelectedCase(caseItem)
    setCurrentStageIdx(0)
    setPleadingText('')
    setStageHistory([])
    setEvaluation(null)
    setHints([])
    setSuggestedPhrases([])
    setError(null)
    setScreen('game')
    loadRights()
    // Start timer (5 min per stage)
    setTimeLeft(300)
    if (timerRef.current) clearInterval(timerRef.current)
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t !== null && t <= 1) {
          clearInterval(timerRef.current!)
          return 0
        }
        return t !== null ? t - 1 : null
      })
    }, 1000)
  }, [loadRights])

  // ── Submit pleading ──
  const submitPleading = useCallback(async () => {
    if (!selectedCase || !currentStage || pleadingText.trim().length < 10) return
    setEvaluating(true)
    setError(null)
    try {
      const res = await axiosClient.post<EvaluationResult>('/pleadings-game/evaluate', {
        text: pleadingText,
        stage: currentStage.key,
        role: selectedRole,
        caseId: selectedCase.id,
      })
      setEvaluation(res.data)
      setStageHistory((prev) => [...prev, { stage: currentStage.key, score: res.data.score, text: pleadingText }])
      if (timerRef.current) clearInterval(timerRef.current)
    } catch (e) {
      setError('שגיאה בהערכה — בדוק חיבור לשרת')
    } finally {
      setEvaluating(false)
    }
  }, [selectedCase, currentStage, pleadingText, selectedRole])

  const nextStage = useCallback(() => {
    if (currentStageIdx < STAGES.length - 1) {
      setCurrentStageIdx((i) => i + 1)
      setPleadingText('')
      setEvaluation(null)
      setHints([])
      setTimeLeft(300)
      if (timerRef.current) clearInterval(timerRef.current)
      timerRef.current = setInterval(() => {
        setTimeLeft((t) => (t !== null && t > 0 ? t - 1 : 0))
      }, 1000)
    } else {
      setScreen('result')
    }
  }, [currentStageIdx])

  const insertPhrase = (phrase: string) => {
    setPleadingText((prev) => prev + (prev.endsWith(' ') || prev === '' ? '' : ' ') + phrase + ' ')
    textAreaRef.current?.focus()
  }

  const formatTime = (sec: number) => `${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, '0')}`

  const getGradeColor = (grade: string) => {
    if (grade === 'מצוין') return '#2e7d32'
    if (grade === 'טוב') return '#1565c0'
    if (grade === 'עובר') return '#e65100'
    return '#c62828'
  }

  // ────────────────────────────────────────────────────
  // Render screens
  // ────────────────────────────────────────────────────

  // LOBBY
  if (screen === 'lobby') {
    return (
      <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0d1b2a 0%, #1a3a5c 50%, #0d1b2a 100%)', py: 8 }}>
        <Container maxWidth="md">
          <Box textAlign="center" mb={6}>
            <Typography fontSize={72} mb={1}>⚖️</Typography>
            <Typography variant="h3" color="white" fontWeight={800} gutterBottom>
              מסלול כתבי טענות
            </Typography>
            <Typography variant="h6" color="rgba(255,255,255,0.7)" gutterBottom>
              אמן את כישורי הניסוח המשפטי שלך • כתב אישום • הגנה • גזר דין
            </Typography>
            <Chip label="מבוסס AI + דיני ישראל" color="primary" sx={{ mt: 1 }} />
          </Box>

          <Grid container spacing={3} mb={4}>
            {[
              { icon: '📝', title: 'כתיבה מדויקת', desc: 'אמן שימוש בשפה משפטית מדויקת ומקצועית' },
              { icon: '🤖', title: 'הערכת AI', desc: 'קבל ניקוד ומשוב מיידי על כל כתב טענות' },
              { icon: '⚖️', title: 'זכויות יסוד', desc: 'למד לשלב הגנה על זכויות חוקתיות בטיעוניך' },
              { icon: '🏛️', title: '7 שלבים', desc: 'מחקירה ועד גזר דין — סימולציה מלאה' },
            ].map((f) => (
              <Grid item xs={12} sm={6} key={f.title}>
                <Card sx={{ bgcolor: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)' }}>
                  <CardContent sx={{ textAlign: 'center', py: 3 }}>
                    <Typography fontSize={40}>{f.icon}</Typography>
                    <Typography variant="h6" color="white" fontWeight={700}>{f.title}</Typography>
                    <Typography variant="body2" color="rgba(255,255,255,0.6)" mt={0.5}>{f.desc}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          <Box textAlign="center">
            <Button
              variant="contained" size="large"
              startIcon={<PlayArrow />}
              sx={{ px: 6, py: 2, fontSize: 20, fontWeight: 700, borderRadius: 4, background: 'linear-gradient(135deg, #1976d2, #42a5f5)' }}
              onClick={() => setScreen('role-select')}
            >
              התחל לשחק
            </Button>
          </Box>
        </Container>
      </Box>
    )
  }

  // ROLE SELECT
  if (screen === 'role-select') {
    return (
      <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0d1b2a 0%, #1a3a5c 100%)', py: 8 }}>
        <Container maxWidth="sm">
          <Typography variant="h4" color="white" fontWeight={800} textAlign="center" gutterBottom>
            בחר את תפקידך
          </Typography>
          <Typography color="rgba(255,255,255,0.6)" textAlign="center" mb={4}>
            כל תפקיד מחייב אסטרטגיה שונה ושפה משפטית ייחודית
          </Typography>
          <Grid container spacing={2} mb={4}>
            {(Object.entries(ROLE_LABELS) as [PlayerRole, string][]).map(([role, label]) => (
              <Grid item xs={12} key={role}>
                <Card
                  onClick={() => setSelectedRole(role)}
                  sx={{
                    cursor: 'pointer', transition: '0.2s',
                    border: selectedRole === role ? '2px solid #42a5f5' : '2px solid transparent',
                    bgcolor: selectedRole === role ? 'rgba(66,165,245,0.15)' : 'rgba(255,255,255,0.08)',
                    '&:hover': { bgcolor: 'rgba(255,255,255,0.12)' },
                  }}
                >
                  <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Typography fontSize={36}>{label.split(' ')[0]}</Typography>
                    <Box flex={1}>
                      <Typography color="white" fontWeight={700}>{label.slice(3)}</Typography>
                      <Typography variant="caption" color="rgba(255,255,255,0.6)">
                        {role === 'prosecutor' ? 'הגשת כתב אישום, חקירת עדים, בקשת הרשעה' :
                         role === 'defense' ? 'הגנה על הנאשם, הדגשת ספק סביר, זכויות יסוד' :
                         'ניהול הדיון, איזון בין הצדדים, גזיקת עונש'}
                      </Typography>
                    </Box>
                    {selectedRole === role && <CheckCircle sx={{ color: '#42a5f5' }} />}
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          <Typography color="white" fontWeight={700} mb={2}>רמת קושי</Typography>
          <Grid container spacing={1} mb={4}>
            {(Object.entries(DIFFICULTY_LABELS) as [Difficulty, { label: string; color: 'success' | 'warning' | 'error' }][]).map(([d, cfg]) => (
              <Grid item xs={4} key={d}>
                <Button
                  fullWidth variant={selectedDifficulty === d ? 'contained' : 'outlined'}
                  color={cfg.color}
                  onClick={() => setSelectedDifficulty(d)}
                  sx={{ py: 1.5, fontWeight: 700 }}
                >
                  {cfg.label}
                </Button>
              </Grid>
            ))}
          </Grid>

          <Box display="flex" gap={2}>
            <Button variant="outlined" startIcon={<ArrowBack />} onClick={() => setScreen('lobby')} sx={{ color: 'white', borderColor: 'rgba(255,255,255,0.3)', flex: 1 }}>
              חזרה
            </Button>
            <Button
              variant="contained" endIcon={<ArrowForward />} sx={{ flex: 2, py: 1.5, fontWeight: 700 }}
              onClick={() => { loadCases(); setScreen('case-select') }}
            >
              בחר תיק
            </Button>
          </Box>
        </Container>
      </Box>
    )
  }

  // CASE SELECT
  if (screen === 'case-select') {
    return (
      <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0d1b2a 0%, #1a3a5c 100%)', py: 8 }}>
        <Container maxWidth="md">
          <Box display="flex" alignItems="center" gap={2} mb={4}>
            <IconButton onClick={() => setScreen('role-select')} sx={{ color: 'white' }}><ArrowBack /></IconButton>
            <Typography variant="h4" color="white" fontWeight={800}>בחר תיק לאימון</Typography>
            <Chip label={`תפקיד: ${ROLE_LABELS[selectedRole]}`} color="primary" />
            <Chip label={DIFFICULTY_LABELS[selectedDifficulty].label} color={DIFFICULTY_LABELS[selectedDifficulty].color} />
          </Box>

          {loading && <Box textAlign="center" py={4}><CircularProgress sx={{ color: 'white' }} /></Box>}
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          <Grid container spacing={2}>
            {cases.map((c) => (
              <Grid item xs={12} sm={6} key={c.id}>
                <Card
                  onClick={() => startGame(c)}
                  sx={{
                    cursor: 'pointer', transition: '0.2s',
                    bgcolor: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)',
                    '&:hover': { transform: 'translateY(-4px)', bgcolor: 'rgba(255,255,255,0.14)', boxShadow: '0 8px 24px rgba(0,0,0,0.4)' },
                  }}
                >
                  <CardContent>
                    <Box display="flex" alignItems="center" gap={1.5} mb={1.5}>
                      <Typography fontSize={32}>{CATEGORY_ICONS[c.category] ?? '⚖️'}</Typography>
                      <Box>
                        <Typography color="white" fontWeight={700} variant="h6">{c.title}</Typography>
                        <Typography variant="caption" color="rgba(255,255,255,0.5)">{c.court}</Typography>
                      </Box>
                    </Box>
                    <Typography variant="body2" color="rgba(255,255,255,0.7)" mb={1.5} sx={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {c.facts}
                    </Typography>
                    <Box display="flex" gap={0.5} flexWrap="wrap">
                      {c.charges.slice(0, 2).map((ch, i) => (
                        <Chip key={i} label={ch.split('(')[0].trim()} size="small" sx={{ bgcolor: 'rgba(255,152,0,0.2)', color: '#ffb74d', fontSize: 10 }} />
                      ))}
                    </Box>
                    <Box mt={1.5} display="flex" justifyContent="space-between" alignItems="center">
                      <Typography variant="caption" color="rgba(255,255,255,0.4)">עד {c.maxSentence}</Typography>
                      <Chip label={`${c.evidence.length} ראיות`} size="small" color="info" />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
    )
  }

  // RESULT SCREEN
  if (screen === 'result') {
    const avg = stageHistory.length > 0
      ? Math.round(stageHistory.reduce((s, h) => s + h.score, 0) / stageHistory.length)
      : 0
    const grade = avg >= 85 ? 'מצוין' : avg >= 70 ? 'טוב' : avg >= 55 ? 'עובר' : 'נכשל'
    return (
      <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0d1b2a 0%, #1a3a5c 100%)', py: 8 }}>
        <Container maxWidth="sm">
          <Box textAlign="center" mb={4}>
            <Typography fontSize={80}>{avg >= 85 ? '🏆' : avg >= 70 ? '🥈' : avg >= 55 ? '🥉' : '📚'}</Typography>
            <Typography variant="h3" color="white" fontWeight={800}>סיכום המשחק</Typography>
            <Typography color="rgba(255,255,255,0.7)" mt={1}>{selectedCase?.title}</Typography>
          </Box>
          <Card sx={{ bgcolor: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.2)', mb: 3 }}>
            <CardContent sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="h1" fontWeight={900} sx={{ color: getGradeColor(grade), fontSize: 80 }}>
                {avg}
              </Typography>
              <Typography variant="h4" sx={{ color: getGradeColor(grade), fontWeight: 700 }}>{grade}</Typography>
              <Typography color="rgba(255,255,255,0.6)" mt={1}>ניקוד ממוצע על {stageHistory.length} שלבים</Typography>
            </CardContent>
          </Card>
          <Box mb={3}>
            {stageHistory.map((h, i) => (
              <Box key={i} display="flex" alignItems="center" justifyContent="space-between" py={1}
                sx={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                <Box display="flex" alignItems="center" gap={1}>
                  {STAGES.find((s) => s.key === h.stage)?.icon}
                  <Typography color="rgba(255,255,255,0.8)" variant="body2">
                    {STAGES.find((s) => s.key === h.stage)?.label}
                  </Typography>
                </Box>
                <Chip
                  label={`${h.score}/100`}
                  color={h.score >= 85 ? 'success' : h.score >= 70 ? 'primary' : h.score >= 55 ? 'warning' : 'error'}
                  size="small"
                />
              </Box>
            ))}
          </Box>
          <Box display="flex" gap={2}>
            <Button
              fullWidth variant="outlined" startIcon={<Refresh />}
              sx={{ color: 'white', borderColor: 'rgba(255,255,255,0.3)', py: 1.5 }}
              onClick={() => { setScreen('lobby'); setStageHistory([]); setSelectedCase(null) }}
            >
              משחק חדש
            </Button>
            <Button
              fullWidth variant="contained" endIcon={<PlayArrow />}
              sx={{ py: 1.5, fontWeight: 700 }}
              onClick={() => { if (selectedCase) startGame(selectedCase) }}
            >
              שחק שוב
            </Button>
          </Box>
        </Container>
      </Box>
    )
  }

  // ────────────────────────────────────────────────────
  // GAME SCREEN
  // ────────────────────────────────────────────────────
  const completedStages = stageHistory.map((h) => h.stage)
  const stageCompleted = evaluation !== null

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#0a1628', dir: isRtl ? 'rtl' : 'ltr' }}>
      {/* Header */}
      <Box sx={{ bgcolor: '#0d1f3c', borderBottom: '1px solid rgba(255,255,255,0.1)', px: 3, py: 1.5 }}>
        <Container maxWidth="xl">
          <Box display="flex" alignItems="center" justifyContent="space-between" flexWrap="wrap" gap={1}>
            <Box display="flex" alignItems="center" gap={1.5}>
              <Typography fontSize={24}>⚖️</Typography>
              <Box>
                <Typography color="white" fontWeight={700} fontSize={14}>{selectedCase?.title}</Typography>
                <Typography color="rgba(255,255,255,0.5)" fontSize={11}>{selectedCase?.court}</Typography>
              </Box>
            </Box>
            <Box display="flex" alignItems="center" gap={1}>
              <Chip label={ROLE_LABELS[selectedRole]} color="primary" size="small" />
              {timeLeft !== null && (
                <Chip
                  icon={<Timer fontSize="small" />}
                  label={formatTime(timeLeft)}
                  color={timeLeft < 60 ? 'error' : 'default'}
                  size="small"
                  sx={{ bgcolor: 'rgba(255,255,255,0.1)', color: 'white' }}
                />
              )}
              {stageHistory.length > 0 && (
                <Chip
                  icon={<Star fontSize="small" />}
                  label={`${totalScore} נק'`}
                  color="warning"
                  size="small"
                />
              )}
            </Box>
          </Box>

          {/* Stage stepper */}
          <Box mt={1.5} sx={{ overflowX: 'auto' }}>
            <Stepper activeStep={currentStageIdx} alternativeLabel connector={null}
              sx={{ '& .MuiStepLabel-label': { color: 'rgba(255,255,255,0.5)', fontSize: 11 }, '& .MuiStepLabel-label.Mui-active': { color: 'white' }, minWidth: 600 }}>
              {STAGES.map((s, i) => (
                <Step key={s.key} completed={completedStages.includes(s.key)}>
                  <StepLabel
                    icon={
                      <Box sx={{
                        width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        bgcolor: i < currentStageIdx ? '#2e7d32' : i === currentStageIdx ? '#1976d2' : 'rgba(255,255,255,0.15)',
                        border: i === currentStageIdx ? '2px solid #42a5f5' : 'none',
                        fontSize: 14,
                      }}>
                        {i < currentStageIdx ? '✓' : s.icon}
                      </Box>
                    }
                  >{s.label}</StepLabel>
                </Step>
              ))}
            </Stepper>
          </Box>
        </Container>
      </Box>

      {/* Main content */}
      <Container maxWidth="xl" sx={{ py: 2 }}>
        <Grid container spacing={2}>
          {/* LEFT: Case info */}
          <Grid item xs={12} lg={3}>
            <Card sx={{ bgcolor: '#0d1f3c', border: '1px solid rgba(255,255,255,0.1)', height: '100%' }}>
              <CardContent sx={{ p: 2 }}>
                <Tabs value={tabIdx} onChange={(_, v) => setTabIdx(v)} textColor="inherit" sx={{ mb: 1.5, '& .MuiTab-root': { color: 'rgba(255,255,255,0.5)', minWidth: 0, fontSize: 12, px: 1 }, '& .Mui-selected': { color: 'white' } }}>
                  <Tab label="תיק" />
                  <Tab label="ראיות" />
                  <Tab label="אישומים" />
                </Tabs>

                {tabIdx === 0 && (
                  <Box>
                    <Typography variant="caption" color="rgba(255,255,255,0.5)">עובדות התיק</Typography>
                    <Typography variant="body2" color="rgba(255,255,255,0.85)" mt={0.5} sx={{ lineHeight: 1.6, fontSize: 12 }}>
                      {selectedCase?.facts}
                    </Typography>
                    <Divider sx={{ my: 1.5, borderColor: 'rgba(255,255,255,0.1)' }} />
                    <Typography variant="caption" color="rgba(255,255,255,0.5)">נאשם</Typography>
                    <Typography variant="body2" color="white" mt={0.3}>{selectedCase?.defendant}</Typography>
                    <Typography variant="caption" color="rgba(255,255,255,0.5)" mt={1} display="block">עונש מקסימלי</Typography>
                    <Chip label={selectedCase?.maxSentence} color="error" size="small" sx={{ mt: 0.3 }} />
                  </Box>
                )}
                {tabIdx === 1 && (
                  <Box>
                    <Typography variant="caption" color="rgba(255,255,255,0.5)" display="block" mb={1}>
                      {selectedCase?.evidence.length} ראיות בתיק
                    </Typography>
                    {selectedCase?.evidence.map((ev) => (
                      <EvidenceCard key={ev.id} ev={ev} />
                    ))}
                  </Box>
                )}
                {tabIdx === 2 && (
                  <Box>
                    <Typography variant="caption" color="rgba(255,255,255,0.5)" display="block" mb={1}>כתב האישום כולל</Typography>
                    {selectedCase?.charges.map((ch, i) => (
                      <Box key={i} display="flex" alignItems="flex-start" gap={1} mb={1}>
                        <Chip label={i + 1} size="small" color="error" sx={{ minWidth: 24, height: 20, fontSize: 10 }} />
                        <Typography variant="body2" color="rgba(255,255,255,0.8)" sx={{ fontSize: 12 }}>{ch}</Typography>
                      </Box>
                    ))}
                    <Divider sx={{ my: 1.5, borderColor: 'rgba(255,255,255,0.1)' }} />
                    <Typography variant="caption" color="rgba(255,255,255,0.5)" display="block" mb={0.5}>זכויות יסוד בסיכון</Typography>
                    {selectedCase?.fundamentalRightsAtRisk.map((r, i) => (
                      <Chip key={i} label={r} size="small" sx={{ m: 0.3, bgcolor: 'rgba(255,152,0,0.15)', color: '#ffb74d', fontSize: 10 }} />
                    ))}
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* CENTER: Editor */}
          <Grid item xs={12} lg={6}>
            <Card sx={{ bgcolor: '#0d1f3c', border: '1px solid rgba(255,255,255,0.1)' }}>
              <CardContent sx={{ p: 2 }}>
                <Box display="flex" alignItems="center" justifyContent="space-between" mb={1.5}>
                  <Box display="flex" alignItems="center" gap={1}>
                    {currentStage?.icon}
                    <Typography color="white" fontWeight={700}>{currentStage?.label}</Typography>
                  </Box>
                  <Box display="flex" gap={1}>
                    <Tooltip title="קבל רמז מהבינה המלאכותית">
                      <Button
                        size="small" startIcon={<Lightbulb />} variant="outlined"
                        onClick={loadHint} sx={{ color: '#ffb74d', borderColor: '#ffb74d', fontSize: 11 }}
                      >
                        רמז
                      </Button>
                    </Tooltip>
                    <Tooltip title="זכויות יסוד">
                      <Button
                        size="small" startIcon={<Security />} variant="outlined"
                        onClick={() => setShowRightsDialog(true)} sx={{ color: '#81d4fa', borderColor: '#81d4fa', fontSize: 11 }}
                      >
                        זכויות
                      </Button>
                    </Tooltip>
                  </Box>
                </Box>

                {/* Instructions */}
                <Paper sx={{ bgcolor: 'rgba(25,118,210,0.1)', border: '1px solid rgba(25,118,210,0.3)', p: 1.5, mb: 1.5, borderRadius: 2 }}>
                  <Typography variant="caption" color="#81d4fa" fontWeight={700} display="block">
                    📋 המשימה שלך בשלב {currentStage?.label}:
                  </Typography>
                  <Typography variant="caption" color="rgba(255,255,255,0.7)">
                    {selectedRole === 'prosecutor' && currentStage?.key === 'investigation' && 'עיין בראיות וכתב סיכום חקירה המסביר אילו אישומים ניתן להוכיח ומדוע.'}
                    {selectedRole === 'prosecutor' && currentStage?.key === 'indictment' && 'כתוב כתב אישום מפורט: עובדות, תאריכים, סעיפי חוק. היה מדויק, ממוקד וחד.'}
                    {selectedRole === 'defense' && currentStage?.key === 'defense_response' && 'כתוב תגובה לכתב האישום: הכחש, ספק סביר, פגמים, זכויות יסוד שנפגעו.'}
                    {selectedRole === 'prosecutor' && currentStage?.key === 'summation' && 'כתוב סיכום סופי: מה הוכח, מדוע יש להרשיע, בקש עונש ראוי.'}
                    {selectedRole === 'defense' && currentStage?.key === 'summation' && 'כתוב סיכום: מה לא הוכח, ספקות שנותרו, בקש זיכוי.'}
                    {!['investigation', 'indictment', 'defense_response', 'summation'].includes(currentStage?.key ?? '') && `כתוב טענה משפטית ברורה, ממוקדת ומדויקת לשלב ${currentStage?.label}.`}
                  </Typography>
                </Paper>

                {/* Hints */}
                {hints.length > 0 && (
                  <Box mb={1.5}>
                    {hints.slice(-2).map((h, i) => (
                      <Alert key={i} severity="info" icon={<Lightbulb />} sx={{ mb: 0.5, py: 0.5, bgcolor: 'rgba(255,193,7,0.08)', color: '#ffe082', '& .MuiAlert-icon': { color: '#ffe082' }, fontSize: 12 }}>
                        {h}
                      </Alert>
                    ))}
                  </Box>
                )}

                {/* Text editor */}
                <Box sx={{ position: 'relative' }}>
                  <textarea
                    ref={textAreaRef}
                    value={pleadingText}
                    onChange={(e) => setPleadingText(e.target.value)}
                    disabled={stageCompleted}
                    placeholder={`כתוב כאן את ${currentStage?.label} שלך...\n\nדוגמה: "הנאשם ${selectedCase?.defendant?.split(',')[0]} מואשם בזאת כי ביום..."`}
                    style={{
                      width: '100%', minHeight: 240, padding: 16, borderRadius: 8,
                      background: stageCompleted ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.06)',
                      border: '1px solid rgba(255,255,255,0.15)', color: 'white',
                      fontSize: 14, lineHeight: 1.7, resize: 'vertical', direction: 'rtl',
                      fontFamily: 'inherit', outline: 'none',
                    }}
                  />
                  <Box sx={{ position: 'absolute', bottom: 8, left: 8 }}>
                    <Typography variant="caption" color="rgba(255,255,255,0.3)">
                      {pleadingText.trim().split(/\s+/).filter(Boolean).length} מילים
                    </Typography>
                  </Box>
                </Box>

                {/* Suggested phrases */}
                {suggestedPhrases.length > 0 && (
                  <Box mt={1} display="flex" gap={0.5} flexWrap="wrap">
                    <Typography variant="caption" color="rgba(255,255,255,0.4)" width="100%">הכנס ביטוי:</Typography>
                    {suggestedPhrases.slice(0, 6).map((p, i) => (
                      <Chip
                        key={i} label={p} size="small" onClick={() => insertPhrase(p)}
                        icon={<AutoFixHigh fontSize="small" />}
                        sx={{ cursor: 'pointer', bgcolor: 'rgba(25,118,210,0.15)', color: '#81d4fa', fontSize: 11, '&:hover': { bgcolor: 'rgba(25,118,210,0.3)' } }}
                      />
                    ))}
                  </Box>
                )}

                {error && <Alert severity="error" sx={{ mt: 1 }}>{error}</Alert>}

                {/* Actions */}
                <Box display="flex" gap={1.5} mt={2}>
                  {!stageCompleted ? (
                    <Button
                      fullWidth variant="contained" size="large" startIcon={<Gavel />}
                      onClick={submitPleading} disabled={evaluating || pleadingText.trim().length < 10}
                      sx={{ py: 1.5, fontWeight: 700, background: 'linear-gradient(135deg, #1976d2, #42a5f5)' }}
                    >
                      {evaluating ? <CircularProgress size={22} color="inherit" /> : 'הגש טענה'}
                    </Button>
                  ) : (
                    <Button
                      fullWidth variant="contained" size="large" endIcon={<ArrowForward />}
                      onClick={nextStage}
                      sx={{ py: 1.5, fontWeight: 700, background: 'linear-gradient(135deg, #2e7d32, #66bb6a)' }}
                    >
                      {currentStageIdx < STAGES.length - 1 ? `עבור לשלב: ${STAGES[currentStageIdx + 1]?.label}` : 'סיים משחק'}
                    </Button>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* RIGHT: Feedback */}
          <Grid item xs={12} lg={3}>
            <Card sx={{ bgcolor: '#0d1f3c', border: '1px solid rgba(255,255,255,0.1)', height: '100%' }}>
              <CardContent sx={{ p: 2 }}>
                {!evaluation ? (
                  <Box textAlign="center" py={4}>
                    <Psychology sx={{ fontSize: 48, color: 'rgba(255,255,255,0.15)', mb: 2 }} />
                    <Typography color="rgba(255,255,255,0.4)" variant="body2">
                      הגש את הטענה לקבלת הערכת AI
                    </Typography>
                    <Typography color="rgba(255,255,255,0.25)" variant="caption" display="block" mt={1}>
                      בינה מלאכותית תנתח את הדיוק, השפה המשפטית, וזכויות היסוד
                    </Typography>
                  </Box>
                ) : (
                  <Box>
                    {/* Score */}
                    <Box textAlign="center" mb={2}>
                      <Box sx={{ position: 'relative', display: 'inline-flex' }}>
                        <CircularProgress
                          variant="determinate" value={evaluation.score} size={80} thickness={6}
                          sx={{ color: evaluation.score >= 85 ? '#4caf50' : evaluation.score >= 70 ? '#2196f3' : evaluation.score >= 55 ? '#ff9800' : '#f44336' }}
                        />
                        <Box sx={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                          <Typography variant="h5" fontWeight={900} color="white">{evaluation.score}</Typography>
                        </Box>
                      </Box>
                      <Typography variant="h6" fontWeight={700} mt={0.5} sx={{ color: getGradeColor(evaluation.grade) }}>
                        {evaluation.grade}
                      </Typography>
                    </Box>

                    {/* Breakdown */}
                    <Box mb={2}>
                      <ScoreBar label="דיוק עובדתי" value={evaluation.breakdown.factualAccuracy} color="#4caf50" />
                      <ScoreBar label="בהירות משפטית" value={evaluation.breakdown.legalClarity} color="#2196f3" />
                      <ScoreBar label="תמציתיות" value={evaluation.breakdown.brevity} color="#9c27b0" />
                      <ScoreBar label="זכויות יסוד" value={evaluation.breakdown.fundamentalRights} color="#ff9800" />
                      <ScoreBar label="שפה משפטית" value={evaluation.breakdown.legalLanguage} color="#00bcd4" />
                      <ScoreBar label="סדר לוגי" value={evaluation.breakdown.logicalOrder} color="#f06292" />
                    </Box>

                    <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)', mb: 1.5 }} />

                    {/* Feedback */}
                    <Typography color="rgba(255,255,255,0.7)" variant="body2" mb={1.5} sx={{ fontSize: 12, lineHeight: 1.6 }}>
                      {evaluation.feedback}
                    </Typography>

                    {/* Strong points */}
                    {evaluation.strongPoints.length > 0 && (
                      <Box mb={1.5}>
                        <Typography variant="caption" color="#66bb6a" fontWeight={700} display="block" mb={0.5}>נקודות חוזק</Typography>
                        {evaluation.strongPoints.map((s, i) => (
                          <Box key={i} display="flex" alignItems="center" gap={0.5}>
                            <CheckCircle sx={{ fontSize: 14, color: '#66bb6a' }} />
                            <Typography variant="caption" color="rgba(255,255,255,0.7)">{s}</Typography>
                          </Box>
                        ))}
                      </Box>
                    )}

                    {/* Improvements */}
                    {evaluation.improvements.length > 0 && (
                      <Box mb={1.5}>
                        <Typography variant="caption" color="#ffb74d" fontWeight={700} display="block" mb={0.5}>לשיפור</Typography>
                        {evaluation.improvements.map((imp, i) => (
                          <Box key={i} display="flex" alignItems="flex-start" gap={0.5} mb={0.3}>
                            <Cancel sx={{ fontSize: 14, color: '#ffb74d', mt: 0.2 }} />
                            <Typography variant="caption" color="rgba(255,255,255,0.7)">{imp}</Typography>
                          </Box>
                        ))}
                      </Box>
                    )}

                    {/* Suggested phrases */}
                    {evaluation.suggestedPhrases.length > 0 && (
                      <Accordion sx={{ bgcolor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', '&:before': { display: 'none' } }}>
                        <AccordionSummary expandIcon={<ExpandMore sx={{ color: 'white' }} />}>
                          <Typography variant="caption" color="rgba(255,255,255,0.7)" fontWeight={700}>ביטויים מוצעים</Typography>
                        </AccordionSummary>
                        <AccordionDetails sx={{ pt: 0 }}>
                          {evaluation.suggestedPhrases.map((p, i) => (
                            <Chip
                              key={i} label={p} size="small" onClick={() => insertPhrase(p)}
                              sx={{ m: 0.3, cursor: 'pointer', bgcolor: 'rgba(25,118,210,0.2)', color: '#81d4fa', fontSize: 10 }}
                            />
                          ))}
                        </AccordionDetails>
                      </Accordion>
                    )}
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>

      {/* Fundamental Rights Dialog */}
      <Dialog open={showRightsDialog} onClose={() => setShowRightsDialog(false)} maxWidth="sm" fullWidth
        PaperProps={{ sx: { bgcolor: '#0d1f3c', border: '1px solid rgba(255,255,255,0.15)' } }}>
        <DialogTitle sx={{ color: 'white', display: 'flex', alignItems: 'center', gap: 1 }}>
          <Security color="primary" /> מדריך זכויות יסוד
        </DialogTitle>
        <DialogContent>
          {rights.map((r, i) => (
            <Accordion key={i} sx={{ bgcolor: 'rgba(255,255,255,0.05)', mb: 0.5, '&:before': { display: 'none' } }}>
              <AccordionSummary expandIcon={<ExpandMore sx={{ color: 'white' }} />}>
                <Box>
                  <Typography color="white" fontWeight={700} variant="body2">{r.name}</Typography>
                  <Typography variant="caption" color="#81d4fa">{r.law}</Typography>
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body2" color="rgba(255,255,255,0.7)" mb={1}>{r.description}</Typography>
                <Box display="flex" gap={0.5} flexWrap="wrap">
                  {r.relevantStages.map((s, j) => (
                    <Chip key={j} label={STAGES.find((st) => st.key === s)?.label ?? s} size="small"
                      color={s === currentStage?.key ? 'primary' : 'default'}
                      sx={{ fontSize: 10 }} />
                  ))}
                </Box>
                <Button size="small" startIcon={<AutoFixHigh />} sx={{ mt: 1, fontSize: 11 }}
                  onClick={() => { insertPhrase(r.name); setShowRightsDialog(false) }}>
                  הכנס לטקסט
                </Button>
              </AccordionDetails>
            </Accordion>
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowRightsDialog(false)} sx={{ color: 'white' }}>סגור</Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

import React, { useEffect, useState } from 'react'
import { useEntitlements } from '@/features/billing/providers/EntitlementsProvider'
import { useSessionAuth } from '@/features/auth/providers/SessionAuthProvider'
import { useNavigate, Link as RouterLink } from 'react-router-dom'
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Container,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import type { CaseTrack, CourtLevel, JudgeMode } from '../types'
import { courtLevelLabel, judgeModeLabel, trackLabel } from '../utils/labels'
import { generateCaseByTopic } from '../services/caseGenerator'
import { useVirtualCourt2Store } from '../store/useVirtualCourt2Store'

const TRACKS: CaseTrack[] = [
  'civil',
  'criminal',
  'administrative',
  'labor',
  'family',
  'commercial_mediation',
  'plea_bargain',
]
const LEVELS: CourtLevel[] = ['magistrate', 'district', 'supreme']
const MODES: JudgeMode[] = ['ai', 'student', 'hybrid']

export const VirtualCourt2NewCasePage: React.FC = () => {
  const navigate = useNavigate()
  const addCase = useVirtualCourt2Store((s) => s.addCase)
  const { can, loading: entLoading } = useEntitlements()
  const { accessToken } = useSessionAuth()
  const canFull = can('virtualCourtFull')

  const [topic, setTopic] = useState('')
  const [track, setTrack] = useState<CaseTrack>('civil')
  const [level, setLevel] = useState<CourtLevel>('magistrate')
  const [judgeMode, setMode] = useState<JudgeMode>('ai')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string>('')

  useEffect(() => {
    if (!entLoading && !canFull && (judgeMode === 'ai' || judgeMode === 'hybrid')) {
      setMode('student')
    }
  }, [entLoading, canFull, judgeMode])

  const handleCreate = async () => {
    if (!topic.trim()) {
      setError('יש לציין נושא/מקרה')
      return
    }
    setError('')
    setBusy(true)
    try {
      const mode: JudgeMode = canFull ? judgeMode : 'student'
      const c = await generateCaseByTopic(
        { topic: topic.trim(), track, level, judgeMode: mode },
        accessToken,
      )
      addCase(c)
      navigate(`/virtual-court-2/${c.id}`)
    } finally {
      setBusy(false)
    }
  }

  return (
    <Container maxWidth="md" sx={{ py: 2 }}>
      <Button component={RouterLink} to="/virtual-court-2" startIcon={<ArrowBackIcon />} sx={{ mb: 2 }}>
        חזרה לרשימת התיקים
      </Button>
      <Typography variant="h4" component="h1" gutterBottom>
        תיק חדש
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        ציינו נושא/מקרה — המערכת תייצר שלד תיק ללימוד, כולל תקדימים וחקיקה רלוונטיים לפי הנושא.
        לאחר מכן תוכלו להוסיף משתתפים, דיונים, ראיות ופסיקה.
      </Typography>

      {!entLoading && !canFull && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          במסלול החינם נוצר <strong>שלד תיק מקומי</strong> (ללא LLM בשרת). מי שמחוברים עם Student Pro מקבלים
          ייצור תיק עשיר ב-AI.{' '}
          <RouterLink to="/pricing">שדרוג</RouterLink>
        </Alert>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Card variant="outlined">
        <CardContent>
          <Stack spacing={2}>
            <TextField
              label="נושא / תיאור קצר של המקרה"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              fullWidth
              autoFocus
              placeholder="למשל: הפרת חוזה מכר דירה, רשלנות רפואית, עתירה נגד רשות..."
            />
            <TextField
              select
              label="מסלול"
              value={track}
              onChange={(e) => setTrack(e.target.value as CaseTrack)}
              fullWidth
            >
              {TRACKS.map((t) => (
                <MenuItem key={t} value={t}>
                  {trackLabel[t]}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              select
              label="ערכאה"
              value={level}
              onChange={(e) => setLevel(e.target.value as CourtLevel)}
              fullWidth
            >
              {LEVELS.map((l) => (
                <MenuItem key={l} value={l}>
                  {courtLevelLabel[l]}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              select
              label="שופט/ת"
              value={judgeMode}
              onChange={(e) => setMode(e.target.value as JudgeMode)}
              fullWidth
              helperText={
                !canFull
                  ? 'במסלול חינם זמין רק מצב שופט סטודנט. שופט AI — ב-Student Pro.'
                  : undefined
              }
            >
              {MODES.map((m) => (
                <MenuItem key={m} value={m} disabled={!canFull && m !== 'student'}>
                  {judgeModeLabel[m]}
                </MenuItem>
              ))}
            </TextField>
            <Box>
              <Button variant="contained" onClick={handleCreate} disabled={busy}>
                {busy ? 'יוצר…' : 'צור תיק'}
              </Button>
            </Box>
          </Stack>
        </CardContent>
      </Card>

      <Alert severity="info" sx={{ mt: 2 }}>
        הכלי מיועד לסטודנטים. התוכן המתקבל הוא שלד לימודי בלבד — אינו ייעוץ משפטי ואינו מחליף מקורות מוסמכים.
      </Alert>
    </Container>
  )
}

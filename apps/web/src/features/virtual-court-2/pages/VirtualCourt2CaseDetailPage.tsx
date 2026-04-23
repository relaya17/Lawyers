import React, { useState } from 'react'
import { Link as RouterLink, useNavigate, useParams } from 'react-router-dom'
import {
  Alert,
  Box,
  Button,
  Chip,
  Container,
  Divider,
  MenuItem,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
} from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import { useVirtualCourt2Store } from '../store/useVirtualCourt2Store'
import { pullCaseSnapshot, pushCaseSnapshot } from '../services/virtualCourtRemote'
import {
  courtLevelLabel,
  judgeModeLabel,
  statusColor,
  statusLabel,
  trackLabel,
} from '../utils/labels'
import type { CaseStatus, LegalCase as LegalCaseT } from '../types'
import { ParticipantsPanel } from '../components/ParticipantsPanel'
import { HearingsPanel } from '../components/HearingsPanel'
import { ClerkProtocol } from '../components/ClerkProtocol'
import { AIJudgePanel } from '../components/AIJudgePanel'
import { EvidencePanel } from '../components/EvidencePanel'
import { MediationPanel } from '../components/MediationPanel'
import { VideoRoomPanel } from '../components/VideoRoomPanel'
import { TimelinePanel } from '../components/TimelinePanel'
import { SourcesPanel } from '../components/SourcesPanel'
import { ImportRealCaseDialog } from '../components/ImportRealCaseDialog'

const STATUSES: CaseStatus[] = [
  'draft',
  'filed',
  'in_hearing',
  'awaiting_ruling',
  'ruled',
  'appealed',
  'closed',
]

export const VirtualCourt2CaseDetailPage: React.FC = () => {
  const { caseId } = useParams<{ caseId: string }>()
  const navigate = useNavigate()
  const legalCase = useVirtualCourt2Store((s) => s.cases.find((c) => c.id === caseId))
  const setStatus = useVirtualCourt2Store((s) => s.setStatus)
  const removeCase = useVirtualCourt2Store((s) => s.removeCase)
  const setCase = useVirtualCourt2Store((s) => s.setCase)

  const [tab, setTab] = useState(0)
  const [syncNote, setSyncNote] = useState<string | null>(null)
  const [syncBusy, setSyncBusy] = useState(false)
  const [importOpen, setImportOpen] = useState(false)

  if (!legalCase) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="warning">תיק לא נמצא. ייתכן שנמחק.</Alert>
        <Button
          component={RouterLink}
          to="/virtual-court-2"
          startIcon={<ArrowBackIcon />}
          sx={{ mt: 2 }}
        >
          חזרה לרשימה
        </Button>
      </Container>
    )
  }

  const handleDelete = () => {
    if (window.confirm('למחוק את התיק? פעולה זו אינה הפיכה.')) {
      removeCase(legalCase.id)
      navigate('/virtual-court-2')
    }
  }

  const isLegalCasePayload = (v: unknown): v is LegalCaseT =>
    typeof v === 'object' &&
    v !== null &&
    'id' in v &&
    typeof (v as LegalCaseT).id === 'string' &&
    'title' in v

  const handlePushCloud = async () => {
    setSyncBusy(true)
    setSyncNote(null)
    try {
      const ok = await pushCaseSnapshot(legalCase.id, legalCase)
      setSyncNote(
        ok
          ? 'התיק נשמר בשרת (MongoDB). אפשר לטעון אותו ממכשיר אחר עם אותו מזהה תיק.'
          : 'לא ניתן לשמור: ודאו שהשרת רץ, ש־MONGODB_URI מוגדר, וש־CORS כולל את פורט ה-Vite.'
      )
    } finally {
      setSyncBusy(false)
    }
  }

  const handlePullCloud = async () => {
    setSyncBusy(true)
    setSyncNote(null)
    try {
      const payload = await pullCaseSnapshot(legalCase.id)
      if (!isLegalCasePayload(payload)) {
        setSyncNote('לא נמצא צילום בענן לתיק זה, או שהשרת/מסד לא זמינים.')
        return
      }
      if (payload.id !== legalCase.id) {
        setSyncNote('מזהה התיק בצילום לא תואם — לא בוצעה טעינה.')
        return
      }
      setCase(payload)
      setSyncNote('נטען מהשרת והוחלף בתיק המקומי (כולל ב־localStorage אחרי רענון).')
    } finally {
      setSyncBusy(false)
    }
  }

  return (
    <Container maxWidth="lg" sx={{ py: 2 }}>
      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }} flexWrap="wrap" useFlexGap>
        <Button component={RouterLink} to="/virtual-court-2" startIcon={<ArrowBackIcon />}>
          חזרה
        </Button>
        <Box flex={1} />
        <Button color="error" startIcon={<DeleteOutlineIcon />} onClick={handleDelete}>
          מחק תיק
        </Button>
      </Stack>

      <Typography variant="overline" color="text.secondary">
        {legalCase.caseNumber}
      </Typography>
      <Typography variant="h4" component="h1" gutterBottom>
        {legalCase.title}
      </Typography>

      <Stack direction="row" spacing={1} sx={{ mb: 2 }} flexWrap="wrap" useFlexGap>
        <Chip size="small" color={statusColor[legalCase.status]} label={statusLabel[legalCase.status]} />
        <Chip size="small" variant="outlined" label={`ערכאה: ${courtLevelLabel[legalCase.level]}`} />
        <Chip size="small" variant="outlined" label={`מסלול: ${trackLabel[legalCase.track]}`} />
        <Chip size="small" variant="outlined" label={judgeModeLabel[legalCase.judgeMode]} />
        <Chip size="small" variant="outlined" label={`נושא: ${legalCase.topic}`} />
      </Stack>

      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} sx={{ mb: 2 }} flexWrap="wrap" useFlexGap>
        <Button variant="contained" color="secondary" size="small" onClick={() => setImportOpen(true)}>
          ייבוא ממקרה אמיתי
        </Button>
        <Button variant="outlined" size="small" disabled={syncBusy} onClick={handlePushCloud}>
          שמירה לענן (שרת)
        </Button>
        <Button variant="outlined" size="small" disabled={syncBusy} onClick={handlePullCloud}>
          טעינה מהענן
        </Button>
      </Stack>
      {syncNote && (
        <Alert severity="info" sx={{ mb: 2 }} onClose={() => setSyncNote(null)}>
          {syncNote}
        </Alert>
      )}
      <Alert severity="warning" sx={{ mb: 2 }}>
        <strong>LLM:</strong> מחולל התיק ושופט ה-AI מנסים קודם את{' '}
        <code>POST /api/ai/virtual-court/*</code> בשרת. הגדירו <code>OPENAI_API_KEY</code> (ואופציונלית{' '}
        <code>OPENAI_BASE_URL</code>, <code>OPENAI_MODEL</code>) ב־<code>apps/server/.env</code>. בלי מפתח —
        נשאר המצב המקומי.
      </Alert>

      <Stack direction={{ xs: 'column', md: 'row' }} spacing={1} sx={{ mb: 2 }}>
        <TextField
          select
          label="שינוי סטטוס"
          value={legalCase.status}
          onChange={(e) => setStatus(legalCase.id, e.target.value as CaseStatus)}
          size="small"
          sx={{ minWidth: 220 }}
        >
          {STATUSES.map((s) => (
            <MenuItem key={s} value={s}>
              {statusLabel[s]}
            </MenuItem>
          ))}
        </TextField>
      </Stack>

      <Divider sx={{ mb: 2 }} />

      <Box sx={{ mb: 2 }}>
        <Typography variant="h6" gutterBottom>
          תמצית
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
          {legalCase.summary}
        </Typography>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
          <Box flex={1}>
            <Typography variant="subtitle2">עובדות</Typography>
            {legalCase.facts.map((f, i) => (
              <Typography key={i} variant="body2">
                • {f}
              </Typography>
            ))}
          </Box>
          <Box flex={1}>
            <Typography variant="subtitle2">עילות / טענות</Typography>
            {legalCase.claims.map((f, i) => (
              <Typography key={i} variant="body2">
                • {f}
              </Typography>
            ))}
          </Box>
          <Box flex={1}>
            <Typography variant="subtitle2">הגנות / תשובות</Typography>
            {legalCase.defenses.map((f, i) => (
              <Typography key={i} variant="body2">
                • {f}
              </Typography>
            ))}
          </Box>
        </Stack>
      </Box>

      <Tabs
        value={tab}
        onChange={(_, v) => setTab(v)}
        variant="scrollable"
        scrollButtons="auto"
        sx={{ mb: 2 }}
      >
        <Tab label="משתתפים" />
        <Tab label="דיונים" />
        <Tab label="פרוטוקול" />
        <Tab label="ראיות" />
        <Tab label="שופט AI" />
        <Tab label="גישור / מו״מ" />
        <Tab label="וידאו" />
        <Tab label="מקורות" />
        <Tab label="ציר זמן" />
      </Tabs>

      {tab === 0 && <ParticipantsPanel legalCase={legalCase} />}
      {tab === 1 && <HearingsPanel legalCase={legalCase} />}
      {tab === 2 && <ClerkProtocol legalCase={legalCase} />}
      {tab === 3 && <EvidencePanel legalCase={legalCase} />}
      {tab === 4 && <AIJudgePanel legalCase={legalCase} />}
      {tab === 5 && <MediationPanel legalCase={legalCase} />}
      {tab === 6 && <VideoRoomPanel legalCase={legalCase} />}
      {tab === 7 && <SourcesPanel legalCase={legalCase} />}
      {tab === 8 && <TimelinePanel legalCase={legalCase} />}

      <ImportRealCaseDialog
        open={importOpen}
        onClose={() => setImportOpen(false)}
        legalCase={legalCase}
        onMerged={(c) => {
          setCase(c)
          setSyncNote('התיק עודכן מייבוא ממקרה אמיתי — יש לאמת ציטוטים מול מקורות רשמיים.')
        }}
      />
    </Container>
  )
}

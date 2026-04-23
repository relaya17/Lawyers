import React, { useMemo, useState } from 'react'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import {
  Alert,
  Box,
  Button,
  Chip,
  Container,
  Grid,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import BalanceIcon from '@mui/icons-material/Balance'
import HandshakeIcon from '@mui/icons-material/Handshake'
import { useVirtualCourt2Store } from '../store/useVirtualCourt2Store'
import { CaseCard } from '../components/CaseCard'
import type { CaseStatus, CourtLevel } from '../types'
import { courtLevelLabel, statusLabel } from '../utils/labels'

const LEVELS: Array<CourtLevel | 'all'> = ['all', 'magistrate', 'district', 'supreme']
const STATUSES: Array<CaseStatus | 'all'> = [
  'all',
  'draft',
  'filed',
  'in_hearing',
  'awaiting_ruling',
  'ruled',
  'appealed',
  'closed',
]

export const VirtualCourt2HomePage: React.FC = () => {
  const navigate = useNavigate()
  const cases = useVirtualCourt2Store((s) => s.cases)
  const resetToSamples = useVirtualCourt2Store((s) => s.resetToSamples)

  const [query, setQuery] = useState('')
  const [level, setLevel] = useState<CourtLevel | 'all'>('all')
  const [status, setStatus] = useState<CaseStatus | 'all'>('all')

  const filtered = useMemo(() => {
    return cases.filter((c) => {
      if (level !== 'all' && c.level !== level) return false
      if (status !== 'all' && c.status !== status) return false
      if (query) {
        const q = query.toLowerCase()
        const hay = [c.title, c.shortTitle, c.topic, c.caseNumber, c.summary]
          .join(' ')
          .toLowerCase()
        if (!hay.includes(q)) return false
      }
      return true
    })
  }, [cases, level, status, query])

  return (
    <Container maxWidth="lg" sx={{ py: 2 }}>
      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
        <BalanceIcon color="primary" />
        <Typography variant="h4" component="h1">
          בית משפט וירטואלי 2
        </Typography>
        <Box flex={1} />
        <Button component={RouterLink} to="new" variant="contained" startIcon={<AddIcon />}>
          תיק חדש
        </Button>
        <Button component={RouterLink} to="/negotiation" variant="outlined" startIcon={<HandshakeIcon />}>
          חדר מו״מ
        </Button>
      </Stack>

      <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
        מודול לימודי לסטודנטים: תיקים עם שלוש ערכאות (שלום, מחוזי, עליון), שופט AI או שופט סטודנט,
        דיונים מרובים לאורך שבועות, פרוטוקול מזכירה, ראיות, ציר זמן, גישור/מו״מ וחדר וידאו. אינו
        תחליף לייעוץ משפטי.
      </Typography>

      <Stack direction={{ xs: 'column', md: 'row' }} spacing={1} sx={{ mb: 2 }}>
        <TextField
          label="חיפוש לפי נושא / צדדים / מס׳ תיק"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          size="small"
          fullWidth
        />
        <TextField
          select
          label="ערכאה"
          value={level}
          onChange={(e) => setLevel(e.target.value as CourtLevel | 'all')}
          size="small"
          sx={{ minWidth: 140 }}
        >
          {LEVELS.map((l) => (
            <MenuItem key={l} value={l}>
              {l === 'all' ? 'הכל' : courtLevelLabel[l]}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          select
          label="סטטוס"
          value={status}
          onChange={(e) => setStatus(e.target.value as CaseStatus | 'all')}
          size="small"
          sx={{ minWidth: 160 }}
        >
          {STATUSES.map((s) => (
            <MenuItem key={s} value={s}>
              {s === 'all' ? 'הכל' : statusLabel[s]}
            </MenuItem>
          ))}
        </TextField>
      </Stack>

      <Stack direction="row" spacing={1} sx={{ mb: 2 }} flexWrap="wrap" useFlexGap>
        <Chip size="small" label={`סה״כ תיקים: ${cases.length}`} />
        <Chip size="small" variant="outlined" label={`לאחר סינון: ${filtered.length}`} />
        <Button size="small" onClick={resetToSamples}>
          איפוס לדוגמאות
        </Button>
      </Stack>

      {filtered.length === 0 ? (
        <Alert severity="info">אין תיקים שתואמים את הסינון. צרו תיק חדש.</Alert>
      ) : (
        <Grid container spacing={2}>
          {filtered.map((c) => (
            <Grid item xs={12} sm={6} md={4} key={c.id}>
              <CaseCard legalCase={c} onOpen={(id) => navigate(id)} />
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  )
}

import React, { useEffect, useState } from 'react'
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Link,
  MenuItem,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
} from '@mui/material'
import GavelIcon from '@mui/icons-material/Gavel'
import type { CaseTrack, CourtLevel, LegalCase } from '../types'
import { courtLevelLabel, trackLabel } from '../utils/labels'
import {
  importRealCaseFromCategory,
  importRealCaseFromText,
  importRealCaseFromUrl,
} from '../services/virtualCourtRemote'
import { mergeRealImportIntoCase } from '../utils/mergeRealImportDraft'

const officialSourceLinkSx = {
  color: '#1a1a1a',
  fontWeight: 600,
  '&:hover': { color: '#000000' },
} as const

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

interface Props {
  open: boolean
  onClose: () => void
  legalCase: LegalCase
  onMerged: (c: LegalCase) => void
}

export const ImportRealCaseDialog: React.FC<Props> = ({
  open,
  onClose,
  legalCase,
  onMerged,
}) => {
  const [tab, setTab] = useState(0)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [pastedText, setPastedText] = useState('')
  const [url, setUrl] = useState('')
  const [category, setCategory] = useState('דיני חוזים / אזרחי')
  const [level, setLevel] = useState<CourtLevel>(legalCase.level)
  const [track, setTrack] = useState<CaseTrack>(legalCase.track)

  useEffect(() => {
    if (open) {
      setLevel(legalCase.level)
      setTrack(legalCase.track)
      setError(null)
    }
  }, [open, legalCase.level, legalCase.track])

  const handleApply = async () => {
    setError(null)
    setBusy(true)
    try {
      let draft = null
      const common = { courtLevel: level, caseTrack: track }

      if (tab === 0) {
        draft = await importRealCaseFromText({
          text: pastedText,
          category: category || undefined,
          ...common,
        })
      } else if (tab === 1) {
        draft = await importRealCaseFromUrl({
          url: url.trim(),
          category: category || undefined,
          ...common,
        })
      } else {
        draft = await importRealCaseFromCategory({
          category: category.trim(),
          ...common,
        })
      }

      if (!draft) {
        setError('השרת לא מחובר ל-LLM (OPENAI_API_KEY) או שגיאת רשת.')
        return
      }

      const merged = mergeRealImportIntoCase(legalCase, draft, { level, track })
      onMerged(merged)
      onClose()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'ייבוא נכשל')
    } finally {
      setBusy(false)
    }
  }

  const canSubmit =
    tab === 0
      ? pastedText.trim().length >= 80
      : tab === 1
        ? url.trim().length > 10
        : category.trim().length > 1

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>
        <Stack direction="row" alignItems="center" spacing={1}>
          <GavelIcon color="primary" />
          <span>ייבוא ממקרה אמיתי (LLM + אנונימיזציה)</span>
        </Stack>
      </DialogTitle>
      <DialogContent>
        <Alert severity="warning" sx={{ mb: 2 }}>
          כלי לימודי בלבד. יש לאמת ציטוטים מול נבו / אתר בתי המשפט / מאגרים רשמיים. השמות יאונמים אוטומטית
          בפרומפט — עדיין יש לבדוק שאין פרטים מזהים.
        </Alert>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          חיפוש Google (Programmable Search): ב-PSE אפשר להגביל ל־court.gov.il. בשרת יש קריאה ל־CSE עם{' '}
          <code>site:supreme.court.gov.il OR site:www.court.gov.il</code>. הגדרו{' '}
          <code>GOOGLE_CUSTOM_SEARCH_API_KEY</code>, <code>GOOGLE_CUSTOM_SEARCH_ENGINE_ID</code>
          — ואופציונלית <code>GOOGLE_CUSTOM_SEARCH_DATE_RESTRICT</code> (למשל <code>w1</code> לשבוע
          האחרון) לתוצאות עדכניות יותר. בלי מפתחות, מצב &quot;קטגוריה&quot; נופל ל־LLM עם אזהרת אימות
          (אין שליפה חיה).
        </Typography>

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} sx={{ mb: 2 }}>
          <TextField
            select
            label="ערכאה בתיק"
            value={level}
            onChange={(e) => setLevel(e.target.value as CourtLevel)}
            size="small"
            sx={{ minWidth: 140 }}
          >
            {LEVELS.map((l) => (
              <MenuItem key={l} value={l}>
                {courtLevelLabel[l]}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            select
            label="מסלול"
            value={track}
            onChange={(e) => setTrack(e.target.value as CaseTrack)}
            size="small"
            sx={{ minWidth: 160 }}
          >
            {TRACKS.map((t) => (
              <MenuItem key={t} value={t}>
                {trackLabel[t]}
              </MenuItem>
            ))}
          </TextField>
        </Stack>

        <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 2 }}>
          <Tab label="הדבקת פסק דין" />
          <Tab label="URL מאתר מותר" />
          <Tab label="קטגוריה + חיפוש" />
        </Tabs>

        {tab === 0 && (
          <Stack spacing={2}>
            <TextField
              label="הקשר / קטגוריה (אופציונלי)"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              size="small"
              fullWidth
            />
            <TextField
              label="טקסט פסק דין, תקציר או החלטה"
              value={pastedText}
              onChange={(e) => setPastedText(e.target.value)}
              multiline
              minRows={10}
              fullWidth
              placeholder="הדביקו כאן קטע מהמקור (מומלץ 500+ מילים). המודל יאונם ויבנה שלד תיק."
            />
          </Stack>
        )}

        {tab === 1 && (
          <Stack spacing={2}>
            <TextField
              label="כתובת (רק מתחמים מותרים בשרת)"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              size="small"
              fullWidth
              placeholder="https://www.court.gov.il/..."
            />
            <Typography variant="caption" component="div" color="text.secondary" sx={{ lineHeight: 1.6 }}>
              <Box component="span">מתחמים לדוגמה (רשמיים): </Box>
              <Link
                href="https://www.court.gov.il"
                target="_blank"
                rel="noopener noreferrer"
                underline="hover"
                sx={officialSourceLinkSx}
              >
                court.gov.il
              </Link>
              <Box component="span"> · </Box>
              <Link
                href="https://supreme.court.gov.il"
                target="_blank"
                rel="noopener noreferrer"
                underline="hover"
                sx={officialSourceLinkSx}
              >
                supreme.court.gov.il
              </Link>
              <Box component="span"> · </Box>
              <Link
                href="https://data.gov.il"
                target="_blank"
                rel="noopener noreferrer"
                underline="hover"
                sx={officialSourceLinkSx}
              >
                data.gov.il
              </Link>
              <Box component="span">. נבו / תקדין — הדבקת טקסט או API עסקי נפרד: </Box>
              <Link
                href="https://www.nevo.co.il"
                target="_blank"
                rel="noopener noreferrer"
                underline="hover"
                sx={officialSourceLinkSx}
              >
                נבו
              </Link>
              <Box component="span"> · </Box>
              <Link
                href="https://www.takdin.co.il"
                target="_blank"
                rel="noopener noreferrer"
                underline="hover"
                sx={officialSourceLinkSx}
              >
                תקדין
              </Link>
            </Typography>
            <TextField
              label="הקשר (אופציונלי)"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              size="small"
              fullWidth
            />
          </Stack>
        )}

        {tab === 2 && (
          <Stack spacing={2}>
            <TextField
              label="נושא / תחום (למשל: דיני עבודה, מנהלי, חוזים)"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              size="small"
              fullWidth
            />
          </Stack>
        )}

        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={busy}>
          ביטול
        </Button>
        <Box flex={1} />
        <Button variant="contained" onClick={handleApply} disabled={busy || !canSubmit}>
          {busy ? 'מייבא…' : 'מזג לתיק הנוכחי'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

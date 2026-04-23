import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Alert,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Chip,
  Grid,
  LinearProgress,
  Paper,
  Stack,
  Typography,
} from '@mui/material'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import AddIcon from '@mui/icons-material/Add'
import { CASE_TEMPLATES, UNDERCOVER_CASE, type CourtroomCaseTemplate } from '../templates/undercoverCase'
import {
  addEvidence,
  addProtocolLine,
  createSession,
  listSessions,
} from '../api/courtroomApi'
import { themeForRole } from '../theme/roleColors'
import type { CourtroomSession } from '../types'
import { courtLevelLabel, trackLabel } from '@/features/virtual-court-2/utils/labels'
import type { ParticipantRole } from '@/features/virtual-court-2/types'

export const CourtroomLobbyPage: React.FC = () => {
  const nav = useNavigate()
  const [sessions, setSessions] = useState<CourtroomSession[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [creating, setCreating] = useState<string | null>(null)

  const load = async (): Promise<void> => {
    setLoading(true)
    setError(null)
    try {
      const list = await listSessions()
      setSessions(list)
    } catch (e) {
      const err = e as { message?: string }
      setError(err.message ?? 'שגיאה בטעינת חדרים')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void load()
  }, [])

  const handleCreate = async (tpl: CourtroomCaseTemplate): Promise<void> => {
    setCreating(tpl.caseId)
    try {
      const session = await createSession({
        caseId: tpl.caseId,
        hearingId: `${tpl.hearingId}-${Date.now().toString(36)}`,
        title: tpl.title,
        courtLevel: tpl.courtLevel,
        caseTrack: tpl.caseTrack,
        mode: tpl.mode ?? 'open',
      })

      // Preload evidence + opening protocol only if session is empty.
      if ((session.evidence?.length ?? 0) === 0) {
        for (const ev of tpl.preloadedEvidence) {
          try {
            await addEvidence(session._id, ev)
          } catch {
            /* ignore individual failures */
          }
        }
      }
      if ((session.protocol?.length ?? 0) === 0) {
        for (const line of tpl.openingProtocol) {
          try {
            await addProtocolLine(session._id, {
              text: line.text,
              entryType: line.entryType,
              speakerName: line.speakerName,
              speakerRole: line.role as ParticipantRole,
            })
          } catch {
            /* ignore */
          }
        }
      }

      nav(`/courtroom/${session._id}`)
    } catch (e) {
      const err = e as { message?: string }
      setError(err.message ?? 'שגיאה ביצירת חדר')
    } finally {
      setCreating(null)
    }
  }

  return (
    <Box sx={{ py: 2 }}>
      <Paper variant="outlined" sx={{ p: 3, mb: 3 }}>
        <Typography variant="h4" fontWeight={800} gutterBottom>
          חדר דיונים חי
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 840 }}>
          סביבה אינטראקטיבית לדיון בית משפט בזמן אמת — וידאו, פרוטוקול חי צבוע לפי תפקידים, ראיות משותפות,
          ודיוני &quot;דלתיים סגורות&quot;. בחרו תיק מהתבניות כדי לפתוח חדר, או הצטרפו לחדרים פעילים.
        </Typography>
      </Paper>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Typography variant="h6" sx={{ mb: 1 }}>
        תבניות תיקים
      </Typography>
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {CASE_TEMPLATES.map((tpl) => (
          <Grid item xs={12} md={6} key={tpl.caseId}>
            <Card variant="outlined" sx={{ height: '100%' }}>
              <CardContent>
                <Stack direction="row" spacing={1} sx={{ mb: 1, flexWrap: 'wrap' }}>
                  <Chip size="small" label={`ערכאה: ${courtLevelLabel[tpl.courtLevel]}`} />
                  <Chip size="small" label={`מסלול: ${trackLabel[tpl.caseTrack]}`} />
                  {tpl.mode === 'closed_doors' && (
                    <Chip size="small" color="warning" label="דלתיים סגורות" />
                  )}
                  {tpl.mode === 'appeal' && <Chip size="small" color="info" label="ערעור" />}
                  {tpl.mode === 'mediation' && <Chip size="small" color="success" label="גישור" />}
                </Stack>
                <Typography variant="h6" fontWeight={700}>
                  {tpl.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  {tpl.shortDescription}
                </Typography>

                <Typography variant="subtitle2" sx={{ mt: 2 }}>
                  אישומים עיקריים:
                </Typography>
                <Box component="ul" sx={{ m: 0, pl: 3 }}>
                  {tpl.charges.map((c) => (
                    <li key={c}>
                      <Typography variant="body2">{c}</Typography>
                    </li>
                  ))}
                </Box>
              </CardContent>
              <CardActions>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  disabled={creating === tpl.caseId}
                  onClick={() => void handleCreate(tpl)}
                >
                  פתח חדר דיונים
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Stack direction="row" alignItems="center" sx={{ mb: 1 }} spacing={1}>
        <Typography variant="h6" sx={{ flex: 1 }}>
          חדרים פעילים
        </Typography>
        <Button onClick={() => void load()} disabled={loading}>
          רענן
        </Button>
      </Stack>
      {loading && <LinearProgress />}
      {!loading && sessions.length === 0 && (
        <Typography variant="body2" color="text.secondary">
          אין חדרים פעילים. פתחו אחד מהתבניות למעלה.
        </Typography>
      )}
      <Grid container spacing={2}>
        {sessions.map((s) => (
          <Grid item xs={12} sm={6} md={4} key={s._id}>
            <Card
              variant="outlined"
              sx={{
                borderInlineStart: `6px solid ${themeForRole('judge').color}`,
              }}
            >
              <CardContent>
                <Stack direction="row" spacing={1} sx={{ mb: 1, flexWrap: 'wrap' }}>
                  <Chip
                    size="small"
                    color={s.status === 'live' ? 'success' : s.status === 'ended' ? 'default' : 'info'}
                    label={
                      s.status === 'live' ? 'חי' : s.status === 'ended' ? 'הסתיים' : 'מתוזמן'
                    }
                  />
                  <Chip size="small" label={courtLevelLabel[s.courtLevel]} />
                  <Chip size="small" label={trackLabel[s.caseTrack]} />
                </Stack>
                <Typography variant="subtitle1" fontWeight={700}>
                  {s.title}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  משתתפים: {s.participants?.length ?? 0} · רישומים: {s.protocol?.length ?? 0}
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  variant="outlined"
                  startIcon={<PlayArrowIcon />}
                  onClick={() => nav(`/courtroom/${s._id}`)}
                >
                  כניסה לחדר
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Box sx={{ textAlign: 'center', mt: 4 }}>
        <Button variant="text" onClick={() => void handleCreate(UNDERCOVER_CASE)}>
          פתח את תיק הדגל (סמוי + 50 נאשמים)
        </Button>
      </Box>
    </Box>
  )
}

export default CourtroomLobbyPage

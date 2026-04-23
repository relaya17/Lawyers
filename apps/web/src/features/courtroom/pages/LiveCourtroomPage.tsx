import React, { useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import {
  Alert,
  Box,
  Button,
  Chip,
  Grid,
  LinearProgress,
  Paper,
  Stack,
  Typography,
} from '@mui/material'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import StopIcon from '@mui/icons-material/Stop'
import LoginIcon from '@mui/icons-material/Login'
import LockIcon from '@mui/icons-material/Lock'
import type { ParticipantRole } from '@/features/virtual-court-2/types'
import { useSessionAuth } from '@/features/auth/providers/SessionAuthProvider'
import { useLiveCourtroom } from '../hooks/useLiveCourtroom'
import { VideoGrid } from '../components/VideoGrid'
import { LiveProtocol } from '../components/LiveProtocol'
import { EvidenceTray } from '../components/EvidenceTray'
import { RolePickerDialog } from '../components/RolePickerDialog'
import {
  endHearing,
  joinSession,
  leaveSession,
  startHearing,
} from '../api/courtroomApi'
import { themeForRole } from '../theme/roleColors'
import { courtLevelLabel, trackLabel } from '@/features/virtual-court-2/utils/labels'

const jitsiBase = (): string =>
  (import.meta.env.VITE_JITSI_BASE_URL as string | undefined)?.replace(/\/$/, '') ||
  'https://meet.jit.si'

export const LiveCourtroomPage: React.FC = () => {
  const { sessionId } = useParams<{ sessionId: string }>()
  const { session, capabilities, loading, error, currentSpeakerUserId, refresh } = useLiveCourtroom(sessionId)
  const { user } = useSessionAuth()

  const [rolePickerOpen, setRolePickerOpen] = useState(false)
  const [busy, setBusy] = useState(false)

  const myParticipant = useMemo(() => {
    if (!session || !user) return undefined
    return session.participants.find((p) => p.userId === user.id && !p.leftAt)
  }, [session, user])

  // Use server-authoritative capabilities when available, fall back to local derivation
  const canStart = capabilities?.canStart ?? false
  const canEnd = capabilities?.canEnd ?? false
  const canChangeMode = capabilities?.canChangeMode ?? false
  const canEditProtocol = capabilities?.canEditAnyProtocol ?? false
  const canManageEvidence = capabilities?.canAddEvidence ?? false
  const canSuggestAi = capabilities?.canSuggestAiLine ?? false
  const canTranscribe = capabilities?.canTranscribe ?? true // fail-open for mic

  const isClosedDoors = session?.mode === 'closed_doors'
  const hasCourtAccess =
    capabilities?.isJudicial || capabilities?.isProsecution || capabilities?.isDefense
  const blockedByClosedDoors = isClosedDoors && !hasCourtAccess

  const jitsiUrl = useMemo(() => {
    if (!session) return undefined
    const room = `LexStudy-LC-${session._id.slice(-12)}`
    return `${jitsiBase()}/${encodeURIComponent(room)}`
  }, [session])

  const handleJoin = async (role: ParticipantRole, displayName: string): Promise<void> => {
    if (!session) return
    setBusy(true)
    try {
      await joinSession(session._id, { role, displayName, avatarUrl: user?.avatar })
      setRolePickerOpen(false)
      await refresh()
    } finally {
      setBusy(false)
    }
  }

  const handleLeave = async (): Promise<void> => {
    if (!session) return
    setBusy(true)
    try {
      await leaveSession(session._id)
      await refresh()
    } finally {
      setBusy(false)
    }
  }

  const handleStart = async (): Promise<void> => {
    if (!session) return
    setBusy(true)
    try {
      await startHearing(session._id)
      await refresh()
    } finally {
      setBusy(false)
    }
  }

  const handleEnd = async (): Promise<void> => {
    if (!session) return
    setBusy(true)
    try {
      await endHearing(session._id)
      await refresh()
    } finally {
      setBusy(false)
    }
  }

  if (loading && !session) return <LinearProgress />
  if (error && !session)
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        {error}
      </Alert>
    )
  if (!session) return null

  return (
    <Box sx={{ py: 2 }}>
      <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={1} alignItems={{ md: 'center' }}>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h5" fontWeight={700}>
              {session.title}
            </Typography>
            <Stack direction="row" spacing={1} sx={{ mt: 0.5, flexWrap: 'wrap' }}>
              <Chip size="small" label={`ערכאה: ${courtLevelLabel[session.courtLevel]}`} />
              <Chip size="small" label={`מסלול: ${trackLabel[session.caseTrack]}`} />
              <Chip
                size="small"
                color={session.status === 'live' ? 'success' : session.status === 'ended' ? 'default' : 'info'}
                label={
                  session.status === 'live'
                    ? 'דיון חי'
                    : session.status === 'ended'
                      ? 'הסתיים'
                      : 'מתוזמן'
                }
              />
              {myParticipant && (
                <Chip
                  size="small"
                  label={`אתה: ${themeForRole(myParticipant.role).label}`}
                  sx={{ bgcolor: myParticipant.color, color: '#fff', fontWeight: 700 }}
                />
              )}
            </Stack>
          </Box>

          <Stack direction="row" spacing={1}>
            {!myParticipant && (
              <Button
                variant="contained"
                startIcon={<LoginIcon />}
                disabled={busy}
                onClick={() => setRolePickerOpen(true)}
              >
                הצטרפות לדיון
              </Button>
            )}
            {myParticipant && session.status === 'scheduled' && canStart && (
              <Button
                variant="contained"
                color="success"
                startIcon={<PlayArrowIcon />}
                disabled={busy}
                onClick={handleStart}
              >
                התחל דיון
              </Button>
            )}
            {myParticipant && session.status === 'live' && canEnd && (
              <Button
                variant="contained"
                color="warning"
                startIcon={<StopIcon />}
                disabled={busy}
                onClick={handleEnd}
              >
                סיים דיון
              </Button>
            )}
            {myParticipant && (
              <Button variant="outlined" disabled={busy} onClick={handleLeave}>
                יציאה
              </Button>
            )}
          </Stack>
        </Stack>
      </Paper>

      {blockedByClosedDoors && (
        <Alert
          severity="warning"
          icon={<LockIcon />}
          sx={{ mb: 2 }}
          action={
            <Button color="inherit" size="small" onClick={() => setRolePickerOpen(true)}>
              שנה תפקיד
            </Button>
          }
        >
          <strong>דיון בדלתיים סגורות.</strong> תוכן הפרוטוקול והראיות נחסם לצופים
          שאינם בעלי תפקיד משפטי בתיק.
        </Alert>
      )}

      <Grid container spacing={2}>
        <Grid item xs={12} md={3}>
          <EvidenceTray
            sessionId={session._id}
            evidence={session.evidence}
            canManage={canManageEvidence}
            onChange={refresh}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <Box sx={{ height: { md: 'calc(100vh - 240px)' }, display: 'flex' }}>
            <LiveProtocol
              sessionId={session._id}
              lines={session.protocol}
              participants={session.participants}
              myUserId={user?.id}
              canEdit={canEditProtocol}
              canSuggestAi={canSuggestAi}
              canTranscribe={canTranscribe}
              onChange={refresh}
            />
          </Box>
        </Grid>

        <Grid item xs={12} md={3}>
          <VideoGrid
            participants={session.participants}
            currentSpeakerUserId={currentSpeakerUserId}
            jitsiUrl={myParticipant ? jitsiUrl : undefined}
          />
        </Grid>
      </Grid>

      <RolePickerDialog
        open={rolePickerOpen}
        defaultName={user ? `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim() || user.email : ''}
        onClose={() => setRolePickerOpen(false)}
        onConfirm={(role, displayName) => void handleJoin(role, displayName)}
      />
    </Box>
  )
}

export default LiveCourtroomPage

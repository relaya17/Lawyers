import React, { useMemo, useState } from 'react'
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material'
import VideocamIcon from '@mui/icons-material/Videocam'
import VideocamOffIcon from '@mui/icons-material/VideocamOff'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import type { LegalCase } from '../types'
import { roleLabel } from '../utils/labels'
import { useVirtualCourt2Store } from '../store/useVirtualCourt2Store'

interface Props {
  legalCase: LegalCase
}

const jitsiBase = (): string =>
  (import.meta.env.VITE_JITSI_BASE_URL as string | undefined)?.replace(/\/$/, '') ||
  'https://meet.jit.si'

export const VideoRoomPanel: React.FC<Props> = ({ legalCase }) => {
  const toggleVideo = useVirtualCourt2Store((s) => s.toggleVideo)
  const [jitsiOpen, setJitsiOpen] = useState(false)

  const active = legalCase.participants.filter((p) => p.videoEnabled)
  const liveHearing = legalCase.hearings.find((h) => h.status === 'live')

  const roomName = useMemo(() => {
    if (liveHearing?.videoRoomId) return liveHearing.videoRoomId
    return `LexStudy-VC2-${legalCase.id.replace(/[^a-zA-Z0-9-]/g, '').slice(-24) || legalCase.id}`
  }, [liveHearing?.videoRoomId, legalCase.id])

  const jitsiUrl = `${jitsiBase()}/${encodeURIComponent(roomName)}`

  return (
    <Card variant="outlined">
      <CardContent>
        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
          <VideocamIcon color="primary" />
          <Typography variant="h6">חדר וידאו</Typography>
          <Box flex={1} />
          {liveHearing ? (
            <Chip size="small" color="success" label={`דיון חי: ${liveHearing.title}`} />
          ) : (
            <Chip size="small" label="אין דיון חי" />
          )}
        </Stack>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          <strong>וידאו אמיתי (Jitsi):</strong> פתחו חדר משותף לסימולציה. ניתן להגדיר כתובת שרת אחרת ב־
          <code>VITE_JITSI_BASE_URL</code>. הכפתורים למטה מסמנים מי &quot;מחובר&quot; לצורכי תרגול בלבד.
        </Typography>

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} sx={{ mb: 2 }}>
          <Button variant="contained" startIcon={<VideocamIcon />} onClick={() => setJitsiOpen(true)}>
            הצטרפות לחדר Jitsi
          </Button>
          <Button
            variant="outlined"
            endIcon={<OpenInNewIcon />}
            href={jitsiUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            פתח בלשונית חדשה
          </Button>
        </Stack>
        <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 2 }}>
          שם חדר: {roomName}
        </Typography>

        <Grid container spacing={1}>
          {legalCase.participants.length === 0 && (
            <Grid item xs={12}>
              <Typography variant="body2" color="text.secondary">
                אין משתתפים בתיק. יש להוסיף משתתפים בלשונית "משתתפים".
              </Typography>
            </Grid>
          )}
          {legalCase.participants.map((p) => (
            <Grid item xs={12} sm={6} md={4} key={p.id}>
              <Card
                variant="outlined"
                sx={{
                  bgcolor: p.videoEnabled ? 'action.hover' : 'background.default',
                  borderColor: p.videoEnabled ? 'success.light' : 'divider',
                }}
              >
                <CardContent>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Avatar>{p.name.slice(0, 1)}</Avatar>
                    <Box flex={1} minWidth={0}>
                      <Typography variant="body2" fontWeight={600} noWrap>
                        {p.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {roleLabel[p.role]} {p.isAI ? '(AI)' : ''}
                      </Typography>
                    </Box>
                    <Tooltip title={p.videoEnabled ? 'סמן כלא מחובר' : 'סמן כמחובר'}>
                      <IconButton size="small" onClick={() => toggleVideo(legalCase.id, p.id)}>
                        {p.videoEnabled ? <VideocamIcon color="success" /> : <VideocamOffIcon />}
                      </IconButton>
                    </Tooltip>
                  </Stack>
                  <Box
                    sx={{
                      mt: 1,
                      height: 90,
                      borderRadius: 1,
                      bgcolor: p.videoEnabled ? '#0b132b' : 'grey.200',
                      color: p.videoEnabled ? 'common.white' : 'text.secondary',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 12,
                      px: 1,
                      textAlign: 'center',
                    }}
                  >
                    {p.videoEnabled ? 'מסומן כמחובר (תרגול)' : 'לא מחובר'}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {active.length > 0 && (
          <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
            מסומנים כמחוברים: {active.length}
          </Typography>
        )}
      </CardContent>

      <Dialog open={jitsiOpen} onClose={() => setJitsiOpen(false)} fullWidth maxWidth="md">
        <DialogTitle>חדר Jitsi — {roomName}</DialogTitle>
        <DialogContent sx={{ p: 0 }}>
          <Box
            component="iframe"
            title="Jitsi"
            src={`${jitsiUrl}#config.prejoinPageEnabled=false&config.startWithAudioMuted=false`}
            sx={{
              border: 'none',
              width: '100%',
              height: { xs: 360, sm: 480 },
              display: 'block',
            }}
            allow="camera; microphone; fullscreen; display-capture"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setJitsiOpen(false)}>סגור</Button>
        </DialogActions>
      </Dialog>
    </Card>
  )
}

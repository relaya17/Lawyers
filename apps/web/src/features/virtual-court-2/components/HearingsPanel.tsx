import React, { useState } from 'react'
import {
  Button,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  Stack,
  TextField,
  Typography,
  Box,
} from '@mui/material'
import EventIcon from '@mui/icons-material/Event'
import type { HearingStatus, LegalCase } from '../types'
import { useVirtualCourt2Store } from '../store/useVirtualCourt2Store'

const hearingStatusLabel: Record<HearingStatus, string> = {
  scheduled: 'מתוזמן',
  live: 'חי',
  completed: 'הסתיים',
  cancelled: 'בוטל',
}

interface Props {
  legalCase: LegalCase
}

export const HearingsPanel: React.FC<Props> = ({ legalCase }) => {
  const addHearing = useVirtualCourt2Store((s) => s.addHearing)
  const updateHearing = useVirtualCourt2Store((s) => s.updateHearing)

  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [scheduledAt, setScheduledAt] = useState(() =>
    new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16)
  )
  const [durationMinutes, setDuration] = useState(60)
  const [agenda, setAgenda] = useState('')

  const handleAdd = () => {
    if (!title.trim()) return
    addHearing(legalCase.id, {
      title: title.trim(),
      scheduledAt: new Date(scheduledAt).toISOString(),
      durationMinutes,
      status: 'scheduled',
      agenda: agenda
        .split('\n')
        .map((l) => l.trim())
        .filter(Boolean),
      participantIds: legalCase.participants.map((p) => p.id),
      videoRoomId: `vc2-${legalCase.id.slice(-6)}-${Date.now().toString(36)}`,
    })
    setOpen(false)
    setTitle('')
    setAgenda('')
  }

  return (
    <Card variant="outlined">
      <CardContent>
        <Stack direction="row" alignItems="center" sx={{ mb: 1 }}>
          <Typography variant="h6">דיונים</Typography>
          <Box flex={1} />
          <Button size="small" variant="contained" startIcon={<EventIcon />} onClick={() => setOpen(true)}>
            קבע דיון
          </Button>
        </Stack>

        {legalCase.hearings.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            אין דיונים מתוזמנים. קבעו דיון — תיק יכול להתנהל לאורך שבועות, עם דיונים מרובים.
          </Typography>
        ) : (
          <List dense>
            {[...legalCase.hearings]
              .sort((a, b) => a.scheduledAt.localeCompare(b.scheduledAt))
              .map((h) => (
                <ListItem key={h.id} divider alignItems="flex-start">
                  <ListItemText
                    primary={
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Typography variant="body1" fontWeight={600}>
                          {h.title}
                        </Typography>
                        <Chip size="small" label={hearingStatusLabel[h.status]} />
                        {h.videoRoomId && <Chip size="small" variant="outlined" label={`חדר וידאו: ${h.videoRoomId}`} />}
                      </Stack>
                    }
                    secondary={
                      <>
                        <Typography variant="caption" color="text.secondary">
                          {new Date(h.scheduledAt).toLocaleString('he-IL')} · {h.durationMinutes} דק׳
                        </Typography>
                        {h.agenda.length > 0 && (
                          <Box sx={{ mt: 0.5 }}>
                            {h.agenda.map((a, i) => (
                              <Typography key={i} variant="body2" color="text.secondary">
                                • {a}
                              </Typography>
                            ))}
                          </Box>
                        )}
                      </>
                    }
                  />
                  <Stack spacing={0.5} sx={{ ml: 1 }}>
                    <TextField
                      select
                      size="small"
                      value={h.status}
                      onChange={(e) =>
                        updateHearing(legalCase.id, h.id, {
                          status: e.target.value as HearingStatus,
                        })
                      }
                      sx={{ minWidth: 120 }}
                    >
                      {(['scheduled', 'live', 'completed', 'cancelled'] as HearingStatus[]).map((s) => (
                        <MenuItem key={s} value={s}>
                          {hearingStatusLabel[s]}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Stack>
                </ListItem>
              ))}
          </List>
        )}
      </CardContent>

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>קביעת דיון</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField label="כותרת הדיון" value={title} onChange={(e) => setTitle(e.target.value)} fullWidth autoFocus />
            <TextField
              label="מועד"
              type="datetime-local"
              value={scheduledAt}
              onChange={(e) => setScheduledAt(e.target.value)}
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="משך (דקות)"
              type="number"
              value={durationMinutes}
              onChange={(e) => setDuration(parseInt(e.target.value, 10) || 60)}
              inputProps={{ min: 15, step: 15 }}
              fullWidth
            />
            <TextField
              label="סדר יום (שורה לכל סעיף)"
              value={agenda}
              onChange={(e) => setAgenda(e.target.value)}
              multiline
              minRows={3}
              fullWidth
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>ביטול</Button>
          <Button onClick={handleAdd} variant="contained">
            קבע דיון
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  )
}

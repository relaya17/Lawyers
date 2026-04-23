import React, { useState } from 'react'
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import type { LegalCase, MediationProposal } from '../types'
import { useVirtualCourt2Store } from '../store/useVirtualCourt2Store'

const statusLabel: Record<MediationProposal['status'], string> = {
  open: 'פתוחה',
  accepted: 'התקבלה',
  rejected: 'נדחתה',
  countered: 'הצעה נגדית',
}

interface Props {
  legalCase: LegalCase
}

export const MediationPanel: React.FC<Props> = ({ legalCase }) => {
  const addMediation = useVirtualCourt2Store((s) => s.addMediation)
  const updateStatus = useVirtualCourt2Store((s) => s.updateMediationStatus)

  const [by, setBy] = useState(legalCase.participants[0]?.id || '')
  const [summary, setSummary] = useState('')
  const [terms, setTerms] = useState('')

  const handleAdd = () => {
    if (!summary.trim() || !by) return
    addMediation(legalCase.id, {
      byParticipantId: by,
      summary: summary.trim(),
      terms: terms
        .split('\n')
        .map((t) => t.trim())
        .filter(Boolean),
      status: 'open',
    })
    setSummary('')
    setTerms('')
  }

  return (
    <Card variant="outlined">
      <CardContent>
        <Typography variant="h6" sx={{ mb: 1 }}>
          גישור / מו״מ עסקי / טיעון
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          ניתן להגיש הצעות פשרה, הסדר טיעון או מו״מ מסחרי לפני הכרעה שיפוטית.
        </Typography>

        <Stack spacing={1} sx={{ mb: 2 }}>
          <TextField
            select
            label="מוגשת על ידי"
            value={by}
            onChange={(e) => setBy(e.target.value)}
            size="small"
            fullWidth
          >
            {legalCase.participants.length === 0 && <MenuItem value="">— אין משתתפים —</MenuItem>}
            {legalCase.participants.map((p) => (
              <MenuItem key={p.id} value={p.id}>
                {p.name}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="תמצית ההצעה"
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            size="small"
            fullWidth
          />
          <TextField
            label="תנאים (שורה לכל תנאי)"
            value={terms}
            onChange={(e) => setTerms(e.target.value)}
            size="small"
            fullWidth
            multiline
            minRows={3}
          />
          <Box>
            <Button variant="contained" onClick={handleAdd} disabled={!summary.trim() || !by}>
              הגש הצעה
            </Button>
          </Box>
        </Stack>

        {legalCase.mediations.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            אין הצעות פתוחות.
          </Typography>
        ) : (
          <List dense>
            {legalCase.mediations.map((m) => {
              const author = legalCase.participants.find((p) => p.id === m.byParticipantId)
              return (
                <ListItem key={m.id} divider alignItems="flex-start">
                  <ListItemText
                    primary={
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Typography variant="body1" fontWeight={600}>
                          {m.summary}
                        </Typography>
                        <Chip size="small" label={statusLabel[m.status]} />
                      </Stack>
                    }
                    secondary={
                      <>
                        <Typography variant="caption" color="text.secondary">
                          {author?.name || 'משתתף'} · {new Date(m.at).toLocaleString('he-IL')}
                        </Typography>
                        {m.terms.map((t, i) => (
                          <Typography key={i} variant="body2">
                            • {t}
                          </Typography>
                        ))}
                      </>
                    }
                  />
                  <Stack direction="row" spacing={0.5}>
                    <Button size="small" onClick={() => updateStatus(legalCase.id, m.id, 'accepted')}>
                      קבל
                    </Button>
                    <Button size="small" onClick={() => updateStatus(legalCase.id, m.id, 'countered')}>
                      נגדית
                    </Button>
                    <Button size="small" color="error" onClick={() => updateStatus(legalCase.id, m.id, 'rejected')}>
                      דחה
                    </Button>
                  </Stack>
                </ListItem>
              )
            })}
          </List>
        )}
      </CardContent>
    </Card>
  )
}

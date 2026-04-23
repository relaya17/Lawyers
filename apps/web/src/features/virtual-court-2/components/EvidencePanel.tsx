import React, { useState } from 'react'
import {
  Box,
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
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import type { EvidenceKind, LegalCase } from '../types'
import { useVirtualCourt2Store } from '../store/useVirtualCourt2Store'

const KINDS: EvidenceKind[] = ['document', 'testimony', 'expert_report', 'exhibit', 'video', 'audio']

const kindLabel: Record<EvidenceKind, string> = {
  document: 'מסמך',
  testimony: 'עדות',
  expert_report: 'חוות דעת מומחה',
  exhibit: 'מוצג',
  video: 'וידאו',
  audio: 'שמע',
}

interface Props {
  legalCase: LegalCase
}

export const EvidencePanel: React.FC<Props> = ({ legalCase }) => {
  const addEvidence = useVirtualCourt2Store((s) => s.addEvidence)
  const admitEvidence = useVirtualCourt2Store((s) => s.admitEvidence)

  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [kind, setKind] = useState<EvidenceKind>('document')
  const [description, setDescription] = useState('')

  const handleAdd = () => {
    if (!title.trim()) return
    addEvidence(legalCase.id, {
      title: title.trim(),
      kind,
      description: description.trim(),
    })
    setTitle('')
    setDescription('')
    setKind('document')
    setOpen(false)
  }

  return (
    <Card variant="outlined">
      <CardContent>
        <Stack direction="row" alignItems="center" sx={{ mb: 1 }}>
          <Typography variant="h6">ראיות</Typography>
          <Box flex={1} />
          <Button size="small" startIcon={<AddIcon />} variant="contained" onClick={() => setOpen(true)}>
            הגש ראיה
          </Button>
        </Stack>

        {legalCase.evidence.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            אין ראיות. הגישו מסמכים, עדויות וחוות דעת — והחליטו על קבילותן.
          </Typography>
        ) : (
          <List dense>
            {legalCase.evidence.map((ev) => (
              <ListItem key={ev.id} divider>
                <ListItemText
                  primary={
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Typography variant="body1" fontWeight={600}>
                        {ev.title}
                      </Typography>
                      <Chip size="small" label={kindLabel[ev.kind]} />
                      {ev.admitted === true && <Chip size="small" color="success" label="קבילה" />}
                      {ev.admitted === false && <Chip size="small" color="error" label="נדחתה" />}
                    </Stack>
                  }
                  secondary={ev.description}
                />
                <Stack direction="row" spacing={0.5}>
                  <Button size="small" onClick={() => admitEvidence(legalCase.id, ev.id, true)}>
                    קבל
                  </Button>
                  <Button size="small" color="error" onClick={() => admitEvidence(legalCase.id, ev.id, false)}>
                    דחה
                  </Button>
                </Stack>
              </ListItem>
            ))}
          </List>
        )}
      </CardContent>

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="xs">
        <DialogTitle>הגשת ראיה</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField label="כותרת" value={title} onChange={(e) => setTitle(e.target.value)} fullWidth autoFocus />
            <TextField
              select
              label="סוג"
              value={kind}
              onChange={(e) => setKind(e.target.value as EvidenceKind)}
              fullWidth
            >
              {KINDS.map((k) => (
                <MenuItem key={k} value={k}>
                  {kindLabel[k]}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              label="תיאור"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              fullWidth
              multiline
              minRows={3}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>ביטול</Button>
          <Button onClick={handleAdd} variant="contained">
            הגש
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  )
}

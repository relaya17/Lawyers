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
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  MenuItem,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import GavelIcon from '@mui/icons-material/Gavel'
import type { AccessLevel, EvidenceKind, EvidenceRecord } from '../types'
import { addEvidence, hideEvidence, presentEvidence } from '../api/courtroomApi'

const KIND_OPTIONS: { value: EvidenceKind; label: string }[] = [
  { value: 'document', label: 'מסמך' },
  { value: 'image', label: 'תמונה' },
  { value: 'video', label: 'וידאו' },
  { value: 'audio', label: 'אודיו' },
  { value: 'confidential_report', label: 'דוח חסוי' },
  { value: 'exhibit', label: 'מוצג' },
]

const ACCESS_OPTIONS: { value: AccessLevel; label: string }[] = [
  { value: 'all', label: 'לכולם' },
  { value: 'judges_only', label: 'לשופטים בלבד' },
  { value: 'prosecution_only', label: 'לתביעה בלבד' },
  { value: 'defense_only', label: 'להגנה בלבד' },
]

interface Props {
  sessionId: string
  evidence: EvidenceRecord[]
  canManage: boolean
  onChange?: () => void
}

export const EvidenceTray: React.FC<Props> = ({ sessionId, evidence, canManage, onChange }) => {
  const [open, setOpen] = useState(false)
  const [kind, setKind] = useState<EvidenceKind>('document')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [url, setUrl] = useState('')
  const [accessLevel, setAccessLevel] = useState<AccessLevel>('all')
  const [saving, setSaving] = useState(false)

  const handleAdd = async (): Promise<void> => {
    if (!title.trim()) return
    setSaving(true)
    try {
      await addEvidence(sessionId, {
        kind,
        title: title.trim(),
        description: description.trim() || undefined,
        url: url.trim() || undefined,
        accessLevel,
      })
      setOpen(false)
      setTitle('')
      setDescription('')
      setUrl('')
      setAccessLevel('all')
      onChange?.()
    } finally {
      setSaving(false)
    }
  }

  return (
    <Card variant="outlined" sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ pb: 1 }}>
        <Stack direction="row" alignItems="center" spacing={1}>
          <GavelIcon color="primary" />
          <Typography variant="h6" sx={{ flex: 1 }}>
            סל המוצגים
          </Typography>
          {canManage && (
            <Button
              size="small"
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setOpen(true)}
            >
              הוסף
            </Button>
          )}
        </Stack>
      </CardContent>

      <Box sx={{ flex: 1, overflowY: 'auto', px: 2, pb: 2 }}>
        {evidence.length === 0 && (
          <Typography variant="body2" color="text.secondary">
            טרם הוגשו ראיות.
          </Typography>
        )}
        <List dense>
          {evidence.map((ev) => (
            <ListItem
              key={ev.evidenceId}
              disablePadding
              secondaryAction={
                canManage ? (
                  ev.currentlyPresented ? (
                    <Tooltip title="הסתר מכולם">
                      <IconButton
                        edge="end"
                        color="warning"
                        onClick={() => {
                          void hideEvidence(sessionId, ev.evidenceId).then(() => onChange?.())
                        }}
                      >
                        <VisibilityOffIcon />
                      </IconButton>
                    </Tooltip>
                  ) : (
                    <Tooltip title="הצג לכולם">
                      <IconButton
                        edge="end"
                        color="success"
                        onClick={() => {
                          void presentEvidence(sessionId, ev.evidenceId).then(() => onChange?.())
                        }}
                      >
                        <VisibilityIcon />
                      </IconButton>
                    </Tooltip>
                  )
                ) : undefined
              }
            >
              <ListItemButton
                component={ev.url ? 'a' : 'div'}
                href={ev.url}
                target={ev.url ? '_blank' : undefined}
                rel="noopener noreferrer"
              >
                <ListItemText
                  primary={
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Typography variant="body2" fontWeight={600}>
                        {ev.title}
                      </Typography>
                      {ev.currentlyPresented && (
                        <Chip size="small" label="מוצג" color="success" />
                      )}
                      {ev.accessLevel !== 'all' && (
                        <Chip
                          size="small"
                          label={ACCESS_OPTIONS.find((a) => a.value === ev.accessLevel)?.label}
                          color="warning"
                        />
                      )}
                    </Stack>
                  }
                  secondary={
                    <Typography variant="caption" color="text.secondary">
                      {KIND_OPTIONS.find((k) => k.value === ev.kind)?.label}
                      {ev.description ? ` · ${ev.description}` : ''}
                    </Typography>
                  }
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>הוספת ראייה</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              select
              label="סוג"
              value={kind}
              onChange={(e) => setKind(e.target.value as EvidenceKind)}
            >
              {KIND_OPTIONS.map((k) => (
                <MenuItem key={k.value} value={k.value}>
                  {k.label}
                </MenuItem>
              ))}
            </TextField>
            <TextField label="כותרת" value={title} onChange={(e) => setTitle(e.target.value)} required />
            <TextField
              label="תיאור"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              multiline
              minRows={2}
            />
            <TextField
              label="קישור (אופציונלי)"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://..."
            />
            <TextField
              select
              label="רמת גישה"
              value={accessLevel}
              onChange={(e) => setAccessLevel(e.target.value as AccessLevel)}
            >
              {ACCESS_OPTIONS.map((a) => (
                <MenuItem key={a.value} value={a.value}>
                  {a.label}
                </MenuItem>
              ))}
            </TextField>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>ביטול</Button>
          <Button variant="contained" disabled={saving || !title.trim()} onClick={handleAdd}>
            הוסף
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  )
}

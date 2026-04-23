import React, { useState } from 'react'
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Paper,
  TextField,
  Typography,
} from '@mui/material'
import type { ParticipantRole } from '@/features/virtual-court-2/types'
import { ROLE_THEME } from '../theme/roleColors'

interface Props {
  open: boolean
  defaultName?: string
  onClose: () => void
  onConfirm: (role: ParticipantRole, displayName: string) => void
}

const ROLE_ORDER: ParticipantRole[] = [
  'judge',
  'student_judge',
  'prosecutor',
  'defense_lawyer',
  'plaintiff_lawyer',
  'plaintiff',
  'defendant',
  'witness',
  'expert',
  'clerk',
  'mediator',
  'observer',
]

export const RolePickerDialog: React.FC<Props> = ({ open, defaultName, onClose, onConfirm }) => {
  const [role, setRole] = useState<ParticipantRole>('observer')
  const [name, setName] = useState(defaultName ?? '')

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>בחירת תפקיד בדיון</DialogTitle>
      <DialogContent>
        <TextField
          label="שם תצוגה"
          value={name}
          onChange={(e) => setName(e.target.value)}
          fullWidth
          sx={{ mb: 2, mt: 1 }}
          required
        />
        <Typography variant="subtitle2" sx={{ mb: 1 }}>
          בחר/י תפקיד:
        </Typography>
        <Grid container spacing={1}>
          {ROLE_ORDER.map((r) => {
            const t = ROLE_THEME[r]
            const selected = role === r
            return (
              <Grid item xs={6} sm={4} md={3} key={r}>
                <Paper
                  elevation={selected ? 6 : 1}
                  onClick={() => setRole(r)}
                  sx={{
                    cursor: 'pointer',
                    p: 1.5,
                    borderRadius: 2,
                    borderInlineStart: `6px solid ${t.color}`,
                    bgcolor: selected ? t.secondary : 'background.paper',
                    transition: 'all .15s',
                    '&:hover': { bgcolor: t.secondary },
                  }}
                >
                  <Box sx={{ color: t.color, fontWeight: 700 }}>{t.label}</Box>
                  <Box sx={{ fontSize: 11, color: 'text.secondary' }}>{t.shortLabel}</Box>
                </Paper>
              </Grid>
            )
          })}
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>ביטול</Button>
        <Button
          variant="contained"
          disabled={!name.trim()}
          onClick={() => onConfirm(role, name.trim())}
        >
          הצטרפות
        </Button>
      </DialogActions>
    </Dialog>
  )
}

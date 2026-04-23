import React, { useMemo, useState } from 'react'
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
import DescriptionIcon from '@mui/icons-material/Description'
import DownloadIcon from '@mui/icons-material/Download'
import type { LegalCase, ParticipantRole, ProtocolEntryType } from '../types'
import { roleLabel } from '../utils/labels'
import { useVirtualCourt2Store } from '../store/useVirtualCourt2Store'

const ENTRY_TYPES: ProtocolEntryType[] = [
  'statement',
  'question',
  'objection',
  'ruling',
  'evidence',
  'note',
  'system',
]

const entryTypeLabel: Record<ProtocolEntryType, string> = {
  statement: 'הצהרה',
  question: 'שאלה',
  objection: 'התנגדות',
  ruling: 'החלטה',
  evidence: 'ראיה',
  note: 'הערה',
  system: 'מערכת',
}

interface Props {
  legalCase: LegalCase
}

export const ClerkProtocol: React.FC<Props> = ({ legalCase }) => {
  const addEntry = useVirtualCourt2Store((s) => s.addProtocolEntry)

  const [speakerId, setSpeakerId] = useState<string>(
    legalCase.participants[0]?.id || ''
  )
  const [text, setText] = useState('')
  const [type, setType] = useState<ProtocolEntryType>('statement')

  const selected = legalCase.participants.find((p) => p.id === speakerId)

  const entries = useMemo(
    () => [...legalCase.protocol].sort((a, b) => a.at.localeCompare(b.at)),
    [legalCase.protocol]
  )

  const handleAdd = () => {
    if (!text.trim()) return
    const speakerName = selected?.name || 'מערכת'
    const speakerRole: ParticipantRole = selected?.role || 'clerk'
    addEntry(legalCase.id, {
      speakerId: selected?.id,
      speakerName,
      speakerRole,
      type,
      text: text.trim(),
    })
    setText('')
  }

  const exportText = () => {
    const body = entries
      .map(
        (e) =>
          `[${new Date(e.at).toLocaleString('he-IL')}] [${entryTypeLabel[e.type]}] ${roleLabel[e.speakerRole]} ${e.speakerName}: ${e.text}`
      )
      .join('\n')
    const blob = new Blob([`פרוטוקול — ${legalCase.caseNumber} ${legalCase.title}\n\n${body}`], {
      type: 'text/plain;charset=utf-8',
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `protocol_${legalCase.caseNumber.replace(/\W+/g, '_')}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <Card variant="outlined">
      <CardContent>
        <Stack direction="row" alignItems="center" sx={{ mb: 1 }}>
          <DescriptionIcon color="primary" sx={{ mr: 1 }} />
          <Typography variant="h6">פרוטוקול המזכירה</Typography>
          <Box flex={1} />
          <Button
            size="small"
            startIcon={<DownloadIcon />}
            onClick={exportText}
            disabled={entries.length === 0}
          >
            יצוא טקסט
          </Button>
        </Stack>

        <Stack direction={{ xs: 'column', md: 'row' }} spacing={1} sx={{ mb: 2 }}>
          <TextField
            select
            label="דובר/ת"
            size="small"
            value={speakerId}
            onChange={(e) => setSpeakerId(e.target.value)}
            sx={{ minWidth: 180 }}
          >
            <MenuItem value="">— מערכת / מזכירה —</MenuItem>
            {legalCase.participants.map((p) => (
              <MenuItem key={p.id} value={p.id}>
                {p.name} ({roleLabel[p.role]})
              </MenuItem>
            ))}
          </TextField>
          <TextField
            select
            label="סוג"
            size="small"
            value={type}
            onChange={(e) => setType(e.target.value as ProtocolEntryType)}
            sx={{ minWidth: 140 }}
          >
            {ENTRY_TYPES.map((t) => (
              <MenuItem key={t} value={t}>
                {entryTypeLabel[t]}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="תוכן"
            size="small"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleAdd()
            }}
            fullWidth
          />
          <Button variant="contained" onClick={handleAdd} disabled={!text.trim()}>
            רשום
          </Button>
        </Stack>

        {entries.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            הפרוטוקול ריק. רשמו אמירות, שאלות, התנגדויות והחלטות בזמן הדיון.
          </Typography>
        ) : (
          <List dense sx={{ maxHeight: 320, overflow: 'auto' }}>
            {entries.map((e) => (
              <ListItem key={e.id} divider>
                <ListItemText
                  primary={
                    <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
                      <Chip size="small" label={entryTypeLabel[e.type]} />
                      <Typography variant="body2" fontWeight={600}>
                        {e.speakerName}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        ({roleLabel[e.speakerRole]})
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        · {new Date(e.at).toLocaleString('he-IL')}
                      </Typography>
                    </Stack>
                  }
                  secondary={e.text}
                />
              </ListItem>
            ))}
          </List>
        )}
      </CardContent>
    </Card>
  )
}

import React, { useEffect, useMemo, useRef, useState } from 'react'
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  IconButton,
  MenuItem,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import CheckIcon from '@mui/icons-material/Check'
import CloseIcon from '@mui/icons-material/Close'
import DownloadIcon from '@mui/icons-material/Download'
import SendIcon from '@mui/icons-material/Send'
import MicIcon from '@mui/icons-material/Mic'
import StopIcon from '@mui/icons-material/Stop'
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome'
import { themeForRole } from '../theme/roleColors'
import type { ProtocolEntryType, ProtocolLine, SessionParticipant } from '../types'
import {
  addProtocolLine,
  aiSuggestNextLine,
  editProtocolLine,
  exportUrl,
  transcribeAudio,
} from '../api/courtroomApi'
import { useMicRecorder } from '../hooks/useMicRecorder'

interface Props {
  sessionId: string
  lines: ProtocolLine[]
  participants: SessionParticipant[]
  myUserId?: string
  canEdit: boolean
  onChange?: () => void
}

const ENTRY_TYPES: { value: ProtocolEntryType; label: string }[] = [
  { value: 'statement', label: 'הצהרה' },
  { value: 'question', label: 'שאלה' },
  { value: 'objection', label: 'התנגדות' },
  { value: 'ruling', label: 'החלטה' },
  { value: 'evidence', label: 'ראייה' },
  { value: 'note', label: 'הערה' },
  { value: 'system', label: 'מערכת' },
]

export const LiveProtocol: React.FC<Props> = ({
  sessionId,
  lines,
  participants,
  myUserId,
  canEdit,
  onChange,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [text, setText] = useState('')
  const [entryType, setEntryType] = useState<ProtocolEntryType>('statement')
  const [sending, setSending] = useState(false)

  const [editingLineId, setEditingLineId] = useState<string | null>(null)
  const [editText, setEditText] = useState('')

  const recorder = useMicRecorder()
  const [transcribing, setTranscribing] = useState(false)
  const [aiLoading, setAiLoading] = useState(false)

  const myParticipant = useMemo(
    () => participants.find((p) => p.userId === myUserId),
    [participants, myUserId],
  )

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [lines.length])

  const handleSend = async (): Promise<void> => {
    if (!text.trim() || !myParticipant) return
    setSending(true)
    try {
      await addProtocolLine(sessionId, {
        text: text.trim(),
        entryType,
        speakerUserId: myParticipant.userId,
        speakerName: myParticipant.displayName,
        speakerRole: myParticipant.role,
      })
      setText('')
      onChange?.()
    } finally {
      setSending(false)
    }
  }

  const handleEditSave = async (lineId: string): Promise<void> => {
    if (!editText.trim()) return
    await editProtocolLine(sessionId, lineId, editText.trim())
    setEditingLineId(null)
    setEditText('')
    onChange?.()
  }

  const handleRecordToggle = async (): Promise<void> => {
    if (recorder.status === 'recording') {
      const blob = await recorder.stop()
      if (!blob || blob.size === 0) return
      setTranscribing(true)
      try {
        const { text: transcribed } = await transcribeAudio(sessionId, blob)
        if (transcribed) {
          setText((prev) => (prev ? `${prev} ${transcribed}` : transcribed))
        }
      } catch (e) {
        const err = e as { message?: string }
        console.error('[transcribe]', err.message)
      } finally {
        setTranscribing(false)
      }
    } else {
      await recorder.start()
    }
  }

  const handleAiSuggest = async (): Promise<void> => {
    setAiLoading(true)
    try {
      const s = await aiSuggestNextLine(sessionId)
      if (s.text.trim()) {
        await addProtocolLine(sessionId, {
          text: s.text,
          entryType: s.entryType,
          speakerName: s.speakerName,
          speakerRole: s.speakerRole as never,
          isAiGenerated: true,
        })
        onChange?.()
      }
    } catch (e) {
      const err = e as { message?: string }
      console.error('[ai-suggest]', err.message)
    } finally {
      setAiLoading(false)
    }
  }

  return (
    <Card variant="outlined" sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <CardContent sx={{ pb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
        <Typography variant="h6" sx={{ flex: 1 }}>
          פרוטוקול חי
        </Typography>
        {canEdit && (
          <Tooltip title="הצעת AI לשורה הבאה">
            <span>
              <IconButton color="secondary" disabled={aiLoading} onClick={handleAiSuggest}>
                <AutoAwesomeIcon />
              </IconButton>
            </span>
          </Tooltip>
        )}
        <Tooltip title="הורד פרוטוקול (TXT)">
          <IconButton
            component="a"
            href={exportUrl(sessionId)}
            target="_blank"
            rel="noopener noreferrer"
          >
            <DownloadIcon />
          </IconButton>
        </Tooltip>
      </CardContent>

      <Box
        ref={scrollRef}
        sx={{
          flex: 1,
          overflowY: 'auto',
          px: 2,
          pb: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
          minHeight: 240,
        }}
      >
        {lines.length === 0 && (
          <Typography variant="body2" color="text.secondary" sx={{ p: 2 }}>
            אין רישומים עדיין. כתבו בתיבה למטה כדי להתחיל את הפרוטוקול.
          </Typography>
        )}
        {lines.map((line) => {
          const theme = themeForRole(line.speakerRole)
          const isMine = line.speakerUserId === myUserId
          const editing = editingLineId === line.lineId
          return (
            <Box
              key={line.lineId}
              sx={{
                borderInlineStart: `4px solid ${line.color || theme.color}`,
                bgcolor: theme.secondary,
                borderRadius: 1,
                p: 1,
                pr: 1.5,
              }}
            >
              <Stack direction="row" alignItems="center" spacing={1}>
                <Chip
                  size="small"
                  label={theme.shortLabel}
                  sx={{
                    bgcolor: line.color || theme.color,
                    color: '#fff',
                    fontWeight: 700,
                  }}
                />
                <Typography variant="caption" color={line.color || theme.color} fontWeight={700}>
                  {line.speakerName}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {new Date(line.ts).toLocaleTimeString('he-IL')}
                </Typography>
                <Box flex={1} />
                {line.isAiGenerated && !line.verifiedBySecretary && (
                  <Chip size="small" label="AI" color="warning" sx={{ height: 18, fontSize: 10 }} />
                )}
                {line.verifiedBySecretary && (
                  <Chip
                    size="small"
                    label="אושר"
                    color="success"
                    sx={{ height: 18, fontSize: 10 }}
                  />
                )}
                {canEdit && !editing && (
                  <IconButton
                    size="small"
                    onClick={() => {
                      setEditingLineId(line.lineId)
                      setEditText(line.text)
                    }}
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                )}
              </Stack>

              {editing ? (
                <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                  <TextField
                    size="small"
                    fullWidth
                    multiline
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                  />
                  <IconButton color="success" onClick={() => handleEditSave(line.lineId)}>
                    <CheckIcon />
                  </IconButton>
                  <IconButton color="error" onClick={() => setEditingLineId(null)}>
                    <CloseIcon />
                  </IconButton>
                </Stack>
              ) : (
                <Typography
                  variant="body2"
                  sx={{
                    mt: 0.5,
                    color: 'text.primary',
                    fontWeight: isMine ? 600 : 400,
                    whiteSpace: 'pre-wrap',
                  }}
                >
                  {line.text}
                </Typography>
              )}
            </Box>
          )
        })}
      </Box>

      {myParticipant ? (
        <Box sx={{ borderTop: '1px solid', borderColor: 'divider', p: 1.5 }}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
            <TextField
              select
              size="small"
              value={entryType}
              onChange={(e) => setEntryType(e.target.value as ProtocolEntryType)}
              sx={{ minWidth: 130 }}
            >
              {ENTRY_TYPES.map((t) => (
                <MenuItem key={t.value} value={t.value}>
                  {t.label}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              size="small"
              fullWidth
              multiline
              maxRows={4}
              placeholder={`רשום בתור ${themeForRole(myParticipant.role).label} ${myParticipant.displayName}...`}
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                  e.preventDefault()
                  void handleSend()
                }
              }}
            />
            <Tooltip
              title={
                recorder.status === 'recording'
                  ? `עצור הקלטה (${Math.floor(recorder.durationMs / 1000)} שנ׳)`
                  : 'הקלט ותמלל ל-Whisper'
              }
            >
              <span>
                <IconButton
                  color={recorder.status === 'recording' ? 'error' : 'primary'}
                  disabled={transcribing || recorder.status === 'stopping'}
                  onClick={handleRecordToggle}
                  sx={{
                    bgcolor: recorder.status === 'recording' ? 'error.light' : 'action.hover',
                  }}
                >
                  {recorder.status === 'recording' ? <StopIcon /> : <MicIcon />}
                </IconButton>
              </span>
            </Tooltip>
            <Button
              variant="contained"
              startIcon={<SendIcon />}
              disabled={sending || !text.trim()}
              onClick={handleSend}
            >
              שלח
            </Button>
          </Stack>
          <Stack direction="row" spacing={2} sx={{ mt: 0.5 }}>
            <Typography variant="caption" color="text.secondary">
              Ctrl+Enter לשליחה מהירה
            </Typography>
            {transcribing && (
              <Typography variant="caption" color="secondary.main">
                ... מתמלל (Whisper)
              </Typography>
            )}
            {recorder.error && (
              <Typography variant="caption" color="error">
                {recorder.error}
              </Typography>
            )}
          </Stack>
        </Box>
      ) : (
        <Box sx={{ borderTop: '1px solid', borderColor: 'divider', p: 2 }}>
          <Typography variant="body2" color="text.secondary">
            יש לבחור תפקיד כדי לכתוב לפרוטוקול.
          </Typography>
        </Box>
      )}
    </Card>
  )
}

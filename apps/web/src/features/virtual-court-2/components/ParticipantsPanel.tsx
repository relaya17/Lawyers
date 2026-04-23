import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch } from 'react-redux'
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemSecondaryAction,
  ListItemText,
  MenuItem,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import VideocamIcon from '@mui/icons-material/Videocam'
import VideocamOffIcon from '@mui/icons-material/VideocamOff'
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1'
import type { LegalCase, Participant, ParticipantRole } from '../types'
import { roleLabel } from '../utils/labels'
import { useVirtualCourt2Store } from '../store/useVirtualCourt2Store'
import { addNotification } from '@shared/store/advancedSlice'

const ROLES: ParticipantRole[] = [
  'judge',
  'student_judge',
  'ai_judge',
  'prosecutor',
  'plaintiff_lawyer',
  'defense_lawyer',
  'plaintiff',
  'defendant',
  'witness',
  'expert',
  'clerk',
  'mediator',
  'observer',
]

/** תפקידי הוראה / מערכת — לא נחשבים «סטודנטים» לצורך הודעות */
const STAFF_ROLES: ParticipantRole[] = ['judge', 'ai_judge', 'clerk', 'mediator', 'expert']

function isStudentFacing(p: Pick<Participant, 'role' | 'isAI'>): boolean {
  if (p.isAI) return false
  return !STAFF_ROLES.includes(p.role)
}

const PENDING_NEW_ID = '__new__'

interface Props {
  legalCase: LegalCase
}

export const ParticipantsPanel: React.FC<Props> = ({ legalCase }) => {
  const dispatch = useDispatch()
  const addParticipant = useVirtualCourt2Store((s) => s.addParticipant)
  const addCourtAppMessage = useVirtualCourt2Store((s) => s.addCourtAppMessage)
  const removeParticipant = useVirtualCourt2Store((s) => s.removeParticipant)
  const toggleVideo = useVirtualCourt2Store((s) => s.toggleVideo)

  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [role, setRole] = useState<ParticipantRole>('plaintiff_lawyer')
  const [isAI, setIsAI] = useState(false)
  const [sendAppMessage, setSendAppMessage] = useState(false)
  const [messageBody, setMessageBody] = useState('')
  const [messageTarget, setMessageTarget] = useState<'all' | 'selected'>('all')
  const [selectedRecipientIds, setSelectedRecipientIds] = useState<string[]>([])

  const selectableRecipients = useMemo(() => {
    const existing = legalCase.participants.filter(isStudentFacing)
    const effectiveAI = isAI || role === 'ai_judge'
    const pendingEligible =
      name.trim() && !effectiveAI && isStudentFacing({ role, isAI: false })
        ? ([{ id: PENDING_NEW_ID, name: name.trim(), role, isAI: false }] as Participant[])
        : []
    return [...existing, ...pendingEligible]
  }, [legalCase.participants, name, role, isAI])

  useEffect(() => {
    if (!open) return
    setSelectedRecipientIds((prev) =>
      prev.filter((id) => selectableRecipients.some((p) => p.id === id)),
    )
  }, [open, selectableRecipients])

  useEffect(() => {
    if (isAI || role === 'ai_judge') setSendAppMessage(false)
  }, [isAI, role])

  const toggleRecipient = (id: string) => {
    setSelectedRecipientIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    )
  }

  const handleAdd = () => {
    if (!name.trim()) return
    addParticipant(legalCase.id, {
      name: name.trim(),
      role,
      isAI: isAI || role === 'ai_judge',
      videoEnabled: false,
    })

    if (sendAppMessage && messageBody.trim()) {
      const store = useVirtualCourt2Store.getState()
      const caseNow = store.getCase(legalCase.id)
      if (caseNow) {
        const allFacing = caseNow.participants.filter(isStudentFacing)
        let recipients: Participant[] =
          messageTarget === 'all'
            ? allFacing
            : selectedRecipientIds
                .map((id) => {
                  if (id === PENDING_NEW_ID) {
                    const matches = caseNow.participants.filter(
                      (p) =>
                        p.name === name.trim() &&
                        p.role === role &&
                        !p.isAI &&
                        isStudentFacing(p),
                    )
                    return matches.sort((a, b) => b.joinedAt.localeCompare(a.joinedAt))[0]
                  }
                  return caseNow.participants.find((p) => p.id === id)
                })
                .filter((p): p is Participant => Boolean(p))

        const recipientLabel =
          recipients.length > 0 ? recipients.map((p) => p.name).join(', ') : 'לא זוהו נמענים'

        if (recipients.length > 0) {
          addCourtAppMessage(legalCase.id, {
            body: messageBody.trim(),
            recipientLabel,
          })
          dispatch(
            addNotification({
              type: 'info',
              title: `בית משפט וירטואלי — ${caseNow.shortTitle || caseNow.title}`,
              message: `${messageBody.trim()}\n\nנמענים: ${recipientLabel}`,
            }),
          )
        }
      }
    }

    setName('')
    setRole('plaintiff_lawyer')
    setIsAI(false)
    setSendAppMessage(false)
    setMessageBody('')
    setMessageTarget('all')
    setSelectedRecipientIds([])
    setOpen(false)
  }

  return (
    <Card variant="outlined">
      <CardContent>
        <Stack direction="row" alignItems="center" sx={{ mb: 1 }}>
          <Typography variant="h6">משתתפים בתיק</Typography>
          <Box flex={1} />
          <Button size="small" variant="contained" startIcon={<PersonAddAlt1Icon />} onClick={() => setOpen(true)}>
            הוסף משתתף
          </Button>
        </Stack>

        {legalCase.participants.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            אין עדיין משתתפים. הוסיפו שופט (AI/סטודנט), באי כוח, עדים, מזכיר/ה וכו'.
          </Typography>
        ) : (
          <List dense>
            {legalCase.participants.map((p) => (
              <ListItem key={p.id} divider>
                <ListItemAvatar>
                  <Avatar>{p.name.slice(0, 1)}</Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Typography variant="body1">{p.name}</Typography>
                      <Chip size="small" label={roleLabel[p.role]} />
                      {p.isAI && <Chip size="small" color="secondary" label="AI" />}
                    </Stack>
                  }
                  secondary={`הצטרף/ה: ${new Date(p.joinedAt).toLocaleString('he-IL')}`}
                />
                <ListItemSecondaryAction>
                  <Tooltip title={p.videoEnabled ? 'כבה וידאו' : 'פתח וידאו'}>
                    <IconButton size="small" onClick={() => toggleVideo(legalCase.id, p.id)}>
                      {p.videoEnabled ? <VideocamIcon color="success" /> : <VideocamOffIcon />}
                    </IconButton>
                  </Tooltip>
                  <IconButton size="small" onClick={() => removeParticipant(legalCase.id, p.id)}>
                    <DeleteOutlineIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        )}
      </CardContent>

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>הוספת משתתף</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField label="שם" value={name} onChange={(e) => setName(e.target.value)} fullWidth autoFocus />
            <TextField
              select
              label="תפקיד"
              value={role}
              onChange={(e) => setRole(e.target.value as ParticipantRole)}
              fullWidth
            >
              {ROLES.map((r) => (
                <MenuItem key={r} value={r}>
                  {roleLabel[r]}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              select
              label="סוג"
              value={isAI ? 'ai' : 'human'}
              onChange={(e) => setIsAI(e.target.value === 'ai')}
              fullWidth
            >
              <MenuItem value="human">אנושי</MenuItem>
              <MenuItem value="ai">AI</MenuItem>
            </TextField>

            <FormControlLabel
              control={
                <Checkbox
                  checked={sendAppMessage}
                  onChange={(_, c) => setSendAppMessage(c)}
                  disabled={isAI || role === 'ai_judge'}
                />
              }
              label="שלח הודעה באפליקציה לסטודנטים (מופיעה גם בסמל ההתראות)"
            />
            {sendAppMessage && (
              <>
                <TextField
                  label="תוכן ההודעה"
                  value={messageBody}
                  onChange={(e) => setMessageBody(e.target.value)}
                  fullWidth
                  multiline
                  minRows={3}
                  placeholder="למשל: התכנסות לדיון מחר ב־10:00, או הנחיות להגשת סיכומים"
                />
                <FormControl component="fieldset" variant="standard">
                  <FormLabel component="legend">נמענים</FormLabel>
                  <RadioGroup
                    value={messageTarget}
                    onChange={(e) => setMessageTarget(e.target.value as 'all' | 'selected')}
                  >
                    <FormControlLabel
                      value="all"
                      control={<Radio />}
                      label="כל הסטודנטים הפעילים בתיק (ללא שופט/מזכירות/AI)"
                    />
                    <FormControlLabel
                      value="selected"
                      control={<Radio />}
                      label="רק מי שאבחר מהרשימה"
                    />
                  </RadioGroup>
                </FormControl>
                {messageTarget === 'selected' && (
                  <FormGroup sx={{ pl: 1 }}>
                    {selectableRecipients.length === 0 ? (
                      <Typography variant="body2" color="text.secondary">
                        אין עדיין סטודנטים לבחירה. הוסיפו שם ותפקיד מתאים, או הוסיפו משתתפים קודם.
                      </Typography>
                    ) : (
                      selectableRecipients.map((p) => (
                        <FormControlLabel
                          key={p.id}
                          control={
                            <Checkbox
                              checked={selectedRecipientIds.includes(p.id)}
                              onChange={() => toggleRecipient(p.id)}
                            />
                          }
                          label={`${p.name} — ${roleLabel[p.role]}`}
                        />
                      ))
                    )}
                  </FormGroup>
                )}
                <Typography variant="caption" color="text.secondary" display="block">
                  בסביבת לימודים מקומית ההתראה נרשמת למכשיר/דפדפן זה. לשליחה אמיתית לכל סטודנט נדרש שרת
                  והתחברות משתמשים.
                </Typography>
              </>
            )}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>ביטול</Button>
          <Button
            onClick={handleAdd}
            variant="contained"
            disabled={sendAppMessage && !messageBody.trim()}
          >
            הוסף
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  )
}

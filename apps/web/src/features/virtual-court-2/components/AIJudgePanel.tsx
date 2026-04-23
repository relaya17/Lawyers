import React, { useState } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemText,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import SmartToyIcon from '@mui/icons-material/SmartToy'
import GavelIcon from '@mui/icons-material/Gavel'
import type { LegalCase } from '../types'
import { runAIJudgeAnalysis } from '../services/aiJudge'
import { useVirtualCourt2Store } from '../store/useVirtualCourt2Store'
import { useSessionAuth } from '@/features/auth/providers/SessionAuthProvider'
import { useEntitlements } from '@/features/billing/providers/EntitlementsProvider'

interface Props {
  legalCase: LegalCase
}

export const AIJudgePanel: React.FC<Props> = ({ legalCase }) => {
  const addAnalysis = useVirtualCourt2Store((s) => s.addAnalysis)
  const addRuling = useVirtualCourt2Store((s) => s.addRuling)
  const { accessToken } = useSessionAuth()
  const { can, loading: entLoading } = useEntitlements()
  const canLlmJudge = can('virtualCourtFull')

  const [issue, setIssue] = useState('')
  const [running, setRunning] = useState(false)
  const [verdict, setVerdict] = useState('')
  const [reasoning, setReasoning] = useState('')

  const last = legalCase.analyses[0]

  const handleAnalyze = async () => {
    setRunning(true)
    try {
      const a = await runAIJudgeAnalysis(legalCase, issue, canLlmJudge ? accessToken : null)
      addAnalysis(legalCase.id, a)
    } finally {
      setRunning(false)
    }
  }

  const handleRule = () => {
    if (!verdict.trim()) return
    addRuling(legalCase.id, {
      issuedByParticipantId: 'ai-judge',
      issuedByName: 'שופט AI',
      mode: legalCase.judgeMode === 'student' ? 'student' : legalCase.judgeMode,
      verdict: verdict.trim(),
      reasoning: reasoning.trim() || last?.reasoning || '',
      statutes: last?.statutes || legalCase.referenceStatutes,
      precedents: last?.precedents || legalCase.referencePrecedents,
      appealable: legalCase.level !== 'supreme',
    })
    setVerdict('')
    setReasoning('')
  }

  return (
    <Card variant="outlined">
      <CardContent>
        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
          <SmartToyIcon color="secondary" />
          <Typography variant="h6">שופט AI — ניתוח ופסיקה</Typography>
          <Box flex={1} />
          <Chip size="small" label={`מצב: ${legalCase.judgeMode}`} />
        </Stack>

        <Alert severity="info" sx={{ mb: 2 }}>
          כלי לימודי. הניתוח מבוסס על חומר התיק והמקורות המוזנים בלבד — אינו תחליף לייעוץ משפטי.
        </Alert>

        {!entLoading && !canLlmJudge && (
          <Alert severity="warning" sx={{ mb: 2 }}>
            במסלול החינם מתבצע <strong>ניתוח מקומי</strong> בלבד (ללא LLM בשרת). לניתוח שופט AI מלא{' '}
            <RouterLink to="/pricing">שדרגי ל-Student Pro</RouterLink>.
          </Alert>
        )}

        <Stack direction={{ xs: 'column', md: 'row' }} spacing={1} sx={{ mb: 2 }}>
          <TextField
            label="סוגיה לניתוח (למשל: האם ניתן לבטל את החוזה?)"
            value={issue}
            onChange={(e) => setIssue(e.target.value)}
            fullWidth
            size="small"
          />
          <Button variant="contained" onClick={handleAnalyze} disabled={running}>
            {running ? 'מנתח…' : 'הפעל ניתוח AI'}
          </Button>
        </Stack>

        {last && (
          <Card variant="outlined" sx={{ mb: 2, bgcolor: 'action.hover' }}>
            <CardContent>
              <Typography variant="subtitle2">סוגיה:</Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                {last.issue}
              </Typography>
              <Typography variant="subtitle2">נימוק:</Typography>
              <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', mb: 1 }}>
                {last.reasoning}
              </Typography>

              {last.statutes.length > 0 && (
                <>
                  <Divider sx={{ my: 1 }} />
                  <Typography variant="subtitle2">חוק:</Typography>
                  <List dense>
                    {last.statutes.map((s) => (
                      <ListItem key={s.id} disableGutters>
                        <ListItemText
                          primary={`${s.title}${s.section ? ` — ${s.section}` : ''}`}
                          secondary={s.excerpt}
                        />
                      </ListItem>
                    ))}
                  </List>
                </>
              )}

              {last.precedents.length > 0 && (
                <>
                  <Divider sx={{ my: 1 }} />
                  <Typography variant="subtitle2">פסיקה:</Typography>
                  <List dense>
                    {last.precedents.map((p) => (
                      <ListItem key={p.id} disableGutters>
                        <ListItemText
                          primary={`${p.title} (${p.citation})`}
                          secondary={`${p.summary} — רלוונטיות: ${p.relevance}`}
                        />
                      </ListItem>
                    ))}
                  </List>
                </>
              )}

              <Divider sx={{ my: 1 }} />
              <Typography variant="subtitle2">מסקנה (Holding):</Typography>
              <Typography variant="body2">{last.holding}</Typography>
              <Typography variant="caption" color="text.secondary">
                רמת ודאות: {last.confidence}
              </Typography>
            </CardContent>
          </Card>
        )}

        <Divider sx={{ my: 2 }} />

        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
          <GavelIcon color="primary" />
          <Typography variant="subtitle1">מתן פסק דין</Typography>
        </Stack>
        <Stack spacing={1}>
          <TextField
            label="פסק דין (תמצית)"
            value={verdict}
            onChange={(e) => setVerdict(e.target.value)}
            size="small"
            fullWidth
          />
          <TextField
            label="נימוק (אופציונלי — ימולא מניתוח אחרון אם ריק)"
            value={reasoning}
            onChange={(e) => setReasoning(e.target.value)}
            size="small"
            fullWidth
            multiline
            minRows={3}
          />
          <Box>
            <Button variant="contained" color="primary" onClick={handleRule} disabled={!verdict.trim()}>
              תן פסק דין
            </Button>
          </Box>
        </Stack>

        {legalCase.rulings.length > 0 && (
          <>
            <Divider sx={{ my: 2 }} />
            <Typography variant="subtitle1" sx={{ mb: 1 }}>
              פסקי דין קודמים בתיק
            </Typography>
            <List dense>
              {legalCase.rulings.map((r) => (
                <ListItem key={r.id} divider alignItems="flex-start">
                  <ListItemText
                    primary={
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Typography variant="body1" fontWeight={600}>
                          {r.verdict}
                        </Typography>
                        <Chip size="small" label={r.mode} />
                        {r.appealable && <Chip size="small" variant="outlined" label="ניתן לערער" />}
                      </Stack>
                    }
                    secondary={
                      <>
                        <Typography variant="caption" color="text.secondary">
                          {new Date(r.issuedAt).toLocaleString('he-IL')} · {r.issuedByName}
                        </Typography>
                        <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', mt: 0.5 }}>
                          {r.reasoning}
                        </Typography>
                      </>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </>
        )}
      </CardContent>
    </Card>
  )
}

import React, { useCallback, useEffect, useState } from 'react'
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Divider,
  FormControlLabel,
  LinearProgress,
  Paper,
  Stack,
  Switch,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tabs,
  TextField,
  Typography,
} from '@mui/material'
import { Helmet } from 'react-helmet-async'
import { useSessionAuth } from '@/features/auth/providers/SessionAuthProvider'
import {
  adminVectorSearch,
  createKbDocument,
  fetchLegalKbStats,
  legalRagQuery,
  listKbDocuments,
  patchDocumentVerification,
  type KbDocumentRow,
  type RagCitation,
} from '@/features/admin/legalKnowledgeApi'

export const VectorManagementPage: React.FC = () => {
  const { accessToken, isAuthenticated } = useSessionAuth()
  const token = accessToken ?? ''

  const [tab, setTab] = useState(0)
  const [stats, setStats] = useState<Awaited<ReturnType<typeof fetchLegalKbStats>> | null>(null)
  const [statsLoading, setStatsLoading] = useState(true)

  const [playQuery, setPlayQuery] = useState('')
  const [playVerifiedOnly, setPlayVerifiedOnly] = useState(false)
  const [playResults, setPlayResults] = useState<RagCitation[]>([])
  const [playBusy, setPlayBusy] = useState(false)
  const [playError, setPlayError] = useState<string | null>(null)

  const [fullQuery, setFullQuery] = useState('')
  const [fullAnswer, setFullAnswer] = useState('')
  const [fullCitations, setFullCitations] = useState<RagCitation[]>([])
  const [fullBusy, setFullBusy] = useState(false)

  const [tableSearch, setTableSearch] = useState('')
  const [tableRows, setTableRows] = useState<KbDocumentRow[]>([])
  const [tableTotal, setTableTotal] = useState(0)
  const [tableLoading, setTableLoading] = useState(false)

  const [newTitle, setNewTitle] = useState('')
  const [newContent, setNewContent] = useState('')
  const [newCategory, setNewCategory] = useState('')
  const [newUrl, setNewUrl] = useState('')
  const [newBusy, setNewBusy] = useState(false)

  const loadStats = useCallback(async () => {
    if (!token) return
    setStatsLoading(true)
    try {
      setStats(await fetchLegalKbStats(token))
    } finally {
      setStatsLoading(false)
    }
  }, [token])

  const loadTable = useCallback(async () => {
    if (!token) return
    setTableLoading(true)
    try {
      const r = await listKbDocuments(token, { search: tableSearch || undefined, status: 'all', limit: 30 })
      setTableRows(r.rows)
      setTableTotal(r.total)
    } catch (e) {
      setTableRows([])
      setTableTotal(0)
    } finally {
      setTableLoading(false)
    }
  }, [token, tableSearch])

  useEffect(() => {
    void loadStats()
  }, [loadStats])

  useEffect(() => {
    if (tab === 1) void loadTable()
  }, [tab, loadTable])

  const runPlaygroundSearch = async () => {
    if (!token || !playQuery.trim()) return
    setPlayBusy(true)
    setPlayError(null)
    try {
      const data = await adminVectorSearch(token, {
        query: playQuery.trim(),
        matchThreshold: 0.35,
        matchCount: 8,
        verifiedOnly: playVerifiedOnly,
      })
      setPlayResults(data)
    } catch (e) {
      setPlayError(e instanceof Error ? e.message : 'שגיאה')
      setPlayResults([])
    } finally {
      setPlayBusy(false)
    }
  }

  const runFullRag = async () => {
    if (!token || !fullQuery.trim()) return
    setFullBusy(true)
    setFullAnswer('')
    setFullCitations([])
    try {
      const r = await legalRagQuery(token, fullQuery.trim(), { verifiedOnly: playVerifiedOnly })
      setFullAnswer(r.answer)
      setFullCitations(r.citations)
    } catch (e) {
      setFullAnswer(e instanceof Error ? e.message : 'שגיאה')
    } finally {
      setFullBusy(false)
    }
  }

  const addDocument = async () => {
    if (!token || !newContent.trim()) return
    setNewBusy(true)
    try {
      await createKbDocument(token, {
        title: newTitle.trim() || undefined,
        content: newContent.trim(),
        category: newCategory.trim() || null,
        sourceUrl: newUrl.trim() || null,
        verificationStatus: 'draft',
        computeEmbedding: true,
      })
      setNewTitle('')
      setNewContent('')
      setNewCategory('')
      setNewUrl('')
      await loadStats()
      await loadTable()
    } finally {
      setNewBusy(false)
    }
  }

  if (!isAuthenticated || !token) {
    return (
      <Container sx={{ py: 4 }}>
        <Alert severity="warning">נדרשת התחברות כמנהל.</Alert>
      </Container>
    )
  }

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <Helmet>
        <title>ניהול מאגר ווקטורי — LexStudy</title>
      </Helmet>

      <Typography variant="h4" component="h1" gutterBottom>
        ניהול מאגר ידע (RAG)
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        שליפה סמנטית, אימות מקורות, וסימולטור לפני שמשתמשים רואים תשובות.
      </Typography>

      <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 2 }}>
        <Tab label="סטטיסטיקה" />
        <Tab label="טבלת מסמכים" />
        <Tab label="Playground שליפה" />
        <Tab label="שאילתה מלאה (RAG)" />
        <Tab label="הוספת מסמך" />
      </Tabs>

      {tab === 0 && (
        <Card variant="outlined">
          <CardContent>
            {statsLoading ? <LinearProgress /> : null}
            {stats && !stats.ready ? (
              <Alert severity="warning" sx={{ mt: 1 }}>
                המאגר לא זמין. הריצי את{' '}
                <code>apps/server/sql/legal/001_legal_knowledge_base.sql</code> על PostgreSQL והפעילי הרחבת{' '}
                <code>vector</code>.
              </Alert>
            ) : null}
            {stats && stats.ready ? (
              <Stack direction="row" gap={2} flexWrap="wrap" sx={{ mt: 1 }}>
                <Chip label={`סה״כ: ${stats.total}`} color="primary" />
                <Chip label={`מאומתים: ${stats.verified}`} color="success" />
                <Chip label={`טיוטה: ${stats.draft}`} />
                <Chip label={`עם embedding: ${stats.withEmbedding}`} variant="outlined" />
              </Stack>
            ) : null}
            <Button sx={{ mt: 2 }} variant="outlined" size="small" onClick={() => void loadStats()}>
              רענן
            </Button>
          </CardContent>
        </Card>
      )}

      {tab === 1 && (
        <Box>
          <Stack direction={{ xs: 'column', sm: 'row' }} gap={1} sx={{ mb: 2 }}>
            <TextField
              size="small"
              label="חיפוש טקסט"
              value={tableSearch}
              onChange={(e) => setTableSearch(e.target.value)}
              fullWidth
            />
            <Button variant="contained" onClick={() => void loadTable()} disabled={tableLoading}>
              חפש
            </Button>
          </Stack>
          <Typography variant="caption" color="text.secondary">
            סה״כ תוצאות: {tableTotal}
          </Typography>
          <Table size="small" sx={{ mt: 1 }}>
            <TableHead>
              <TableRow>
                <TableCell>סטטוס</TableCell>
                <TableCell>כותרת / תחילת תוכן</TableCell>
                <TableCell>קטגוריה</TableCell>
                <TableCell align="right">פעולות</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tableRows.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>
                    <Chip
                      size="small"
                      label={row.verification_status}
                      color={row.verification_status === 'verified' ? 'success' : 'default'}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight={600}>
                      {row.title || '—'}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" noWrap display="block" sx={{ maxWidth: 360 }}>
                      {row.content.slice(0, 120)}…
                    </Typography>
                  </TableCell>
                  <TableCell>{row.category || '—'}</TableCell>
                  <TableCell align="right">
                    {row.verification_status === 'draft' ? (
                      <Button
                        size="small"
                        onClick={() =>
                          void patchDocumentVerification(token, row.id, 'verified').then(loadTable)
                        }
                      >
                        אשר (Verified)
                      </Button>
                    ) : (
                      <Button
                        size="small"
                        color="warning"
                        onClick={() =>
                          void patchDocumentVerification(token, row.id, 'draft').then(loadTable)
                        }
                      >
                        החזר לטיוטה
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      )}

      {tab === 2 && (
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            סימולטור שליפה (Citations)
          </Typography>
          <TextField
            fullWidth
            label="שאלה משפטית לבדיקה"
            value={playQuery}
            onChange={(e) => setPlayQuery(e.target.value)}
            multiline
            minRows={2}
          />
          <FormControlLabel
            control={
              <Switch
                checked={playVerifiedOnly}
                onChange={(_, c) => setPlayVerifiedOnly(c)}
              />
            }
            label="רק מקורות מאומתים (Verified)"
            sx={{ mt: 1 }}
          />
          <Button variant="contained" sx={{ mt: 2 }} onClick={() => void runPlaygroundSearch()} disabled={playBusy}>
            בדוק שליפה
          </Button>
          {playError && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {playError}
            </Alert>
          )}
          <Stack spacing={2} sx={{ mt: 3 }}>
            {playResults.map((res) => (
              <Paper
                key={res.id}
                variant="outlined"
                sx={{
                  p: 2,
                  borderRight: '5px solid',
                  borderColor: res.similarity > 0.75 ? 'success.main' : 'warning.main',
                }}
              >
                <Typography variant="caption" display="block">
                  דמיון: {(res.similarity * 100).toFixed(1)}% · {res.verificationStatus} ·{' '}
                  {res.category || 'ללא קטגוריה'}
                </Typography>
                <Typography variant="subtitle2" sx={{ mt: 0.5 }}>
                  {res.title || 'ללא כותרת'}
                </Typography>
                <Typography variant="body2" sx={{ mt: 1, whiteSpace: 'pre-wrap' }}>
                  {res.excerpt}
                </Typography>
                {res.sourceUrl && (
                  <Typography variant="caption" component="a" href={res.sourceUrl} target="_blank" rel="noreferrer">
                    מקור
                  </Typography>
                )}
              </Paper>
            ))}
          </Stack>
        </Paper>
      )}

      {tab === 3 && (
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            שאילתה מלאה — תשובה + מקורות
          </Typography>
          <TextField
            fullWidth
            label="שאלה"
            value={fullQuery}
            onChange={(e) => setFullQuery(e.target.value)}
            multiline
            minRows={3}
          />
          <Button
            variant="contained"
            sx={{ mt: 2 }}
            onClick={() => void runFullRag()}
            disabled={fullBusy}
          >
            הרץ RAG
          </Button>
          <Divider sx={{ my: 2 }} />
          {fullBusy && <LinearProgress />}
          {fullAnswer && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                תשובה
              </Typography>
              <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                {fullAnswer}
              </Typography>
            </Box>
          )}
          {fullCitations.length > 0 && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                ציטוטים
              </Typography>
              <Stack spacing={1}>
                {fullCitations.map((c) => (
                  <Chip key={c.id} label={`${c.title || c.id.slice(0, 8)} · ${(c.similarity * 100).toFixed(0)}%`} />
                ))}
              </Stack>
            </Box>
          )}
        </Paper>
      )}

      {tab === 4 && (
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            הוספת קטע למאגר (טיוטה + embedding)
          </Typography>
          <Stack spacing={2}>
            <TextField label="כותרת" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} fullWidth />
            <TextField label="קטגוריה" value={newCategory} onChange={(e) => setNewCategory(e.target.value)} fullWidth />
            <TextField label="קישור מקור (אופציונלי)" value={newUrl} onChange={(e) => setNewUrl(e.target.value)} fullWidth />
            <TextField
              label="תוכן"
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              fullWidth
              multiline
              minRows={6}
              required
            />
            <Button variant="contained" onClick={() => void addDocument()} disabled={newBusy || !newContent.trim()}>
              שמור וחשב embedding
            </Button>
          </Stack>
        </Paper>
      )}
    </Container>
  )
}

export default VectorManagementPage

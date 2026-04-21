import React, { useMemo, useState } from 'react'
import { useParams, Link as RouterLink } from 'react-router-dom'
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Divider,
  Grid,
  Paper,
  TextField,
  Typography,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Switch,
  FormControlLabel,
} from '@mui/material'
import { ContentCopy, Download, Share } from '@mui/icons-material'
import { useTranslation } from 'react-i18next'
import { getMockTemplates } from './mock'
import type { Template, TemplateVariable } from './types'

function downloadTextFile(filename: string, content: string) {
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}

function applyVariables(content: string, values: Record<string, string>): string {
  return content.replace(/\{\{\s*([a-zA-Z0-9_]+)\s*\}\}/g, (_, key: string) => values[key] ?? '')
}

function defaultValueForVariable(v: TemplateVariable): string {
  if (typeof v.defaultValue === 'string') return v.defaultValue
  if (typeof v.defaultValue === 'number') return String(v.defaultValue)
  if (typeof v.defaultValue === 'boolean') return v.defaultValue ? 'true' : 'false'
  return ''
}

export const ContractTemplateDetailsPage: React.FC = () => {
  const { t } = useTranslation()
  const { templateId } = useParams<{ templateId: string }>()

  const template: Template | undefined = useMemo(() => {
    if (!templateId) return undefined
    return getMockTemplates().find((x) => x.id === templateId)
  }, [templateId])

  const [values, setValues] = useState<Record<string, string>>({})

  const generated = useMemo(() => {
    if (!template) return ''
    return applyVariables(template.content, values)
  }, [template, values])

  if (!template) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="warning" sx={{ mb: 2 }}>
          {t('contractTemplates.notFound', { defaultValue: 'התבנית לא נמצאה' })}
        </Alert>
        <Button component={RouterLink} to="/contract-templates" variant="contained">
          {t('contractTemplates.backToList', { defaultValue: 'חזרה לרשימת התבניות' })}
        </Button>
      </Container>
    )
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 2, flexWrap: 'wrap', mb: 3 }}>
        <Box sx={{ minWidth: 0 }}>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 900 }}>
            {template.hebrewName}
          </Typography>
          <Typography color="text.secondary" sx={{ mt: 0.5 }}>
            {template.description}
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 1.5 }}>
            <Chip label={template.category} size="small" />
            <Chip label={template.contractType} size="small" />
            <Chip label={template.difficulty} size="small" />
            {template.isAIEnhanced && <Chip label="AI" size="small" color="primary" />}
            {template.hasVariables && <Chip label={t('contractTemplates.hasVariables', { defaultValue: 'כולל משתנים' })} size="small" color="secondary" />}
          </Box>
        </Box>

        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Button
            variant="outlined"
            startIcon={<Share />}
            onClick={async () => {
              const shareUrl = `${window.location.origin}/contract-templates/${template.id}`
              try {
                if (navigator.share) {
                  await navigator.share({ title: template.hebrewName, text: template.description, url: shareUrl })
                } else {
                  await navigator.clipboard.writeText(shareUrl)
                }
              } catch {
                // ignore
              }
            }}
          >
            {t('contractTemplates.share', { defaultValue: 'שיתוף' })}
          </Button>
          <Button
            variant="outlined"
            startIcon={<Download />}
            onClick={() => downloadTextFile(`${template.hebrewName}.txt`, generated || template.content)}
          >
            {t('contractTemplates.download', { defaultValue: 'הורד' })}
          </Button>
          <Button
            variant="contained"
            startIcon={<ContentCopy />}
            onClick={async () => {
              try {
                await navigator.clipboard.writeText(generated || template.content)
              } catch {
                // ignore
              }
            }}
          >
            {t('contractTemplates.copy', { defaultValue: 'העתק' })}
          </Button>
        </Box>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={5}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>
                {t('contractTemplates.fillVariables', { defaultValue: 'מילוי משתנים' })}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {t('contractTemplates.fillVariablesHint', { defaultValue: 'מלא/י פרטים כדי לייצר חוזה מותאם אישית.' })}
              </Typography>

              {!template.hasVariables || template.variables.length === 0 ? (
                <Alert severity="info">{t('contractTemplates.noVariables', { defaultValue: 'לתבנית זו אין משתנים למילוי.' })}</Alert>
              ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {template.variables.map((v) => {
                    const current = values[v.name] ?? defaultValueForVariable(v)
                    if (v.type === 'select') {
                      return (
                        <FormControl key={v.name} fullWidth>
                          <InputLabel>{v.label}</InputLabel>
                          <Select
                            label={v.label}
                            value={current}
                            onChange={(e) => setValues((p) => ({ ...p, [v.name]: String(e.target.value) }))}
                          >
                            {(v.options || []).map((opt) => (
                              <MenuItem key={opt} value={opt}>
                                {opt}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      )
                    }
                    if (v.type === 'boolean') {
                      return (
                        <FormControlLabel
                          key={v.name}
                          control={
                            <Switch
                              checked={current === 'true'}
                              onChange={(e) => setValues((p) => ({ ...p, [v.name]: e.target.checked ? 'true' : 'false' }))}
                            />
                          }
                          label={v.label}
                        />
                      )
                    }
                    return (
                      <TextField
                        key={v.name}
                        fullWidth
                        required={v.required}
                        label={v.label}
                        helperText={v.description}
                        value={current}
                        onChange={(e) => setValues((p) => ({ ...p, [v.name]: e.target.value }))}
                        type={v.type === 'number' ? 'number' : v.type === 'date' ? 'date' : 'text'}
                        InputLabelProps={v.type === 'date' ? { shrink: true } : undefined}
                      />
                    )
                  })}
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={7}>
          <Paper sx={{ p: 2.5 }}>
            <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>
              {t('contractTemplates.preview', { defaultValue: 'תצוגה מקדימה' })}
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Typography component="pre" sx={{ whiteSpace: 'pre-wrap', m: 0, fontFamily: 'inherit' }}>
              {generated || template.content}
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  )
}

export default ContractTemplateDetailsPage



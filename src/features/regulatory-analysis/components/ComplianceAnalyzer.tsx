import React, { useState } from 'react'
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  LinearProgress,
  Alert,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Grid,
  Avatar,
  Tooltip,
  IconButton,
  Divider
} from '@mui/material'
import {
  CloudUpload,
  Analytics,
  Warning,
  CheckCircle,
  Error,
  ExpandMore,
  Lightbulb,
  Refresh,
  Download,
  Share
} from '@mui/icons-material'

import { regulatoryAnalysisService } from '../services/regulatoryService'
import { 
  RegulatoryAnalysisRequest, 
  RegulatoryAnalysisResponse, 
  ComplianceViolation,
  ComplianceRecommendation 
} from '../types'

interface ComplianceAnalyzerProps {
  contractId?: string
  onAnalysisComplete?: (result: RegulatoryAnalysisResponse) => void
}

export const ComplianceAnalyzer: React.FC<ComplianceAnalyzerProps> = ({
  contractId,
  onAnalysisComplete
}) => {
  const [contractText, setContractText] = useState('')
  const [contractType, setContractType] = useState('')
  const [jurisdiction, setJurisdiction] = useState('israel')
  const [includeInternational, setIncludeInternational] = useState(false)
  const [analyzing, setAnalyzing] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<RegulatoryAnalysisResponse | null>(null)
  const [activeStep, setActiveStep] = useState(0)

  const contractTypes = [
    { value: 'employment', label: 'חוזה עבודה' },
    { value: 'commercial', label: 'חוזה מסחרי' },
    { value: 'real_estate', label: 'חוזה נדל"ן' },
    { value: 'service', label: 'חוזה שירותים' },
    { value: 'privacy', label: 'הסכם פרטיות' },
    { value: 'other', label: 'אחר' }
  ]

  const jurisdictions = [
    { value: 'israel', label: 'ישראל' },
    { value: 'us', label: 'ארצות הברית' },
    { value: 'eu', label: 'איחוד אירופי' },
    { value: 'international', label: 'בינלאומי' }
  ]

  const steps = [
    'העלאת חוזה',
    'בחירת פרמטרים',
    'ניתוח רגולציה',
    'תוצאות וההמלצות'
  ]

  const handleAnalyze = async () => {
    if (!contractText.trim()) {
      alert('אנא הכנס טקסט חוזה')
      return
    }

    setAnalyzing(true)
    setActiveStep(2)

    try {
      const request: RegulatoryAnalysisRequest = {
        contractId: contractId || `temp_${Date.now()}`,
        contractText,
        contractType,
        jurisdiction,
        includeInternational
      }

      const result = await regulatoryAnalysisService.analyzeContractCompliance(request)
      setAnalysisResult(result)
      setActiveStep(3)
      
      if (onAnalysisComplete) {
        onAnalysisComplete(result)
      }
    } catch (error) {
      console.error('Analysis failed:', error)
      alert('שגיאה בניתוח')
    } finally {
      setAnalyzing(false)
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'error'
      case 'high':
        return 'error'
      case 'medium':
        return 'warning'
      case 'low':
        return 'info'
      default:
        return 'default'
    }
  }

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <Error color="error" />
      case 'high':
        return <Warning color="error" />
      case 'medium':
        return <Warning color="warning" />
      case 'low':
        return <Warning color="info" />
      default:
        return <Warning />
    }
  }

  const getComplianceColor = (score: number) => {
    if (score >= 80) return 'success'
    if (score >= 60) return 'warning'
    return 'error'
  }

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 2 }}>
      <Typography variant="h4" component="h1" sx={{ mb: 3, fontWeight: 'bold' }}>
        מנתח ציות רגולטורי
      </Typography>

      <Stepper activeStep={activeStep} orientation="vertical">
        {/* Step 1: Upload Contract */}
        <Step>
          <StepLabel>העלאת חוזה</StepLabel>
          <StepContent>
            <Card>
              <CardContent>
                <TextField
                  fullWidth
                  multiline
                  rows={8}
                  label="טקסט החוזה"
                  placeholder="הדבק כאן את טקסט החוזה לניתוח..."
                  value={contractText}
                  onChange={(e) => setContractText(e.target.value)}
                  sx={{ mb: 2 }}
                />
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Button
                    variant="outlined"
                    startIcon={<CloudUpload />}
                    component="label"
                  >
                    העלה קובץ
                    <input 
                      type="file" 
                      hidden 
                      accept=".pdf,.doc,.docx,.txt"
                      id="contract-file-upload"
                      name="contract-file-upload"
                    />
                  </Button>
                  <Button
                    variant="contained"
                    onClick={() => setActiveStep(1)}
                    disabled={!contractText.trim()}
                  >
                    המשך
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </StepContent>
        </Step>

        {/* Step 2: Parameters */}
        <Step>
          <StepLabel>בחירת פרמטרים</StepLabel>
          <StepContent>
            <Card>
              <CardContent>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth>
                      <InputLabel>סוג חוזה</InputLabel>
                      <Select
                        value={contractType}
                        onChange={(e) => setContractType(e.target.value)}
                        label="סוג חוזה"
                      >
                        {contractTypes.map((type) => (
                          <MenuItem key={type.value} value={type.value}>
                            {type.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth>
                      <InputLabel>שיפוט</InputLabel>
                      <Select
                        value={jurisdiction}
                        onChange={(e) => setJurisdiction(e.target.value)}
                        label="שיפוט"
                      >
                        {jurisdictions.map((j) => (
                          <MenuItem key={j.value} value={j.value}>
                            {j.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
                <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
                  <Button onClick={() => setActiveStep(0)}>
                    חזור
                  </Button>
                  <Button
                    variant="contained"
                    startIcon={<Analytics />}
                    onClick={handleAnalyze}
                    disabled={!contractType}
                  >
                    התחל ניתוח
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </StepContent>
        </Step>

        {/* Step 3: Analysis */}
        <Step>
          <StepLabel>ניתוח רגולציה</StepLabel>
          <StepContent>
            <Card>
              <CardContent>
                {analyzing ? (
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h6" sx={{ mb: 2 }}>
                      מנתח ציות רגולטורי...
                    </Typography>
                    <LinearProgress sx={{ mb: 2 }} />
                    <Typography variant="body2" color="text.secondary">
                      בודק תאימות לרגולציות רלוונטיות
                    </Typography>
                  </Box>
                ) : (
                  <Typography>ניתוח הושלם!</Typography>
                )}
              </CardContent>
            </Card>
          </StepContent>
        </Step>

        {/* Step 4: Results */}
        <Step>
          <StepLabel>תוצאות וההמלצות</StepLabel>
          <StepContent>
            {analysisResult && (
              <Box>
                {/* Summary Card */}
                <Card sx={{ mb: 3 }}>
                  <CardContent>
                    <Grid container spacing={3}>
                      <Grid item xs={12} md={4}>
                        <Box sx={{ textAlign: 'center' }}>
                          <Avatar 
                            sx={{ 
                              width: 80, 
                              height: 80, 
                              bgcolor: `${getComplianceColor(analysisResult.compliance.complianceScore)}.main`,
                              mx: 'auto',
                              mb: 2
                            }}
                          >
                            <Typography variant="h4" color="white">
                              {analysisResult.compliance.complianceScore}
                            </Typography>
                          </Avatar>
                          <Typography variant="h6">ציון ציות</Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={12} md={8}>
                        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                          <Chip
                            icon={analysisResult.compliance.isCompliant ? <CheckCircle /> : <Error />}
                            label={analysisResult.compliance.isCompliant ? 'תואם' : 'לא תואם'}
                            color={analysisResult.compliance.isCompliant ? 'success' : 'error'}
                          />
                          <Chip
                            label={`${analysisResult.compliance.violations.length} הפרות`}
                            color={analysisResult.compliance.violations.length === 0 ? 'success' : 'error'}
                          />
                          <Chip
                            label={`${analysisResult.compliance.warnings.length} אזהרות`}
                            color="warning"
                          />
                        </Box>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Button
                            variant="outlined"
                            startIcon={<Download />}
                            size="small"
                          >
                            הורד דוח
                          </Button>
                          <Button
                            variant="outlined"
                            startIcon={<Share />}
                            size="small"
                          >
                            שתף
                          </Button>
                          <Button
                            variant="outlined"
                            startIcon={<Refresh />}
                            size="small"
                            onClick={() => setActiveStep(0)}
                          >
                            ניתוח חדש
                          </Button>
                        </Box>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>

                {/* Violations */}
                {analysisResult.compliance.violations.length > 0 && (
                  <Accordion defaultExpanded>
                    <AccordionSummary expandIcon={<ExpandMore />}>
                      <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Error color="error" />
                        הפרות רגולציה ({analysisResult.compliance.violations.length})
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <List>
                        {analysisResult.compliance.violations.map((violation, index) => (
                          <React.Fragment key={violation.id}>
                            <ListItem alignItems="flex-start">
                              <ListItemIcon>
                                {getSeverityIcon(violation.severity)}
                              </ListItemIcon>
                              <ListItemText
                                primary={
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Typography variant="subtitle1">
                                      {violation.description}
                                    </Typography>
                                    <Chip
                                      label={violation.severity}
                                      color={getSeverityColor(violation.severity)}
                                      size="small"
                                    />
                                  </Box>
                                }
                                secondary={
                                  <Box sx={{ mt: 1 }}>
                                    <Typography variant="body2" color="text.secondary" paragraph>
                                      <strong>השלכה:</strong> {violation.consequence}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" paragraph>
                                      <strong>פתרון:</strong> {violation.remedy}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                      <strong>זמן תיקון משוער:</strong> {violation.estimatedFix.timeMinutes} דקות
                                    </Typography>
                                  </Box>
                                }
                              />
                              <ListItemSecondaryAction>
                                <Tooltip title="תקן עכשיו">
                                  <IconButton>
                                    <Lightbulb />
                                  </IconButton>
                                </Tooltip>
                              </ListItemSecondaryAction>
                            </ListItem>
                            {index < analysisResult.compliance.violations.length - 1 && <Divider />}
                          </React.Fragment>
                        ))}
                      </List>
                    </AccordionDetails>
                  </Accordion>
                )}

                {/* Recommendations */}
                {analysisResult.suggestedActions.length > 0 && (
                  <Accordion sx={{ mt: 2 }}>
                    <AccordionSummary expandIcon={<ExpandMore />}>
                      <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Lightbulb color="info" />
                        המלצות ({analysisResult.suggestedActions.length})
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <List>
                        {analysisResult.suggestedActions.map((recommendation, index) => (
                          <React.Fragment key={recommendation.id}>
                            <ListItem alignItems="flex-start">
                              <ListItemIcon>
                                <Lightbulb color="info" />
                              </ListItemIcon>
                              <ListItemText
                                primary={
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Typography variant="subtitle1">
                                      {recommendation.title}
                                    </Typography>
                                    <Chip
                                      label={recommendation.priority}
                                      color={recommendation.priority === 'high' ? 'error' : 
                                             recommendation.priority === 'medium' ? 'warning' : 'default'}
                                      size="small"
                                    />
                                  </Box>
                                }
                                secondary={
                                  <Typography variant="body2" color="text.secondary">
                                    {recommendation.description}
                                  </Typography>
                                }
                              />
                              <ListItemSecondaryAction>
                                <Button size="small" variant="outlined">
                                  יישם
                                </Button>
                              </ListItemSecondaryAction>
                            </ListItem>
                            {index < analysisResult.suggestedActions.length - 1 && <Divider />}
                          </React.Fragment>
                        ))}
                      </List>
                    </AccordionDetails>
                  </Accordion>
                )}

                {/* Alerts */}
                {analysisResult.alerts.length > 0 && (
                  <Box sx={{ mt: 2 }}>
                    {analysisResult.alerts.map((alert) => (
                      <Alert
                        key={alert.id}
                        severity={alert.severity === 'critical' ? 'error' : alert.severity}
                        sx={{ mb: 1 }}
                        action={
                          alert.actionRequired && (
                            <Button color="inherit" size="small">
                              פעולה נדרשת
                            </Button>
                          )
                        }
                      >
                        <Typography variant="subtitle2">{alert.title}</Typography>
                        {alert.message}
                      </Alert>
                    ))}
                  </Box>
                )}
              </Box>
            )}
          </StepContent>
        </Step>
      </Stepper>
    </Box>
  )
}

export default ComplianceAnalyzer

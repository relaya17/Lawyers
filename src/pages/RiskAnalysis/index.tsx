import React, { useState } from 'react'
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  Chip,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  IconButton,
  Tooltip,
  Paper
} from '@mui/material'
import {
  Upload,
  Security,
  Warning,
  CheckCircle,
  Error,
  Info,
  Download,
  Share,
  Edit,
  Lightbulb,
  Gavel,
  TrendingUp,
  AutoFixHigh,
  Psychology,
  School
} from '@mui/icons-material'

import { aiRiskAnalysisService } from '@shared/services/aiRiskAnalysis'

interface RiskAnalysisResult {
  overallRisk: 'veryLow' | 'low' | 'medium' | 'high' | 'veryHigh'
  riskScore: number
  identifiedRisks: Array<{
    id: string
    category: string
    severity: 'low' | 'medium' | 'high' | 'critical'
    description: string
    clause: string
    impact: string
    recommendation: string
    alternativeClause?: string
    legalReference?: string
  }>
  riskByCategory: {
    legal: number
    financial: number
    operational: number
    compliance: number
  }
  aiSuggestions: Array<{
    id: string
    type: 'improvement' | 'alternative' | 'warning'
    title: string
    description: string
    suggestedClause: string
    reasoning: string
    legalBasis: string
  }>
  complianceStatus: {
    isCompliant: boolean
    missingRequirements: string[]
    recommendations: string[]
  }
}

export const RiskAnalysisPage: React.FC = () => {
  const [contractText, setContractText] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<RiskAnalysisResult | null>(null)
  const [showUploadDialog, setShowUploadDialog] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

    const handleTextAnalysis = async () => {
    if (!contractText.trim()) return
    
    setIsAnalyzing(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Mock analysis result
    const mockResult: RiskAnalysisResult = {
      overallRisk: 'medium',
      riskScore: 65,
      identifiedRisks: [
        {
          id: '1',
          category: 'משפטי',
          severity: 'high',
          description: 'סעיף פיקדון לא מפורט',
          clause: 'הפיקדון: 10,000 ₪',
          impact: 'השוכר לא מוגן מפני ניכויים לא מוצדקים',
          recommendation: 'הוספת פירוט תנאי החזרת הפיקדון',
          alternativeClause: 'הפיקדון: 10,000 ₪. הפיקדון יוחזר בתוך 30 יום מסיום החוזה, בניכוי נזקים שנגרמו באשמת השוכר בלבד.',
          legalReference: 'סעיף 5 לחוק השכירות והשאילה'
        },
        {
          id: '2',
          category: 'תפעולי',
          severity: 'medium',
          description: 'תיקון תקלות לא מפורט',
          clause: 'תיקון תקלות: המשכיר אחראי',
          impact: 'עיכובים בתיקון תקלות דחופות',
          recommendation: 'הגדרת זמני תגובה ותיקון',
          alternativeClause: 'תיקון תקלות: המשכיר אחראי. תקלות דחופות יותקנו תוך 24 שעות, תקלות רגילות תוך 7 ימים.',
          legalReference: 'פסיקת בית המשפט העליון ע"א 1234/20'
        }
      ],
      riskByCategory: {
        legal: 75,
        financial: 60,
        operational: 45,
        compliance: 30
      },
      aiSuggestions: [
        {
          id: '1',
          type: 'improvement',
          title: 'שיפור סעיף הפיקדון',
          description: 'הסעיף הנוכחי לא מספק הגנה מספקת לשוכר',
          suggestedClause: 'הפיקדון בסך 10,000 ₪ יופקד בחשבון נאמנות בנפרד. הפיקדון יוחזר בתוך 30 יום מסיום החוזה, בניכוי נזקים שנגרמו באשמת השוכר בלבד, ויינתן דוח מפורט על הניכויים.',
          reasoning: 'הגנה על השוכר מפני ניכויים לא מוצדקים והבטחת שקיפות',
          legalBasis: 'סעיף 5 לחוק השכירות והשאילה, תקנה 3 לתקנות השכירות'
        },
        {
          id: '2',
          type: 'alternative',
          title: 'סעיף תיקון תקלות משופר',
          description: 'הוספת זמני תגובה ותיקון מפורטים',
          suggestedClause: 'תיקון תקלות: המשכיר אחראי לתיקון כל התקלות. תקלות דחופות (מים, חשמל, גז) יותקנו תוך 24 שעות. תקלות רגילות יותקנו תוך 7 ימים. אי תיקון במועד יאפשר לשוכר לתקן ולקזז מהשכירות.',
          reasoning: 'הבטחת תיקון מהיר ויעיל של תקלות',
          legalBasis: 'פסיקת בית המשפט העליון ע"א 1234/20, חוק השכירות והשאילה'
        }
      ],
      complianceStatus: {
        isCompliant: false,
        missingRequirements: [
          'סעיף פיקדון מפורט',
          'זמני תגובה לתיקון תקלות',
          'סעיף ביטול מפורט'
        ],
        recommendations: [
          'הוספת פירוט תנאי החזרת הפיקדון',
          'הגדרת זמני תגובה ותיקון',
          'הוספת סעיף ביטול מפורט'
        ]
      }
    }
    
    setAnalysisResult(mockResult)
    setIsAnalyzing(false)
  }

  const handleFileUpload = async (file: File) => {
    setSelectedFile(file)
    setShowUploadDialog(false)
    setIsAnalyzing(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Mock file analysis result
    const mockResult: RiskAnalysisResult = {
      overallRisk: 'high',
      riskScore: 78,
      identifiedRisks: [
        {
          id: '1',
          category: 'עבודה',
          severity: 'critical',
          description: 'סעיף אי תחרות לא מאוזן',
          clause: 'העובד לא יעבוד אצל מתחרה במשך שנה',
          impact: 'העובד מוגבל מדי ולא מקבל פיצוי הולם',
          recommendation: 'איזון הסעיף עם פיצוי מתאים',
          alternativeClause: 'העובד לא יעבוד אצל מתחרה ישיר במשך 6 חודשים, בתמורה לפיצוי של 3 משכורות.',
          legalReference: 'פסיקת בית המשפט העליון ע"א 1234/20, סעיף 30 לחוק החוזים'
        }
      ],
      riskByCategory: {
        legal: 85,
        financial: 70,
        operational: 55,
        compliance: 40
      },
      aiSuggestions: [
        {
          id: '1',
          type: 'warning',
          title: 'סעיף אי תחרות לא מאוזן',
          description: 'הסעיף הנוכחי מגביל מדי ולא מספק פיצוי הולם',
          suggestedClause: 'העובד לא יעבוד אצל מתחרה ישיר במשך 6 חודשים, בתמורה לפיצוי של 3 משכורות. ההגבלה תחול רק על תפקידים דומים.',
          reasoning: 'איזון בין הגנה על העסק לבין זכויות העובד',
          legalBasis: 'פסיקת בית המשפט העליון ע"א 1234/20, עקרון המידתיות'
        }
      ],
      complianceStatus: {
        isCompliant: false,
        missingRequirements: [
          'פיצוי הולם לסעיף אי תחרות',
          'הגדרת מתחרה ישיר',
          'תקופת הגבלה סבירה'
        ],
        recommendations: [
          'הוספת פיצוי מתאים לסעיף אי תחרות',
          'הגדרת מתחרה ישיר באופן מפורט',
          'קיצור תקופת ההגבלה'
        ]
      }
    }
    
    setAnalysisResult(mockResult)
    setIsAnalyzing(false)
  }

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'veryLow': return 'success'
      case 'low': return 'info'
      case 'medium': return 'warning'
      case 'high': return 'error'
      case 'veryHigh': return 'error'
      default: return 'default'
    }
  }

  const getRiskLabel = (risk: string) => {
    switch (risk) {
      case 'veryLow': return 'סיכון נמוך מאוד'
      case 'low': return 'סיכון נמוך'
      case 'medium': return 'סיכון בינוני'
      case 'high': return 'סיכון גבוה'
      case 'veryHigh': return 'סיכון גבוה מאוד'
      default: return 'לא ידוע'
    }
  }

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'low': return <Info color="info" />
      case 'medium': return <Warning color="warning" />
      case 'high': return <Error color="error" />
      case 'critical': return <Security color="error" />
      default: return <Info />
    }
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            ניתוח סיכונים
          </Typography>
          <Typography variant="h6" color="text.secondary" paragraph>
            ניתוח סיכונים מתקדם עם AI - זיהוי סיכונים, הצעות לשיפור והתייחסות לחוק
          </Typography>
        </Box>

        {!analysisResult ? (
          <Card sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h5" gutterBottom>
              העלה חוזה לניתוח סיכונים מתקדם
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              המערכת תזהה סיכונים, תציע ניסוחים חלופיים ותתן התייחסות לחוק ולפסיקה
            </Typography>
            
            <Box sx={{ mt: 4, display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Button
                variant="contained"
                size="large"
                startIcon={<Upload />}
                onClick={() => setShowUploadDialog(true)}
              >
                העלה קובץ PDF או Word
              </Button>
              <Button
                variant="outlined"
                size="large"
                startIcon={<Edit />}
                onClick={() => setContractText('חוזה שכירות דירה\n\nבין: משכיר\nלבין: שוכר\n\n1. המחיר: 5,000 ₪ לחודש\n2. הפיקדון: 10,000 ₪\n3. משך החוזה: שנה\n4. תיקון תקלות: המשכיר אחראי\n5. ביטול: הודעה של חודש')}
              >
                השתמש בדוגמה
              </Button>
            </Box>

            {contractText && (
              <Box sx={{ mt: 4 }}>
                <TextField
                  fullWidth
                  multiline
                  rows={8}
                  label="טקסט החוזה"
                  value={contractText}
                  onChange={(e) => setContractText(e.target.value)}
                  placeholder="הדבק כאן את תוכן החוזה..."
                />
                <Button
                  variant="contained"
                  size="large"
                  onClick={handleTextAnalysis}
                  disabled={isAnalyzing || !contractText.trim()}
                  sx={{ mt: 2 }}
                  startIcon={isAnalyzing ? <LinearProgress /> : <Security />}
                >
                  {isAnalyzing ? 'מנתח...' : 'התחל ניתוח סיכונים'}
                </Button>
              </Box>
            )}
          </Card>
        ) : (
          <Box>
            {/* Overall Risk Summary */}
            <Card sx={{ mb: 4 }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <Security sx={{ mr: 2, fontSize: 40, color: `${getRiskColor(analysisResult.overallRisk)}.main` }} />
                  <Box>
                    <Typography variant="h5" gutterBottom>
                      ניתוח סיכון כללי
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      נותח ב: {new Date().toLocaleDateString('he-IL')}
                    </Typography>
                  </Box>
                </Box>
                
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h2" color={`${getRiskColor(analysisResult.overallRisk)}.main`} fontWeight="bold">
                        {analysisResult.riskScore}%
                      </Typography>
                                             <Chip 
                         label={getRiskLabel(analysisResult.overallRisk)}
                         color={getRiskColor(analysisResult.overallRisk) as any}
                         size="medium"
                         sx={{ mt: 1 }}
                       />
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="h6" gutterBottom>
                      סיכונים לפי קטגוריה
                    </Typography>
                    <Box sx={{ mb: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2">משפטי</Typography>
                        <Typography variant="body2">{analysisResult.riskByCategory.legal}%</Typography>
                      </Box>
                      <LinearProgress variant="determinate" value={analysisResult.riskByCategory.legal} color="error" />
                    </Box>
                    <Box sx={{ mb: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2">כלכלי</Typography>
                        <Typography variant="body2">{analysisResult.riskByCategory.financial}%</Typography>
                      </Box>
                      <LinearProgress variant="determinate" value={analysisResult.riskByCategory.financial} color="warning" />
                    </Box>
                    <Box sx={{ mb: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2">תפעולי</Typography>
                        <Typography variant="body2">{analysisResult.riskByCategory.operational}%</Typography>
                      </Box>
                      <LinearProgress variant="determinate" value={analysisResult.riskByCategory.operational} color="info" />
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            {/* AI Suggestions */}
            <Card sx={{ mb: 4 }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <AutoFixHigh sx={{ mr: 2, color: 'primary.main' }} />
                  <Typography variant="h5">
                    המלצות AI לשיפור
                  </Typography>
                </Box>
                
                <Grid container spacing={2}>
                  {analysisResult.aiSuggestions.map((suggestion) => (
                    <Grid item xs={12} key={suggestion.id}>
                      <Paper sx={{ p: 2, border: 1, borderColor: 'divider' }}>
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                          <Lightbulb sx={{ mr: 1, color: 'warning.main', mt: 0.5 }} />
                          <Box sx={{ flexGrow: 1 }}>
                            <Typography variant="h6" gutterBottom>
                              {suggestion.title}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" paragraph>
                              {suggestion.description}
                            </Typography>
                            
                            <Accordion>
                              <AccordionSummary>
                                <Typography variant="body2" fontWeight="bold">
                                  הצעה לניסוח חלופי
                                </Typography>
                              </AccordionSummary>
                              <AccordionDetails>
                                <Box sx={{ backgroundColor: 'grey.50', p: 2, borderRadius: 1 }}>
                                  <Typography variant="body2" fontFamily="monospace">
                                    {suggestion.suggestedClause}
                                  </Typography>
                                </Box>
                                <Typography variant="body2" sx={{ mt: 2 }}>
                                  <strong>נימוק:</strong> {suggestion.reasoning}
                                </Typography>
                                <Typography variant="body2" sx={{ mt: 1 }}>
                                  <strong>בסיס משפטי:</strong> {suggestion.legalBasis}
                                </Typography>
                              </AccordionDetails>
                            </Accordion>
                          </Box>
                        </Box>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>

            {/* Identified Risks */}
            <Card sx={{ mb: 4 }}>
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  סיכונים שזוהו
                </Typography>
                
                <List>
                  {analysisResult.identifiedRisks.map((risk, index) => (
                    <React.Fragment key={risk.id}>
                      <ListItem alignItems="flex-start">
                        <ListItemIcon>
                          {getSeverityIcon(risk.severity)}
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Typography variant="h6">
                                {risk.description}
                              </Typography>
                              <Chip 
                                label={risk.category} 
                                size="small" 
                                color="primary" 
                                variant="outlined"
                              />
                            </Box>
                          }
                          secondary={
                            <Box sx={{ mt: 1 }}>
                              <Typography variant="body2" color="text.secondary">
                                <strong>סעיף:</strong> {risk.clause}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                <strong>השפעה:</strong> {risk.impact}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                <strong>המלצה:</strong> {risk.recommendation}
                              </Typography>
                              {risk.alternativeClause && (
                                <Box sx={{ mt: 1, backgroundColor: 'success.50', p: 1, borderRadius: 1 }}>
                                  <Typography variant="body2" fontWeight="bold" color="success.main">
                                    ניסוח חלופי מוצע:
                                  </Typography>
                                  <Typography variant="body2" fontFamily="monospace">
                                    {risk.alternativeClause}
                                  </Typography>
                                </Box>
                              )}
                              {risk.legalReference && (
                                <Box sx={{ mt: 1, backgroundColor: 'info.50', p: 1, borderRadius: 1 }}>
                                  <Typography variant="body2" fontWeight="bold" color="info.main">
                                    התייחסות משפטית:
                                  </Typography>
                                  <Typography variant="body2">
                                    {risk.legalReference}
                                  </Typography>
                                </Box>
                              )}
                            </Box>
                          }
                        />
                      </ListItem>
                      {index < analysisResult.identifiedRisks.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              </CardContent>
            </Card>

            {/* Compliance Status */}
            <Card sx={{ mb: 4 }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <Gavel sx={{ mr: 2, color: analysisResult.complianceStatus.isCompliant ? 'success.main' : 'error.main' }} />
                  <Typography variant="h5">
                    סטטוס תאימות לחוק
                  </Typography>
                </Box>
                
                <Alert 
                  severity={analysisResult.complianceStatus.isCompliant ? 'success' : 'error'}
                  sx={{ mb: 3 }}
                >
                  {analysisResult.complianceStatus.isCompliant 
                    ? 'החוזה עומד בדרישות החוק' 
                    : 'החוזה אינו עומד במלוא דרישות החוק'
                  }
                </Alert>
                
                {analysisResult.complianceStatus.missingRequirements.length > 0 && (
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="h6" gutterBottom>
                      דרישות חסרות:
                    </Typography>
                    <List dense>
                      {analysisResult.complianceStatus.missingRequirements.map((req, index) => (
                        <ListItem key={index}>
                          <ListItemIcon>
                            <Error color="error" />
                          </ListItemIcon>
                          <ListItemText primary={req} />
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                )}
                
                <Box>
                  <Typography variant="h6" gutterBottom>
                    המלצות לשיפור:
                  </Typography>
                  <List dense>
                    {analysisResult.complianceStatus.recommendations.map((rec, index) => (
                      <ListItem key={index}>
                        <ListItemIcon>
                          <School color="primary" />
                        </ListItemIcon>
                        <ListItemText primary={rec} />
                      </ListItem>
                    ))}
                  </List>
                </Box>
              </CardContent>
            </Card>

            {/* Actions */}
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Button
                variant="contained"
                startIcon={<Download />}
                size="large"
              >
                ייצא דוח PDF
              </Button>
              <Button
                variant="outlined"
                startIcon={<Share />}
                size="large"
              >
                שתף עם צוות
              </Button>
              <Button
                variant="outlined"
                onClick={() => setAnalysisResult(null)}
                size="large"
              >
                ניתוח חדש
              </Button>
            </Box>
          </Box>
        )}

        {/* Upload Dialog */}
        <Dialog open={showUploadDialog} onClose={() => setShowUploadDialog(false)} maxWidth="sm" fullWidth>
          <DialogTitle>העלה חוזה לניתוח</DialogTitle>
          <DialogContent>
            <Typography paragraph>
              בחר קובץ PDF או Word לניתוח סיכונים מתקדם
            </Typography>
            <Box sx={{ border: 2, borderStyle: 'dashed', borderColor: 'grey.300', p: 3, textAlign: 'center' }}>
              <Upload sx={{ fontSize: 48, color: 'grey.400', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                גרור קובץ לכאן או לחץ לבחירה
              </Typography>
              <Typography variant="body2" color="text.secondary">
                תמיכה בקבצי PDF, DOC, DOCX עד 10MB
              </Typography>
              <Button
                variant="contained"
                sx={{ mt: 2 }}
                onClick={() => {
                  // Mock file selection
                  const mockFile = new File(['mock content'], 'contract.pdf', { type: 'application/pdf' })
                  handleFileUpload(mockFile)
                }}
              >
                בחר קובץ
              </Button>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowUploadDialog(false)}>
              ביטול
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Container>
  )
}

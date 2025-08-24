import React from 'react'
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  Chip,
  Button,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  LinearProgress
} from '@mui/material'
import {
  Assessment,
  Warning,
  CheckCircle,
  Error,
  Info,
  Download,
  Share,
  Print,
  TrendingUp,
  TrendingDown,
  Security,
  Gavel,
  Lightbulb,
  AutoFixHigh,
  Psychology,
  School,
  ExpandMore,
  Description,
  Timeline,
  BarChart
} from '@mui/icons-material'
import { useTranslation } from 'react-i18next'

interface RiskReportProps {
  data: {
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
}

const RiskReport: React.FC<RiskReportProps> = ({ data }) => {
  const { t } = useTranslation()

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'veryLow':
      case 'low':
        return 'success'
      case 'medium':
        return 'warning'
      case 'high':
      case 'veryHigh':
        return 'error'
      default:
        return 'default'
    }
  }

  const getRiskIcon = (level: string) => {
    switch (level) {
      case 'veryLow':
      case 'low':
        return <CheckCircle />
      case 'medium':
        return <Warning />
      case 'high':
      case 'veryHigh':
        return <Error />
      default:
        return <Info />
    }
  }

  const getSuggestionIcon = (type: string) => {
    switch (type) {
      case 'improvement':
        return <TrendingUp />
      case 'alternative':
        return <AutoFixHigh />
      case 'warning':
        return <Warning />
      default:
        return <Info />
    }
  }

  const getSuggestionColor = (type: string) => {
    switch (type) {
      case 'improvement':
        return 'success'
      case 'alternative':
        return 'info'
      case 'warning':
        return 'warning'
      default:
        return 'default'
    }
  }

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
      {/* Header */}
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Assessment sx={{ mr: 2, color: 'primary.main' }} />
            <Typography variant="h4" component="h1">
              {t('riskAnalysis.report.title')}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button startIcon={<Download />} variant="outlined">
              {t('riskAnalysis.exportReport')}
            </Button>
            <Button startIcon={<Share />} variant="outlined">
              {t('riskAnalysis.shareReport')}
            </Button>
            <Button startIcon={<Print />} variant="outlined">
              {t('riskAnalysis.printReport')}
            </Button>
          </Box>
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {t('riskAnalysis.overallRisk')}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  {getRiskIcon(data.overallRisk)}
                  <Chip
                    label={t(`riskAnalysis.levels.${data.overallRisk}`)}
                    color={getRiskColor(data.overallRisk) as 'success' | 'warning' | 'error' | 'info' | 'primary' | 'secondary'}
                    size="medium"
                  />
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={data.riskScore}
                  sx={{ height: 10, borderRadius: 5 }}
                  color={getRiskColor(data.overallRisk) as 'success' | 'warning' | 'error' | 'info' | 'primary' | 'secondary'}
                />
                <Typography variant="body2" sx={{ mt: 1 }}>
                  {t('riskAnalysis.riskScore')}: {data.riskScore}%
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {t('riskAnalysis.complianceStatus')}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  {data.complianceStatus.isCompliant ? <CheckCircle color="success" /> : <Error color="error" />}
                  <Typography>
                    {data.complianceStatus.isCompliant 
                      ? t('riskAnalysis.compliant') 
                      : t('riskAnalysis.nonCompliant')
                    }
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  {data.complianceStatus.missingRequirements.length} {t('riskAnalysis.missingRequirements')}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Paper>

      {/* Risk Categories */}
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h5" component="h2" gutterBottom>
          {t('riskAnalysis.riskByCategory')}
        </Typography>
        <Grid container spacing={2}>
          {Object.entries(data.riskByCategory).map(([category, score]) => (
            <Grid item xs={12} sm={6} md={3} key={category}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {t(`riskAnalysis.categories.${category}`)}
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={score}
                    sx={{ height: 8, borderRadius: 4, mb: 1 }}
                  />
                  <Typography variant="body2">
                    {score}%
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Paper>

      {/* Identified Risks */}
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h5" component="h2" gutterBottom>
          {t('riskAnalysis.identifiedRisks')} ({data.identifiedRisks.length})
        </Typography>
        <Grid container spacing={2}>
          {data.identifiedRisks.map((risk) => (
            <Grid item xs={12} key={risk.id}>
              <Accordion>
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
                    {getRiskIcon(risk.severity)}
                    <Chip
                      label={t(`riskAnalysis.levels.${risk.severity}`)}
                      color={getRiskColor(risk.severity)}
                      size="small"
                    />
                    <Typography variant="subtitle1" sx={{ flexGrow: 1 }}>
                      {risk.category}
                    </Typography>
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <Typography variant="h6" gutterBottom>
                        {t('riskAnalysis.description')}
                      </Typography>
                      <Typography variant="body2" paragraph>
                        {risk.description}
                      </Typography>
                      <Typography variant="h6" gutterBottom>
                        {t('riskAnalysis.clause')}
                      </Typography>
                      <Typography variant="body2" sx={{ fontFamily: 'monospace', backgroundColor: 'grey.100', p: 1, borderRadius: 1 }}>
                        {risk.clause}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Typography variant="h6" gutterBottom>
                        {t('riskAnalysis.impact')}
                      </Typography>
                      <Typography variant="body2" paragraph>
                        {risk.impact}
                      </Typography>
                      <Typography variant="h6" gutterBottom>
                        {t('riskAnalysis.recommendation')}
                      </Typography>
                      <Typography variant="body2" paragraph>
                        {risk.recommendation}
                      </Typography>
                      {risk.alternativeClause && (
                        <>
                          <Typography variant="h6" gutterBottom>
                            {t('riskAnalysis.alternativeClause')}
                          </Typography>
                          <Typography variant="body2" sx={{ fontFamily: 'monospace', backgroundColor: 'success.50', p: 1, borderRadius: 1 }}>
                            {risk.alternativeClause}
                          </Typography>
                        </>
                      )}
                    </Grid>
                  </Grid>
                </AccordionDetails>
              </Accordion>
            </Grid>
          ))}
        </Grid>
      </Paper>

      {/* AI Suggestions */}
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h5" component="h2" gutterBottom>
          {t('riskAnalysis.aiSuggestions')} ({data.aiSuggestions.length})
        </Typography>
        <Grid container spacing={2}>
          {data.aiSuggestions.map((suggestion) => (
            <Grid item xs={12} key={suggestion.id}>
              <Card variant="outlined">
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    {getSuggestionIcon(suggestion.type)}
                    <Chip
                      label={t(`riskAnalysis.suggestionTypes.${suggestion.type}`)}
                      color={getSuggestionColor(suggestion.type)}
                      size="small"
                    />
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                      {suggestion.title}
                    </Typography>
                  </Box>
                  <Typography variant="body2" paragraph>
                    {suggestion.description}
                  </Typography>
                  <Typography variant="h6" gutterBottom>
                    {t('riskAnalysis.suggestedClause')}
                  </Typography>
                  <Typography variant="body2" sx={{ fontFamily: 'monospace', backgroundColor: 'info.50', p: 1, borderRadius: 1, mb: 2 }}>
                    {suggestion.suggestedClause}
                  </Typography>
                  <Typography variant="h6" gutterBottom>
                    {t('riskAnalysis.reasoning')}
                  </Typography>
                  <Typography variant="body2" paragraph>
                    {suggestion.reasoning}
                  </Typography>
                  <Typography variant="h6" gutterBottom>
                    {t('riskAnalysis.legalBasis')}
                  </Typography>
                  <Typography variant="body2">
                    {suggestion.legalBasis}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Paper>

      {/* Compliance Details */}
      {!data.complianceStatus.isCompliant && (
        <Paper elevation={3} sx={{ p: 3 }}>
          <Typography variant="h5" component="h2" gutterBottom>
            {t('riskAnalysis.complianceDetails')}
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                {t('riskAnalysis.missingRequirements')}
              </Typography>
              <List>
                {data.complianceStatus.missingRequirements.map((requirement, index) => (
                  <ListItem key={index}>
                    <ListItemIcon>
                      <Error color="error" />
                    </ListItemIcon>
                    <ListItemText primary={requirement} />
                  </ListItem>
                ))}
              </List>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                {t('riskAnalysis.recommendations')}
              </Typography>
              <List>
                {data.complianceStatus.recommendations.map((recommendation, index) => (
                  <ListItem key={index}>
                    <ListItemIcon>
                      <Lightbulb color="warning" />
                    </ListItemIcon>
                    <ListItemText primary={recommendation} />
                  </ListItem>
                ))}
              </List>
            </Grid>
          </Grid>
        </Paper>
      )}
    </Box>
  )
}

export default RiskReport

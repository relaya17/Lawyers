import React, { useState } from 'react'
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Tooltip,
  Tab,
  Tabs,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  LinearProgress,
  Divider,
  Avatar,
  Alert,
  Badge,
} from '@mui/material'
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineOppositeContent
} from '@mui/lab'
import {
  Assessment,
  ArrowBack,
  Edit,
  Download,
  Share,
  Print,
  CheckCircle,
  Warning,
  Error,
  Info,
  Person,
  CalendarToday,
  Schedule,
  TrendingUp,
  TrendingDown,
  Security,
  Gavel,
  Description,
  Assignment,
  ExpandMore,
  Visibility,
  Comment,
  History,
  Analytics,
  AttachFile
} from '@mui/icons-material'
import { useTranslation } from 'react-i18next'

interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`risk-tabpanel-${index}`}
      aria-labelledby={`risk-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  )
}

interface RiskItem {
  id: string
  category: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  title: string
  description: string
  impact: string
  recommendation: string
  status: 'identified' | 'analyzed' | 'mitigated' | 'resolved'
  assignedTo?: string
  dueDate?: Date
  attachments?: string[]
  comments?: Array<{
    id: string
    author: string
    content: string
    timestamp: Date
  }>
}

interface RiskAssessmentData {
  id: string
  title: string
  description: string
  contractType: string
  status: 'draft' | 'in-progress' | 'completed' | 'archived'
  riskLevel: 'low' | 'medium' | 'high' | 'critical'
  overallScore: number
  createdAt: Date
  updatedAt: Date
  createdBy: string
  assignedTo?: string
  contractText: string
  risks: RiskItem[]
  complianceScore: number
  recommendations: string[]
  executiveSummary: string
  methodology: string
  limitations: string[]
  nextSteps: string[]
  auditTrail: Array<{
    id: string
    action: string
    user: string
    timestamp: Date
    details: string
  }>
}

interface RiskAssessmentViewProps {
  assessment: RiskAssessmentData
  onBack: () => void
  onEdit: (assessmentId: string) => void
  onExport: (assessmentId: string) => void
  onUpdateRisk: (riskId: string, updates: Partial<RiskItem>) => void
}

const RiskAssessmentView: React.FC<RiskAssessmentViewProps> = ({
  assessment,
  onBack,
  onEdit,
  onExport,
  onUpdateRisk
}) => {
  const { t } = useTranslation()
  const [activeTab, setActiveTab] = useState(0)

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case 'low':
        return 'success'
      case 'medium':
        return 'warning'
      case 'high':
        return 'error'
      case 'critical':
        return 'error'
      default:
        return 'default'
    }
  }

  const getRiskLevelIcon = (level: string) => {
    switch (level) {
      case 'low':
        return <CheckCircle />
      case 'medium':
        return <Warning />
      case 'high':
        return <Error />
      case 'critical':
        return <Security />
      default:
        return <Assessment />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'identified':
        return 'default'
      case 'analyzed':
        return 'info'
      case 'mitigated':
        return 'warning'
      case 'resolved':
        return 'success'
      default:
        return 'default'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'identified':
        return <Visibility />
      case 'analyzed':
        return <Analytics />
      case 'mitigated':
        return <Security />
      case 'resolved':
        return <CheckCircle />
      default:
        return <Assignment />
    }
  }

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue)
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('he-IL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getProgressByCategory = () => {
    const categories = ['legal', 'financial', 'operational', 'compliance']
    return categories.map(category => {
      const categoryRisks = assessment.risks.filter(risk => risk.category === category)
      const resolvedRisks = categoryRisks.filter(risk => risk.status === 'resolved')
      const progress = categoryRisks.length > 0 ? (resolvedRisks.length / categoryRisks.length) * 100 : 0
      
      return {
        category,
        total: categoryRisks.length,
        resolved: resolvedRisks.length,
        progress
      }
    })
  }

  const risksByCategory = assessment.risks.reduce((acc, risk) => {
    if (!acc[risk.category]) {
      acc[risk.category] = []
    }
    acc[risk.category].push(risk)
    return acc
  }, {} as Record<string, RiskItem[]>)

  return (
    <Box>
      {/* Header */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton onClick={onBack}>
              <ArrowBack />
            </IconButton>
            <Assessment sx={{ color: 'primary.main' }} />
            <Box>
              <Typography variant="h4" component="h1">
                {assessment.title}
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                {assessment.description}
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button startIcon={<Edit />} onClick={() => onEdit(assessment.id)}>
              {t('common.edit')}
            </Button>
            <Button startIcon={<Download />} onClick={() => onExport(assessment.id)}>
              {t('common.export')}
            </Button>
            <Button startIcon={<Share />}>
              {t('common.share')}
            </Button>
            <Button startIcon={<Print />}>
              {t('common.print')}
            </Button>
          </Box>
        </Box>

        <Grid container spacing={2}>
          <Grid item xs={12} md={8}>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <Chip
                icon={getRiskLevelIcon(assessment.riskLevel)}
                label={t(`riskAnalysis.levels.${assessment.riskLevel}`)}
                color={getRiskLevelColor(assessment.riskLevel) as any}
              />
              <Chip
                label={t(`riskAnalysis.status.${assessment.status}`)}
                color="primary"
                variant="outlined"
              />
              <Chip
                label={assessment.contractType}
                variant="outlined"
              />
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box sx={{ textAlign: 'right' }}>
              <Typography variant="h3" color="primary">
                {assessment.overallScore}%
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {t('riskAnalysis.overallScore')}
              </Typography>
            </Box>
          </Grid>
        </Grid>

        <Box sx={{ mt: 2, display: 'flex', gap: 2, alignItems: 'center' }}>
          <Person sx={{ fontSize: 16 }} />
          <Typography variant="body2" color="text.secondary">
            {t('riskAnalysis.createdBy')}: {assessment.createdBy}
          </Typography>
          <CalendarToday sx={{ fontSize: 16 }} />
          <Typography variant="body2" color="text.secondary">
            {formatDate(assessment.createdAt)}
          </Typography>
          <Schedule sx={{ fontSize: 16 }} />
          <Typography variant="body2" color="text.secondary">
            {t('riskAnalysis.lastUpdated')}: {formatDate(assessment.updatedAt)}
          </Typography>
        </Box>
      </Paper>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {t('riskAnalysis.totalRisks')}
              </Typography>
              <Typography variant="h3" color="primary">
                {assessment.risks.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {assessment.risks.filter(r => r.status === 'resolved').length} {t('riskAnalysis.resolved')}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {t('riskAnalysis.complianceScore')}
              </Typography>
              <Typography variant="h3" color="success.main">
                {assessment.complianceScore}%
              </Typography>
              <LinearProgress 
                variant="determinate" 
                value={assessment.complianceScore} 
                color="success"
                sx={{ mt: 1 }}
              />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {t('riskAnalysis.criticalRisks')}
              </Typography>
              <Typography variant="h3" color="error.main">
                {assessment.risks.filter(r => r.severity === 'critical').length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {assessment.risks.filter(r => r.severity === 'high').length} {t('riskAnalysis.highRisks')}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {t('riskAnalysis.recommendations')}
              </Typography>
              <Typography variant="h3" color="info.main">
                {assessment.recommendations.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {t('riskAnalysis.actionItems')}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Progress by Category */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          {t('riskAnalysis.progressByCategory')}
        </Typography>
        <Grid container spacing={2}>
          {getProgressByCategory().map((category) => (
            <Grid item xs={12} sm={6} md={3} key={category.category}>
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant="body2">
                    {t(`riskAnalysis.categories.${category.category}`)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {category.resolved}/{category.total}
                  </Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={category.progress} 
                  sx={{ height: 8, borderRadius: 4 }}
                />
              </Box>
            </Grid>
          ))}
        </Grid>
      </Paper>

      {/* Tabs */}
      <Paper elevation={2}>
        <Tabs value={activeTab} onChange={handleTabChange} aria-label="risk assessment tabs">
          <Tab label={t('riskAnalysis.overview')} />
          <Tab label={t('riskAnalysis.risks')} />
          <Tab label={t('riskAnalysis.recommendations')} />
          <Tab label={t('riskAnalysis.auditTrail')} />
        </Tabs>

        <TabPanel value={activeTab} index={0}>
          {/* Overview Tab */}
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <Typography variant="h6" gutterBottom>
                {t('riskAnalysis.executiveSummary')}
              </Typography>
              <Typography variant="body1" paragraph>
                {assessment.executiveSummary}
              </Typography>

              <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                {t('riskAnalysis.methodology')}
              </Typography>
              <Typography variant="body1" paragraph>
                {assessment.methodology}
              </Typography>

              <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                {t('riskAnalysis.contractText')}
              </Typography>
              <Paper variant="outlined" sx={{ p: 2, maxHeight: 300, overflow: 'auto' }}>
                <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                  {assessment.contractText}
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" gutterBottom>
                {t('riskAnalysis.limitations')}
              </Typography>
              <List dense>
                {assessment.limitations.map((limitation, index) => (
                  <ListItem key={index}>
                    <ListItemIcon>
                      <Info color="warning" />
                    </ListItemIcon>
                    <ListItemText primary={limitation} />
                  </ListItem>
                ))}
              </List>

              <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                {t('riskAnalysis.nextSteps')}
              </Typography>
              <List dense>
                {assessment.nextSteps.map((step, index) => (
                  <ListItem key={index}>
                    <ListItemIcon>
                      <TrendingUp color="primary" />
                    </ListItemIcon>
                    <ListItemText primary={step} />
                  </ListItem>
                ))}
              </List>
            </Grid>
          </Grid>
        </TabPanel>

        <TabPanel value={activeTab} index={1}>
          {/* Risks Tab */}
          <Box>
            {Object.entries(risksByCategory).map(([category, risks]) => (
              <Accordion key={category} defaultExpanded>
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Typography variant="h6">
                      {t(`riskAnalysis.categories.${category}`)}
                    </Typography>
                    <Badge badgeContent={risks.length} color="primary">
                      <Assessment />
                    </Badge>
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>{t('riskAnalysis.severity')}</TableCell>
                          <TableCell>{t('riskAnalysis.title')}</TableCell>
                          <TableCell>{t('riskAnalysis.status')}</TableCell>
                          <TableCell>{t('riskAnalysis.assignedTo')}</TableCell>
                          <TableCell>{t('common.actions')}</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {risks.map((risk) => (
                          <TableRow key={risk.id}>
                            <TableCell>
                              <Chip
                                icon={getRiskLevelIcon(risk.severity)}
                                label={t(`riskAnalysis.levels.${risk.severity}`)}
                                color={getRiskLevelColor(risk.severity) as any}
                                size="small"
                              />
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2" fontWeight="medium">
                                {risk.title}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {risk.description}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Chip
                                icon={getStatusIcon(risk.status)}
                                label={t(`riskAnalysis.riskStatus.${risk.status}`)}
                                color={getStatusColor(risk.status) as any}
                                size="small"
                              />
                            </TableCell>
                            <TableCell>
                              {risk.assignedTo && (
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  <Avatar sx={{ width: 24, height: 24 }}>
                                    {risk.assignedTo[0]}
                                  </Avatar>
                                  <Typography variant="body2">
                                    {risk.assignedTo}
                                  </Typography>
                                </Box>
                              )}
                            </TableCell>
                            <TableCell>
                              <Tooltip title={t('common.view')}>
                                <IconButton size="small">
                                  <Visibility />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title={t('common.comment')}>
                                <IconButton size="small">
                                  <Comment />
                                </IconButton>
                              </Tooltip>
                              {risk.attachments && risk.attachments.length > 0 && (
                                <Tooltip title={t('common.attachments')}>
                                  <IconButton size="small">
                                    <AttachFile />
                                  </IconButton>
                                </Tooltip>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </AccordionDetails>
              </Accordion>
            ))}
          </Box>
        </TabPanel>

        <TabPanel value={activeTab} index={2}>
          {/* Recommendations Tab */}
          <List>
            {assessment.recommendations.map((recommendation, index) => (
              <ListItem key={index}>
                <ListItemIcon>
                  <TrendingUp color="primary" />
                </ListItemIcon>
                <ListItemText
                  primary={recommendation}
                  secondary={`${t('riskAnalysis.recommendation')} ${index + 1}`}
                />
              </ListItem>
            ))}
          </List>
        </TabPanel>

        <TabPanel value={activeTab} index={3}>
          {/* Audit Trail Tab */}
          <Timeline>
            {assessment.auditTrail.map((entry) => (
              <TimelineItem key={entry.id}>
                <TimelineOppositeContent color="text.secondary">
                  {formatDate(entry.timestamp)}
                </TimelineOppositeContent>
                <TimelineSeparator>
                  <TimelineDot color="primary">
                    <History />
                  </TimelineDot>
                  <TimelineConnector />
                </TimelineSeparator>
                <TimelineContent>
                  <Typography variant="h6" component="span">
                    {entry.action}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {t('common.by')} {entry.user}
                  </Typography>
                  <Typography variant="body2">
                    {entry.details}
                  </Typography>
                </TimelineContent>
              </TimelineItem>
            ))}
          </Timeline>
        </TabPanel>
      </Paper>
    </Box>
  )
}

export default RiskAssessmentView

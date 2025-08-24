// Workflow Dashboard Component
// רכיב דשבורד תהליכי עבודה

import React, { useState, useEffect } from 'react'
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardHeader,
  IconButton,
  Button,
  Chip,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  Avatar,
  Badge,
  Alert,
  Tabs,
  Tab,
  Paper,
  Divider,
  Tooltip,
  CircularProgress,
  useTheme,
  useMediaQuery
} from '@mui/material'
import {
  Timeline,
  Assignment,
  CheckCircle,
  Warning,
  Error,
  PlayArrow,
  Pause,
  Stop,
  Add,
  Refresh,
  TrendingUp,
  TrendingDown,
  Schedule,
  Notifications,
  People,
  Business,
  Gavel,
  Handshake,
  Description,
  Assessment,
  Security,
  MoreVert,
  Visibility,
  Edit,
  Delete
} from '@mui/icons-material'
import { useTranslation } from 'react-i18next'
import { workflowAutomationService } from '../services/workflowService'
import {
  WorkflowDashboardData,
  WorkflowInstance,
  ApprovalRequest,
  WorkflowMetrics
} from '../types'

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
      id={`workflow-tabpanel-${index}`}
      aria-labelledby={`workflow-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  )
}

export const WorkflowDashboard: React.FC = () => {
  const { t } = useTranslation()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  
  const [data, setData] = useState<WorkflowDashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedTab, setSelectedTab] = useState(0)
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      setError(null)
      const dashboardData = await workflowAutomationService.getDashboardData()
      setData(dashboardData)
    } catch (err) {
      setError('שגיאה בטעינת נתוני הדשבורד')
      console.error('Dashboard loading error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    await loadDashboardData()
    setRefreshing(false)
  }

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': {
        return 'primary'
      }
      case 'completed': {
        return 'success'
      }
      case 'paused': {
        return 'warning'
      }
      case 'cancelled':
      case 'error': {
        return 'error'
      }
      default: {
        return 'default'
      }
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': {
        return <PlayArrow color="primary" />
      }
      case 'completed': {
        return <CheckCircle color="success" />
      }
      case 'paused': {
        return <Pause color="warning" />
      }
      case 'cancelled':
      case 'error': {
        return <Error color="error" />
      }
      default: {
        return <Assignment />
      }
    }
  }

  const getApprovalStatusColor = (status: string) => {
    switch (status) {
      case 'pending': {
        return 'warning'
      }
      case 'approved': {
        return 'success'
      }
      case 'rejected': {
        return 'error'
      }
      case 'expired': {
        return 'error'
      }
      default: {
        return 'default'
      }
    }
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('he-IL', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
  }

  const formatDuration = (hours: number) => {
    if (hours < 24) {
      return `${hours} שעות`
    }
    const days = Math.floor(hours / 24)
    const remainingHours = hours % 24
    return `${days} ימים ${remainingHours > 0 ? `ו-${remainingHours} שעות` : ''}`
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <CircularProgress />
      </Box>
    )
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ m: 2 }}>
        {error}
      </Alert>
    )
  }

  if (!data) {
    return (
      <Alert severity="info" sx={{ m: 2 }}>
        אין נתונים זמינים
      </Alert>
    )
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            דשבורד תהליכי עבודה
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="outlined"
              startIcon={<Refresh />}
              onClick={handleRefresh}
              disabled={refreshing}
            >
              רענן
            </Button>
            
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => {/* TODO: Navigate to create workflow */}}
            >
              תהליך חדש
            </Button>
          </Box>
        </Box>

        <Alert severity="info" sx={{ mb: 3 }}>
          נתונים מתעדכנים בזמן אמת. נכון לרגע זה יש {data.overview.activeWorkflows} תהליכים פעילים.
        </Alert>
      </Box>

      {/* Metrics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box>
                  <Typography color="textSecondary" gutterBottom variant="body2">
                    תהליכים פעילים
                  </Typography>
                  <Typography variant="h4" component="div" sx={{ color: theme.palette.primary.main, fontWeight: 'bold' }}>
                    {data.overview.activeWorkflows}
                  </Typography>
                </Box>
                <PlayArrow sx={{ color: theme.palette.primary.main, fontSize: 40 }} />
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                <TrendingUp sx={{ color: '#4caf50', mr: 1 }} />
                <Typography variant="body2" sx={{ color: '#4caf50', fontWeight: 'medium' }}>
                  +12%
                </Typography>
                <Typography variant="body2" color="textSecondary" sx={{ ml: 1 }}>
                  לעומת החודש הקודם
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box>
                  <Typography color="textSecondary" gutterBottom variant="body2">
                    הושלמו החודש
                  </Typography>
                  <Typography variant="h4" component="div" sx={{ color: theme.palette.success.main, fontWeight: 'bold' }}>
                    {data.overview.completedWorkflows}
                  </Typography>
                </Box>
                <CheckCircle sx={{ color: theme.palette.success.main, fontSize: 40 }} />
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                <Typography variant="body2" color="textSecondary">
                  ממוצע: {data.overview.averageCompletionTime.toFixed(1)} ימים
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box>
                  <Typography color="textSecondary" gutterBottom variant="body2">
                    אישורים ממתינים
                  </Typography>
                  <Typography variant="h4" component="div" sx={{ color: theme.palette.warning.main, fontWeight: 'bold' }}>
                    {data.overview.pendingApprovals}
                  </Typography>
                </Box>
                <Badge badgeContent={data.overview.pendingApprovals} color="warning">
                  <Notifications sx={{ color: theme.palette.warning.main, fontSize: 40 }} />
                </Badge>
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                <Warning sx={{ color: theme.palette.warning.main, mr: 1 }} />
                <Typography variant="body2" sx={{ color: theme.palette.warning.main, fontWeight: 'medium' }}>
                  דורש תשומת לב
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box>
                  <Typography color="textSecondary" gutterBottom variant="body2">
                    יעילות כללית
                  </Typography>
                  <Typography variant="h4" component="div" sx={{ color: theme.palette.info.main, fontWeight: 'bold' }}>
                    {data.overview.efficiencyScore}%
                  </Typography>
                </Box>
                <TrendingUp sx={{ color: theme.palette.info.main, fontSize: 40 }} />
              </Box>
              
              <Box sx={{ mt: 2 }}>
                <LinearProgress 
                  variant="determinate" 
                  value={data.overview.efficiencyScore} 
                  sx={{ height: 8, borderRadius: 4 }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Main Content Tabs */}
      <Paper sx={{ width: '100%' }}>
        <Tabs value={selectedTab} onChange={handleTabChange} sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tab icon={<Timeline />} label="תהליכים אחרונים" />
          <Tab icon={<Notifications />} label="אישורים ממתינים" />
          <Tab icon={<Schedule />} label="מועדים קרובים" />
          <Tab icon={<TrendingUp />} label="אוטומציה" />
        </Tabs>

        <TabPanel value={selectedTab} index={0}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                תהליכים אחרונים
              </Typography>
              
              <List>
                {data.recentWorkflows.map((workflow) => (
                  <React.Fragment key={workflow.id}>
                    <ListItem>
                      <ListItemIcon>
                        {getStatusIcon(workflow.status)}
                      </ListItemIcon>
                      
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="subtitle1" component="span">
                              {workflow.title}
                            </Typography>
                            <Chip 
                              label={workflow.status} 
                              size="small" 
                              color={getStatusColor(workflow.status) as any}
                            />
                          </Box>
                        }
                        secondary={
                          <Box>
                            <Typography variant="body2" color="textSecondary">
                              התחיל: {formatDate(workflow.startDate)}
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 1 }}>
                              <LinearProgress 
                                variant="determinate" 
                                value={workflow.progress} 
                                sx={{ flexGrow: 1, height: 6, borderRadius: 3 }}
                              />
                              <Typography variant="body2" color="textSecondary">
                                {workflow.progress}%
                              </Typography>
                            </Box>
                          </Box>
                        }
                      />
                      
                      <ListItemSecondaryAction>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <IconButton size="small">
                            <Visibility />
                          </IconButton>
                          <IconButton size="small">
                            <MoreVert />
                          </IconButton>
                        </Box>
                      </ListItemSecondaryAction>
                    </ListItem>
                    <Divider />
                  </React.Fragment>
                ))}
              </List>
            </Grid>
          </Grid>
        </TabPanel>

        <TabPanel value={selectedTab} index={1}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                אישורים ממתינים
              </Typography>
              
              <List>
                {data.pendingApprovals.map((approval) => (
                  <React.Fragment key={approval.id}>
                    <ListItem>
                      <ListItemIcon>
                        <Badge badgeContent={approval.approvers.filter(a => a.status === 'pending').length} color="warning">
                          <Assignment color="warning" />
                        </Badge>
                      </ListItemIcon>
                      
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="subtitle1" component="span">
                              {approval.title}
                            </Typography>
                            <Chip 
                              label={approval.status} 
                              size="small" 
                              color={getApprovalStatusColor(approval.status) as any}
                            />
                          </Box>
                        }
                        secondary={
                          <Box>
                            <Typography variant="body2" color="textSecondary">
                              {approval.description}
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                              מועד אחרון: {formatDate(approval.deadline)}
                            </Typography>
                          </Box>
                        }
                      />
                      
                      <ListItemSecondaryAction>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Button size="small" variant="outlined" color="success">
                            אישור
                          </Button>
                          <Button size="small" variant="outlined" color="error">
                            דחייה
                          </Button>
                        </Box>
                      </ListItemSecondaryAction>
                    </ListItem>
                    <Divider />
                  </React.Fragment>
                ))}
              </List>
            </Grid>
          </Grid>
        </TabPanel>

        <TabPanel value={selectedTab} index={2}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                מועדים קרובים
              </Typography>
              
              <List>
                {data.upcomingDeadlines.map((workflow) => (
                  <React.Fragment key={workflow.id}>
                    <ListItem>
                      <ListItemIcon>
                        <Schedule color="warning" />
                      </ListItemIcon>
                      
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="subtitle1" component="span">
                              {workflow.title}
                            </Typography>
                            <Chip 
                              label="מועד קרוב" 
                              size="small" 
                              color="warning"
                            />
                          </Box>
                        }
                        secondary={
                          <Box>
                            <Typography variant="body2" color="textSecondary">
                              מועד יעד: {workflow.estimatedEndDate ? formatDate(workflow.estimatedEndDate) : 'לא מוגדר'}
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                              התקדמות: {workflow.progress}%
                            </Typography>
                          </Box>
                        }
                      />
                      
                      <ListItemSecondaryAction>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <IconButton size="small">
                            <Visibility />
                          </IconButton>
                          <IconButton size="small">
                            <Edit />
                          </IconButton>
                        </Box>
                      </ListItemSecondaryAction>
                    </ListItem>
                    <Divider />
                  </React.Fragment>
                ))}
              </List>
            </Grid>
          </Grid>
        </TabPanel>

        <TabPanel value={selectedTab} index={3}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardHeader title="סטטיסטיקות אוטומציה" />
                <CardContent>
                  <Box sx={{ mb: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2">כללי התנהגות</Typography>
                      <Typography variant="body2">{data.automationStats.totalRules}</Typography>
                    </Box>
                    <LinearProgress variant="determinate" value={100} sx={{ height: 8, borderRadius: 4 }} />
                  </Box>
                  
                  <Box sx={{ mb: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2">פעילים</Typography>
                      <Typography variant="body2">{data.automationStats.activeRules}</Typography>
                    </Box>
                    <LinearProgress variant="determinate" value={(data.automationStats.activeRules / data.automationStats.totalRules) * 100} sx={{ height: 8, borderRadius: 4 }} />
                  </Box>
                  
                  <Box sx={{ mb: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2">הופעלו היום</Typography>
                      <Typography variant="body2">{data.automationStats.triggersToday}</Typography>
                    </Box>
                    <LinearProgress variant="determinate" value={data.automationStats.successRate} sx={{ height: 8, borderRadius: 4 }} />
                  </Box>
                  
                  <Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2">אחוז הצלחה</Typography>
                      <Typography variant="body2">{data.automationStats.successRate}%</Typography>
                    </Box>
                    <LinearProgress variant="determinate" value={data.automationStats.successRate} sx={{ height: 8, borderRadius: 4 }} />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Card>
                <CardHeader title="מגמות יעילות" />
                <CardContent>
                  <Box sx={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Typography color="textSecondary">
                      גרף מגמות יעילות - כאן יוצג גרף אינטראקטיבי
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>
      </Paper>
    </Container>
  )
}

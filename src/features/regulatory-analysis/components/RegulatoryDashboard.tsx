import React, { useState, useEffect } from 'react'
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  LinearProgress,
  Alert,
  IconButton,
  Tooltip,
  Avatar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
  Tab,
  Tabs,
  Badge,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material'
import {
  Warning,
  Error,
  Info,
  CheckCircle,
  Schedule,
  Gavel,
  TrendingUp,
  TrendingDown,
  Refresh,
  Settings,
  Notifications,
  Assessment,
  Security,
  Update
} from '@mui/icons-material'
import { useTranslation } from 'react-i18next'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { regulatoryAnalysisService } from '../services/regulatoryService'
import { RegulatoryDashboardData, RegulatoryAlert, RegulatoryUpdate } from '../types'

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
      id={`regulatory-tabpanel-${index}`}
      aria-labelledby={`regulatory-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  )
}

export const RegulatoryDashboard: React.FC = () => {
  const { t } = useTranslation()
  const [dashboardData, setDashboardData] = useState<RegulatoryDashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState(0)
  const [selectedAlert, setSelectedAlert] = useState<RegulatoryAlert | null>(null)
  const [alertDialogOpen, setAlertDialogOpen] = useState(false)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      const data = await regulatoryAnalysisService.getDashboardData()
      setDashboardData(data)
    } catch (error) {
      console.error('Error loading dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue)
  }

  const getComplianceColor = (score: number) => {
    if (score >= 80) return 'success'
    if (score >= 60) return 'warning'
    return 'error'
  }

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <Error color="error" />
      case 'error':
        return <Warning color="error" />
      case 'warning':
        return <Warning color="warning" />
      case 'info':
        return <Info color="info" />
      default:
        return <Info />
    }
  }

  const pieColors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7c7c', '#8dd1e1']

  if (loading) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 400 }}>
        <LinearProgress sx={{ width: 200 }} />
      </Box>
    )
  }

  if (!dashboardData) {
    return (
      <Alert severity="error">
        שגיאה בטעינת נתוני הדשבורד
      </Alert>
    )
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* Header */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'between', alignItems: 'center' }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
          מודול ניתוח רגולציה דינמית
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Tooltip title="רענן נתונים">
            <IconButton onClick={loadDashboardData}>
              <Refresh />
            </IconButton>
          </Tooltip>
          <Tooltip title="הגדרות מעקב">
            <IconButton>
              <Settings />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar sx={{ bgcolor: getComplianceColor(dashboardData.overallComplianceScore) + '.main', mr: 2 }}>
                  <Assessment />
                </Avatar>
                <Box>
                  <Typography variant="h6" color="text.secondary">
                    ציון ציות כללי
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                    {dashboardData.overallComplianceScore}%
                  </Typography>
                </Box>
              </Box>
              <LinearProgress
                variant="determinate"
                value={dashboardData.overallComplianceScore}
                color={getComplianceColor(dashboardData.overallComplianceScore)}
                sx={{ mt: 2 }}
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar sx={{ bgcolor: 'error.main', mr: 2 }}>
                  <Badge badgeContent={dashboardData.activeAlerts} color="error">
                    <Notifications />
                  </Badge>
                </Avatar>
                <Box>
                  <Typography variant="h6" color="text.secondary">
                    התראות פעילות
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                    {dashboardData.activeAlerts}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar sx={{ bgcolor: 'warning.main', mr: 2 }}>
                  <Schedule />
                </Avatar>
                <Box>
                  <Typography variant="h6" color="text.secondary">
                    מועדים דחופים
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                    {dashboardData.upcomingDeadlines.urgent}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar sx={{ bgcolor: 'info.main', mr: 2 }}>
                  <Update />
                </Avatar>
                <Box>
                  <Typography variant="h6" color="text.secondary">
                    עדכונים השבוע
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                    {dashboardData.upcomingDeadlines.thisWeek}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabs */}
      <Card>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={activeTab} onChange={handleTabChange} aria-label="regulatory dashboard tabs">
            <Tab label="סקירה כללית" />
            <Tab label="התראות" />
            <Tab label="מגמות ציות" />
            <Tab label="עדכונים רגולטוריים" />
          </Tabs>
        </Box>

        <TabPanel value={activeTab} index={0}>
          <Grid container spacing={3}>
            {/* Compliance by Area */}
            <Grid item xs={12} md={6}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                ציון ציות לפי תחום
              </Typography>
              <Box sx={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={Object.entries(dashboardData.complianceByArea).map(([area, score]) => ({ name: area, value: score }))}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                      label={(props) => `${props.name}: ${props.value || 0}%`}
                    >
                      {Object.entries(dashboardData.complianceByArea).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                      ))}
                    </Pie>
                    <RechartsTooltip />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            </Grid>

            {/* Top Violations */}
            <Grid item xs={12} md={6}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                הפרות נפוצות
              </Typography>
              <List>
                {dashboardData.topViolations.map((violation, index) => (
                  <React.Fragment key={index}>
                    <ListItem>
                      <ListItemIcon>
                        {getSeverityIcon(violation.severity)}
                      </ListItemIcon>
                      <ListItemText
                        primary={violation.type}
                        secondary={`${violation.count} מקרים`}
                      />
                      <ListItemSecondaryAction>
                        <Chip
                          label={violation.severity}
                          color={violation.severity === 'high' ? 'error' : 'warning'}
                          size="small"
                        />
                      </ListItemSecondaryAction>
                    </ListItem>
                    {index < dashboardData.topViolations.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </Grid>
          </Grid>
        </TabPanel>

        <TabPanel value={activeTab} index={1}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            התראות אחרונות
          </Typography>
          <Alert severity="info" sx={{ mb: 2 }}>
            מוצגות התראות מהשבוע האחרון. ניתן לסמן כמטופלות או להגדיר מעקב אוטומטי.
          </Alert>
          {/* Mock alerts */}
          <List>
            <ListItem>
              <ListItemIcon>
                <Error color="error" />
              </ListItemIcon>
              <ListItemText
                primary="הפרת GDPR זוהתה"
                secondary="חוזה #1234 - חסר סעיף הגנת פרטיות"
              />
              <ListItemSecondaryAction>
                <Button size="small" variant="outlined">
                  טפל
                </Button>
              </ListItemSecondaryAction>
            </ListItem>
            <Divider />
            <ListItem>
              <ListItemIcon>
                <Warning color="warning" />
              </ListItemIcon>
              <ListItemText
                primary="מועד יעד מתקרב"
                secondary="חוק הגנת הפרטיות החדש - 30 יום"
              />
              <ListItemSecondaryAction>
                <Button size="small" variant="outlined">
                  הגדר תזכורת
                </Button>
              </ListItemSecondaryAction>
            </ListItem>
          </List>
        </TabPanel>

        <TabPanel value={activeTab} index={2}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            מגמות ציון ציות
          </Typography>
          <Box sx={{ height: 400 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dashboardData.riskTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <RechartsTooltip />
                <Line type="monotone" dataKey="score" stroke="#8884d8" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </Box>
        </TabPanel>

        <TabPanel value={activeTab} index={3}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            עדכונים רגולטוריים אחרונים
          </Typography>
          <List>
            {dashboardData.recentUpdates.map((update, index) => (
              <React.Fragment key={update.id}>
                <ListItem>
                  <ListItemIcon>
                    <Gavel />
                  </ListItemIcon>
                  <ListItemText
                    primary={update.title}
                    secondary={
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          {update.summary}
                        </Typography>
                        <Box sx={{ mt: 1 }}>
                          <Chip label={update.type} size="small" sx={{ mr: 1 }} />
                          <Chip 
                            label={update.urgency} 
                            size="small" 
                            color={update.urgency === 'high' ? 'error' : update.urgency === 'medium' ? 'warning' : 'default'}
                          />
                        </Box>
                      </Box>
                    }
                  />
                  <ListItemSecondaryAction>
                    <Button size="small" variant="outlined">
                      קרא עוד
                    </Button>
                  </ListItemSecondaryAction>
                </ListItem>
                {index < dashboardData.recentUpdates.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        </TabPanel>
      </Card>

      {/* Alert Dialog */}
      <Dialog open={alertDialogOpen} onClose={() => setAlertDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>פרטי התראה</DialogTitle>
        <DialogContent>
          {selectedAlert && (
            <Box>
              <Typography variant="body1" paragraph>
                {selectedAlert.message}
              </Typography>
              <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
                פעולות נדרשות:
              </Typography>
              <List>
                <ListItem>
                  <ListItemText primary="עדכן סעיף הגנת פרטיות" />
                </ListItem>
                <ListItem>
                  <ListItemText primary="הגש לאישור צוות משפטי" />
                </ListItem>
              </List>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAlertDialogOpen(false)}>
            סגור
          </Button>
          <Button variant="contained" onClick={() => setAlertDialogOpen(false)}>
            סמן כטופל
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default RegulatoryDashboard

// דף Dashboard מתקדם - ContractLab Pro
// לוח בקרה מרכזי עם אנליטיקה ותכונות מתקדמות

import React, { useState } from 'react'
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  IconButton,
  useTheme,
  useMediaQuery,
  Tabs,
  Tab,
  Paper,
  Alert,
  LinearProgress,
} from '@mui/material'
import {
  Dashboard as DashboardIcon,
  TrendingUp,
  TrendingDown,
  Speed,
  Visibility,
  TouchApp,
  Error,
  CheckCircle,
  Warning,
  Refresh,
  Settings,
  Analytics,
  Assessment,
  Timeline,
  BarChart,
  PieChart,
  ShowChart,
  Notifications,
  Person,
  Description,
  School,
  Handshake,
  Store,
  Security,
  Gavel,
} from '@mui/icons-material'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { RootState } from '@shared/store'
import AnalyticsDashboard from '../../widgets/AnalyticsDashboard'
import AIAssistant from '../../widgets/AIAssistant'

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
      id={`dashboard-tabpanel-${index}`}
      aria-labelledby={`dashboard-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  )
}

export const DashboardPage: React.FC = () => {
  const { t } = useTranslation()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  
  const [selectedTab, setSelectedTab] = useState(0)
  const [showAIAssistant, setShowAIAssistant] = useState(false)
  
  const { user } = useSelector((state: RootState) => state.auth)

  // נתוני סטטיסטיקה
  const stats = {
    contracts: { total: 156, active: 89, pending: 23, completed: 44 },
    performance: { score: 92, trend: 'up', change: 5 },
    users: { total: 1247, active: 892, new: 45 },
    revenue: { monthly: 125000, growth: 12.5 },
  }

  // פעולות אחרונות
  const recentActions = [
    { id: 1, type: 'contract_created', title: 'חוזה חדש נוצר', time: 'לפני 2 שעות', user: 'עו״ד דוד לוי' },
    { id: 2, type: 'risk_analysis', title: 'ניתוח סיכונים הושלם', time: 'לפני 4 שעות', user: 'עו״ד שרה אברהם' },
    { id: 3, type: 'simulation_completed', title: 'סימולציה הושלמה', time: 'לפני 6 שעות', user: 'עו״ד משה כהן' },
    { id: 4, type: 'contract_signed', title: 'חוזה נחתם', time: 'לפני יום', user: 'עו״ד רותי דוד' },
  ]

  // התראות
  const notifications = [
    { id: 1, type: 'warning', message: '3 חוזים דורשים חתימה', time: 'לפני שעה' },
    { id: 2, type: 'info', message: 'עדכון מערכת זמין', time: 'לפני 3 שעות' },
    { id: 3, type: 'success', message: 'ניתוח סיכונים הושלם בהצלחה', time: 'לפני 5 שעות' },
  ]

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue)
  }

  const getActionIcon = (type: string) => {
    switch (type) {
      case 'contract_created': return <Description color="primary" />
      case 'risk_analysis': return <Assessment color="warning" />
      case 'simulation_completed': return <School color="success" />
      case 'contract_signed': return <CheckCircle color="success" />
      default: return <Timeline color="info" />
    }
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'warning': return <Warning color="warning" />
      case 'info': return <Notifications color="info" />
      case 'success': return <CheckCircle color="success" />
      default: return <Notifications color="primary" />
    }
  }

  return (
    <Container maxWidth="xl" sx={{ py: isMobile ? 2 : 4 }}>
      {/* כותרת */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" component="h1" gutterBottom>
            לוח בקרה
          </Typography>
          <Typography variant="body1" color="text.secondary">
            ברוך הבא, {user?.firstName} {user?.lastName}
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            startIcon={<AIAssistant />}
            onClick={() => setShowAIAssistant(true)}
          >
            עוזר AI
          </Button>
          <IconButton>
            <Settings />
          </IconButton>
        </Box>
      </Box>

      {/* סטטיסטיקות מהירות */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <Description color="primary" />
                <Typography variant="h6">חוזים</Typography>
              </Box>
              <Typography variant="h4" color="primary">
                {stats.contracts.total}
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                <Chip label={`${stats.contracts.active} פעילים`} size="small" color="success" />
                <Chip label={`${stats.contracts.pending} ממתינים`} size="small" color="warning" />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <Speed color="primary" />
                <Typography variant="h6">ביצועים</Typography>
              </Box>
              <Typography variant="h4" color="primary">
                {stats.performance.score}%
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                <TrendingUp color="success" fontSize="small" />
                <Typography variant="body2" color="success.main">
                  +{stats.performance.change}%
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <Person color="primary" />
                <Typography variant="h6">משתמשים</Typography>
              </Box>
              <Typography variant="h4" color="primary">
                {stats.users.total}
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                <Chip label={`${stats.users.active} פעילים`} size="small" color="success" />
                <Chip label={`${stats.users.new} חדשים`} size="small" color="info" />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <TrendingUp color="primary" />
                <Typography variant="h6">הכנסות</Typography>
              </Box>
              <Typography variant="h4" color="primary">
                ₪{(stats.revenue.monthly / 1000).toFixed(0)}K
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                <TrendingUp color="success" fontSize="small" />
                <Typography variant="body2" color="success.main">
                  +{stats.revenue.growth}%
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* טאבים */}
      <Paper sx={{ width: '100%', mb: 3 }}>
        <Tabs
          value={selectedTab}
          onChange={handleTabChange}
          aria-label="dashboard tabs"
          variant={isMobile ? 'scrollable' : 'fullWidth'}
          scrollButtons={isMobile ? 'auto' : false}
        >
          <Tab label="סקירה כללית" />
          <Tab label="אנליטיקה" />
          <Tab label="פעילות אחרונה" />
          <Tab label="התראות" />
        </Tabs>
      </Paper>

      {/* תוכן טאבים */}
      <TabPanel value={selectedTab} index={0}>
        <Grid container spacing={3}>
          {/* גרף ביצועים */}
          <Grid item xs={12} lg={8}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  ביצועי מערכת
                </Typography>
                <Box sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Box sx={{ textAlign: 'center' }}>
                    <ShowChart sx={{ fontSize: 64, color: 'primary.main', mb: 2 }} />
                    <Typography variant="h4" color="primary">
                      {stats.performance.score}%
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      ציון ביצועים כללי
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* התראות מהירות */}
          <Grid item xs={12} lg={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  התראות אחרונות
                </Typography>
                <Box sx={{ maxHeight: 300, overflow: 'auto' }}>
                  {notifications.slice(0, 3).map((notification) => (
                    <Alert
                      key={notification.id}
                      severity={notification.type as any}
                      sx={{ mb: 1 }}
                      action={
                        <Typography variant="caption" color="text.secondary">
                          {notification.time}
                        </Typography>
                      }
                    >
                      {notification.message}
                    </Alert>
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* תכונות מהירות */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              תכונות מהירות
            </Typography>
            <Grid container spacing={2}>
              {[
                { icon: <Description />, title: 'חוזה חדש', color: 'primary', route: '/contracts/new' },
                { icon: <Assessment />, title: 'ניתוח סיכונים', color: 'warning', route: '/risk-analysis' },
                { icon: <School />, title: 'סימולטור', color: 'success', route: '/simulator' },
                { icon: <Handshake />, title: 'מו״מ', color: 'info', route: '/negotiation' },
                { icon: <Store />, title: 'שוק חוזים', color: 'secondary', route: '/marketplace' },
                { icon: <Security />, title: 'אבטחה', color: 'error', route: '/security' },
              ].map((feature, index) => (
                <Grid item xs={6} sm={4} md={2} key={index}>
                  <Card sx={{ textAlign: 'center', cursor: 'pointer' }}>
                    <CardContent>
                      <Box sx={{ color: `${feature.color}.main`, mb: 1 }}>
                        {feature.icon}
                      </Box>
                      <Typography variant="body2">{feature.title}</Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>
      </TabPanel>

      <TabPanel value={selectedTab} index={1}>
        <AnalyticsDashboard />
      </TabPanel>

      <TabPanel value={selectedTab} index={2}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              פעילות אחרונה
            </Typography>
            <Card>
              <CardContent>
                {recentActions.map((action) => (
                  <Box
                    key={action.id}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2,
                      py: 1,
                      borderBottom: '1px solid',
                      borderColor: 'divider',
                      '&:last-child': { borderBottom: 'none' },
                    }}
                  >
                    {getActionIcon(action.type)}
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="body1">{action.title}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {action.user} • {action.time}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>

      <TabPanel value={selectedTab} index={3}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              כל ההתראות
            </Typography>
            <Card>
              <CardContent>
                {notifications.map((notification) => (
                  <Box
                    key={notification.id}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2,
                      py: 1,
                      borderBottom: '1px solid',
                      borderColor: 'divider',
                      '&:last-child': { borderBottom: 'none' },
                    }}
                  >
                    {getNotificationIcon(notification.type)}
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="body1">{notification.message}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {notification.time}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>

      {/* AI Assistant */}
      <AIAssistant
        isOpen={showAIAssistant}
        onToggle={setShowAIAssistant}
        compact={false}
      />
    </Container>
  )
}

export default DashboardPage

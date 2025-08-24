// CRM Page
// דף ניהול קשרי לקוחות משפטי

import React, { useState, useEffect } from 'react'
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  ListItemSecondaryAction,
  Avatar,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  LinearProgress,
  Alert
} from '@mui/material'
import {
  Add,
  People,
  Business,
  Assignment,
  TrendingUp,
  Schedule,
  Phone,
  Email,
  VideoCall,
  Task,
  Note,
  Edit,
  Delete,
  Visibility
} from '@mui/icons-material'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { LoadingSpinner } from '@shared/components/ui/LoadingSpinner'
import type { RootState } from '@shared/store'

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
      id={`crm-tabpanel-${index}`}
      aria-labelledby={`crm-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  )
}

export const CRMPage: React.FC = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  
  const [activeTab, setActiveTab] = useState(0)
  const [showAddClient, setShowAddClient] = useState(false)
  const [showAddLead, setShowAddLead] = useState(false)
  const [showAddActivity, setShowAddActivity] = useState(false)

  // Mock data - במקום אמיתי זה יבוא מה-API
  const dashboardData = {
    totalClients: 45,
    activeClients: 38,
    totalCases: 67,
    openCases: 23,
    totalRevenue: 1250000,
    monthlyRevenue: 85000,
    pendingTasks: 12,
    overdueTasks: 3
  }

  const recentActivities = [
    {
      id: '1',
      type: 'call' as const,
      title: 'שיחת טלפון עם לקוח',
      description: 'דיברתי עם מר כהן לגבי חוזה העבודה',
      relatedTo: { type: 'client' as const, id: '1' },
      assignedTo: 'עו"ד לוי',
      createdAt: '2024-01-15T10:30:00Z'
    },
    {
      id: '2',
      type: 'meeting' as const,
      title: 'פגישה עם לקוח חדש',
      description: 'פגישה עם חברת טכנולוגיה חדשה',
      relatedTo: { type: 'lead' as const, id: '1' },
      assignedTo: 'עו"ד כהן',
      createdAt: '2024-01-15T09:00:00Z'
    },
    {
      id: '3',
      type: 'task' as const,
      title: 'הכנת מסמכים לבית משפט',
      description: 'הכנת כתב תביעה',
      relatedTo: { type: 'case' as const, id: '1' },
      assignedTo: 'עו"ד לוי',
      createdAt: '2024-01-14T16:00:00Z'
    }
  ]

  const clients = [
    {
      id: '1',
      name: 'חברת טכנולוגיה בע"מ',
      type: 'company' as const,
      email: 'info@tech.co.il',
      phone: '03-1234567',
      status: 'active' as const,
      industry: 'טכנולוגיה',
      size: 'medium' as const,
      assignedTo: 'עו"ד לוי',
      revenue: 250000,
      cases: 5
    },
    {
      id: '2',
      name: 'מר דוד כהן',
      type: 'individual' as const,
      email: 'david@email.com',
      phone: '050-1234567',
      status: 'active' as const,
      assignedTo: 'עו"ד כהן',
      revenue: 75000,
      cases: 2
    }
  ]

  const leads = [
    {
      id: '1',
      name: 'חברת בנייה חדשה',
      company: 'בנייה מתקדמת בע"מ',
      email: 'contact@construction.co.il',
      phone: '02-9876543',
      status: 'qualified' as const,
      value: 150000,
      assignedTo: 'עו"ד לוי',
      nextAction: 'שיחת טלפון',
      nextActionDate: '2024-01-20'
    }
  ]

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue)
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'call':
        return <Phone />
      case 'email':
        return <Email />
      case 'meeting':
        return <VideoCall />
      case 'task':
        return <Task />
      case 'note':
        return <Note />
      default:
        return <Note />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
      case 'won':
        return 'success'
      case 'inactive':
      case 'lost':
        return 'error'
      case 'prospect':
      case 'new':
        return 'warning'
      case 'qualified':
        return 'info'
      default:
        return 'default'
    }
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" sx={{ mb: 3 }}>
        {t('crm.title')}
      </Typography>

      {/* Dashboard Overview */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <People sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
                <Box>
                  <Typography variant="h4">{dashboardData.totalClients}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {t('crm.totalClients')}
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
                <Assignment sx={{ fontSize: 40, color: 'secondary.main', mr: 2 }} />
                <Box>
                  <Typography variant="h4">{dashboardData.openCases}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {t('crm.openCases')}
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
                <TrendingUp sx={{ fontSize: 40, color: 'success.main', mr: 2 }} />
                <Box>
                  <Typography variant="h4">
                    ₪{(dashboardData.monthlyRevenue / 1000).toFixed(0)}K
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {t('crm.monthlyRevenue')}
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
                <Schedule sx={{ fontSize: 40, color: 'warning.main', mr: 2 }} />
                <Box>
                  <Typography variant="h4">{dashboardData.pendingTasks}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {t('crm.pendingTasks')}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Main Content */}
      <Paper sx={{ width: '100%' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={activeTab} onChange={handleTabChange}>
            <Tab label={t('crm.dashboard')} />
            <Tab label={t('crm.clients')} />
            <Tab label={t('crm.leads')} />
            <Tab label={t('crm.activities')} />
          </Tabs>
        </Box>

        {/* Dashboard Tab */}
        <TabPanel value={activeTab} index={0}>
          <Grid container spacing={3}>
            {/* Recent Activities */}
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    {t('crm.recentActivities')}
                  </Typography>
                  <List>
                    {recentActivities.map((activity) => (
                      <ListItem key={activity.id} divider>
                        <ListItemAvatar>
                          <Avatar sx={{ bgcolor: 'primary.main' }}>
                            {getActivityIcon(activity.type)}
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={activity.title}
                          secondary={
                            <Box>
                              <Typography variant="body2" color="text.secondary">
                                {activity.description}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {new Date(activity.createdAt).toLocaleDateString('he-IL')} - {activity.assignedTo}
                              </Typography>
                            </Box>
                          }
                        />
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </Card>
            </Grid>

            {/* Top Clients */}
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    {t('crm.topClients')}
                  </Typography>
                  <TableContainer>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>{t('crm.client')}</TableCell>
                          <TableCell>{t('crm.revenue')}</TableCell>
                          <TableCell>{t('crm.cases')}</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {clients.map((client) => (
                          <TableRow key={client.id}>
                            <TableCell>{client.name}</TableCell>
                            <TableCell>₪{client.revenue.toLocaleString()}</TableCell>
                            <TableCell>{client.cases}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Clients Tab */}
        <TabPanel value={activeTab} index={1}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">{t('crm.clients')}</Typography>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => setShowAddClient(true)}
            >
              {t('crm.addClient')}
            </Button>
          </Box>

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>{t('crm.clientName')}</TableCell>
                  <TableCell>{t('crm.type')}</TableCell>
                  <TableCell>{t('crm.status')}</TableCell>
                  <TableCell>{t('crm.assignedTo')}</TableCell>
                  <TableCell>{t('crm.revenue')}</TableCell>
                  <TableCell>{t('crm.actions')}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {clients.map((client) => (
                  <TableRow key={client.id}>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
                          {client.type === 'company' ? <Business /> : <People />}
                        </Avatar>
                        {client.name}
                      </Box>
                    </TableCell>
                    <TableCell>{t(`crm.types.${client.type}`)}</TableCell>
                    <TableCell>
                      <Chip
                        label={t(`crm.statuses.${client.status}`)}
                        color={getStatusColor(client.status) as any}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{client.assignedTo}</TableCell>
                    <TableCell>₪{client.revenue.toLocaleString()}</TableCell>
                    <TableCell>
                      <IconButton size="small">
                        <Visibility />
                      </IconButton>
                      <IconButton size="small">
                        <Edit />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>

        {/* Leads Tab */}
        <TabPanel value={activeTab} index={2}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">{t('crm.leads')}</Typography>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => setShowAddLead(true)}
            >
              {t('crm.addLead')}
            </Button>
          </Box>

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>{t('crm.leadName')}</TableCell>
                  <TableCell>{t('crm.company')}</TableCell>
                  <TableCell>{t('crm.status')}</TableCell>
                  <TableCell>{t('crm.value')}</TableCell>
                  <TableCell>{t('crm.nextAction')}</TableCell>
                  <TableCell>{t('crm.actions')}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {leads.map((lead) => (
                  <TableRow key={lead.id}>
                    <TableCell>{lead.name}</TableCell>
                    <TableCell>{lead.company}</TableCell>
                    <TableCell>
                      <Chip
                        label={t(`crm.leadStatuses.${lead.status}`)}
                        color={getStatusColor(lead.status) as any}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>₪{lead.value.toLocaleString()}</TableCell>
                    <TableCell>{lead.nextAction}</TableCell>
                    <TableCell>
                      <IconButton size="small">
                        <Visibility />
                      </IconButton>
                      <IconButton size="small">
                        <Edit />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>

        {/* Activities Tab */}
        <TabPanel value={activeTab} index={3}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">{t('crm.activities')}</Typography>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => setShowAddActivity(true)}
            >
              {t('crm.addActivity')}
            </Button>
          </Box>

          <List>
            {recentActivities.map((activity) => (
              <ListItem key={activity.id} divider>
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: 'primary.main' }}>
                    {getActivityIcon(activity.type)}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={activity.title}
                  secondary={
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        {activity.description}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {new Date(activity.createdAt).toLocaleDateString('he-IL')} - {activity.assignedTo}
                      </Typography>
                    </Box>
                  }
                />
                <ListItemSecondaryAction>
                  <IconButton size="small">
                    <Edit />
                  </IconButton>
                  <IconButton size="small" color="error">
                    <Delete />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        </TabPanel>
      </Paper>

      {/* Add Client Dialog */}
      <Dialog open={showAddClient} onClose={() => setShowAddClient(false)} maxWidth="md" fullWidth>
        <DialogTitle>{t('crm.addClient')}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <TextField 
                fullWidth 
                label={t('crm.clientName')}
                id="client-name"
                name="client-name"
                autoComplete="name"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel id="client-type-label">{t('crm.type')}</InputLabel>
                <Select
                  labelId="client-type-label"
                  id="client-type"
                  name="client-type"
                >
                  <MenuItem value="individual">{t('crm.types.individual')}</MenuItem>
                  <MenuItem value="company">{t('crm.types.company')}</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField 
                fullWidth 
                label={t('crm.email')} 
                type="email"
                id="client-email"
                name="client-email"
                autoComplete="email"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField 
                fullWidth 
                label={t('crm.phone')}
                id="client-phone"
                name="client-phone"
                autoComplete="tel"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField 
                fullWidth 
                label={t('crm.address')} 
                multiline 
                rows={2}
                id="client-address"
                name="client-address"
                autoComplete="street-address"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowAddClient(false)}>
            {t('common.cancel')}
          </Button>
          <Button variant="contained">
            {t('common.save')}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add Lead Dialog */}
      <Dialog open={showAddLead} onClose={() => setShowAddLead(false)} maxWidth="md" fullWidth>
        <DialogTitle>{t('crm.addLead')}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <TextField 
                fullWidth 
                label={t('crm.leadName')}
                id="lead-name"
                name="lead-name"
                autoComplete="name"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField 
                fullWidth 
                label={t('crm.company')}
                id="lead-company"
                name="lead-company"
                autoComplete="organization"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField 
                fullWidth 
                label={t('crm.email')} 
                type="email"
                id="lead-email"
                name="lead-email"
                autoComplete="email"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField 
                fullWidth 
                label={t('crm.phone')}
                id="lead-phone"
                name="lead-phone"
                autoComplete="tel"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField 
                fullWidth 
                label={t('crm.value')} 
                type="number"
                id="lead-value"
                name="lead-value"
                autoComplete="off"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel id="lead-source-label">{t('crm.source')}</InputLabel>
                <Select
                  labelId="lead-source-label"
                  id="lead-source"
                  name="lead-source"
                >
                  <MenuItem value="website">{t('crm.sources.website')}</MenuItem>
                  <MenuItem value="referral">{t('crm.sources.referral')}</MenuItem>
                  <MenuItem value="social">{t('crm.sources.social')}</MenuItem>
                  <MenuItem value="advertising">{t('crm.sources.advertising')}</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField 
                fullWidth 
                label={t('crm.description')} 
                multiline 
                rows={3}
                id="lead-description"
                name="lead-description"
                autoComplete="off"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowAddLead(false)}>
            {t('common.cancel')}
          </Button>
          <Button variant="contained">
            {t('common.save')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

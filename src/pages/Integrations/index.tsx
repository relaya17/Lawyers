import React, { useState } from 'react'
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,

  Switch,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,

} from '@mui/material'
import {
  Settings,
  Link,
  LinkOff,
  CheckCircle,
  Error,
  Warning,
  Info,
  Refresh,
  Add,
  Edit,

  Payment,
  CalendarToday,
  DocumentScanner,
  AccountBalance,
  Gavel,
  School,
  Store,
  Storage,
  Email
} from '@mui/icons-material'
import { useTranslation } from 'react-i18next'

interface Integration {
  id: string
  name: string
  description: string
  category: 'payment' | 'document' | 'communication' | 'storage' | 'legal' | 'learning' | 'marketplace'
  provider: string
  status: 'connected' | 'disconnected' | 'error' | 'pending'
  isEnabled: boolean
  lastSync?: Date
  config?: {
    apiKey?: string
    webhookUrl?: string
    endpoint?: string
    credentials?: Record<string, unknown>
  }
  features: string[]
  icon: React.ReactNode
}

const IntegrationsPage: React.FC = () => {
  const { t } = useTranslation()
  const [integrations, setIntegrations] = useState<Integration[]>([
    {
      id: '1',
      name: 'Stripe',
      description: 'תשלומים מקוונים ובטח',
      category: 'payment',
      provider: 'Stripe',
      status: 'connected',
      isEnabled: true,
      lastSync: new Date(),
      features: ['תשלומים', 'מנויים', 'החזרים'],
      icon: <Payment />
    },
    {
      id: '2',
      name: 'Dropbox',
      description: 'אחסון מסמכים בענן',
      category: 'storage',
      provider: 'Dropbox',
      status: 'connected',
      isEnabled: true,
      lastSync: new Date(),
      features: ['אחסון', 'שיתוף', 'גיבוי'],
      icon: <Storage />
    },
    {
      id: '3',
      name: 'SendGrid',
      description: 'שליחת אימיילים',
      category: 'communication',
      provider: 'SendGrid',
      status: 'disconnected',
      isEnabled: false,
      features: ['אימיילים', 'תבניות', 'ניתוח'],
      icon: <Email />
    },
    {
      id: '4',
      name: 'Google Calendar',
      description: 'סנכרון לוח שנה',
      category: 'communication',
      provider: 'Google',
      status: 'error',
      isEnabled: false,
      features: ['לוח שנה', 'פגישות', 'תזכורות'],
      icon: <CalendarToday />
    },
    {
      id: '5',
      name: 'DocuSign',
      description: 'חתימה דיגיטלית',
      category: 'document',
      provider: 'DocuSign',
      status: 'pending',
      isEnabled: false,
      features: ['חתימה', 'אימות', 'מעקב'],
      icon: <DocumentScanner />
    },
    {
      id: '6',
      name: 'Bank API',
      description: 'חיבור לבנק',
      category: 'payment',
      provider: 'Bank',
      status: 'disconnected',
      isEnabled: false,
      features: ['חשבונות', 'תנועות', 'תשלומים'],
      icon: <AccountBalance />
    },
    {
      id: '7',
      name: 'Court System',
      description: 'חיבור למערכת בתי המשפט',
      category: 'legal',
      provider: 'Court',
      status: 'connected',
      isEnabled: true,
      lastSync: new Date(),
      features: ['תביעות', 'פסיקות', 'תאריכים'],
      icon: <Gavel />
    },
    {
      id: '8',
      name: 'Learning Platform',
      description: 'פלטפורמת למידה',
      category: 'learning',
      provider: 'Learning',
      status: 'connected',
      isEnabled: true,
      lastSync: new Date(),
      features: ['קורסים', 'הערכות', 'תעודות'],
      icon: <School />
    }
  ])

  const [selectedIntegration, setSelectedIntegration] = useState<Integration | null>(null)
  const [showConfigDialog, setShowConfigDialog] = useState(false)
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [filterCategory, setFilterCategory] = useState<string>('all')
  const [filterStatus, setFilterStatus] = useState<string>('all')

  const categories = [
    { value: 'all', label: 'כל הקטגוריות' },
    { value: 'payment', label: 'תשלומים' },
    { value: 'document', label: 'מסמכים' },
    { value: 'communication', label: 'תקשורת' },
    { value: 'storage', label: 'אחסון' },
    { value: 'legal', label: 'משפטי' },
    { value: 'learning', label: 'למידה' },
    { value: 'marketplace', label: 'שוק' }
  ]

  const statuses = [
    { value: 'all', label: 'כל הסטטוסים' },
    { value: 'connected', label: 'מחובר' },
    { value: 'disconnected', label: 'מנותק' },
    { value: 'error', label: 'שגיאה' },
    { value: 'pending', label: 'ממתין' }
  ]

  const getStatusColor = (status: string): 'success' | 'default' | 'error' | 'warning' => {
    switch (status) {
      case 'connected':
        return 'success'
      case 'disconnected':
        return 'default'
      case 'error':
        return 'error'
      case 'pending':
        return 'warning'
      default:
        return 'default'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected':
        return <CheckCircle />
      case 'disconnected':
        return <LinkOff />
      case 'error':
        return <Error />
      case 'pending':
        return <Warning />
      default:
        return <Info />
    }
  }

  const filteredIntegrations = integrations.filter(integration => {
    const matchesCategory = filterCategory === 'all' || integration.category === filterCategory
    const matchesStatus = filterStatus === 'all' || integration.status === filterStatus
    return matchesCategory && matchesStatus
  })

  const handleToggleIntegration = (integrationId: string) => {
    setIntegrations(prev => prev.map(integration =>
      integration.id === integrationId
        ? { ...integration, isEnabled: !integration.isEnabled }
        : integration
    ))
  }

  const handleConnect = (integration: Integration) => {
    setSelectedIntegration(integration)
    setShowConfigDialog(true)
  }

  const handleDisconnect = (integrationId: string) => {
    setIntegrations(prev => prev.map(integration =>
      integration.id === integrationId
        ? { ...integration, status: 'disconnected', isEnabled: false }
        : integration
    ))
  }

  const handleSync = (integrationId: string) => {
    setIntegrations(prev => prev.map(integration =>
      integration.id === integrationId
        ? { ...integration, lastSync: new Date() }
        : integration
    ))
  }

  const handleSaveConfig = (config: Record<string, unknown>) => {
    if (selectedIntegration) {
      setIntegrations(prev => prev.map(integration =>
        integration.id === selectedIntegration.id
          ? { 
              ...integration, 
              config: { ...integration.config, ...config },
              status: 'connected',
              isEnabled: true 
            }
          : integration
      ))
    }
    setShowConfigDialog(false)
    setSelectedIntegration(null)
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'payment':
        return <Payment />
      case 'document':
        return <DocumentScanner />
      case 'communication':
        return <Email />
      case 'storage':
        return <Storage />
      case 'legal':
        return <Gavel />
      case 'learning':
        return <School />
      case 'marketplace':
        return <Store />
      default:
        return <Settings />
    }
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Settings sx={{ color: 'primary.main' }} />
            <Typography variant="h4" component="h1">
              {t('integrations.title')}
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setShowAddDialog(true)}
          >
            {t('integrations.addIntegration')}
          </Button>
        </Box>
        <Typography variant="body1" color="text.secondary">
          {t('integrations.description')}
        </Typography>
      </Paper>

      {/* Filters */}
      <Paper elevation={2} sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>{t('integrations.filterByCategory')}</InputLabel>
              <Select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                label={t('integrations.filterByCategory')}
              >
                {categories.map(category => (
                  <MenuItem key={category.value} value={category.value}>
                    {category.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>{t('integrations.filterByStatus')}</InputLabel>
              <Select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                label={t('integrations.filterByStatus')}
              >
                {statuses.map(status => (
                  <MenuItem key={status.value} value={status.value}>
                    {status.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="body2" color="text.secondary">
              {t('integrations.showingResults', { count: filteredIntegrations.length })}
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      {/* Integrations Grid */}
      <Grid container spacing={3}>
        {filteredIntegrations.map((integration) => (
          <Grid item xs={12} sm={6} md={4} key={integration.id}>
            <Card elevation={2}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ color: 'primary.main' }}>
                      {integration.icon}
                    </Box>
                    <Typography variant="h6">
                      {integration.name}
                    </Typography>
                  </Box>
                  <Chip
                    icon={getStatusIcon(integration.status)}
                    label={t(`integrations.status.${integration.status}`)}
                    color={getStatusColor(integration.status)}
                    size="small"
                  />
                </Box>

                <Typography variant="body2" color="text.secondary" paragraph>
                  {integration.description}
                </Typography>

                <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                  {integration.features.map((feature, index) => (
                    <Chip
                      key={index}
                      label={feature}
                      size="small"
                      variant="outlined"
                    />
                  ))}
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="caption" color="text.secondary">
                    {t('integrations.provider')}: {integration.provider}
                  </Typography>
                  {integration.lastSync && (
                    <Typography variant="caption" color="text.secondary">
                      {t('integrations.lastSync')}: {integration.lastSync.toLocaleDateString()}
                    </Typography>
                  )}
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <Switch
                    checked={integration.isEnabled}
                    onChange={() => handleToggleIntegration(integration.id)}
                    disabled={integration.status === 'error'}
                  />
                  <Typography variant="body2">
                    {integration.isEnabled ? t('integrations.enabled') : t('integrations.disabled')}
                  </Typography>
                </Box>
              </CardContent>

              <CardActions>
                {integration.status === 'connected' ? (
                  <>
                    <Button
                      size="small"
                      startIcon={<Refresh />}
                      onClick={() => handleSync(integration.id)}
                    >
                      {t('integrations.sync')}
                    </Button>
                    <Button
                      size="small"
                      startIcon={<LinkOff />}
                      onClick={() => handleDisconnect(integration.id)}
                      color="error"
                    >
                      {t('integrations.disconnect')}
                    </Button>
                  </>
                ) : (
                  <Button
                    size="small"
                    startIcon={<Link />}
                    onClick={() => handleConnect(integration)}
                    variant="contained"
                  >
                    {t('integrations.connect')}
                  </Button>
                )}
                <Button
                  size="small"
                  startIcon={<Edit />}
                >
                  {t('integrations.configure')}
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Configuration Dialog */}
      <Dialog open={showConfigDialog} onClose={() => setShowConfigDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          {t('integrations.configureIntegration')}: {selectedIntegration?.name}
        </DialogTitle>
        <DialogContent>
          {selectedIntegration && (
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label={t('integrations.apiKey')}
                  type="password"
                  placeholder="sk_test_..."
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label={t('integrations.webhookUrl')}
                  placeholder="https://your-domain.com/webhook"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label={t('integrations.endpoint')}
                  placeholder="https://api.provider.com/v1"
                />
              </Grid>
              <Grid item xs={12}>
                <Alert severity="info">
                  {t('integrations.configHelp')}
                </Alert>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowConfigDialog(false)}>
            {t('common.cancel')}
          </Button>
          <Button 
            onClick={() => handleSaveConfig({})} 
            variant="contained"
          >
            {t('common.save')}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add Integration Dialog */}
      <Dialog open={showAddDialog} onClose={() => setShowAddDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>{t('integrations.addIntegration')}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>{t('integrations.category')}</InputLabel>
                <Select label={t('integrations.category')}>
                  {categories.slice(1).map(category => (
                    <MenuItem key={category.value} value={category.value}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {getCategoryIcon(category.value)}
                        {category.label}
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label={t('integrations.name')}
                placeholder="שם האינטגרציה"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label={t('integrations.description')}
                placeholder="תיאור האינטגרציה"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label={t('integrations.provider')}
                placeholder="שם הספק"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowAddDialog(false)}>
            {t('common.cancel')}
          </Button>
          <Button variant="contained">
            {t('common.add')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default IntegrationsPage

import React, { useState, useEffect } from 'react'
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  Avatar,
  LinearProgress,
  Tabs,
  Tab,
  Alert,
  Divider,
  Paper,
} from '@mui/material'
import {
  Add,
  Settings,
  Sync,
  CheckCircle,
  Error,
  Warning,
  Info,
  Business,
  Cloud,
  Email,
  Storage,
  TrendingUp,
  Assessment,
  Timeline,
  Link,
  Refresh,
} from '@mui/icons-material'

import { integrationService } from '../services/integrationService'
import {
  Integration,
  IntegrationMetrics,
  SyncResult,
  IntegrationType,
  IntegrationStatus
} from '../types/integrationTypes'

export const IntegrationDashboard: React.FC = () => {
  const [integrations, setIntegrations] = useState<Integration[]>([])
  const [metrics, setMetrics] = useState<IntegrationMetrics | null>(null)
  const [syncHistory, setSyncHistory] = useState<SyncResult[]>([])
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState(0)
  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [selectedIntegrationType, setSelectedIntegrationType] = useState<IntegrationType>('crm')

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      const [integrationsData, metricsData, syncData] = await Promise.all([
        integrationService.getIntegrations(),
        integrationService.getIntegrationMetrics(),
        integrationService.getSyncHistory()
      ])
      
      setIntegrations(integrationsData)
      setMetrics(metricsData)
      setSyncHistory(syncData)
    } catch (error) {
      console.error('Failed to load integration data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSync = async (integrationId?: string) => {
    setLoading(true)
    try {
      if (integrationId) {
        const integration = integrations.find(i => i.id === integrationId)
        if (integration) {
          switch (integration.provider) {
            case 'salesforce':
              await integrationService.syncSalesforceContacts(integrationId)
              break
            case 'sap':
              await integrationService.syncSAPContracts(integrationId)
              break
            case 'office365':
              await integrationService.syncOffice365Calendar(integrationId)
              break
            case 'google':
              await integrationService.syncGoogleDrive(integrationId)
              break
          }
        }
      } else {
        await integrationService.syncAllIntegrations()
      }
      
      await loadData()
    } catch (error) {
      console.error('Sync failed:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status: IntegrationStatus) => {
    switch (status) {
      case 'connected':
        return <CheckCircle color="success" />
      case 'error':
        return <Error color="error" />
      case 'syncing':
        return <Sync color="info" />
      case 'pending':
        return <Warning color="warning" />
      default:
        return <Info color="disabled" />
    }
  }

  const getStatusColor = (status: IntegrationStatus): 'success' | 'error' | 'warning' | 'info' | 'default' => {
    switch (status) {
      case 'connected':
        return 'success'
      case 'error':
        return 'error'
      case 'syncing':
        return 'info'
      case 'pending':
        return 'warning'
      default:
        return 'default'
    }
  }

  const getTypeIcon = (type: IntegrationType) => {
    switch (type) {
      case 'crm':
        return <Business />
      case 'erp':
        return <Assessment />
      case 'email':
        return <Email />
      case 'cloud_storage':
        return <Cloud />
      case 'document_management':
        return <Storage />
      default:
        return <Link />
    }
  }

  const renderMetricsOverview = () => {
    if (!metrics) return null

    return (
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    סה"כ אינטגרציות
                  </Typography>
                  <Typography variant="h4">
                    {metrics.totalIntegrations}
                  </Typography>
                </Box>
                <Link sx={{ fontSize: 40, color: 'primary.main' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    פעילות
                  </Typography>
                  <Typography variant="h4">
                    {metrics.activeIntegrations}
                  </Typography>
                </Box>
                <CheckCircle sx={{ fontSize: 40, color: 'success.main' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    סנכרונים מוצלחים
                  </Typography>
                  <Typography variant="h4">
                    {metrics.successfulSyncs}
                  </Typography>
                </Box>
                <TrendingUp sx={{ fontSize: 40, color: 'success.main' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    זמן סנכרון ממוצע
                  </Typography>
                  <Typography variant="h4">
                    {Math.round(metrics.averageSyncTime / 1000)}s
                  </Typography>
                </Box>
                <Timeline sx={{ fontSize: 40, color: 'info.main' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    )
  }

  const renderIntegrationsList = () => (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">אינטגרציות</Typography>
          <Box>
            <Button
              variant="outlined"
              startIcon={<Refresh />}
              onClick={() => handleSync()}
              disabled={loading}
              sx={{ mr: 1 }}
            >
              סנכרן הכל
            </Button>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => setAddDialogOpen(true)}
            >
              הוסף אינטגרציה
            </Button>
          </Box>
        </Box>

        {loading && <LinearProgress sx={{ mb: 2 }} />}

        <List>
          {integrations.map((integration) => (
            <React.Fragment key={integration.id}>
              <ListItem>
                <ListItemIcon>
                  <Avatar sx={{ bgcolor: 'primary.main' }}>
                    {getTypeIcon(integration.type)}
                  </Avatar>
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="subtitle1">{integration.name}</Typography>
                      <Chip
                        label={integration.status}
                        color={getStatusColor(integration.status)}
                        size="small"
                      />
                    </Box>
                  }
                  secondary={
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        {integration.description}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        סנכרון אחרון: {integration.lastSync > 0 
                          ? new Date(integration.lastSync).toLocaleString('he-IL')
                          : 'מעולם לא'
                        }
                      </Typography>
                    </Box>
                  }
                />
                <ListItemSecondaryAction>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    {getStatusIcon(integration.status)}
                    <IconButton
                      onClick={() => handleSync(integration.id)}
                      disabled={loading}
                    >
                      <Sync />
                    </IconButton>
                    <IconButton>
                      <Settings />
                    </IconButton>
                  </Box>
                </ListItemSecondaryAction>
              </ListItem>
              <Divider />
            </React.Fragment>
          ))}
        </List>
      </CardContent>
    </Card>
  )

  const renderSyncHistory = () => (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          היסטוריית סנכרונים
        </Typography>

        <List>
          {syncHistory.slice(0, 10).map((sync) => {
            const integration = integrations.find(i => i.id === sync.integrationId)
            return (
              <ListItem key={`${sync.integrationId}-${sync.startTime}`}>
                <ListItemIcon>
                  {sync.status === 'success' ? (
                    <CheckCircle color="success" />
                  ) : sync.status === 'error' ? (
                    <Error color="error" />
                  ) : (
                    <Warning color="warning" />
                  )}
                </ListItemIcon>
                <ListItemText
                  primary={integration?.name || 'Unknown Integration'}
                  secondary={
                    <Box>
                      <Typography variant="body2">
                        {sync.recordsProcessed} רשומות עובדו, {sync.recordsCreated} נוצרו, {sync.recordsUpdated} עודכנו
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {new Date(sync.endTime).toLocaleString('he-IL')} • {Math.round(sync.duration / 1000)}s
                      </Typography>
                    </Box>
                  }
                />
              </ListItem>
            )
          })}
        </List>
      </CardContent>
    </Card>
  )

  const integrationTypes = [
    { type: 'crm' as IntegrationType, label: 'CRM', icon: <Business /> },
    { type: 'erp' as IntegrationType, label: 'ERP', icon: <Assessment /> },
    { type: 'email' as IntegrationType, label: 'Email', icon: <Email /> },
    { type: 'cloud_storage' as IntegrationType, label: 'Cloud Storage', icon: <Cloud /> },
    { type: 'document_management' as IntegrationType, label: 'Document Management', icon: <Storage /> }
  ]

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        אינטגרציות חיצוניות
      </Typography>

      <Tabs value={activeTab} onChange={(_, newValue) => setActiveTab(newValue)} sx={{ mb: 3 }}>
        <Tab label="סקירה כללית" />
        <Tab label="אינטגרציות" />
        <Tab label="היסטוריה" />
      </Tabs>

      {activeTab === 0 && (
        <Box>
          {renderMetricsOverview()}
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              {renderIntegrationsList()}
            </Grid>
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    נפח נתונים
                  </Typography>
                  {metrics && (
                    <Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2">אנשי קשר</Typography>
                        <Typography variant="body2">{metrics.dataVolume.contacts}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2">חוזים</Typography>
                        <Typography variant="body2">{metrics.dataVolume.contracts}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2">מסמכים</Typography>
                        <Typography variant="body2">{metrics.dataVolume.documents}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2">אירועים</Typography>
                        <Typography variant="body2">{metrics.dataVolume.events}</Typography>
                      </Box>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      )}

      {activeTab === 1 && renderIntegrationsList()}

      {activeTab === 2 && renderSyncHistory()}

      {/* Add Integration Dialog */}
      <Dialog
        open={addDialogOpen}
        onClose={() => setAddDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>הוספת אינטגרציה חדשה</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            בחר את סוג האינטגרציה שברצונך להוסיף:
          </Typography>
          
          <Grid container spacing={2} sx={{ mt: 1 }}>
            {integrationTypes.map((item) => (
              <Grid item xs={12} sm={6} md={4} key={item.type}>
                <Paper
                  sx={{
                    p: 2,
                    cursor: 'pointer',
                    border: selectedIntegrationType === item.type ? 2 : 1,
                    borderColor: selectedIntegrationType === item.type ? 'primary.main' : 'divider',
                    '&:hover': {
                      bgcolor: 'action.hover'
                    }
                  }}
                  onClick={() => setSelectedIntegrationType(item.type)}
                >
                  <Box sx={{ textAlign: 'center' }}>
                    {item.icon}
                    <Typography variant="subtitle2" sx={{ mt: 1 }}>
                      {item.label}
                    </Typography>
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>

          <Alert severity="info" sx={{ mt: 2 }}>
            אינטגרציות חדשות יצריכו הגדרת אישורים ומפתחות API מתאימים.
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddDialogOpen(false)}>
            ביטול
          </Button>
          <Button variant="contained" onClick={() => setAddDialogOpen(false)}>
            המשך
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

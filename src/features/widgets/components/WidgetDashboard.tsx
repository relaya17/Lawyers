// Widget Dashboard - לוח וידג'טים ראשי
// PWA optimized dashboard component

import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tabs,
  Tab,
  Chip,
  Alert,
  LinearProgress,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Dashboard,
  Settings,
  Add,
  Refresh,
  ViewModule,
  ViewList,
  Fullscreen,
  FullscreenExit,
  Close,
  Widgets,
  Tune,
} from '@mui/icons-material';

import { UrgentContractsWidget } from './UrgentContractsWidget';
import { DailyStatsWidget } from './DailyStatsWidget';
import { QuickActionsWidget } from './QuickActionsWidget';
import { widgetService } from '../services/widgetService';
import { WidgetConfig, WidgetType, WidgetSize, WidgetProviderData } from '../types/widgetTypes';

interface WidgetDashboardProps {
  isFullscreen?: boolean;
  onToggleFullscreen?: () => void;
  onClose?: () => void;
}

export const WidgetDashboard: React.FC<WidgetDashboardProps> = ({
  isFullscreen = false,
  onToggleFullscreen,
  onClose
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isTablet = useMediaQuery(theme.breakpoints.down('lg'));

  const [widgetConfigs, setWidgetConfigs] = useState<WidgetConfig[]>([]);
  const [widgetData, setWidgetData] = useState<WidgetProviderData>({
    urgentContracts: [],
    dailyStats: {
      contractsReviewed: 0,
      contractsExpiringSoon: 0,
      highRiskContracts: 0,
      completedTasks: 0,
      revenue: 0,
      courtCases: 0,
      previousDayChange: {
        contractsReviewed: 0,
        revenue: 0,
        tasks: 0
      }
    },
    quickActions: [],
    recentActivity: [],
    riskAlerts: [],
    courtSchedule: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedTab, setSelectedTab] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Load widget configurations and data
  useEffect(() => {
    loadWidgets();
  }, []);

  const loadWidgets = async () => {
    try {
      setLoading(true);
      setError(null);

      // Load configurations
      const configs = widgetService.getAllConfigs();
      setWidgetConfigs(configs);

      // Load all widget data
      const allData = await widgetService.getAllWidgetData();
      setWidgetData(allData);

      // Subscribe to updates
      widgetService.onUpdate((event) => {
        setWidgetData(prev => ({
          ...prev,
          [event.type]: event.data
        }));
      });

    } catch (err) {
      setError('שגיאה בטעינת הוידג\'טים');
      console.error('Error loading widgets:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleWidgetAction = (widgetType: WidgetType, action: string, payload?: Record<string, unknown>) => {
    console.log('Widget action:', { widgetType, action, payload });
    
    switch (action) {
      case 'refresh':
        refreshWidget(widgetType);
        break;
      case 'contract_click':
        // Navigate to contract
        console.log('Navigate to contract:', payload?.contractId);
        break;
      case 'action_click':
        // Navigate to action
        console.log('Navigate to action:', payload?.route);
        break;
      default:
        console.log('Unknown action:', action);
    }
  };

  const refreshWidget = async (widgetType: WidgetType) => {
    try {
      const data = await widgetService.refreshWidget(widgetType);
      setWidgetData(prev => ({
        ...prev,
        [widgetType]: data
      }));
    } catch (err) {
      console.error('Error refreshing widget:', err);
    }
  };

  const refreshAllWidgets = async () => {
    try {
      setLoading(true);
      const allData = await widgetService.refreshAllWidgets();
      setWidgetData(allData);
    } catch (err) {
      console.error('Error refreshing all widgets:', err);
    } finally {
      setLoading(false);
    }
  };

  const getWidgetComponent = (config: WidgetConfig) => {
    const commonProps = {
      size: config.size,
      config,
              onAction: (action: string, payload?: Record<string, unknown>) => handleWidgetAction(config.type, action, payload),
      isInteractive: true,
      isDarkMode,
    };

    switch (config.type) {
      case 'urgent_contracts':
        return (
          <UrgentContractsWidget
            {...commonProps}
            data={{
              type: 'urgent_contracts',
              data: widgetData.urgentContracts || []
            }}
          />
        );

      case 'daily_stats':
        return (
          <DailyStatsWidget
            {...commonProps}
            data={{
              type: 'daily_stats',
              data: widgetData.dailyStats || {
                contractsReviewed: 0,
                contractsExpiringSoon: 0,
                highRiskContracts: 0,
                completedTasks: 0,
                revenue: 0,
                courtCases: 0,
                previousDayChange: {
                  contractsReviewed: 0,
                  revenue: 0,
                  tasks: 0
                }
              }
            }}
          />
        );

      case 'quick_actions':
        return (
          <QuickActionsWidget
            {...commonProps}
            data={{
              type: 'quick_actions',
              data: widgetData.quickActions || []
            }}
          />
        );

      default:
        return (
          <Card sx={{ p: 2, textAlign: 'center' }}>
            <Typography>וידג'ט לא נתמך: {config.type}</Typography>
          </Card>
        );
    }
  };

  const getGridSize = (widgetSize: WidgetSize) => {
    if (isMobile) {
      return widgetSize === 'large' ? 12 : 6;
    }
    if (isTablet) {
      return widgetSize === 'large' ? 8 : 6;
    }
    return widgetSize === 'large' ? 6 : widgetSize === 'medium' ? 4 : 3;
  };

  if (loading) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <LinearProgress sx={{ mb: 2 }} />
        <Typography>טוען וידג'טים...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ m: 2 }}>
        {error}
        <Button onClick={loadWidgets} sx={{ ml: 2 }}>
          נסה שוב
        </Button>
      </Alert>
    );
  }

  return (
    <Box sx={{ 
      height: isFullscreen ? '100vh' : 'auto',
      bgcolor: isDarkMode ? 'grey.900' : 'background.default',
      color: isDarkMode ? 'white' : 'text.primary'
    }}>
      {/* Header */}
      <Box sx={{ 
        p: 2, 
        borderBottom: '1px solid',
        borderColor: isDarkMode ? 'grey.700' : 'grey.200',
        bgcolor: isDarkMode ? 'grey.800' : 'background.paper'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Dashboard color="primary" />
            <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
              לוח וידג'טים
            </Typography>
            <Chip 
              label={`${widgetConfigs.length} וידג'טים`}
              size="small"
              color="primary"
            />
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}>
              {viewMode === 'grid' ? <ViewList /> : <ViewModule />}
            </IconButton>
            
            <IconButton onClick={refreshAllWidgets}>
              <Refresh />
            </IconButton>
            
            <IconButton onClick={() => setShowSettings(true)}>
              <Settings />
            </IconButton>
            
            {onToggleFullscreen && (
              <IconButton onClick={onToggleFullscreen}>
                {isFullscreen ? <FullscreenExit /> : <Fullscreen />}
              </IconButton>
            )}
            
            {onClose && (
              <IconButton onClick={onClose}>
                <Close />
              </IconButton>
            )}
          </Box>
        </Box>

        {/* Tabs for different widget categories */}
        <Tabs 
          value={selectedTab} 
          onChange={(_, newValue) => setSelectedTab(newValue)}
          sx={{ mt: 2 }}
        >
          <Tab label="כל הוידג'טים" />
          <Tab label="חוזים" />
          <Tab label="סטטיסטיקות" />
          <Tab label="פעולות" />
        </Tabs>
      </Box>

      {/* Widget Grid */}
      <Container maxWidth="xl" sx={{ py: 3 }}>
        <Grid container spacing={3}>
          {widgetConfigs
            .filter(config => {
              if (selectedTab === 0) return true;
              if (selectedTab === 1) return config.type === 'urgent_contracts';
              if (selectedTab === 2) return config.type === 'daily_stats';
              if (selectedTab === 3) return config.type === 'quick_actions';
              return true;
            })
            .map((config) => (
              <Grid 
                item 
                xs={getGridSize(config.size)}
                key={config.id}
                sx={{
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                {getWidgetComponent(config)}
              </Grid>
            ))}
        </Grid>

        {widgetConfigs.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Widgets sx={{ fontSize: 64, color: 'grey.400', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
              אין וידג'טים מוגדרים
            </Typography>
            <Button 
              variant="contained" 
              startIcon={<Add />}
              onClick={() => setShowSettings(true)}
            >
              הוסף וידג'ט
            </Button>
          </Box>
        )}
      </Container>

      {/* Settings Dialog */}
      <Dialog 
        open={showSettings} 
        onClose={() => setShowSettings(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Tune />
            הגדרות וידג'טים
          </Box>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            כאן תוכל להגדיר את הוידג'טים שלך ולהתאים אותם לצרכים שלך.
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
            <Typography>מצב כהה:</Typography>
            <Button
              variant={isDarkMode ? 'contained' : 'outlined'}
              size="small"
              onClick={() => setIsDarkMode(!isDarkMode)}
            >
              {isDarkMode ? 'מופעל' : 'כבוי'}
            </Button>
          </Box>

          <Typography variant="h6" sx={{ mb: 2 }}>
            וידג'טים זמינים:
          </Typography>
          
          <Grid container spacing={2}>
            {[
              { type: 'urgent_contracts', title: 'חוזים דחופים', description: 'מציג חוזים שפוגי תוקף בקרוב' },
              { type: 'daily_stats', title: 'סטטיסטיקות יומיות', description: 'מציג סטטיסטיקות יומיות' },
              { type: 'quick_actions', title: 'פעולות מהירות', description: 'גישה מהירה לפעולות נפוצות' },
            ].map((widget) => (
              <Grid item xs={12} sm={6} md={4} key={widget.type}>
                <Card sx={{ p: 2 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                    {widget.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {widget.description}
                  </Typography>
                  <Button 
                    variant="outlined" 
                    size="small"
                    startIcon={<Add />}
                  >
                    הוסף
                  </Button>
                </Card>
              </Grid>
            ))}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowSettings(false)}>
            סגור
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

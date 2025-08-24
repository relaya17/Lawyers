// Daily Stats Widget - וידג'ט סטטיסטיקות יומיות
// iOS optimized widget component

import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  IconButton,
  Avatar,
  Tooltip,
  LinearProgress,
  Chip,
} from '@mui/material';
import {
  Refresh,
  TrendingUp,
  TrendingDown,
  Description,
  Schedule,
  Warning,
  CheckCircle,
  AttachMoney,
  Gavel,
  Assignment,
  Remove as TrendingFlat,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { WidgetSize, WidgetConfig, DailyStats } from '../types/widgetTypes';

interface DailyStatsWidgetProps {
  size: WidgetSize;
  data: {
    type: 'daily_stats';
    data: DailyStats;
  };
  config: WidgetConfig;
  onAction?: (action: string, payload?: Record<string, unknown>) => void;
  isInteractive?: boolean;
  isDarkMode?: boolean;
}

export const DailyStatsWidget: React.FC<DailyStatsWidgetProps> = ({
  size,
  data,
  config,
  onAction,
  isInteractive = true,
  isDarkMode = false
}) => {
  const { t } = useTranslation();
  const stats = data.data;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('he-IL', {
      style: 'currency',
      currency: 'ILS',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatChange = (current: number, previous: number) => {
    if (previous === 0) return { value: 0, trend: 'flat' as const };
    const change = ((current - previous) / previous) * 100;
    return {
      value: Math.abs(change),
      trend: change > 0 ? 'up' as const : change < 0 ? 'down' as const : 'flat' as const
    };
  };

  const getTrendIcon = (trend: 'up' | 'down' | 'flat') => {
    switch (trend) {
      case 'up': {
        return <TrendingUp sx={{ color: '#4caf50', fontSize: '1rem' }} />;
      }
      case 'down': {
        return <TrendingDown sx={{ color: '#f44336', fontSize: '1rem' }} />;
      }
      case 'flat': {
        return <TrendingFlat sx={{ color: '#9e9e9e', fontSize: '1rem' }} />;
      }
    }
  };

  const getTrendColor = (trend: 'up' | 'down' | 'flat') => {
    switch (trend) {
      case 'up': return '#4caf50';
      case 'down': return '#f44336';
      case 'flat': return '#9e9e9e';
    }
  };

  const handleRefresh = () => {
    if (onAction) {
      onAction('refresh');
    }
  };

  // Small widget - key metrics only
  if (size === 'small') {
    return (
      <Card 
        sx={{ 
          height: 150, 
          bgcolor: isDarkMode ? 'grey.900' : 'background.paper',
          border: isDarkMode ? '1px solid #333' : '1px solid #e0e0e0'
        }}
      >
        <CardContent sx={{ p: 2, height: '100%' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
            <Typography variant="h6" sx={{ fontSize: '0.9rem', fontWeight: 'bold' }}>
              סטטיסטיקות יומיות
            </Typography>
            {isInteractive && (
              <IconButton size="small" onClick={handleRefresh}>
                <Refresh sx={{ fontSize: '1rem' }} />
              </IconButton>
            )}
          </Box>

          <Grid container spacing={1}>
            <Grid item xs={6}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h5" color="primary.main" sx={{ fontWeight: 'bold' }}>
                  {stats.contractsReviewed}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  חוזים נבדקו
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h5" color="warning.main" sx={{ fontWeight: 'bold' }}>
                  {stats.contractsExpiringSoon}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  פגי תוקף
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ textAlign: 'center', mt: 1 }}>
                <Typography variant="h6" color="success.main" sx={{ fontWeight: 'bold' }}>
                  {formatCurrency(stats.revenue)}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  הכנסות היום
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    );
  }

  // Medium widget - detailed stats
  if (size === 'medium') {
    const revenueChange = formatChange(stats.revenue, stats.previousDayChange.revenue);
    const tasksChange = formatChange(stats.completedTasks, stats.previousDayChange.tasks);

    return (
      <Card 
        sx={{ 
          height: 300, 
          bgcolor: isDarkMode ? 'grey.900' : 'background.paper',
          border: isDarkMode ? '1px solid #333' : '1px solid #e0e0e0'
        }}
      >
        <CardContent sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              סטטיסטיקות יומיות
            </Typography>
            {isInteractive && (
              <IconButton size="small" onClick={handleRefresh}>
                <Refresh />
              </IconButton>
            )}
          </Box>

          <Grid container spacing={2} sx={{ flex: 1 }}>
            {/* Revenue */}
            <Grid item xs={12}>
              <Card sx={{ 
                bgcolor: isDarkMode ? 'grey.800' : 'success.50',
                border: `1px solid ${isDarkMode ? '#333' : '#4caf50'}`
              }}>
                <CardContent sx={{ p: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box>
                      <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'success.main' }}>
                        {formatCurrency(stats.revenue)}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        הכנסות היום
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      {getTrendIcon(revenueChange.trend)}
                      <Typography 
                        variant="caption" 
                        sx={{ color: getTrendColor(revenueChange.trend) }}
                      >
                        {revenueChange.value.toFixed(1)}%
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Contracts */}
            <Grid item xs={6}>
              <Box sx={{ textAlign: 'center', p: 1, border: '1px solid', borderColor: 'grey.300', borderRadius: 1 }}>
                <Avatar sx={{ bgcolor: 'primary.main', mx: 'auto', mb: 1, width: 32, height: 32 }}>
                  <Description sx={{ fontSize: '1rem' }} />
                </Avatar>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  {stats.contractsReviewed}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  חוזים נבדקו
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={6}>
              <Box sx={{ textAlign: 'center', p: 1, border: '1px solid', borderColor: 'grey.300', borderRadius: 1 }}>
                <Avatar sx={{ bgcolor: 'warning.main', mx: 'auto', mb: 1, width: 32, height: 32 }}>
                  <Schedule sx={{ fontSize: '1rem' }} />
                </Avatar>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  {stats.contractsExpiringSoon}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  פגי תוקף
                </Typography>
              </Box>
            </Grid>

            {/* Tasks and Court Cases */}
            <Grid item xs={6}>
              <Box sx={{ textAlign: 'center', p: 1, border: '1px solid', borderColor: 'grey.300', borderRadius: 1 }}>
                <Avatar sx={{ bgcolor: 'success.main', mx: 'auto', mb: 1, width: 32, height: 32 }}>
                  <CheckCircle sx={{ fontSize: '1rem' }} />
                </Avatar>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  {stats.completedTasks}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  משימות הושלמו
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={6}>
              <Box sx={{ textAlign: 'center', p: 1, border: '1px solid', borderColor: 'grey.300', borderRadius: 1 }}>
                <Avatar sx={{ bgcolor: 'secondary.main', mx: 'auto', mb: 1, width: 32, height: 32 }}>
                  <Gavel sx={{ fontSize: '1rem' }} />
                </Avatar>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  {stats.courtCases}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  דיונים בבית משפט
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    );
  }

  // Large widget - comprehensive dashboard
  const revenueChange = formatChange(stats.revenue, stats.previousDayChange.revenue);
  const contractsChange = formatChange(stats.contractsReviewed, stats.previousDayChange.contractsReviewed);
  const tasksChange = formatChange(stats.completedTasks, stats.previousDayChange.tasks);

  return (
    <Card 
      sx={{ 
        height: 400, 
        bgcolor: isDarkMode ? 'grey.900' : 'background.paper',
        border: isDarkMode ? '1px solid #333' : '1px solid #e0e0e0'
      }}
    >
      <CardContent sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
            סטטיסטיקות יומיות
          </Typography>
          {isInteractive && (
            <IconButton onClick={handleRefresh}>
              <Refresh />
            </IconButton>
          )}
        </Box>

        {/* Main Revenue Card */}
        <Card sx={{ 
          mb: 3,
          bgcolor: isDarkMode ? 'grey.800' : 'linear-gradient(135deg, #4caf50 0%, #45a049 100%)',
          color: 'white'
        }}>
          <CardContent sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                  {formatCurrency(stats.revenue)}
                </Typography>
                <Typography variant="body1" sx={{ opacity: 0.9 }}>
                  הכנסות היום
                </Typography>
              </Box>
              <Box sx={{ textAlign: 'right' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}>
                  {getTrendIcon(revenueChange.trend)}
                  <Typography variant="h6">
                    {revenueChange.value.toFixed(1)}%
                  </Typography>
                </Box>
                <Typography variant="caption" sx={{ opacity: 0.8 }}>
                  מאתמול
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>

        <Grid container spacing={2} sx={{ flex: 1 }}>
          {/* Contracts Reviewed */}
          <Grid item xs={4}>
            <Card sx={{ 
              height: '100%',
              bgcolor: isDarkMode ? 'grey.800' : 'primary.50',
              border: `1px solid ${isDarkMode ? '#333' : '#2196f3'}`
            }}>
              <CardContent sx={{ p: 2, textAlign: 'center' }}>
                <Avatar sx={{ bgcolor: 'primary.main', mx: 'auto', mb: 1 }}>
                  <Description />
                </Avatar>
                <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                  {stats.contractsReviewed}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  חוזים נבדקו
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
                  {getTrendIcon(contractsChange.trend)}
                  <Typography 
                    variant="caption" 
                    sx={{ color: getTrendColor(contractsChange.trend) }}
                  >
                    {contractsChange.value.toFixed(0)}%
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Expiring Contracts */}
          <Grid item xs={4}>
            <Card sx={{ 
              height: '100%',
              bgcolor: isDarkMode ? 'grey.800' : 'warning.50',
              border: `1px solid ${isDarkMode ? '#333' : '#ff9800'}`
            }}>
              <CardContent sx={{ p: 2, textAlign: 'center' }}>
                <Avatar sx={{ bgcolor: 'warning.main', mx: 'auto', mb: 1 }}>
                  <Warning />
                </Avatar>
                <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'warning.main' }}>
                  {stats.contractsExpiringSoon}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  פגי תוקף בקרוב
                </Typography>
                {stats.highRiskContracts > 0 && (
                  <Chip 
                    label={`${stats.highRiskContracts} סיכון גבוה`}
                    size="small"
                    color="error"
                    sx={{ fontSize: '0.6rem' }}
                  />
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Completed Tasks */}
          <Grid item xs={4}>
            <Card sx={{ 
              height: '100%',
              bgcolor: isDarkMode ? 'grey.800' : 'success.50',
              border: `1px solid ${isDarkMode ? '#333' : '#4caf50'}`
            }}>
              <CardContent sx={{ p: 2, textAlign: 'center' }}>
                <Avatar sx={{ bgcolor: 'success.main', mx: 'auto', mb: 1 }}>
                  <CheckCircle />
                </Avatar>
                <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'success.main' }}>
                  {stats.completedTasks}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  משימות הושלמו
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
                  {getTrendIcon(tasksChange.trend)}
                  <Typography 
                    variant="caption" 
                    sx={{ color: getTrendColor(tasksChange.trend) }}
                  >
                    {tasksChange.value.toFixed(0)}%
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Court Cases */}
          <Grid item xs={12}>
            <Box sx={{ 
              p: 2, 
              border: '1px solid', 
              borderColor: isDarkMode ? 'grey.700' : 'grey.300', 
              borderRadius: 1,
              bgcolor: isDarkMode ? 'grey.800' : 'background.paper'
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Gavel color="secondary" />
                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                  {stats.courtCases} דיונים בבית משפט היום
                </Typography>
              </Box>
              {stats.courtCases > 0 && (
                <LinearProgress 
                  variant="determinate" 
                  value={(stats.courtCases / 5) * 100} 
                  sx={{ mt: 1, height: 6, borderRadius: 3 }}
                />
              )}
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

// Quick Actions Widget - וידג'ט פעולות מהירות
// PWA optimized widget component

import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  IconButton,
  Avatar,
  Badge,
  Tooltip,
  Fab,
  SpeedDial,
  SpeedDialAction,
  SpeedDialIcon,
} from '@mui/material';
import {
  Add,
  Description,
  Assessment,
  Gavel,
  Store,
  Handshake,
  School,
  Security,
  Analytics,
  Settings,
  Refresh,
  OpenInNew,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { WidgetSize, WidgetConfig, QuickAction } from '../types/widgetTypes';

interface QuickActionsWidgetProps {
  size: WidgetSize;
  data: {
    type: 'quick_actions';
    data: QuickAction[];
  };
  config: WidgetConfig;
  onAction?: (action: string, payload?: Record<string, unknown>) => void;
  isInteractive?: boolean;
  isDarkMode?: boolean;
}

export const QuickActionsWidget: React.FC<QuickActionsWidgetProps> = ({
  size,
  data,
  config,
  onAction,
  isInteractive = true,
  isDarkMode = false
}) => {
  const { t } = useTranslation();
  const actions = data.data;

  const getIconComponent = (iconName: string) => {
    const iconMap: Record<string, React.ComponentType<any>> = {
      Description,
      Assessment,
      Gavel,
      Store,
      Handshake,
      School,
      Security,
      Analytics,
      Settings,
    };
    return iconMap[iconName] || Add;
  };

  const handleActionClick = (action: QuickAction) => {
    if (onAction && isInteractive) {
      onAction('action_click', { actionId: action.id, route: action.route });
    }
  };

  const handleRefresh = () => {
    if (onAction) {
      onAction('refresh');
    }
  };

  // Small widget - compact grid
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
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" sx={{ fontSize: '0.9rem', fontWeight: 'bold' }}>
              פעולות מהירות
            </Typography>
            {isInteractive && (
              <IconButton size="small" onClick={handleRefresh}>
                <Refresh sx={{ fontSize: '1rem' }} />
              </IconButton>
            )}
          </Box>

          <Grid container spacing={1}>
            {actions.slice(0, 4).map((action) => {
              const IconComponent = getIconComponent(action.icon);
              return (
                <Grid item xs={6} key={action.id}>
                  <Box
                    sx={{
                      p: 1,
                      textAlign: 'center',
                      border: '1px solid',
                      borderColor: isDarkMode ? 'grey.700' : 'grey.200',
                      borderRadius: 1,
                      cursor: isInteractive ? 'pointer' : 'default',
                      bgcolor: action.isEnabled ? 'transparent' : 'grey.100',
                      opacity: action.isEnabled ? 1 : 0.5,
                      '&:hover': isInteractive && action.isEnabled ? {
                        bgcolor: isDarkMode ? 'grey.800' : 'grey.50',
                        transform: 'scale(1.05)',
                        transition: 'all 0.2s ease-in-out'
                      } : {}
                    }}
                    onClick={() => action.isEnabled && handleActionClick(action)}
                  >
                    <Badge badgeContent={action.badgeCount} color="primary">
                      <Avatar 
                        sx={{ 
                          width: 32, 
                          height: 32, 
                          mx: 'auto', 
                          mb: 0.5,
                          bgcolor: action.color,
                          fontSize: '0.8rem'
                        }}
                      >
                        <IconComponent sx={{ fontSize: '1rem' }} />
                      </Avatar>
                    </Badge>
                    <Typography 
                      variant="caption" 
                      sx={{ 
                        display: 'block',
                        fontWeight: 'bold',
                        fontSize: '0.7rem'
                      }}
                    >
                      {action.title}
                    </Typography>
                  </Box>
                </Grid>
              );
            })}
          </Grid>
        </CardContent>
      </Card>
    );
  }

  // Medium widget - detailed actions
  if (size === 'medium') {
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
              פעולות מהירות ({actions.length})
            </Typography>
            {isInteractive && (
              <IconButton size="small" onClick={handleRefresh}>
                <Refresh />
              </IconButton>
            )}
          </Box>

          <Grid container spacing={2} sx={{ flex: 1 }}>
            {actions.map((action) => {
              const IconComponent = getIconComponent(action.icon);
              return (
                <Grid item xs={6} key={action.id}>
                  <Card
                    sx={{
                      height: '100%',
                      cursor: isInteractive && action.isEnabled ? 'pointer' : 'default',
                      bgcolor: action.isEnabled ? 'transparent' : 'grey.100',
                      opacity: action.isEnabled ? 1 : 0.5,
                      border: '1px solid',
                      borderColor: isDarkMode ? 'grey.700' : 'grey.200',
                      '&:hover': isInteractive && action.isEnabled ? {
                        boxShadow: 3,
                        transform: 'translateY(-2px)',
                        transition: 'all 0.2s ease-in-out'
                      } : {}
                    }}
                    onClick={() => action.isEnabled && handleActionClick(action)}
                  >
                    <CardContent sx={{ p: 2, textAlign: 'center', height: '100%' }}>
                      <Badge badgeContent={action.badgeCount} color="primary">
                        <Avatar 
                          sx={{ 
                            width: 48, 
                            height: 48, 
                            mx: 'auto', 
                            mb: 1,
                            bgcolor: action.color
                          }}
                        >
                          <IconComponent />
                        </Avatar>
                      </Badge>
                      <Typography 
                        variant="subtitle2" 
                        sx={{ 
                          fontWeight: 'bold',
                          mb: 0.5
                        }}
                      >
                        {action.title}
                      </Typography>
                      <Typography 
                        variant="caption" 
                        color="text.secondary"
                        sx={{ 
                          display: 'block',
                          fontSize: '0.7rem'
                        }}
                      >
                        {action.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        </CardContent>
      </Card>
    );
  }

  // Large widget - comprehensive actions with SpeedDial
  return (
    <Card 
      sx={{ 
        height: 400, 
        bgcolor: isDarkMode ? 'grey.900' : 'background.paper',
        border: isDarkMode ? '1px solid #333' : '1px solid #e0e0e0',
        position: 'relative'
      }}
    >
      <CardContent sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
            פעולות מהירות
          </Typography>
          {isInteractive && (
            <IconButton onClick={handleRefresh}>
              <Refresh />
            </IconButton>
          )}
        </Box>

        <Grid container spacing={2} sx={{ flex: 1 }}>
          {actions.map((action) => {
            const IconComponent = getIconComponent(action.icon);
            return (
              <Grid item xs={4} key={action.id}>
                <Card
                  sx={{
                    height: '100%',
                    cursor: isInteractive && action.isEnabled ? 'pointer' : 'default',
                    bgcolor: action.isEnabled ? 'transparent' : 'grey.100',
                    opacity: action.isEnabled ? 1 : 0.5,
                    border: '1px solid',
                    borderColor: isDarkMode ? 'grey.700' : 'grey.200',
                    '&:hover': isInteractive && action.isEnabled ? {
                      boxShadow: 4,
                      transform: 'translateY(-3px)',
                      transition: 'all 0.3s ease-in-out'
                    } : {}
                  }}
                  onClick={() => action.isEnabled && handleActionClick(action)}
                >
                  <CardContent sx={{ p: 2, textAlign: 'center', height: '100%' }}>
                    <Badge badgeContent={action.badgeCount} color="primary">
                      <Avatar 
                        sx={{ 
                          width: 56, 
                          height: 56, 
                          mx: 'auto', 
                          mb: 1.5,
                          bgcolor: action.color,
                          fontSize: '1.5rem'
                        }}
                      >
                        <IconComponent />
                      </Avatar>
                    </Badge>
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        fontWeight: 'bold',
                        mb: 1
                      }}
                    >
                      {action.title}
                    </Typography>
                    <Typography 
                      variant="body2" 
                      color="text.secondary"
                      sx={{ 
                        mb: 2,
                        lineHeight: 1.4
                      }}
                    >
                      {action.description}
                    </Typography>
                    {isInteractive && action.isEnabled && (
                      <IconButton 
                        size="small" 
                        sx={{ 
                          color: action.color,
                          '&:hover': { bgcolor: `${action.color}20` }
                        }}
                      >
                        <OpenInNew />
                      </IconButton>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>

        {/* Floating SpeedDial for quick access */}
        {isInteractive && (
          <SpeedDial
            ariaLabel="פעולות מהירות"
            sx={{ 
              position: 'absolute', 
              bottom: 16, 
              right: 16,
              '& .MuiFab-primary': {
                bgcolor: 'primary.main',
                '&:hover': { bgcolor: 'primary.dark' }
              }
            }}
            icon={<SpeedDialIcon />}
          >
            {actions.slice(0, 6).map((action) => {
              const IconComponent = getIconComponent(action.icon);
              return (
                <SpeedDialAction
                  key={action.id}
                  icon={<IconComponent />}
                  tooltipTitle={action.title}
                  onClick={() => handleActionClick(action)}
                  sx={{
                    bgcolor: action.color,
                    color: 'white',
                    '&:hover': { bgcolor: action.color }
                  }}
                />
              );
            })}
          </SpeedDial>
        )}
      </CardContent>
    </Card>
  );
};

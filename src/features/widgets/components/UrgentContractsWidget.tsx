// Urgent Contracts Widget - וידג'ט חוזים דחופים
// iOS optimized widget component

import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  List,
  ListItem,
  ListItemText,
  Avatar,
  IconButton,
  Tooltip,
  Badge,
  LinearProgress,
} from '@mui/material';
import {
  Warning,
  Error,
  Schedule,
  Person,
  Refresh,
  OpenInNew,
  TrendingUp,
  TrendingDown,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { WidgetSize, WidgetConfig, UrgentContract } from '../types/widgetTypes';

interface UrgentContractsWidgetProps {
  size: WidgetSize;
  data: {
    type: 'urgent_contracts';
    data: UrgentContract[];
  };
  config: WidgetConfig;
  onAction?: (action: string, payload?: Record<string, unknown>) => void;
  isInteractive?: boolean;
  isDarkMode?: boolean;
}

export const UrgentContractsWidget: React.FC<UrgentContractsWidgetProps> = ({
  size,
  data,
  config,
  onAction,
  isInteractive = true,
  isDarkMode = false
}) => {
  const { t } = useTranslation();
  const contracts = data.data;

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'critical': return '#f44336';
      case 'high': return '#ff9800';
      case 'medium': return '#ffeb3b';
      case 'low': return '#4caf50';
      default: return '#9e9e9e';
    }
  };

  const getRiskIcon = (riskLevel: string) => {
    switch (riskLevel) {
      case 'critical': {
        return <Error sx={{ color: '#f44336' }} />;
      }
      case 'high': {
        return <Warning sx={{ color: '#ff9800' }} />;
      }
      default: {
        return <Schedule sx={{ color: '#2196f3' }} />;
      }
    }
  };

  const formatDaysRemaining = (days: number) => {
    if (days === 0) return 'היום';
    if (days === 1) return 'מחר';
    return `${days} ימים`;
  };

  const handleContractClick = (contract: UrgentContract) => {
    if (onAction && isInteractive) {
      onAction('contract_click', { contractId: contract.id });
    }
  };

  const handleRefresh = () => {
    if (onAction) {
      onAction('refresh');
    }
  };

  // Small widget - compact view
  if (size === 'small') {
    const mostUrgent = contracts[0];
    if (!mostUrgent) {
      return (
        <Card 
          sx={{ 
            height: 150, 
            bgcolor: isDarkMode ? 'grey.900' : 'background.paper',
            border: isDarkMode ? '1px solid #333' : '1px solid #e0e0e0'
          }}
        >
          <CardContent sx={{ p: 2, textAlign: 'center', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              אין חוזים דחופים
            </Typography>
          </CardContent>
        </Card>
      );
    }

    return (
      <Card 
        sx={{ 
          height: 150, 
          bgcolor: isDarkMode ? 'grey.900' : 'background.paper',
          border: isDarkMode ? '1px solid #333' : '1px solid #e0e0e0',
          cursor: isInteractive ? 'pointer' : 'default',
          '&:hover': isInteractive ? {
            boxShadow: 3,
            transform: 'translateY(-2px)',
            transition: 'all 0.2s ease-in-out'
          } : {}
        }}
        onClick={() => handleContractClick(mostUrgent)}
      >
        <CardContent sx={{ p: 2, height: '100%' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
            <Typography variant="h6" sx={{ fontSize: '0.9rem', fontWeight: 'bold' }}>
              חוזים דחופים
            </Typography>
            <Badge badgeContent={contracts.length} color="error">
              {getRiskIcon(mostUrgent.riskLevel)}
            </Badge>
          </Box>
          
          <Typography 
            variant="body2" 
            sx={{ 
              fontWeight: 'bold',
              mb: 0.5,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}
          >
            {mostUrgent.title}
          </Typography>
          
          <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
            {mostUrgent.clientName}
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Chip
              label={formatDaysRemaining(mostUrgent.daysRemaining)}
              size="small"
              sx={{
                bgcolor: getRiskColor(mostUrgent.riskLevel),
                color: 'white',
                fontSize: '0.7rem'
              }}
            />
            {contracts.length > 1 && (
              <Typography variant="caption" color="text.secondary">
                +{contracts.length - 1} נוספים
              </Typography>
            )}
          </Box>
        </CardContent>
      </Card>
    );
  }

  // Medium widget - list view
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
              חוזים דחופים ({contracts.length})
            </Typography>
            {isInteractive && (
              <IconButton size="small" onClick={handleRefresh}>
                <Refresh />
              </IconButton>
            )}
          </Box>

          <Box sx={{ flex: 1, overflow: 'auto' }}>
            {contracts.length === 0 ? (
              <Box sx={{ textAlign: 'center', mt: 4 }}>
                <Typography variant="body2" color="text.secondary">
                  אין חוזים דחופים כרגע
                </Typography>
              </Box>
            ) : (
              <List sx={{ p: 0 }}>
                {contracts.slice(0, 4).map((contract, index) => (
                  <ListItem
                    key={contract.id}
                    sx={{
                      p: 1,
                      border: '1px solid',
                      borderColor: isDarkMode ? 'grey.700' : 'grey.200',
                      borderRadius: 1,
                      mb: 1,
                      cursor: isInteractive ? 'pointer' : 'default',
                      '&:hover': isInteractive ? {
                        bgcolor: isDarkMode ? 'grey.800' : 'grey.50'
                      } : {}
                    }}
                    onClick={() => handleContractClick(contract)}
                  >
                    <Avatar 
                      sx={{ 
                        width: 32, 
                        height: 32, 
                        mr: 1.5,
                        bgcolor: getRiskColor(contract.riskLevel)
                      }}
                    >
                      {contract.daysRemaining}
                    </Avatar>
                    <ListItemText
                      primary={
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            fontWeight: 'bold',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }}
                        >
                          {contract.title}
                        </Typography>
                      }
                      secondary={
                        <Typography variant="caption" color="text.secondary">
                          {contract.clientName} • {formatDaysRemaining(contract.daysRemaining)}
                        </Typography>
                      }
                    />
                    {isInteractive && (
                      <IconButton size="small">
                        <OpenInNew sx={{ fontSize: '1rem' }} />
                      </IconButton>
                    )}
                  </ListItem>
                ))}
              </List>
            )}
          </Box>

          {contracts.length > 4 && (
            <Typography 
              variant="caption" 
              color="text.secondary" 
              sx={{ textAlign: 'center', mt: 1 }}
            >
              +{contracts.length - 4} חוזים נוספים
            </Typography>
          )}
        </CardContent>
      </Card>
    );
  }

  // Large widget - detailed view with statistics
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
            חוזים דחופים
          </Typography>
          {isInteractive && (
            <IconButton onClick={handleRefresh}>
              <Refresh />
            </IconButton>
          )}
        </Box>

        {/* Statistics Overview */}
        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
          <Box sx={{ flex: 1, textAlign: 'center', p: 2, border: '1px solid', borderColor: 'grey.300', borderRadius: 1 }}>
            <Typography variant="h4" color="error.main" sx={{ fontWeight: 'bold' }}>
              {contracts.filter(c => c.riskLevel === 'critical').length}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              קריטיים
            </Typography>
          </Box>
          <Box sx={{ flex: 1, textAlign: 'center', p: 2, border: '1px solid', borderColor: 'grey.300', borderRadius: 1 }}>
            <Typography variant="h4" color="warning.main" sx={{ fontWeight: 'bold' }}>
              {contracts.filter(c => c.riskLevel === 'high').length}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              גבוהים
            </Typography>
          </Box>
          <Box sx={{ flex: 1, textAlign: 'center', p: 2, border: '1px solid', borderColor: 'grey.300', borderRadius: 1 }}>
            <Typography variant="h4" color="primary.main" sx={{ fontWeight: 'bold' }}>
              {contracts.length}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              סה"כ
            </Typography>
          </Box>
        </Box>

        <Box sx={{ flex: 1, overflow: 'auto' }}>
          {contracts.length === 0 ? (
            <Box sx={{ textAlign: 'center', mt: 4 }}>
              <Typography variant="body1" color="text.secondary">
                כל החוזים עדכניים! 🎉
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                אין חוזים שפוגי תוקף בקרוב
              </Typography>
            </Box>
          ) : (
            <List sx={{ p: 0 }}>
              {contracts.map((contract) => (
                <ListItem
                  key={contract.id}
                  sx={{
                    p: 2,
                    border: '1px solid',
                    borderColor: isDarkMode ? 'grey.700' : 'grey.200',
                    borderRadius: 2,
                    mb: 2,
                    cursor: isInteractive ? 'pointer' : 'default',
                    '&:hover': isInteractive ? {
                      boxShadow: 2,
                      bgcolor: isDarkMode ? 'grey.800' : 'grey.50'
                    } : {}
                  }}
                  onClick={() => handleContractClick(contract)}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                    <Avatar 
                      sx={{ 
                        width: 40, 
                        height: 40, 
                        mr: 2,
                        bgcolor: getRiskColor(contract.riskLevel)
                      }}
                    >
                      {contract.daysRemaining}
                    </Avatar>
                    
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                        {contract.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        {contract.clientName}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Chip
                          label={formatDaysRemaining(contract.daysRemaining)}
                          size="small"
                          sx={{
                            bgcolor: getRiskColor(contract.riskLevel),
                            color: 'white'
                          }}
                        />
                        <Chip
                          label={contract.riskLevel}
                          size="small"
                          variant="outlined"
                          sx={{ borderColor: getRiskColor(contract.riskLevel) }}
                        />
                      </Box>
                    </Box>

                    {isInteractive && (
                      <IconButton>
                        <OpenInNew />
                      </IconButton>
                    )}
                  </Box>
                </ListItem>
              ))}
            </List>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

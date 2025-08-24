// Risk Indicator Component
// רכיב אינדיקטור סיכון

import React from 'react'
import {
  Box,
  Chip,
  Typography,
  Tooltip,
  LinearProgress,
  Paper,
} from '@mui/material'
import {
  Warning,
  Error,
  CheckCircle,
  Info,
  TrendingUp,
  TrendingDown,
} from '@mui/icons-material'

export enum RiskLevel {
  MINIMAL = 'minimal',
  LOW = 'low',
  MODERATE = 'moderate',
  HIGH = 'high',
  EXTREME = 'extreme',
}

interface RiskIndicatorProps {
  level: RiskLevel
  value?: number // 0-1
  label?: string
  showProgress?: boolean
  showIcon?: boolean
  size?: 'small' | 'medium' | 'large'
  variant?: 'chip' | 'progress' | 'detailed'
  className?: string
}

const riskConfig = {
  [RiskLevel.MINIMAL]: {
    color: '#4caf50',
    bgColor: '#e8f5e8',
    icon: CheckCircle,
    label: 'מינימלי',
    description: 'סיכון נמוך מאוד',
  },
  [RiskLevel.LOW]: {
    color: '#8bc34a',
    bgColor: '#f1f8e9',
    icon: CheckCircle,
    label: 'נמוך',
    description: 'סיכון נמוך',
  },
  [RiskLevel.MODERATE]: {
    color: '#ff9800',
    bgColor: '#fff3e0',
    icon: Warning,
    label: 'בינוני',
    description: 'סיכון בינוני',
  },
  [RiskLevel.HIGH]: {
    color: '#f44336',
    bgColor: '#ffebee',
    icon: Error,
    label: 'גבוה',
    description: 'סיכון גבוה',
  },
  [RiskLevel.EXTREME]: {
    color: '#d32f2f',
    bgColor: '#ffcdd2',
    icon: Error,
    label: 'קיצוני',
    description: 'סיכון קיצוני',
  },
}

export const RiskIndicator: React.FC<RiskIndicatorProps> = ({
  level,
  value,
  label,
  showProgress = false,
  showIcon = true,
  size = 'medium',
  variant = 'chip',
  className,
}) => {
  const config = riskConfig[level]
  const IconComponent = config.icon

  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return { fontSize: '0.75rem', padding: '2px 8px' }
      case 'large':
        return { fontSize: '1.1rem', padding: '8px 16px' }
      default:
        return { fontSize: '0.875rem', padding: '4px 12px' }
    }
  }

  const renderChip = () => (
    <Chip
      icon={showIcon ? <IconComponent /> : undefined}
      label={label || config.label}
      sx={{
        backgroundColor: config.bgColor,
        color: config.color,
        border: `1px solid ${config.color}`,
        fontWeight: 'medium',
        ...getSizeStyles(),
      }}
      className={className}
    />
  )

  const renderProgress = () => (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
        {showIcon && <IconComponent sx={{ color: config.color, mr: 1 }} />}
        <Typography variant="body2" sx={{ color: config.color, fontWeight: 'medium' }}>
          {label || config.label}
        </Typography>
        {value !== undefined && (
          <Typography variant="body2" sx={{ ml: 'auto', color: 'text.secondary' }}>
            {Math.round(value * 100)}%
          </Typography>
        )}
      </Box>
      {value !== undefined && (
        <LinearProgress
          variant="determinate"
          value={value * 100}
          sx={{
            height: 8,
            borderRadius: 4,
            backgroundColor: '#e0e0e0',
            '& .MuiLinearProgress-bar': {
              backgroundColor: config.color,
              borderRadius: 4,
            },
          }}
        />
      )}
    </Box>
  )

  const renderDetailed = () => (
    <Paper
      elevation={1}
      sx={{
        p: 2,
        border: `2px solid ${config.color}`,
        backgroundColor: config.bgColor,
        borderRadius: 2,
      }}
      className={className}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
        {showIcon && <IconComponent sx={{ color: config.color, mr: 1, fontSize: 24 }} />}
        <Typography variant="h6" sx={{ color: config.color, fontWeight: 'bold' }}>
          {label || config.label}
        </Typography>
      </Box>
      
      <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
        {config.description}
      </Typography>
      
      {value !== undefined && (
        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2" color="text.secondary">
              רמת סיכון
            </Typography>
            <Typography variant="body2" sx={{ color: config.color, fontWeight: 'medium' }}>
              {Math.round(value * 100)}%
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={value * 100}
            sx={{
              height: 10,
              borderRadius: 5,
              backgroundColor: '#e0e0e0',
              '& .MuiLinearProgress-bar': {
                backgroundColor: config.color,
                borderRadius: 5,
              },
            }}
          />
        </Box>
      )}
      
      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
        <Chip
          size="small"
          label={`רמה: ${config.label}`}
          sx={{
            backgroundColor: config.color,
            color: 'white',
            fontSize: '0.75rem',
          }}
        />
        <Chip
          size="small"
          label={config.description}
          variant="outlined"
          sx={{
            borderColor: config.color,
            color: config.color,
            fontSize: '0.75rem',
          }}
        />
      </Box>
    </Paper>
  )

  const renderContent = () => {
    switch (variant) {
      case 'progress':
        return renderProgress()
      case 'detailed':
        return renderDetailed()
      default:
        return renderChip()
    }
  }

  return (
    <Tooltip title={config.description} arrow>
      <Box>
        {renderContent()}
      </Box>
    </Tooltip>
  )
}

// Risk Trend Component
interface RiskTrendProps {
  previousValue: number
  currentValue: number
  showPercentage?: boolean
}

export const RiskTrend: React.FC<RiskTrendProps> = ({
  previousValue,
  currentValue,
  showPercentage = true,
}) => {
  const change = currentValue - previousValue
  const percentageChange = previousValue > 0 ? (change / previousValue) * 100 : 0
  
  const isIncreasing = change > 0
  const isDecreasing = change < 0
  const isStable = change === 0

  const getTrendColor = () => {
    if (isIncreasing) return '#f44336'
    if (isDecreasing) return '#4caf50'
    return '#9e9e9e'
  }

  const getTrendIcon = () => {
    if (isIncreasing) return <TrendingUp />
    if (isDecreasing) return <TrendingDown />
    return <Info />
  }

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      {getTrendIcon()}
      <Typography
        variant="body2"
        sx={{
          color: getTrendColor(),
          fontWeight: 'medium',
        }}
      >
        {showPercentage ? `${Math.abs(percentageChange).toFixed(1)}%` : Math.abs(change).toFixed(2)}
      </Typography>
    </Box>
  )
}

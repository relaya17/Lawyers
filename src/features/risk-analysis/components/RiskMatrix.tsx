import React from 'react'
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  Chip,
  Tooltip,
  useTheme
} from '@mui/material'
import {
  Warning,
  Error,
  CheckCircle,
  Info,
  TrendingUp,
  TrendingDown
} from '@mui/icons-material'
import { useTranslation } from 'react-i18next'

interface RiskMatrixProps {
  data: {
    likelihood: number
    impact: number
    riskLevel: 'low' | 'medium' | 'high' | 'critical'
    category: string
    description: string
  }[]
}

const RiskMatrix: React.FC<RiskMatrixProps> = ({ data }) => {
  const { t } = useTranslation()
  const theme = useTheme()

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'low':
        return theme.palette.success.main
      case 'medium':
        return theme.palette.warning.main
      case 'high':
        return theme.palette.error.main
      case 'critical':
        return theme.palette.error.dark
      default:
        return theme.palette.grey[500]
    }
  }

  const getRiskIcon = (level: string) => {
    switch (level) {
      case 'low':
        return <CheckCircle />
      case 'medium':
        return <Warning />
      case 'high':
        return <Error />
      case 'critical':
        return <TrendingUp />
      default:
        return <Info />
    }
  }

  const matrixData = [
    { likelihood: 1, impact: 1, level: 'low' },
    { likelihood: 2, impact: 1, level: 'low' },
    { likelihood: 3, impact: 1, level: 'medium' },
    { likelihood: 4, impact: 1, level: 'medium' },
    { likelihood: 5, impact: 1, level: 'high' },
    { likelihood: 1, impact: 2, level: 'low' },
    { likelihood: 2, impact: 2, level: 'medium' },
    { likelihood: 3, impact: 2, level: 'medium' },
    { likelihood: 4, impact: 2, level: 'high' },
    { likelihood: 5, impact: 2, level: 'high' },
    { likelihood: 1, impact: 3, level: 'medium' },
    { likelihood: 2, impact: 3, level: 'medium' },
    { likelihood: 3, impact: 3, level: 'high' },
    { likelihood: 4, impact: 3, level: 'high' },
    { likelihood: 5, impact: 3, level: 'critical' },
    { likelihood: 1, impact: 4, level: 'medium' },
    { likelihood: 2, impact: 4, level: 'high' },
    { likelihood: 3, impact: 4, level: 'high' },
    { likelihood: 4, impact: 4, level: 'critical' },
    { likelihood: 5, impact: 4, level: 'critical' },
    { likelihood: 1, impact: 5, level: 'high' },
    { likelihood: 2, impact: 5, level: 'high' },
    { likelihood: 3, impact: 5, level: 'critical' },
    { likelihood: 4, impact: 5, level: 'critical' },
    { likelihood: 5, impact: 5, level: 'critical' }
  ]

  const getCellColor = (likelihood: number, impact: number) => {
    const cell = matrixData.find(c => c.likelihood === likelihood && c.impact === impact)
    return cell ? getRiskColor(cell.level) : theme.palette.grey[100]
  }

  const getCellOpacity = (likelihood: number, impact: number) => {
    const cell = matrixData.find(c => c.likelihood === likelihood && c.impact === impact)
    if (!cell) return 0.1
    switch (cell.level) {
      case 'low':
        return 0.3
      case 'medium':
        return 0.5
      case 'high':
        return 0.7
      case 'critical':
        return 0.9
      default:
        return 0.1
    }
  }

  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Typography variant="h5" component="h2" gutterBottom>
        {t('riskAnalysis.riskMatrix.title')}
      </Typography>

      <Grid container spacing={3}>
        {/* Matrix */}
        <Grid item xs={12} md={8}>
          <Box sx={{ position: 'relative' }}>
            {/* Y-axis labels */}
            <Box sx={{ position: 'absolute', left: -60, top: 0, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              {[5, 4, 3, 2, 1].map(impact => (
                <Typography key={impact} variant="body2" sx={{ height: 60, display: 'flex', alignItems: 'center' }}>
                  {t(`riskAnalysis.impact.${impact}`)}
                </Typography>
              ))}
            </Box>

            {/* Matrix Grid */}
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 1, ml: 8 }}>
              {[1, 2, 3, 4, 5].map(likelihood => (
                [1, 2, 3, 4, 5].map(impact => (
                  <Tooltip
                    key={`${likelihood}-${impact}`}
                    title={`${t('riskAnalysis.likelihood')}: ${likelihood}, ${t('riskAnalysis.impact')}: ${impact}`}
                  >
                    <Box
                      sx={{
                        width: 60,
                        height: 60,
                        backgroundColor: getCellColor(likelihood, impact),
                        opacity: getCellOpacity(likelihood, impact),
                        border: '1px solid',
                        borderColor: 'divider',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        '&:hover': {
                          opacity: 1
                        }
                      }}
                    >
                      <Typography variant="caption" sx={{ color: 'white', fontWeight: 'bold' }}>
                        {likelihood}x{impact}
                      </Typography>
                    </Box>
                  </Tooltip>
                ))
              ))}
            </Box>

            {/* X-axis labels */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1, ml: 8 }}>
              {[1, 2, 3, 4, 5].map(likelihood => (
                <Typography key={likelihood} variant="body2" sx={{ width: 60, textAlign: 'center' }}>
                  {t(`riskAnalysis.likelihood.${likelihood}`)}
                </Typography>
              ))}
            </Box>
          </Box>
        </Grid>

        {/* Legend */}
        <Grid item xs={12} md={4}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {t('riskAnalysis.legend')}
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {['low', 'medium', 'high', 'critical'].map(level => (
                  <Box key={level} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box
                      sx={{
                        width: 20,
                        height: 20,
                        backgroundColor: getRiskColor(level),
                        borderRadius: 1
                      }}
                    />
                    <Typography variant="body2">
                      {t(`riskAnalysis.levels.${level}`)}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Risk Items */}
      {data.length > 0 && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6" gutterBottom>
            {t('riskAnalysis.identifiedRisks')}
          </Typography>
          <Grid container spacing={2}>
            {data.map((risk, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card variant="outlined">
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      {getRiskIcon(risk.riskLevel)}
                      <Chip
                        label={t(`riskAnalysis.levels.${risk.riskLevel}`)}
                        size="small"
                        sx={{ backgroundColor: getRiskColor(risk.riskLevel), color: 'white' }}
                      />
                    </Box>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      {risk.category}
                    </Typography>
                    <Typography variant="body2">
                      {risk.description}
                    </Typography>
                    <Box sx={{ mt: 1 }}>
                      <Typography variant="caption" color="text.secondary">
                        {t('riskAnalysis.likelihood')}: {risk.likelihood} | {t('riskAnalysis.impact')}: {risk.impact}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
    </Paper>
  )
}

export default RiskMatrix

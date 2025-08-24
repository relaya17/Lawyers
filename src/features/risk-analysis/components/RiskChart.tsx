import React from 'react'
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  useTheme
} from '@mui/material'
import {
  TrendingUp,
  TrendingDown,
  Assessment,
  Warning,
  CheckCircle,
  Error
} from '@mui/icons-material'
import { useTranslation } from 'react-i18next'

interface RiskChartProps {
  data: {
    riskByCategory: {
      legal: number
      financial: number
      operational: number
      compliance: number
    }
    riskTrend: Array<{
      date: string
      score: number
    }>
    riskDistribution: Array<{
      level: 'low' | 'medium' | 'high' | 'critical'
      count: number
      percentage: number
    }>
  }
}

const RiskChart: React.FC<RiskChartProps> = ({ data }) => {
  const { t } = useTranslation()
  const theme = useTheme()

  const getRiskColor = (level: string): string => {
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
        return <Assessment />
    }
  }

  // Simple bar chart component
  const BarChart = ({ data, title, color }: { data: Record<string, unknown>, title: string, color: string }) => (
    <Box sx={{ height: 200, display: 'flex', flexDirection: 'column' }}>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'end', gap: 1, p: 2 }}>
        {Object.entries(data).map(([key, value]) => (
          <Box key={key} sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Box
              sx={{
                width: '80%',
                height: `${(value as number) * 1.5}px`,
                backgroundColor: color,
                borderRadius: '4px 4px 0 0',
                minHeight: 20
              }}
            />
            <Typography variant="caption" sx={{ mt: 1, textAlign: 'center' }}>
              {t(`riskAnalysis.categories.${key}`)}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {String(value)}%
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  )

  // Simple line chart component
  const LineChart = ({ data, title }: { data: Array<{ date: string; score: number }>, title: string }) => (
    <Box sx={{ height: 200, display: 'flex', flexDirection: 'column' }}>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      <Box sx={{ flexGrow: 1, position: 'relative', p: 2 }}>
        <Box component="svg" width="100%" height="100%" sx={{ position: 'absolute', top: 0, left: 0 }}>
          <polyline
            fill="none"
            stroke={theme.palette.primary.main}
            strokeWidth="2"
            points={data.map((point, index) => 
              `${(index / (data.length - 1)) * 100},${100 - point.score}`
            ).join(' ')}
          />
          {data.map((point, index) => (
            <circle
              key={index}
              cx={`${(index / (data.length - 1)) * 100}%`}
              cy={`${100 - point.score}%`}
              r="3"
              fill={theme.palette.primary.main}
            />
          ))}
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 'auto' }}>
          {data.map((point, index) => (
            <Typography key={index} variant="caption" color="text.secondary">
              {point.date}
            </Typography>
          ))}
        </Box>
      </Box>
    </Box>
  )

  // Simple pie chart component
  const PieChart = ({ data, title }: { data: Array<{ level: 'low' | 'medium' | 'high' | 'critical'; count: number; percentage: number }>, title: string }) => (
    <Box sx={{ height: 200, display: 'flex', flexDirection: 'column' }}>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Box sx={{ position: 'relative', width: 120, height: 120 }}>
          <Box component="svg" width="120" height="120" sx={{ transform: 'rotate(-90deg)' }}>
            {data.map((item, index) => {
              const previousPercentage = data
                .slice(0, index)
                .reduce((sum, d) => sum + d.percentage, 0)
              const startAngle = (previousPercentage / 100) * 360
              const endAngle = ((previousPercentage + item.percentage) / 100) * 360
              
              const x1 = 60 + 50 * Math.cos((startAngle * Math.PI) / 180)
              const y1 = 60 + 50 * Math.sin((startAngle * Math.PI) / 180)
              const x2 = 60 + 50 * Math.cos((endAngle * Math.PI) / 180)
              const y2 = 60 + 50 * Math.sin((endAngle * Math.PI) / 180)
              
              const largeArcFlag = item.percentage > 50 ? 1 : 0
              
              return (
                <path
                  key={index}
                  d={`M 60 60 L ${x1} ${y1} A 50 50 0 ${largeArcFlag} 1 ${x2} ${y2} Z`}
                  fill={getRiskColor(item.level)}
                />
              )
            })}
          </Box>
        </Box>
      </Box>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, justifyContent: 'center' }}>
        {data.map((item, index) => (
          <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Box
              sx={{
                width: 12,
                height: 12,
                backgroundColor: getRiskColor(item.level),
                borderRadius: '50%'
              }}
            />
            <Typography variant="caption">
              {t(`riskAnalysis.levels.${item.level}`)} ({item.percentage}%)
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  )

  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Typography variant="h5" component="h2" gutterBottom>
        {t('riskAnalysis.charts.title')}
      </Typography>

      <Grid container spacing={3}>
        {/* Risk by Category Bar Chart */}
        <Grid item xs={12} md={6}>
          <Card variant="outlined">
            <CardContent>
              <BarChart
                data={data.riskByCategory}
                title={t('riskAnalysis.charts.riskByCategory')}
                color={theme.palette.primary.main}
              />
            </CardContent>
          </Card>
        </Grid>

        {/* Risk Trend Line Chart */}
        <Grid item xs={12} md={6}>
          <Card variant="outlined">
            <CardContent>
              <LineChart
                data={data.riskTrend}
                title={t('riskAnalysis.charts.riskTrend')}
              />
            </CardContent>
          </Card>
        </Grid>

        {/* Risk Distribution Pie Chart */}
        <Grid item xs={12} md={6}>
          <Card variant="outlined">
            <CardContent>
              <PieChart
                data={data.riskDistribution}
                title={t('riskAnalysis.charts.riskDistribution')}
              />
            </CardContent>
          </Card>
        </Grid>

        {/* Summary Statistics */}
        <Grid item xs={12} md={6}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {t('riskAnalysis.charts.summary')}
              </Typography>
              <Grid container spacing={2}>
                {data.riskDistribution.map((item) => (
                  <Grid item xs={6} key={item.level}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {getRiskIcon(item.level)}
                      <Box>
                        <Typography variant="body2">
                          {t(`riskAnalysis.levels.${item.level}`)}
                        </Typography>
                                                 <Typography variant="h6" sx={{ color: getRiskColor(item.level) }}>
                           {item.count.toString()}
                         </Typography>
                      </Box>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Paper>
  )
}

export default RiskChart

// Charts Component
// רכיב גרפים מתקדם

import React from 'react'
import { Box, Paper, Typography, useTheme } from '@mui/material'
import { useTranslation } from 'react-i18next'

interface ChartData {
  labels: string[]
  datasets: Array<{
    label: string
    data: number[]
    backgroundColor?: string | string[]
    borderColor?: string | string[]
    borderWidth?: number
    fill?: boolean
  }>
}

interface ChartProps {
  type: 'line' | 'bar' | 'pie' | 'doughnut' | 'radar' | 'polarArea'
  data: ChartData
  title?: string
  height?: number
  width?: number
  options?: Record<string, unknown>
}

export const Chart: React.FC<ChartProps> = ({
  type,
  data,
  title,
  height = 300,
  width = '100%'
}) => {
  const theme = useTheme()
  const { t } = useTranslation()

  // Mock chart rendering - in real app would use Chart.js or similar
  const renderChart = () => {
    const defaultColors = [
      theme.palette.primary.main,
      theme.palette.secondary.main,
      theme.palette.success.main,
      theme.palette.warning.main,
      theme.palette.error.main,
    ]

    switch (type) {
      case 'line':
        return (
          <Box sx={{ height, width, position: 'relative' }}>
            <svg width="100%" height="100%" viewBox="0 0 400 200">
              {data.datasets.map((dataset, index) => {
                const color = dataset.borderColor || defaultColors[index % defaultColors.length]
                const points = dataset.data.map((value, i) => {
                  const x = (i / (data.labels.length - 1)) * 350 + 25
                  const y = 175 - (value / Math.max(...dataset.data)) * 150
                  return `${x},${y}`
                }).join(' ')
                
                return (
                  <g key={index}>
                    <polyline
                      fill="none"
                      stroke={color as string}
                      strokeWidth="2"
                      points={points}
                    />
                    {dataset.data.map((value, i) => {
                      const x = (i / (data.labels.length - 1)) * 350 + 25
                      const y = 175 - (value / Math.max(...dataset.data)) * 150
                      return (
                        <circle
                          key={i}
                          cx={x}
                          cy={y}
                          r="3"
                          fill={color as string}
                        />
                      )
                    })}
                  </g>
                )
              })}
            </svg>
          </Box>
        )

      case 'bar':
        return (
          <Box sx={{ height, width, position: 'relative' }}>
            <svg width="100%" height="100%" viewBox="0 0 400 200">
              {data.datasets.map((dataset, datasetIndex) => {
                const color = dataset.backgroundColor || defaultColors[datasetIndex % defaultColors.length]
                const barWidth = 300 / data.labels.length / data.datasets.length
                
                return dataset.data.map((value, index) => {
                  const x = (index / data.labels.length) * 300 + 50 + (datasetIndex * barWidth)
                  const height = (value / Math.max(...dataset.data)) * 150
                  const y = 175 - height
                  
                  return (
                    <rect
                      key={`${datasetIndex}-${index}`}
                      x={x}
                      y={y}
                      width={barWidth - 2}
                      height={height}
                      fill={color as string}
                    />
                  )
                })
              })}
            </svg>
          </Box>
        )

      case 'pie':
        return (
          <Box sx={{ height, width, position: 'relative' }}>
            <svg width="100%" height="100%" viewBox="0 0 200 200">
              {data.datasets[0]?.data.map((value, index) => {
                const total = data.datasets[0].data.reduce((sum, val) => sum + val, 0)
                const percentage = value / total
                const angle = percentage * 2 * Math.PI
                const startAngle = data.datasets[0].data
                  .slice(0, index)
                  .reduce((sum, val) => sum + (val / total) * 2 * Math.PI, 0)
                
                const x1 = 100 + 80 * Math.cos(startAngle)
                const y1 = 100 + 80 * Math.sin(startAngle)
                const x2 = 100 + 80 * Math.cos(startAngle + angle)
                const y2 = 100 + 80 * Math.sin(startAngle + angle)
                
                const largeArcFlag = angle > Math.PI ? 1 : 0
                
                const color = defaultColors[index % defaultColors.length]
                
                return (
                  <path
                    key={index}
                    d={`M 100 100 L ${x1} ${y1} A 80 80 0 ${largeArcFlag} 1 ${x2} ${y2} Z`}
                    fill={color as string}
                  />
                )
              })}
            </svg>
          </Box>
        )

      default:
        return (
          <Box sx={{ height, width, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Typography variant="body2" color="textSecondary">
              {t('charts.notImplemented')}
            </Typography>
          </Box>
        )
    }
  }

  return (
    <Paper elevation={1} sx={{ p: 2 }}>
      {title && (
        <Typography variant="h6" gutterBottom>
          {title}
        </Typography>
      )}
      {renderChart()}
    </Paper>
  )
}

// Specialized chart components
export const LineChart: React.FC<Omit<ChartProps, 'type'>> = (props) => (
  <Chart type="line" {...props} />
)

export const BarChart: React.FC<Omit<ChartProps, 'type'>> = (props) => (
  <Chart type="bar" {...props} />
)

export const PieChart: React.FC<Omit<ChartProps, 'type'>> = (props) => (
  <Chart type="pie" {...props} />
)

export const DoughnutChart: React.FC<Omit<ChartProps, 'type'>> = (props) => (
  <Chart type="doughnut" {...props} />
)

export default Chart

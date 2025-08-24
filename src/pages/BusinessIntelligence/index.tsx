// Business Intelligence Page
// דף מודיעין עסקי

import React, { useState, useEffect } from 'react'
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  Card,
  CardContent,
  CardHeader,
  IconButton,
  Chip,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Tabs,
  Tab,
  Alert,
} from '@mui/material'
import {
  TrendingUp,
  TrendingDown,
  Assessment,
  Business,
  Analytics,
  Refresh,
  Download,
  FilterList,
  MoreVert,
  BarChart,
  PieChart,
  ShowChart,
  TableChart,
} from '@mui/icons-material'
import { useTranslation } from 'react-i18next'

interface DashboardMetric {
  id: string
  title: string
  value: number
  change: number
  changeType: 'increase' | 'decrease' | 'stable'
  unit: string
  icon: React.ComponentType
  color: string
}

interface ChartData {
  labels: string[]
  datasets: {
    label: string
    data: number[]
    backgroundColor?: string[]
    borderColor?: string
    fill?: boolean
  }[]
}

interface TableData {
  id: string
  name: string
  value: number
  change: number
  status: 'active' | 'inactive' | 'pending'
}

const BusinessIntelligencePage: React.FC = () => {
  const { t } = useTranslation()
  const [activeTab, setActiveTab] = useState(0)
  const [timeRange, setTimeRange] = useState('30d')
  const [loading, setLoading] = useState(false)

  // Mock data - in real app this would come from API
  const [metrics] = useState<DashboardMetric[]>([
    {
      id: 'revenue',
      title: 'הכנסות',
      value: 1250000,
      change: 12.5,
      changeType: 'increase',
      unit: '₪',
      icon: TrendingUp,
      color: '#4caf50',
    },
    {
      id: 'contracts',
      title: 'חוזים פעילים',
      value: 156,
      change: -3.2,
      changeType: 'decrease',
      unit: '',
      icon: Assessment,
      color: '#2196f3',
    },
    {
      id: 'clients',
      title: 'לקוחות פעילים',
      value: 89,
      change: 8.7,
      changeType: 'increase',
      unit: '',
      icon: Business,
      color: '#ff9800',
    },
    {
      id: 'efficiency',
      title: 'יעילות ממוצעת',
      value: 87.3,
      change: 2.1,
      changeType: 'increase',
      unit: '%',
      icon: Analytics,
      color: '#9c27b0',
    },
  ])

  const [chartData] = useState<ChartData>({
    labels: ['ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני'],
    datasets: [
      {
        label: 'הכנסות',
        data: [1200000, 1350000, 1180000, 1420000, 1380000, 1250000],
        borderColor: '#4caf50',
        fill: false,
      },
      {
        label: 'הוצאות',
        data: [980000, 1050000, 920000, 1180000, 1120000, 1020000],
        borderColor: '#f44336',
        fill: false,
      },
    ],
  })

  const [tableData] = useState<TableData[]>([
    { id: '1', name: 'חוזה שכירות', value: 450000, change: 15.2, status: 'active' },
    { id: '2', name: 'חוזה עבודה', value: 320000, change: -5.8, status: 'active' },
    { id: '3', name: 'חוזה מכר', value: 280000, change: 22.1, status: 'pending' },
    { id: '4', name: 'חוזה שירותים', value: 200000, change: 8.4, status: 'active' },
    { id: '5', name: 'חוזה רישוי', value: 150000, change: -12.3, status: 'inactive' },
  ])

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue)
  }

  const handleRefresh = () => {
    setLoading(true)
    // Simulate API call
    setTimeout(() => {
      setLoading(false)
    }, 2000)
  }

  const handleExport = () => {
    // Export functionality
    console.log('Exporting data...')
  }

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`
    }
    return num.toString()
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return '#4caf50'
      case 'inactive':
        return '#f44336'
      case 'pending':
        return '#ff9800'
      default:
        return '#9e9e9e'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active':
        return 'פעיל'
      case 'inactive':
        return 'לא פעיל'
      case 'pending':
        return 'ממתין'
      default:
        return 'לא ידוע'
    }
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            {t('businessIntelligence.title')}
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 2 }}>
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>טווח זמן</InputLabel>
              <Select
                value={timeRange}
                label="טווח זמן"
                onChange={(e) => setTimeRange(e.target.value)}
              >
                <MenuItem value="7d">7 ימים</MenuItem>
                <MenuItem value="30d">30 ימים</MenuItem>
                <MenuItem value="90d">90 ימים</MenuItem>
                <MenuItem value="1y">שנה</MenuItem>
              </Select>
            </FormControl>
            
            <Button
              variant="outlined"
              startIcon={<Refresh />}
              onClick={handleRefresh}
              disabled={loading}
            >
              רענן
            </Button>
            
            <Button
              variant="contained"
              startIcon={<Download />}
              onClick={handleExport}
            >
              ייצא
            </Button>
          </Box>
        </Box>

        <Alert severity="info" sx={{ mb: 3 }}>
          נתונים מתעדכנים בזמן אמת. הנתונים המוצגים הם נכון לרגע זה.
        </Alert>
      </Box>

      {/* Metrics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {metrics.map((metric) => {
          const IconComponent = metric.icon
          return (
            <Grid item xs={12} sm={6} md={3} key={metric.id}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Box>
                      <Typography color="textSecondary" gutterBottom variant="body2">
                        {metric.title}
                      </Typography>
                      <Typography variant="h4" component="div" sx={{ color: metric.color, fontWeight: 'bold' }}>
                        {formatNumber(metric.value)}{metric.unit}
                      </Typography>
                    </Box>
                    {React.createElement(metric.icon as any, { sx: { color: metric.color, fontSize: 40 } })}
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                    {metric.changeType === 'increase' ? (
                      <TrendingUp sx={{ color: '#4caf50', mr: 1 }} />
                    ) : metric.changeType === 'decrease' ? (
                      <TrendingDown sx={{ color: '#f44336', mr: 1 }} />
                    ) : null}
                    <Typography
                      variant="body2"
                      sx={{
                        color: metric.changeType === 'increase' ? '#4caf50' : 
                               metric.changeType === 'decrease' ? '#f44336' : '#9e9e9e',
                        fontWeight: 'medium',
                      }}
                    >
                      {metric.change > 0 ? '+' : ''}{metric.change}%
                    </Typography>
                    <Typography variant="body2" color="textSecondary" sx={{ ml: 1 }}>
                      לעומת החודש הקודם
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          )
        })}
      </Grid>

      {/* Charts and Tables */}
      <Paper sx={{ width: '100%' }}>
        <Tabs value={activeTab} onChange={handleTabChange} sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tab icon={<ShowChart />} label="גרפים" />
          <Tab icon={<TableChart />} label="טבלאות" />
          <Tab icon={<BarChart />} label="ניתוח" />
        </Tabs>

        <Box sx={{ p: 3 }}>
          {activeTab === 0 && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={8}>
                <Card>
                  <CardHeader
                    title="הכנסות והוצאות"
                    action={
                      <IconButton>
                        <MoreVert />
                      </IconButton>
                    }
                  />
                  <CardContent>
                    <Box sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Typography color="textSecondary">
                        גרף הכנסות והוצאות - כאן יוצג גרף אינטראקטיבי
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <Card>
                  <CardHeader title="התפלגות חוזים" />
                  <CardContent>
                    <Box sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Typography color="textSecondary">
                        גרף עוגה - התפלגות סוגי חוזים
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          )}

          {activeTab === 1 && (
            <Card>
              <CardHeader
                title="חוזים לפי קטגוריה"
                action={
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button size="small" startIcon={<FilterList />}>
                      סינון
                    </Button>
                    <Button size="small" startIcon={<Download />}>
                      ייצא
                    </Button>
                  </Box>
                }
              />
              <CardContent>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>שם החוזה</TableCell>
                        <TableCell align="right">ערך</TableCell>
                        <TableCell align="right">שינוי</TableCell>
                        <TableCell align="right">סטטוס</TableCell>
                        <TableCell align="right">פעולות</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {tableData.map((row) => (
                        <TableRow key={row.id}>
                          <TableCell>{row.name}</TableCell>
                          <TableCell align="right">
                            {formatNumber(row.value)} ₪
                          </TableCell>
                          <TableCell align="right">
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                              {row.change > 0 ? (
                                <TrendingUp sx={{ color: '#4caf50', mr: 1, fontSize: 16 }} />
                              ) : (
                                <TrendingDown sx={{ color: '#f44336', mr: 1, fontSize: 16 }} />
                              )}
                              <Typography
                                variant="body2"
                                sx={{
                                  color: row.change > 0 ? '#4caf50' : '#f44336',
                                  fontWeight: 'medium',
                                }}
                              >
                                {row.change > 0 ? '+' : ''}{row.change}%
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell align="right">
                            <Chip
                              label={getStatusLabel(row.status)}
                              size="small"
                              sx={{
                                backgroundColor: getStatusColor(row.status),
                                color: 'white',
                              }}
                            />
                          </TableCell>
                          <TableCell align="right">
                            <IconButton size="small">
                              <MoreVert />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          )}

          {activeTab === 2 && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardHeader title="יעילות תהליכים" />
                  <CardContent>
                    <Box sx={{ mb: 3 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2">ניתוח חוזים</Typography>
                        <Typography variant="body2">87%</Typography>
                      </Box>
                      <LinearProgress variant="determinate" value={87} sx={{ height: 8, borderRadius: 4 }} />
                    </Box>
                    
                    <Box sx={{ mb: 3 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2">אישור חוזים</Typography>
                        <Typography variant="body2">92%</Typography>
                      </Box>
                      <LinearProgress variant="determinate" value={92} sx={{ height: 8, borderRadius: 4 }} />
                    </Box>
                    
                    <Box sx={{ mb: 3 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2">מעקב תשלומים</Typography>
                        <Typography variant="body2">78%</Typography>
                      </Box>
                      <LinearProgress variant="determinate" value={78} sx={{ height: 8, borderRadius: 4 }} />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Card>
                  <CardHeader title="תחזיות" />
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      תחזית הכנסות לחודש הבא
                    </Typography>
                    <Typography variant="h4" sx={{ color: '#4caf50', fontWeight: 'bold', mb: 2 }}>
                      1,450,000 ₪
                    </Typography>
                    <Typography variant="body2" color="textSecondary" gutterBottom>
                      צפי עלייה של 16% לעומת החודש הנוכחי
                    </Typography>
                    
                    <Box sx={{ mt: 3 }}>
                      <Typography variant="h6" gutterBottom>
                        יעדים
                      </Typography>
                      <Box sx={{ mb: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography variant="body2">יעד חודשי</Typography>
                          <Typography variant="body2">1,500,000 ₪</Typography>
                        </Box>
                        <LinearProgress variant="determinate" value={83} sx={{ height: 8, borderRadius: 4 }} />
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          )}
        </Box>
      </Paper>
    </Container>
  )
}

export default BusinessIntelligencePage

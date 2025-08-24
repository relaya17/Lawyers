// לוח אנליטיקה מתקדם - ContractLab Pro
// ויזואליזציה של מדדי ביצועים ונתוני משתמש

import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  LinearProgress,
  IconButton,
  Menu,
  MenuItem,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Tabs,
  Tab,
  Divider,
  Alert,
  Tooltip,
  CircularProgress,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  Assessment,
  Timeline,
  BarChart,
  PieChart,
  ShowChart,
  Refresh,
  MoreVert,
  Visibility,
  Download,
  Share,
  Warning,
  CheckCircle,
  Error,
  Info,
  Business,
  School,
  Handshake,
  Store,
  Security,
  Description,
  People,
  AttachMoney,
  Speed,
  Psychology,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { analyticsService } from '@shared/services/analytics';

interface AnalyticsData {
  overview: {
    totalContracts: number;
    activeContracts: number;
    pendingContracts: number;
    completedContracts: number;
    riskScore: number;
    userEngagement: number;
    systemPerformance: number;
    revenue: number;
  };
  trends: {
    contractsCreated: number[];
    contractsSigned: number[];
    riskAnalysis: number[];
    userActivity: number[];
    dates: string[];
  };
  performance: {
    pageLoadTime: number;
    apiResponseTime: number;
    errorRate: number;
    uptime: number;
    userSatisfaction: number;
  };
  userBehavior: {
    mostUsedFeatures: Array<{ name: string; usage: number; trend: 'up' | 'down' }>;
    sessionDuration: number;
    bounceRate: number;
    conversionRate: number;
    topPages: Array<{ name: string; visits: number; timeOnPage: number }>;
  };
  contracts: {
    byType: Array<{ type: string; count: number; percentage: number }>;
    byStatus: Array<{ status: string; count: number; percentage: number }>;
    byRisk: Array<{ risk: string; count: number; percentage: number }>;
    recentActivity: Array<{ id: string; title: string; action: string; user: string; time: string }>;
  };
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`analytics-tabpanel-${index}`}
      aria-labelledby={`analytics-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

export const AnalyticsDashboard: React.FC = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTab, setSelectedTab] = useState(0);
  const [timeRange, setTimeRange] = useState('7d');
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  useEffect(() => {
    loadAnalyticsData();
  }, [timeRange]);

  const loadAnalyticsData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Mock data - במקום אמיתי זה יהיה API call
      const mockData: AnalyticsData = {
        overview: {
          totalContracts: 1247,
          activeContracts: 892,
          pendingContracts: 156,
          completedContracts: 199,
          riskScore: 78,
          userEngagement: 92,
          systemPerformance: 98,
          revenue: 125000,
        },
        trends: {
          contractsCreated: [12, 19, 15, 25, 22, 30, 28],
          contractsSigned: [8, 15, 12, 20, 18, 25, 22],
          riskAnalysis: [45, 52, 48, 60, 55, 68, 65],
          userActivity: [120, 135, 128, 150, 142, 165, 158],
          dates: ['יום א', 'יום ב', 'יום ג', 'יום ד', 'יום ה', 'יום ו', 'שבת'],
        },
        performance: {
          pageLoadTime: 1.2,
          apiResponseTime: 0.8,
          errorRate: 0.5,
          uptime: 99.8,
          userSatisfaction: 4.6,
        },
        userBehavior: {
          mostUsedFeatures: [
            { name: 'ניהול חוזים', usage: 85, trend: 'up' },
            { name: 'ניתוח סיכונים', usage: 72, trend: 'up' },
            { name: 'סימולטור', usage: 68, trend: 'down' },
            { name: 'מו״מ', usage: 55, trend: 'up' },
            { name: 'שוק תבניות', usage: 48, trend: 'up' },
          ],
          sessionDuration: 12.5,
          bounceRate: 23,
          conversionRate: 8.5,
          topPages: [
            { name: 'דף הבית', visits: 1247, timeOnPage: 2.3 },
            { name: 'חוזים', visits: 892, timeOnPage: 8.7 },
            { name: 'ניתוח סיכונים', visits: 456, timeOnPage: 5.2 },
            { name: 'סימולטור', visits: 234, timeOnPage: 15.8 },
            { name: 'מו״מ', visits: 189, timeOnPage: 12.4 },
          ],
        },
        contracts: {
          byType: [
            { type: 'שכירות', count: 456, percentage: 36.6 },
            { type: 'עבודה', count: 234, percentage: 18.8 },
            { type: 'שירותים', count: 189, percentage: 15.2 },
            { type: 'שותפות', count: 156, percentage: 12.5 },
            { type: 'אחר', count: 212, percentage: 17.0 },
          ],
          byStatus: [
            { status: 'פעיל', count: 892, percentage: 71.5 },
            { status: 'ממתין', count: 156, percentage: 12.5 },
            { status: 'הושלם', count: 199, percentage: 16.0 },
          ],
          byRisk: [
            { risk: 'נמוך', count: 623, percentage: 50.0 },
            { risk: 'בינוני', count: 374, percentage: 30.0 },
            { risk: 'גבוה', count: 187, percentage: 15.0 },
            { risk: 'קריטי', count: 63, percentage: 5.0 },
          ],
          recentActivity: [
            { id: '1', title: 'חוזה שכירות דירה', action: 'נוצר', user: 'עו״ד דוד לוי', time: 'לפני 2 שעות' },
            { id: '2', title: 'חוזה עבודה', action: 'נחתם', user: 'עו״ד שרה אברהם', time: 'לפני 4 שעות' },
            { id: '3', title: 'חוזה שירותים', action: 'עודכן', user: 'עו״ד משה כהן', time: 'לפני 6 שעות' },
            { id: '4', title: 'הסכם שותפות', action: 'נוצר', user: 'עו״ד רותי דוד', time: 'לפני יום' },
          ],
        },
      };

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setData(mockData);
    } catch (err) {
      setError('שגיאה בטעינת נתוני אנליטיקה');
      console.error('Analytics loading error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
  };

  const handleExport = () => {
    setShowExportDialog(true);
  };

  const getTrendIcon = (trend: 'up' | 'down') => {
    return trend === 'up' ? <TrendingUp color="success" /> : <TrendingDown color="error" />;
  };

  const getPerformanceColor = (value: number, threshold: number) => {
    return value >= threshold ? 'success' : value >= threshold * 0.8 ? 'warning' : 'error';
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'נמוך': return 'success';
      case 'בינוני': return 'warning';
      case 'גבוה': return 'error';
      case 'קריטי': return 'error';
      default: return 'default';
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ m: 2 }}>
        {error}
        <Button 
          onClick={loadAnalyticsData} 
          sx={{ 
            ml: 2,
            borderColor: 'rgba(25, 118, 210, 0.3)',
            color: 'primary.main',
            '&:hover': {
              borderColor: 'primary.main',
              backgroundColor: 'rgba(25, 118, 210, 0.05)',
            },
          }}
        >
          נסה שוב
        </Button>
      </Alert>
    );
  }

  if (!data) return null;

  return (
    <Box sx={{ 
      p: { xs: 2, md: 3 },
      background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
      borderRadius: 3,
      boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
      border: '1px solid rgba(255,255,255,0.2)',
    }}>
      {/* Header */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        mb: 4,
        p: 2,
        background: 'rgba(255,255,255,0.7)',
        borderRadius: 2,
        backdropFilter: 'blur(10px)',
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 50,
            height: 50,
            borderRadius: '50%',
            background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
            color: 'white',
            boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)',
          }}>
            <Assessment sx={{ fontSize: 24 }} />
          </Box>
          <Box>
            <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
              לוח אנליטיקה
            </Typography>
            <Typography variant="body2" color="text.secondary">
              ניתוח ביצועים ופעילות מערכת
            </Typography>
          </Box>
        </Box>
        
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            onClick={loadAnalyticsData}
            disabled={loading}
            sx={{
              borderColor: 'rgba(25, 118, 210, 0.3)',
              color: 'primary.main',
              '&:hover': {
                borderColor: 'primary.main',
                backgroundColor: 'rgba(25, 118, 210, 0.05)',
              },
            }}
          >
            רענן
          </Button>
          <Button
            variant="outlined"
            onClick={handleExport}
            sx={{
              borderColor: 'rgba(25, 118, 210, 0.3)',
              color: 'primary.main',
              '&:hover': {
                borderColor: 'primary.main',
                backgroundColor: 'rgba(25, 118, 210, 0.05)',
              },
            }}
          >
            ייצא נתונים
          </Button>
          <IconButton 
            onClick={(e) => setAnchorEl(e.currentTarget)}
            sx={{
              border: '1px solid rgba(25, 118, 210, 0.3)',
              color: 'primary.main',
              '&:hover': {
                borderColor: 'primary.main',
                backgroundColor: 'rgba(25, 118, 210, 0.05)',
              },
            }}
          >
            <MoreVert />
          </IconButton>
        </Box>
      </Box>

      {/* Overview Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{
            background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)',
            borderRadius: 3,
            boxShadow: '0 8px 25px rgba(25, 118, 210, 0.15)',
            border: '1px solid rgba(255,255,255,0.3)',
            transition: 'all 0.3s ease-in-out',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: '0 12px 35px rgba(25, 118, 210, 0.25)',
            },
          }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Box sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 50,
                  height: 50,
                  borderRadius: '50%',
                  background: 'rgba(255,255,255,0.3)',
                  backdropFilter: 'blur(10px)',
                }}>
                  <Description sx={{ fontSize: 24, color: 'primary.main' }} />
                </Box>
                <TrendingUp sx={{ fontSize: 20, color: 'success.main' }} />
              </Box>
              <Typography color="text.secondary" gutterBottom sx={{ fontSize: '0.9rem', fontWeight: 500 }}>
                חוזים סה״כ
              </Typography>
              <Typography variant="h3" component="div" sx={{ fontWeight: 'bold', mb: 2 }}>
                {data.overview.totalContracts.toLocaleString()}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <Typography variant="body2" color="success.main" sx={{ fontWeight: 500 }}>
                  +12%
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  מהחודש שעבר
                </Typography>
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={(data.overview.activeContracts / data.overview.totalContracts) * 100} 
                sx={{ 
                  height: 8, 
                  borderRadius: 4,
                  backgroundColor: 'rgba(255,255,255,0.3)',
                  '& .MuiLinearProgress-bar': {
                    borderRadius: 4,
                    background: 'linear-gradient(90deg, #1976d2, #42a5f5)',
                  }
                }}
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{
            background: 'linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%)',
            borderRadius: 3,
            boxShadow: '0 8px 25px rgba(255, 152, 0, 0.15)',
            border: '1px solid rgba(255,255,255,0.3)',
            transition: 'all 0.3s ease-in-out',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: '0 12px 35px rgba(255, 152, 0, 0.25)',
            },
          }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Box sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 50,
                  height: 50,
                  borderRadius: '50%',
                  background: 'rgba(255,255,255,0.3)',
                  backdropFilter: 'blur(10px)',
                }}>
                  <Assessment sx={{ fontSize: 24, color: 'warning.main' }} />
                </Box>
                <TrendingDown sx={{ fontSize: 20, color: 'success.main' }} />
              </Box>
              <Typography color="text.secondary" gutterBottom sx={{ fontSize: '0.9rem', fontWeight: 500 }}>
                ציון סיכון
              </Typography>
              <Typography variant="h3" component="div" sx={{ fontWeight: 'bold', mb: 2 }}>
                {data.overview.riskScore}/100
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <Typography variant="body2" color="success.main" sx={{ fontWeight: 500 }}>
                  -5%
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  מהחודש שעבר
                </Typography>
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={data.overview.riskScore} 
                color={getPerformanceColor(data.overview.riskScore, 80) as 'success' | 'warning' | 'error'}
                sx={{ 
                  height: 8, 
                  borderRadius: 4,
                  backgroundColor: 'rgba(255,255,255,0.3)',
                  '& .MuiLinearProgress-bar': {
                    borderRadius: 4,
                    background: 'linear-gradient(90deg, #ff9800, #ffb74d)',
                  }
                }}
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{
            background: 'linear-gradient(135deg, #e8f5e8 0%, #c8e6c9 100%)',
            borderRadius: 3,
            boxShadow: '0 8px 25px rgba(76, 175, 80, 0.15)',
            border: '1px solid rgba(255,255,255,0.3)',
            transition: 'all 0.3s ease-in-out',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: '0 12px 35px rgba(76, 175, 80, 0.25)',
            },
          }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Box sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 50,
                  height: 50,
                  borderRadius: '50%',
                  background: 'rgba(255,255,255,0.3)',
                  backdropFilter: 'blur(10px)',
                }}>
                  <People sx={{ fontSize: 24, color: 'success.main' }} />
                </Box>
                <TrendingUp sx={{ fontSize: 20, color: 'success.main' }} />
              </Box>
              <Typography color="text.secondary" gutterBottom sx={{ fontSize: '0.9rem', fontWeight: 500 }}>
                מעורבות משתמשים
              </Typography>
              <Typography variant="h3" component="div" sx={{ fontWeight: 'bold', mb: 2 }}>
                {data.overview.userEngagement}%
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <Typography variant="body2" color="success.main" sx={{ fontWeight: 500 }}>
                  +8%
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  מהחודש שעבר
                </Typography>
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={data.overview.userEngagement} 
                color="success"
                sx={{ 
                  height: 8, 
                  borderRadius: 4,
                  backgroundColor: 'rgba(255,255,255,0.3)',
                  '& .MuiLinearProgress-bar': {
                    borderRadius: 4,
                    background: 'linear-gradient(90deg, #4caf50, #81c784)',
                  }
                }}
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{
            background: 'linear-gradient(135deg, #e8f5e8 0%, #c8e6c9 100%)',
            borderRadius: 3,
            boxShadow: '0 8px 25px rgba(76, 175, 80, 0.15)',
            border: '1px solid rgba(255,255,255,0.3)',
            transition: 'all 0.3s ease-in-out',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: '0 12px 35px rgba(76, 175, 80, 0.25)',
            },
          }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Box sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 50,
                  height: 50,
                  borderRadius: '50%',
                  background: 'rgba(255,255,255,0.3)',
                  backdropFilter: 'blur(10px)',
                }}>
                  <AttachMoney sx={{ fontSize: 24, color: 'success.main' }} />
                </Box>
                <TrendingUp sx={{ fontSize: 20, color: 'success.main' }} />
              </Box>
              <Typography color="text.secondary" gutterBottom sx={{ fontSize: '0.9rem', fontWeight: 500 }}>
                הכנסות חודשיות
              </Typography>
              <Typography variant="h3" component="div" sx={{ fontWeight: 'bold', mb: 2 }}>
                ₪{data.overview.revenue.toLocaleString()}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <Typography variant="body2" color="success.main" sx={{ fontWeight: 500 }}>
                  +15%
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  מהחודש שעבר
                </Typography>
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={75} 
                color="success"
                sx={{ 
                  height: 8, 
                  borderRadius: 4,
                  backgroundColor: 'rgba(255,255,255,0.3)',
                  '& .MuiLinearProgress-bar': {
                    borderRadius: 4,
                    background: 'linear-gradient(90deg, #4caf50, #81c784)',
                  }
                }}
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabs */}
      <Card sx={{
        background: 'rgba(255,255,255,0.8)',
        borderRadius: 3,
        boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
        border: '1px solid rgba(255,255,255,0.2)',
        backdropFilter: 'blur(10px)',
      }}>
        <Box sx={{ 
          borderBottom: 1, 
          borderColor: 'divider',
          background: 'rgba(255,255,255,0.5)',
          borderRadius: '12px 12px 0 0',
        }}>
          <Tabs 
            value={selectedTab} 
            onChange={handleTabChange} 
            aria-label="analytics tabs"
            sx={{
              '& .MuiTab-root': {
                minHeight: 64,
                fontSize: '1rem',
                fontWeight: 500,
                textTransform: 'none',
                '&.Mui-selected': {
                  color: 'primary.main',
                  fontWeight: 'bold',
                },
              },
              '& .MuiTabs-indicator': {
                height: 3,
                borderRadius: '3px 3px 0 0',
              },
            }}
          >
            <Tab label="ביצועים" icon={<Speed />} iconPosition="start" />
            <Tab label="פעילות משתמשים" icon={<People />} iconPosition="start" />
            <Tab label="חוזים" icon={<Description />} iconPosition="start" />
            <Tab label="מגמות" icon={<Timeline />} iconPosition="start" />
          </Tabs>
        </Box>

        {/* Performance Tab */}
        <TabPanel value={selectedTab} index={0}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                מדדי ביצועים
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">זמן טעינת דף</Typography>
                    <Typography variant="body2">{data.performance.pageLoadTime}s</Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={(data.performance.pageLoadTime / 3) * 100} 
                    color={getPerformanceColor(data.performance.pageLoadTime, 2) as any}
                  />
                </Box>
                
                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">זמן תגובת API</Typography>
                    <Typography variant="body2">{data.performance.apiResponseTime}s</Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={(data.performance.apiResponseTime / 2) * 100} 
                    color={getPerformanceColor(data.performance.apiResponseTime, 1) as any}
                  />
                </Box>
                
                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">אחוז שגיאות</Typography>
                    <Typography variant="body2">{data.performance.errorRate}%</Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={data.performance.errorRate} 
                    color={getPerformanceColor(data.performance.errorRate, 1) as any}
                  />
                </Box>
                
                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">זמן פעילות</Typography>
                    <Typography variant="body2">{data.performance.uptime}%</Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={data.performance.uptime} 
                    color="success"
                  />
                </Box>
              </Box>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                שביעות רצון משתמשים
              </Typography>
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="h2" color="primary">
                  {data.performance.userSatisfaction}/5
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <CheckCircle 
                      key={star}
                      color={star <= data.performance.userSatisfaction ? 'primary' : 'disabled'}
                      sx={{ fontSize: 24 }}
                    />
                  ))}
                </Box>
              </Box>
            </Grid>
          </Grid>
        </TabPanel>

        {/* User Behavior Tab */}
        <TabPanel value={selectedTab} index={1}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                תכונות בשימוש
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {data.userBehavior.mostUsedFeatures.map((feature, index) => (
                  <Box key={index} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="body2">{feature.name}</Typography>
                      {getTrendIcon(feature.trend)}
                    </Box>
                    <Typography variant="body2" fontWeight="bold">
                      {feature.usage}%
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                דפים פופולריים
              </Typography>
              <TableContainer component={Paper} variant="outlined">
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>דף</TableCell>
                      <TableCell align="right">ביקורים</TableCell>
                      <TableCell align="right">זמן בדף</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data.userBehavior.topPages.map((page, index) => (
                      <TableRow key={index}>
                        <TableCell>{page.name}</TableCell>
                        <TableCell align="right">{page.visits.toLocaleString()}</TableCell>
                        <TableCell align="right">{page.timeOnPage} דקות</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Contracts Tab */}
        <TabPanel value={selectedTab} index={2}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" gutterBottom>
                חוזים לפי סוג
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {data.contracts.byType.map((type, index) => (
                  <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2">{type.type}</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="body2" fontWeight="bold">
                        {type.count}
                      </Typography>
                      <Chip label={`${type.percentage}%`} size="small" />
                    </Box>
                  </Box>
                ))}
              </Box>
            </Grid>

            <Grid item xs={12} md={4}>
              <Typography variant="h6" gutterBottom>
                חוזים לפי סטטוס
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {data.contracts.byStatus.map((status, index) => (
                  <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2">{status.status}</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="body2" fontWeight="bold">
                        {status.count}
                      </Typography>
                      <Chip label={`${status.percentage}%`} size="small" />
                    </Box>
                  </Box>
                ))}
              </Box>
            </Grid>

            <Grid item xs={12} md={4}>
              <Typography variant="h6" gutterBottom>
                חוזים לפי סיכון
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {data.contracts.byRisk.map((risk, index) => (
                  <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2">{risk.risk}</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="body2" fontWeight="bold">
                        {risk.count}
                      </Typography>
                      <Chip 
                        label={`${risk.percentage}%`} 
                        size="small" 
                        color={getRiskColor(risk.risk) as any}
                      />
                    </Box>
                  </Box>
                ))}
              </Box>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                פעילות אחרונה
              </Typography>
              <TableContainer component={Paper} variant="outlined">
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>חוזה</TableCell>
                      <TableCell>פעולה</TableCell>
                      <TableCell>משתמש</TableCell>
                      <TableCell>זמן</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data.contracts.recentActivity.map((activity) => (
                      <TableRow key={activity.id}>
                        <TableCell>{activity.title}</TableCell>
                        <TableCell>
                          <Chip 
                            label={activity.action} 
                            size="small" 
                            color={activity.action === 'נחתם' ? 'success' : 'primary'}
                          />
                        </TableCell>
                        <TableCell>{activity.user}</TableCell>
                        <TableCell>{activity.time}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Trends Tab */}
        <TabPanel value={selectedTab} index={3}>
          <Typography variant="h6" gutterBottom>
            מגמות שבועיות
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    חוזים שנוצרו
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h4" color="primary">
                      {data.trends.contractsCreated.reduce((a, b) => a + b, 0)}
                    </Typography>
                    <TrendingUp color="success" sx={{ fontSize: 40 }} />
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    השבוע האחרון
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    חוזים שנחתמו
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h4" color="success">
                      {data.trends.contractsSigned.reduce((a, b) => a + b, 0)}
                    </Typography>
                    <CheckCircle color="success" sx={{ fontSize: 40 }} />
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    השבוע האחרון
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>
      </Card>

      {/* Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
      >
        <MenuItem onClick={() => setAnchorEl(null)}>
          <Visibility sx={{ mr: 1 }} />
          צפייה מפורטת
        </MenuItem>
        <MenuItem onClick={handleExport}>
          <Download sx={{ mr: 1 }} />
          ייצא נתונים
        </MenuItem>
        <MenuItem onClick={() => setAnchorEl(null)}>
          <Share sx={{ mr: 1 }} />
          שתף דוח
        </MenuItem>
      </Menu>

      {/* Export Dialog */}
      <Dialog open={showExportDialog} onClose={() => setShowExportDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>ייצוא נתוני אנליטיקה</DialogTitle>
        <DialogContent>
          <Typography paragraph>
            בחר את סוג הנתונים שברצונך לייצא:
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Button 
              variant="outlined" 
              fullWidth
              sx={{
                borderColor: 'rgba(25, 118, 210, 0.3)',
                color: 'primary.main',
                '&:hover': {
                  borderColor: 'primary.main',
                  backgroundColor: 'rgba(25, 118, 210, 0.05)',
                },
              }}
            >
              ייצא ל-PDF
            </Button>
            <Button 
              variant="outlined" 
              fullWidth
              sx={{
                borderColor: 'rgba(25, 118, 210, 0.3)',
                color: 'primary.main',
                '&:hover': {
                  borderColor: 'primary.main',
                  backgroundColor: 'rgba(25, 118, 210, 0.05)',
                },
              }}
            >
              ייצא ל-Excel
            </Button>
            <Button 
              variant="outlined" 
              fullWidth
              sx={{
                borderColor: 'rgba(25, 118, 210, 0.3)',
                color: 'primary.main',
                '&:hover': {
                  borderColor: 'primary.main',
                  backgroundColor: 'rgba(25, 118, 210, 0.05)',
                },
              }}
            >
              ייצא ל-CSV
            </Button>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setShowExportDialog(false)}
            sx={{
              borderColor: 'rgba(25, 118, 210, 0.3)',
              color: 'primary.main',
              '&:hover': {
                borderColor: 'primary.main',
                backgroundColor: 'rgba(25, 118, 210, 0.05)',
              },
            }}
          >
            ביטול
          </Button>
          <Button 
            variant="outlined" 
            onClick={() => setShowExportDialog(false)}
            sx={{
              borderColor: 'rgba(25, 118, 210, 0.3)',
              color: 'primary.main',
              '&:hover': {
                borderColor: 'primary.main',
                backgroundColor: 'rgba(25, 118, 210, 0.05)',
              },
            }}
          >
            ייצא
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AnalyticsDashboard;

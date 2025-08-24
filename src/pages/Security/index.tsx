import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Alert,
  IconButton,
  Collapse,
  Avatar,
  Badge,
  LinearProgress,
  Tabs,
  Tab,
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
  Switch,
  FormControlLabel,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from '@mui/material';
import {
  Security as SecurityIcon,
  Shield as ShieldIcon,
  Lock as LockIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Settings as SettingsIcon,
  History as HistoryIcon,
  Assessment as AssessmentIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Person as PersonIcon,
  Business as BusinessIcon,
  Key as KeyIcon,
  VpnKey as VpnKeyIcon,
  SecurityUpdate as SecurityUpdateIcon,
  Report as ReportIcon,
  Notifications as NotificationsIcon,
  Refresh as RefreshIcon,
  Download as DownloadIcon,
  Edit as EditIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

interface SecurityMetric {
  id: string;
  name: string;
  value: number;
  maxValue: number;
  unit: string;
  status: 'excellent' | 'good' | 'warning' | 'critical';
  trend: 'up' | 'down' | 'stable';
  description: string;
}

interface SecurityAlert {
  id: string;
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: string;
  status: 'new' | 'investigating' | 'resolved';
  category: string;
}

interface ComplianceItem {
  id: string;
  name: string;
  status: 'compliant' | 'non-compliant' | 'pending';
  lastCheck: string;
  nextCheck: string;
  description: string;
  requirements: string[];
}

interface AccessLog {
  id: string;
  user: string;
  action: string;
  resource: string;
  timestamp: string;
  ipAddress: string;
  status: 'success' | 'failed' | 'blocked';
  location: string;
}

export const SecurityPage: React.FC = () => {
  const { t } = useTranslation();
  const [metrics, setMetrics] = useState<SecurityMetric[]>([]);
  const [alerts, setAlerts] = useState<SecurityAlert[]>([]);
  const [compliance, setCompliance] = useState<ComplianceItem[]>([]);
  const [accessLogs, setAccessLogs] = useState<AccessLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState(0);
  const [expandedAlert, setExpandedAlert] = useState<string | null>(null);
  const [showSettingsDialog, setShowSettingsDialog] = useState(false);
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: true,
    passwordPolicy: 'strong',
    sessionTimeout: 30,
    ipWhitelist: '',
    auditLogging: true
  });

  useEffect(() => {
    loadSecurityData();
  }, []);

  const loadSecurityData = async () => {
    try {
      setLoading(true);
      // Mock data - replace with actual API call
      const mockMetrics: SecurityMetric[] = [
        {
          id: '1',
          name: 'דירוג אבטחה כללי',
          value: 85,
          maxValue: 100,
          unit: '%',
          status: 'good',
          trend: 'up',
          description: 'דירוג אבטחה מבוסס על בדיקות אוטומטיות'
        },
        {
          id: '2',
          name: 'התקפות חסומות',
          value: 127,
          maxValue: 0,
          unit: '',
          status: 'excellent',
          trend: 'up',
          description: 'מספר התקפות שזוהו וחסמו בהצלחה'
        },
        {
          id: '3',
          name: 'משתמשים מחוברים',
          value: 23,
          maxValue: 50,
          unit: '',
          status: 'good',
          trend: 'stable',
          description: 'מספר משתמשים מחוברים כרגע'
        },
        {
          id: '4',
          name: 'פגיעויות זוהו',
          value: 3,
          maxValue: 0,
          unit: '',
          status: 'warning',
          trend: 'down',
          description: 'פגיעויות אבטחה שזוהו במערכת'
        }
      ];

      const mockAlerts: SecurityAlert[] = [
        {
          id: '1',
          title: 'ניסיון כניסה חשוד',
          description: 'זוהה ניסיון כניסה מ-IP לא מוכר',
          severity: 'medium',
          timestamp: '2024-01-15 14:30:00',
          status: 'investigating',
          category: 'Authentication'
        },
        {
          id: '2',
          title: 'פגיעות אבטחה חדשה',
          description: 'זוהתה פגיעות אבטחה חדשה במערכת',
          severity: 'high',
          timestamp: '2024-01-15 12:15:00',
          status: 'new',
          category: 'Vulnerability'
        },
        {
          id: '3',
          title: 'שינוי הרשאות',
          description: 'בוצע שינוי בהרשאות משתמש',
          severity: 'low',
          timestamp: '2024-01-15 10:45:00',
          status: 'resolved',
          category: 'Permissions'
        }
      ];

      const mockCompliance: ComplianceItem[] = [
        {
          id: '1',
          name: 'GDPR Compliance',
          status: 'compliant',
          lastCheck: '2024-01-10',
          nextCheck: '2024-02-10',
          description: 'עמידה בתקנות הגנת הפרטיות',
          requirements: ['הצפנת נתונים', 'הסכמה מפורשת', 'זכות למחיקה']
        },
        {
          id: '2',
          name: 'ISO 27001',
          status: 'pending',
          lastCheck: '2024-01-05',
          nextCheck: '2024-01-20',
          description: 'תקן אבטחת מידע בינלאומי',
          requirements: ['ניהול סיכונים', 'בקרת גישה', 'תיעוד נהלים']
        },
        {
          id: '3',
          name: 'SOC 2 Type II',
          status: 'non-compliant',
          lastCheck: '2024-01-01',
          nextCheck: '2024-01-15',
          description: 'אישור אבטחה וזמינות שירות',
          requirements: ['בקרת גישה', 'ניטור מערכות', 'תחקור אירועים']
        }
      ];

      const mockAccessLogs: AccessLog[] = [
        {
          id: '1',
          user: 'admin@company.com',
          action: 'Login',
          resource: 'Dashboard',
          timestamp: '2024-01-15 15:30:00',
          ipAddress: '192.168.1.100',
          status: 'success',
          location: 'תל אביב, ישראל'
        },
        {
          id: '2',
          user: 'user@company.com',
          action: 'Access Contract',
          resource: 'Contract-12345',
          timestamp: '2024-01-15 15:25:00',
          ipAddress: '192.168.1.101',
          status: 'success',
          location: 'ירושלים, ישראל'
        },
        {
          id: '3',
          user: 'unknown@external.com',
          action: 'Login Attempt',
          resource: 'Login Page',
          timestamp: '2024-01-15 15:20:00',
          ipAddress: '203.0.113.45',
          status: 'blocked',
          location: 'חו"ל'
        }
      ];

      setMetrics(mockMetrics);
      setAlerts(mockAlerts);
      setCompliance(mockCompliance);
      setAccessLogs(mockAccessLogs);
    } catch (error) {
      console.error('Error loading security data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
  };

  const handleAlertClick = (alertId: string) => {
    setExpandedAlert(expandedAlert === alertId ? null : alertId);
  };

  const getStatusColor = (status: string): 'success' | 'primary' | 'warning' | 'error' | 'info' => {
    switch (status) {
      case 'excellent': return 'success';
      case 'good': return 'primary';
      case 'warning': return 'warning';
      case 'critical': return 'error';
      default: return 'info';
    }
  };

  const getIconColor = (status: string): 'success' | 'primary' | 'warning' | 'error' | 'inherit' => {
    switch (status) {
      case 'excellent': return 'success';
      case 'good': return 'primary';
      case 'warning': return 'warning';
      case 'critical': return 'error';
      default: return 'inherit';
    }
  };

  const getSeverityColor = (severity: string): 'error' | 'warning' | 'info' | 'success' | 'inherit' => {
    switch (severity) {
      case 'critical': return 'error';
      case 'high': return 'warning';
      case 'medium': return 'info';
      case 'low': return 'success';
      default: return 'inherit';
    }
  };

  const getComplianceColor = (status: string): 'success' | 'warning' | 'error' | 'inherit' => {
    switch (status) {
      case 'compliant': return 'success';
      case 'pending': return 'warning';
      case 'non-compliant': return 'error';
      default: return 'inherit';
    }
  };

  const getComplianceChipColor = (status: string): 'success' | 'warning' | 'error' | 'default' => {
    switch (status) {
      case 'compliant': return 'success';
      case 'pending': return 'warning';
      case 'non-compliant': return 'error';
      default: return 'default';
    }
  };

  const handleSettingsChange = (setting: string, value: string | number | boolean) => {
    setSecuritySettings(prev => ({
      ...prev,
      [setting]: value
    }));
  };

  const handleSaveSettings = () => {
    // Save settings logic here
    setShowSettingsDialog(false);
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <LinearProgress />
        <Typography variant="h6" sx={{ mt: 2 }}>
          טוען נתוני אבטחה...
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4">
          <SecurityIcon sx={{ mr: 2, verticalAlign: 'middle' }} />
          מרכז האבטחה
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={loadSecurityData}
          >
            רענן
          </Button>
          <Button
            variant="contained"
            startIcon={<SettingsIcon />}
            onClick={() => setShowSettingsDialog(true)}
          >
            הגדרות אבטחה
          </Button>
        </Box>
      </Box>

      {/* Security Metrics Overview */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {metrics.map((metric) => (
          <Grid item xs={12} sm={6} md={3} key={metric.id}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <SecurityIcon color={getIconColor(metric.status)} />
                  <Typography variant="h6" sx={{ ml: 1, flexGrow: 1 }}>
                    {metric.name}
                  </Typography>
                  {metric.trend === 'up' && <TrendingUpIcon color="success" />}
                  {metric.trend === 'down' && <TrendingDownIcon color="error" />}
                </Box>
                <Typography variant="h4" color="primary" gutterBottom>
                  {metric.value}{metric.unit}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {metric.description}
                </Typography>
                {metric.maxValue > 0 && (
                  <LinearProgress
                    variant="determinate"
                    value={(metric.value / metric.maxValue) * 100}
                    sx={{ mt: 2 }}
                    color={getStatusColor(metric.status)}
                  />
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Tabs value={selectedTab} onChange={handleTabChange} sx={{ mb: 3 }}>
        <Tab label="התראות אבטחה" />
        <Tab label="עמידה בתקנים" />
        <Tab label="יומן גישה" />
        <Tab label="המלצות" />
      </Tabs>

      {selectedTab === 0 && (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              התראות אבטחה אחרונות
            </Typography>
            <List>
              {alerts.map((alert) => (
                <React.Fragment key={alert.id}>
                  <ListItem
                    button
                    onClick={() => handleAlertClick(alert.id)}
                    sx={{ borderRadius: 1, mb: 1 }}
                  >
                    <ListItemIcon>
                      <Badge
                        badgeContent={alert.severity === 'critical' ? '!' : ''}
                        color="error"
                      >
                        <WarningIcon color={getSeverityColor(alert.severity)} />
                      </Badge>
                    </ListItemIcon>
                    <ListItemText
                      primary={alert.title}
                      secondary={
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            {alert.description}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {alert.timestamp} • {alert.category}
                          </Typography>
                        </Box>
                      }
                    />
                    <Chip
                      label={alert.status}
                      color={alert.status === 'resolved' ? 'success' : 'warning'}
                      size="small"
                    />
                    <IconButton size="small">
                      {expandedAlert === alert.id ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                    </IconButton>
                  </ListItem>
                  <Collapse in={expandedAlert === alert.id}>
                    <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1, mx: 2, mb: 1 }}>
                      <Typography variant="subtitle2" gutterBottom>
                        פרטי ההתראה
                      </Typography>
                      <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                          <Typography variant="body2">
                            <strong>חומרה:</strong> {alert.severity}
                          </Typography>
                          <Typography variant="body2">
                            <strong>קטגוריה:</strong> {alert.category}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <Typography variant="body2">
                            <strong>זמן:</strong> {alert.timestamp}
                          </Typography>
                          <Typography variant="body2">
                            <strong>סטטוס:</strong> {alert.status}
                          </Typography>
                        </Grid>
                      </Grid>
                      <Box sx={{ mt: 2 }}>
                        <Button size="small" variant="outlined" sx={{ mr: 1 }}>
                          חקור
                        </Button>
                        <Button size="small" variant="outlined">
                          סמן כטופל
                        </Button>
                      </Box>
                    </Box>
                  </Collapse>
                  <Divider />
                </React.Fragment>
              ))}
            </List>
          </CardContent>
        </Card>
      )}

      {selectedTab === 1 && (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              עמידה בתקני אבטחה
            </Typography>
            <Grid container spacing={3}>
              {compliance.map((item) => (
                <Grid item xs={12} md={6} key={item.id}>
                  <Card variant="outlined">
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <CheckCircleIcon color={getComplianceColor(item.status)} />
                        <Typography variant="h6" sx={{ ml: 1, flexGrow: 1 }}>
                          {item.name}
                        </Typography>
                        <Chip
                          label={item.status}
                          color={getComplianceChipColor(item.status)}
                          size="small"
                        />
                      </Box>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {item.description}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        בדיקה אחרונה: {item.lastCheck} | בדיקה הבאה: {item.nextCheck}
                      </Typography>
                      <Box sx={{ mt: 2 }}>
                        <Typography variant="subtitle2" gutterBottom>
                          דרישות עיקריות:
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {item.requirements.map((req, index) => (
                            <Chip
                              key={index}
                              label={req}
                              size="small"
                              variant="outlined"
                            />
                          ))}
                        </Box>
                      </Box>
                    </CardContent>
                    <CardActions>
                      <Button size="small">צפה בדוח</Button>
                      <Button size="small">עדכן סטטוס</Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>
      )}

      {selectedTab === 2 && (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              יומן גישה למערכת
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>משתמש</TableCell>
                    <TableCell>פעולה</TableCell>
                    <TableCell>משאב</TableCell>
                    <TableCell>זמן</TableCell>
                    <TableCell>כתובת IP</TableCell>
                    <TableCell>מיקום</TableCell>
                    <TableCell>סטטוס</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {accessLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <PersonIcon sx={{ mr: 1 }} />
                          {log.user}
                        </Box>
                      </TableCell>
                      <TableCell>{log.action}</TableCell>
                      <TableCell>{log.resource}</TableCell>
                      <TableCell>{log.timestamp}</TableCell>
                      <TableCell>{log.ipAddress}</TableCell>
                      <TableCell>{log.location}</TableCell>
                      <TableCell>
                        <Chip
                          label={log.status}
                          color={log.status === 'success' ? 'success' : 'error'}
                          size="small"
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      )}

      {selectedTab === 3 && (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              המלצות אבטחה
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Alert severity="warning" sx={{ mb: 2 }}>
                  <Typography variant="subtitle2">
                    הפעל אימות דו-שלבי
                  </Typography>
                  <Typography variant="body2">
                    מומלץ להפעיל אימות דו-שלבי לכל המשתמשים
                  </Typography>
                </Alert>
                <Alert severity="info" sx={{ mb: 2 }}>
                  <Typography variant="subtitle2">
                    עדכן סיסמאות
                  </Typography>
                  <Typography variant="body2">
                    חלק מהמשתמשים לא עדכנו סיסמאות מעל 90 ימים
                  </Typography>
                </Alert>
              </Grid>
              <Grid item xs={12} md={6}>
                <Alert severity="error" sx={{ mb: 2 }}>
                  <Typography variant="subtitle2">
                    פגיעות אבטחה
                  </Typography>
                  <Typography variant="body2">
                    זוהו 3 פגיעויות אבטחה שדורשות טיפול דחוף
                  </Typography>
                </Alert>
                <Alert severity="success" sx={{ mb: 2 }}>
                  <Typography variant="subtitle2">
                    גיבוי מערכות
                  </Typography>
                  <Typography variant="body2">
                    כל המערכות מגובות בהצלחה
                  </Typography>
                </Alert>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      )}

      {/* Security Settings Dialog */}
      <Dialog open={showSettingsDialog} onClose={() => setShowSettingsDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>הגדרות אבטחה</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={securitySettings.twoFactorAuth}
                      onChange={(e) => handleSettingsChange('twoFactorAuth', e.target.checked)}
                    />
                  }
                  label="אימות דו-שלבי"
                />
                <Typography variant="body2" color="text.secondary" sx={{ ml: 4 }}>
                  דורש אימות נוסף בעת כניסה
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>מדיניות סיסמאות</InputLabel>
                  <Select
                    value={securitySettings.passwordPolicy}
                    onChange={(e) => handleSettingsChange('passwordPolicy', e.target.value)}
                    label="מדיניות סיסמאות"
                  >
                    <MenuItem value="basic">בסיסי</MenuItem>
                    <MenuItem value="strong">חזק</MenuItem>
                    <MenuItem value="very-strong">חזק מאוד</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="זמן פקיעת סשן (דקות)"
                  type="number"
                  value={securitySettings.sessionTimeout}
                  onChange={(e) => handleSettingsChange('sessionTimeout', parseInt(e.target.value))}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={securitySettings.auditLogging}
                      onChange={(e) => handleSettingsChange('auditLogging', e.target.checked)}
                    />
                  }
                  label="יומן ביקורת"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="רשימת IP מורשים"
                  value={securitySettings.ipWhitelist}
                  onChange={(e) => handleSettingsChange('ipWhitelist', e.target.value)}
                  helperText="הזן כתובות IP מורשות (אחת בכל שורה)"
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowSettingsDialog(false)}>ביטול</Button>
          <Button onClick={handleSaveSettings} variant="contained">שמור הגדרות</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default SecurityPage;



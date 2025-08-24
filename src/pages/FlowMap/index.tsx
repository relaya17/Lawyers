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
  Stepper,
  Step,
  StepLabel,
  StepContent,
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
  DialogActions
} from '@mui/material';
import {
  Timeline as TimelineIcon,
  Assignment as AssignmentIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  PlayArrow as PlayArrowIcon,
  Pause as PauseIcon,
  Stop as StopIcon,
  Edit as EditIcon,
  Visibility as VisibilityIcon,
  Download as DownloadIcon,
  Share as ShareIcon,
  Add as AddIcon,
  Business as BusinessIcon,
  Gavel as GavelIcon,
  Handshake as HandshakeIcon,
  Description as DescriptionIcon,
  Assessment as AssessmentIcon,
  Security as SecurityIcon,
  TrendingUp as TrendingUpIcon,
  Schedule as ScheduleIcon
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

interface FlowStep {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'active' | 'completed' | 'error';
  duration: string;
  assignee: string;
  dependencies: string[];
  documents: string[];
  risks: string[];
}

interface ContractFlow {
  id: string;
  title: string;
  type: string;
  status: string;
  progress: number;
  steps: FlowStep[];
  startDate: string;
  endDate: string;
  value: string;
  priority: 'low' | 'medium' | 'high';
}

export const FlowMapPage: React.FC = () => {
  const { t } = useTranslation();
  const [flows, setFlows] = useState<ContractFlow[]>([]);
  const [selectedFlow, setSelectedFlow] = useState<ContractFlow | null>(null);
  const [activeStep, setActiveStep] = useState(0);
  const [expandedStep, setExpandedStep] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState(0);
  const [showFlowDialog, setShowFlowDialog] = useState(false);
  const [newFlowData, setNewFlowData] = useState({
    title: '',
    type: '',
    priority: 'medium' as const
  });

  useEffect(() => {
    loadFlows();
  }, []);

  const loadFlows = async () => {
    try {
      setLoading(true);
      // Mock data - replace with actual API call
      const mockFlows: ContractFlow[] = [
        {
          id: '1',
          title: 'חוזה שכירות מסחרי',
          type: 'Lease',
          status: 'In Progress',
          progress: 65,
          startDate: '2024-01-15',
          endDate: '2024-03-15',
          value: '₪50,000',
          priority: 'high',
          steps: [
            {
              id: '1-1',
              title: 'ניתוח דרישות',
              description: 'איסוף וניתוח דרישות השכירות',
              status: 'completed',
              duration: '3 ימים',
              assignee: 'שרה כהן',
              dependencies: [],
              documents: ['דרישות שכירות.docx', 'מפרט טכני.pdf'],
              risks: ['שינוי דרישות', 'עיכוב באישור']
            },
            {
              id: '1-2',
              title: 'ניסוח טיוטה ראשונית',
              description: 'יצירת טיוטת חוזה ראשונית',
              status: 'completed',
              duration: '5 ימים',
              assignee: 'דוד לוי',
              dependencies: ['1-1'],
              documents: ['טיוטה ראשונית.docx'],
              risks: ['שינויים משמעותיים', 'התנגדויות צד שלישי']
            },
            {
              id: '1-3',
              title: 'סקירה משפטית',
              description: 'בחינת החוזה על ידי צוות משפטי',
              status: 'active',
              duration: '4 ימים',
              assignee: 'עו"ד רותי גולדברג',
              dependencies: ['1-2'],
              documents: ['דוח סקירה משפטית.pdf', 'הערות משפטיות.docx'],
              risks: ['סיכונים משפטיים', 'צורך בשינויים']
            },
            {
              id: '1-4',
              title: 'מו"מ עם הצד השני',
              description: 'התנהלות מו"מ על תנאי החוזה',
              status: 'pending',
              duration: '7 ימים',
              assignee: 'משה אברהם',
              dependencies: ['1-3'],
              documents: ['פרוטוקול מו"מ.docx'],
              risks: ['קיפאון במו"מ', 'דרישות חדשות']
            },
            {
              id: '1-5',
              title: 'חתימה ואישור סופי',
              description: 'חתימת החוזה הסופי ואישורו',
              status: 'pending',
              duration: '2 ימים',
              assignee: 'מנהל כללי',
              dependencies: ['1-4'],
              documents: ['חוזה סופי.pdf', 'אישור חתימה.pdf'],
              risks: ['עיכוב בחתימה', 'שינויים אחרונים']
            }
          ]
        },
        {
          id: '2',
          title: 'הסכם שירותי IT',
          type: 'Service',
          status: 'Planning',
          progress: 25,
          startDate: '2024-02-01',
          endDate: '2024-04-01',
          value: '₪120,000',
          priority: 'medium',
          steps: [
            {
              id: '2-1',
              title: 'הגדרת היקף השירות',
              description: 'הגדרת היקף שירותי ה-IT הנדרשים',
              status: 'completed',
              duration: '2 ימים',
              assignee: 'יוסי שפירא',
              dependencies: [],
              documents: ['מפרט שירותי IT.docx'],
              risks: ['היקף לא ברור', 'דרישות משתנות']
            },
            {
              id: '2-2',
              title: 'בחירת ספק',
              description: 'בחירת ספק שירותי IT מתאים',
              status: 'active',
              duration: '5 ימים',
              assignee: 'ליאור כהן',
              dependencies: ['2-1'],
              documents: ['רשימת ספקים.xlsx', 'השוואת מחירים.pdf'],
              risks: ['איכות ספקים', 'מחירים גבוהים']
            }
          ]
        }
      ];
      
      setFlows(mockFlows);
      if (mockFlows.length > 0) {
        setSelectedFlow(mockFlows[0]);
      }
    } catch (error) {
      console.error('Error loading flows:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStepClick = (stepId: string) => {
    setExpandedStep(expandedStep === stepId ? null : stepId);
  };

  const handleFlowSelect = (flow: ContractFlow) => {
    setSelectedFlow(flow);
    setActiveStep(0);
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
  };

  const getStatusColor = (status: string): 'success' | 'primary' | 'default' | 'error' => {
    switch (status) {
      case 'completed': return 'success';
      case 'active': return 'primary';
      case 'pending': return 'default';
      case 'error': return 'error';
      default: return 'default';
    }
  };

  const getIconColor = (status: string): 'success' | 'primary' | 'inherit' | 'error' => {
    switch (status) {
      case 'completed': return 'success';
      case 'active': return 'primary';
      case 'pending': return 'inherit';
      case 'error': return 'error';
      default: return 'inherit';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'error';
      case 'medium': return 'warning';
      case 'low': return 'success';
      default: return 'default';
    }
  };

  const handleCreateFlow = () => {
    setShowFlowDialog(true);
  };

  const handleSaveFlow = () => {
    // Add new flow logic here
    setShowFlowDialog(false);
    setNewFlowData({ title: '', type: '', priority: 'medium' });
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <LinearProgress />
        <Typography variant="h6" sx={{ mt: 2 }}>
          טוען מפות זרימה...
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4">
          <TimelineIcon sx={{ mr: 2, verticalAlign: 'middle' }} />
          מפת זרימת חוזים
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleCreateFlow}
        >
          צור זרימה חדשה
        </Button>
      </Box>

      <Grid container spacing={3}>
        {/* Flow List */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                זרימות פעילות
              </Typography>
              <List>
                {flows.map((flow) => (
                  <ListItem
                    key={flow.id}
                    button
                    selected={selectedFlow?.id === flow.id}
                    onClick={() => handleFlowSelect(flow)}
                    sx={{ mb: 1, borderRadius: 1 }}
                  >
                    <ListItemIcon>
                      <BusinessIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText
                      primary={flow.title}
                      secondary={
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            {flow.type} • {flow.status}
                          </Typography>
                          <LinearProgress
                            variant="determinate"
                            value={flow.progress}
                            sx={{ mt: 1, height: 4, borderRadius: 2 }}
                          />
                          <Typography variant="caption" color="text.secondary">
                            {flow.progress}% הושלם
                          </Typography>
                        </Box>
                      }
                    />
                    <Chip
                      label={flow.priority}
                      color={getPriorityColor(flow.priority)}
                      size="small"
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Flow Details */}
        <Grid item xs={12} md={8}>
          {selectedFlow ? (
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Typography variant="h5">
                    {selectedFlow.title}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <IconButton size="small">
                      <EditIcon />
                    </IconButton>
                    <IconButton size="small">
                      <VisibilityIcon />
                    </IconButton>
                    <IconButton size="small">
                      <DownloadIcon />
                    </IconButton>
                    <IconButton size="small">
                      <ShareIcon />
                    </IconButton>
                  </Box>
                </Box>

                <Box sx={{ mb: 3 }}>
                  <Grid container spacing={2}>
                    <Grid item xs={6} md={3}>
                      <Typography variant="subtitle2" color="text.secondary">
                        סוג חוזה
                      </Typography>
                      <Typography variant="body1">
                        {selectedFlow.type}
                      </Typography>
                    </Grid>
                    <Grid item xs={6} md={3}>
                      <Typography variant="subtitle2" color="text.secondary">
                        ערך
                      </Typography>
                      <Typography variant="body1">
                        {selectedFlow.value}
                      </Typography>
                    </Grid>
                    <Grid item xs={6} md={3}>
                      <Typography variant="subtitle2" color="text.secondary">
                        תאריך התחלה
                      </Typography>
                      <Typography variant="body1">
                        {selectedFlow.startDate}
                      </Typography>
                    </Grid>
                    <Grid item xs={6} md={3}>
                      <Typography variant="subtitle2" color="text.secondary">
                        תאריך יעד
                      </Typography>
                      <Typography variant="body1">
                        {selectedFlow.endDate}
                      </Typography>
                    </Grid>
                  </Grid>
                </Box>

                <Tabs value={selectedTab} onChange={handleTabChange} sx={{ mb: 3 }}>
                  <Tab label="תהליך העבודה" />
                  <Tab label="מסמכים" />
                  <Tab label="סיכונים" />
                  <Tab label="סטטיסטיקות" />
                </Tabs>

                {selectedTab === 0 && (
                  <Stepper orientation="vertical" activeStep={activeStep}>
                    {selectedFlow.steps.map((step, index) => (
                      <Step key={step.id} completed={step.status === 'completed'}>
                        <StepLabel
                          StepIconComponent={() => (
                            <Badge
                              badgeContent={step.documents.length}
                              color="primary"
                            >
                              <AssignmentIcon color={getIconColor(step.status)} />
                            </Badge>
                          )}
                        >
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Typography variant="h6">
                              {step.title}
                            </Typography>
                            <Chip
                              label={step.status}
                              color={getStatusColor(step.status)}
                              size="small"
                            />
                            <IconButton
                              size="small"
                              onClick={() => handleStepClick(step.id)}
                            >
                              {expandedStep === step.id ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                            </IconButton>
                          </Box>
                        </StepLabel>
                        <StepContent>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                            {step.description}
                          </Typography>
                          
                          <Collapse in={expandedStep === step.id}>
                            <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                              <Grid container spacing={2}>
                                <Grid item xs={12} md={6}>
                                  <Typography variant="subtitle2" gutterBottom>
                                    פרטי השלב
                                  </Typography>
                                  <List dense>
                                    <ListItem>
                                      <ListItemIcon>
                                        <ScheduleIcon fontSize="small" />
                                      </ListItemIcon>
                                      <ListItemText primary={`משך: ${step.duration}`} />
                                    </ListItem>
                                    <ListItem>
                                      <ListItemIcon>
                                        <BusinessIcon fontSize="small" />
                                      </ListItemIcon>
                                      <ListItemText primary={`ממונה: ${step.assignee}`} />
                                    </ListItem>
                                  </List>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                  <Typography variant="subtitle2" gutterBottom>
                                    מסמכים
                                  </Typography>
                                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                    {step.documents.map((doc, docIndex) => (
                                      <Chip
                                        key={docIndex}
                                        label={doc}
                                        size="small"
                                        variant="outlined"
                                        icon={<DescriptionIcon />}
                                      />
                                    ))}
                                  </Box>
                                </Grid>
                                {step.risks.length > 0 && (
                                  <Grid item xs={12}>
                                    <Typography variant="subtitle2" gutterBottom>
                                      סיכונים
                                    </Typography>
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                      {step.risks.map((risk, riskIndex) => (
                                        <Chip
                                          key={riskIndex}
                                          label={risk}
                                          size="small"
                                          color="warning"
                                          variant="outlined"
                                          icon={<WarningIcon />}
                                        />
                                      ))}
                                    </Box>
                                  </Grid>
                                )}
                              </Grid>
                            </Box>
                          </Collapse>

                          <Box sx={{ mt: 2 }}>
                            <Button
                              variant="outlined"
                              size="small"
                              startIcon={<PlayArrowIcon />}
                              disabled={step.status === 'completed'}
                            >
                              התחל שלב
                            </Button>
                          </Box>
                        </StepContent>
                      </Step>
                    ))}
                  </Stepper>
                )}

                {selectedTab === 1 && (
                  <Box>
                    <Typography variant="h6" gutterBottom>
                      מסמכים קשורים
                    </Typography>
                    <Grid container spacing={2}>
                      {selectedFlow.steps.flatMap(step => 
                        step.documents.map((doc, index) => (
                          <Grid item xs={12} sm={6} md={4} key={`${step.id}-${index}`}>
                            <Card variant="outlined">
                              <CardContent>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  <DescriptionIcon color="primary" />
                                  <Typography variant="body2" sx={{ flexGrow: 1 }}>
                                    {doc}
                                  </Typography>
                                </Box>
                                <Typography variant="caption" color="text.secondary">
                                  שלב: {step.title}
                                </Typography>
                              </CardContent>
                              <CardActions>
                                <Button size="small">צפייה</Button>
                                <Button size="small">הורדה</Button>
                              </CardActions>
                            </Card>
                          </Grid>
                        ))
                      )}
                    </Grid>
                  </Box>
                )}

                {selectedTab === 2 && (
                  <Box>
                    <Typography variant="h6" gutterBottom>
                      ניתוח סיכונים
                    </Typography>
                    <Grid container spacing={2}>
                      {selectedFlow.steps.map(step => 
                        step.risks.map((risk, index) => (
                          <Grid item xs={12} sm={6} key={`${step.id}-${index}`}>
                            <Alert severity="warning" sx={{ mb: 1 }}>
                              <Typography variant="subtitle2">
                                {risk}
                              </Typography>
                              <Typography variant="body2">
                                שלב: {step.title}
                              </Typography>
                            </Alert>
                          </Grid>
                        ))
                      )}
                    </Grid>
                  </Box>
                )}

                {selectedTab === 3 && (
                  <Box>
                    <Typography variant="h6" gutterBottom>
                      סטטיסטיקות זרימה
                    </Typography>
                    <Grid container spacing={3}>
                      <Grid item xs={12} md={6}>
                        <Card>
                          <CardContent>
                            <Typography variant="h6" gutterBottom>
                              התקדמות כללית
                            </Typography>
                            <LinearProgress
                              variant="determinate"
                              value={selectedFlow.progress}
                              sx={{ height: 10, borderRadius: 5, mb: 2 }}
                            />
                            <Typography variant="body2">
                              {selectedFlow.progress}% הושלם
                            </Typography>
                          </CardContent>
                        </Card>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Card>
                          <CardContent>
                            <Typography variant="h6" gutterBottom>
                              זמן שנותר
                            </Typography>
                            <Typography variant="h4" color="primary">
                              23 ימים
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              עד תאריך היעד
                            </Typography>
                          </CardContent>
                        </Card>
                      </Grid>
                    </Grid>
                  </Box>
                )}
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent>
                <Typography variant="h6" textAlign="center" color="text.secondary">
                  בחר זרימה מהרשימה כדי לצפות בפרטים
                </Typography>
              </CardContent>
            </Card>
          )}
        </Grid>
      </Grid>

      {/* Create Flow Dialog */}
      <Dialog open={showFlowDialog} onClose={() => setShowFlowDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>צור זרימה חדשה</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              פרטי הזרימה
            </Typography>
            {/* Add form fields here */}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowFlowDialog(false)}>ביטול</Button>
          <Button onClick={handleSaveFlow} variant="contained">צור זרימה</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default FlowMapPage;



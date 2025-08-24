import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Tooltip,
  Alert,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Tabs,
  Tab,
  Paper,
  Snackbar
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  ContentCopy as ContentCopyIcon,
  Download as DownloadIcon,
  Share as ShareIcon,
  Star as StarIcon,
  Search as SearchIcon,
  SmartToy as AIIcon,
  AutoFixHigh as AutoFixIcon,
  Psychology as PsychologyIcon,
  TrendingUp as TrendingIcon,
  Category as CategoryIcon,
  Description as DescriptionIcon,
  Code as CodeIcon
} from '@mui/icons-material';


interface Template {
  id: string;
  name: string;
  hebrewName: string;
  description: string;
  category: string;
  contractType: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  tags: string[];
  rating: number;
  downloads: number;
  lastUpdated: Date;
  isAIEnhanced: boolean;
  hasVariables: boolean;
  variables: TemplateVariable[];
  content: string;
  preview: string;
  aiSuggestions: string[];
  usageStats: {
    totalUses: number;
    successRate: number;
    averageRating: number;
    commonIssues: string[];
  };
}

interface TemplateVariable {
  name: string;
  type: 'text' | 'number' | 'date' | 'select' | 'boolean';
  label: string;
  required: boolean;
  defaultValue?: string | number | boolean;
  options?: string[];
  description: string;
}

interface TemplateCategory {
  id: string;
  name: string;
  hebrewName: string;
  description: string;
  icon: React.ReactNode;
  count: number;
}

const ContractTemplatesPage: React.FC = () => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [categories, setCategories] = useState<TemplateCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [filterBy, setFilterBy] = useState('all');
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isPreviewDialogOpen, setIsPreviewDialogOpen] = useState(false);
  const [isAIDialogOpen, setIsAIDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'info' | 'warning';
  }>({
    open: false,
    message: '',
    severity: 'info'
  });

  useEffect(() => {
    loadTemplates();
    loadCategories();
  }, []);

  const showSnackbar = (message: string, severity: 'success' | 'error' | 'info' | 'warning' = 'info') => {
    setSnackbar({
      open: true,
      message,
      severity
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const loadTemplates = () => {
    // Mock data - replace with actual API call
    const mockTemplates: Template[] = [
      {
        id: '1',
        name: 'Commercial Lease Agreement',
        hebrewName: 'חוזה שכירות מסחרי',
        description: 'Comprehensive commercial lease agreement with AI-enhanced clauses',
        category: 'Real Estate',
        contractType: 'Lease',
        difficulty: 'Medium',
        tags: ['commercial', 'lease', 'property', 'business'],
        rating: 4.5,
        downloads: 1250,
        lastUpdated: new Date('2024-01-15'),
        isAIEnhanced: true,
        hasVariables: true,
        variables: [
          {
            name: 'tenantName',
            type: 'text',
            label: 'Tenant Name',
            required: true,
            description: 'Full legal name of the tenant'
          },
          {
            name: 'propertyAddress',
            type: 'text',
            label: 'Property Address',
            required: true,
            description: 'Complete property address'
          },
          {
            name: 'monthlyRent',
            type: 'number',
            label: 'Monthly Rent',
            required: true,
            description: 'Monthly rent amount in local currency'
          },
          {
            name: 'leaseTerm',
            type: 'select',
            label: 'Lease Term',
            required: true,
            options: ['1 year', '2 years', '3 years', '5 years'],
            description: 'Duration of the lease agreement'
          }
        ],
        content: 'This is a comprehensive commercial lease agreement...',
        preview: 'Commercial lease agreement template with standard clauses...',
        aiSuggestions: [
          'Add force majeure clause for pandemic situations',
          'Include digital signature provisions',
          'Add maintenance responsibility matrix'
        ],
        usageStats: {
          totalUses: 1250,
          successRate: 92,
          averageRating: 4.5,
          commonIssues: ['Rent escalation clauses', 'Maintenance responsibilities', 'Subletting provisions']
        }
      },
      {
        id: '2',
        name: 'Service Level Agreement',
        hebrewName: 'הסכם רמת שירות',
        description: 'IT service level agreement with performance metrics',
        category: 'Technology',
        contractType: 'Service',
        difficulty: 'Hard',
        tags: ['IT', 'SLA', 'service', 'performance'],
        rating: 4.8,
        downloads: 890,
        lastUpdated: new Date('2024-01-10'),
        isAIEnhanced: true,
        hasVariables: true,
        variables: [
          {
            name: 'serviceProvider',
            type: 'text',
            label: 'Service Provider',
            required: true,
            description: 'Name of the service provider'
          },
          {
            name: 'uptimeRequirement',
            type: 'select',
            label: 'Uptime Requirement',
            required: true,
            options: ['99.5%', '99.9%', '99.99%'],
            description: 'Required system uptime percentage'
          }
        ],
        content: 'This Service Level Agreement (SLA) defines...',
        preview: 'IT service level agreement with detailed performance metrics...',
        aiSuggestions: [
          'Include cybersecurity requirements',
          'Add disaster recovery provisions',
          'Specify data backup requirements'
        ],
        usageStats: {
          totalUses: 890,
          successRate: 88,
          averageRating: 4.8,
          commonIssues: ['Performance metrics definition', 'Penalty calculations', 'Escalation procedures']
        }
      }
    ];

    setTemplates(mockTemplates);
  };

  const loadCategories = () => {
    const mockCategories: TemplateCategory[] = [
      {
        id: 'all',
        name: 'All Templates',
        hebrewName: 'כל התבניות',
        description: 'All available contract templates',
        icon: <DescriptionIcon />,
        count: templates.length
      },
      {
        id: 'real-estate',
        name: 'Real Estate',
        hebrewName: 'נדל"ן',
        description: 'Property and real estate contracts',
        icon: <CategoryIcon />,
        count: templates.filter(t => t.category === 'Real Estate').length
      },
      {
        id: 'technology',
        name: 'Technology',
        hebrewName: 'טכנולוגיה',
        description: 'IT and technology contracts',
        icon: <CodeIcon />,
        count: templates.filter(t => t.category === 'Technology').length
      },
      {
        id: 'business',
        name: 'Business',
        hebrewName: 'עסקי',
        description: 'General business contracts',
        icon: <TrendingIcon />,
        count: templates.filter(t => t.category === 'Business').length
      }
    ];

    setCategories(mockCategories);
  };

  const filteredTemplates = templates.filter(template => {
    const matchesCategory = selectedCategory === 'all' || template.category.toLowerCase().includes(selectedCategory);
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesFilter = filterBy === 'all' || 
                         (filterBy === 'ai' && template.isAIEnhanced) ||
                         (filterBy === 'variables' && template.hasVariables);

    return matchesCategory && matchesSearch && matchesFilter;
  });

  const sortedTemplates = [...filteredTemplates].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'rating':
        return b.rating - a.rating;
      case 'downloads':
        return b.downloads - a.downloads;
      case 'date':
        return b.lastUpdated.getTime() - a.lastUpdated.getTime();
      default:
        return 0;
    }
  });

  const handleCreateTemplate = () => {
    setIsCreateDialogOpen(true);
  };

  const handleEditTemplate = (template: Template) => {
    setSelectedTemplate(template);
    setIsEditDialogOpen(true);
  };

  const handlePreviewTemplate = (template: Template) => {
    setSelectedTemplate(template);
    setIsPreviewDialogOpen(true);
  };

  const handleAIAnalysis = (template: Template) => {
    setSelectedTemplate(template);
    setIsAIDialogOpen(true);
  };

  const handleDownloadTemplate = async (template: Template) => {
    try {
      setIsLoading(true);
      // Simulate download process
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update download count
      setTemplates(prev => prev.map(t => 
        t.id === template.id 
          ? { ...t, downloads: t.downloads + 1 }
          : t
      ));
      
      showSnackbar(`תבנית "${template.hebrewName}" הורדה בהצלחה`, 'success');
    } catch (error) {
      showSnackbar('שגיאה בהורדת התבנית', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyTemplate = async (template: Template) => {
    try {
      await navigator.clipboard.writeText(template.content);
      showSnackbar(`תוכן התבנית "${template.hebrewName}" הועתק ללוח`, 'success');
    } catch (error) {
      showSnackbar('שגיאה בהעתקת התבנית', 'error');
    }
  };

  const handleShareTemplate = (template: Template) => {
    try {
      // Create shareable link
      const shareUrl = `${window.location.origin}/contract-templates/${template.id}`;
      
      if (navigator.share) {
        navigator.share({
          title: template.hebrewName,
          text: template.description,
          url: shareUrl
        });
      } else {
        // Fallback: copy to clipboard
        navigator.clipboard.writeText(shareUrl);
        showSnackbar(`קישור התבנית "${template.hebrewName}" הועתק ללוח`, 'success');
      }
    } catch (error) {
      showSnackbar('שגיאה בשיתוף התבנית', 'error');
    }
  };

  const handleDeleteTemplate = (template: Template) => {
    if (window.confirm(`האם אתה בטוח שברצונך למחוק את התבנית "${template.hebrewName}"?`)) {
      setTemplates(prev => prev.filter(t => t.id !== template.id));
      showSnackbar(`תבנית "${template.hebrewName}" נמחקה בהצלחה`, 'success');
    }
  };

  const handleSaveTemplate = () => {
    // Mock save functionality
    showSnackbar('התבנית נשמרה בהצלחה', 'success');
    setIsEditDialogOpen(false);
  };

  const handleCreateNewTemplate = () => {
    // Mock create functionality
    showSnackbar('תבנית חדשה נוצרה בהצלחה', 'success');
    setIsCreateDialogOpen(false);
  };

  const handleApplyAISuggestions = () => {
    showSnackbar('הצעות ה-AI הוחלו בהצלחה', 'success');
    setIsAIDialogOpen(false);
  };

  const renderTemplateCard = (template: Template) => (
    <Card key={template.id} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ flexGrow: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Typography variant="h6" component="h2" gutterBottom>
            {template.hebrewName}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            {template.isAIEnhanced && (
              <Tooltip title="AI Enhanced">
                <AIIcon color="primary" fontSize="small" />
              </Tooltip>
            )}
            {template.hasVariables && (
              <Tooltip title="Has Variables">
                <AutoFixIcon color="secondary" fontSize="small" />
              </Tooltip>
            )}
          </Box>
        </Box>

        <Typography variant="body2" color="text.secondary" gutterBottom>
          {template.description}
        </Typography>

        <Box sx={{ display: 'flex', gap: 0.5, mb: 2, flexWrap: 'wrap' }}>
          {template.tags.slice(0, 3).map((tag) => (
            <Chip key={tag} label={tag} size="small" variant="outlined" />
          ))}
          {template.tags.length > 3 && (
            <Chip label={`+${template.tags.length - 3}`} size="small" variant="outlined" />
          )}
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <StarIcon sx={{ color: 'warning.main', fontSize: 16 }} />
            <Typography variant="body2">{template.rating}</Typography>
          </Box>
          <Typography variant="body2" color="text.secondary">
            {template.downloads} downloads
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Chip 
            label={template.difficulty} 
            size="small" 
            color={template.difficulty === 'Easy' ? 'success' : template.difficulty === 'Medium' ? 'warning' : 'error'}
          />
          <Typography variant="caption" color="text.secondary">
            Updated: {template.lastUpdated.toLocaleDateString()}
          </Typography>
        </Box>
      </CardContent>

      <CardActions sx={{ justifyContent: 'space-between', p: 2 }}>
        <Box>
          <Button size="small" onClick={() => handlePreviewTemplate(template)}>
            Preview
          </Button>
          <Button size="small" onClick={() => handleAIAnalysis(template)}>
            AI Analysis
          </Button>
        </Box>
        <Box>
          <Tooltip title="Edit Template">
            <IconButton size="small" onClick={() => handleEditTemplate(template)}>
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Download">
            <IconButton size="small" onClick={() => handleDownloadTemplate(template)}>
              <DownloadIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Copy">
            <IconButton size="small" onClick={() => handleCopyTemplate(template)}>
              <ContentCopyIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Share">
            <IconButton size="small" onClick={() => handleShareTemplate(template)}>
              <ShareIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton size="small" onClick={() => handleDeleteTemplate(template)} color="error">
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </CardActions>
    </Card>
  );

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          ניהול תבניות חוזים
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleCreateTemplate}
        >
                      צור תבנית חדשה
        </Button>
      </Box>

      {/* Filters and Search */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              placeholder="חפש תבניות..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
              }}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>קטגוריה</InputLabel>
              <Select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                                  label="קטגוריה"
              >
                {categories.map((category) => (
                  <MenuItem key={category.id} value={category.id}>
                    {category.hebrewName} ({category.count})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={2}>
            <FormControl fullWidth>
              <InputLabel>סנן</InputLabel>
              <Select
                value={filterBy}
                onChange={(e) => setFilterBy(e.target.value)}
                label="סנן"
              >
                <MenuItem value="all">הכל</MenuItem>
                <MenuItem value="ai">מוגבר AI</MenuItem>
                <MenuItem value="variables">עם משתנים</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>מיין לפי</InputLabel>
              <Select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                label="מיין לפי"
              >
                <MenuItem value="name">שם</MenuItem>
                <MenuItem value="rating">דירוג</MenuItem>
                <MenuItem value="downloads">הורדות</MenuItem>
                <MenuItem value="date">תאריך</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      {/* Statistics */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                סה"כ תבניות
              </Typography>
              <Typography variant="h4">{templates.length}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                מוגבר AI
              </Typography>
              <Typography variant="h4">
                {templates.filter(t => t.isAIEnhanced).length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                סה"כ הורדות
              </Typography>
              <Typography variant="h4">
                {templates.reduce((sum, t) => sum + t.downloads, 0)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                דירוג ממוצע
              </Typography>
              <Typography variant="h4">
                {templates.length > 0 ? (templates.reduce((sum, t) => sum + t.rating, 0) / templates.length).toFixed(1) : '0.0'}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Templates Grid */}
      {isLoading ? (
        <Box sx={{ width: '100%' }}>
          <LinearProgress />
        </Box>
      ) : (
        <Grid container spacing={3}>
          {sortedTemplates.map(renderTemplateCard)}
        </Grid>
      )}

      {/* Create Template Dialog */}
      <Dialog open={isCreateDialogOpen} onClose={() => setIsCreateDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>צור תבנית חדשה</DialogTitle>
        <DialogContent>
          <Typography>Create new template form will go here...</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsCreateDialogOpen(false)}>
            ביטול
          </Button>
          <Button variant="contained" onClick={handleCreateNewTemplate}>
            צור
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Template Dialog */}
      <Dialog open={isEditDialogOpen} onClose={() => setIsEditDialogOpen(false)} maxWidth="lg" fullWidth>
        <DialogTitle>ערוך תבנית</DialogTitle>
        <DialogContent>
          {selectedTemplate && (
            <Box>
              <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
                <Tab label="מידע בסיסי" />
                <Tab label="תוכן" />
                <Tab label="משתנים" />
                <Tab label="הגדרות AI" />
              </Tabs>
              <Box sx={{ mt: 2 }}>
                {activeTab === 0 && (
                  <Typography>Basic information form...</Typography>
                )}
                {activeTab === 1 && (
                  <Typography>Content editor...</Typography>
                )}
                {activeTab === 2 && (
                  <Typography>Variables configuration...</Typography>
                )}
                {activeTab === 3 && (
                  <Typography>AI enhancement settings...</Typography>
                )}
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsEditDialogOpen(false)}>
            ביטול
          </Button>
          <Button variant="contained" onClick={handleSaveTemplate}>
            שמור
          </Button>
        </DialogActions>
      </Dialog>

      {/* Preview Dialog */}
      <Dialog open={isPreviewDialogOpen} onClose={() => setIsPreviewDialogOpen(false)} maxWidth="lg" fullWidth>
        <DialogTitle>תצוגה מקדימה</DialogTitle>
        <DialogContent>
          {selectedTemplate && (
            <Box>
              <Typography variant="h6" gutterBottom>{selectedTemplate.hebrewName}</Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                {selectedTemplate.description}
              </Typography>
              <Paper sx={{ p: 2, bgcolor: 'grey.50' }}>
                <Typography variant="body2" component="pre" sx={{ whiteSpace: 'pre-wrap' }}>
                  {selectedTemplate.preview}
                </Typography>
              </Paper>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsPreviewDialogOpen(false)}>
            סגור
          </Button>
          <Button variant="contained" onClick={() => selectedTemplate && handleDownloadTemplate(selectedTemplate)}>
            הורד
          </Button>
        </DialogActions>
      </Dialog>

      {/* AI Analysis Dialog */}
      <Dialog open={isAIDialogOpen} onClose={() => setIsAIDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <AIIcon />
            ניתוח AI
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedTemplate && (
            <Box>
              <Typography variant="h6" gutterBottom>{selectedTemplate.hebrewName}</Typography>
              
              <Alert severity="info" sx={{ mb: 2 }}>
                AI analysis provides suggestions for improving your template
              </Alert>

              <Typography variant="h6" gutterBottom>
                הצעות AI
              </Typography>
              <List>
                {selectedTemplate.aiSuggestions.map((suggestion, index) => (
                  <ListItem key={index}>
                    <ListItemIcon>
                      <PsychologyIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText primary={suggestion} />
                  </ListItem>
                ))}
              </List>

              <Divider sx={{ my: 2 }} />

              <Typography variant="h6" gutterBottom>
                סטטיסטיקות שימוש
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    סה"כ שימושים
                  </Typography>
                  <Typography variant="h6">{selectedTemplate.usageStats.totalUses}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    אחוז הצלחה
                  </Typography>
                  <Typography variant="h6">{selectedTemplate.usageStats.successRate}%</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    דירוג ממוצע
                  </Typography>
                  <Typography variant="h6">{selectedTemplate.usageStats.averageRating}</Typography>
                </Grid>
              </Grid>

              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                בעיות נפוצות
              </Typography>
              <List dense>
                {selectedTemplate.usageStats.commonIssues.map((issue, index) => (
                  <ListItem key={index}>
                    <ListItemText primary={issue} />
                  </ListItem>
                ))}
              </List>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsAIDialogOpen(false)}>
            סגור
          </Button>
          <Button variant="contained" startIcon={<AutoFixIcon />} onClick={handleApplyAISuggestions}>
            החל הצעות
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default ContractTemplatesPage;

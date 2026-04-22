import React, { useMemo, useState, useEffect, useCallback } from 'react';
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
  Snackbar,
  Switch,
  FormControlLabel,
  useTheme,
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
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import { getMockTemplates } from './mock';
import type { Template, TemplateVariable } from './types';

interface TemplateCategory {
  id: string;
  name: string;
  hebrewName: string;
  description: string;
  icon: React.ReactNode;
  count: number;
}

const ContractTemplatesPage: React.FC = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const [searchParams, setSearchParams] = useSearchParams();

  const [templates, setTemplates] = useState<Template[]>([]);
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
  const [createDraft, setCreateDraft] = useState<Partial<Template>>({
    name: '',
    hebrewName: '',
    description: '',
    category: 'Real Estate',
    contractType: 'General',
    difficulty: 'Easy',
    tags: [],
    isAIEnhanced: false,
    hasVariables: false,
    variables: [],
    content: '',
    preview: '',
    aiSuggestions: [],
    rating: 0,
    downloads: 0,
    lastUpdated: new Date(),
    usageStats: {
      totalUses: 0,
      successRate: 0,
      averageRating: 0,
      commonIssues: [],
    },
  });
  const [createTagsText, setCreateTagsText] = useState<string>('');
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'info' | 'warning';
  }>({
    open: false,
    message: '',
    severity: 'info'
  });

  const loadTemplates = useCallback(async () => {
    try {
      setIsLoading(true);
      // Simulate load delay
      await new Promise(resolve => setTimeout(resolve, 250));
      setTemplates(getMockTemplates());
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadTemplates();
  }, [loadTemplates]);

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

  const categories: TemplateCategory[] = useMemo(() => {
    const categoryMeta: Array<{ id: string; hebrewName: string; icon: React.ReactNode }> = [
      { id: 'Real Estate', hebrewName: 'נדל"ן', icon: <CategoryIcon /> },
      { id: 'Technology', hebrewName: 'טכנולוגיה', icon: <CodeIcon /> },
      { id: 'Business', hebrewName: 'עסקי', icon: <TrendingIcon /> },
    ]

    const computed = categoryMeta.map((c) => ({
      id: c.id,
      name: c.id,
      hebrewName: c.hebrewName,
      description: '',
      icon: c.icon,
      count: templates.filter((t) => t.category === c.id).length,
    }))

    return [
      {
        id: 'all',
        name: 'All',
        hebrewName: 'כל התבניות',
        description: '',
        icon: <DescriptionIcon />,
        count: templates.length,
      },
      ...computed,
    ]
  }, [templates])

  const filteredTemplates = templates.filter(template => {
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
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
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set('template', template.id);
      return next;
    });
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
    const hebrewName = (createDraft.hebrewName || '').trim();
    if (!hebrewName) {
      showSnackbar('נא להזין שם תבנית בעברית', 'warning');
      return;
    }

    const name = (createDraft.name || hebrewName).trim();
    const newTemplate: Template = {
      id: String(Date.now()),
      name,
      hebrewName,
      description: (createDraft.description || '').trim(),
      category: (createDraft.category as string) || 'Business',
      contractType: (createDraft.contractType as string) || 'General',
      difficulty: (createDraft.difficulty as Template['difficulty']) || 'Easy',
      tags: createTagsText
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
      rating: 0,
      downloads: 0,
      lastUpdated: new Date(),
      isAIEnhanced: Boolean(createDraft.isAIEnhanced),
      hasVariables: Boolean(createDraft.hasVariables),
      variables: (createDraft.variables as TemplateVariable[]) || [],
      content: (createDraft.content as string) || '',
      preview: (createDraft.preview as string) || (createDraft.description as string) || '',
      aiSuggestions: (createDraft.aiSuggestions as string[]) || [],
      usageStats: createDraft.usageStats as Template['usageStats'],
    };

    setTemplates((prev) => [newTemplate, ...prev]);
    showSnackbar('תבנית חדשה נוצרה בהצלחה', 'success');
    setIsCreateDialogOpen(false);
    setCreateDraft((prev) => ({
      ...prev,
      name: '',
      hebrewName: '',
      description: '',
      content: '',
      preview: '',
      isAIEnhanced: false,
      hasVariables: false,
    }));
    setCreateTagsText('');
  };

  // Open template preview via share link (?template=<id>)
  useEffect(() => {
    const templateId = searchParams.get('template');
    if (!templateId || templates.length === 0) return;
    const template = templates.find((t) => t.id === templateId);
    if (!template) return;
    setSelectedTemplate(template);
    setIsPreviewDialogOpen(true);
  }, [searchParams, templates]);

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
              <Tooltip title="מוגבר AI">
                <AIIcon color="primary" fontSize="small" />
              </Tooltip>
            )}
            {template.hasVariables && (
              <Tooltip title="כולל משתנים">
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
            {template.downloads.toLocaleString()} {t('contractTemplates.downloads', { defaultValue: 'הורדות' })}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Chip 
            label={template.difficulty} 
            size="small" 
            color={template.difficulty === 'Easy' ? 'success' : template.difficulty === 'Medium' ? 'warning' : 'error'}
          />
          <Typography variant="caption" color="text.secondary">
            {t('contractTemplates.lastUpdated', { defaultValue: 'עודכן לאחרונה' })}: {template.lastUpdated.toLocaleDateString()}
          </Typography>
        </Box>
      </CardContent>

      <CardActions sx={{ justifyContent: 'space-between', p: 2 }}>
        <Box>
          <Button size="small" onClick={() => handlePreviewTemplate(template)}>
            {t('contractTemplates.preview', { defaultValue: 'תצוגה מקדימה' })}
          </Button>
          <Button size="small" onClick={() => handleAIAnalysis(template)}>
            ניתוח AI
          </Button>
        </Box>
        <Box>
          <Tooltip title="ערוך">
            <IconButton aria-label="ערוך" size="small" onClick={() => handleEditTemplate(template)}>
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title={t('contractTemplates.download', { defaultValue: 'הורד' })}>
            <IconButton size="small" onClick={() => handleDownloadTemplate(template)}>
              <DownloadIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="העתק">
            <IconButton aria-label="העתק" size="small" onClick={() => handleCopyTemplate(template)}>
              <ContentCopyIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="שתף">
            <IconButton aria-label="שתף" size="small" onClick={() => handleShareTemplate(template)}>
              <ShareIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="מחק">
            <IconButton aria-label="מחק" size="small" onClick={() => handleDeleteTemplate(template)} color="error">
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
          {t('contractTemplates.title', { defaultValue: 'תבניות חוזים' })}
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
              placeholder={t('contractTemplates.searchTemplates', { defaultValue: 'חיפוש תבניות...' })}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
              }}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>{t('contractTemplates.category', { defaultValue: 'קטגוריה' })}</InputLabel>
              <Select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                label={t('contractTemplates.category', { defaultValue: 'קטגוריה' })}
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
      ) : sortedTemplates.length === 0 ? (
        <Alert severity="info">
          לא נמצאו תבניות מתאימות. נסה לשנות חיפוש/סינון.
        </Alert>
      ) : (
        <Grid container spacing={3}>
          {sortedTemplates.map(renderTemplateCard)}
        </Grid>
      )}

      {/* Create Template Dialog */}
      <Dialog open={isCreateDialogOpen} onClose={() => setIsCreateDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>צור תבנית חדשה</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 0.5 }}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="שם בעברית"
                value={createDraft.hebrewName || ''}
                onChange={(e) => setCreateDraft((p) => ({ ...p, hebrewName: e.target.value }))}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="שם (EN)"
                value={createDraft.name || ''}
                onChange={(e) => setCreateDraft((p) => ({ ...p, name: e.target.value }))}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="תיאור"
                value={createDraft.description || ''}
                onChange={(e) => setCreateDraft((p) => ({ ...p, description: e.target.value }))}
                multiline
                minRows={3}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>קטגוריה</InputLabel>
                <Select
                  label="קטגוריה"
                  value={(createDraft.category as string) || 'Real Estate'}
                  onChange={(e) => setCreateDraft((p) => ({ ...p, category: e.target.value as string }))}
                >
                  <MenuItem value="Real Estate">נדל&quot;ן</MenuItem>
                  <MenuItem value="Technology">טכנולוגיה</MenuItem>
                  <MenuItem value="Business">עסקי</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>רמת קושי</InputLabel>
                <Select
                  label="רמת קושי"
                  value={(createDraft.difficulty as string) || 'Easy'}
                  onChange={(e) => setCreateDraft((p) => ({ ...p, difficulty: e.target.value as Template['difficulty'] }))}
                >
                  <MenuItem value="Easy">קל</MenuItem>
                  <MenuItem value="Medium">בינוני</MenuItem>
                  <MenuItem value="Hard">קשה</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="תגיות (מופרד בפסיקים)"
                value={createTagsText}
                onChange={(e) => setCreateTagsText(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControlLabel
                control={<Switch checked={Boolean(createDraft.isAIEnhanced)} onChange={(e) => setCreateDraft((p) => ({ ...p, isAIEnhanced: e.target.checked }))} />}
                label="מוגבר AI"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControlLabel
                control={<Switch checked={Boolean(createDraft.hasVariables)} onChange={(e) => setCreateDraft((p) => ({ ...p, hasVariables: e.target.checked }))} />}
                label="כולל משתנים"
              />
            </Grid>
          </Grid>
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
                ניתוח AI מציע המלצות לשיפור התבנית שלך
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
        anchorOrigin={{ vertical: 'bottom', horizontal: theme.direction === 'rtl' ? 'left' : 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default ContractTemplatesPage;

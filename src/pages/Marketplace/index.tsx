import React, { useState, useEffect } from 'react'
import { 
  Box, 
  Container, 
  Typography, 
  Button, 
  Grid, 
  Card, 
  CardContent, 
  Chip,
  Rating,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tabs,
  Tab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  IconButton,
  Alert,
  LinearProgress
} from '@mui/material'
import { 
  Store, 
  Download, 
  Star, 
  Search, 
  Favorite,
  Share,
  Preview,
  TrendingUp,
  Verified
} from '@mui/icons-material'

import jsPDF from 'jspdf'

interface Template {
  id: string
  title: string
  description: string
  category: string
  rating: number
  downloads: number
  price: string
  author: string
  authorVerified: boolean
  tags: string[]
  lastUpdated: string
  fileSize: string
  preview: string
  reviews: Review[]
  isNew?: boolean
  isTrending?: boolean
  isPremium?: boolean
}

interface Review {
  id: string
  author: string
  rating: number
  comment: string
  date: string
  helpful: number
}

export const MarketplacePage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [priceFilter, setPriceFilter] = useState('all')
  const [sortBy, setSortBy] = useState('popular')
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null)
  const [showPreviewDialog, setShowPreviewDialog] = useState(false)
  const [activeTab, setActiveTab] = useState(0)

  const [templates, setTemplates] = useState<Template[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  // Fallback default templates (used if fetch fails)
  const defaultTemplates: Template[] = [
    {
      id: '1',
      title: 'חוזה שכירות דירה מקיף',
      description: 'תבנית מקיפה לחוזה שכירות דירה עם כל הסעיפים הנדרשים, כולל תחזוקה, פיקדון, ותנאי סיום',
      category: 'שכירות',
      rating: 4.8,
      downloads: 1250,
      price: 'חינם',
      author: 'משרד עו״ד כהן',
      authorVerified: true,
      tags: ['שכירות', 'דירה', 'פיקדון', 'תחזוקה'],
      lastUpdated: '2024-01-15',
      fileSize: '2.3 MB',
      preview: 'תבנית זו כוללת את כל הסעיפים הנדרשים בחוזה שכירות דירה...',
      isNew: true,
      reviews: []
    }
  ]

  useEffect(() => {
    let isMounted = true
    const load = async () => {
      try {
        setLoading(true)
        const res = await fetch('/templates.json', { cache: 'no-cache' })
        if (!res.ok) throw new Error('Failed to load templates.json')
        const data: Template[] = await res.json()
        if (isMounted) setTemplates(Array.isArray(data) ? data : defaultTemplates)
      } catch (e) {
        console.error('Marketplace load error:', e)
        setError('שגיאה בטעינת תבניות, נטען נתוני ברירת מחדל')
        setTemplates(defaultTemplates)
      } finally {
        if (isMounted) setLoading(false)
      }
    }
    load()
    return () => { isMounted = false }
  }, [])

  const categories = [
    { value: 'all', label: 'הכל' },
    { value: 'שכירות', label: 'שכירות' },
    { value: 'עבודה', label: 'עבודה' },
    { value: 'מכר', label: 'מכר' },
    { value: 'שותפות', label: 'שותפות' },
    { value: 'שירותים', label: 'שירותים' },
    { value: 'סודיות', label: 'סודיות' }
  ]

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesCategory = categoryFilter === 'all' || template.category === categoryFilter
    const matchesPrice = priceFilter === 'all' || 
                        (priceFilter === 'free' && template.price === 'חינם') ||
                        (priceFilter === 'paid' && template.price !== 'חינם')
    return matchesSearch && matchesCategory && matchesPrice
  })

  const sortedTemplates = [...filteredTemplates].sort((a, b) => {
    switch (sortBy) {
      case 'popular':
        return b.downloads - a.downloads
      case 'rating':
        return b.rating - a.rating
      case 'newest':
        return new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime()
      case 'price-low':
        return parseFloat(a.price.replace(/[^\d]/g, '') || '0') - parseFloat(b.price.replace(/[^\d]/g, '') || '0')
      case 'price-high':
        return parseFloat(b.price.replace(/[^\d]/g, '') || '0') - parseFloat(a.price.replace(/[^\d]/g, '') || '0')
      default:
        return 0
    }
  })

  const handlePreview = (template: Template) => {
    setSelectedTemplate(template)
    setShowPreviewDialog(true)
  }

  const handleDownload = (template: Template) => {
    // Create PDF using jsPDF
    const doc = new jsPDF()
    
    // Add Hebrew font support
    doc.setFont('helvetica')
    
    // Title
    doc.setFontSize(20)
    doc.text(template.title, 20, 30)
    
    // Description
    doc.setFontSize(12)
    doc.text('תיאור:', 20, 50)
    doc.setFontSize(10)
    const descriptionLines = doc.splitTextToSize(template.description, 170)
    doc.text(descriptionLines, 20, 60)
    
    // Preview
    doc.setFontSize(12)
    doc.text('תצוגה מקדימה:', 20, 90)
    doc.setFontSize(10)
    const previewLines = doc.splitTextToSize(template.preview, 170)
    doc.text(previewLines, 20, 100)
    
    // Details
    doc.setFontSize(12)
    doc.text('פרטי התבנית:', 20, 140)
    doc.setFontSize(10)
    doc.text(`מחיר: ${template.price}`, 20, 150)
    doc.text(`מחבר: ${template.author}`, 20, 160)
    doc.text(`דירוג: ${template.rating}/5`, 20, 170)
    doc.text(`הורדות: ${template.downloads}`, 20, 180)
    doc.text(`גודל קובץ: ${template.fileSize}`, 20, 190)
    doc.text(`תאריך עדכון: ${template.lastUpdated}`, 20, 200)
    
    // Tags
    doc.text(`תגיות: ${template.tags.join(', ')}`, 20, 210)
    
    // Footer
    doc.setFontSize(8)
    doc.text('ContractLab Pro - Marketplace', 20, 280)
    
    // Save PDF
    doc.save(`${template.title.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`)
    
    console.log('Downloading template as PDF:', template.title)
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        {loading && (
          <Box sx={{ mb: 2 }}>
            <LinearProgress />
          </Box>
        )}
        {error && (
          <Alert severity="warning" sx={{ mb: 2 }}>{error}</Alert>
        )}
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h4" component="h1">
            שוק תבניות
          </Typography>
          <Button
            variant="contained"
            startIcon={<Store />}
            onClick={() => {/* Handle upload template */}}
          >
            העלה תבנית
          </Button>
        </Box>

        {/* Filters */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  placeholder="חיפוש תבניות..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} md={2}>
                <FormControl fullWidth>
                  <InputLabel>קטגוריה</InputLabel>
                  <Select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    label="קטגוריה"
                  >
                    {categories.map(category => (
                      <MenuItem key={category.value} value={category.value}>
                        {category.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={2}>
                <FormControl fullWidth>
                  <InputLabel>מחיר</InputLabel>
                  <Select
                    value={priceFilter}
                    onChange={(e) => setPriceFilter(e.target.value)}
                    label="מחיר"
                  >
                    <MenuItem value="all">הכל</MenuItem>
                    <MenuItem value="free">חינם</MenuItem>
                    <MenuItem value="paid">בתשלום</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={2}>
                <FormControl fullWidth>
                  <InputLabel>מיון</InputLabel>
                  <Select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    label="מיון"
                  >
                    <MenuItem value="popular">פופולרי</MenuItem>
                    <MenuItem value="rating">דירוג</MenuItem>
                    <MenuItem value="newest">חדש</MenuItem>
                    <MenuItem value="price-low">מחיר: נמוך לגבוה</MenuItem>
                    <MenuItem value="price-high">מחיר: גבוה לנמוך</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Templates Grid */}
        <Grid container spacing={3}>
          {sortedTemplates.map((template) => (
            <Grid item xs={12} md={6} lg={4} key={template.id}>
              <Card sx={{ 
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                '&:hover': {
                  boxShadow: 6,
                  transform: 'translateY(-2px)',
                  transition: 'all 0.2s ease-in-out'
                }
              }}>
                {/* Badges */}
                {template.isNew && (
                  <Chip
                    label="חדש"
                    color="primary"
                    size="small"
                    sx={{ position: 'absolute', top: 8, left: 8, zIndex: 1 }}
                  />
                )}
                {template.isTrending && (
                  <Chip
                    label="טרנדי"
                    color="secondary"
                    size="small"
                    sx={{ position: 'absolute', top: 8, right: 8, zIndex: 1 }}
                    icon={<TrendingUp />}
                  />
                )}
                {template.isPremium && (
                  <Chip
                    label="פרימיום"
                    color="warning"
                    size="small"
                    sx={{ position: 'absolute', top: 8, right: 8, zIndex: 1 }}
                    icon={<Star />}
                  />
                )}

                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Store sx={{ mr: 1, color: 'primary.main' }} />
                    <Typography variant="h6" component="h3">
                      {template.title}
                    </Typography>
                  </Box>
                  
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {template.description}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                    <Chip label={template.category} color="primary" size="small" />
                    <Chip 
                      label={template.price} 
                      variant="outlined" 
                      size="small"
                      color={template.price === 'חינם' ? 'success' : 'default'}
                    />
                    {template.authorVerified && (
                      <Chip 
                        label="מאומת" 
                        size="small"
                        color="success"
                        icon={<Verified />}
                      />
                    )}
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Rating value={template.rating} precision={0.1} size="small" readOnly />
                    <Typography variant="body2" sx={{ ml: 1 }}>
                      {template.rating}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                      ({template.downloads} הורדות)
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="caption" color="text.secondary">
                      מאת: {template.author}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {template.fileSize}
                    </Typography>
                  </Box>
                </CardContent>
                
                <Box sx={{ p: 2, pt: 0 }}>
                  <Grid container spacing={1}>
                    <Grid item xs={6}>
                      <Button
                        variant="outlined"
                        startIcon={<Preview />}
                        fullWidth
                        size="small"
                        onClick={() => handlePreview(template)}
                      >
                        תצוגה מקדימה
                      </Button>
                    </Grid>
                    <Grid item xs={6}>
                      <Button
                        variant="contained"
                        startIcon={<Download />}
                        fullWidth
                        size="small"
                        onClick={() => handleDownload(template)}
                      >
                        הורד
                      </Button>
                    </Grid>
                  </Grid>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Empty State */}
        {sortedTemplates.length === 0 && (
          <Card sx={{ p: 4, textAlign: 'center' }}>
            <Store sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              לא נמצאו תבניות
            </Typography>
            <Typography variant="body2" color="text.secondary">
              נסה לשנות את הפילטרים או חפש משהו אחר
            </Typography>
          </Card>
        )}

        {/* Preview Dialog */}
        <Dialog 
          open={showPreviewDialog} 
          onClose={() => setShowPreviewDialog(false)} 
          maxWidth="md" 
          fullWidth
        >
          {selectedTemplate && (
            <>
              <DialogTitle>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="h6">{selectedTemplate.title}</Typography>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <IconButton size="small">
                      <Favorite />
                    </IconButton>
                    <IconButton size="small">
                      <Share />
                    </IconButton>
                  </Box>
                </Box>
              </DialogTitle>
              <DialogContent>
                <Tabs value={activeTab} onChange={(_, newValue) => setActiveTab(newValue)} sx={{ mb: 2 }}>
                  <Tab label="תצוגה מקדימה" />
                  <Tab label="ביקורות" />
                  <Tab label="פרטים" />
                </Tabs>

                {activeTab === 0 && (
                  <Box>
                    <Typography variant="h6" gutterBottom>
                      {selectedTemplate.title}
                    </Typography>
                    <Typography variant="body1" paragraph>
                      {selectedTemplate.description}
                    </Typography>
                    <Typography variant="body1" paragraph>
                      {selectedTemplate.preview}
                    </Typography>
                    <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                      <Typography variant="subtitle2" gutterBottom>
                        פרטי התבנית:
                      </Typography>
                      <Typography variant="body2">
                        מחיר: {selectedTemplate.price} | מחבר: {selectedTemplate.author} | דירוג: {selectedTemplate.rating}/5
                      </Typography>
                      <Typography variant="body2">
                        הורדות: {selectedTemplate.downloads} | גודל: {selectedTemplate.fileSize}
                      </Typography>
                    </Box>
                    <Alert severity="info" sx={{ mt: 2 }}>
                      זו תצוגה מקדימה בלבד. הורד את התבנית המלאה לשימוש
                    </Alert>
                  </Box>
                )}

                {activeTab === 1 && (
                  <Box>
                    {selectedTemplate.reviews.length > 0 ? (
                      <List>
                        {selectedTemplate.reviews.map((review) => (
                          <ListItem key={review.id} alignItems="flex-start">
                            <ListItemAvatar>
                              <Avatar>{review.author[0]}</Avatar>
                            </ListItemAvatar>
                            <ListItemText
                              primary={
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  <Typography variant="subtitle2">{review.author}</Typography>
                                  <Rating value={review.rating} size="small" readOnly />
                                </Box>
                              }
                              secondary={
                                <>
                                  <Typography variant="body2" paragraph>
                                    {review.comment}
                                  </Typography>
                                  <Typography variant="caption" color="text.secondary">
                                    {new Date(review.date).toLocaleDateString('he-IL')} • 
                                    {review.helpful} אנשים מצאו את זה מועיל
                                  </Typography>
                                </>
                              }
                            />
                          </ListItem>
                        ))}
                      </List>
                    ) : (
                      <Typography variant="body2" color="text.secondary" textAlign="center">
                        אין עדיין ביקורות לתבנית זו
                      </Typography>
                    )}
                  </Box>
                )}

                {activeTab === 2 && (
                  <Box>
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Typography variant="subtitle2">קטגוריה</Typography>
                        <Typography variant="body2">{selectedTemplate.category}</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="subtitle2">מחיר</Typography>
                        <Typography variant="body2">{selectedTemplate.price}</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="subtitle2">גודל קובץ</Typography>
                        <Typography variant="body2">{selectedTemplate.fileSize}</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="subtitle2">עודכן לאחרונה</Typography>
                        <Typography variant="body2">
                          {new Date(selectedTemplate.lastUpdated).toLocaleDateString('he-IL')}
                        </Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant="subtitle2">תגיות</Typography>
                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 1 }}>
                          {selectedTemplate.tags.map((tag) => (
                            <Chip key={tag} label={tag} size="small" variant="outlined" />
                          ))}
                        </Box>
                      </Grid>
                    </Grid>
                  </Box>
                )}
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setShowPreviewDialog(false)}>
                  סגור
                </Button>
                <Button 
                  variant="contained" 
                  startIcon={<Download />}
                  onClick={() => {
                    handleDownload(selectedTemplate)
                    setShowPreviewDialog(false)
                  }}
                >
                  הורד תבנית
                </Button>
              </DialogActions>
            </>
          )}
        </Dialog>
      </Box>
    </Container>
  )
}

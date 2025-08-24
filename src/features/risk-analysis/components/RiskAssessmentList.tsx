import React, { useState } from 'react'
import {
  Box,
  Paper,
  Typography,
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
  ListItemSecondaryAction,
  IconButton,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Avatar,
  Tooltip,
  Menu,
  MenuList,
  MenuItem as MenuItemComponent,
  Divider,
  Alert,
  LinearProgress,
  Badge
} from '@mui/material'
import {
  Assessment,
  Search,
  FilterList,
  Sort,
  MoreVert,
  Visibility,
  Edit,
  Delete,
  Download,
  Share,
  Warning,
  CheckCircle,
  Error,
  Schedule,
  Person,
  CalendarToday,
  TrendingUp,
  TrendingDown,
  Assignment,
  Security
} from '@mui/icons-material'
import { useTranslation } from 'react-i18next'

interface RiskAssessment {
  id: string
  title: string
  description: string
  contractType: string
  status: 'draft' | 'in-progress' | 'completed' | 'archived'
  riskLevel: 'low' | 'medium' | 'high' | 'critical'
  overallScore: number
  createdAt: Date
  updatedAt: Date
  createdBy: string
  assignedTo?: string
  totalRisks: number
  resolvedRisks: number
  tags: string[]
  priority: 'low' | 'medium' | 'high'
}

interface RiskAssessmentListProps {
  assessments: RiskAssessment[]
  onView: (assessmentId: string) => void
  onEdit: (assessmentId: string) => void
  onDelete: (assessmentId: string) => void
  onDuplicate: (assessmentId: string) => void
  onExport: (assessmentId: string) => void
}

const RiskAssessmentList: React.FC<RiskAssessmentListProps> = ({
  assessments,
  onView,
  onEdit,
  onDelete,
  onDuplicate,
  onExport
}) => {
  const { t } = useTranslation()
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [filterRiskLevel, setFilterRiskLevel] = useState<string>('all')
  const [sortBy, setSortBy] = useState<string>('updatedAt')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [selectedAssessment, setSelectedAssessment] = useState<string | null>(null)

  const statusOptions = [
    { value: 'all', label: 'כל הסטטוסים' },
    { value: 'draft', label: 'טיוטה' },
    { value: 'in-progress', label: 'בתהליך' },
    { value: 'completed', label: 'הושלם' },
    { value: 'archived', label: 'בארכיון' }
  ]

  const riskLevelOptions = [
    { value: 'all', label: 'כל רמות הסיכון' },
    { value: 'low', label: 'נמוך' },
    { value: 'medium', label: 'בינוני' },
    { value: 'high', label: 'גבוה' },
    { value: 'critical', label: 'קריטי' }
  ]

  const sortOptions = [
    { value: 'updatedAt', label: 'תאריך עדכון' },
    { value: 'createdAt', label: 'תאריך יצירה' },
    { value: 'title', label: 'שם' },
    { value: 'riskLevel', label: 'רמת סיכון' },
    { value: 'overallScore', label: 'ציון כללי' }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft':
        return 'default'
      case 'in-progress':
        return 'info'
      case 'completed':
        return 'success'
      case 'archived':
        return 'secondary'
      default:
        return 'default'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'draft':
        return <Edit />
      case 'in-progress':
        return <Schedule />
      case 'completed':
        return <CheckCircle />
      case 'archived':
        return <Assignment />
      default:
        return <Assessment />
    }
  }

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case 'low':
        return 'success'
      case 'medium':
        return 'warning'
      case 'high':
        return 'error'
      case 'critical':
        return 'error'
      default:
        return 'default'
    }
  }

  const getRiskLevelIcon = (level: string) => {
    switch (level) {
      case 'low':
        return <CheckCircle />
      case 'medium':
        return <Warning />
      case 'high':
        return <Error />
      case 'critical':
        return <Security />
      default:
        return <Assessment />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low':
        return 'success'
      case 'medium':
        return 'warning'
      case 'high':
        return 'error'
      default:
        return 'default'
    }
  }

  const filteredAssessments = assessments.filter(assessment => {
    const matchesSearch = assessment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         assessment.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         assessment.contractType.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'all' || assessment.status === filterStatus
    const matchesRiskLevel = filterRiskLevel === 'all' || assessment.riskLevel === filterRiskLevel
    
    return matchesSearch && matchesStatus && matchesRiskLevel
  })

  const sortedAssessments = [...filteredAssessments].sort((a, b) => {
    let compareValue = 0
    
    switch (sortBy) {
      case 'title':
        compareValue = a.title.localeCompare(b.title)
        break
      case 'createdAt':
        compareValue = a.createdAt.getTime() - b.createdAt.getTime()
        break
      case 'updatedAt':
        compareValue = a.updatedAt.getTime() - b.updatedAt.getTime()
        break
      case 'overallScore':
        compareValue = a.overallScore - b.overallScore
        break
      case 'riskLevel': {
        const riskOrder = { low: 1, medium: 2, high: 3, critical: 4 }
        compareValue = riskOrder[a.riskLevel] - riskOrder[b.riskLevel]
        break
      }
      default:
        compareValue = 0
    }
    
    return sortOrder === 'asc' ? compareValue : -compareValue
  })

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, assessmentId: string) => {
    setAnchorEl(event.currentTarget)
    setSelectedAssessment(assessmentId)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
    setSelectedAssessment(null)
  }

  const handleMenuAction = (action: string) => {
    if (!selectedAssessment) return
    
    switch (action) {
      case 'view':
        onView(selectedAssessment)
        break
      case 'edit':
        onEdit(selectedAssessment)
        break
      case 'delete':
        onDelete(selectedAssessment)
        break
      case 'duplicate':
        onDuplicate(selectedAssessment)
        break
      case 'export':
        onExport(selectedAssessment)
        break
    }
    
    handleMenuClose()
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('he-IL')
  }

  const getProgressPercentage = (assessment: RiskAssessment) => {
    return assessment.totalRisks > 0 ? (assessment.resolvedRisks / assessment.totalRisks) * 100 : 0
  }

  return (
    <Box>
      {/* Header */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Assessment sx={{ color: 'primary.main' }} />
            <Typography variant="h5" component="h2">
              {t('riskAnalysis.assessmentList.title')}
            </Typography>
            <Badge badgeContent={sortedAssessments.length} color="primary">
              <Assessment />
            </Badge>
          </Box>
        </Box>
        <Typography variant="body1" color="text.secondary">
          {t('riskAnalysis.assessmentList.description')}
        </Typography>
      </Paper>

      {/* Filters and Search */}
      <Paper elevation={2} sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              size="small"
              placeholder={t('riskAnalysis.searchAssessments')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                )
              }}
            />
          </Grid>
          <Grid item xs={12} md={2}>
            <FormControl fullWidth size="small">
              <InputLabel>{t('riskAnalysis.status')}</InputLabel>
              <Select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                label={t('riskAnalysis.status')}
              >
                {statusOptions.map(option => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={2}>
            <FormControl fullWidth size="small">
              <InputLabel>{t('riskAnalysis.riskLevel')}</InputLabel>
              <Select
                value={filterRiskLevel}
                onChange={(e) => setFilterRiskLevel(e.target.value)}
                label={t('riskAnalysis.riskLevel')}
              >
                {riskLevelOptions.map(option => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={2}>
            <FormControl fullWidth size="small">
              <InputLabel>{t('riskAnalysis.sortBy')}</InputLabel>
              <Select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                label={t('riskAnalysis.sortBy')}
              >
                {sortOptions.map(option => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={2}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={sortOrder === 'asc' ? <TrendingUp /> : <TrendingDown />}
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            >
              {sortOrder === 'asc' ? t('common.ascending') : t('common.descending')}
            </Button>
          </Grid>
          <Grid item xs={12} md={1}>
            <Typography variant="body2" color="text.secondary">
              {t('riskAnalysis.foundAssessments', { count: sortedAssessments.length })}
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      {/* Assessments Grid */}
      <Grid container spacing={3}>
        {sortedAssessments.map((assessment) => (
          <Grid item xs={12} sm={6} md={4} key={assessment.id}>
            <Card 
              elevation={2}
              sx={{ 
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                cursor: 'pointer',
                '&:hover': {
                  elevation: 4
                }
              }}
              onClick={() => onView(assessment.id)}
            >
              <CardContent sx={{ flexGrow: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    {assessment.title}
                  </Typography>
                  <IconButton 
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleMenuOpen(e, assessment.id)
                    }}
                  >
                    <MoreVert />
                  </IconButton>
                </Box>

                <Typography variant="body2" color="text.secondary" paragraph>
                  {assessment.description}
                </Typography>

                <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                  <Chip
                    icon={getStatusIcon(assessment.status)}
                    label={t(`riskAnalysis.status.${assessment.status}`)}
                    color={getStatusColor(assessment.status) as any}
                    size="small"
                  />
                  <Chip
                    icon={getRiskLevelIcon(assessment.riskLevel)}
                    label={t(`riskAnalysis.levels.${assessment.riskLevel}`)}
                    color={getRiskLevelColor(assessment.riskLevel) as any}
                    size="small"
                  />
                  <Chip
                    label={t(`riskAnalysis.priority.${assessment.priority}`)}
                    color={getPriorityColor(assessment.priority) as any}
                    size="small"
                    variant="outlined"
                  />
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    <Typography variant="caption" color="text.secondary">
                      {t('riskAnalysis.progress')}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {assessment.resolvedRisks}/{assessment.totalRisks}
                    </Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={getProgressPercentage(assessment)} 
                    sx={{ height: 6, borderRadius: 3 }}
                  />
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Typography variant="caption" color="text.secondary">
                    {t('riskAnalysis.overallScore')}: {assessment.overallScore}%
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {assessment.contractType}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <Person sx={{ fontSize: 16 }} />
                  <Typography variant="caption" color="text.secondary">
                    {assessment.createdBy}
                  </Typography>
                  {assessment.assignedTo && (
                    <>
                      <Typography variant="caption" color="text.secondary">→</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {assessment.assignedTo}
                      </Typography>
                    </>
                  )}
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CalendarToday sx={{ fontSize: 16 }} />
                  <Typography variant="caption" color="text.secondary">
                    {formatDate(assessment.updatedAt)}
                  </Typography>
                </Box>

                {assessment.tags.length > 0 && (
                  <Box sx={{ mt: 1, display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                    {assessment.tags.map((tag, index) => (
                      <Chip
                        key={index}
                        label={tag}
                        size="small"
                        variant="outlined"
                        sx={{ fontSize: '0.7rem' }}
                      />
                    ))}
                  </Box>
                )}
              </CardContent>

              <CardActions>
                <Button 
                  size="small" 
                  startIcon={<Visibility />}
                  onClick={(e) => {
                    e.stopPropagation()
                    onView(assessment.id)
                  }}
                >
                  {t('common.view')}
                </Button>
                <Button 
                  size="small" 
                  startIcon={<Edit />}
                  onClick={(e) => {
                    e.stopPropagation()
                    onEdit(assessment.id)
                  }}
                >
                  {t('common.edit')}
                </Button>
                <Button 
                  size="small" 
                  startIcon={<Download />}
                  onClick={(e) => {
                    e.stopPropagation()
                    onExport(assessment.id)
                  }}
                >
                  {t('common.export')}
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {sortedAssessments.length === 0 && (
        <Paper elevation={1} sx={{ p: 4, textAlign: 'center' }}>
          <Assessment sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            {t('riskAnalysis.noAssessments')}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {t('riskAnalysis.noAssessmentsDescription')}
          </Typography>
        </Paper>
      )}

      {/* Context Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItemComponent onClick={() => handleMenuAction('view')}>
          <ListItemIcon>
            <Visibility fontSize="small" />
          </ListItemIcon>
          <ListItemText>{t('common.view')}</ListItemText>
        </MenuItemComponent>
        <MenuItemComponent onClick={() => handleMenuAction('edit')}>
          <ListItemIcon>
            <Edit fontSize="small" />
          </ListItemIcon>
          <ListItemText>{t('common.edit')}</ListItemText>
        </MenuItemComponent>
        <Divider />
        <MenuItemComponent onClick={() => handleMenuAction('duplicate')}>
          <ListItemIcon>
            <Assignment fontSize="small" />
          </ListItemIcon>
          <ListItemText>{t('common.duplicate')}</ListItemText>
        </MenuItemComponent>
        <MenuItemComponent onClick={() => handleMenuAction('export')}>
          <ListItemIcon>
            <Download fontSize="small" />
          </ListItemIcon>
          <ListItemText>{t('common.export')}</ListItemText>
        </MenuItemComponent>
        <Divider />
        <MenuItemComponent onClick={() => handleMenuAction('delete')}>
          <ListItemIcon>
            <Delete fontSize="small" />
          </ListItemIcon>
          <ListItemText>{t('common.delete')}</ListItemText>
        </MenuItemComponent>
      </Menu>
    </Box>
  )
}

export default RiskAssessmentList

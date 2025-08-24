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
  TextField,
  InputAdornment,
  IconButton,
  Chip,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  ListItemSecondaryAction,
  Divider,
  Tooltip,
  LinearProgress,

} from '@mui/material'
import {
  Search,
  Add,
  Edit,
  Delete,
  Phone,
  Email,
  Business,
  Person,
  LocationOn,
  CalendarToday,
  Star,
  StarBorder,
  MoreVert,
  FilterList,
  Sort,
  Download,
  Share,
  Visibility,
  TrendingUp,
  Assignment,
  CheckCircle,
  Schedule,
  PriorityHigh,
  Call,
  Message,

  Task,
  Note,
  AttachFile,
  Send,
  Receipt
} from '@mui/icons-material'
import { useTranslation } from 'react-i18next'

interface Activity {
  id: string
  type: 'call' | 'email' | 'meeting' | 'task' | 'note' | 'document'
  title: string
  description?: string
  clientId?: string
  clientName?: string
  leadId?: string
  leadName?: string
  assignedTo: string
  status: 'pending' | 'completed' | 'cancelled'
  priority: 'low' | 'medium' | 'high'
  dueDate?: Date
  completedDate?: Date
  duration?: number // in minutes
  tags: string[]
  attachments?: string[]
  createdAt: Date
  updatedAt: Date
}

interface ActivityTrackerProps {
  activities?: Activity[]
  loading?: boolean
  onAddActivity?: (activity: Omit<Activity, 'id' | 'createdAt' | 'updatedAt'>) => void
  onEditActivity?: (activity: Activity) => void
  onDeleteActivity?: (activityId: string) => void
  onViewActivity?: (activity: Activity) => void
  onUpdateStatus?: (activityId: string, status: Activity['status']) => void
}

const ActivityTracker: React.FC<ActivityTrackerProps> = ({
  activities = [],
  loading = false,
  onAddActivity,
  onEditActivity,
  onDeleteActivity,
  onViewActivity,
  onUpdateStatus
}) => {
  const { t } = useTranslation()
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState<string>('all')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [filterPriority, setFilterPriority] = useState<string>('all')
  const [viewMode, setViewMode] = useState<'list' | 'timeline' | 'calendar'>('list')
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null)
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  // Mock data
  const [mockActivities] = useState<Activity[]>([
    {
      id: '1',
      type: 'call',
      title: 'שיחת טלפון עם יוסי כהן',
      description: 'דיברנו על חוזה השכירות החדש',
      clientId: '1',
      clientName: 'יוסי כהן',
      assignedTo: 'עו"ד שרה לוי',
      status: 'completed',
      priority: 'high',
      duration: 15,
      tags: ['חוזה', 'שכירות'],
      createdAt: new Date('2024-01-15T10:30:00'),
      updatedAt: new Date('2024-01-15T10:45:00')
    },
    {
      id: '2',
      type: 'meeting',
      title: 'פגישה עם חברת טכנולוגיה',
      description: 'פגישה להצגת הצעת שירותים',
      clientId: '2',
      clientName: 'חברת טכנולוגיה בע"מ',
      assignedTo: 'עו"ד דוד כהן',
      status: 'pending',
      priority: 'medium',
      dueDate: new Date('2024-01-20T14:00:00'),
      tags: ['פגישה', 'הצעה', 'שירותים'],
      createdAt: new Date('2024-01-14T09:00:00'),
      updatedAt: new Date('2024-01-14T09:00:00')
    },
    {
      id: '3',
      type: 'email',
      title: 'שליחת חוזה לדוד לוי',
      description: 'שליחת טיוטת חוזה עבודה',
      clientId: '3',
      clientName: 'דוד לוי',
      assignedTo: 'עו"ד מיכל גולדברג',
      status: 'completed',
      priority: 'low',
      tags: ['חוזה', 'עבודה', 'אימייל'],
      createdAt: new Date('2024-01-13T16:00:00'),
      updatedAt: new Date('2024-01-13T16:30:00')
    },
    {
      id: '4',
      type: 'task',
      title: 'בדיקת מסמכים משפטיים',
      description: 'בדיקה וסקירה של מסמכים משפטיים',
      assignedTo: 'עו"ד שרה לוי',
      status: 'pending',
      priority: 'high',
      dueDate: new Date('2024-01-18T17:00:00'),
      tags: ['מסמכים', 'בדיקה', 'משפטי'],
      createdAt: new Date('2024-01-12T11:00:00'),
      updatedAt: new Date('2024-01-12T11:00:00')
    }
  ])

  const displayActivities = activities.length > 0 ? activities : mockActivities

  const filteredActivities = displayActivities.filter(activity => {
    const matchesSearch = 
      activity.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      activity.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      activity.clientName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      activity.leadName?.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesType = filterType === 'all' || activity.type === filterType
    const matchesStatus = filterStatus === 'all' || activity.status === filterStatus
    const matchesPriority = filterPriority === 'all' || activity.priority === filterPriority
    
    return matchesSearch && matchesType && matchesStatus && matchesPriority
  })

  const sortedActivities = [...filteredActivities].sort((a, b) => {
    return b.createdAt.getTime() - a.createdAt.getTime()
  })

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'call':
        return <Call />
      case 'email':
        return <Email />
      case 'meeting':
        return <Schedule />
      case 'task':
        return <Task />
      case 'note':
        return <Note />
      case 'document':
        return <AttachFile />
      default:
        return <Assignment />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'call':
        return 'success'
      case 'email':
        return 'info'
      case 'meeting':
        return 'primary'
      case 'task':
        return 'warning'
      case 'note':
        return 'secondary'
      case 'document':
        return 'error'
      default:
        return 'default'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'success'
      case 'pending':
        return 'warning'
      case 'cancelled':
        return 'error'
      default:
        return 'default'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed':
        return 'הושלם'
      case 'pending':
        return 'ממתין'
      case 'cancelled':
        return 'בוטל'
      default:
        return status
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'error'
      case 'medium':
        return 'warning'
      case 'low':
        return 'success'
      default:
        return 'default'
    }
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('he-IL', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatDuration = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes} דקות`
    }
    const hours = Math.floor(minutes / 60)
    const remainingMinutes = minutes % 60
    return `${hours} שעות ${remainingMinutes > 0 ? `${remainingMinutes} דקות` : ''}`
  }

  const renderListView = () => (
    <List>
      {sortedActivities.map((activity, index) => (
        <React.Fragment key={activity.id}>
          <ListItem alignItems="flex-start">
            <ListItemAvatar>
              <Avatar sx={{ bgcolor: `${getTypeColor(activity.type)}.main` }}>
                {getTypeIcon(activity.type)}
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <Typography variant="subtitle1" sx={{ flexGrow: 1 }}>
                    {activity.title}
                  </Typography>
                  <Chip
                    label={getStatusLabel(activity.status)}
                    color={getStatusColor(activity.status) as any}
                    size="small"
                  />
                  <Chip
                    label={t(`activities.priorities.${activity.priority}`)}
                    color={getPriorityColor(activity.priority) as any}
                    size="small"
                    variant="outlined"
                  />
                </Box>
              }
              secondary={
                <Box>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {activity.description}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                    <Typography variant="caption" color="text.secondary">
                      {t('activities.assignedTo')}: {activity.assignedTo}
                    </Typography>
                    {activity.clientName && (
                      <Typography variant="caption" color="text.secondary">
                        {t('activities.client')}: {activity.clientName}
                      </Typography>
                    )}
                    {activity.duration && (
                      <Typography variant="caption" color="text.secondary">
                        {t('activities.duration')}: {formatDuration(activity.duration)}
                      </Typography>
                    )}
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                    {activity.tags.map((tag) => (
                      <Chip
                        key={tag}
                        label={tag}
                        size="small"
                        variant="outlined"
                      />
                    ))}
                  </Box>
                  <Typography variant="caption" color="text.secondary">
                    {formatDate(activity.createdAt)}
                  </Typography>
                </Box>
              }
            />
            <ListItemSecondaryAction>
              <Box sx={{ display: 'flex', gap: 0.5 }}>
                <Tooltip title={t('common.view')}>
                  <IconButton
                    size="small"
                    onClick={() => onViewActivity?.(activity)}
                  >
                    <Visibility />
                  </IconButton>
                </Tooltip>
                <Tooltip title={t('common.edit')}>
                  <IconButton
                    size="small"
                    onClick={() => {
                      setSelectedActivity(activity)
                      setShowEditDialog(true)
                    }}
                  >
                    <Edit />
                  </IconButton>
                </Tooltip>
                <Tooltip title={t('common.delete')}>
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => {
                      setSelectedActivity(activity)
                      setShowDeleteDialog(true)
                    }}
                  >
                    <Delete />
                  </IconButton>
                </Tooltip>
              </Box>
            </ListItemSecondaryAction>
          </ListItem>
          {index < sortedActivities.length - 1 && <Divider />}
        </React.Fragment>
      ))}
    </List>
  )

  const renderTimelineView = () => (
    <Box>
      {sortedActivities.map((activity) => (
        <Card key={activity.id} sx={{ mb: 2 }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <Avatar sx={{ bgcolor: `${getTypeColor(activity.type)}.main` }}>
                {getTypeIcon(activity.type)}
              </Avatar>
              <Typography variant="h6" sx={{ flexGrow: 1 }}>
                {activity.title}
              </Typography>
              <Chip
                label={getStatusLabel(activity.status)}
                color={getStatusColor(activity.status) as any}
                size="small"
              />
            </Box>
            <Typography variant="body2" color="text.secondary" paragraph>
              {activity.description}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
              {activity.tags.map((tag) => (
                <Chip
                  key={tag}
                  label={tag}
                  size="small"
                  variant="outlined"
                />
              ))}
            </Box>
            <Typography variant="caption" color="text.secondary">
              {formatDate(activity.createdAt)}
            </Typography>
          </CardContent>
        </Card>
      ))}
    </Box>
  )

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Assignment sx={{ color: 'primary.main' }} />
            <Typography variant="h4" component="h1">
              {t('activities.title')}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant={viewMode === 'list' ? 'contained' : 'outlined'}
              onClick={() => setViewMode('list')}
            >
              {t('activities.listView')}
            </Button>
            <Button
              variant={viewMode === 'timeline' ? 'contained' : 'outlined'}
              onClick={() => setViewMode('timeline')}
            >
              {t('activities.timelineView')}
            </Button>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => setShowAddDialog(true)}
            >
              {t('activities.addActivity')}
            </Button>
          </Box>
        </Box>
        <Typography variant="body1" color="text.secondary">
          {t('activities.description')}
        </Typography>
      </Paper>

      {/* Filters */}
      <Paper elevation={1} sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              placeholder={t('activities.searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
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
            <FormControl fullWidth>
              <InputLabel>{t('activities.filterByType')}</InputLabel>
              <Select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                label={t('activities.filterByType')}
              >
                <MenuItem value="all">{t('activities.allTypes')}</MenuItem>
                <MenuItem value="call">{t('activities.types.call')}</MenuItem>
                <MenuItem value="email">{t('activities.types.email')}</MenuItem>
                <MenuItem value="meeting">{t('activities.types.meeting')}</MenuItem>
                <MenuItem value="task">{t('activities.types.task')}</MenuItem>
                <MenuItem value="note">{t('activities.types.note')}</MenuItem>
                <MenuItem value="document">{t('activities.types.document')}</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={2}>
            <FormControl fullWidth>
              <InputLabel>{t('activities.filterByStatus')}</InputLabel>
              <Select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                label={t('activities.filterByStatus')}
              >
                <MenuItem value="all">{t('activities.allStatuses')}</MenuItem>
                <MenuItem value="completed">{t('activities.statuses.completed')}</MenuItem>
                <MenuItem value="pending">{t('activities.statuses.pending')}</MenuItem>
                <MenuItem value="cancelled">{t('activities.statuses.cancelled')}</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={2}>
            <FormControl fullWidth>
              <InputLabel>{t('activities.filterByPriority')}</InputLabel>
              <Select
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
                label={t('activities.filterByPriority')}
              >
                <MenuItem value="all">{t('activities.allPriorities')}</MenuItem>
                <MenuItem value="high">{t('activities.priorities.high')}</MenuItem>
                <MenuItem value="medium">{t('activities.priorities.medium')}</MenuItem>
                <MenuItem value="low">{t('activities.priorities.low')}</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant="outlined"
                startIcon={<FilterList />}
                onClick={() => {/* TODO: Advanced filters */}}
              >
                {t('activities.advancedFilters')}
              </Button>
              <Button
                variant="outlined"
                startIcon={<Download />}
                onClick={() => {/* TODO: Export */}}
              >
                {t('activities.export')}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Loading */}
      {loading && (
        <LinearProgress sx={{ mb: 2 }} />
      )}

      {/* Activities Content */}
      <Paper elevation={1}>
        {viewMode === 'list' ? renderListView() : renderTimelineView()}
      </Paper>

      {/* Add Activity Dialog */}
      <Dialog open={showAddDialog} onClose={() => setShowAddDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>{t('activities.addActivity')}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>{t('activities.type')}</InputLabel>
                <Select label={t('activities.type')}>
                  <MenuItem value="call">{t('activities.types.call')}</MenuItem>
                  <MenuItem value="email">{t('activities.types.email')}</MenuItem>
                  <MenuItem value="meeting">{t('activities.types.meeting')}</MenuItem>
                  <MenuItem value="task">{t('activities.types.task')}</MenuItem>
                  <MenuItem value="note">{t('activities.types.note')}</MenuItem>
                  <MenuItem value="document">{t('activities.types.document')}</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>{t('activities.priority')}</InputLabel>
                <Select label={t('activities.priority')}>
                  <MenuItem value="low">{t('activities.priorities.low')}</MenuItem>
                  <MenuItem value="medium">{t('activities.priorities.medium')}</MenuItem>
                  <MenuItem value="high">{t('activities.priorities.high')}</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label={t('activities.title')}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label={t('activities.description')}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="datetime-local"
                label={t('activities.dueDate')}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                label={t('activities.duration')}
                placeholder="דקות"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowAddDialog(false)}>
            {t('common.cancel')}
          </Button>
          <Button variant="contained">
            {t('common.add')}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onClose={() => setShowDeleteDialog(false)}>
        <DialogTitle>{t('activities.deleteConfirmation')}</DialogTitle>
        <DialogContent>
          <Typography>
            {t('activities.deleteMessage', { title: selectedActivity?.title })}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowDeleteDialog(false)}>
            {t('common.cancel')}
          </Button>
          <Button
            color="error"
            variant="contained"
            onClick={() => {
              if (selectedActivity) {
                onDeleteActivity?.(selectedActivity.id)
                setShowDeleteDialog(false)
                setSelectedActivity(null)
              }
            }}
          >
            {t('common.delete')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default ActivityTracker

import React, { useState } from 'react'
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Tooltip,
  LinearProgress
} from '@mui/material'
import {
  Search,
  Add,
  Delete,
  Phone,
  Email,
  Business,
  Person,
  FilterList,
  Sort,
  Download,
  Visibility,
  TrendingUp,
  Assignment,
  CheckCircle,
  Schedule,
  PriorityHigh
} from '@mui/icons-material'
import { useTranslation } from 'react-i18next'

interface Lead {
  id: string
  name: string
  email: string
  phone: string
  company?: string
  source: string
  status: 'new' | 'contacted' | 'qualified' | 'proposal' | 'negotiation' | 'won' | 'lost'
  priority: 'low' | 'medium' | 'high'
  assignedTo?: string
  value: number
  notes?: string
  tags: string[]
  createdAt: Date
  lastContact?: Date
  nextFollowUp?: Date
}

interface LeadManagerProps {
  leads?: Lead[]
  loading?: boolean
  onDeleteLead?: (leadId: string) => void
  onViewLead?: (lead: Lead) => void
}

const LeadManager: React.FC<LeadManagerProps> = ({
  leads = [],
  loading = false,
  onDeleteLead,
  onViewLead
}) => {
  const { t } = useTranslation()
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [filterPriority, setFilterPriority] = useState<string>('all')
  const [filterSource, setFilterSource] = useState<string>('all')
  const [sortBy, setSortBy] = useState<string>('createdAt')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [showPipelineDialog, setShowPipelineDialog] = useState(false)

  // Mock data
  const [mockLeads] = useState<Lead[]>([
    {
      id: '1',
      name: 'אבי לוי',
      email: 'avi@example.com',
      phone: '+972-50-111-2222',
      company: 'חברת בנייה בע"מ',
      source: 'website',
      status: 'qualified',
      priority: 'high',
      assignedTo: 'עו"ד שרה כהן',
      value: 75000,
      notes: 'מעוניין בחוזה שכירות למשרדים',
      tags: ['בנייה', 'משרדים', 'שכירות'],
      createdAt: new Date('2024-01-10'),
      lastContact: new Date('2024-01-15'),
      nextFollowUp: new Date('2024-01-20')
    },
    {
      id: '2',
      name: 'מיכל גולדברג',
      email: 'michal@techstartup.co.il',
      phone: '+972-52-333-4444',
      company: 'סטארט-אפ טכנולוגיה',
      source: 'referral',
      status: 'proposal',
      priority: 'medium',
      assignedTo: 'עו"ד דוד לוי',
      value: 120000,
      notes: 'צריך חוזי עבודה לעובדים חדשים',
      tags: ['טכנולוגיה', 'עבודה', 'סטארט-אפ'],
      createdAt: new Date('2024-01-08'),
      lastContact: new Date('2024-01-12'),
      nextFollowUp: new Date('2024-01-18')
    },
    {
      id: '3',
      name: 'יוסי כהן',
      email: 'yossi@example.com',
      phone: '+972-54-555-6666',
      source: 'social_media',
      status: 'new',
      priority: 'low',
      value: 25000,
      notes: 'מעוניין בייעוץ משפטי כללי',
      tags: ['ייעוץ', 'כללי'],
      createdAt: new Date('2024-01-16'),
      nextFollowUp: new Date('2024-01-23')
    }
  ])

  const displayLeads = leads.length > 0 ? leads : mockLeads

  const filteredLeads = displayLeads.filter(lead => {
    const matchesSearch = 
      lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.phone.includes(searchQuery) ||
      lead.company?.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesStatus = filterStatus === 'all' || lead.status === filterStatus
    const matchesPriority = filterPriority === 'all' || lead.priority === filterPriority
    const matchesSource = filterSource === 'all' || lead.source === filterSource
    
    return matchesSearch && matchesStatus && matchesPriority && matchesSource
  })

  const sortedLeads = [...filteredLeads].sort((a, b) => {
    let aValue: string | number | Date = ''
    let bValue: string | number | Date = ''
    
    const aField = a[sortBy as keyof Lead]
    const bField = b[sortBy as keyof Lead]
    
    if (sortBy === 'createdAt' || sortBy === 'lastContact' || sortBy === 'nextFollowUp') {
      aValue = (aField as Date)?.getTime() || 0
      bValue = (bField as Date)?.getTime() || 0
    } else if (typeof aField === 'string' || typeof aField === 'number' || aField instanceof Date) {
      aValue = aField as string | number | Date
      bValue = bField as string | number | Date
    }
    
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      aValue = aValue.toLowerCase()
      bValue = bValue.toLowerCase()
    }
    
    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1
    } else {
      return aValue < bValue ? 1 : -1
    }
  })

  const paginatedLeads = sortedLeads.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  )

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(field)
      setSortOrder('asc')
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new':
        return 'default'
      case 'contacted':
        return 'info'
      case 'qualified':
        return 'warning'
      case 'proposal':
        return 'primary'
      case 'negotiation':
        return 'secondary'
      case 'won':
        return 'success'
      case 'lost':
        return 'error'
      default:
        return 'default'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'new':
        return 'חדש'
      case 'contacted':
        return 'נוצר קשר'
      case 'qualified':
        return 'מאושר'
      case 'proposal':
        return 'הצעה'
      case 'negotiation':
        return 'משא ומתן'
      case 'won':
        return 'זכה'
      case 'lost':
        return 'הפסיד'
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

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high':
        return <PriorityHigh />
      case 'medium':
        return <Schedule />
      case 'low':
        return <CheckCircle />
      default:
        return <Assignment />
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('he-IL', {
      style: 'currency',
      currency: 'ILS'
    }).format(amount)
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('he-IL')
  }

  const getPipelineSteps = () => [
    { label: 'חדש', value: 'new' },
    { label: 'נוצר קשר', value: 'contacted' },
    { label: 'מאושר', value: 'qualified' },
    { label: 'הצעה', value: 'proposal' },
    { label: 'משא ומתן', value: 'negotiation' },
    { label: 'זכה', value: 'won' },
    { label: 'הפסיד', value: 'lost' }
  ]

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <TrendingUp sx={{ color: 'primary.main' }} />
            <Typography variant="h4" component="h1">
              {t('crm.leads.title')}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant="outlined"
              startIcon={<TrendingUp />}
              onClick={() => setShowPipelineDialog(true)}
            >
              {t('crm.leads.pipeline')}
            </Button>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => setShowAddDialog(true)}
            >
              {t('crm.leads.addLead')}
            </Button>
          </Box>
        </Box>
        <Typography variant="body1" color="text.secondary">
          {t('crm.leads.description')}
        </Typography>
      </Paper>

      {/* Filters */}
      <Paper elevation={1} sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              placeholder={t('crm.leads.searchPlaceholder')}
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
              <InputLabel>{t('crm.leads.filterByStatus')}</InputLabel>
              <Select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                label={t('crm.leads.filterByStatus')}
              >
                <MenuItem value="all">{t('crm.leads.allStatuses')}</MenuItem>
                {getPipelineSteps().map(step => (
                  <MenuItem key={step.value} value={step.value}>
                    {step.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={2}>
            <FormControl fullWidth>
              <InputLabel>{t('crm.leads.filterByPriority')}</InputLabel>
              <Select
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
                label={t('crm.leads.filterByPriority')}
              >
                <MenuItem value="all">{t('crm.leads.allPriorities')}</MenuItem>
                <MenuItem value="high">{t('crm.leads.priorities.high')}</MenuItem>
                <MenuItem value="medium">{t('crm.leads.priorities.medium')}</MenuItem>
                <MenuItem value="low">{t('crm.leads.priorities.low')}</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={2}>
            <FormControl fullWidth>
              <InputLabel>{t('crm.leads.filterBySource')}</InputLabel>
              <Select
                value={filterSource}
                onChange={(e) => setFilterSource(e.target.value)}
                label={t('crm.leads.filterBySource')}
              >
                <MenuItem value="all">{t('crm.leads.allSources')}</MenuItem>
                <MenuItem value="website">{t('crm.leads.sources.website')}</MenuItem>
                <MenuItem value="referral">{t('crm.leads.sources.referral')}</MenuItem>
                <MenuItem value="social_media">{t('crm.leads.sources.socialMedia')}</MenuItem>
                <MenuItem value="cold_call">{t('crm.leads.sources.coldCall')}</MenuItem>
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
                {t('crm.leads.advancedFilters')}
              </Button>
              <Button
                variant="outlined"
                startIcon={<Download />}
                onClick={() => {/* TODO: Export */}}
              >
                {t('crm.leads.export')}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Loading */}
      {loading && (
        <LinearProgress sx={{ mb: 2 }} />
      )}

      {/* Leads Table */}
      <Paper elevation={1}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <Button
                    onClick={() => handleSort('name')}
                    startIcon={<Sort />}
                    sx={{ textTransform: 'none' }}
                  >
                    {t('crm.leads.name')}
                  </Button>
                </TableCell>
                <TableCell>{t('crm.leads.contact')}</TableCell>
                <TableCell>{t('crm.leads.status')}</TableCell>
                <TableCell>{t('crm.leads.priority')}</TableCell>
                <TableCell>
                  <Button
                    onClick={() => handleSort('value')}
                    startIcon={<Sort />}
                    sx={{ textTransform: 'none' }}
                  >
                    {t('crm.leads.value')}
                  </Button>
                </TableCell>
                <TableCell>
                  <Button
                    onClick={() => handleSort('createdAt')}
                    startIcon={<Sort />}
                    sx={{ textTransform: 'none' }}
                  >
                    {t('crm.leads.created')}
                  </Button>
                </TableCell>
                <TableCell>{t('crm.leads.nextFollowUp')}</TableCell>
                <TableCell>{t('crm.leads.tags')}</TableCell>
                <TableCell>{t('common.actions')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedLeads.map((lead) => (
                <TableRow key={lead.id} hover>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar>
                        {lead.company ? <Business /> : <Person />}
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle2">
                          {lead.name}
                        </Typography>
                        {lead.company && (
                          <Typography variant="caption" color="text.secondary">
                            {lead.company}
                          </Typography>
                        )}
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                        <Email fontSize="small" />
                        <Typography variant="body2">
                          {lead.email}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Phone fontSize="small" />
                        <Typography variant="body2">
                          {lead.phone}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={getStatusLabel(lead.status)}
                      color={getStatusColor(lead.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {getPriorityIcon(lead.priority)}
                      <Chip
                        label={t(`crm.leads.priorities.${lead.priority}`)}
                        color={getPriorityColor(lead.priority)}
                        size="small"
                        variant="outlined"
                      />
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                      {formatCurrency(lead.value)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {formatDate(lead.createdAt)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    {lead.nextFollowUp ? (
                      <Typography variant="body2">
                        {formatDate(lead.nextFollowUp)}
                      </Typography>
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        {t('crm.leads.noFollowUp')}
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                      {lead.tags.slice(0, 2).map((tag) => (
                        <Chip
                          key={tag}
                          label={tag}
                          size="small"
                          variant="outlined"
                        />
                      ))}
                      {lead.tags.length > 2 && (
                        <Chip
                          label={`+${lead.tags.length - 2}`}
                          size="small"
                          variant="outlined"
                        />
                      )}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                      <Tooltip title={t('common.view')}>
                        <IconButton
                          size="small"
                          onClick={() => onViewLead?.(lead)}
                        >
                          <Visibility />
                        </IconButton>
                      </Tooltip>

                      <Tooltip title={t('common.delete')}>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => {
                            setSelectedLead(lead)
                            setShowDeleteDialog(true)
                          }}
                        >
                          <Delete />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        
        <TablePagination
          component="div"
          count={filteredLeads.length}
          page={page}
          onPageChange={(_, newPage) => setPage(newPage)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10))
            setPage(0)
          }}
          labelRowsPerPage={t('common.rowsPerPage')}
          labelDisplayedRows={({ from, to, count }) => 
            `${from}-${to} ${t('common.of')} ${count}`
          }
        />
      </Paper>

      {/* Pipeline Dialog */}
      <Dialog open={showPipelineDialog} onClose={() => setShowPipelineDialog(false)} maxWidth="lg" fullWidth>
        <DialogTitle>{t('crm.leads.pipeline')}</DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            {getPipelineSteps().map((step) => {
              const stepLeads = displayLeads.filter(lead => lead.status === step.value)
              const totalValue = stepLeads.reduce((sum, lead) => sum + lead.value, 0)
              
              return (
                <Grid item xs={12} md={3} key={step.value}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        {step.label}
                      </Typography>
                      <Typography variant="h4" color="primary" gutterBottom>
                        {stepLeads.length}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {formatCurrency(totalValue)}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              )
            })}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowPipelineDialog(false)}>
            {t('common.close')}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add Lead Dialog */}
      <Dialog open={showAddDialog} onClose={() => setShowAddDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>{t('crm.leads.addLead')}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label={t('crm.leads.name')}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label={t('crm.leads.email')}
                type="email"
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label={t('crm.leads.phone')}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label={t('crm.leads.company')}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>{t('crm.leads.source')}</InputLabel>
                <Select label={t('crm.leads.source')}>
                  <MenuItem value="website">{t('crm.leads.sources.website')}</MenuItem>
                  <MenuItem value="referral">{t('crm.leads.sources.referral')}</MenuItem>
                  <MenuItem value="social_media">{t('crm.leads.sources.socialMedia')}</MenuItem>
                  <MenuItem value="cold_call">{t('crm.leads.sources.coldCall')}</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>{t('crm.leads.priority')}</InputLabel>
                <Select label={t('crm.leads.priority')}>
                  <MenuItem value="low">{t('crm.leads.priorities.low')}</MenuItem>
                  <MenuItem value="medium">{t('crm.leads.priorities.medium')}</MenuItem>
                  <MenuItem value="high">{t('crm.leads.priorities.high')}</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label={t('crm.leads.value')}
                type="number"
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label={t('crm.leads.notes')}
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
        <DialogTitle>{t('crm.leads.deleteConfirmation')}</DialogTitle>
        <DialogContent>
          <Typography>
            {t('crm.leads.deleteMessage', { name: selectedLead?.name })}
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
              if (selectedLead) {
                onDeleteLead?.(selectedLead.id)
                setShowDeleteDialog(false)
                setSelectedLead(null)
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

export default LeadManager

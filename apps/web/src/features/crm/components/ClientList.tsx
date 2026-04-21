import React, { useState } from 'react'
import {
  Box,
  Paper,
  Typography,
  Grid,
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
  Visibility
} from '@mui/icons-material'
import { useTranslation } from 'react-i18next'

interface Client {
  id: string
  name: string
  email: string
  phone: string
  company?: string
  type: 'individual' | 'company'
  status: 'active' | 'inactive' | 'prospect'
  source: string
  assignedTo?: string
  lastContact?: Date
  totalRevenue: number
  tags: string[]
  notes?: string
  address?: {
    street: string
    city: string
    state: string
    zipCode: string
    country: string
  }
}

interface ClientListProps {
  clients?: Client[]
  loading?: boolean
  onDeleteClient?: (clientId: string) => void
  onViewClient?: (client: Client) => void
}

const ClientList: React.FC<ClientListProps> = ({
  clients = [],
  loading = false,
  onDeleteClient,
  onViewClient
}) => {
  const { t } = useTranslation()
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [filterType, setFilterType] = useState<string>('all')
  const [sortBy, setSortBy] = useState<string>('name')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [selectedClient, setSelectedClient] = useState<Client | null>(null)
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  // Mock data
  const [mockClients] = useState<Client[]>([
    {
      id: '1',
      name: 'יוסי כהן',
      email: 'yossi@example.com',
      phone: '+972-50-123-4567',
      type: 'individual',
      status: 'active',
      source: 'website',
      lastContact: new Date('2024-01-15'),
      totalRevenue: 50000,
      tags: ['VIP', 'חוזה שכירות'],
      notes: 'לקוח קבוע, מעוניין בשירותים נוספים'
    },
    {
      id: '2',
      name: 'חברת טכנולוגיה בע"מ',
      email: 'info@techcompany.co.il',
      phone: '+972-3-123-4567',
      company: 'חברת טכנולוגיה בע"מ',
      type: 'company',
      status: 'active',
      source: 'referral',
      assignedTo: 'עו"ד שרה לוי',
      lastContact: new Date('2024-01-10'),
      totalRevenue: 150000,
      tags: ['חברה', 'טכנולוגיה', 'חוזי עבודה']
    },
    {
      id: '3',
      name: 'דוד לוי',
      email: 'david@example.com',
      phone: '+972-52-987-6543',
      type: 'individual',
      status: 'prospect',
      source: 'social_media',
      lastContact: new Date('2024-01-05'),
      totalRevenue: 0,
      tags: ['פוטנציאל', 'חוזה מכר']
    }
  ])

  const displayClients = clients.length > 0 ? clients : mockClients

  const filteredClients = displayClients.filter(client => {
    const matchesSearch = 
      client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.phone.includes(searchQuery) ||
      client.company?.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesStatus = filterStatus === 'all' || client.status === filterStatus
    const matchesType = filterType === 'all' || client.type === filterType
    
    return matchesSearch && matchesStatus && matchesType
  })

  const sortedClients = [...filteredClients].sort((a, b) => {
    let aValue: string | number | Date = ''
    let bValue: string | number | Date = ''
    
    const aField = a[sortBy as keyof Client]
    const bField = b[sortBy as keyof Client]
    
    if (sortBy === 'lastContact') {
      aValue = a.lastContact?.getTime() || 0
      bValue = b.lastContact?.getTime() || 0
    } else if (typeof aField === 'string' || typeof aField === 'number' || aField instanceof Date) {
      aValue = aField as string | number | Date
      bValue = bField as string | number | Date
    }
    
    if (typeof aValue === 'string') {
      aValue = aValue.toLowerCase()
      bValue = (bValue as string).toLowerCase()
    }
    
    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1
    } else {
      return aValue < bValue ? 1 : -1
    }
  })

  const paginatedClients = sortedClients.slice(
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
      case 'active':
        return 'success'
      case 'inactive':
        return 'error'
      case 'prospect':
        return 'warning'
      default:
        return 'default'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active':
        return 'פעיל'
      case 'inactive':
        return 'לא פעיל'
      case 'prospect':
        return 'פוטנציאל'
      default:
        return status
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

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Person sx={{ color: 'primary.main' }} />
            <Typography variant="h4" component="h1">
              {t('crm.clients.title')}
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setShowAddDialog(true)}
          >
            {t('crm.clients.addClient')}
          </Button>
        </Box>
        <Typography variant="body1" color="text.secondary">
          {t('crm.clients.description')}
        </Typography>
      </Paper>

      {/* Filters */}
      <Paper elevation={1} sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              placeholder={t('crm.clients.searchPlaceholder')}
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
              <InputLabel>{t('crm.clients.filterByStatus')}</InputLabel>
              <Select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                label={t('crm.clients.filterByStatus')}
              >
                <MenuItem value="all">{t('crm.clients.allStatuses')}</MenuItem>
                <MenuItem value="active">{t('crm.clients.statuses.active')}</MenuItem>
                <MenuItem value="inactive">{t('crm.clients.statuses.inactive')}</MenuItem>
                <MenuItem value="prospect">{t('crm.clients.statuses.prospect')}</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={2}>
            <FormControl fullWidth>
              <InputLabel>{t('crm.clients.filterByType')}</InputLabel>
              <Select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                label={t('crm.clients.filterByType')}
              >
                <MenuItem value="all">{t('crm.clients.allTypes')}</MenuItem>
                <MenuItem value="individual">{t('crm.clients.types.individual')}</MenuItem>
                <MenuItem value="company">{t('crm.clients.types.company')}</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant="outlined"
                startIcon={<FilterList />}
                onClick={() => {/* TODO: Advanced filters */}}
              >
                {t('crm.clients.advancedFilters')}
              </Button>
              <Button
                variant="outlined"
                startIcon={<Download />}
                onClick={() => {/* TODO: Export */}}
              >
                {t('crm.clients.export')}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Loading */}
      {loading && (
        <LinearProgress sx={{ mb: 2 }} />
      )}

      {/* Clients Table */}
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
                    {t('crm.clients.name')}
                  </Button>
                </TableCell>
                <TableCell>{t('crm.clients.contact')}</TableCell>
                <TableCell>{t('crm.clients.type')}</TableCell>
                <TableCell>{t('crm.clients.status')}</TableCell>
                <TableCell>
                  <Button
                    onClick={() => handleSort('totalRevenue')}
                    startIcon={<Sort />}
                    sx={{ textTransform: 'none' }}
                  >
                    {t('crm.clients.revenue')}
                  </Button>
                </TableCell>
                <TableCell>
                  <Button
                    onClick={() => handleSort('lastContact')}
                    startIcon={<Sort />}
                    sx={{ textTransform: 'none' }}
                  >
                    {t('crm.clients.lastContact')}
                  </Button>
                </TableCell>
                <TableCell>{t('crm.clients.tags')}</TableCell>
                <TableCell>{t('common.actions')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedClients.map((client) => (
                <TableRow key={client.id} hover>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar>
                        {client.type === 'company' ? <Business /> : <Person />}
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle2">
                          {client.name}
                        </Typography>
                        {client.company && (
                          <Typography variant="caption" color="text.secondary">
                            {client.company}
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
                          {client.email}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Phone fontSize="small" />
                        <Typography variant="body2">
                          {client.phone}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={t(`crm.clients.types.${client.type}`)}
                      size="small"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={getStatusLabel(client.status)}
                      color={getStatusColor(client.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                      {formatCurrency(client.totalRevenue)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    {client.lastContact ? (
                      <Typography variant="body2">
                        {formatDate(client.lastContact)}
                      </Typography>
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        {t('crm.clients.noContact')}
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                      {client.tags.slice(0, 2).map((tag) => (
                        <Chip
                          key={tag}
                          label={tag}
                          size="small"
                          variant="outlined"
                        />
                      ))}
                      {client.tags.length > 2 && (
                        <Chip
                          label={`+${client.tags.length - 2}`}
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
                          onClick={() => onViewClient?.(client)}
                        >
                          <Visibility />
                        </IconButton>
                      </Tooltip>

                      <Tooltip title={t('common.delete')}>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => {
                            setSelectedClient(client)
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
          count={filteredClients.length}
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

      {/* Add Client Dialog */}
      <Dialog open={showAddDialog} onClose={() => setShowAddDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>{t('crm.clients.addClient')}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label={t('crm.clients.name')}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label={t('crm.clients.email')}
                type="email"
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label={t('crm.clients.phone')}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>{t('crm.clients.type')}</InputLabel>
                <Select label={t('crm.clients.type')}>
                  <MenuItem value="individual">{t('crm.clients.types.individual')}</MenuItem>
                  <MenuItem value="company">{t('crm.clients.types.company')}</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label={t('crm.clients.company')}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>{t('crm.clients.status')}</InputLabel>
                <Select label={t('crm.clients.status')}>
                  <MenuItem value="active">{t('crm.clients.statuses.active')}</MenuItem>
                  <MenuItem value="inactive">{t('crm.clients.statuses.inactive')}</MenuItem>
                  <MenuItem value="prospect">{t('crm.clients.statuses.prospect')}</MenuItem>
                </Select>
              </FormControl>
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
        <DialogTitle>{t('crm.clients.deleteConfirmation')}</DialogTitle>
        <DialogContent>
          <Typography>
            {t('crm.clients.deleteMessage', { name: selectedClient?.name })}
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
              if (selectedClient) {
                onDeleteClient?.(selectedClient.id)
                setShowDeleteDialog(false)
                setSelectedClient(null)
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

export default ClientList

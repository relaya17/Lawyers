import React, { useState } from 'react'
import { 
  Box, 
  Container, 
  Typography, 
  Button, 
  Grid, 
  Card, 
  CardContent, 
  Chip,
  TextField,
  InputAdornment,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,

  Fab,

  Divider,
  useTheme,
  useMediaQuery
} from '@mui/material'
import { 
  Add, 
  Search, 
  Assessment,
  MoreVert, 
  Edit, 
  Delete, 
  Visibility, 
  Download,
  Share,
  Business,
  Person,
  Description,
  Security
} from '@mui/icons-material'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

interface Contract {
  id: string
  title: string
  description: string
  type: 'rental' | 'employment' | 'partnership' | 'service' | 'nda'
  status: 'draft' | 'active' | 'expired' | 'pending'
  riskLevel: 'low' | 'medium' | 'high' | 'very_high'
  createdDate: string
  expiryDate?: string
  parties: string[]
  value?: number
  lastModified: string
}

export const ContractsPage: React.FC = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'))

  
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [typeFilter, setTypeFilter] = useState<string>('all')
  const [viewMode, setViewMode] = useState<'grid' | 'table'>(isMobile ? 'grid' : 'grid')
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  // Mock data
  const contracts: Contract[] = [
    {
      id: '1',
      title: 'חוזה שכירות דירה',
      description: 'חוזה שכירות דירה בתל אביב - רחוב הרצל 123',
      type: 'rental',
      status: 'active',
      riskLevel: 'medium',
      createdDate: '2024-01-01',
      expiryDate: '2025-01-01',
      parties: ['יוסי כהן', 'שרה לוי'],
      value: 5000,
      lastModified: '2024-01-15'
    },
    {
      id: '2',
      title: 'חוזה העסקה',
      description: 'חוזה העסקה לעובד חדש - מפתח תוכנה',
      type: 'employment',
      status: 'draft',
      riskLevel: 'low',
      createdDate: '2024-01-15',
      parties: ['חברת טכנולוגיה בע״מ', 'דוד ישראלי'],
      value: 15000,
      lastModified: '2024-01-20'
    },
    {
      id: '3',
      title: 'הסכם שותפות עסקית',
      description: 'הסכם שותפות לפתיחת מסעדה',
      type: 'partnership',
      status: 'expired',
      riskLevel: 'high',
      createdDate: '2023-12-01',
      expiryDate: '2024-01-01',
      parties: ['אבי לוי', 'מיכל כהן'],
      value: 100000,
      lastModified: '2023-12-15'
    },
    {
      id: '4',
      title: 'חוזה שירותי IT',
      description: 'חוזה לתחזוקת מערכות מחשב',
      type: 'service',
      status: 'active',
      riskLevel: 'medium',
      createdDate: '2024-01-10',
      expiryDate: '2024-12-31',
      parties: ['חברת הייטק בע״מ', 'חברת שירותי IT בע״מ'],
      value: 25000,
      lastModified: '2024-01-12'
    },
    {
      id: '5',
      title: 'הסכם סודיות',
      description: 'NDA לפרויקט פיתוח חדש',
      type: 'nda',
      status: 'pending',
      riskLevel: 'low',
      createdDate: '2024-01-18',
      parties: ['חברת פיתוח בע״מ', 'יועץ חיצוני'],
      lastModified: '2024-01-18'
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'success'
      case 'draft': return 'default'
      case 'expired': return 'error'
      case 'pending': return 'warning'
      default: return 'default'
    }
  }

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'success'
      case 'medium': return 'warning'
      case 'high': return 'error'
      case 'very_high': return 'error'
      default: return 'default'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'rental': return <Business />
      case 'employment': return <Person />
      case 'partnership': return <Description />
      case 'service': return <Description />
      case 'nda': return <Security />
      default: return <Description />
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'rental': return 'שכירות'
      case 'employment': return 'העסקה'
      case 'partnership': return 'שותפות'
      case 'service': return 'שירותים'
      case 'nda': return 'סודיות'
      default: return type
    }
  }

  const getRiskLabel = (risk: string) => {
    switch (risk) {
      case 'low': return 'נמוך'
      case 'medium': return 'בינוני'
      case 'high': return 'גבוה'
      case 'very_high': return 'גבוה מאוד'
      default: return risk
    }
  }

  const filteredContracts = contracts.filter(contract => {
    const matchesSearch = contract.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contract.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || contract.status === statusFilter
    const matchesType = typeFilter === 'all' || contract.type === typeFilter
    
    return matchesSearch && matchesStatus && matchesType
  })

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>, contract: Contract) => {
    event.preventDefault()
    event.stopPropagation()
    setAnchorEl(event.currentTarget)
    setSelectedContract(contract)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
    setSelectedContract(null)
  }

  const handleViewContract = () => {
    if (selectedContract) {
      navigate(`/contracts/${selectedContract.id}`)
    }
    handleMenuClose()
  }

  const handleEditContract = () => {
    if (selectedContract) {
      navigate(`/contracts/${selectedContract.id}/edit`)
    }
    handleMenuClose()
  }

  const handleDeleteContract = () => {
    setShowDeleteDialog(true)
    handleMenuClose()
  }

  const confirmDelete = () => {
    // Handle delete logic here
    setShowDeleteDialog(false)
  }

  const handleCardClick = (contract: Contract) => {
    navigate(`/contracts/${contract.id}`)
  }

  const stats = {
    total: contracts.length,
    active: contracts.filter(c => c.status === 'active').length,
    draft: contracts.filter(c => c.status === 'draft').length,
    expired: contracts.filter(c => c.status === 'expired').length,
    highRisk: contracts.filter(c => c.riskLevel === 'high' || c.riskLevel === 'very_high').length
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h4" component="h1">
            {t('contracts.title')}
          </Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            size="large"
            onClick={() => navigate('/contracts/new')}
          >
            {t('contracts.newContract')}
          </Button>
        </Box>

        {/* Stats Cards */}
        <Grid container spacing={2} sx={{ mb: 4 }}>
          <Grid item xs={6} md={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h4" color="primary" fontWeight="bold">
                  {stats.total}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  חוזים סה״כ
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6} md={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h4" color="success.main" fontWeight="bold">
                  {stats.active}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  חוזים פעילים
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6} md={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h4" color="warning.main" fontWeight="bold">
                  {stats.draft}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  טיוטות
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6} md={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h4" color="error.main" fontWeight="bold">
                  {stats.highRisk}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  סיכון גבוה
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Filters */}
        <Card sx={{ mb: 3 }}>
          <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
            <Grid container spacing={{ xs: 2, sm: 3 }} alignItems="center">
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  fullWidth
                  placeholder="חיפוש חוזים..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  size={isSmallMobile ? 'small' : 'medium'}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={6} sm={6} md={3}>
                <FormControl fullWidth size={isSmallMobile ? 'small' : 'medium'}>
                  <InputLabel>סטטוס</InputLabel>
                  <Select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    label="סטטוס"
                  >
                    <MenuItem value="all">הכל</MenuItem>
                    <MenuItem value="active">פעיל</MenuItem>
                    <MenuItem value="draft">טיוטה</MenuItem>
                    <MenuItem value="expired">פג תוקף</MenuItem>
                    <MenuItem value="pending">ממתין</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={6} sm={6} md={3}>
                <FormControl fullWidth size={isSmallMobile ? 'small' : 'medium'}>
                  <InputLabel>סוג חוזה</InputLabel>
                  <Select
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                    label="סוג חוזה"
                  >
                    <MenuItem value="all">הכל</MenuItem>
                    <MenuItem value="rental">שכירות</MenuItem>
                    <MenuItem value="employment">העסקה</MenuItem>
                    <MenuItem value="partnership">שותפות</MenuItem>
                    <MenuItem value="service">שירותים</MenuItem>
                    <MenuItem value="nda">סודיות</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={12} md={2}>
                <Box sx={{ 
                  display: 'flex', 
                  gap: { xs: 1, sm: 1 },
                  justifyContent: { xs: 'center', sm: 'flex-start' }
                }}>
                  <Button
                    variant={viewMode === 'grid' ? 'contained' : 'outlined'}
                    onClick={() => setViewMode('grid')}
                    size={isSmallMobile ? 'small' : 'medium'}
                    sx={{ 
                      minWidth: { xs: '60px', sm: 'auto' },
                      fontSize: { xs: '0.75rem', sm: '0.875rem' }
                    }}
                  >
                    רשת
                  </Button>
                  <Button
                    variant={viewMode === 'table' ? 'contained' : 'outlined'}
                    onClick={() => setViewMode('table')}
                    size={isSmallMobile ? 'small' : 'medium'}
                    sx={{ 
                      minWidth: { xs: '60px', sm: 'auto' },
                      fontSize: { xs: '0.75rem', sm: '0.875rem' }
                    }}
                  >
                    טבלה
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Contracts List */}
        {viewMode === 'grid' ? (
          <Grid container spacing={{ xs: 2, sm: 3 }}>
            {filteredContracts.map((contract) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={contract.id}>
                                 <Card 
                   sx={{ 
                     height: '100%',
                     transition: 'all 0.2s ease-in-out',
                     cursor: 'pointer',
                     '&:hover': {
                       transform: 'translateY(-2px)',
                       boxShadow: theme.shadows[4],
                       backgroundColor: theme.palette.action.hover,
                     },
                     '&:focus-within': {
                       transform: 'translateY(-1px)',
                       boxShadow: theme.shadows[2],
                     },
                     '&:active': {
                       transform: 'translateY(0px)',
                       boxShadow: theme.shadows[1],
                     },
                   }}
                   onClick={() => handleCardClick(contract)}
                   role="button"
                   tabIndex={0}
                                        onKeyDown={(e) => {
                       if (e.key === 'Enter' || e.key === ' ') {
                         e.preventDefault()
                         handleCardClick(contract)
                       }
                     }}
                     aria-label={`צפה בחוזה ${contract.title}`}
                 >
                  <CardContent sx={{ 
                    p: { xs: 2, sm: 3 },
                    '&:last-child': {
                      pb: { xs: 2, sm: 3 }
                    }
                  }}>
                    <Box sx={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'flex-start', 
                      mb: { xs: 1.5, sm: 2 } 
                    }}>
                      <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center',
                        flex: 1,
                        minWidth: 0
                      }}>
                                                 <Box sx={{ pointerEvents: 'none' }}>
                           {getTypeIcon(contract.type)}
                         </Box>
                                                 <Typography 
                           variant={isSmallMobile ? 'subtitle1' : 'h6'} 
                           sx={{ 
                             ml: { xs: 0.5, sm: 1 },
                             fontSize: { xs: '1rem', sm: '1.25rem' },
                             overflow: 'hidden',
                             textOverflow: 'ellipsis',
                             whiteSpace: 'nowrap',
                             pointerEvents: 'none'
                           }}
                         >
                           {contract.title}
                         </Typography>
                      </Box>
                                             <IconButton
                         size={isSmallMobile ? 'small' : 'medium'}
                         onClick={(e) => handleMenuClick(e, contract)}
                         aria-label="פעולות נוספות"
                         sx={{ 
                           flexShrink: 0,
                           '&:hover': {
                             backgroundColor: 'rgba(0, 0, 0, 0.04)',
                           }
                         }}
                       >
                         <MoreVert />
                       </IconButton>
                    </Box>
                    
                                         <Typography 
                       variant="body2" 
                       color="text.secondary" 
                       paragraph
                       sx={{
                         fontSize: { xs: '0.875rem', sm: '1rem' },
                         lineHeight: 1.4,
                         mb: { xs: 1.5, sm: 2 },
                         pointerEvents: 'none'
                       }}
                     >
                       {contract.description}
                     </Typography>
                    
                                         <Box sx={{ 
                       display: 'flex', 
                       gap: { xs: 0.5, sm: 1 }, 
                       mb: { xs: 1.5, sm: 2 }, 
                       flexWrap: 'wrap' 
                     }}>
                       <Chip 
                         label={getTypeLabel(contract.type)} 
                         size={isSmallMobile ? 'small' : 'medium'} 
                         variant="outlined"
                         sx={{ 
                           fontSize: { xs: '0.75rem', sm: '0.875rem' },
                           pointerEvents: 'none'
                         }}
                       />
                       <Chip 
                         label={t(`contracts.${contract.status}`)} 
                         color={getStatusColor(contract.status)} 
                         size={isSmallMobile ? 'small' : 'medium'} 
                         sx={{ 
                           fontSize: { xs: '0.75rem', sm: '0.875rem' },
                           pointerEvents: 'none'
                         }}
                       />
                       <Chip 
                         label={`סיכון: ${getRiskLabel(contract.riskLevel)}`} 
                         color={getRiskColor(contract.riskLevel)} 
                         size={isSmallMobile ? 'small' : 'medium'} 
                         sx={{ 
                           fontSize: { xs: '0.75rem', sm: '0.875rem' },
                           pointerEvents: 'none'
                         }}
                       />
                     </Box>
                    
                                         <Box sx={{ 
                       display: 'flex', 
                       justifyContent: 'space-between', 
                       alignItems: 'center',
                       flexWrap: 'wrap',
                       gap: { xs: 0.5, sm: 1 }
                     }}>
                       <Typography 
                         variant="caption" 
                         color="text.secondary"
                         sx={{ 
                           fontSize: { xs: '0.75rem', sm: '0.875rem' },
                           pointerEvents: 'none'
                         }}
                       >
                         נוצר: {new Date(contract.createdDate).toLocaleDateString('he-IL')}
                       </Typography>
                       {contract.value && (
                         <Typography 
                           variant="caption" 
                           color="primary" 
                           fontWeight="bold"
                           sx={{ 
                             fontSize: { xs: '0.75rem', sm: '0.875rem' },
                             pointerEvents: 'none'
                           }}
                         >
                           ₪{contract.value.toLocaleString()}
                         </Typography>
                       )}
                     </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <TableContainer component={Paper} sx={{ 
            maxWidth: '100%',
            overflowX: 'auto'
          }}>
            <Table sx={{ 
              minWidth: { xs: 650, sm: 800 },
              '& .MuiTableCell-root': {
                fontSize: { xs: '0.75rem', sm: '0.875rem' },
                padding: { xs: '8px 4px', sm: '16px' }
              }
            }}>
              <TableHead>
                <TableRow>
                  <TableCell>חוזה</TableCell>
                  <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>סוג</TableCell>
                  <TableCell>סטטוס</TableCell>
                  <TableCell sx={{ display: { xs: 'none', lg: 'table-cell' } }}>סיכון</TableCell>
                  <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>צדדים</TableCell>
                  <TableCell sx={{ display: { xs: 'none', lg: 'table-cell' } }}>ערך</TableCell>
                  <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>תאריך יצירה</TableCell>
                  <TableCell>פעולות</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredContracts.map((contract) => (
                  <TableRow key={contract.id}>
                    <TableCell>
                                             <Box sx={{ pointerEvents: 'none' }}>
                         <Typography variant="subtitle2">{contract.title}</Typography>
                         <Typography variant="caption" color="text.secondary">
                           {contract.description}
                         </Typography>
                       </Box>
                    </TableCell>
                    <TableCell>
                                             <Chip 
                         label={getTypeLabel(contract.type)} 
                         size="small" 
                         variant="outlined"
                         sx={{ pointerEvents: 'none' }}
                       />
                    </TableCell>
                    <TableCell>
                                             <Chip 
                         label={t(`contracts.${contract.status}`)} 
                         color={getStatusColor(contract.status)} 
                         size="small" 
                         sx={{ pointerEvents: 'none' }}
                       />
                    </TableCell>
                    <TableCell>
                                             <Chip 
                         label={getRiskLabel(contract.riskLevel)} 
                         color={getRiskColor(contract.riskLevel)} 
                         size="small" 
                         sx={{ pointerEvents: 'none' }}
                       />
                    </TableCell>
                    <TableCell>
                                             <Typography variant="body2" sx={{ pointerEvents: 'none' }}>
                         {contract.parties.join(', ')}
                       </Typography>
                    </TableCell>
                    <TableCell>
                                             {contract.value ? (
                         <Typography variant="body2" fontWeight="bold" sx={{ pointerEvents: 'none' }}>
                           ₪{contract.value.toLocaleString()}
                         </Typography>
                       ) : (
                         <Typography variant="body2" color="text.secondary" sx={{ pointerEvents: 'none' }}>
                           -
                         </Typography>
                       )}
                    </TableCell>
                    <TableCell>
                                             <Typography variant="body2" sx={{ pointerEvents: 'none' }}>
                         {new Date(contract.createdDate).toLocaleDateString('he-IL')}
                       </Typography>
                    </TableCell>
                    <TableCell>
                                               <IconButton
                           size="small"
                           onClick={(e) => handleMenuClick(e, contract)}
                           aria-label="פעולות נוספות"
                           sx={{
                             '&:hover': {
                               backgroundColor: 'rgba(0, 0, 0, 0.04)',
                             }
                           }}
                         >
                           <MoreVert />
                         </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {/* Empty State */}
        {filteredContracts.length === 0 && (
          <Card sx={{ 
            p: { xs: 3, sm: 4 }, 
            textAlign: 'center',
            mx: { xs: 2, sm: 0 }
          }}>
            <Description sx={{ 
              fontSize: { xs: 48, sm: 64 }, 
              color: 'text.secondary', 
              mb: { xs: 1.5, sm: 2 } 
            }} />
            <Typography 
              variant={isSmallMobile ? 'h6' : 'h5'} 
              gutterBottom
              sx={{ fontSize: { xs: '1.25rem', sm: '1.5rem' } }}
            >
              לא נמצאו חוזים
            </Typography>
            <Typography 
              variant="body2" 
              color="text.secondary" 
              paragraph
              sx={{ 
                fontSize: { xs: '0.875rem', sm: '1rem' },
                mb: { xs: 2, sm: 3 }
              }}
            >
              נסה לשנות את הפילטרים או צור חוזה חדש
            </Typography>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => navigate('/contracts/new')}
              size={isSmallMobile ? 'medium' : 'large'}
              sx={{ 
                fontSize: { xs: '0.875rem', sm: '1rem' },
                px: { xs: 2, sm: 3 },
                py: { xs: 1, sm: 1.5 }
              }}
            >
              צור חוזה חדש
            </Button>
          </Card>
        )}

        {/* Action Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          PaperProps={{
            sx: {
              minWidth: { xs: 150, sm: 180 },
              '& .MuiMenuItem-root': {
                fontSize: { xs: '0.875rem', sm: '1rem' },
                py: { xs: 1, sm: 1.5 }
              }
            }
          }}
        >
          <MenuItem onClick={handleViewContract}>
            <ListItemIcon>
              <Visibility fontSize="small" />
            </ListItemIcon>
            <ListItemText>צפה</ListItemText>
          </MenuItem>
          <MenuItem onClick={handleEditContract}>
            <ListItemIcon>
              <Edit fontSize="small" />
            </ListItemIcon>
            <ListItemText>ערוך</ListItemText>
          </MenuItem>
          <MenuItem>
            <ListItemIcon>
              <Assessment fontSize="small" />
            </ListItemIcon>
            <ListItemText>ניתוח סיכון</ListItemText>
          </MenuItem>
          <MenuItem>
            <ListItemIcon>
              <Download fontSize="small" />
            </ListItemIcon>
            <ListItemText>הורד</ListItemText>
          </MenuItem>
          <MenuItem>
            <ListItemIcon>
              <Share fontSize="small" />
            </ListItemIcon>
            <ListItemText>שתף</ListItemText>
          </MenuItem>
          <Divider />
          <MenuItem onClick={handleDeleteContract} sx={{ color: 'error.main' }}>
            <ListItemIcon>
              <Delete fontSize="small" color="error" />
            </ListItemIcon>
            <ListItemText>מחק</ListItemText>
          </MenuItem>
        </Menu>

        {/* Delete Confirmation Dialog */}
        <Dialog 
          open={showDeleteDialog} 
          onClose={() => setShowDeleteDialog(false)}
          fullWidth
          maxWidth="sm"
          PaperProps={{
            sx: {
              mx: { xs: 2, sm: 0 },
              width: { xs: 'calc(100% - 32px)', sm: 'auto' }
            }
          }}
        >
          <DialogTitle sx={{ 
            fontSize: { xs: '1.25rem', sm: '1.5rem' },
            pb: { xs: 1, sm: 2 }
          }}>
            מחיקת חוזה
          </DialogTitle>
          <DialogContent sx={{ pt: { xs: 1, sm: 2 } }}>
            <Typography sx={{ 
              fontSize: { xs: '0.875rem', sm: '1rem' },
              lineHeight: 1.5
            }}>
              האם אתה בטוח שברצונך למחוק את החוזה "{selectedContract?.title}"?
              פעולה זו אינה הפיכה.
            </Typography>
          </DialogContent>
          <DialogActions sx={{ 
            p: { xs: 2, sm: 3 },
            gap: { xs: 1, sm: 2 }
          }}>
            <Button 
              onClick={() => setShowDeleteDialog(false)}
              size={isSmallMobile ? 'small' : 'medium'}
              sx={{ 
                fontSize: { xs: '0.875rem', sm: '1rem' }
              }}
            >
              ביטול
            </Button>
            <Button 
              onClick={confirmDelete} 
              color="error" 
              variant="contained"
              size={isSmallMobile ? 'small' : 'medium'}
              sx={{ 
                fontSize: { xs: '0.875rem', sm: '1rem' }
              }}
            >
              מחק
            </Button>
          </DialogActions>
        </Dialog>

        {/* Floating Action Button */}
        <Fab
          color="primary"
          aria-label="צור חוזה חדש"
          sx={{ 
            position: 'fixed', 
            bottom: { xs: 16, sm: 24 }, 
            right: { xs: 16, sm: 24 },
            width: { xs: 56, sm: 64 },
            height: { xs: 56, sm: 64 },
            '&:hover': {
              transform: 'scale(1.1)',
            },
            transition: 'transform 0.2s ease-in-out'
          }}
          onClick={() => navigate('/contracts/new')}
        >
          <Add sx={{ fontSize: { xs: 24, sm: 28 } }} />
        </Fab>
      </Box>
    </Container>
  )
}

import React, { useState, useMemo, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Chip,
  Grid,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  LinearProgress,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput,
  SelectChangeEvent,
  CircularProgress,
} from '@mui/material';
import {
  Description,
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchContracts,
  setSelectedContract,
  setContractsFilter,
  addNotification,
  selectContracts,
  selectSelectedContract,
  selectContractsFilter,
  selectIsLoading,
  selectError,
  selectOnlineStatus,
  selectFilteredContracts,
} from '@shared/store/advancedSlice';
import { AppDispatch, RootState } from '@shared/store';
import type { Contract } from '@shared/services/api/types';



const AdvancedContractManager: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('updatedAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Selectors
  const contracts = useSelector(selectContracts);
  const selectedContractFromStore = useSelector(selectSelectedContract);
  const contractsFilter = useSelector(selectContractsFilter);
  const isLoading = useSelector(selectIsLoading);
  const error = useSelector(selectError);
  const isOnline = useSelector(selectOnlineStatus);
  const filteredContracts = useSelector(selectFilteredContracts);

  // Load contracts on mount
  useEffect(() => {
    dispatch(fetchContracts(undefined));
  }, [dispatch]);

  // Filtered and sorted contracts
  const sortedContracts = useMemo(() => {
    let filtered = [...filteredContracts];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(contract =>
        contract.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contract.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contract.parties.some(party => party.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Status filter
    if (statusFilter.length > 0) {
      filtered = filtered.filter(contract => statusFilter.includes(contract.status));
    }

    // Sort - create a new sorted array instead of modifying in place
    return [...filtered].sort((a, b) => {
      let aValue: unknown;
      let bValue: unknown;
      
      switch (sortBy) {
        case 'updatedAt':
          aValue = new Date(a.updatedAt);
          bValue = new Date(b.updatedAt);
          break;
        case 'createdAt':
          aValue = new Date(a.createdAt);
          bValue = new Date(b.createdAt);
          break;
        case 'title':
          aValue = a.title;
          bValue = b.title;
          break;
        case 'status':
          aValue = a.status;
          bValue = b.status;
          break;
        default:
          aValue = new Date(a.updatedAt);
          bValue = new Date(b.updatedAt);
      }
      
      if (sortOrder === 'asc') {
        return (aValue as Date | string) > (bValue as Date | string) ? 1 : -1;
      } else {
        return (aValue as Date | string) < (bValue as Date | string) ? 1 : -1;
      }
    });

    return filtered;
  }, [filteredContracts, searchTerm, statusFilter, sortBy, sortOrder]);

  // Handlers
  const handleViewContract = (contract: Record<string, unknown>) => {
    dispatch(setSelectedContract(contract as any));
    dispatch(addNotification({
      type: 'info',
      title: 'חוזה נבחר',
      message: `החוזה "${contract.title}" נבחר לצפייה`,
    }));
  };

  const handleStatusFilterChange = (event: SelectChangeEvent<string[]>) => {
    const value = event.target.value;
    const newStatusFilter = typeof value === 'string' ? value.split(',') : value;
    setStatusFilter(newStatusFilter);
    dispatch(setContractsFilter({ status: newStatusFilter }));
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchTerm(value);
    dispatch(setContractsFilter({ search: value }));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': {
        return 'success';
      }
      case 'draft': {
        return 'warning';
      }
      case 'expired': {
        return 'error';
      }
      case 'archived': {
        return 'default';
      }
      default: {
        return 'default';
      }
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': {
        return 'פעיל';
      }
      case 'draft': {
        return 'טיוטה';
      }
      case 'expired': {
        return 'פג תוקף';
      }
      case 'archived': {
        return 'בארכיון';
      }
      default: {
        return status;
      }
    }
  };

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        שגיאה בטעינת החוזים: {error}
      </Alert>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Compact Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 50,
            height: 50,
            borderRadius: '50%',
            background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
            color: 'white',
            boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)',
          }}>
            <Description sx={{ fontSize: 24 }} />
          </Box>
          <Box>
            <Typography variant="h5" component="h2" sx={{ fontWeight: 'bold' }}>
              ניהול חוזים מתקדם
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {contracts.length} חוזים במערכת
            </Typography>
          </Box>
        </Box>
        
        <Button
          variant="contained"
          size="large"
          onClick={() => window.location.href = '/contracts'}
          sx={{
            px: 4,
            py: 1.5,
            fontSize: '1.1rem',
            fontWeight: 'bold',
            borderRadius: 2,
            background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
            boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)',
            '&:hover': {
              background: 'linear-gradient(45deg, #1565c0, #1976d2)',
              transform: 'translateY(-2px)',
              boxShadow: '0 6px 20px rgba(25, 118, 210, 0.4)',
            },
          }}
        >
          פתח ניהול חוזים
        </Button>
      </Box>

      {/* Quick Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{
            background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)',
            borderRadius: 2,
            boxShadow: '0 4px 12px rgba(25, 118, 210, 0.15)',
            cursor: 'pointer',
            transition: 'all 0.3s ease-in-out',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: '0 6px 20px rgba(25, 118, 210, 0.25)',
            },
          }} onClick={() => window.location.href = '/contracts'}>
            <CardContent sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="h4" color="primary" sx={{ fontWeight: 'bold' }}>
                {contracts.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                חוזים סה״כ
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{
            background: 'linear-gradient(135deg, #e8f5e8 0%, #c8e6c9 100%)',
            borderRadius: 2,
            boxShadow: '0 4px 12px rgba(76, 175, 80, 0.15)',
            cursor: 'pointer',
            transition: 'all 0.3s ease-in-out',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: '0 6px 20px rgba(76, 175, 80, 0.25)',
            },
          }} onClick={() => window.location.href = '/contracts'}>
            <CardContent sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="h4" color="success.main" sx={{ fontWeight: 'bold' }}>
                {contracts.filter(c => c.status === 'active').length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                חוזים פעילים
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{
            background: 'linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%)',
            borderRadius: 2,
            boxShadow: '0 4px 12px rgba(255, 152, 0, 0.15)',
            cursor: 'pointer',
            transition: 'all 0.3s ease-in-out',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: '0 6px 20px rgba(255, 152, 0, 0.25)',
            },
          }} onClick={() => window.location.href = '/contracts'}>
            <CardContent sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="h4" color="warning.main" sx={{ fontWeight: 'bold' }}>
                {contracts.filter(c => c.status === 'draft').length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                טיוטות
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{
            background: 'linear-gradient(135deg, #ffebee 0%, #ffcdd2 100%)',
            borderRadius: 2,
            boxShadow: '0 4px 12px rgba(244, 67, 54, 0.15)',
            cursor: 'pointer',
            transition: 'all 0.3s ease-in-out',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: '0 6px 20px rgba(244, 67, 54, 0.25)',
            },
          }} onClick={() => window.location.href = '/contracts'}>
            <CardContent sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="h4" color="error.main" sx={{ fontWeight: 'bold' }}>
                {contracts.filter(c => c.status === 'expired').length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                פגי תוקף
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Recent Contracts Preview */}
      <Card sx={{
        background: 'rgba(255,255,255,0.8)',
        borderRadius: 2,
        boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
        backdropFilter: 'blur(10px)',
      }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              חוזים אחרונים
            </Typography>
            <Button
              variant="text"
              onClick={() => window.location.href = '/contracts'}
              sx={{ fontWeight: 'bold' }}
            >
              צפה בכל החוזים →
            </Button>
          </Box>
          
          {isLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
              <CircularProgress />
            </Box>
          ) : (
            <Grid container spacing={2}>
              {sortedContracts.slice(0, 3).map((contract) => (
                <Grid item xs={12} key={contract.id}>
                  <Card 
                    variant="outlined" 
                    sx={{ 
                      cursor: 'pointer',
                      transition: 'all 0.2s ease-in-out',
                      '&:hover': {
                        backgroundColor: 'rgba(25, 118, 210, 0.04)',
                        borderColor: 'primary.main',
                      }
                    }}
                    onClick={() => window.location.href = '/contracts'}
                  >
                    <CardContent sx={{ py: 1.5, px: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box>
                          <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                            {contract.title}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {contract.parties.join(', ')}
                          </Typography>
                        </Box>
                        <Chip 
                          label={getStatusText(contract.status)} 
                          color={getStatusColor(contract.status) as 'success' | 'warning' | 'error' | 'default'}
                          size="small"
                        />
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};



export default AdvancedContractManager;

// Contract Editor Component
// עורך חוזים מתקדם

import React, { useState, useEffect } from 'react'
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Grid,
  Card,
  CardContent,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Divider
} from '@mui/material'
import {
  Save,
  Preview,
  Add,
  Delete,
  Download
} from '@mui/icons-material'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { logger } from '@shared/utils/logger'
import { LoadingSpinner } from '@shared/components/ui/LoadingSpinner'
import type { Contract, ContractTerm, ContractParty } from '../types'

interface ContractEditorProps {
  mode?: 'create' | 'edit' | 'view'
  contract?: Partial<Contract>
}

export const ContractEditor: React.FC<ContractEditorProps> = ({ 
  mode = 'edit', 
  contract: initialContract 
}) => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  
  // TODO: Add contracts slice to store
  const currentContract = null
  const loading = false
  const error = null
  
  const [contract, setContract] = useState<Partial<Contract>>(initialContract || {
    title: '',
    description: '',
    type: 'other',
    status: 'draft',
    parties: [],
    terms: [],
    tags: []
  })
  
  const [activeTab, setActiveTab] = useState('details')
  const [showPreview, setShowPreview] = useState(false)

  const [newTag, setNewTag] = useState('')

  useEffect(() => {
    if (id && mode !== 'create') {
      // TODO: Implement fetchContract
      // console.log('Fetching contract:', id)
    }
  }, [id, mode, dispatch])

  useEffect(() => {
    if (currentContract && mode !== 'create') {
      setContract(currentContract)
    }
  }, [currentContract, mode])

  const handleSave = async () => {
    try {
      if (mode === 'create') {
        // TODO: Implement createContract
        // console.log('Creating contract:', contract)
        navigate('/contracts')
      } else if (id) {
        // TODO: Implement updateContract
        // console.log('Updating contract:', id, contract)
      }
    } catch (error) {
      logger.error('שגיאה בשמירת חוזה:', error)
    }
  }

  const handleAddParty = () => {
    const newParty: ContractParty = {
      id: Date.now().toString(),
      name: '',
      type: 'individual',
      role: 'client',
      email: ''
    }
    setContract(prev => ({
      ...prev,
      parties: [...(prev.parties || []), newParty]
    }))
  }

  const handleUpdateParty = (index: number, updates: Partial<ContractParty>) => {
    setContract(prev => ({
      ...prev,
      parties: prev.parties?.map((party, i) => 
        i === index ? { ...party, ...updates } : party
      )
    }))
  }

  const handleRemoveParty = (index: number) => {
    setContract(prev => ({
      ...prev,
      parties: prev.parties?.filter((_, i) => i !== index)
    }))
  }

  const handleAddTerm = () => {
    const newTerm: ContractTerm = {
      id: Date.now().toString(),
      title: '',
      content: '',
      category: 'other',
      riskLevel: 'low',
      isRequired: true,
      isNegotiable: true
    }
    setContract(prev => ({
      ...prev,
      terms: [...(prev.terms || []), newTerm]
    }))
  }

  const handleUpdateTerm = (index: number, updates: Partial<ContractTerm>) => {
    setContract(prev => ({
      ...prev,
      terms: prev.terms?.map((term, i) => 
        i === index ? { ...term, ...updates } : term
      )
    }))
  }

  const handleRemoveTerm = (index: number) => {
    setContract(prev => ({
      ...prev,
      terms: prev.terms?.filter((_, i) => i !== index)
    }))
  }

  const handleAddTag = () => {
    if (newTag.trim() && !contract.tags?.includes(newTag.trim())) {
      setContract(prev => ({
        ...prev,
        tags: [...(prev.tags || []), newTag.trim()]
      }))
      setNewTag('')
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setContract(prev => ({
      ...prev,
      tags: prev.tags?.filter(tag => tag !== tagToRemove)
    }))
  }

  if (loading) {
    return <LoadingSpinner />
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>
  }

  return (
    <Box sx={{ p: 3 }}>
      <Paper sx={{ p: 3 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1">
            {mode === 'create' ? t('contracts.create') : t('contracts.edit')}
          </Typography>
          <Box>
            <Button
              startIcon={<Preview />}
              onClick={() => setShowPreview(true)}
              sx={{ mr: 1 }}
            >
              {t('common.preview')}
            </Button>

            <Button
              variant="contained"
              startIcon={<Save />}
              onClick={handleSave}
            >
              {t('common.save')}
            </Button>
          </Box>
        </Box>

        {/* Tabs */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Button
            onClick={() => setActiveTab('details')}
            variant={activeTab === 'details' ? 'contained' : 'text'}
            sx={{ mr: 1 }}
          >
            {t('contracts.details')}
          </Button>
          <Button
            onClick={() => setActiveTab('parties')}
            variant={activeTab === 'parties' ? 'contained' : 'text'}
            sx={{ mr: 1 }}
          >
            {t('contracts.parties')}
          </Button>
          <Button
            onClick={() => setActiveTab('terms')}
            variant={activeTab === 'terms' ? 'contained' : 'text'}
            sx={{ mr: 1 }}
          >
            {t('contracts.terms')}
          </Button>
          <Button
            onClick={() => setActiveTab('content')}
            variant={activeTab === 'content' ? 'contained' : 'text'}
          >
            {t('contracts.content')}
          </Button>
        </Box>

        {/* Details Tab */}
        {activeTab === 'details' && (
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <TextField
                fullWidth
                label={t('contracts.title')}
                value={contract.title}
                onChange={(e) => setContract(prev => ({ ...prev, title: e.target.value }))}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                multiline
                rows={3}
                label={t('contracts.description')}
                value={contract.description}
                onChange={(e) => setContract(prev => ({ ...prev, description: e.target.value }))}
                sx={{ mb: 2 }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>{t('contracts.type')}</InputLabel>
                <Select
                  value={contract.type}
                  onChange={(e) => setContract(prev => ({ ...prev, type: e.target.value as any }))}
                >
                  <MenuItem value="employment">{t('contracts.types.employment')}</MenuItem>
                  <MenuItem value="service">{t('contracts.types.service')}</MenuItem>
                  <MenuItem value="lease">{t('contracts.types.lease')}</MenuItem>
                  <MenuItem value="purchase">{t('contracts.types.purchase')}</MenuItem>
                  <MenuItem value="nda">{t('contracts.types.nda')}</MenuItem>
                  <MenuItem value="other">{t('contracts.types.other')}</MenuItem>
                </Select>
              </FormControl>
              
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>{t('contracts.status')}</InputLabel>
                <Select
                  value={contract.status}
                  onChange={(e) => setContract(prev => ({ ...prev, status: e.target.value as any }))}
                >
                  <MenuItem value="draft">{t('contracts.statuses.draft')}</MenuItem>
                  <MenuItem value="active">{t('contracts.statuses.active')}</MenuItem>
                  <MenuItem value="expired">{t('contracts.statuses.expired')}</MenuItem>
                  <MenuItem value="terminated">{t('contracts.statuses.terminated')}</MenuItem>
                </Select>
              </FormControl>

              {/* Tags */}
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  {t('contracts.tags')}
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                  <TextField
                    size="small"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                    placeholder={t('contracts.addTag')}
                  />
                  <Button size="small" onClick={handleAddTag}>
                    <Add />
                  </Button>
                </Box>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {contract.tags?.map((tag) => (
                    <Chip
                      key={tag}
                      label={tag}
                      onDelete={() => handleRemoveTag(tag)}
                      size="small"
                    />
                  ))}
                </Box>
              </Box>
            </Grid>
          </Grid>
        )}

        {/* Parties Tab */}
        {activeTab === 'parties' && (
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">{t('contracts.parties')}</Typography>
              <Button startIcon={<Add />} onClick={handleAddParty}>
                {t('contracts.addParty')}
              </Button>
            </Box>
            
            {contract.parties?.map((party, index) => (
              <Card key={party.id} sx={{ mb: 2 }}>
                <CardContent>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={3}>
                      <TextField
                        fullWidth
                        label={t('contracts.party.name')}
                        value={party.name}
                        onChange={(e) => handleUpdateParty(index, { name: e.target.value })}
                      />
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <FormControl fullWidth>
                        <InputLabel>{t('contracts.party.type')}</InputLabel>
                        <Select
                          value={party.type}
                          onChange={(e) => handleUpdateParty(index, { type: e.target.value as any })}
                        >
                          <MenuItem value="individual">{t('contracts.party.types.individual')}</MenuItem>
                          <MenuItem value="company">{t('contracts.party.types.company')}</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <FormControl fullWidth>
                        <InputLabel>{t('contracts.party.role')}</InputLabel>
                        <Select
                          value={party.role}
                          onChange={(e) => handleUpdateParty(index, { role: e.target.value as any })}
                        >
                          <MenuItem value="client">{t('contracts.party.roles.client')}</MenuItem>
                          <MenuItem value="vendor">{t('contracts.party.roles.vendor')}</MenuItem>
                          <MenuItem value="employee">{t('contracts.party.roles.employee')}</MenuItem>
                          <MenuItem value="partner">{t('contracts.party.roles.partner')}</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <TextField
                        fullWidth
                        label={t('contracts.party.email')}
                        value={party.email}
                        onChange={(e) => handleUpdateParty(index, { email: e.target.value })}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <IconButton onClick={() => handleRemoveParty(index)} color="error">
                          <Delete />
                        </IconButton>
                      </Box>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            ))}
          </Box>
        )}

        {/* Terms Tab */}
        {activeTab === 'terms' && (
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">{t('contracts.terms')}</Typography>
              <Button startIcon={<Add />} onClick={handleAddTerm}>
                {t('contracts.addTerm')}
              </Button>
            </Box>
            
            {contract.terms?.map((term, index) => (
              <Card key={term.id} sx={{ mb: 2 }}>
                <CardContent>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={4}>
                      <TextField
                        fullWidth
                        label={t('contracts.term.title')}
                        value={term.title}
                        onChange={(e) => handleUpdateTerm(index, { title: e.target.value })}
                      />
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <FormControl fullWidth>
                        <InputLabel>{t('contracts.term.category')}</InputLabel>
                        <Select
                          value={term.category}
                          onChange={(e) => handleUpdateTerm(index, { category: e.target.value as any })}
                        >
                          <MenuItem value="payment">{t('contracts.term.categories.payment')}</MenuItem>
                          <MenuItem value="delivery">{t('contracts.term.categories.delivery')}</MenuItem>
                          <MenuItem value="liability">{t('contracts.term.categories.liability')}</MenuItem>
                          <MenuItem value="confidentiality">{t('contracts.term.categories.confidentiality')}</MenuItem>
                          <MenuItem value="termination">{t('contracts.term.categories.termination')}</MenuItem>
                          <MenuItem value="other">{t('contracts.term.categories.other')}</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <FormControl fullWidth>
                        <InputLabel>{t('contracts.term.riskLevel')}</InputLabel>
                        <Select
                          value={term.riskLevel}
                          onChange={(e) => handleUpdateTerm(index, { riskLevel: e.target.value as any })}
                        >
                          <MenuItem value="low">{t('contracts.term.riskLevels.low')}</MenuItem>
                          <MenuItem value="medium">{t('contracts.term.riskLevels.medium')}</MenuItem>
                          <MenuItem value="high">{t('contracts.term.riskLevels.high')}</MenuItem>
                          <MenuItem value="critical">{t('contracts.term.riskLevels.critical')}</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} md={2}>
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <IconButton onClick={() => handleRemoveTerm(index)} color="error">
                          <Delete />
                        </IconButton>
                      </Box>
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        multiline
                        rows={3}
                        label={t('contracts.term.content')}
                        value={term.content}
                        onChange={(e) => handleUpdateTerm(index, { content: e.target.value })}
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            ))}
          </Box>
        )}

        {/* Content Tab */}
        {activeTab === 'content' && (
          <Box>
            <Typography variant="h6" sx={{ mb: 2 }}>
              {t('contracts.content')}
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={10}
              label={t('contracts.content')}
              value={(contract as any).content || ''}
              onChange={(e) => setContract(prev => ({ ...prev, content: e.target.value }))}
              placeholder={t('contracts.contentPlaceholder')}
            />
          </Box>
        )}
      </Paper>

      {/* Preview Dialog */}
      <Dialog
        open={showPreview}
        onClose={() => setShowPreview(false)}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>
          {t('contracts.preview')}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ p: 2 }}>
            <Typography variant="h4" sx={{ mb: 2 }}>
              {contract.title}
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              {contract.description}
            </Typography>
            <Divider sx={{ my: 2 }} />
            <div dangerouslySetInnerHTML={{ __html: (contract as any).content || '' }} />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowPreview(false)}>
            {t('common.close')}
          </Button>
          <Button startIcon={<Download />}>
            {t('common.download')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

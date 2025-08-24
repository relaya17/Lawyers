import React, { useState } from 'react'
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Card,
  CardContent,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Slider,
  FormControlLabel,
  Switch,
  Alert
} from '@mui/material'
import {
  Add,
  Delete,
  Edit,
  Warning,
  CheckCircle,
  Error,
  Info,
  Assessment,
  Security,
  Gavel,
  TrendingUp,
  AutoFixHigh
} from '@mui/icons-material'
import { useTranslation } from 'react-i18next'

interface RiskFactor {
  id: string
  name: string
  category: string
  description: string
  likelihood: number
  impact: number
  riskLevel: 'low' | 'medium' | 'high' | 'critical'
  mitigation: string
  isActive: boolean
}

interface RiskFactorFormProps {
  factors: RiskFactor[]
  onAddFactor: (factor: Omit<RiskFactor, 'id'>) => void
  onUpdateFactor: (id: string, factor: Partial<RiskFactor>) => void
  onDeleteFactor: (id: string) => void
}

const RiskFactorForm: React.FC<RiskFactorFormProps> = ({
  factors,
  onAddFactor,
  onUpdateFactor,
  onDeleteFactor
}) => {
  const { t } = useTranslation()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingFactor, setEditingFactor] = useState<RiskFactor | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    description: '',
    likelihood: 3,
    impact: 3,
    mitigation: '',
    isActive: true
  })

  const categories = [
    'legal',
    'financial',
    'operational',
    'compliance',
    'reputational',
    'strategic',
    'regulatory',
    'technical',
    'environmental',
    'social'
  ]

  const calculateRiskLevel = (likelihood: number, impact: number): 'low' | 'medium' | 'high' | 'critical' => {
    const score = likelihood * impact
    if (score <= 4) return 'low'
    if (score <= 8) return 'medium'
    if (score <= 15) return 'high'
    return 'critical'
  }

  const getRiskColor = (level: string) => {
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

  const getRiskIcon = (level: string) => {
    switch (level) {
      case 'low':
        return <CheckCircle />
      case 'medium':
        return <Warning />
      case 'high':
        return <Error />
      case 'critical':
        return <TrendingUp />
      default:
        return <Info />
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const riskLevel = calculateRiskLevel(formData.likelihood, formData.impact)
    
    if (editingFactor) {
      onUpdateFactor(editingFactor.id, {
        ...formData,
        riskLevel
      })
    } else {
      onAddFactor({
        ...formData,
        riskLevel
      })
    }
    
    handleClose()
  }

  const handleEdit = (factor: RiskFactor) => {
    setEditingFactor(factor)
    setFormData({
      name: factor.name,
      category: factor.category,
      description: factor.description,
      likelihood: factor.likelihood,
      impact: factor.impact,
      mitigation: factor.mitigation,
      isActive: factor.isActive
    })
    setIsDialogOpen(true)
  }

  const handleClose = () => {
    setIsDialogOpen(false)
    setEditingFactor(null)
    setFormData({
      name: '',
      category: '',
      description: '',
      likelihood: 3,
      impact: 3,
      mitigation: '',
      isActive: true
    })
  }

  const handleToggleActive = (factor: RiskFactor) => {
    onUpdateFactor(factor.id, { isActive: !factor.isActive })
  }

  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Assessment sx={{ mr: 2, color: 'primary.main' }} />
          <Typography variant="h5" component="h2">
            {t('riskAnalysis.factors.title')}
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setIsDialogOpen(true)}
        >
          {t('riskAnalysis.factors.add')}
        </Button>
      </Box>

      {/* Risk Factors List */}
      <List>
        {factors.map((factor) => (
          <Card key={factor.id} variant="outlined" sx={{ mb: 2 }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                    {getRiskIcon(factor.riskLevel)}
                    <Typography variant="h6">
                      {factor.name}
                    </Typography>
                    <Chip
                      label={t(`riskAnalysis.levels.${factor.riskLevel}`)}
                      color={getRiskColor(factor.riskLevel)}
                      size="small"
                    />
                    <Chip
                      label={t(`riskAnalysis.categories.${factor.category}`)}
                      variant="outlined"
                      size="small"
                    />
                    <FormControlLabel
                      control={
                        <Switch
                          checked={factor.isActive}
                          onChange={() => handleToggleActive(factor)}
                          size="small"
                        />
                      }
                      label={factor.isActive ? t('riskAnalysis.factors.active') : t('riskAnalysis.factors.inactive')}
                    />
                  </Box>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {factor.description}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 2, mb: 1 }}>
                    <Typography variant="caption" color="text.secondary">
                      {t('riskAnalysis.likelihood')}: {factor.likelihood}/5
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {t('riskAnalysis.impact')}: {factor.impact}/5
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {t('riskAnalysis.riskScore')}: {factor.likelihood * factor.impact}/25
                    </Typography>
                  </Box>
                  {factor.mitigation && (
                    <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                      {t('riskAnalysis.mitigation')}: {factor.mitigation}
                    </Typography>
                  )}
                </Box>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <IconButton
                    size="small"
                    onClick={() => handleEdit(factor)}
                    color="primary"
                  >
                    <Edit />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => onDeleteFactor(factor.id)}
                    color="error"
                  >
                    <Delete />
                  </IconButton>
                </Box>
              </Box>
            </CardContent>
          </Card>
        ))}
      </List>

      {factors.length === 0 && (
        <Alert severity="info" sx={{ mt: 2 }}>
          {t('riskAnalysis.factors.noFactors')}
        </Alert>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingFactor ? t('riskAnalysis.factors.edit') : t('riskAnalysis.factors.add')}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label={t('riskAnalysis.factors.name')}
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth required>
                  <InputLabel>{t('riskAnalysis.factors.category')}</InputLabel>
                  <Select
                    value={formData.category}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                    label={t('riskAnalysis.factors.category')}
                  >
                    {categories.map(category => (
                      <MenuItem key={category} value={category}>
                        {t(`riskAnalysis.categories.${category}`)}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label={t('riskAnalysis.factors.description')}
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography gutterBottom>
                  {t('riskAnalysis.likelihood')}: {formData.likelihood}/5
                </Typography>
                <Slider
                  value={formData.likelihood}
                  onChange={(_, value) => setFormData(prev => ({ ...prev, likelihood: value as number }))}
                  min={1}
                  max={5}
                  marks
                  valueLabelDisplay="auto"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography gutterBottom>
                  {t('riskAnalysis.impact')}: {formData.impact}/5
                </Typography>
                <Slider
                  value={formData.impact}
                  onChange={(_, value) => setFormData(prev => ({ ...prev, impact: value as number }))}
                  min={1}
                  max={5}
                  marks
                  valueLabelDisplay="auto"
                />
              </Grid>
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2, backgroundColor: 'grey.50', borderRadius: 1 }}>
                  <Assessment />
                  <Typography>
                    {t('riskAnalysis.riskLevel')}: 
                    <Chip
                      label={t(`riskAnalysis.levels.${calculateRiskLevel(formData.likelihood, formData.impact)}`)}
                      color={getRiskColor(calculateRiskLevel(formData.likelihood, formData.impact))}
                      size="small"
                      sx={{ ml: 1 }}
                    />
                    ({formData.likelihood * formData.impact}/25)
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={2}
                  label={t('riskAnalysis.factors.mitigation')}
                  value={formData.mitigation}
                  onChange={(e) => setFormData(prev => ({ ...prev, mitigation: e.target.value }))}
                  helperText={t('riskAnalysis.factors.mitigationHelper')}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.isActive}
                      onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                    />
                  }
                  label={t('riskAnalysis.factors.active')}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>
              {t('common.cancel')}
            </Button>
            <Button type="submit" variant="contained">
              {editingFactor ? t('common.update') : t('common.add')}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Paper>
  )
}

export default RiskFactorForm

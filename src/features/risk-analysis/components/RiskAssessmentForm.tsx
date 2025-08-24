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
  Alert,
  LinearProgress,
  Card,
  CardContent,
  Divider,
  IconButton,
  Tooltip
} from '@mui/material'
import {
  Upload,
  Assessment,
  Security,
  Warning,
  CheckCircle,
  Error,
  Info,
  Download,
  Share,
  Edit,
  Lightbulb,
  Gavel,
  TrendingUp,
  AutoFixHigh,
  Psychology,
  School
} from '@mui/icons-material'
import { useTranslation } from 'react-i18next'

interface RiskAssessmentFormProps {
  onSubmit: (data: RiskAssessmentData) => void
  isLoading?: boolean
}

interface RiskAssessmentData {
  contractText: string
  contractType: string
  riskCategories: string[]
  analysisDepth: 'basic' | 'standard' | 'comprehensive'
  includeAI: boolean
  includeCompliance: boolean
}

const RiskAssessmentForm: React.FC<RiskAssessmentFormProps> = ({
  onSubmit,
  isLoading = false
}) => {
  const { t } = useTranslation()
  const [formData, setFormData] = useState<RiskAssessmentData>({
    contractText: '',
    contractType: '',
    riskCategories: [],
    analysisDepth: 'standard',
    includeAI: true,
    includeCompliance: true
  })

  const contractTypes = [
    'employment',
    'realEstate',
    'business',
    'technology',
    'financial',
    'service',
    'partnership',
    'other'
  ]

  const riskCategories = [
    'legal',
    'financial',
    'operational',
    'compliance',
    'reputational',
    'strategic',
    'regulatory'
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  const handleCategoryToggle = (category: string) => {
    setFormData(prev => ({
      ...prev,
      riskCategories: prev.riskCategories.includes(category)
        ? prev.riskCategories.filter(c => c !== category)
        : [...prev.riskCategories, category]
    }))
  }

  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Assessment sx={{ mr: 2, color: 'primary.main' }} />
        <Typography variant="h5" component="h2">
          {t('riskAnalysis.assessmentForm.title')}
        </Typography>
      </Box>

      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          {/* Contract Type */}
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>{t('riskAnalysis.contractType')}</InputLabel>
              <Select
                value={formData.contractType}
                onChange={(e) => setFormData(prev => ({ ...prev, contractType: e.target.value }))}
                label={t('riskAnalysis.contractType')}
              >
                {contractTypes.map(type => (
                  <MenuItem key={type} value={type}>
                    {t(`riskAnalysis.contractTypes.${type}`)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Analysis Depth */}
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>{t('riskAnalysis.analysisDepth')}</InputLabel>
              <Select
                value={formData.analysisDepth}
                onChange={(e) => setFormData(prev => ({ ...prev, analysisDepth: e.target.value as any }))}
                label={t('riskAnalysis.analysisDepth')}
              >
                <MenuItem value="basic">{t('riskAnalysis.depth.basic')}</MenuItem>
                <MenuItem value="standard">{t('riskAnalysis.depth.standard')}</MenuItem>
                <MenuItem value="comprehensive">{t('riskAnalysis.depth.comprehensive')}</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/* Risk Categories */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              {t('riskAnalysis.riskCategories')}
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {riskCategories.map(category => (
                <Chip
                  key={category}
                  label={t(`riskAnalysis.categories.${category}`)}
                  onClick={() => handleCategoryToggle(category)}
                  color={formData.riskCategories.includes(category) ? 'primary' : 'default'}
                  variant={formData.riskCategories.includes(category) ? 'filled' : 'outlined'}
                  icon={formData.riskCategories.includes(category) ? <CheckCircle /> : <Warning />}
                />
              ))}
            </Box>
          </Grid>

          {/* Contract Text */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              rows={8}
              label={t('riskAnalysis.contractText')}
              placeholder={t('riskAnalysis.contractTextPlaceholder')}
              value={formData.contractText}
              onChange={(e) => setFormData(prev => ({ ...prev, contractText: e.target.value }))}
              helperText={t('riskAnalysis.contractTextHelper')}
            />
          </Grid>

          {/* Options */}
          <Grid item xs={12}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {t('riskAnalysis.analysisOptions')}
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Lightbulb sx={{ mr: 1, color: 'warning.main' }} />
                      <Typography>
                        {t('riskAnalysis.includeAI')}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Security sx={{ mr: 1, color: 'info.main' }} />
                      <Typography>
                        {t('riskAnalysis.includeCompliance')}
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Submit Button */}
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
              <Button
                variant="outlined"
                startIcon={<Download />}
                disabled={isLoading}
              >
                {t('riskAnalysis.uploadContract')}
              </Button>
              <Button
                type="submit"
                variant="contained"
                startIcon={<Assessment />}
                disabled={isLoading || !formData.contractText.trim()}
                sx={{ minWidth: 150 }}
              >
                {isLoading ? t('riskAnalysis.analyzing') : t('riskAnalysis.startAnalysis')}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </form>

      {isLoading && (
        <Box sx={{ mt: 3 }}>
          <LinearProgress />
          <Typography variant="body2" sx={{ mt: 1, textAlign: 'center' }}>
            {t('riskAnalysis.analysisInProgress')}
          </Typography>
        </Box>
      )}
    </Paper>
  )
}

export default RiskAssessmentForm

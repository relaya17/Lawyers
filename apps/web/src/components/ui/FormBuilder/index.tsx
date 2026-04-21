// Form Builder Component
// רכיב בונה טפסים מתקדם

import React, { useState } from 'react'
import {
  Box,
  Paper,
  Typography,
  Grid,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  IconButton,
  Card,
  CardContent,

  Chip,
  Switch,
  FormControlLabel,

  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,

} from '@mui/material'
import {
  Add,
  Delete,
  Edit,
  DragIndicator,
  TextFields,
  CheckBox,
  RadioButtonChecked,
  ViewList,
  DateRange,
  Email,
  Phone,
  Numbers,
  Description,

} from '@mui/icons-material'
import { useTranslation } from 'react-i18next'

export interface FormField {
  id: string
  type: 'text' | 'email' | 'number' | 'textarea' | 'select' | 'checkbox' | 'radio' | 'date' | 'phone' | 'file'
  label: string
  placeholder?: string
  required?: boolean
  options?: string[]
  validation?: {
    min?: number
    max?: number
    pattern?: string
    message?: string
  }
  defaultValue?: unknown
  order: number
}

interface FormBuilderProps {
  fields?: FormField[]
  onChange?: (fields: FormField[]) => void
  onSave?: (formData: Record<string, unknown>) => void
  readOnly?: boolean
}

const fieldTypes = [
  { type: 'text', label: 'טקסט', icon: <TextFields /> },
  { type: 'email', label: 'אימייל', icon: <Email /> },
  { type: 'number', label: 'מספר', icon: <Numbers /> },
  { type: 'textarea', label: 'אזור טקסט', icon: <Description /> },
  { type: 'select', label: 'רשימה נפתחת', icon: <ViewList /> },
  { type: 'checkbox', label: 'תיבת סימון', icon: <CheckBox /> },
  { type: 'radio', label: 'כפתורי רדיו', icon: <RadioButtonChecked /> },
  { type: 'date', label: 'תאריך', icon: <DateRange /> },
  { type: 'phone', label: 'טלפון', icon: <Phone /> },
  { type: 'file', label: 'קובץ', icon: <Description /> },
]

export const FormBuilder: React.FC<FormBuilderProps> = ({
  fields = [],
  onChange,
  onSave,
  readOnly = false,
}) => {
  const { t } = useTranslation()
  const [selectedField, setSelectedField] = useState<FormField | null>(null)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [formData, setFormData] = useState<Record<string, any>>({})

  const addField = (type: FormField['type']) => {
    const newField: FormField = {
      id: `field_${Date.now()}`,
      type,
      label: `שדה חדש`,
      required: false,
      order: fields.length,
    }

    if (type === 'select' || type === 'radio') {
      newField.options = ['אפשרות 1', 'אפשרות 2']
    }

    const updatedFields = [...fields, newField]
    onChange?.(updatedFields)
  }

  const updateField = (fieldId: string, updates: Partial<FormField>) => {
    const updatedFields = fields.map(field =>
      field.id === fieldId ? { ...field, ...updates } : field
    )
    onChange?.(updatedFields)
  }

  const deleteField = (fieldId: string) => {
    const updatedFields = fields.filter(field => field.id !== fieldId)
    onChange?.(updatedFields)
  }

  const renderFieldEditor = (field: FormField) => {
    return (
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>{t('formBuilder.editField')}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label={t('formBuilder.fieldLabel')}
                value={field.label}
                onChange={(e) => updateField(field.id, { label: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label={t('formBuilder.placeholder')}
                value={field.placeholder || ''}
                onChange={(e) => updateField(field.id, { placeholder: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={field.required || false}
                    onChange={(e) => updateField(field.id, { required: e.target.checked })}
                  />
                }
                label={t('formBuilder.required')}
              />
            </Grid>
            {(field.type === 'select' || field.type === 'radio') && (
              <Grid item xs={12}>
                <Typography variant="subtitle2" gutterBottom>
                  {t('formBuilder.options')}
                </Typography>
                {field.options?.map((option, index) => (
                  <Box key={index} sx={{ display: 'flex', gap: 1, mb: 1 }}>
                    <TextField
                      size="small"
                      value={option}
                      onChange={(e) => {
                        const newOptions = [...(field.options || [])]
                        newOptions[index] = e.target.value
                        updateField(field.id, { options: newOptions })
                      }}
                    />
                    <IconButton
                      size="small"
                      onClick={() => {
                        const newOptions = field.options?.filter((_, i) => i !== index)
                        updateField(field.id, { options: newOptions })
                      }}
                    >
                      <Delete />
                    </IconButton>
                  </Box>
                ))}
                <Button
                  startIcon={<Add />}
                  onClick={() => {
                    const newOptions = [...(field.options || []), `אפשרות ${(field.options?.length || 0) + 1}`]
                    updateField(field.id, { options: newOptions })
                  }}
                >
                  {t('formBuilder.addOption')}
                </Button>
              </Grid>
            )}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>
            {t('common.close')}
          </Button>
        </DialogActions>
      </Dialog>
    )
  }

  const renderFieldPreview = (field: FormField) => {
      const handleFieldChange = (value: string | number | boolean | File) => {
    setFormData(prev => ({ ...prev, [field.id]: value }))
  }

    switch (field.type) {
      case 'text':
        return (
          <TextField
            fullWidth
            label={field.label}
            placeholder={field.placeholder}
            required={field.required}
            value={formData[field.id] || ''}
            onChange={(e) => handleFieldChange(e.target.value)}
          />
        )

      case 'email':
        return (
          <TextField
            fullWidth
            type="email"
            label={field.label}
            placeholder={field.placeholder}
            required={field.required}
            value={formData[field.id] || ''}
            onChange={(e) => handleFieldChange(e.target.value)}
          />
        )

      case 'number':
        return (
          <TextField
            fullWidth
            type="number"
            label={field.label}
            placeholder={field.placeholder}
            required={field.required}
            value={formData[field.id] || ''}
            onChange={(e) => handleFieldChange(e.target.value)}
          />
        )

      case 'textarea':
        return (
          <TextField
            fullWidth
            multiline
            rows={4}
            label={field.label}
            placeholder={field.placeholder}
            required={field.required}
            value={formData[field.id] || ''}
            onChange={(e) => handleFieldChange(e.target.value)}
          />
        )

      case 'select':
        return (
          <FormControl fullWidth required={field.required}>
            <InputLabel>{field.label}</InputLabel>
            <Select
              value={formData[field.id] || ''}
              onChange={(e) => handleFieldChange(e.target.value)}
              label={field.label}
            >
              {field.options?.map((option, index) => (
                <MenuItem key={index} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )

      case 'checkbox':
        return (
          <FormControlLabel
            control={
              <Switch
                checked={formData[field.id] || false}
                onChange={(e) => handleFieldChange(e.target.checked)}
              />
            }
            label={field.label}
          />
        )

      case 'radio':
        return (
          <FormControl component="fieldset" required={field.required}>
            <Typography variant="subtitle2" gutterBottom>
              {field.label}
            </Typography>
            {field.options?.map((option, index) => (
              <FormControlLabel
                key={index}
                control={
                  <Switch
                    checked={formData[field.id] === option}
                    onChange={() => handleFieldChange(option)}
                  />
                }
                label={option}
              />
            ))}
          </FormControl>
        )

      case 'date':
        return (
          <TextField
            fullWidth
            type="date"
            label={field.label}
            required={field.required}
            value={formData[field.id] || ''}
            onChange={(e) => handleFieldChange(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
        )

      case 'phone':
        return (
          <TextField
            fullWidth
            type="tel"
            label={field.label}
            placeholder={field.placeholder}
            required={field.required}
            value={formData[field.id] || ''}
            onChange={(e) => handleFieldChange(e.target.value)}
          />
        )

      case 'file':
        return (
          <Button
            variant="outlined"
            fullWidth
            sx={{ textAlign: 'left' }}
          >
            {field.label}
            <input
              type="file"
              hidden
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) handleFieldChange(file)
              }}
            />
          </Button>
        )

      default:
        return <Typography color="error">שדה לא נתמך</Typography>
    }
  }

  return (
    <Box>
      {!readOnly && (
        <Paper sx={{ p: 2, mb: 2 }}>
          <Typography variant="h6" gutterBottom>
            {t('formBuilder.addFields')}
          </Typography>
          <Grid container spacing={1}>
            {fieldTypes.map((fieldType) => (
              <Grid item key={fieldType.type}>
                <Button
                  variant="outlined"
                  startIcon={fieldType.icon}
                  onClick={() => addField(fieldType.type as FormField['type'])}
                  size="small"
                >
                  {fieldType.label}
                </Button>
              </Grid>
            ))}
          </Grid>
        </Paper>
      )}

      <Paper sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>
          {t('formBuilder.formPreview')}
        </Typography>
        
        {fields.length === 0 ? (
          <Typography color="textSecondary" align="center" sx={{ py: 4 }}>
            {t('formBuilder.noFields')}
          </Typography>
        ) : (
          <Box>
            {fields.map((field) => (
              <Card key={field.id} sx={{ mb: 2 }}>
                <CardContent>
                  {!readOnly && (
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Chip
                        icon={<DragIndicator />}
                        label={field.type}
                        size="small"
                        variant="outlined"
                      />
                      <Box>
                        <IconButton
                          size="small"
                          onClick={() => {
                            setSelectedField(field)
                            setEditDialogOpen(true)
                          }}
                        >
                          <Edit />
                        </IconButton>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => deleteField(field.id)}
                        >
                          <Delete />
                        </IconButton>
                      </Box>
                    </Box>
                  )}
                  {renderFieldPreview(field)}
                </CardContent>
              </Card>
            ))}
            
            {!readOnly && (
              <Box sx={{ mt: 2 }}>
                <Button
                  variant="contained"
                  onClick={() => onSave?.(formData)}
                  disabled={fields.length === 0}
                >
                  {t('formBuilder.saveForm')}
                </Button>
              </Box>
            )}
          </Box>
        )}
      </Paper>

      {selectedField && renderFieldEditor(selectedField)}
    </Box>
  )
}

export default FormBuilder

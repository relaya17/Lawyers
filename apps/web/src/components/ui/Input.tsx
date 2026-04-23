import React, { useState } from 'react'
import {
  TextField,
  TextFieldProps,
  InputAdornment,
  IconButton,

  Box,
} from '@mui/material'
import {
  Visibility,
  VisibilityOff,
  Clear,
  Search,
  Email,
  Phone,
  Person,
  Lock,
} from '@mui/icons-material'
import { styled } from '@mui/material/styles'

// Extended props for our custom input
interface CustomInputProps extends Omit<TextFieldProps, 'variant'> {
  variant?: 'outlined' | 'filled' | 'standard' | 'floating'
  clearable?: boolean
  showPasswordToggle?: boolean
  autoIcon?: boolean
  maxLength?: number
  characterCount?: boolean
  validation?: {
    required?: boolean
    pattern?: RegExp
    min?: number
    max?: number
    message?: string
  }
  onValidation?: (isValid: boolean, message?: string) => void
}

// Styled input with enhanced features
const StyledTextField = styled(TextField, {
  shouldForwardProp: (prop) => !['floating'].includes(prop as string),
})<{ floating?: boolean }>(({ theme, floating }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: theme.spacing(1),
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    
    '&:hover': {
      '& .MuiOutlinedInput-notchedOutline': {
        borderColor: theme.palette.primary.main,
        borderWidth: 2,
      },
    },
    
    '&.Mui-focused': {
      '& .MuiOutlinedInput-notchedOutline': {
        borderColor: theme.palette.primary.main,
        borderWidth: 2,
        boxShadow: `0 0 0 3px ${theme.palette.primary.main}20`,
      },
    },
    
    '&.Mui-error': {
      '& .MuiOutlinedInput-notchedOutline': {
        borderColor: theme.palette.error.main,
      },
    },
  },
  
  // Floating label variant
  ...(floating && {
    '& .MuiInputLabel-root': {
      transform: 'translate(14px, -9px) scale(0.75)',
      backgroundColor: theme.palette.background.paper,
      padding: '0 8px',
    },
    
    '& .MuiInputLabel-shrink': {
      transform: 'translate(14px, -9px) scale(0.75)',
    },
  }),
  
  // RTL support
  ...(theme.direction === 'rtl' && {
    '& .MuiInputAdornment-positionStart': {
      marginLeft: theme.spacing(1),
      marginRight: 0,
    },
    '& .MuiInputAdornment-positionEnd': {
      marginRight: theme.spacing(1),
      marginLeft: 0,
    },
  }),
}))

// Get appropriate icon based on input type/name
const getAutoIcon = (type?: string, name?: string): React.ReactNode => {
  if (type === 'email' || name?.includes('email')) return <Email />
  if (type === 'tel' || name?.includes('phone')) return <Phone />
  if (type === 'search' || name?.includes('search')) return <Search />
  if (name?.includes('name') || name?.includes('user')) return <Person />
  if (type === 'password') return <Lock />
  return null
}

// Validation function
const validateInput = (
  value: string,
  validation?: CustomInputProps['validation']
): { isValid: boolean; message?: string } => {
  if (!validation) return { isValid: true }
  
  const { required, pattern, min, max, message } = validation
  
  if (required && !value.trim()) {
    return { isValid: false, message: message || 'שדה זה הוא חובה' }
  }
  
  if (pattern && value && !pattern.test(value)) {
    return { isValid: false, message: message || 'פורמט לא תקין' }
  }
  
  if (min && value && value.length < min) {
    return { isValid: false, message: message || `נדרשים לפחות ${min} תווים` }
  }
  
  if (max && value && value.length > max) {
    return { isValid: false, message: message || `מותר עד ${max} תווים` }
  }
  
  return { isValid: true }
}

export const Input: React.FC<CustomInputProps> = ({
  type = 'text',
  variant = 'outlined',
  clearable = false,
  showPasswordToggle = false,
  autoIcon = false,
  maxLength,
  characterCount = false,
  validation,
  onValidation,
  value,
  onChange,
  error,
  helperText,
  InputProps,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false)
  const [internalError, setInternalError] = useState<string>()
  
  const isPasswordType = type === 'password' || showPasswordToggle
  const actualType = isPasswordType && showPassword ? 'text' : type
  const shouldShowError = error || !!internalError
  const errorMessage = (error && helperText) || internalError
  
  // Handle value change with validation
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value
    
    // Apply max length
    if (maxLength && newValue.length > maxLength) {
      return
    }
    
    // Validate input
    if (validation) {
      const validationResult = validateInput(newValue, validation)
      setInternalError(validationResult.isValid ? undefined : validationResult.message)
      onValidation?.(validationResult.isValid, validationResult.message)
    }
    
    onChange?.(event)
  }
  
  // Clear input
  const handleClear = () => {
    const event = {
      target: { value: '' },
    } as React.ChangeEvent<HTMLInputElement>
    onChange?.(event)
  }
  
  // Toggle password visibility
  const handleTogglePassword = () => {
    setShowPassword(!showPassword)
  }
  
  // Build start adornment
  const startAdornment = autoIcon ? (
    <InputAdornment position="start">
      {getAutoIcon(type, props.name)}
    </InputAdornment>
  ) : InputProps?.startAdornment
  
  // Build end adornment
  let endAdornment = InputProps?.endAdornment
  
  if (clearable && value) {
    endAdornment = (
      <InputAdornment position="end">
        <IconButton onClick={handleClear} edge="end" size="small">
          <Clear />
        </IconButton>
        {endAdornment}
      </InputAdornment>
    )
  }
  
  if (isPasswordType) {
    endAdornment = (
      <InputAdornment position="end">
        <IconButton onClick={handleTogglePassword} edge="end">
          {showPassword ? <VisibilityOff /> : <Visibility />}
        </IconButton>
        {endAdornment}
      </InputAdornment>
    )
  }
  
  const characterCountText = characterCount && maxLength ? (
    <Box component="span" sx={{ fontSize: '0.75rem', color: 'text.secondary', float: 'right' }}>
      {String(value || '').length}/{maxLength}
    </Box>
  ) : null
  
  return (
    <StyledTextField
      {...props}
      type={actualType}
      variant={variant === 'floating' ? 'outlined' : variant}
      floating={variant === 'floating'}
      value={value}
      onChange={handleChange}
      error={shouldShowError}
      helperText={
        <Box>
          {errorMessage}
          {characterCountText}
        </Box>
      }
      InputProps={{
        ...InputProps,
        startAdornment,
        endAdornment,
      }}
      fullWidth
      // Ensure id and name are passed through for form autofill
      id={props.id || props.name}
      name={props.name || props.id}
    />
  )
}

// Predefined input variants for common use cases
export const EmailInput: React.FC<Omit<CustomInputProps, 'type'>> = (props) => (
  <Input
    type="email"
    autoIcon
    id={props.id || 'email'}
    name={props.name || 'email'}
    validation={{
      required: true,
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      message: 'אנא הזן כתובת אימייל תקינה',
    }}
    {...props}
  />
)

export const PasswordInput: React.FC<Omit<CustomInputProps, 'type'>> = (props) => (
  <Input
    type="password"
    autoIcon
    showPasswordToggle
    id={props.id || 'password'}
    name={props.name || 'password'}
    validation={{
      required: true,
      min: 8,
      message: 'סיסמה חייבת להכיל לפחות 8 תווים',
    }}
    {...props}
  />
)

export const PhoneInput: React.FC<Omit<CustomInputProps, 'type'>> = (props) => (
  <Input
    type="tel"
    autoIcon
    id={props.id || 'phone'}
    name={props.name || 'phone'}
    validation={{
      required: true,
      pattern: /^[+]?[0-9\s\-()]{9,15}$/,
      message: 'אנא הזן מספר טלפון תקין',
    }}
    {...props}
  />
)

export const SearchInput: React.FC<Omit<CustomInputProps, 'type'>> = (props) => (
  <Input
    type="search"
    autoIcon
    clearable
    id={props.id || 'search'}
    name={props.name || 'search'}
    placeholder="חיפוש..."
    {...props}
  />
)

export const TextArea: React.FC<CustomInputProps> = (props) => (
  <Input
    multiline
    rows={4}
    characterCount
    maxLength={500}
    {...props}
  />
)

export default Input

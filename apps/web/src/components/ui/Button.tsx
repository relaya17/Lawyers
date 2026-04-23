import React from 'react'
import { Button as MuiButton, ButtonProps, CircularProgress } from '@mui/material'
import { styled } from '@mui/material/styles'

// Extended props for our custom button
interface CustomButtonProps extends ButtonProps {
  loading?: boolean
  loadingText?: string
  icon?: React.ReactNode
  gradient?: boolean
  glow?: boolean
  pulse?: boolean
}

// Styled button with enhanced features
const StyledButton = styled(MuiButton, {
  shouldForwardProp: (prop) => !['gradient', 'glow', 'pulse'].includes(prop as string),
})<CustomButtonProps>(({ theme, gradient, glow, pulse }) => ({
  position: 'relative',
  borderRadius: theme.spacing(1),
  textTransform: 'none',
  fontWeight: 600,
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  
  // Gradient effect
  ...(gradient && {
    background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
    color: theme.palette.primary.contrastText,
    '&:hover': {
      background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.secondary.dark} 100%)`,
      transform: 'translateY(-2px)',
      boxShadow: theme.shadows[8],
    },
  }),
  
  // Glow effect
  ...(glow && {
    boxShadow: `0 0 20px ${theme.palette.primary.main}40`,
    '&:hover': {
      boxShadow: `0 0 30px ${theme.palette.primary.main}60`,
    },
  }),
  
  // Pulse animation
  ...(pulse && {
    '&:before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      borderRadius: 'inherit',
      background: 'inherit',
      opacity: 0.7,
      animation: 'pulse 2s infinite',
    },
  }),
  
  // Loading state
  '&.loading': {
    pointerEvents: 'none',
  },
  
  // Right-to-left support
  ...(theme.direction === 'rtl' && {
    '& .MuiButton-startIcon': {
      marginLeft: theme.spacing(1),
      marginRight: 0,
    },
    '& .MuiButton-endIcon': {
      marginRight: theme.spacing(1),
      marginLeft: 0,
    },
  }),
  
  // Animation keyframes
  '@keyframes pulse': {
    '0%': {
      transform: 'scale(1)',
      opacity: 0.7,
    },
    '50%': {
      transform: 'scale(1.05)',
      opacity: 0.4,
    },
    '100%': {
      transform: 'scale(1)',
      opacity: 0.7,
    },
  },
}))

// Loading spinner component
const LoadingSpinner = styled(CircularProgress)(({ theme }) => ({
  color: 'inherit',
  marginRight: theme.spacing(1),
  ...(theme.direction === 'rtl' && {
    marginRight: 0,
    marginLeft: theme.spacing(1),
  }),
}))

export const Button: React.FC<CustomButtonProps> = ({
  children,
  loading = false,
  loadingText,
  icon,
  disabled,
  startIcon,
  gradient = false,
  glow = false,
  pulse = false,
  ...props
}) => {
  const isDisabled = disabled || loading

  return (
    <StyledButton
      {...props}
      disabled={isDisabled}
      gradient={gradient}
      glow={glow}
      pulse={pulse}
      className={`${props.className || ''} ${loading ? 'loading' : ''}`}
      startIcon={loading ? <LoadingSpinner size={16} /> : icon || startIcon}
    >
      {loading ? (loadingText || 'טוען...') : children}
    </StyledButton>
  )
}

// Predefined button variants for common use cases
export const PrimaryButton: React.FC<CustomButtonProps> = (props) => (
  <Button variant="contained" color="primary" {...props} />
)

export const SecondaryButton: React.FC<CustomButtonProps> = (props) => (
  <Button variant="outlined" color="primary" {...props} />
)

export const GradientButton: React.FC<CustomButtonProps> = (props) => (
  <Button variant="contained" gradient glow {...props} />
)

export const PulseButton: React.FC<CustomButtonProps> = (props) => (
  <Button variant="contained" pulse {...props} />
)

export const LoadingButton: React.FC<CustomButtonProps> = (props) => (
  <Button loading {...props} />
)

export default Button

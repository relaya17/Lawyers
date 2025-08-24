import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,

  Avatar,
  LinearProgress,

  IconButton,
  Tooltip,
  Badge,
  Skeleton,
  Alert,
  Snackbar,
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,

  CheckCircle,
  Warning,
  Info,
  Error,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  SwipeableDrawer, 
  
  useTheme,
  useMediaQuery
} from '@mui/material'
import { 
  Menu as MenuIcon, 
  Close as CloseIcon,
  SwipeLeft as SwipeLeftIcon,
  SwipeRight as SwipeRightIcon,
  TouchApp as TouchAppIcon
} from '@mui/icons-material'

// Animated Card Component
interface AnimatedCardProps {
  title: string;
  subtitle?: string;
  content: React.ReactNode;
  actions?: React.ReactNode;
  variant?: 'elevation' | 'outlined';
  elevation?: number;
  onClick?: () => void;
  className?: string;
  children?: React.ReactNode;
}

export const AnimatedCard: React.FC<AnimatedCardProps> = ({
  title,
  subtitle,
  content,
  actions,
  variant = 'elevation',
  elevation = 2,
  onClick,
  className,
  children,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      whileHover={{ 
        scale: onClick ? 1.02 : 1,
        y: onClick ? -4 : 0,
        transition: { duration: 0.2 }
      }}
      whileTap={{ scale: onClick ? 0.98 : 1 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card
        variant={variant}
        elevation={isHovered ? elevation + 2 : elevation}
        onClick={onClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={className}
        sx={{
          cursor: onClick ? 'pointer' : 'default',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: onClick ? 'translateY(-4px)' : 'none',
          },
        }}
      >
        <CardContent>
          <Typography variant="h6" gutterBottom>
            {title}
          </Typography>
          {subtitle && (
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {subtitle}
            </Typography>
          )}
          {content}
          {children}
        </CardContent>
        {actions && (
          <Box sx={{ p: 2, pt: 0 }}>
            {actions}
          </Box>
        )}
      </Card>
    </motion.div>
  );
};

// Progress Card Component
interface ProgressCardProps {
  title: string;
  progress: number;
  target?: number;
  unit?: string;
  trend?: 'up' | 'down' | 'stable';
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  showPercentage?: boolean;
}

export const ProgressCard: React.FC<ProgressCardProps> = ({
  title,
  progress,
  target,
  unit = '',
  trend,
  color = 'primary',
  showPercentage = true,
}) => {
  const getTrendIcon = () => {
    switch (trend) {
      case 'up':
        return <TrendingUp color="success" />;
      case 'down':
        return <TrendingDown color="error" />;
      default:
        return null;
    }
  };

  const getProgressColor = () => {
    if (progress >= 80) return 'success';
    if (progress >= 60) return 'warning';
    return 'error';
  };

  return (
    <AnimatedCard
      title={title}
      content={
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Typography variant="h4" component="span" sx={{ mr: 1 }}>
              {progress}
            </Typography>
            {unit && (
              <Typography variant="body2" color="text.secondary">
                {unit}
              </Typography>
            )}
            {getTrendIcon()}
          </Box>
          
          <LinearProgress
            variant="determinate"
            value={progress}
            color={getProgressColor() as any}
            sx={{ height: 8, borderRadius: 4 }}
          />
          
          {showPercentage && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              {progress}% complete
            </Typography>
          )}
          
          {target && (
            <Typography variant="caption" color="text.secondary">
              Target: {target}{unit}
            </Typography>
          )}
        </Box>
      }
    />
  );
};

// Interactive List Item Component
interface InteractiveListItemProps {
  primary: string;
  secondary?: string;
  avatar?: string;
  icon?: React.ReactNode;
  actions?: React.ReactNode;
  onClick?: () => void;
  selected?: boolean;
  disabled?: boolean;
  badge?: number | string;
}

export const InteractiveListItem: React.FC<InteractiveListItemProps> = ({
  primary,
  secondary,
  avatar,
  icon,
  actions,
  onClick,
  selected = false,
  disabled = false,
  badge,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      whileHover={{ backgroundColor: 'rgba(0, 0, 0, 0.04)' }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.2 }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          p: 2,
          cursor: onClick && !disabled ? 'pointer' : 'default',
          backgroundColor: selected ? 'action.selected' : 'transparent',
          borderRadius: 1,
          transition: 'all 0.2s ease',
          opacity: disabled ? 0.6 : 1,
        }}
        onClick={onClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {badge && (
          <Badge badgeContent={badge} color="primary" sx={{ mr: 2 }}>
            {avatar ? (
              <Avatar src={avatar} />
            ) : icon ? (
              <Avatar>{icon}</Avatar>
            ) : (
              <Avatar>{primary[0]}</Avatar>
            )}
          </Badge>
        )}
        
        {!badge && (avatar ? (
          <Avatar src={avatar} sx={{ mr: 2 }} />
        ) : icon ? (
          <Avatar sx={{ mr: 2 }}>{icon}</Avatar>
        ) : (
          <Avatar sx={{ mr: 2 }}>{primary[0]}</Avatar>
        ))}
        
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="body1" component="div">
            {primary}
          </Typography>
          {secondary && (
            <Typography variant="body2" color="text.secondary">
              {secondary}
            </Typography>
          )}
        </Box>
        
        <AnimatePresence>
          {isHovered && actions && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
            >
              {actions}
            </motion.div>
          )}
        </AnimatePresence>
      </Box>
    </motion.div>
  );
};

// Loading Skeleton Component
interface LoadingSkeletonProps {
  variant?: 'card' | 'list' | 'table' | 'custom';
  rows?: number;
  height?: number;
  width?: number | string;
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({
  variant = 'card',
  rows = 3,
  height = 20,
  width = '100%',
}) => {
  const renderSkeleton = () => {
    switch (variant) {
      case 'card':
        return (
          <Card>
            <CardContent>
              <Skeleton variant="text" width="60%" height={32} />
              <Skeleton variant="text" width="40%" height={24} />
              <Skeleton variant="rectangular" width="100%" height={120} sx={{ mt: 2 }} />
            </CardContent>
          </Card>
        );
      
      case 'list':
        return (
          <Box>
            {Array.from({ length: rows }).map((_, index) => (
              <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Skeleton variant="circular" width={40} height={40} sx={{ mr: 2 }} />
                <Box sx={{ flexGrow: 1 }}>
                  <Skeleton variant="text" width="70%" height={24} />
                  <Skeleton variant="text" width="50%" height={16} />
                </Box>
              </Box>
            ))}
          </Box>
        );
      
      case 'table':
        return (
          <Box>
            <Skeleton variant="rectangular" width="100%" height={56} sx={{ mb: 1 }} />
            {Array.from({ length: rows }).map((_, index) => (
              <Skeleton key={index} variant="rectangular" width="100%" height={48} sx={{ mb: 1 }} />
            ))}
          </Box>
        );
      
      default:
        return (
          <Skeleton
            variant="rectangular"
            width={width}
            height={height}
            sx={{ borderRadius: 1 }}
          />
        );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {renderSkeleton()}
    </motion.div>
  );
};

// Notification System Component
interface NotificationProps {
  message: string;
  type?: 'success' | 'warning' | 'error' | 'info';
  duration?: number;
  onClose?: () => void;
  action?: React.ReactNode;
}

export const Notification: React.FC<NotificationProps> = ({
  message,
  type = 'info',
  duration = 4000,
  onClose,
  action,
}) => {
  const [open, setOpen] = useState(true);

  const handleClose = () => {
    setOpen(false);
    onClose?.();
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle />;
      case 'warning':
        return <Warning />;
      case 'error':
        return <Error />;
      default:
        return <Info />;
    }
  };

  return (
    <Snackbar
      open={open}
      autoHideDuration={duration}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
    >
      <Alert
        onClose={handleClose}
        severity={type}
        icon={getIcon()}
        action={action}
        sx={{ width: '100%' }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
};

// Floating Action Button with Animation
interface FloatingActionButtonProps {
  icon: React.ReactNode;
  onClick: () => void;
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  size?: 'small' | 'medium' | 'large';
  tooltip?: string;
  disabled?: boolean;
}

export const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
  icon,
  onClick,
  color = 'primary',
  size = 'medium',
  tooltip,
  disabled = false,
}) => {
  return (
    <motion.div
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3, type: 'spring' }}
    >
      <Tooltip title={tooltip || ''} placement="left">
        <IconButton
          color={color}
          size={size}
          onClick={onClick}
          disabled={disabled}
          sx={{
            position: 'fixed',
            bottom: 16,
            right: 16,
            zIndex: 1000,
            boxShadow: 3,
            '&:hover': {
              boxShadow: 6,
            },
          }}
        >
          {icon}
        </IconButton>
      </Tooltip>
    </motion.div>
  );
};

// iOS Touch Gesture Handler
export const TouchGestureHandler: React.FC<{
  children: React.ReactNode
  onSwipeLeft?: () => void
  onSwipeRight?: () => void
  onSwipeUp?: () => void
  onSwipeDown?: () => void
  threshold?: number
}> = ({ 
  children, 
  onSwipeLeft, 
  onSwipeRight, 
  onSwipeUp, 
  onSwipeDown, 
  threshold = 50 
}) => {
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null)
  const [touchEnd, setTouchEnd] = useState<{ x: number; y: number } | null>(null)

  const minSwipeDistance = threshold

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null)
    setTouchStart({
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY,
    })
  }

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd({
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY,
    })
  }

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return
    
    const distanceX = touchStart.x - touchEnd.x
    const distanceY = touchStart.y - touchEnd.y
    const isHorizontalSwipe = Math.abs(distanceX) > Math.abs(distanceY)
    const isVerticalSwipe = Math.abs(distanceY) > Math.abs(distanceX)

    if (isHorizontalSwipe && Math.abs(distanceX) > minSwipeDistance) {
      if (distanceX > 0) {
        onSwipeLeft?.()
      } else {
        onSwipeRight?.()
      }
    }

    if (isVerticalSwipe && Math.abs(distanceY) > minSwipeDistance) {
      if (distanceY > 0) {
        onSwipeUp?.()
      } else {
        onSwipeDown?.()
      }
    }
  }

  return (
    <Box
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      sx={{ touchAction: 'pan-y' }}
    >
      {children}
    </Box>
  )
}

// iOS Safe Area Component
export const SafeAreaContainer: React.FC<{
  children: React.ReactNode
  top?: boolean
  bottom?: boolean
  left?: boolean
  right?: boolean
}> = ({ children, top = true, bottom = true, left = true, right = true }) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  if (!isMobile) {
    return <>{children}</>
  }

  return (
    <Box
      sx={{
        paddingTop: top ? 'env(safe-area-inset-top)' : 0,
        paddingBottom: bottom ? 'env(safe-area-inset-bottom)' : 0,
        paddingLeft: left ? 'env(safe-area-inset-left)' : 0,
        paddingRight: right ? 'env(safe-area-inset-right)' : 0,
      }}
    >
      {children}
    </Box>
  )
}

// Mobile Navigation Drawer with iOS gestures
export const MobileNavigationDrawer: React.FC<{
  open: boolean
  onClose: () => void
  children: React.ReactNode
}> = ({ open, onClose, children }) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  if (!isMobile) {
    return null
  }

  return (
    <SwipeableDrawer
      anchor="left"
      open={open}
      onClose={onClose}
      onOpen={() => {}}
      disableSwipeToOpen={false}
      swipeAreaWidth={20}
      minFlingVelocity={450}
      hysteresis={0.52}
      ModalProps={{
        keepMounted: true, // Better mobile performance
      }}
      PaperProps={{
        sx: {
          width: 280,
          paddingTop: 'env(safe-area-inset-top)',
          paddingBottom: 'env(safe-area-inset-bottom)',
        }
      }}
    >
      {children}
    </SwipeableDrawer>
  )
}

// iOS-style Bottom Sheet
export const BottomSheet: React.FC<{
  open: boolean
  onClose: () => void
  children: React.ReactNode
  title?: string
}> = ({ open, onClose, children, title }) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  if (!isMobile) {
    return null
  }

  return (
    <SwipeableDrawer
      anchor="bottom"
      open={open}
      onClose={onClose}
      onOpen={() => {}}
      disableSwipeToOpen={false}
      swipeAreaWidth={20}
      minFlingVelocity={450}
      hysteresis={0.52}
      ModalProps={{
        keepMounted: true,
      }}
      PaperProps={{
        sx: {
          borderTopLeftRadius: 16,
          borderTopRightRadius: 16,
          paddingBottom: 'env(safe-area-inset-bottom)',
          maxHeight: '80vh',
        }
      }}
    >
      <Box sx={{ p: 2 }}>
        {/* Handle bar */}
        <Box
          sx={{
            width: 40,
            height: 4,
            backgroundColor: 'grey.300',
            borderRadius: 2,
            mx: 'auto',
            mb: 2,
          }}
        />
        
        {title && (
          <Typography variant="h6" sx={{ mb: 2, textAlign: 'center' }}>
            {title}
          </Typography>
        )}
        
        {children}
      </Box>
    </SwipeableDrawer>
  )
}

// Touch-friendly Button
export const TouchButton: React.FC<{
  children: React.ReactNode
  onClick: () => void
  variant?: 'contained' | 'outlined' | 'text'
  size?: 'small' | 'medium' | 'large'
  disabled?: boolean
  fullWidth?: boolean
}> = ({ 
  children, 
  onClick, 
  variant = 'contained', 
  size = 'medium',
  disabled = false,
  fullWidth = false 
}) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  return (
    <Box
      component="button"
      onClick={onClick}
      disabled={disabled}
      sx={{
        minHeight: isMobile ? 48 : 44,
        minWidth: isMobile ? 48 : 44,
        padding: isMobile ? '12px 24px' : '8px 16px',
        borderRadius: 2,
        fontSize: isMobile ? '1rem' : '0.875rem',
        fontWeight: 500,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.6 : 1,
        transition: 'all 0.2s ease',
        width: fullWidth ? '100%' : 'auto',
        backgroundColor: variant === 'contained' ? theme.palette.primary.main : 'transparent',
        color: variant === 'contained' ? theme.palette.primary.contrastText : theme.palette.primary.main,
        border: variant === 'outlined' ? `2px solid ${theme.palette.primary.main}` : 'none',
        '&:hover': {
          backgroundColor: variant === 'contained' ? theme.palette.primary.dark : 'rgba(25, 118, 210, 0.04)',
          transform: disabled ? 'none' : 'translateY(-1px)',
        },
        '&:active': {
          transform: disabled ? 'none' : 'translateY(0)',
        },
        // iOS specific
        WebkitTapHighlightColor: 'transparent',
        WebkitTouchCallout: 'none',
        WebkitUserSelect: 'none',
      }}
    >
      {children}
    </Box>
  )
}

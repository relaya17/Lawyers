import React from 'react'
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Badge,
  useTheme,
  useMediaQuery,
} from '@mui/material'
import {
  Menu as MenuIcon,
  Notifications,
  AccountCircle,
  Settings,
  Logout,
} from '@mui/icons-material'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import type { RootState } from '@/store'
import { toggleMobileMenu } from '@shared/store/slices/uiSlice'
import { markNotificationAsRead, selectNotifications } from '@shared/store/advancedSlice'
import { useSessionAuth } from '@/features/auth/providers/SessionAuthProvider'
import { LanguageSwitcher } from './LanguageSwitcher'
import RealtimeNotifications from './RealtimeNotifications'

export const AppHeader: React.FC = () => {
  const navigate = useNavigate()
  const { signOut } = useSessionAuth()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  
  const dispatch = useDispatch()
  const { user } = useSelector((state: RootState) => state.auth)
  const { unreadCount } = useSelector((state: RootState) => state.advanced)
  const notifications = useSelector((state: RootState) => selectNotifications(state))
  
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const [notificationAnchorEl, setNotificationAnchorEl] = React.useState<null | HTMLElement>(null)

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleNotificationMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setNotificationAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
    setNotificationAnchorEl(null)
  }

  const handleLogout = async () => {
    try {
      await signOut()
    } finally {
      navigate('/login')
      handleMenuClose()
    }
  }

  const handleSettings = () => {
    navigate('/settings')
    handleMenuClose()
  }

  const handleProfile = () => {
    navigate('/profile')
    handleMenuClose()
  }

  return (
    <AppBar position="sticky" elevation={1} sx={{ backgroundColor: 'background.paper' }}>
      <Toolbar>
        {/* Mobile Menu Button */}
        {isMobile && (
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={() => dispatch(toggleMobileMenu())}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
        )}

        {/* Logo */}
        <Typography
          variant="h6"
          component="div"
          sx={{
            flexGrow: 1,
            color: 'primary.main',
            fontWeight: 'bold',
            cursor: 'pointer',
          }}
          onClick={() => navigate('/')}
        >
          ContractLab Pro
        </Typography>

        {/* Desktop Navigation */}
        {!isMobile && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {/* Language Switcher */}
            <LanguageSwitcher />
            
            {/* Notifications */}
            <IconButton
              color="inherit"
              aria-label="הצג התראות"
              aria-haspopup="true"
              onClick={handleNotificationMenuOpen}
              sx={{ color: 'text.primary' }}
            >
              <Badge badgeContent={unreadCount} color="error">
                <Notifications />
              </Badge>
            </IconButton>

            {/* Real-time Notifications */}
            <RealtimeNotifications />

            {/* User Menu */}
            <IconButton
              edge="end"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleProfileMenuOpen}
              color="inherit"
              sx={{ color: 'text.primary' }}
            >
              {user?.avatar ? (
                <Avatar src={user.avatar} alt={`${user.firstName} ${user.lastName}`} sx={{ width: 32, height: 32 }} />
              ) : (
                <AccountCircle />
              )}
            </IconButton>
          </Box>
        )}

        {/* Mobile Actions */}
        {isMobile && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton
              color="inherit"
              aria-label="הצג התראות"
              aria-haspopup="true"
              onClick={handleNotificationMenuOpen}
              sx={{ color: 'text.primary' }}
            >
              <Badge badgeContent={unreadCount} color="error">
                <Notifications />
              </Badge>
            </IconButton>
            
            <IconButton
              edge="end"
              aria-label="חשבון משתמש"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleProfileMenuOpen}
              color="inherit"
              sx={{ color: 'text.primary' }}
            >
              <AccountCircle />
            </IconButton>
          </Box>
        )}

        {/* Profile Menu */}
        <Menu
          id="menu-appbar"
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          keepMounted
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={handleProfile}>
            <AccountCircle sx={{ mr: 1 }} />
            פרופיל
          </MenuItem>
          <MenuItem onClick={handleSettings}>
            <Settings sx={{ mr: 1 }} />
            הגדרות
          </MenuItem>
          <MenuItem onClick={handleLogout}>
            <Logout sx={{ mr: 1 }} />
            התנתק
          </MenuItem>
        </Menu>

        {/* Notification Menu */}
        <Menu
          anchorEl={notificationAnchorEl}
          open={Boolean(notificationAnchorEl)}
          onClose={handleMenuClose}
          PaperProps={{
            sx: { width: 360, maxHeight: 420 },
          }}
        >
          <MenuItem disabled>
            <Typography variant="subtitle2">התראות</Typography>
          </MenuItem>
          {notifications.length === 0 ? (
            <MenuItem disabled onClick={(e) => e.stopPropagation()}>
              <Typography variant="body2" color="text.secondary">
                אין התראות עדיין
              </Typography>
            </MenuItem>
          ) : (
            notifications.slice(0, 15).map((n) => (
              <MenuItem
                key={n.id}
                onClick={() => dispatch(markNotificationAsRead(n.id))}
                sx={{
                  alignItems: 'flex-start',
                  whiteSpace: 'normal',
                  py: 1.5,
                  bgcolor: n.read ? undefined : 'action.hover',
                }}
              >
                <Box sx={{ width: '100%' }}>
                  <Typography variant="subtitle2" fontWeight={n.read ? 500 : 700} gutterBottom>
                    {n.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.35 }}
                  >
                    {n.message}
                  </Typography>
                  <Typography variant="caption" color="text.disabled" display="block" sx={{ mt: 0.5 }}>
                    {new Date(n.timestamp).toLocaleString('he-IL')}
                  </Typography>
                </Box>
              </MenuItem>
            ))
          )}
        </Menu>
      </Toolbar>
    </AppBar>
  )
}

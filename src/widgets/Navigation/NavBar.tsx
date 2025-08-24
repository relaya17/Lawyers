import React, { useState } from 'react'
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
  Divider,
  useTheme,
  useMediaQuery,
  Drawer,
  List,
  ListItem,
  ListItemText,
} from '@mui/material'
import {
  Menu as MenuIcon,
  AccountCircle,
  Settings,
  Logout,
  Language,
  Brightness4,
  Brightness7,
} from '@mui/icons-material'
import { useTranslation } from 'react-i18next'
import { useNavigate, useLocation } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '@shared/store'
import { logout } from '@shared/store/slices/authSlice'
import { toggleMode, setLanguage } from '@shared/store/slices/themeSlice'
import { toggleMobileMenu } from '@shared/store/slices/uiSlice'
import { changeLanguage as setI18nLanguage } from '@shared/i18n'
import RealtimeNotifications from '../RealtimeNotifications'
import { SafeAreaContainer } from '@shared/components/ui/AdvancedComponents'

  const navigationItems = [
  { path: '/', label: 'navigation.home' },
  { path: '/contracts', label: 'navigation.contracts' },
  { path: '/crm', label: 'navigation.crm' },
  { path: '/business-intelligence', label: 'navigation.businessIntelligence' },
  { path: '/version-control', label: 'navigation.versionControl' },
  { path: '/simulator', label: 'navigation.simulator' },
  { path: '/risk-analysis', label: 'navigation.riskAnalysis' },
  { path: '/regulatory-compliance', label: 'navigation.regulatoryCompliance' },
  { path: '/workflow-automation', label: 'navigation.workflowAutomation' },
  { path: '/negotiation', label: 'navigation.negotiation' },
  { path: '/marketplace', label: 'navigation.marketplace' },
  { path: '/contract-templates', label: 'navigation.contractTemplates' },
  { path: '/adaptive-learning', label: 'navigation.adaptiveLearning' },
  { path: '/flow-map', label: 'navigation.flowMap' },
  { path: '/security', label: 'navigation.security' },
  { path: '/virtual-court', label: 'navigation.virtualCourt' },
  { path: '/widgets', label: 'widgets.title' },
]

const languages = [
  { code: 'he', name: 'עברית', flag: '🇮🇱' },
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦' },
]

interface NavBarProps {
  onOpenAIAssistant?: () => void;
}

export const NavBar: React.FC<NavBarProps> = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const location = useLocation()
  const theme = useTheme()
  const dispatch = useDispatch()
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'))
  const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'))
  
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth)
  const { mode, language } = useSelector((state: RootState) => state.theme)
  const { mobileMenuOpen } = useSelector((state: RootState) => state.ui)
  
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [languageAnchorEl, setLanguageAnchorEl] = useState<null | HTMLElement>(null)

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleProfileMenuClose = () => {
    setAnchorEl(null)
  }

  const handleLanguageMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setLanguageAnchorEl(event.currentTarget)
  }

  const handleLanguageMenuClose = () => {
    setLanguageAnchorEl(null)
  }

  const handleLogout = () => {
    dispatch(logout())
    handleProfileMenuClose()
    navigate('/login')
  }

  const handleLanguageChange = async (langCode: string) => {
    await setI18nLanguage(langCode as 'he'|'en'|'ar')
    dispatch(setLanguage(langCode))
    handleLanguageMenuClose()
  }

  const handleThemeToggle = () => {
    dispatch(toggleMode())
  }

  const handleMobileMenuToggle = () => {
    dispatch(toggleMobileMenu())
  }

  const handleNavigation = (path: string) => {
    navigate(path)
    if (isMobile) {
      dispatch(toggleMobileMenu())
    }
  }

  const isActiveRoute = (path: string) => {
    return location.pathname === path
  }

  // const currentLanguage = languages.find(lang => lang.code === language)

  const navigationList = (
    <List>
      {navigationItems.map((item) => (
        <ListItem
          key={item.path}
          button
          onClick={() => handleNavigation(item.path)}
          selected={isActiveRoute(item.path)}
          sx={{
            '&.Mui-selected': {
              backgroundColor: theme.palette.primary.light,
              '&:hover': {
                backgroundColor: theme.palette.primary.light,
              },
            },
          }}
        >
          <ListItemText primary={t(item.label)} />
        </ListItem>
      ))}
    </List>
  )

  return (
    <SafeAreaContainer top={true} bottom={false} left={false} right={false}>
             <AppBar 
         position="sticky" 
         elevation={1}
         sx={{
           backgroundColor: 'primary.main',
           color: 'white',
           borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
           // iOS specific
           paddingTop: 'env(safe-area-inset-top)',
         }}
       >
                 <Toolbar 
           sx={{ 
             minHeight: { xs: 56, sm: 64 },
             px: { xs: 1, sm: 2 },
             gap: { xs: 0.5, sm: 1 }
           }}
         >
                                                            

              {/* Mobile Menu Button */}
             {isMobile && (
               <IconButton
                 color="inherit"
                 aria-label={t('navigation.menu')}
                 onClick={handleMobileMenuToggle}
                 sx={{
                   minWidth: 44,
                   minHeight: 44,
                   WebkitTapHighlightColor: 'transparent',
                 }}
               >
                 <MenuIcon />
               </IconButton>
             )}

                     {/* Desktop Navigation - Center */}
           {!isMobile && (
             <Box sx={{ 
               flexGrow: 1, 
               display: 'flex', 
               gap: { xs: 0.5, sm: 1 },
               overflow: 'hidden',
               justifyContent: 'flex-start',
               ml: 2
             }}>
               {navigationItems.slice(1, 8).map((item) => (
                 <Box
                   key={item.path}
                   component="button"
                   onClick={() => handleNavigation(item.path)}
                   onKeyDown={(e) => {
                     if (e.key === 'Enter' || e.key === ' ') {
                       e.preventDefault()
                       handleNavigation(item.path)
                     }
                   }}
                   aria-label={t(item.label)}
                   aria-current={isActiveRoute(item.path) ? 'page' : undefined}
                                      sx={{
                      flexShrink: 0,
                      backgroundColor: isActiveRoute(item.path) ? 'rgba(255,255,255,0.2)' : 'transparent',
                      border: 'none',
                      borderRadius: 1,
                                             px: { xs: 1.5, sm: 2, md: 2.5 },
                       py: { xs: 1, sm: 1.25, md: 1.5 },
                       fontSize: { xs: '0.8rem', sm: '0.9rem', md: '1.1rem' },
                      fontWeight: 500,
                      color: 'white',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      minHeight: 44,
                      minWidth: 44,
                      '&:hover': {
                        backgroundColor: 'rgba(255,255,255,0.2)',
                      },
                      '&:active': {
                        transform: 'scale(0.95)',
                      },
                      '&:focus': {
                        outline: '2px solid rgba(255,255,255,0.5)',
                        outlineOffset: '2px',
                      },
                      // iOS specific
                      WebkitTapHighlightColor: 'transparent',
                      WebkitTouchCallout: 'none',
                      WebkitUserSelect: 'none',
                    }}
                 >
                   {t(item.label)}
                 </Box>
               ))}
             </Box>
           )}

                     {/* Actions - Right side */}
                       <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: { xs: 0.5, sm: 1 },
              flexShrink: 0,
              ml: 'auto'
            }}>
            {/* User Menu / Auth Buttons */}
            {isAuthenticated && user ? (
              <IconButton
                color="inherit"
                onClick={handleProfileMenuOpen}
                aria-label={t('navigation.profile')}
                size={isSmallMobile ? 'small' : 'medium'}
                sx={{
                  minWidth: 44,
                  minHeight: 44,
                  WebkitTapHighlightColor: 'transparent',
                }}
              >
                {user.avatar ? (
                  <Avatar src={user.avatar} sx={{ 
                    width: { xs: 28, sm: 32 }, 
                    height: { xs: 28, sm: 32 } 
                  }} />
                ) : (
                  <AccountCircle />
                )}
              </IconButton>
                         ) : (
               <Box sx={{ 
                 display: 'flex', 
                 gap: { xs: 0.5, sm: 1 },
                 flexDirection: 'row'
               }}>
                                                                      <Box
                     component="button"
                     onClick={() => navigate('/register')}
                     onKeyDown={(e) => {
                       if (e.key === 'Enter' || e.key === ' ') {
                         e.preventDefault()
                         navigate('/register')
                       }
                     }}
                     aria-label={t('auth.register')}
                     sx={{
                       border: '1px solid rgba(255,255,255,0.5)',
                       borderRadius: 1,
                       px: { xs: 1.5, sm: 2.5, md: 3 },
                       py: { xs: 0.5, sm: 1.25, md: 1.5 },
                       fontSize: { xs: '0.8rem', sm: '1rem', md: '1.1rem' },
                       backgroundColor: 'transparent',
                       color: 'white',
                       cursor: 'pointer',
                       minHeight: { xs: 44, sm: 48, md: 52 },
                       minWidth: { xs: 80, sm: 100, md: 120 },
                       transition: 'all 0.2s ease',
                       '&:hover': {
                         borderColor: 'rgba(255,255,255,0.8)',
                         backgroundColor: 'rgba(255,255,255,0.1)',
                       },
                       '&:focus': {
                         outline: '2px solid rgba(255,255,255,0.5)',
                         outlineOffset: '2px',
                       },
                       // iOS specific
                       WebkitTapHighlightColor: 'transparent',
                       WebkitTouchCallout: 'none',
                       WebkitUserSelect: 'none',
                     }}
                   >
                     {t('auth.register')}
                   </Box>
                   <Box
                     component="button"
                     onClick={() => navigate('/login')}
                     onKeyDown={(e) => {
                       if (e.key === 'Enter' || e.key === ' ') {
                         e.preventDefault()
                         navigate('/login')
                       }
                     }}
                     aria-label={t('auth.login')}
                     sx={{
                       backgroundColor: 'rgba(255,255,255,0.2)',
                       border: 'none',
                       borderRadius: 1,
                       px: { xs: 1.5, sm: 2.5, md: 3 },
                       py: { xs: 0.5, sm: 1.25, md: 1.5 },
                       fontSize: { xs: '0.8rem', sm: '1rem', md: '1.1rem' },
                       color: 'white',
                       cursor: 'pointer',
                       minHeight: { xs: 44, sm: 48, md: 52 },
                       minWidth: { xs: 80, sm: 100, md: 120 },
                       transition: 'all 0.2s ease',
                       '&:hover': {
                         backgroundColor: 'rgba(255,255,255,0.3)',
                       },
                       '&:focus': {
                         outline: '2px solid rgba(255,255,255,0.5)',
                         outlineOffset: '2px',
                       },
                       // iOS specific
                       WebkitTapHighlightColor: 'transparent',
                       WebkitTouchCallout: 'none',
                       WebkitUserSelect: 'none',
                     }}
                   >
                     {t('auth.login')}
                   </Box>
              </Box>
            )}

                         {/* Theme Toggle */}
             <IconButton
               color="inherit"
               onClick={handleThemeToggle}
               aria-label={t('settings.theme')}
               size={isSmallMobile ? 'small' : 'medium'}
               sx={{
                 minWidth: 44,
                 minHeight: 44,
                 WebkitTapHighlightColor: 'transparent',
               }}
             >
               {mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
             </IconButton>

             {/* Real-time Notifications */}
             <RealtimeNotifications />

                           {/* Language Switcher */}
              <IconButton
                color="inherit"
                onClick={handleLanguageMenuOpen}
                aria-label={t('settings.language')}
                size={isSmallMobile ? 'small' : 'medium'}
                sx={{
                  minWidth: 44,
                  minHeight: 44,
                  WebkitTapHighlightColor: 'transparent',
                }}
              >
                <Language />
              </IconButton>
              
              {/* Logo - Only shown in mobile */}
              {isMobile && (
                <Typography
                  variant="h6"
                  component="div"
                  sx={{
                    flexShrink: 0,
                    cursor: 'pointer',
                    fontWeight: 700,
                    minWidth: 'fit-content',
                    fontSize: '1rem',
                    marginLeft: 'auto',
                    // iOS specific
                    WebkitTapHighlightColor: 'transparent',
                    WebkitTouchCallout: 'none',
                    WebkitUserSelect: 'none',
                  }}
                  onClick={() => navigate('/')}
                  role="button"
                  tabIndex={0}
                  aria-label={t('navigation.home')}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      navigate('/')
                    }
                  }}
                >
                  {t('app.title')}
                </Typography>
              )}
            </Box>

        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        anchor="left"
        open={mobileMenuOpen}
        onClose={handleMobileMenuToggle}
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
        <Box sx={{ width: 250 }}>
          <Box sx={{ p: 2 }}>
            <Typography variant="h6" component="div">
              {t('app.title')}
            </Typography>
          </Box>
          <Divider />
          {navigationList}
        </Box>
      </Drawer>

      {/* Profile Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleProfileMenuClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        PaperProps={{
          sx: {
            minWidth: 200,
            mt: 1,
          }
        }}
      >
        <MenuItem onClick={() => { handleProfileMenuClose(); navigate('/profile'); }}>
          <ListItemIcon>
            <AccountCircle fontSize="small" />
          </ListItemIcon>
          {t('navigation.profile')}
        </MenuItem>
        <MenuItem onClick={() => { handleProfileMenuClose(); navigate('/settings'); }}>
          <ListItemIcon>
            <Settings fontSize="small" />
          </ListItemIcon>
          {t('navigation.settings')}
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          {t('auth.logout')}
        </MenuItem>
      </Menu>

      {/* Language Menu */}
      <Menu
        anchorEl={languageAnchorEl}
        open={Boolean(languageAnchorEl)}
        onClose={handleLanguageMenuClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        PaperProps={{
          sx: {
            minWidth: 150,
            mt: 1,
          }
        }}
      >
        {languages.map((lang) => (
          <MenuItem
            key={lang.code}
            onClick={() => handleLanguageChange(lang.code)}
            selected={language === lang.code}
          >
            {lang.name}
          </MenuItem>
        ))}
      </Menu>
    </SafeAreaContainer>
  )
}

export default NavBar

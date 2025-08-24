import React from 'react'
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,

  useTheme,
  useMediaQuery,
} from '@mui/material'
import {
  Description,
  School,
  Assessment,
  Handshake,
  Store,
  Security,
  Timeline,
  Gavel,
  AutoAwesome,
  Edit,
} from '@mui/icons-material'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import AIAssistant from '../../widgets/AIAssistant'
import AnalyticsDashboard from '../../widgets/AnalyticsDashboard'


const features = [
  {
    icon: Description,
    title: 'contracts.title',
    description: 'contracts.description',
    color: 'primary',
    route: '/contracts',
  },
  {
    icon: Edit,
    title: 'contractEditor.title',
    description: 'contractEditor.description',
    color: 'primary',
    route: '/contract-editor',
  },
  {
    icon: Timeline,
    title: 'versionControl.title',
    description: 'versionControl.description',
    color: 'secondary',
    route: '/version-control',
  },
  {
    icon: School,
    title: 'simulator.title',
    description: 'simulator.description',
    color: 'secondary',
    route: '/simulator',
  },
  {
    icon: Assessment,
    title: 'riskAnalysis.title',
    description: 'riskAnalysis.description',
    color: 'error',
    route: '/risk-analysis',
  },
  {
    icon: Handshake,
    title: 'negotiation.title',
    description: 'negotiation.description',
    color: 'success',
    route: '/negotiation',
  },
  {
    icon: Store,
    title: 'marketplace.title',
    description: 'marketplace.description',
    color: 'warning',
    route: '/marketplace',
  },
  {
    icon: Security,
    title: 'security.title',
    description: 'security.description',
    color: 'info',
    route: '/security',
  },
  {
    icon: Gavel,
    title: 'virtualCourt.title',
    description: 'virtualCourt.description',
    color: 'error',
    route: '/virtual-court',
  },
]

export const HomePage: React.FC = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'))


  return (
         <Box sx={{ 
           minHeight: '100vh', 
           py: { xs: 2, sm: 3, md: 4 },
           display: 'flex',
           alignItems: 'center',
           justifyContent: 'center'
         }}>
       <Container maxWidth="lg" sx={{ width: '100%' }}>
         {/* Hero Section */}
                  <Card
            sx={{
              textAlign: 'center',
              mt: { xs: 2, sm: 3, md: 4 },
              mb: { xs: 3, sm: 4, md: 5 },
              py: { xs: 2, sm: 2.5, md: 3 },
              px: { xs: 2, sm: 3, md: 4 },
              background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
              borderRadius: 2,
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
              border: '1px solid rgba(255,255,255,0.2)',
              transition: 'all 0.3s ease-in-out',
              cursor: 'pointer',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 6px 25px rgba(0,0,0,0.12)',
                background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)',
              },
            }}
          >
                     <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1.5 }}>
             <AutoAwesome sx={{ 
               fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' }, 
               color: 'primary.main',
               mr: 1.5,
               filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.1))',
             }} />
             <Typography
               variant={isSmallMobile ? 'h5' : isMobile ? 'h4' : 'h3'}
               component="h1"
               sx={{
                 fontWeight: 'bold',
                 background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
                 backgroundClip: 'text',
                 WebkitBackgroundClip: 'text',
                 WebkitTextFillColor: 'transparent',
                 textShadow: '0 1px 2px rgba(0,0,0,0.1)',
               }}
             >
               {t('home.hero.title')}
             </Typography>
           </Box>
                     <Typography
             variant={isSmallMobile ? 'body1' : 'h6'}
             color="text.secondary"
             sx={{
               maxWidth: '800px',
               mx: 'auto',
               mb: 3,
               lineHeight: 1.5,
               fontWeight: 500,
             }}
           >
             {t('home.hero.subtitle')}
           </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
                         <Button
               variant="contained"
               size="medium"
               onClick={() => navigate('/contracts')}
               sx={{
                 px: 3,
                 py: 1,
                 fontSize: '1rem',
                 fontWeight: 'bold',
                 borderRadius: 2,
                 boxShadow: 2,
               }}
             >
               {t('home.hero.cta.primary')}
             </Button>
             <Button
               variant="outlined"
               size="medium"
               onClick={() => navigate('/simulator')}
               sx={{
                 px: 3,
                 py: 1,
                 fontSize: '1rem',
                 fontWeight: 'bold',
                 borderRadius: 2,
                 borderWidth: 2,
               }}
             >
               {t('home.hero.cta.secondary')}
             </Button>
                     </Box>
         </Card>

        {/* Analytics Dashboard */}
        <AnalyticsDashboard />

                 {/* Contract Management Button */}
         <Box sx={{ textAlign: 'center', mb: 4 }}>
           <Button
             variant="contained"
             size="large"
             onClick={() => navigate('/contracts')}
             sx={{
               px: 6,
               py: 2,
               fontSize: '1.2rem',
               fontWeight: 'bold',
               borderRadius: 3,
               background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
               boxShadow: '0 4px 20px rgba(25, 118, 210, 0.3)',
               '&:hover': {
                 background: 'linear-gradient(45deg, #1565c0, #1976d2)',
                 transform: 'translateY(-2px)',
                 boxShadow: '0 6px 25px rgba(25, 118, 210, 0.4)',
               },
             }}
           >
             ניהול חוזים מתקדם
           </Button>
         </Box>

        {/* Features Grid */}
        <Box sx={{ mb: { xs: 4, sm: 5, md: 6 } }}>
          <Typography
            variant={isSmallMobile ? 'h5' : 'h4'}
            component="h2"
            textAlign="center"
            gutterBottom
            sx={{
              fontWeight: 'bold',
              mb: 4,
            }}
          >
            {t('home.features.title')}
          </Typography>
          
          <Grid container spacing={{ xs: 2, sm: 3, md: 4 }}>
            {features.map((feature, index) => {
              const IconComponent = feature.icon
              return (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Card
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      transition: 'all 0.3s ease-in-out',
                      cursor: 'pointer',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: 8,
                        '& .MuiCardContent-root': {
                          backgroundColor: `${feature.color}.50`,
                        },
                      },
                      borderRadius: 3,
                      overflow: 'hidden',
                    }}
                    onClick={() => navigate(feature.route)}
                  >
                    <CardContent
                      sx={{
                        flexGrow: 1,
                        p: { xs: 2, sm: 3 },
                        textAlign: 'center',
                        transition: 'background-color 0.3s ease-in-out',
                      }}
                    >
                      <Box
                        sx={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: 60,
                          height: 60,
                          borderRadius: '50%',
                          backgroundColor: `${feature.color}.100`,
                          color: `${feature.color}.main`,
                          mb: 2,
                          transition: 'all 0.3s ease-in-out',
                          '&:hover': {
                            transform: 'scale(1.1)',
                            backgroundColor: `${feature.color}.200`,
                          },
                        }}
                      >
                        <IconComponent sx={{ fontSize: 28 }} />
                      </Box>
                      <Typography
                        variant={isSmallMobile ? 'h6' : 'h5'}
                        component="h3"
                        gutterBottom
                        sx={{
                          fontWeight: 'bold',
                          color: 'text.primary',
                        }}
                      >
                        {t(feature.title)}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          lineHeight: 1.6,
                          mb: 2,
                        }}
                      >
                        {t(feature.description)}
                      </Typography>
                    </CardContent>
                    <CardActions sx={{ p: { xs: 2, sm: 3 }, pt: 0 }}>
                      <Button
                        size="small"
                        color={feature.color as any}
                        sx={{
                          fontWeight: 'bold',
                          textTransform: 'none',
                          fontSize: '0.9rem',
                        }}
                        onClick={(e: React.MouseEvent) => {
                          e.stopPropagation()
                          navigate(feature.route)
                        }}
                      >
                        {t('common.learnMore')} →
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              )
            })}
          </Grid>
        </Box>

        {/* Stats Section */}
        <Box
          sx={{
            textAlign: 'center',
            py: { xs: 3, sm: 4, md: 5 },
            backgroundColor: 'grey.50',
            borderRadius: 3,
            px: { xs: 2, sm: 3 },
          }}
        >
          <Typography
            variant={isSmallMobile ? 'h5' : 'h4'}
            component="h2"
            gutterBottom
            sx={{
              fontWeight: 'bold',
              mb: 3,
            }}
          >
            {t('home.stats.title')}
          </Typography>
          
          <Grid container spacing={{ xs: 3, sm: 4 }} sx={{ mt: 2 }}>
            <Grid item xs={6} sm={3}>
              <Typography 
                variant={isSmallMobile ? 'h4' : 'h3'} 
                color="primary" 
                fontWeight="bold"
                sx={{
                  fontSize: { xs: '2rem', sm: '3rem' }
                }}
              >
                10K+
              </Typography>
              <Typography 
                variant="body2" 
                color="text.secondary"
                sx={{
                  fontSize: { xs: '0.75rem', sm: '0.875rem' }
                }}
              >
                {t('home.stats.contracts')}
              </Typography>
            </Grid>
            
            <Grid item xs={6} sm={3}>
              <Typography 
                variant={isSmallMobile ? 'h4' : 'h3'} 
                color="secondary" 
                fontWeight="bold"
                sx={{
                  fontSize: { xs: '2rem', sm: '3rem' }
                }}
              >
                5K+
              </Typography>
              <Typography 
                variant="body2" 
                color="text.secondary"
                sx={{
                  fontSize: { xs: '0.75rem', sm: '0.875rem' }
                }}
              >
                {t('home.stats.users')}
              </Typography>
            </Grid>
            
            <Grid item xs={6} sm={3}>
              <Typography 
                variant={isSmallMobile ? 'h4' : 'h3'} 
                color="success.main" 
                fontWeight="bold"
                sx={{
                  fontSize: { xs: '2rem', sm: '3rem' }
                }}
              >
                99.9%
              </Typography>
              <Typography 
                variant="body2" 
                color="text.secondary"
                sx={{
                  fontSize: { xs: '0.75rem', sm: '0.875rem' }
                }}
              >
                {t('home.stats.uptime')}
              </Typography>
            </Grid>
            
            <Grid item xs={6} sm={3}>
              <Typography 
                variant={isSmallMobile ? 'h4' : 'h3'} 
                color="warning.main" 
                fontWeight="bold"
                sx={{
                  fontSize: { xs: '2rem', sm: '3rem' }
                }}
              >
                24/7
              </Typography>
              <Typography 
                variant="body2" 
                color="text.secondary"
                sx={{
                  fontSize: { xs: '0.75rem', sm: '0.875rem' }
                }}
              >
                {t('home.stats.support')}
              </Typography>
            </Grid>
          </Grid>
        </Box>
      </Container>
      
      {/* AI Assistant Component */}
      <AIAssistant />
    </Box>
  )
}

export default HomePage

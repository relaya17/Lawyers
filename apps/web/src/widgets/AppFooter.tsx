import React from 'react'
import { Box, Typography, Container, Grid, Link, Divider } from '@mui/material'
import { 
  Description, 
  School, 
  Handshake, 
  Store, 
  Email,
  Phone,
  Language
} from '@mui/icons-material'
import { useTranslation } from 'react-i18next'
import { Link as RouterLink } from 'react-router-dom'
import { alpha, useTheme } from '@mui/material/styles'

export const AppFooter: React.FC = () => {
  const { t } = useTranslation()
  const theme = useTheme()
  
  return (
    <Box 
      component="footer" 
      sx={{ 
        bgcolor: 'background.paper',
        backgroundImage: `linear-gradient(180deg, ${alpha(theme.palette.primary.main, theme.palette.mode === 'dark' ? 0.12 : 0.06)} 0%, transparent 70%)`,
        borderTop: 1,
        borderColor: 'divider',
        py: 4,
        // Keep footer content clear of fixed FABs on small screens
        pb: { xs: 'calc(88px + env(safe-area-inset-bottom))', sm: 4 },
        mt: 'auto'
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4} justifyContent="center" sx={{ textAlign: 'center' }}>
          {/* מידע על החברה */}
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
              <Description sx={{ marginInlineEnd: 1, color: 'primary.main' }} />
              <Typography variant="h6" component="h2">
                {t('app.title', { defaultValue: 'ContractLab Pro' })}
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary" paragraph>
              {t('app.subtitle', { defaultValue: 'פלטפורמה מתקדמת לניהול חוזים ולמידה משפטית' })}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
              <Link href="mailto:support@contractlab.pro" color="inherit" aria-label="Email">
                <Email fontSize="small" />
              </Link>
              <Link href="tel:+972-XX-XXXXXXX" color="inherit" aria-label="Phone">
                <Phone fontSize="small" />
              </Link>
              <Link href="https://contractlab.pro" color="inherit" aria-label="Website">
                <Language fontSize="small" />
              </Link>
            </Box>
            </Box>
          </Grid>

          {/* תכונות עיקריות */}
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom>
              {t('footer.primaryFeatures', { defaultValue: 'תכונות עיקריות' })}
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, alignItems: 'center' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                <Description fontSize="small" color="primary" />
                <Typography variant="body2">{t('footer.features.contracts', { defaultValue: 'ניהול חוזים חכם' })}</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                <School fontSize="small" color="primary" />
                <Link component={RouterLink} to="/legal-knowledge" color="inherit" variant="body2">
                  {t('footer.features.simulator', { defaultValue: 'מעבדה חוזית' })}
                </Link>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                <Handshake fontSize="small" color="primary" />
                <Link component={RouterLink} to="/virtual-court-2" color="inherit" variant="body2">
                  {t('footer.features.negotiation', { defaultValue: 'מו״מ חכם' })}
                </Link>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                <Store fontSize="small" color="primary" />
                <Typography variant="body2">{t('footer.features.marketplace', { defaultValue: 'שוק תבניות' })}</Typography>
              </Box>
            </Box>
          </Grid>

          {/* קישורים מהירים */}
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom>
              {t('footer.quickLinks', { defaultValue: 'קישורים מהירים' })}
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, alignItems: 'center' }}>
              <Link component={RouterLink} to="/contracts" color="inherit" variant="body2">
                {t('navigation.contracts', { defaultValue: 'חוזים' })}
              </Link>
              <Link component={RouterLink} to="/legal-knowledge" color="inherit" variant="body2">
                {t('navigation.legalKnowledge', { defaultValue: 'מקורות משפט' })}
              </Link>
              <Link component={RouterLink} to="/marketplace" color="inherit" variant="body2">
                {t('navigation.marketplace', { defaultValue: 'שוק חוזים' })}
              </Link>
              <Link component={RouterLink} to="/settings" color="inherit" variant="body2">
                {t('navigation.settings', { defaultValue: 'הגדרות' })}
              </Link>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />
        
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap', gap: 2, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            © {new Date().getFullYear()} {t('app.title', { defaultValue: 'ContractLab Pro' })}. {t('footer.allRightsReserved', { defaultValue: 'כל הזכויות שמורות.' })}
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link component={RouterLink} to="/privacy" color="inherit" variant="body2">
              {t('footer.privacy', { defaultValue: 'פרטיות' })}
            </Link>
            <Link component={RouterLink} to="/terms" color="inherit" variant="body2">
              {t('footer.terms', { defaultValue: 'תנאי שימוש' })}
            </Link>
            <Link component={RouterLink} to="/support" color="inherit" variant="body2">
              {t('footer.support', { defaultValue: 'תמיכה' })}
            </Link>
          </Box>
        </Box>
      </Container>
    </Box>
  )
}

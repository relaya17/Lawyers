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
// import { useTranslation } from 'react-i18next'

export const AppFooter: React.FC = () => {
  // const { t } = useTranslation()
  
  return (
    <Box 
      component="footer" 
      sx={{ 
        bgcolor: 'background.paper',
        borderTop: 1,
        borderColor: 'divider',
        py: 4,
        mt: 'auto'
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* מידע על החברה */}
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Description sx={{ mr: 1, color: 'primary.main' }} />
              <Typography variant="h6" component="h2">
                ContractLab Pro
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary" paragraph>
              פלטפורמה מתקדמת לניהול חוזים ולמידה משפטית
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Link href="mailto:support@contractlab.pro" color="inherit">
                <Email fontSize="small" />
              </Link>
              <Link href="tel:+972-XX-XXXXXXX" color="inherit">
                <Phone fontSize="small" />
              </Link>
              <Link href="https://contractlab.pro" color="inherit">
                <Language fontSize="small" />
              </Link>
            </Box>
          </Grid>

          {/* תכונות עיקריות */}
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom>
              תכונות עיקריות
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Description fontSize="small" color="primary" />
                <Typography variant="body2">ניהול חוזים חכם</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <School fontSize="small" color="primary" />
                <Typography variant="body2">מעבדה חוזית</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Handshake fontSize="small" color="primary" />
                <Typography variant="body2">מו״מ חכם</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Store fontSize="small" color="primary" />
                <Typography variant="body2">שוק תבניות</Typography>
              </Box>
            </Box>
          </Grid>

          {/* קישורים מהירים */}
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom>
              קישורים מהירים
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Link href="/contracts" color="inherit" variant="body2">
                חוזים
              </Link>
              <Link href="/simulator" color="inherit" variant="body2">
                סימולטור
              </Link>
              <Link href="/risk-analysis" color="inherit" variant="body2">
                ניתוח סיכונים
              </Link>
              <Link href="/marketplace" color="inherit" variant="body2">
                שוק חוזים
              </Link>
              <Link href="/settings" color="inherit" variant="body2">
                הגדרות
              </Link>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
          <Typography variant="body2" color="text.secondary">
            © {new Date().getFullYear()} ContractLab Pro. כל הזכויות שמורות.
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Link href="/privacy" color="inherit" variant="body2">
              פרטיות
            </Link>
            <Link href="/terms" color="inherit" variant="body2">
              תנאי שימוש
            </Link>
            <Link href="/support" color="inherit" variant="body2">
              תמיכה
            </Link>
          </Box>
        </Box>
      </Container>
    </Box>
  )
}

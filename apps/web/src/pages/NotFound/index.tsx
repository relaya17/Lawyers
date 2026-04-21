import React from 'react'
import { Box, Container, Typography, Button } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

export const NotFoundPage: React.FC = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
        }}
      >
        <Typography variant="h1" component="h1" gutterBottom color="primary">
          404
        </Typography>
        
        <Typography variant="h4" component="h2" gutterBottom>
          {t('errors.notFound')}
        </Typography>
        
        <Typography variant="body1" color="text.secondary" paragraph>
          הדף שחיפשת לא נמצא
        </Typography>
        
        <Box sx={{ mt: 4, display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
          <Button
            variant="contained"
            onClick={() => navigate('/')}
            size="large"
          >
            {t('navigation.home')}
          </Button>
          
          <Button
            variant="outlined"
            onClick={() => navigate(-1)}
            size="large"
          >
            {t('app.back')}
          </Button>
        </Box>
      </Box>
    </Container>
  )
}

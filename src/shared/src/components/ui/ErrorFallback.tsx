import React from 'react'
import { Box, Button, Typography, Container, Paper } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { ErrorBoundary, FallbackProps } from 'react-error-boundary'

export const ErrorFallbackComponent: React.FC<FallbackProps> = ({ error, resetErrorBoundary }) => {
  const { t } = useTranslation()

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 4,
            textAlign: 'center',
            borderRadius: 2,
          }}
        >
          <Typography variant="h4" component="h1" gutterBottom color="error">
            {t('errors.general')}
          </Typography>
          
          <Typography variant="body1" color="text.secondary" paragraph>
            {t('errors.general')}
          </Typography>
          
          {process.env.NODE_ENV === 'development' && (
            <Box
              component="pre"
              sx={{
                mt: 2,
                p: 2,
                backgroundColor: 'grey.100',
                borderRadius: 1,
                fontSize: '0.875rem',
                textAlign: 'left',
                overflow: 'auto',
                maxHeight: 200,
              }}
            >
              {error.message}
            </Box>
          )}
          
          <Box sx={{ mt: 3, display: 'flex', gap: 2, justifyContent: 'center' }}>
            <Button
              variant="contained"
              onClick={resetErrorBoundary}
              sx={{ minWidth: 120 }}
            >
              {t('app.refresh')}
            </Button>
            
            <Button
              variant="outlined"
              onClick={() => window.location.href = '/'}
              sx={{ minWidth: 120 }}
            >
              {t('navigation.home')}
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  )
}

export const ErrorFallback: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallbackComponent}>
      {children}
    </ErrorBoundary>
  )
}

import React from 'react'
import { Box, Container, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { AIAssistant } from '../../features/ai-assistant/components/AIAssistant'

export const AIAssistantPage: React.FC = () => {
  const { t } = useTranslation()

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <Typography variant="h4" gutterBottom>
        {t('ai.title', 'עוזר AI משפטי')}
      </Typography>
      
      <Box sx={{ height: 'calc(100vh - 200px)' }}>
        <AIAssistant />
      </Box>
    </Container>
  )
}

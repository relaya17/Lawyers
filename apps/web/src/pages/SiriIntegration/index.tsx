import React from 'react'
import { Container } from '@mui/material'
import { SiriDashboard } from '../../features/siri-integration/components/SiriDashboard'

export const SiriIntegrationPage: React.FC = () => {
  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      <SiriDashboard />
    </Container>
  )
}

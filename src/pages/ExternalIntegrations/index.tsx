import React from 'react'
import { Container } from '@mui/material'
import { IntegrationDashboard } from '../../features/external-integrations/components/IntegrationDashboard'

export const ExternalIntegrationsPage: React.FC = () => {
  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      <IntegrationDashboard />
    </Container>
  )
}

import React from 'react'
import { Container } from '@mui/material'
import { AppleWatchDashboard } from '../../features/apple-watch/components/AppleWatchDashboard'

export const AppleWatchPage: React.FC = () => {
  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      <AppleWatchDashboard />
    </Container>
  )
}

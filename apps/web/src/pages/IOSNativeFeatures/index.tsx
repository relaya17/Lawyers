import React from 'react'
import { Container } from '@mui/material'
import { IOSFeaturePanel } from '../../features/ios-native/components/IOSFeaturePanel'

export const IOSNativeFeaturesPage: React.FC = () => {
  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      <IOSFeaturePanel />
    </Container>
  )
}

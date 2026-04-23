import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { Container } from '@mui/material'
import {
  VirtualCourt2HomePage,
  VirtualCourt2NewCasePage,
  VirtualCourt2CaseDetailPage,
} from '@/features/virtual-court-2'

export const VirtualCourt2Page: React.FC = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 2 }}>
      <Routes>
        <Route index element={<VirtualCourt2HomePage />} />
        <Route path="new" element={<VirtualCourt2NewCasePage />} />
        <Route path=":caseId" element={<VirtualCourt2CaseDetailPage />} />
        <Route path="*" element={<Navigate to="/virtual-court-2" replace />} />
      </Routes>
    </Container>
  )
}

export default VirtualCourt2Page

import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import {
  VirtualCourtHomePage,
  VirtualCourtClerkPage,
  VirtualCourtRankingsPage,
} from '@/features/virtual-court'

export const VirtualCourtPage: React.FC = () => {
  return (
    <Routes>
      <Route index element={<VirtualCourtHomePage />} />
      <Route path="clerk" element={<VirtualCourtClerkPage />} />
      <Route path="rankings" element={<VirtualCourtRankingsPage />} />
      <Route path="*" element={<Navigate to="/virtual-court" replace />} />
    </Routes>
  )
}

export default VirtualCourtPage

import React from 'react'
import { EnhancedVirtualCourt } from './EnhancedVirtualCourt'
import { useTranslation } from 'react-i18next'

export const VirtualCourtPage: React.FC = () => {
  const { t } = useTranslation()

  const handleSessionStart = (sessionId: string) => {
    console.log('Session started:', sessionId)
  }

  const handleSessionEnd = (sessionId: string) => {
    console.log('Session ended:', sessionId)
  }

  return (
    <EnhancedVirtualCourt 
      onSessionStart={handleSessionStart}
      onSessionEnd={handleSessionEnd}
    />
  )
}

export default VirtualCourtPage

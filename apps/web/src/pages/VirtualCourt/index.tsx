import React from 'react'
import { Box } from '@mui/material'
import { Gavel } from '@mui/icons-material'
import { EnhancedVirtualCourt } from './EnhancedVirtualCourt'
import { useTranslation } from 'react-i18next'
import { PageHero } from '@/design/PageHero'

export const VirtualCourtPage: React.FC = () => {
  const { t: _t } = useTranslation()

  const handleSessionStart = (sessionId: string) => {
    console.log('Session started:', sessionId)
  }

  const handleSessionEnd = (sessionId: string) => {
    console.log('Session ended:', sessionId)
  }

  return (
    <Box>
      <Box sx={{ px: { xs: 2, sm: 3, md: 4 } }}>
        <PageHero
          title="בית משפט וירטואלי"
          subtitle="תרגל הופעה משפטית מול שופט וירטואלי, טיעונים, חקירת עדים וסיכומים — מקרים מבוססים על פסיקת בית המשפט העליון, עם משוב AI על הביצועים."
          chips={['פסיקה אמיתית', 'שופט וירטואלי', 'משוב AI']}
          icon={<Gavel sx={{ fontSize: 48 }} />}
        />
      </Box>
      <EnhancedVirtualCourt
        onSessionStart={handleSessionStart}
        onSessionEnd={handleSessionEnd}
      />
    </Box>
  )
}

export default VirtualCourtPage

import React from 'react'
import { Alert, Collapse, Box } from '@mui/material'
import CloudOffIcon from '@mui/icons-material/CloudOff'
import { useOnlineStatus } from './useOnlineStatus'

/**
 * Fixed banner that appears at the top when the user goes offline.
 * Non-blocking — the app keeps working thanks to the cached TanStack
 * Query state and the service worker.
 */
export const OfflineBanner: React.FC = () => {
  const isOnline = useOnlineStatus()
  return (
    <Collapse in={!isOnline} unmountOnExit>
      <Box
        role="status"
        aria-live="polite"
        sx={{
          position: 'sticky',
          top: 0,
          zIndex: (t) => t.zIndex.appBar + 2,
        }}
      >
        <Alert
          icon={<CloudOffIcon fontSize="inherit" />}
          severity="warning"
          variant="filled"
          sx={{ borderRadius: 0, justifyContent: 'center' }}
        >
          ללא חיבור לאינטרנט — אפשר להמשיך לתרגל שאלות ששמורות במכשיר.
          שינויים יסתנכרנו אוטומטית כשתחזור הקליטה.
        </Alert>
      </Box>
    </Collapse>
  )
}

import React, { useEffect, useRef } from 'react'
import { useSessionAuth } from '@/features/auth/providers/SessionAuthProvider'
import { notificationService } from '@/services/notifications'
import { getSocket } from './socketClient'

/**
 * מאזין ל-`notification:new` מכל מקום באפליקציה (חדר אישי `user:<id>` בשרת).
 * מזין את מגש ההתראות הקיים (RealtimeNotifications) דרך notificationService.
 */
export const RealtimeSocketBridge: React.FC = () => {
  const { accessToken } = useSessionAuth()
  const tokenRef = useRef(accessToken)
  tokenRef.current = accessToken

  useEffect(() => {
    if (!accessToken) return

    const socket = getSocket(() => tokenRef.current)

    const onServerNotification = (p: { id: string; title: string; body: string; ts: number }) => {
      notificationService.createNotification(
        p.title,
        p.body,
        'info',
        'medium',
        'collaboration',
        {
          id: p.id,
          metadata: { source: 'realtime', ts: p.ts },
        },
      )
    }

    socket.on('notification:new', onServerNotification)
    return () => {
      socket.off('notification:new', onServerNotification)
    }
  }, [accessToken])

  return null
}

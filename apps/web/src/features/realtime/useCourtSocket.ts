import { useEffect, useRef, useState, useCallback } from 'react'
import { useSessionAuth } from '@/features/auth/providers/SessionAuthProvider'
import { notificationService } from '@/services/notifications'
import { getSocket, type AppSocket } from './socketClient'
import type { CourtAiRole } from './types'

export interface CourtAiMessage {
  role: CourtAiRole
  content: string
  ts: number
}

export interface UseCourtSocketResult {
  connected: boolean
  typing: CourtAiRole | null
  lastMessage: CourtAiMessage | null
  participants: Set<string>
  emitTyping: (isTyping: boolean) => void
}

/**
 * Subscribe to real-time updates for a single virtual-court case.
 * Automatically joins/leaves the case room and cleans up on unmount.
 *
 * Falls back silently if the user is not authenticated — the REST path
 * still works, so offline-ish degradation is acceptable.
 */
export function useCourtSocket(caseId: string | null | undefined): UseCourtSocketResult {
  const { accessToken } = useSessionAuth()
  const tokenRef = useRef(accessToken)
  tokenRef.current = accessToken

  const [connected, setConnected] = useState(false)
  const [typing, setTyping] = useState<CourtAiRole | null>(null)
  const [lastMessage, setLastMessage] = useState<CourtAiMessage | null>(null)
  const [participants, setParticipants] = useState<Set<string>>(new Set())

  const socketRef = useRef<AppSocket | null>(null)
  const typingClearRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (!caseId || !accessToken) return

    const socket = getSocket(() => tokenRef.current)
    socketRef.current = socket

    const onConnect = () => {
      setConnected(true)
      socket.emit('court:join', caseId, () => undefined)
    }
    const onDisconnect = () => setConnected(false)

    const onTyping = (p: { caseId: string; role: CourtAiRole }) => {
      if (p.caseId !== caseId) return
      setTyping(p.role)
      if (typingClearRef.current) clearTimeout(typingClearRef.current)
      typingClearRef.current = setTimeout(() => setTyping(null), 4000)
    }

    const onResponse = (p: {
      caseId: string
      role: CourtAiRole
      content: string
      ts: number
    }) => {
      if (p.caseId !== caseId) return
      setTyping(null)
      setLastMessage({ role: p.role, content: p.content, ts: p.ts })
    }

    const onJoin = (p: { caseId: string; userId: string }) => {
      if (p.caseId !== caseId) return
      setParticipants((prev) => new Set(prev).add(p.userId))
    }

    const onLeave = (p: { caseId: string; userId: string }) => {
      if (p.caseId !== caseId) return
      setParticipants((prev) => {
        const next = new Set(prev)
        next.delete(p.userId)
        return next
      })
    }

    const onAnnouncement = (p: {
      caseId: string
      title: string
      body: string
      fromName: string
      ts: number
    }) => {
      if (p.caseId !== caseId) return
      notificationService.createNotification(
        p.title,
        `${p.body}\n\nמאת: ${p.fromName}`,
        'info',
        'high',
        'collaboration',
        {
          id: `court-announce-${p.caseId}-${p.ts}`,
          metadata: { caseId: p.caseId, source: 'court_announcement' },
        },
      )
    }

    socket.on('connect', onConnect)
    socket.on('disconnect', onDisconnect)
    socket.on('court:ai_typing', onTyping)
    socket.on('court:ai_response', onResponse)
    socket.on('court:participant_joined', onJoin)
    socket.on('court:participant_left', onLeave)
    socket.on('court:announcement', onAnnouncement)

    if (socket.connected) onConnect()

    return () => {
      if (typingClearRef.current) clearTimeout(typingClearRef.current)
      socket.off('connect', onConnect)
      socket.off('disconnect', onDisconnect)
      socket.off('court:ai_typing', onTyping)
      socket.off('court:ai_response', onResponse)
      socket.off('court:participant_joined', onJoin)
      socket.off('court:participant_left', onLeave)
      socket.off('court:announcement', onAnnouncement)
      if (socket.connected) socket.emit('court:leave', caseId)
    }
  }, [caseId, accessToken])

  const emitTyping = useCallback(
    (isTyping: boolean) => {
      if (!caseId) return
      socketRef.current?.emit('court:typing', { caseId, isTyping })
    },
    [caseId],
  )

  return { connected, typing, lastMessage, participants, emitTyping }
}

import { useCallback, useEffect, useRef, useState } from 'react'
import { useSessionAuth } from '@/features/auth/providers/SessionAuthProvider'
import { getSocket, type AppSocket } from '@/features/realtime/socketClient'
import type { CourtroomSession, ProtocolLine } from '../types'
import { getSession, getCapabilities, type CourtroomCapabilities } from '../api/courtroomApi'

export interface UseLiveCourtroomResult {
  connected: boolean
  session: CourtroomSession | null
  capabilities: CourtroomCapabilities | null
  loading: boolean
  error: string | null
  currentSpeakerUserId: string | null
  refresh: () => Promise<void>
  emitSpeaking: (isSpeaking: boolean) => void
}

const DEFAULT_CAPABILITIES: CourtroomCapabilities = {
  role: null,
  isJudicial: false,
  isProsecution: false,
  isDefense: false,
  isTestimony: false,
  canStart: false,
  canEnd: false,
  canChangeMode: false,
  canAddProtocol: false,
  canEditAnyProtocol: false,
  canDeleteProtocol: false,
  canAddEvidence: false,
  canPresentAny: false,
  canSuggestAiLine: false,
  canTranscribe: false,
}

/**
 * חיבור ל-Live Courtroom: טוען session מה-REST + מתחבר ל-socket events.
 */
export function useLiveCourtroom(sessionId: string | null | undefined): UseLiveCourtroomResult {
  const { accessToken } = useSessionAuth()
  const tokenRef = useRef(accessToken)
  tokenRef.current = accessToken

  const [connected, setConnected] = useState(false)
  const [session, setSession] = useState<CourtroomSession | null>(null)
  const [capabilities, setCapabilities] = useState<CourtroomCapabilities | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [currentSpeakerUserId, setCurrentSpeakerUserId] = useState<string | null>(null)

  const socketRef = useRef<AppSocket | null>(null)

  const refresh = useCallback(async () => {
    if (!sessionId) return
    setLoading(true)
    setError(null)
    try {
      const [s, caps] = await Promise.all([
        getSession(sessionId),
        getCapabilities(sessionId).catch(() => DEFAULT_CAPABILITIES),
      ])
      setSession(s)
      setCapabilities(caps)
      setCurrentSpeakerUserId(s.currentSpeakerUserId ?? null)
    } catch (e) {
      const err = e as { message?: string }
      setError(err.message ?? 'שגיאה בטעינת הדיון')
    } finally {
      setLoading(false)
    }
  }, [sessionId])

  useEffect(() => {
    if (sessionId) void refresh()
  }, [sessionId, refresh])

  useEffect(() => {
    if (!sessionId || !accessToken) return

    const socket = getSocket(() => tokenRef.current)
    socketRef.current = socket

    const onConnect = () => {
      setConnected(true)
      socket.emit('courtroom:join', sessionId, () => undefined)
    }
    const onDisconnect = () => setConnected(false)

    const onProtocolLine = (p: { sessionId: string; line: unknown }) => {
      if (p.sessionId !== sessionId) return
      const line = p.line as ProtocolLine
      setSession((prev) => {
        if (!prev) return prev
        if (prev.protocol.some((l) => l.lineId === line.lineId)) return prev
        return { ...prev, protocol: [...prev.protocol, line] }
      })
    }

    const onProtocolEdit = (p: { sessionId: string; lineId: string; text: string }) => {
      if (p.sessionId !== sessionId) return
      setSession((prev) => {
        if (!prev) return prev
        return {
          ...prev,
          protocol: prev.protocol.map((l) =>
            l.lineId === p.lineId ? { ...l, text: p.text, verifiedBySecretary: true } : l,
          ),
        }
      })
    }

    const onSpeakerChange = (p: { sessionId: string; speakerUserId: string | null }) => {
      if (p.sessionId !== sessionId) return
      setCurrentSpeakerUserId(p.speakerUserId)
    }

    const onEvidencePresent = (p: { sessionId: string; evidenceId: string }) => {
      if (p.sessionId !== sessionId) return
      setSession((prev) => {
        if (!prev) return prev
        return {
          ...prev,
          evidence: prev.evidence.map((e) =>
            e.evidenceId === p.evidenceId ? { ...e, currentlyPresented: true } : e,
          ),
        }
      })
    }

    const onEvidenceHide = (p: { sessionId: string; evidenceId: string }) => {
      if (p.sessionId !== sessionId) return
      setSession((prev) => {
        if (!prev) return prev
        return {
          ...prev,
          evidence: prev.evidence.map((e) =>
            e.evidenceId === p.evidenceId ? { ...e, currentlyPresented: false } : e,
          ),
        }
      })
    }

    const onRoleAssigned = () => {
      void refresh()
    }

    const onHearingStart = (p: { sessionId: string }) => {
      if (p.sessionId !== sessionId) return
      setSession((prev) => (prev ? { ...prev, status: 'live' } : prev))
    }

    const onHearingEnd = (p: { sessionId: string }) => {
      if (p.sessionId !== sessionId) return
      setSession((prev) => (prev ? { ...prev, status: 'ended' } : prev))
    }

    socket.on('connect', onConnect)
    socket.on('disconnect', onDisconnect)
    socket.on('courtroom:protocol_line', onProtocolLine)
    socket.on('courtroom:protocol_edit', onProtocolEdit)
    socket.on('courtroom:speaker_change', onSpeakerChange)
    socket.on('courtroom:evidence_present', onEvidencePresent)
    socket.on('courtroom:evidence_hide', onEvidenceHide)
    socket.on('courtroom:role_assigned', onRoleAssigned)
    socket.on('courtroom:hearing_start', onHearingStart)
    socket.on('courtroom:hearing_end', onHearingEnd)

    if (socket.connected) onConnect()

    return () => {
      socket.off('connect', onConnect)
      socket.off('disconnect', onDisconnect)
      socket.off('courtroom:protocol_line', onProtocolLine)
      socket.off('courtroom:protocol_edit', onProtocolEdit)
      socket.off('courtroom:speaker_change', onSpeakerChange)
      socket.off('courtroom:evidence_present', onEvidencePresent)
      socket.off('courtroom:evidence_hide', onEvidenceHide)
      socket.off('courtroom:role_assigned', onRoleAssigned)
      socket.off('courtroom:hearing_start', onHearingStart)
      socket.off('courtroom:hearing_end', onHearingEnd)
      if (socket.connected) socket.emit('courtroom:leave', sessionId)
    }
  }, [sessionId, accessToken, refresh])

  const emitSpeaking = useCallback(
    (isSpeaking: boolean) => {
      if (!sessionId) return
      socketRef.current?.emit('courtroom:speaking', { sessionId, isSpeaking })
    },
    [sessionId],
  )

  return {
    connected,
    session,
    capabilities,
    loading,
    error,
    currentSpeakerUserId,
    refresh,
    emitSpeaking,
  }
}

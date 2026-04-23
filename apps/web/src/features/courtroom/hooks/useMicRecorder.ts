import { useCallback, useEffect, useRef, useState } from 'react'

export type RecorderStatus = 'idle' | 'recording' | 'stopping' | 'error'

export interface UseMicRecorderResult {
  status: RecorderStatus
  error: string | null
  start: () => Promise<void>
  stop: () => Promise<Blob | null>
  durationMs: number
}

/**
 * מקליט מיקרופון לדגימת אודיו לשליחה ל-Whisper.
 * משתמש ב-MediaRecorder של הדפדפן; מחזיר Blob שניתן לשלוח.
 */
export function useMicRecorder(): UseMicRecorderResult {
  const [status, setStatus] = useState<RecorderStatus>('idle')
  const [error, setError] = useState<string | null>(null)
  const [durationMs, setDurationMs] = useState(0)

  const recorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const streamRef = useRef<MediaStream | null>(null)
  const startTsRef = useRef<number>(0)
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    return () => {
      if (tickRef.current) clearInterval(tickRef.current)
      streamRef.current?.getTracks().forEach((t) => t.stop())
    }
  }, [])

  const start = useCallback(async (): Promise<void> => {
    setError(null)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      streamRef.current = stream
      const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
        ? 'audio/webm;codecs=opus'
        : 'audio/webm'
      const rec = new MediaRecorder(stream, { mimeType })
      chunksRef.current = []
      rec.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) chunksRef.current.push(e.data)
      }
      recorderRef.current = rec
      rec.start(250)
      startTsRef.current = Date.now()
      setDurationMs(0)
      tickRef.current = setInterval(() => {
        setDurationMs(Date.now() - startTsRef.current)
      }, 200)
      setStatus('recording')
    } catch (e) {
      const err = e as { message?: string }
      setError(err.message ?? 'שגיאה בגישה למיקרופון')
      setStatus('error')
    }
  }, [])

  const stop = useCallback(async (): Promise<Blob | null> => {
    const rec = recorderRef.current
    if (!rec) return null
    setStatus('stopping')
    if (tickRef.current) {
      clearInterval(tickRef.current)
      tickRef.current = null
    }
    const blob: Blob = await new Promise((resolve) => {
      rec.onstop = () => {
        const b = new Blob(chunksRef.current, { type: rec.mimeType || 'audio/webm' })
        resolve(b)
      }
      rec.stop()
    })
    streamRef.current?.getTracks().forEach((t) => t.stop())
    streamRef.current = null
    recorderRef.current = null
    setStatus('idle')
    return blob
  }, [])

  return { status, error, start, stop, durationMs }
}

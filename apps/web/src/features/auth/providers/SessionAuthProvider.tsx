import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { useDispatch } from 'react-redux'
import type { User } from '@shared/store/slices/authSlice'
import { logout, setAuthSession, setAuthLoading } from '@shared/store/slices/authSlice'
import { authJson, clearCsrfCache, prefetchCsrf } from '../api/authHttp'
import { setSyncAccessToken } from '../api/accessTokenSync'
import { registerUnauthorizedHandler } from '../api/authUnauthorizedBridge'
import { disconnectSocket } from '@/features/realtime/socketClient'

type AuthStatus = 'bootstrapping' | 'ready'

export interface SessionAuthContextValue {
  status: AuthStatus
  user: User | null
  accessToken: string | null
  isAuthenticated: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (input: {
    email: string
    password: string
    firstName: string
    lastName: string
    phone?: string
  }) => Promise<{ requiresVerification: true; email: string }>
  verifyOtp: (email: string, code: string) => Promise<void>
  resendOtp: (email: string) => Promise<void>
  signOut: () => Promise<void>
  refreshSession: () => Promise<void>
}

const SessionAuthContext = createContext<SessionAuthContextValue | null>(null)

export const SessionAuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const dispatch = useDispatch()
  const [status, setStatus] = useState<AuthStatus>('bootstrapping')
  const [user, setUser] = useState<User | null>(null)
  const [accessToken, setAccessToken] = useState<string | null>(null)

  const applySession = useCallback(
    (u: User, token: string) => {
      setUser(u)
      setAccessToken(token)
      setSyncAccessToken(token)
      dispatch(setAuthSession({ user: u, accessToken: token }))
    },
    [dispatch],
  )

  const clearSession = useCallback(() => {
    setUser(null)
    setAccessToken(null)
    setSyncAccessToken(null)
    clearCsrfCache()
    dispatch(logout())
  }, [dispatch])

  const refreshSession = useCallback(async () => {
    try {
      await prefetchCsrf()
      const data = await authJson<{ user: User; accessToken: string }>('/auth/refresh', {
        method: 'POST',
        body: JSON.stringify({}),
      })
      applySession(data.user, data.accessToken)
    } catch {
      clearSession()
      throw new Error('פג תוקף ההתחברות — נא להתחבר מחדש')
    }
  }, [applySession, clearSession])

  useEffect(() => {
    registerUnauthorizedHandler(() => {
      clearSession()
      disconnectSocket()
      try {
        localStorage.removeItem('authToken')
      } catch {
        /* ignore */
      }
      const p = window.location.pathname
      if (!p.startsWith('/login') && !p.startsWith('/register')) {
        window.location.assign('/login?reason=session')
      }
    })
    return () => registerUnauthorizedHandler(null)
  }, [clearSession])

  useEffect(() => {
    // כשהשרת לא פועל (פיתוח מקומי) — דלג על CSRF/session bootstrap
    if (import.meta.env.VITE_SKIP_AUTH_BOOTSTRAP === 'true') {
      setStatus('ready')
      dispatch(setAuthLoading(false))
      return
    }

    let cancelled = false
    ;(async () => {
      dispatch(setAuthLoading(true))
      try {
        await prefetchCsrf()
        const data = await authJson<{ user: User; accessToken: string }>('/auth/refresh', {
          method: 'POST',
          body: JSON.stringify({}),
        })
        if (!cancelled) applySession(data.user, data.accessToken)
      } catch {
        if (!cancelled) clearSession()
      } finally {
        if (!cancelled) {
          setStatus('ready')
          dispatch(setAuthLoading(false))
        }
      }
    })()
    return () => {
      cancelled = true
    }
  }, [applySession, clearSession, dispatch])

  const signIn = useCallback(
    async (email: string, password: string) => {
      dispatch(setAuthLoading(true))
      try {
        await prefetchCsrf()
        const data = await authJson<{ user: User; accessToken: string }>('/auth/login', {
          method: 'POST',
          body: JSON.stringify({ email, password }),
        })
        applySession(data.user, data.accessToken)
      } finally {
        dispatch(setAuthLoading(false))
      }
    },
    [applySession, dispatch],
  )

  const signUp = useCallback(
    async (input: {
      email: string
      password: string
      firstName: string
      lastName: string
      phone?: string
    }) => {
      dispatch(setAuthLoading(true))
      try {
        await prefetchCsrf()
        const out = await authJson<{ email: string; requiresVerification: true }>(
          '/auth/register',
          {
            method: 'POST',
            body: JSON.stringify(input),
          },
        )
        return out
      } finally {
        dispatch(setAuthLoading(false))
      }
    },
    [dispatch],
  )

  const verifyOtp = useCallback(
    async (email: string, code: string) => {
      dispatch(setAuthLoading(true))
      try {
        await prefetchCsrf()
        const data = await authJson<{ user: User; accessToken: string }>('/auth/verify-email', {
          method: 'POST',
          body: JSON.stringify({ email, code }),
        })
        applySession(data.user, data.accessToken)
      } finally {
        dispatch(setAuthLoading(false))
      }
    },
    [applySession, dispatch],
  )

  const resendOtp = useCallback(
    async (email: string) => {
      await prefetchCsrf()
      await authJson('/auth/resend-otp', {
        method: 'POST',
        body: JSON.stringify({ email }),
      })
    },
    [],
  )

  const signOut = useCallback(async () => {
    dispatch(setAuthLoading(true))
    try {
      await prefetchCsrf()
      await authJson('/auth/logout', { method: 'POST', body: JSON.stringify({}) })
    } catch {
      /* ניקוי מקומי בכל מקרה */
    } finally {
      disconnectSocket()
      clearSession()
      dispatch(setAuthLoading(false))
    }
  }, [clearSession, dispatch])

  const value = useMemo<SessionAuthContextValue>(
    () => ({
      status,
      user,
      accessToken,
      isAuthenticated: !!user && !!accessToken,
      signIn,
      signUp,
      verifyOtp,
      resendOtp,
      signOut,
      refreshSession,
    }),
    [
      status,
      user,
      accessToken,
      signIn,
      signUp,
      verifyOtp,
      resendOtp,
      signOut,
      refreshSession,
    ],
  )

  return (
    <SessionAuthContext.Provider value={value}>{children}</SessionAuthContext.Provider>
  )
}

export function useSessionAuth(): SessionAuthContextValue {
  const ctx = useContext(SessionAuthContext)
  if (!ctx) {
    throw new Error('useSessionAuth must be used within SessionAuthProvider')
  }
  return ctx
}

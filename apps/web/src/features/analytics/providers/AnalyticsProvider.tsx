import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef } from 'react'
import posthog from 'posthog-js'
import { useLocation } from 'react-router-dom'
import { useSessionAuth } from '@/features/auth/providers/SessionAuthProvider'
import type { AnalyticsEventName } from '../events'

type AnalyticsProperties = Record<string, string | number | boolean | null | undefined>

interface AnalyticsContextValue {
  enabled: boolean
  track: (event: AnalyticsEventName | string, props?: AnalyticsProperties) => void
  identify: (distinctId: string, traits?: AnalyticsProperties) => void
  reset: () => void
}

const NOOP: AnalyticsContextValue = {
  enabled: false,
  track: () => {},
  identify: () => {},
  reset: () => {},
}

const AnalyticsContext = createContext<AnalyticsContextValue>(NOOP)

const POSTHOG_KEY = import.meta.env.VITE_POSTHOG_KEY as string | undefined
const POSTHOG_HOST =
  (import.meta.env.VITE_POSTHOG_HOST as string | undefined) ?? 'https://us.i.posthog.com'

function sanitize(props?: AnalyticsProperties): AnalyticsProperties {
  if (!props) return {}
  const clean: AnalyticsProperties = {}
  for (const [k, v] of Object.entries(props)) {
    if (v === undefined || v === null) continue
    clean[k] = v
  }
  return clean
}

export const AnalyticsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useSessionAuth()
  const location = useLocation()
  const initialized = useRef(false)
  const enabled = Boolean(POSTHOG_KEY)

  useEffect(() => {
    if (!enabled || initialized.current) return
    posthog.init(POSTHOG_KEY!, {
      api_host: POSTHOG_HOST,
      // Respect Do-Not-Track; explicit pageview tracking handled by us
      capture_pageview: false,
      capture_pageleave: true,
      persistence: 'localStorage+cookie',
      autocapture: true,
      loaded: (ph) => {
        if (import.meta.env.DEV) ph.debug()
      },
    })
    initialized.current = true
  }, [enabled])

  useEffect(() => {
    if (!enabled) return
    if (user) {
      posthog.identify(user.id, {
        email: user.email,
        name: `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim(),
        role: user.role,
      })
    }
  }, [enabled, user])

  useEffect(() => {
    if (!enabled) return
    posthog.capture('$pageview', {
      $current_url: window.location.href,
      path: location.pathname,
      search: location.search,
    })
  }, [enabled, location.pathname, location.search])

  const track = useCallback(
    (event: AnalyticsEventName | string, props?: AnalyticsProperties) => {
      if (!enabled) {
        if (import.meta.env.DEV) {
          // eslint-disable-next-line no-console
          console.debug('[analytics:noop]', event, props)
        }
        return
      }
      posthog.capture(event, sanitize(props))
    },
    [enabled],
  )

  const identify = useCallback(
    (distinctId: string, traits?: AnalyticsProperties) => {
      if (!enabled) return
      posthog.identify(distinctId, sanitize(traits))
    },
    [enabled],
  )

  const reset = useCallback(() => {
    if (!enabled) return
    posthog.reset()
  }, [enabled])

  const value = useMemo<AnalyticsContextValue>(
    () => ({ enabled, track, identify, reset }),
    [enabled, track, identify, reset],
  )

  return <AnalyticsContext.Provider value={value}>{children}</AnalyticsContext.Provider>
}

export function useAnalytics(): AnalyticsContextValue {
  return useContext(AnalyticsContext)
}

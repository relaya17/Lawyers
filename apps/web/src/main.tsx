import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { I18nextProvider } from 'react-i18next'
import { QueryClient } from '@tanstack/react-query'
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client'
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister'

import AppRouter from './routes'
import { store } from '@/store'
import { ThemeProvider } from '@/app/providers/ThemeProvider'
import { SessionAuthProvider } from '@/features/auth/providers/SessionAuthProvider'
import { EntitlementsProvider } from '@/features/billing/providers/EntitlementsProvider'
import { AnalyticsProvider } from '@/features/analytics/providers/AnalyticsProvider'
import { OfflineBanner } from '@/features/offline/OfflineBanner'
import { RealtimeSocketBridge } from '@/features/realtime/RealtimeSocketBridge'
import i18n from './app/i18n'
import { analyticsService } from '@/services/analytics'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      // Keep the cached data alive for 24 hours so offline navigation works
      // even after a long gap. gcTime must be >= the persister maxAge.
      staleTime: 5 * 60 * 1000,
      gcTime: 24 * 60 * 60 * 1000,
      // Avoid refetch-on-reconnect storms that could overwrite offline edits
      refetchOnReconnect: 'always',
      networkMode: 'offlineFirst',
    },
    mutations: {
      retry: false,
      // Offline mutations are paused by React Query and auto-resume on reconnect.
      networkMode: 'offlineFirst',
    },
  },
})

const persister = createSyncStoragePersister({
  storage: typeof window === 'undefined' ? undefined : window.localStorage,
  key: 'lexstudy-query-cache-v1',
  throttleTime: 1000,
})

/**
 * Query keys that must NEVER be read from disk (security-sensitive or time-sensitive):
 *  - 'auth'     — session / user state
 *  - 'billing'  — entitlement flags (could grant stale premium access if persisted)
 *  - 'csrf'     — tokens
 */
const SENSITIVE_KEY_PREFIXES = ['auth', 'billing', 'csrf', 'stripe']

// Ensure initial document lang/dir match saved language (prevents "LTR flash" and mixed RTL/LTR layout on first paint)
const initialLng = localStorage.getItem('i18nextLng') || 'he'
document.documentElement.lang = initialLng
document.documentElement.dir = initialLng === 'he' || initialLng === 'ar' ? 'rtl' : 'ltr'

// רישום Service Worker - רק בפרודקשן
if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then((registration) => {
        console.log('✅ Service Worker נרשם בהצלחה:', registration.scope)
      })
      .catch((error) => {
        console.error('❌ שגיאה ברישום Service Worker:', error)
      })
  })
}

// הפעלת אנליטיקה
analyticsService.trackEvent('app', 'start', 'Application Started')

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistQueryClientProvider
        client={queryClient}
        persistOptions={{
          persister,
          maxAge: 24 * 60 * 60 * 1000,
          buster: import.meta.env.VITE_APP_VERSION ?? '1.0.0',
          dehydrateOptions: {
            shouldDehydrateQuery: (query) => {
              if (query.state.status !== 'success') return false
              const firstKey = String(query.queryKey[0] ?? '')
              return !SENSITIVE_KEY_PREFIXES.includes(firstKey)
            },
          },
        }}
      >
        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <SessionAuthProvider>
            <RealtimeSocketBridge />
            <EntitlementsProvider>
              <AnalyticsProvider>
                <HelmetProvider>
                  <I18nextProvider i18n={i18n}>
                    <ThemeProvider>
                      <OfflineBanner />
                      <AppRouter />
                    </ThemeProvider>
                  </I18nextProvider>
                </HelmetProvider>
              </AnalyticsProvider>
            </EntitlementsProvider>
          </SessionAuthProvider>
        </BrowserRouter>
      </PersistQueryClientProvider>
    </Provider>
  </React.StrictMode>
)

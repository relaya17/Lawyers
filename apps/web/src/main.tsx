import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { I18nextProvider } from 'react-i18next'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { GoogleOAuthProvider } from '@react-oauth/google'

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
      staleTime: 5 * 60 * 1000,
      refetchOnReconnect: 'always',
    },
    mutations: {
      retry: false,
    },
  },
})

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

class RootErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { error: Error | null }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props)
    this.state = { error: null }
  }
  static getDerivedStateFromError(error: Error) {
    return { error }
  }
  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('[RootErrorBoundary] Caught error:', error, info.componentStack)
  }
  render() {
    if (this.state.error) {
      return (
        <div style={{ padding: 32, fontFamily: 'monospace', direction: 'ltr' }}>
          <h2 style={{ color: 'red' }}>Application Error</h2>
          <pre style={{ background: '#fee', padding: 16, borderRadius: 8, overflow: 'auto' }}>
            {this.state.error.message}
            {'\n\n'}
            {this.state.error.stack}
          </pre>
          <button onClick={() => window.location.reload()} style={{ marginTop: 16, padding: '8px 16px' }}>
            Reload
          </button>
        </div>
      )
    }
    return this.props.children
  }
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RootErrorBoundary>
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID ?? ''}>
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
          </GoogleOAuthProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </Provider>
    </RootErrorBoundary>
  </React.StrictMode>
)

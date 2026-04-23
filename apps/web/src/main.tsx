import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { I18nextProvider } from 'react-i18next'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import AppRouter from './routes'
import { store } from '@/store'
import { ThemeProvider } from '@/app/providers/ThemeProvider'
import { SessionAuthProvider } from '@/features/auth/providers/SessionAuthProvider'
import i18n from './app/i18n'
import { analyticsService } from '@/services/analytics'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, staleTime: 60_000 },
    mutations: { retry: false },
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

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <SessionAuthProvider>
            <HelmetProvider>
              <I18nextProvider i18n={i18n}>
                <ThemeProvider>
                  <AppRouter />
                </ThemeProvider>
              </I18nextProvider>
            </HelmetProvider>
          </SessionAuthProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </Provider>
  </React.StrictMode>
)

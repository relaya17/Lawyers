import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { I18nextProvider } from 'react-i18next'

import AppRouter from './routes'
import { store } from '@shared/store'
import { ThemeProvider } from '@/app/providers/ThemeProvider'
import i18n from './app/i18n'
import { analyticsService } from '@shared/services/analytics'

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
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <HelmetProvider>
          <I18nextProvider i18n={i18n}>
            <ThemeProvider>
              <AppRouter />
            </ThemeProvider>
          </I18nextProvider>
        </HelmetProvider>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
)

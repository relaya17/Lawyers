import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { I18nextProvider } from 'react-i18next'

import AppRouter from './routes'
import { store } from './shared/src/store'
import { theme } from './app/theme'
import i18n from './app/i18n'
import { analyticsService } from './shared/src/services/analytics'

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
      <BrowserRouter>
        <HelmetProvider>
          <I18nextProvider i18n={i18n}>
            <ThemeProvider theme={theme}>
              <CssBaseline />
              <AppRouter />
            </ThemeProvider>
          </I18nextProvider>
        </HelmetProvider>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
)

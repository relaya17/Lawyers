import React from 'react'

import { Provider as ReduxProvider } from 'react-redux'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { ThemeProvider } from '@mui/material/styles'
import { CssBaseline } from '@mui/material'
import { HelmetProvider } from 'react-helmet-async'
import { AppErrorBoundary } from '@shared/components/ui/AppErrorBoundary'
import { Toaster } from 'react-hot-toast'
import { TouchGestureProvider } from '@shared/components/ui/TouchGestureProvider'
import { AccessibilityProvider } from '@shared/components/ui/AccessibilityProvider'

import { store } from '@shared/store'
import { theme } from '../theme/index'
import { I18nProvider } from '@shared/i18n/I18nProvider'
import { AuthProvider } from './AuthProvider'

// יצירת QueryClient עם הגדרות מותאמות
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 דקות
      gcTime: 10 * 60 * 1000, // 10 דקות
      retry: (failureCount: number, error: unknown) => {
        // לא לנסות שוב על שגיאות 4xx
        if (error && typeof error === 'object' && 'response' in error) {
          const response = (error as { response?: { status?: number } }).response;
          if (response?.status && response.status >= 400 && response.status < 500) {
            return false;
          }
        }
        return failureCount < 3;
      },
    },
    mutations: {
      retry: false,
    },
  },
})

interface AppProvidersProps {
  children: React.ReactNode
}

export const AppProviders: React.FC<AppProvidersProps> = ({ children }) => {
  return (
    <AppErrorBoundary>
      <HelmetProvider>
        <ReduxProvider store={store}>
          <QueryClientProvider client={queryClient}>
            <I18nProvider>
              <AuthProvider>
                <ThemeProvider theme={theme}>
                  <CssBaseline />
                  <AccessibilityProvider>
                    <TouchGestureProvider>
                      {children}
                    </TouchGestureProvider>
                  </AccessibilityProvider>
                  <Toaster
                    position="top-center"
                    toastOptions={{
                      duration: 4000,
                      style: {
                        background: '#363636',
                        color: '#fff',
                      },
                    }}
                  />
                </ThemeProvider>
              </AuthProvider>
            </I18nProvider>
            <ReactQueryDevtools initialIsOpen={false} />
          </QueryClientProvider>
        </ReduxProvider>
      </HelmetProvider>
    </AppErrorBoundary>
  )
}

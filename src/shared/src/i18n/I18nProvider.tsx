import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { CacheProvider } from '@emotion/react'
import { createRtlCache } from '@/app/theme/index'

interface I18nProviderProps {
  children: React.ReactNode
}

export const I18nProvider: React.FC<I18nProviderProps> = ({ children }) => {
  const { i18n } = useTranslation()

  useEffect(() => {
    // קביעת שפה וכיוון ראשוני
    const currentLang = i18n.language || 'he'
    const direction = currentLang === 'he' || currentLang === 'ar' ? 'rtl' : 'ltr'
    
    document.documentElement.lang = currentLang
    document.documentElement.dir = direction
    
    // האזנה לשינויים בשפה
    const handleLanguageChanged = (lng: string) => {
      const newDirection = lng === 'he' || lng === 'ar' ? 'rtl' : 'ltr'
      document.documentElement.lang = lng
      document.documentElement.dir = newDirection
    }

    i18n.on('languageChanged', handleLanguageChanged)

    return () => {
      i18n.off('languageChanged', handleLanguageChanged)
    }
  }, [i18n])

  // יצירת cache ל-RTL אם נדרש
  const isRtl = i18n.dir() === 'rtl'
  const cache = isRtl ? createRtlCache() : undefined

  if (isRtl && cache) {
    return <CacheProvider value={cache}>{children}</CacheProvider>
  }

  return <>{children}</>
}

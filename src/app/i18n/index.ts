import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import React from 'react'
import { I18nextProvider } from 'react-i18next'
import he from './he/common.json'
import en from './en/common.json'
import ar from './ar/common.json'

const resources = { he: { common: he }, en: { common: en }, ar: { common: ar } }

const rtlLangs = new Set(['he', 'ar'])

void i18n.use(initReactI18next).init({
	resources,
	lng: localStorage.getItem('i18nextLng') || 'he',
	fallbackLng: 'he',
	defaultNS: 'common',
	ns: ['common'],
	interpolation: { escapeValue: false },
	react: { useSuspense: false },
})

export const setLanguage = async (lng: 'he' | 'en' | 'ar') => {
	await i18n.changeLanguage(lng)
	localStorage.setItem('i18nextLng', lng)
	document.documentElement.lang = lng
	document.documentElement.dir = rtlLangs.has(lng) ? 'rtl' : 'ltr'
}

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	return React.createElement(I18nextProvider, { i18n }, children)
}

export default i18n

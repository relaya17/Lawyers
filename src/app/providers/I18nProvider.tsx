import React, { useEffect } from 'react'
import '../i18n' // side-effect init
import { useSelector } from 'react-redux'
import { RootState } from '@shared/store'

interface Props { children: React.ReactNode }

export const I18nProvider: React.FC<Props> = ({ children }) => {
	const { language, direction } = useSelector((s: RootState) => s.theme)

	useEffect(() => {
		document.documentElement.lang = language
		document.documentElement.dir = direction
	}, [language, direction])

	return <>{children}</>
}

import React, { useMemo } from 'react'
import { ThemeProvider as MuiThemeProvider, CssBaseline } from '@mui/material'
import { useSelector } from 'react-redux'
import { RootState } from '@shared/store'
import { CacheProvider } from '@emotion/react'
import { createRtlCache, makeTheme } from '../theme/theme'

interface Props { children: React.ReactNode }

export const ThemeProvider: React.FC<Props> = ({ children }) => {
	const { mode, direction } = useSelector((s: RootState) => s.theme)
	const theme = useMemo(() => makeTheme(mode, direction), [mode, direction])
	const isRtl = direction === 'rtl'
	const cache = useMemo(() => (isRtl ? createRtlCache() : undefined), [isRtl])

	const content = (
		<MuiThemeProvider theme={theme}>
			<CssBaseline />
			{children}
		</MuiThemeProvider>
	)

	if (isRtl && cache) {
		return <CacheProvider value={cache}>{content}</CacheProvider>
	}
	return content
}

import { createTheme as muiCreateTheme, ThemeOptions } from '@mui/material/styles'
import { heIL, enUS } from '@mui/material/locale'
import createCache from '@emotion/cache'
import { prefixer } from 'stylis'
import rtlPlugin from 'stylis-plugin-rtl'

export const createRtlCache = () => createCache({ key: 'muirtl', stylisPlugins: [prefixer, rtlPlugin] })

const lightPalette = {
	primary: { main: '#1565c0', light: '#42a5f5', dark: '#0d47a1', contrastText: '#fff' },
	secondary: { main: '#009688', light: '#4db6ac', dark: '#00695c', contrastText: '#fff' },
	background: { default: '#fafafa', paper: '#fff' },
	text: { primary: '#212121', secondary: '#757575' },
}

const darkPalette = {
	primary: { main: '#90caf9', light: '#e3f2fd', dark: '#42a5f5', contrastText: '#000' },
	secondary: { main: '#80cbc4', light: '#e0f2f1', dark: '#4db6ac', contrastText: '#000' },
	background: { default: '#121212', paper: '#1e1e1e' },
	text: { primary: '#fff', secondary: '#b3b3b3' },
}

const components: ThemeOptions['components'] = {
	MuiButton: { defaultProps: { disableElevation: true }, styleOverrides: { root: { minHeight: 44, borderRadius: 8 } } },
	MuiTextField: { defaultProps: { variant: 'outlined' } },
}

export const makeTheme = (mode: 'light' | 'dark', direction: 'ltr' | 'rtl') =>
	muiCreateTheme({
		direction,
		palette: { mode, ...(mode === 'light' ? lightPalette : darkPalette) },
		shape: { borderRadius: 8 },
		breakpoints: { values: { xs: 0, sm: 600, md: 900, lg: 1200, xl: 1536 } },
		components,
	}, direction === 'rtl' ? heIL : enUS)

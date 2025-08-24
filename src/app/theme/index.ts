import { createTheme, ThemeOptions } from '@mui/material/styles'
import { heIL, enUS, arEG } from '@mui/material/locale'
import { CacheProvider } from '@emotion/react'
import createCache from '@emotion/cache'
import { prefixer } from 'stylis'
import rtlPlugin from 'stylis-plugin-rtl'

// יצירת cache ל-RTL
export const createRtlCache = () => {
    return createCache({
        key: 'muirtl',
        stylisPlugins: [prefixer, rtlPlugin],
    })
}

// פלטת צבעים מותאמת לנגישות (WCAG 2.2 AA)
const lightPalette = {
    primary: {
        main: '#1565c0', // כחול כהה - ניגודיות גבוהה
        light: '#42a5f5',
        dark: '#0d47a1',
        contrastText: '#ffffff',
    },
    secondary: {
        main: '#009688', // טורקיז - ניגודיות גבוהה
        light: '#4db6ac',
        dark: '#00695c',
        contrastText: '#ffffff',
    },
    error: {
        main: '#d32f2f',
        light: '#ef5350',
        dark: '#c62828',
    },
    warning: {
        main: '#ed6c02',
        light: '#ff9800',
        dark: '#e65100',
    },
    info: {
        main: '#0288d1',
        light: '#03a9f4',
        dark: '#01579b',
    },
    success: {
        main: '#2e7d32',
        light: '#4caf50',
        dark: '#1b5e20',
    },
    background: {
        default: '#fafafa',
        paper: '#ffffff',
    },
    text: {
        primary: '#212121',
        secondary: '#757575',
    },
}

const darkPalette = {
    primary: {
        main: '#90caf9',
        light: '#e3f2fd',
        dark: '#42a5f5',
        contrastText: '#000000',
    },
    secondary: {
        main: '#80cbc4',
        light: '#e0f2f1',
        dark: '#4db6ac',
        contrastText: '#000000',
    },
    error: {
        main: '#f44336',
        light: '#e57373',
        dark: '#d32f2f',
    },
    warning: {
        main: '#ffa726',
        light: '#ffb74d',
        dark: '#f57c00',
    },
    info: {
        main: '#29b6f6',
        light: '#4fc3f7',
        dark: '#0288d1',
    },
    success: {
        main: '#66bb6a',
        light: '#81c784',
        dark: '#388e3c',
    },
    background: {
        default: '#121212',
        paper: '#1e1e1e',
    },
    text: {
        primary: '#ffffff',
        secondary: '#b3b3b3',
    },
}

// הגדרות טיפוגרפיה מותאמות
const typography = {
    fontFamily: [
        'Roboto',
        'Alef',
        'Arial',
        'Helvetica',
        'sans-serif',
    ].join(','),
    h1: {
        fontSize: '2.5rem',
        fontWeight: 600,
        lineHeight: 1.2,
    },
    h2: {
        fontSize: '2rem',
        fontWeight: 600,
        lineHeight: 1.3,
    },
    h3: {
        fontSize: '1.75rem',
        fontWeight: 600,
        lineHeight: 1.4,
    },
    h4: {
        fontSize: '1.5rem',
        fontWeight: 600,
        lineHeight: 1.4,
    },
    h5: {
        fontSize: '1.25rem',
        fontWeight: 600,
        lineHeight: 1.5,
    },
    h6: {
        fontSize: '1rem',
        fontWeight: 600,
        lineHeight: 1.5,
    },
    body1: {
        fontSize: '1rem',
        lineHeight: 1.6,
    },
    body2: {
        fontSize: '0.875rem',
        lineHeight: 1.6,
    },
    button: {
        textTransform: 'none' as const,
        fontWeight: 600,
    },
}

// הגדרות רכיבים מותאמות
const components: ThemeOptions['components'] = {
    MuiButton: {
        defaultProps: {
            disableElevation: true,
        },
        styleOverrides: {
            root: {
                borderRadius: 8,
                padding: '8px 16px',
                minHeight: 44, // נגישות - גודל מינימלי למגע
            },
            contained: {
                boxShadow: 'none',
                '&:hover': {
                    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                },
            },
        },
    },
    MuiTextField: {
        defaultProps: {
            variant: 'outlined',
        },
        styleOverrides: {
            root: {
                '& .MuiOutlinedInput-root': {
                    borderRadius: 8,
                },
            },
        },
    },
    MuiCard: {
        styleOverrides: {
            root: {
                borderRadius: 12,
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            },
        },
    },
    MuiAppBar: {
        styleOverrides: {
            root: {
                boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
            },
        },
    },
    MuiDrawer: {
        styleOverrides: {
            paper: {
                borderRight: 'none',
            },
        },
    },
    MuiLink: {
        defaultProps: {
            underline: 'hover',
        },
    },
    MuiChip: {
        styleOverrides: {
            root: {
                borderRadius: 16,
            },
        },
    },
}

// יצירת תמה מותאמת
export const makeTheme = (mode: 'light' | 'dark', direction: 'ltr' | 'rtl') => {
    const palette = mode === 'light' ? lightPalette : darkPalette

    return createTheme({
        direction,
        palette: {
            mode,
            ...palette,
        },
        typography,
        components,
        shape: {
            borderRadius: 8,
        },
        breakpoints: {
            values: {
                xs: 0,
                sm: 600,
                md: 900,
                lg: 1200,
                xl: 1536,
            },
        },
    }, direction === 'rtl' ? heIL : enUS)
}

// תמה ברירת מחדל
export const theme = makeTheme('light', 'ltr')

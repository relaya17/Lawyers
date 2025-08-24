import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export type ThemeMode = 'light' | 'dark'
export type Direction = 'ltr' | 'rtl'

export interface ThemeState {
    mode: ThemeMode
    direction: Direction
    language: string
}

const getInitialTheme = (): ThemeState => {
    const savedMode = localStorage.getItem('themeMode') as ThemeMode
    const savedDirection = localStorage.getItem('direction') as Direction
    const savedLanguage = localStorage.getItem('i18nextLng') || 'he'

    return {
        mode: savedMode || 'light',
        direction: savedDirection || (savedLanguage === 'he' || savedLanguage === 'ar' ? 'rtl' : 'ltr'),
        language: savedLanguage,
    }
}

const themeSlice = createSlice({
    name: 'theme',
    initialState: getInitialTheme(),
    reducers: {
        setMode: (state, action: PayloadAction<ThemeMode>) => {
            state.mode = action.payload
            localStorage.setItem('themeMode', action.payload)
        },
        setDirection: (state, action: PayloadAction<Direction>) => {
            state.direction = action.payload
            localStorage.setItem('direction', action.payload)
        },
        setLanguage: (state, action: PayloadAction<string>) => {
            state.language = action.payload
            // כיוון השפה נקבע אוטומטית לפי השפה
            const newDirection = action.payload === 'he' || action.payload === 'ar' ? 'rtl' : 'ltr'
            state.direction = newDirection
            localStorage.setItem('direction', newDirection)
        },
        toggleMode: (state) => {
            const newMode = state.mode === 'light' ? 'dark' : 'light'
            state.mode = newMode
            localStorage.setItem('themeMode', newMode)
        },
    },
})

export const {
    setMode,
    setDirection,
    setLanguage,
    toggleMode,
} = themeSlice.actions

export default themeSlice.reducer

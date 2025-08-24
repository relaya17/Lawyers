import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface UIState {
    sidebarOpen: boolean
    mobileMenuOpen: boolean
    loadingOverlay: boolean
    notifications: Notification[]
    consentBannerShown: boolean
}

export interface Notification {
    id: string
    type: 'success' | 'error' | 'warning' | 'info'
    title: string
    message: string
    duration?: number
    timestamp: number
}

const initialState: UIState = {
    sidebarOpen: false,
    mobileMenuOpen: false,
    loadingOverlay: false,
    notifications: [],
    consentBannerShown: localStorage.getItem('consentBannerShown') === 'true',
}

const uiSlice = createSlice({
    name: 'ui',
    initialState,
    reducers: {
        toggleSidebar: (state) => {
            state.sidebarOpen = !state.sidebarOpen
        },
        setSidebarOpen: (state, action: PayloadAction<boolean>) => {
            state.sidebarOpen = action.payload
        },
        toggleMobileMenu: (state) => {
            state.mobileMenuOpen = !state.mobileMenuOpen
        },
        setMobileMenuOpen: (state, action: PayloadAction<boolean>) => {
            state.mobileMenuOpen = action.payload
        },
        setLoadingOverlay: (state, action: PayloadAction<boolean>) => {
            state.loadingOverlay = action.payload
        },
        addNotification: (state, action: PayloadAction<Omit<Notification, 'id' | 'timestamp'>>) => {
            const notification: Notification = {
                ...action.payload,
                id: Date.now().toString(),
                timestamp: Date.now(),
            }
            state.notifications.push(notification)
        },
        removeNotification: (state, action: PayloadAction<string>) => {
            state.notifications = state.notifications.filter(
                (notification) => notification.id !== action.payload
            )
        },
        clearNotifications: (state) => {
            state.notifications = []
        },
        setConsentBannerShown: (state, action: PayloadAction<boolean>) => {
            state.consentBannerShown = action.payload
            localStorage.setItem('consentBannerShown', action.payload.toString())
        },
    },
})

export const {
    toggleSidebar,
    setSidebarOpen,
    toggleMobileMenu,
    setMobileMenuOpen,
    setLoadingOverlay,
    addNotification,
    removeNotification,
    clearNotifications,
    setConsentBannerShown,
} = uiSlice.actions

export default uiSlice.reducer

import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'

import authReducer from './slices/authSlice'
import uiReducer from './slices/uiSlice'
import themeReducer from './slices/themeSlice'
import advancedReducer from './advancedSlice'

export const store = configureStore({
    reducer: {
        auth: authReducer,
        ui: uiReducer,
        theme: themeReducer,
        advanced: advancedReducer,
    },

    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
                ignoredPaths: ['advanced.lastSync'],
            },
        }),

    devTools: typeof process !== 'undefined'
        ? process.env.NODE_ENV !== 'production'
        : true,
})

setupListeners(store.dispatch)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

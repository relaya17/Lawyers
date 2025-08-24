import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'

import { authApi } from '../services/api/authApi'
// API services are initialized in main.tsx
import { simulatorApi } from '../services/api/simulatorApi'
import { riskAnalysisApi } from '../services/api/riskAnalysisApi'

import authReducer from './slices/authSlice'
import uiReducer from './slices/uiSlice'
import themeReducer from './slices/themeSlice'
import advancedReducer from './advancedSlice'
import marketplaceReducer from '../../../features/marketplace/store/marketplaceSlice'

export const store = configureStore({
    reducer: {
        auth: authReducer,
        ui: uiReducer,
        theme: themeReducer,
        advanced: advancedReducer,
        marketplace: marketplaceReducer,

        // API slices
        [authApi.reducerPath]: authApi.reducer,
        [simulatorApi.reducerPath]: simulatorApi.reducer,
        [riskAnalysisApi.reducerPath]: riskAnalysisApi.reducer,
    },

    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
                ignoredPaths: ['advanced.lastSync'],
            },
        }).concat(
            authApi.middleware,
            simulatorApi.middleware,
            riskAnalysisApi.middleware
        ),

    devTools: import.meta.env.MODE !== 'production',
})

// הגדרת listeners עבור RTK Query
setupListeners(store.dispatch)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

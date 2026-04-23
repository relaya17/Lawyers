import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'

import { authApi } from '@/services/api/authApi'
import { simulatorApi } from '@/services/api/simulatorApi'
import { riskAnalysisApi } from '@/services/api/riskAnalysisApi'

import authReducer from '@shared/store/slices/authSlice'
import uiReducer from '@shared/store/slices/uiSlice'
import themeReducer from '@shared/store/slices/themeSlice'
import advancedReducer from '@shared/store/advancedSlice'
import marketplaceReducer from '@/features/marketplace/store/marketplaceSlice'

export const store = configureStore({
    reducer: {
        auth: authReducer,
        ui: uiReducer,
        theme: themeReducer,
        advanced: advancedReducer,
        marketplace: marketplaceReducer,

        // RTK Query API slices
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
            riskAnalysisApi.middleware,
        ),

    devTools: import.meta.env.MODE !== 'production',
})

setupListeners(store.dispatch)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

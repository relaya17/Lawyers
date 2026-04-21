import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit'

export interface User {
    id: string
    email: string
    firstName: string
    lastName: string
    role: 'student' | 'lawyer' | 'lecturer' | 'admin'
    phone?: string
    avatar?: string
    isActive: boolean
    createdAt: string
    updatedAt: string
}

export interface LoginCredentials {
    email: string
    password: string
}

export interface RegisterCredentials {
    email: string
    password: string
    firstName: string
    lastName: string
    phone?: string
    company?: string
}

export interface AuthState {
    user: User | null
    token: string | null
    refreshToken: string | null
    isAuthenticated: boolean
    isLoading: boolean
    error: string | null
}

// Mock API functions
const mockLoginAPI = async (credentials: LoginCredentials): Promise<{ user: User; token: string; refreshToken: string }> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Mock response
    return {
        user: {
            id: '1',
            email: credentials.email,
            firstName: 'יוסי',
            lastName: 'כהן',
            role: 'lawyer',
            phone: '+972-50-123-4567',
            avatar: '',
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        },
        token: 'mock-jwt-token',
        refreshToken: 'mock-refresh-token'
    }
}

const mockRegisterAPI = async (credentials: RegisterCredentials): Promise<{ user: User; token: string; refreshToken: string }> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Mock response
    return {
        user: {
            id: '1',
            email: credentials.email,
            firstName: credentials.firstName,
            lastName: credentials.lastName,
            role: 'lawyer',
            phone: credentials.phone,
            avatar: '',
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        },
        token: 'mock-jwt-token',
        refreshToken: 'mock-refresh-token'
    }
}

// Async thunks
const login = createAsyncThunk(
    'auth/login',
    async (credentials: LoginCredentials, { rejectWithValue }) => {
        try {
            const response = await mockLoginAPI(credentials)
            return response
        } catch (error) {
            return rejectWithValue('שגיאה בהתחברות')
        }
    }
)

const register = createAsyncThunk(
    'auth/register',
    async (credentials: RegisterCredentials, { rejectWithValue }) => {
        try {
            const response = await mockRegisterAPI(credentials)
            return response
        } catch (error) {
            return rejectWithValue('שגיאה בהרשמה')
        }
    }
)

const initialState: AuthState = {
    user: null,
    token: localStorage.getItem('token'),
    refreshToken: localStorage.getItem('refreshToken'),
    isAuthenticated: false,
    isLoading: false,
    error: null,
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state) => {
            state.user = null
            state.token = null
            state.refreshToken = null
            state.isAuthenticated = false
            state.isLoading = false
            state.error = null

            // מחיקה מ-localStorage
            localStorage.removeItem('token')
            localStorage.removeItem('refreshToken')
        },
        updateUser: (state, action: PayloadAction<Partial<User>>) => {
            if (state.user) {
                state.user = { ...state.user, ...action.payload }
            }
        },
        setToken: (state, action: PayloadAction<string>) => {
            state.token = action.payload
            localStorage.setItem('token', action.payload)
        },
        clearError: (state) => {
            state.error = null
        },
    },
    extraReducers: (builder) => {
        // Login
        builder
            .addCase(login.pending, (state) => {
                state.isLoading = true
                state.error = null
            })
            .addCase(login.fulfilled, (state, action) => {
                state.isLoading = false
                state.isAuthenticated = true
                state.user = action.payload.user
                state.token = action.payload.token
                state.refreshToken = action.payload.refreshToken
                state.error = null

                // שמירה ב-localStorage
                localStorage.setItem('token', action.payload.token)
                localStorage.setItem('refreshToken', action.payload.refreshToken)
            })
            .addCase(login.rejected, (state, action) => {
                state.isLoading = false
                state.isAuthenticated = false
                state.user = null
                state.token = null
                state.refreshToken = null
                state.error = action.payload as string

                // מחיקה מ-localStorage
                localStorage.removeItem('token')
                localStorage.removeItem('refreshToken')
            })

        // Register
        builder
            .addCase(register.pending, (state) => {
                state.isLoading = true
                state.error = null
            })
            .addCase(register.fulfilled, (state, action) => {
                state.isLoading = false
                state.isAuthenticated = true
                state.user = action.payload.user
                state.token = action.payload.token
                state.refreshToken = action.payload.refreshToken
                state.error = null

                // שמירה ב-localStorage
                localStorage.setItem('token', action.payload.token)
                localStorage.setItem('refreshToken', action.payload.refreshToken)
            })
            .addCase(register.rejected, (state, action) => {
                state.isLoading = false
                state.isAuthenticated = false
                state.user = null
                state.token = null
                state.refreshToken = null
                state.error = action.payload as string

                // מחיקה מ-localStorage
                localStorage.removeItem('token')
                localStorage.removeItem('refreshToken')
            })
    },
})

export const {
    logout,
    updateUser,
    setToken,
    clearError,
} = authSlice.actions

// Export async thunks
export { login, register }

export default authSlice.reducer

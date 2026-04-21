import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export interface LoginRequest {
    email: string
    password: string
}

export interface RegisterRequest {
    email: string
    password: string
    firstName: string
    lastName: string
    role: 'student' | 'lawyer' | 'lecturer' | 'admin'
    phone?: string
}

export interface AuthResponse {
    user: {
        id: string
        email: string
        firstName: string
        lastName: string
        role: string
        phone?: string
        avatar?: string
        isActive: boolean
        createdAt: string
        updatedAt: string
    }
    token: string
    refreshToken: string
}

export const authApi = createApi({
    reducerPath: 'authApi',
    baseQuery: fetchBaseQuery({
        baseUrl: '/api/auth',
        prepareHeaders: (headers, { getState }) => {
            const token = (getState() as { auth: { token: string } }).auth.token
            if (token) {
                headers.set('authorization', `Bearer ${token}`)
            }
            return headers
        },
    }),
    endpoints: (builder) => ({
        login: builder.mutation<AuthResponse, LoginRequest>({
            query: (credentials) => ({
                url: '/login',
                method: 'POST',
                body: credentials,
            }),
        }),
        register: builder.mutation<AuthResponse, RegisterRequest>({
            query: (userData) => ({
                url: '/register',
                method: 'POST',
                body: userData,
            }),
        }),
        refreshToken: builder.mutation<{ token: string }, { refreshToken: string }>({
            query: (refreshData) => ({
                url: '/refresh',
                method: 'POST',
                body: refreshData,
            }),
        }),
        logout: builder.mutation<void, void>({
            query: () => ({
                url: '/logout',
                method: 'POST',
            }),
        }),
        getProfile: builder.query<AuthResponse['user'], void>({
            query: () => '/profile',
        }),
    }),
})

export const {
    useLoginMutation,
    useRegisterMutation,
    useRefreshTokenMutation,
    useLogoutMutation,
    useGetProfileQuery,
} = authApi

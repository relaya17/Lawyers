import { useSelector, useDispatch } from 'react-redux'
import { useCallback } from 'react'
import { RootState } from '@shared/store'
import { login, register, logout } from '@shared/store/slices/authSlice'

export interface UseAuthResult {
    user: { id: string; email: string; role: string; firstName: string; lastName: string } | null
    isAuthenticated: boolean
    isLoading: boolean
    error: string | null
    login: (credentials: { email: string; password: string }) => Promise<void>
    register: (credentials: { email: string; password: string; firstName: string; lastName: string; phone?: string; company?: string }) => Promise<void>
    logout: () => void
    refreshToken: () => Promise<void>
    hasRole: (role: string) => boolean
    hasPermission: (permission: string) => boolean
}

export const useAuth = (): UseAuthResult => {
    const dispatch = useDispatch()
    const auth = useSelector((state: RootState) => state.auth)

    const handleLogin = useCallback(async (credentials: { email: string; password: string }) => {
        await dispatch(login(credentials) as any).unwrap()
    }, [dispatch])

    const handleRegister = useCallback(async (credentials: { email: string; password: string; firstName: string; lastName: string; phone?: string; company?: string }) => {
        await dispatch(register(credentials) as any).unwrap()
    }, [dispatch])

    const handleLogout = useCallback(() => {
        dispatch(logout())
    }, [dispatch])

    const handleRefreshToken = useCallback(async () => {
        // TODO: Implement refresh token logic
        console.log('Refresh token not implemented yet')
    }, [])

    const hasRole = useCallback((role: string): boolean => {
        return auth.user?.role === role
    }, [auth.user])

    const hasPermission = useCallback((permission: string): boolean => {
        // Mock permissions based on role
        const permissions = {
            student: ['read', 'practice', 'learn'],
            lawyer: ['read', 'write', 'delete', 'approve', 'manage'],
            lecturer: ['read', 'write', 'grade', 'manage'],
            admin: ['read', 'write', 'delete', 'approve', 'manage', 'admin']
        }

        const userRole = auth.user?.role
        return userRole ? permissions[userRole as keyof typeof permissions]?.includes(permission) || false : false
    }, [auth.user])

    return {
        user: auth.user,
        isAuthenticated: auth.isAuthenticated,
        isLoading: auth.isLoading,
        error: auth.error,
        login: handleLogin,
        register: handleRegister,
        logout: handleLogout,
        refreshToken: handleRefreshToken,
        hasRole,
        hasPermission
    }
}

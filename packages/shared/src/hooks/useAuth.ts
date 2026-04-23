import { useSelector } from 'react-redux'
import { useCallback } from 'react'
import type { RootState } from '../store'

/**
 * קריאת מצב אימות מ-Redux בלבד.
 * לפעולות התחברות/הרשמה/התנתקות השתמשו ב־`useSessionAuth` מהאפליקציה (apps/web).
 */
export interface UseAuthResult {
  user: RootState['auth']['user']
  accessToken: string | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  hasRole: (role: string) => boolean
  hasPermission: (permission: string) => boolean
}

export const useAuth = (): UseAuthResult => {
  const auth = useSelector((state: RootState) => state.auth)

  const hasRole = useCallback(
    (role: string): boolean => {
      return auth.user?.role === role
    },
    [auth.user],
  )

  const hasPermission = useCallback(
    (permission: string): boolean => {
      const permissions: Record<string, string[]> = {
        student: ['read', 'practice', 'learn'],
        lawyer: ['read', 'write', 'delete', 'approve', 'manage'],
        lecturer: ['read', 'write', 'grade', 'manage'],
        admin: ['read', 'write', 'delete', 'approve', 'manage', 'admin'],
      }
      const userRole = auth.user?.role
      return userRole
        ? permissions[userRole]?.includes(permission) || false
        : false
    },
    [auth.user],
  )

  return {
    user: auth.user,
    accessToken: auth.accessToken,
    isAuthenticated: auth.isAuthenticated,
    isLoading: auth.isLoading,
    error: auth.error,
    hasRole,
    hasPermission,
  }
}

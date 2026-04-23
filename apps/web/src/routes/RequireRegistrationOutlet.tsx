import React from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import type { RootState } from '@/store'

/** מסלולים ציבוריים בלבד בלי הרשמה — ראו AppRouter */
export function RequireRegistrationOutlet(): React.ReactElement {
  const { isAuthenticated } = useSelector((s: RootState) => s.auth)
  const location = useLocation()

  if (!isAuthenticated) {
    const next = encodeURIComponent(`${location.pathname}${location.search}`)
    return <Navigate to={`/register?next=${next}`} replace />
  }

  return <Outlet />
}

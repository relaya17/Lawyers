import React from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import type { RootState } from '@/store'

/**
 * חובת הרשמה: משתמש שאינו מאומת מופנה ל-/register?next=<path>.
 * שומרים על דפים פתוחים מעטפת זו (Home / Landing / Pricing / Login / Register).
 */
export const RequireRegistration: React.FC = () => {
  const { isAuthenticated } = useSelector((s: RootState) => s.auth)
  const location = useLocation()

  if (isAuthenticated) return <Outlet />

  const next = `${location.pathname}${location.search}${location.hash}`
  const target = `/register?next=${encodeURIComponent(next)}`
  return <Navigate to={target} replace />
}

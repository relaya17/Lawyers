import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'
import type { RootState } from '@/store'

export const PrivateRoute: React.FC = () => {
	const { isAuthenticated } = useSelector((s: RootState) => s.auth)
	return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />
}

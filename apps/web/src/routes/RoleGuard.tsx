import React from 'react'
import { Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { RootState } from '@shared/store'

type Role = 'student' | 'lawyer' | 'lecturer' | 'admin'

interface Props { allowed: Role[]; children: React.ReactElement }

export const RoleGuard: React.FC<Props> = ({ allowed, children }) => {
	const user = useSelector((s: RootState) => s.auth.user)
	if (!user) return <Navigate to="/login" replace />
	if (!allowed.includes(user.role)) return <Navigate to="/" replace />
	return children
}

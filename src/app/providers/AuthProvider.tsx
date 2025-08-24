import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@shared/store'

interface Props { children: React.ReactNode }

export const AuthProvider: React.FC<Props> = ({ children }) => {
	const dispatch = useDispatch()
	const { token } = useSelector((s: RootState) => s.auth)

	useEffect(() => {
		// ניתן להוסיף כאן רענון טוקן/פרופיל בהמשך
	}, [dispatch, token])

	return <>{children}</>
}

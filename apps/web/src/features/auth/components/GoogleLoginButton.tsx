import React, { useState } from 'react'
import { GoogleLogin } from '@react-oauth/google'
import { Box, Alert, Typography } from '@mui/material'
import { useSessionAuth } from '../providers/SessionAuthProvider'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { safeNextPath } from '@/utils/safeNextPath'

interface GoogleLoginButtonProps {
  redirectOnSuccess?: boolean
}

export const GoogleLoginButton: React.FC<GoogleLoginButtonProps> = ({
  redirectOnSuccess = true,
}) => {
  const { signInWithGoogle } = useSessionAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [error, setError] = useState<string | null>(null)

  const handleSuccess = async (credentialResponse: { credential?: string }) => {
    setError(null)
    if (!credentialResponse.credential) {
      setError('לא התקבל token מגוגל')
      return
    }
    try {
      await signInWithGoogle(credentialResponse.credential)
      if (redirectOnSuccess) {
        const nextRaw = searchParams.get('next') ?? searchParams.get('redirect')
        navigate(safeNextPath(nextRaw), { replace: true })
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'התחברות עם גוגל נכשלה')
    }
  }

  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID

  if (!clientId) {
    return null
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
      {error && (
        <Alert severity="error" sx={{ width: '100%', mb: 1 }}>
          {error}
        </Alert>
      )}
      <GoogleLogin
        onSuccess={handleSuccess}
        onError={() => setError('התחברות עם גוגל נכשלה — נסה שוב')}
        shape="rectangular"
        size="large"
        width="360"
        text="signin_with"
        logo_alignment="left"
      />
      <Typography variant="caption" color="text.secondary">
        ההתחברות מאובטחת ומוצפנת על ידי Google
      </Typography>
    </Box>
  )
}

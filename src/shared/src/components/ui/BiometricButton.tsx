import React, { useState } from 'react'
import { Button, CircularProgress, Tooltip, Alert, Dialog, DialogTitle, DialogContent, DialogActions, Typography, Box } from '@mui/material'
import { Face, Fingerprint, Security, CheckCircle, Error } from '@mui/icons-material'
import { useTranslation } from 'react-i18next'
import { useBiometric } from '@shared/hooks/useBiometric'
import { useSelector } from 'react-redux'
import { RootState } from '@shared/store'

interface BiometricButtonProps {
    onSuccess?: (token: string) => void
    onError?: (error: string) => void
    variant?: 'contained' | 'outlined' | 'text'
    size?: 'small' | 'medium' | 'large'
    fullWidth?: boolean
    disabled?: boolean
    showSetupDialog?: boolean
    promptMessage?: string
}

export const BiometricButton: React.FC<BiometricButtonProps> = ({
    onSuccess,
    onError,
    variant = 'contained',
    size = 'medium',
    fullWidth = false,
    disabled = false,
    showSetupDialog = true,
    promptMessage
}) => {
    const { t } = useTranslation()
    const user = useSelector((state: RootState) => state.auth.user)
    
    const {
        biometricState,
        deviceInfo,
        setupBiometric,
        authenticate,
        removeCredentials,
        isSupported,
        isEnrolled,
        biometricType,
        isLoading,
        error
    } = useBiometric()

    const [showSetupModal, setShowSetupModal] = useState(false)
    const [setupLoading, setSetupLoading] = useState(false)
    const [setupError, setSetupError] = useState<string | null>(null)
    const [setupSuccess, setSetupSuccess] = useState(false)

    // Get appropriate icon based on biometric type
    const getBiometricIcon = () => {
        if (biometricType === 'face_id') {
            return <Face />
        }
        return <Fingerprint />
    }

    // Get button text based on state
    const getButtonText = () => {
        if (isLoading) {
            return t('biometric.authenticating')
        }
        
        if (!isSupported) {
            return t('biometric.notSupported')
        }
        
        if (!isEnrolled) {
            return t('biometric.setupRequired')
        }
        
        if (biometricType === 'face_id') {
            return t('biometric.useFaceID')
        }
        
        return t('biometric.useTouchID')
    }

    // Handle authentication
    const handleAuthenticate = async () => {
        if (!user?.id) {
            onError?.(t('biometric.userNotLoggedIn'))
            return
        }

        try {
            const response = await authenticate(user.id, {
                promptMessage: promptMessage || t('biometric.authPrompt'),
                cancelButtonText: t('biometric.cancel'),
                fallbackButtonText: t('biometric.usePassword')
            })

            if (response.success && response.token) {
                onSuccess?.(response.token)
            } else {
                onError?.(response.error || t('biometric.authenticationError'))
            }
        } catch (error: unknown) {
            const errorMessage = error && typeof error === 'object' && 'message' in error 
                ? (error as { message: string }).message 
                : t('biometric.authenticationError')
            onError?.(errorMessage)
        }
    }

    // Handle setup
    const handleSetup = async () => {
        if (!user?.id) {
            setSetupError(t('biometric.userNotLoggedIn'))
            return
        }

        setSetupLoading(true)
        setSetupError(null)

        try {
            const response = await setupBiometric(user.id)

            if (response.success) {
                setSetupSuccess(true)
                setTimeout(() => {
                    setShowSetupModal(false)
                    setSetupSuccess(false)
                }, 2000)
            } else {
                setSetupError(response.error || t('biometric.setupError'))
            }
        } catch (error: unknown) {
            const errorMessage = error && typeof error === 'object' && 'message' in error 
                ? (error as { message: string }).message 
                : t('biometric.setupError')
            setSetupError(errorMessage)
        } finally {
            setSetupLoading(false)
        }
    }

    // Handle remove credentials
    const handleRemoveCredentials = async () => {
        if (!user?.id) return

        try {
            await removeCredentials(user.id)
            setShowSetupModal(false)
        } catch (error) {
            console.error('Error removing credentials:', error)
        }
    }

    // Show setup dialog if needed
    const handleClick = () => {
        if (!isSupported) {
            onError?.(t('biometric.notSupported'))
            return
        }

        if (!isEnrolled && showSetupDialog) {
            setShowSetupModal(true)
        } else if (isEnrolled) {
            handleAuthenticate()
        }
    }

    // Determine if button should be disabled
    const isButtonDisabled = disabled || isLoading || !user?.id

    return (
        <>
            <Tooltip title={getButtonText()}>
                <span>
                    <Button
                        variant={variant}
                        size={size}
                        fullWidth={fullWidth}
                        disabled={isButtonDisabled}
                        onClick={handleClick}
                        startIcon={isLoading ? <CircularProgress size={20} /> : getBiometricIcon()}
                        sx={{
                            minWidth: 120,
                            ...(biometricType === 'face_id' && {
                                background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                                '&:hover': {
                                    background: 'linear-gradient(45deg, #1976D2 30%, #00BCD4 90%)'
                                }
                            }),
                            ...(biometricType === 'touch_id' && {
                                background: 'linear-gradient(45deg, #4CAF50 30%, #8BC34A 90%)',
                                '&:hover': {
                                    background: 'linear-gradient(45deg, #388E3C 30%, #689F38 90%)'
                                }
                            })
                        }}
                    >
                        {getButtonText()}
                    </Button>
                </span>
            </Tooltip>

            {/* Setup Dialog */}
            <Dialog
                open={showSetupModal}
                onClose={() => setShowSetupModal(false)}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>
                    <Box display="flex" alignItems="center" gap={1}>
                        <Security color="primary" />
                        <Typography variant="h6">
                            {t('biometric.setupTitle')}
                        </Typography>
                    </Box>
                </DialogTitle>
                
                <DialogContent>
                    {setupSuccess ? (
                        <Box textAlign="center" py={2}>
                            <CheckCircle color="success" sx={{ fontSize: 60, mb: 2 }} />
                            <Typography variant="h6" color="success.main" gutterBottom>
                                {t('biometric.setupSuccess')}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {t('biometric.setupSuccessMessage')}
                            </Typography>
                        </Box>
                    ) : (
                        <>
                            {setupError && (
                                <Alert severity="error" sx={{ mb: 2 }}>
                                    {setupError}
                                </Alert>
                            )}

                            <Typography variant="body1" gutterBottom>
                                {t('biometric.setupDescription')}
                            </Typography>

                            {deviceInfo && (
                                <Box mt={2} p={2} bgcolor="grey.50" borderRadius={1}>
                                    <Typography variant="subtitle2" gutterBottom>
                                        {t('biometric.deviceInfo')}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {t('biometric.device')}: {deviceInfo.deviceName}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {t('biometric.osVersion')}: {deviceInfo.osVersion}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {t('biometric.type')}: {t(`biometric.${deviceInfo.biometricType}`)}
                                    </Typography>
                                </Box>
                            )}

                            <Box mt={2}>
                                <Typography variant="body2" color="text.secondary">
                                    {t('biometric.setupInstructions')}
                                </Typography>
                            </Box>
                        </>
                    )}
                </DialogContent>

                <DialogActions>
                    {!setupSuccess && (
                        <>
                            <Button
                                onClick={() => setShowSetupModal(false)}
                                disabled={setupLoading}
                            >
                                {t('biometric.cancel')}
                            </Button>
                            
                            {isEnrolled && (
                                <Button
                                    onClick={handleRemoveCredentials}
                                    color="error"
                                    disabled={setupLoading}
                                >
                                    {t('biometric.remove')}
                                </Button>
                            )}
                            
                            <Button
                                onClick={handleSetup}
                                variant="contained"
                                disabled={setupLoading}
                                startIcon={setupLoading ? <CircularProgress size={20} /> : getBiometricIcon()}
                            >
                                {setupLoading ? t('biometric.settingUp') : t('biometric.setup')}
                            </Button>
                        </>
                    )}
                </DialogActions>
            </Dialog>
        </>
    )
}

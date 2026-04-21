import { useState, useEffect, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { RootState } from '@shared/store'
import BiometricService from '@shared/services/biometricService'
import {
    BiometricAuthRequest,
    BiometricAuthResponse,
    BiometricSetupRequest,
    BiometricSetupResponse,
    BiometricDeviceInfo,
    BiometricAuthOptions,
    BiometricAuthState,
    BiometricType
} from '../types/biometricTypes'

export interface UseBiometricResult {
    // State
    biometricState: BiometricAuthState
    deviceInfo: BiometricDeviceInfo | null

    // Actions
    initialize: () => Promise<boolean>
    setupBiometric: (userId: string) => Promise<BiometricSetupResponse>
    authenticate: (userId: string, options?: BiometricAuthOptions) => Promise<BiometricAuthResponse>
    removeCredentials: (userId: string) => Promise<boolean>

    // Utilities
    isSupported: boolean
    isEnrolled: boolean
    biometricType: BiometricType | null
    isLoading: boolean
    error: string | null
}

export const useBiometric = (): UseBiometricResult => {
    const { t } = useTranslation()
    const user = useSelector((state: RootState) => state.auth.user)

    const [biometricState, setBiometricState] = useState<BiometricAuthState>({
        isAvailable: false,
        isEnrolled: false,
        isSupported: false,
        biometricType: null,
        platform: null,
        deviceInfo: null,
        isAuthenticating: false,
        error: null
    })

    const [deviceInfo, setDeviceInfo] = useState<BiometricDeviceInfo | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const biometricService = BiometricService.getInstance()

    // Initialize biometric service
    const initialize = useCallback(async (): Promise<boolean> => {
        try {
            setIsLoading(true)
            setError(null)

            const isInitialized = await biometricService.initialize()
            if (!isInitialized) {
                setError(t('biometric.notSupported'))
                return false
            }

            const deviceInfo = await biometricService.getDeviceInfo()
            if (!deviceInfo) {
                setError(t('biometric.deviceNotSupported'))
                return false
            }

            const isSupported = await biometricService.isSupported()
            const isEnrolled = await biometricService.isEnrolled()

            setDeviceInfo(deviceInfo)
            setBiometricState({
                isAvailable: deviceInfo.isAvailable,
                isEnrolled,
                isSupported,
                biometricType: deviceInfo.biometricType,
                platform: deviceInfo.platform,
                deviceInfo,
                isAuthenticating: false,
                error: null
            })

            return true
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : t('biometric.initializationError')
            setError(errorMessage)
            return false
        } finally {
            setIsLoading(false)
        }
    }, [biometricService, t])

    // Setup biometric authentication
    const setupBiometric = useCallback(async (userId: string): Promise<BiometricSetupResponse> => {
        try {
            setIsLoading(true)
            setError(null)

            if (!deviceInfo) {
                const initialized = await initialize()
                if (!initialized) {
                    return {
                        success: false,
                        error: t('biometric.deviceNotSupported'),
                        setupComplete: false
                    }
                }
            }

            const setupRequest: BiometricSetupRequest = {
                userId,
                biometricType: deviceInfo?.biometricType || 'touch_id',
                platform: deviceInfo?.platform || 'web',
                deviceInfo: {
                    deviceId: deviceInfo?.deviceId || '',
                    deviceName: deviceInfo?.deviceName || '',
                    osVersion: deviceInfo?.osVersion || '',
                    platform: deviceInfo?.platform || 'web',
                    biometricType: deviceInfo?.biometricType || 'touch_id'
                }
            }

            const response = await biometricService.setupBiometric(setupRequest)

            if (response.success) {
                setBiometricState(prev => ({
                    ...prev,
                    isEnrolled: true
                }))
            } else {
                setError(response.error || t('biometric.setupError'))
            }

            return response
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : t('biometric.setupError')
            setError(errorMessage)
            return {
                success: false,
                error: errorMessage,
                setupComplete: false
            }
        } finally {
            setIsLoading(false)
        }
    }, [biometricService, deviceInfo, initialize, t])

    // Authenticate with biometric
    const authenticate = useCallback(async (userId: string, options?: BiometricAuthOptions): Promise<BiometricAuthResponse> => {
        try {
            setBiometricState(prev => ({
                ...prev,
                isAuthenticating: true
            }))
            setError(null)

            if (!deviceInfo) {
                const initialized = await initialize()
                if (!initialized) {
                    return {
                        success: false,
                        error: t('biometric.deviceNotSupported'),
                        biometricType: 'touch_id',
                        platform: 'web',
                        timestamp: new Date().toISOString()
                    }
                }
            }

            const authRequest: BiometricAuthRequest = {
                userId,
                biometricType: deviceInfo?.biometricType || 'touch_id',
                platform: deviceInfo?.platform || 'web',
                challenge: Math.random().toString(36).substring(2, 15)
            }

            const response = await biometricService.authenticate(authRequest, options)

            if (!response.success) {
                setError(response.error || t('biometric.authenticationError'))
            }

            return response
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : t('biometric.authenticationError')
            setError(errorMessage)
            return {
                success: false,
                error: errorMessage,
                biometricType: deviceInfo?.biometricType || 'touch_id',
                platform: deviceInfo?.platform || 'web',
                timestamp: new Date().toISOString()
            }
        } finally {
            setBiometricState(prev => ({
                ...prev,
                isAuthenticating: false
            }))
        }
    }, [biometricService, deviceInfo, initialize, t])

    // Remove biometric credentials
    const removeCredentials = useCallback(async (userId: string): Promise<boolean> => {
        try {
            setIsLoading(true)
            setError(null)

            const success = await biometricService.removeCredentials(userId)

            if (success) {
                setBiometricState(prev => ({
                    ...prev,
                    isEnrolled: false
                }))
            } else {
                setError(t('biometric.removeError'))
            }

            return success
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : t('biometric.removeError')
            setError(errorMessage)
            return false
        } finally {
            setIsLoading(false)
        }
    }, [biometricService, t])

    // Auto-initialize on mount
    useEffect(() => {
        if (user && !biometricState.isAvailable) {
            initialize()
        }
    }, [user, biometricState.isAvailable, initialize])

    return {
        // State
        biometricState,
        deviceInfo,

        // Actions
        initialize,
        setupBiometric,
        authenticate,
        removeCredentials,

        // Utilities
        isSupported: biometricState.isSupported,
        isEnrolled: biometricState.isEnrolled,
        biometricType: biometricState.biometricType,
        isLoading,
        error
    }
}

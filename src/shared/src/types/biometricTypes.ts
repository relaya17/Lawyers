// Biometric Authentication Types
// טיפוסים לאימות ביומטרי

export interface BiometricCredentials {
    id: string
    userId: string
    biometricType: 'face_id' | 'touch_id' | 'fingerprint' | 'face_recognition' | 'voice_recognition' | 'windows_hello' | 'macos_touch_id'
    platform: 'ios' | 'android' | 'windows' | 'macos' | 'web'
    isEnabled: boolean
    createdAt: string
    updatedAt: string
}

export interface BiometricAuthRequest {
    userId: string
    biometricType: 'face_id' | 'touch_id' | 'fingerprint' | 'face_recognition' | 'voice_recognition' | 'windows_hello' | 'macos_touch_id'
    platform: 'ios' | 'android' | 'windows' | 'macos' | 'web'
    challenge: string
}

export interface BiometricAuthResponse {
    success: boolean
    token?: string
    error?: string
    biometricType: 'face_id' | 'touch_id' | 'fingerprint' | 'face_recognition' | 'voice_recognition' | 'windows_hello' | 'macos_touch_id'
    platform: 'ios' | 'android' | 'windows' | 'macos' | 'web'
    timestamp: string
}

export interface BiometricSetupRequest {
    userId: string
    biometricType: 'face_id' | 'touch_id' | 'fingerprint' | 'face_recognition' | 'voice_recognition' | 'windows_hello' | 'macos_touch_id'
    platform: 'ios' | 'android' | 'windows' | 'macos' | 'web'
    deviceInfo: {
        deviceId: string
        deviceName: string
        osVersion: string
        platform: 'ios' | 'android' | 'windows' | 'macos' | 'web'
        biometricType: 'face_id' | 'touch_id' | 'fingerprint' | 'face_recognition' | 'voice_recognition' | 'windows_hello' | 'macos_touch_id'
    }
}

export interface BiometricSetupResponse {
    success: boolean
    credentialId?: string
    error?: string
    setupComplete: boolean
}

export interface BiometricDeviceInfo {
    deviceId: string
    deviceName: string
    osVersion: string
    platform: 'ios' | 'android' | 'windows' | 'macos' | 'web'
    biometricType: 'face_id' | 'touch_id' | 'fingerprint' | 'face_recognition' | 'voice_recognition' | 'windows_hello' | 'macos_touch_id'
    isAvailable: boolean
    isEnrolled: boolean
    isSupported: boolean
    availableTypes: Array<'face_id' | 'touch_id' | 'fingerprint' | 'face_recognition' | 'voice_recognition' | 'windows_hello' | 'macos_touch_id'>
}

export interface BiometricAuthState {
    isAvailable: boolean
    isEnrolled: boolean
    isSupported: boolean
    biometricType: 'face_id' | 'touch_id' | 'fingerprint' | 'face_recognition' | 'voice_recognition' | 'windows_hello' | 'macos_touch_id' | null
    platform: 'ios' | 'android' | 'windows' | 'macos' | 'web' | null
    deviceInfo: BiometricDeviceInfo | null
    isAuthenticating: boolean
    error: string | null
}

export interface BiometricAuthOptions {
    promptMessage?: string
    cancelButtonText?: string
    fallbackButtonText?: string
    allowDeviceCredential?: boolean
    requireUserPresence?: boolean
    requireUserVerification?: boolean
}

export interface BiometricChallenge {
    challenge: string
    userId: string
    expiresAt: string
    biometricType: 'face_id' | 'touch_id' | 'fingerprint' | 'face_recognition' | 'voice_recognition' | 'windows_hello' | 'macos_touch_id'
    platform: 'ios' | 'android' | 'windows' | 'macos' | 'web'
}

export interface BiometricVerificationResult {
    success: boolean
    credentialId?: string
    error?: string
    biometricType: 'face_id' | 'touch_id' | 'fingerprint' | 'face_recognition' | 'voice_recognition' | 'windows_hello' | 'macos_touch_id'
    platform: 'ios' | 'android' | 'windows' | 'macos' | 'web'
    timestamp: string
    deviceInfo: BiometricDeviceInfo
}

// נוסיף טיפוס עזר עבור כל סוגי האימות הביומטרי
export type BiometricType = 'face_id' | 'touch_id' | 'fingerprint' | 'face_recognition' | 'voice_recognition' | 'windows_hello' | 'macos_touch_id'
export type PlatformType = 'ios' | 'android' | 'windows' | 'macos' | 'web'

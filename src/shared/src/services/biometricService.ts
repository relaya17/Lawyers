import {
    BiometricAuthRequest,
    BiometricAuthResponse,
    BiometricSetupRequest,
    BiometricSetupResponse,
    BiometricDeviceInfo,
    BiometricAuthOptions,
    BiometricChallenge,
    BiometricVerificationResult,
    BiometricType,
    PlatformType
} from '../types/biometricTypes'
import { logger } from '../utils/logger'

// Biometric Authentication Service
// שירות אימות ביומטרי

export class BiometricService {
    private static instance: BiometricService
    private isInitialized = false

    private constructor() { }

    static getInstance(): BiometricService {
        if (!BiometricService.instance) {
            BiometricService.instance = new BiometricService()
        }
        return BiometricService.instance
    }

    // Check if biometric authentication is supported
    async isSupported(): Promise<boolean> {
        try {
            // Check if WebAuthn is supported
            if (!window.PublicKeyCredential) {
                return false
            }

            // Check if biometric authentication is available
            const available = await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable()
            return available
        } catch (error) {
            logger.error('Error checking biometric support:', error)
            return false
        }
    }

    // Get device information
    async getDeviceInfo(): Promise<BiometricDeviceInfo | null> {
        try {
            const platform = this.detectPlatform()
            const availableTypes = await this.detectAvailableBiometricTypes(platform)

            if (availableTypes.length === 0) {
                return null
            }

            // בחר את הטיפוס הראשון הזמין
            const biometricType = availableTypes[0]

            return {
                deviceId: this.generateDeviceId(),
                deviceName: this.getDeviceName(platform),
                osVersion: this.getOSVersion(platform),
                platform,
                biometricType,
                availableTypes,
                isAvailable: await this.isSupported(),
                isEnrolled: await this.isEnrolled(),
                isSupported: true
            }
        } catch (error) {
            logger.error('Error getting device info:', error)
            return null
        }
    }

    // Detect platform
    private detectPlatform(): PlatformType {
        const userAgent = navigator.userAgent.toLowerCase()

        if (/ipad|iphone|ipod/.test(userAgent)) {
            return 'ios'
        } else if (/android/.test(userAgent)) {
            return 'android'
        } else if (/windows/.test(userAgent)) {
            return 'windows'
        } else if (/mac/.test(userAgent) && !/mobile/.test(userAgent)) {
            return 'macos'
        } else {
            return 'web'
        }
    }

    // Detect available biometric types based on platform
    private async detectAvailableBiometricTypes(platform: PlatformType): Promise<BiometricType[]> {
        const availableTypes: BiometricType[] = []

        try {
            switch (platform) {
                case 'ios':
                    // iOS - Face ID and Touch ID
                    if (await this.checkFaceIDSupport()) {
                        availableTypes.push('face_id')
                    }
                    if (await this.checkTouchIDSupport()) {
                        availableTypes.push('touch_id')
                    }
                    break

                case 'android':
                    // Android - Fingerprint, Face Recognition, Voice Recognition
                    if (await this.checkFingerprintSupport()) {
                        availableTypes.push('fingerprint')
                    }
                    if (await this.checkFaceRecognitionSupport()) {
                        availableTypes.push('face_recognition')
                    }
                    break

                case 'windows':
                    // Windows - Windows Hello (Fingerprint, Face, PIN, etc.)
                    if (await this.checkWindowsHelloSupport()) {
                        availableTypes.push('windows_hello')
                    }
                    break

                case 'macos':
                    // macOS - Touch ID on newer MacBooks
                    if (await this.checkMacOSTouchIDSupport()) {
                        availableTypes.push('macos_touch_id')
                    }
                    break

                case 'web':
                    // Generic web - WebAuthn support
                    if (await this.isSupported()) {
                        availableTypes.push('fingerprint') // Default to fingerprint
                    }
                    break
            }
        } catch (error) {
            logger.error('Error detecting biometric types:', error)
        }

        return availableTypes
    }

    // Check Face ID support
    private async checkFaceIDSupport(): Promise<boolean> {
        try {
            const userAgent = navigator.userAgent
            // iPhone X and later support Face ID
            const isIPhoneXOrLater = /iPhone/.test(userAgent) &&
                (parseInt(userAgent.match(/OS (\d+)_/)?.[1] || '0') >= 11)

            // Check if Touch ID is NOT available (indicates Face ID)
            const hasTouchID = await this.checkTouchIDSupport()
            return isIPhoneXOrLater && !hasTouchID
        } catch (error) {
            return false
        }
    }

    // Check Touch ID support
    private async checkTouchIDSupport(): Promise<boolean> {
        try {
            const userAgent = navigator.userAgent
            const isIPhone = /iPhone/.test(userAgent)
            const isIPad = /iPad/.test(userAgent)

            // Check for older iPhone models with Touch ID
            if (isIPhone) {
                const osVersion = parseInt(userAgent.match(/OS (\d+)_/)?.[1] || '0')
                return osVersion >= 8 && osVersion < 11 // Touch ID was available from iOS 8 to 10
            }

            return isIPad // Most iPads have Touch ID
        } catch (error) {
            return false
        }
    }

    // Check Android Fingerprint support
    private async checkFingerprintSupport(): Promise<boolean> {
        try {
            // WebAuthn is the standard way to check for biometric support
            return await this.isSupported()
        } catch (error) {
            return false
        }
    }

    // Check Android Face Recognition support
    private async checkFaceRecognitionSupport(): Promise<boolean> {
        try {
            // This would typically require platform-specific APIs
            // For web, we'll use WebAuthn as a proxy
            return await this.isSupported()
        } catch (error) {
            return false
        }
    }

    // Check Windows Hello support
    private async checkWindowsHelloSupport(): Promise<boolean> {
        try {
            // Windows Hello is supported through WebAuthn on Windows 10+
            const isWindows = /windows/.test(navigator.userAgent.toLowerCase())
            return isWindows && await this.isSupported()
        } catch (error) {
            return false
        }
    }

    // Check macOS Touch ID support
    private async checkMacOSTouchIDSupport(): Promise<boolean> {
        try {
            // Touch ID on Mac is supported through WebAuthn on macOS with Safari
            const isMac = /mac/.test(navigator.userAgent.toLowerCase()) && !/mobile/.test(navigator.userAgent.toLowerCase())
            const isSafari = /safari/.test(navigator.userAgent.toLowerCase()) && !/chrome/.test(navigator.userAgent.toLowerCase())
            return isMac && isSafari && await this.isSupported()
        } catch (error) {
            return false
        }
    }

    // Generate unique device ID
    private generateDeviceId(): string {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        if (ctx) {
            ctx.textBaseline = 'top'
            ctx.font = '14px Arial'
            ctx.fillText('Device fingerprint', 2, 2)
            return canvas.toDataURL()
        }
        return Math.random().toString(36).substring(2, 15)
    }

    // Get device name based on platform
    private getDeviceName(platform: PlatformType): string {
        const userAgent = navigator.userAgent

        switch (platform) {
            case 'ios': {
                if (/iPhone/.test(userAgent)) return 'iPhone'
                if (/iPad/.test(userAgent)) return 'iPad'
                if (/iPod/.test(userAgent)) return 'iPod'
                return 'iOS Device'
            }

            case 'android': {
                // Try to extract Android device name
                const androidMatch = userAgent.match(/Android[^;]*;[^)]*\) ([^)]*)/)?.[1]
                return androidMatch || 'Android Device'
            }

            case 'windows': {
                if (/Windows NT 10/.test(userAgent)) return 'Windows 10/11'
                if (/Windows NT 6\.3/.test(userAgent)) return 'Windows 8.1'
                if (/Windows NT 6\.2/.test(userAgent)) return 'Windows 8'
                return 'Windows PC'
            }

            case 'macos': {
                if (/Mac/.test(userAgent)) {
                    const macMatch = userAgent.match(/Mac OS X ([^)]*)/)?.[1]?.replace(/_/g, '.')
                    return macMatch ? `macOS ${macMatch}` : 'Mac'
                }
                return 'Mac'
            }

            case 'web': {
                return 'Web Browser'
            }

            default:
                return 'Unknown Device'
        }
    }

    // Get OS version based on platform
    private getOSVersion(platform: PlatformType): string {
        const userAgent = navigator.userAgent

        switch (platform) {
            case 'ios': {
                const iosMatch = userAgent.match(/OS (\d+)_(\d+)_?(\d+)?/)
                if (iosMatch) {
                    return `iOS ${iosMatch[1]}.${iosMatch[2]}${iosMatch[3] ? `.${iosMatch[3]}` : ''}`
                }
                return 'iOS'
            }

            case 'android': {
                const androidMatch = userAgent.match(/Android (\d+\.?\d*\.?\d*)/)
                return androidMatch ? `Android ${androidMatch[1]}` : 'Android'
            }

            case 'windows': {
                if (/Windows NT 10/.test(userAgent)) return 'Windows 10/11'
                if (/Windows NT 6\.3/.test(userAgent)) return 'Windows 8.1'
                if (/Windows NT 6\.2/.test(userAgent)) return 'Windows 8'
                if (/Windows NT 6\.1/.test(userAgent)) return 'Windows 7'
                return 'Windows'
            }

            case 'macos': {
                const macMatch = userAgent.match(/Mac OS X (\d+[._]\d+[._]?\d*)/)
                if (macMatch) {
                    return `macOS ${macMatch[1].replace(/_/g, '.')}`
                }
                return 'macOS'
            }

            case 'web': {
                return 'Web Platform'
            }

            default:
                return 'Unknown OS'
        }
    }

    // Check if biometric is enrolled
    async isEnrolled(): Promise<boolean> {
        try {
            // Check if user has biometric credentials stored
            const credentials = await this.getStoredCredentials()
            return credentials.length > 0
        } catch (error) {
            logger.error('Error checking enrollment:', error)
            return false
        }
    }

    // Setup biometric authentication
    async setupBiometric(setupRequest: BiometricSetupRequest): Promise<BiometricSetupResponse> {
        try {
            const deviceInfo = await this.getDeviceInfo()
            if (!deviceInfo || !deviceInfo.isAvailable) {
                return {
                    success: false,
                    error: 'Biometric authentication not available on this device',
                    setupComplete: false
                }
            }

            // Create challenge for biometric setup
            const challenge = await this.createChallenge(setupRequest.userId, deviceInfo.biometricType, deviceInfo.platform)

            // Create credential
            const credential = await this.createCredential(challenge, setupRequest.userId)

            if (credential) {
                // Store credential
                await this.storeCredential(credential, setupRequest.userId, deviceInfo.biometricType)

                return {
                    success: true,
                    credentialId: credential.id,
                    setupComplete: true
                }
            }

            return {
                success: false,
                error: 'Failed to create biometric credential',
                setupComplete: false
            }
        } catch (error) {
            logger.error('Error setting up biometric:', error)
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error',
                setupComplete: false
            }
        }
    }

    // Authenticate with biometric
    async authenticate(authRequest: BiometricAuthRequest, _options?: BiometricAuthOptions): Promise<BiometricAuthResponse> {
        try {
            const deviceInfo = await this.getDeviceInfo()
            if (!deviceInfo || !deviceInfo.isAvailable) {
                return {
                    success: false,
                    error: 'Biometric authentication not available',
                    biometricType: authRequest.biometricType,
                    platform: authRequest.platform,
                    timestamp: new Date().toISOString()
                }
            }

            // Get stored credentials
            const credentials = await this.getStoredCredentials()
            if (credentials.length === 0) {
                return {
                    success: false,
                    error: 'No biometric credentials found',
                    biometricType: authRequest.biometricType,
                    platform: authRequest.platform,
                    timestamp: new Date().toISOString()
                }
            }

            // Create authentication challenge
            const challenge = await this.createChallenge(authRequest.userId, authRequest.biometricType, authRequest.platform)

            // Get credential
            const credential = await this.getCredential(challenge, credentials)

            if (credential) {
                // Verify credential
                const verificationResult = await this.verifyCredential(credential, challenge)

                if (verificationResult.success) {
                    // Generate authentication token
                    const token = await this.generateAuthToken(authRequest.userId, verificationResult)

                    return {
                        success: true,
                        token,
                        biometricType: authRequest.biometricType,
                        platform: authRequest.platform,
                        timestamp: new Date().toISOString()
                    }
                }
            }

            return {
                success: false,
                error: 'Biometric authentication failed',
                biometricType: authRequest.biometricType,
                platform: authRequest.platform,
                timestamp: new Date().toISOString()
            }
        } catch (error) {
            logger.error('Error during biometric authentication:', error)
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error',
                biometricType: authRequest.biometricType,
                platform: authRequest.platform,
                timestamp: new Date().toISOString()
            }
        }
    }

    // Create challenge for biometric authentication
    private async createChallenge(userId: string, biometricType: BiometricType, platform: PlatformType = 'web'): Promise<BiometricChallenge> {
        // In a real implementation, this would be generated by the server
        const challenge = Math.random().toString(36).substring(2, 15)
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString() // 5 minutes

        return {
            challenge,
            userId,
            expiresAt,
            biometricType,
            platform
        }
    }

    // Create biometric credential
    private async createCredential(challenge: BiometricChallenge, userId: string): Promise<PublicKeyCredential | null> {
        try {
            const publicKeyOptions: PublicKeyCredentialCreationOptions = {
                challenge: new Uint8Array(Buffer.from(challenge.challenge, 'utf8')),
                rp: {
                    name: 'ContractLab Pro',
                    id: window.location.hostname
                },
                user: {
                    id: new Uint8Array(Buffer.from(userId, 'utf8')),
                    name: userId,
                    displayName: userId
                },
                pubKeyCredParams: [
                    {
                        type: 'public-key',
                        alg: -7 // ES256
                    }
                ],
                authenticatorSelection: {
                    authenticatorAttachment: 'platform',
                    userVerification: 'required'
                },
                timeout: 60000, // 60 seconds
                attestation: 'direct'
            }

            const credential = await navigator.credentials.create({
                publicKey: publicKeyOptions
            }) as PublicKeyCredential

            return credential
        } catch (error) {
            logger.error('Error creating credential:', error)
            return null
        }
    }

    // Get stored credentials
    private async getStoredCredentials(): Promise<PublicKeyCredential[]> {
        try {
            // In a real implementation, this would retrieve from secure storage
            const stored = localStorage.getItem('biometric_credentials')
            if (stored) {
                return JSON.parse(stored)
            }
            return []
        } catch (error) {
            logger.error('Error getting stored credentials:', error)
            return []
        }
    }

    // Store credential
    private async storeCredential(credential: PublicKeyCredential, _userId: string, _biometricType: BiometricType): Promise<void> {
        try {
            const credentials = await this.getStoredCredentials()
            credentials.push(credential)
            localStorage.setItem('biometric_credentials', JSON.stringify(credentials))
        } catch (error) {
            logger.error('Error storing credential:', error)
        }
    }

    // Get credential for authentication
    private async getCredential(challenge: BiometricChallenge, credentials: PublicKeyCredential[]): Promise<PublicKeyCredential | null> {
        try {
            const publicKeyOptions: PublicKeyCredentialRequestOptions = {
                challenge: new Uint8Array(Buffer.from(challenge.challenge, 'utf8')),
                rpId: window.location.hostname,
                allowCredentials: credentials.map(cred => ({
                    type: 'public-key',
                    id: cred.rawId,
                    transports: ['internal']
                })),
                userVerification: 'required',
                timeout: 60000 // 60 seconds
            }

            const credential = await navigator.credentials.get({
                publicKey: publicKeyOptions
            }) as PublicKeyCredential

            return credential
        } catch (error) {
            logger.error('Error getting credential:', error)
            return null
        }
    }

    // Verify credential
    private async verifyCredential(credential: PublicKeyCredential, challenge: BiometricChallenge): Promise<BiometricVerificationResult> {
        try {
            const deviceInfo = await this.getDeviceInfo()

            // In a real implementation, this would verify with the server
            const success = credential && credential.rawId

            return {
                success: !!success,
                credentialId: credential?.id,
                biometricType: challenge.biometricType,
                platform: challenge.platform,
                timestamp: new Date().toISOString(),
                deviceInfo: deviceInfo!
            }
        } catch (error) {
            logger.error('Error verifying credential:', error)
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error',
                biometricType: challenge.biometricType,
                platform: challenge.platform,
                timestamp: new Date().toISOString(),
                deviceInfo: null!
            }
        }
    }

    // Generate authentication token
    private async generateAuthToken(userId: string, verificationResult: BiometricVerificationResult): Promise<string> {
        // In a real implementation, this would be generated by the server
        const tokenData = {
            userId,
            biometricType: verificationResult.biometricType,
            timestamp: verificationResult.timestamp,
            deviceId: verificationResult.deviceInfo.deviceId
        }

        return btoa(JSON.stringify(tokenData))
    }

    // Remove biometric credentials
    async removeCredentials(_userId: string): Promise<boolean> {
        try {
            localStorage.removeItem('biometric_credentials')
            return true
        } catch (error) {
            logger.error('Error removing credentials:', error)
            return false
        }
    }

    // Initialize biometric service
    async initialize(): Promise<boolean> {
        if (this.isInitialized) {
            return true
        }

        try {
            const isSupported = await this.isSupported()
            if (!isSupported) {
                logger.warn('Biometric authentication not supported on this device')
                return false
            }

            this.isInitialized = true
            return true
        } catch (error) {
            logger.error('Error initializing biometric service:', error)
            return false
        }
    }
}

export default BiometricService

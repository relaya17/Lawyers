export interface IOSDeviceInfo {
    model: string
    version: string
    userAgent: string
    isStandalone: boolean
    isHomeScreen: boolean
    hasNotch: boolean
    hasDynamicIsland: boolean
    safeAreaInsets: SafeAreaInsets
    orientation: 'portrait' | 'landscape'
    colorScheme: 'light' | 'dark'
}

export interface SafeAreaInsets {
    top: number
    bottom: number
    left: number
    right: number
}

export interface IOSNotification {
    id: string
    title: string
    body: string
    badge?: number
    sound?: string
    data?: Record<string, any>
    scheduledTime?: number
    repeated?: boolean
}

export interface IOSShareData {
    title?: string
    text?: string
    url?: string
    files?: File[]
}

export interface IOSContactInfo {
    firstName?: string
    lastName?: string
    phoneNumbers?: string[]
    emails?: string[]
    organization?: string
    jobTitle?: string
}

export interface IOSCalendarEvent {
    title: string
    startDate: Date
    endDate: Date
    location?: string
    notes?: string
    url?: string
    allDay?: boolean
}

export interface IOSHapticOptions {
    type: 'impact' | 'notification' | 'selection'
    intensity?: 'light' | 'medium' | 'heavy'
    notificationType?: 'success' | 'warning' | 'error'
}

export interface IOSKeyboardInfo {
    height: number
    isVisible: boolean
    animationDuration: number
}

export interface IOSCameraOptions {
    allowsEditing: boolean
    mediaTypes: ('photo' | 'video')[]
    quality: number
    maxDuration?: number
    videoQuality?: 'low' | 'medium' | 'high'
}

export interface IOSLocationInfo {
    latitude: number
    longitude: number
    accuracy: number
    altitude?: number
    heading?: number
    speed?: number
    timestamp: number
}

export interface IOSSpeechRecognitionResult {
    transcript: string
    confidence: number
    isFinal: boolean
    language: string
}

export interface IOSVoiceOverInfo {
    enabled: boolean
    speakingRate: number
    language: string
}

export interface IOSNetworkInfo {
    type: 'wifi' | 'cellular' | 'none'
    effectiveType: '2g' | '3g' | '4g' | '5g'
    downlink: number
    rtt: number
}

export interface IOSBatteryInfo {
    level: number
    isCharging: boolean
    chargingTime?: number
    dischargingTime?: number
}

export interface IOSStorageInfo {
    quota: number
    usage: number
    available: number
}

export interface IOSFileSystemAccess {
    canRead: boolean
    canWrite: boolean
    supportedTypes: string[]
}

export interface IOSPerformanceMetrics {
    memory: {
        used: number
        total: number
        available: number
    }
    navigation: {
        loadStart: number
        domContentLoaded: number
        loadComplete: number
    }
    rendering: {
        firstPaint: number
        firstContentfulPaint: number
        largestContentfulPaint: number
    }
}

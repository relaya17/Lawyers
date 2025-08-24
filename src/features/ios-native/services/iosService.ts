import {
    IOSDeviceInfo,
    IOSNotification,
    IOSShareData,
    IOSContactInfo,
    IOSCalendarEvent,
    IOSHapticOptions,
    IOSKeyboardInfo,
    IOSVoiceOverInfo,
    IOSNetworkInfo,
    IOSBatteryInfo,
    IOSStorageInfo,
    IOSPerformanceMetrics,
    SafeAreaInsets
} from '../types/iosTypes'

class IOSService {
    private deviceInfo: IOSDeviceInfo | null = null
    private keyboardListeners: Array<(info: IOSKeyboardInfo) => void> = []
    private orientationListeners: Array<(orientation: string) => void> = []
    private networkListeners: Array<(info: IOSNetworkInfo) => void> = []

    constructor() {
        this.detectDevice()
        this.setupEventListeners()
    }

    // Device Detection
    detectDevice(): IOSDeviceInfo {
        const userAgent = navigator.userAgent
        const isIOS = /iPad|iPhone|iPod/.test(userAgent)
        const isStandalone = (window.navigator as { standalone?: boolean }).standalone === true ||
            window.matchMedia('(display-mode: standalone)').matches

        if (!isIOS) {
            // Return mock data for non-iOS devices
            this.deviceInfo = {
                model: 'Unknown',
                version: 'Unknown',
                userAgent,
                isStandalone: false,
                isHomeScreen: false,
                hasNotch: false,
                hasDynamicIsland: false,
                safeAreaInsets: { top: 0, bottom: 0, left: 0, right: 0 },
                orientation: window.innerHeight > window.innerWidth ? 'portrait' : 'landscape',
                colorScheme: window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
            }
            return this.deviceInfo
        }

        // Detect iOS model and version
        const model = this.detectIOSModel(userAgent)
        const version = this.detectIOSVersion(userAgent)
        const hasNotch = this.detectNotch()
        const hasDynamicIsland = this.detectDynamicIsland(model)
        const safeAreaInsets = this.getSafeAreaInsets()

        this.deviceInfo = {
            model,
            version,
            userAgent,
            isStandalone,
            isHomeScreen: isStandalone,
            hasNotch,
            hasDynamicIsland,
            safeAreaInsets,
            orientation: window.innerHeight > window.innerWidth ? 'portrait' : 'landscape',
            colorScheme: window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
        }

        return this.deviceInfo
    }

    private detectIOSModel(userAgent: string): string {
        if (userAgent.includes('iPad')) return 'iPad'
        if (userAgent.includes('iPhone')) {
            // Try to detect specific iPhone model
            const screenHeight = window.screen.height
            const pixelRatio = window.devicePixelRatio

            if (screenHeight === 932 && pixelRatio === 3) return 'iPhone 15 Pro Max'
            if (screenHeight === 852 && pixelRatio === 3) return 'iPhone 15 Pro'
            if (screenHeight === 844 && pixelRatio === 3) return 'iPhone 14'
            if (screenHeight === 926 && pixelRatio === 3) return 'iPhone 13 Pro Max'

            return 'iPhone'
        }
        if (userAgent.includes('iPod')) return 'iPod'
        return 'Unknown iOS Device'
    }

    private detectIOSVersion(userAgent: string): string {
        const match = userAgent.match(/OS (\d+)_(\d+)/)
        if (match) {
            return `${match[1]}.${match[2]}`
        }
        return 'Unknown'
    }

    private detectNotch(): boolean {
        // Check for notch using safe area insets
        const safeAreaTop = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--sat') || '0')
        return safeAreaTop > 20
    }

    private detectDynamicIsland(model: string): boolean {
        return model.includes('iPhone 15') || model.includes('iPhone 14 Pro')
    }

    private getSafeAreaInsets(): SafeAreaInsets {
        const computedStyle = getComputedStyle(document.documentElement)

        return {
            top: parseInt(computedStyle.getPropertyValue('--sat') || '0'),
            bottom: parseInt(computedStyle.getPropertyValue('--sab') || '0'),
            left: parseInt(computedStyle.getPropertyValue('--sal') || '0'),
            right: parseInt(computedStyle.getPropertyValue('--sar') || '0')
        }
    }

    // Notifications
    async requestNotificationPermission(): Promise<boolean> {
        if (!('Notification' in window)) {
            console.warn('This browser does not support notifications')
            return false
        }

        const permission = await Notification.requestPermission()
        return permission === 'granted'
    }

    async sendNotification(notification: IOSNotification): Promise<void> {
        if (!('Notification' in window)) {
            throw new Error('Notifications not supported')
        }

        if (Notification.permission !== 'granted') {
            throw new Error('Notification permission not granted')
        }

        const options: NotificationOptions = {
            body: notification.body,
            badge: '/apple-touch-icon-152.png',
            icon: '/apple-touch-icon-152.png',
            data: notification.data,
            tag: notification.id,
            requireInteraction: true
        }

        if (notification.sound) {
            // Web notifications don't support custom sounds, but we can play audio
            const audio = new Audio(notification.sound)
            audio.play().catch(console.error)
        }

        new Notification(notification.title, options)
    }

    async scheduleNotification(notification: IOSNotification): Promise<void> {
        if (!notification.scheduledTime) {
            throw new Error('Scheduled time is required')
        }

        const delay = notification.scheduledTime - Date.now()
        if (delay <= 0) {
            throw new Error('Scheduled time must be in the future')
        }

        setTimeout(() => {
            this.sendNotification(notification)
        }, delay)
    }

    // Sharing
    async share(data: IOSShareData): Promise<boolean> {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: data.title,
                    text: data.text,
                    url: data.url
                })
                return true
            } catch (error) {
                console.error('Share failed:', error)
                return false
            }
        }

        // Fallback for browsers without native sharing
        return this.fallbackShare(data)
    }

    private fallbackShare(data: IOSShareData): boolean {
        if (data.url) {
            // Copy URL to clipboard
            navigator.clipboard?.writeText(data.url)
            return true
        }

        if (data.text) {
            navigator.clipboard?.writeText(data.text)
            return true
        }

        return false
    }

    // Contacts (limited web support)
    async addContact(contact: IOSContactInfo): Promise<boolean> {
        // Web browsers have limited contact access
        // This would typically use a native app bridge
        console.log('Adding contact:', contact)

        // Create vCard format for download
        const vCard = this.createVCard(contact)
        this.downloadVCard(vCard, `${contact.firstName || 'contact'}.vcf`)

        return true
    }

    private createVCard(contact: IOSContactInfo): string {
        let vCard = 'BEGIN:VCARD\nVERSION:3.0\n'

        if (contact.firstName || contact.lastName) {
            vCard += `FN:${contact.firstName || ''} ${contact.lastName || ''}\n`
            vCard += `N:${contact.lastName || ''};${contact.firstName || ''};;;\n`
        }

        if (contact.organization) {
            vCard += `ORG:${contact.organization}\n`
        }

        if (contact.jobTitle) {
            vCard += `TITLE:${contact.jobTitle}\n`
        }

        contact.phoneNumbers?.forEach(phone => {
            vCard += `TEL:${phone}\n`
        })

        contact.emails?.forEach(email => {
            vCard += `EMAIL:${email}\n`
        })

        vCard += 'END:VCARD'
        return vCard
    }

    private downloadVCard(vCard: string, filename: string): void {
        const blob = new Blob([vCard], { type: 'text/vcard' })
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = filename
        link.click()
        URL.revokeObjectURL(url)
    }

    // Calendar
    async addCalendarEvent(event: IOSCalendarEvent): Promise<boolean> {
        // Create iCal format for download
        const iCal = this.createICal(event)
        this.downloadICal(iCal, `${event.title.replace(/\s+/g, '_')}.ics`)

        return true
    }

    private createICal(event: IOSCalendarEvent): string {
        const formatDate = (date: Date): string => {
            return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
        }

        let iCal = 'BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//ContractLab Pro//EN\n'
        iCal += 'BEGIN:VEVENT\n'
        iCal += `UID:${Date.now()}@contractlab.pro\n`
        iCal += `DTSTART:${formatDate(event.startDate)}\n`
        iCal += `DTEND:${formatDate(event.endDate)}\n`
        iCal += `SUMMARY:${event.title}\n`

        if (event.location) {
            iCal += `LOCATION:${event.location}\n`
        }

        if (event.notes) {
            iCal += `DESCRIPTION:${event.notes}\n`
        }

        if (event.url) {
            iCal += `URL:${event.url}\n`
        }

        iCal += 'END:VEVENT\n'
        iCal += 'END:VCALENDAR'

        return iCal
    }

    private downloadICal(iCal: string, filename: string): void {
        const blob = new Blob([iCal], { type: 'text/calendar' })
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = filename
        link.click()
        URL.revokeObjectURL(url)
    }

    // Haptic Feedback
    async triggerHaptic(options: IOSHapticOptions): Promise<void> {
        // Check if device supports haptic feedback
        if (!navigator.vibrate) {
            console.warn('Haptic feedback not supported')
            return
        }

        let pattern: number[]

        switch (options.type) {
            case 'impact':
                switch (options.intensity) {
                    case 'light':
                        pattern = [10]
                        break
                    case 'medium':
                        pattern = [20]
                        break
                    case 'heavy':
                        pattern = [50]
                        break
                    default:
                        pattern = [20]
                }
                break

            case 'notification':
                switch (options.notificationType) {
                    case 'success':
                        pattern = [10, 50, 10]
                        break
                    case 'warning':
                        pattern = [20, 100, 20]
                        break
                    case 'error':
                        pattern = [50, 50, 50]
                        break
                    default:
                        pattern = [30]
                }
                break

            case 'selection':
                pattern = [5]
                break

            default:
                pattern = [20]
        }

        navigator.vibrate(pattern)
    }

    // Keyboard
    private setupEventListeners(): void {
        // Keyboard events
        if ('visualViewport' in window) {
            window.visualViewport?.addEventListener('resize', () => {
                const keyboardHeight = window.innerHeight - (window.visualViewport?.height || 0)
                const isVisible = keyboardHeight > 0

                const keyboardInfo: IOSKeyboardInfo = {
                    height: keyboardHeight,
                    isVisible,
                    animationDuration: 250
                }

                this.keyboardListeners.forEach(listener => listener(keyboardInfo))
            })
        }

        // Orientation events
        window.addEventListener('orientationchange', () => {
            setTimeout(() => {
                const orientation = window.innerHeight > window.innerWidth ? 'portrait' : 'landscape'
                this.orientationListeners.forEach(listener => listener(orientation))

                if (this.deviceInfo) {
                    this.deviceInfo.orientation = orientation
                }
            }, 100)
        })

        // Network events
        if ('connection' in navigator) {
            const connection = (navigator as { connection?: { type?: string; effectiveType?: string; downlink?: number; rtt?: number; addEventListener: (event: string, callback: () => void) => void } }).connection
            if (connection) {
                const updateNetworkInfo = () => {
                    const networkInfo: IOSNetworkInfo = {
                        type: (connection.type as 'wifi' | 'cellular' | 'none') || 'none',
                        effectiveType: (connection.effectiveType as '2g' | '3g' | '4g' | '5g') || '4g',
                        downlink: connection.downlink || 0,
                        rtt: connection.rtt || 0
                    }
                    this.networkListeners.forEach(listener => listener(networkInfo))
                }

                connection.addEventListener('change', updateNetworkInfo)
            }
        }
    }

    // Event Listeners
    onKeyboardChange(listener: (info: IOSKeyboardInfo) => void): () => void {
        this.keyboardListeners.push(listener)
        return () => {
            const index = this.keyboardListeners.indexOf(listener)
            if (index > -1) {
                this.keyboardListeners.splice(index, 1)
            }
        }
    }

    onOrientationChange(listener: (orientation: string) => void): () => void {
        this.orientationListeners.push(listener)
        return () => {
            const index = this.orientationListeners.indexOf(listener)
            if (index > -1) {
                this.orientationListeners.splice(index, 1)
            }
        }
    }

    onNetworkChange(listener: (info: IOSNetworkInfo) => void): () => void {
        this.networkListeners.push(listener)
        return () => {
            const index = this.networkListeners.indexOf(listener)
            if (index > -1) {
                this.networkListeners.splice(index, 1)
            }
        }
    }

    // Device Information
    getDeviceInfo(): IOSDeviceInfo | null {
        return this.deviceInfo
    }

    async getBatteryInfo(): Promise<IOSBatteryInfo | null> {
        if ('getBattery' in navigator) {
            try {
                const battery = await (navigator as { getBattery?: () => Promise<{ level: number; charging: boolean; chargingTime: number; dischargingTime: number }> }).getBattery?.()
                if (battery) {
                    return {
                        level: battery.level,
                        isCharging: battery.charging,
                        chargingTime: battery.chargingTime,
                        dischargingTime: battery.dischargingTime
                    }
                }
            } catch (error) {
                console.error('Battery API not available:', error)
            }
        }
        return null
    }

    async getStorageInfo(): Promise<IOSStorageInfo | null> {
        if ('storage' in navigator && 'estimate' in navigator.storage) {
            try {
                const estimate = await navigator.storage.estimate()
                return {
                    quota: estimate.quota || 0,
                    usage: estimate.usage || 0,
                    available: (estimate.quota || 0) - (estimate.usage || 0)
                }
            } catch (error) {
                console.error('Storage API not available:', error)
            }
        }
        return null
    }

    getPerformanceMetrics(): IOSPerformanceMetrics | null {
        if (!performance) return null

        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
        const paint = performance.getEntriesByType('paint')

        const memory = (performance as { memory?: { usedJSHeapSize: number; totalJSHeapSize: number; jsHeapSizeLimit: number } }).memory

        return {
            memory: memory ? {
                used: memory.usedJSHeapSize,
                total: memory.totalJSHeapSize,
                available: memory.jsHeapSizeLimit
            } : {
                used: 0,
                total: 0,
                available: 0
            },
            navigation: {
                loadStart: navigation?.loadEventStart || 0,
                domContentLoaded: navigation?.domContentLoadedEventEnd || 0,
                loadComplete: navigation?.loadEventEnd || 0
            },
            rendering: {
                firstPaint: paint.find(p => p.name === 'first-paint')?.startTime || 0,
                firstContentfulPaint: paint.find(p => p.name === 'first-contentful-paint')?.startTime || 0,
                largestContentfulPaint: 0 // Would need LCP observer
            }
        }
    }

    // Accessibility
    getVoiceOverInfo(): IOSVoiceOverInfo {
        const speechSynthesis = window.speechSynthesis

        return {
            enabled: !!(speechSynthesis && speechSynthesis.getVoices().length > 0),
            speakingRate: 1.0,
            language: navigator.language || 'en-US'
        }
    }

    async speak(text: string, language?: string): Promise<void> {
        if (!('speechSynthesis' in window)) {
            throw new Error('Speech synthesis not supported')
        }

        const utterance = new SpeechSynthesisUtterance(text)
        utterance.lang = language || navigator.language || 'en-US'
        utterance.rate = 1.0
        utterance.pitch = 1.0
        utterance.volume = 1.0

        speechSynthesis.speak(utterance)
    }

    // Utilities
    isIOS(): boolean {
        return /iPad|iPhone|iPod/.test(navigator.userAgent)
    }

    isStandalone(): boolean {
        return (window.navigator as { standalone?: boolean }).standalone === true ||
            window.matchMedia('(display-mode: standalone)').matches
    }

    isSafari(): boolean {
        return /^((?!chrome|android).)*safari/i.test(navigator.userAgent)
    }

    getPWADisplayMode(): string {
        if (this.isStandalone()) return 'standalone'
        if (window.matchMedia('(display-mode: minimal-ui)').matches) return 'minimal-ui'
        if (window.matchMedia('(display-mode: fullscreen)').matches) return 'fullscreen'
        return 'browser'
    }
}

export const iosService = new IOSService()

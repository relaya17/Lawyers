import { useState, useEffect, useCallback } from 'react'
import { iosService } from '../services/iosService'
import {
    IOSDeviceInfo,
    IOSKeyboardInfo,
    IOSNetworkInfo,
    IOSBatteryInfo,
    IOSStorageInfo,
    IOSPerformanceMetrics,
    IOSHapticOptions,
    IOSShareData,
    IOSNotification,
    IOSContactInfo,
    IOSCalendarEvent
} from '../types/iosTypes'

export const useIOSDevice = () => {
    const [deviceInfo, setDeviceInfo] = useState<IOSDeviceInfo | null>(null)
    const [isIOS, setIsIOS] = useState(false)
    const [isStandalone, setIsStandalone] = useState(false)

    useEffect(() => {
        const info = iosService.getDeviceInfo()
        setDeviceInfo(info)
        setIsIOS(iosService.isIOS())
        setIsStandalone(iosService.isStandalone())
    }, [])

    return {
        deviceInfo,
        isIOS,
        isStandalone,
        isSafari: iosService.isSafari(),
        pwaDisplayMode: iosService.getPWADisplayMode()
    }
}

export const useIOSKeyboard = () => {
    const [keyboardInfo, setKeyboardInfo] = useState<IOSKeyboardInfo>({
        height: 0,
        isVisible: false,
        animationDuration: 250
    })

    useEffect(() => {
        const unsubscribe = iosService.onKeyboardChange(setKeyboardInfo)
        return unsubscribe
    }, [])

    return keyboardInfo
}

export const useIOSOrientation = () => {
    const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait')

    useEffect(() => {
        const unsubscribe = iosService.onOrientationChange((newOrientation) => {
            setOrientation(newOrientation as 'portrait' | 'landscape')
        })
        return unsubscribe
    }, [])

    return orientation
}

export const useIOSNetwork = () => {
    const [networkInfo, setNetworkInfo] = useState<IOSNetworkInfo>({
        type: 'none',
        effectiveType: '4g',
        downlink: 0,
        rtt: 0
    })

    useEffect(() => {
        const unsubscribe = iosService.onNetworkChange(setNetworkInfo)
        return unsubscribe
    }, [])

    return networkInfo
}

export const useIOSBattery = () => {
    const [batteryInfo, setBatteryInfo] = useState<IOSBatteryInfo | null>(null)
    const [loading, setLoading] = useState(false)

    const fetchBatteryInfo = useCallback(async () => {
        setLoading(true)
        try {
            const info = await iosService.getBatteryInfo()
            setBatteryInfo(info)
        } catch (error) {
            console.error('Failed to get battery info:', error)
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchBatteryInfo()
    }, [fetchBatteryInfo])

    return { batteryInfo, loading, refresh: fetchBatteryInfo }
}

export const useIOSStorage = () => {
    const [storageInfo, setStorageInfo] = useState<IOSStorageInfo | null>(null)
    const [loading, setLoading] = useState(false)

    const fetchStorageInfo = useCallback(async () => {
        setLoading(true)
        try {
            const info = await iosService.getStorageInfo()
            setStorageInfo(info)
        } catch (error) {
            console.error('Failed to get storage info:', error)
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchStorageInfo()
    }, [fetchStorageInfo])

    return { storageInfo, loading, refresh: fetchStorageInfo }
}

export const useIOSPerformance = () => {
    const [performanceMetrics, setPerformanceMetrics] = useState<IOSPerformanceMetrics | null>(null)

    useEffect(() => {
        const metrics = iosService.getPerformanceMetrics()
        setPerformanceMetrics(metrics)
    }, [])

    return performanceMetrics
}

export const useIOSHaptics = () => {
    const [isSupported, setIsSupported] = useState(false)

    useEffect(() => {
        setIsSupported(!!navigator.vibrate)
    }, [])

    const triggerHaptic = useCallback(async (options: IOSHapticOptions) => {
        if (!isSupported) {
            console.warn('Haptic feedback not supported')
            return
        }

        try {
            await iosService.triggerHaptic(options)
        } catch (error) {
            console.error('Haptic feedback failed:', error)
        }
    }, [isSupported])

    const impact = useCallback((intensity: 'light' | 'medium' | 'heavy' = 'medium') => {
        triggerHaptic({ type: 'impact', intensity })
    }, [triggerHaptic])

    const notification = useCallback((type: 'success' | 'warning' | 'error' = 'success') => {
        triggerHaptic({ type: 'notification', notificationType: type })
    }, [triggerHaptic])

    const selection = useCallback(() => {
        triggerHaptic({ type: 'selection' })
    }, [triggerHaptic])

    return {
        isSupported,
        triggerHaptic,
        impact,
        notification,
        selection
    }
}

export const useIOSNotifications = () => {
    const [permission, setPermission] = useState<NotificationPermission>('default')
    const [isSupported, setIsSupported] = useState(false)

    useEffect(() => {
        setIsSupported('Notification' in window)
        if ('Notification' in window) {
            setPermission(Notification.permission)
        }
    }, [])

    const requestPermission = useCallback(async () => {
        if (!isSupported) {
            throw new Error('Notifications not supported')
        }

        const granted = await iosService.requestNotificationPermission()
        setPermission(Notification.permission)
        return granted
    }, [isSupported])

    const sendNotification = useCallback(async (notification: IOSNotification) => {
        if (permission !== 'granted') {
            throw new Error('Notification permission not granted')
        }

        await iosService.sendNotification(notification)
    }, [permission])

    const scheduleNotification = useCallback(async (notification: IOSNotification) => {
        if (permission !== 'granted') {
            throw new Error('Notification permission not granted')
        }

        await iosService.scheduleNotification(notification)
    }, [permission])

    return {
        isSupported,
        permission,
        requestPermission,
        sendNotification,
        scheduleNotification
    }
}

export const useIOSShare = () => {
    const [isSupported, setIsSupported] = useState(false)

    useEffect(() => {
        setIsSupported(!!navigator.share)
    }, [])

    const share = useCallback(async (data: IOSShareData) => {
        try {
            const success = await iosService.share(data)
            return success
        } catch (error) {
            console.error('Share failed:', error)
            return false
        }
    }, [])

    return {
        isSupported,
        share
    }
}

export const useIOSContacts = () => {
    const addContact = useCallback(async (contact: IOSContactInfo) => {
        try {
            const success = await iosService.addContact(contact)
            return success
        } catch (error) {
            console.error('Add contact failed:', error)
            return false
        }
    }, [])

    return {
        addContact
    }
}

export const useIOSCalendar = () => {
    const addEvent = useCallback(async (event: IOSCalendarEvent) => {
        try {
            const success = await iosService.addCalendarEvent(event)
            return success
        } catch (error) {
            console.error('Add calendar event failed:', error)
            return false
        }
    }, [])

    return {
        addEvent
    }
}

export const useIOSSpeech = () => {
    const [isSupported, setIsSupported] = useState(false)
    const [isSpeaking, setIsSpeaking] = useState(false)

    useEffect(() => {
        setIsSupported('speechSynthesis' in window)

        if ('speechSynthesis' in window) {
            const handleStart = () => setIsSpeaking(true)
            const handleEnd = () => setIsSpeaking(false)

            speechSynthesis.addEventListener('start', handleStart)
            speechSynthesis.addEventListener('end', handleEnd)

            return () => {
                speechSynthesis.removeEventListener('start', handleStart)
                speechSynthesis.removeEventListener('end', handleEnd)
            }
        }
    }, [])

    const speak = useCallback(async (text: string, language?: string) => {
        if (!isSupported) {
            throw new Error('Speech synthesis not supported')
        }

        try {
            await iosService.speak(text, language)
        } catch (error) {
            console.error('Speech synthesis failed:', error)
        }
    }, [isSupported])

    const stop = useCallback(() => {
        if (isSupported && speechSynthesis.speaking) {
            speechSynthesis.cancel()
        }
    }, [isSupported])

    return {
        isSupported,
        isSpeaking,
        speak,
        stop
    }
}

export const useIOSAccessibility = () => {
    const voiceOverInfo = iosService.getVoiceOverInfo()

    return {
        voiceOver: voiceOverInfo
    }
}

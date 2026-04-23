import { useState, useEffect, useCallback } from 'react'
import { watchService } from '../services/watchService'
import {
    WatchConnectivity,
    WatchSettings,
    WatchMetrics,
    WatchSession,
    WatchComplication,
    WatchQuickAction,
    WatchNotification,
    ComplicationType
} from '../types/watchTypes'

export const useWatchConnection = () => {
    const [connectivity, setConnectivity] = useState<WatchConnectivity>()
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        const status = watchService.getConnectivityStatus()
        setConnectivity(status)
    }, [])

    const connect = useCallback(async () => {
        setIsLoading(true)
        try {
            const success = await watchService.initializeWatchConnection()
            const status = watchService.getConnectivityStatus()
            setConnectivity(status)
            return success
        } catch (error) {
            console.error('Watch connection failed:', error)
            return false
        } finally {
            setIsLoading(false)
        }
    }, [])

    const sync = useCallback(async () => {
        setIsLoading(true)
        try {
            const success = await watchService.syncWithWatch()
            if (success) {
                const status = watchService.getConnectivityStatus()
                setConnectivity(status)
            }
            return success
        } catch (error) {
            console.error('Watch sync failed:', error)
            return false
        } finally {
            setIsLoading(false)
        }
    }, [])

    return {
        connectivity,
        isConnected: watchService.isWatchConnected(),
        isLoading,
        connect,
        sync
    }
}

export const useWatchComplications = () => {
    const [complications, setComplications] = useState<WatchComplication[]>([])
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        loadComplications()
    }, [])

    const loadComplications = useCallback(async () => {
        setIsLoading(true)
        try {
            const activeComplications = await watchService.getActiveComplications()
            setComplications(activeComplications)
        } catch (error) {
            console.error('Failed to load complications:', error)
        } finally {
            setIsLoading(false)
        }
    }, [])

    const updateComplication = useCallback(async (type: string, data: Record<string, any>) => {
        try {
            await watchService.updateComplication(type as ComplicationType, data)
            await loadComplications()
            return true
        } catch (error) {
            console.error('Failed to update complication:', error)
            return false
        }
    }, [loadComplications])

    return {
        complications,
        isLoading,
        updateComplication,
        refresh: loadComplications
    }
}

export const useWatchNotifications = () => {
    const [isLoading, setIsLoading] = useState(false)

    const sendNotification = useCallback(async (notification: WatchNotification) => {
        setIsLoading(true)
        try {
            await watchService.sendNotification(notification)
            return true
        } catch (error) {
            console.error('Failed to send notification:', error)
            return false
        } finally {
            setIsLoading(false)
        }
    }, [])

    const sendUrgentContractAlert = useCallback(async (contractName: string, expiryDate: string) => {
        setIsLoading(true)
        try {
            await watchService.sendUrgentContractAlert(contractName, expiryDate)
            return true
        } catch (error) {
            console.error('Failed to send urgent alert:', error)
            return false
        } finally {
            setIsLoading(false)
        }
    }, [])

    const sendMeetingReminder = useCallback(async (meetingTitle: string, time: string) => {
        setIsLoading(true)
        try {
            await watchService.sendMeetingReminder(meetingTitle, time)
            return true
        } catch (error) {
            console.error('Failed to send meeting reminder:', error)
            return false
        } finally {
            setIsLoading(false)
        }
    }, [])

    return {
        isLoading,
        sendNotification,
        sendUrgentContractAlert,
        sendMeetingReminder
    }
}

export const useWatchQuickActions = () => {
    const [quickActions, setQuickActions] = useState<WatchQuickAction[]>([])
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        const actions = watchService.getQuickActions()
        setQuickActions(actions)
    }, [])

    const executeAction = useCallback(async (actionId: string, parameters?: Record<string, any>) => {
        setIsLoading(true)
        try {
            const success = await watchService.executeQuickAction(actionId, parameters)
            return success
        } catch (error) {
            console.error('Failed to execute quick action:', error)
            return false
        } finally {
            setIsLoading(false)
        }
    }, [])

    return {
        quickActions,
        isLoading,
        executeAction
    }
}

export const useWatchSettings = () => {
    const [settings, setSettings] = useState<WatchSettings>()
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        const watchSettings = watchService.getSettings()
        setSettings(watchSettings)
    }, [])

    const updateSettings = useCallback(async (updates: Partial<WatchSettings>) => {
        setIsLoading(true)
        try {
            await watchService.updateSettings(updates)
            const updatedSettings = watchService.getSettings()
            setSettings(updatedSettings)
            return true
        } catch (error) {
            console.error('Failed to update settings:', error)
            return false
        } finally {
            setIsLoading(false)
        }
    }, [])

    return {
        settings,
        isLoading,
        updateSettings
    }
}

export const useWatchSessions = () => {
    const [sessions, setSessions] = useState<WatchSession[]>([])
    const [activeSession, setActiveSession] = useState<WatchSession | null>(null)

    useEffect(() => {
        const allSessions = watchService.getSessions()
        setSessions(allSessions)

        const active = allSessions.find(s => !s.endTime)
        setActiveSession(active || null)
    }, [])

    const startSession = useCallback((type: 'document_review' | 'meeting' | 'research' | 'general') => {
        const sessionId = watchService.startSession(type)
        const allSessions = watchService.getSessions()
        setSessions(allSessions)

        const newSession = allSessions.find(s => s.id === sessionId)
        setActiveSession(newSession || null)

        return sessionId
    }, [])

    const endSession = useCallback((sessionId: string, notes?: string) => {
        const completedSession = watchService.endSession(sessionId, notes)
        const allSessions = watchService.getSessions()
        setSessions(allSessions)
        setActiveSession(null)

        return completedSession
    }, [])

    return {
        sessions,
        activeSession,
        startSession,
        endSession
    }
}

export const useWatchMetrics = () => {
    const [metrics, setMetrics] = useState<WatchMetrics>()

    useEffect(() => {
        const watchMetrics = watchService.getMetrics()
        setMetrics(watchMetrics)
    }, [])

    const refreshMetrics = useCallback(() => {
        const watchMetrics = watchService.getMetrics()
        setMetrics(watchMetrics)
    }, [])

    return {
        metrics,
        refresh: refreshMetrics
    }
}

export const useWatchHealth = () => {
    const [healthData, setHealthData] = useState<any>(null)
    const [isLoading, setIsLoading] = useState(false)

    const fetchHealthData = useCallback(async () => {
        setIsLoading(true)
        try {
            const data = await watchService.getHealthData()
            setHealthData(data)
            return data
        } catch (error) {
            console.error('Failed to fetch health data:', error)
            return null
        } finally {
            setIsLoading(false)
        }
    }, [])

    useEffect(() => {
        if (watchService.isWatchConnected()) {
            fetchHealthData()
        }
    }, [fetchHealthData])

    return {
        healthData,
        isLoading,
        refresh: fetchHealthData
    }
}

export const useWatchApp = () => {
    const connection = useWatchConnection()
    const complications = useWatchComplications()
    const notifications = useWatchNotifications()
    const quickActions = useWatchQuickActions()
    const settings = useWatchSettings()
    const sessions = useWatchSessions()
    const metrics = useWatchMetrics()
    const health = useWatchHealth()

    return {
        connection,
        complications,
        notifications,
        quickActions,
        settings,
        sessions,
        metrics,
        health,
        isSupported: watchService.isWatchConnected()
    }
}

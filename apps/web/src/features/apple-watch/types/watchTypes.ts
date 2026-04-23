export interface WatchApp {
    id: string
    name: string
    version: string
    complications: WatchComplication[]
    workouts: WatchWorkout[]
    notifications: WatchNotification[]
    settings: WatchSettings
    lastSync: number
}

export interface WatchComplication {
    id: string
    type: ComplicationType
    family: ComplicationFamily
    displayName: string
    data: Record<string, any>
    updateFrequency: number
    isActive: boolean
}

export type ComplicationType =
    | 'urgent_contracts'
    | 'daily_stats'
    | 'next_meeting'
    | 'risk_alerts'
    | 'quick_actions'

export type ComplicationFamily =
    | 'modularSmall'
    | 'modularLarge'
    | 'utilitarianSmall'
    | 'utilitarianLarge'
    | 'circularSmall'
    | 'extraLarge'
    | 'graphicCorner'
    | 'graphicBezel'
    | 'graphicCircular'
    | 'graphicRectangular'

export interface WatchWorkout {
    id: string
    type: 'legal_research' | 'document_review' | 'client_meeting'
    startTime: number
    endTime?: number
    duration: number
    metrics: WorkoutMetrics
    isActive: boolean
}

export interface WorkoutMetrics {
    documentsReviewed?: number
    contractsAnalyzed?: number
    meetingMinutes?: number
    tasksCompleted?: number
    productivityScore?: number
}

export interface WatchNotification {
    id: string
    title: string
    subtitle?: string
    body: string
    category: NotificationCategory
    actions: NotificationAction[]
    priority: 'low' | 'medium' | 'high' | 'critical'
    scheduledTime?: number
    isUrgent: boolean
}

export type NotificationCategory =
    | 'contract_expiry'
    | 'meeting_reminder'
    | 'document_approval'
    | 'risk_alert'
    | 'deadline_warning'
    | 'client_message'

export interface NotificationAction {
    id: string
    title: string
    type: 'approve' | 'decline' | 'snooze' | 'view' | 'call'
    icon?: string
    requiresUnlock?: boolean
}

export interface WatchSettings {
    notifications: {
        enabled: boolean
        urgentOnly: boolean
        quietHours: {
            enabled: boolean
            startTime: string
            endTime: string
        }
    }
    complications: {
        autoUpdate: boolean
        updateInterval: number
        showPreview: boolean
    }
    connectivity: {
        syncFrequency: number
        wifiSync: boolean
        cellularSync: boolean
    }
    accessibility: {
        largeText: boolean
        hapticFeedback: boolean
        voiceOver: boolean
    }
}

export interface WatchHealthData {
    heartRate?: number
    steps?: number
    activeEnergy?: number
    workoutMinutes?: number
    standHours?: number
    timestamp: number
}

export interface WatchConnectivity {
    isReachable: boolean
    isPaired: boolean
    isWatchAppInstalled: boolean
    watchOS: string
    appVersion?: string
    lastConnection: number
    connectionType: 'bluetooth' | 'wifi' | 'cellular' | 'none'
}

export interface WatchQuickAction {
    id: string
    title: string
    icon: string
    action: string
    parameters?: Record<string, any>
    requiresAuth?: boolean
    isEnabled: boolean
}

export interface WatchVoiceCommand {
    id: string
    phrase: string
    action: string
    parameters?: Record<string, any>
    language: string
    isEnabled: boolean
}

export interface WatchMetrics {
    dailyInteractions: number
    notificationsReceived: number
    notificationsActioned: number
    complicationViews: number
    avgResponseTime: number
    batteryLevel?: number
    lastActivity: number
}

export interface WatchSession {
    id: string
    startTime: number
    endTime?: number
    type: 'document_review' | 'meeting' | 'research' | 'general'
    metrics: SessionMetrics
    notes?: string
}

export interface SessionMetrics {
    duration: number
    interactions: number
    notifications: number
    complications: number
    productivity: number
}

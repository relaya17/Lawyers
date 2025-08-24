// שירות התראות מתקדם - ContractLab Pro
// התראות מערכת, Push notifications וניהול התראות

import { logger } from '../utils/logger'

export interface Notification {
    id: string
    title: string
    message: string
    type: 'info' | 'success' | 'warning' | 'error' | 'contract' | 'system' | 'reminder' | 'security'
    priority: 'low' | 'medium' | 'high' | 'urgent'
    category: 'contract' | 'security' | 'system' | 'reminder' | 'collaboration'
    timestamp: Date
    read: boolean
    actionUrl?: string
    actionText?: string
    metadata?: Record<string, unknown>
    expiresAt?: Date
    userId?: string
}

export interface NotificationSettings {
    email: boolean
    push: boolean
    inApp: boolean
    categories: {
        contract: boolean
        security: boolean
        system: boolean
        reminder: boolean
        collaboration: boolean
    }
    quietHours: {
        enabled: boolean
        start: string // "22:00"
        end: string // "08:00"
    }
    frequency: 'immediate' | 'hourly' | 'daily' | 'weekly'
}

export interface NotificationTemplate {
    id: string
    name: string
    title: string
    message: string
    type: Notification['type']
    priority: Notification['priority']
    category: Notification['category']
    variables: string[]
}

class NotificationService {
    private notifications: Notification[] = []
    private settings!: NotificationSettings
    private templates: Map<string, NotificationTemplate> = new Map()
    private listeners: Map<string, (() => void)[]> = new Map()
    private pushSubscription: PushSubscription | null = null

    constructor() {
        this.loadSettings()
        this.loadNotifications()
        this.initializeTemplates()
        this.requestNotificationPermission()
    }

    // יצירת התראה חדשה
    createNotification(
        title: string,
        message: string,
        type: Notification['type'] = 'info',
        priority: Notification['priority'] = 'medium',
        category: Notification['category'] = 'system',
        options?: Partial<Notification>
    ): Notification {
        const notification: Notification = {
            id: this.generateId(),
            title,
            message,
            type,
            priority,
            category,
            timestamp: new Date(),
            read: false,
            ...options
        }

        this.notifications.unshift(notification)
        this.persistNotifications()
        this.emit('notification_created')

        // שליחה לפי הגדרות
        this.sendNotification(notification)

        return notification
    }

    // יצירת התראה מתבנית
    createFromTemplate(
        templateId: string,
        variables: Record<string, string>,
        options?: Partial<Notification>
    ): Notification | null {
        const template = this.templates.get(templateId)
        if (!template) return null

        let title = template.title
        let message = template.message

        // החלפת משתנים
        template.variables.forEach(variable => {
            const value = variables[variable] || `{{${variable}}}`
            title = title.replace(`{{${variable}}}`, value)
            message = message.replace(`{{${variable}}}`, value)
        })

        return this.createNotification(
            title,
            message,
            template.type,
            template.priority,
            template.category,
            options
        )
    }

    // התראות חוזים
    createContractNotification(
        contractId: string,
        action: 'created' | 'updated' | 'expired' | 'signed' | 'reviewed',
        contractTitle: string
    ): Notification {
        const templates = {
            created: { title: 'חוזה חדש נוצר', message: 'החוזה "{{title}}" נוצר בהצלחה' },
            updated: { title: 'חוזה עודכן', message: 'החוזה "{{title}}" עודכן' },
            expired: { title: 'חוזה פג תוקף', message: 'החוזה "{{title}}" פג תוקף' },
            signed: { title: 'חוזה נחתם', message: 'החוזה "{{title}}" נחתם' },
            reviewed: { title: 'חוזה נבדק', message: 'החוזה "{{title}}" נבדק' }
        }

        const template = templates[action]
        return this.createNotification(
            template.title,
            template.message.replace('{{title}}', contractTitle),
            'contract',
            action === 'expired' ? 'high' : 'medium',
            'contract',
            {
                actionUrl: `/contracts/${contractId}`,
                actionText: 'צפה בחוזה',
                metadata: { contractId, action }
            }
        )
    }

    // התראות אבטחה
    createSecurityNotification(
        type: 'login' | 'logout' | 'password_change' | 'suspicious_activity',
        details: string
    ): Notification {
        const templates = {
            login: { title: 'התחברות חדשה', message: 'התחברת למערכת מ-{{details}}' },
            logout: { title: 'התנתקות', message: 'התנתקת מהמערכת' },
            password_change: { title: 'סיסמה שונתה', message: 'הסיסמה שלך שונתה בהצלחה' },
            suspicious_activity: { title: 'פעילות חשודה', message: 'זוהתה פעילות חשודה: {{details}}' }
        }

        const template = templates[type]
        return this.createNotification(
            template.title,
            template.message.replace('{{details}}', details),
            'security',
            type === 'suspicious_activity' ? 'urgent' : 'medium',
            'security',
            {
                metadata: { type, details }
            }
        )
    }

    // התראות תזכורת
    createReminderNotification(
        title: string,
        message: string,
        dueDate: Date,
        priority: Notification['priority'] = 'medium'
    ): Notification {
        return this.createNotification(
            title,
            message,
            'reminder',
            priority,
            'reminder',
            {
                expiresAt: dueDate,
                metadata: { dueDate: dueDate.toISOString() }
            }
        )
    }

    // שליחת התראה
    private async sendNotification(notification: Notification): Promise<void> {
        // בדיקת הגדרות
        if (!this.shouldSendNotification(notification)) return

        // התראה באפליקציה
        if (this.settings.inApp) {
            this.showInAppNotification()
        }

        // Push notification
        if (this.settings.push && this.pushSubscription) {
            await this.sendPushNotification(notification)
        }

        // התראה במערכת
        if ('Notification' in window && Notification.permission === 'granted') {
            this.showSystemNotification(notification)
        }
    }

    // בדיקה האם לשלוח התראה
    private shouldSendNotification(notification: Notification): boolean {
        // בדיקת שעות שקט
        if (this.settings.quietHours.enabled) {
            const now = new Date()
            const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`

            if (this.isInQuietHours(currentTime)) {
                return notification.priority === 'urgent'
            }
        }

        // בדיקת קטגוריה
        return this.settings.categories[notification.category]
    }

    // בדיקת שעות שקט
    private isInQuietHours(currentTime: string): boolean {
        const { start, end } = this.settings.quietHours

        if (start <= end) {
            return currentTime >= start && currentTime <= end
        } else {
            // מעבר חצות
            return currentTime >= start || currentTime <= end
        }
    }

    // הצגת התראה באפליקציה
    private showInAppNotification(): void {
        this.emit('show_notification')
    }

    // שליחת Push notification
    private async sendPushNotification(notification: Notification): Promise<void> {
        if (!this.pushSubscription) return

        try {
            const response = await fetch('/api/notifications/push', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    subscription: this.pushSubscription,
                    notification: {
                        title: notification.title,
                        body: notification.message,
                        icon: '/icons/icon-192x192.png',
                        badge: '/icons/badge-72x72.png',
                        data: {
                            notificationId: notification.id,
                            actionUrl: notification.actionUrl
                        }
                    }
                })
            })

            if (!response.ok) {
                logger.error('Failed to send push notification')
            }
        } catch (error) {
            logger.error('Push notification error:', error)
        }
    }

    // הצגת התראה במערכת
    private showSystemNotification(notification: Notification): void {
        const systemNotification = new Notification(notification.title, {
            body: notification.message,
            icon: '/icons/icon-192x192.png',
            badge: '/icons/badge-72x72.png',
            tag: notification.id,
            requireInteraction: notification.priority === 'urgent',
            // Note: actions property is not supported in all browsers
            // actions: notification.actionText ? [
            //     {
            //         action: 'view',
            //         title: notification.actionText,
            //         icon: '/icons/checkmark.png'
            //     }
            // ] : undefined
        })

        // טיפול בלחיצות
        systemNotification.onclick = () => {
            if (notification.actionUrl) {
                window.open(notification.actionUrl, '_blank')
            }
            systemNotification.close()
        }

        // Note: onactionclick is not supported in all browsers
        // systemNotification.onactionclick = (event: any) => {
        //     if (event.action === 'view' && notification.actionUrl) {
        //         window.open(notification.actionUrl, '_blank')
        //     }
        //     systemNotification.close()
        // }

        // סגירה אוטומטית
        if (notification.priority !== 'urgent') {
            setTimeout(() => systemNotification.close(), 5000)
        }
    }

    // סימון כנקרא
    markAsRead(notificationId: string): void {
        const notification = this.notifications.find(n => n.id === notificationId)
        if (notification) {
            notification.read = true
            this.persistNotifications()
            this.emit('notification_read')
        }
    }

    // סימון הכל כנקרא
    markAllAsRead(): void {
        this.notifications.forEach(n => n.read = true)
        this.persistNotifications()
        this.emit('all_notifications_read')
    }

    // מחיקת התראה
    deleteNotification(notificationId: string): void {
        const index = this.notifications.findIndex(n => n.id === notificationId)
        if (index > -1) {
            this.notifications.splice(index, 1)
            this.persistNotifications()
            this.emit('notification_deleted')
        }
    }

    // ניקוי התראות ישנות
    cleanupOldNotifications(daysToKeep: number = 30): void {
        const cutoffDate = new Date()
        cutoffDate.setDate(cutoffDate.getDate() - daysToKeep)

        const initialCount = this.notifications.length
        this.notifications = this.notifications.filter(n =>
            n.timestamp > cutoffDate || n.priority === 'urgent'
        )

        if (this.notifications.length < initialCount) {
            this.persistNotifications()
            this.emit('notifications_cleaned')
        }
    }

    // קבלת התראות
    getNotifications(
        filters?: {
            read?: boolean
            type?: Notification['type']
            category?: Notification['category']
            priority?: Notification['priority']
        }
    ): Notification[] {
        let filtered = this.notifications

        if (filters) {
            if (filters.read !== undefined) {
                filtered = filtered.filter(n => n.read === filters.read)
            }
            if (filters.type) {
                filtered = filtered.filter(n => n.type === filters.type)
            }
            if (filters.category) {
                filtered = filtered.filter(n => n.category === filters.category)
            }
            if (filters.priority) {
                filtered = filtered.filter(n => n.priority === filters.priority)
            }
        }

        return filtered
    }

    // קבלת התראות שלא נקראו
    getUnreadCount(): number {
        return this.notifications.filter(n => !n.read).length
    }

    // קבלת התראות דחופות
    getUrgentNotifications(): Notification[] {
        return this.notifications.filter(n => n.priority === 'urgent' && !n.read)
    }

    // עדכון הגדרות
    updateSettings(settings: Partial<NotificationSettings>): void {
        this.settings = { ...this.settings, ...settings }
        this.persistSettings()
        this.emit('settings_updated')
    }

    // קבלת הגדרות
    getSettings(): NotificationSettings {
        return { ...this.settings }
    }

    // בקשת הרשאה להתראות
    private async requestNotificationPermission(): Promise<void> {
        if ('Notification' in window && Notification.permission === 'default') {
            const permission = await Notification.requestPermission()
            if (permission === 'granted') {
                this.registerPushSubscription()
            }
        }
    }

    // רישום Push subscription
    private async registerPushSubscription(): Promise<void> {
        if ('serviceWorker' in navigator && 'PushManager' in window) {
            try {
                const registration = await navigator.serviceWorker.ready
                const vapidKey = import.meta.env.VITE_VAPID_PUBLIC_KEY || ''
                if (vapidKey) {
                    this.pushSubscription = await registration.pushManager.subscribe({
                        userVisibleOnly: true,
                        applicationServerKey: this.urlBase64ToUint8Array(vapidKey)
                    })
                } else {
                    this.pushSubscription = await registration.pushManager.subscribe({
                        userVisibleOnly: true
                    })
                }

                // שליחה לשרת
                await fetch('/api/notifications/subscribe', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ subscription: this.pushSubscription })
                })
            } catch (error) {
                logger.error('Failed to register push subscription:', error)
            }
        }
    }

    // המרת VAPID key
    private urlBase64ToUint8Array(base64String: string): ArrayBuffer {
        const padding = '='.repeat((4 - base64String.length % 4) % 4)
        const base64 = (base64String + padding)
            .replace(/-/g, '+')
            .replace(/_/g, '/')

        const rawData = window.atob(base64)
        const outputArray = new Uint8Array(rawData.length)

        for (let i = 0; i < rawData.length; ++i) {
            outputArray[i] = rawData.charCodeAt(i)
        }
        return outputArray.buffer
    }

    // מערכת אירועים
    on(event: string, callback: () => void): void {
        if (!this.listeners.has(event)) {
            this.listeners.set(event, [])
        }
        this.listeners.get(event)!.push(callback)
    }

    off(event: string, callback: () => void): void {
        const callbacks = this.listeners.get(event)
        if (callbacks) {
            const index = callbacks.indexOf(callback)
            if (index > -1) {
                callbacks.splice(index, 1)
            }
        }
    }

    private emit(event: string): void {
        const callbacks = this.listeners.get(event)
        if (callbacks) {
            callbacks.forEach(callback => callback())
        }
    }

    // אתחול תבניות
    private initializeTemplates(): void {
        const templates: NotificationTemplate[] = [
            {
                id: 'contract_created',
                name: 'חוזה נוצר',
                title: 'חוזה חדש נוצר',
                message: 'החוזה "{{title}}" נוצר בהצלחה על ידי {{user}}',
                type: 'contract',
                priority: 'medium',
                category: 'contract',
                variables: ['title', 'user']
            },
            {
                id: 'contract_expired',
                name: 'חוזה פג תוקף',
                title: 'חוזה פג תוקף',
                message: 'החוזה "{{title}}" פג תוקף ב-{{date}}',
                type: 'warning',
                priority: 'high',
                category: 'contract',
                variables: ['title', 'date']
            },
            {
                id: 'security_alert',
                name: 'התראת אבטחה',
                title: 'התראת אבטחה',
                message: '{{message}}',
                type: 'error',
                priority: 'urgent',
                category: 'security',
                variables: ['message']
            }
        ]

        templates.forEach(template => {
            this.templates.set(template.id, template)
        })
    }

    // יצירת מזהה ייחודי
    private generateId(): string {
        return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    }

    // שמירת התראות
    private persistNotifications(): void {
        try {
            localStorage.setItem('notifications', JSON.stringify(this.notifications))
        } catch (error) {
            logger.error('Failed to persist notifications:', error)
        }
    }

    // טעינת התראות
    private loadNotifications(): void {
        try {
            const saved = localStorage.getItem('notifications')
            if (saved) {
                this.notifications = JSON.parse(saved).map((n: Record<string, unknown>) => ({
                    ...n,
                    timestamp: new Date(n.timestamp as string)
                }))
            }
        } catch (error) {
            logger.error('Failed to load notifications:', error)
            this.notifications = []
        }
    }

    // שמירת הגדרות
    private persistSettings(): void {
        try {
            localStorage.setItem('notification_settings', JSON.stringify(this.settings))
        } catch (error) {
            logger.error('Failed to persist notification settings:', error)
        }
    }

    // טעינת הגדרות
    private loadSettings(): void {
        try {
            const saved = localStorage.getItem('notification_settings')
            if (saved) {
                this.settings = JSON.parse(saved)
            } else {
                this.settings = {
                    email: true,
                    push: true,
                    inApp: true,
                    categories: {
                        contract: true,
                        security: true,
                        system: true,
                        reminder: true,
                        collaboration: true
                    },
                    quietHours: {
                        enabled: false,
                        start: '22:00',
                        end: '08:00'
                    },
                    frequency: 'immediate'
                }
            }
        } catch (error) {
            logger.error('Failed to load notification settings:', error)
            this.settings = {
                email: true,
                push: true,
                inApp: true,
                categories: {
                    contract: true,
                    security: true,
                    system: true,
                    reminder: true,
                    collaboration: true
                },
                quietHours: {
                    enabled: false,
                    start: '22:00',
                    end: '08:00'
                },
                frequency: 'immediate'
            }
        }
    }
}

// יצירת instance גלובלי
export const notificationService = new NotificationService()

// הוספה ל-window לנגישות גלובלית
declare global {
    interface Window {
        notifications: typeof notificationService
    }
}

window.notifications = notificationService

// שירות אנליטיקה מתקדם - ContractLab Pro
// מעקב ביצועים, נגישות ומדדי משתמש

import { logger } from '../utils/logger'

export interface AnalyticsEvent {
    event: string
    category: string
    action: string
    label?: string
    value?: number
    timestamp: number
    userId?: string
    sessionId: string
    page: string
    userAgent: string
    viewport: {
        width: number
        height: number
    }
    accessibility: {
        highContrast: boolean
        reducedMotion: boolean
        screenReader: boolean
    }
}

export interface PerformanceMetrics {
    fcp: number // First Contentful Paint
    lcp: number // Largest Contentful Paint
    fid: number // First Input Delay
    cls: number // Cumulative Layout Shift
    ttfb: number // Time to First Byte
    domLoad: number
    windowLoad: number
}

export interface UserBehavior {
    pageViews: number
    sessionDuration: number
    bounceRate: number
    conversionRate: number
    errorRate: number
    accessibilityScore: number
}

class AnalyticsService {
    private events: AnalyticsEvent[] = []
    private sessionId: string
    private userId?: string
    private isOnline: boolean = navigator.onLine

    constructor() {
        this.sessionId = this.generateSessionId()
        this.setupEventListeners()
        this.trackPerformance()
    }

    // מעקב אירועים
    trackEvent(category: string, action: string, label?: string, value?: number) {
        const event: AnalyticsEvent = {
            event: 'interaction',
            category,
            action,
            label,
            value,
            timestamp: Date.now(),
            userId: this.userId,
            sessionId: this.sessionId,
            page: window.location.pathname,
            userAgent: navigator.userAgent,
            viewport: {
                width: window.innerWidth,
                height: window.innerHeight
            },
            accessibility: this.getAccessibilityInfo()
        }

        this.events.push(event)
        this.sendEvent(event)
    }

    // מעקב ביצועים
    private trackPerformance() {
        if ('PerformanceObserver' in window) {
            // Core Web Vitals
            const observer = new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                    this.trackPerformanceMetric(entry)
                }
            })

            observer.observe({ entryTypes: ['paint', 'largest-contentful-paint', 'first-input', 'layout-shift'] })
        }

        // DOM Load Time
        window.addEventListener('DOMContentLoaded', () => {
            const domLoad = performance.now()
            this.trackEvent('performance', 'dom_load', 'DOM Content Loaded', Math.round(domLoad))
        })

        // Window Load Time
        window.addEventListener('load', () => {
            const windowLoad = performance.now()
            this.trackEvent('performance', 'window_load', 'Window Loaded', Math.round(windowLoad))
        })
    }

    private trackPerformanceMetric(entry: PerformanceEntry) {
        switch (entry.entryType) {
            case 'paint':
                if (entry.name === 'first-contentful-paint') {
                    this.trackEvent('performance', 'fcp', 'First Contentful Paint', Math.round(entry.startTime))
                }
                break
            case 'largest-contentful-paint': {
                this.trackEvent('performance', 'lcp', 'Largest Contentful Paint', Math.round(entry.startTime))
                break
            }
            case 'first-input': {
                const fidEntry = entry as PerformanceEventTiming
                this.trackEvent('performance', 'fid', 'First Input Delay', Math.round(fidEntry.processingStart - entry.startTime))
                break
            }
            case 'layout-shift': {
                const clsEntry = entry as PerformanceEntry & { value: number }
                this.trackEvent('performance', 'cls', 'Cumulative Layout Shift', Math.round(clsEntry.value * 1000))
                break
            }
        }
    }

    // מעקב נגישות
    private getAccessibilityInfo() {
        return {
            highContrast: window.matchMedia('(prefers-contrast: high)').matches,
            reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
            screenReader: this.detectScreenReader()
        }
    }

    private detectScreenReader(): boolean {
        // זיהוי קורא מסך בסיסי
        const ariaLive = document.querySelector('[aria-live]')
        const hasAria = document.querySelector('[aria-label], [aria-labelledby]')
        return !!(ariaLive || hasAria)
    }

    // מעקב שגיאות
    trackError(error: Error, context?: string) {
        this.trackEvent('error', 'javascript_error', context || error.message, 1)

        // שליחה לשרת
        this.sendError({
            message: error.message,
            stack: error.stack,
            context,
            timestamp: Date.now(),
            url: window.location.href,
            userAgent: navigator.userAgent
        })
    }

    // מעקב נגישות
    trackAccessibilityIssue(issue: string, severity: 'low' | 'medium' | 'high') {
        this.trackEvent('accessibility', 'issue_detected', issue, severity === 'high' ? 3 : severity === 'medium' ? 2 : 1)
    }

    // מעקב שימוש בתכונות
    trackFeatureUsage(feature: string, action: string) {
        this.trackEvent('feature', action, feature)
    }

    // מעקב ניווט
    trackNavigation(from: string, to: string) {
        this.trackEvent('navigation', 'page_view', `${from} -> ${to}`)
    }

    // מעקב טפסים
    trackFormInteraction(formName: string, action: 'start' | 'complete' | 'abandon') {
        this.trackEvent('form', action, formName)
    }

    // מעקב חיפוש
    trackSearch(query: string, results: number) {
        this.trackEvent('search', 'query', query, results)
    }

    // מעקב הורדות
    trackDownload(fileType: string, fileName: string) {
        this.trackEvent('download', 'file', `${fileType}:${fileName}`)
    }

    // הגדרת משתמש
    setUserId(userId: string) {
        this.userId = userId
    }

    // שליחת אירועים
    private async sendEvent(event: AnalyticsEvent) {
        // Skip analytics in development mode
        if (import.meta.env.DEV) {
            return
        }

        if (!this.isOnline) {
            this.storeOfflineEvent(event)
            return
        }

        try {
            // Check if analytics endpoint exists
            const response = await fetch('/api/analytics/event', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(event)
            })

            if (!response.ok) {
                // If endpoint doesn't exist or returns error, store offline
                this.storeOfflineEvent(event)
            }
        } catch (error) {
            logger.warn('Analytics error endpoint not available')
        }
    }

    private async sendError(errorData: Record<string, unknown>) {
        // Skip analytics in development mode
        if (import.meta.env.DEV) {
            return
        }

        if (!this.isOnline) return

        try {
            const response = await fetch('/api/analytics/error', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(errorData)
            })

            if (!response.ok) {
                logger.warn('Analytics error endpoint not available')
            }
        } catch (error) {
            logger.warn('Analytics error endpoint not available')
        }
    }

    // אחסון אירועים אופליין
    private storeOfflineEvent(event: AnalyticsEvent) {
        const offlineEvents = JSON.parse(localStorage.getItem('analytics_offline') || '[]')
        offlineEvents.push(event)
        localStorage.setItem('analytics_offline', JSON.stringify(offlineEvents.slice(-100))) // שמירת 100 אירועים אחרונים
    }

    // סנכרון אירועים אופליין
    async syncOfflineEvents() {
        const offlineEvents = JSON.parse(localStorage.getItem('analytics_offline') || '[]')
        if (offlineEvents.length === 0) return

        try {
            const response = await fetch('/api/analytics/batch', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ events: offlineEvents })
            })

            if (response.ok) {
                localStorage.removeItem('analytics_offline')
            }
        } catch (error) {
            logger.warn('Analytics batch endpoint not available')
        }
    }

    // הגדרת מאזינים
    private setupEventListeners() {
        // מעקב חיבור לאינטרנט
        window.addEventListener('online', () => {
            this.isOnline = true
            this.syncOfflineEvents()
        })

        window.addEventListener('offline', () => {
            this.isOnline = false
        })

        // מעקב שגיאות גלובליות
        window.addEventListener('error', (event) => {
            this.trackError(event.error, 'global_error')
        })

        window.addEventListener('unhandledrejection', (event) => {
            this.trackError(new Error(event.reason), 'unhandled_promise')
        })
    }

    // יצירת מזהה סשן
    private generateSessionId(): string {
        return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    }

    // קבלת סטטיסטיקות
    getStats(): UserBehavior {
        const pageViews = this.events.filter(e => e.event === 'interaction' && e.category === 'navigation').length
        const errors = this.events.filter(e => e.event === 'interaction' && e.category === 'error').length
        const totalEvents = this.events.length

        return {
            pageViews,
            sessionDuration: Date.now() - this.events[0]?.timestamp || 0,
            bounceRate: pageViews <= 1 ? 100 : 0,
            conversionRate: 0, // לחישוב בהמשך
            errorRate: totalEvents > 0 ? (errors / totalEvents) * 100 : 0,
            accessibilityScore: this.calculateAccessibilityScore()
        }
    }

    private calculateAccessibilityScore(): number {
        const accessibilityEvents = this.events.filter(e => e.category === 'accessibility')
        const issues = accessibilityEvents.filter(e => e.action === 'issue_detected').length
        const total = accessibilityEvents.length

        if (total === 0) return 100
        return Math.max(0, 100 - (issues / total) * 100)
    }
}

// יצירת instance גלובלי
export const analyticsService = new AnalyticsService()

// הוספה ל-window לנגישות גלובלית
declare global {
    interface Window {
        analytics: typeof analyticsService
    }
}

window.analytics = analyticsService

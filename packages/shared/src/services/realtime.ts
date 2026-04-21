// שירות Real-time מתקדם - ContractLab Pro
// WebSocket, שיתוף פעולה בזמן אמת והתראות

// Local config for shared package
import { logger } from '../utils/logger'

const apiConfig = {
    websocket: {
        url: import.meta.env.PROD
            ? import.meta.env.VITE_WEBSOCKET_URL || 'wss://api.contractlab.pro'
            : 'ws://localhost:5174'
    }
}

export interface RealtimeMessage {
    id: string
    type: 'contract_update' | 'user_activity' | 'notification' | 'chat' | 'collaboration'
    sender: string
    content: Record<string, unknown>
    timestamp: Date
    room?: string
    metadata?: Record<string, unknown>
}

export interface CollaborationSession {
    id: string
    contractId: string
    participants: string[]
    lastActivity: Date
    status: 'active' | 'paused' | 'ended'
}

export interface UserPresence {
    userId: string
    status: 'online' | 'away' | 'busy' | 'offline'
    lastSeen: Date
    currentPage?: string
}

class RealtimeService {
    private ws: WebSocket | null = null
    private reconnectAttempts = 0
    private maxReconnectAttempts = 5
    private reconnectDelay = 1000
    private heartbeatInterval: number | null = null
    private messageQueue: RealtimeMessage[] = []
    private listeners: Map<string, ((data?: unknown) => void)[]> = new Map()
    private rooms: Set<string> = new Set()
    private isConnected = false
    private eventListeners: Array<{ event: string; handler: EventListener }> = []

    constructor() {
        this.setupEventListeners()
        // לא מתחברים אוטומטית ב-development או אם אין שרת WebSocket
        if (import.meta.env.PROD) {
            const configUrl = apiConfig.websocket.url
            if (configUrl && !configUrl.includes('undefined')) {
                this.connect()
            }
        }
        // In development, only connect if explicitly requested
    }

    // התחברות ל-WebSocket
    connect(url?: string) {
        try {
            // Use provided URL or construct from config with fallback
            let wsUrl = url
            if (!wsUrl) {
                const configUrl = apiConfig.websocket.url
                if (configUrl && !configUrl.includes('undefined')) {
                    wsUrl = `${configUrl}/realtime`
                } else {
                    // Fallback to development WebSocket URL
                    wsUrl = 'ws://localhost:5174/realtime'
                }
            }

            // בדיקה שהפורט מוגדר
            if (!wsUrl || wsUrl.includes('undefined') || wsUrl.includes('localhost:undefined')) {
                logger.warn('WebSocket URL is not properly configured, skipping connection')
                return
            }

            logger.info('Attempting to connect to WebSocket:', wsUrl)
            this.ws = new WebSocket(wsUrl)
            this.setupWebSocketHandlers()
        } catch (error) {
            logger.error('Failed to connect to WebSocket:', error)
            this.scheduleReconnect()
        }
    }

    // הגדרת מאזיני WebSocket
    private setupWebSocketHandlers() {
        if (!this.ws) return

        this.ws.onopen = () => {
            logger.info('✅ WebSocket connected')
            this.isConnected = true
            this.reconnectAttempts = 0
            this.startHeartbeat()
            this.flushMessageQueue()
            this.emit('connected')
        }

        this.ws.onmessage = (event) => {
            try {
                const message: RealtimeMessage = JSON.parse(event.data)
                this.handleMessage(message)
            } catch (error) {
                logger.error('Failed to parse WebSocket message:', error)
            }
        }

        this.ws.onclose = () => {
            logger.info('❌ WebSocket disconnected')
            this.isConnected = false
            this.stopHeartbeat()
            this.emit('disconnected')
            this.scheduleReconnect()
        }

        this.ws.onerror = (error: Event) => {
            logger.error('WebSocket error:', error)
            this.emit('error', error)
        }
    }

    // טיפול בהודעות נכנסות
    private handleMessage(message: RealtimeMessage) {
        switch (message.type) {
            case 'contract_update': {
                this.handleContractUpdate(message)
                break
            }
            case 'user_activity': {
                this.handleUserActivity(message)
                break
            }
            case 'notification': {
                this.handleNotification(message)
                break
            }
            case 'chat': {
                this.handleChatMessage(message)
                break
            }
            case 'collaboration': {
                this.handleCollaborationUpdate(message)
                break
            }
            default: {
                logger.warn('Unknown message type:', message.type)
            }
        }

        this.emit('message', message)
    }

    // שליחת הודעה
    send(message: Omit<RealtimeMessage, 'id' | 'timestamp'>) {
        const fullMessage: RealtimeMessage = {
            ...message,
            id: this.generateId(),
            timestamp: new Date(),
        }

        if (this.isConnected && this.ws) {
            this.ws.send(JSON.stringify(fullMessage))
        } else {
            this.messageQueue.push(fullMessage)
        }
    }

    // הצטרפות לחדר
    joinRoom(roomId: string) {
        this.rooms.add(roomId)
        this.send({
            type: 'collaboration',
            sender: 'system',
            content: { action: 'join_room', roomId },
            room: roomId,
        })
    }

    // יציאה מחדר
    leaveRoom(roomId: string) {
        this.rooms.delete(roomId)
        this.send({
            type: 'collaboration',
            sender: 'system',
            content: { action: 'leave_room', roomId },
            room: roomId,
        })
    }

    // עדכון נוכחות
    updatePresence(presence: Partial<UserPresence>) {
        this.send({
            type: 'user_activity',
            sender: 'system',
            content: { action: 'update_presence', presence },
        })
    }

    // שליחת הודעת צ'אט
    sendChatMessage(content: string, roomId?: string) {
        this.send({
            type: 'chat',
            sender: 'user',
            content: { text: content },
            room: roomId,
        })
    }

    // עדכון חוזה בזמן אמת
    updateContract(contractId: string, updates: Record<string, unknown>) {
        this.send({
            type: 'contract_update',
            sender: 'user',
            content: { contractId, updates },
            metadata: { contractId },
        })
    }

    // טיפול בעדכוני חוזים
    private handleContractUpdate(message: RealtimeMessage) {
        const { contractId, updates } = message.content
        this.emit('contract_updated', { contractId, updates, sender: message.sender })
    }

    // טיפול בפעילות משתמש
    private handleUserActivity(message: RealtimeMessage) {
        const { action, data } = message.content
        this.emit('user_activity', { action, data, sender: message.sender })
    }

    // טיפול בהתראות
    private handleNotification(message: RealtimeMessage) {
        const { title, body, type } = message.content
        this.emit('notification', { title, body, type, sender: message.sender })

        // הצגת התראה במערכת
        if ('Notification' in window && Notification.permission === 'granted') {
            new Notification(title as string, { body: body as string, icon: '/icons/icon-192x192.png' })
        }
    }

    // טיפול בהודעות צ'אט
    private handleChatMessage(message: RealtimeMessage) {
        const { text } = message.content
        this.emit('chat_message', { text, sender: message.sender, room: message.room })
    }

    // טיפול בעדכוני שיתוף פעולה
    private handleCollaborationUpdate(message: RealtimeMessage) {
        const { action, data } = message.content
        this.emit('collaboration_update', { action, data, sender: message.sender })
    }

    // מערכת אירועים
    on(event: string, callback: (data?: unknown) => void) {
        if (!this.listeners.has(event)) {
            this.listeners.set(event, [])
        }
        this.listeners.get(event)!.push(callback)
    }

    off(event: string, callback: (data?: unknown) => void) {
        const callbacks = this.listeners.get(event)
        if (callbacks) {
            const index = callbacks.indexOf(callback)
            if (index > -1) {
                callbacks.splice(index, 1)
            }
        }
    }

    private emit(event: string, data?: unknown) {
        const callbacks = this.listeners.get(event)
        if (callbacks) {
            callbacks.forEach(callback => callback(data))
        }
    }

    // Heartbeat
    private startHeartbeat() {
        this.heartbeatInterval = window.setInterval(() => {
            if (this.isConnected && this.ws) {
                this.ws.send(JSON.stringify({ type: 'heartbeat', timestamp: Date.now() }))
            }
        }, 30000) // כל 30 שניות
    }

    private stopHeartbeat() {
        if (this.heartbeatInterval) {
            window.clearInterval(this.heartbeatInterval)
            this.heartbeatInterval = null
        }
    }

    // ניסיון חיבור מחדש
    private scheduleReconnect() {
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
            this.reconnectAttempts++
            const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1)

            window.setTimeout(() => {
                logger.info(`🔄 Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})`)
                this.connect()
            }, delay)
        } else {
            logger.error('❌ Max reconnection attempts reached')
            this.emit('reconnect_failed')
        }
    }

    // ריקון תור ההודעות
    private flushMessageQueue() {
        while (this.messageQueue.length > 0) {
            const message = this.messageQueue.shift()
            if (message && this.ws) {
                this.ws.send(JSON.stringify(message))
            }
        }
    }

    // הגדרת מאזיני אירועים
    private setupEventListeners() {
        // האזנה לשינויי חיבור לאינטרנט
        const onlineHandler = () => {
            if (!this.isConnected) {
                this.connect()
            }
        }

        const offlineHandler = () => {
            this.isConnected = false
            this.emit('offline')
        }

        const beforeUnloadHandler = () => {
            this.disconnect()
        }

        window.addEventListener('online', onlineHandler)
        window.addEventListener('offline', offlineHandler)
        window.addEventListener('beforeunload', beforeUnloadHandler)

        // שמירת ה-listeners לניקוי מאוחר יותר
        this.eventListeners = [
            { event: 'online', handler: onlineHandler },
            { event: 'offline', handler: offlineHandler },
            { event: 'beforeunload', handler: beforeUnloadHandler }
        ]
    }

    // ניתוק
    disconnect() {
        if (this.ws) {
            this.ws.close()
            this.ws = null
        }
        this.isConnected = false
        this.stopHeartbeat()
        this.cleanupEventListeners()
    }

    // ניקוי event listeners
    private cleanupEventListeners() {
        this.eventListeners.forEach(({ event, handler }) => {
            window.removeEventListener(event, handler)
        })
        this.eventListeners = []
    }

    // יצירת מזהה ייחודי
    private generateId(): string {
        return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    }

    // קבלת סטטוס חיבור
    getConnectionStatus(): boolean {
        return this.isConnected
    }

    // קבלת חדרים פעילים
    getActiveRooms(): string[] {
        return Array.from(this.rooms)
    }
}

// יצירת instance גלובלי
export const realtimeService = new RealtimeService()

// Hook לשימוש ב-React
export const useRealtime = () => {
    return {
        subscribe: (event: string, callback: (data?: unknown) => void) => {
            realtimeService.on(event, callback)
            return () => realtimeService.off(event, callback)
        },
        isConnected: () => realtimeService.getConnectionStatus(),
        connect: (url?: string) => realtimeService.connect(url),
        disconnect: () => realtimeService.disconnect(),
        send: (message: Omit<RealtimeMessage, 'id' | 'timestamp'>) => realtimeService.send(message)
    }
}

// הוספה ל-window לנגישות גלובלית
declare global {
    interface Window {
        realtime: typeof realtimeService
    }
}

window.realtime = realtimeService

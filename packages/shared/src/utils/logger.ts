// Logger utility for consistent logging across the application
// כלי לוגים עקבי בכל האפליקציה

export enum LogLevel {
    DEBUG = 'debug',
    INFO = 'info',
    WARN = 'warn',
    ERROR = 'error'
}

interface LogConfig {
    level: LogLevel
    enableConsole: boolean
    enableRemote: boolean
}

class Logger {
    private config: LogConfig = {
        level: import.meta.env.DEV ? LogLevel.DEBUG : LogLevel.ERROR,
        enableConsole: import.meta.env.DEV,
        enableRemote: !import.meta.env.DEV
    }

    private shouldLog(level: LogLevel): boolean {
        const levels = Object.values(LogLevel)
        return levels.indexOf(level) >= levels.indexOf(this.config.level)
    }

    private formatMessage(level: LogLevel, message: string, data?: unknown): string {
        const timestamp = new Date().toISOString()
        const prefix = `[${timestamp}] [${level.toUpperCase()}]`

        if (data) {
            return `${prefix} ${message} ${JSON.stringify(data, null, 2)}`
        }

        return `${prefix} ${message}`
    }

    debug(message: string, data?: unknown): void {
        if (this.shouldLog(LogLevel.DEBUG)) {
            if (this.config.enableConsole) {
                console.debug(this.formatMessage(LogLevel.DEBUG, message, data))
            }
            this.sendToRemote(LogLevel.DEBUG, message, data)
        }
    }

    info(message: string, data?: unknown): void {
        if (this.shouldLog(LogLevel.INFO)) {
            if (this.config.enableConsole) {
                console.info(this.formatMessage(LogLevel.INFO, message, data))
            }
            this.sendToRemote(LogLevel.INFO, message, data)
        }
    }

    warn(message: string, data?: unknown): void {
        if (this.shouldLog(LogLevel.WARN)) {
            if (this.config.enableConsole) {
                console.warn(this.formatMessage(LogLevel.WARN, message, data))
            }
            this.sendToRemote(LogLevel.WARN, message, data)
        }
    }

    error(message: string, error?: unknown): void {
        if (this.shouldLog(LogLevel.ERROR)) {
            if (this.config.enableConsole) {
                console.error(this.formatMessage(LogLevel.ERROR, message, error))
            }
            this.sendToRemote(LogLevel.ERROR, message, error)
        }
    }

    private async sendToRemote(level: LogLevel, message: string, data?: unknown): Promise<void> {
        if (!this.config.enableRemote) return

        try {
            await fetch('/api/logs', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    level,
                    message,
                    data,
                    timestamp: new Date().toISOString(),
                    userAgent: navigator.userAgent,
                    url: window.location.href
                })
            })
        } catch (error) {
            // Fallback to console if remote logging fails
            if (this.config.enableConsole) {
                console.error('Failed to send log to remote:', error)
            }
        }
    }

    setConfig(config: Partial<LogConfig>): void {
        this.config = { ...this.config, ...config }
    }
}

export const logger = new Logger()

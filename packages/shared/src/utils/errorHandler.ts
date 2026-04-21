// Error handling utility for consistent error management
// כלי לטיפול בשגיאות עקבי בכל האפליקציה

import { logger } from './logger'

export interface AppError extends Error {
    code?: string
    statusCode?: number
    isOperational?: boolean
    context?: Record<string, any>
}

export class ServiceError extends Error implements AppError {
    public code: string
    public statusCode: number
    public isOperational: boolean
    public context?: Record<string, any>

    constructor(
        message: string,
        code: string = 'SERVICE_ERROR',
        statusCode: number = 500,
        context?: Record<string, any>
    ) {
        super(message)
        this.name = 'ServiceError'
        this.code = code
        this.statusCode = statusCode
        this.isOperational = true
        this.context = context
    }
}

export class ValidationError extends ServiceError {
    constructor(message: string, context?: Record<string, any>) {
        super(message, 'VALIDATION_ERROR', 400, context)
        this.name = 'ValidationError'
    }
}

export class AuthenticationError extends ServiceError {
    constructor(message: string = 'Authentication required', context?: Record<string, any>) {
        super(message, 'AUTHENTICATION_ERROR', 401, context)
        this.name = 'AuthenticationError'
    }
}

export class AuthorizationError extends ServiceError {
    constructor(message: string = 'Access denied', context?: Record<string, any>) {
        super(message, 'AUTHORIZATION_ERROR', 403, context)
        this.name = 'AuthorizationError'
    }
}

export class NotFoundError extends ServiceError {
    constructor(message: string = 'Resource not found', context?: Record<string, any>) {
        super(message, 'NOT_FOUND_ERROR', 404, context)
        this.name = 'NotFoundError'
    }
}

export class NetworkError extends ServiceError {
    constructor(message: string = 'Network error occurred', context?: Record<string, any>) {
        super(message, 'NETWORK_ERROR', 0, context)
        this.name = 'NetworkError'
    }
}

// Error handler class
export class ErrorHandler {
    private static instance: ErrorHandler

    private constructor() { }

    static getInstance(): ErrorHandler {
        if (!ErrorHandler.instance) {
            ErrorHandler.instance = new ErrorHandler()
        }
        return ErrorHandler.instance
    }

    // Handle errors with proper logging and user feedback
    handleError(error: Error | AppError, context?: Record<string, any>): void {
        const appError = this.normalizeError(error)

        // Log the error
        logger.error(appError.message, {
            error: appError,
            context,
            stack: appError.stack
        })

        // Handle different error types
        switch (appError.code) {
            case 'AUTHENTICATION_ERROR':
                this.handleAuthError(appError)
                break
            case 'AUTHORIZATION_ERROR':
                this.handleAuthError(appError)
                break
            case 'NETWORK_ERROR':
                this.handleNetworkError(appError)
                break
            case 'VALIDATION_ERROR':
                this.handleValidationError(appError)
                break
            default:
                this.handleGenericError(appError)
        }
    }

    // Normalize any error to AppError format
    private normalizeError(error: Error | AppError): AppError {
        if (this.isAppError(error)) {
            return error
        }

        return {
            ...error,
            code: 'UNKNOWN_ERROR',
            statusCode: 500,
            isOperational: false
        }
    }

    // Type guard for AppError
    private isAppError(error: Error | AppError): error is AppError {
        return 'code' in error && 'statusCode' in error
    }

    // Handle authentication errors
    private handleAuthError(error: AppError): void {
        // Redirect to login if not authenticated
        if (error.code === 'AUTHENTICATION_ERROR') {
            localStorage.removeItem('authToken')
            window.location.href = '/login'
        }

        // Show access denied message
        this.showUserMessage('שגיאת הרשאה', error.message, 'error')
    }

    // Handle network errors
    private handleNetworkError(error: AppError): void {
        this.showUserMessage('שגיאת רשת', 'אין חיבור לאינטרנט. אנא בדוק את החיבור ונסה שוב.', 'warning')
    }

    // Handle validation errors
    private handleValidationError(error: AppError): void {
        this.showUserMessage('שגיאת אימות', error.message, 'warning')
    }

    // Handle generic errors
    private handleGenericError(error: AppError): void {
        const message = error.isOperational
            ? error.message
            : 'אירעה שגיאה לא צפויה. אנא נסה שוב מאוחר יותר.'

        this.showUserMessage('שגיאה', message, 'error')
    }

    // Show user-friendly error messages
    private showUserMessage(title: string, message: string, type: 'error' | 'warning' | 'info'): void {
        // Dispatch custom event for UI components to handle
        const event = new CustomEvent('app-error', {
            detail: { title, message, type }
        })
        window.dispatchEvent(event)
    }

    // Create error with context
    createError(
        message: string,
        code: string = 'SERVICE_ERROR',
        statusCode: number = 500,
        context?: Record<string, any>
    ): ServiceError {
        return new ServiceError(message, code, statusCode, context)
    }

    // Wrap async functions with error handling
    async withErrorHandling<T>(
        fn: () => Promise<T>,
        context?: Record<string, any>
    ): Promise<T> {
        try {
            return await fn()
        } catch (error) {
            this.handleError(error as Error, context)
            throw error
        }
    }
}

// Export singleton instance
export const errorHandler = ErrorHandler.getInstance()

// Utility function for creating common errors
export const createServiceError = (
    message: string,
    code?: string,
    statusCode?: number,
    context?: Record<string, any>
) => errorHandler.createError(message, code, statusCode, context)

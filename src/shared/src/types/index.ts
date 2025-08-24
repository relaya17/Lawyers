// Common Types
export type ID = string

export type Timestamp = string

export type Status = 'active' | 'inactive' | 'pending' | 'completed' | 'cancelled'

// Contract Types
export type ContractType = 'rental' | 'employment' | 'partnership' | 'service' | 'nda' | 'purchase' | 'license' | 'franchise' | 'consulting' | 'other'

export type Difficulty = 'easy' | 'medium' | 'hard'

// Re-export Contract and Risk types from api/types
export type { Contract, RiskAnalysis, RiskIssue, RiskRecommendation, RiskLevel } from '../services/api/types'

export type SortOrder = 'asc' | 'desc'

export type PaginationParams = {
    page: number
    limit: number
    sortBy?: string
    sortOrder?: SortOrder
}

export type PaginatedResponse<T> = {
    data: T[]
    total: number
    page: number
    limit: number
    totalPages: number
}

// Form Types
export type FormField = {
    name: string
    label: string
    type: 'text' | 'email' | 'password' | 'number' | 'select' | 'textarea' | 'checkbox' | 'radio'
    required?: boolean
    validation?: {
        min?: number
        max?: number
        pattern?: RegExp
        message?: string
    }
    options?: Array<{ value: string; label: string }>
}

export type FormData = Record<string, unknown>

// UI Types
export type ThemeMode = 'light' | 'dark'

export type Language = 'he' | 'en' | 'ar'

export type Direction = 'ltr' | 'rtl'

export type NotificationType = 'success' | 'error' | 'warning' | 'info'

export type LoadingState = 'idle' | 'loading' | 'success' | 'error'

// API Types
export type ApiResponse<T = unknown> = {
    success: boolean
    data?: T
    message?: string
    error?: string
    code?: number
}

export type ApiError = {
    message: string
    code: number
    details?: Record<string, unknown>
}

// File Types
export type FileUpload = {
    file: File
    progress: number
    status: 'pending' | 'uploading' | 'success' | 'error'
    error?: string
}

export type FileInfo = {
    id: string
    name: string
    size: number
    type: string
    url: string
    uploadedAt: Timestamp
}

// Search Types
export type SearchFilters = {
    query?: string
    category?: string
    status?: Status
    dateFrom?: Timestamp
    dateTo?: Timestamp
    tags?: string[]
}

export type SearchResult<T> = {
    items: T[]
    total: number
    query: string
    filters: SearchFilters
}

// Export Types
export type ExportFormat = 'pdf' | 'docx' | 'xlsx' | 'csv'

export type ExportOptions = {
    format: ExportFormat
    includeMetadata?: boolean
    includeCharts?: boolean
    language?: Language
}

// Analytics Types
export type AnalyticsMetric = {
    name: string
    value: number
    unit?: string
    change?: number
    trend?: 'up' | 'down' | 'stable'
}

export type AnalyticsChart = {
    type: 'line' | 'bar' | 'pie' | 'doughnut'
    data: Array<{
        label: string
        value: number
        color?: string
    }>
    options?: Record<string, unknown>
}

// Permission Types
export type Permission = {
    resource: string
    action: 'create' | 'read' | 'update' | 'delete' | 'manage'
}

export type Role = {
    id: string
    name: string
    description: string
    permissions: Permission[]
}

// Settings Types
export type UserSettings = {
    theme: ThemeMode
    language: Language
    notifications: {
        email: boolean
        push: boolean
        sms: boolean
    }
    privacy: {
        profileVisibility: 'public' | 'private'
        activityVisibility: 'public' | 'private'
    }
}

// Activity Types
export type ActivityType =
    | 'contract_created'
    | 'contract_updated'
    | 'contract_analyzed'
    | 'simulation_completed'
    | 'negotiation_started'
    | 'template_downloaded'
    | 'user_registered'
    | 'user_logged_in'

export type Activity = {
    id: string
    type: ActivityType
    userId: string
    resourceId?: string
    resourceType?: string
    description: string
    metadata?: Record<string, unknown>
    timestamp: Timestamp
}

// Audit Types
export type AuditLog = {
    id: string
    userId: string
    action: string
    resource: string
    resourceId: string
    changes?: Record<string, { old: unknown; new: unknown }>
    ipAddress?: string
    userAgent?: string
    timestamp: Timestamp
}

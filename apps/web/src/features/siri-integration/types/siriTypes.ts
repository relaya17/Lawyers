export interface SiriShortcut {
    id: string
    title: string
    phrase: string
    description: string
    category: SiriCategory
    parameters: SiriParameter[]
    isEnabled: boolean
    usageCount: number
    lastUsed: number
    createdAt: number
}

export interface SiriParameter {
    name: string
    type: 'text' | 'number' | 'date' | 'boolean' | 'selection'
    required: boolean
    defaultValue?: string | number | boolean
    options?: string[]
    description: string
}

export type SiriCategory =
    | 'contract_management'
    | 'legal_search'
    | 'meeting_management'
    | 'document_review'
    | 'client_communication'
    | 'risk_assessment'
    | 'quick_actions'

export interface SiriIntent {
    id: string
    type: SiriIntentType
    title: string
    parameters: Record<string, any>
    response?: SiriResponse
    confidence: number
    timestamp: number
}

export type SiriIntentType =
    | 'search_contracts'
    | 'create_contract'
    | 'schedule_meeting'
    | 'review_document'
    | 'send_message'
    | 'get_status'
    | 'analyze_risk'
    | 'find_client'
    | 'check_deadlines'
    | 'emergency_contact'

export interface SiriResponse {
    text: string
    data?: Record<string, any>
    actions?: SiriAction[]
    followUp?: string
}

export interface SiriAction {
    type: 'open_app' | 'show_data' | 'send_notification' | 'make_call' | 'send_message'
    target: string
    parameters?: Record<string, any>
}

export interface SiriVoiceSettings {
    language: string
    voice: string
    rate: number
    pitch: number
    volume: number
    enabled: boolean
}

export interface SiriAccessibilitySettings {
    announceNotifications: boolean
    confirmActions: boolean
    verboseMode: boolean
    shortcuts: boolean
}

export interface SiriUsageAnalytics {
    totalInvocations: number
    successfulResponses: number
    failedResponses: number
    averageResponseTime: number
    popularShortcuts: string[]
    usageByCategory: Record<SiriCategory, number>
    lastActivity: number
}

export interface SiriSuggestion {
    id: string
    title: string
    phrase: string
    category: SiriCategory
    reason: string
    priority: 'low' | 'medium' | 'high'
    isAccepted: boolean
}

export interface SiriDonation {
    id: string
    shortcutId: string
    userActivity: string
    title: string
    timestamp: number
    success: boolean
}

export interface SiriVoiceCommand {
    id: string
    phrase: string
    variations: string[]
    intent: SiriIntentType
    parameters: SiriParameter[]
    isActive: boolean
    language: string
}

export interface SiriConversation {
    id: string
    messages: SiriMessage[]
    context: Record<string, any>
    startTime: number
    endTime?: number
    isActive: boolean
}

export interface SiriMessage {
    id: string
    role: 'user' | 'assistant'
    content: string
    timestamp: number
    intent?: SiriIntentType
    confidence?: number
}

export interface SiriConfiguration {
    shortcuts: SiriShortcut[]
    voiceSettings: SiriVoiceSettings
    accessibilitySettings: SiriAccessibilitySettings
    isEnabled: boolean
    suggestions: SiriSuggestion[]
    analytics: SiriUsageAnalytics
}

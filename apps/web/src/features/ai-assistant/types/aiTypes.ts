export interface AIRequest {
    id: string
    type: AIRequestType
    content: string
    context?: Record<string, any>
    metadata?: AIMetadata
    timestamp: number
}

export interface AIResponse {
    id: string
    requestId: string
    type: AIResponseType
    content: string
    confidence: number
    suggestions?: AISuggestion[]
    metadata?: AIMetadata
    timestamp: number
}

export interface AISuggestion {
    id: string
    type: SuggestionType
    title: string
    description: string
    action?: string
    confidence: number
    priority: 'low' | 'medium' | 'high' | 'critical'
}

export interface AIMetadata {
    model?: string
    tokens?: number
    processingTime?: number
    language?: string
    sentiment?: number
    keywords?: string[]
    suggestions?: AISuggestion[]
}

export type AIRequestType =
    | 'contract_analysis'
    | 'legal_advice'
    | 'document_generation'
    | 'risk_assessment'
    | 'compliance_check'
    | 'translation'
    | 'summarization'
    | 'qa_extraction'
    | 'sentiment_analysis'
    | 'entity_recognition'

export type AIResponseType =
    | 'analysis_result'
    | 'advice_response'
    | 'generated_document'
    | 'risk_report'
    | 'compliance_report'
    | 'translation_result'
    | 'summary'
    | 'qa_pairs'
    | 'sentiment_result'
    | 'entities'

export type SuggestionType =
    | 'clause_improvement'
    | 'risk_mitigation'
    | 'legal_alternative'
    | 'compliance_fix'
    | 'negotiation_point'
    | 'template_suggestion'

export interface AIModel {
    id: string
    name: string
    description: string
    capabilities: AIRequestType[]
    maxTokens: number
    language: string[]
    version: string
    isActive: boolean
}

export interface AIChat {
    id: string
    title: string
    messages: AIChatMessage[]
    context: Record<string, any>
    metadata: AIMetadata
    createdAt: number
    updatedAt: number
}

export interface AIChatMessage {
    id: string
    role: 'user' | 'assistant' | 'system'
    content: string
    type?: 'text' | 'document' | 'analysis' | 'suggestion'
    metadata?: AIMetadata
    timestamp: number
}

export interface AIAnalysisResult {
    id: string
    type: AIRequestType
    summary: string
    details: Record<string, any>
    risks: AIRiskItem[]
    suggestions: AISuggestion[]
    confidence: number
    metadata: AIMetadata
}

export interface AIRiskItem {
    id: string
    type: string
    severity: 'low' | 'medium' | 'high' | 'critical'
    description: string
    impact: string
    mitigation: string
    confidence: number
}

export interface AISettings {
    defaultModel: string
    language: string
    maxTokens: number
    temperature: number
    enableSuggestions: boolean
    enableRealTimeAnalysis: boolean
    autoSave: boolean
    privacyMode: boolean
}

export interface AIUsageStats {
    totalRequests: number
    requestsByType: Record<AIRequestType, number>
    averageConfidence: number
    totalTokensUsed: number
    averageResponseTime: number
    lastUsed: number
}

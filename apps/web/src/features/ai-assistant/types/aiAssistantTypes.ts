export interface AIMessage {
    id: string
    content: string
    sender: 'user' | 'ai'
    timestamp: Date
}

export interface AIAssistantState {
    messages: AIMessage[]
    loading: boolean
    error: string | null
}

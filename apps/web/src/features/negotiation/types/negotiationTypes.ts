// Negotiation Types
// טיפוסים לחדר משא ומתן חכם

export interface INegotiationRoom {
    id: string
    contractId: string
    title: string
    description: string
    status: 'active' | 'paused' | 'completed' | 'cancelled'
    participants: Participant[]
    documents: NegotiationDocument[]
    messages: NegotiationMessage[]
    agenda: AgendaItem[]
    settings: RoomSettings
    createdAt: string
    updatedAt: string
    scheduledStartTime?: string
    scheduledEndTime?: string
    actualStartTime?: string
    actualEndTime?: string
}

export interface Participant {
    id: string
    userId: string
    name: string
    email: string
    role: 'host' | 'participant' | 'observer'
    permissions: ParticipantPermissions
    status: 'online' | 'offline' | 'away'
    joinedAt?: string
    lastSeenAt?: string
    avatar?: string
}

export interface ParticipantPermissions {
    canEdit: boolean
    canComment: boolean
    canShare: boolean
    canManageParticipants: boolean
    canManageDocuments: boolean
}

export interface NegotiationDocument {
    id: string
    roomId: string
    title: string
    type: 'contract' | 'proposal' | 'amendment' | 'reference' | 'attachment'
    content: string
    version: number
    status: 'draft' | 'under_review' | 'approved' | 'rejected'
    uploadedBy: string
    uploadedAt: string
    lastModifiedBy?: string
    lastModifiedAt?: string
    comments: DocumentComment[]
    changes: DocumentChange[]
    url?: string
    fileSize?: number
    mimeType?: string
}

export interface DocumentComment {
    id: string
    documentId: string
    userId: string
    userName: string
    content: string
    position?: {
        page?: number
        line?: number
        selection?: string
    }
    createdAt: string
    updatedAt?: string
    isResolved: boolean
    replies: CommentReply[]
}

export interface CommentReply {
    id: string
    commentId: string
    userId: string
    userName: string
    content: string
    createdAt: string
}

export interface DocumentChange {
    id: string
    documentId: string
    userId: string
    userName: string
    type: 'insert' | 'delete' | 'modify'
    position: number
    oldContent?: string
    newContent?: string
    timestamp: string
    isAccepted?: boolean
}

export interface NegotiationMessage {
    id: string
    roomId: string
    senderId: string
    senderName: string
    type: 'text' | 'file' | 'system' | 'poll' | 'action'
    content: string
    timestamp: string
    isEdited: boolean
    editedAt?: string
    reactions: MessageReaction[]
    attachments: MessageAttachment[]
    replyTo?: string
    mentions: string[]
}

export interface MessageReaction {
    emoji: string
    userId: string
    userName: string
    timestamp: string
}

export interface MessageAttachment {
    id: string
    name: string
    url: string
    type: string
    size: number
}

export interface AgendaItem {
    id: string
    roomId: string
    title: string
    description: string
    order: number
    status: 'pending' | 'in_progress' | 'completed' | 'skipped'
    duration: number // in minutes
    assignedTo?: string
    notes: string
    decisions: Decision[]
}

export interface Decision {
    id: string
    agendaItemId: string
    title: string
    description: string
    type: 'accepted' | 'rejected' | 'deferred' | 'modified'
    votingResults?: VotingResults
    decidedBy: string
    decidedAt: string
    reason?: string
}

export interface VotingResults {
    totalVotes: number
    inFavor: number
    against: number
    abstain: number
    participants: VoteRecord[]
}

export interface VoteRecord {
    userId: string
    userName: string
    vote: 'favor' | 'against' | 'abstain'
    timestamp: string
    comment?: string
}

export interface RoomSettings {
    isPublic: boolean
    allowRecording: boolean
    allowScreenShare: boolean
    allowFileUpload: boolean
    maxParticipants: number
    moderationRequired: boolean
    votingEnabled: boolean
    timeLimit?: number // in minutes
    language: 'he' | 'en' | 'ar'
    timezone: string
}

export interface NegotiationSession {
    id: string
    roomId: string
    startTime: string
    endTime?: string
    duration?: number
    participants: string[]
    summary: SessionSummary
    recording?: SessionRecording
}

export interface SessionSummary {
    keyPoints: string[]
    decisions: Decision[]
    actionItems: ActionItem[]
    nextSteps: string[]
    attendanceRate: number
}

export interface ActionItem {
    id: string
    sessionId: string
    title: string
    description: string
    assignedTo: string
    dueDate: string
    status: 'pending' | 'in_progress' | 'completed' | 'overdue'
    priority: 'low' | 'medium' | 'high'
    createdAt: string
}

export interface SessionRecording {
    id: string
    sessionId: string
    url: string
    duration: number
    size: number
    format: string
    transcript?: string
    highlights: RecordingHighlight[]
}

export interface RecordingHighlight {
    id: string
    recordingId: string
    timestamp: number
    duration: number
    title: string
    description: string
    type: 'key_point' | 'decision' | 'question' | 'action_item'
}

export interface NegotiationState {
    rooms: INegotiationRoom[]
    currentRoom: INegotiationRoom | null
    participants: Participant[]
    messages: NegotiationMessage[]
    documents: NegotiationDocument[]
    sessions: NegotiationSession[]
    loading: boolean
    error: string | null
    connectionStatus: 'connected' | 'connecting' | 'disconnected'
    typingUsers: string[]
}

// API Request/Response types
export interface CreateRoomRequest {
    title: string
    description: string
    contractId?: string
    participants: string[]
    settings: Partial<RoomSettings>
    scheduledStartTime?: string
}

export interface JoinRoomRequest {
    roomId: string
    userId: string
}

export interface SendMessageRequest {
    roomId: string
    type: NegotiationMessage['type']
    content: string
    attachments?: File[]
    replyTo?: string
}

export interface UpdateDocumentRequest {
    documentId: string
    content?: string
    changes: DocumentChange[]
}

export interface CreatePollRequest {
    roomId: string
    question: string
    options: string[]
    duration: number
    isAnonymous: boolean
}

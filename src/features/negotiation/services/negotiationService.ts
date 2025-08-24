import { axiosClient } from '@shared/services/api/axiosClient'
import type {
    INegotiationRoom,
    Participant,
    NegotiationMessage,
    NegotiationDocument,
    NegotiationSession,
    CreateRoomRequest,
    JoinRoomRequest,
    SendMessageRequest,
    UpdateDocumentRequest,
    CreatePollRequest,
    AgendaItem,
    Decision
} from '../types/negotiationTypes'

export class NegotiationService {
    // Room Management
    static async createRoom(roomData: CreateRoomRequest): Promise<INegotiationRoom> {
        const response = await axiosClient.post<INegotiationRoom>('/negotiation/rooms', roomData)
        return response.data
    }

    static async getRooms(userId?: string): Promise<INegotiationRoom[]> {
        const response = await axiosClient.get<INegotiationRoom[]>('/negotiation/rooms', {
            params: userId ? { userId } : {}
        })
        return response.data
    }

    static async getRoom(roomId: string): Promise<INegotiationRoom> {
        const response = await axiosClient.get<INegotiationRoom>(`/negotiation/rooms/${roomId}`)
        return response.data
    }

    static async updateRoom(roomId: string, updates: Partial<INegotiationRoom>): Promise<INegotiationRoom> {
        const response = await axiosClient.put<INegotiationRoom>(`/negotiation/rooms/${roomId}`, updates)
        return response.data
    }

    static async deleteRoom(roomId: string): Promise<void> {
        await axiosClient.delete(`/negotiation/rooms/${roomId}`)
    }

    static async joinRoom(joinData: JoinRoomRequest): Promise<{ room: INegotiationRoom, participant: Participant }> {
        const response = await axiosClient.post<{ room: INegotiationRoom, participant: Participant }>(`/negotiation/rooms/${joinData.roomId}/join`, joinData)
        return response.data
    }

    static async leaveRoom(roomId: string, userId: string): Promise<void> {
        await axiosClient.post(`/negotiation/rooms/${roomId}/leave`, { userId })
    }

    // Participant Management
    static async getParticipants(roomId: string): Promise<Participant[]> {
        const response = await axiosClient.get<Participant[]>(`/negotiation/rooms/${roomId}/participants`)
        return response.data
    }

    static async addParticipant(roomId: string, userId: string, role: Participant['role'] = 'participant'): Promise<Participant> {
        const response = await axiosClient.post<Participant>(`/negotiation/rooms/${roomId}/participants`, { userId, role })
        return response.data
    }

    static async updateParticipant(roomId: string, participantId: string, updates: Partial<Participant>): Promise<Participant> {
        const response = await axiosClient.put<Participant>(`/negotiation/rooms/${roomId}/participants/${participantId}`, updates)
        return response.data
    }

    static async removeParticipant(roomId: string, participantId: string): Promise<void> {
        await axiosClient.delete(`/negotiation/rooms/${roomId}/participants/${participantId}`)
    }

    // Message Management
    static async getMessages(roomId: string, limit: number = 50, before?: string): Promise<NegotiationMessage[]> {
        const params = { limit, before }
        const response = await axiosClient.get<NegotiationMessage[]>(`/negotiation/rooms/${roomId}/messages`, { params })
        return response.data
    }

    static async sendMessage(messageData: SendMessageRequest): Promise<NegotiationMessage> {
        const formData = new FormData()
        formData.append('type', messageData.type)
        formData.append('content', messageData.content)

        if (messageData.replyTo) {
            formData.append('replyTo', messageData.replyTo)
        }

        if (messageData.attachments) {
            messageData.attachments.forEach((file, index) => {
                formData.append(`attachment_${index}`, file)
            })
        }

        const response = await axiosClient.post<NegotiationMessage>(`/negotiation/rooms/${messageData.roomId}/messages`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
        return response.data
    }

    static async editMessage(messageId: string, content: string): Promise<NegotiationMessage> {
        const response = await axiosClient.put<NegotiationMessage>(`/negotiation/messages/${messageId}`, { content })
        return response.data
    }

    static async deleteMessage(messageId: string): Promise<void> {
        await axiosClient.delete(`/negotiation/messages/${messageId}`)
    }

    static async addReaction(messageId: string, emoji: string): Promise<void> {
        await axiosClient.post(`/negotiation/messages/${messageId}/reactions`, { emoji })
    }

    static async removeReaction(messageId: string, emoji: string): Promise<void> {
        await axiosClient.delete(`/negotiation/messages/${messageId}/reactions/${emoji}`)
    }

    // Document Management
    static async getDocuments(roomId: string): Promise<NegotiationDocument[]> {
        const response = await axiosClient.get<NegotiationDocument[]>(`/negotiation/rooms/${roomId}/documents`)
        return response.data
    }

    static async getDocument(documentId: string): Promise<NegotiationDocument> {
        const response = await axiosClient.get<NegotiationDocument>(`/negotiation/documents/${documentId}`)
        return response.data
    }

    static async uploadDocument(roomId: string, file: File, type: NegotiationDocument['type']): Promise<NegotiationDocument> {
        const formData = new FormData()
        formData.append('file', file)
        formData.append('type', type)

        const response = await axiosClient.post<NegotiationDocument>(`/negotiation/rooms/${roomId}/documents`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
        return response.data
    }

    static async updateDocument(updateData: UpdateDocumentRequest): Promise<NegotiationDocument> {
        const response = await axiosClient.put<NegotiationDocument>(`/negotiation/documents/${updateData.documentId}`, updateData)
        return response.data
    }

    static async deleteDocument(documentId: string): Promise<void> {
        await axiosClient.delete(`/negotiation/documents/${documentId}`)
    }

    static async addDocumentComment(documentId: string, content: string, position?: { x: number; y: number }): Promise<void> {
        await axiosClient.post(`/negotiation/documents/${documentId}/comments`, { content, position })
    }

    static async resolveComment(commentId: string): Promise<void> {
        await axiosClient.put(`/negotiation/comments/${commentId}/resolve`)
    }

    // Agenda Management
    static async getAgenda(roomId: string): Promise<AgendaItem[]> {
        const response = await axiosClient.get<AgendaItem[]>(`/negotiation/rooms/${roomId}/agenda`)
        return response.data
    }

    static async addAgendaItem(roomId: string, item: Partial<AgendaItem>): Promise<AgendaItem> {
        const response = await axiosClient.post<AgendaItem>(`/negotiation/rooms/${roomId}/agenda`, item)
        return response.data
    }

    static async updateAgendaItem(itemId: string, updates: Partial<AgendaItem>): Promise<AgendaItem> {
        const response = await axiosClient.put<AgendaItem>(`/negotiation/agenda/${itemId}`, updates)
        return response.data
    }

    static async deleteAgendaItem(itemId: string): Promise<void> {
        await axiosClient.delete(`/negotiation/agenda/${itemId}`)
    }

    static async addDecision(itemId: string, decision: Partial<Decision>): Promise<Decision> {
        const response = await axiosClient.post<Decision>(`/negotiation/agenda/${itemId}/decisions`, decision)
        return response.data
    }

    // Session Management
    static async startSession(roomId: string): Promise<NegotiationSession> {
        const response = await axiosClient.post<NegotiationSession>(`/negotiation/rooms/${roomId}/sessions/start`)
        return response.data
    }

    static async endSession(sessionId: string): Promise<NegotiationSession> {
        const response = await axiosClient.post<NegotiationSession>(`/negotiation/sessions/${sessionId}/end`)
        return response.data
    }

    static async getSessions(roomId: string): Promise<NegotiationSession[]> {
        const response = await axiosClient.get<NegotiationSession[]>(`/negotiation/rooms/${roomId}/sessions`)
        return response.data
    }

    static async getSession(sessionId: string): Promise<NegotiationSession> {
        const response = await axiosClient.get<NegotiationSession>(`/negotiation/sessions/${sessionId}`)
        return response.data
    }

    // Recording Management
    static async startRecording(sessionId: string): Promise<{ recordingId: string }> {
        const response = await axiosClient.post<{ recordingId: string }>(`/negotiation/sessions/${sessionId}/recording/start`)
        return response.data
    }

    static async stopRecording(sessionId: string): Promise<{ recordingUrl: string }> {
        const response = await axiosClient.post<{ recordingUrl: string }>(`/negotiation/sessions/${sessionId}/recording/stop`)
        return response.data
    }

    static async getRecording(recordingId: string): Promise<{ url: string, transcript?: string }> {
        const response = await axiosClient.get<{ url: string, transcript?: string }>(`/negotiation/recordings/${recordingId}`)
        return response.data
    }

    // Real-time features (WebSocket)
    static async updateTypingStatus(roomId: string, isTyping: boolean): Promise<void> {
        await axiosClient.post(`/negotiation/rooms/${roomId}/typing`, { isTyping })
    }

    static async updateUserStatus(roomId: string, status: Participant['status']): Promise<void> {
        await axiosClient.post(`/negotiation/rooms/${roomId}/status`, { status })
    }

    // Polls and Voting
    static async createPoll(pollData: CreatePollRequest): Promise<{ pollId: string }> {
        const response = await axiosClient.post<{ pollId: string }>(`/negotiation/rooms/${pollData.roomId}/polls`, pollData)
        return response.data
    }

    static async vote(pollId: string, option: string): Promise<void> {
        await axiosClient.post(`/negotiation/polls/${pollId}/vote`, { option })
    }

    static async closePoll(pollId: string): Promise<{ results: Record<string, unknown> }> {
        const response = await axiosClient.post<{ results: Record<string, unknown> }>(`/negotiation/polls/${pollId}/close`)
        return response.data
    }
}

export default NegotiationService

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { NegotiationService } from '../services/negotiationService'
import type {
    NegotiationState,
    INegotiationRoom,
    Participant,
    NegotiationMessage,
    NegotiationDocument,
    NegotiationSession,
    CreateRoomRequest,
    JoinRoomRequest,
    SendMessageRequest,
    UpdateDocumentRequest,
    AgendaItem
} from '../types/negotiationTypes'

// Initial state
const initialState: NegotiationState = {
    rooms: [],
    currentRoom: null,
    participants: [],
    messages: [],
    documents: [],
    sessions: [],
    loading: false,
    error: null,
    connectionStatus: 'disconnected',
    typingUsers: []
}

// Async thunks
export const fetchRooms = createAsyncThunk(
    'negotiation/fetchRooms',
    async (userId?: string) => {
        return await NegotiationService.getRooms(userId)
    }
)

export const createRoom = createAsyncThunk(
    'negotiation/createRoom',
    async (roomData: CreateRoomRequest) => {
        return await NegotiationService.createRoom(roomData)
    }
)

export const fetchRoom = createAsyncThunk(
    'negotiation/fetchRoom',
    async (roomId: string) => {
        return await NegotiationService.getRoom(roomId)
    }
)

export const joinRoom = createAsyncThunk(
    'negotiation/joinRoom',
    async (joinData: JoinRoomRequest) => {
        return await NegotiationService.joinRoom(joinData)
    }
)

export const leaveRoom = createAsyncThunk(
    'negotiation/leaveRoom',
    async ({ roomId, userId }: { roomId: string, userId: string }) => {
        await NegotiationService.leaveRoom(roomId, userId)
        return { roomId, userId }
    }
)

export const fetchParticipants = createAsyncThunk(
    'negotiation/fetchParticipants',
    async (roomId: string) => {
        return await NegotiationService.getParticipants(roomId)
    }
)

export const addParticipant = createAsyncThunk(
    'negotiation/addParticipant',
    async ({ roomId, userId, role }: { roomId: string, userId: string, role?: Participant['role'] }) => {
        return await NegotiationService.addParticipant(roomId, userId, role)
    }
)

export const removeParticipant = createAsyncThunk(
    'negotiation/removeParticipant',
    async ({ roomId, participantId }: { roomId: string, participantId: string }) => {
        await NegotiationService.removeParticipant(roomId, participantId)
        return participantId
    }
)

export const fetchMessages = createAsyncThunk(
    'negotiation/fetchMessages',
    async ({ roomId, limit, before }: { roomId: string, limit?: number, before?: string }) => {
        return await NegotiationService.getMessages(roomId, limit, before)
    }
)

export const sendMessage = createAsyncThunk(
    'negotiation/sendMessage',
    async (messageData: SendMessageRequest) => {
        return await NegotiationService.sendMessage(messageData)
    }
)

export const editMessage = createAsyncThunk(
    'negotiation/editMessage',
    async ({ messageId, content }: { messageId: string, content: string }) => {
        return await NegotiationService.editMessage(messageId, content)
    }
)

export const deleteMessage = createAsyncThunk(
    'negotiation/deleteMessage',
    async (messageId: string) => {
        await NegotiationService.deleteMessage(messageId)
        return messageId
    }
)

export const fetchDocuments = createAsyncThunk(
    'negotiation/fetchDocuments',
    async (roomId: string) => {
        return await NegotiationService.getDocuments(roomId)
    }
)

export const uploadDocument = createAsyncThunk(
    'negotiation/uploadDocument',
    async ({ roomId, file, type }: { roomId: string, file: File, type: NegotiationDocument['type'] }) => {
        return await NegotiationService.uploadDocument(roomId, file, type)
    }
)

export const updateDocument = createAsyncThunk(
    'negotiation/updateDocument',
    async (updateData: UpdateDocumentRequest) => {
        return await NegotiationService.updateDocument(updateData)
    }
)

export const deleteDocument = createAsyncThunk(
    'negotiation/deleteDocument',
    async (documentId: string) => {
        await NegotiationService.deleteDocument(documentId)
        return documentId
    }
)

export const fetchAgenda = createAsyncThunk(
    'negotiation/fetchAgenda',
    async (roomId: string) => {
        return await NegotiationService.getAgenda(roomId)
    }
)

export const addAgendaItem = createAsyncThunk(
    'negotiation/addAgendaItem',
    async ({ roomId, item }: { roomId: string, item: Partial<AgendaItem> }) => {
        return await NegotiationService.addAgendaItem(roomId, item)
    }
)

export const updateAgendaItem = createAsyncThunk(
    'negotiation/updateAgendaItem',
    async ({ itemId, updates }: { itemId: string, updates: Partial<AgendaItem> }) => {
        return await NegotiationService.updateAgendaItem(itemId, updates)
    }
)

export const deleteAgendaItem = createAsyncThunk(
    'negotiation/deleteAgendaItem',
    async (itemId: string) => {
        await NegotiationService.deleteAgendaItem(itemId)
        return itemId
    }
)

export const fetchSessions = createAsyncThunk(
    'negotiation/fetchSessions',
    async (roomId: string) => {
        return await NegotiationService.getSessions(roomId)
    }
)

export const startSession = createAsyncThunk(
    'negotiation/startSession',
    async (roomId: string) => {
        return await NegotiationService.startSession(roomId)
    }
)

export const endSession = createAsyncThunk(
    'negotiation/endSession',
    async (sessionId: string) => {
        return await NegotiationService.endSession(sessionId)
    }
)

// Slice
const negotiationSlice = createSlice({
    name: 'negotiation',
    initialState,
    reducers: {
        setCurrentRoom: (state, action: PayloadAction<INegotiationRoom | null>) => {
            state.currentRoom = action.payload
        },
        clearCurrentRoom: (state) => {
            state.currentRoom = null
            state.participants = []
            state.messages = []
            state.documents = []
        },
        setConnectionStatus: (state, action: PayloadAction<NegotiationState['connectionStatus']>) => {
            state.connectionStatus = action.payload
        },
        addMessage: (state, action: PayloadAction<NegotiationMessage>) => {
            state.messages.push(action.payload)
        },
        updateMessage: (state, action: PayloadAction<NegotiationMessage>) => {
            const index = state.messages.findIndex(msg => msg.id === action.payload.id)
            if (index !== -1) {
                state.messages[index] = action.payload
            }
        },
        removeMessage: (state, action: PayloadAction<string>) => {
            state.messages = state.messages.filter(msg => msg.id !== action.payload)
        },
        updateParticipantStatus: (state, action: PayloadAction<{ userId: string, status: Participant['status'] }>) => {
            const participant = state.participants.find(p => p.userId === action.payload.userId)
            if (participant) {
                participant.status = action.payload.status
            }
        },
        setTypingUsers: (state, action: PayloadAction<string[]>) => {
            state.typingUsers = action.payload
        },
        addTypingUser: (state, action: PayloadAction<string>) => {
            if (!state.typingUsers.includes(action.payload)) {
                state.typingUsers.push(action.payload)
            }
        },
        removeTypingUser: (state, action: PayloadAction<string>) => {
            state.typingUsers = state.typingUsers.filter(userId => userId !== action.payload)
        },
        clearError: (state) => {
            state.error = null
        },
        updateRoomStatus: (state, action: PayloadAction<{ roomId: string, status: INegotiationRoom['status'] }>) => {
            const room = state.rooms.find(r => r.id === action.payload.roomId)
            if (room) {
                room.status = action.payload.status
            }
            if (state.currentRoom?.id === action.payload.roomId) {
                state.currentRoom.status = action.payload.status
            }
        }
    },
    extraReducers: (builder) => {
        // Fetch rooms
        builder
            .addCase(fetchRooms.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(fetchRooms.fulfilled, (state, action) => {
                state.loading = false
                state.rooms = action.payload
            })
            .addCase(fetchRooms.rejected, (state, action) => {
                state.loading = false
                state.error = action.error.message || 'שגיאה בטעינת חדרים'
            })

        // Create room
        builder
            .addCase(createRoom.fulfilled, (state, action) => {
                state.rooms.unshift(action.payload)
            })

        // Fetch room
        builder
            .addCase(fetchRoom.fulfilled, (state, action) => {
                state.currentRoom = action.payload
            })

        // Join room
        builder
            .addCase(joinRoom.fulfilled, (state, action) => {
                state.currentRoom = action.payload.room
                if (!state.participants.find(p => p.id === action.payload.participant.id)) {
                    state.participants.push(action.payload.participant)
                }
                state.connectionStatus = 'connected'
            })

        // Leave room
        builder
            .addCase(leaveRoom.fulfilled, (state, action) => {
                state.participants = state.participants.filter(p => p.userId !== action.payload.userId)
                if (state.currentRoom?.id === action.payload.roomId) {
                    state.connectionStatus = 'disconnected'
                }
            })

        // Participants
        builder
            .addCase(fetchParticipants.fulfilled, (state, action) => {
                state.participants = action.payload
            })
            .addCase(addParticipant.fulfilled, (state, action) => {
                state.participants.push(action.payload)
            })
            .addCase(removeParticipant.fulfilled, (state, action) => {
                state.participants = state.participants.filter(p => p.id !== action.payload)
            })

        // Messages
        builder
            .addCase(fetchMessages.fulfilled, (state, action) => {
                state.messages = action.payload
            })
            .addCase(sendMessage.fulfilled, (state, action) => {
                state.messages.push(action.payload)
            })
            .addCase(editMessage.fulfilled, (state, action) => {
                const index = state.messages.findIndex(msg => msg.id === action.payload.id)
                if (index !== -1) {
                    state.messages[index] = action.payload
                }
            })
            .addCase(deleteMessage.fulfilled, (state, action) => {
                state.messages = state.messages.filter(msg => msg.id !== action.payload)
            })

        // Documents
        builder
            .addCase(fetchDocuments.fulfilled, (state, action) => {
                state.documents = action.payload
            })
            .addCase(uploadDocument.fulfilled, (state, action) => {
                state.documents.push(action.payload)
            })
            .addCase(updateDocument.fulfilled, (state, action) => {
                const index = state.documents.findIndex(doc => doc.id === action.payload.id)
                if (index !== -1) {
                    state.documents[index] = action.payload
                }
            })
            .addCase(deleteDocument.fulfilled, (state, action) => {
                state.documents = state.documents.filter(doc => doc.id !== action.payload)
            })

        // Sessions
        builder
            .addCase(fetchSessions.fulfilled, (state, action) => {
                state.sessions = action.payload
            })
            .addCase(startSession.fulfilled, (state, action) => {
                state.sessions.unshift(action.payload)
            })
            .addCase(endSession.fulfilled, (state, action) => {
                const index = state.sessions.findIndex(session => session.id === action.payload.id)
                if (index !== -1) {
                    state.sessions[index] = action.payload
                }
            })
    }
})

export const {
    setCurrentRoom,
    clearCurrentRoom,
    setConnectionStatus,
    addMessage,
    updateMessage,
    removeMessage,
    updateParticipantStatus,
    setTypingUsers,
    addTypingUser,
    removeTypingUser,
    clearError,
    updateRoomStatus
} = negotiationSlice.actions

export default negotiationSlice.reducer

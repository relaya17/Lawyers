import { createSlice } from '@reduxjs/toolkit'

const aiAssistantSlice = createSlice({
    name: 'aiAssistant',
    initialState: {
        messages: [],
        loading: false,
        error: null
    },
    reducers: {
        // TODO: Implement AI Assistant actions
    }
})

export default aiAssistantSlice.reducer

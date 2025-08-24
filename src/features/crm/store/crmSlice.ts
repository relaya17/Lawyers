import { createSlice } from '@reduxjs/toolkit'

const crmSlice = createSlice({
    name: 'crm',
    initialState: {
        clients: [],
        leads: [],
        activities: [],
        loading: false,
        error: null
    },
    reducers: {
        // TODO: Implement CRM actions
    }
})

export default crmSlice.reducer

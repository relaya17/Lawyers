import { createSlice } from '@reduxjs/toolkit'

const learningSlice = createSlice({
    name: 'learning',
    initialState: {
        courses: [],
        lessons: [],
        progress: {},
        loading: false,
        error: null
    },
    reducers: {
        // TODO: Implement Learning actions
    }
})

export default learningSlice.reducer

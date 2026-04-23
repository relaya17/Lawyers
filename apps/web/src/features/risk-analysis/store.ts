// Risk Analysis Store
// Store לניתוח סיכון

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { RiskAnalysisService } from './services'
import type { RiskAssessment, RiskReport, RiskFactor, RiskLevel } from './types'

const riskAnalysisService = new RiskAnalysisService()

// Async thunks
export const fetchAssessments = createAsyncThunk(
    'riskAnalysis/fetchAssessments',
    async (contractId?: string) => {
        return await riskAnalysisService.getAssessments(contractId)
    }
)

export const fetchAssessment = createAsyncThunk(
    'riskAnalysis/fetchAssessment',
    async (id: string) => {
        return await riskAnalysisService.getAssessment(id)
    }
)

export const createAssessment = createAsyncThunk(
    'riskAnalysis/createAssessment',
    async (assessment: Omit<RiskAssessment, 'id' | 'createdAt' | 'updatedAt'>) => {
        return await riskAnalysisService.createAssessment(assessment)
    }
)

export const updateAssessment = createAsyncThunk(
    'riskAnalysis/updateAssessment',
    async ({ id, assessment }: { id: string; assessment: Partial<RiskAssessment> }) => {
        return await riskAnalysisService.updateAssessment(id, assessment)
    }
)

export const deleteAssessment = createAsyncThunk(
    'riskAnalysis/deleteAssessment',
    async (id: string) => {
        await riskAnalysisService.deleteAssessment(id)
        return id
    }
)

export const generateReport = createAsyncThunk(
    'riskAnalysis/generateReport',
    async (assessmentId: string) => {
        return await riskAnalysisService.generateReport(assessmentId)
    }
)

export const fetchRiskFactors = createAsyncThunk(
    'riskAnalysis/fetchRiskFactors',
    async () => {
        return await riskAnalysisService.getRiskFactors()
    }
)

export const analyzeContract = createAsyncThunk(
    'riskAnalysis/analyzeContract',
    async (contractId: string) => {
        return await riskAnalysisService.analyzeContract(contractId)
    }
)

// State interface
interface RiskAnalysisState {
    assessments: RiskAssessment[]
    currentAssessment: RiskAssessment | null
    currentReport: RiskReport | null
    riskFactors: RiskFactor[]
    loading: boolean
    error: string | null
    filters: {
        riskLevel: RiskLevel | 'all'
        category: string | 'all'
    }
}

// Initial state
const initialState: RiskAnalysisState = {
    assessments: [],
    currentAssessment: null,
    currentReport: null,
    riskFactors: [],
    loading: false,
    error: null,
    filters: {
        riskLevel: 'all',
        category: 'all',
    },
}

// Slice
const riskAnalysisSlice = createSlice({
    name: 'riskAnalysis',
    initialState,
    reducers: {
        setCurrentAssessment: (state, action: PayloadAction<RiskAssessment | null>) => {
            state.currentAssessment = action.payload
        },
        setCurrentReport: (state, action: PayloadAction<RiskReport | null>) => {
            state.currentReport = action.payload
        },
        setFilters: (state, action: PayloadAction<Partial<RiskAnalysisState['filters']>>) => {
            state.filters = { ...state.filters, ...action.payload }
        },
        clearError: (state) => {
            state.error = null
        },
    },
    extraReducers: (builder) => {
        // Fetch assessments
        builder
            .addCase(fetchAssessments.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(fetchAssessments.fulfilled, (state, action) => {
                state.loading = false
                state.assessments = action.payload
            })
            .addCase(fetchAssessments.rejected, (state, action) => {
                state.loading = false
                state.error = action.error.message || 'Failed to fetch assessments'
            })

        // Fetch assessment
        builder
            .addCase(fetchAssessment.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(fetchAssessment.fulfilled, (state, action) => {
                state.loading = false
                state.currentAssessment = action.payload
            })
            .addCase(fetchAssessment.rejected, (state, action) => {
                state.loading = false
                state.error = action.error.message || 'Failed to fetch assessment'
            })

        // Create assessment
        builder
            .addCase(createAssessment.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(createAssessment.fulfilled, (state, action) => {
                state.loading = false
                state.assessments.push(action.payload)
                state.currentAssessment = action.payload
            })
            .addCase(createAssessment.rejected, (state, action) => {
                state.loading = false
                state.error = action.error.message || 'Failed to create assessment'
            })

        // Update assessment
        builder
            .addCase(updateAssessment.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(updateAssessment.fulfilled, (state, action) => {
                state.loading = false
                const index = state.assessments.findIndex(a => a.id === action.payload.id)
                if (index !== -1) {
                    state.assessments[index] = action.payload
                }
                if (state.currentAssessment?.id === action.payload.id) {
                    state.currentAssessment = action.payload
                }
            })
            .addCase(updateAssessment.rejected, (state, action) => {
                state.loading = false
                state.error = action.error.message || 'Failed to update assessment'
            })

        // Delete assessment
        builder
            .addCase(deleteAssessment.fulfilled, (state, action) => {
                state.assessments = state.assessments.filter(a => a.id !== action.payload)
                if (state.currentAssessment?.id === action.payload) {
                    state.currentAssessment = null
                }
            })

        // Generate report
        builder
            .addCase(generateReport.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(generateReport.fulfilled, (state, action) => {
                state.loading = false
                state.currentReport = action.payload
            })
            .addCase(generateReport.rejected, (state, action) => {
                state.loading = false
                state.error = action.error.message || 'Failed to generate report'
            })

        // Fetch risk factors
        builder
            .addCase(fetchRiskFactors.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(fetchRiskFactors.fulfilled, (state, action) => {
                state.loading = false
                state.riskFactors = action.payload
            })
            .addCase(fetchRiskFactors.rejected, (state, action) => {
                state.loading = false
                state.error = action.error.message || 'Failed to fetch risk factors'
            })

        // Analyze contract
        builder
            .addCase(analyzeContract.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(analyzeContract.fulfilled, (state, action) => {
                state.loading = false
                state.currentAssessment = action.payload
                state.assessments.push(action.payload)
            })
            .addCase(analyzeContract.rejected, (state, action) => {
                state.loading = false
                state.error = action.error.message || 'Failed to analyze contract'
            })
    },
})

export const { setCurrentAssessment, setCurrentReport, setFilters, clearError } = riskAnalysisSlice.actions
export default riskAnalysisSlice.reducer

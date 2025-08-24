// Contract Management Store
// Redux store לניהול חוזים

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { ContractService, TemplateService } from './services'
import type { Contract, ContractTemplate, ContractVersion } from './types'

// Async Thunks
export const fetchContracts = createAsyncThunk(
    'contracts/fetchContracts',
    async (params?: { status?: string; type?: string; search?: string; page?: number; limit?: number }) => {
        const response = await ContractService.getContracts(params)
        return response
    }
)

export const fetchContract = createAsyncThunk(
    'contracts/fetchContract',
    async (id: string) => {
        const contract = await ContractService.getContract(id)
        return contract
    }
)

export const createContract = createAsyncThunk(
    'contracts/createContract',
    async (contract: Partial<Contract>) => {
        const newContract = await ContractService.createContract(contract)
        return newContract
    }
)

export const updateContract = createAsyncThunk(
    'contracts/updateContract',
    async ({ id, updates }: { id: string; updates: Partial<Contract> }) => {
        const updatedContract = await ContractService.updateContract(id, updates)
        return updatedContract
    }
)

export const deleteContract = createAsyncThunk(
    'contracts/deleteContract',
    async (id: string) => {
        await ContractService.deleteContract(id)
        return id
    }
)

export const fetchTemplates = createAsyncThunk(
    'contracts/fetchTemplates',
    async (params?: { category?: string; search?: string; isPublic?: boolean; page?: number; limit?: number }) => {
        const response = await TemplateService.getTemplates(params)
        return response
    }
)

// State Interface
interface ContractState {
    contracts: Contract[]
    currentContract: Contract | null
    templates: ContractTemplate[]
    versions: ContractVersion[]
    loading: boolean
    error: string | null
    total: number
    filters: {
        status: string
        type: string
        search: string
        page: number
        limit: number
    }
}

// Initial State
const initialState: ContractState = {
    contracts: [],
    currentContract: null,
    templates: [],
    versions: [],
    loading: false,
    error: null,
    total: 0,
    filters: {
        status: '',
        type: '',
        search: '',
        page: 1,
        limit: 10
    }
}

// Slice
const contractSlice = createSlice({
    name: 'contracts',
    initialState,
    reducers: {
        setCurrentContract: (state, action: PayloadAction<Contract | null>) => {
            state.currentContract = action.payload
        },
        setFilters: (state, action: PayloadAction<Partial<ContractState['filters']>>) => {
            state.filters = { ...state.filters, ...action.payload }
        },
        clearError: (state) => {
            state.error = null
        },
        addContract: (state, action: PayloadAction<Contract>) => {
            state.contracts.unshift(action.payload)
            state.total += 1
        },
        updateContractInList: (state, action: PayloadAction<Contract>) => {
            const index = state.contracts.findIndex(c => c.id === action.payload.id)
            if (index !== -1) {
                state.contracts[index] = action.payload
            }
            if (state.currentContract?.id === action.payload.id) {
                state.currentContract = action.payload
            }
        },
        removeContractFromList: (state, action: PayloadAction<string>) => {
            state.contracts = state.contracts.filter(c => c.id !== action.payload)
            state.total -= 1
            if (state.currentContract?.id === action.payload) {
                state.currentContract = null
            }
        }
    },
    extraReducers: (builder) => {
        // Fetch Contracts
        builder
            .addCase(fetchContracts.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(fetchContracts.fulfilled, (state, action) => {
                state.loading = false
                state.contracts = action.payload.contracts
                state.total = action.payload.total
            })
            .addCase(fetchContracts.rejected, (state, action) => {
                state.loading = false
                state.error = action.error.message || 'שגיאה בטעינת חוזים'
            })

        // Fetch Contract
        builder
            .addCase(fetchContract.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(fetchContract.fulfilled, (state, action) => {
                state.loading = false
                state.currentContract = action.payload
            })
            .addCase(fetchContract.rejected, (state, action) => {
                state.loading = false
                state.error = action.error.message || 'שגיאה בטעינת חוזה'
            })

        // Create Contract
        builder
            .addCase(createContract.fulfilled, (state, action) => {
                state.contracts.unshift(action.payload)
                state.total += 1
            })

        // Update Contract
        builder
            .addCase(updateContract.fulfilled, (state, action) => {
                const index = state.contracts.findIndex(c => c.id === action.payload.id)
                if (index !== -1) {
                    state.contracts[index] = action.payload
                }
                if (state.currentContract?.id === action.payload.id) {
                    state.currentContract = action.payload
                }
            })

        // Delete Contract
        builder
            .addCase(deleteContract.fulfilled, (state, action) => {
                state.contracts = state.contracts.filter(c => c.id !== action.payload)
                state.total -= 1
                if (state.currentContract?.id === action.payload) {
                    state.currentContract = null
                }
            })

        // Fetch Templates
        builder
            .addCase(fetchTemplates.fulfilled, (state, action) => {
                state.templates = action.payload.templates
            })
    }
})

export const {
    setCurrentContract,
    setFilters,
    clearError,
    addContract,
    updateContractInList,
    removeContractFromList
} = contractSlice.actions

export default contractSlice.reducer

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export interface RiskAnalysis {
    id: string
    contractId: string
    riskScore: number
    riskLevel: 'low' | 'medium' | 'high' | 'critical'
    riskFactors: RiskFactor[]
    recommendations: Recommendation[]
    createdAt: string
    updatedAt: string
}

export interface RiskFactor {
    id: string
    category: 'legal' | 'financial' | 'operational' | 'compliance'
    description: string
    severity: 'low' | 'medium' | 'high' | 'critical'
    probability: number
    impact: number
}

export interface Recommendation {
    id: string
    title: string
    description: string
    priority: 'low' | 'medium' | 'high' | 'critical'
    action: string
    estimatedCost?: number
    estimatedTime?: string
}

export const riskAnalysisApi = createApi({
    reducerPath: 'riskAnalysisApi',
    baseQuery: fetchBaseQuery({
        baseUrl: '/api/risk-analysis',
        prepareHeaders: (headers, { getState }) => {
            const token = (getState() as { auth: { token: string } }).auth.token
            if (token) {
                headers.set('authorization', `Bearer ${token}`)
            }
            return headers
        },
    }),
    tagTypes: ['RiskAnalysis'],
    endpoints: (builder) => ({
        analyzeContract: builder.mutation<RiskAnalysis, { contractId: string; contractText: string }>({
            query: (data) => ({
                url: '/analyze',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['RiskAnalysis'],
        }),
        getRiskAnalysis: builder.query<RiskAnalysis, string>({
            query: (contractId) => `/${contractId}`,
            providesTags: (result, error, contractId) => [{ type: 'RiskAnalysis', id: contractId }],
        }),
        getRiskAnalyses: builder.query<RiskAnalysis[], void>({
            query: () => '',
            providesTags: ['RiskAnalysis'],
        }),
        exportReport: builder.mutation<{ url: string }, { contractId: string; format: 'pdf' | 'docx' }>({
            query: (data) => ({
                url: '/export',
                method: 'POST',
                body: data,
            }),
        }),
    }),
})

export const {
    useAnalyzeContractMutation,
    useGetRiskAnalysisQuery,
    useGetRiskAnalysesQuery,
    useExportReportMutation,
} = riskAnalysisApi

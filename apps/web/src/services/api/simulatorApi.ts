import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export interface Simulation {
    id: string
    title: string
    description: string
    difficulty: 'easy' | 'medium' | 'hard'
    scenario: string
    questions: Question[]
    createdAt: string
    updatedAt: string
}

export interface Question {
    id: string
    text: string
    type: 'multiple-choice' | 'text' | 'true-false'
    options?: string[]
    correctAnswer?: string
    explanation?: string
}

export interface SimulationResult {
    id: string
    simulationId: string
    score: number
    answers: Answer[]
    completedAt: string
}

export interface Answer {
    questionId: string
    answer: string
    isCorrect: boolean
}

export const simulatorApi = createApi({
    reducerPath: 'simulatorApi',
    baseQuery: fetchBaseQuery({
        baseUrl: '/api/simulator',
        prepareHeaders: (headers, { getState }) => {
            const token = (getState() as { auth: { token: string } }).auth.token
            if (token) {
                headers.set('authorization', `Bearer ${token}`)
            }
            return headers
        },
    }),
    tagTypes: ['Simulation', 'SimulationResult'],
    endpoints: (builder) => ({
        getSimulations: builder.query<Simulation[], void>({
            query: () => '',
            providesTags: ['Simulation'],
        }),
        getSimulation: builder.query<Simulation, string>({
            query: (id) => `/${id}`,
            providesTags: (result, error, id) => [{ type: 'Simulation', id }],
        }),
        submitSimulation: builder.mutation<SimulationResult, { simulationId: string; answers: Answer[] }>({
            query: (data) => ({
                url: '/submit',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['SimulationResult'],
        }),
        getSimulationResults: builder.query<SimulationResult[], void>({
            query: () => '/results',
            providesTags: ['SimulationResult'],
        }),
    }),
})

export const {
    useGetSimulationsQuery,
    useGetSimulationQuery,
    useSubmitSimulationMutation,
    useGetSimulationResultsQuery,
} = simulatorApi

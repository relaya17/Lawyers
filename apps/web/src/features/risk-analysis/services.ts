// Risk Analysis Services
// שירותי ניתוח סיכון

import { apiConfig } from '../../app/config/apiConfig'
import type { RiskAssessment, RiskReport, RiskFactor } from './types'

export class RiskAnalysisService {
    private baseURL = `${apiConfig.baseURL}/risk-analysis`

    async getAssessments(contractId?: string): Promise<RiskAssessment[]> {
        const response = await fetch(
            `${this.baseURL}/assessments${contractId ? `?contractId=${contractId}` : ''}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        )
        if (!response.ok) throw new Error('Failed to fetch risk assessments')
        return response.json()
    }

    async getAssessment(id: string): Promise<RiskAssessment> {
        const response = await fetch(`${this.baseURL}/assessments/${id}`, {
            headers: {
                'Content-Type': 'application/json',
            },
        })
        if (!response.ok) throw new Error('Failed to fetch risk assessment')
        return response.json()
    }

    async createAssessment(assessment: Omit<RiskAssessment, 'id' | 'createdAt' | 'updatedAt'>): Promise<RiskAssessment> {
        const response = await fetch(`${this.baseURL}/assessments`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(assessment),
        })
        if (!response.ok) throw new Error('Failed to create risk assessment')
        return response.json()
    }

    async updateAssessment(id: string, assessment: Partial<RiskAssessment>): Promise<RiskAssessment> {
        const response = await fetch(`${this.baseURL}/assessments/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(assessment),
        })
        if (!response.ok) throw new Error('Failed to update risk assessment')
        return response.json()
    }

    async deleteAssessment(id: string): Promise<void> {
        const response = await fetch(`${this.baseURL}/assessments/${id}`, {
            method: 'DELETE',
        })
        if (!response.ok) throw new Error('Failed to delete risk assessment')
    }

    async generateReport(assessmentId: string): Promise<RiskReport> {
        const response = await fetch(`${this.baseURL}/assessments/${assessmentId}/report`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        })
        if (!response.ok) throw new Error('Failed to generate risk report')
        return response.json()
    }

    async getRiskFactors(): Promise<RiskFactor[]> {
        const response = await fetch(`${this.baseURL}/factors`, {
            headers: {
                'Content-Type': 'application/json',
            },
        })
        if (!response.ok) throw new Error('Failed to fetch risk factors')
        return response.json()
    }

    async analyzeContract(contractId: string): Promise<RiskAssessment> {
        const response = await fetch(`${this.baseURL}/analyze/${contractId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        })
        if (!response.ok) throw new Error('Failed to analyze contract')
        return response.json()
    }
}

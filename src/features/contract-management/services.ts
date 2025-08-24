// Contract Management Services
// שירותים לניהול חוזים

import { apiClient } from '@shared/services/api/axiosClient'
import type {
    Contract,
    ContractTemplate,
    ContractVersion,
    ContractParty,
    ContractTerm
} from './types'

export class ContractService {
    // קבלת כל החוזים
    static async getContracts(params?: {
        status?: string
        type?: string
        search?: string
        page?: number
        limit?: number
    }): Promise<{ contracts: Contract[], total: number }> {
        const response = await apiClient.get<{ contracts: Contract[], total: number }>('/contracts', { params })
        return response.data
    }

    // קבלת חוזה ספציפי
    static async getContract(id: string): Promise<Contract> {
        const response = await apiClient.get<Contract>(`/contracts/${id}`)
        return response.data
    }

    // יצירת חוזה חדש
    static async createContract(contract: Partial<Contract>): Promise<Contract> {
        const response = await apiClient.post<Contract>('/contracts', contract)
        return response.data
    }

    // עדכון חוזה
    static async updateContract(id: string, updates: Partial<Contract>): Promise<Contract> {
        const response = await apiClient.put<Contract>(`/contracts/${id}`, updates)
        return response.data
    }

    // מחיקת חוזה
    static async deleteContract(id: string): Promise<void> {
        await apiClient.delete(`/contracts/${id}`)
    }

    // קבלת גרסאות חוזה
    static async getContractVersions(contractId: string): Promise<ContractVersion[]> {
        const response = await apiClient.get<ContractVersion[]>(`/contracts/${contractId}/versions`)
        return response.data
    }

    // יצירת גרסה חדשה
    static async createVersion(contractId: string, comment?: string): Promise<ContractVersion> {
        const response = await apiClient.post<ContractVersion>(`/contracts/${contractId}/versions`, { comment })
        return response.data
    }

    // ניתוח סיכון חוזה
    static async analyzeRisk(contractId: string): Promise<{
        riskScore: number
        risks: Array<{
            type: string
            severity: 'low' | 'medium' | 'high' | 'critical'
            description: string
            recommendation: string
        }>
    }> {
        const response = await apiClient.post<{
            riskScore: number
            risks: Array<{
                type: string
                severity: 'low' | 'medium' | 'high' | 'critical'
                description: string
                recommendation: string
            }>
        }>(`/contracts/${contractId}/analyze-risk`)
        return response.data
    }

    // חתימה על חוזה
    static async signContract(contractId: string, signature: string): Promise<Contract> {
        const response = await apiClient.post<Contract>(`/contracts/${contractId}/sign`, { signature })
        return response.data
    }
}

export class TemplateService {
    // קבלת תבניות חוזים
    static async getTemplates(params?: {
        category?: string
        search?: string
        isPublic?: boolean
        page?: number
        limit?: number
    }): Promise<{ templates: ContractTemplate[], total: number }> {
        const response = await apiClient.get<{ templates: ContractTemplate[], total: number }>('/contract-templates', { params })
        return response.data
    }

    // קבלת תבנית ספציפית
    static async getTemplate(id: string): Promise<ContractTemplate> {
        const response = await apiClient.get<ContractTemplate>(`/contract-templates/${id}`)
        return response.data
    }

    // יצירת תבנית חדשה
    static async createTemplate(template: Partial<ContractTemplate>): Promise<ContractTemplate> {
        const response = await apiClient.post<ContractTemplate>('/contract-templates', template)
        return response.data
    }

    // עדכון תבנית
    static async updateTemplate(id: string, updates: Partial<ContractTemplate>): Promise<ContractTemplate> {
        const response = await apiClient.put<ContractTemplate>(`/contract-templates/${id}`, updates)
        return response.data
    }

    // מחיקת תבנית
    static async deleteTemplate(id: string): Promise<void> {
        await apiClient.delete(`/contract-templates/${id}`)
    }

    // הורדת תבנית
    static async downloadTemplate(id: string): Promise<void> {
        await apiClient.post(`/contract-templates/${id}/download`)
    }

    // דירוג תבנית
    static async rateTemplate(id: string, rating: number): Promise<void> {
        await apiClient.post(`/contract-templates/${id}/rate`, { rating })
    }
}

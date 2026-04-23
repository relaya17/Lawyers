import { axiosClient } from './axiosClient'
import { Contract } from './types'

// Interfaces for API requests
interface CreateContractRequest {
    title: string
    content: string
    status: 'draft' | 'active' | 'expired' | 'archived'
    parties: string[]
    tags: string[]
}

interface UpdateContractRequest {
    title?: string
    content?: string
    status?: 'draft' | 'active' | 'expired' | 'archived'
    parties?: string[]
    tags?: string[]
}

// קבלת כל החוזים
export const fetchContracts = async (): Promise<Contract[]> => {
    const response = await axiosClient.get('/contracts')
    return response.data
}

// קבלת חוזה לפי ID
export const fetchContractById = async (id: string): Promise<Contract> => {
    const response = await axiosClient.get(`/contracts/${id}`)
    return response.data
}

// יצירת חוזה חדש
export const createContract = async (contract: CreateContractRequest): Promise<Contract> => {
    const response = await axiosClient.post('/contracts', contract)
    return response.data
}

// עדכון חוזה קיים
export const updateContract = async (id: string, updates: UpdateContractRequest): Promise<Contract> => {
    const response = await axiosClient.put(`/contracts/${id}`, updates)
    return response.data
}

// מחיקת חוזה
export const deleteContract = async (id: string): Promise<void> => {
    await axiosClient.delete(`/contracts/${id}`)
}

// חיפוש חוזים
export const searchContracts = async (query: string): Promise<Contract[]> => {
    const response = await axiosClient.get('/contracts/search', {
        params: { q: query }
    })
    return response.data
}

// סינון חוזים לפי סטטוס
export const filterContractsByStatus = async (status: string): Promise<Contract[]> => {
    const response = await axiosClient.get('/contracts/filter', {
        params: { status }
    })
    return response.data
}

// קבלת תבניות חוזים
export const fetchContractTemplates = async (): Promise<Contract[]> => {
    const response = await axiosClient.get('/contracts/templates')
    return response.data
}

// יצירת חוזה מתבנית
export const createContractFromTemplate = async (templateId: string, data: Record<string, unknown>): Promise<Contract> => {
    const response = await axiosClient.post<Contract>(`/contracts/templates/${templateId}/create`, data)
    return response.data
}

// ייצוא חוזה ל-PDF
export const exportContractToPDF = async (id: string): Promise<Blob> => {
    const response = await axiosClient.get(`/contracts/${id}/export/pdf`, {
        responseType: 'blob'
    })
    return response.data
}

// ייצוא חוזה ל-Word
export const exportContractToWord = async (id: string): Promise<Blob> => {
    const response = await axiosClient.get(`/contracts/${id}/export/word`, {
        responseType: 'blob'
    })
    return response.data
}

// שליחת חוזה לחתימה
export const sendContractForSignature = async (id: string, recipients: string[]): Promise<void> => {
    await axiosClient.post(`/contracts/${id}/sign`, { recipients })
}

// קבלת היסטוריית שינויים של חוזה
export const getContractHistory = async (id: string): Promise<Record<string, unknown>[]> => {
    const response = await axiosClient.get<Record<string, unknown>[]>(`/contracts/${id}/history`)
    return response.data
}

// הוספת הערה לחוזה
export const addContractComment = async (id: string, comment: string): Promise<void> => {
    await axiosClient.post(`/contracts/${id}/comments`, { comment })
}

// קבלת הערות חוזה
export const getContractComments = async (id: string): Promise<Record<string, unknown>[]> => {
    const response = await axiosClient.get<Record<string, unknown>[]>(`/contracts/${id}/comments`)
    return response.data
}

// שמירת חוזה כטיוטה
export const saveContractAsDraft = async (contract: CreateContractRequest): Promise<Contract> => {
    const response = await axiosClient.post('/contracts/draft', contract)
    return response.data
}

// פרסום חוזה לשוק
export const publishContractToMarketplace = async (id: string): Promise<void> => {
    await axiosClient.post(`/contracts/${id}/publish`)
}

// ארכוב חוזה
export const archiveContract = async (id: string): Promise<void> => {
    await axiosClient.post(`/contracts/${id}/archive`)
}

// שחזור חוזה מארכיון
export const restoreContract = async (id: string): Promise<void> => {
    await axiosClient.post(`/contracts/${id}/restore`)
}

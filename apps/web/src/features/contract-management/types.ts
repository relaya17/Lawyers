// Contract Management Types
// טיפוסים לניהול חוזים

export interface Contract {
    id: string
    title: string
    description: string
    status: 'draft' | 'active' | 'expired' | 'terminated'
    type: 'employment' | 'service' | 'lease' | 'purchase' | 'nda' | 'other'
    parties: ContractParty[]
    terms: ContractTerm[]
    riskScore: number
    createdAt: string
    updatedAt: string
    expiresAt?: string
    version: number
    tags: string[]
    attachments: ContractAttachment[]
}

export interface ContractParty {
    id: string
    name: string
    type: 'individual' | 'company'
    role: 'client' | 'vendor' | 'employee' | 'partner'
    email: string
    phone?: string
    address?: string
    taxId?: string
}

export interface ContractTerm {
    id: string
    title: string
    content: string
    category: 'payment' | 'delivery' | 'liability' | 'confidentiality' | 'termination' | 'other'
    riskLevel: 'low' | 'medium' | 'high' | 'critical'
    isRequired: boolean
    isNegotiable: boolean
}

export interface ContractAttachment {
    id: string
    name: string
    type: 'pdf' | 'doc' | 'image' | 'other'
    size: number
    url: string
    uploadedAt: string
}

export interface ContractTemplate {
    id: string
    name: string
    description: string
    category: string
    tags: string[]
    content: string
    variables: TemplateVariable[]
    isPublic: boolean
    rating: number
    downloads: number
    createdAt: string
    updatedAt: string
}

export interface TemplateVariable {
    name: string
    type: 'text' | 'number' | 'date' | 'email' | 'phone' | 'select'
    required: boolean
    defaultValue?: string
    options?: string[]
    description: string
}

export interface ContractVersion {
    id: string
    contractId: string
    version: number
    changes: ContractChange[]
    createdAt: string
    createdBy: string
    comment?: string
}

export interface ContractChange {
    field: string
    oldValue: string | number | boolean | object
    newValue: string | number | boolean | object
    type: 'added' | 'modified' | 'deleted'
}

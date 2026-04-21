// CRM Types
// טיפוסים לניהול קשרי לקוחות משפטי

export interface Client {
    id: string
    name: string
    type: 'individual' | 'company'
    email: string
    phone: string
    address: string
    taxId?: string
    industry?: string
    size?: 'small' | 'medium' | 'large'
    status: 'active' | 'inactive' | 'prospect'
    source: 'referral' | 'website' | 'social' | 'advertising' | 'other'
    assignedTo: string
    createdAt: string
    updatedAt: string
    notes: string
    tags: string[]
    documents: ClientDocument[]
    contacts: ClientContact[]
    cases: ClientCase[]
}

export interface ClientContact {
    id: string
    clientId: string
    name: string
    position: string
    email: string
    phone: string
    isPrimary: boolean
    notes: string
    createdAt: string
    updatedAt: string
}

export interface ClientDocument {
    id: string
    clientId: string
    name: string
    type: 'contract' | 'agreement' | 'legal_opinion' | 'court_document' | 'other'
    url: string
    size: number
    uploadedAt: string
    uploadedBy: string
    tags: string[]
}

export interface ClientCase {
    id: string
    clientId: string
    title: string
    description: string
    type: 'litigation' | 'transaction' | 'advisory' | 'compliance' | 'other'
    status: 'open' | 'closed' | 'pending' | 'on_hold'
    priority: 'low' | 'medium' | 'high' | 'urgent'
    assignedTo: string
    estimatedHours: number
    actualHours: number
    budget: number
    startDate: string
    endDate?: string
    createdAt: string
    updatedAt: string
    notes: string[]
    documents: CaseDocument[]
    tasks: CaseTask[]
}

export interface CaseDocument {
    id: string
    caseId: string
    name: string
    type: 'pleading' | 'evidence' | 'correspondence' | 'contract' | 'other'
    url: string
    size: number
    uploadedAt: string
    uploadedBy: string
}

export interface CaseTask {
    id: string
    caseId: string
    title: string
    description: string
    status: 'pending' | 'in_progress' | 'completed' | 'cancelled'
    priority: 'low' | 'medium' | 'high' | 'urgent'
    assignedTo: string
    dueDate: string
    completedAt?: string
    estimatedHours: number
    actualHours: number
    createdAt: string
    updatedAt: string
}

export interface Lead {
    id: string
    name: string
    company?: string
    email: string
    phone: string
    source: 'website' | 'referral' | 'social' | 'advertising' | 'other'
    status: 'new' | 'contacted' | 'qualified' | 'proposal' | 'won' | 'lost'
    assignedTo: string
    value: number
    description: string
    nextAction: string
    nextActionDate: string
    createdAt: string
    updatedAt: string
    notes: string[]
}

export interface Activity {
    id: string
    type: 'call' | 'email' | 'meeting' | 'task' | 'note'
    title: string
    description: string
    relatedTo: {
        type: 'client' | 'case' | 'lead'
        id: string
    }
    assignedTo: string
    dueDate?: string
    completedAt?: string
    duration?: number
    createdAt: string
    updatedAt: string
}

export interface Dashboard {
    totalClients: number
    activeClients: number
    totalCases: number
    openCases: number
    totalRevenue: number
    monthlyRevenue: number
    pendingTasks: number
    overdueTasks: number
    recentActivities: Activity[]
    topClients: Array<{
        client: Client
        revenue: number
        cases: number
    }>
    upcomingDeadlines: Array<{
        task: CaseTask
        daysUntilDue: number
    }>
}

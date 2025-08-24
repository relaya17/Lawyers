export interface Integration {
    id: string
    name: string
    type: IntegrationType
    provider: string
    description: string
    status: IntegrationStatus
    config: IntegrationConfig
    capabilities: string[]
    apiVersion: string
    lastSync: number
    createdAt: number
    updatedAt: number
}

export interface IntegrationConfig {
    apiKey?: string
    baseUrl?: string
    credentials?: Record<string, any>
    settings?: Record<string, any>
    webhooks?: WebhookConfig[]
    syncSchedule?: SyncSchedule
}

export interface WebhookConfig {
    id: string
    url: string
    events: string[]
    secret?: string
    isActive: boolean
}

export interface SyncSchedule {
    enabled: boolean
    frequency: 'real-time' | 'hourly' | 'daily' | 'weekly'
    lastRun?: number
    nextRun?: number
}

export type IntegrationType =
    | 'crm'
    | 'erp'
    | 'document_management'
    | 'email'
    | 'calendar'
    | 'payment'
    | 'accounting'
    | 'communication'
    | 'cloud_storage'
    | 'legal_database'

export type IntegrationStatus =
    | 'connected'
    | 'disconnected'
    | 'error'
    | 'syncing'
    | 'pending'

export interface SalesforceConfig extends IntegrationConfig {
    instanceUrl: string
    username: string
    password: string
    securityToken: string
    apiVersion: string
}

export interface SAPConfig extends IntegrationConfig {
    systemId: string
    client: string
    username: string
    password: string
    language: string
    sapRouter?: string
}

export interface Office365Config extends IntegrationConfig {
    tenantId: string
    clientId: string
    clientSecret: string
    redirectUri: string
    scopes: string[]
}

export interface GoogleWorkspaceConfig extends IntegrationConfig {
    clientId: string
    clientSecret: string
    refreshToken: string
    adminEmail: string
}

export interface SyncResult {
    integrationId: string
    status: 'success' | 'error' | 'partial'
    recordsProcessed: number
    recordsCreated: number
    recordsUpdated: number
    recordsSkipped: number
    errors: SyncError[]
    startTime: number
    endTime: number
    duration: number
}

export interface SyncError {
    id: string
    type: string
    message: string
    record?: Record<string, unknown>
    timestamp: number
}

export interface DataMapping {
    integrationId: string
    sourceField: string
    targetField: string
    transformation?: string
    isRequired: boolean
    defaultValue?: string | number | boolean
}

export interface IntegrationEvent {
    id: string
    integrationId: string
    type: string
    data: Record<string, any>
    status: 'pending' | 'processed' | 'failed'
    timestamp: number
    retryCount: number
}

export interface ExternalContact {
    id: string
    externalId: string
    integrationId: string
    firstName: string
    lastName: string
    email: string
    phone?: string
    company?: string
    title?: string
    lastSync: number
}

export interface ExternalContract {
    id: string
    externalId: string
    integrationId: string
    title: string
    description?: string
    value?: number
    currency?: string
    startDate?: number
    endDate?: number
    status: string
    contactId?: string
    lastSync: number
}

export interface IntegrationMetrics {
    totalIntegrations: number
    activeIntegrations: number
    totalSyncs: number
    successfulSyncs: number
    failedSyncs: number
    averageSyncTime: number
    lastSyncTime: number
    dataVolume: {
        contacts: number
        contracts: number
        documents: number
        events: number
    }
}

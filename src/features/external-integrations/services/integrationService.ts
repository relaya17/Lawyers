import {
    Integration,
    IntegrationConfig,
    SyncResult,
    IntegrationMetrics,
    ExternalContact,
    ExternalContract,
    IntegrationType,
    IntegrationStatus,
    SalesforceConfig,
    SAPConfig,
    Office365Config,
    GoogleWorkspaceConfig
} from '../types/integrationTypes'

interface CalendarEvent {
    id: string
    externalId: string
    title: string
    startTime: number
    duration: number
    attendees: number
}

interface DriveFile {
    id: string
    externalId: string
    name: string
    type: string
    size: number
    modifiedTime: number
}

class IntegrationService {
    private integrations: Map<string, Integration> = new Map()
    private syncHistory: SyncResult[] = []

    constructor() {
        this.initializeIntegrations()
    }

    // Integration Management
    async getIntegrations(): Promise<Integration[]> {
        return Array.from(this.integrations.values())
    }

    async getIntegration(id: string): Promise<Integration | null> {
        return this.integrations.get(id) || null
    }

    async createIntegration(
        type: IntegrationType,
        name: string,
        provider: string,
        config: IntegrationConfig
    ): Promise<Integration> {
        const integration: Integration = {
            id: this.generateId(),
            name,
            type,
            provider,
            description: this.getProviderDescription(provider),
            status: 'pending',
            config,
            capabilities: this.getProviderCapabilities(provider),
            apiVersion: this.getProviderApiVersion(provider),
            lastSync: 0,
            createdAt: Date.now(),
            updatedAt: Date.now()
        }

        this.integrations.set(integration.id, integration)

        // Test connection
        await this.testConnection(integration.id)

        return integration
    }

    async updateIntegration(id: string, updates: Partial<Integration>): Promise<Integration> {
        const integration = this.integrations.get(id)
        if (!integration) {
            throw new Error('Integration not found')
        }

        const updated = {
            ...integration,
            ...updates,
            updatedAt: Date.now()
        }

        this.integrations.set(id, updated)
        return updated
    }

    async deleteIntegration(id: string): Promise<void> {
        this.integrations.delete(id)
    }

    async testConnection(id: string): Promise<boolean> {
        const integration = this.integrations.get(id)
        if (!integration) {
            throw new Error('Integration not found')
        }

        try {
            // Simulate connection test
            await new Promise(resolve => setTimeout(resolve, 1000))

            const success = Math.random() > 0.2 // 80% success rate

            await this.updateIntegration(id, {
                status: success ? 'connected' : 'error'
            })

            return success
        } catch (error) {
            await this.updateIntegration(id, { status: 'error' })
            throw error
        }
    }

    // Salesforce Integration
    async connectSalesforce(config: SalesforceConfig): Promise<Integration> {
        return await this.createIntegration('crm', 'Salesforce CRM', 'salesforce', config)
    }

    async syncSalesforceContacts(integrationId: string): Promise<SyncResult> {
        const integration = this.integrations.get(integrationId)
        if (!integration || integration.provider !== 'salesforce') {
            throw new Error('Invalid Salesforce integration')
        }

        const startTime = Date.now()

        try {
            // Simulate API call to Salesforce
            await new Promise(resolve => setTimeout(resolve, 2000))

            const mockContacts = this.generateMockSalesforceContacts()

            const result: SyncResult = {
                integrationId,
                status: 'success',
                recordsProcessed: mockContacts.length,
                recordsCreated: Math.floor(mockContacts.length * 0.3),
                recordsUpdated: Math.floor(mockContacts.length * 0.7),
                recordsSkipped: 0,
                errors: [],
                startTime,
                endTime: Date.now(),
                duration: Date.now() - startTime
            }

            this.syncHistory.push(result)
            await this.updateIntegration(integrationId, { lastSync: Date.now() })

            return result
        } catch (error) {
            const result: SyncResult = {
                integrationId,
                status: 'error',
                recordsProcessed: 0,
                recordsCreated: 0,
                recordsUpdated: 0,
                recordsSkipped: 0,
                errors: [{
                    id: this.generateId(),
                    type: 'connection_error',
                    message: 'Failed to connect to Salesforce API',
                    timestamp: Date.now()
                }],
                startTime,
                endTime: Date.now(),
                duration: Date.now() - startTime
            }

            this.syncHistory.push(result)
            throw error
        }
    }

    // SAP Integration
    async connectSAP(config: SAPConfig): Promise<Integration> {
        return await this.createIntegration('erp', 'SAP ERP', 'sap', config)
    }

    async syncSAPContracts(integrationId: string): Promise<SyncResult> {
        const integration = this.integrations.get(integrationId)
        if (!integration || integration.provider !== 'sap') {
            throw new Error('Invalid SAP integration')
        }

        const startTime = Date.now()

        try {
            // Simulate API call to SAP
            await new Promise(resolve => setTimeout(resolve, 3000))

            const mockContracts = this.generateMockSAPContracts()

            const result: SyncResult = {
                integrationId,
                status: 'success',
                recordsProcessed: mockContracts.length,
                recordsCreated: Math.floor(mockContracts.length * 0.2),
                recordsUpdated: Math.floor(mockContracts.length * 0.8),
                recordsSkipped: 0,
                errors: [],
                startTime,
                endTime: Date.now(),
                duration: Date.now() - startTime
            }

            this.syncHistory.push(result)
            await this.updateIntegration(integrationId, { lastSync: Date.now() })

            return result
        } catch (error) {
            const result: SyncResult = {
                integrationId,
                status: 'error',
                recordsProcessed: 0,
                recordsCreated: 0,
                recordsUpdated: 0,
                recordsSkipped: 0,
                errors: [{
                    id: this.generateId(),
                    type: 'sap_error',
                    message: 'Failed to connect to SAP system',
                    timestamp: Date.now()
                }],
                startTime,
                endTime: Date.now(),
                duration: Date.now() - startTime
            }

            this.syncHistory.push(result)
            throw error
        }
    }

    // Office 365 Integration
    async connectOffice365(config: Office365Config): Promise<Integration> {
        return await this.createIntegration('email', 'Microsoft Office 365', 'office365', config)
    }

    async syncOffice365Calendar(integrationId: string): Promise<SyncResult> {
        const integration = this.integrations.get(integrationId)
        if (!integration || integration.provider !== 'office365') {
            throw new Error('Invalid Office 365 integration')
        }

        const startTime = Date.now()

        try {
            // Simulate API call to Microsoft Graph
            await new Promise(resolve => setTimeout(resolve, 1500))

            const mockEvents = this.generateMockCalendarEvents()

            const result: SyncResult = {
                integrationId,
                status: 'success',
                recordsProcessed: mockEvents.length,
                recordsCreated: Math.floor(mockEvents.length * 0.4),
                recordsUpdated: Math.floor(mockEvents.length * 0.6),
                recordsSkipped: 0,
                errors: [],
                startTime,
                endTime: Date.now(),
                duration: Date.now() - startTime
            }

            this.syncHistory.push(result)
            await this.updateIntegration(integrationId, { lastSync: Date.now() })

            return result
        } catch (error) {
            const result: SyncResult = {
                integrationId,
                status: 'error',
                recordsProcessed: 0,
                recordsCreated: 0,
                recordsUpdated: 0,
                recordsSkipped: 0,
                errors: [{
                    id: this.generateId(),
                    type: 'office365_error',
                    message: 'Failed to connect to Microsoft Graph API',
                    timestamp: Date.now()
                }],
                startTime,
                endTime: Date.now(),
                duration: Date.now() - startTime
            }

            this.syncHistory.push(result)
            throw error
        }
    }

    // Google Workspace Integration
    async connectGoogleWorkspace(config: GoogleWorkspaceConfig): Promise<Integration> {
        return await this.createIntegration('cloud_storage', 'Google Workspace', 'google', config)
    }

    async syncGoogleDrive(integrationId: string): Promise<SyncResult> {
        const integration = this.integrations.get(integrationId)
        if (!integration || integration.provider !== 'google') {
            throw new Error('Invalid Google Workspace integration')
        }

        const startTime = Date.now()

        try {
            // Simulate API call to Google Drive
            await new Promise(resolve => setTimeout(resolve, 2500))

            const mockFiles = this.generateMockGoogleDriveFiles()

            const result: SyncResult = {
                integrationId,
                status: 'success',
                recordsProcessed: mockFiles.length,
                recordsCreated: Math.floor(mockFiles.length * 0.5),
                recordsUpdated: Math.floor(mockFiles.length * 0.5),
                recordsSkipped: 0,
                errors: [],
                startTime,
                endTime: Date.now(),
                duration: Date.now() - startTime
            }

            this.syncHistory.push(result)
            await this.updateIntegration(integrationId, { lastSync: Date.now() })

            return result
        } catch (error) {
            const result: SyncResult = {
                integrationId,
                status: 'error',
                recordsProcessed: 0,
                recordsCreated: 0,
                recordsUpdated: 0,
                recordsSkipped: 0,
                errors: [{
                    id: this.generateId(),
                    type: 'google_error',
                    message: 'Failed to connect to Google Drive API',
                    timestamp: Date.now()
                }],
                startTime,
                endTime: Date.now(),
                duration: Date.now() - startTime
            }

            this.syncHistory.push(result)
            throw error
        }
    }

    // Sync Management
    async syncAllIntegrations(): Promise<SyncResult[]> {
        const activeIntegrations = Array.from(this.integrations.values())
            .filter(integration => integration.status === 'connected')

        const results: SyncResult[] = []

        for (const integration of activeIntegrations) {
            try {
                let result: SyncResult

                switch (integration.provider) {
                    case 'salesforce':
                        result = await this.syncSalesforceContacts(integration.id)
                        break
                    case 'sap':
                        result = await this.syncSAPContracts(integration.id)
                        break
                    case 'office365':
                        result = await this.syncOffice365Calendar(integration.id)
                        break
                    case 'google':
                        result = await this.syncGoogleDrive(integration.id)
                        break
                    default:
                        continue
                }

                results.push(result)
            } catch (error) {
                console.error(`Sync failed for integration ${integration.id}:`, error)
            }
        }

        return results
    }

    async getSyncHistory(integrationId?: string): Promise<SyncResult[]> {
        if (integrationId) {
            return this.syncHistory.filter(sync => sync.integrationId === integrationId)
        }
        return this.syncHistory
    }

    async getIntegrationMetrics(): Promise<IntegrationMetrics> {
        const integrations = Array.from(this.integrations.values())
        const activeIntegrations = integrations.filter(i => i.status === 'connected')
        const successfulSyncs = this.syncHistory.filter(s => s.status === 'success')
        const failedSyncs = this.syncHistory.filter(s => s.status === 'error')

        return {
            totalIntegrations: integrations.length,
            activeIntegrations: activeIntegrations.length,
            totalSyncs: this.syncHistory.length,
            successfulSyncs: successfulSyncs.length,
            failedSyncs: failedSyncs.length,
            averageSyncTime: this.syncHistory.length > 0
                ? this.syncHistory.reduce((acc, sync) => acc + sync.duration, 0) / this.syncHistory.length
                : 0,
            lastSyncTime: Math.max(...this.syncHistory.map(s => s.endTime), 0),
            dataVolume: {
                contacts: this.syncHistory.reduce((acc, sync) =>
                    acc + (sync.integrationId.includes('salesforce') ? sync.recordsProcessed : 0), 0),
                contracts: this.syncHistory.reduce((acc, sync) =>
                    acc + (sync.integrationId.includes('sap') ? sync.recordsProcessed : 0), 0),
                documents: this.syncHistory.reduce((acc, sync) =>
                    acc + (sync.integrationId.includes('google') ? sync.recordsProcessed : 0), 0),
                events: this.syncHistory.reduce((acc, sync) =>
                    acc + (sync.integrationId.includes('office365') ? sync.recordsProcessed : 0), 0)
            }
        }
    }

    // Helper Methods
    private initializeIntegrations(): void {
        // Initialize with some demo integrations
        const demoIntegrations: Integration[] = [
            {
                id: 'demo-salesforce',
                name: 'Salesforce Production',
                type: 'crm',
                provider: 'salesforce',
                description: 'Customer Relationship Management',
                status: 'connected',
                config: {
                    apiKey: 'demo-key',
                    baseUrl: 'https://company.salesforce.com'
                },
                capabilities: ['contacts', 'opportunities', 'accounts'],
                apiVersion: 'v59.0',
                lastSync: Date.now() - 3600000, // 1 hour ago
                createdAt: Date.now() - 86400000, // 1 day ago
                updatedAt: Date.now() - 3600000
            }
        ]

        demoIntegrations.forEach(integration => {
            this.integrations.set(integration.id, integration)
        })
    }

    private getProviderDescription(provider: string): string {
        const descriptions = {
            salesforce: 'Customer Relationship Management platform',
            sap: 'Enterprise Resource Planning system',
            office365: 'Microsoft productivity suite',
            google: 'Google Workspace and cloud services',
            hubspot: 'Inbound marketing and sales platform',
            zoho: 'Business software suite',
            dynamics: 'Microsoft business applications',
            slack: 'Team communication platform',
            teams: 'Microsoft collaboration platform',
            dropbox: 'Cloud file storage and sharing'
        }
        return descriptions[provider as keyof typeof descriptions] || 'External service'
    }

    private getProviderCapabilities(provider: string): string[] {
        const capabilities = {
            salesforce: ['contacts', 'opportunities', 'accounts', 'leads', 'cases'],
            sap: ['contracts', 'vendors', 'purchase_orders', 'invoices'],
            office365: ['email', 'calendar', 'contacts', 'tasks'],
            google: ['drive', 'docs', 'sheets', 'calendar', 'contacts'],
            hubspot: ['contacts', 'companies', 'deals', 'tickets'],
            zoho: ['crm', 'books', 'projects', 'desk'],
            dynamics: ['sales', 'marketing', 'service', 'finance'],
            slack: ['messaging', 'files', 'channels'],
            teams: ['chat', 'meetings', 'files', 'apps'],
            dropbox: ['files', 'folders', 'sharing']
        }
        return capabilities[provider as keyof typeof capabilities] || []
    }

    private getProviderApiVersion(provider: string): string {
        const versions = {
            salesforce: 'v59.0',
            sap: '2.0',
            office365: 'v1.0',
            google: 'v3',
            hubspot: 'v3',
            zoho: 'v2',
            dynamics: '9.2',
            slack: 'v1',
            teams: 'v1.0',
            dropbox: 'v2'
        }
        return versions[provider as keyof typeof versions] || '1.0'
    }

    private generateMockSalesforceContacts(): ExternalContact[] {
        const contacts: ExternalContact[] = []
        const firstNames = ['יוסי', 'דנה', 'מיכל', 'אבי', 'רותי', 'עמית', 'שירה', 'דוד']
        const lastNames = ['כהן', 'לוי', 'חדד', 'מזרחי', 'אברהם', 'דוד', 'שלום', 'בן דוד']
        const companies = ['טכנולוגיות ABC', 'חברת XYZ', 'אלפא טק', 'בטא סולושנס', 'גמא אינק']

        for (let i = 0; i < 15; i++) {
            contacts.push({
                id: this.generateId(),
                externalId: `sf_${i + 1}`,
                integrationId: 'demo-salesforce',
                firstName: firstNames[Math.floor(Math.random() * firstNames.length)],
                lastName: lastNames[Math.floor(Math.random() * lastNames.length)],
                email: `contact${i + 1}@example.com`,
                phone: `050-${Math.random().toString().slice(2, 9)}`,
                company: companies[Math.floor(Math.random() * companies.length)],
                title: ['מנהל', 'רכש', 'מנכ"ל', 'יועץ משפטי', 'מנהל כספים'][Math.floor(Math.random() * 5)],
                lastSync: Date.now()
            })
        }

        return contacts
    }

    private generateMockSAPContracts(): ExternalContract[] {
        const contracts: ExternalContract[] = []
        const titles = [
            'חוזה שירותי ייעוץ',
            'הסכם אספקה',
            'חוזה שכירות משרדים',
            'הסכם שיתוף פעולה',
            'חוזה תחזוקה'
        ]

        for (let i = 0; i < 10; i++) {
            contracts.push({
                id: this.generateId(),
                externalId: `sap_${i + 1}`,
                integrationId: 'demo-sap',
                title: titles[Math.floor(Math.random() * titles.length)],
                description: 'תיאור החוזה מתוך מערכת SAP',
                value: Math.floor(Math.random() * 500000) + 50000,
                currency: 'ILS',
                startDate: Date.now() - Math.floor(Math.random() * 365) * 24 * 60 * 60 * 1000,
                endDate: Date.now() + Math.floor(Math.random() * 365) * 24 * 60 * 60 * 1000,
                status: ['active', 'pending', 'expired'][Math.floor(Math.random() * 3)],
                lastSync: Date.now()
            })
        }

        return contracts
    }

    private generateMockCalendarEvents(): CalendarEvent[] {
        const events = []
        const eventTypes = [
            'פגישת לקוח',
            'ייעוץ משפטי',
            'דיון בבית משפט',
            'פגישת צוות',
            'בדיקת חוזה'
        ]

        for (let i = 0; i < 8; i++) {
            events.push({
                id: this.generateId(),
                externalId: `cal_${i + 1}`,
                title: eventTypes[Math.floor(Math.random() * eventTypes.length)],
                startTime: Date.now() + Math.floor(Math.random() * 7) * 24 * 60 * 60 * 1000,
                duration: (1 + Math.floor(Math.random() * 3)) * 60 * 60 * 1000, // 1-4 hours
                attendees: Math.floor(Math.random() * 5) + 1
            })
        }

        return events
    }

    private generateMockGoogleDriveFiles(): DriveFile[] {
        const files = []
        const fileTypes = [
            'חוזה שירותים.pdf',
            'הצעת מחיר.docx',
            'ניתוח סיכונים.xlsx',
            'מצגת לקוח.pptx',
            'חוות דעת משפטית.pdf'
        ]

        for (let i = 0; i < 12; i++) {
            files.push({
                id: this.generateId(),
                externalId: `drive_${i + 1}`,
                name: fileTypes[Math.floor(Math.random() * fileTypes.length)],
                type: ['pdf', 'docx', 'xlsx', 'pptx'][Math.floor(Math.random() * 4)],
                size: Math.floor(Math.random() * 10000000) + 100000, // 100KB - 10MB
                modifiedTime: Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000
            })
        }

        return files
    }

    private generateId(): string {
        return Math.random().toString(36).substr(2, 9)
    }
}

export const integrationService = new IntegrationService()

import {
    SiriShortcut,
    SiriIntent,
    SiriResponse,
    SiriConfiguration,
    SiriVoiceSettings,
    SiriAccessibilitySettings,
    SiriUsageAnalytics,
    SiriSuggestion,
    SiriConversation,
    SiriCategory,
    SiriIntentType
} from '../types/siriTypes'

interface SpeechRecognitionInterface {
    continuous: boolean
    interimResults: boolean
    lang: string
    onresult: (event: Event & { results: { [key: number]: { [key: number]: { transcript: string } } } }) => void
    onerror: (event: Event & { error: string }) => void
    onend: () => void
    start: () => void
    stop: () => void
}

class SiriService {
    private configuration: SiriConfiguration
    private conversations: SiriConversation[] = []
    private isListening: boolean = false
    private speechRecognition?: SpeechRecognitionInterface

    constructor() {
        this.configuration = this.getDefaultConfiguration()
        this.initializeSiriIntegration()
    }

    // Initialization
    private async initializeSiriIntegration(): Promise<void> {
        try {
            // Check if SiriKit is available (would be through native bridge in real app)
            const hasSiriSupport = this.checkSiriSupport()

            if (!hasSiriSupport) {
                console.log('Siri not supported on this platform')
                return
            }

            // Initialize default shortcuts
            await this.setupDefaultShortcuts()

            // Setup voice recognition if available
            this.setupVoiceRecognition()

            console.log('Siri integration initialized successfully')
        } catch (error) {
            console.error('Siri initialization failed:', error)
        }
    }

    private checkSiriSupport(): boolean {
        // In a real app, this would check for SiriKit framework
        const userAgent = navigator.userAgent
        const isIOS = /iPad|iPhone|iPod/.test(userAgent)
        const isStandalone = (window.navigator as { standalone?: boolean }).standalone === true ||
            window.matchMedia('(display-mode: standalone)').matches

        return isIOS && isStandalone && 'speechSynthesis' in window
    }

    // Shortcuts Management
    async createShortcut(shortcut: Omit<SiriShortcut, 'id' | 'usageCount' | 'lastUsed' | 'createdAt'>): Promise<SiriShortcut> {
        const newShortcut: SiriShortcut = {
            ...shortcut,
            id: this.generateId(),
            usageCount: 0,
            lastUsed: 0,
            createdAt: Date.now()
        }

        this.configuration.shortcuts.push(newShortcut)

        // In real app, this would register with SiriKit
        await this.registerShortcutWithSiri(newShortcut)

        return newShortcut
    }

    async updateShortcut(id: string, updates: Partial<SiriShortcut>): Promise<SiriShortcut> {
        const index = this.configuration.shortcuts.findIndex(s => s.id === id)
        if (index === -1) {
            throw new Error('Shortcut not found')
        }

        this.configuration.shortcuts[index] = {
            ...this.configuration.shortcuts[index],
            ...updates
        }

        await this.registerShortcutWithSiri(this.configuration.shortcuts[index])
        return this.configuration.shortcuts[index]
    }

    async deleteShortcut(id: string): Promise<void> {
        const index = this.configuration.shortcuts.findIndex(s => s.id === id)
        if (index === -1) {
            throw new Error('Shortcut not found')
        }

        await this.unregisterShortcutWithSiri(id)
        this.configuration.shortcuts.splice(index, 1)
    }

    getShortcuts(): SiriShortcut[] {
        return this.configuration.shortcuts
    }

    getShortcutsByCategory(category: SiriCategory): SiriShortcut[] {
        return this.configuration.shortcuts.filter(s => s.category === category)
    }

    // Intent Processing
    async processIntent(phrase: string): Promise<SiriResponse> {
        const intent = await this.recognizeIntent(phrase)

        this.configuration.analytics.totalInvocations++

        try {
            const response = await this.executeIntent(intent)
            this.configuration.analytics.successfulResponses++

            // Update shortcut usage if applicable
            const matchingShortcut = this.findMatchingShortcut(phrase)
            if (matchingShortcut) {
                matchingShortcut.usageCount++
                matchingShortcut.lastUsed = Date.now()
            }

            return response
        } catch (error) {
            this.configuration.analytics.failedResponses++
            throw error
        }
    }

    private async recognizeIntent(phrase: string): Promise<SiriIntent> {
        // Simple intent recognition based on keywords
        const lowerPhrase = phrase.toLowerCase()

        let type: SiriIntentType = 'get_status'
        let confidence = 0.5
        const parameters: Record<string, any> = {}

        // Contract management
        if (lowerPhrase.includes('חוזה') || lowerPhrase.includes('contract')) {
            if (lowerPhrase.includes('חפש') || lowerPhrase.includes('search')) {
                type = 'search_contracts'
                confidence = 0.8
            } else if (lowerPhrase.includes('צור') || lowerPhrase.includes('create')) {
                type = 'create_contract'
                confidence = 0.8
            }
        }

        // Meeting management
        else if (lowerPhrase.includes('פגישה') || lowerPhrase.includes('meeting')) {
            type = 'schedule_meeting'
            confidence = 0.8
        }

        // Document review
        else if (lowerPhrase.includes('סקור') || lowerPhrase.includes('review')) {
            type = 'review_document'
            confidence = 0.8
        }

        // Risk assessment
        else if (lowerPhrase.includes('סיכון') || lowerPhrase.includes('risk')) {
            type = 'analyze_risk'
            confidence = 0.8
        }

        // Deadlines
        else if (lowerPhrase.includes('מועד') || lowerPhrase.includes('deadline')) {
            type = 'check_deadlines'
            confidence = 0.8
        }

        // Emergency
        else if (lowerPhrase.includes('חירום') || lowerPhrase.includes('emergency')) {
            type = 'emergency_contact'
            confidence = 0.9
        }

        return {
            id: this.generateId(),
            type,
            title: phrase,
            parameters,
            confidence,
            timestamp: Date.now()
        }
    }

    private async executeIntent(intent: SiriIntent): Promise<SiriResponse> {
        const startTime = Date.now()

        try {
            let response: SiriResponse

            switch (intent.type) {
                case 'search_contracts':
                    response = await this.handleSearchContracts()
                    break
                case 'create_contract':
                    response = await this.handleCreateContract()
                    break
                case 'schedule_meeting':
                    response = await this.handleScheduleMeeting()
                    break
                case 'review_document':
                    response = await this.handleReviewDocument()
                    break
                case 'analyze_risk':
                    response = await this.handleAnalyzeRisk()
                    break
                case 'check_deadlines':
                    response = await this.handleCheckDeadlines()
                    break
                case 'emergency_contact':
                    response = await this.handleEmergencyContact()
                    break
                case 'get_status':
                    response = await this.handleGetStatus()
                    break
                default:
                    response = {
                        text: 'מצטער, לא הבנתי את הבקשה. אנא נסה שוב.',
                        followUp: 'איך אוכל לעזור לך?'
                    }
            }

            const responseTime = Date.now() - startTime
            this.updateAnalytics(intent.type, responseTime)

            return response
        } catch (error) {
            console.error('Intent execution failed:', error)
            return {
                text: 'התרחשה שגיאה בעיבוד הבקשה. אנא נסה שוב מאוחר יותר.',
                followUp: 'האם ברצונך לנסות פעולה אחרת?'
            }
        }
    }

    // Intent Handlers
    private async handleSearchContracts(): Promise<SiriResponse> {
        // Simulate contract search
        await new Promise(resolve => setTimeout(resolve, 1000))

        const mockResults = [
            'חוזה שירותי ייעוץ - ABC חברה',
            'הסכם שכירות משרדים - XYZ נדל"ן',
            'חוזה אספקה - דלתא טכנולוגיות'
        ]

        return {
            text: `מצאתי ${mockResults.length} חוזים רלוונטיים. הנה התוצאות:`,
            data: { contracts: mockResults },
            actions: [{
                type: 'show_data',
                target: 'contracts_list',
                parameters: { results: mockResults }
            }],
            followUp: 'האם ברצונך לפתוח אחד מהחוזים?'
        }
    }

    private async handleCreateContract(): Promise<SiriResponse> {
        return {
            text: 'אפתח עבורך את עורך החוזים החדש.',
            actions: [{
                type: 'open_app',
                target: '/contract-editor'
            }],
            followUp: 'איזה סוג חוזה ברצונך ליצור?'
        }
    }

    private async handleScheduleMeeting(): Promise<SiriResponse> {
        return {
            text: 'אפתח עבורך את לוח הזמנים לקביעת פגישה.',
            actions: [{
                type: 'open_app',
                target: '/calendar'
            }],
            followUp: 'מתי הפגישה צריכה להתקיים?'
        }
    }

    private async handleReviewDocument(): Promise<SiriResponse> {
        const pendingDocs = ['חוזה שירותים - טיוטה', 'הסכם NDA - לבדיקה', 'חוות דעת משפטית - סיכום']

        return {
            text: `יש לך ${pendingDocs.length} מסמכים הממתינים לסקירה.`,
            data: { documents: pendingDocs },
            actions: [{
                type: 'show_data',
                target: 'pending_documents'
            }],
            followUp: 'איזה מסמך ברצונך לסקור תחילה?'
        }
    }

    private async handleAnalyzeRisk(): Promise<SiriResponse> {
        const riskLevel = ['נמוך', 'בינוני', 'גבוה'][Math.floor(Math.random() * 3)]
        const riskCount = Math.floor(Math.random() * 10) + 1

        return {
            text: `זוהו ${riskCount} סיכונים ברמת חומרה ${riskLevel} בתיק הפעיל.`,
            data: { riskLevel, riskCount },
            actions: [{
                type: 'open_app',
                target: '/risk-analysis'
            }],
            followUp: 'האם ברצונך לצפות בניתוח הסיכונים המפורט?'
        }
    }

    private async handleCheckDeadlines(): Promise<SiriResponse> {
        const urgentDeadlines = [
            { title: 'חוזה ABC - תפוגה', date: 'מחר' },
            { title: 'הגשת תביעה - XYZ', date: 'בעוד 3 ימים' },
            { title: 'תשובה למכתב עורך דין', date: 'בעוד שבוע' }
        ]

        return {
            text: `יש לך ${urgentDeadlines.length} מועדים דחופים בשבוע הקרוב.`,
            data: { deadlines: urgentDeadlines },
            actions: [{
                type: 'show_data',
                target: 'deadlines_list'
            }],
            followUp: 'האם ברצונך לקבל תזכורת על המועד הקרוב ביותר?'
        }
    }

    private async handleEmergencyContact(): Promise<SiriResponse> {
        return {
            text: 'אתקשר עבורך למספר החירום של המשרד.',
            actions: [{
                type: 'make_call',
                target: '+972-50-1234567'
            }],
            followUp: 'האם ברצונך גם לשלוח הודעה חירום?'
        }
    }

    private async handleGetStatus(): Promise<SiriResponse> {
        return {
            text: 'המערכת פועלת תקין. יש לך 5 חוזים פעילים, 3 משימות ממתינות ו-2 התראות חדשות.',
            data: {
                activeContracts: 5,
                pendingTasks: 3,
                newAlerts: 2
            },
            followUp: 'איך אוכל לעזור לך היום?'
        }
    }

    // Voice Recognition
    private setupVoiceRecognition(): void {
        if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
            console.warn('Speech recognition not supported')
            return
        }

        const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition
        const recognition = new SpeechRecognition()

        recognition.continuous = false
        recognition.interimResults = false
        recognition.lang = this.configuration.voiceSettings.language

        recognition.onresult = async (event: Event & { results: { [key: number]: { [key: number]: { transcript: string } } } }) => {
            const phrase = event.results[0][0].transcript
            console.log('Voice input received:', phrase)

            try {
                const response = await this.processIntent(phrase)
                await this.speakResponse(response.text)
            } catch (error) {
                console.error('Voice processing failed:', error)
            }
        }

        recognition.onerror = (event: Event & { error: string }) => {
            console.error('Speech recognition error:', event.error)
            this.isListening = false
        }

        recognition.onend = () => {
            this.isListening = false
        }

        // Store recognition instance for later use
        this.speechRecognition = recognition
    }

    async startListening(): Promise<void> {
        if (!this.configuration.isEnabled) {
            throw new Error('Siri integration is disabled')
        }

        if (this.isListening) {
            return
        }

        const recognition = this.speechRecognition
        if (!recognition) {
            throw new Error('Speech recognition not available')
        }

        try {
            this.isListening = true
            recognition.start()
        } catch (error) {
            this.isListening = false
            throw error
        }
    }

    stopListening(): void {
        const recognition = this.speechRecognition
        if (recognition && this.isListening) {
            recognition.stop()
            this.isListening = false
        }
    }

    // Speech Synthesis
    async speakResponse(text: string): Promise<void> {
        if (!this.configuration.voiceSettings.enabled) {
            return
        }

        if (!('speechSynthesis' in window)) {
            console.warn('Speech synthesis not supported')
            return
        }

        const utterance = new SpeechSynthesisUtterance(text)
        utterance.lang = this.configuration.voiceSettings.language
        utterance.rate = this.configuration.voiceSettings.rate
        utterance.pitch = this.configuration.voiceSettings.pitch
        utterance.volume = this.configuration.voiceSettings.volume

        speechSynthesis.speak(utterance)
    }

    // Shortcuts Registration (Mock)
    private async registerShortcutWithSiri(shortcut: SiriShortcut): Promise<void> {
        // In a real app, this would use INShortcut and donate to Siri
        console.log('Registering Siri shortcut:', shortcut.phrase)

        // Simulate registration delay
        await new Promise(resolve => setTimeout(resolve, 500))
    }

    private async unregisterShortcutWithSiri(shortcutId: string): Promise<void> {
        console.log('Unregistering Siri shortcut:', shortcutId)
        await new Promise(resolve => setTimeout(resolve, 300))
    }

    // Default Setup
    private async setupDefaultShortcuts(): Promise<void> {
        const defaultShortcuts = [
            {
                title: 'חפש חוזים',
                phrase: 'חפש חוזים',
                description: 'חיפוש חוזים במערכת',
                category: 'contract_management' as SiriCategory,
                parameters: [],
                isEnabled: true
            },
            {
                title: 'מצב המערכת',
                phrase: 'מה המצב',
                description: 'הצגת סטטוס המערכת',
                category: 'quick_actions' as SiriCategory,
                parameters: [],
                isEnabled: true
            },
            {
                title: 'קבע פגישה',
                phrase: 'קבע פגישה',
                description: 'קביעת פגישה חדשה',
                category: 'meeting_management' as SiriCategory,
                parameters: [],
                isEnabled: true
            },
            {
                title: 'בדוק מועדים',
                phrase: 'בדוק מועדים',
                description: 'בדיקת מועדים דחופים',
                category: 'quick_actions' as SiriCategory,
                parameters: [],
                isEnabled: true
            },
            {
                title: 'חירום משפטי',
                phrase: 'חירום משפטי',
                description: 'יצירת קשר חירום',
                category: 'client_communication' as SiriCategory,
                parameters: [],
                isEnabled: true
            }
        ]

        for (const shortcut of defaultShortcuts) {
            await this.createShortcut(shortcut)
        }
    }

    // Configuration Management
    getConfiguration(): SiriConfiguration {
        return this.configuration
    }

    async updateVoiceSettings(settings: Partial<SiriVoiceSettings>): Promise<void> {
        this.configuration.voiceSettings = {
            ...this.configuration.voiceSettings,
            ...settings
        }
    }

    async updateAccessibilitySettings(settings: Partial<SiriAccessibilitySettings>): Promise<void> {
        this.configuration.accessibilitySettings = {
            ...this.configuration.accessibilitySettings,
            ...settings
        }
    }

    // Utility Methods
    private findMatchingShortcut(phrase: string): SiriShortcut | null {
        return this.configuration.shortcuts.find(s =>
            s.isEnabled && (s.phrase.toLowerCase() === phrase.toLowerCase() ||
                phrase.toLowerCase().includes(s.phrase.toLowerCase()))
        ) || null
    }

    private updateAnalytics(intentType: SiriIntentType, responseTime: number): void {
        const analytics = this.configuration.analytics
        analytics.lastActivity = Date.now()

        // Update average response time
        const total = analytics.averageResponseTime * (analytics.totalInvocations - 1) + responseTime
        analytics.averageResponseTime = total / analytics.totalInvocations
    }

    private generateId(): string {
        return Math.random().toString(36).substr(2, 9)
    }

    private getDefaultConfiguration(): SiriConfiguration {
        return {
            shortcuts: [],
            voiceSettings: {
                language: 'he-IL',
                voice: 'he-IL',
                rate: 1.0,
                pitch: 1.0,
                volume: 1.0,
                enabled: true
            },
            accessibilitySettings: {
                announceNotifications: true,
                confirmActions: true,
                verboseMode: false,
                shortcuts: true
            },
            isEnabled: true,
            suggestions: [],
            analytics: {
                totalInvocations: 0,
                successfulResponses: 0,
                failedResponses: 0,
                averageResponseTime: 0,
                popularShortcuts: [],
                usageByCategory: {} as Record<SiriCategory, number>,
                lastActivity: 0
            }
        }
    }

    // Public Status Methods
    isEnabled(): boolean {
        return this.configuration.isEnabled
    }

    isCurrentlyListening(): boolean {
        return this.isListening
    }

    getAnalytics(): SiriUsageAnalytics {
        return this.configuration.analytics
    }

    getSuggestions(): SiriSuggestion[] {
        return this.configuration.suggestions
    }
}

export const siriService = new SiriService()

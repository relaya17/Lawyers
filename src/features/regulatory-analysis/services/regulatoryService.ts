import {
    RegulatoryUpdate,
    RegulatoryCompliance,
    RegulatoryAlert,
    RegulatoryAnalysisRequest,
    RegulatoryAnalysisResponse,
    ComplianceViolation,
    ComplianceWarning,
    ComplianceRecommendation,
    RegulatoryImpactAnalysis,
    RegulatoryMonitoringConfig,
    RegulatoryDashboardData,
    ContractArea
} from '../types'

class RegulatoryAnalysisService {
    private baseUrl = process.env.VITE_API_URL || ''
    private regulatoryUpdates: Map<string, RegulatoryUpdate> = new Map()
    private monitoringConfigs: Map<string, RegulatoryMonitoringConfig> = new Map()

    constructor() {
        this.initializeMockData()
    }

    // ניתוח רגולציה דינמי לחוזה
    async analyzeContractCompliance(request: RegulatoryAnalysisRequest): Promise<RegulatoryAnalysisResponse> {
        try {
            const startTime = Date.now()

            // Mock analysis based on contract content
            const compliance = await this.checkCompliance(request)
            const alerts = await this.generateAlerts(request.contractId, compliance)
            const suggestedActions = await this.generateRecommendations(compliance)

            const analysisTime = Date.now() - startTime

            return {
                compliance,
                alerts,
                suggestedActions,
                confidence: 85,
                analysisTime,
                nextReviewDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
            }
        } catch (error) {
            console.error('Regulatory analysis failed:', error)
            throw new Error('שגיאה בניתוח רגולציה')
        }
    }

    // בדיקת תאימות לרגולציה
    private async checkCompliance(request: RegulatoryAnalysisRequest): Promise<RegulatoryCompliance> {
        await new Promise(resolve => setTimeout(resolve, 1500)) // Simulate API call

        const violations = this.identifyViolations(request)
        const warnings = this.generateWarnings(request)

        const complianceScore = Math.max(0, 100 - (violations.length * 15) - (warnings.length * 5))

        return {
            contractId: request.contractId,
            isCompliant: complianceScore >= 70,
            complianceScore,
            violations,
            warnings,
            recommendations: [],
            lastChecked: new Date(),
            nextReview: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            autoMonitoring: true
        }
    }

    // זיהוי הפרות רגולציה
    private identifyViolations(request: RegulatoryAnalysisRequest): ComplianceViolation[] {
        const violations: ComplianceViolation[] = []
        const contractText = request.contractText.toLowerCase()

        // בדיקת GDPR (אם רלוונטי)
        if (request.jurisdiction === 'eu' || contractText.includes('נתונים אישיים')) {
            if (!contractText.includes('gdpr') && !contractText.includes('הגנת הפרטיות')) {
                violations.push({
                    id: 'gdpr_missing',
                    severity: 'high',
                    type: 'missing_clause',
                    regulation: this.getMockRegulation('gdpr'),
                    description: 'חסר סעיף הגנת פרטיות תואם GDPR',
                    consequence: 'קנס עד 4% מהמחזור השנתי',
                    remedy: 'הוספת סעיף הגנת פרטיות מפורט',
                    estimatedFix: {
                        timeMinutes: 30,
                        complexityLevel: 'moderate',
                        requiredApprovals: ['legal_team', 'privacy_officer']
                    }
                })
            }
        }

        // בדיקת חוק חוזה עבודה (ישראל)
        if (request.contractType === 'employment' && request.jurisdiction === 'israel') {
            if (!contractText.includes('תקופת הודעה') && !contractText.includes('הודעה מוקדמת')) {
                violations.push({
                    id: 'employment_notice_missing',
                    severity: 'medium',
                    type: 'missing_clause',
                    regulation: this.getMockRegulation('employment_law'),
                    description: 'חסר סעיף תקופת הודעה מוקדמת',
                    consequence: 'תביעה אפשרית מצד העובד',
                    remedy: 'הוספת סעיף תקופת הודעה כחוק',
                    estimatedFix: {
                        timeMinutes: 15,
                        complexityLevel: 'simple',
                        requiredApprovals: ['hr_manager']
                    }
                })
            }
        }

        // בדיקת חוק הגנת הצרכן
        if (request.contractType === 'commercial' && contractText.includes('צרכן')) {
            if (!contractText.includes('זכות ביטול') && !contractText.includes('14 יום')) {
                violations.push({
                    id: 'consumer_cancellation_missing',
                    severity: 'high',
                    type: 'missing_clause',
                    regulation: this.getMockRegulation('consumer_protection'),
                    description: 'חסר סעיף זכות ביטול צרכן',
                    consequence: 'הפרת חוק הגנת הצרכן',
                    remedy: 'הוספת סעיף זכות ביטול ל-14 יום',
                    estimatedFix: {
                        timeMinutes: 20,
                        complexityLevel: 'simple',
                        requiredApprovals: ['legal_team']
                    }
                })
            }
        }

        return violations
    }

    // יצירת אזהרות
    private generateWarnings(request: RegulatoryAnalysisRequest): ComplianceWarning[] {
        const warnings: ComplianceWarning[] = []

        // אזהרה על שינוי חקיקה קרוב
        warnings.push({
            id: 'upcoming_privacy_law',
            type: 'upcoming_change',
            priority: 'high',
            description: 'חוק הגנת הפרטיות החדש ייכנס לתוקף בעוד 3 חודשים',
            recommendation: 'עדכון סעיפי פרטיות בחוזה',
            deadline: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
            relatedRegulation: 'privacy_law_2024'
        })

        // אזהרה על סתירה פוטנציאלית
        if (request.contractText.includes('עובד') && request.contractText.includes('קבלן')) {
            warnings.push({
                id: 'worker_classification',
                type: 'potential_conflict',
                priority: 'medium',
                description: 'סיווג עובד/קבלן עלול להיות בעייתי',
                recommendation: 'הבהרת סטטוס העובד בהתאם לפסיקה עדכנית',
                relatedRegulation: 'labor_law_updates'
            })
        }

        return warnings
    }

    // יצירת המלצות
    private async generateRecommendations(compliance: RegulatoryCompliance): Promise<ComplianceRecommendation[]> {
        const recommendations: ComplianceRecommendation[] = []

        // המלצות בהתבסס על הפרות
        compliance.violations.forEach(violation => {
            recommendations.push({
                id: `rec_${violation.id}`,
                type: 'add_clause',
                priority: violation.severity === 'critical' ? 'high' : violation.severity === 'high' ? 'medium' : 'low',
                title: `תיקון: ${violation.description}`,
                description: violation.remedy,
                legalBasis: violation.regulation.title,
                businessImpact: 'positive',
                implementationCost: violation.estimatedFix.complexityLevel === 'simple' ? 'low' :
                    violation.estimatedFix.complexityLevel === 'moderate' ? 'medium' : 'high'
            })
        })

        // המלצות כלליות
        recommendations.push({
            id: 'general_review',
            type: 'review_clause',
            priority: 'medium',
            title: 'סקירה כללית של סעיפי אחריות',
            description: 'מומלץ לסקור ולעדכן סעיפי אחריות בהתאם לפסיקה עדכנית',
            legalBasis: 'פסיקה עדכנית בנושא אחריות',
            businessImpact: 'positive',
            implementationCost: 'medium'
        })

        return recommendations
    }

    // יצירת התראות
    private async generateAlerts(contractId: string, compliance: RegulatoryCompliance): Promise<RegulatoryAlert[]> {
        const alerts: RegulatoryAlert[] = []

        // התראות על הפרות קריטיות
        compliance.violations.forEach(violation => {
            if (violation.severity === 'critical' || violation.severity === 'high') {
                alerts.push({
                    id: `alert_${violation.id}`,
                    type: 'compliance_breach',
                    severity: violation.severity === 'critical' ? 'critical' : 'error',
                    title: `הפרת רגולציה: ${violation.regulation.title}`,
                    message: violation.description,
                    affectedContracts: [contractId],
                    actionRequired: true,
                    autoGenerated: true
                })
            }
        })

        // התראות על מועדים קרובים
        compliance.warnings.forEach(warning => {
            if (warning.deadline && warning.deadline.getTime() - Date.now() < 30 * 24 * 60 * 60 * 1000) {
                alerts.push({
                    id: `deadline_${warning.id}`,
                    type: 'deadline_approaching',
                    severity: 'warning',
                    title: 'מועד יעד מתקרב',
                    message: warning.description,
                    affectedContracts: [contractId],
                    actionRequired: true,
                    deadline: warning.deadline,
                    autoGenerated: true
                })
            }
        })

        return alerts
    }

    // קבלת עדכונים רגולטוריים
    async getRegulatoryUpdates(filters?: {
        jurisdiction?: string
        area?: string
        urgency?: string
        fromDate?: Date
    }): Promise<RegulatoryUpdate[]> {
        let updates = Array.from(this.regulatoryUpdates.values())

        if (filters) {
            if (filters.jurisdiction) {
                updates = updates.filter(u => u.jurisdiction === filters.jurisdiction)
            }
            if (filters.urgency) {
                updates = updates.filter(u => u.urgency === filters.urgency)
            }
            if (filters.fromDate) {
                updates = updates.filter(u => u.publishedDate >= filters.fromDate!)
            }
        }

        return updates.sort((a, b) => b.publishedDate.getTime() - a.publishedDate.getTime())
    }

    // קבלת dashboard data
    async getDashboardData(): Promise<RegulatoryDashboardData> {
        await new Promise(resolve => setTimeout(resolve, 500))

        return {
            overallComplianceScore: 78,
            activeAlerts: 12,
            upcomingDeadlines: {
                urgent: 2,
                thisWeek: 5,
                thisMonth: 8
            },
            recentUpdates: Array.from(this.regulatoryUpdates.values()).slice(0, 5),
            complianceByArea: {
                'employment': 85,
                'privacy': 72,
                'commercial': 80,
                'real_estate': 90
            },
            riskTrends: [
                { date: '2024-01-01', score: 75 },
                { date: '2024-02-01', score: 78 },
                { date: '2024-03-01', score: 76 },
                { date: '2024-04-01', score: 80 },
                { date: '2024-05-01', score: 78 }
            ],
            topViolations: [
                { type: 'חסרה הגנת פרטיות', count: 8, severity: 'high' },
                { type: 'תקופת הודעה לא מוגדרת', count: 5, severity: 'medium' },
                { type: 'זכות ביטול צרכן', count: 3, severity: 'high' }
            ]
        }
    }

    // הגדרת מעקב אוטומטי
    async setupMonitoring(config: RegulatoryMonitoringConfig): Promise<void> {
        this.monitoringConfigs.set(config.contractId, config)
        console.log(`Monitoring setup for contract ${config.contractId}`)
    }

    // סימולציה של נתונים
    private initializeMockData(): void {
        // רגולציות לדוגמה
        const gdprRegulation: RegulatoryUpdate = {
            id: 'gdpr',
            title: 'GDPR - הגנת פרטיות באיחוד האירופי',
            description: 'תקנות הגנת פרטיות כלליות באיחוד האירופי',
            source: 'international',
            jurisdiction: 'eu',
            type: 'regulation',
            urgency: 'high',
            effectiveDate: new Date('2018-05-25'),
            publishedDate: new Date('2016-04-27'),
            impactLevel: 'critical',
            affectedAreas: [
                { id: 'privacy', name: 'Privacy', hebrewName: 'פרטיות', category: 'privacy', subcategories: ['data_collection', 'consent'] }
            ],
            summary: 'תקנות מחמירות להגנת פרטיות אישית',
            sourceUrl: 'https://gdpr.eu',
            tags: ['privacy', 'data_protection', 'eu'],
            relatedUpdates: []
        }

        const employmentLaw: RegulatoryUpdate = {
            id: 'employment_law',
            title: 'חוק חוזה עבודה תשנ"א-1991',
            description: 'חוק המסדיר יחסי עבודה בישראל',
            source: 'knesset',
            jurisdiction: 'israel',
            type: 'law',
            urgency: 'medium',
            effectiveDate: new Date('1991-01-01'),
            publishedDate: new Date('1991-01-01'),
            impactLevel: 'major',
            affectedAreas: [
                { id: 'employment', name: 'Employment', hebrewName: 'עבודה', category: 'employment', subcategories: ['contracts', 'termination'] }
            ],
            summary: 'חוק המסדיר זכויות וחובות של מעסיקים ועובדים',
            sourceUrl: 'https://www.nevo.co.il',
            tags: ['employment', 'labor', 'israel'],
            relatedUpdates: []
        }

        this.regulatoryUpdates.set('gdpr', gdprRegulation)
        this.regulatoryUpdates.set('employment_law', employmentLaw)
    }

    private getMockRegulation(id: string): RegulatoryUpdate {
        return this.regulatoryUpdates.get(id) || {
            id,
            title: 'רגולציה לא ידועה',
            description: '',
            source: 'regulator',
            jurisdiction: 'israel',
            type: 'regulation',
            urgency: 'medium',
            effectiveDate: new Date(),
            publishedDate: new Date(),
            impactLevel: 'moderate',
            affectedAreas: [],
            summary: '',
            sourceUrl: '',
            tags: [],
            relatedUpdates: []
        }
    }
}

export const regulatoryAnalysisService = new RegulatoryAnalysisService()

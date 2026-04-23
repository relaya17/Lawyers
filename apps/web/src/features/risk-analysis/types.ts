// Risk Analysis Types
// טיפוסים לניתוח סיכון

export interface RiskFactor {
    id: string
    name: string
    description: string
    category: RiskCategory
    severity: RiskSeverity
    probability: number // 0-1
    impact: number // 0-1
    mitigation: string
    cost: number
    timeframe: string
}

export interface RiskAssessment {
    id: string
    contractId: string
    factors: RiskFactor[]
    overallRisk: number // 0-1
    riskLevel: RiskLevel
    recommendations: string[]
    createdAt: Date
    updatedAt: Date
}

export interface RiskReport {
    id: string
    assessmentId: string
    summary: string
    details: RiskFactor[]
    charts: RiskChart[]
    recommendations: string[]
    generatedAt: Date
}

export interface RiskChart {
    type: 'pie' | 'bar' | 'line'
    data: Record<string, unknown>
    title: string
}

export enum RiskCategory {
    LEGAL = 'legal',
    FINANCIAL = 'financial',
    OPERATIONAL = 'operational',
    COMPLIANCE = 'compliance',
    REPUTATIONAL = 'reputational',
    TECHNICAL = 'technical'
}

export enum RiskSeverity {
    LOW = 'low',
    MEDIUM = 'medium',
    HIGH = 'high',
    CRITICAL = 'critical'
}

export enum RiskLevel {
    MINIMAL = 'minimal',
    LOW = 'low',
    MODERATE = 'moderate',
    HIGH = 'high',
    EXTREME = 'extreme'
}

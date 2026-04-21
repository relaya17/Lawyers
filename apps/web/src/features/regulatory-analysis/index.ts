// Regulatory Analysis Module - Export all components and services

export { default as RegulatoryDashboard } from './components/RegulatoryDashboard'
export { default as ComplianceAnalyzer } from './components/ComplianceAnalyzer'

export { regulatoryAnalysisService } from './services/regulatoryService'

export type {
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
} from './types'

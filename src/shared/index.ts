// @myorg/shared - Main entry point
// חבילה משותפת עבור אפליקציית עורכי הדין

// UI Components
export * from './src/components/ui/RichTextEditor'
export { RiskIndicator, RiskTrend, RiskLevel } from './src/components/ui/RiskIndicator'
export * from './src/components/ui/Charts'
export * from './src/components/ui/FormBuilder'
export * from './src/components/ui/SignaturePad'
export * from './src/components/ui/DocumentViewer'
export * from './src/components/ui/TouchGestureProvider'
export * from './src/components/ui/TouchGestureIndicator'
export * from './src/components/ui/Input'
export * from './src/components/ui/BiometricButton'
export * from './src/components/ui/ApplePayButton'
export * from './src/components/ui/AdvancedComponents'
export * from './src/components/ui/Table'
export * from './src/components/ui/Button'
export * from './src/components/ui/AppErrorBoundary'
export * from './src/components/ui/AccessibilityProvider'
export * from './src/components/ui/ErrorFallback'
export * from './src/components/ui/LoadingSpinner'

// Hooks
export * from './src/hooks/useTouchGestures'
export * from './src/hooks/useBiometric'
export * from './src/hooks/useApplePay'
export * from './src/hooks/useAuth'
export * from './src/hooks/useFetch'

// Services
export { apiClient } from './src/services/api/axiosClient'
export type { ApiResponse, PaginatedResponse } from './src/services/api/axiosClient'
export * from './src/services/api/contractAPI'
export * from './src/services/api/riskAnalysisApi'
export * from './src/services/api/simulatorApi'
export * from './src/services/api/authApi'
export * from './src/services/realtime'
export * from './src/services/virtualCourt'
export * from './src/services/biometricService'
export * from './src/services/analytics'
export { notificationService } from './src/services/notifications'
export type { Notification, NotificationSettings, NotificationTemplate } from './src/services/notifications'
export * from './src/services/exportService'
export * from './src/services/advancedSearch'
export * from './src/services/aiRiskAnalysis'
export * from './src/services/aiAssistant'
export * from './src/services/versionControl'
export * from './src/services/enhancedAnalytics'
export * from './src/services/adaptiveLearning'
export * from './src/services/contractTemplates'
export * from './src/services/scenarioSimulation'
export * from './src/services/autoTagging'

// Types
export type {
    ID,
    Timestamp,
    Status,
    ContractType,
    Difficulty,
    SortOrder,
    PaginationParams,
    FormData,
    ThemeMode,
    Language,
    Direction,
    NotificationType,
    LoadingState,
    ApiError,
    FileUpload,
    FileInfo,
    SearchFilters,
    ExportFormat,
    Permission,
    Role,
    UserSettings,
    ActivityType,
    Activity,
    AuditLog
} from './src/types'

// Constants
export * from './src/constants'

// Store
export * from './src/store'

// I18n
export * from './src/i18n'

// Utils - מתוקן לנתיבים נכונים
export * from './src/utils/validate'
export * from './src/utils/formatDate'
export * from './src/utils/lazyLoad'
export * from './src/utils/errorBoundary'
export { performanceMonitor, PerformanceMonitor } from './src/utils/performance'
export type { PerformanceMetrics } from './src/utils/performance'

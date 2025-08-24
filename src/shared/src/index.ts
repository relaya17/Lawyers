// @myorg/shared - Main entry point
// חבילה משותפת עבור אפליקציית עורכי הדין

// UI Components
export * from './components/ui/RichTextEditor'
export { RiskIndicator, RiskTrend, RiskLevel } from './components/ui/RiskIndicator'
export * from './components/ui/Charts'
export * from './components/ui/FormBuilder'
export * from './components/ui/SignaturePad'
export * from './components/ui/DocumentViewer'
export * from './components/ui/TouchGestureProvider'
export * from './components/ui/TouchGestureIndicator'
export * from './components/ui/Input'
export * from './components/ui/BiometricButton'
export * from './components/ui/ApplePayButton'
export * from './components/ui/AdvancedComponents'
export * from './components/ui/Table'
export * from './components/ui/Button'
export * from './components/ui/AppErrorBoundary'
export * from './components/ui/AccessibilityProvider'
export * from './components/ui/ErrorFallback'
export * from './components/ui/LoadingSpinner'

// Hooks
export * from './hooks/useTouchGestures'
export * from './hooks/useBiometric'
export * from './hooks/useApplePay'
export * from './hooks/useAuth'
export * from './hooks/useFetch'

// Services
export { apiClient } from './services/api/axiosClient'
export type { ApiResponse, PaginatedResponse } from './services/api/axiosClient'
export * from './services/api/contractAPI'
export * from './services/api/riskAnalysisApi'
export * from './services/api/simulatorApi'
export * from './services/api/authApi'
export * from './services/realtime'
export * from './services/virtualCourt'
export * from './services/biometricService'
export * from './services/analytics'
export { notificationService } from './services/notifications'
export type { Notification, NotificationSettings, NotificationTemplate } from './services/notifications'
export * from './services/exportService'
export * from './services/advancedSearch'
export * from './services/aiRiskAnalysis'
export * from './services/aiAssistant'
export * from './services/versionControl'
export * from './services/enhancedAnalytics'
export * from './services/adaptiveLearning'
export * from './services/contractTemplates'
export * from './services/scenarioSimulation'
export * from './services/autoTagging'

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
} from './types'

// Constants
export * from './constants'

// Store
export * from './store'

// I18n
export * from './i18n'

// Utils
export * from './utils/validate'
export * from './utils/formatDate'
export * from './utils/lazyLoad'
export * from './utils/errorBoundary'
export { performanceMonitor, PerformanceMonitor } from './utils/performance'
export type { PerformanceMetrics } from './utils/performance'

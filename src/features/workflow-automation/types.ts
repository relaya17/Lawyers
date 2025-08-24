// Workflow Automation Types
// סוגי נתונים למודול אוטומציה של תהליכי עבודה

export interface WorkflowTemplate {
    id: string
    name: string
    description: string
    contractType: 'rental' | 'employment' | 'service' | 'purchase' | 'partnership' | 'custom'
    steps: WorkflowStep[]
    estimatedTime: number // in days
    requiredApprovals: string[]
    automationRules: AutomationRule[]
    isActive: boolean
    createdAt: Date
    updatedAt: Date
}

export interface WorkflowStep {
    id: string
    name: string
    description: string
    type: 'manual' | 'automated' | 'approval' | 'notification' | 'document_generation' | 'risk_assessment'
    assignee?: string
    assigneeRole?: string
    estimatedTime: number // in hours
    dependencies: string[] // step IDs that must be completed first
    actions: WorkflowAction[]
    isRequired: boolean
    canSkip: boolean
    order: number
}

export interface WorkflowAction {
    type: 'send_notification' | 'request_approval' | 'generate_document' | 'trigger_automation' | 'update_status' | 'assign_task' | 'send_email' | 'create_reminder'
    parameters: Record<string, any>
    conditions?: ActionCondition[]
    delay?: number // in minutes
}

export interface ActionCondition {
    field: string
    operator: 'equals' | 'not_equals' | 'greater_than' | 'less_than' | 'contains' | 'not_contains'
    value: string | number | boolean | object
}

export interface AutomationRule {
    id: string
    name: string
    description: string
    trigger: 'contract_upload' | 'status_change' | 'date_reached' | 'risk_threshold' | 'user_action' | 'approval_granted' | 'approval_rejected'
    conditions: AutomationCondition[]
    actions: WorkflowAction[]
    isEnabled: boolean
    priority: number
    createdAt: Date
}

export interface AutomationCondition {
    field: string
    operator: 'equals' | 'not_equals' | 'greater_than' | 'less_than' | 'contains' | 'not_contains' | 'in' | 'not_in'
    value: string | number | boolean | object
    logicalOperator?: 'AND' | 'OR'
}

export interface WorkflowInstance {
    id: string
    templateId: string
    contractId: string
    title: string
    status: 'draft' | 'active' | 'paused' | 'completed' | 'cancelled' | 'error'
    currentStep: number
    steps: WorkflowStepInstance[]
    assignees: WorkflowAssignee[]
    startDate: Date
    estimatedEndDate: Date
    actualEndDate?: Date
    progress: number // 0-100
    createdBy: string
    createdAt: Date
    updatedAt: Date
}

export interface WorkflowStepInstance {
    id: string
    stepId: string
    name: string
    status: 'pending' | 'active' | 'completed' | 'skipped' | 'error'
    assignee?: string
    startedAt?: Date
    completedAt?: Date
    estimatedTime: number
    actualTime?: number
    comments: WorkflowComment[]
    attachments: WorkflowAttachment[]
    decisions: WorkflowDecision[]
}

export interface WorkflowAssignee {
    id: string
    userId: string
    name: string
    email: string
    role: string
    assignedSteps: string[]
    isActive: boolean
    assignedAt: Date
}

export interface WorkflowComment {
    id: string
    author: string
    content: string
    timestamp: Date
    isInternal: boolean
    attachments: string[]
}

export interface WorkflowAttachment {
    id: string
    name: string
    type: string
    url: string
    size: number
    uploadedBy: string
    uploadedAt: Date
}

export interface WorkflowDecision {
    id: string
    type: 'approve' | 'reject' | 'request_changes' | 'delegate'
    decision: string
    reason?: string
    madeBy: string
    madeAt: Date
    requiresFollowUp: boolean
}

export interface ApprovalRequest {
    id: string
    workflowInstanceId: string
    stepId: string
    title: string
    description: string
    requestor: string
    approvers: ApprovalApprover[]
    documents: string[]
    deadline: Date
    status: 'pending' | 'approved' | 'rejected' | 'expired'
    createdAt: Date
    updatedAt: Date
}

export interface ApprovalApprover {
    id: string
    userId: string
    name: string
    email: string
    role: string
    status: 'pending' | 'approved' | 'rejected' | 'delegated'
    decision?: string
    decidedAt?: Date
    isRequired: boolean
}

export interface WorkflowNotification {
    id: string
    type: 'task_assigned' | 'approval_requested' | 'step_completed' | 'workflow_completed' | 'deadline_approaching' | 'overdue'
    title: string
    message: string
    recipient: string
    workflowInstanceId: string
    stepId?: string
    isRead: boolean
    createdAt: Date
    readAt?: Date
}

export interface WorkflowMetrics {
    totalWorkflows: number
    activeWorkflows: number
    completedWorkflows: number
    averageCompletionTime: number
    overdueWorkflows: number
    pendingApprovals: number
    automationTriggers: number
    efficiencyScore: number // 0-100
}

export interface WorkflowReport {
    id: string
    title: string
    type: 'completion' | 'efficiency' | 'approval' | 'automation' | 'custom'
    filters: ReportFilter[]
    data: WorkflowReportData[]
    generatedAt: Date
    generatedBy: string
}

export interface ReportFilter {
    field: string
    operator: string
    value: string | number | boolean | object
}

export interface WorkflowReportData {
    period: string
    workflows: number
    completed: number
    averageTime: number
    efficiency: number
    approvals: number
    automations: number
}

// Request/Response interfaces
export interface CreateWorkflowRequest {
    templateId: string
    contractId: string
    title: string
    assignees: string[]
    startDate?: Date
    customSteps?: Partial<WorkflowStep>[]
}

export interface UpdateWorkflowRequest {
    status?: string
    currentStep?: number
    assignees?: string[]
    customSteps?: Partial<WorkflowStep>[]
}

export interface WorkflowStepRequest {
    stepId: string
    action: 'complete' | 'skip' | 'reassign' | 'comment'
    data?: Record<string, any>
    comment?: string
    attachments?: File[]
}

export interface ApprovalDecisionRequest {
    approvalId: string
    decision: 'approve' | 'reject' | 'request_changes'
    reason?: string
    delegateTo?: string
}

// Dashboard interfaces
export interface WorkflowDashboardData {
    overview: WorkflowMetrics
    recentWorkflows: WorkflowInstance[]
    pendingApprovals: ApprovalRequest[]
    upcomingDeadlines: WorkflowInstance[]
    automationStats: {
        totalRules: number
        activeRules: number
        triggersToday: number
        successRate: number
    }
    efficiencyTrends: {
        labels: string[]
        data: number[]
    }
}

// Template management
export interface WorkflowTemplateCategory {
    id: string
    name: string
    description: string
    templates: WorkflowTemplate[]
    isActive: boolean
}

export interface WorkflowTemplateVersion {
    id: string
    templateId: string
    version: number
    changes: string[]
    createdBy: string
    createdAt: Date
    isActive: boolean
}

// Workflow Automation Service
// שירות אוטומציה של תהליכי עבודה

import {
    WorkflowTemplate,
    WorkflowInstance,
    WorkflowStepInstance,
    WorkflowAssignee,
    ApprovalRequest,
    WorkflowNotification,
    WorkflowMetrics,
    WorkflowDashboardData,
    CreateWorkflowRequest,
    UpdateWorkflowRequest,
    WorkflowStepRequest,
    ApprovalDecisionRequest,
    WorkflowTemplateCategory
} from '../types'

class WorkflowAutomationService {
    private baseUrl = process.env.VITE_API_URL || ''
    private workflows: Map<string, WorkflowInstance> = new Map()
    private templates: Map<string, WorkflowTemplate> = new Map()
    private approvals: Map<string, ApprovalRequest> = new Map()
    private notifications: Map<string, WorkflowNotification> = new Map()

    constructor() {
        this.initializeTemplates()
        this.initializeMockData()
    }

    // יצירת workflow חדש
    async createWorkflow(request: CreateWorkflowRequest): Promise<WorkflowInstance> {
        await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate API call

        const template = this.templates.get(request.templateId)
        if (!template) {
            throw new Error('Template not found')
        }

        const workflowId = `wf_${Date.now()}`
        const workflow: WorkflowInstance = {
            id: workflowId,
            templateId: request.templateId,
            contractId: request.contractId,
            title: request.title,
            status: 'draft',
            currentStep: 0,
            steps: template.steps.map((step, index) => ({
                id: `${workflowId}_step_${index}`,
                stepId: step.id,
                name: step.name,
                status: index === 0 ? 'active' : 'pending',
                assignee: step.assignee,
                estimatedTime: step.estimatedTime,
                comments: [],
                attachments: [],
                decisions: []
            })),
            assignees: request.assignees.map((userId, index) => ({
                id: `${workflowId}_assignee_${index}`,
                userId,
                name: `משתמש ${index + 1}`,
                email: `user${index + 1}@example.com`,
                role: 'משתמש',
                assignedSteps: [],
                isActive: true,
                assignedAt: new Date()
            })),
            startDate: request.startDate || new Date(),
            estimatedEndDate: new Date(Date.now() + template.estimatedTime * 24 * 60 * 60 * 1000),
            progress: 0,
            createdBy: 'current_user',
            createdAt: new Date(),
            updatedAt: new Date()
        }

        this.workflows.set(workflowId, workflow)
        return workflow
    }

    // קבלת כל ה-workflows
    async getWorkflows(): Promise<WorkflowInstance[]> {
        await new Promise(resolve => setTimeout(resolve, 500))
        return Array.from(this.workflows.values())
    }

    // קבלת workflow לפי ID
    async getWorkflow(workflowId: string): Promise<WorkflowInstance> {
        await new Promise(resolve => setTimeout(resolve, 300))
        const workflow = this.workflows.get(workflowId)
        if (!workflow) {
            throw new Error('Workflow not found')
        }
        return workflow
    }

    // עדכון workflow
    async updateWorkflow(workflowId: string, request: UpdateWorkflowRequest): Promise<WorkflowInstance> {
        await new Promise(resolve => setTimeout(resolve, 500))

        const workflow = this.workflows.get(workflowId)
        if (!workflow) {
            throw new Error('Workflow not found')
        }

        const updatedWorkflow: WorkflowInstance = {
            ...workflow,
            ...request,
            status: request.status as WorkflowInstance['status'],
            assignees: workflow.assignees, // Keep existing assignees structure
            updatedAt: new Date()
        } as WorkflowInstance

        this.workflows.set(workflowId, updatedWorkflow)
        return updatedWorkflow
    }

    // ביצוע פעולה על step
    async executeStep(workflowId: string, request: WorkflowStepRequest): Promise<WorkflowStepInstance> {
        await new Promise(resolve => setTimeout(resolve, 800))

        const workflow = this.workflows.get(workflowId)
        if (!workflow) {
            throw new Error('Workflow not found')
        }

        const step = workflow.steps.find(s => s.stepId === request.stepId)
        if (!step) {
            throw new Error('Step not found')
        }

        // Update step based on action
        switch (request.action) {
            case 'complete': {
                step.status = 'completed'
                step.completedAt = new Date()
                step.actualTime = step.estimatedTime
                workflow.progress = Math.min(100, workflow.progress + (100 / workflow.steps.length))

                // Move to next step
                const currentIndex = workflow.steps.findIndex(s => s.stepId === request.stepId)
                if (currentIndex < workflow.steps.length - 1) {
                    workflow.steps[currentIndex + 1].status = 'active'
                    workflow.currentStep = currentIndex + 1
                } else {
                    workflow.status = 'completed'
                    workflow.actualEndDate = new Date()
                }
                break
            }

            case 'skip':
                step.status = 'skipped'
                break

            case 'comment':
                if (request.comment) {
                    step.comments.push({
                        id: `comment_${Date.now()}`,
                        author: 'current_user',
                        content: request.comment,
                        timestamp: new Date(),
                        isInternal: false,
                        attachments: []
                    })
                }
                break
        }

        workflow.updatedAt = new Date()
        this.workflows.set(workflowId, workflow)

        return step
    }

    // יצירת בקשת אישור
    async createApprovalRequest(workflowId: string, stepId: string, approvers: string[]): Promise<ApprovalRequest> {
        await new Promise(resolve => setTimeout(resolve, 600))

        const approvalId = `approval_${Date.now()}`
        const approval: ApprovalRequest = {
            id: approvalId,
            workflowInstanceId: workflowId,
            stepId,
            title: 'בקשת אישור חוזה',
            description: 'נדרש אישור לשלב הבא בתהליך',
            requestor: 'current_user',
            approvers: approvers.map((userId, index) => ({
                id: `${approvalId}_approver_${index}`,
                userId,
                name: `מאשר ${index + 1}`,
                email: `approver${index + 1}@example.com`,
                role: 'מנהל',
                status: 'pending',
                isRequired: true
            })),
            documents: [],
            deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
            status: 'pending',
            createdAt: new Date(),
            updatedAt: new Date()
        }

        this.approvals.set(approvalId, approval)
        return approval
    }

    // קבלת החלטה על אישור
    async makeApprovalDecision(request: ApprovalDecisionRequest): Promise<ApprovalRequest> {
        await new Promise(resolve => setTimeout(resolve, 500))

        const approval = this.approvals.get(request.approvalId)
        if (!approval) {
            throw new Error('Approval request not found')
        }

        const approver = approval.approvers.find(a => a.userId === 'current_user')
        if (approver) {
            // Map decision values to match the expected status types
            const statusMap: Record<string, 'approved' | 'rejected' | 'delegated'> = {
                'approve': 'approved',
                'reject': 'rejected',
                'request_changes': 'delegated'
            }
            approver.status = statusMap[request.decision] || 'pending'
            approver.decision = request.reason
            approver.decidedAt = new Date()
        }

        // Check if all required approvers have decided
        const allDecided = approval.approvers.every(a => a.status !== 'pending')
        if (allDecided) {
            const allApproved = approval.approvers.every(a => a.status === 'approved')
            approval.status = allApproved ? 'approved' : 'rejected'
        }

        approval.updatedAt = new Date()
        this.approvals.set(request.approvalId, approval)

        return approval
    }

    // קבלת כל בקשת האישור
    async getApprovalRequests(): Promise<ApprovalRequest[]> {
        await new Promise(resolve => setTimeout(resolve, 400))
        return Array.from(this.approvals.values())
    }

    // קבלת התראות workflow
    async getNotifications(): Promise<WorkflowNotification[]> {
        await new Promise(resolve => setTimeout(resolve, 300))
        return Array.from(this.notifications.values())
    }

    // סימון התראה כנקראה
    async markNotificationAsRead(notificationId: string): Promise<void> {
        await new Promise(resolve => setTimeout(resolve, 200))

        const notification = this.notifications.get(notificationId)
        if (notification) {
            notification.isRead = true
            notification.readAt = new Date()
            this.notifications.set(notificationId, notification)
        }
    }

    // קבלת מדדי workflow
    async getWorkflowMetrics(): Promise<WorkflowMetrics> {
        await new Promise(resolve => setTimeout(resolve, 400))

        const workflows = Array.from(this.workflows.values())
        const completed = workflows.filter(w => w.status === 'completed')
        const active = workflows.filter(w => w.status === 'active')
        const overdue = workflows.filter(w => {
            if (w.status === 'active' && w.estimatedEndDate) {
                return new Date() > w.estimatedEndDate
            }
            return false
        })

        const totalTime = completed.reduce((sum, w) => {
            if (w.actualEndDate && w.startDate) {
                return sum + (w.actualEndDate.getTime() - w.startDate.getTime())
            }
            return sum
        }, 0)

        return {
            totalWorkflows: workflows.length,
            activeWorkflows: active.length,
            completedWorkflows: completed.length,
            averageCompletionTime: completed.length > 0 ? totalTime / completed.length / (1000 * 60 * 60 * 24) : 0,
            overdueWorkflows: overdue.length,
            pendingApprovals: Array.from(this.approvals.values()).filter(a => a.status === 'pending').length,
            automationTriggers: 15, // Mock data
            efficiencyScore: Math.round((completed.length / workflows.length) * 100)
        }
    }

    // קבלת נתוני דשבורד
    async getDashboardData(): Promise<WorkflowDashboardData> {
        await new Promise(resolve => setTimeout(resolve, 600))

        const metrics = await this.getWorkflowMetrics()
        const workflows = await this.getWorkflows()
        const approvals = await this.getApprovalRequests()
        const notifications = await this.getNotifications()

        return {
            overview: metrics,
            recentWorkflows: workflows.slice(-5),
            pendingApprovals: approvals.filter(a => a.status === 'pending').slice(-5),
            upcomingDeadlines: workflows.filter(w =>
                w.status === 'active' &&
                w.estimatedEndDate &&
                new Date(w.estimatedEndDate) > new Date() &&
                new Date(w.estimatedEndDate) < new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
            ).slice(-5),
            automationStats: {
                totalRules: 12,
                activeRules: 8,
                triggersToday: 5,
                successRate: 92
            },
            efficiencyTrends: {
                labels: ['שבוע 1', 'שבוע 2', 'שבוע 3', 'שבוע 4'],
                data: [75, 82, 78, 89]
            }
        }
    }

    // קבלת תבניות workflow
    async getTemplates(): Promise<WorkflowTemplate[]> {
        await new Promise(resolve => setTimeout(resolve, 300))
        return Array.from(this.templates.values())
    }

    // קבלת קטגוריות תבניות
    async getTemplateCategories(): Promise<WorkflowTemplateCategory[]> {
        await new Promise(resolve => setTimeout(resolve, 400))

        const templates = await this.getTemplates()

        return [
            {
                id: 'legal',
                name: 'תהליכים משפטיים',
                description: 'תבניות לתהליכים משפטיים',
                templates: templates.filter(t => t.contractType === 'rental' || t.contractType === 'employment'),
                isActive: true
            },
            {
                id: 'business',
                name: 'תהליכים עסקיים',
                description: 'תבניות לתהליכים עסקיים',
                templates: templates.filter(t => t.contractType === 'service' || t.contractType === 'purchase'),
                isActive: true
            },
            {
                id: 'custom',
                name: 'תבניות מותאמות',
                description: 'תבניות מותאמות אישית',
                templates: templates.filter(t => t.contractType === 'custom'),
                isActive: true
            }
        ]
    }

    // יצירת תבנית חדשה
    async createTemplate(template: Omit<WorkflowTemplate, 'id' | 'createdAt' | 'updatedAt'>): Promise<WorkflowTemplate> {
        await new Promise(resolve => setTimeout(resolve, 800))

        const newTemplate: WorkflowTemplate = {
            ...template,
            id: `template_${Date.now()}`,
            createdAt: new Date(),
            updatedAt: new Date()
        }

        this.templates.set(newTemplate.id, newTemplate)
        return newTemplate
    }

    // עדכון תבנית
    async updateTemplate(templateId: string, updates: Partial<WorkflowTemplate>): Promise<WorkflowTemplate> {
        await new Promise(resolve => setTimeout(resolve, 500))

        const template = this.templates.get(templateId)
        if (!template) {
            throw new Error('Template not found')
        }

        const updatedTemplate = {
            ...template,
            ...updates,
            updatedAt: new Date()
        }

        this.templates.set(templateId, updatedTemplate)
        return updatedTemplate
    }

    // מחיקת תבנית
    async deleteTemplate(templateId: string): Promise<void> {
        await new Promise(resolve => setTimeout(resolve, 300))
        this.templates.delete(templateId)
    }

    // יצירת נתוני mock
    private initializeMockData(): void {
        // Mock workflows
        const mockWorkflows: WorkflowInstance[] = [
            {
                id: 'wf_1',
                templateId: 'template_1',
                contractId: 'contract_1',
                title: 'חוזה שכירות דירה',
                status: 'active',
                currentStep: 2,
                steps: [
                    {
                        id: 'wf_1_step_0',
                        stepId: 'step_1',
                        name: 'ניתוח סיכונים',
                        status: 'completed',
                        estimatedTime: 2,
                        actualTime: 1.5,
                        startedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
                        completedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
                        comments: [],
                        attachments: [],
                        decisions: []
                    },
                    {
                        id: 'wf_1_step_1',
                        stepId: 'step_2',
                        name: 'אישור משפטי',
                        status: 'completed',
                        estimatedTime: 1,
                        actualTime: 1,
                        startedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
                        completedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
                        comments: [],
                        attachments: [],
                        decisions: []
                    },
                    {
                        id: 'wf_1_step_2',
                        stepId: 'step_3',
                        name: 'חתימת חוזה',
                        status: 'active',
                        estimatedTime: 1,
                        startedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
                        comments: [],
                        attachments: [],
                        decisions: []
                    }
                ],
                assignees: [
                    {
                        id: 'wf_1_assignee_0',
                        userId: 'user_1',
                        name: 'עו״ד דוד לוי',
                        email: 'david@lawfirm.com',
                        role: 'עורך דין',
                        assignedSteps: ['step_1', 'step_2'],
                        isActive: true,
                        assignedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000)
                    }
                ],
                startDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
                estimatedEndDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
                progress: 67,
                createdBy: 'user_1',
                createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
                updatedAt: new Date()
            }
        ]

        mockWorkflows.forEach(workflow => {
            this.workflows.set(workflow.id, workflow)
        })

        // Mock approvals
        const mockApprovals: ApprovalRequest[] = [
            {
                id: 'approval_1',
                workflowInstanceId: 'wf_1',
                stepId: 'step_3',
                title: 'אישור חתימת חוזה',
                description: 'נדרש אישור לחתימת חוזה שכירות',
                requestor: 'user_1',
                approvers: [
                    {
                        id: 'approval_1_approver_0',
                        userId: 'manager_1',
                        name: 'מנהל משפטי',
                        email: 'legal@company.com',
                        role: 'מנהל',
                        status: 'pending',
                        isRequired: true
                    }
                ],
                documents: [],
                deadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
                status: 'pending',
                createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
                updatedAt: new Date()
            }
        ]

        mockApprovals.forEach(approval => {
            this.approvals.set(approval.id, approval)
        })

        // Mock notifications
        const mockNotifications: WorkflowNotification[] = [
            {
                id: 'notification_1',
                type: 'approval_requested',
                title: 'בקשת אישור חדשה',
                message: 'נדרש אישור לחוזה שכירות דירה',
                recipient: 'manager_1',
                workflowInstanceId: 'wf_1',
                stepId: 'step_3',
                isRead: false,
                createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000)
            },
            {
                id: 'notification_2',
                type: 'step_completed',
                title: 'שלב הושלם',
                message: 'שלב "אישור משפטי" הושלם בהצלחה',
                recipient: 'user_1',
                workflowInstanceId: 'wf_1',
                stepId: 'step_2',
                isRead: true,
                createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
                readAt: new Date(Date.now() - 23 * 60 * 60 * 1000)
            }
        ]

        mockNotifications.forEach(notification => {
            this.notifications.set(notification.id, notification)
        })
    }

    // יצירת תבניות ברירת מחדל
    private initializeTemplates(): void {
        const defaultTemplates: WorkflowTemplate[] = [
            {
                id: 'template_1',
                name: 'חוזה שכירות דירה',
                description: 'תהליך אישור חוזה שכירות דירה',
                contractType: 'rental',
                steps: [
                    {
                        id: 'step_1',
                        name: 'ניתוח סיכונים',
                        description: 'בדיקת סיכונים בחוזה',
                        type: 'automated',
                        estimatedTime: 2,
                        dependencies: [],
                        actions: [
                            {
                                type: 'trigger_automation',
                                parameters: { automation: 'risk_assessment' }
                            }
                        ],
                        isRequired: true,
                        canSkip: false,
                        order: 1
                    },
                    {
                        id: 'step_2',
                        name: 'אישור משפטי',
                        description: 'אישור על ידי צוות משפטי',
                        type: 'approval',
                        assignee: 'legal_team',
                        assigneeRole: 'עורך דין',
                        estimatedTime: 1,
                        dependencies: ['step_1'],
                        actions: [
                            {
                                type: 'request_approval',
                                parameters: { approver: 'legal_team' }
                            }
                        ],
                        isRequired: true,
                        canSkip: false,
                        order: 2
                    },
                    {
                        id: 'step_3',
                        name: 'חתימת חוזה',
                        description: 'חתימת החוזה על ידי הצדדים',
                        type: 'manual',
                        estimatedTime: 1,
                        dependencies: ['step_2'],
                        actions: [
                            {
                                type: 'send_notification',
                                parameters: { recipients: ['parties'], message: 'החוזה מוכן לחתימה' }
                            }
                        ],
                        isRequired: true,
                        canSkip: false,
                        order: 3
                    }
                ],
                estimatedTime: 4,
                requiredApprovals: ['legal_team'],
                automationRules: [
                    {
                        id: 'rule_1',
                        name: 'אוטומציה לניתוח סיכונים',
                        description: 'הפעלת ניתוח סיכונים אוטומטי',
                        trigger: 'contract_upload',
                        conditions: [
                            {
                                field: 'contract_type',
                                operator: 'equals',
                                value: 'rental'
                            }
                        ],
                        actions: [
                            {
                                type: 'trigger_automation',
                                parameters: { automation: 'risk_assessment' }
                            }
                        ],
                        isEnabled: true,
                        priority: 1,
                        createdAt: new Date()
                    }
                ],
                isActive: true,
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ]

        defaultTemplates.forEach(template => {
            this.templates.set(template.id, template)
        })
    }
}

export const workflowAutomationService = new WorkflowAutomationService()

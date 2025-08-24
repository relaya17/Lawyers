import { ContractType } from '../types/index';

export interface ContractBenchmark {
    contractId: string;
    contractType: ContractType;
    benchmarkMetrics: {
        riskScore: number;
        complexityScore: number;
        negotiationTime: number;
        successRate: number;
        averageValue: number;
        commonIssues: string[];
    };
    comparison: {
        percentile: number;
        industryAverage: number;
        bestPractices: string[];
        improvementAreas: string[];
    };
}

export interface LearningInsight {
    id: string;
    type: 'pattern' | 'trend' | 'anomaly' | 'recommendation';
    title: string;
    description: string;
    confidence: number;
    impact: 'low' | 'medium' | 'high';
    actionableItems: string[];
    relatedContracts: string[];
    timestamp: Date;
}

export interface AnalyticsMetric {
    name: string;
    value: number;
    unit: string;
    trend: 'up' | 'down' | 'stable';
    change: number;
    period: string;
}

export interface AnalyticsChart {
    type: 'line' | 'bar' | 'pie' | 'radar';
    title: string;
    data: {
        labels: string[];
        datasets: {
            label: string;
            data: number[];
            backgroundColor?: string[];
            borderColor?: string;
        }[];
    };
    options: Record<string, unknown>;
}

export interface SmartNotification {
    id: string;
    type: 'contract_expiry' | 'attention_needed' | 'risk_alert' | 'opportunity' | 'milestone' | 'recommendation';
    title: string;
    message: string;
    priority: 'low' | 'medium' | 'high' | 'critical';
    category: string;
    contractId?: string;
    actionRequired: boolean;
    actionUrl?: string;
    actionText?: string;
    expiresAt?: Date;
    createdAt: Date;
    readAt?: Date;
}

export interface WorkflowTemplate {
    id: string;
    name: string;
    description: string;
    contractType: ContractType;
    steps: WorkflowStep[];
    estimatedTime: number;
    requiredApprovals: string[];
    automationRules: AutomationRule[];
}

export interface WorkflowStep {
    id: string;
    name: string;
    description: string;
    type: 'manual' | 'automated' | 'approval' | 'notification';
    assignee?: string;
    estimatedTime: number;
    dependencies: string[];
    actions: WorkflowAction[];
}

export interface WorkflowAction {
    type: 'send_notification' | 'update_status' | 'request_approval' | 'generate_document' | 'trigger_automation';
    parameters: Record<string, unknown>;
    conditions?: string[];
}

export interface AutomationRule {
    id: string;
    name: string;
    trigger: 'contract_upload' | 'status_change' | 'date_reached' | 'risk_threshold' | 'user_action';
    conditions: string[];
    actions: WorkflowAction[];
    enabled: boolean;
}

export interface AnalyticsDashboard {
    overview: {
        totalContracts: number;
        activeContracts: number;
        expiringSoon: number;
        highRiskContracts: number;
        averageRiskScore: number;
    };
    metrics: AnalyticsMetric[];
    charts: AnalyticsChart[];
    insights: LearningInsight[];
    notifications: SmartNotification[];
}

class EnhancedAnalyticsService {
    private benchmarks: Map<string, ContractBenchmark> = new Map();
    private insights: Map<string, LearningInsight> = new Map();
    private notifications: Map<string, SmartNotification> = new Map();
    private workflows: Map<string, WorkflowTemplate> = new Map();

    constructor() {
        this.initializeBenchmarks();
        this.initializeWorkflows();
    }

    // Get contract benchmarking data
    async getContractBenchmark(contractId: string): Promise<ContractBenchmark | null> {
        return this.benchmarks.get(contractId) || null;
    }

    // Compare contract against industry standards
    async compareContract(
        contractId: string,
        contractType: ContractType,
        metrics: Record<string, number>
    ): Promise<ContractBenchmark> {
        const benchmark: ContractBenchmark = {
            contractId,
            contractType,
            benchmarkMetrics: {
                riskScore: metrics.riskScore || 0,
                complexityScore: metrics.complexityScore || 0,
                negotiationTime: metrics.negotiationTime || 0,
                successRate: metrics.successRate || 0,
                averageValue: metrics.averageValue || 0,
                commonIssues: this.identifyCommonIssues(contractType)
            },
            comparison: {
                percentile: this.calculatePercentile(metrics.riskScore || 0),
                industryAverage: this.getIndustryAverage(contractType),
                bestPractices: this.getBestPractices(contractType),
                improvementAreas: this.identifyImprovementAreas(contractType)
            }
        };

        this.benchmarks.set(contractId, benchmark);
        return benchmark;
    }

    // Generate learning insights from contract history
    async generateLearningInsights(): Promise<LearningInsight[]> {
        const insights: LearningInsight[] = [
            {
                id: 'insight_1',
                type: 'pattern',
                title: 'Improved Performance in Lease Contracts',
                description: 'Your success rate in lease contracts has improved by 15% over the last 3 months',
                confidence: 85,
                impact: 'medium',
                actionableItems: [
                    'Apply similar strategies to other contract types',
                    'Document successful negotiation approaches',
                    'Share best practices with team'
                ],
                relatedContracts: ['contract_1', 'contract_2', 'contract_3'],
                timestamp: new Date()
            },
            {
                id: 'insight_2',
                type: 'trend',
                title: 'Increasing Risk in Service Agreements',
                description: 'Risk scores in service agreements have increased by 20% this quarter',
                confidence: 90,
                impact: 'high',
                actionableItems: [
                    'Review recent service agreement templates',
                    'Update risk assessment criteria',
                    'Schedule team training on service contracts'
                ],
                relatedContracts: ['contract_4', 'contract_5'],
                timestamp: new Date()
            },
            {
                id: 'insight_3',
                type: 'recommendation',
                title: 'Optimize Negotiation Timeline',
                description: 'Contracts with 3-week negotiation periods show 25% better outcomes',
                confidence: 75,
                impact: 'medium',
                actionableItems: [
                    'Set 3-week timeline for new negotiations',
                    'Implement milestone tracking',
                    'Use automated reminders for deadlines'
                ],
                relatedContracts: [],
                timestamp: new Date()
            }
        ];

        insights.forEach(insight => {
            this.insights.set(insight.id, insight);
        });

        return insights;
    }

    // Get analytics dashboard data
    async getAnalyticsDashboard(): Promise<AnalyticsDashboard> {
        const overview = {
            totalContracts: 150,
            activeContracts: 45,
            expiringSoon: 8,
            highRiskContracts: 3,
            averageRiskScore: 65
        };

        const metrics: AnalyticsMetric[] = [
            {
                name: 'Success Rate',
                value: 78,
                unit: '%',
                trend: 'up',
                change: 5,
                period: 'vs last month'
            },
            {
                name: 'Average Negotiation Time',
                value: 18,
                unit: 'days',
                trend: 'down',
                change: -3,
                period: 'vs last month'
            },
            {
                name: 'Risk Score',
                value: 65,
                unit: '',
                trend: 'stable',
                change: 0,
                period: 'vs last month'
            }
        ];

        const charts: AnalyticsChart[] = [
            {
                type: 'line',
                title: 'Contract Performance Over Time',
                data: {
                    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                    datasets: [{
                        label: 'Success Rate',
                        data: [70, 72, 75, 73, 78, 80],
                        borderColor: '#2196F3'
                    }]
                },
                options: {}
            },
            {
                type: 'bar',
                title: 'Contracts by Type',
                data: {
                    labels: ['Lease', 'Service', 'Employment', 'Purchase', 'Partnership', 'NDA', 'License'],
                    datasets: [{
                        label: 'Count',
                        data: [25, 30, 20, 15, 10, 15, 10],
                        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#FF6384']
                    }]
                },
                options: {}
            }
        ];

        const insights = await this.generateLearningInsights();
        const notifications = await this.getSmartNotifications();

        return {
            overview,
            metrics,
            charts,
            insights,
            notifications
        };
    }

    // Generate smart notifications
    async generateSmartNotifications(): Promise<SmartNotification[]> {
        const notifications: SmartNotification[] = [
            {
                id: 'notif_1',
                type: 'contract_expiry',
                title: 'Contract Expiring Soon',
                message: 'Lease contract #12345 expires in 30 days. Consider renewal or termination.',
                priority: 'high',
                category: 'contract_management',
                contractId: 'contract_12345',
                actionRequired: true,
                actionUrl: '/contracts/12345',
                actionText: 'Review Contract',
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
                createdAt: new Date()
            },
            {
                id: 'notif_2',
                type: 'risk_alert',
                title: 'High Risk Contract Detected',
                message: 'Service agreement #67890 has risk score of 85. Immediate attention recommended.',
                priority: 'critical',
                category: 'risk_management',
                contractId: 'contract_67890',
                actionRequired: true,
                actionUrl: '/risk-analysis/67890',
                actionText: 'Analyze Risk',
                createdAt: new Date()
            },
            {
                id: 'notif_3',
                type: 'opportunity',
                title: 'Optimization Opportunity',
                message: 'Based on your performance, you could improve 3 contracts using AI recommendations.',
                priority: 'medium',
                category: 'optimization',
                actionRequired: false,
                actionUrl: '/recommendations',
                actionText: 'View Recommendations',
                createdAt: new Date()
            },
            {
                id: 'notif_4',
                type: 'milestone',
                title: 'Learning Milestone Achieved',
                message: 'Congratulations! You\'ve completed 50 contract simulations.',
                priority: 'low',
                category: 'learning',
                actionRequired: false,
                actionUrl: '/profile/achievements',
                actionText: 'View Achievements',
                createdAt: new Date()
            }
        ];

        notifications.forEach(notification => {
            this.notifications.set(notification.id, notification);
        });

        return notifications;
    }

    // Get smart notifications for user
    async getSmartNotifications(): Promise<SmartNotification[]> {
        return Array.from(this.notifications.values())
            .filter(notification => !notification.readAt)
            .sort((a, b) => {
                const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
                return priorityOrder[b.priority] - priorityOrder[a.priority];
            });
    }

    // Mark notification as read
    async markNotificationAsRead(notificationId: string): Promise<void> {
        const notification = this.notifications.get(notificationId);
        if (notification) {
            notification.readAt = new Date();
            this.notifications.set(notificationId, notification);
        }
    }

    // Get workflow templates
    async getWorkflowTemplates(contractType?: ContractType): Promise<WorkflowTemplate[]> {
        let templates = Array.from(this.workflows.values());

        if (contractType) {
            templates = templates.filter(template => template.contractType === contractType);
        }

        return templates;
    }

    // Execute workflow automation
    async executeWorkflow(
        workflowId: string
    ): Promise<{
        success: boolean;
        steps: WorkflowStep[];
        estimatedTime: number;
    }> {
        const workflow = this.workflows.get(workflowId);
        if (!workflow) {
            throw new Error('Workflow not found');
        }

        // Simulate workflow execution
        const executedSteps = workflow.steps.map(step => ({
            ...step,
            status: 'completed',
            completedAt: new Date()
        }));

        return {
            success: true,
            steps: executedSteps,
            estimatedTime: workflow.estimatedTime
        };
    }

    // Private helper methods
    private initializeBenchmarks(): void {
        // Initialize with sample benchmark data
        const sampleBenchmark: ContractBenchmark = {
            contractId: 'sample_contract',
            contractType: 'rental',
            benchmarkMetrics: {
                riskScore: 65,
                complexityScore: 70,
                negotiationTime: 15,
                successRate: 85,
                averageValue: 50000,
                commonIssues: ['Payment terms', 'Maintenance responsibility', 'Early termination']
            },
            comparison: {
                percentile: 75,
                industryAverage: 60,
                bestPractices: ['Clear payment terms', 'Defined maintenance schedule', 'Fair termination clause'],
                improvementAreas: ['Risk mitigation', 'Performance guarantees']
            }
        };

        this.benchmarks.set('sample_contract', sampleBenchmark);
    }

    private initializeWorkflows(): void {
        // Lease Contract Workflow
        const leaseWorkflow: WorkflowTemplate = {
            id: 'lease_workflow',
            name: 'Lease Contract Review',
            description: 'Standard workflow for lease contract review and approval',
            contractType: 'rental',
            steps: [
                {
                    id: 'step_1',
                    name: 'Initial Review',
                    description: 'Review contract terms and identify key issues',
                    type: 'manual',
                    estimatedTime: 2,
                    dependencies: [],
                    actions: [
                        {
                            type: 'send_notification',
                            parameters: { message: 'Contract ready for review' }
                        }
                    ]
                },
                {
                    id: 'step_2',
                    name: 'Risk Assessment',
                    description: 'Conduct AI-powered risk analysis',
                    type: 'automated',
                    estimatedTime: 1,
                    dependencies: ['step_1'],
                    actions: [
                        {
                            type: 'generate_document',
                            parameters: { template: 'risk_report' }
                        }
                    ]
                },
                {
                    id: 'step_3',
                    name: 'Legal Approval',
                    description: 'Legal team review and approval',
                    type: 'approval',
                    assignee: 'legal_team',
                    estimatedTime: 3,
                    dependencies: ['step_2'],
                    actions: [
                        {
                            type: 'request_approval',
                            parameters: { approver: 'legal_team' }
                        }
                    ]
                }
            ],
            estimatedTime: 6,
            requiredApprovals: ['legal_team'],
            automationRules: [
                {
                    id: 'rule_1',
                    name: 'Auto Risk Assessment',
                    trigger: 'contract_upload',
                    conditions: ['contract_type = lease'],
                    actions: [
                        {
                            type: 'trigger_automation',
                            parameters: { automation: 'risk_assessment' }
                        }
                    ],
                    enabled: true
                }
            ]
        };

        this.workflows.set('lease_workflow', leaseWorkflow);
    }

    private identifyCommonIssues(contractType: ContractType): string[] {
        const commonIssues = {
            rental: ['Payment terms', 'Maintenance responsibility', 'Early termination'],
            service: ['SLA compliance', 'Performance guarantees', 'Liability limits'],
            employment: ['Work conditions', 'Compensation', 'Termination'],
            purchase: ['Delivery terms', 'Quality standards', 'Payment schedule'],
            partnership: ['Profit sharing', 'Decision making', 'Exit strategy'],
            nda: ['Confidentiality scope', 'Duration', 'Penalty clauses'],
            license: ['Usage rights', 'Royalties', 'Termination'],
            franchise: ['Territory rights', 'Royalty structure', 'Brand standards'],
            consulting: ['Scope definition', 'Payment terms', 'Intellectual property'],
            other: ['General terms', 'Liability', 'Termination']
        };

        return commonIssues[contractType] || [];
    }

    private calculatePercentile(score: number): number {
        // Simulate percentile calculation
        return Math.min(100, Math.max(0, score + Math.random() * 20 - 10));
    }

    private getIndustryAverage(contractType: ContractType): number {
        const averages = {
            rental: 60,
            service: 55,
            employment: 50,
            purchase: 65,
            partnership: 70,
            nda: 45,
            license: 55,
            franchise: 65,
            consulting: 60,
            other: 55
        };

        return averages[contractType] || 60;
    }

    private getBestPractices(contractType: ContractType): string[] {
        const practices = {
            rental: ['Clear payment terms', 'Defined maintenance schedule', 'Fair termination clause'],
            service: ['Detailed SLA', 'Performance metrics', 'Escalation procedures'],
            employment: ['Clear work conditions', 'Fair compensation', 'Reasonable termination'],
            purchase: ['Clear delivery terms', 'Quality standards', 'Payment milestones'],
            partnership: ['Clear profit sharing', 'Decision making process', 'Exit strategy'],
            nda: ['Specific confidentiality scope', 'Reasonable duration', 'Proportional penalties'],
            license: ['Clear usage rights', 'Fair royalties', 'Reasonable termination'],
            franchise: ['Clear territory rights', 'Fair royalty structure', 'Brand protection'],
            consulting: ['Clear scope definition', 'Fair payment terms', 'IP protection'],
            other: ['General best practices', 'Risk mitigation', 'Clear terms']
        };

        return practices[contractType] || [];
    }

    private identifyImprovementAreas(contractType: ContractType): string[] {
        const areas = {
            rental: ['Risk mitigation', 'Performance guarantees'],
            service: ['Quality assurance', 'Dispute resolution'],
            employment: ['Work conditions', 'Compensation structure'],
            purchase: ['Supplier management', 'Quality control'],
            partnership: ['Governance structure', 'Conflict resolution'],
            nda: ['Scope definition', 'Enforcement mechanisms'],
            license: ['Usage rights', 'Royalty structure'],
            franchise: ['Territory management', 'Brand protection'],
            consulting: ['Scope management', 'IP protection'],
            other: ['General improvements', 'Risk management']
        };

        return areas[contractType] || [];
    }
}

export const enhancedAnalyticsService = new EnhancedAnalyticsService();

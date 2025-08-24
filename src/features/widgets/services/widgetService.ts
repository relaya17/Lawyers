// Widget Service - ניהול וידג'טים ונתונים
// Support for iOS widgets and PWA mini-widgets

import {
    WidgetData,
    WidgetType,
    WidgetProviderData,
    UrgentContract,
    DailyStats,
    QuickAction,
    RecentActivity,
    RiskAlert,
    CourtScheduleItem,
    WidgetConfig,
    WidgetUpdateEvent
} from '../types/widgetTypes';

class WidgetService {
    private cache: Map<WidgetType, WidgetData> = new Map();
    private configs: Map<string, WidgetConfig> = new Map();
    private updateListeners: Array<(event: WidgetUpdateEvent) => void> = [];
    private refreshIntervals: Map<WidgetType, NodeJS.Timeout> = new Map();

    constructor() {
        this.initializeDefaultConfigs();
        this.setupPeriodicRefresh();
    }

    // Initialize default widget configurations
    private initializeDefaultConfigs(): void {
        const defaultConfigs: WidgetConfig[] = [
            {
                id: 'urgent_contracts_small',
                type: 'urgent_contracts',
                size: 'small',
                position: { x: 0, y: 0 },
                isVisible: true,
                refreshInterval: 30, // 30 minutes
            },
            {
                id: 'daily_stats_medium',
                type: 'daily_stats',
                size: 'medium',
                position: { x: 1, y: 0 },
                isVisible: true,
                refreshInterval: 60, // 1 hour
            },
            {
                id: 'quick_actions_large',
                type: 'quick_actions',
                size: 'large',
                position: { x: 0, y: 1 },
                isVisible: true,
                refreshInterval: 0, // No auto-refresh for actions
            }
        ];

        defaultConfigs.forEach(config => {
            this.configs.set(config.id, config);
        });
    }

    // Setup periodic refresh for widgets
    private setupPeriodicRefresh(): void {
        this.configs.forEach(config => {
            if (config.refreshInterval > 0) {
                const interval = setInterval(() => {
                    this.refreshWidget(config.type);
                }, config.refreshInterval * 60 * 1000);

                this.refreshIntervals.set(config.type, interval);
            }
        });
    }

    // Get urgent contracts data
    async getUrgentContracts(): Promise<UrgentContract[]> {
        // Mock data - in real app, this would fetch from API
        const urgentContracts: UrgentContract[] = [
            {
                id: '1',
                title: 'חוזה שכירות - רח\' הרצל',
                expiryDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days
                daysRemaining: 3,
                riskLevel: 'high',
                clientName: 'דוד כהן'
            },
            {
                id: '2',
                title: 'הסכם שותפות - טק סטארט',
                expiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
                daysRemaining: 7,
                riskLevel: 'medium',
                clientName: 'חברת InnovaTech'
            },
            {
                id: '3',
                title: 'חוזה עבודה - מנהל פיתוח',
                expiryDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // 1 day
                daysRemaining: 1,
                riskLevel: 'critical',
                clientName: 'שרה לוי'
            }
        ];

        return urgentContracts.sort((a, b) => a.daysRemaining - b.daysRemaining);
    }

    // Get daily statistics
    async getDailyStats(): Promise<DailyStats> {
        // Mock data - in real app, this would fetch from API
        return {
            contractsReviewed: 12,
            contractsExpiringSoon: 5,
            highRiskContracts: 3,
            completedTasks: 8,
            revenue: 45000,
            courtCases: 2,
            previousDayChange: {
                contractsReviewed: 2,
                revenue: 5000,
                tasks: 1
            }
        };
    }

    // Get quick actions
    async getQuickActions(): Promise<QuickAction[]> {
        return [
            {
                id: 'new_contract',
                title: 'חוזה חדש',
                description: 'צור חוזה חדש',
                icon: 'Description',
                route: '/contracts/new',
                color: '#2196F3',
                isEnabled: true
            },
            {
                id: 'risk_analysis',
                title: 'ניתוח סיכון',
                description: 'נתח חוזה קיים',
                icon: 'Assessment',
                route: '/risk-analysis',
                color: '#FF9800',
                isEnabled: true
            },
            {
                id: 'virtual_court',
                title: 'בית משפט וירטואלי',
                description: 'הצטרף לדיון',
                icon: 'Gavel',
                route: '/virtual-court',
                color: '#9C27B0',
                isEnabled: true,
                badgeCount: 2
            },
            {
                id: 'marketplace',
                title: 'שוק תבניות',
                description: 'חפש תבניות',
                icon: 'Store',
                route: '/marketplace',
                color: '#4CAF50',
                isEnabled: true
            }
        ];
    }

    // Get recent activity
    async getRecentActivity(): Promise<RecentActivity[]> {
        const activities: RecentActivity[] = [
            {
                id: '1',
                type: 'contract',
                title: 'חוזה שכירות עודכן',
                description: 'חוזה שכירות רח\' הרצל 15',
                timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 mins ago
                status: 'completed',
                route: '/contracts/1'
            },
            {
                id: '2',
                type: 'analysis',
                title: 'ניתוח סיכון הושלם',
                description: 'הסכם שותפות - זוהו 2 סיכונים',
                timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
                status: 'completed',
                route: '/risk-analysis/2'
            },
            {
                id: '3',
                type: 'court',
                title: 'דיון וירטואלי התחיל',
                description: 'תביעה אזרחית - מועד: 14:00',
                timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
                status: 'pending',
                route: '/virtual-court/session/3'
            },
            {
                id: '4',
                type: 'payment',
                title: 'תשלום התקבל',
                description: '₪12,500 - עבור ייעוץ משפטי',
                timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
                status: 'completed'
            }
        ];

        return activities.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    }

    // Get risk alerts
    async getRiskAlerts(): Promise<RiskAlert[]> {
        return [
            {
                id: '1',
                type: 'contract_expiry',
                title: 'חוזה פג תוקף בקרוב',
                message: 'חוזה עבודה עם שרה לוי פג תוקף מחר',
                severity: 'critical',
                contractId: '3',
                dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
                actionRequired: true
            },
            {
                id: '2',
                type: 'court_deadline',
                title: 'מועד הגשת כתב הגנה',
                message: 'יש להגיש כתב הגנה עד יום ראשון',
                severity: 'warning',
                dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
                actionRequired: true
            },
            {
                id: '3',
                type: 'compliance_issue',
                title: 'בעיית ציות רגולטורי',
                message: 'זוהתה אי התאמה ל-GDPR בחוזה',
                severity: 'warning',
                contractId: '2',
                actionRequired: true
            }
        ];
    }

    // Get court schedule
    async getCourtSchedule(): Promise<CourtScheduleItem[]> {
        const schedule: CourtScheduleItem[] = [
            {
                id: '1',
                caseTitle: 'תביעה אזרחית - הפרת חוזה',
                courtName: 'בית המשפט המחוזי ת"א',
                date: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
                time: '09:00',
                type: 'hearing',
                status: 'confirmed',
                location: 'אולם 5, קומה 3'
            },
            {
                id: '2',
                caseTitle: 'גישור משפחתי',
                courtName: 'בית המשפט לענייני משפחה',
                date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // In 3 days
                time: '14:30',
                type: 'mediation',
                status: 'scheduled',
                virtualUrl: 'https://court.virtual/session/abc123'
            },
            {
                id: '3',
                caseTitle: 'ייעוץ משפטי - חוזה מסחרי',
                courtName: 'משרד עו"ד דוד כהן',
                date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // In a week
                time: '11:00',
                type: 'consultation',
                status: 'scheduled',
                location: 'רח\' הרצל 25, תל אביב'
            }
        ];

        return schedule.sort((a, b) => a.date.getTime() - b.date.getTime());
    }

    // Get widget data by type
    async getWidgetData(type: WidgetType): Promise<WidgetData> {
        let data: unknown;

        switch (type) {
            case 'urgent_contracts':
                data = await this.getUrgentContracts();
                break;
            case 'daily_stats':
                data = await this.getDailyStats();
                break;
            case 'quick_actions':
                data = await this.getQuickActions();
                break;
            case 'recent_activity':
                data = await this.getRecentActivity();
                break;
            case 'risk_alerts':
                data = await this.getRiskAlerts();
                break;
            case 'court_schedule':
                data = await this.getCourtSchedule();
                break;
            default:
                throw new Error(`Unknown widget type: ${type}`);
        }

        const widgetData: WidgetData = {
            id: `${type}_${Date.now()}`,
            type,
            title: this.getWidgetTitle(type),
            lastUpdated: new Date(),
            data: data as Record<string, unknown>,
            priority: this.calculatePriority(type, data)
        };

        // Cache the data
        this.cache.set(type, widgetData);

        // Notify listeners
        this.notifyUpdate({
            type,
            data: widgetData as unknown as Record<string, unknown>,
            timestamp: new Date(),
            source: 'data_change'
        });

        return widgetData;
    }

    // Get all widget data
    async getAllWidgetData(): Promise<WidgetProviderData> {
        const [
            urgentContracts,
            dailyStats,
            quickActions,
            recentActivity,
            riskAlerts,
            courtSchedule
        ] = await Promise.all([
            this.getUrgentContracts(),
            this.getDailyStats(),
            this.getQuickActions(),
            this.getRecentActivity(),
            this.getRiskAlerts(),
            this.getCourtSchedule()
        ]);

        return {
            urgentContracts,
            dailyStats,
            quickActions,
            recentActivity,
            riskAlerts,
            courtSchedule
        };
    }

    // Refresh specific widget
    async refreshWidget(type: WidgetType): Promise<WidgetData> {
        return this.getWidgetData(type);
    }

    // Refresh all widgets
    async refreshAllWidgets(): Promise<WidgetProviderData> {
        return this.getAllWidgetData();
    }

    // Get cached data if available
    getCachedData(type: WidgetType): WidgetData | null {
        return this.cache.get(type) || null;
    }

    // Widget configuration management
    getWidgetConfig(id: string): WidgetConfig | null {
        return this.configs.get(id) || null;
    }

    updateWidgetConfig(id: string, config: Partial<WidgetConfig>): void {
        const existing = this.configs.get(id);
        if (existing) {
            this.configs.set(id, { ...existing, ...config });
        }
    }

    getAllConfigs(): WidgetConfig[] {
        return Array.from(this.configs.values());
    }

    // Event handling
    onUpdate(callback: (event: WidgetUpdateEvent) => void): void {
        this.updateListeners.push(callback);
    }

    private notifyUpdate(event: WidgetUpdateEvent): void {
        this.updateListeners.forEach(listener => listener(event));
    }

    // Helper methods
    private getWidgetTitle(type: WidgetType): string {
        const titles = {
            urgent_contracts: 'חוזים דחופים',
            daily_stats: 'סטטיסטיקות יומיות',
            quick_actions: 'פעולות מהירות',
            recent_activity: 'פעילות אחרונה',
            risk_alerts: 'התראות סיכון',
            court_schedule: 'לוח זמנים בית משפט'
        };

        return titles[type] || type;
    }

    private calculatePriority(type: WidgetType, data: unknown): 'low' | 'medium' | 'high' | 'critical' {
        switch (type) {
            case 'urgent_contracts': {
                const contracts = data as UrgentContract[];
                const criticalContracts = contracts.filter((c: UrgentContract) => c.riskLevel === 'critical').length;
                return criticalContracts > 0 ? 'critical' : 'medium';
            }

            case 'risk_alerts': {
                const alerts = data as RiskAlert[];
                const criticalAlerts = alerts.filter((a: RiskAlert) => a.severity === 'critical').length;
                return criticalAlerts > 0 ? 'critical' : 'medium';
            }

            case 'court_schedule': {
                const schedule = data as CourtScheduleItem[];
                const todaysCases = schedule.filter((c: CourtScheduleItem) => {
                    const today = new Date();
                    return c.date.toDateString() === today.toDateString();
                }).length;
                return todaysCases > 0 ? 'high' : 'medium';
            }

            default:
                return 'medium';
        }
    }

    // Cleanup
    destroy(): void {
        this.refreshIntervals.forEach(interval => clearInterval(interval));
        this.refreshIntervals.clear();
        this.updateListeners.length = 0;
        this.cache.clear();
    }
}

export const widgetService = new WidgetService();
export default widgetService;

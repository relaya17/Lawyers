// Types for iOS Widgets and PWA Mini-Widgets
// תמיכה ב-iOS widgets ו-PWA mini-widgets

export type WidgetSize = 'small' | 'medium' | 'large';

export type WidgetType =
    | 'urgent_contracts'        // חוזים דחופים
    | 'daily_stats'            // סטטיסטיקות יומיות  
    | 'quick_actions'          // פעולות מהירות
    | 'recent_activity'        // פעילות אחרונה
    | 'risk_alerts'           // התראות סיכון
    | 'court_schedule';        // לוח זמנים בית משפט

export interface WidgetData {
    id: string;
    type: WidgetType;
    title: string;
    lastUpdated: Date;
    data: Record<string, unknown>;
    priority: 'low' | 'medium' | 'high' | 'critical';
}

export interface UrgentContract {
    id: string;
    title: string;
    expiryDate: Date;
    daysRemaining: number;
    riskLevel: 'low' | 'medium' | 'high' | 'critical';
    clientName: string;
}

export interface DailyStats {
    contractsReviewed: number;
    contractsExpiringSoon: number;
    highRiskContracts: number;
    completedTasks: number;
    revenue: number;
    courtCases: number;
    previousDayChange: {
        contractsReviewed: number;
        revenue: number;
        tasks: number;
    };
}

export interface QuickAction {
    id: string;
    title: string;
    description: string;
    icon: string;
    route: string;
    color: string;
    isEnabled: boolean;
    badgeCount?: number;
}

export interface RecentActivity {
    id: string;
    type: 'contract' | 'court' | 'negotiation' | 'analysis' | 'payment';
    title: string;
    description: string;
    timestamp: Date;
    status: 'completed' | 'pending' | 'failed';
    route?: string;
}

export interface RiskAlert {
    id: string;
    type: 'contract_expiry' | 'payment_overdue' | 'compliance_issue' | 'court_deadline';
    title: string;
    message: string;
    severity: 'info' | 'warning' | 'error' | 'critical';
    contractId?: string;
    dueDate?: Date;
    actionRequired: boolean;
}

export interface CourtScheduleItem {
    id: string;
    caseTitle: string;
    courtName: string;
    date: Date;
    time: string;
    type: 'hearing' | 'trial' | 'consultation' | 'mediation';
    status: 'scheduled' | 'confirmed' | 'postponed' | 'cancelled';
    location?: string;
    virtualUrl?: string;
}

export interface WidgetConfig {
    id: string;
    type: WidgetType;
    size: WidgetSize;
    position: { x: number; y: number };
    isVisible: boolean;
    refreshInterval: number; // minutes
    customSettings?: Record<string, unknown>;
}

export interface WidgetProps {
    size: WidgetSize;
    data: WidgetData;
    config: WidgetConfig;
    onAction?: (action: string, payload?: Record<string, unknown>) => void;
    isInteractive?: boolean;
    isDarkMode?: boolean;
}

export interface WidgetProviderData {
    urgentContracts: UrgentContract[];
    dailyStats: DailyStats;
    quickActions: QuickAction[];
    recentActivity: RecentActivity[];
    riskAlerts: RiskAlert[];
    courtSchedule: CourtScheduleItem[];
}

// iOS Specific Types
export interface iOSWidgetIntent {
    kind: string;
    configuration?: Record<string, unknown>;
}

export interface iOSWidgetTimeline {
    entries: Array<{
        date: Date;
        data: WidgetData;
    }>;
    policy: 'never' | 'atEnd' | 'after';
    refreshAfter?: Date;
}

// PWA Widget Types  
export interface PWAWidgetManifest {
    name: string;
    short_name: string;
    description: string;
    widgets: Array<{
        name: string;
        description: string;
        tag: string;
        template: string;
        data: string;
        type: 'application/json';
        screenshots: Array<{
            src: string;
            sizes: string;
            label: string;
        }>;
        update: number;
    }>;
}

export interface WidgetUpdateEvent {
    type: WidgetType;
    data: Record<string, unknown>;
    timestamp: Date;
    source: 'user_action' | 'scheduled_refresh' | 'data_change' | 'system_event';
}

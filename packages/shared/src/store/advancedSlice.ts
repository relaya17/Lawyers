import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

// Types
interface User {
    id: string;
    name: string;
    email: string;
    role: 'lawyer' | 'student' | 'admin';
    avatar?: string;
    preferences: {
        theme: 'light' | 'dark' | 'auto';
        language: 'he' | 'en' | 'ar';
        notifications: boolean;
        analytics: boolean;
    };
}

interface Contract {
    id: string;
    title: string;
    content: string;
    status: 'draft' | 'active' | 'expired' | 'archived';
    createdAt: string; // ISO string
    updatedAt: string; // ISO string
    parties: string[];
    tags: string[];
    riskScore?: number;
}

interface Notification {
    id: string;
    type: 'success' | 'warning' | 'error' | 'info';
    title: string;
    message: string;
    timestamp: string; // ISO string
    read: boolean;
    action?: {
        label: string;
        onClick: () => void;
    };
}

interface AnalyticsData {
    pageViews: number;
    sessionDuration: number;
    bounceRate: number;
    performanceMetrics: {
        fcp: number;
        lcp: number;
        fid: number;
        cls: number;
    };
}

interface AdvancedState {
    // User state
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;

    // Contracts state
    contracts: Contract[];
    selectedContract: Contract | null;
    contractsFilter: {
        status: string[];
        tags: string[];
        search: string;
    };

    // Notifications state
    notifications: Notification[];
    unreadCount: number;

    // Analytics state
    analytics: AnalyticsData;

    // UI state
    sidebarOpen: boolean;
    theme: 'light' | 'dark' | 'auto';
    language: 'he' | 'en' | 'ar';

    // Real-time state
    isOnline: boolean;
    lastSync: string | null; // ISO string

    // Error state
    error: string | null;
}

// Initial state
const initialState: AdvancedState = {
    user: null,
    isAuthenticated: false,
    isLoading: false,

    contracts: [],
    selectedContract: null,
    contractsFilter: {
        status: [],
        tags: [],
        search: '',
    },

    notifications: [],
    unreadCount: 0,

    analytics: {
        pageViews: 0,
        sessionDuration: 0,
        bounceRate: 0,
        performanceMetrics: {
            fcp: 0,
            lcp: 0,
            fid: 0,
            cls: 0,
        },
    },

    sidebarOpen: false,
    theme: 'auto',
    language: 'he',

    isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
    lastSync: null,

    error: null,
};

// Async thunks
export const fetchContracts = createAsyncThunk(
    'advanced/fetchContracts',
    async (filters?: Record<string, unknown>) => {
        // Mock API call
        await new Promise(resolve => setTimeout(resolve, 500));
        return [
            {
                id: '1',
                title: 'חוזה שכירות',
                content: 'תוכן החוזה...',
                status: 'active' as const,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                parties: ['בעל הבית', 'השוכר'],
                tags: ['שכירות', 'נדל"ן'],
                riskScore: 0.3,
            },
            {
                id: '2',
                title: 'חוזה עבודה',
                content: 'תוכן החוזה...',
                status: 'draft' as const,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                parties: ['המעסיק', 'העובד'],
                tags: ['עבודה', 'תעסוקה'],
                riskScore: 0.1,
            },
        ];
    }
);

export const createContract = createAsyncThunk(
    'advanced/createContract',
    async (contract: Omit<Contract, 'id' | 'createdAt' | 'updatedAt'>) => {
        await new Promise(resolve => setTimeout(resolve, 1000));
        return {
            ...contract,
            id: Date.now().toString(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
    }
);

export const updateContract = createAsyncThunk(
    'advanced/updateContract',
    async ({ id, updates }: { id: string; updates: Partial<Contract> }) => {
        await new Promise(resolve => setTimeout(resolve, 800));
        return { id, ...updates, updatedAt: new Date().toISOString() };
    }
);

export const deleteContract = createAsyncThunk(
    'advanced/deleteContract',
    async (id: string) => {
        await new Promise(resolve => setTimeout(resolve, 500));
        return id;
    }
);

export const fetchAnalytics = createAsyncThunk(
    'advanced/fetchAnalytics',
    async () => {
        await new Promise(resolve => setTimeout(resolve, 200));
        return {
            pageViews: Math.floor(Math.random() * 1000) + 100,
            sessionDuration: Math.floor(Math.random() * 300) + 60,
            bounceRate: Math.random() * 50,
            performanceMetrics: {
                fcp: Math.floor(Math.random() * 2000) + 500,
                lcp: Math.floor(Math.random() * 4000) + 1000,
                fid: Math.floor(Math.random() * 300) + 50,
                cls: Math.random() * 0.3,
            },
        };
    }
);

// Slice
const advancedSlice = createSlice({
    name: 'advanced',
    initialState,
    reducers: {
        // User actions
        setUser: (state, action: PayloadAction<User | null>) => {
            state.user = action.payload;
            state.isAuthenticated = !!action.payload;
        },
        setAuthenticated: (state, action: PayloadAction<boolean>) => {
            state.isAuthenticated = action.payload;
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        },

        // Contract actions
        setSelectedContract: (state, action: PayloadAction<Contract | null>) => {
            state.selectedContract = action.payload;
        },
        setContractsFilter: (state, action: PayloadAction<Partial<AdvancedState['contractsFilter']>>) => {
            state.contractsFilter = { ...state.contractsFilter, ...action.payload };
        },

        // Notification actions
        addNotification: (state, action: PayloadAction<Omit<Notification, 'id' | 'timestamp' | 'read'>>) => {
            const newNotification: Notification = {
                ...action.payload,
                id: `notification_${Date.now()}_${Math.random()}`,
                timestamp: new Date().toISOString(),
                read: false,
            };
            state.notifications.unshift(newNotification);
            state.notifications = state.notifications.slice(0, 50); // Keep last 50
            state.unreadCount += 1;
        },
        markNotificationAsRead: (state, action: PayloadAction<string>) => {
            const notification = state.notifications.find(n => n.id === action.payload);
            if (notification && !notification.read) {
                notification.read = true;
                state.unreadCount = Math.max(0, state.unreadCount - 1);
            }
        },
        markAllNotificationsAsRead: (state) => {
            state.notifications.forEach(notification => {
                notification.read = true;
            });
            state.unreadCount = 0;
        },
        removeNotification: (state, action: PayloadAction<string>) => {
            const notification = state.notifications.find(n => n.id === action.payload);
            if (notification && !notification.read) {
                state.unreadCount = Math.max(0, state.unreadCount - 1);
            }
            state.notifications = state.notifications.filter(n => n.id !== action.payload);
        },
        clearAllNotifications: (state) => {
            state.notifications = [];
            state.unreadCount = 0;
        },

        // Analytics actions
        updateAnalytics: (state, action: PayloadAction<Partial<AnalyticsData>>) => {
            state.analytics = { ...state.analytics, ...action.payload };
        },

        // UI actions
        toggleSidebar: (state) => {
            state.sidebarOpen = !state.sidebarOpen;
        },
        setTheme: (state, action: PayloadAction<'light' | 'dark' | 'auto'>) => {
            state.theme = action.payload;
        },
        setLanguage: (state, action: PayloadAction<'he' | 'en' | 'ar'>) => {
            state.language = action.payload;
        },

        // Real-time actions
        setOnlineStatus: (state, action: PayloadAction<boolean>) => {
            state.isOnline = action.payload;
        },
        setLastSync: (state, action: PayloadAction<string>) => {
            state.lastSync = action.payload;
        },

        // Error actions
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        // Fetch contracts
        builder
            .addCase(fetchContracts.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchContracts.fulfilled, (state, action) => {
                state.isLoading = false;
                state.contracts = action.payload;
            })
            .addCase(fetchContracts.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message || 'שגיאה בטעינת החוזים';
            });

        // Create contract
        builder
            .addCase(createContract.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(createContract.fulfilled, (state, action) => {
                state.isLoading = false;
                state.contracts.push(action.payload);
            })
            .addCase(createContract.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message || 'שגיאה ביצירת החוזה';
            });

        // Update contract
        builder
            .addCase(updateContract.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(updateContract.fulfilled, (state, action) => {
                state.isLoading = false;
                const index = state.contracts.findIndex(c => c.id === action.payload.id);
                if (index !== -1) {
                    state.contracts[index] = { ...state.contracts[index], ...action.payload };
                }
                if (state.selectedContract?.id === action.payload.id) {
                    state.selectedContract = { ...state.selectedContract, ...action.payload };
                }
            })
            .addCase(updateContract.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message || 'שגיאה בעדכון החוזה';
            });

        // Delete contract
        builder
            .addCase(deleteContract.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(deleteContract.fulfilled, (state, action) => {
                state.isLoading = false;
                state.contracts = state.contracts.filter(c => c.id !== action.payload);
                if (state.selectedContract?.id === action.payload) {
                    state.selectedContract = null;
                }
            })
            .addCase(deleteContract.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message || 'שגיאה במחיקת החוזה';
            });

        // Fetch analytics
        builder
            .addCase(fetchAnalytics.pending, (state) => {
                state.error = null;
            })
            .addCase(fetchAnalytics.fulfilled, (state, action) => {
                state.analytics = action.payload;
            })
            .addCase(fetchAnalytics.rejected, (state, action) => {
                state.error = action.error.message || 'שגיאה בטעינת הנתונים';
            });
    },
});

// Export actions
export const {
    setUser,
    setAuthenticated,
    setLoading,
    setSelectedContract,
    setContractsFilter,
    addNotification,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    removeNotification,
    clearAllNotifications,
    updateAnalytics,
    toggleSidebar,
    setTheme,
    setLanguage,
    setOnlineStatus,
    setLastSync,
    clearError,
} = advancedSlice.actions;

// Export selectors
export const selectUser = (state: { advanced: AdvancedState }) => state.advanced.user;
export const selectIsAuthenticated = (state: { advanced: AdvancedState }) => state.advanced.isAuthenticated;
export const selectIsLoading = (state: { advanced: AdvancedState }) => state.advanced.isLoading;

export const selectContracts = (state: { advanced: AdvancedState }) => state.advanced.contracts;
export const selectSelectedContract = (state: { advanced: AdvancedState }) => state.advanced.selectedContract;
export const selectContractsFilter = (state: { advanced: AdvancedState }) => state.advanced.contractsFilter;

export const selectNotifications = (state: { advanced: AdvancedState }) => state.advanced.notifications;
export const selectUnreadCount = (state: { advanced: AdvancedState }) => state.advanced.unreadCount;

export const selectAnalytics = (state: { advanced: AdvancedState }) => state.advanced.analytics;

export const selectSidebarOpen = (state: { advanced: AdvancedState }) => state.advanced.sidebarOpen;
export const selectTheme = (state: { advanced: AdvancedState }) => state.advanced.theme;
export const selectLanguage = (state: { advanced: AdvancedState }) => state.advanced.language;

export const selectOnlineStatus = (state: { advanced: AdvancedState }) => state.advanced.isOnline;
export const selectLastSync = (state: { advanced: AdvancedState }) => state.advanced.lastSync;

export const selectError = (state: { advanced: AdvancedState }) => state.advanced.error;

// Computed selectors
export const selectFilteredContracts = (state: { advanced: AdvancedState }) => {
    const { contracts, contractsFilter } = state.advanced;
    let filtered = contracts;

    if (contractsFilter.status.length > 0) {
        filtered = filtered.filter(contract =>
            contractsFilter.status.includes(contract.status)
        );
    }

    if (contractsFilter.tags.length > 0) {
        filtered = filtered.filter(contract =>
            contractsFilter.tags.some(tag => contract.tags.includes(tag))
        );
    }

    if (contractsFilter.search) {
        const search = contractsFilter.search.toLowerCase();
        filtered = filtered.filter(
            contract =>
                contract.title.toLowerCase().includes(search) ||
                contract.content.toLowerCase().includes(search) ||
                contract.parties.some(party => party.toLowerCase().includes(search))
        );
    }

    return filtered;
};

export const selectContractById = (id: string) => (state: { advanced: AdvancedState }) => {
    return state.advanced.contracts.find(contract => contract.id === id);
};

export const selectNotificationsByType = (type: Notification['type']) => (state: { advanced: AdvancedState }) => {
    return state.advanced.notifications.filter(notification => notification.type === type);
};

export default advancedSlice.reducer;

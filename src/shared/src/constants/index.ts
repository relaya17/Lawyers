// API Constants
export const API_BASE_URL = process.env.VITE_API_URL || 'https://api.contractlab.ai'
export const API_TIMEOUT = 30000

// App Constants
export const APP_NAME = 'ContractLab Pro'
export const APP_VERSION = '1.0.0'

// Feature Flags
export const FEATURE_FLAGS = {
  AI_ANALYSIS: true,
  VIRTUAL_COURT: true, // הפעל Virtual Court
  PWA_OFFLINE: true, // הפעל PWA
  MARKETPLACE: true,
  INTEGRATIONS: false,
} as const

// Route Constants
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  PROFILE: '/profile',
  CONTRACTS: '/contracts',
  SIMULATOR: '/simulator',
  RISK_ANALYSIS: '/risk-analysis',
  NEGOTIATION: '/negotiation',
  MARKETPLACE: '/marketplace',
} as const

// Contract Types
export const CONTRACT_TYPES = {
  RENTAL: 'rental',
  EMPLOYMENT: 'employment',
  SERVICE: 'service',
  PARTNERSHIP: 'partnership',
  PURCHASE: 'purchase',
  LICENSE: 'license',
  NDA: 'nda',
  OTHER: 'other',
} as const

// Risk Levels
export const RISK_LEVELS = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  VERY_HIGH: 'very_high',
} as const

// User Roles
export const USER_ROLES = {
  STUDENT: 'student',
  LAWYER: 'lawyer',
  LECTURER: 'lecturer',
  ADMIN: 'admin',
} as const

// Languages
export const LANGUAGES = {
  HEBREW: 'he',
  ENGLISH: 'en',
  ARABIC: 'ar',
} as const

// Theme Modes
export const THEME_MODES = {
  LIGHT: 'light',
  DARK: 'dark',
} as const

// Notification Types
export const NOTIFICATION_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info',
} as const

// File Types
export const SUPPORTED_FILE_TYPES = [
  '.pdf',
  '.doc',
  '.docx',
  '.txt',
  '.rtf',
] as const

// Max File Size (10MB)
export const MAX_FILE_SIZE = 10 * 1024 * 1024

// Pagination
export const DEFAULT_PAGE_SIZE = 10
export const MAX_PAGE_SIZE = 100

// Cache Keys
export const CACHE_KEYS = {
  USER_PROFILE: 'user_profile',
  CONTRACTS_LIST: 'contracts_list',
  SIMULATIONS_LIST: 'simulations_list',
  TEMPLATES_LIST: 'templates_list',
} as const

// Local Storage Keys
export const STORAGE_KEYS = {
  TOKEN: 'token',
  REFRESH_TOKEN: 'refreshToken',
  USER_PREFERENCES: 'user_preferences',
  THEME_MODE: 'theme_mode',
  LANGUAGE: 'language',
} as const

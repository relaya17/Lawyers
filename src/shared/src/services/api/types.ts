// Base API Types
export interface ApiResponse<T = unknown> {
  data: T
  message?: string
  success: boolean
  errors?: string[]
  details?: Record<string, unknown>
}

export interface ApiError {
  code: string
  message: string
  details?: Record<string, any>
  timestamp: string
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
}

// User Types
export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role: 'student' | 'lawyer' | 'lecturer' | 'admin'
  phone?: string
  avatar?: string
  company?: string
  position?: string
  location?: string
  isActive: boolean
  preferences: UserPreferences
  createdAt: string
  updatedAt: string
  lastLogin?: string
}

export interface UserPreferences {
  language: 'he' | 'en' | 'ar'
  theme: 'light' | 'dark'
  notifications: {
    email: boolean
    push: boolean
    sms: boolean
  }
  privacy: {
    profileVisibility: 'public' | 'private'
    activityVisibility: 'public' | 'private'
  }
}

// Contract Types
export interface Contract {
  id: string
  title: string
  content: string
  status: ContractStatus
  type: ContractType
  parties: ContractParty[]
  value?: number
  currency?: string
  startDate?: string
  endDate?: string
  createdAt: string
  updatedAt: string
  createdBy: string
  tags?: string[]
  attachments?: ContractAttachment[]
  signatures?: ContractSignature[]
  metadata?: Record<string, unknown>
  customFields?: Record<string, unknown>
}

export type ContractType =
  | 'rental'
  | 'employment'
  | 'partnership'
  | 'service'
  | 'nda'
  | 'purchase'
  | 'license'
  | 'franchise'
  | 'consulting'
  | 'other'

export type ContractStatus =
  | 'draft'
  | 'pending'
  | 'active'
  | 'expired'
  | 'terminated'
  | 'archived'

export type RiskLevel =
  | 'low'
  | 'medium'
  | 'high'
  | 'very_high'

export interface ContractParty {
  id: string
  name: string
  type: 'individual' | 'company'
  email?: string
  phone?: string
  address?: string
  company?: string
  role: 'client' | 'vendor' | 'partner' | 'other'
  signature?: ContractSignature
  metadata?: Record<string, unknown>
}

export interface ContractAttachment {
  id: string
  name: string
  type: string
  size: number
  url: string
  uploadedAt: string
  uploadedBy: string
  metadata?: Record<string, unknown>
}

export interface ContractSignature {
  id: string
  type: 'electronic' | 'wet' | 'digital'
  signedAt: string
  signedBy: string
  signatureData: string
  metadata?: Record<string, unknown>
}

export interface ContractMetadata {
  version: number
  lastModified: string
  modifiedBy: string
  fileSize?: number
  checksum?: string
  templateId?: string
  customFields?: Record<string, any>
}

// Risk Analysis Types
export interface RiskAnalysis {
  id: string
  contractId: string
  overallRisk: RiskLevel
  riskScore: number
  categories: RiskCategory[]
  recommendations: string[]
  createdAt: string
  updatedAt: string
  createdBy: string
  data?: Record<string, unknown>
}

export interface RiskCategory {
  id: string
  name: string
  description: string
  riskLevel: RiskLevel
  riskScore: number
  issues: string[]
  recommendations: string[]
}

export interface RiskIssue {
  id: string
  category: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  title: string
  description: string
  location: {
    section: string
    paragraph: number
    line: number
  }
  suggestedFix?: string
  legalReference?: string
}

export interface RiskRecommendation {
  id: string
  type: 'addition' | 'modification' | 'removal' | 'clarification'
  priority: 'low' | 'medium' | 'high'
  title: string
  description: string
  suggestedText?: string
  legalBasis?: string
  impact: string
}

// Simulation Types
export interface Simulation {
  id: string
  title: string
  description: string
  type: SimulationType
  difficulty: 'easy' | 'medium' | 'hard'
  duration: number // in minutes
  questions: SimulationQuestion[]
  tags: string[]
  prerequisites?: string[]
  learningObjectives: string[]
  createdAt: string
  updatedAt: string
  isActive: boolean
}

export type SimulationType =
  | 'contract_analysis'
  | 'negotiation'
  | 'risk_assessment'
  | 'legal_research'
  | 'document_drafting'

export interface SimulationQuestion {
  id: string
  type: 'multiple_choice' | 'true_false' | 'text' | 'scenario'
  question: string
  options?: string[]
  correctAnswer: string | string[]
  explanation: string
  points: number
  timeLimit?: number
  hints?: string[]
}

export interface SimulationAttempt {
  id: string
  simulationId: string
  userId: string
  startTime: string
  endTime?: string
  score?: number
  maxScore: number
  answers: SimulationAnswer[]
  status: 'in_progress' | 'completed' | 'abandoned'
  timeSpent: number // in seconds
}

export interface SimulationAnswer {
  questionId: string
  answer: string | string[]
  isCorrect: boolean
  timeSpent: number
  hintsUsed: number
}

// Negotiation Types
export interface Negotiation {
  id: string
  contractId: string
  title: string
  status: NegotiationStatus
  participants: NegotiationParticipant[]
  messages: NegotiationMessage[]
  aiSuggestions: AISuggestion[]
  timeline: NegotiationEvent[]
  createdAt: string
  updatedAt: string
  deadline?: string
}

export type NegotiationStatus =
  | 'pending'
  | 'active'
  | 'paused'
  | 'completed'
  | 'cancelled'

export interface NegotiationParticipant {
  userId: string
  name: string
  role: 'initiator' | 'counterparty' | 'mediator' | 'observer'
  joinedAt: string
  lastActive: string
  isOnline: boolean
}

export interface NegotiationMessage {
  id: string
  senderId: string
  content: string
  type: 'text' | 'proposal' | 'counter_proposal' | 'acceptance' | 'rejection'
  timestamp: string
  attachments?: MessageAttachment[]
  aiAnalysis?: MessageAIAnalysis
}

export interface MessageAttachment {
  id: string
  name: string
  type: string
  size: number
  url: string
}

export interface MessageAIAnalysis {
  sentiment: 'positive' | 'negative' | 'neutral'
  confidence: number
  suggestions: string[]
  riskFactors: string[]
}

export interface AISuggestion {
  id: string
  type: 'strategy' | 'wording' | 'timing' | 'concession'
  title: string
  description: string
  confidence: number
  reasoning: string
  actionItems: string[]
  timestamp: string
}

export interface NegotiationEvent {
  id: string
  type: 'message' | 'proposal' | 'acceptance' | 'rejection' | 'deadline' | 'participant_joined' | 'participant_left'
  description: string
  timestamp: string
  userId?: string
  data?: Record<string, any>
}

// Marketplace Types
export interface Template {
  id: string
  title: string
  description: string
  category: TemplateCategory
  type: ContractType
  content: string
  preview: string
  author: TemplateAuthor
  pricing: TemplatePricing
  metadata: TemplateMetadata
  reviews: TemplateReview[]
  downloads: number
  rating: number
  tags: string[]
  isVerified: boolean
  isPremium: boolean
  createdAt: string
  updatedAt: string
}

export type TemplateCategory =
  | 'business'
  | 'real_estate'
  | 'employment'
  | 'intellectual_property'
  | 'financial'
  | 'technology'
  | 'healthcare'
  | 'education'
  | 'government'
  | 'other'

export interface TemplateAuthor {
  id: string
  name: string
  avatar?: string
  company?: string
  expertise: string[]
  verified: boolean
  rating: number
  templatesCount: number
}

export interface TemplatePricing {
  type: 'free' | 'paid' | 'subscription'
  price?: number
  currency?: string
  subscriptionPlan?: string
  trialDays?: number
}

export interface TemplateMetadata {
  version: string
  language: string
  fileSize: number
  wordCount: number
  lastUpdated: string
  compatibility: string[]
  customFields?: Record<string, any>
}

export interface TemplateReview {
  id: string
  userId: string
  userName: string
  rating: number
  title: string
  comment: string
  helpful: number
  createdAt: string
  updatedAt?: string
}

// Analytics Types
export interface Analytics {
  contracts: ContractAnalytics
  simulations: SimulationAnalytics
  negotiations: NegotiationAnalytics
  user: UserAnalytics
  system: SystemAnalytics
}

export interface ContractAnalytics {
  total: number
  byStatus: Record<ContractStatus, number>
  byType: Record<ContractType, number>
  byRiskLevel: Record<RiskLevel, number>
  averageValue: number
  totalValue: number
  expiringSoon: number
  recentActivity: number
}

export interface SimulationAnalytics {
  totalAttempts: number
  averageScore: number
  completionRate: number
  byDifficulty: Record<string, number>
  popularSimulations: string[]
  userProgress: Record<string, number>
}

export interface NegotiationAnalytics {
  totalNegotiations: number
  averageDuration: number
  successRate: number
  byStatus: Record<NegotiationStatus, number>
  aiSuggestionsUsed: number
  averageMessages: number
}

export interface UserAnalytics {
  activeUsers: number
  newUsers: number
  userRetention: number
  averageSessionTime: number
  popularFeatures: string[]
  userSatisfaction: number
}

export interface SystemAnalytics {
  uptime: number
  responseTime: number
  errorRate: number
  activeSessions: number
  storageUsed: number
  apiCalls: number
}

// Search Types
export interface SearchFilters {
  query?: string
  type?: ContractType[]
  status?: ContractStatus[]
  riskLevel?: RiskLevel[]
  dateRange?: {
    start: string
    end: string
  }
  tags?: string[]
  author?: string
  priceRange?: {
    min: number
    max: number
  }
}

export interface SearchResult<T> {
  items: T[]
  total: number
  page: number
  limit: number
  facets: SearchFacets
  suggestions: string[]
}

export interface SearchFacets {
  types: Record<string, number>
  statuses: Record<string, number>
  riskLevels: Record<string, number>
  tags: Record<string, number>
  authors: Record<string, number>
  dateRanges: Record<string, number>
}

// Export Types
export interface ExportOptions {
  format: 'pdf' | 'docx' | 'html' | 'json'
  includeMetadata: boolean
  includeAnalytics: boolean
  watermark?: boolean
  password?: string
  language: 'he' | 'en' | 'ar'
  direction: 'rtl' | 'ltr'
}

export interface ExportResult {
  id: string
  url: string
  filename: string
  size: number
  expiresAt: string
  downloadCount: number
}

// Notification Types
export interface Notification {
  id: string
  userId: string
  type: NotificationType
  title: string
  message: string
  data?: Record<string, any>
  read: boolean
  createdAt: string
  expiresAt?: string
  actions?: NotificationAction[]
}

export type NotificationType =
  | 'contract_expiry'
  | 'risk_alert'
  | 'negotiation_update'
  | 'simulation_complete'
  | 'system_alert'
  | 'user_mention'

export interface NotificationAction {
  id: string
  label: string
  action: string
  url?: string
  data?: Record<string, any>
}

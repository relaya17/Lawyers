export type TemplateDifficulty = 'Easy' | 'Medium' | 'Hard'

export interface TemplateVariable {
  name: string
  type: 'text' | 'number' | 'date' | 'select' | 'boolean'
  label: string
  required: boolean
  defaultValue?: string | number | boolean
  options?: string[]
  description: string
}

export interface Template {
  id: string
  name: string
  hebrewName: string
  description: string
  category: string
  contractType: string
  difficulty: TemplateDifficulty
  tags: string[]
  rating: number
  downloads: number
  lastUpdated: Date
  isAIEnhanced: boolean
  hasVariables: boolean
  variables: TemplateVariable[]
  content: string
  preview: string
  aiSuggestions: string[]
  usageStats: {
    totalUses: number
    successRate: number
    averageRating: number
    commonIssues: string[]
  }
}



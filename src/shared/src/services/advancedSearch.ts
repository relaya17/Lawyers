// שירות חיפוש מתקדם - ContractLab Pro
// חיפוש חכם, פילטרים מתקדמים ומיון

import { logger } from '../utils/logger'

export interface SearchFilter {
    field: string
    operator: 'equals' | 'contains' | 'starts_with' | 'ends_with' | 'greater_than' | 'less_than' | 'between' | 'in' | 'not_in'
    value: unknown
    value2?: unknown // עבור טווחים
}

export interface SortOption {
    field: string
    direction: 'asc' | 'desc'
}

export interface SearchQuery {
    text?: string
    filters: SearchFilter[]
    sort: SortOption[]
    page: number
    limit: number
    includeArchived?: boolean
    searchIn?: string[] // שדות לחיפוש
}

export interface SearchResult<T> {
    items: T[]
    total: number
    page: number
    totalPages: number
    hasMore: boolean
    facets?: Record<string, unknown>
    suggestions?: string[]
}

export interface SearchSuggestion {
    text: string
    type: 'contract' | 'template' | 'user' | 'tag'
    relevance: number
    metadata?: Record<string, unknown>
}

class AdvancedSearchService {
    private searchIndex: Map<string, unknown[]> = new Map()
    private searchHistory: string[] = []
    private savedSearches: Map<string, SearchQuery> = new Map()

    constructor() {
        this.loadSearchHistory()
        this.loadSavedSearches()
    }

    // חיפוש כללי
    async search<T>(query: SearchQuery): Promise<SearchResult<T>> {
        try {
            // סימולציה של חיפוש
            const results = await this.performSearch<T>(query)

            // שמירת היסטוריית חיפוש
            if (query.text) {
                this.addToSearchHistory(query.text)
            }

            return results
        } catch (error) {
            logger.error('Search failed:', error)
            throw error
        }
    }

    // חיפוש חכם עם המלצות
    async smartSearch<T>(text: string, context?: string): Promise<SearchResult<T>> {
        const suggestions = await this.generateSuggestions(text, context)
        const query: SearchQuery = {
            text,
            filters: [],
            sort: [{ field: 'relevance', direction: 'desc' }],
            page: 1,
            limit: 20,
            searchIn: ['title', 'content', 'tags', 'parties']
        }

        const results = await this.search<T>(query)

        return {
            ...results,
            suggestions: suggestions.map(s => s.text)
        }
    }

    // חיפוש מתקדם עם פילטרים
    async advancedSearch<T>(filters: SearchFilter[], sort: SortOption[] = []): Promise<SearchResult<T>> {
        const query: SearchQuery = {
            filters,
            sort: sort.length > 0 ? sort : [{ field: 'createdAt', direction: 'desc' }],
            page: 1,
            limit: 50
        }

        return this.search<T>(query)
    }

    // חיפוש לפי תגיות
    async searchByTags<T>(tags: string[]): Promise<SearchResult<T>> {
        const filters: SearchFilter[] = tags.map(tag => ({
            field: 'tags',
            operator: 'contains',
            value: tag
        }))

        return this.advancedSearch<T>(filters)
    }

    // חיפוש לפי תאריכים
    async searchByDateRange<T>(startDate: Date, endDate: Date): Promise<SearchResult<T>> {
        const filters: SearchFilter[] = [
            {
                field: 'createdAt',
                operator: 'between',
                value: startDate,
                value2: endDate
            }
        ]

        return this.advancedSearch<T>(filters)
    }

    // חיפוש לפי סטטוס
    async searchByStatus<T>(status: string | string[]): Promise<SearchResult<T>> {
        const filters: SearchFilter[] = [{
            field: 'status',
            operator: Array.isArray(status) ? 'in' : 'equals',
            value: status
        }]

        return this.advancedSearch<T>(filters)
    }

    // חיפוש לפי ערך כספי
    async searchByValue<T>(minValue?: number, maxValue?: number): Promise<SearchResult<T>> {
        const filters: SearchFilter[] = []

        if (minValue !== undefined) {
            filters.push({
                field: 'value',
                operator: 'greater_than',
                value: minValue
            })
        }

        if (maxValue !== undefined) {
            filters.push({
                field: 'value',
                operator: 'less_than',
                value: maxValue
            })
        }

        return this.advancedSearch<T>(filters)
    }

    // חיפוש לפי צדדים לחוזה
    async searchByParties<T>(parties: string[]): Promise<SearchResult<T>> {
        const filters: SearchFilter[] = parties.map(party => ({
            field: 'parties',
            operator: 'contains',
            value: party
        }))

        return this.advancedSearch<T>(filters)
    }

    // יצירת המלצות חיפוש
    async generateSuggestions(text: string, context?: string): Promise<SearchSuggestion[]> {
        const suggestions: SearchSuggestion[] = []

        // המלצות על בסיס טקסט
        if (text.length > 2) {
            suggestions.push(
                { text: `${text} חוזה`, type: 'contract', relevance: 0.9 },
                { text: `${text} תבנית`, type: 'template', relevance: 0.8 },
                { text: `${text} משתמש`, type: 'user', relevance: 0.7 }
            )
        }

        // המלצות על בסיס הקשר
        if (context === 'contracts') {
            suggestions.push(
                { text: 'חוזים פעילים', type: 'contract', relevance: 0.8 },
                { text: 'חוזים שפגי תוקף', type: 'contract', relevance: 0.7 },
                { text: 'חוזים דחופים', type: 'contract', relevance: 0.9 }
            )
        }

        // המלצות על בסיס היסטוריה
        const historySuggestions = this.searchHistory
            .filter(term => term.includes(text))
            .map(term => ({ text: term, type: 'contract' as const, relevance: 0.6 }))

        suggestions.push(...historySuggestions)

        return suggestions.sort((a, b) => b.relevance - a.relevance).slice(0, 10)
    }

    // שמירת חיפוש
    saveSearch(name: string, query: SearchQuery): void {
        this.savedSearches.set(name, query)
        this.persistSavedSearches()
    }

    // טעינת חיפוש שמור
    getSavedSearch(name: string): SearchQuery | undefined {
        return this.savedSearches.get(name)
    }

    // רשימת חיפושים שמורים
    getSavedSearches(): string[] {
        return Array.from(this.savedSearches.keys())
    }

    // מחיקת חיפוש שמור
    deleteSavedSearch(name: string): void {
        this.savedSearches.delete(name)
        this.persistSavedSearches()
    }

    // היסטוריית חיפוש
    getSearchHistory(): string[] {
        return [...this.searchHistory]
    }

    // ניקוי היסטוריית חיפוש
    clearSearchHistory(): void {
        this.searchHistory = []
        this.persistSearchHistory()
    }

    // יצירת אינדקס חיפוש
    createSearchIndex<T>(items: T[], key: string): void {
        this.searchIndex.set(key, items)
    }

    // עדכון אינדקס חיפוש
    updateSearchIndex<T>(items: T[], key: string): void {
        this.searchIndex.set(key, items)
    }

    // סימולציה של ביצוע חיפוש
    private async performSearch<T>(query: SearchQuery): Promise<SearchResult<T>> {
        // סימולציה של עיכוב רשת
        await new Promise(resolve => setTimeout(resolve, 100 + Math.random() * 200))

        const mockItems = this.generateMockResults<T>(query)
        const total = mockItems.length
        const totalPages = Math.ceil(total / query.limit)
        const startIndex = (query.page - 1) * query.limit
        const endIndex = startIndex + query.limit
        const paginatedItems = mockItems.slice(startIndex, endIndex)

        return {
            items: paginatedItems,
            total,
            page: query.page,
            totalPages,
            hasMore: query.page < totalPages,
            facets: this.generateFacets(mockItems),
            suggestions: await this.generateSuggestions(query.text || '', 'contracts').then(s => s.map(s => s.text))
        }
    }

    // יצירת תוצאות מדומות
    private generateMockResults<T>(query: SearchQuery): T[] {
        const mockData = [
            { id: '1', title: 'חוזה שכירות דירה', status: 'active', value: 50000, createdAt: new Date('2024-01-15') },
            { id: '2', title: 'חוזה עבודה', status: 'pending', value: 80000, createdAt: new Date('2024-01-10') },
            { id: '3', title: 'חוזה שירותים', status: 'completed', value: 25000, createdAt: new Date('2024-01-05') },
            { id: '4', title: 'חוזה מכירה', status: 'active', value: 150000, createdAt: new Date('2024-01-20') },
            { id: '5', title: 'חוזה שותפות', status: 'draft', value: 300000, createdAt: new Date('2024-01-25') },
        ] as T[]

        // סינון לפי טקסט
        if (query.text) {
            return mockData.filter(item =>
                (item as any).title?.toLowerCase().includes(query.text!.toLowerCase())
            )
        }

        return mockData
    }

    // יצירת facets
    private generateFacets(items: unknown[]): Record<string, unknown> {
        const statusCount: Record<string, number> = {}
        const valueRanges: Record<string, number> = {
            '0-10K': 0,
            '10K-50K': 0,
            '50K-100K': 0,
            '100K+': 0,
        }

        items.forEach(item => {
            // Count by status
            const status = (item as { status?: string }).status || 'unknown'
            statusCount[status] = (statusCount[status] || 0) + 1

            // Count by value range
            const value = (item as { value?: number }).value || 0
            if (value <= 10000) {
                valueRanges['0-10K']++
            } else if (value <= 50000) {
                valueRanges['10K-50K']++
            } else if (value <= 100000) {
                valueRanges['50K-100K']++
            } else {
                valueRanges['100K+']++
            }
        })

        return {
            status: statusCount,
            valueRanges,
            total: items.length
        }
    }

    // הוספה להיסטוריית חיפוש
    private addToSearchHistory(term: string): void {
        if (!this.searchHistory.includes(term)) {
            this.searchHistory.unshift(term)
            this.searchHistory = this.searchHistory.slice(0, 20) // שמירת 20 חיפושים אחרונים
            this.persistSearchHistory()
        }
    }

    // שמירת היסטוריית חיפוש
    private persistSearchHistory(): void {
        try {
            localStorage.setItem('search_history', JSON.stringify(this.searchHistory))
        } catch (error) {
            logger.error('Failed to persist search history:', error)
        }
    }

    // טעינת היסטוריית חיפוש
    private loadSearchHistory(): void {
        try {
            const saved = localStorage.getItem('search_history')
            if (saved) {
                this.searchHistory = JSON.parse(saved)
            }
        } catch (error) {
            logger.error('Failed to load search history:', error)
            this.searchHistory = []
        }
    }

    // שמירת חיפושים שמורים
    private persistSavedSearches(): void {
        try {
            const saved = Object.fromEntries(this.savedSearches)
            localStorage.setItem('saved_searches', JSON.stringify(saved))
        } catch (error) {
            logger.error('Failed to persist saved searches:', error)
        }
    }

    // טעינת חיפושים שמורים
    private loadSavedSearches(): void {
        try {
            const saved = localStorage.getItem('saved_searches')
            if (saved) {
                const parsed = JSON.parse(saved)
                this.savedSearches = new Map(Object.entries(parsed))
            }
        } catch (error) {
            logger.error('Failed to load saved searches:', error)
            this.savedSearches = new Map()
        }
    }

    // יצירת פילטר מתקדם
    createFilter(field: string, operator: SearchFilter['operator'], value: unknown, value2?: unknown): SearchFilter {
        return { field, operator, value, value2 }
    }

    // יצירת אפשרות מיון
    createSortOption(field: string, direction: 'asc' | 'desc' = 'desc'): SortOption {
        return { field, direction }
    }

    // יצירת שאילתת חיפוש
    createSearchQuery(text?: string, filters: SearchFilter[] = [], sort: SortOption[] = []): SearchQuery {
        return {
            text,
            filters,
            sort: sort.length > 0 ? sort : [{ field: 'createdAt', direction: 'desc' }],
            page: 1,
            limit: 20
        }
    }
}

// יצירת instance גלובלי
export const advancedSearchService = new AdvancedSearchService()

// הוספה ל-window לנגישות גלובלית
declare global {
    interface Window {
        search: typeof advancedSearchService
    }
}

window.search = advancedSearchService

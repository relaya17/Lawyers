import { ContractType, Difficulty } from '../types/index';

export interface TemplateVariable {
    name: string;
    type: 'text' | 'number' | 'date' | 'select' | 'boolean';
    label: string;
    required: boolean;
    defaultValue?: unknown;
    options?: string[];
    description: string;
    validation?: {
        min?: number;
        max?: number;
        pattern?: string;
        custom?: string;
    };
}

export interface ContractTemplate {
    id: string;
    name: string;
    hebrewName: string;
    description: string;
    category: string;
    contractType: ContractType;
    difficulty: Difficulty;
    tags: string[];
    rating: number;
    downloads: number;
    lastUpdated: Date;
    createdBy: string;
    isAIEnhanced: boolean;
    hasVariables: boolean;
    variables: TemplateVariable[];
    content: string;
    preview: string;
    aiSuggestions: string[];
    usageStats: {
        totalUses: number;
        successRate: number;
        averageRating: number;
        commonIssues: string[];
        popularVariables: string[];
    };
    metadata: {
        version: string;
        language: string;
        jurisdiction: string;
        industry: string;
        complexity: number;
        estimatedTime: number;
    };
}

export interface TemplateCategory {
    id: string;
    name: string;
    hebrewName: string;
    description: string;
    icon: string;
    count: number;
    subcategories: string[];
}

export interface TemplateSearchFilters {
    category?: string;
    contractType?: ContractType;
    difficulty?: Difficulty;
    tags?: string[];
    isAIEnhanced?: boolean;
    hasVariables?: boolean;
    minRating?: number;
    dateRange?: {
        from: Date;
        to: Date;
    };
}

export interface TemplateSearchResult {
    templates: ContractTemplate[];
    totalCount: number;
    filters: TemplateSearchFilters;
    suggestions: string[];
}

export interface AITemplateAnalysis {
    templateId: string;
    suggestions: {
        type: 'improvement' | 'risk' | 'compliance' | 'optimization';
        title: string;
        description: string;
        priority: 'low' | 'medium' | 'high';
        impact: string;
        implementation: string[];
    }[];
    riskAssessment: {
        overallRisk: number;
        riskFactors: {
            factor: string;
            score: number;
            description: string;
        }[];
    };
    complianceCheck: {
        isCompliant: boolean;
        issues: string[];
        recommendations: string[];
    };
    optimization: {
        efficiency: number;
        improvements: string[];
        estimatedSavings: string;
    };
}

export interface TemplateGenerationRequest {
    contractType: ContractType;
    category: string;
    requirements: string[];
    variables: TemplateVariable[];
    preferences: {
        language: string;
        jurisdiction: string;
        complexity: Difficulty;
        includeAI: boolean;
    };
}

export interface TemplateGenerationResult {
    template: ContractTemplate;
    generationTime: number;
    confidence: number;
    alternatives: ContractTemplate[];
}

class ContractTemplatesService {
    private templates: Map<string, ContractTemplate> = new Map();
    private categories: Map<string, TemplateCategory> = new Map();

    constructor() {
        this.initializeTemplates();
        this.initializeCategories();
    }

    // Get all templates with optional filters
    async getTemplates(filters?: TemplateSearchFilters): Promise<TemplateSearchResult> {
        let templates = Array.from(this.templates.values());

        if (filters) {
            templates = this.applyFilters(templates, filters);
        }

        const suggestions = this.generateSearchSuggestions(filters);

        return {
            templates,
            totalCount: templates.length,
            filters: filters || {},
            suggestions
        };
    }

    // Get template by ID
    async getTemplate(templateId: string): Promise<ContractTemplate | null> {
        return this.templates.get(templateId) || null;
    }

    // Create new template
    async createTemplate(template: Omit<ContractTemplate, 'id' | 'lastUpdated' | 'downloads' | 'rating'>): Promise<ContractTemplate> {
        const newTemplate: ContractTemplate = {
            ...template,
            id: `template_${Date.now()}`,
            lastUpdated: new Date(),
            downloads: 0,
            rating: 0,
            usageStats: {
                totalUses: 0,
                successRate: 0,
                averageRating: 0,
                commonIssues: [],
                popularVariables: []
            }
        };

        this.templates.set(newTemplate.id, newTemplate);
        return newTemplate;
    }

    // Update template
    async updateTemplate(templateId: string, updates: Partial<ContractTemplate>): Promise<ContractTemplate | null> {
        const template = this.templates.get(templateId);
        if (!template) return null;

        const updatedTemplate: ContractTemplate = {
            ...template,
            ...updates,
            lastUpdated: new Date()
        };

        this.templates.set(templateId, updatedTemplate);
        return updatedTemplate;
    }

    // Delete template
    async deleteTemplate(templateId: string): Promise<boolean> {
        return this.templates.delete(templateId);
    }

    // Get template categories
    async getCategories(): Promise<TemplateCategory[]> {
        return Array.from(this.categories.values());
    }

    // Search templates
    async searchTemplates(query: string, filters?: TemplateSearchFilters): Promise<TemplateSearchResult> {
        let templates = Array.from(this.templates.values());

        // Apply text search
        const searchTerms = query.toLowerCase().split(' ');
        templates = templates.filter(template => {
            const searchableText = [
                template.name,
                template.hebrewName,
                template.description,
                ...template.tags
            ].join(' ').toLowerCase();

            return searchTerms.every(term => searchableText.includes(term));
        });

        // Apply filters
        if (filters) {
            templates = this.applyFilters(templates, filters);
        }

        const suggestions = this.generateSearchSuggestions(filters, query);

        return {
            templates,
            totalCount: templates.length,
            filters: filters || {},
            suggestions
        };
    }

    // Generate template using AI
    async generateTemplate(request: TemplateGenerationRequest): Promise<TemplateGenerationResult> {
        const startTime = Date.now();

        // Simulate AI template generation
        const generatedTemplate: ContractTemplate = {
            id: `generated_${Date.now()}`,
            name: `Generated ${request.contractType} Template`,
            hebrewName: `תבנית ${request.contractType} שנוצרה`,
            description: `AI-generated template for ${request.contractType} contracts`,
            category: request.category,
            contractType: request.contractType,
            difficulty: request.preferences.complexity,
            tags: this.generateTags(request),
            rating: 0,
            downloads: 0,
            lastUpdated: new Date(),
            createdBy: 'AI Generator',
            isAIEnhanced: true,
            hasVariables: request.variables.length > 0,
            variables: request.variables,
            content: this.generateTemplateContent(request),
            preview: this.generateTemplatePreview(request),
            aiSuggestions: this.generateAISuggestions(request),
            usageStats: {
                totalUses: 0,
                successRate: 0,
                averageRating: 0,
                commonIssues: [],
                popularVariables: request.variables.map(v => v.name)
            },
            metadata: {
                version: '1.0.0',
                language: request.preferences.language,
                jurisdiction: request.preferences.jurisdiction,
                industry: request.category,
                complexity: this.calculateComplexity(request.preferences.complexity),
                estimatedTime: this.estimateGenerationTime(request)
            }
        };

        const generationTime = Date.now() - startTime;
        const confidence = this.calculateConfidence(request);

        // Generate alternatives
        const alternatives = this.generateAlternatives(request);

        return {
            template: generatedTemplate,
            generationTime,
            confidence,
            alternatives
        };
    }

    // Analyze template using AI
    async analyzeTemplate(templateId: string): Promise<AITemplateAnalysis> {
        const template = this.templates.get(templateId);
        if (!template) {
            throw new Error('Template not found');
        }

        // Simulate AI analysis
        const suggestions = this.generateAnalysisSuggestions(template);
        const riskAssessment = this.assessTemplateRisk(template);
        const complianceCheck = this.checkTemplateCompliance(template);
        const optimization = this.optimizeTemplate(template);

        return {
            templateId,
            suggestions,
            riskAssessment,
            complianceCheck,
            optimization
        };
    }

    // Download template
    async downloadTemplate(templateId: string, format: 'pdf' | 'docx' | 'txt' = 'pdf'): Promise<{ url: string; filename: string }> {
        const template = this.templates.get(templateId);
        if (!template) {
            throw new Error('Template not found');
        }

        // Update download count
        template.downloads++;
        this.templates.set(templateId, template);

        // Simulate file generation
        const filename = `${template.name.replace(/\s+/g, '_')}.${format}`;
        const url = `/api/templates/${templateId}/download?format=${format}`;

        return { url, filename };
    }

    // Rate template
    async rateTemplate(templateId: string, rating: number, feedback?: string): Promise<void> {
        const template = this.templates.get(templateId);
        if (!template) {
            throw new Error('Template not found');
        }

        // Update rating
        const currentRating = template.rating;
        const currentDownloads = template.downloads;
        const newRating = ((currentRating * currentDownloads) + rating) / (currentDownloads + 1);

        template.rating = newRating;
        template.downloads++;
        this.templates.set(templateId, template);
    }

    // Get popular templates
    async getPopularTemplates(limit: number = 10): Promise<ContractTemplate[]> {
        const templates = Array.from(this.templates.values());
        return templates
            .sort((a, b) => b.downloads - a.downloads)
            .slice(0, limit);
    }

    // Get trending templates
    async getTrendingTemplates(limit: number = 10): Promise<ContractTemplate[]> {
        const templates = Array.from(this.templates.values());
        const now = new Date();
        const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

        return templates
            .filter(template => template.lastUpdated > oneWeekAgo)
            .sort((a, b) => b.downloads - a.downloads)
            .slice(0, limit);
    }

    // Private helper methods
    private initializeTemplates(): void {
        const mockTemplates: ContractTemplate[] = [
            {
                id: '1',
                name: 'Commercial Lease Agreement',
                hebrewName: 'חוזה שכירות מסחרי',
                description: 'Comprehensive commercial lease agreement with AI-enhanced clauses',
                category: 'Real Estate',
                contractType: 'rental',
                difficulty: 'medium',
                tags: ['commercial', 'lease', 'property', 'business'],
                rating: 4.5,
                downloads: 1250,
                lastUpdated: new Date('2024-01-15'),
                createdBy: 'Legal Expert',
                isAIEnhanced: true,
                hasVariables: true,
                variables: [
                    {
                        name: 'tenantName',
                        type: 'text',
                        label: 'Tenant Name',
                        required: true,
                        description: 'Full legal name of the tenant'
                    },
                    {
                        name: 'propertyAddress',
                        type: 'text',
                        label: 'Property Address',
                        required: true,
                        description: 'Complete property address'
                    },
                    {
                        name: 'monthlyRent',
                        type: 'number',
                        label: 'Monthly Rent',
                        required: true,
                        description: 'Monthly rent amount in local currency'
                    },
                    {
                        name: 'leaseTerm',
                        type: 'select',
                        label: 'Lease Term',
                        required: true,
                        options: ['1 year', '2 years', '3 years', '5 years'],
                        description: 'Duration of the lease agreement'
                    }
                ],
                content: 'This is a comprehensive commercial lease agreement...',
                preview: 'Commercial lease agreement template with standard clauses...',
                aiSuggestions: [
                    'Add force majeure clause for pandemic situations',
                    'Include digital signature provisions',
                    'Add maintenance responsibility matrix'
                ],
                usageStats: {
                    totalUses: 1250,
                    successRate: 92,
                    averageRating: 4.5,
                    commonIssues: ['Rent escalation clauses', 'Maintenance responsibilities', 'Subletting provisions'],
                    popularVariables: ['tenantName', 'monthlyRent', 'leaseTerm']
                },
                metadata: {
                    version: '2.1.0',
                    language: 'he',
                    jurisdiction: 'Israel',
                    industry: 'Real Estate',
                    complexity: 7,
                    estimatedTime: 30
                }
            }
        ];

        mockTemplates.forEach(template => {
            this.templates.set(template.id, template);
        });
    }

    private initializeCategories(): void {
        const mockCategories: TemplateCategory[] = [
            {
                id: 'real-estate',
                name: 'Real Estate',
                hebrewName: 'נדל"ן',
                description: 'Property and real estate contracts',
                icon: '🏢',
                count: this.templates.size,
                subcategories: ['Lease', 'Purchase', 'Development', 'Management']
            },
            {
                id: 'technology',
                name: 'Technology',
                hebrewName: 'טכנולוגיה',
                description: 'IT and technology contracts',
                icon: '💻',
                count: 0,
                subcategories: ['Software', 'Hardware', 'Services', 'Licensing']
            },
            {
                id: 'business',
                name: 'Business',
                hebrewName: 'עסקי',
                description: 'General business contracts',
                icon: '📊',
                count: 0,
                subcategories: ['Partnership', 'Employment', 'Consulting', 'Distribution']
            }
        ];

        mockCategories.forEach(category => {
            this.categories.set(category.id, category);
        });
    }

    private applyFilters(templates: ContractTemplate[], filters: TemplateSearchFilters): ContractTemplate[] {
        return templates.filter(template => {
            if (filters.category && template.category !== filters.category) return false;
            if (filters.contractType && template.contractType !== filters.contractType) return false;
            if (filters.difficulty && template.difficulty !== filters.difficulty) return false;
            if (filters.isAIEnhanced !== undefined && template.isAIEnhanced !== filters.isAIEnhanced) return false;
            if (filters.hasVariables !== undefined && template.hasVariables !== filters.hasVariables) return false;
            if (filters.minRating && template.rating < filters.minRating) return false;
            if (filters.dateRange) {
                const templateDate = template.lastUpdated;
                if (templateDate < filters.dateRange.from || templateDate > filters.dateRange.to) return false;
            }
            return true;
        });
    }

    private generateSearchSuggestions(filters?: TemplateSearchFilters, query?: string): string[] {
        const suggestions: string[] = [];

        if (query) {
            suggestions.push(`Search results for "${query}"`);
        }

        if (filters?.category) {
            suggestions.push(`Filtered by category: ${filters.category}`);
        }

        if (filters?.isAIEnhanced) {
            suggestions.push('AI-enhanced templates only');
        }

        return suggestions;
    }

    private generateTags(request: TemplateGenerationRequest): string[] {
        const tags = [request.contractType.toLowerCase(), request.category.toLowerCase()];

        if (request.preferences.complexity === 'hard') {
            tags.push('advanced');
        }

        if (request.preferences.includeAI) {
            tags.push('ai-enhanced');
        }

        return tags;
    }

    private generateTemplateContent(request: TemplateGenerationRequest): string {
        return `Generated template content for ${request.contractType} contract in ${request.preferences.language}...`;
    }

    private generateTemplatePreview(request: TemplateGenerationRequest): string {
        return `Preview of generated ${request.contractType} template with ${request.variables.length} variables...`;
    }

    private generateAISuggestions(request: TemplateGenerationRequest): string[] {
        return [
            `Consider adding specific clauses for ${request.contractType}`,
            'Include dispute resolution mechanisms',
            'Add performance metrics and KPIs'
        ];
    }

    private calculateComplexity(difficulty: Difficulty): number {
        switch (difficulty) {
            case 'easy': return 3;
            case 'medium': return 6;
            case 'hard': return 9;
            default: return 5;
        }
    }

    private estimateGenerationTime(request: TemplateGenerationRequest): number {
        let baseTime = 5; // minutes
        baseTime += request.variables.length * 0.5;
        baseTime += request.preferences.complexity === 'hard' ? 3 : 0;
        baseTime += request.preferences.includeAI ? 2 : 0;
        return Math.round(baseTime);
    }

    private calculateConfidence(request: TemplateGenerationRequest): number {
        let confidence = 85; // base confidence

        if (request.variables.length > 5) confidence -= 10;
        if (request.preferences.complexity === 'hard') confidence -= 5;
        if (request.preferences.includeAI) confidence += 5;

        return Math.max(60, Math.min(95, confidence));
    }

    private generateAlternatives(request: TemplateGenerationRequest): ContractTemplate[] {
        // Generate 2 alternative templates
        return [1, 2].map(i => ({
            id: `alt_${i}_${Date.now()}`,
            name: `Alternative ${i} - ${request.contractType}`,
            hebrewName: `חלופה ${i} - ${request.contractType}`,
            description: `Alternative approach for ${request.contractType} template`,
            category: request.category,
            contractType: request.contractType,
            difficulty: request.preferences.complexity,
            tags: [...this.generateTags(request), `alternative-${i}`],
            rating: 0,
            downloads: 0,
            lastUpdated: new Date(),
            createdBy: 'AI Generator',
            isAIEnhanced: true,
            hasVariables: request.variables.length > 0,
            variables: request.variables,
            content: `Alternative ${i} content...`,
            preview: `Alternative ${i} preview...`,
            aiSuggestions: [`Alternative ${i} suggestions...`],
            usageStats: {
                totalUses: 0,
                successRate: 0,
                averageRating: 0,
                commonIssues: [],
                popularVariables: []
            },
            metadata: {
                version: '1.0.0',
                language: request.preferences.language,
                jurisdiction: request.preferences.jurisdiction,
                industry: request.category,
                complexity: this.calculateComplexity(request.preferences.complexity),
                estimatedTime: this.estimateGenerationTime(request)
            }
        }));
    }

    private generateAnalysisSuggestions(template: ContractTemplate): AITemplateAnalysis['suggestions'] {
        return [
            {
                type: 'improvement',
                title: 'Add Force Majeure Clause',
                description: 'Consider adding a force majeure clause for better risk management',
                priority: 'medium',
                impact: 'Reduces legal risk during unforeseen circumstances',
                implementation: ['Add force majeure definition', 'Specify triggering events', 'Define consequences']
            },
            {
                type: 'compliance',
                title: 'Update Data Protection Provisions',
                description: 'Ensure compliance with latest data protection regulations',
                priority: 'high',
                impact: 'Ensures legal compliance and reduces penalties',
                implementation: ['Review data handling clauses', 'Add GDPR compliance', 'Update privacy terms']
            }
        ];
    }

    private assessTemplateRisk(template: ContractTemplate): AITemplateAnalysis['riskAssessment'] {
        return {
            overallRisk: 65,
            riskFactors: [
                {
                    factor: 'Complexity',
                    score: 70,
                    description: 'High complexity increases interpretation risk'
                },
                {
                    factor: 'Variable Dependencies',
                    score: 60,
                    description: 'Multiple variable dependencies may cause conflicts'
                }
            ]
        };
    }

    private checkTemplateCompliance(template: ContractTemplate): AITemplateAnalysis['complianceCheck'] {
        return {
            isCompliant: true,
            issues: [],
            recommendations: [
                'Regular compliance reviews recommended',
                'Update jurisdiction-specific clauses annually'
            ]
        };
    }

    private optimizeTemplate(template: ContractTemplate): AITemplateAnalysis['optimization'] {
        return {
            efficiency: 85,
            improvements: [
                'Simplify complex clauses',
                'Add automated validation',
                'Optimize variable structure'
            ],
            estimatedSavings: '15-20% in processing time'
        };
    }
}

export const contractTemplatesService = new ContractTemplatesService();

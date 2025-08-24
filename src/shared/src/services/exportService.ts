// שירות ייצוא מתקדם - ContractLab Pro
// ייצוא ל-PDF, Word, Excel ו-HTML

import { logger } from '../utils/logger'

export interface ExportOptions {
    format: 'pdf' | 'word' | 'excel' | 'html'
    template?: string
    includeMetadata?: boolean
    includeSignatures?: boolean
    watermark?: string
    password?: string
    compression?: boolean
    quality?: 'low' | 'medium' | 'high'
}

export interface ExportTemplate {
    id: string
    name: string
    description: string
    format: ExportOptions['format']
    template: string
    variables: string[]
    isDefault?: boolean
}

export interface ExportResult {
    success: boolean
    url?: string
    filename?: string
    size?: number
    error?: string
    metadata?: Record<string, unknown>
}

class ExportService {
    private templates: Map<string, ExportTemplate> = new Map()
    private exportHistory: ExportResult[] = []

    constructor() {
        this.initializeTemplates()
        this.loadExportHistory()
    }

    // ייצוא חוזה
    async exportContract(
        contractId: string,
        options: ExportOptions
    ): Promise<ExportResult> {
        try {
            // סימולציה של ייצוא
            const result = await this.performExport(contractId, options)

            // שמירה בהיסטוריה
            this.exportHistory.unshift(result)
            this.persistExportHistory()

            return result
        } catch (error) {
            logger.error('Export failed:', error)
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Export failed'
            }
        }
    }

    // ייצוא רשימת חוזים
    async exportContractsList(
        contracts: Record<string, unknown>[],
        options: ExportOptions
    ): Promise<ExportResult> {
        try {
            const result = await this.performBulkExport(contracts, options)

            this.exportHistory.unshift(result)
            this.persistExportHistory()

            return result
        } catch (error) {
            logger.error('Bulk export failed:', error)
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Bulk export failed'
            }
        }
    }

    // ייצוא דוח אנליטיקה
    async exportAnalyticsReport(
        data: Record<string, unknown>,
        options: ExportOptions
    ): Promise<ExportResult> {
        try {
            const result = await this.performAnalyticsExport(data, options)

            this.exportHistory.unshift(result)
            this.persistExportHistory()

            return result
        } catch (error) {
            logger.error('Analytics export failed:', error)
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Analytics export failed'
            }
        }
    }

    // ייצוא תבנית מותאמת
    async exportWithTemplate(
        data: Record<string, unknown>,
        templateId: string,
        options: ExportOptions
    ): Promise<ExportResult> {
        const template = this.templates.get(templateId)
        if (!template) {
            return {
                success: false,
                error: 'Template not found'
            }
        }

        try {
            const result = await this.performTemplateExport(data, template, options)

            this.exportHistory.unshift(result)
            this.persistExportHistory()

            return result
        } catch (error) {
            logger.error('Template export failed:', error)
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Template export failed'
            }
        }
    }

    // ייצוא PDF מתקדם
    async exportToPDF(
        content: string,
        options: Partial<ExportOptions> = {}
    ): Promise<ExportResult> {
        const exportOptions: ExportOptions = {
            format: 'pdf',
            includeMetadata: true,
            compression: true,
            quality: 'high',
            ...options
        }

        try {
            // סימולציה של ייצוא PDF
            await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000))

            const filename = `contract_${Date.now()}.pdf`
            const size = Math.floor(Math.random() * 500000) + 100000 // 100KB - 600KB

            return {
                success: true,
                url: `/exports/${filename}`,
                filename,
                size,
                metadata: {
                    format: 'pdf',
                    pages: Math.floor(Math.random() * 10) + 1,
                    compressed: exportOptions.compression,
                    quality: exportOptions.quality
                }
            }
        } catch (error) {
            return {
                success: false,
                error: 'PDF export failed'
            }
        }
    }

    // ייצוא Word
    async exportToWord(
        content: string,
        options: Partial<ExportOptions> = {}
    ): Promise<ExportResult> {
        const exportOptions: ExportOptions = {
            format: 'word',
            includeMetadata: true,
            ...options
        }

        try {
            await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 1500))

            const filename = `contract_${Date.now()}.docx`
            const size = Math.floor(Math.random() * 300000) + 50000 // 50KB - 350KB

            return {
                success: true,
                url: `/exports/${filename}`,
                filename,
                size,
                metadata: {
                    format: 'word',
                    editable: true,
                    compatible: true
                }
            }
        } catch (error) {
            return {
                success: false,
                error: 'Word export failed'
            }
        }
    }

    // ייצוא Excel
    async exportToExcel(
        data: Record<string, unknown>[],
        options: Partial<ExportOptions> = {}
    ): Promise<ExportResult> {
        const exportOptions: ExportOptions = {
            format: 'excel',
            includeMetadata: true,
            ...options
        }

        try {
            await new Promise(resolve => setTimeout(resolve, 600 + Math.random() * 1000))

            const filename = `contracts_${Date.now()}.xlsx`
            const size = Math.floor(Math.random() * 200000) + 30000 // 30KB - 230KB

            return {
                success: true,
                url: `/exports/${filename}`,
                filename,
                size,
                metadata: {
                    format: 'excel',
                    sheets: Math.floor(Math.random() * 5) + 1,
                    rows: data.length,
                    columns: Object.keys(data[0] || {}).length
                }
            }
        } catch (error) {
            return {
                success: false,
                error: 'Excel export failed'
            }
        }
    }

    // ייצוא HTML
    async exportToHTML(
        content: string,
        options: Partial<ExportOptions> = {}
    ): Promise<ExportResult> {
        const exportOptions: ExportOptions = {
            format: 'html',
            includeMetadata: false,
            ...options
        }

        try {
            await new Promise(resolve => setTimeout(resolve, 300 + Math.random() * 500))

            const filename = `contract_${Date.now()}.html`
            const size = content.length + 1000 // גודל משוער

            return {
                success: true,
                url: `/exports/${filename}`,
                filename,
                size,
                metadata: {
                    format: 'html',
                    responsive: true,
                    webCompatible: true
                }
            }
        } catch (error) {
            return {
                success: false,
                error: 'HTML export failed'
            }
        }
    }

    // הורדת קובץ
    async downloadFile(url: string, filename: string): Promise<void> {
        try {
            const response = await fetch(url)
            const blob = await response.blob()

            const downloadUrl = window.URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.href = downloadUrl
            link.download = filename
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
            window.URL.revokeObjectURL(downloadUrl)
        } catch (error) {
            logger.error('Download failed:', error)
            throw error
        }
    }

    // קבלת תבניות ייצוא
    getTemplates(): ExportTemplate[] {
        return Array.from(this.templates.values())
    }

    // קבלת תבנית לפי ID
    getTemplate(templateId: string): ExportTemplate | undefined {
        return this.templates.get(templateId)
    }

    // הוספת תבנית חדשה
    addTemplate(template: ExportTemplate): void {
        this.templates.set(template.id, template)
        this.persistTemplates()
    }

    // עדכון תבנית
    updateTemplate(templateId: string, updates: Partial<ExportTemplate>): void {
        const template = this.templates.get(templateId)
        if (template) {
            this.templates.set(templateId, { ...template, ...updates })
            this.persistTemplates()
        }
    }

    // מחיקת תבנית
    deleteTemplate(templateId: string): void {
        this.templates.delete(templateId)
        this.persistTemplates()
    }

    // קבלת היסטוריית ייצוא
    getExportHistory(): ExportResult[] {
        return [...this.exportHistory]
    }

    // ניקוי היסטוריית ייצוא
    clearExportHistory(): void {
        this.exportHistory = []
        this.persistExportHistory()
    }

    // סימולציה של ייצוא
    private async performExport(
        contractId: string,
        options: ExportOptions
    ): Promise<ExportResult> {
        await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000))

        const filename = `contract_${contractId}_${Date.now()}.${options.format}`
        const size = Math.floor(Math.random() * 500000) + 100000

        return {
            success: true,
            url: `/exports/${filename}`,
            filename,
            size,
            metadata: {
                contractId,
                format: options.format,
                timestamp: new Date().toISOString()
            }
        }
    }

    // סימולציה של ייצוא מרובה
    private async performBulkExport(
        contracts: Record<string, unknown>[],
        options: ExportOptions
    ): Promise<ExportResult> {
        await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 3000))

        const filename = `contracts_bulk_${Date.now()}.${options.format}`
        const size = contracts.length * 50000 + Math.floor(Math.random() * 100000)

        return {
            success: true,
            url: `/exports/${filename}`,
            filename,
            size,
            metadata: {
                count: contracts.length,
                format: options.format,
                timestamp: new Date().toISOString()
            }
        }
    }

    // סימולציה של ייצוא אנליטיקה
    private async performAnalyticsExport(
        data: Record<string, unknown>,
        options: ExportOptions
    ): Promise<ExportResult> {
        await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 2500))

        const filename = `analytics_report_${Date.now()}.${options.format}`
        const size = Math.floor(Math.random() * 300000) + 50000

        return {
            success: true,
            url: `/exports/${filename}`,
            filename,
            size,
            metadata: {
                type: 'analytics',
                format: options.format,
                timestamp: new Date().toISOString()
            }
        }
    }

    // סימולציה של ייצוא תבנית
    private async performTemplateExport(
        data: Record<string, unknown>,
        template: ExportTemplate,
        options: ExportOptions
    ): Promise<ExportResult> {
        await new Promise(resolve => setTimeout(resolve, 1200 + Math.random() * 1800))

        const filename = `${template.name}_${Date.now()}.${options.format}`
        const size = Math.floor(Math.random() * 400000) + 80000

        return {
            success: true,
            url: `/exports/${filename}`,
            filename,
            size,
            metadata: {
                templateId: template.id,
                templateName: template.name,
                format: options.format,
                timestamp: new Date().toISOString()
            }
        }
    }

    // אתחול תבניות ברירת מחדל
    private initializeTemplates(): void {
        const defaultTemplates: ExportTemplate[] = [
            {
                id: 'contract_pdf',
                name: 'חוזה PDF',
                description: 'ייצוא חוזה לפורמט PDF',
                format: 'pdf',
                template: 'contract-pdf-template',
                variables: ['title', 'parties', 'content', 'signatures'],
                isDefault: true
            },
            {
                id: 'contract_word',
                name: 'חוזה Word',
                description: 'ייצוא חוזה לפורמט Word',
                format: 'word',
                template: 'contract-word-template',
                variables: ['title', 'parties', 'content'],
                isDefault: true
            },
            {
                id: 'contracts_list_excel',
                name: 'רשימת חוזים Excel',
                description: 'ייצוא רשימת חוזים לפורמט Excel',
                format: 'excel',
                template: 'contracts-list-template',
                variables: ['contracts', 'filters', 'sort'],
                isDefault: true
            },
            {
                id: 'analytics_report_pdf',
                name: 'דוח אנליטיקה PDF',
                description: 'ייצוא דוח אנליטיקה לפורמט PDF',
                format: 'pdf',
                template: 'analytics-report-template',
                variables: ['data', 'charts', 'summary'],
                isDefault: true
            }
        ]

        defaultTemplates.forEach(template => {
            this.templates.set(template.id, template)
        })

        this.loadTemplates()
    }

    // שמירת תבניות
    private persistTemplates(): void {
        try {
            const templatesArray = Array.from(this.templates.values())
            localStorage.setItem('export_templates', JSON.stringify(templatesArray))
        } catch (error) {
            logger.error('Failed to persist templates:', error)
        }
    }

    // טעינת תבניות
    private loadTemplates(): void {
        try {
            const saved = localStorage.getItem('export_templates')
            if (saved) {
                const templatesArray = JSON.parse(saved)
                templatesArray.forEach((template: ExportTemplate) => {
                    this.templates.set(template.id, template)
                })
            }
        } catch (error) {
            logger.error('Failed to load templates:', error)
            this.templates = new Map()
        }
    }

    // שמירת היסטוריית ייצוא
    private persistExportHistory(): void {
        try {
            localStorage.setItem('export_history', JSON.stringify(this.exportHistory.slice(0, 50))) // שמירת 50 ייצואים אחרונים
        } catch (error) {
            logger.error('Failed to persist export history:', error)
        }
    }

    // טעינת היסטוריית ייצוא
    private loadExportHistory(): void {
        try {
            const saved = localStorage.getItem('export_history')
            if (saved) {
                this.exportHistory = JSON.parse(saved)
            }
        } catch (error) {
            logger.error('Failed to load export history:', error)
            this.exportHistory = []
        }
    }
}

// יצירת instance גלובלי
export const exportService = new ExportService()

// הוספה ל-window לנגישות גלובלית
declare global {
    interface Window {
        export: typeof exportService
    }
}

window.export = exportService

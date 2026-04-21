import { Contract } from '../../../entities/Contract'
import { logger } from '../utils/logger'

export interface AIRiskPrediction {
  overallRisk: 'low' | 'medium' | 'high' | 'very_high'
  riskScore: number
  confidence: number
  categories: RiskCategoryAnalysis[]
  criticalIssues: CriticalIssue[]
  alternativeClauses: AlternativeClause[]
  legalReferences: LegalReference[]
  complianceCheck: ComplianceStatus
}

export interface RiskCategoryAnalysis {
  category: string
  riskLevel: 'low' | 'medium' | 'high' | 'very_high'
  score: number
  issues: string[]
  recommendations: string[]
  legalBasis: string[]
}

export interface CriticalIssue {
  id: string
  severity: 'critical' | 'high' | 'medium' | 'low'
  title: string
  description: string
  location: {
    section: string
    paragraph: number
    line: number
    clause: string
  }
  impact: string
  legalRisk: string
  suggestedFix: string
  alternativeWording: string
  legalReference: string
  caseLaw?: string[]
}

export interface AlternativeClause {
  id: string
  originalClause: string
  suggestedClause: string
  reasoning: string
  legalBasis: string
  riskReduction: number
  compliance: string[]
  examples: string[]
}

export interface LegalReference {
  type: 'law' | 'regulation' | 'case_law' | 'guideline'
  title: string
  reference: string
  relevance: string
  lastUpdated: string
  url?: string
}

export interface ComplianceStatus {
  overall: 'compliant' | 'partial' | 'non_compliant'
  details: ComplianceDetail[]
  missingRequirements: string[]
  recommendations: string[]
}

export interface ComplianceDetail {
  requirement: string
  status: 'compliant' | 'partial' | 'non_compliant'
  description: string
  reference: string
}

export interface ContractAnalysisRequest {
  contract: Contract
  context?: {
    industry: string
    jurisdiction: string
    contractType: string
    parties: string[]
  }
  options?: {
    includeAlternatives: boolean
    includeLegalReferences: boolean
    includeComplianceCheck: boolean
    language: 'he' | 'en' | 'ar'
  }
}

export interface ContractAnalysisResponse {
  analysisId: string
  timestamp: string
  prediction: AIRiskPrediction
  metadata: {
    modelVersion: string
    processingTime: number
    confidence: number
  }
}

class AIRiskAnalysisService {
  private baseUrl = import.meta.env.VITE_AI_API_URL || 'https://api.contractlab.ai'
  private apiKey = import.meta.env.VITE_AI_API_KEY

  async analyzeContract(request: ContractAnalysisRequest): Promise<ContractAnalysisResponse> {
    try {
      // Mock AI analysis - replace with actual API call
      const response = await this.mockAIAnalysis(request)
      return response
    } catch (error) {
      logger.error('AI Analysis failed:', error)
      throw new Error('שגיאה בניתוח AI')
    }
  }

  async getAlternativeClauses(clause: string): Promise<AlternativeClause[]> {
    try {
      // Mock alternative clauses
      return this.mockAlternativeClauses(clause)
    } catch (error) {
      logger.error('Failed to get alternative clauses:', error)
      throw new Error('שגיאה בקבלת ניסוחים חלופיים')
    }
  }

  async validateCompliance(): Promise<ComplianceStatus> {
    try {
      // Mock compliance validation
      return this.mockComplianceValidation()
    } catch (error) {
      logger.error('Compliance validation failed:', error)
      throw new Error('שגיאה בבדיקת תאימות')
    }
  }

  private async mockAIAnalysis(_: ContractAnalysisRequest): Promise<ContractAnalysisResponse> {
    // Simulate AI processing time
    await new Promise(resolve => setTimeout(resolve, 2000))

    const criticalIssues: CriticalIssue[] = [
      {
        id: '1',
        severity: 'high',
        title: 'סעיף פיצוי נזיקין לא מאוזן',
        description: 'הסעיף מטיל אחריות מוגזמת על הצד השני ללא הגנה מספקת',
        location: {
          section: 'פיצוי נזיקין',
          paragraph: 3,
          line: 15,
          clause: 'הצד השני יישא באחריות מלאה לכל נזק שיגרם'
        },
        impact: 'חשיפה לתביעות נזיקין ללא הגנה משפטית',
        legalRisk: 'סעיף זה עלול להיפסל בבית המשפט כסעיף לא סביר',
        suggestedFix: 'הוספת הגנות משפטיות וקביעת תקרה לפיצוי',
        alternativeWording: 'הצד השני יישא באחריות לנזקים שנגרמו עקב רשלנותו בלבד, עד לתקרה של [סכום]',
        legalReference: 'סעיף 12 לחוק החוזים (חלק כללי)',
        caseLaw: ['ע"א 1234/20', 'ע"א 5678/19']
      },
      {
        id: '2',
        severity: 'medium',
        title: 'סעיף סודיות לא מפורט דיו',
        description: 'הסעיף אינו מגדיר בבירור מה נחשב למידע סודי',
        location: {
          section: 'סודיות',
          paragraph: 1,
          line: 8,
          clause: 'הצדדים מתחייבים לשמור על סודיות'
        },
        impact: 'אי בהירות לגבי היקף החובה',
        legalRisk: 'קושי באכיפת הסעיף במקרה של הפרה',
        suggestedFix: 'הגדרה מפורטת של המידע הסודי וזמן החובה',
        alternativeWording: 'הצדדים מתחייבים לשמור על סודיות המידע העסקי, הטכני והפיננסי למשך תקופה של 5 שנים',
        legalReference: 'סעיף 31 לחוק החוזים (חלק כללי)'
      }
    ]

    const alternativeClauses: AlternativeClause[] = [
      {
        id: '1',
        originalClause: 'השכיר ישלם דמי שכירות חודשיים בסך 5,000 ₪',
        suggestedClause: 'השכיר ישלם דמי שכירות חודשיים בסך 5,000 ₪ (חמשת אלפים שקלים חדשים) בתוספת מע"מ',
        reasoning: 'הוספת כתיבה במילים ומע"מ מפורש למניעת אי הבנות',
        legalBasis: 'סעיף 1 לחוק מס ערך מוסף',
        riskReduction: 30,
        compliance: ['חוק מע"מ', 'תקנות החשבונאות'],
        examples: ['דוגמאות מפסיקה עדכנית']
      }
    ]

    const legalReferences: LegalReference[] = [
      {
        type: 'law',
        title: 'חוק החוזים (חלק כללי)',
        reference: 'סעיף 12',
        relevance: 'סעיפים לא סבירים בחוזים',
        lastUpdated: '2024-01-15'
      },
      {
        type: 'case_law',
        title: 'ע"א 1234/20 - פלוני נ\' אלמוני',
        reference: 'ע"א 1234/20',
        relevance: 'פסיקה על סעיפי פיצוי נזיקין',
        lastUpdated: '2023-12-01'
      }
    ]

    return {
      analysisId: `analysis_${Date.now()}`,
      timestamp: new Date().toISOString(),
      prediction: {
        overallRisk: 'medium',
        riskScore: 65,
        confidence: 0.87,
        categories: [
          {
            category: 'פיצוי נזיקין',
            riskLevel: 'high',
            score: 75,
            issues: ['סעיף לא מאוזן', 'חשיפה מוגזמת'],
            recommendations: ['הוספת הגנות', 'קביעת תקרה'],
            legalBasis: ['סעיף 12 לחוק החוזים']
          },
          {
            category: 'סודיות',
            riskLevel: 'medium',
            score: 45,
            issues: ['הגדרה לא ברורה'],
            recommendations: ['פירוט המידע הסודי'],
            legalBasis: ['סעיף 31 לחוק החוזים']
          }
        ],
        criticalIssues,
        alternativeClauses,
        legalReferences,
        complianceCheck: {
          overall: 'partial',
          details: [
            {
              requirement: 'כתיבה במילים',
              status: 'non_compliant',
              description: 'חסר כתיבה במילים לסכומים',
              reference: 'תקנות החשבונאות'
            }
          ],
          missingRequirements: ['כתיבה במילים', 'מע"מ מפורש'],
          recommendations: ['הוספת כתיבה במילים', 'פירוט מע"מ']
        }
      },
      metadata: {
        modelVersion: '2.1.0',
        processingTime: 1850,
        confidence: 0.87
      }
    }
  }

  private mockAlternativeClauses(clause: string): AlternativeClause[] {
    return [
      {
        id: '1',
        originalClause: clause,
        suggestedClause: `${clause} (בתוספת מע"מ כחוק)`,
        reasoning: 'הוספת מע"מ מפורש למניעת אי הבנות',
        legalBasis: 'חוק מע"מ',
        riskReduction: 25,
        compliance: ['חוק מע"מ'],
        examples: ['דוגמאות מפסיקה']
      },
      {
        id: '2',
        originalClause: clause,
        suggestedClause: `${clause} - בכתב ובמילים`,
        reasoning: 'הוספת כתיבה במילים למניעת טעויות',
        legalBasis: 'תקנות החשבונאות',
        riskReduction: 15,
        compliance: ['תקנות החשבונאות'],
        examples: ['דוגמאות מפסיקה']
      }
    ]
  }

  private mockComplianceValidation(): ComplianceStatus {
    return {
      overall: 'partial',
      details: [
        {
          requirement: 'כתיבה במילים',
          status: 'non_compliant',
          description: 'חסר כתיבה במילים לסכומים',
          reference: 'תקנות החשבונאות'
        },
        {
          requirement: 'מע"מ מפורש',
          status: 'compliant',
          description: 'מע"מ מפורש כנדרש',
          reference: 'חוק מע"מ'
        }
      ],
      missingRequirements: ['כתיבה במילים'],
      recommendations: ['הוספת כתיבה במילים לכל הסכומים']
    }
  }
}

export const aiRiskAnalysisService = new AIRiskAnalysisService()

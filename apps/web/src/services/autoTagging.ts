// Auto-Tagging & Categorization Service
// שירות לסיווג ותיוג אוטומטי של חוזים

export interface ContractTag {
  id: string
  name: string
  category: 'legal' | 'business' | 'technical' | 'compliance' | 'financial' | 'operational' | 'regulatory'
  confidence: number // 0-100
  description: string
  hebrewName: string
  riskLevel: 'low' | 'medium' | 'high' | 'critical'
  legalReference?: string
}

export interface ContractCategory {
  id: string
  name: string
  hebrewName: string
  description: string
  commonClauses: string[]
  riskFactors: string[]
  legalRequirements: string[]
}

export interface RiskIndicator {
  id: string
  name: string
  hebrewName: string
  category: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  description: string
  legalBasis: string
  mitigation: string
}

export interface CriticalClause {
  id: string
  name: string
  hebrewName: string
  type: 'obligation' | 'liability' | 'termination' | 'compensation' | 'confidentiality' | 'non_compete'
  importance: 'low' | 'medium' | 'high' | 'critical'
  description: string
  legalRequirements: string[]
  commonIssues: string[]
  recommendations: string[]
}

export interface AutoTaggingResult {
  contractId: string
  tags: ContractTag[]
  categories: ContractCategory
  riskIndicators: RiskIndicator[]
  criticalClauses: CriticalClause[]
  overallRiskScore: number
  riskBreakdown: {
    legal: number
    financial: number
    operational: number
    compliance: number
    regulatory: number
  }
  recommendations: string[]
  complianceStatus: {
    isCompliant: boolean
    missingRequirements: string[]
    violations: string[]
  }
}

export interface AutoTaggingRequest {
  contractText: string
  contractType?: string
  includeRiskAnalysis?: boolean
  includeLegalReferences?: boolean
}

// Mock data for Israeli contract law
const contractCategories: ContractCategory[] = [
  {
    id: 'rental',
    name: 'Rental Agreement',
    hebrewName: 'חוזה שכירות',
    description: 'חוזי שכירות דירה או נכס מסחרי',
    commonClauses: [
      'סעיף פיקדון והחזרתו',
      'תיקון תקלות',
      'תשלום שכירות',
      'ביטול חוזה',
      'העברת זכויות'
    ],
    riskFactors: [
      'פיקדון לא מפורט',
      'תקלות לא מוגדרות',
      'היעדר סעיף ביטול',
      'העברת זכויות לא מוגבלת'
    ],
    legalRequirements: [
      'חוק השכירות והשאילה',
      'סעיף 5 - פיקדון',
      'סעיף 6 - תיקון תקלות',
      'סעיף 7 - ביטול חוזה'
    ]
  },
  {
    id: 'employment',
    name: 'Employment Contract',
    hebrewName: 'חוזה עבודה',
    description: 'חוזי העסקה וסעיפי עבודה',
    commonClauses: [
      'תנאי העסקה',
      'שכר ותנאים סוציאליים',
      'סעיף אי תחרות',
      'סיום העסקה',
      'סודיות'
    ],
    riskFactors: [
      'אי תחרות לא מאוזן',
      'היעדר פיצויי פיטורין',
      'סודיות לא מפורטת',
      'תנאים לא שווים'
    ],
    legalRequirements: [
      'חוק חוזה עבודה',
      'חוק שכר מינימום',
      'חוק שעות עבודה ומנוחה',
      'חוק פיצויי פיטורין'
    ]
  },
  {
    id: 'service',
    name: 'Service Agreement',
    hebrewName: 'חוזה שירותים',
    description: 'חוזי מתן שירותים מקצועיים',
    commonClauses: [
      'היקף השירות',
      'תשלום ואמצעי תשלום',
      'אחריות ושיפוי',
      'סודיות',
      'ביטול חוזה'
    ],
    riskFactors: [
      'היקף שירות לא מוגדר',
      'אחריות לא מאוזנת',
      'תשלום לא מפורט',
      'היעדר הגנות'
    ],
    legalRequirements: [
      'חוק החוזים',
      'חוק הגנת הצרכן',
      'חוק עוולות מסחריות'
    ]
  },
  {
    id: 'nda',
    name: 'Non-Disclosure Agreement',
    hebrewName: 'הסכם סודיות',
    description: 'הסכמי שמירת סודיות',
    commonClauses: [
      'הגדרת מידע סודי',
      'תקופת סודיות',
      'הגבלות שימוש',
      'סנקציות',
      'חזרת מידע'
    ],
    riskFactors: [
      'הגדרה רחבה מדי',
      'תקופה ארוכה מדי',
      'סנקציות לא סבירות',
      'היעדר חריגים'
    ],
    legalRequirements: [
      'חוק החוזים',
      'חוק עוולות מסחריות',
      'פסיקת בית המשפט'
    ]
  },
  {
    id: 'partnership',
    name: 'Partnership Agreement',
    hebrewName: 'הסכם שותפות',
    description: 'הסכמי שותפות עסקית',
    commonClauses: [
      'הון השותפות',
      'חלוקת רווחים',
      'ניהול השותפות',
      'סיום שותפות',
      'העברת זכויות'
    ],
    riskFactors: [
      'חלוקה לא מאוזנת',
      'ניהול לא מוגדר',
      'סיום לא מפורט',
      'היעדר מנגנון פתרון מחלוקות'
    ],
    legalRequirements: [
      'פקודת השותפויות',
      'חוק החוזים',
      'חוק החברות'
    ]
  }
]

const riskIndicators: RiskIndicator[] = [
  {
    id: 'unbalanced_liability',
    name: 'Unbalanced Liability',
    hebrewName: 'אחריות לא מאוזנת',
    category: 'legal',
    severity: 'high',
    description: 'אחריות מוטלת על צד אחד בלבד ללא איזון',
    legalBasis: 'סעיף 12 לחוק החוזים - עקרון תום הלב',
    mitigation: 'איזון האחריות בין הצדדים עם הגנות מתאימות'
  },
  {
    id: 'vague_termination',
    name: 'Vague Termination',
    hebrewName: 'סעיף ביטול לא ברור',
    category: 'legal',
    severity: 'medium',
    description: 'תנאי ביטול החוזה לא מפורטים דיים',
    legalBasis: 'סעיף 7 לחוק השכירות והשאילה',
    mitigation: 'פירוט תנאי ביטול ברורים עם הודעה מוקדמת'
  },
  {
    id: 'excessive_penalty',
    name: 'Excessive Penalty',
    hebrewName: 'קנס מוגזם',
    category: 'financial',
    severity: 'critical',
    description: 'סנקציה כספית לא סבירה על הפרת חוזה',
    legalBasis: 'פסיקת בית המשפט העליון - עקרון המידתיות',
    mitigation: 'התאמת הסנקציה לנזק הצפוי'
  },
  {
    id: 'unclear_scope',
    name: 'Unclear Scope',
    hebrewName: 'היקף לא ברור',
    category: 'operational',
    severity: 'medium',
    description: 'היקף השירות או החובות לא מוגדרים בבירור',
    legalBasis: 'סעיף 25 לחוק החוזים - וודאות החוזה',
    mitigation: 'הגדרת היקף מפורט עם לוחות זמנים'
  },
  {
    id: 'missing_compliance',
    name: 'Missing Compliance',
    hebrewName: 'היעדר תאימות רגולטורית',
    category: 'compliance',
    severity: 'high',
    description: 'החוזה לא עומד בדרישות רגולטוריות',
    legalBasis: 'חוקים ספציפיים לתחום הפעילות',
    mitigation: 'בדיקת תאימות והתאמת החוזה'
  }
]

const criticalClauses: CriticalClause[] = [
  {
    id: 'deposit_clause',
    name: 'Deposit Clause',
    hebrewName: 'סעיף פיקדון',
    type: 'obligation',
    importance: 'critical',
    description: 'הגדרת פיקדון והתנאים להחזרתו',
    legalRequirements: [
      'סעיף 5 לחוק השכירות והשאילה',
      'הגדרת תנאי החזרה',
      'ניכויים מותרים'
    ],
    commonIssues: [
      'היעדר פירוט תנאי החזרה',
      'ניכויים לא מוגדרים',
      'תקופת החזרה לא מפורטת'
    ],
    recommendations: [
      'הגדרת תנאי החזרה מפורטים',
      'רשימת ניכויים מותרים',
      'תקופת החזרה מוגדרת'
    ]
  },
  {
    id: 'non_compete_clause',
    name: 'Non-Compete Clause',
    hebrewName: 'סעיף אי תחרות',
    type: 'non_compete',
    importance: 'high',
    description: 'הגבלת תחרות לאחר סיום העסקה',
    legalRequirements: [
      'פיצוי הולם',
      'תקופה סבירה',
      'היקף הגבלה מוגדר',
      'הגדרת מתחרה'
    ],
    commonIssues: [
      'היעדר פיצוי',
      'תקופה ארוכה מדי',
      'היקף רחב מדי',
      'הגדרה מעורפלת'
    ],
    recommendations: [
      'הוספת פיצוי מתאים',
      'קיצור תקופת ההגבלה',
      'הגדרת היקף מצומצם',
      'הגדרה ברורה של מתחרה'
    ]
  },
  {
    id: 'confidentiality_clause',
    name: 'Confidentiality Clause',
    hebrewName: 'סעיף סודיות',
    type: 'confidentiality',
    importance: 'high',
    description: 'הגנה על מידע סודי',
    legalRequirements: [
      'הגדרת מידע סודי',
      'תקופת סודיות',
      'הגבלות שימוש',
      'חריגים'
    ],
    commonIssues: [
      'הגדרה רחבה מדי',
      'תקופה ארוכה מדי',
      'היעדר חריגים',
      'סנקציות לא סבירות'
    ],
    recommendations: [
      'הגדרה מצומצמת ומדויקת',
      'תקופה סבירה',
      'הוספת חריגים',
      'סנקציות מידתיות'
    ]
  },
  {
    id: 'termination_clause',
    name: 'Termination Clause',
    hebrewName: 'סעיף ביטול',
    type: 'termination',
    importance: 'critical',
    description: 'תנאי ביטול החוזה',
    legalRequirements: [
      'הודעה מוקדמת',
      'תנאי ביטול ברורים',
      'השלכות ביטול',
      'פיצוי מתאים'
    ],
    commonIssues: [
      'הודעה לא מפורטת',
      'תנאים מעורפלים',
      'היעדר השלכות',
      'פיצוי לא מאוזן'
    ],
    recommendations: [
      'פירוט תקופת הודעה',
      'הגדרת תנאים ברורים',
      'הגדרת השלכות',
      'איזון הפיצוי'
    ]
  }
]

export const autoTaggingService = {
  // ניתוח אוטומטי של חוזה
  async analyzeContract(request: AutoTaggingRequest): Promise<AutoTaggingResult> {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // Mock analysis based on contract text
    const contractText = request.contractText.toLowerCase()
    
    const tags: ContractTag[] = []
    let riskScore = 0
    
    // Analyze contract type
    if (contractText.includes('שכירות') || contractText.includes('דירה') || contractText.includes('פיקדון')) {
      tags.push({
        id: 'rental_contract',
        name: 'Rental Contract',
        hebrewName: 'חוזה שכירות',
        category: 'legal',
        confidence: 95,
        description: 'חוזה שכירות דירה או נכס',
        riskLevel: 'medium'
      })
      riskScore += 30
    }
    
    if (contractText.includes('עבודה') || contractText.includes('עובד') || contractText.includes('מעסיק')) {
      tags.push({
        id: 'employment_contract',
        name: 'Employment Contract',
        hebrewName: 'חוזה עבודה',
        category: 'legal',
        confidence: 90,
        description: 'חוזה העסקה',
        riskLevel: 'high',
        legalReference: 'חוק חוזה עבודה'
      })
      riskScore += 40
    }
    
    if (contractText.includes('סודיות') || contractText.includes('מידע סודי')) {
      tags.push({
        id: 'confidentiality',
        name: 'Confidentiality',
        hebrewName: 'סודיות',
        category: 'compliance',
        confidence: 85,
        description: 'סעיף שמירת סודיות',
        riskLevel: 'medium'
      })
      riskScore += 25
    }
    
    if (contractText.includes('אי תחרות') || contractText.includes('לא יעבוד אצל מתחרה')) {
      tags.push({
        id: 'non_compete',
        name: 'Non-Compete',
        hebrewName: 'אי תחרות',
        category: 'legal',
        confidence: 88,
        description: 'סעיף אי תחרות',
        riskLevel: 'high',
        legalReference: 'פסיקת בית המשפט העליון'
      })
      riskScore += 35
    }
    
    // Risk indicators
    const identifiedRisks: RiskIndicator[] = []
    if (contractText.includes('אחריות') && !contractText.includes('אחריות הדדית')) {
      identifiedRisks.push(riskIndicators[0]) // Unbalanced liability
      riskScore += 20
    }
    
    if (contractText.includes('ביטול') && !contractText.includes('הודעה מוקדמת')) {
      identifiedRisks.push(riskIndicators[1]) // Vague termination
      riskScore += 15
    }
    
    // Critical clauses
    const identifiedCriticalClauses: CriticalClause[] = []
    if (contractText.includes('פיקדון')) {
      identifiedCriticalClauses.push(criticalClauses[0])
    }
    if (contractText.includes('אי תחרות')) {
      identifiedCriticalClauses.push(criticalClauses[1])
    }
    if (contractText.includes('סודיות')) {
      identifiedCriticalClauses.push(criticalClauses[2])
    }
    
    return {
      contractId: `contract_${Date.now()}`,
      tags,
      categories: contractCategories[0], // Default to rental
      riskIndicators: identifiedRisks,
      criticalClauses: identifiedCriticalClauses,
      overallRiskScore: Math.min(riskScore, 100),
      riskBreakdown: {
        legal: Math.round(riskScore * 0.4),
        financial: Math.round(riskScore * 0.3),
        operational: Math.round(riskScore * 0.2),
        compliance: Math.round(riskScore * 0.1),
        regulatory: Math.round(riskScore * 0.1)
      },
      recommendations: [
        'בדיקת איזון אחריות בין הצדדים',
        'הוספת סעיף ביטול מפורט',
        'הגדרת פיצוי הולם לסעיפי הגבלה'
      ],
      complianceStatus: {
        isCompliant: riskScore < 60,
        missingRequirements: riskScore > 50 ? ['סעיף ביטול מפורט', 'איזון אחריות'] : [],
        violations: riskScore > 70 ? ['אחריות לא מאוזנת'] : []
      }
    }
  },

  // קבלת כל הקטגוריות
  async getCategories(): Promise<ContractCategory[]> {
    return contractCategories
  },

  // קבלת כל סמני הסיכון
  async getRiskIndicators(): Promise<RiskIndicator[]> {
    return riskIndicators
  },

  // קבלת כל הסעיפים הקריטיים
  async getCriticalClauses(): Promise<CriticalClause[]> {
    return criticalClauses
  },

  // ניתוח סיכון מתקדם
  async analyzeRiskLevel(contractText: string): Promise<{
    level: 'low' | 'medium' | 'high' | 'critical'
    score: number
    factors: string[]
    recommendations: string[]
  }> {
    const analysis = await this.analyzeContract({ contractText })
    
    let level: 'low' | 'medium' | 'high' | 'critical' = 'low'
    if (analysis.overallRiskScore >= 80) level = 'critical'
    else if (analysis.overallRiskScore >= 60) level = 'high'
    else if (analysis.overallRiskScore >= 30) level = 'medium'
    
    return {
      level,
      score: analysis.overallRiskScore,
      factors: analysis.riskIndicators.map(risk => risk.hebrewName),
      recommendations: analysis.recommendations
    }
  }
}

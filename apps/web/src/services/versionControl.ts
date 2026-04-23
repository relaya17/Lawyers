// Advanced Version Control Service
// שירות ניהול גרסאות מתקדם לחוזים

export interface ContractVersion {
  id: string
  contractId: string
  versionNumber: number
  title: string
  content: string
  changes: ContractChange[]
  metadata: VersionMetadata
  createdAt: string
  createdBy: string
  status: 'draft' | 'review' | 'approved' | 'archived'
  tags: string[]
  riskScore?: number
  aiSuggestions?: string[]
}

export interface ContractChange {
  id: string
  type: 'addition' | 'deletion' | 'modification' | 'replacement'
  section: string
  oldText?: string
  newText?: string
  description: string
  impact: 'low' | 'medium' | 'high' | 'critical'
  legalImplications?: string[]
  aiAnalysis?: {
    riskLevel: 'low' | 'medium' | 'high' | 'critical'
    suggestions: string[]
    legalReferences: string[]
  }
}

export interface VersionMetadata {
  author: string
  timestamp: string
  changeReason: string
  stakeholders: string[]
  approvalStatus: 'pending' | 'approved' | 'rejected'
  comments: VersionComment[]
  attachments: string[]
  aiInsights: {
    riskChanges: string[]
    complianceUpdates: string[]
    legalImplications: string[]
  }
}

export interface VersionComment {
  id: string
  author: string
  timestamp: string
  content: string
  type: 'general' | 'legal' | 'business' | 'technical'
  resolved: boolean
  replies: VersionComment[]
}

export interface VersionComparison {
  version1: ContractVersion
  version2: ContractVersion
  differences: ContractDifference[]
  summary: {
    additions: number
    deletions: number
    modifications: number
    riskChanges: string[]
    complianceChanges: string[]
  }
}

export interface ContractDifference {
  id: string
  type: 'addition' | 'deletion' | 'modification'
  section: string
  oldText?: string
  newText?: string
  lineNumber?: number
  impact: 'low' | 'medium' | 'high' | 'critical'
  description: string
  legalImplications?: string[]
}

export interface VersionHistory {
  contractId: string
  versions: ContractVersion[]
  timeline: VersionTimelineEvent[]
  statistics: {
    totalVersions: number
    averageChangesPerVersion: number
    mostActiveAuthor: string
    riskTrend: 'increasing' | 'decreasing' | 'stable'
  }
}

export interface VersionTimelineEvent {
  id: string
  timestamp: string
  type: 'created' | 'modified' | 'approved' | 'rejected' | 'archived'
  versionNumber: number
  author: string
  description: string
  metadata?: Record<string, unknown>
}

export interface VersionControlRequest {
  contractId: string
  content: string
  changeReason: string
  stakeholders?: string[]
  tags?: string[]
  includeAiAnalysis?: boolean
}

export interface VersionComparisonRequest {
  version1Id: string
  version2Id: string
  includeAiAnalysis?: boolean
  highlightChanges?: boolean
}

// Mock data for version control
const mockVersions: ContractVersion[] = [
  {
    id: 'v1',
    contractId: 'contract_1',
    versionNumber: 1,
    title: 'חוזה שכירות - גרסה ראשונית',
    content: `חוזה שכירות דירה

בין: משכיר
לבין: שוכר

1. המחיר: 5,000 ₪ לחודש
2. הפיקדון: 10,000 ₪
3. משך החוזה: שנה
4. תיקון תקלות: המשכיר אחראי
5. ביטול: הודעה של חודש`,
    changes: [],
    metadata: {
      author: 'עו"ד כהן',
      timestamp: '2024-01-15T10:00:00Z',
      changeReason: 'יצירת חוזה ראשוני',
      stakeholders: ['משכיר', 'שוכר'],
      approvalStatus: 'approved',
      comments: [],
      attachments: [],
      aiInsights: {
        riskChanges: [],
        complianceUpdates: [],
        legalImplications: []
      }
    },
    createdAt: '2024-01-15T10:00:00Z',
    createdBy: 'עו"ד כהן',
    status: 'approved',
    tags: ['שכירות', 'דירה', 'פיקדון'],
    riskScore: 65
  },
  {
    id: 'v2',
    contractId: 'contract_1',
    versionNumber: 2,
    title: 'חוזה שכירות - עם פירוט פיקדון',
    content: `חוזה שכירות דירה

בין: משכיר
לבין: שוכר

1. המחיר: 5,000 ₪ לחודש
2. הפיקדון: 10,000 ₪. הפיקדון יוחזר בתוך 30 יום מסיום החוזה, בניכוי נזקים שנגרמו באשמת השוכר בלבד.
3. משך החוזה: שנה
4. תיקון תקלות: המשכיר אחראי. תקלות דחופות יותקנו תוך 24 שעות.
5. ביטול: הודעה של חודש`,
    changes: [
      {
        id: 'c1',
        type: 'modification',
        section: 'פיקדון',
        oldText: 'הפיקדון: 10,000 ₪',
        newText: 'הפיקדון: 10,000 ₪. הפיקדון יוחזר בתוך 30 יום מסיום החוזה, בניכוי נזקים שנגרמו באשמת השוכר בלבד.',
        description: 'הוספת פירוט תנאי החזרת הפיקדון',
        impact: 'medium',
        legalImplications: ['הגנה על השוכר מפני ניכויים לא מוצדקים'],
        aiAnalysis: {
          riskLevel: 'low',
          suggestions: ['הוספת דוח מפורט על ניכויים'],
          legalReferences: ['סעיף 5 לחוק השכירות והשאילה']
        }
      },
      {
        id: 'c2',
        type: 'modification',
        section: 'תיקון תקלות',
        oldText: 'תיקון תקלות: המשכיר אחראי',
        newText: 'תיקון תקלות: המשכיר אחראי. תקלות דחופות יותקנו תוך 24 שעות.',
        description: 'הוספת זמני תגובה לתיקון תקלות',
        impact: 'medium',
        legalImplications: ['הבטחת תיקון מהיר של תקלות דחופות'],
        aiAnalysis: {
          riskLevel: 'low',
          suggestions: ['הגדרת סוגי תקלות דחופות'],
          legalReferences: ['פסיקת בית המשפט העליון ע"א 1234/20']
        }
      }
    ],
    metadata: {
      author: 'עו"ד כהן',
      timestamp: '2024-01-20T14:30:00Z',
      changeReason: 'שיפור סעיפי פיקדון ותיקון תקלות',
      stakeholders: ['משכיר', 'שוכר'],
      approvalStatus: 'approved',
      comments: [
        {
          id: 'comment1',
          author: 'משכיר',
          timestamp: '2024-01-21T09:00:00Z',
          content: 'השינויים נראים טובים ומגנים על שני הצדדים',
          type: 'business',
          resolved: true,
          replies: []
        }
      ],
      attachments: ['risk_analysis_v2.pdf'],
      aiInsights: {
        riskChanges: ['הפחתת סיכון פיקדון מ-75% ל-45%'],
        complianceUpdates: ['עמידה בדרישות חוק השכירות'],
        legalImplications: ['הגנה משפטית משופרת']
      }
    },
    createdAt: '2024-01-20T14:30:00Z',
    createdBy: 'עו"ד כהן',
    status: 'approved',
    tags: ['שכירות', 'דירה', 'פיקדון', 'תיקון תקלות'],
    riskScore: 45,
    aiSuggestions: [
      'הוספת דוח מפורט על ניכויים',
      'הגדרת סוגי תקלות דחופות',
      'הוספת סעיף ביטול מפורט'
    ]
  }
]

export const versionControlService = {
  // יצירת גרסה חדשה
  async createVersion(request: VersionControlRequest): Promise<ContractVersion> {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))

    const existingVersions = mockVersions.filter(v => v.contractId === request.contractId)
    const nextVersionNumber = existingVersions.length + 1

    const newVersion: ContractVersion = {
      id: `v${nextVersionNumber}`,
      contractId: request.contractId,
      versionNumber: nextVersionNumber,
      title: `גרסה ${nextVersionNumber}`,
      content: request.content,
      changes: this.generateChanges(existingVersions[existingVersions.length - 1], request.content),
      metadata: {
        author: 'עו"ד כהן',
        timestamp: new Date().toISOString(),
        changeReason: request.changeReason,
        stakeholders: request.stakeholders || [],
        approvalStatus: 'pending',
        comments: [],
        attachments: [],
        aiInsights: {
          riskChanges: ['ניתוח סיכון מתבצע...'],
          complianceUpdates: ['בדיקת תאימות מתבצעת...'],
          legalImplications: ['ניתוח השלכות משפטיות...']
        }
      },
      createdAt: new Date().toISOString(),
      createdBy: 'עו"ד כהן',
      status: 'draft',
      tags: request.tags || [],
      riskScore: this.calculateRiskScore(request.content)
    }

    mockVersions.push(newVersion)
    return newVersion
  },

  // קבלת היסטוריית גרסאות
  async getVersionHistory(contractId: string): Promise<VersionHistory> {
    const versions = mockVersions.filter(v => v.contractId === contractId)

    const timeline: VersionTimelineEvent[] = versions.map(v => ({
      id: `event_${v.id}`,
      timestamp: v.createdAt,
      type: v.status === 'approved' ? 'approved' : 'modified',
      versionNumber: v.versionNumber,
      author: v.createdBy,
      description: v.metadata.changeReason
    }))

    return {
      contractId,
      versions,
      timeline,
      statistics: {
        totalVersions: versions.length,
        averageChangesPerVersion: versions.reduce((sum, v) => sum + v.changes.length, 0) / versions.length,
        mostActiveAuthor: 'עו"ד כהן',
        riskTrend: this.calculateRiskTrend(versions)
      }
    }
  },

  // השוואת גרסאות
  async compareVersions(request: VersionComparisonRequest): Promise<VersionComparison> {
    const version1 = mockVersions.find(v => v.id === request.version1Id)
    const version2 = mockVersions.find(v => v.id === request.version2Id)

    if (!version1 || !version2) {
      throw new Error('גרסה לא נמצאה')
    }

    const differences = this.generateDifferences(version1, version2)

    return {
      version1,
      version2,
      differences,
      summary: {
        additions: differences.filter(d => d.type === 'addition').length,
        deletions: differences.filter(d => d.type === 'deletion').length,
        modifications: differences.filter(d => d.type === 'modification').length,
        riskChanges: this.analyzeRiskChanges(version1, version2),
        complianceChanges: this.analyzeComplianceChanges(version1, version2)
      }
    }
  },

  // קבלת גרסה ספציפית
  async getVersion(versionId: string): Promise<ContractVersion | null> {
    return mockVersions.find(v => v.id === versionId) || null
  },

  // עדכון גרסה
  async updateVersion(versionId: string, updates: Partial<ContractVersion>): Promise<ContractVersion> {
    const versionIndex = mockVersions.findIndex(v => v.id === versionId)
    if (versionIndex === -1) {
      throw new Error('גרסה לא נמצאה')
    }

    mockVersions[versionIndex] = { ...mockVersions[versionIndex], ...updates }
    return mockVersions[versionIndex]
  },

  // מחיקת גרסה (ארכיון)
  async archiveVersion(versionId: string): Promise<void> {
    const version = mockVersions.find(v => v.id === versionId)
    if (version) {
      version.status = 'archived'
    }
  },

  // Rollback לגרסה קודמת
  async rollbackToVersion(contractId: string, targetVersionId: string): Promise<ContractVersion> {
    const targetVersion = mockVersions.find(v => v.id === targetVersionId)
    if (!targetVersion) {
      throw new Error('גרסת יעד לא נמצאה')
    }

    // Create new version with content from target version
    const rollbackVersion: ContractVersion = {
      ...targetVersion,
      id: `rollback_${Date.now()}`,
      versionNumber: mockVersions.filter(v => v.contractId === contractId).length + 1,
      title: `Rollback לגרסה ${targetVersion.versionNumber}`,
      createdAt: new Date().toISOString(),
      status: 'draft',
      changes: [{
        id: 'rollback_change',
        type: 'replacement',
        section: 'כל החוזה',
        description: `Rollback לגרסה ${targetVersion.versionNumber}`,
        impact: 'high',
        legalImplications: ['שחזור למצב קודם']
      }]
    }

    mockVersions.push(rollbackVersion)
    return rollbackVersion
  },

  // Helper methods
  generateChanges(previousVersion: ContractVersion | undefined, newContent: string): ContractChange[] {
    if (!previousVersion) return []

    // Mock change generation
    return [
      {
        id: `change_${Date.now()}`,
        type: 'modification',
        section: 'תוכן החוזה',
        oldText: previousVersion.content,
        newText: newContent,
        description: 'עדכון תוכן החוזה',
        impact: 'medium',
        legalImplications: ['בדיקת השלכות משפטיות נדרשת']
      }
    ]
  },

  generateDifferences(v1: ContractVersion, v2: ContractVersion): ContractDifference[] {
    // Mock difference generation
    return [
      {
        id: 'diff1',
        type: 'modification',
        section: 'פיקדון',
        oldText: 'הפיקדון: 10,000 ₪',
        newText: 'הפיקדון: 10,000 ₪. הפיקדון יוחזר בתוך 30 יום...',
        impact: 'medium',
        description: 'הוספת פירוט תנאי החזרת הפיקדון'
      }
    ]
  },

  calculateRiskScore(content: string): number {
    // Mock risk calculation
    let score = 50
    if (content.includes('פיקדון')) score -= 10
    if (content.includes('תיקון תקלות')) score -= 5
    if (content.includes('ביטול')) score -= 5
    return Math.max(0, Math.min(100, score))
  },

  calculateRiskTrend(versions: ContractVersion[]): 'increasing' | 'decreasing' | 'stable' {
    if (versions.length < 2) return 'stable'

    const recentVersions = versions.slice(-3)
    const firstScore = recentVersions[0].riskScore || 0
    const lastScore = recentVersions[recentVersions.length - 1].riskScore || 0

    if (lastScore > firstScore + 10) return 'increasing'
    if (lastScore < firstScore - 10) return 'decreasing'
    return 'stable'
  },

  analyzeRiskChanges(v1: ContractVersion, v2: ContractVersion): string[] {
    const score1 = v1.riskScore || 0
    const score2 = v2.riskScore || 0

    if (score2 < score1) {
      return [`הפחתת סיכון מ-${score1}% ל-${score2}%`]
    } else if (score2 > score1) {
      return [`עליית סיכון מ-${score1}% ל-${score2}%`]
    }
    return ['אין שינוי ברמת הסיכון']
  },

  analyzeComplianceChanges(v1: ContractVersion, v2: ContractVersion): string[] {
    return ['בדיקת תאימות מתבצעת...']
  }
}

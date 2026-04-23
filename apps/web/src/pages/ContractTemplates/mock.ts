import type { Template } from './types'

export function getMockTemplates(): Template[] {
  return [
    {
      id: '1',
      name: 'Commercial Lease Agreement',
      hebrewName: 'חוזה שכירות מסחרי',
      description: 'תבנית מלאה להסכם שכירות מסחרי עם סעיפים מומלצים',
      category: 'Real Estate',
      contractType: 'Lease',
      difficulty: 'Medium',
      tags: ['commercial', 'lease', 'property', 'business'],
      rating: 4.5,
      downloads: 1250,
      lastUpdated: new Date('2024-01-15'),
      isAIEnhanced: true,
      hasVariables: true,
      variables: [
        {
          name: 'tenantName',
          type: 'text',
          label: 'שם השוכר/ת',
          required: true,
          description: 'שם מלא של השוכר/ת',
        },
        {
          name: 'propertyAddress',
          type: 'text',
          label: 'כתובת הנכס',
          required: true,
          description: 'כתובת מלאה של הנכס',
        },
        {
          name: 'monthlyRent',
          type: 'number',
          label: 'דמי שכירות חודשיים',
          required: true,
          description: 'סכום דמי שכירות לחודש',
        },
        {
          name: 'leaseTerm',
          type: 'select',
          label: 'תקופת שכירות',
          required: true,
          options: ['1 year', '2 years', '3 years', '5 years'],
          description: 'משך ההסכם',
        },
      ],
      content:
        'הסכם שכירות מסחרי\n\n' +
        'הסכם זה נערך ונחתם בין:\n' +
        'השוכר/ת: {{tenantName}}\n' +
        'כתובת הנכס: {{propertyAddress}}\n\n' +
        'דמי שכירות חודשיים: ₪{{monthlyRent}}\n' +
        'תקופת שכירות: {{leaseTerm}}\n\n' +
        '1. מטרת השכירות...\n' +
        '2. התחייבויות הצדדים...\n' +
        '3. תחזוקה ושיפוצים...\n',
      preview:
        'תבנית להסכם שכירות מסחרי הכוללת סעיפים נפוצים ומקומות למילוי פרטים (שם שוכר/ת, כתובת, דמי שכירות, תקופה).',
      aiSuggestions: [
        'הוסף סעיף כוח עליון (force majeure)',
        'הוסף סעיף חתימה דיגיטלית',
        'הוסף מטריצת אחריות תחזוקה',
      ],
      usageStats: {
        totalUses: 1250,
        successRate: 92,
        averageRating: 4.5,
        commonIssues: ['סעיפי הצמדה', 'תחזוקה', 'אפשרות שכירות משנה'],
      },
    },
    {
      id: '2',
      name: 'Service Level Agreement',
      hebrewName: 'הסכם רמת שירות',
      description: 'הסכם SLA לשירותי IT עם מדדים ותנאי סנקציות',
      category: 'Technology',
      contractType: 'Service',
      difficulty: 'Hard',
      tags: ['IT', 'SLA', 'service', 'performance'],
      rating: 4.8,
      downloads: 890,
      lastUpdated: new Date('2024-01-10'),
      isAIEnhanced: true,
      hasVariables: true,
      variables: [
        {
          name: 'serviceProvider',
          type: 'text',
          label: 'ספק השירות',
          required: true,
          description: 'שם ספק השירות',
        },
        {
          name: 'uptimeRequirement',
          type: 'select',
          label: 'דרישת זמינות',
          required: true,
          options: ['99.5%', '99.9%', '99.99%'],
          description: 'אחוז זמינות מינימלי',
        },
      ],
      content: 'This Service Level Agreement (SLA) defines...',
      preview: 'תבנית SLA עם מדדי ביצועים, זמינות, זמני תגובה, ותהליך הסלמה.',
      aiSuggestions: [
        'כלול דרישות אבטחת מידע',
        'הוסף נהלי התאוששות מאסון',
        'הוסף דרישות גיבוי נתונים',
      ],
      usageStats: {
        totalUses: 890,
        successRate: 88,
        averageRating: 4.8,
        commonIssues: ['הגדרת מדדים', 'קנסות', 'תהליך הסלמה'],
      },
    },
  ]
}



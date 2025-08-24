import React, { useState } from 'react';
import { 
  Box, 
  Button, 
  Typography, 
  Card, 
  CardContent, 
  Grid, 
  Collapse,
  Chip,
  Divider,
  Alert,
  IconButton,
  Paper,
  Stepper,
  Step,
  StepLabel,
  StepContent
} from '@mui/material';
import {
  Upload as UploadIcon,
  Analytics as AnalyticsIcon,
  School as SchoolIcon,
  Gavel as GavelIcon,
  Business as BusinessIcon,
  Security as SecurityIcon,
  ShoppingCart as ShoppingCartIcon,
  Handshake as HandshakeIcon,
  Lightbulb as LightbulbIcon,
  Download as DownloadIcon,
  ArrowBack as ArrowBackIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Info as InfoIcon
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

type ContractType = 'Lease' | 'Service' | 'NDA' | 'Procurement' | 'JV';
type Difficulty = 'Easy' | 'Medium' | 'Hard';
type UserType = 'Lawyer' | 'Student' | 'Lecturer';

interface ContractQuestion {
  id: string;
  question: string;
  hebrewQuestion: string;
  category: string;
  hints: string[];
  legalReferences: string[];
  aiSuggestions: string[];
  scenario?: string;
}

interface ContractFlowData {
  type: ContractType;
  icon: React.ReactNode;
  hebrewName: string;
  description: string;
  questions: Record<Difficulty, ContractQuestion[]>;
}

const contractFlowData: Record<ContractType, ContractFlowData> = {
  Lease: {
    type: 'Lease',
    icon: <BusinessIcon />,
    hebrewName: 'חוזה שכירות',
    description: 'חוזי שכירות דירה או נכס מסחרי',
    questions: {
      Easy: [
        {
          id: 'lease_easy_1',
          question: 'Find early termination clauses and show risk level for each clause',
          hebrewQuestion: 'מצא סעיפי ביטול מוקדם והצג רמת סיכון לכל סעיף',
          category: 'Termination',
          hints: [
            'חפש מילים כמו "ביטול", "הפסקה", "סיום מוקדם"',
            'בדוק אם יש הודעה מוקדמת מפורטת',
            'חפש סנקציות על ביטול מוקדם'
          ],
          legalReferences: [
            'סעיף 7 לחוק השכירות והשאילה',
            'פסיקת בית המשפט העליון ע"א 1234/20'
          ],
          aiSuggestions: [
            'הוספת תקופת הודעה מוקדמת של 30 יום',
            'הגדרת פיצוי הוגן לביטול מוקדם',
            'הוספת חריגים לביטול מוקדם'
          ]
        },
        {
          id: 'lease_easy_2',
          question: 'Identify clauses that define maintenance responsibility',
          hebrewQuestion: 'ציין אילו סעיפים מגדירים אחריות על תחזוקה',
          category: 'Maintenance',
          hints: [
            'חפש מילים כמו "תחזוקה", "תיקון", "אחריות"',
            'בדוק מי אחראי על איזה סוג תחזוקה',
            'חפש חלוקת אחריות בין המשכיר לשוכר'
          ],
          legalReferences: [
            'סעיף 6 לחוק השכירות והשאילה',
            'פסיקת בית המשפט העליון ע"א 5678/21'
          ],
          aiSuggestions: [
            'הגדרת אחריות ברורה לתחזוקה שוטפת',
            'חלוקת אחריות לתחזוקה דחופה',
            'מנגנון דיווח על תקלות'
          ]
        },
        {
          id: 'lease_easy_3',
          question: 'Check if payment dates are clear',
          hebrewQuestion: 'בדוק אם תאריכי התשלום ברורים',
          category: 'Payment',
          hints: [
            'חפש תאריכי תשלום מדויקים',
            'בדוק אם יש הוראות על איחור',
            'חפש מנגנון עדכון תשלומים'
          ],
          legalReferences: [
            'סעיף 4 לחוק השכירות והשאילה',
            'חוק הגנת הצרכן'
          ],
          aiSuggestions: [
            'הגדרת תאריך תשלום מדויק',
            'הוראות על איחור בתשלום',
            'מנגנון עדכון אוטומטי'
          ]
        }
      ],
      Medium: [
        {
          id: 'lease_medium_1',
          question: 'Suggest alternative wording for early termination clause to improve tenant protection',
          hebrewQuestion: 'הצע ניסוח חלופי לסעיף ביטול מוקדם כדי לשפר הגנת השוכר',
          category: 'Termination',
          hints: [
            'שקול הוספת פיצוי הוגן לשוכר',
            'הגדר תקופת הודעה מתאימה',
            'הוסף חריגים לביטול מוקדם'
          ],
          legalReferences: [
            'סעיף 7 לחוק השכירות והשאילה',
            'עקרון המידתיות'
          ],
          aiSuggestions: [
            'ביטול מוקדם: המשכיר ייתן הודעה של 60 יום ויפצה את השוכר בסכום של חודש שכירות.',
            'חריגים: ביטול בשל שיפוץ דחוף או מכירה יינתן הודעה של 90 יום.',
            'פיצוי: השוכר יקבל פיצוי בגובה הוצאות המעבר בפועל.'
          ]
        },
        {
          id: 'lease_medium_2',
          question: 'Find conflicting clauses between contract and annexes',
          hebrewQuestion: 'מצא סעיפים סותרים בין חוזה לנספחים',
          category: 'Conflicts',
          hints: [
            'בדוק זמני תשלום שונים',
            'חפש סעיפי אחריות סותרים',
            'בדוק תנאי ביטול שונים'
          ],
          legalReferences: [
            'סעיף 25 לחוק החוזים - וודאות החוזה',
            'עקרון תום הלב'
          ],
          aiSuggestions: [
            'יישוב סתירות: במקרה של סתירה, הוראות החוזה הראשי גוברות.',
            'סעיף הרמוניזציה: כל ההוראות יפורשו יחד כחוזה אחד שלם.',
            'מנגנון בוררות: מחלוקות על פרשנות יוכרעו בבוררות.'
          ]
        },
        {
          id: 'lease_medium_3',
          question: 'Improve penalty clause for late payments',
          hebrewQuestion: 'שפר את סעיף הפיצוי על איחורים בתשלום',
          category: 'Penalty',
          hints: [
            'הגדר ריבית הוגנת',
            'הוסף מנגנון התראה',
            'שקול נסיבות מקלות'
          ],
          legalReferences: [
            'חוק הגנת הצרכן',
            'עקרון המידתיות'
          ],
          aiSuggestions: [
            'ריבית איחור: 3% לחודש על סכום שלא שולם במועד.',
            'התראה: לפני הטלת ריבית, תינתן התראה של 7 ימים.',
            'נסיבות מקלות: איחור בשל נסיבות מיוחדות ייבחן לגופו של עניין.'
          ]
        }
      ],
      Hard: [
        {
          id: 'lease_hard_1',
          question: 'Analyze early eviction dispute situation and suggest legal solution',
          hebrewQuestion: 'נתח סיטואציה של סכסוך על פינוי מוקדם והצע פתרון משפטי',
          category: 'Dispute Resolution',
          hints: [
            'בדוק סיבות לפינוי מוקדם',
            'חפש זכויות השוכר',
            'שקול מנגנוני פתרון מחלוקות'
          ],
          legalReferences: [
            'סעיף 7 לחוק השכירות והשאילה',
            'פסיקת בית המשפט העליון ע"א 1234/20'
          ],
          aiSuggestions: [
            'פינוי מוקדם: רק בשל הפרה מהותית של החוזה או שיפוץ דחוף.',
            'זכויות השוכר: פיצוי בגובה 3 חודשי שכירות + הוצאות מעבר.',
            'מנגנון בוררות: מחלוקות יוכרעו בבוררות תוך 30 יום.'
          ],
          scenario: 'המשכיר דורש פינוי מוקדם בטענה שהשוכר הפר את החוזה. השוכר מתנגד. איך לפתור?'
        },
        {
          id: 'lease_hard_2',
          question: 'Compare this clause with similar contract from Marketplace and suggest better wording',
          hebrewQuestion: 'השווה סעיף זה עם חוזה דומה מה־Marketplace והצע ניסוח טוב יותר',
          category: 'Comparison',
          hints: [
            'חפש חוזים דומים ב-Marketplace',
            'השווה סעיפים קריטיים',
            'שקול ניסוחים מוצלחים'
          ],
          legalReferences: [
            'פסיקת בית המשפט העליון',
            'נוהג מקובל בענף'
          ],
          aiSuggestions: [
            'ניסוח משופר: "המשכיר רשאי לבטל את החוזה רק בשל הפרה מהותית או שיפוץ דחוף, עם הודעה של 60 יום ופיצוי הוגן."',
            'הגנות נוספות: "השוכר רשאי לערער על הפינוי תוך 14 יום."',
            'מנגנון פיצוי: "פיצוי יוערך על ידי שמאי מוסמך."'
          ],
          scenario: 'איך לשפר את סעיף הפינוי המוקדם בהתבסס על חוזים דומים?'
        },
        {
          id: 'lease_hard_3',
          question: 'Find clauses that violate tenant rights and suggest amendments based on recent case law',
          hebrewQuestion: 'מצא סעיפים הפוגעים בזכויות השוכר והצע תיקונים מותאמים פסיקה עדכנית',
          category: 'Rights Protection',
          hints: [
            'בדוק סעיפים מגבילים',
            'חפש פגיעה בזכויות בסיסיות',
            'שקול פסיקה עדכנית'
          ],
          legalReferences: [
            'פסיקת בית המשפט העליון ע"א 5678/21',
            'חוק הגנת הצרכן',
            'עקרון המידתיות'
          ],
          aiSuggestions: [
            'הסרת הגבלות: "השוכר רשאי להשתמש בנכס לכל מטרה חוקית."',
            'זכויות בסיסיות: "השוכר רשאי לקבל אורחים ולקיים פעילות עסקית."',
            'הגנות נוספות: "המשכיר לא יכנס לנכס ללא הודעה מוקדמת של 24 שעות."'
          ],
          scenario: 'אילו סעיפים בחוזה פוגעים בזכויות השוכר ואיך לתקן אותם?'
        }
      ]
    }
  },
  Service: {
    type: 'Service',
    icon: <GavelIcon />,
    hebrewName: 'חוזה שירותים',
    description: 'חוזי מתן שירותים מקצועיים',
    questions: {
      Easy: [
        {
          id: 'service_easy_1',
          question: 'Mark SLA (Service Level Agreement) clauses',
          hebrewQuestion: 'סמן סעיפי SLA (Service Level Agreement)',
          category: 'SLA',
          hints: [
            'חפש זמני תגובה מוגדרים',
            'בדוק רמות שירות מדידות',
            'חפש סנקציות על אי עמידה'
          ],
          legalReferences: [
            'חוק הגנת הצרכן',
            'תקנות שירותים מקצועיים'
          ],
          aiSuggestions: [
            'זמני תגובה: 24 שעות לתגובה ראשונית, 72 שעות לפתרון',
            'רמות שירות: זמינות של 99.5%',
            'סנקציות: הפחתה של 10% מהתשלום על אי עמידה'
          ]
        },
        {
          id: 'service_easy_2',
          question: 'Check if there are damage liability clauses',
          hebrewQuestion: 'בדוק אם יש סעיפי אחריות על נזקים',
          category: 'Liability',
          hints: [
            'חפש מילים כמו "אחריות", "פיצוי", "שיפוי"',
            'בדוק אם האחריות מוגבלת או בלתי מוגבלת',
            'חפש סעיפי הגבלת נזקים'
          ],
          legalReferences: [
            'סעיף 12 לחוק החוזים',
            'חוק עוולות מסחריות'
          ],
          aiSuggestions: [
            'הגבלת אחריות: הספק לא יהיה אחראי לנזקים עקיפים או תוצאתיים',
            'פיצוי מקסימלי: הפיצוי לא יעלה על סכום החוזה',
            'תקופת אחריות: 12 חודשים מסיום השירות'
          ]
        },
        {
          id: 'service_easy_3',
          question: 'Evaluate overall contract risk',
          hebrewQuestion: 'הערך את הסיכון הכללי של החוזה',
          category: 'Risk Assessment',
          hints: [
            'בדוק סעיפי אחריות',
            'חפש סעיפי פיצוי',
            'הערך תנאי ביטול'
          ],
          legalReferences: [
            'חוק החוזים',
            'חוק הגנת הצרכן'
          ],
          aiSuggestions: [
            'ניתוח סיכונים: זיהוי נקודות תורפה בחוזה',
            'המלצות: הוספת הגנות מתאימות',
            'ניטור: מעקב אחר ביצוע החוזה'
          ]
        }
      ],
      Medium: [
        {
          id: 'service_medium_1',
          question: 'Improve service termination clause to protect both parties',
          hebrewQuestion: 'שפר את סעיף ביטול השירות כך שיגן על שני הצדדים',
          category: 'Termination',
          hints: [
            'הגדר תקופת הודעה הוגנת',
            'שקול פיצוי על ביטול מוקדם',
            'הוסף מנגנון העברת ידע'
          ],
          legalReferences: [
            'חוק החוזים',
            'חוק הגנת הצרכן'
          ],
          aiSuggestions: [
            'תקופת הודעה: 30 יום לביטול רגיל, 7 ימים לביטול בשל הפרה',
            'פיצוי: פיצוי בגובה 50% מהתשלום על ביטול מוקדם ללא סיבה',
            'העברת ידע: הספק יעביר את כל המידע הנדרש תוך 14 יום'
          ]
        },
        {
          id: 'service_medium_2',
          question: 'Suggest alternative wording for liability limitation clause',
          hebrewQuestion: 'הצע ניסוח חלופי לסעיף הגבלת אחריות',
          category: 'Liability',
          hints: [
            'הגדר אחריות הוגנת',
            'שקול נסיבות מיוחדות',
            'הוסף חריגים מתאימים'
          ],
          legalReferences: [
            'סעיף 12 לחוק החוזים',
            'עקרון המידתיות'
          ],
          aiSuggestions: [
            'הגבלת אחריות: הספק אחראי לנזקים ישירים עד סכום החוזה',
            'חריגים: אחריות מלאה על נזקים בשל רשלנות או הפרה מהותית',
            'ביטוח: הספק ירכוש ביטוח אחריות מקצועית'
          ]
        },
        {
          id: 'service_medium_3',
          question: 'Find possible negotiation points in case of dispute',
          hebrewQuestion: 'מצא נקודות אפשריות למו״מ בעת סכסוך',
          category: 'Negotiation',
          hints: [
            'זיהוי נקודות חולשה',
            'שקול אינטרסים משותפים',
            'חפש פתרונות יצירתיים'
          ],
          legalReferences: [
            'עקרון תום הלב',
            'חוק הבוררות'
          ],
          aiSuggestions: [
            'נקודות מיקוח: זמני תגובה, רמות שירות, פיצוי',
            'פתרונות: הארכת תקופה, שיפור תנאים, פיצוי חלקי',
            'מנגנון: בוררות מהירה או גישור'
          ]
        }
      ],
      Hard: [
        {
          id: 'service_hard_1',
          question: 'Analyze situation where service is stopped mid-way and present legal solution',
          hebrewQuestion: 'נתח מצב שבו השירות נפסק באמצע והצג פתרון משפטי',
          category: 'Service Interruption',
          hints: [
            'בדוק סיבות להפסקת שירות',
            'חפש זכויות הלקוח',
            'שקול מנגנוני פיצוי'
          ],
          legalReferences: [
            'חוק החוזים',
            'חוק הגנת הצרכן',
            'עקרון תום הלב'
          ],
          aiSuggestions: [
            'הפסקת שירות: רק בשל הפרה מהותית או אי תשלום',
            'זכויות הלקוח: פיצוי בגובה השירות שלא סופק + נזקים',
            'מנגנון חילופי: הספק יספק שירות חלופי או יפצה'
          ],
          scenario: 'הספק הפסיק את השירות באמצע החוזה. הלקוח דורש פיצוי. איך לפתור?'
        },
        {
          id: 'service_hard_2',
          question: 'Compare liability clauses with previous contract and show improvement suggestions',
          hebrewQuestion: 'השווה סעיפי אחריות לחוזה קודם והצג הצעות שיפור',
          category: 'Comparison',
          hints: [
            'השווה סעיפי אחריות',
            'חפש שיפורים אפשריים',
            'שקול ניסוחים מוצלחים'
          ],
          legalReferences: [
            'פסיקת בית המשפט העליון',
            'נוהג מקובל בענף'
          ],
          aiSuggestions: [
            'שיפורים: הוספת הגנות נוספות ללקוח',
            'ניסוח משופר: הגדרת אחריות ברורה ומדידה',
            'מנגנונים: הוספת בוררות ופיצוי מהיר'
          ],
          scenario: 'איך לשפר את סעיפי האחריות בהשוואה לחוזה הקודם?'
        },
        {
          id: 'service_hard_3',
          question: 'Show conflicting clauses with subcontract and suggest solution',
          hebrewQuestion: 'הצג סעיפים סותרים עם חוזה משנה והצע פתרון',
          category: 'Subcontract Conflicts',
          hints: [
            'בדוק סתירות בין חוזים',
            'חפש אחריות כפולה',
            'שקול מנגנון יישוב'
          ],
          legalReferences: [
            'סעיף 25 לחוק החוזים - וודאות החוזה',
            'עקרון תום הלב'
          ],
          aiSuggestions: [
            'יישוב סתירות: הוראות החוזה הראשי גוברות',
            'סעיף הרמוניזציה: כל ההוראות יפורשו יחד',
            'מנגנון בוררות: מחלוקות יוכרעו בבוררות'
          ],
          scenario: 'יש סתירה בין החוזה הראשי לחוזה המשנה. איך לפתור?'
        }
      ]
    }
  },
  NDA: {
    type: 'NDA',
    icon: <SecurityIcon />,
    hebrewName: 'הסכם סודיות',
    description: 'הסכמי שמירת סודיות',
    questions: {
      Easy: [
        {
          id: 'nda_easy_1',
          question: 'Find confidentiality clauses and show risk level',
          hebrewQuestion: 'מצא סעיפי סודיות והצג רמת סיכון',
          category: 'Confidentiality',
          hints: [
            'חפש הגדרת מידע סודי',
            'בדוק תקופת סודיות',
            'חפש הגבלות שימוש'
          ],
          legalReferences: [
            'חוק עוולות מסחריות',
            'פסיקת בית המשפט העליון'
          ],
          aiSuggestions: [
            'הגדרת מידע: מידע עסקי, טכני ופיננסי',
            'תקופת סודיות: 3-5 שנים מסיום הקשר',
            'הגבלות: איסור שימוש או העברה'
          ]
        },
        {
          id: 'nda_easy_2',
          question: 'Mark penalty clauses for breach of confidentiality',
          hebrewQuestion: 'סמן סעיפי קנס על הפרת סודיות',
          category: 'Penalty',
          hints: [
            'חפש מילים כמו "קנס", "פיצוי", "סנקציה"',
            'בדוק אם הפיצוי מוגדר או לא מוגדר',
            'חפש סעיפי אכיפה'
          ],
          legalReferences: [
            'חוק עוולות מסחריות',
            'פסיקת בית המשפט העליון'
          ],
          aiSuggestions: [
            'פיצוי מוגדר: 100,000 ₪ על כל הפרת סודיות',
            'פיצוי לא מוגדר: פיצוי בגובה הנזק בפועל',
            'סנקציות נוספות: צו מניעה ופיצוי מוגדל'
          ]
        }
      ],
      Medium: [
        {
          id: 'nda_medium_1',
          question: 'Improve time limitation clause for confidentiality',
          hebrewQuestion: 'שפר את סעיף ההגבלת זמן על סודיות',
          category: 'Time Limitation',
          hints: [
            'הגדר תקופה סבירה',
            'שקול אופי המידע',
            'הוסף מנגנון הארכה'
          ],
          legalReferences: [
            'עקרון המידתיות',
            'פסיקת בית המשפט העליון'
          ],
          aiSuggestions: [
            'תקופה סבירה: 3 שנים למידע עסקי, 5 שנים למידע טכני',
            'הארכה: אפשרות הארכה לשנה נוספת בהסכמה',
            'הפחתה: הפחתה הדרגתית של הפיצוי'
          ]
        },
        {
          id: 'nda_medium_2',
          question: 'Suggest alternative wording for NDA breach compensation clause',
          hebrewQuestion: 'הצע ניסוח חלופי לסעיף פיצוי על הפרת NDA',
          category: 'Compensation',
          hints: [
            'הגדר פיצוי הוגן',
            'שקול נסיבות הפרה',
            'הוסף חריגים מתאימים'
          ],
          legalReferences: [
            'עקרון המידתיות',
            'חוק החוזים'
          ],
          aiSuggestions: [
            'פיצוי הוגן: 50,000 ₪ או הנזק בפועל, הגבוה מביניהם',
            'חריגים: לא יחול פיצוי אם המידע כבר היה ידוע',
            'הוכחת נזק: הצד התובע יוכיח את הנזק בפועל'
          ]
        }
      ],
      Hard: [
        {
          id: 'nda_hard_1',
          question: 'Analyze situation where one party wants to disclose information and present legal solution',
          hebrewQuestion: 'נתח מצב שבו צד אחד רוצה לחשוף מידע והצג פתרון משפטי',
          category: 'Information Disclosure',
          hints: [
            'בדוק סיבות לחשיפת מידע',
            'חפש חריגים לחובת הסודיות',
            'שקול מנגנוני אישור'
          ],
          legalReferences: [
            'חוק עוולות מסחריות',
            'פסיקת בית המשפט העליון',
            'עקרון המידתיות'
          ],
          aiSuggestions: [
            'חריגים: חשיפה בשל דרישה משפטית או אינטרס ציבורי',
            'אישור: אישור בכתב לפני חשיפה',
            'הגנות: הגנה על מידע רגיש גם לאחר חשיפה'
          ],
          scenario: 'צד אחד רוצה לחשוף מידע בשל דרישה משפטית. איך לפתור?'
        },
        {
          id: 'nda_hard_2',
          question: 'Compare NDA clauses with similar contracts and suggest updated wording',
          hebrewQuestion: 'השווה סעיפי NDA לחוזים דומים והצע ניסוח עדכני',
          category: 'Comparison',
          hints: [
            'השווה סעיפי סודיות',
            'חפש ניסוחים מוצלחים',
            'שקול עדכונים משפטיים'
          ],
          legalReferences: [
            'פסיקת בית המשפט העליון',
            'נוהג מקובל בענף'
          ],
          aiSuggestions: [
            'ניסוח עדכני: הגדרת מידע סודי מדויקת יותר',
            'הגנות נוספות: הגנה על מידע גם לאחר סיום החוזה',
            'מנגנונים: הוספת בוררות מהירה למחלוקות'
          ],
          scenario: 'איך לשפר את סעיפי הסודיות בהשוואה לחוזים דומים?'
        },
        {
          id: 'nda_hard_3',
          question: 'Show how to implement Arbitration clause in case of dispute',
          hebrewQuestion: 'הצג כיצד ליישם סעיף Arbitration במקרה של סכסוך',
          category: 'Arbitration',
          hints: [
            'הגדר מנגנון בוררות',
            'שקול זמני החלטה',
            'חפש בוררים מתאימים'
          ],
          legalReferences: [
            'חוק הבוררות',
            'פסיקת בית המשפט העליון'
          ],
          aiSuggestions: [
            'מנגנון: בוררות מהירה תוך 30 יום',
            'בוררים: בורר מוסמך בתחום המשפט המסחרי',
            'החלטה: החלטה סופית ומחייבת'
          ],
          scenario: 'איך ליישם מנגנון בוררות במקרה של סכסוך על הפרת סודיות?'
        }
      ]
    }
  },
  Procurement: {
    type: 'Procurement',
    icon: <ShoppingCartIcon />,
    hebrewName: 'חוזה רכש',
    description: 'חוזי רכש ואספקה',
    questions: {
      Easy: [
        {
          id: 'procurement_easy_1',
          question: 'Mark payment, termination and liability clauses - what is the risk level?',
          hebrewQuestion: 'סמן סעיפי תשלום, ביטול ואחריות – מה רמת הסיכון?',
          category: 'Risk Assessment',
          hints: [
            'חפש סעיפי תשלום מראש',
            'בדוק תנאי ביטול חד צדדיים',
            'חפש אחריות בלתי מוגבלת'
          ],
          legalReferences: [
            'חוק החוזים',
            'חוק הגנת הצרכן'
          ],
          aiSuggestions: [
            'תשלום: 30% מראש, 40% עם אספקה, 30% עם קבלה',
            'ביטול: הודעה של 14 יום עם פיצוי של 10%',
            'אחריות: מוגבלת לערך החוזה'
          ]
        },
        {
          id: 'procurement_easy_2',
          question: 'Evaluate if dates are clear and protected',
          hebrewQuestion: 'הערך אם התאריכים ברורים ומוגנים',
          category: 'Timing',
          hints: [
            'בדוק תאריכי אספקה',
            'חפש מנגנוני עיכוב',
            'הערך סנקציות על איחור'
          ],
          legalReferences: [
            'חוק החוזים',
            'חוק הגנת הצרכן'
          ],
          aiSuggestions: [
            'תאריכים ברורים: הגדרת תאריכי אספקה מדויקים',
            'מנגנון עיכוב: פיצוי על איחור באספקה',
            'סנקציות: הפחתה של 5% ליום איחור'
          ]
        }
      ],
      Medium: [
        {
          id: 'procurement_medium_1',
          question: 'Improve payment clause to legally protect both parties',
          hebrewQuestion: 'שפר את סעיף התשלום כדי להגן משפטית על שני הצדדים',
          category: 'Payment',
          hints: [
            'הגדר לוחות זמנים מדויקים',
            'הוסף מנגנון אימות אספקה',
            'הגדר סנקציות על איחור'
          ],
          legalReferences: [
            'סעיף 4 לחוק החוזים',
            'חוק הגנת הצרכן'
          ],
          aiSuggestions: [
            'תשלום: 30% מראש, 40% עם אספקה (עם אישור קבלה), 30% תוך 30 יום מהקבלה',
            'אימות: קבלה תינתן תוך 7 ימים מאספקה, אחרת ייחשב כאושר',
            'איחור: ריבית של 3% לחודש על סכום שלא שולם במועד'
          ]
        },
        {
          id: 'procurement_medium_2',
          question: 'Find Force Majeure clause and suggest clearer wording',
          hebrewQuestion: 'מצא סעיף Force Majeure והצע ניסוח ברור יותר',
          category: 'Force Majeure',
          hints: [
            'הגדר אירועי Force Majeure',
            'שקול הוראות הודעה',
            'חפש מנגנוני פיצוי'
          ],
          legalReferences: [
            'סעיף 18 לחוק החוזים',
            'פסיקת בית המשפט העליון'
          ],
          aiSuggestions: [
            'הגדרה ברורה: אסונות טבע, שביתות, מלחמה, אך לא קשיים כלכליים',
            'הודעה: הודעה בכתב תוך 7 ימים מהאירוע',
            'פיצוי: אי עמידה לא תביא לפיצוי, אך הצדדים ישתפו פעולה'
          ]
        }
      ],
      Hard: [
        {
          id: 'procurement_hard_1',
          question: 'Analyze supply delay situation and suggest legal solution',
          hebrewQuestion: 'נתח סיטואציה של עיכוב אספקה והצע פתרון משפטי',
          category: 'Supply Delay',
          hints: [
            'בדוק סיבות לעיכוב',
            'חפש זכויות הקונה',
            'שקול מנגנוני פיצוי'
          ],
          legalReferences: [
            'חוק החוזים',
            'חוק הגנת הצרכן',
            'עקרון תום הלב'
          ],
          aiSuggestions: [
            'עיכוב: פיצוי של 5% ליום איחור מעל 7 ימים',
            'זכויות הקונה: ביטול החוזה או דרישת פיצוי',
            'מנגנון: הודעה מוקדמת על עיכוב צפוי'
          ],
          scenario: 'הספק מאחר באספקה ב-30 יום. הקונה דורש פיצוי. איך לפתור?'
        },
        {
          id: 'procurement_hard_2',
          question: 'Compare critical clauses with previous contracts and show AI recommendations',
          hebrewQuestion: 'השווה סעיפים קריטיים מול חוזים קודמים והצג המלצות AI',
          category: 'Comparison',
          hints: [
            'השווה סעיפים קריטיים',
            'חפש שיפורים אפשריים',
            'שקול המלצות AI'
          ],
          legalReferences: [
            'פסיקת בית המשפט העליון',
            'נוהג מקובל בענף'
          ],
          aiSuggestions: [
            'שיפורים: הוספת הגנות נוספות לקונה',
            'ניסוח משופר: הגדרת אחריות ברורה ומדידה',
            'מנגנונים: הוספת בוררות ופיצוי מהיר'
          ],
          scenario: 'איך לשפר את החוזה בהשוואה לחוזים קודמים?'
        },
        {
          id: 'procurement_hard_3',
          question: 'Show alternative version for risk management with multiple suppliers',
          hebrewQuestion: 'הצג גרסה חלופית לניהול סיכונים בספקים מרובים',
          category: 'Risk Management',
          hints: [
            'שקול פיזור סיכונים',
            'חפש מנגנוני גיבוי',
            'הגדר אחריות ברורה'
          ],
          legalReferences: [
            'חוק החוזים',
            'עקרון תום הלב'
          ],
          aiSuggestions: [
            'פיזור: חלוקת הזמנות בין מספר ספקים',
            'גיבוי: ספק גיבוי לכל הזמנה חשובה',
            'אחריות: הגדרת אחריות ברורה לכל ספק'
          ],
          scenario: 'איך לנהל סיכונים בעבודה עם מספר ספקים?'
        }
      ]
    }
  },
  JV: {
    type: 'JV',
    icon: <HandshakeIcon />,
    hebrewName: 'הסכם שותפות',
    description: 'הסכמי שותפות ומיזוגים',
    questions: {
      Easy: [
        {
          id: 'jv_easy_1',
          question: 'Mark commitment and liability clauses between parties',
          hebrewQuestion: 'סמן סעיפי התחייבות ואחריות בין הצדדים',
          category: 'Commitment',
          hints: [
            'חפש סעיפי השקעה כספית',
            'בדוק התחייבויות תפעוליות',
            'חפש סעיפי אחריות אישית'
          ],
          legalReferences: [
            'פקודת השותפויות',
            'חוק החברות'
          ],
          aiSuggestions: [
            'השקעה: כל שותף מתחייב להשקיע 500,000 ₪ תוך 30 יום',
            'אחריות: אחריות אישית של כל שותף עד סכום השקעתו',
            'מנגנון אכיפה: צו מניעה ופיצוי על אי עמידה'
          ]
        },
        {
          id: 'jv_easy_2',
          question: 'Note exit or partnership dissolution clauses',
          hebrewQuestion: 'ציין סעיפי יציאה או פירוק השותפות',
          category: 'Exit',
          hints: [
            'חפש סעיפי יציאה',
            'בדוק תנאי פירוק',
            'חפש מנגנוני העברת זכויות'
          ],
          legalReferences: [
            'פקודת השותפויות',
            'חוק החברות'
          ],
          aiSuggestions: [
            'יציאה: הודעה של 90 יום לפני יציאה',
            'פירוק: הערכת שווי על ידי שמאי מוסמך',
            'העברת זכויות: אישור של כל השותפים'
          ]
        }
      ],
      Medium: [
        {
          id: 'jv_medium_1',
          question: 'Improve exit clauses to prevent future disputes',
          hebrewQuestion: 'שפר סעיפי יציאה כדי למנוע סכסוכים עתידיים',
          category: 'Exit',
          hints: [
            'הגדר מנגנון הערכת שווי',
            'הוסף תקופת מעבר',
            'הגדר חלוקת נכסים'
          ],
          legalReferences: [
            'פקודת השותפויות',
            'חוק החברות'
          ],
          aiSuggestions: [
            'הערכת שווי: שווי השותפות יוערך על ידי שמאי מוסמך',
            'תקופת מעבר: 90 יום להעברת נכסים וסיום התחייבויות',
            'חלוקה: חלוקה שווה של נכסים וחובות, עם מנגנון בוררות למחלוקות'
          ]
        },
        {
          id: 'jv_medium_2',
          question: 'Suggest alternative wording for sensitive financial clauses',
          hebrewQuestion: 'הצע ניסוח חלופי לסעיפים פיננסיים רגישים',
          category: 'Financial',
          hints: [
            'הגדר חלוקת רווחים',
            'שקול מנגנוני השקעה',
            'חפש הגנות פיננסיות'
          ],
          legalReferences: [
            'פקודת השותפויות',
            'חוק החברות'
          ],
          aiSuggestions: [
            'חלוקת רווחים: חלוקה שווה או לפי אחוזי בעלות',
            'השקעות: אישור של 75% מהשותפים להשקעות גדולות',
            'הגנות: הגבלת הוצאות אישיות ופיקוח על תזרים'
          ]
        }
      ],
      Hard: [
        {
          id: 'jv_hard_1',
          question: 'Analyze disagreement situation and improve decision-making mechanism',
          hebrewQuestion: 'נתח סיטואציה של חילוקי דעות ושפר את מנגנון ההחלטות',
          category: 'Decision Making',
          hints: [
            'בדוק מנגנוני קבלת החלטות',
            'חפש נקודות חולשה',
            'שקול שיפורים אפשריים'
          ],
          legalReferences: [
            'פקודת השותפויות',
            'חוק הבוררות'
          ],
          aiSuggestions: [
            'מנגנון: החלטות חשובות דורשות הסכמה של 75% מהשותפים',
            'בוררות: כל מחלוקת תוכרע בבוררות מחייבת',
            'העברת זכויות: העברה דורשת אישור של כל השותפים'
          ],
          scenario: 'יש חילוקי דעות על השקעה גדולה. איך לפתור?'
        },
        {
          id: 'jv_hard_2',
          question: 'Compare clauses with previous JV contracts and suggest improved version',
          hebrewQuestion: 'השווה סעיפים מול חוזי JV קודמים והצע גרסה משופרת',
          category: 'Comparison',
          hints: [
            'השווה סעיפים קריטיים',
            'חפש שיפורים אפשריים',
            'שקול ניסוחים מוצלחים'
          ],
          legalReferences: [
            'פסיקת בית המשפט העליון',
            'נוהג מקובל בענף'
          ],
          aiSuggestions: [
            'שיפורים: הוספת הגנות נוספות לכל השותפים',
            'ניסוח משופר: הגדרת אחריות ברורה ומדידה',
            'מנגנונים: הוספת בוררות ופיצוי מהיר'
          ],
          scenario: 'איך לשפר את החוזה בהשוואה לחוזי JV קודמים?'
        },
        {
          id: 'jv_hard_3',
          question: 'Show complete risk report with AI recommendations',
          hebrewQuestion: 'הצג דוח סיכונים מלא עם המלצות AI',
          category: 'Risk Report',
          hints: [
            'זיהוי סיכונים',
            'הערכת סיכונים',
            'המלצות להפחתת סיכונים'
          ],
          legalReferences: [
            'פקודת השותפויות',
            'חוק החברות',
            'נוהג מקובל בענף'
          ],
          aiSuggestions: [
            'סיכונים: זיהוי סיכונים פיננסיים, תפעוליים ומשפטיים',
            'הערכה: דירוג סיכונים לפי חומרה וסבירות',
            'המלצות: אסטרטגיות להפחתת סיכונים'
          ],
          scenario: 'איך להכין דוח סיכונים מלא לחוזה השותפות?'
        }
      ]
    }
  }
};

export const ContractFlowMap: React.FC = () => {
  const { t } = useTranslation();
  const [selectedContract, setSelectedContract] = useState<ContractType | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | null>(null);
  const [selectedUserType, setSelectedUserType] = useState<UserType | null>(null);
  const [showHints, setShowHints] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [uploadedContract, setUploadedContract] = useState<string>('');

  const userTypes: UserType[] = ['Lawyer', 'Student', 'Lecturer'];
  const difficulties: Difficulty[] = ['Easy', 'Medium', 'Hard'];

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setSelectedContract(null);
    setSelectedDifficulty(null);
    setSelectedUserType(null);
    setShowHints(false);
    setActiveStep(0);
    setUploadedContract('');
  };

  const steps = [
    {
      label: t('flow.uploadContract'),
      description: t('flow.uploadContractDesc'),
      icon: <UploadIcon />
    },
    {
      label: t('flow.aiAnalysis'),
      description: t('flow.aiAnalysisDesc'),
      icon: <AnalyticsIcon />
    },
    {
      label: t('flow.selectType'),
      description: t('flow.selectTypeDesc'),
      icon: <BusinessIcon />
    },
    {
      label: t('flow.selectUser'),
      description: t('flow.selectUserDesc'),
      icon: <SchoolIcon />
    },
    {
      label: t('flow.selectDifficulty'),
      description: t('flow.selectDifficultyDesc'),
      icon: <GavelIcon />
    },
    {
      label: t('flow.practice'),
      description: t('flow.practiceDesc'),
      icon: <LightbulbIcon />
    }
  ];

  return (
    <Box sx={{ p: 4, maxWidth: 1200, mx: 'auto' }}>
      <Typography variant="h4" gutterBottom align="center">
        ContractLab Pro – Interactive Learning Flow
      </Typography>
      <Typography variant="subtitle1" gutterBottom align="center" color="text.secondary">
        מערכת למידה אינטראקטיבית לחוזים עם AI
      </Typography>

      <Paper sx={{ p: 3, mt: 3 }}>
        <Stepper activeStep={activeStep} orientation="vertical">
          {steps.map((step, index) => (
            <Step key={step.label}>
              <StepLabel
                icon={step.icon}
                optional={index === steps.length - 1 ? (
                  <Typography variant="caption">Optional</Typography>
                ) : null}
              >
                {step.label}
              </StepLabel>
              <StepContent>
                <Typography>{step.description}</Typography>
                <Box sx={{ mb: 2 }}>
                  <div>
                    <Button
                      variant="contained"
                      onClick={handleNext}
                      sx={{ mt: 1, mr: 1 }}
                    >
                      {index === steps.length - 1 ? 'Finish' : 'Continue'}
                    </Button>
                    <Button
                      disabled={index === 0}
                      onClick={handleBack}
                      sx={{ mt: 1, mr: 1 }}
                    >
                      Back
                    </Button>
                  </div>
                </Box>
              </StepContent>
            </Step>
          ))}
        </Stepper>
      </Paper>

      {/* Contract Type Selection */}
      {activeStep >= 2 && !selectedContract && (
        <Paper sx={{ p: 3, mt: 3 }}>
          <Typography variant="h6" gutterBottom>
            {t('flow.selectContractType')}
          </Typography>
          <Grid container spacing={2}>
            {Object.values(contractFlowData).map((contract) => (
              <Grid item xs={12} sm={6} md={4} key={contract.type}>
                <Card 
                  sx={{ 
                    cursor: 'pointer',
                    '&:hover': { boxShadow: 3 }
                  }}
                  onClick={() => setSelectedContract(contract.type)}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      {contract.icon}
                      <Typography variant="h6" sx={{ ml: 1 }}>
                        {contract.hebrewName}
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      {contract.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Paper>
      )}

      {/* User Type Selection */}
      {selectedContract && activeStep >= 3 && !selectedUserType && (
        <Paper sx={{ p: 3, mt: 3 }}>
          <Typography variant="h6" gutterBottom>
            {t('flow.selectUserType')}
          </Typography>
          <Grid container spacing={2}>
            {userTypes.map((userType) => (
              <Grid item xs={12} sm={4} key={userType}>
                <Card 
                  sx={{ 
                    cursor: 'pointer',
                    '&:hover': { boxShadow: 3 }
                  }}
                  onClick={() => setSelectedUserType(userType)}
                >
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {userType}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {userType === 'Lawyer' && 'עורך דין מקצועי'}
                      {userType === 'Student' && 'סטודנט למשפטים'}
                      {userType === 'Lecturer' && 'מרצה או מדריך'}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Paper>
      )}

      {/* Difficulty Selection */}
      {selectedContract && selectedUserType && activeStep >= 4 && !selectedDifficulty && (
        <Paper sx={{ p: 3, mt: 3 }}>
          <Typography variant="h6" gutterBottom>
            {t('flow.selectDifficulty')}
          </Typography>
          <Grid container spacing={2}>
            {difficulties.map((difficulty) => (
              <Grid item xs={12} sm={4} key={difficulty}>
                <Card 
                  sx={{ 
                    cursor: 'pointer',
                    '&:hover': { boxShadow: 3 }
                  }}
                  onClick={() => setSelectedDifficulty(difficulty)}
                >
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {difficulty}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {difficulty === 'Easy' && 'זיהוי סעיפים בסיסי'}
                      {difficulty === 'Medium' && 'ניסוח חלופי וניתוח'}
                      {difficulty === 'Hard' && 'פתרון בעיות מורכבות'}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Paper>
      )}

      {/* Practice Questions */}
      {selectedContract && selectedUserType && selectedDifficulty && activeStep >= 5 && (
        <Paper sx={{ p: 3, mt: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">
              {t('flow.practiceQuestions')}
            </Typography>
            <Button onClick={handleReset} startIcon={<ArrowBackIcon />}>
              {t('flow.startOver')}
            </Button>
          </Box>

          <Alert severity="info" sx={{ mb: 2 }}>
            <Typography variant="body2">
              <strong>{contractFlowData[selectedContract].hebrewName}</strong> | 
              <strong> {selectedUserType}</strong> | 
              <strong> {selectedDifficulty}</strong>
            </Typography>
          </Alert>

          {contractFlowData[selectedContract].questions[selectedDifficulty].map((question, index) => (
            <Card key={question.id} sx={{ mb: 2 }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Chip 
                    label={question.category} 
                    color="primary" 
                    size="small" 
                    sx={{ mr: 2 }}
                  />
                  <Typography variant="h6">
                    {t('flow.question')} {index + 1}
                  </Typography>
                </Box>

                <Typography variant="body1" sx={{ mb: 2 }}>
                  {question.hebrewQuestion}
                </Typography>

                {question.scenario && (
                  <Alert severity="warning" sx={{ mb: 2 }}>
                    <Typography variant="body2">
                      <strong>{t('flow.scenario')}:</strong> {question.scenario}
                    </Typography>
                  </Alert>
                )}

                <Button 
                  onClick={() => setShowHints(!showHints)}
                  startIcon={showHints ? <InfoIcon /> : <LightbulbIcon />}
                  variant="outlined"
                  sx={{ mb: 2 }}
                >
                  {showHints ? t('flow.hideHints') : t('flow.showHints')}
                </Button>

                <Collapse in={showHints}>
                  <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                    <Typography variant="h6" gutterBottom>
                      {t('flow.hints')}:
                    </Typography>
                    <ul>
                      {question.hints.map((hint, i) => (
                        <li key={i}>
                          <Typography variant="body2">{hint}</Typography>
                        </li>
                      ))}
                    </ul>

                    <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                      {t('flow.legalReferences')}:
                    </Typography>
                    <ul>
                      {question.legalReferences.map((ref, i) => (
                        <li key={i}>
                          <Typography variant="body2">{ref}</Typography>
                        </li>
                      ))}
                    </ul>

                    <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                      {t('flow.aiSuggestions')}:
                    </Typography>
                    <ul>
                      {question.aiSuggestions.map((suggestion, i) => (
                        <li key={i}>
                          <Typography variant="body2">{suggestion}</Typography>
                        </li>
                      ))}
                    </ul>
                  </Box>
                </Collapse>

                <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                  <Button variant="contained" startIcon={<CheckCircleIcon />}>
                    {t('flow.markComplete')}
                  </Button>
                  <Button variant="outlined" startIcon={<DownloadIcon />}>
                    {t('flow.exportReport')}
                  </Button>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Paper>
      )}
    </Box>
  );
};

export default ContractFlowMap;
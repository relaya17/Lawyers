import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

const resources = {
  he: {
    common: {
      "app": {
        "title": "ContractLab Pro",
        "subtitle": "פלטפורמה מתקדמת לניהול חוזים ולמידה משפטית",
        "loading": "טוען...",
        "error": "שגיאה",
        "success": "הצלחה",
        "cancel": "ביטול",
        "save": "שמור",
        "delete": "מחק",
        "edit": "ערוך",
        "add": "הוסף",
        "search": "חיפוש",
        "filter": "סינון",
        "sort": "מיון",
        "refresh": "רענן",
        "back": "חזור",
        "next": "הבא",
        "previous": "קודם",
        "close": "סגור",
        "confirm": "אישור",
        "yes": "כן",
        "no": "לא",
        "learnMore": "למידע נוסף"
      },
      "navigation": {
        "home": "בית",
        "contracts": "חוזים",
        "cases": "תיקים",
        "simulator": "מעבדה",
        "riskAnalysis": "ניתוח סיכון",
        "regulatoryCompliance": "ציות רגולטורי",
        "workflowAutomation": "אוטומציה",
        "negotiation": "מו״מ",
        "marketplace": "שוק",
        "settings": "הגדרות",
        "profile": "פרופיל",
        "logout": "התנתק"
      },
      "auth": {
        "login": "התחברות",
        "register": "הרשמה",
        "logout": "התנתקות",
        "email": "אימייל",
        "password": "סיסמה",
        "confirmPassword": "אימות סיסמה",
        "forgotPassword": "שכחתי סיסמה",
        "resetPassword": "איפוס סיסמה",
        "firstName": "שם פרטי",
        "lastName": "שם משפחה",
        "phone": "טלפון",
        "role": "תפקיד",
        "student": "סטודנט/ית",
        "lawyer": "עורך/ת דין",
        "lecturer": "מרצה",
        "admin": "מנהל/ת"
      },
      "contracts": {
        "title": "חוזים",
        "newContract": "חוזה חדש",
        "uploadContract": "העלאת חוזה",
        "contractName": "שם החוזה",
        "contractType": "סוג חוזה",
        "parties": "צדדים",
        "startDate": "תאריך התחלה",
        "endDate": "תאריך סיום",
        "status": "סטטוס",
        "draft": "טיוטה",
        "active": "פעיל",
        "expired": "פג תוקף",
        "terminated": "בוטל",
        "riskScore": "דירוג סיכון",
        "analysis": "ניתוח",
        "export": "ייצוא",
        "share": "שיתוף",
        "description": "ניהול חוזים מתקדם"
      },
      "simulator": {
        "title": "מעבדה חוזית",
        "scenario": "תרחיש",
        "startSimulation": "התחל סימולציה",
        "pauseSimulation": "השהה סימולציה",
        "resetSimulation": "אפס סימולציה",
        "difficulty": "רמת קושי",
        "easy": "קל",
        "medium": "בינוני",
        "hard": "קשה",
        "score": "ציון",
        "feedback": "משוב",
        "solution": "פתרון",
        "hint": "רמז",
        "description": "סימולציות אינטראקטיביות"
      },
      "riskAnalysis": {
        "title": "ניתוח סיכון",
        "riskLevel": "רמת סיכון",
        "low": "נמוך",
        "medium": "בינוני",
        "high": "גבוה",
        "critical": "קריטי",
        "riskFactors": "גורמי סיכון",
        "recommendations": "המלצות",
        "mitigation": "הפחתת סיכון",
        "compliance": "עמידה בדרישות",
        "legal": "משפטי",
        "financial": "כלכלי",
        "operational": "תפעולי",
        "description": "ניתוח סיכונים מתקדם"
      },
      "negotiation": {
        "title": "מו״מ חכם",
        "startNegotiation": "התחל מו״מ",
        "counterOffer": "הצעה נגדית",
        "accept": "קבל",
        "reject": "דחה",
        "propose": "הצע",
        "deadline": "מועד אחרון",
        "concessions": "ויתורים",
        "objectives": "מטרות",
        "strategy": "אסטרטגיה",
        "description": "כלים למו״מ חוזי"
      },
      "marketplace": {
        "title": "שוק תבניות",
        "description": "ספריית תבניות חוזים"
      },
      "settings": {
        "title": "הגדרות",
        "language": "שפה",
        "theme": "ערכת נושא",
        "light": "בהיר",
        "dark": "כהה",
        "notifications": "התראות",
        "privacy": "פרטיות",
        "security": "אבטחה",
        "account": "חשבון",
        "preferences": "העדפות"
      },
      "privacy": {
        "title": "מדיניות פרטיות",
        "cookies": "עוגיות",
        "consent": "הסכמה",
        "accept": "מאשר/ת",
        "reject": "דוחה",
        "learnMore": "למידע נוסף",
        "dataUsage": "שימוש בנתונים",
        "dataRetention": "שמירת נתונים",
        "dataSharing": "שיתוף נתונים",
        "userRights": "זכויות משתמש/ת"
      },
      "errors": {
        "general": "אירעה שגיאה",
        "network": "שגיאת רשת",
        "unauthorized": "אין הרשאה",
        "forbidden": "גישה נדחתה",
        "notFound": "לא נמצא",
        "validation": "שגיאת אימות",
        "server": "שגיאת שרת",
        "timeout": "פג תוקף בקשה"
      },
      "validation": {
        "required": "שדה זה הוא חובה",
        "email": "כתובת אימייל לא תקינה",
        "minLength": "מינימום {{min}} תווים",
        "maxLength": "מקסימום {{max}} תווים",
        "passwordMatch": "הסיסמאות אינן תואמות",
        "phone": "מספר טלפון לא תקין"
      },
      "features": {
        "primary": "חוזים",
        "secondary": "מעבדה",
        "error": "סיכון",
        "success": "מו״מ",
        "warning": "שוק",
        "info": "אבטחה"
      },
      "home": {
        "stats": {
          "title": "סטטיסטיקות",
          "contracts": "חוזים",
          "users": "משתמשים",
          "uptime": "זמינות",
          "support": "תמיכה"
        }
      }
    },
  },
  en: {
    common: {
      "app": {
        "title": "ContractLab Pro",
        "subtitle": "Advanced Contract Management and Legal Learning Platform",
        "loading": "Loading...",
        "error": "Error",
        "success": "Success",
        "cancel": "Cancel",
        "save": "Save",
        "delete": "Delete",
        "edit": "Edit",
        "add": "Add",
        "search": "Search",
        "filter": "Filter",
        "sort": "Sort",
        "refresh": "Refresh",
        "back": "Back",
        "next": "Next",
        "previous": "Previous",
        "close": "Close",
        "confirm": "Confirm",
        "yes": "Yes",
        "no": "No",
        "learnMore": "Learn More"
      },
      "navigation": {
        "home": "Home",
        "contracts": "Contracts",
        "cases": "Cases",
        "simulator": "Simulator",
        "riskAnalysis": "Risk Analysis",
        "negotiation": "Negotiation",
        "marketplace": "Marketplace",
        "settings": "Settings",
        "profile": "Profile",
        "logout": "Logout"
      },
      "auth": {
        "login": "Login",
        "register": "Register",
        "logout": "Logout",
        "email": "Email",
        "password": "Password",
        "confirmPassword": "Confirm Password",
        "forgotPassword": "Forgot Password",
        "resetPassword": "Reset Password",
        "firstName": "First Name",
        "lastName": "Last Name",
        "phone": "Phone",
        "role": "Role",
        "student": "Student",
        "lawyer": "Lawyer",
        "lecturer": "Lecturer",
        "admin": "Admin"
      },
      "contracts": {
        "title": "Contracts",
        "newContract": "New Contract",
        "uploadContract": "Upload Contract",
        "contractName": "Contract Name",
        "contractType": "Contract Type",
        "parties": "Parties",
        "startDate": "Start Date",
        "endDate": "End Date",
        "status": "Status",
        "draft": "Draft",
        "active": "Active",
        "expired": "Expired",
        "terminated": "Terminated",
        "riskScore": "Risk Score",
        "analysis": "Analysis",
        "export": "Export",
        "share": "Share",
        "description": "Advanced contract management"
      },
      "simulator": {
        "title": "Contract Simulator",
        "scenario": "Scenario",
        "startSimulation": "Start Simulation",
        "pauseSimulation": "Pause Simulation",
        "resetSimulation": "Reset Simulation",
        "difficulty": "Difficulty",
        "easy": "Easy",
        "medium": "Medium",
        "hard": "Hard",
        "score": "Score",
        "feedback": "Feedback",
        "solution": "Solution",
        "hint": "Hint",
        "description": "Interactive simulations"
      },
      "riskAnalysis": {
        "title": "Risk Analysis",
        "riskLevel": "Risk Level",
        "low": "Low",
        "medium": "Medium",
        "high": "High",
        "critical": "Critical",
        "riskFactors": "Risk Factors",
        "recommendations": "Recommendations",
        "mitigation": "Risk Mitigation",
        "compliance": "Compliance",
        "legal": "Legal",
        "financial": "Financial",
        "operational": "Operational",
        "description": "Advanced risk analysis"
      },
      "negotiation": {
        "title": "Smart Negotiation",
        "startNegotiation": "Start Negotiation",
        "counterOffer": "Counter Offer",
        "accept": "Accept",
        "reject": "Reject",
        "propose": "Propose",
        "deadline": "Deadline",
        "concessions": "Concessions",
        "objectives": "Objectives",
        "strategy": "Strategy",
        "description": "Contract negotiation tools"
      },
      "marketplace": {
        "title": "Marketplace",
        "description": "Contract template library"
      },
      "settings": {
        "title": "Settings",
        "language": "Language",
        "theme": "Theme",
        "light": "Light",
        "dark": "Dark",
        "notifications": "Notifications",
        "privacy": "Privacy",
        "security": "Security",
        "account": "Account",
        "preferences": "Preferences"
      },
      "privacy": {
        "title": "Privacy Policy",
        "cookies": "Cookies",
        "consent": "Consent",
        "accept": "Accept",
        "reject": "Reject",
        "learnMore": "Learn More",
        "dataUsage": "Data Usage",
        "dataRetention": "Data Retention",
        "dataSharing": "Data Sharing",
        "userRights": "User Rights"
      },
      "errors": {
        "general": "An error occurred",
        "network": "Network error",
        "unauthorized": "Unauthorized",
        "forbidden": "Access denied",
        "notFound": "Not found",
        "validation": "Validation error",
        "server": "Server error",
        "timeout": "Request timeout"
      },
      "validation": {
        "required": "This field is required",
        "email": "Invalid email address",
        "minLength": "Minimum {{min}} characters",
        "maxLength": "Maximum {{max}} characters",
        "passwordMatch": "Passwords do not match",
        "phone": "Invalid phone number"
      },
      "features": {
        "primary": "Contracts",
        "secondary": "Simulator",
        "error": "Risk",
        "success": "Negotiation",
        "warning": "Marketplace",
        "info": "Security"
      },
      "home": {
        "stats": {
          "title": "Statistics",
          "contracts": "Contracts",
          "users": "Users",
          "uptime": "Uptime",
          "support": "Support"
        }
      }
    },
  },
  ar: {
    common: {
      "app": {
        "title": "ContractLab Pro",
        "subtitle": "منصة متقدمة لإدارة العقود والتعلم القانوني",
        "loading": "جاري التحميل...",
        "error": "خطأ",
        "success": "نجح",
        "cancel": "إلغاء",
        "save": "حفظ",
        "delete": "حذف",
        "edit": "تعديل",
        "add": "إضافة",
        "search": "بحث",
        "filter": "تصفية",
        "sort": "ترتيب",
        "refresh": "تحديث",
        "back": "رجوع",
        "next": "التالي",
        "previous": "السابق",
        "close": "إغلاق",
        "confirm": "تأكيد",
        "yes": "نعم",
        "no": "لا",
        "learnMore": "اعرف المزيد"
      },
      "navigation": {
        "home": "الرئيسية",
        "contracts": "العقود",
        "cases": "القضايا",
        "simulator": "المحاكي",
        "riskAnalysis": "تحليل المخاطر",
        "negotiation": "المفاوضات",
        "marketplace": "السوق",
        "settings": "الإعدادات",
        "profile": "الملف الشخصي",
        "logout": "تسجيل الخروج"
      },
      "auth": {
        "login": "تسجيل الدخول",
        "register": "التسجيل",
        "logout": "تسجيل الخروج",
        "email": "البريد الإلكتروني",
        "password": "كلمة المرور",
        "confirmPassword": "تأكيد كلمة المرور",
        "forgotPassword": "نسيت كلمة المرور",
        "resetPassword": "إعادة تعيين كلمة المرور",
        "firstName": "الاسم الأول",
        "lastName": "اسم العائلة",
        "phone": "الهاتف",
        "role": "الدور",
        "student": "طالب",
        "lawyer": "محامي",
        "lecturer": "محاضر",
        "admin": "مدير"
      },
      "contracts": {
        "title": "العقود",
        "newContract": "عقد جديد",
        "uploadContract": "رفع عقد",
        "contractName": "اسم العقد",
        "contractType": "نوع العقد",
        "parties": "الأطراف",
        "startDate": "تاريخ البداية",
        "endDate": "تاريخ الانتهاء",
        "status": "الحالة",
        "draft": "مسودة",
        "active": "نشط",
        "expired": "منتهي الصلاحية",
        "terminated": "ملغي",
        "riskScore": "درجة المخاطر",
        "analysis": "تحليل",
        "export": "تصدير",
        "share": "مشاركة",
        "description": "إدارة عقود متقدمة"
      },
      "simulator": {
        "title": "محاكي العقود",
        "scenario": "سيناريو",
        "startSimulation": "بدء المحاكاة",
        "pauseSimulation": "إيقاف المحاكاة مؤقتاً",
        "resetSimulation": "إعادة تعيين المحاكاة",
        "difficulty": "مستوى الصعوبة",
        "easy": "سهل",
        "medium": "متوسط",
        "hard": "صعب",
        "score": "النتيجة",
        "feedback": "التعليقات",
        "solution": "الحل",
        "hint": "تلميح",
        "description": "محاكيات تفاعلية"
      },
      "riskAnalysis": {
        "title": "تحليل المخاطر",
        "riskLevel": "مستوى المخاطر",
        "low": "منخفض",
        "medium": "متوسط",
        "high": "عالي",
        "critical": "حرج",
        "riskFactors": "عوامل المخاطر",
        "recommendations": "التوصيات",
        "mitigation": "تخفيف المخاطر",
        "compliance": "الامتثال",
        "legal": "قانوني",
        "financial": "مالي",
        "operational": "تشغيلي",
        "description": "تحليل مخاطر متقدم"
      },
      "negotiation": {
        "title": "المفاوضات الذكية",
        "startNegotiation": "بدء المفاوضات",
        "counterOffer": "عرض مضاد",
        "accept": "قبول",
        "reject": "رفض",
        "propose": "اقتراح",
        "deadline": "الموعد النهائي",
        "concessions": "التنازلات",
        "objectives": "الأهداف",
        "strategy": "الاستراتيجية",
        "description": "أدوات مفاوضات العقود"
      },
      "marketplace": {
        "title": "السوق",
        "description": "مكتبة قوالب العقود"
      },
      "settings": {
        "title": "الإعدادات",
        "language": "اللغة",
        "theme": "المظهر",
        "light": "فاتح",
        "dark": "داكن",
        "notifications": "الإشعارات",
        "privacy": "الخصوصية",
        "security": "الأمان",
        "account": "الحساب",
        "preferences": "التفضيلات"
      },
      "privacy": {
        "title": "سياسة الخصوصية",
        "cookies": "ملفات تعريف الارتباط",
        "consent": "الموافقة",
        "accept": "أوافق",
        "reject": "أرفض",
        "learnMore": "اعرف المزيد",
        "dataUsage": "استخدام البيانات",
        "dataRetention": "احتفاظ البيانات",
        "dataSharing": "مشاركة البيانات",
        "userRights": "حقوق المستخدم"
      },
      "errors": {
        "general": "حدث خطأ",
        "network": "خطأ في الشبكة",
        "unauthorized": "غير مصرح",
        "forbidden": "تم رفض الوصول",
        "notFound": "غير موجود",
        "validation": "خطأ في التحقق",
        "server": "خطأ في الخادم",
        "timeout": "انتهت مهلة الطلب"
      },
      "validation": {
        "required": "هذا الحقل مطلوب",
        "email": "عنوان البريد الإلكتروني غير صحيح",
        "minLength": "الحد الأدنى {{min}} أحرف",
        "maxLength": "الحد الأقصى {{max}} أحرف",
        "passwordMatch": "كلمات المرور غير متطابقة",
        "phone": "رقم الهاتف غير صحيح"
      },
      "features": {
        "primary": "العقود",
        "secondary": "المحاكي",
        "error": "المخاطر",
        "success": "المفاوضات",
        "warning": "السوق",
        "info": "الأمان"
      },
      "home": {
        "stats": {
          "title": "الإحصائيات",
          "contracts": "العقود",
          "users": "المستخدمين",
          "uptime": "وقت التشغيل",
          "support": "الدعم"
        }
      }
    },
  },
}

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'he',
    debug: process.env.NODE_ENV === 'development',

    interpolation: {
      escapeValue: false, // React כבר מספק XSS protection
    },

    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
    },

    ns: ['common'],
    defaultNS: 'common',

    react: {
      useSuspense: false,
    },
  })

export default i18n

// פונקציה לקביעת כיוון השפה
export const getDirection = (language: string): 'ltr' | 'rtl' => {
  const rtlLanguages = ['he', 'ar', 'fa', 'ur']
  return rtlLanguages.includes(language) ? 'rtl' : 'ltr'
}

// פונקציה להחלפת שפה
export const changeLanguage = async (language: string) => {
  await i18n.changeLanguage(language)
  document.documentElement.lang = language
  document.documentElement.dir = getDirection(language)

  // שמירת השפה ב-localStorage
  localStorage.setItem('i18nextLng', language)
}

// Backward-compatible alias
export const setLanguage = changeLanguage

// פונקציה לקבלת השפה הנוכחית
export const getCurrentLanguage = (): string => {
  return i18n.language || 'he'
}

// פונקציה לקבלת כיוון השפה הנוכחית
export const getCurrentDirection = (): 'ltr' | 'rtl' => {
  return getDirection(getCurrentLanguage())
}

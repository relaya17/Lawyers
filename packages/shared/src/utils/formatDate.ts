// פונקציות לעיבוד תאריכים

export const formatDate = (iso: string) => new Date(iso).toLocaleDateString()

// פורמט תאריך מורחב
export const formatDateExtended = (iso: string, locale: string = 'he-IL') => {
    return new Date(iso).toLocaleDateString(locale, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long'
    })
}

// פורמט תאריך קצר
export const formatDateShort = (iso: string, locale: string = 'he-IL') => {
    return new Date(iso).toLocaleDateString(locale, {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    })
}

// פורמט זמן
export const formatTime = (iso: string, locale: string = 'he-IL') => {
    return new Date(iso).toLocaleTimeString(locale, {
        hour: '2-digit',
        minute: '2-digit'
    })
}

// פורמט תאריך וזמן
export const formatDateTime = (iso: string, locale: string = 'he-IL') => {
    return new Date(iso).toLocaleString(locale, {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    })
}

// תאריך יחסי (לפני X זמן)
export const formatRelativeDate = (iso: string, locale: string = 'he-IL') => {
    const date = new Date(iso)
    const now = new Date()
    const diffInMs = now.getTime() - date.getTime()
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60))
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60))

    if (diffInDays > 0) {
        return `${diffInDays} ימים לפני`
    } else if (diffInHours > 0) {
        return `${diffInHours} שעות לפני`
    } else if (diffInMinutes > 0) {
        return `${diffInMinutes} דקות לפני`
    } else {
        return 'עכשיו'
    }
}

// בדיקה אם תאריך הוא היום
export const isToday = (iso: string) => {
    const date = new Date(iso)
    const today = new Date()
    return date.toDateString() === today.toDateString()
}

// בדיקה אם תאריך הוא אתמול
export const isYesterday = (iso: string) => {
    const date = new Date(iso)
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    return date.toDateString() === yesterday.toDateString()
}

// בדיקה אם תאריך הוא השבוע
export const isThisWeek = (iso: string) => {
    const date = new Date(iso)
    const today = new Date()
    const startOfWeek = new Date(today)
    startOfWeek.setDate(today.getDate() - today.getDay())
    const endOfWeek = new Date(startOfWeek)
    endOfWeek.setDate(startOfWeek.getDate() + 6)

    return date >= startOfWeek && date <= endOfWeek
}

// בדיקה אם תאריך הוא החודש
export const isThisMonth = (iso: string) => {
    const date = new Date(iso)
    const today = new Date()
    return date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear()
}

// בדיקה אם תאריך הוא השנה
export const isThisYear = (iso: string) => {
    const date = new Date(iso)
    const today = new Date()
    return date.getFullYear() === today.getFullYear()
}

// הוספת ימים לתאריך
export const addDays = (iso: string, days: number) => {
    const date = new Date(iso)
    date.setDate(date.getDate() + days)
    return date.toISOString()
}

// הוספת חודשים לתאריך
export const addMonths = (iso: string, months: number) => {
    const date = new Date(iso)
    date.setMonth(date.getMonth() + months)
    return date.toISOString()
}

// הוספת שנים לתאריך
export const addYears = (iso: string, years: number) => {
    const date = new Date(iso)
    date.setFullYear(date.getFullYear() + years)
    return date.toISOString()
}

// חישוב הפרש ימים בין שני תאריכים
export const getDaysDifference = (date1: string, date2: string) => {
    const d1 = new Date(date1)
    const d2 = new Date(date2)
    const diffInMs = Math.abs(d2.getTime() - d1.getTime())
    return Math.floor(diffInMs / (1000 * 60 * 60 * 24))
}

// בדיקה אם תאריך תקין
export const isValidDate = (iso: string) => {
    const date = new Date(iso)
    return !isNaN(date.getTime())
}

// קבלת תאריך נוכחי ב-ISO
export const getCurrentDateISO = () => {
    return new Date().toISOString()
}

// קבלת תאריך נוכחי בפורמט מקומי
export const getCurrentDateLocal = (locale: string = 'he-IL') => {
    return new Date().toLocaleDateString(locale)
}

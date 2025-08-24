// src/shared/utils/validate.ts

// טיפוס תוצאה אחיד לכל הפונקציות
export type ValidationResult = { isValid: boolean; message?: string }

// פונקציות וולידציה

export const isEmail = (email: string): boolean => /.+@.+\..+/.test(email)

export const validateEmail = (email: string): ValidationResult => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!email) return { isValid: false, message: "האימייל הוא שדה חובה" }
  if (!emailRegex.test(email)) return { isValid: false, message: "האימייל אינו תקין" }
  return { isValid: true }
}

export const validatePassword = (password: string): ValidationResult => {
  if (!password) return { isValid: false, message: "הסיסמה היא שדה חובה" }
  if (password.length < 8) return { isValid: false, message: "הסיסמה חייבת להכיל לפחות 8 תווים" }
  if (!/(?=.*[a-z])/.test(password)) return { isValid: false, message: "הסיסמה חייבת להכיל אות קטנה" }
  if (!/(?=.*[A-Z])/.test(password)) return { isValid: false, message: "הסיסמה חייבת להכיל אות גדולה" }
  if (!/(?=.*\d)/.test(password)) return { isValid: false, message: "הסיסמה חייבת להכיל מספר" }
  return { isValid: true }
}

export const validateName = (name: string): ValidationResult => {
  if (!name) return { isValid: false, message: "השם הוא שדה חובה" }
  if (name.length < 2) return { isValid: false, message: "השם חייב להכיל לפחות 2 תווים" }
  if (name.length > 50) return { isValid: false, message: "השם לא יכול להיות ארוך מ-50 תווים" }
  return { isValid: true }
}

export const validatePhone = (phone: string): ValidationResult => {
  const phoneRegex = /^[+]?[0-9\s\-()]{9,15}$/
  if (!phone) return { isValid: false, message: "מספר הטלפון הוא שדה חובה" }
  if (!phoneRegex.test(phone)) return { isValid: false, message: "מספר הטלפון אינו תקין" }
  return { isValid: true }
}

export const validateNumber = (value: string, min?: number, max?: number): ValidationResult => {
  const num = parseFloat(value)
  if (isNaN(num)) return { isValid: false, message: "הערך חייב להיות מספר" }
  if (min !== undefined && num < min) return { isValid: false, message: `המספר חייב להיות לפחות ${min}` }
  if (max !== undefined && num > max) return { isValid: false, message: `המספר חייב להיות לכל היותר ${max}` }
  return { isValid: true }
}

export const validateTextLength = (text: string, min: number, max: number): ValidationResult => {
  if (!text) return { isValid: false, message: "הטקסט הוא שדה חובה" }
  if (text.length < min) return { isValid: false, message: `הטקסט חייב להכיל לפחות ${min} תווים` }
  if (text.length > max) return { isValid: false, message: `הטקסט לא יכול להיות ארוך מ-${max} תווים` }
  return { isValid: true }
}

export const validateURL = (url: string): ValidationResult => {
  try {
    new URL(url)
    return { isValid: true }
  } catch {
    return { isValid: false, message: "ה-URL אינו תקין" }
  }
}

export const validateDate = (date: string): ValidationResult => {
  const dateObj = new Date(date)
  if (isNaN(dateObj.getTime())) return { isValid: false, message: "התאריך אינו תקין" }
  return { isValid: true }
}

export const validateFutureDate = (date: string): ValidationResult => {
  const dateValidation = validateDate(date)
  if (!dateValidation.isValid) return dateValidation

  const dateObj = new Date(date)
  if (dateObj <= new Date()) return { isValid: false, message: "התאריך חייב להיות בעתיד" }
  return { isValid: true }
}

export const validatePastDate = (date: string): ValidationResult => {
  const dateValidation = validateDate(date)
  if (!dateValidation.isValid) return dateValidation

  const dateObj = new Date(date)
  if (dateObj >= new Date()) return { isValid: false, message: "התאריך חייב להיות בעבר" }
  return { isValid: true }
}

export const validateFile = (
  file: File | null,
  maxSize: number,
  allowedTypes: string[]
): ValidationResult => {
  if (typeof File === "undefined" || !file) {
    return { isValid: false, message: "קובץ לא נמצא או אינו נתמך בסביבה זו" }
  }
  if (file.size > maxSize) {
    return { isValid: false, message: `הקובץ לא יכול להיות גדול מ-${maxSize / (1024 * 1024)}MB` }
  }
  if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
    return { isValid: false, message: `סוג הקובץ לא נתמך. מותר: ${allowedTypes.join(", ")}` }
  }
  return { isValid: true }
}

export const validateIsraeliID = (id: string): ValidationResult => {
  if (!id) return { isValid: false, message: "מספר הזהות הוא שדה חובה" }
  if (!/^\d{9}$/.test(id)) return { isValid: false, message: "מספר הזהות חייב להכיל 9 ספרות" }

  let sum = 0
  for (let i = 0; i < 8; i++) {
    let digit = parseInt(id[i])
    digit = i % 2 === 0 ? digit : digit * 2
    if (digit > 9) digit = Math.floor(digit / 10) + (digit % 10)
    sum += digit
  }
  const checkDigit = (10 - (sum % 10)) % 10
  if (parseInt(id[8]) !== checkDigit) return { isValid: false, message: "מספר הזהות אינו תקין" }
  return { isValid: true }
}

export const validateCreditCard = (cardNumber: string): ValidationResult => {
  if (!cardNumber) return { isValid: false, message: "מספר כרטיס האשראי הוא שדה חובה" }

  const cleanNumber = cardNumber.replace(/\s+/g, "").replace(/-/g, "")
  if (!/^\d{13,19}$/.test(cleanNumber)) return { isValid: false, message: "מספר כרטיס האשראי חייב להכיל 13-19 ספרות" }

  let sum = 0
  let isEven = false
  for (let i = cleanNumber.length - 1; i >= 0; i--) {
    let digit = parseInt(cleanNumber[i])
    if (isEven) {
      digit *= 2
      if (digit > 9) digit = Math.floor(digit / 10) + (digit % 10)
    }
    sum += digit
    isEven = !isEven
  }

  if (sum % 10 !== 0) return { isValid: false, message: "מספר כרטיס האשראי אינו תקין" }
  return { isValid: true }
}

export const validateIsraeliPhone = (phone: string): ValidationResult => {
  if (!phone) return { isValid: false, message: "מספר הטלפון הוא שדה חובה" }

  const cleanPhone = phone.replace(/\s+/g, "").replace(/-/g, "").replace(/\(|\)/g, "")
  const phoneRegex = /^(05[0-9]|02|03|04|08|09)[0-9]{7}$/
  if (!phoneRegex.test(cleanPhone)) return { isValid: false, message: "מספר הטלפון הישראלי אינו תקין" }
  return { isValid: true }
}

export const validateVATNumber = (vatNumber: string): ValidationResult => {
  if (!vatNumber) return { isValid: false, message: "מספר העוסק המורשה הוא שדה חובה" }
  if (!/^\d{9}$/.test(vatNumber)) return { isValid: false, message: "מספר העוסק המורשה חייב להכיל 9 ספרות" }
  return { isValid: true }
}

// ייצוא ברירת מחדל לארגון
const validate = {
  isEmail,
  validateEmail,
  validatePassword,
  validateName,
  validatePhone,
  validateNumber,
  validateTextLength,
  validateURL,
  validateDate,
  validateFutureDate,
  validatePastDate,
  validateFile,
  validateIsraeliID,
  validateCreditCard,
  validateIsraeliPhone,
  validateVATNumber
}

export default validate

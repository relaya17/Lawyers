/**
 * גשר לטיפול גלובלי ב-401 — נרשם מ-SessionAuthProvider (מנקה session + מפנה ל-login).
 * לא מיובא מ-authHttp כדי למנוע מעגל תלויות.
 */
let handler: (() => void) | null = null

export function registerUnauthorizedHandler(fn: (() => void) | null): void {
  handler = fn
}

export function triggerUnauthorized(): void {
  if (handler) {
    handler()
    return
  }
  if (typeof window !== 'undefined' && !window.location.pathname.startsWith('/login')) {
    window.location.assign('/login?reason=session')
  }
}

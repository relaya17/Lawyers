/**
 * עותק סינכרוני של ה-JWT לשימוש ב-Axios interceptors (שאינם בתוך React).
 * מתעדכן מ-SessionAuthProvider בכל login/logout/refresh.
 */
let accessToken: string | null = null

export function setSyncAccessToken(token: string | null): void {
  accessToken = token
}

export function getSyncAccessToken(): string | null {
  return accessToken
}

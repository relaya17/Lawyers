/** מניעת פתיחת redirect חיצוני אחרי login/register */
export function safeNextPath(raw: string | null | undefined): string {
  if (!raw || !raw.startsWith('/') || raw.startsWith('//')) return '/dashboard'
  return raw
}

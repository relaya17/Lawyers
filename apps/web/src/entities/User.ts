export type UserRole = 'student' | 'lawyer' | 'lecturer' | 'admin'
export interface User { id: string; email: string; firstName: string; lastName: string; role: UserRole }

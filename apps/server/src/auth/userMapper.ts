import type { User } from '@myorg/shared/store/slices/authSlice';

export interface AuthUserRow {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone: string | null;
  role: string;
  email_verified_at: Date | null;
  created_at: Date;
  updated_at: Date;
}

export function rowToUser(row: AuthUserRow): User {
  return {
    id: row.id,
    email: row.email,
    firstName: row.first_name,
    lastName: row.last_name,
    role: (['student', 'lawyer', 'lecturer', 'admin'].includes(row.role)
      ? row.role
      : 'student') as User['role'],
    phone: row.phone ?? undefined,
    avatar: undefined,
    isActive: true,
    createdAt: new Date(row.created_at).toISOString(),
    updatedAt: new Date(row.updated_at).toISOString(),
  };
}

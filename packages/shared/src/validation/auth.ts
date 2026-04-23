import { z } from 'zod';

const passwordSchema = z
  .string()
  .min(8, 'סיסמה: לפחות 8 תווים')
  .max(128)
  .regex(/[a-z]/, 'סיסמה: נדרש אות קטנה באנגלית')
  .regex(/[A-Z]/, 'סיסמה: נדרש אות גדולה באנגלית')
  .regex(/[0-9]/, 'סיסמה: נדרש ספרה');

export const registerSchema = z.object({
  email: z.string().email('אימייל לא תקין').max(255),
  password: passwordSchema,
  firstName: z.string().min(1, 'שם פרטי נדרש').max(100),
  lastName: z.string().min(1, 'שם משפחה נדרש').max(100),
  phone: z.string().max(32).optional(),
});

export const loginSchema = z.object({
  email: z.string().email('אימייל לא תקין').max(255),
  password: z.string().min(1, 'סיסמה נדרשת').max(128),
});

export const verifyEmailSchema = z.object({
  email: z.string().email().max(255),
  code: z.string().length(6, 'קוד חייב להיות 6 ספרות').regex(/^\d{6}$/, 'רק ספרות'),
});

export const resendOtpSchema = z.object({
  email: z.string().email().max(255),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type VerifyEmailInput = z.infer<typeof verifyEmailSchema>;

/**
 * צבעים לתפקידים בחדר הדיונים — Web client.
 * חייב להיות מסונכרן עם apps/server/src/courtroom/roleColors.ts
 */
import type { ParticipantRole } from '@/features/virtual-court-2/types'

export interface RoleTheme {
  key: ParticipantRole
  label: string
  color: string
  secondary: string
  shortLabel: string
}

export const ROLE_THEME: Record<ParticipantRole, RoleTheme> = {
  judge: {
    key: 'judge',
    label: 'שופט/ת',
    color: '#1A237E',
    secondary: '#E8EAF6',
    shortLabel: 'שופט',
  },
  student_judge: {
    key: 'student_judge',
    label: 'שופט סטודנט',
    color: '#283593',
    secondary: '#E8EAF6',
    shortLabel: 'שופט-ס',
  },
  ai_judge: {
    key: 'ai_judge',
    label: 'שופט AI',
    color: '#3949AB',
    secondary: '#E8EAF6',
    shortLabel: 'שופט-AI',
  },
  prosecutor: {
    key: 'prosecutor',
    label: 'תביעה',
    color: '#B71C1C',
    secondary: '#FFEBEE',
    shortLabel: 'תביעה',
  },
  plaintiff_lawyer: {
    key: 'plaintiff_lawyer',
    label: 'ב״כ התובע',
    color: '#B71C1C',
    secondary: '#FFEBEE',
    shortLabel: 'ב״כ-תובע',
  },
  defense_lawyer: {
    key: 'defense_lawyer',
    label: 'הגנה',
    color: '#1B5E20',
    secondary: '#E8F5E9',
    shortLabel: 'הגנה',
  },
  plaintiff: {
    key: 'plaintiff',
    label: 'תובע/עותר',
    color: '#C62828',
    secondary: '#FFEBEE',
    shortLabel: 'תובע',
  },
  defendant: {
    key: 'defendant',
    label: 'נתבע/נאשם',
    color: '#616161',
    secondary: '#F5F5F5',
    shortLabel: 'נאשם',
  },
  witness: {
    key: 'witness',
    label: 'עד/ה',
    color: '#E65100',
    secondary: '#FFF3E0',
    shortLabel: 'עד',
  },
  expert: {
    key: 'expert',
    label: 'מומחה',
    color: '#00695C',
    secondary: '#E0F2F1',
    shortLabel: 'מומחה',
  },
  clerk: {
    key: 'clerk',
    label: 'מזכירות',
    color: '#4A148C',
    secondary: '#F3E5F5',
    shortLabel: 'מזכיר',
  },
  mediator: {
    key: 'mediator',
    label: 'מגשר',
    color: '#6A1B9A',
    secondary: '#F3E5F5',
    shortLabel: 'מגשר',
  },
  observer: {
    key: 'observer',
    label: 'משקיף',
    color: '#9E9E9E',
    secondary: '#FAFAFA',
    shortLabel: 'משקיף',
  },
}

export function themeForRole(role: ParticipantRole | string | undefined): RoleTheme {
  if (!role) return ROLE_THEME.observer
  return (ROLE_THEME as Record<string, RoleTheme>)[role] ?? ROLE_THEME.observer
}

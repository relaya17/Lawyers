import type {
  CaseStatus,
  CaseTrack,
  CourtLevel,
  JudgeMode,
  ParticipantRole,
} from '../types'

export const courtLevelLabel: Record<CourtLevel, string> = {
  magistrate: 'שלום',
  district: 'מחוזי',
  supreme: 'עליון',
}

export const trackLabel: Record<CaseTrack, string> = {
  civil: 'אזרחי',
  criminal: 'פלילי',
  administrative: 'מנהלי/חוקתי',
  labor: 'עבודה',
  family: 'משפחה',
  commercial_mediation: 'גישור מסחרי',
  plea_bargain: 'הסדר טיעון',
}

export const statusLabel: Record<CaseStatus, string> = {
  draft: 'טיוטה',
  filed: 'הוגש',
  in_hearing: 'בדיון',
  awaiting_ruling: 'ממתין לפסק',
  ruled: 'ניתן פסק דין',
  appealed: 'הוגש ערעור',
  closed: 'נסגר',
}

export const judgeModeLabel: Record<JudgeMode, string> = {
  ai: 'שופט AI',
  student: 'שופט סטודנט',
  hybrid: 'משולב (AI + סטודנט)',
}

export const roleLabel: Record<ParticipantRole, string> = {
  judge: 'שופט/ת',
  student_judge: 'שופט סטודנט',
  ai_judge: 'שופט AI',
  prosecutor: 'תובע',
  plaintiff_lawyer: 'ב״כ התובע',
  defense_lawyer: 'ב״כ הנתבע',
  plaintiff: 'תובע/עותר',
  defendant: 'נתבע/משיב',
  witness: 'עד',
  expert: 'מומחה',
  clerk: 'מזכיר/ה',
  mediator: 'מגשר',
  observer: 'משקיף',
}

export const statusColor: Record<CaseStatus, 'default' | 'info' | 'warning' | 'success' | 'error'> = {
  draft: 'default',
  filed: 'info',
  in_hearing: 'warning',
  awaiting_ruling: 'warning',
  ruled: 'success',
  appealed: 'info',
  closed: 'default',
}

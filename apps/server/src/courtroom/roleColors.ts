/**
 * צבעים לתפקידים בחדר הדיונים — שרת.
 * יש להשאיר מסונכרן עם apps/web/src/features/courtroom/theme/roleColors.ts
 */

export const ROLE_COLORS: Record<string, string> = {
  judge: '#1A237E',
  student_judge: '#283593',
  ai_judge: '#3949AB',
  prosecutor: '#B71C1C',
  plaintiff_lawyer: '#B71C1C',
  defense_lawyer: '#1B5E20',
  plaintiff: '#C62828',
  defendant: '#616161',
  witness: '#E65100',
  expert: '#00695C',
  clerk: '#4A148C',
  mediator: '#6A1B9A',
  observer: '#9E9E9E',
};

export function getColorForRole(role: string): string {
  return ROLE_COLORS[role] ?? '#9E9E9E';
}

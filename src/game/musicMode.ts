/** Intensité de la musique selon la situation (E7-6). Logique pure, testée à part. */
export type Mode = 'calm' | 'tension' | 'chase';
export interface Situation { chase: boolean; maxDet: number; alert: boolean; left: number }
export function musicMode(s: Situation): Mode {
  if (s.chase) return 'chase';
  if (s.alert || s.maxDet > 0.12 || s.left < 60) return 'tension';
  return 'calm';
}

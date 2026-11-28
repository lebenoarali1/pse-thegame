import { setTL } from './state';

/** Tableau unique des réglages de difficulté (E1-3). Le niveau choisi est mémorisé dans le navigateur (E5-4). */
export interface Diff { n: string; TL: number; detect: number; desc: string }
export const DIFFS: Record<string, Diff> = {
  stagiaire: { n: 'Stagiaire', TL: 720, detect: 0.8, desc: '12 min de jeu, gardes plus distraits' },
  cadre: { n: 'Cadre', TL: 600, detect: 1, desc: '10 min de jeu, réglage de référence' },
  directeur: { n: 'Directeur', TL: 480, detect: 1.25, desc: '8 min de jeu, gardes plus vigilants' },
};
export const DIFF_ORDER = ['stagiaire', 'cadre', 'directeur'];

export interface Settings { diff: string; cones: boolean; muted: boolean; music: number; sfx: number }
const KEY = 'plansocial.settings';
const DEFAULTS: Settings = { diff: 'cadre', cones: true, muted: false, music: 0.6, sfx: 1 };

function load(): Settings {
  try {
    const o = JSON.parse(localStorage.getItem(KEY) || '{}') as Partial<Settings>;
    return {
      diff: typeof o.diff === 'string' && o.diff in DIFFS ? o.diff : DEFAULTS.diff,
      cones: typeof o.cones === 'boolean' ? o.cones : DEFAULTS.cones,
      muted: typeof o.muted === 'boolean' ? o.muted : DEFAULTS.muted,
      music: typeof o.music === 'number' ? Math.min(1, Math.max(0, o.music)) : DEFAULTS.music,
      sfx: typeof o.sfx === 'number' ? Math.min(1, Math.max(0, o.sfx)) : DEFAULTS.sfx,
    };
  } catch { return { ...DEFAULTS } }
}
export const SET: Settings = load();
export function saveSettings(): void {
  try { localStorage.setItem(KEY, JSON.stringify(SET)) } catch { /* stockage indisponible */ }
}
export function curDiff(): Diff { return DIFFS[SET.diff] }
export function applyDiff(): void { setTL(curDiff().TL) }
export function nextDiff(): void {
  SET.diff = DIFF_ORDER[(DIFF_ORDER.indexOf(SET.diff) + 1) % DIFF_ORDER.length];
  applyDiff(); saveSettings();
}

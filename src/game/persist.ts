// Sauvegarde persistante (localStorage) : une seule partie rapide, versionnée.
const KEY = 'plansocial.save';
/** À incrémenter si le format de GameState change de façon incompatible. */
export const SAVE_FORMAT = 1;

interface Saved { v: number; at: number; json: string }

export function writeSave(json: string): void {
  try { localStorage.setItem(KEY, JSON.stringify({ v: SAVE_FORMAT, at: Date.now(), json } satisfies Saved)) } catch { /* stockage indisponible : la sauvegarde reste en mémoire */ }
}

/** Renvoie la sauvegarde si elle existe et si son format est compatible. */
export function readSave(): Saved | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const o = JSON.parse(raw) as Saved;
    return o.v === SAVE_FORMAT && typeof o.json === 'string' ? o : null;
  } catch { return null }
}

export function clearSave(): void {
  try { localStorage.removeItem(KEY) } catch { /* sans effet */ }
}

// Modèle de données du jeu. Les champs ajoutés dynamiquement par les mécaniques restent accessibles via l'index.

export type CharId = 'kevin' | 'nadege' | 'marc' | 'jordan';
export type EnemyType = 'vigile' | 'beaugosse' | 'manager' | 'dg' | 'camera' | 'employe' | string;
export type EnemyState = 'patrol' | 'look' | 'chase' | 'break' | 'clean' | 'coffee' | 'call' | 'snitch' | 'ko' | string;

export interface Point { x: number; y: number }
/** Étape d'une ronde : position, attente et téléportation optionnelles. */
export interface RoutePoint extends Point { wait?: number; warp?: boolean | { f: number; x: number; y: number }; [k: string]: any }

/** Action en cours qui immobilise un personnage (piratage, KO, planque...). */
export interface Busy { k: string; t: number; max: number; lock: boolean; [k: string]: any }

export interface Character {
  id: CharId | string;
  name: string;
  f: number; x: number; y: number; face: number;
  path: Point[]; order: any; busy: Busy | null;
  hide: boolean; disguise: 'vigile' | 'manager' | null;
  run: boolean; cd: { q: number; e: number; w?: number };
  sp: number; moving: boolean; say: string; sayT: number;
  joined?: boolean; out?: boolean;
  [k: string]: any;
}

export interface Enemy {
  id: string; name: string; type: EnemyType;
  f: number; x: number; y: number; hx: number; hy: number; face: number;
  fov: number; range: number; sp: number;
  route: RoutePoint[]; home: RoutePoint[]; ri: number; loop: boolean;
  state: EnemyState; det: number; tgt: string | null;
  ko: boolean; hidden: boolean; uniformTaken: boolean;
  calm?: boolean; tech?: boolean; cart?: boolean;
  koT?: number; koDur?: number; freeze?: number;
  path: Point[]; moving: boolean; say: string; sayT: number;
  [k: string]: any;
}

export interface Puddle { f: number; x: number; y: number; t: number }

export interface GameState {
  t: number; over: null | { win: boolean; title: string; text: string } | any;
  sel: string; age: number; talked: Record<string, any>;
  chars: Character[]; enemies: Enemy[];
  team: { code: boolean; key: boolean; camsUntil: number; fluxUntil: number; throws: number; [k: string]: any };
  doorHack: Record<string, number>; dOpen: Record<string, any>; dLatch: Record<string, any>; dLing: Record<string, any>;
  puddles: Puddle[]; distCd: Record<string, number>; ev: Record<string, any>; flags: Record<string, any>;
  alertT: number;
  [k: string]: any;
}

/** Variables partagées entre modules (vue courante, pause, zoom...). */
export interface Store {
  S: GameState; view: number; paused: boolean; started: boolean; muted: boolean; spd: number;
  showCones: boolean; noLimit: boolean; dbg: boolean; assist: boolean; zoom: number; fCount: number;
  pend: any; dlg: any; ptr: any; AC: AudioContext | null; lastUI: number; lastSave: string | null;
  P: any[]; PR: any[];
}

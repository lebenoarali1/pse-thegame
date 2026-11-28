// Modèle de données du jeu. Les champs ajoutés dynamiquement par les mécaniques restent accessibles via l'index.

export type CharId = 'kevin' | 'nadege' | 'marc' | 'jordan';
export type EnemyType = 'vigile' | 'beaugosse' | 'manager' | 'dg' | 'camera' | 'employe' | string;
export type EnemyState = 'patrol' | 'look' | 'chase' | 'break' | 'clean' | 'coffee' | 'call' | 'snitch' | 'ko' | string;

export interface Point { x: number; y: number }
/** Étape d'une ronde : position, attente et téléportation optionnelles. */
export interface RoutePoint extends Point { wait?: number; face?: number; warp?: boolean | { f: number; x: number; y: number } }

/** Destination avec action à l'arrivée (escalier, piratage, KO, planque, flaque...). */
export interface Order {
  k: string;
  f?: number; x?: number; y?: number;
  sx?: number; sy?: number; vx?: number; vy?: number;
  eid?: string; kind?: string;
}

/** Action en cours qui immobilise un personnage (piratage, KO, planque...). */
export interface Busy {
  k: string; t: number; max: number; lock: boolean;
  what?: string; act?: string; eid?: string; slow?: boolean;
  f?: number; x?: number; y?: number; vx?: number; vy?: number;
  sp?: number[][]; so?: Order | null;
}

/** Point d'intérêt temporaire d'un PNJ (pause, nettoyage, café, regard). */
export interface Spot { x: number; y: number; t: number; arrived: boolean; dur: number; sy: number; face?: number; lines?: string[]; f0?: number; red?: number }
export interface ScanCfg { base: number; amp: number; period: number }

export interface Character {
  id: CharId | string;
  name: string;
  f: number; x: number; y: number; face: number;
  path: number[][]; order: Order | null; busy: Busy | null;
  hide: boolean; disguise: 'vigile' | 'manager' | null;
  run: boolean; cd: { q: number; e: number; w?: number; x?: number };
  sp: number; moving: boolean; say: string; sayT: number;
  joined?: boolean; out?: boolean;
  talking: string | null; smoke?: boolean; chatT: number; chatN: number; stall: number; repath: number; runN: number; small?: boolean;
}

export interface Enemy {
  id: string; name: string; type: EnemyType;
  f: number; x: number; y: number; hx: number; hy: number; face: number;
  fov: number; range: number; sp: number;
  route: RoutePoint[]; home: RoutePoint[]; ri: number; loop: boolean;
  state: EnemyState; det: number; tgt: string | null;
  ko: boolean; hidden: boolean; uniformTaken: boolean;
  calm?: boolean; tech?: boolean; cart?: boolean;
  koT: number; koDur: number; freeze: number;
  path: number[][]; moving: boolean; say: string; sayT: number;
  talk: number; wait: number; lose: number; talkTo?: string | null; callTo?: string;
  look?: Partial<Spot> & { x: number; y: number; t: number; arrived: boolean } | null; lookDur?: number; scan?: ScanCfg | null; fovS?: number | null; rangeS?: number | null; repath: number; stall: number; order?: Order | null; lastSeen?: Point;
  talkRed?: [number, number] | null; off?: boolean; chat?: number; chatN?: number; idleFace: number;
  snt?: { mid: string; cid: string; t: number } | null;
  brk?: Spot | null; cof?: Spot | null; cln?: Partial<Spot> & { x: number; y: number; t: number; arrived: boolean; dur: number } | null;
}

export interface Puddle { f: number; x: number; y: number; t: number }

export interface GameState {
  t: number; over: null | 'win' | 'fail';
  sel: string; age: number; talked: Record<string, number>;
  chars: Character[]; enemies: Enemy[];
  team: { code: boolean; key: boolean; camsUntil: number; fluxUntil: number; throws: number; camsOff?: Record<number, number>; lightsOff?: Record<number, number>; lightsWho?: Record<number, string> };
  doorHack: Record<string, number>; dOpen: Record<string, boolean>; dLatch: Record<string, number>; dLing: Record<string, number>;
  puddles: Puddle[]; distCd: Record<string, number>; ev: Record<string, number>; flags: Record<string, number | boolean>;
  alertT: number;
}

/** Variables partagées entre modules (vue courante, pause, zoom...). */
export interface Store {
  S: GameState; view: number; paused: boolean; started: boolean; muted: boolean; spd: number;
  showCones: boolean; noLimit: boolean; dbg: boolean; assist: boolean; zoom: number; fCount: number;
  pend: { k: string } | null; dlg: Dialog | null; ptr: Pointer | null; AC: AudioContext | null; lastUI: number; lastSave: string | null;
  P: Particle[]; PR: Projectile[];
}

export type ActionMode = 'auto' | 'tile' | 'enemy' | 'hack' | 'none';
/** Pouvoir d'un personnage (entrée de ACT). */
export interface Action { k: string; n: string; s: string; i: string; mode: ActionMode }
/** Paramètre d'un pouvoir : case visée, PNJ visé, terminal ou porte. */
export interface ActionArg { x: number; y: number; eid?: string; kind?: string }

export interface Appearance { skin: string; hair: string; body: string; legs: string }
/** Options de dessin d'un personnage ou PNJ. */
export interface PersonOpts {
  look: string; kind: string; dir: number; moving: boolean; s?: number; ph?: number;
  smoke?: boolean; hair?: string; bodies?: boolean; sit?: boolean; boxers?: boolean; ko?: boolean; hide?: boolean; disguise?: string | null;
  sel?: boolean; run?: boolean; small?: boolean; alpha?: number;
}

export type CharFactory = (id: string, name: string, x: number, y: number, sp: number, o?: Partial<Character>) => Character;
export type EnemyFactory = (id: string, name: string, type: string, f: number, x: number, y: number, o?: Partial<Enemy>) => Enemy;

/** Étape de dialogue : réplique, choix, effet. */
export interface DlgStep { w?: string; t?: string; fx?: () => void; ch?: DlgChoice[]; r?: DlgStep[] }
export interface DlgChoice { t: string; r?: DlgStep[]; fx?: () => void }
export interface Dialog { q: DlgStep[]; done: () => void; trig: string; cur: string | null; pos: number }

/** Menu affiché quand Nadia pirate un PC. */
export interface PcAction { k: string; i: string; n: string; s: string; t: number }
export interface PcMenu { f: number; x: number; y: number; extra: PcAction[] }

export interface VideoState {
  t: number; run: boolean; cb: (() => void) | null; fired: Record<string, number>; last: number; tick: number;
}

export interface Pointer { x: number; y: number; cx: number; cy: number; drag: boolean; id: number }
/** Particule visuelle (fumée, éclaboussure, étoile de KO). */
export interface Particle { f: number; x: number; y: number; z: number; vx: number; vy: number; vz: number; life: number; col: string; sz: number; ring?: boolean; smoke?: boolean; age?: number }
/** Objet lancé (gobelet, clope offerte). */
export interface Projectile { done?: boolean; f: number; x0: number; y0: number; x1: number; y1: number; t: number; dur: number; kind?: string; eid?: string }

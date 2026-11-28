import { ST } from './store';
import { SET } from './settings';
import { TL } from './state';
import { musicMode } from './musicMode';
import type { Mode } from './musicMode';

/* Musique d'ambiance procédurale : une basse et quelques notes synthétisées, plus vives quand la tension monte (E7-6). */
const BPM: Record<Mode, number> = { calm: 80, tension: 100, chase: 128 };
const BASS: Record<Mode, number[]> = {
  calm: [55, 0, 0, 0, 65.4, 0, 0, 0, 49, 0, 0, 0, 61.7, 0, 0, 0],
  tension: [55, 0, 55, 0, 58.3, 0, 55, 0, 49, 0, 49, 0, 58.3, 0, 55, 0],
  chase: [55, 55, 110, 55, 58.3, 58.3, 116.5, 58.3, 49, 49, 98, 49, 58.3, 58.3, 116.5, 58.3],
};
const ARP = [220, 261.6, 329.6, 261.6, 233.1, 277.2, 349.2, 277.2];
let mode: Mode = 'calm';
let step = 0;
let next = 0;
let timer = 0;
let master: GainNode | null = null;

export function currentMode(): Mode { return mode }

function note(fr: number, t: number, d: number, type: OscillatorType, v: number) {
  const ac = ST.AC!, o = ac.createOscillator(), g = ac.createGain();
  o.type = type; o.frequency.setValueAtTime(fr, t);
  g.gain.setValueAtTime(v, t); g.gain.exponentialRampToValueAtTime(0.0001, t + d);
  o.connect(g); g.connect(master!); o.start(t); o.stop(t + d + 0.02);
}

function situation() {
  const S = ST.S;
  let maxDet = 0, chase = false;
  for (const e of S.enemies) { if (e.ko) continue; if (e.state === 'chase') chase = true; if (e.det > maxDet) maxDet = e.det }
  return { chase, maxDet, alert: S.alertT > 0, left: TL - S.t };
}

function tick() {
  if (!ST.S || ST.S.t < 0.2 || ST.S.over) return;
  mode = musicMode(situation());
  if (ST.paused || ST.muted || SET.music <= 0) return;
  try {
    if (!ST.AC) ST.AC = new (window.AudioContext || window.webkitAudioContext)();
    const ac = ST.AC;
    if (ac.state === 'suspended') void ac.resume();
    if (!master) { master = ac.createGain(); master.connect(ac.destination) }
    master.gain.value = SET.music * 0.5;
    const dur = 60 / BPM[mode] / 2;
    if (next < ac.currentTime) next = ac.currentTime + 0.05;
    while (next < ac.currentTime + 0.25) {
      const i = step % 16, b = BASS[mode][i];
      if (b) note(b, next, dur * 1.8, 'triangle', 0.22);
      if (mode === 'calm' && i === 0) { for (const f of [220, 261.6, 329.6]) note(f, next, dur * 14, 'sine', 0.05) }
      if (mode === 'tension' && i % 4 === 2) note(ARP[(step >> 2) % 8] / 2, next, dur * 2, 'sine', 0.06);
      if (mode === 'chase') { note(ARP[step % 8], next, dur * 0.9, 'sawtooth', 0.04); if (i % 4 === 0) note(60, next, 0.12, 'square', 0.1) }
      step++; next += dur;
    }
  } catch { /* audio indisponible */ }
}

export function startMusic() { if (!timer) timer = window.setInterval(tick, 80) }

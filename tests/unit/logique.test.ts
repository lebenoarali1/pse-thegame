import { describe, expect, it } from 'vitest';
import { findPath, los, passable } from '../../src/game/pathing';
import { DIFFS, DIFF_ORDER } from '../../src/game/settings';
import { where } from '../../src/game/messages';

describe('pathing', () => {
  it('refuse les cases hors carte et les murs', () => {
    expect(passable(0, -1, 0)).toBe(false);
    expect(passable(0, 0, 0)).toBe(false);
  });
  it('trouve un chemin entre deux cases libres du RDC', () => {
    const p = findPath(0, 16, 10, 12, 10);
    expect(p).not.toBeNull();
    expect(p!.length).toBeGreaterThan(0);
  });
  it('un point voit lui-même', () => {
    expect(los(0, 16.5, 10.5, 16.5, 10.5)).toBe(true);
  });
});

describe('difficulté', () => {
  it('trois niveaux, du plus long au plus court', () => {
    expect(DIFF_ORDER).toHaveLength(3);
    const t = DIFF_ORDER.map(k => DIFFS[k].TL);
    expect(t).toEqual([...t].sort((a, b) => b - a));
    expect(DIFFS.cadre.detect).toBe(1);
  });
});

describe('messages', () => {
  it('décrit le lieu d\'un incident', () => {
    expect(where(1, 3, 3)).toContain('étage 1');
    expect(where(0, 20, 11)).toContain('côté est');
  });
});

import { musicMode } from '../../src/game/musicMode';
describe('musique adaptative', () => {
  const calme = { chase: false, maxDet: 0, alert: false, left: 300 };
  it('calme par défaut', () => expect(musicMode(calme)).toBe('calm'));
  it('tension si on est repéré, en alerte ou dans la dernière minute', () => {
    expect(musicMode({ ...calme, maxDet: 0.3 })).toBe('tension');
    expect(musicMode({ ...calme, alert: true })).toBe('tension');
    expect(musicMode({ ...calme, left: 30 })).toBe('tension');
  });
  it('poursuite prioritaire', () => expect(musicMode({ ...calme, chase: true, maxDet: 1 })).toBe('chase'));
});

// feinspec-kapitel1.md §6.1 - Charakter-Startwerte (Level 1) & Specials.
// 1:1-Abschrift der Tabelle; Rosters starten als volle Level-1-Character-Instanzen
// (feinspec §4.1), noch ohne Waffe (weaponTier 0).

import type { Character } from '../core/entities'

// unlockedFromZone stammt aus der validierten Referenzsimulation
// (sim_chapter1.py, SPECIAL_FROM) - die feinspec-Tabelle nennt nur die
// MP-Kosten je Special, nicht die Freischalt-Zone.
export const CLAUDE: Character = {
  id: 'claude',
  name: 'Claude',
  level: 1,
  base: { hp: 110, mp: 20, atk: 14, mag: 6, def: 4, spd: 100 },
  growth: { hp: 1.09, atk: 1.055, mag: 1.055, def: 1.05, spd: 1.0 },
  special: { id: 'cross_slash', mpCost: 8, unlockedFromZone: 3 },
  weaponTier: 0,
  controlMode: 'auto',
  hp: 110,
  mp: 20,
  atb: 0,
  limit: 0,
  exp: 0,
}

export const BARREL: Character = {
  id: 'barrel',
  name: 'Barrel',
  level: 1,
  base: { hp: 140, mp: 20, atk: 11, mag: 5, def: 8, spd: 80 },
  growth: { hp: 1.09, atk: 1.055, mag: 1.055, def: 1.05, spd: 1.0 },
  special: { id: 'suppress', mpCost: 6, unlockedFromZone: 10 },
  weaponTier: 0,
  controlMode: 'auto',
  hp: 140,
  mp: 20,
  atb: 0,
  limit: 0,
  exp: 0,
}

export const TOFA: Character = {
  id: 'tofa',
  name: 'Tofa',
  level: 1,
  base: { hp: 95, mp: 20, atk: 12, mag: 5, def: 3, spd: 130 },
  growth: { hp: 1.09, atk: 1.055, mag: 1.055, def: 1.05, spd: 1.0 },
  special: { id: 'shock_strike', mpCost: 7, unlockedFromZone: 19 },
  weaponTier: 0,
  controlMode: 'auto',
  hp: 95,
  mp: 20,
  atb: 0,
  limit: 0,
  exp: 0,
}

export const ARRIS: Character = {
  id: 'arris',
  name: 'Arris',
  level: 1,
  base: { hp: 80, mp: 30, atk: 7, mag: 14, def: 3, spd: 95 },
  growth: { hp: 1.09, atk: 1.055, mag: 1.055, def: 1.05, spd: 1.0 },
  special: { id: 'party_heal', mpCost: 10, unlockedFromZone: 19 },
  weaponTier: 0,
  controlMode: 'auto',
  hp: 80,
  mp: 30,
  atb: 0,
  limit: 0,
  exp: 0,
}

export const CHARACTERS: Record<string, Character> = {
  claude: CLAUDE,
  barrel: BARREL,
  tofa: TOFA,
  arris: ARRIS,
}

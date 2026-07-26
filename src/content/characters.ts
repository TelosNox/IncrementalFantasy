// feinspec-kapitel1.md §6.1 - Charakter-Basiswerte & Specials.
// 1:1-Abschrift der Tabelle; noch ohne Waffe (weaponTier 0). Ein Level trägt die Figur
// nicht mehr - das Wachstum kommt aus dem Gruppenlevel (stats-kampfwerte.md §4.1), die
// hier notierten hp/mp sind die Startwerte auf Gruppenlevel 1.

import type { Character } from '../core/entities'

// unlockedFromZone stammt aus der validierten Referenzsimulation
// (sim_chapter1.py, SPECIAL_FROM) - die feinspec-Tabelle nennt nur die
// MP-Kosten je Special, nicht die Freischalt-Zone.
export const CLAUDE: Character = {
  id: 'claude',
  name: 'Claude',
  base: { hp: 110, mp: 20, atk: 14, mag: 6, def: 4, spd: 100 },
  growth: { hp: 1.09, atk: 1.055, mag: 1.055, def: 1.05, spd: 1.0 },
  special: { id: 'cross_slash', mpCost: 8, unlockedFromZone: 3 },
  weaponTier: 0,
  controlMode: 'auto',
  hp: 110,
  mp: 20,
  atb: 0,
  limit: 0,
}

export const BARREL: Character = {
  id: 'barrel',
  name: 'Barrel',
  base: { hp: 140, mp: 20, atk: 11, mag: 5, def: 8, spd: 80 },
  growth: { hp: 1.09, atk: 1.055, mag: 1.055, def: 1.05, spd: 1.0 },
  special: { id: 'suppress', mpCost: 6, unlockedFromZone: 10 },
  weaponTier: 0,
  controlMode: 'auto',
  hp: 140,
  mp: 20,
  atb: 0,
  limit: 0,
}

export const TOFA: Character = {
  id: 'tofa',
  name: 'Tofa',
  base: { hp: 95, mp: 20, atk: 12, mag: 5, def: 3, spd: 130 },
  growth: { hp: 1.09, atk: 1.055, mag: 1.055, def: 1.05, spd: 1.0 },
  special: { id: 'shock_strike', mpCost: 7, unlockedFromZone: 19 },
  weaponTier: 0,
  controlMode: 'auto',
  hp: 95,
  mp: 20,
  atb: 0,
  limit: 0,
}

export const AIRIS: Character = {
  id: 'airis',
  name: 'Air is...',
  base: { hp: 80, mp: 30, atk: 7, mag: 14, def: 3, spd: 95 },
  growth: { hp: 1.09, atk: 1.055, mag: 1.055, def: 1.05, spd: 1.0 },
  special: { id: 'party_heal', mpCost: 10, unlockedFromZone: 19 },
  weaponTier: 0,
  controlMode: 'auto',
  hp: 80,
  mp: 30,
  atb: 0,
  limit: 0,
}

export const CHARACTERS: Record<string, Character> = {
  claude: CLAUDE,
  barrel: BARREL,
  tofa: TOFA,
  airis: AIRIS,
}

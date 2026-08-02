// feinspec-kapitel1.md §6.1 - Charakter-Basiswerte & Specials.
// 1:1-Abschrift der Tabelle. Ein Level trägt die Figur nicht mehr - das Wachstum
// kommt komplett aus dem Gruppenlevel (stats-kampfwerte.md §4.1), die hier
// notierten hp/mp sind die Startwerte auf Gruppenlevel 1.
//
// Growth-Konstanten (30.07.2026, M15): Die Waffen-Tier-Leiter ist gestrichen
// (oekonomie-waehrungen.md, "Gil ist gestrichen"); ihr ATK/MAG/HP-Wachstum
// (Tier 4 bei Level >=16: atk/mag x1.40, hp x1.20) ist hier in die Level-Kurve
// gefaltet. Fit-Referenz: Level 21 (altes Endlevel Typ T/V, feinspec §7.4) -
// alt: 1.055^20 * 1.40 = 4.085 (atk/mag), 1.09^20 * 1.20 = 6.725 (hp); neu:
// 1.073^20 = 4.085, 1.10^20 = 6.725. Startwert, s. Umsetzungsentscheidung M15
// in 06_Implementierungsplan_Kapitel1.md - gegen den Test-Harness nachjustiert.

import type { Character } from '../core/entities'

// unlockedFromZone stammt aus der validierten Referenzsimulation
// (sim_chapter1.py, SPECIAL_FROM) - die feinspec-Tabelle nennt nur die
// MP-Kosten je Special, nicht die Freischalt-Zone. Seit M15 ist es zugleich der
// Ausloese-Zeitpunkt fuer `specialUnlocked` (permanent, s. entities.ts).
export const CLAUDE: Character = {
  id: 'claude',
  name: 'Claude',
  base: { hp: 110, mp: 20, atk: 14, mag: 6, def: 4, spd: 100 },
  growth: { hp: 1.1, atk: 1.073, mag: 1.073, def: 1.05, spd: 1.0 },
  special: { id: 'overcommit', mpCost: 8, unlockedFromZone: 3 },
  specialUnlocked: false,
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
  growth: { hp: 1.1, atk: 1.073, mag: 1.073, def: 1.05, spd: 1.0 },
  special: { id: 'suppress', mpCost: 6, unlockedFromZone: 10 },
  specialUnlocked: false,
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
  growth: { hp: 1.1, atk: 1.073, mag: 1.073, def: 1.05, spd: 1.0 },
  special: { id: 'shock_strike', mpCost: 7, unlockedFromZone: 19 },
  specialUnlocked: false,
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
  growth: { hp: 1.1, atk: 1.073, mag: 1.073, def: 1.05, spd: 1.0 },
  special: { id: 'party_heal', mpCost: 10, unlockedFromZone: 19 },
  specialUnlocked: false,
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

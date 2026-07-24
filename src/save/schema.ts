// feinspec-kapitel1.md §4.6 - SaveState (Kapitel-1-Umfang), + version-Feld für
// Migrationen (Architektur §6).

import type Decimal from 'break_eternity.js'
import type { BestiaryEntry, Character } from '../core/entities'

export const SAVE_VERSION = 1

export interface SaveFlags {
  autoAttackUnlocked: boolean
  mpVisible: boolean
  manualToggleUnlocked: boolean
  defenseUnlocked: boolean
  materiaUnlocked: boolean
  /** prestige-reunion.md - "1. Reunion = Sonderfall: schaltet zusaetzlich die Gambits frei". Der
   * programmierbare Gambit-Editor selbst ist Kapitel-2-Scope; dieser Flag haelt nur fest, dass die
   * Graduierung stattgefunden hat (M9). */
  gambitsUnlocked: boolean
}

/**
 * Gil/Reunion-Essenz akkumulieren unbegrenzt über den ganzen Run (bzw. über
 * Reunions hinweg) und sind deshalb BigNumber (Architektur §6, Anti-Pattern
 * #10). EXP dagegen ist bereits als `Character.exp` je Figur vorhanden
 * (feinspec §4.1: pro Level gedeckelt durch exp_to_next, nie groß) - ein
 * zusätzliches `currencies.exp` wäre eine redundante, leicht divergierende
 * Kopie derselben Daten und wird hier bewusst nicht übernommen.
 */
export interface SaveCurrencies {
  gil: Decimal
  reunionEssence: Decimal
}

export interface SaveOfflineState {
  lastSeen: number // Unix-Timestamp in Sekunden
}

/** feinspec §4.6 - SaveState (Kapitel-1-Umfang). */
export interface SaveState {
  version: number
  chapter: number
  currentZone: number
  party: Character[]
  roster: string[]
  currencies: SaveCurrencies
  bestiary: Record<string, BestiaryEntry>
  reunionCount: number
  flags: SaveFlags
  offline: SaveOfflineState
}

// feinspec-kapitel1.md §4.6 - SaveState (Kapitel-1-Umfang), + version-Feld für
// Migrationen (Architektur §6).

import type Decimal from 'break_eternity.js'
import type { BestiaryEntry, Character } from '../core/entities'

export const SAVE_VERSION = 6

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
 * Reunion-Essenz akkumuliert unbegrenzt über Reunions hinweg und ist deshalb BigNumber
 * (Architektur §6, Anti-Pattern #10). Gil ist am 30.07.2026 gestrichen (M15,
 * oekonomie-waehrungen.md "Gil ist gestrichen") - EXP ist seither die einzige
 * Run-Währung und steht als `partyExp` direkt im SaveState (feinspec §4.1: pro Level
 * gedeckelt durch exp_to_next, nie groß) - ein zusätzliches `currencies.exp` wäre eine
 * redundante, leicht divergierende Kopie derselben Daten und wird hier bewusst nicht
 * übernommen.
 */
export interface SaveCurrencies {
  reunionEssence: Decimal
}

/** feinspec §3.8b - "nach diesem Kampf ins Gasthaus", greift erst nach Kampfende. */
export interface SaveInnState {
  queued: boolean
}

/** feinspec §4.6 - SaveState (Kapitel-1-Umfang). */
export interface SaveState {
  version: number
  chapter: number
  currentZone: number
  /** feinspec §3.8a/§4.6 - höchste je erreichte Zone; Obergrenze der freien Zonen-Auswahl (Ventil). */
  maxZoneReached: number
  /** prestige-reunion.md, Umsetzungsentscheidung 61 (31.07.2026) - Vaultron (Zone 30) tatsaechlich
   * besiegt, nicht nur erreicht. Eigenes Flag statt `currentZone >= CHAPTER1_MAX_ZONE`, weil Zone 30
   * schon beim BETRETEN erreicht ist, bevor der Kampf entschieden wurde. Traegt `canReunion`. */
  chapterBossDefeated: boolean
  party: Character[]
  /**
   * stats-kampfwerte.md §4.1 - **ein** Level für die gesamte Party; EXP fließt in einen Topf.
   * Neu hinzustoßende Figuren stehen damit sofort auf dem aktuellen Stand (das war der Grund
   * für die Umstellung: mit Charakter-Leveln kam Barrel in Zone 9 als L1 zu einem L~9-Claude).
   */
  partyLevel: number
  /** stats-kampfwerte.md §4.1 - EXP-Topf der Party; Überschuss über `exp_to_next` wird übertragen. */
  partyExp: number
  roster: string[]
  currencies: SaveCurrencies
  bestiary: Record<string, BestiaryEntry>
  reunionCount: number
  flags: SaveFlags
  inn: SaveInnState
  /**
   * ui-layout.md "Mechanik-Einführung" (M17) - je gesehene Einführung (`content/introductions.ts`
   * `IntroId`) ein Eintrag. Lose als `Record<string, boolean>` statt `IntroId` typisiert (wie
   * `bestiary` lose auf Monster-IDs statt einem Content-Enum haengt) - der Save-Layer soll nicht
   * von `content/` importieren. Uebersteht die Reunion wie `bestiary`/`roster` (kein expliziter
   * Reset in `reunion()`, s. `ui/gameStore.svelte.ts`).
   */
  introsSeen: Record<string, boolean>
  // "offline" entfaellt - Offline-Progress stillgelegt (feinspec §3.8e, M11)
}

// Datenmodelle nach feinspec-kapitel1.md §4.1-4.5. Feldnamen 1:1 aus den
// JSON-Schemas der Feinspec übernommen, Code auf Englisch (Projektregel).

export type ControlMode = 'auto' | 'manual'

/** feinspec §4.1/§6.1 - Basis-/abgeleitete Kernwerte einer Figur oder eines Monsters. */
export interface StatBlock {
  hp: number
  mp: number
  atk: number
  mag: number
  def: number
  spd: number
}

/** feinspec §2 - Wachstumsraten pro Gruppenlevel (multiplikativ). MP wächst separat (formulas.ts). */
export interface GrowthRates {
  hp: number
  atk: number
  mag: number
  def: number
  spd: number
}

export interface CharacterSpecial {
  id: string
  mpCost: number
  unlockedFromZone: number
}

/**
 * feinspec §4.1 - Character (Laufzeit-Instanz).
 *
 * Kein `level`/`exp` je Figur: `stats-kampfwerte.md` §4.1 legt **ein** Gruppenlevel für die
 * gesamte Party fest (`SaveState.partyLevel`/`partyExp`). Die Figur trägt nur noch, was sie
 * unterscheidet (Basiswerte, Wachstumsraten, Waffe) - das Wachstum kommt von außen.
 */
export interface Character {
  id: string
  name: string
  base: StatBlock
  growth: GrowthRates
  special: CharacterSpecial
  /**
   * feinspec §4.1/§6.4 (30.07.2026) - permanenter Zonen-Trigger statt Gil-Kauf. Einmal true,
   * bleibt es true - auch ueber die Reunion hinweg (s. `ui/gameStore.svelte.ts` `reunion()`).
   * `special.unlockedFromZone` bleibt das Content-Metadatum fuer den Ausloese-Zeitpunkt.
   */
  specialUnlocked: boolean
  controlMode: ControlMode
  // Laufzeit:
  hp: number
  mp: number
  atb: number
  limit: number
}

/** feinspec §4.2 - Trait-Enum (Kapitel 1). */
export type MonsterTrait =
  | 'baseline'
  | 'fast'
  | 'armor'
  | 'fireweak'
  | 'bomb'
  | 'poison'
  | 'drain'
  | 'boss'

export interface MonsterBaseStats {
  hp: number
  atk: number
  def: number
  spd: number
}

export interface MonsterReward {
  exp: number
}

/** feinspec §4.2 - Monster (Katalog-Eintrag). */
export interface Monster {
  id: string
  name: string
  base: MonsterBaseStats
  reward: MonsterReward
  trait: MonsterTrait
  weaknessTag: string | null // z.B. "fire" - in Kapitel 1 reiner Teaser, nicht nutzbar
  shockAffinity: 'neutral' // Kapitel 1: nur neutral; weitere Werte erst mit Element-Materia (Kap. 2)
  sprite: string
}

export interface EncounterMonsterRef {
  monster: string // Monster-ID
  size: number // Stat-Größenvariante (±15%), wirkt auf HP (§3.7)
}

/** feinspec §4.3 - Encounter/Zone. */
export interface Zone {
  zone: number
  region: 1 | 2 | 3
  waves: EncounterMonsterRef[][]
  isGate: boolean
  /** feinspec §3.4 - Esper-Modell: Limit existiert NUR in Encountern mit true (in Kap. 1 die drei Gates). */
  limitAllowed: boolean
}

/** feinspec §4.5 - Bestiarium-Eintrag. */
export interface BestiaryEntry {
  monsterId: string
  discovered: boolean
  weaknessRevealed: string | null
  weaknessUsable: boolean
  persistsThroughReunion: boolean
}

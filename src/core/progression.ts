// feinspec-kapitel1.md §3.6 - EXP/Level-Anwendung nach einem Zonensieg, geteilt
// zwischen der Offline-Projektion (offline.ts) und dem Live-Tick-Loop (ui/gameStore),
// damit beide dieselbe Level-Up-Regel verwenden (Architektur §7: eine Ökonomie).

import { MONSTERS } from '../content/monsters'
import { ZONES } from '../content/zones'
import { deriveCharacterMaxHp, deriveCharacterMaxMp } from './battle'
import type { Character, Zone } from './entities'
import {
  applyExpGain,
  expDampingFactor,
  hpGainPostVictory,
  innGain,
  mpGainPostVictory,
  scaleEnemyStat,
} from './formulas'
import type { ExpGainResult } from './formulas'

/**
 * feinspec §3.6 - EXP eines Sieges auf den PARTY-Topf anwenden (stats-kampfwerte.md §4.1:
 * ein Level fuer die ganze Party, kein Level je Figur). Ein Level-Up aendert nur Level und
 * damit die Maximalwerte, KEINE Heilung (M11-Revision, §3.5/§3.8d/§11: HP/MP sind
 * Übertragswerte mit genau zwei Kanälen - Sieg-Erholung (§3.5) und Gasthaus (§3.8b). Ein
 * impliziter dritter "Level-Up heilt voll"-Kanal würde die HP-Signalregel §3.8d unterlaufen).
 * `hp`/`mp` der Figuren bleiben unverändert und sind nach einem Level-Up automatisch gültig,
 * da das Maximum bei einem Level-Up nie sinkt.
 */
export function applyVictoryExp(partyLevel: number, partyExp: number, gainedExp: number): ExpGainResult {
  return applyExpGain(partyLevel, partyExp, gainedExp)
}

/** feinspec §3.5/§3.8d - Kanal 1: +25% des Maximums auf HP UND MP nach jedem Sieg, gedeckelt am Maximum. */
export function applyVictoryRecovery(character: Character, partyLevel: number, boostMult = 1): Character {
  const maxHp = deriveCharacterMaxHp(character, partyLevel, boostMult)
  const maxMp = deriveCharacterMaxMp(character, partyLevel, boostMult)
  return {
    ...character,
    hp: Math.min(maxHp, character.hp + hpGainPostVictory(maxHp)),
    mp: Math.min(maxMp, character.mp + mpGainPostVictory(maxMp)),
  }
}

/** feinspec §3.8b - Kanal 2: Gasthaus-Erholung über `seconds` (nur der Anteil NACH der Totzeit darf hier ankommen). */
export function applyInnRecovery(
  character: Character,
  partyLevel: number,
  seconds: number,
  boostMult = 1,
): Character {
  if (seconds <= 0) return character
  const maxHp = deriveCharacterMaxHp(character, partyLevel, boostMult)
  const maxMp = deriveCharacterMaxMp(character, partyLevel, boostMult)
  return {
    ...character,
    hp: Math.min(maxHp, character.hp + innGain(maxHp, seconds)),
    mp: Math.min(maxMp, character.mp + innGain(maxMp, seconds)),
  }
}

export interface ZoneReward {
  exp: number
}

/** feinspec §3.6/§6.2/§6.3 - ungedaempfte Wellen-Summe (vor der Level-x-Zone-Daempfung §1a). */
function rawZoneExp(zone: Zone): number {
  let exp = 0
  for (const ref of zone.waves[0]) {
    exp += scaleEnemyStat(MONSTERS[ref.monster].reward.exp, zone.zone)
  }
  return exp
}

/**
 * oekonomie-waehrungen.md §1a - "erwartetes Level je Zone, aus der Zonen-Kurve abgeleitet,
 * nicht als Tabelle gepflegt": eine Referenz-Vorwaertssimulation ueber die echten
 * Zonen-/Monster-Content-Daten und die echte EXP-Kurve, GENAU EIN ungedaempfter Sieg je
 * Zone (die Kapitel-Grundannahme "~1 Levelaufstieg pro Zone", feinspec §2). Das Ergebnis ist
 * das Level, mit dem eine exakt im Plan liegende Party an einer Zone ankommt - keine von Hand
 * gepflegte Zahl, sondern eine reine Funktion der bestehenden Konstanten/Content-Tabellen.
 * Einmal berechnet und gecacht (Zonen-/Monster-Content ist zur Laufzeit unveraenderlich).
 */
let expectedLevelCache: number[] | null = null

function computeExpectedLevels(): number[] {
  const levels: number[] = []
  let level = 1
  let exp = 0
  for (const z of ZONES) {
    levels[z.zone] = level
    const leveled = applyExpGain(level, exp, rawZoneExp(z))
    level = leveled.level
    exp = leveled.exp
  }
  return levels
}

export function expectedLevelForZone(zoneIndex: number): number {
  if (!expectedLevelCache) expectedLevelCache = computeExpectedLevels()
  const clamped = Math.min(Math.max(zoneIndex, 1), expectedLevelCache.length - 1)
  return expectedLevelCache[clamped]
}

/**
 * feinspec §3.6/§6.2/§6.3 - Summe aus EXP aller Monster einer Zonen-Welle, zonen-skaliert und
 * über die Level-x-Zone-Dämpfung (§1a) auf `partyLevel` bezogen. Die Summe geht als **ein**
 * Betrag in den Party-Topf (stats-kampfwerte.md §4.1). `gil` ist seit dem 30.07.2026 gestrichen
 * (oekonomie-waehrungen.md, "Gil ist gestrichen") - EXP ist die einzige Run-Währung.
 */
export function zoneReward(zone: Zone, partyLevel: number): ZoneReward {
  const raw = rawZoneExp(zone)
  const factor = expDampingFactor(partyLevel, expectedLevelForZone(zone.zone))
  // §1a "nie auf 0" gilt fuer den tatsaechlichen Ertrag, nicht nur den abstrakten Faktor -
  // sonst waere die staerkste Daempfungsstufe bei kleinen Zonen-EXP-Werten ein stiller Deadlock.
  return { exp: Math.max(1, Math.round(raw * factor)) }
}

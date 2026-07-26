// feinspec-kapitel1.md §3.6 - EXP/Level-Anwendung nach einem Zonensieg, geteilt
// zwischen der Offline-Projektion (offline.ts) und dem Live-Tick-Loop (ui/gameStore),
// damit beide dieselbe Level-Up-Regel verwenden (Architektur §7: eine Ökonomie).

import { MONSTERS } from '../content/monsters'
import { deriveCharacterMaxHp, deriveCharacterMaxMp } from './battle'
import type { Character, Zone } from './entities'
import { applyExpGain, hpGainPostVictory, innGain, mpGainPostVictory, scaleEnemyStat } from './formulas'
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
  gil: number
}

/**
 * feinspec §3.6/§6.2/§6.3 - Summe aus EXP/Gil aller Monster einer Zonen-Welle, zonen-skaliert.
 * Die Summe geht als **ein** Betrag in den Party-Topf (stats-kampfwerte.md §4.1).
 */
export function zoneReward(zone: Zone): ZoneReward {
  let exp = 0
  let gil = 0
  for (const ref of zone.waves[0]) {
    const monster = MONSTERS[ref.monster]
    exp += scaleEnemyStat(monster.reward.exp, zone.zone)
    gil += scaleEnemyStat(monster.reward.gil, zone.zone)
  }
  return { exp, gil }
}

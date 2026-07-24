// feinspec-kapitel1.md §3.6 - EXP/Level-Anwendung nach einem Zonensieg, geteilt
// zwischen der Offline-Projektion (offline.ts) und dem Live-Tick-Loop (ui/gameStore),
// damit beide dieselbe Level-Up-Regel verwenden (Architektur §7: eine Ökonomie).

import { MONSTERS } from '../content/monsters'
import { deriveCharacterMaxHp, deriveCharacterMaxMp } from './battle'
import type { Character, Zone } from './entities'
import { applyExpGain, scaleEnemyStat } from './formulas'

/**
 * feinspec §3.6 - EXP anwenden; bei Levelaufstieg volle Heilung (HP/MP), wie in der Referenzsimulation.
 * `boostMult` = prestige-reunion.md permanenter Reunion-Boost (M9, default 1 = kein Boost).
 */
export function applyVictoryExp(character: Character, gainedExp: number, boostMult = 1): Character {
  const gained = applyExpGain(character.level, character.exp, gainedExp)
  if (gained.level === character.level) {
    return { ...character, exp: gained.exp }
  }
  const leveled: Character = { ...character, level: gained.level, exp: gained.exp }
  return { ...leveled, hp: deriveCharacterMaxHp(leveled, boostMult), mp: deriveCharacterMaxMp(leveled, boostMult) }
}

export interface ZoneReward {
  exp: number
  gil: number
}

/** feinspec §3.6/§6.2/§6.3 - Summe aus EXP/Gil aller Monster einer Zonen-Welle, zonen-skaliert. */
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

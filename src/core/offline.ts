// Offline-/Resume-Projektionsrechner (Architektur §5). Weil Kampf komplett
// deterministisch ist, muss Abwesenheit nicht Tick für Tick nachsimuliert
// werden: ein Zonen-Durchlauf wird EINMAL headless simuliert (fester
// timePerClear/rewardPerClear), daraus wird `repeats` aus der verstrichenen
// Zeit hochgerechnet (OFFLINE_CAP/OFFLINE_RATE angewandt). Schafft die Party
// die aktuelle Zone (noch) nicht, liefert die Simulation eine Niederlage - das
// Retry-Zeitstrafen-Muster ergibt sich dann von selbst (kein Fortschritt, aber
// auch kein Crash, niederlage-offline.md §3), ohne Sonderfall-Code.

import Decimal from 'break_eternity.js'
import { GATE_MONSTER_IDS, MONSTERS } from '../content/monsters'
import { ZONES } from '../content/zones'
import { createEnemyUnit, createPartyUnit, deriveCharacterMaxHp, deriveCharacterMaxMp } from './battle'
import type { Character, Zone } from './entities'
import { RETRY_PENALTY, applyExpGain, scaleEnemyStat } from './formulas'
import { createBattleState, simulateBattle } from './tick'

export const OFFLINE_CAP_SECONDS = 8 * 60 * 60 // feinspec §2: Offline-Deckel 8h
export const OFFLINE_RATE = 0.6 // feinspec §2: Offline-Rate 60% der Aktiv-Rate

function findZone(zoneIndex: number): Zone {
  const zone = ZONES.find((z) => z.zone === zoneIndex)
  if (!zone) throw new Error(`Zone ${zoneIndex} nicht gefunden`)
  return zone
}

function isGateZone(zone: Zone): boolean {
  return zone.waves[0].some((ref) => GATE_MONSTER_IDS.has(ref.monster))
}

function zoneRewardPerClear(zone: Zone): { exp: number; gil: number } {
  let exp = 0
  let gil = 0
  for (const ref of zone.waves[0]) {
    const monster = MONSTERS[ref.monster]
    exp += scaleEnemyStat(monster.reward.exp, zone.zone)
    gil += scaleEnemyStat(monster.reward.gil, zone.zone)
  }
  return { exp, gil }
}

export interface OfflineProjection {
  elapsedSeconds: number
  budgetSeconds: number
  repeats: number
  timePerClearSeconds: number
  wasClearing: boolean
  /** Fortgeschriebener Party-Zustand (Level/EXP/HP/MP); unverändert, wenn nicht schaffbar. */
  party: Character[]
  gilGained: Decimal
}

/** Architektur §5, Schritt 1-5: Offline-/Resume-Projektion für die aktuelle Zone. */
export function projectOffline(party: Character[], zoneIndex: number, elapsedSeconds: number): OfflineProjection {
  const zone = findZone(zoneIndex)
  const budgetSeconds = Math.min(elapsedSeconds, OFFLINE_CAP_SECONDS) * OFFLINE_RATE

  const battleUnits = party.map((c) => createPartyUnit(c, zoneIndex))
  const enemyUnits = zone.waves[0].map((ref) => createEnemyUnit(MONSTERS[ref.monster], zoneIndex, ref.size))
  const state = createBattleState(battleUnits, enemyUnits, isGateZone(zone))
  const battleResult = simulateBattle(state)

  const wasClearing = battleResult.win
  const timePerClearSeconds = wasClearing ? battleResult.timeSeconds : battleResult.timeSeconds + RETRY_PENALTY
  const repeats = Math.max(0, Math.floor(budgetSeconds / timePerClearSeconds))

  if (!wasClearing || repeats <= 0) {
    return {
      elapsedSeconds,
      budgetSeconds,
      repeats,
      timePerClearSeconds,
      wasClearing,
      party,
      gilGained: new Decimal(0),
    }
  }

  const reward = zoneRewardPerClear(zone)
  const totalExp = reward.exp * repeats
  const gilGained = new Decimal(reward.gil).mul(repeats)

  const updatedParty = party.map((character) => {
    const gained = applyExpGain(character.level, character.exp, totalExp)
    if (gained.level === character.level) {
      return { ...character, exp: gained.exp }
    }
    const leveled: Character = { ...character, level: gained.level, exp: gained.exp }
    return { ...leveled, hp: deriveCharacterMaxHp(leveled), mp: deriveCharacterMaxMp(leveled) }
  })

  return {
    elapsedSeconds,
    budgetSeconds,
    repeats,
    timePerClearSeconds,
    wasClearing,
    party: updatedParty,
    gilGained,
  }
}

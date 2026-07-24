// Offline-/Resume-Projektionsrechner (Architektur §5). Weil Kampf komplett
// deterministisch ist, muss Abwesenheit nicht Tick für Tick nachsimuliert
// werden: ein Zonen-Durchlauf wird EINMAL headless simuliert (fester
// timePerClear/rewardPerClear), daraus wird `repeats` aus der verstrichenen
// Zeit hochgerechnet (OFFLINE_CAP/OFFLINE_RATE angewandt). Schafft die Party
// die aktuelle Zone (noch) nicht, liefert die Simulation eine Niederlage - das
// Retry-Zeitstrafen-Muster ergibt sich dann von selbst (kein Fortschritt, aber
// auch kein Crash, niederlage-offline.md §3), ohne Sonderfall-Code.

import Decimal from 'break_eternity.js'
import { MONSTERS } from '../content/monsters'
import { ZONES } from '../content/zones'
import { createEnemyUnit, createPartyUnit } from './battle'
import type { Character, Zone } from './entities'
import { RETRY_PENALTY } from './formulas'
import { applyVictoryExp, zoneReward } from './progression'
import { createBattleState, simulateBattle } from './tick'

export const OFFLINE_CAP_SECONDS = 8 * 60 * 60 // feinspec §2: Offline-Deckel 8h
export const OFFLINE_RATE = 0.6 // feinspec §2: Offline-Rate 60% der Aktiv-Rate

function findZone(zoneIndex: number): Zone {
  const zone = ZONES.find((z) => z.zone === zoneIndex)
  if (!zone) throw new Error(`Zone ${zoneIndex} nicht gefunden`)
  return zone
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

/**
 * Architektur §5, Schritt 1-5: Offline-/Resume-Projektion für die aktuelle Zone.
 * `boostMult` = prestige-reunion.md permanenter Reunion-Boost (M9, default 1 = kein Boost).
 */
export function projectOffline(
  party: Character[],
  zoneIndex: number,
  elapsedSeconds: number,
  boostMult = 1,
): OfflineProjection {
  const zone = findZone(zoneIndex)
  const budgetSeconds = Math.min(elapsedSeconds, OFFLINE_CAP_SECONDS) * OFFLINE_RATE

  // Offline laeuft immer im dumben Auto-Modus (niemand ist da, um manuell
  // einzugreifen) - an einem Gate ist das gewollt oft ein "kein Fortschritt"-
  // Ergebnis (niederlage-offline.md §3), kein Sonderfall noetig. Wichtig: vor
  // `manualToggleUnlocked` (Zone < 5) ist jede Figur im Save faktisch "manual"
  // (feinspec §5.1) - `simulateBattle` unterstuetzt aber keine Bedenkzeit-Pause
  // (kein Spieler da, der waehlt), daher hier hart auf "auto" ueberschrieben,
  // unabhaengig vom gespeicherten `controlMode` (der bleibt im zurueckgegebenen
  // `party` unveraendert, nur die interne Simulation zwingt Auto).
  const battleUnits = party.map((c) => createPartyUnit({ ...c, controlMode: 'auto' }, zoneIndex, boostMult))
  const enemyUnits = zone.waves[0].map((ref) => createEnemyUnit(MONSTERS[ref.monster], zoneIndex, ref.size))
  const state = createBattleState(battleUnits, enemyUnits)
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

  const reward = zoneReward(zone)
  const totalExp = reward.exp * repeats
  const gilGained = new Decimal(reward.gil).mul(repeats)

  const updatedParty = party.map((character) => applyVictoryExp(character, totalExp, boostMult))

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

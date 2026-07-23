import { describe, expect, it } from 'vitest'
import { CHARACTERS } from '../src/content/characters'
import { GATE_MONSTER_IDS, MONSTERS } from '../src/content/monsters'
import { ZONES } from '../src/content/zones'
import { weaponTierForLevel } from '../src/content/weapons'
import { createEnemyUnit, createPartyUnit, type BattleUnit } from '../src/core/battle'
import { resolveOptimalAction } from '../src/core/gambits'
import { battleTick, createBattleState, DT, type BattleState, type BattleSimResult } from '../src/core/tick'
import { RETRY_PENALTY, applyExpGain, scaleEnemyStat } from '../src/core/formulas'
import type { Character } from '../src/core/entities'

// Headless Kapitel-1-Durchlauf (Zone 1 -> 30, inkl. Niederlage-Retry-Schleife),
// 1:1 nach `run_realistic()` aus der validierten Referenzsimulation
// (docs/spec/assets/sim/sim_chapter1.py). Dies ist der wichtigste Qualitäts-Gate
// aus dem Implementierungsplan (M3): er beweist, dass die TS-Engine dieselbe
// simulationsvalidierte Baseline trifft wie sim_chapter1.py (feinspec §7.4).
//
// Playtest-Korrektur (nach M7): Auto ist vor der 1. Reunion bewusst stumpf
// (nur Angriff, s. `core/gambits.ts` resolvePartyAction) - Specials/Heal/
// Suppress/Limit sind nur über manuelle Steuerung erreichbar. Der realistische
// Durchlauf modelliert deshalb "Auto in der Fläche, Manuell an den drei Gates"
// (gambits.md §4 "manuelle Prüfsteine"); ein zweiter Durchlauf prüft zusätzlich,
// dass reines Idle (nie manuell, auch nicht an Gates) über Grind allein noch
// durchkommt - nur mit spürbar mehr Retries.

type CharacterId = 'claude' | 'barrel' | 'tofa' | 'arris'
type Region = 1 | 2 | 3

function regionOf(zoneIndex: number): Region {
  if (zoneIndex <= 8) return 1
  if (zoneIndex <= 18) return 2
  return 3
}

function rosterForZone(zoneIndex: number): CharacterId[] {
  const roster: CharacterId[] = ['claude']
  if (zoneIndex >= 9) roster.push('barrel')
  if (zoneIndex >= 19) roster.push('tofa', 'arris')
  return roster
}

function findZone(zoneIndex: number) {
  const zone = ZONES.find((z) => z.zone === zoneIndex)
  if (!zone) throw new Error(`Zone ${zoneIndex} nicht gefunden`)
  return zone
}

function buildParty(zoneIndex: number, levels: Record<CharacterId, number>, manual: boolean) {
  return rosterForZone(zoneIndex).map((id) => {
    const level = levels[id]
    const character: Character = {
      ...CHARACTERS[id],
      level,
      weaponTier: weaponTierForLevel(level),
      controlMode: manual ? 'manual' : 'auto',
    }
    return createPartyUnit(character, zoneIndex)
  })
}

function buildEnemies(zoneIndex: number) {
  const zone = findZone(zoneIndex)
  return zone.waves[0].map((ref) => createEnemyUnit(MONSTERS[ref.monster], zoneIndex, ref.size))
}

function isGateZone(zoneIndex: number): boolean {
  return findZone(zoneIndex).waves[0].some((ref) => GATE_MONSTER_IDS.has(ref.monster))
}

function zoneReward(zoneIndex: number): { exp: number; gil: number } {
  const zone = findZone(zoneIndex)
  let exp = 0
  let gil = 0
  for (const ref of zone.waves[0]) {
    const monster = MONSTERS[ref.monster]
    exp += scaleEnemyStat(monster.reward.exp, zoneIndex)
    gil += scaleEnemyStat(monster.reward.gil, zoneIndex)
  }
  return { exp, gil }
}

function awardExp(
  levels: Record<CharacterId, number>,
  expPool: Record<CharacterId, number>,
  ids: CharacterId[],
  gained: number,
): void {
  for (const id of ids) {
    const result = applyExpGain(levels[id], expPool[id], gained)
    levels[id] = result.level
    expPool[id] = result.exp
  }
}

/**
 * Treibt einen manuell pausierten Kampf zu Ende, indem jede Bedenkzeit-Pause
 * über `resolveOptimalAction` aufgelöst wird (aufmerksames manuelles Spiel:
 * Special/Heal/Suppress/Limit klug eingesetzt, s. `core/gambits.ts`). Bei
 * `manual=false` pausiert nie jemand, verhält sich also identisch zu
 * `simulateBattle` (reiner Auto-Angriff).
 */
function simulateWithManualPolicy(state: BattleState, maxSeconds = 600): BattleSimResult {
  let t = 0
  while (t < maxSeconds) {
    const result = battleTick(state, DT)
    if (result === 'win') return { win: true, timeSeconds: t }
    if (result === 'loss') return { win: false, timeSeconds: t }
    if (result === 'paused') {
      const unit = state.awaitingPlayerChoice as BattleUnit
      resolveOptimalAction(unit, state.party, state.enemies)
      unit.atb = 0
      state.awaitingPlayerChoice = null
      continue // Wait-Modus: die Bedenkzeit selbst kostet keine Simulationszeit.
    }
    t += DT
  }
  return { win: false, timeSeconds: t, timedOut: true }
}

function runOneBattle(zoneIndex: number, levels: Record<CharacterId, number>, manualAtGates: boolean) {
  const manual = manualAtGates && isGateZone(zoneIndex)
  const party = buildParty(zoneIndex, levels, manual)
  const enemies = buildEnemies(zoneIndex)
  const state = createBattleState(party, enemies)
  const result = simulateWithManualPolicy(state)
  return { result, partyIds: party.map((p) => p.id as CharacterId) }
}

interface ZoneRow {
  zone: number
  region: Region
  isGate: boolean
  retries: number
}

interface PlaythroughSummary {
  rows: ZoneRow[]
  totalMinutes: number
  regionMinutes: Record<Region, number>
  grindBattles: number
  levels: Record<CharacterId, number>
  gil: number
}

/**
 * @param manualAtGates true = realistische Spielweise (Auto in der Fläche,
 *   manuell an den drei Gates); false = reines Idle, nie manuell - validiert
 *   die Behauptung "mit genug Grind kommt man auch rein idle durch".
 */
function runRealisticPlaythrough(manualAtGates: boolean, maxGrindPerZone = 2000): PlaythroughSummary {
  const levels: Record<CharacterId, number> = { claude: 1, barrel: 1, tofa: 1, arris: 1 }
  const expPool: Record<CharacterId, number> = { claude: 0, barrel: 0, tofa: 0, arris: 0 }
  let gil = 0
  let totalSeconds = 0
  const regionSeconds: Record<Region, number> = { 1: 0, 2: 0, 3: 0 }
  let grindBattles = 0
  let lastClear: number | null = null
  const rows: ZoneRow[] = []

  for (let zoneIndex = 1; zoneIndex <= 30; zoneIndex++) {
    const region = regionOf(zoneIndex)
    let retries = 0

    for (let grindHere = 0; ; grindHere++) {
      const { result, partyIds } = runOneBattle(zoneIndex, levels, manualAtGates)
      totalSeconds += result.timeSeconds
      regionSeconds[region] += result.timeSeconds

      if (result.win) {
        const reward = zoneReward(zoneIndex)
        awardExp(levels, expPool, partyIds, reward.exp)
        gil += reward.gil
        lastClear = zoneIndex
        break
      }

      // Niederlage: Zeitstrafe, dann Grind-Kampf an der letzten geschafften Zone.
      totalSeconds += RETRY_PENALTY
      regionSeconds[region] += RETRY_PENALTY
      retries += 1

      const grindZone = lastClear ?? zoneIndex
      const grind = runOneBattle(grindZone, levels, manualAtGates)
      totalSeconds += grind.result.timeSeconds
      regionSeconds[region] += grind.result.timeSeconds
      if (grind.result.win) {
        const reward = zoneReward(grindZone)
        awardExp(levels, expPool, grind.partyIds, reward.exp)
        gil += reward.gil
      }
      grindBattles += 1

      if (grindHere > maxGrindPerZone) {
        throw new Error(`Zone ${zoneIndex} nicht schaffbar (Balance-Problem)`)
      }
    }

    rows.push({ zone: zoneIndex, region, isGate: isGateZone(zoneIndex), retries })
  }

  return {
    rows,
    totalMinutes: totalSeconds / 60,
    regionMinutes: { 1: regionSeconds[1] / 60, 2: regionSeconds[2] / 60, 3: regionSeconds[3] / 60 },
    grindBattles,
    levels,
    gil,
  }
}

describe('feinspec §7.4 Pacing - realistischer Durchlauf (Auto in der Fläche, Manuell an Gates)', () => {
  it('reproduziert die neu simulierte Pacing-Baseline (Region 1 ~7,4 / Region 2 ~3,5 / Region 3 ~4,7 / gesamt ~15,6 min)', () => {
    const summary = runRealisticPlaythrough(true)

    // Neu validiert nach dem Playtest-Fund "Auto = nur Angriff vor Reunion":
    // Region 1 wächst spürbar (Zone 6 wird ohne Auto-Special/-Heal zur
    // Grind-Wand, ~8 Retries), Region 2/3 werden dafür schneller (die Party
    // kommt bereits übergelevelt an, und Manuell+Limit-Priorität an den Gates
    // schlägt sogar die alte Auto-Heuristik). Gesamtbild bleibt im selben
    // Rahmen wie die alte Baseline (~12-13 min), nur anders verteilt.
    expect(summary.regionMinutes[1]).toBeGreaterThan(4.0)
    expect(summary.regionMinutes[1]).toBeLessThan(11.0)
    expect(summary.regionMinutes[2]).toBeGreaterThan(1.5)
    expect(summary.regionMinutes[2]).toBeLessThan(6.0)
    expect(summary.regionMinutes[3]).toBeGreaterThan(2.0)
    expect(summary.regionMinutes[3]).toBeLessThan(8.0)
    expect(summary.totalMinutes).toBeGreaterThan(10)
    expect(summary.totalMinutes).toBeLessThan(22)

    // Referenz: Claude-Levelspanne 1 -> ~18.
    expect(summary.levels.claude).toBeGreaterThanOrEqual(14)
    expect(summary.levels.claude).toBeLessThanOrEqual(24)

    // Gates: manuelles Spiel + Limit-Priorität macht sie trivial (0 Retries in
    // der Simulation) - klar besser als die alte Auto-Heuristik (§7.4 vorher:
    // Z18 ~2, Z30 ~6), weil "manuell + Limit sofort bei voller Leiste" strikt
    // stärker ist als die frühere Spezial-zuerst-Heuristik.
    const z8 = summary.rows.find((r) => r.zone === 8)!
    const z18 = summary.rows.find((r) => r.zone === 18)!
    const z30 = summary.rows.find((r) => r.zone === 30)!
    expect(z8.isGate).toBe(true)
    expect(z18.isGate).toBe(true)
    expect(z30.isGate).toBe(true)
    expect(z8.retries).toBeLessThanOrEqual(2)
    expect(z18.retries).toBeLessThanOrEqual(2)
    expect(z30.retries).toBeLessThanOrEqual(2)
  }, 30000)

  it('ist deterministisch (kein RNG) - zwei Durchläufe liefern identische Ergebnisse', () => {
    const first = runRealisticPlaythrough(true)
    const second = runRealisticPlaythrough(true)
    expect(second.totalMinutes).toBe(first.totalMinutes)
    expect(second.levels).toEqual(first.levels)
    expect(second.gil).toBe(first.gil)
  }, 30000)
})

describe('Playtest-Fund "Auto wirkt wie Zuschauen" - reines Idle (nie manuell) bleibt über Grind schaffbar', () => {
  it('kommt auch ohne jede manuelle Übernahme durchs ganze Kapitel, aber spürbar langsamer und mit mehr Retries an Gates', () => {
    const manual = runRealisticPlaythrough(true)
    const idle = runRealisticPlaythrough(false, 500)

    const idleZ18 = idle.rows.find((r) => r.zone === 18)!
    const idleZ30 = idle.rows.find((r) => r.zone === 30)!
    const manualZ18 = manual.rows.find((r) => r.zone === 18)!
    const manualZ30 = manual.rows.find((r) => r.zone === 30)!

    // Kernbehauptung des neuen Designs: rein idle ist schaffbar (kein Timeout/
    // Balance-Fehler), aber deutlich zäher - sonst würde "an Gates auf
    // Manuell gehen" gar keinen Unterschied machen (gambits.md §4
    // "Idle-Wände... manuell schneller").
    expect(idle.levels.claude).toBeGreaterThan(0)
    expect(idleZ18.retries).toBeGreaterThan(manualZ18.retries)
    expect(idleZ30.retries).toBeGreaterThan(manualZ30.retries)
    expect(idle.totalMinutes).toBeGreaterThan(manual.totalMinutes * 1.5)
  }, 120000)
})

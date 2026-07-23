import { describe, expect, it } from 'vitest'
import { CHARACTERS } from '../src/content/characters'
import { GATE_MONSTER_IDS, MONSTERS } from '../src/content/monsters'
import { ZONES } from '../src/content/zones'
import { weaponTierForLevel } from '../src/content/weapons'
import { createEnemyUnit, createPartyUnit } from '../src/core/battle'
import { createBattleState, simulateBattle } from '../src/core/tick'
import { RETRY_PENALTY, applyExpGain, scaleEnemyStat } from '../src/core/formulas'
import type { Character } from '../src/core/entities'

// Headless Kapitel-1-Durchlauf (Zone 1 -> 30, inkl. Niederlage-Retry-Schleife),
// 1:1 nach `run_realistic()` aus der validierten Referenzsimulation
// (docs/spec/assets/sim/sim_chapter1.py). Dies ist der wichtigste Qualitäts-Gate
// aus dem Implementierungsplan (M3): er beweist, dass die TS-Engine dieselbe
// simulationsvalidierte Baseline trifft wie sim_chapter1.py (feinspec §7.4).

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

function buildParty(zoneIndex: number, levels: Record<CharacterId, number>) {
  return rosterForZone(zoneIndex).map((id) => {
    const level = levels[id]
    const character: Character = { ...CHARACTERS[id], level, weaponTier: weaponTierForLevel(level) }
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

function runOneBattle(zoneIndex: number, levels: Record<CharacterId, number>) {
  const party = buildParty(zoneIndex, levels)
  const enemies = buildEnemies(zoneIndex)
  const state = createBattleState(party, enemies, isGateZone(zoneIndex))
  const result = simulateBattle(state)
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

function runRealisticPlaythrough(): PlaythroughSummary {
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
      const { result, partyIds } = runOneBattle(zoneIndex, levels)
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
      const grind = runOneBattle(grindZone, levels)
      totalSeconds += grind.result.timeSeconds
      regionSeconds[region] += grind.result.timeSeconds
      if (grind.result.win) {
        const reward = zoneReward(grindZone)
        awardExp(levels, expPool, grind.partyIds, reward.exp)
        gil += reward.gil
      }
      grindBattles += 1

      if (grindHere > 400) {
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

describe('feinspec §7.4 Pacing - headless Kapitel-1-Durchlauf (Zone 1 -> 30)', () => {
  it('reproduziert die Pacing-Kennzahlen der Referenztabelle in der Größenordnung', () => {
    const summary = runRealisticPlaythrough()

    // Referenz (§7.4): Region 1 ~1,9 min, Region 2 ~4,2 min, Region 3 ~6,4 min, Gesamt ~12-13 min.
    expect(summary.regionMinutes[1]).toBeGreaterThan(1.0)
    expect(summary.regionMinutes[1]).toBeLessThan(4.0)
    expect(summary.regionMinutes[2]).toBeGreaterThan(2.0)
    expect(summary.regionMinutes[2]).toBeLessThan(8.0)
    expect(summary.regionMinutes[3]).toBeGreaterThan(3.0)
    expect(summary.regionMinutes[3]).toBeLessThan(12.0)
    expect(summary.totalMinutes).toBeGreaterThan(7)
    expect(summary.totalMinutes).toBeLessThan(20)

    // Referenz: Claude-Levelspanne 1 -> ~19.
    expect(summary.levels.claude).toBeGreaterThanOrEqual(14)
    expect(summary.levels.claude).toBeLessThanOrEqual(25)

    // Referenz: Miniboss Z8 ~0 Retries (Limit trägt), R2-Gate Z18 ~2, Kapitel-Wand Z30 ~6 -
    // die härteste Wand des Kapitels, entsprechend die meisten Retries von allen dreien.
    const z8 = summary.rows.find((r) => r.zone === 8)!
    const z18 = summary.rows.find((r) => r.zone === 18)!
    const z30 = summary.rows.find((r) => r.zone === 30)!
    expect(z8.isGate).toBe(true)
    expect(z18.isGate).toBe(true)
    expect(z30.isGate).toBe(true)
    expect(z8.retries).toBeLessThanOrEqual(3)
    expect(z18.retries).toBeLessThanOrEqual(8)
    expect(z30.retries).toBeGreaterThan(z8.retries)
    expect(z30.retries).toBeLessThanOrEqual(20)
  }, 30000)

  it('ist deterministisch (kein RNG) - zwei Durchläufe liefern identische Ergebnisse', () => {
    const first = runRealisticPlaythrough()
    const second = runRealisticPlaythrough()
    expect(second.totalMinutes).toBe(first.totalMinutes)
    expect(second.levels).toEqual(first.levels)
    expect(second.gil).toBe(first.gil)
  }, 30000)
})

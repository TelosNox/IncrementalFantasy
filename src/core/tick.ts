// feinspec-kapitel1.md §5 - Referenz-Tick-Loop (battleTick), 1:1 nach dem
// Pseudocode und der validierten Referenzsimulation
// (docs/spec/assets/sim/sim_chapter1.py: simulate_battle/enemy_act).

import type { BattleUnit } from './battle'
import { aoeParty, isAlive } from './battle'
import { resolvePartyAction } from './gambits'
import { LIMIT_MAX, atbFillPerTick, limitGainOnTaken, physicalDamage } from './formulas'

/** feinspec §2 - Tick-Auflösung des Simulations-/Loop-Takts. */
export const DT = 0.1

export type BattleResult = 'ongoing' | 'paused' | 'win' | 'loss'

export interface BattleState {
  party: BattleUnit[]
  enemies: BattleUnit[]
  awaitingPlayerChoice: BattleUnit | null
  poisonAccumulator: number
}

export function createBattleState(party: BattleUnit[], enemies: BattleUnit[]): BattleState {
  return { party, enemies, awaitingPlayerChoice: null, poisonAccumulator: 0 }
}

function tickPoison(state: BattleState, dt: number): void {
  state.poisonAccumulator += dt
  if (state.poisonAccumulator >= 1.0) {
    state.poisonAccumulator -= 1.0
    for (const p of state.party) {
      if (isAlive(p) && p.poisonTicks > 0) {
        p.hp -= p.poisonDamage
        p.poisonTicks -= 1
      }
    }
  }
}

/** feinspec §5 - `resolveEnemyAction`: bomb/boss/poison/drain-Traits. */
function resolveEnemyAction(actor: BattleUnit, state: BattleState): void {
  const alive = state.party.filter(isAlive)
  if (!alive.length) return

  if (actor.trait === 'bomb' && actor.hitsTaken >= 3) {
    aoeParty(state.party, Math.round(actor.atk * 2.0))
    actor.hp = 0
    return
  }

  if (actor.trait === 'boss') {
    actor.actionsDone += 1
    if (actor.shockTimer <= 0 && actor.actionsDone % 3 === 0) {
      aoeParty(state.party, Math.round(actor.atk * 1.8))
      return
    }
  }

  const tgt = alive.reduce((weakest, p) => (p.hp < weakest.hp ? p : weakest))
  const dmg = physicalDamage(actor.atk, tgt.def)
  tgt.hp -= dmg
  tgt.limit = Math.min(LIMIT_MAX, tgt.limit + limitGainOnTaken(dmg))

  if (actor.trait === 'poison') {
    tgt.poisonTicks = 4
    tgt.poisonDamage = 4
  }
  if (actor.trait === 'drain') {
    const victim = alive.reduce((richest, p) => (p.mp > richest.mp ? p : richest))
    victim.mp -= Math.min(15, victim.mp)
    actor.actionsDone += 1
    if (actor.actionsDone >= 4) actor.fled = true
  }
}

/** feinspec §5 - battleTick-Referenz-Loop inkl. Bedenkzeit-Pause-Guard und Poison-Tick. */
export function battleTick(state: BattleState, dt: number): BattleResult {
  if (state.awaitingPlayerChoice) return 'paused'
  if (!state.enemies.some(isAlive)) return 'win'
  if (!state.party.some(isAlive)) return 'loss'

  tickPoison(state, dt)

  for (const f of [...state.party, ...state.enemies]) {
    if (!isAlive(f)) continue

    const shocked = f.side === 'enemy' && f.shockTimer > 0
    const suppressed = f.suppress > 0
    f.atb += atbFillPerTick(f.spd, dt, { shocked, suppressed })
    if (f.suppress > 0) f.suppress -= dt
    if (f.side === 'enemy' && f.shockTimer > 0) f.shockTimer -= dt

    if (f.atb >= 1.0) {
      if (f.side === 'party' && f.controlMode === 'manual') {
        state.awaitingPlayerChoice = f
        return 'paused'
      }
      f.atb = 0
      if (f.side === 'party') {
        resolvePartyAction(f, state.party, state.enemies)
      } else {
        resolveEnemyAction(f, state)
      }
    }
  }
  return 'ongoing'
}

export interface BattleSimResult {
  win: boolean
  timeSeconds: number
  timedOut?: boolean
}

/**
 * Headless Kampf bis Sieg/Niederlage durchlaufen (kein Rendering). Setzt
 * `controlMode: "auto"` für alle Beteiligten voraus - eine Bedenkzeit-Pause
 * ("paused") ist im headless Modus ein Programmfehler, kein regulärer Zustand.
 */
export function simulateBattle(state: BattleState, maxSeconds = 600): BattleSimResult {
  let t = 0
  while (t < maxSeconds) {
    const result = battleTick(state, DT)
    if (result === 'win') return { win: true, timeSeconds: t }
    if (result === 'loss') return { win: false, timeSeconds: t }
    if (result === 'paused') {
      throw new Error('battleTick pausiert (controlMode "manual") - im headless Modus nicht unterstützt')
    }
    t += DT
  }
  return { win: false, timeSeconds: t, timedOut: true }
}

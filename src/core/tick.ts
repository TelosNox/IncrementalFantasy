// feinspec-kapitel1.md §5 - Referenz-Tick-Loop (battleTick), 1:1 nach dem
// Pseudocode und der validierten Referenzsimulation
// (docs/spec/assets/sim/sim_chapter1.py: simulate_battle/enemy_act).

import type { BattleUnit } from './battle'
import { aoeParty, isAlive } from './battle'
import { resolvePartyAction } from './gambits'
import { LIMIT_MAX, atbFillPerTick, enemyHealAmount, limitGainOnTaken, physicalDamage } from './formulas'

/** feinspec §2 - Tick-Auflösung des Simulations-/Loop-Takts. */
export const DT = 0.1

export type BattleResult = 'ongoing' | 'paused' | 'win' | 'loss'

export interface BattleState {
  party: BattleUnit[]
  enemies: BattleUnit[]
  awaitingPlayerChoice: BattleUnit | null
  poisonAccumulator: number
  /** ui-layout.md "Freischaltungs-Hinweis"/feinspec §5.1 - true fuer den Tick, in dem ein
   * telegrafierter Boss-AoE ausloest (nicht durch Shock ausgesetzt); die UI-Schicht liest das,
   * um `defenseUnlocked` beim ersten Vorkommen freizuschalten (M8). Wird jeden Tick zurueckgesetzt. */
  bossAoeTriggered: boolean
  /**
   * feinspec §3.9 - EIN Ziel fuer die ganze Gruppe (normale Angriffe, gilt auch fuer Auto-Figuren).
   * Index in `enemies` statt Monster-ID: mehrere Gegner derselben Art teilen sich eine ID
   * (z.B. 3x "blando" in Zone 6), nur die Position ist eindeutig. Reset pro Kampf (hier: null bei
   * `createBattleState`), kein Uebertrag zwischen Kaempfen (§3.9). Faellt automatisch zurueck auf
   * die Standardregel (naechststehend), sobald das Ziel stirbt und mehrere Gegner leben -
   * s. `gambits.ts` `resolvePartyTarget`.
   */
  focusTargetIndex: number | null
}

export function createBattleState(party: BattleUnit[], enemies: BattleUnit[]): BattleState {
  return {
    party,
    enemies,
    awaitingPlayerChoice: null,
    poisonAccumulator: 0,
    bossAoeTriggered: false,
    focusTargetIndex: null,
  }
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

  // gegner-encounter.md §5a (M16) - Heiler heilt statt anzugreifen: das verletzteste lebende
  // Gruppenmitglied (sich selbst eingeschlossen), gemessen am HP-Anteil. Ist niemand verletzt,
  // faellt der Zug auf den normalen Angriff unten zurueck (kein wirkungsloser Leerlauf-Zug).
  if (actor.trait === 'heal') {
    const allies = state.enemies.filter(isAlive)
    const hurt = allies.filter((e) => e.hp < e.maxHp)
    if (hurt.length) {
      const target = hurt.reduce((lowest, e) => (e.hp / e.maxHp < lowest.hp / lowest.maxHp ? e : lowest))
      target.hp = Math.min(target.maxHp, target.hp + enemyHealAmount(actor.atk))
      return
    }
  }

  if (actor.trait === 'boss') {
    actor.actionsDone += 1
    // gegner-encounter.md §5a/§7 (M16) - Konter-Telegraf: EINE Aktion vor der AoE laedt der Boss
    // auf statt zu handeln (dieselbe Aktion, die die UI bereits als "Mako core charging..."
    // anzeigt, s. `Stage.svelte` - der Telegraf existierte schon, `counterActive` haengt sich nur
    // dran). Waehrenddessen kontert der erste erlittene Treffer (`battle.ts` `dealDamage`). Nur
    // fuer Monster mit `counterStance` (in Kapitel 1 nur Vaultron) - dosierbar pro Boss.
    if (actor.counterStance && actor.actionsDone % 3 === 2) {
      actor.counterActive = true
      actor.counterHits = 0
      return
    }
    if (actor.actionsDone % 3 === 0) {
      actor.counterActive = false
      if (actor.shockTimer <= 0) {
        state.bossAoeTriggered = true
        aoeParty(state.party, Math.round(actor.atk * 1.8))
        return
      }
    }
  }

  // gegner-encounter.md §6a - Gegner greifen die Figur mit den hoechsten aktuellen HP an
  // (Playtest-Korrektur: die alte "niedrigste HP"-Regel haette mit dem neuen HP-Uebertrag
  // zu einer Todesspirale gefuehrt - wer angeschlagen in den naechsten Kampf geht, waere
  // sofort wieder Ziel gewesen). Schaden verteilt sich so von selbst; robuste Figuren tanken.
  const tgt = alive.reduce((highest, p) => (p.hp > highest.hp ? p : highest))
  const rawDmg = physicalDamage(actor.atk, tgt.def)
  const dmg = tgt.defending ? Math.round(rawDmg * 0.5) : rawDmg
  tgt.hp -= dmg
  if (tgt.limitAllowed) tgt.limit = Math.min(LIMIT_MAX, tgt.limit + limitGainOnTaken(dmg))

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

  state.bossAoeTriggered = false
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
        resolvePartyAction(f, state)
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

// feinspec-kapitel1.md §4.7 - fest verdrahtete Default-Gambit-Regeln (kein
// programmierbarer Editor in Kapitel 1, der schaltet erst mit der 1. Reunion
// frei). Reihenfolge = erste zutreffende Regel gewinnt. 1:1 nach der
// validierten Referenzsimulation (sim_chapter1.py: choose_and_act/pick_target).
//
// Regel 5 ("Boss anwesend UND Limit voll -> Limit") wird NICHT hier pro Figur
// geprüft, sondern vom Tick-Loop vor dem Gambit-Aufruf behandelt (tick.ts) -
// deckungsgleich mit dem `use_limit_on_gate`-Mechanismus der Referenzsimulation,
// der das Limit-Zünden als Battle-weite Regel an Gate-Zonen umsetzt statt als
// Teil der Charakter-Prioritätsliste.

import type { BattleUnit } from './battle'
import { dealDamage, isAlive } from './battle'
import { MP_REFUND_PER_ATTACK, SHOCK_MAX } from './formulas'

/** Zielwahl-Fallback: zuerst `bomb` entschärfen, dann `drain`, sonst schwächstes Ziel. */
export function pickTarget(targets: BattleUnit[]): BattleUnit {
  const bombs = targets.filter((t) => t.trait === 'bomb')
  if (bombs.length) return weakest(bombs)
  const drains = targets.filter((t) => t.trait === 'drain')
  if (drains.length) return weakest(drains)
  return weakest(targets)
}

function weakest(units: BattleUnit[]): BattleUnit {
  return units.reduce((weakest, u) => (u.hp < weakest.hp ? u : weakest))
}

function strongest(units: BattleUnit[]): BattleUnit {
  return units.reduce((strongest, u) => (u.hp > strongest.hp ? u : strongest))
}

/** feinspec §4.7 - Default-Gambit-Regeln 1-4 + 6 (Regel 5 s.o.) für eine aktionsbereite Party-Figur. */
export function resolvePartyAction(actor: BattleUnit, party: BattleUnit[], enemies: BattleUnit[]): void {
  const targets = enemies.filter(isAlive)
  if (!targets.length) return

  if (!actor.canSpecial) {
    dealDamage(actor, pickTarget(targets), actor.atk)
    actor.mp = Math.min(actor.maxMp, actor.mp + MP_REFUND_PER_ATTACK)
    return
  }

  // Regel 1: Arris heilt, wenn ein Verbündeter unter 45% HP ist und MP reicht.
  if (actor.name === 'Arris') {
    const hurt = party.filter((p) => isAlive(p) && p.hp < 0.45 * p.maxHp)
    if (hurt.length && actor.mp >= actor.specialMpCost!) {
      actor.mp -= actor.specialMpCost!
      const heal = Math.round(actor.mag * 2.2)
      for (const p of party) {
        if (isAlive(p)) p.hp = Math.min(p.maxHp, p.hp + heal)
      }
      actor.limit = Math.min(100, actor.limit + 4)
      return
    }
  }

  // Regel 2: Tofa schlägt Shock, solange das Ziel noch nicht geschockt/im Fenster ist.
  if (actor.name === 'Tofa') {
    const tgt = pickTarget(targets)
    if (actor.mp >= actor.specialMpCost! && tgt.shockTimer <= 0 && tgt.shock < SHOCK_MAX) {
      actor.mp -= actor.specialMpCost!
      dealDamage(actor, tgt, actor.atk, 45)
      return
    }
  }

  // Regel 3: Barrel unterdrückt den schnellsten anwesenden Gegner (SPD >= 140).
  if (actor.name === 'Barrel') {
    const fast = targets.filter((e) => e.spd >= 140)
    if (fast.length && actor.mp >= actor.specialMpCost!) {
      actor.mp -= actor.specialMpCost!
      fast[0].suppress = 4.0
      dealDamage(actor, fast[0], Math.round(actor.atk * 0.8))
      return
    }
  }

  // Regel 4: Claude nutzt seinen Special aufs stärkste (meiste HP) Ziel.
  if (actor.name === 'Claude') {
    const tgt = strongest(targets)
    if (actor.mp >= actor.specialMpCost!) {
      actor.mp -= actor.specialMpCost!
      dealDamage(actor, tgt, Math.round(actor.atk * 3.0))
      return
    }
  }

  // Regel 6: Fallback-Angriff, füllt MP wieder auf.
  dealDamage(actor, pickTarget(targets), actor.atk)
  actor.mp = Math.min(actor.maxMp, actor.mp + MP_REFUND_PER_ATTACK)
}

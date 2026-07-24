// gambits.md §1/§6, feinspec-kapitel1.md §4.7 (überarbeitet, s. Playtest-Fund
// "Auto wirkt wie Zuschauen") - Kapitel 1 kennt vor der 1. Reunion KEINEN
// programmierbaren Gambit-Editor. Was es gibt, ist die "unterste Gambit-Regel"
// (`03_Konzept_Gerüst.md` §5/§15: "stumpfe Auto-Attack sofort, strategische
// Gambits über Reunion") - Auto greift IMMER nur an, nie Special/Heal/Suppress/
// Limit. Diese bleiben bis zur 1. Reunion exklusiv der manuellen Steuerung
// vorbehalten (Aktions-Popup). Das macht aktives Spiel während des GANZEN
// Kapitels lohnend, nicht nur an den drei Gates/Bossen, und ist die Ursache
// dafür, dass die 1. Reunion sich als echte "Erlösung" anfühlt (von stumpfem
// Auto-Attack zu einer klugen, programmierbaren Prioritätsliste).

import type { BattleUnit } from './battle'
import { dealDamage, isAlive } from './battle'
import { LIMIT_MAX, MP_REFUND_PER_ATTACK, SHOCK_MAX, limitFireDamage } from './formulas'

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

/** feinspec §3.4 - Limit-Zünden zielt auf das stärkste (meiste HP) Ziel. */
export function strongest(units: BattleUnit[]): BattleUnit {
  return units.reduce((strongest, u) => (u.hp > strongest.hp ? u : strongest))
}

/**
 * Die einzige Auto-Regel vor der 1. Reunion: Angriff, sonst nichts (kein
 * Special, kein Heal, kein Suppress, kein Limit - diese sind bis zur 1.
 * Reunion nur über die manuelle Steuerung erreichbar). Trägt idle-fähig durch
 * die Mehrheit der Zonen (Ventil-Prinzip), macht aber bewusst keine der drei
 * Gates/Bosse (Blandzilla/Fort Knoxious/Vaultron) idle-trivial - dort lohnt
 * sich manuelles Eingreifen (s. `resolveOptimalAction` unten).
 */
export function resolvePartyAction(actor: BattleUnit, _party: BattleUnit[], enemies: BattleUnit[]): void {
  actor.defending = false // Defend (M8) haelt nur bis zur naechsten eigenen Aktion, auch beim Wechsel auf Auto
  const targets = enemies.filter(isAlive)
  if (!targets.length) return
  dealDamage(actor, pickTarget(targets), actor.atk)
  actor.mp = Math.min(actor.maxMp, actor.mp + MP_REFUND_PER_ATTACK)
}

/**
 * Referenz für "aufmerksames manuelles Spiel" (Special/Heal/Suppress/Limit
 * klug eingesetzt) - das, was ein Spieler über das Aktions-Popup erreichen
 * kann, und später die Vorlage für das ab-Werk-Preset des programmierbaren
 * Gambit-Editors (1. Reunion, `gambits.md` §5). Wird NICHT vom Live-Spiel für
 * Auto-Figuren aufgerufen (dafür ist `resolvePartyAction` da) - dient der
 * Pacing-Simulation (`tests/chapter-playthrough.test.ts`), um zu validieren,
 * dass manuelles Spiel an Gates einen echten Unterschied macht.
 */
export function resolveOptimalAction(actor: BattleUnit, party: BattleUnit[], enemies: BattleUnit[]): void {
  const targets = enemies.filter(isAlive)
  if (!targets.length) return

  // Limit hat Vorrang, sobald voll (feinspec §3.4: Aufsparen ist eine
  // Entscheidung, aber an einem Gate ohne Shock-Fenster gibt es keinen Grund,
  // ein volles Limit weiter zu banken).
  if (actor.limit >= LIMIT_MAX) {
    const target = strongest(targets)
    target.hp -= limitFireDamage(actor.atk, target.def)
    actor.limit = 0
    return
  }

  if (!actor.canSpecial) {
    dealDamage(actor, pickTarget(targets), actor.atk)
    actor.mp = Math.min(actor.maxMp, actor.mp + MP_REFUND_PER_ATTACK)
    return
  }

  if (actor.name === 'Arris') {
    const hurt = party.filter((p) => isAlive(p) && p.hp < 0.45 * p.maxHp)
    if (hurt.length && actor.mp >= actor.specialMpCost!) {
      actor.mp -= actor.specialMpCost!
      const heal = Math.round(actor.mag * 2.2)
      for (const p of party) {
        if (isAlive(p)) p.hp = Math.min(p.maxHp, p.hp + heal)
      }
      actor.limit = Math.min(LIMIT_MAX, actor.limit + 4)
      return
    }
  }

  if (actor.name === 'Tofa') {
    const tgt = pickTarget(targets)
    if (actor.mp >= actor.specialMpCost! && tgt.shockTimer <= 0 && tgt.shock < SHOCK_MAX) {
      actor.mp -= actor.specialMpCost!
      dealDamage(actor, tgt, actor.atk, 45)
      return
    }
  }

  if (actor.name === 'Barrel') {
    const fast = targets.filter((e) => e.spd >= 140)
    const target = fast.length ? fast[0] : strongest(targets)
    if (actor.mp >= actor.specialMpCost!) {
      actor.mp -= actor.specialMpCost!
      target.suppress = 4.0
      dealDamage(actor, target, Math.round(actor.atk * 0.8))
      return
    }
  }

  if (actor.name === 'Claude') {
    const tgt = strongest(targets)
    if (actor.mp >= actor.specialMpCost!) {
      actor.mp -= actor.specialMpCost!
      dealDamage(actor, tgt, Math.round(actor.atk * 3.0))
      return
    }
  }

  dealDamage(actor, pickTarget(targets), actor.atk)
  actor.mp = Math.min(actor.maxMp, actor.mp + MP_REFUND_PER_ATTACK)
}

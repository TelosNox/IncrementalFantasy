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
import type { BattleState } from './tick'
import { LIMIT_MAX, SHOCK_MAX, limitFireDamage } from './formulas'

/**
 * feinspec §3.9 - Partei-Zielwahl fuer normale Angriffe (gilt auch fuer Auto-Figuren).
 * EIN Fokusziel fuer die ganze Gruppe, pro Kampf gesetzt (`state.focusTargetIndex`, ein
 * Index statt einer Monster-ID, weil mehrere Gegner derselben Art dieselbe ID teilen).
 * - Ist ein Fokus gesetzt und lebt das Ziel noch: dieses Ziel.
 * - Stirbt das fokussierte Ziel und lebt nur noch einer: automatisch fokussiert.
 * - Stirbt es und leben mehrere: Ruecksturz auf die Standardregel (naechststehend =
 *   erster lebender Gegner in Array-Reihenfolge), Fokus bleibt bewusst leer, bis der
 *   Spieler neu waehlt oder nur noch ein Gegner lebt - kein Kleben an einem toten Ziel.
 * Gibt `null` zurueck, wenn kein Gegner mehr lebt.
 */
export function resolvePartyTarget(state: BattleState): BattleUnit | null {
  const aliveIndices = state.enemies.reduce<number[]>((acc, e, i) => {
    if (isAlive(e)) acc.push(i)
    return acc
  }, [])
  if (!aliveIndices.length) return null

  if (state.focusTargetIndex !== null && aliveIndices.includes(state.focusTargetIndex)) {
    return state.enemies[state.focusTargetIndex]
  }

  if (aliveIndices.length === 1) {
    state.focusTargetIndex = aliveIndices[0]
    return state.enemies[aliveIndices[0]]
  }

  state.focusTargetIndex = null
  return state.enemies[aliveIndices[0]]
}

/** feinspec §3.4 - Limit-Zünden/Claudes Special zielen auf das stärkste (meiste HP) Ziel. */
export function strongest(units: BattleUnit[]): BattleUnit {
  return units.reduce((strongest, u) => (u.hp > strongest.hp ? u : strongest))
}

/** feinspec §3.9/§4.7 - Barrels Suppress (nur `resolveOptimalAction`): höchster Schadensdurchsatz (ATK * SPD). */
function mostThreatening(units: BattleUnit[]): BattleUnit {
  return units.reduce((worst, u) => (u.atk * u.spd > worst.atk * worst.spd ? u : worst))
}

/**
 * gegner-encounter.md §5a/§7 (M16) - "aufmerksames manuelles Spiel" (nur `resolveOptimalAction`,
 * s. Docblock unten): ein Heiler-Gegner wird immer zuerst getötet (sonst hält er den Rest am
 * Leben), und ein Ziel im telegrafierten Konter-Fenster wird gemieden, solange ein anderes lebt
 * (§3.9-Fokus bleibt dabei unangetastet - nur DIESE Referenz-Policy weicht ab, die sichtbare
 * Vorauswahl im Aktions-Popup kennt weiterhin keine Ausnahmen, feinspec §3.9). Fällt ohne Heiler/
 * Konter-Fenster auf die normale Fokusziel-Regel zurück.
 */
function smartTarget(state: BattleState): BattleUnit | null {
  const alive = state.enemies.filter(isAlive)
  if (!alive.length) return null
  const healer = alive.find((e) => e.trait === 'heal')
  if (healer) return healer
  const focused = resolvePartyTarget(state)
  if (focused && !focused.counterActive) return focused
  const safe = alive.filter((e) => !e.counterActive)
  return safe.length ? safe[0] : focused
}

/**
 * Die einzige Auto-Regel vor der 1. Reunion: Angriff, sonst nichts (kein
 * Special, kein Heal, kein Suppress, kein Limit - diese sind bis zur 1.
 * Reunion nur über die manuelle Steuerung erreichbar). Trägt idle-fähig durch
 * die Mehrheit der Zonen (Ventil-Prinzip), macht aber bewusst keine der drei
 * Gates/Bosse (Blandzilla/Fort Knoxious/Vaultron) idle-trivial - dort lohnt
 * sich manuelles Eingreifen (s. `resolveOptimalAction` unten). Zielwahl: das
 * gesetzte Fokusziel, sonst der nächststehende Gegner (§3.9) - gilt auch hier,
 * das Fokusziel wirkt ausdrücklich auch für Auto-Figuren.
 */
export function resolvePartyAction(actor: BattleUnit, state: BattleState): void {
  actor.defending = false // Defend (M8) haelt nur bis zur naechsten eigenen Aktion, auch beim Wechsel auf Auto
  const target = resolvePartyTarget(state)
  if (!target) return
  dealDamage(actor, target, actor.atk)
}

/**
 * Referenz für "aufmerksames manuelles Spiel" (Special/Heal/Suppress/Limit
 * klug eingesetzt) - das, was ein Spieler über das Aktions-Popup erreichen
 * kann, und später die Vorlage für das ab-Werk-Preset des programmierbaren
 * Gambit-Editors (1. Reunion, `gambits.md` §5). Wird NICHT vom Live-Spiel für
 * Auto-Figuren aufgerufen (dafür ist `resolvePartyAction` da) - dient der
 * Pacing-Simulation (`tests/chapter-playthrough.test.ts`), um zu validieren,
 * dass manuelles Spiel (Spielertyp "M", feinspec §12) einen echten Unterschied
 * macht. Normale Angriffe/Claudes Cross Slash/Tofas Shock Strike nutzen dieselbe
 * Fokusziel-Regel wie Auto (§3.9, ueber `smartTarget`) - sie haben keinen eigenen
 * taktischen Zweck, der eine Abweichung rechtfertigt. Nur Barrel (Suppress: höchster
 * Schadensdurchsatz ATK*SPD, §3.9/§4.7 M11-Nachtrag) und Limit (§3.4: explizit
 * "stärkstes Ziel") wählen ihr Ziel weiterhin pro Einsatz unabhängig vom Fokus - beide
 * haben einen im Spec benannten eigenen Zweck (unterdrücken/finishen), der die
 * Abweichung begründet. `smartTarget` (M16) toetet einen Heiler-Gegner immer zuerst und
 * meidet ein telegrafiertes Konter-Fenster, solange ein anderes Ziel lebt - die Referenz
 * fuer den Zielwahl-Vorteil aus gegner-encounter.md §5a/§7. Diese Ausnahmen gelten NUR
 * hier, in der Referenz-Policy - die sichtbare Vorauswahl im Aktions-Popup
 * (`ui/gameStore.svelte.ts`) kennt seit M11 keine Ausnahmen mehr (dort entscheidet der
 * Mensch selbst per Klick, s. `setFocusTarget`).
 */
export function resolveOptimalAction(actor: BattleUnit, state: BattleState): void {
  const targets = state.enemies.filter(isAlive)
  if (!targets.length) return

  // Limit hat Vorrang, sobald voll (feinspec §3.4: Aufsparen ist eine
  // Entscheidung, aber an einem Gate ohne Shock-Fenster gibt es keinen Grund,
  // ein volles Limit weiter zu banken).
  if (actor.limitAllowed && actor.limit >= LIMIT_MAX) {
    const target = strongest(targets)
    target.hp -= limitFireDamage(actor.atk, target.def)
    actor.limit = 0
    return
  }

  if (!actor.canSpecial) {
    const target = smartTarget(state)
    if (target) dealDamage(actor, target, actor.atk)
    return
  }

  if (actor.name === 'Air is...') {
    const party = state.party
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
    const tgt = smartTarget(state)
    if (tgt && actor.mp >= actor.specialMpCost! && tgt.shockTimer <= 0 && tgt.shock < SHOCK_MAX) {
      actor.mp -= actor.specialMpCost!
      dealDamage(actor, tgt, actor.atk, 45)
      return
    }
  }

  if (actor.name === 'Barrel') {
    // feinspec §3.9/§4.7 (M11-Nachtrag) - der Wert einer Unterdrückung bemisst sich am
    // Schadensdurchsatz (ATK * SPD), den der Gegner im Wirkzeitraum NICHT anrichtet - nicht
    // an seiner Geschwindigkeit allein. "SPD >= 140" erfasste keinen der drei Gate-Bosse
    // (alle SPD 70-90), obwohl Vaultron (ATK 14) den zweithoechsten Durchsatz des Kapitels
    // hat - die alte Schwelle spielte Barrel ausgerechnet an den Gates systematisch schlecht.
    const target = mostThreatening(targets)
    if (actor.mp >= actor.specialMpCost!) {
      actor.mp -= actor.specialMpCost!
      target.suppress = 4.0
      dealDamage(actor, target, Math.round(actor.atk * 0.8))
      return
    }
  }

  if (actor.name === 'Claude') {
    // feinspec §3.9/§6.1 - Cross Slash hat keinen eigenen taktischen Zweck (anders als
    // Suppress/Shock Strike/Heal) und folgt daher wie ein normaler Angriff der Fokusziel-Regel.
    const tgt = smartTarget(state)
    if (tgt && actor.mp >= actor.specialMpCost!) {
      actor.mp -= actor.specialMpCost!
      dealDamage(actor, tgt, Math.round(actor.atk * 3.0))
      return
    }
  }

  const target = smartTarget(state)
  if (target) dealDamage(actor, target, actor.atk)
}

import { describe, expect, it } from 'vitest'
import { CLAUDE, TOFA } from '../src/content/characters'
import { BLANDO } from '../src/content/monsters'
import { createEnemyUnit, createPartyUnit } from '../src/core/battle'
import { resolveOptimalAction, resolvePartyTarget } from '../src/core/gambits'
import { createBattleState } from '../src/core/tick'

// Playtest-Fund (nach M11-Release, s. 06_Implementierungsplan_Kapitel1.md M11-Umsetzungsentscheidung
// 10): Claudes Special ignorierte das gesetzte Fokusziel und traf stattdessen immer das
// ranghöchste (meiste HP) Ziel - eine unreflektiert mitgeschleppte Vor-M11-Heuristik. Specials
// ohne eigenen taktischen Zweck (feinspec §3.9) müssen der Fokusziel-Regel folgen wie ein
// normaler Angriff; nur Barrel (Suppress) und Limit haben einen im Spec benannten eigenen Zweck,
// der eine Abweichung rechtfertigt.

describe('feinspec §3.9 - Specials ohne eigenen Zweck folgen dem Fokusziel', () => {
  it('Claudes Cross Slash trifft das gesetzte Fokusziel, nicht automatisch das stärkste', () => {
    const claude = { ...CLAUDE, weaponTier: 1 }
    const unit = createPartyUnit(claude, 6)
    const strong = createEnemyUnit(BLANDO, 6) // volle HP - waere ohne Fix das automatische Ziel
    const weak = createEnemyUnit(BLANDO, 6)
    weak.hp = 1 // eindeutig NICHT das staerkste Ziel
    const state = createBattleState([unit], [strong, weak])
    state.focusTargetIndex = 1 // Spieler fokussiert explizit das schwache Ziel

    unit.mp = unit.specialMpCost!
    resolveOptimalAction(unit, state)

    expect(weak.hp).toBeLessThan(1) // das fokussierte (schwache) Ziel wurde getroffen
    expect(strong.hp).toBe(strong.maxHp) // das staerkste Ziel blieb unangetastet
  })

  it('Tofas Shock Strike folgt weiterhin derselben Fokusziel-Regel (Referenzverhalten, unverändert)', () => {
    const tofa = { ...TOFA, weaponTier: 1 }
    const unit = createPartyUnit(tofa, 19)
    const strong = createEnemyUnit(BLANDO, 19)
    const weak = createEnemyUnit(BLANDO, 19)
    weak.hp = 1
    const state = createBattleState([unit], [strong, weak])
    state.focusTargetIndex = 1

    unit.mp = unit.specialMpCost!
    resolveOptimalAction(unit, state)

    expect(weak.hp).toBeLessThan(1)
    expect(strong.hp).toBe(strong.maxHp)
  })

  it('resolvePartyTarget selbst bleibt die einzige Quelle der Wahrheit für die Fokusziel-Regel', () => {
    const strong = createEnemyUnit(BLANDO, 1)
    const weak = createEnemyUnit(BLANDO, 1)
    weak.hp = 1
    const state = createBattleState([], [strong, weak])
    state.focusTargetIndex = 1

    expect(resolvePartyTarget(state)).toBe(weak)
  })
})

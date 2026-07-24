import { describe, expect, it } from 'vitest'
import { BARREL, CLAUDE, TOFA } from '../src/content/characters'
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

// M11-Nachtrag (06_Implementierungsplan_Kapitel1.md, Umsetzungsentscheidung 12): Barrels Suppress
// in der Referenz-Policy zielt seit dem §3.9/§4.7-Nachtrag auf den höchsten Schadensdurchsatz
// (ATK * SPD), nicht mehr auf eine SPD-Schwelle (>= 140) - keiner der drei Gate-Bosse erreicht
// diese Schwelle, obwohl Vaultron (ATK 14) den zweithöchsten Durchsatz des Kapitels hat.
describe('feinspec §3.9/§4.7 - Barrels Suppress (Referenz-Policy) zielt auf Schadensdurchsatz', () => {
  it('waehlt den langsamen Schwerschlaeger (hoher ATK*SPD) statt den schnellen, aber harmlosen Gegner', () => {
    const barrel = { ...BARREL, weaponTier: 1 }
    const unit = createPartyUnit(barrel, 30)
    // schnell, aber kaum Durchsatz - die alte "SPD >= 140"-Regel haette dieses Ziel gewaehlt
    const fast = createEnemyUnit(BLANDO, 30)
    fast.spd = 150
    fast.atk = 2
    // langsam (wie alle drei Kapitel-Bosse, SPD 70-90), aber hoher Durchsatz (wie Vaultron)
    const slowHeavy = createEnemyUnit(BLANDO, 30)
    slowHeavy.spd = 80
    slowHeavy.atk = 14

    const state = createBattleState([unit], [fast, slowHeavy])
    unit.mp = unit.specialMpCost!
    resolveOptimalAction(unit, state)

    expect(slowHeavy.suppress).toBeGreaterThan(0)
    expect(fast.suppress).toBe(0)
  })

  it('ignoriert dabei ein gesetztes Fokusziel (eigener, im Spec benannter Zweck, keine Fokusziel-Ausnahme)', () => {
    const barrel = { ...BARREL, weaponTier: 1 }
    const unit = createPartyUnit(barrel, 30)
    const focused = createEnemyUnit(BLANDO, 30) // vom Spieler fokussiert, aber kaum Durchsatz
    focused.spd = 90
    focused.atk = 2
    const threat = createEnemyUnit(BLANDO, 30) // nicht fokussiert, aber der eigentliche Durchsatz-Gegner
    threat.spd = 80
    threat.atk = 14

    const state = createBattleState([unit], [focused, threat])
    state.focusTargetIndex = 0 // Spieler haette "focused" anvisiert
    unit.mp = unit.specialMpCost!
    resolveOptimalAction(unit, state)

    expect(threat.suppress).toBeGreaterThan(0)
    expect(focused.suppress).toBe(0)
  })
})

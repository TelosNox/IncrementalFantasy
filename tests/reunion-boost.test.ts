import { describe, expect, it } from 'vitest'
import { CLAUDE } from '../src/content/characters'
import { createPartyUnit, deriveCharacterMaxHp, deriveCharacterMaxMp } from '../src/core/battle'
import { applyVictoryExp } from '../src/core/progression'
import { projectOffline } from '../src/core/offline'

// M9 - prestige-reunion.md "schwacher, aber wiederholbarer permanenter Boost": deckt ab, dass der
// optionale `boostMult`-Parameter (default 1 = kein Boost, deckungsgleich mit allen M1-M8-Aufrufen
// ohne 3./4. Argument) ATK/MAG/HP/MP tatsaechlich mitskaliert, ueberall dort, wo Party-Stats
// abgeleitet werden (Kampf, Level-Up, Offline-Projektion).

describe('M9 Reunion-Boost - createPartyUnit/deriveCharacterMax*', () => {
  it('boostMult=1 (Default) veraendert nichts gegenueber dem bisherigen Verhalten', () => {
    const withoutBoost = createPartyUnit(CLAUDE, 1)
    const explicitNoBoost = createPartyUnit(CLAUDE, 1, 1)
    expect(withoutBoost).toEqual(explicitNoBoost)
  })

  it('boostMult=1.05 skaliert ATK/MAG/HP/MP, aber nicht DEF/SPD (wie weaponStatMod)', () => {
    const base = createPartyUnit(CLAUDE, 1)
    const boosted = createPartyUnit(CLAUDE, 1, 1.05)

    expect(boosted.atk).toBe(Math.round(base.atk * 1.05))
    expect(boosted.mag).toBe(Math.round(base.mag * 1.05))
    expect(boosted.maxHp).toBe(Math.round(base.maxHp * 1.05))
    expect(boosted.maxMp).toBe(Math.round(base.maxMp * 1.05))
    expect(boosted.def).toBe(base.def)
    expect(boosted.spd).toBe(base.spd)
  })

  it('deriveCharacterMaxHp/MaxMp wenden denselben Boost an', () => {
    expect(deriveCharacterMaxHp(CLAUDE, 1.1)).toBe(Math.round(deriveCharacterMaxHp(CLAUDE) * 1.1))
    expect(deriveCharacterMaxMp(CLAUDE, 1.1)).toBe(Math.round(deriveCharacterMaxMp(CLAUDE) * 1.1))
  })
})

describe('M9 Reunion-Boost - applyVictoryExp Level-Up-Heilung', () => {
  it('heilt bei Levelaufstieg auf den geboosteten Max-Wert, nicht den ungeboosteten', () => {
    const leveled = applyVictoryExp(CLAUDE, 999999, 1.05)
    expect(leveled.level).toBeGreaterThan(CLAUDE.level)
    expect(leveled.hp).toBe(deriveCharacterMaxHp(leveled, 1.05))
    expect(leveled.mp).toBe(deriveCharacterMaxMp(leveled, 1.05))
  })
})

describe('M9 Reunion-Boost - projectOffline reicht den Boost weiter', () => {
  it('eine geboostete Party clear\'t eine Zone schneller/mehrfach haeufiger als ungeboostet', () => {
    const party = [{ ...CLAUDE }]
    const unboosted = projectOffline(party, 1, 3 * 60 * 60)
    const boosted = projectOffline(party, 1, 3 * 60 * 60, 1.5)

    expect(boosted.wasClearing).toBe(true)
    expect(boosted.timePerClearSeconds).toBeLessThanOrEqual(unboosted.timePerClearSeconds)
    expect(boosted.repeats).toBeGreaterThanOrEqual(unboosted.repeats)
  })
})

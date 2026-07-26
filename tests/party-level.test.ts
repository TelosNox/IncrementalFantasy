import { describe, expect, it } from 'vitest'
import { AIRIS, BARREL, CLAUDE } from '../src/content/characters'
import { createPartyUnit, deriveCharacterMaxHp, deriveCharacterMaxMp } from '../src/core/battle'
import { expToNext } from '../src/core/formulas'
import { applyVictoryExp, zoneReward } from '../src/core/progression'
import { ZONES } from '../src/content/zones'

// stats-kampfwerte.md §4.1 - "Gruppenlevel statt Charakter-Level (verbindlich)". Der
// Playtest-Befund, der die Umstellung ausgeloest hat: mit Charakter-Leveln stiess Barrel in
// Zone 9 als L1 zu einem L~9-Claude (~1,6x ATK-Rueckstand) und war eine halbe Region lang
// totes Gewicht. Diese Datei haelt die Regel fest, nicht nur ihre Formeln.

describe('stats-kampfwerte.md §4.1 - ein Level fuer die ganze Party', () => {
  it('die Figur traegt kein eigenes Level/EXP mehr (strukturell, nicht nur ungenutzt)', () => {
    expect(CLAUDE).not.toHaveProperty('level')
    expect(CLAUDE).not.toHaveProperty('exp')
  })

  it('ein Levelaufstieg hebt alle Figuren gleichzeitig - dasselbe Level, unterschiedliche Werte', () => {
    const at1 = [CLAUDE, BARREL, AIRIS].map((c) => createPartyUnit(c, 1, 1))
    const at10 = [CLAUDE, BARREL, AIRIS].map((c) => createPartyUnit(c, 10, 1))

    for (let i = 0; i < at1.length; i++) {
      expect(at10[i].atk).toBeGreaterThan(at1[i].atk)
      expect(at10[i].maxHp).toBeGreaterThan(at1[i].maxHp)
    }
    // Differenzierung bleibt vollstaendig erhalten (Basiswerte/Rollen), nur der Hebel ist geteilt:
    // Barrel bleibt der Zaeheste, Air is... die staerkste Magierin - auf jedem Level.
    expect(at10[1].maxHp).toBeGreaterThan(at10[0].maxHp)
    expect(at10[2].mag).toBeGreaterThan(at10[0].mag)
  })

  it('ein Neuzugang steht sofort auf dem Gruppenlevel - kein Rueckstand wie mit Charakter-Leveln', () => {
    // Der konkrete Playtest-Fall: Barrel stoesst in Zone 9 dazu, die Party steht dort bei ~L9.
    const partyLevel = 9
    const barrelJoining = createPartyUnit(BARREL, partyLevel, 9)
    const claudeThere = createPartyUnit(CLAUDE, partyLevel, 9)
    const barrelAsL1 = createPartyUnit(BARREL, 1, 9)

    expect(barrelJoining.atk).toBeGreaterThan(barrelAsL1.atk)
    // Der alte Rueckstand war ~1,6x gegenueber dem L9-Claude; jetzt liegt Barrel innerhalb
    // seines Rollen-Profils (Tank: weniger ATK als Claude, aber in derselben Groessenordnung).
    expect(claudeThere.atk / barrelJoining.atk).toBeLessThan(1.4)
    expect(claudeThere.atk / barrelAsL1.atk).toBeGreaterThan(1.5)
  })

  it('HP/MP eines Neuzugangs leiten sich aus dem Gruppenlevel ab, nicht aus den Level-1-Startwerten', () => {
    expect(deriveCharacterMaxHp(BARREL, 9)).toBeGreaterThan(BARREL.hp)
    expect(deriveCharacterMaxMp(BARREL, 9)).toBeGreaterThan(BARREL.mp)
  })
})

describe('feinspec §3.6 - EXP fliesst in EINEN Party-Topf', () => {
  it('die Wellen-Summe wird einmal gutgeschrieben, Ueberschuss wird uebertragen', () => {
    const gained = applyVictoryExp(1, 0, expToNext(1) + 3)
    expect(gained.level).toBe(2)
    expect(gained.exp).toBe(3)
  })

  it('die Levelrate bleibt gegenueber den Charakter-Leveln unveraendert (jede Figur bekam vorher schon die volle Summe)', () => {
    // Zone 1 zehnmal gewonnen -> derselbe Stand, den zuvor jede einzelne Figur erreicht haette.
    const zone = ZONES.find((z) => z.zone === 1)!
    const reward = zoneReward(zone)
    let level = 1
    let exp = 0
    for (let i = 0; i < 10; i++) {
      const r = applyVictoryExp(level, exp, reward.exp)
      level = r.level
      exp = r.exp
    }
    const totalExp = reward.exp * 10
    let expected = 1
    let pool = totalExp
    while (pool >= expToNext(expected)) {
      pool -= expToNext(expected)
      expected += 1
    }
    expect(level).toBe(expected)
    expect(exp).toBe(pool)
  })
})

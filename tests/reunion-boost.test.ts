import { describe, expect, it } from 'vitest'
import { CLAUDE } from '../src/content/characters'
import { createPartyUnit, deriveCharacterMaxHp, deriveCharacterMaxMp } from '../src/core/battle'
import { applyVictoryExp, applyVictoryRecovery } from '../src/core/progression'
import { projectOffline } from '../src/core/offline'

// M9 - prestige-reunion.md "schwacher, aber wiederholbarer permanenter Boost": deckt ab, dass der
// optionale `boostMult`-Parameter (default 1 = kein Boost, deckungsgleich mit allen M1-M8-Aufrufen
// ohne 3./4. Argument) ATK/MAG/HP/MP tatsaechlich mitskaliert, ueberall dort, wo Party-Stats
// abgeleitet werden (Kampf, Level-Up, Offline-Projektion).

describe('M9 Reunion-Boost - createPartyUnit/deriveCharacterMax*', () => {
  it('boostMult=1 (Default) veraendert nichts gegenueber dem bisherigen Verhalten', () => {
    const withoutBoost = createPartyUnit(CLAUDE, 1, 1)
    const explicitNoBoost = createPartyUnit(CLAUDE, 1, 1, 1)
    expect(withoutBoost).toEqual(explicitNoBoost)
  })

  it('boostMult=1.05 skaliert ATK/MAG/HP/MP, aber nicht DEF/SPD (wie weaponStatMod)', () => {
    const base = createPartyUnit(CLAUDE, 1, 1)
    const boosted = createPartyUnit(CLAUDE, 1, 1, 1.05)

    expect(boosted.atk).toBe(Math.round(base.atk * 1.05))
    expect(boosted.mag).toBe(Math.round(base.mag * 1.05))
    expect(boosted.maxHp).toBe(Math.round(base.maxHp * 1.05))
    expect(boosted.maxMp).toBe(Math.round(base.maxMp * 1.05))
    expect(boosted.def).toBe(base.def)
    expect(boosted.spd).toBe(base.spd)
  })

  it('deriveCharacterMaxHp/MaxMp wenden denselben Boost an', () => {
    expect(deriveCharacterMaxHp(CLAUDE, 1, 1.1)).toBe(Math.round(deriveCharacterMaxHp(CLAUDE, 1) * 1.1))
    expect(deriveCharacterMaxMp(CLAUDE, 1, 1.1)).toBe(Math.round(deriveCharacterMaxMp(CLAUDE, 1) * 1.1))
  })
})

describe('M11/§4.1 - ein Levelaufstieg fasst die Figuren nicht an', () => {
  it('hebt nur das Gruppenlevel; hp/mp der Figuren bleiben Übertragswerte (§4.1/§11)', () => {
    const wounded: typeof CLAUDE = { ...CLAUDE, hp: 40, mp: 5 }
    const leveled = applyVictoryExp(1, 0, 999999)
    expect(leveled.level).toBeGreaterThan(1)
    // Der Levelaufstieg liefert nur noch Level/EXP - die Figur selbst wird gar nicht mehr
    // angefasst, ein impliziter "Level-Up heilt"-Kanal ist damit strukturell ausgeschlossen.
    expect(wounded.hp).toBe(40)
    expect(wounded.mp).toBe(5)
  })
})

describe('M9 Reunion-Boost - applyVictoryRecovery (Kanal 1, §3.5/§3.8d) nutzt den geboosteten Max-Wert', () => {
  it('erholt 25% des geboosteten (nicht des ungeboosteten) Maximums, gedeckelt am Maximum', () => {
    const wounded: typeof CLAUDE = { ...CLAUDE, hp: 1, mp: 0 }
    const recovered = applyVictoryRecovery(wounded, 1, 1.05)
    const maxHp = deriveCharacterMaxHp(wounded, 1, 1.05)
    const maxMp = deriveCharacterMaxMp(wounded, 1, 1.05)
    expect(recovered.hp).toBe(Math.min(maxHp, 1 + 0.25 * maxHp))
    expect(recovered.mp).toBe(Math.min(maxMp, 0 + 0.25 * maxMp))
  })

  it('deckelt am Maximum, auch wenn die Erholung sonst darüber hinausschösse', () => {
    const nearFull: typeof CLAUDE = {
      ...CLAUDE,
      hp: deriveCharacterMaxHp(CLAUDE, 1),
      mp: deriveCharacterMaxMp(CLAUDE, 1),
    }
    const recovered = applyVictoryRecovery(nearFull, 1)
    expect(recovered.hp).toBe(deriveCharacterMaxHp(CLAUDE, 1))
    expect(recovered.mp).toBe(deriveCharacterMaxMp(CLAUDE, 1))
  })
})

// Playtest-Fund (Nachtrag): `applyVictoryRecovery`/`applyInnRecovery` liefern absichtlich
// reelle HP/MP-Zwischenwerte (s. Test oben, "erholt 25% ... gedeckelt am Maximum" prueft
// exakt einen Bruchwert) - das ist fuer die kontinuierliche Gasthaus-Erholung noetig
// (`#advanceInn` addiert jeden Frame einen Bruchteil, s. `ui/gameStore.svelte.ts`). Ohne
// Rundung beim Uebertritt in die Kampf-Domaene zeigte die UI z.B. "87.3/150" HP an.
describe('Playtest-Fund - createPartyUnit rundet Character.hp/mp beim Uebertritt in die Kampf-Domaene', () => {
  it('rundet einen reellen Zwischenwert (z.B. aus Sieg-Erholung/Gasthaus-Drip) auf ganze HP/MP', () => {
    const fractional: typeof CLAUDE = { ...CLAUDE, hp: 87.3, mp: 12.6 }
    const unit = createPartyUnit(fractional, 1, 1)
    expect(Number.isInteger(unit.hp)).toBe(true)
    expect(Number.isInteger(unit.mp)).toBe(true)
    expect(unit.hp).toBe(87)
    expect(unit.mp).toBe(13)
  })
})

describe('M9 Reunion-Boost - projectOffline reicht den Boost weiter', () => {
  it('eine geboostete Party clear\'t eine Zone schneller/mehrfach haeufiger als ungeboostet', () => {
    const party = [{ ...CLAUDE }]
    const unboosted = projectOffline(party, 1, 0, 1, 3 * 60 * 60)
    const boosted = projectOffline(party, 1, 0, 1, 3 * 60 * 60, 1.5)

    expect(boosted.wasClearing).toBe(true)
    expect(boosted.timePerClearSeconds).toBeLessThanOrEqual(unboosted.timePerClearSeconds)
    expect(boosted.repeats).toBeGreaterThanOrEqual(unboosted.repeats)
  })
})

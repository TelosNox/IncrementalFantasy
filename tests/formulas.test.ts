import { describe, expect, it } from 'vitest'
import {
  applyExpGain,
  applyShockBuildup,
  atbFillPerTick,
  atbInterval,
  deriveMaxMp,
  deriveStat,
  expToNext,
  limitFireDamage,
  limitGainOnDealt,
  limitGainOnTaken,
  mpGainPostVictory,
  physicalDamage,
  scaleEnemyHp,
  scaleEnemyStat,
  shockDamage,
  zoneScaleFactor,
} from '../src/core/formulas'

// Alle Beispielwerte stammen aus feinspec-kapitel1.md §3/§6.1/§6.2/§7 (Claude
// L1 ATK 14, Blando DEF 2/HP 40/ATK 8, Tofa-Shock-Bonus 45, ...).

describe('§3.1 Schaden (Mitigations-Kurve)', () => {
  it('Claude L1 (ATK 14) gegen Blando (DEF 2) -> 12 Schaden/Treffer', () => {
    expect(physicalDamage(14, 2)).toBe(12)
  })

  it('4 Treffer reichen für Blandos 40 HP (deckt sich mit 8s bei BASE_T=2s)', () => {
    const perHit = physicalDamage(14, 2)
    expect(Math.ceil(40 / perHit)).toBe(4)
  })

  it('Schaden ist nie kleiner als 1', () => {
    expect(physicalDamage(1, 1000)).toBe(1)
  })

  it('im Shock-Fenster wird DEF ignoriert und das Ergebnis ×2 genommen', () => {
    // ignoreDef: 14*14/14 = 14, danach ×2
    expect(shockDamage(14, 2)).toBe(28)
  })
})

describe('§3.2 ATB-Takt', () => {
  it('SPD 100 -> 2,0s', () => {
    expect(atbInterval(100)).toBe(2.0)
  })

  it('SPD 130 (Tofa) -> 1,54s', () => {
    expect(atbInterval(130)).toBeCloseTo(1.54, 2)
  })

  it('SPD 180 (Caffiend) -> 1,11s', () => {
    expect(atbInterval(180)).toBeCloseTo(1.11, 2)
  })

  it('ein geschockter Gegner füllt mit ×0,3', () => {
    const normal = atbFillPerTick(100, 0.1)
    const shocked = atbFillPerTick(100, 0.1, { shocked: true })
    expect(shocked).toBeCloseTo(normal * 0.3, 10)
  })

  it('ein unterdrückter Charakter füllt mit ×0,5', () => {
    const normal = atbFillPerTick(80, 0.1)
    const suppressed = atbFillPerTick(80, 0.1, { suppressed: true })
    expect(suppressed).toBeCloseTo(normal * 0.5, 10)
  })
})

describe('§3.3 Shock-Aufbau', () => {
  it('Tofas Shock-Schlag (+45) kippt den Blando nach zwei Schlägen ins Fenster (feinspec §7.2)', () => {
    const first = applyShockBuildup(0, 12, 45)
    expect(first.windowTriggered).toBe(false)
    expect(first.shock).toBe(51) // 12*0.5 + 45

    const second = applyShockBuildup(first.shock, 12, 45)
    expect(second.windowTriggered).toBe(true)
    expect(second.shock).toBe(0)
  })

  it('ohne Bonus baut Shock nur über Schaden auf (neutrale Gegner)', () => {
    const result = applyShockBuildup(90, 12)
    expect(result.shock).toBe(96)
    expect(result.windowTriggered).toBe(false)
  })
})

describe('§3.4 Limit-Ladung', () => {
  it('zugefügter Schaden lädt mit Faktor 0,35', () => {
    expect(limitGainOnDealt(12)).toBeCloseTo(4.2, 10)
  })

  it('erlittener Schaden lädt mit Faktor 0,50 (Einzelziel)', () => {
    expect(limitGainOnTaken(12)).toBe(6)
  })

  it('erlittener AoE-Schaden lädt mit Faktor 0,40', () => {
    expect(limitGainOnTaken(12, true)).toBeCloseTo(4.8, 10)
  })

  it('Zünden: schaden(4,5·ATK, DEF) mit DEF-Ignore auf das stärkste Ziel', () => {
    // Claude L1 ATK 14 -> round(14*4.5)=63; mit DEF-Ignore: 63*63/63 = 63
    expect(limitFireDamage(14, 2)).toBe(63)
  })
})

describe('§3.5 MP', () => {
  it('Kanal 1: +25% max. MP nach Sieg (Claude max. MP 20 -> +5)', () => {
    expect(mpGainPostVictory(20)).toBe(5)
  })
})

describe('§3.6 EXP / Level', () => {
  it('exp_to_next(1) = 20', () => {
    expect(expToNext(1)).toBe(20)
  })

  it('exp_to_next(2) = round(20 * 1,22) = 24', () => {
    expect(expToNext(2)).toBe(24)
  })

  it('Level-Up sobald exp >= exp_to_next(L), Überschuss wird übertragen', () => {
    const result = applyExpGain(1, 0, 25)
    expect(result.level).toBe(2)
    expect(result.exp).toBe(5) // 25 - 20
  })

  it('reicht die EXP für mehrere Level-Ups, werden alle nacheinander aufgelöst', () => {
    const result = applyExpGain(1, 0, 20 + 24 + 3)
    expect(result.level).toBe(3)
    expect(result.exp).toBe(3)
  })
})

describe('§3.7 Zonen-Skalierung', () => {
  it('Zone 1 skaliert mit Faktor 1 (g^0)', () => {
    expect(zoneScaleFactor(1)).toBe(1)
  })

  it('Blandos ATK (8) in Zone 2 skaliert auf 9 (round(8 * 1,07))', () => {
    expect(scaleEnemyStat(8, 2)).toBe(9)
  })

  it('Blandos HP (40) in Zone 2 skaliert auf 43 (round(40 * 1,07))', () => {
    expect(scaleEnemyHp(40, 2)).toBe(43)
  })

  it('Size-Modifikator wirkt multiplikativ auf HP', () => {
    expect(scaleEnemyHp(40, 1, 1.15)).toBe(46) // round(40*1*1.15)
  })
})

describe('§4.1 abgeleitete Charakterwerte', () => {
  it('Level 1 entspricht dem Basiswert', () => {
    expect(deriveStat(14, 1.055, 1)).toBe(14)
  })

  it('Claudes ATK (14, Wachstum 1,055) in Level 2 -> 15', () => {
    expect(deriveStat(14, 1.055, 2)).toBe(15) // round(14*1.055) = round(14.77)
  })

  it('MP wächst linear (MP_GROWTH_PER_LEVEL), Claude max. MP 20 in Level 2 -> 21', () => {
    expect(deriveMaxMp(20, 2)).toBe(21) // round(20*(1+0.03)) = round(20.6)
  })
})

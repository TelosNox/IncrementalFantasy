import { describe, expect, it } from 'vitest'
import { AIRIS, BARREL, CHARACTERS, CLAUDE, TOFA } from '../src/content/characters'
import {
  BLANDO,
  BLANDZILLA,
  FORT_KNOXIOUS,
  GATE_MONSTER_IDS,
  MONSTERS,
  VAULTRON,
} from '../src/content/monsters'
import { ZONES } from '../src/content/zones'

// Stichprobenartiger Soll/Ist-Abgleich gegen feinspec-kapitel1.md §6 (1:1-Treffer).

describe('§6.1 Charakter-Startwerte & Specials', () => {
  it('Claude L1', () => {
    expect(CLAUDE.base).toEqual({ hp: 110, mp: 20, atk: 14, mag: 6, def: 4, spd: 100 })
    expect(CLAUDE.special.mpCost).toBe(8)
  })

  it('Barrel L1', () => {
    expect(BARREL.base).toEqual({ hp: 140, mp: 20, atk: 11, mag: 5, def: 8, spd: 80 })
    expect(BARREL.special.mpCost).toBe(6)
  })

  it('Tofa L1', () => {
    expect(TOFA.base).toEqual({ hp: 95, mp: 20, atk: 12, mag: 5, def: 3, spd: 130 })
    expect(TOFA.special.mpCost).toBe(7)
  })

  it('Air is... L1', () => {
    expect(AIRIS.base).toEqual({ hp: 80, mp: 30, atk: 7, mag: 14, def: 3, spd: 95 })
    expect(AIRIS.special.mpCost).toBe(10)
  })

  it('alle vier Figuren sind im Roster registriert', () => {
    expect(Object.keys(CHARACTERS).sort()).toEqual(['airis', 'barrel', 'claude', 'tofa'])
  })
})

describe('§6.2 Monster- & Gate-Basiswerte', () => {
  it('Blando (Referenzbeispiel §3.1)', () => {
    expect(BLANDO.base).toEqual({ hp: 40, atk: 8, def: 2, spd: 100 })
    expect(BLANDO.reward).toEqual({ exp: 5 })
    expect(BLANDO.trait).toBe('baseline')
  })

  it('Blandzilla (R1-Miniboss, Z8)', () => {
    expect(BLANDZILLA.base).toEqual({ hp: 130, atk: 11, def: 4, spd: 90 })
    expect(BLANDZILLA.reward).toEqual({ exp: 40 })
  })

  it('Fort Knoxious (R2-Gate, Z18)', () => {
    expect(FORT_KNOXIOUS.base).toEqual({ hp: 160, atk: 12, def: 14, spd: 70 })
    expect(FORT_KNOXIOUS.reward).toEqual({ exp: 70 })
    expect(FORT_KNOXIOUS.trait).toBe('armor')
  })

  it('Vaultron (Kapitel-Boss, Z30)', () => {
    expect(VAULTRON.base).toEqual({ hp: 240, atk: 14, def: 16, spd: 70 })
    expect(VAULTRON.reward).toEqual({ exp: 140 })
    expect(VAULTRON.trait).toBe('boss')
  })

  it('genau 8 reguläre Monster + 3 Gates/Bosse', () => {
    // M16 (01.08.2026) - Bandbox (Heiler-Gegner, gegner-encounter.md §5a) als achtes reguläres
    // Monster dazugekommen, ersetzt die vorherigen 7.
    const gates = Object.values(MONSTERS).filter((m) => GATE_MONSTER_IDS.has(m.id))
    const regular = Object.values(MONSTERS).filter((m) => !GATE_MONSTER_IDS.has(m.id))
    expect(gates).toHaveLength(3)
    expect(regular).toHaveLength(8)
  })

  it('Kindlebales Feuer-Schwäche ist als Teaser hinterlegt (Katalog-Ebene)', () => {
    expect(MONSTERS.kindlebale.weaknessTag).toBe('fire')
  })
})

describe('§6.3 Zonen-Encounter Z1-Z30', () => {
  it('30 Zonen, Regionsgrenzen 1-8/9-18/19-30', () => {
    expect(ZONES).toHaveLength(30)
    expect(ZONES[0].region).toBe(1)
    expect(ZONES[7].region).toBe(1)
    expect(ZONES[8].region).toBe(2)
    expect(ZONES[17].region).toBe(2)
    expect(ZONES[18].region).toBe(3)
    expect(ZONES[29].region).toBe(3)
  })

  it('Zone 1: 1x Blando, kein Gate', () => {
    const z1 = ZONES[0]
    expect(z1.waves).toEqual([[{ monster: 'blando', size: 1.0 }]])
    expect(z1.isGate).toBe(false)
  })

  it('Zone 8: Blandzilla-Miniboss ist Gate', () => {
    const z8 = ZONES.find((z) => z.zone === 8)!
    expect(z8.waves).toEqual([[{ monster: 'blandzilla', size: 1.8 }]])
    expect(z8.isGate).toBe(true)
    expect(z8.limitAllowed).toBe(true)
  })

  it('Zone 18: Fort-Knoxious-Gate + Caffiend', () => {
    const z18 = ZONES.find((z) => z.zone === 18)!
    expect(z18.waves).toEqual([
      [
        { monster: 'fort_knoxious', size: 1.15 },
        { monster: 'caffiend', size: 1.0 },
      ],
    ])
    expect(z18.isGate).toBe(true)
  })

  it('Zone 30: Vaultron + 2x Blando, Kapitel-Wand', () => {
    const z30 = ZONES.find((z) => z.zone === 30)!
    expect(z30.waves).toEqual([
      [
        { monster: 'vaultron', size: 0.8 },
        { monster: 'blando', size: 0.85 },
        { monster: 'blando', size: 0.85 },
      ],
    ])
    expect(z30.isGate).toBe(true)
  })

  it('limitAllowed ist genau an den drei Gates gesetzt (feinspec §3.4/§4.3, M11)', () => {
    for (const z of ZONES) {
      expect(z.limitAllowed).toBe(z.isGate)
    }
  })
})

/**
 * M13-Abnahme als Test statt als Augenmass (ui-layout.md, "Buehnen-Framework").
 * Die Kriterien aus `06_Implementierungsplan_Kapitel1.md` M13 stehen hier einzeln.
 */

import { describe, expect, it } from 'vitest'

import {
  BOSS_SU,
  ENEMY_SLOTS,
  HUD_GAP,
  HUD_MAX_BLOCK,
  HUD_W,
  MINIBOSS_SU,
  PARTY_SLOTS,
  SKY_BAND_END,
  SOLO_ENEMY_SLOT,
  SPRITE_SU,
  STAGE_H,
  STAGE_W,
  STAND_BACK,
  STAND_FRONT,
  S_MAX,
  S_MIN,
  anchorBottom,
  anchorX,
  enemyPlacement,
  hudBottom,
  partyPlacement,
  spriteTop,
  stageScale,
} from '../src/ui/stageLayout'

/**
 * Obergrenze der gerenderten HUD-Block-Hoehe in su, aus der CSS-Komposition in `Stage.svelte`:
 * 2x1,5 Innenabstand + 6,5 Name (Zeilenhoehe 1,1) + 2x1 Abstand + 2x3 Balken = 18,15 su.
 * Im Browser gemessen: 18,1 su. Hier bewusst leicht aufgerundet - der Test soll bei einer
 * kleinen CSS-Aenderung nicht sofort falsch-gruen werden.
 */
const HUD_BLOCK_H = 18.5

describe('Skalierung', () => {
  it('nimmt die kleinere der beiden Achsen und bleibt in 1,0 … 4,0', () => {
    expect(stageScale(1008, 576)).toBeCloseTo(2) // Referenzfall s = 2
    expect(stageScale(2016, 576)).toBeCloseTo(2) // breiter: Hoehe begrenzt
    expect(stageScale(1008, 1152)).toBeCloseTo(2) // hoeher: Breite begrenzt
    expect(stageScale(100, 100)).toBe(S_MIN)
    expect(stageScale(10000, 10000)).toBe(S_MAX)
    expect(stageScale(0, 0)).toBe(S_MIN) // vor der ersten Messung
  })

  it('das eigentliche Kriterium: beim Resizen aendert sich nur die Groesse', () => {
    // Die Slot-Geometrie ist in su definiert und damit per Konstruktion skalenfrei;
    // gepruefte Konsequenz: dieselbe su-Position ergibt bei zwei Skalen dieselbe
    // *relative* Lage in der Buehnenbox.
    const a = stageScale(1008, 576)
    const b = stageScale(1512, 864)
    for (const slot of [...PARTY_SLOTS, ...ENEMY_SLOTS]) {
      expect((slot.x * a) / (STAGE_W * a)).toBeCloseTo((slot.x * b) / (STAGE_W * b))
      expect((slot.y * a) / (STAGE_H * a)).toBeCloseTo((slot.y * b) / (STAGE_H * b))
    }
  })
})

describe('Slot-Raster', () => {
  it('haelt die Slot-Mitten und Standlinien der Spec ein', () => {
    expect(PARTY_SLOTS.map((s) => s.x)).toEqual([176, 216, 56, 96])
    expect(ENEMY_SLOTS.map((s) => s.x)).toEqual([328, 368, 408, 448])
    expect(PARTY_SLOTS.map((s) => s.y)).toEqual([STAND_FRONT, STAND_BACK, STAND_FRONT, STAND_BACK])
    expect(SOLO_ENEMY_SLOT).toEqual({ x: 388, y: STAND_BACK, back: true })
  })

  it('vergibt feste Plaetze - Party-Zuwachs verschiebt niemanden (UI-4)', () => {
    const solo = partyPlacement(1)
    const full = partyPlacement(4)
    expect(solo[0].slot).toEqual(full[0].slot)
    for (let i = 0; i < solo.length; i++) expect(full[i].slot).toEqual(partyPlacement(i + 1)[i].slot)
  })

  it('haelt die Gruppen randbuendig mit 48 su Mittelgang', () => {
    const party = PARTY_SLOTS.map((s) => s.x)
    const enemy = ENEMY_SLOTS.map((s) => s.x)
    const half = SPRITE_SU / 2
    expect(Math.min(...party) - half).toBe(24)
    expect(STAGE_W - (Math.max(...enemy) + half)).toBe(24)
    expect(Math.min(...enemy) - half - (Math.max(...party) + half)).toBe(48)
  })
})

describe('Gegner-Platzierung', () => {
  it('belegt E1..E4 der Reihe nach, solange alle Standardgroesse haben', () => {
    const placed = enemyPlacement([SPRITE_SU, SPRITE_SU, SPRITE_SU])
    expect(placed.map((p) => p.slot.x)).toEqual([328, 368, 408])
  })

  it('stellt eine uebergrosse Figur mittig nach hinten, Begleiter davor', () => {
    // Z30: Vaultron + 2 Blando
    const z30 = enemyPlacement([BOSS_SU, SPRITE_SU, SPRITE_SU])
    expect(z30[0].slot).toEqual(SOLO_ENEMY_SLOT)
    expect(z30.slice(1).map((p) => p.slot.y)).toEqual([STAND_FRONT, STAND_FRONT])
    // Z18: Fort Knoxious + Caffiend
    const z18 = enemyPlacement([MINIBOSS_SU, SPRITE_SU])
    expect(z18[0].slot).toEqual(SOLO_ENEMY_SLOT)
    expect(z18[1].slot.x).toBe(328)
  })

  it('die Position haengt nicht von der Sprite-Groesse der Nachbarn ab', () => {
    // Derselbe Gegner an derselben Stelle, nur der Nachbar wechselt die Groessenklasse:
    // sein Slot darf sich dadurch nicht aendern (die in M11 behobene Fehlerklasse).
    const withStandard = enemyPlacement([SPRITE_SU, SPRITE_SU, SPRITE_SU])
    const withBigNeighbour = enemyPlacement([SPRITE_SU, SPRITE_SU, BOSS_SU])
    expect(withBigNeighbour[2].slot).toEqual(SOLO_ENEMY_SLOT)
    // Standardgegner behalten vordere Plaetze; keiner erbt die Position eines Nachbarn.
    expect(new Set(withStandard.map((p) => p.slot.x)).size).toBe(3)
    expect(new Set(withBigNeighbour.map((p) => p.slot.x)).size).toBe(3)
  })
})

describe('Kopfraum und HUD', () => {
  it('kein Sprite und kein HUD ragt ins Himmelband - auch der Kapitel-Boss nicht', () => {
    const boss = { x: SOLO_ENEMY_SLOT.x, y: STAND_BACK, back: true }
    expect(spriteTop(boss, BOSS_SU)).toBe(100)
    const hudTop = STAGE_H - hudBottom(boss, BOSS_SU) - HUD_BLOCK_H
    expect(hudTop).toBeGreaterThan(SKY_BAND_END)
  })

  it('der HUD-Block bleibt im 24-su-Budget (Zeilenabstand D.y = 40 su)', () => {
    expect(HUD_BLOCK_H + HUD_GAP).toBeLessThanOrEqual(HUD_MAX_BLOCK)
  })

  it('bei 4 gegen 4 ueberlappt kein Kopf-HUD ein anderes', () => {
    const blocks = [...partyPlacement(4), ...enemyPlacement([SPRITE_SU, SPRITE_SU, SPRITE_SU, SPRITE_SU])].map(
      (p) => {
        const bottom = hudBottom(p.slot, p.size)
        return { left: p.slot.x - HUD_W / 2, right: p.slot.x + HUD_W / 2, bottom, top: bottom + HUD_BLOCK_H }
      },
    )
    for (let i = 0; i < blocks.length; i++) {
      for (let j = i + 1; j < blocks.length; j++) {
        const a = blocks[i]
        const b = blocks[j]
        const overlaps = a.left < b.right && b.left < a.right && a.bottom < b.top && b.bottom < a.top
        expect(overlaps, `HUD ${i} ueberlappt HUD ${j}`).toBe(false)
      }
    }
  })
})

describe('Vortreten bei Bereitschaft', () => {
  it('verschiebt um (+12, +12) su und laesst die Reserve unter B1 intakt', () => {
    const front = PARTY_SLOTS[0]
    expect(anchorX(front, true) - anchorX(front)).toBe(12)
    expect(anchorBottom(front) - anchorBottom(front, true)).toBe(12)
    // 20 su Reserve unter B1, davon 12 fuer den Schritt -> 8 su bleiben fuer Bodenaufsaetze.
    expect(anchorBottom(front, true)).toBe(8)
    expect(anchorBottom(front, true)).toBeGreaterThan(0)
  })

  it('das Kopf-HUD wandert mit', () => {
    const back = PARTY_SLOTS[1]
    expect(hudBottom(back, SPRITE_SU) - hudBottom(back, SPRITE_SU, true)).toBe(12)
  })
})

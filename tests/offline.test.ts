import { describe, expect, it } from 'vitest'
import { CLAUDE } from '../src/content/characters'
import { projectOffline } from '../src/core/offline'

// Architektur §5 - deckt niederlage-offline.md §3 ab: "Offline stockt in der
// Retry-Schleife ohne Fortschritt" an einer unschaffbaren Wand, ohne Absturz.

describe('Architektur §5 - Offline-Projektion', () => {
  it('3h weg an einer schaffbaren Zone: Fortschritt (EXP/Gil), kein Crash', () => {
    const party = [{ ...CLAUDE }]
    const projection = projectOffline(party, 1, 3 * 60 * 60)

    expect(projection.wasClearing).toBe(true)
    expect(projection.repeats).toBeGreaterThan(0)
    expect(projection.gilGained.gt(0)).toBe(true)
    expect(projection.party[0].level).toBeGreaterThan(CLAUDE.level)
  })

  it('3h weg an einer unschaffbaren Wand: kein Fortschritt, aber auch kein Crash', () => {
    const party = [{ ...CLAUDE }] // Level 1 solo gegen den Kapitel-Boss - hoffnungslos unterlevelt
    const projection = projectOffline(party, 30, 3 * 60 * 60)

    expect(projection.wasClearing).toBe(false)
    expect(projection.gilGained.eq(0)).toBe(true)
    expect(projection.party).toEqual(party)
  })

  it('respektiert den Offline-Deckel (8h) - mehr Abwesenheit bringt keinen zusätzlichen Ertrag', () => {
    const party = [{ ...CLAUDE }]
    const capped = projectOffline(party, 1, 8 * 60 * 60)
    const beyondCap = projectOffline(party, 1, 24 * 60 * 60)

    expect(beyondCap.budgetSeconds).toBe(capped.budgetSeconds)
    expect(beyondCap.repeats).toBe(capped.repeats)
  })

  it('Ertrag skaliert mit der Offline-Rate (60% der Aktiv-Rate)', () => {
    const party = [{ ...CLAUDE }]
    const projection = projectOffline(party, 1, 3 * 60 * 60)
    expect(projection.budgetSeconds).toBeCloseTo(3 * 60 * 60 * 0.6, 5)
  })
})

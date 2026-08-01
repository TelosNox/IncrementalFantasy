import { describe, expect, it } from 'vitest'
import { GameStore } from '../src/ui/gameStore.svelte'

// prestige-reunion.md "Boss-Sieg faellt zurueck", Umsetzungsentscheidung 66 (01.08.2026) -
// reunion() baute den neuen Stand als `{ ...this.save, currentZone: 1, ... }`; `chapterBossDefeated`
// wurde vom Spread mitgenommen und blieb dauerhaft `true`. canReunion war damit ab Durchlauf 2
// immer wahr, und jeder Klick auf Reunion zahlte Essenz aus, ohne dass ein Kampf stattfand. Der
// Test prueft die Bedingung direkt (chapterBossDefeated/canReunion), nicht ueber currentZone - das
// war die Luecke, an der alle bisherigen 117 Tests vorbeigelaufen sind.
describe('prestige-reunion.md "Boss-Sieg faellt zurueck" - reunion() resettet chapterBossDefeated', () => {
  it('canReunion ist nach reunion() wieder false, obwohl es vor dem Aufruf true war', () => {
    const game = new GameStore()
    game.save = { ...game.save, chapterBossDefeated: true }
    expect(game.canReunion).toBe(true)

    game.reunion()

    expect(game.save.chapterBossDefeated).toBe(false)
    expect(game.canReunion).toBe(false)
  })

  it('zwei reunion()-Aufrufe ohne dazwischenliegenden Bosskampf zahlen Essenz nur einmal aus', () => {
    const game = new GameStore()
    game.save = { ...game.save, chapterBossDefeated: true }
    const before = game.save.currencies.reunionEssence

    game.reunion()
    const afterFirst = game.save.currencies.reunionEssence
    expect(afterFirst.gt(before)).toBe(true)

    // Ohne erneuten Sieg ueber den Kapitel-Boss ist canReunion jetzt false; ein zweiter Aufruf
    // muss ein No-Op sein (reunion() prueft `canReunion` selbst am Anfang).
    game.reunion()
    const afterSecond = game.save.currencies.reunionEssence

    expect(afterSecond.eq(afterFirst)).toBe(true)
  })
})

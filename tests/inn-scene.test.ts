import { describe, expect, it } from 'vitest'
import { INN_HOST_LINES } from '../src/content/innLines'
import { INN_DEAD_TIME } from '../src/core/formulas'
import { GameStore } from '../src/ui/gameStore.svelte'

// ui-layout.md "Gasthaus-Szene" (M19b). feinspec §3.8b: "Ende: ... ODER auf Spielerbefehl
// (\"Aufbrechen\"), aber FRUEHESTENS nach Ablauf von INN_DEAD_TIME." M19b-Fund: `leaveInn()`
// hatte diesen Schutz bisher gar nicht - ein Klick waehrend der Totzeit hat sie faktisch
// abgeschafft (s. Docblock in `gameStore.svelte.ts`).
function killEnemies(game: GameStore): void {
  for (const e of game.battle.enemies) e.hp = 0
}

// Party absichtlich angeschlagen, nicht nur besiegte Gegner: eine bereits volle Party waere
// laut Auto-Exit-Regel (feinspec §3.8b) "sofort fertig" und wuerde die Dead-Time-Faelle unten
// nicht pruefen (s. M19b-Fund in `gameStore.svelte.ts` `#advanceInn`).
function damageParty(game: GameStore): void {
  for (const p of game.battle.party) {
    p.hp = Math.max(1, Math.floor(p.maxHp * 0.2))
    p.mp = Math.max(0, Math.floor(p.maxMp * 0.2))
  }
}

function enterVoluntaryInn(game: GameStore): void {
  game.closeIntro()
  game.closeIntro()
  damageParty(game)
  game.toggleInnQueued()
  killEnemies(game)
  game.advance(0.1)
  expect(game.phase).toBe('inn')
  game.closeIntro() // die 'inn'-Einfuehrung selbst pausiert advance(), bis sie geschlossen ist
}

describe('ui-layout.md "Gasthaus-Szene" (M19b) - Aufbruch-Sperre waehrend der Totzeit', () => {
  it('leaveInn() waehrend der Totzeit ist wirkungslos, auch wenn nichts erzwungen ist', () => {
    const game = new GameStore()
    enterVoluntaryInn(game)
    expect(game.innForced).toBe(false)

    game.advance(INN_DEAD_TIME - 1)
    expect(game.phase).toBe('inn')

    game.leaveInn()
    expect(game.phase).toBe('inn') // kein Ausstieg vor Ablauf der Totzeit
  })

  it('leaveInn() nach Ablauf der Totzeit beendet den freiwilligen Aufenthalt sofort', () => {
    const game = new GameStore()
    enterVoluntaryInn(game)

    game.advance(INN_DEAD_TIME + 0.01)
    expect(game.phase).toBe('inn')

    game.leaveInn()
    expect(game.phase).toBe('battle')
  })

  it('ein erzwungener Aufenthalt (Niederlage) laesst sich auch nach der Totzeit nicht per leaveInn() beenden', () => {
    const game = new GameStore()
    game.closeIntro()
    game.closeIntro()

    for (const p of game.battle.party) p.hp = 0
    game.advance(0.1) // -> retry
    game.closeIntro() // 'zone_return'-Einfuehrung pausiert advance(), bis sie geschlossen ist
    game.advance(1000) // Retry-Zeitstrafe abgelaufen -> automatischer Gasthaus-Aufenthalt
    expect(game.phase).toBe('inn')
    expect(game.innForced).toBe(true)
    game.closeIntro()

    game.advance(INN_DEAD_TIME + 0.01)
    game.leaveInn()
    expect(game.phase).toBe('inn')
  })
})

describe('ui-layout.md "Gasthaus-Szene" Punkt (5) (M19b) - genau eine Wirtszeile pro Aufenthalt', () => {
  it('waehlt bei jedem Eintritt eine Zeile aus dem Pool', () => {
    const game = new GameStore()
    enterVoluntaryInn(game)
    expect(INN_HOST_LINES).toContain(game.innHostLine)
  })
})

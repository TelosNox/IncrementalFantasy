import { describe, expect, it } from 'vitest'
import { GameStore } from '../src/ui/gameStore.svelte'

// Playtest-Fund (Nachtrag zu M11-Umsetzungsentscheidung 2, feinspec §4.1 "Ebenso
// verbindlich - wann zurückgeschrieben wird"): §4.1 verlangt das Rückschreiben von
// Character.hp/mp bei JEDEM Verlassen eines Kampfes (Sieg/Niederlage/Zonenwechsel).
// `selectZone()` (`ui/gameStore.svelte.ts`) spawnte einen neuen Kampf direkt aus
// `this.save.party`, ohne zuvor `syncPartyFromBattle()` aufzurufen - der im
// verlassenen Kampf erlittene Schaden ging dadurch verloren (sah im Spiel wie eine
// Gratis-Heilung aus). Betrifft nicht den Reload-Fall (dokumentierte Ausnahme,
// Entscheidung 2) - dort gibt es gar keinen laufenden In-Memory-Kampf zum Sync'en.
describe('feinspec §4.1 - Rückschreiben bei jedem Kampf-Verlassen (auch Zonenwechsel)', () => {
  it('selectZone() übernimmt den im verlassenen Kampf erlittenen Schaden, statt ihn zu verwerfen', () => {
    const game = new GameStore()
    // Zonen-Rückkehr setzt voraus, dass mindestens eine weitere Zone bereits erreicht wurde.
    game.save = { ...game.save, maxZoneReached: 2 }

    const claude = game.battle.party[0]
    expect(claude.id).toBe('claude')
    const damagedHp = Math.round(claude.maxHp * 0.4)
    claude.hp = damagedHp // simuliert erlittenen Schaden im laufenden (unentschiedenen) Kampf

    game.selectZone(2)

    const synced = game.save.party.find((c) => c.id === 'claude')!
    expect(synced.hp).toBe(damagedHp)
    // ...und der neu gespawnte Kampf fuer die neue Zone startet mit genau diesem Stand,
    // nicht wieder bei voller HP.
    expect(game.battle.party[0].hp).toBe(damagedHp)
  })
})

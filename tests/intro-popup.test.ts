import { describe, expect, it } from 'vitest'
import { GameStore } from '../src/ui/gameStore.svelte'

// ui-layout.md "Mechanik-Einführung" (M17) - blockierendes Popup pro Mechanik. Testet die
// Warteschlangen-/Pause-Mechanik am headless `GameStore` (Muster: `gameStore-zone-switch.test.ts`),
// nicht ueber den DOM/`start()`-Loop.
function killEnemies(game: GameStore): void {
  for (const e of game.battle.enemies) e.hp = 0
}

describe('ui-layout.md "Mechanik-Einführung" (M17) - Popup-Warteschlange & Pause', () => {
  it('ein frischer Save queued sofort claude_intro, danach atb_attack, danach nichts mehr', () => {
    const game = new GameStore()
    expect(game.activeIntro).toBe('claude_intro')
    expect(game.save.introsSeen.claude_intro).toBe(true)
    expect(game.save.introsSeen.atb_attack).toBe(true) // sofort markiert, s. #queueIntro-Docblock

    game.closeIntro()
    expect(game.activeIntro).toBe('atb_attack')

    game.closeIntro()
    expect(game.activeIntro).toBeNull()
  })

  it('advance() pausiert komplett, solange ein Popup offen ist (Kampf-Tick, Retry-/Callout-Timer)', () => {
    const game = new GameStore()
    expect(game.activeIntro).toBe('claude_intro') // Popup noch offen

    const enemyHpBefore = game.battle.enemies.map((e) => e.hp)
    const phaseBefore = game.phase
    game.advance(5)

    expect(game.battle.enemies.map((e) => e.hp)).toEqual(enemyHpBefore)
    expect(game.phase).toBe(phaseBefore)
  })

  it('erstes Gate (Zone 8, Blandzilla) queued limit genau einmal, nicht bei erneutem Besuch', () => {
    const game = new GameStore()
    game.closeIntro()
    game.closeIntro()
    game.save = { ...game.save, maxZoneReached: 8 }

    game.selectZone(8)
    expect(game.activeIntro).toBe('limit')
    game.closeIntro()

    game.selectZone(1)
    game.selectZone(8)
    expect(game.activeIntro).toBeNull() // introsSeen.limit ist schon true - kein erneutes Queueing
  })

  it('erster Heiler-Gegner (Zone 12, Bandbox) queued target_select', () => {
    const game = new GameStore()
    game.closeIntro()
    game.closeIntro()
    game.save = { ...game.save, maxZoneReached: 12 }

    game.selectZone(12)
    expect(game.activeIntro).toBe('target_select')
  })

  it('erste Niederlage queued zone_return', () => {
    const game = new GameStore()
    game.closeIntro()
    game.closeIntro()

    for (const p of game.battle.party) p.hp = 0
    game.advance(0.1)

    expect(game.phase).toBe('retry')
    expect(game.activeIntro).toBe('zone_return')
  })

  it('erster tatsächlicher Gasthaus-Aufenthalt queued inn', () => {
    const game = new GameStore()
    game.closeIntro()
    game.closeIntro()

    game.toggleInnQueued()
    killEnemies(game)
    game.advance(0.1)

    expect(game.phase).toBe('inn')
    expect(game.activeIntro).toBe('inn')
  })

  it('Zonen-Grenze 8→9 queued auto_attack UND barrel_intro (Auto-Attack + Barrels Beitritt fallen zusammen)', () => {
    const game = new GameStore()
    game.closeIntro()
    game.closeIntro()
    game.save = { ...game.save, currentZone: 8, maxZoneReached: 8 }

    killEnemies(game)
    game.advance(0.1)

    expect(game.save.introsSeen.auto_attack).toBe(true)
    expect(game.save.introsSeen.barrel_intro).toBe(true)
    expect(game.activeIntro).toBe('auto_attack') // zuerst im Code, daher zuerst in der Warteschlange
    game.closeIntro()
    expect(game.activeIntro).toBe('barrel_intro')
  })

  it('Zonen-Grenze 18→19 queued tofa_airis_intro und shock (volle Party, Region 3)', () => {
    const game = new GameStore()
    game.closeIntro()
    game.closeIntro()
    game.save = {
      ...game.save,
      currentZone: 18,
      maxZoneReached: 18,
      roster: ['claude', 'barrel'],
      flags: { ...game.save.flags, autoAttackUnlocked: true, manualToggleUnlocked: true },
    }

    killEnemies(game)
    game.advance(0.1)

    expect(game.save.introsSeen.tofa_airis_intro).toBe(true)
    expect(game.save.introsSeen.shock).toBe(true)
    expect(game.activeIntro).toBe('tofa_airis_intro')
    game.closeIntro()
    expect(game.activeIntro).toBe('shock')
  })

  it('Kapitel-Wand (Zone 30 besiegt) queued reunion', () => {
    const game = new GameStore()
    game.closeIntro()
    game.closeIntro()
    game.save = { ...game.save, currentZone: 30, maxZoneReached: 30 }

    killEnemies(game)
    game.advance(0.1)

    expect(game.save.chapterBossDefeated).toBe(true)
    expect(game.activeIntro).toBe('reunion')
  })

  it('introsSeen übersteht die Reunion (nicht in reunion() zurückgesetzt)', () => {
    const game = new GameStore()
    game.closeIntro()
    game.closeIntro()
    game.save = { ...game.save, currentZone: 30, maxZoneReached: 30, chapterBossDefeated: true }

    game.reunion()

    expect(game.save.introsSeen.claude_intro).toBe(true)
    expect(game.save.introsSeen.atb_attack).toBe(true)
  })
})

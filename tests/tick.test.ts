import { describe, expect, it } from 'vitest'
import { CLAUDE } from '../src/content/characters'
import { BLANDO, FUNKUS, PILFERRET, SHORTFUSE, VAULTRON } from '../src/content/monsters'
import { createEnemyUnit, createPartyUnit, type BattleUnit } from '../src/core/battle'
import { battleTick, createBattleState, simulateBattle } from '../src/core/tick'

function dummyPartyTank(): BattleUnit {
  return {
    id: 'dummy',
    name: 'Dummy',
    side: 'party',
    maxHp: 999,
    hp: 999,
    maxMp: 0,
    mp: 0,
    atk: 1,
    mag: 0,
    def: 999,
    spd: 1,
    atb: 0,
    limit: 0,
    shock: 0,
    shockTimer: 0,
    suppress: 0,
    poisonTicks: 0,
    poisonDamage: 0,
    actionsDone: 0,
    hitsTaken: 0,
    fled: false,
    defending: false,
    controlMode: 'auto',
    canSpecial: false,
    specialId: 'none',
    specialMpCost: 0,
  }
}

describe('feinspec §5 battleTick - Referenzbeispiel §3.1/§7.1', () => {
  it('Claude solo (kein Special) vs. Blando: 12 Schaden alle 2s, Sieg nach 8s', () => {
    const claude = createPartyUnit(CLAUDE, 1) // Zone 1: Special erst ab Zone 3 -> reiner Klicker
    const blando = createEnemyUnit(BLANDO, 1)
    expect(claude.canSpecial).toBe(false)

    const state = createBattleState([claude], [blando])
    const result = simulateBattle(state)

    expect(result.win).toBe(true)
    expect(result.timeSeconds).toBeCloseTo(8.0, 5)
    expect(blando.hp).toBeLessThanOrEqual(0)
    expect(claude.hp).toBeGreaterThan(0) // Blando (ATK8 vs DEF4) ist keine ernste Bedrohung
  })
})

describe('feinspec §5.1 Bedenkzeit-Pause-Guard', () => {
  it('pausiert die Uhr, sobald eine Manuell-Figur bereit ist', () => {
    const claude = createPartyUnit(CLAUDE, 1)
    claude.controlMode = 'manual'
    const blando = createEnemyUnit(BLANDO, 1)
    const state = createBattleState([claude], [blando])

    // Claude braucht 2,0s bis ATB voll ist (20 Ticks à 0,1s) -> danach pausiert
    let result = battleTick(state, 0.1)
    for (let i = 0; i < 25 && result === 'ongoing'; i++) {
      result = battleTick(state, 0.1)
    }
    expect(result).toBe('paused')
    expect(state.awaitingPlayerChoice).toBe(claude)

    const hpBeforeFurtherTicks = blando.hp
    battleTick(state, 0.1)
    battleTick(state, 0.1)
    expect(blando.hp).toBe(hpBeforeFurtherTicks) // nichts tickt weiter, solange pausiert
  })
})

describe('feinspec §5 Enemy-Traits', () => {
  it('bomb: Selbstzerstörung (AoE 2xATK) nach 3 erlittenen Treffern, Gegner stirbt', () => {
    const bomb = createEnemyUnit(SHORTFUSE, 21)
    bomb.hitsTaken = 3
    bomb.atb = 1.0
    const tank = dummyPartyTank()
    const state = createBattleState([tank], [bomb])

    battleTick(state, 0)

    expect(bomb.hp).toBeLessThanOrEqual(0)
    expect(tank.hp).toBe(999 - Math.round(bomb.atk * 2.0))
  })

  it('boss: telegrafierte Gruppen-AoE (1,8xATK) jede 3. Aktion', () => {
    const boss = createEnemyUnit(VAULTRON, 30)
    boss.actionsDone = 2 // wird diese Aktion zu 3 -> Trigger
    boss.atb = 1.0
    const tank = dummyPartyTank()
    const state = createBattleState([tank], [boss])

    battleTick(state, 0)

    expect(tank.hp).toBe(999 - Math.round(boss.atk * 1.8))
    expect(boss.actionsDone).toBe(3)
  })

  it('poison: vergiftet das getroffene Ziel mit 4 Ticks à 4 Schaden', () => {
    const funkus = createEnemyUnit(FUNKUS, 19)
    funkus.atb = 1.0
    const tank = dummyPartyTank()
    const state = createBattleState([tank], [funkus])

    battleTick(state, 0)

    expect(tank.poisonTicks).toBe(4)
    expect(tank.poisonDamage).toBe(4)
  })

  it('Poison-Tick reduziert HP einmal pro volle Sekunde und zählt Ticks herunter', () => {
    const tank = dummyPartyTank()
    tank.poisonTicks = 2
    tank.poisonDamage = 4
    const passiveEnemy = createEnemyUnit(BLANDO, 1) // nur da, damit die Party nicht sofort "gewinnt"
    const state = createBattleState([tank], [passiveEnemy])
    state.poisonAccumulator = 0.95

    battleTick(state, 0.1) // überschreitet die 1,0s-Schwelle

    expect(tank.hp).toBe(999 - 4)
    expect(tank.poisonTicks).toBe(1)
  })

  it('drain: entzieht dem MP-reichsten Ziel MP und flieht nach 4 Aktionen', () => {
    const pilferret = createEnemyUnit(PILFERRET, 23)
    pilferret.actionsDone = 3 // wird diese Aktion zu 4 -> Flucht
    pilferret.atb = 1.0
    const tank = dummyPartyTank()
    tank.maxMp = 20
    tank.mp = 20
    const state = createBattleState([tank], [pilferret])

    battleTick(state, 0)

    expect(tank.mp).toBe(5) // -15, gedeckelt am verfügbaren MP
    expect(pilferret.fled).toBe(true)
  })
})

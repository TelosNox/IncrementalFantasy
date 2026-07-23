// M5-Scope (Implementierungsplan): Region 1a, reiner Klicker-Auftakt (feinspec
// §7.1 Schritt 1) - Claude solo, manuell, Zone 1-2. Verbindet den bereits
// getesteten headless Kern (/core, /content, /save) mit einem Svelte-5-Runen-Store;
// die UI liest ausschließlich über diese Klasse und schreibt nie direkt in
// BattleUnit/Character (Architektur §3 - "/core kennt keine Svelte-Stores").
//
// Jede Zone startet als frischer Kampf (volle HP/MP, Limit 0) - deckungsgleich
// mit der validierten Referenzsimulation (sim_chapter1.py, s. tests/chapter-
// playthrough.test.ts: `runOneBattle` baut pro Zone neue Party-Units aus dem
// aktuellen Level). Ab Zone 3 bräuchte es Waffenkauf/Special-UI (M6) - deshalb
// endet M5 bewusst nach Zone 2 in der Phase "region1-paused".

import Decimal from 'break_eternity.js'
import { CLAUDE } from '../content/characters'
import { GATE_MONSTER_IDS, MONSTERS } from '../content/monsters'
import { weaponTierForLevel } from '../content/weapons'
import { ZONES } from '../content/zones'
import { createEnemyUnit, createPartyUnit, dealDamage, isAlive } from '../core/battle'
import type { Character, Zone } from '../core/entities'
import { pickTarget } from '../core/gambits'
import { MP_REFUND_PER_ATTACK, RETRY_PENALTY } from '../core/formulas'
import { applyVictoryExp, zoneReward } from '../core/progression'
import { battleTick, createBattleState, DT, type BattleState } from '../core/tick'
import type { SaveState } from '../save/schema'
import { loadSave, startAutosave, writeSave, type AutosaveHandle } from '../save/storage'

/** feinspec §7.1 Schritt 1 - M5 deckt nur Zone 1-2 ab (Klicker ohne Waffe/Special). */
export const M5_MAX_ZONE = 2

export type Phase = 'battle' | 'retry' | 'region1-paused'

function findZone(zoneIndex: number): Zone {
  const zone = ZONES.find((z) => z.zone === zoneIndex)
  if (!zone) throw new Error(`Zone ${zoneIndex} nicht gefunden`)
  return zone
}

/** feinspec §5.1 - vor `manualToggleUnlocked` ist jede Figur faktisch manuell, ohne Schalter. */
function freshCharacter(): Character {
  return { ...CLAUDE, controlMode: 'manual' }
}

function freshSaveState(): SaveState {
  return {
    version: 1,
    chapter: 1,
    currentZone: 1,
    party: [freshCharacter()],
    roster: ['claude'],
    currencies: { gil: new Decimal(0), reunionEssence: new Decimal(0) },
    bestiary: {},
    reunionCount: 0,
    flags: {
      autoAttackUnlocked: false,
      mpVisible: false,
      manualToggleUnlocked: false,
      defenseUnlocked: false,
      materiaUnlocked: false,
    },
    offline: { lastSeen: Math.floor(Date.now() / 1000) },
  }
}

function spawnBattle(zone: Zone, party: Character[]): BattleState {
  const partyUnits = party.map((c) => createPartyUnit(c, zone.zone))
  const enemyUnits = zone.waves[0].map((ref) => createEnemyUnit(MONSTERS[ref.monster], zone.zone, ref.size))
  const isGate = zone.waves[0].some((ref) => GATE_MONSTER_IDS.has(ref.monster))
  return createBattleState(partyUnits, enemyUnits, isGate)
}

export class GameStore {
  save = $state<SaveState>(loadSave() ?? freshSaveState())
  battle = $state<BattleState>(spawnBattle(findZone(this.save.currentZone), this.save.party))
  phase = $state<Phase>('battle')
  retryRemaining = $state(0)

  #frameHandle = 0
  #lastTimestamp = 0
  #accumulator = 0
  #autosave: AutosaveHandle | null = null

  get claude() {
    return this.battle.party[0]
  }

  get enemy() {
    return this.battle.enemies.find(isAlive) ?? this.battle.enemies[0]
  }

  get awaitingAttack(): boolean {
    return this.battle.awaitingPlayerChoice === this.claude
  }

  /** feinspec §5.1 Schritt 3/4 - Spieler wählt "Angriff", die Uhr läuft danach weiter. */
  attack(): void {
    if (!this.awaitingAttack) return
    const actor = this.claude
    const targets = this.battle.enemies.filter(isAlive)
    if (!targets.length) return
    dealDamage(actor, pickTarget(targets), actor.atk)
    actor.mp = Math.min(actor.maxMp, actor.mp + MP_REFUND_PER_ATTACK)
    actor.atb = 0
    this.battle.awaitingPlayerChoice = null
  }

  start(): void {
    this.#lastTimestamp = performance.now()
    const loop = (timestamp: number) => {
      const deltaSeconds = Math.min(0.25, (timestamp - this.#lastTimestamp) / 1000)
      this.#lastTimestamp = timestamp
      // Architektur §4 - Tab hidden: Live-Loop stoppt komplett (kein Zeitlupe-Nachticken).
      if (document.visibilityState === 'visible') this.advance(deltaSeconds)
      this.#frameHandle = requestAnimationFrame(loop)
    }
    this.#frameHandle = requestAnimationFrame(loop)
    this.#autosave = startAutosave(() => this.save)
  }

  stop(): void {
    cancelAnimationFrame(this.#frameHandle)
    this.#autosave?.stop()
  }

  /** Ein Zeitschritt der Kampfuhr (feinspec §5/§5.1) - von `start()`s rAF-Loop getrieben, öffentlich für Tests. */
  advance(deltaSeconds: number): void {
    if (this.phase === 'retry') {
      this.retryRemaining -= deltaSeconds
      if (this.retryRemaining <= 0) {
        this.phase = 'battle'
        this.battle = spawnBattle(findZone(this.save.currentZone), this.save.party)
      }
      return
    }
    if (this.phase !== 'battle') return

    this.#accumulator += deltaSeconds
    while (this.#accumulator >= DT) {
      this.#accumulator -= DT
      const result = battleTick(this.battle, DT)
      if (result === 'win') return this.#onWin()
      if (result === 'loss') return this.#onLoss()
      if (result === 'paused') return
    }
  }

  /** feinspec §3.6/§3.8 - Sieg: EXP/Gil gutschreiben, kein Fortschrittsverlust möglich. */
  #onWin(): void {
    const zone = findZone(this.save.currentZone)
    const reward = zoneReward(zone)
    const gil = this.save.currencies.gil.add(reward.gil)
    const party = this.save.party.map((c) => {
      const leveled = applyVictoryExp(c, reward.exp)
      return { ...leveled, weaponTier: weaponTierForLevel(leveled.level) }
    })

    if (this.save.currentZone >= M5_MAX_ZONE) {
      this.save = { ...this.save, party, currencies: { ...this.save.currencies, gil } }
      this.phase = 'region1-paused'
      writeSave(this.save)
      return
    }

    const nextZone = this.save.currentZone + 1
    this.save = { ...this.save, party, currentZone: nextZone, currencies: { ...this.save.currencies, gil } }
    this.battle = spawnBattle(findZone(nextZone), party)
  }

  /** feinspec §3.8 - Niederlage: milde Zeitstrafe, danach Auto-Retry, kein Verlust. */
  #onLoss(): void {
    this.phase = 'retry'
    this.retryRemaining = RETRY_PENALTY
  }
}

export const game = new GameStore()

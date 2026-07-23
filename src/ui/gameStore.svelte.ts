// M5/M6-Scope (Implementierungsplan): Region 1 komplett (feinspec §7.1
// Schritte 1-5) - Claude solo, Zone 1-8. Verbindet den bereits getesteten
// headless Kern (/core, /content, /save) mit einem Svelte-5-Runen-Store; die
// UI liest ausschließlich über diese Klasse und schreibt nie direkt in
// BattleUnit/Character (Architektur §3 - "/core kennt keine Svelte-Stores").
//
// Jede Zone startet als frischer Kampf (volle HP/MP, Limit 0) - deckungsgleich
// mit der validierten Referenzsimulation (sim_chapter1.py, s. tests/chapter-
// playthrough.test.ts: `runOneBattle` baut pro Zone neue Party-Units aus dem
// aktuellen Level). Der Waffen-Tier ist davon bewusst ausgenommen: er wird
// NICHT automatisch aus dem Level abgeleitet (das ist nur eine Vereinfachung
// der headless-Pacing-Simulation), sondern ausschließlich über `buyWeapon()`
// gesetzt - deckungsgleich mit feinspec §7.1 Schritt 2 ("der erste Gil-Kauf
// gibt Claude die Waffe").

import Decimal from 'break_eternity.js'
import { CLAUDE } from '../content/characters'
import { GATE_MONSTER_IDS, MONSTERS } from '../content/monsters'
import { ZONES } from '../content/zones'
import { createEnemyUnit, createPartyUnit, dealDamage, isAlive } from '../core/battle'
import type { Character, ControlMode, Zone } from '../core/entities'
import { pickTarget, resolvePartyAction, strongest } from '../core/gambits'
import { LIMIT_MAX, MP_REFUND_PER_ATTACK, RETRY_PENALTY, limitFireDamage } from '../core/formulas'
import { applyVictoryExp, zoneReward } from '../core/progression'
import { battleTick, createBattleState, DT, type BattleState } from '../core/tick'
import type { SaveState } from '../save/schema'
import { clearSave, loadSave, startAutosave, writeSave, type AutosaveHandle } from '../save/storage'

/** feinspec §7.1 - M5+M6 decken Region 1 komplett ab (Zone 1-8, Blandzilla-Miniboss). */
export const REGION1_MAX_ZONE = 8

/** feinspec §7.1 Schritt 2 - ab Zone 3 kann die Waffe gekauft werden (Special/MP werden sichtbar). */
const WEAPON_UNLOCK_ZONE = 3

/**
 * Playtest-Baseline-Gil-Preis (feinspec §6.4/§11 - erster konkreter Ansatz,
 * nicht final) - exakt der Gil-Stand, den die Baseline-Progression bis Zone 3
 * abwirft (feinspec §7.1: "der erste Gil-Kauf"), damit der erste Gil-Sink
 * ohne Wartezeit, aber spürbar greift.
 */
const WEAPON_COST_GIL = 8

/** feinspec §7.1 Schritt 3/gambits.md §6 - ab Zone 5 schaltet die Auto-Attack-Regel + der Auto/Manual-Schalter frei. */
const AUTO_ATTACK_UNLOCK_ZONE = 5

/** ui-layout.md "Freischaltungs-Hinweis" - 2-4s Anzeigedauer, hier die Mitte des Bands. */
const CALLOUT_DURATION_SECONDS = 3.0

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
  /** ui-layout.md "Freischaltungs-Hinweis" - kurzer, nicht-blockierender Toast bei Rollout-Flag-Wechseln. */
  calloutMessage = $state<string | null>(null)

  #frameHandle = 0
  #lastTimestamp = 0
  #accumulator = 0
  #calloutRemaining = 0
  #autosave: AutosaveHandle | null = null

  get claude() {
    return this.battle.party[0]
  }

  get enemies() {
    return this.battle.enemies
  }

  get awaitingAttack(): boolean {
    return this.battle.awaitingPlayerChoice === this.claude
  }

  get canBuyWeapon(): boolean {
    return this.save.currentZone >= WEAPON_UNLOCK_ZONE && this.save.party[0].weaponTier < 1
  }

  get canAffordWeapon(): boolean {
    return this.save.currencies.gil.gte(WEAPON_COST_GIL)
  }

  get weaponCostGil(): number {
    return WEAPON_COST_GIL
  }

  get canUseSpecial(): boolean {
    return this.awaitingAttack && this.claude.canSpecial === true && this.save.party[0].weaponTier >= 1
  }

  get canFireLimit(): boolean {
    return this.awaitingAttack && this.claude.limit >= LIMIT_MAX
  }

  /** ui-layout.md "Freischaltungs-Hinweis" - Anzeigedauer ODER nächste Spieleraktion, je nachdem was zuerst eintritt. */
  #triggerCallout(message: string): void {
    this.calloutMessage = message
    this.#calloutRemaining = CALLOUT_DURATION_SECONDS
  }

  #dismissCallout(): void {
    this.calloutMessage = null
    this.#calloutRemaining = 0
  }

  /** feinspec §5.1 Schritt 3/4 - Spieler wählt "Attack", die Uhr läuft danach weiter. */
  attack(): void {
    if (!this.awaitingAttack) return
    this.#dismissCallout()
    const actor = this.claude
    const targets = this.battle.enemies.filter(isAlive)
    if (!targets.length) return
    dealDamage(actor, pickTarget(targets), actor.atk)
    actor.mp = Math.min(actor.maxMp, actor.mp + MP_REFUND_PER_ATTACK)
    actor.atb = 0
    this.battle.awaitingPlayerChoice = null
  }

  /** feinspec §4.7 Regel 4 - Claudes Special (×3 ATK) aufs stärkste Ziel, kostet MP. */
  useSpecial(): void {
    if (!this.canUseSpecial) return
    this.#dismissCallout()
    const actor = this.claude
    if (actor.mp < (actor.specialMpCost ?? Infinity)) return
    const targets = this.battle.enemies.filter(isAlive)
    if (!targets.length) return
    actor.mp -= actor.specialMpCost!
    dealDamage(actor, strongest(targets), Math.round(actor.atk * 3.0))
    actor.atb = 0
    this.battle.awaitingPlayerChoice = null
  }

  /** feinspec §3.4 - Limit-Zünden: schaden(4,5·ATK, DEF) mit DEF-Ignore aufs stärkste Ziel. */
  fireLimit(): void {
    if (!this.canFireLimit) return
    this.#dismissCallout()
    const actor = this.claude
    const targets = this.battle.enemies.filter(isAlive)
    if (!targets.length) return
    const target = strongest(targets)
    target.hp -= limitFireDamage(actor.atk, target.def)
    actor.limit = 0
    actor.atb = 0
    this.battle.awaitingPlayerChoice = null
  }

  /** feinspec §7.1 Schritt 2 - der erste Gil-Kauf: Special + MP-Leiste werden sichtbar. */
  buyWeapon(): void {
    if (!this.canBuyWeapon || !this.canAffordWeapon) return
    this.#dismissCallout()
    const gil = this.save.currencies.gil.sub(WEAPON_COST_GIL)
    const claudeId = this.claude.id
    const party = this.save.party.map((c) => (c.id === claudeId ? { ...c, weaponTier: 1 } : c))
    this.save = {
      ...this.save,
      party,
      currencies: { ...this.save.currencies, gil },
      flags: { ...this.save.flags, mpVisible: true },
    }
    this.#triggerCallout('Weapon equipped – Special & MP online!')
  }

  /** gambits.md §3/§6 - Auto/Manual-Umschalter je Figur, erst ab `manualToggleUnlocked` sichtbar. */
  setControlMode(mode: ControlMode): void {
    if (!this.save.flags.manualToggleUnlocked) return
    this.#dismissCallout()
    const unit = this.claude
    unit.controlMode = mode
    // Wechselt eine Figur waehrend ihrer eigenen Bedenkzeit-Pause auf Auto,
    // muss die offene Wahl sofort ueber die Default-Regeln aufgeloest werden,
    // sonst bleibt die Kampfuhr fuer immer angehalten (§5-Guard).
    if (mode === 'auto' && this.battle.awaitingPlayerChoice === unit) {
      unit.atb = 0
      resolvePartyAction(unit, this.battle.party, this.battle.enemies)
      this.battle.awaitingPlayerChoice = null
    }
    const party = this.save.party.map((c) => (c.id === unit.id ? { ...c, controlMode: mode } : c))
    this.save = { ...this.save, party }
  }

  /**
   * Playtest-Debugwerkzeug (Architektur §6a) - kein Spielfeature. Löscht den
   * Save-Slot und lädt neu, damit ein Testlauf jederzeit bei Zone 1 neu
   * beginnen kann. Reload statt In-Place-Reset, damit Loop/Autosave/Timer
   * garantiert sauber neu aufgesetzt werden statt nur den State zu ersetzen.
   */
  resetSave(): void {
    clearSave()
    location.reload()
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
    if (this.calloutMessage) {
      this.#calloutRemaining -= deltaSeconds
      if (this.#calloutRemaining <= 0) this.#dismissCallout()
    }

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
    const leveled = this.save.party.map((c) => applyVictoryExp(c, reward.exp))

    if (this.save.currentZone >= REGION1_MAX_ZONE) {
      this.save = { ...this.save, party: leveled, currencies: { ...this.save.currencies, gil } }
      this.phase = 'region1-paused'
      writeSave(this.save)
      return
    }

    const nextZone = this.save.currentZone + 1
    let flags = this.save.flags
    let party = leveled
    if (!flags.manualToggleUnlocked && nextZone >= AUTO_ATTACK_UNLOCK_ZONE) {
      flags = { ...flags, autoAttackUnlocked: true, manualToggleUnlocked: true }
      party = party.map((c) => ({ ...c, controlMode: 'auto' }))
      this.#triggerCallout('Auto-Attack online – the party fights on its own now.')
    }

    this.save = { ...this.save, party, currentZone: nextZone, flags, currencies: { ...this.save.currencies, gil } }
    this.battle = spawnBattle(findZone(nextZone), party)
  }

  /** feinspec §3.8 - Niederlage: milde Zeitstrafe, danach Auto-Retry, kein Verlust. */
  #onLoss(): void {
    this.phase = 'retry'
    this.retryRemaining = RETRY_PENALTY
  }
}

export const game = new GameStore()

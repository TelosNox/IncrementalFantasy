// M7-Scope (Implementierungsplan): Region 2 komplett (feinspec §7.1-Fortsetzung,
// §6.3 Zone 9-18) - Barrel stößt dazu, Analyse/Bestiarium wird live, Fort
// Knoxious-Gate. Baut auf dem M5/M6-Fundament (Region 1, Claude solo) auf und
// verallgemeinert es auf eine variable Party statt fest auf Claude verdrahtet
// zu sein. Verbindet den bereits getesteten headless Kern (/core, /content,
// /save) mit einem Svelte-5-Runen-Store; die UI liest ausschließlich über
// diese Klasse und schreibt nie direkt in BattleUnit/Character (Architektur
// §3 - "/core kennt keine Svelte-Stores").
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
import { CHARACTERS, CLAUDE } from '../content/characters'
import { GATE_MONSTER_IDS, MONSTERS } from '../content/monsters'
import { ZONES } from '../content/zones'
import { createEnemyUnit, createPartyUnit, dealDamage, isAlive } from '../core/battle'
import type { BattleUnit } from '../core/battle'
import type { BestiaryEntry, Character, ControlMode, Zone } from '../core/entities'
import { pickTarget, resolvePartyAction, strongest } from '../core/gambits'
import { LIMIT_MAX, MP_REFUND_PER_ATTACK, RETRY_PENALTY, limitFireDamage } from '../core/formulas'
import { applyVictoryExp, zoneReward } from '../core/progression'
import { battleTick, createBattleState, DT, type BattleState } from '../core/tick'
import type { SaveState } from '../save/schema'
import { clearSave, loadSave, startAutosave, writeSave, type AutosaveHandle } from '../save/storage'

/** feinspec §6.3 - M7 deckt Region 2 komplett ab (Zone 9-18, Fort-Knoxious-Gate). */
export const REGION2_MAX_ZONE = 18

/** feinspec §7.1 Schritt 2 - ab Zone 3 kann Claudes Waffe gekauft werden (Special/MP werden sichtbar). */
const WEAPON_UNLOCK_ZONE = 3

/**
 * Playtest-Baseline-Gil-Preis (feinspec §6.4/§11 - erster konkreter Ansatz,
 * nicht final) - gilt gleichermaßen für jede Figur (M7-Vereinfachung analog
 * zu M6: eine offene Stellschraube laut §11 "Waffen-Tier-Kurve über Tier 1
 * hinaus", noch keine finale Balance).
 */
const WEAPON_COST_GIL = 8

/** feinspec §7.1 Schritt 3/gambits.md §6 - ab Zone 5 schaltet die Auto-Attack-Regel + der Auto/Manual-Schalter frei. */
const AUTO_ATTACK_UNLOCK_ZONE = 5

/** feinspec §6.3 Z9-10 "Barrel dazu" - Barrel stößt zu Beginn der Region 2 zur Party. */
const BARREL_JOIN_ZONE = 9

/** ui-layout.md "Freischaltungs-Hinweis" - 2-4s Anzeigedauer, hier die Mitte des Bands. */
const CALLOUT_DURATION_SECONDS = 3.0

export type Phase = 'battle' | 'retry' | 'region2-paused'

function findZone(zoneIndex: number): Zone {
  const zone = ZONES.find((z) => z.zone === zoneIndex)
  if (!zone) throw new Error(`Zone ${zoneIndex} nicht gefunden`)
  return zone
}

/** feinspec §5.1 - vor `manualToggleUnlocked` ist jede Figur faktisch manuell, ohne Schalter. */
function freshCharacter(id: string, controlMode: ControlMode): Character {
  return { ...CHARACTERS[id], controlMode }
}

function freshSaveState(): SaveState {
  return {
    version: 1,
    chapter: 1,
    currentZone: 1,
    party: [freshCharacter(CLAUDE.id, 'manual')],
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

/** kampf-analyse-shock.md §5 - Bestiarium-Eintrag beim ersten Sieg über eine Art, Rest bleibt Teaser in Kap. 1. */
function bestiaryEntryFor(monsterId: string): BestiaryEntry {
  const monster = MONSTERS[monsterId]
  return {
    monsterId,
    discovered: true,
    weaknessRevealed: monster.weaknessTag,
    weaknessUsable: false,
    persistsThroughReunion: true,
  }
}

export class GameStore {
  save = $state<SaveState>(loadSave() ?? freshSaveState())
  battle = $state<BattleState>(spawnBattle(findZone(this.save.currentZone), this.save.party))
  phase = $state<Phase>('battle')
  retryRemaining = $state(0)
  /** ui-layout.md "Freischaltungs-Hinweis" - kurzer, nicht-blockierender Toast bei Rollout-Flag-Wechseln. */
  calloutMessage = $state<string | null>(null)
  /** M7 - Bestiarium-Modal (Sidebar-Button öffnet, s. `BestiaryModal.svelte`). */
  bestiaryOpen = $state(false)
  selectedMonsterId = $state<string | null>(null)

  #frameHandle = 0
  #lastTimestamp = 0
  #accumulator = 0
  #calloutRemaining = 0
  #autosave: AutosaveHandle | null = null

  get party(): BattleUnit[] {
    return this.battle.party
  }

  get enemies() {
    return this.battle.enemies
  }

  get awaitingUnit(): BattleUnit | null {
    return this.battle.awaitingPlayerChoice
  }

  #character(id: string): Character {
    const character = this.save.party.find((c) => c.id === id)
    if (!character) throw new Error(`Figur ${id} ist nicht in der Party`)
    return character
  }

  canBuyWeapon(id: string): boolean {
    const character = this.save.party.find((c) => c.id === id)
    if (!character || character.weaponTier >= 1) return false
    // feinspec §7.1 Schritt 2 - für Claude gilt weiterhin die Zonen-Schwelle aus
    // Region 1; jede später hinzustoßende Figur (Barrel ab Z9) ist per
    // Roster-Beitritt bereits hinter ihrer eigenen Freischalt-Zone, daher
    // reicht dort "ist in der Party" als Bedingung.
    if (id === CLAUDE.id) return this.save.currentZone >= WEAPON_UNLOCK_ZONE
    return true
  }

  canAffordWeapon(_id: string): boolean {
    return this.save.currencies.gil.gte(WEAPON_COST_GIL)
  }

  get weaponCostGil(): number {
    return WEAPON_COST_GIL
  }

  canUseSpecial(unit: BattleUnit): boolean {
    if (this.battle.awaitingPlayerChoice !== unit) return false
    if (unit.canSpecial !== true) return false
    return this.#character(unit.id).weaponTier >= 1
  }

  canFireLimit(unit: BattleUnit): boolean {
    return this.battle.awaitingPlayerChoice === unit && unit.limit >= LIMIT_MAX
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
  attack(unit: BattleUnit): void {
    if (this.battle.awaitingPlayerChoice !== unit) return
    this.#dismissCallout()
    const targets = this.battle.enemies.filter(isAlive)
    if (!targets.length) return
    dealDamage(unit, pickTarget(targets), unit.atk)
    unit.mp = Math.min(unit.maxMp, unit.mp + MP_REFUND_PER_ATTACK)
    unit.atb = 0
    this.battle.awaitingPlayerChoice = null
  }

  /** feinspec §4.7 Regel 2-4 - Figuren-Special (kostet MP), Zielwahl je nach Rolle. */
  useSpecial(unit: BattleUnit): void {
    if (!this.canUseSpecial(unit)) return
    this.#dismissCallout()
    if (unit.mp < (unit.specialMpCost ?? Infinity)) return
    const targets = this.battle.enemies.filter(isAlive)
    if (!targets.length) return
    unit.mp -= unit.specialMpCost!
    if (unit.name === 'Barrel') {
      // feinspec §4.7 Regel 3/§6.1 - Suppress: unterdrückt den schnellsten
      // anwesenden Gegner (SPD >= 140 bevorzugt, sonst der insgesamt schnellste)
      // und schlägt zusätzlich zu (0,8x ATK).
      const fast = targets.filter((e) => e.spd >= 140)
      const target = fast.length ? fast[0] : strongest(targets)
      target.suppress = 4.0
      dealDamage(unit, target, Math.round(unit.atk * 0.8))
    } else {
      dealDamage(unit, strongest(targets), Math.round(unit.atk * 3.0))
    }
    unit.atb = 0
    this.battle.awaitingPlayerChoice = null
  }

  /** feinspec §3.4 - Limit-Zünden: schaden(4,5·ATK, DEF) mit DEF-Ignore aufs stärkste Ziel. */
  fireLimit(unit: BattleUnit): void {
    if (!this.canFireLimit(unit)) return
    this.#dismissCallout()
    const targets = this.battle.enemies.filter(isAlive)
    if (!targets.length) return
    const target = strongest(targets)
    target.hp -= limitFireDamage(unit.atk, target.def)
    unit.limit = 0
    unit.atb = 0
    this.battle.awaitingPlayerChoice = null
  }

  /** feinspec §7.1 Schritt 2 - der erste Gil-Kauf einer Figur: Special + MP-Leiste werden sichtbar. */
  buyWeapon(id: string): void {
    if (!this.canBuyWeapon(id) || !this.canAffordWeapon(id)) return
    this.#dismissCallout()
    const gil = this.save.currencies.gil.sub(WEAPON_COST_GIL)
    const character = this.#character(id)
    const party = this.save.party.map((c) => (c.id === id ? { ...c, weaponTier: 1 } : c))
    this.save = {
      ...this.save,
      party,
      currencies: { ...this.save.currencies, gil },
      flags: { ...this.save.flags, mpVisible: true },
    }
    this.#triggerCallout(`${character.name} equipped a weapon – Special & MP online!`)
  }

  /** gambits.md §3/§6 - Auto/Manual-Umschalter je Figur, erst ab `manualToggleUnlocked` sichtbar. */
  setControlMode(id: string, mode: ControlMode): void {
    if (!this.save.flags.manualToggleUnlocked) return
    this.#dismissCallout()
    const unit = this.battle.party.find((u) => u.id === id)
    if (!unit) return
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

  /** M7 - Bestiarium-Modal öffnen/schließen und Auswahl setzen (`ui/BestiaryModal.svelte`). */
  openBestiary(): void {
    this.bestiaryOpen = true
    if (!this.selectedMonsterId) {
      this.selectedMonsterId = Object.keys(this.save.bestiary)[0] ?? null
    }
  }

  closeBestiary(): void {
    this.bestiaryOpen = false
  }

  selectMonster(id: string): void {
    this.selectedMonsterId = id
  }

  /**
   * Playtest-Debugwerkzeug (Architektur §6a) - kein Spielfeature. Löscht den
   * Save-Slot und lädt neu, damit ein Testlauf jederzeit bei Zone 1 neu
   * beginnen kann. Reload statt In-Place-Reset, damit Loop/Autosave/Timer
   * garantiert sauber neu aufgesetzt werden statt nur den State zu ersetzen.
   * `stop()` MUSS vor `clearSave()` laufen: der Autosave hängt u.a. am
   * `pagehide`-Event, das durch `location.reload()` selbst ausgelöst wird -
   * ohne vorheriges Abmelden würde er den gerade gelöschten Save-Slot mit dem
   * noch im Speicher stehenden alten State sofort wieder befüllen (Bug, per
   * Playtest gefunden: „Reset save" wirkte scheinbar, blieb aber wirkungslos).
   */
  resetSave(): void {
    this.stop()
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

  /** kampf-analyse-shock.md §5 - erster Sieg über eine Art -> automatischer, dauerhafter Bestiarium-Eintrag. */
  #recordBestiary(): Record<string, BestiaryEntry> {
    let bestiary = this.save.bestiary
    for (const enemy of this.battle.enemies) {
      if (bestiary[enemy.id]) continue
      bestiary = { ...bestiary, [enemy.id]: bestiaryEntryFor(enemy.id) }
    }
    return bestiary
  }

  /** feinspec §3.6/§3.8 - Sieg: EXP/Gil gutschreiben, Bestiarium fortschreiben, kein Fortschrittsverlust möglich. */
  #onWin(): void {
    const zone = findZone(this.save.currentZone)
    const reward = zoneReward(zone)
    const gil = this.save.currencies.gil.add(reward.gil)
    const leveled = this.save.party.map((c) => applyVictoryExp(c, reward.exp))
    const bestiary = this.#recordBestiary()

    if (this.save.currentZone >= REGION2_MAX_ZONE) {
      this.save = { ...this.save, party: leveled, currencies: { ...this.save.currencies, gil }, bestiary }
      this.phase = 'region2-paused'
      writeSave(this.save)
      return
    }

    const nextZone = this.save.currentZone + 1
    let flags = this.save.flags
    let party = leveled
    let roster = this.save.roster

    if (!flags.manualToggleUnlocked && nextZone >= AUTO_ATTACK_UNLOCK_ZONE) {
      flags = { ...flags, autoAttackUnlocked: true, manualToggleUnlocked: true }
      party = party.map((c) => ({ ...c, controlMode: 'auto' }))
      this.#triggerCallout('Auto-Attack online – the party fights on its own now.')
    }

    // feinspec §6.3 Z9-10 - Barrel stößt zu Beginn der Region 2 zur Party.
    if (!roster.includes('barrel') && nextZone >= BARREL_JOIN_ZONE) {
      roster = [...roster, 'barrel']
      party = [...party, freshCharacter('barrel', flags.manualToggleUnlocked ? 'auto' : 'manual')]
      this.#triggerCallout('Barrel joins the party – suppressing fire incoming!')
    }

    this.save = { ...this.save, party, roster, currentZone: nextZone, flags, currencies: { ...this.save.currencies, gil }, bestiary }
    this.battle = spawnBattle(findZone(nextZone), party)
  }

  /** feinspec §3.8 - Niederlage: milde Zeitstrafe, danach Auto-Retry, kein Verlust. */
  #onLoss(): void {
    this.phase = 'retry'
    this.retryRemaining = RETRY_PENALTY
  }
}

export const game = new GameStore()

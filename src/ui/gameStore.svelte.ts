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
import { MONSTERS } from '../content/monsters'
import { ZONES } from '../content/zones'
import { createEnemyUnit, createPartyUnit, dealDamage, isAlive } from '../core/battle'
import type { BattleUnit } from '../core/battle'
import type { BestiaryEntry, Character, ControlMode, Zone } from '../core/entities'
import { pickTarget, resolvePartyAction, strongest } from '../core/gambits'
import { LIMIT_MAX, MP_REFUND_PER_ATTACK, RETRY_PENALTY, limitFireDamage } from '../core/formulas'
import { applyVictoryExp, zoneReward } from '../core/progression'
import { projectOffline } from '../core/offline'
import { battleTick, createBattleState, DT, type BattleState } from '../core/tick'
import type { SaveState } from '../save/schema'
import { serializeToJson } from '../save/serialize'
import {
  clearSave,
  loadSave,
  parseSaveJson,
  readCorruptBackup,
  startAutosave,
  writeSave,
  type AutosaveHandle,
} from '../save/storage'

/** feinspec §6.3/§0 - M8 deckt Kapitel 1 komplett ab (Zone 1-30, Vaultron-Kapitel-Boss). Reunion (M9) folgt danach. */
export const CHAPTER1_MAX_ZONE = 30

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

/**
 * feinspec §6.3 Z19-20 "Tofa+Arris dazu" - volle 4er-Party ab Region 3; auch die
 * Rollout-Schwelle fuer Shock-Ring/Kulisse in der UI (kampf-analyse-shock.md §6:
 * "gebündelt mit Tofa und der vollen Party").
 */
export const REGION3_JOIN_ZONE = 19

/** ui-layout.md "Freischaltungs-Hinweis" - 2-4s Anzeigedauer, hier die Mitte des Bands. */
const CALLOUT_DURATION_SECONDS = 3.0

/**
 * prestige-reunion.md "schwacher, aber wiederholbarer permanenter Boost" (M9-Baseline,
 * offene Playtest-Stellschraube wie WEAPON_COST_GIL & Co.): +5%/Zyklus auf ATK/MAG/HP/MP
 * (dieselben Stats, die `weaponStatMod` skaliert), linear statt gedeckelt/kurvig - ein Cap
 * "steigt mit Fortschritt" (prestige-reunion.md) ist erst relevant, sobald mehrfaches
 * Durchspielen tatsaechlich beobachtet wird.
 */
const REUNION_BOOST_PER_CYCLE = 0.05

/** prestige-reunion.md - Reunion-Essenz-Ertrag je Reunion (M9-Baseline; noch kein Sink/Shop in Kap. 1). */
export const REUNION_ESSENCE_GAIN = 5

/**
 * niederlage-offline.md §3/Architektur §5 - erst ab dieser Abwesenheit lohnt sich der
 * "Willkommen zurück"-Screen; darunter (Seiten-Reload waehrend des Spielens) bleibt die
 * Offline-Projektion unsichtbar, damit sie nicht bei jedem Reload aufploppt (M9-Baseline).
 */
const WELCOME_BACK_THRESHOLD_SECONDS = 60

export type Phase = 'battle' | 'retry' | 'chapter-complete'

/** M9 - "Willkommen zurück"-Zusammenfassung (Architektur §5 `projectOffline`, jetzt live verdrahtet). */
export interface WelcomeBackSummary {
  elapsedSeconds: number
  zone: number
  repeats: number
  wasClearing: boolean
  gilGained: string
}

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
      gambitsUnlocked: false,
    },
    offline: { lastSeen: Math.floor(Date.now() / 1000) },
  }
}

function spawnBattle(zone: Zone, party: Character[], boostMult = 1): BattleState {
  const partyUnits = party.map((c) => createPartyUnit(c, zone.zone, boostMult))
  const enemyUnits = zone.waves[0].map((ref) => createEnemyUnit(MONSTERS[ref.monster], zone.zone, ref.size))
  return createBattleState(partyUnits, enemyUnits)
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

/** Architektur §6 "Export/Import als Sicherheitsnetz" (M10) - loest einen Browser-Download aus. */
function downloadJson(json: string, filename: string): void {
  const blob = new Blob([json], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

// Architektur §6 - ein korrupter/fremder Save darf den Hauptslot nie
// stillschweigend ueberschreiben lassen; `loadSave()` wird deshalb genau
// einmal beim Modul-Start ausgewertet und das Ergebnis fuer sowohl das
// initiale `save`-Feld als auch die Warnmeldung wiederverwendet.
const initialLoad = loadSave()

export class GameStore {
  save = $state<SaveState>(initialLoad.kind === 'ok' ? initialLoad.state : freshSaveState())
  /** Architektur §6 (M10) - gesetzt, wenn der geladene Save korrupt/fremd war (Rohdaten-Backup s. `readCorruptBackup()`). */
  corruptSaveNotice = $state<{ message: string } | null>(
    initialLoad.kind === 'corrupt' ? { message: initialLoad.message } : null,
  )
  battle = $state<BattleState>(spawnBattle(findZone(this.save.currentZone), this.save.party, this.reunionBoostMult))
  phase = $state<Phase>('battle')
  retryRemaining = $state(0)
  /** ui-layout.md "Freischaltungs-Hinweis" - kurzer, nicht-blockierender Toast bei Rollout-Flag-Wechseln. */
  calloutMessage = $state<string | null>(null)
  /** M7 - Bestiarium-Modal (Sidebar-Button öffnet, s. `BestiaryModal.svelte`). */
  bestiaryOpen = $state(false)
  selectedMonsterId = $state<string | null>(null)
  /** M9 - "Willkommen zurück"-Zusammenfassung, gesetzt von `#catchUpOffline()` in `start()`. */
  welcomeBack = $state<WelcomeBackSummary | null>(null)
  /** M9 - Reunion-Modal (Sidebar-Button öffnet, s. `ReunionModal.svelte`). */
  reunionModalOpen = $state(false)

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

  /** gambits.md §4 "manuelle Prüfsteine" - Auto greift an Gates nur stumpf an; Hinweis, dass Manuell hier lohnt. */
  get isCurrentZoneGate(): boolean {
    return findZone(this.save.currentZone).isGate
  }

  /** prestige-reunion.md - permanenter, wiederholbarer Boost (s. `REUNION_BOOST_PER_CYCLE`); 1 = kein Boost vor der 1. Reunion. */
  get reunionBoostMult(): number {
    return 1 + REUNION_BOOST_PER_CYCLE * this.save.reunionCount
  }

  /**
   * prestige-reunion.md "Verfügbar ab Kapitelende (sobald man die Kapitel-Wand erreicht) - man
   * muss die Wand nicht schlagen, um zu reunionen": verfuegbar sobald Zone 30 erreicht ist, auch
   * waehrend eines laufenden/verlorenen Vaultron-Kampfs (Ausweg fuer Spieler, die die Wand nicht
   * schaffen - "Skill vs. Zeit"-Wahlfreiheit statt Zwangs-Grind).
   */
  get canReunion(): boolean {
    return this.save.currentZone >= CHAPTER1_MAX_ZONE
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

  /** feinspec §5.1 - Defend erscheint erst ab der ersten telegrafierten Boss-Aufladung (s. `#onBossAoeTriggered`). */
  canDefend(unit: BattleUnit): boolean {
    return this.battle.awaitingPlayerChoice === unit && this.save.flags.defenseUnlocked
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
    unit.defending = false // eine neue Aktion beendet eine vorige Defend-Haltung (M8)
    const targets = this.battle.enemies.filter(isAlive)
    if (!targets.length) return
    dealDamage(unit, pickTarget(targets), unit.atk)
    unit.mp = Math.min(unit.maxMp, unit.mp + MP_REFUND_PER_ATTACK)
    unit.atb = 0
    this.battle.awaitingPlayerChoice = null
  }

  /** feinspec §4.7 Regel 2-4/§6.1 - Figuren-Special (kostet MP), Effekt/Zielwahl je Rolle. */
  useSpecial(unit: BattleUnit): void {
    if (!this.canUseSpecial(unit)) return
    this.#dismissCallout()
    if (unit.mp < (unit.specialMpCost ?? Infinity)) return
    unit.defending = false

    if (unit.name === 'Arris') {
      // feinspec §6.1 - Heal Wind: Party-weite Heilung (2,2×MAG), kein Gegner-Ziel noetig.
      unit.mp -= unit.specialMpCost!
      const heal = Math.round(unit.mag * 2.2)
      for (const p of this.battle.party) {
        if (isAlive(p)) p.hp = Math.min(p.maxHp, p.hp + heal)
      }
      unit.limit = Math.min(LIMIT_MAX, unit.limit + 4)
      unit.atb = 0
      this.battle.awaitingPlayerChoice = null
      return
    }

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
    } else if (unit.name === 'Tofa') {
      // feinspec §6.1/§3.3 - Shock Strike: normaler Treffer + 45 Shock-Bonus obendrauf.
      dealDamage(unit, pickTarget(targets), unit.atk, 45)
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
    unit.defending = false
    const targets = this.battle.enemies.filter(isAlive)
    if (!targets.length) return
    const target = strongest(targets)
    target.hp -= limitFireDamage(unit.atk, target.def)
    unit.limit = 0
    unit.atb = 0
    this.battle.awaitingPlayerChoice = null
  }

  /**
   * kampf-analyse-shock.md §2/feinspec §5.1 - Defend: haelt bis zur naechsten
   * eigenen Aktion, halbiert in dieser Zeit erlittenen Schaden (M8-Baseline,
   * s. `core/battle.ts` `defending`-Feld; offene Playtest-Stellschraube).
   * Erscheint erst ab der ersten telegrafierten Boss-Aufladung (`canDefend`).
   */
  defend(unit: BattleUnit): void {
    if (!this.canDefend(unit)) return
    this.#dismissCallout()
    unit.defending = true
    unit.atb = 0
    this.battle.awaitingPlayerChoice = null
  }

  /**
   * prestige-reunion.md (M9) - Reset: Zonen-Fortschritt/Level/Gil/Ausrüstung (Waffentier); Erhalt:
   * Roster, Bestiarium, Rollout-Flags (reine UI-Lesbarkeit, kein Grund sie erneut zu verstecken).
   * Ertrag: Reunion-Essenz + `gambitsUnlocked` + der permanente `reunionBoostMult`-Stufenanstieg.
   * `freshCharacter()` setzt Level/Waffentier ohnehin auf CHARACTERS-Ausgangswerte zurück - "der
   * gelernte Special bleibt" (feinspec §6.4) ist damit automatisch erfüllt, sobald Zone/Waffe wie
   * beim Erstlauf wieder erreicht werden.
   */
  openReunionModal(): void {
    this.reunionModalOpen = true
  }

  closeReunionModal(): void {
    this.reunionModalOpen = false
  }

  reunion(): void {
    if (!this.canReunion) return
    this.#dismissCallout()
    this.reunionModalOpen = false
    const reunionCount = this.save.reunionCount + 1
    const mode: ControlMode = this.save.flags.manualToggleUnlocked ? 'auto' : 'manual'
    const party = this.save.roster.map((id) => freshCharacter(id, mode))

    this.save = {
      ...this.save,
      currentZone: 1,
      party,
      currencies: {
        gil: new Decimal(0),
        reunionEssence: this.save.currencies.reunionEssence.add(REUNION_ESSENCE_GAIN),
      },
      reunionCount,
      flags: { ...this.save.flags, gambitsUnlocked: true },
    }
    this.phase = 'battle'
    this.battle = spawnBattle(findZone(1), party, this.reunionBoostMult)
    this.#triggerCallout(
      reunionCount === 1
        ? 'The 1st Reunion! Gambit graduation unlocked - permanent boost active.'
        : `Reunion #${reunionCount} complete - permanent boost increased!`,
    )
    writeSave(this.save)
  }

  /** M9 - "Willkommen zurück"-Karte schließen (`ui/WelcomeBackModal.svelte`). */
  dismissWelcomeBack(): void {
    this.welcomeBack = null
  }

  /** Architektur §6 "Export/Import als Sicherheitsnetz" (M10) - Speicherstand als JSON-Datei herunterladen. */
  exportSave(): void {
    downloadJson(serializeToJson(this.save), `incrementalfantasy-zone${this.save.currentZone}.json`)
  }

  /** M10 - falls `corruptSaveNotice` gesetzt ist: die gesicherten Rohdaten des korrupten Saves herunterladen. */
  exportCorruptBackup(): void {
    const raw = readCorruptBackup()
    if (raw) downloadJson(raw, `incrementalfantasy-corrupt-backup-${Date.now()}.json`)
  }

  dismissCorruptSaveNotice(): void {
    this.corruptSaveNotice = null
  }

  /**
   * Architektur §6 (M10) - Speicherstand aus einer importierten JSON-Datei übernehmen. Nutzt
   * dieselbe Validierung wie `loadSave()` (`parseSaveJson`), damit Import und normales Laden nie
   * auseinanderdriften. Bei ungültigen Daten/Zone bleibt der aktuelle Spielstand unverändert.
   */
  importSave(raw: string): { ok: true } | { ok: false; message: string } {
    const result = parseSaveJson(raw)
    if (result.kind !== 'ok') {
      return { ok: false, message: result.kind === 'corrupt' ? result.message : 'File is empty.' }
    }
    let zone: Zone
    try {
      zone = findZone(result.state.currentZone)
    } catch {
      return { ok: false, message: `Invalid zone ${result.state.currentZone} in imported save.` }
    }
    this.save = result.state
    this.corruptSaveNotice = null
    this.phase = 'battle'
    this.battle = spawnBattle(zone, this.save.party, this.reunionBoostMult)
    writeSave(this.save)
    this.#triggerCallout(`Save imported – Zone ${this.save.currentZone}.`)
    return { ok: true }
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
    this.#catchUpOffline()
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

  /**
   * Architektur §5/niederlage-offline.md §3 (M9) - der in M4 gebaute Offline-Projektionsrechner
   * (`core/offline.ts` `projectOffline`) war bis M9 nie an den Live-Store angebunden; `lastSeen`
   * wurde nur einmal bei Save-Erstellung gesetzt und nie wieder aktualisiert. Läuft nur simuliert
   * an der AKTUELLEN Zone weiter (kein Zonen-Sprung, s. `projectOffline`) und nur außerhalb von
   * `chapter-complete` (dort gibt es nichts mehr zu grinden, nur noch die Reunion).
   */
  #catchUpOffline(): void {
    const now = Math.floor(Date.now() / 1000)
    const elapsed = now - this.save.offline.lastSeen
    let party = this.save.party
    let currencies = this.save.currencies

    if (this.phase !== 'chapter-complete' && elapsed >= WELCOME_BACK_THRESHOLD_SECONDS) {
      const projection = projectOffline(this.save.party, this.save.currentZone, elapsed, this.reunionBoostMult)
      const advanced = projection.wasClearing && projection.repeats > 0
      if (advanced) {
        party = projection.party
        currencies = { ...currencies, gil: currencies.gil.add(projection.gilGained) }
      }
      this.welcomeBack = {
        elapsedSeconds: elapsed,
        zone: this.save.currentZone,
        repeats: projection.repeats,
        wasClearing: projection.wasClearing,
        gilGained: projection.gilGained.toString(),
      }
      if (advanced) this.battle = spawnBattle(findZone(this.save.currentZone), party, this.reunionBoostMult)
    }

    this.save = { ...this.save, party, currencies, offline: { lastSeen: now } }
  }

  stop(): void {
    cancelAnimationFrame(this.#frameHandle)
    this.#autosave?.stop()
  }

  /** Ein Zeitschritt der Kampfuhr (feinspec §5/§5.1) - von `start()`s rAF-Loop getrieben, öffentlich für Tests. */
  advance(deltaSeconds: number): void {
    // niederlage-offline.md §3/Architektur §5 - haelt "zuletzt aktiv gesehen" laufend aktuell,
    // damit ein spaeterer Reload den Offline-Zeitraum ab hier (nicht ab Save-Erstellung) misst.
    this.save.offline.lastSeen = Math.floor(Date.now() / 1000)

    if (this.calloutMessage) {
      this.#calloutRemaining -= deltaSeconds
      if (this.#calloutRemaining <= 0) this.#dismissCallout()
    }

    if (this.phase === 'retry') {
      this.retryRemaining -= deltaSeconds
      if (this.retryRemaining <= 0) {
        this.phase = 'battle'
        this.battle = spawnBattle(findZone(this.save.currentZone), this.save.party, this.reunionBoostMult)
      }
      return
    }
    if (this.phase !== 'battle') return

    this.#accumulator += deltaSeconds
    while (this.#accumulator >= DT) {
      this.#accumulator -= DT
      const result = battleTick(this.battle, DT)
      // feinspec §5.1/ui-layout.md "Freischaltungs-Hinweis" - Defend schaltet sich an der
      // ersten telegrafierten Boss-Aufladung frei (M8), nicht zonenbasiert wie die anderen Flags.
      if (this.battle.bossAoeTriggered && !this.save.flags.defenseUnlocked) {
        this.save = { ...this.save, flags: { ...this.save.flags, defenseUnlocked: true } }
        this.#triggerCallout('Defend online – brace for the next telegraphed hit!')
      }
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
    const leveled = this.save.party.map((c) => applyVictoryExp(c, reward.exp, this.reunionBoostMult))
    const bestiary = this.#recordBestiary()

    if (this.save.currentZone >= CHAPTER1_MAX_ZONE) {
      this.save = { ...this.save, party: leveled, currencies: { ...this.save.currencies, gil }, bestiary }
      this.phase = 'chapter-complete'
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

    // feinspec §6.3 Z19-20 - Tofa+Arris stoßen zu Beginn der Region 3 zur Party (volle 4er-Party).
    if (!roster.includes('tofa') && nextZone >= REGION3_JOIN_ZONE) {
      roster = [...roster, 'tofa', 'arris']
      const mode = flags.manualToggleUnlocked ? 'auto' : 'manual'
      party = [...party, freshCharacter('tofa', mode), freshCharacter('arris', mode)]
      this.#triggerCallout('Tofa and Arris join the party – full roster online!')
    }

    this.save = { ...this.save, party, roster, currentZone: nextZone, flags, currencies: { ...this.save.currencies, gil }, bestiary }
    this.battle = spawnBattle(findZone(nextZone), party, this.reunionBoostMult)
  }

  /** feinspec §3.8 - Niederlage: milde Zeitstrafe, danach Auto-Retry, kein Verlust. */
  #onLoss(): void {
    this.phase = 'retry'
    this.retryRemaining = RETRY_PENALTY
  }
}

export const game = new GameStore()

// M11-Scope (Implementierungsplan): Ventil-Kette & Ressourcen-Ökonomie (feinspec
// §3.4/§3.5/§3.8/§3.9). Ersetzt das M5-M9-Modell "jede Zone startet als
// frischer Kampf" durch HP/MP-Übertrag zwischen Kämpfen, freie Zonen-Rückkehr
// (das eigentliche Fortschritts-Ventil) und ein zeitbasiertes Gasthaus als
// einzigen weiteren Heilkanal. Offline-Progress ist stillgelegt (§3.8e) - der
// Projektionsrechner (`core/offline.ts`) bleibt als Balance-Werkzeug bestehen,
// wird aber nicht mehr vom Live-Store aufgerufen.
//
// Verbindet den bereits getesteten headless Kern (/core, /content, /save) mit
// einem Svelte-5-Runen-Store; die UI liest ausschließlich über diese Klasse
// und schreibt nie direkt in BattleUnit/Character (Architektur §3 - "/core
// kennt keine Svelte-Stores").

import Decimal from 'break_eternity.js'
import { CHARACTERS, CLAUDE } from '../content/characters'
import type { IntroId } from '../content/introductions'
import { MONSTERS } from '../content/monsters'
import { ZONES } from '../content/zones'
import {
  createEnemyUnit,
  createPartyUnit,
  dealDamage,
  deriveCharacterMaxHp,
  deriveCharacterMaxMp,
  isAlive,
} from '../core/battle'
import type { BattleUnit } from '../core/battle'
import type { BestiaryEntry, Character, ControlMode, Zone } from '../core/entities'
import { resolvePartyAction, resolvePartyTarget } from '../core/gambits'
import { INN_DEAD_TIME, LIMIT_MAX, RETRY_PENALTY, expToNext, limitFireDamage } from '../core/formulas'
import { applyInnRecovery, applyVictoryExp, applyVictoryRecovery, zoneReward } from '../core/progression'
import { battleTick, createBattleState, DT, type BattleState } from '../core/tick'
import { SAVE_VERSION, type SaveState } from '../save/schema'
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

/** feinspec §7.1 Schritt 3/gambits.md §6 - ab Zone 5 schaltet die Auto-Attack-Regel + der Auto/Manual-Schalter frei. */
const AUTO_ATTACK_UNLOCK_ZONE = 5

/** feinspec §6.3 Z9-10 "Barrel dazu" - Barrel stößt zu Beginn der Region 2 zur Party. */
const BARREL_JOIN_ZONE = 9

/**
 * feinspec §6.3 Z19-20 "Tofa+Air is... dazu" - volle 4er-Party ab Region 3; auch die
 * Rollout-Schwelle fuer Shock-Ring/Kulisse in der UI (kampf-analyse-shock.md §6:
 * "gebündelt mit Tofa und der vollen Party").
 */
export const REGION3_JOIN_ZONE = 19

/** ui-layout.md "Freischaltungs-Hinweis" - 2-4s Anzeigedauer, hier die Mitte des Bands. */
const CALLOUT_DURATION_SECONDS = 3.0

/**
 * prestige-reunion.md "schwacher, aber wiederholbarer permanenter Boost" (M9-Baseline,
 * offene Playtest-Stellschraube): +5%/Zyklus auf ATK/MAG/HP/MP, linear statt
 * gedeckelt/kurvig - ein Cap "steigt mit Fortschritt" (prestige-reunion.md) ist erst
 * relevant, sobald mehrfaches Durchspielen tatsaechlich beobachtet wird.
 */
const REUNION_BOOST_PER_CYCLE = 0.05

/** prestige-reunion.md - Reunion-Essenz-Ertrag je Reunion (M9-Baseline; noch kein Sink/Shop in Kap. 1). */
export const REUNION_ESSENCE_GAIN = 5

export type Phase = 'battle' | 'retry' | 'inn' | 'chapter-complete'

function findZone(zoneIndex: number): Zone {
  const zone = ZONES.find((z) => z.zone === zoneIndex)
  if (!zone) throw new Error(`Zone ${zoneIndex} nicht gefunden`)
  return zone
}

/** feinspec §5.1 - vor `manualToggleUnlocked` ist jede Figur faktisch manuell, ohne Schalter. */
function freshCharacter(id: string, controlMode: ControlMode): Character {
  return { ...CHARACTERS[id], controlMode }
}

/**
 * feinspec §4.1/§5.1/§6.4 (M15, 30.07.2026) - permanenter Zonen-Trigger statt Gil-Kauf: Claude
 * bei Zone 3, jede spaeter hinzustoßende Figur bei ihrer eigenen `unlockedFromZone` (Barrel Z10,
 * Tofa/Air is... Z19 - identisch mit ihrer Beitritts-Zone, "mit Beitritt" per Data-Zufall bei
 * Barrel einen Zug spaeter). Einmal true, bleibt es true - auch ueber die Reunion (s. `reunion()`).
 */
function withSpecialTrigger(character: Character, frontierZone: number): Character {
  if (character.specialUnlocked || frontierZone < character.special.unlockedFromZone) return character
  return { ...character, specialUnlocked: true }
}

/**
 * charaktere-party.md - "Neuzugaenge steigen auf dem aktuellen Gruppenlevel ein ... ab dem
 * ersten Kampf voll einsatzfaehig". Die HP/MP aus `CHARACTERS` sind die Werte auf Level 1;
 * ohne diese Ableitung stiesse Barrel in Zone 9 mit 140 HP zu einer Party dazu, deren Maximum
 * laengst darueber liegt - der Beitritt waere wieder das tote Gewicht, das die Umstellung auf
 * das Gruppenlevel gerade beseitigt (stats-kampfwerte.md §4.1).
 */
function joinCharacter(id: string, controlMode: ControlMode, partyLevel: number, boostMult: number): Character {
  const character = freshCharacter(id, controlMode)
  return {
    ...character,
    hp: deriveCharacterMaxHp(character, partyLevel, boostMult),
    mp: deriveCharacterMaxMp(character, partyLevel, boostMult),
  }
}

function freshSaveState(): SaveState {
  return {
    version: SAVE_VERSION,
    chapter: 1,
    currentZone: 1,
    maxZoneReached: 1,
    chapterBossDefeated: false,
    party: [freshCharacter(CLAUDE.id, 'manual')],
    partyLevel: 1,
    partyExp: 0,
    roster: ['claude'],
    currencies: { reunionEssence: new Decimal(0) },
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
    inn: { queued: false },
    introsSeen: {},
  }
}

function spawnBattle(zone: Zone, party: Character[], partyLevel: number, boostMult = 1): BattleState {
  const partyUnits = party.map((c) => createPartyUnit(c, partyLevel, zone.zone, boostMult, zone.limitAllowed))
  const enemyUnits = zone.waves[0].map((ref) => createEnemyUnit(MONSTERS[ref.monster], zone.zone, ref.size))
  return createBattleState(partyUnits, enemyUnits)
}

/**
 * feinspec §4.1 (Playtest-Fund, M11) - HP/MP sind Übertragswerte: den nach Kampfende
 * tatsächlich erreichten Stand (inkl. erlittenem Schaden, ggf. 0 bei KO) aus der
 * Kampfeinheit in die gespeicherte Figur übernehmen. `this.battle` ist ephemer (wird bei
 * jedem neuen Kampf frisch aus `this.save.party` gebaut) - ohne diese Synchronisation an
 * jedem Kampfende ginge der tatsächliche HP/MP-Stand beim nächsten `spawnBattle` verloren.
 */
function syncPartyFromBattle(party: Character[], battleUnits: BattleUnit[]): Character[] {
  return party.map((c) => {
    const unit = battleUnits.find((u) => u.id === c.id)
    if (!unit) return c
    return { ...c, hp: Math.max(0, Math.round(unit.hp)), mp: Math.max(0, Math.round(unit.mp)) }
  })
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
  battle = $state<BattleState>(spawnBattle(findZone(this.save.currentZone), this.save.party, this.save.partyLevel, this.reunionBoostMult))
  phase = $state<Phase>('battle')
  retryRemaining = $state(0)
  /** feinspec §3.8b (M11) - seit dem Ende der Totzeit verstrichene Gasthaus-Zeit (fuer die Fortschrittsanzeige). */
  innElapsed = $state(0)
  /** feinspec §3.8c (M11) - true = Niederlage-Pflichtaufenthalt (kein "Leave now"); false = freiwillig angemeldet. */
  innForced = $state(false)
  /** ui-layout.md "Freischaltungs-Hinweis" - kurzer, nicht-blockierender Toast bei Rollout-Flag-Wechseln. */
  calloutMessage = $state<string | null>(null)
  /** M7 - Bestiarium-Modal (Sidebar-Button öffnet, s. `BestiaryModal.svelte`). */
  bestiaryOpen = $state(false)
  selectedMonsterId = $state<string | null>(null)
  /** M9 - Reunion-Modal (Sidebar-Button öffnet, s. `ReunionModal.svelte`). */
  reunionModalOpen = $state(false)
  /**
   * ui-layout.md "Mechanik-Einführung" (M17) - aktuell offenes, blockierendes Einführungs-Popup
   * (s. `IntroPopup.svelte`). Nicht-null pausiert `advance()` komplett (s. dort).
   */
  activeIntro = $state<IntroId | null>(null)
  /** M17 - Codex-Modal (Sidebar-Button öffnet, s. `Codex.svelte`). */
  codexOpen = $state(false)
  selectedIntroId = $state<IntroId | null>(null)

  #frameHandle = 0
  #lastTimestamp = 0
  #accumulator = 0
  #calloutRemaining = 0
  #autosave: AutosaveHandle | null = null
  /** feinspec §3.8b (M11) - welche Zone nach Abschluss des Gasthaus-Aufenthalts gespielt wird. */
  #innNextZone: number | null = null
  /** ui-layout.md "Mechanik-Einführung" (M17) - FIFO fuer Popups, die im selben Tick ausgeloest werden (z. B. Barrel-Beitritt + Special-Unlock derselben Zonen-Grenze). */
  #introQueue: IntroId[] = []

  /**
   * Playtest-Fund (Gasthaus ohne sichtbares Heil-Feedback): Während `phase === 'inn'`
   * ist `this.battle` die eingefrorene Momentaufnahme vom Kampfende - sie tickt nicht mit,
   * während `#advanceInn()` jeden Frame `this.save.party` heilt (§3.8b). Ohne diesen Zweig
   * zeigten Stage/CharacterPanel während des gesamten Gasthaus-Aufenthalts den HP/MP-Stand
   * von VOR der Heilung. Live-Projektion über dieselbe, bereits getestete `createPartyUnit()`
   * (F1) - rein zur Anzeige, kein Einfluss auf den echten Kampfzustand (ATB/Limit laufen
   * hier absichtlich leer/0, da im Gasthaus nicht gekämpft wird).
   */
  get party(): BattleUnit[] {
    if (this.phase === 'inn') {
      const zone = findZone(this.#innNextZone ?? this.save.currentZone)
      return this.save.party.map((c) =>
        createPartyUnit(c, this.save.partyLevel, zone.zone, this.reunionBoostMult, zone.limitAllowed),
      )
    }
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

  /** feinspec §3.8a (M11) - höchste je erreichte Zone; Obergrenze der freien Zonen-Auswahl. */
  get maxZoneReached(): number {
    return this.save.maxZoneReached
  }

  /**
   * stats-kampfwerte.md §4.1/feinspec §3.6 - **ein** Level-/EXP-Anzeiger für die Gruppe
   * (nicht vier pro Charakter-Panel). `partyExpProgress` ist der Anteil 0..1 zum nächsten Level.
   */
  get partyLevel(): number {
    return this.save.partyLevel
  }

  get partyExp(): number {
    return this.save.partyExp
  }

  get partyExpToNext(): number {
    return expToNext(this.save.partyLevel)
  }

  get partyExpProgress(): number {
    return Math.min(1, this.save.partyExp / this.partyExpToNext)
  }

  /** feinspec §3.8b (M11) - "nach diesem Kampf ins Gasthaus" angemeldet? */
  get innQueued(): boolean {
    return this.save.inn.queued
  }

  /** feinspec §3.9 (M11) - aktuell gesetztes Partei-Fokusziel (Index in `enemies`), falls vorhanden. */
  get focusTargetIndex(): number | null {
    return this.battle.focusTargetIndex
  }

  /** prestige-reunion.md - permanenter, wiederholbarer Boost (s. `REUNION_BOOST_PER_CYCLE`); 1 = kein Boost vor der 1. Reunion. */
  get reunionBoostMult(): number {
    return 1 + REUNION_BOOST_PER_CYCLE * this.save.reunionCount
  }

  /**
   * prestige-reunion.md, Umsetzungsentscheidung 61 (31.07.2026) - der Kapitel-Boss ist Pflicht:
   * verfuegbar erst, wenn Vaultron tatsaechlich besiegt wurde (`chapterBossDefeated`), nicht schon
   * beim Erreichen von Zone 30. Der frühere Ausweg (Reunion ohne Sieg) war redundant, weil A2
   * (≤ 20 Farm-Siege in der Vorzone) jede Zone auch fuer den vollautomatischen Spielertyp
   * gewinnbar macht - gemessen an Zone 30 hält A2 mit 15 (Entscheidung 63).
   */
  get canReunion(): boolean {
    return this.save.chapterBossDefeated
  }

  /**
   * ui-layout.md "Mechanik-Einführung" (M17) - Claude stellt sich vor dem allerersten Kampf vor
   * (charaktere-party.md: "getrennt vom Mechanik-Popup"), ATB/Attack folgt direkt im ersten Kampf.
   * Beide werden hier unconditional angestoßen - `#queueIntro` selbst ist idempotent (No-op, falls
   * `introsSeen` das schon traegt, z. B. nach Laden eines bestehenden Saves).
   */
  constructor() {
    this.#queueIntro('claude_intro')
    this.#queueIntro('atb_attack')
  }

  #character(id: string): Character {
    const character = this.save.party.find((c) => c.id === id)
    if (!character) throw new Error(`Figur ${id} ist nicht in der Party`)
    return character
  }

  canUseSpecial(unit: BattleUnit): boolean {
    if (this.battle.awaitingPlayerChoice !== unit) return false
    return unit.canSpecial === true
  }

  canFireLimit(unit: BattleUnit): boolean {
    return this.battle.awaitingPlayerChoice === unit && unit.limitAllowed && unit.limit >= LIMIT_MAX
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

  /**
   * ui-layout.md "Mechanik-Einführung" (M17) - stellt ein Einführungs-Popup in die Warteschlange,
   * genau einmal pro `IntroId` (No-op, wenn `introsSeen[id]` schon `true` ist). `introsSeen` wird
   * SOFORT gesetzt (nicht erst bei `closeIntro()`), damit derselbe Trigger im selben Tick nicht
   * doppelt queued - der Effekt (genau ein Popup) ist identisch, das Flag ist nur der Türsteher.
   */
  #queueIntro(id: IntroId): void {
    if (this.save.introsSeen[id]) return
    this.save = { ...this.save, introsSeen: { ...this.save.introsSeen, [id]: true } }
    if (this.activeIntro === null) {
      this.activeIntro = id
    } else {
      this.#introQueue.push(id)
    }
  }

  /** ui-layout.md "Mechanik-Einführung" (M17) - aktives Popup weggeklickt; naechstes aus der Warteschlange (falls vorhanden). */
  closeIntro(): void {
    this.activeIntro = this.#introQueue.shift() ?? null
  }

  /**
   * kampf-analyse-shock.md §5/ui-layout.md "Mechanik-Einführung" (M17) - Encounter-basierte
   * Trigger (nicht zonen-hartkodiert, konsistent mit Umsetzungsentscheidung 70/M16): das erste
   * Gate (Limit) und der erste Heiler-Gegner (Zielwahl) lösen beim tatsächlichen Kontakt aus,
   * also beim Battle-Spawn fuer die betroffene Zone - nicht beim bloßen Erreichen der Zonennummer.
   */
  #checkZoneIntros(zone: Zone): void {
    if (zone.isGate) this.#queueIntro('limit')
    if (zone.waves[0].some((ref) => MONSTERS[ref.monster].trait === 'heal')) this.#queueIntro('target_select')
  }

  /** M17 - Codex-Modal öffnen/schließen und Auswahl setzen (`ui/Codex.svelte`). */
  openCodex(): void {
    this.codexOpen = true
  }

  closeCodex(): void {
    this.codexOpen = false
  }

  selectIntro(id: IntroId): void {
    this.selectedIntroId = id
  }

  /** feinspec §5.1 Schritt 3/4 - Spieler wählt "Attack", die Uhr läuft danach weiter. */
  attack(unit: BattleUnit): void {
    if (this.battle.awaitingPlayerChoice !== unit) return
    this.#dismissCallout()
    unit.defending = false // eine neue Aktion beendet eine vorige Defend-Haltung (M8)
    const target = resolvePartyTarget(this.battle)
    if (!target) return
    dealDamage(unit, target, unit.atk)
    unit.atb = 0
    this.battle.awaitingPlayerChoice = null
  }

  /** feinspec §4.7 Regel 2-4/§6.1 - Figuren-Special (kostet MP), Effekt/Zielwahl je Rolle. */
  useSpecial(unit: BattleUnit): void {
    if (!this.canUseSpecial(unit)) return
    this.#dismissCallout()
    if (unit.mp < (unit.specialMpCost ?? Infinity)) return
    unit.defending = false

    if (unit.name === 'Air is...') {
      // feinspec §6.1 - Heal Wind: Party-weite Heilung (2,2×MAG), kein Gegner-Ziel noetig.
      unit.mp -= unit.specialMpCost!
      const heal = Math.round(unit.mag * 2.2)
      for (const p of this.battle.party) {
        if (isAlive(p)) p.hp = Math.min(p.maxHp, p.hp + heal)
      }
      if (unit.limitAllowed) unit.limit = Math.min(LIMIT_MAX, unit.limit + 4)
      unit.atb = 0
      this.battle.awaitingPlayerChoice = null
      return
    }

    // feinspec §3.9 - Vorauswahl im Popup folgt ohne Ausnahme dem Fokusziel, auch fuer
    // Barrels Suppress (die durchsatzbasierte Zielwahl aus §4.7 gilt nur noch fuer die
    // Referenz-Policy `resolveOptimalAction`, nicht fuer diese sichtbare, vom Spieler
    // ueberschreibbare Vorauswahl).
    const target = resolvePartyTarget(this.battle)
    if (!target) return
    unit.mp -= unit.specialMpCost!
    if (unit.name === 'Barrel') {
      // feinspec §6.1 - Suppress: schlaegt zusaetzlich zu (0,8x ATK).
      target.suppress = 4.0
      dealDamage(unit, target, Math.round(unit.atk * 0.8))
    } else if (unit.name === 'Tofa') {
      // feinspec §6.1/§3.3 - Shock Strike: normaler Treffer + 45 Shock-Bonus obendrauf.
      dealDamage(unit, target, unit.atk, 45)
    } else {
      // feinspec §6.1 - Cross Slash: großer Einzelziel-Treffer (kein eigener taktischer
      // Zweck wie Suppress/Shock Strike/Heal, folgt daher wie ein normaler Angriff §3.9).
      dealDamage(unit, target, Math.round(unit.atk * 3.0))
    }
    unit.atb = 0
    this.battle.awaitingPlayerChoice = null
  }

  /** feinspec §3.4/§3.9 - Limit-Zünden: schaden(4,5·ATK, DEF) mit DEF-Ignore aufs Fokusziel (Vorauswahl im Popup, keine Ausnahme mehr). */
  fireLimit(unit: BattleUnit): void {
    if (!this.canFireLimit(unit)) return
    this.#dismissCallout()
    unit.defending = false
    const target = resolvePartyTarget(this.battle)
    if (!target) return
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

  /** feinspec §3.9 (M11) - Partei-Fokusziel per Klick setzen (auch fuer Auto-Figuren wirksam). */
  setFocusTarget(index: number): void {
    if (index < 0 || index >= this.battle.enemies.length) return
    if (!isAlive(this.battle.enemies[index])) return
    this.battle.focusTargetIndex = index
  }

  /**
   * feinspec §3.8a (M11) - freie Zonen-Rückkehr: das eigentliche Ventil. Nur zwischen Kämpfen.
   * Playtest-Fund (Nachtrag zu Entscheidung 2): ein manueller Zonenwechsel spawnt einen neuen
   * Kampf aus `this.save.party`, OHNE zuvor den im gerade verlassenen (unentschiedenen) Kampf
   * erlittenen Schaden zurückzuschreiben - `Character.hp/mp` stand danach noch auf dem Stand vom
   * Kampfbeginn, was im Spiel wie eine Gratis-Heilung aussah. §4.1 verlangt das Rückschreiben bei
   * JEDEM Verlassen eines Kampfes (Sieg/Niederlage/Zonenwechsel), nicht nur bei Sieg/Niederlage.
   * Der Zonenwechsel kostet weiterhin den investierten Kampf (kein EXP, s. `#onWin`/`#onLoss`
   * fuer die Vergleichsfaelle), laesst den erlittenen Schaden aber stehen.
   */
  selectZone(zoneIndex: number): void {
    if (this.phase !== 'battle') return
    if (zoneIndex < 1 || zoneIndex > this.save.maxZoneReached) return
    if (zoneIndex === this.save.currentZone) return
    this.#dismissCallout()
    const party = syncPartyFromBattle(this.save.party, this.battle.party)
    this.save = { ...this.save, party, currentZone: zoneIndex }
    const zone = findZone(zoneIndex)
    this.battle = spawnBattle(zone, party, this.save.partyLevel, this.reunionBoostMult)
    this.#checkZoneIntros(zone)
  }

  /** feinspec §3.8b (M11) - "nach diesem Kampf ins Gasthaus" umschalten; greift erst nach Kampfende. */
  toggleInnQueued(): void {
    this.save = { ...this.save, inn: { queued: !this.save.inn.queued } }
  }

  /** feinspec §3.8b (M11) - freiwilligen Gasthaus-Aufenthalt vorzeitig beenden (bei Niederlage gesperrt). */
  leaveInn(): void {
    if (this.innForced) return
    this.#leaveInn()
  }

  /**
   * prestige-reunion.md (M9) - Reset: Zonen-Fortschritt/Level; Erhalt: Roster, Bestiarium,
   * Rollout-Flags (reine UI-Lesbarkeit, kein Grund sie erneut zu verstecken), UND (M15,
   * 30.07.2026) der permanente `specialUnlocked`-Zustand je Figur - "der gelernte Special bleibt"
   * (ausruestung-gil.md §0) ist damit wirklich permanent, statt sich am naechsten Zonen-Trigger
   * wiederherzustellen. `freshCharacter()` setzt alles andere auf CHARACTERS-Ausgangswerte zurück,
   * daher wird der alte `specialUnlocked`-Stand VOR dem Reset gesichert und danach uebertragen.
   * Ertrag: Reunion-Essenz + `gambitsUnlocked` + der permanente `reunionBoostMult`-Stufenanstieg.
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
    // M15 - `specialUnlocked` ist permanent (ausruestung-gil.md §0): vor dem Reset sichern,
    // damit `freshCharacter()`s Rueckfall auf den CHARACTERS-Ausgangswert es nicht verliert.
    const specialUnlockedById = new Map(this.save.party.map((c) => [c.id, c.specialUnlocked]))
    const party = this.save.roster.map((id) => {
      const fresh = freshCharacter(id, mode)
      return specialUnlockedById.get(id) ? { ...fresh, specialUnlocked: true } : fresh
    })

    this.save = {
      ...this.save,
      currentZone: 1,
      maxZoneReached: 1,
      // prestige-reunion.md "Boss-Sieg faellt zurueck", Umsetzungsentscheidung 66 (01.08.2026) -
      // der Pflicht-Boss muss im neuen Durchlauf erneut besiegt werden, sonst bleibt canReunion
      // ab Durchlauf 2 dauerhaft wahr und zahlt Essenz ohne Kampf aus.
      chapterBossDefeated: false,
      party,
      // prestige-reunion.md - das Gruppenlevel ist der eine Wert, der zurueckfaellt (statt vier).
      partyLevel: 1,
      partyExp: 0,
      currencies: {
        reunionEssence: this.save.currencies.reunionEssence.add(REUNION_ESSENCE_GAIN),
      },
      reunionCount,
      flags: { ...this.save.flags, gambitsUnlocked: true },
      inn: { queued: false },
    }
    this.phase = 'battle'
    this.battle = spawnBattle(findZone(1), party, 1, this.reunionBoostMult)
    this.#triggerCallout(
      reunionCount === 1
        ? 'The 1st Reunion! Gambit graduation unlocked - permanent boost active.'
        : `Reunion #${reunionCount} complete - permanent boost increased!`,
    )
    writeSave(this.save)
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
    this.battle = spawnBattle(zone, this.save.party, this.save.partyLevel, this.reunionBoostMult)
    this.#checkZoneIntros(zone)
    writeSave(this.save)
    this.#triggerCallout(`Save imported – Zone ${this.save.currentZone}.`)
    return { ok: true }
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
      resolvePartyAction(unit, this.battle)
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
    // ui-layout.md "Mechanik-Einführung" (M17) - "blockierend, mit Pause": ein offenes
    // Einführungs-Popup haelt ALLES an (Kampf-Tick, Retry-/Gasthaus-Timer, Callout-Timer), nicht
    // nur den Kampf. Es gibt keinen Fall, in dem im Hintergrund weiterlaufen soll, waehrend der
    // Spieler den Text noch nicht weggeklickt hat.
    if (this.activeIntro) return

    if (this.calloutMessage) {
      this.#calloutRemaining -= deltaSeconds
      if (this.#calloutRemaining <= 0) this.#dismissCallout()
    }

    if (this.phase === 'retry') {
      this.retryRemaining -= deltaSeconds
      // feinspec §3.8c - nach der Zeitstrafe automatisch ins Gasthaus, DANACH Retry derselben Zone.
      if (this.retryRemaining <= 0) this.#enterInn(true, this.save.currentZone)
      return
    }
    if (this.phase === 'inn') {
      this.#advanceInn(deltaSeconds)
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
        this.#queueIntro('defend')
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

  /**
   * feinspec §3.6/§3.8 (M11) - Sieg: HP/MP-Stand aus dem Kampf übernehmen, EXP gutschreiben
   * (über Level-x-Zone gedämpft, §1a/M15), Sieg-Erholung (+25% HP/MP, §3.5) anwenden,
   * Bestiarium fortschreiben. Zonen-Rückkehr (§3.8a): nur das Erreichen der bisherigen Wand
   * (`maxZoneReached`) schiebt die Wand weiter (inkl. Roster-/Flag-Freischaltungen); ein Sieg beim
   * Farmen einer bereits geschafften Zone wiederholt dieselbe Zone unbegrenzt, ohne etwas zu verlieren.
   */
  #onWin(): void {
    const boostMult = this.reunionBoostMult
    const zone = findZone(this.save.currentZone)
    const reward = zoneReward(zone, this.save.partyLevel)

    // stats-kampfwerte.md §4.1 - die Wellen-Summe geht EINMAL in den Party-Topf, nicht je Figur.
    const leveled = applyVictoryExp(this.save.partyLevel, this.save.partyExp, reward.exp)
    const partyLevel = leveled.level
    if (partyLevel > this.save.partyLevel) {
      this.#triggerCallout(`Party level ${partyLevel}! The whole roster grows together.`)
    }

    let party = syncPartyFromBattle(this.save.party, this.battle.party).map((c) =>
      applyVictoryRecovery(c, partyLevel, boostMult),
    )
    const bestiary = this.#recordBestiary()

    const isFrontierClear = this.save.currentZone >= this.save.maxZoneReached

    if (isFrontierClear && this.save.currentZone >= CHAPTER1_MAX_ZONE) {
      this.save = {
        ...this.save,
        party,
        partyLevel,
        partyExp: leveled.exp,
        bestiary,
        chapterBossDefeated: true,
      }
      this.phase = 'chapter-complete'
      this.#queueIntro('reunion')
      writeSave(this.save)
      return
    }

    let flags = this.save.flags
    let roster = this.save.roster
    let maxZoneReached = this.save.maxZoneReached
    let nextZone: number

    if (isFrontierClear) {
      nextZone = this.save.maxZoneReached + 1
      maxZoneReached = nextZone

      if (!flags.manualToggleUnlocked && nextZone >= AUTO_ATTACK_UNLOCK_ZONE) {
        flags = { ...flags, autoAttackUnlocked: true, manualToggleUnlocked: true }
        party = party.map((c) => ({ ...c, controlMode: 'auto' }))
        this.#triggerCallout('Auto-Attack online – the party fights on its own now.')
        this.#queueIntro('auto_attack')
      }

      // feinspec §6.3 Z9-10 - Barrel stößt zu Beginn der Region 2 zur Party.
      if (!roster.includes('barrel') && nextZone >= BARREL_JOIN_ZONE) {
        roster = [...roster, 'barrel']
        party = [...party, joinCharacter('barrel', flags.manualToggleUnlocked ? 'auto' : 'manual', partyLevel, boostMult)]
        this.#triggerCallout('Barrel joins the party – suppressing fire incoming!')
        this.#queueIntro('barrel_intro')
      }

      // feinspec §6.3 Z19-20 - Tofa+Air is... stoßen zu Beginn der Region 3 zur Party (volle 4er-Party).
      if (!roster.includes('tofa') && nextZone >= REGION3_JOIN_ZONE) {
        roster = [...roster, 'tofa', 'airis']
        const mode = flags.manualToggleUnlocked ? 'auto' : 'manual'
        party = [...party, joinCharacter('tofa', mode, partyLevel, boostMult), joinCharacter('airis', mode, partyLevel, boostMult)]
        this.#triggerCallout('Tofa and Air is... join the party – full roster online!')
        this.#queueIntro('tofa_airis_intro')
        this.#queueIntro('shock')
      }

      // feinspec §4.1/§5.1/§6.4 (M15) - permanenter Zonen-Trigger statt Gil-Kauf: Claude bei Zone
      // 3, jede Figur bei ihrer eigenen `unlockedFromZone`. Einmal true, bleibt es true (§reunion()).
      const unlockedBefore = new Set(party.filter((c) => c.specialUnlocked).map((c) => c.id))
      party = party.map((c) => withSpecialTrigger(c, nextZone))
      const newlyUnlocked = party.filter((c) => c.specialUnlocked && !unlockedBefore.has(c.id))
      if (newlyUnlocked.length > 0) {
        if (!flags.mpVisible) flags = { ...flags, mpVisible: true }
        this.#triggerCallout(`${newlyUnlocked.map((c) => c.name).join(', ')} special unlocked – MP online!`)
        this.#queueIntro('special_mp')
      }
    } else {
      // feinspec §3.8a - Zonen-Rückkehr: eine bereits geschaffte Zone farmen wiederholt sie.
      nextZone = this.save.currentZone
    }

    this.save = {
      ...this.save,
      party,
      partyLevel,
      partyExp: leveled.exp,
      roster,
      currentZone: nextZone,
      maxZoneReached,
      flags,
      bestiary,
    }

    if (this.save.inn.queued) {
      this.#enterInn(false, nextZone)
    } else {
      const zone = findZone(nextZone)
      this.battle = spawnBattle(zone, party, partyLevel, boostMult)
      this.#checkZoneIntros(zone)
    }
  }

  /** feinspec §3.8c (M11) - Niederlage: HP/MP-Stand bleibt wie er war (KEINE Heilung), danach Zeitstrafe + Gasthaus. */
  #onLoss(): void {
    const party = syncPartyFromBattle(this.save.party, this.battle.party)
    this.save = { ...this.save, party }
    this.phase = 'retry'
    this.retryRemaining = RETRY_PENALTY
    this.#queueIntro('zone_return')
  }

  /**
   * feinspec §3.8b (M11) - Gasthaus-Aufenthalt beginnen. `forced` = Niederlage-Pflichtaufenthalt
   * (kein "Leave now"). Playtest-Fund: `inn.queued` ("nach diesem Kampf ins Gasthaus") wurde bisher
   * nur im freiwilligen Sieg-Pfad (`#onWin`) zurueckgesetzt - ein erzwungener Aufenthalt nach einer
   * Niederlage (`advance()` `phase === 'retry'` -> hier) liess das Flag unangetastet stehen. Danach
   * war der Spieler tatsaechlich im Gasthaus (die eigentliche Absicht des Flags ist damit erfuellt),
   * aber die Anzeige blieb "queued" und der naechste Sieg loeste ungefragt NOCH einen Aufenthalt aus.
   * Zentral hier zuruecksetzen deckt beide Eintrittswege (freiwillig ueber `#onWin`, erzwungen ueber
   * die Retry-Zeitstrafe) ab, statt es an jeder Aufrufstelle einzeln zu wiederholen.
   */
  #enterInn(forced: boolean, nextZone: number): void {
    this.#dismissCallout()
    this.phase = 'inn'
    this.innForced = forced
    this.innElapsed = 0
    this.#innNextZone = nextZone
    this.save = { ...this.save, inn: { queued: false } }
    this.#queueIntro('inn')
  }

  /** feinspec §3.8b (M11) - 10s Totzeit, danach 5%/s auf HP+MP gleichzeitig; endet automatisch bei voller Heilung. */
  #advanceInn(deltaSeconds: number): void {
    this.innElapsed += deltaSeconds
    const boostMult = this.reunionBoostMult

    if (this.innElapsed > INN_DEAD_TIME) {
      const healSeconds = Math.min(deltaSeconds, this.innElapsed - INN_DEAD_TIME)
      const party = this.save.party.map((c) => applyInnRecovery(c, this.save.partyLevel, healSeconds, boostMult))
      this.save = { ...this.save, party }
    }

    const fullyHealed = this.save.party.every((c) => {
      const maxHp = deriveCharacterMaxHp(c, this.save.partyLevel, boostMult)
      const maxMp = deriveCharacterMaxMp(c, this.save.partyLevel, boostMult)
      return c.hp >= maxHp && c.mp >= maxMp
    })
    if (fullyHealed) this.#leaveInn()
  }

  #leaveInn(): void {
    const zone = findZone(this.#innNextZone ?? this.save.currentZone)
    this.#innNextZone = null
    this.phase = 'battle'
    this.battle = spawnBattle(zone, this.save.party, this.save.partyLevel, this.reunionBoostMult)
    this.#checkZoneIntros(zone)
    writeSave(this.save)
  }
}

export const game = new GameStore()

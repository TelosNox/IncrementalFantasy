// Laufzeit-Kampfeinheit für den headless Tick-Loop (feinspec §5). Vereinigt
// Party- und Gegner-Zustand analog zur Fighter-Klasse in
// docs/spec/assets/sim/sim_chapter1.py, der validierten Referenzsimulation.

import type { Character, ControlMode, Monster, MonsterTrait } from './entities'
import {
  COUNTER_MAX_HITS,
  LIMIT_MAX,
  SHOCK_WINDOW,
  applyShockBuildup,
  deriveMaxMp,
  deriveStat,
  limitGainOnDealt,
  limitGainOnTaken,
  physicalDamage,
  scaleEnemyHp,
  scaleEnemyStat,
  shockDamage,
} from './formulas'

export interface BattleUnit {
  id: string
  name: string
  side: 'party' | 'enemy'
  maxHp: number
  hp: number
  maxMp: number
  mp: number
  atk: number
  mag: number
  def: number
  spd: number
  atb: number
  limit: number
  shock: number
  shockTimer: number
  suppress: number
  poisonTicks: number
  poisonDamage: number
  actionsDone: number
  hitsTaken: number
  fled: boolean
  /** kampf-analyse-shock.md §2/feinspec §5.1 - Defend-Stance, haelt bis zur naechsten eigenen Aktion (M8-Baseline: -50% erlittener Schaden, TBD s. §11 offene Playtest-Stellschrauben). */
  defending: boolean
  /** feinspec §3.4 - Esper-Modell: nur in Gate-/Boss-Encountern (Zone.limitAllowed) laedt/zuendet Limit ueberhaupt. */
  limitAllowed: boolean
  trait?: MonsterTrait
  /** gegner-encounter.md §5a/§7 (M16) - Faehigkeit zur Konter-Haltung (Content-Flag, s. `Monster.counterStance`). */
  counterStance?: boolean
  /** M16 - true waehrend des telegrafierten Konter-Fensters (s. `dealDamage`/`tick.ts`). */
  counterActive?: boolean
  /** M16 - Anzahl bereits erfolgter Konter im aktuellen Fenster; deckelt die Wucht (s. `dealDamage`). */
  counterHits?: number
  /** gegner-encounter.md §5a (M18) - Menge/Ziel-Index des zuletzt ausgeteilten Heil-Bursts, fuer die
   * Kampfanzeige (Heilzahl). Bleibt stehen, solange `actionsDone % 3 === 0` (s. `tick.ts`). */
  lastHealAmount?: number
  lastHealTargetIndex?: number
  controlMode?: ControlMode
  canSpecial?: boolean
  specialId?: string
  specialMpCost?: number
}

export function isAlive(unit: BattleUnit): boolean {
  return unit.hp > 0 && !unit.fled
}

/**
 * feinspec §4.1/stats-kampfwerte.md §4 - maximale HP einer Figur aus dem Gruppenlevel.
 * `partyLevel` = das gemeinsame Level der ganzen Party (stats-kampfwerte.md §4.1); die Figur
 * selbst traegt keins mehr, weshalb es hier explizit hereingereicht wird. Das fruehere
 * Waffen-Tier-Wachstum ist seit M15 in `character.growth` gefaltet (`content/characters.ts`).
 * `boostMult` = prestige-reunion.md permanenter Reunion-Boost (M9, default 1 = kein Boost,
 * z.B. fuer Zonen-1-Erststart oder headless Tests ohne Reunion-Kontext).
 */
export function deriveCharacterMaxHp(character: Character, partyLevel: number, boostMult = 1): number {
  return Math.round(deriveStat(character.base.hp, character.growth.hp, partyLevel) * boostMult)
}

/** feinspec §4.1 - maximale MP einer Figur aus dem Gruppenlevel (MP-Sonderfall, s. formulas.ts). Reunion-Boost s. oben. */
export function deriveCharacterMaxMp(character: Character, partyLevel: number, boostMult = 1): number {
  return Math.round(deriveMaxMp(character.base.mp, partyLevel) * boostMult)
}

/**
 * feinspec §4.1 - Party-Kampfeinheit aus dem Gruppenlevel ableiten. Reunion-Boost s. oben.
 * `limitAllowed` = Zone.limitAllowed (§3.4/§4.3) - in Kap. 1 nur an den drei Gates true.
 *
 * Verbindlich (Playtest-Fund, §4.1): HP/MP sind Übertragswerte, keine abgeleiteten Maxima.
 * `character.hp`/`character.mp` (aus dem Save) werden übernommen, nur auf das aktuelle
 * Maximum gedeckelt (Level-Up/Boost kann das Maximum seit dem letzten Speichern erhöht
 * haben) - NICHT durch das Maximum ersetzt. `atb`/`limit` starten dagegen immer bei 0.
 */
export function createPartyUnit(
  character: Character,
  partyLevel: number,
  zoneIndex: number,
  boostMult = 1,
  limitAllowed = false,
): BattleUnit {
  const atkAfterLevel = deriveStat(character.base.atk, character.growth.atk, partyLevel)
  const magAfterLevel = deriveStat(character.base.mag, character.growth.mag, partyLevel)
  const defAfterLevel = deriveStat(character.base.def, character.growth.def, partyLevel)
  const spdAfterLevel = deriveStat(character.base.spd, character.growth.spd, partyLevel)

  const maxHp = deriveCharacterMaxHp(character, partyLevel, boostMult)
  const maxMp = deriveCharacterMaxMp(character, partyLevel, boostMult)

  return {
    id: character.id,
    name: character.name,
    side: 'party',
    maxHp,
    // Playtest-Fund: `Character.hp/mp` sind zwischen Kaempfen absichtlich reelle
    // Zwischenwerte (Sieg-Erholung/Gasthaus-Drip runden bewusst NICHT, s.
    // `formulas.ts` hpGainPostVictory/mpGainPostVictory/innGain) - erst der Uebertritt
    // in die Kampf-Domaene (BattleUnit) rundet auf ganze HP/MP, wie es jede andere
    // Kampfformel auch tut. Ohne dieses Runden zeigte die UI z.B. "87.3/150" an.
    hp: Math.min(maxHp, Math.max(0, Math.round(character.hp))),
    maxMp,
    mp: Math.min(maxMp, Math.max(0, Math.round(character.mp))),
    atk: Math.round(atkAfterLevel * boostMult),
    mag: Math.round(magAfterLevel * boostMult),
    def: defAfterLevel,
    spd: spdAfterLevel,
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
    limitAllowed,
    controlMode: character.controlMode,
    // feinspec §4.1/§5.1 (M15) - permanenter Zonen-Trigger statt Zonen-Vergleich pro Kampf;
    // `zoneIndex` bleibt Funktionsparameter (Gegner-Skalierung), gate spielt hier keine Rolle mehr.
    canSpecial: character.specialUnlocked,
    specialId: character.special.id,
    specialMpCost: character.special.mpCost,
  }
}

/** feinspec §3.7/§4.2 - Gegner-Kampfeinheit, zonen-skaliert. */
export function createEnemyUnit(monster: Monster, zoneIndex: number, sizeMod = 1): BattleUnit {
  const hp = scaleEnemyHp(monster.base.hp, zoneIndex, sizeMod)
  return {
    id: monster.id,
    name: monster.name,
    side: 'enemy',
    maxHp: hp,
    hp,
    maxMp: 0,
    mp: 0,
    atk: scaleEnemyStat(monster.base.atk, zoneIndex),
    mag: 0,
    def: scaleEnemyStat(monster.base.def, zoneIndex),
    spd: Math.round(monster.base.spd), // SPD wird NICHT nach g skaliert (sim_chapter1.py: make_monster)
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
    limitAllowed: false, // Gegner zuenden kein Limit - irrelevantes Feld, konsistent gesetzt.
    trait: monster.trait,
    counterStance: monster.counterStance ?? false,
    counterActive: false,
    counterHits: 0,
  }
}

/** §3.1/§3.3/§3.4 - Schaden zufügen inkl. Shock-Aufbau & Limit-Ladung (`deal()` in sim_chapter1.py). */
export function dealDamage(attacker: BattleUnit, target: BattleUnit, rawAtk: number, shockBonus = 0): number {
  const inWindow = target.shockTimer > 0
  const dmg = inWindow ? shockDamage(rawAtk, target.def) : physicalDamage(rawAtk, target.def)
  target.hp -= dmg
  if (target.trait === 'bomb') target.hitsTaken += 1
  if (target.shockTimer <= 0) {
    const buildup = applyShockBuildup(target.shock, dmg, shockBonus)
    target.shock = buildup.shock
    if (buildup.windowTriggered) target.shockTimer = SHOCK_WINDOW
  }
  if (attacker.side === 'party' && attacker.limitAllowed) {
    attacker.limit = Math.min(LIMIT_MAX, attacker.limit + limitGainOnDealt(dmg, target.maxHp))
  }
  // gegner-encounter.md §5a/§7 (M16) - Konter-Fenster: jeder Treffer waehrend `counterActive`
  // schlaegt mit voller Wucht zurueck (gleiche Formel wie ein regulaerer Gegner-Treffer), aber
  // hoechstens `COUNTER_MAX_HITS`-mal je Fenster (s. dort - ein Einmal-Konter differenzierte M/T
  // in der Messung kaum, unbegrenzte Konter rissen A2/B2/C3 fuer Typ V/T). Blindes Auto (Fokus
  // bleibt auf dem Boss stehen) kassiert so bis zum Deckel, Ausweichen (Typ M, `smartTarget`)
  // umgeht das Fenster komplett. Nur ueber `dealDamage` (Attack/Special) - Limit-Zuenden ist
  // bewusst ausgenommen.
  if (target.side === 'enemy' && target.counterActive && (target.counterHits ?? 0) < COUNTER_MAX_HITS) {
    target.counterHits = (target.counterHits ?? 0) + 1
    attacker.hp -= physicalDamage(target.atk, attacker.def)
    // Deckel erreicht -> Haltung fuer den Rest des Fensters beenden (auch die UI-Anzeige, s.
    // `Stage.svelte` "(retaliates if struck!)", haengt an diesem Flag - sonst wuerde sie weiter
    // Konter versprechen, obwohl keiner mehr erfolgt: Nachvollziehbarkeit, gegner-encounter.md §6a).
    if (target.counterHits >= COUNTER_MAX_HITS) target.counterActive = false
  }
  return dmg
}

/** §5 - Gruppen-AoE (Bomb-Selbstzerstörung, telegrafierte Boss-Attacke). Defend halbiert den erlittenen Anteil (M8). */
export function aoeParty(party: BattleUnit[], damage: number): void {
  for (const p of party) {
    if (!isAlive(p)) continue
    const dmg = p.defending ? Math.round(damage * 0.5) : damage
    p.hp -= dmg
    if (p.limitAllowed) p.limit = Math.min(LIMIT_MAX, p.limit + limitGainOnTaken(dmg, p.maxHp, true))
  }
}

// Laufzeit-Kampfeinheit für den headless Tick-Loop (feinspec §5). Vereinigt
// Party- und Gegner-Zustand analog zur Fighter-Klasse in
// docs/spec/assets/sim/sim_chapter1.py, der validierten Referenzsimulation.

import type { Character, ControlMode, Monster, MonsterTrait } from './entities'
import { weaponStatMod } from '../content/weapons'
import {
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
  trait?: MonsterTrait
  controlMode?: ControlMode
  canSpecial?: boolean
  specialId?: string
  specialMpCost?: number
}

export function isAlive(unit: BattleUnit): boolean {
  return unit.hp > 0 && !unit.fled
}

/** feinspec §4.1/§6.4 - maximale HP einer Figur aus Level + Waffen-Tier. */
export function deriveCharacterMaxHp(character: Character): number {
  const hpAfterLevel = deriveStat(character.base.hp, character.growth.hp, character.level)
  return Math.round(hpAfterLevel * weaponStatMod(character.weaponTier).hp)
}

/** feinspec §4.1 - maximale MP einer Figur aus Level (MP-Sonderfall, s. formulas.ts). */
export function deriveCharacterMaxMp(character: Character): number {
  return deriveMaxMp(character.base.mp, character.level)
}

/** feinspec §4.1/§6.4 - Party-Kampfeinheit aus Level + Waffen-Tier ableiten. */
export function createPartyUnit(character: Character, zoneIndex: number): BattleUnit {
  const level = character.level
  const atkAfterLevel = deriveStat(character.base.atk, character.growth.atk, level)
  const magAfterLevel = deriveStat(character.base.mag, character.growth.mag, level)
  const defAfterLevel = deriveStat(character.base.def, character.growth.def, level)
  const spdAfterLevel = deriveStat(character.base.spd, character.growth.spd, level)

  const mod = weaponStatMod(character.weaponTier)
  const maxHp = deriveCharacterMaxHp(character)
  const mpAfterLevel = deriveCharacterMaxMp(character)

  return {
    id: character.id,
    name: character.name,
    side: 'party',
    maxHp,
    hp: maxHp,
    maxMp: mpAfterLevel,
    mp: mpAfterLevel,
    atk: Math.round(atkAfterLevel * mod.atk),
    mag: Math.round(magAfterLevel * mod.mag),
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
    controlMode: character.controlMode,
    canSpecial: zoneIndex >= character.special.unlockedFromZone,
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
    trait: monster.trait,
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
  if (attacker.side === 'party') {
    attacker.limit = Math.min(LIMIT_MAX, attacker.limit + limitGainOnDealt(dmg))
  }
  return dmg
}

/** §5 - Gruppen-AoE (Bomb-Selbstzerstörung, telegrafierte Boss-Attacke). */
export function aoeParty(party: BattleUnit[], damage: number): void {
  for (const p of party) {
    if (!isAlive(p)) continue
    p.hp -= damage
    p.limit = Math.min(LIMIT_MAX, p.limit + limitGainOnTaken(damage, true))
  }
}

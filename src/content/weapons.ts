// feinspec-kapitel1.md §6.4 - Waffen-Tier-Formel (Gil-Sink, Kapitel 1). Ein
// Item je Figur, Tier 0-4, Faustregel tier = level // 4 (max 4). Tier 1
// schaltet den Special frei. Slots/A-B-Layout bleiben leer bis Kapitel 2.

import type { Weapon, WeaponStatMod } from '../core/entities'

export const WEAPON_MAX_TIER = 4
export const WEAPON_SPECIAL_UNLOCK_TIER = 1
export const WEAPON_ATK_MOD_PER_TIER = 0.1
export const WEAPON_HP_MOD_PER_TIER = 0.05
export const WEAPON_MAG_MOD_PER_TIER = 0.1

/** feinspec §6.4 - Waffen-Stat-Modifikator für einen gegebenen Tier. */
export function weaponStatMod(tier: number): WeaponStatMod {
  return {
    atk: 1 + WEAPON_ATK_MOD_PER_TIER * tier,
    hp: 1 + WEAPON_HP_MOD_PER_TIER * tier,
    mag: 1 + WEAPON_MAG_MOD_PER_TIER * tier,
  }
}

/** feinspec §6.4 - Faustregel: tier = level // 4, gedeckelt bei WEAPON_MAX_TIER. */
export function weaponTierForLevel(level: number): number {
  return Math.min(WEAPON_MAX_TIER, Math.floor(level / 4))
}

export function createWeapon(ownerId: string, tier: number): Weapon {
  return {
    ownerId,
    tier,
    statMod: weaponStatMod(tier),
    unlocksSpecial: tier >= WEAPON_SPECIAL_UNLOCK_TIER,
    slots: [],
  }
}

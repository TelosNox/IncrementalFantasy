// Kern-Formeln nach feinspec-kapitel1.md §3. Jede Funktion referenziert im
// Kommentar die zugehörige Formelnummer (Architektur §7). Alles deterministisch,
// kein RNG (stats-kampfwerte.md §2). Rundung folgt Math.round, deckungsgleich
// mit der Python-Referenz `docs/spec/assets/sim/sim_chapter1.py` für alle in
// Kapitel 1 vorkommenden Werte (die feine round-half-to-even-Abweichung von
// Python bei exakten .5-Werten tritt hier nicht auf).

export const BASE_T = 2.0
export const ZONE_GROWTH = 1.07
export const SHOCK_MAX = 100
export const SHOCK_WINDOW = 6.0
export const SHOCK_DAMAGE_MULT = 2.0
export const SHOCK_ENEMY_ATB_MULT = 0.3
export const SUPPRESS_ATB_MULT = 0.5
export const LIMIT_MAX = 100
export const RETRY_PENALTY = 5.0
/** feinspec §3.5/§3.8d - Kanal 1: +25% des Maximums, HP UND MP gleich (Signalregel §3.8d). */
export const VICTORY_RECOVERY_RATE = 0.25
/** feinspec §3.8b - Gasthaus: 10s Totzeit (Fixkosten gegen Heil-Spam), danach 5%/s auf HP+MP gleichzeitig. */
export const INN_DEAD_TIME = 10.0
export const INN_RATE = 0.05
export const EXP_BASE = 20
export const EXP_GROWTH = 1.22

/**
 * MP wächst linear mit dem Level; feinspec §2 dokumentiert nur die
 * multiplikativen Wachstumsraten für HP/ATK/MAG/DEF/SPD, nicht für MP.
 * Wert aus der validierten Referenzsimulation übernommen (sim_chapter1.py,
 * make_char()), die laut Architektur §10 als Balance-Referenz gilt.
 */
export const MP_GROWTH_PER_LEVEL = 0.03

/** feinspec §4.1 - abgeleiteter Levelwert: round(base · growth^(level-1)). */
export function deriveStat(base: number, growthRate: number, level: number): number {
  return Math.round(base * Math.pow(growthRate, level - 1))
}

/** feinspec §4.1 - MP-Sonderfall (siehe MP_GROWTH_PER_LEVEL). */
export function deriveMaxMp(baseMp: number, level: number): number {
  return Math.round(baseMp * (1 + MP_GROWTH_PER_LEVEL * (level - 1)))
}

export interface DamageOptions {
  /** Shock-Fenster: DEF wird ignoriert (0 gesetzt). Auch für Limit-Zünden (DEF-Ignore). */
  ignoreDef?: boolean
  /** Zusätzlicher Schadensmultiplikator, z.B. ×2 im Shock-Fenster. */
  damageMult?: number
}

/** §3.1 Schaden (Mitigations-Kurve). Beispiel: ATK 14 vs. DEF 2 -> 12. */
export function physicalDamage(atk: number, def: number, opts: DamageOptions = {}): number {
  const effectiveDef = opts.ignoreDef ? 0 : def
  const base = Math.max(1, Math.round((atk * atk) / (atk + effectiveDef)))
  return opts.damageMult ? Math.round(base * opts.damageMult) : base
}

/** §3.1 Schaden im Shock-Fenster: DEF ignoriert und Ergebnis ×2. */
export function shockDamage(atk: number, def: number): number {
  return physicalDamage(atk, def, { ignoreDef: true, damageMult: SHOCK_DAMAGE_MULT })
}

/** §3.2 ATB-Takt: Sekunden bis zur nächsten Aktion bei gegebenem SPD. */
export function atbInterval(spd: number): number {
  return (BASE_T * 100) / spd
}

export interface AtbRateModifiers {
  /** Gegner ist geschockt -> ATB-Füllrate ×0,3. */
  shocked?: boolean
  /** Figur ist unterdrückt (Barrel-Special) -> ATB-Füllrate ×0,5. */
  suppressed?: boolean
}

/** §3.2 ATB-Füllrate pro Tick, inkl. Shock-/Suppress-Modifikatoren. */
export function atbFillPerTick(spd: number, dt: number, modifiers: AtbRateModifiers = {}): number {
  let rate = 1.0
  if (modifiers.shocked) rate *= SHOCK_ENEMY_ATB_MULT
  if (modifiers.suppressed) rate *= SUPPRESS_ATB_MULT
  return (dt / atbInterval(spd)) * rate
}

export interface ShockBuildupResult {
  shock: number
  windowTriggered: boolean
}

/** §3.3 Shock-Aufbau. Bei Erreichen von SHOCK_MAX startet das Fenster, Shock resettet auf 0. */
export function applyShockBuildup(currentShock: number, damage: number, bonus = 0): ShockBuildupResult {
  const next = currentShock + damage * 0.5 + bonus
  if (next >= SHOCK_MAX) return { shock: 0, windowTriggered: true }
  return { shock: next, windowTriggered: false }
}

/**
 * §3.4 Limit-Ladung bei zugefügtem Schaden. Esper-Modell-Revision: die alten Raten
 * (0,35/0,50/0,40) waren gegen eine über den ganzen Run persistierende Leiste
 * kalibriert und damit faktisch bedeutungslos (Leiste war ohnehin meist voll).
 * Jetzt startet Limit pro Gate-Kampf bei 0 und soll dort 1-2x volllaufen (§3.4) -
 * deutlich höhere Rate nötig. Startwert, s. §11 offene Playtest-Stellschraube.
 */
export function limitGainOnDealt(damage: number): number {
  return damage * 0.2
}

/** §3.4 Limit-Ladung bei erlittenem Schaden (AoE: niedriger als Einzelziel, je Figur). */
export function limitGainOnTaken(damage: number, isAoe = false): number {
  return damage * (isAoe ? 0.22 : 0.3)
}

/** §3.4 Limit-Zünden: schaden(4,5·ATK, DEF) mit DEF-Ignore auf das stärkste Ziel. */
export function limitFireDamage(atk: number, def: number): number {
  return physicalDamage(Math.round(atk * 4.5), def, { ignoreDef: true })
}

/** §3.5/§3.8d Kanal 1: +25% des Maximums nach Sieg (MP-Seite). */
export function mpGainPostVictory(maxMp: number): number {
  return VICTORY_RECOVERY_RATE * maxMp
}

/** §3.5/§3.8d Kanal 1: +25% des Maximums nach Sieg (HP-Seite, Signalregel §3.8d). */
export function hpGainPostVictory(maxHp: number): number {
  return VICTORY_RECOVERY_RATE * maxHp
}

/** §3.8b Gasthaus-Kanal 2: 5%/s des Maximums, erst nach Ablauf der Totzeit (in der aufrufenden Stelle geprüft). */
export function innGain(max: number, seconds: number): number {
  return INN_RATE * max * seconds
}

/** feinspec §2 - EXP für den nächsten Levelaufstieg. */
export function expToNext(level: number): number {
  return Math.round(EXP_BASE * Math.pow(EXP_GROWTH, level - 1))
}

export interface ExpGainResult {
  level: number
  exp: number
}

/** §3.6 EXP/Level: Level-Up sobald exp >= exp_to_next(L), Überschuss wird übertragen. */
export function applyExpGain(level: number, exp: number, gained: number): ExpGainResult {
  let currentLevel = level
  let pool = exp + gained
  while (pool >= expToNext(currentLevel)) {
    pool -= expToNext(currentLevel)
    currentLevel += 1
  }
  return { level: currentLevel, exp: pool }
}

/** §3.7 Zonen-Skalierungsfaktor: g^(zoneIndex-1). */
export function zoneScaleFactor(zoneIndex: number): number {
  return Math.pow(ZONE_GROWTH, zoneIndex - 1)
}

/** §3.7 Zonen-skalierter Monster-Stat (ATK/DEF/EXP/Gil - ohne Size-Modifikator). */
export function scaleEnemyStat(base: number, zoneIndex: number): number {
  return Math.round(base * zoneScaleFactor(zoneIndex))
}

/** §3.7 Zonen-skalierte Monster-HP, inkl. Size-Modifikator (±15%). */
export function scaleEnemyHp(baseHp: number, zoneIndex: number, sizeMod = 1): number {
  return Math.round(baseHp * zoneScaleFactor(zoneIndex) * sizeMod)
}

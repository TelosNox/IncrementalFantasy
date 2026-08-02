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
 * gegner-encounter.md §5a (M16) - Heiler-Gegner: Heilmenge relativ zu seinem eigenen ATK,
 * analog zu Air is...' Second Wind (2,2×MAG, feinspec §6.1). Startwert 2,5 war im Browser-Playtest
 * (01.08.2026) zu stark: Bandbox heilt (auch) sich selbst, sobald es das verletzteste Ziel ist -
 * gegen zwei fokussierende Angreifer (~15 Schaden je Treffer, eigenes ATB-Tempo) hielt 2,5×ATK
 * (33 HP je 2s) beim Live-Test locker mit, das gezielte Toeten fuehlte sich NICHT eindeutig
 * ueberlegen an (Kernversprechen von §5a verfehlt). 1,2×ATK (~16 HP je 2s) laesst zwei
 * fokussierende Angreifer klar gewinnen, haelt aber weiterhin spuerbar gegen einen einzelnen
 * Angreifer/einen ignorierten Heiler durch - gegen `tests/chapter-playthrough.test.ts` erneut
 * validiert. Weiterhin Startwert, s. §11 offene Playtest-Stellschraube.
 */
export const ENEMY_HEAL_MULT = 1.2

/**
 * gegner-encounter.md §5a (M18, Konzept-Review 01.08.2026) - Heiler-Gegner heilen seit dem
 * M17-Playtest-Befund ("der Balken bewegt sich fast gar nicht") gebuendelt statt jeden eigenen
 * Zug: alle drei Aktionen ein Puls (Attack, Telegraf, Heilung), `HEAL_BURST_MULT`-mal so gross
 * wie der alte Dauerwert - macht den Ausschlag sichtbar, bei gleicher Heilung pro Sekunde
 * (`ENEMY_HEAL_MULT` bleibt bewusst 1,2, s. Umsetzungsentscheidung 76). S. `tick.ts` resolveEnemyAction.
 */
export const HEAL_BURST_MULT = 3

/** §5a - Heilmenge eines Heiler-Gegners fuer einen Verbuendeten (unskalierte Basisrate, s. `HEAL_BURST_MULT`). */
export function enemyHealAmount(atk: number): number {
  return Math.round(atk * ENEMY_HEAL_MULT)
}

/** gegner-encounter.md §5a (M18) - tatsaechlich ausgeteilte Menge je Heil-Puls: 3,6×ATK statt 1,2×ATK. */
export function enemyHealBurstAmount(atk: number): number {
  return Math.round(atk * ENEMY_HEAL_MULT * HEAL_BURST_MULT)
}

/**
 * gegner-encounter.md §5a/§7 (M16) - Konter-Fenster: Deckel gegen einen Schadens-Teufelskreis.
 * "Jeder Treffer kontert, unbegrenzt" liess laengere Vaultron-Kaempfe (mehr Ticks im Fenster)
 * spiralfoermig noch laenger werden und riss A2/B2/C3 (Typ V/T ohne Ausweichmoeglichkeit) -
 * gemessen gegen `tests/chapter-playthrough.test.ts`, s. Umsetzungsentscheidung M16. Der Deckel
 * haelt die Wucht linear (max. 2 Konter je Fenster, volle Schadensformel), statt sie ueber einen
 * Bruchteils-Multiplikator zu daempfen - so bleibt der einzelne Konter spuerbar (fordernd), ohne
 * dass ein besonders langes Fenster unbegrenzt eskaliert.
 */
export const COUNTER_MAX_HITS = 2

/*
 * Bewusst KEINE Regions-Stufe auf die Gegner-Basiswerte. feinspec §3.7 sah mit der Umstellung
 * auf das Gruppenlevel ein `REGION_STEP` (x1,5 ab Z9, x1,4 ab Z19) vor, um den Roster-Sprung
 * aufzufangen - als ausdruecklicher Schaetzwert, "gegen die TS-Engine zu validieren" (§11).
 * Die Messung gegen `tests/chapter-playthrough.test.ts` hat die Annahme widerlegt: ohne Stufe
 * trifft das Kapitel die §7.4-Baseline (M 13,3 / T 42,8 / V 53,2 min gegen 15,6 / 44,3 / 53,0),
 * mit x1,5/x1,4 explodiert es auf 84 / 177 / 203 min. Details: Umsetzungsentscheidung 42.
 */

/**
 * MP wächst linear mit dem Level; feinspec §2 dokumentiert nur die
 * multiplikativen Wachstumsraten für HP/ATK/MAG/DEF/SPD, nicht für MP.
 * Wert aus der validierten Referenzsimulation übernommen (sim_chapter1.py,
 * make_char()), die laut Architektur §10 als Balance-Referenz gilt.
 */
export const MP_GROWTH_PER_LEVEL = 0.03

/** feinspec §4.1 - abgeleiteter Wert auf dem Gruppenlevel: round(base · growth^(level-1)). */
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
 * §3.4 Limit-Ladung bei zugefügtem Schaden. Konzept-Review 01.08.2026 (nach dem
 * M17-Playtest): relative statt absolute Rate - Schaden und HP wachsen über Zone
 * und Level, LIMIT_MAX bleibt fix bei 100, eine absolute Rate driftet also übers
 * Kapitel. Jetzt am Anteil der Ziel-maxHP: limit += 60 * (schaden / maxHP des Ziels).
 */
export function limitGainOnDealt(damage: number, targetMaxHp: number): number {
  return 60 * (damage / targetMaxHp)
}

/**
 * §3.4 Limit-Ladung bei erlittenem Schaden, relativ zur eigenen maxHP
 * (AoE: · 0,75 des Werts, je Figur).
 */
export function limitGainOnTaken(damage: number, ownMaxHp: number, isAoe = false): number {
  return 80 * (damage / ownMaxHp) * (isAoe ? 0.75 : 1)
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

/**
 * feinspec §3.6/oekonomie-waehrungen.md §1a (M15, 30.07.2026) - EXP-Daempfung ueber
 * Level x Zone. Ersetzt den zuvor unbegrenzten Ertrag: Idle-Farmen einer Zone, in der
 * die Party laengst ueberlevelt ist, war im zweiten Playtest die staerkste Spielweise
 * (EXP/Kill sinkt zwar mit der Zonen-Tiefe, EXP/SEKUNDE steigt aber, weil die Kill-Zeit
 * schneller kollabiert als der Ertrag). Plateau + Sturz, NIE 0 im FLOOR-Bereich (A3 darf
 * nie aushebeln) - ABER jenseits von CUTOFF Ueberschuss-Leveln harte Null (M15a,
 * Konzept-Review 31.07.2026, oekonomie-waehrungen.md §1a "Nachtrag"): der Floor allein
 * schuetzt nur den Ertrag PRO SIEG, nicht die SIEGE PRO STUNDE - eine hoffnungslos
 * ueberlevelte Party gewinnt so schnell, dass selbst 1 EXP/Sieg zum campingfaehigen
 * Kanal wird (~14.400 EXP in 8h bei ~1.800 Siegen/h). A3 haengt seitdem NUR noch am
 * PLATEAU (1-2 Zonen zurueck bleiben vor dem Cutoff und zahlen voll), nicht mehr am Floor.
 *
 * Startwerte (Umsetzungsentscheidung M15/M15a, s. 06_Implementierungsplan_Kapitel1.md):
 * - PLATEAU ~2-3 Level (breit genug, damit "1-2 Zonen zurueck" fuer den schwachen
 *   Spieler bezahlbar bleibt, feinspec §12 A3).
 * - DECAY exponentiell pro Ueberschuss-Level, FLOOR > 0 nur INNERHALB des Cutoffs.
 * - CUTOFF: ab wo der Floor durch eine harte Null ersetzt wird (feinspec §12 B5,
 *   Typ K - Camper). Gemessen gegen `tests/chapter-playthrough.test.ts`.
 */
export const EXP_DAMPING_PLATEAU = 2.5
export const EXP_DAMPING_DECAY = 0.72
export const EXP_DAMPING_FLOOR = 0.03
export const EXP_DAMPING_CUTOFF = 6

/**
 * oekonomie-waehrungen.md §1a - "erwartetes Level je Zone, aus der Zonen-Kurve
 * ABGELEITET, nicht als Tabelle gepflegt". Implementiert in `progression.ts`
 * (`expectedLevelForZone`), weil die Ableitung die Zonen-/Monster-Content-Daten
 * braucht (Importzyklus-Grund, s. dort) - hier nur der reine Daempfungsfaktor,
 * der lediglich `partyLevel`/`expectedLevel` als Zahlen kennt.
 *
 * Rueckgabe 0 (statt des Floors) jenseits von CUTOFF Ueberschuss-Leveln - `zoneReward()`
 * darf diesen Fall NICHT mehr auf 1 anheben (M15a, s. dort).
 */
export function expDampingFactor(partyLevel: number, expectedLevel: number): number {
  const excess = Math.max(0, partyLevel - expectedLevel - EXP_DAMPING_PLATEAU)
  if (excess <= 0) return 1
  if (excess > EXP_DAMPING_CUTOFF) return 0
  return Math.max(EXP_DAMPING_FLOOR, Math.pow(EXP_DAMPING_DECAY, excess))
}

/**
 * §3.6 EXP/Gruppenlevel: Level-Up sobald exp >= exp_to_next(L), Überschuss wird übertragen.
 * Angewandt auf den Party-Topf (`SaveState.partyLevel`/`partyExp`), nicht mehr je Figur -
 * die Rate ist dieselbe wie zuvor, weil schon vorher jede Figur die volle Wellen-Summe erhielt
 * (stats-kampfwerte.md §4.1, feinspec §2).
 */
export function applyExpGain(level: number, exp: number, gained: number): ExpGainResult {
  let currentLevel = level
  let pool = exp + gained
  while (pool >= expToNext(currentLevel)) {
    pool -= expToNext(currentLevel)
    currentLevel += 1
  }
  return { level: currentLevel, exp: pool }
}

/** §3.7 Zonen-Skalierungsfaktor: g^(zoneIndex-1). Gilt für Kampfwerte UND Belohnungen. */
export function zoneScaleFactor(zoneIndex: number): number {
  return Math.pow(ZONE_GROWTH, zoneIndex - 1)
}

/** §3.7 Zonen-skalierter Monster-Stat (ATK/DEF/EXP - ohne Size-Modifikator). */
export function scaleEnemyStat(base: number, zoneIndex: number): number {
  return Math.round(base * zoneScaleFactor(zoneIndex))
}

/** §3.7 Zonen-skalierte Monster-HP, inkl. Size-Modifikator (±15%). */
export function scaleEnemyHp(baseHp: number, zoneIndex: number, sizeMod = 1): number {
  return Math.round(baseHp * zoneScaleFactor(zoneIndex) * sizeMod)
}

// Migrations-Grundgerüst (Architektur §6). v1 -> v2: M11 (Ventil-Kette) fügt
// `maxZoneReached`/`inn` hinzu und legt das alte `offline`-Feld still (feinspec
// §3.8e). v2 -> v3: die vier Charakter-Level werden zu einem Gruppenlevel
// (stats-kampfwerte.md §4.1). v3 -> v4: M15 (30.07.2026) streicht Gil und die
// Waffen-Tier-Leiter, Special-Unlock wird zum permanenten `specialUnlocked`-Flag.
// v4 -> v5: der Kapitel-Boss ist Pflicht (Umsetzungsentscheidung 61), `canReunion`
// haengt jetzt an `chapterBossDefeated` statt `currentZone >= 30`.
// Ältere Stände laufen die Kette der Reihe nach durch; künftige Schritte werden
// hier nur noch angehängt.

import type { Character } from '../core/entities'
import { SAVE_VERSION } from './schema'
import type { SerializedSaveState } from './serialize'

/** v4-Save-Shape (vor dem Pflicht-Boss): kein `chapterBossDefeated`. */
interface SerializedSaveStateV4 extends Omit<SerializedSaveState, 'version' | 'chapterBossDefeated'> {
  version: 4
}

/** v3-Character-Shape (vor M15): trug noch `weaponTier`, kein `specialUnlocked`. */
type CharacterV3 = Omit<Character, 'specialUnlocked'> & { weaponTier: number }

/** v3-Save-Shape: `currencies` hatte noch `gil`, Party noch `weaponTier` statt `specialUnlocked`. */
interface SerializedSaveStateV3 extends Omit<SerializedSaveStateV4, 'version' | 'party' | 'currencies'> {
  version: 3
  party: CharacterV3[]
  currencies: { gil: string; reunionEssence: string }
}

/** v2-Character-Shape (vor dem Gruppenlevel): jede Figur trug ihr eigenes `level`/`exp`. */
type CharacterV2 = CharacterV3 & { level: number; exp: number }

/** v2-Save-Shape: Party mit Charakter-Leveln, noch ohne `partyLevel`/`partyExp`. */
interface SerializedSaveStateV2 extends Omit<SerializedSaveStateV3, 'version' | 'party' | 'partyLevel' | 'partyExp'> {
  version: 2
  party: CharacterV2[]
}

/** v1-Save-Shape (vor M11): kein `maxZoneReached`/`inn`, dafür `offline.lastSeen`. */
interface SerializedSaveStateV1 extends Omit<SerializedSaveStateV2, 'version' | 'maxZoneReached' | 'inn'> {
  version: 1
  offline: { lastSeen: number }
}

/**
 * v1 -> v2: Offline-Progress stillgelegt (feinspec §3.8e), Zonen-Rückkehr eingeführt.
 * Bestehender Fortschritt bleibt vollständig spielbar: die zuletzt bespielte Zone
 * wird als höchste erreichte übernommen (nicht auf 1 zurückgesetzt), damit ein
 * Spieler, der z.B. bei Zone 14 stand, dort und alles davor weiter frei anwählen
 * kann. `inn.queued` startet false (keine Anmeldung aus einem alten Save ableitbar).
 */
function migrateV1toV2(data: SerializedSaveStateV1): SerializedSaveStateV2 {
  const { offline: _offline, ...rest } = data
  return {
    ...rest,
    version: 2,
    maxZoneReached: data.currentZone,
    inn: { queued: false },
  }
}

/**
 * v2 -> v3: vier Charakter-Level werden zu einem Gruppenlevel (stats-kampfwerte.md §4.1).
 * Übernommen wird das **höchste** vorhandene Level samt dessen EXP-Rest - das ist bei alten
 * Ständen immer die Figur, die von Anfang an dabei war (Claude). Die Alternative (Durchschnitt
 * oder das Minimum) wäre eine stille Rückstufung des erspielten Fortschritts; das höchste Level
 * entspricht genau dem, was die neue Regel bei einem von vorn gespielten Save ergeben hätte,
 * denn dort erhielt jede Figur ohnehin die volle Wellen-Summe. Die Neuzugänge steigen damit
 * beim Laden auf den Stand der Party auf - dieselbe Wirkung wie im laufenden Spiel.
 */
function migrateV2toV3(data: SerializedSaveStateV2): SerializedSaveStateV3 {
  const leader = data.party.reduce<CharacterV2 | null>(
    (best, c) => (best === null || c.level > best.level ? c : best),
    null,
  )
  const party = data.party.map((c) => {
    const { level: _level, exp: _exp, ...rest } = c
    return rest
  })
  return {
    ...data,
    version: 3,
    party,
    partyLevel: leader?.level ?? 1,
    partyExp: leader?.exp ?? 0,
  }
}

/**
 * v3 -> v4 (M15, 30.07.2026): Gil und die Waffen-Tier-Leiter sind gestrichen
 * (oekonomie-waehrungen.md "Gil ist gestrichen"). `weaponTier` fällt weg, der alte
 * Special-Gate `weaponTier >= 1` wird verlustfrei auf den neuen permanenten
 * `specialUnlocked`-Flag abgebildet - wer die Waffe schon gekauft hatte, behält den
 * Special (kein Rückschritt durch die Migration), alle anderen lösen den Zonen-Trigger
 * beim nächsten Fortschritt regulär aus (`ui/gameStore.svelte.ts` `withSpecialTrigger`).
 */
function migrateV3toV4(data: SerializedSaveStateV3): SerializedSaveStateV4 {
  const { gil: _gil, ...currencies } = data.currencies
  const party = data.party.map((c) => {
    const { weaponTier, ...rest } = c
    return { ...rest, specialUnlocked: weaponTier >= 1 }
  })
  return {
    ...data,
    version: 4,
    party,
    currencies,
  }
}

/**
 * v4 -> v5 (Umsetzungsentscheidung 61, 31.07.2026): der Kapitel-Boss ist Pflicht,
 * `canReunion` verlangt jetzt `chapterBossDefeated` statt `currentZone >= 30`. Ein alter
 * Save kann nicht rückwirkend belegen, ob Vaultron tatsächlich besiegt wurde - das war
 * unter der alten Regel gerade nicht nötig, um Zone 30 zu erreichen oder zu reunionen.
 * `chapterBossDefeated` startet deshalb immer `false`; wer schon bei Zone 30 steht,
 * muss den Kampf (einmalig) gewinnen, um weiter zu reunionen. Kein stiller Fortschritt,
 * aber auch kein Rückschritt: `currentZone`/`maxZoneReached` bleiben unangetastet.
 */
function migrateV4toV5(data: SerializedSaveStateV4): SerializedSaveState {
  return {
    ...data,
    version: 5,
    chapterBossDefeated: false,
  }
}

export function migrate(
  data: SerializedSaveState | SerializedSaveStateV4 | SerializedSaveStateV3 | SerializedSaveStateV2 | SerializedSaveStateV1,
): SerializedSaveState {
  if ((data as { version: number }).version === SAVE_VERSION) return data as SerializedSaveState
  if ((data as { version: number }).version === 1) {
    return migrateV4toV5(migrateV3toV4(migrateV2toV3(migrateV1toV2(data as SerializedSaveStateV1))))
  }
  if ((data as { version: number }).version === 2) {
    return migrateV4toV5(migrateV3toV4(migrateV2toV3(data as SerializedSaveStateV2)))
  }
  if ((data as { version: number }).version === 3) {
    return migrateV4toV5(migrateV3toV4(data as SerializedSaveStateV3))
  }
  if ((data as { version: number }).version === 4) {
    return migrateV4toV5(data as SerializedSaveStateV4)
  }
  // Kein weiterer Vorgänger vorhanden - ein unbekannter/höherer Versionsstand ist ein
  // fremder/korrupter Save. Sichtbare Warnung statt stillem Überschreiben (Architektur §6, M10).
  throw new Error(`Keine Migration von Save-Version ${(data as { version: number }).version} zu ${SAVE_VERSION} verfügbar`)
}

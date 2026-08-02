import Decimal from 'break_eternity.js'
import { describe, expect, it } from 'vitest'
import { BARREL, CLAUDE } from '../src/content/characters'
import { migrate } from '../src/save/migrate'
import { SAVE_VERSION, type SaveState } from '../src/save/schema'
import { deserializeFromJson, serializeToJson, type SerializedSaveState } from '../src/save/serialize'

function sampleSaveState(): SaveState {
  return {
    version: SAVE_VERSION,
    chapter: 1,
    currentZone: 9,
    maxZoneReached: 12,
    chapterBossDefeated: false,
    party: [{ ...CLAUDE }, { ...BARREL }],
    // stats-kampfwerte.md §4.1 - ein Level/EXP-Stand fuer die ganze Party.
    partyLevel: 6,
    partyExp: 12,
    roster: ['claude', 'barrel'],
    currencies: {
      reunionEssence: new Decimal(140),
    },
    bestiary: {
      blando: {
        monsterId: 'blando',
        discovered: true,
        weaknessRevealed: null,
        weaknessUsable: false,
        persistsThroughReunion: true,
      },
    },
    reunionCount: 0,
    flags: {
      autoAttackUnlocked: true,
      mpVisible: true,
      manualToggleUnlocked: true,
      defenseUnlocked: false,
      materiaUnlocked: false,
      gambitsUnlocked: false,
    },
    inn: { queued: false },
    introsSeen: { claude_intro: true },
    exhaustedZonesNotified: { 5: true },
    gateBestAttempts: { 8: 42 },
  }
}

describe('Architektur §6 - Save-Round-Trip (serialize -> deserialize)', () => {
  it('liefert nach Serialisierung/Deserialisierung einen identischen State', () => {
    const original = sampleSaveState()
    const restored = deserializeFromJson(serializeToJson(original))

    expect(restored.version).toBe(original.version)
    expect(restored.chapter).toBe(original.chapter)
    expect(restored.currentZone).toBe(original.currentZone)
    expect(restored.maxZoneReached).toBe(original.maxZoneReached)
    expect(restored.party).toEqual(original.party)
    expect(restored.partyLevel).toBe(original.partyLevel)
    expect(restored.partyExp).toBe(original.partyExp)
    expect(restored.roster).toEqual(original.roster)
    expect(restored.bestiary).toEqual(original.bestiary)
    expect(restored.reunionCount).toBe(original.reunionCount)
    expect(restored.flags).toEqual(original.flags)
    expect(restored.inn).toEqual(original.inn)
    expect(restored.introsSeen).toEqual(original.introsSeen)
    expect(restored.exhaustedZonesNotified).toEqual(original.exhaustedZonesNotified)
    expect(restored.gateBestAttempts).toEqual(original.gateBestAttempts)
    expect(restored.currencies.reunionEssence.eq(original.currencies.reunionEssence)).toBe(true)
  })

  it('serialisiert Reunion-Essenz als String, nicht als natives JSON-number (Anti-Pattern #10)', () => {
    const parsed = JSON.parse(serializeToJson(sampleSaveState()))
    expect(typeof parsed.currencies.reunionEssence).toBe('string')
  })

  it('übersteht sehr große Reunion-Essenz-Werte ohne Präzisionsverlust (BigNumber ab Tag 1)', () => {
    const original = sampleSaveState()
    original.currencies.reunionEssence = new Decimal('1e500')
    const restored = deserializeFromJson(serializeToJson(original))
    expect(restored.currencies.reunionEssence.eq(original.currencies.reunionEssence)).toBe(true)
  })
})

describe('Architektur §6 - Migrations-Grundgerüst', () => {
  it('lässt den aktuellen Version-Stand unverändert durch', () => {
    const data = { version: SAVE_VERSION } as unknown as SerializedSaveState
    expect(migrate(data)).toBe(data)
  })

  it('wirft bei unbekannter/fremder Save-Version statt still zu überschreiben', () => {
    const data = { version: 99 } as unknown as SerializedSaveState
    expect(() => migrate(data)).toThrow()
  })

  it('migriert v1 (M0-M10, vor der Ventil-Kette) über v2 hinweg: offline entfällt, maxZoneReached/inn/Gruppenlevel kommen dazu', () => {
    const v1 = {
      version: 1,
      chapter: 1,
      currentZone: 14,
      party: [],
      roster: ['claude'],
      currencies: { gil: '100', reunionEssence: '0' },
      bestiary: {},
      reunionCount: 0,
      flags: {
        autoAttackUnlocked: true,
        mpVisible: true,
        manualToggleUnlocked: true,
        defenseUnlocked: false,
        materiaUnlocked: false,
        gambitsUnlocked: false,
      },
      offline: { lastSeen: 1732300000 },
    } as unknown as SerializedSaveState

    const migrated = migrate(v1)

    expect(migrated.version).toBe(SAVE_VERSION)
    // Bestehender Fortschritt bleibt vollstaendig selektierbar - die zuletzt bespielte
    // Zone gilt als hoechste erreichte, statt den Spieler auf Zone 1 zurueckzuwerfen.
    expect(migrated.maxZoneReached).toBe(14)
    expect(migrated.inn).toEqual({ queued: false })
    expect((migrated as unknown as { offline?: unknown }).offline).toBeUndefined()
    // Leere Party (v1-Testdatensatz) -> Gruppenlevel faellt auf den Startwert zurueck.
    expect(migrated.partyLevel).toBe(1)
    expect(migrated.partyExp).toBe(0)
  })

  // stats-kampfwerte.md §4.1 - der eigentliche Grund fuer v3: aus vier Charakter-Leveln wird eins.
  it('migriert v2 nach v3/v4: das hoechste Charakter-Level wird zum Gruppenlevel, level/exp/weaponTier entfallen an der Figur', () => {
    const v2 = {
      version: 2,
      chapter: 1,
      currentZone: 20,
      maxZoneReached: 20,
      party: [
        { ...CLAUDE, weaponTier: 1, level: 20, exp: 7 },
        { ...BARREL, weaponTier: 0, level: 12, exp: 3 },
      ],
      roster: ['claude', 'barrel'],
      currencies: { gil: '100', reunionEssence: '0' },
      bestiary: {},
      reunionCount: 0,
      flags: {
        autoAttackUnlocked: true,
        mpVisible: true,
        manualToggleUnlocked: true,
        defenseUnlocked: false,
        materiaUnlocked: false,
        gambitsUnlocked: false,
      },
      inn: { queued: false },
    } as unknown as SerializedSaveState

    const migrated = migrate(v2)

    expect(migrated.version).toBe(SAVE_VERSION)
    // Das hoechste vorhandene Level gewinnt - der Nachzuegler Barrel steigt auf, statt
    // Claude auf Barrels Stand zurueckzustufen (kein stiller Fortschrittsverlust).
    expect(migrated.partyLevel).toBe(20)
    expect(migrated.partyExp).toBe(7)
    expect((migrated as unknown as { currencies: { gil?: string } }).currencies.gil).toBeUndefined()
    for (const c of migrated.party) {
      expect(c).not.toHaveProperty('level')
      expect(c).not.toHaveProperty('exp')
      expect(c).not.toHaveProperty('weaponTier')
    }
    // Claude hatte die Waffe schon gekauft (weaponTier >= 1) - der Special bleibt erhalten.
    expect(migrated.party.find((c) => c.id === 'claude')!.specialUnlocked).toBe(true)
    expect(migrated.party.find((c) => c.id === 'barrel')!.specialUnlocked).toBe(false)
  })

  // M15 (30.07.2026) - Gil und die Waffen-Tier-Leiter sind gestrichen; `weaponTier >= 1`
  // wird verlustfrei auf den neuen permanenten `specialUnlocked`-Flag abgebildet.
  it('migriert v3 nach v4: Gil entfaellt, weaponTier>=1 wird verlustfrei zu specialUnlocked', () => {
    const v3 = {
      version: 3,
      chapter: 1,
      currentZone: 9,
      maxZoneReached: 9,
      party: [
        { ...CLAUDE, weaponTier: 1 },
        { ...BARREL, weaponTier: 0 },
      ],
      partyLevel: 8,
      partyExp: 3,
      roster: ['claude', 'barrel'],
      currencies: { gil: '250', reunionEssence: '0' },
      bestiary: {},
      reunionCount: 0,
      flags: {
        autoAttackUnlocked: true,
        mpVisible: true,
        manualToggleUnlocked: true,
        defenseUnlocked: false,
        materiaUnlocked: false,
        gambitsUnlocked: false,
      },
      inn: { queued: false },
    } as unknown as SerializedSaveState

    const migrated = migrate(v3)

    expect(migrated.version).toBe(SAVE_VERSION)
    expect((migrated as unknown as { currencies: { gil?: string } }).currencies.gil).toBeUndefined()
    const claude = migrated.party.find((c) => c.id === 'claude')!
    const barrel = migrated.party.find((c) => c.id === 'barrel')!
    expect(claude).not.toHaveProperty('weaponTier')
    expect(claude.specialUnlocked).toBe(true)
    expect(barrel.specialUnlocked).toBe(false)
  })

  // Umsetzungsentscheidung 61 (31.07.2026) - der Kapitel-Boss ist Pflicht. Ein alter Save kann
  // nicht rueckwirkend belegen, ob Vaultron besiegt wurde (unter der alten Regel unnoetig, um
  // Zone 30 zu erreichen oder zu reunionen) - `chapterBossDefeated` startet deshalb false, auch
  // wenn `currentZone` schon bei/ueber 30 steht.
  it('migriert v4 nach v5: chapterBossDefeated startet false, auch bei currentZone 30', () => {
    const v4 = {
      version: 4,
      chapter: 1,
      currentZone: 30,
      maxZoneReached: 30,
      party: [{ ...CLAUDE }],
      partyLevel: 20,
      partyExp: 3,
      roster: ['claude'],
      currencies: { reunionEssence: '0' },
      bestiary: {},
      reunionCount: 0,
      flags: {
        autoAttackUnlocked: true,
        mpVisible: true,
        manualToggleUnlocked: true,
        defenseUnlocked: false,
        materiaUnlocked: false,
        gambitsUnlocked: false,
      },
      inn: { queued: false },
    } as unknown as SerializedSaveState

    const migrated = migrate(v4)

    expect(migrated.version).toBe(SAVE_VERSION)
    expect(migrated.chapterBossDefeated).toBe(false)
    expect(migrated.currentZone).toBe(30)
  })

  // M17 (01.08.2026) - `introsSeen` darf einen fortgeschrittenen Alt-Save nicht nachträglich
  // mit 13 Popups überfluten; die Heuristik leitet "bereits gesehen" aus genau den Signalen ab,
  // die im Live-Code (`ui/gameStore.svelte.ts`) den jeweiligen Trigger auch auslösen würden.
  it('migriert v5 nach v6: introsSeen wird aus Fortschritt/Flags/Roster/Bestiarium abgeleitet, nicht leer gelassen', () => {
    const v5 = {
      version: 5,
      chapter: 1,
      currentZone: 20,
      maxZoneReached: 20,
      chapterBossDefeated: false,
      party: [{ ...CLAUDE }, { ...BARREL }],
      partyLevel: 15,
      partyExp: 3,
      roster: ['claude', 'barrel', 'tofa', 'airis'],
      currencies: { reunionEssence: '0' },
      bestiary: { blando: { monsterId: 'blando', discovered: true, weaknessRevealed: null, weaknessUsable: false, persistsThroughReunion: true } },
      reunionCount: 1,
      flags: {
        autoAttackUnlocked: true,
        mpVisible: true,
        manualToggleUnlocked: true,
        defenseUnlocked: true,
        materiaUnlocked: false,
        gambitsUnlocked: true,
      },
      inn: { queued: false },
    } as unknown as SerializedSaveState

    const migrated = migrate(v5)

    expect(migrated.version).toBe(SAVE_VERSION)
    expect(migrated.introsSeen).toEqual({
      claude_intro: true,
      atb_attack: true,
      zone_return: true,
      inn: true,
      auto_attack: true,
      special_mp: true,
      defend: true,
      barrel_intro: true,
      tofa_airis_intro: true,
      shock: true,
      target_select: true,
      limit: true,
      reunion: true,
    })
  })

  it('migriert v1 (ganz frischer Save) nach v6: introsSeen bleibt leer - alle 13 Einführungen stehen noch aus', () => {
    const v1 = {
      version: 1,
      chapter: 1,
      currentZone: 1,
      party: [],
      roster: ['claude'],
      currencies: { gil: '0', reunionEssence: '0' },
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
      offline: { lastSeen: 1732300000 },
    } as unknown as SerializedSaveState

    const migrated = migrate(v1)

    expect(migrated.version).toBe(SAVE_VERSION)
    expect(migrated.introsSeen).toEqual({})
  })

  // M18 (02.08.2026) - beide neuen Felder sind rein additiv und starten fuer Alt-Saves leer:
  // die Einmal-Meldung "erschoepft" hat noch niemand gesehen, und vergangene Gate-Niederlagen
  // lassen sich nicht rueckwirkend rekonstruieren.
  it('migriert v6 nach v7: exhaustedZonesNotified/gateBestAttempts starten leer', () => {
    const v6 = {
      version: 6,
      chapter: 1,
      currentZone: 20,
      maxZoneReached: 20,
      chapterBossDefeated: false,
      party: [{ ...CLAUDE }],
      partyLevel: 15,
      partyExp: 3,
      roster: ['claude'],
      currencies: { reunionEssence: '0' },
      bestiary: {},
      reunionCount: 0,
      flags: {
        autoAttackUnlocked: true,
        mpVisible: true,
        manualToggleUnlocked: true,
        defenseUnlocked: true,
        materiaUnlocked: false,
        gambitsUnlocked: false,
      },
      inn: { queued: false },
      introsSeen: { claude_intro: true },
    } as unknown as SerializedSaveState

    const migrated = migrate(v6)

    expect(migrated.version).toBe(SAVE_VERSION)
    expect(migrated.exhaustedZonesNotified).toEqual({})
    expect(migrated.gateBestAttempts).toEqual({})
  })
})

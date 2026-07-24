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
    party: [
      { ...CLAUDE, level: 6, exp: 12 },
      { ...BARREL, level: 6, exp: 0 },
    ],
    roster: ['claude', 'barrel'],
    currencies: {
      gil: new Decimal(3140),
      reunionEssence: new Decimal(0),
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
    expect(restored.roster).toEqual(original.roster)
    expect(restored.bestiary).toEqual(original.bestiary)
    expect(restored.reunionCount).toBe(original.reunionCount)
    expect(restored.flags).toEqual(original.flags)
    expect(restored.inn).toEqual(original.inn)
    expect(restored.currencies.gil.eq(original.currencies.gil)).toBe(true)
    expect(restored.currencies.reunionEssence.eq(original.currencies.reunionEssence)).toBe(true)
  })

  it('serialisiert Gil/Reunion-Essenz als String, nicht als natives JSON-number (Anti-Pattern #10)', () => {
    const parsed = JSON.parse(serializeToJson(sampleSaveState()))
    expect(typeof parsed.currencies.gil).toBe('string')
    expect(typeof parsed.currencies.reunionEssence).toBe('string')
  })

  it('übersteht sehr große Gil-Werte ohne Präzisionsverlust (BigNumber ab Tag 1)', () => {
    const original = sampleSaveState()
    original.currencies.gil = new Decimal('1e500')
    const restored = deserializeFromJson(serializeToJson(original))
    expect(restored.currencies.gil.eq(original.currencies.gil)).toBe(true)
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

  it('migriert v1 (M0-M10, vor der Ventil-Kette) nach v2: offline entfällt, maxZoneReached/inn kommen dazu', () => {
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
  })
})

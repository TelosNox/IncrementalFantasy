// Migrations-Grundgerüst (Architektur §6). v1 -> v2 ist der erste echte Schritt:
// M11 (Ventil-Kette) fügt `maxZoneReached`/`inn` hinzu und legt das alte
// `offline`-Feld still (feinspec §3.8e) - künftige v_n -> v_n+1-Schritte werden
// hier nur noch angehängt.

import { SAVE_VERSION } from './schema'
import type { SerializedSaveState } from './serialize'

/** v1-Save-Shape (vor M11): kein `maxZoneReached`/`inn`, dafür `offline.lastSeen`. */
interface SerializedSaveStateV1 extends Omit<SerializedSaveState, 'version' | 'maxZoneReached' | 'inn'> {
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
function migrateV1toV2(data: SerializedSaveStateV1): SerializedSaveState {
  const { offline: _offline, ...rest } = data
  return {
    ...rest,
    version: 2,
    maxZoneReached: data.currentZone,
    inn: { queued: false },
  }
}

export function migrate(data: SerializedSaveState | SerializedSaveStateV1): SerializedSaveState {
  if ((data as { version: number }).version === SAVE_VERSION) return data as SerializedSaveState
  if ((data as { version: number }).version === 1) {
    return migrateV1toV2(data as SerializedSaveStateV1)
  }
  // Kein weiterer Vorgänger vorhanden - ein unbekannter/höherer Versionsstand ist ein
  // fremder/korrupter Save. Sichtbare Warnung statt stillem Überschreiben (Architektur §6, M10).
  throw new Error(`Keine Migration von Save-Version ${(data as { version: number }).version} zu ${SAVE_VERSION} verfügbar`)
}

// Migrations-Grundgerüst (Architektur §6). v1 ist aktuell die einzige Version;
// künftige v_n -> v_n+1-Schritte werden hier nur noch angehängt.

import { SAVE_VERSION } from './schema'
import type { SerializedSaveState } from './serialize'

export function migrate(data: SerializedSaveState): SerializedSaveState {
  if (data.version === SAVE_VERSION) return data
  // Kein v1-Vorgänger vorhanden - ein unbekannter/höherer Versionsstand ist ein
  // fremder/korrupter Save. Sichtbare Warnung statt stillem Überschreiben ist
  // M10-Scope (Härtung); hier wird bewusst hart gefailt statt geraten.
  throw new Error(`Keine Migration von Save-Version ${data.version} zu ${SAVE_VERSION} verfügbar`)
}

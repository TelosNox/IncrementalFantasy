// Persistenz-Layer (Architektur §6): ein localStorage-Save-Slot, Autosave bei
// Intervall/visibilitychange/pagehide.

import { migrate } from './migrate'
import { deserialize, serializeToJson, type SerializedSaveState } from './serialize'
import type { SaveState } from './schema'

export const SAVE_KEY = 'incrementalfantasy.save.v1'

/**
 * Architektur §6 - Sicherheitsnetz: ein korrupter/fremder Save wird nie
 * stillschweigend verworfen. Die Rohdaten landen unter diesem Zweit-Key,
 * bevor der Hauptslot beim naechsten Autosave mit einem frischen Save
 * ueberschrieben wird (M10-Fix, s. `06_Implementierungsplan_Kapitel1.md`).
 */
const CORRUPT_BACKUP_KEY = 'incrementalfantasy.save.v1.corrupt-backup'

export type LoadOutcome =
  | { kind: 'none' }
  | { kind: 'ok'; state: SaveState }
  | { kind: 'corrupt'; raw: string; message: string }

/** Gemeinsame Parse-Validierung fuer `loadSave()` (localStorage) und Save-Import (Datei, M10). */
export function parseSaveJson(raw: string): LoadOutcome {
  try {
    const parsed = JSON.parse(raw) as SerializedSaveState
    return { kind: 'ok', state: deserialize(migrate(parsed)) }
  } catch (err) {
    return { kind: 'corrupt', raw, message: err instanceof Error ? err.message : String(err) }
  }
}

/** Lädt den Save-Slot. `kind: "corrupt"` sichert die Rohdaten zusätzlich in `CORRUPT_BACKUP_KEY`. */
export function loadSave(): LoadOutcome {
  const raw = localStorage.getItem(SAVE_KEY)
  if (!raw) return { kind: 'none' }
  const result = parseSaveJson(raw)
  if (result.kind === 'corrupt') localStorage.setItem(CORRUPT_BACKUP_KEY, raw)
  return result
}

/** M10 - Rohdaten eines als korrupt erkannten Saves, falls vorhanden (fürs "Backup exportieren"). */
export function readCorruptBackup(): string | null {
  return localStorage.getItem(CORRUPT_BACKUP_KEY)
}

export function writeSave(state: SaveState): void {
  localStorage.setItem(SAVE_KEY, serializeToJson(state))
}

export function clearSave(): void {
  localStorage.removeItem(SAVE_KEY)
}

export interface AutosaveHandle {
  stop: () => void
}

/** Autosave-Trigger (Architektur §6): Intervall, visibilitychange->hidden, pagehide. */
export function startAutosave(getState: () => SaveState, intervalMs = 20000): AutosaveHandle {
  const save = () => writeSave(getState())
  const intervalId = setInterval(save, intervalMs)

  const onVisibilityChange = () => {
    if (document.visibilityState === 'hidden') save()
  }
  document.addEventListener('visibilitychange', onVisibilityChange)
  window.addEventListener('pagehide', save)

  return {
    stop: () => {
      clearInterval(intervalId)
      document.removeEventListener('visibilitychange', onVisibilityChange)
      window.removeEventListener('pagehide', save)
    },
  }
}

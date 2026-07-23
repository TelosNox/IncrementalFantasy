// Persistenz-Layer (Architektur §6): ein localStorage-Save-Slot, Autosave bei
// Intervall/visibilitychange/pagehide.

import { migrate } from './migrate'
import { deserialize, serializeToJson, type SerializedSaveState } from './serialize'
import type { SaveState } from './schema'

export const SAVE_KEY = 'incrementalfantasy.save.v1'

/** Lädt den Save-Slot. `null` bei fehlendem oder korruptem/fremdem Save (kein Crash). */
export function loadSave(): SaveState | null {
  const raw = localStorage.getItem(SAVE_KEY)
  if (!raw) return null
  try {
    const parsed = JSON.parse(raw) as SerializedSaveState
    return deserialize(migrate(parsed))
  } catch {
    return null
  }
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

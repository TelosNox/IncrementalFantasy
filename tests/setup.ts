// vitest laeuft mit `environment: 'node'` (kein DOM) - `save/storage.ts` greift aber
// direkt auf `localStorage` zu (Architektur §6), u.a. beim reinen Instanziieren von
// `GameStore` (`ui/gameStore.svelte.ts` laedt beim Modul-Start einmalig den Save-Slot).
// Minimaler In-Memory-Ersatz, nur die von `storage.ts` genutzten Methoden.
class MemoryStorage implements Storage {
  #data = new Map<string, string>()

  get length(): number {
    return this.#data.size
  }

  clear(): void {
    this.#data.clear()
  }

  getItem(key: string): string | null {
    return this.#data.has(key) ? this.#data.get(key)! : null
  }

  key(index: number): string | null {
    return Array.from(this.#data.keys())[index] ?? null
  }

  removeItem(key: string): void {
    this.#data.delete(key)
  }

  setItem(key: string, value: string): void {
    this.#data.set(key, value)
  }
}

if (typeof globalThis.localStorage === 'undefined') {
  globalThis.localStorage = new MemoryStorage()
}

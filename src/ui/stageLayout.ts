/**
 * Buehnen-Framework der Kampfzone (ui-layout.md, "Buehnen-Framework") - reine Geometrie,
 * ohne Svelte und ohne DOM, damit die Abnahmekriterien aus M13 pruefbar sind statt nur
 * betrachtbar (`tests/stage-layout.test.ts`).
 *
 * Eine Einheit: **Stage-Unit (su)**, 1 su = 1 Sprite-Pixel nativ. Ein Skalierungsfaktor:
 * `s` = CSS-Pixel je su. Alles hier ist in su; die Umrechnung passiert ausschliesslich
 * ueber die CSS-Variable `--s` in `Stage.svelte`.
 *
 * Kein Vortreten mehr (ui-layout.md "Vortreten bei Bereitschaft" - gestrichen 02.08.2026,
 * s. Umsetzungsentscheidung): Figuren bleiben bei ATB-Bereitschaft auf ihrem Slot.
 */

export const STAGE_W = 504
export const STAGE_H = 288
export const S_MIN = 1
export const S_MAX = 4

/** Kulisse nativ 224x128 px, 1 Backdrop-Pixel = 3 su. */
export const BACKDROP_W = 224 * 3
export const BACKDROP_H = 128 * 3

/** Baender (y von der Buehnenoberkante). */
export const SKY_BAND_END = 72
export const GROUND_LINE = 192
/** Standlinien: hinten B2, vorn B1. */
export const STAND_BACK = 228
export const STAND_FRONT = 268

/** Groessenhierarchie in su (charaktere-visuals.md): Standard / Miniboss / Kapitel-Boss. */
export const SPRITE_SU = 64
export const MINIBOSS_SU = 96
export const BOSS_SU = 128

/** Kopf-HUD (Ebene U0): Plattenbreite, Abstand ueber der Sprite-Oberkante, Hoehenbudget. */
export const HUD_W = 60
export const HUD_GAP = 4
export const HUD_MAX_BLOCK = 24

export interface Slot {
  x: number
  /** Standlinie, auf der der Anker (Mitte Unterkante der Sprite-Box) sitzt. */
  y: number
  back: boolean
}

export const PARTY_SLOTS: Slot[] = [
  { x: 176, y: STAND_FRONT, back: false }, // P1
  { x: 216, y: STAND_BACK, back: true }, // P2
  { x: 56, y: STAND_FRONT, back: false }, // P3
  { x: 96, y: STAND_BACK, back: true }, // P4
]

export const ENEMY_SLOTS: Slot[] = [
  { x: 328, y: STAND_FRONT, back: false }, // E1
  { x: 368, y: STAND_BACK, back: true }, // E2
  { x: 408, y: STAND_FRONT, back: false }, // E3
  { x: 448, y: STAND_BACK, back: true }, // E4
]

/** Solo-Gegner stehen mittig in der Gegnerzone auf der hinteren Standlinie. */
export const SOLO_ENEMY_SLOT: Slot = { x: 388, y: STAND_BACK, back: true }

/**
 * Begleiter einer uebergrossen Figur stehen vor ihr. Reihenfolge bewusst vordere Slots
 * zuerst: E2 liegt direkt neben dem Solo-Platz und waere dort verdeckt.
 */
export const ESCORT_SLOTS: Slot[] = [ENEMY_SLOTS[0], ENEMY_SLOTS[2], ENEMY_SLOTS[3], ENEMY_SLOTS[1]]

/** `s` = min(Breite/504, Hoehe/288), fliessend, begrenzt auf 1,0 … 4,0. */
export function stageScale(width: number, height: number): number {
  const fit = Math.min(width / STAGE_W, height / STAGE_H)
  if (!Number.isFinite(fit)) return S_MIN
  return Math.min(S_MAX, Math.max(S_MIN, fit))
}

export interface Placed {
  index: number
  slot: Slot
  size: number
}

/**
 * Feste Slot-Zuordnung, Belegung in Roster-Reihenfolge, kein Nachruecken: Figur i steht
 * immer auf Slot i, auch wenn die Party spaeter waechst (ui-layout.md, "Feste
 * Slot-Zuordnung ... auch nicht bei Party-Zuwachs").
 */
export function partyPlacement(count: number): Placed[] {
  return Array.from({ length: count }, (_, index) => ({
    index,
    slot: PARTY_SLOTS[index] ?? PARTY_SLOTS[PARTY_SLOTS.length - 1],
    size: SPRITE_SU,
  }))
}

/**
 * Gegner-Platzierung. Das Slot-Raster der Spec beschreibt Solo-Gegner und gleich grosse
 * Pulks, aber nicht "uebergrosse Figur MIT Begleitern" (Z18 Fort Knoxious + Caffiend,
 * Z30 Vaultron + 2 Blando). Regel hier (s. Umsetzungsentscheidung zu M13): Wer groesser
 * als Standard ist, bekommt den zentralen hinteren Platz, die Begleiter stehen davor.
 *
 * Wichtig: Der Slot einer Einheit haengt nur von ihrer eigenen Groessenklasse und ihrem
 * Index ab, nie von der Rendergroesse eines Nachbarn - die in M11 behobene Fehlerklasse
 * bleibt damit ausgeschlossen.
 */
export function enemyPlacement(sizes: number[]): Placed[] {
  const hasOversized = sizes.some((size) => size > SPRITE_SU)
  let escort = 0
  return sizes.map((size, index) => {
    const slot = hasOversized
      ? size > SPRITE_SU
        ? SOLO_ENEMY_SLOT
        : (ESCORT_SLOTS[escort++] ?? ESCORT_SLOTS[ESCORT_SLOTS.length - 1])
      : (ENEMY_SLOTS[index] ?? ENEMY_SLOTS[ENEMY_SLOTS.length - 1])
    return { index, slot, size }
  })
}

/** Anker-x der Figur (Mitte der Sprite-Box). */
export function anchorX(slot: Slot): number {
  return slot.x
}

/** Abstand der Sprite-Unterkante vom Buehnenboden. */
export function anchorBottom(slot: Slot): number {
  return STAGE_H - slot.y
}

/** Unterkante des Kopf-HUD: HUD_GAP ueber der Sprite-Oberkante. */
export function hudBottom(slot: Slot, size: number): number {
  return anchorBottom(slot) + size + HUD_GAP
}

/** Oberkante der Sprite-Box, y von der Buehnenoberkante. */
export function spriteTop(slot: Slot, size: number): number {
  return STAGE_H - anchorBottom(slot) - size
}

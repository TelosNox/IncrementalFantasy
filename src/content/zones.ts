// feinspec-kapitel1.md §6.3 - Zonen-Encounter Z1-Z30. 1:1-Abschrift, inkl. der
// Wellen-Zusammensetzung und Size-Modifikatoren aus der validierten
// Referenzsimulation (sim_chapter1.py, zone_encounters()) - die feinspec-Tabelle
// selbst nennt nur Monster-Zusammensetzung/Lehrziel je Zone, keine Size-Werte.
//
// isGate markiert die drei Wand-Zonen (Blandzilla Z8, Fort Knoxious Z18,
// Vaultron Z30), die im Kampf die generische Limit-Zünden-Regel auslösen
// (sim_chapter1.py: use_limit_on_gate) - deckungsgleich mit content/monsters.ts
// GATE_MONSTER_IDS.

import type { EncounterMonsterRef, Zone } from '../core/entities'

function wave(...monsters: Array<[string, number]>): EncounterMonsterRef[] {
  return monsters.map(([monster, size]) => ({ monster, size }))
}

function regionOf(zone: number): 1 | 2 | 3 {
  if (zone <= 8) return 1
  if (zone <= 18) return 2
  return 3
}

function zone(index: number, encounter: EncounterMonsterRef[], isGate = false): Zone {
  return { zone: index, region: regionOf(index), waves: [encounter], isGate }
}

export const ZONES: Zone[] = [
  zone(1, wave(['blando', 1.0])),
  zone(2, wave(['blando', 1.0])),
  zone(3, wave(['blando', 1.0], ['blando', 1.15])),
  zone(4, wave(['blando', 1.0], ['blando', 1.15])),
  zone(5, wave(['blando', 1.0], ['blando', 1.0])),
  zone(6, wave(['blando', 1.15], ['blando', 1.0], ['blando', 0.9])),
  zone(7, wave(['blando', 1.15], ['blando', 1.0], ['blando', 1.0])),
  zone(8, wave(['blandzilla', 1.0]), true),
  zone(9, wave(['blando', 1.0], ['caffiend', 1.0])),
  zone(10, wave(['blando', 1.0], ['caffiend', 1.0])),
  zone(11, wave(['safeguard', 1.0])),
  zone(12, wave(['kindlebale', 1.0], ['blando', 1.0])),
  zone(13, wave(['kindlebale', 1.0], ['blando', 1.0])),
  zone(14, wave(['caffiend', 1.0], ['caffiend', 1.0], ['blando', 1.0])),
  zone(15, wave(['caffiend', 1.0], ['caffiend', 1.0], ['blando', 1.0])),
  zone(16, wave(['safeguard', 1.0], ['caffiend', 1.0])),
  zone(17, wave(['safeguard', 1.0], ['caffiend', 1.0])),
  zone(18, wave(['fort_knoxious', 1.0], ['caffiend', 1.0]), true),
  zone(19, wave(['funkus', 1.0], ['blando', 1.0])),
  zone(20, wave(['funkus', 1.0], ['blando', 1.0])),
  zone(21, wave(['shortfuse', 1.0], ['blando', 1.0], ['blando', 1.0])),
  zone(22, wave(['shortfuse', 1.0], ['blando', 1.0], ['blando', 1.0])),
  zone(23, wave(['pilferret', 1.0], ['caffiend', 1.0])),
  zone(24, wave(['pilferret', 1.0], ['caffiend', 1.0])),
  zone(25, wave(['safeguard', 1.0], ['funkus', 1.0])),
  zone(26, wave(['safeguard', 1.0], ['funkus', 1.0])),
  zone(27, wave(['shortfuse', 1.0], ['shortfuse', 1.0])),
  zone(28, wave(['funkus', 1.0], ['caffiend', 1.0], ['blando', 1.0])),
  zone(29, wave(['shortfuse', 1.0], ['shortfuse', 1.0], ['blando', 1.0])),
  zone(30, wave(['vaultron', 1.0], ['blando', 1.0], ['blando', 1.0]), true),
]

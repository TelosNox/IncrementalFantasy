// feinspec-kapitel1.md §6.3 - Zonen-Encounter Z1-Z30. Monster-Zusammensetzung ist
// 1:1-Abschrift der Feinspec-Tabelle (die selbst nur Zusammensetzung/Lehrziel nennt,
// keine Size-Werte). Die Size-Modifikatoren (§3.7, wirken nur auf HP) stammten
// urspruenglich aus `sim_chapter1.py`; seit M11 gilt dessen Baseline nicht mehr
// (feinspec §9 "sim_chapter1.py verliert seinen Status als Balance-Referenz") - die
// unten markierten Zonen wurden gegen die TS-Engine neu justiert (`tests/chapter-
// playthrough.test.ts`, feinspec §12 C4 "der Zone-6-Fehler").
//
// isGate markiert die drei Wand-Zonen (Blandzilla Z8, Fort Knoxious Z18,
// Vaultron Z30), die im Kampf die generische Limit-Zünden-Regel auslösen
// (deckungsgleich mit content/monsters.ts GATE_MONSTER_IDS) und `limitAllowed`
// setzen (feinspec §3.4 Esper-Modell).

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
  // feinspec §4.3 - limitAllowed ist ein eigenes Datenfeld, deckt sich in Kapitel 1 aber
  // durchgehend mit isGate (alle drei Gates, sonst nirgends) - s. §3.4/§6.2.
  return { zone: index, region: regionOf(index), waves: [encounter], isGate, limitAllowed: isGate }
}

export const ZONES: Zone[] = [
  zone(1, wave(['blando', 1.0])),
  zone(2, wave(['blando', 1.0])),
  zone(3, wave(['blando', 1.0], ['blando', 1.15])),
  zone(4, wave(['blando', 1.0], ['blando', 1.15])),
  zone(5, wave(['blando', 1.0], ['blando', 1.0])),
  // M11-Rebalance: Groessen (wirken nur auf HP, s. §3.7) gegenueber der veralteten
  // sim_chapter1.py-Referenz gesenkt - Zone 6/7 war ohne MP-Refund/Offline-Ventil zur
  // haertesten Stelle der ganzen Region geworden (feinspec §12 C4 "der Zone-6-Fehler"),
  // haerter noch als das folgende Gate. sim_chapter1.py ist keine Balance-Referenz mehr.
  zone(6, wave(['blando', 0.75], ['blando', 0.6], ['blando', 0.5])),
  zone(7, wave(['blando', 0.8], ['blando', 0.65], ['blando', 0.6])),
  // M11-Rebalance: Blandzilla-Groesse deutlich angehoben - Auto (kein Limit/Special) durfte
  // den Miniboss zuvor fast im Vorbeigehen erledigen, obwohl Gates fuer reinen Auto-Betrieb
  // bewusst NICHT idle-trivial sein sollen (feinspec §4.7). Ein einzelner (wenn auch dicker)
  // Gegner ist strukturell weniger gefaehrlich als 3 gleichzeitige Angreifer (Zone 6/7) - mehr
  // HP verlaengert den Kampf und damit die Gesamt-Exposition gegen Blandzillas eigenen Schaden.
  //
  // Playtest-Nachtrag (M11): 1,6 reichte nicht - ein voll geheilter, angemessen
  // leveled Claude (Solo, s. BARREL_JOIN_ZONE) gewann auch OHNE je Limit zu zuenden
  // (nur Attack/Cross Slash), das Gate lehrte "Limit als Wand-Brecher" (feinspec §7.1)
  // dadurch nicht mehr zuverlaessig. Auf 1,8 angehoben: simulationsvalidiertes Fenster
  // 1,7-1,9 HP, in dem "kein Limit" verliert, aber "Limit sobald voll" (die M-Referenz,
  // `resolveOptimalAction`) weiterhin gewinnt - ab 2,0 kippt auch die Limit-Linie.
  zone(8, wave(['blandzilla', 1.8]), true),
  zone(9, wave(['blando', 1.0], ['caffiend', 1.0])),
  zone(10, wave(['blando', 1.0], ['caffiend', 1.0])),
  zone(11, wave(['safeguard', 1.0])),
  // M16 (01.08.2026) - Heiler-Gegner (Bandbox) nach Region 2 vorgezogen (gegner-encounter.md
  // §5a): ersetzt den bisherigen Blando-Fuellgegner. Reihenfolge im Array ist Absicht - Kindlebale
  // zuerst, Bandbox zweitens, damit die Standardregel ("kein Fokus -> naechststehend", §3.9) OHNE
  // Zielwahl NICHT automatisch den Heiler zuerst trifft. Nur wer bewusst auf Bandbox fokussiert
  // (Klick/Popup), bricht die Heilung sofort; ignoriert, zieht sich der Kampf spuerbar in die Laenge.
  zone(12, wave(['kindlebale', 1.0], ['bandbox', 1.0])),
  zone(13, wave(['kindlebale', 1.0], ['bandbox', 1.0])),
  zone(14, wave(['caffiend', 1.0], ['caffiend', 1.0], ['blando', 1.0])),
  zone(15, wave(['caffiend', 1.0], ['caffiend', 1.0], ['blando', 1.0])),
  // M11-Rebalance: Safeguard-Groesse leicht gesenkt (Panzer+Flitzer war fuer manuelles
  // Spiel haerter als das folgende Gate, s. Begründung bei Zone 6).
  zone(16, wave(['safeguard', 0.65], ['caffiend', 1.0])),
  zone(17, wave(['safeguard', 0.75], ['caffiend', 1.0])),
  // M11-Rebalance: Fort-Knoxious-Groesse leicht angehoben, s. Begründung bei Zone 8.
  zone(18, wave(['fort_knoxious', 1.15], ['caffiend', 1.0]), true),
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
  // M11-Rebalance: Vaultron/Begleiter-Groesse leicht gesenkt - reines Auto (kein Defend,
  // kein Limit) durchlebt sonst zu viele telegrafierte AoE-Zyklen, bevor der Kampf faellt;
  // kuerzere Kaempfe senken die Zahl ueberstandener AoE-Wellen, ohne den ATK/DEF-Biss der
  // eigentlichen Kapitel-Wand zu senken (Groesse wirkt nur auf HP, §3.7).
  zone(30, wave(['vaultron', 0.8], ['blando', 0.85], ['blando', 0.85]), true),
]

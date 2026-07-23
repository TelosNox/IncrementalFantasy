# Materia-System

**Status:** In Arbeit – Mechanik & Philosophie festgelegt; konkrete Zahlen/Balance folgen im **Playtest**.
**Rahmen:** `../03_Konzept_Gerüst.md`, §6 (verbindliche Richtung).
**Prüfinstanz:** `../02_Leitfaden_Kernmechaniken.md`.

## Schnittstellen zu anderen Systemen

- **AP** (`oekonomie-waehrungen.md`): speist das Leveln; AP fließt auf *alle* angelegten Materia, volle stoppen.
- **Materia-Prestige-Währung** (`prestige-reunion.md`): Cap-Reset erzeugt sie; Evolution verbraucht sie (gegated durch min. 1× Cap-Reset).
- **Slots** (`ausruestung-gil.md`): kommen aus Ausrüstung; Einzel- und verbundene Slot-Paare.
- **Kampf/Shock** (`kampf-analyse-shock.md`): Element-Materia nutzt analysierte Schwächen, baut Shock; MP-Regen-Materia ist die Materia-Ausprägung des dort verankerten Regen-Hebels.
- **Gambits** (`gambits.md`): Bedingungen/Aktionen referenzieren angelegte Materia; weakness-Bedingungen erst nach Analyse.
- **Reunion** (`prestige-reunion.md`): resettet Level + Slots, **erhält** Typen + Evolutionen.
- **Progression** (`progression-regionen.md`): Materia-System öffnet sich in **Kapitel 2**.

---

## 1. Leitprinzip: Knappheit ist der Entscheidungsmotor

Materia lebt davon, dass man **nicht alles gleichzeitig** haben kann. Ohne Knappheit an Slots/Kopien verschwinden die Entscheidungen – und damit die Tiefe. Jede Design-Frage prüfen wir daran: *Bleibt die Entscheidung erhalten?*

## 2. Materia-Philosophie (verbindliche Taxonomie)

Der Härtetest für jede Materia: **Ändert sie, *wie* oder *wie oft* man spielt?** Flache Multiplikatoren auf einem knappen Kampf-Slot enden sonst entweder **ignoriert** (zu schwach) oder **mandatory** (Dauer-Slot-Verstopfer) – beides tötet die Slot-Entscheidung.

Daraus die Trennlinie, **wo welche Verbesserung lebt**:

| Art der Verbesserung | Gehört auf … | Grund |
|----------------------|--------------|-------|
| **Aktionen & Kombos** (Zauber, Support-Links, Shock, Konter) | **Materia** | verändert Gameplay |
| **Kampf-Rhythmus & Sustain** (MP-Regen, ggf. HP-Regen, HP-Absorb) | **Materia** (selbstsättigend) | verändert Aktions-Frequenz |
| **Rohe Max-Stats** (HP/MP/ATK-Ceiling) | **Charakter-Level + Ausrüstung** | kein Verhaltenswechsel, redundant |
| **Progressions-Ökonomie** (Gil-/EXP-/AP-Rate) | **Meta-Ebene** (Reunion-Essenz / Milestones) | konkurriert sonst um knappe Slots, wird mandatory |

„Selbstsättigend" heißt: z. B. MP-Regen bringt ab dem Punkt, wo man frei casten kann, nichts mehr – man gibt den Slot dann für Kampf-Materia frei. So wird kein Regen/Sustain je zum permanenten Pflicht-Slot.

**Hinweis:** Auch **magische/elementare Resistenz** läuft über Materia – konkret über die **Elementar+Element-Kombo**, die am Einzel-Item Angriff *und* Resistenz zugleich gibt (Opportunitätskosten: ein verbundenes Paar), **nicht** über einen Kern-Stat – siehe `stats-kampfwerte.md`.

---

## 3. Slots & Kopplung

- **Feste, knappe Slot-Anzahl**, wächst langsam.
- **Einzel-Slots** (Materia wirkt für sich) und seltenere **verbundene Slot-Paare** (Support-Materia modifiziert die Nachbarin) – die **Synergie-Engine** (§2 im Leitfaden), „nichts wird obsolet".
- Slots kommen aus Ausrüstung; werden bei Reunion zurückgesetzt (Gil-Kreislauf).

## 4. Leveln, Cap & Ränge

- **AP fließt auf alle angelegten Materia** gleichzeitig; volle Materia bekommt kein AP mehr (bleibt für ihren *Effekt* angelegt).
- **Frei leveln bis zu einem gegateten Cap** (Cap-Deckel steigt über Progression).
- **Ränge schalten neue Teil-Fähigkeiten frei** (Feuer → Feura → Feuga) – Mini-Feature-Kaskade, nicht nur größere Zahlen.

## 5. Cap-Reset & Evolution

- **Cap-Reset (Mikro-Prestige):** am Cap gegen **Materia-Prestige-Währung** auf 0 zurücksetzen (Ernte, kein Verlust).
- **Evolution (+1, +2, …):** über gemeinsame Materia-Prestige-Punkte, **gegated**: jede Stufe erfordert min. 1× Cap-Reset der aktuellen Stufe. Zustand als **Binär-Marker** (Farbrand/Decorator, kein Zähler). **Skalierende Kosten** (+1 < +2 < …) gegen billiges Durch-Evolven.

## 6. Reunion-Persistenz

- **Erhalten:** Materia-**Typen und Evolutionen**.
- **Zurückgesetzt:** Materia-**Level und Slots** (letztere via Ausrüstung).

---

## 7. Starter-Set (ab Kapitel 2, dosiert)

Bewusst kleines Set; die Reihenfolge ist eine **Feature-Kaskade** (jede Materia bringt einen neuen Gedanken). Erwerb ist **deterministisch & mehrquellig** (s. §8).

| Materia | Kategorie | Erwerb (wann / wie) | Gameplay-Wirkung |
|---------|-----------|---------------------|------------------|
| **Feuer** | Magie | Beat 1 – garantiert bei Materia-System-Einführung (Story/Region) | erstes Element → Schwäche/Shock; lehrt Slot, AP, MP, Ränge |
| **Eis / Blitz** | Magie | Beat 2 – Shop (Gil) | Element-Vielfalt → passendes Element je Gegner (Set-Entscheidung) |
| **Alle** | Support | Beat 3 – Regions-Boss (garantiert) | Einzelziel → Rundum; erster Kombo-„Aha", Idle-Durchsatz |
| **MP-Regen** | Independent | Beat 4 – Milestone (z. B. erste Materia auf Cap) | mehr MP/Kampf → mehr Aktionen, dichteres Spiel; **selbstsättigend** |
| **Heilung** | Magie | Beat 5 – Nebenquest/Challenge (oder Shop) | Heil-Aktion für alle Figuren → defensive Gambit-Sets, MP-Tradeoff |
| **Stehlen** | — | **gestrichen** | Gil fließt ohnehin automatisch; kein sinnvoller Nutzen |
| **HP-Absorb** | Support | Nebenquest / spätere Region | Schaden heilt anteilig; Sustain-Tradeoff statt flachem Stat |
| **MP-Turbo** | Support | Shop / spätere Region | mehr MP-Kosten, mehr Wirkung; Risiko/Ertrag |
| **Konter** | Kommando (passiv-aktiv) | Milestone/Boss | Auto-Gegenangriff bei Treffer; nutzt getaktete Gegner-Aktionen |
| **Elementar** | Support | Beat 6 – Reunion-Essenz / spätere Region | Element an Auto-Angriff koppeln → **passiver Idle-Shock** |
| **Erste Beschwörung** | Summon | optionaler harter Content, später | periodischer Big-Payoff; bleibt **sekundär** |

**Zurückgestellt – ATB-Boost:** „mehr Speed" kippt schnell ins Mandatory-Muster. Nur denkbar als *aktives Kommando mit Kosten* (Tradeoff), nicht als Dauer-Passiv; Speed-Grundwachstum gehört sonst zu Level/Ausrüstung.

**Ausdrücklich nicht als Materia** (siehe §2): flache HP+/MP+-Ceilings (→ Level/Ausrüstung) und Gil+/EXP+/AP-Rate (→ Reunion-Essenz / Milestones).

---

## 8. Erwerbswege (deterministisch & mehrquellig)

Verteilt auf die drei Freischaltungs-Achsen plus Shop – bewusst **ohne RNG-Farmdrops** (Zufalls-Gating frustriert, ist intransparent, gegen Lesbarkeit/#1). Höchstens garantierte Erst-Clear-Drops.

- **Shop (Gil), kapitelweise freigeschaltet** – verlässliche Basisquelle; zweiter großer Gil-Sink.
- **Regionen/Bosse (garantierte Erst-Freischaltung)** – story-gebundene Signatur-Materia (horizontale Achse).
- **Reunion-Essenz** – fortgeschrittene/Meta-Materia-Typen, dauerhaft (vertikale Achse).
- **Milestones / Achievements / Challenges / Nebenquests** – einzigartige Belohnungs-Materia (Entdeckungs-Achse).

**Dosierung:** Erwerb bleibt bewusst langsam – flutet man den Spieler mit Materia, stirbt die Slot-Entscheidung (Knappheit-Prinzip).

---

## Offene Detailfragen (Balance – gehört in den Playtest)

- AP-Kurve; Cap-Stufen und wie stark der Cap-Deckel je Progression steigt.
- AP: volle Menge pro Materia vs. geteilter Pool.
- Slot-Wachstumskurve (Entscheidungsdichte).
- Evolutionskosten (Skalierung) und Balance der einzelnen Set-Materia.
- Sättigungspunkt von MP-Regen (ab wann „frei casten").
- Konkrete Zuordnung der Beats zu realen Regionen/Kapitel-2-Struktur.

> Weiteres Theoretisieren bringt hier wenig – die Feinbalance dieser Kurven und Werte entscheidet sich am **Playtest**.

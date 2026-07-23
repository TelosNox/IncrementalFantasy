# Niederlage, Heilung & Offline-Modell

**Status:** Richtung aus den bisherigen Entscheidungen abgeleitet; Zahlen → **Playtest**.
**Rahmen:** `../03_Konzept_Gerüst.md`, §12 & §13 (verbindliche Richtung).
**Prüfinstanz:** `../02_Leitfaden_Kernmechaniken.md`.

## Schnittstellen zu anderen Systemen

- **Kampf** (`kampf-analyse-shock.md`): telegrafierte Gegner-Aktionen geben die Chance, Niederlage zu verhindern.
- **Materia/Gambits** (`materia.md`, `gambits.md`): Heilung & defensive Sets machen Niederlage vermeidbar.
- **Gegner** (`gegner-encounter.md`): Nuker/Bosse sind die eigentlichen Niederlage-Quellen.
- **Ökonomie** (`oekonomie-waehrungen.md`): Offline-Ertrag reduziert & gedeckelt.
- **Progression** (`progression-regionen.md`): Offline stockt an ungeschlagenen Gates / manuellen Prüfsteinen.

---

## 1. Niederlage-Modell

- **Kein Game-Over / Permadeath.** Niederlage = der Encounter ist verloren.
- **Folge:** eine **milde Zeitstrafe**, dann **Auto-Retry derselben Zone** mit zurückgesetztem Kampf (Gegner voll, Party frisch). **Kein Währungs-/Zonen-Verlust** (Ventil-Prinzip #1).
- **Zweck:** macht HP/DEF, Heilung und defensive Gambit-Sets sinnvoll – sonst dominiert reines Angriffs-Spiel (gegen #5).
- **Deterministisch:** ohne RNG-Miss/Dodge ist eine Niederlage ein **lesbares Signal** „Build/Stats reichen (noch) nicht", kein Pech.
- **Wand-Feedback:** wiederholte Niederlagen = akkumulierte Zeit-Kosten → natürlicher Hinweis „verbessern / grinden / Reunion". Der Grind bleibt im Ventil (davor fließt weiter Fortschritt).
- **Counterplay:** telegrafierte Gegner-Groß-Attacken erlauben, die Niederlage aktiv oder per defensivem Gambit-Set abzuwenden (Verteidigen/Heilen/Unterdrücken).

## 2. Heilung

- Läuft über **Heil-/Defensiv-Materia + Arris' Spezial + defensive Gambit-Sets** – kein separates System.
- **MP-Kosten** koppeln Heilung an die MP-Ökonomie (Ressourcen-Tradeoff), macht defensives Spiel zur Entscheidung.

## 3. Offline-Modell

- Die Party **kämpft die aktuelle Zone weiter** (aktuelle Gambit-/Auto-Policy); **kein Überspringen** ungeschlagener Gates.
- **Ertrag:** EXP/Gil (AP ab Kapitel 2) mit **Rate etwas unter Aktiv**, **gedeckelt** („Welcome-back"-Ernte).
- **Aktiv bringt Optimierung** (Limit-Timing, Live-Analyse, manuelle Clutch/Prüfsteine), **keine rohen Multiplikatoren** → Aktiv lohnt sich, Idle bleibt gültig (§3). **Offline ist nie strikt besser als Aktiv.**
- **Natürliche Offline-Decke:** an einer (noch) unschaffbaren Wand stockt Offline in einer Retry-Schleife mit Zeitstrafe ohne Fortschritt.
- **Manuelle Prüfsteine** (selten, später): Offline stockt dort bewusst.
- Durch die Determinismus-Entscheidung ist die Offline-Simulation **fair und vorhersehbar**.

---

## Offene Detailfragen (Playtest)

- Höhe/Dauer der Zeitstrafe; HP/MP-Wiederherstellung beim Retry (voll vs. teilweise).
- Offline-Rate (% von Aktiv) und Deckel-Dauer.
- Ab welcher Progression Offline-Ertrag sinnvoll skaliert.

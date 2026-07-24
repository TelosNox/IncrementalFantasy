# Gegner- & Encounter-Design

**Status:** Struktur festgelegt; Kurven/Zahlen → **Playtest**.
**Rahmen:** `../03_Konzept_Gerüst.md` – unterlegt Progression (§3) und Kampf (§4).
**Prüfinstanz:** `../02_Leitfaden_Kernmechaniken.md`.

## Schnittstellen zu anderen Systemen

- **Stats** (`stats-kampfwerte.md`): Gegner nutzen das Kern-Set; Analyse enthüllt ATK/DEF/HP.
- **Kampf** (`kampf-analyse-shock.md`): getaktete/telegrafierte Aktionen; Schwächen → Shock.
- **Progression** (`progression-regionen.md`): Zonen/Regionen/Boss-Gates; Archetypen-Rollout.
- **Charaktere** (`charaktere-party.md`): Archetypen geben den Rollen (Barrel-Suppress, Air-is...-Heal) ihren Daseinsgrund.
- **Materia** (`materia.md`): Erst-Clear → garantierte Freischaltungen; AoE („Alle") auf Wellen.

---

## 1. Zonen- & Encounter-Struktur

- **Region = lineare Folge von Zonen** (vorerst strikt linear).
- **Zone = eine Welle**; die **letzte Zone einer Region = Boss** (Gate).
- Wellen belohnen **AoE** (Idle-Durchsatz), Bosse belohnen **Einzelziel-Fokus + Limit**.

## 2. Gegneranzahl

- **An der Gruppengröße orientiert: in der Regel bis zu 4 Gegner** je Welle. Das hält AoE („Alle" trifft bis 4) relevant und die Welle lesbar.
- **Kein hartes Verbot von >4** in Ausnahmefällen – aber die Norm ist ~4.

## 3. Zusammensetzung & Schwierigkeits-Kurve *(zentrale Leitregel)*

- Gegner variieren in **Stärke UND Anzahl**; die Zusammensetzung wechselt (mal 4 Schwache, mal 2 Starke).
- **Die aggregierte Gesamtstärke einer Zone darf nicht ausreißen, sondern soll von Zone zu Zone tendenziell steigen** – eine **glatte, monotone Aufwärts-Tendenz**, keine zufälligen Spitzen.
- **Ausnahme: Bosse** sind bewusste, telegrafierte Spikes am Regionsende (die Wand).
- **Kurvenform offen:** linear vs. leicht gekrümmt (z. B. sanft exponentiell) → Playtest. Zunächst zählt **Monotonie & Glätte**, nicht die exakte Form.

## 4. Gegner-Stat-Modell

- Kern-Set (**HP/ATK/DEF/SPD**, MAG bei magischen Gegnern) + **0–1 Element-Schwäche-Tag** (früh bewusst simpel).
- **Shock-Affinität:** Neutral (Standard) · Schockaffin (temporär, meist via Schwäche) · Schockresistent (spät). Details `kampf-analyse-shock.md` §6.
- **Analyse enthüllt ATK/DEF/HP** (+ Schwäche); **Bestiarium** füllt sich beim Erst-Kill.
- Skalierung deterministisch pro Zone/Region.

## 5. Archetypen (jeder lehrt eine Mechanik)

- **Standard** — Grundgegner, trägt den Kern-Loop.
- **Panzer** (hohe DEF/HP) — stumpfes Draufhauen ist zäh → motiviert Schwäche/Shock.
- **Flitzer** (hoher SPD) — handelt oft → macht **Barrels Unterdrückung** wertvoll.
- **Nuker** (telegrafierter Groß-Treffer) — macht **Air is...' Heilung / Verteidigen / defensive Gambits** nötig.
- **Schwäche-Gegner** — klar sichtbare Element-Schwäche → belohnt Element-Wahl + Shock.
- **(später) Heiler-Gegner** — heilt Verbündete → lehrt Ziel-Priorität („erst den Heiler"), eine Gambit-/Targeting-Entscheidung.

Konkrete Beispiel-Monster (10, mit Merkmal + Visual-Richtung) und vier ergänzende Mechaniken (Split, MP-Drain+Flucht, Untot, Physisch-Immun): siehe `gegner-katalog.md`.

## 6. Gegner-Aktionen (getaktet & telegrafiert)

Gegner handeln über ihr eigenes vereinfachtes ATB. Grundgegner hauen normal drauf; **Nuker/Bosse haben eine telegrafierte Groß-Attacke** (Vorwarnung). Der Telegraf ist der Grund, warum Verteidigen/Heilen/Unterdrücken überhaupt Sinn haben – man oder ein defensives Gambit-Set kann reagieren.

### 6a. Zielwahl der Gegner (neu spezifiziert nach dem ersten Playtest)

**Regel: Ein Gegner greift immer die Figur mit den *höchsten aktuellen HP* an.** Eine Regel für alle Grundgegner, keine Ausnahmen außer den unten genannten Trait-Sonderfällen.

Das war zuvor **nirgends spezifiziert** – die Implementierung griff die Figur mit den *niedrigsten* HP an. Das ist die für den Spieler härteste denkbare Regel: Gegner fokussieren den Verwundetsten und finishen ihn, dann den nächsten. Mit dem neuen HP-Übertrag zwischen Kämpfen (`niederlage-offline.md` §2) wäre daraus eine Spirale mit Zinseszins geworden – wer angeschlagen in den nächsten Kampf geht, wird sofort wieder fokussiert.

Warum „höchste HP" die bessere Regel ist:
- **Schaden verteilt sich von selbst** – kein Fokus-Feuer, keine Todesspirale, verträglich mit dem HP-Übertrag.
- Es entsteht **Tanken ohne Aggro-System**: Wer am gesündesten dasteht, fängt die Schläge. Robuste Figuren bekommen dadurch erstmals eine passive Rolle.
- Sie ist in einem Satz erklärbar und damit vom Spieler **ableitbar** – der entscheidende Punkt (s. „Nachvollziehbarkeit" unten).
- Sie bleibt vollständig deterministisch.

**Trait-Sonderfälle** (bleiben erhalten, weil sie thematisch lesbar sind):
- `drain` zieht MP von der Figur mit den **meisten MP**.
- `boss`/`bomb`-Groß-Attacken treffen die **ganze Gruppe**; Zielwahl entfällt.

**Nachvollziehbarkeit ist Teil der Anforderung, nicht Kosmetik.** Determinismus allein genügt nicht: Eine feste Regel, die der Spieler nicht ableiten kann, ist von Zufall nicht unterscheidbar (`../02_Leitfaden_Kernmechaniken.md` §5, Playtest-Nachträge). Deshalb gehört zur Regel die **Markierung des nächsten Ziels** in der Anzeige. Erst dadurch bekommt **Defend** überhaupt eine Informationsgrundlage – bislang halbierte es Schaden, ohne dass der Spieler wissen konnte, wen es trifft, war also eine Rate-Aktion.

**Zielverhalten ist eine autorierbare Gegner-Eigenschaft.** Für Kapitel 1 gilt durchgehend die Standardregel; spätere Kapitel können abweichende Zielregeln als Gegner-Merkmal vergeben (z. B. „geht immer auf die Heilerin"), sofern sie ebenso in einem Satz erklärbar bleiben.

## 7. Miniboss, Regions-Boss & Kapitel-Wand

- **Region-1-Miniboss:** einfacher, mit einer Groß-Attacke → **lehrt das Limit als Wand-Brecher**.
- **Regions-Boss = Kapitel-Wand:** kombiniert 2–3 Archetyp-Züge + telegrafierte Mechanik. Bewusst eine **grindbare Idle-Wand** (manuell schneller, per Reunion-Grind auch schaffbar) – *kein* Pflicht-Prüfstein im ersten Zyklus.

## 8. Belohnungen (deterministisch, kein RNG)

Kills geben automatisch EXP/Gil (AP ab Kapitel 2). **Erst-Clear bestimmter Gegner/Bosse** → garantierte Materia-/Skill-Freischaltung. Keine Zufalls-Farmdrops.

## Rollout über den ersten Zyklus

- **Region 1:** Standard + Miniboss (Limit). Noch keine Analyse/Schwächen.
- **Region 2:** Analyse an; **Panzer + Flitzer** treten auf (zeigen, warum man Schwächen/Kontrolle bald will).
- **Region 3:** Shock an; **Schwäche-Gegner + Nuker** (Heilung/Defense wird nötig) → Kapitel-Wand.

---

## Offene Detailfragen (Playtest)

- Kurvenform der Gesamtstärke (linear vs. gekrümmt) und Steigung.
- Wellengrößen-Verteilung; wie oft (und wo) >4 Gegner sinnvoll sind.
- Schwächen-Verteilung je Region; Element-Palette früh.
- Boss-Spike-Höhe relativ zur Trend-Linie.
- Gegner-Stat-Skalierung je Zone.

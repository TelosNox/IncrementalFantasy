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
- **Heiler-Gegner** — heilt Verbündete → lehrt Ziel-Priorität („erst den Heiler"), eine Gambit-/Targeting-Entscheidung. **Vorgezogen von „später" nach Region 2** (30.07.2026, s. §5a).

Konkrete Beispiel-Monster (10, mit Merkmal + Visual-Richtung) und vier ergänzende Mechaniken (Split, MP-Drain+Flucht, Untot, Physisch-Immun): siehe `gegner-katalog.md`.

## 5a. Zielwahl muss etwas entscheiden (neu, 30.07.2026)

**Befund aus dem Playtest:** Zielwahl war spürbar wirkungslos („könnte gerne wichtiger sein"), und in derselben Session fiel auf, dass **Analyse in Kapitel 1 nichts nützt** – sie enthüllt ATK/DEF/HP und Schwächen, aber Schwächen sind ohne Element-Wahl nicht nutzbar (Materia ab Kapitel 2) und die Zahlen nur, wenn Zielwahl etwas entscheidet.

**Diagnose:** Analyse ist nicht prinzipiell wertlos – sie ist wertlos, **weil Zielwahl wertlos ist**. Dieselbe Wurzel wie der frühere Spielertyp-Korridor (`feinspec-kapitel1.md` §12): Wenn Wände durch Stats fallen und Stats aus skillfreiem Farmen kommen, konvergieren alle Spielweisen auf „farmen, bis es umfällt". Können zahlt dann nicht, und Werkzeuge des Könnens (Zielwahl, Analyse, Defend) sind Dekoration.

**Beschluss:** Der **Heiler-Gegner wird nach Region 2 vorgezogen** – dorthin, wo laut Rollout auch die Analyse aufgeht. Damit hat Analyse ab ihrem ersten Auftritt einen Nutzen („welcher muss zuerst"), und Zielwahl entscheidet Kämpfe statt sie zu beschleunigen. Weitere Kandidaten in derselben Rolle: Buffer, der die Front verstärkt.

**Umgesetzt in M16 (01.08.2026): Bandbox** (`content/monsters.ts`, Trait `heal`), Zone 12/13 – direkt nach dem Panzer (Safeguard, Zone 11), gepaart mit Kindlebale statt eines reinen Blando-Füllgegners. Heilt das verletzteste lebende Gruppenmitglied um `2,5×ATK`; ist niemand verletzt, greift er wie ein normales Monster an (`tick.ts` `resolveEnemyAction`). Die Standardregel „kein Fokus → nächststehend" (§3.9) trifft in dieser Welle **nicht** automatisch den Heiler (er steht im Array an zweiter Stelle) – nur wer bewusst auf ihn fokussiert, bricht die Heilung sofort; ignoriert, zieht sich der Kampf spürbar in die Länge. Kein FF7-Vorbild (`gegner-katalog.md`).

**Korrektur aus dem Konzept-Review (01.08.2026): Der Heiler macht Zielwahl wertvoll, aber noch nicht Analyse.** Die Begründung oben („Analyse ist wertlos, *weil* Zielwahl wertlos ist") gilt **nicht in der Umkehrung**: Dass ein Gegner heilt, liest der Spieler an der wieder steigenden HP-Leiste ab – dafür braucht er keine Analyse. ATK/DEF/HP ändern die Antwort „erst den Heiler" nicht, und Schwächen sind in Kapitel 1 ohne Element-Wahl weiter nutzlos. **Anforderung:** Analyse muss am Heiler eine Information liefern, die die Kampfanzeige *nicht* hergibt – **Heilmenge und Takt**, damit der Spieler die eigentliche Rechnung anstellen kann: *Kommt mein Schaden pro Sekunde überhaupt gegen die Heilung an, oder ist Zielwechsel Pflicht?* Das ist eine echte Entscheidung mit echten Zahlen und braucht keine neue Mechanik, nur eine zusätzliche Zeile in der Analyse-Ausgabe. **Solange das fehlt, ist E4 nicht belegt** (offener Punkt, `06_Implementierungsplan_Kapitel1.md` M16).

**Einordnung – das ist Inhaltsdesign, keine Deadlock-Sicherung.** Ursprünglich war eine erzwingende Boss-Mechanik als *Gate* gedacht, damit der Kapitel-Boss nicht rein durch Farmen fällt. Diese Begründung ist **entfallen**: Die EXP-Dämpfung über Level × Zone (`oekonomie-waehrungen.md` §1a) erledigt das Idle-Overpowern allein. Gegner-Mechaniken bleiben trotzdem nötig – aber weil gutes Spiel sonst nur „schneller draufhauen" heißt, nicht weil ohne sie ein Deadlock entstünde. **Folge: pro Gegner dosierbar statt Systemzwang.**

**Leitlinie: fordernd, nicht strafend.** Autoplay soll an solchen Gegnern *langsam* verlieren (mehr Schaden nehmen, länger brauchen), nicht *garantiert* sterben. Im Idle-Genre wird strafend schnell als unfair gelesen.

**Konter-Zustand — nur temporär, nur bei Bossen/Minibossen.** „Angreifen schadet dem Angreifer" ist als **Dauer-Trait ausdrücklich verworfen**: schwer verständlich und auf Dauer nervig. Als *temporärer, telegrafierter* Zustand eines Bosses ist es etwas kategorisch anderes – ein Rätsel-Takt statt einer Steuer. Autoplay verliert dort HP, stirbt aber nicht zwangsläufig; damit erfüllt es „fordernd, nicht strafend".

**Umgesetzt in M16 (01.08.2026), nur bei Vaultron.** Konkretisierung der Konzept-Vorgabe:

- **Nur der Kapitel-Boss, dosierbar.** Weder Blandzilla (lehrt Limit) noch Fort Knoxious (lehrt DEF/Panzer) tragen den Konter – ein einzelner, gut beobachtbarer Fall statt drei gleichzeitig neuer Mechaniken.
- **Wiederverwendeter Telegraf.** Kein neuer UI-Zustand nötig: Vaultrons AoE-Trait feuert alle drei Aktionen; die Aktion unmittelbar davor (bisher ein normaler Einzelziel-Treffer) wird jetzt zur Konter-Ladung – exakt die Aktion, die die Stage bereits als „⚡ Mako core charging…" anzeigt (`ui/Stage.svelte`, seit M8). Netto ersetzt der Konter einen sonst garantierten Treffer, statt reinen Zusatzschaden hinzuzufügen.
- **Deckel statt Dauerschaden.** Jeder Treffer während des Fensters kontert mit voller Schadensformel, aber höchstens zweimal je Fenster (`COUNTER_MAX_HITS`, `core/formulas.ts`) – ungedeckelt riss die Messung A2/B2/C3 für Typ V/T (die dem Konter nicht ausweichen), ein Einmal-Konter war umgekehrt im Rauschen der M↔T-Messung nicht sichtbar. Details: `07_Umsetzungsentscheidungen.md` M16-Umsetzungsentscheidungen.
- **Ausweichen ist eine echte Zielwahl-Entscheidung.** Vaultrons Welle (Zone 30) führt zwei Blando als Adds mit – ein Spieler, der das Fenster erkennt, weicht auf sie aus, statt stur weiter auf Vaultron zu schlagen. Das macht den Konter zum zweiten Zielwahl-Lehrgegner des Kapitels (nach dem Heiler in §5a), diesmal mit Timing statt Reihenfolge als Dreh- und Angelpunkt.
- ⚠️ **Korrektur aus dem Konzept-Review (01.08.2026): Die Ausweich-Antwort darf nicht ausgehen können.** Zwei Adds, aber das Konter-Fenster wiederholt sich alle drei Aktionen über einen langen Bosskampf. Sind die Blando tot, gibt es kein Ausweichziel mehr, und der Konter fällt vom **Rätsel-Takt zurück auf die Steuer** – genau die Kategorie, die dieser Abschnitt ausdrücklich verwirft. Verschärfend: Wer die Mechanik *versteht* und konsequent ausweicht, tötet die Adds am schnellsten und schaltet damit seine eigene Antwort zuerst ab. Die Mechanik bestraft ihr richtiges Verständnis.

  **Regel, allgemein:** Ein temporärer Zustand, der sich wiederholt, braucht eine Antwort, die **jedes Fenster erneut verfügbar** ist. Zwei Wege, beide zulässig, mildester zuerst: **(a) Defend als anerkannte zweite Antwort** – der Konter greift nur bei Angriffen, Verteidigen ist immer verfügbar und passt zur bestehenden Telegraf-Logik (§6); **(b) nachrückende Adds**, so dass das Ausweichziel nicht endlich ist. **(a) ist die Empfehlung**, weil sie kein neues Encounter-Verhalten braucht und Defend im selben Zug den in `ui-layout.md` benannten Zweck bekommt. Offener Punkt, noch nicht umgesetzt.

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
- **Regions-Boss = Kapitel-Wand:** kombiniert 2–3 Archetyp-Züge + telegrafierte Mechanik. Bewusst eine **grindbare Idle-Wand** (manuell schneller, per Grind auch schaffbar) – *kein* Pflicht-Prüfstein im ersten Zyklus.

  **Präzisierung (30.07.2026): grindbar ja – aber nicht in einer Stunde.** Jede Wand muss irgendwann überpowerbar sein; nach mehreren Reunions soll der Region-1-Miniboss selbstverständlich von allein fallen. Im **ersten** Durchlauf darf blindes Idle-Farmen den Kapitel-Boss aber nicht in einer Stunde umlegen, sondern erst in einer Größenordnung, **die niemand freiwillig abwartet**. Getragen wird das nicht von der Bosshöhe (eine reine Stat-Wand ist immer eine Zeitwand – s. u.), sondern von der EXP-Dämpfung (`oekonomie-waehrungen.md` §1a).

  **Merksatz aus dem Playtest:** *Eine reine Stat-Wand kann nie eine Können-Wand sein.* Stats sind farmbar, Farmen ist Zeit – also ist jede Stat-Wand eine Zeitwand, egal wie hoch man sie stellt. Wer will, dass Können zählt, braucht **Mechanik** (§5a), nicht mehr HP.

## 8. Belohnungen (deterministisch, kein RNG)

Kills geben automatisch **EXP** (AP ab Kapitel 2; Gil gestrichen 30.07.2026) – der EXP-Ertrag ist nach Level × Zone gedämpft (`oekonomie-waehrungen.md` §1a). **Erst-Clear bestimmter Gegner/Bosse** → garantierte Materia-/Skill-Freischaltung. Keine Zufalls-Farmdrops.

## Rollout über den ersten Zyklus

- **Region 1:** Standard + Miniboss (Limit). Noch keine Analyse/Schwächen.
- **Region 2:** Analyse an; **Panzer + Flitzer + Heiler** treten auf. Panzer/Flitzer zeigen, warum man Schwächen/Kontrolle bald will; der **Heiler gibt Analyse und Zielwahl ab dem ersten Auftritt einen Zweck** (§5a).
- **Region 3:** Shock an; **Schwäche-Gegner + Nuker** (Heilung/Defense wird nötig) → Kapitel-Wand.

---

## Offene Detailfragen (Playtest)

- Kurvenform der Gesamtstärke (linear vs. gekrümmt) und Steigung.
- Wellengrößen-Verteilung; wie oft (und wo) >4 Gegner sinnvoll sind.
- Schwächen-Verteilung je Region; Element-Palette früh.
- Boss-Spike-Höhe relativ zur Trend-Linie.
- Gegner-Stat-Skalierung je Zone.

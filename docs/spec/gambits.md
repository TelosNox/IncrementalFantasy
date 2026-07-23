# Gambits, Steuerung & Automatik

**Status:** In Arbeit – Kern festgelegt, konkrete Zahlen TBD.
**Rahmen:** `../03_Konzept_Gerüst.md`, §5 (verbindliche Richtung).
**Prüfinstanz:** `../02_Leitfaden_Kernmechaniken.md`.

## Schnittstellen zu anderen Systemen

- **Kampf/ATB** (`kampf-analyse-shock.md`): ATB liefert das „Wann", Gambits das „Was"; Default-Attack ist die unterste Regel. MP, HP, Analyse-Wissen, Shock-Zustand und Gegner-Art speisen die Bedingungen.
- **Materia** (`materia.md`): Aktionen/Bedingungen referenzieren angelegte Materia; weakness-Bedingungen erst nach Analyse.
- **Reunion-Essenz** (`prestige-reunion.md`): schaltet Gambit-Fähigkeiten frei und baut sie aus (Slots, Bedingungstypen, Reaktion).
- **Charaktere/Ausrüstung** (`charaktere-party.md`, `ausruestung-gil.md`): umschaltbare Sets, Auto-Wechsel nach Gegner-Art.

---

## 1. Drei Steuerungs-Ebenen

Wer eine Aktion wählt, wenn eine ATB-Leiste voll ist, hat drei Ebenen:

1. **Manual** – der Spieler wählt (Klicker-Einstieg und spätere Übernahme).
2. **Gambits** – die vom Spieler autorierte Standard-Policy (Prioritätsliste).
3. **Default-Attack** – garantierter Fallback auf unterster Prio.

Progression läuft von *manuell-only* hin zu *immer mehr Automatik* – der manuelle Zugriff bleibt aber immer als Option obendrauf.

## 2. Manueller Klicker-Einstieg

Der allererste Abschnitt ist ein **kurzer manueller Klicker**: Aktionen (Attack, Magic, Limit) werden bei ATB-Bereitschaft selbst gewählt.

- **Zweck:** lehrt das Kampf-Vokabular (Attack, MP, Magic, Limit, Shock). Man kann keine gute Automatik schreiben für ein System, das man nicht verstanden hat.
- **Kurz halten** (gegen Klick-Ermüdung, A2-Schwäche).
- **Erste Automatisierung = Erlösung:** die Freischaltung der Default-Attack-Regel ist der erste spürbare Automatik-Beat (gegen Anti-Pattern #2 „zu früh automatisieren").

## 3. Persistenter Hybrid: Autoplay-Standard + manuelle Übernahme

Ab da ist **Autoplay der Standard**; der Spieler kann **jede Figur einzeln auf Manual stellen** und ihre Aktionen selbst wählen (Auto/Manual-Umschalter **je Figur**).

- **Der Gambit ist die „gut-genug"-Policy für den Alltag; die manuelle Steuerung ist der Clutch-Modus** für Bosse/Wände (Limit ins Shock-Fenster, optimale Ziele, klügeres MP-Management).
- **Zugänglichkeit:** Sobald eine Manual-Figur bereit ist, **pausiert die gesamte Kampfuhr** während der Auswahl (wie FF7s „Wait"-Modus) – nicht nur die eigene Leiste, sondern **auch Shock-Auf/-Abbau, Gegner-Telegrafs und Statuseffekt-Ticks** stehen still (Details `kampf-analyse-shock.md` §1). So wird ein Shock-Fenster nie durch Nachdenken verbraucht – überlegt statt hektisch.
- Das ist das aktive **Strategie-Element**, das aktives Spiel an den bedeutsamen Momenten belohnt, ohne Idle zu bestrafen (§3).

### Steuerungsmodus je Figur (statt globalem Umschalten)

Der Auto/Manual-Schalter sitzt **pro Figur**. Spontanes Eingreifen im laufenden Auto-Spiel ist unmöglich – der Gambit feuert sofort bei voller Leiste. Deshalb **stellt man eine Figur vorab auf Manual**: Das Team kämpft automatisch weiter, während **eine Figur gezielt manuell** spielt (z. B. Claude/Barrel/Tofa auf **Auto**, **Arris** auf **Manual** für den Zauber zur Schwäche). „Alle manuell" ist einfach der Zustand, in dem jede Figur auf Manual steht. Default nach Freischaltung: Auto.

### Bedien-Flow der manuellen Aktion

1. Manual-Figur wird **bereit** (ATB voll) → die **gesamte Kampfuhr pausiert** (globale Wait-Pause).
2. Am Panel der Figur öffnet ein **Aktions-Popup** (FF7-Menübox; Darstellung/Position: `ui-layout.md`).
3. Der Spieler wählt Aktion + bei Bedarf **Ziel** (sinnvolles Standardziel vorgewählt, Gegner-Antippen ändert es).
4. Aktion feuert → Uhr läuft weiter. **Mehrere gleichzeitig bereite** Manual-Figuren werden als **Warteschlange** nacheinander abgefragt.

**Aktions-Gruppen im Popup (skaliert mit dem Fortschritt):**

- **Grundaktionen (immer):** Attack; **Special** (Waffen-Signature, MP-Kosten); **Limit** (nur wenn geladen – dann in **bunten Buchstaben**, FF7-Signatur).
- **Defend:** erscheint als **kontextuelles Event**, sobald der **erste Boss sichtbar eine Groß-Attacke auflädt** (Onboarding genau bei Bedarf; in Kapitel 1 spätestens an Vaultron).
- **Magic ▸ (Materia-Kategorie):** erscheint **erst, wenn Materia-Aktionen vorhanden sind** (ab Kap. 2); öffnet als **scroll-/blätterbare Unterliste** → beliebig viele Zauber, ohne dass das Popup wächst.
- **Nicht ausführbare Aktionen** (z. B. Special ohne MP) bleiben **sichtbar, aber ausgegraut** (gedämpft + dünne Schrift) – nie verstecken, damit die Optionen lernbar bleiben.

## 4. Idle-Anteil & manuelle Prüfsteine (Balance-Philosophie)

Wir bauen ein **Incremental, kein Pflicht-Idle.** Wie bei Increlution (siehe `../01_Recherche_Incremental_Games.md`) leben gute Incrementals oft vom **Zusammenspiel aus Idle- und Manuell-Anteil**. Manuelles Spiel darf daher an bestimmten Stellen **verlangt** sein.

Wir unterscheiden bewusst **zwei Wand-Typen** als Design-Werkzeug:

- **Idle-Wände (Mehrheit):** über Builds/Grind überwindbar; manuell schneller. Hier gilt der **Skill↔Zeit-Tausch**: Idle schafft es auch, braucht aber spürbar länger. Manuell ersetzt Zeit durch Können, Idle Können durch Zeit.
- **Manuelle Prüfsteine (selten, an Schlüsselmomenten):** bewusst gesetzte Gates, die überlegtes manuelles Spiel *verlangen* (z. B. große Regions-/Kapitel-Bosse). Sie markieren echte Fortschrittssprünge und geben dem aktiven Können einen garantierten Sinn.

**Der entscheidende Schutz der Zugänglichkeit:** „Manual" heißt bei uns **überlegt, nicht reflexschnell.** Dank ATB-Pause (Wait-Modus) ist die Herausforderung, *Wissen anzuwenden* (Schwäche/Shock/Limit/MP klug einsetzen) – keine Reaktionszeit. So bleibt es on-genre und auch für entspannte/mobile Spieler machbar.

**Leitplanken für manuelle Prüfsteine:**

- **Selten & telegrafiert** – die Masse der Progression bleibt idle-freundlich; ein manueller Moment kündigt sich an (Offline stockt dort bewusst).
- **Überlegt, nicht twitch.**
- **Ventil bleibt (#1):** auch davor fließt Fortschritt; und genug Über-Level/Build kann einen Prüfstein zusätzlich erleichtern.
- **Synergie:** der Prüfstein ist oft genau der Moment, das aufgeladene Limit manuell als Wand-Brecher zu setzen.

## 5. Gambit-Struktur

- **Prioritätsliste** je Figur: von oben nach unten geprüft, erste passende Regel feuert; unterste Regel = Default-Attack.
- **Bedingungen:** MP-/HP-Schwellen, Gegner-Schwäche (nach Analyse), Shock-Zustand, Gegner-Art, Boss/Nicht-Boss u. a.
- **Aktionen:** Attack, Materia Ability/Magic, Defend, Limit.
- **Umschaltbare Sets** (offensiv/defensiv), optional **automatischer Wechsel nach Gegner-Art** – kein ständiges Herumschalten.
- **Ausbau über Reunion** (vertikale Achse): mehr Slots, mehr Bedingungstypen, schnellere Reaktion. Automatik ist verdiente Prestige-Belohnung.
- **Ab-Werk-Presets:** funktionierende Standard-Sets, damit Casuals sofort spielen; Tiefe optional (Auflösung „Tiefe ⟷ Zugänglichkeit" §3, gegen D1/D4-Spreadsheet-Gefahr).

## 6. Rollout-Reihenfolge

Manual-only (Klicker) → Default-Attack-Regel → mehr Gambit-Slots/Bedingungen/Sets über Reunion. Manuelle Steuerung bleibt durchgehend verfügbar.

**Sichtbarkeits-Rollout der Steuer-UI** (nie mehr zeigen, als gerade Sinn ergibt):

- **Klicker-Auftakt** (vor Default-Attack): **kein** Auto/Manual-Schalter – es gibt nichts zu automatisieren; das Popup erscheint bei jeder Bereitschaft. **Wichtig:** auch kein reiner Text-Hinweis auf einen Modus (z. B. „Manual" im Banner) – das wäre derselbe Spoiler wie ein sichtbarer Schalter (Playtest-Learning, s. `feinspec-kapitel1.md` §1.1).
- **Ab Default-Attack-Regel** (Region 1): der **Auto/Manual-Schalter je Figur** erscheint.
- **Defend** ab der ersten telegrafierten **Boss-Aufladung**; die **Magic-Kategorie** ab der ersten **Materia** (Kap. 2).

---

## Offene Detailfragen (nächste Iteration, dann mit Zahlen)

- Welche Bedingungstypen in welcher Reunion-Stufe; Slot-Anzahl je Stufe.
- Preset-Umfang für den Casual-Einstieg.
- „Wechselkurs" Skill↔Zeit an **Idle-Wänden**: wie viel schneller ist manuell (spürbar, aber Idle darf sich nicht bestraft anfühlen).
- **Manuelle Prüfsteine:** Häufigkeit, Platzierung und Schwierigkeitsgrad (selten, überlegt-nicht-twitch, klar telegrafiert).
- Ab wann ist eine Limit-Auto-Regel verfügbar (früh als Sicherheitsnetz vs. später).
- ~~Ergonomie der manuellen Übernahme (Auslöser, Pause-Verhalten)~~ → **entschieden:** Modus je Figur, globale Wait-Pause, Aktions-Popup (s. §3); Darstellung in `ui-layout.md`.
- Genaue Region der Defend-Freischaltung (welcher Boss lädt zuerst sichtbar auf).

# 04 – Status & Roadmap

**Zweck:** Orientierung für einen frischen Kontext. Was ist **entschieden**, was ist **Playtest-Balance**, was ist **bewusst noch nicht spezifiziert**. Danach folgt die implementierungsnahe Feinspec.

## Stand

- **Fundament:** `01_Recherche_Incremental_Games.md`, `02_Leitfaden_Kernmechaniken.md` (verbindliche Prüfinstanz), `03_Konzept_Gerüst.md`.
- **System-Specs** (`docs/spec/`, Index in `spec/README.md`): Kampf/ATB/Shock, Gambits/Steuerung, Materia, Ausrüstung/Gil, Stats, Charaktere/Party, Prestige/Reunion, Ökonomie/Währungen, Niederlage/Offline, Progression/Regionen, Gegner-Encounter, Gegner-Katalog (10 Monster), Encounter-Zyklus-1 (Platzierung + Stats), Charakter-Visuals, UI-Layout.
- **Visuals:** 4 Charaktere, 10 Monster, 3 Kapitel-1-Kulissen — als PNGs **und** reproduzierbare Generatoren (`assets/generate_{characters,monsters,regions}.py`).

## Entschieden (Kern-Pfeiler)

- Idle-Auto-Battler-RPG, FF7-Parodie; keine Monetarisierung außer optional Einmalkauf.
- **ATB als Takt**; Auto-Attack = unterste Gambit-Regel; manueller Klicker-Einstieg → Autoplay + optionale Übernahme; **zwei Wand-Typen** (grindbare Idle-Wände + seltene manuelle Prüfsteine).
- **Gambits** (über Reunion freigeschaltet) als Automatik-Tiefe.
- **MP** als einziger Limiter (kein Cooldown), 3 Regen-Kanäle; existiert ab Start, sichtbar ab 1. MP-Fähigkeit.
- **Limit** = aktiver Wand-Brecher (persistent, gambit-fähig).
- **Materia:** knappe Slots + verbundene Paare; AP auf alle Angelegten; Cap-Reset + Evolution; Taxonomie (nur Gameplay-Veränderer, keine flachen Multiplikatoren); öffnet in **Kapitel 2**.
- **Ein Ausrüstungs-Item** je Figur; A/B-Slot-Layout; Resistenz via Elementar-Kombo.
- **Stats:** HP/MP/ATK/MAG/DEF/SPD; deterministisch (kein Glück/Ausweichen).
- **Reunion** ab Kapitelende, wiederholbar, schwacher-aber-wiederholbarer (gedeckelter) Boost; **1. Reunion schaltet Gambits frei**; klare Reset/Persistenz-Listen.
- **Shock:** Neutral / Schockaffin / Schockresistent; baut immer auf, via Schwäche schneller.
- **Story:** ~15 Regionen, 5 Kapitel, Reunion je Kapitelende; **1. Reunion nach Region 3** (Stadt-Arc); Namen festgelegt.
- **Roster:** Claude/Barrel/Tofa/Arris mit Waffen-Specials; **10 Monster** (englische Namen) mit Merkmalen + Debüt-Zuordnung (Zyklus 1 vs. Kap. 2+).
- **Zyklus-1-Encounter:** konkrete Monster-Platzierung je Region + grobe Stats + Skalierungsregel.
- **Pixel-Stil** und **UI-Platzbudget** festgelegt.

## Offen: Playtest-Balance (Zahlen/Kurven)

Aggregiert aus den „Offene Detailfragen" der Specs — alle konkreten **Werte/Kurven/Formeln**: ATB-Formel, Schadens-/Heilformel, Wachstumsfaktor g, MP-/Regen-Werte, Shock-Raten/Fenster, Cap-/Evolutions-/Reunion-Kosten, Slot-Wachstum, Zeitstrafe & Offline-Rate, Zahl-Notation. → jeweils am Ende der betroffenen `spec/*.md`.

## Bewusst noch NICHT spezifiziert (Kapitel 2+ / später)

- Kapitel-2+-Rollout im Detail: Materia-Öffnung, MP-Regen-Ausbau, Resistenzen.
- Summons/Esper und Chocobos (nur als sekundär vermerkt).
- Nebenquest-Inhalte und „bedeutende exklusive Entscheidungen".
- Boss-Designs über die Kapitel-1-Gates hinaus (Mechaniken/Telegrafs).
- Kulissen der Regionen 4–15; konkretes UI-Design (nur Platzbudget steht).
- Story-Text/Dialoge, Audio.

## Nächster Schritt: Prototyp-Implementierung

**Erledigt:** Die **implementierungsnahe Feinspec Kapitel 1** liegt vor: `docs/spec/feinspec-kapitel1.md` — Datenmodelle/Schemas (Charakter, Monster, Encounter, Waffe, SaveState, Default-Gambit-Regeln), konkrete **simulationsvalidierte** Formeln/Startwerte, Kampf-Tick-Loop, Pacing-Beispiele und vier UI-Screens (`assets/mockups/`). Balance reproduzierbar über `assets/sim/sim_chapter1.py`; Screens über `assets/sim/make_mockups.py`. Bewusste Abweichung: `g` = 1,07 (statt 1,08), in der Feinspec §10 begründet.

**Erledigt:** Die **technische Architektur** liegt vor: `docs/05_Architektur.md` — Stack (TypeScript + Vite + Svelte, `break_eternity.js` für BigNumber), Projektstruktur (Sim-Kern getrennt von UI), Game-Loop, ein gemeinsamer Mechanismus für Pause/Resume **und** Offline-Ernte (nutzt Determinismus aus, kein Ticken in Zeitlupe nötig), Save-System (lokal, versioniert), Hosting via GitHub Pages + Actions. Repo existiert bereits: `github.com/TelosNox/IncrementalFantasy`, Pages-Quelle auf „GitHub Actions" gestellt.

**Erledigt:** Der **Implementierungsplan Kapitel 1** liegt vor: `docs/06_Implementierungsplan_Kapitel1.md` — 11 Meilensteine (M0 Scaffold/Deploy-Pipeline bis M10 Härtung), jeweils mit Ziel, Spec-Referenzen und Abnahmekriterium; M0–M4 Fundament (Engine/Save headless testbar), M5–M9 spielbare Vertikal-Slices entlang des Spieler-Rampups, M9 schließt mit der 1. Reunion.

**Stand Umsetzung:** **M0–M10 sind erledigt – Kapitel 1 ist komplett.** Scaffold, Engine/Save headless, Region 1 + Region 2 + Region 3 komplett spielbar inkl. Waffenkauf/Auto-Attack/Limit/Blandzilla-Miniboss, Barrel/Suppress, Analyse/Bestiarium-UI, Fort-Knoxious-Gate, volle 4er-Party Tofa/Arris, Shock-Ring, Defend, telegrafierte Gegner-Aktionen, Vaultron-Kapitel-Boss, Offline-„Willkommen zurück"-Projektion, 1. Reunion mit permanentem Boost, Save-Export/Import + Warnung bei korrupten Saves, Debug-Tool nur noch im Dev-Build, MegaCorp-Kulisse-Fix. Der **komplette Kapitel-1-Loop Zone 1 → 30 → Reunion → nächster Zyklus** ist spielbar, speicherbar und exportierbar. Bekannte, bewusst nicht behobene Lücke: echtes Mobil-Portrait-Layout (< ~700px Breite) ist noch nicht unterstützt – laut `ui-layout.md` „Offene Punkte" ohnehin noch unentschieden, keine M10-Regression. Nächster Schritt: Kapitel-2-Feinspec (Materia/Slots/AP/Magie, programmierbarer Gambit-Editor) – siehe `06_Implementierungsplan_Kapitel1.md` „Danach". Ladehinweis (CLAUDE.md): `03_Konzept_Gerüst.md` + betroffene `spec/*.md`, `02_Leitfaden_Kernmechaniken.md` als Prüfinstanz; für technische Umsetzung zusätzlich `05_Architektur.md`.

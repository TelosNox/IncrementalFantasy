# 04 – Status & Roadmap

**Zweck:** Orientierung für einen frischen Kontext. Was ist **entschieden**, was ist **Playtest-Balance**, was ist **bewusst noch nicht spezifiziert**. Danach folgt die implementierungsnahe Feinspec.

## Stand

- **Fundament:** `01_Recherche_Incremental_Games.md`, `02_Leitfaden_Kernmechaniken.md` (verbindliche Prüfinstanz), `03_Konzept_Gerüst.md`.
- **System-Specs** (`docs/spec/`, Index in `spec/README.md`): Kampf/ATB/Shock, Gambits/Steuerung, Materia, Ausrüstung/Gil, Stats, Charaktere/Party, Prestige/Reunion, Ökonomie/Währungen, Niederlage/Offline, Progression/Regionen, Gegner-Encounter, Gegner-Katalog (10 Monster), Encounter-Zyklus-1 (Platzierung + Stats), Charakter-Visuals, Region-Kulissen, UI-Layout.
- **Visuals:** 4 Charaktere, 10 Monster, 3 Kapitel-1-Kulissen (+ Quaintsville als Baukasten-Nachweis) — als PNGs **und** reproduzierbare Generatoren (`assets/generate_{characters,monsters,bosses,regions}.py`, Kulissen-Baukasten in `assets/region_kit.py`, deterministische PNG-Ausgabe über `assets/pixel_io.py`).

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
- **Roster:** Claude/Barrel/Tofa/Air is... mit Waffen-Specials; **10 Monster** (englische Namen) mit Merkmalen + Debüt-Zuordnung (Zyklus 1 vs. Kap. 2+).
- **Zyklus-1-Encounter:** konkrete Monster-Platzierung je Region + grobe Stats + Skalierungsregel.
- **Pixel-Stil** und **UI-Platzbudget** festgelegt.
- **Bühnen-Framework der Kampfzone** (`spec/ui-layout.md`): eine Einheit (Stage-Unit), feste Bühnenbox **504×288 su (7:4)**, **ein** Skalierungsfaktor `s` für Backdrop und Sprites, feste Bänder/Standlinien/Slots, benannte Ebenen (B0–B2 / F-Stapel / U0–U2), Tiefenvektor **D = (+40, −40)** parallel zur 45°-Achse der Sprite-Würfel, Vortreten bei ATB-Bereitschaft. Ersetzt die bisherige Mischung aus absoluten Sprite-Größen und relativem Layout, die Proportionen fenstergrößenabhängig machte. **Asset-Folge:** Alle Kulissen sind neu zu erzeugen – Format 168×96 in einem Canvas 224×128 mit Bleed, Bodenfläche verbindlich in den unteren 32 Pixeln (`spec/charaktere-visuals.md`). Prüf-Mockups in `spec/assets/mockups/stage-*.html`.

## Offen: Playtest-Balance (Zahlen/Kurven)

Aggregiert aus den „Offene Detailfragen" der Specs — alle konkreten **Werte/Kurven/Formeln**: ATB-Formel, Schadens-/Heilformel, Wachstumsfaktor g, MP-/Regen-Werte, Shock-Raten/Fenster, Cap-/Evolutions-/Reunion-Kosten, Slot-Wachstum, Zeitstrafe & Offline-Rate, Zahl-Notation. → jeweils am Ende der betroffenen `spec/*.md`.

## Bewusst noch NICHT spezifiziert (Kapitel 2+ / später)

- Kapitel-2+-Rollout im Detail: Materia-Öffnung, MP-Regen-Ausbau, Resistenzen.
- Summons/Esper und Chocobos (nur als sekundär vermerkt).
- Nebenquest-Inhalte und „bedeutende exklusive Entscheidungen".
- Boss-Designs über die Kapitel-1-Gates hinaus (Mechaniken/Telegrafs).
- Kulissen der Regionen 5–15 (Leitmotive stehen, Rezepturen fehlen; Region 4 Quaintsville existiert als Baukasten-Nachweis) sowie die Kapitel-Paletten 3–5; **Kulissen-Leben** (`spec/regionen-kulissen.md` §10) ist spezifiziert, aber nicht gebaut, und der **Zonenwechsel-Schwenk** ist seit M12 entscheidbar. Konkretes UI-Design weiterhin offen (nur Platzbudget steht).
- Story-Text/Dialoge, Audio.

## Nächster Schritt: Prototyp-Implementierung

**Erledigt:** Die **implementierungsnahe Feinspec Kapitel 1** liegt vor: `docs/spec/feinspec-kapitel1.md` — Datenmodelle/Schemas (Charakter, Monster, Encounter, Waffe, SaveState, Default-Gambit-Regeln), konkrete **simulationsvalidierte** Formeln/Startwerte, Kampf-Tick-Loop, Pacing-Beispiele und vier UI-Screens (`assets/mockups/`). Balance reproduzierbar über `assets/sim/sim_chapter1.py`; Screens über `assets/sim/make_mockups.py`. Bewusste Abweichung: `g` = 1,07 (statt 1,08), in der Feinspec §10 begründet.

**Erledigt:** Die **technische Architektur** liegt vor: `docs/05_Architektur.md` — Stack (TypeScript + Vite + Svelte, `break_eternity.js` für BigNumber), Projektstruktur (Sim-Kern getrennt von UI), Game-Loop, ein gemeinsamer Mechanismus für Pause/Resume **und** Offline-Ernte (nutzt Determinismus aus, kein Ticken in Zeitlupe nötig), Save-System (lokal, versioniert), Hosting via GitHub Pages + Actions. Repo existiert bereits: `github.com/TelosNox/IncrementalFantasy`, Pages-Quelle auf „GitHub Actions" gestellt.

**Erledigt:** Der **Implementierungsplan Kapitel 1** liegt vor: `docs/06_Implementierungsplan_Kapitel1.md` — 11 Meilensteine (M0 Scaffold/Deploy-Pipeline bis M10 Härtung), jeweils mit Ziel, Spec-Referenzen und Abnahmekriterium; M0–M4 Fundament (Engine/Save headless testbar), M5–M9 spielbare Vertikal-Slices entlang des Spieler-Rampups, M9 schließt mit der 1. Reunion.

## ⚠️ Stand nach dem ersten echten Playtest (24.07.2026)

**Kapitel 1 ist gebaut, aber nicht durchspielbar.** Der erste Durchlauf ohne Debug-Eingriffe kam über **Zone 14** nicht hinaus; Fort Knoxious (Z18) blieb unbesiegbar, Region 3 unerreichbar.

**Ursache:** In einer deterministischen Engine (kein RNG – bewusste Entscheidung) gab es **keinen Weg zurück in eine bereits geschaffte Zone** und **keinen Ertrag bei Niederlage**. Damit ist jede verlorene Zone ein permanenter Totalstopp statt einer grindbaren Wand – eine Verletzung von Anti-Pattern **#1** („Fortschritts-Wände ohne Ventil"). Die simulationsvalidierte Baseline hat das nicht gezeigt, weil der Test-Harness bei jeder Niederlage an der letzten geschafften Zone farmt – **eine Mechanik, die es im Spiel nie gab.** Die Simulation maß ein anderes Spiel als das ausgelieferte.

Zusätzlich zeigte sich Anti-Pattern **#5** invertiert: Ein Spieler mit *geschlossenem* Tab kam per Offline-Projektion an einem Gate vorbei, an dem ein aktiv spielender feststeckte – die Offline-Rechnung war unbeabsichtigt das einzige funktionierende Ventil.

**Konsequenz – entschieden und spezifiziert:** Zonen-Rückkehr als Ventil · HP/MP-Übertrag zwischen Kämpfen (25 % Erholung pro Sieg) · MP-Refund pro Angriff gestrichen (MP wird zum Kampf-Budget) · Gasthaus als Heilkanal (kostet Zeit, nicht Gil) · Niederlage heilt nicht · Limit nur noch in Gate-Kämpfen (Esper-Modell) · **Offline-Progress stillgelegt** (Wiedereinführung später als aufladbarer Boost). Details: `spec/feinspec-kapitel1.md` §3.4/§3.5/§3.8 und `spec/niederlage-offline.md`. Umsetzung: **M11** in `06_Implementierungsplan_Kapitel1.md`.

**Sämtliche Balance-Zahlen von Kapitel 1 sind damit unvalidiert.** Die Pacing-Tabelle (feinspec §7.4) ist als ungültig markiert und wird nach der Umsetzung **neu simuliert, nicht geflickt**. Bis dahin existiert bewusst keine gültige Baseline – das ist ehrlicher als eine reparierte Zahlenreihe, die wieder glaubwürdig aussieht, ohne es zu sein.

**Übergreifende Lehre (in den Leitplanken zu führen):** Ein Leitplanken-Haken ist erst gültig, wenn die zugehörige Mechanik **im Spiel** geprüft wurde – nicht in der Simulation, die sie voraussetzt.

---

**Stand Umsetzung (M0–M10, vor dem Playtest):** **M0–M10 sind erledigt – Kapitel 1 ist gebaut.** Scaffold, Engine/Save headless, Region 1 + Region 2 + Region 3 komplett spielbar inkl. Waffenkauf/Auto-Attack/Limit/Blandzilla-Miniboss, Barrel/Suppress, Analyse/Bestiarium-UI, Fort-Knoxious-Gate, volle 4er-Party Tofa/Air is..., Shock-Ring, Defend, telegrafierte Gegner-Aktionen, Vaultron-Kapitel-Boss, Offline-„Willkommen zurück"-Projektion, 1. Reunion mit permanentem Boost, Save-Export/Import + Warnung bei korrupten Saves, Debug-Tool nur noch im Dev-Build, MegaCorp-Kulisse-Fix. Der komplette Kapitel-1-Loop Zone 1 → 30 → Reunion → nächster Zyklus ist *technisch* vorhanden, speicherbar und exportierbar – **aber, wie der Playtest oben zeigt, für einen realen Spieler nicht erreichbar.** Bekannte, bewusst nicht behobene Lücke: echtes Mobil-Portrait-Layout (< ~700px Breite) ist noch nicht unterstützt – laut `ui-layout.md` „Offene Punkte" ohnehin noch unentschieden, keine M10-Regression.

**Nächster Schritt: M11** (Ventil-Kette & Ressourcen-Ökonomie) – Blocker für alles Weitere. Die Kapitel-2-Feinspec (Materia/Slots/AP/Magie, programmierbarer Gambit-Editor) folgt erst danach.

Ladehinweis (CLAUDE.md): `03_Konzept_Gerüst.md` + betroffene `spec/*.md`, `02_Leitfaden_Kernmechaniken.md` als Prüfinstanz; für technische Umsetzung zusätzlich `05_Architektur.md`.

---

## Nächste Umsetzungs-Meilensteine: M12 & M13 (Darstellungsschiene)

Aus der Konzept-Session vom 25.07.2026 (Bühnen-Framework) stehen zwei umsetzungsreife Meilensteine in `06_Implementierungsplan_Kapitel1.md`:

- **M12 – Region-Kulissen: Baukasten & Neuauflage. ✅ erledigt (25.07.2026).** Der Generator besteht jetzt aus `assets/region_kit.py` (Bausteine, Prüfmodus, rechnerische Gegenprobe) und `assets/generate_regions.py` (nur Paletten + Rezepturen); die drei Kapitel-1-Kulissen sind im Format 224×128 neu erzeugt, der Shock-Farb-Verstoß ist weg, Quaintsville liegt als vierte Region allein über eine Rezeptur bei. Umsetzungsentscheidungen 20–30 in `06_Implementierungsplan_Kapitel1.md`.
- **M13 – Bühnen-Framework in der Stage.** Kampfzone von handkalibrierten Pixelwerten auf das gerechnete su-System umstellen. Führend: `spec/ui-layout.md`. **Jetzt an der Reihe** – die Kulissen liegen im erwarteten Format vor.

**Reihenfolge M12 vor M13** – M13 erwartet Kulissen im neuen Format. Beide sind reine Darstellung, ändern keine Mechanik und blockieren die Kapitel-2-Feinspec nicht.

---

## ⚠️ Stand M11-Umsetzung (25.07.2026)

**M11 ist implementiert und alle 88 automatisierten Tests sind grün** (`npm test`), inkl. eines neu aufgesetzten `tests/chapter-playthrough.test.ts` gegen die drei Spielertypen aus feinspec §12 (M/T/V). Umgesetzt: Zonen-Rückkehr (freie Zonen-Auswahl in der Sidebar), HP/MP-Übertrag zwischen Kämpfen, Sieg-Erholung (+25 % HP/MP) getrennt von Level-Up (heilt nicht mehr automatisch), MP-Refund-Kanal gestrichen, Gasthaus als zeitbasierter Heilkanal (Sidebar-Anmeldung + Stage-Banner), Niederlage ohne Heilung, Limit als Esper-Modell (nur an den drei Gates), Gegner-Zielwahl (höchste HP) + Partei-Fokusziel (Klick auf Gegner, Markierungen für Fokus- und nächstes Gegnerziel), Offline-Progress aus dem Live-Pfad entfernt (`core/offline.ts` bleibt als Balance-Werkzeug), Save-Migration v1→v2.

**Zwei Befunde beim Balancieren gegen die TS-Engine, dokumentiert statt stillschweigend übergangen** (Details: `06_Implementierungsplan_Kapitel1.md` M11-Umsetzungsentscheidungen):

1. Die Zonen-Größenmodifikatoren (§3.7) mussten für mehrere Zonen (u. a. 6/7/8/18/30) neu justiert werden – die alten, aus dem inzwischen nicht mehr gültigen `sim_chapter1.py` stammenden Werte reproduzierten exakt den „Zone-6-Fehler", den M11 eigentlich beheben sollte.
2. Der in feinspec §12 B2 angenommene Korridor zwischen den Spielertypen T und V (T ≈1,3–2,0×, V ≈2,5–4,0× von M) ließ sich mit T strikt als „nur Fokusziel" (§3.9) nicht erreichen – an der Kapitel-Wand bringt reine Zielwahl ohne Limit/Specials/Heal/Suppress nur einen kleinen Vorteil gegenüber V. Korridor vorläufig angepasst (feinspec §12 B2 trägt einen entsprechenden Vermerk); offene Frage für die nächste Konzept-Session.

**Was die automatisierten Tests nicht ersetzen (feinspec §12 E1-E3):** Ein Mensch muss Zone 1 → 30 → Reunion tatsächlich durchspielen. Das steht noch aus – bis dahin gilt M11 als *technisch*, nicht als *menschlich* validiert.

Ladehinweis (CLAUDE.md): `03_Konzept_Gerüst.md` + betroffene `spec/*.md`, `02_Leitfaden_Kernmechaniken.md` als Prüfinstanz; für technische Umsetzung zusätzlich `05_Architektur.md`.

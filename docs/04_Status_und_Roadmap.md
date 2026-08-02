# 04 – Status & Roadmap

**Zweck:** Orientierung für einen frischen Kontext. Was ist **entschieden**, was ist **Playtest-Balance**, was ist **bewusst noch nicht spezifiziert**. Danach folgt die implementierungsnahe Feinspec.

## Stand

- **Fundament:** `01_Recherche_Incremental_Games.md`, `02_Leitfaden_Kernmechaniken.md` (verbindliche Prüfinstanz), `03_Konzept_Gerüst.md`.
- **System-Specs** (`docs/spec/`, Index in `spec/README.md`): Kampf/ATB/Shock, Gambits/Steuerung, Materia, Ausrüstung (Datei noch `ausruestung-gil.md`, Gil ist gestrichen), Stats, Charaktere/Party, Prestige/Reunion, Ökonomie/Währungen, Niederlage/Offline, Progression/Regionen, Gegner-Encounter, Gegner-Katalog (10 Monster), Encounter-Zyklus-1 (Platzierung + Stats), Charakter-Visuals, Region-Kulissen, UI-Layout.
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

- **M12 – Region-Kulissen: Baukasten & Neuauflage. ✅ erledigt (25.07.2026).** Der Generator besteht jetzt aus `assets/region_kit.py` (Bausteine, Prüfmodus, rechnerische Gegenprobe) und `assets/generate_regions.py` (nur Paletten + Rezepturen); die drei Kapitel-1-Kulissen sind im Format 224×128 neu erzeugt, der Shock-Farb-Verstoß ist weg, Quaintsville liegt als vierte Region allein über eine Rezeptur bei. Umsetzungsentscheidungen 20–30 in `07_Umsetzungsentscheidungen.md`.
- **M13 – Bühnen-Framework in der Stage. ✅ erledigt (26.07.2026).** Die Kampfzone rechnet jetzt in Stage-Units mit einem Skalierungsfaktor: Geometrie in `src/ui/stageLayout.ts`, Darstellung in `Stage.svelte`, Abnahme in `tests/stage-layout.test.ts` (13 Tests, Suite 110/110). Handkalibrierte Pixelwerte, `ENEMY_LAYOUTS` und der feste 2×-Zoom sind entfallen; die beiden Altlasten UI-2 (Cyan) und UI-4 (Sitzplatz-Platzhalter) sind aufgelöst. Umsetzungsentscheidungen 31–41 in `07_Umsetzungsentscheidungen.md`. **Abnahme durch die Konzept-Review am laufenden Dev-Server bestanden** (26.07.2026): Bei drei Fenstergrößen von 540 bis 1092 px Stage-Breite bleiben alle Positionen in su identisch. **Ein Nachzieher offen:** Das Aktions-Popup skaliert nicht mit `s` und verdeckt bei kleiner Bühne 34 % der handelnden Figur – Regel dagegen jetzt in `spec/ui-layout.md`, Umsetzung steht aus.

**Reihenfolge M12 vor M13** – M13 erwartet Kulissen im neuen Format. Beide sind reine Darstellung, ändern keine Mechanik und blockieren die Kapitel-2-Feinspec nicht. **Die Darstellungsschiene ist damit abgearbeitet.**

---

## ⚠️ Stand M11-Umsetzung (25.07.2026)

**M11 ist implementiert und alle 88 automatisierten Tests sind grün** (`npm test`), inkl. eines neu aufgesetzten `tests/chapter-playthrough.test.ts` gegen die drei Spielertypen aus feinspec §12 (M/T/V). Umgesetzt: Zonen-Rückkehr (freie Zonen-Auswahl in der Sidebar), HP/MP-Übertrag zwischen Kämpfen, Sieg-Erholung (+25 % HP/MP) getrennt von Level-Up (heilt nicht mehr automatisch), MP-Refund-Kanal gestrichen, Gasthaus als zeitbasierter Heilkanal (Sidebar-Anmeldung + Stage-Banner), Niederlage ohne Heilung, Limit als Esper-Modell (nur an den drei Gates), Gegner-Zielwahl (höchste HP) + Partei-Fokusziel (Klick auf Gegner, Markierungen für Fokus- und nächstes Gegnerziel), Offline-Progress aus dem Live-Pfad entfernt (`core/offline.ts` bleibt als Balance-Werkzeug), Save-Migration v1→v2.

**Zwei Befunde beim Balancieren gegen die TS-Engine, dokumentiert statt stillschweigend übergangen** (Details: `07_Umsetzungsentscheidungen.md` M11-Umsetzungsentscheidungen):

1. Die Zonen-Größenmodifikatoren (§3.7) mussten für mehrere Zonen (u. a. 6/7/8/18/30) neu justiert werden – die alten, aus dem inzwischen nicht mehr gültigen `sim_chapter1.py` stammenden Werte reproduzierten exakt den „Zone-6-Fehler", den M11 eigentlich beheben sollte.
2. Der in feinspec §12 B2 angenommene Korridor zwischen den Spielertypen T und V (T ≈1,3–2,0×, V ≈2,5–4,0× von M) ließ sich mit T strikt als „nur Fokusziel" (§3.9) nicht erreichen – an der Kapitel-Wand bringt reine Zielwahl ohne Limit/Specials/Heal/Suppress nur einen kleinen Vorteil gegenüber V. Korridor vorläufig angepasst (feinspec §12 B2 trägt einen entsprechenden Vermerk); offene Frage für die nächste Konzept-Session.

**Was die automatisierten Tests nicht ersetzen (feinspec §12 E1-E3):** Ein Mensch muss Zone 1 → 30 → Reunion tatsächlich durchspielen. Das steht noch aus – bis dahin gilt M11 als *technisch*, nicht als *menschlich* validiert.

---

## Design-Änderung: Gruppenlevel statt Charakter-Level (26.07.2026, Konzept-Session)

**Playtest-Befund:** Im ersten Durchlauf war Claude massiv stärker als der Rest der Gruppe. Ursache ist strukturell, nicht numerisch: Bei individuellen Leveln und ~1 Levelaufstieg pro Zone stieß Barrel bei Zone 9 mit L1 zu einem L~9-Claude, Tofa und Air is… bei Zone 19 mit L1 zu L~19 – rund 1,6× bzw. 2,6× Rückstand in ATK. Neu freigeschaltete Figuren waren über eine halbe Region ohne Beitrag; die Freischaltung entwertete sich selbst.

**Entschieden:** **Ein gemeinsames Gruppenlevel für die ganze Party.** EXP fließt in einen Party-Topf, Neuzugänge steigen sofort auf dem aktuellen Level ein. Begründung, verworfene Alternativen und die Challenge-Frage: `spec/stats-kampfwerte.md` §4.1.

**Was sich dadurch NICHT ändert:** die EXP-Kurve `exp_to_next(L) = round(20 · 1,22^(L-1))`. Bisher bekam ohnehin jede Figur die volle Wellen-Summe – der Party-Topf hat exakt dieselbe Rate.

**Regions-Stufe: vorgesehen, gemessen, verworfen.** Als Gegengewicht war eine Stufe auf der Gegner-Basis geplant (`REGION_STEP`: ×1,5 ab Zone 9, ×1,4 ab Zone 19) – gegen die Erwartung, R2/R3 würden sonst zu leicht. Die Validierung an der TS-Engine hat die Erwartung widerlegt: **ohne** Stufe trifft das Kapitel die §7.4-Baseline nahezu exakt, **mit** ihr verfünffacht sich die Spielzeit. Die Gegnerkurve bleibt die reine `g`-Kurve (`spec/feinspec-kapitel1.md` §3.7, Umsetzungsentscheidung 42).

**Ab der 1. Reunion** steht die volle Gruppe schon in Zone 1 (Charaktere bleiben erhalten, Level fällt auf 1). Region 1 wird dadurch deutlich leichter – **gewollt als Prestige-Belohnung**, keine Sonderregel für Folgeläufe (`spec/prestige-reunion.md`). Wie stark das ausfällt, ist noch *gespielt* zu beurteilen.

**Umgesetzt** (`07_Umsetzungsentscheidungen.md`, Umsetzungsentscheidung 42): Gruppenlevel im Save (`partyLevel`/`partyExp`, Migration v2→v3), `Character` ohne eigenes `level`/`exp`, Neuzugänge steigen auf dem Gruppenlevel mit vollen HP/MP ein, **ein** Level-/EXP-Anzeiger in der Sidebar. `REGION_STEP` validiert und verworfen (s. o.). **Weiterhin offen:** die *gespielte* Beurteilung von Durchlauf 2 (volle Gruppe ab Zone 1) – rechnerisch abgedeckt, am Menschen nicht.

Geänderte Dokumente: `03_Konzept_Gerüst.md`, `spec/stats-kampfwerte.md`, `spec/feinspec-kapitel1.md`, `spec/charaktere-party.md`, `spec/oekonomie-waehrungen.md`, `spec/progression-regionen.md`, `spec/prestige-reunion.md`.

---

## ⚠️ Zweiter Playtest & Konzept-Session (30.07.2026) – Gil gestrichen, Farmen gedämpft

**Kapitel 1 ist durchspielbar** – damit ist E1 aus feinspec §12 erfüllt, die offene M11-Abnahme. Der Durchlauf hat aber zwei strukturelle Fehler freigelegt, die auf dieselbe Ursache zurückgehen: **Zeit ersetzt Können.**

### Befund 1 – Gil war keine Entscheidung

Playtest-Wortlaut: „Am Charakter taucht der Kaufbutton auf und man drückt drauf." Die Waffen-Tier-Leiter (`atk ×(1+0,10·tier)`, viermal identisch) war das Anti-Pattern „immer wieder dasselbe Upgrade kaufen und aufs nächste warten". Die Doku wusste es: „Zweiter Gil-Sink fehlt" stand an **zwei** Stellen und wurde nie gelöst.

**Entschieden: Gil ist gestrichen** – nicht umgebaut, nicht verschoben. Der tragende Grund ist strukturell:

> **Eine Ausgabe-Entscheidung ist nur exklusiv, wenn die Währung auf eine Weise knapp ist, die Zeit nicht auflösen kann.** Die Zonen-Rückkehr (das M11-Ventil, unantastbar) macht jeden Gil-Preis farmbar. Also kann Gil keine Entscheidung tragen, nur eine Wartezeit.

Mitgestrichen: die Tier-Leiter (ATK-Wachstum wandert ins Gruppenlevel), Waffen-Ausrichtungen (hätten die Rollen-Signatur der Figuren geschliffen), und die Sperre `weaponTier >= 1` für den Special. Letztere löst zugleich einen **Spec-Widerspruch**: Der als „permanent" versprochene Skill war ab Durchlauf 2 wieder weg, weil das Tier bei jeder Reunion auf 0 fiel. Verworfene Alternativen mit Begründung: `spec/oekonomie-waehrungen.md`.

**Entscheidungen wandern auf die Meta-Ebene:** ein **Reunion-Upgrade-Menü** auf Essenz-Basis (`spec/prestige-reunion.md`). Je System **ein** Milestone als Einstieg, danach freie Wahl; Preise steigen mit der Zahl der Käufe. Begründung: Am Reunion-Punkt hat der Spieler ein Kapitel gespielt und damit **Information** – mitten im Durchlauf hat er keine, und eine Wahl ohne Information ist ein Münzwurf, der Verantwortung nur vorspiegelt.

### Befund 2 – reines Idle war die stärkste Spielweise

Blindes Farmen in tiefen Zonen legte den Kapitel-Boss um. Damit war die **Zonen-Rückkehr von der Notausgangs- zur Optimalstrategie geworden** – dieselbe Krankheit wie die Offline-Projektion am 24.07. Ursache ist die **Rate, nicht die Menge**: EXP pro Kill ist tief unten niedriger, EXP **pro Sekunde** höher, weil die Kill-Zeit zusammenbricht.

**Entschieden: EXP-Dämpfung über Level × Zone.** Liegt das Gruppenlevel über dem erwarteten Level einer Zone, fällt der Ertrag – **nie auf null**. Nicht über den Abstand zu `maxZoneReached`, weil sich das Fenster dann bloß mitverschiebt (Zone 7 erreicht → Zone 5 gefarmt). Ein harter Level-Deckel ist verworfen: Er nähme den unendlichen Zeit-Kanal und damit Leitplanke A3 den Boden.

**Die Kurvenform ist Teil der Anforderung:** Plateau (~+2–3 Level, damit „1–2 Zonen zurück" bezahlbar bleibt) mit anschließendem Sturz (damit Idle den Boss nicht in einer Stunde umlegt). ⚠️ **Ob beides gleichzeitig geht, ist ungemessen** – der kritische Prüfpunkt von M15.

**Zwei Merksätze aus der Session**, beide allgemein verwendbar:

> **Eine reine Stat-Wand kann nie eine Können-Wand sein.** Stats sind farmbar, Farmen ist Zeit – also ist jede Stat-Wand eine Zeitwand, egal wie hoch man sie stellt. Wer will, dass Können zählt, braucht Mechanik, nicht mehr HP.

> **Was automatisiert werden muss, war keine Entscheidung.** Automatisierung braucht nur, was sich wiederholt. Eine Wahl, die pro Durchlauf einmal fällt, ist planerisches Spiel.

### Zwei alte offene Fragen sind damit geschlossen

- **Spielertyp-Korridor** (§12 B2, offen seit M11): war keine Balance-Frage. Wenn Wände durch Stats fallen und Stats aus skillfreiem Farmen kommen, konvergieren alle Spielweisen – der Korridor war **durch den Farm-Kanal zugedrückt**. Ersetzt durch **absolute Zielzeiten**: M ≈ **30 min**, T ≈ **90 min**, V in Größenordnung Wochen. ⚠️ Die Lücke T→V ist Faktor ~200; das Band für den schwachen Spieler (T′) ist noch festzulegen – er darf nicht in den V-Kanal gedrückt werden, sonst hört er auf.
- **„Analyse ist zu Beginn wertlos"** (Playtest-Befund): zutreffend, aber nicht prinzipiell – sie ist wertlos, **weil Zielwahl wertlos ist**. Gekoppelt statt gestrichen: Der **Heiler-Gegner wird nach Region 2 vorgezogen**, dorthin, wo die Analyse aufgeht.

### Kapitel 1 wird nicht ärmer, sondern anders

Run-Entscheidungen bleiben: **MP-Budget, Zielwahl/Fokus, Zonenwahl, Gasthaus-Timing** – MP ist der bessere Lehrer für Ressourcen-Entscheidungen als ein Kaufbutton (pro Kampf, sofortiges Feedback). Dazu neu:

- **Special über Zonen-Trigger** statt Kauf: Claude **Zone 3**, alle späteren Figuren **mit Beitritt**. Gilt nur für Durchlauf 1 – ab Durchlauf 2 ist alles ab Zone 1 verfügbar, weshalb Gambit-Regeln auf „Special" nie ins Leere laufen.
- **Mechanik-Einführung als eigenes System** (`spec/ui-layout.md`): blockierendes Popup mit Pause, aktiv wegzuklicken, nur für **bedienbare** Mechaniken, plus **Codex** zum Nachlesen, ab Durchlauf 2 stumm. **Keine Zahlen in Erklärtexten** – sie würden beim Neu-Balancieren zur Falschaussage des Spiels. Warum das keine Politur ist: *Eine Mechanik, die der Spieler nicht bemerkt, benutzt er nicht* – die stumme Einführung ist mitverantwortlich für die Idle-Konvergenz.
- **Die vier Figuren stellen sich selbst vor**, 2–3 witzige Sätze, aus denen die Stärke hervorgeht. **Claude vor dem allerersten Kampf** – der erste Text des Spiels, er setzt den Ton der Parodie.

### Nächste Schritte

**M15 → M16 → M17 → Kapitel-2-Feinspec** (`06_Implementierungsplan_Kapitel1.md`):

- **M15 Ökonomie-Umbau** – ✅ umgesetzt (31.07.2026, Commit `0ba6883`), aber **nicht abgeschlossen** → M15a.
- **M15a Camping-Leck** – siehe Konzept-Review unten.
- **M16 Zielwahl muss zählen** – Heiler in Region 2; Konter nur als *temporärer* Bosszustand („fordernd, nicht strafend"). Inhaltsdesign, keine Deadlock-Sicherung – das erledigt M15 allein.
- **M17 Mechanik-Einführung** – ✅ umgesetzt (01.08.2026). Popup + Codex, vor der Kapitel-2-Feinspec, damit Kapitel-2-Mechaniken in ein bestehendes Framework rutschen. Details: `06_Implementierungsplan_Kapitel1.md`/`07_Umsetzungsentscheidungen.md` Nr. 81–89.

**Alle Balance-Zahlen von Kapitel 1 bleiben unvalidiert.** §7.4 bleibt ungültig; die Zielzeiten oben sind **Vorgaben, keine Messung**. Diese Session hat bewusst **keine neuen Zahlen** geschrieben – eine zweite reparierte Zahlenreihe wäre derselbe Fehler wie am 24.07.

Geänderte Dokumente: `03_Konzept_Gerüst.md`, `06_Implementierungsplan_Kapitel1.md`, `spec/oekonomie-waehrungen.md`, `spec/ausruestung-gil.md`, `spec/charaktere-party.md`, `spec/prestige-reunion.md`, `spec/stats-kampfwerte.md`, `spec/gegner-encounter.md`, `spec/kampf-analyse-shock.md`, `spec/niederlage-offline.md`, `spec/ui-layout.md`, `spec/feinspec-kapitel1.md`.

Ladehinweis (CLAUDE.md): `03_Konzept_Gerüst.md` + betroffene `spec/*.md`, `02_Leitfaden_Kernmechaniken.md` als Prüfinstanz; für technische Umsetzung zusätzlich `05_Architektur.md`.

---

## ⚠️ Konzept-Review von M15 (31.07.2026) – Camping-Leck gefunden

**M15 ist umgesetzt** (Commit `0ba6883`: Gil entfernt, Waffen-Tier-Leiter ins Gruppenlevel gefaltet, `specialUnlocked` per Zonen-Trigger, EXP-Dämpfung über Level × Zone, Migration v3→v4, Suite grün). **Abgeschlossen ist er nicht** – der Review hat ein Leck gefunden, das die Umsetzung nicht sehen konnte, weil der Pacing-Harness den betreffenden Fall nicht modelliert.

### Der neue Spielertyp: K (Camper)

Der Nutzer hat ihn als reales Verhalten benannt: *„Er startet das Spiel und lässt es während der Arbeitszeit laufen. Danach kommt er weiter."* Anforderung: Weiterkommen ist in Ordnung – **nach dem ersten Start direkt den Boss zu schaffen** nicht. Es soll mindestens einen Umzug in eine deutlich höhere Zone plus erneutes Campen erfordern.

Bisher deckte §12 nur M/T/V ab, und **V ist nicht reines Idle**: Der Harness modelliert für V ausdrücklich eine Zonenwahl (bei Niederlage einen Schritt zurück). Der Fall „eine Zone einstellen und laufen lassen" – genau der aus dem zweiten Playtest – blieb dadurch ungemessen. K ist jetzt vierter Typ, Kriterium **B5**: **≥ 3 Camping-Sessions an deutlich verschiedenen Zonen** bis Vaultron.

### Der Befund: B5 nach M15 verletzt

**Eine einzige 8-Stunden-Session an Zone 3** – der allerersten Wand – bringt L2 → **L20**; danach fallen Zonen 4 bis 30 inklusive Vaultron ohne weiteres Farmen.

**Die Ursache ist ausgerechnet der A3-Schutz aus Umsetzungsentscheidung 50:**

> **Die Dämpfung skaliert den Ertrag pro Sieg – nicht die Siege pro Stunde.** Und die wachsen unbegrenzt, weil eine überlevelte Party einen frühen Kampf in ein bis zwei Sekunden beendet.

`Math.max(1, …)` garantiert 1 EXP pro Sieg. Bei ~1.800 Siegen/h sind das ~14.400 EXP in acht Stunden, während der ganze Aufstieg L2 → L20 nur rund 3.900 kostet. Ein **absoluter** Floor ist gegen eine unbegrenzte Siegrate wirkungslos.

### Fix: zwei Korrekturen, die zusammengehören (M15a)

1. **Harte Null jenseits `CUTOFF` Überschuss-Leveln** statt `Math.max(1, …)`. A3 wird vom **Plateau** getragen, nicht vom Floor – 1–2 Zonen zurück zahlt weiter voll. *Ein harter Deckel war am 30.07. verworfen worden; der Einwand („nimmt den unendlichen Zeit-Kanal") greift hier nicht, weil dieser Deckel weit jenseits des Rückfallbereichs sitzt.*
2. **`expectedLevelForZone` kalibrieren.** Sie liefert für Zone 30 **L15**, echtes Spiel endet bei **L21–23**. Das Plateau absorbiert deshalb einen Teil der **normalen Progression**, und ein knapper Cutoff würde reguläre Spieler treffen. Gemessen: Cutoff **6** ergibt 3 Sessions (Zonen 3, 15, 29); ohne Kalibrierung wären nur 8–10 gefahrlos, und die erfüllen B5 nicht.

### Drei weitere Notizen aus dem Review

- **B4s Haken hält, aber die Begründung war falsch.** Entscheidung 52 argumentiert „A2/C3 erzwingen einen Abschluss in endlicher Zeit" – das ist ein Argument *gegen* B4. B4 hält, weil **Niederlage nichts zahlt**: Wer gar nichts bedient, wird nie stärker.
- **Die Kriterien sind zum Messwert hin bewegt worden** (B2 4,5 → 5,5×, C3 18 → 20, A2 hält mit 19/20). Einzeln begründet, zusammen ohne Spielraum – die nächste Balance-Änderung, die V um 5 % verschiebt, bricht A2.
- **Der Review selbst hat einen Fehlschluss produziert** und ihn korrigiert: Er hielt A2 und die „Wochen"-Zeile zunächst für widersprüchlich und konstruierte daraus eine Grundsatzwahl. Falsch – V und K sind verschiedene Spieler, A2 begrenzt nur V. Festgehalten als Umsetzungsentscheidung 55, damit die nächste Session es nicht wiederholt. *Lehre: Bevor aus zwei Kriterien ein Widerspruch abgeleitet wird, prüfen, ob sie überhaupt dasselbe Verhalten beschreiben.*

**Reihenfolge unverändert:** M15a → M16 → M17 → Kapitel-2-Feinspec.

Geänderte Dokumente: `spec/feinspec-kapitel1.md` (§12), `spec/oekonomie-waehrungen.md` (§1a), `07_Umsetzungsentscheidungen.md` (M15a, Entscheidungen 53–55), dieses Dokument.

---

## ⚠️ Konzept-Review von M15a (31.07.2026) – Mechanismus steht, Beleg fehlt

**M15a ist umgesetzt** (Commit `59eb32b`): `EXP_DAMPING_CUTOFF = 6`, der Ertrag fällt jenseits von sechs Überschuss-Leveln hart auf 0 statt auf 1, Typ K ist als `simulateCamper` im Harness, Suite 116/116 grün.

**Eine Forderung des vorigen Reviews war falsch – die Umsetzung hat es korrekt widerlegt.** Ich hatte eine Kalibrierung von `expectedLevelForZone` verlangt, weil sie für Zone 30 L15 liefert, echtes Spiel aber bei L21–23 ende. Der Vergleichswert war die **alte, ungedämpfte Vor-M15-Baseline**; das gedämpfte Spiel endet bei **L20**, Überschuss also 2,5 gegen einen Cutoff von 6. Die Kalibrierung war unnötig, eine zusätzliche Konstante wäre unbegründete Komplexität gewesen. *Bleibt gültig aus jenem Befund: Reguläre Spieler farmen am Kapitelende bereits im gedämpften Bereich (~44 % Ertrag) – Plateau und normales Pacing hängen an derselben Konstante (Entscheidung 54b).*

**Aber B5 ist unbelegt: die Abnahme-Simulation hat zwei Fehler mit demselben Ursprung.** `frontier` wird auf die Zone gesetzt, die gerade **gescheitert** ist, während der Vorstoß der Folgesession bei `frontier + 1` beginnt:

- **Vaultron wird nie besiegt.** Scheitert der Vorstoß an Zone 30, campt die nächste Session dort (gemessen: 0 Siege, sie ist nicht gewinnbar), der Vorstoß startet bei 31, und `if (zone > 30) return success` meldet Erfolg. Die dritte „Session" ist Buchführung.
- **Wände lassen sich überspringen.** Ergibt das Campen keine Siege, rückt der Vorstoß trotzdem vor – sichtbar, sobald man das Spielverhalten nachbildet: Session 2 campt Zone 18 mit 0 Siegen, danach fallen 19–29.

**Ursache dahinter ist ein Fehlschluss in Entscheidung 58:** „ein Kampf bei gegebenem Party-Level ist entweder gewinnbar oder nicht". Seit M11 tragen HP/MP zwischen Kämpfen über – Determinismus heißt „gleicher **Zustand** → gleiches Ergebnis", und der Zustand enthält HP/MP. Der Code beweist es selbst, indem er nach jeder Niederlage `fullyHeal` aufruft. Und das Spiel behebt Erschöpfung **von allein**: Niederlage → Zeitstrafe → automatisches Gasthaus → Retry derselben Zone. `playChapter()` modelliert das korrekt, `simulateCamper` nicht.

**Einordnung: Test-Korrektheit, kein Design-Fehler.** Cutoff 6 und der Verzicht auf die Kalibrierung bleiben gültig. Beide Fehler lassen den Camper **schneller** erscheinen als er ist, der wahre Session-Wert liegt also vermutlich ≥ 3 und B5 dürfte halten – **belegt ist es nicht.** Zu korrigieren: `frontier` bleibt die letzte geschaffte Zone, die Wand muss tatsächlich gewonnen werden, Erfolg erfordert einen echten Sieg in Zone 30, Vorstoß mit Gasthaus-Retry wie im Spiel, und als Camping-Session zählt nur eine mit Siegen.

*Wiederkehrendes Muster, dritte Instanz nach dem 24.07. und M15:* **Ein Kriterium ist erst erfüllt, wenn die Simulation, die es prüft, das Spiel abbildet – nicht eine bequemere Variante davon.** Am 24.07. farmte der Harness an einer Zone, die es nicht gab; in M15 fehlte der Camper ganz; in M15a gewinnt er den Boss nicht, der als besiegt gilt.

Geänderte Dokumente: `spec/feinspec-kapitel1.md` (§12 B5), `spec/oekonomie-waehrungen.md` (§1a), `07_Umsetzungsentscheidungen.md` (M15a-Abnahme, Entscheidungen 59–60), dieses Dokument.

### Nachtrag derselben Session: der Kapitel-Boss wird Pflicht

**Beobachtung des Nutzers:** „Reunion wird angeboten, ohne dass der Boss besiegt ist." Zutreffend und bis dahin so gewollt – `canReunion = currentZone >= 30` ([gameStore.svelte.ts](../src/ui/gameStore.svelte.ts)), dokumentiert als Ausweg für Spieler, die die Wand nicht schaffen.

**Damit gab es zwei Ziellinien, und die Abnahmekriterien haben sie vermischt:** A1 sprach wörtlich von *erreichen*, B2/B4/B5 vom Boss, und `playChapter()` verlangt einen Sieg in jeder Zone – die Zielzeiten messen also die teurere Linie, während der Spieler früher aussteigen konnte.

**Entschieden: der Boss ist Pflicht.** Begründung des Nutzers: wer den Boss auch nach heftigem Leveln nicht tötet, ist nicht die Zielgruppe. **Das trägt**, weil das Ventil gegen Anti-Pattern #1 nicht die Umgehung der Wand ist, sondern **A2** – ≤ 20 Farm-Siege in der Vorzone machen jede Zone auch vollautomatisch gewinnbar. Der Ausweg war redundant und machte den Boss im Gegenzug zu *optionalem Inhalt*: Der effizienteste Camper-Pfad wäre gewesen, Zone 30 zu erreichen, sofort zu reunionen und Vaultron nie anzufassen.

**Das Prinzip, das die Entscheidung eigentlich trägt** (Formulierung des Nutzers, treffender als mein „A2 macht den Ausweg redundant"):

> **Zeit erzeugt Überlevelung, und Überlevelung senkt den erforderlichen Skill drastisch – aber nicht auf null.** Das *ist* die Skill↔Zeit-Wahlfreiheit. Sie gewährt nur keine vollständige Passivität; das tut kein Incremental, sonst müsste man es gar nicht spielen.

Die Wahlfreiheit geht also **nicht verloren** – ich hatte sie fälschlich als Kosten gebucht. Sie war nie „Wand überspringen", sondern „Wand billiger machen". Was bleibt, ist ein Minimum an Bedienung: **Zonenwahl.** Erforderlicher Kampf-Skill für den Boss = **null** (A2 garantiert Gewinnbarkeit für Typ V), erforderliche Bedienung = **Zonenwahl**. Können kauft **Tempo** (13,5 gegen 67 min), nicht **Zugang** – konsistent mit `gegner-encounter.md` §7 („grindbare Idle-Wand, kein Pflicht-Prüfstein").

⚠️ **Prüfstein dieser Entscheidung: A2 muss an Zone 30 halten.** Fällt sie, ist der Pflicht-Boss eine Wand ohne Ventil – exakt der Fehler vom 24.07.

*Verworfen (mildere Alternative):* Reunion beim Erreichen weiter erlauben, aber geringer bezahlen. Erhält den Notausgang, fügt eine zweite Ertragsrate hinzu, um eine Absicherung zu bewahren, die A2 unnötig macht – und lässt den Boss optional.

**Nebeneffekt:** Die zwei Ziellinien fallen zu einer zusammen, A1 ist auf „besiegen" korrigiert, und die `simulateCamper`-Korrektur ist damit eindeutig – *vorher* lag der gefundene Bug („Erfolg ohne Sieg in Zone 30") näher an der damals geltenden Reunion-Linie als meine eigene Korrekturforderung.

Umsetzung: `canReunion` verlangt einen Sieg in Zone 30 (eigenes Flag, nicht `currentZone > 30`), zusammen mit den `simulateCamper`-Korrekturen. Entscheidungen 61–62 in `07_Umsetzungsentscheidungen.md`.

---

## ✅ M16 und M17 erledigt – die Kette aus dem zweiten Playtest ist abgearbeitet (01.–02.08.2026)

**Damit stehen M15, M15a, M16, M17 – der letzte offene Umsetzungsschritt vor der Kapitel-2-Feinspec ist getan.**

### M16 – Zielwahl muss zählen (umgesetzt + reviewt)

Neues Monster **Bandbox** (Trait `heal`) in Zone 12/13, **Vaultron** mit temporärem, telegrafiertem **Konter-Fenster** (gedeckelt). Suite grün, alle §12-Kriterien A–D halten. Gemessene Laufzeiten: **M 13,8 / T 45,0 / V 69,1 min**.

**Die Abnahme wurde ersetzt, nicht erfüllt.** Ursprünglich sollte „der Abstand M↔T wächst messbar" den Meilenstein abnehmen. Das Maß passt nicht zum Meilenstein: M↔T misst den Skill-Ertrag über **alle 30 Zonen**, M16 ändert davon zwei Encounter – die Kennzahl kann konstruktionsbedingt nur um wenige Prozent wandern (gemessen +1 min, nicht monoton, also kein Beleg). Ein Kriterium, das nur durch Drehen am schärfsten nichtlinearen Hebel zu erfüllen wäre, erzeugt Druck genau gegen die Leitlinie „fordernd, nicht strafend". Neue Abnahme: **zwei benannte Encounter**, in denen Zielwahl über Ausgang oder Dauer entscheidet, je mit einer Antwort, die nicht ausgehen kann. Der Regressionstest prüft beide Encounter jetzt direkt.

**Analyse ist keine Kapitel-1-Mechanik mehr.** Das Bestiarium beschreibt die Gegner-*Art*, nicht die zonen-skalierte Instanz, und enthält deshalb **keine absoluten Zahlen** – die einzige exklusive Information (Heilmenge/Takt) war genau so eine. Analyse wird in **Kapitel 2 mit Materia** eingeführt (`spec/kampf-analyse-shock.md` §5); das Einführungs-Popup entfällt (13 statt 14 Einträge).

### M17 – Mechanik-Einführung: Popup + Codex (umgesetzt)

13 blockierende Einführungs-Popups mit Pause, Selbstvorstellungen der vier Figuren (Claude vor dem allerersten Kampf), **Codex** zum Nachlesen, ab Durchlauf 2 stumm. Keine Zahlen in Erklärtexten. Save-Migration v5→v6. Entscheidungen 81–89.

### Drei Funde aus dem M17-Playtest, in der Spec gelöst

1. **Special-Namen waren wörtliche FF7-Limit-Break-Namen** – falsche Kategorie (das Popup lehrt „Special ≠ Limit" mit einem Limit-Namen) und Verstoß gegen die Rahmenentscheidung „keine Kopien der Originale". Jetzt **Overcommit** (Claude) und **Second Wind** (Air is…); die Tabelle in feinspec §6.1 ist die normative Quelle.
2. **Limit-Aufladung ist jetzt relativ** (60 · Schaden/maxHP des Ziels ausgeteilt, 80 · Schaden/maxHP selbst erlitten) statt absoluter Raten. Ursache war **Drift**: Schaden und HP skalieren mit Zone und Level, `LIMIT_MAX` bleibt 100 – an Blandzilla feuerte das Limit als allerletzter Treffer. Verworfen: bloß die Raten anheben (behebt die Drift nicht).
3. **Der Heiler-Gegner heilt in Schüben** (3,6× ATK alle ~6 s statt 1,2× alle ~2 s, gleiche Heilung pro Sekunde) plus Telegraf und Heilzahl. Das Rinnsal war gegen die gleichzeitig fallende HP-Leiste unsichtbar.

### Leitfaden-Abgleich: die Spec sagte an sieben Stellen den Vor-Entscheidungs-Stand

Ein Review hat jede `spec/*.md` gegen `02_Leitfaden` und `03_Konzept` geprüft. Die bewussten Abweichungen tragen alle ihre Begründung – **was fehlte, war die Nachführung**: „Fünf Währungen" nach dem Gil-Aus, der gestrichene Angriffs-Refund noch als MP-Kanal 3, Reunion ohne Boss-Pflicht, Analyse als Kapitel-1-Mechanik an fünf Stellen, „nie auf null" als Dämpfungsregel trotz harter Null aus M15a, die Limit-Raten als offener Knopf, und `05_Architektur` mit der Offline-Projektion als Live-System. **Keine Design-Änderung – die Entscheidungen gab es alle schon.**

### Drei Regeln, die nirgends standen (Nutzer-Entscheidungen)

> **Ventil, geschärft:** Ein Ventil verlangt nicht, dass **überall** etwas fließt, sondern dass es überall eine **Handlung** gibt, nach der wieder etwas fließt. Ein völlig untätiger Spieler, der auf 0 EXP läuft, ist in Ordnung – seine Handlung ist die **Zonenwahl**. Gebunden an Kriterium A2.

> **Gate-Regel:** Ein Gate muss nicht passiv erreichbar sein, aber passiv **leichter** werden. Können kauft Tempo, Zeit kauft Zugang. Deshalb darf die Strecke vor einem Gate leer sein – dort wandelt sich Zeit in Zugang, und ein zusätzlicher Takt würde das nur verdecken. **Bedingung: die Umwandlung muss lesbar sein**, sonst ist eine korrekte Wand nicht von Anti-Pattern #1 zu unterscheiden. Beantwortet, warum Zone 20–29 keine neue Mechanik tragen.

> **Essenz-Ertrag skaliert mit erreichtem Fortschritt, nicht mit verbrachter Zeit.** Tiefer kommen zahlt mehr, länger bleiben nicht – sonst ist Reunion keine Timing-Entscheidung mehr, sondern eine Optimierungsaufgabe mit einer richtigen Antwort. Das ist die Exklusivitätsregel, auf die **Quelle** statt auf die Senken angewandt.

### Zwei Lesbarkeits-Fragen geschlossen, T′ ebenfalls

- **Erschöpfte Zonen werden markiert** – binär, in der Zonenwahl *und* an der laufenden Zone, plus eine einmalige Meldung im Moment des Kippens. Bis dahin war die EXP-Dämpfung vollständig unsichtbar: Der Spieler kämpft, gewinnt und bekommt nichts – die eine Stelle, an der ein korrekt arbeitendes System wie ein Defekt aussieht. **Bewusst binär statt abgestuft**: Eine Skala macht die Zonenwahl zur Ertragsmaximierung statt zur Entscheidung. Die Anzeige hängt am tatsächlichen Ertrag, nicht an `EXP_DAMPING_CUTOFF`, überlebt also jedes Neu-Balancieren.
- **Bester bisheriger Versuch am Gate** wird nach einer Niederlage gezeigt. Rein rückblickend, sagt also nichts voraus und entwertet das Versuchen nicht – erfüllt die Lesbarkeitsbedingung der Gate-Regel. Reset bei Reunion.
- **Heilen ist ein gültiger Zug, kein falscher.** HP/MP tragen über, also ist ein voll geheilter Versuch ein **anderer** Kampf, nicht derselbe wiederholt. Was daraus entsteht, ist eine **Eskalationsleiter, billig vor teuer**: heilen, dann zurückfallen und farmen. Der Determinismus begrenzt die billige Sprosse von selbst – ein zweiter voll geheilter Versuch läuft bitgleich.
- **T′** (schwacher Spieler) folgt aus dieser Leiter und ist **zusammensetzbar statt geraten**: T plus ein bis zwei Gasthaus-Zyklen je Wand plus Farmzeit über das Plateau. Alle drei Größen sind gemessen oder messbar. Damit ist die letzte offene §12-Frage geschlossen.

### ⚠️ Spec-Rückstand: die Konzept-Runde hat kein `src/` angefasst → **M18**

Die drei Commits oben sind reine Doku-Commits. **Sieben Entscheidungen sind im Spiel noch nicht vorhanden**, fünf davon für den Spieler unmittelbar sichtbar: Special-Namen (auch im Popup-Text), relative Limit-Aufladung, Heiler-Schübe mit Telegraf, Markierung erschöpfter Zonen, bester Versuch am Gate, Bestiarium-Zahlen, M13-Popup-Skalierung. **Ein Durchlauf vor M18 zeigt teilweise die alten Fehler statt der Korrekturen.** Umfang und Abnahme: **M18** in `06_Implementierungsplan_Kapitel1.md`; danach der menschliche Durchlauf Zone 1 → 30 → Reunion.

### Offene Reste aus Kapitel 1 (keine Blocker für Kapitel 2)

- **§7.4 (Pacing-Tabelle) ist weiterhin als ungültig markiert.** Die Zielzeiten M/T/V sind gemessen, aber die Tabelle ist nie neu geschrieben worden.
- **M13-Nachzieher:** Das Aktions-Popup skaliert nicht mit `s` und verdeckt bei kleiner Bühne 34 % der handelnden Figur. Regel steht in `spec/ui-layout.md`, Umsetzung steht aus.
- **Umsetzungs-Rückstand:** Die Zeile „7 HP / ~2.0s" aus `ui/BestiaryModal.svelte` entfernen (Bestiarium führt keine absoluten Zahlen).
- **Mobil-Portrait-Layout** (< ~700 px) weiterhin nicht unterstützt, laut `ui-layout.md` „Offene Punkte" auch noch nicht entschieden.

### Nächster Schritt: Kapitel-2-Feinspec

Materia/Slots/AP/Magie und der programmierbare Gambit-Editor. Die Vorbedingung aus `06_Implementierungsplan_Kapitel1.md` („erst wenn M15–M17 stehen und Kapitel 1 nachweislich durchspielbar ist") ist erfüllt.

Geänderte Dokumente dieser Runde: `03_Konzept_Gerüst.md`, `05_Architektur.md`, `spec/abnahme-kapitel1.md`, `spec/encounter-zyklus1.md`, `spec/feinspec-kapitel1.md`, `spec/gambits.md`, `spec/gegner-encounter.md`, `spec/kampf-analyse-shock.md`, `spec/materia.md`, `spec/niederlage-offline.md`, `spec/oekonomie-waehrungen.md`, `spec/prestige-reunion.md`, `spec/progression-regionen.md`, `spec/ui-layout.md`, dieses Dokument.

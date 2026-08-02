# 06 – Implementierungsplan Kapitel 1

**Status:** Meilenstein-Plan für die Umsetzung durch Claude Code.
**Rahmen:** `05_Architektur.md` (Stack/Struktur), `spec/feinspec-kapitel1.md` (Formeln/Schemas/Content, verbindlich für alle Meilensteine).
**Prüfinstanz:** `02_Leitfaden_Kernmechaniken.md` – gilt weiter für jede Design-relevante Entscheidung während der Umsetzung, nicht nur für die Planung.
**Geltungsbereich:** Ausschließlich **Kapitel 1** (Zone 1–30, bis zur 1. Reunion) – deckungsgleich mit `feinspec-kapitel1.md` §0. Kapitel 2+ (Materia, Gambit-Editor, Magie) ist bewusst **nicht** Teil dieses Plans.

## Wie dieser Plan zu lesen ist

Jeder Meilenstein ist als eigenständige Arbeitseinheit gedacht (in etwa PR-Größe), baut auf dem vorherigen auf und nennt genau die Doku-Abschnitte, die für ihn zu laden sind (Kontext schlank halten, gemäß CLAUDE.md-Ladekonvention). M0–M4 sind **unsichtbare** Fundament-Arbeit (Engine/Save, ohne UI, aber vollständig testbar); M5–M9 sind **spielbare Vertikal-Slices**, die exakt dem in `feinspec-kapitel1.md` §1/§7 beschriebenen Spieler-Rampup folgen (Klicker → Auto-Attack → Analyse → Shock → volle Party → Reunion) – der Plan spiegelt damit bewusst den Onboarding-Rampup des Spiels selbst.

---

## Übersicht

| # | Meilenstein | Sichtbarer Output | Kern-Referenzen |
|---|---|---|---|
| M0 | Projekt-Scaffold & Deploy-Pipeline | Platzhalterseite live auf GitHub Pages | `05_Architektur.md` §2/§3/§9 |
| M1 | Core-Formeln & Typen | — (nur Tests grün) | feinspec §3, §4.1–4.3 |
| M2 | Content-Layer | — (nur Tests grün) | feinspec §6 |
| M3 | Headless Tick-Loop & Default-Gambits | Konsolen-Simulation reproduziert feinspec-§7.4-Pacing | feinspec §4.7, §5 |
| M4 | Save-System & Offline-Projektion | — (nur Tests grün) | feinspec §4.6, Architektur §5/§6 |
| M5 | Region 1a – Klicker-Auftakt | Zone 1–2 spielbar (Claude solo, manuell) | feinspec §7.1 (Schritt 1), Mockup 01 |
| M6 | Region 1b – Waffe, Auto-Attack, Limit | Region 1 komplett spielbar (Zone 1–8, Miniboss) | feinspec §7.1 (Schritte 2–5) |
| M7 | Region 2 – Analyse/Bestiarium | Region 2 komplett spielbar (Zone 9–18, Gate) | feinspec §6.3 (R2), Mockup 03 |
| M8 | Region 3 – Volle Party, Shock, manuelle Steuerung | Region 3 komplett spielbar (Zone 19–30, Kapitel-Boss) | feinspec §5.1, §7.2/§7.3, Mockup 02/05 |
| M9 | Niederlage-Loop, Offline-UI, 1. Reunion | Kompletter Kapitel-1-Loop inkl. Reunion spielbar & speicherbar | feinspec §7.3, Mockup 04, `prestige-reunion.md` |
| M10 | Härtung & Politur | Release-reifer Kapitel-1-Build | siehe M10 unten |
| **M11** | **Ventil-Kette & Ressourcen-Ökonomie** | **Kapitel 1 erstmals von einem Menschen durchspielbar** | feinspec §3.4/§3.5/§3.8, `niederlage-offline.md` |
| M12 | Region-Kulissen: Baukasten & Neuauflage | Drei Kapitel-1-Kulissen im neuen Format, reproduzierbar | `spec/regionen-kulissen.md` |
| M13 | Bühnen-Framework in der Stage | Kampfzone proportionsstabil bei jeder Fenstergröße | `spec/ui-layout.md` „Bühnen-Framework" |
| M14 | Gruppenlevel statt Charakter-Level | Neuzugänge sind ab dem ersten Kampf voll einsatzfähig | `spec/stats-kampfwerte.md` §4.1, feinspec §3.6/§3.7 |

---

## M0 – Projekt-Scaffold & Deploy-Pipeline

**Ziel:** Aus dem reinen Doku-Repo ein lauffähiges, deploybares Grundgerüst machen.

- Vite + Svelte + TypeScript aufsetzen (`package.json`, `tsconfig.json`, `vite.config.ts` mit `base: '/IncrementalFantasy/'`).
- Ordnerstruktur exakt nach `05_Architektur.md` §3 anlegen (`/src/core`, `/src/content`, `/src/save`, `/src/ui`, `/src/assets`, `/tests`).
- Vitest einrichten.
- `.github/workflows/deploy.yml`: `npm ci` → `npm run build` → `actions/deploy-pages` (Architektur §9).
- Platzhalter-Startseite („IncrementalFantasy – in Entwicklung").

**Abnahme:** `npm run dev` läuft lokal; Push auf `main` deployt automatisch und `https://telosnox.github.io/IncrementalFantasy/` zeigt die Platzhalterseite.

---

## M1 – Core-Formeln & Typen

**Ziel:** Der mathematische Kern aus `feinspec-kapitel1.md` §3 als reine, getestete TypeScript-Funktionen – ohne jede UI-Abhängigkeit.

- `src/core/entities.ts`: Typen für Character/Monster/Encounter/Weapon/Bestiary-Eintrag (feinspec §4.1–4.5).
- `src/core/formulas.ts`: Schaden (§3.1), ATB-Takt (§3.2), Shock-Aufbau (§3.3), Limit-Ladung (§3.4), MP (§3.5), EXP/Gil (§3.6), Zonen-Skalierung (§3.7).
- Jede Funktion referenziert im Kommentar die Formel-Nummer aus der Feinspec.
- Unit-Tests, die die konkreten Beispielrechnungen aus der Feinspec exakt nachrechnen (z. B. §3.1: Claude L1 ATK 14 vs. Blando DEF 2 → 12 Schaden/Treffer, 4 Treffer, 8 s).

**Abnahme:** Alle Tests grün; Testfälle decken mindestens ein Zahlenbeispiel pro Formel aus der Feinspec ab (keine erfundenen Werte).

---

## M2 – Content-Layer

**Ziel:** Die Balance-Tabellen aus `feinspec-kapitel1.md` §6 als typisierte Konstanten – 1:1-Abschrift, keine Interpretation.

- `src/content/characters.ts` (§6.1: Claude/Barrel/Tofa/Air is... inkl. Specials).
- `src/content/monsters.ts` (§6.2: 7 reguläre Monster + 3 Bosse/Gates).
- `src/content/zones.ts` (§6.3: Zonen-Encounter Z1–Z30 inkl. `isGate`).
- `src/content/weapons.ts` (§6.4: Waffen-Tier-Formel).

**Abnahme:** Stichprobenartiger Soll/Ist-Abgleich einzelner Werte gegen die Markdown-Tabellen (z. B. Vaultron-Stats, Blandzilla-Miniboss) – 1:1-Treffer.

---

## M3 – Headless Tick-Loop & Default-Gambits

**Ziel:** `battleTick` aus feinspec §5 lauffähig machen und **ohne Rendering** einen kompletten Kapitel-1-Durchlauf simulieren können.

- `src/core/tick.ts`: Referenz-Loop 1:1 nach dem Pseudocode in §5 (inkl. `awaitingPlayerChoice`-Pause-Guard, Poison-Tick, Enemy-Traits `bomb`/`boss`/`poison`/`drain`).
- `src/core/gambits.ts`: die 6 fest verdrahteten Default-Regeln aus §4.7 inkl. Zielwahl-Fallback.
- Ein Test-Harness, das Zone 1 → Zone 30 headless durchspielt (inkl. Niederlage-Retry-Schleife, `RETRY_PENALTY`) und die Pacing-Kennzahlen aus §7.4 reproduziert (Kampfzeit je Region, Level-Spanne, Retry-Zahl an den drei Wänden).

**Abnahme:** Die headless Simulation liefert Werte in der Größenordnung der Referenztabelle §7.4 (z. B. Region 1 ≈ 1,9 min, Kapitel-Wand Z30 ≈ 6 Retries) – das ist der wichtigste Qualitäts-Gate dieses Plans, weil er beweist, dass die TS-Engine dieselbe simulationsvalidierte Baseline trifft wie `sim_chapter1.py`.

---

## M4 – Save-System & Offline-Projektion

**Ziel:** Persistenz gemäß `05_Architektur.md` §5/§6, unabhängig von der UI testbar.

- `src/save/schema.ts` (SaveState nach feinspec §4.6 + `version`-Feld).
- `src/save/serialize.ts` (BigNumber-Felder via `break_eternity.js`-Strings).
- `src/save/storage.ts` (localStorage-Zugriff, Autosave-Scheduler: Intervall, `visibilitychange`, `pagehide`).
- `src/save/migrate.ts` (Migrations-Grundgerüst, auch wenn v1 nur eine Version hat).
- `src/core/offline.ts`: der Projektionsrechner aus Architektur §5 (ein Zonen-Durchlauf simulieren → `timePerClear`/`rewardPerClear` → `repeats` aus verstrichener Zeit hochrechnen, `OFFLINE_CAP`/`OFFLINE_RATE` anwenden).

**Abnahme:** Round-Trip-Test (serialize→deserialize→identischer State) grün; ein Offline-Test simuliert „3 h weg an einer schaffbaren Zone" und „3 h weg an einer unschaffbaren Wand" und prüft, dass Fall 2 keinen Fortschritt, aber auch keinen Crash erzeugt (deckt `niederlage-offline.md` §3 ab).

---

## M5 – Region 1a: Klicker-Auftakt

**Ziel:** Erster spielbarer, wenn auch minimaler Screen – Claude solo gegen Blando, rein manuell.

- Svelte-Grundlayout nach `ui-layout.md`-Platzbudget (Stage/Bottom/Sidebar-Rahmen, auch wenn Sidebar noch leer).
- Charakter-Panel (HP/ATB), Gegner-Sprite, „Attack"-Button.
- Core-Loop an einen Svelte-Store angebunden; UI liest nur, schreibt nie direkt in `/core`-State.
- **Kein Auto/Manual-Schalter und keinerlei Modus-Text** in diesem Screen (auch nicht als reiner Hinweis) – vor Zone 5 gibt es nichts zu automatisieren, ein sichtbarer Modus-Hinweis würde die Automatik spoilern (feinspec §1.1, `gambits.md` §6).

**Abnahme:** Zone 1–2 im Browser spielbar wie in feinspec §7.1 Schritt 1 beschrieben (alle 2 s ein Treffer à 12, Blando fällt nach 8 s) – optisch grob vergleichbar mit Mockup `01_region1_klicker.png`; kein Modus-Indikator sichtbar.

---

## M6 – Region 1b: Waffe, Auto-Attack, Limit, Miniboss

**Ziel:** Region 1 vollständig (Zone 1–8).

- Waffenkauf (Gil-Sink) → Special + MP-Leiste werden sichtbar (Zone 3).
- Auto-Attack-Regel schaltet sich frei (Zone 5), `controlMode`-Konzept wird technisch relevant. **Hier erscheint erstmals der Auto/Manual-Schalter je Figur** (vorher bewusst nicht vorhanden, s. M5).
- Limit-Leiste + Zünden-Aktion.
- Blandzilla-Miniboss (Zone 8).
- **Freischaltungs-Hinweis (Unlock-Callout)** bei jedem Rollout-Flag-Wechsel (mind. Auto-Attack-Freischaltung Zone 5), s. `ui-layout.md`.

**Playtest-Korrekturen (nach erster Preview, vor Abnahme):**

1. **Sprite-Größe:** Figuren/Monster 2× größer rendern (Display-Zoom, s. `ui-layout.md` „Battle-Stage & Standfläche" und `feinspec-kapitel1.md` §8) – war ein offener Parameter, jetzt entschieden.
2. **Aktions-Button/Popup vor ATB-Bereitschaft:** ein dauerhaft sichtbarer, grau ausgegrauter „Attack"-Button während des ATB-Ladens ist **falsch** – vor `atb >= 1.0` darf **nichts** von der Aktionswahl sichtbar sein (Bug-Fix, kein „kommt später", s. `ui-layout.md` „Charakter-Steuerung: Panels & Aktions-Popup").
3. **Automatik-Freischaltung ohne Ankündigung:** das fehlende Gambit-UI ist **korrekt** (Gambit-Editor bleibt bis 1. Reunion bewusst unsichtbar), aber der Übergang braucht den neuen **Freischaltungs-Hinweis** (Punkt oben), sonst wirkt der Moment verwirrend statt als Belohnung.

**Abnahme:** Region 1 end-to-end spielbar exakt entlang feinspec §7.1 (Schritte 2–5); Level Claude ≈ 6 nach dem Miniboss.

---

## M7 – Region 2: Analyse & Bestiarium

**Ziel:** Region 2 vollständig (Zone 9–18), inkl. neuem Roster-Mitglied Barrel.

- Analyse-Trigger (erster Sieg über eine Art → automatischer Bestiarium-Eintrag).
- Bestiarium-UI-Karte (Mockup `03_analyse_bestiarium.png`) inkl. Kindlebale-Feuer-Schwäche als reiner Teaser (`weaknessUsable:false`).
- Barrel + Suppress-Special.
- Fort-Knoxious-Gate (Zone 18).

**Abnahme:** Region 2 end-to-end spielbar; Bestiarium zeigt nach Erstsieg korrekt Grundstats + Schwäche-Teaser für jedes der Region-2-Monster.

**Umsetzungsentscheidungen (M7): Nr. 1–7 → [`07_Umsetzungsentscheidungen.md`](07_Umsetzungsentscheidungen.md)**

---

## M8 – Region 3: Volle Party, Shock, manuelle Steuerung

**Ziel:** Region 3 vollständig (Zone 19–30) – der komplexeste Meilenstein, da hier alle Kapitel-1-Systeme zusammenlaufen.

- Tofa + Air is... kommen dazu (volle 4er-Party).
- Shock-Ring-Anzeige (Amber-Aufbau/Gold-Fenster, füllt sich von unten, Bruch-Symbol bei 100 %) nach `kampf-analyse-shock.md` §6.
- `controlMode`-Umschalter je Figur + Aktions-Popup (FF7-Menübox, Wait-Modus/globale Pause) nach feinspec §5.1 (Mockup `05_aktions_popup.png`).
- Telegrafierte Gegner-Aktionen (Shortfuse-Zündung, Vaultron-AoE).
- Vaultron-Kapitel-Boss (Zone 30).

**Abnahme:** Region 3 end-to-end spielbar wie in feinspec §7.2 (Shock-Kampf-Ablauf) und §7.3 (Kapitel-Wand) beschrieben; Popup-Flow entspricht exakt §5.1 (Uhr pausiert vollständig währenddessen, inkl. Shock-Timer).

**Umsetzungsentscheidungen (M8): Nr. 1–8 → [`07_Umsetzungsentscheidungen.md`](07_Umsetzungsentscheidungen.md)**

---

## M9 – Niederlage-Loop, Offline-UI, 1. Reunion

**Ziel:** Die Klammer um den gesamten Kapitel-1-Loop schließen.

- Niederlage-UI: Zeitstrafe sichtbar, Auto-Retry ohne Verlust (`niederlage-offline.md` §1).
- „Willkommen zurück"-Screen bei Wiedereinstieg, der den in M4 gebauten Offline-Projektionsrechner sichtbar macht (Ertrag seit letztem Besuch).
- Reunion-Screen (Mockup `04_reunion.png`): Reset-/Persistenz-Listen, Reunion-Essenz-Ertrag, Freischaltung von programmierbaren Gambits + erstem Boost (`prestige-reunion.md`).

**Abnahme:** Ein kompletter Durchlauf Zone 1 → Zone 30 → Reunion ist spielbar; Speichern, Browser schließen, wieder öffnen setzt exakt an der gespeicherten Stelle fort (inkl. korrekt berechneter Offline-Ernte).

**Umsetzungsentscheidungen (M9): Nr. 1–8 → [`07_Umsetzungsentscheidungen.md`](07_Umsetzungsentscheidungen.md)**

---

## M10 – Härtung & Politur

**Ziel:** Von „funktioniert" zu „vorzeigbar".

- Save-Export/Import (Architektur §6, Sicherheitsnetz).
- Fehlerbehandlung korrupter/fremder Saves (Warnung statt Datenverlust).
- Playtest-Debugwerkzeug gegenprüfen (Architektur §6a, „Reset save"-Button): vor echtem Publikum hinter `import.meta.env.DEV` verstecken oder entfernen.
- MegaCorp-Kulisse rechts ausrichten/verbreitern (bekannte Warnung aus feinspec §8).
- Cross-Browser-Kurzcheck (Chrome/Firefox/Safari, Desktop + mobil falls Layout es zulässt).
- Performance-Check des Live-Loops über eine längere Session (kein Speicher-/Timer-Leck durch wiederholtes `visibilitychange`).

**Abnahme:** Subjektiv „bereit zum Zeigen" – erreicht. Kapitel 1 (M0–M10) ist komplett: Zone 1 → 30 → Reunion spielbar, speicherbar, exportierbar/importierbar, ohne bekannte Blocker.

**Umsetzungsentscheidungen (M10): Nr. 1–6 → [`07_Umsetzungsentscheidungen.md`](07_Umsetzungsentscheidungen.md)**

---

## M11 – Ventil-Kette & Ressourcen-Ökonomie (aus dem ersten Playtest)

**Ziel:** Kapitel 1 von „durchgespielt laut Simulation" auf „von einem Menschen durchspielbar" bringen. **Dieser Meilenstein ist ein Blocker für alles Weitere** – der erste Playtest kam über Zone 14 nicht hinaus, Region 3 war unerreichbar.

**Kern-Referenz:** `spec/feinspec-kapitel1.md` §3.4/§3.5/§3.8 sowie `spec/niederlage-offline.md` (beide vollständig revidiert). Prüfinstanz wie immer `02_Leitfaden_Kernmechaniken.md` – hier besonders Anti-Pattern #1 und #5, die beide **verletzt waren**.

**Der Befund in einem Satz:** In einer deterministischen Engine ohne Weg zurück in eine geschaffte Zone und ohne Ertrag bei Niederlage ist jede verlorene Zone ein permanenter Totalstopp – und die simulationsvalidierte Baseline hat das nicht gezeigt, weil der Test-Harness eine Grind-Mechanik unterstellt, die es im Spiel nie gab.

Umzusetzen sind sechs zusammenhängende Änderungen:

1. **Zonen-Rückkehr** (feinspec §3.8a): freie Anwahl jeder geschafften Zone, `maxZoneReached` im SaveState (§4.6), Auswahl-UI. Das ist das eigentliche Ventil.
2. **HP/MP-Übertrag** (§3.5/§4.1): `createPartyUnit` darf die Kampfeinheit **nicht** mehr pro Zone frisch aus dem Charakter bauen – HP/MP kommen aus dem Save, nur `atb`/`limit` werden zurückgesetzt. Dieselbe Codezeile hat bisher HP, MP *und* Limit gleichzeitig entwertet.
3. **MP-Kanal 3 streichen** (§3.5): kein `+2 MP pro Angriff` mehr; Special-Kosten in §6.1 neu herleiten.
4. **Gasthaus** (§3.8b): vorab anmeldbar, greift nach Kampfende, bei Niederlage automatisch; Totzeit + Rate auf HP und MP gleichzeitig; Kosten ausschließlich Zeit.
5. **Niederlage heilt nicht** (§3.8c) – sonst ist absichtliches Sterben die optimale Strategie.
6. **Limit als Esper-Modell** (§3.4): `limitAllowed` als Datenfeld am Encounter, in Kapitel 1 an den drei Gates gesetzt; Leiste startet dort bei 0, kein Übertrag.
7. **Zielwahl als System** (§3.9 + `gegner-encounter.md` §6a): Gegner greifen die Figur mit den höchsten aktuellen HP an; die Party bekommt ein **gruppenweites Fokusziel** (gilt auch für Auto-Figuren, **Reset zu Beginn jedes Kampfes**, gehört in den Kampf- und *nicht* in den Save-Zustand). Ohne Fokus zielt Auto auf den **nächststehenden** Gegner; die alte `bomb`/`drain`-Priorität entfällt – **Shortfuse detoniert im reinen Auto-Betrieb künftig immer**, das ist beabsichtigt. Bei Specials wählt der **Spieler** pro Einsatz, **vorausgewählt ist das Fokusziel** – eine Regel ohne Ausnahmen; die vier gewachsenen Heuristiken im Code (Claude → stärkstes, Tofa → schwächstes, Barrel → schnellstes, Limit → stärkstes) werden dadurch **ersetzt, nicht ergänzt**. Fokusziel **und** das nächste Ziel jedes Gegners werden markiert – ohne die Markierung bleibt Defend eine Rate-Aktion.
   **Separat davon:** `resolveOptimalAction` (die Referenz-Policy für Spielertyp M, nur in der Simulation) *darf* klug zielen und soll es auch – dort ist Barrels Kriterium von „SPD ≥ 140" auf **Durchsatz (≈ ATK · SPD)** umzustellen, weil die SPD-Schwelle keinen der drei Bosse erfasst (alle SPD 70–90) und M dadurch an genau den Gates künstlich geschwächt wäre, an denen §12 B2 den Abstand misst.

**Zusätzlich abzuräumen:**

- **Offline-Progress stilllegen** (§3.8e): `OFFLINE_RATE`/`OFFLINE_CAP` und der „Willkommen zurück"-Screen entfallen. `core/offline.ts` **nicht löschen** – der Projektionsrechner bleibt als Balance-Werkzeug wertvoll, er wird nur vom Spielerpfad abgehängt.
- **Save-Migration** für `maxZoneReached`, `inn` und die entfallenen `offline`-Felder (`save/migrate.ts` existiert seit M4 genau dafür).
- **`tests/chapter-playthrough.test.ts` neu aufsetzen:** Der Harness muss die Zonen-Rückkehr als *Spielerentscheidung* modellieren (welche Zone farmt ein vernünftiger Spieler wie lange?), nicht als impliziten Automatismus bei jeder Niederlage. Das war die Ursache dafür, dass die Baseline ein anderes Spiel gemessen hat als das ausgelieferte.

**Abnahme:** Die vollständige Kriterienliste steht in **feinspec §12** und ist gegen drei Spielertypen zu prüfen – **M** (manuell), **T** (nur Fokusziel pro Kampf), **V** (gar kein Eingriff). Die wichtigsten Gates daraus:

- **A2 – das Ventil, formal:** Für jede Zone Z gibt es eine Zahl N ≤ 20 wiederholter Siege in Z−1, nach der Z auch für Typ **V** gewinnbar ist. Dieser Test ersetzt die frühere Behauptung „Grind-Kämpfe leveln weiter".
- **B1/B2 – Abstand:** Gesamtdauer strikt **M < T < V**, im Korridor T ≈ 1,3–2,0× und V ≈ 2,5–4,0× von M.
- **C4 – Wände sitzen an Gates:** Keine reguläre Zone darf mehr Retries kosten als das nächstfolgende Gate (der Zone-6-Fehler).
- **E1 – der Mensch:** Eine Person spielt Zone 1 → 30 → Reunion ohne Debug-Eingriffe durch, ohne dauerhaft festzustecken.

**Zur Balancierung selbst:** Sie findet **in der Umsetzung gegen die TypeScript-Engine** statt, nicht vorab in einer zweiten Simulation. `sim_chapter1.py` verliert seinen Status als Balance-Referenz (feinspec §9) – die Doppelung „Python-Modell + TS-Engine" war die strukturelle Ursache dafür, dass die alte Baseline unbemerkt ein anderes Spiel maß. Eine Engine, eine Wahrheit. Die Kriterien **F1–F3** sichern genau das ab.

Erst nach bestandener Liste wird die Pacing-Tabelle in feinspec §7.4 ersetzt; bis dahin existiert bewusst **keine** gültige Baseline.

**Warnung zum Gesamtpaket:** M11 stapelt drei Verknappungen übereinander (HP trägt über, MP wächst nicht mehr im Kampf, Heilung kostet Zeit). Jede für sich ist begründet, zusammen können sie deutlich härter ausfallen als geplant. Alle Zahlen sind als **Startwerte** zu behandeln; die Zeitkosten (Zeitstrafe + Gasthaus-Totzeit) müssen sich ohne Offline-Progress *gespielt* vertretbar anfühlen, nicht nur gerechnet.

**Umsetzungsentscheidungen (M11): Nr. 1–19 → [`07_Umsetzungsentscheidungen.md`](07_Umsetzungsentscheidungen.md)**

---

## M12 – Region-Kulissen: Baukasten & Neuauflage

**Ziel:** Die Kulissen von drei handgeschriebenen Zeichenfunktionen auf ein reproduzierbares Werkzeug umstellen und im Format des Bühnen-Frameworks neu erzeugen.

**Kern-Referenz:** `spec/regionen-kulissen.md` (führend, inkl. Leitmotiven und Format §9), `spec/ui-layout.md` (Bühnen-Framework, liefert die Geometrie), `spec/charaktere-visuals.md` (Stil-Regeln). Prüfinstanz wie immer `02_Leitfaden_Kernmechaniken.md`.

**Der Befund in einem Satz:** `docs/spec/assets/generate_regions.py` enthält je Region **eine handgeschriebene Funktion aus rohen Koordinaten** – bei drei Kulissen tragbar, bei fünfzehn nicht, und jede Umgestaltung ist Zahlenraten ohne visuelles Feedback.

Umzusetzen:

1. **Bausteinbibliothek** statt Primitiv-Aufrufe: benannte, parametrierte Elemente (`tower`, `stack`, `pipe_run`, `awning_row`, `window_grid`, `crag`, `foliage`, `sign`, `ground_texture`) mit eingebauten Stil-Regeln (Iso-Kippung, Licht von oben-links, zwei Helligkeitsstufen je Fläche).
2. **Regionsdefinition als Rezeptur:** Palette + Liste von Bausteinen mit Position/Größe, kein Zeichencode je Region. Das Bodenband entsteht **generisch** aus Palette und Bodentextur, nicht je Region neu.
3. **Neues Format** (`regionen-kulissen.md` §9): Nenn-Box 168×96, Canvas 224×128 mit Bleed (28 px seitlich, 32 px oben, unten bündig), Bodenfläche in den unteren 32 px der Nenn-Box.
4. **Die drei Kapitel-1-Kulissen neu erzeugen** nach ihren Leitmotiven (§6): Reactor Row / Bargain Bazaar / MegaCorp Tower. **Neu erzeugen, nicht nachbearbeiten** – Format, Bodenband und Farbwahl sind gleichzeitig betroffen.
5. **Prüfmodus:** Rendern mit eingeblendeten Framework-Linien (`G`, `B₁`, `B₂`, Bleed-Grenzen), damit Verstöße vor der Übernahme auffallen.
6. **Rechnerische Gegenprobe:** Signalfarben-Sperre (§4) und Kontrast-Budget (§5) automatisch prüfen, statt sie dem Auge zu überlassen.
7. **Übernahme nach `src/assets/regions/`** – bisher liegen dort die `_480.png`-Varianten; welche Auflösung das Spiel nach dem Framework tatsächlich braucht, entscheidet sich mit M13 (der Backdrop wird mit `s` skaliert, nicht mehr gestreckt).

**Bekannter Verstoß, der dabei verschwinden muss:** Reactor Row zeichnet seine Fenster in `#e7c14b`, MegaCorp Tower wiederholt dieselbe Farbe als Fensterpunkte – das ist exakt die für **Shock** reservierte Signalfarbe (`ui-layout.md`, „Markierungen"). Beide Kulissen streuen damit Shock-Signale über die ganze Bühne.

**Abnahme:**
- Der Generator läuft reproduzierbar durch und erzeugt die drei Kulissen im Canvas 224×128.
- Der Prüfmodus zeigt für jede Kulisse: Bodenfläche über beide Standlinien durchgehend begehbar lesbar, kein fokales Motiv in den Bleed-Zonen.
- Die rechnerische Gegenprobe meldet keine gesperrten Signalfarben als gesättigte Lichtpunkte.
- Eine vierte, neu angelegte Region lässt sich **allein über eine Rezeptur** ergänzen, ohne neue Zeichenfunktion. Das ist der eigentliche Test des Baukastens.

**Voraussetzung – erledigt (25.07.2026):** Python 3.13.14 mit Pillow 12.3.0 ist installiert (`%LOCALAPPDATA%\Programs\Python\Python313\python.exe`). Der Microsoft-Store-Alias verdeckt es weiterhin in Shells, die vor der Installation gestartet wurden – dort hilft ein neues Terminal oder der volle Pfad.

**Gegenprobe gelaufen:** Alle vier Generatoren (`characters`, `monsters`, `bosses`, `regions`) laufen durch und erzeugen **pixelgleiche** Assets zum eingecheckten Stand (44/44 Dateien, verglichen über `ImageChops.difference`). Die Sprites sind also reproduzierbar – niemand hat am Generator vorbei gemalt.

> **Achtung, Rausch-Diffs:** Ein Generator-Lauf ändert trotzdem **jede** PNG-Datei, weil Pillow 12 anders komprimiert als die Version, mit der die Assets ursprünglich erzeugt wurden. `git status` meldet dann 44 geänderte Dateien ohne einen einzigen abweichenden Pixel. Bei M12 ist deshalb **vor** dem Committen zu prüfen, ob eine Änderung inhaltlich ist – ein Byte-Diff beweist hier nichts. Wer das sauber lösen will, fixiert die PNG-Kodierung (feste `compress_level`, keine Metadaten) und erzeugt einmalig alle Assets neu; dann sind Byte-Diffs künftig wieder aussagekräftig. **Erledigt, s. Umsetzungsentscheidung 29.**

**Umsetzungsentscheidungen (M12): Nr. 20–31 → [`07_Umsetzungsentscheidungen.md`](07_Umsetzungsentscheidungen.md)**

---

## M13 – Bühnen-Framework in der Stage

**Ziel:** Die Kampfzone von handkalibrierten Pixelwerten auf das gerechnete Bühnen-Framework umstellen, sodass sich bei Fenstergrößenänderung ausschließlich die Größe ändert – nie die Komposition.

**Kern-Referenz:** `spec/ui-layout.md`, Abschnitt „Bühnen-Framework" (führend). Schema: `spec/assets/stage-framework.svg`. Sollbild: die Prüf-Mockups `spec/assets/mockups/stage-*.html`.

**Der Befund in einem Satz:** Umsetzungsentscheidung 19 hält fest, dass die heutige Geometrie „interaktiv am Screenshot kalibriert, nicht rechnerisch hergeleitet" ist (`margin-top:-90px`, `translate(-65px, 5px)`, `ENEMY_LAYOUTS`) – Sprites sind absolut in Pixeln bemessen, Kulisse und Abstände relativ zur Stage, und zwei Maßsysteme können nicht proportionsstabil sein.

Umzusetzen:

1. **Stage-Unit als einzige Längeneinheit** (1 su = 1 Sprite-Pixel), Bühnenbox **504 × 288 su**, alle Positionen in su statt in CSS-Pixeln oder Prozent.
2. **Ein Skalierungsfaktor** `s = min(Stage-Breite/504, Stage-Höhe/288)`, begrenzt auf 1,0 … 4,0, angewandt auf **Backdrop, Sprites, Bodenaufsätze, Marker und Kopf-HUD gemeinsam**. Der bisherige feste 2×-Sprite-Zoom entfällt – er ist jetzt der Referenzfall `s = 2`.
3. **Verankerung:** Bühnenbox horizontal zentriert, an ihrer Unterkante am Stage-Boden verankert; Überschuss wird vom **Backdrop-Bleed** gefüllt. Der Backdrop wird **nie** unabhängig skaliert oder auf die Stage gestreckt.
4. **Slot-Raster** aus der Spec (P1 176 / P2 216 / P3 56 / P4 96; E1 328 / E2 368 / E3 408 / E4 448; Solo-Gegner 388), Standlinien B₂ = 228 / B₁ = 268, Tiefenvektor `D` = (+40, −40). `ENEMY_LAYOUTS` und die Party-Flex-Zeilen werden dadurch **ersetzt**, nicht ergänzt.
5. **Ebenen** B0–B2 / F-Stapel je Figur / U0–U2. Marker gehören in den Stapel **ihrer** Figur, nicht auf eine globale Ebene – sonst liegt der Umriss einer hinteren Figur über einer vorderen.
6. **Vortreten bei Bereitschaft:** Party-Figur mit vollem ATB verschiebt sich um (+12, +12) su und wird nicht abgedunkelt; Kopf-HUD wandert mit. Nur Party, nicht Gegner.
7. **Kontrastplatte hinter dem Kopf-HUD** (verbindlich) und **Tiefen-Abdunklung** der hinteren Reihe (empfohlen, im Code bereits als `brightness(0.88) saturate(0.85)` vorhanden).
8. **Dunkler Saum am Shock-Ring** (`ui-layout.md`, „Markierungen"; nachgetragen nach der M12-Review). Ohne ihn hängt die Lesbarkeit des Rings an der Kulissenfarbe – Quaintsville, Stargazer Gulch und Blastoff Burg liegen palettenseitig in derselben Farbfamilie wie der Ring. Die Signalfarben-Sperre für Kulissen verhindert die Verwechslung, nicht den Kontrastverlust.

**Zwei Altlasten, die dabei aufzulösen sind:**

- **UI-4 (Entscheidung 19):** Der Anzeige-Tausch der Party-Sitzplätze (`PARTY_DISPLAY_ORDER`) war ausdrücklich ein Platzhalter. Die Spec legt jetzt fest: feste Slot-Zuordnung, Belegung von innen nach außen, **kein Nachrücken auch bei Party-Zuwachs**. Entweder `PARTY_DISPLAY_ORDER` entfällt, oder die tatsächlich gewünschte Zuordnung wird als Entscheidung festgehalten – der Platzhalter darf nicht stillschweigend zur Regel werden.
- **UI-2 (Entscheidung 18):** Die Spec begründet die cyanfarbene Fokus-Markierung damit, dass Cyan im Spiel bereits die Farbe der Spielerkontrolle sei – im Code trifft das nicht zu (der Auto/Manual-Umschalter nutzt Blau). Entweder die Farbzuordnung im Code vereinheitlichen oder die Begründung in der Spec korrigieren; beides ist besser als der jetzige Widerspruch.

**Abnahme:**
- **Das eigentliche Kriterium:** Beim Verkleinern des Fensters ändert sich ausschließlich die Größe. Figurenabstände, Standlinien und die Lage der Bodenfläche bleiben proportional identisch – das war der Ausgangsfehler.
- Kein Sprite und kein HUD ragt ins Himmelband; der Kapitel-Boss (128 su auf B₂) bleibt mit HUD unter der Deckenlinie.
- Bei 4 gegen 4 überlappt kein Kopf-HUD ein anderes.
- Die Position eines Gegners hängt **nicht** von der Sprite-Größe seiner Nachbarn ab (die in Entscheidung 19 behobene Klasse von Fehlern darf nicht zurückkehren).
- `npm test` und `npm run check` grün – M13 ist reine Darstellung, die Mechanik bleibt unberührt.

**Risiko – die Abnahme ist rein visuell.** Anders als M11 lässt sich M13 nicht über Tests abnehmen: Jedes Kriterium oben ist eine Aussage über ein Bild. Die Browser-Pane hat in **zwei** Umsetzungs-Sessions nicht compositet (Entscheidungen 18 und 29), und in beiden Fällen wurde ersatzweise über berechnete Stile und Netzwerkanfragen verifiziert – für M13 reicht das nicht, weil genau die Bildwirkung der Gegenstand ist. Wenn die Pane erneut ausfällt, ist die Abnahme **nicht** ersatzweise zu erklären, sondern zu verschieben: entweder über ein eigenständiges Prüf-HTML, das die Bühne mit echten Assets bei mehreren Fensterbreiten rendert (Vorbild: `spec/assets/mockups/stage-framework-check.html`), oder durch eine Sichtprüfung des Nutzers. Ein „sieht laut CSS korrekt aus" hat bei M12 bereits ein liegendes H durchgelassen.

**Reihenfolge:** M12 **vor** M13. M13 erwartet Kulissen im Format 168×96 mit Bodenband und Bleed; die heutigen sind 160×96 ohne beides. *(M12 ist erledigt, die Kulissen liegen im neuen Format vor.)*

### ✅ Abnahme M13 (Konzept-Review, 26.07.2026) – bestanden

Am laufenden Dev-Server gemessen, nicht aus dem Code abgeleitet (die Vorgabe „die Abnahme ist rein visuell" oben):

| Stage | `s` | Claude | Blando | Spritegröße |
|---|---|---|---|---|
| 998 × 608 | 1,981 | x 188, Standlinie 280 | x 328, Standlinie 268 | 64 su |
| 540 × 720 | 1,071 | x 188, Standlinie 280 | x 328, Standlinie 268 | 64 su |
| 1092 × 656 | 2,167 | x 188, Standlinie 280 | x 328, Standlinie 268 | 64 su |

**Die Stage schrumpft um 46 %, die Komposition bleibt in su identisch** – das Kernkriterium ist erfüllt. Claudes x = 188 statt 176 ist korrekt (bereit → vorgetreten um +12, Standlinie 280, 8 su Restreserve). Ebenfalls geprüft: Der Übergang von der Stage-Hintergrundfarbe in den Kulissenhimmel ist bei hoher, schmaler Stage nahtlos (Fund 3); die Boss-mit-Begleitern-Regel (Fund 1) setzt Vaultrons Kopf-HUD exakt auf die Deckenlinie y = 72, und seine Begleiter überlappen ihn nur im unteren Fünftel.

**Ein Nachzieher, aus einer Spec-Lücke, nicht aus der Umsetzung:** Das Aktions-Popup misst konstant 232×23 CSS-px und skaliert nicht mit `s` – bei Stage 540×720 sind das 217 su, und es verdeckt **34 % der handelnden Figur**. Die Skalierungsregel nannte U1/U2 gar nicht; dass sie **nicht** mitskalieren, ist richtig (Text muss lesbar bleiben), die fehlende Konsequenz daraus war die Regel „ein Overlay überlappt nie die Figur, auf die es sich bezieht". Beides jetzt in `ui-layout.md` („Skalierung" und „Charakter-Steuerung"). Umzusetzen: Das Popup weicht der Figur horizontal aus, maßgeblich ist deren **vorgetretene** Position.

**Umsetzungsentscheidungen (M13): Nr. 31–41 → [`07_Umsetzungsentscheidungen.md`](07_Umsetzungsentscheidungen.md)**

---

## M14 – Gruppenlevel statt Charakter-Level

**Ziel:** Die in der Konzept-Session vom 26.07.2026 beschlossene Umstellung (`spec/stats-kampfwerte.md` §4.1) im Code umsetzen: **ein** Level für die ganze Party statt vier synchron mitlaufender Charakter-Level.

**Der Befund, der sie ausgelöst hat:** Mit individuellen Leveln stieß Barrel in Zone 9 als L1 zu einem L~9-Claude, Tofa und Air is… in Zone 19 als L1 zu L~19 – ~1,6× bzw. ~2,6× ATK-Rückstand. Eine frisch freigeschaltete Figur trug über eine halbe Region nichts bei und entwertete damit ihre eigene Freischaltung.

**Umgesetzt:** `Character` ohne `level`/`exp`; `SaveState.partyLevel`/`partyExp` als einziger Levelstand; Save-Migration v2 → v3; Neuzugänge steigen auf dem Gruppenlevel mit abgeleiteten (vollen) HP/MP ein; **ein** Level-/EXP-Anzeiger in der Sidebar statt vier pro Charakter-Panel.

**Abnahme:** `npm test` 117/117 und `npm run check` grün; im Browser gegengeprüft (Level-Up auf 2 nach Zone 3, EXP-Grenze 20 → 24, Claudes HP-Maximum 110 → 126).

**Umsetzungsentscheidungen (M14): Nr. 42–47 → [`07_Umsetzungsentscheidungen.md`](07_Umsetzungsentscheidungen.md)**

---

## M15 – Ökonomie-Umbau: Gil streichen, EXP dämpfen

**Aus der Konzept-Session vom 30.07.2026** (zweiter Playtest). Der Meilenstein ist ein **Blocker** für alles Weitere: Er ändert die einzige Run-Währung.

**Ziel**

1. **Gil vollständig entfernen** – Währung, Shop, `buyWeapon()`, `weaponTier`, Monster-Gil, Save-Feld. Migration v3 → v4.
2. **Waffen-Tier-Leiter entfernen**; das entfallende ATK/HP/MAG-Wachstum in die **Level-Kurve** übernehmen (`spec/stats-kampfwerte.md` §4).
3. **Special über Zonen-Trigger**, permanent: `specialUnlocked` statt `weaponTier >= 1`. Claude **Zone 3**, alle späteren Figuren **mit Beitritt**. Übersteht die Reunion.
4. **EXP-Dämpfung über Level × Zone** (`spec/oekonomie-waehrungen.md` §1a, `spec/feinspec-kapitel1.md` §3.6): Plateau (~+2–3 Level über Zonen-Erwartung) mit anschließendem Sturz, **nie null**. `L_erw(zone)` **aus der Zonen-Kurve abgeleitet**, nicht als Tabelle.
5. **Zielzeiten neu simulieren** gegen die Tabelle in feinspec §12 B2 – und das Zielband für den schwachen Spieler (T′) **festlegen**, das die Konzept-Session offengelassen hat.

**Spec-Referenzen:** `spec/oekonomie-waehrungen.md` (§1, §1a, „Gil ist gestrichen"), `spec/feinspec-kapitel1.md` (§3.6, §6.4, §11, §12), `spec/stats-kampfwerte.md` §4, `spec/charaktere-party.md`, `spec/ausruestung-gil.md` §0, `spec/prestige-reunion.md`, `spec/niederlage-offline.md` §3.

**Abnahme**

- ✓ Kein `gil`/`weaponTier` mehr im Code, im Save oder in den Content-Daten; Migration (v3→v4, Entscheidung 51) lädt Altstände verlustfrei.
- ✓ Der Special ist nach einer Reunion **ab Zone 1 verfügbar** und bleibt es (permanentes `specialUnlocked`, Entscheidung 49) – der alte Widerspruch ist weg.
- ✓ **B4:** Typ V fällt Vaultron nicht mehr durch Tieffarmen billiger als zuvor – im Gegenteil, spürbar teurer (Entscheidung 52). ⚠️ **Die Begründung in Entscheidung 52 ist allerdings ein Fehlschluss** (s. Konzept-Review 31.07.2026 unter M15a); B4 hält aus einem anderen Grund. **Und der Fall, den die offene B2-Zeile meinte, war zunächst verletzt** → **B5**, seit M15a (`EXP_DAMPING_CUTOFF`, Entscheidung 56) behoben und gemessen.
- ✓ **A3 hält weiter:** über den Test-Harness bestätigt, kein Deadlock, EXP-Ertrag nie 0 (`Math.max(1, …)` in `zoneReward()`).
- Zielzeiten M ≈ 30 min / T ≈ 90 min (Echtzeit inkl. Menüs, §7.4 „Einordnung in Echtzeit") **unverändert erreichbar** – die Simulationszeit für M/T ändert sich durch M15 kaum (Entscheidung 52); **T′-Zielband bleibt offen** (Playtest-Frage, kein Simulationswert).

⚠️ **Das Hauptrisiko dieses Meilensteins ist nicht die Streichung, sondern Punkt 4:** Ob „Plateau breit genug für A3" und „Sturz steil genug für B4" gleichzeitig erreichbar sind, ist ungemessen. Zeigt die Messung, dass es nicht geht, ist das ein **Konzept-Rückkanal**, keine Zahlenfrage – dann fehlt ein zweiter Mechanismus.

**Ergebnis der Messung:** Geht – gegen `tests/chapter-playthrough.test.ts` gemessen (Details Entscheidung 50/52). A2 (V ≤ 20 Grind-Siege je Zonenstufe) hält bei **19** als höchstem gemessenem Wert – knapp, aber kein Konzept-Rückkanal nötig.

**Umsetzungsentscheidungen (M15): Nr. 48–52 → [`07_Umsetzungsentscheidungen.md`](07_Umsetzungsentscheidungen.md)**

---

## M15a – Camping-Leck schließen (Konzept-Review 31.07.2026)

**M15 ist damit inhaltlich nicht abgeschlossen.** Eigener Abschnitt statt Nacharbeit im M15-Text, weil hier ein neues Kriterium (**B5**) und ein neuer Spielertyp (**K**) dazukommen.

**Der Befund.** Der Konzept-Review hat den Fall nachgemessen, den Entscheidung 52 ausdrücklich als „nicht modelliert" markiert hatte — den **Camper**: eine Zone einstellen und das Spiel während der Arbeitszeit laufen lassen. Ergebnis: **eine einzige 8-h-Session an Zone 3** (der allerersten Wand) bringt L2 → **L20**, danach fallen Zonen 4–30 inklusive Vaultron ohne weiteres Farmen. Der Nutzer hat den Camper als reales Verhalten bestätigt und die Anforderung gesetzt: mindestens ein Umzug in eine deutlich höhere Zone plus erneutes Campen.

**Die Ursache ist der A3-Schutz aus Entscheidung 50 selbst.** `Math.max(1, …)` in `zoneReward()` garantiert **1 EXP pro Sieg** — und die Dämpfung skaliert den Ertrag *pro Sieg*, nicht die *Siege pro Stunde*. Bei ~1.800 Siegen/h in Zone 3 sind das ~14.400 EXP in acht Stunden, während L2 → L20 nur rund 3.900 kostet. Ein **absoluter** Floor ist gegen eine unbegrenzte Siegrate wirkungslos.

**Ziel**

1. ✓ **Harte Null jenseits `CUTOFF` Überschuss-Leveln** statt `Math.max(1, …)`. A3 wird vom **Plateau** getragen, nicht vom Floor: 1–2 Zonen zurück zahlt weiter voll.
2. ✗ **`expectedLevelForZone` kalibrieren.** War als Ziel gesetzt, hat sich bei der Umsetzung als **nicht nötig** herausgestellt (Entscheidung 57) — der Vergleichswert „echtes Spiel endet bei L21–23" war die alte, ungedämpfte Vor-M15-Baseline, nicht das heutige gedämpfte Spiel (das bei Zone 30 gemessen auf L20 endet, mit komfortablem Abstand zum Cutoff). Kein Konzept-Rückkanal, sondern eine korrigierte Annahme des Reviews selbst.
3. ✓ **Typ K in den Harness** aufgenommen (`simulateCamper`, `tests/chapter-playthrough.test.ts`), s. Entscheidung 58.
4. ✓ **B4-Begründung korrigiert** (s. Entscheidung 53).

**Spec-Referenzen:** `spec/feinspec-kapitel1.md` §12 (Typ K, B4, B5), `spec/oekonomie-waehrungen.md` §1a („Nachtrag 31.07.2026").

**Abnahme**

- ⚠️ **B5: Messung ungültig, Kriterium unbelegt.** Gemessen wurden „3 Sessions, Zonen 1/16/30" – die Messung enthält aber zwei Fehler in `simulateCamper`, die beide **zugunsten** des Ergebnisses wirken (Entscheidung 59). **Vaultron wird in der Simulation nie besiegt.** Nachzumessen, s. Entscheidung 59/60.
- ✓ **A3 unverändert:** 1–2 Zonen Rückfall bleibt voll bezahlt; kein Zustand ohne Fortschrittsmöglichkeit (voller Testlauf ohne Regression).
- ✓ **Keine Regression bei M/T/V:** A2/B1/B2/C1–C4 halten weiter (voller Testlauf, 116/116 grün).
- ✓ Reguläre Spieler laufen am Kapitelende **nicht** in den Cutoff (Überschuss bei Zone 30 gemessen 2,5, Cutoff liegt bei 6 – Entscheidung 57).

**Messwerte des Reviews** (Sonde gegen die echten Module, sonst unveränderte Konstanten) — als Startpunkt verwendet:

| `CUTOFF` | Sessions | Camp-Zonen |
|---|---|---|
| ohne (M15) | **1** ✗ | 3 |
| 10 | 2 | 3, 17 |
| 8 | 2 | 3, 16 |
| **6** | **3** ✓ | 3, 15, 29 |
| 4 | 4 | 3, 7, 15, 29 |

**Tatsächlich umgesetzt und gemessen** (`EXP_DAMPING_CUTOFF = 6`, `expectedLevelForZone` unverändert – die obige Review-Tabelle nutzte dieselbe unveränderte Kurve, die Werte oben gelten also unverändert): **3 Sessions**, Camp-Zonen **1, 16, 30** (`simulateCamper`, s. Entscheidung 56/58). Die leicht abweichenden Camp-Zonen gegenüber der Review-Sonde (3/15/29 statt 1/16/30) sind Modellierungsdetails der jeweiligen Sonde (u. a. Startzone der ersten Session: die Review-Sonde ging offenbar von einem ersten manuellen Vorstoß bis Zone 3 aus, `simulateCamper` campt konsequent ab Zone 1, da Typ K im Kampf "gar nicht eingreift", auch nicht in den ersten Zonen) – die Kernaussage (3 Sessions an klar getrennten Zonen) ist deckungsgleich.

**Umsetzungsentscheidungen (M15a): Nr. 53–67 → [`07_Umsetzungsentscheidungen.md`](07_Umsetzungsentscheidungen.md)**

---

## M16 – Zielwahl muss zählen

**Ziel:** Können soll etwas kaufen, das Farmen nicht ersetzt. Heute ist Zielwahl fast wirkungslos und Analyse damit nutzlos – dieselbe Wurzel wie der geschlossene §12-Korridor.

- **Heiler-Gegner nach Region 2 vorziehen** (`spec/gegner-encounter.md` §5a) – dort, wo auch die Analyse aufgeht.
- **Analyse-Popup erst am ersten Gegner, bei dem Zielwahl zählt**, nicht bei Regionsbeginn.
- Optional, pro Boss dosierbar: **temporärer, telegrafierter Konter-Zustand** (Angreifen schadet dem Angreifer). **Nur temporär, nur Boss/Miniboss** – als Dauer-Trait ausdrücklich verworfen. Leitlinie **fordernd, nicht strafend**: Autoplay verliert HP, stirbt nicht zwangsläufig.

**Abnahme (Kriterium ersetzt am 01.08.2026, Konzept-Review nach der Umsetzung):**

- **Mindestens zwei benannte Encounter**, in denen Zielwahl über Ausgang oder Dauer des Kampfes entscheidet – davon **einer spätestens am Ende von Region 2**, also dort, wo Analyse aufgeht.
- Jeder dieser Encounter hat eine **Antwort, die nicht ausgehen kann** (§5a „Rätsel-Takt statt Steuer").
- ~~Analyse liefert an diesen Gegnern eine Information, die die Kampfanzeige **nicht ohnehin hergibt**.~~ **Gestrichen am 01.08.2026 (M17-Klärung).** Das Bestiarium beschreibt die Gegner-*Art* und enthält deshalb **keine absoluten Zahlen** – die einzige exklusive Information (Heilmenge/Takt) war genau so eine. Analyse ist damit keine Kapitel-1-Mechanik mehr, sondern wird in Kapitel 2 mit Materia eingeführt (`spec/kampf-analyse-shock.md` §5). Der Heiler muss nur noch die beiden Kriterien darüber erfüllen.

*Ersetzt wurde „Der Abstand M↔T wächst messbar gegenüber M15". Grund: Das Maß passt nicht zum Meilenstein. M↔T misst den Skill-Ertrag über **alle 30 Zonen**; M16 ändert davon zwei Encounter, kann die Kennzahl also konstruktionsbedingt nur um wenige Prozent bewegen. Die Messung bestätigte das (+3 %, s. u.), und sie war zusätzlich **nicht monoton** – ein Konter-Deckel von 3 statt 2 senkte den Abstand wieder (Entscheidung 72). Ein Kriterium, das nur durch Drehen am schärfsten nichtlinearen Hebel des Kapitels zu erfüllen wäre, erzeugt Druck genau in die Richtung, die die Leitlinie „fordernd, nicht strafend" verbietet. Der M↔T-Abstand bleibt die richtige Kennzahl für den §12-Korridor als Ganzes – nur nicht die Abnahme eines einzelnen Inhalts-Meilensteins.*

**Einordnung:** Das ist **Inhaltsdesign, keine Deadlock-Sicherung** – die EXP-Dämpfung aus M15 erledigt das Idle-Overpowern allein. Deshalb ist M16 dosierbar und nicht tragend.

**Umgesetzt:** Neues Monster **Bandbox** (Trait `heal`, `content/monsters.ts`), platziert in Zone 12/13 direkt nach dem Panzer (`content/zones.ts`); heilt statt anzugreifen (`core/tick.ts` `resolveEnemyAction`). **Vaultron** (Zone 30) trägt neu `counterStance: true` – während der bereits vorhandenen "Mako core charging…"-Aktion kontert jeder Treffer bis zu einem Deckel (`core/battle.ts` `dealDamage`, `COUNTER_MAX_HITS`). Die Referenz-Policy für "aufmerksames manuelles Spiel" (`core/gambits.ts` `resolveOptimalAction`) bekommt dafür `smartTarget`: tötet einen Heiler immer zuerst und weicht einem aktiven Konter-Fenster aus, solange ein anderes Ziel lebt.

**Abnahme gemessen:** `npm test` 120/120 und `npm run check` sauber. Alle §12-Kriterien A–D weiterhin grün (inkl. A2/B2/C3). Gemessene Laufzeiten nach M16: **M 13,8 / T 45,0 / V 69,1 min**.

⚠️ **Zum alten M↔T-Kriterium (nicht mehr die Abnahme, s. o.):** M15-Baseline 43,7 − 13,5 = **30,2 min**, nach M16 **31,2 min**. Der Konzept-Review vom 01.08.2026 wertet die +1 min **nicht** als Beleg: Variante (a) derselben Messreihe lag bei 30,2 („im Rauschen"), und ein Deckel von 3 ergab 30,8 – die Bewegung durch eine Verschlechterung hat dieselbe Größenordnung wie die durch die Verbesserung.

✅ **Regressionstest umgestellt (01.08.2026):** Der alte M↔T-Test in `tests/chapter-playthrough.test.ts` ist entfernt; an seiner Stelle prüft `describe('M16 (Abnahme ersetzt 01.08.2026) ...')` je einen Encounter direkt – Bandbox (Zone 12): Heiler zuerst schlagen gewinnt spürbar schneller als ihn zu ignorieren; Vaultron (Zone 30): dem Konter-Fenster auszuweichen entscheidet über Sieg oder Niederlage. Der M↔T-Abstand bleibt als §12-B2-Korridor-Messung bestehen (unverändert grün), trägt aber keine M16-eigene Abnahme mehr.

**Offene Punkte aus dem Konzept-Review (01.08.2026)** – die drei Spec-Korrekturen in `spec/gegner-encounter.md` §5a sind nachgezogen:

1. ✅ **Analyse braucht am Heiler eine exklusive Information** – **Anforderung zurückgenommen am 01.08.2026 (M17-Klärung).** Das Bestiarium beschreibt die Gegner-*Art*, nicht die zonen-skalierte Instanz, und enthält deshalb **keine absoluten Zahlen**; Heilmenge/Takt war der einzige Kandidat und verstößt genau dagegen. Damit ist **Analyse keine Kapitel-1-Mechanik** mehr (Beschluss `spec/kampf-analyse-shock.md` §5), das Einführungs-Popup „Analyse & Bestiarium" entfällt (`spec/ui-layout.md`, jetzt **13** statt 14 Einträge), und der Skalierungs-Streit ist gegenstandslos. **Rückstand für die nächste Umsetzungs-Session:** die Zeile „7 HP / ~2.0s" aus `ui/BestiaryModal.svelte` entfernen (ggf. durch einen zahlenfreien Tag ersetzen).
2. ✅ **Vaultrons Ausweichziele können ausgehen** – zwei Adds, aber das Konter-Fenster wiederholt sich alle drei Aktionen. Umgesetzt: `core/gambits.ts` `resolveOptimalAction` verteidigt jetzt, wenn kein konter-freies Ziel mehr lebt (§5a, Variante a).
3. ✅ **Bandbox braucht ein eigenes Sprite, bevor M17 den Lehr-Popup setzt** – der erste Zielwahl-Lehrgegner darf nicht wie der Füllgegner neben ihm aussehen (Entscheidung 75, Platzhalter `blando_64.png`). Umgesetzt: `assets/generate_monsters.py` `bandbox()`, eingebunden in `ui/sprites.ts`. **Blocker für M17 ist damit aus dem Weg.**

**Umsetzungsentscheidungen (M16): Nr. 68–75 → [`07_Umsetzungsentscheidungen.md`](07_Umsetzungsentscheidungen.md)**

---

## M17 – Mechanik-Einführung: Popup + Codex ✅

**Ziel:** Rund vierzehn Mechaniken kommen in ~30 Minuten stumm ins Spiel. **Eine Mechanik, die der Spieler nicht bemerkt, benutzt er nicht** – wer Defend und Zielwahl nie wahrnimmt, spielt zwangsläufig vollautomatisch. Damit ist die stumme Einführung mitverantwortlich für die Idle-Konvergenz, die M15/M16 behandeln.

**Umfang** (vollständige Spec: `spec/ui-layout.md`, „Mechanik-Einführung"):

- Blockierendes Popup mit Pause, **aktiv wegzuklicken**; nur für **bedienbare** Mechaniken (**13** Einträge, kanonische Liste in der Spec – „Analyse & Bestiarium" am 01.08.2026 gestrichen, s. M16-Punkt 1).
- **Selbstvorstellungen** der vier Figuren – 2–3 witzige Sätze, aus denen die Stärke hervorgeht (`spec/charaktere-party.md`). **Claude stellt sich vor dem allerersten Kampf vor**, getrennt vom Mechanik-Popup in Zone 3.
- **Keine konkreten Zahlen in Erklärtexten** – qualitativ formulieren. Wir ändern in M15 praktisch alle diese Werte.
- **Codex** zum Nachlesen; **ab Durchlauf 2 stumm** (Flag je Mechanik, übersteht die Reunion).

**Abnahme:** E4 und E5 aus feinspec §12 – ein Spieler kann die Mechaniken und die Rolle jeder Figur benennen und weiß nach seiner ersten Niederlage von der Zonen-Rückkehr.

**Reihenfolge: nach M15, aber vor der Kapitel-2-Feinspec.** Nach M15, weil die Auslöser an Zonennummern und Freischaltzeitpunkten hängen, die M15 ändert – vorher gebaut heißt zweimal gebaut. Vor Kapitel 2, weil dort Materia, AP, Slots und der Gambit-Editor dazukommen: Steht das Framework, rutschen sie hinein statt wieder stumm zu erscheinen.

**Umgesetzt (01.08.2026):** `content/introductions.ts` (13 Einführungen, Reihenfolge = Auftritt), `save/schema.ts`/`save/migrate.ts` (v5→v6, `introsSeen` mit Migrations-Heuristik für Alt-Saves), `ui/gameStore.svelte.ts` (`activeIntro`/`#queueIntro`/`closeIntro`, Pause-Guard in `advance()`, 13 Hooks an bestehenden Flag-Flip-Stellen), `ui/IntroPopup.svelte` (blockierendes Popup, kein Backdrop-Close), `ui/Codex.svelte` (Nachlese-Liste, Sidebar-Button). `npm test` 133/133, `npm run check` 0 Fehler/Warnungen. Details/Begründungen: Umsetzungsentscheidungen 81–89.

**Umsetzungsentscheidungen (M17): Nr. 81–89 → [`07_Umsetzungsentscheidungen.md`](07_Umsetzungsentscheidungen.md)**

---

## M18 – Spec-Rückstand einholen (Konzept-Runde 01.–02.08.2026)

**Ziel:** Die drei Doku-Commits `2fc94a6`, `2e440cc`, `0e6e544` haben **kein `src/` angefasst.** Alles, was sie entschieden haben, ist im Spiel nicht vorhanden. Fünf der sieben Punkte sind für den Spieler unmittelbar sichtbar – **ein Durchlauf vor M18 zeigt teilweise die alten Fehler statt der Korrekturen**, und zwei davon (Limit, Heiler-Telegraf) sind genau die Stellen, die im M17-Playtest aufgefallen sind.

**Einordnung:** Kein neues Design – reine Nachführung bereits getroffener Entscheidungen. Deshalb keine Konzept-Rückfragen nötig; die Begründungen stehen jeweils in der genannten Spec-Stelle.

### Umfang

1. **Special-Namen** (`spec/feinspec-kapitel1.md` §6.1): „Cross Slash" → **Overcommit** (Claude), „Heal Wind" → **Second Wind** (Air is…). Es waren wörtliche FF7-Limit-Break-Namen – falsche Kategorie (das `special_mp`-Popup lehrt „Special ≠ Limit" mit einem Limit-Namen) und Verstoß gegen „keine Kopien der Originale". Betroffen u. a. `content/zones.ts`, `content/introductions.ts` (**Spielertext**), `core/formulas.ts`, `core/gambits.ts`, `ui/gameStore.svelte.ts`. Die Tabelle in §6.1 ist die normative Quelle.
2. **Limit-Aufladung relativ** (`spec/feinspec-kapitel1.md` §3.4): `60 · Schaden/maxHP(Ziel)` ausgeteilt, `80 · Schaden/maxHP(selbst)` erlitten – statt absoluter Raten in `limitGainOnDealt`/`limitGainOnTaken`. Grund ist **Drift**: Schaden und HP skalieren mit Zone und Level, `LIMIT_MAX` bleibt 100. Ausdrücklich **nicht** tun: Raten bloß anheben (behebt die Drift nicht), Blandzillas ATK senken (erlittener Schaden ist der stärkere Ladekanal).
3. **Heiler heilt in Schüben** (`spec/gegner-encounter.md` §5a): 3,6× ATK alle ~6 s statt 1,2× alle ~2 s – **gleiche Heilung pro Sekunde**, plus Telegraf und sichtbare Heilzahl. Das Rinnsal war gegen die gleichzeitig fallende HP-Leiste unsichtbar. `ENEMY_HEAL_MULT` wird dabei **nicht** erneut angehoben; 1,2 ist das Ergebnis von Entscheidung 76.
4. **Erschöpfte Zonen markieren** (`spec/ui-layout.md`, `spec/oekonomie-waehrungen.md` §1a): binär, in der Zonenwahl **und** an der laufenden Zone, plus einmalige Meldung im Moment des Kippens. Bis dahin ist die EXP-Dämpfung völlig unsichtbar – der Spieler kämpft, gewinnt und bekommt nichts. **Die Anzeige hängt am tatsächlichen Ertrag, nicht an `EXP_DAMPING_CUTOFF`**, überlebt also jedes Neu-Balancieren. Erschöpfte Zonen bleiben wählbar.
5. **Bester Versuch am Gate** (`spec/ui-layout.md`, `spec/prestige-reunion.md`): nach einer Boss-Niederlage den besten bisherigen Versuch zeigen. Rein rückblickend – sagt nichts voraus und entwertet das Versuchen nicht. **Reset bei Reunion** (Save-Feld, nach der Reset-/Persistenz-Liste): Nach dem Reset ist die Party Level 1, ein alter Bestwert wäre unerreichbar und würde entmutigen statt messen.
6. **Bestiarium: Heilmenge/Takt entfernen** – `ui/BestiaryModal.svelte` zeigt „HP / s" aus `enemyHealAmount`; der Kommentar dort zitiert noch die am 01.08.2026 **zurückgenommene** Anforderung. Das Bestiarium beschreibt die Gegner-*Art* und führt **keine absoluten Zahlen**. Ggf. durch einen zahlenfreien Tag ersetzen.
7. **M13-Nachzieher:** Das Aktions-Popup skaliert nicht mit `s` und verdeckt bei kleiner Bühne 34 % der handelnden Figur. Regel steht in `spec/ui-layout.md`.

### Abnahme

- `npm test` und `npm run check` grün; die §12-Kriterien A–D halten weiterhin (Punkt 2 verschiebt Limit-Zeitpunkte, kann also Laufzeiten bewegen).
- Kein Vorkommen von „Cross Slash"/„Heal Wind" mehr in `src/`.
- **Anschließend: ein menschlicher Durchlauf Zone 1 → 30 → Reunion.** Er ist der eigentliche Zweck von M18 – die Kapitel-2-Feinspec baut sonst auf einem Kapitel 1 auf, das in dieser Form nie gespielt wurde (Leitplanke „Skelett zuerst", zweimal durch Playtests bestätigt).

**Umgesetzt (02.08.2026):** Alle sieben Punkte in `src/`. Special-Namen (`content/characters.ts`, `content/introductions.ts`, `core/formulas.ts`, `core/gambits.ts`, `ui/gameStore.svelte.ts`, Tests) auf Overcommit/Second Wind umgestellt. `limitGainOnDealt`/`limitGainOnTaken` (`core/formulas.ts`) nehmen jetzt die maxHP-Bezugsgröße als Parameter (Aufrufer `core/battle.ts`/`core/tick.ts`); die bestehende D5-Simulation (1–2× voll pro Gate) bleibt ohne Anpassung grün. Heiler-Puls (`core/tick.ts` `resolveEnemyAction`, `HEAL_BURST_MULT` in `core/formulas.ts`) plus Telegraf und sichtbare Heilzahl (`ui/Stage.svelte`, neue `BattleUnit`-Felder `lastHealAmount`/`lastHealTargetIndex`). Bestiarium zeigt für Heiler nur noch den zahlenfreien Tag „Heals its group" (`ui/BestiaryModal.svelte`). Erschöpfte Zonen (`core/progression.ts` `isZoneExhausted`, `ui/Sidebar.svelte`) und bester Gate-Versuch (`ui/gameStore.svelte.ts` `#onLoss`/`#updatedGateBestAttempts`, faellt bei `reunion()` zurück) sind neue Save-Felder (`exhaustedZonesNotified`, `gateBestAttempts`, Migration v6→v7 in `save/migrate.ts`). Aktions-Popup weicht der eigenen Figur jetzt zur Laufzeit horizontal aus (`ui/ActionPopup.svelte`, per `getBoundingClientRect`-Messung gegen `data-actor-id` in `ui/Stage.svelte` – Stage/BottomBar teilen sich kein gemeinsames Koordinatensystem). `npm test` 134/134, `npm run check` 0 Fehler/Warnungen, kein Vorkommen von „Cross Slash"/„Heal Wind" mehr in `src/`. Menschlicher Durchlauf steht noch aus.

---

## M19a – Gasthaus-Kulisse (Konzept-Session 02.08.2026)

**Ziel:** Der Gasthaus-Aufenthalt hat kein Bild. Bevor M19b einen Ablauf darauf inszenieren kann, muss es einen Ort geben, an dem er stattfindet. **Reiner Asset-Meilenstein, keine Zeile Spiellogik** – deshalb von M19b getrennt: Der Innenraum ist der **erste** überhaupt, der Baukasten war bis hier ausschließlich auf Außensilhouetten ausgelegt, und diese Arbeit hat mit dem Szenenablauf keine Berührung außer dem fertigen PNG.

**Spec:** `spec/regionen-kulissen.md` §6a (normativ), Framework §3/§4/§5/§9, Baukasten §7.

### Umfang

1. **Neue Bausteine** in `assets/region_kit.py`: Bett, Tresen, Feuerstelle, Innen-Fensternische. Sie gehören nach §7 anschließend **allen** Regionen – also parametriert und stilkonform (Iso-Kippung, Licht oben-links, zwei Helligkeitsstufen), nicht als Sonderfall für diese eine Kulisse gebaut.
2. **Rezeptur „Inn"** in `assets/generate_regions.py`: Schankraum-Innenansicht. Rückwand mit **einem Fenster** an der Stelle des Himmelbands, Möbelmasse als B1, Boden als B2. Nenn-Box, Bleed und Maßstab wie jede andere Kulisse (§9) – die Szene benutzt dieselbe Bühnenbox.
3. **Eine Palette je Kapitel**, nicht je Region – für Kapitel 1 also **genau eine**. Kapitel 2–5 bleiben offen und kommen mit ihren Kapiteln.
4. **Der Fensterschein nimmt die Signaturfarbe der aktuellen Region** (§6). Das ist ein **Laufzeit-Parameter, kein zweites Bild** – die Kulisse muss so gebaut sein, dass die Fensterfläche zur Laufzeit eingefärbt werden kann. Fällt der Wert aus, muss das Bild trotzdem stimmen.
5. **Der Bildaufbau muss die Dimmung aushalten.** M19b dunkelt die Kulisse zur Laufzeit ab (kein zweites Asset). Eine Komposition, die nur bei voller Helligkeit lesbar ist, ist hier durchgefallen – gegen den abgedunkelten Zustand mitprüfen.
6. **Höchstens ein Kulissen-Leben-Element** (§10), etwa Glut. Ein ruhiger Ort ist die Aufgabe; der Kontrast zum Kampf ist der Zweck der Szene.

### Abnahme

- `python generate_regions.py --check` grün – **einschließlich** Signalfarben-Sperre (§4) und Kontrast-Budget (§5). Der Fensterschein darf mit HP-Rot, Shock-Gold und Fokus-Cyan nicht verwechselbar sein; er ist Atmosphäre, kein Signal.
- **Beidseitig geprüft** (§7 Punkt 6): Die Schwellen dürfen nicht durch Weglassen bestanden werden – ein leerer, strukturloser Raum ist kein Erfolg.
- **Die vier Party-Slots des Bühnen-Frameworks liegen frei** – im Prüfmodus mit eingeblendeten Framework-Linien gegengeprüft. Das ist das eigentliche Abnahmekriterium: Steht ein Bett auf einem Slot, ist die Kulisse unbrauchbar, egal wie gut sie aussieht.

---

## M19b – Gasthaus-Szene (Konzept-Session 02.08.2026)

**Ziel:** *„Man sieht einfach nur den letzten Zustand und es bewegt sich nichts."* Der Aufenthalt ist mechanisch seit Langem da (feinspec §3.8b), visuell ist er nichts. **Das ist keine Politur:** Die Totzeit ist die Balance-Größe, die „durchhalten oder heilen" überhaupt trägt – eine Wartezeit ohne Bild ist von einem hängenden Spiel nicht unterscheidbar und wird als Defekt gelesen statt als Preis. Damit kann die Abwägung, für die sie existiert, nicht stattfinden.

**Spec:** `spec/ui-layout.md`, „Gasthaus-Szene" (normativ, inkl. der vier ausspezifizierten Punkte). Mechanik: `spec/feinspec-kapitel1.md` §3.8b. **Setzt M19a voraus.**

### Umfang

1. **Bühnenwechsel, kein Overlay.** Der Kampfbildschirm blendet weg, die Gasthaus-Szene übernimmt die Bühne. Die Trennung ist die halbe Aussage.
2. **Drei Takte:** Ankunft (die 10 s Totzeit) → Nacht (die ~20 s Auffüllen) → Aufbruch (Blende). **Alles liegt innerhalb der bestehenden 30 s** – die Szene erzeugt keine einzige Sekunde neue Wartezeit, weder für Blenden noch für die Ankunft.
3. **Die Dimmung ist der Fortschrittsträger der Totzeit** und der Kern des Meilensteins: Das Raumlicht fährt über `INN_DEAD_TIME` herunter und endet exakt, wenn die Leisten anspringen. **Kein Countdown, kein Ladebalken, keine Zahl** – ein zweiter Träger derselben Aussage ist ausdrücklich verboten (gleicher Fehler wie das gestrichene Suppress-Icon).
4. **Gestaffelte Ankunft:** Die Figuren treffen nacheinander ein, Stehende zuerst, **Gefallene zuletzt und getragen**. Das ist der zweite Inhalt der Totzeit und sagt wortlos, warum man hier ist.
5. **Genau eine Wirtszeile pro Aufenthalt**, aus einem Pool gezogen. Nicht zwei – zwei sind ein Dialog, und ein Dialog beim vierzigsten Mal ist eine Zwischensequenz.
6. **Aufstehen an der bestehenden KO-Schwelle:** Jede gefallene Figur steht auf, sobald ihre HP-Leiste die Schwelle überschreitet, an der sie im Kampf wieder handlungsfähig wäre. **Keine neue Zahl für die Szene** – sonst behauptet das Bild einen Zustand, den die Mechanik nicht kennt. Kein Effekt-Aufschlag beim Aufstehen.
7. **Slot-Raster und Leistenpositionen wie im Kampf.** Die HP/MP-Leisten sind der Hauptträger der ganzen Szene; der Spieler darf nichts neu suchen.
8. **„Aufbrechen" (feinspec §3.8b):** Ab Ende der Totzeit beendbar, Rückkehr mit dem erreichten Stand; auch beim automatischen Aufenthalt nach Niederlage. **Die Schaltfläche erscheint erst mit dem Ende der Dimmung**, nicht vorher ausgegraut – ein sichtbarer gesperrter Knopf lädt zu einem Ausstieg ein, den es dort nicht gibt, und markiert die Totzeit als Gängelung statt als Preis.
9. **Kein Skip, keine Interaktion, keine Zahlen im Bild.** Kein Shop, kein Menü, kein Gespräch mit Auswahl – ein Ort, an dem man etwas erledigen *kann*, wird zu einem, an dem man etwas erledigen *muss*.

### Abnahme

- `npm test` und `npm run check` grün.
- **Gemessen, nicht geschätzt:** Ein Aufenthalt dauert unverändert `INN_DEAD_TIME` + Auffüllzeit. Die Szene darf die Ventil-Ökonomie (§3.8) nicht um eine Sekunde verschieben – das ist der Punkt, an dem eine Inszenierung erfahrungsgemäß zuerst leckt.
- **Gespielt:** Zwei Aufenthalte hintereinander – einer freiwillig angemeldet, einer nach Niederlage mit Wipe. Im zweiten müssen mehrere Figuren nacheinander aufstehen.
- **Der Abbruch bleibt während der Totzeit unmöglich** – auch über Tastatur/Hotkeys, nicht nur über die fehlende Schaltfläche.

⚠️ **Zu beobachten (E2, gespielt): Wiederholungsermüdung.** Der Aufenthalt kommt nach jeder Niederlage automatisch, in einem Retry-lastigen Lauf zweistellig pro Region. Was beim dritten Mal ein Ort ist, ist beim vierzigsten „schon wieder". Die Gegenmaßnahme ist ausdrücklich **wenig Inhalt, der nicht altert** – nicht mehr Inhalt. Falls es kippt, ist das ein Streichgrund für Einzelteile, nicht ein Grund, nachzulegen.

---

## Danach

**M12/M13 sind die Darstellungsschiene** und laufen unabhängig von der Kapitel-2-Feinspec: Sie ändern keine Mechanik, sondern lösen den in der Konzept-Session vom 25.07.2026 gefundenen Layout-Fehler (zwei Maßsysteme in der Kampfzone) und seine Asset-Folgen. Sie blockieren Kapitel 2 nicht und werden nicht von ihm blockiert.

Kapitel-2-Feinspec (Materia/Slots/AP/Magie, programmierbarer Gambit-Editor) folgt erst, wenn **M15–M17** stehen und Kapitel 1 nachweislich durchspielbar ist – bewusst sequenziell, kein Parallel-Design auf einem unbewiesenen Fundament (Leitplanke „Skelett zuerst", `02_Leitfaden_Kernmechaniken.md` §5). Beide Playtests haben genau diese Leitplanke bestätigt: Das Skelett war nicht bewiesen, sondern nur simuliert.

**Reihenfolge: M15 → M16 → M17 → M18 → menschlicher Durchlauf → M19a → M19b → Kapitel-2-Feinspec.** M19 steht **hinter** dem Durchlauf, nicht davor: Es ändert keine Mechanik und blockiert Kapitel 2 nicht – und der Durchlauf soll die Ventil-Ökonomie messen, nicht eine frische Inszenierung. Umgekehrt liefert er die Zahl, die M19 braucht: **wie oft** ein Aufenthalt tatsächlich vorkommt (Wiederholungsermüdung, s. M19b). M15 ist der Blocker (einzige Run-Währung), M16 macht Können bezahlbar, M17 macht die Mechaniken überhaupt sichtbar, **M18 holt den Spec-Rückstand ein, damit der Durchlauf das aktuelle Spiel misst und nicht das vorletzte.**

*Die Kapitel-2-Achse ist bereits festgelegt* (`spec/gambits.md` §5a, Konzept-Session 02.08.2026): Der Gambit-Editor automatisiert die **Ausführung**, die Entscheidung wandert auf „welche Regel, für welche Figur" – Regelplätze als knapper **Party-Pool** (1 → ~4 in Kapitel 2), Konfiguration je Charakter, Erwerb nur über Erst-Clears und Reunion-Essenz. Offen und in der nächsten Konzept-Session dran: die automatisierbaren Gegner-Mechaniken (Bedingung a), die AP-Knappheit (greift die EXP-Dämpfung auch auf AP?), das Slot-Wachstum innerhalb eines Durchlaufs und Analyse im Materia-Starter-Set.

**Was Kapitel 2 aus der 30.07.-Session mitbekommt:**

- **Materia-Erwerb läuft nicht über eine Kaufwährung.** Ein Gil-finanzierter Materia-Shop ist verworfen (dieselbe Inflationsfalle). Quellen sind **Erst-Clears** und das **Reunion-Upgrade-Menü** (Essenz).
- **Kostenregel:** Preise steigen mit der **Zahl der bisherigen Käufe**, nicht mit einem festen Betrag.
- **Je System genau ein Milestone**, danach freie Wahl – keine Milestone-Kette, das wäre die Tier-Leiter auf der Meta-Ebene.
- **Der Gambit-Editor ist der Automatisierungspfad für gelöste Mechaniken:** Was der Spieler in Durchlauf 1 von Hand gelöst hat, gießt er danach in eine Regel. Das ist der Bogen manuell → planerisch und die eigentliche Antwort auf „woran wachsen Gambits".

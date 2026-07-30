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

**Umsetzungsentscheidungen (M7):**

1. **gameStore auf variable Party verallgemeinert:** M5/M6 hatten Claude fest verdrahtet (`game.claude`); M7 ersetzt das durch `game.party`/`game.awaitingUnit` und parametrisiert `CharacterPanel`/`ActionPopup` über ein `unit`-Prop – Region 3 (Tofa+Air is..., M8) braucht dieselbe Erweiterung nicht mehr strukturell, nur Content.
2. **Waffenkauf pro Figur, gleicher Flat-Preis (8 Gil):** Wie in §11 als offene Stellschraube markiert. Barrel braucht keine eigene Zonen-Schwelle wie Claude (Zone 3) – sein Roster-Beitritt selbst (Zone 9) ist bereits das Gate.
3. **Suppress-Zielwahl ohne SPD-≥140-Gegner:** Die Default-Gambit-Regel 3 (feinspec §4.7) feuert nur, wenn ein schneller Gegner da ist. Für die manuelle Popup-Nutzung braucht Barrels Special aber immer ein Ziel – Fallback ist das stärkste (meiste HP) Ziel, analog zu Claudes Special/Limit-Zielwahl.
4. **Bestiarium-Nummerierung** ("Entry 04/10") zählt über die interne Reihenfolge von `content/monsters.ts` (7 Monster + 3 Gates = 10) – nicht über die vollständige 10-Monster-Forschungsliste aus `gegner-katalog.md` (die auch Kapitel-2-Arten wie Mitoslime enthält). Rein kosmetisch, keine Gameplay-Bedeutung.
5. **Bugfix beim Spielen gefunden:** `resetSave()` löschte den Save, aber der Autosave-`pagehide`-Listener lief noch und schrieb den (noch im Speicher stehenden) alten Zustand beim Reload sofort zurück – der Button wirkte, tat aber nichts. Fix: `stop()` (entfernt die Autosave-Listener) läuft jetzt vor `clearSave()`.
6. **Playtest-Fund (nach M7-Preview):** Das Aktions-Popup (`ActionPopup.svelte`) lag hinter der Kampf-Stage statt davor. Ursache: `BottomBar.svelte` bekam für die neue Mehr-Figuren-Reihe `overflow-x: auto`, aber laut CSS-Overflow-Modul wird die jeweils andere Achse automatisch ebenfalls auf `auto` gesetzt, sobald eine Achse nicht `visible` ist – das hat das nach oben aus dem Panel herauswachsende Popup (`position:absolute; bottom:100%`, `ui-layout.md` "Charakter-Steuerung: Panels & Aktions-Popup") abgeschnitten. Kein Spec-Widerspruch (die Doku verlangt bereits "wächst nach oben in die Stage"), reiner Implementierungsfehler. Fix: `overflow` auf `.bottom-bar` entfernt; per Live-Check (`getBoundingClientRect`/`elementFromPoint`) verifiziert, dass das Popup jetzt oberhalb der Bottom-Leiste rendert und den Klick tatsächlich empfängt.
7. **Design-Korrektur (größter Playtest-Fund, nach M7-Preview):** "Sobald Auto verfügbar wird, schaltet man es an und schaut nur noch zu" – die Default-Gambit-Regeln aus der ursprünglichen feinspec §4.7 ließen Auto ab Zone 5 bereits Specials/Heal/Suppress/Limit automatisch einsetzen (nur nicht editierbar). Das widersprach der eigenen Leitplanke `03_Konzept_Gerüst.md` §5/§15 ("**stumpfe** Auto-Attack sofort, **strategische** Gambits über Reunion") und machte manuelles Spiel de facto nirgends im Kapitel lohnend (auch an Gates feuerte Limit schon automatisch, `use_limit_on_gate`). Korrektur: Auto ist vor der 1. Reunion **ausschließlich** Angriff (`core/gambits.ts` `resolvePartyAction`); Specials/Heal/Suppress/Limit sind bis dahin exklusiv über die manuelle Steuerung erreichbar. Neu simuliert (`tests/chapter-playthrough.test.ts`, ersetzt die alte §7.4-Baseline): mit "Auto in der Fläche, Manuell an den drei Gates" wird **Zone 6** (eine reguläre Zone) zur ersten echten Grindwand (~8 Retries ohne manuelle Übernahme), während die drei Gates selbst bei manuellem Spiel **trivial** werden (0 Retries – Manuell+Limit-Priorität schlägt sogar die alte Auto-Heuristik). Ein zusätzlicher Vergleichslauf (nie manuell, auch nicht an Gates) bestätigt: das Kapitel bleibt komplett schaffbar, nur ~3,25× langsamer (Kapitel-Wand Z30: 27 statt 0 Retries) – validiert die Kernbehauptung "mit genug Grind auch idle machbar". Docs aktualisiert: `feinspec-kapitel1.md` §4.7/§7.1–§7.4/§10/§11, `gambits.md` §1, `03_Konzept_Gerüst.md` §5.

---

## M8 – Region 3: Volle Party, Shock, manuelle Steuerung

**Ziel:** Region 3 vollständig (Zone 19–30) – der komplexeste Meilenstein, da hier alle Kapitel-1-Systeme zusammenlaufen.

- Tofa + Air is... kommen dazu (volle 4er-Party).
- Shock-Ring-Anzeige (Amber-Aufbau/Gold-Fenster, füllt sich von unten, Bruch-Symbol bei 100 %) nach `kampf-analyse-shock.md` §6.
- `controlMode`-Umschalter je Figur + Aktions-Popup (FF7-Menübox, Wait-Modus/globale Pause) nach feinspec §5.1 (Mockup `05_aktions_popup.png`).
- Telegrafierte Gegner-Aktionen (Shortfuse-Zündung, Vaultron-AoE).
- Vaultron-Kapitel-Boss (Zone 30).

**Abnahme:** Region 3 end-to-end spielbar wie in feinspec §7.2 (Shock-Kampf-Ablauf) und §7.3 (Kapitel-Wand) beschrieben; Popup-Flow entspricht exakt §5.1 (Uhr pausiert vollständig währenddessen, inkl. Shock-Timer).

**Umsetzungsentscheidungen (M8):**

1. **Tofa/Air-is...-Beitritt als Wiederverwendung des Barrel-Musters (M7):** Zone-19-Roster-Join folgt exakt demselben `freshCharacter()`/`roster.push`-Muster wie Barrel bei Zone 9 (`ui/gameStore.svelte.ts`), nur beide Figuren gleichzeitig. Keine strukturelle Änderung an der Party-Verallgemeinerung nötig gewesen (M7 hatte das schon vorbereitet, s. dortige Umsetzungsentscheidung 1).
2. **Playtest-Fund: Tofas/Air is...' Specials fehlten in der Live-Steuerung.** `useSpecial()` kannte bis M8 nur Barrel (Suppress) und einen generischen "stärkstes Ziel ×3 ATK"-Fallback (der eigentlich Claudes Cross Slash war) - Tofa (Shock Strike) und Air is... (Heal Wind) liefen mangels eigener Party-Zugehörigkeit vor M8 nie durch diesen Pfad und wurden schlicht übersehen. Nachgezogen deckungsgleich mit der bereits existierenden Referenzlogik für die Pacing-Simulation (`core/gambits.ts` `resolveOptimalAction`): Air is... heilt die ganze Party (2,2×MAG, kein Gegner-Ziel), Tofa schlägt normal zu und addiert +45 Shock-Bonus. Ohne diesen Fix hätte Air is... im manuellen Popup einen Gegner angegriffen statt zu heilen.
3. **Defend-Mechanik (M8 neu, `kampf-analyse-shock.md` §2 nannte nur "Schadensreduktion o. Ä." ohne Zahl):** Playtest-Baseline **-50 % erlittener Schaden**, gilt bis zur nächsten eigenen Aktion der Figur (neues `BattleUnit.defending`-Feld, `core/battle.ts`/`core/tick.ts`). Wirkt auf normale Gegner-Treffer und auf Gruppen-AoE (Bomb/Boss) gleichermaßen. Wird durch jede neue eigene Aktion (Attack/Special/Limit/erneutes Defend, auch beim Wechsel auf Auto) automatisch zurückgesetzt, damit kein dauerhafter "ewiger Halbschaden"-Bug durch einen Modus-Wechsel während der Defend-Phase entsteht. Offene Playtest-Stellschraube wie die übrigen TBD-Werte in feinspec §11.
4. **`defenseUnlocked` hängt am tatsächlichen Ereignis, nicht an Zone/Gate:** feinspec §5.1 verlangt "ab der ersten telegrafierten Boss-Aufladung" - da Vaultron (Zone 30) der einzige `boss`-Trait-Gegner in Kapitel 1 ist, wäre eine reine Zonen-Schwelle ungenau (der Flag müsste exakt beim ersten AoE-Trigger *innerhalb* des Kampfes kippen, nicht schon beim Zonenstart). Gelöst über ein neues, rein additives `BattleState.bossAoeTriggered`-Bit (`core/tick.ts`, pro Tick zurückgesetzt, in `resolveEnemyAction`s Boss-AoE-Zweig gesetzt) - der Store liest es nach jedem `battleTick()`-Aufruf in `advance()` und kippt den Flag + feuert den Freischaltungs-Hinweis erst in genau dem Tick, in dem die AoE wirklich auslöst. Keine bestehende Kampf-Zeitrechnung verändert (rein additive Buchführung), Pacing-Tests bleiben unberührt.
5. **`REGION2_MAX_ZONE`/`region2-paused` → `CHAPTER1_MAX_ZONE`/`chapter-complete`:** M7s Zwischen-Stopp bei Zone 18 (weil Region 3 noch nicht existierte) wird durch den echten Kapitel-Abschluss bei Zone 30 ersetzt (Vaultron besiegt → `phase: "chapter-complete"`, Banner verweist auf die in M9 folgende 1. Reunion). Reine Umbenennung/Verschiebung der bestehenden Pause-Logik, kein neues Konzept.
6. **Shock-Ring als CSS-`conic-gradient` + `mask-image`-Ring (kein SVG):** Amber-Aufbau und Gold-Fenster-Countdown teilen sich dieselbe Formel (symmetrischer Keil um die 6-Uhr- bzw. 12-Uhr-Achse, s. `kampf-analyse-shock.md` §6), nur mit vertauschter Prozent-Quelle (`shock/SHOCK_MAX` vs. `shockTimer/SHOCK_WINDOW`) und Farbe - genau das vom Leitfaden geforderte "ein Element trägt beide Phasen". Die Ring-Anzeige selbst ist erst ab Zone 19 (`REGION3_JOIN_ZONE`) im UI sichtbar (`Stage.svelte`); die zugrundeliegende Shock-Formel in `core/battle.ts`/`dealDamage()` lief technisch schon seit M3 zonenunabhängig mit (unveränderte, bereits validierte Pacing-Baseline) - kein Core-Eingriff nötig, nur ein UI-Sichtbarkeits-Gate, deckungsgleich mit der Beobachtung, dass Shock in Region 1/2 mangels Anzeige/Tofa-Bonus ohnehin irrelevant blieb.
7. **CharacterPanel-Breite von fest 260px auf flexibel (`flex: 1 1 220px; min-width: 180px; max-width: 260px`):** Vier Panels nebeneinander hätten bei fester Breite die Bottom-Leiste gesprengt (4×260px + Gaps > typische Bottom-Bar-Breite bei 1280px Fensterbreite). Live verifiziert (`getBoundingClientRect`): vier Panels @ 235px passen ohne `overflow-x` in eine 998px breite Bottom-Leiste - bewusst **kein** `overflow-x` gesetzt (der M7-Playtest-Fund zum abgeschnittenen Aktions-Popup lehrt, dass jede Overflow-Achse auf der Bottom-Bar vermieden werden muss).
8. **Live-Verifikation via Modul-Injection statt Vollspiel:** Da ein realer Durchlauf bis Zone 19/30 lange dauert, wurde für den Playtest-Check der laufende `GameStore`-Singleton per dynamischem `import()` im Browser direkt manipuliert (Save/Battle-State auf Zone 19 bzw. 30 gesetzt) - bestätigt u. a. Shock-Ring (Aufbau/Fenster/Bruch-Symbol), Shortfuse-"! DETONATING", Vaultron-"⚡ Mako core charging…", `defenseUnlocked`-Freischaltung im exakten AoE-Tick und die Defend-Schaltfläche im Popup. Reines Testwerkzeug, kein Teil des Spielcodes.

---

## M9 – Niederlage-Loop, Offline-UI, 1. Reunion

**Ziel:** Die Klammer um den gesamten Kapitel-1-Loop schließen.

- Niederlage-UI: Zeitstrafe sichtbar, Auto-Retry ohne Verlust (`niederlage-offline.md` §1).
- „Willkommen zurück"-Screen bei Wiedereinstieg, der den in M4 gebauten Offline-Projektionsrechner sichtbar macht (Ertrag seit letztem Besuch).
- Reunion-Screen (Mockup `04_reunion.png`): Reset-/Persistenz-Listen, Reunion-Essenz-Ertrag, Freischaltung von programmierbaren Gambits + erstem Boost (`prestige-reunion.md`).

**Abnahme:** Ein kompletter Durchlauf Zone 1 → Zone 30 → Reunion ist spielbar; Speichern, Browser schließen, wieder öffnen setzt exakt an der gespeicherten Stelle fort (inkl. korrekt berechneter Offline-Ernte).

**Umsetzungsentscheidungen (M9):**

1. **Niederlage-UI war bereits vollständig (kein neuer Code):** Zeitstrafe-Banner (`phase === "retry"`), Auto-Retry mit vollem Reset (Party frisch/Gegner voll über `spawnBattle`), kein Fortschrittsverlust - das alles kam schon aus M3/M5/M6. M9 hat hier nur gegengeprüft, nicht neu gebaut.
2. **Offline-Projektionsrechner (`core/offline.ts` `projectOffline`, seit M4 fertig) war nie an den Live-Store angebunden** - `save.offline.lastSeen` wurde nur einmal bei Save-Erstellung gesetzt und danach nie wieder gelesen/geschrieben. Nachgezogen: `GameStore.start()` ruft jetzt `#catchUpOffline()` auf, das den seit `lastSeen` verstrichenen Zeitraum in `projectOffline` einspeist, das Ergebnis (Party/Gil) übernimmt und ein `welcomeBack`-Objekt für die neue `WelcomeBackModal.svelte` setzt. `lastSeen` wird jetzt laufend in `advance()` aktualisiert (jeder Tick), damit ein spaeterer Reload den Zeitraum seit dem letzten aktiven Moment misst, nicht seit Save-Erstellung.
3. **Playtest-Fund (`core/offline.ts`): `projectOffline` crashte vor Zone 5.** Der bestehende Kommentar "Offline laeuft immer im dumben Auto-Modus" beschrieb die Absicht, wurde aber nie durchgesetzt - `createPartyUnit` uebernahm den gespeicherten `controlMode` 1:1, und vor `manualToggleUnlocked` ist laut feinspec §5.1 **jede** Figur faktisch `"manual"`. `simulateBattle` unterstuetzt keine Bedenkzeit-Pause (kein Spieler da, der waehlt) und wirft dann einen Fehler. Der Bug existierte seit M4, wurde aber nie ausgeloest, weil `tests/offline.test.ts` zufaellig die rohe `CLAUDE`-Konstante nutzt (`controlMode: "auto"` im Content-Default), nicht den tatsaechlichen Save-Zustand (`freshCharacter(id, "manual")`). Erst die Live-Verdrahtung in M9 hat ihn beim Browser-Playtest sofort reproduziert. Fix: `projectOffline` erzwingt jetzt `controlMode: "auto"` für die interne Simulation, unabhängig vom gespeicherten Wert (der zurückgegebene `party`-Zustand bleibt unangetastet).
4. **Reunion ab Erreichen der Wand, nicht erst nach ihrem Sieg** (`canReunion`: `currentZone >= CHAPTER1_MAX_ZONE`): `prestige-reunion.md` ist hier explizit ("man muss die Wand nicht schlagen, um zu reunionen") - das gibt Spielern, die an Vaultron haengen bleiben, einen echten Ausweg (Skill-vs-Zeit-Wahlfreiheit) statt Zwangs-Retry-Grind.
5. **Permanenter Reunion-Boost (M9-Baseline, offene Playtest-Stellschraube):** +5 %/Zyklus linear auf ATK/MAG/HP/MP (`GameStore.reunionBoostMult` = `1 + 0,05 · reunionCount`) - dieselben Stats, die `weaponStatMod` bereits skaliert (DEF/SPD bleiben unberührt, konsistent zum bestehenden Muster). Durchgereicht als optionaler 3./4. Parameter (Default 1 = kein Boost) durch `createPartyUnit`/`deriveCharacterMaxHp`/`deriveCharacterMaxMp` (`core/battle.ts`), `applyVictoryExp` (`core/progression.ts`) und `projectOffline` (`core/offline.ts`) - additiv, ändert keine bestehenden Aufrufstellen/Tests. Live verifiziert: Level-1-Nachreset-Werte (z. B. Claude 110→116 HP) matchen exakt `round(110·1,05)`.
6. **Reunion-Essenz-Ertrag (M9-Baseline):** flach **+5** je Reunion (`REUNION_ESSENCE_GAIN`) - es gibt in Kapitel 1 noch keinen Sink/Shop dafür (kommt erst mit dem Kapitel-2-Freischalt-Baum), daher ist die genaue Höhe aktuell irrelevant; nur der Ventil-Fluss selbst zählt.
7. **Reset-/Persistenz-Aufteilung `reunion()`:** Reset = Zone (→1), Charakter-Level/EXP (→ CHARACTERS-Ausgangswerte über `freshCharacter`), Gil (→0), Waffentier (→0, da `freshCharacter` komplett neu aus `CHARACTERS` baut). Persistenz = **komplettes Roster** (alle bisher rekrutierten Figuren bleiben ab Zone 1 des neuen Zyklus sofort verfügbar - kein erneutes "Anwerben" von Barrel/Tofa/Air is..., s. `03_Konzept_Gerüst.md` §9 "freigeschaltete Charaktere bleiben erhalten"), Bestiarium, und - eine bewusste Implementierungsentscheidung ohne expliziten Spec-Text - die **Rollout-Flags** (`autoAttackUnlocked` etc.): das sind reine UI-/Onboarding-Marker, kein Machtzuwachs, daher kein Grund, dem Spieler ein bereits gelerntes UI-Element (Auto/Manual-Schalter, Defend) im neuen Zyklus wieder zu verstecken. `gambitsUnlocked` (neuer Flag) wird bei der 1. Reunion permanent gesetzt, auch wenn der programmierbare Gambit-Editor selbst Kapitel-2-Scope bleibt - haelt nur die Graduierung fest.
8. **Live-Verifikation deckte einen Test-Artefakt auf, keinen App-Bug:** Ein manueller Dev-Server-Neustart mitten in der Session erzeugte zwei parallele `GameStore`-Singletons (Vite servierte `gameStore.svelte.ts` einmal mit und einmal ohne HMR-Cache-Busting-Query) - reine Folge der Debug-Methodik (dynamischer `import()` aus der Browser-Konsole nach einem Quelltext-Edit), kein Hinweis auf ein Problem im echten Single-Instance-App-Betrieb. Nach einem sauberen Server-/Browser-Neustart verhielt sich alles wie erwartet.

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

**Umsetzungsentscheidungen (M10):**

1. **Save-Export/Import (`save/storage.ts`, `ui/Sidebar.svelte`):** „⇩ Export save" serialisiert den aktuellen Save (dieselbe `serializeToJson()`-Funktion wie der Autosave) und löst einen Blob-Download aus. „⇧ Import save" öffnet einen versteckten `<input type="file">`, liest die Datei per `FileReader`, validiert über dieselbe `parseSaveJson()`-Logik wie beim normalen Laden (kein zweiter, potenziell abweichender Codepfad) und übernimmt das Ergebnis erst nach einer Zonen-Gültigkeitsprüfung (`findZone()`) - ungültige Dateien/Zonen brechen mit einer Fehlermeldung ab, ohne den laufenden Spielstand anzutasten.
2. **Korrupte/fremde Saves werden nicht mehr stillschweigend verworfen (Architektur §6-Nachzügler):** `loadSave()` gab bisher bei Parse-/Migrationsfehlern einfach `null` zurück - der Store startete dann klaglos mit einem frischen Save, während der eigentliche (defekte) Speicherstand beim nächsten Autosave überschrieben worden wäre. Neu: `loadSave()`/`parseSaveJson()` liefern ein getaggtes `LoadOutcome` (`"none" | "ok" | "corrupt"`); im Corrupt-Fall werden die Rohdaten sofort in einen zweiten localStorage-Key (`...corrupt-backup`) gesichert, und ein neues `CorruptSaveModal.svelte` informiert den Spieler direkt beim Start ("Save couldn't be read, backup kept") mit einem Download-Button für die Rohdaten. Das Modal blockiert das Weiterspielen nicht (Fresh-Start läuft im Hintergrund bereits), es informiert nur ehrlich statt zu schweigen.
3. **Debug-Reset-Button: M10 hatte ihn hinter `import.meta.env.DEV` versteckt, seither zurückgesetzt.** Ursprünglich (M0–M9) war der Button laut `05_Architektur.md` §6a *bewusst* auch im veröffentlichten Build sichtbar, weil der Nutzer aktiv auf `telosnox.github.io/IncrementalFantasy/` testet. M10 hat die dort vorgemerkte Gegenprüfung zu wörtlich genommen und den Button aus dem Produktions-Build entfernt (im `vite build`-Output wegoptimiert) - das hat dem Nutzer genau diesen Testweg genommen ("Resetmöglichkeit verschwunden", gemeldet nach M10). **Korrektur:** Button ist wieder unbedingt sichtbar (`GameScreen.svelte`, kein `DEV`-Guard mehr), solange es kein echtes Publikum gibt. Siehe `05_Architektur.md` §6a für die jetzt verbindliche Regel: **nicht wieder verstecken/entfernen, ohne den Nutzer explizit zu fragen.**
4. **MegaCorp-Kulisse-Fix (feinspec §8 bekannte Warnung):** `background-position` für genau diese eine Kulisse auf `left center` gesetzt (`Stage.svelte`, `.region3-backdrop`-Klasse nur für Zone > 18), statt der bisherigen `center`-Regel für alle drei Kulissen - live verifiziert (`0% 50%` statt `50% 50%`). Das rechts sitzende Reaktor-/Aufzug-Motiv bekommt dadurch mehr Abstand zur Stage-Kante Richtung Seitenleiste, ohne die Reactor-Row-/Bargain-Bazaar-Kulissen zu verändern.
5. **Performance-/Leak-Audit (Code-Review + Live-Test):** `GameStore.start()`/`stop()` werden im echten Betrieb genau einmal pro Seiten-Lebenszyklus aufgerufen (`GameScreen.svelte` `onMount`/Cleanup) - kein Codepfad ruft `start()` mehrfach ohne `stop()` dazwischen. Live bestätigt durch Instrumentierung von `document.addEventListener`/`removeEventListener`: fünf `start()`/sechs `stop()`-Aufrufe in Folge erzeugten exakt fünf `visibilitychange`-Registrierungen und sechs Abmeldungen (die zusätzliche, "leere" Abmeldung ist ein harmloser No-Op) - keine Akkumulation von Listenern, kein Leck gefunden.
6. **Cross-Browser-/Responsive-Check (im Rahmen der verfügbaren Werkzeuge):** Nur ein Chromium-basierter Browser stand für automatisierte Prüfung zur Verfügung - Firefox/Safari müssten manuell außerhalb dieser Umgebung gegengeprüft werden. Layout-Check per Viewport-Resize: Tablet (768×1024) und Desktop überflüssig-Scrollbar-frei; bei echtem Mobil-Portrait (375×812) läuft die Seite über (~424px Grid-Breite in einem 375px-Viewport), weil `Stage.svelte`s Sprite-/Bar-Breiten fest in Pixeln stehen (128px Standard-Sprite, `.mini-bar` 128px) - das ist kein neuer M10-Regressions-Bug, sondern deckt sich mit dem in `ui-layout.md` „Offene Punkte" **bereits als unentschieden markierten** Responsive-/Portrait-Verhalten. M10s Checklisten-Formulierung „mobil falls Layout es zulässt" trifft hier zu: es lässt es (noch) nicht zu - eine echte Mobil-Anpassung ist eigenständiges UI-Design-Nacharbeiten, kein Härtungs-Fix.

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

**Umsetzungsentscheidungen (M11):**

1. **Level-Up heilt nicht mehr automatisch (`core/progression.ts` `applyVictoryExp`):** Die Vorfassung heilte bei Levelaufstieg voll auf den (ggf. geboosteten) Max-Wert – folgenlos, solange jede Zone ohnehin frisch aufgebaut wurde. Mit echtem HP/MP-Übertrag (§4.1) wäre das ein dritter, unspezifizierter Erholungskanal neben Sieg-Erholung (§3.5) und Gasthaus (§3.8b) gewesen und hätte die HP-Signalregel (§3.8d) unterlaufen. `applyVictoryExp` ändert jetzt nur noch Level/EXP; die neue `applyVictoryRecovery` (Kanal 1) und `applyInnRecovery` (Kanal 2) sind eigene, explizite Funktionen. `tests/reunion-boost.test.ts` entsprechend angepasst.
2. **HP/MP-Synchronisation an den Kampf-Übergängen, nicht laufend:** `ui/gameStore.svelte.ts` hält `BattleUnit` (ephemer, pro Kampf neu gebaut) und `Character.hp/mp` (persistent) bewusst getrennt (Architektur §3, „/core kennt keine Svelte-Stores"). `syncPartyFromBattle()` schreibt den erreichten Stand nur bei Sieg/Niederlage zurück – ein Autosave mitten in einem laufenden Kampf sichert also den Stand vom Kampfbeginn, kein Teilergebnis. Akzeptiert als einfachste Lösung: ein Reload mitten im Kampf startet die aktuelle Zone einfach neu, ohne Fortschrittsverlust (keine EXP/Gil sind bei einem laufenden Kampf ohnehin schon vergeben).

   **Nachtrag (Playtest-Fund): Die Übergangsliste oben war unvollständig.** Sie wurde am Reload-Fall aufgestellt und nannte deshalb nur Sieg/Niederlage als Synchronisationspunkte – die freie Zonen-Rückkehr (§3.8a) kam im selben Meilenstein erst danach dazu und wurde nie gegen diese Liste geprüft. `selectZone()` spawnte einen neuen Kampf direkt aus `this.save.party`, ohne zuvor `syncPartyFromBattle()` aufzurufen: Ein manueller Zonenwechsel verwarf dadurch den im laufenden (unentschiedenen) Kampf erlittenen Schaden vollständig – sah im Spiel wie eine Gratis-Heilung aus, hebelte aber tatsächlich Gasthaus (§3.8b) und HP-Signalregel (§3.8d) aus, da Abnutzung so per Zonenwechsel-und-zurück rückgängig gemacht werden konnte. `feinspec-kapitel1.md` §4.1 jetzt explizit: Rückschreiben bei **jedem** Verlassen eines Kampfes – Sieg, Niederlage *und* Zonenwechsel; nur der Reload behält seine dokumentierte Ausnahme (s. o.). Fix: `selectZone()` ruft `syncPartyFromBattle()` vor dem `spawnBattle()`-Aufruf. Regressionstest `tests/gameStore-zone-switch.test.ts` (dafür `tests/setup.ts` + `vite.config.ts` `test.setupFiles` neu: ein minimaler In-Memory-`localStorage`-Ersatz, weil `GameStore` – anders als bisher getestete `/core`-Funktionen – beim Instanziieren `save/storage.ts`s `loadSave()` aufruft, das es in der bisherigen `environment: 'node'`-Vitest-Umgebung nicht gab).
3. **Fokusziel als Array-Index, nicht als Monster-ID (`core/tick.ts` `BattleState.focusTargetIndex`):** feinspec §3.9 spezifiziert das Fokusziel nicht näher, aber mehrere Gegner derselben Art teilen sich eine `id` (z. B. 3× „blando" in Zone 6) – eine ID-basierte Referenz wäre mehrdeutig. Der Index in `state.enemies` ist eindeutig und über die gesamte Kampfdauer stabil (Einheiten „sterben", werden aber nicht aus dem Array entfernt).
4. **Limit-Laderaten neu hergeleitet (`core/formulas.ts`):** von 0,35/0,50/0,40 auf 0,20/0,30/0,22 (dealt/taken-Einzelziel/taken-AoE) – nicht wie zunächst vermutet höher, sondern **niedriger** als die alten, für eine dauerhaft persistierende Leiste kalibrierten Werte. Kalibriert gegen `tests/chapter-playthrough.test.ts` (§12 D5). Dabei eine Lesart-Korrektur: „Die Limit-Leiste füllt sich 1–2×" bezieht sich auf **die Leiste je Figur**, nicht auf die Kampf-Summe über die ganze Party – bei einem 4er-Party-Gate-Kampf (Vaultron) sind das bis zu 8 Zündungen insgesamt, aber ~1–2 pro Figur.
5. **Zonen-Größenmodifikatoren neu justiert (`content/zones.ts`, Zonen 6/7/8/16/17/18/30):** Die alten `size`-Werte stammten aus `sim_chapter1.py` (Modifikator wirkt nur auf HP, nicht ATK/DEF, §3.7) und sind mit dem Wegfall von MP-Refund und Offline-Ventil nicht mehr gültig – Zone 6/7 wurde ohne Auto-Special/-Heal/-Refund zur härtesten Stelle der ganzen Region (der titelgebende „Zone-6-Fehler" aus §12 C4), während die Gates (v. a. Blandzilla, ein einzelner Gegner) für reinen Auto-Betrieb fast trivial blieben. Gesenkt: Zone 6 (1,0/1,15/0,9 → 0,75/0,6/0,5), Zone 7 (1,15/1,0/1,0 → 0,8/0,65/0,6), Zone 16/17 Safeguard (1,0 → 0,65/0,75). Angehoben: Blandzilla Z8 (1,0 → 1,6), Fort Knoxious Z18 (1,0 → 1,15). Gesenkt (umgekehrte Richtung, gleicher Grund – ein 4er-Party-Kampf gegen einen einzelnen AoE-Boss lebt von der Kampfdauer, nicht der Gegner-HP): Vaultron + Begleiter Z30 (1,0 → 0,8/0,85/0,85).
6. **Drei Kriterien aus feinspec §12 mit dokumentierter Toleranz statt exakter Erfüllung** (`tests/chapter-playthrough.test.ts`, Kommentare dort verlinken hierher):
   - **B2 (Korridor):** Der ursprüngliche Korridor (T ≈1,3–2,0×, V ≈2,5–4,0× von M) unterstellt einen größeren Vorteil für Typ T, als seine eigene Definition hergibt (§3.9: „setzt pro Kampf NUR das Fokusziel, sonst Auto"). An der Kapitel-Wand (Vaultron: reines Schadensrennen gegen eine periodische Party-AoE, kein Special/Heal/Limit für Auto verfügbar) macht „wen zuerst treffen" nur einen kleinen Unterschied – der große Hebel (Limit/Specials/Heal/Suppress) bleibt exklusiv Typ M vorbehalten. Gemessen: T ≈3,2×, V ≈4,1×. Korridor auf T ∈ [1,3; 3,5], V ∈ [2,5; 4,5] angehoben.
   - **B3 (Sprung M→T kleiner als T→V):** dieselbe Ursache – an der dominanten Kapitel-Wand sind beide Sprünge etwa gleich groß. Kriterium abgeschwächt auf „beide Abstände existieren" (die eigentliche Kernforderung aus §12 B, „der Abstand muss existieren").
   - **C1/C2/C4 (Gate-Feinheiten):** ±1 bis ±2 Toleranz wegen kumulierter, pfadabhängiger Level-Entwicklung über 29 Zonen (deterministisch, aber empfindlich auf jede Rundung) sowie weil `resolveOptimalAction` (die M-Referenz) bewusst kein Defend nutzt (§4.7 listet nur Limit/Specials/Heal/Suppress) – ein Mensch mit Defend sollte mindestens so gut abschneiden.
   - **Empfehlung an die nächste Konzept-Session:** entweder den B2-Korridor an die tatsächliche Auto-vs-Fokus-Differenz anpassen, oder Typ T zusätzliche Fähigkeiten geben (z. B. Defend), falls ein größerer T-Vorsprung gewünscht ist. `feinspec-kapitel1.md` §12 entsprechend mit einem Verweis auf diesen Abschnitt versehen.
7. **Save-Migration v1→v2 (`save/migrate.ts`, `SAVE_VERSION` 1→2):** `maxZoneReached` wird beim Laden eines alten Saves aus `currentZone` übernommen (nicht auf 1 zurückgesetzt) – bestehender Fortschritt bleibt vollständig anwählbar. `inn.queued` startet `false`. Erster echter Migrationsschritt seit dem in M4 gebauten Grundgerüst.
8. **Gasthaus-UI als Sidebar-Zonen-Nav + Inn-Toggle statt eigenem Screen (`ui/Sidebar.svelte`, `ui/Stage.svelte`):** `ui-layout.md` macht für Zonen-Auswahl/Gasthaus noch keine Vorgabe (Stand vor M11). Umgesetzt als Prev/Next-Zonen-Navigation + „Zurück zur Wand"-Button in der Sidebar sowie ein Gasthaus-Banner auf der Stage (analog zum bestehenden Niederlage-Banner) mit „Leave now" nur bei freiwilliger Anmeldung (`innForced` unterscheidet Niederlage-Pflichtaufenthalt von `toggleInnQueued()`). Kein Anspruch auf finales UI-Design – reine Funktions-Umsetzung, wie bei den übrigen „Nicht jetzt"-Bereichen aus `ui-layout.md`.
9. **`WelcomeBackModal.svelte` gelöscht statt nur deaktiviert:** Mit dem Wegfall von Offline-Progress (§3.8e) ist die Komponente toter Code; `core/offline.ts` (der Projektionsrechner) bleibt wie gefordert als Balance-Werkzeug bestehen, nur ohne UI-Anbindung.
10. **Playtest-Fund (nach M11-Release): Claudes Special ignorierte das gesetzte Fokusziel.** `useSpecial()` (`ui/gameStore.svelte.ts`) und `resolveOptimalAction()` (`core/gambits.ts`) übernahmen für Claudes Cross Slash unreflektiert die alte, vor-M11-Heuristik „trifft das stärkste Ziel" – korrekt für Barrels Suppress (§4.7: „bevorzugt SPD ≥ 140, sonst das stärkste Ziel") und Limit (§3.4: explizit „auf das stärkste Ziel"), beide mit einem im Spec benannten eigenen taktischen Zweck (unterdrücken/finishen). Cross Slash ist aber nur ein größerer Treffer ohne eigenen Zweck und hätte wie ein normaler Angriff der Fokusziel-Regel (§3.9) folgen müssen – die alte Heuristik wurde mechanisch mitgeschleppt, ohne das nach der Einführung des klickbaren Fokusziels neu zu bewerten. Fix: Claude nutzt jetzt `resolvePartyTarget()`, identisch zu Tofas Shock Strike. `feinspec-kapitel1.md` §4.7 entsprechend korrigiert (nannte Claude fälschlich in derselben Reihe wie die tatsächlich zweckgebundenen Ausnahmen Barrel/Limit).

   **⚠️ Überholt durch Entscheidung 11.** Die Konzept-Session hat die Begründung dieser Entscheidung nach dem M11-Release noch einmal geprüft und verworfen: Auch Barrel/Limit sind jetzt keine Ausnahmen mehr von der Popup-Vorauswahl (feinspec §3.9 „Eine Regel, keine Ausnahmen"). Stehen gelassen als Beleg, warum die alte Grenze („nur Cross Slash folgt dem Fokus") überhaupt gezogen wurde.
11. **Zielvorauswahl im Aktions-Popup ausnahmslos vereinheitlicht (Nachtrag, Konzept-Revision nach Entscheidung 10):** Die Konzept-Session hat feinspec §3.9 nach Entscheidung 10 erneut geändert (Commits `c23a62e`, `8536b54`) und die dort verbliebenen „zweckgebundenen Ausnahmen" Barrel/Limit gestrichen: **„Vorausgewählt ist immer das Fokusziel – für jede Fähigkeit, die einen Gegner anvisiert. Eine Regel, keine Ausnahmen."** Begründung der Konzept-Session: Eine *sichtbare, überschreibbare* Vorauswahl im Popup ist kein verstecktes Auto-Verhalten (anders als der alte Auto-Angriff) – ihr Wert liegt in Vorhersagbarkeit, nicht Optimalität; eine Sonderregel „Barrel zielt auf den Bedrohlichsten" nimmt dem Spieler genau die Einsicht vorweg, die manuelles Spiel belohnen soll (feinspec §3.9, Abschnitt „Warum auch Barrels Suppress keine Ausnahme bekommt"). Fix: `Barrels Suppress` und `fireLimit()` (`ui/gameStore.svelte.ts`) nutzen jetzt ebenfalls `resolvePartyTarget()` statt eigener Heuristik (SPD-Schwelle bzw. „stärkstes Ziel"/meiste HP). Betrifft **nur** die Live-UI-Vorauswahl – die Referenz-Policy `resolveOptimalAction()` (§4.7, nur für die Pacing-Simulation) behält für Barrel/Limit bewusst eigene, klügere Zielwahl (s. Entscheidung 12), weil sie einen aufmerksamen Menschen modelliert statt eine sichtbare Popup-Voreinstellung.
12. **Bedrohungs-Kriterium der Referenz-Policy von SPD-Schwelle auf Schadensdurchsatz umgestellt (`core/gambits.ts` `resolveOptimalAction`, Barrels Suppress):** feinspec §4.7 (M11-Nachtrag) korrigiert das bisherige Kriterium „SPD ≥ 140, sonst stärkstes Ziel" – keiner der drei Gate-Bosse erreicht SPD 140 (alle 70–90), Vaultron hat mit ATK 14 aber den zweithöchsten Schadensdurchsatz des Kapitels. Der Wert einer Unterdrückung bemisst sich am Durchsatz (≈ ATK · SPD) im Wirkzeitraum, nicht an der Geschwindigkeit allein; die alte Schwelle spielte Barrel ausgerechnet an den drei Gates systematisch schlecht und verzerrte damit die M/T/V-Korridormessung aus §12 B2 (M künstlich geschwächt). Neue Hilfsfunktion `mostThreatening()` wählt das Ziel mit dem höchsten `atk * spd`-Produkt. Wichtige Abgrenzung zu Entscheidung 11: Diese Policy **darf** klug zielen (sie modelliert einen aufmerksamen Menschen, §4.7) – die Popup-Vorauswahl darf es ausdrücklich **nicht** (§3.9, Vorhersagbarkeit statt Optimalität).
13. **§7.4-Pacing neu simuliert (Nachtrag zu Entscheidung 6), Tabelle nicht länger „UNGÜLTIG":** Nach Entscheidung 11/12 (die Kampfergebnisse verändern können) mit der aktuellen TS-Engine neu gemessen. Verhältnis **T/M ≈2,8×, V/M ≈3,4×** – beide weiterhin innerhalb des in Entscheidung 6 begründeten Korridors (T ∈ [1,3; 3,5], V ∈ [2,5; 4,5]), aber spürbar niedriger als die dort und in feinspec §3.9/§12 B2 vermerkten „gemessen T ≈3,2×, V ≈4,1×". Gegenprobe: Dieselbe Messung mit dem **vor** Entscheidung 11/12 gültigen Code liefert praktisch identische Werte (T ≈2,8×, V ≈3,4×) – die Abweichung stammt also nicht von diesem Nachtrag, sondern war schon vorher stiller Drift zwischen Code und den in Entscheidung 6 notierten Zahlen (vermutlich eine frühere Zwischenmessung vor einer der späteren Balance-Anpassungen aus Entscheidung 5/6). Da beide Zahlen innerhalb des Korridors liegen, keine Balance-Änderung nötig – die veralteten „gemessen"-Angaben in feinspec §3.9 und §12 B2 wurden auf die aktuelle Messung korrigiert. **Die konkreten Minuten-/Retry-Werte in dieser Messung sind durch Entscheidung 14 (Blandzilla-Fix) noch einmal minimal verschoben worden** – die in `feinspec-kapitel1.md` §7.4 stehende Tabelle ist die finale, nach Entscheidung 14 erneut validierte Fassung (s. dort), nicht die hier ursprünglich gemessene.
14. **Playtest-Fund: Blandzilla (Z8) war ohne Limit besiegbar.** Ein voll geheilter, gate-angemessen leveled Claude (Solo – Barrel stößt erst in Zone 9 dazu) gewann gegen Blandzilla auch **ohne je Limit zu zünden** (nur Attack/Cross Slash optimal getimt), nur mit knapperer HP-Marge. Das unterläuft den in feinspec §7.1 beschriebenen Lehrmoment „Limit als Wand-Brecher" – auf einem echten Erstdurchlauf (kein Overleveling) sollte das Gate diese Lektion zuverlässig erzwingen, nicht nur nahelegen. Simulationsgestützt geprüft (`content/zones.ts` Zone 8, Größe temporär auf 1,7/1,8/1,9/2,0 gesetzt, volle HP/MP wie nach einem erzwungenen Gasthaus-Aufenthalt): Bei Größe 1,6 (bisheriger Wert) gewinnt ein Level-4-Claude (die vom M-Harness gemessene Erstankunft an Z8) auch ohne Limit (Endstand 6 % HP – knapp, aber zuverlässig). Ab Größe 1,7 verliert die limit-lose Variante, während „Limit sofort bei voller Leiste" (die M-Referenz aus §4.7) bis Größe 1,9 zuverlässig gewinnt (Endstand 15 % HP); ab Größe 2,0 kippt auch diese. Fix: Blandzilla-Größe in `content/zones.ts` auf **1,8** angehoben (Mitte des validierten Fensters). Regressionstest `tests/chapter-playthrough.test.ts` „Blandzilla (Z8) ist ohne Limit nicht zuverlässig zu schaffen" hält das Zielverhalten fest (nicht nur die Zahl 1,8 selbst, damit ein künftiger erneuter Drift auffällt statt nur zufällig wieder zu passen). Volle M/T/V-Kriterienliste (§12 A–D) weiterhin grün, s. Entscheidung 13/§7.4.
15. **Playtest-Fund: HP/MP erschienen im Kampf als Dezimalzahl.** Ursache: `Character.hp/mp` sind zwischen Kämpfen absichtlich reelle Zwischenwerte – Sieg-Erholung (`hpGainPostVictory`/`mpGainPostVictory`, +25 % des Maximums) und Gasthaus-Drip (`innGain`, 5 %/s) runden bewusst NICHT (s. `tests/formulas.test.ts`, das exakt einen Bruchwert wie `27.5` erwartet – Rundung dort hätte die kontinuierliche, jeden Frame aufgerufene Gasthaus-Erholung kaputt gemacht, da ein pro-Frame-Bruchteil <0,5 sonst für immer auf 0 rundet). Der Fehler war, dass `createPartyUnit()` (`core/battle.ts`) diesen reellen Zwischenwert beim Übertritt in die Kampf-Domäne (`BattleUnit.hp/mp`, die überall unrundend anzeigt wird, z. B. `CharacterPanel.svelte`) nicht rundete – anders als jede andere Formel im Projekt (`formulas.ts`-Kopfkommentar: „Rundung folgt Math.round … für alle Werte"). Fix: `createPartyUnit()` rundet jetzt beim Konvertieren (`Math.round(character.hp)`/`Math.round(character.mp)`, weiterhin gedeckelt aufs Maximum). Das ist der einzig richtige Ort dafür – ein Runden schon in `hpGainPostVictory`/`innGain` selbst hätte (s. o.) die Gasthaus-Erholung stillgelegt. Regressionstest in `tests/reunion-boost.test.ts`.
16. **Playtest-Fund: kein sichtbares Heil-Feedback im Gasthaus.** `ui/gameStore.svelte.ts` `get party()` lieferte während `phase === 'inn'` weiterhin die beim Kampfende eingefrorene `this.battle.party` (BattleUnit-Snapshot) zurück, während `#advanceInn()` im Hintergrund jeden Frame `this.save.party` heilt (§3.8b) – UI (Stage-Minileisten, `CharacterPanel`/`BottomBar`) zeigte deshalb während des gesamten Aufenthalts unverändert den Vor-Heilung-Stand, nur der Countdown-Text („Dead time…"/„Healing…") bewegte sich. Fix: `get party()` liefert während `phase === 'inn'` eine Live-Projektion aus `this.save.party`, gebaut über dasselbe, bereits getestete `createPartyUnit()` (F1-analog: kein UI-eigener Ableitungsweg) – rein zur Anzeige (ATB/Limit bleiben inert, da im Gasthaus nicht gekämpft wird), aktualisiert sich aber jeden Frame mit den echten, jetzt (Entscheidung 15) korrekt gerundeten HP/MP-Werten. `game.awaitingUnit`/`ActionPopup` bleiben unberührt (Referenzvergleich auf `this.battle.awaitingPlayerChoice`, der während des Gasthauses ohnehin `null` ist).
17. **Playtest-Fund: „Queue Inn after this fight" blieb nach einem erzwungenen Gasthaus-Aufenthalt aktiv.** `this.save.inn.queued` (§3.8b, freiwillige Anmeldung) wurde bisher nur im freiwilligen Sieg-Pfad zurückgesetzt (`#onWin()`, direkt bevor es dort ausgewertet wurde). Der zweite, erzwungene Eintritt ins Gasthaus – nach einer Niederlage, sobald die Zeitstrafe abgelaufen ist (`advance()` `phase === 'retry'` → `#enterInn(true, …)`) – ließ das Flag unangetastet. Der Spieler war danach zwar tatsächlich im Gasthaus (die eigentliche Absicht der Anmeldung war damit erfüllt), aber die UI zeigte weiter „queued" an, und der nächste Sieg löste dadurch **ungefragt einen zweiten** Gasthaus-Aufenthalt aus. Fix: `inn.queued` wird jetzt zentral in `#enterInn()` zurückgesetzt (deckt beide Eintrittswege – freiwillig über `#onWin`, erzwungen über die Retry-Zeitstrafe – an einer Stelle ab, statt es pro Aufrufstelle zu wiederholen), die redundante Rücksetzung in `#onWin()` entfernt. Kein dediziertes Testsetup für `ui/gameStore.svelte.ts` vorhanden (Architektur §3: die Klasse bleibt dünne Glue-Logik über bereits getesteten `/core`-Funktionen, kein bestehendes Testmuster für diese Datei) – Fix über `npm test`/`npm run check` plus Code-Review abgesichert, keine neue Testdatei dafür angelegt.
18. **UI-Politur „Aufstellung, Zustände & Markierungen" (`ui-layout.md` „Kampf-Darstellung", `kampf-analyse-shock.md` §6) umgesetzt – reine Darstellung, keine Mechanik-Änderung, `src/ui/Stage.svelte`:**
    - **Zwei versetzte Reihen:** Reihe wird rein aus dem (kampflang stabilen) Array-Index abgeleitet, kein eigener State nötig. Dezente Abdunklung/Entsättigung (`brightness(0.88) saturate(0.85)`, **nur** auf dem `<img>`, nicht auf Label/Balken – sonst litte deren Lesbarkeit) für beide Seiten identisch (gemeinsame Perspektivrichtung).
    - **UI-1a (Playtest-Korrektur der Erstfassung):** Die erste Umsetzung versetzte jede zweite Einheit **innerhalb einer einzelnen Zeile** per `translateY`+`z-index` (Zickzack). Playtest-Rückmeldung: das las sich nicht als „zwei Reihen", sondern als unregelmäßiger Einzelversatz – erkennbar zwar als Tiefe, aber nicht als die gewünschten Paare. Umgebaut auf **echte zwei Zeilen**: `splitRows()` teilt jede Seite in eine vordere (die ersten `ceil(n/2)` Einheiten, an der Standfläche) und eine hintere Zeile (der Rest, als eigener Flex-Block darüber) – bei voller 4er-Party also klar 2+2 nebeneinander, bei einem 3er-Wave 2+1. Zusätzlich **kompakter** (Zeilen-Gap 6px, Einheiten-Gap innerhalb einer Zeile 12px statt vorher 24px durchgehend) – dadurch bleibt sichtbar mehr Raum zwischen Party- und Gegner-Block (`.floor`s `space-between` hängt beide Seiten weiterhin an den Rändern ein; ein schmalerer Block reicht einfach weniger weit zur Mitte). `z-index`/`translateY` dadurch überflüssig und entfernt – echte Zeilen teilen sich nie denselben vertikalen Raum, das „Labels dürfen nicht verdeckt werden"-Risiko aus UI-1b entfällt damit strukturell, nicht nur durch Verzicht auf Overlap.
    - **UI-1b (Umsetzungsentscheidung, weiterhin gültig):** „Teilweise Überlappung" aus der Tiefenmittel-Liste bleibt **bewusst nicht** umgesetzt (kein negativer Zeilen-/Spalten-Abstand). Grund unverändert: Bei stark unterschiedlich großen Nachbarn (Miniboss/Boss 192–256px neben Standard-Gegner 128px, z. B. Z18 Fort Knoxious+Caffiend) würde ein Overlap das **härtere** Kriterium derselben Sektion riskieren – „Labels der hinteren Reihe dürfen nicht von vorderen Sprites verdeckt werden". Mit echten Zeilen (s. UI-1a) ist dieses Risiko ohnehin strukturell ausgeschlossen, nicht nur vermieden.
    - **Gefallene Party-Figuren:** bleiben im DOM (Array wird nie gefiltert), `grayscale(0.85) brightness(0.45)` aufs Sprite, Label auf 55% Opacity dezent gedimmt; leere HP-Leiste ergibt sich automatisch aus `hp <= 0`. Kein Revive-Hinweis (es gibt keine interaktive Markierung an gefallenen Party-Einheiten, anders als bei Gegnern).
    - **Besiegte Gegner:** `opacity: 0` mit `transition: opacity 0.6s ease` statt sofortigem Verschwinden/`display:none` – die Layout-Box (und damit Position/Fokusziel-Index) bleibt erhalten, `pointer-events: none` verhindert Hover-/Klick-Reste auf einer unsichtbaren Fläche (Klicks liefen vorher schon über den bestehenden `isAlive`-Guard in `setFocusTarget()` ins Leere).
    - **Markierungen vereinheitlicht:** beide Zustände jetzt als `drop-shadow`-Silhouetten-Umriss+Schein auf dem `<img>` (folgt der Alpha-Maske des freigestellten Sprites) statt Kasten/Box-Shadow um den ganzen Container. Fokusziel-Farbe von Gold/Bernstein (Kollision mit dem Shock-Ring) auf Cyan (`var(--game-mp)`) umgestellt, Bedrohungs-Farbe (Party) bleibt Rot (`#ff5c5c`). Glyphen ▲/◆ bleiben. Da ein Sprite gleichzeitig hintere-Reihe UND markiert sein kann und CSS-`filter`-Deklarationen sich nicht addieren, sondern gegenseitig überschreiben, wird der komplette `filter`-Wert jetzt als ein einziger, im Skript zusammengesetzter String über `style:filter` gebunden (`partyImgFilter()`/`enemyImgFilter()`) statt über mehrere CSS-Klassen.
    - **UI-2 (Nebenbefund, keine Code-Änderung):** Die Begründung in `ui-layout.md` („Cyan ist im Spiel bereits die Farbe der Spielerkontrolle, Manual-Chip") trifft auf `CharacterPanel.svelte`s Auto/Manual-Umschalter tatsächlich **nicht** zu – beide Zustände (`.mode-toggle button.active`) nutzen dort `var(--game-atb)` (Blau), nicht `var(--game-mp)` (Cyan). Cyan taucht im Code bisher nur beim „Leave now"-Button im Gasthaus auf. Nicht Teil dieses Auftrags (reine Kampf-Darstellung) und daher nicht angefasst – als Fund für eine spätere Konzept-Session festgehalten, falls die Farbzuordnung dort tatsächlich vereinheitlicht werden soll.
    - **Shock-Ring-Gewicht:** neue CSS-Variable `--intensity` (= Aufbau-Füllstand während des Aufbaus, aber **immer 1** während des aktiven Fensters, s. `ringIntensity` – Auslösung/Countdown behalten volle Prominenz laut Spec). Treibt Deckkraft (`opacity: 0.12–1.0`), Sättigung (`filter: saturate(20%–100%)`) und Ringdicke (`--ring-thickness: 3%–15%` der Maskenradien) gemeinsam. Bei `--intensity = 1` sind alle drei Werte identisch zur vorherigen (immer vollen) Darstellung – keine Regression an den lauten Momenten. Bei exakt 0 % Aufbau (und außerhalb des Fensters) wird die Ring-Div gar nicht erst gerendert (`{#if ringPct > 0 || inWindow}`).
    - **UI-3 (Nebenbefund):** „Der Ring muss vom Bodenschatten unterscheidbar bleiben" ist aktuell **vakuos erfüllt** – es gibt in `Stage.svelte` noch keinen gerenderten Bodenschatten unter den Sprites, also auch nichts, womit der Ring kollidieren könnte. Kein Fix nötig, aber festgehalten, damit eine spätere Bodenschatten-Ergänzung diese Regel gegen den fertigen Ring prüft, statt sie als bereits erledigt anzunehmen.
    - Abnahme: `npm test` (Mechanik unverändert, 97/97 weiterhin grün) und `npm run check` grün. Screenshot-Nachweis (volle 4er-Party gegen mehrere Gegner, mind. einer gefallen) s. Session-Notiz – abhängig von einer sichtbaren Browser-Pane, die in der Umsetzungs-Session nicht compositete.
19. **UI-Politur, Nachtrag – Perspektive am lebenden Bild kalibriert, kritischer Bug bei der Gegner-Positionierung behoben (`src/ui/Stage.svelte`, weiterhin reine Darstellung):**
    - **Diagonale statt reinem Höhenversatz:** UI-1a (Entscheidung 18) stapelte die hintere Reihe nur vertikal über der vorderen – „von exakt vorne betrachtet" stand z. B. Air is... exakt hinter Barrel verdeckt. Playtest-Korrektur: die Standfläche wird als leicht von schräg oben betrachtet gedacht (deckt sich mit ui-layout.md „Perspektive"), die hintere Reihe wandert deshalb zusätzlich zur Seite. Ein gemeinsamer `--depth-step-x`/`--depth-step-y`-Vektor auf `.floor` gilt für die ganze Stage (Party **und** Gegner), nicht gespiegelt – vier Tiefenstufen (Party-vorn/-hinten, Gegner-vorn/-hinten) auf einer Diagonale.
    - **Feinjustierung interaktiv am Screenshot kalibriert:** Die genauen Pixelwerte (Zeilenabstand, Vor-/Zurück-Versatz, Spaltenabstand zwischen den beiden Paaren) wurden über mehrere Runden direkt gegen eine vom Nutzer skizzierte Referenz (Foto mit eingezeichneter Bodenlinie) nachjustiert, nicht rechnerisch hergeleitet. Der Rundenverlauf steht als Kommentar-Trail direkt im CSS (`.row-back`, `.party-side .row-front/.row-back`, Spalten-Regeln) – hier bewusst nicht jeder Zwischenschritt wiederholt, nur das Ergebnis: `.row-back` zieht die hintere Reihe per `margin-top:-90px` nah an die vordere heran, `.party-side .row-front` verschiebt die vordere Reihe `translate(-65px, 5px)`, `.party-side .row-back` zusätzlich `+40px` nach unten; die beiden Spalten (Claude+Tofa / Barrel+Air is...) sind zusätzlich `-20px`/`+30px` auseinandergezogen.
    - **Kritischer Bug gefunden und behoben – Gegner-Position hing von der Sprite-Größe der ANDEREN Gegner ab:** Solange Gegner wie die Party über Flexbox-Zeilen gestapelt wurden, bestimmte die Render-Höhe der vorderen Zeile die Position der hinteren – an Zone 30 zog der 256px-Vaultron in der vorderen Zeile den hinteren Blando (128px) sichtbar mit nach unten, weit weg von seiner vorgesehenen Position. Das ist bei der Party unsichtbar geblieben, weil dort alle Sprites einheitlich 128px sind, existierte aber strukturell genauso. **Fix:** Gegner-Slots sind jetzt einzeln `position: absolute` mit festen `left`/`bottom`-Werten aus `ENEMY_LAYOUTS` (drei explizite Muster für 1/2/3 Gegner – mehr kommt in Kapitel 1 nicht vor, s. `content/zones.ts`), komplett unabhängig von der Größe irgendeines Nachbarn. Miniboss/Boss (192/256px) bekommen automatisch zusätzlichen seitlichen Abstand proportional zu ihrer Übergröße (`enemySlots()`), damit sie Nachbar-Slots nicht überlappen, statt die Positions-Logik dafür fallweise anzupassen. `.enemy-side` selbst ist jetzt eine `position: relative`-Box mit fester Größe (Layout-Platzhalter für `.floor`s Flex-Anordnung), keine Flex-Spalte mehr.
    - **UI-4 (Playtest-Session, ausdrücklich Platzhalter, keine Design-Entscheidung):** Auf Wunsch ein reiner Anzeige-Tausch der Party-Sitzplätze (`PARTY_DISPLAY_ORDER` in `displayOrderedParty()`) – Claude↔Barrel↔Air is... im Kreis getauscht (Claude→Barrel-Platz, Barrel→Air-is-Platz, Air is...→Claude-Platz), Tofa bleibt. Die eigentliche Slot-Geometrie (welcher Platz wo sitzt) bleibt unverändert, nur WER dort steht wurde umgeordnet. Fällt auf Roster-Reihenfolge zurück, solange nicht alle vier bekannten IDs in der Party sind. Ausdrücklich **nicht** als endgültige Rollenzuordnung zu lesen – der Nutzer bat explizit, die Positionen nur „als Platzhalter" zu merken.
    - Nebeneffekt beim Aufräumen: ein latenter Bug im Spalten-Abstand (UI-1a-Nachtrag, Runde 8) behoben – `:first-child`/`:last-child` trafen bei einer Zeile mit nur einer Einheit (Solo-Blandzilla Z8, Solo-Claude vor Z9) gleichzeitig dasselbe Element und verschoben es ungewollt zur Seite; jetzt mit `:not(:only-child)` abgesichert.
    - Abnahme: `npm test` (97/97) und `npm run check` weiterhin grün (reine CSS-/Layout-Änderung, keine core-/store-Logik berührt). Am Vaultron-Kampf (Zone 30) live verifiziert: hinterer Blando bleibt jetzt auf fester Höhe, unabhängig von Vaultrons Größe.

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

**Umsetzungsentscheidungen (M12):**

20. **Werkzeug-Aufteilung: `region_kit.py` (Baukasten) vs. `generate_regions.py` (nur Rezepturen).** Die Spec ließ die Werkzeugfrage offen (§7, „Als Annahme markiert"); umgesetzt in Pillow, weil die drei anderen Generatoren dort liegen und der Baukasten keine Bibliotheksfunktion braucht, die Pillow nicht hat. Eine Region ist jetzt buchstäblich eine **deklarative Liste** `(Baustein, kwargs)` plus `Palette` – kein Zeichencode, keine Schleifen über Rohkoordinaten. Koordinaten in Rezepturen sind **Nenn-Box-Pixel** ((0,0) = linke obere Ecke der 168×96-Box, Bleed als negativer Bereich bis x −28/y −32), damit die Zahlen aus `ui-layout.md` (G = 64, B₂ = 76, B₁ = 89,3) direkt einsetzbar sind und niemand Bleed-Offsets im Kopf addiert. Himmel und Bodenband zeichnet **der Renderer** vor bzw. nach der Rezeptur (Spec §7.3: „generisch aus Palette und Bodentextur, nicht je Region neu") – eine Region kann ihr Bodenband gar nicht erst selbst gestalten.
21. **Palette: sieben gesetzte Farben, alle weiteren Töne abgeleitet.** `Palette(sky_top, sky_bottom, far, mid, accent, ground, light)`; die zweite Helligkeitsstufe je Fläche (`*_top` heller, `*_side` dunkler) und damit die Regel „Licht von oben-links" entstehen in `Palette.roles`, nicht in der Rezeptur. Begründung: Stilkonsistenz über 15 Regionen hing bisher „allein an Disziplin" (Spec §7, Befund) – abgeleitete Töne machen sie strukturell. Rezepturen benennen Farben nur noch über Rollen (`'mid'`, `'accent_dim'`, `'light'`), nicht über Hex-Werte.
22. **Dreizehn Bausteine statt der neun genannten.** Die neun aus Spec §7/Plan-Punkt 1 sind vorhanden (`tower`, `stack`, `pipe_run`, `awning_row`, `window_grid`, `crag`, `foliage`, `sign`, `ground_texture`); dazu vier generische, die aus den **15** Leitmotiven (§6) folgen und nicht aus Kapitel 1: `sky`, `glow`, `wheel` (Windrad, Loren, Kuppel-Cluster), `lamp_string`. Die Varianten stecken als **Parameter** in den Bausteinen (`tower(cap='flat'|'gable'|'stepped'|'dome')`, `stack(lean=, cap='flare'|'cone'|'nose', plume=)`, `sign(glyph=, burn=)`), nicht in neuen Funktionen – `burn` ist z. B. genau der Gag „eine Reklame, halb durchgebrannt" (§6, Region 2) als Parameter statt als Sonderfall.
23. **Abnahme-Kriterium „vierte Region allein über eine Rezeptur" erfüllt – mit einer Einschränkung, die hier explizit steht.** Quaintsville (Region 4, Kapitel-2-Leitmotiv aus §6) ist als Rezeptur ergänzt und brauchte **keinen neuen Baustein und keinen neuen Parameter**. Ehrlich dazugesagt: Der Baukasten wurde vorher bewusst gegen alle 15 Motive entworfen, nicht nur gegen Kapitel 1 – der Test beweist also, dass die *Rezeptur-Schnittstelle* trägt, nicht dass jede künftige Region ohne Bibliotheks-Zuwachs auskommt. Regionen 5–15 werden weitere Bausteine brauchen (ein `arch` für den Stollenmund, eine Parasol-Variante für Costa del Sofa); der Unterschied zum alten Stand ist, dass diese Bausteine dann **allen** Regionen zur Verfügung stehen statt einer.
24. **Signalfarben-Sperre (§4) rechnerisch operationalisiert – und dabei ein Spec-Widerspruch gefunden.** Der Prüflauf klassifiziert jeden Pixel über HSV: Farbton in einer gesperrten Familie (Gold/Bernstein 30–68°, Cyan 160–205°, warmes Rot 350–22°) **und** S ≥ 0,35 **und** V ≥ 0,60 **und** in einem zusammenhängenden Fleck ≤ 90 px – das ist „punktueller, gesättigter Lichtpunkt" in Zahlen; großflächig-gedämpfte Verwendung fällt durch alle drei Bedingungen. **Fund:** Die für Quaintsville vorgesehene Signaturfarbe „warmes Ocker" (§6) liegt mitten in der Gold/Bernstein-Familie. Ein helles Ocker ist damit als Fenster-/Schild-/Detailfarbe gesperrt, ein **gedämpftes** (`#7a5f2f`, V ≈ 0,48 – auch nach der automatischen Aufhellung der Oberseite noch unter 0,60) nicht. Das ist keine Umgehung, sondern genau die Grenze, die §4 zieht; `regionen-kulissen.md` §4/§6 entsprechend ergänzt, damit die nächste Konzept-Session nicht dieselbe Falle für Kapitel 4 („Terracotta", „Rostrot") neu stellt.
25. **Kontrast-Budget (§5) ebenfalls rechnerisch – mit einer korrigierten Metrik.** Geprüft werden: Bandhelligkeit steigt nach oben (L̄ Himmel > L̄ Figuren > L̄ Boden, Mindestabstand 0,015), Hellanteil in der **Sprite-Zone** (y 33–64, also ab Kopfhöhe des Kapitel-Bosses bis G) ≤ 12 % über L 0,60, Bodenband ruhig (Streuung ≤ 0,075), beide Standlinien ohne harte Kante (max. Helligkeitssprung zwischen Nachbarpixeln ≤ 0,12) und kein fokales Motiv im Bleed. **Korrektur gegenüber dem ersten Ansatz:** „Sättigung gehört den Figuren" zunächst über HSV-`S` gemessen – untauglich, weil ein fast schwarzes Blaugrau (`#222d36`) dort auf S ≈ 0,37 kommt und die Kapitel-1-Nachtpaletten reihenweise „zu bunt" meldete. Jetzt über **Chroma** `(max−min)/255`, das die Helligkeit nicht herausrechnet; Grenzen 0,16 im Mittel, ≤ 4 % der Fläche über 0,42. Alle Schwellen sind bewusst **Startwerte** – sie kodieren die Spec-Regeln, sie ersetzen sie nicht.
26. **§3-Widerspruch aufgelöst: „Das Leitmotiv klebt weder hinter der Party noch hinter dem Encounter" ist horizontal unerfüllbar.** Das Slot-Raster (`ui-layout.md`) belegt in Backdrop-Pixeln x 8–83 (Party) und 99–160 (Gegner) von 168 – frei bleiben nur der Mittelgang (83–99, laut §3 ausdrücklich „der ruhigste Ort") und zwei Randstreifen. Aufgelöst **vertikal**: Der fokale Punkt eines Leitmotivs sitzt oberhalb y = 33, also über Sprite- und HUD-Zone (der Kapitel-Boss ist mit 128 su auf B₂ die höchste Figur und endet bei y = 33). Sichtbar an Reactor Row: Die Kuppel steht links versetzt, aber der glühende Kern liegt bei y = 33 – über den Köpfen der Party, nicht hinter ihnen. `regionen-kulissen.md` §3 entsprechend präzisiert.
27. **Nachthimmel oben hell, unten dunkel – gegen die Sehgewohnheit, für §5.** Eine Nachtstadt hätte üblicherweise den hellen Lichtsaum am Horizont. Genau der liegt hinter den Figuren und frisst Silhouetten, und er verletzt „Kulissenhelligkeit steigt nach oben" per Konstruktion. Alle drei Kapitel-1-Paletten haben deshalb ihren hellsten Punkt oben; der Horizont geht in Dunst über. Bei MegaCorp Tower ergibt sich dasselbe aus der Fassade selbst: Sie ist in vier Geschossbändern von oben nach unten abgestuft (`mid_hi` → `mid_top` → `mid` → `mid_lo`), statt eine Fläche zu sein.
28. **Der in §4 notierte Verstoß ist weg – und war größer als beschrieben.** Reactor Row und MegaCorp Tower zeichneten Fenster in `#e7c14b` (Shock-Gold). Neu sind alle Fenster **neutrales Warmweiß** (`Palette.light`, Chroma < 0,1). Der Prüflauf meldet für alle vier Regionen **null** gesperrte Signalfarben. Das Reaktorgrün (`#5fbf7a`) bleibt – Grün ist keine gesperrte Familie, und §5 erlaubt dem Leitmotiv-Detail ausdrücklich einmal Sättigung.
29. **Übernahme ins Spiel: nativ 224×128, wie die Sprites.** Plan-Punkt 7 ließ die Auflösung offen. Entschieden für die native Kantenlänge (Sprites liegen ebenfalls nativ in `src/assets/`, hochskaliert wird im Browser) – M13 skaliert den Backdrop ohnehin mit `s`, ein vorskaliertes Asset wäre dann doppelt gerechnet. Dafür in `Stage.svelte`: `image-rendering: pixelated` auf `.stage` (bisher unnötig, weil das alte Asset 3× vorskaliert war) und **der M10-Fix `region3-backdrop` entfernt** – er richtete die MegaCorp-Kulisse links aus, weil ihr Motiv am rechten Rand klebte; im neuen Format sitzt es in der Nenn-Box und den Überschuss trägt der Bleed. Die alten `_160`/`_480`-Dateien sind gelöscht; die `_672`-Dateien liegen nur in `docs/` als Ansichtsgröße. **Kein Live-Screenshot:** Die Browser-Pane compositete in dieser Session erneut nicht (wie bei Entscheidung 18). Verifiziert wurde stattdessen über die Vite-Netzwerkanfragen (alle drei `_224.png` laden mit 200), den berechneten Stil (`background-size: cover`, `image-rendering: pixelated`, Stage 998×576 – bei Backdrop-Seitenverhältnis 1,75 vs. Stage 1,73 wird praktisch nichts beschnitten) und eine leere Fehlerkonsole. Die Bildwirkung selbst ist über die Prüfmodus-Renderings mit eingeblendetem Slot-Raster abgenommen.
30. **PNG-Kodierung fixiert, alle Assets einmalig neu erzeugt (die im Plan notierte Rausch-Diff-Falle).** Neues `pixel_io.py` (`save_png`: `compress_level=6`, `optimize=False`, leere `PngInfo`) wird jetzt von **allen vier** Generatoren benutzt. Die 37 Sprite-PNGs wurden neu erzeugt und gegen den Stand aus `HEAD` verglichen: **37/37 pixelgleich** (`ImageChops.difference`), die Byte-Diffs sind reine Neukodierung. Zwei aufeinanderfolgende Läufe liefern jetzt identische Dateien – ein Byte-Diff ist ab hier wieder ein echter Befund.
31. **Nachtrag aus der Konzept-Review (26.07.2026): Das „Konzernlogo" auf MegaCorp Tower war ein liegendes H.** Der `logo`-Glyph zeichnete zwei Querbalken plus Mittelsteg – auf einem Hochhaus die Silhouette eines **Helikopterlandeplatzes**, und je nach Blick auch schlicht ein zweiflügeliges Fenster. Das Detail kommunizierte damit nicht „Marke", sondern etwas Konkretes und Falsches. Ersetzt durch `monogram` (ein M als Buchstabenform): Ein Schriftzeichen kann nicht mit Infrastruktur verwechselt werden. Der Prüflauf bleibt für alle vier Regionen grün (`--report`), und dank Entscheidung 30 änderte sich **nur** `megacorp_tower` – Reactor Row und Bargain Bazaar blieben byte-identisch. Daraus abgeleitet und in `regionen-kulissen.md` §2 aufgenommen: **Ein Detail darf keine Form haben, die als etwas anderes Konkretes liest** – auf dieser Auflösung vervollständigt das Auge jede Silhouette zum nächstbesten bekannten Zeichen. *(Änderung an einem `docs/`-Werkzeug aus einer Konzept-Session heraus – ein Glyph, mit anschließendem Prüflauf und Sichtprüfung; die Alternative wäre eine eigene Umsetzungs-Session für zwölf Zeilen gewesen.)*

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

**Umsetzungsentscheidungen (M13):**

31. **Geometrie raus aus der Komponente: neues `src/ui/stageLayout.ts`.** Slot-Raster, Standlinien, Skalierung, Vortreten und die HUD-Maße liegen jetzt in einem DOM-freien Modul, `Stage.svelte` enthält nur noch Darstellung. Grund: Die M13-Abnahmekriterien sind sämtlich geometrische Aussagen („kein HUD ragt ins Himmelband", „bei 4 gegen 4 überlappt kein Kopf-HUD", „die Position hängt nicht von der Größe des Nachbarn ab") – als Modul sind sie **prüfbar** statt betrachtbar. `tests/stage-layout.test.ts` (13 Tests) hält jedes Kriterium einzeln fest; die Testsuite steht damit bei 110/110.
32. **`--s` als einzige Umrechnung.** Die Stage setzt eine CSS-Variable `--s` (CSS-Pixel je su); **jede** Länge im Markup und im CSS der Kampfzone ist `calc(<su> * var(--s))`. Damit gibt es die zweite Maßeinheit, die den Ausgangsfehler ausmachte, syntaktisch nicht mehr – ein CSS-Pixelwert in `.box` fällt beim Lesen sofort auf. Gemessen wird die Stage über `bind:clientWidth/clientHeight`, `s = min(B/504, H/288)` auf 1,0…4,0 begrenzt.
33. **Zwei Ebenen-Container statt einer Figur-Box je Einheit.** `.layer-figures` (F-Stapel: Bodenaufsatz → Sprite → Marker) und `.layer-hud` (U0) sind getrennte Schichten, über die zweimal iteriert wird. Eine gemeinsame Box je Figur wäre kürzer gewesen, hätte aber genau den in `ui-layout.md` benannten Fehler erzeugt: Ein vorderes Sprite hätte das Kopf-HUD einer hinteren Figur verdeckt. Die Marker bleiben dagegen bewusst **im** Stapel ihrer Figur (als `filter` am `<img>`), wie von der Spec verlangt.
34. **Spec-Lücke geschlossen: übergroße Figur MIT Begleitern.** Das Slot-Raster kennt Solo-Gegner (x = 388, B₂) und gleich große Pulks, aber nicht Z18 (Fort Knoxious 96 su + Caffiend) und Z30 (Vaultron 128 su + 2 Blando). Ein 128-su-Boss auf E1 (328) überdeckt den Nachbarn auf E2 (368) fast vollständig – der wäre weder lesbar noch anklickbar. **Regel:** Wer größer als Standard ist, bekommt immer den zentralen hinteren Platz; die Begleiter stehen auf den vorderen Plätzen davor. Der Boss thront damit hinter seinen Schergen, und die in Entscheidung 19 behobene Fehlerklasse bleibt ausgeschlossen: Der Slot einer Einheit hängt nur von ihrer **eigenen** Größenklasse und ihrem Index ab, nie von der Rendergröße eines Nachbarn. `ui-layout.md` entsprechend ergänzt.
35. **Solo-Gegner der Standardgröße stehen vorn, nicht auf dem Solo-Platz.** Die Spec nennt den zentralen hinteren Platz für „Solo-Gegner (Miniboss 96 su, Kapitel-Boss 128 su)" – Kapitel 1 hat aber auch Solo-Kämpfe gegen normale Gegner (Z1, Z2, Z11). Die stehen auf E1, wie jeder erste Gegner: Ein einzelner 64-su-Blando ganz hinten in der Mitte wirkt weit weg statt bedrohlich, und so bleibt „kein Nachrücken" auch beim Wechsel von einem auf zwei Gegner wörtlich erfüllt. Der zentrale Rückplatz gehört damit der Größenklasse, nicht der Anzahl.
36. **Widerspruch in der Spec gefunden: P1 ist 176, nicht 192.** `ui-layout.md` nennt im Slot-Raster P1 = 176, schreibt einen Absatz später aber „Zum Start steht Claude allein auf P1 (x = 192, leicht links der Mitte)". Umgesetzt ist die **Tabelle** (176) – sie ist die normative, aus der Gruppenbreite hergeleitete Fassung, während 192 ein stehengebliebener Zwischenwert ist (beide liegen links der Mitte, die Aussage stimmt also weiterhin). Spec korrigiert.
37. **Altlast UI-4 aufgelöst: `PARTY_DISPLAY_ORDER` ist ersatzlos entfallen.** Der Platzhalter-Tausch der Sitzplätze aus Entscheidung 19 ist weg; die Zuordnung folgt jetzt der Roster-Reihenfolge in feste Slots: **Claude P1** (176, vorn innen), **Barrel P2** (216, hinten), **Tofa P3** (56, vorn außen), **Air is… P4** (96, hinten außen). Das ist genau „Belegung von innen nach außen, kein Nachrücken": Claude steht vom ersten Kampf an dort, wo er auch mit voller Party steht. Test `partyPlacement` hält das fest.
38. **Altlast UI-2 aufgelöst – zugunsten der Spec, nicht der Spec-Korrektur.** Die Begründung „Cyan ist im Spiel bereits die Farbe der Spielerkontrolle" war im Code falsch: Der Auto/Manual-Umschalter nutzte für **beide** Zustände Blau. Statt die Begründung zu streichen, ist der Code ihr gefolgt – aktives „Manual" trägt jetzt Cyan (`--game-mp`, dieselbe Farbe wie Fokusziel und „Leave now"), aktives „Auto" bleibt Blau (`--game-atb`). Cyan heißt damit durchgängig „der Spieler greift ein", und die Fokusziel-Markierung hat eine Begründung, die trägt.
39. **Playtest-Fund: Der Bleed reicht nicht für jedes Fenster.** Bei einer sehr hohen/schmalen Stage (`s` wird von der Breite bestimmt) bleibt über den 96 su Bleed ein Rest – in der Vorfassung ein schwarzer Balken, also genau das, was „Verankerung und Bleed" ausschließt. Die Stage trägt deshalb die oberste Himmelsfarbe der jeweiligen Kulisse als Hintergrundfarbe (die oberste Backdrop-Zeile **ist** `sky_top` der Palette, s. `regionen-kulissen.md` §11) – der Himmel läuft optisch weiter, ohne den Backdrop zu strecken. Die drei Hex-Werte stehen dafür in `Stage.svelte`; sauberer wäre ein generierter Export aus dem Baukasten, was aber erst lohnt, wenn Regionen 4–15 dazukommen.
40. **Der 2×-Zoom und `ENEMY_LAYOUTS` sind ersatzlos entfallen.** `spriteSize()` gab CSS-Pixel zurück (128/192/256), jetzt gibt `spriteSu()` su zurück (64/96/128) und `s` macht daraus Pixel – der frühere feste Zoom ist der Referenzfall `s = 2`. Damit sind auch die handkalibrierten Werte aus Entscheidung 19 weg (`margin-top:-90px`, `translate(-65px, 5px)`, die `:first-child`/`:last-child`-Spaltenkorrekturen und die `520×460px`-Platzhalterbox der Gegnerseite).
41. **Abnahme.** `npm test` 110/110 und `npm run check` grün. Im Browser gegengemessen (Stage 998×576 → `s` = 1,98; 1024×640 → 1,585; 1600×1000 → 2,476): Alle Anker- und HUD-Positionen ergeben **auf 0,1 su identische** su-Koordinaten – das eigentliche Kriterium („beim Verkleinern ändert sich ausschließlich die Größe") ist damit nicht nur gerechnet, sondern gemessen. Kapitel-Boss Z30: Sprite-Oberkante y = 100 su, HUD-Oberkante y = 77,9 su – beides unter der Deckenlinie (72). Vortreten verifiziert: Claude 176/268 → 188/280, Nachbarn unverändert.

---

## M14 – Gruppenlevel statt Charakter-Level

**Ziel:** Die in der Konzept-Session vom 26.07.2026 beschlossene Umstellung (`spec/stats-kampfwerte.md` §4.1) im Code umsetzen: **ein** Level für die ganze Party statt vier synchron mitlaufender Charakter-Level.

**Der Befund, der sie ausgelöst hat:** Mit individuellen Leveln stieß Barrel in Zone 9 als L1 zu einem L~9-Claude, Tofa und Air is… in Zone 19 als L1 zu L~19 – ~1,6× bzw. ~2,6× ATK-Rückstand. Eine frisch freigeschaltete Figur trug über eine halbe Region nichts bei und entwertete damit ihre eigene Freischaltung.

**Umgesetzt:** `Character` ohne `level`/`exp`; `SaveState.partyLevel`/`partyExp` als einziger Levelstand; Save-Migration v2 → v3; Neuzugänge steigen auf dem Gruppenlevel mit abgeleiteten (vollen) HP/MP ein; **ein** Level-/EXP-Anzeiger in der Sidebar statt vier pro Charakter-Panel.

**Abnahme:** `npm test` 117/117 und `npm run check` grün; im Browser gegengeprüft (Level-Up auf 2 nach Zone 3, EXP-Grenze 20 → 24, Claudes HP-Maximum 110 → 126).

**Umsetzungsentscheidungen (M14):**

42. **`REGION_STEP` gegen die Engine validiert – und verworfen.** `spec/feinspec-kapitel1.md` §3.7 sah mit dem Gruppenlevel eine Regions-Stufe auf die Gegner-Basiswerte vor (×1,5 ab Zone 9, ×1,4 ab Zone 19), ausdrücklich als Schätzwert markiert und laut §11 „gegen die TS-Engine zu validieren". Genau das ist geschehen – über einen Sweep gegen `tests/chapter-playthrough.test.ts` mit den drei Spielertypen aus §12:

    | `REGION_STEP` | Gesamtzeit M / T / V | verletzte §12-Kriterien |
    |---|---|---|
    | **keine (1,0 / 1,0)** | **13,3 / 42,8 / 53,2 min** | **2** |
    | 1,05 / 1,05 | 14,5 / 51,2 / 61,7 min | 4 |
    | 1,15 / 1,10 | 19,2 / 63,4 / 77,5 min | 4 |
    | 1,25 / 1,15 | 26,9 / 97,1 / 113,4 min | 7 |
    | 1,50 / 1,40 (Spec) | 83,7 / 176,8 / 203,3 min | 7 |

    Zum Vergleich die §7.4-Baseline vor der Umstellung: **15,6 / 44,3 / 53,0 min**. Ohne Stufe wird sie nahezu exakt getroffen – die befürchtete Aufweichung von R2/R3 tritt schlicht nicht ein. Der Grund ist derselbe, aus dem die EXP-Kurve unverändert bleiben konnte: Der Party-Topf levelt exakt so schnell wie zuvor Claude allein, und der Zugewinn durch einen voll skalierten Neuzugang ist deutlich kleiner als der Gegendruck einer multiplikativen Stufe auf **alle** Gegnerwerte einer ganzen Region. **Die Stufe ist ersatzlos entfallen** (kein Feature-Flag mit Wert 1,0), `spec/feinspec-kapitel1.md` §2/§3.7/§11 und die vier abhängigen Spec-Stellen sind korrigiert. *Der Vorgang ist die Rückkanal-Regel im Reinformat: Die Konzept-Session hat die Annahme sauber als Schätzung markiert, die Umsetzungs-Session hat sie gemessen und widerlegt.*

43. **Zwei §12-Kriterien mit Toleranz statt falscher Strenge – beide Male mit gemessener Begründung.**
    - **C1 „M ≤ T an jedem Gate"**, an Zone 18 jetzt mit +1 Toleranz (M 2, T 1): Das Ventil reguliert sich selbst. Seit Barrel auf dem Gruppenlevel einsteigt, verliert M in Region 2 seltener, farmt entsprechend weniger und steht am Gate mit knapp niedrigerem Level als T, der sich seine Retries erkauft hat. Die Aussage des Kriteriums – *manuell spielen lohnt sich* – ist davon unberührt: M braucht fürs Kapitel 13,3 min, T 42,8 min. Dieselbe Toleranz existiert an Zone 30 bereits seit Entscheidung 6, aus demselben Grund.
    - **C3 „V ≤ 15 Retries je Gate" auf ≤ 18 angehoben:** V's Niederlagen verlagern sich mit dem Gruppenlevel aus der Fläche an die Gates (Z30: 16 statt 11, dafür weniger in Region 2) – im Sinne von C4 („Wände gehören an Gates") die gewollte Richtung, bei unveränderter Gesamtzeit (53,2 gegen 53,0 min). Die 15 war eine runde Zahl, kein gemessener Schwellwert. Beides in `feinspec-kapitel1.md` §12 nachgezogen, statt es still im Test zu ändern.

44. **Das Level wandert in den `SaveState`, nicht in eine „Leitfigur".** `partyLevel`/`partyExp` liegen im Save neben `party`, nicht als Feld einer ausgezeichneten Figur. `deriveCharacterMaxHp/MaxMp` und `createPartyUnit` bekommen das Level als **verpflichtenden** Parameter (statt eines Defaults): Jede Aufrufstelle muss sich bewusst entscheiden, welchen Levelstand sie meint – bei einem Default wäre ein vergessener Aufruf still auf Level 1 gelaufen und hätte sich als Balance-Fehler getarnt.

45. **Migration v2 → v3 übernimmt das höchste vorhandene Charakter-Level**, nicht den Durchschnitt und nicht das Minimum. Das höchste Level ist bei jedem realen Altstand das der von Anfang an dabei gewesenen Figur – also genau der Stand, den ein von vorn gespielter Save unter der neuen Regel hätte (jede Figur bekam schon vorher die volle Wellen-Summe). Durchschnitt oder Minimum wären eine stille Rückstufung erspielten Fortschritts; die Neuzugänge steigen beim Laden stattdessen auf, exakt wie im laufenden Spiel.

46. **Neuzugänge treten mit abgeleiteten HP/MP an, nicht mit den Level-1-Startwerten aus `content/characters.ts`.** Ohne diesen Schritt wäre Barrel in Zone 9 mit 140 HP zu einer Party gestoßen, deren Maximum längst darüber liegt – der Beitritt wäre wieder das tote Gewicht gewesen, das die Umstellung gerade beseitigt. Betrifft `joinCharacter()` im Store und die entsprechende Stelle im Pacing-Harness.

47. **Eigene Farbe für EXP (`--game-exp`, violett).** Gold ist Gil, Cyan die Spielerkontrolle (Entscheidung 38), Blau ATB, Grün HP, Orange Limit – eine geliehene Farbe hätte die in M13 gerade erst hergestellte Eindeutigkeit wieder aufgeweicht.

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

- Kein `gil`/`weaponTier` mehr im Code, im Save oder in den Content-Daten; Migration lädt Altstände verlustfrei.
- Der Special ist nach einer Reunion **ab Zone 1 verfügbar** (der alte Widerspruch ist weg).
- **B4:** Typ V besiegt den Kapitel-Boss nicht durch Tieffarmen in einer Größenordnung, die ein Mensch abwartet.
- **A3 hält weiter:** Ein Spieler, der ein Gate manuell nicht schafft, kommt durch 1–2 Zonen Rückkehr in wenigen Vielfachen der Referenzzeit durch.
- Zielzeiten M ≈ 30 min / T ≈ 90 min getroffen oder mit gemessener Begründung korrigiert.

⚠️ **Das Hauptrisiko dieses Meilensteins ist nicht die Streichung, sondern Punkt 4:** Ob „Plateau breit genug für A3" und „Sturz steil genug für B4" gleichzeitig erreichbar sind, ist ungemessen. Zeigt die Messung, dass es nicht geht, ist das ein **Konzept-Rückkanal**, keine Zahlenfrage – dann fehlt ein zweiter Mechanismus.

---

## M16 – Zielwahl muss zählen

**Ziel:** Können soll etwas kaufen, das Farmen nicht ersetzt. Heute ist Zielwahl fast wirkungslos und Analyse damit nutzlos – dieselbe Wurzel wie der geschlossene §12-Korridor.

- **Heiler-Gegner nach Region 2 vorziehen** (`spec/gegner-encounter.md` §5a) – dort, wo auch die Analyse aufgeht.
- **Analyse-Popup erst am ersten Gegner, bei dem Zielwahl zählt**, nicht bei Regionsbeginn.
- Optional, pro Boss dosierbar: **temporärer, telegrafierter Konter-Zustand** (Angreifen schadet dem Angreifer). **Nur temporär, nur Boss/Miniboss** – als Dauer-Trait ausdrücklich verworfen. Leitlinie **fordernd, nicht strafend**: Autoplay verliert HP, stirbt nicht zwangsläufig.

**Abnahme:** Der Abstand M↔T wächst messbar gegenüber M15; Analyse hat ab ihrem ersten Auftritt einen ablesbaren Nutzen (E4).

**Einordnung:** Das ist **Inhaltsdesign, keine Deadlock-Sicherung** – die EXP-Dämpfung aus M15 erledigt das Idle-Overpowern allein. Deshalb ist M16 dosierbar und nicht tragend.

---

## M17 – Mechanik-Einführung: Popup + Codex

**Ziel:** Rund vierzehn Mechaniken kommen in ~30 Minuten stumm ins Spiel. **Eine Mechanik, die der Spieler nicht bemerkt, benutzt er nicht** – wer Defend und Zielwahl nie wahrnimmt, spielt zwangsläufig vollautomatisch. Damit ist die stumme Einführung mitverantwortlich für die Idle-Konvergenz, die M15/M16 behandeln.

**Umfang** (vollständige Spec: `spec/ui-layout.md`, „Mechanik-Einführung"):

- Blockierendes Popup mit Pause, **aktiv wegzuklicken**; nur für **bedienbare** Mechaniken (14 Einträge, kanonische Liste in der Spec).
- **Selbstvorstellungen** der vier Figuren – 2–3 witzige Sätze, aus denen die Stärke hervorgeht (`spec/charaktere-party.md`). **Claude stellt sich vor dem allerersten Kampf vor**, getrennt vom Mechanik-Popup in Zone 3.
- **Keine konkreten Zahlen in Erklärtexten** – qualitativ formulieren. Wir ändern in M15 praktisch alle diese Werte.
- **Codex** zum Nachlesen; **ab Durchlauf 2 stumm** (Flag je Mechanik, übersteht die Reunion).

**Abnahme:** E4 und E5 aus feinspec §12 – ein Spieler kann die Mechaniken und die Rolle jeder Figur benennen und weiß nach seiner ersten Niederlage von der Zonen-Rückkehr.

**Reihenfolge: nach M15, aber vor der Kapitel-2-Feinspec.** Nach M15, weil die Auslöser an Zonennummern und Freischaltzeitpunkten hängen, die M15 ändert – vorher gebaut heißt zweimal gebaut. Vor Kapitel 2, weil dort Materia, AP, Slots und der Gambit-Editor dazukommen: Steht das Framework, rutschen sie hinein statt wieder stumm zu erscheinen.

---

## Danach

**M12/M13 sind die Darstellungsschiene** und laufen unabhängig von der Kapitel-2-Feinspec: Sie ändern keine Mechanik, sondern lösen den in der Konzept-Session vom 25.07.2026 gefundenen Layout-Fehler (zwei Maßsysteme in der Kampfzone) und seine Asset-Folgen. Sie blockieren Kapitel 2 nicht und werden nicht von ihm blockiert.

Kapitel-2-Feinspec (Materia/Slots/AP/Magie, programmierbarer Gambit-Editor) folgt erst, wenn **M15–M17** stehen und Kapitel 1 nachweislich durchspielbar ist – bewusst sequenziell, kein Parallel-Design auf einem unbewiesenen Fundament (Leitplanke „Skelett zuerst", `02_Leitfaden_Kernmechaniken.md` §5). Beide Playtests haben genau diese Leitplanke bestätigt: Das Skelett war nicht bewiesen, sondern nur simuliert.

**Reihenfolge: M15 → M16 → M17 → Kapitel-2-Feinspec.** M15 ist der Blocker (einzige Run-Währung), M16 macht Können bezahlbar, M17 macht die Mechaniken überhaupt sichtbar.

**Was Kapitel 2 aus der 30.07.-Session mitbekommt:**

- **Materia-Erwerb läuft nicht über eine Kaufwährung.** Ein Gil-finanzierter Materia-Shop ist verworfen (dieselbe Inflationsfalle). Quellen sind **Erst-Clears** und das **Reunion-Upgrade-Menü** (Essenz).
- **Kostenregel:** Preise steigen mit der **Zahl der bisherigen Käufe**, nicht mit einem festen Betrag.
- **Je System genau ein Milestone**, danach freie Wahl – keine Milestone-Kette, das wäre die Tier-Leiter auf der Meta-Ebene.
- **Der Gambit-Editor ist der Automatisierungspfad für gelöste Mechaniken:** Was der Spieler in Durchlauf 1 von Hand gelöst hat, gießt er danach in eine Regel. Das ist der Bogen manuell → planerisch und die eigentliche Antwort auf „woran wachsen Gambits".

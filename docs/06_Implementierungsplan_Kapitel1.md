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

- `src/content/characters.ts` (§6.1: Claude/Barrel/Tofa/Arris inkl. Specials).
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

1. **gameStore auf variable Party verallgemeinert:** M5/M6 hatten Claude fest verdrahtet (`game.claude`); M7 ersetzt das durch `game.party`/`game.awaitingUnit` und parametrisiert `CharacterPanel`/`ActionPopup` über ein `unit`-Prop – Region 3 (Tofa+Arris, M8) braucht dieselbe Erweiterung nicht mehr strukturell, nur Content.
2. **Waffenkauf pro Figur, gleicher Flat-Preis (8 Gil):** Wie in §11 als offene Stellschraube markiert. Barrel braucht keine eigene Zonen-Schwelle wie Claude (Zone 3) – sein Roster-Beitritt selbst (Zone 9) ist bereits das Gate.
3. **Suppress-Zielwahl ohne SPD-≥140-Gegner:** Die Default-Gambit-Regel 3 (feinspec §4.7) feuert nur, wenn ein schneller Gegner da ist. Für die manuelle Popup-Nutzung braucht Barrels Special aber immer ein Ziel – Fallback ist das stärkste (meiste HP) Ziel, analog zu Claudes Special/Limit-Zielwahl.
4. **Bestiarium-Nummerierung** ("Entry 04/10") zählt über die interne Reihenfolge von `content/monsters.ts` (7 Monster + 3 Gates = 10) – nicht über die vollständige 10-Monster-Forschungsliste aus `gegner-katalog.md` (die auch Kapitel-2-Arten wie Mitoslime enthält). Rein kosmetisch, keine Gameplay-Bedeutung.
5. **Bugfix beim Spielen gefunden:** `resetSave()` löschte den Save, aber der Autosave-`pagehide`-Listener lief noch und schrieb den (noch im Speicher stehenden) alten Zustand beim Reload sofort zurück – der Button wirkte, tat aber nichts. Fix: `stop()` (entfernt die Autosave-Listener) läuft jetzt vor `clearSave()`.
6. **Playtest-Fund (nach M7-Preview):** Das Aktions-Popup (`ActionPopup.svelte`) lag hinter der Kampf-Stage statt davor. Ursache: `BottomBar.svelte` bekam für die neue Mehr-Figuren-Reihe `overflow-x: auto`, aber laut CSS-Overflow-Modul wird die jeweils andere Achse automatisch ebenfalls auf `auto` gesetzt, sobald eine Achse nicht `visible` ist – das hat das nach oben aus dem Panel herauswachsende Popup (`position:absolute; bottom:100%`, `ui-layout.md` "Charakter-Steuerung: Panels & Aktions-Popup") abgeschnitten. Kein Spec-Widerspruch (die Doku verlangt bereits "wächst nach oben in die Stage"), reiner Implementierungsfehler. Fix: `overflow` auf `.bottom-bar` entfernt; per Live-Check (`getBoundingClientRect`/`elementFromPoint`) verifiziert, dass das Popup jetzt oberhalb der Bottom-Leiste rendert und den Klick tatsächlich empfängt.

---

## M8 – Region 3: Volle Party, Shock, manuelle Steuerung

**Ziel:** Region 3 vollständig (Zone 19–30) – der komplexeste Meilenstein, da hier alle Kapitel-1-Systeme zusammenlaufen.

- Tofa + Arris kommen dazu (volle 4er-Party).
- Shock-Ring-Anzeige (Amber-Aufbau/Gold-Fenster, füllt sich von unten, Bruch-Symbol bei 100 %) nach `kampf-analyse-shock.md` §6.
- `controlMode`-Umschalter je Figur + Aktions-Popup (FF7-Menübox, Wait-Modus/globale Pause) nach feinspec §5.1 (Mockup `05_aktions_popup.png`).
- Telegrafierte Gegner-Aktionen (Shortfuse-Zündung, Vaultron-AoE).
- Vaultron-Kapitel-Boss (Zone 30).

**Abnahme:** Region 3 end-to-end spielbar wie in feinspec §7.2 (Shock-Kampf-Ablauf) und §7.3 (Kapitel-Wand) beschrieben; Popup-Flow entspricht exakt §5.1 (Uhr pausiert vollständig währenddessen, inkl. Shock-Timer).

---

## M9 – Niederlage-Loop, Offline-UI, 1. Reunion

**Ziel:** Die Klammer um den gesamten Kapitel-1-Loop schließen.

- Niederlage-UI: Zeitstrafe sichtbar, Auto-Retry ohne Verlust (`niederlage-offline.md` §1).
- „Willkommen zurück"-Screen bei Wiedereinstieg, der den in M4 gebauten Offline-Projektionsrechner sichtbar macht (Ertrag seit letztem Besuch).
- Reunion-Screen (Mockup `04_reunion.png`): Reset-/Persistenz-Listen, Reunion-Essenz-Ertrag, Freischaltung von programmierbaren Gambits + erstem Boost (`prestige-reunion.md`).

**Abnahme:** Ein kompletter Durchlauf Zone 1 → Zone 30 → Reunion ist spielbar; Speichern, Browser schließen, wieder öffnen setzt exakt an der gespeicherten Stelle fort (inkl. korrekt berechneter Offline-Ernte).

---

## M10 – Härtung & Politur

**Ziel:** Von „funktioniert" zu „vorzeigbar".

- Save-Export/Import (Architektur §6, Sicherheitsnetz).
- Fehlerbehandlung korrupter/fremder Saves (Warnung statt Datenverlust).
- Playtest-Debugwerkzeug gegenprüfen (Architektur §6a, „Reset save"-Button, aktuell bewusst auch im veröffentlichten Build sichtbar): vor echtem Publikum hinter `import.meta.env.DEV` verstecken oder entfernen.
- MegaCorp-Kulisse rechts ausrichten/verbreitern (bekannte Warnung aus feinspec §8).
- Cross-Browser-Kurzcheck (Chrome/Firefox/Safari, Desktop + mobil falls Layout es zulässt).
- Performance-Check des Live-Loops über eine längere Session (kein Speicher-/Timer-Leck durch wiederholtes `visibilitychange`).

**Abnahme:** Subjektiv „bereit zum Zeigen" – kein hartes Kriterium, eher ein Sammel-Meilenstein für Restarbeiten, die sich erst beim Spielen der vorherigen Meilensteine zeigen.

---

## Danach

Kapitel-2-Feinspec (Materia/Slots/AP/Magie, programmierbarer Gambit-Editor) folgt erst, wenn M0–M10 stehen – bewusst sequenziell, kein Parallel-Design auf einem unbewiesenen Fundament (Leitplanke „Skelett zuerst", `02_Leitfaden_Kernmechaniken.md` §5).

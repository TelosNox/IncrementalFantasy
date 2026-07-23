# 05 – Architektur (Technisch)

**Status:** Architektur-Vorschlag (Iteration 1) – Entscheidungsgrundlage vor Implementierungsbeginn.
**Rahmen:** `03_Konzept_Gerüst.md` (Spieldesign-Anker), `spec/feinspec-kapitel1.md` (Datenmodelle/Tick-Loop/SaveState, hier technisch umgesetzt), `CLAUDE.md` (feste Rahmenentscheidungen: kein Server/Account, keine Monetarisierung außer optionalem Einmalkauf).
**Prüfinstanz:** `02_Leitfaden_Kernmechaniken.md` – hier insbesondere Determinismus, BigNumber-Anti-Pattern #10, Ventil-Prinzip #1.

## Schnittstellen zu anderen Dokumenten

- **`spec/feinspec-kapitel1.md` §4** liefert die Datenmodelle (Character, Monster, Encounter, Weapon, Bestiary, SaveState) – diese Architektur übersetzt sie 1:1 in TypeScript-Typen, ändert an den Schemas nichts.
- **`spec/feinspec-kapitel1.md` §5** liefert den Referenz-Tick-Loop (`battleTick`) – wird als reine Funktion in `/src/core` implementiert.
- **`spec/niederlage-offline.md`** liefert die Offline-/Retry-Regeln, die der Projektionsrechner (§5 unten) exakt abbilden muss.
- **`spec/oekonomie-waehrungen.md` §3** fordert BigNumber-Notation ab Tag 1 – Bibliothekswahl in §2 unten.
- **`spec/ui-layout.md`** liefert das Bildschirm-Platzbudget (Stage/Bottom/Sidebar) – bestimmt die Komponentenstruktur in `/src/ui`.

---

## 1. Zielbild & Rahmenbedingungen

- **Rein statisches Browser-Spiel**, gehostet auf **GitHub Pages** direkt aus dem Repo. Kein Server, kein Backend, kein Account-System – deckungsgleich mit der CLAUDE.md-Rahmenentscheidung „keine Monetarisierung, keine In-Game-Käufe".
- **Session-Persistenz lokal im Browser.** Pausieren/Fortsetzen läuft über den lokalen Speicher desselben Browsers (wie vom Nutzer explizit akzeptiert) – kein Cloud-Save, kein Login nötig.
- **Determinismus (kein RNG, `stats-kampfwerte.md` §2)** ist nicht nur ein Design-Prinzip, sondern hier auch ein **technischer Hebel**: Er macht Offline-Fortschritt exakt vorhersagbar und günstig berechenbar (siehe §5) statt teuer nachsimulieren zu müssen.

---

## 2. Tech-Stack

| Baustein | Wahl | Begründung |
|---|---|---|
| Sprache | **TypeScript** | Die Datenmodelle (feinspec §4) sind schema-lastig; TS macht sie beim Implementieren verbindlich statt nur dokumentiert. |
| UI-Framework | **Svelte** | Das Spiel ist UI-lastig, nicht action-lastig: FF7-Menüboxen, Panels, ATB-/Shock-Ringe, viele Werte, die alle ~0,1 s ticken (feinspec `DT`). Sveltes feingranulare Reaktivität (Stores) aktualisiert genau die betroffenen DOM-Knoten ohne Re-Render-Overhead größerer Komponentenbäume – passender Fit als ein virtuelles DOM. Kompiliert zu schlankem Output, wenig Boilerplate. |
| Rendering | **DOM + CSS**, keine Canvas-Engine | Sprites sind 64/256-px-Einzelbilder (`charaktere-visuals.md`), keine bewegte Action-Grafik. `<img>`/CSS-Hintergrund + CSS-Transitions reichen für ATB-Füllstand, Shock-Ring, Panel-Layout – und lassen sich mit Standard-CSS/Flexbox exakt nach dem Platzbudget aus `ui-layout.md` bauen. Ein Canvas-/Phaser-Ansatz wäre Mehraufwand ohne Gegenwert. |
| Build/Dev-Server | **Vite** | Standard-Pairing mit Svelte, schneller Hot-Reload, unkomplizierter Static-Build für GitHub Pages (`base`-Pfad konfigurierbar). |
| Große Zahlen | **break_eternity.js** | Etablierte BigNumber-Bibliothek aus dem Incremental-Games-Genre (u. a. Antimatter Dimensions), unterstützt Exponentialgrößen weit über Float-Grenzen, serialisiert sauber über `toString()`/`fromString()` – erfüllt die Vorgabe „BigNumber ab Tag 1" (`oekonomie-waehrungen.md` §3, Anti-Pattern #10), obwohl Kapitel-1-Werte selbst noch klein sind. |
| Paketmanager | **npm** | Keine zusätzliche Abhängigkeit, Standard in CI-Umgebungen (GitHub Actions). |
| Tests | **Vitest** | Läuft nativ im Vite-Ökosystem, keine separate Test-Toolchain. |

---

## 3. Projektstruktur

Ein einzelnes Paket (kein Monorepo nötig für diesen Umfang):

```
/src
  /core            # reine Simulation, KEIN DOM-/Svelte-Zugriff, voll unit-testbar
    formulas.ts      # Schaden, ATB-Intervall, Shock-Aufbau, Limit-Ladung, EXP (feinspec §3)
    tick.ts          # battleTick-Referenz-Loop (feinspec §5)
    gambits.ts       # Default-Regeln (feinspec §4.7), später editierbarer Gambit-Editor
    entities.ts       # Character-/Monster-/Encounter-Typen (feinspec §4.1–4.3)
    offline.ts        # Offline-/Resume-Projektionsrechner (siehe §5 unten)
  /content         # statische Balance-Daten, direkt aus den Spec-Tabellen abgeleitet
    characters.ts    # feinspec §6.1
    monsters.ts       # feinspec §6.2
    zones.ts           # feinspec §6.3
    weapons.ts         # feinspec §6.4
  /save            # Persistenz-Layer
    schema.ts        # SaveState-Typ (feinspec §4.6) + version-Feld
    serialize.ts      # BigNumber-bewusste (De-)Serialisierung
    storage.ts         # localStorage-Zugriff, Autosave-Scheduler
    migrate.ts          # Versions-Migrationen
  /ui              # Svelte-Komponenten (Stage, Bottom-Leiste, Sidebar, Aktions-Popup, Bestiarium)
  /assets          # Sprites (kopiert aus docs/spec/assets)
  main.ts          # Einstiegspunkt: verbindet Sim-Loop, Save-Layer und UI-Store
/tests             # Vitest – Formeln gegen sim_chapter1.py-Referenzwerte
/public
vite.config.ts
.github/workflows/deploy.yml
```

**Leitprinzip der Struktur:** `/core` kennt kein DOM und keine Svelte-Stores – nur reine Funktionen und Zustandsobjekte, exakt nach feinspec-Schema. Die UI liest/schreibt ausschließlich über einen dünnen Svelte-Store-Adapter in `main.ts`. Das hat zwei Effekte: `/core` ist unabhängig testbar (auch gegen die Python-Referenzsimulation, §7), und derselbe Sim-Kern läuft sowohl für den Live-Kampf als auch für die Offline-Projektion (§5) – **eine** Ökonomie, keine zwei parallelen Implementierungen, die auseinanderdriften könnten.

---

## 4. Game-Loop (Vordergrund)

- `requestAnimationFrame`-getriebener **Akkumulator mit festem `DT = 0,1 s`** (feinspec §2/§5) – die Simulation läuft in festen Schritten, unabhängig von der tatsächlichen Bildwiederholrate.
- Ein Svelte-Store hält den Sim-State; UI-Komponenten sind rein reaktiv und besitzen keinen eigenen Zustand.
- **Page Visibility API:** Wird der Tab `hidden`, stoppt der Live-Loop komplett (Browser drosseln `requestAnimationFrame`/Timer im Hintergrund ohnehin unzuverlässig auf ~1/s). Das Nachholen beim Zurückkommen läuft nicht als „weiterticken in Zeitlupe", sondern über denselben Mechanismus wie jede andere Abwesenheit – siehe §5.

---

## 5. Ein Mechanismus für Pause/Resume **und** Offline-Ernte

**Kerneinsicht:** Weil Kampf komplett deterministisch ist (kein RNG, `stats-kampfwerte.md` §2), muss man Abwesenheit **nicht Tick für Tick nachsimulieren**. Ein Kampf-Durchlauf der aktuellen Zone (inklusive etwaiger Niederlage-Retry-Schleife) hat für den aktuellen Party-/Ausrüstungs-/Gambit-Zustand eine **feste Realzeit-Dauer** und einen **festen Ertrag**. Daraus lässt sich die Abwesenheit direkt hochrechnen, ohne Millionen Ticks abzuarbeiten.

**Ablauf beim Zurückkommen** (gilt gleichermaßen für: Tab kurz weggeklickt, Browser geschlossen, Rechner aus, nächster Tag – ein einziger Codepfad):

```
1. elapsed = now - saveState.offline.lastSeen
2. budget  = min(elapsed, OFFLINE_CAP=8h) * OFFLINE_RATE(0.6)      # niederlage-offline.md
3. { timePerClear, rewardPerClear } = simuliere aktuelle Zone EINMAL
   headless über /core/tick.ts (kein Rendering) – inkl. Zeitstrafe,
   falls die aktuelle Party die Zone (noch) nicht schafft
4. repeats = floor(budget / timePerClear)
5. Fortschritt (EXP/Gil, ggf. Level-Ups) um `repeats` Durchläufe fortschreiben;
   Zone bleibt unverändert (kein Gate-Überspringen)
6. saveState.offline.lastSeen = now; speichern
```

- **Effizient:** O(1) Batch-Rechnung statt potenziell hunderttausender Einzel-Ticks für 8 h Offline-Zeit – kein Web Worker, keine Blockierung des UI-Threads nötig.
- **Spec-konform von selbst:** Kommt die Party an der aktuellen Wand nicht vorbei, liefert Schritt 3 einen „Niederlage-Loop" (nur Zeitstrafe, kein Ertrag) – `repeats` zählt dann Zeitstrafen-Zyklen ohne Fortschritt. Das ist exakt das in `niederlage-offline.md` §3 geforderte Verhalten („Offline stockt in der Retry-Schleife ohne Fortschritt"), ohne dass es als Sonderfall extra codiert werden muss.
- **Aktiv-Nutzen bleibt bestehen:** Offline nutzt bewusst dieselbe deterministische Auto-Policy wie idle – Limit-Timing und Live-Analyse (aktive Vorteile, `03_Konzept_Gerüst.md` §13) fließen nur in den **Live**-Loop ein, nicht in die Offline-Projektion. Damit bleibt „Offline ist nie strikt besser als Aktiv" (niederlage-offline.md §3) architektonisch garantiert statt nur behauptet.

---

## 6. Save-System

- **Schema:** exakt `feinspec-kapitel1.md` §4.6 (`chapter`, `currentZone`, `party`, `roster`, `currencies`, `bestiary`, `reunionCount`, `flags`, `offline.lastSeen`), zusätzlich ein `version`-Feld für Migrationen.
- **Speicherort:** `localStorage`, ein Save-Slot (Key z. B. `incrementalfantasy.save.v1`). Für die zu erwartende Datengröße (Party, Bestiarium, Zähler – wenige KB) reicht das synchrone `localStorage` völlig; IndexedDB wäre für diesen Umfang unnötige Komplexität.
- **Serialisierung:** BigNumber-Felder (`exp`, `gil`, später `reunionEssence`, Materia-Prestige) werden als String (`break_eternity`-`toString()`) serialisiert – nie als natives JSON-`number`, das bei großen Werten Präzision verliert (Anti-Pattern #10).
- **Autosave-Trigger:** periodisch (z. B. alle 15–30 s), bei `visibilitychange` → `hidden`, bei `pagehide`, sowie an billigen Meilensteinen (Level-Up, Zonenwechsel, Sieg).
- **Versionierung/Migration:** `migrate.ts` bildet `v_n → v_n+1`-Funktionen ab; ein unbekannter/korrupter Save führt zu einer sichtbaren Warnung statt stillschweigendem Überschreiben – Spielstände sind das Einzige, was hier nicht verzeihend genug sein kann.
- **Export/Import als Sicherheitsnetz (Zusatzvorschlag):** Ein „Speicherstand exportieren"-Button (Download als JSON) und ein Import-Dialog schützen gegen versehentliches Löschen der Browserdaten. Kostet wenig, widerspricht nicht der Vorgabe „gleicher Browser reicht" – ist reine Zusatzabsicherung, kein Cloud-Sync.
- **Bewusst kein Server/Account in v1** – konsistent mit der CLAUDE.md-Rahmenentscheidung und der expliziten Vorgabe des Nutzers.

### 6a. Playtest-Debugwerkzeug (kein Spielfeature)

Ein kleiner, unauffälliger **„⟳ Reset save"-Button** unten rechts (`ui/DebugResetButton.svelte`) löscht den Save-Slot (`clearSave()`) und lädt die Seite neu, damit ein Testlauf jederzeit wieder bei Zone 1 beginnen kann – mit Bestätigungsdialog gegen Versehen. Reload statt In-Place-Reset, damit Loop/Autosave/Timer garantiert sauber neu aufgesetzt werden.

**Bewusst auch im veröffentlichten Build sichtbar** (nicht hinter `import.meta.env.DEV` versteckt) – der Nutzer testet aktiv auf `telosnox.github.io/IncrementalFantasy/`, und in der aktuellen Playtest-Phase ohne Publikum ist ein sichtbarer Debug-Button unkritisch. Kein Ersatz für die „echte" Reunion (die ist ein verdientes Spielfeature mit Persistenz-Regeln, s. `prestige-reunion.md`) und keine Vorstufe davon – reines Test-Werkzeug. **Vor dem ersten echten Release (spätestens M10) zwingend erneut gegenprüfen:** entweder wieder hinter `import.meta.env.DEV` verstecken oder bewusst entfernen, sobald es ein Publikum gibt, das ihn versehentlich treffen könnte.

---

## 7. Content-Layer (Balance-Daten)

- Die Tabellen aus `feinspec-kapitel1.md` §6 (Charakter-Startwerte, Monster-/Gate-Basiswerte, Zonen-Encounter, Waffen-Tiers) werden **1:1 als typisierte TS-Konstanten** abgebildet – direkt aus den Markdown-Tabellen ableitbar und bei Balance-Änderungen leicht diff-bar.
- Ändert sich ein Playtest-Wert (offene Stellschrauben, feinspec §11), ändert man nur `/src/content` – die Engine (`/src/core`) bleibt unberührt.
- Formeln (Schaden, ATB, Shock, Limit, EXP – feinspec §3) werden als reine, kommentierte Funktionen implementiert, jeweils mit Verweis auf die zugehörige Formelnummer im Kommentar, damit Code und Spec jederzeit gegeneinander nachvollziehbar bleiben.

---

## 8. Asset-Pipeline

- Sprites liegen bereits vor unter `docs/spec/assets/{characters,monsters,bosses,regions}` inklusive reproduzierbarer Python-Generatoren (`generate_*.py`).
- Für den Spiel-Build werden die fertigen PNGs nach `/src/assets` übernommen (einmaliger Copy-Schritt); die Python-Generatoren bleiben in `docs/` die Source-of-Truth für Neuerzeugung/Änderung – kein Python zur Build-Zeit im Spiel-Repo nötig.
- Auflösungen wie in feinspec §8 festgelegt: 64 px für die Kampf-Stage, 256 px für Bestiarium-Karten/UI.

---

## 9. Hosting & CI/CD

- **GitHub Pages**, Deploy-Modus „Deploy from GitHub Actions" (kein `gh-pages`-Branch-Hack).
- **Workflow** (`.github/workflows/deploy.yml`) bei Push/Merge auf `main`: `npm ci` → `npm run build` (Vite-Build mit korrektem `base`-Pfad für den Pages-Unterordner) → Veröffentlichung über `actions/deploy-pages`.
- **Kosten/Betrieb:** 100 % statisch, keine Server-Kosten, kein Backend-Betrieb – passt zur „keine Monetarisierung"-Leitplanke und hält den Betriebsaufwand bei null.
- **Optional, spätere Phase:** Service Worker/PWA-Caching der App-Shell, damit das Spiel auch ganz ohne Netz startet (sofern schon einmal geladen) – ergänzt, aber ersetzt nicht die Offline-Ernte-Logik aus §5, die rein auf `localStorage`-Zeitstempeln beruht und kein Netz braucht.

---

## 10. Teststrategie

- **Vitest für `/core`:** Unit-Tests für Schaden-, ATB-, Shock-, Limit- und EXP-Formeln.
- **Referenz-Validierung:** Kernergebnisse gegen die Python-Referenzwerte aus `assets/sim/sim_chapter1.py` bzw. die Pacing-Tabelle in feinspec §7.4 abgleichen (z. B. „Region 1 ≈ 1,9 min Kampfzeit, Level 1→6"). Stellt sicher, dass die TS-Implementierung dieselbe **simulationsvalidierte Baseline** reproduziert, auf die sich die Feinspec beruft.
- **Save/Migration:** Round-Trip-Tests (serialisieren → deserialisieren → identischer Zustand), Migrationstests mit fixierten Beispiel-Saves alter Versionen.
- **Kein E2E-/Browser-Testing in v1** – für ein Solo-/Kleinteam-Projekt ohne Server-Komponente unverhältnismäßig; manuelles Playtesting reicht zunächst, Playwright ist bei Bedarf später leicht nachrüstbar.

---

## 11. Leitplanken-Check (`02_Leitfaden_Kernmechaniken.md`)

| Leitplanke | Status in dieser Architektur |
|---|---|
| Determinismus (kein RNG) | ✓ durchgängig erhalten – wird in §5 sogar aktiv als Performance-Hebel genutzt |
| BigNumber ab Tag 1 (Anti-Pattern #10) | ✓ `break_eternity.js` von Anfang an, nicht erst wenn Zahlen groß werden |
| Ventil-Prinzip (Anti-Pattern #1) | ✓ Offline-Projektion liefert an Wänden weiterhin Zeitstrafen-Zyklen statt stillen Stillstands, aber auch keinen unverdienten Fortschritt |
| Aktiv ⟷ Idle-Balance (§3 Leitfaden) | ✓ ein gemeinsamer Sim-Kern für Live- und Offline-Loop verhindert zwei auseinanderdriftende Ökonomien; „Offline nie strikt besser" ist architektonisch erzwungen, nicht nur behauptet |
| Kein Server/Account | ✓ konsistent mit der „keine Monetarisierung"-Rahmenentscheidung |

---

## 12. Offene Punkte / nächste Schritte

- ~~**Repo anlegen**~~ **Erledigt:** [`github.com/TelosNox/IncrementalFantasy`](https://github.com/TelosNox/IncrementalFantasy), Branch `main`. Damit ist auch der Pages-URL-Pfad fix: `https://telosnox.github.io/IncrementalFantasy/` → `base: '/IncrementalFantasy/'` in `vite.config.ts`. Offen bleiben: GitHub Pages im Repo aktivieren (Settings → Pages → Source „GitHub Actions") und der Deploy-Workflow (`.github/workflows/deploy.yml`, §9).
- **Save-Slot-Anzahl:** v1 bewusst ein einzelner Speicherstand (Einfachheit); mehrere Slots/Challenge-Läufe (`charaktere-party.md` §Challenges) sind über das versionierte Schema später erweiterbar, ohne Breaking Change.
- **Erste Implementierungsschritte (Vorschlag für Claude Code):** 1) Vite/Svelte-Grundgerüst + Ordnerstruktur, 2) `core/formulas.ts` + Tests gegen `sim_chapter1.py`-Referenzwerte, 3) Content-Tabellen aus feinspec §6, 4) Tick-Loop + Save-Layer, 5) UI-Screens entlang des Rollouts aus feinspec §1 (Klicker → Auto-Attack → Analyse → Shock → volle Party).

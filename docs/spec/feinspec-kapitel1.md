# Feinspec Kapitel 1 – „The Grid" (Zyklus 1, bis zur 1. Reunion)

**Status:** Implementierungsnahe Feinspec. Alle Zahlen sind eine **simulationsvalidierte Playtest-Baseline** (kein finaler Balance-Stand) – siehe §11. Formeln, Datenmodelle und der Tick-Loop sind so gehalten, dass ein Prototyp direkt daraus gebaut werden kann.
**Rahmen:** `../03_Konzept_Gerüst.md` (Anker) + die betroffenen `spec/*.md` (siehe Schnittstellen).
**Prüfinstanz:** `../02_Leitfaden_Kernmechaniken.md`. Leitplanken-Check in §10.
**Validierung:** Kampf-/Pacing-Simulator `assets/sim/sim_chapter1.py` (deterministisch, ATB-getaktet). Alle Pacing-Zahlen in §8 stammen aus einem Durchlauf dieses Simulators.

## Schnittstellen zu anderen Systemen

- **Kampf/Shock** (`kampf-analyse-shock.md`): ATB-Takt, MP-Kanäle, Shock-Fenster, Limit, Analyse.
- **Stats** (`stats-kampfwerte.md`): Kern-Stats, Schadens-/ATB-Formel, Level-Wachstum.
- **Progression** (`progression-regionen.md`): 3 Regionen, Roster-Rhythmus, Gate-Struktur.
- **Encounter** (`encounter-zyklus1.md`): Monster-Platzierung Z1–Z30, Skalierung `g`.
- **Gegner** (`gegner-katalog.md`): 7 in Zyklus 1 aktive Monster + 3 Gates.
- **Ausrüstung/Gil** (`ausruestung-gil.md`): Waffe = Stats + Special-Freischaltung (Slots erst Kap. 2).
- **Ökonomie** (`oekonomie-waehrungen.md`): aktiv nur EXP + Gil (+ MP als Kampf-Ressource).
- **Niederlage/Offline** (`niederlage-offline.md`): Zeitstrafe, Retry, Offline-Ernte.
- **Prestige** (`prestige-reunion.md`): 1. Reunion = Reset/Persistenz + Gambit-Freischaltung.
- **UI** (`ui-layout.md`): Stage/Bottom/Sidebar-Budget; hier als konkrete Screens umgesetzt.

---

## 0. Geltungsbereich: Was Kapitel 1 enthält – und was bewusst nicht

**Enthalten (der komplette erste Spielabschnitt):** Kern-Loop (Auto-Battle → EXP/Gil), ATB, manueller Klicker-Auftakt, Auto-Attack-Regel, Waffen-Specials der 4 Figuren, Limit als Wand-Brecher, MP als Limiter (2 von 3 Regen-Kanälen), Analyse/Bestiarium, Shock (neutral, langsam), Ausrüstungskauf über Gil, Niederlage/Retry, Offline-Ernte, die 1. Reunion.

**Bewusst NICHT enthalten** (öffnet ab Kapitel 2 / 1. Reunion, vgl. `progression-regionen.md` §2):
Materia & Slots, Magie/Zauber, AP-Ökonomie, Materia-Prestige, der **programmierbare** Gambit-Editor (in Kap. 1 laufen nur die fest verdrahteten Default-Regeln aus §4.7), Element-Schwächen als **nutzbare** Mechanik (Kindlebales Feuer-Schwäche ist reiner Teaser), Resistenzen, Summons. Der dritte MP-Kanal (Zeit-Trickle) ist in Kap. 1 noch inaktiv.

---

## 1. Systemüberblick in vier Screens

Die folgenden Mockups sind aus den vorhandenen Pixel-Assets (`assets/characters`, `assets/monsters`, `assets/regions`) komponiert und zeigen das Zielbild. Reproduzierbar über `assets/sim/make_mockups.py`. Layout-Budget nach `ui-layout.md`: Stage ~78 %, Bottom-Leiste ~20 %, Seitenleiste ~22 %.

### 1.1 Region 1 – Klicker-Auftakt (Claude solo)

![Region 1 – Klicker-Auftakt](assets/mockups/01_region1_klicker.png)

Der Einstieg: nur **Claude** gegen einen einzelnen **Blando** vor der Reactor-Row-Kulisse. Der Spieler wählt anfangs jede ATB-Aktion selbst (Banner oben). MP ist gerade sichtbar geworden (erster Waffen-Special). Unten Claudes Panel mit HP/MP/ATB und der ladenden **Limit**-Leiste. **Noch kein Auto/Manuell-Schalter sichtbar** – der erscheint erst mit der Default-Attack-Freischaltung (Zone 5, `gambits.md` §6). **Playtest-Learning (wichtig für die Implementierung):** Vor dieser Freischaltung darf die UI **keinerlei Modus-Anzeige** zeigen (auch keinen reinen Text-Hinweis) – sonst spoilert sie die Automatik, bevor der Spieler sie verdient hat. `assets/sim/make_mockups.py` rendert diesen Screen bereits korrekt ohne Modus-Anzeige (`show_mode=False`); diese Beschreibung war der Widerspruch dazu und ist hiermit behoben.

### 1.2 Region 3 – Volle Party & Shock-Fenster

![Region 3 – Shock-Kampf](assets/mockups/02_region3_shock.png)

Der Kampf in seiner vollen Kapitel-1-Form: alle vier Figuren, drei Gegner. Ein **Blando ist geschockt** – **voller goldener Ring + Bruch-Symbol** (DEF ignoriert, ×2 Schaden, verlangsamt); der **Funkus** daneben zeigt seinen **Shock-Aufbau** als von unten gefüllten Ring. **Shortfuse** telegrafiert seine Selbstzerstörung („! DETONATING"). **Tofas Limit ist voll** (leuchtet orange) – der aktive Spieler zündet es jetzt ins Shock-Fenster. Modus „Auto" (Default-Regeln laufen selbst) – ab hier zulässig, da die Automatik seit Zone 5 freigeschaltet ist. Shock-Ring-Farbe & -Symbolik: `kampf-analyse-shock.md` §6.

### 1.3 Analyse & Bestiarium

![Analyse – Bestiarium](assets/mockups/03_analyse_bestiarium.png)

Beim ersten Sieg über eine Art wird sie automatisch analysiert. Die Karte zeigt Grundstats (HP/ATK/DEF/SPD) und eine sichtbare **Schwäche** – hier Kindlebales Feuer, explizit markiert als **erst ab Kapitel 2 nutzbar** (Köder). Wissen bleibt über Reunion erhalten.

### 1.4 Die 1. Reunion

![Reunion](assets/mockups/04_reunion.png)

Am Kapitelende: die klaren **Reset-** vs. **Persistenz-Listen** und der Ertrag in **Reunion-Essenz**. Die 1. Reunion ist der Sonderfall, der zusätzlich die **programmierbaren Gambits** und einen ersten permanenten Boost freischaltet.

### 1.5 Manuelle Steuerung – Aktions-Popup

![Aktions-Popup](assets/mockups/05_aktions_popup.png)

Die manuelle Steuerung als **FF7-Menübox** am Charakter-Panel: dunkle Blau/Lila-Box, helle Schrift. **Air is...** steht auf **Manual** (cyan Chip), das übrige Team auf **Auto** – wird Air is... bereit, pausiert die gesamte Uhr und ihr Popup öffnet. **Grundaktionen** (Attack, Defend, Special „Heal Wind") stehen fix; **Limit** erscheint in **bunten Buchstaben**, wenn geladen; **nicht nutzbare Aktionen** bleiben sichtbar, aber **ausgegraut + dünn** (hier „Feuga – not enough MP"). Materia lebt unter der Kategorie **„Magic ▸"** als scroll-/blätterbare Unterliste – das Popup bleibt gleich groß, egal wie viele Zauber. Verhalten & Rollout: §5.1 sowie `gambits.md` / `ui-layout.md`. *(Hier im ausgebauten Zustand gezeigt; Defend und die Magic-Kategorie erscheinen erst ab ihren Freischaltungen – in Kapitel 1 zunächst nur Attack/Special/Limit.)* **UI-Sprache (verbindlich):** alle Aktions-/Modus-Labels, die tatsächlich im Spiel zu sehen sind (Buttons, Chips, Kategorien, Telegrafs), sind **Englisch** – konsistent mit der Namenskonvention für Code/Identifiers (CLAUDE.md). Nur die Spezifikations-**Prosa** bleibt Deutsch.

---

## 2. Globale Konstanten (Playtest-Baseline)

| Konstante | Symbol | Wert | Quelle/Begründung |
|-----------|--------|------|-------------------|
| ATB-Basisintervall | `BASE_T` | **2,0 s** | `stats-kampfwerte.md`; SPD 100 = 1 Aktion / 2 s |
| Zonen-Wachstumsfaktor | `g` | **1,07** | glatt Zone-für-Zone; sim-justiert (Spec-Vorschlag war 1,08) |
| Tick-Auflösung | `DT` | 0,1 s | Simulations-/Loop-Takt |
| Shock-Schwelle | `SHOCK_MAX` | 100 | willkürliche Einheit |
| Shock-Fensterdauer | `SHOCK_WINDOW` | 6,0 s | im Spec-Band 5–8 s |
| Shock-Schadensmultiplikator | – | ×2,0 | im Fenster |
| Shock-Verlangsamung Gegner-ATB | – | ×0,3 | Gegner „stark verlangsamt" |
| Limit-Cap | `LIMIT_MAX` | 100 | **nur in Gate-/Boss-Kämpfen**; startet dort bei 0, kein Übertrag (§3.4) |
| Zeitstrafe bei Niederlage | `RETRY_PENALTY` | 5,0 s | „milde Zeitstrafe"; heilt **nichts** (§3.8) |
| HP/MP-Erholung nach Sieg | `VICTORY_RECOVERY` | +25 % Maximum | einziger kostenloser Kanal; HP **und** MP gleich (§3.5) |
| ~~MP-Refund pro Angriff (Kanal 3)~~ | – | **gestrichen** | MP ist jetzt ein Kampf-Budget, kein Rotations-Kreisel (§3.5) |
| MP-Trickle über Zeit (Kanal 2) | – | **inaktiv** in Kap. 1 | öffnet später |
| Gasthaus-Totzeit | `INN_DEAD_TIME` | 10,0 s | Fixkosten gegen Heil-Spam (§3.8) |
| Gasthaus-Erholungsrate | `INN_RATE` | 5 %/s vom Maximum | HP und MP **gleichzeitig** (§3.8) |
| ~~Offline-Rate / Offline-Deckel~~ | – | **entfernt** | Offline-Progress stillgelegt (§3.8) |

**Level-Wachstum pro Stufe** (multiplikativ auf den Basiswert): HP ×1,09 · ATK ×1,055 · MAG ×1,055 · DEF ×1,05 · SPD ×1,00 (SPD bleibt Build-Hebel). Dass ATK (5,5 %/Level) knapp unter `g` (7 %/Zone) liegt, ist Absicht: die Party fällt über eine Region minimal zurück → am Gate steht eine spürbare, grindbare Wand (Ventil-Prinzip bleibt: EXP fließt weiter).

**EXP für den nächsten Level:** `exp_to_next(L) = round(20 · 1,22^(L-1))`. Kalibriert auf ~1 Levelaufstieg pro Zone, damit die Kampfdauer über das Kapitel ungefähr konstant bleibt.

---

## 3. Kern-Formeln

Alle deterministisch – **kein RNG** (kein Crit, kein Miss/Dodge), gemäß `stats-kampfwerte.md` §2.

### 3.1 Schaden (Mitigations-Kurve)

```
schaden(ATK, DEF) = max(1, round( ATK² / (ATK + DEF) ))
```

Hohe DEF macht zäh, aber nie unverwundbar. Magie-Schaden analog aus MAG. **Im Shock-Fenster** wird DEF als 0 gesetzt **und** das Ergebnis ×2 genommen – der gezielte Konter gegen Panzer (Safeguard).

*Beispiel:* Claude L1 (ATK 14) gegen Blando (DEF 2): `196/16 = 12` pro Treffer → 4 Angriffe für 40 HP → mit `BASE_T` genau **8 s** (deckt sich mit der Plausibilisierung in `stats-kampfwerte.md`).

### 3.2 ATB-Takt

```
atb_intervall(SPD)   = BASE_T · 100 / SPD          # Sekunden bis zur nächsten Aktion
füllrate_pro_tick    = DT / atb_intervall(SPD)      # * Modifikatoren (Shock, Suppress)
```

Ein geschockter Gegner füllt mit ×0,3; ein unterdrückter (Barrel) mit ×0,5. SPD 100 → 2,0 s; SPD 130 (Tofa) → 1,54 s; SPD 180 (Caffiend) → 1,11 s.

### 3.3 Shock-Aufbau

```
bei Treffer (Gegner NICHT im Fenster):
    shock += schaden · 0,5 + shock_bonus        # Tofa-Special: shock_bonus = 45
    wenn shock >= 100:  fenster starten (6 s), shock = 0
```

Neutral (alle Kap.-1-Gegner) baut also nur über Schaden auf – langsam, aber real. Tofas Special ist der Beschleuniger, bis in Kap. 2 Element-Materia den „Schockaffin"-Zustand auslöst.

**Anzeige & Zeitkopplung:** Der Shock-Stand erscheint als **Ring um den Gegner** in **Gold/Bernstein** (Amber `#e0a52e` im Aufbau, Gold `#ffcc33` im aktiven Fenster) – nicht Lila. Der Ring **füllt sich von unten** (Nähe zum Schock), schließt sich bei 100 % mit einem **Bruch-/Funken-Symbol** und **leert sich im Fenster von oben** (verbleibende Zeit). Voller Detail-Steckbrief: `kampf-analyse-shock.md` §6. **Auf- und Abbau laufen ausschließlich bei laufender Kampfuhr** – die Bedenkzeit-Pause (§5) friert den Shock-Timer mit ein.

### 3.4 Limit-Ladung (Esper-Modell, revidiert)

**Revision:** Die Erstfassung ließ die Limit-Leiste über den ganzen Run persistieren („aufgeladen an der Wand ankommen"). Mit der Zonen-Rückkehr (§3.8) wird das zu einem **Vorab-Farm-Exploit**: Man lädt das Limit in einer trivialen Zone auf und betritt die Wand mit voller Leiste – der Wand-Brecher entwertet sich selbst. Ersetzt durch das Esper-Modell aus FF7 Remake:

```
Verfügbarkeit: NUR in Encountern mit `limitAllowed: true` (§4.3) – in Kap. 1
               exakt die drei Gates (Blandzilla Z8, Fort Knoxious Z18, Vaultron Z30).
Start:         limit = 0 zu Beginn jedes solchen Kampfes. Kein Übertrag, nirgends.
Ladung:        zugefügter Schaden:  limit += schaden · 0,35
               erlittener Schaden:  limit += schaden · 0,50  (AoE: · 0,40 je Figur)
Zünden (Kap. 1, generisch): schaden(4,5·ATK, DEF) mit DEF-Ignore auf das stärkste Ziel.
```

Damit ist Limit kein Dauer-Knopf mehr, sondern ein **Ereignis, das ausschließlich an Wänden existiert** und sich dort vor den Augen des Spielers aufbaut. Die Laderaten sind so zu justieren, dass die Leiste in einem Gate-Kampf **ein- bis zweimal** voll wird – sie wird damit zum Taktgeber innerhalb des Kampfes statt zu einer vorab mitgebrachten Ressource.

Das schärft zugleich den Wert manuellen Spiels genau dort, wo er hingehört: Limit lebt künftig nur noch in den Kämpfen, die `gambits.md` §4 ohnehin als **manuelle Prüfsteine** vorsieht. Aktives Timing ins Shock-Fenster holt weiterhin spürbar mehr heraus.

*Playtest-Befund, der zu dieser Revision führte:* Limit fühlte sich „wie die Spezialattacke an, nichts Besonderes" – genau weil es überall verfügbar war. Der in der Vorfassung unter §11 vermerkte Implementierungsfehler (Leiste fiel bei jedem Zonenstart auf 0) **entfällt damit ersatzlos**; das Esper-Modell macht das frühere Soll-Verhalten überflüssig, statt es nachzurüsten.

### 3.5 MP – ein Kampf-Budget (revidiert, nur noch ein Kanal)

**Revision:** Kanal 3 (`+2 MP pro Angriff`) ist **gestrichen**. Mit ihm war MP eine *rotierende* Ressource, die sich innerhalb eines Kampfes selbst repariert („leer → angreifen → wieder da"); der Special war damit faktisch die Standardaktion statt eines taktischen Werkzeugs. Ohne ihn ist MP ein **Budget pro Kampf mit hartem Deckel**.

```
Kanal 1 – nach jedem Sieg:  mp += 0,25 · max_mp   (einziger kostenloser Kanal)
Kanal 2 – Gasthaus:         mp += 0,05 · max_mp je Sekunde (§3.8)
Special-Kosten: siehe §6.1. Reicht MP nicht, ist der Special schlicht nicht
verfügbar (im Popup sichtbar, aber ausgegraut – `gambits.md` §3).
```

**MP trägt zwischen den Kämpfen über** (§4.1) – das ist die eigentliche Änderung. Vier gewonnene Kämpfe füllen die Leiste von leer auf voll; die Entscheidung, MP in einer leichten Zone **nicht** auszugeben, wird damit selbst zum Zug: Man bankt Ressourcen in sicheren Zonen und gibt sie an der Wand aus. Genau dieser Vorbereitungs-Loop ist der Sinn der Zonen-Rückkehr (§3.8).

**Konsequenzen, die mitzuvalidieren sind:**
- Alle Special-Kosten in §6.1 wurden gegen den gestrichenen Refund balanciert und sind **neu herzuleiten**.
- Air is…' Heilung bekommt damit eine **harte Obergrenze pro Kampf** – Bosskämpfe werden zusätzlich zu einem Ausdauer-Rätsel. Bei Vaultron (AoE alle 3 Aktionen) gewollt, aber simulationspflichtig.
- Der frühere Selbstheilungs-Satz „MP leer → Angriff → MP zurück" entfällt. Für Kapitel 1 folgenlos (Auto greift ohnehin nur an, §4.7), für den **Gambit-Editor in Kapitel 2** relevant: Eine Regel „nutze Special" kann dauerhaft ins Leere laufen, statt sich selbst zu reparieren. Gehört in die Kapitel-2-Spec.
- MP-Regen-Materia (`materia.md` §7) wird dadurch von „wirkungslos" zu einer der attraktivsten Kapitel-2-Belohnungen – die Rolle, die ihr `materia.md` §2 zuweist. **Deshalb darf Sustain in Kapitel 1 bewusst nicht gut gelöst sein.**

### 3.6 EXP / Gil / Level

```
Sieg → jede beteiligte Figur erhält die Summe der Monster-EXP der Welle.
       Gil-Ertrag = Summe der Monster-Gil.
Level-Up sobald exp >= exp_to_next(L); Überschuss wird übertragen.
Monster-EXP/Gil skalieren mit g^(zone-1) wie die Stats (§3.7).
```

### 3.7 Zonen-Skalierung

```
effektiver Monster-Stat = basis · g^(zone_index - 1)     # g = 1,07
Zonen-Index läuft über das ganze Kapitel durch:
    Region 1 = Zonen 1–8, Region 2 = 9–18, Region 3 = 19–30.
Gate-Spike = die Gate-Basiswerte (§6.2) liegen bereits ~1,6–1,8× über der
letzten regulären Zone der Region.
Größen-/Farbvarianten streuen ±15 % (kleiner = schwächer/schneller).
```

### 3.8 Die Ventil-Kette: Zonen-Rückkehr, Gasthaus, Niederlage (revidiert)

**Der schwerste Fund des ersten Playtests.** Die Vorfassung dieses Abschnitts beschrieb einen Retry auf *derselben* Zone bei „frischer Party" – und behauptete, wiederholte Niederlagen seien „das Signal grinden/verbessern". Beides zusammen ergibt in einer **deterministischen** Engine (kein RNG, §3.1/§10) einen **permanenten Totalstopp**: Wer eine Zone einmal verliert, verliert sie bitgenau identisch, unendlich oft. Es gab keinen Ort, an dem man hätte grinden können – `currentZone` wurde ausschließlich hochgezählt –, und EXP/Gil flossen nur bei Sieg. Damit war ausgerechnet **Anti-Pattern #1 („Fortschritts-Wände ohne Ventil", `02_Leitfaden_Kernmechaniken.md` §4)** verletzt, der häufigste Kritikpunkt am ganzen Genre.

Die simulationsvalidierte Baseline (§7.4) hat das nicht gezeigt, weil der Test-Harness bei jeder Niederlage **an der zuletzt geschafften Zone farmt** – eine Mechanik, die es im Spiel nie gab. Die Simulation maß ein anderes Spiel als das ausgelieferte.

Ersetzt durch drei ineinandergreifende Regeln:

#### (a) Zonen-Rückkehr – das Ventil

```
Jede bereits geschaffte Zone ist jederzeit frei anwählbar (vor und zurück).
Dort gewonnene Kämpfe zahlen EXP/Gil regulär aus – unbegrenzt wiederholbar.
Die höchste je erreichte Zone bleibt gespeichert; Rückkehr verliert nichts.
```

Das ist das Genre-Standardmuster („push bis zur Wand, dann farmen", Vorbild Trimps, `02_Leitfaden_Kernmechaniken.md` §1 D2) und macht den Skill↔Zeit-Tausch aus `gambits.md` §4 überhaupt erst einlösbar: **manuell gut spielen** *oder* **eine Zone zurück und stärker werden**. Beide Wege führen durch die Wand.

Bewusst **kein** Automatismus: Der Spieler wählt die Zone selbst. Ein automatischer Rückfall bei Niederlage ist als spätere Komfortstufe denkbar, aber nicht Teil dieser Fassung – erst muss die Handlung existieren, dann darf man sie automatisieren (`02_Leitfaden_Kernmechaniken.md` §4 #2).

#### (b) Gasthaus – der Heilkanal

```
Anmeldung:  jederzeit umschaltbar („nach diesem Kampf ins Gasthaus").
            Greift erst nach Ende des laufenden Kampfes, nie mittendrin.
            Bei Niederlage automatisch aktiv.
Ablauf:     INN_DEAD_TIME = 10 s, in denen NICHTS geheilt wird (Fixkosten),
            danach INN_RATE = 5 %/s auf HP UND MP gleichzeitig.
Kosten:     ausschließlich Zeit. Kein Gil.
Limit:      unberührt – existiert außerhalb von Gate-Kämpfen ohnehin nicht (§3.4).
```

Voll heilen aus dem Nichts dauert damit **30 s** (10 s Totzeit + 20 s Erholung). Die Totzeit ist der eigentliche Design-Kern: Sie macht häufiges kleines Nachheilen unwirtschaftlich und belohnt „weiterkämpfen, bis man es wirklich braucht" – eine Optimierungsfrage mit echter Antwort statt einer Selbstverständlichkeit.

**Warum Zeit statt Gil:** Ein Gil-Preis kann in einen Deadlock laufen (wenig HP + kein Gil = kein Ausweg). Zeit kann das nie. Zudem ist die gesamte Ökonomie ohnehin in Zeit denominiert. *Nebenwirkung:* Gil hat damit weiterhin nur **einen** Sink (Waffen) – ein zweiter bleibt offen (`oekonomie-waehrungen.md`).

Dass der Gasthaus-Besuch **vorab angemeldet** wird und erst nach dem laufenden Kampf greift, ist kein Bedienkompromiss, sondern konsistent zum Steuerungsprinzip aus `gambits.md` §3: Spontanes Eingreifen gibt es nicht, man stellt vorher ein.

#### (c) Niederlage – kostet Zeit, heilt nicht

```
Niederlage: +5 s Zeitstrafe, KEIN Währungs-/Zonen-Verlust, KEINE Heilung.
            Der HP/MP-Stand der Party bleibt, wie er war.
            Danach automatisch Gasthaus (siehe b), dann Retry derselben Zone.
```

Entscheidend ist das **„heilt nicht"**: Träfe die Niederlage die Party frisch auf volle Werte, während normales Weiterspielen nur 25 % pro Sieg zurückgibt, wäre **absichtliches Sterben die optimale Strategie** und die Zeitstrafe faktisch eine Belohnung. Der Heilweg ist das Gasthaus, nicht der Tod.

#### (d) HP/MP-Übertrag – die Signalregel

HP und MP tragen zwischen allen Kämpfen über (§4.1); pro Sieg kommen 25 % des Maximums zurück (§3.5). Die Höhe dieses Werts ist **nicht frei zu wählen**, sondern folgt einer Regel:

> Die Erholung pro Sieg ist so zu bemessen, dass eine Zone, die man **komfortabel schlägt, netto HP-neutral oder leicht positiv** ist – und eine Zone, an der man sich **hochkämpft, netto negativ**.

Damit sagt der HP-Verlauf dem Spieler ohne eine Zeile Text, wo er steht: Sinkt die Leiste über mehrere Kämpfe, drückt er zu hart und sollte eine Zone zurück – **das ist die eingebaute Einladung zu (a)**. Bleibt sie stabil, farmt er sicher und kann es laufen lassen.

#### (e) Offline-Progress – stillgelegt

**Entfernt, nicht getunt.** Die Offline-Projektion erzwang intern `controlMode: "auto"` und rechnete *wiederholte Durchläufe derselben Zone* hoch – sie war damit unbeabsichtigt die **einzige funktionierende Implementierung des Ventils (a)**, nur unsichtbar, unverdient und exklusiv für Spieler, die den Tab schließen. Im Playtest kam ein Spieler dadurch an einem Gate vorbei, an dem ein aktiv spielender scheiterte: eine glatte Umkehrung von `02_Leitfaden_Kernmechaniken.md` §4 #5 („Aktiv *oder* Idle gewinnt klar").

Sobald (a) existiert, hat Offline diese Rolle nicht mehr und wird bewusst **erst nach der Neu-Balancierung** wieder betrachtet – man justiert nicht zwei gekoppelte Ökonomien gleichzeitig (§1 A6 im Leitfaden nennt genau das als Schwäche).

**Wichtige Abgrenzung: „idle" bleibt, „offline" geht.** Das Spiel bleibt bei geöffnetem Tab vollständig selbstlaufend (Auto-Kampf, §4.7). Entfernt wird ausschließlich der Fortschritt bei **geschlossener** Anwendung. Der Charakter des Spiels als Idle-Titel ist davon nicht berührt.

**Richtung für die Wiedereinführung** (noch nicht spezifiziert): statt passivem Ertrag ein **Boost, der sich in der Abwesenheit auflädt und nach der Rückkehr eine Zeit lang aktiv bleibt**. Das wandelt Abwesenheit in *aktiven* Spielwert um, statt Anwesenheit zu entwerten – die vom Leitfaden §3 empfohlene Auflösung der Spannung A2 ⟷ A6. Leitplanke dafür: Der Boost darf nie so stark werden, dass „vor einer Wand erst mal offline gehen" die optimale Strategie wird.

**Folgeänderungen:** `OFFLINE_RATE`/`OFFLINE_CAP` entfallen; der „Willkommen zurück"-Screen entfällt mit ihnen (samt seines irreführenden Hinweises, man möge „an der letzten geschafften Zone grinden" – eine Handlung, die es erst ab (a) gibt). Der Projektionsrechner selbst bleibt als **Balance-Werkzeug** wertvoll und sollte nicht gelöscht, sondern nur vom Spielerpfad abgehängt werden.

---

## 4. Datenmodelle / Schemas

Sprache-agnostisch (JSON-nah). Feldnamen sind Implementierungsvorschläge; **Code auf Englisch** (Projektregel).

### 4.1 Character (Laufzeit-Instanz)

```jsonc
{
  "id": "claude",
  "name": "Claude",
  "level": 1,
  "base": { "hp":110, "mp":20, "atk":14, "mag":6, "def":4, "spd":100 },
  "growth": { "hp":1.09, "atk":1.055, "mag":1.055, "def":1.05, "spd":1.00 },
  "special": { "id":"cross_slash", "mpCost":8, "unlockedFromZone":3 },
  "weaponTier": 0,          // 0..4, Gil-gekauft; wirkt auf Stats (§6.4)
  "controlMode": "auto",    // "auto" | "manual" – je Figur, ab Schalter-Freischaltung (§5.1)
  // Laufzeit:
  "hp":110, "mp":20,        // TRAGEN ÜBER (§3.5/§3.8d) – gehören in den Save
  "atb":0.0,                // pro Kampf zurückgesetzt
  "limit":0.0,              // pro Gate-Kampf bei 0 startend, NICHT persistiert (§3.4)
  "exp":0
}
```

Abgeleitete Stats: `stat = round(base.stat · growth.stat^(level-1)) · weaponMod`. `weaponMod` s. §6.4.

**Verbindlich (Playtest-Fund):** `hp` und `mp` sind **Übertragswerte**, keine abgeleiteten Maxima. Eine Kampfeinheit darf **nicht** bei jedem Zonenstart aus dem Charakter neu aufgebaut werden – genau das hat in der Erstumsetzung HP, MP *und* Limit gleichzeitig entwertet und §3.5 zu totem Text gemacht. Zu Kampfbeginn gilt: HP/MP aus dem Save übernehmen, `atb` und `limit` zurücksetzen.

### 4.2 Monster (Katalog-Eintrag)

```jsonc
{
  "id": "safeguard",
  "name": "Safeguard",
  "base": { "hp":75, "atk":9, "def":12, "spd":70 },
  "reward": { "exp":12, "gil":10 },
  "trait": "armor",         // Enum s.u.
  "weaknessTag": null,      // z.B. "fire" (Teaser, in Kap.1 nicht nutzbar)
  "shockAffinity": "neutral",
  "sprite": "monsters/safeguard_64.png"
}
```

**Trait-Enum (Kap. 1):** `baseline` · `fast` (Suppress-Ziel) · `armor` (hohe DEF, Konter Shock) · `fireweak` (Teaser) · `bomb` (Selbstzerstörung nach 3 Treffern, AoE, feuer-immun) · `poison` (DoT) · `drain` (MP-Drain + Flucht nach 4 Aktionen) · `boss` (telegrafierte AoE alle 3 Aktionen).

### 4.3 Encounter / Zone

```jsonc
{
  "zone": 21,
  "region": 3,
  "waves": [                       // hier 1 Welle; Zonen können mehrere haben
    [ {"monster":"shortfuse","size":1.0},
      {"monster":"blando","size":1.0},
      {"monster":"blando","size":1.0} ]
  ],
  "isGate": false,
  "limitAllowed": false     // §3.4 – nur an Gates/Bossen true
}
```

`size` moduliert Stats (±15 %) und wird auf `g^(zone-1)` aufgeschlagen. Vollständige Zonen-Tabelle in §6.3.

**`limitAllowed` ist bewusst ein Datenfeld am Encounter, keine Heuristik** (nicht „ist Boss-Trait" oder „Stats über Schwelle X"). So bleibt jede einzelne Begegnung autorierbar, und spätere Kapitel können Limit gezielt auch außerhalb von Gates freigeben, ohne die Regel umzubauen. In Kapitel 1 ist es exakt an den drei Gates gesetzt: Z8 Blandzilla, Z18 Fort Knoxious, Z30 Vaultron – alle drei, damit der Lehrmoment aus §7.1 (Limit als Wand-Brecher an Blandzilla) erhalten bleibt.

### 4.4 Weapon / Item (Kap. 1: Stats + Special, keine Slots)

```jsonc
{
  "ownerId": "claude",
  "tier": 2,                       // Gil-gekauft, 0..4
  "statMod": { "atk":1.20, "hp":1.10, "mag":1.20 },   // = 1 + 0.10*tier / 0.05*tier
  "unlocksSpecial": true,          // Special ist an die Waffe gekoppelt
  "slots": []                      // leer in Kap. 1; ab Kap. 2 Materia-Slots
}
```

### 4.5 Bestiarium-Eintrag

```jsonc
{ "monsterId":"kindlebale", "discovered":true, "weaknessRevealed":"fire",
  "weaknessUsable":false, "persistsThroughReunion":true }
```

### 4.6 SaveState (Kapitel-1-Umfang)

```jsonc
{
  "chapter": 1,
  "currentZone": 21,                      // gerade bespielte Zone (frei wählbar, §3.8a)
  "maxZoneReached": 24,                   // höchste je geschaffte Zone – Obergrenze der Auswahl
  "party": [ /* Character-Instanzen inkl. übertragener hp/mp, §4.1 */ ],
  "roster": ["claude","barrel"],          // freigeschaltet bis hier
  "currencies": { "exp": {...}, "gil": 3140, "reunionEssence": 0 },
  "bestiary": { /* Monster-ID -> Eintrag */ },
  "reunionCount": 0,
  "inn": { "queued": false },             // §3.8b – „nach diesem Kampf ins Gasthaus"
  "flags": { "autoAttackUnlocked":true, "mpVisible":true,
             "manualToggleUnlocked":true, "defenseUnlocked":false, "materiaUnlocked":false,
             "zoneSelectUnlocked":true }
  // "offline" entfällt – Offline-Progress stillgelegt (§3.8e)
}
```

Zahlen laufen über eine **BigNumber-/eigene Notation ab Tag 1** (`oekonomie-waehrungen.md` §3), auch wenn Kap.-1-Werte klein sind.

`maxZoneReached` ist neu und trägt die Zonen-Rückkehr: `currentZone` darf frei zwischen 1 und `maxZoneReached` wechseln, `maxZoneReached` selbst nur steigen. Bei der Reunion werden beide auf 1 zurückgesetzt (`prestige-reunion.md`).

### 4.7 Auto-Regel vor der 1. Reunion (überarbeitet, Playtest-Fund nach M7)

**Playtest-Korrektur:** Die ursprüngliche Fassung dieses Abschnitts ließ Auto bereits ab Zone 5 eine vollständige, smarte Prioritätsliste inkl. Specials/Heal/Suppress/Limit fahren – das fühlte sich im Playtest wie *Zuschauen* an, sobald Auto einmal an war, und widersprach `03_Konzept_Gerüst.md` §5/§15 ("**stumpfe** Auto-Attack sofort, **strategische** Gambits über Reunion"). Korrigierte Fassung:

```
Auto (vor der 1. Reunion, ab Zone 5): IMMER Attack (Fallback, +MP). Sonst nichts.
```

Das ist die **einzige** Auto-Regel. Kein Special, kein Heal, kein Suppress, kein Limit – diese vier bleiben bis zur 1. Reunion **exklusiv der manuellen Steuerung** vorbehalten (Aktions-Popup, §5.1). Zielwahl-Fallback fürs Auto-Attack: entschärfe zuerst `bomb`, dann `drain`, sonst schwächstes Ziel.

**Konsequenz (gewollt):** Auto trägt idle-fähig durch die **Mehrheit** der Zonen (Ventil-Prinzip bleibt), macht aber bewusst **keine** der drei Gates/Bosse (Blandzilla Z8, Fort Knoxious Z18, Vaultron Z30) idle-trivial – dort lohnt sich manuelles Eingreifen spürbar (s. §7.4, simulationsvalidiert). Aktives Spiel lohnt sich damit über das **gesamte** Kapitel, nicht nur an drei Checkpoints, und die 1. Reunion fühlt sich als echte Erlösung an: von stumpfem Auto-Attack zu einer klugen, **programmierbaren** Prioritätsliste (der bisherige 6-Regel-Satz aus der Erstfassung wird die Vorlage für deren Ab-Werk-Preset, `gambits.md` §5).

**Referenz für "aufmerksames manuelles Spiel"** (was der Spieler über Special/Heal/Suppress/Limit erreichen kann, und was die Pacing-Simulation für Gates ansetzt): Limit hat Vorrang, sobald voll; sonst je Figur ihr Special, sofern MP reicht (Air is... heilt bei Verbündeten-HP < 45 %, Tofa schlägt vor, wenn das Ziel noch nicht geschockt ist, Barrel unterdrückt bevorzugt SPD ≥ 140, sonst das stärkste Ziel, Claude trifft das stärkste Ziel); sonst Attack. Implementiert in `core/gambits.ts` als `resolveOptimalAction` (nur für die Pacing-Simulation aufgerufen, nicht vom Live-Spiel – dort wählt der Spieler selbst im Popup).

---

## 5. Kampf-Tick-Loop (Referenz-Pseudocode)

Vollständig lauffähig umgesetzt in `assets/sim/sim_chapter1.py`. Kern:

```
function battleTick(state, DT):
    if state.awaitingPlayerChoice: return PAUSED   # Bedenkzeit-Pause (Wait-Modus):
        # Uhr steht -> KEIN ATB, KEIN Shock-Auf/-Abbau, keine Telegrafs/DoT-Ticks.
        # Nur bei Idle/Auto oder nach bestaetigter Wahl laeuft die Uhr weiter.
    if keine Gegner leben: return WIN
    if keine Party lebt:   return LOSS

    tickPoison(state, DT)                       # 1 Tick/s DoT

    for f in party + enemies (in fester Reihenfolge):
        if not f.alive: continue
        rate = 1.0
        if f.isEnemy and f.shockTimer > 0: rate *= 0.3
        if f.suppress > 0: rate *= 0.5 ; f.suppress -= DT
        if f.isEnemy and f.shockTimer > 0: f.shockTimer -= DT
        f.atb += DT / atb_intervall(f.spd) * rate

        if f.atb >= 1.0:
            if f.isParty and f.controlMode == "manual":
                state.awaitingPlayerChoice = f           # Popup oeffnen -> ab jetzt pausiert
                return PAUSED                            # atb bleibt voll bis zur Wahl
            f.atb = 0
            if f.isParty: resolvePartyAction(f, state)   # controlMode == "auto": Default-Regeln §4.7
            else:         resolveEnemyAction(f, state)    # inkl. Boss-AoE / Bomb
    return ONGOING
```

`resolveEnemyAction` behandelt: `bomb` → nach 3 erlittenen Treffern AoE(2·ATK) + stirbt; `boss` → jede 3. Aktion AoE(1,8·ATK) auf ganze Party (telegrafiert, im Shock-Fenster ausgesetzt); `poison` → setzt 4 Ticks à 4 Schaden; `drain` → −15 MP am MP-reichsten Ziel, Flucht nach 4 Aktionen.

## 5.1 Manuelle Steuerung & Bedien-Flow

Konzept & Rollout: `gambits.md` §3/§6; Popup-Darstellung: `ui-layout.md`. Hier die Implementierungs-Sicht.

**Zustand:** `controlMode` je Figur (`"auto"|"manual"`); `state.awaitingPlayerChoice` (Figur oder `null`). Auto-Figuren handeln über die Default-Regeln (§4.7); Manuell-Figuren über das Popup.

**Flow (eine Manuell-Figur wird bereit):**

```
1. atb voll & controlMode=="manual"  → state.awaitingPlayerChoice = figur; Uhr pausiert
                                        (battleTick liefert PAUSED, nichts tickt weiter)
2. UI zeigt das Aktions-Popup an figur (FF7-Box)
3. Spieler waehlt Aktion (+ Ziel; Standardziel vorgewaehlt)
4. applyPlayerAction(figur, aktion, ziel):
        fuehrt Aktion aus; figur.atb = 0; state.awaitingPlayerChoice = null
5. Uhr laeuft weiter. Ist bereits die naechste Manuell-Figur voll → zurueck zu 1 (Warteschlange).
```

Die **globale Pause** (bestätigt): Solange `awaitingPlayerChoice` gesetzt ist, tickt **gar nichts** – auch Auto-Figuren, Shock-Timer, Telegrafs und DoT stehen (§5-Guard).

**Popup-Aktionsmenge (implementierungsnah):**

```
actions = [ Attack ]                                       # immer
if figur.special.unlockedFromZone <= currentZone
   and figur.weaponTier >= 1:                        + Special(mpCost)  # s.u.
if flags.defenseUnlocked:                          + Defend
if figur.limit >= 100:                             + Limit         # bunt dargestellt
if flags.materiaUnlocked and figur.materiaActions: + "Magic ▸"     # Unterliste (scroll)
```

**Ergänzung `weaponTier >= 1` (M6-Präzisierung):** Die reine Zonen-Bedingung wäre in der Praxis fast immer erfüllt (Gil ist ab Zone 3 bereits vorhanden), verlangt aber keinen echten Kauf. Die Implementierung prüft zusätzlich `weaponTier >= 1`, damit „Special" tatsächlich erst **nach** dem Gil-Kauf erscheint (§6.4, §7.1 Schritt 2) statt rein zonenbasiert – konsequenter zur Gil-Sink-Erzählung, ohne das Grundmodell zu ändern.

**Ausführbarkeit:** Eine Aktion ist *disabled*, wenn die Ressource fehlt (`Special` bei `mp < mpCost`) – sie wird **angezeigt, aber ausgegraut** (nie entfernt). `Limit` erscheint nur bei voller Leiste.

**Sichtbarkeits-Flags (Rollout, gestaffelt):** `manualToggleUnlocked` ab Default-Attack-Regel (Region 1; davor reiner Klicker ohne Schalter) · `defenseUnlocked` ab der ersten telegrafierten Boss-Aufladung · `materiaUnlocked` ab Kapitel 2. Vor `manualToggleUnlocked` ist jede Figur faktisch `manual` (Popup bei jeder Bereitschaft), nur ohne sichtbaren Umschalter.

---

## 6. Content-Tabellen (Kapitel 1)

### 6.1 Charakter-Startwerte (Level 1) & Specials

| Figur | Region | HP | MP | ATK | MAG | DEF | SPD | Special (MP) | Rolle |
|-------|:------:|---:|---:|----:|----:|----:|----:|--------------|-------|
| **Claude** | 1 | 110 | 20 | 14 | 6 | 4 | 100 | Big single-target hit ×3 ATK (8) | Damage |
| **Barrel** | 2 | 140 | 20 | 11 | 5 | 8 | 80 | Suppress: enemy ATB ×0.5 / 4s (6) | Control/Tank |
| **Tofa** | 3 | 95 | 20 | 12 | 5 | 3 | 130 | Shock Strike: +45 Shock (7) | Shock-Enabler |
| **Air is...** | 3 | 80 | 30 | 7 | 14 | 3 | 95 | Heal Wind: party heal 2.2·MAG (10) | Healing |

### 6.2 Monster- & Gate-Basiswerte (bei Einführung, vor `g`-Skalierung)

| Entität | HP | ATK | DEF | SPD | EXP | Gil | Trait |
|---------|---:|----:|----:|----:|----:|----:|-------|
| Blando | 40 | 8 | 2 | 100 | 5 | 4 | baseline |
| Caffiend | 32 | 10 | 2 | 180 | 6 | 5 | fast |
| Safeguard | 75 | 9 | 12 | 70 | 12 | 10 | armor |
| Kindlebale | 55 | 8 | 3 | 90 | 9 | 7 | fireweak (Teaser) |
| Shortfuse | 45 | 6 | 3 | 90 | 8 | 7 | bomb |
| Funkus | 60 | 7 | 4 | 85 | 10 | 8 | poison |
| Pilferret | 38 | 6 | 3 | 150 | 7 | 6 | drain |
| **Blandzilla** (R1-Miniboss, Z8, 1,5×) | 130 | 11 | 4 | 90 | 40 | 35 | baseline |
| **Fort Knoxious** (R2-Gate, Z18, 1,5×) | 160 | 12 | 14 | 70 | 70 | 60 | armor |
| **Vaultron** (Kapitel-Boss, Z30, 2×) | 240 | 14 | 16 | 70 | 140 | 120 | boss |

*Boss-Namen/Visualisierung & Sprite-Größen (Miniboss 1,5×, Boss 2×): `gegner-katalog.md` + `charaktere-visuals.md`. Sprites in `assets/bosses/`.*

### 6.3 Zonen-Encounter Z1–Z30

| Zone | Region | Welle | Lehrziel / Notiz |
|:----:|:------:|-------|------------------|
| 1–2 | 1 | 1× Blando | Kern-Loop, ATB lernen |
| 3–4 | 1 | 2× Blando (1 größer) | Special ab Z3 (Waffe) |
| 5 | 1 | 2× Blando | Auto-Attack-Regel |
| 6–7 | 1 | 3× Blando (gemischt) | erste kleine Wand |
| **8** | 1 | **Blandzilla** | **Miniboss → Limit als Wand-Brecher** |
| 9–10 | 2 | Blando + Caffiend | Barrel dazu; Speed spürbar → Suppress |
| 11 | 2 | Safeguard (solo) | Panzer: „hier will ich später Schwäche" |
| 12–13 | 2 | Kindlebale + Blando | Analyse enthüllt Feuer-Schwäche (Köder) |
| 14–15 | 2 | 2× Caffiend + Blando | Speed-Druck |
| 16–17 | 2 | Safeguard + Caffiend | zäh + flink; ohne Shock ~30 s (bewusst) |
| **18** | 2 | **Fort Knoxious** + Caffiend | **R2-Gate** |
| 19–20 | 3 | Funkus + Blando | Tofa+Air is... dazu; Gift → Heilung nötig |
| 21–22 | 3 | Shortfuse + 2× Blando | Bombe wegbursten vor Zündung |
| 23–24 | 3 | Pilferret + Caffiend | MP-Druck + Flucht → Burst/Suppress |
| 25–26 | 3 | Safeguard + Funkus | zäh + Gift; jetzt Shock als Konter |
| 27 | 3 | 2× Shortfuse | Doppelbombe → Defense/Heilung-Test |
| 28 | 3 | Funkus + Caffiend + Blando | 3er-Welle |
| 29 | 3 | 2× Shortfuse + Blando | Eskalation vor der Wand |
| **30** | 3 | **Vaultron** + 2× Blando | **Kapitel-Wand: telegrafierte AoE** |

### 6.4 Waffen-Tiers (Gil-Sink, Kap. 1)

Ein Item je Figur, Tier 0–4. Effekt: `atk ×(1+0,10·tier)`, `hp ×(1+0,05·tier)`, `mag ×(1+0,10·tier)`. Tier 1 schaltet den Special frei. Slots/A-B-Layout bleiben leer bis Kap. 2. Reset bei Reunion (Gil neu erspielt), der **gelernte Special bleibt**.

**Zwei Modelle, bewusst unterschieden (M6-Umsetzung):**

- **Headless-Pacing-Simulation** (`sim_chapter1.py`, M3-Referenzsimulation, `tests/chapter-playthrough.test.ts`): Faustregel `tier = level // 4` (max 4) – reine Vereinfachung, um Balance/Pacing ohne modellierten Shop-Flow durchzurechnen.
- **Live-Spiel (M6, `ui/gameStore.svelte.ts`):** Tier wird **ausschließlich über einen echten Gil-Kauf** gesetzt (`buyWeapon()`), **nicht** automatisch aus dem Level abgeleitet – deckungsgleich mit §7.1 Schritt 2 ("der erste Gil-Kauf gibt Claude die Waffe"). In Kapitel 1/Region 1 ist damit nur der eine Kauf Tier 0→1 modelliert (weitere Tiers folgen mit Barrel/Region 2 in M7+).
- **Gil-Preis (Playtest-Baseline, M6):** **8 Gil**, kaufbar ab Zone 3 – exakt der Gil-Stand, den die Baseline-Progression bis dahin abwirft (kein Warten, aber spürbarer erster Sink). War in §11 als offene Stellschraube markiert; dieser Wert ist der erste konkrete Ansatz, keine endgültige Balance.

---

## 7. So spielt sich Kapitel 1 – drei durchgespielte Beispiele

> ⚠️ **Dieser gesamte Abschnitt ist durch die Revisionen in §3.4/§3.5/§3.8 überholt und beschreibt ein Spiel, das es so nicht mehr gibt.** Er bleibt als Referenz stehen, weil die *Beats* (welcher Moment lehrt was) weiter gelten – die *Zahlen und Abläufe* nicht. Konkret ungültig geworden: der Attack-MP-Refund in §7.1, volle HP/MP zu Kampfbeginn in allen drei Beispielen, Limit außerhalb der Gates, und die komplette Pacing-Tabelle in §7.4.
>
> Der Abschnitt ist **nach der Umsetzung neu zu simulieren, nicht zu flicken.** Eine punktuell korrigierte Tabelle wäre schlimmer als eine offen als ungültig markierte – die Erstfassung war genau deshalb irreführend, weil sie glaubwürdig aussah (s. §3.8).

### 7.1 Region 1, die ersten Minuten (Claude solo)

1. **Zone 1–2, Klicker:** Ein Blando erscheint. Claude hat noch keinen Special; der Spieler tippt „Attack". Alle 2 s ein Treffer à 12 → Blando fällt nach **8 s**. Nach dem Sieg +25 % MP (unsichtbar, bis der Special da ist).
2. **Zone 3, Waffe & MP:** Der erste Gil-Kauf gibt Claude die Waffe → **Special freigeschaltet, MP-Leiste wird sichtbar**. Der Special (×3 ATK = 42) one-shottet einen Blando; nach 2 Casts ist MP leer → Angriffe füllen wieder auf.
3. **Zone 5, Automatik:** Die **Auto-Attack-Regel** schaltet auf; Trash läuft jetzt idle, der Spieler greift nur noch für den Special ein. ★ Erster „vom Tappen zum mühelosen Fortschritt"-Moment – **begleitet von einem kurzen Freischaltungs-Hinweis** (`ui-layout.md` „Freischaltungs-Hinweis (Unlock-Callout)"), sonst wirkt derselbe Moment verwirrend statt befreiend (Playtest-Learning nach M6).
4. **Zone 6–7, kleine Wand:** Drei Blandos setzen Claude zu. **Playtest-Korrektur (§4.7):** Da Auto vor der 1. Reunion nur angreift (kein Special), ist das jetzt die erste spürbare Grind-Wand des Kapitels – simulationsvalidiert ~8 Retries/Grindschleifen in Z5, bis Level/Waffe genug abwerfen (Ventil: EXP fließt durchgehend). Wer stattdessen kurz auf Manuell umschaltet und Claudes Special selbst timt, kommt deutlich schneller durch – exakt der „Idle-Wand, manuell schneller"-Fall aus `gambits.md` §4.
5. **Zone 8, Miniboss & Limit:** **Blandzilla** (130 HP), der Karton-Kaiju. Reiner Angriff wäre zäh; die über die Region geladene **Limit-Leiste** ist der telegrafierte Durchbruch. ★ Lehrt Limit als Wand-Brecher. Danach Claude ~Level 6.

### 7.2 Region 3, ein Shock-Kampf Schritt für Schritt (vgl. Screen 1.2)

Welle: Funkus + Shortfuse + Blando, volle Party. **Playtest-Korrektur (§4.7):** Diese Sequenz beschreibt **manuelles** Spiel – vor der 1. Reunion tut Auto ausschließlich Attack, keines der folgenden Schritte läuft von selbst.
1. Der Spieler stellt **Air is...** auf Manuell und heilt, sobald Funkus-Gift beißt.
2. **Barrel** (manuell) unterdrückt den schnellsten Gegner; **Claude** (manuell) bearbeitet das zäheste Ziel mit dem Special.
3. **Tofa** (manuell) schlägt Shock auf (+45) – zwei Schläge, dann kippt der Blando ins **Shock-Fenster**: DEF 0, ×2 Schaden, verlangsamt.
4. Der Spieler zündet **Tofas Limit ins Fenster** → maximaler Burst. Parallel muss **Shortfuse** vor seiner Selbstzerstörung fallen (Fokus-Regel).
5. **Rein idle (alle auf Auto)** greift die Party stattdessen nur an – Funkus' Gift und Shortfuses Bombe treffen ungebremst. Das ist beabsichtigt zäher (s. §7.4); wer die volle Sequenz will, muss (noch) manuell spielen. Erst die 1. Reunion macht so etwas programmierbar automatisierbar.

### 7.3 Kapitel-Wand & 1. Reunion

**Vaultron** (Z30), der Konzern-Mecha-Tresor, telegrafiert alle drei Aktionen eine **Gruppen-AoE** (sichtbar ladender Mako-Kern). **Playtest-Korrektur (§4.7):** Ohne Air-is...-Heilung und Limit-Timing ist dieses Gate in reinem Auto (nur Attack) **die härteste Wand des Kapitels** – simulationsvalidiert **~27 Retries**. Geht die Party auf **Manuell** (Heilung, Limit sofort bei voller Leiste), fällt Vaultron dagegen praktisch beim ersten Versuch (**0 Retries** in der Simulation) – der klarste Beleg im ganzen Kapitel, dass sich manuelles Spiel lohnt. Zwei Wege durch: **manuell spielen** (schnell) **oder** in Auto weitergrinden, bis der Levelvorsprung reicht (langsam, aber möglich – Ventil bleibt). Am Kapitelende steht die **Reunion** bereit (Screen 1.4): Reset von Zonen/Level/Ausrüstung, Erhalt von Charakteren/Bestiarium/Specials, Ertrag **Reunion-Essenz** → **programmierbare Gambits + erster Boost**.

### 7.4 Pacing – ⚠️ UNGÜLTIG, Neu-Simulation ausstehend

> **Diese Tabelle misst ein anderes Spiel als das ausgelieferte und ist ersatzlos zu verwerfen.**
>
> Der Test-Harness, der sie erzeugt hat, farmt bei jeder Niederlage an der zuletzt geschafften Zone (`tests/chapter-playthrough.test.ts`) – eine Mechanik, die es im Spiel bis zur Einführung der Zonen-Rückkehr (§3.8a) **nicht gab**. Jede „Retries"-Zahl unten setzt also Farm-Kämpfe voraus, die real nicht stattfinden konnten; jede Level-Spanne enthält deren EXP. Reale Spieler kamen mit **exakt einem Clear pro Zone** an den Gates an und blieben dort dauerhaft stecken.
>
> Zusätzlich entwertet durch: gestrichenen MP-Refund (§3.5), HP/MP-Übertrag statt Vollheilung (§3.8d), Limit nur noch an Gates (§3.4), Gasthaus-Zeitkosten (§3.8b) und die Stilllegung des Offline-Progress (§3.8e).
>
> **Vorgehen:** erst umsetzen, dann komplett neu simulieren, dann diese Tabelle ersetzen. Bis dahin existiert **keine** validierte Pacing-Baseline für Kapitel 1 – das ist ehrlicher als eine reparierte Zahlenreihe. Beim Neu-Aufsetzen muss der Harness die Zonen-Rückkehr als *Spielerentscheidung* modellieren (welche Zone farmt ein vernünftiger Spieler wie lange?), nicht als impliziten Automatismus.

**Historische Fassung (nicht mehr gültig, nur zur Nachvollziehbarkeit):** Die Zahlen unten ersetzen die Erstfassung (die von einem durchgehend smarten Auto ausging). Neu validiert über die TS-Engine (`tests/chapter-playthrough.test.ts`, deckungsgleich mit `sim_chapter1.py`s Logik) für die empfohlene Spielweise **„Auto in der Fläche, Manuell an den drei Gates"** (gambits.md §4). „Kampfzeit" = echte ATB-Zeit am Bildschirm; Menü-/Kauf-/Idle-Zeit kommt obendrauf.

| Region | Zonen | Kampfzeit (aktiv) | Level-Spanne (Claude) | Wände (Retries) |
|--------|:-----:|:-----------------:|:---------------------:|-----------------|
| 1 – Reactor Row | 1–8 | ~7,4 min | 1 → 7 | Z6 (regulär!) **~8** Retries ohne manuelle Übernahme · Miniboss Z8: **0** (manuell) |
| 2 – Bargain Bazaar | 9–18 | ~3,5 min | 7 → 12 | Gate Z18: **0** (manuell) |
| 3 – MegaCorp Tower | 19–30 | ~4,7 min | 12 → 18 | Kapitel-Wand Z30: **0** (manuell) |
| **Gesamt** | 30 | **~15,6 min** | **→ 18** | s. u. |

**Der Wände-Charakter hat sich verschoben:** Die drei Gates selbst sind bei manuellem Spiel (Heilung/Suppress/Special + Limit sofort bei voller Leiste) praktisch trivial – **manuell schlägt sogar die alte Auto-Heuristik** aus der Erstfassung (dort noch Z18 ~2 / Z30 ~6 Retries). Die eigentliche erste Wand ist jetzt **Zone 6** (eine reguläre Zone!), weil Auto dort nur noch angreift – genau der in §7.1 Punkt 4 beschriebene Grind-/Manuell-Moment.

**Reines Idle (nie manuell, auch nicht an Gates) bleibt schaffbar, aber deutlich zäher:** dieselbe Engine, ausschließlich Auto, liefert Gesamt **~50,8 min**, Endlevel Claude **22**, Retries Gate Z18 **8**, Kapitel-Wand Z30 **27** – knapp 3,25× langsamer als der manuelle Pfad. Das ist die simulationsvalidierte Bestätigung von „mit genug Grind auch idle machbar" (gambits.md §4 „Idle-Wände... manuell schneller").

**Einordnung in Echtzeit:** Die ~15,6 min (manueller Pfad) sind reine Kampfzeit. Ein aktiver **Erstdurchlauf** inkl. Waffenkäufen, Menüs und Wände liegt realistisch bei **~30–45 min**; wer nie manuell eingreift, braucht entsprechend länger bzw. lässt es idle/offline über **mehrere Stunden** laufen. Kampfdauern bleiben über das Kapitel dank ~1 Level/Zone ungefähr konstant (kein Aufblähen), mit Ausnahme der Zone-6-Grindschleife.

---

## 8. Asset-Zuordnung

Alle Assets liegen vor (64/256 px Sprites + Generatoren). Verbindliche Zuordnung für die Implementierung:

| Entität | Asset (Stage: 64 px, UI/Karten: 256 px) |
|---------|------------------------------------------|
| Claude / Barrel / Tofa / Air is... | `characters/{claude,barrel,tofa,airis}_64.png` |
| Blando / Caffiend / Safeguard / Kindlebale | `monsters/{blando,caffiend,safeguard,kindlebale}_64.png` |
| Shortfuse / Funkus / Pilferret | `monsters/{shortfuse,funkus,pilferret}_64.png` |
| *(Kap. 2:* Mitoslime / Boolinen / Jellyphase *)* | `monsters/{mitoslime,boolinen,jellyphase}_64.png` |
| Gates: Blandzilla (1,5×) / Fort Knoxious (1,5×) / Vaultron (2×) | eigene Sprites `bosses/{blandzilla,fort_knoxious,vaultron}_*.png` (Generator `generate_bosses.py`) – aufgemotzte Karton-/Tresor-Familien |
| Kulissen R1/R2/R3 | `regions/{reactor_row,bargain_bazaar,megacorp_tower}_480.png` |
| Bestiarium-Karten | `_256.png`-Upscales |

Die drei Kapitel-1-Bosse (maßstabsgetreu, Minibosse 1,5× / Kapitel-Boss 2×) – Blandzilla, Fort Knoxious, Vaultron:

![Boss-Sprites Kapitel 1](assets/bosses/_sheet.png)

**Sprite-Regeln** (`charaktere-visuals.md`): 64×64, transparent, Nearest-Neighbor-Upscale, Party links / Gegner rechts auf gemeinsamer Bodenlinie, Kopfraum für HP/Shock/Telegraf frei. **Display-Zoom (Playtest-Korrektur nach M6):** auf der Stage zusätzlich **2× Nearest-Neighbor-Zoom** auf alle Sprites gemeinsam (Details & Begründung: `ui-layout.md` „Battle-Stage & Standfläche") – die native Größenhierarchie Standard/Miniboss/Boss aus `charaktere-visuals.md` bleibt dabei erhalten. **Kulissen-Hinweis aus dem Mockup-Bau:** das fokale Reaktor-Motiv der MegaCorp-Kulisse sitzt nah am rechten Rand und ragt sonst in die Seitenleisten-Zone – Backdrop nach links ausrichten/breiter anlegen (bestätigt die Warnung in `ui-layout.md`).

---

## 9. Reproduzierbarkeit / Werkzeuge

- `assets/sim/sim_chapter1.py` – Kampf- & Pacing-Simulator (deterministisch). Liefert die Zahlen aus §7.4; dient als lebende Balance-Referenz für den Playtest.
- `assets/sim/make_mockups.py` – rendert die vier Screens aus §1 aus den echten Assets.

---

## 10. Leitplanken-Check (`02_Leitfaden_Kernmechaniken.md` §4/§5)

| Leitplanke / Anti-Pattern | Status in dieser Feinspec |
|---------------------------|---------------------------|
| #1 Wände ohne Ventil | ⚠️ **Dieser Haken war falsch.** „Grind-Kämpfe leveln weiter" beschrieb den Test-Harness, nicht das Spiel: An einer Wand floss real **gar nichts** (EXP/Gil nur bei Sieg, kein Weg zurück in eine geschaffte Zone, Determinismus ⇒ identische Wiederholung). Erst die Zonen-Rückkehr (§3.8a) stellt das Ventil her. Der Haken darf erst nach der Neu-Simulation wieder gesetzt werden. **Lehre:** Ein Leitplanken-Haken ist erst gültig, wenn die zugehörige Mechanik im *Spiel* geprüft wurde – nicht in der Simulation, die sie voraussetzt. |
| #2 Zu früh automatisieren | ✓ Klicker → **stumpfe** Auto-Attack (früh, Zone 5) → **jede** klügere Aktion (Special/Heal/Suppress/Limit) bleibt manuell bis zur 1. Reunion, die erst die **programmierbaren** Gambits bringt (Playtest-Korrektur nach M7) |
| #3 Nur Zahlenwachstum | ✓ Feature-Rampup: Klicker→Limit→Analyse→Shock→volle Party |
| #4 Komplexität ohne Onboarding | ✓ genau eine neue Mechanik je Region; Materia bewusst vertagt |
| #5 Dominante Einseitigkeit | ⚠️ **Im Playtest invertiert:** Ein Spieler mit geschlossenem Tab kam per Offline-Projektion an einem Gate vorbei, an dem ein aktiv spielender feststeckte – Offline war *strikt besser* als Aktiv. Ursache war dieselbe wie bei #1 (Offline war das einzige Ventil, §3.8e). Nach Stilllegung des Offline-Progress und Einführung der Zonen-Rückkehr neu zu bewerten. |
| #6 Sinnlose Resets | ✓ Reunion behält Charaktere/Specials/Bestiarium, gibt Gambits+Boost |
| #8 Triviale Klick-Upgrades | ✓ Waffe = Trade-off-Stats, keine Flut belangloser Käufe |
| #10 Zahlen-Fehler | ✓ BigNumber ab Tag 1; kontinuierliche Zähler |
| #11 Humor als Krücke | ✓ Parodie liegt auf validierten Mechaniken (Limit-Sprüche als Würze) |
| Determinismus (kein RNG) | ✓ Schaden/ATB/Shock rein deterministisch |
| Währungs-Disziplin | ✓ Kap. 1 nur EXP+Gil (+MP als Kampf-Ressource) |

**Bewusste Abweichung vom Spec-Vorschlag:** `g` von 1,08 auf **1,07** gesenkt und Level-Wachstum minimal unter `g` gelegt – aus der Simulation, damit Gates spürbare, aber grindbare Wände bleiben (bei 1,08 überholte die Skalierung die Party-Power zu stark). Dokumentiert und begründet gemäß CLAUDE.md.

---

## 11. Offene Playtest-Stellschrauben

**Vorbemerkung nach dem ersten Playtest:** Die Werte dieses Kapitels sind aktuell **sämtlich unvalidiert**. Die Revisionen in §3.4/§3.5/§3.8 stapeln drei Verknappungen übereinander – HP trägt über, MP hat kein In-Kampf-Nachfüllen mehr, Heilung kostet Zeit. Jede für sich ist begründet; zusammen können sie ein deutlich härteres Spiel ergeben, als jede Einzelentscheidung vermuten lässt. Alle Zahlen unten sind deshalb **Startwerte mit Begründung**, keine gesetzten Größen.

Die sensibelsten Hebel:

- **`g` + Level-Wachstum + EXP-Kurve** hängen zusammen (steuern Kampfdauer-Konstanz und Wandhärte) – nur gemeinsam justieren.
- **Erholung nach Sieg (25 %)** – gebunden an die Signalregel in §3.8d, nicht frei wählbar: komfortable Zone netto neutral, harte Zone netto negativ. Diese Regel bestimmt den Wert, nicht umgekehrt.
- **Gasthaus: Totzeit (10 s) und Rate (5 %/s).** Die Totzeit ist der eigentliche Design-Hebel (sie macht Heil-Spam unwirtschaftlich); die Rate steuert nur, wie teuer ein voller Heilgang ist. Ursprünglich als Band 5–10 s diskutiert – 10 s ist der Startwert, weil er nach einer Niederlage auf runde 30 s Gesamtwartezeit führt. **Wichtig:** Ohne Offline-Progress ist diese Zeit jetzt echte Wartezeit am Bildschirm; sie muss sich *gespielt* vertretbar anfühlen, nicht nur gerechnet.
- **MP-Ökonomie:** Refill 25 % + **neu herzuleitende** Special-Kosten (§6.1 war gegen den gestrichenen Refund balanciert). Bestimmt, wie oft Specials fallen – und wie hart die Heilungs-Obergrenze in Bosskämpfen greift.
- **Limit-Laderaten** (0,35 / 0,50) und Payoff (4,5·ATK) – neu zu justieren gegen das Ziel „die Leiste wird in einem Gate-Kampf ein- bis zweimal voll" (§3.4). Die alten Raten waren gegen eine über den Run persistierende Leiste gedacht und sind damit vermutlich zu niedrig.
- **Shock-Aufbaurate** (0,5·Schaden) und **Tofa-Bonus** (+45) – wie relevant Shock schon in Kap. 1 ist (nur bei manuellem Spiel nutzbar, s. §4.7).
- **Zeitstrafe bei Niederlage** (5 s) – wirkt jetzt zusammen mit der Gasthaus-Totzeit; beide Zeitkosten sind gemeinsam zu betrachten, nicht einzeln.
- **Zonen-Rückkehr:** ob die freie Auswahl ausreicht oder ob es eine Empfehlung/Markierung braucht („hier kommst du gerade sicher durch"). Reine Ventil-Funktion steht, die **Lesbarkeit** ist offen.
- Waffen-Tier-Kurve über Tier 1 hinaus (Region 2+); der erste Gil-Preis (Tier 0→1, Zone 3) ist mit 8 Gil seit M6 ein erster konkreter Ansatz (§6.4), nicht final.
- **Zweiter Gil-Sink fehlt weiterhin.** Das Gasthaus wäre der naheliegende gewesen, kostet aber bewusst Zeit statt Gil (Deadlock-Risiko, §3.8b). Offen, s. `oekonomie-waehrungen.md`.

**Erledigt durch diese Revision** (vormals hier offen): der Limit-Reset-Fehler bei jedem Zonenstart – das Esper-Modell (§3.4) macht die frühere Persistenz-Anforderung gegenstandslos, statt sie nachzurüsten.

# Bildschirm-Layout & Platz-Budget

**Status:** **Bühnen-Framework in M13 umgesetzt** (`src/ui/stageLayout.ts` + `Stage.svelte`, Abnahme in `tests/stage-layout.test.ts`); die Abschnitte unten sind damit gebaut, nicht mehr nur beschlossen. Platz-Budget/Rahmen – plus das **Bühnen-Framework** (Einheit, Bühnenbox, Skalierung, Bänder, Linien, Slot-Raster, Ebenen) und die entschiedenen Teile der Kampf-Darstellung (Steuer-UI, Aufstellung, Zustände, Markierungen). Übriges UI-Design folgt später.
**Rahmen:** unterlegt Region-Kulissen und Sprite-Platzierung; `../03_Konzept_Gerüst.md` §4.
**Prüfinstanz:** `../02_Leitfaden_Kernmechaniken.md`.

## Schnittstellen zu anderen Systemen

- **Region-Kulissen** (Backdrops): liefern die Bodenfläche im festgelegten Bodenband und die seitlichen/oberen **Bleed-Zonen**; fokale Motive aus der Seitenleisten- und der Bleed-Zone halten.
- **Charaktere/Monster** (`charaktere-visuals.md`): 64×64-Sprites (= 64 su) stehen mit ihrem Anker auf einer der beiden Standlinien; Bodenschatten ≤ 8 su innerhalb der Sprite-Box.
- **Incremental-System-UIs** (Materia, Shop, Prestige, Stats, Gambits): leben in der Seitenleiste/Submenüs (später).
- **Kampf** (`kampf-analyse-shock.md`): HP-/Shock-/Telegraf-Anzeigen über den Sprites brauchen freien Kopfraum.

## Grobe Aufteilung (Landscape)

- **Battle-Stage** (Kulisse + Kampf): großer Bereich oben/links.
- **Charakter-Steuerung:** horizontale Leiste **unten** (~18–22 % Höhe) – Limits, manuelle Übernahme, Aktionen.
- **Incremental / Menüs:** vertikale Leiste **seitlich** (~18–24 % Breite) – Materia, Shop, Prestige, Stats, Submenüs; ideal einklappbar.
- **Stage** = verbleibende ~76–80 % × ~78–82 %.

Diese Prozente beschreiben, **wie viel Fläche** die Stage vom Fenster bekommt. Was **innerhalb** der Stage passiert, ist ab hier vollständig durch das Bühnen-Framework festgelegt und hängt von der Fenstergröße nicht mehr ab.

## Bühnen-Framework (verbindlich)

**Neu, Playtest-Korrektur nach M11.** Vorher war die Kampfzone in **zwei unabhängigen Maßsystemen** beschrieben: Sprites absolut (64/96/128 px nativ + fester 2×-Zoom), Kulisse und Aufstellung relativ („unteres Drittel", „responsive an der Stage-Breite", „exaktes Spacing ist Implementierungsdetail"). Zwei Maßsysteme können per Konstruktion nicht proportionsstabil sein – bei schmalerem Fenster schrumpfte die Stage, die Sprites aber nicht (Figuren rückten zusammen), und der Backdrop wurde gestreckt, während die Sprites es nicht wurden (die Bodenfläche wanderte unter den Füßen weg). Das Framework ersetzt beides durch **eine Einheit und einen Skalierungsfaktor**.

**Schema:** `assets/stage-framework.svg` (Bänder, Linien, Slot-Raster, Bleed und Boss-Gegenprobe maßstäblich).

### Einheit und Bühnenbox

- **Stage-Unit (su)** ist die einzige Längeneinheit der Kampfzone. **1 su = 1 Sprite-Pixel nativ.**
- Der Backdrop ist nativ **168×96** (`charaktere-visuals.md`). Damit gilt fest: **1 Backdrop-Pixel = 3 su.** Kulisse und Figuren liegen in **einem** Raster.
- **Bühnenbox: 504 × 288 su**, Format **7:4 = 1,75**.
- **Alle** Positionen, Abstände und Bandhöhen werden in su angegeben – nie in Prozent der Stage, nie in CSS-Pixeln.

**Warum genau 504 breit:** Die Breite ist **aus der Aufstellung abgeleitet**, nicht umgekehrt. Party-Gruppe 224 su + Gegner-Gruppe 184 su + 48 su Mittelgang + 2 × 24 su Rand = 504 (Herleitung s. „Slot-Raster"). Das Ergebnis trifft den Zielkorridor: Eine Stage, die ~78 % der Breite und ~80 % der Höhe eines 16:9-Fensters einnimmt, hat selbst rund 1,73–1,78. Das frühere 5:3 (1,67) war **schmaler** als jedes übliche Fenster und hätte permanent horizontalen Bleed gebraucht.

### Skalierung: ein Faktor für alles

- **`s` = CSS-Pixel pro su**, angewandt auf **Backdrop, Sprites, Bodenaufsätze, Marker und Kopf-HUD gleichermaßen** – also auf die Backdrop-Ebenen, den F-Stapel und **U0**.
- **Nicht mitskaliert werden U1 und U2** (Kampf-Feedback, Aktions-Popup, Banner). Das ist Absicht: Es sind **textführende** Flächen, und bei `s = 1` wäre mitskalierter Text unlesbar. Sie leben in CSS-Pixeln und werden bei kleiner Bühne relativ *größer*.
- **Preis davon, und die Regel dagegen:** Ein Overlay, das nicht mitskaliert, wächst bei schrumpfender Bühne über die Figuren hinweg. **Ein U1/U2-Element darf deshalb nie die Figur überlappen, auf die es sich bezieht** – es weicht horizontal aus, statt sie zu verdecken. **Gemessener Fall (M13-Abnahme):** Das Aktions-Popup misst konstant 232×23 CSS-px – bei Stage 1092×656 sind das 107 su und es verdeckt nichts, bei Stage 540×720 sind es 217 su und es verdeckt **34 % der handelnden Figur**. Ausgerechnet die, die durch Vortreten und fehlende Abdunklung gerade hervorgehoben wird: Die visuelle Klammer zwischen Popup und Figur kippt dort in ihr Gegenteil.
- **`s = min(Stage-Breite / 504, Stage-Höhe / 288)`**, fließend (nicht auf ganze Stufen gerundet), begrenzt auf **1,0 ≤ s ≤ 4,0**.
- Der früher als „2×-Display-Zoom" beschlossene Wert ist damit keine Sprite-Eigenschaft mehr, sondern der **Referenzfall `s = 2`** (Bühne 1008×576 CSS-px, Standardfigur 128 px). Die Größenhierarchie aus `charaktere-visuals.md` (Standard 64 / Miniboss 96 / Kapitel-Boss 128 su) bleibt unverändert – sie ist jetzt schlicht in su ausgedrückt.
- **Bewusster Preis dieser Wahl:** Bei krummem `s` ist das Pixelraster ungleichmäßig (einzelne Pixel werden 1 CSS-px breiter). Das ist gegenüber ganzzahligen Zoomstufen abgewogen und **zugunsten der Komposition entschieden**: Eine Bühne, deren Proportionen sich beim Resizen nie ändern, ist mehr wert als ein perfektes Pixelraster mit sichtbaren Sprüngen und breiten Rändern. Rendering bleibt Nearest-Neighbor.
- **Unterhalb `s = 1,0`** (Stage schmaler als 504 CSS-px) greift **nicht** dieses Layout, sondern das noch unspezifizierte Portrait-/Kompakt-Layout (s. „Offene Punkte").

### Verankerung und Bleed

- Die Bühnenbox wird **horizontal zentriert** und **vertikal an ihrer Unterkante** am unteren Rand der Stage verankert. Der Boden bleibt damit immer unten; überschüssige Fläche entsteht oben (Himmel) und seitlich.
- Überschüssige Fläche wird **nicht** durch Balken oder durch Strecken gefüllt, sondern durch den **Bleed** des Backdrops: Die Kulisse wird mit demselben `s` über die Bühnenbox hinaus gezeichnet. Asset-Vorgabe dazu in `charaktere-visuals.md` („Region-Kulissen").
- **Der Backdrop wird nie unabhängig von `s` skaliert oder auf die Stage gestreckt.** Genau das war der ursprüngliche Fehler.
- **Wenn der Bleed nicht reicht** (M13-Fund): Bei einer sehr hohen/schmalen Stage bestimmt die Breite `s`, und über den 96 su oberem Bleed bleibt ein Rest. Der wird **mit der obersten Himmelsfarbe der Kulisse** gefüllt (die oberste Backdrop-Zeile ist exakt `sky_top` der Palette, `regionen-kulissen.md` §11) – der Himmel läuft optisch weiter. Kein Balken, kein Strecken, keine zweite Kachel.

### Vertikale Bänder (y von der Bühnenoberkante, 0 … 288)

| Band | y (su) | Höhe | Inhalt |
|---|---|---|---|
| **Himmelband** | 0 – 72 | 72 | Backdrop-Ferne. Kein Sprite, kein Kopf-HUD ragt hier hinein. |
| **Figurenband** | 72 – 192 | 120 | Sprite-Körper und ihr HUD-Kopfraum. |
| **Bodenband** | 192 – 288 | 96 | Standflächen, Schatten, Bodenaufsätze. |

Das **Bodenband ist exakt das untere Drittel der Bühne** und entspricht **den unteren 32 der 96 Backdrop-Pixel**. Das ist die verbindliche Antwort auf „wie hoch muss die Bodenfläche reichen": nicht „ungefähr unteres Drittel", sondern 32 Pixel im Asset.

### Linien und Anker

- **Bodenkante `G` bei y = 192** – Oberkante der Bodenfläche im Backdrop.
- **Standlinie hinten `B₂` bei y = 228**, **Standlinie vorn `B₁` bei y = 268**.
- **Anker einer Figur = Mitte der unteren Kante ihrer Sprite-Box.** Der Anker sitzt auf der Standlinie ihrer Reihe.
- **Reserven:** 36 su zwischen `G` und `B₂`, 20 su zwischen `B₁` und der Bühnenunterkante. Keine Figur steht an einer Kante. **20 su ist die Untergrenze** – darunter passen Bodenaufsätze (Shock-Ring) und der Schein der Marker nicht mehr vollständig auf die Bühne; absolutes Maximum wäre `B₁` = 272.
- **Deckenlinie bei y = 72:** Sprite-Oberkante plus 24 su HUD-Reserve muss darunter bleiben. Gegenprobe Kapitel-Boss (128 su, hintere Standlinie): Oberkante y = 100, HUD-Reserve bis y = 76 – passt.
- **Schatten-Regel (Asset):** Der Bodenschatten liegt **vollständig innerhalb der Sprite-Box**, berührt deren Unterkante und ist **≤ 8 su hoch**. Damit liegt jeder Schatten automatisch im Bodenband, sobald der Anker auf einer Standlinie sitzt – die Bedingung „Schatten immer auf der Bodenfläche" ist strukturell erfüllt und muss nicht je Figur geprüft werden.

### Tiefenvektor und Slot-Raster

Die hintere Reihe entsteht aus der vorderen durch **einen** konstanten Versatz – dem **Tiefenvektor `D` = (+40, −40) su** (40 su nach rechts, 40 su nach oben).

**Die Richtung ist nicht frei wählbar, sie steht in den Sprites.** Der Sprite-Generator zeichnet Oberseite und rechte Seitenfläche jedes Quaders mit dem Versatz `(+dd, −dd)` (`assets/generate_characters.py`, Helfer `blk`) – die Tiefenachse der Figuren läuft also **45° nach rechts-oben**, die Kamera steht oben-rechts-vorn. Eine Aufstellung, deren hintere Reihe nach links-oben versetzt ist, widerspricht den Sprites: Sie behauptet eine Kamera links, während jeder Würfel eine Kamera rechts zeigt. **`D` muss deshalb dieselbe 45°-Achse haben wie die Sprites**; frei ist nur der Betrag (hier 40 su). Ändert sich die Iso-Kippung der Assets, ändert sich `D` mit.

`D` ist für Party **und** Gegner identisch – das erfüllt „eine gemeinsame Perspektivrichtung für die ganze Stage, nicht je Seite gespiegelt" rechnerisch statt nur beschreibend. Sichtbare Folge: Die Aufstellung ist **nicht** spiegelsymmetrisch aufgebaut; auf beiden Seiten steht die hintere Reihe rechts-oben. Nur die *Gesamtausdehnung* beider Gruppen ist um die Bühnenmitte symmetrisch.

**Zwei verschiedene Slot-Abstände – bewusst:**

| | Slot-Abstand in der Reihe | Gruppenbreite | Warum |
|---|---|---|---|
| **Party** | **120 su** | 224 su | Vier namentlich bekannte Figuren, jede mit eigenem Panel, Limit und Zustand. Sie müssen einzeln lesbar sein und nicht als Traube. Bei 80 su standen alle vier in einer dichten Kette, weil `D.x` = 40 su die Figuren ohnehin auf halbe Spritebreite zusammenschiebt. |
| **Gegner** | **80 su** | 184 su | Ein Encounter ist ein **Pulk**, keine Riege von Individuen. Enger gestellt liest er sich als eine Gruppe, was der Zielwahl entgegenkommt (man wählt aus einer Masse aus) und die Bühne nicht unnötig verbreitert. |

**Slot-Mitten (x in su):**

| Slot | Seite | Reihe | x | y (Standlinie) |
|---|---|---|---|---|
| P1 | Party | vorn | 176 | 268 |
| P2 | Party | hinten | 216 | 228 |
| P3 | Party | vorn | 56 | 268 |
| P4 | Party | hinten | 96 | 228 |
| E1 | Gegner | vorn | 328 | 268 |
| E2 | Gegner | hinten | 368 | 228 |
| E3 | Gegner | vorn | 408 | 268 |
| E4 | Gegner | hinten | 448 | 228 |

- **Bounding-Boxen:** Party 24–248, Gegner 296–480. **Randbündig statt mittensymmetrisch** – beide Gruppen haben 24 su Außenrand, dazwischen 48 su Mittelgang. Eine Symmetrie um die Bühnenmitte ist bei ungleich breiten Gruppen nicht herstellbar und wäre auch falsch: Gleiche Ränder lesen sich als bewusste Rahmung, eine erzwungene Mittensymmetrie würde die Gegner an den Rand drücken.
- **Feste Slot-Zuordnung, kein Nachrücken – auch nicht bei Party-Zuwachs.** Jede Figur behält ihren Slot über den ganzen Zyklus; stoßen später Figuren dazu, füllen sie freie Slots, ohne die vorhandenen zu verschieben. Zum Start steht Claude allein auf **P1 (x = 176)**, leicht links der Mitte. Das ist dieselbe Begründung wie beim Gegner-Nachrücken: Was der Spieler anklickt, darf sich nicht unter dem Cursor verschieben. *(Korrigiert in M13: Hier stand „x = 192" – ein stehengebliebener Zwischenwert, der der Tabelle oben widersprach. Normativ ist die Tabelle.)*
- **Belegungsreihenfolge (M13):** Party in Roster-Reihenfolge P1 → P2 → P3 → P4, also Claude P1, Barrel P2, Tofa P3, Air is… P4. Gegner in Encounter-Reihenfolge E1 → E2 → E3 → E4.
- **Übergroße Figuren gehören nach hinten in die Mitte** – x = 388, y = 228. Das gilt **nicht nur für Solo-Gegner**, sondern für jede Figur über Standardgröße (Miniboss 96 su, Kapitel-Boss 128 su), auch mit Begleitung; die Begleiter stehen dann auf den **vorderen** Plätzen davor. Ein 128-su-Boss auf E1 würde den Nachbarn auf E2 fast vollständig verdecken – unlesbar und nicht anklickbar. Sichtbare Folge: Der Boss thront hinter seinen Schergen (Z18 Fort Knoxious + Caffiend, Z30 Vaultron + 2 Blando). *(Ergänzt in M13 – die Spec kannte bis dahin nur „Solo-Gegner" und gleich große Pulks.)*
- **Ein Solo-Gegner in Standardgröße** (64 su, z. B. Z1/Z2/Z11) steht dagegen auf **E1**, wie jeder erste Gegner: Der zentrale Rückplatz gehört der Größenklasse, nicht der Anzahl. Ein einzelner Standardgegner ganz hinten in der Mitte wirkt weit weg statt bedrohlich, und so bleibt „kein Nachrücken" auch beim Wechsel von einem auf zwei Gegner wörtlich erfüllt.

### Ebenen (Z-Reihenfolge)

Von hinten nach vorn. Auf diese Namen kann in Folge-Sessions Bezug genommen werden.

| Ebene | Inhalt |
|---|---|
| **B0 Ferne** | Himmel/Skyline im Backdrop; **die einzige Ebene, in der sich etwas bewegen darf** (`regionen-kulissen.md` §10) |
| **B1 Motiv** | Hauptmotiv des Backdrops (Reaktor, Basar, Turm) |
| **B2 Boden** | Bodenfläche des Backdrops (unteres Drittel) |
| **F-Stapel** | **je Figur ein eigener Stapel**, sortiert nach Standlinie (hintere Reihe zuerst): **F0** Bodenaufsätze (Shock-Ring, Bodenmarker, auf der Standlinie liegend) → **F1** Sprite → **F2** Sprite-Marker (Silhouetten-Umriss + Schein + Glyphe) |
| **U0 Kopf-HUD** | Name/HP/Shock/Telegraf über den Sprites |
| **U1 Feedback** | Schadenszahlen, Treffer-Effekte |
| **U2 Overlay** | Aktions-Popup, Unlock-Callout, Stage-Banner |

**Wichtig:** Die Marker gehören in den Stapel **ihrer** Figur, nicht auf eine globale Marker-Ebene – sonst würde der Umriss einer hinteren Figur über eine vordere gezeichnet und der Tiefeneindruck bräche. Nur U0–U2 liegen global über allem; für U0 gilt weiterhin die Kopfraum-Regel (hintere Reihe darf nicht verdeckt werden).

**Kontrastplatte für U0 (verbindlich).** Das Kopf-HUD liegt zwangsläufig teilweise **vor** Sprites und vor der Kulisse – bei zwei Reihen ist das unvermeidbar, unabhängig vom Tiefenversatz. Im Test (`assets/mockups/stage-hud-check.html`) verschwindet Text ohne Hinterlegung vor den hellen Fenstern der Reactor-Row-Kulisse. Jedes U0-Element bekommt deshalb eine **dunkle, leicht transparente Platte** hinter Name und Balken – dieselbe Anmutung wie das Aktions-Popup, damit die UI-Sprache einheitlich bleibt. Reine Textumrandung (Outline/Shadow) genügt nicht: Sie hält Kulissen mit hohem Kontrast nicht stand.

**Vertikaler HUD-Zeilenabstand = `D.y`.** Da die hintere Reihe um `D.y` höher steht, liegen die HUD-Zeilen der beiden Reihen genau 40 su auseinander. Der HUD-Block darf deshalb **24 su nicht überschreiten** – sonst kollidieren die Zeilen der beiden Reihen. Das ist der eigentliche Grund, warum `D` nicht kleiner als 32 gewählt werden darf.

### Leitplanken-Check

- **„Lesbarkeit zuerst"** (`../03_Konzept_Gerüst.md` §15): Der eigentliche Gewinn. Eine Kampfzone, deren Komposition sich mit der Fenstergröße ändert, ist genau die Art unlesbarer Oberfläche, gegen die diese Leitplanke steht – Spieler lernen Positionen und Marker als Muster, und das Muster darf nicht vom Browserfenster abhängen.
- **Anti-Pattern #10 („ungleichmäßig springende Zähler")** betrifft die Zahldarstellung, nicht das Rendering – **aber die Analogie ist die richtige Brille für den Preis der fließenden Skalierung:** Auch ein ungleichmäßiges Pixelraster bricht eine Illusion von Sauberkeit. Die Abwägung ist bewusst getroffen (stabile Komposition schlägt perfektes Raster) und hier festgehalten, damit sie später nicht als Versehen gelesen wird. Wird das im Spiel störender als erwartet, ist die Gegenmaßnahme **nicht** variables Spacing, sondern ein Rasten von `s` auf ganze/halbe Stufen bei gleichzeitig mehr Bleed.
- **Kein Konflikt** mit den Anti-Patterns #1–#9, #11, #12: Das Framework fügt weder Systeme noch Ressourcen hinzu, es legt nur fest, wo Vorhandenes steht.

## Battle-Stage & Standfläche (verbindlich für Kulissen)

- Jede Kulisse braucht eine klare **Standfläche** (Bodenzone) – konkret: das **Bodenband** (untere 96 su = untere 32 Backdrop-Pixel), sichtbar über der Bottom-Leiste.
- **Party bis 4 (links)** vs. **Gegner bis 4 (rechts)** auf den beiden Standlinien; native 64×64-Sprites (= 64 su).
- **Display-Zoom (entschieden nach M6, im Framework aufgegangen):** Der frühere „gemeinsame 2×-Nearest-Neighbor-Zoom" ist jetzt der Referenzfall `s = 2` des Bühnen-Frameworks. Die Größenhierarchie aus `charaktere-visuals.md` (Standard 64 / Miniboss 96 / Kapitel-Boss 128 su) bleibt erhalten und skaliert mit `s` gemeinsam hoch. **Spacing ist kein Implementierungsdetail mehr**, sondern über das Slot-Raster festgelegt.
- **Fokale Motive** (z. B. Reaktor) nicht in die Seitenleisten-Zone legen; Bleed-Zonen des Backdrops tragen kein fokales Motiv (s. `charaktere-visuals.md`).
- **Kopfraum** über den Sprites frei halten, damit HP/Shock/Telegraf-Anzeigen nicht von UI verdeckt werden (Lesbarkeit).

## Kampf-Darstellung: Aufstellung, Zustände & Markierungen

**Neu, Playtest-Politur nach M11.** Bis hierher standen alle Figuren in einer gleichförmigen Reihe, gefallene Figuren blieben unverändert stehen, und die beiden Markierungsarten waren unterschiedlich gestaltet.

### Aufstellung: zwei versetzte Reihen (Tiefe)

Party wie Gegner stehen in **zwei leicht versetzten Reihen** statt in einer Linie, um Tiefe anzudeuten.

**Revidiert nach dem Perspektiv-Check (Mockup `assets/mockups/stage-perspective.html`).** Die frühere Fassung verlangte einen betont dezenten Versatz, „erkennbar als Perspektive, nicht als zwei taktische Blöcke" – aus der Sorge, eine als Formation lesbare Aufstellung suggeriere eine Mechanik, die es nicht gibt (Gegner zielen auf die höchsten aktuellen HP, völlig positionsunabhängig, `gegner-encounter.md` §6a).

**Diese Sorge trägt nicht, und der Versatz ist jetzt deutlich.** Begründung:

- **Der Spieler kann die Aufstellung nicht ändern.** Slots sind fest zugeordnet, es gibt keinen Aufstellungs-Bildschirm. Wer nichts umstellen kann, kann auch nichts wirkungslos „optimieren" – der eigentliche Schaden des Anti-Patterns entfällt.
- **Die einzige verbleibende Fehlannahme** wäre „hinten wird seltener getroffen". Genau die widerlegt die Zielmarkierung bei **jedem** Angriff sichtbar: Die rote Markierung sitzt an der Figur mit den höchsten HP, unabhängig von der Reihe (s. „Markierungen").
- **Die Optik wiegt schwerer.** Eine flache Reihe wirkt wie ein Sprite-Fries; die klare Staffelung liest sich als Raum. Bei einem Spiel, dessen Kampfbild man stundenlang ansieht, ist das kein Nebenaspekt.
- **Kommt später doch Positionsmechanik** (Kapitel 2+), ist die etablierte Formations-Optik ein Vorteil statt eines Problems.

Was bleibt: Die Reihen sind **keine** Mechanik, und nichts in der UI darf so tun. Kein Reihen-Tausch-Knopf, keine Reihen-Beschriftung, keine Tooltips über „Vorder-/Hinterreihe".

- **Tiefenmittel:** Versatz entlang der Sprite-Tiefenachse, teilweise Überlappung, korrekte Z-Reihenfolge (hintere Reihe hinter der vorderen), **empfohlen** zusätzlich eine minimale atmosphärische Abdunklung/Entsättigung nach hinten (im Mockup geprüft: wirkt dezent und hilft der Tiefe). **Zahlenwerte dazu im Bühnen-Framework:** Tiefenvektor `D` = (+40, −40) su, Slot-Raster, F-Stapel.
- **Kein Größenunterschied zwischen den Reihen.** Größe ist bereits ein bedeutungstragender Kanal (Standard 1× / Miniboss 1,5× / Kapitel-Boss 2×, s. „Battle-Stage & Standfläche"). Würde Tiefe zusätzlich über Skalierung laufen, wäre ein Miniboss hinten von einem Standardgegner vorn nicht mehr sicher zu unterscheiden.
- **Eine gemeinsame Perspektivrichtung für die ganze Stage** – nicht je Seite gespiegelt, sonst liest es sich als zwei getrennte Bühnen statt als ein Raum.
- **Reihenzuordnung bleibt innerhalb eines Kampfes stabil.** Fällt jemand, rücken die anderen nicht nach (s. u.).
- **Kopfraum-Regel erweitert:** Namen/HP/Shock-Anzeigen der hinteren Reihe dürfen nicht von Sprites der vorderen verdeckt werden.

### Vortreten bei Bereitschaft

**Die Slots sind fest, aber nicht starr.** Sobald die ATB-Leiste einer **Party-Figur** voll ist (`atb >= 1.0`, `feinspec-kapitel1.md` §5.1), **tritt sie nach vorne rechts** – um **(+12, +12) su** – und ist währenddessen **nicht** abgedunkelt, auch wenn sie in der hinteren Reihe steht. Ihr Kopf-HUD wandert mit. Nach der Aktion kehrt sie auf ihren Slot zurück.

**Warum nicht einfach entlang −`D` nach vorn:** Weil dort der Vordermann steht. Die hintere Reihe entsteht aus der vorderen durch +`D`; ein Schritt in Richtung −`D` läuft also **exakt auf die vordere Figur zu**, die auf der tieferen Standlinie liegt und damit über die vortretende gezeichnet wird. Die Figur würde beim Vortreten *stärker* verdeckt statt freier – nachweisbar in `assets/mockups/stage-stepforward.html`.

**Die Bühne hat zwei Weltachsen, nicht eine:** die **Tiefenachse** (45°, `D`) und die **Seitenachse**, die bei frontal gezeichneten Sprites rein horizontal verläuft (die Front-Fläche jedes Quaders ist ein achsenparalleles Rechteck). Jede Kombination aus beiden ist perspektivisch gültig. Das Vortreten ist genau so eine Kombination: **12 su vor** (−`D`-Richtung) **plus 24 su seitlich nach rechts** = netto (+12, +12). Die Figur kommt damit **neben** ihren Vordermann statt hinter ihn; die Restüberlappung sinkt auf 12 su.

**Warum 12 su Tiefe und nicht 20 (halber Tiefenschritt):** Die Reserve unter `B₁` beträgt 20 su. Ein Vortreten um 20 su setzt eine Figur der **vorderen** Reihe exakt auf die Bühnenunterkante – ihr Bodenaufsatz wäre abgeschnitten. Mit 12 su bleiben 8 su Restluft. **Der Effekt lebt ohnehin von der Bewegung, nicht vom Endzustand:** Eine Verschiebung um 12 su ist im Standbild dezent, als Animation aber sofort augenfällig.

**Warum nur die Party:** Bei den Gegnern liegen die Slots 80 su auseinander statt 120 – im Pulk gibt es keine freie Richtung, jeder Schritt läuft in einen Nachbarn. Gegner kündigen ihre Aktion ohnehin über den **Telegraf** an (`kampf-analyse-shock.md`), also über einen eigenen, dafür gebauten Kanal. Positionswechsel wäre dort ein zweites Signal für dieselbe Information – und ein schlechteres.

- **Das ist die FF7-Konvention** (die handelnde Figur tritt aus der Reihe) und damit tonal passend.
- **Im Auto-Kampf** ist das Vortreten schlicht der Anlauf der Angriffsanimation – es entsteht keine zusätzliche Bewegung, sondern die ohnehin nötige bekommt eine Bedeutung.
- **Im Manuell-Modus** bleibt die Figur vorgetreten, solange ihr Aktions-Popup offen ist. Das verbindet sichtbar das Popup an der Bottom-Leiste mit der Figur auf der Bühne – bisher gab es dafür keine visuelle Klammer.
- **Jede Figur steht dadurch regelmäßig vorn, hell und unverdeckt**, auch die dauerhaft hinten stehenden.
- Die Bewegung läuft **entlang der Tiefenachse**, nicht seitlich – sonst widerspricht sie der Perspektive.

**Verworfen: Aufstellung nach ATB-Reihenfolge sortieren.** Erwogen wurde, die Figuren permanent so umzustellen, dass die als Nächstes handelnde ganz vorn steht. Die Idee ist attraktiv – sie machte die heute rein dekorative Tiefenachse informationstragend – scheitert aber an vier Punkten:

1. **Objektpermanenz.** Ein Idle-Spiel wird in kurzen Blicken gelesen. Feste Plätze heißen „ich weiß, wo Tofa steht"; wechselnde Plätze heißen „ich suche sie jedes Mal neu". Das ist ein Verlust an Lesbarkeit, und Lesbarkeit ist die oberste Leitplanke.
2. **Flackern.** Die SPD-Werte liegen dicht beieinander; zwei Figuren mit fast gleichem ATB würden mehrmals pro Sekunde tauschen. Dagegen bräuchte es Hysterese, Mindestverweildauer und Animationssperren – viel Maschinerie für eine Anzeige.
3. **Zwei Reihen können keine Viererreihenfolge abbilden** – nur „die nächsten zwei" gegen „die anderen zwei". Für echte Reihenfolge bräuchte es vier Tiefenstufen und damit eine Diagonale quer über die halbe Bühne.
4. **Die Information existiert bereits** – vier ATB-Balken in der Bottom-Leiste zeigen sie ruhig und exakt.

Das Vortreten liefert den erwünschten Nutzen (jede Figur mal vorn und hell, sichtbar wer dran ist) ohne diese Kosten, weil es **ereignisgebunden** statt kontinuierlich ist.

### Gefallene Figuren

**Party – „am Boden, nicht weg":** Eine Figur mit 0 HP bleibt **an ihrem Platz sichtbar**, deutlich als ausgeschieden markiert (entsättigt/abgedunkelt, leere HP-Leiste, nach Möglichkeit veränderte Pose). Sie wird **nicht entfernt**, denn das entspricht der Mechanik: Sie ist für *diesen Kampf* raus, kehrt aber nach dem nächsten Sieg automatisch mit 25 % zurück (Sieg-Erholung, `feinspec-kapitel1.md` §3.5). Der Platz gehört ihr weiterhin.

*Wichtig:* Kapitel 1 kennt **keine Wiederbelebungs-Aktion**. Die Rückkehr nach dem Sieg ist der einzige Weg zurück – die Darstellung darf also keine Aktion andeuten, die es nicht gibt (kein „Revive"-Knopf, kein Aufforderungs-Blinken).

**Gegner – verschwinden, aber mit einem Takt:** Besiegte Gegner werden ausgeblendet, jedoch **nicht schlagartig** (kurzes Auflösen/Ausblenden), sonst liest sich der Abgang wie ein Darstellungsfehler statt wie ein Erfolg.

**Verbindlich: Der frei gewordene Platz wird nicht nachgerückt.** Die verbleibenden Gegner behalten bis Kampfende ihre Position. Zwei Gründe: Das Fokusziel ist ein **Array-Index** und bewusst über die gesamte Kampfdauer stabil (Umsetzungsentscheidung 3 zu M11) – ein optisches Nachrücken würde entkoppeln, was der Spieler anklickt, von dem, was er sieht. Und nachrückende Sprites verschieben Klickziele unter dem Cursor, mitten im Kampf.

### Markierungen: gleiche Form, unterschiedliche Farbe

Es gibt zwei Markierungen mit **verschiedener Bedeutung**:

| Markierung | Bedeutung | Zweck |
|---|---|---|
| an einer **Party-Figur** | wird als Nächstes angegriffen | Verteidigungs-Information, Grundlage für Defend (`feinspec-kapitel1.md` §3.9) |
| an einem **Gegner** | ist das Fokusziel | Absichtserklärung des Spielers |

Bisher unterschieden sie sich in der **Form** (dezenter Rand vs. großer Kasten) – das ist die falsche Achse. **Die Form bleibt konstant, die Farbe trägt die Bedeutung:**

- **Form (beide):** dünner Umriss entlang der Sprite-Silhouette plus dezenter Schein. **Keine Kästen** – ein Rechteck um ein freigestelltes Pixel-Sprite wirkt wie ein Debug-Rahmen und dominiert die Stage.
- **Farbe:** **rot/warm** für „wird getroffen" (Bedrohung), **kühl (Cyan/Weiß)** für „Fokusziel" (Spielerabsicht). Cyan ist im Spiel bereits die Farbe der Spielerkontrolle (Manual-Chip, `feinspec-kapitel1.md` §1.5) – die Zuordnung ist also schon gelernt. *(M13: Das stimmte zum Zeitpunkt der Spec **nicht** – der Auto/Manual-Umschalter war für beide Zustände blau. Aufgelöst zugunsten dieser Regel: Aktives „Manual" trägt jetzt Cyan, aktives „Auto" bleibt Blau. Cyan heißt damit durchgängig „der Spieler greift ein".)*
- **Der Shock-Ring bekommt einen dunklen Saum.** Ohne ihn hängt seine Lesbarkeit an der Kulissenfarbe – und mehrere Regionen liegen palettenseitig in derselben Farbfamilie (Quaintsville „warmes Ocker", Stargazer Gulch „Terrakotta", Blastoff Burg „Rostrot"). Die Signalfarben-Sperre für Kulissen (`regionen-kulissen.md` §4) verhindert die *Verwechslung* mit einem Marker, aber nicht den *Kontrastverlust*: Lesbarkeit hängt am Farbton, nicht nur an der Sättigung. Ein dunkler Saum löst das an der richtigen Stelle – einmal am Ring, statt die Paletten von zwei Kapiteln immer weiter einzuschnüren.
- **Gold/Bernstein bleibt exklusiv dem Shock vorbehalten.** Die aktuelle bernsteinfarbene Fokus-Markierung kollidiert direkt mit dem Shock-Ring am selben Gegner – **das ist ein Lesbarkeitsfehler, keine Geschmacksfrage**: Zwei unabhängige Zustände teilen sich eine Signalfarbe, und ausgerechnet am selben Objekt.
- **Kleine Glyphen (▲/◆) bleiben** als redundante Kodierung neben der Farbe – dasselbe Doppel-Kodierungs-Prinzip, das die Aktions-Popup-Zustände schon nutzen (s. unten „Zustandskodierung doppelt").

## Charakter-Steuerung: Panels & Aktions-Popup

Die Bottom-Leiste trägt je Figur ein **Charakter-Panel** (HP/MP/ATB/Limit) plus einen **Auto/Manual-Schalter** (erscheint mit der ersten Automatik, s. `gambits.md` §6). Bedien-Flow (Modus je Figur, globale Wait-Pause, Warteschlange): `gambits.md` §3.

**Aktions-Popup (FF7-Menübox):** Wird eine Manuell-Figur bereit, öffnet **direkt an ihrem Panel** ein Aktions-Popup (die Kampfuhr pausiert global). **Explizit (Playtest-Korrektur nach M6):** Solange die ATB-Leiste einer Figur **nicht voll** ist, ist **weder das Popup noch ein einzelner Aktions-Button** (z. B. ein ausgegrauter „Attack") sichtbar – es gibt schlicht nichts zu bedienen. Das Popup erscheint **exakt in dem Moment**, in dem `atb >= 1.0` wird (`feinspec-kapitel1.md` §5.1), nicht früher als gedämpfte Vorschau. „Ausgegraut, aber sichtbar" gilt ausschließlich für **einzelne Aktionen innerhalb eines bereits offenen Popups**, denen eine Ressource fehlt (z. B. Special ohne genug MP) – nicht für das Popup/den Button als Ganzes vor ATB-Bereitschaft.

- **Look:** dunkle, leicht transparente Box im **Blau/Lila-Bereich** (FF7-Menübox-Anmutung), klar von der Stage abgesetzt; **helle Schrift** (Weiß / Weißgelb).
- **Zustandskodierung doppelt (Lesbarkeit):** verfügbare Aktionen **hell + kräftige (dickere) Schrift**; nicht verfügbare (z. B. Spezial ohne MP) **gedämpft + dünne Schrift** – sichtbar, aber sofort als „gerade nicht möglich" lesbar.
- **Limit:** wenn geladen, in **bunten Buchstaben** (jeder Buchstabe eine kräftige Farbe) – die FF7-Signatur.
- **Skalierung:** feste Grundaktionen oben (Attack, Special, Limit; Defend ab Boss-Event); **Materia unter der Kategorie „Magic ▸"** als **scroll-/blätterbare Unterliste** → das Popup behält seine Größe, egal wie viele Materia (rutscht nie aus dem Bild). Kategorie nur sichtbar, wenn Materia-Aktionen existieren.
- **Platz:** Popup wächst nach **oben** in die Stage (über der Bottom-Leiste), auf der Party-Seite (links), damit es die Gegner-Seite und deren HUD nicht verdeckt. **Es weicht der eigenen Figur aus** (s. Bühnen-Framework, „Skalierung"): Läge es über der Figur, deren Aktion es abfragt, verdeckt es genau das, worauf es sich bezieht – bei kleiner Bühne messbar ein Drittel davon. Maßgeblich ist die Figur **in ihrer vorgetretenen Position**, nicht ihr Slot.

## Tastensteuerung (beschlossen 02.08.2026)

**Anlass (Nutzer, gespielt):** Das Aktions-Popup öffnet am Panel der **jeweils** handelnden Figur (s. „Platz" oben). Bei mehreren bereiten Manual-Figuren arbeitet die Warteschlange (`gambits.md` §3) sie nacheinander ab – das Popup **springt dabei über die ganze Bottom-Leiste**, und der Cursor muss jedes Mal hinterher. Der Weg skaliert mit der Fensterbreite **und** mit der Party-Größe: Bei Claude allein (P1) gibt es ihn kaum, mit vier Figuren ist er maximal.

**Warum das kein Komfort-Thema ist.** Manuelles Spiel ist der Clutch-Modus (`gambits.md` §3); die Sessions vom 30.07.2026 haben die **Idle-Konvergenz** als Kernproblem diagnostiziert – Spieler landen bei Typ V, weil manuell zu teuer ist. Reibungskosten der Ausführung sind damit direkt Balance-relevant, nicht Politur. Und ausgerechnet die Phase mit voller Party, in der manuelles Spiel den größten Unterschied macht, hat den längsten Mausweg.

**Verworfen: das Popup an einer festen Stelle öffnen.** Das wäre die mildere Änderung – kein neuer Eingabekanal, Mausweg trotzdem weg. Kosten: Die Verortung am Panel ist die **visuelle Klammer** zwischen Popup und der vorgetretenen Figur (s. „Vortreten bei Bereitschaft" und „Platz"; das Popup weicht der Figur sogar aktiv aus, statt sie zu verdecken). Ein festes Popup bricht diese Klammer und lässt „wer ist eigentlich dran?" wieder offen. Die Tastensteuerung entfernt die Bewegung und **erhält** die Klammer.

### Belegung

| Taste | Aktion |
|---|---|
| **A** | Attack |
| **S** | Special |
| **D** | Defend (ab Freischaltung) |

- **An die Bedeutung gebunden, nicht an die Zeilenposition.** Alle drei Aktionen tragen ihren eigenen Anfangsbuchstaben – das ist eindeutig ohne Zusatzbeschriftung, und die Taste bleibt dieselbe, egal wie viele Zeilen das Popup gerade hat. Eine positionsgebundene Belegung („A = erste Zeile") würde beim Erscheinen von Limit oder Defend still ihre Wirkung ändern.
- **D ist tot, solange Defend nicht freigeschaltet ist** – kein Fehlerton, keine Ersatzwirkung. Konsequenz aus der Bedeutungsbindung.
- **Limit bekommt bewusst keine Taste.** Es steht im Popup zwischen Special und Defend; auf der Nachbartaste F wäre es genau eine Fingerbreite von A/S/D entfernt – und ein versehentlich verheiztes Limit ist an einem Gate teuer, wo es nur einmal geladen ist. Limit gibt es ohnehin nur in Gate-/Boss-Kämpfen, dort steht die Uhr (Wait-Pause), und ein Mausklick kostet nichts. **Der Preis, ehrlich benannt:** Ausgerechnet die Aktion mit dem größten Einsatz behält den Mausweg. Bewusst so – es ist die Aktion, bei der man hinschauen *soll*.
- **Keine Tasten für die Zielwahl**, weil es keinen Zielwahl-Schritt mehr gibt (`feinspec-kapitel1.md` §3.9, revidiert am selben Tag). Der Fokuswechsel bleibt Maus/Tipp auf den Gegner – er ist die **Entscheidung**, nicht die Ausführung, und darf ruhig einen bewussten Handgriff kosten.

### Regeln (verbindlich)

- **Nur wirksam, solange ein Aktions-Popup offen ist.** Kein Popup = keine Wirkung.
- **Kein Key-Repeat, keine gepufferten Eingaben.** Jeder Tastendruck gilt für genau das Popup, das beim Druck offen ist; Eingaben davor werden verworfen. Ohne diese Regel rasselt bei gehaltener Taste eine ganze Popup-Serie durch – derselbe Mechanismus, mit dem man Einführungs-Popups wegklickt, ohne sie zu lesen, und ein direkter Verstoß gegen „Manual heißt **überlegt**, nicht reflexschnell" (`gambits.md` §4).
- **Tot, solange ein blockierendes Einführungs-Popup steht** (s. „Mechanik-Einführung"). Sonst quittiert ein reflexhaftes A die Erklärung, die es gerade lesen sollte.
- **Nicht ausführbare Aktionen sind auch per Taste nicht ausführbar** (Special ohne MP): keine Wirkung, kein Alarm – der gedämpfte Zeilenzustand ist die Auskunft.

### Sichtbarkeit: unterstrichener Anfangsbuchstabe

Ein Hotkey, der nicht im Popup steht, existiert für den Spieler nicht. Angezeigt wird er als **Unterstreichung des Anfangsbuchstabens** (A̲ttack, S̲pecial, D̲efend).

**Warum nicht über Schriftstil, Gewicht oder Größe:** Diese Achse ist bereits vergeben. Das Popup kodiert die Verfügbarkeit über **hell + dickere Schrift** vs. **gedämpft + dünne Schrift** (s. „Zustandskodierung doppelt"). Ein fett gesetztes „S" in einer ausgegrauten Special-Zeile behauptet Verfügbarkeit, die nicht besteht – derselbe Fehlertyp wie die Gold-Kollision zwischen Fokusmarker und Shock-Ring, und ebenso ein Lesbarkeitsfehler statt einer Geschmacksfrage. Gemischte Schriftgrade innerhalb eines Wortes scheiden zusätzlich technisch aus (gebrochene Skalierung mitten im Wort, Pixelfont).

**Warum nicht Klammerung** („(A)ttack"): Das Popup misst fest 232 CSS-px und skaliert bewusst nicht mit `s` – es darf nicht wachsen. Klammern verbreitern alle Zeilen und beschädigen das Wortbild der FF7-Menübox.

**Der Gewinn der Unterstreichung:** Sie kostet null Breite, benutzt eine bisher freie Achse, und sie **erbt die Zustandskodierung automatisch** – in einer gedämpften Zeile ist auch der Unterstrich gedämpft, die Taste sieht damit von selbst so unverfügbar aus, wie sie ist.

**Die Unterstreichung steht für sich – es gibt bewusst keine Einführung dazu** (Nutzer-Entscheidung 02.08.2026: *„das ist ein Muster, das man allgemein aus Software kennt"*). Erwogen und **verworfen** wurde ein Satz in Einführung Nr. 2 („ATB & Angreifen"). Der Grund ist nicht, dass die Konvention garantiert bekannt wäre, sondern dass die **Nicht-Entdeckung folgenlos ist**: Wer die Tasten nie bemerkt, klickt weiter und spielt dasselbe Spiel. Das unterscheidet sie grundsätzlich von den Mechaniken der Kanon-Liste, wo Nicht-Entdeckung direkt in Typ V mündet – und damit greift dort die Regel „Popup nur, wenn der Spieler etwas *tun* kann" gegen einen Tasten-Hinweis. Nr. 2 ist außerdem die erste echte Einführung; ein Ergonomie-Zusatz verwässert ihre Botschaft.

⚠️ **Zu beobachten (gespielt):** Ob die Unterstreichung ohne jede Erwähnung als Tastenhinweis gelesen wird. Falls im Playtest niemand die Tasten benutzt, ist die Nachrüstung **ein Satz** in Nr. 2 – billig genug, um es erst zu messen. Der Hinweis verstieße auch nicht gegen das Zahlenverbot der Einführungen: Eine Taste ist kein Balance-Wert und kann durch kein Rebalancing zur Falschaussage werden.

### Folge für die Bühne

Wer per Tastatur spielt, folgt mit den Augen **nicht mehr dem Cursor**. Damit ist das **Vortreten der handelnden Figur** kein Schmuck mehr, sondern das einzige verbleibende Signal, wessen Popup gerade offen ist (die Popup-Position allein wird nicht mehr angesteuert und daher auch nicht mehr angesehen). Der Effekt muss entsprechend deutlich sein – das ist ein **neues Argument für die 12-su-Bewegung**, die bisher allein über „lebt von der Bewegung, nicht vom Endzustand" begründet war.

## Freischaltungs-Hinweis (Unlock-Callout)

**Neu, Playtest-Korrektur nach M6:** Die Default-Attack-Freischaltung in Zone 5 (feinspec §7.1, Punkt 3) ist im Leitfaden explizit als **spürbarer Automatik-Beat** markiert („★ Erster 'vom Tappen zum mühelosen Fortschritt'-Moment", `gambits.md` §2 „Erlösung"). Ohne jede Ankündigung wirkt derselbe Moment im Playtest umgekehrt: **verwirrend statt befreiend** – der Spieler sieht nur, dass plötzlich nichts mehr abgefragt wird, ohne zu verstehen, warum. Das ist ein Onboarding-Fehler (Anti-Pattern #4 „Komplexität ohne Onboarding", `02_Leitfaden_Kernmechaniken.md`), keine Geschmacksfrage.

- **Auslöser:** jedes Mal, wenn ein Rollout-Flag von `false` auf `true` kippt (`autoAttackUnlocked`, `manualToggleUnlocked`, `defenseUnlocked`, `materiaUnlocked`, MP-Sichtbarkeit, …) – nicht nur bei Zone 5.
- **Form:** ein **kurzes, nicht-blockierendes Banner/Toast** (kein Popup, keine Pause der Kampfuhr) an prominenter Stelle (z. B. oben, wo bisher das Klicker-Hinweisbanner saß), 2–4 s eingeblendet oder bis zur nächsten Spieleraktion. Ein Satz, thematisch/humorvoll passend zum Parodie-Ton (F2), z. B. „Auto-Attack online – die Party kämpft jetzt von selbst."
- **Kein Zusatzsystem:** Das ist **keine Vorstufe eines Gambit-UIs** – der programmierbare Gambit-Editor bleibt bis zur 1. Reunion bewusst unsichtbar (feinspec §0, `gambits.md` §6). Der Callout erklärt nur *dass* sich etwas geändert hat, nicht *wie* die Automatik im Detail funktioniert.
- **Leitplanken-Check:** kein Widerspruch zu „gestaffelter Rollout" (kündigt nur an, zeigt keine neue Komplexität) oder „Automatik ist verdient" (bestätigt im Gegenteil, dass sie gerade verdient wurde). Reines Lesbarkeits-Add-on.

## Mechanik-Einführung: Popup + Codex (verbindlich, neu 30.07.2026)

**Der Unlock-Callout oben genügt nicht.** Er sagt *dass* sich etwas geändert hat, nicht *was es ist*. Der Playtest-Befund lautete: „Die Mechaniken kommen derzeit ziemlich still ins Spiel."

**Warum das kein Politur-Thema ist.** Bei der Zielvorgabe von **~30 Minuten für Durchlauf 1** (`feinspec-kapitel1.md` §12) kommen rund **vierzehn Mechaniken in dreißig Minuten** – alle zwei Minuten eine. Und:

> **Eine Mechanik, die der Spieler nicht bemerkt, benutzt er nicht.** Wer Defend und Zielwahl nie wahrgenommen hat, spielt zwangsläufig als Typ V (vollautomatisch).

Damit ist die stumme Einführung **mitverantwortlich für die Idle-Konvergenz**, die dieselbe Session als Kernproblem diagnostiziert hat (`oekonomie-waehrungen.md` §1a, `gegner-encounter.md` §5a). Das Einführungs-System ist Teil des Fixes, nicht Kosmetik danach.

### Form

- **Blockierend, mit Pause.** Die Kampfuhr hält an; der Spieler muss **aktiv wegklicken**, dann läuft das Spiel weiter. Das unterscheidet die Einführung vom Unlock-Callout (nicht-blockierender Toast), der für *Bestätigungen* bleibt.
- **Ein Popup pro Mechanik**, mit Erklärung im Parodie-Ton.
- **Keine konkreten Zahlen im Text.** Qualitativ formulieren: „Jeder Sieg bringt einen Anteil deiner MP zurück", **nicht** „25 % MP pro Sieg". Begründung: Wir ändern beim Neu-Balancieren praktisch alle diese Werte; eine Zahl im Erklärtext wird dann zur Falschaussage des Spiels an den Spieler. Ein qualitativer Satz bleibt über jedes Balancing hinweg wahr. *Das ist strenger als „Werte aus der Konfiguration generieren" – generierte Zahlen können weiterhin falsch beschriftet oder falsch gerundet sein, eine nicht vorhandene Zahl nicht.*

### Nur für bedienbare Mechaniken

**Popup nur, wenn der Spieler etwas *tun* kann.** Passive Vorgänge (Shock-Aufbau, Limit-Füllung) brauchen eine gute Anzeige, kein Popup. Sonst wird aus der Einführung ein Spießrutenlauf, der Spieler klickt reflexhaft durch, und die wichtigen Popups gehen mit unter.

Kanonische Liste für Kapitel 1 (Reihenfolge = Auftritt):

| # | Einführung | Auslöser |
|---|---|---|
| 1 | **Claude stellt sich vor** | vor dem ersten Kampf (Zone 1) |
| 2 | ATB & Angreifen | erster Kampf |
| 3 | Auto-Attack | Zone 5 (Freischaltung) |
| 4 | **Spezialfähigkeit & MP** | Zone 3 |
| 5 | Zonen-Rückkehr *(Ventil)* | erste Niederlage |
| 6 | Gasthaus | erstmals verfügbar |
| 7 | Limit | erstes Gate (Blandzilla) |
| 8 | **Barrel stellt sich vor** | Beitritt Zone 9 |
| 9 | Zielwahl / Fokusziel | **Erstkontakt** mit dem ersten Heiler-Gegner (Region 2) |
| 10 | Defend & Telegraf | erste telegrafierte Groß-Attacke |
| 11 | **Tofa + Air is… stellen sich vor** | Beitritt Zone 19 |
| 12 | Shock | Region 3 |
| 13 | Reunion | Erreichen der Kapitel-Wand |

**Gestrichen am 01.08.2026: „Analyse & Bestiarium".** Analyse ist keine Kapitel-1-Mechanik mehr – ohne Element-Wahl liefert sie nichts, was der Spieler nicht ohnehin sieht, und die einzige exklusive Information (Heilmenge/Takt) verstößt gegen die Typ-Karten-Regel des Bestiariums. Sie wird in **Kapitel 2** mit Materia eingeführt (`kampf-analyse-shock.md` §5). Das Bestiarium füllt sich in Kapitel 1 weiterhin still beim Erst-Kill; es ist Sammel-Objekt und Köder, keine beworbene Mechanik. Damit sind es **13 Einführungen**, und die Liste enthält nur noch Dinge, die der Spieler auch benutzen kann – dieselbe Regel wie oben („nur für bedienbare Mechaniken"), diesmal auf eine Mechanik angewandt, die bedienbar *aussah*.

**Nr. 5 und 10 sind die wichtigsten** – Zonen-Rückkehr und Defend/Zielwahl sind genau die Mechaniken, die den spielenden vom idlenden Spieler trennen. Beide sind heute stumm.

### Selbstvorstellungen (1, 8, 11)

Die Figuren stellen sich **selbst** vor, mit 2–3 witzigen Sätzen, aus denen ihre **Stärke** hervorgeht – kein Datenblatt in dritter Person. Details und Entwurfszeilen: `charaktere-party.md`. Der Special ist dabei **keine** neue Mechanik (Nr. 4 hat sie eingeführt) – erklärt wird die **Rolle**.

### Codex

**Jede Einführung landet dauerhaft in einem nachlesbaren Codex.** Begründung aus dem Playtest: „manchmal klickt man zu schnell etwas weg und versteht es hinterher nicht mehr." Ein verpasstes Popup darf keine verlorene Mechanik sein.

### Ab Durchlauf 2 stumm

**Erledigte Einführungen überstehen die Reunion** (Flag je Mechanik, `prestige-reunion.md` Erhalt-Liste). Sonst bestraft die Reunion den Spieler mit Wiederholung – und die volle Party ab Zone 1 würde drei Selbstvorstellungen direkt hintereinander auslösen. Der Codex bleibt selbstverständlich zugänglich.

## Erschöpfte Zonen (beschlossen 02.08.2026)

**Anforderung (Nutzer):** *„Der Spieler soll erkennen, ob er noch Fortschritt machen kann, oder nicht."*

**Eine Zone heißt „erschöpft", wenn ein Sieg dort keine EXP mehr bringt** – der Zustand jenseits von `EXP_DAMPING_CUTOFF` (`oekonomie-waehrungen.md` §1a). Das ist der einzige Ort im Spiel, an dem ein korrekt arbeitendes System aus Spielersicht wie ein Defekt aussieht: Man kämpft, man gewinnt, und es passiert nichts.

**Binär, nicht abgestuft.** Angezeigt wird ausschließlich *zahlt / zahlt nicht*, keine Ertragsstufen und keine Zahl. Drei Gründe:

- **Die Anforderung ist binär** – „ob", nicht „wie viel".
- **Eine Skala macht aus der Zonenwahl eine Rechenaufgabe.** „Welche Zone bringt am meisten?" ist Ertragsmaximierung; die Zonenwahl soll aber eine **Entscheidung** bleiben („komme ich hier noch weiter?"). Das ist dasselbe Prinzip, aus dem der Essenz-Ertrag nicht mit Verweildauer skaliert (`prestige-reunion.md`, Ertragsregel): Sobald es eine ausrechenbare beste Antwort gibt, spielt der falsch, der nicht rechnet.
- **Binär überlebt jedes Rebalancing.** Der Cutoff darf sich verschieben – „hier bekommst du nichts" bleibt wahr. Eine Skala müsste jedes Mal neu kalibriert werden. Dieselbe Logik wie beim Zahlenverbot in den Einführungen.

**Zwei Orte, ein Vokabular** – der Marker hängt an der Zone, nicht am Bildschirm:

1. **In der Zonenwahl**, an jedem betroffenen Eintrag – damit die Erkenntnis **vor** der Entscheidung steht, nicht nach zehn ertraglosen Kämpfen.
2. **An der aktuell bespielten Zone**, dauerhaft. Nötig, weil eine Zone im Farmen **hineinkippt**: Man wird beim Farmen stärker, und irgendwann trägt genau die Zone nicht mehr, in der man steht – ohne dass man die Zonenwahl je geöffnet hätte.

**Darstellung:** vorhandenes Vokabular, kein neues. Erschöpfte Zonen erscheinen **gedämpft + dünne Schrift** mit dem Zusatz **„erschöpft"** – dieselbe Zustandskodierung wie nicht ausführbare Aktionen im Aktions-Popup (sichtbar, aber sofort als „bringt gerade nichts" lesbar). **Anwählbar bleiben sie** – das Verbot wäre eine Bevormundung, die Information genügt.

**Der Kipp-Moment wird einmal gemeldet.** Beim ersten ertraglosen Sieg in einer Zone eine kurze Meldung im Parodie-Ton („Diese Gegner lehren dich nichts mehr"), danach nur noch der stille Marker. Ohne diese Meldung bemerkt der farmende Spieler den Übergang nicht – mit ihr bei jedem Kampf wäre sie Lärm.

**Was hier ausdrücklich nicht steht:** eine Aussage darüber, ob der Spieler eine Zone *gewinnen* kann. Der Marker beschreibt den **Ertrag**, nie die Erfolgsaussicht – Prognosen entwerten das Ausprobieren (`../03_Konzept_Gerüst.md` §16).

## Bester Versuch am Gate (beschlossen 02.08.2026)

**An einem Gate, das der Spieler schon einmal verloren hat, steht sein bester bisheriger Versuch** – wie weit er den Boss heruntergebracht hat (Rest-HP in Prozent). Nutzer-Entscheidung: *„Einen Boss-Fail zu markieren finde ich gut. Dann gibt es eine Grundlage, an der man sich messen kann."*

**Warum das die Sichtbarkeits-Bedingung der Gate-Regel erfüllt** (`../03_Konzept_Gerüst.md` §15): Die Regel verlangt, dass die Umwandlung von Zeit in Zugang **ablesbar** ist. Der Bestwert tut das rein **rückblickend** – er sagt nichts darüber, ob der nächste Versuch gelingt, sondern nur, dass sich seit dem letzten etwas verändert hat. Damit fällt er nicht unter die Gegenkraft „eine Erfolgsprognose entwertet das Ausprobieren" (§16): Prognostiziert wird nichts.

- **Rückblickend, nicht vorhersagend.** Keine Einschätzung wie „schaffbar/zu schwer" – nur die eigene Bestleistung.
- **Kein Verstoß gegen das Zahlenverbot** (§Einführungen): Verboten sind **Balance-Werte in Erklärtexten** („25 % MP pro Sieg"), weil sie beim Neubalancieren zur Falschaussage werden. Der Bestwert ist eine **Tatsache über den eigenen Lauf** und kann durch kein Balancing falsch werden.
- **Nur nach einer Niederlage sichtbar**, nie vor dem ersten Versuch – sonst kündigt die Anzeige einen Misserfolg an, den es noch nicht gibt.
- **Fällt bei der Reunion zurück** (s. `prestige-reunion.md`): Nach dem Reset steht die Party auf Level 1; ein Bestwert aus einem stärkeren Durchlauf wäre unerreichbar und würde entmutigen statt messen.

⚠️ **Zu beobachten (E2, gespielt):** Ob der Wert motiviert oder demoralisiert, ist offen. Wer dreimal bei 38 / 39 / 40 % landet, sieht sehr deutlich, dass er kaum vorankommt – die Anzeige kann die Wand größer machen, statt sie näherzubringen. Bewusst trotzdem beschlossen: gar kein Signal ist die schlechtere Ausgangslage.

## Nicht jetzt

Das übrige UI-Design (Shop-/Materia-/Prestige-Panels, Farben-Feinschliff, Responsive/Portrait) folgt später. **Ausnahme:** die **Steuer-UI oben** (Aktions-Popup + Modus-Schalter) ist bereits spezifiziert, da sie fürs Kampfgefühl zentral ist und in die Implementierung geht. Der übrige Bereich bleibt vorerst **reservierter Platz**, damit Kulissen und Sprite-Platzierung ihn einkalkulieren.

## Offene Punkte

- Konkrete Prozente der drei Flächen (Stage / Bottom-Leiste / Seitenleiste) innerhalb der genannten Korridore.
- **Portrait-/Kompakt-Layout unterhalb `s = 1,0`** – dort greift das Bühnen-Framework bewusst nicht. Ob dann die Bühnenbox anders proportioniert wird (schmaler, höher) oder die Seitenleiste weicht, ist offen.
- Seitenleiste links oder rechts; Einklapp-Verhalten. **Neu relevant:** Beim Ein-/Ausklappen ändert sich die Stage-Breite und damit `s` – ob die Bühne dabei animiert mitskaliert oder springt, ist noch nicht entschieden.
- ~~Parallax zwischen B0/B1/B2~~ → **verworfen:** wirkungslos ohne Kamerabewegung, und die Bühne steht still. B0–B2 bleiben als Bauordnung; stattdessen „Kulissen-Leben" (`regionen-kulissen.md` §10).
- Kampf-Feedback-Ebene (U1): Schadenszahlen, Trefferanzeige, Angriffsbewegung sind bisher inhaltlich nicht spezifiziert, nur eingeplant.
- ~~Genaue Sprite-Größen im Verhältnis zur Stage~~ → **entschieden:** Bühnen-Framework (su, Bühnenbox 504×288, einheitlicher Faktor `s`).
- ~~Exaktes Spacing bei voller Party~~ → **entschieden:** Slot-Raster im Bühnen-Framework.

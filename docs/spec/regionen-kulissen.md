# Region-Kulissen (Backdrops)

**Status:** Bildsprache, Leitmotive aller 15 Regionen und Werkzeug-Richtung festgelegt. Konkrete Bausteine je Region folgen bei der Umsetzung.
**Rahmen:** `../03_Konzept_Gerüst.md` §3 (Regionen) und §8; Geometrie kommt vollständig aus `ui-layout.md`.
**Prüfinstanz:** `../02_Leitfaden_Kernmechaniken.md`.

## Schnittstellen zu anderen Systemen

- **Bühnen-Framework** (`ui-layout.md`): gibt Format, Bodenband, Bleed und Skalierung vor. Die Kulisse hat hier **keine Freiheit** – sie liefert, was das Framework verlangt.
- **Charakter-/Monster-Visuals** (`charaktere-visuals.md`): gleiche Pixel-Welt, aber gröberes Raster (1 Backdrop-Pixel = 3 su). Stil-Regeln (Iso-Kippung, Beleuchtung von oben-links) gelten sinngemäß.
- **Progression** (`progression-regionen.md`): liefert die Regionsliste und die Kapitel-Zuordnung.
- **Kampf** (`kampf-analyse-shock.md`): Shock, Fokusziel und Bedrohung besetzen Signalfarben, die die Kulisse deshalb **nicht** punktuell verwenden darf.

---

## 1. Was eine Kulisse leisten muss – und was nicht

**Sie muss:**
1. **den Ort in einer Sekunde erkennbar machen** – der Spieler soll beim Zonenwechsel sehen, dass er woanders ist;
2. **die Bodenfläche liefern**, auf der die Figuren stehen (funktionale Anforderung aus dem Framework);
3. **eine Kapitel-Stimmung tragen**, damit Fortschritt auch atmosphärisch spürbar wird.

**Sie darf nicht:**
1. **mit den Figuren um Aufmerksamkeit konkurrieren.** Die Sprites sind die Hauptdarsteller; die Kulisse ist Bühnenmalerei.
2. **Gameplay-Signale imitieren** (s. §4).
3. **Text unlesbar machen.** Das Kopf-HUD liegt zwangsläufig vor ihr.

Daraus folgt die wichtigste Faustregel: **Eine gute Kulisse ist zurückhaltend.** Wer sie zum ersten Mal sieht, soll den Ort erkennen; wer sie zum fünfzigsten Mal sieht, soll sie nicht mehr bemerken.

## 2. Wiedererkennungs-Prinzip: ein Motiv, nicht eine Szene

Die Kulissen orientieren sich an den Schauplätzen des Originals und **deuten sie an** – dieselbe Linie wie beim Roster („erinnern, nicht kopieren", `../03_Konzept_Gerüst.md` §1).

**Regel: Silhouette + Signaturfarbe + ein Detail.** Jede Region hat **genau ein** Leitmotiv (§6). Das Motiv wird auf seine Umrissform reduziert, bekommt die Regionsfarbe und **ein** erzählendes Detail. Mehr nicht.

- **Silhouette zuerst** – dieselbe Regel wie bei den Figuren. Wer das Bild auf Daumennagelgröße schrumpft, muss das Motiv noch erkennen.
- **Kein Nachbau.** Nicht die Original-Architektur rekonstruieren, sondern das, woran man sich erinnert.
- **Ein Detail, nicht fünf.** Der Witz sitzt im Detail (F2 Humor als Würze) – aber ein zweiter Gag im selben Bild halbiert beide.
- **Wiederholung ist erlaubt.** Zonen innerhalb einer Region teilen sich die Kulisse. Die Kulisse markiert die **Region**, nicht die Zone.

## 3. Bildaufbau

Die drei Backdrop-Ebenen des Frameworks (B0/B1/B2) sind zugleich die Bauanleitung:

| Ebene | Anteil | Inhalt | Kontrast |
|---|---|---|---|
| **B0 Ferne** | oberes Drittel (Himmelband) | Himmel, Horizontlinie, ferne Silhouetten | **hier darf es leuchten** – über den Köpfen steht nichts |
| **B1 Motiv** | mittleres Drittel (Figurenband) | das eine Leitmotiv | **gedämpft** – hier stehen Sprites und HUD |
| **B2 Boden** | untere 32 Pixel (Bodenband) | begehbare Fläche | **am ruhigsten** – Textur ja, Muster nein |

- **Das Leitmotiv steht nicht mittig.** Es sitzt seitlich versetzt, damit es weder hinter der Party noch hinter dem Encounter klebt. Die Bühnenmitte ist der ruhigste Ort des Bildes – dort liegt der Mittelgang.
- **Der Boden ist eine Fläche, kein Motiv.** Über beide Standlinien hinweg durchgehend begehbar lesbar: keine Mauer, kein Wasser, keine Abbruchkante, kein auffälliges Muster quer durch die Standlinien. Bodenobjekte (Kisten, Fässer) gehören **nicht** ins Bodenband – dort stehen Figuren.
- **Bleed-Zonen setzen fort, sie erzählen nicht.** Himmel, Horizont und Boden laufen weiter; kein Motivteil, das jemand sehen muss. Ob der Bleed sichtbar ist, hängt am Fensterformat.

## 4. Signalfarben-Disziplin (verbindlich)

Drei Farbfamilien tragen im Kampf **Bedeutung** und sind für die Kulisse gesperrt:

| Farbe | Bedeutung | Quelle |
|---|---|---|
| **Gold / Bernstein** | Shock-Zustand | `ui-layout.md`, `kampf-analyse-shock.md` |
| **Cyan** | Spielerkontrolle, Fokusziel | `ui-layout.md`, `feinspec-kapitel1.md` §1.5 |
| **warmes Rot** | „wird als Nächstes getroffen" | `ui-layout.md` |

**Gesperrt sind punktuelle, gesättigte Lichtpunkte in diesen Tönen** – also genau die Form, in der die UI sie benutzt. Großflächige, gedämpfte Verwendung ist unkritisch: Ein rötlicher Abendhimmel ist keine Bedrohungsmarkierung, eine goldene Fensterreihe sehr wohl.

**Aktueller Verstoß, zu beheben:** Reactor Row zeichnet seine Fenster in `#e7c14b` – exakt die Shock-Farbe – und MegaCorp Tower setzt dieselbe Farbe als Fensterpunkte. Beide Kulissen streuen damit Shock-Signale über die ganze Bühne. Fenster gehören in die **Regionsfarbe** oder in ein neutrales Warmweiß.

## 5. Kontrast-Budget

Die Figuren sind zweistufig gefärbt und relativ hell (`charaktere-visuals.md`). Damit sie sich abheben:

- **Kulissenhelligkeit steigt nach oben.** Bodenband am dunkelsten, Motivband gedämpft, Himmelband darf hell sein.
- **Keine hellen Flächen hinter Sprite-Höhe.** Was im Figurenband hell ist, frisst eine Silhouette.
- **Sättigung gehört den Figuren.** Die Kulisse arbeitet mit gebrochenen Tönen; nur das Leitmotiv-Detail darf einmal sättigen.
- **Die Kontrastplatte des HUD ist kein Freibrief** (`ui-layout.md`): Sie rettet den Text, nicht die Silhouette der Figur dahinter.

## 6. Leitmotive der 15 Regionen

Je Region: das eine Motiv, die Signaturfarbe, das eine Detail. Namen und Reihenfolge aus `progression-regionen.md`.

### Kapitel 1 – „The Grid" · Palette: kalte Kunstlicht-Nacht, Blaugrau-Basis

| # | Region | Leitmotiv (Silhouette) | Signaturfarbe | Ein Detail |
|---|---|---|---|---|
| 1 | **Reactor Row** | Reaktorkuppel mit zwei Schloten, darunter ein Rohrsteg | Giftgrün | der glimmende Kern in der Kuppel |
| 2 | **Bargain Bazaar** | Gasse aus Marktbuden, überspannt von Leuchtreklame | Magenta | eine Reklame, die halb durchgebrannt ist |
| 3 | **MegaCorp Tower** | Turmfassade von unten, Aufzugschacht als Lichtband | Kaltblau | ein Konzernlogo, zu groß geraten |

### Kapitel 2 – „The Great Outdoors" · Palette: erdig, Tageslicht

| # | Region | Leitmotiv | Signaturfarbe | Detail |
|---|---|---|---|---|
| 4 | **Quaintsville** | Fachwerkgiebel mit Windrad | warmes Ocker | ein Wegweiser mit zu vielen Schildern |
| 5 | **The Squelchlands** | Nebelbänke über Tümpeln, eine Bogenspur im Morast | Moosgrün-Grau | Blasen, die aufsteigen |
| 6 | **The Ore Snore** | Stollenmund mit Lorengleis | Violett-Grau | eine Lore, die halb im Gleis steckt |

### Kapitel 3 – „Sun, Sand & Slots" · Palette: hell und gesättigt

| # | Region | Leitmotiv | Signaturfarbe | Detail |
|---|---|---|---|---|
| 7 | **Port Bombast** | überdimensionale Kanone im Profil über Hafenkränen | Stahl-Türkis | die Kanone zeigt in die falsche Richtung |
| 8 | **Costa del Sofa** | Strandschirm-Reihe vor tiefer Sonne | Türkis / Sand | ein Liegestuhl, dauerhaft besetzt |
| 9 | **Fizz Saucer** | Kuppel-Cluster auf einer Säule | Violett | eine Kuppel blinkt aus dem Takt |

### Kapitel 4 – „The Old Country" · Palette: warm-trocken bis kalt-hoch

| # | Region | Leitmotiv | Signaturfarbe | Detail |
|---|---|---|---|---|
| 10 | **Stargazer Gulch** | Felsplateau mit Feuerstelle unter Sternenband | Terrakotta | Funken, die nach oben ziehen |
| 11 | **Mount Nibble** | Bergkamm mit Hängebrücke | Blaugrau / Schnee | eine Planke fehlt |
| 12 | **Blastoff Burg** | schiefe Rakete im Gerüst über Dächern | Rostrot | das Gerüst hält sie, nicht umgekehrt |

### Kapitel 5 – „The Deep End" · Palette: entrückt, kühl leuchtend

| # | Region | Leitmotiv | Signaturfarbe | Detail |
|---|---|---|---|---|
| 13 | **Ancient Attic** | Stufenbau, von Wurzeln überwachsen | Jadegrün | eine Tür, viel zu klein |
| 14 | **Ghosttown Estates** | Muschelhäuser unter leuchtenden Kronen | Blasslila / Weiß | ein Fenster, in dem noch Licht brennt |
| 15 | **The Big Hole** | Kraterrand mit herabhängenden Adern | Dunkelviolett + Grün | der Grund ist nicht zu sehen |

**Palettenwechsel je Kapitel ist beabsichtigt:** Der Kapitelfortschritt soll auch ohne Text ablesbar sein – Kapitel 1 ist künstlich beleuchtete Nacht, Kapitel 2 bringt zum ersten Mal Tageslicht („The Great Outdoors" hält damit sein Versprechen), Kapitel 5 kippt ins Unwirkliche.

## 7. Werkzeug: Baukasten statt Einzelfunktionen

**Befund:** `assets/generate_regions.py` enthält je Region **eine handgeschriebene Funktion mit rohen Koordinaten** (`s.r(40,40,52,34,'#2b333c')`). Bei drei Kulissen tragbar, bei fünfzehn nicht: Es gibt keine Wiederverwendung, jede Änderung ist Zahlenraten ohne visuelles Feedback, und die Stilkonsistenz hängt allein an Disziplin.

**Richtung für die Umsetzung:**

1. **Bausteinbibliothek** statt Primitiv-Aufrufe – benannte, parametrierte Elemente (`tower`, `stack`, `pipe_run`, `awning_row`, `window_grid`, `crag`, `foliage`, `sign`, `ground_texture`), die die Stil-Regeln bereits eingebaut haben (Iso-Kippung, Licht von oben-links, zwei Helligkeitsstufen).
2. **Regionsdefinition als Rezeptur** – jede Region beschreibt sich als Palette plus Liste von Bausteinen mit Position und Größe, nicht als Zeichencode.
3. **Zonen sind fest, nicht frei** – die Bausteine setzen auf B0/B1/B2 auf; das Bodenband entsteht **generisch** aus Palette und Bodentextur, nicht je Region neu.
4. **Prüfmodus** – der Generator kann jede Kulisse mit eingeblendeten Framework-Linien (`G`, `B₁`, `B₂`, Bleed-Grenzen) rendern, damit Verstöße auffallen, bevor sie ins Spiel gelangen.
5. **Gegenprobe automatisieren** – ein Lauf prüft die Signalfarben-Sperre (§4) und das Kontrast-Budget (§5) rechnerisch. Beides ist messbar und muss nicht dem Auge überlassen bleiben.

> **Als Annahme markiert** (Konzept-Modus, `../../CLAUDE.md`): Ob dieser Baukasten in Pillow bequem umsetzbar ist oder ob ein anderes Werkzeug sinnvoller wäre, ist eine Werkzeugfrage der Umsetzungs-Session. Das Konzept verlangt nur: **Bausteine + Rezeptur + Prüfmodus**, nicht eine bestimmte Bibliothek.

## 8. Aufwandsstaffelung

Nicht jede Kulisse verdient denselben Aufwand:

- **Volle Sorgfalt:** Kapitel-1-Regionen (1–3) – der erste Eindruck, und sie werden in jedem Reunion-Zyklus erneut durchlaufen.
- **Normale Sorgfalt:** alle Regionen mit Kapitel-Gate.
- **Sparsam:** Regionen, die der Spieler zügig durchquert. Eine Kulisse, die Silhouette + Farbe + Detail sauber liefert, ist fertig – auch wenn sie schlicht ist.

## 9. Format (verbindlich, aus dem Bühnen-Framework)

- **Maßstab:** 1 Backdrop-Pixel = **3 su** = 3 Sprite-Pixel.
- **Nenn-Box: 168×96** – exakt die Bühnenbox (504×288 su, Format 7:4).
- **Bodenfläche: die unteren 32 Pixel** der Nenn-Box (y 64–96).
- **Bleed: je 28 px links/rechts, 32 px oben** → **Canvas 224×128**, Nenn-Box darin bei x 28–196, y 32–128 (unten bündig).
- Rendering immer **Nearest-Neighbor**.

## 10. Bewegung: Kulissen-Leben statt Parallax

**Parallax ist verworfen.** Der Effekt entsteht ausschließlich daraus, dass nahe Ebenen sich beim Kameraschwenk schneller verschieben als ferne. Unsere Bühne steht still – die Party läuft nicht, die Kamera fährt nicht. Es gibt nichts, wogegen sich etwas verschieben könnte. Die Ebenen **B0/B1/B2 bleiben trotzdem** – als **Bauordnung** für Komposition und Kontrast, nicht als Ausgabeformat. Der Generator liefert weiterhin **ein flaches PNG**.

**Stattdessen: Kulissen-Leben.** Ein Idle-Spiel liegt lange offen im Hintergrund; ein vollständig eingefrorenes Bild liest sich mit der Zeit als „hängt". Ein wenig Bewegung signalisiert Betrieb – Rauch aus einem Schlot, langsam ziehende Wolken, eine Reklame, die alle paar Sekunden flackert, aufsteigende Blasen im Sumpf.

- **Als kleine Einzelelemente über der statischen Kulisse**, nicht als bewegte Vollbild-Ebenen. Deutlich billiger, und der Generator bleibt einfach.
- **Bewegung gehört ins Himmelband** – dieselbe Regel wie beim Kontrast (§5) und aus demselben Grund: Im Figuren- und Bodenband liegt die Aufmerksamkeit, dort stört jede Eigenbewegung die Lesbarkeit von Sprites, Markern und HUD.
- **Langsam und peripher.** Bewegung im Augenwinkel ermüdet – dasselbe Argument, mit dem die ATB-sortierte Aufstellung verworfen wurde (`ui-layout.md`). Ein Element, das den Blick zieht, ist zu schnell.
- **Höchstens zwei bis drei Elemente je Kulisse**, mit unterschiedlichen Zykluslängen, damit kein wahrnehmbarer Gleichtakt entsteht.
- **Kein Zustand, keine Bedeutung.** Kulissen-Leben ist reine Atmosphäre und darf nie mit Gameplay-Signalen verwechselbar sein (§4).

**Offen gelassen: der Zonenwechsel-Schwenk.** Beim Wechsel von einer Zone zur nächsten gäbe es echte Kamerabewegung – das Bild zieht kurz seitlich weiter, „wir kommen voran". Das wäre ein Fortschrittssignal, das heute fehlt: Innerhalb einer Region bleibt die Kulisse gleich, der Spieler sieht nie, dass er sich durch sie hindurchbewegt. Der Haken ist die Bildbreite – der Bleed trägt einen, vielleicht zwei Schwenks, bei zehn Zonen je Region ist er aufgebraucht. Sauber ginge das nur mit **nahtlos kachelbaren** Kulissen, was die Gestaltung deutlich einschränkt. Die Frage wird entschieden, wenn die ersten neuen Kulissen stehen – nicht vorher, weil sie an deren Gestaltung hängt. Für einen bloßen Ortswechsel-Akzent genügt ohnehin ein kurzer Versatz mit Blende, ohne echte Fahrt.

## Offene Punkte

- **Zonenwechsel-Schwenk** und die daran hängende Frage, ob Kulissen nahtlos kachelbar angelegt werden (s. §10).
- **Tageszeit-Varianten** je Region (z. B. Rückkehr im Reunion-Zyklus bei anderem Licht) – reizvoll, aber vervielfacht die Assets.
- Ob Zonen innerhalb einer Region **Varianten** derselben Kulisse bekommen (verschobene Bausteine) oder strikt dieselbe.
- Konkrete Hex-Paletten je Kapitel – bisher nur als Stimmung benannt.

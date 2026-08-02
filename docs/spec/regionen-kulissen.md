# Region-Kulissen (Backdrops)

**Status:** Bildsprache, Leitmotive aller 15 Regionen und Werkzeug festgelegt. **Baukasten gebaut (M12)**, die drei Kapitel-1-Kulissen im Format 224×128 neu erzeugt, Quaintsville als vierte Rezeptur vorhanden. Regionen 5–15 folgen als Rezepturen.
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
- **Ein Detail darf keine Form haben, die als etwas anderes Konkretes liest.** Auf dieser Auflösung ist die Silhouette alles, was ankommt – und das Auge vervollständigt sie zum nächstbesten bekannten Zeichen. **Gefundener Fall:** Das „zu groß geratene Konzernlogo" auf MegaCorp Tower war als zwei Querbalken plus Mittelsteg gezeichnet – also ein liegendes **H**, das auf einem Hochhaus zuverlässig als **Helikopterlandeplatz** gelesen wird. Ein Zeichen, das nichts bedeuten soll, muss deshalb *als Zeichen* erkennbar sein (Monogramm, Emblem), nicht als bloße geometrische Anordnung. Wer ein Detail entwirft, prüft es gegen die Frage: „Was könnte das sonst sein?"
- **Wiederholung ist erlaubt.** Zonen innerhalb einer Region teilen sich die Kulisse. Die Kulisse markiert die **Region**, nicht die Zone.

## 3. Bildaufbau

Die drei Backdrop-Ebenen des Frameworks (B0/B1/B2) sind zugleich die Bauanleitung:

| Ebene | Anteil | Inhalt | Kontrast |
|---|---|---|---|
| **B0 Ferne** | oberes Drittel (Himmelband) | Himmel, Horizontlinie, ferne Silhouetten | **hier darf es leuchten** – über den Köpfen steht nichts |
| **B1 Motiv** | mittleres Drittel (Figurenband) | das eine Leitmotiv | **gedämpft** – hier stehen Sprites und HUD |
| **B2 Boden** | untere 32 Pixel (Bodenband) | begehbare Fläche | **am ruhigsten** – Textur ja, Muster nein |

- **Das Leitmotiv steht nicht mittig, und sein Fokus liegt über den Köpfen.** Es sitzt seitlich versetzt; die Bühnenmitte ist der ruhigste Ort des Bildes – dort liegt der Mittelgang. **Präzisiert bei der Umsetzung (M12, Entscheidung 26):** „Weder hinter der Party noch hinter dem Encounter" ist *horizontal* nicht erfüllbar – das Slot-Raster belegt x 8–83 (Party) und 99–160 (Gegner) von 168 Backdrop-Pixeln. Die Regel gilt deshalb **vertikal**: Der fokale Punkt (das leuchtende Detail, die Signaturform) liegt oberhalb der **Deckenlinie, y = 24**. Die Silhouette darf tiefer reichen, der Blickfang nicht.

> **Korrektur der bei M12 notierten Zahl (war y = 33).** 33 ist die *Sprite-Oberkante* des Kapitel-Bosses (128 su auf B₂) – über ihm liegen aber noch 24 su HUD-Kopfraum, also die Backdrop-Zeilen **25–33**. Ein fokaler Punkt auf y = 33 säße damit genau hinter dem HUD des Bosses. Maßgeblich ist die **Deckenlinie** (su 72 → y 24), die im Bühnen-Framework genau dafür definiert ist: Oberhalb von ihr liegt garantiert weder Sprite noch HUD. Für Kapitel 1 war die alte Zahl folgenlos (in Region 1 ist der Miniboss mit 96 su der höchste Gegner), für den Vaultron-Kampf in Region 3 nicht.
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

**In Zahlen (M12, Entscheidung 24 – so prüft der Generator).** Ein Pixel gilt als Verstoß, wenn *alle vier* Bedingungen zutreffen: Farbton in einer gesperrten Familie (Gold/Bernstein **30–68°**, Cyan **160–205°**, warmes Rot **350–22°**), **S ≥ 0,35**, **V ≥ 0,60** und Teil eines zusammenhängenden Flecks von **≤ 90 px**. Die Schwellen sind die operationalisierte Fassung der Regel oben, nicht eine zusätzliche Regel.

**Konsequenz für Signaturfarben (wichtig für Kapitel 2 und 4):** „Warmes Ocker" (Quaintsville), „Terracotta" (Stargazer Gulch) und „Rostrot" (Blastoff Burg) liegen **innerhalb** der gesperrten Familien. Sie sind als Flächenfarbe erlaubt, als punktuelles Licht (Fenster, Schild, Detail) aber nur **gedämpft** – praktisch heißt das V ≤ 0,50 im Ausgangston, weil der Baukasten Oberseiten automatisch aufhellt. Quaintsville nutzt deshalb `#7a5f2f` statt eines hellen Ockers.

**Erledigt (M12):** Der Verstoß der Erstfassung – Fenster in `#e7c14b` bei Reactor Row und MegaCorp Tower, exakt die Shock-Farbe – ist mit der Neuauflage weg. Fenster sind jetzt durchgehend **neutrales Warmweiß**; der Prüflauf meldet für alle Kulissen null gesperrte Signalfarben.

## 5. Kontrast-Budget

Die Figuren sind zweistufig gefärbt und relativ hell (`charaktere-visuals.md`). Damit sie sich abheben:

- **Kulissenhelligkeit steigt nach oben.** Bodenband am dunkelsten, Motivband gedämpft, Himmelband darf hell sein. **Auch nachts** – das kostet den gewohnten hellen Lichtsaum am Horizont, aber genau der liegt hinter den Figuren (M12, Entscheidung 27).
- **Keine hellen Flächen hinter Sprite-Höhe.** Was im Figurenband hell ist, frisst eine Silhouette.
- **Sättigung gehört den Figuren.** Die Kulisse arbeitet mit gebrochenen Tönen; nur das Leitmotiv-Detail darf einmal sättigen. Gemessen wird das als **Chroma** `(max−min)/255` (≤ 0,16 im Mittel, ≤ 4 % der Fläche über 0,42), nicht als HSV-Sättigung – die stuft dunkle Blaugrautöne fälschlich als bunt ein (M12, Entscheidung 25).
- **Keine helle Fläche in der Sprite-Zone.** Operationalisiert: zwischen y 33 (Kopfhöhe des Kapitel-Bosses) und der Bodenkante G dürfen höchstens 12 % der Fläche heller als L 0,60 sein.
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
| 4 | **Quaintsville** | Fachwerkgiebel mit Windrad | warmes Ocker, **gedämpft** (s. §4) | ein Wegweiser mit zu vielen Schildern |
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

## 6a. Die Gasthaus-Kulisse (beschlossen 02.08.2026)

**Eine einzige Kulisse für alle 15 Regionen** – ein Innenraum. Begründung, Bänder-Zuordnung und die Rolle der Party-Sprites stehen in `ui-layout.md`, „Gasthaus-Szene" (2); hier nur, was der Generator wissen muss.

- **Motiv:** Schankraum-Innenansicht. Rückwand mit **einem Fenster** (an der Stelle des Himmelbands), Möbelmasse als B1 (Tresen, Bettreihe), Boden als B2. Format und Maßstab wie jede andere Kulisse (§9) – die Szene benutzt dieselbe Bühnenbox und dasselbe Slot-Raster.
- **Variiert wird nur zweierlei:**
  1. **Palette je Kapitel**, nicht je Region – fünf Paletten im Endausbau, für Kapitel 1 genau eine. Der Palettenwechsel je Kapitel ist ohnehin das etablierte Fortschrittssignal (§6, Schlussabsatz).
  2. **Der Fensterschein trägt die Signaturfarbe der aktuellen Region** (§6, Spalte „Signaturfarbe"). Ein Wert pro Region, kein Bild pro Region. Draußen ist noch der Reaktor giftgrün, der Bazaar magenta.
- **Der Fensterschein ist Atmosphäre, kein Signal** (§4, §10): gedämpft, nie in Konkurrenz zu HP-Rot, Shock-Gold oder Fokus-Cyan – und mit der HUD-Lesbarkeit derselbe Fall wie jede Akzentfläche.
- **Zwei Lichtzustände, nicht einer.** Die Szene dimmt während der Totzeit von „hell" auf „Nacht" und am Ende zurück. Der Generator liefert dafür **keine zwei Bilder**, sondern eine Kulisse, die zur Laufzeit abgedunkelt wird – die Dimmung ist ein UI-Vorgang, kein Asset. (Der Grund, warum sie überhaupt existiert, steht in `ui-layout.md` (1): sie ist der Fortschrittsträger der Totzeit.)
- **Kulissen-Leben (§10):** höchstens ein Element, etwa Glut in der Feuerstelle. Ein ruhiger Ort ist die Aufgabe – der Kontrast zum Kampf ist der Punkt.
- **Neue Bausteine** (Bett, Tresen, Feuerstelle, Innen-Fensternische) gehören nach §7 anschließend **allen** Regionen. Das ist der erste Innenraum überhaupt; der Baukasten war bisher rein auf Außensilhouetten ausgelegt.

**Humor (F2), Randbedingungen:** Wirt, Schild, Übernachtungsritual. **Genau eine Wirtszeile pro Aufenthalt**, aus einem Pool gezogen – der Aufenthalt wiederholt sich oft (nach jeder Niederlage automatisch), und zwei Zeilen sind bereits ein Dialog. Aufhänger, der die Mechanik ernst nimmt statt sie zu ignorieren: Das Gasthaus kostet **kein Gil, nur Zeit** (`feinspec-kapitel1.md` §3.8b) – ein Wirt, der davon unbeeindruckt ist, ist der Gag.

## 7. Werkzeug: Baukasten statt Einzelfunktionen

**Gebaut in M12.** `assets/region_kit.py` enthält Bausteine, Prüfmodus und Gegenprobe; `assets/generate_regions.py` enthält **nur noch Paletten und Rezepturen** – eine Region ist eine `Palette` plus eine Liste `(Baustein, Parameter)`. Aufruf: `python generate_regions.py [--check] [--report]`. Details und Abweichungen: `../07_Umsetzungsentscheidungen.md`, Umsetzungsentscheidungen 20–30.

**Ursprünglicher Befund (erledigt):** `assets/generate_regions.py` enthielt je Region **eine handgeschriebene Funktion mit rohen Koordinaten** (`s.r(40,40,52,34,'#2b333c')`). Bei drei Kulissen tragbar, bei fünfzehn nicht: Es gab keine Wiederverwendung, jede Änderung war Zahlenraten ohne visuelles Feedback, und die Stilkonsistenz hing allein an Disziplin.

**Richtung für die Umsetzung – so umgesetzt:**

1. **Bausteinbibliothek** statt Primitiv-Aufrufe – benannte, parametrierte Elemente (`tower`, `stack`, `pipe_run`, `awning_row`, `window_grid`, `crag`, `foliage`, `sign`, `ground_texture`), die die Stil-Regeln bereits eingebaut haben (Iso-Kippung, Licht von oben-links, zwei Helligkeitsstufen).
2. **Regionsdefinition als Rezeptur** – jede Region beschreibt sich als Palette plus Liste von Bausteinen mit Position und Größe, nicht als Zeichencode.
3. **Zonen sind fest, nicht frei** – die Bausteine setzen auf B0/B1/B2 auf; das Bodenband entsteht **generisch** aus Palette und Bodentextur, nicht je Region neu.
4. **Prüfmodus** – der Generator kann jede Kulisse mit eingeblendeten Framework-Linien (`G`, `B₁`, `B₂`, Bleed-Grenzen) rendern, damit Verstöße auffallen, bevor sie ins Spiel gelangen.
5. **Gegenprobe automatisieren** – ein Lauf prüft die Signalfarben-Sperre (§4) und das Kontrast-Budget (§5) rechnerisch. Beides ist messbar und muss nicht dem Auge überlassen bleiben.
6. **Jede Schwelle im Prüflauf ist beidseitig.** Eine Grenze, die nur nach oben prüft, lässt sich durch **Weglassen** bestehen – und Weglassen ist bei Kulissen der wahrscheinlichste Fehler, nicht Übertreibung. Beispiel aus M12: „Bodenband ruhig, Streuung ≤ 0,075" wird von einem völlig leeren, strukturlosen Band mit Bestnote bestanden. Wer eine Obergrenze setzt, setzt dieselbe Größe auch nach unten – sonst prüft der Lauf nur die Hälfte und bestätigt im Zweifel genau die Annahme, die er widerlegen sollte (dieselbe Fehlerklasse wie der Playtest-Befund in `../02_Leitfaden_Kernmechaniken.md` §5, „Nachträge aus dem eigenen Playtest").

> **Annahme aufgelöst** (war: „ob dieser Baukasten in Pillow bequem umsetzbar ist"): Ja – umgesetzt in Pillow, ohne Fremdbibliothek. Vorhanden sind die neun oben genannten Bausteine plus `sky`, `glow`, `wheel` und `lamp_string`; Varianten stecken als Parameter in den Bausteinen (`tower(cap='gable'|'dome'|'stepped')`, `sign(burn=…)` für die halb durchgebrannte Reklame). Koordinaten in Rezepturen sind Nenn-Box-Pixel, der Bleed ist der negative Bereich.
>
> **Abnahme-Test bestanden, mit Einschränkung:** Quaintsville (§6, Region 4) ist als reine Rezeptur ergänzt – kein neuer Baustein, kein neuer Parameter. Der Baukasten wurde allerdings von vornherein gegen alle 15 Motive entworfen; die Regionen 5–15 werden ihn weiter wachsen lassen (ein `arch` für den Stollenmund, eine Parasol-Variante für Costa del Sofa). Der Unterschied zum alten Stand ist, dass ein neuer Baustein danach **allen** Regionen gehört.

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

**Stand M12:** Nichts davon ist gebaut. Der Generator liefert wie vorgesehen ein flaches PNG – der Rauch über den Reaktorschloten ist gemalt, nicht animiert. Kulissen-Leben ist damit weiterhin ein offener Punkt und braucht einen eigenen Meilenstein (Einzelelemente über dem Backdrop, außerhalb des Generators).

**Offen gelassen: der Zonenwechsel-Schwenk.** Beim Wechsel von einer Zone zur nächsten gäbe es echte Kamerabewegung – das Bild zieht kurz seitlich weiter, „wir kommen voran". Das wäre ein Fortschrittssignal, das heute fehlt: Innerhalb einer Region bleibt die Kulisse gleich, der Spieler sieht nie, dass er sich durch sie hindurchbewegt. Der Haken ist die Bildbreite – der Bleed trägt einen, vielleicht zwei Schwenks, bei zehn Zonen je Region ist er aufgebraucht. Sauber ginge das nur mit **nahtlos kachelbaren** Kulissen, was die Gestaltung deutlich einschränkt. Die Frage wird entschieden, wenn die ersten neuen Kulissen stehen – nicht vorher, weil sie an deren Gestaltung hängt. Für einen bloßen Ortswechsel-Akzent genügt ohnehin ein kurzer Versatz mit Blende, ohne echte Fahrt.

## 11. Paletten (Stand M12)

Eine Palette besteht aus **sieben gesetzten Farben**; alles Weitere (hellere Oberseite, dunklere rechte Seitenfläche, gedämpfte Akzentvariante, Bodenkante) leitet der Baukasten daraus ab. Wer eine neue Region anlegt, setzt also sieben Werte, keine dreißig.

| Rolle | Wofür | Regel |
|---|---|---|
| `sky_top` / `sky_bottom` | Verlauf des Himmelbands | **oben heller als unten** (§5), auch nachts |
| `far` | B0-Silhouetten | dunkler als `sky_bottom`, sonst verschwindet die Skyline nicht nach hinten |
| `mid` | B1-Motivmasse | die Fläche, vor der Figuren stehen – dunkel genug für Silhouetten |
| `accent` | Signaturfarbe (§6) | bei gesperrten Familien gedämpft, s. §4 |
| `ground` | B2-Bodenfläche | dunkelster Ton des Bildes |
| `light` | Fensterlicht | **neutrales Warmweiß**, Chroma < 0,1 – nie eine Signalfarbe |

**Kapitel 1 – „The Grid" (gebaut):**

| Region | sky_top | sky_bottom | far | mid | accent | ground | light |
|---|---|---|---|---|---|---|---|
| Reactor Row | `#3a4d61` | `#1c2731` | `#212d38` | `#222d36` | `#5fbf7a` | `#171e24` | `#e9e2d2` |
| Bargain Bazaar | `#5d4269` | `#191322` | `#221a2b` | `#2b1f33` | `#d95a9c` | `#1a1422` | `#f3ead9` |
| MegaCorp Tower | `#33495e` | `#16202b` | `#1b2632` | `#213040` | `#4b7fd4` | `#151d26` | `#e6eef6` |

**Kapitel 2 – erster Eintrag (Quaintsville, als Baukasten-Nachweis):** `#a8c4d6` / `#6b8394` / `#4e6058` / `#5f4f3b` / `#7a5f2f` / `#41392c` / `#efe6d2`. Die Kapitel-2-Palette insgesamt („erdig, Tageslicht") ist damit **nicht** festgelegt – Quaintsville ist ein Vorgriff, kein Kapitelentscheid.

**Die Grenzwerte gelten, nicht die Hex-Werte.** Eine Palette ist richtig, wenn der Prüflauf (`--check`) sie durchlässt; die Zahlen oben sind eine bestandene Lösung, keine Vorschrift.

## Offene Punkte

- **Zonenwechsel-Schwenk** (§10) – **jetzt entscheidbar**, die Kulissen stehen. Die Zahl dazu: Der Bleed trägt seitlich je 28 px auf 168 px Nenn-Breite, also **rund ein Sechstel Bildbreite pro Seite**. Das reicht für einen spürbaren Versatz mit Blende, nicht für zehn Schwenks je Region. Nahtlos kachelbare Kulissen bleiben die Alternative – mit dem inzwischen bekannten Preis, dass der Baukasten Motive dann links und rechts anschlussfähig bauen müsste, was „Silhouette + Signaturfarbe + ein Detail" (§2) direkt einschränkt.
- **Kulissen-Leben (§10) ist noch nicht gebaut.** M12 liefert ein flaches PNG; der Rauch über den Reaktorschloten ist gemalt, nicht bewegt. Die Regeln in §10 stehen, die Umsetzung braucht einen eigenen Meilenstein (kleine Einzelelemente über dem Backdrop, nicht im Generator).
- **Tageszeit-Varianten** je Region (z. B. Rückkehr im Reunion-Zyklus bei anderem Licht) – reizvoll, aber vervielfacht die Assets. **Neu einzuschätzen:** Mit dem Baukasten ist eine Variante nur noch eine zweite Palette auf derselben Rezeptur, also fast gratis in der Herstellung – die Frage ist damit nicht mehr Aufwand, sondern ob der Wiedererkennungswert (§2) darunter leidet.
- Ob Zonen innerhalb einer Region **Varianten** derselben Kulisse bekommen (verschobene Bausteine) oder strikt dieselbe – gleiche Neubewertung wie oben: technisch billig geworden.
- Konkrete Hex-Paletten für **Kapitel 3–5** (§11 deckt Kapitel 1 ab).

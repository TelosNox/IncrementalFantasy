# Progression: Regionen, Gates & Rollout

**Status:** In Arbeit – Struktur und erster Zyklus (bis 1. Reunion) ausgearbeitet; konkrete Zahlen/Regionsnamen provisorisch.
**Rahmen:** `../03_Konzept_Gerüst.md`, §3 & §10 (verbindliche Richtung).
**Prüfinstanz:** `../02_Leitfaden_Kernmechaniken.md`.

## Schnittstellen zu anderen Systemen

- **Kampf** (`kampf-analyse-shock.md`): Region-Gates schalten Kampf-Stufen frei (horizontaler Rampup).
- **Gambits** (`gambits.md`): werden über die **1. Reunion** freigeschaltet; manuelle Prüfsteine sitzen (selten) an ausgewählten Bossen.
- **Charaktere** (`charaktere-party.md`): Figuren + ihre Waffen-Spezialfähigkeiten stoßen regionsweise hinzu.
- **Prestige** (`prestige-reunion.md`): Reunion ist ab **Kapitelende** verfügbar, wiederholbar; beschleunigt Re-Traversal.
- **Ökonomie** (`oekonomie-waehrungen.md`): Zonen liefern **EXP** (MP als Kampf-Ressource); AP/Materia erst später. **Gil ist gestrichen** (30.07.2026).

---

## 1. Struktur-Orientierung (bewährtes Skelett, FF7-Flavor)

- **Lineare Hauptspine** aus FF7-Parodie-Regionen; jede Region = Zonen-Cluster mit **Boss-Gate** (Vorbild Trimps: „push bis zur Wand"). Ein **Kapitel** = Spanne von Regionen bis zu einem Reunion-Punkt.
- **Eine neue Mechanik pro Region** (Vorbild Grass Cutting), am Gate freigeschaltet – horizontaler Rampup (C1).
- **Reunion nach dem Kapitel-Boss, wiederholbar** (s. §5) → Re-Traversal beschleunigt. *(Hier stand: „wer eine Wand nicht manuell schafft, grindet sich per Reunion einen Vorteil". Das ist seit dem Pflicht-Boss zirkulär – der Grind-Pfad durch eine Wand ist die **Zonen-Rückkehr**, nicht die Reunion; `prestige-reunion.md`.)*
- **Optionale Seitenzweige = Nebenquests** (Vorbild Increlution/Journey to Ascension): gesperrte Köder → später Boost/Shortcut. Überwiegend über die Zyklen alles machbar; wenige **bedeutende exklusive Entscheidungen** möglich (TBD).
- **Manuelle Prüfsteine** nur **selten** an ausgewählten Bossen (telegrafiert, überlegt-nicht-twitch, s. `gambits.md` §4). Die *frühen* Kapitel-Wände sind bewusst **grindbare Idle-Wände**, kein Pflicht-Manuell.
- **„Grindbar" setzt einen Ort zum Grinden voraus** – die **Zonen-Rückkehr** (§2). Der erste Playtest hat gezeigt, dass diese Selbstverständlichkeit fehlte: Ohne sie ist in einer deterministischen Engine jede Wand entweder sofort schaffbar oder für immer verschlossen, und der ganze Absatz oben eine leere Behauptung (`niederlage-offline.md` §3).

---

## Story-Aufbau: Regionen, Kapitel & Reunion-Punkte

Grobe Gesamtstruktur, parodistisch an FF7 angelehnt: **~15 Regionen** in **5 Kapiteln**, je Region ein **Boss-Gate**, am **Kapitelende** ein **Reunion-Punkt** (wiederholbar). Die **1. Reunion** liegt nach dem Stadt-Arc (Region 3) – dort geht auch das Materia-System auf. Zahlen sind grob/tunbar.

**Kapitel 1 – „The Grid" (Midgar-Parodie)** → **1. Reunion**
1. **Reactor Row** (Reaktor-Slums)
2. **Bargain Bazaar** (Wall Market)
3. **MegaCorp Tower** (Shinra-HQ) – Flucht aus der Stadt

**Kapitel 2 – „The Great Outdoors"** → 2. Reunion
4. **Quaintsville** (Kalm)
5. **The Squelchlands** (Sümpfe / Riesenwurm)
6. **The Ore Snore** (Mithril-Minen)

**Kapitel 3 – „Sun, Sand & Slots"** → 3. Reunion
7. **Port Bombast** (Junon)
8. **Costa del Sofa** (Costa del Sol)
9. **Fizz Saucer** (Gold Saucer)

**Kapitel 4 – „The Old Country"** → 4. Reunion
10. **Stargazer Gulch** (Cosmo Canyon)
11. **Mount Nibble** (Nibelheim / Mt. Nibel)
12. **Blastoff Burg** (Rocket Town)

**Kapitel 5 – „The Deep End"** → Story-Ende + optionaler Endlos-Modus
13. **Ancient Attic** (Tempel der Ahnen)
14. **Ghosttown Estates** (Vergessene Hauptstadt)
15. **The Big Hole** (Nordkrater) – Finale; danach „Weapon"-Superbosse (Endlos)

*Gates = Regions-Bosse (Chapter-1-Gates s. `encounter-zyklus1.md`). Reunion ist ab jedem Kapitelende verfügbar und wiederholbar; die 1. Reunion schaltet die Gambits frei.*

---

## 2. Aktions-Repertoire des Spielers (bis zur 1. Reunion)

**Im Kampf (bei ATB-Bereitschaft):**
- **Angriff** (ganz zu Beginn manuell, dann Default-Automatik) – kostenlos. *(Der frühere **Attack-Refund** – „Angriff gibt MP zurück" – ist gestrichen; MP wächst in Kapitel 1 gar nicht mehr im Kampf, `feinspec-kapitel1.md` §3.5.)*
- **Waffen-Spezialfähigkeit** (manuell) – rollen-spezifisch, kostet **MP** (s. §4-Tabelle). Wird über die **Waffe** freigeschaltet.
- **Limit** (manuell) – aufgeladener Wand-Brecher, ab Region 1.
- **Manuelle Übernahme** an/aus – ATB pausiert/verlangsamt zur überlegten Auswahl.

**Zielwahl (ab Region 2):**
- Ein **gruppenweites Fokusziel** pro Kampf; am Heiler-Gegner **Bandbox** entscheidet es erstmals den Kampf statt ihn nur zu beschleunigen (`gegner-encounter.md` §5a).

**~~Analyse (ab Region 2)~~ → entfallen (01.08.2026).** Analyse ist **keine Kapitel-1-Mechanik** mehr, sondern geht mit Materia und Element-Wahl in **Kapitel 2** auf (`kampf-analyse-shock.md` §5). In Kapitel 1 füllt sich das **Bestiarium still beim Erst-Kill** – Sammelobjekt und Köder (Kindlebales Feuer-Schwäche, sichtbar aber ungenutzt), ohne Bedienung und ohne Einführungs-Popup.

**Zwischen den Kämpfen (revidiert nach dem ersten Playtest):**
- **Zonen-Rückkehr:** jede bereits geschaffte Zone ist jederzeit frei anwählbar. Dort farmt man **EXP** unbegrenzt weiter – aber **nach Level × Zone gedämpft** (`oekonomie-waehrungen.md` §1a). **Das ist das Ventil des ganzen Spiels** – ohne es ist eine verlorene Zone in einer deterministischen Engine ein permanenter Stopp (`niederlage-offline.md` §3). *Die Dämpfung kam am 30.07.2026 dazu, weil Tieffarmen sonst die **beste** Strategie ist statt der Notausgang.*
- **Gasthaus:** vorab anmeldbarer Heil-Aufenthalt zwischen zwei Kämpfen, kostet Zeit statt Gil. HP und MP tragen sonst über alle Kämpfe hinweg über.

**Build & Meta:**
- ~~Ausrüstung kaufen/verbessern mit Gil~~ → **entfallen (30.07.2026).** Die Spezialfähigkeit kommt über einen **Zonen-Trigger** (Claude Zone 3, spätere Figuren mit Beitritt, `charaktere-party.md`); Slots werden im **Reunion-Upgrade-Menü** freigeschaltet.
- **Die Party** levelt passiv über **EXP** – ein gemeinsames **Gruppenlevel** für alle Figuren (`stats-kampfwerte.md` §4.1). Neuzugänge steigen darauf ein; die Gegnerkurve bleibt dabei die reine `g`-Kurve (eine Gegen-Stufe an den Regionsgrenzen wurde gemessen und verworfen, `feinspec-kapitel1.md` §3.7).
- **Reunion auslösen**, sobald Kapitelende erreicht.

> Bewusst **noch nicht** dabei (kommt mit/nach der 1. Reunion bzw. später): **Materia & Slots**, **Magie/Zauber**, **AP-Ökonomie**, **programmierbare Gambits**, **Shock-Nutzung** (erst Region 3), **Resistenzen**, **Materia-Evolution**, **Summons**.

---

## 3. Manuell- vs. Idle-Anteil über die Zeit

Der **erste Zyklus ist der handnahste**; danach sinkt der Manuell-Anteil, weil Gambits (ab 1. Reunion) die Optimierung automatisieren.

| Phase | Manuell-Anteil | Was der Spieler tut |
|-------|----------------|---------------------|
| Klicker-Auftakt | sehr hoch (~alles) | nur Angriff selbst wählen; ATB lernen |
| Nach Default-Attack | niedrig für Trash | Trash idle; manuell nur Spezial/Limit |
| Zielwahl-Region | niedrig–mittel | Fokusziel setzen (Heiler zuerst); Schwäche im Bestiarium als Fernziel merken |
| Shock-Region | mittel | Schwäche+Shock manuell ausnutzen; Trash idle |
| Kapitel-Wand | niedrig (grindbar) | pushen/grinden; manuell = schnellerer Weg |
| **Nach 1. Reunion** | fällt strukturell | Optimierung via Gambits automatisiert |

---

## 4. Waffen-Spezialfähigkeiten (Rollen-Signatur)

Die Spezialfähigkeit definiert jede Figur schon **vor** dem Materia-Build-System. Freischaltung über einen **Zonen-Trigger**, danach permanent (nicht mehr über die Waffe – `ausruestung-gil.md` §0). Specials sind **ausschließlich MP-gegated (kein Cooldown)**. **MP existiert von Anfang an, wird dem Spieler aber erst mit der ersten MP-Spezial sichtbar** (Region 1) und bleibt danach **dauerhaft angezeigt (auch nach Reunion)**. **MP wächst in Kapitel 1 nicht im Kampf nach** (Attack-Refund gestrichen, `feinspec-kapitel1.md` §3.5) – es ist ein Budget pro Kampf, das sich nur zwischen den Kämpfen füllt (Sieg-Erholung + Gasthaus). Details in `charaktere-party.md`.

| Figur | Region | Spezialfähigkeit | Rolle |
|-------|--------|------------------|-------|
| **Claude** | 1 | großer Einzelschaden | Damage |
| **Barrel** | 2 | Gegner unterdrücken (ATB des Gegners lädt langsamer / wird leicht reduziert) | Kontrolle |
| **Tofa** | 3 | verstärkt den Shock-Zustand | Shock-Enabler |
| **Air is...** | 3 | heilt die Gruppe | Heilung |

Roster-Rhythmus: **Region 1 Claude allein → Region 2 Barrel** (man ist nicht allein) **→ Region 3 Tofa + Air is... gleichzeitig** (volle Gruppe). Zieht sich nicht hin.

---

## 5. Reunion ab Kapitelende (wiederholbar)

- **Verfügbar erst nach dem Sieg über den Kapitel-Boss (revidiert 31.07.2026).** Der Boss ist **Pflicht**; Reunion wird nicht schon beim *Erreichen* der Wand angeboten.

  *Was hier vorher stand:* „Verfügbar, sobald man das Kapitelende erreicht – man muss die Wand nicht zwingend schlagen." Der Ausweg war **redundant**: Kriterium A2 garantiert, dass jede Zone nach ≤ 20 Grind-Siegen in der Vorzone auch vollautomatisch gewinnbar ist. Die Umgehung schützte gegen eine Wand, die es nach A2 nicht gibt, und machte im Gegenzug den Kapitel-Boss zu optionalem Inhalt. Volle Begründung, verworfene Alternative und der Prüfstein („A2 muss an Zone 30 halten"): `prestige-reunion.md`.

  Die Skill↔Zeit-Wahlfreiheit bleibt: Sie hieß nie „Wand überspringen", sondern „Wand billiger machen". Erforderlicher Kampf-Skill = null, erforderliche **Bedienung** = Zonenwahl.
- **Wiederholbar:** Man kann Kapitel 1 mehrfach laufen. Jede Reunion gibt einen **schwachen, aber wiederholbaren permanenten Boost** (voraussichtlich **gedeckelt** pro Stufe; Cap steigt mit Fortschritt) → sauberer Grind-Pfad.
- **Zwei Wege durch die Wand:** manuell gut spielen (früher durch) **oder** per Grind/Reunion stärker werden (später, aber sicher durch). Skill↔Zeit – die kompakte Fassung steht als **Gate-Regel** in `../03_Konzept_Gerüst.md` §15: *nicht passiv erreichbar, aber passiv leichter.* Sie ist zugleich die Begründung dafür, dass die Zonen unmittelbar **vor** einem Gate bewusst ohne neuen Mechanik-Beat auskommen (in Kapitel 1: Z20–29).
- **★★ Die 1. Reunion schaltet zusätzlich die programmierbaren Gambits frei** (+ erster Boost) – die „Graduierung zur Automatik".
- Voller Reset-/Persistenz-Umfang: siehe `prestige-reunion.md`.

---

## 6. Grober Beispieldurchlauf mit Schlüsselmomenten (provisorisch)

**Region 1 – Reactor Row** (Reaktor-Slums, Parodie-Midgar), nur Claude:
- Manueller **Klicker**: nur Angriff. → ATB + Angriff lernen.
- **Zonen-Trigger** (Zone 3) schaltet Claudes **Spezial** `Overcommit` (großer Schaden) frei → **MP werden sichtbar** (existierten bereits, ab jetzt dauerhaft angezeigt). Der Spezial kostet MP; nachwachsen tut es im Kampf **nicht** – MP ist ein Budget pro Kampf.
- **Limit** lädt → manueller Wand-Brecher am **Region-Miniboss** (analog Braver vs. Guard Scorpion).
- **★ Schlüsselmoment:** Freischaltung der **Default-Attack-Regel** – erste Automatik, Trash wird idle-bar.

**Region 2 – Bargain Bazaar** – Barrel stößt dazu; neue Mechanik: **Zielwahl** (geändert 01.08.2026, vorher: Analyse):
- Barrels Spezial: **Unterdrückung** (verlangsamt Gegner-ATB).
- **Zielwahl entscheidet hier erstmals einen Kampf** – der Heiler-Gegner Bandbox macht „welcher zuerst" zur Frage (`gegner-encounter.md` §5a). Das ist die eingeführte Mechanik der Region, weil sie **bedienbar** ist.
- **Das Bestiarium** füllt sich still beim Erst-Kill und zeigt eine sichtbare Schwäche als **Köder** auf Region 3/Kapitel 2 – aber **Analyse ist keine Kapitel-1-Mechanik** und wird hier nicht eingeführt (`kampf-analyse-shock.md` §5, Beschluss 01.08.2026).
- ~~Gil → erste Waffen-/Ausrüstungs-Verbesserungen~~ → **entfallen (30.07.2026).**

**Region 3 – MegaCorp Tower** – Tofa + Air is... (volle Gruppe); neue Mechanik: Shock:
- Tofa verstärkt **Shock**, Air is... **heilt** – Verteidigung/Heilung werden relevant.
- Jetzt sind die in Region 2 gezeigten **Schwächen nutzbar** → Shock-Fenster manuell timen.

**Kapitelende – die erste Wand & 1. Reunion:**
- Kapitel-Boss = **grindbare Wand** (manuell schneller, Idle per Grind auch schaffbar).
- **Reunion verfügbar – nach dem Sieg über den Boss** (§5, revidiert 31.07.2026). **★★ 1. Reunion:** Reset (Zonen/Level/Ausrüstung), erhält Charaktere/Bestiarium; Ertrag **Reunion-Essenz** → **Gambits freigeschaltet** + erster Boost. Wiederholbar für weiteren Grind.

**Ausblick Zyklus 2 (kurz):** Der Spieler **automatisiert** seine gelernte Strategie via Gambits; Kapitel 1 läuft im Re-Traversal schneller/idle; er pusht in Kapitel 2 – wo als nächste Stufe **Materia & Slots** (Build-Layer, Magie, AP) aufgehen, später MP-Regen-Ausbau und Resistenzen.

> Konkrete Monster-Platzierung, Wellen-Zusammensetzung und grobe Stats für Kapitel 1: siehe `encounter-zyklus1.md`.

---

## 7. Nebenquests & exklusive Entscheidungen (abstrakt)

- **Hauptquest = lineare Spine**, auto-folgbar, blockiert nie den Kernfortschritt.
- **Nebenquests = optionale Seitenzweige** mit Boost-/Shortcut-/Mechanik-Belohnung; anfangs gesperrte Köder, später schaffbar (Wiederbesuch-„crush"). Shortcuts beschleunigen künftige Reunion-Zyklen.
- **Exklusive Entscheidungen** nur, wenn **ausreichend bedeutend** – konkrete Kandidaten später.

---

## Offene Detailfragen (nächste Iteration)

- Anzahl Regionen je Kapitel und Namensschema (Parodie-Orte).
- Reunion-Boost: Höhe, Cap-Kurve, wie viele Wiederholungen sich „lohnen".
- Wann taucht der erste gesperrte Seitenzweig als Köder auf.
- Ab wann kommen **Materia & Slots** (direkt in Kapitel 2 vs. etwas später).
- Staffelung stärkerer Limits (analog FF7).

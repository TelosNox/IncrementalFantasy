# Progression: Regionen, Gates & Rollout

**Status:** In Arbeit – Struktur und erster Zyklus (bis 1. Reunion) ausgearbeitet; konkrete Zahlen/Regionsnamen provisorisch.
**Rahmen:** `../03_Konzept_Gerüst.md`, §3 & §10 (verbindliche Richtung).
**Prüfinstanz:** `../02_Leitfaden_Kernmechaniken.md`.

## Schnittstellen zu anderen Systemen

- **Kampf** (`kampf-analyse-shock.md`): Region-Gates schalten Kampf-Stufen frei (horizontaler Rampup).
- **Gambits** (`gambits.md`): werden über die **1. Reunion** freigeschaltet; manuelle Prüfsteine sitzen (selten) an ausgewählten Bossen.
- **Charaktere** (`charaktere-party.md`): Figuren + ihre Waffen-Spezialfähigkeiten stoßen regionsweise hinzu.
- **Prestige** (`prestige-reunion.md`): Reunion ist ab **Kapitelende** verfügbar, wiederholbar; beschleunigt Re-Traversal.
- **Ökonomie** (`oekonomie-waehrungen.md`): Zonen liefern EXP/Gil (MP als Kampf-Ressource); AP/Materia erst später.

---

## 1. Struktur-Orientierung (bewährtes Skelett, FF7-Flavor)

- **Lineare Hauptspine** aus FF7-Parodie-Regionen; jede Region = Zonen-Cluster mit **Boss-Gate** (Vorbild Trimps: „push bis zur Wand"). Ein **Kapitel** = Spanne von Regionen bis zu einem Reunion-Punkt.
- **Eine neue Mechanik pro Region** (Vorbild Grass Cutting), am Gate freigeschaltet – horizontaler Rampup (C1).
- **Reunion ab Kapitelende, wiederholbar** (s. §5) → Re-Traversal beschleunigt, und wer eine Wand nicht manuell schafft, **grindet sich per Reunion einen Vorteil** (Skill↔Zeit).
- **Optionale Seitenzweige = Nebenquests** (Vorbild Increlution/Journey to Ascension): gesperrte Köder → später Boost/Shortcut. Überwiegend über die Zyklen alles machbar; wenige **bedeutende exklusive Entscheidungen** möglich (TBD).
- **Manuelle Prüfsteine** nur **selten** an ausgewählten Bossen (telegrafiert, überlegt-nicht-twitch, s. `gambits.md` §4). Die *frühen* Kapitel-Wände sind bewusst **grindbare Idle-Wände**, kein Pflicht-Manuell.

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
- **Angriff** (ganz zu Beginn manuell, dann Default-Automatik) – kostenlos, gibt MP zurück.
- **Waffen-Spezialfähigkeit** (manuell) – rollen-spezifisch, kostet **MP** (s. §4-Tabelle). Wird über die **Waffe** freigeschaltet.
- **Limit** (manuell) – aufgeladener Wand-Brecher, ab Region 1.
- **Manuelle Übernahme** an/aus – ATB pausiert/verlangsamt zur überlegten Auswahl.

**Analyse (ab Region 2):**
- Gegner analysieren → zeigt **Grundstats (ATK/DEF/HP)**; eine **Schwäche** kann sichtbar werden, ist aber **noch nicht nutzbar** (Skill/Shock fehlt) → Köder auf Region 3.

**Build & Meta:**
- **Ausrüstung** (Waffen/Rüstung) kaufen/verbessern mit **Gil** – Waffen schalten/verbessern die Spezialfähigkeit.
- **Charaktere** leveln passiv über **EXP**.
- **Reunion auslösen**, sobald Kapitelende erreicht.

> Bewusst **noch nicht** dabei (kommt mit/nach der 1. Reunion bzw. später): **Materia & Slots**, **Magie/Zauber**, **AP-Ökonomie**, **programmierbare Gambits**, **Shock-Nutzung** (erst Region 3), **Resistenzen**, **Materia-Evolution**, **Summons**.

---

## 3. Manuell- vs. Idle-Anteil über die Zeit

Der **erste Zyklus ist der handnahste**; danach sinkt der Manuell-Anteil, weil Gambits (ab 1. Reunion) die Optimierung automatisieren.

| Phase | Manuell-Anteil | Was der Spieler tut |
|-------|----------------|---------------------|
| Klicker-Auftakt | sehr hoch (~alles) | nur Angriff selbst wählen; ATB lernen |
| Nach Default-Attack | niedrig für Trash | Trash idle; manuell nur Spezial/Limit |
| Analyse-Region | niedrig–mittel | Grundstats lesen; Schwäche als Fernziel merken |
| Shock-Region | mittel | Schwäche+Shock manuell ausnutzen; Trash idle |
| Kapitel-Wand | niedrig (grindbar) | pushen/grinden; manuell = schnellerer Weg |
| **Nach 1. Reunion** | fällt strukturell | Optimierung via Gambits automatisiert |

---

## 4. Waffen-Spezialfähigkeiten (Rollen-Signatur)

Die Spezialfähigkeit definiert jede Figur schon **vor** dem Materia-Build-System. Freischaltung über die Waffe. Specials sind **ausschließlich MP-gegated (kein Cooldown)**. **MP existiert von Anfang an, wird dem Spieler aber erst mit der ersten MP-Spezial sichtbar** (Region 1) und bleibt danach **dauerhaft angezeigt (auch nach Reunion)** – der Attack-Refund-Loop trägt die Ressource. Details in `charaktere-party.md`.

| Figur | Region | Spezialfähigkeit | Rolle |
|-------|--------|------------------|-------|
| **Claude** | 1 | großer Einzelschaden | Damage |
| **Barrel** | 2 | Gegner unterdrücken (ATB des Gegners lädt langsamer / wird leicht reduziert) | Kontrolle |
| **Tofa** | 3 | verstärkt den Shock-Zustand | Shock-Enabler |
| **Arris** | 3 | heilt die Gruppe | Heilung |

Roster-Rhythmus: **Region 1 Claude allein → Region 2 Barrel** (man ist nicht allein) **→ Region 3 Tofa + Arris gleichzeitig** (volle Gruppe). Zieht sich nicht hin.

---

## 5. Reunion ab Kapitelende (wiederholbar)

- **Verfügbar, sobald man das Kapitelende erreicht** (die Kapitel-Wand). Man **muss** die Wand nicht zwingend schlagen, um zu reunionen.
- **Wiederholbar:** Man kann Kapitel 1 mehrfach laufen. Jede Reunion gibt einen **schwachen, aber wiederholbaren permanenten Boost** (voraussichtlich **gedeckelt** pro Stufe; Cap steigt mit Fortschritt) → sauberer Grind-Pfad.
- **Zwei Wege durch die Wand:** manuell gut spielen (früher durch) **oder** per Reunion-Grind stärker werden (später, aber sicher durch). Skill↔Zeit.
- **★★ Die 1. Reunion schaltet zusätzlich die programmierbaren Gambits frei** (+ erster Boost) – die „Graduierung zur Automatik".
- Voller Reset-/Persistenz-Umfang: siehe `prestige-reunion.md`.

---

## 6. Grober Beispieldurchlauf mit Schlüsselmomenten (provisorisch)

**Region 1 – Reactor Row** (Reaktor-Slums, Parodie-Midgar), nur Claude:
- Manueller **Klicker**: nur Angriff. → ATB + Angriff lernen.
- **Waffe** schaltet Claudes **Spezial** (großer Schaden) frei → **MP werden sichtbar** (existierten bereits, ab jetzt dauerhaft angezeigt; Spezial kostet MP, Angriff gibt MP zurück).
- **Limit** lädt → manueller Wand-Brecher am **Region-Miniboss** (analog Braver vs. Guard Scorpion).
- **★ Schlüsselmoment:** Freischaltung der **Default-Attack-Regel** – erste Automatik, Trash wird idle-bar.

**Region 2 – Bargain Bazaar** – Barrel stößt dazu; neue Mechanik: Analyse:
- Barrels Spezial: **Unterdrückung** (verlangsamt Gegner-ATB).
- **Analyse** zeigt Grundstats (ATK/DEF/HP); eine Schwäche wird sichtbar, ist aber **noch nicht nutzbar** (Köder).
- **Gil** → erste Waffen-/Ausrüstungs-Verbesserungen.

**Region 3 – MegaCorp Tower** – Tofa + Arris (volle Gruppe); neue Mechanik: Shock:
- Tofa verstärkt **Shock**, Arris **heilt** – Verteidigung/Heilung werden relevant.
- Jetzt sind die in Region 2 gezeigten **Schwächen nutzbar** → Shock-Fenster manuell timen.

**Kapitelende – die erste Wand & 1. Reunion:**
- Kapitel-Boss = **grindbare Wand** (manuell schneller, Idle per Grind auch schaffbar).
- **Reunion verfügbar** (ab Erreichen der Wand). **★★ 1. Reunion:** Reset (Zonen/Level/Ausrüstung), erhält Charaktere/Bestiarium; Ertrag **Reunion-Essenz** → **Gambits freigeschaltet** + erster Boost. Wiederholbar für weiteren Grind.

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

# Prestige: Materia-Cap-Reset & Reunion

**Status:** Stub – Detailspezifikation folgt.
**Rahmen:** `../03_Konzept_Gerüst.md`, §9 (verbindliche Richtung).
**Prüfinstanz:** `../02_Leitfaden_Kernmechaniken.md`.

## Schnittstellen zu anderen Systemen

- **Mikro-Ebene – Materia-Cap-Reset** (`materia.md`): erzeugt Materia-Prestige-Währung; Voraussetzung für Evolution.
- **Makro-Ebene – Reunion**: **resettet** Zonen, das **Gruppenlevel** (ein Wert statt vier, `stats-kampfwerte.md` §4.1), Materia-Level/-Slots, Ausrüstung; **erhält** Materia-Typen/-Evolutionen, kristallisierte Boni, Charaktere, Bestiarium, Gambit-Fähigkeiten, **gelernte Waffen-Spezialfähigkeiten**.
  **Präzisierung „Zonen":** Mit der Zonen-Rückkehr (`niederlage-offline.md` §3) gibt es zwei Zonen-Werte – die aktuell bespielte und die höchste je erreichte (`maxZoneReached`, `feinspec-kapitel1.md` §4.6). **Beide** werden zurückgesetzt; der neue Zyklus beginnt wieder bei Zone 1 und muss sich seinen Rückkehr-Spielraum neu erarbeiten. Andernfalls startete jeder Zyklus mit sofortigem Zugriff auf beliebig hohe Farm-Zonen und die Reunion würde sich selbst entwerten. HP/MP werden mit den frischen Charakteren ohnehin neu abgeleitet.
- **Waffen-Spezialfähigkeiten:** die *gelernte Fähigkeit* bleibt (permanenter Skill); die *Waffe als Ausrüstung* wird zurückgesetzt, ihre Kraft/Skalierung neu erspielt.
- **Reunion-Essenz** (`oekonomie-waehrungen.md`): **die 1. Reunion schaltet die programmierbaren Gambits frei** (`gambits.md`); danach kauft Essenz permanente Boni, Materia-Typen, Roster.
- **Ausrüstung/Gil** (`ausruestung-gil.md`): Reset macht Gil je Zyklus neu relevant.

## Verfügbarkeit, Wiederholbarkeit & Boost

- **Verfügbar ab Kapitelende** (sobald man die Kapitel-Wand erreicht) – man muss die Wand nicht schlagen, um zu reunionen.
- **Wiederholbar:** dasselbe Kapitel kann mehrfach gelaufen werden. Das erlaubt einen **Grind-Pfad** für Spieler, die eine Wand nicht manuell schaffen (Skill↔Zeit).
- **Boost:** jede Reunion gibt einen **schwachen, aber wiederholbaren permanenten Boost**, voraussichtlich **gedeckelt pro Stufe** (Cap steigt mit Fortschritt), damit endloses Grinden früher Kapitel nicht trivialisiert.
- **1. Reunion = Sonderfall:** schaltet zusätzlich die Gambits frei („Graduierung zur Automatik").
- **Voller Roster ab Zone 1 (Folge des Gruppenlevels):** Da Charaktere erhalten bleiben und das Gruppenlevel auf 1 zurückfällt, steht ab Durchlauf 2 die komplette Party bereits in Region 1 – wo Durchlauf 1 mit Claude allein begann. Region 1 fühlt sich dadurch spürbar leichter an. **Das ist gewollt und die eigentliche Prestige-Belohnung** („der bekannte Teil fliegt vorbei"), kein Balancing-Leck. Die Regions-Stufen der Gegnerkurve bei Zone 9/19 (`feinspec-kapitel1.md` §3.7) normalisieren das Tempo wieder, ohne eine neue Wand zu erzeugen – Durchlauf 2 ist an jeder Stelle mindestens so stark wie Durchlauf 1.

## Detailspezifikation (TBD)

_Reunion-Auslöser/-Kosten, Essenz-Ertrag & -Sinks, Freischalt-Baum (Gambits/Boni/Typen/Roster), Kristallisations-Mechanik, Wechselwirkung Mikro↔Makro._

## Offene Detailfragen

- Auslöser: rein spielergewählt ab Meilenstein vs. weiche Schwelle.
- Essenz-Ertragskurve und Reihenfolge des Freischalt-Baums.
- Umfang der Kristallisation (welche Boni permanent).

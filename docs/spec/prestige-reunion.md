# Prestige: Materia-Cap-Reset & Reunion

**Status:** Stub – Detailspezifikation folgt.
**Rahmen:** `../03_Konzept_Gerüst.md`, §9 (verbindliche Richtung).
**Prüfinstanz:** `../02_Leitfaden_Kernmechaniken.md`.

## Schnittstellen zu anderen Systemen

- **Mikro-Ebene – Materia-Cap-Reset** (`materia.md`): erzeugt Materia-Prestige-Währung; Voraussetzung für Evolution.
- **Makro-Ebene – Reunion**: **resettet** Zonen, das **Gruppenlevel** (ein Wert statt vier, `stats-kampfwerte.md` §4.1), Materia-Level/-Slots; **erhält** Materia-Typen/-Evolutionen, kristallisierte Boni, Charaktere, Bestiarium, Gambit-Fähigkeiten, **gelernte Waffen-Spezialfähigkeiten** (permanent, ab Zone 1 verfügbar – s. `charaktere-party.md`), **erledigte Mechanik-Einführungen** (Popups erscheinen nicht erneut).
  **Gil steht hier nicht mehr**, weil es die Währung nicht mehr gibt (30.07.2026).
  **Präzisierung „Zonen":** Mit der Zonen-Rückkehr (`niederlage-offline.md` §3) gibt es zwei Zonen-Werte – die aktuell bespielte und die höchste je erreichte (`maxZoneReached`, `feinspec-kapitel1.md` §4.6). **Beide** werden zurückgesetzt; der neue Zyklus beginnt wieder bei Zone 1 und muss sich seinen Rückkehr-Spielraum neu erarbeiten. Andernfalls startete jeder Zyklus mit sofortigem Zugriff auf beliebig hohe Farm-Zonen und die Reunion würde sich selbst entwerten. HP/MP werden mit den frischen Charakteren ohnehin neu abgeleitet.
- **Waffen-Spezialfähigkeiten (M15, 30.07.2026):** es gibt keine Waffe als Ausrüstung mehr, die zurückgesetzt werden könnte (Gil/Tier-Leiter gestrichen, `ausruestung-gil.md` §0) – die *gelernte Fähigkeit* ist seither ein eigenes, permanentes Charakter-Feld (`Character.specialUnlocked`), das `reunion()` **explizit** aus der alten Party in die frisch aufgebaute überträgt (`ui/gameStore.svelte.ts`). Erster Präzedenzfall eines Zustands, der pro Figur (nicht global im Save) über die Reunion hinweg besteht.
- **Reunion-Essenz** (`oekonomie-waehrungen.md`): **die 1. Reunion schaltet die programmierbaren Gambits frei** (`gambits.md`); danach kauft Essenz im **Reunion-Upgrade-Menü** (§Upgrade-Menü) permanente Boni, Materia-Slots, Materia-Typen, Roster.
- **Ausrüstung** (`ausruestung-gil.md`): Slots werden zurückgesetzt und über das Upgrade-Menü neu freigeschaltet. **Gil existiert nicht mehr** (30.07.2026).

## Verfügbarkeit, Wiederholbarkeit & Boost

- **Verfügbar ab Kapitelende** (sobald man die Kapitel-Wand erreicht) – man muss die Wand nicht schlagen, um zu reunionen.
- **Wiederholbar:** dasselbe Kapitel kann mehrfach gelaufen werden. Das erlaubt einen **Grind-Pfad** für Spieler, die eine Wand nicht manuell schaffen (Skill↔Zeit).
- **Boost:** jede Reunion gibt einen **schwachen, aber wiederholbaren permanenten Boost**, voraussichtlich **gedeckelt pro Stufe** (Cap steigt mit Fortschritt), damit endloses Grinden früher Kapitel nicht trivialisiert.
- **1. Reunion = Sonderfall:** schaltet zusätzlich die Gambits frei („Graduierung zur Automatik").
- **Voller Roster ab Zone 1 (Folge des Gruppenlevels):** Da Charaktere erhalten bleiben und das Gruppenlevel auf 1 zurückfällt, steht ab Durchlauf 2 die komplette Party bereits in Region 1 – wo Durchlauf 1 mit Claude allein begann. Region 1 fühlt sich dadurch spürbar leichter an. **Das ist gewollt und die eigentliche Prestige-Belohnung** („der bekannte Teil fliegt vorbei"), kein Balancing-Leck. Eine Gegen-Stufe der Gegnerkurve bei Zone 9/19 war dafür vorgesehen, ist aber gegen die Engine gemessen und verworfen worden (`feinspec-kapitel1.md` §3.7): Sie hätte Durchlauf 1 unspielbar gemacht, ohne für Durchlauf 2 nötig zu sein. Wie leicht sich Region 1 im zweiten Durchlauf tatsächlich anfühlt, ist damit weiterhin **gespielt zu beurteilen**, nicht gerechnet.

## Upgrade-Menü: der Ort für Entscheidungen (neu, 30.07.2026)

**Nach jeder Reunion öffnet ein Upgrade-Menü**, in dem Essenz ausgegeben wird: Materia-Slots freischalten, Materia-Typen kaufen, permanente Boni, Roster-Erweiterungen.

**Warum hier und nicht im Durchlauf:** Eine Entscheidung braucht **Information**. Am Reunion-Punkt hat der Spieler ein komplettes Kapitel gespielt und weiß, wo er hing – hier ist die Information maximal. Mitten im Durchlauf (etwa beim früheren Gil-Kauf in Zone 3) hat er im ersten Durchgang **keine**; die Wahl wäre ein Münzwurf, und der ist schlechter als keine Entscheidung, weil er Verantwortung vorspiegelt.

**Warum Essenz und nicht eine Run-Währung:** Essenz entsteht **pro Reunion**, nicht pro Zeiteinheit. Nachschub kostet einen kompletten Kapitel-Durchlauf, nicht zehn Minuten Zonen-Rückkehr. Damit hält sie Exklusivität, während eine zeit-farmbare Währung sie nicht halten kann (Exklusivitäts-Regel in `oekonomie-waehrungen.md` §1 – der Grund, aus dem Gil gestrichen wurde).

### Milestone zuerst, dann Wahl

**Je System kommt der *erste* Freischalter per Milestone** (der erste Materia-Slot, die erste Materia) – Onboarding, das garantiert, dass der Spieler das System überhaupt sieht. **Alles danach ist Wahl aus dem Menü.**

**Genau ein Milestone je System, nicht mehr.** Eine Kette von Milestones („3. Reunion bringt Slot 2, 5. Reunion bringt Slot 3") ist derselbe Fehler wie die gestrichene Waffen-Tier-Leiter: ein Fahrplan, auf dessen nächsten Punkt man wartet, ohne zu entscheiden. Auf der Meta-Ebene tut das langsamer weh und bleibt deshalb länger unentdeckt – ein Grund mehr, es hier festzuhalten.

Das spiegelt den Bogen des ganzen Spiels: **Die Meta-Ebene beginnt auf Schienen und wird zum Entscheidungsraum**, so wie der Kampf von manuell zu planerisch wird.

### Kostenregel (verbindlich)

**Preise hängen an der Zahl der bisherigen Käufe, nicht an einem festen Betrag.** Sonst öffnet sich mit steigendem Essenz-Ertrag die Schere: Der Spieler verdient laufend mehr, feste Preise werden relativ immer billiger, die Entscheidung löst sich auf. Genau diese Inflationsfalle hat Gil erledigt – bei Essenz wirkt sie langsamer, aber sie wirkt. Zusammen mit dem **gedeckelten Boost pro Stufe** (§Verfügbarkeit) hält das die Knappheit.

## Detailspezifikation (TBD)

_Reunion-Auslöser/-Kosten, Essenz-Ertrag & -Sinks, Freischalt-Baum (Gambits/Boni/Typen/Roster), Kristallisations-Mechanik, Wechselwirkung Mikro↔Makro._

## Offene Detailfragen

- Auslöser: rein spielergewählt ab Meilenstein vs. weiche Schwelle.
- Essenz-Ertragskurve und Reihenfolge des Freischalt-Baums.
- Umfang der Kristallisation (welche Boni permanent).

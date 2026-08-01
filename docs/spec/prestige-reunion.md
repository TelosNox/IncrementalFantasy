# Prestige: Materia-Cap-Reset & Reunion

**Status:** Stub – Detailspezifikation folgt.
**Rahmen:** `../03_Konzept_Gerüst.md`, §9 (verbindliche Richtung).
**Prüfinstanz:** `../02_Leitfaden_Kernmechaniken.md`.

## Schnittstellen zu anderen Systemen

- **Mikro-Ebene – Materia-Cap-Reset** (`materia.md`): erzeugt Materia-Prestige-Währung; Voraussetzung für Evolution.
- **Makro-Ebene – Reunion**: **resettet** Zonen, das **Gruppenlevel** (ein Wert statt vier, `stats-kampfwerte.md` §4.1), Materia-Level/-Slots, **den Boss-Sieg (`chapterBossDefeated`, s. u.)**; **erhält** Materia-Typen/-Evolutionen, kristallisierte Boni, Charaktere, Bestiarium, Gambit-Fähigkeiten, **gelernte Waffen-Spezialfähigkeiten** (permanent, ab Zone 1 verfügbar – s. `charaktere-party.md`), **erledigte Mechanik-Einführungen** (Popups erscheinen nicht erneut).
  **Gil steht hier nicht mehr**, weil es die Währung nicht mehr gibt (30.07.2026).
  **Präzisierung „Zonen":** Mit der Zonen-Rückkehr (`niederlage-offline.md` §3) gibt es zwei Zonen-Werte – die aktuell bespielte und die höchste je erreichte (`maxZoneReached`, `feinspec-kapitel1.md` §4.6). **Beide** werden zurückgesetzt; der neue Zyklus beginnt wieder bei Zone 1 und muss sich seinen Rückkehr-Spielraum neu erarbeiten. Andernfalls startete jeder Zyklus mit sofortigem Zugriff auf beliebig hohe Farm-Zonen und die Reunion würde sich selbst entwerten. HP/MP werden mit den frischen Charakteren ohnehin neu abgeleitet.
- **Waffen-Spezialfähigkeiten (M15, 30.07.2026):** es gibt keine Waffe als Ausrüstung mehr, die zurückgesetzt werden könnte (Gil/Tier-Leiter gestrichen, `ausruestung-gil.md` §0) – die *gelernte Fähigkeit* ist seither ein eigenes, permanentes Charakter-Feld (`Character.specialUnlocked`), das `reunion()` **explizit** aus der alten Party in die frisch aufgebaute überträgt (`ui/gameStore.svelte.ts`). Erster Präzedenzfall eines Zustands, der pro Figur (nicht global im Save) über die Reunion hinweg besteht.
- **Boss-Sieg fällt zurück (`chapterBossDefeated`, 01.08.2026):** Der Pflicht-Boss (§Verfügbarkeit) hängt an einem eigenen Save-Flag. Es **muss** bei jeder Reunion auf `false` fallen – sonst bleibt Reunion ab Durchlauf 2 dauerhaft verfügbar und zahlt bei jedem Klick Essenz, ohne dass ein Kampf stattfindet. Das wäre nicht bloß ein Exploit, sondern das Ende der Exklusivität, die Essenz als Entscheidungs-Währung überhaupt trägt (`oekonomie-waehrungen.md` §1: Nachschub kostet einen Durchlauf, nicht zehn Minuten) – also genau der Grund, aus dem Gil gestrichen wurde. Gefunden im Konzept-Review M15b als tatsächlicher Bug (Umsetzungsentscheidung 66).

  ⚠️ **Regel für alle künftigen Save-Felder:** Jedes neue `SaveState`-Feld wird **hier** eingetragen, bevor es benutzt wird – entweder als *resettet* oder als *erhält, weil …*. Bisher war die Verfügbarkeit an `currentZone` gehängt, einen Wert, den die Reunion ohnehin zurücksetzt; der Schutz war ein Nebenprodukt. Mit einem eigenen Flag ist er es nicht mehr. Ein Feld, das in dieser Liste fehlt, ist ein unentschiedener Fall.
- **Reunion-Essenz** (`oekonomie-waehrungen.md`): **die 1. Reunion schaltet die programmierbaren Gambits frei** (`gambits.md`); danach kauft Essenz im **Reunion-Upgrade-Menü** (§Upgrade-Menü) permanente Boni, Materia-Slots, Materia-Typen, Roster.
- **Ausrüstung** (`ausruestung-gil.md`): Slots werden zurückgesetzt und über das Upgrade-Menü neu freigeschaltet. **Gil existiert nicht mehr** (30.07.2026).

## Verfügbarkeit, Wiederholbarkeit & Boost

- **Verfügbar erst nach dem Sieg über den Kapitel-Boss (revidiert 31.07.2026).** Der Boss ist **Pflicht** – Reunion wird nicht schon beim *Erreichen* der Wand angeboten.

  **Was hier vorher stand:** „Verfügbar ab Kapitelende (sobald man die Kapitel-Wand erreicht) – man muss die Wand nicht schlagen, um zu reunionen." Implementiert als `canReunion = currentZone >= 30` (`ui/gameStore.svelte.ts`), ausdrücklich als *Ausweg für Spieler, die die Wand nicht schaffen*.

  **Warum revidiert:** Der Ausweg war **redundant**. Das Ventil gegen Anti-Pattern #1 ist nicht die Umgehung der Wand, sondern **Kriterium A2** (`feinspec-kapitel1.md` §12): Für jede Zone existiert eine Zahl N ≤ 20 wiederholter Siege in der Vorzone, nach der sie auch für einen vollautomatischen Spieler gewinnbar ist. Wer „heftig gelevelt hat", schafft den Boss also – ohne einen einzigen manuellen Eingriff. Die Umgehung schützte damit gegen eine Wand, die es nach A2 gar nicht gibt, und machte im Gegenzug den Kapitel-Boss zu **optionalem Inhalt**: Der effizienteste Camper-Pfad wäre gewesen, Zone 30 zu erreichen, sofort zu reunionen und Vaultron nie anzufassen.

  ⚠️ **Bedingung, unter der das sicher ist – und der Prüfstein dieser Entscheidung: A2 muss an Zone 30 halten.** Fällt sie, ist der Pflicht-Boss eine Wand ohne Ventil und damit exakt der Fehler vom 24.07.2026.

  *Verworfene mildere Alternative:* Reunion beim Erreichen weiter erlauben, aber geringer bezahlen (reduzierte Essenz). Erhält den Notausgang, fügt aber eine zweite Ertragsrate hinzu, um eine Absicherung zu bewahren, die A2 unnötig macht – und lässt den Boss optional. Mehr Mechanik für weniger Klarheit.

  **Das Prinzip dahinter (und die eigentliche Begründung):**

  > **Zeit erzeugt Überlevelung, und Überlevelung senkt den erforderlichen Skill drastisch — aber nicht auf null.** Genau das *ist* die Skill↔Zeit-Wahlfreiheit. Sie gewährt nur keine vollständige Passivität; das tut kein Incremental, sonst müsste man es gar nicht spielen.

  Die Wahlfreiheit geht durch den Pflicht-Boss also **nicht verloren** — sie war nie „Wand überspringen", sondern „Wand billiger machen". Was bleibt, ist ein Minimum an Bedienung: **Zonenwahl.** Niederlage zahlt nichts (`niederlage-offline.md` §1), wer also stur an der Wand weiterprobiert, wird nie stärker; wer zurückgeht und farmt, kommt durch. Konkret heißt das für den Boss: **erforderlicher Kampf-Skill = null** (A2 garantiert Gewinnbarkeit für den vollautomatischen Typ V), **erforderliche Bedienung = Zonenwahl.**

  Konsistent mit `gegner-encounter.md` §7: Die Kapitel-Wand ist ausdrücklich eine **grindbare Idle-Wand**, kein Pflicht-Prüfstein. Können kauft **Tempo** (M ≈ 13,5 min gegen V ≈ 67 min), nicht **Zugang**.

  *Nebeneffekt:* „Zone 30 erreichen" und „Vaultron besiegen" fallen zu **einer** Ziellinie zusammen. Vorher waren es zwei, und die Abnahmekriterien haben sie vermischt (A1 sprach von *erreichen*, B2/B4/B5 vom Boss).
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

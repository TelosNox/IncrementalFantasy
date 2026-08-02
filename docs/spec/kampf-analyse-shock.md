# Kampf, Analyse & Shock

**Status:** In Arbeit – Kern-Mechaniken festgelegt, konkrete Zahlen TBD.
**Rahmen:** `../03_Konzept_Gerüst.md`, §4 (verbindliche Richtung).
**Prüfinstanz:** `../02_Leitfaden_Kernmechaniken.md`.

## Schnittstellen zu anderen Systemen

- **Gambits** (`gambits.md`): ATB-Takt liefert das „Wann", Gambits das „Was"; Auto-Attack ist die unterste Gambit-Regel. Analyse-Wissen, Shock-Zustand und MP speisen Bedingungen.
- **Materia** (`materia.md`): Element-Materia nutzt Schwächen und treibt Shock; Magie/Spezials kosten MP; MP-Regen und Speed sind Build-Hebel; Resistenzen erzwingen Build-Wechsel.
- **Ausrüstung** (`ausruestung-gil.md`): trägt Speed-/MP-/Regen-Modifikatoren.
- **Charaktere/Limits** (`charaktere-party.md`): Limit-Leiste je Figur; Shock-Fenster verstärken Schaden/Limits; Affinitäten beeinflussen Aktionen.
- **Regionen** (`progression-regionen.md`): staffeln den Rollout der Kampf-Stufen.
- **Niederlage/Heilung** (`niederlage-offline.md`): getaktete Gegneraktionen machen Verteidigung/Heilung nötig.
- **Bestiarium** persistiert über Reunion (`prestige-reunion.md`).

---

## 1. ATB-Takt (Kern-Uhr des Auto-Battlers)

- Jede Figur (und jeder Gegner) hat eine **ATB-Leiste**, die sich über Zeit füllt; die **Speed**-Stat bestimmt die Füllrate.
- Ist die Leiste voll, wird **eine Aktion ausgelöst** – standardmäßig von den **Gambits** gewählt (das „Was"), optional vom Spieler überschrieben (Aktiv-Ebene).
- **Auto-Attack ist kein eigenes System**, sondern die **unterste Gambit-Regel** („WENN nichts anderes greift DANN Attack") mit garantiertem Fallback-Slot. Der **allererste Spielabschnitt** ist jedoch ein **manueller Klicker** (Aktionen werden bei ATB-Bereitschaft selbst gewählt); die Default-Attack-Regel ist die **erste Automatik-Freischaltung** kurz darauf. Steuerungs-Ebenen & Rollout: siehe `gambits.md`.
- **Gegner handeln ebenfalls getaktet** (vereinfachtes, **telegrafiertes** ATB) – erst dadurch werden defensive Gambit-Sets und Heilung sinnvoll (gegen Einseitigkeit #5).
- **Standard = Auto-Resolve:** Kein Input wird je erzwungen; manuelles Eingreifen ist immer Bonus (gegen Klick-Ermüdung A2).
- **Bedenkzeit-Pause (Wait-Modus, verbindlich):** Sobald der Spieler eine Aktion selbst wählt (manuelle Übernahme / offenes Aktionsmenü), friert die **gesamte Kampfuhr** ein – **alle** ATB-Leisten, der **Shock-Auf- und -Abbau**, Gegner-Telegrafs und Statuseffekt-Ticks (Gift, Zünd-Zähler). Nichts läuft ab, während gewählt wird; ein Shock-Fenster wird durch Nachdenken **nie** verbraucht. Im Idle-/Auto-Modus (keine anstehende Spielerwahl) läuft die Uhr durchgehend. So bleibt Aktiv-Spiel überlegt statt hektisch (präzisiert den „Wait"-Modus aus `gambits.md` §3: es pausiert die *ganze* Simulation, nicht nur die eigene Leiste) und der Zeitdruck-Anti-Pattern (#12) wird vermieden.

## 2. Aktionstypen (bewusst schlank)

- **Attack** – kostenlos, Fallback; **gibt etwas MP zurück** (s. §3).
- **Materia Ability / Magic** – kostet **MP**.
- **Defend** – Schadensreduktion o. Ä. für defensive Sets.
- **Limit** – eigene Ladeleiste, **kein** MP (s. §4).
- **Keine Gegenstände/Items** (bewusste Entscheidung – hält das System schlank).

## 3. MP & Regeneration (der Spam-Riegel)

MP ist der **Limiter**, der die Gambit-Tiefe überhaupt erst erzeugt: Ohne Kosten wäre die einzige Regel „caste das Stärkste", und die Prioritätsliste würde bedeutungslos. MP ist eine **Kampf-Ressource** (eine Leiste je Figur), **keine Meta-Währung** (kein Verstoß gegen #9).

**Sichtbarkeit:** MP **existiert von Anfang an**, wird dem Spieler aber erst mit der **ersten MP-Fähigkeit** (Waffen-Spezial, Region 1) sichtbar. Ab dann **dauerhaft angezeigt, auch nach Reunion** – ein einmal enthülltes System wieder zu verstecken ergäbe keinen Sinn.

**Regeneration – in Kapitel 1 nur *ein* Kanal (revidiert, `feinspec-kapitel1.md` §3.5):**

1. **Prozentualer Refill nach jedem gewonnenen Kampf** (+ Gasthaus zwischen den Kämpfen) – Basis-Nachschub. Prozentual statt Fixwert, damit es über die gesamte Skalierung sauber bleibt (gegen tote Zahlen #10). **Das ist der einzige Kanal in Kapitel 1:** MP wächst im Kampf gar nicht nach, es ist ein **Budget pro Encounter**. Genau das macht In-Kampf-Heilung zu einer harten Obergrenze und Bosskämpfe zu Ausdauer-Rätseln – und „in einer leichten Zone nicht auszugeben" selbst zu einem Zug.
2. **Trickle über Zeit pro ATB-Tick** – Sustain in langen (Boss-)Kämpfen. **Hier sitzt der Build-Hebel:** Materia/Ausrüstung/Affinität steigern die Regen-Rate. **Ab Kapitel 2**, über MP-Regen-Materia.
3. ~~**Attack-Refund** – ein normaler Angriff gibt etwas MP zurück.~~ **Gestrichen.** Er hätte den Loop „MP leer → Angriff → MP zurück → wieder zaubern" geschlossen, hat aber genau die Budget-Knappheit aufgelöst, die MP zum Limiter macht. Die Auto-Attack bleibt auch ohne ihn der Fallback (§2).

**Gestaffelter Rollout (C1/C2):** Kapitel 1 nur Kanal 1 (simpel, lehrt die Ressource als Vorrat). Kanal 2 und Regen-Materia gehen später über die Progressions-Achsen auf – dass Kapitel 1 gar keinen In-Kampf-Regen hat, macht diese Materia zur spürbaren Belohnung statt zur Fußnote.

**Idle-tauglich:** Die MP-Politik fahren die Gambits automatisch (z. B. „WENN MP hoch UND Gegner schwach DANN Feuga; SONST Attack"). Der Spieler autort die Strategie einmal, der Sim führt sie aus – kein Pro-Kampf-Micromanagement.

**Entscheidung:** MP allein genügt als Riegel – **kein** zusätzlicher Cooldown/Charge für Magie/Spezials. Stärkere Zauber werden schlicht über **höhere MP-Kosten** selten gehalten (teurer = seltener spammbar, und leert die Leiste schneller → Fallback auf Angriff). Limits (eigene Leiste) und Summons (später, eigene Mechanik) bleiben davon unberührte, separate Systeme – kein Zusatzriegel auf normale Magie.

## 4. Limit-Leiste – der aktive „Durchbruch"

- **Rolle:** Das Limit ist der aktive **Wand-Brecher**, nicht bloß eine Kampfaktion. Zünden löst einen kräftigen Party-weiten Schub / eine Wucht-Attacke aus – gedacht, um an Bossen/Wänden **durchzubrechen** (thematisch: Limit *Break* = Grenze brechen). Das ist die „Push durch die Wand"-Handlung, die ein Incremental dem aktiven Spieler geben will.
- **Verfügbarkeit & Ladung (revidiert nach dem ersten Playtest – Esper-Modell):** Die Leiste existiert **nur in Gate-/Boss-Kämpfen**, startet dort bei 0 und lädt sich innerhalb des Kampfes über aus-/eingesteckten Schaden auf. **Kein Übertrag zwischen Kämpfen.**
  *Warum die frühere Persistenz („über den ganzen Run, Reset erst bei Reunion") gestrichen wurde:* Mit der Zonen-Rückkehr (`niederlage-offline.md` §3) wäre sie ein Vorab-Farm-Exploit – man lädt das Limit in einer trivialen Zone auf und betritt die Wand mit voller Leiste. Zudem war Limit als überall verfügbarer Knopf im Playtest schlicht „wie die Spezialattacke, nichts Besonderes". Etwas, das **ausschließlich an Wänden existiert** und sich dort vor den Augen des Spielers aufbaut, ist ein Ereignis. Vorbild: Esper-Beschwörungen in FF7 Remake. Zahlen: `feinspec-kapitel1.md` §3.4.
- **Ladehöhe: früh genug, dass die Wirkung ablesbar ist (Playtest 02.08.2026).** Zielgröße: **erste volle Leiste bei ~30–35 % Kampffortschritt**, zweite gegen Ende. Ein Limit, das erst kurz vor dem Sieg kommt, ist unsichtbar – der Gegner wäre ohnehin gefallen. Erst auf einem noch vollen HP-Balken zeigt es, was es ausrichtet. Zahlen: `feinspec-kapitel1.md` §3.4 (Faktoren dort als Annahme markiert).
- **Grenze nach oben – und ihre Kopplung an Shock:** Noch frühere Verfügbarkeit kippt zurück in den Ur-Befund „wie die Spezialattacke, nichts Besonderes", der das Esper-Modell überhaupt begründet hat. Ab Kapitel 2 kommt ein zweiter Grund dazu: Wer mit voller Leiste auf das Shock-Fenster (§6) wartet, verliert jede weitere Ladung – eine zu früh volle Leiste **bestraft das Aufheben**, das der Shock-Multiplikator gerade belohnen soll. **Deshalb steigt die Rate in Kapitel 1 und ab Kapitel 2 nicht weiter:** Dort trägt der Shock-Bonus den Wert des Limits, nicht seine Häufigkeit.
- **Idle-fähig:** per Gambit automatisierbar (z. B. „WENN Boss UND Limit voll DANN Limit") als Sicherheitsnetz – ab Kapitel 2, mit dem programmierbaren Editor.
- **Aktiv-Skill-Decke:** **manuelles Timing** (ins Shock-Fenster legen, den richtigen Moment im Bosskampf abpassen) holt spürbar mehr heraus → beide Spielweisen tragfähig (§3): Idle kommt durch, Aktiv kommt *schneller* durch. Dass Limit jetzt nur noch dort lebt, wo `gambits.md` §4 ohnehin **manuelle Prüfsteine** vorsieht, schärft diese Kopplung zusätzlich.
- **Kein MP** (eigene Leiste, unabhängig vom ATB).
- **Humor-Spotlight (F2):** Zünden löst einen kurzen Parodie-Moment je Figur aus (Spruch/Effekt) → wiederkehrender Charakter-Moment statt bloßer Zahl.

## 5. Analyse & Bestiarium

- Jede Gegner-Art wird beim **ersten Sieg blind** besiegt und ist **danach automatisch analysiert** (Bestiariums-Eintrag).
- **Vorzeitige Analyse ist nur per Materia möglich – also ab Kapitel 2.** Die frühere Formulierung „optionale aktive Analyse als Abkürzung" ist damit terminiert: In Kapitel 1 gibt es **keinen** Weg, eine Art vor dem ersten Sieg zu lesen.
- **Das Bestiarium beschreibt die Gegner-ART, nie eine konkrete Instanz** (Entscheidung 01.08.2026). Deshalb **keine absoluten Zahlen** auf der Karte: Stats erscheinen als **relative Balken** gegen `STAT_MAX`, Verhalten als **Tags/qualitative Beschreibung** („heilt seine Gruppe", „schwer zu treffen"). Begründung: Derselbe Gegner tritt über viele Zonen mit unterschiedlich skalierten Werten auf (§3.7 `scaleEnemyStat`, `gegner-encounter.md`). Eine absolute Zahl auf einer Typ-Karte ist deshalb **nie für alle Instanzen wahr** – sie ist entweder falsch oder braucht einen Zonenbezug, den eine Typ-Karte nicht haben sollte. Dieselbe Logik wie beim Zahlenverbot in den Einführungs-Popups (`ui-layout.md`): eine nicht vorhandene Zahl kann nicht falsch sein.
- Kein Chore (pro Art nur einmal); **Wissen persistiert über Reunion**.
- Analyse schaltet **weakness-basierte Gambit-Bedingungen** frei → Synergie-Loop (§2).

**Playtest-Befund (30.07.2026): „Die Analyse ist zu Beginn wertlos, man kann sie für nichts nutzen."** Das trifft zu. Sie geht laut Rollout in **Region 2** auf, enthüllt dort ATK/DEF/HP und Schwächen – aber Schwächen sind erst mit Shock nutzbar (Region 3) und mit Element-Wahl richtig (Materia, Kapitel 2), und die Zahlen nur, wenn **Zielwahl etwas entscheidet**.

**Diagnose: Analyse ist nicht prinzipiell wertlos, sie ist wertlos, weil Zielwahl wertlos ist.** Dieselbe Wurzel wie der Spielertyp-Korridor.

**Beschluss (Kopplung, keine Streichung):** Mit dem **Heiler-Gegner in Region 2** (`gegner-encounter.md` §5a) bekommt Analyse ab ihrem ersten Auftritt einen Nutzen – man liest, *welcher* Gegner zuerst muss. Bleibt dieser Schritt aus, gehört Analyse nach Kapitel 2, wo Element-Wahl ihre Befunde nutzbar macht.

### Beschluss 01.08.2026: Analyse ist eine Mechanik ab Kapitel 2 (der Fallback ist eingetreten)

Der Kopplungsversuch oben ist **gescheitert**, und zwar an zwei unabhängigen Stellen:

1. **Der Heiler macht Zielwahl wertvoll, nicht Analyse.** „Dieser Gegner heilt" liest der Spieler an der wieder steigenden HP-Leiste ab (`gegner-encounter.md` §5a). ATK/DEF/HP ändern die Antwort „erst den Heiler" nicht.
2. **Die Rettung – Heilmenge und Takt als exklusive Zahl – ist mit der Typ-Karten-Regel oben unvereinbar.** Sie war der einzige Kandidat für eine Information, die die Kampfanzeige nicht hergibt, und sie ist genau die absolute Instanz-Zahl, die dort nicht hingehört.

**Folge:** In Kapitel 1 gibt es **keine bedienbare Analyse-Mechanik**. Das Bestiarium füllt sich weiterhin **still beim Erst-Kill** – als Sammel-/Nachschlage-Objekt und als Köder (Kindlebales Feuer-Schwäche, sichtbar aber ungenutzt). Es wird **nicht beworben**: Das Einführungs-Popup „Analyse & Bestiarium" entfällt aus der Kapitel-1-Liste (`ui-layout.md`).

**Analyse wird in Kapitel 2 eingeführt**, zusammen mit Materia und Element-Wahl – dort, wo eine enthüllte Schwäche eine Entscheidung trägt und die vorzeitige Analyse als Materia überhaupt existiert. Erst dann ist sie ein Werkzeug statt einer Anzeige.

**Verworfen:** E4 qualitativ umzuformulieren („Analyse enthüllt die Rolle im Pulk"). Das hätte die Mechanik in Kapitel 1 gehalten, aber der Ertrag – erkennen, wer der Heiler ist – ist nach zwei Sekunden Zuschauen ohnehin da. Ein Werkzeug einzuführen, das nichts tut, ist schlechter, als es später einzuführen: Der Spieler lernt sonst, dass die Erklärungen des Spiels sich nicht lohnen.

**Der Erstkontakt bleibt bewusst ein Rätsel (Konzept-Entscheidung 01.08.2026).** Wissen entsteht aus dem Sieg, nicht vor ihm – der erste Kampf gegen eine Art wird blind bestritten, die Analyse zahlt sich ab der **Wiederbegegnung** aus. Das ist kein Timing-Fehler, sondern die Belohnungsrichtung des Systems: Erkunden zuerst, Optimieren danach. Verworfen wurde die Gegenposition, Lehrgegner vorab freizuschalten, damit die Information „im Entscheidungsmoment" vorliegt (`gegner-encounter.md` §5a, Befund 2) – sie hätte den einzigen Moment entwertet, in dem das Spiel den Spieler etwas herausfinden lässt, und den Bestiariums-Eintrag von einer Belohnung zu einer Vorab-Bedienungsanleitung gemacht.

**Erledigt sich mit der Typ-Karten-Regel:** Der frühere Streit, ob die Heilmenge auf der Karte zonen-skaliert angezeigt werden muss (`gegner-encounter.md` §5a, Befund 1), ist gegenstandslos – die Zeile entfällt ersatzlos. Das ist die mildere Lösung: Statt eine falsche Zahl zu reparieren, verschwindet die Fehlerklasse „absolute Zahl auf einer Typ-Karte" dauerhaft.

## 6. Shock

Jeder Gegner sammelt **Shock** über zugefügten Schaden – **immer**, auch ohne Schwäche-Ausnutzung, nur langsamer. Voll aufgeladen → der Gegner wird **geschockt** (Wirkung s. „Shock-Zustand" unten).

> **Rollout:** Das Shock-**System** wird erst in **Region 3** freigeschaltet – gebündelt mit **Tofa** (der Shock-Enablerin) und der vollen Party. Davor existiert weder Ring-Anzeige noch Aufbau; „immer" bezieht sich auf die Zeit *ab Freischaltung*. Der erste DEF-Gegner (Safeguard) taucht bewusst schon in Region 2 auf – als grindbarer Zäh-Gegner, der das Bedürfnis nach Shock *weckt*, den Region 3 dann als Konter liefert. Region 1 bleibt shock-frei (Attack + Limit).

**Drei Shock-Zustände des Gegners:**

- **Neutral** (Standard): Shock baut sich mit Basisrate auf.
- **Schockaffin:** Shock baut sich stark beschleunigt auf. Wird i. d. R. durch **Treffen der Schwäche** ausgelöst und hält **zeitlich begrenzt** an.
- **Schockresistent:** Shock baut sich nur langsam auf; ein **späteres** Gegner-Merkmal (Teil des Resistenz-Layers).

**Shock-Zustand (Wirkung):** Der geschockte Gegner bleibt für eine begrenzte Dauer (~5–8 s, tunbar) im Fenster. Darin gilt:

- **DEF wird weitgehend ignoriert + Schadens-Multiplikator (~×2, tunbar)** – der gezielte **Konter gegen hohe DEF**: ein Panzer (z. B. Safeguard) ist normal zäh, **geschockt aber weich** → „erst schocken, dann killen".
- **Gegner handlungsunfähig oder stark verlangsamt** (defensive Erleichterung).
- **Limits/Bursts** wirken zusätzlich verstärkt (Timing-Anreiz fürs aktive Spiel).

Danach leert sich die Leiste; eine kurze Abklingzeit verhindert Dauer-Shock-Lock (optional kurz danach schockresistent).

**Konsequenz fürs Rollout:** Frühe Gegner sind **Neutral** (nicht schockresistent), daher funktioniert Shock schon in **Zyklus 1** – nur langsamer, getragen von normalem Schaden + Tofas Shock-Boost. Mit **Element-Materia (ab Kap. 2)** löst Schwäche-Ausnutzung den **Schockaffin**-Zustand aus → deutlich schneller. Schockresistente Gegner/Resistenzen kommen spät und erzwingen Build-/Set-Wechsel.
- Idle-tauglich: sobald eine Schwäche bekannt ist, nutzt die Auto-Battle sie automatisch.

### Shock-Anzeige: der Ring (verbindlich)

Der Shock-Stand jedes Gegners ist als **Ring um den Gegner** sichtbar. Farbwelt **Gold/Bernstein** (angelehnt an den FF-Stagger-Look) – bewusst **nicht** Lila, damit „geschockt/verwundbar" die vertraute warme Signalfarbe trägt.

- **Aufbau (0–99 %):** ein bernsteinfarbener Ring (Amber, `#e0a52e`) füllt sich **von unten (6-Uhr-Position) symmetrisch zu beiden Seiten nach oben**. Der Füllgrad zeigt jederzeit ablesbar, **wie nah** der Gegner am Schock ist.
- **Auslösung (100 %):** der Ring schließt sich oben und **blitzt hell-golden auf** (`#ffcc33`, kurzer „Snap"); der Gegner erhält einen leuchtenden goldenen Umriss.
- **Symbolik des aktiven Zustands:** der geschlossene Ring **birst oben auf** – eine kleine Lücke bei 12 Uhr mit einem **Funken/Splitter**: Sinnbild „Verteidigung aufgebrochen". Dazu ein kleines **Bruch-/Funken-Icon** über dem Gegner. Klar unterscheidbar von der Aufbauphase.
- **Fenster-Countdown:** im aktiven Fenster **leert sich derselbe Ring von oben (12 Uhr) symmetrisch nach unten** – die verbleibende Fenster-Zeit ist so direkt ablesbar. Bei „leer" endet der Schock; eine kurze **graue Cooldown-Markierung** verhindert sofortiges Re-Shock.
- **An die Uhr gekoppelt (wichtig):** Ring-Aufbau **wie** -Countdown bewegen sich **nur, wenn die Kampfuhr läuft**. In der Bedenkzeit-Pause (§1) steht der Ring still – das Fenster wird durch Nachdenken nicht verbraucht.

Ein einziges Element (der Ring) trägt beide Phasen: **nach oben füllen = Aufbau**, **nach unten leeren = Countdown**; Richtung plus Bruch-Symbol unterscheiden sie eindeutig (Lesbarkeit-Leitplanke, Binär-/Ein-Element-Prinzip).

**Visuelles Gewicht skaliert mit dem Füllstand (Playtest-Politur nach M11).** Die Erstfassung legte Farbe, Richtung und Symbolik fest, aber nichts über die *Auffälligkeit* – umgesetzt wurde ein durchgehend kräftiger Ring, der schon bei nahezu leerem Stand die Stage dominiert. Bei drei bis vier Gegnern gleichzeitig konkurrieren mehrere satte Goldbögen um Aufmerksamkeit, während sie inhaltlich gerade *nichts* mitteilen.

- **Nahe 0 %:** kaum sichtbar – feine Haarlinie, stark reduzierte Deckkraft. Bei exakt 0 darf der Ring ganz entfallen.
- **Mit steigendem Füllstand** nehmen Deckkraft, Strichstärke und Sättigung zu. Kurz vor 100 % ist der Ring am auffälligsten – **genau dann, wenn die Information zählt**.
- **Auslösung, Bruch-Symbol und Fenster-Countdown behalten volle Prominenz.** Das ist der Auszahlungsmoment und darf laut sein.

Der Informationsgehalt bleibt damit unverändert (der Füllgrad ist jederzeit ablesbar) – er wird nur dort leise, wo gerade nichts passiert, und dort laut, wo etwas kippt. **Zusätzlich:** Der Ring muss vom Bodenschatten der Figur unterscheidbar bleiben; bei niedrigem Füllstand liegt er als Bogen unter dem Sprite und konkurriert sonst optisch mit der Standfläche.

## 7. Wellen / Zonen-Rahmen

- Party gegen **Gegnerwelle**; alles besiegt → nächste Zone; **Boss = Gate** (C2).
- **Niederlage** → milde Zeitstrafe, automatischer Gasthaus-Aufenthalt, Neustart an gleicher Stelle, kein Fortschrittsverlust. **HP/MP tragen über und werden durch die Niederlage nicht aufgefüllt**; wer stärker werden will, geht per Zonen-Rückkehr farmen (Details in `niederlage-offline.md`).

## 8. Rollout-Reihenfolge (grob; exakte Zuordnung in `progression-regionen.md`)

**Kapitel 1:** Attack + Limit (nur an Gates) → **Zielwahl** → Shock.
**Ab Kapitel 2:** Analyse/Bestiarium (mit Materia/Element-Wahl) → MP-Regen-Ausbau → Schockanfälligkeit/Resistenzen.

*Analyse stand bis zum 01.08.2026 an zweiter Stelle dieser Kette; sie ist nach Kapitel 2 verschoben (§5), Zielwahl hat ihren Platz als Region-2-Beat übernommen.*

**Hinweis zum MP-Regen-Ausbau:** Der frühere Attack-Refund ist gestrichen (`feinspec-kapitel1.md` §3.5) – MP wächst in Kapitel 1 gar nicht mehr im Kampf. Genau das macht MP-Regen-Materia in Kapitel 2 zu einer spürbaren Belohnung statt zu einer Fußnote; der Ausbau-Schritt oben gewinnt dadurch an Gewicht.

---

## Offene Detailfragen (nächste Iteration, dann mit Zahlen)

- ATB-Füllformel und Gewichtung der Speed-Stat.
- MP-Werte: %-Erholung je Sieg, Gasthaus-Rate, Special-Kosten (~~Attack-Refund~~ gestrichen).
- Shock: Aufbau-Rate, Schwelle, Fenster-Dauer und -Bonus.
- Gegner-Aktionstakt und Telegraf-Vorlauf.
- ~~Limit: Laderaten und Payoff-Höhe – neu zu justieren.~~ **Erledigt am 01.08.2026 (M17-Playtest):** Die Ladung hängt jetzt am **Anteil** statt am Betrag (Anteil der Ziel-maxHP beim Austeilen, der eigenen maxHP beim Einstecken, `feinspec-kapitel1.md` §3.4). Damit ist sie zonen- und levelstabil; dass die absolute Rate dreimal justiert wurde, war selbst der Beleg für die Drift. **Keine offene Stellschraube mehr** – offen bleibt nur die einmalige Verifikation an allen drei Gates. Payoff unverändert 4,5·ATK. (Ein Cap gegen Über-Banking ist durch das Esper-Modell gegenstandslos: Es gibt nichts mehr zu banken.)

# Abnahmekriterien Kapitel 1

*Reiner Umzug am 01.08.2026: Dieser Abschnitt stand bis dahin als **§12** in `feinspec-kapitel1.md` und ist hier wörtlich und unverändert abgelegt. Bestehende Zitate der Form "feinspec §12" und die Kriterien-Kürzel (A1–A3, B1–B5, C1–C4, D, E1–E5, F1–F3) bleiben gültig und meinen dieses Dokument.*

---

## 12. Abnahmekriterien der Neu-Balancierung

**Zweck:** Die Konzeptphase liefert bewusst **keine neuen Zahlen** – sie liefert die Eigenschaften, die die Zahlen erfüllen müssen. Die Umsetzung findet die Werte und prüft sie gegen diese Liste. Grund: Die alte Baseline war nicht falsch berechnet, sondern gegen das falsche Modell gemessen (§9). Ein Kriterium ist deshalb nur dann eins, wenn es **falsifizierbar** ist und sagt, **wo** es geprüft wird — und seit dem 31.07.2026 zusätzlich, **welches Spielerverhalten** es prüft und **wo die Simulation davon abweicht** (`../02_Leitfaden_Kernmechaniken.md` §5). Der Grund: Dreimal hat hier ein Haken gehalten, weil die Sonde ein bequemeres Spiel maß als das ausgelieferte. Zu jedem Kriterium gehören daher der geprüfte **Typ**, dessen **Aktionen** (greift er im Kampf ein? wählt er Zonen? farmt er begrenzt oder unbegrenzt?) und die **Richtung** jeder Abweichung — lässt sie den Spieler schneller oder langsamer erscheinen?

### Die vier Spielertypen

Alle Kriterien werden gegen vier klar getrennte Spielweisen geprüft. Sie sind die Messgrundlage und ersetzen das frühere Begriffspaar „Auto vs. manuell an Gates":

| Typ | Verhalten | Rolle |
|-----|-----------|-------|
| **M – Manuell** | wählt Aktionen *und* Ziele selbst, nutzt Specials/Heal/Suppress/Limit/Defend | Referenz (schnellster Pfad) |
| **T – Teilautomatisch** | setzt pro Kampf nur das **Fokusziel**, sonst Auto | der erwartete Normalfall |
| **V – Vollautomatisch** | greift im Kampf **gar nicht** ein, **wählt aber Zonen** – bei Niederlage einen Schritt zurück, dann wieder vor | Idle-Versprechen |
| **K – Camper** *(neu 31.07.2026)* | greift im Kampf gar nicht ein und **wählt eine Zone, die er stundenlang stehen lässt** (Spiel läuft während der Arbeitszeit); erst danach stößt er vor | der reale Idle-Extremfall |

**Warum K dazukommt.** V ist **nicht** reines Idle: Der Harness modelliert für V ausdrücklich eine **Zonenwahl** („bei Niederlage die letzte geschaffte Zone einmal farmen", `tests/chapter-playthrough.test.ts`). Damit blieb der Fall, den der zweite Playtest tatsächlich gefunden hat — *eine* Zone wählen und laufen lassen — dauerhaft ungemessen. Genau dort saß nach M15 noch ein Leck (§12 B5, `oekonomie-waehrungen.md` §1a).

**Was K von V unterscheidet, ist nicht „weniger Eingriff", sondern die Farm-Menge.** V farmt pro Niederlage *einen* Kampf und wird deshalb von A2 begrenzt. K farmt an einer selbstgewählten Zone **unbegrenzt** und ist von A2 überhaupt nicht berührt. Wer K härter stellen will, muss deshalb A2 nicht anfassen — das ist der Grund, warum das Leck ohne Risiko für das Ventil zu schließen ist.

**Ein völlig passiver Spieler ist kein eigener Typ** und braucht keinen: Niederlage zahlt nichts (§3.8c). Wer an einer Wand stur weiterprobiert, wird niemals stärker. Es existiert also kein Kanal „gar nichts tun und irgendwann gewinnen" — mindestens die Zonenwahl muss bedient werden. *Das ist der tragende Grund für B4, nicht die in `07_Umsetzungsentscheidungen.md` Entscheidung 52 genannte Begründung (s. dort).*

### A – Durchspielbarkeit (harte Gates, nicht verhandelbar)

- **A1** Alle vier Typen **besiegen** Zone 30 (Vaultron). **V und K dürfen langsamer sein, aber nie blockiert.** *Präzisiert 31.07.2026: Vorher stand „erreichen“ – und das war die billigere von zwei Ziellinien, während B2/B4/B5 den Boss meinten. Seit der Boss Pflicht ist (`prestige-reunion.md`), fallen Erreichen und Besiegen zu **einer** Ziellinie zusammen.*
- **A2 (Ventil, formal):** Für **jede** Zone Z gilt: Es existiert eine Anzahl N wiederholter Siege in Zone Z−1, nach der Z für Typ V gewinnbar ist – mit **N ≤ 20**. Braucht eine Zone mehr, ist sie keine Wand mehr, sondern ein Stau. *Dies ist die formale Fassung von Anti-Pattern #1 und der wichtigste Test der ganzen Liste.*
- **A3** Kein Spielzustand ist erreichbar, aus dem heraus kein Fortschritt mehr möglich ist – insbesondere nicht bei sehr wenig HP. *(Der frühere Zusatz „und 0 Gil" ist mit der Streichung von Gil gegenstandslos; das Gasthaus kostet weiterhin Zeit, §3.8b. **Neu relevant:** Die EXP-Dämpfung in §3.6 darf A3 nicht aushebeln – der Ertrag fällt nie auf null, und das Plateau muss breit genug bleiben, dass Zurückgehen den schwachen Spieler wirklich durchbringt.)*

### B – Abstand zwischen den Spielertypen

Der Abstand muss **existieren** (sonst lohnt aktives Spiel nicht, Anti-Pattern #5) und **begrenzt** sein (sonst ist Idle bestraft, Leitplanke „Idle-Versprechen respektieren").

- **B1** Reihenfolge der Gesamtdauer strikt: **M < T < V**. Kein Gleichstand.
- **B2** **Neu gefasst am 30.07.2026 – absolute Zielzeiten statt Verhältnis-Korridor.** Der alte Korridor (T ∈ [1,3; 3,5], V ∈ [2,5; 4,5] bei M = 1,0) war doppelt untauglich: Er hing nur an Verhältnissen, sagte also nichts darüber, ob das Kapitel überhaupt die richtige *Länge* hat – und er war seit M11 als „nicht erreichbar" markiert, weil Können am Ende nichts kaufte. Beides ist dieselbe Ursache (s. „Warum der Korridor nicht zu öffnen war").

  | Spielweise | Zielzeit Durchlauf 1 | Herkunft |
  |---|---|---|
  | **M** – ordentlich, manuell | **~30 min** (Referenz) | Konzept-Vorgabe: die 1. Reunion ist das Onboarding und muss früh kommen, sonst hört der Spieler vor allem Interessanten auf |
  | **T** – idle, Gates manuell | **~90 min** (~3×) | Schätzung der Konzept-Session, keine Messung |
  | **T′** – schwach, manuell + Farmen | **offen: Zielband festzulegen** | muss **endlich** bleiben – das ist der Spieler, den A3 schützt |
  | **V** – idle, **wählt aber Zonen** | **~65–70 min** (Korridor **2,5–5,5×** M) | gemessen (s. u.); korrigiert 02.08.2026, s. Kasten |
  | **K** – Camper, bleibt stehen | **nicht in Zeit gemessen**, sondern in **Camping-Sessions**: ≥ 3 an klar getrennten Zonen (**B5**) | ergibt sich aus der EXP-Dämpfung + `EXP_DAMPING_CUTOFF` (§3.6) |

  > **Korrektur 02.08.2026 – „Größenordnung Wochen" stand bei V und meinte K.** Die V-Zeile lautete: *„reines Idle – so hoch, dass es niemand freiwillig abwartet (Größenordnung Wochen)"*. Beides ist falsch geworden, als **K** am 31.07.2026 dazukam, und niemand hat die Zeile danach nachgeprüft:
  >
  > 1. **V ist nicht „reines Idle"** – das sagt die Typ-Tabelle oben ausdrücklich. V **wählt Zonen** (bei Niederlage zurück, dann wieder vor). Genau deshalb wurde K überhaupt eingeführt.
  > 2. **Die Zielzeit widersprach der Messung im selben Abschnitt** (V = 67,3 min = 4,99×) und dem daraus abgeleiteten Testkorridor (2,5–5,5×). Ein Kriterium, das der eigene Test nicht erfüllen kann, ist kein Kriterium.
  >
  > **Der Adressat von „niemand wartet das freiwillig ab" ist K, nicht V** – und für ihn ist es in **B5** sauber gefasst (≥ 3 Sessions), samt Mechanismus (Cutoff). *Sachlicher Grund für die Trennung:* V bedient das **Minimum** – die Zonenwahl. Das ist exakt die Handlung, die das Ventil-Prinzip verlangt und die die **Gate-Regel** (`../03_Konzept_Gerüst.md` §15) als Preis für Zugang vorsieht: *nicht passiv erreichbar, aber passiv leichter.* Wer sie ausführt, hat den Zugang gekauft; ihn dafür in einen Wochen-Kanal zu stellen, würde dieselbe Handlung einmal belohnen und einmal bestrafen. K führt sie gerade **nicht** aus – er bleibt stehen – und darf deshalb langsam sein.
  >
  > **Keine Zahl ändert sich dadurch:** Messung, Testkorridor, B5 und der Cutoff bleiben unverändert. Korrigiert wird nur die Zeile, die seit dem 31.07.2026 den falschen Spielertyp beschrieb.

  **Gemessen (M15, `07_Umsetzungsentscheidungen.md` Umsetzungsentscheidung 52, gegen `tests/chapter-playthrough.test.ts`):** M 13,5 min / T 43,7 min (3,24×) / V 67,3 min (4,99×) Simulationszeit – M/T praktisch unverändert gegenüber der alten, ungedämpften Baseline (§7.4: 13,3/42,8 min), V spürbar langsamer (zuvor 53,2 min/3,4×) durch die EXP-Dämpfung (§3.6). Die M/T-Zielzeiten (Echtzeit inkl. Menüs) bleiben damit erreichbar; **T′ ist weiterhin offen** (Playtest-Frage). Der V-Korridor in den Testkriterien ist entsprechend auf 2,5–5,5× angehoben (vorher 2,5–4,5×).

  ⚠️ **T′ ist der einzige unbestimmte Typ – und der gefährdetste.** *(Umformuliert 02.08.2026: Hier stand „Die Lücke zwischen T (~90 min) und V (Wochen) ist Faktor ~200." Diese Lücke gibt es nicht – sie war die Folge der falschen V-Zielzeit, s. Kasten oben. Gemessen liegen T und V mit 43,7 zu 67,3 min **dicht beieinander**, und der V-Kanal ist damit kein Abgrund mehr, in den man fallen kann.)*

  **Die Sorge selbst bleibt aber gültig, nur mit anderem Mechanismus:** Der Spieler, der ein Gate manuell *versucht* und nicht schafft (T′), hat weder M's Tempo noch V's Gleichmut – er farmt, weil er muss. **Genau deshalb muss die EXP-Dämpfung ein breites Plateau haben** (§3.6): Ein bis zwei Zonen zurückzugehen muss ihn in wenigen Vielfachen der Referenz durchbringen. Das Zielband für T′ zu bestimmen, ist Teil der Neu-Balancierung – **es ist die letzte offene Zeile dieser Tabelle.**

  **Ansatz dafür (02.08.2026): T′ ist zusammensetzbar, nicht zu erraten.** Aus dem Playtest ist die Handlungsfolge bekannt, die er tatsächlich durchläuft (`niederlage-offline.md` §3): **T + ein bis zwei Gasthaus-Zyklen je Wand + Farmzeit über das Plateau, bis die Wand fällt.** Alle drei Größen sind gemessen oder messbar (Gasthaus-Totzeit/-Rate, Plateaubreite, Grind-Siege je Zonenstufe ≈ A2). Das Band ist damit **rechnerisch herzuleiten**, statt als Zielwert gesetzt zu werden – und der Prüfstein bleibt derselbe: Es muss **endlich** sein, und der Weg dorthin darf nicht am Erkennen scheitern.

- **B4 Der Kapitel-Boss darf nicht durch reines Warten fallen.** **Erfüllt, aber anders begründet als in der Umsetzung angenommen:** Niederlage zahlt nichts (§3.8c), also wird ein Spieler, der *nichts* bedient, nie stärker. Es gibt keinen Kanal „warten und irgendwann gewinnen". *Die Begründung in `07_Umsetzungsentscheidungen.md` Entscheidung 52 („A2/C3 erzwingen einen Abschluss in endlicher, gemessener Zeit") ist ein Fehlschluss — dass der Abschluss endlich ist, wäre ein Argument **gegen** B4, nicht dafür.* Der operative Test ist nicht B4, sondern **B5**.

- **B5 (neu 31.07.2026, aus dem Camper-Befund) Der Camper braucht mindestens drei Camping-Sessions an deutlich verschiedenen Zonen.** Gemessen als: Typ **K** stellt eine Zone ein, lässt sie eine realistische Session (Referenz: **8 h**) laufen, stößt danach vor, so weit es ohne Farmen geht — und wiederholt das. **Bis Vaultron fällt, müssen ≥ 3 solche Sessions an klar getrennten Zonen nötig sein.**

  *Herkunft:* Der Nutzer hat den Camper als reales Verhalten benannt („startet das Spiel und lässt es während der Arbeitszeit laufen"). Weiterkommen ist ausdrücklich in Ordnung — nicht in Ordnung ist, **nach dem ersten Start direkt den Boss zu schaffen**; es soll mindestens einen Umzug in eine deutlich höhere Zone plus erneutes Campen erfordern. Die Mindestforderung war 2; festgeschrieben sind **3**, damit die nächste Balance-Änderung nicht sofort auf 1 zurückfällt.

  ⚠️ **Nach M15 verletzt** — gemessen: **eine** 8-h-Session an **Zone 3** (der allerersten Wand) bringt L2 → L20, danach fallen Zonen 4–30 inklusive Vaultron ohne weiteres Farmen. Ursache: `oekonomie-waehrungen.md` §1a („Warum ein absoluter Floor das Leck ist").
  **Mechanismus gebaut in M15a** (`EXP_DAMPING_CUTOFF = 6`, `core/formulas.ts`/`core/progression.ts`): Der Ertrag fällt jenseits von sechs Überschuss-Leveln hart auf 0 statt auf 1. Eine zusätzlich befürchtete Kalibrierung von `expectedLevelForZone` erwies sich als unnötig – der reale Überschuss am Kapitelende ist 2,5, nicht 6–8 (`07_Umsetzungsentscheidungen.md` Umsetzungsentscheidung 57; der Review hatte gegen die ungedämpfte Vor-M15-Baseline verglichen).

  ⚠️ **B5 ist trotzdem noch nicht belegt.** Der Abnahmewert „3 Sessions, Zonen 1/16/30" stammt aus einer Simulation, die **Vaultron nie besiegt** (der Erfolgs-Zweig feuert, sobald die Vorstoß-Phase bei `frontier + 1 > 30` startet) und in der **Wände übersprungen** werden können. Beide Fehler haben denselben Ursprung und wirken **zugunsten** des Ergebnisses – der wahre Wert liegt vermutlich ≥ 3, B5 dürfte halten, **gemessen ist es nicht.** Details und Korrekturliste: `07_Umsetzungsentscheidungen.md` Entscheidung 59/60.
- **B3** Beide Abstände müssen **existieren** – M < T und T < V. Eine Aussage über ihr Größenverhältnis wird bewusst **nicht** mehr getroffen (s. u.).

### Warum der Korridor nicht zu öffnen war (aufgelöst 30.07.2026)

Der M11-Befund lautete: „Der angenommene Korridor zwischen T und V ließ sich nicht erreichen – an der Kapitel-Wand bringt reine Zielwahl nur einen kleinen Vorteil." Das stand als offene Balance-Frage.

**Es war keine Balance-Frage.** Wenn Wände durch **Stats** fallen und Stats aus **skillfreiem Farmen** kommen, konvergieren alle Spielweisen auf „farmen, bis die Wand umfällt". Der Korridor ließ sich nicht durch Zahlen öffnen, weil er **durch den Farm-Kanal zugedrückt** war. Dieselbe Ursache machte Zielwahl wirkungslos und Analyse nutzlos (`kampf-analyse-shock.md` §5).

**Der Korridor ist damit als eigenes Thema geschlossen.** Er wird über zwei andere Beschlüsse mitgelöst:

1. **EXP-Dämpfung** (§3.6) – Farmen hört auf, die dominante Strategie zu sein.
2. **Gegner, die Zielwahl erzwingen** (`gegner-encounter.md` §5a, Heiler ab Region 2) – Können bekommt etwas, das Farmen nicht ersetzt.

Der Abschnitt unten bleibt als Beleg stehen: Er beschreibt korrekt, *dass* der Abstand M→T groß und T→V klein ist – die damalige Deutung („ein kleiner Input verdient einen kleinen Ertrag") ist aber nur die halbe Wahrheit. Der Ertrag war klein, weil es an der Wand auf Zielwahl gar nicht ankam.

**Aufgelöst (war offen nach M11): Typ T liegt viel näher an V als an M – und das ist richtig so.**

Die Erstfassung von B3 verlangte, der Sprung M→T müsse der *kleinere* sein: Ein Fokusziel pro Kampf sollte den Großteil des Vorteils einfangen. Die Messung sagt das Gegenteil (M→T ≈1,8 Einheiten, T→V ≈0,6). Das ist kein Balance-Fehler, sondern die Natur der Sache: **Ein kleiner Input verdient einen kleinen Ertrag.** Der große Hebel sind Limit, Specials, Heilung und Suppress – und die sind vor der 1. Reunion **absichtlich** manuell (§4.7, Playtest-Korrektur nach M7). Dass die Zahlen das zeigen, bestätigt jene Entscheidung, statt sie zu widerlegen.

**Konsequenz für die Einordnung:** Typ T ist **keine Machtstufe, sondern ein Komfort- und Ablesbarkeits-Feature.** Seine Rechtfertigung hängt nicht am Zeitgewinn, sondern an drei anderen Dingen: Zielwahl wird überhaupt sichtbar (E3), Defend bekommt eine Informationsgrundlage (§3.9), und der Spieler kann seine Absicht ausdrücken. Das trägt auch bei geringem Tempovorteil.

**Ausdrücklich verworfen:** Typ T zusätzliche Fähigkeiten zu geben (z. B. Defend ohne volle manuelle Steuerung), um den Abstand künstlich zu vergrößern. Das würde die Typgrenzen verwischen und genau den M-Vorsprung abtragen, auf dem die M7-Korrektur beruht („Auto bleibt stumpf, damit aktives Spiel über das *ganze* Kapitel lohnt").

**Was stattdessen zu beobachten ist:** nicht der Abstand T↔V, sondern der **Absolutwert von V**. *(Die hier genannten ≈3,4× sind die **Vor-M15-Zahl**; seit der EXP-Dämpfung sind es **4,99×** ≈ 67 min – s. Messung in B2. Die Aussage wird dadurch nicht schwächer, sondern stärker.)* **Ohne Offline-Progress ist das echte Zeit am Bildschirm** – 67 Minuten Zuschauen, nicht 67 Minuten Abwesenheit. Der eigentliche Prüfstein dafür ist **E2** (gespielt beurteilen), nicht die Rechnung. *Zugleich das stärkste Argument, die Offline-Wiedereinführung als **aufladbaren Boost** (`niederlage-offline.md` §4) nicht mehr lange liegen zu lassen: Ihre Vorbedingung „erst nach der Neu-Balancierung des Kern-Loops" ist mit M15/M15a erfüllt.*

### C – Wo die Wände sitzen

- **C1** An jedem der drei Gates gilt für die Retry-Zahl: **M ≤ T ≤ V**. *Mit Toleranz an zwei Stellen, jeweils als Umsetzungsentscheidung dokumentiert: T ≤ V an Zone 30 mit +6 (Entscheidung 6), M ≤ T an Zone 18 mit +1 (Entscheidung 42 – seit Barrel auf dem Gruppenlevel einsteigt, verliert M in Region 2 seltener, farmt weniger und steht am Gate mit knapp niedrigerem Level als der grindende T).*
- **C2** Für M liegt die Retry-Zahl an allen drei Gates bei **0–1**. Können zahlt sich aus.
- **C3** Für V ist die Retry-Zahl an jedem Gate **≤ 18** (in Kombination mit A2 – Grinden muss die Zahl senken). *Ursprünglich ≤ 15 – eine runde Zahl, kein gemessener Schwellwert. Mit dem Gruppenlevel verlagern sich V's Niederlagen aus der Fläche an die Gates (§3.7): Z30 16 statt 11 Retries bei unveränderter Gesamtzeit – im Sinne von C4 die gewollte Richtung.*
- **C4** **Keine reguläre Zone darf für irgendeinen Typ mehr Retries erfordern als das nächstfolgende Gate.** Wände gehören an Gates. Genau das war in der Vorfassung verletzt: Zone 6 wurde zur härtesten Stelle der Region.

### D – Ressourcen-Ökonomie

- **D1 (HP-Signalregel, §3.8d):** Farmt Typ T eine Zone auf dem Level, auf dem er sie erstmals geschafft hat, ist die HP-Bilanz pro Kampf **≥ 0**. Drückt er auf die nächste Zone, ist sie **< 0**. Diese Regel *bestimmt* den Erholungswert; sie wird nicht gegen ihn geprüft.
- **D2** MP ist an Gates ein echter Riegel: Typ M geht in **jedem** Gate-Kampf vor Kampfende die MP aus. Andernfalls ist MP kein Limiter, sondern Dekoration.
- **D3** MP ist in der Fläche kein Dauerärgernis: Typ M kann beim Farmen einer komfortablen Zone im Schnitt **mindestens einen Special pro Kampf** einsetzen, ohne ins Gasthaus zu müssen.
- **D4** Gasthaus-Anteil: Für Typ T liegt die im Gasthaus verbrachte Zeit bei **≤ 15 %** der Gesamt-Kapitelzeit. Darüber dominiert Warten das Spiel.
- **D5** Die Limit-Leiste füllt sich für Typ M in jedem Gate-Kampf **ein- bis zweimal** – und in regulären Zonen **nie** (strukturell durch §3.4, trotzdem als Regression abzusichern).

### E – Prüfung am Menschen (nicht ersetzbar)

- **E1** Eine Person spielt Zone 1 → 30 → Reunion **ohne Debug-Eingriffe** durch, ohne dauerhaft festzustecken. Das ist die Abnahme von M11.
- **E2** Die Wartezeiten (Zeitstrafe + Gasthaus-Totzeit) werden **gespielt** beurteilt, nicht gerechnet. Ohne Offline-Progress ist das echte Zeit am Bildschirm.
- **E3** Ein Spieler kann nach dem Durchgang die Zielregeln **in eigenen Worten benennen** – Gegner wie Party. Wird das nicht erreicht, ist die Regel zwar deterministisch, aber nicht nachvollziehbar (§3.9), und die Anzeige ist nachzubessern.
- **E4 (neu, 30.07.2026)** Ein Spieler kann nach dem Durchgang **jede eingeführte Mechanik benennen und sagen, wofür jede Figur da ist**. Das ist die Abnahme des Einführungs-Systems (`ui-layout.md`, „Mechanik-Einführung"). *Begründung: Eine Mechanik, die der Spieler nicht bemerkt, benutzt er nicht – wer Defend und Zielwahl nie wahrgenommen hat, spielt zwangsläufig als Typ V. Die stumme Einführung ist damit mitverantwortlich für die Idle-Konvergenz und nicht bloß ein Komfortthema.*
- **E5 (neu)** Der Spieler weiß nach seiner ersten Niederlage, **dass er in eine frühere Zone zurückgehen kann**. Das Ventil ist die zentrale Anti-Deadlock-Mechanik des Spiels; wird es nicht bemerkt, existiert es faktisch nicht (`niederlage-offline.md` §3, „Lesbarkeit ist Teil der Mechanik").

### F – Schutz gegen die Wiederholung des Ursprungsfehlers

- **F1** Der Pacing-Harness ruft **dieselben Codepfade** auf wie das Spiel. Insbesondere durchläuft ein Zonenwechsel dieselbe Funktion, die auch der Spieler auslöst – kein harness-eigener Weg in eine andere Zone.
- **F2** Der Harness **modelliert keine Mechanik, die das Spiel nicht hat.** Die Zonen-Rückkehr wird als *Spielerentscheidung* abgebildet (welche Zone farmt wer wie lange), nicht als impliziter Automatismus bei jeder Niederlage. Das war die exakte Ursache dafür, dass die alte Baseline ein anderes Spiel maß.
- **F3** Kein Leitplanken-Haken in §10 wird gesetzt, bevor die zugehörige Eigenschaft **im Spiel** geprüft wurde – nicht in der Simulation, die sie voraussetzt (`../02_Leitfaden_Kernmechaniken.md` §5, Playtest-Nachträge).

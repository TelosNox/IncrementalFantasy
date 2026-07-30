# Fortschritts-Ökonomie & Währungen

**Status:** Prinzipien aus den bisherigen Entscheidungen abgeleitet; Zahlen/Kurven → **Playtest**.
**Rahmen:** `../03_Konzept_Gerüst.md`, §11 (verbindliche Richtung).
**Prüfinstanz:** `../02_Leitfaden_Kernmechaniken.md`.

## Währungen (1:1 zu Systemen, gegen Wildwuchs #9)

| Währung | Quelle | Verwendung | Ebene |
|---------|--------|------------|-------|
| **EXP** | Kämpfe | **Gruppenlevel** – ein Level für die ganze Party (`stats-kampfwerte.md` §4.1) | Basis |
| **AP** | Kämpfe (auto auf alle Materia) | Materia-Level (`materia.md`) | Basis (ab Kapitel 2) |
| **Materia-Prestige-Währung** | Materia-Cap-Reset | Materia-Evolution (`materia.md`) | Mikro-Prestige |
| **Reunion-Essenz** | Reunion (`prestige-reunion.md`) | **Reunion-Upgrade-Menü**: Gambits, permanente Boni, Slots, Materia-Typen, Roster | Makro-Prestige |

Die Aufteilung ist damit symmetrisch: **EXP + AP** sind Run-Währungen (fließen im Durchlauf, resetten bei Reunion), **Materia-Prestige + Essenz** sind Meta-Währungen (entstehen an Reset-Punkten, überleben).

## Gil ist gestrichen (Konzept-Session 30.07.2026)

**Gil existiert nicht mehr** – nicht umgebaut, nicht auf Kapitel 2 verschoben, sondern entfernt. Der tragende Grund ist strukturell, nicht „nur ein Sink":

> **Eine Ausgabe-Entscheidung ist nur exklusiv, wenn die Währung auf eine Weise knapp ist, die Zeit nicht auflösen kann.** Eine zeit-farmbare Währung erzeugt keine Entscheidung, sondern eine Wartezeit.

Seit M11 ist die **Zonen-Rückkehr** das Ventil gegen Deadlocks: Jede geschaffte Zone ist frei wiederholbar und zahlt regulär aus (§4). Der Zufluss ist damit ausdrücklich **nur durch Zeit** begrenzt – und das darf nicht geändert werden, es ist der Fix für Anti-Pattern #1. Also ist jeder Gil-Preis farmbar, und jede „Wahl" davor ist eine Frage der Geduld.

**Gegenprobe:** Wollte man Exklusivität per Regel erzwingen („nur eine Variante, endgültig"), macht *die Regel* die Arbeit und der Preis ist Dekoration. Gil ist damit entweder wirkungslos oder überflüssig.

**Playtest-Befund, der es ausgelöst hat:** „Es gab keine Entscheidung, wofür ich Gil ausgebe. Am Charakter taucht der Kaufbutton auf und man drückt drauf. Er ist sofort wieder da, wenn das nächste Gruppenmitglied kommt." Die Waffen-Tier-Leiter (`atk ×(1+0,10·tier)`, viermal identisch) war genau das Anti-Pattern-Muster „immer wieder dasselbe Upgrade kaufen und aufs nächste warten" – Zeitvertreib, kein Spiel.

**Verworfene Alternativen, mit Begründung:**

| Option | Warum verworfen |
|---|---|
| Gil bleibt, Leiter → **exklusive Waffen-Ausrichtung** (offensiv/defensiv/SPD) | Zwei Gründe. (a) Zeit-farmbar, also nicht exklusiv – s. o. (b) Die Spezialfähigkeit ist die **Rollen-Signatur** der Figur (`charaktere-party.md`); eine Waffe, die Air is… nach ATK biegt, schleift genau die Diversität, die die Figuren unterscheidet. |
| Entscheidung **mitten im Run** (Kaufzeitpunkt Zone 3) | Eine Entscheidung braucht **Information**. In Zone 3 des ersten Durchlaufs hat der Spieler keine – die Wahl ist ein Münzwurf, und der ist schlechter als keine Entscheidung, weil er Verantwortung vorspiegelt. Am Reunion-Punkt ist die Information maximal. |
| Gil **überlebt die Reunion** als Planungswährung | Kollidiert frontal mit der Reunion-Essenz. Zwei Meta-Währungen mit demselben Zweck ist Währungs-Wildwuchs (#9) und bricht die Sink-Disziplin (§1). |
| Gil als **Zeit-Umwandler** (Gasthaus, Retry-Abkürzung) | Deadlock-Risiko; genau deshalb ist das Gasthaus bereits bewusst auf Zeit umgestellt (Leitplanke A3). |
| Gil-finanzierter **Materia-Shop** ab Kapitel 2 | Dieselbe Inflationsfalle: Der Spieler verdient laufend mehr Gil, feste Preise werden relativ immer billiger, die Entscheidung löst sich auf. Materia-Erwerb läuft über Erst-Clears und das Essenz-Menü. |

**Der Automatisierungs-Test, der daraus folgt** (allgemein verwendbar):

> **Was automatisiert werden muss, war keine Entscheidung.** Automatisierung braucht nur, was sich *wiederholt*. Eine Wahl, die pro Durchlauf einmal fällt, braucht keinen Gambit – sie ist planerisches Spiel. Eine Wahl, die einen Gambit bräuchte, war eine Mautstelle.

**Was an Gils Stelle tritt:** nichts im Durchlauf. Entscheidungen wandern auf die Meta-Ebene (`prestige-reunion.md`, Reunion-Upgrade-Menü). Kapitel 1 behält vier Run-Entscheidungen: **MP-Budget**, **Zielwahl/Fokus**, **Zonenwahl** (vor/zurück, kostet den investierten Kampf) und **Gasthaus-Timing**. MP ist dabei der bessere Lehrer für Ressourcen-Entscheidungen als ein Kaufbutton – pro Kampf, mit sofortigem Feedback.

## Schnittstellen

Querschnitts-Dokument: jede Währung gehört zu genau einem System (Tabelle). Balancing der Ertrags-/Kostenkurven wird hier zentral gehalten.

---

## 1. Abgeleitete Prinzipien

- **Sink-Disziplin:** jede Währung hat **genau einen Haupt-Sink** → kein Wildwuchs (#9).
- **Kadenz je Ebene (doppelte Zielstruktur, §7 Leitfaden):** Basis-Währungen (EXP/AP) pro Kampf (kurzfristige Ziele); Materia-Prestige pro Cap-Reset; Reunion-Essenz pro Reunion (langfristige Ziele). Kurz- und Langfrist-Motivation laufen parallel.
- **Exklusivitäts-Regel (neu, 30.07.2026):** Eine Währung darf nur dann eine Entscheidung tragen, wenn **Zeit ihre Knappheit nicht auflösen kann**. Run-Währungen (EXP/AP) fließen über die Zonen-Rückkehr zeitlich unbegrenzt – sie tragen **Fortschritt**, keine Wahl. Entscheidungen leben auf der Meta-Ebene, deren Währungen **pro Reset-Punkt** entstehen, nicht pro Zeiteinheit. *Das ist der Grund für die Streichung von Gil (s. o.) und die Prüfregel für jede künftige Währung.*
- **AP-Regel:** fließt auf **alle angelegten** Materia; volle stoppen (Detail in `materia.md`).
- **Wachstums-Multiplikatoren gehören in die Meta-Ebene:** EXP-/AP-**Rate** nur über Reunion-Essenz/Milestones – **nie** auf Materia-Slots oder Ausrüstung (sonst Mandatory-Falle). Der Kern-Loop skaliert EXP ohnehin über die Kampfgeschwindigkeit; Multiplikatoren sind Prestige-Pacing-Hebel, kein Selbstzweck.
- **Kosten steigen mit dem Besitz, nicht mit dem Einkommen:** Preise auf der Meta-Ebene hängen an der **Zahl der bisherigen Käufe**, nicht an einem festen Betrag. Sonst öffnet sich mit steigendem Ertrag die Schere und die Entscheidung löst sich auf – dieselbe Inflationsfalle, die Gil erledigt hat. Zusammen mit dem gedeckelten Boost pro Stufe (`prestige-reunion.md`) hält das die Exklusivität.
- **Deterministisch & dosiert:** kein RNG, kontrollierter Zufluss (Knappheit schützt Entscheidungen).
- **MP ist eine Kampf-Ressource, keine Ökonomie-Währung** (separat, `kampf-analyse-shock.md`). **Revidiert:** MP wächst seit dem ersten Playtest **nicht mehr im Kampf** nach – es ist ein Budget pro Kampf, das sich nur zwischen den Kämpfen füllt (Sieg-Erholung + Gasthaus, `feinspec-kapitel1.md` §3.5). Damit wird MP zur echten Vorrats-Entscheidung: In einer leichten Zone nicht auszugeben, ist selbst ein Zug.
- **Zeit ist die dritte Kostenart – neben EXP und Gil.** Zeitstrafe bei Niederlage und Gasthaus-Aufenthalt kosten ausschließlich Zeit. Das ist bewusst so gewählt: Zeitkosten können nie in einen Deadlock laufen (im Gegensatz zu einem Gil-Preis, den man sich nicht leisten kann) und sind mit dem Idle-Charakter des Spiels konsistent.

## 1a. EXP-Ertrag: Dämpfung über Level × Zone (neu, 30.07.2026)

**Befund:** Im Playtest war reines Idle die *stärkste* Spielweise. Man farmt eine niedrige Zone, in der man massiv überlevelt ist, und der Kapitel-Boss fällt irgendwann von selbst. Damit ist die **Zonen-Rückkehr von der Notausgangs- zur Optimalstrategie geworden** – dieselbe Krankheit wie die Offline-Projektion am 24.07.: das unbeteiligteste Spiel ist das beste.

**Die Ursache ist die Rate, nicht die Menge.** Der EXP-Bedarf wächst mit `1,22^(L-1)`, der Ertrag pro Kill nur mit `g^(zone-1)` (g = 1,07) – Leveln müsste sich also *verlangsamen*. Was es umdreht, ist die **Kill-Zeit**: In einer alten Zone ist die Party massiv überlevelt, ein Kill dauert Bruchteile, und EXP **pro Sekunde** ist dort höher als an der Front.

**Regel:** Der EXP-Ertrag einer Zone wird gedämpft, sobald das **Gruppenlevel über dem erwarteten Level dieser Zone** liegt. Nie auf null.

**Warum Level × Zone und nicht Abstand zur Front:** Ein Taper nach Abstand zu `maxZoneReached` verschiebt nur das Fenster mit – wer Zone 7 erreicht hat, farmt eben Zone 5, und die ist bei seinem Level längst trivial. Der Exploit wandert, er verschwindet nicht. Level × Zone ist **absolut** statt relativ, `maxZoneReached` kommt in der Formel gar nicht vor (eine Regel weniger), und die Reunion setzt die Dämpfung durch den Level-Reset automatisch zurück.

**Kurvenform ist Teil der Anforderung, nicht nur die Existenz der Dämpfung.** Sie muss von zwei Seiten klemmen:

- **nahe Überlevelung (~+2–3 Level über Erwartung): kaum gedämpft.** Sonst hat der schwache Spieler keinen bezahlbaren Weg über sein Gate – und genau den schützt Leitplanke A3. Das Playtest-Verhalten „ein bis zwei Zonen zurück, dann geht es" ist der **legitime** Gebrauch des Ventils und muss billig bleiben.
- **weite Überlevelung: brutal gedämpft.** Sonst fällt der Kapitel-Boss wieder in einer Stunde blindem Idle.

Also **kein** gleichmäßiger Abfall ab dem ersten Level über Erwartung, sondern ein **Plateau mit anschließendem Sturz**.

⚠️ **Offen und messpflichtig:** Ob „Plateau breit genug für den schwachen Spieler" und „Sturz steil genug gegen Idle-Overpowern" gleichzeitig erreichbar sind, ist **nicht** gesetzt. Das ist der erste Prüfpunkt der Umsetzung.
⚠️ **Zweites Risiko:** Der EXP-Bedarf steigt bereits exponentiell; eine zusätzliche Ertragssenkung **kompoundiert** und kann Progression zu Schlamm machen.
⚠️ **Drittes Risiko:** „Erwartetes Level je Zone" ist aus der Zonen-Kurve **abzuleiten**, nicht als Tabelle zu pflegen – sonst bricht es bei jeder Balance-Änderung.

## 2. Erster Zyklus (bis zur 1. Reunion)

Aktiv ist nur **EXP** (plus **MP** als Kampf-Ressource). **AP + Materia-Prestige** kommen ab **Kapitel 2**; **Reunion-Essenz** ab der **1. Reunion**. Die Ökonomie eskaliert also gestaffelt mit den Systemen.

**Konsequenz der Gil-Streichung:** EXP ist damit die **einzige** Run-Währung. Die Ertragskurve ist nicht mehr eine von zwei Ökonomien, sondern *die* Ökonomie – sie richtig zu haben wird wichtiger, nicht unwichtiger.

## 3. Zahlen-Handling (technische Leitplanke)

- **Skalierbare Zahldarstellung von Tag 1** (BigNumber/eigene Notation) – gegen ungenaue Float-Speicherung und „tote Zahlen" bei großen Werten (Anti-Pattern #10).
- Zähler laufen **glatt/kontinuierlich** (keine ungleichmäßig springenden Werte).

## 4. Aktiv / Offline

**Offline-Progress ist stillgelegt** (Playtest-Befund: Er war schneller als aktives Spiel und damit eine Umkehrung von Anti-Pattern #5). Es gibt derzeit **nur eine Ökonomie** – die aktive. Begründung und die Richtung für eine spätere Wiedereinführung als *aufladbarer Boost* stehen in `niederlage-offline.md` §4.

Die unbegrenzte EXP-Quelle ist stattdessen die **Zonen-Rückkehr**: Jede geschaffte Zone ist frei wiederholbar und zahlt aus – **gedämpft nach Level × Zone** (§1a). Der Zufluss ist durch **Zeit** begrenzt, nicht durch Fortschritt; die Dämpfung sorgt dafür, dass Zeit allein nicht die beste Strategie ist.

---

## Offene Detailfragen (Playtest)

- Ertrags-/Kostenkurven je Währung. **Das Aktiv-/Offline-Verhältnis entfällt vorerst** (nur noch eine Ökonomie).
- **Kurvenform der EXP-Dämpfung** (§1a): Plateaubreite und Sturzsteilheit. Der kritische Punkt – beide Anforderungen könnten unvereinbar sein.
- ~~Zweiter Gil-Sink fehlt.~~ **Erledigt durch Streichung von Gil** (s. o.). Die Frage war zweimal dokumentiert und nie gelöst; sie war kein Balance-Detail, sondern das Symptom einer Währung, die keine Entscheidung tragen kann.
- Reunion-Essenz: Ertragskurve und Reihenfolge der Sinks (Gambits/Boni/Slots/Typen/Roster).
- Ab welcher Größenordnung greift welche Zahl-Notation.

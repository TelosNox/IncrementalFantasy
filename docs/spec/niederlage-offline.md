# Niederlage, Heilung & Offline-Modell

**Status:** Richtung aus den bisherigen Entscheidungen abgeleitet; Zahlen → **Playtest**.
**Rahmen:** `../03_Konzept_Gerüst.md`, §12 & §13 (verbindliche Richtung).
**Prüfinstanz:** `../02_Leitfaden_Kernmechaniken.md`.

## Schnittstellen zu anderen Systemen

- **Kampf** (`kampf-analyse-shock.md`): telegrafierte Gegner-Aktionen geben die Chance, Niederlage zu verhindern.
- **Materia/Gambits** (`materia.md`, `gambits.md`): Heilung & defensive Sets machen Niederlage vermeidbar.
- **Gegner** (`gegner-encounter.md`): Nuker/Bosse sind die eigentlichen Niederlage-Quellen.
- **Ökonomie** (`oekonomie-waehrungen.md`): Heilung kostet Zeit statt Gil; EXP/Gil fließen über die Zonen-Rückkehr unbegrenzt.
- **Progression** (`progression-regionen.md`): Zonen-Rückkehr ist Teil des Aktions-Repertoires; Gates bleiben die Wände.

---

> **Revidiert nach dem ersten Playtest (Kapitel 1).** Die Erstfassung dieses Dokuments enthielt den schwersten Design-Fehler des Projekts: Sie beschrieb einen Retry auf derselben Zone bei „frischer Party" und nannte wiederholte Niederlagen ein Signal, „grinden zu gehen" – ohne dass es einen Ort zum Grinden gab. In einer deterministischen Engine ergibt das einen **permanenten Totalstopp** statt eines Ventils. Zahlen und Herleitung: `feinspec-kapitel1.md` §3.8.

## 1. Niederlage-Modell

- **Kein Game-Over / Permadeath.** Niederlage = der Encounter ist verloren.
- **Folge:** eine **milde Zeitstrafe**, dann automatischer Gasthaus-Aufenthalt (§2), dann Retry derselben Zone. **Kein Währungs-/Zonen-Verlust** (Ventil-Prinzip #1).
- **Die Niederlage heilt nicht.** Der HP/MP-Stand der Party bleibt unverändert. Andernfalls wäre der Tod die schnellste Heilquelle des Spiels und die Zeitstrafe faktisch eine Belohnung – eine degenerierte Strategie direkt im Fundament.
- **Zweck:** macht HP/DEF, Heilung und defensive Gambit-Sets sinnvoll – sonst dominiert reines Angriffs-Spiel (gegen #5).
- **Deterministisch:** ohne RNG-Miss/Dodge ist eine Niederlage ein **lesbares Signal** „Build/Stats reichen (noch) nicht", kein Pech. **Genau deshalb braucht sie zwingend ein Ventil (§3):** Ohne Zufall wiederholt sich eine verlorene Zone identisch, beliebig oft. Determinismus und „einfach nochmal probieren" schließen einander aus.
- **Counterplay:** telegrafierte Gegner-Groß-Attacken erlauben, die Niederlage aktiv oder per defensivem Gambit-Set abzuwenden (Verteidigen/Heilen/Unterdrücken).

## 2. Heilung – zwei getrennte Kanäle

**(a) Im Kampf:** über **Air is...' Spezial**, später **Heil-/Defensiv-Materia + defensive Gambit-Sets** – kein separates System. **MP-Kosten** koppeln Heilung an die MP-Ökonomie und machen defensives Spiel zur Entscheidung. Da MP seit der Revision **nicht mehr im Kampf nachwächst** (`feinspec-kapitel1.md` §3.5), hat In-Kampf-Heilung eine harte Obergrenze pro Encounter – das ist der Kern dessen, was Bosskämpfe zu Ausdauer-Rätseln macht.

**(b) Zwischen den Kämpfen: das Gasthaus.** HP und MP tragen über alle Kämpfe hinweg über; pro Sieg kommen 25 % des Maximums zurück. Wer mehr braucht, geht ins Gasthaus:

- **Vorab anmeldbar** („nach diesem Kampf ins Gasthaus"), greift nie mitten im Kampf. Bei Niederlage automatisch aktiv. Das folgt dem Steuerungsprinzip aus `gambits.md` §3 – man stellt vorher ein, statt spontan einzugreifen.
- **Kostet ausschließlich Zeit, kein Gil.** Ein Preis in Gil kann in einen Deadlock laufen (wenig HP + kein Gil = kein Ausweg); Zeit kann das nie.
- **Pauschale Totzeit, dann Erholung** – HP und MP gleichzeitig. Die Totzeit ist der Design-Kern: Sie macht häufiges kleines Nachheilen unwirtschaftlich und belohnt „weiterkämpfen, bis man es wirklich braucht".
- **Nicht zu gut lösen:** Sustain-Ausbau (MP-Regen, HP-Absorb) ist die designierte Aufgabe der Kapitel-2-Materia (`materia.md` §2/§7). Kapitel 1 gibt bewusst nur den Grundwert plus Gasthaus.

## 3. Zonen-Rückkehr – das eigentliche Ventil

**Jede bereits geschaffte Zone ist jederzeit frei anwählbar, vor und zurück.** Dort gewonnene Kämpfe zahlen EXP/Gil regulär und unbegrenzt aus; die höchste je erreichte Zone bleibt gespeichert, Zurückgehen verliert nichts.

- Das ist das Genre-Standardmuster „push bis zur Wand, dann farmen" (Vorbild Trimps, `../02_Leitfaden_Kernmechaniken.md` §1 D2).
- Es macht den **Skill↔Zeit-Tausch** aus `gambits.md` §4 erstmals einlösbar: manuell gut spielen **oder** eine Zone zurück und stärker werden. Vorher gab es nur den ersten Weg – und wer ihn nicht ging, stand endgültig.
- Es trägt zugleich den Vorbereitungs-Loop, den der Ressourcen-Übertrag erzeugt: In einer sicheren Zone bankt man MP (und heilt nebenbei über die Sieg-Erholung), um an der Wand ausgeben zu können.
- **Bewusst manuell.** Ein automatischer Rückfall bei Niederlage ist als spätere Komfortstufe denkbar, aber erst muss die Handlung existieren, bevor man sie automatisiert (Anti-Pattern #2).

**Lesbarkeit ist Teil der Mechanik:** Ein Ventil, das der Spieler nicht bemerkt, ist keins. Der HP-Verlauf ist dafür das eingebaute Signal (`feinspec-kapitel1.md` §3.8d) – sinkt die Leiste über mehrere Kämpfe, drückt man zu hart. Ob das reicht oder die Zonen-Auswahl zusätzlich markieren muss, wo man sicher durchkommt, ist offen.

## 4. Offline-Modell – stillgelegt

**Der Offline-Progress ist entfernt, nicht getunt.** Begründung, Befund und die Richtung für eine spätere Wiedereinführung stehen vollständig in `feinspec-kapitel1.md` §3.8e. Kurzfassung:

- Die Offline-Projektion rechnete wiederholte Durchläufe derselben Zone hoch und war damit unbeabsichtigt die **einzige funktionierende Implementierung des Ventils (§3)** – unsichtbar, unverdient und nur für Spieler mit geschlossenem Tab. Im Playtest kam ein abwesender Spieler an einem Gate vorbei, an dem ein anwesender feststeckte: eine glatte Umkehrung von Anti-Pattern #5.
- Zwei gekoppelte Ökonomien lassen sich nicht gleichzeitig justieren (`../02_Leitfaden_Kernmechaniken.md` §1 A6 nennt das als Schwäche). Erst wird der Kern-Loop mit Ventil neu balanciert, dann kommt Offline bewusst zurück.
- **„Idle" bleibt, „offline" geht:** Bei geöffneter Anwendung läuft das Spiel weiterhin vollständig selbst. Entfernt ist ausschließlich der Fortschritt bei geschlossener Anwendung.

**Richtung für die Wiedereinführung (noch nicht spezifiziert):** statt passivem Ertrag ein **Boost, der sich in der Abwesenheit auflädt und nach der Rückkehr eine Zeit lang aktiv bleibt**. Das wandelt Abwesenheit in *aktiven* Spielwert um, statt Anwesenheit zu entwerten – die vom Leitfaden §3 empfohlene Auflösung der Spannung A2 ⟷ A6. Leitplanke: Der Boost darf nie so stark sein, dass „vor einer Wand erst mal offline gehen" die optimale Strategie wird.

---

## Offene Detailfragen (Playtest)

- Höhe/Dauer der Zeitstrafe **im Zusammenspiel mit der Gasthaus-Totzeit** – beide Zeitkosten wirken jetzt hintereinander und sind gemeinsam zu bewerten. Ohne Offline-Progress ist das echte Wartezeit am Bildschirm.
- Gasthaus-Rate und Totzeit: das Verhältnis entscheidet, ob „durchhalten" oder „heilen" die klügere Wahl ist.
- Braucht die Zonen-Auswahl eine Empfehlung/Markierung, oder reicht das HP-Signal?
- Ausgestaltung des Offline-Boosts (Aufladekurve, Wirkdauer, Deckel) – erst nach der Neu-Balancierung des Kern-Loops.

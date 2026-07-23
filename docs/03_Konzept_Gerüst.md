# Konzept-Rahmengerüst: IncrementalFantasy

**Projekt:** IncrementalFantasy – parodistisches Incremental Game in Anlehnung an Final Fantasy 7
**Dokumenttyp:** Rahmengerüst (Iteration 3) – legt die Richtung für alle Aspekte fest, bewusst **ohne Zahlen/Detailwerte**
**Stand:** 20.07.2026
**Grundlage:** `01_Recherche_Incremental_Games.md` (Recherche) und `02_Leitfaden_Kernmechaniken.md` (Mechanik-Leitfaden, verbindlich lt. `CLAUDE.md`)

> **Zweck:** Diese Datei ist der abgestimmte Rahmen, aus dem wir anschließend einzelne Systeme im Detail (inkl. Zahlen, Kurven, Balancing) spezifizieren. Jeder Aspekt hat eine klare Richtung; offene Detailfragen sind am Ende gesammelt. Mechanik-Kürzel (A1, C2, §2 …) verweisen auf den Leitfaden.

---

## 1. Vision in einem Satz

Ein **Idle-Auto-Battler-RPG**, in dem eine Parodie-Party sich durch Monster- und Boss-Regionen kämpft, dessen strategische Tiefe aus **Materia** (Build) und **Gambits** (Automatik) kommt und dessen Kampf durch **Analyse & Shock** Textur bekommt – gerahmt von humorvoller FF7-Parodie als USP.

**Rahmenentscheidungen (fix):** Keine Monetarisierung außer optional einmaligem Kaufpreis; keine In-Game-Käufe. Charaktere sind eigenständige Parodie-Figuren, keine Kopien.

---

## 2. Kern-Loop (A1 + D2)

Die Party kämpft **automatisch** gegen Monsterwellen. Siege liefern drei Basis-Ressourcen: **EXP** (Charakter-Level), **AP** (Materia-Level) und **Gil** (Ausrüstung/Slots). Monster-Zonen sind die messbare Progression; **Bosse sind Meilenstein-Gates** (C2), die die nächste Region und die nächste Systemstufe freischalten.

Der Kampf ist nie bloßer Zahlenvergleich (das wäre die D2-Schwäche): Seine Textur kommt aus Analyse/Shock, Materia-Builds und Limit-Timing.

---

## 3. Progressions-Struktur: zwei Achsen

Das Rückgrat des Spiels sind zwei sich ergänzende Progressions-Achsen. Das ersetzt jede „Disc"-Struktur.

**Horizontal – Regionen (vertiefen den Kampf).**
Die Welt gliedert sich in Parodie-Regionen, je eine Folge von Zonen mit Boss-Gate am Ende. Entlang der Regionen wird das Kampfsystem gestaffelt eingeführt (Feature-Rampup, C1/C2, gegen Anti-Pattern #4 „Komplexität ohne Onboarding"): erst Basis-Angriffe + Limits, dann Analyse/Bestiarium, dann Shock, später Schockanfälligkeit/Resistenzen.

**Vertikal – Reunion (vertieft die Automatik).**
Das account-weite Prestige („Reunion", thematisch Lebensstrom/Wiedergeburt) schaltet **schrittweise die Gambit-Automatik** frei und verstärkt sie. Von Reset zu Reset wird das Spiel klüger-idle und trägt weiter.

Diese Zwei-Achsigkeit ist bewusst gewählt: horizontale Tiefe (Kampf) und vertikale Bequemlichkeit (Automatik) wachsen getrennt, sodass beide dosiert bleiben.

---

## 4. Kampfsystem (der horizontale Rampup)

- **Auto-Attack (immer aktiv):** Die Party greift von Beginn an selbstständig an – das Idle-Grundversprechen (A6) ist ab Minute 1 da.
- **Limits (aktiver Hook, A2):** Jede Figur lädt im Kampf eine Leiste; wer aktiv spielt, zündet die Limit-Ultimate im richtigen Moment. Belohnt aktives Spiel, ohne Idle zu entwerten (§3). (Später optional per Gambit automatisierbar.)
- **Analyse & Bestiarium (C2 + E2 + F2):** Jede Gegner-Art wird beim ersten Sieg **blind** besiegt und ist danach automatisch analysiert (Eintrag ins Bestiarium). Optional/parallel **aktive Analyse** als Abkürzung für aktive Spieler. Kein Chore, weil pro Art nur einmal nötig. Bestiariums-Wissen bleibt über Reunion erhalten.
- **Shock:** Schwächen ausnutzen baut Shock auf → Shock-Fenster für erhöhten Schaden/Limits. Funktioniert auch idle (sobald Schwäche bekannt, nutzt die Auto-Battle sie), aktiv nur besser.
- **Resistenzen (spätes Spiel):** Gegner mit Resistenzen erzwingen Build-/Set-Wechsel → reaktiviert Materia- und Gambit-Entscheidungen, hält das Endgame frisch (gegen Monotonie).

---

## 5. Automatisierung: Gambits (der vertikale Rampup, A5)

Über der stumpfen Auto-Attack liegt die **strategische** Automatik nach FF12-Vorbild:

- **Prioritäten & Konditionen** („WENN Gegner feueranfällig DANN Feuer-Materia", „WENN HP < Schwelle DANN heilen"). Weakness-basierte Bedingungen werden erst nutzbar, wenn der Gegner analysiert ist – schließt den Synergie-Loop (§2).
- **Umschaltbare Sets** (offensiv/defensiv), die sich auch **automatisch nach Gegner-Art** wechseln lassen – kein ständiges Herumschalten.
- **Erwerb & Ausbau über Reunion:** mehr Slots, mehr Bedingungstypen, schnellere Reaktion. Automatisierung ist damit *verdiente* Prestige-Belohnung (löst Anti-Pattern #2 „zu früh automatisieren" von selbst).
- **Ab-Werk-Presets:** funktionierende Standard-Sets, damit Casuals sofort spielen; Tiefe optional (Auflösung „Tiefe ⟷ Zugänglichkeit", §3, gegen D1/D4-Spreadsheet-Gefahr).
- **Steuerung je Figur:** Auto/Manual ist **pro Figur** umschaltbar – das Team kann automatisch kämpfen, während eine Figur gezielt manuell spielt (z. B. Heilung/Zauber zur Schwäche). Manuelle Auswahl läuft im **Wait-Modus** (die gesamte Kampfuhr pausiert) über ein **Aktions-Popup** am Charakter. Die Steuer-UI erscheint gestaffelt (Schalter ab erster Automatik, Materia-Kategorie ab Materia; vor der ersten Automatik-Freischaltung ist auch kein Modus-Text sichtbar – sonst spoilert er die Automatik). Details: `spec/gambits.md`, `spec/ui-layout.md`.

---

## 6. Materia-System (das Build-Herzstück, C1 + §2)

**Leitprinzip:** Knappheit ist der Entscheidungsmotor. Ohne Knappheit an Slots/Kopien verschwinden Entscheidungen und damit die Tiefe.

- **Slots:** feste, knappe Anzahl; wächst langsam. Zwei Arten: **Einzel-Slots** und seltenere **verbundene Slot-Paare** (Support-Materia modifiziert die Nachbarin → Synergie-Engine §2, „nichts wird obsolet").
- **AP-Regel:** AP fließt auf **alle angelegten** Materia gleichzeitig. Volle Materia bekommt kein AP mehr (bleibt aber für ihren *Effekt* angelegt), die anderen schon. Keine manuelle Zuteilung → idle-freundlich.
- **Leveln:** innerhalb einer Stufe **frei** über AP bis zu einem **gegateten Cap** (C2). Ränge schalten **neue Teil-Fähigkeiten** frei (Feuer → Feura → Feuga), nicht nur größere Zahlen – Mini-Feature-Kaskade.
- **Cap-Reset (Mikro-Prestige, B1):** Am Cap kann die Materia gegen **Materia-Prestige-Währung** auf 0 zurückgesetzt werden (Ernte, kein Verlust → gegen Anti-Pattern #6).
- **Evolution (+1, +2, …):** über **gemeinsame** Materia-Prestige-Punkte, aber **gegated**: Evolution einer Stufe erfordert, dass die aktuelle Stufe **mindestens 1× am Cap resettet** wurde. Zustand wird als **Binär-Marker** angezeigt (Farbrand/Decorator – kein Reset-Zähler nötig). **Skalierende Kosten** (+1 < +2 < …) verhindern billiges Durch-Evolven einer einzigen Meta-Materia und halten die Build-Vielfalt lebendig.
- **Persistenz über Reunion:** Materia-**Typen und Evolutionen bleiben**; **Level und Slots werden zurückgesetzt**.

---

## 7. Ausrüstung & Slots (A4, Gil-Sink)

- **Ausrüstung liefert die Slots.** Ein Ausrüstungs-Item je Figur (die „Waffe") trägt Slots und verbundene Paare; bessere Ausrüstung = mehr/besser verbundene Slots.
- **Bewusste Trade-offs statt „immer das Neueste":** Stat-Verteilung (Rohschaden vs. Verteidigung) und die **Slot-Layout-Wahl** (verbundene Paare vs. Breite, s. `spec/ausruestung-gil.md`) – gegen A3-Schwäche „kauf das Teuerste". Keine Ökonomie-Multiplikatoren auf Ausrüstung (die leben in der Meta-Ebene).
- **Waffen-Mods** als Feinschliff: Slot hinzufügen, zwei Einzel-Slots zu einem Paar verbinden, Element-Affinität geben.
- **Pro Charakter** eigene Ausrüstung → Party-Building (D3), gekoppelt an die Gambit-Sets.
- **Gil-Rolle & Reunion:** Gil finanziert Ausrüstung/Slot-Freischaltung. Weil Slots/Ausrüstung bei jeder Reunion zurückgesetzt werden, bleibt **Gil in jedem Zyklus neu relevant** – keine tote Währung.

---

## 8. Charaktere & Party

**Unterscheidung der Fähigkeits-Ebenen (Design-Entscheidung):**

- **Materia** – modulare, tauschbare Fähigkeiten (Build-Ebene).
- **Skills** – charakter-*eigene*, permanente Fähigkeiten, freigeschaltet über Regionen/Achievements; geben Identität jenseits der Materia.
- **Limit** – die Signature-Ultimate jeder Figur (aktiver Hook).
- **Affinität** – angeborener Element-/Rollen-Hang, der Builds anschubst.

**Roster (Parodie-Figuren, erinnern an FF7, keine Kopien). Rollen vorläufig:**

| Figur | Vorbild | Darstellung | Tendenz-Rolle |
|-------|---------|-------------|---------------|
| **Claude** | Cloud Strife | Wolke mit riesigem Schwert | Ausgewogener Nahkampf-DPS |
| **Barrel** | Barret | Holzfass mit Maschinengewehr-Arm | Fernkampf / Tank |
| **Tofa** | Tifa | Tofublock mit Boxhandschuhen | Nahkampf-Brawler, schneller Shock-Aufbau |
| **Arris** | Aerith | Netzwerkrouter mit Blümchen-Aufdruck und Schirm | Heilung / Support / Magie |

**Party-Modell:** Im Hauptmodus tritt die **volle Party** an. Start nur mit Claude, weitere Figuren stoßen **regionsweise** hinzu. Freigeschaltete Charaktere bleiben über Reunion erhalten (nur ihre Level werden zurückgesetzt).

**Challenges (E1):** Läufe mit selbstauferlegter Beschränkung (Solo oder Paar), Vorbild im neueren Original. Recyceln Content mit frischer Würze, rein optional für Enthusiasten. Zusätzlich **Freischaltungs-Quelle** (s. §10).

---

## 9. Prestige – zwei Ebenen (B1/B2)

**Mikro – Materia-Cap-Reset** (§6): häufig, granular; Ernte von Materia-Prestige-Währung; Voraussetzung für Evolution.

**Makro – Reunion** (selten, groß; thematisch Lebensstrom/Wiedergeburt):

- **Zurückgesetzt:** Zonen-Fortschritt, Charakter-Level, Materia-Level und -Slots, Ausrüstung.
- **Erhalten:** Materia-Typen & -Evolutionen, kristallisierte Passiv-Boni, freigeschaltete Charaktere, gelernte Waffen-Spezialfähigkeiten, Bestiarium/Analysen, erworbene Gambit-Fähigkeiten.
- **Ertrag – Reunion-Essenz:** schaltet **Gambits** frei/aus, kauft permanente Boni, neue Materia-Typen und Roster-Erweiterungen.

Zwei Ebenen mit klar unterschiedlicher Kadenz = gesunde Verschachtelung (B2), kein Overkill.

---

## 10. Freischaltungs-Achsen (drei Quellen)

Neue Systeme, Materia und Skills kommen aus drei bewusst getrennten Quellen:

1. **Regionen** (horizontal) – Kampfsystem-Stufen und neue Charaktere.
2. **Reunion** (vertikal) – Automatik (Gambits) und permanente Meta-Macht.
3. **Achievements/Challenges** (Entdeckung) – z. B. „erster Shock" → bestimmte Materia/Skill (E2 an Belohnung gekoppelt, F2 Entdeckungsfreude).

**Wächter:** Achievement-Unlocks bleiben *parallel/Bonus*, nie der einzige Weg zu progressionskritischer Macht, und werden in einer sichtbaren Zielliste geführt (Lesbarkeit, gegen blindes Suchen).

---

## 11. Fortschritts-Ökonomie: Währungen

Fünf Währungen, jede mit **genau einer** Progressions-Achse (Absicherung gegen Wildwuchs, Anti-Pattern #9):

| Währung | Quelle | Verwendung | Ebene |
|---------|--------|------------|-------|
| **EXP** | Kämpfe | Charakter-Level | Basis |
| **AP** | Kämpfe (auto auf alle Materia) | Materia-Level | Basis |
| **Gil** | Kämpfe | Ausrüstung / Slot-Freischaltung | Basis (je Zyklus neu relevant) |
| **Materia-Prestige-Währung** | Materia-Cap-Reset | Materia-Evolution | Mikro-Prestige |
| **Reunion-Essenz** | Reunion | Gambits, permanente Boni, Materia-Typen, Roster | Makro-Prestige |

---

## 12. Niederlage & Heilung

- **Niederlage ist möglich:** Fällt die Party, gibt es eine **milde Zeitstrafe**, dann Neustart an gleicher Stelle mit zurückgesetztem Kampf. **Kein** Währungs-/Fortschrittsverlust (bleibt im Ventil-Prinzip, gegen Anti-Pattern #1).
- **Warum wichtig:** Erst dadurch werden **Heilung und defensive Gambit-Sets sinnvoll** – sonst dominiert reines Angriffs-Spiel (gegen Anti-Pattern #5 „dominante Einseitigkeit").
- **Heilung** lebt in **Heil-/Defensiv-Materia** und defensiven Gambit-Bedingungen – kein separates System nötig.

---

## 13. Offline-Modell (A6)

Offline kämpft die Party in der **aktuellen** Zone weiter (kein Überspringen ungeschlagener Gates) und sammelt EXP/AP/Gil mit gedeckelter „Welcome-back"-Ernte, etwas unter Aktiv-Rate. Aktiv-Spiel bringt **Optimierung** (Limit-Timing, Live-Analyse), keine rohen Multiplikatoren – hält das Idle-Versprechen, ohne Aktiv-Spiel zu entwerten (§3).

---

## 14. Sekundär / bewusst zurückgestellt

Diese Bausteine sind eingeplant, aber **nicht Teil des Kern-Loops** und werden später positioniert:

- **Summons/Esper:** seltene, mächtige Cooldown-Fähigkeiten (Boss-/Regions-Belohnung).
- **Chocobos:** optionaler Offline-Sub-Loop – nur, wenn er sich automatisieren lässt und den Fokus nicht zerstört (D4-Wächter).
- **Superboss-Endgame:** optionale „Weapon"-artige Superbosse *nach* dem Story-Ende (löst Spannung „definiertes Ende ⟷ endloses Endgame", §3).
- **Secrets/Nebenquests:** Entdeckungs- und Challenge-Content (E1/E2/F2).

---

## 15. Stehende Leitplanken (Dauer-Prüfliste)

- **Lesbarkeit zuerst:** jedes System braucht eine lesbare Oberfläche (Binär-Marker statt Zähler ist das Musterbeispiel) – Dauer-Schutz gegen die D1/D4-Spreadsheet-Gefahr.
- **Gestaffelter Rollout:** nie alles auf einmal zeigen; Systeme entlang der drei Freischaltungs-Achsen einführen.
- **Ventil-Prinzip:** an jeder Wand fließt weiter etwas (AP/Gil/EXP) – Fortschritt stoppt nie ganz.
- **Automatik ist verdient:** stumpfe Auto-Attack sofort, strategische Gambits über Reunion.
- **Beide Playstyles tragfähig:** aktiv (Limits, Live-Analyse) und idle müssen sich lohnen.
- **Währungs-Disziplin:** bei fünf Währungen bleiben, jede mit klarer Einzelrolle.
- **Knappheit schützen:** Slots/Kopien knapp halten – sonst sterben die Entscheidungen.
- **Humor als Würze, nicht als Krücke:** Parodie-Ton auf soliden Mechaniken.

---

## 16. Offene Detailfragen (nächste Iterationen, dann mit Zahlen)

- Slot-Wachstumskurve (wie viele Slots wann – bestimmt die Entscheidungsdichte).
- AP-Verteilung: volle Menge pro Materia vs. geteilter Pool (Balance-Hebel breite vs. fokussierte Builds).
- Reunion-Auslöser: rein spielergewählt ab Meilenstein vs. weiche Schwelle.
- Rollen-/Affinitäts-Feinbild je Charakter; Skill-Listen pro Figur.
- Konkrete Region-Abfolge und welches System an welchem Gate aufgeht.
- Balancing/Zahlen für Level-Caps, Evolutionskosten, Zeitstrafe, Offline-Deckel.

> Grundlage und verbindliche Prüfinstanz für alle folgenden Design-Schritte bleibt `02_Leitfaden_Kernmechaniken.md`.

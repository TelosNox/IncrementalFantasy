# Ausrüstung & Slots

> **Der Dateiname ist Altlast.** Gil ist am 30.07.2026 gestrichen worden (`oekonomie-waehrungen.md`, Abschnitt „Gil ist gestrichen"). Die Datei heißt weiter `ausruestung-gil.md`, um die Querverweise in zehn anderen Dokumenten nicht in einem Zug umzuschreiben; die Umbenennung ist ein eigener, rein mechanischer Schritt.

**Status:** In Arbeit – Rolle & Slot-Prinzip festgelegt; Zahlen → **Playtest**.
**Rahmen:** `../03_Konzept_Gerüst.md`, §7 (verbindliche Richtung).
**Prüfinstanz:** `../02_Leitfaden_Kernmechaniken.md`.

## Schnittstellen zu anderen Systemen

- **Stats** (`stats-kampfwerte.md`): Stat-**Wachstum** liegt vollständig beim Gruppenlevel (§4) – das Item liefert seit dem 30.07.2026 keine gekauften Stat-Tiers mehr. Ab Kapitel 2 wirkt es über Materia in den Slots.
- **Charaktere** (`charaktere-party.md`): die Spezialfähigkeit hängt **nicht mehr** am Item – sie wird über einen Zonen-Trigger gelernt und ist permanent.
- **Materia** (`materia.md`): das Item trägt die Materia-Slots (ab Kapitel 2).
- **Prestige** (`prestige-reunion.md`): Slots werden zurückgesetzt und über das **Reunion-Upgrade-Menü** (Essenz) neu freigeschaltet.

---

## 0. Was die Waffe seit dem 30.07.2026 *nicht* mehr ist

Drei Streichungen, alle aus derselben Konzept-Session:

- **Keine Gil-Käufe.** Die Währung existiert nicht mehr (`oekonomie-waehrungen.md`).
- **Keine Tier-Leiter.** `atk ×(1+0,10·tier)` viermal hintereinander war das Anti-Pattern „dasselbe Upgrade kaufen und aufs nächste warten". Das **ATK-Wachstum liegt vollständig beim Gruppenlevel** (`stats-kampfwerte.md` §4).
- **Keine Spezial-Freischaltung über das Item.** Der Special wird über einen Zonen-Trigger gelernt und ist danach permanent (`charaktere-party.md`). Vorher hing er an `weaponTier >= 1` – was das Versprechen „Skill bleibt bei Reunion erhalten" faktisch gebrochen hat, weil das Tier bei jeder Reunion auf 0 fiel.

**Keine Waffen-Ausrichtungen** (offensiv/defensiv/SPD-lastig) – ausdrücklich verworfen. Die Spezialfähigkeit ist die **Rollen-Signatur** der Figur; eine Waffe, die Air is… nach ATK biegt, schleift genau die Diversität, die die Figuren unterscheidet. *Auch die mildere Variante (Varianten **innerhalb** der Rolle, z. B. Air is… heil- vs. angriffsmagielastig) ist verworfen: 4 Figuren × 2 Varianten ist Balancing-Aufwand für einen Effekt, den Materia ab Kapitel 2 besser liefert.*

**Was bleibt:** Die Waffe ist ab Kapitel 2 der **Träger der Materia-Slots** und ihres A/B-Layouts. In Kapitel 1 hat sie damit **keine Funktion** und erscheint nicht als System.

## 1. Ein Ausrüstungs-Item je Figur (die „Waffe")

**Entscheidung: ein einzelnes Item pro Figur** (statt Waffe + Rüstung getrennt). Das Item vereint:

- **Stats** (ATK/MAG/DEF/HP-Mix – ab Kapitel 2 über Slots/Materia, nicht über gekaufte Tiers),
- **Materia-Slots** (ab Kapitel 2).

**Warum ein Item statt Waffe/Rüstung:** Die getrennte Platzierung würde nur für wenige Kombos (Elementar, Zusatzeffekt) eine offensiv/defensiv-Wahl bedeuten; für die allermeisten Materia ist die Item-Art egal. Ein Einzel-Item hält es simpel, **ohne** eine echte Entscheidung zu verlieren — die Support-Materia-Wahl bleibt ohnehin nötig (s. §3).

## 2. Slot-Layout: zwei Varianten (verbunden vs. breit)

Ein Slot-Pool je Item, mit **genau zwei wählbaren Layouts** (keine Extreme):

- **Variante A – „Kombo":** alle möglichen Slot-Paare **verbunden**. Fördert Synergie/Support-Kombos.
- **Variante B – „Breite":** **ein Paar weniger verbunden**, dafür **1–2 zusätzliche lose Slots**. Fördert viele unabhängige Effekte.

**Wahl pro Item** (freier/günstiger Toggle) → Build-Entscheidung (Synergie-Tiefe vs. Breite), kein Item-Hunt. Skaliert über Tiers; A/B-Logik bleibt gleich. Lesbar, verzahnt mit der Synergie-Engine (§2), respektiert Knappheit.

## 3. Materia-Platzierung entfällt als Extra-Entscheidung

Da es nur ein Item gibt, wirkt eine Support-Kombo in **beiden Rollen zugleich**: z. B. **Elementar + Feuer** gibt Feuer-**Angriff und** Feuer-**Resistenz** gemeinsam (Kosten: ein verbundenes Paar). Die Entscheidung liegt damit in der **Support-Materia-Wahl + A/B-Layout**, nicht in „Waffe vs. Rüstung".

## 4. Was Ausrüstung unterscheidet (Trade-offs)

- **Stat-Verteilung** (offensiv- vs. defensiv-lastiges Item) und die **A/B-Slot-Wahl** sind die eigentlichen Entscheidungen.
- **Keine Ökonomie-Multiplikatoren auf Ausrüstung** (EXP-/AP-Rate leben in der Meta-Ebene) — kein Mandatory-Item.
- *(Optionaler späterer Feinschliff: Item-Mods — TBD, nur falls nötig.)*

## 5. Kapitel 1 (vor Materia) & Reunion

- **Kapitel 1:** Die Waffe hat **keine Funktion** (§0). Keine Slots (Materia ab Kapitel 2), keine Stats (Wachstum liegt am Gruppenlevel), keine Special-Freischaltung (Zonen-Trigger). Sie erscheint dem Spieler in Kapitel 1 nicht als System.
- **Reunion:** Slots werden zurückgesetzt und über das **Reunion-Upgrade-Menü** (Essenz) neu freigeschaltet – je System ein Milestone als Einstieg, danach freie Wahl (`prestige-reunion.md`). Die gelernte Spezialfähigkeit bleibt und steht ab Zone 1 zur Verfügung.

---

## Offene Detailfragen (Playtest)

- Slot-Zahlen je Tier; wie viele Paare je Item; genaue A/B-Differenz (1 vs. 2 Extra-Slots).
- Kosten/Reibung des A/B-Toggles (frei vs. günstig).
- Höhe der Stat-Boni; wie stark Items offensiv/defensiv leanen dürfen.
- Item-Mods: ja/nein und Umfang.

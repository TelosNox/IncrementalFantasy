# Ausrüstung, Slots & Gil

**Status:** In Arbeit – Rolle & Slot-Prinzip festgelegt; Zahlen → **Playtest**.
**Rahmen:** `../03_Konzept_Gerüst.md`, §7 (verbindliche Richtung).
**Prüfinstanz:** `../02_Leitfaden_Kernmechaniken.md`.

## Schnittstellen zu anderen Systemen

- **Stats** (`stats-kampfwerte.md`): das Item liefert Stat-Boni (ATK/MAG/DEF/HP, ggf. SPD).
- **Charaktere** (`charaktere-party.md`): das Item schaltet/verbessert die Spezialfähigkeit frei (Skill bleibt bei Reunion, Item-Kraft neu).
- **Materia** (`materia.md`): das Item trägt die Materia-Slots (ab Kapitel 2).
- **Gil** (`oekonomie-waehrungen.md`): finanziert Ausrüstung; Reset bei Reunion → Gil je Zyklus neu relevant.
- **Prestige** (`prestige-reunion.md`): Ausrüstung/Slots werden zurückgesetzt.

---

## 1. Ein Ausrüstungs-Item je Figur (die „Waffe")

**Entscheidung: ein einzelnes Item pro Figur** (statt Waffe + Rüstung getrennt). Das Item vereint:

- **Stats** (ATK/MAG/DEF/HP-Mix; Item-Varianten/Tiers können offensiv oder defensiv leanen),
- **Freischaltung/Verbesserung der Spezialfähigkeit**,
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
- **Keine Ökonomie-Multiplikatoren auf Ausrüstung** (Gil-/EXP-/AP-Rate leben in der Meta-Ebene) — kein Mandatory-Item.
- *(Optionaler späterer Feinschliff: Item-Mods — TBD, nur falls nötig.)*

## 5. Kapitel 1 (vor Materia) & Reunion

- **Kapitel 1:** noch keine Slots relevant (Materia ab Kapitel 2). Item = **Stats + Special-Freischaltung/-Verbesserung**; Gil kauft das Item. Der A/B-Entscheid wird erst mit Materia wirksam.
- **Reunion:** Item und Slots werden zurückgesetzt, Gil neu erspielt. Die gelernte Spezialfähigkeit bleibt.

---

## Offene Detailfragen (Playtest)

- Slot-Zahlen je Tier; wie viele Paare je Item; genaue A/B-Differenz (1 vs. 2 Extra-Slots).
- Kosten/Reibung des A/B-Toggles (frei vs. günstig).
- Höhe der Stat-Boni; wie stark Items offensiv/defensiv leanen dürfen.
- Item-Mods: ja/nein und Umfang.

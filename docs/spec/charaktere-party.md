# Charaktere & Party

**Status:** Stub – Detailspezifikation folgt.
**Rahmen:** `../03_Konzept_Gerüst.md`, §8 (verbindliche Richtung).
**Prüfinstanz:** `../02_Leitfaden_Kernmechaniken.md`.

## Roster (fix, Parodie – keine Kopien)

- **Claude** (Cloud) – Wolke mit riesigem Schwert – ausgewogener Nahkampf-DPS.
- **Barrel** (Barret) – Holzfass mit Maschinengewehr-Arm – Fernkampf / Tank.
- **Tofa** (Tifa) – Tofublock mit Boxhandschuhen – Nahkampf-Brawler, schneller Shock-Aufbau.
- **Arris** (Aerith) – Netzwerkrouter mit Blümchen-Aufdruck und Schirm – Heilung / Support / Magie.

## Waffen-Spezialfähigkeiten (Rollen-Signatur)

Jede Figur hat eine **über die Waffe freigeschaltete Spezialfähigkeit**, die ihre Rolle *vor* dem Materia-Build-System definiert. Kosten laufen **ausschließlich über MP** (kein Cooldown). **MP existiert von Anfang an, wird dem Spieler aber erst mit der ersten MP-Spezial sichtbar** (Region 1) und bleibt danach dauerhaft angezeigt (auch nach Reunion); der Attack-Refund-Loop trägt die Ressource.

| Figur | Spezialfähigkeit | Rolle |
|-------|------------------|-------|
| **Claude** | großer Einzelschaden | Damage |
| **Barrel** | Gegner unterdrücken (Gegner-ATB lädt langsamer / wird leicht reduziert) | Kontrolle |
| **Tofa** | verstärkt den Shock-Zustand | Shock-Enabler |
| **Arris** | heilt die Gruppe | Heilung |

Roster-Rhythmus: Region 1 Claude allein → Region 2 Barrel → Region 3 Tofa + Arris gleichzeitig (volle Gruppe).

**Bei Reunion:** die gelernte Spezialfähigkeit **bleibt erhalten** (permanenter Skill); nur die Waffe als Ausrüstung wird zurückgesetzt (Kraft neu erspielt).

## Schnittstellen zu anderen Systemen

- **Fähigkeits-Ebenen:** Materia (`materia.md`, tauschbar) vs. Skills (charakter-eigen, permanent) vs. Limit (Signature) vs. Affinität (angeboren).
- **Gambits** (`gambits.md`): umschaltbare Party-/Materia-Sets.
- **Regionen** (`progression-regionen.md`): Figuren stoßen regionsweise hinzu.
- **EXP** (`oekonomie-waehrungen.md`): Charakter-Level; Level-Reset bei Reunion (`prestige-reunion.md`).
- **Challenges** (E1): Solo-/Paar-Läufe; zugleich Unlock-Quelle.

## Detailspezifikation (TBD)

_Rollen/Affinitäten je Figur, Skill-Listen, Limit-Design je Figur, Party-Synergien, Challenge-Regeln & -Belohnungen._

## Offene Detailfragen

- Rollen-/Affinitäts-Feinbild je Charakter.
- Konkrete Skills und Limits pro Figur.
- Party-Größe/Bank-Frage (falls über die feste Party hinaus relevant).

# Stat-Modell (Kampfwerte)

**Status:** Struktur festgelegt; Zahlen/Kurven/Formeln → **Playtest**.
**Rahmen:** `../03_Konzept_Gerüst.md` – Fundament, das Kampf (§4), Ausrüstung (§7) und Gegner-Design unterlegt.
**Prüfinstanz:** `../02_Leitfaden_Kernmechaniken.md`.

## Schnittstellen zu anderen Systemen

- **Kampf** (`kampf-analyse-shock.md`): ATK/MAG = Schaden, DEF = Schadensreduktion, SPD = ATB-Füllrate, HP/MP = Überleben/Ressource.
- **Analyse** (`kampf-analyse-shock.md`): enthüllt beim Gegner **ATK/DEF/HP**.
- **Charaktere** (`charaktere-party.md`): Stat-Profile je Rolle; Wachstum über Level.
- **Ausrüstung** (`ausruestung-gil.md`): liefert Stat-Boni (Waffe → ATK/MAG, Rüstung → DEF/HP, u. a. SPD).
- **Materia** (`materia.md`): **magische/elementare Resistenz läuft über Materia**, nicht über einen Kern-Stat.
- **Progression/Gegner** (`progression-regionen.md`): Gegner nutzen dasselbe Kern-Set + Schwäche-Tags.

---

## 1. Kern-Stats (6, bewusst schlank)

| Stat | Kürzel | Funktion | System | Rollen-Anker |
|------|--------|----------|--------|--------------|
| Lebenspunkte | **HP** | Überleben | Niederlage-System | Barrel |
| Magiepunkte | **MP** | Ressource für Specials & Magie | MP-Limiter/Regen | — |
| Angriff | **ATK** | physischer Schaden (Waffen/Specials) | Kampf | Claude |
| Magie | **MAG** | Magie-Schaden **und Heilkraft** | Kampf/Heilung | Arris |
| Verteidigung | **DEF** | reduziert eingehenden Schaden (einheitlich) | Kampf | Barrel |
| Tempo | **SPD** | ATB-Füllrate = Aktions-Frequenz | ATB | Tofa |

Jeder Stat bedient genau ein System; die vier Figuren bekommen dadurch natürliche Profile (D3-Synergie).

## 2. Bewusst NICHT genutzt

- **Glück / Crit-Chance** — in FF7 intransparent/ungenutzt. Unser Schadens-Spike ist das verdiente, lesbare **Shock-Fenster**, keine verdeckte Crit-RNG.
- **Treffer% / Ausweichen% (Accuracy/Evasion)** — Miss/Dodge-RNG frustriert im Idle-Auto-Battler und ist intransparent. Kampf bleibt **deterministisch**.
- **Separate Magie-Verteidigung (M-DEF)** — in **eine DEF** zusammengelegt (Lesbarkeit).
- **Granulare Extra-Attribute** — draußen, gegen das Spreadsheet-Gefühl (Leitfaden-Lesbarkeit).

## 3. Elemente, Schwächen & Resistenzen (separate Ebene)

- **Schwächen** = Gegner-**Tags**, per Analyse enthüllt; Grundlage für Element-Wahl und Shock.
- **Resistenzen** (spätes Spiel, Gegnerseite) = eigener **Multiplikator-Layer**, kein Kern-Stat.
- **Magische/elementare Resistenz auf Spielerseite läuft über Materia** — konkret über die **Elementar+Element-Kombo** (gibt am Einzel-Item Angriff *und* Resistenz zugleich) — eine **Wahl mit Opportunitätskosten**, kein universeller Stat. Konsistent mit der Materia-Taxonomie (`materia.md` §2).

## 4. Woher die Stats wachsen

**Charakter-Level (rollen-gewichtet) + Ausrüstung** – **nicht** über Materia (dort keine flachen Stat-Boni, damit jede Materia eine Gameplay-Entscheidung bleibt).

## 5. Charakter-Stat-Profile (vorläufig)

- **Claude** – hoher ATK (physischer DPS).
- **Barrel** – hohe HP/DEF (Tank) + Unterdrückungs-Spezial.
- **Tofa** – hoher SPD/ATK (schneller Brawler, Shock-Enabler).
- **Arris** – hoher MAG (Heilung/Magie).

## Charakter-Basiswerte (Level 1, grob)

| Figur | HP | MP | ATK | MAG | DEF | SPD |
|-------|----|----|-----|-----|-----|-----|
| **Claude** | 110 | 20 | 14 | 6 | 4 | 100 |
| **Barrel** | 140 | 20 | 11 | 5 | 8 | 80 |
| **Tofa** | 95 | 20 | 12 | 5 | 3 | 130 |
| **Arris** | 80 | 30 | 7 | 14 | 3 | 95 |

Level-Wachstum (grob, tunbar): ~+8 % HP, +6 % ATK/MAG, +5 % DEF pro Level; SPD wächst kaum (bleibt Build-Hebel). So bleibt die Kampfdauer trotz Gegner-Skalierung (g^Zone) ungefähr konstant.

## Formeln (grob, tunbar)

- **Schaden** = **ATK² / (ATK + DEF)** (mind. 1) – Mitigations-Kurve statt `ATK − DEF`: hohe DEF macht Gegner *zäh*, aber nie unverwundbar. Magie-Schaden analog aus **MAG** (gegen DEF/Resistenz).
- **Heilung** skaliert aus **MAG**.
- **ATB-Intervall** = Basis-T × 100 / SPD, mit **Basis-T ≈ 2,0 s** (SPD 100 = Normalrate).
- **DEF** bleibt ein **signifikanter** Stat (Panzer sind zäh; später stärker ausgeprägt, früh moderat). Der gezielte **Konter gegen hohe DEF ist Shock** – im Shock-Fenster wird DEF weitgehend ignoriert (s. `kampf-analyse-shock.md` §6).

*Plausibilisiert am Spielstart (Claude solo): 1× Blando ~8 s, Welle 2× ~16 s, R1-Miniboss ~24 s — s. `encounter-zyklus1.md`.*

## 6. Gegner-Stats

Gegner nutzen dasselbe Kern-Set (HP/ATK/DEF/SPD, MAG bei magischen Gegnern) plus **Schwäche-Tags**. Die Analyse enthüllt zunächst **ATK/DEF/HP** (Kapitel 2 / Region 2), Schwächen werden sichtbar, aber erst mit Shock nutzbar.

---

## Offene Detailfragen (Balance – Playtest)

- Formeln sind vorgeschlagen (s. oben); Feinjustage der Parameter (Basis-T, Mitigations-Kurve, Level-Wachstum) im Playtest.
- Wachstumskurven je Stat/Rolle über Level; Höhe der Ausrüstungs-Boni.
- MP-Größenordnung im Verhältnis zu Special-/Magie-Kosten und Regen.
- Gegner-Stat-Skalierung je Zone.

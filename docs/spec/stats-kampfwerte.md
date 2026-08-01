# Stat-Modell (Kampfwerte)

**Status:** Struktur festgelegt; Zahlen/Kurven/Formeln → **Playtest**.
**Rahmen:** `../03_Konzept_Gerüst.md` – Fundament, das Kampf (§4), Ausrüstung (§7) und Gegner-Design unterlegt.
**Prüfinstanz:** `../02_Leitfaden_Kernmechaniken.md`.

## Schnittstellen zu anderen Systemen

- **Kampf** (`kampf-analyse-shock.md`): ATK/MAG = Schaden, DEF = Schadensreduktion, SPD = ATB-Füllrate, HP/MP = Überleben/Ressource.
- **Analyse** (`kampf-analyse-shock.md`): enthüllt beim Gegner **ATK/DEF/HP**.
- **Charaktere** (`charaktere-party.md`): Stat-Profile je Rolle; Wachstum über das **Gruppenlevel** (§4.1) – kein individuelles Charakter-Level.
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
| Magie | **MAG** | Magie-Schaden **und Heilkraft** | Kampf/Heilung | Air is... |
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

**Ausschließlich über das Gruppenlevel** (rollen-gewichtet) – **nicht** über Materia (dort keine flachen Stat-Boni, damit jede Materia eine Gameplay-Entscheidung bleibt) und **seit dem 30.07.2026 nicht mehr über gekaufte Waffen-Tiers**.

**Was sich geändert hat:** Bis dahin lieferte die Waffen-Tier-Leiter `atk ×(1+0,10·tier)` einen zweiten Wachstumskanal, finanziert über Gil. Beides ist gestrichen – die Leiter, weil viermal dasselbe Upgrade zu kaufen keine Entscheidung ist, und Gil, weil eine zeit-farmbare Währung keine Exklusivität tragen kann (`oekonomie-waehrungen.md`, Abschnitt „Gil ist gestrichen"). ✓ **Erledigt (M15):** Das ATK/MAG/HP-Wachstum aus dem alten Tier 4 (Level ≥16: `atk`/`mag` ×1,40, `hp` ×1,20) ist in die Level-Kurve gefaltet – `growth.atk`/`growth.mag` 1,055 → **1,073**, `growth.hp` 1,09 → **1,10** (`content/characters.ts`), gefittet auf Level 21 (altes Endlevel Typ T/V, `feinspec-kapitel1.md` §7.4). Startwert, zusammen mit der EXP-Dämpfung gegen den Test-Harness gemessen (`07_Umsetzungsentscheidungen.md` Umsetzungsentscheidung 48).

Ab Kapitel 2 kommen **Materia-Slots** als Build-Ebene hinzu (freigeschaltet über das Reunion-Upgrade-Menü, `prestige-reunion.md`) – als Gameplay-Veränderer, nicht als flacher Stat-Kanal.

### 4.1 Gruppenlevel statt Charakter-Level (verbindlich)

Es gibt **genau ein Level für die gesamte Party**. EXP fließt in einen Party-Topf; ein Levelaufstieg hebt alle Figuren gleichzeitig. Die Stats einer Figur = ihre eigenen Basiswerte (§5) × rollen-gewichtetes Wachstum auf dem Gruppenlevel. Neu hinzustoßende Figuren stehen sofort auf dem aktuellen Gruppenlevel.

**Warum:** An einem individuellen Level hängt bei uns keine Spielerentscheidung – es gibt keine EXP-Zuweisung, keine Bank, keine Rotation, die Party ist fix und alle kämpfen. Vier synchron mitlaufende Zähler wären reine Buchführung (Leitfaden §3 „Multi-Charakter/Parallelität ⟷ klarer Fokus", §5 „Tiefe dosiert"). Differenzierung bleibt vollständig erhalten – über Basiswerte, Rollen-Gewichtung, Ausrüstung und ab Kapitel 2 Materia.

**Der eigentliche Auslöser (Playtest):** Mit individuellen Leveln stieß Barrel bei Zone 9 mit L1 zu einem L~9-Claude, Tofa und Air is… bei Zone 19 mit L1 zu L~19 – bei ×1,055 ATK/Level ~1,6× bzw. ~2,6× Rückstand. Die Neuzugänge waren über eine halbe Region totes Gewicht. Das ist kein Balancing-Detail, sondern nahe an „totes Feature": eine gerade freigeschaltete Figur, die nichts beiträgt, entwertet ihre eigene Freischaltung.

**Bewusst in Kauf genommen:** Der Bogen „neues Mitglied wächst ins Team hinein" entfällt. In einem Idle-Auto-Battler ist das kein Pflege-Moment, sondern eine Phase ohne Beitrag – der Beitritt wird stattdessen ein sichtbarer Kraft-Sprung. Balancing-Konsequenz: `feinspec-kapitel1.md` §3.7 – dort war eine Regions-Stufe als Gegengewicht vorgesehen; die Messung an der Engine hat sie verworfen.

**Solo-/Paar-Challenges (E1, ab Kap. 2):** greifen auf dasselbe Gruppenlevel zu. „Solo" heißt „nur eine Figur kämpft", nicht „schwächere Figur". Ein eigenes, gedeckeltes Challenge-Level wäre die Alternative (mehr Eigengewicht für Challenges) – bis zur Kapitel-2-Spec offen, aber nicht der Default.

## 5. Charakter-Stat-Profile (vorläufig)

- **Claude** – hoher ATK (physischer DPS).
- **Barrel** – hohe HP/DEF (Tank) + Unterdrückungs-Spezial.
- **Tofa** – hoher SPD/ATK (schneller Brawler, Shock-Enabler).
- **Air is...** – hoher MAG (Heilung/Magie).

## Charakter-Basiswerte (Level 1, grob)

| Figur | HP | MP | ATK | MAG | DEF | SPD |
|-------|----|----|-----|-----|-----|-----|
| **Claude** | 110 | 20 | 14 | 6 | 4 | 100 |
| **Barrel** | 140 | 20 | 11 | 5 | 8 | 80 |
| **Tofa** | 95 | 20 | 12 | 5 | 3 | 130 |
| **Air is...** | 80 | 30 | 7 | 14 | 3 | 95 |

Level-Wachstum (M15: inkl. des gefalteten Waffen-Tier-Wachstums, s. §4 oben): +10 % HP, +7,3 % ATK/MAG, +5 % DEF pro **Gruppenlevel**; SPD wächst kaum (bleibt Build-Hebel). So bleibt die Kampfdauer trotz Gegner-Skalierung (g^Zone) ungefähr konstant.

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
- Wachstumskurven je Stat/Rolle über das Gruppenlevel; Höhe der Ausrüstungs-Boni.
- ~~Höhe der Regions-Stufe (`REGION_STEP`)~~ – **erledigt:** gegen die TS-Engine gemessen und verworfen, die Gegnerkurve bleibt die reine `g`-Kurve (`feinspec-kapitel1.md` §3.7). Offen bleibt die *gespielte* Beurteilung von Durchlauf 2 (volle Gruppe ab Zone 1).
- MP-Größenordnung im Verhältnis zu Special-/Magie-Kosten und Regen.
- Gegner-Stat-Skalierung je Zone.

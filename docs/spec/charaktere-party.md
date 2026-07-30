# Charaktere & Party

**Status:** Stub – Detailspezifikation folgt.
**Rahmen:** `../03_Konzept_Gerüst.md`, §8 (verbindliche Richtung).
**Prüfinstanz:** `../02_Leitfaden_Kernmechaniken.md`.

## Roster (fix, Parodie – keine Kopien)

- **Claude** (Cloud) – Wolke mit riesigem Schwert – ausgewogener Nahkampf-DPS.
- **Barrel** (Barret) – Holzfass mit Maschinengewehr-Arm – Fernkampf / Tank.
- **Tofa** (Tifa) – Tofublock mit Boxhandschuhen – Nahkampf-Brawler, schneller Shock-Aufbau.
- **Air is...** (Aerith) – Papierfächer mit Blume und angedeuteter Jacke – Heilung / Support / Magie. *(Name bewusst ein unvollendeter Satz – Wortspiel aus „Air" (Luft) und „is" (sein).)*

## Waffen-Spezialfähigkeiten (Rollen-Signatur)

Jede Figur hat eine **Spezialfähigkeit**, die ihre Rolle *vor* dem Materia-Build-System definiert. Kosten laufen **ausschließlich über MP** (kein Cooldown). **MP existiert von Anfang an, wird dem Spieler aber erst mit der ersten MP-Spezial sichtbar** (Region 1) und bleibt danach dauerhaft angezeigt (auch nach Reunion). MP wächst **nicht im Kampf** nach – jeder Sieg regeneriert einen Anteil, sonst füllt nur das Gasthaus (`niederlage-offline.md` §2).

### Freischaltung: Zonen-Trigger statt Kauf (neu, 30.07.2026)

Bis zum 30.07.2026 hing der Special an `weaponTier >= 1`, also am Gil-Kauf. Mit der Streichung von Gil (`oekonomie-waehrungen.md`) fällt dieser Träger weg – der **Einführungsmoment** soll aber bleiben, nicht der Skill ab Zone 1 verfügbar sein.

| Figur | Beitritt | Special | Einführung |
|---|---|---|---|
| **Claude** | Zone 1 | **Zone 3** | **Selbstvorstellung vor dem ersten Kampf** + separat Mechanik-Popup in Zone 3 (*Spezialfähigkeiten & MP*, MP-Leiste wird sichtbar) |
| **Barrel** | Zone 9 | mit Beitritt | Selbstvorstellung bei Beitritt |
| **Tofa** | Zone 19 | mit Beitritt | Selbstvorstellung bei Beitritt |
| **Air is…** | Zone 19 | mit Beitritt | Selbstvorstellung bei Beitritt |

**Claude hat zwei getrennte Momente**, und sie dürfen nicht zusammengelegt werden: Die **Selbstvorstellung steht vor dem allerersten Kampf** (Zone 1) – das Spiel beginnt mit ihm allein, also muss er sich zeigen, bevor gekämpft wird. Das **Mechanik-Popup** kommt erst in Zone 3 mit dem Special. Würde man beides in Zone 3 bündeln, hätte der Spieler zwei Zonen lang eine namenlose Figur gesteuert und bekäme dann Charakterisierung und Mechanik in einem Schwall.

⚠️ **Diese erste Selbstvorstellung ist der erste Text des Spiels** und setzt den Ton für die ganze Parodie. Sie verdient mehr Sorgfalt als die anderen drei.

**Warum nur Claude einen verzögerten Trigger hat:** Bei ihm ist der Special **neue Mechanik** – vorher gibt es nur „Attack", danach eine Ressourcen-Entscheidung. Zone 3 gibt dem Spieler zwei Zonen reines Antippen als Kontrast, damit der Unterschied spürbar ist. Bei allen späteren Figuren ist der Special **keine neue Mechanik mehr**, sondern Teil der Figur; ihn zu verzögern würde eine Regel einführen, die nichts erklärt, und die Figur bis dahin ohne Rolle dastehen lassen.

*Verworfen: eine Staffelung der späteren Specials (z. B. Barrel Zone 11, Tofa Zone 21), um Zone 19 zu entlasten. Begründung s. o. – bei Air is… wäre sie zusätzlich schädlich, weil ihr Special ihre einzige Rolle ist (Gruppenheilung) und Heilung seit M11 knapp ist.*

**Ab Durchlauf 2 gilt der Zeitplan nicht.** Gelernte Specials sind permanent (s. u.), stehen also ab Zone 1 zur Verfügung. Der Einführungsrhythmus ist eine **Tutorial-Eigenschaft des ersten Durchlaufs**, keine Dauerregel – deshalb können Gambit-Regeln, die auf „Special" verweisen, nie ins Leere laufen.

### Rollen-Einführung je Figur (verbindlich)

Jede Figur bekommt **beim ersten Beitritt** ein Popup, das ihre **Rolle** erklärt – nicht die Mechanik „Spezialfähigkeit", die ist ab Claude bekannt. Ohne das bleibt unklar, wofür die Figur gedacht ist, und der Spieler benutzt sie wie einen zweiten Claude.

| Figur | Was das Popup vermitteln muss |
|---|---|
| **Barrel** | hält hin (hohe HP/DEF) und **verlangsamt Gegner** – Kontrolle |
| **Tofa** | ist **schnell** (hohe SPD, häufige Aktionen) und **treibt den Shock** |
| **Air is…** | ist **magiestark** und **heilt die Gruppe** |

**Form: die Figur stellt sich selbst vor – 2–3 witzige Sätze, die ihre Stärke zeigen.** Kein Merkblatt in dritter Person. Das ist die günstigste Gelegenheit im ganzen Spiel, Charakter zu etablieren: Der Spieler *muss* das Popup lesen, um es wegzuklicken. Ein Datenblatt verschenkt diesen Moment.

Anforderung an die Zeilen: **die Stärke muss aus dem Witz hervorgehen**, nicht danebenstehen. Wer die Pointe versteht, weiß, wofür die Figur da ist.

**Entwurfszeilen (Platzhalter, Ton-Referenz – nicht final):**

- **Barrel:** „Ich bin ein Fass. Fässer rennen nicht weg, Fässer stehen da. Wenn du willst, dass etwas *langsamer* wird – ich rede sehr gern und sehr lange."
- **Tofa:** „Zweihundert Schläge pro Minute. Frag nicht, wie ein Tofublock das macht. Bis du fertig gefragt hast, wackelt der Gegner schon."
- **Air is…** „Ich bin ein Fächer. Ich puste Wunden weg – rein medizinisch. Und wenn nicht, puste ich eben den Gegner weg."
- **Claude** (vor dem ersten Kampf): „Ich bin eine Wolke mit einem Schwert, das dreimal so groß ist wie ich. Nein, das geht nicht. Doch, ich mach das trotzdem."

Regeln für diese Popups wie für alle Einführungen (`ui-layout.md`): **keine konkreten Zahlen im Text** – qualitativ formulieren („ein Anteil der MP kommt pro Sieg zurück", nicht „25 %"). Zahlen im Erklärtext veralten beim nächsten Balancing, und das Spiel erklärt dem Spieler dann etwas Falsches. Der qualitative Satz bleibt über jedes Balancing hinweg wahr.

| Figur | Spezialfähigkeit | Rolle |
|-------|------------------|-------|
| **Claude** | großer Einzelschaden | Damage |
| **Barrel** | Gegner unterdrücken (Gegner-ATB lädt langsamer / wird leicht reduziert) | Control |
| **Tofa** | verstärkt den Shock-Zustand | Shock-Enabler |
| **Air is...** | heilt die Gruppe | Healing |

Roster-Rhythmus: Region 1 Claude allein → Region 2 Barrel → Region 3 Tofa + Air is... gleichzeitig (volle Gruppe).

**Neuzugänge steigen auf dem aktuellen Gruppenlevel ein** (`stats-kampfwerte.md` §4.1) – eine frisch freigeschaltete Figur ist ab dem ersten Kampf voll einsatzfähig. Der Beitritt ist damit ein sichtbarer Kraft-Sprung. Eine Gegen-Stufe auf der Gegnerkurve war dafür vorgesehen, ist aber gegen die Engine gemessen und verworfen worden – der Sprung verschiebt Niederlagen an die Gates, statt die Region zu trivialisieren (`feinspec-kapitel1.md` §3.7).

**Bei Reunion:** die gelernte Spezialfähigkeit **bleibt erhalten** – und zwar jetzt tatsächlich. Bis zum 30.07.2026 stand hier dasselbe Versprechen, während die Implementierung den Special an `weaponTier >= 1` band und das Tier bei jeder Reunion auf 0 fiel (`feinspec-kapitel1.md` §6.4, M6-Präzisierung). Der „permanente Skill" war damit ab Durchlauf 2 in jeder Region 1 wieder weg, bis neu gekauft wurde – ein Widerspruch zwischen zwei Spec-Stellen, gefunden im Playtest-Gespräch vom 30.07.2026. **Mit der Streichung von Gil und dem Zonen-Trigger ist die Sperre entfallen; die Waffe schaltet gar nichts mehr frei.**

## Schnittstellen zu anderen Systemen

- **Fähigkeits-Ebenen:** Materia (`materia.md`, tauschbar) vs. Skills (charakter-eigen, permanent) vs. Limit (Signature) vs. Affinität (angeboren).
- **Gambits** (`gambits.md`): umschaltbare Party-/Materia-Sets.
- **Regionen** (`progression-regionen.md`): Figuren stoßen regionsweise hinzu.
- **EXP** (`oekonomie-waehrungen.md`): speist **ein gemeinsames Gruppenlevel** (`stats-kampfwerte.md` §4.1), kein individuelles Charakter-Level; Reset bei Reunion (`prestige-reunion.md`).
- **Challenges** (E1): Solo-/Paar-Läufe; zugleich Unlock-Quelle.

## Detailspezifikation (TBD)

_Rollen/Affinitäten je Figur, Skill-Listen, Limit-Design je Figur, Party-Synergien, Challenge-Regeln & -Belohnungen._

## Offene Detailfragen

- Rollen-/Affinitäts-Feinbild je Charakter.
- Konkrete Skills und Limits pro Figur.
- Party-Größe/Bank-Frage (falls über die feste Party hinaus relevant).

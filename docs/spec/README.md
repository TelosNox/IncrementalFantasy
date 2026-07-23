# Detail-Spezifikationen (`docs/spec/`)

Jede Datei hier spezifiziert **ein System** im Detail (Zahlen, Kurven, Zustände, Edge Cases).

**Ladekonvention (Kontext schlank halten):** Beim Spezifizieren eines Systems lädt man
`../03_Konzept_Gerüst.md` (Überblick/Anker) **+ genau die betroffene `spec/*.md`** – nicht den ganzen Stapel.
Der Block **„Schnittstellen zu anderen Systemen"** oben in jeder Datei macht Abhängigkeiten explizit,
sodass Querbezüge ohne Laden der anderen Detail-Docs erkennbar bleiben.

**Verbindliche Prüfinstanz** für jede Design-Entscheidung bleibt `../02_Leitfaden_Kernmechaniken.md`.

## Übersicht

| Datei | System | Gerüst-Kapitel |
|-------|--------|----------------|
| `stats-kampfwerte.md` | Stat-Modell (Kampfwerte) | Fundament (§4/§7) |
| `progression-regionen.md` | Region-Abfolge, Gates, Rollout | §3, §10 |
| `kampf-analyse-shock.md` | Kampf, Analyse/Bestiarium, Shock, Resistenzen | §4 |
| `gambits.md` | Strategische Automatik | §5 |
| `materia.md` | Materia (Build-Herzstück) | §6 |
| `ausruestung-gil.md` | Ausrüstung, Slots, Gil | §7 |
| `charaktere-party.md` | Roster, Skills/Limits, Party, Challenges | §8 |
| `charaktere-visuals.md` | Charakter-Visuals (Pixel-Art) + Assets | §8 |
| `ui-layout.md` | Bildschirm-Layout & Platz-Budget (Stage/Steuerung/Seitenleiste) | §4 |
| `gegner-encounter.md` | Gegner- & Encounter-Design | Fundament (§3/§4) |
| `gegner-katalog.md` | Gegner-Katalog (10 Parodie-Monster) | ergänzt gegner-encounter |
| `encounter-zyklus1.md` | Monster-Platzierung + grobe Stats (Zyklus 1) | §3/§4 |
| `prestige-reunion.md` | Materia-Cap-Reset + Reunion | §9 |
| `oekonomie-waehrungen.md` | Währungen & Fortschritts-Ökonomie | §11 |
| `niederlage-offline.md` | Niederlage/Heilung, Offline-Modell | §12, §13 |
| `feinspec-kapitel1.md` | **Implementierungsnahe Feinspec Kapitel 1** (Formeln, Schemas, Tick-Loop, konkrete Startwerte, Pacing, Screens) | fasst §3/§4/§7/§11/§12 zusammen |

**Hinweis:** `feinspec-kapitel1.md` ist die erste implementierungsnahe Zusammenführung (Datenmodelle + konkrete, simulationsvalidierte Zahlen). Werkzeuge dazu in `assets/sim/` (Kampf-/Pacing-Simulator + Mockup-Generator), Screens in `assets/mockups/`.

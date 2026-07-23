# Fortschritts-Ökonomie & Währungen

**Status:** Prinzipien aus den bisherigen Entscheidungen abgeleitet; Zahlen/Kurven → **Playtest**.
**Rahmen:** `../03_Konzept_Gerüst.md`, §11 (verbindliche Richtung).
**Prüfinstanz:** `../02_Leitfaden_Kernmechaniken.md`.

## Währungen (1:1 zu Systemen, gegen Wildwuchs #9)

| Währung | Quelle | Verwendung | Ebene |
|---------|--------|------------|-------|
| **EXP** | Kämpfe | Charakter-Level (`charaktere-party.md`) | Basis |
| **AP** | Kämpfe (auto auf alle Materia) | Materia-Level (`materia.md`) | Basis (ab Kapitel 2) |
| **Gil** | Kämpfe | Ausrüstung/Item (`ausruestung-gil.md`) | Basis (je Zyklus neu) |
| **Materia-Prestige-Währung** | Materia-Cap-Reset | Materia-Evolution (`materia.md`) | Mikro-Prestige |
| **Reunion-Essenz** | Reunion (`prestige-reunion.md`) | Gambits, permanente Boni, Materia-Typen, Roster | Makro-Prestige |

## Schnittstellen

Querschnitts-Dokument: jede Währung gehört zu genau einem System (Tabelle). Balancing der Ertrags-/Kostenkurven wird hier zentral gehalten.

---

## 1. Abgeleitete Prinzipien

- **Sink-Disziplin:** jede Währung hat **genau einen Haupt-Sink** → kein Wildwuchs (#9).
- **Kadenz je Ebene (doppelte Zielstruktur, §7 Leitfaden):** Basis-Währungen (EXP/AP/Gil) pro Kampf (kurzfristige Ziele); Materia-Prestige pro Cap-Reset; Reunion-Essenz pro Reunion (langfristige Ziele). Kurz- und Langfrist-Motivation laufen parallel.
- **Gil bleibt zyklisch relevant:** Ausrüstung resettet je Reunion → Gil wird nie zur toten Währung.
- **AP-Regel:** fließt auf **alle angelegten** Materia; volle stoppen (Detail in `materia.md`).
- **Wachstums-Multiplikatoren gehören in die Meta-Ebene:** Gil-/EXP-/AP-**Rate** nur über Reunion-Essenz/Milestones – **nie** auf Materia-Slots oder Ausrüstung (sonst Mandatory-Falle). Der Kern-Loop skaliert Gil/EXP ohnehin über die Kampfgeschwindigkeit; Multiplikatoren sind Prestige-Pacing-Hebel, kein Selbstzweck.
- **Deterministisch & dosiert:** kein RNG, kontrollierter Zufluss (Knappheit schützt Entscheidungen).
- **MP ist eine Kampf-Ressource, keine Ökonomie-Währung** (separat, `kampf-analyse-shock.md`).

## 2. Erster Zyklus (bis zur 1. Reunion)

Aktiv sind nur **EXP + Gil** (plus **MP** als Kampf-Ressource). **AP + Materia-Prestige** kommen ab **Kapitel 2**; **Reunion-Essenz** ab der **1. Reunion**. Die Ökonomie eskaliert also gestaffelt mit den Systemen.

## 3. Zahlen-Handling (technische Leitplanke)

- **Skalierbare Zahldarstellung von Tag 1** (BigNumber/eigene Notation) – gegen ungenaue Float-Speicherung und „tote Zahlen" bei großen Werten (Anti-Pattern #10).
- Zähler laufen **glatt/kontinuierlich** (keine ungleichmäßig springenden Werte).

## 4. Aktiv / Offline

Offline akkumuliert die Basis-Währungen mit reduzierter Rate und Deckel; Details in `niederlage-offline.md`.

---

## Offene Detailfragen (Playtest)

- Ertrags-/Kostenkurven je Währung; Aktiv-/Offline-Verhältnis.
- Reunion-Essenz: Ertragskurve und Reihenfolge der Sinks (Gambits/Boni/Typen/Roster).
- Ab welcher Größenordnung greift welche Zahl-Notation.

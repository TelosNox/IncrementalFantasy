# Fortschritts-Ökonomie & Währungen

**Status:** Prinzipien aus den bisherigen Entscheidungen abgeleitet; Zahlen/Kurven → **Playtest**.
**Rahmen:** `../03_Konzept_Gerüst.md`, §11 (verbindliche Richtung).
**Prüfinstanz:** `../02_Leitfaden_Kernmechaniken.md`.

## Währungen (1:1 zu Systemen, gegen Wildwuchs #9)

| Währung | Quelle | Verwendung | Ebene |
|---------|--------|------------|-------|
| **EXP** | Kämpfe | **Gruppenlevel** – ein Level für die ganze Party (`stats-kampfwerte.md` §4.1) | Basis |
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
- **MP ist eine Kampf-Ressource, keine Ökonomie-Währung** (separat, `kampf-analyse-shock.md`). **Revidiert:** MP wächst seit dem ersten Playtest **nicht mehr im Kampf** nach – es ist ein Budget pro Kampf, das sich nur zwischen den Kämpfen füllt (Sieg-Erholung + Gasthaus, `feinspec-kapitel1.md` §3.5). Damit wird MP zur echten Vorrats-Entscheidung: In einer leichten Zone nicht auszugeben, ist selbst ein Zug.
- **Zeit ist die dritte Kostenart – neben EXP und Gil.** Zeitstrafe bei Niederlage und Gasthaus-Aufenthalt kosten ausschließlich Zeit. Das ist bewusst so gewählt: Zeitkosten können nie in einen Deadlock laufen (im Gegensatz zu einem Gil-Preis, den man sich nicht leisten kann) und sind mit dem Idle-Charakter des Spiels konsistent.

## 2. Erster Zyklus (bis zur 1. Reunion)

Aktiv sind nur **EXP + Gil** (plus **MP** als Kampf-Ressource). **AP + Materia-Prestige** kommen ab **Kapitel 2**; **Reunion-Essenz** ab der **1. Reunion**. Die Ökonomie eskaliert also gestaffelt mit den Systemen.

## 3. Zahlen-Handling (technische Leitplanke)

- **Skalierbare Zahldarstellung von Tag 1** (BigNumber/eigene Notation) – gegen ungenaue Float-Speicherung und „tote Zahlen" bei großen Werten (Anti-Pattern #10).
- Zähler laufen **glatt/kontinuierlich** (keine ungleichmäßig springenden Werte).

## 4. Aktiv / Offline

**Offline-Progress ist stillgelegt** (Playtest-Befund: Er war schneller als aktives Spiel und damit eine Umkehrung von Anti-Pattern #5). Es gibt derzeit **nur eine Ökonomie** – die aktive. Begründung und die Richtung für eine spätere Wiedereinführung als *aufladbarer Boost* stehen in `niederlage-offline.md` §4.

Die unbegrenzte EXP/Gil-Quelle ist stattdessen die **Zonen-Rückkehr**: Jede geschaffte Zone ist frei wiederholbar und zahlt regulär aus. Der Zufluss ist damit nicht mehr durch Fortschritt gedeckelt, sondern durch **Zeit** – was die Kadenz-Struktur oben unberührt lässt, aber die Ertragskurven neu bewertbar macht.

---

## Offene Detailfragen (Playtest)

- Ertrags-/Kostenkurven je Währung. **Das Aktiv-/Offline-Verhältnis entfällt vorerst** (nur noch eine Ökonomie).
- **Zweiter Gil-Sink fehlt.** Gil hat in Kapitel 1 weiterhin nur einen Verwendungszweck (Waffen) und damit keine echte Ausgabe-Entscheidung. Das Gasthaus wäre der naheliegende Kandidat gewesen, kostet aber bewusst Zeit statt Gil (Deadlock-Risiko). Kandidaten für später: Materia-Shop (ab Kap. 2, `materia.md` §8), Verbrauchsgegenstände, Nebenquest-Freikäufe.
- Reunion-Essenz: Ertragskurve und Reihenfolge der Sinks (Gambits/Boni/Typen/Roster).
- Ab welcher Größenordnung greift welche Zahl-Notation.

# Bildschirm-Layout & Platz-Budget

**Status:** nur **Platz-Budget/Rahmen** – echtes UI-Design folgt später.
**Rahmen:** unterlegt Region-Kulissen und Sprite-Platzierung; `../03_Konzept_Gerüst.md` §4.
**Prüfinstanz:** `../02_Leitfaden_Kernmechaniken.md`.

## Schnittstellen zu anderen Systemen

- **Region-Kulissen** (Backdrops): brauchen eine Standfläche; fokale Motive aus der Seitenleisten-Zone halten.
- **Charaktere/Monster** (`charaktere-visuals.md`): 64×64-Sprites stehen auf der Standfläche der Stage.
- **Incremental-System-UIs** (Materia, Shop, Prestige, Stats, Gambits): leben in der Seitenleiste/Submenüs (später).
- **Kampf** (`kampf-analyse-shock.md`): HP-/Shock-/Telegraf-Anzeigen über den Sprites brauchen freien Kopfraum.

## Grobe Aufteilung (Landscape)

- **Battle-Stage** (Kulisse + Kampf): großer Bereich oben/links.
- **Charakter-Steuerung:** horizontale Leiste **unten** (~18–22 % Höhe) – Limits, manuelle Übernahme, Aktionen.
- **Incremental / Menüs:** vertikale Leiste **seitlich** (~18–24 % Breite) – Materia, Shop, Prestige, Stats, Submenüs; ideal einklappbar.
- **Stage** = verbleibende ~76–80 % × ~78–82 %.

## Battle-Stage & Standfläche (verbindlich für Kulissen)

- Jede Kulisse braucht eine klare **Standfläche** (Bodenzone) im **unteren Stage-Drittel**, sichtbar über der Bottom-Leiste.
- **Party bis 4 (links)** vs. **Gegner bis 4 (rechts)** auf derselben Bodenlinie; 64×64-Sprites.
- **Fokale Motive** (z. B. Reaktor) nicht in die Seitenleisten-Zone legen; Backdrop breiter anlegen (Parallax/Crop) mit Sicherheitsrand.
- **Kopfraum** über den Sprites frei halten, damit HP/Shock/Telegraf-Anzeigen nicht von UI verdeckt werden (Lesbarkeit).

## Charakter-Steuerung: Panels & Aktions-Popup

Die Bottom-Leiste trägt je Figur ein **Charakter-Panel** (HP/MP/ATB/Limit) plus einen **Auto/Manuell-Schalter** (erscheint mit der ersten Automatik, s. `gambits.md` §6). Bedien-Flow (Modus je Figur, globale Wait-Pause, Warteschlange): `gambits.md` §3.

**Aktions-Popup (FF7-Menübox):** Wird eine Manuell-Figur bereit, öffnet **direkt an ihrem Panel** ein Aktions-Popup (die Kampfuhr pausiert global).

- **Look:** dunkle, leicht transparente Box im **Blau/Lila-Bereich** (FF7-Menübox-Anmutung), klar von der Stage abgesetzt; **helle Schrift** (Weiß / Weißgelb).
- **Zustandskodierung doppelt (Lesbarkeit):** verfügbare Aktionen **hell + kräftige (dickere) Schrift**; nicht verfügbare (z. B. Spezial ohne MP) **gedämpft + dünne Schrift** – sichtbar, aber sofort als „gerade nicht möglich" lesbar.
- **Limit:** wenn geladen, in **bunten Buchstaben** (jeder Buchstabe eine kräftige Farbe) – die FF7-Signatur.
- **Skalierung:** feste Grundaktionen oben (Angriff, Spezial, Limit; Verteidigen ab Boss-Event); **Materia unter der Kategorie „Magie ▸"** als **scroll-/blätterbare Unterliste** → das Popup behält seine Größe, egal wie viele Materia (rutscht nie aus dem Bild). Kategorie nur sichtbar, wenn Materia-Aktionen existieren.
- **Platz:** Popup wächst nach **oben** in die Stage (über der Bottom-Leiste), auf der Party-Seite (links), damit es die Gegner-Seite und deren HUD nicht verdeckt.

## Nicht jetzt

Das übrige UI-Design (Shop-/Materia-/Prestige-Panels, Farben-Feinschliff, Responsive/Portrait) folgt später. **Ausnahme:** die **Steuer-UI oben** (Aktions-Popup + Modus-Schalter) ist bereits spezifiziert, da sie fürs Kampfgefühl zentral ist und in die Implementierung geht. Der übrige Bereich bleibt vorerst **reservierter Platz**, damit Kulissen und Sprite-Platzierung ihn einkalkulieren.

## Offene Punkte

- Konkrete Prozente und Responsive-Verhalten (Landscape vs. Portrait/Mobile).
- Seitenleiste links oder rechts; Einklapp-Verhalten.
- Genaue Sprite-Größen im Verhältnis zur Stage.

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
- **Party bis 4 (links)** vs. **Gegner bis 4 (rechts)** auf derselben Bodenlinie; native 64×64-Sprites.
- **Display-Zoom auf der Stage (entschieden, Playtest-Korrektur nach M6):** Alle Sprites werden zusätzlich zur nativen Asset-Auflösung mit einem gemeinsamen **2×-Nearest-Neighbor-Zoom** gerendert (Figuren/Standard-Monster effektiv 128×128). Der Zoom wirkt **multiplikativ auf alle Sprite-Klassen gleichermaßen** – die in `charaktere-visuals.md` festgelegte relative Größenhierarchie (Standard 1× = 64px nativ, Miniboss 1,5× = 96px nativ, Kapitel-Boss 2× = 128px nativ) bleibt dadurch unverändert erhalten, es skaliert nur gemeinsam mit hoch (Miniboss effektiv 192px, Kapitel-Boss effektiv 256px). Exaktes Spacing/Kollisionsvermeidung bei voller 4-gegen-4-Party ist Implementierungsdetail (responsive an der tatsächlichen Stage-Breite), keine fixe Pixel-Vorgabe.
- **Fokale Motive** (z. B. Reaktor) nicht in die Seitenleisten-Zone legen; Backdrop breiter anlegen (Parallax/Crop) mit Sicherheitsrand.
- **Kopfraum** über den Sprites frei halten, damit HP/Shock/Telegraf-Anzeigen nicht von UI verdeckt werden (Lesbarkeit).

## Charakter-Steuerung: Panels & Aktions-Popup

Die Bottom-Leiste trägt je Figur ein **Charakter-Panel** (HP/MP/ATB/Limit) plus einen **Auto/Manual-Schalter** (erscheint mit der ersten Automatik, s. `gambits.md` §6). Bedien-Flow (Modus je Figur, globale Wait-Pause, Warteschlange): `gambits.md` §3.

**Aktions-Popup (FF7-Menübox):** Wird eine Manuell-Figur bereit, öffnet **direkt an ihrem Panel** ein Aktions-Popup (die Kampfuhr pausiert global). **Explizit (Playtest-Korrektur nach M6):** Solange die ATB-Leiste einer Figur **nicht voll** ist, ist **weder das Popup noch ein einzelner Aktions-Button** (z. B. ein ausgegrauter „Attack") sichtbar – es gibt schlicht nichts zu bedienen. Das Popup erscheint **exakt in dem Moment**, in dem `atb >= 1.0` wird (`feinspec-kapitel1.md` §5.1), nicht früher als gedämpfte Vorschau. „Ausgegraut, aber sichtbar" gilt ausschließlich für **einzelne Aktionen innerhalb eines bereits offenen Popups**, denen eine Ressource fehlt (z. B. Special ohne genug MP) – nicht für das Popup/den Button als Ganzes vor ATB-Bereitschaft.

- **Look:** dunkle, leicht transparente Box im **Blau/Lila-Bereich** (FF7-Menübox-Anmutung), klar von der Stage abgesetzt; **helle Schrift** (Weiß / Weißgelb).
- **Zustandskodierung doppelt (Lesbarkeit):** verfügbare Aktionen **hell + kräftige (dickere) Schrift**; nicht verfügbare (z. B. Spezial ohne MP) **gedämpft + dünne Schrift** – sichtbar, aber sofort als „gerade nicht möglich" lesbar.
- **Limit:** wenn geladen, in **bunten Buchstaben** (jeder Buchstabe eine kräftige Farbe) – die FF7-Signatur.
- **Skalierung:** feste Grundaktionen oben (Attack, Special, Limit; Defend ab Boss-Event); **Materia unter der Kategorie „Magic ▸"** als **scroll-/blätterbare Unterliste** → das Popup behält seine Größe, egal wie viele Materia (rutscht nie aus dem Bild). Kategorie nur sichtbar, wenn Materia-Aktionen existieren.
- **Platz:** Popup wächst nach **oben** in die Stage (über der Bottom-Leiste), auf der Party-Seite (links), damit es die Gegner-Seite und deren HUD nicht verdeckt.

## Freischaltungs-Hinweis (Unlock-Callout)

**Neu, Playtest-Korrektur nach M6:** Die Default-Attack-Freischaltung in Zone 5 (feinspec §7.1, Punkt 3) ist im Leitfaden explizit als **spürbarer Automatik-Beat** markiert („★ Erster 'vom Tappen zum mühelosen Fortschritt'-Moment", `gambits.md` §2 „Erlösung"). Ohne jede Ankündigung wirkt derselbe Moment im Playtest umgekehrt: **verwirrend statt befreiend** – der Spieler sieht nur, dass plötzlich nichts mehr abgefragt wird, ohne zu verstehen, warum. Das ist ein Onboarding-Fehler (Anti-Pattern #4 „Komplexität ohne Onboarding", `02_Leitfaden_Kernmechaniken.md`), keine Geschmacksfrage.

- **Auslöser:** jedes Mal, wenn ein Rollout-Flag von `false` auf `true` kippt (`autoAttackUnlocked`, `manualToggleUnlocked`, `defenseUnlocked`, `materiaUnlocked`, MP-Sichtbarkeit, …) – nicht nur bei Zone 5.
- **Form:** ein **kurzes, nicht-blockierendes Banner/Toast** (kein Popup, keine Pause der Kampfuhr) an prominenter Stelle (z. B. oben, wo bisher das Klicker-Hinweisbanner saß), 2–4 s eingeblendet oder bis zur nächsten Spieleraktion. Ein Satz, thematisch/humorvoll passend zum Parodie-Ton (F2), z. B. „Auto-Attack online – die Party kämpft jetzt von selbst."
- **Kein Zusatzsystem:** Das ist **keine Vorstufe eines Gambit-UIs** – der programmierbare Gambit-Editor bleibt bis zur 1. Reunion bewusst unsichtbar (feinspec §0, `gambits.md` §6). Der Callout erklärt nur *dass* sich etwas geändert hat, nicht *wie* die Automatik im Detail funktioniert.
- **Leitplanken-Check:** kein Widerspruch zu „gestaffelter Rollout" (kündigt nur an, zeigt keine neue Komplexität) oder „Automatik ist verdient" (bestätigt im Gegenteil, dass sie gerade verdient wurde). Reines Lesbarkeits-Add-on.

## Nicht jetzt

Das übrige UI-Design (Shop-/Materia-/Prestige-Panels, Farben-Feinschliff, Responsive/Portrait) folgt später. **Ausnahme:** die **Steuer-UI oben** (Aktions-Popup + Modus-Schalter) ist bereits spezifiziert, da sie fürs Kampfgefühl zentral ist und in die Implementierung geht. Der übrige Bereich bleibt vorerst **reservierter Platz**, damit Kulissen und Sprite-Platzierung ihn einkalkulieren.

## Offene Punkte

- Konkrete Prozente und Responsive-Verhalten (Landscape vs. Portrait/Mobile).
- Seitenleiste links oder rechts; Einklapp-Verhalten.
- ~~Genaue Sprite-Größen im Verhältnis zur Stage~~ → **entschieden:** 2×-Display-Zoom auf allen Sprite-Klassen (s. „Battle-Stage & Standfläche" oben); exaktes Spacing bei voller Party bleibt Implementierungsdetail.

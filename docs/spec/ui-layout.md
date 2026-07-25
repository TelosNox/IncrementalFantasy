# Bildschirm-Layout & Platz-Budget

**Status:** Platz-Budget/Rahmen – plus die inzwischen entschiedenen Teile der Kampf-Darstellung (Steuer-UI, Aufstellung, Zustände, Markierungen). Übriges UI-Design folgt später.
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

## Kampf-Darstellung: Aufstellung, Zustände & Markierungen

**Neu, Playtest-Politur nach M11.** Bis hierher standen alle Figuren in einer gleichförmigen Reihe, gefallene Figuren blieben unverändert stehen, und die beiden Markierungsarten waren unterschiedlich gestaltet.

### Aufstellung: zwei versetzte Reihen (Tiefe)

Party wie Gegner stehen in **zwei leicht versetzten Reihen** statt in einer Linie, um Tiefe anzudeuten.

**Verbindliche Einschränkung: Der Versatz muss als *Tiefe* lesbar sein, nicht als *Formation*.** In JRPGs ist die Vorder-/Hinterreihe eine etablierte Konvention mit mechanischer Bedeutung (vorne kassiert mehr, hinten sind die Fragilen). Diese Mechanik haben wir **nicht** – Gegner zielen auf die höchsten aktuellen HP, völlig positionsunabhängig (`gegner-encounter.md` §6a). Eine als Formation lesbare Aufstellung würde also eine Wirkung suggerieren, die es nicht gibt, und Spieler würden ihre Aufstellung „optimieren", ohne dass irgendetwas passiert. Der Versatz bleibt deshalb dezent – erkennbar als Perspektive, nicht als zwei taktische Blöcke.

- **Tiefenmittel:** leichter Vertikalversatz, teilweise Überlappung, korrekte Z-Reihenfolge (hintere Reihe hinter der vorderen), optional minimale atmosphärische Abdunklung/Entsättigung nach hinten.
- **Kein Größenunterschied zwischen den Reihen.** Größe ist bereits ein bedeutungstragender Kanal (Standard 1× / Miniboss 1,5× / Kapitel-Boss 2×, s. „Battle-Stage & Standfläche"). Würde Tiefe zusätzlich über Skalierung laufen, wäre ein Miniboss hinten von einem Standardgegner vorn nicht mehr sicher zu unterscheiden.
- **Eine gemeinsame Perspektivrichtung für die ganze Stage** – nicht je Seite gespiegelt, sonst liest es sich als zwei getrennte Bühnen statt als ein Raum.
- **Reihenzuordnung bleibt innerhalb eines Kampfes stabil.** Fällt jemand, rücken die anderen nicht nach (s. u.).
- **Kopfraum-Regel erweitert:** Namen/HP/Shock-Anzeigen der hinteren Reihe dürfen nicht von Sprites der vorderen verdeckt werden.

### Gefallene Figuren

**Party – „am Boden, nicht weg":** Eine Figur mit 0 HP bleibt **an ihrem Platz sichtbar**, deutlich als ausgeschieden markiert (entsättigt/abgedunkelt, leere HP-Leiste, nach Möglichkeit veränderte Pose). Sie wird **nicht entfernt**, denn das entspricht der Mechanik: Sie ist für *diesen Kampf* raus, kehrt aber nach dem nächsten Sieg automatisch mit 25 % zurück (Sieg-Erholung, `feinspec-kapitel1.md` §3.5). Der Platz gehört ihr weiterhin.

*Wichtig:* Kapitel 1 kennt **keine Wiederbelebungs-Aktion**. Die Rückkehr nach dem Sieg ist der einzige Weg zurück – die Darstellung darf also keine Aktion andeuten, die es nicht gibt (kein „Revive"-Knopf, kein Aufforderungs-Blinken).

**Gegner – verschwinden, aber mit einem Takt:** Besiegte Gegner werden ausgeblendet, jedoch **nicht schlagartig** (kurzes Auflösen/Ausblenden), sonst liest sich der Abgang wie ein Darstellungsfehler statt wie ein Erfolg.

**Verbindlich: Der frei gewordene Platz wird nicht nachgerückt.** Die verbleibenden Gegner behalten bis Kampfende ihre Position. Zwei Gründe: Das Fokusziel ist ein **Array-Index** und bewusst über die gesamte Kampfdauer stabil (Umsetzungsentscheidung 3 zu M11) – ein optisches Nachrücken würde entkoppeln, was der Spieler anklickt, von dem, was er sieht. Und nachrückende Sprites verschieben Klickziele unter dem Cursor, mitten im Kampf.

### Markierungen: gleiche Form, unterschiedliche Farbe

Es gibt zwei Markierungen mit **verschiedener Bedeutung**:

| Markierung | Bedeutung | Zweck |
|---|---|---|
| an einer **Party-Figur** | wird als Nächstes angegriffen | Verteidigungs-Information, Grundlage für Defend (`feinspec-kapitel1.md` §3.9) |
| an einem **Gegner** | ist das Fokusziel | Absichtserklärung des Spielers |

Bisher unterschieden sie sich in der **Form** (dezenter Rand vs. großer Kasten) – das ist die falsche Achse. **Die Form bleibt konstant, die Farbe trägt die Bedeutung:**

- **Form (beide):** dünner Umriss entlang der Sprite-Silhouette plus dezenter Schein. **Keine Kästen** – ein Rechteck um ein freigestelltes Pixel-Sprite wirkt wie ein Debug-Rahmen und dominiert die Stage.
- **Farbe:** **rot/warm** für „wird getroffen" (Bedrohung), **kühl (Cyan/Weiß)** für „Fokusziel" (Spielerabsicht). Cyan ist im Spiel bereits die Farbe der Spielerkontrolle (Manual-Chip, `feinspec-kapitel1.md` §1.5) – die Zuordnung ist also schon gelernt.
- **Gold/Bernstein bleibt exklusiv dem Shock vorbehalten.** Die aktuelle bernsteinfarbene Fokus-Markierung kollidiert direkt mit dem Shock-Ring am selben Gegner – **das ist ein Lesbarkeitsfehler, keine Geschmacksfrage**: Zwei unabhängige Zustände teilen sich eine Signalfarbe, und ausgerechnet am selben Objekt.
- **Kleine Glyphen (▲/◆) bleiben** als redundante Kodierung neben der Farbe – dasselbe Doppel-Kodierungs-Prinzip, das die Aktions-Popup-Zustände schon nutzen (s. unten „Zustandskodierung doppelt").

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

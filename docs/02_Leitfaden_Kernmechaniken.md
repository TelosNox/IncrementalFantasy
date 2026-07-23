# Leitfaden: Kernmechaniken für Incremental Games

**Projekt:** IncrementalFantasy
**Dokumenttyp:** Design-Leitfaden (Iteration 2)
**Stand:** 20.07.2026
**Basis:** Mechanik-Extraktion aus den in Iteration 1 (`01_Recherche_Incremental_Games.md`) gefundenen Spielen
**Zweck:** Nachschlagewerk für Design-Entscheidungen. Nicht Plattformen, Monetarisierung oder einzelne Titel stehen im Fokus, sondern die **Kernmechaniken** – ihre Stärken, Schwächen, Kombinierbarkeit und die Fehler, die man vermeiden muss.

---

## 0. Wie dieser Leitfaden zu lesen ist

Jede Mechanik ist ein Baustein. Für jeden Baustein steht hier, **was er leistet**, **wo er glänzt** und **wo er kippt**. Danach folgt das eigentlich Wichtige: **welche Bausteine sich gegenseitig verstärken**, **welche sich beißen** und **welche Muster ein Incremental kaputt machen**.

Faustregel vorab: Ein gutes Incremental ist kein Haufen Mechaniken, sondern eine **Kette von Feedback-Schleifen, die sich gegenseitig füttern** – Ressourcen → Upgrades → Automatisierung → Reset → stärkere Ressourcen – und die in jeder Phase *neue* Entscheidungen statt nur größerer Zahlen bietet.

---

## 1. Mechanik-Katalog (extrahiert aus allen gefundenen Spielen)

Gruppiert in sechs Familien. Wiederholungen über Spiele hinweg sind bewusst zusammengefasst – wenn eine Mechanik in vielen Titeln auftaucht, ist das selbst ein Signal für ihre Wichtigkeit.

### Familie A – Fundament-Loop

Das Skelett. Ohne diese Bausteine ist es kein Incremental.

**A1 · Kern-Loop (Ressource → Generator/Upgrade → mehr Ressource)**
- *Auftreten:* Ausnahmslos alle.
- *Stärken:* Erzeugt exponentielles Wachstum und das „nur noch eins"-Gefühl; leicht verständlich; universeller Unterbau für alles Weitere.
- *Schwächen:* Für sich allein schnell langweilig; ohne aufgesetzte Layer nur „Zahl steigt".

**A2 · Manueller Input / aktives Klicken**
- *Auftreten:* Cookie-Clicker-Typen, Auto-Runner, minimalistische Clicker.
- *Stärken:* Sofortiges taktiles Feedback; starker Einstiegs-Hook; gibt dem Spieler in der Frühphase Handlungsmacht.
- *Schwächen:* Führt zu Klick-Ermüdung und RSI-Beschwerden; skaliert nicht; wird ohne Ablösung schnell zur Last.

**A3 · Generatoren- / Produzentenketten**
- *Auftreten:* Business-Idle, Fabrik-Incrementals, Gebäude-Clicker.
- *Stärken:* Klar lesbare Progression (jeder neue Generator ist ein sichtbarer Meilenstein); erlaubt Investitionsentscheidungen (breit vs. tief).
- *Schwächen:* Kann in reine „kaufe das jeweils Teuerste"-Routine verfallen, wenn keine echten Trade-offs bestehen.

**A4 · Upgrades & Multiplikatoren**
- *Auftreten:* Alle.
- *Stärken:* Diskrete, befriedigende Belohnungspunkte; steuern das Pacing fein; Ort für interessante Entscheidungen.
- *Schwächen:* Additive Upgrades werden im Late-Game bedeutungslos; zu viele triviale Upgrades erzeugen Klick-Arbeit ohne Entscheidung.

**A5 · Automatisierung / Manager**
- *Auftreten:* Business-Idle (Manager), Fabrik-Idle, fortgeschrittene Prestige-Titel (Auto-Buyer).
- *Stärken:* Löst A2 ab; verwandelt Mühe in Genuss („vom hektischen Tappen zum mühelosen Einkommen"); ermöglicht echtes Idle-Spiel.
- *Schwächen:* Zu früh eingeführt entzieht dem Spiel die Handlungsmacht und damit die Spannung; zu spät → Churn durch Frust.

**A6 · Offline-Progress**
- *Auftreten:* Nahezu alle mobilen Titel, viele PC-Titel.
- *Stärken:* Respektiert die Zeit des Spielers; „Belohnung beim Wiederkommen"-Effekt; hohe Retention ohne Zwang.
- *Schwächen:* Kann aktives Spiel entwerten, wenn Offline ähnlich effizient ist; erschwert Balancing (zwei Ökonomien parallel).

### Familie B – Reset- & Meta-Mechaniken

Der Motor der Langzeitmotivation.

**B1 · Prestige / Soft-Reset**
- *Auftreten:* Nahezu alle über die Frühphase hinaus.
- *Stärken:* Verwandelt eine auslaufende Progression in einen neuen Anlauf mit permanentem Vorteil; liefert den meistgelobten Moment – frühere Wände „durchblasen"; unendliche Motivations-Spirale.
- *Schwächen:* Schlecht abgestimmt entwertet es frühere Erfolge oder fühlt sich wie Bestrafung an; ein zu früher/zu später erster Reset ist ein klassischer Balancing-Fehler.

**B2 · Verschachtelte / mehrschichtige Prestige-Layer**
- *Auftreten:* Tiefe Prestige-Titel (Infinity/Eternity/Reality-artig), Fraktions-Reset-Systeme, layered-Synergie-Titel.
- *Stärken:* Enorme Content-Tiefe aus wenig Assets; jede Ebene rahmt die darunterliegende neu; hält Enthusiasten hunderte Stunden.
- *Schwächen:* Overkill-Gefahr; überfordert neue Spieler; jede Ebene braucht eigene, spürbar andere Entscheidungen – sonst nur „dasselbe nochmal, größer".

**B3 · Roguelite-Meta-Progression (Tod → permanente Währung)**
- *Auftreten:* Zeitschleifen-/Überlebens-Incrementals.
- *Stärken:* Erzeugt echte Spannung statt reinem Warten; jeder Lauf endet mit Fortschritt; variantenreiche Wiederholbarkeit.
- *Schwächen:* „Verlieren" kann demotivieren, wenn der Meta-Gewinn zu klein ist; braucht sorgfältige Kurve, damit Läufe nie sinnlos wirken.

**B4 · Meta-Währungen**
- *Auftreten:* Alle Prestige-Systeme (Heavenly-Chips-, Helium-, Soul-Egg-, Instinct-artig).
- *Stärken:* Zweite Ökonomie-Ebene mit eigenen Entscheidungen; Anker für Langzeitziele.
- *Schwächen:* Zu viele parallele Meta-Währungen werden unübersichtlich; „Währungs-Inflation" entwertet das Sammelgefühl.

### Familie C – Struktur- & Content-Mechaniken

Steuern, wie sich das Spiel über die Zeit entfaltet.

**C1 · Feature-Kaskade / progressives Freischalten neuer Systeme**
- *Auftreten:* „Number-go-up"-Klassiker, gestaffelte Layer-Titel, Synergie-Titel.
- *Stärken:* Stärkster Motor gegen Monotonie – neue *Mechaniken* statt nur größerer Zahlen; hält die Neugier permanent wach; erzeugt „was kommt als Nächstes?".
- *Schwächen:* Hoher Design-/Produktionsaufwand; Gefahr des Feature-Wildwuchses ohne roten Faden; Onboarding-Last steigt mit jeder Ebene.

**C2 · Freischalt-Gating an Meilensteinen**
- *Auftreten:* Praktisch alle gut gepacten Titel.
- *Stärken:* Präzises Pacing-Werkzeug; belohnt Schwellenwerte; verhindert Überforderung durch dosierte Einführung.
- *Schwächen:* Falsch gesetzte Schwellen erzeugen Wände oder Leerlauf; zu lineares Gating nimmt dem Spieler Handlungsfreiheit.

**C3 · Phasenwechsel / Mechanik-Transformation**
- *Auftreten:* Narrative Ein-Sitzungs-Incrementals, in denen sich das Spiel grundlegend wandelt.
- *Stärken:* Starke „Aha"-Momente; hält bis zum Ende frisch; erzählerisch aufladbar.
- *Schwächen:* Sehr aufwendig; jede Phase muss für sich funktionieren; schwer wiederholbar (eher für Titel mit Ende als für Endlos-Loops).

**C4 · Ressourcen-Netz / Wirtschaftssimulation**
- *Auftreten:* Zivilisations-/Fabrik-Idle mit vielen interagierenden Ressourcen.
- *Stärken:* Tiefe, verzahnte Entscheidungen; Engpass-Management als eigenes Puzzle; hoher Wiederspielwert.
- *Schwächen:* Steile Lernkurve; Bilanz-/Balancing-Albtraum; kann Casual-Spieler abschrecken.

### Familie D – RPG- & Progressions-Mechaniken

Verleihen Identität und langfristige Ziele.

**D1 · Skill-Trees / parallele RPG-Skills**
- *Auftreten:* Skill-Idle-RPGs, MMO-Idle.
- *Stärken:* Viele parallele Fortschrittsbalken = ständig irgendwo Fortschritt; hohe Identifikation; natürliche Content-Gliederung.
- *Schwächen:* Parallelität kann zu Mikromanagement/„Spreadsheet-Gefühl" führen; Balancing vieler Skills ist aufwendig.

**D2 · Kampf- / Zonen-Progression**
- *Auftreten:* Combat-Idle, Zonen-Crawler.
- *Stärken:* Klarer, messbarer Fortschritt (Zone X erreicht); natürliche Wände als Ziele; koppelt gut an Stat-Wachstum.
- *Schwächen:* Kann zu reinem „Stats hochziehen bis Wand fällt" verkommen; Kampf ohne Taktik wird zäh.

**D3 · Party- / Team-Management**
- *Auftreten:* Auto-Party-Crawler, Multi-Held-Idle.
- *Stärken:* Zusammenstellungs-Entscheidungen; Sammel-/Aufbaumotivation; emotionale Bindung an Einheiten.
- *Schwächen:* Bei schwacher Differenzierung der Einheiten belanglos; kann in reine Zahlen-Optimierung kippen.

**D4 · Multi-Charakter / paralleles Spiel**
- *Auftreten:* MMO-Idle mit mehreren Figuren.
- *Stärken:* Multipliziert Content; erlaubt Spezialisierung; „mehr Bälle in der Luft".
- *Schwächen:* Mikromanagement-Explosion; Einstieg wirkt einschüchternd; leicht überladen.

**D5 · Fraktionen / strategische Builds**
- *Auftreten:* Fraktions-Prestige-Titel.
- *Stärken:* Echte strategische Weichen (aktiv vs. idle, Fraktion A vs. B); hoher Wiederspielwert; Identität pro Lauf.
- *Schwächen:* Erfordert sorgfältiges Balancing, damit kein Build dominiert; für Einsteiger schwer zu durchschauen.

### Familie E – Herausforderungs- & Engagement-Mechaniken

Halten Motivation und Rhythmus.

**E1 · Challenges / selbstauferlegte Beschränkungen**
- *Auftreten:* Tiefe Prestige-Titel, Zonen-Idle.
- *Stärken:* Recyceln vorhandenen Content mit frischer Würze; Belohnungen mit klarem Ziel; Optionalität für Hardcore-Spieler.
- *Schwächen:* Für Casuals oft ignoriert; können sich wie „künstliche Handbremse" anfühlen, wenn erzwungen.

**E2 · Achievements / Meilenstein-Belohnungen**
- *Auftreten:* Sehr verbreitet.
- *Stärken:* Zusätzliche Ziel-Ebene; oft an Boni gekoppelt (Achievement = Multiplikator) und damit fortschrittswirksam; Sammel-Motivation.
- *Schwächen:* Rein kosmetische Achievements verpuffen; Grind-Achievements nerven mehr als sie motivieren.

**E3 · Zeit als knappe Ressource**
- *Auftreten:* Zeitmanagement-/Überlebens-Incrementals.
- *Stärken:* Verwandelt passives Warten in aktive Priorisierung; jede Aktion hat Opportunitätskosten; erzeugt Spannung.
- *Schwächen:* Widerspricht dem entspannten Idle-Versprechen; kann Druck/Stress erzeugen, den Idle-Spieler gerade nicht suchen.

**E4 · Events / Live-Ops / Coop-Social**
- *Auftreten:* Große mobile Titel.
- *Stärken:* Wiederkehrgründe; Gemeinschaftsgefühl; frischer Content ohne neue Kernsysteme.
- *Schwächen:* Erfordert laufenden Betrieb (Live-Ops-Aufwand); FOMO-Gefahr; für ein Solo-/Story-Projekt oft überdimensioniert.

**E5 · Marktplatz / Spieler-Ökonomie**
- *Auftreten:* MMO-Idle.
- *Stärken:* Emergente Wirtschaft; sozialer Langzeit-Reiz; Ziele jenseits reiner Zahlen.
- *Schwächen:* Braucht kritische Spielermasse und Server-Infrastruktur; anfällig für Exploits/Inflation; kein Fit für Single-Player.

### Familie F – Bindungs- & Rahmen-Mechaniken

Das, was ein Incremental *erinnerungswürdig* macht – oft unterschätzt.

**F1 · Narrativer Bogen / definiertes Ende**
- *Auftreten:* Story-getriebene Incrementals, Premium-Incremental-RPGs.
- *Stärken:* Gibt der Zahlenjagd Sinn und Richtung; ein „Durch"-Gefühl hebt positiv vom Endlos-Laufband ab; trägt Humor/Thema.
- *Schwächen:* Endlicher Content (weniger „ewige" Retention); höherer Schreib-/Design-Aufwand; einmal durchgespielt = durchgespielt.

**F2 · Humor / Identität / Atmosphäre**
- *Auftreten:* Kult-Clicker mit starkem Ton, absurde „number-go-up"-Titel, atmosphärische Idle-Titel.
- *Stärken:* Stärkster Differenzierer in einem mechanisch gesättigten Genre; erzeugt Persönlichkeit und Weiterempfehlung; **Kern-USP für ein Parodie-Projekt**.
- *Schwächen:* Polarisiert (man liebt oder hasst den Ton); Humor nutzt sich ab, wenn er den Content ersetzt statt ihn zu würzen.

**F3 · Ambient- / Desktop-Präsenz**
- *Auftreten:* Desktop-Pets, minimalistische Dauerläufer.
- *Stärken:* Bleibt beiläufig präsent, niedrigste Interaktionshürde; charmant.
- *Schwächen:* Sehr geringe mechanische Tiefe; trägt allein kein großes Spiel.

---

## 2. Mechaniken, die sich gut kombinieren (Synergien)

Die folgenden Paarungen verstärken sich gegenseitig – das ist das Rückgrat guter Incremental-Architektur.

- **Manuelles Klicken (A2) → Automatisierung (A5):** Das klassische, bewährteste Motiv. Aktiver Einstieg schafft Handlungsmacht, Automatisierung liefert später die Erlösung. Die Ablösung selbst ist ein Belohnungsmoment.
- **Kern-Loop (A1) + Prestige (B1) + Freischalt-Gating (C2):** Das Standard-Erfolgstrio. Loop erzeugt Wachstum, Prestige recycelt es, Gating dosiert neue Systeme in genau dem Moment, in dem der Loop zu erlahmen droht.
- **Prestige (B1) → Feature-Kaskade (C1):** Jeder Reset schaltet ein neues System frei, statt nur einen Multiplikator zu geben. So wird aus „nochmal, größer" ein „nochmal, *anders*". (Das ist der Grass-Cutting-/Synergie-Ansatz.)
- **Verschachtelte Prestige-Layer (B2) + Synergie-Design (C1):** Wenn jede neue Ebene die *darunterliegenden Systeme neu aktiviert* (nichts wird obsolet), entsteht enorme Tiefe aus wenigen Assets – das Synergism-Prinzip.
- **Skill-Trees (D1) + Kampf/Zonen (D2):** Parallele Skills speisen die Kampfwerte, Zonen liefern die Ziele und Wände – eine sich selbst tragende RPG-Schleife.
- **Roguelite-Meta (B3) + Zeit-als-Ressource (E3) + Narrativ (F1):** Zeitdruck erzeugt Spannung, der Tod speist die Meta-Progression, die Story rahmt Wiedergeburt/Wiederholung sinnhaft. Ein stimmiges, thematisch dichtes Paket.
- **Narrativ/Ende (F1) + Phasenwechsel (C3):** Eine Story trägt Mechanik-Transformationen glaubwürdig; jeder Akt kann ein neues Spielgefühl sein.
- **Humor/Identität (F2) über allem:** Kombiniert mit praktisch jeder Mechanik als „Würze". Besonders stark auf Feature-Kaskade (C1) und Narrativ (F1) – neue Systeme werden zu Pointen.
- **Achievements/Challenges (E2/E1) + verschachtelte Layer (B2):** Optionale Ziele geben Enthusiasten Struktur im tiefen Endgame, ohne Casuals zu blockieren.

---

## 3. Mechaniken, die sich widersprechen (Spannungen)

Diese Paarungen ziehen in entgegengesetzte Richtungen. Man kann sie kombinieren, muss die Spannung dann aber bewusst auflösen.

- **Zeit-als-Ressource / Zeitdruck (E3) ⟷ Entspanntes Idle + Offline-Progress (A6):** Der fundamentalste Konflikt. Idle verspricht Sorglosigkeit, Zeitdruck erzeugt Stress. Entweder klar für eines entscheiden – oder Druck-Phasen und Ruhe-Phasen sauber trennen.
- **Starkes aktives Klicken (A2) ⟷ Offline-Progress (A6):** Wenn Offline fast so effizient ist wie aktives Spiel, wirkt aktives Spiel sinnlos; ist aktives Spiel Pflicht, verliert das Idle-Versprechen. Braucht eine klare Effizienz-Kurve (idle etwas schwächer, nie wertlos) und Klick-Cooldowns gegen Dauerklicken.
- **Tiefe (C4/B2/D4) ⟷ Zugänglichkeit (C2-Onboarding):** Ressourcen-Netze, verschachtelte Layer und Multi-Charakter geben Tiefe, erhöhen aber die Einstiegshürde. Auflösung: Tiefe *nacheinander* freischalten, nie alles auf einmal zeigen.
- **Endloses Endgame (B2/E4) ⟷ Definiertes Ende (F1):** Ein erzählerischer Abschluss und ein unendlicher Layer-Turm widersprechen sich in der Grundhaltung. Kompromiss: Story mit klarem Ende + optionaler, davon abgekoppelter Endlos-Endgame-Modus.
- **Multi-Charakter/Parallelität (D4/D1) ⟷ Klarer Fokus:** Viele parallele Systeme können in Mikromanagement und „Spreadsheet-Arbeit" kippen und den entspannten Grundcharakter zerstören. Automatisierung (A5) muss die Parallelität abfedern.
- **Live-Ops/Events (E4) & Marktplatz (E5) ⟷ Single-Player-Story-Projekt (F1):** Social-/Live-Systeme brauchen Spielermasse und Dauerbetrieb; sie passen schlecht zu einem abgeschlossenen, narrativen Solo-Titel.
- **Additive Upgrades (A4) ⟷ Exponentielles Wachstum (A1):** Additive Boni werden im exponentiellen Late-Game bedeutungslos. Late-Game-Upgrades müssen multiplikativ/prozentual oder strukturell wirken.

---

## 4. Anti-Patterns – was man in einem Incremental vermeiden sollte

Sortiert grob nach Häufigkeit als Kritikpunkt in Rezensionen.

1. **Fortschritts-Wände ohne Ventil.** Zu langsames Tempo ist *der* häufigste Vorwurf. Selbst während einer Wand muss spürbar *etwas* fließen (z. B. Meta-Währung), damit Fortschritt nie ganz stoppt.
2. **Zu früh alles automatisieren.** Nimmt dem Spieler die Handlungsmacht, bevor er Bindung aufbaut. Automatisierung ist Belohnung, kein Startzustand.
3. **Reines Zahlenwachstum ohne neue Mechaniken.** „Dieselbe Schleife, nur größere Zahl" ermüdet. Neue *Systeme* an Meilensteinen sind das Gegenmittel (C1/C2).
4. **Komplexität ohne Onboarding.** Tiefe ist gut, aber alles gleichzeitig zu zeigen verschreckt. Systeme gestaffelt und erklärt einführen.
5. **Dominante Einseitigkeit (aktiv *oder* idle gewinnt klar).** Wenn eine Spielweise die andere entwertet, fühlt sich das Spiel unbelohnend an. Beide Playstyles müssen tragfähig sein.
6. **Sinnlose Resets.** Ein Prestige, das frühere Erfolge entwertet oder sich wie Bestrafung anfühlt, zerstört die Kernmotivation. Jeder Reset muss klaren, spürbaren Nettogewinn liefern.
7. **Dünnes / repetitives Endgame.** Content, der nach vielen Stunden nur noch zäh ist. Endgame braucht eigene Ziele (Challenges, Layer, Story-Abschluss).
8. **Zu viele triviale Klick-Upgrades.** Upgrades ohne Entscheidung sind Arbeit, kein Spiel. Lieber wenige bedeutsame als viele belanglose.
9. **Meta-Währungs-Wildwuchs.** Zu viele parallele Prestige-Währungen werden unübersichtlich und entwerten das Sammelgefühl.
10. **Technische Zahlen-Fehler.** Ungleichmäßig springende Zähler (1, 2, 3, 4, 6, 7 …) und ungenaue Fließkomma-Speicherung bei sehr großen Zahlen brechen die Illusion sauberer Progression. Von Anfang an geeignete Zahldarstellung (BigNumber/eigene Notation) einplanen.
11. **Humor/Ton als Ersatz statt Würze.** Persönlichkeit bindet – aber wenn Witz den fehlenden Content kaschieren soll, nutzt er sich schnell ab.
12. **FOMO- und Druck-Mechaniken** (zeitlich begrenzte Zwänge), die dem entspannten Grundversprechen widersprechen – besonders heikel ohne Live-Ops-Betrieb.

---

## 5. Leitplanken für IncrementalFantasy (Konsequenzen)

Kompakte Ableitung aus dem Obigen – als Prüfliste für kommende Design-Entscheidungen:

- **Skelett zuerst:** Kern-Loop (A1) + Prestige (B1) + Freischalt-Gating (C2) sauber bauen, bevor irgendein Differenzierungs-Layer dazukommt.
- **Aktiv → automatisiert:** Mit manuellem Einstieg (A2) beginnen, Automatisierung (A5) als frühes, spürbares Belohnungs-Milestone einführen.
- **Prestige liefert Systeme, nicht nur Multiplikatoren:** Jede Reset-Ebene schaltet eine neue Mechanik frei (C1) – als „Kapitel/Discs" thematisierbar.
- **Synergie statt Obsoleszenz:** Neue Layer sollen ältere Systeme *reaktivieren* (Synergism-Prinzip), nicht ersetzen.
- **Tiefe dosiert:** Nie alles auf einmal zeigen; Onboarding ist ein First-Class-Design-Ziel.
- **Story mit Ende + optionaler Endlos-Modus:** Narrativ (F1) trägt das Spiel; ein abgekoppeltes Endgame bedient Enthusiasten, ohne den Abschluss zu verwässern.
- **Humor als Würze, nicht als Krücke:** Der Parodie-Ton (F2) ist unser USP – aufgesetzt auf soliden Mechaniken, nicht als deren Ersatz.
- **Idle-Versprechen respektieren:** Falls wir Zeit-Druck (E3) nutzen, klar von Ruhe-Phasen trennen; Offline-Progress nie das aktive Spiel entwerten lassen.
- **Von Tag 1 an: saubere Zahldarstellung** und eine bewusste Aktiv/Idle-Effizienzkurve.

---

## 6. Quellen (Design-Theorie & Mechanik-Belege)

- [How to design idle games – Machinations.io](https://machinations.io/articles/idle-games-and-how-to-design-them)
- [Idle Games Best Practices – GridInc](https://gridinc.co.za/blog/idle-games-best-practices)
- [Lessons of my first incremental game – Game Developer](https://www.gamedeveloper.com/design/lessons-of-my-first-incremental-game)
- [The Math of Idle Games, Part III – Game Developer](https://www.gamedeveloper.com/design/the-math-of-idle-games-part-iii)
- [Incremental Game Review: Trimps – Game Developer](https://www.gamedeveloper.com/design/incremental-game-review-trimps)
- [Idle Game Design: Systems, Mechanics, and Progression – Missions Zanx](https://missionszanx.com/guides/idle-game-design-systems-mechanics-and-progression)
- [Progression and Scaling in Incremental Games – Missions Zanx](https://missionszanx.com/guides/progression-and-scaling-in-incremental-games)
- [Synergism – TV Tropes (Synergie-Design)](https://tvtropes.org/pmwiki/pmwiki.php/VideoGame/Synergism)
- [Active or idle? – Devlog (fourda)](https://fourda.itch.io/four-divine-abidings-full/devlog/981439/active-or-idle)
- [Incremental game – Wikipedia](https://en.wikipedia.org/wiki/Incremental_game)

> Grundlage der Mechanik-Extraktion ist zusätzlich die Titel- und Rezensionssammlung aus `01_Recherche_Incremental_Games.md` (Iteration 1).

# Fundament-Recherche: Was macht ein gutes Incremental Game aus?

**Projekt:** IncrementalFantasy – parodistisches Incremental Game in Anlehnung an Final Fantasy 7
**Dokumenttyp:** Recherche- und Analysegrundlage (Iteration 1)
**Stand:** 20.07.2026
**Autor:** Claude (Architektur & Produktmanagement)

---

## 1. Zielsetzung & Methodik

Bevor wir Mechaniken für unser Spiel festlegen, wollen wir empirisch verstehen, **welche Bausteine erfolgreiche Incremental Games ausmachen** und wie gut sich einzelne Mechaniken eignen. Dieses Dokument liefert dafür die belastbare Grundlage.

**Vorgehen:**

1. **Plattform-Auswahl** – Ermittlung der vier wichtigsten Vertriebsplattformen für Incremental/Idle Games (Steam gesetzt).
2. **Titel-Erhebung** – Pro Plattform die jeweils höchstbewerteten bzw. meistgenannten Titel (Community-Awards, Kuratoren-Rankings, Store-Bewertungen).
3. **Rezensionsanalyse** – Auswertung wiederkehrender Lob- und Kritikpunkte in Reviews (Steam, Google Play, App Store, r/incremental_games, Fachartikel).
4. **Mechanik-Katalog** – Sammlung der zentralen Spielmechaniken, jeweils bewertet nach *Eignung* und *Wichtigkeit*.
5. **Ableitung** – Priorisierte Erfolgsfaktoren und konkrete Implikationen für unser FF7-Parodie-Konzept.

> **Belastbarkeit / Einschränkung:** Die Daten stammen aus öffentlich verfügbaren Rankings, Store-Bewertungen, Kurationslisten und Community-Awards (2024–2026). Store-Scores wie „Player Score 96" (Steam250) sind aggregierte, gewichtete Bewertungen – gut für relative Einordnung, nicht als absolute Wahrheit. Community-Awards (r/incremental_games „Best of the Year") bilden die enthusiastische Kern-Zielgruppe ab, nicht den Massenmarkt. Beides zusammen ergibt ein tragfähiges Bild; Zahlen sollten vor finalen Design-Entscheidungen punktuell nachgeprüft werden.

---

## 2. Die vier wichtigsten Plattformen

| # | Plattform | Rolle im Genre | Typisches Monetarisierungsmodell | Charakter der Zielgruppe |
|---|-----------|----------------|----------------------------------|--------------------------|
| 1 | **Steam (PC)** | Heimat der „ernsthaften", tiefen Incrementals; höchste Zahlungsbereitschaft für Premium-Titel | Einmalkauf (oft 3–10 €), teils Free-to-Play | Kern-Enthusiasten, lange Sessions, hohe Toleranz für Komplexität |
| 2 | **Google Play (Android)** | Größter Massenmarkt für Idle Games; Herzstück der mobilen Awards | F2P mit Ads + IAP, teils Premium | Sehr breit, von casual bis hardcore; kurze, häufige Sessions |
| 3 | **Apple App Store (iOS)** | Premium-affiner mobiler Markt; höhere Zahlungsbereitschaft als Android | F2P + IAP, überdurchschnittlich viele Premium-Käufe | Zahlungsfreudiger, qualitätsbewusst |
| 4 | **Web / Browser (itch.io, Kongregate, Newgrounds, eigene HTML-Builds)** | Geburtsort und Innovationslabor des Genres; wo Trends entstehen (Cookie Clicker, Antimatter Dimensions, Universal Paperclips) | Meist kostenlos, gelegentlich Spenden/Patreon | Genre-Enthusiasten, experimentierfreudig, Prototyp-Publikum |

**Warum diese vier?** Sie decken die gesamte Wertschöpfungskette ab: Das **Web** ist der günstige Prototyping- und Innovationsraum (viele Kulthits starteten als HTML-Build und wanderten später auf Steam/Mobile). **Steam** monetarisiert Tiefe und Premium-Qualität. **Google Play** liefert Reichweite und Massenmarkt. **iOS** liefert die zahlungsfreudige mobile Premium-Nische. Für ein Parodie-Projekt ist besonders die Web→Steam-Pipeline relevant, weil sie mit kleinem Budget Reichweite und Feedback erlaubt.

> **Ergänzender Ökosystem-Hinweis – Roblox:** Neben den vier Kern-Plattformen ist **Roblox** ein bedeutender Verbreitungs- und Entstehungsraum für Incremental/Idle Games (insbesondere bei jüngeren Spielern). Unser Pflichttitel **Grass Cutting Incremental** ist ursprünglich ein **Roblox-Spiel** und wurde dort viral, bevor Standalone-Ports für Steam/Android/iOS in Arbeit gingen. Roblox eignet sich als zusätzlicher Test- und Reichweitenkanal, hat aber ein eigenes Monetarisierungs- und Zielgruppen-Ökosystem (Robux, sehr junges Publikum) – für unser Premium-orientiertes, story-getriebenes Konzept eher nachrangig, aber als Discovery-Kanal beobachtenswert.

---

## 3. Top-Spiele je Plattform

> Auswahl nach Store-Rankings (Steam250, Steambase), Kurationslisten (GameSpot, Pocket Gamer, MiniReview) und Community-Awards (r/incremental_games). Klassiker sind separat gelistet, weil sie plattformübergreifend das Genre geprägt haben.

### 3.1 Steam (PC)

| Titel | Einordnung / Score | Modell | Kernmechanik-Signatur |
|-------|--------------------|--------|-----------------------|
| VPet-Simulator | Steam250 #1 (Player Score ~96) | Free | Desktop-Pet + Incremental, hohe „Nebenbei"-Präsenz |
| Touhou Mystia's Izakaya | Player Score ~96 | 5,99 $ | Management/Sim mit Incremental-Loop, Steam-Deck-verifiziert |
| Shelldiver | Player Score ~96 | 4,99 $ | Kompaktes, fokussiertes Incremental |
| Magic Archery | Player Score ~95 | Free | Action-Incremental |
| Bongo Cat | Player Score ~95 | Free | Minimal-Clicker mit hoher Zugänglichkeit |
| **Increlution** | „Very Positive", ~84 % positiv | Premium (Early Access) | Zeitschleifen-/Roguelite-Meta-Progression (**Pflichttitel, s. §6**) |
| Milky Way Idle | Early-Access-Hit seit 03/2025, regelmäßige Updates | F2P | Browser/Steam-MMO-Idle, Skill-Progression |
| Melvor Idle | Genre-Referenz (RuneScape-inspiriert) | Premium + DLC | RPG-Skill-Idle, riesiger Content-Umfang |

### 3.2 Google Play (Android)

| Titel | Einordnung | Modell | Kernmechanik-Signatur |
|-------|-----------|--------|-----------------------|
| **Cell: Idle Factory Incremental (CIFI)** | r/incremental_games „Bestes mobiles Incremental" **2023, 2024 & 2025** | F2P, fair | Fabrik-/Automatisierungs-Incremental, tiefe Progression |
| Magic Research 2 | 4,8/5 (Google Play & iOS) | Premium (Einmalkauf) | Incremental-RPG, 120+ Zauber, definiertes Ende |
| Egg, Inc. | Dauerbrenner, Genre-Ikone mobil | F2P + IAP | Farm-Idle mit Prestige, Co-op-Events |
| Idle Slayer | Sehr beliebt | F2P | Auto-Runner + Idle-RPG, Prestige |
| IdleOn (Legends of Idleon) | Populäres MMO-Idle | F2P | Multi-Charakter, 15+ Skills, MMO-Struktur |
| Soda Dungeon 2 | Konstant in Top-Listen | F2P/Premium | Auto-Dungeon-Crawler, Party-Management |
| Antimatter Dimensions | Portierter Web-Klassiker | Free | Tiefe, verschachtelte Prestige-Layer |

### 3.3 Apple App Store (iOS)

| Titel | Einordnung | Modell | Kernmechanik-Signatur |
|-------|-----------|--------|-----------------------|
| Melvor Idle | Top-Ranking 2025 | Premium | RPG-Skill-Idle |
| Magic Research 2 | 4,8/5, ~997+ Reviews | Premium | Incremental-RPG mit fairem Modell |
| Soda Dungeon 2 | Dauerhaft in Top-10-Listen | F2P/Premium | Auto-Party-Crawler |
| Idle Research | Häufig empfohlen | F2P | Wissenschafts-/Labor-Idle |
| AdVenture Capitalist | Genre-Ikone, Massentitel | F2P + IAP | „Ur-Business-Idle", Prestige-Angels |
| Egg, Inc. | Plattformübergreifend stark | F2P + IAP | Farm-Idle, Prestige |
| Idle Slayer | Action-Idle | F2P | Auto-Combat + Prestige |

### 3.4 Web / Browser (itch.io, Kongregate, Newgrounds)

| Titel | Bedeutung fürs Genre | Kernmechanik-Signatur |
|-------|----------------------|-----------------------|
| **Cookie Clicker** (2013) | Popularisierte das gesamte Genre | Klassischer Clicker → Gebäude, Upgrades, Prestige (Heavenly Chips), Events |
| **Antimatter Dimensions** | Referenz für „Prestige-auf-Prestige"-Tiefe | Infinity → Eternity → Reality-Layer, eigene Zahlnotation |
| **Universal Paperclips** | Kritiker-Liebling, narrative Innovation | Ein-Sitzungs-Incremental mit Story-Bogen & klarem Ende |
| **Kittens Game** | Komplexe Zivilisations-Simulation | Ressourcen-Web, viele Epochen, tiefe Resets |
| **Grass Cutting Incremental** | Ursprünglich **Roblox-Spiel**, dort viral; Steam-/Mobile-Ports in Arbeit | 5+ Reset-Layer, jeweils eigene Prestiges & Mechaniken (**Pflichttitel, s. §6**) |
| **Melvor Idle** (Ursprung Web) | RuneScape-inspiriertes Skill-Idle | HTML-basiert, später Steam/Mobile |
| **NGU Idle** | Kult-Klassiker; auf Steam „Overwhelmingly Positive" (95 % von >10.700 Reviews) | „Number Go Up" pur, dutzende verschachtelte Feature-Freischaltungen, absurder Humor & eigene Art-Identität |
| **Trimps** | Community-Dauerbrenner, endlos, sehr geschätzt für strategische Tiefe | Zonen-/Kampf-Progression, Portal-Soft-Reset + Helium/Perks, 400+ Achievements, 50+ Challenges |
| **Realm Grinder** | Community-Dauerbrenner | Mehrschichtige Prestige-Systeme (Abdicate/Reincarnate/Ascend), sehr langes Endgame |

**Community-Award-Signal (r/incremental_games „Best of 2024"):** *Magic Research 2* dominierte mehrere Kategorien (Balance aus Komplexität und Zugänglichkeit), *Unnamed Space Idle* wurde für konsequente Updates und faires F2P-Modell ausgezeichnet; Web-Titel wie *Midnight Idle* und *Shark Incremental* erhielten Anerkennung. **Muster:** Prämiert werden faire Monetarisierung, kontinuierliche Updates und die Balance aus Tiefe und Zugänglichkeit – nicht rohe Zahlengröße.

---

## 4. Rezensionsanalyse: Was Spieler lieben und hassen

### 4.1 Wiederkehrende Lobpunkte (Treiber positiver Bewertungen)

- **„Nur noch ein Upgrade"-Sog** – befriedigende, spürbar getaktete Progression mit ständigem Fortschritts-Feedback. Kein Loss-Zustand, konstantes Wachstum → sehr hohe Retention.
- **Sinnvoll gestaffelte Ziele** – kurzfristige Ziele geben einen Grund, *heute* zu spielen; langfristige Ziele einen Grund, *morgen* zurückzukommen. Diese Doppelung ist der stärkste Retention-Hebel.
- **Faire Monetarisierung** – Einmalkauf-Modelle (Magic Research 2, Melvor Idle) werden explizit als Kaufgrund genannt; Spieler „belohnen" die Abwesenheit von Zeit-Paywalls.
- **Meilenstein-Freischaltungen** – neue Mechaniken/Systeme bei Schwellenwerten halten die Neugier wach („es gibt immer etwas Interessantes zu tun").
- **Befriedigende Resets** – ein zuvor zäher Abschnitt wird nach dem Prestige „durchgeblasen" – dieses Gefühl wird immer wieder als Highlight genannt (Increlution, Antimatter Dimensions).
- **Charme & Atmosphäre** – überraschend oft nennen Reviews Ton, Humor, Story und Ästhetik als Bindungsfaktor (Universal Paperclips, Grass Cutting Incremental, NGU Idle mit seinem absurden Humor und eigener Art-Identität). **Für unser Parodie-Konzept besonders relevant** – bei NGU Idle wird der Humor als klarer Persönlichkeits- und Bindungsfaktor genannt (mit dem Hinweis, dass er polarisiert – man liebt oder hasst ihn).
- **Klares Ende** (Nischen-Stärke) – ein definiertes „Durch"-Gefühl unterscheidet Premium-Titel positiv vom „Endlos-Laufband".

### 4.2 Wiederkehrende Kritikpunkte (Treiber negativer Bewertungen)

- **Zu langsames Tempo / Grind-Walls** – der häufigste Vorwurf: gefühlt endloses Warten ohne spürbaren Fortschritt.
- **Aggressive Monetarisierung** – Zeit-Paywalls und aufdringliche Werbung; der Vorwurf, das Spiel sei „bewusst frustrierend designt, um zum Zahlen zu zwingen".
- **Schlechte Aktiv/Idle-Balance** – wenn eine Spielweise (nur klicken *oder* nur warten) klar dominiert, fühlt sich das Spiel unbelohnend an.
- **Dünnes Endgame / Repetition** – begrenzter Endgame-Content und Loops, die nach vielen Stunden nur noch zäh sind.
- **Undurchsichtige Systeme** – zu viel Komplexität ohne Erklärung (Onboarding-Problem) verschreckt neue Spieler; das Gegenstück zu „Tiefe" ist „Verwirrung".

> **Kern-Spannungsfeld:** *Tiefe vs. Zugänglichkeit* und *Fortschrittsgefühl vs. Wall*. Die meistgelobten Titel lösen beides – sie sind tief, aber onboarden sanft, und sie halten das Fortschrittsgefühl auch durch Walls hindurch aufrecht (z. B. weil während einer Wall weiter Prestige-Währung fließt).

---

## 5. Mechanik-Katalog mit Bewertung

Jede Mechanik ist bewertet nach **Eignung** (wie gut trägt sie ein Incremental Game generell) und **Wichtigkeit** (wie essenziell für Erfolg / wie oft in Top-Titeln vorhanden). Skala 1–5 (5 = höchste). Die letzte Spalte gibt eine Einschätzung für **unser FF7-Parodie-Projekt**.

| Mechanik | Was sie ist | Eignung | Wichtigkeit | Beispiele | Relevanz für uns |
|----------|-------------|:------:|:----------:|-----------|------------------|
| **Kern-Loop (Ressource → Upgrade → mehr Ressource)** | Exponentielles Wachstum durch Reinvestition | 5 | 5 | Alle | Pflicht – Fundament |
| **Prestige / Reset-Layer** | Fortschritt zurücksetzen gegen permanente Boni + Meta-Währung | 5 | 5 | Cookie Clicker, Antimatter Dim., Grass Cutting, Trimps (Portal/Helium) | Pflicht – Kern der Langzeitmotivation |
| **Automatisierung** | Manuelle Aktionen werden automatisiert; entlastet Klick-Ermüdung | 5 | 5 | CIFI, Kittens Game | Pflicht – nach frühem aktiven Einstieg |
| **Offline-Progress** | Fortschritt läuft bei geschlossenem Spiel weiter | 5 | 4 | Egg Inc., IdleOn | Hoch – v. a. für Mobile-Version |
| **Meilenstein-/Unlock-Gating** | Neue Systeme bei Schwellenwerten | 5 | 5 | Magic Research 2, Melvor, NGU Idle | Pflicht – hält Neugier & Pacing |
| **Mehrschichtige Meta-Progression** | Prestige auf Prestige (mehrere Ebenen) | 4 | 4 | Antimatter Dim. (Infinity/Eternity/Reality), Realm Grinder, Trimps | Mittel-hoch – erst nach Kern etablieren; Overkill-Gefahr |
| **Feature-Kaskade („Number Go Up")** | Laufend neue, ineinandergreifende Systeme, die sich gegenseitig verstärken | 4 | 4 | NGU Idle, Trimps | Hoch – trägt Langzeit-Sog, wenn mit Humor/Identität gekoppelt |
| **Zeit-als-Ressource / Zeitschleife** | Jede Aktion kostet Zeit/Leben, Tod → Meta-Progression | 4 | 3 | Increlution, Stuck In Time | Mittel – thematisch stark koppelbar (FF-Zeit/Tod-Motive) |
| **Skill-Trees / RPG-Progression** | Viele parallele Fähigkeiten leveln | 4 | 4 | Melvor, IdleOn, Idle Slayer | Hoch – passt exzellent zu FF-Materia/Job-System-Parodie |
| **Aktiver Clicker-Einstieg** | Manuelles Tappen früh im Spiel | 4 | 3 | Cookie Clicker, Bongo Cat | Mittel – als Einstieg gut, muss automatisierbar werden |
| **Narrativer Bogen / definiertes Ende** | Story-getriebene Progression mit Abschluss | 4 | 3 | Universal Paperclips, Increlution, Magic Research 2 | Hoch – unser USP: Parodie-Story trägt das Ganze |
| **Prozedurale/„New Game+"-Wiederholbarkeit** | Roguelite-Elemente, variierte Läufe | 3 | 3 | Increlution, Soda Dungeon 2 | Mittel – optional |
| **Ressourcen-Netz / Wirtschaftssimulation** | Viele interagierende Ressourcen | 3 | 3 | Kittens Game, CIFI | Mittel – erhöht Tiefe, aber auch Onboarding-Last |
| **Co-op / Events / Social** | Zeitlich begrenzte Events, Gilden | 3 | 3 | Egg Inc., IdleOn | Niedrig-mittel – eher Live-Ops-Phase |
| **Prämium-Einmalkauf** | Faires Modell: einmaliger Kaufpreis, danach voller Zugriff | 5 | 4 | Magic Research 2, Melvor | **Einziges für uns zulässiges Monetarisierungsmodell** (falls überhaupt monetarisiert) – passt zu Steam/Enthusiasten & Award-Kultur |
| **Ads/IAP-„Boosts"** | Werbung / In-Game-Käufe für Beschleunigung | 2 | 2 | viele Mobile-F2P | **Für unser Projekt ausgeschlossen** – Reputationsrisiko, häufigster Kritikpunkt; In-Game-Käufe kommen nicht in Frage |

### Ableitung aus der Matrix

Die **fünf unverzichtbaren Bausteine** (Eignung 5 / Wichtigkeit 5) bilden das Skelett jedes erfolgreichen Incrementals: **Kern-Loop, Prestige-Reset, Automatisierung, Meilenstein-Gating** – und, streng genommen als übergreifende Anforderung, ein **sauberes Pacing**, das diese vier verbindet. Alles Weitere sind Differenzierungs-Layer, die *auf* diesem Skelett aufgebaut werden – niemals als Ersatz dafür.

---

## 6. Deep Dives: Die zwei Pflichttitel

### 6.1 Grass Cutting Incremental

**Was:** Ein ursprünglich **auf Roblox** entwickeltes Idle-Spiel, in dem man Gras schneidet, um mehr Gras zu schneiden – bis zur Industrialisierung und zum „Abflug ins All". Es wurde innerhalb des Roblox-Ökosystems viral; eigenständige Standalone-Ports für Steam, Android und iOS sind angekündigt (Release voraussichtlich ab 2026). Der Roblox-Ursprung erklärt auch die niedrige Einstiegshürde und die junge, große Reichweite. 

**Warum es funktioniert:**
- **Über 5 Reset-Layer**, jeder mit **eigenem Prestige und eigenen, neu freigeschalteten Mechaniken** – ständig neue Systeme statt bloß größerer Zahlen. Musterbeispiel für gestaffeltes Unlock-Gating.
- **Sehr gute Balance** der Progression – wird durchgehend als „nicht der übliche Clicker/Idler" gelobt.
- **Atmosphäre & Extras:** kurze Story, Puzzles und Geheimnisse erzeugen eine surreale, leicht unheimliche Stimmung, die über die reine Zahlenmechanik hinaus bindet.
- **Zugänglicher Hook** (banales Thema „Gras schneiden") mit überraschender Tiefe – niedrige Einstiegshürde, hohe Ausbaustufe.

**Lehre für uns:** Ein alltägliches/absurdes Thema als Einstieg + gestaffelte, mechanisch *unterschiedliche* Prestige-Layer + eine Prise Story/Geheimnisse. Genau die Kombination, die eine Parodie tragen kann.

### 6.2 Increlution

**Was:** Minimalistisches Incremental über **Zeitmanagement** mit Roguelite-/Meta-Progression. Jede Aktion kostet **Zeit und Gesundheit**, bringt aber **Erfahrung** in Skills. Der Tod ist unausweichlich; die gesammelte Erfahrung wird in **Instinct** (permanente Meta-Währung) umgewandelt, die jedes folgende „Leben" effizienter macht. „Very Positive" auf Steam (~84 % positiv), Start 13.10.2021, ~220 h Content über 11 Kapitel (Early Access, Ziel 20–25 Kapitel).

**Warum es funktioniert:**
- **Zeit als knappe Kernressource** erzeugt echte Spannung statt reinem Warten – ein Gegenentwurf zum passiven Idle.
- **Meta-Progression über den Tod** („jede Generation etwas fähiger") liefert das befriedigende „Durchblasen" früherer Abschnitte – der von Spielern meistgelobte Moment.
- **Minimalistische Präsentation**, aber tiefe Systeme – zeigt, dass Fokus schlägt Feature-Überladung.
- **Roguelite-Wiederholbarkeit** hält die Progression variantenreich.

**Lehre für uns:** Der Zeitschleife-/Tod-und-Wiedergeburt-Loop lässt sich thematisch hervorragend mit FF-Motiven (Lebensstrom, Wiedergeburt, „Reunion") parodieren und liefert gleichzeitig eine mechanisch bewährte Meta-Progression.

---

## 7. Priorisierte Erfolgsfaktoren (die wichtigsten Aspekte)

In Reihenfolge der Wichtigkeit – abgeleitet aus Rankings, Awards und Rezensionsmustern:

1. **Pacing über alles.** Der Rhythmus aus Belohnung und Wall entscheidet über Erfolg oder Bounce. Zu großzügig → schnell „durch", nichts mehr zu jagen. Zu eng → Wall, Spieler bricht ab. Der Trick: Auch *während* einer Wall muss spürbar Meta-Währung fließen, damit Fortschritt nie ganz stoppt.
2. **Doppelte Zielstruktur.** Immer parallel ein kurzfristiges Ziel (Grund für heute) und ein langfristiges (Grund für morgen).
3. **Gestaffeltes Unlock-Gating.** Neue *Mechaniken* (nicht nur größere Zahlen) an Meilensteinen – hält Neugier und verhindert Monotonie. Grass Cutting Incremental ist hier Vorbild.
4. **Prestige mit Sinn.** Jeder Reset muss sich lohnen, ohne frühere Erfolge zu entwerten. Klar spürbarer Effizienzgewinn.
5. **Tiefe *mit* sanftem Onboarding.** Komplexität schrittweise einführen; die meistgelobten Titel sind tief, aber führen behutsam ein. Komplexität ohne Erklärung ist ein Top-Kritikpunkt.
6. **Faire Monetarisierung.** Premium-Einmalkauf statt Zeit-Paywalls/Ads – letztere sind der häufigste Reputationskiller, Awards belohnen Fairness. **Für IncrementalFantasy ist das bereits entschieden (s. §8): keine Monetarisierung; falls überhaupt, dann ausschließlich ein einmaliger Kaufpreis, keine In-Game-Käufe.**
7. **Automatisierung + Offline-Progress.** Klick-Ermüdung vermeiden; das Spiel muss „nebenbei" laufen können (v. a. Mobile).
8. **Charme, Ton & Identität.** Überraschend oft der emotionale Bindungsfaktor – und für ein Parodie-Konzept unser potenziell stärkster Differenzierer.
9. **Kontinuierliche Updates.** Ausgezeichnete Titel (Unnamed Space Idle, Milky Way Idle) liefern regelmäßig nach; Live-Content sichert Langzeit-Retention.
10. **Ein Gefühl von „Ziel/Ende".** Ein definierter Abschluss oder klare Endgame-Vision hebt Titel positiv vom „Endlos-Laufband" ab.

---

## 8. Implikationen für IncrementalFantasy (FF7-Parodie)

**Was die Daten für unser Konzept nahelegen:**

- **Story-getriebenes Incremental statt reines Idle.** Unsere größte Chance liegt an der Schnittstelle *Universal Paperclips / Increlution / Magic Research 2*: mechanisch tief, aber mit erzählerischem Bogen und Humor. Die FF7-Parodie ist kein Deko-Layer, sondern der USP.
- **FF-Systeme sind natürliche Incremental-Mechaniken.** Materia/Job-System → Skill-Trees; Limit-Breaks → aktive Klick-Peaks; Lebensstrom/Wiedergeburt → Zeitschleife-/Prestige-Meta (Increlution-Modell); Party-Aufbau → Auto-Party (Soda Dungeon). Die Parodie schreibt sich hier fast von selbst.
- **Gestaffelte Prestige-Layer mit je eigener Mechanik** (Grass-Cutting-Prinzip), thematisiert als „Kapitel"/„Discs" – ein direkter, witziger FF7-Bezug (das Original hatte 3 Discs).
- **Monetarisierung – Leitentscheidung (festgelegt):** Das Spiel soll **nicht monetarisiert** werden. Falls überhaupt, dann **ausschließlich über einen einmaligen Kaufpreis** (Premium). **In-Game-Käufe, Zeit-Paywalls und Werbung sind ausgeschlossen.** Das deckt sich exakt mit dem stärksten positiven Signal aus Awards und Rezensionen (Magic Research 2, Melvor Idle) und eliminiert zugleich den häufigsten Kritikpunkt des Genres. Passt außerdem ideal zu einem story-getriebenen Titel mit definiertem „Ende". Konsequenz fürs Design: Balancing muss ohne monetären Beschleuniger auskommen – Pacing und Automatisierung müssen die Progression allein tragen.
- **Web-Prototyp zuerst.** Günstig, schnelles Community-Feedback (r/incremental_games), bewährte Web→Steam-Pipeline. Ideal für ein parodistisches Passionsprojekt.

**Anti-Pattern, die wir vermeiden:** Zeit-Paywalls, aggressive Ads, undurchsichtige Systeme ohne Onboarding, dominante Einseitigkeit (nur Klick *oder* nur Idle), und rohes Zahlenwachstum ohne neue Mechaniken.

---

## 9. Offene Fragen & nächste Schritte

- **Primärplattform final festlegen:** Web-Prototyp → Steam-Premium (Empfehlung) vs. Mobile-First? Beeinflusst Session-Länge und Monetarisierung.
- **Aktiv- vs. Idle-Gewichtung:** Wie viel manuelles Spiel wollen wir früh verlangen, bevor Automatisierung greift?
- **Story-Umfang:** Durchgehende Parodie-Kampagne mit Ende (Magic-Research-Modell) vs. endloses Endgame? Empfehlung tendiert zu definiertem Ende + optionalem Endgame.
- **Mechanik-Deep-Dive:** Als nächste Iteration je eine detaillierte Design-Spezifikation für die fünf Kern-Bausteine + das Zeitschleife-/Prestige-Meta.
- **Charakter-/Parodie-Konzept:** Eigener Workstream – „an FF7 erinnernde, aber neue, lustige Charaktere" gegen Mechanik-Rollen mappen (Cloud→Klon-Söldner, Materia→„Materie"-Kugeln etc.).

---

## 10. Quellen (Auswahl)

**Plattform-Rankings & Store-Daten**
- [Top Incremental Games on Steam – Steam250](https://steam250.com/tag/incremental)
- [Best incremental Games on Steam – Steambase](https://steambase.io/games/best-incremental-steam-games)
- [Best Steam incremental & idle games – topincrementalgames.com](https://www.topincrementalgames.com/platform/steam)
- [The 29 Best Idle Games – GameSpot](https://www.gamespot.com/gallery/best-idle-games/2900-5676/)
- [11 best idle games for Android – Android Authority](https://www.androidauthority.com/best-idle-games-incremental-games-android-3263710/)
- [Best idle games on Android – Pocket Gamer](https://www.pocketgamer.com/android/best-android-idle-games/)
- [Best Idle Games for iOS – ComputerCity](https://computercity.com/software/gaming/best-idle-games-ios)
- [Best Idle Games for iPhone 2025 – madfox.dev](https://madfox.dev/en/top10_idle_games_for_iphone)
- [Best Mobile Incremental Games – MiniReview](https://minireview.io/category/incremental)
- [Top games tagged Incremental – itch.io](https://itch.io/games/tag-incremental)

**Pflichttitel**
- [Grass Cutting Incremental – incrementaldb](https://www.incrementaldb.com/game/grass-cutting-incremental)
- [Grass Cutting Incremental – TV Tropes](https://tvtropes.org/pmwiki/pmwiki.php/VideoGame/GrassCuttingIncremental)
- [Increlution – incrementaldb](https://www.incrementaldb.com/game/increlution)
- [Increlution on Steam](https://store.steampowered.com/app/1593350/Increlution/)

**Weitere Klassiker (NGU Idle, Trimps)**
- [NGU IDLE on Steam](https://store.steampowered.com/app/1147690/NGU_IDLE/)
- [NGU Idle – Glitchwave](https://glitchwave.com/game/ngu-idle/)
- [Trimps (offizielles Spiel)](https://trimps.github.io/)
- [Incremental Game Review: Trimps – Game Developer](https://www.gamedeveloper.com/design/incremental-game-review-trimps)
- [Trimps – TV Tropes](https://tvtropes.org/pmwiki/pmwiki.php/VideoGame/Trimps)

**Design-Theorie & Rezensionen**
- [Incremental game – Wikipedia](https://en.wikipedia.org/wiki/Incremental_game)
- [The Math of Idle Games, Part III – Game Developer](https://www.gamedeveloper.com/design/the-math-of-idle-games-part-iii)
- [Progression and Scaling in Incremental Games – Missions Zanx](https://missionszanx.com/guides/progression-and-scaling-in-incremental-games)
- [Idle Game Design: Systems, Mechanics, and Progression – Missions Zanx](https://missionszanx.com/guides/idle-game-design-systems-mechanics-and-progression)
- [Clicker Games: Technical Exploration – Medium (Tommcfly)](https://medium.com/@tommcfly2025/clicker-games-a-technical-exploration-of-incremental-system-architecture-b6d842e6963e)
- [Magic Research 2 – incrementaldb](https://www.incrementaldb.com/game/magic-research-2)
- [Unnamed Space Idle review – incrementaldb](https://www.incrementaldb.com/community/review/1456)
- [Best of 2024 Results – r/incremental_games](https://www.reddit.com/r/incremental_games/comments/1hv0x56/best_of_2024_results/)

> *Hinweis: Store-Scores und Prozentangaben sind Momentaufnahmen (2024–2026) und können sich ändern. Vor finalen Design-Entscheidungen empfiehlt sich eine punktuelle Nachprüfung der jeweils aktuellen Werte.*

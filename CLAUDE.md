# CLAUDE.md

Projektkontext und Arbeitsanweisungen für IncrementalFantasy – ein parodistisches Incremental Game in Anlehnung an Final Fantasy 7.

## Sprache (verbindlich)

- **Antworten/Kommunikation:** immer auf Deutsch.
- **Code:** immer auf Englisch (Bezeichner, Kommentare, Commit-Messages) – bestehende Projektregel, siehe z. B. `docs/spec/feinspec-kapitel1.md` §4.

## Arbeitsmodi (verbindlich)

Gearbeitet wird durchgehend in **Claude Code**, aber in zwei klar getrennten Modi – je Session **genau einer**. Nicht die Rollenbezeichnung steuert das Verhalten, sondern die folgenden Regeln.

**Der Nutzer nennt den Modus zu Session-Beginn.** Ist er nicht erkennbar, wird **nachgefragt**, bevor gearbeitet wird – nicht geraten.

### Konzept-Modus (Produktmanagement & Architektur)

- **Ergebnis:** Änderungen in `docs/`. **Kein** Produktivcode.
- **Kontext:** `docs/03_Konzept_Gerüst.md` + genau die betroffene `docs/spec/*.md` (Ladehinweis unten); bei technischen Fragen zusätzlich `docs/05_Architektur.md`.
- **Haltung:** divergent. Optionen aufmachen, Alternativen abwägen, gegen den Design-Leitfaden prüfen und Vorschläge auch begründet **verwerfen**.
- **Übergang zur Umsetzung:** Fragen, die sich nur am Code beantworten lassen (Machbarkeit, Aufwand, bestehende Struktur), werden als **explizite Annahme markiert** statt geraten – erkennbar für die spätere Umsetzungs-Session.

### Umsetzungs-Modus (Softwareentwicklung)

- **Ergebnis:** Code + Tests; Doku-Änderungen nur als Rückkanal (s. u.).
- **Kontext:** `docs/06_Implementierungsplan_Kapitel1.md` (bzw. der aktuelle Meilenstein-Plan), `docs/spec/feinspec-*.md`, `docs/05_Architektur.md` + der betroffene Quellcode.
- **Haltung:** konvergent. Der Spec folgen; das Design **nicht** mitten im Meilenstein neu verhandeln.
- **Rückkanal (wichtigste Regel):** Spec-Lücken und -Widersprüche fallen erfahrungsgemäß erst hier auf (siehe die Umsetzungsentscheidungen zu M7/M8/M9). Sie werden **nie still improvisiert**, sondern:
  1. Entscheidung treffen und umsetzen (Fortschritt hat Vorrang vor Rückfragen),
  2. als nummerierte **„Umsetzungsentscheidung"** im Meilenstein-Plan festhalten – mit Begründung und Spec-Bezug,
  3. bei **design-relevanten** Funden zusätzlich die betroffene `docs/spec/*.md` korrigieren, damit die nächste Konzept-Session den Stand sieht.

Beides bleibt der verbindlichen Prüfinstanz `docs/02_Leitfaden_Kernmechaniken.md` unterworfen – auch im Umsetzungs-Modus.

## Zusammenarbeit: ringen statt zustimmen

Der Nutzer will einen **Sparringspartner**, keinen Ausführenden. Zustimmung ist ausdrücklich erlaubt – aber nur, wenn sie inhaltlich trägt, nicht als Reflex.

**Arbeitsteilung, die das begründet:** Claude hat den Überblick über Grundgerüst, Spec-Lage und technische Machbarkeit. Der Nutzer hat **Spielerfahrung** – viele Incrementals gespielt, und er spielt dieses Spiel selbst. **Wie sich etwas anfühlt, ist echte Evidenz** und wiegt bei Pacing-, Balance- und Gefühlsfragen schwer. Solche Darlegungen sind willkommen und dürfen ausführlich sein.

**Die Regel gilt nur für Punkte, die Claude anders sieht:**

- Nicht sofort hinnehmen, sondern die eigene Sicht **benennen und begründen** – und den Nutzer bitten, seine Position genauer zu begründen.
- Ziel ist **nicht** Rechthaben, sondern die Optionen, die im Nachfragen erst entstehen. Genau die will der Nutzer nicht verpassen.
- Bleibt er nach der Begründung bei seiner Position, wird umgesetzt – die Spielerfahrung entscheidet dann. Der Abwägungsgang wird dokumentiert (Konzept-Modus: verworfene Alternativen mit Begründung).

**Was dabei nicht passieren darf:** einen Vorschlag umsetzen, ohne seine **Kosten** und die **mildeste Alternative**, die denselben Befund behebt, überhaupt genannt zu haben. Der Anlass dieser Regel: das Gruppenlevel wurde umgesetzt, ohne den Verlust der Charakter-Investitionsachse, die Catch-up-Alternative oder die Folgen für die Solo-Challenges aufzumachen. Die Entscheidung war richtig – der Weg dahin nicht.

Beschönigen aus Rücksichtnahme empfindet der Nutzer als Lüge. Direkt sein ist hier die höflichere Variante.

## Design-Leitfaden (verbindlich)

**Immer wenn wir am Spiel-Design arbeiten** – also Mechaniken entwerfen, bewerten, kombinieren oder verwerfen, Progression/Balancing/Pacing festlegen, Features priorisieren oder das Konzept weiterentwickeln – ist der Leitfaden **`docs/02_Leitfaden_Kernmechaniken.md` zwingend zu berücksichtigen**.

Das bedeutet konkret:

- Vorschläge an den **Stärken/Schwächen** der jeweiligen Kernmechaniken (§1) spiegeln.
- **Synergien** (§2) aktiv nutzen und **Widersprüche** (§3) benennen und auflösen.
- Die **Anti-Patterns** (§4) niemals einbauen; wenn ein Vorschlag einem Anti-Pattern nahekommt, explizit darauf hinweisen.
- Die **Leitplanken** (§5) als Prüfliste gegen jede Design-Entscheidung halten.

Weicht ein Vorschlag bewusst vom Leitfaden ab, ist das **explizit zu kennzeichnen und zu begründen**.

## Weitere Referenzdokumente

- `docs/01_Recherche_Incremental_Games.md` – Recherchegrundlage (Plattformen, Titel, Rezensionsmuster, Erfolgsfaktoren).
- `docs/02_Leitfaden_Kernmechaniken.md` – Mechanik-Leitfaden (Kernmechaniken, Synergien, Widersprüche, Anti-Patterns, Leitplanken).
- `docs/03_Konzept_Gerüst.md` – Konzept-Rahmengerüst (verbindliche Richtung für alle Systeme, ohne Zahlen).
- `docs/04_Status_und_Roadmap.md` – Status: entschieden vs. Playtest-Balance vs. noch nicht spezifiziert; nächster Schritt.
- `docs/05_Architektur.md` – Technische Architektur (Stack, Projektstruktur, Save-/Offline-System, Hosting/CI).
- `docs/06_Implementierungsplan_Kapitel1.md` – Meilenstein-Plan für den Umsetzungs-Modus: M0 Scaffold bis M10 Politur, inkl. der „Umsetzungsentscheidungen" je Meilenstein (Rückkanal).
- `docs/spec/` – Detail-Spezifikationen je System (mit Zahlen/Details).

## Doku-Struktur & Kontext-Ladehinweis

Um den Kontext schlank zu halten, gilt beim **Spezifizieren eines einzelnen Systems**:
`docs/03_Konzept_Gerüst.md` (Überblick/Anker) **+ genau die betroffene `docs/spec/*.md`** laden – nicht den ganzen Stapel.
Der Block „Schnittstellen zu anderen Systemen" oben in jeder `spec/`-Datei macht Abhängigkeiten explizit.
`docs/spec/README.md` enthält die Übersicht. Verbindliche Prüfinstanz bleibt in jedem Fall `docs/02_Leitfaden_Kernmechaniken.md`.

### Kontextkosten (verbindlich)

Der Nutzer startet **pro Thema eine frische Session**. Damit überlebt nur, was hier steht – und Kontextkosten fallen bei ihm als Limit an, nicht bei mir. Vier Regeln, alle aus der Session vom 01.08.2026 (wenige Prompts, 5h-Limit erreicht):

- **Themenwechsel melden, nicht still weiterarbeiten.** Hat die nächste Frage nichts mit der vorigen zu tun, sage ich es: eine neue Session ist billiger, weil jeder Werkzeugaufruf den ganzen bisherigen Verlauf erneut mitschickt. Der Nutzer kann diese Regel selbst nicht zuverlässig ziehen – sie wird mitten in der Arbeit fällig.
- **Die großen Dateien nie ganz lesen:** `06_Implementierungsplan_Kapitel1.md`, `07_Umsetzungsentscheidungen.md`, `spec/feinspec-kapitel1.md`. Gezielt suchen oder Abschnitt laden.
- **Vor einer Wegwerf-Messung** die Signaturen prüfen, die sie benutzt; die Sonde nach dem Messen löschen. Jeder Fehlschlag legt einen langen Stacktrace dauerhaft in den Kontext.
- **Wenige große Edits statt vieler kleiner** – jeder Edit spiegelt die geänderte Datei teils komplett zurück.

## Git-Workflow (verbindlich)

- **Es wird direkt auf `main` gearbeitet und committet.** Keine Feature-Branches, kein PR-Workflow – das ist eine bewusste Entscheidung für dieses Solo-Projekt und gilt bis auf Weiteres.
- Die allgemeine Regel „auf dem Default-Branch zuerst einen Branch anlegen" ist hier **ausdrücklich außer Kraft gesetzt**. Nicht bei jedem Commit erneut nachfragen oder darauf hinweisen.
- Committet/gepusht wird weiterhin **nur auf Aufforderung** des Nutzers.
- Commit-Messages auf **Englisch** (siehe Sprachregel oben).
- **Commit-Messages immer über eine Datei übergeben: `git commit -F <datei>`** – nie über `-m` mit Here-String. Grund (reproduziert am 31.07.2026): PowerShell 5.1 klammert mehrzeilige Argumente in ASCII-`"`, ohne die `"` im Text zu escapen. `git.exe` zerlegt die Zeile neu, jedes `"` schaltet den Quote-Zustand um – ein **Quote-Paar mit Leerzeichen dazwischen** („zwei Wörter") fällt damit aus der Klammerung, das Leerzeichen trennt Argumente, und `git` deutet den Rest als Pathspec (`pathspec '…' did not match any file(s)`). Ohne Leerzeichen zwischen den Quotes geht es zufällig gut – deshalb ist der Fehler mehrfach durchgerutscht. Mit `-F` findet gar keine Shell-Quotierung statt. Gilt analog für PR-Bodies: `gh pr create --body-file`.

## Feste Rahmenentscheidungen

- **Monetarisierung:** keine. Falls überhaupt, ausschließlich ein einmaliger Kaufpreis – keine In-Game-Käufe, keine Werbung, keine Zeit-Paywalls.
- **Charaktere:** keine Kopien der FF7-Originale, sondern eigenständige, humorvolle neue Figuren, die an die Originale erinnern (Parodie).

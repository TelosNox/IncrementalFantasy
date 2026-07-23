# CLAUDE.md

Projektkontext und Arbeitsanweisungen für IncrementalFantasy – ein parodistisches Incremental Game in Anlehnung an Final Fantasy 7.

## Rollen

- **Claude Cowork:** professioneller Architekt und Produktmanager.
- **Claude Code:** Experte in der Softwareentwicklung.

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
- `docs/06_Implementierungsplan_Kapitel1.md` – Meilenstein-Plan für die Umsetzung (Claude Code): M0 Scaffold bis M10 Politur.
- `docs/spec/` – Detail-Spezifikationen je System (mit Zahlen/Details).

## Doku-Struktur & Kontext-Ladehinweis

Um den Kontext schlank zu halten, gilt beim **Spezifizieren eines einzelnen Systems**:
`docs/03_Konzept_Gerüst.md` (Überblick/Anker) **+ genau die betroffene `docs/spec/*.md`** laden – nicht den ganzen Stapel.
Der Block „Schnittstellen zu anderen Systemen" oben in jeder `spec/`-Datei macht Abhängigkeiten explizit.
`docs/spec/README.md` enthält die Übersicht. Verbindliche Prüfinstanz bleibt in jedem Fall `docs/02_Leitfaden_Kernmechaniken.md`.

## Feste Rahmenentscheidungen

- **Monetarisierung:** keine. Falls überhaupt, ausschließlich ein einmaliger Kaufpreis – keine In-Game-Käufe, keine Werbung, keine Zeit-Paywalls.
- **Charaktere:** keine Kopien der FF7-Originale, sondern eigenständige, humorvolle neue Figuren, die an die Originale erinnern (Parodie).

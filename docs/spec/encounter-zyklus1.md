# Encounter & Monster-Stats – Zyklus 1 (bis 1. Reunion)

**Status:** Konkrete Platzierung + grobe Stats vorgeschlagen; alle Zahlen sind **Playtest-Stellschrauben**.
**Rahmen:** `../03_Konzept_Gerüst.md` §3/§4; setzt `gegner-encounter.md`, `gegner-katalog.md`, `progression-regionen.md`, `stats-kampfwerte.md` zusammen.
**Prüfinstanz:** `../02_Leitfaden_Kernmechaniken.md`.

## Stat-Konvention

- Werte sind **relativ** und grob. Party-Startwerte (Level 1) stehen in `stats-kampfwerte.md`; **Schaden nach Mitigations-Formel `ATK² / (ATK + DEF)`** (nicht `ATK − DEF`), damit hohe DEF zäh macht, aber nie unverwundbar. ATB-Intervall = Basis-T × 100/SPD (Basis-T ≈ 2,0 s).
- **SPD 100 = normale ATB-Rate** (1×). 150 ≈ 1,5× so oft am Zug, 70 ≈ 0,7×.
- **MAG** nur bei magischen Gegnern (in Zyklus 1 keiner).
- **Shock-Affinität:** alle hier **Neutral** (Shock baut langsam auf, s. `kampf-analyse-shock.md` §6). Kindlebales Feuer-Schwäche ist nur **Teaser** (nutzbar erst Kap. 2).

## Monster-Basiswerte (bei Einführung)

| Monster | HP | ATK | DEF | SPD | Besonderheit |
|---------|----|-----|-----|-----|--------------|
| **Blando** | 40 | 8 | 2 | 100 | – (Baseline) |
| **Caffiend** | 32 | 10 | 2 | 180 | handelt ~1,8× so oft → Suppress (Barrel) |
| **Safeguard** | 75 | 9 | 12 | 70 | sehr hohe DEF → physisch zäh; Konter: **schocken** (ignoriert DEF) oder Burst/Limit |
| **Kindlebale** | 55 | 8 | 3 | 90 | Feuer-Schwäche (Teaser, sichtbar via Analyse) |
| **Shortfuse** | 45 | 6 | 3 | 90 | Self-Destruct nach 3 Treffern → AoE ~2× Trefferschaden; feuer-immun |
| **Funkus** | 60 | 7 | 4 | 85 | Angriff vergiftet: ~4 Schaden/Tick × 4 Ticks |
| **Pilferret** | 38 | 6 | 3 | 150 | MP-Drain ~15 an einem Ziel, flieht nach ~4 eigenen Aktionen |

*Hinweis: Mit der Mitigations-Formel ist Safeguard (DEF 12) ~doppelt so zäh wie Blando, aber nicht unverwundbar. Gezielter Konter: **schocken** (ignoriert DEF im Fenster) – baut auch neutral auf, die volle Schwäche-Pointe kommt in Kap. 2.*

**Gates (beefte Varianten):**

| Gate | HP | ATK | DEF | SPD | Sprite-Größe | Rolle |
|------|----|-----|-----|-----|:---:|-------|
| **Blandzilla** (R1-Miniboss) | 130 | 11 | 4 | 90 | 1,5× (96px) | lehrt das **Limit** als Wand-Brecher |
| **Fort Knoxious** (R2-Gate) | 160 | 12 | 14 | 70 | 1,5× (96px) | zäher Panzer-Duo-Kampf |
| **Vaultron** (Kapitel-Wand, Boss) | 240 | 14 | 16 | 70 | 2× (128px) | telegrafierte Groß-Attacke; grindbare Wand |

*Namensherkunft & Visualisierung der Bosse: siehe `gegner-katalog.md` (Abschnitt „Bosse & Gates"). Sprites: `assets/bosses/`. Größenfaktor relativ zu den 64px-Standardsprites (Minibosse 1,5×, Kapitel-Boss 2×) – Bosse dürfen die Stage sichtbar dominieren.*

## Skalierung

- **Zonen-Wachstum:** effektive Werte = Basis × **g^(Zonen-Index − 1)**, mit **g ≈ 1,08** (tunbar). So steigt die Gesamtstärke glatt Zone für Zone (deine Leitregel).
- **Regions-Kontinuität:** der Zonen-Index läuft über das ganze Kapitel durch (R1 ≈ Zonen 1–8, R2 ≈ 9–18, R3 ≈ 19–30), sodass Region 2 dort anschließt, wo Region 1 endet.
- **Gate-Spike:** Miniboss/Boss/Wand ≈ **1,6–1,8×** der letzten regulären Zone der Region.
- **Varianten statt neuer Monster:** Größe/Farbe streuen die Stats um ~±15 % (kleiner = schwächer/schneller, größer = stärker/langsamer).

## Region 1 – Reactor Row (Reaktor-Slums, nur Claude)

Lehrziel: Kern-Loop, Auto-Attack-Freischaltung, Limit. **Nur Blando** (+ Größen-/Farb-Varianten), Wellen wachsen von 1 → 3.

- Z1–2: 1× Blando
- Z3–4: 2× Blando (eine größere Variante)
- Z5–7: 2–3× Blando (gemischte Größen)
- **Z8 (Miniboss):** 1× **Blandzilla** → erzwingt den ersten manuellen Limit-Einsatz.

## Region 2 – Bargain Bazaar (Barrel stößt dazu; Analyse)

Lehrziel: Analyse (Stats/Schwäche lesen), Kontrolle, Durability. Neu: **Caffiend** (ab Z9), **Safeguard** (ab Z11), **Kindlebale**-Teaser (ab Z12). Wellen 2–3.

- Z9–10: 1× Blando + 1× Caffiend (Speed spürbar → Barrels Suppress)
- Z11: 1× Safeguard (solo, zäh → zeigt „hier will ich später Schwäche/Magie")
- Z12–13: 1× Kindlebale + 1× Blando (Analyse enthüllt Feuer-Schwäche als Köder)
- Z14–15: 2× Caffiend + 1× Blando (Speed-Druck)
- Z16–17: 1× Safeguard + 1× Caffiend (zäh + flink zugleich)
- **Z18 (Gate):** **Fort Knoxious** + 1× Caffiend-Add.

## Region 3 – MegaCorp Tower (Tofa + Arris; Shock)

Lehrziel: Shock (generisch aufbauend + Tofa-Boost), Heilung/Defense, Ressourcen-Druck. Neu: **Funkus** (ab Z19), **Shortfuse** (ab Z21), **Pilferret** (ab Z23). Wellen 2–4.

- Z19–20: 1× Funkus + 1× Blando (Gift → Arris-Heilung wird nötig)
- Z21–22: 1× Shortfuse + 2× Blando (schnell wegbursten, bevor er hochgeht)
- Z23–24: 1× Pilferret + 1× Caffiend (MP-Druck + Flucht → Burst/Suppress)
- Z25–26: 1× Safeguard + 1× Funkus (zäh + Gift zugleich)
- Z27–29: 2× Shortfuse (Doppel-Bombe → Defense/Heilung-Test) bzw. gemischte 3–4er-Wellen
- **Z30 (Kapitel-Wand):** **Vaultron** + 2× Blando-Adds; telegrafierte Groß-Attacke. Bewusst **grindbare Idle-Wand** (manuell schneller; per Reunion-Grind auch schaffbar) → Übergang zur 1. Reunion.

## Offene Detailfragen (Playtest)

- Feinjustage aller Werte und des Wachstumsfaktors g; genaue Zonen-Zahl je Region.
- Self-Destruct-Schaden, Gift-Ticks, MP-Drain-Höhe und Flucht-Timing.
- Wie stark Gate-Spikes sein dürfen, ohne zu frustrieren (Ventil-Prinzip).
- Balance der Varianten-Streuung (±15 %).

# Charakter-Visuals (Pixel-Art-Stil)

**Status:** Referenz-Sprites für Charaktere **und die 10 Monster** erzeugt; Stil-Regeln festgehalten. Iteration bei Bedarf.
**Rahmen:** `../03_Konzept_Gerüst.md`, §8 (Charaktere) & `charaktere-party.md`.
**Prüfinstanz:** `../02_Leitfaden_Kernmechaniken.md`.

## Assets

- `assets/characters/{claude,barrel,tofa,arris}_64.png` – Original (64×64, transparent).
- `assets/characters/{…}_256.png` – 4× Nearest-Neighbor-Upscale.
- `assets/characters/_sheet_256.png` – Kontaktbogen (alle vier).
- `assets/generate_characters.py` – **Generator (Python/Pillow)**: reproduziert die Sprites deterministisch und ist die Vorlage für neue Figuren/Gegner.

## Monster-Assets

- `assets/monsters/{blando,kindlebale,safeguard,caffiend,shortfuse,mitoslime,pilferret,boolinen,funkus,jellyphase}_64.png` / `_256.png` – die 10 Monster (s. `gegner-katalog.md`).
- `assets/monsters/_sheet_256.png` – Kontaktbogen (5×2).
- `assets/generate_monsters.py` – **Monster-Generator** (gleiche Helfer/Regeln wie Charaktere, eigene Palette). Reproduzierbar & erweiterbar.

Die Stil-Regeln unten gelten identisch für Monster (64×64, Iso-Kippung, Bodenschatten, klare Silhouette + sichtbarer Merkmal-Hinweis).

## Boss-Assets (Kapitel 1)

- `assets/bosses/{blandzilla,fort_knoxious,vaultron}_*.png` – die drei Kapitel-1-Gates (Steckbriefe s. `gegner-katalog.md`).
- `assets/generate_bosses.py` – **Boss-Generator**: dieselben Helfer/Palette/Iso-Kippung wie `generate_monsters.py`, aber **größere Canvas**. Bosse sind aufgemotzte Varianten bestehender Familien (Blandzilla ← Karton-Blando, Fort Knoxious & Vaultron ← Tresor-Safeguard).
- **Größen (verbindlich):** Minibosse **1,5× = 96×96**, Kapitel-Boss **2× = 128×128** – relativ zum 64px-Standard. Gleicher Pixel-Maßstab (grobe Formen), damit der Look konsistent bleibt; Bosse dürfen die Stage sichtbar dominieren. Standfläche/Bodenschatten wie bei den Monstern, Kopfraum für HP/Telegraf frei.

## Region-Kulissen (Backdrops)

- `assets/regions/{reactor_row,bargain_bazaar,megacorp_tower}_160.png` (nativ 160×96) / `_480.png` (3× Nearest) / `_sheet.png` (Kontaktbogen).
- `assets/generate_regions.py` – **Kulissen-Generator** (160×96, gleiche Pixel-Welt, mit Alpha-Compositing für Glows/Wolken).
- **Regeln:** jede Kulisse hat eine **Standfläche** im unteren Drittel (Party links, Gegner rechts); fokale Motive aus der Seitenleisten-Zone halten (s. `ui-layout.md`). Ebenen-Aufbau (Himmel/Skyline → Hauptmotiv → Vordergrund/Boden) für späteres Parallax.
- Bisher: Kapitel 1 (Reactor Row, Bargain Bazaar, MegaCorp Tower). Weitere Regionen im selben Look über den Generator ergänzbar.

## Stil-Regeln (verbindlich für neue Assets)

- **Canvas 64×64**, transparenter Hintergrund. Hochskalierung **immer Nearest-Neighbor** (pixelig), nie glätten.
- **Leicht isometrische Front:** kantige Körper (Quader) mit **hellerer Oberseite** + **dunklerer rechter Seitenfläche** (Tiefe d ≈ 5–6 px). Runde Körper (Wolke, Zylinder) über **hellere Oberkante** + **dunklere Unterkante/rechte Wölbung** andeuten.
- **Beleuchtung** von oben-links: Oberseiten heller, rechte/untere Flächen dunkler.
- **Boden-Schatten:** flache Ellipse, ~14 % Schwarz, mittig unter der Figur; Figur steht auf dem Schatten (nicht schweben).
- **Standfläche:** Sprites stehen auf der Bodenzone der Battle-Stage (Party links, Gegner rechts) – Layout/Platzbedarf s. `ui-layout.md`.
- **Silhouette zuerst:** jede Figur bleibt ein klar erkennbares ikonisches Objekt.
- **Augen** (Front): zwei einfache dunkle Rechtecke (3×4 px).
- **Zwei Helligkeitsstufen** pro Farbfläche genügen (Grundton + Schatten/Highlight).

## Palette (Kernfarben)

| Zweck | Hex |
|-------|-----|
| Wolke (Claude) | `#9fb0c6` / hell `#dfe9f4` / Schatten `#7d90ab` |
| Blond | `#e6c356` / `#f3dd86` |
| Klinge / Gold | `#c3cad6` / `#e7c14b` |
| Holz (Barrel) | `#a9713f` / `#98652f` / dunkel `#7d5127` / Deckel `#c99a63` |
| Metall / Waffe | `#9aa2b0` / `#525a68` / dunkel `#2f343f` |
| Tofu-Weiß (Tofa) | `#f2f0e6` / Top `#fbf9ef` / Schatten `#d3d1c4` |
| Dunkel (Rock/Strumpf) | `#2b2f3a` / `#1f2229` |
| Haar / Haut | `#26262f` / `#e7b48a` |
| Rot (Handschuhe) | `#d24b4b` / `#e46a6a` |
| Router (Arris) | `#3a4150` / hell `#525b6d` / dunkel `#2b303c` |
| Pink (Jacke/Blume) | `#e0788f` / `#c15570` / `#f4b6cf` |
| LED / Auge | `#64cf87` / `#20242e` |

## Figuren-Steckbriefe

- **Claude** – bläulich-graue Wolke, blonde Spikes oben, großes graues Schwert mit goldener Parierstange. Rolle: Damage.
- **Barrel** – Holzfass-Zylinder (Längsplanken, metallische Reifen), Sonnenbrille, angedeutetes Haar/Bart, Vulcan-Mündung frontal zum Spieler. Rolle: Kontrolle.
- **Tofa** – großer weißer Tofublock (weißes Top), kurze dunkle Stummelbeine (Rock → Strumpf), rote Boxhandschuhe, kurzes schwarzes Haar. Rolle: Brawler.
- **Arris** – dunkler Router-Quader, zwei Antennen, grüne LEDs, pinke Jacke, Blume oben, Kabel nach hinten. Rolle: Heilung.

## Neue Figuren / Gegner erstellen

`generate_characters.py` erweitern: eine neue `draw`-Funktion mit denselben Helfern (`r`, `e`, `p`, `blk`, `line`) und der Palette schreiben, dann rendern. So bleiben Auflösung, Iso-Kippung, Schatten und Farbwelt konsistent.

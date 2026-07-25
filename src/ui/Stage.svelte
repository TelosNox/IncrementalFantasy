<script lang="ts">
  import reactorRow from '../assets/regions/reactor_row_224.png'
  import bargainBazaar from '../assets/regions/bargain_bazaar_224.png'
  import megacorpTower from '../assets/regions/megacorp_tower_224.png'
  import { GATE_MONSTER_IDS } from '../content/monsters'
  import { INN_DEAD_TIME, SHOCK_MAX, SHOCK_WINDOW } from '../core/formulas'
  import { CHARACTER_SPRITES, ENEMY_SPRITES } from './sprites'
  import { CHAPTER1_MAX_ZONE, REGION3_JOIN_ZONE, game } from './gameStore.svelte'

  // encounter-zyklus1.md/feinspec §3.7 - Region 1 = Zone 1-8, Region 2 = 9-18, Region 3 = 19-30.
  const backdrop = $derived(
    game.save.currentZone <= 8 ? reactorRow : game.save.currentZone <= 18 ? bargainBazaar : megacorpTower,
  )
  const regionLabel = $derived(
    game.save.currentZone <= 8
      ? 'R1 · Reactor Row'
      : game.save.currentZone <= 18
        ? 'R2 · Bargain Bazaar'
        : 'R3 · MegaCorp Tower',
  )

  // kampf-analyse-shock.md §6 - Shock-Ring erst ab Region 3 sichtbar ("gebündelt mit Tofa").
  const shockVisible = $derived(game.save.currentZone >= REGION3_JOIN_ZONE)

  // charaktere-visuals.md/feinspec §8 - native Groessenhierarchie x Display-Zoom (ui-layout.md):
  // Standard 128px effektiv, Miniboss (1,5x) 192px, Kapitel-Boss Vaultron (2x) 256px.
  function spriteSize(enemyId: string): number {
    if (enemyId === 'vaultron') return 256
    if (GATE_MONSTER_IDS.has(enemyId)) return 192
    return 128
  }

  // gegner-encounter.md §6a - Gegner greifen die Figur mit den hoechsten aktuellen HP an;
  // diese Markierung ist die Informationsgrundlage, die Defend erst zu einer Entscheidung
  // macht (feinspec §3.9 "Anzeige"), statt einer Rate-Aktion.
  const nextEnemyTargetId = $derived.by(() => {
    const alive = game.party.filter((p) => p.hp > 0)
    if (!alive.length) return null
    return alive.reduce((highest, p) => (p.hp > highest.hp ? p : highest)).id
  })

  function formatInnRemaining(): string {
    if (game.innElapsed < INN_DEAD_TIME) return `Dead time: ${Math.ceil(INN_DEAD_TIME - game.innElapsed)}s`
    return 'Healing…'
  }

  /**
   * ui-layout.md "Aufstellung: zwei versetzte Reihen" (M11-Politur, Playtest-Korrektur) - echte
   * Paar-Reihen statt alternierendem Zickzack in einer Linie: die vorderen ceil(n/2) Einheiten
   * bilden die vordere Reihe (bis zu 2 nebeneinander), der Rest die hintere. Bei voller 4er-Party
   * also klar 2+2. Reihe wird rein aus dem (kampflang stabilen) Array-Index abgeleitet - kein
   * eigener State noetig, "Reihenzuordnung bleibt stabil" ist damit automatisch erfuellt.
   * Der Original-Index bleibt an jedem Eintrag haengen, weil `game.enemies`-Indizes (Fokusziel,
   * `setFocusTarget`) unabhaengig von der Reihen-Aufteilung stabil bleiben muessen.
   */
  interface RowSlot<T> {
    unit: T
    index: number
  }
  interface Rows<T> {
    front: RowSlot<T>[]
    back: RowSlot<T>[]
  }
  function splitRows<T>(units: T[]): Rows<T> {
    const frontCount = Math.ceil(units.length / 2)
    const front: RowSlot<T>[] = []
    const back: RowSlot<T>[] = []
    units.forEach((unit, index) => (index < frontCount ? front : back).push({ unit, index }))
    return { front, back }
  }

  /**
   * Playtest-Session (Platzhalter-Tausch): reiner Anzeige-Swap der Sitzplaetze, keine
   * Design-Entscheidung - die eigentliche Slot-Zuordnung bleibt roster-basiert (s. `splitRows`
   * oben), das hier ordnet nur um, WELCHER Charakter in welchem bereits feinjustierten Slot
   * steht (vorne-links=Claude-Slot, vorne-rechts=Barrel-Slot, hinten-links=Tofa-Slot,
   * hinten-rechts=Air-is-Slot). Faellt auf die normale Roster-Reihenfolge zurueck, solange nicht
   * alle vier bekannten IDs in der Party sind (fruehe Kapitel-Phasen mit 1-2 Mitgliedern).
   */
  const PARTY_DISPLAY_ORDER = ['airis', 'claude', 'tofa', 'barrel']
  function displayOrderedParty<T extends { id: string }>(units: T[]): T[] {
    if (units.length < 4) return units
    const byId = new Map(units.map((u) => [u.id, u]))
    const reordered = PARTY_DISPLAY_ORDER.map((id) => byId.get(id)).filter((u): u is T => u !== undefined)
    return reordered.length === units.length ? reordered : units
  }

  const partyRows = $derived(splitRows(displayOrderedParty(game.party)))

  /**
   * Playtest-Fund: Die Gegner-Reihen liefen bis hierher wie die Party-Reihen ueber Flexbox-
   * Spalten-Stapelung - die Position der HINTEREN Reihe hing dadurch von der Rendergroesse der
   * VORDEREN Reihe ab. An Zone 30 (Vaultron 256px in der vorderen Reihe) zog das den hinteren
   * Blando (128px) sichtbar zu weit nach unten - die Position eines Gegners haengt aber niemals
   * von der Groesse eines ANDEREN Gegners ab, das war ein Bug, kein Stilmittel. Fix: absolute,
   * von Nachbar-Sprites unabhaengige Fixpositionen je Encounter-Groesse. Kapitel 1 kennt nur
   * 1-3 Gegner gleichzeitig (s. `content/zones.ts`), daher drei explizite Muster statt einer
   * Formel - eine Formel haette wieder implizite Groessen-Kopplung riskiert.
   */
  interface EnemySlot {
    x: number // horizontaler Versatz vom Zentrum in px (negativ = links)
    bottom: number // fixer Bodenabstand in px, UNABHAENGIG von der Sprite-Groesse
    back: boolean // fuer die Abdunklung/Tiefen-Filter, s. `enemyImgFilter`
  }
  const ENEMY_LAYOUTS: Record<number, EnemySlot[]> = {
    1: [{ x: 0, bottom: 0, back: false }],
    2: [
      { x: -80, bottom: 0, back: false },
      { x: 70, bottom: 150, back: true },
    ],
    3: [
      { x: -110, bottom: 0, back: false },
      { x: 80, bottom: 0, back: false },
      { x: -20, bottom: 170, back: true },
    ],
  }

  interface PositionedEnemy<T> {
    unit: T
    index: number
    x: number
    bottom: number
    back: boolean
  }

  /**
   * "Beachte, dass große Monster mehr Platz verdecken würden" (Playtest-Feedback) - ein
   * Miniboss/Boss (192/256px, s. `spriteSize()`) bekommt zusaetzlichen seitlichen Abstand vom
   * Zentrum, proportional zu seiner Groesse ueber dem 128px-Standard - er ruckt also weiter in
   * seine ohnehin vorgesehene Richtung, statt einen Nachbar-Slot zu ueberlappen. Ein zentrierter
   * Slot (x=0, z.B. die hintere Solo-Position) bekommt bewusst KEINEN Zusatzversatz - "groesser"
   * heisst dort "ragt weiter nach oben", nicht "seitlich verschoben".
   */
  function enemySlots<T extends { id: string }>(units: T[]): PositionedEnemy<T>[] {
    const pattern = ENEMY_LAYOUTS[units.length] ?? ENEMY_LAYOUTS[1]
    return units.map((unit, index) => {
      const slot = pattern[index] ?? pattern[pattern.length - 1]
      const size = spriteSize((unit as { id: string }).id)
      const extraClearance = Math.sign(slot.x) * Math.max(0, size - 128) * 0.5
      return { unit, index, x: slot.x + extraClearance, bottom: slot.bottom, back: slot.back }
    })
  }

  const enemySlotList = $derived(enemySlots(game.enemies))

  const THREAT_COLOR = '#ff5c5c' // rot/warm - "wird als Naechstes angegriffen" (Party)
  const FOCUS_COLOR = 'var(--game-mp)' // cyan/weiss - Fokusziel (Gegner), s. ui-layout.md §"Markierungen"
  const SHOCK_WINDOW_COLOR = '#ffcc33'
  // dezente atmosphaerische Abdunklung/Entsaettigung der hinteren Reihe (optionaler Tiefenhinweis
  // aus ui-layout.md, zusaetzlich zu Vertikalversatz + Z-Reihenfolge unten in CSS).
  const DEPTH_FILTER = 'brightness(0.88) saturate(0.85)'

  /**
   * ui-layout.md "Markierungen: gleiche Form, unterschiedliche Farbe" - beide Markierungen sind
   * jetzt ein duenner, der Sprite-Silhouette folgender Umriss+Schein (drop-shadow folgt der
   * Alpha-Maske eines freigestellten Sprites, kein Kasten mehr) statt eines Kastens/Hintergrunds.
   * Als EIN kombinierter `style:filter`-String statt CSS-Klassen, weil ein Sprite gleichzeitig
   * in der hinteren Reihe UND markiert sein kann - mehrere `filter`-Deklarationen ueberschreiben
   * sich sonst gegenseitig, statt sich zu addieren.
   */
  function partyImgFilter(isNextTarget: boolean, isFallen: boolean, isBack: boolean): string {
    const parts: string[] = []
    if (isBack) parts.push(DEPTH_FILTER)
    if (isFallen) parts.push('grayscale(0.85)', 'brightness(0.45)')
    if (isNextTarget) parts.push(`drop-shadow(0 0 6px ${THREAT_COLOR})`, `drop-shadow(0 0 2px ${THREAT_COLOR})`)
    return parts.length ? parts.join(' ') : 'none'
  }

  function enemyImgFilter(isFocused: boolean, inWindow: boolean, isBack: boolean): string {
    const parts: string[] = []
    if (isBack) parts.push(DEPTH_FILTER)
    if (inWindow) parts.push(`drop-shadow(0 0 6px ${SHOCK_WINDOW_COLOR})`, `drop-shadow(0 0 2px ${SHOCK_WINDOW_COLOR})`)
    if (isFocused) parts.push(`drop-shadow(0 0 6px ${FOCUS_COLOR})`, `drop-shadow(0 0 2px ${FOCUS_COLOR})`)
    return parts.length ? parts.join(' ') : 'none'
  }
</script>

<div class="stage" style:background-image={`url(${backdrop})`}>
  <!-- ui-layout.md "Freischaltungs-Hinweis": ueberdeckt kurzzeitig die normale Statuszeile,
       pausiert aber nichts - reines Lesbarkeits-Add-on bei Rollout-Flag-Wechseln. -->
  {#if game.calloutMessage}
    <div class="banner callout">{game.calloutMessage}</div>
  {:else}
    <div class="banner">
      {#if game.phase === 'chapter-complete'}
        Victory! Chapter 1 complete – Vaultron defeated. Reunion awaits in the sidebar.
      {:else if game.phase === 'retry'}
        Defeat – no healing, retry penalty {Math.ceil(game.retryRemaining)}s
      {:else if game.phase === 'inn'}
        🛏 At the inn – {formatInnRemaining()}
        {#if !game.innForced}
          <button class="leave-inn" onclick={() => game.leaveInn()}>Leave now</button>
        {/if}
      {:else if game.awaitingUnit}
        {game.awaitingUnit.name} is ready – choose an action
      {:else if game.isCurrentZoneGate}
        ⚠ Gate – Auto only attacks here, switch to Manual for Specials/Limit!
      {:else}
        {regionLabel} – Zone {game.save.currentZone} / {CHAPTER1_MAX_ZONE}
      {/if}
    </div>
  {/if}

  {#snippet partyRow(slots: RowSlot<(typeof game.party)[number]>[], isBack: boolean)}
    {#each slots as slot (slot.unit.id)}
      {@const unit = slot.unit}
      {@const hpPct = (Math.max(0, unit.hp) / unit.maxHp) * 100}
      {@const atbPct = Math.min(1, unit.atb) * 100}
      {@const isNextTarget = unit.id === nextEnemyTargetId && unit.hp > 0}
      {@const isFallen = unit.hp <= 0}
      <!-- ui-layout.md "Gefallene Figuren" - eine KO'te Figur bleibt an ihrem Platz stehen
           (entsaettigt, leere HP-Leiste automatisch durch hpPct=0) statt zu verschwinden; sie
           kehrt erst nach dem naechsten Sieg zurueck (Sieg-Erholung, feinspec §3.5). Kein
           Revive-Knopf/Aufforderungs-Blinken - es gibt in Kapitel 1 keine Wiederbelebung. -->
      <div class="unit party" class:fallen={isFallen}>
        <div class="unit-label">
          {unit.name}
          {#if isNextTarget}<span class="next-target-mark" title="Enemies attack the highest-HP ally">▲</span
            >{/if}
        </div>
        <div class="mini-bar hp"><div class="fill" style:width="{hpPct}%"></div></div>
        <div class="mini-bar atb"><div class="fill" style:width="{atbPct}%"></div></div>
        <img
          src={CHARACTER_SPRITES[unit.id]}
          alt={unit.name}
          style:filter={partyImgFilter(isNextTarget, isFallen, isBack)}
        />
      </div>
    {/each}
  {/snippet}

  {#snippet enemyUnit(slot: PositionedEnemy<(typeof game.enemies)[number]>)}
    {@const enemy = slot.unit}
    {@const i = slot.index}
    {@const hpPct = (Math.max(0, enemy.hp) / enemy.maxHp) * 100}
    {@const atbPct = Math.min(1, enemy.atb) * 100}
    {@const size = spriteSize(enemy.id)}
    {@const inWindow = enemy.shockTimer > 0}
    {@const ringPct = inWindow ? enemy.shockTimer / SHOCK_WINDOW : Math.min(1, enemy.shock / SHOCK_MAX)}
    {@const ringColor = inWindow ? '#ffcc33' : '#e0a52e'}
    <!-- kampf-analyse-shock.md §6 (M11-Politur) - visuelles Gewicht (Deckkraft/Strichstaerke/
         Saettigung) skaliert mit dem Aufbau-Fuellstand, ausser waehrend des aktiven Fensters
         (Countdown) - der behaelt explizit volle Prominenz, auch wenn er gegen Ende auf 0 laeuft. -->
    {@const ringIntensity = inWindow ? 1 : ringPct}
    {@const isFocused = game.focusTargetIndex === i && enemy.hp > 0}
    {@const isDefeated = enemy.hp <= 0}
    <!-- feinspec §3.9 (M11) - Partei-Fokusziel per Klick setzen; wirkt auch fuer Auto-Figuren.
         ui-layout.md "Gegner - verschwinden, aber mit einem Takt" - Opacity+Transition statt
         display:none, damit der Platz reserviert bleibt (kein Nachruecken der Nachbarn, das
         Fokusziel ist ein stabiler Array-Index, s. gambits.ts resolvePartyTarget).
         Playtest-Fund - absolute Fixposition (s. `enemySlots()` im <script>): `left`/`bottom`
         haengen NUR von diesem einen Slot ab, nie von der Sprite-Groesse eines Nachbarn. -->
    <div
      class="unit enemy"
      class:defeated={isDefeated}
      style:left="calc(50% + {slot.x}px)"
      style:bottom="{slot.bottom}px"
      role="button"
      tabindex="0"
      onclick={() => game.setFocusTarget(i)}
      onkeydown={(e) => e.key === 'Enter' && game.setFocusTarget(i)}
    >
      <div class="unit-label">
        {enemy.name}
        {#if isFocused}<span class="focus-mark" title="Party focus target">◆</span>{/if}
      </div>
      <div class="mini-bar hp"><div class="fill" style:width="{hpPct}%"></div></div>
      <div class="mini-bar atb"><div class="fill" style:width="{atbPct}%"></div></div>

      {#if enemy.trait === 'bomb' && enemy.hitsTaken >= 3}
        <div class="telegraph detonate">! DETONATING</div>
      {/if}
      {#if enemy.trait === 'boss' && enemy.actionsDone % 3 === 2}
        <div class="telegraph charging">⚡ Mako core charging…</div>
      {/if}

      {#if shockVisible}
        <div class="shock-wrap" style:width="{size}px" style:height="{size}px">
          {#if ringPct > 0 || inWindow}
            <div
              class="shock-ring"
              style:--p={ringPct}
              style:--intensity={ringIntensity}
              style:--ring-color={ringColor}
            ></div>
          {/if}
          <img
            src={ENEMY_SPRITES[enemy.id]}
            alt={enemy.name}
            style:width="100%"
            style:height="100%"
            style:filter={enemyImgFilter(isFocused, inWindow, slot.back)}
          />
          {#if inWindow}<div class="shock-break">✦</div>{/if}
        </div>
      {:else}
        <img
          src={ENEMY_SPRITES[enemy.id]}
          alt={enemy.name}
          style:width="{size}px"
          style:height="{size}px"
          style:filter={enemyImgFilter(isFocused, false, slot.back)}
        />
      {/if}
    </div>
  {/snippet}

  <div class="floor">
    <!-- ui-layout.md "Aufstellung: zwei versetzte Reihen" (Playtest-Korrektur) - echte Paar-Reihen
         (hintere Reihe im DOM zuerst/oben, vordere darunter/an der Standflaeche) statt Versatz
         innerhalb einer einzelnen Linie; dadurch klar als 2 Reihen erkennbar. Kompakter
         Zeilen-Gap (statt einer ueber die volle Breite gespreizten Linie) sorgt gleichzeitig
         dafuer, dass zwischen Party- und Gegner-Block sichtbar Platz bleibt (space-between auf
         `.floor` haengt beide Seiten weiterhin an den Raendern ein, aber ein schmalerer Block
         reicht weniger weit in die Mitte). -->
    <div class="party-side">
      <div class="row row-back">{@render partyRow(partyRows.back, true)}</div>
      <div class="row row-front">{@render partyRow(partyRows.front, false)}</div>
    </div>

    <!-- Playtest-Fund: absolut positionierte Gegner-Slots statt Flex-Zeilen (s. `enemySlots()`
         im <script>) - jeder Gegner haengt nur von seinem EIGENEN Slot ab, nie von der
         Sprite-Groesse eines Nachbarn (z.B. Vaultron 256px in Zone 30). -->
    <div class="enemy-side">
      {#each enemySlotList as slot (slot.index)}
        {@render enemyUnit(slot)}
      {/each}
    </div>
  </div>
</div>

<style>
  .stage {
    position: relative;
    width: 100%;
    height: 100%;
    background-size: cover;
    background-position: center;
    background-color: var(--game-bg-deep);
    /* regionen-kulissen.md §9 - die Kulissen liegen nativ als 224x128 vor (Nenn-Box 168x96
       plus Bleed) und werden hier hochskaliert; Nearest-Neighbor ist verbindlich. Der
       M10-Fix "MegaCorp links ausrichten" ist entfallen: das fokale Motiv sitzt jetzt
       innerhalb der Nenn-Box, den Ueberschuss traegt der Bleed. */
    image-rendering: pixelated;
    overflow: hidden;
  }

  .banner {
    position: absolute;
    top: 16px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    align-items: center;
    gap: 12px;
    background: var(--game-panel-bg);
    border: 1px solid var(--game-gold);
    color: var(--game-gold);
    padding: 8px 20px;
    font-size: 14px;
    white-space: nowrap;
    border-radius: 2px;
  }

  .banner.callout {
    border-color: var(--game-hp);
    color: var(--game-hp);
  }

  .leave-inn {
    padding: 4px 10px;
    background: transparent;
    color: var(--game-mp);
    border: 1px solid var(--game-mp);
    border-radius: 3px;
    font-size: 12px;
    cursor: pointer;
  }

  .leave-inn:hover {
    background: rgba(93, 200, 255, 0.12);
  }

  .floor {
    /* EIN gemeinsamer Tiefen-Schritt-Vektor fuer die ganze Stage (Party+Gegner), s. `.row-back`/
       `.enemy-side` unten - "eine gemeinsame Perspektivrichtung fuer die ganze Stage" woertlich
       als EIN Wertepaar statt separat pro Seite dupliziert. */
    --depth-step-x: 20px;
    --depth-step-y: 8px;
    position: absolute;
    bottom: 3%;
    left: 0;
    right: 0;
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    padding: 0 10%;
    box-sizing: border-box;
  }

  /* ui-layout.md "Aufstellung: zwei versetzte Reihen" (Playtest-Korrektur) - echte Paar-Reihen
     statt Versatz innerhalb einer Linie: `.row-back` steht im DOM zuerst (oben/weiter weg),
     `.row-front` direkt an der Standflaeche (unten, `align-items: flex-end` auf `.floor` haengt
     den ganzen Block dort ein). Kompakter Row-Gap (Reihen) und Unit-Gap (innerhalb einer Reihe)
     statt der vorherigen ueber die volle Breite gespreizten Einzellinie - dadurch bleibt sichtbar
     Platz zwischen Party- und Gegner-Block (`.floor`s `space-between` haengt beide Seiten weiterhin
     an den Raendern ein, ein schmalerer 2x2-Block reicht einfach weniger weit in die Mitte). */
  .party-side {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0;
  }

  /* Playtest-Fund: absolute Gegner-Positionierung (s. `enemySlots()`/`ENEMY_LAYOUTS` im <script>)
     statt Flex-Zeilen - jeder Gegner-Slot ist ein `position:absolute`-Kind mit fixem `left`/
     `bottom`, unabhaengig von der Sprite-Groesse anderer Gegner. `.enemy-side` selbst braucht
     dafuer eine feste Box (Breite/Hoehe grosszuegig fuer das breiteste/hoechste Muster - Zone 30
     mit Vaultron), damit `.floor`s Flex-Layout ihr weiterhin denselben Platz reserviert wie zuvor. */
  .enemy-side {
    position: relative;
    width: 520px;
    height: 460px;
  }

  .unit.enemy {
    position: absolute;
    transform: translateX(-50%);
  }

  /* Party-Seite: weiterhin echte Flex-Zeilen (uniform 128px-Sprites, s. `CHARACTER_SPRITES` -
     die "Groesse eines Nachbarn verschiebt die andere Reihe"-Falle, die bei den Gegnern zum
     Vaultron-Bug fuehrte, existiert hier nicht, da nie unterschiedlich grosse Party-Sprites
     vorkommen). Reihenfolge/Betrag der Feinjustierung stammt aus dem Playtest (Runden 2-11):
     hintere Reihe nah an die vordere herangezogen (negativer margin-top), dann in mehreren
     Schritten die finalen Pixelwerte gefunden. */
  .row-back {
    margin-top: -90px;
    transform: translate(var(--depth-step-x), calc(var(--depth-step-y) * -1));
  }

  .party-side .row-front {
    transform: translate(-65px, 5px);
  }

  .party-side .row-back {
    transform: translate(var(--depth-step-x), calc(var(--depth-step-y) * -1 + 40px));
  }

  /* Abstand zwischen den beiden "Spalten" (Claude+Tofa links, Barrel+Air is... rechts).
     `:not(:only-child)` schuetzt Zeilen mit nur einer Einheit (z.B. Claude solo vor Zone 9) davor,
     ungewollt zur Seite verschoben zu werden - :first-child UND :last-child treffen sonst
     dasselbe einzelne Kind gleichzeitig. */
  .party-side .row .unit:first-child:not(:only-child) {
    transform: translateX(-20px);
  }

  .party-side .row .unit:last-child:not(:only-child) {
    transform: translateX(30px);
  }

  .row {
    display: flex;
    gap: 12px;
    align-items: flex-end;
    justify-content: center;
  }

  .unit {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    position: relative;
  }

  /* ui-layout.md "Gefallene Figuren" - Party: am Boden, nicht weg. Nur Label gedimmt (Lesbarkeit
     bleibt erhalten); die Sprite-Entsaettigung selbst sitzt inline in `partyImgFilter`. Keine
     Interaktions-Andeutung (kein Hover/Klick-Zustand hier, anders als bei Gegnern). */
  .unit.party.fallen .unit-label {
    opacity: 0.55;
  }

  /* feinspec §3.9 (M11) "Anzeige" - Fokusziel der Partei anklickbar auf der Gegner-Seite.
     ui-layout.md "Gegner - verschwinden, aber mit einem Takt": Opacity-Transition statt
     schlagartigem Verschwinden; der Platz (Layout-Box) bleibt trotzdem reserviert. */
  .unit.enemy {
    cursor: pointer;
    border-radius: 6px;
    padding: 4px;
    transition: opacity 0.6s ease;
  }

  .unit.enemy:hover {
    background: rgba(255, 255, 255, 0.06);
  }

  .unit.enemy.defeated {
    opacity: 0;
    pointer-events: none;
  }

  /* ui-layout.md "Markierungen: gleiche Form, unterschiedliche Farbe" - Gold/Bernstein bleibt
     exklusiv dem Shock vorbehalten; das Fokusziel traegt jetzt dieselbe kuehle Farbe wie die
     Spielerkontrolle (Cyan). Die Form (Umriss+Schein) sitzt am <img> ueber `style:filter`, s. oben. */
  .focus-mark {
    color: var(--game-mp);
  }

  /* gegner-encounter.md §6a - naechstes Gegner-Ziel (hoechste aktuelle HP); Informationsgrundlage fuer Defend. */
  .next-target-mark {
    color: #ff5c5c;
  }

  /* ui-layout.md "Display-Zoom": 2x Nearest-Neighbor-Zoom auf allen Sprite-Klassen gemeinsam -
     Standard 64px nativ -> 128px effektiv (party: fest hier); Enemy-Groessen (Standard/Miniboss/
     Kapitel-Boss) kommen inline ueber `spriteSize()`, s. <script>. */
  .unit img {
    width: 128px;
    height: 128px;
    image-rendering: pixelated;
    transition: filter 0.15s ease;
  }

  /* kampf-analyse-shock.md §6 - der Ring: Amber-Aufbau (von unten symmetrisch nach oben,
     0-99%) bzw. Gold-Fenster-Countdown (leert sich von oben symmetrisch nach unten) - dasselbe
     Element traegt beide Phasen, Farbe/Richtung unterscheidet sie (s. `ringPct`/`ringColor` oben).
     M11-Politur: visuelles Gewicht (Deckkraft/Strichstaerke/Saettigung) skaliert zusaetzlich mit
     `--intensity` (= Aufbau-Fuellstand, aber IMMER 1 waehrend des aktiven Fensters - Auslösung/
     Countdown behalten volle Prominenz, s. `ringIntensity` im <script>). Nahe 0 nur eine
     Haarlinie, bei 0 wird die Ring-Div gar nicht erst gerendert (s. Template). */
  .shock-wrap {
    position: relative;
  }

  .shock-ring {
    position: absolute;
    inset: -10%;
    border-radius: 50%;
    pointer-events: none;
    opacity: calc(0.12 + 0.88 * var(--intensity));
    filter: saturate(calc(20% + 80% * var(--intensity)));
    background: conic-gradient(
      from 0deg,
      transparent 0deg,
      transparent calc(180deg - var(--p) * 180deg),
      var(--ring-color) calc(180deg - var(--p) * 180deg),
      var(--ring-color) calc(180deg + var(--p) * 180deg),
      transparent calc(180deg + var(--p) * 180deg),
      transparent 360deg
    );
    /* Ring-Dicke waechst mit --intensity (Haarlinie -> volle Staerke), Aussenkante bleibt fix -
       so bleibt der Ring bei niedrigem Fuellstand schmal genug, um sich vom Bodenschatten der
       Standflaeche (ui-layout.md "Battle-Stage & Standfläche") abzuheben statt ihn zu imitieren. */
    --ring-thickness: calc(3% + 12% * var(--intensity));
    -webkit-mask-image: radial-gradient(
      circle,
      transparent calc(76% - var(--ring-thickness) - 1%),
      black calc(76% - var(--ring-thickness)),
      black 76%,
      transparent 77%
    );
    mask-image: radial-gradient(
      circle,
      transparent calc(76% - var(--ring-thickness) - 1%),
      black calc(76% - var(--ring-thickness)),
      black 76%,
      transparent 77%
    );
  }

  .shock-break {
    position: absolute;
    top: -6px;
    left: 50%;
    transform: translateX(-50%);
    color: #ffcc33;
    font-size: 20px;
    text-shadow: 0 0 6px #ffcc33;
    pointer-events: none;
  }

  .telegraph {
    padding: 2px 8px;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.03em;
    border-radius: 2px;
    white-space: nowrap;
  }

  .telegraph.detonate {
    color: #ff5c5c;
    border: 1px solid #ff5c5c;
    animation: pulse 0.5s ease-in-out infinite alternate;
  }

  .telegraph.charging {
    color: var(--game-gold);
    border: 1px solid var(--game-gold);
  }

  @keyframes pulse {
    from {
      opacity: 0.6;
    }
    to {
      opacity: 1;
    }
  }

  .unit-label {
    color: var(--game-text);
    font-size: 12px;
  }

  .mini-bar {
    width: 128px;
    height: 5px;
    background: rgba(0, 0, 0, 0.5);
    border: 1px solid var(--game-border);
  }

  .mini-bar .fill {
    height: 100%;
  }

  .mini-bar.hp .fill {
    background: var(--game-hp);
  }

  .mini-bar.atb .fill {
    background: var(--game-atb);
  }
</style>

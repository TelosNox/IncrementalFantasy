<script lang="ts">
  import reactorRow from '../assets/regions/reactor_row_224.png'
  import bargainBazaar from '../assets/regions/bargain_bazaar_224.png'
  import megacorpTower from '../assets/regions/megacorp_tower_224.png'
  import inn from '../assets/regions/inn_224.png'
  import { GATE_MONSTER_IDS } from '../content/monsters'
  import { INN_DEAD_TIME, SHOCK_MAX, SHOCK_WINDOW } from '../core/formulas'
  import { CHARACTER_SPRITES, ENEMY_SPRITES } from './sprites'
  import { CHAPTER1_MAX_ZONE, REGION3_JOIN_ZONE, game } from './gameStore.svelte'

  /**
   * ui-layout.md "Buehnen-Framework" (M13) - die Kampfzone kennt genau EINE Laengeneinheit
   * (Stage-Unit, 1 su = 1 Sprite-Pixel nativ) und EINEN Skalierungsfaktor `s`. Die Geometrie
   * (Slot-Raster, Standlinien, HUD-Maße) liegt in `stageLayout.ts` - ohne DOM und
   * damit pruefbar (`tests/stage-layout.test.ts`). Hier bleibt nur die Darstellung; `--s`
   * (CSS-Pixel je su) traegt die Umrechnung, damit im Markup und im CSS keine zweite
   * Masseinheit auftaucht - genau der Fehler, den M13 behebt.
   */
  import {
    anchorBottom,
    anchorX,
    enemyPlacement,
    hudBottom,
    partyPlacement,
    stageScale,
    type Slot,
    BOSS_SU,
    MINIBOSS_SU,
    SPRITE_SU,
  } from './stageLayout'

  let stageWidth = $state(0)
  let stageHeight = $state(0)
  const s = $derived(stageScale(stageWidth, stageHeight))

  /** ui-layout.md "Gasthaus-Szene" (M19b) - Buehnenwechsel statt Overlay: keine Gegner, andere Kulisse. */
  const inInn = $derived(game.phase === 'inn')

  // encounter-zyklus1.md/feinspec §3.7 - Region 1 = Zone 1-8, Region 2 = 9-18, Region 3 = 19-30.
  const backdrop = $derived(
    inInn ? inn : game.save.currentZone <= 8 ? reactorRow : game.save.currentZone <= 18 ? bargainBazaar : megacorpTower,
  )
  /**
   * Ueberschuss oberhalb des Bleeds (Playtest-Fund M13): Der Bleed traegt 96 su ueber der
   * Buehnenbox - genug fuer ein Fenster nahe 7:4, nicht fuer eine sehr hohe/schmale Stage.
   * Darueber lag sonst ein schwarzer Balken, also genau das, was `ui-layout.md` "Verankerung
   * und Bleed" ausschliesst. Die Stage traegt deshalb die oberste Himmelsfarbe der jeweiligen
   * Kulisse als Hintergrund - die oberste Backdrop-Zeile ist exakt `sky_top` der Palette
   * (`docs/spec/assets/generate_regions.py`, Werte auch in `regionen-kulissen.md` §11). Der
   * Inn-Wert ist derselbe `sky_top` der INN-Palette dort (M19a).
   */
  const skyColor = $derived(
    inInn
      ? '#6b5644'
      : game.save.currentZone <= 8
        ? '#3a4d61'
        : game.save.currentZone <= 18
          ? '#5d4269'
          : '#33495e',
  )
  const regionLabel = $derived(
    game.save.currentZone <= 8
      ? 'R1 · Reactor Row'
      : game.save.currentZone <= 18
        ? 'R2 · Bargain Bazaar'
        : 'R3 · MegaCorp Tower',
  )

  /**
   * ui-layout.md "Gasthaus-Szene" Punkt (2) (M19b) - "ein Fenster, in dem die Signaturfarbe der
   * aktuellen Region liegt". `accent` je Region aus `docs/spec/assets/generate_regions.py`
   * (REACTOR_ROW/BARGAIN_BAZAAR/MEGACORP_TOWER), dieselben Zonen-Grenzen wie `skyColor` oben.
   */
  const regionAccent = $derived(
    game.save.currentZone <= 8 ? '#5fbf7a' : game.save.currentZone <= 18 ? '#d95a9c' : '#4b7fd4',
  )

  /**
   * Fensterglas-Rechteck der Inn-Kulisse, in su relativ zur `.backdrop`-Box (deren Top-Left dem
   * Canvas-Pixel (0,0) des 224x128-Assets entspricht, 1 Asset-Pixel = 3 su). Aus
   * `docs/spec/assets/generate_regions.py` INN_WINDOW_GLASS = (86, -4, 20, 22) in Region-lokalen
   * Koordinaten, `to_canvas` addiert BLEED_X=28/BLEED_TOP=32 -> Canvas-Pixel (114, 28, 20, 22) ->
   * ×3 su. Kein Python-Import moeglich (andere Sprache/Toolchain), deshalb hier von Hand
   * uebertragen - aendert sich `INN_WINDOW`/`WINDOW_NOOK_INSET` dort, muss es hier nachgezogen werden.
   */
  const INN_WINDOW_GLASS_SU = { left: 342, top: 84, width: 60, height: 66 }

  /**
   * ui-layout.md "Gasthaus-Szene" Punkt (1) (M19b) - die Dimmung ist der einzige Fortschrittstraeger
   * der Totzeit (kein Countdown, kein Balken). Faehrt linear ueber `INN_DEAD_TIME` herunter und
   * bleibt danach (Takt "Nacht") auf dem dunkelsten Wert stehen.
   */
  const INN_DARK_LEVEL = 0.4
  const innDimProgress = $derived(inInn ? Math.min(1, game.innElapsed / INN_DEAD_TIME) : 0)
  const innBrightnessFilter = $derived(`brightness(${1 - innDimProgress * (1 - INN_DARK_LEVEL)})`)

  /**
   * ui-layout.md "Gasthaus-Szene" Punkt (1)/(3) (M19b) - gestaffelte Ankunft: Stehende zuerst,
   * Gefallene zuletzt (getragen). Reihenfolge aus der bestehenden Slot-Zuordnung (`partyPlaced`
   * unten), nicht neu gemischt - Figur i bleibt auf Slot i, nur der Zeitpunkt ihres Erscheinens
   * verschiebt sich. Die Verzoegerungen liegen mit Absicht innerhalb der ersten ~80% der Totzeit,
   * damit die letzte Ankunft nicht mit dem Ende der Dimmung kollidiert.
   */
  const partyArrivalOrder = $derived.by(() => {
    if (!inInn) return new Map<string, number>()
    const standing = game.party.filter((u) => u.hp > 0)
    const fallen = game.party.filter((u) => u.hp <= 0)
    const order = [...standing, ...fallen]
    const spacing = INN_DEAD_TIME / (order.length + 1)
    return new Map(order.map((u, i) => [u.id, i * spacing]))
  })

  function hasArrived(unitId: string): boolean {
    if (!inInn) return true
    return game.innElapsed >= (partyArrivalOrder.get(unitId) ?? 0)
  }

  /**
   * ui-layout.md "Gasthaus-Szene" Punkt (4) (M19b) - "Aufbruch: Blende". Der Store wechselt die
   * Phase sofort zurueck auf 'battle' (keine zusaetzliche Wartezeit); dieser kurze Schwarzblitz ist
   * rein kosmetisch und blockiert nichts - die Simulation laeuft darunter bereits normal weiter.
   */
  let showBlende = $state(false)
  let previousPhase = game.phase
  $effect(() => {
    const phase = game.phase
    if (previousPhase === 'inn' && phase !== 'inn') {
      showBlende = true
      setTimeout(() => {
        showBlende = false
      }, 380)
    }
    previousPhase = phase
  })

  // kampf-analyse-shock.md §6 - Shock-Ring erst ab Region 3 sichtbar ("gebündelt mit Tofa").
  const shockVisible = $derived(game.save.currentZone >= REGION3_JOIN_ZONE)

  /**
   * charaktere-visuals.md - Groessenhierarchie, jetzt in su statt in CSS-Pixeln: Standard 64,
   * Miniboss 96, Kapitel-Boss 128. Der frueher feste 2x-Zoom ist der Referenzfall `s = 2`.
   */
  function spriteSu(enemyId: string): number {
    if (enemyId === 'vaultron') return BOSS_SU
    if (GATE_MONSTER_IDS.has(enemyId)) return MINIBOSS_SU
    return SPRITE_SU
  }

  interface Placed<T> {
    unit: T
    index: number
    slot: Slot
    size: number
  }

  function withUnits<T>(units: T[], placed: { index: number; slot: Slot; size: number }[]): Placed<T>[] {
    return placed.map((p) => ({ ...p, unit: units[p.index] }))
  }

  const partyPlaced = $derived(withUnits(game.party, partyPlacement(game.party.length)))
  const enemyPlaced = $derived(withUnits(game.enemies, enemyPlacement(game.enemies.map((e) => spriteSu(e.id)))))

  // gegner-encounter.md §6a - Gegner greifen die Figur mit den hoechsten aktuellen HP an;
  // diese Markierung ist die Informationsgrundlage, die Defend erst zu einer Entscheidung
  // macht (feinspec §3.9 "Anzeige"), statt einer Rate-Aktion.
  const nextEnemyTargetId = $derived.by(() => {
    if (inInn) return null
    const alive = game.party.filter((p) => p.hp > 0)
    if (!alive.length) return null
    return alive.reduce((highest, p) => (p.hp > highest.hp ? p : highest)).id
  })

  const SHOCK_WINDOW_COLOR = '#ffcc33'
  // dezente atmosphaerische Abdunklung/Entsaettigung der hinteren Reihe (Tiefenhinweis,
  // ui-layout.md "Ebenen"/"Kontrastplatte").
  const DEPTH_FILTER = 'brightness(0.88) saturate(0.85)'

  /**
   * ui-layout.md "Markierungen" (revidiert 02.08.2026, Playtest: "der Glow auf Charakteren und
   * Gegnern gefaellt mir nicht, die Zielmarkierung ist ja ueber den Marker im Namen erkennbar") -
   * der Schein/Umriss an der Sprite-Silhouette entfaellt fuer beide Markierungen (Party-Bedrohung
   * rot, Gegner-Fokus cyan); sie leben jetzt ausschliesslich am Namen (`.threat-mark`/`.focus-mark`
   * im `hud`-Snippet unten). Die Shock-Fenster-Kennzeichnung am Gegner-Sprite ist eine eigene,
   * unveraenderte Anzeige (kampf-analyse-shock.md §6), keine der "zwei Markierungen".
   */
  function partyImgFilter(isFallen: boolean, dimmed: boolean, innFilter: string | null): string {
    const parts: string[] = []
    if (dimmed) parts.push(DEPTH_FILTER)
    if (isFallen) parts.push('grayscale(0.85)', 'brightness(0.45)')
    if (innFilter) parts.push(innFilter)
    return parts.length ? parts.join(' ') : 'none'
  }
  function enemyImgFilter(inWindow: boolean, dimmed: boolean): string {
    const parts: string[] = []
    if (dimmed) parts.push(DEPTH_FILTER)
    if (inWindow) parts.push(`drop-shadow(0 0 ${3 * s}px ${SHOCK_WINDOW_COLOR})`, `drop-shadow(0 0 ${s}px ${SHOCK_WINDOW_COLOR})`)
    return parts.length ? parts.join(' ') : 'none'
  }
</script>

<!-- ui-layout.md "Verankerung und Bleed": Die Buehnenbox haengt horizontal zentriert und mit
     ihrer Unterkante am Stage-Boden; Ueberschuss fuellt der Bleed der Kulisse, die mit
     demselben `s` gezeichnet und NIE gestreckt wird. -->
<div
  class="stage"
  style:--s="{s}px"
  style:background-color={skyColor}
  bind:clientWidth={stageWidth}
  bind:clientHeight={stageHeight}
>
  <div class="backdrop" style:background-image={`url(${backdrop})`} style:filter={inInn ? innBrightnessFilter : 'none'}>
    {#if inInn}
      <!-- ui-layout.md "Gasthaus-Szene" Punkt (2) (M19b) - Fensterschein in der Signaturfarbe der
           aktuellen Region, Kulissen-Leben statt Signal (§4/§10): gedaempfte Opacity, `mix-blend-mode:
           color` faerbt nur den bereits gemalten neutralen Glasfarbton um, statt ihn zu uebermalen. -->
      <div
        class="inn-window-glow"
        style:left="calc({INN_WINDOW_GLASS_SU.left} * var(--s))"
        style:top="calc({INN_WINDOW_GLASS_SU.top} * var(--s))"
        style:width="calc({INN_WINDOW_GLASS_SU.width} * var(--s))"
        style:height="calc({INN_WINDOW_GLASS_SU.height} * var(--s))"
        style:background={regionAccent}
      ></div>
    {/if}
  </div>

  {#if showBlende}
    <!-- ui-layout.md "Gasthaus-Szene" Punkt (4) (M19b) - "Aufbruch: Blende", rein kosmetisch. -->
    <div class="blende"></div>
  {/if}

  <!-- ui-layout.md "Freischaltungs-Hinweis": ueberdeckt kurzzeitig die normale Statuszeile,
       pausiert aber nichts - reines Lesbarkeits-Add-on bei Rollout-Flag-Wechseln.
       Ebene U2 (Overlay) und damit bewusst NICHT in su bemessen: Bannertext ist UI-Chrome,
       keine Buehnengeometrie, und muss auch bei s = 1 lesbar bleiben. -->
  {#if game.calloutMessage}
    <div class="banner callout">{game.calloutMessage}</div>
  {:else}
    <div class="banner">
      {#if game.phase === 'chapter-complete'}
        Victory! Chapter 1 complete – Vaultron defeated. Reunion awaits in the sidebar.
      {:else if game.phase === 'retry'}
        Defeat – no healing, retry penalty {Math.ceil(game.retryRemaining)}s
      {:else if game.phase === 'inn'}
        <!-- ui-layout.md "Gasthaus-Szene" Punkt (1)/(5) (M19b) - genau eine Wirtszeile, kein
             Countdown/Ladebalken (die Dimmung auf der Kulisse traegt den Fortschritt allein).
             Die Schaltflaeche erscheint erst ab Takt 2 (Ende der Totzeit), nicht ausgegraut davor
             (Punkt 4/Abnahme: sonst laedt sie waehrend der Totzeit zu einem Ausstieg ein, den es
             nicht gibt). -->
        🛏 {game.innHostLine}
        {#if !game.innForced && game.innElapsed >= INN_DEAD_TIME}
          <button class="leave-inn" onclick={() => game.leaveInn()}>Head out</button>
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

  <!-- ui-layout.md "Ebenen": F-Stapel je Figur (Bodenaufsatz -> Sprite -> Marker), darueber
       global U0 (Kopf-HUD). Deshalb zwei Durchlaeufe ueber dieselben Slots statt einer
       Figur-Box, die HUD und Sprite zusammenhaelt - sonst kann ein vorderes Sprite das HUD
       einer hinteren Figur verdecken. -->
  <div class="box">
    {#snippet partySprite(placed: Placed<(typeof game.party)[number]>)}
      {@const unit = placed.unit}
      {@const isFallen = unit.hp <= 0}
      {@const arrived = hasArrived(unit.id)}
      <!-- ui-layout.md "Gefallene Figuren" - eine KO'te Figur bleibt an ihrem Platz stehen
           (entsaettigt) statt zu verschwinden; sie kehrt erst nach dem naechsten Sieg zurueck
           (Sieg-Erholung, feinspec §3.5). Kein Revive-Hinweis - es gibt keine Wiederbelebung.
           ui-layout.md "Gasthaus-Szene" Punkt (1)/(3) (M19b) - im Gasthaus erscheint jede Figur
           erst mit ihrer Ankunftsverzoegerung (`hasArrived`), gestaffelt statt gleichzeitig; eine
           gefallene Figur "steht auf", sobald sie hier ankommt UND ihre HP-Leiste ueber 0 liegt -
           dieselbe Bedingung wie im Kampf (`isFallen`), kein neuer Wert fuer die Szene. -->
      <img
        class="sprite"
        class:inn-arriving={inInn}
        class:arrived
        data-actor-id={unit.id}
        src={CHARACTER_SPRITES[unit.id]}
        alt={unit.name}
        draggable="false"
        style:left="calc({anchorX(placed.slot)} * var(--s))"
        style:bottom="calc({anchorBottom(placed.slot)} * var(--s))"
        style:width="calc({placed.size} * var(--s))"
        style:height="calc({placed.size} * var(--s))"
        style:z-index={placed.slot.back ? 1 : 2}
        style:filter={partyImgFilter(isFallen, placed.slot.back, inInn ? innBrightnessFilter : null)}
      />
    {/snippet}

    {#snippet enemySprite(placed: Placed<(typeof game.enemies)[number]>)}
      {@const enemy = placed.unit}
      {@const i = placed.index}
      {@const inWindow = enemy.shockTimer > 0}
      {@const ringPct = inWindow ? enemy.shockTimer / SHOCK_WINDOW : Math.min(1, enemy.shock / SHOCK_MAX)}
      {@const ringColor = inWindow ? SHOCK_WINDOW_COLOR : '#e0a52e'}
      <!-- kampf-analyse-shock.md §6 (M11-Politur) - visuelles Gewicht skaliert mit dem
           Aufbau-Fuellstand, ausser waehrend des aktiven Fensters (volle Prominenz). -->
      {@const ringIntensity = inWindow ? 1 : ringPct}
      <!-- feinspec §3.9 (M11) - Fokusziel per Klick; ui-layout.md "Gegner verschwinden mit einem
           Takt" - Opacity-Transition statt display:none, der Slot bleibt reserviert (kein
           Nachruecken, `focusTargetIndex` ist ein stabiler Array-Index). -->
      <div
        class="enemy-stack"
        class:defeated={enemy.hp <= 0}
        style:left="calc({placed.slot.x} * var(--s))"
        style:bottom="calc({anchorBottom(placed.slot)} * var(--s))"
        style:width="calc({placed.size} * var(--s))"
        style:height="calc({placed.size} * var(--s))"
        style:z-index={placed.slot.back ? 1 : 2}
        role="button"
        tabindex="0"
        aria-label={enemy.name}
        onclick={() => game.setFocusTarget(i)}
        onkeydown={(e) => e.key === 'Enter' && game.setFocusTarget(i)}
      >
        {#if shockVisible && (ringPct > 0 || inWindow)}
          <div
            class="shock-ring"
            style:--p={ringPct}
            style:--intensity={ringIntensity}
            style:--ring-color={ringColor}
          ></div>
        {/if}
        <img
          class="enemy-img"
          src={ENEMY_SPRITES[enemy.id]}
          alt=""
          draggable="false"
          style:filter={enemyImgFilter(shockVisible && inWindow, placed.slot.back)}
        />
        {#if shockVisible && inWindow}<div class="shock-break">✦</div>{/if}
      </div>
    {/snippet}

    <!-- ui-layout.md "Kontrastplatte fuer U0 (verbindlich)": Name und Balken liegen zwangslaeufig
         vor Sprites und Kulisse; eine dunkle, leicht transparente Platte dahinter ist Pflicht,
         Textumrandung genuegt nicht. Der ganze Block bleibt unter 24 su hoch (inkl. der 4 su
         Luft ueber dem Sprite), sonst kollidieren die HUD-Zeilen der beiden Reihen - deren
         vertikaler Abstand ist genau D.y = 40 su. -->
    {#snippet hud(
      name: string,
      hpPct: number,
      atbPct: number,
      bottom: number,
      x: number,
      mark: 'threat' | 'focus' | null,
      dimmed: boolean,
      suppressed: boolean = false,
    )}
      <div
        class="hud"
        class:dimmed
        style:left="calc({x} * var(--s))"
        style:bottom="calc({bottom} * var(--s))"
      >
        <div class="hud-name">
          {name}
          {#if mark === 'threat'}<span class="threat-mark" title="Enemies attack the highest-HP ally">▲</span
            >{/if}
          {#if mark === 'focus'}<span class="focus-mark" title="Party focus target">◆</span>{/if}
        </div>
        <div class="mini-bar hp"><div class="fill" style:width="{hpPct}%"></div></div>
        <!-- ui-layout.md "Suppress sichtbar machen" - kein zusaetzliches Icon; die ATB-Leiste
             selbst wechselt fuer die Wirkdauer die Farbe, Rueckkehr zur Normalfarbe = Ende der
             Wirkung (kein separater Countdown noetig). -->
        <div class="mini-bar atb" class:suppressed title={suppressed ? 'Suppressed - ATB fills slower' : undefined}>
          <div class="fill" style:width="{atbPct}%"></div>
        </div>
      </div>
    {/snippet}

    <div class="layer-figures">
      {#each partyPlaced as placed (placed.unit.id)}
        {@render partySprite(placed)}
      {/each}
      <!-- ui-layout.md "Gasthaus-Szene" Punkt (1) (M19b) - Buehnenwechsel statt Overlay: keine
           Gegner im Gasthaus, auch keine eingefrorenen aus dem zuletzt verlassenen Kampf. -->
      {#if !inInn}
        {#each enemyPlaced as placed (placed.index)}
          {@render enemySprite(placed)}
        {/each}
      {/if}
    </div>

    <div class="layer-hud">
      {#each partyPlaced as placed (placed.unit.id)}
        {@const unit = placed.unit}
        {#if hasArrived(unit.id)}
          {@render hud(
            unit.name,
            (Math.max(0, unit.hp) / unit.maxHp) * 100,
            Math.min(1, unit.atb) * 100,
            hudBottom(placed.slot, placed.size),
            anchorX(placed.slot),
            unit.id === nextEnemyTargetId && unit.hp > 0 ? 'threat' : null,
            placed.slot.back,
            unit.suppress > 0,
          )}
        {/if}
      {/each}
      {#if !inInn}
      {#each enemyPlaced as placed (placed.index)}
        {@const enemy = placed.unit}
        {#if enemy.hp > 0}
          {@render hud(
            enemy.name,
            (Math.max(0, enemy.hp) / enemy.maxHp) * 100,
            Math.min(1, enemy.atb) * 100,
            hudBottom(placed.slot, placed.size),
            placed.slot.x,
            game.focusTargetIndex === placed.index ? 'focus' : null,
            placed.slot.back,
            enemy.suppress > 0,
          )}
          {#if enemy.trait === 'bomb' && enemy.hitsTaken >= 3}
            <div
              class="telegraph detonate"
              style:left="calc({placed.slot.x} * var(--s))"
              style:bottom="calc({hudBottom(placed.slot, placed.size) + 21} * var(--s))"
            >
              ! DETONATING
            </div>
          {/if}
          {#if enemy.trait === 'boss' && enemy.actionsDone % 3 === 2}
            <!-- gegner-encounter.md §5a/§7 (M16) - derselbe Telegraf traegt jetzt auch den
                 Konter-Hinweis: `counterActive` ist genau in diesem Fenster wahr (s. `tick.ts`)
                 und wird vom ersten erlittenen Treffer verbraucht - der Zusatztext verschwindet
                 dann, obwohl "charging" bis zur AoE weiterlaeuft. -->
            <div
              class="telegraph charging"
              style:left="calc({placed.slot.x} * var(--s))"
              style:bottom="calc({hudBottom(placed.slot, placed.size) + 21} * var(--s))"
            >
              ⚡ Mako core charging…{enemy.counterActive ? ' (retaliates if struck!)' : ''}
            </div>
          {/if}
          {#if enemy.trait === 'heal' && enemy.actionsDone % 3 === 2}
            <!-- gegner-encounter.md §5a (M18) - Telegraf vor dem Heil-Puls, gleiches Vokabular
                 wie der Boss-Konter-Telegraf oben (`ui-layout.md` "charging glow"). -->
            <div
              class="telegraph charging"
              style:left="calc({placed.slot.x} * var(--s))"
              style:bottom="calc({hudBottom(placed.slot, placed.size) + 21} * var(--s))"
            >
              ✚ readying a heal…
            </div>
          {/if}
        {/if}
      {/each}
      {#each enemyPlaced as placed (placed.index)}
        {@const enemy = placed.unit}
        {#if enemy.hp > 0 && enemy.trait === 'heal' && enemy.actionsDone % 3 === 0 && enemy.lastHealAmount}
          {@const healTarget = enemyPlaced.find((p) => p.index === enemy.lastHealTargetIndex)}
          {#if healTarget && healTarget.unit.hp > 0}
            <!-- gegner-encounter.md §5a (M18) - sichtbare Heilzahl ueber dem geheilten Ziel,
                 bleibt stehen, solange der Puls-Zustand haelt (naechste eigene Aktion loescht ihn). -->
            <div
              class="heal-number"
              style:left="calc({healTarget.slot.x} * var(--s))"
              style:bottom="calc({hudBottom(healTarget.slot, healTarget.size) + 34} * var(--s))"
            >
              +{enemy.lastHealAmount} HP
            </div>
          {/if}
        {/if}
      {/each}
      {/if}
    </div>
  </div>
</div>

<style>
  .stage {
    position: relative;
    width: 100%;
    height: 100%;
    background-color: var(--game-bg-deep);
    overflow: hidden;
  }

  /* ui-layout.md "Verankerung und Bleed" - die Kulisse wird mit demselben `s` wie alles andere
     gezeichnet (1 Backdrop-Pixel = 3 su, nativ 224x128 -> 672x384 su) und mit der Unterkante
     der Buehnenbox verankert; der Bleed (je 84 su seitlich, 96 su oben) fuellt den Ueberschuss.
     Kein `cover`, kein Strecken - genau das war der Ausgangsfehler. */
  .backdrop {
    position: absolute;
    left: 50%;
    bottom: 0;
    width: calc(672 * var(--s));
    height: calc(384 * var(--s));
    transform: translateX(-50%);
    background-size: 100% 100%;
    background-repeat: no-repeat;
    image-rendering: pixelated;
    transition: filter 1s linear;
  }

  /* ui-layout.md "Gasthaus-Szene" Punkt (2) - gedaempfter, farbiger Fensterschein statt eines
     zweiten Bildes (regionen-kulissen.md §6a Punkt 4). `mix-blend-mode: color` uebernimmt nur
     Farbton/Saettigung der Signaturfarbe, die vom Baukasten gemalte Helligkeit des Glases bleibt
     erhalten - kein flaches Uebermalen. */
  .inn-window-glow {
    position: absolute;
    mix-blend-mode: color;
    opacity: 0.55;
    pointer-events: none;
  }

  /* ui-layout.md "Gasthaus-Szene" Punkt (1)/(3) - gestaffelte Ankunft: unsichtbar bis zur eigenen
     Verzoegerung, dann ein ruhiges Einblenden (kein Bewegungs-Feuerwerk). */
  .sprite.inn-arriving {
    opacity: 0;
    transition:
      opacity 0.9s ease,
      filter 1s linear;
  }

  .sprite.inn-arriving.arrived {
    opacity: 1;
  }

  /* ui-layout.md "Gasthaus-Szene" Punkt (4) - "Aufbruch: Blende", rein kosmetisch, blockiert nichts. */
  .blende {
    position: absolute;
    inset: 0;
    z-index: 30;
    background: #000;
    pointer-events: none;
    animation: blende-fade 0.38s ease-out forwards;
  }

  @keyframes blende-fade {
    from {
      opacity: 1;
    }
    to {
      opacity: 0;
    }
  }

  /* Die Buehnenbox selbst: 504 x 288 su, horizontal zentriert, Unterkante am Stage-Boden. */
  .box {
    position: absolute;
    left: 50%;
    bottom: 0;
    width: calc(504 * var(--s));
    height: calc(288 * var(--s));
    transform: translateX(-50%);
  }

  .layer-figures,
  .layer-hud {
    position: absolute;
    inset: 0;
  }

  /* U0 liegt global ueber allen Figuren - sonst verdeckt ein vorderes Sprite das HUD einer
     hinteren Figur (ui-layout.md "Ebenen", Fussnote zur Kopfraum-Regel). */
  .layer-hud {
    z-index: 10;
    pointer-events: none;
  }

  /* ui-layout.md "Sprites duerfen nicht ziehbar sein" - `draggable="false"` im Markup deckt die
     meisten Browser ab; die beiden Deklarationen hier fangen den Rest ab (WebKit ignoriert
     `draggable` teils auf <img>, Firefox kann ein Bild sonst per Text-Selektion mitziehen).
     Betrifft nur natives Drag/Select - Klick-Handler (Zielauswahl) bleiben unberuehrt. */
  .sprite,
  .enemy-stack {
    position: absolute;
    transform: translateX(-50%);
    image-rendering: pixelated;
    -webkit-user-drag: none;
    user-select: none;
  }

  .sprite {
    transition: filter 0.15s ease;
  }

  .enemy-stack {
    cursor: pointer;
    transition: opacity 0.6s ease;
  }

  .enemy-stack.defeated {
    opacity: 0;
    pointer-events: none;
  }

  .enemy-img {
    width: 100%;
    height: 100%;
    image-rendering: pixelated;
    transition: filter 0.15s ease;
    -webkit-user-drag: none;
    user-select: none;
  }

  .hud {
    position: absolute;
    width: calc(60 * var(--s));
    margin-left: calc(-30 * var(--s));
    padding: calc(1.5 * var(--s)) calc(3 * var(--s));
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: calc(1 * var(--s));
    /* Kontrastplatte (verbindlich) - dieselbe Anmutung wie das Aktions-Popup. */
    background: rgba(13, 16, 22, 0.72);
    border-radius: calc(1 * var(--s));
  }

  .hud.dimmed {
    filter: brightness(0.88) saturate(0.85);
  }

  .hud-name {
    color: var(--game-text);
    font-size: calc(6.5 * var(--s));
    line-height: 1.1;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 100%;
  }

  .mini-bar {
    width: calc(50 * var(--s));
    height: calc(3 * var(--s));
    background: rgba(0, 0, 0, 0.5);
    border: 1px solid var(--game-border);
    box-sizing: border-box;
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

  /* ui-layout.md "Suppress sichtbar machen" - eigener Farbton, abgesetzt von Gold (Shock),
     Rot (Bedrohung), Cyan (Spielerkontrolle/--game-mp) und der normalen ATB-Farbe: eine
     blasse, entsaettigte "vereiste" Anmutung statt eines weiteren saettigten Tons - passt zur
     Wirkung (etwas ist ausgebremst) und ist auch peripher von der vollen ATB-Farbe zu
     unterscheiden. Rueckkehr zu `.mini-bar.atb .fill` oben = Ende der Wirkdauer, kein
     separater Countdown noetig. */
  .mini-bar.atb.suppressed .fill {
    background: #cdeeff;
  }

  .focus-mark {
    color: var(--game-mp);
  }

  .threat-mark {
    color: #ff5c5c;
  }

  /* kampf-analyse-shock.md §6 - der Ring: Amber-Aufbau (von unten symmetrisch nach oben) bzw.
     Gold-Fenster-Countdown (leert sich von oben nach unten) - dasselbe Element traegt beide
     Phasen. Bodenaufsatz (Ebene F0) im Stapel SEINER Figur, deshalb hier im `.enemy-stack`. */
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
    top: calc(-6 * var(--s));
    left: 50%;
    transform: translateX(-50%);
    color: #ffcc33;
    font-size: calc(10 * var(--s));
    text-shadow: 0 0 calc(3 * var(--s)) #ffcc33;
    pointer-events: none;
  }

  .telegraph {
    position: absolute;
    transform: translateX(-50%);
    padding: calc(1 * var(--s)) calc(3 * var(--s));
    font-size: calc(5.5 * var(--s));
    font-weight: 700;
    letter-spacing: 0.03em;
    white-space: nowrap;
    background: rgba(13, 16, 22, 0.72);
    border-radius: calc(1 * var(--s));
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

  .heal-number {
    position: absolute;
    transform: translateX(-50%);
    color: #6dffb0;
    font-size: calc(7 * var(--s));
    font-weight: 700;
    text-shadow: 0 0 calc(3 * var(--s)) rgba(0, 0, 0, 0.8);
    pointer-events: none;
    white-space: nowrap;
  }

  @keyframes pulse {
    from {
      opacity: 0.6;
    }
    to {
      opacity: 1;
    }
  }

  .banner {
    position: absolute;
    top: 16px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 20;
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
</style>

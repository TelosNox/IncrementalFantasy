<script lang="ts">
  import reactorRow from '../assets/regions/reactor_row_480.png'
  import bargainBazaar from '../assets/regions/bargain_bazaar_480.png'
  import megacorpTower from '../assets/regions/megacorp_tower_480.png'
  import { GATE_MONSTER_IDS } from '../content/monsters'
  import { SHOCK_MAX, SHOCK_WINDOW } from '../core/formulas'
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
        Defeat – retry in {Math.ceil(game.retryRemaining)}s
      {:else if game.awaitingUnit}
        {game.awaitingUnit.name} is ready – choose an action
      {:else if game.isCurrentZoneGate}
        ⚠ Gate – Auto only attacks here, switch to Manual for Specials/Limit!
      {:else}
        {regionLabel} – Zone {game.save.currentZone} / {CHAPTER1_MAX_ZONE}
      {/if}
    </div>
  {/if}

  <div class="floor">
    <div class="party-side">
      {#each game.party as unit (unit.id)}
        {@const hpPct = (Math.max(0, unit.hp) / unit.maxHp) * 100}
        {@const atbPct = Math.min(1, unit.atb) * 100}
        <div class="unit party">
          <div class="unit-label">{unit.name}</div>
          <div class="mini-bar hp"><div class="fill" style:width="{hpPct}%"></div></div>
          <div class="mini-bar atb"><div class="fill" style:width="{atbPct}%"></div></div>
          <img src={CHARACTER_SPRITES[unit.id]} alt={unit.name} />
        </div>
      {/each}
    </div>

    <div class="enemy-side">
      {#each game.enemies as enemy, i (i)}
        {@const hpPct = (Math.max(0, enemy.hp) / enemy.maxHp) * 100}
        {@const atbPct = Math.min(1, enemy.atb) * 100}
        {@const isGate = GATE_MONSTER_IDS.has(enemy.id)}
        {@const size = spriteSize(enemy.id)}
        {@const inWindow = enemy.shockTimer > 0}
        {@const ringPct = inWindow ? enemy.shockTimer / SHOCK_WINDOW : Math.min(1, enemy.shock / SHOCK_MAX)}
        {@const ringColor = inWindow ? '#ffcc33' : '#e0a52e'}
        <div class="unit enemy">
          <div class="unit-label">{enemy.name}</div>
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
              <div class="shock-ring" style:--p={ringPct} style:--ring-color={ringColor}></div>
              <img
                src={ENEMY_SPRITES[enemy.id]}
                alt={enemy.name}
                class:shocked={inWindow}
                style:width="100%"
                style:height="100%"
              />
              {#if inWindow}<div class="shock-break">✦</div>{/if}
            </div>
          {:else}
            <img src={ENEMY_SPRITES[enemy.id]} alt={enemy.name} style:width="{size}px" style:height="{size}px" />
          {/if}
        </div>
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
    overflow: hidden;
  }

  .banner {
    position: absolute;
    top: 16px;
    left: 50%;
    transform: translateX(-50%);
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

  .floor {
    position: absolute;
    bottom: 8%;
    left: 0;
    right: 0;
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    padding: 0 10%;
    box-sizing: border-box;
  }

  .party-side,
  .enemy-side {
    display: flex;
    gap: 24px;
    align-items: flex-end;
  }

  .unit {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
  }

  /* ui-layout.md "Display-Zoom": 2x Nearest-Neighbor-Zoom auf allen Sprite-Klassen gemeinsam -
     Standard 64px nativ -> 128px effektiv (party: fest hier); Enemy-Groessen (Standard/Miniboss/
     Kapitel-Boss) kommen inline ueber `spriteSize()`, s. <script>. */
  .unit img {
    width: 128px;
    height: 128px;
    image-rendering: pixelated;
  }

  .unit img.shocked {
    filter: drop-shadow(0 0 6px #ffcc33) drop-shadow(0 0 2px #ffcc33);
  }

  /* kampf-analyse-shock.md §6 - der Ring: Amber-Aufbau (von unten symmetrisch nach oben,
     0-99%) bzw. Gold-Fenster-Countdown (leert sich von oben symmetrisch nach unten) - dasselbe
     Element traegt beide Phasen, Farbe/Richtung unterscheidet sie (s. `ringPct`/`ringColor` oben). */
  .shock-wrap {
    position: relative;
  }

  .shock-ring {
    position: absolute;
    inset: -10%;
    border-radius: 50%;
    pointer-events: none;
    background: conic-gradient(
      from 0deg,
      transparent 0deg,
      transparent calc(180deg - var(--p) * 180deg),
      var(--ring-color) calc(180deg - var(--p) * 180deg),
      var(--ring-color) calc(180deg + var(--p) * 180deg),
      transparent calc(180deg + var(--p) * 180deg),
      transparent 360deg
    );
    -webkit-mask-image: radial-gradient(circle, transparent 60%, black 61%, black 76%, transparent 77%);
    mask-image: radial-gradient(circle, transparent 60%, black 61%, black 76%, transparent 77%);
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

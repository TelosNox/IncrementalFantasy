<script lang="ts">
  import reactorRow from '../assets/regions/reactor_row_480.png'
  import bargainBazaar from '../assets/regions/bargain_bazaar_480.png'
  import { GATE_MONSTER_IDS } from '../content/monsters'
  import { CHARACTER_SPRITES, ENEMY_SPRITES } from './sprites'
  import { REGION2_MAX_ZONE, game } from './gameStore.svelte'

  // encounter-zyklus1.md/feinspec §3.7 - Region 1 = Zone 1-8, Region 2 = 9-18.
  // Vaultron/Region 3 (Zone 19-30) folgt erst in M8.
  const backdrop = $derived(game.save.currentZone <= 8 ? reactorRow : bargainBazaar)
  const regionLabel = $derived(game.save.currentZone <= 8 ? 'R1 · Reactor Row' : 'R2 · Bargain Bazaar')
</script>

<div class="stage" style:background-image={`url(${backdrop})`}>
  <!-- ui-layout.md "Freischaltungs-Hinweis": ueberdeckt kurzzeitig die normale Statuszeile,
       pausiert aber nichts - reines Lesbarkeits-Add-on bei Rollout-Flag-Wechseln. -->
  {#if game.calloutMessage}
    <div class="banner callout">{game.calloutMessage}</div>
  {:else}
    <div class="banner">
      {#if game.phase === 'region2-paused'}
        Victory! Region 2 complete – Region 3 continues in M8 (Tofa, Arris, Shock).
      {:else if game.phase === 'retry'}
        Defeat – retry in {Math.ceil(game.retryRemaining)}s
      {:else if game.awaitingUnit}
        {game.awaitingUnit.name} is ready – choose an action
      {:else if game.isCurrentZoneGate}
        ⚠ Gate – Auto only attacks here, switch to Manual for Specials/Limit!
      {:else}
        {regionLabel} – Zone {game.save.currentZone} / {REGION2_MAX_ZONE}
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
        <div class="unit enemy" class:boss={isGate}>
          <div class="unit-label">{enemy.name}</div>
          <div class="mini-bar hp"><div class="fill" style:width="{hpPct}%"></div></div>
          <div class="mini-bar atb"><div class="fill" style:width="{atbPct}%"></div></div>
          <img src={ENEMY_SPRITES[enemy.id]} alt={enemy.name} class:boss={isGate} />
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

  /* ui-layout.md "Display-Zoom": 2x Nearest-Neighbor-Zoom auf allen Sprite-Klassen
     gemeinsam - Standard 64px nativ -> 128px effektiv, Miniboss 96px nativ -> 192px effektiv. */
  .unit img {
    width: 128px;
    height: 128px;
    image-rendering: pixelated;
  }

  .unit img.boss {
    width: 192px;
    height: 192px;
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

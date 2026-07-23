<script lang="ts">
  import claudeSprite from '../assets/characters/claude_64.png'
  import blandoSprite from '../assets/monsters/blando_64.png'
  import backdrop from '../assets/regions/reactor_row_480.png'
  import { M5_MAX_ZONE, game } from './gameStore.svelte'

  const claude = $derived(game.claude)
  const enemy = $derived(game.enemy)
  const claudeHpPct = $derived((Math.max(0, claude.hp) / claude.maxHp) * 100)
  const claudeAtbPct = $derived(Math.min(1, claude.atb) * 100)
  const enemyHpPct = $derived(enemy ? (Math.max(0, enemy.hp) / enemy.maxHp) * 100 : 0)
  const enemyAtbPct = $derived(enemy ? Math.min(1, enemy.atb) * 100 : 0)
</script>

<div class="stage" style:background-image={`url(${backdrop})`}>
  <div class="banner">
    {#if game.phase === 'region1-paused'}
      Victory! Region 1 continues in M6 (weapon, auto-attack, limit, miniboss).
    {:else if game.phase === 'retry'}
      Defeat – retry in {Math.ceil(game.retryRemaining)}s
    {:else if game.awaitingAttack}
      Clicker intro: tap "Attack" to trigger Claude's ATB action
    {:else}
      Zone {game.save.currentZone} / {M5_MAX_ZONE} – Reactor Row
    {/if}
  </div>

  <div class="floor">
    <div class="unit party">
      <div class="unit-label">{claude.name}</div>
      <div class="mini-bar hp"><div class="fill" style:width="{claudeHpPct}%"></div></div>
      <div class="mini-bar atb"><div class="fill" style:width="{claudeAtbPct}%"></div></div>
      <img src={claudeSprite} alt={claude.name} />
    </div>

    {#if enemy}
      <div class="unit enemy">
        <div class="unit-label">{enemy.name}</div>
        <div class="mini-bar hp"><div class="fill" style:width="{enemyHpPct}%"></div></div>
        <div class="mini-bar atb"><div class="fill" style:width="{enemyAtbPct}%"></div></div>
        <img src={blandoSprite} alt={enemy.name} />
      </div>
    {/if}
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

  .floor {
    position: absolute;
    bottom: 8%;
    left: 0;
    right: 0;
    display: flex;
    justify-content: space-around;
    align-items: flex-end;
    padding: 0 10%;
    box-sizing: border-box;
  }

  .unit {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
  }

  .unit img {
    width: 64px;
    height: 64px;
    image-rendering: pixelated;
  }

  .unit-label {
    color: var(--game-text);
    font-size: 12px;
  }

  .mini-bar {
    width: 64px;
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

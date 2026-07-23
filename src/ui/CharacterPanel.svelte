<script lang="ts">
  import { game } from './gameStore.svelte'

  const claude = $derived(game.claude)
  const hpPct = $derived((Math.max(0, claude.hp) / claude.maxHp) * 100)
  const atbPct = $derived(Math.min(1, claude.atb) * 100)
  const limitPct = $derived(Math.min(100, claude.limit))
</script>

<div class="panel">
  <div class="header">
    <span class="name">{claude.name}</span>
  </div>

  <div class="row">
    <span class="label">HP</span>
    <div class="bar hp"><div class="fill" style:width="{hpPct}%"></div></div>
    <span class="value">{Math.max(0, claude.hp)}/{claude.maxHp}</span>
  </div>

  <div class="row">
    <span class="label">ATB</span>
    <div class="bar atb"><div class="fill" style:width="{atbPct}%"></div></div>
  </div>

  <div class="row">
    <span class="label">Limit</span>
    <div class="bar limit"><div class="fill" style:width="{limitPct}%"></div></div>
  </div>

  <button class="attack" disabled={!game.awaitingAttack} onclick={() => game.attack()}> Attack </button>
</div>

<style>
  .panel {
    display: flex;
    flex-direction: column;
    gap: 6px;
    width: 260px;
    padding: 12px;
    background: var(--game-panel-bg);
    border: 1px solid var(--game-border);
    box-sizing: border-box;
  }

  .header {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
  }

  .name {
    color: var(--game-text-bright);
    font-weight: 600;
  }

  .row {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .label {
    width: 34px;
    color: var(--game-text);
    font-size: 12px;
  }

  .bar {
    flex: 1;
    height: 10px;
    background: rgba(0, 0, 0, 0.5);
    border: 1px solid var(--game-border);
  }

  .bar .fill {
    height: 100%;
    transition: width 0.1s linear;
  }

  .bar.hp .fill {
    background: var(--game-hp);
  }

  .bar.atb .fill {
    background: var(--game-atb);
  }

  .bar.limit .fill {
    background: var(--game-limit);
  }

  .value {
    color: var(--game-text);
    font-size: 12px;
    min-width: 52px;
    text-align: right;
  }

  .attack {
    margin-top: 6px;
    padding: 10px;
    background: var(--game-gold);
    color: #1a1400;
    border: none;
    font-weight: 700;
    letter-spacing: 0.05em;
    cursor: pointer;
  }

  .attack:disabled {
    background: var(--game-border);
    color: var(--game-text);
    cursor: default;
  }
</style>

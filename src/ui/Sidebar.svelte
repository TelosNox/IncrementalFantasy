<script lang="ts">
  import { game } from './gameStore.svelte'
  import { MONSTERS } from '../content/monsters'
  import BestiaryModal from './BestiaryModal.svelte'

  const regionName = $derived(game.save.currentZone <= 8 ? 'Reactor Row' : 'Bargain Bazaar')
  const regionIndex = $derived(game.save.currentZone <= 8 ? 1 : 2)
  const bestiaryCount = $derived(Object.keys(game.save.bestiary).length)
  const catalogSize = $derived(Object.keys(MONSTERS).length)
</script>

<div class="sidebar">
  <div class="title">IncrementalFantasy</div>
  <div class="subtitle">Chapter 1 – The Grid</div>
  <div class="zone">R{regionIndex} · {regionName} · Zone {game.save.currentZone}</div>

  <div class="currency">
    <span class="currency-label">Gil</span>
    <span class="currency-value">{game.save.currencies.gil.toString()}</span>
  </div>

  <button class="bestiary-button" onclick={() => game.openBestiary()}>
    Bestiary <span class="count">({bestiaryCount}/{catalogSize})</span>
  </button>

  <!-- ui-layout.md: Menü-Bereich bleibt reservierter Platz, Inhalt folgt ab M8+. -->
  <div class="reserved">Team / Equipment / Stats coming in later milestones.</div>
</div>

<BestiaryModal />

<style>
  .sidebar {
    display: flex;
    flex-direction: column;
    gap: 8px;
    height: 100%;
    padding: 16px;
    box-sizing: border-box;
    background: var(--game-panel-bg);
  }

  .title {
    color: var(--game-gold);
    font-weight: 700;
    font-size: 18px;
  }

  .subtitle {
    color: var(--game-text);
    font-size: 13px;
  }

  .zone {
    color: var(--game-text-bright);
    font-size: 13px;
    margin-top: 4px;
  }

  .currency {
    display: flex;
    justify-content: space-between;
    margin-top: 8px;
    padding-top: 8px;
    border-top: 1px solid var(--game-border);
    color: var(--game-text-bright);
    font-size: 14px;
  }

  .currency-value {
    color: var(--game-gold);
  }

  .bestiary-button {
    margin-top: 8px;
    padding: 8px;
    background: transparent;
    color: var(--game-text-bright);
    border: 1px solid var(--game-border);
    border-radius: 3px;
    font-size: 13px;
    text-align: left;
    cursor: pointer;
  }

  .bestiary-button:hover {
    border-color: var(--game-gold);
    color: var(--game-gold);
  }

  .count {
    opacity: 0.7;
  }

  .reserved {
    margin-top: auto;
    color: var(--game-text);
    font-size: 12px;
    opacity: 0.6;
  }
</style>

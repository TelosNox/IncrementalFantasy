<script lang="ts">
  import { game } from './gameStore.svelte'
</script>

<div class="sidebar">
  <div class="title">IncrementalFantasy</div>
  <div class="subtitle">Kapitel 1 – The Grid</div>
  <div class="zone">R1 · Reactor Row · Zone {game.save.currentZone}</div>

  <div class="currency">
    <span class="currency-label">Gil</span>
    <span class="currency-value">{game.save.currencies.gil.toString()}</span>
  </div>

  <!-- ui-layout.md: Menü-Bereich bleibt reservierter Platz, Inhalt folgt ab M6+. -->
  <div class="reserved">Team / Shop / Bestiarium / Stats folgen in späteren Meilensteinen.</div>
</div>

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

  .reserved {
    margin-top: auto;
    color: var(--game-text);
    font-size: 12px;
    opacity: 0.6;
  }
</style>

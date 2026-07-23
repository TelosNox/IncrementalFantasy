<script lang="ts">
  import { game } from './gameStore.svelte'
  import CharacterPanel from './CharacterPanel.svelte'
</script>

<div class="bottom-bar">
  {#each game.party as unit (unit.id)}
    <CharacterPanel {unit} />
  {/each}
</div>

<style>
  .bottom-bar {
    display: flex;
    align-items: center;
    height: 100%;
    padding: 12px;
    box-sizing: border-box;
    gap: 12px;
    overflow-x: auto;
  }
</style>

<script lang="ts">
  import CharacterPanel from './CharacterPanel.svelte'
</script>

<div class="bottom-bar">
  <CharacterPanel />
</div>

<style>
  .bottom-bar {
    display: flex;
    align-items: center;
    height: 100%;
    padding: 12px;
    box-sizing: border-box;
    gap: 12px;
  }
</style>

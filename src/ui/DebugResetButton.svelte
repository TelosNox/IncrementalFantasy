<script lang="ts">
  // Architektur §6a - reines Playtest-Debugwerkzeug, kein Spielfeature.
  // Nur in Dev-Builds sichtbar (npm run dev); `vite build` setzt DEV auf
  // false, damit dieser Button nie im veröffentlichten GitHub-Pages-Build landet.
  import { game } from './gameStore.svelte'

  function handleClick() {
    if (confirm('Reset save? This deletes all progress and reloads the page.')) {
      game.resetSave()
    }
  }
</script>

{#if import.meta.env.DEV}
  <button class="debug-reset" onclick={handleClick} title="Playtest debug tool - clears the save and reloads">
    ⟳ Reset save
  </button>
{/if}

<style>
  .debug-reset {
    position: fixed;
    right: 8px;
    bottom: 8px;
    z-index: 1000;
    padding: 4px 8px;
    background: rgba(0, 0, 0, 0.6);
    color: #ff8080;
    border: 1px solid #ff8080;
    border-radius: 3px;
    font-size: 11px;
    letter-spacing: 0.02em;
    opacity: 0.55;
    cursor: pointer;
  }

  .debug-reset:hover {
    opacity: 1;
  }
</style>

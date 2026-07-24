<script lang="ts">
  import { onMount } from 'svelte'
  import { game } from './gameStore.svelte'
  import Stage from './Stage.svelte'
  import BottomBar from './BottomBar.svelte'
  import Sidebar from './Sidebar.svelte'
  import DebugResetButton from './DebugResetButton.svelte'
  import WelcomeBackModal from './WelcomeBackModal.svelte'

  onMount(() => {
    game.start()
    return () => game.stop()
  })
</script>

<div class="layout">
  <div class="stage-area"><Stage /></div>
  <div class="bottom-area"><BottomBar /></div>
  <div class="sidebar-area"><Sidebar /></div>
</div>

<DebugResetButton />
<WelcomeBackModal />

<style>
  /* ui-layout.md: Stage ~78%, Bottom-Leiste ~20% Höhe, Seitenleiste ~22% Breite. */
  .layout {
    display: grid;
    grid-template-columns: 1fr minmax(220px, 22%);
    grid-template-rows: 1fr minmax(130px, 20%);
    width: 100vw;
    height: 100vh;
    background: var(--game-bg-deep);
  }

  .stage-area {
    grid-column: 1;
    grid-row: 1;
    min-height: 0;
    min-width: 0;
  }

  .bottom-area {
    grid-column: 1;
    grid-row: 2;
    border-top: 1px solid var(--game-border);
  }

  .sidebar-area {
    grid-column: 2;
    grid-row: 1 / span 2;
    border-left: 1px solid var(--game-border);
  }
</style>

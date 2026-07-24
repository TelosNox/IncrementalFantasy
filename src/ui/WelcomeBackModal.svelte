<script lang="ts">
  // Architektur §5/niederlage-offline.md §3 - macht den in M4 gebauten Offline-Projektionsrechner
  // sichtbar ("Willkommen zurück"-Screen, M9). Nicht-modal-blockierend im Sinne von "muss geloest
  // werden" - ein einfacher Dismiss reicht, das Match laeuft im Hintergrund normal weiter.
  import { game } from './gameStore.svelte'

  function formatDuration(totalSeconds: number): string {
    const hours = Math.floor(totalSeconds / 3600)
    const minutes = Math.floor((totalSeconds % 3600) / 60)
    if (hours > 0) return `${hours}h ${minutes}m`
    if (minutes > 0) return `${minutes}m`
    return `${Math.floor(totalSeconds)}s`
  }
</script>

{#if game.welcomeBack}
  {@const wb = game.welcomeBack}
  <div
    class="overlay"
    role="button"
    tabindex="0"
    onclick={() => game.dismissWelcomeBack()}
    onkeydown={(e) => e.key === 'Escape' && game.dismissWelcomeBack()}
  >
    <div
      class="card"
      role="dialog"
      aria-label="Welcome back"
      tabindex="-1"
      onclick={(e) => e.stopPropagation()}
      onkeydown={(e) => e.stopPropagation()}
    >
      <div class="card-header">
        <span class="title">WELCOME BACK</span>
        <button class="close" onclick={() => game.dismissWelcomeBack()} aria-label="Close">×</button>
      </div>

      <div class="away">You were away for {formatDuration(wb.elapsedSeconds)}.</div>

      {#if wb.wasClearing}
        <div class="summary">
          While you were gone, the party cleared Zone {wb.zone} <strong>{wb.repeats}×</strong>:
        </div>
        <div class="stat-row"><span>Gil earned</span><span class="value gold">+{wb.gilGained}</span></div>
        <div class="stat-row"><span>Party</span><span class="value">leveled up</span></div>
      {:else}
        <div class="summary stuck">
          The party got stuck at Zone {wb.zone} - no progress while you were away. A different build, a
          manual push, or some more grinding at the last cleared zone should help.
        </div>
      {/if}

      <button class="dismiss" onclick={() => game.dismissWelcomeBack()}>Continue</button>
    </div>
  </div>
{/if}

<style>
  .overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.6);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 200;
  }

  .card {
    width: min(420px, 90vw);
    background: #171a2c;
    border: 2px solid var(--game-mp);
    border-radius: 6px;
    padding: 16px 20px;
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.6);
  }

  .card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid var(--game-border);
    padding-bottom: 8px;
    margin-bottom: 14px;
  }

  .title {
    color: var(--game-mp);
    font-weight: 700;
    letter-spacing: 0.06em;
    font-size: 14px;
  }

  .close {
    background: transparent;
    border: none;
    color: var(--game-text);
    font-size: 18px;
    cursor: pointer;
    line-height: 1;
  }

  .close:hover {
    color: var(--game-text-bright);
  }

  .away {
    color: var(--game-text-bright);
    font-size: 13px;
    margin-bottom: 10px;
  }

  .summary {
    color: var(--game-text-bright);
    font-size: 13px;
    margin-bottom: 10px;
  }

  .summary.stuck {
    color: var(--game-text);
  }

  .stat-row {
    display: flex;
    justify-content: space-between;
    font-size: 13px;
    color: var(--game-text-bright);
    padding: 4px 0;
  }

  .value {
    color: var(--game-text-bright);
    font-weight: 600;
  }

  .value.gold {
    color: var(--game-gold);
  }

  .dismiss {
    margin-top: 16px;
    width: 100%;
    padding: 10px;
    background: var(--game-mp);
    color: #06222a;
    border: none;
    border-radius: 3px;
    font-weight: 700;
    font-size: 14px;
    cursor: pointer;
  }

  .dismiss:hover {
    filter: brightness(1.1);
  }
</style>

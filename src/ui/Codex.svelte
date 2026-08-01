<script lang="ts">
  // ui-layout.md "Mechanik-Einführung" §Codex (M17) - dauerhaft nachlesbare Liste aller 13
  // Einführungen. Layout/Muster wie `BestiaryModal.svelte` (Thumb-Row + Detail-Panel), aber
  // ohne Statwerte - hier nur Titel + Erklärtext. Ungesehene Einträge bleiben "???", genau wie
  // unentdeckte Bestiarium-Karten.
  import { game } from './gameStore.svelte'
  import { INTRO_ORDER, INTRODUCTIONS } from '../content/introductions'
  import { CHARACTER_SPRITES } from './sprites'

  const seen = $derived(game.save.introsSeen)
  const selected = $derived(game.selectedIntroId ? INTRODUCTIONS[game.selectedIntroId] : null)
  const selectedSeen = $derived(game.selectedIntroId ? Boolean(seen[game.selectedIntroId]) : false)
  const entryIndex = $derived(game.selectedIntroId ? INTRO_ORDER.indexOf(game.selectedIntroId) + 1 : 0)
</script>

{#if game.codexOpen}
  <div
    class="overlay"
    role="button"
    tabindex="0"
    onclick={() => game.closeCodex()}
    onkeydown={(e) => e.key === 'Escape' && game.closeCodex()}
  >
    <div
      class="card"
      role="dialog"
      aria-label="Codex"
      tabindex="-1"
      onclick={(e) => e.stopPropagation()}
      onkeydown={(e) => e.stopPropagation()}
    >
      <div class="card-header">
        <span class="title">CODEX</span>
        <span class="entry">{#if selected}Entry {String(entryIndex).padStart(2, '0')} / {INTRO_ORDER.length}{/if}</span>
        <button class="close" onclick={() => game.closeCodex()} aria-label="Close">×</button>
      </div>

      {#if selected && selectedSeen}
        <div class="body">
          {#if selected.characterIds}
            <div class="portraits">
              {#each selected.characterIds as id (id)}
                <img src={CHARACTER_SPRITES[id]} alt={id} />
              {/each}
            </div>
          {/if}
          <div class="name">{selected.title}</div>
          {#each selected.lines as line (line)}
            <p>{line}</p>
          {/each}
        </div>
      {:else}
        <div class="empty">
          {selected ? 'Not encountered yet – keep playing to unlock this entry.' : 'Select an entry below.'}
        </div>
      {/if}

      <div class="thumb-row">
        {#each INTRO_ORDER as id, i (id)}
          {@const known = Boolean(seen[id])}
          <button
            class="thumb"
            class:known
            class:active={id === game.selectedIntroId}
            onclick={() => game.selectIntro(id)}
            title={known ? INTRODUCTIONS[id].title : '???'}
          >
            {known ? i + 1 : '?'}
          </button>
        {/each}
      </div>
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
    z-index: 100;
  }

  .card {
    width: min(560px, 90vw);
    background: #171a2c;
    border: 2px solid var(--game-gold);
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
    color: var(--game-gold);
    font-weight: 700;
    letter-spacing: 0.08em;
  }

  .entry {
    color: var(--game-text);
    font-size: 12px;
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

  .body {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    min-height: 100px;
    justify-content: center;
  }

  .portraits {
    display: flex;
    gap: 8px;
  }

  .portraits img {
    width: 56px;
    height: 56px;
    image-rendering: pixelated;
  }

  .name {
    color: var(--game-text-bright);
    font-weight: 700;
  }

  .body p {
    margin: 0;
    color: var(--game-text-bright);
    font-size: 13px;
    text-align: center;
  }

  .empty {
    color: var(--game-text);
    font-size: 13px;
    padding: 20px 0;
    text-align: center;
    min-height: 100px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .thumb-row {
    display: flex;
    gap: 6px;
    margin-top: 16px;
    padding-top: 12px;
    border-top: 1px solid var(--game-border);
    flex-wrap: wrap;
  }

  .thumb {
    width: 32px;
    height: 32px;
    padding: 2px;
    background: rgba(0, 0, 0, 0.4);
    border: 1px solid var(--game-border);
    border-radius: 3px;
    cursor: pointer;
    color: var(--game-text);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
  }

  .thumb.known {
    color: var(--game-text-bright);
  }

  .thumb.known:hover {
    border-color: var(--game-gold);
  }

  .thumb.active {
    border-color: var(--game-gold);
    box-shadow: 0 0 0 1px var(--game-gold);
  }
</style>

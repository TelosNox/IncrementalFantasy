<script lang="ts">
  // ui-layout.md "Mechanik-Einführung" (M17) - blockierendes Popup, Kampfuhr pausiert
  // (s. `gameStore.svelte.ts` `advance()` "if (this.activeIntro) return"). Anders als
  // `BestiaryModal.svelte`/`ReunionModal.svelte` schließt ein Klick auf den Hintergrund
  // NICHT - die Spec verlangt "aktiv wegklicken", kein versehentliches Wegklicken daneben.
  import { game } from './gameStore.svelte'
  import { INTRODUCTIONS } from '../content/introductions'
  import { CHARACTER_SPRITES } from './sprites'

  const intro = $derived(game.activeIntro ? INTRODUCTIONS[game.activeIntro] : null)
</script>

{#if intro}
  <div class="overlay">
    <div
      class="card"
      role="dialog"
      aria-label={intro.title}
      aria-modal="true"
      tabindex="-1"
      onkeydown={(e) => e.key === 'Escape' && game.closeIntro()}
    >
      {#if intro.characterIds}
        <div class="portraits">
          {#each intro.characterIds as id (id)}
            <img src={CHARACTER_SPRITES[id]} alt={id} />
          {/each}
        </div>
      {/if}
      <div class="title">{intro.title}</div>
      <div class="body">
        {#each intro.lines as line (line)}
          <p>{line}</p>
        {/each}
      </div>
      <button class="continue" onclick={() => game.closeIntro()}>Got it</button>
    </div>
  </div>
{/if}

<style>
  .overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.7);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 200;
  }

  .card {
    width: min(420px, 90vw);
    background: #171a2c;
    border: 2px solid var(--game-gold);
    border-radius: 6px;
    padding: 20px 24px;
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.6);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
  }

  .portraits {
    display: flex;
    gap: 12px;
  }

  .portraits img {
    width: 72px;
    height: 72px;
    image-rendering: pixelated;
  }

  .title {
    color: var(--game-gold);
    font-weight: 700;
    letter-spacing: 0.06em;
    font-size: 16px;
    text-align: center;
  }

  .body {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .body p {
    margin: 0;
    color: var(--game-text-bright);
    font-size: 13px;
    line-height: 1.5;
    text-align: center;
  }

  .continue {
    margin-top: 4px;
    padding: 8px 24px;
    background: transparent;
    color: var(--game-gold);
    border: 1px solid var(--game-gold);
    border-radius: 3px;
    font-size: 13px;
    font-weight: 700;
    cursor: pointer;
  }

  .continue:hover {
    background: rgba(224, 165, 46, 0.12);
  }
</style>

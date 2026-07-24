<script lang="ts">
  // prestige-reunion.md/feinspec §1.4 (Mockup 04_reunion.png) - klare Reset-/Persistenz-Listen +
  // Reunion-Essenz-Ertrag. Verfuegbar sobald `game.canReunion` (Zone 30 erreicht, s. gameStore.ts
  // "man muss die Wand nicht schlagen, um zu reunionen"), nicht erst nach Vaultrons Niederlage.
  import { game, REUNION_ESSENCE_GAIN } from './gameStore.svelte'

  const nextReunionCount = $derived(game.save.reunionCount + 1)
  const isFirstReunion = $derived(nextReunionCount === 1)
  const currentBoostPct = $derived(Math.round((game.reunionBoostMult - 1) * 100))
  const nextBoostPct = $derived(currentBoostPct + 5)
</script>

{#if game.reunionModalOpen}
  <div
    class="overlay"
    role="button"
    tabindex="0"
    onclick={() => game.closeReunionModal()}
    onkeydown={(e) => e.key === 'Escape' && game.closeReunionModal()}
  >
    <div
      class="card"
      role="dialog"
      aria-label="Reunion"
      tabindex="-1"
      onclick={(e) => e.stopPropagation()}
      onkeydown={(e) => e.stopPropagation()}
    >
      <div class="card-header">
        <span class="title">REUNION{isFirstReunion ? ' - THE 1ST' : ` #${nextReunionCount}`}</span>
        <button class="close" onclick={() => game.closeReunionModal()} aria-label="Close">×</button>
      </div>

      {#if isFirstReunion}
        <div class="graduation">★ Graduation: Gambit programming unlocks (a future chapter's automation layer)</div>
      {/if}

      <div class="lists">
        <div class="list resets">
          <div class="list-title">Resets</div>
          <ul>
            <li>Zone progress → Zone 1</li>
            <li>Character levels → Level 1</li>
            <li>Gil → 0</li>
            <li>Weapon tiers → Tier 0</li>
          </ul>
        </div>
        <div class="list keeps">
          <div class="list-title">Persists</div>
          <ul>
            <li>Recruited roster ({game.save.roster.length} characters)</li>
            <li>Bestiary &amp; analysis ({Object.keys(game.save.bestiary).length} entries)</li>
            <li>Learned specials &amp; unlocked controls</li>
            <li>Permanent boost (stacks further this run)</li>
          </ul>
        </div>
      </div>

      <div class="reward">
        <div class="reward-row">
          <span>Reunion Essence</span>
          <span class="value gold">+{REUNION_ESSENCE_GAIN}</span>
        </div>
        <div class="reward-row">
          <span>Permanent boost (ATK/MAG/HP/MP)</span>
          <span class="value gold">+{currentBoostPct}% → +{nextBoostPct}%</span>
        </div>
      </div>

      <button class="confirm" onclick={() => game.reunion()}>Confirm Reunion</button>
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
    width: min(520px, 90vw);
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

  .graduation {
    margin-bottom: 14px;
    padding: 8px 10px;
    border: 1px solid var(--game-gold);
    border-radius: 3px;
    color: var(--game-gold);
    font-size: 12px;
    font-weight: 600;
  }

  .lists {
    display: flex;
    gap: 16px;
  }

  .list {
    flex: 1;
    min-width: 0;
  }

  .list-title {
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    margin-bottom: 6px;
  }

  .resets .list-title {
    color: var(--game-hp);
  }

  .keeps .list-title {
    color: var(--game-mp);
  }

  .list ul {
    margin: 0;
    padding-left: 16px;
    font-size: 12px;
    color: var(--game-text-bright);
    line-height: 1.6;
  }

  .reward {
    margin-top: 16px;
    padding-top: 12px;
    border-top: 1px solid var(--game-border);
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .reward-row {
    display: flex;
    justify-content: space-between;
    font-size: 13px;
    color: var(--game-text-bright);
  }

  .value.gold {
    color: var(--game-gold);
    font-weight: 700;
  }

  .confirm {
    margin-top: 16px;
    width: 100%;
    padding: 10px;
    background: var(--game-gold);
    color: #201a0a;
    border: none;
    border-radius: 3px;
    font-weight: 700;
    font-size: 14px;
    cursor: pointer;
  }

  .confirm:hover {
    filter: brightness(1.1);
  }
</style>

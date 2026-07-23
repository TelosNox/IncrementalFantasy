<script lang="ts">
  // feinspec §1.3/kampf-analyse-shock.md §5 - Bestiarium-Karte: Grundstats +
  // sichtbare Schwäche, hier stets als Kapitel-2-Teaser markiert
  // (weaknessUsable bleibt in Kapitel 1 immer false). Layout orientiert sich
  // an `assets/mockups/03_analyse_bestiarium.png`.
  import { game } from './gameStore.svelte'
  import { MONSTERS, MONSTER_INSPIRED_BY } from '../content/monsters'
  import { ENEMY_SPRITES } from './sprites'

  const catalog = $derived(Object.keys(MONSTERS))
  const discovered = $derived(Object.keys(game.save.bestiary))
  const selected = $derived(game.selectedMonsterId ? game.save.bestiary[game.selectedMonsterId] : null)
  const monster = $derived(game.selectedMonsterId ? MONSTERS[game.selectedMonsterId] : null)
  const entryIndex = $derived(game.selectedMonsterId ? catalog.indexOf(game.selectedMonsterId) + 1 : 0)

  // Rein visuelle Balkenskalierung (kein Gameplay-Wert) - Referenzmaxima aus
  // dem Kapitel-1-Katalog (feinspec §6.2: höchste HP/ATK/DEF/SPD über alle
  // Monster inkl. Gates).
  const STAT_MAX = { hp: 250, atk: 16, def: 16, spd: 180 }
</script>

{#if game.bestiaryOpen}
  <div
    class="overlay"
    role="button"
    tabindex="0"
    onclick={() => game.closeBestiary()}
    onkeydown={(e) => e.key === 'Escape' && game.closeBestiary()}
  >
    <div
      class="card"
      role="dialog"
      aria-label="Bestiary"
      tabindex="-1"
      onclick={(e) => e.stopPropagation()}
      onkeydown={(e) => e.stopPropagation()}
    >
      <div class="card-header">
        <span class="title">BESTIARY</span>
        <span class="entry">{#if monster}Entry {String(entryIndex).padStart(2, '0')} / {catalog.length}{/if}</span>
        <button class="close" onclick={() => game.closeBestiary()} aria-label="Close">×</button>
      </div>

      {#if monster && selected}
        <div class="body">
          <div class="portrait">
            <img src={ENEMY_SPRITES[monster.id]} alt={monster.name} />
            <div class="name">{monster.name}</div>
            {#if MONSTER_INSPIRED_BY[monster.id]}
              <div class="inspired">Inspired by: {MONSTER_INSPIRED_BY[monster.id]}</div>
            {/if}
          </div>

          <div class="stats">
            {#each [['HP', monster.base.hp, STAT_MAX.hp], ['ATK', monster.base.atk, STAT_MAX.atk], ['DEF', monster.base.def, STAT_MAX.def], ['SPD', monster.base.spd, STAT_MAX.spd]] as [label, value, max] (label)}
              <div class="stat-row">
                <span class="stat-label">{label}</span>
                <div class="stat-bar"><div class="fill" style:width="{Math.min(100, (Number(value) / Number(max)) * 100)}%"></div></div>
                <span class="stat-value">{value}</span>
              </div>
            {/each}

            {#if selected.weaknessRevealed}
              <div class="weakness-row">
                <span class="weakness-label">Weakness:</span>
                <span class="weakness-tag">{selected.weaknessRevealed.toUpperCase()}</span>
              </div>
              {#if !selected.weaknessUsable}
                <div class="teaser">! Usable from Chapter 2 (Element Materia → Shock-affine)</div>
              {/if}
            {/if}
          </div>
        </div>

        <div class="footer">Auto-analysis on 1st win · knowledge persists through Reunion</div>
      {:else}
        <div class="empty">No monsters analysed yet – win a battle to fill in the first entry.</div>
      {/if}

      <div class="thumb-row">
        {#each catalog as id (id)}
          {@const known = discovered.includes(id)}
          <button
            class="thumb"
            class:known
            class:active={id === game.selectedMonsterId}
            disabled={!known}
            onclick={() => game.selectMonster(id)}
            title={known ? MONSTERS[id].name : '???'}
          >
            {#if known}
              <img src={ENEMY_SPRITES[id]} alt={MONSTERS[id].name} />
            {:else}
              <span class="unknown">?</span>
            {/if}
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
    gap: 20px;
  }

  .portrait {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    min-width: 140px;
  }

  .portrait img {
    width: 128px;
    height: 128px;
    image-rendering: pixelated;
  }

  .name {
    color: var(--game-text-bright);
    font-weight: 700;
  }

  .inspired {
    color: var(--game-text);
    font-size: 11px;
    text-align: center;
  }

  .stats {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 8px;
    justify-content: center;
  }

  .stat-row {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .stat-label {
    width: 32px;
    color: var(--game-text);
    font-size: 12px;
  }

  .stat-bar {
    flex: 1;
    height: 8px;
    background: rgba(0, 0, 0, 0.5);
    border: 1px solid var(--game-border);
  }

  .stat-bar .fill {
    height: 100%;
    background: var(--game-mp);
  }

  .stat-value {
    min-width: 28px;
    text-align: right;
    color: var(--game-text-bright);
    font-size: 12px;
  }

  .weakness-row {
    margin-top: 6px;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .weakness-label {
    color: var(--game-text-bright);
    font-size: 12px;
    font-weight: 600;
  }

  .weakness-tag {
    padding: 2px 8px;
    border: 1px solid var(--game-gold);
    color: var(--game-gold);
    font-size: 12px;
    font-weight: 700;
    border-radius: 3px;
  }

  .teaser {
    color: var(--game-gold);
    font-size: 11px;
    opacity: 0.85;
  }

  .footer {
    margin-top: 14px;
    color: var(--game-text);
    font-size: 11px;
    opacity: 0.7;
  }

  .empty {
    color: var(--game-text);
    font-size: 13px;
    padding: 20px 0;
    text-align: center;
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
    width: 40px;
    height: 40px;
    padding: 2px;
    background: rgba(0, 0, 0, 0.4);
    border: 1px solid var(--game-border);
    border-radius: 3px;
    cursor: default;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .thumb.known {
    cursor: pointer;
  }

  .thumb.known:hover {
    border-color: var(--game-gold);
  }

  .thumb.active {
    border-color: var(--game-gold);
    box-shadow: 0 0 0 1px var(--game-gold);
  }

  .thumb img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    image-rendering: pixelated;
  }

  .unknown {
    color: var(--game-text);
    opacity: 0.5;
    font-weight: 700;
  }
</style>

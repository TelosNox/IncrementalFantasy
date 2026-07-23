<script lang="ts">
  import { game } from './gameStore.svelte'

  const claude = $derived(game.claude)
  const hpPct = $derived((Math.max(0, claude.hp) / claude.maxHp) * 100)
  const mpPct = $derived(claude.maxMp > 0 ? (claude.mp / claude.maxMp) * 100 : 0)
  const atbPct = $derived(Math.min(1, claude.atb) * 100)
  const limitPct = $derived(Math.min(100, claude.limit))
  const mpVisible = $derived(game.save.flags.mpVisible)
  const toggleVisible = $derived(game.save.flags.manualToggleUnlocked)
</script>

<div class="panel">
  <div class="header">
    <span class="name">{claude.name}</span>
    {#if toggleVisible}
      <div class="mode-toggle">
        <button class:active={claude.controlMode === 'auto'} onclick={() => game.setControlMode('auto')}>Auto</button>
        <button class:active={claude.controlMode === 'manual'} onclick={() => game.setControlMode('manual')}>
          Manual
        </button>
      </div>
    {/if}
  </div>

  <div class="row">
    <span class="label">HP</span>
    <div class="bar hp"><div class="fill" style:width="{hpPct}%"></div></div>
    <span class="value">{Math.max(0, claude.hp)}/{claude.maxHp}</span>
  </div>

  {#if mpVisible}
    <div class="row">
      <span class="label">MP</span>
      <div class="bar mp"><div class="fill" style:width="{mpPct}%"></div></div>
      <span class="value">{claude.mp}/{claude.maxMp}</span>
    </div>
  {/if}

  <div class="row">
    <span class="label">ATB</span>
    <div class="bar atb"><div class="fill" style:width="{atbPct}%"></div></div>
  </div>

  <div class="row">
    <span class="label">Limit</span>
    <div class="bar limit"><div class="fill" style:width="{limitPct}%"></div></div>
  </div>

  <!-- ui-layout.md "Charakter-Steuerung": vor atb>=1.0 ist NICHTS von der Aktionswahl sichtbar,
       auch kein ausgegrauter Button - das Popup existiert erst im Moment der ATB-Bereitschaft. -->
  {#if game.awaitingAttack}
    <div class="actions">
      <button class="action attack" onclick={() => game.attack()}>Attack</button>
      {#if game.canUseSpecial}
        <button
          class="action special"
          disabled={claude.mp < (claude.specialMpCost ?? Infinity)}
          onclick={() => game.useSpecial()}
        >
          Special ({claude.specialMpCost} MP)
        </button>
      {/if}
      {#if game.canFireLimit}
        <button class="action limit" onclick={() => game.fireLimit()}>Limit</button>
      {/if}
    </div>
  {/if}

  {#if game.canBuyWeapon}
    <button class="buy-weapon" disabled={!game.canAffordWeapon} onclick={() => game.buyWeapon()}>
      Buy weapon ({game.weaponCostGil} Gil)
    </button>
  {/if}
</div>

<style>
  .panel {
    display: flex;
    flex-direction: column;
    gap: 6px;
    width: 260px;
    padding: 12px;
    background: var(--game-panel-bg);
    border: 1px solid var(--game-border);
    box-sizing: border-box;
  }

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .name {
    color: var(--game-text-bright);
    font-weight: 600;
  }

  .mode-toggle {
    display: flex;
    border: 1px solid var(--game-border);
    border-radius: 3px;
    overflow: hidden;
  }

  .mode-toggle button {
    padding: 2px 8px;
    font-size: 11px;
    letter-spacing: 0.03em;
    background: transparent;
    color: var(--game-text);
    border: none;
    cursor: pointer;
  }

  .mode-toggle button.active {
    background: var(--game-atb);
    color: #08111c;
    font-weight: 700;
  }

  .row {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .label {
    width: 34px;
    color: var(--game-text);
    font-size: 12px;
  }

  .bar {
    flex: 1;
    height: 10px;
    background: rgba(0, 0, 0, 0.5);
    border: 1px solid var(--game-border);
  }

  .bar .fill {
    height: 100%;
    transition: width 0.1s linear;
  }

  .bar.hp .fill {
    background: var(--game-hp);
  }

  .bar.mp .fill {
    background: var(--game-mp);
  }

  .bar.atb .fill {
    background: var(--game-atb);
  }

  .bar.limit .fill {
    background: var(--game-limit);
  }

  .value {
    color: var(--game-text);
    font-size: 12px;
    min-width: 52px;
    text-align: right;
  }

  .actions {
    display: flex;
    gap: 6px;
    margin-top: 6px;
  }

  .action {
    flex: 1;
    padding: 10px 6px;
    background: var(--game-gold);
    color: #1a1400;
    border: none;
    font-weight: 700;
    font-size: 13px;
    letter-spacing: 0.03em;
    cursor: pointer;
  }

  .action:disabled {
    background: var(--game-border);
    color: var(--game-text);
    cursor: default;
  }

  .action.special {
    background: var(--game-mp);
  }

  .action.limit {
    background: var(--game-limit);
  }

  .buy-weapon {
    margin-top: 4px;
    padding: 8px;
    background: transparent;
    color: var(--game-gold);
    border: 1px dashed var(--game-gold);
    font-weight: 600;
    font-size: 12px;
    cursor: pointer;
  }

  .buy-weapon:disabled {
    color: var(--game-text);
    border-color: var(--game-border);
    cursor: default;
  }
</style>

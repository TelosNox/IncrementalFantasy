<script lang="ts">
  // ui-layout.md "Charakter-Steuerung: Panels & Aktions-Popup" - eigenstaendige
  // FF7-Menuebox, waechst nach oben in die Stage (ueber der Bottom-Leiste), auf
  // der Party-Seite. Existiert ausschliesslich waehrend die uebergebene Figur
  // `awaitingPlayerChoice` ist - kein ausgegrauter Button/keine Vorschau davor
  // (Playtest-Korrektur nach M6). M7: pro Party-Mitglied eine eigene Instanz.
  import { game } from './gameStore.svelte'
  import type { BattleUnit } from '../core/battle'

  interface Props {
    unit: BattleUnit
  }
  const { unit }: Props = $props()

  const ready = $derived(game.awaitingUnit === unit)
  const specialDisabled = $derived(unit.mp < (unit.specialMpCost ?? Infinity))

  // FF7-Signatur: Limit in bunten Buchstaben, sobald geladen (ui-layout.md).
  const RAINBOW = ['#ff5c5c', '#ffa64d', '#ffe14d', '#5cff8f', '#5cc3ff', '#b366ff']
</script>

{#if ready}
  <div class="popup">
    <div class="popup-title">{unit.name} – ready</div>

    <button class="row" onclick={() => game.attack(unit)}>Attack</button>

    {#if game.canUseSpecial(unit)}
      <button class="row" class:disabled={specialDisabled} disabled={specialDisabled} onclick={() => game.useSpecial(unit)}>
        Special <span class="cost">({unit.specialMpCost} MP)</span>
      </button>
    {/if}

    {#if game.canFireLimit(unit)}
      <button class="row limit" onclick={() => game.fireLimit(unit)}>
        {#each 'Limit'.split('') as letter, i (i)}
          <span style:color={RAINBOW[i % RAINBOW.length]}>{letter}</span>
        {/each}
      </button>
    {/if}
  </div>
{/if}

<style>
  .popup {
    position: absolute;
    bottom: 100%;
    left: 0;
    width: 100%;
    margin-bottom: 8px;
    box-sizing: border-box;
    background: rgba(32, 26, 61, 0.94);
    border: 1px solid #7a6ad8;
    border-radius: 4px;
    padding: 8px;
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.55);
    z-index: 10;
  }

  .popup-title {
    color: #d9d2ff;
    font-size: 11px;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    opacity: 0.7;
    margin: 0 4px 6px;
  }

  .row {
    display: block;
    width: 100%;
    box-sizing: border-box;
    padding: 9px 10px;
    margin-bottom: 4px;
    background: transparent;
    border: none;
    border-radius: 3px;
    color: #fdf6e3;
    font-size: 14px;
    font-weight: 700;
    text-align: left;
    cursor: pointer;
  }

  .row:last-child {
    margin-bottom: 0;
  }

  .row:hover:not(:disabled) {
    background: rgba(255, 255, 255, 0.1);
  }

  .row:disabled,
  .row.disabled {
    color: #8b85a8;
    font-weight: 300;
    cursor: default;
  }

  .row.limit {
    font-weight: 800;
    letter-spacing: 0.06em;
  }

  .cost {
    font-weight: 400;
    opacity: 0.7;
    font-size: 12px;
  }
</style>

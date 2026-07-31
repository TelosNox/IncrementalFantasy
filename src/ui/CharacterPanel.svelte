<script lang="ts">
  import { game } from './gameStore.svelte'
  import type { BattleUnit } from '../core/battle'
  import ActionPopup from './ActionPopup.svelte'

  interface Props {
    unit: BattleUnit
  }
  const { unit }: Props = $props()

  const hpPct = $derived((Math.max(0, unit.hp) / unit.maxHp) * 100)
  const mpPct = $derived(unit.maxMp > 0 ? (unit.mp / unit.maxMp) * 100 : 0)
  const atbPct = $derived(Math.min(1, unit.atb) * 100)
  const limitPct = $derived(Math.min(100, unit.limit))
  const mpVisible = $derived(game.save.flags.mpVisible)
  const toggleVisible = $derived(game.save.flags.manualToggleUnlocked)
  // feinspec §3.4 (M11 Esper-Modell) - Limit existiert nur in Gate-/Boss-Kämpfen; außerhalb
  // gibt es keine Leiste zu zeigen ("In regulären Zonen erscheint die Limit-Zeile gar nicht").
  const limitVisible = $derived(unit.limitAllowed)
</script>

<div class="panel">
  <div class="header">
    <span class="name">{unit.name}</span>
    {#if toggleVisible}
      <div class="mode-toggle">
        <button class:active={unit.controlMode === 'auto'} onclick={() => game.setControlMode(unit.id, 'auto')}>
          Auto
        </button>
        <button
          class="manual"
          class:active={unit.controlMode === 'manual'}
          onclick={() => game.setControlMode(unit.id, 'manual')}
        >
          Manual
        </button>
      </div>
    {/if}
  </div>

  <div class="row">
    <span class="label">HP</span>
    <div class="bar hp"><div class="fill" style:width="{hpPct}%"></div></div>
    <span class="value">{Math.max(0, unit.hp)}/{unit.maxHp}</span>
  </div>

  {#if mpVisible}
    <div class="row">
      <span class="label">MP</span>
      <div class="bar mp"><div class="fill" style:width="{mpPct}%"></div></div>
      <span class="value">{unit.mp}/{unit.maxMp}</span>
    </div>
  {/if}

  <div class="row">
    <span class="label">ATB</span>
    <div class="bar atb"><div class="fill" style:width="{atbPct}%"></div></div>
  </div>

  {#if limitVisible}
    <div class="row">
      <span class="label">Limit</span>
      <div class="bar limit"><div class="fill" style:width="{limitPct}%"></div></div>
    </div>
  {/if}

  <ActionPopup {unit} />
</div>

<style>
  .panel {
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 6px;
    /* M8: bis zu 4 Panels muessen ohne overflow-x in die Bottom-Leiste passen
       (ui-layout.md/M7-Playtest-Fund: overflow-x hat frueher das nach oben
       wachsende Aktions-Popup abgeschnitten) - deshalb flexibel statt fest. */
    flex: 1 1 220px;
    min-width: 180px;
    max-width: 260px;
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

  /* ui-layout.md "Markierungen" (M13, Altlast UI-2 aus Entscheidung 18): Die Spec begruendet
     die cyanfarbene Fokus-Markierung damit, dass Cyan im Spiel bereits die Farbe der
     Spielerkontrolle sei - im Code traf das nicht zu, hier war auch "Manual" blau. Aufgeloest
     zugunsten der Spec: aktives "Manual" traegt jetzt Cyan (`--game-mp`, dieselbe Farbe wie
     Fokusziel und "Leave now"), aktives "Auto" bleibt Blau (`--game-atb`). Damit ist Cyan
     durchgaengig "der Spieler greift ein". */
  .mode-toggle button.active {
    background: var(--game-atb);
    color: #08111c;
    font-weight: 700;
  }

  .mode-toggle button.active.manual {
    background: var(--game-mp);
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
</style>

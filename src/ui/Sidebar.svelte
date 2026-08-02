<script lang="ts">
  import { game } from './gameStore.svelte'
  import { MONSTERS } from '../content/monsters'
  import { INTRO_ORDER } from '../content/introductions'
  import BestiaryModal from './BestiaryModal.svelte'
  import ReunionModal from './ReunionModal.svelte'
  import Codex from './Codex.svelte'

  const regionName = $derived(
    game.save.currentZone <= 8 ? 'Reactor Row' : game.save.currentZone <= 18 ? 'Bargain Bazaar' : 'MegaCorp Tower',
  )
  const regionIndex = $derived(game.save.currentZone <= 8 ? 1 : game.save.currentZone <= 18 ? 2 : 3)
  const bestiaryCount = $derived(Object.keys(game.save.bestiary).length)
  const catalogSize = $derived(Object.keys(MONSTERS).length)
  const introsSeenCount = $derived(Object.keys(game.save.introsSeen).length)
  const introsTotal = $derived(INTRO_ORDER.length)

  // feinspec §3.8a (M11) - Zonen-Rückkehr: das eigentliche Ventil. Nur zwischen Kämpfen bedienbar.
  const zoneNavEnabled = $derived(game.phase === 'battle')
  const canGoBack = $derived(zoneNavEnabled && game.save.currentZone > 1)
  const canGoForward = $derived(zoneNavEnabled && game.save.currentZone < game.maxZoneReached)
  const atWall = $derived(game.save.currentZone >= game.maxZoneReached)

  // oekonomie-waehrungen.md §1a / ui-layout.md "Erschöpfte Zonen" (M18) - haengt am Ist-Ertrag,
  // nicht am Cutoff-Wert (`game.isZoneExhausted`). Ein Marker fuer beide genannten Orte: die
  // Zonenwahl (Stepper, `selectZone` wechselt sofort) UND die aktuell bespielte Zone - hier
  // dieselbe Zone, da dieses Spiel keine separate Vorschau vor dem Zonenwechsel kennt.
  const currentZoneExhausted = $derived(game.isZoneExhausted(game.save.currentZone))

  // ui-layout.md "Bester Versuch am Gate" (M18) - nur an einem Gate, nur nach einer Niederlage
  // dort sichtbar (kein Eintrag vor dem ersten Versuch).
  const gateBestAttempt = $derived(
    game.isCurrentZoneGate ? game.save.gateBestAttempts[game.save.currentZone] : undefined,
  )

  // Architektur §6 "Export/Import als Sicherheitsnetz" (M10) - reines Datei-Handling, kein
  // eigener State noetig; game.importSave() macht die eigentliche Validierung/Uebernahme.
  let fileInput: HTMLInputElement | undefined = $state()

  function triggerImport(): void {
    fileInput?.click()
  }

  function handleFileSelected(event: Event): void {
    const input = event.currentTarget as HTMLInputElement
    const file = input.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      const result = game.importSave(String(reader.result))
      if (!result.ok) alert(`Import failed: ${result.message}`)
    }
    reader.readAsText(file)
    input.value = '' // erlaubt erneuten Import derselben Datei
  }
</script>

<div class="sidebar">
  <div class="title">IncrementalFantasy</div>
  <div class="subtitle">Chapter 1 – The Grid</div>
  <div class="zone" class:exhausted={currentZoneExhausted}>
    R{regionIndex} · {regionName} · Zone {game.save.currentZone}{#if currentZoneExhausted} · exhausted{/if}
  </div>

  {#if gateBestAttempt !== undefined}
    <!-- ui-layout.md "Bester Versuch am Gate" (M18) - rein rueckblickend, keine Prognose. -->
    <div class="gate-best">Best attempt: boss down to {gateBestAttempt}% HP</div>
  {/if}

  <!-- feinspec §3.8a (M11) - Zonen-Rückkehr: jede geschaffte Zone frei anwählbar, vor und zurück. -->
  <div class="zone-nav">
    <button disabled={!canGoBack} onclick={() => game.selectZone(game.save.currentZone - 1)}>◀</button>
    <span class="zone-nav-label" class:exhausted={currentZoneExhausted}>
      Zone {game.save.currentZone} / {game.maxZoneReached}{#if currentZoneExhausted} · exhausted{/if}
    </span>
    <button disabled={!canGoForward} onclick={() => game.selectZone(game.save.currentZone + 1)}>▶</button>
  </div>
  {#if !atWall}
    <button
      class="zone-nav-wall"
      disabled={!zoneNavEnabled}
      onclick={() => game.selectZone(game.maxZoneReached)}
    >
      ↦ Back to the wall (Zone {game.maxZoneReached})
    </button>
  {/if}

  <!-- feinspec §3.8b (M11) - Gasthaus: Anmeldung jederzeit, greift erst nach Kampfende. -->
  <button class="inn-toggle" class:active={game.innQueued} onclick={() => game.toggleInnQueued()}>
    🛏 {game.innQueued ? 'Inn queued – after this fight' : 'Queue Inn after this fight'}
  </button>

  <!--
    stats-kampfwerte.md §4.1 / feinspec §3.6 - EIN Level-/EXP-Anzeiger für die ganze Gruppe.
    Bewusst hier und nicht im Charakter-Panel: ein Wert, der für alle gilt, gehört nicht
    viermal neben vier Figuren.
  -->
  <div class="party-level">
    <div class="party-level-head">
      <span class="currency-label">Party Level</span>
      <span class="currency-value">{game.partyLevel}</span>
    </div>
    <div class="exp-bar" title="{game.partyExp} / {game.partyExpToNext} EXP">
      <div class="exp-fill" style:width="{game.partyExpProgress * 100}%"></div>
    </div>
    <div class="exp-label">{game.partyExp} / {game.partyExpToNext} EXP</div>
  </div>

  {#if game.save.reunionCount > 0 || game.save.currencies.reunionEssence.gt(0)}
    <div class="currency">
      <span class="currency-label">Reunion Essence</span>
      <span class="currency-value">{game.save.currencies.reunionEssence.toString()}</span>
    </div>
  {/if}

  <button class="bestiary-button" onclick={() => game.openBestiary()}>
    Bestiary <span class="count">({bestiaryCount}/{catalogSize})</span>
  </button>

  <!-- ui-layout.md "Mechanik-Einführung" §Codex (M17) - dauerhaft nachlesbare Liste der Einführungen. -->
  <button class="bestiary-button" onclick={() => game.openCodex()}>
    Codex <span class="count">({introsSeenCount}/{introsTotal})</span>
  </button>

  {#if game.canReunion}
    <button class="reunion-button" onclick={() => game.openReunionModal()}>
      ✦ Reunion available
    </button>
  {/if}

  <!-- ui-layout.md: Menü-Bereich bleibt reservierter Platz, Inhalt folgt ab M8+. -->
  <div class="reserved">Team / Equipment / Stats coming in later milestones.</div>

  <div class="save-tools">
    <button class="save-tool" onclick={() => game.exportSave()}>⇩ Export save</button>
    <button class="save-tool" onclick={triggerImport}>⇧ Import save</button>
    <input
      bind:this={fileInput}
      type="file"
      accept="application/json,.json"
      class="file-input"
      onchange={handleFileSelected}
    />
  </div>
</div>

<BestiaryModal />
<ReunionModal />
<Codex />

<style>
  .sidebar {
    display: flex;
    flex-direction: column;
    gap: 8px;
    height: 100%;
    padding: 16px;
    box-sizing: border-box;
    background: var(--game-panel-bg);
  }

  .title {
    color: var(--game-gold);
    font-weight: 700;
    font-size: 18px;
  }

  .subtitle {
    color: var(--game-text);
    font-size: 13px;
  }

  .zone {
    color: var(--game-text-bright);
    font-size: 13px;
    margin-top: 4px;
  }

  /* ui-layout.md "Erschöpfte Zonen" - gedaempft + duenne Schrift, dasselbe Vokabular wie nicht
     ausfuehrbare Aktionen im Aktions-Popup ("sichtbar, aber sofort als 'bringt nichts' lesbar"). */
  .zone.exhausted,
  .zone-nav-label.exhausted {
    color: var(--game-text);
    font-weight: 300;
    opacity: 0.7;
  }

  .gate-best {
    margin-top: 4px;
    color: var(--game-text);
    font-size: 11px;
    opacity: 0.8;
  }

  .zone-nav {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-top: 8px;
  }

  .zone-nav button {
    padding: 4px 10px;
    background: transparent;
    color: var(--game-text-bright);
    border: 1px solid var(--game-border);
    border-radius: 3px;
    cursor: pointer;
  }

  .zone-nav button:disabled {
    color: var(--game-text);
    opacity: 0.4;
    cursor: default;
  }

  .zone-nav-label {
    flex: 1;
    text-align: center;
    color: var(--game-text-bright);
    font-size: 12px;
  }

  .zone-nav-wall {
    margin-top: 4px;
    padding: 6px;
    background: transparent;
    color: var(--game-text);
    border: 1px dashed var(--game-border);
    border-radius: 3px;
    font-size: 11px;
    cursor: pointer;
  }

  .zone-nav-wall:hover:not(:disabled) {
    color: var(--game-gold);
    border-color: var(--game-gold);
  }

  .zone-nav-wall:disabled {
    opacity: 0.4;
    cursor: default;
  }

  .inn-toggle {
    margin-top: 8px;
    padding: 8px;
    background: transparent;
    color: var(--game-text-bright);
    border: 1px solid var(--game-border);
    border-radius: 3px;
    font-size: 12px;
    text-align: left;
    cursor: pointer;
  }

  .inn-toggle.active {
    color: var(--game-mp);
    border-color: var(--game-mp);
  }

  .currency {
    display: flex;
    justify-content: space-between;
    margin-top: 8px;
    padding-top: 8px;
    border-top: 1px solid var(--game-border);
    color: var(--game-text-bright);
    font-size: 14px;
  }

  .currency-value {
    color: var(--game-gold);
  }

  /* stats-kampfwerte.md §4.1 - Gruppenlevel + EXP-Fortschritt, ein Block fuer die ganze Party. */
  .party-level {
    margin-top: 8px;
    padding-top: 8px;
    border-top: 1px solid var(--game-border);
    color: var(--game-text-bright);
    font-size: 14px;
  }

  .party-level-head {
    display: flex;
    justify-content: space-between;
  }

  .exp-bar {
    margin-top: 4px;
    height: 6px;
    background: var(--game-border);
    border-radius: 3px;
    overflow: hidden;
  }

  .exp-fill {
    height: 100%;
    background: var(--game-exp);
  }

  .exp-label {
    margin-top: 2px;
    font-size: 11px;
    color: var(--game-text);
  }

  .bestiary-button {
    margin-top: 8px;
    padding: 8px;
    background: transparent;
    color: var(--game-text-bright);
    border: 1px solid var(--game-border);
    border-radius: 3px;
    font-size: 13px;
    text-align: left;
    cursor: pointer;
  }

  .bestiary-button:hover {
    border-color: var(--game-gold);
    color: var(--game-gold);
  }

  .count {
    opacity: 0.7;
  }

  .reunion-button {
    margin-top: 4px;
    padding: 8px;
    background: transparent;
    color: var(--game-gold);
    border: 1px solid var(--game-gold);
    border-radius: 3px;
    font-size: 13px;
    font-weight: 700;
    text-align: left;
    cursor: pointer;
    animation: reunion-pulse 1.4s ease-in-out infinite alternate;
  }

  .reunion-button:hover {
    background: rgba(224, 165, 46, 0.12);
  }

  @keyframes reunion-pulse {
    from {
      opacity: 0.75;
    }
    to {
      opacity: 1;
    }
  }

  .reserved {
    margin-top: auto;
    color: var(--game-text);
    font-size: 12px;
    opacity: 0.6;
  }

  .save-tools {
    display: flex;
    gap: 8px;
    padding-top: 8px;
    border-top: 1px solid var(--game-border);
  }

  .save-tool {
    flex: 1;
    padding: 6px;
    background: transparent;
    color: var(--game-text);
    border: 1px solid var(--game-border);
    border-radius: 3px;
    font-size: 11px;
    cursor: pointer;
  }

  .save-tool:hover {
    color: var(--game-text-bright);
    border-color: var(--game-text);
  }

  .file-input {
    display: none;
  }
</style>

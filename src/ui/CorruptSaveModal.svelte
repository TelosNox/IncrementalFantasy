<script lang="ts">
  // Architektur §6 (M10 Sicherheitsnetz) - "ein unbekannter/korrupter Save fuehrt zu einer
  // sichtbaren Warnung statt stillschweigendem Ueberschreiben". Erscheint automatisch beim Start,
  // wenn `game.corruptSaveNotice` gesetzt ist (loadSave() konnte den localStorage-Slot nicht lesen).
  // Die Rohdaten liegen bereits gesichert (`readCorruptBackup()`, storage.ts) - dieses Modal bietet
  // nur den Download an und laesst den Spieler bewusst mit einem frischen Save weiterspielen.
  import { game } from './gameStore.svelte'
</script>

{#if game.corruptSaveNotice}
  {@const notice = game.corruptSaveNotice}
  <div class="overlay" role="alertdialog" aria-label="Corrupt save warning">
    <div class="card">
      <div class="card-header">
        <span class="title">⚠ SAVE COULD NOT BE READ</span>
      </div>

      <div class="body">
        Your last save couldn't be loaded ({notice.message}). Nothing was deleted - a backup of the
        raw data has been kept so you don't lose it. You can download it below, or continue with a
        fresh save (Chapter 1, Zone 1).
      </div>

      <div class="actions">
        <button class="backup" onclick={() => game.exportCorruptBackup()}>Download raw backup</button>
        <button class="continue" onclick={() => game.dismissCorruptSaveNotice()}>Continue with fresh save</button>
      </div>
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
    z-index: 300;
  }

  .card {
    width: min(440px, 90vw);
    background: #171a2c;
    border: 2px solid #ff5c5c;
    border-radius: 6px;
    padding: 16px 20px;
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.6);
  }

  .card-header {
    border-bottom: 1px solid var(--game-border);
    padding-bottom: 8px;
    margin-bottom: 14px;
  }

  .title {
    color: #ff5c5c;
    font-weight: 700;
    letter-spacing: 0.04em;
    font-size: 13px;
  }

  .body {
    color: var(--game-text-bright);
    font-size: 13px;
    line-height: 1.5;
  }

  .actions {
    margin-top: 16px;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .actions button {
    padding: 10px;
    border-radius: 3px;
    font-weight: 700;
    font-size: 13px;
    cursor: pointer;
  }

  .backup {
    background: transparent;
    color: #ff5c5c;
    border: 1px solid #ff5c5c;
  }

  .backup:hover {
    background: rgba(255, 92, 92, 0.12);
  }

  .continue {
    background: var(--game-border);
    color: var(--game-text-bright);
    border: 1px solid var(--game-border);
  }

  .continue:hover {
    filter: brightness(1.2);
  }
</style>

<script lang="ts">
  import { game } from './gameStore.svelte'
  import CharacterPanel from './CharacterPanel.svelte'
</script>

<div class="bottom-bar">
  {#each game.party as unit (unit.id)}
    <CharacterPanel {unit} />
  {/each}
</div>

<style>
  .bottom-bar {
    display: flex;
    align-items: center;
    height: 100%;
    padding: 12px;
    box-sizing: border-box;
    gap: 12px;
    /* KEIN overflow hier (auch nicht nur overflow-x): sobald eine Achse
       nicht "visible" ist, berechnet der Browser die andere ebenfalls als
       "auto" (CSS Overflow Modul) - das wuerde das nach oben aus dem Panel
       herauswachsende Aktions-Popup (position:absolute, bottom:100%,
       ui-layout.md "Charakter-Steuerung") abschneiden statt es ueber der
       Stage anzuzeigen. Playtest-Fund (M7): genau das ist passiert. */
  }
</style>

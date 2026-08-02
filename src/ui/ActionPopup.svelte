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

  let popupEl: HTMLDivElement | undefined = $state()
  let dodgeX = $state(0)

  /**
   * ui-layout.md "Preis davon, und die Regel dagegen" (M13-Nachzieher, M18) - U1/U2 skaliert
   * absichtlich nicht mit `s` (sonst waere Text bei kleiner Buehne unlesbar), darf die Figur,
   * ueber der es waechst, deshalb aber nie ueberdecken (M13-Abnahme: 34% bei Stage 540x720
   * blieb bis M18 unbehoben). Stage und BottomBar liegen in getrennten DOM-Teilbaeumen ohne
   * gemeinsames Koordinatensystem (`--s` ist auf `.stage` gescoped, `GameScreen.svelte` haelt
   * beide nur als Geschwister-Grid-Zellen) - Laufzeitmessung per `getBoundingClientRect` statt
   * einer zweiten, driftenden Kopie der Buehnen-Geometrie in dieser Komponente.
   */
  function avoidOverlap(): void {
    if (!popupEl) return
    dodgeX = 0
    requestAnimationFrame(() => {
      if (!popupEl) return
      const sprite = document.querySelector(`[data-actor-id="${unit.id}"]`)
      if (!sprite) return
      const spriteRect = sprite.getBoundingClientRect()
      const popupRect = popupEl.getBoundingClientRect()
      const overlapsX = popupRect.left < spriteRect.right && popupRect.right > spriteRect.left
      const overlapsY = popupRect.top < spriteRect.bottom && popupRect.bottom > spriteRect.top
      if (!overlapsX || !overlapsY) return
      const gap = 6
      const rightShift = spriteRect.right - popupRect.left + gap
      const leftShift = spriteRect.left - popupRect.right - gap
      const fitsInViewport = (shift: number) =>
        popupRect.left + shift >= 0 && popupRect.right + shift <= window.innerWidth
      const fitsRight = fitsInViewport(rightShift)
      const fitsLeft = fitsInViewport(leftShift)
      // Bevorzugt die kuerzere Ausweichrichtung, faellt aber auf die andere zurueck, wenn sie
      // das Popup aus dem Viewport schieben wuerde (nutzlos ausgewichen ist nicht ausgewichen).
      const preferRight = Math.abs(rightShift) <= Math.abs(leftShift)
      if (preferRight && fitsRight) dodgeX = rightShift
      else if (!preferRight && fitsLeft) dodgeX = leftShift
      else if (fitsRight) dodgeX = rightShift
      else if (fitsLeft) dodgeX = leftShift
      else dodgeX = preferRight ? rightShift : leftShift
    })
  }

  $effect(() => {
    if (ready) avoidOverlap()
  })

  $effect(() => {
    if (!ready) return
    window.addEventListener('resize', avoidOverlap)
    return () => window.removeEventListener('resize', avoidOverlap)
  })

  /**
   * ui-layout.md "Tastensteuerung" - A/S/D fest an die Bedeutung gebunden (nicht an die
   * Zeilenposition), nur wirksam waehrend genau dieses Popup offen ist. Kein Key-Repeat
   * (`e.repeat`) und tot hinter einem blockierenden Einfuehrungs-Popup (`activeIntro`) - ein
   * reflexhaftes A soll die Erklaerung nicht wegklicken. `attack`/`useSpecial`/`defend` pruefen
   * Verfuegbarkeit ohnehin selbst (MP, `canDefend`), die Taste kann also nie mehr als der
   * gleichnamige Klick.
   */
  function handleKeydown(e: KeyboardEvent): void {
    if (e.repeat || game.activeIntro) return
    switch (e.key.toLowerCase()) {
      case 'a':
        game.attack(unit)
        break
      case 's':
        if (game.canUseSpecial(unit)) game.useSpecial(unit)
        break
      case 'd':
        if (game.canDefend(unit)) game.defend(unit)
        break
    }
  }

  $effect(() => {
    if (!ready) return
    window.addEventListener('keydown', handleKeydown)
    return () => window.removeEventListener('keydown', handleKeydown)
  })
</script>

{#if ready}
  <div class="popup" bind:this={popupEl} style:transform="translateX({dodgeX}px)">
    <div class="popup-title">{unit.name} – ready</div>

    <button class="row" onclick={() => game.attack(unit)}><span class="hotkey">A</span>ttack</button>

    {#if game.canUseSpecial(unit)}
      <button class="row" class:disabled={specialDisabled} disabled={specialDisabled} onclick={() => game.useSpecial(unit)}>
        <span class="hotkey">S</span>pecial <span class="cost">({unit.specialMpCost} MP)</span>
      </button>
    {/if}

    {#if game.canDefend(unit)}
      <button class="row" onclick={() => game.defend(unit)}><span class="hotkey">D</span>efend</button>
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

  /* ui-layout.md "Sichtbarkeit: unterstrichener Anfangsbuchstabe" - erbt Farbe/Gewicht der
     Zeile (hell/dick vs. gedaempft/duenn), statt eine eigene Achse zu belegen. */
  .hotkey {
    text-decoration: underline;
  }

  .cost {
    font-weight: 400;
    opacity: 0.7;
    font-size: 12px;
  }
</style>

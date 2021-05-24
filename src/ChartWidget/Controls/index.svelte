<script lang="ts">
  import Toggle from 'webkit/ui/Toggle.svelte'
  import Icon from 'webkit/ui/Icon.svelte'
  import OptionsMenu from './OptionsMenu.svelte'
  import Fullscreen from './Fullscreen.svelte'
  import { getWidget } from '@/ChartWidget/context'
  const { ChartDrawer } = getWidget()

  export let chart
  export let hasDomainGroups
  export let isSharedAxisEnabled
  export let isSingleWidget: boolean
  export let deleteWidget
  export let fullscreenMetricsFilter

  function onLineDelete() {
    const { drawer } = chart
    const { selectedLine } = $ChartDrawer

    drawer.selected = null
    drawer.drawings = drawer.drawings.filter(
      (drawing) => drawing !== selectedLine,
    )
    $ChartDrawer.selectedLine = undefined
    drawer.redraw()
  }
</script>

<div class="row controls v-center mrg-s mrg--b">
  {#if false}
    <div class:active={true} class="btn mrg-s mrg--r">
      <Icon id="cursor" w="15" />
    </div>
  {/if}

  <div
    class="btn"
    class:active={$ChartDrawer.isNewDrawing}
    on:click={ChartDrawer.toggleNewDrawing}>
    <Icon id="line" w="15" />
  </div>

  {#if $ChartDrawer.selectedLine}
    <div class="divider" />

    <div class="btn delete" on:click={onLineDelete}>
      <Icon id="delete" w="16" />
    </div>
  {/if}

  <div class="studio-why-gaps mrg-a mrg--l" />

  {#if hasDomainGroups}
    <button
      class="row v-center"
      on:click={() => (isSharedAxisEnabled = !isSharedAxisEnabled)}>
      Shared axis <Toggle
        class="mrg-s mrg--l mrg--r"
        isActive={isSharedAxisEnabled} />
    </button>
  {/if}

  <OptionsMenu activeClass="$style._active" {isSingleWidget} {deleteWidget}>
    <div class="btn">
      <Icon id="cog" w="16" />
    </div>
  </OptionsMenu>

  <Fullscreen {fullscreenMetricsFilter} />
</div>

<style>
  .btn,
  :global(.controls-btn) {
    width: 32px;
    height: 32px;
    --fill: var(--waterloo);
    --fill-hover: var(--green);
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .active,
  ._active {
    --fill: var(--green) !important;
    --bg: var(--green-light-1);
  }

  .divider {
    height: 24px;
    border-left: 1px solid var(--porcelain);
    margin: 0 8px;
  }

  .delete {
    --fill-hover: var(--red);
  }
  button {
    color: var(--black);
  }
</style>

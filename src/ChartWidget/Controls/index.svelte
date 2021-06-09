<script lang="ts">
  import { track } from 'webkit/analytics'
  import Toggle from 'webkit/ui/Toggle.svelte'
  import Svg from 'webkit/ui/Icon.svelte'
  import { Event } from '@/analytics'
  import { getWidget } from '@/ChartWidget/context'
  import { getSidewidget } from '@/stores/widgets'
  import { globals } from '@/stores/globals'
  import { SHORTCUTS_SIDEWIDGET } from '@/Sidewidget/Shortcuts.svelte'
  import OptionsMenu from './OptionsMenu.svelte'
  import Fullscreen from './Fullscreen.svelte'

  const { ChartDrawer } = getWidget()
  const Sidewidget = getSidewidget()

  export let chart
  export let hasDomainGroups
  export let isSharedAxisEnabled
  export let isSingleWidget: boolean
  export let deleteWidget
  export let fullscreenMetricsFilter

  $: $ChartDrawer.isNewDrawing = $globals.isNewDrawing
  $: if ($globals.isNewDrawing && $ChartDrawer.isNewDrawing === false) {
    onDrawingEnd()
  }

  function onNewLine() {
    if ($ChartDrawer.isNewDrawing === false) track.event(Event.NewDrawing)

    ChartDrawer.toggleNewDrawing()
  }

  function onLineDelete() {
    const { drawer } = chart
    const { selectedLine } = $ChartDrawer

    drawer.selected = null
    drawer.drawings = drawer.drawings.filter(
      (drawing) => drawing !== selectedLine,
    )
    $ChartDrawer.drawings = drawer.drawings
    $ChartDrawer.selectedLine = undefined
    drawer.redraw()
  }

  function onDrawingEnd() {
    $globals.isNewDrawing = false
  }
</script>

<div class="row controls v-center mrg-s mrg--b">
  <div
    class="btn expl-tooltip"
    title="Draw Line | L"
    class:active={$ChartDrawer.isNewDrawing}
    on:click={onNewLine}>
    <Svg id="line" w="15" />
  </div>

  {#if $ChartDrawer.selectedLine}
    <div class="divider" />

    <div class="btn delete" on:click={onLineDelete}>
      <Svg id="delete" w="16" />
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

  <div
    class="btn mrg-s mrg--r"
    class:active={$Sidewidget === SHORTCUTS_SIDEWIDGET}
    on:click={() => Sidewidget.set(SHORTCUTS_SIDEWIDGET)}>
    <Svg id="cmd-key" w="16" />
  </div>

  <OptionsMenu activeClass="$style._active" {isSingleWidget} {deleteWidget}>
    <div class="btn">
      <Svg id="cog" w="16" />
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

  .expl-tooltip {
    position: relative;
  }
  .expl-tooltip::before {
    z-index: 24;
  }
</style>

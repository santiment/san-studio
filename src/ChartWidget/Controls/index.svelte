<script lang="ts">
  import { onDestroy } from 'svelte'
  import { track } from 'webkit/analytics'
  import { withScroll, getHistoryContext } from 'webkit/ui/history'
  import Toggle from 'webkit/ui/Toggle.svelte'
  import Svg from 'webkit/ui/Svg.svelte'
  import { Event } from '@/analytics'
  import { getWidget } from '@/ChartWidget/context'
  import { getSidewidget } from '@/stores/widgets'
  import { globals } from '@/stores/globals'
  import { getAdapterController } from '@/adapter/context'
  import { absoluteToRelativeCoordinates } from '@/Chart/Drawer/utils'
  import OptionsMenu from './OptionsMenu.svelte'
  import Fullscreen from './Fullscreen.svelte'
  import Embed from './Embed.svelte'
  import { downloadPng } from './downloadPng'

  const History = getHistoryContext()
  const widget = getWidget()
  const { ChartDrawer } = widget
  const Sidewidget = getSidewidget()
  const { noWidgetControls } = getAdapterController()

  export let chart
  export let hasDomainGroups
  export let isSharedAxisEnabled
  export let isSingleWidget: boolean
  export let deleteWidget
  export let fullscreenMetricsFilter

  let onDownload

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
    drawer.deleteDrawingWithDispatch(selectedLine)
  }

  function onDrawingEnd() {
    $globals.isNewDrawing = false
  }

  onDestroy(
    ChartDrawer.onDispatch((event) => {
      if (!event) return
      const { chart } = widget
      const { type, data } = event

      if (type === 'new line') {
        const absCoor = data.absCoor.slice()
        History.add(
          'New drawing',
          withScroll(widget, () => chart.drawer.deleteDrawing(data)),
          withScroll(widget, () => {
            chart.drawer.addDrawing(data)
            recalc(data, absCoor)
          }),
        )
      } else if (type === 'delete') {
        History.add(
          'Delete drawing',
          withScroll(widget, () => {
            chart.drawer.addDrawing(data)
            recalc(data)
          }),
          withScroll(widget, () => chart.drawer.deleteDrawing(data)),
        )
      } else if (type === 'modified') {
        const { drawing, oldAbsCoor } = data
        const newAbsCoor = drawing.absCoor.slice()

        History.add(
          'Drawing modified',
          withScroll(widget, () => recalc(drawing, oldAbsCoor)),
          withScroll(widget, () => recalc(drawing, newAbsCoor)),
        )
      }

      function recalc(drawing, coor = drawing.absCoor) {
        drawing.absCoor = coor
        drawing.relCoor = absoluteToRelativeCoordinates(chart, drawing)
        chart.drawer.redraw()
      }
    }),
  )
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

  {#if !noWidgetControls}
    <div
      class="btn mrg-s mrg--r expl-tooltip"
      title="Download as PNG"
      on:click={() => onDownload(downloadPng)}>
      <Svg id="download" w="17" />
    </div>

    {#if $globals.isBeta}
      <Embed />
    {/if}

    <OptionsMenu
      bind:onDownload
      activeClass="$style._active"
      {isSingleWidget}
      {deleteWidget}>
      <div class="btn">
        <Svg id="cog" w="16" />
      </div>
    </OptionsMenu>

    <Fullscreen {fullscreenMetricsFilter} />
  {/if}
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

<script lang="ts">
  import { onDestroy } from 'svelte'
  import { track } from 'webkit/analytics'
  import { getHistoryContext } from 'webkit/ui/history'
  import Toggle from 'webkit/ui/Toggle.svelte'
  import Svg from 'webkit/ui/Svg.svelte'
  import { Event } from '@/analytics'
  import { getWidget } from '@/ChartWidget/context'
  import { globals } from '@/stores/globals'
  import {
    recordNewDrawing,
    recordDeleteDrawing,
    recordDrawingModified,
  } from '@/history/drawings'
  import { getAdapterController } from '@/adapter/context'
  import OptionsMenu from './OptionsMenu.svelte'
  import Fullscreen from './Fullscreen.svelte'
  import Embed from './Embed.svelte'
  import { downloadPng } from './downloadPng'

  const History = getHistoryContext()
  const widget = getWidget()
  const { ChartDrawer } = widget
  const { noWidgetControls } = getAdapterController()

  export let chart
  export let hasDomainGroups
  export let isSharedAxisEnabled
  export let isSingleWidget: boolean
  export let deleteWidget
  export let fullscreenMetricsFilter
  export let isFullscreened: boolean

  let onDownload

  $: widget.isSharedAxisEnabled = isSharedAxisEnabled
  $: $ChartDrawer.isNewDrawing = $globals.isNewDrawing
  $: if ($globals.isNewDrawing && $ChartDrawer.isNewDrawing === false) {
    onDrawingEnd()
  }

  function onNewLine() {
    if ($ChartDrawer.isNewDrawing === false) track.event(Event.NewDrawing)

    ChartDrawer.toggleNewDrawing()
  }

  function onLineDelete() {
    const { selectedLine } = $ChartDrawer
    chart.drawer.deleteDrawing(selectedLine)
  }

  function onDrawingEnd() {
    $globals.isNewDrawing = false
  }

  onDestroy(
    ChartDrawer.onDispatch((event) => {
      if (!event) return
      const { type, data } = event

      if (type === 'new line') {
        recordNewDrawing(History, ChartDrawer, widget, data)
      } else if (type === 'delete') {
        recordDeleteDrawing(History, ChartDrawer, widget, data)
      } else if (type === 'modified') {
        const { drawing, oldAbsCoor } = data
        recordDrawingModified(History, widget, drawing, oldAbsCoor)
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

    <Embed />

    <OptionsMenu
      bind:onDownload
      activeClass="$style._active"
      {isSingleWidget}
      {deleteWidget}>
      <div class="btn">
        <Svg id="cog" w="16" />
      </div>
    </OptionsMenu>

    <Fullscreen {fullscreenMetricsFilter} bind:isFullscreened />
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

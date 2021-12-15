<script lang="ts">
  import { onDestroy } from 'svelte'
  import { track } from 'webkit/analytics'
  import { getHistoryContext } from 'webkit/ui/history'
  import Toggle from 'webkit/ui/Toggle.svelte'
  import Svg from 'webkit/ui/Svg/svelte'
  import { Event } from '@/analytics'
  import { getWidget } from '@/ChartWidget/context'
  import { globals } from '@/stores/globals'
  import {
    recordNewDrawing,
    recordDeleteDrawing,
    recordDrawingModified,
  } from '@/history/drawings'
  import { getAdapterController } from '@/adapter/context'
  import Emoji from './Emoji.svelte'
  import Note from './Note.svelte'
  import DrawingsVisibility from './DrawingsVisibility.svelte'
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
  export let isFullscreen: boolean // Is in fullscreen dialog
  export let isFullscreened: boolean // Was fullscreen triggered?

  let onDownload

  $: widget.isSharedAxisEnabled = isSharedAxisEnabled
  $: $ChartDrawer.isNewDrawing = $globals.isNewDrawing
  $: if ($globals.isNewDrawing && $ChartDrawer.isNewDrawing === false) {
    onDrawingEnd()
  }

  function onNewLine() {
    if ($ChartDrawer.isNewDrawing !== 'line') {
      track.event(Event.NewDrawing, { type: 'line' })
    }

    ChartDrawer.toggleNewDrawing('line')
  }

  function onNewHorizontalRay() {
    if ($ChartDrawer.isNewDrawing !== 'hray') {
      track.event(Event.NewDrawing, { type: 'hray' })
    }

    ChartDrawer.toggleNewDrawing('hray')
  }

  function onLineDelete() {
    const { selectedLine } = $ChartDrawer
    chart.drawer.deleteDrawing(selectedLine)
  }

  function onDrawingEnd() {
    $globals.isNewDrawing = false
  }

  const removeDrawerDispatchListener = isFullscreen
    ? undefined
    : ChartDrawer.onDispatch((event) => {
        if (!event) return
        const { type, data } = event

        if (type === 'new line') {
          recordNewDrawing(History, ChartDrawer, widget, data)
        } else if (type === 'delete') {
          recordDeleteDrawing(History, ChartDrawer, widget, data)
        } else if (type === 'modified') {
          const { drawing, oldRatioCoor } = data
          recordDrawingModified(
            History,
            widget,
            drawing,
            oldRatioCoor,
            data.data,
          )
        }
      })

  onDestroy(() => {
    removeDrawerDispatchListener?.()
  })
</script>

<div class="row controls v-center mrg-s mrg--b">
  <div
    class="btn expl-tooltip"
    aria-label="Draw Line | L"
    class:active={$ChartDrawer.isNewDrawing === 'line'}
    class:disabled={$ChartDrawer.isHidden}
    on:click={onNewLine}>
    <Svg id="line" w="15" />
  </div>

  <div
    class="btn expl-tooltip"
    aria-label="Horizontal Ray"
    class:active={$ChartDrawer.isNewDrawing === 'hray'}
    class:disabled={$ChartDrawer.isHidden}
    on:click={onNewHorizontalRay}>
    <Svg id="hray" w="17" h="5" />
  </div>

  <Note {chart} {ChartDrawer} />

  <Emoji {chart} {ChartDrawer} />

  <div class="divider" />
  <DrawingsVisibility {widget} {ChartDrawer} />

  {#if $ChartDrawer.selectedLine}
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
      aria-label="Download as PNG"
      on:click={() => onDownload(downloadPng)}>
      <Svg id="download" w="17" />
    </div>

    <Embed />

    <OptionsMenu
      bind:onDownload
      activeClass="controls-btn_active"
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

  :global(.controls-btn.disabled),
  .disabled {
    --fill: var(--porcelain);
    --bg: var(--white) !important;
  }

  :global(.btn.controls-btn_active),
  .active {
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

  :global(.controls-expl::before),
  .expl-tooltip::before {
    z-index: 24;
  }
</style>

<script lang="ts">
  import { onDestroy } from 'svelte'
  import { track } from 'webkit/analytics'
  import Toggle from 'webkit/ui/Toggle.svelte'
  import Svg from 'webkit/ui/Svg/svelte'
  import { newGlobalShortcut } from 'webkit/utils/events'
  import { Event } from '@/analytics'
  import { getHistoryContext } from '@/history/ctx'
  import { getWidget } from '@/ChartWidget/context'
  import { globals } from '@/stores/globals'
  import { studio } from '@/stores/studio'
  import { recordNewDrawing, recordDeleteDrawing, recordDrawingModified } from '@/history/drawings'
  import { getAdapterController } from '@/adapter/context'
  import sanrSrc from './sanr.svg'
  import Emoji from './Emoji.svelte'
  import Note from './Note.svelte'
  import DrawingsVisibility from './DrawingsVisibility.svelte'
  import Fullscreen from './Fullscreen.svelte'
  import Embed from './Embed.svelte'
  import { download, downloadPng } from './download'
  import IncompleteData from '../IncompleteData/index.svelte'
  import { getOptionsMenuTooltip } from '../OptionsMenuTooltipCtx.svelte'

  const History = getHistoryContext()
  const widget = getWidget()
  const { Metrics, ChartDrawer } = widget
  const { noWidgetControls } = getAdapterController()
  const optionsTooltip = getOptionsMenuTooltip()

  export let chart
  export let hasDomainGroups
  export let isSharedAxisEnabled
  export let isSingleWidget: boolean
  export let deleteWidget
  export let fullscreenMetricsFilter
  export let isFullscreen: boolean // Is in fullscreen dialog
  export let isFullscreened: boolean // Was fullscreen triggered?

  $: hasSubscription = $globals.isPro || $globals.isProPlus
  $: widget.isSharedAxisEnabled = isSharedAxisEnabled

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
          recordDrawingModified(History, widget, drawing, oldRatioCoor, data.data)
        }
      })

  const removeDrawingShortcut = newGlobalShortcut('L', onNewLine)

  onDestroy(() => {
    removeDrawingShortcut()
    removeDrawerDispatchListener?.()
  })
</script>

<div class="row controls v-center mrg-s mrg--b">
  <div
    class="btn-3 expl-tooltip"
    aria-label="Draw Line | L"
    class:active={$ChartDrawer.isNewDrawing === 'line'}
    class:disabled={$ChartDrawer.isHidden}
    on:click={onNewLine}
  >
    <Svg id="line" w="15" />
  </div>

  <div
    class="btn-3 expl-tooltip"
    aria-label="Horizontal Ray"
    class:active={$ChartDrawer.isNewDrawing === 'hray'}
    class:disabled={$ChartDrawer.isHidden}
    on:click={onNewHorizontalRay}
  >
    <Svg id="hray" w="17" h="5" />
  </div>

  <Note {chart} {ChartDrawer} />

  <Emoji {chart} {ChartDrawer} />

  <div class="divider" />
  <DrawingsVisibility {widget} {ChartDrawer} />

  {#if $ChartDrawer.selectedLine}
    <div class="btn-3 delete" on:click={onLineDelete}>
      <Svg id="delete" w="16" />
    </div>
  {/if}

  <div class="mrg-a mrg--l" />

  {#if !hasSubscription}
    <IncompleteData {chart} metrics={$Metrics} settings={$studio} />
  {:else if $globals.isTrial}
    <a href="/pricing" class="btn-2 btn-1 btn--s btn--orange mrg-m mrg--r">
      <Svg id="crown" w="12" h="9" class="mrg-s mrg--r" />Upgrade</a
    >
  {/if}

  {#if hasDomainGroups}
    <button class="row v-center" on:click={() => (isSharedAxisEnabled = !isSharedAxisEnabled)}>
      Shared axis <Toggle class="mrg-s mrg--l mrg--r" isActive={isSharedAxisEnabled} />
    </button>
  {/if}

  {#if !noWidgetControls}
    <a
      target="_blank"
      rel="noopener noreferrer"
      href="https://sanr.app/?utm_source=santiment&utm_medium=charts"
      class="btn-2 btn--s row v-center mrg-s mrg--r"
      data-type="create_sanr_forecast"
      data-source="charts"
    >
      <img src={sanrSrc} alt="sanr" class="mrg-s mrg--r" />
      Create forecast
    </a>

    <div
      class="btn-3 mrg-s mrg--r expl-tooltip"
      aria-label="Download as PNG"
      on:click={() => download({ ...widget, chart }, downloadPng)}
    >
      <Svg id="download" w="17" />
    </div>

    <Embed />

    <div class="btn-3" use:optionsTooltip={{ isSingleWidget, deleteWidget, widget }}>
      <Svg id="cog" w="16" />
    </div>

    <Fullscreen {fullscreenMetricsFilter} bind:isFullscreened />
  {/if}
</div>

<style>
  .controls {
    fill: var(--waterloo);
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

  .controls :global(.expl-tooltip::before) {
    z-index: 24;
  }
</style>

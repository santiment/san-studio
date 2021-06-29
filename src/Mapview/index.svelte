<script lang="ts">
  import Icon from 'webkit/ui/Icon.svelte'
  import { getHistoryContext, withScroll } from '@/history'
  import { mapview, MapviewPhase } from '@/stores/mapview'
  import { getWidgets } from '@/stores/widgets'
  import { selectedMetrics } from '@/stores/selector'
  import { getAdapterController } from '@/adapter/context'
  import { newSortableDndCtx } from './dnd'
  import Preview from './Preview.svelte'
  import ChartPreview from './ChartPreview.svelte'
  import Items from './Items.svelte'

  const Widgets = getWidgets()
  const dndContext = newSortableDndCtx({ onDragEnd })
  const { adjustSelectedMetric } = getAdapterController()
  const History = getHistoryContext()

  $: widgets = $Widgets
  $: mapview.checkActiveMetrics(
    $selectedMetrics.items.length > 0 || $selectedMetrics.subwidgets.length > 0,
  )
  $: isMapview = $mapview !== MapviewPhase.None
  $: isMetricsPhase = $mapview === MapviewPhase.Metrics
  $: dndContext.toggle(isMetricsPhase)
  $: document.body.style.overflow = isMapview ? 'hidden' : ''

  const onEscape = ({ key }) => key === 'Escape' && mapview.exit()
  $: if (isMapview) {
    window.addEventListener('keydown', onEscape)
  } else {
    window.removeEventListener('keydown', onEscape)
    selectedMetrics.clear()
  }

  function onWidgetClick(widget) {
    if ($mapview === MapviewPhase.Overview || widget.isBlocked) {
      widget.scrollIntoView()
      mapview.exit()
      return
    }

    if ($selectedMetrics.subwidgets.length) {
      Widgets.addSubwidgets(widget, $selectedMetrics.subwidgets)
    }

    if (widget.Metrics) {
      const metrics = adjustMetrics($selectedMetrics.items)
      const notables = $selectedMetrics.notables.slice()
      const redo = () => {
        widget.Metrics.concat(metrics)
        widget.MetricsSignals.concat(notables)
      }

      redo()
      History.add(
        'Add metrics',
        withScroll(widget, () => {
          widget.Metrics.deleteEach(metrics)
          widget.MetricsSignals.deleteEach(metrics)
        }),
        withScroll(widget, redo),
      )
      selectedMetrics.clear()
    }
  }

  function onNewWidgetClick() {
    const widget = Widgets.add(adjustMetrics($selectedMetrics.items))

    History.add(
      'New widget',
      () => widget?.delete(),
      () => {
        widget.scrollOnMount = true
        Widgets.push(widget)
      },
    )
    selectedMetrics.clear()
  }

  function adjustMetrics(metrics: Studio.Metric[]) {
    return adjustSelectedMetric ? metrics.map(adjustSelectedMetric) : metrics
  }

  function onDragEnd(oldIndex: number, newIndex: number) {
    if (oldIndex === newIndex) return

    const newWidgets = widgets.slice()
    const widget = newWidgets.splice(oldIndex, 1)[0]
    newWidgets.splice(newIndex, 0, widget)

    Widgets.set(newWidgets)

    const { scrollParent } = dndContext.ctx
    if (!scrollParent) return

    const scrollTop = scrollParent.scrollTop
    window.requestAnimationFrame(() => {
      scrollParent.scrollTop = scrollTop
    })
  }
</script>

{#if isMapview}
  <div class="mapview">
    <div class="sticky column">
      <div class="header">
        <h2 class="body-1 txt-m mrg-s mrg--b">Apply metrics to the chart(s)</h2>
        <h3 class="body-2">
          Select metrics from the left sidebar and pick where you woud like to
          place them
        </h3>
      </div>

      <div class="visible">
        <div class="widgets">
          {#each widgets as widget (widget.id)}
            {#if widget.metrics}
              <ChartPreview {widget} {isMetricsPhase} onClick={onWidgetClick} />
            {:else}
              <Preview
                isBlocked={isMetricsPhase}
                class="column hv-center"
                on:click={() => onWidgetClick(widget)}>
                <div class="title">
                  {widget.previewTitle}
                </div>
              </Preview>
            {/if}
          {/each}

          {#if isMetricsPhase && $selectedMetrics.items.length}
            <Preview class="column hv-center" on:click={onNewWidgetClick}>
              <Icon illus id="plus" w="45" h="48" class="mrg-l mrg--b" />
              Add new chart</Preview>
          {/if}
        </div>
      </div>

      {#if isMetricsPhase}
        <div class="selections column">
          <Items items={$selectedMetrics.items} name="metric" />
          <Items
            items={$selectedMetrics.subwidgets}
            name="widget"
            class="mrg-s mrg--t" />
        </div>
      {/if}
    </div>
  </div>
{/if}

<style>
  .mapview {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: var(--athens);
    user-select: none;
    z-index: 23;
  }

  .sticky {
    height: 100vh;
    top: 0;
    position: sticky;
    padding: 64px 40px;
  }

  .header {
    margin: 40px 0 32px;
  }

  h3 {
    color: var(--waterloo);
  }

  .visible {
    overflow: auto;
    flex: 1;
    margin-right: -40px;
    user-select: none;
    -webkit-user-select: none;
  }

  .widgets {
    display: grid;
    grid-template-columns: repeat(auto-fit, 475px);
    grid-auto-flow: row dense;
    grid-gap: 23px;
    flex: 1 1;
  }

  .selections {
    border-radius: 4px;
    background: #505573;
    padding: 12px 24px;
    right: 40px;
    bottom: 25px;
    position: fixed;
    left: 300px;
  }

  .title {
    font-size: 21px;
    color: var(--waterloo);
  }
</style>

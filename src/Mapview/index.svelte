<script lang="ts">
  import { tick } from 'svelte'
  import { getHistoryContext, withScroll } from '@/history'
  import Svg from 'webkit/ui/Svg.svelte'
  import { mapview, MapviewPhase } from '@/stores/mapview'
  import { getWidgets } from '@/stores/widgets'
  import { selectedMetrics } from '@/stores/selector'
  import { getAdapterController } from '@/adapter/context'
  import { newSortableDndCtx } from './dnd'
  import Preview from './Preview.svelte'
  import ChartPreview from './ChartPreview.svelte'
  import SelectedStack from './SelectedStack.svelte'

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
  $: if ($mapview) {
    tick().then(tick).then(dndContext.ctx.recalcGrid)
  }

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
    const widget = Widgets.add(
      adjustMetrics($selectedMetrics.items),
      undefined,
      true,
    )

    History.add(
      'New widget',
      () => widget?.delete(),
      () => {
        widget.scrollOnMount = true
        Widgets.unshift(widget)
      },
    )
    selectedMetrics.clear()
  }

  function adjustMetrics(metrics: Studio.Metric[]) {
    return adjustSelectedMetric ? metrics.map(adjustSelectedMetric) : metrics
  }

  function onDragEnd(oldIndex: number, newIndex: number) {
    if (oldIndex === newIndex) return

    const oldWidgets = widgets.slice()
    const newWidgets = widgets.slice()
    const widget = newWidgets.splice(oldIndex, 1)[0]
    newWidgets.splice(newIndex, 0, widget)

    Widgets.set(newWidgets)

    History.add(
      'Widgets rearranged',
      () => Widgets.set(oldWidgets),
      () => Widgets.set(newWidgets),
    )

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
      <div class="visible mrg-l mrg--t">
        <div class="widgets">
          {#if isMetricsPhase && $selectedMetrics.items.length}
            <Preview
              class="column hv-center body-2 txt-m $style.new"
              on:click={onNewWidgetClick}>
              <Svg illus id="plus" w="45" h="48" class="mrg-l mrg--b" />
              Apply for new chart
            </Preview>
          {/if}

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
        </div>
      </div>
    </div>
  </div>
{/if}

{#if isMetricsPhase}
  <SelectedStack />
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
    padding: 64px 40px 0;
  }

  .visible {
    overflow: auto;
    flex: 1;
    margin-right: -40px;
    user-select: none;
    -webkit-user-select: none;
    padding-bottom: 40px;
  }

  .widgets {
    display: grid;
    grid-template-columns: repeat(auto-fit, 475px);
    grid-auto-flow: row dense;
    grid-gap: 23px;
    flex: 1 1;
  }

  .title {
    font-size: 21px;
    color: var(--waterloo);
  }

  .column.new {
    color: var(--waterloo);
    border: 1.5px dashed var(--mystic);
  }
  .column.new::after {
    display: none !important;
  }
  .column.new:hover {
    border: 1.5px dashed var(--green);
    box-shadow: 0px 2px 24px rgba(24, 27, 43, 0.04),
      1px 3px 7px rgba(47, 53, 77, 0.05);
  }
</style>

<script lang="ts">
  import { tick } from 'svelte'
  import { newSortableContext } from 'webkit/ui/dnd/sortable'
  import { globals } from '@/stores/globals'
  import { getWidget } from '@/ChartWidget/context'
  import Metric from './Metric.svelte'
  import AutoUpdate from './AutoUpdate.svelte'
  const { Metrics } = getWidget()
  const dndContext = $globals.isBeta
    ? newSortableContext({ onDragEnd })
    : undefined

  export let metrics, colors, loadings, settingsOpenedMetric
  export let MetricError
  export let isSingleWidget
  export let onMetricClick,
    onMetricHover,
    onMetricDelete,
    onMetricLock,
    onMetricSettings

  function onDragEnd(oldIndex: number, newIndex: number) {
    if (oldIndex === newIndex) return

    const newMetrics = metrics.slice()
    const metric = newMetrics.splice(oldIndex, 1)[0]
    newMetrics.splice(newIndex, 0, metric)

    Metrics.set(newMetrics)
    tick().then(dndContext.ctx.recalcGrid)
  }

  let hoveredMetric
  let hoverTimer
  const clearHover = () => clearTimeout(hoverTimer)

  function hoverMetric(metric?: Studio.Metric) {
    hoveredMetric = metric
    onMetricHover(metric)
  }
  function onMetricEnter(metric: Studio.Metric) {
    clearHover()
    if (hoveredMetric) return hoverMetric(metric)
    hoverTimer = window.setTimeout(() => hoverMetric(metric), 120)
  }
  function onMetricLeave() {
    clearHover()
    if (hoveredMetric) hoverTimer = window.setTimeout(() => hoverMetric(), 100)
  }
</script>

<div class="row">
  <div class="metrics row">
    {#each metrics as metric, i (i)}
      <Metric
        {dndContext}
        {metric}
        {colors}
        error={MetricError.get(metric)}
        isLoading={loadings.has(metric)}
        isSettingsOpened={settingsOpenedMetric === metric}
        onClick={onMetricClick}
        onEnter={onMetricEnter}
        onLeave={onMetricLeave}
        onDelete={isSingleWidget && metrics.length === 1
          ? undefined
          : onMetricDelete}
        onLock={onMetricLock}
        onSettings={onMetricSettings} />
    {/each}
  </div>

  {#if $globals.isPresenterMode === false}
    <AutoUpdate />
  {/if}
</div>

<style>
  .metrics {
    margin-left: -8px;
    flex-wrap: wrap;
    flex: 1;
  }
</style>

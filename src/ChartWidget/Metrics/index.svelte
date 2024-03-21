<script lang="ts">
  import { tick } from 'svelte'
  import { newSortableContext } from 'webkit/ui/dnd/sortable'
  import Svg from 'webkit/ui/Svg/svelte'
  import { queryRestrictedDates } from '@/api/metrics/restrictions'
  import { getAdapterController } from '@/adapter/context'
  import { globals } from '@/stores/globals'
  import { getAutoUpdater } from '@/stores/autoUpdater'
  import { studio } from '@/stores/studio'
  import { getWidget } from '@/ChartWidget/context'
  import Metric from './Metric.svelte'
  import AutoUpdate from './AutoUpdate.svelte'
  import IncompleteData from '../IncompleteData/index.svelte'
  import { Node } from '@/Chart/nodes'

  const { isOnlyChartEmbedded } = getAdapterController()
  const { Metrics, HiddenMetrics, ChartAddons } = getWidget()
  const AutoUpdater = getAutoUpdater()
  const dndContext = $globals.isBeta ? newSortableContext({ onDragEnd }) : undefined

  export let chart
  export let metrics, colors, loadings, settingsOpenedMetric
  export let MetricError, ChartAddonError
  export let isSingleWidget
  export let changeStudioPeriod
  export let onMetricClick, onMetricHover, onMetricDelete, onMetricLock, onMetricSettings

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
  let restrictions
  const clearHover = () => clearTimeout(hoverTimer)

  $: hasSubscription = $globals.isPro || $globals.isProPlus
  $: project = $studio
  $: isMultipleMetricsOnChart = metrics.length > 1
  $: hiddenMetrics = $HiddenMetrics

  $: queryRestrictedDates().then((data) => (restrictions = data))

  function hoverMetric(metric?: Studio.Metric) {
    hoveredMetric = metric
    onMetricHover(metric)
  }
  function onMetricEnter(metric: Studio.Metric) {
    if (metric.node === Node.REFERENCE) return

    clearHover()
    if (hoveredMetric) return hoverMetric(metric)
    hoverTimer = window.setTimeout(() => hoverMetric(metric), 120)
  }
  function onMetricLeave() {
    clearHover()
    if (hoveredMetric) hoverTimer = window.setTimeout(() => hoverMetric(), 100)
  }

  function isMetricRestricted(metric: Studio.Metric, restrictions) {
    if (!restrictions) return false

    const data = restrictions[metric.queryKey ?? metric.key]
    return !!data?.restrictedFrom || !!data?.restrictedTo
  }
</script>

<div class="row">
  <div class="metrics row">
    {#each metrics as metric, i (i)}
      {@const restricted = isMetricRestricted(metric, restrictions)}

      <Metric
        {dndContext}
        {metric}
        {colors}
        {project}
        {isMultipleMetricsOnChart}
        {restricted}
        error={MetricError.get(metric)}
        isHidden={hiddenMetrics.has(metric)}
        isLoading={loadings.has(metric)}
        isSettingsOpened={settingsOpenedMetric === metric}
        onClick={onMetricClick}
        onEnter={onMetricEnter}
        onLeave={onMetricLeave}
        onDelete={isSingleWidget && metrics.length === 1 ? undefined : onMetricDelete}
        onLock={onMetricLock}
        onSettings={onMetricSettings}
      />
    {/each}
    {#each $ChartAddons as metric}
      {@const restricted = isMetricRestricted(metric, restrictions)}

      <Metric
        {metric}
        {project}
        {restricted}
        error={ChartAddonError.get(metric)}
        onClick={onMetricClick}
        onEnter={onMetricEnter}
        onLeave={onMetricLeave}
        onDelete={() => ChartAddons.delete(metric)}
        onSettings={onMetricSettings}
      />
    {/each}
  </div>

  <slot />

  {#if !hasSubscription}
    <IncompleteData {chart} metrics={$Metrics} settings={$studio} />
  {:else if $globals.isTrial}
    <a href="/pricing" class="btn-2 btn-1 btn--s btn--orange mrg-m mrg--r">
      <Svg id="crown" w="12" h="9" class="mrg-s mrg--r" />
      Upgrade
    </a>
  {/if}

  {#if !isOnlyChartEmbedded && $globals.isPresenterMode === false && AutoUpdater}
    <AutoUpdate {AutoUpdater} {changeStudioPeriod} />
  {/if}
</div>

<style>
  .metrics {
    margin-left: -8px;
    flex-wrap: wrap;
    flex: 1;
    --tooltip-z-index: 30;
  }
</style>

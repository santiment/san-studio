<script lang="ts">
  import { withScroll, getHistoryContext } from 'webkit/ui/history'
  import { studio } from '@/stores/studio'
  import { globals } from '@/stores/globals'
  import { getTimeseries, getAllTimeData } from '@/api/timeseries'
  import { ALL_COLORS, newHighlightedColors } from '@/Chart/colors'
  import { getAdapterController } from '@/adapter/context'
  import Chart from './Chart.svelte'
  import Controls from './Controls/index.svelte'
  import MetricsRow from './Metrics/index.svelte'
  import MetricSettingsRow from './MetricSettings/index.svelte'
  import { mapClosestValue } from '@/Chart/utils'
  import { getMetricNodes } from '@/Chart/nodes'
  import { setIsTooltipSyncEnabled } from '@/Chart/Tooltip/context'
  import { initWidget, initWidgetContext, getOnLoadContext } from './context'
  import { newMetricSettingsTransformer } from './transformers'
  import {
    groupDomains,
    getIndicatorDomainGroups,
    checkHasDomainGroups,
  } from './domain'
  import { debounced } from './utils'

  const { onWidgetInit } = getAdapterController()
  const History = getHistoryContext()

  export let widget: Studio.ChartWidget
  export let isFullscreen = false
  export let isSingleWidget: boolean
  export let deleteWidget = undefined
  export let metricsFilter = undefined
  export let fullscreenMetricsFilter = undefined
  export let onLoad = getOnLoadContext()

  initWidget(widget)
  initWidgetContext(widget)
  setIsTooltipSyncEnabled(!isFullscreen)
  if (onWidgetInit) onWidgetInit(widget)

  const { ChartAxes, ChartColors, ChartDrawer, ChartMetricDisplays } = widget
  const { Metrics, MetricSettings, MetricIndicators } = widget
  const { MetricsSignals, SignalsTimeseries } = widget
  const { IsLoaded, OnUpdate } = widget
  const onData = (newData, newLoadings) =>
    (rawData = newData) && (loadings = newLoadings)
  const onAllTimeData = (newData) => (allTimeData = newData)
  const noop = () => {}

  let chart
  let rawData = []
  let allTimeData = []
  let MetricError = new Map()
  let loadings = new Set(widget.metrics)
  let isSharedAxisEnabled = false

  $: metricSettingsTransformer = newMetricSettingsTransformer(
    $studio,
    ChartMetricDisplays,
  )
  $: metrics = $Metrics
  $: ({ slug } = $studio)
  $: categories = getMetricNodes(metrics, $MetricSettings)
  $: data = mapClosestValue(rawData, categories)
  $: MetricsSignals.update(metrics)
  $: SignalsTimeseries.update($MetricsSignals, $studio)
  $: ChartColors.update(metrics)
  $: ChartMetricDisplays.update(metrics)
  $: MetricSettings.update(metrics, metricSettingsTransformer)
  $: displayedMetrics = metricsFilter ? metrics.filter(metricsFilter) : metrics
  $: settingsOpenedMetric = getSettingsOpenedMetric(displayedMetrics)
  $: rawColors = $ChartColors
  $: colors = rawColors
  $: fetchData(metrics, $studio, $MetricSettings)
  $: fetchAllData(metrics, slug)
  $: MetricIndicators.update(metrics)
  $: rawDomainGroups = groupDomains(metrics)
  $: alwaysDomainGroups = getIndicatorDomainGroups(metrics)
  $: hasDomainGroups = checkHasDomainGroups(rawDomainGroups, alwaysDomainGroups)
  $: domainGroups = isSharedAxisEnabled ? rawDomainGroups : alwaysDomainGroups
  $: ChartAxes.updateMetrics(metrics, MetricError, domainGroups)
  $: IsLoaded.set(loadings.size === 0)
  $: onLoad && loadings.size === 0 && onLoad(widget)
  // prettier-ignore
  $: ($ChartAxes, $ChartColors, $MetricIndicators, $MetricSettings, $ChartDrawer,
      $MetricsSignals, OnUpdate.emit())

  widget.fetchData = (cachePolicy) =>
    fetchData(metrics, $studio, $MetricSettings, cachePolicy)

  let abortFetch
  const fetchData = debounced(
    (
      metrics: Studio.Metric[],
      settings: Studio.Settings,
      MetricSettings: Studio.MetricSettings,
      cachePolicy?: any,
    ) => {
      if (abortFetch) abortFetch()

      // prettier-ignore
      abortFetch = getTimeseries(
        metrics, settings, onData, onDataError, MetricSettings, cachePolicy
      )
    },
  )
  const fetchAllData = debounced((metrics: Studio.Metric[], slug: string) =>
    getAllTimeData(metrics, slug, onAllTimeData, noop),
  )

  function changeStudioPeriod(
    startDatetime: number | string,
    endDatetime: number | string,
  ) {
    const { from, to } = $studio
    const undo = () => studio.setPeriod(new Date(from), new Date(to))
    const redo = () =>
      studio.setPeriod(new Date(startDatetime), new Date(endDatetime))

    History.add('Period change', undo, redo)
    redo()
  }

  function onDataError(Error, newLoadings, newData?: any) {
    MetricError = Error
    loadings = newLoadings
    if (newData) rawData = newData
  }

  const onMetricSettings = (metric) => (settingsOpenedMetric = metric)

  function onMetricHover(metric?: Studio.Metric) {
    colors = metric ? newHighlightedColors(rawColors, metric) : rawColors
  }

  function onMetricClick(metric: Studio.Metric, e: MouseEvent) {
    if (e.target === e.currentTarget) {
      settingsOpenedMetric = metric
    }
  }

  function onMetricDelete(metric: Studio.Metric) {
    if (metrics.length === 1) return deleteWidget()

    const oldMetrics = $Metrics.slice()
    const redo = () => Metrics.delete(metric)
    const undo = () => Metrics.set(oldMetrics)
    History.add('Delete metric', undo, redo)
    redo()
  }

  function getSettingsOpenedMetric(metrics: Studio.Metric[]) {
    if (!settingsOpenedMetric || metrics.indexOf(settingsOpenedMetric) === -1) {
      return metrics[0]
    }
    return settingsOpenedMetric
  }

  function onMetricLock(
    oldMetric: Studio.Metric,
    newMetric: Studio.Metric,
    index: number,
  ) {
    lockMetric(newMetric, index)
    History.add(
      'Lock metric',
      withScroll(widget, () => lockMetric(oldMetric, index)),
      withScroll(widget, () => lockMetric(newMetric, index)),
    )
  }

  function lockMetric(metric: Studio.Metric, index: number) {
    const oldMetric = metrics[index]
    if (settingsOpenedMetric === oldMetric) {
      settingsOpenedMetric = metric
    }
    const oldKey = oldMetric.key
    const oldColor = ChartColors.get()[oldKey]

    if (!ALL_COLORS.has(oldColor)) {
      ChartColors.replace(oldKey, metric.key)
    }

    MetricSettings.replace(oldKey, metric.key)
    Metrics.replace(index, metric)
  }

  function onChart(newChart) {
    if (!widget.chart) widget.chart = newChart
    chart = newChart
  }
</script>

<div class="widget column">
  <Controls
    {chart}
    {isSingleWidget}
    {deleteWidget}
    {hasDomainGroups}
    {fullscreenMetricsFilter}
    bind:isSharedAxisEnabled />

  <slot />

  <MetricsRow
    metrics={displayedMetrics}
    {settingsOpenedMetric}
    {loadings}
    {colors}
    {MetricError}
    {isSingleWidget}
    {changeStudioPeriod}
    {onMetricClick}
    {onMetricHover}
    {onMetricDelete}
    {onMetricLock}
    {onMetricSettings} />

  {#if settingsOpenedMetric && $globals.isPresenterMode === false}
    <MetricSettingsRow metric={settingsOpenedMetric} />
  {/if}

  <Chart
    {metrics}
    {data}
    {allTimeData}
    {colors}
    {categories}
    {domainGroups}
    from={$studio.from}
    to={$studio.to}
    {changeStudioPeriod}
    {onChart} />
</div>

<style>
  .widget {
    height: 100%;
    flex: 1;
    min-width: 0;
  }
</style>

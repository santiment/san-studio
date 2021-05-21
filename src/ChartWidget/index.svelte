<script lang="ts">
  import { studio } from '@/stores/studio'
  import { getTimeseries, getAllTimeData } from '@/api/timeseries'
  import { newHighlightedColors } from '@/Chart/colors'
  import Chart from './Chart.svelte'
  import Controls from './Controls/index.svelte'
  import MetricsRow from './Metrics/index.svelte'
  import MetricSettingsRow from './MetricSettings/index.svelte'
  import { mapClosestValue } from '@/Chart/utils'
  import { setIsTooltipSyncEnabled } from '@/Chart/Tooltip/context'
  import { initWidget } from './context'
  import { newMetricSettingsTransformer } from './transformers'
  import { groupDomains, getIndicatorDomainGroups } from './domain'

  export let widget: Studio.ChartWidget
  export let isFullscreen = false
  export let isSingleWidget: boolean
  export let deleteWidget = undefined
  export let metricsFilter = undefined
  export let fullscreenMetricsFilter = undefined

  initWidget(widget)
  setIsTooltipSyncEnabled(!isFullscreen)

  const { ChartAxes, ChartColors, IsLoaded, ChartMetricDisplays } = widget
  const { Metrics, MetricSettings, MetricIndicators } = widget
  const onData = (newData, newLoadings) =>
    (data = mapClosestValue(newData, metrics)) && (loadings = newLoadings)
  const onError = (Error, newLoadings) =>
    (MetricError = Error) && (loadings = newLoadings)
  const onAllTimeData = (newData) => (allTimeData = newData)
  const noop = () => {}

  let chart
  let data = []
  let allTimeData = []
  let MetricError = new Map()
  let loadings = new Set(widget.metrics)
  let isSharedAxisEnabled = false

  $: metricSettingsTransformer = newMetricSettingsTransformer($studio)
  $: metrics = $Metrics
  $: ChartColors.update(metrics)
  $: ChartMetricDisplays.update(metrics)
  $: MetricSettings.update(metrics, metricSettingsTransformer)
  $: displayedMetrics = metricsFilter ? metrics.filter(metricsFilter) : metrics
  $: settingsOpenedMetric = getSettingsOpenedMetric(displayedMetrics)
  $: rawColors = $ChartColors
  $: colors = rawColors
  $: getTimeseries(metrics, $studio, onData, onError, $MetricSettings)
  $: ChartAxes.updateMetrics(metrics, MetricError)
  $: getAllTimeData(metrics, $studio.slug, onAllTimeData, noop)
  $: rawDomainGroups = groupDomains(metrics)
  $: alwaysDomainGroups = getIndicatorDomainGroups(metrics)
  $: hasDomainGroups = !!rawDomainGroups
  $: domainGroups = isSharedAxisEnabled ? rawDomainGroups : alwaysDomainGroups
  $: IsLoaded.set(loadings.size === 0)

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

    Metrics.delete(metric)
    ChartAxes.delete(metric)
    if (metric.indicator) {
      // TODO: Handle prop access in delete method [@vanguard | May 14, 2021]
      MetricIndicators.delete(metric.base.key, metric.indicator)
    }
  }

  function changeStudioPeriod(startDatetime: number, endDatetime: number) {
    studio.setPeriod(new Date(startDatetime), new Date(endDatetime))
  }

  function getSettingsOpenedMetric(metrics: Studio.Metric[]) {
    if (!settingsOpenedMetric || metrics.indexOf(settingsOpenedMetric) === -1) {
      return metrics[0]
    }
    return settingsOpenedMetric
  }

  function onMetricLock(metric: Studio.Metric, index: number) {
    if (settingsOpenedMetric === metrics[index]) {
      settingsOpenedMetric = metric
    }
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
    {colors}
    {MetricError}
    {isSingleWidget}
    {onMetricClick}
    {onMetricHover}
    {onMetricDelete}
    {onMetricLock}
    {onMetricSettings} />

  {#if settingsOpenedMetric}
    <MetricSettingsRow metric={settingsOpenedMetric} />
  {/if}

  <Chart
    {metrics}
    {data}
    {allTimeData}
    {colors}
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
  }
</style>

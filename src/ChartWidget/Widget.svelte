<script lang="ts">
  import { withScroll, getHistoryContext } from 'webkit/ui/history'
  import { studio } from '@/stores/studio'
  import { globals } from '@/stores/globals'
  import { getAdapterController } from '@/adapter/context'
  import { ALL_COLORS } from '@/Chart/colors'
  import Logic from './Logic.svelte'
  import Chart from './Chart.svelte'
  import Controls from './Controls/index.svelte'
  import MetricsRow from './Metrics/index.svelte'
  import MetricSettingsRow from './MetricSettings/index.svelte'
  import { initWidget, initWidgetContext, getOnLoadContext } from './context'

  const {
    onWidgetInit,
    isWithMetricSettings = true,
    isOnlyChartEmbedded,
  } = getAdapterController()
  const History = getHistoryContext()

  let className = ''
  export { className as class }
  export let widget: Studio.ChartWidget
  export let rawData = []
  export let allTimeData
  export let isSingleWidget: boolean
  export let deleteWidget = undefined
  export let metricsFilter = undefined
  export let fullscreenMetricsFilter = undefined
  export let MetricError
  export let loadings
  export let onLoad = getOnLoadContext()

  initWidget(widget)
  initWidgetContext(widget)
  if (onWidgetInit) onWidgetInit(widget)

  const { ChartAxes, ChartColors, ChartDrawer, ChartOptions } = widget
  const { Metrics, MetricSettings, MetricIndicators } = widget
  const { MetricsSignals } = widget
  const { IsLoaded, OnUpdate } = widget

  let chart
  let isSharedAxisEnabled = false

  $: metrics = $Metrics
  $: displayedMetrics = metricsFilter ? metrics.filter(metricsFilter) : metrics
  $: settingsOpenedMetric = getSettingsOpenedMetric(displayedMetrics)
  $: IsLoaded.set(loadings.size === 0)
  $: onLoad && loadings.size === 0 && onLoad(widget)
  // prettier-ignore
  $: ($ChartAxes, $ChartColors, $MetricIndicators, $MetricSettings, $ChartDrawer,
      $MetricsSignals, $ChartOptions, OnUpdate.emit())

  function changeStudioPeriod(
    startDatetime: number | string,
    endDatetime: number | string,
  ) {
    if (isOnlyChartEmbedded) return

    const { from, to } = $studio
    const undo = () => studio.setPeriod(new Date(from), new Date(to))
    const redo = () =>
      studio.setPeriod(new Date(startDatetime), new Date(endDatetime))

    History.add('Period change', undo, redo)
    redo()
  }

  const onMetricSettings = (metric) => (settingsOpenedMetric = metric)

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

<Logic
  {widget}
  {rawData}
  {isSharedAxisEnabled}
  {MetricError}
  let:data
  let:colors
  let:nodes={categories}
  let:domainGroups
  let:hasDomainGroups
  let:onMetricHover>
  <div class="widget column {className}">
    {#if isOnlyChartEmbedded !== true}
      <Controls
        {chart}
        {isSingleWidget}
        {deleteWidget}
        {hasDomainGroups}
        {fullscreenMetricsFilter}
        bind:isSharedAxisEnabled />
    {/if}

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

    {#if isWithMetricSettings && settingsOpenedMetric && $globals.isPresenterMode === false}
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
</Logic>

<style>
  .widget {
    height: 100%;
    flex: 1;
    min-width: 0;
  }
</style>

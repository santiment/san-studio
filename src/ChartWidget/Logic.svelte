<script lang="ts">
  import { studio } from '@/stores/studio'
  import { newHighlightedColors } from '@/Chart/colors'
  import { mapClosestValue } from '@/Chart/utils'
  import { getMetricNodes } from '@/Chart/nodes'
  import { newMetricSettingsTransformer } from './transformers'
  import {
    groupDomains,
    getIndicatorDomainGroups,
    checkHasDomainGroups,
    getIndicatorDomainGroup,
  } from './domain'
  import { setContext } from 'svelte'

  export let widget: Studio.ChartWidget
  export let rawData = []
  export let isSharedAxisEnabled = false
  export let MetricError = new Map()

  const { ChartAxes, ChartColors, ChartMetricDisplays, PinnedChartAxes } = widget
  const { Metrics, HiddenMetrics, MetricSettings, MetricIndicators } = widget
  const { MetricsSignals, SignalsTimeseries } = widget

  const dataCtx = setContext('dataCtx', { rawData: [] })

  $: dataCtx.rawData = rawData
  $: metricSettingsTransformer = newMetricSettingsTransformer($studio, ChartMetricDisplays)
  $: metrics = $Metrics
  $: hiddenMetrics = $HiddenMetrics
  $: visibleMetrics = metrics.filter((metric) => !hiddenMetrics.has(metric))
  $: nodes = getMetricNodes(visibleMetrics, $MetricSettings)
  $: data = mapClosestValue(rawData, nodes)
  $: MetricsSignals.update(metrics)
  $: SignalsTimeseries.update($MetricsSignals, $studio)
  $: ChartColors.update(metrics)
  $: ChartMetricDisplays.update(metrics)
  $: MetricSettings.update(metrics, metricSettingsTransformer)
  $: rawColors = $ChartColors
  $: colors = rawColors
  $: MetricIndicators.update(metrics)
  $: rawDomainGroups = ($PinnedChartAxes, groupDomains(visibleMetrics, getMetricDomain))
  $: alwaysDomainGroups =
    ($PinnedChartAxes, getIndicatorDomainGroups(visibleMetrics, getIndicatorMetricDomain))
  $: hasDomainGroups = checkHasDomainGroups(rawDomainGroups, alwaysDomainGroups)
  $: domainGroups = isSharedAxisEnabled ? rawDomainGroups : alwaysDomainGroups
  $: ChartAxes.updateMetrics(visibleMetrics, MetricError, domainGroups)

  function onMetricHover(metric?: Studio.Metric) {
    colors = metric ? newHighlightedColors(rawColors, metric) : rawColors
  }

  function getMetricDomain(metric: Studio.Metric) {
    if (PinnedChartAxes.has(metric)) return 'PINNED'
    return metric.domainGroup
  }

  function getIndicatorMetricDomain(metric: Studio.Metric) {
    if (PinnedChartAxes.has(metric)) return 'PINNED'
    return getIndicatorDomainGroup(metric)
  }
</script>

<slot {data} {nodes} {colors} {domainGroups} {hasDomainGroups} {onMetricHover} />

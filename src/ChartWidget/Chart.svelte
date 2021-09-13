<script lang="ts">
  import { getTodaysEnd } from 'webkit/utils/dates'
  import { studio } from '@/stores/studio'
  import { FORMATTER } from '@/metrics/formatters'
  import { getDefaultTooltipSettings } from '@/Chart/utils'
  import { themes } from '@/Chart/theme'
  import Chart from '@/Chart/index.svelte'
  import Candles from '@/Chart/Candles.svelte'
  import Lines from '@/Chart/Lines.svelte'
  import Areas from '@/Chart/Areas.svelte'
  import Bars from '@/Chart/Bars.svelte'
  import GreenRedBars from '@/Chart/GreenRedBars.svelte'
  import CartesianGrid from '@/Chart/CartesianGrid.svelte'
  import Tooltip from '@/Chart/Tooltip/index.svelte'
  import Axes from '@/Chart/Axes/index.svelte'
  import { getResponsiveAxesKeys, getXTicksByWidth } from '@/Chart/Axes/utils'
  import Brush from '@/Chart/Brush/index.svelte'
  import Drawer from '@/Chart/Drawer/index.svelte'
  import Watermark from '@/Chart/Watermark.svelte'
  import ReferenceDots from '@/Chart/ReferenceDots.svelte'
  import { globals } from '@/stores/globals'
  import { getAdapterController } from '@/adapter/context'
  import { newDomainModifier } from './domain'
  import { getWidget } from './context'

  const widget = getWidget()
  const {
    isEmbedded,
    onChartPointClick,
    onModRangeSelect = () => {},
  } = getAdapterController()

  const { ChartAxes, ChartOptions } = widget
  const { MetricSettings, ChartMetricDisplays, SignalsTimeseries } = widget

  export let metrics: Studio.Metric[]
  export let data = []
  export let allTimeData
  export let colors
  export let categories
  export let domainGroups
  export let from, to
  export let onChart, changeStudioPeriod

  let chartWidth

  const getKey = ({ key }) => key
  $: ({ ticker } = $studio)
  $: references = $SignalsTimeseries
  $: axesMetricKeys = Array.from($ChartAxes).map(getKey)
  $: metricSettings = getTooltipSettings(
    metrics,
    references,
    ticker,
    $ChartMetricDisplays,
  )
  $: theme = themes[+$globals.isNightMode]
  $: domainModifier = newDomainModifier(metrics, $MetricSettings, widget)
  $: drawingKey = axesMetricKeys[0] || (metrics[0] && metrics[0].key)

  const labelGetter = (ticker: string, { base, label }: Studio.Metric) =>
    base ? label : label + ` (${ticker})`
  function getTooltipSettings(
    metrics: Studio.Metric[],
    references: any[],
    ticker: string,
    MetricDisplays,
  ) {
    const metricSettings = getDefaultTooltipSettings()
    metrics.forEach((metric) => {
      const { key, formatter = FORMATTER, getLabel, axisFormatter } = metric
      const metricLabel = (getLabel || labelGetter)(ticker, metric)

      metricSettings[key] = Object.assign(
        {
          label: metricLabel,
          formatter,
          axisFormatter,
        },
        MetricDisplays[key],
      )
    })

    references.forEach(({ key, label, formatter }) => {
      metricSettings[key] = {
        label,
        formatter,
      }
    })

    return metricSettings
  }

  function onBrushChange(startIndex: number, endIndex: number) {
    const start = allTimeData[startIndex]
    const end = allTimeData[endIndex]
    if (start && end) {
      changeStudioPeriod(
        start.datetime,
        endIndex === allTimeData.length - 1 ? getTodaysEnd() : end.datetime,
      )
    }
  }

  function onPointClick(point, e: MouseEvent) {
    if (onChartPointClick) onChartPointClick(point, e)
  }

  const RANGE_SELECT_SENSITIVITY = 7
  function onRangeSelect(start, end, e: MouseEvent) {
    if (start && end) {
      const shouldSwap = start.value > end.value
      let _start = shouldSwap ? end : start
      let _end = shouldSwap ? start : end

      const { ctrlKey, metaKey, shiftKey } = e
      if (ctrlKey || metaKey || shiftKey) {
        return onModRangeSelect(_start, _end, e)
      }

      if (Math.abs(_start.x - _end.x) < RANGE_SELECT_SENSITIVITY) return

      changeStudioPeriod(_start.value, _end.value)
    }
  }
</script>

<Chart
  {data}
  scale={$ChartOptions.scale}
  {categories}
  {colors}
  {theme}
  {metricSettings}
  {domainGroups}
  {domainModifier}
  {onChart}
  bind:width={chartWidth}>
  {#if $ChartOptions.watermark}
    <Watermark isLessVisible={$ChartOptions.isWatermarkLessVisible} />
  {/if}

  <GreenRedBars />
  <Bars />
  <Areas />
  <Candles />
  <Lines />

  <ReferenceDots {references} />

  {#if $ChartOptions.cartesianGrid} <CartesianGrid /> {/if}
  <Axes
    axesMetricKeys={getResponsiveAxesKeys(chartWidth, axesMetricKeys)}
    {metricSettings}
    xTicks={getXTicksByWidth(chartWidth)} />
  <Drawer {axesMetricKeys} metricKey={drawingKey} />
  <Tooltip
    {axesMetricKeys}
    {metricSettings}
    {onPointClick}
    {onRangeSelect}
    isShiftForced={isEmbedded} />

  {#if allTimeData}
    <Brush
      data={allTimeData}
      {categories}
      {colors}
      {from}
      {to}
      {theme}
      onChange={onBrushChange} />
  {/if}
</Chart>

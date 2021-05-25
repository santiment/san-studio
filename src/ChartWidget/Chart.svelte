<script lang="ts">
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
  import Brush from '@/Chart/Brush/index.svelte'
  import Drawer from '@/Chart/Drawer/index.svelte'
  import Watermark from '@/Chart/Watermark.svelte'
  import { globals } from '@/stores/globals'
  import { getAdapterController } from '@/adapter/context'
  import { newDomainModifier } from './domain'
  import { getWidget } from './context'
  const widget = getWidget()
  const {
    onChartPointClick,
    onModRangeSelect = () => {},
  } = getAdapterController()

  const { ChartAxes, ChartOptions } = widget
  const { MetricSettings, ChartMetricDisplays } = widget

  export let metrics: Studio.Metric[]
  export let data = []
  export let allTimeData = []
  export let colors
  export let categories
  export let domainGroups
  export let from, to
  export let onChart, changeStudioPeriod

  const getKey = ({ key }) => key
  $: ({ ticker } = $studio)
  $: axesMetricKeys = Array.from($ChartAxes).map(getKey)
  $: metricSettings = getTooltipSettings(metrics, ticker, $ChartMetricDisplays)
  $: theme = themes[+$globals.isNightMode]
  $: domainModifier = newDomainModifier(metrics, $MetricSettings)
  $: drawingKey = axesMetricKeys[0] || (metrics[0] && metrics[0].key)

  const labelGetter = (ticker: string, { base, label }: Studio.Metric) =>
    base ? label : label + ` (${ticker})`
  function getTooltipSettings(
    metrics: Studio.Metric[],
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
    return metricSettings
  }

  function onBrushChange(startIndex: number, endIndex: number) {
    const start = allTimeData[startIndex]
    const end = allTimeData[endIndex]
    if (start && end) changeStudioPeriod(start.datetime, end.datetime)
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
  {onChart}>
  {#if $ChartOptions.watermark}
    <Watermark isLessVisible={$ChartOptions.isWatermarkLessVisible} />
  {/if}

  <GreenRedBars />
  <Bars />
  <Areas />
  <Candles />
  <Lines />

  {#if $ChartOptions.cartesianGrid} <CartesianGrid /> {/if}
  <Axes {axesMetricKeys} {metricSettings} />
  <Drawer {axesMetricKeys} metricKey={drawingKey} />
  <Tooltip {axesMetricKeys} {metricSettings} {onPointClick} {onRangeSelect} />

  <Brush
    data={allTimeData}
    {categories}
    {colors}
    {from}
    {to}
    {theme}
    onChange={onBrushChange} />
</Chart>

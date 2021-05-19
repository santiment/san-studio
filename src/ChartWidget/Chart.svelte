<script lang="ts">
  import { studio } from '@/stores/studio'
  import { getDefaultTooltipSettings, FORMATTER } from '@/Chart/utils'
  import { themes } from '@/Chart/theme'
  import Chart from '@/Chart/index.svelte'
  import Lines from '@/Chart/Lines.svelte'
  import Areas from '@/Chart/Areas.svelte'
  import Bars from '@/Chart/Bars.svelte'
  import CartesianGrid from '@/Chart/CartesianGrid.svelte'
  import Tooltip from '@/Chart/Tooltip/index.svelte'
  import Axes from '@/Chart/Axes/index.svelte'
  import Brush from '@/Chart/Brush/index.svelte'
  import Drawer from '@/Chart/Drawer/index.svelte'
  import Watermark from '@/Chart/Watermark.svelte'
  import { globals } from '@/stores/globals'
  import { newDomainModifier } from './domain'
  import { getWidget } from './context'
  const widget = getWidget()
  const { ChartAxes, ChartOptions } = widget
  const { MetricSettings, MetricIndicators } = widget

  export let metrics: Studio.Metric[]
  export let data = []
  export let allTimeData = []
  export let colors
  export let domainGroups
  export let from, to
  export let onChart, onBrushChange

  const getKey = ({ key }) => key
  $: categories = getCategories(metrics, $MetricSettings)
  $: axesMetricKeys = Array.from($ChartAxes).map(getKey)
  $: metricSettings = getTooltipSettings(metrics, $studio.ticker)
  $: theme = themes[+$globals.isNightMode]
  $: domainModifier = newDomainModifier(metrics, $MetricSettings)

  function getCategories(metrics: Studio.Metric[], MetricSettings) {
    const joinedCategories = new Array(metrics.length)
    const categories = {
      joinedCategories,
      lines: [],
      bars: [],
      areas: [],
      filledLines: [],
      gradientLines: [],
    }
    for (let i = 0; i < metrics.length; i++) {
      const { key, node } = metrics[i]
      joinedCategories[i] = key
      categories[(MetricSettings[key]?.node || node) + 's'].push(key)
    }
    return categories
  }

  function getTooltipSettings(metrics: Studio.Metric[], ticker: string) {
    const metricSettings = getDefaultTooltipSettings()
    metrics.forEach((metric) => {
      const { key, label, formatter = FORMATTER, base, getLabel } = metric
      const metricLabel =
        getLabel?.(ticker) || (base ? label : label + ` (${ticker})`)
      // TODO: Better label handling [@vanguard | May 14, 2021]

      metricSettings[key] = {
        label: metricLabel,
        formatter,
      }
    })
    return metricSettings
  }
</script>

<Chart
  {data}
  scale={$ChartOptions.scale}
  {categories}
  {colors}
  {theme}
  {domainGroups}
  {domainModifier}
  {onChart}>
  {#if $ChartOptions.watermark}
    <Watermark isLessVisible={$ChartOptions.isWatermarkLessVisible} />
  {/if}

  <Bars />
  <Areas />
  <Lines />

  {#if $ChartOptions.cartesianGrid} <CartesianGrid /> {/if}
  <Axes {axesMetricKeys} {metricSettings} />
  <Drawer metricKey={axesMetricKeys[0]} />
  <Tooltip {axesMetricKeys} {metricSettings} />

  <Brush
    data={allTimeData}
    {categories}
    {colors}
    {from}
    {to}
    {theme}
    onChange={onBrushChange} />
</Chart>

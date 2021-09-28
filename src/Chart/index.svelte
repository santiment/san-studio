<script lang="ts">
  import { onMount } from 'svelte'
  import {
    initChart,
    updateChartState,
    updateChartDimensions,
    updateSize,
  } from 'san-chart'
  import { linearScale } from 'san-chart/scales'
  import { themes } from './theme'
  import { setChart, newPlotManager } from './context'
  import { clearCtx } from './utils'

  const DEFAULT_PADDING = {
    left: 0,
    top: 7,
    bottom: 0,
    right: 0,
  }

  export let padding: typeof DEFAULT_PADDING
  export let width: number, height: number
  export let data, categories, colors, domainGroups
  export let domainModifier = undefined
  export let scale = linearScale
  export let theme = themes[0]
  export let metricSettings = undefined
  export let onChart = undefined
  export let disabled = false

  let chart
  let canvas
  let shouldRedraw = 1

  $: setChart(chart)
  $: chart && width && height && padding && updateDimensions()
  $: chart && (chart.metricSettings = metricSettings)
  // prettier-ignore
  $: chart &&
    // @ts-ignore
    (disabled, theme, shouldRedraw, categories, colors, scale, domainGroups, data, drawChart(chart))

  onMount(() => {
    const _width = width || canvas.parentNode.offsetWidth
    const _height = height || canvas.parentNode.offsetHeight
    chart = initChart(canvas, _width, _height, padding || DEFAULT_PADDING)
    chart.theme = theme
    chart.redraw = () => (shouldRedraw += 1)
    chart.plotManager = newPlotManager()
    chart.setPadding = setPadding
    chart.rightAxisMargin = 0

    if (onChart) onChart(chart)
  })

  function setPadding(newPadding) {
    padding = newPadding
    const parent = canvas.parentNode
    const _width = width || parent.offsetWidth
    const _height = height || parent.offsetHeight
    updateChartDimensions(chart, _width, _height, newPadding)
    chart.redraw()
  }

  function drawChart(chart) {
    if (disabled) return
    clearCtx(chart)

    chart.theme = theme
    chart.bgColor = theme.bg
    chart.data = data
    chart.categories = categories
    chart.colors = colors
    chart.scale = scale
    chart.domainGroups = domainGroups
    chart.domainModifier = domainModifier

    if (data.length === 0) {
      chart.points = []
    } else {
      updateChartState(
        chart,
        data,
        categories.joinedCategories,
        domainModifier,
        domainGroups,
        new Set(categories.candles),
      )

      chart.plotManager.items.forEach((plot) => {
        plot(chart, scale, data, colors, categories)
      })
      chart.plotManager.emitDrawFinish()
    }
  }

  function updateDimensions() {
    const { tooltip, brush, drawer, canvasWidth, canvasHeight } = chart
    const _width = width || canvasWidth
    const _height = height || canvasHeight

    updateChartDimensions(chart, _width, _height, padding)

    if (tooltip) {
      updateSize(tooltip.canvas, tooltip.ctx, chart.dpr, _width, _height)
    }
    if (brush) {
      brush.updateWidth(_width)
    }
    if (drawer) {
      updateSize(drawer.canvas, drawer.ctx, chart.dpr, _width, _height)
      drawer.redraw()
    }

    chart.redraw()
  }
</script>

<div class="chart" bind:clientWidth={width} bind:clientHeight={height}>
  <canvas bind:this={canvas} />
  {#if chart}
    <slot />
  {/if}
</div>

<style>
  .chart {
    flex: 1;
    position: relative;
    line-height: 0;
    min-height: 0;
    max-height: 100%;
  }
</style>

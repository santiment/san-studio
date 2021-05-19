<script lang="ts">
  import { onDestroy } from 'svelte'
  import {
    initTooltip,
    drawTooltip,
    drawHoverLineX,
    drawHoverLineY,
    drawValueBubbleX,
    drawValueBubbleY,
  } from 'san-chart/tooltip'
  import {
    handleMove as handlePointEvent,
    getHoveredIndex,
  } from 'san-chart/events'
  import { logScale, valueByY, valueByLogY } from 'san-chart/scales'
  import { getTooltipSynchronizer } from './context'
  import { clearCtx, getDateDayMonthYear } from '../utils'
  import { getChart } from '../context'
  import { getMetricAxisFormatter, MULTI_AXIS_WIDTH } from '../Axes/utils'

  export let axesMetricKeys = []
  export let metricSettings

  const tooltipSynchronizer = getTooltipSynchronizer()
  const chart = getChart()
  const { tooltip } = initTooltip(chart)
  const { canvas, ctx } = tooltip

  chart.drawTooltip = (point, y: number) => plotTooltip(chart, point, y)
  if (tooltipSynchronizer) tooltipSynchronizer.add(chart)

  $: chart.tooltipKey = axesMetricKeys[0]

  canvas.onmouseleave = () => {
    clearCtx(chart, ctx)
    if (tooltipSynchronizer) tooltipSynchronizer.sync(chart)
  }

  canvas.onmousemove = handlePointEvent(chart, (point, e) => {
    if (!point) return

    const { top, bottom } = chart
    const { offsetY } = e
    const y = offsetY < top ? top : offsetY > bottom ? bottom : offsetY

    plotTooltip(chart, point, y)
    if (tooltipSynchronizer) {
      tooltipSynchronizer.sync(chart, point.value, y)
    }
  })

  canvas.onmousedown = handlePointEvent(chart, (point) => {
    if (!point) return
    // if (chart.isDrawing) return
  })

  function marker(ctx, key, _, x, y) {
    ctx.fillStyle = chart.colors[key]
    ctx.fillRect(x, y, 8, 2)
  }

  function plotTooltip(chart, point, y: number) {
    clearCtx(chart, ctx)
    const { theme, scale, minMaxes } = chart
    const { x, value: datetime } = point

    drawHoverLineX(chart, x, theme.hoverLine, 5)
    drawHoverLineY(chart, y, theme.hoverLine, 0, 20)

    const xValueFormatted = getDateDayMonthYear(datetime)
    drawValueBubbleX(chart, ctx, xValueFormatted, x, theme.bubbles)

    const isLogScale = scale === logScale
    let offset = 20
    axesMetricKeys.forEach((metricKey) => {
      const minMax = minMaxes[metricKey]
      if (!minMax) return
      const { min, max } = minMax
      const valueScaler = isLogScale ? valueByLogY : valueByY
      const formatter = getMetricAxisFormatter(metricSettings, metricKey)
      const value = formatter(valueScaler(chart, y, min, max))

      drawValueBubbleY(chart, ctx, value, y, theme.bubbles, offset)

      offset += MULTI_AXIS_WIDTH
    })
    // chart.syncTooltips(point.value)
    // plotTooltip(chart, marker, point, e)

    drawTooltip(ctx, point, metricSettings, marker, theme.tooltip)
  }

  onDestroy(() => {
    if (tooltipSynchronizer) tooltipSynchronizer.delete(chart)
  })
</script>

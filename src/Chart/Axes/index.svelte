<script lang="ts">
  import { drawXAxisTicks, drawAxisLine, drawYAxisTicks } from 'san-chart/axes'
  import { drawValueBubbleY } from 'san-chart/tooltip'
  import {
    Y_MARGIN,
    MULTI_AXIS_WIDTH,
    getPadding,
    getBubbleTheme,
    getMetricAxisFormatter,
  } from './utils'
  import { getChart } from '../context'
  import {
    isDayInterval,
    getDateHoursMinutes,
    getDateDayMonthYear,
  } from '../utils'

  const chart = getChart()

  export let xTicks = 10
  export let yTicks = 8
  export let metricSettings
  export let axesMetricKeys: string[]

  chart.rightAxisMargin = Y_MARGIN
  $: {
    chart.xAxesTicks = xTicks
    chart.yAxesTicks = yTicks
    chart.axesMetricKeys = axesMetricKeys
  }
  $: chart.setPadding(getPadding(chart, axesMetricKeys))

  chart.plotManager.set('axes', (chart, scale) => {
    const { ctx, theme, left, bottom, right, rightAxisMargin } = chart

    ctx.fillStyle = theme.ticks.color
    ctx.font = theme.ticks.font

    drawAxisLine(ctx, theme.axes, left, bottom, right + rightAxisMargin, bottom)
    plotAxes(chart)

    const formatter = isDayInterval(chart)
      ? getDateHoursMinutes
      : getDateDayMonthYear
    drawXAxisTicks(chart, formatter, scale, xTicks)
  })

  function plotAxes(chart) {
    const { ctx, colors, theme, scale } = chart
    const { right, top, bottom, rightAxisMargin } = chart
    const LastMetricPoint = getLastMetricPoint(chart, null)
    ctx.textAlign = 'left'

    let lastValueOffset = rightAxisMargin
    let offset = right + rightAxisMargin

    axesMetricKeys.forEach((key) => {
      const color = colors[key]
      const point = LastMetricPoint[key]
      if (!point) return

      const { y } = point
      drawAxisLine(ctx, color, offset, top, offset, bottom)

      const formatter = getMetricAxisFormatter(metricSettings, key)
      drawYAxisTicks(chart, key, formatter, scale, offset + 6, yTicks)

      const value = formatter(point.value)
      const bubbleTheme = getBubbleTheme(theme.bubbles, color)
      drawValueBubbleY(chart, ctx, value, y, bubbleTheme, lastValueOffset)

      offset += MULTI_AXIS_WIDTH
      lastValueOffset += MULTI_AXIS_WIDTH
    })
  }

  function getLastMetricPoint(chart, domain) {
    const { points } = chart
    const LastMetricPoint = {}
    let unfoundMetricKeys = axesMetricKeys.slice()

    for (let i = points.length - 1; i >= 0 && unfoundMetricKeys.length; i--) {
      const point = points[i]

      for (let j = unfoundMetricKeys.length - 1; j >= 0; j--) {
        const metricKey = unfoundMetricKeys[j]
        const metricPoint = point[metricKey]

        if (metricPoint && metricPoint.value) {
          LastMetricPoint[metricKey] = metricPoint
          unfoundMetricKeys.splice(j, 1)
        }
      }
    }

    return LastMetricPoint
  }
</script>

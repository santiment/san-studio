<script lang="ts">
  import { drawXAxisTicks, drawAxisLine, drawYAxisTicks } from 'san-chart/axes'
  import { drawValueBubbleY } from 'san-chart/tooltip'
  import {
    MULTI_AXIS_WIDTH,
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
  const Y_MARGIN = 20

  export let xTicks = 10
  export let yTicks = 8
  export let metricSettings
  export let axesMetricKeys: string[]

  $: {
    chart.xAxesTicks = xTicks
    chart.yAxesTicks = yTicks
    chart.axesMetricKeys = axesMetricKeys
  }
  $: chart.setPadding({
    ...chart.padding,
    bottom: 70,
    right: axesMetricKeys.length * MULTI_AXIS_WIDTH + Y_MARGIN,
  })

  chart.plotManager.set('axes', (chart, scale) => {
    const { ctx, theme } = chart

    ctx.fillStyle = theme.ticks.color
    ctx.font = theme.ticks.font

    plotAxes()

    const formatter = isDayInterval(chart)
      ? getDateHoursMinutes
      : getDateDayMonthYear
    drawXAxisTicks(chart, formatter, scale, xTicks)
  })

  function plotAxes() {
    const { ctx, colors, theme, scale } = chart
    const { right, top, bottom } = chart
    const LastMetricPoint = getLastMetricPoint(chart, null)
    ctx.textAlign = 'left'

    let lastValueOffset = Y_MARGIN
    let offset = right + Y_MARGIN

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

    // for (let i = axesMetricKeys.length - 1; i >= 0; i--) {
    //     const domainDependencies = domain[axesMetricKeys[i]]
    //     if (domainDependencies) {
    //         unfoundMetricKeys = unfoundMetricKeys.concat(domainDependencies)
    //     }
    // }

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

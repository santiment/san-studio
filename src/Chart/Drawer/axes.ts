import { logScale, valueByY, valueByLogY } from 'san-chart/scales'
import { drawValueBubbleY, drawValueBubbleX } from 'san-chart/tooltip'
import { getDateDayMonthYear, getDateHoursMinutes, isDayInterval, yBubbleFormatter } from '../utils'
import { MULTI_AXIS_WIDTH } from '../Axes/utils'

export function newDatetimeBubbleDrawer(chart: SAN.Charts.Chart, ctx: CanvasRenderingContext2D) {
  const xBubbleFormatter = isDayInterval(chart) ? getDateHoursMinutes : getDateDayMonthYear

  const theme = chart.theme.drawer
  return (x: number, date: number) =>
    date && drawValueBubbleX(chart as any, ctx, xBubbleFormatter(date), x, theme)
}

export function newValueBubbleDrawer(chart: SAN.Charts.Chart, ctx: CanvasRenderingContext2D) {
  const scaleValue = chart.scale === logScale ? valueByLogY : valueByY
  const theme = chart.theme.drawer

  return (metric: string, y: number, offset: number) => {
    const { minMaxes, metricSettings } = chart
    const minMax = minMaxes[metric]
    if (!minMax) return

    const { min, max } = minMax
    const metricDisplayer = metricSettings[metric]
    const formatter = metricDisplayer?.axisFormatter || yBubbleFormatter
    const formatted = formatter(scaleValue(chart, y, min, max))
    drawValueBubbleY(chart as any, ctx, formatted, y, theme, offset)
  }
}

export function newDrawingAxesPainter(chart: SAN.Charts.Chart, drawing: SAN.Charts.Drawing) {
  const { drawer, right, bottom, rightAxisMargin = 20 } = chart
  const { ctx } = drawer

  const drawDatetimeBubble = newDatetimeBubbleDrawer(chart, ctx)
  const drawValueBubble = newValueBubbleDrawer(chart, ctx)

  let offset = rightAxisMargin
  return () => {
    const { axesMetricKeys } = chart
    const { absCoor, relCoor } = drawing
    const { length } = absCoor

    ctx.save()
    for (let i = 0; i < length; i += 2) {
      drawDatetimeBubble(absCoor[i], relCoor[i])
      const y = absCoor[i + 1]

      for (let j = 0, len = axesMetricKeys.length; j < len; j++) {
        drawValueBubble(axesMetricKeys[j], y, offset)
        offset += MULTI_AXIS_WIDTH
      }
      offset = rightAxisMargin
    }
    ctx.clearRect(right, bottom, 200, 200)
    ctx.restore()
  }
}

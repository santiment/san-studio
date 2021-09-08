import { linearScale, logScale, valueByY, valueByLogY } from 'san-chart/scales'
import { drawValueBubbleY, drawValueBubbleX } from 'san-chart/tooltip'
import {
  clearCtx,
  getDateDayMonthYear,
  getDateHoursMinutes,
  yBubbleFormatter,
  isDayInterval,
  linearDatetimeScale,
} from '../utils'
import { Color } from '../theme'

export const LINE_WIDTH = 2
export const HandleType = {
  LEFT: 1,
  RIGHT: 2,
  MOVE: 3,
}

export const newLine = (x, y) => ({
  color: Color.baliHai,
  absCoor: [x, y, x, y],
})

export const getPressedHandleType = (ctx, [handle1, handle2], x, y) =>
  ctx.isPointInPath(handle1, x, y)
    ? HandleType.LEFT
    : ctx.isPointInPath(handle2, x, y)
    ? HandleType.RIGHT
    : HandleType.MOVE

export function getLineHandle(ctx, x, y, bgColor, strokeColor) {
  const handle = new Path2D()

  ctx.lineWidth = LINE_WIDTH
  ctx.strokeStyle = strokeColor
  ctx.fillStyle = bgColor
  handle.arc(x, y, 6, 0, 2 * Math.PI)

  return handle
}

export function checkIsOnStrokeArea(ctx, shape, x, y) {
  if (ctx.isPointInStroke(shape, x, y)) return true

  for (let i = 1; i < 8; i++) {
    if (
      ctx.isPointInStroke(shape, x - i, y - i) ||
      ctx.isPointInStroke(shape, x - i, y + i) ||
      ctx.isPointInStroke(shape, x + i, y - i) ||
      ctx.isPointInStroke(shape, x + i, y + i)
    ) {
      return true
    }
  }

  return false
}
export const checkIsLineHovered = (ctx, { shape, handles }, x, y) =>
  checkIsOnStrokeArea(ctx, shape, x, y) ||
  ctx.isPointInPath(handles[0], x, y) ||
  ctx.isPointInPath(handles[1], x, y)

function datetimeRelativeScaler(chart, width) {
  const { data, left } = chart
  const firstDatetime = data[0].datetime
  const lastDatetime = data[data.length - 1].datetime
  const factor = (lastDatetime - firstDatetime) / width

  return (x) => factor * (x - left) + firstDatetime
}

export function absoluteToRelativeCoordinates(
  chart,
  drawing,
): [number, number, number, number] {
  const { width, drawingKey, minMaxes, scale } = chart
  if (!minMaxes || !minMaxes[drawingKey]) return drawing.relCoor || []
  const { min, max } = minMaxes[drawingKey]

  const [x1, y1, x2, y2] = drawing.absCoor

  const scaleDatetime = datetimeRelativeScaler(chart, width)
  const scaleValue = scale === logScale ? valueByLogY : valueByY

  return [
    Math.floor(scaleDatetime(x1)),
    scaleValue(chart, y1, min, max),
    Math.floor(scaleDatetime(x2)),
    scaleValue(chart, y2, min, max),
  ]
}

export function relativeToAbsoluteCoordinates(
  chart,
  drawing,
): [number, number, number, number] {
  const { drawingKey, minMaxes } = chart
  if (!minMaxes[drawingKey]) return drawing.absCoor || []
  const { min, max } = minMaxes[drawingKey]

  const [x1, y1, x2, y2] = drawing.relCoor

  const scaleX = linearDatetimeScale(chart)
  const scaleY = linearScale(chart, min, max)

  return [scaleX(x1), scaleY(y1), scaleX(x2), scaleY(y2)]
}

export function paintDrawings(chart) {
  const { drawer, right, bottom, left } = chart
  const { ctx, drawings, mouseover, selected } = drawer

  clearCtx(chart, ctx)

  for (let i = 0; i < drawings.length; i++) {
    const drawing = drawings[i]
    if (!drawing.absCoor) continue

    drawing.shape = new Path2D()

    const [x1, y1, x2, y2] = drawing.absCoor
    const { shape, color, width = LINE_WIDTH } = drawing

    ctx.save()

    ctx.lineWidth = width
    ctx.strokeStyle = color

    shape.moveTo(x1, y1)
    shape.lineTo(x2, y2)
    ctx.stroke(shape)

    const handle1 = getLineHandle(ctx, x1, y1, chart.theme.bg, color)
    const handle2 = getLineHandle(ctx, x2, y2, chart.theme.bg, color)
    drawing.handles = [handle1, handle2]

    if (drawing === mouseover || drawing === selected) {
      ctx.fill(handle1)
      ctx.stroke(handle1)
      ctx.fill(handle2)
      ctx.stroke(handle2)
    }

    ctx.restore()
  }

  ctx.clearRect(left, 0, -200, bottom)
  ctx.clearRect(right, 0, 200, bottom)
  ctx.clearRect(0, bottom, right, 200)
}

function drawMetricValueBubble(chart, theme, metricKey, y1, y2, offset) {
  const { drawer, scale, minMaxes, metricSettings } = chart
  const metricDisplayer = metricSettings[metricKey]
  const { ctx } = drawer

  const minMax = minMaxes[metricKey]
  if (!minMax) return

  const { min, max } = minMax
  const scaleValue = scale === logScale ? valueByLogY : valueByY

  const formatter = metricDisplayer?.axisFormatter || yBubbleFormatter
  const formattedY1Value = formatter(scaleValue(chart, y1, min, max))
  const formattedY2Value = formatter(scaleValue(chart, y2, min, max))

  drawValueBubbleY(chart, ctx, formattedY1Value, y1, theme, offset)
  drawValueBubbleY(chart, ctx, formattedY2Value, y2, theme, offset)
}

export function paintDrawingAxes(chart) {
  const { drawer, axesMetricKeys, right, bottom, rightAxisMargin = 20 } = chart
  const { ctx, selected: drawing } = drawer
  if (!drawing || !drawing.absCoor) return

  const [x1, y1, x2, y2] = drawing.absCoor

  const xBubbleFormatter = isDayInterval(chart)
    ? getDateHoursMinutes
    : getDateDayMonthYear

  const theme = chart.theme.drawer

  // eslint-disable-next-line
  const [x1Date, _, x2Date, __] = absoluteToRelativeCoordinates(chart, drawing)

  ctx.save()

  drawValueBubbleX(chart, ctx, xBubbleFormatter(x1Date), x1, theme)
  drawValueBubbleX(chart, ctx, xBubbleFormatter(x2Date), x2, theme)

  let offset = rightAxisMargin
  axesMetricKeys.forEach((metricKey) => {
    drawMetricValueBubble(chart, theme, metricKey, y1, y2, offset)
    offset += 50
  })

  ctx.clearRect(right, bottom, 200, 200)

  ctx.restore()
}

import { handleMove as handlePointEvent } from 'san-chart/events'
import { drawValueBubbleX } from 'san-chart/tooltip'
import { clearCtx, getDateDayMonthYear } from '../utils'

export function onSelection(
  chart: Studio.Chart,
  canvas,
  onPoinClick,
  onRangeSelect,
) {
  canvas.onmousedown = handlePointEvent(chart, (point) => {
    if (!point || chart.isDrawing) return
    const startX = point.x
    let endPoint = point
    let endY = 0

    chart.isSelecting = true
    window.addEventListener('mouseup', onMouseUp)
    chart.drawSelection = (x: number, y: number, newPoint) => {
      if (chart.isDrawing) return cleanUp()

      plotRangeSelection(chart, x, startX - x, point)
      endY = y
      endPoint = newPoint

      return point
    }

    function onMouseUp(e: MouseEvent) {
      cleanUp()
      if (endPoint === point) {
        // NOTE: When the drawing is finished, last mouseup still will be triggered [@vanguard | May 25, 2021]
        if (!chart.isDrawing && onPoinClick) onPoinClick(point, e)
        return
      }

      clearCtx(chart, chart.tooltip.ctx)
      chart.drawTooltip?.(endPoint, endY)
      onRangeSelect?.(point, endPoint, e)
    }

    function cleanUp() {
      chart.drawSelection = undefined
      chart.isSelecting = false
      window.removeEventListener('mouseup', onMouseUp)
    }
  })
}

function plotRangeSelection(chart, left, width, startPoint) {
  const { tooltip, top, height, theme } = chart
  const { ctx } = tooltip

  ctx.save()
  const { x, value: datetime } = startPoint
  const xValueFormatted = getDateDayMonthYear(datetime)
  drawValueBubbleX(chart, ctx, xValueFormatted, x, theme.bubbles)

  ctx.fillStyle = '#9faac435'
  ctx.fillRect(left, top, width, height)

  ctx.restore()
}

import { handleMove as handlePointEvent } from 'san-chart/events'
import { clearCtx } from '../utils'

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

    window.addEventListener('mouseup', onMouseUp)
    chart.drawSelection = (x: number, y: number, point) => {
      if (chart.isDrawing) return cleanUp()

      plotRangeSelection(chart, x, startX - x)
      endY = y
      endPoint = point
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
      window.removeEventListener('mouseup', onMouseUp)
    }
  })
}

function plotRangeSelection(chart, left, width) {
  const { tooltip, top, height } = chart
  const { ctx } = tooltip

  ctx.save()
  ctx.fillStyle = '#9faac435'
  ctx.fillRect(left, top, width, height)
  ctx.restore()
}

import {
  handleMove as handlePointEvent,
  getHoveredIndex,
} from 'san-chart/events'
import { clearCtx } from '../utils'

export function onSelection(chart: Studio.Chart, canvas, onRangeSelect) {
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
      if (endPoint === point) return

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

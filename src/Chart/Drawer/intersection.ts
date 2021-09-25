import type { Chart } from './drawer'
import type { Sticker } from './stickers'

export function getEventCoordinates(e: MouseEvent): [number, number] {
  const { offsetX, offsetY, target } = e
  const { offsetLeft, offsetTop } = target as HTMLElement
  return [offsetX + offsetLeft, offsetY + offsetTop]
}

const DrawingIntersectionChecker = {
  sticker: checkStickerIntersection,
}

export function checkIntersection(
  chart: Chart,
  mouseXY: [number, number],
  e: MouseEvent,
) {
  const { dpr } = chart
  const { ctx, drawings } = chart.drawer

  for (let i = 0, len = drawings.length; i < len; i++) {
    const drawing = drawings[i]
    const checker = DrawingIntersectionChecker[drawing.type || 'line']
    if (checker?.(ctx, drawing, mouseXY, dpr, e)) return drawing
  }
}

function checkStickerIntersection(
  ctx: CanvasRenderingContext2D,
  drawing: Sticker,
  mouseXY: [number, number],
  dpr: number,
) {
  const { hitbox, handlers } = drawing

  const x = mouseXY[0] * dpr
  const y = mouseXY[1] * dpr

  if (ctx.isPointInPath(hitbox, x, y)) return true
  for (let i = 0; i < 4; i++) {
    if (ctx.isPointInPath(handlers[i], x, y)) return true
  }

  return false
}

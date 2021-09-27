import type { Chart, Drawing } from './drawer'
import type { Sticker } from './drawings/stickers'
import { checkLineIsHovered } from './drawings/line'

const DrawingIsHoveredChecker = {
  line: checkLineIsHovered,
  sticker: checkStickerIsHovered,
} as Record<
  any,
  | undefined
  | ((
      ctx: CanvasRenderingContext2D,
      drawing: Drawing,
      mouseXY: [number, number],
      dpr: number,
      e: MouseEvent,
    ) => boolean)
>

export function checkIsHovered(
  chart: Chart,
  mouseXY: [number, number],
  e: MouseEvent,
) {
  const { dpr } = chart
  const { ctx, drawings } = chart.drawer

  for (let i = 0, len = drawings.length; i < len; i++) {
    const drawing = drawings[i]
    const checker = DrawingIsHoveredChecker[drawing.type]
    if (checker?.(ctx, drawing, mouseXY, dpr, e)) return drawing
  }
}

function checkStickerIsHovered(
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

import type { Chart, Drawer, Drawing } from './drawer'
import { paintSticker, updateSticker } from './stickers'
import { clearCtx } from '../utils'

const DrawingPainter = {
  sticker: paintSticker,
}

export function paintDrawings(chart: Chart) {
  const { drawer, right, bottom, left } = chart
  const { ctx, drawings, minMax } = drawer

  if (!minMax) return

  clearCtx(chart, ctx)

  for (let i = 0, len = drawings.length; i < len; i++) {
    const drawing = drawings[i]
    const painter = DrawingPainter[drawing.type || 'line']
    painter?.(chart, drawing)
  }

  ctx.clearRect(left, 0, -200, bottom)
  ctx.clearRect(right, 0, 200, bottom)
  ctx.clearRect(0, bottom, right, 200)
}

const DrawingUpdater = {
  sticker: updateSticker,
} as Record<any, undefined | ((drawer: Drawer, drawing: Drawing) => void)>

export const getDrawingUpdater = ({ type = 'line' }: Drawing) =>
  DrawingUpdater[type]

export function setupDrawings(drawer: Drawer) {
  const { drawings } = drawer
  console.log('new min max')

  for (let i = 0, len = drawings.length; i < len; i++) {
    const drawing = drawings[i]
    getDrawingUpdater(drawing)?.(drawer, drawing)
  }
}

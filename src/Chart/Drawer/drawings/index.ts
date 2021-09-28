import type { Chart, Drawer, Drawing } from '../drawer'
import { paintLine, updateLine } from './line'
import { paintSticker, updateSticker } from './stickers'
import {
  ratioToAbsoluteCoordinates,
  absoluteToRatioCoordinates,
} from '../coordinates'
import { clearCtx } from '../../utils'

const DrawingPainter = {
  line: paintLine,
  sticker: paintSticker,
} as Record<any, undefined | ((chart: Chart, drawing: Drawing) => void)>

const DrawingUpdater = {
  line: updateLine,
  sticker: updateSticker,
} as Record<any, undefined | ((drawer: Drawer, drawing: Drawing) => void)>

export const getDrawingUpdater = ({ type }: Drawing) => DrawingUpdater[type]

export function paintDrawings(chart: Chart) {
  const { drawer, right, bottom, left, width, height } = chart
  const { ctx, drawings, minMax } = drawer

  if (!minMax) return

  clearCtx(chart, ctx)

  for (let i = 0, len = drawings.length; i < len; i++) {
    const drawing = drawings[i]
    const { relCoor, absCoor, ratioCoor } = drawing

    if (absCoor.length === 0) {
      if (ratioCoor.length) {
        ratioToAbsoluteCoordinates(ratioCoor, absCoor, width, height)
        drawer.updateRelativeByAbsoluteCoordinates(absCoor, relCoor)
      } else {
        drawer.updateAbsoluteByRelativeCoordinates(relCoor, absCoor)
        absoluteToRatioCoordinates(absCoor, ratioCoor, width, height)
      }
      getDrawingUpdater(drawing)?.(drawer, drawing)
    }

    const painter = DrawingPainter[drawing.type]
    painter?.(chart, drawing)
  }

  ctx.clearRect(left, 0, -200, bottom)
  ctx.clearRect(right, 0, 200, bottom)
  ctx.clearRect(0, bottom, right, 200)
}

export function setupDrawings({ drawer }: Chart) {
  const { drawings } = drawer
  for (let i = 0, len = drawings.length; i < len; i++) {
    const drawing = drawings[i]
    getDrawingUpdater(drawing)?.(drawer, drawing)
  }
}

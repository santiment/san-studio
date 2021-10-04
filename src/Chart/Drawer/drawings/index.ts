import type { Chart, Drawer, Drawing, DrawingTypes } from '../drawer'
import { paintLine, updateLine } from './line'
import { paintEmoji, updateEmoji } from './emoji'
import { paintNote, updateNote } from './note'
import {
  ratioToAbsoluteCoordinates,
  absoluteToRatioCoordinates,
} from '../coordinates'
import { clearCtx } from '../../utils'

const DrawingPainter = {
  line: paintLine,
  emoji: paintEmoji,
  note: paintNote,
} as Record<
  DrawingTypes,
  undefined | ((chart: Chart, drawing: Drawing) => void)
>

const DrawingUpdater = {
  line: updateLine,
  emoji: updateEmoji,
  note: updateNote,
} as Record<
  DrawingTypes,
  undefined | ((drawer: Drawer, drawing: Drawing) => void)
>

export const getDrawingUpdater = ({ type }: Drawing) => DrawingUpdater[type]

export function paintDrawings(chart: Chart) {
  const { drawer, right, bottom, left } = chart
  const { ctx, minMax } = drawer

  if (!minMax) return

  clearCtx(chart, ctx)

  drawDrawings(chart)

  ctx.clearRect(left, 0, -200, bottom)
  ctx.clearRect(right, 0, 200, bottom)
  ctx.clearRect(0, bottom, right, 200)
}

export function drawDrawings(chart: Chart) {
  const { drawer, width, height } = chart
  const { drawings } = drawer

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
}

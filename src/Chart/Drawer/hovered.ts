import type { Chart, Drawing } from './drawer'
import { checkLineIsHovered, paintLineHover } from './drawings/line'
import { checkStickerIsHovered, paintStickerHover } from './drawings/stickers'
import { getEventCoordinates } from './utils'

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

type HoverPainter = (chart: Chart, drawing: Drawing) => void
const DrawingHoverPainter = {
  line: paintLineHover,
  sticker: paintStickerHover,
} as Record<any, undefined | HoverPainter>

export const getDrawingHoverPainter = ({ type }: Drawing) =>
  DrawingHoverPainter[type]

export function newMouseHoverHandler(
  chart: Chart,
  setHovered: (drawing?: Drawing) => void,
) {
  const { drawer } = chart

  function onMouseMove(e: MouseEvent) {
    if (!drawer.minMax) return

    const mouseXY = getEventCoordinates(e)
    const hovered = checkIsHovered(chart, mouseXY, e)

    if (hovered === drawer.hovered) return

    setHovered(hovered)
    drawer.redraw()

    if (!hovered) return

    getDrawingHoverPainter(hovered)?.(chart, hovered)
  }

  return onMouseMove
}

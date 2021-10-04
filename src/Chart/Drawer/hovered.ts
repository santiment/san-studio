import type { Chart, DrawingTypes, Drawing } from './drawer'
import { checkLineIsHovered, paintLineHover } from './drawings/line'
import { checkEmojiIsHovered, paintEmojiHover } from './drawings/emoji'
import { checkNoteIsHovered, paintNoteHover } from './drawings/note'
import { getEventCoordinates } from './utils'

const DrawingIsHoveredChecker = {
  line: checkLineIsHovered,
  emoji: checkEmojiIsHovered,
  note: checkNoteIsHovered,
} as Record<
  DrawingTypes,
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

  for (let i = drawings.length - 1; i > -1; i--) {
    const drawing = drawings[i]
    const checker = DrawingIsHoveredChecker[drawing.type]
    if (checker?.(ctx, drawing, mouseXY, dpr, e)) return drawing
  }
}

type HoverPainter = (chart: Chart, drawing: Drawing) => void
const DrawingHoverPainter = {
  line: paintLineHover,
  emoji: paintEmojiHover,
  note: paintNoteHover,
} as Record<DrawingTypes, undefined | HoverPainter>

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

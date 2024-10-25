import { checkLineIsHovered, paintLineHover } from './drawings/line'
import { checkEmojiIsHovered, paintEmojiHover } from './drawings/emoji'
import { checkNoteIsHovered, paintNoteHover } from './drawings/note'
import { getEventCoordinates } from './utils'
import { checkHorizontalRayIsHovered, paintHorizontalRayHover } from './drawings/horizontalRay'
import { checkVerticalRayIsHovered, paintVerticalRayHover } from './drawings/verticalRay'

const DrawingIsHoveredChecker = {
  line: checkLineIsHovered,
  hray: checkHorizontalRayIsHovered,
  vray: checkVerticalRayIsHovered,
  emoji: checkEmojiIsHovered,
  note: checkNoteIsHovered,
} as Record<
  SAN.Charts.DrawingTypes,
  | undefined
  | ((
      ctx: CanvasRenderingContext2D,
      drawing: SAN.Charts.Drawing,
      mouseXY: [number, number],
      dpr: number,
      e: MouseEvent,
    ) => boolean)
>

export function checkIsHovered(chart: SAN.Charts.Chart, mouseXY: [number, number], e: MouseEvent) {
  const { dpr } = chart
  const { ctx, drawings } = chart.drawer

  for (let i = drawings.length - 1; i > -1; i--) {
    const drawing = drawings[i]
    const checker = DrawingIsHoveredChecker[drawing.type]
    if (checker?.(ctx, drawing, mouseXY, dpr, e)) return drawing
  }
}

type HoverPainter = (chart: SAN.Charts.Chart, drawing: SAN.Charts.Drawing) => void
const DrawingHoverPainter = {
  line: paintLineHover,
  hray: paintHorizontalRayHover,
  vray: paintVerticalRayHover,
  emoji: paintEmojiHover,
  note: paintNoteHover,
} as Record<SAN.Charts.DrawingTypes, undefined | HoverPainter>

export const getDrawingHoverPainter = ({ type }: SAN.Charts.Drawing) => DrawingHoverPainter[type]

export function newMouseHoverHandler(
  chart: SAN.Charts.Chart,
  setHovered: (drawing?: SAN.Charts.Drawing) => void,
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

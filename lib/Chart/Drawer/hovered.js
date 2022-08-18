import { checkLineIsHovered, paintLineHover } from './drawings/line'
import { checkEmojiIsHovered, paintEmojiHover } from './drawings/emoji'
import { checkNoteIsHovered, paintNoteHover } from './drawings/note'
import { getEventCoordinates } from './utils'
import { checkHorizontalRayIsHovered, paintHorizontalRayHover } from './drawings/horizontalRay'
const DrawingIsHoveredChecker = {
  line: checkLineIsHovered,
  hray: checkHorizontalRayIsHovered,
  emoji: checkEmojiIsHovered,
  note: checkNoteIsHovered,
}
export function checkIsHovered(chart, mouseXY, e) {
  const { dpr } = chart
  const { ctx, drawings } = chart.drawer
  for (let i = drawings.length - 1; i > -1; i--) {
    const drawing = drawings[i]
    const checker = DrawingIsHoveredChecker[drawing.type]
    if (checker === null || checker === void 0 ? void 0 : checker(ctx, drawing, mouseXY, dpr, e))
      return drawing
  }
}
const DrawingHoverPainter = {
  line: paintLineHover,
  hray: paintHorizontalRayHover,
  emoji: paintEmojiHover,
  note: paintNoteHover,
}
export const getDrawingHoverPainter = ({ type }) => DrawingHoverPainter[type]
export function newMouseHoverHandler(chart, setHovered) {
  const { drawer } = chart
  function onMouseMove(e) {
    var _a
    if (!drawer.minMax) return
    const mouseXY = getEventCoordinates(e)
    const hovered = checkIsHovered(chart, mouseXY, e)
    if (hovered === drawer.hovered) return
    setHovered(hovered)
    drawer.redraw()
    if (!hovered) return
    ;(_a = getDrawingHoverPainter(hovered)) === null || _a === void 0 ? void 0 : _a(chart, hovered)
  }
  return onMouseMove
}
//# sourceMappingURL=hovered.js.map

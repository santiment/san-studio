import { getEventCoordinates } from './utils'
import { absoluteToRatioCoordinates } from './coordinates'
import { getDrawingUpdater } from './drawings'
import { getLineDragData, lineDragModifier } from './drawings/line'
import { getEmojiDragData, emojiDragModifier } from './drawings/emoji'
import { noteDragModifier, handleNoteDoubleClick } from './drawings/note'
import { horizontalRayDragModifier } from './drawings/horizontalRay'
const DrawingDoubleClickHandler = {
  note: handleNoteDoubleClick,
}
export function newDoubleClickHandler(chart, onDrawingModified) {
  const { drawer } = chart
  return function onDoubleClick() {
    var _a
    const { selected } = drawer
    if (!selected) return
    ;(_a = DrawingDoubleClickHandler[selected.type]) === null || _a === void 0
      ? void 0
      : _a.call(DrawingDoubleClickHandler, drawer, selected, onDrawingModified)
  }
}
export function newDrawingSelectHandler(chart, controller) {
  const { canvas, drawer, dpr } = chart
  const parent = canvas.parentNode
  return function onMouseDown(e) {
    var _a
    const { hovered, selected } = drawer
    if (!hovered) {
      if (selected) {
        controller.selectDrawing()
        drawer.redraw()
      }
      return
    }
    controller.selectDrawing(hovered)
    controller.startDrawing()
    if (selected && selected !== hovered) drawer.redraw()
    else (_a = drawer.drawSelection) === null || _a === void 0 ? void 0 : _a.call(drawer)
    const initialRatioCoor = hovered.ratioCoor.slice()
    const wasDragged = { value: false, data: [] }
    const onDrawingDrag = newDrawingDragHandler(
      chart,
      hovered,
      getEventCoordinates(e),
      dpr,
      wasDragged,
    )
    parent.addEventListener('mousemove', onDrawingDrag)
    parent.addEventListener('mouseup', onMouseUp)
    function onMouseUp() {
      parent.removeEventListener('mousemove', onDrawingDrag)
      parent.removeEventListener('mouseup', onMouseUp)
      controller.stopDrawing()
      if (wasDragged.value) {
        controller.onDrawingDragEnd(hovered, initialRatioCoor, wasDragged.data)
      }
    }
  }
}
const DrawingDragDataGetter = {
  line: getLineDragData,
  emoji: getEmojiDragData,
  hray: undefined,
  note: undefined,
}
const DrawingDragModifier = {
  line: lineDragModifier,
  emoji: emojiDragModifier,
  note: noteDragModifier,
  hray: horizontalRayDragModifier,
}
function newDrawingDragHandler(chart, drawing, [startX, startY], dpr, wasDragged) {
  const { drawer, width, height } = chart
  const { type } = drawing
  const initialAbsCoor = drawing.absCoor.slice()
  const updater = getDrawingUpdater(drawing)
  const getDragData = DrawingDragDataGetter[type]
  const dragModifier = DrawingDragModifier[type]
  if (!(updater && dragModifier)) return
  const { ctx, updateRelativeByAbsoluteCoordinates } = drawer
  const dragData =
    getDragData === null || getDragData === void 0
      ? void 0
      : getDragData(ctx, drawing, startX * dpr, startY * dpr)
  const { absCoor, relCoor, ratioCoor } = drawing
  return (e) => {
    const [moveX, moveY] = getEventCoordinates(e)
    const diffX = moveX - startX
    const diffY = moveY - startY
    dragModifier(drawing, initialAbsCoor, dragData, diffX, diffY, e)
    updateRelativeByAbsoluteCoordinates(absCoor, relCoor)
    absoluteToRatioCoordinates(absCoor, ratioCoor, width, height)
    updater(chart, drawing)
    wasDragged.value = true
    wasDragged.data = dragData
    drawer.redraw()
  }
}
export const newDrawingDeleteHandler =
  (drawer) =>
  ({ key }) => {
    if (key !== 'Backspace' || !drawer.selected) return
    drawer.deleteDrawing(drawer.selected)
  }
//# sourceMappingURL=selectAndDrag.js.map

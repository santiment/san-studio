import type { Chart, Drawer, Drawing } from './drawer'
import { getDrawingUpdater } from './drawings'
import { getLineDragData, lineDragModifier } from './drawings/line'
import { getStickerDragData, stickerDragModifier } from './drawings/stickers'
import { getEventCoordinates } from './utils'

type Controller = {
  selectDrawing: (drawing?: Drawing) => void
  startDrawing: () => void
  stopDrawing: () => void
  onDrawingDragEnd: (drawing: Drawing, oldAbsCoor: Drawing['absCoor']) => void
}

export function newMouseSelectHandler(chart: Chart, controller: Controller) {
  const { canvas, drawer, dpr } = chart
  const parent = canvas.parentNode as HTMLElement

  function onMouseDown(e: MouseEvent) {
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
    else drawer.drawSelection?.()

    const initialAbsCoor = hovered.absCoor.slice()
    const wasDragged = { value: false }
    const onDrawingDrag = newDrawingDragHandler(
      chart,
      hovered as any,
      initialAbsCoor,
      getEventCoordinates(e),
      dpr,
      wasDragged,
    )

    parent.addEventListener('mousemove', onDrawingDrag as any)
    parent.addEventListener('mouseup', onMouseUp)
    function onMouseUp() {
      parent.removeEventListener('mousemove', onDrawingDrag as any)
      parent.removeEventListener('mouseup', onMouseUp)
      controller.stopDrawing()
      if (wasDragged.value) {
        controller.onDrawingDragEnd(hovered as Drawing, initialAbsCoor)
      }
    }
  }

  return onMouseDown
  // parent.addEventListener('mousedown', onMouseDown)
  // return () => parent.removeEventListener('mousedown', onMouseDown)
}

type DragDataGetter = (
  ctx: CanvasRenderingContext2D,
  drawing: Drawing,
  x: number,
  y: number,
) => any[]
const DrawingDragDataGetter = {
  line: getLineDragData,
  sticker: getStickerDragData,
} as Record<any, undefined | DragDataGetter>

type DragModifier = (
  drawing: Drawing,
  initialAbsCoor: number[],
  dragData: any[],
  xDiff: number,
  yDiff: number,
  e: MouseEvent,
) => void
const DrawingDragModifier = {
  line: lineDragModifier,
  sticker: stickerDragModifier,
} as Record<any, undefined | DragModifier>

function newDrawingDragHandler(
  chart: Chart,
  drawing: Drawing,
  initialAbsCoor: Drawing['absCoor'],
  [startX, startY]: [number, number],
  dpr: number,
  wasDragged: { value: boolean },
) {
  const { drawer } = chart
  const { type } = drawing

  const updater = getDrawingUpdater(drawing)
  const getDragData = DrawingDragDataGetter[type]
  const dragModifier = DrawingDragModifier[type]

  if (!(updater && getDragData && dragModifier)) return

  const { ctx, updateRelativeByAbsoluteCoordinates } = drawer

  const dragData = getDragData(ctx, drawing, startX * dpr, startY * dpr)
  const { absCoor, relCoor } = drawing

  return (e: MouseEvent) => {
    const [moveX, moveY] = getEventCoordinates(e)
    const diffX = moveX - startX
    const diffY = moveY - startY

    dragModifier(drawing, initialAbsCoor, dragData, diffX, diffY, e)
    updateRelativeByAbsoluteCoordinates(absCoor, relCoor)
    updater(drawer, drawing)

    wasDragged.value = true
    drawer.redraw()
  }
}

export const newDrawingDeleteHandler =
  (drawer: Drawer) =>
  ({ key }: KeyboardEvent) => {
    if (key !== 'Backspace' || !drawer.selected) return
    drawer.deleteDrawing(drawer.selected)
  }

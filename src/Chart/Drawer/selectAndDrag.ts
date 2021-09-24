import type { Chart, Drawer, Drawing } from './drawer'
import { getDrawingUpdater } from './drawer'
import { getEventCoordinates, checkIntersection } from './intersection'
import { getDrawingHoverPainter } from './hovered'
import { getStickerDragData, stickerDragModifier } from './stickers'

type Controller = {
  selectDrawing: (drawing?: Drawing) => void
  onLineDelete: () => void
  startDrawing: () => void
  stopDrawing: () => void
  onDrawingDragEnd: (drawing?: Drawing) => void
}

export function handleMouseSelect(chart: Chart, controller: Controller) {
  const { canvas, drawer, dpr } = chart
  const parent = canvas.parentNode as HTMLElement

  function onMouseDown(e: MouseEvent) {
    const { hovered, selected } = drawer

    if (!hovered) {
      if (selected) {
        window.removeEventListener('keydown', controller.onLineDelete)
        drawer.selected = undefined
        controller.selectDrawing()
        drawer.redraw()
      }
      return
    }

    drawer.selected = hovered
    controller.selectDrawing(hovered)
    controller.startDrawing()
    if (selected && selected !== hovered) drawer.redraw()

    const wasDragged = { value: false }
    const onDrawingDrag = newDrawingDragHandler(
      drawer,
      hovered as any,
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
      if (wasDragged.value) controller.onDrawingDragEnd(hovered)
    }
  }

  parent.addEventListener('mousedown', onMouseDown)
  return () => parent.removeEventListener('mousedown', onMouseDown)
}

type DragDataGetter = (
  ctx: CanvasRenderingContext2D,
  drawing: Drawing,
  x: number,
  y: number,
) => any[]
const DrawingDragDataGetter = {
  sticker: getStickerDragData,
} as Record<any, undefined | DragDataGetter>

type DragModifier = (
  drawing: Drawing,
  initialAbsCoor: number[],
  dragData: any[],
  xDiff: number,
  yDiff: number,
) => void
const DrawingDragModifier = {
  sticker: stickerDragModifier,
} as Record<any, undefined | DragModifier>

function newDrawingDragHandler(
  drawer: Drawer,
  drawing: Drawing,
  [startX, startY]: [number, number],
  dpr: number,
  wasDragged: { value: boolean },
) {
  const { type = 'line' } = drawing

  const updater = getDrawingUpdater(drawing)
  const hoverPainter = getDrawingHoverPainter(drawing)
  const getDragData = DrawingDragDataGetter[type]
  const dragModifier = DrawingDragModifier[type]

  if (!(updater && hoverPainter && getDragData && dragModifier)) return

  const { ctx } = drawer
  const dragData = getDragData(ctx, drawing, startX * dpr, startY * dpr)

  const { absCoor } = drawing
  const initialAbsCoor = absCoor.slice()

  return (e: MouseEvent) => {
    const [moveX, moveY] = getEventCoordinates(e)
    const diffX = moveX - startX
    const diffY = moveY - startY

    dragModifier(drawing, initialAbsCoor, dragData, diffX, diffY)

    updater(drawer, drawing)
    wasDragged.value = true
    drawer.redraw()
    hoverPainter(drawer, drawing)
  }
}

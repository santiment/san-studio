import type { Chart, Drawer, Drawing } from './drawer'
import type { Sticker } from './stickers'
import { getEventCoordinates, checkIntersection } from './intersection'
import { getDrawingHoverPainter } from './hovered'
import { updateSticker } from './stickers'

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

    parent.addEventListener('mousemove', onDrawingDrag)
    parent.addEventListener('mouseup', onMouseUp)
    function onMouseUp() {
      parent.removeEventListener('mousemove', onDrawingDrag)
      parent.removeEventListener('mouseup', onMouseUp)
      controller.stopDrawing()
      if (wasDragged.value) controller.onDrawingDragEnd(hovered)
    }
  }

  parent.addEventListener('mousedown', onMouseDown)
  return () => parent.removeEventListener('mousedown', onMouseDown)
}

function newDrawingDragHandler(
  drawer: Drawer,
  drawing: Sticker,
  [startX, startY]: [number, number],
  dpr: number,
  wasDragged: { value: boolean },
) {
  const startDprX = startX * dpr
  const startDprY = startY * dpr

  const { x, y } = drawing
  return (e: MouseEvent) => {
    const [moveX, moveY] = getEventCoordinates(e)
    const diffX = moveX - startX
    const diffY = moveY - startY

    drawing.x = x + diffX
    drawing.y = y + diffY

    updateSticker(drawer, drawing)
    wasDragged.value = true
    drawer.redraw()
    getDrawingHoverPainter(drawing)?.(drawer, drawing)
  }
}

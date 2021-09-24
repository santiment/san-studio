import type { Chart, Drawer, Drawing } from './drawer'
import type { Sticker } from './stickers'
import { getDrawingUpdater } from './drawer'
import { getEventCoordinates, checkIntersection } from './intersection'
import { getDrawingHoverPainter } from './hovered'

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
  const updater = getDrawingUpdater(drawing)
  const hoverPainter = getDrawingHoverPainter(drawing)

  if (!updater || !hoverPainter) return

  const { ctx } = drawer
  const dragData = getStickerDragData(ctx, drawing, startX * dpr, startY * dpr)

  const { absCoor } = drawing
  const initialAbsCoor = absCoor.slice()

  return (e: MouseEvent) => {
    const [moveX, moveY] = getEventCoordinates(e)
    const diffX = moveX - startX
    const diffY = moveY - startY

    stickerDragModifier(drawing, initialAbsCoor as any, dragData, diffX, diffY)

    updater(drawer, drawing)
    wasDragged.value = true
    drawer.redraw()
    hoverPainter(drawer, drawing)
  }
}

function getStickerDragData(
  ctx: CanvasRenderingContext2D,
  drawing: Sticker,
  x: number,
  y: number,
): [number, boolean, boolean] {
  const { size, handlers } = drawing
  const data: [Sticker['size'], boolean, boolean] = [size, false, false]

  for (let i = 0; i < 4; i++) {
    if (ctx.isPointInPath(handlers[i], x, y)) {
      data[1] = true
      data[2] = i == 0 || i === 2
      break
    }
  }

  return data
}

const MIN_SIZE = 25
const MAX_SIZE = 70
function stickerDragModifier(
  drawing: Sticker,
  initialAbsCoor: Sticker['absCoor'],
  [initialSize, isResize, areLeftHandlers]: [Sticker['size'], boolean, boolean],
  xDiff: number,
  yDiff: number,
) {
  const [x, y] = initialAbsCoor

  if (isResize) {
    const diff = areLeftHandlers ? -xDiff : xDiff
    const size = initialSize + diff
    drawing.size =
      size < MIN_SIZE ? MIN_SIZE : size > MAX_SIZE ? MAX_SIZE : size

    const coorCorrection = (initialSize - drawing.size) / 2
    drawing.absCoor[0] = x + coorCorrection
    drawing.absCoor[1] = y + coorCorrection
    return
  }

  drawing.absCoor[0] = x + xDiff
  drawing.absCoor[1] = y + yDiff
}

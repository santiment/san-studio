import {
  newDrawing,
  newRectHandle,
  checkIsOnStrokeArea,
  getEventCoordinates,
} from '../utils'
import { Color } from '../../theme'

export function newHorizontalRay(y: number) {
  const hray = {
    type: 'hray',
    absCoor: [0, y],
  } as SAN.Charts.HorizontalRay

  return newDrawing(hray)
}

export function paintHorizontalRay(
  chart: SAN.Charts.Chart,
  drawing: SAN.Charts.HorizontalRay,
) {
  const { ctx } = chart.drawer

  ctx.save()
  ctx.lineWidth = 2
  ctx.strokeStyle = Color.baliHai
  ctx.stroke(drawing.shape)

  ctx.restore()
}

export function updateHorizontalRay(
  { left, right }: SAN.Charts.Chart,
  drawing: SAN.Charts.HorizontalRay,
) {
  const { absCoor } = drawing
  const y = absCoor[1]

  const shape = new Path2D()
  drawing.shape = shape
  shape.moveTo(left, y)
  shape.lineTo(right, y)

  const offset = 4
  drawing.handlers = [newRectHandle((right - left) / 2, y + offset, -9, -9)]
}

// ------------------------
// --- HOVERING ---
// ------------------------

export function checkHorizontalRayIsHovered(
  ctx: CanvasRenderingContext2D,
  drawing: SAN.Charts.HorizontalRay,
  mouseXY: [number, number],
  dpr: number,
): boolean {
  const { shape, handlers } = drawing

  const x = mouseXY[0] * dpr
  const y = mouseXY[1] * dpr

  if (checkIsOnStrokeArea(ctx, shape, x, y)) return true
  if (ctx.isPointInPath(handlers[0], x, y)) return true
  return false
}

export function paintHorizontalRayHover(
  { drawer, theme }: SAN.Charts.Chart,
  drawing: SAN.Charts.HorizontalRay,
) {
  const { ctx } = drawer
  const { handlers } = drawing

  ctx.save()

  ctx.lineWidth = 2
  ctx.strokeStyle = Color.baliHai
  ctx.fillStyle = theme.bg

  ctx.fill(handlers[0])
  ctx.stroke(handlers[0])

  ctx.restore()
}

// ------------------------
// --- DRAGGING ---
// ------------------------

export function horizontalRayDragModifier(
  drawing: SAN.Charts.HorizontalRay,
  [_, y]: SAN.Charts.HorizontalRay['absCoor'],
  __,
  ___,
  yDiff: number,
): void {
  drawing.absCoor[1] = y + yDiff
}

//

export function newHorizontalRayCreationHandler(
  chart: SAN.Charts.Chart,
  onNewDrawingStart: (drawing: SAN.Charts.Drawing) => void,
  onNewDrawingEnd: (drawing: SAN.Charts.Drawing, type?: string) => void,
) {
  const { drawer, canvas } = chart
  const parent = canvas.parentNode as HTMLElement

  function onMouseDown(e: MouseEvent) {
    parent.removeEventListener('mousedown', onMouseDown)

    const y = getEventCoordinates(e)[1]
    const drawing = newHorizontalRay(y)

    const { absCoor, relCoor } = drawing
    updateHorizontalRay(chart, drawing)
    drawer.updateRelativeByAbsoluteCoordinates(absCoor, relCoor)

    onNewDrawingStart(drawing)
    onNewDrawingEnd(drawing)
  }

  return onMouseDown
}

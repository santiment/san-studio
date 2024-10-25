import { newDrawing, newRectHandle, checkIsOnStrokeArea, getEventCoordinates } from '../utils'
import { Color } from '../../theme'

export function newVerticalRay(x: number) {
  const vray = {
    type: 'vray',
    absCoor: [x, 0],
  } as SAN.Charts.VerticalRay

  return newDrawing(vray)
}

export function paintVerticalRay(chart: SAN.Charts.Chart, drawing: SAN.Charts.VerticalRay) {
  const { ctx } = chart.drawer

  ctx.save()
  ctx.lineWidth = 2
  ctx.strokeStyle = Color.baliHai
  ctx.stroke(drawing.shape)

  ctx.restore()
}

export function updateVerticalRay(
  { top, bottom }: SAN.Charts.Chart,
  drawing: SAN.Charts.VerticalRay,
) {
  const { absCoor } = drawing
  const x = absCoor[0]

  const shape = new Path2D()
  drawing.shape = shape
  shape.moveTo(x, top)
  shape.lineTo(x, bottom)

  const offset = 4
  // drawing.handlers = [newRectHandle((right - left) / 2, y + offset, -9, -9)]
  drawing.handlers = [newRectHandle(x + offset, (bottom - top) / 2, -9, -9)]
}

// ------------------------
// --- HOVERING ---
// ------------------------

export function checkVerticalRayIsHovered(
  ctx: CanvasRenderingContext2D,
  drawing: SAN.Charts.VerticalRay,
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

export function paintVerticalRayHover(
  { drawer, theme }: SAN.Charts.Chart,
  drawing: SAN.Charts.VerticalRay,
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

export function verticalRayDragModifier(
  drawing: SAN.Charts.VerticalRay,
  [x]: SAN.Charts.VerticalRay['absCoor'],
  __,
  xDiff: number,
): void {
  drawing.absCoor[0] = x + xDiff
}

//

export function newVerticalRayCreationHandler(
  chart: SAN.Charts.Chart,
  onNewDrawingStart: (drawing: SAN.Charts.Drawing) => void,
  onNewDrawingEnd: (drawing: SAN.Charts.Drawing, type?: string) => void,
) {
  const { drawer, canvas } = chart
  const parent = canvas.parentNode as HTMLElement

  function onMouseDown(e: MouseEvent) {
    parent.removeEventListener('mousedown', onMouseDown)

    const x = getEventCoordinates(e)[0]
    const drawing = newVerticalRay(x)

    const { absCoor, relCoor } = drawing
    updateVerticalRay(chart, drawing)
    drawer.updateRelativeByAbsoluteCoordinates(absCoor, relCoor)

    onNewDrawingStart(drawing)
    onNewDrawingEnd(drawing)
  }

  return onMouseDown
}

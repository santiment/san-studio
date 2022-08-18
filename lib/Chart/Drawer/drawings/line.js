import { newDrawing, newRoundHandle, checkIsOnStrokeArea, getEventCoordinates } from '../utils'
import { Color } from '../../theme'
export const HandleType = {
  LEFT: 1,
  RIGHT: 2,
  MOVE: 3,
}
export const LineLockType = {
  FREE: 0,
  X: 1,
  Y: 2,
}
export function newLine(x, y) {
  const line = {
    type: 'line',
    absCoor: [x, y, x, y],
  }
  return newDrawing(line)
}
export function paintLine(chart, drawing) {
  const { ctx } = chart.drawer
  ctx.save()
  ctx.lineWidth = 2
  ctx.strokeStyle = Color.baliHai
  ctx.stroke(drawing.shape)
  ctx.restore()
}
export function updateLine(_, drawing) {
  const { absCoor } = drawing
  const [x1, y1, x2, y2] = absCoor
  const shape = new Path2D()
  drawing.shape = shape
  shape.moveTo(x1, y1)
  shape.lineTo(x2, y2)
  drawing.handlers = [newRoundHandle(x1, y1), newRoundHandle(x2, y2)]
}
// ------------------------
// --- HOVERING ---
// ------------------------
export function checkLineIsHovered(ctx, drawing, mouseXY, dpr) {
  const { shape, handlers } = drawing
  const x = mouseXY[0] * dpr
  const y = mouseXY[1] * dpr
  if (checkIsOnStrokeArea(ctx, shape, x, y)) return true
  for (let i = 0; i < 2; i++) {
    if (ctx.isPointInPath(handlers[i], x, y)) return true
  }
  return false
}
export function paintLineHover({ drawer, theme }, drawing) {
  const { ctx } = drawer
  const { handlers } = drawing
  ctx.save()
  ctx.lineWidth = 2
  ctx.strokeStyle = Color.baliHai
  ctx.fillStyle = theme.bg
  for (let i = 0; i < 2; i++) {
    ctx.fill(handlers[i])
    ctx.stroke(handlers[i])
  }
  ctx.restore()
}
export function getLineDragData(ctx, drawing, x, y) {
  const { handlers } = drawing
  const pressedHandle = ctx.isPointInPath(handlers[0], x, y)
    ? HandleType.LEFT
    : ctx.isPointInPath(handlers[1], x, y)
    ? HandleType.RIGHT
    : HandleType.MOVE
  return [
    pressedHandle & HandleType.LEFT,
    pressedHandle & HandleType.RIGHT,
    pressedHandle !== HandleType.MOVE,
  ]
}
export const getLineLockType = (x1, y1, x2, y2) =>
  Math.abs(x2 - x1) < Math.abs(y2 - y1) ? LineLockType.X : LineLockType.Y
export function lineDragModifier(
  drawing,
  initialAbsCoor,
  [isLeftHandleDrag, isRightHandleDrag, isNotLineDrag],
  xDiff,
  yDiff,
  e,
) {
  const [x1, y1, x2, y2] = initialAbsCoor
  const { absCoor } = drawing
  let isLineLockX = false
  let isLineLockY = false
  if (isNotLineDrag && e.shiftKey) {
    const [moveX, moveY] = getEventCoordinates(e)
    const xStart = isLeftHandleDrag ? x2 : x1
    const yStart = isLeftHandleDrag ? y2 : y1
    if (getLineLockType(xStart, yStart, moveX, moveY) === LineLockType.X) {
      isLineLockX = true
    } else {
      isLineLockY = true
    }
  }
  if (isLeftHandleDrag) {
    absCoor[0] = isLineLockX ? x2 : x1 + xDiff
    absCoor[1] = isLineLockY ? y2 : y1 + yDiff
  }
  if (isRightHandleDrag) {
    absCoor[2] = isLineLockX ? x1 : x2 + xDiff
    absCoor[3] = isLineLockY ? y1 : y2 + yDiff
  }
}
//# sourceMappingURL=line.js.map

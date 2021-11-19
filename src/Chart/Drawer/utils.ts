type NewDrawing = Partial<SAN.Charts.Drawing> & Pick<SAN.Charts.Drawing, 'type'>
export function newDrawing<T extends NewDrawing>(drawing: T): T {
  const { absCoor = [], relCoor = [], ratioCoor = [], handlers = [] } = drawing
  drawing.absCoor = absCoor
  drawing.relCoor = relCoor
  drawing.ratioCoor = ratioCoor
  drawing.handlers = handlers
  return drawing
}

export function getEventCoordinates(e: MouseEvent): [number, number] {
  const { offsetX, offsetY, target } = e
  const { offsetLeft, offsetTop } = target as HTMLElement
  return [offsetX + offsetLeft, offsetY + offsetTop]
}

export function newRectHandle(
  x: number,
  y: number,
  width: number,
  height: number,
) {
  const handle = new Path2D()
  handle.rect(x, y, width, height)
  return handle
}

export function newRoundHandle(x: number, y: number) {
  const handle = new Path2D()
  handle.arc(x, y, 6, 0, 2 * Math.PI)
  return handle
}

export function checkIsOnStrokeArea(
  ctx: CanvasRenderingContext2D,
  shape: Path2D,
  x: number,
  y: number,
) {
  if (ctx.isPointInStroke(shape, x, y)) return true

  for (let i = 1; i < 8; i++) {
    if (
      ctx.isPointInStroke(shape, x - i, y - i) ||
      ctx.isPointInStroke(shape, x - i, y + i) ||
      ctx.isPointInStroke(shape, x + i, y - i) ||
      ctx.isPointInStroke(shape, x + i, y + i)
    ) {
      return true
    }
  }

  return false
}

export function hook(
  node: HTMLElement,
  event: string,
  callback: (e: any) => any,
) {
  node.addEventListener(event, callback)
  return () => node.removeEventListener(event, callback)
}

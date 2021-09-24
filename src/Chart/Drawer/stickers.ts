import type { Chart, Drawer, Drawing, MinMax } from './drawer'
import rocket from './rocket.png'

export type StickerIds = 'rocket'
export type Sticker = Drawing & {
  type: 'sticker'
  id: StickerIds
  size: number
  /** [x, y] */
  absCoor: [number, number]
  hitbox: Path2D
  handlers: [Path2D, Path2D, Path2D, Path2D]
}

const StickerSrc = {
  rocket,
} as Record<StickerIds, string>

export const CachedSticker = new Map<
  StickerIds,
  undefined | null | HTMLImageElement
>()

export function paintSticker(chart: Chart, drawing: Sticker) {
  const img = CachedSticker.get(drawing.id)
  if (img === null) return
  if (img === undefined) return loadSticker(chart, drawing)

  const { size, absCoor } = drawing
  const [x, y] = absCoor

  chart.drawer.ctx.drawImage(img, x, y, size, size)
}

function loadSticker(chart: Chart, drawing: Sticker) {
  const img = new Image()
  img.onload = () => {
    CachedSticker.set(drawing.id, img)
    chart.drawer.redraw()
  }
  img.src = StickerSrc[drawing.id]
  CachedSticker.set(drawing.id, null)
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

export function updateSticker(drawer: Drawer, drawing: Sticker) {
  const { minMax } = drawer
  const { size, absCoor } = drawing
  const [left, top] = absCoor

  const right = left + size
  const bottom = top + size
  const offset = 4

  drawing.handlers = [
    newRectHandle(left + offset, top + offset, -10, -10),
    newRectHandle(right - offset, top + offset, 10, -10),
    newRectHandle(left + offset, bottom - offset, -10, 10),
    newRectHandle(right - offset, bottom - offset, 10, 10),
  ]

  drawing.hitbox = newRectHandle(left, top, size, size)
}

export function getStickerDragData(
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
export function stickerDragModifier(
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

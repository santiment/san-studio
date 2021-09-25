import type { Chart, Drawer, Drawing } from './drawer'
import { newRectHandle } from './_utils'
import rocket from './rocket.png'

export type StickerIds = 'rocket'
export interface Sticker extends Drawing {
  type: 'sticker'
  id: StickerIds
  size: number
  /** [x, y] */
  absCoor: [number, number]
  /** [x, y] */
  relCoor: [number, number]
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

  const sizeOffset = size / 2
  chart.drawer.ctx.drawImage(img, x - sizeOffset, y - sizeOffset, size, size)
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

export function updateSticker(_: Drawer, drawing: Sticker) {
  const { size, absCoor } = drawing
  const [x, y] = absCoor

  const sizeOffset = size / 2
  const top = y - sizeOffset
  const left = x - sizeOffset
  const right = x + sizeOffset
  const bottom = y + sizeOffset
  const offset = 4

  drawing.handlers = [
    newRectHandle(left + offset, top + offset, -10, -10),
    newRectHandle(right - offset, top + offset, 10, -10),
    newRectHandle(left + offset, bottom - offset, -10, 10),
    newRectHandle(right - offset, bottom - offset, 10, 10),
  ]

  drawing.hitbox = newRectHandle(left, top, size, size)
}

type StickerDragData = [Sticker['size'], boolean, boolean]
export function getStickerDragData(
  ctx: CanvasRenderingContext2D,
  drawing: Sticker,
  x: number,
  y: number,
): StickerDragData {
  const { size, handlers } = drawing
  const data: StickerDragData = [size, false, false]

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
  [initialSize, isResize, areLeftHandlers]: StickerDragData,
  xDiff: number,
  yDiff: number,
) {
  const [x, y] = initialAbsCoor

  if (isResize) {
    const diff = areLeftHandlers ? -xDiff : xDiff
    const size = initialSize + diff
    drawing.size =
      size < MIN_SIZE ? MIN_SIZE : size > MAX_SIZE ? MAX_SIZE : size

    return
  }

  drawing.absCoor[0] = x + xDiff
  drawing.absCoor[1] = y + yDiff
}

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

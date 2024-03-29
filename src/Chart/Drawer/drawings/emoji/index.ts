import { newDrawing, newRectHandle } from '../../utils'
import rocket from './rocket.png'
import fire from './fire.png'
import bear from './bear.png'
import stop from './stop.png'
import unicorn from './unicorn.png'
import bell from './bell.png'
import poo from './poo.png'
import rock from './rock.png'

const MIN_SIZE = 25
const MAX_SIZE = 70

type NewEmoji = Partial<Pick<SAN.Charts.Emoji, 'size' | 'absCoor' | 'relCoor' | 'ratioCoor'>> & {
  id: SAN.Charts.EmojiIds
}
export function newEmoji(drawing: NewEmoji) {
  drawing.size = drawing.size || 50
  const emoji = Object.assign(drawing, { type: 'emoji' }) as SAN.Charts.Emoji
  return newDrawing(emoji)
}

export const EmojiSrc: Record<SAN.Charts.EmojiIds, string> = {
  fire,
  rocket,
  stop,
  poo,
  bear,
  rock,
  unicorn,
  bell,
}
export const EMOJIS = Object.entries(EmojiSrc) as [SAN.Charts.EmojiIds, string][]

export const CachedEmoji = new Map<SAN.Charts.EmojiIds, undefined | null | HTMLImageElement>()

export function paintEmoji(chart: SAN.Charts.Chart, drawing: SAN.Charts.Emoji) {
  const img = CachedEmoji.get(drawing.id)
  if (img === null) return
  if (img === undefined) return loadEmoji(chart, drawing)

  const { size, absCoor } = drawing
  const [x, y] = absCoor

  const sizeOffset = size / 2
  chart.drawer.ctx.drawImage(img, x - sizeOffset, y - sizeOffset, size, size)
}

export function loadEmoji(chart: SAN.Charts.Chart, drawing: SAN.Charts.Emoji) {
  // const Image = process.browser ? window.Image : require('canvas').Image
  const Image = globalThis.Image
  const img = new Image()
  img.onload = () => {
    CachedEmoji.set(drawing.id, img)
    chart.drawer.redraw()
  }
  img.src = EmojiSrc[drawing.id]
  if (!CachedEmoji.get(drawing.id)) CachedEmoji.set(drawing.id, null)
}

export function updateEmoji(_, drawing: SAN.Charts.Emoji) {
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

// ------------------------
// --- HOVERING ---
// ------------------------

export function checkEmojiIsHovered(
  ctx: CanvasRenderingContext2D,
  drawing: SAN.Charts.Emoji,
  mouseXY: [number, number],
  dpr: number,
) {
  const { hitbox, handlers } = drawing

  const x = mouseXY[0] * dpr
  const y = mouseXY[1] * dpr

  if (ctx.isPointInPath(hitbox, x, y)) return true
  for (let i = 0; i < 4; i++) {
    if (ctx.isPointInPath(handlers[i], x, y)) return true
  }

  return false
}

export function paintEmojiHover({ drawer }: SAN.Charts.Chart, drawing: SAN.Charts.Emoji) {
  const { ctx } = drawer
  const { hitbox, handlers } = drawing

  ctx.save()

  ctx.strokeStyle = '#68B3F4'
  ctx.stroke(hitbox)

  ctx.fillStyle = 'white'
  for (let i = 0; i < 4; i++) {
    ctx.fill(handlers[i])
    ctx.stroke(handlers[i])
  }

  ctx.restore()
}

// ------------------------
// --- DRAGGING ---
// ------------------------

type EmojiDragData = [SAN.Charts.Emoji['size'], boolean, boolean]
export function getEmojiDragData(
  ctx: CanvasRenderingContext2D,
  drawing: SAN.Charts.Emoji,
  x: number,
  y: number,
): EmojiDragData {
  const { size, handlers } = drawing
  const data: EmojiDragData = [size, false, false]

  for (let i = 0; i < 4; i++) {
    if (ctx.isPointInPath(handlers[i], x, y)) {
      data[1] = true
      data[2] = i == 0 || i === 2
      break
    }
  }

  return data
}

export function emojiDragModifier(
  drawing: SAN.Charts.Emoji,
  initialAbsCoor: SAN.Charts.Emoji['absCoor'],
  [initialSize, isResize, areLeftHandlers]: EmojiDragData,
  xDiff: number,
  yDiff: number,
) {
  const [x, y] = initialAbsCoor

  if (isResize) {
    const diff = areLeftHandlers ? -xDiff : xDiff
    const size = initialSize + diff
    drawing.size = size < MIN_SIZE ? MIN_SIZE : size > MAX_SIZE ? MAX_SIZE : size

    return
  }

  drawing.absCoor[0] = x + xDiff
  drawing.absCoor[1] = y + yDiff
}

import type { Chart, Drawer, Drawing } from './drawer'
import type { Sticker } from './drawings/stickers'
import { checkIsHovered } from './intersection'
import { paintLineHover } from './drawings/line'
import { getEventCoordinates } from './_utils'

type HoverPainter = (chart: Chart, drawing: Drawing) => void
const DrawingHoverPainter = {
  line: paintLineHover,
  sticker: paintStickerHover,
} as Record<any, undefined | HoverPainter>

export const getDrawingHoverPainter = ({ type }: Drawing) =>
  DrawingHoverPainter[type]

export function newMouseHoverHandler(
  chart: Chart,
  setHovered: (drawing?: Drawing) => void,
) {
  const { canvas, drawer } = chart
  const parent = canvas.parentNode as HTMLElement

  function onMouseMove(e: MouseEvent) {
    if (!drawer.minMax) return

    const mouseXY = getEventCoordinates(e)
    const hovered = checkIsHovered(chart, mouseXY, e)

    if (hovered === drawer.hovered) return

    setHovered(hovered)
    drawer.redraw()

    if (!hovered) return

    getDrawingHoverPainter(hovered)?.(chart, hovered)
  }

  return onMouseMove
  // parent.addEventListener('mousemove', onMouseMove)
  // return () => parent.removeEventListener('mousemove', onMouseMove)
}

function paintStickerHover({ drawer }: Chart, drawing: Sticker) {
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

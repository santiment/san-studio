import type { Chart, Drawer, Drawing } from './drawer'
import type { Sticker } from './stickers'
import { getEventCoordinates, checkIntersection } from './intersection'

type HoverPainter = (drawer: Drawer, drawing: Drawing) => void

const DrawingHoverPainter = {
  sticker: paintStickerHover,
} as Record<any, undefined | HoverPainter>

export const getDrawingHoverPainter = ({ type = 'line' }: Drawing) =>
  DrawingHoverPainter[type]

export function handleMouseIntersection(
  chart: Chart,
  setHovered: (drawing?: Drawing) => void,
) {
  const { canvas, drawer } = chart
  const parent = canvas.parentNode as HTMLElement

  function onMouseMove(e: MouseEvent) {
    if (!drawer.minMax) return

    const mouseXY = getEventCoordinates(e)
    const hovered = checkIntersection(chart, mouseXY, e)

    if (hovered === drawer.hovered) return

    setHovered(hovered)
    drawer.redraw()

    if (!hovered) return

    getDrawingHoverPainter(hovered)?.(drawer, hovered)
  }

  parent.addEventListener('mousemove', onMouseMove)
  return () => parent.removeEventListener('mousemove', onMouseMove)
}

function paintStickerHover(drawer: Drawer, drawing: Sticker) {
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

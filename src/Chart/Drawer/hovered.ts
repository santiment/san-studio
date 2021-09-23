import type { Chart, Drawer, Drawing } from './drawer'
import type { Sticker } from './stickers'
import { getEventCoordinates, checkIntersection } from './intersection'

const DrawingHoverPainter = {
  sticker: paintStickerHover,
}

export function handleMouseIntersection(chart: Chart) {
  const { canvas, drawer } = chart
  const parent = canvas.parentNode as HTMLElement

  function onMouseMove(e: MouseEvent) {
    if (!drawer.minMax) return

    const mouseXY = getEventCoordinates(e)
    const hovered = checkIntersection(chart, mouseXY, e)

    if (hovered === drawer.hovered) return

    drawer.hovered = hovered
    drawer.redraw()

    if (!hovered) return

    DrawingHoverPainter[hovered.type || 'line']?.(drawer, hovered, mouseXY)
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

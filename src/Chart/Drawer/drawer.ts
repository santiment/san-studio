import { clearCtx } from '../utils'
import { paintSticker, updateSticker } from './stickers'

export type MinMax = { min: number; max: number }

type Offset = {
  top: number
  right: number
  bottom: number
  left: number
}

export type Drawing = {
  type: undefined | 'line' | 'sticker'
}

export type Drawer = {
  canvas: HTMLCanvasElement
  ctx: CanvasRenderingContext2D
  drawings: Drawing[]
  minMax: undefined | MinMax
  hovered: undefined | Drawing
  selected: undefined | Drawing
  redraw: () => void
}

export type Chart = Offset & {
  canvas: HTMLCanvasElement
  drawer: Drawer
  dpr: number
}

const DrawingPainter = {
  sticker: paintSticker,
}

export function paintDrawings(chart: Chart) {
  const { drawer, right, bottom, left } = chart
  const { ctx, drawings, minMax } = drawer

  if (!minMax) return

  clearCtx(chart, ctx)

  for (let i = 0, len = drawings.length; i < len; i++) {
    const drawing = drawings[i]
    const painter = DrawingPainter[drawing.type || 'line']
    painter?.(chart, drawing)
  }

  ctx.clearRect(left, 0, -200, bottom)
  ctx.clearRect(right, 0, 200, bottom)
  ctx.clearRect(0, bottom, right, 200)
}

const DrawingUpdater = {
  sticker: updateSticker,
}
export function setupDrawings(chart: Chart, minMax: MinMax) {
  const { drawer } = chart
  const { drawings } = drawer
  console.log('new min max')

  for (let i = 0, len = drawings.length; i < len; i++) {
    const drawing = drawings[i]
    const updater = DrawingUpdater[drawing.type || 'line']
    updater?.(drawer, drawing, minMax)
  }
}

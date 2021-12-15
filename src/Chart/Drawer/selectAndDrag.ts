import { getEventCoordinates } from './utils'
import { absoluteToRatioCoordinates } from './coordinates'
import { getDrawingUpdater } from './drawings'
import { getLineDragData, lineDragModifier } from './drawings/line'
import { getEmojiDragData, emojiDragModifier } from './drawings/emoji'
import { noteDragModifier, handleNoteDoubleClick } from './drawings/note'
import { horizontalRayDragModifier } from './drawings/horizontalRay'

type Controller = {
  selectDrawing: (drawing?: SAN.Charts.Drawing) => void
  startDrawing: () => void
  stopDrawing: () => void
  onDrawingDragEnd: (
    drawing: SAN.Charts.Drawing,
    oldAbsCoor: SAN.Charts.Drawing['absCoor'],
    data: any[],
  ) => void
}

const DrawingDoubleClickHandler = {
  note: handleNoteDoubleClick,
} as Record<SAN.Charts.DrawingTypes, undefined | any>

export function newDoubleClickHandler(
  chart: SAN.Charts.Chart,
  onDrawingModified: Controller['onDrawingDragEnd'],
) {
  const { drawer } = chart

  return function onDoubleClick() {
    const { selected } = drawer
    if (!selected) return
    DrawingDoubleClickHandler[selected.type]?.(
      drawer,
      selected,
      onDrawingModified,
    )
  }
}

export function newDrawingSelectHandler(
  chart: SAN.Charts.Chart,
  controller: Controller,
) {
  const { canvas, drawer, dpr } = chart
  const parent = canvas.parentNode as HTMLElement

  return function onMouseDown(e: MouseEvent) {
    const { hovered, selected } = drawer

    if (!hovered) {
      if (selected) {
        controller.selectDrawing()
        drawer.redraw()
      }
      return
    }

    controller.selectDrawing(hovered)
    controller.startDrawing()
    if (selected && selected !== hovered) drawer.redraw()
    else drawer.drawSelection?.()

    const initialRatioCoor = hovered.ratioCoor.slice()
    const wasDragged = { value: false, data: [] as any[] }
    const onDrawingDrag = newDrawingDragHandler(
      chart,
      hovered as any,
      getEventCoordinates(e),
      dpr,
      wasDragged,
    )

    parent.addEventListener('mousemove', onDrawingDrag as any)
    parent.addEventListener('mouseup', onMouseUp)
    function onMouseUp() {
      parent.removeEventListener('mousemove', onDrawingDrag as any)
      parent.removeEventListener('mouseup', onMouseUp)
      controller.stopDrawing()
      if (wasDragged.value) {
        controller.onDrawingDragEnd(
          hovered as SAN.Charts.Drawing,
          initialRatioCoor,
          wasDragged.data,
        )
      }
    }
  }
}

type DragDataGetter = (
  ctx: CanvasRenderingContext2D,
  drawing: SAN.Charts.Drawing,
  x: number,
  y: number,
) => any[]
const DrawingDragDataGetter = {
  line: getLineDragData,
  emoji: getEmojiDragData,
  hray: undefined,
  note: undefined,
} as Record<SAN.Charts.DrawingTypes, undefined | DragDataGetter>

type DragModifier = (
  drawing: SAN.Charts.Drawing,
  initialAbsCoor: number[],
  dragData: undefined | any[],
  xDiff: number,
  yDiff: number,
  e: MouseEvent,
) => void
const DrawingDragModifier = {
  line: lineDragModifier,
  emoji: emojiDragModifier,
  note: noteDragModifier,
  hray: horizontalRayDragModifier,
} as Record<SAN.Charts.DrawingTypes, undefined | DragModifier>

function newDrawingDragHandler(
  chart: SAN.Charts.Chart,
  drawing: SAN.Charts.Drawing,
  [startX, startY]: [number, number],
  dpr: number,
  wasDragged: { value: boolean; data: any[] },
) {
  const { drawer, width, height } = chart
  const { type } = drawing
  const initialAbsCoor = drawing.absCoor.slice()

  const updater = getDrawingUpdater(drawing)
  const getDragData = DrawingDragDataGetter[type]
  const dragModifier = DrawingDragModifier[type]

  if (!(updater && dragModifier)) return

  const { ctx, updateRelativeByAbsoluteCoordinates } = drawer

  const dragData = getDragData?.(ctx, drawing, startX * dpr, startY * dpr)
  const { absCoor, relCoor, ratioCoor } = drawing

  return (e: MouseEvent) => {
    const [moveX, moveY] = getEventCoordinates(e)
    const diffX = moveX - startX
    const diffY = moveY - startY

    dragModifier(drawing, initialAbsCoor, dragData, diffX, diffY, e)
    updateRelativeByAbsoluteCoordinates(absCoor, relCoor)
    absoluteToRatioCoordinates(absCoor, ratioCoor, width, height)
    updater(chart, drawing)

    wasDragged.value = true
    wasDragged.data = dragData as any
    drawer.redraw()
  }
}

export const newDrawingDeleteHandler =
  (drawer: SAN.Charts.Drawer) =>
  ({ key }: KeyboardEvent) => {
    if (key !== 'Backspace' || !drawer.selected) return
    drawer.deleteDrawing(drawer.selected)
  }

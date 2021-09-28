import type { Chart, Drawing } from './drawer'
import type { Line } from './drawings/line'
import { getEventCoordinates } from './utils'
import { updateLine } from './drawings/line'
import { absoluteToRatioCoordinates } from './coordinates'

const LineLockType = {
  FREE: 0,
  X: 1,
  Y: 2,
} as const
const getLineLockType = (x1: number, y1: number, x2: number, y2: number) =>
  Math.abs(x2 - x1) < Math.abs(y2 - y1) ? LineLockType.X : LineLockType.Y

export const newLine = (x: number, y: number) => ({
  type: 'line',
  absCoor: [x, y, x, y],
  relCoor: [] as number[],
  ratioCoor: [] as number[],
  //color: Color.baliHai,
})

export function newLineCreationHandler(
  chart: Chart,
  onNewDrawingStart: (drawing: Drawing) => void,
  onNewDrawingEnd: (drawing: Drawing) => void,
) {
  const { drawer, canvas, width, height } = chart
  const parent = canvas.parentNode as HTMLElement

  function onMouseDown(e: MouseEvent) {
    const [startX, startY] = getEventCoordinates(e)
    const drawing = newLine(startX, startY) as Line
    const { absCoor, relCoor, ratioCoor } = drawing

    updateLine(undefined, drawing)
    drawer.updateRelativeByAbsoluteCoordinates(absCoor, relCoor)
    onNewDrawingStart(drawing)

    parent.removeEventListener('mousedown', onMouseDown)
    parent.addEventListener('mousemove', onMouseMove)
    parent.addEventListener('mousedown', finishLine)

    function onMouseMove(e: MouseEvent) {
      const [moveX, moveY] = getEventCoordinates(e)
      const lineLock = e.shiftKey
        ? getLineLockType(startX, startY, moveX, moveY)
        : LineLockType.FREE

      drawing.absCoor[2] = lineLock === LineLockType.X ? startX : moveX
      drawing.absCoor[3] = lineLock === LineLockType.Y ? startY : moveY

      updateLine(undefined, drawing)

      absoluteToRatioCoordinates(absCoor, ratioCoor, width, height)
      drawer.updateRelativeByAbsoluteCoordinates(absCoor, relCoor)
      drawer.redraw()
    }

    function finishLine() {
      parent.removeEventListener('mousemove', onMouseMove)
      parent.removeEventListener('mousedown', finishLine)

      onNewDrawingEnd(drawing)
    }
  }

  return onMouseDown
}

export function handleLineCreation() {}

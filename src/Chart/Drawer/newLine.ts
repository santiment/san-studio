import { getEventCoordinates } from './utils'
import { absoluteToRatioCoordinates } from './coordinates'
import { LineLockType, getLineLockType, updateLine, newLine } from './drawings/line'

export function newLineCreationHandler(
  chart: SAN.Charts.Chart,
  onNewDrawingStart: (drawing: SAN.Charts.Drawing) => void,
  onNewDrawingEnd: (drawing: SAN.Charts.Drawing) => void,
) {
  const { drawer, canvas, width, height } = chart
  const parent = canvas.parentNode as HTMLElement

  function onMouseDown(e: MouseEvent) {
    const [startX, startY] = getEventCoordinates(e)
    const drawing = newLine(startX, startY) as SAN.Charts.Line
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

import type { Drawing } from './context'
import {
  HandleType,
  newLine,
  checkIsLineHovered,
  getPressedHandleType,
  absoluteToRelativeCoordinates,
} from './utils'

const LineLockType = {
  FREE: 0,
  X: 1,
  Y: 2,
}

function getEventCoordinates(e): [number, number] {
  const { offsetX, offsetY, target } = e
  const { offsetLeft, offsetTop } = target
  return [offsetX + offsetLeft, offsetY + offsetTop]
}
const getDprCoordinates = ({ dpr }, [x, y]) => [x * dpr, y * dpr]

const getLineLockType = (x1, y1, x2, y2) =>
  Math.abs(x2 - x1) < Math.abs(y2 - y1) ? LineLockType.X : LineLockType.Y

export function handleLineCreation(
  chart,
  setSelectedLine,
  setIsDrawing,
  setIsNewDrawing,
  setDrawings,
) {
  const parent = chart.canvas.parentNode
  parent.addEventListener('mousedown', onMouseDown)

  function onMouseDown(e) {
    const { drawer } = chart
    const [startX, startY] = getEventCoordinates(e)
    const drawing = newLine(startX, startY) as Drawing

    drawer.addDrawing(drawing)
    drawer.selected = drawing
    setSelectedLine(drawing)
    setIsDrawing(true)

    parent.removeEventListener('mousedown', onMouseDown)
    parent.addEventListener('mousemove', onMouseMove)
    parent.addEventListener('mousedown', finishLine)

    function onMouseMove(e) {
      const [moveX, moveY] = getEventCoordinates(e)
      const lineLock = e.shiftKey
        ? getLineLockType(startX, startY, moveX, moveY)
        : LineLockType.FREE

      drawing.absCoor[2] = lineLock === LineLockType.X ? startX : moveX
      drawing.absCoor[3] = lineLock === LineLockType.Y ? startY : moveY

      drawer.redraw()
    }

    function finishLine() {
      parent.removeEventListener('mousemove', onMouseMove)
      parent.removeEventListener('mousedown', finishLine)
      drawing.relCoor = absoluteToRelativeCoordinates(chart, drawing)
      setIsDrawing(false)
      setIsNewDrawing(false)

      drawer.dispatch({
        type: 'new line',
        data: drawing,
      })
    }
  }

  return () => {
    parent.removeEventListener('mousedown', onMouseDown)
  }
}

export function handleLineHover(chart) {
  return (e) => {
    const { isDrawing, drawer, tooltip } = chart
    if (isDrawing || !drawer) return

    const { drawings, ctx } = drawer
    const [moveX, moveY] = getDprCoordinates(chart, getEventCoordinates(e))

    let hoveredLine = null

    for (let i = 0; i < drawings.length; i++) {
      const drawing = drawings[i]
      const { shape, handles } = drawing
      if (!shape || !handles) continue

      if (checkIsLineHovered(ctx, drawing, moveX, moveY)) {
        hoveredLine = drawing
        break
      }
    }

    drawer.mouseover = hoveredLine

    const { canvas, cursor = 'initial' } = tooltip || chart
    canvas.style.cursor = hoveredLine ? 'pointer' : cursor

    drawer.redraw()
  }
}

function handleClickaway(drawer) {
  drawer.mouseover = null
  drawer.selected = null
  window.removeEventListener('keydown', drawer.onLineDelete)
  drawer.redraw()
}

function handleLineDelete(drawer, setSelectedLine, setIsDrawing, setDrawings) {
  return ({ key }) => {
    if (key !== 'Backspace') return

    const { selected, onLineDelete } = drawer

    drawer.deleteDrawing(selected)
    window.removeEventListener('keydown', onLineDelete)
  }
}

function handleLineDrag(chart, drawing, coordinates, setWasDragged) {
  const { drawer } = chart
  const { ctx } = drawer
  const { handles, absCoor } = drawing

  const [startX, startY] = coordinates
  const [startDprX, startDprY] = getDprCoordinates(chart, coordinates)
  const [x1, y1, x2, y2] = absCoor
  const pressedHandle = getPressedHandleType(ctx, handles, startDprX, startDprY)

  const isLeftHandleDrag = pressedHandle & HandleType.LEFT
  const isRightHandleDrag = pressedHandle & HandleType.RIGHT
  const isNotLineDrag = pressedHandle !== HandleType.MOVE

  return (e) => {
    const [moveX, moveY] = getEventCoordinates(e)
    const diffX = moveX - startX
    const diffY = moveY - startY

    let isLineLockX = false
    let isLineLockY = false
    if (isNotLineDrag && e.shiftKey) {
      const xStart = isLeftHandleDrag ? x2 : x1
      const yStart = isLeftHandleDrag ? y2 : y1

      if (getLineLockType(xStart, yStart, moveX, moveY) === LineLockType.X) {
        isLineLockX = true
      } else {
        isLineLockY = true
      }
    }

    if (isLeftHandleDrag) {
      absCoor[0] = isLineLockX ? x2 : x1 + diffX
      absCoor[1] = isLineLockY ? y2 : y1 + diffY
    }
    if (isRightHandleDrag) {
      absCoor[2] = isLineLockX ? x1 : x2 + diffX
      absCoor[3] = isLineLockY ? y1 : y2 + diffY
    }

    drawer.redraw()
    setWasDragged()
  }
}

export function handleLineMouseDown(
  chart,
  setSelectedLine,
  setIsDrawing,
  setDrawings,
) {
  return (e) => {
    const { drawer } = chart
    const drawing = drawer.mouseover

    if (!drawing) {
      setSelectedLine()
      return handleClickaway(drawer)
    }

    drawer.selected = drawing
    drawer.redraw()
    setSelectedLine(drawing)
    setIsDrawing(true)

    const parent = chart.canvas.parentNode
    const startCoordinates = getEventCoordinates(e)
    const drawingInitialAbsCoor = drawing.absCoor.slice()
    let wasDragged = false

    drawer.onLineDelete = handleLineDelete(
      drawer,
      setSelectedLine,
      setIsDrawing,
      setDrawings,
    )
    const setWasDragged = () => (wasDragged = true)
    const onLineDrag = handleLineDrag(
      chart,
      drawing,
      startCoordinates,
      setWasDragged,
    )

    window.addEventListener('keydown', drawer.onLineDelete)
    parent.addEventListener('mousemove', onLineDrag)
    parent.addEventListener('mouseup', onMouseUp)

    function onMouseUp() {
      drawing.relCoor = absoluteToRelativeCoordinates(chart, drawing)
      parent.removeEventListener('mousemove', onLineDrag)
      parent.removeEventListener('mouseup', onMouseUp)
      setIsDrawing(false)
      if (wasDragged)
        drawer.dispatch({
          type: 'modified',
          data: {
            drawing,
            oldAbsCoor: drawingInitialAbsCoor,
          },
        })
    }
  }
}

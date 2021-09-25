import type { History, Scrollable } from 'webkit/ui/history'
import type { Chart, Drawing } from '@/Chart/Drawer/drawer'
import { withScroll } from 'webkit/ui/history'
import { resetDrawings } from '@/Chart/Drawer/drawer'

type Widget = Scrollable & { chart: Chart }

function newDrawingResetter(drawing: Drawing) {
  const absCoor = drawing.absCoor.slice()

  return () => {
    applyCoordinates(drawing.absCoor, absCoor)
    drawing.relCoor.length = 0
  }
}

export function recordNewDrawing(
  History: History,
  ChartDrawer,
  widget: Widget,
  drawing: Drawing,
) {
  const reset = newDrawingResetter(drawing)
  History.add(
    'New drawing',
    withScroll(widget, () => ChartDrawer.deleteDrawing(drawing)),
    withScroll(widget, () => {
      reset()
      ChartDrawer.addDrawing(drawing)
    }),
  )
}

export function recordDeleteDrawing(
  History: History,
  ChartDrawer,
  widget: Widget,
  drawing: Drawing,
) {
  const reset = newDrawingResetter(drawing)
  History.add(
    'Delete drawing',
    withScroll(widget, () => {
      reset()
      ChartDrawer.addDrawing(drawing)
    }),
    withScroll(widget, () => ChartDrawer.deleteDrawing(drawing)),
  )
}

export function recordDrawingModified(
  History: History,
  widget: Widget,
  drawing: Drawing,
  oldAbsCoor: Drawing['absCoor'],
) {
  const { chart } = widget
  const newAbsCoor = drawing.absCoor.slice()

  function reset(absCoor: Drawing['absCoor']) {
    applyCoordinates(drawing.absCoor, absCoor)
    drawing.relCoor.length = 0
    resetDrawings(chart)
    chart.drawer.redraw()
  }

  History.add(
    'Drawing modified',
    withScroll(widget, () => reset(oldAbsCoor)),
    withScroll(widget, () => reset(newAbsCoor)),
  )
}

function applyCoordinates(
  coordinates: Drawing['absCoor'],
  newCoordinates: Drawing['absCoor'],
) {
  for (let i = 0, len = newCoordinates.length; i < len; i++) {
    coordinates[i] = newCoordinates[i]
  }
}

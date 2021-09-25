import type { History, Scrollable } from 'webkit/ui/history'
import type { Chart, Drawing } from '@/Chart/Drawer/drawer'
import { withScroll } from 'webkit/ui/history'
import { getDrawingUpdater } from '@/Chart/Drawer/drawings'

type Widget = Scrollable & { chart: Chart }

export function recordNewDrawing(
  History: History,
  ChartDrawer,
  widget: Widget,
  drawing: Drawing,
) {
  const { absCoor, relCoor } = drawing
  History.add(
    'New drawing',
    withScroll(widget, () => ChartDrawer.deleteDrawing(drawing)),
    withScroll(widget, () => {
      widget.chart.drawer.updateRelativeByAbsoluteCoordinates(absCoor, relCoor)
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
  const { absCoor, relCoor } = drawing
  History.add(
    'Delete drawing',
    withScroll(widget, () => {
      widget.chart.drawer.updateRelativeByAbsoluteCoordinates(absCoor, relCoor)
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
    const { drawer } = chart
    applyCoordinates(drawing.absCoor, absCoor)
    drawer.updateRelativeByAbsoluteCoordinates(absCoor, drawing.relCoor)
    getDrawingUpdater(drawing)?.(drawer, drawing)
    drawer.redraw()
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

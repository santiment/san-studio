import type { History, Scrollable } from 'webkit/ui/history'
import type { Chart, Drawing } from '@/Chart/Drawer/drawer'
import { withScroll } from 'webkit/ui/history'
import { resetDrawingAbsoluteCoordinates } from '@/Chart/Drawer/coordinates'

type Widget = Scrollable & { chart: Chart; ChartDrawer: any }

export function recordNewDrawing(
  History: History,
  ChartDrawer,
  widget: Widget,
  drawing: Drawing,
) {
  History.add(
    'New drawing',
    withScroll(widget, () => ChartDrawer.deleteDrawing(drawing)),
    withScroll(widget, () => {
      resetDrawingAbsoluteCoordinates(drawing)
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
  History.add(
    'Delete drawing',
    withScroll(widget, () => {
      resetDrawingAbsoluteCoordinates(drawing)
      ChartDrawer.addDrawing(drawing)
    }),
    withScroll(widget, () => ChartDrawer.deleteDrawing(drawing)),
  )
}

export function recordDrawingModified(
  History: History,
  widget: Widget,
  drawing: Drawing,
  oldRatioCoor: Drawing['absCoor'],
  data: any[],
) {
  const newRatioCoor = drawing.ratioCoor.slice()
  let oldSize = drawing.type === 'emoji' ? data[0] : undefined

  function reset(ratioCoor: Drawing['absCoor']) {
    if (drawing.type === 'emoji') {
      const emoji = drawing as any
      const { size } = emoji
      emoji.size = oldSize
      oldSize = size
    }
    applyCoordinates(drawing.ratioCoor, ratioCoor)
    resetDrawingAbsoluteCoordinates(drawing)
    widget.ChartDrawer.redrawDrawers()
  }

  History.add(
    'Drawing modified',
    withScroll(widget, () => reset(oldRatioCoor)),
    withScroll(widget, () => reset(newRatioCoor)),
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

export function recordDrawingVisibility(
  History: History,
  widget: Widget,
  isHidden: boolean,
) {
  History.add(
    isHidden ? 'Hide drawings' : 'Show drawings',
    withScroll(widget, () => widget.ChartDrawer.toggleVisibility(!isHidden)),
    withScroll(widget, () => widget.ChartDrawer.toggleVisibility(isHidden)),
  )
}

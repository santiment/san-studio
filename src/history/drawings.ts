import type { History, Scrollable } from 'webkit/ui/history'
import { withScroll } from 'webkit/ui/history'
import { resetDrawingAbsoluteCoordinates } from '@/Chart/Drawer/coordinates'

type Widget = Scrollable & { chart: SAN.Charts.Chart; ChartDrawer: any }

export function recordNewDrawing(
  History: History,
  ChartDrawer,
  widget: Widget,
  drawing: SAN.Charts.Drawing,
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
  drawing: SAN.Charts.Drawing,
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
  drawing: SAN.Charts.Drawing,
  oldRatioCoor: SAN.Charts.Drawing['absCoor'],
  data: any[],
) {
  const newRatioCoor = drawing.ratioCoor.slice()

  function reset(ratioCoor: SAN.Charts.Drawing['absCoor']) {
    if (drawing.type === 'emoji') {
      const emoji = drawing as any
      const { size } = emoji
      emoji.size = data[0]
      data[0] = size
    } else if (drawing.type === 'note' && data) {
      const note = drawing as any
      const { text, width, height } = note
      note.text = data[0]
      data[0] = text
      note.width = data[1]
      data[1] = width
      note.height = data[2]
      data[2] = height
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
  coordinates: SAN.Charts.Drawing['absCoor'],
  newCoordinates: SAN.Charts.Drawing['absCoor'],
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

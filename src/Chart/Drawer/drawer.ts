import { newCanvas } from 'san-chart'
import { paintDrawings } from './drawings'
import {
  resetAbsoluteCoordinates,
  setupDrawingsCoordinatesUpdater,
} from './coordinates'

export type MinMax = { min: number; max: number }

type Offset = {
  top: number
  right: number
  bottom: number
  left: number
}

export interface Drawing {
  type: 'line' | 'sticker'
  /** [chart x, chart y, ... x(i), y(i+1), ...] */
  absCoor: number[]
  /** [width/chart x, height/chart y, ... x(i), y(i+1), ...] */
  ratioCoor: number[]
  /** [datetime, metric's value, ... x(i), y(i+1), ...]] */
  relCoor: number[]
  handlers: Path2D[]
}

export type Drawer = {
  canvas: HTMLCanvasElement
  ctx: CanvasRenderingContext2D
  drawings: Drawing[]
  metricKey: string
  minMax: undefined | MinMax
  hovered: undefined | Drawing
  selected: undefined | Drawing
  redraw: () => void
  drawSelection: undefined | (() => void)
  updateAbsoluteByRelativeCoordinates: (
    relCoor: number[],
    absCoor: number[],
  ) => void
  updateRelativeByAbsoluteCoordinates: (
    absCoor: number[],
    relCoor: number[],
  ) => void
  addDrawing: (drawing: Drawing) => void
  deleteDrawing: (drawing: Drawing) => void
}

export type Chart = Offset & {
  canvas: HTMLCanvasElement
  drawer: Drawer
  dpr: number
  width: number
  height: number
  plotManager: any
  theme: any
  scale: any
  metricSettings: any
  axesMetricKeys: string[]
  minMaxes: { [metric: string]: undefined | MinMax }
  rightAxisMargin?: number
}

export const PLOT_ID = 'Drawer'

export function newDrawer(
  chart: Chart,
  onSelectionChange: (drawing?: Drawing) => void,
) {
  const drawer = newCanvas(chart) as Drawer
  const { canvas, plotManager } = chart

  const { parentNode, nextElementSibling } = canvas as any
  parentNode.insertBefore(drawer.canvas, nextElementSibling || canvas)

  drawer.updateRelativeByAbsoluteCoordinates = () => {}
  drawer.redraw = () => (paintDrawings(chart), drawer.drawSelection?.())
  chart.drawer = drawer
  plotManager.set(PLOT_ID, newDrawerUpdater(chart, onSelectionChange))

  return drawer
}

function newDrawerUpdater(
  { width, height }: Chart,
  onSelectionChange: (drawing?: Drawing) => void,
) {
  const oldWidthHeight = [width, height]
  let oldMetricKey: string

  return (chart: Chart) => {
    const { drawer, width, height, minMaxes } = chart
    const minMax = minMaxes[drawer.metricKey]
    if (!minMax) return

    const { min, max } = minMax
    const oldMinMax = drawer.minMax
    const isNewMinMax =
      Number.isFinite(min) &&
      Number.isFinite(max) &&
      (!oldMinMax || min !== oldMinMax.min || max !== oldMinMax.max)
    if (isNewMinMax) drawer.minMax = minMax

    if (!oldMinMax && minMax && drawer.selected && !drawer.drawSelection) {
      const { selected } = drawer
      drawer.selected = undefined
      onSelectionChange(selected)
    }

    const [oldWidth, oldHeight] = oldWidthHeight
    const isNewDimensions = oldWidth !== width || oldHeight !== height
    if (isNewDimensions) {
      oldWidthHeight[0] = width
      oldWidthHeight[1] = height
    }

    if (oldMetricKey !== drawer.metricKey) {
      oldMetricKey = drawer.metricKey
    }

    if (isNewMinMax || isNewDimensions) {
      setupDrawingsCoordinatesUpdater(chart, minMax)
      resetAbsoluteCoordinates(drawer)
    }

    drawer.redraw()
  }
}

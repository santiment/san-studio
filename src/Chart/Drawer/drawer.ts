import { newCanvas } from 'san-chart'
import { setupDrawings, paintDrawings } from './drawings'
import {
  updateCoordinates,
  resetRelativeCoordinates,
  correctAbsoluteCoordinatesRatio,
} from './coordinates'

export type MinMax = { min: number; max: number }

type Offset = {
  top: number
  right: number
  bottom: number
  left: number
}

export interface Drawing {
  type: undefined | 'line' | 'sticker'
  /** [chart x, chart y, ... x(i), y(i+1), ...] */
  absCoor: number[]
  /** [datetime, metric's value, ... x(i), y(i+1), ...]] */
  relCoor: number[]
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
  updateSelectionCoordinates:
    | undefined
    | ((absCoor: number[], relCoor: number[]) => void)
}

export type Chart = Offset & {
  canvas: HTMLCanvasElement
  drawer: Drawer
  dpr: number
  width: number
  height: number
  plotManager: any
  minMaxes: { [metric: string]: undefined | MinMax }
  rightAxisMargin?: number
}

export function newDrawer(chart: Chart) {
  const drawer = newCanvas(chart) as Drawer
  const { canvas, plotManager } = chart

  const { parentNode, nextElementSibling } = canvas as any
  parentNode.insertBefore(drawer.canvas, nextElementSibling || canvas)

  drawer.redraw = () => (paintDrawings(chart), drawer.drawSelection?.())
  chart.drawer = drawer
  plotManager.set('Drawer', newDrawerUpdater(drawer))

  return drawer
}

function newDrawerUpdater(drawer: Drawer) {
  const oldWidthHeight = [0, 0]
  let oldMetricKey: string

  return (chart: Chart) => {
    const { width, height, minMaxes } = chart
    const minMax = minMaxes[drawer.metricKey]
    if (!minMax) return

    const { min, max } = minMax
    const oldMinMax = drawer.minMax
    const isNewMinMax =
      !oldMinMax || min !== oldMinMax.min || max !== oldMinMax.max
    if (isNewMinMax) drawer.minMax = minMax

    const [oldWidth, oldHeight] = oldWidthHeight
    const isNewDimensions = oldWidth !== width || oldHeight !== height
    if (isNewDimensions) {
      correctAbsoluteCoordinatesRatio(
        drawer,
        width / oldWidth,
        height / oldHeight,
      )
      oldWidthHeight[0] = width
      oldWidthHeight[1] = height
    }

    if (oldMetricKey !== drawer.metricKey) {
      oldMetricKey = drawer.metricKey
      resetRelativeCoordinates(drawer)
    }

    if (isNewMinMax || isNewDimensions) {
      updateCoordinates(chart)
      setupDrawings(drawer)
    }

    drawer.redraw()
  }
}

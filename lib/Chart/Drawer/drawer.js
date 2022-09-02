import { newCanvas } from '@santiment-network/chart'
import { paintDrawings } from './drawings'
import {
  resetRatioCoordinates,
  resetRelativeCoordinates,
  resetAbsoluteCoordinates,
  setupDrawingsCoordinatesUpdater,
} from './coordinates'
export const PLOT_ID = 'Drawer'
export function newDrawer(chart, onSelectionChange) {
  const drawer = newCanvas(chart)
  const { canvas, plotManager } = chart
  if (process.browser) {
    const { parentNode, nextElementSibling } = canvas
    parentNode.insertBefore(drawer.canvas, nextElementSibling || canvas)
  }
  drawer.updateRelativeByAbsoluteCoordinates = () => {}
  drawer.redraw = () => {
    var _a
    return (
      paintDrawings(chart),
      (_a = drawer.drawSelection) === null || _a === void 0 ? void 0 : _a.call(drawer)
    )
  }
  chart.drawer = drawer
  plotManager.set(PLOT_ID, newDrawerUpdater(chart, onSelectionChange))
  chart.redraw()
  return drawer
}
function newDrawerUpdater({ width, height }, onSelectionChange) {
  const oldWidthHeight = [width, height]
  let oldMetricKey
  const checkIsNewDatetimes = newChangedDatetimesChecker()
  return (chart) => {
    const { drawer, width, height, minMaxes, data } = chart
    const minMax = minMaxes[drawer.metricKey]
    if (!minMax) return
    if (oldMetricKey !== drawer.metricKey) {
      oldMetricKey = drawer.metricKey
      resetRelativeCoordinates(drawer)
    }
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
    const isNewDatetimes = checkIsNewDatetimes(data)
    if (isNewMinMax || isNewDimensions || isNewDatetimes) {
      setupDrawingsCoordinatesUpdater(chart, minMax)
      resetRatioCoordinates(drawer)
      resetAbsoluteCoordinates(drawer)
    }
    drawer.redraw()
  }
}
function newChangedDatetimesChecker() {
  const datetimes = []
  return (data) => {
    const { length } = data
    if (!length) return false
    const left = data[0].datetime
    const right = data[length - 1].datetime
    if (left === datetimes[0] && right === datetimes[1]) return false
    datetimes[0] = left
    datetimes[1] = right
    return true
  }
}
//# sourceMappingURL=drawer.js.map

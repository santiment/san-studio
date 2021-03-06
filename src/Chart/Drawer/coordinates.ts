import { linearScale, valueByY } from 'san-chart/scales'
import { linearDatetimeScale } from '../utils'

type Scaler = (value: number) => number

function newDatetimeRelativeScaler(chart: SAN.Charts.Chart): Scaler {
  const { data, left, width } = chart as any
  const firstDatetime = data[0].datetime as number
  const lastDatetime = data[data.length - 1].datetime
  const factor = (lastDatetime - firstDatetime) / width

  return (x: number) => Math.round(factor * (x - left)) + firstDatetime
}

type Resetter = (drawing: SAN.Charts.Drawing) => any
const newCoordinatesResetter = (resetter: Resetter) => (drawer: SAN.Charts.Drawer) =>
  drawer.drawings.forEach(resetter)

export const resetDrawingRatioCoordinates = ({ ratioCoor, relCoor }) =>
  relCoor.length && (ratioCoor.length = 0)
export const resetRatioCoordinates = newCoordinatesResetter(resetDrawingRatioCoordinates)

export const resetDrawingRelativeCoordinates = ({ ratioCoor, relCoor }) =>
  ratioCoor.length && (relCoor.length = 0)
export const resetRelativeCoordinates = newCoordinatesResetter(resetDrawingRelativeCoordinates)

export const resetDrawingAbsoluteCoordinates = ({
  absCoor,
  relCoor,
  ratioCoor,
}: SAN.Charts.Drawing) => (relCoor.length || ratioCoor.length) && (absCoor.length = 0)
export const resetAbsoluteCoordinates = newCoordinatesResetter(resetDrawingAbsoluteCoordinates)

export function correctAbsoluteCoordinatesRatio(
  { drawings }: SAN.Charts.Drawer,
  width: number,
  height: number,
) {
  for (let i = 0, len = drawings.length; i < len; i++) {
    const { absCoor, ratioCoor } = drawings[i]
    for (let j = 0, coorLen = ratioCoor.length; j < coorLen; j += 2) {
      absCoor[j] *= ratioCoor[j] && ratioCoor[j] * width
      absCoor[j + 1] *= ratioCoor[j + 1] * height
    }
  }
}

export function setupDrawingsCoordinatesUpdater(
  chart: SAN.Charts.Chart,
  minMax: SAN.Charts.MinMax,
) {
  const { drawer } = chart

  drawer.updateAbsoluteByRelativeCoordinates = newRelativeToAbsoluteCoordinatesUpdater(
    chart,
    minMax,
  )
  drawer.updateRelativeByAbsoluteCoordinates = newAbsoluteToRelativeCoordinatesUpdater(
    chart,
    minMax,
  )
}

export function absoluteToRatioCoordinates(
  absCoor: number[],
  ratioCoor: number[],
  width: number,
  height: number,
) {
  for (let i = 0, len = absCoor.length; i < len; i += 2) {
    ratioCoor[i] = absCoor[i] && absCoor[i] / width
    ratioCoor[i + 1] = absCoor[i + 1] / height
  }
}
export function ratioToAbsoluteCoordinates(
  ratioCoor: number[],
  absCoor: number[],
  width: number,
  height: number,
) {
  for (let i = 0, len = ratioCoor.length; i < len; i += 2) {
    absCoor[i] = ratioCoor[i] && ratioCoor[i] * width
    absCoor[i + 1] = ratioCoor[i + 1] * height
  }
}

function relativeToAbsoluteCoordinates(
  relCoor: number[],
  absCoor: number[],
  scaleX: Scaler,
  scaleY: Scaler,
) {
  for (let i = 0, len = relCoor.length; i < len; i += 2) {
    absCoor[i] = relCoor[i] && scaleX(relCoor[i])
    absCoor[i + 1] = scaleY(relCoor[i + 1])
  }
}

function absoluteToRelativeCoordinates(
  absCoor: number[],
  relCoor: number[],
  scaleDatetime: Scaler,
  scaleValue: Scaler,
) {
  for (let i = 0, len = absCoor.length; i < len; i += 2) {
    relCoor[i] = absCoor[i] && scaleDatetime(absCoor[i])
    relCoor[i + 1] = scaleValue(absCoor[i + 1])
  }
}

export function newAbsoluteToRelativeCoordinatesUpdater(
  chart: SAN.Charts.Chart,
  { min, max }: SAN.Charts.MinMax,
) {
  const scaleDatetime = newDatetimeRelativeScaler(chart)
  const scaleValue = (y: number) => valueByY(chart, y, min, max)
  return (absCoor: number[], relCoor: number[]) =>
    absoluteToRelativeCoordinates(absCoor, relCoor, scaleDatetime, scaleValue)
}

export function newRelativeToAbsoluteCoordinatesUpdater(
  chart: SAN.Charts.Chart,
  { min, max }: SAN.Charts.MinMax,
) {
  const scaleX = linearDatetimeScale(chart)
  const scaleY = linearScale(chart, min, max)
  return (relCoor: number[], absCoor: number[]) =>
    relativeToAbsoluteCoordinates(relCoor, absCoor, scaleX, scaleY)
}

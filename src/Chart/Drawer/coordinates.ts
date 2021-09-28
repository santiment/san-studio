import type { Chart, Drawer, MinMax } from './drawer'
import { linearScale, valueByY } from 'san-chart/scales'
import { linearDatetimeScale } from '../utils'

type Scaler = (value: number) => number

function newDatetimeRelativeScaler(chart: Chart): Scaler {
  const { data, left, width } = chart as any
  const firstDatetime = data[0].datetime as number
  const lastDatetime = data[data.length - 1].datetime
  const factor = (lastDatetime - firstDatetime) / width

  return (x: number) => Math.round(factor * (x - left)) + firstDatetime
}

export function resetRelativeCoordinates(drawer: Drawer) {
  drawer.drawings.forEach(({ absCoor, relCoor }) => {
    if (absCoor.length) relCoor.length = 0
  })
}
export function resetAbsoluteCoordinates(drawer: Drawer) {
  drawer.drawings.forEach(({ absCoor, relCoor }) => {
    if (relCoor.length) absCoor.length = 0
  })
}
export function correctAbsoluteCoordinatesRatio(
  { drawings }: Drawer,
  xRatio: number,
  yRatio: number,
) {
  for (let i = 0, len = drawings.length; i < len; i++) {
    const { absCoor } = drawings[i]
    for (let j = 0, coorLen = absCoor.length; j < coorLen; j += 2) {
      if (xRatio) absCoor[j] *= xRatio
      if (yRatio) absCoor[j + 1] *= yRatio
    }
  }
}

export function updateDrawingsCoordinates(chart: Chart) {
  const { drawer } = chart
  const { minMax, drawings } = drawer

  if (!minMax) return

  const relToAbsCoordinates = newRelativeToAbsoluteCoordinatesUpdater(
    chart,
    minMax,
  )
  const absToRelCoordinates = newAbsoluteToRelativeCoordinatesUpdater(
    chart,
    minMax,
  )

  drawer.updateRelativeByAbsoluteCoordinates = absToRelCoordinates

  for (let i = 0, len = drawings.length; i < len; i++) {
    const drawing = drawings[i]
    const { relCoor, absCoor } = drawing

    if (relCoor.length) {
      relToAbsCoordinates(relCoor, absCoor)
    } else {
      absToRelCoordinates(absCoor, relCoor)
    }
  }
}

function relativeToAbsoluteCoordinates(
  relCoor: number[],
  absCoor: number[],
  scaleX: Scaler,
  scaleY: Scaler,
) {
  for (let i = 0, len = relCoor.length; i < len; i += 2) {
    absCoor[i] = scaleX(relCoor[i])
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
    relCoor[i] = scaleDatetime(absCoor[i])
    relCoor[i + 1] = scaleValue(absCoor[i + 1])
  }
}

export function newAbsoluteToRelativeCoordinatesUpdater(
  chart: Chart,
  { min, max }: MinMax,
) {
  const scaleDatetime = newDatetimeRelativeScaler(chart)
  const scaleValue = (y: number) => valueByY(chart, y, min, max)
  return (absCoor: number[], relCoor: number[]) =>
    absoluteToRelativeCoordinates(absCoor, relCoor, scaleDatetime, scaleValue)
}

export function newRelativeToAbsoluteCoordinatesUpdater(
  chart: Chart,
  { min, max }: MinMax,
) {
  const scaleX = linearDatetimeScale(chart)
  const scaleY = linearScale(chart, min, max)
  return (relCoor: number[], absCoor: number[]) =>
    relativeToAbsoluteCoordinates(relCoor, absCoor, scaleX, scaleY)
}

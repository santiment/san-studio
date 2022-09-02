export function getBrushPlotItems({ items }) {
  const brushItems = new Map(items)
  brushItems.delete('cartesianGrid')
  brushItems.delete('axes')
  brushItems.delete('watermark')
  brushItems.delete('lastDayPrice')
  brushItems.delete('Drawer')
  brushItems.delete('candles')
  brushItems.delete('referenceDots')
  brushItems.delete('spent_coin_cost')
  return brushItems
}
export function setViewedIndicis(brush, data, from, to) {
  const { length } = data
  if (length === 0) return false
  const lastIndex = length - 1
  let { startIndex = 0, endIndex = lastIndex } = brush
  const { datetime: startTimestamp } = data[0]
  const { datetime: endTimestamp } = data[lastIndex]
  const fromTimestamp = +new Date(from)
  const toTimestamp = +new Date(to)
  const scale = length / (endTimestamp - startTimestamp)
  if (!data[startIndex] || fromTimestamp !== data[startIndex].datetime) {
    startIndex = Math.trunc(scale * (fromTimestamp - startTimestamp))
  }
  if (!data[endIndex] || toTimestamp !== data[endIndex].datetime) {
    endIndex = Math.trunc(scale * (toTimestamp - startTimestamp))
  }
  startIndex = startIndex > 0 ? (startIndex < length ? startIndex : lastIndex) : 0
  endIndex = endIndex > 0 ? (endIndex < length ? endIndex : lastIndex) : 0
  if (endIndex - startIndex < 2) {
    if (startIndex > 2) {
      startIndex -= 2
    } else {
      endIndex += 2
    }
  }
  brush.startIndex = startIndex
  brush.endIndex = endIndex
  return true
}
//# sourceMappingURL=utils.js.map

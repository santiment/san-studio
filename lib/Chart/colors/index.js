export const MetricColor = {
  price_usd: '#26C953',
  volume_usd: '#D2D6E7',
  social_volume_total: '#68DBF4',
  dev_activity: '#8358FF',
  mvrv_usd: '#FFAD4D',
  daily_active_addresses: '#FFAD4D',
}
export const COLORS = [
  '#FF5B5B',
  '#FFCB47',
  '#5275FF',
  '#FF8450',
  '#F47BF7',
  '#785549',
  '#D4E763',
  '#FFDAC5',
  '#37D7BA',
  '#777777',
  '#AC948C',
  '#222222',
  '#14c393',
  '#7a859e',
  '#174d4a',
  '#ffe7ca',
  '#efa7a7',
  '#dcf6ef',
  '#3b3130',
  '#c9c2ff', // heliotrope-light-2
]
const COLORS_SET = new Set(COLORS)
export const ALL_COLORS = new Set(COLORS.concat(Object.values(MetricColor)))
const ALPHA_CHANNEL = '29'
function getUnusedColors(usedColors) {
  const unusedColorsSet = new Set(COLORS_SET)
  usedColors.forEach((color) => unusedColorsSet.delete(color))
  return [...unusedColorsSet]
}
const PREV_COLORS = {}
export function newChartColors(metrics, prevColors = PREV_COLORS) {
  const colors = {}
  const uncoloredKeys = []
  let freeColorIndex = 0
  for (let i = 0; i < metrics.length; i++) {
    const { key } = metrics[i]
    const prevColor = prevColors[key]
    if (prevColor) {
      colors[key] = prevColor
    } else {
      uncoloredKeys.push(key)
    }
  }
  const unusedColors = getUnusedColors(Object.values(colors))
  for (let i = 0; i < uncoloredKeys.length; i++) {
    const key = uncoloredKeys[i]
    colors[key] = MetricColor[key] || unusedColors[freeColorIndex++]
  }
  return colors
}
export function newHighlightedColors(colors, { key }) {
  const newColors = Object.assign({}, colors)
  Object.keys(newColors).forEach((metricKey) => {
    if (metricKey !== key) newColors[metricKey] += ALPHA_CHANNEL
  })
  return newColors
}
//# sourceMappingURL=index.js.map

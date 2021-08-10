export const MetricColor = {
  price_usd: '#26C953', //GREEN,
  volume_usd: '#D2D6E7', //GRAY,
  social_volume_total: '#68DBF4', //CYAN,
  dev_activity: '#8358FF', //VIOLET,
  mvrv_usd: '#FFAD4D',
  daily_active_addresses: '#FFAD4D',
}

export const COLORS = [
  '#F47BF7', // PURPLE
  '#FF5B5B', // RED
  '#FFCB47', // YELLOW
  '#5275FF', // BLUE
  '#FF8450', // SALMON
  '#785549', // BROWN
  '#D4E763', // YELLOW-GREEN
  '#FFDAC5', // PEACH
  '#37D7BA', // AQUAMARINE
  '#777777', // GREY
  '#AC948C', // BROWN-GRAY
  '#222222', // BLACK

  '#14c393', // jungle-green,
  '#7a859e', // waterloo
  '#174d4a', // jungle-green-dark-3
  '#ffe7ca', // texas-rose-light-2
  '#efa7a7', // persimmon-light-2
  '#dcf6ef', // jungle-green-light-2,
  '#3b3130', // texas-rose-dark,
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
export function newChartColors(
  metrics: any[],
  prevColors = PREV_COLORS,
): { [key: string]: string } {
  const colors = {}
  const uncoloredKeys = [] as any[]
  let freeColorIndex = 0

  for (let i = 0; i < metrics.length; i++) {
    const { key, color } = metrics[i]
    const prevColor = prevColors[key] || color
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

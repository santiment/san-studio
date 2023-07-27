const LineNode = {
  LINE: 'line',
  FILLED_LINE: 'filledLine',
  GRADIENT_LINE: 'gradientLine',
  AREA: 'area',
} as const

const BarNode = {
  BAR: 'bar',
  GREEN_RED_BAR: 'greenRedBar',
} as const

export const Node = Object.assign({ CANDLES: 'candle' } as const, LineNode, BarNode)
export const LINES = new Set(Object.values(LineNode))
export const BARS = new Set(Object.values(BarNode))

export type ChartNode = typeof Node
export type ChartNodes = ChartNode[keyof ChartNode]

export const NodeAlias = {
  autoWidthBar: BarNode.BAR,
}

export type MetricNodes = {
  joinedCategories: string[]
  candles: string[]
  lines: string[]
  bars: string[]
  areas: string[]
  filledLines: string[]
  gradientLines: string[]
  greenRedBars: string[]
}

export function getMetricNodes(
  metrics: Studio.Metric[],
  MetricSettings: Studio.MetricSettings,
): MetricNodes {
  const joinedCategories = new Array(metrics.length)
  const MetricNodes = {
    joinedCategories,
    candles: [],
    lines: [],
    bars: [],
    areas: [],
    filledLines: [],
    gradientLines: [],
    greenRedBars: [],
  }
  for (let i = 0; i < metrics.length; i++) {
    const { key, node } = metrics[i]
    joinedCategories[i] = key
    const metricNode = MetricSettings[key]?.node || node
    MetricNodes[(NodeAlias[metricNode] || metricNode) + 's']?.push(key)
  }
  return MetricNodes
}

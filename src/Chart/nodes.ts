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

export const Node = Object.assign(
  { CANDLES: 'candle' } as const,
  LineNode,
  BarNode,
)
export const LINES = new Set(Object.values(LineNode))
export const BARS = new Set(Object.values(BarNode))

export type ChartNode = typeof Node
export type ChartNodes = ChartNode[keyof ChartNode]

export const NodeAlias = {
  autoWidthBar: BarNode.BAR,
}

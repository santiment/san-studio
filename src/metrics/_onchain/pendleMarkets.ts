import { Node } from '@/Chart/nodes'
import { each } from '../utils'

export const PendleMarketsMetric = each(
  {
    pendle_total_markets_tvl: {
      label: 'Pendle Total Markets TVL',
      node: Node.LINE,
    },
    pendle_underlying_apy: {
      label: 'Pendle Underlying APY',
      node: Node.LINE,
    },
    pendle_implied_apy: {
      label: 'Pendle Implied APY',
      node: Node.LINE,
    },
    pendle_yield_spread: {
      label: 'Pendle Yield Spread',
      node: Node.LINE,
    },
  },
  (metric: Studio.Metric) => {
    metric.group = 'Pendle Markets'
  },
)

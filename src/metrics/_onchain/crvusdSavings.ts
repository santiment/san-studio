import { Node } from '@/Chart/nodes'
import { each } from '../utils'

export const CrvUSDSavingsMetric = each(
  {
    crvusd_savings_total_supplied: {
      label: 'crvUSD Savings Total Supplied',
      node: Node.LINE,
    },
    crvusd_savings_distributions: {
      label: 'crvUSD Savings Distributions',
      node: 'bar',
    },
    crvusd_savings_apy: {
      label: 'crvUSD Savings APY',
      node: Node.LINE,
    },
  },
  (metric: Studio.Metric) => {
    metric.group = 'crvUSD Savings'
    metric.node = metric.node || Node.BAR
  },
)

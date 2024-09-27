import { Node } from '@/Chart/nodes'
import { each } from '../utils'

export const SkySavingsMetric = each(
  {
    sky_savings_deposits: {
      label: 'Sky Savings Deposits',
      node: 'bar',
    },
    sky_savings_withdrawals: {
      label: 'Sky Savings Withdrawals',
      node: 'bar',
    },
    sky_savings_total_supplied: {
      label: 'Sky Savings Total Supplied',
    },
  },
  (metric: Studio.Metric) => {
    metric.group = 'Sky Savings'
    metric.node = metric.node || Node.BAR
  },
)

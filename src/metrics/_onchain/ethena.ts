import { Node } from '@/Chart/nodes'
import { each } from '../utils'

export const EthenaMetric = each(
  {
    ethena_staking_deposits: {
      label: 'Ethena Staking Deposits',
      node: 'bar',
    },
    ethena_staking_withdrawals: {
      label: 'Ethena Staking Withdrawals',
      node: 'bar',
    },
    ethena_staking_apy: {
      label: 'Ethena Staking APY',
    },
  },
  (metric: Studio.Metric) => {
    metric.group = 'Ethena Staking'
    metric.node = metric.node || Node.BAR
  },
)

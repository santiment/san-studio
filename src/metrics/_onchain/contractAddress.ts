import { Node } from '@/Chart/nodes'
import { each } from '../utils'

export const ContractAddressMetric = each(
  {
    contract_transactions_count: {
      label: 'Contract Transactions Count',
    },
    contract_interacting_addresses_count: {
      label: 'Contract Interacting Addresses Count',
    },
  },

  (metric: Studio.Metric) => {
    metric.node = Node.BAR
  },
)

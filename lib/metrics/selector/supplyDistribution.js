import { each } from './../../../lib/metrics/utils'
import { MetricCategory, MetricGroup } from './../../../lib/metrics/graph'
import { SelectorType } from './types'
export const SupplyDistributionNode = each(
  {
    // holder_distribution
    addresses_number_distribution: {
      label: 'By number of addresses',
      shorthand: 'hd',
      selectorType: SelectorType.Widget,
    },
    // holder_distribution_combined_balance
    addresses_balance_distribution: {
      label: 'By balance of addresses',
      shorthand: 'hdcb',
      selectorType: SelectorType.Widget,
    },
    // holder_labeled_distribution
    labeled_addresses_number_distribution: {
      label: 'By number of addresses (labeled)',
      shorthand: 'hdl',
      selectorType: SelectorType.Widget,
    },
  },
  (node, key) => {
    node.key = key
    node.group = MetricGroup.SupplyDistribution
    node.category = MetricCategory.OnChain
  },
)
//# sourceMappingURL=supplyDistribution.js.map

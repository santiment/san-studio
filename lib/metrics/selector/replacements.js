import { Metric } from './../../../lib/metrics'
import { HolderDistributionMetric } from './../../../lib/metrics/_onchain/holderDistributions'
import { ExchangesV2Metric } from './../../../lib/metrics/_onchain/exchangesV2'
import {
  PriceDAADivergenceNode,
  AdjustedPriceDAADivergenceNode,
} from './../../../lib/PriceDAAWidget/nodes'
import { SupplyDistributionNode } from './supplyDistribution'
export const ReplacementNode = {
  [Metric.holders_distribution_1_to_10.key]: SupplyDistributionNode.addresses_number_distribution,
  [Metric.holders_distribution_combined_balance_1_to_10.key]:
    SupplyDistributionNode.addresses_balance_distribution,
  [Metric.holders_labeled_distribution_1_to_10.key]:
    SupplyDistributionNode.labeled_addresses_number_distribution,
  [Metric.price_daa_divergence.key]: PriceDAADivergenceNode,
  [Metric.adjusted_price_daa_divergence.key]: AdjustedPriceDAADivergenceNode,
  [ExchangesV2Metric.labelled_historical_balance.key]: Object.values(ExchangesV2Metric).slice(1),
}
function replace(SelectorNode, key) {
  const replacement = ReplacementNode[key]
  if (replacement) SelectorNode[replacement.key] = replacement
  return replacement ? true : false
}
export function lookupReplacement(SelectorNode, key) {
  if (replace(SelectorNode, key)) return true
  // NOTE: Hiding all Holder-Distribution metrics in sidebar [@vanguard | May  2, 2021]
  if (HolderDistributionMetric[key]) return true
  return false
}
//# sourceMappingURL=replacements.js.map

import type { Selector } from './index'
import { Metric } from '@/metrics'
import { HolderDistributionMetric } from '@/metrics/_onchain/holderDistributions'
import { SupplyDistributionNode } from './supplyDistribution'

export const ReplacementNode = {
  [Metric.holders_distribution_1_to_10.key]:
    SupplyDistributionNode.addresses_number_distribution,
  [Metric.holders_distribution_combined_balance_1_to_10.key]:
    SupplyDistributionNode.addresses_balance_distribution,
  [Metric.holders_labeled_distribution_1_to_10.key]:
    SupplyDistributionNode.labeled_addresses_number_distribution,
} as const

function replace(SelectorNode: Selector, key: string): boolean {
  const replacement = ReplacementNode[key]
  if (replacement) SelectorNode[replacement.key] = replacement
  return replacement ? true : false
}

export function lookupReplacement(
  SelectorNode: Selector,
  key: string,
): boolean {
  if (replace(SelectorNode, key)) return true

  // NOTE: Hiding all Holder-Distribution metrics in sidebar [@vanguard | May  2, 2021]
  if (HolderDistributionMetric[key]) return true

  return false
}

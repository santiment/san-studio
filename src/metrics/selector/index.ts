import type { SelectorNode as SelectorNodeType } from '@/metrics/graph'
import type { HolderDistributionMetric } from '@/metrics/_onchain/holderDistributions'
import type { SupplyDistributionNode } from './supplyDistribution'
import { Metric } from '@/metrics'
import { each } from '@/metrics/utils'
import { lookupReplacement } from './replacements'

type Extend<T, U> = T & U extends never ? T | U : never
type MetricKeys = keyof typeof Metric
type HolderDistributionKeys = keyof typeof HolderDistributionMetric
type SidebarNodeKeys = Extend<
  Exclude<MetricKeys, HolderDistributionKeys>,
  keyof typeof SupplyDistributionNode
>

export type Selector = SidebarNodeKeys extends never
  ? // ? never
    any
  : { [K in SidebarNodeKeys]: SelectorNodeType }

// export const SelectorNode = {} as Selector
export const SelectorNode = {} as any
each(Metric, (metric: Studio.Metric, key) => {
  if (lookupReplacement(SelectorNode as any, key)) return

  SelectorNode[key] = metric as any
})

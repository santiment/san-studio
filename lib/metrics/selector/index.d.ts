import type { SelectorNode as SelectorNodeType } from './../../metrics/graph';
import type { HolderDistributionMetric } from './../../metrics/_onchain/holderDistributions';
import type { SupplyDistributionNode } from './supplyDistribution';
import { Metric } from './../../metrics';
type Extend<T, U> = T & U extends never ? T | U : never;
type MetricKeys = keyof typeof Metric;
type HolderDistributionKeys = keyof typeof HolderDistributionMetric;
type SidebarNodeKeys = Extend<Exclude<MetricKeys, HolderDistributionKeys>, keyof typeof SupplyDistributionNode>;
export type Selector = SidebarNodeKeys extends never ? any : {
    [K in SidebarNodeKeys]: SelectorNodeType;
};
export declare const SelectorNode: any;
export {};

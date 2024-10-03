import type { SelectorNode as SelectorNodeType } from './../../metrics/graph';
import type { HolderDistributionMetric } from './../../metrics/_onchain/holderDistributions';
import type { SupplyDistributionNode } from './supplyDistribution';
import { Metric } from './../../metrics';
declare type Extend<T, U> = T & U extends never ? T | U : never;
declare type MetricKeys = keyof typeof Metric;
declare type HolderDistributionKeys = keyof typeof HolderDistributionMetric;
declare type SidebarNodeKeys = Extend<Exclude<MetricKeys, HolderDistributionKeys>, keyof typeof SupplyDistributionNode>;
export declare type Selector = SidebarNodeKeys extends never ? any : {
    [K in SidebarNodeKeys]: SelectorNodeType;
};
export declare const SelectorNode: any;
export {};

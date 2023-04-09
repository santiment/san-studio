import type { CachePolicy } from 'san-webkit/lib/api/cache';
import { percentFormatter } from './../metrics/formatters';
import { MetricType } from './../metrics/utils';
export declare const MERGED_DIVIDER = "__MM__";
export declare const checkIfWasNotMerged: (newKey: string, mergedMetrics: any[]) => boolean;
export declare function buildMergedMetric(baseMetrics: any[]): {
    fetch: typeof fetch;
    baseMetrics: any[];
    formatter: string | typeof percentFormatter;
    axisFormatter: string | typeof percentFormatter;
    node: string;
    key: string;
    label: string;
    __type: MetricType;
};
declare function fetch(variables: any, metric: Studio.HolderDistributionMetric, cachePolicy?: CachePolicy): Promise<any>;
export {};

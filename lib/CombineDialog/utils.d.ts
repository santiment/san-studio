import type { CachePolicy } from 'san-webkit/lib/api/cache';
export declare function importMath(): Promise<any>;
export declare function checkIsExpressionValid(metrics: any[], expression: string): boolean;
export declare function updateCombineKey(metric: any): void;
export declare function newExpessionMetric(baseMetrics: Studio.Metric[], expression: string, label: string): {
    fetch: typeof fetch;
    label: string;
    expression: string;
    baseMetrics: Studio.Metric[];
    node: string;
    key: string;
};
declare function fetch(variables: any, metric: any, cachePolicy?: CachePolicy): Promise<any[]>;
export {};

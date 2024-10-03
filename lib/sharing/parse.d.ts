import type { Metric as BaseMetricType } from './index';
export declare type KeyToMetric = {
    [metricKey: string]: BaseMetricType;
};
export declare function parse(queryString: string): {};
export declare function parseArray(value?: string, isArrayOfObjects?: boolean): string[];
export declare function parseMetrics(metricKeys: undefined | string[], KnownMetric: KeyToMetric): BaseMetricType[];
export declare function parseCombinedMetrics(metrics: undefined | {
    k: string;
    exp: string;
    l: string;
    bm: string[];
}[], KnownMetric: KeyToMetric): any[];
export declare function parseIndicators(metrics: any[]): {
    [metricKey: string]: Set<string>;
};
export declare function parseMergedMetrics(metrics: any[]): any[];
export declare function parseMetricGraphValue(values: undefined | any[], metrics: any[]): {};
export declare function parseAxesMetrics(metricIds: undefined | string[], metrics: any[]): {
    axesMetrics: Set<Studio.Metric>;
    disabledAxesMetrics: Set<any>;
} | undefined;
export declare function parsePinnedAxesMetrics(metricIds: undefined | string[], metrics: any[]): Set<any> | undefined;

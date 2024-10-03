import { MetricType } from './../metrics/utils';
export declare function shareMetrics(metrics: Studio.Metric[]): string[];
export declare function parseMetric(key: string | TupleData[]): any | undefined;
declare type TupleData = string | string[];
export declare function parseMetricKey(key: string): TupleData[];
export declare function getTupleData(args: string[], cursor?: {
    i: number;
}): TupleData[];
export declare function getMetricKeyData(key: string): TupleData[] | (string | MetricType)[];
export {};

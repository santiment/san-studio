/// <reference types="./api" />
import type { Variables } from './queries';
import type { CachePolicy } from 'san-webkit/lib/api/cache';
export declare const dataAccessor: ({ getMetric }: {
    getMetric: any;
}) => any;
export declare function getTimeseries(metrics: Studio.Metric[], variables: Omit<Variables, 'key'>, onData: (data: any[], loadings: Set<Studio.Metric>) => any, onError: (errors: Map<Studio.Metric, string>, loadings: Set<Studio.Metric>, data?: any[]) => any, MetricSettings?: any, cachePolicy?: CachePolicy, requestOptions?: SAN.API.RequestOptions): () => any;
export declare const CRYPTO_ERA_START_DATE = "2009-01-01T01:00:00.000Z";
export declare function getAllTimeData(metrics: Studio.Metric[], selector: {
    [key: string]: string;
}, onData: any, onError: any): () => any;

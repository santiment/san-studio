/// <reference types="svelte" />
export declare type Indicators = Set<{
    key: string;
}>;
export declare type MetricIndicators = {
    [metricKey: string]: Indicators | undefined;
};
export declare function newMetricIndicatorsStore(defaultValue?: MetricIndicators): {
    subscribe: (this: void, run: import("svelte/store").Subscriber<MetricIndicators>, invalidate?: import("svelte/store").Invalidator<MetricIndicators> | undefined) => import("svelte/store").Unsubscriber;
    new(metricKey: string): Set<{
        key: string;
    }>;
    get(metricKey: string): Indicators;
    delete(metricKey: string, indicator: any): void;
    toggle(metricKey: string, indicator: any): void;
    update(metrics: Studio.Metric[]): void;
};
declare global {
    const $MetricIndicators: {};
}

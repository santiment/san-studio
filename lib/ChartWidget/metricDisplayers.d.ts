import type { addCandlesTooltipPrintable } from '@santiment-network/chart/candles';
export declare type ChartMetricDisplayStore = ReturnType<typeof newMetricDisplayersStore>;
export declare type MetricDisplayer = {
    formatter?: any;
    axisFormatter?: any;
    metricPrintablePusher?: typeof addCandlesTooltipPrintable;
};
export declare type MetricDisplayers = {
    [metricKey: string]: MetricDisplayer | undefined;
};
export declare function newMetricDisplayersStore(): {
    subscribe: (this: void, run: import("svelte/store").Subscriber<{}>, invalidate?: ((value?: {} | undefined) => void) | undefined) => import("svelte/store").Unsubscriber;
    get(metricKey: string): any;
    set(metricKey: string, displays: MetricDisplayer): void;
    delete(metricKey: string, displayKey: string): void;
    update(metrics: Studio.Metric[]): void;
};

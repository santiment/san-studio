/// <reference types="svelte" />
import type { addCandlesTooltipPrintable } from '@santiment-network/chart/candles';
export type ChartMetricDisplayStore = ReturnType<typeof newMetricDisplayersStore>;
export type MetricDisplayer = {
    formatter?: any;
    axisFormatter?: any;
    metricPrintablePusher?: typeof addCandlesTooltipPrintable;
};
export type MetricDisplayers = {
    [metricKey: string]: MetricDisplayer | undefined;
};
export declare function newMetricDisplayersStore(): {
    subscribe: (this: void, run: import("svelte/store").Subscriber<{}>, invalidate?: import("svelte/store").Invalidator<{}> | undefined) => import("svelte/store").Unsubscriber;
    get(metricKey: string): any;
    set(metricKey: string, displays: MetricDisplayer): void;
    delete(metricKey: string, displayKey: string): void;
    update(metrics: Studio.Metric[]): void;
};

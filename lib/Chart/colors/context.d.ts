/// <reference types="svelte" />
export declare type ChartColorsStore = ReturnType<typeof newChartColorsStore>;
export declare type ChartColors = {
    [metricKey: string]: string;
};
export declare function newChartColorsStore(defaultValue?: ChartColors): {
    subscribe: (this: void, run: import("svelte/store").Subscriber<ChartColors>, invalidate?: import("svelte/store").Invalidator<ChartColors> | undefined) => import("svelte/store").Unsubscriber;
    get: () => ChartColors;
    set(metricKey: string, color: string): void;
    update(metrics: Studio.Metric[]): void;
    replace(oldMetricKey: string, newMetricKey: string): void;
};

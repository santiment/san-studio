/// <reference types="svelte" />
export declare type MetricsStore = ReturnType<typeof newChartAddonsStore>;
export declare function newChartAddonsStore(defaultMetrics?: any[]): {
    subscribe: (this: void, run: import("svelte/store").Subscriber<any[]>, invalidate?: import("svelte/store").Invalidator<any[]> | undefined) => import("svelte/store").Unsubscriber;
    getValue(): any[];
    set(newAddons: Studio.Metric[]): void;
    add(addon: Studio.Metric): void;
    delete(addon: Studio.Metric): void;
    toggle(addon: Studio.Metric): void;
    concat(newAddons: Studio.Metric[]): void;
};

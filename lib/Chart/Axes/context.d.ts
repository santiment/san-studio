/// <reference types="svelte" />
export type ChartAxesStore = ReturnType<typeof newChartAxesStore>;
export declare function newChartAxesStore(defaultEnabled?: Set<Studio.Metric>, defaultDisabled?: Set<Studio.Metric>): {
    subscribe: (this: void, run: import("svelte/store").Subscriber<Set<Studio.Metric>>, invalidate?: import("svelte/store").Invalidator<Set<Studio.Metric>> | undefined) => import("svelte/store").Unsubscriber;
    delete(metric: Studio.Metric): void;
    toggle(metric: Studio.Metric): void;
    updateMetrics(metrics: Studio.Metric[], exceptionsMap: Map<Studio.Metric, string>, domainGroups?: string[][]): void;
};
export declare function newPinnedChartAxesStore(defaults?: Set<Studio.Metric>): {
    subscribe: (this: void, run: import("svelte/store").Subscriber<Set<Studio.Metric>>, invalidate?: import("svelte/store").Invalidator<Set<Studio.Metric>> | undefined) => import("svelte/store").Unsubscriber;
    has(metric: any): boolean;
    toggle(metric: any): void;
    add(metric: any): void;
    delete(metric: any): void;
};

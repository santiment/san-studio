/// <reference types="svelte" />
export declare const favoriteMetrics: {
    subscribe: (this: void, run: import("svelte/store").Subscriber<Set<string>>, invalidate?: import("svelte/store").Invalidator<Set<string>> | undefined) => import("svelte/store").Unsubscriber;
    update: (this: void, updater: import("svelte/store").Updater<Set<string>>) => void;
    toggle(metricKey: string): void;
};
declare global {
    const $favoriteMetrics: Set<string>;
}

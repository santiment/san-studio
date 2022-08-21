export declare const favoriteMetrics: {
    subscribe: (this: void, run: import("svelte/store").Subscriber<Set<string>>, invalidate?: ((value?: Set<string> | undefined) => void) | undefined) => import("svelte/store").Unsubscriber;
    update: (this: void, updater: import("svelte/store").Updater<Set<string>>) => void;
    toggle(metricKey: string): void;
};
declare global {
    const $favoriteMetrics: Set<string>;
}
